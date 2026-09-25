from datetime import datetime, timezone, timedelta
from uuid import uuid4
import math, networkx as nx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import *
from ..schemas import *
from ..auth import get_current_authority_user, verify_password, create_access_token
from ..scoring import priority_score, route_edge_cost
from ..websocket_manager import manager
from ..storm_replay import list_storms, get_storm, intensity_at
from ..models import RainGauge
from ..gauges import readings_for_ward
from ..nowcast import predict_nowcast
from ..cause_engine import classify_cause

router=APIRouter(prefix="/api")
def obj(model): return model
def audit(db,user,action,kind,id,metadata=None): db.add(AuditEvent(actor=user.username if user else "system",action=action,entity_type=kind,entity_id=str(id),metadata_json=metadata or {}))

@router.post("/auth/login")
def login(body:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    u=db.query(AuthorityUser).filter_by(username=body.username).first()
    if not u or not verify_password(body.password,u.hashed_password): raise HTTPException(401,"Invalid username or password")
    return {"access_token":create_access_token(u),"token_type":"bearer","user":{"username":u.username,"full_name":u.full_name,"role":u.role,"ward_id":u.ward_id}}
@router.get("/auth/me")
def me(u=Depends(get_current_authority_user)): return {"username":u.username,"full_name":u.full_name,"role":u.role,"ward_id":u.ward_id}

@router.get("/wards",response_model=list[WardRead])
def wards(db:Session=Depends(get_db)): return db.query(Ward).all()
@router.get("/wards/{id}",response_model=WardRead)
def ward(id:str,db:Session=Depends(get_db)):
    x=db.get(Ward,id)
    if not x: raise HTTPException(404,"Ward not found")
    return x
@router.get("/roads")
def roads(db:Session=Depends(get_db)):
    out=[]
    for r in db.query(RoadSegment).all():
        row={c.name:getattr(r,c.name) for c in r.__table__.columns};row["cause"]=classify_cause(r);out.append(row)
    return out
@router.get("/roads/{id}/status")
def road_status(id:str,db:Session=Depends(get_db)):
    x=db.get(RoadSegment,id)
    if not x: raise HTTPException(404,"Road not found")
    return {"id":x.id,"status":x.status,"risk_level":x.risk_level,"current_depth_cm":x.current_depth_cm,"cause":classify_cause(x)}
@router.get("/roads/{id}/cause-explanation")
def road_cause(id:str,db:Session=Depends(get_db)):
    x=db.get(RoadSegment,id)
    if not x: raise HTTPException(404,"Road not found")
    return {"road_id":id,"status":x.status,**classify_cause(x)}
@router.patch("/roads/{id}/status")
def patch_road(id:str,status:str=Query(...,pattern="^(open|restricted|flooded|closed)$"),db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    x=db.get(RoadSegment,id)
    if not x: raise HTTPException(404,"Road not found")
    old=x.status;x.status=status;audit(db,u,"road_status_changed","road",id,{"from":old,"to":status});db.commit()
    return x
@router.get("/scenario/current",response_model=ScenarioRead)
def scenario(db:Session=Depends(get_db)): return db.get(ScenarioState,1)
@router.get("/scenario/storm-events")
def storm_events(): return list_storms()
@router.post("/scenario/activate")
def activate(storm_event_id:str|None=Query(default=None),db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    s=db.get(ScenarioState,1); chosen=storm_event_id or s.storm_event_id or "storm-mumbai-typical"
    if not get_storm(chosen): raise HTTPException(422,"Unknown storm_event_id")
    s.storm_event_id=chosen;s.current_step=0;s.is_active=True;s.started_at=datetime.now(timezone.utc);audit(db,u,"scenario_activated","scenario",1,{"storm_event_id":chosen});db.commit();return s
@router.post("/scenario/reset")
def reset(db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    s=db.get(ScenarioState,1);s.is_active=False;s.current_step=0;s.rainfall_intensity_mmhr=18
    for w in db.query(Ward): w.current_water_cm=w.baseline_water_cm;w.risk_level=w.baseline_risk
    for w in db.query(Ward): w.rain_rate_mmhr=w.baseline_rain_rate_mmhr
    for r in db.query(RoadSegment): r.status=r.baseline_status;r.current_depth_cm=r.baseline_depth_cm;r.previous_depth_cm=r.baseline_depth_cm;r.surcharge_ticks=0;r.current_inflow_lps=0;r.current_outflow_lps=0
    audit(db,u,"scenario_reset","scenario",1);db.commit();return s
@router.post("/reports",response_model=ReportRead,status_code=201)
async def report(body:ReportCreate,db:Session=Depends(get_db)):
    if not db.get(Ward,body.ward_id): raise HTTPException(422,"Unknown ward_id")
    x=Report(id=f"FLD-{uuid4().hex[:6].upper()}",**body.model_dump(),submitted_at=datetime.now(timezone.utc),status="submitted")
    db.add(x);db.commit();db.refresh(x);await manager.broadcast({"type":"report_update","report_id":x.id,"status":x.status});return x
@router.get("/reports",response_model=list[ReportRead])
def reports(status:str|None=None,db:Session=Depends(get_db)):
    q=db.query(Report)
    if status:q=q.filter_by(status=status)
    return q.order_by(desc(Report.submitted_at)).all()
@router.get("/reports/{id}",response_model=ReportRead)
def report_by_id(id:str,db:Session=Depends(get_db)):
    x=db.get(Report,id)
    if not x:raise HTTPException(404,"Report not found")
    return x
@router.patch("/reports/{id}/verify",response_model=ReportRead)
async def verify_report(id:str,body:VerifyRequest,db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    x=db.get(Report,id)
    if not x:raise HTTPException(404,"Report not found")
    x.status={"verify":"verified","reject":"rejected","merge":"under_review","escalate":"under_review"}[body.action]
    x.verification_source=body.verification_source;x.verified_by=u.username;x.verified_at=datetime.now(timezone.utc)
    audit(db,u,f"report_{body.action}","report",id,{"merge_into":body.merge_into});db.commit();db.refresh(x)
    await manager.broadcast({"type":"report_update","report_id":id,"status":x.status});return x
@router.get("/incidents")
def incidents(db:Session=Depends(get_db)):
    out=[]
    for x in db.query(Incident).all():
        age=(datetime.now(timezone.utc)-x.created_at.replace(tzinfo=timezone.utc) if x.created_at.tzinfo is None else datetime.now(timezone.utc)-x.created_at).total_seconds()/60
        score,parts=priority_score(x.severity,x.people_affected,x.is_critical_infra_nearby,x.access_difficulty,age)
        out.append({"id":x.id,"report_id":x.report_id,"category":x.category,"severity":x.severity,"people_affected":x.people_affected,"status":x.status,"priority_score":score,"priority_breakdown":parts})
    return sorted(out,key=lambda x:x["priority_score"],reverse=True)
@router.patch("/incidents/{id}/assign")
async def assign(id:str,body:AssignRequest,db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    i=db.get(Incident,id);t=db.get(RescueTeam,body.team_id)
    if not i or not t:raise HTTPException(404,"Incident or team not found")
    a=Assignment(id=f"ASN-{uuid4().hex[:8]}",incident_id=id,team_id=t.id,estimated_arrival_min=body.estimated_arrival_min)
    i.status="assigned";t.availability="assigned";db.add(a);audit(db,u,"incident_assigned","incident",id,{"team_id":t.id});db.commit()
    await manager.broadcast({"type":"incident_update","incident_id":id,"status":i.status});return {"incident":i,"assignment":a}
@router.get("/alerts")
def alerts(db:Session=Depends(get_db)): return db.query(Alert).order_by(desc(Alert.issued_at)).all()
@router.post("/alerts",status_code=201)
def create_alert(body:AlertCreate,db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    x=Alert(id=f"ALT-{uuid4().hex[:6].upper()}",**body.model_dump(),issued_at=datetime.now(timezone.utc),valid_until=datetime.now(timezone.utc)+timedelta(hours=4));db.add(x);audit(db,u,"alert_created","alert",x.id);db.commit();db.refresh(x);return x
@router.get("/shelters")
def shelters(db:Session=Depends(get_db)): return db.query(Shelter).all()
@router.get("/teams")
def teams(db:Session=Depends(get_db)): return db.query(RescueTeam).all()
@router.get("/gauges")
def gauges(db:Session=Depends(get_db)):
    return [{c.name:getattr(g,c.name) for c in g.__table__.columns} for g in db.query(RainGauge).all()]
@router.get("/gauges/{ward_id}")
def ward_gauges(ward_id:str,db:Session=Depends(get_db)):
    if not db.get(Ward,ward_id): raise HTTPException(404,"Ward not found")
    return [{c.name:getattr(g,c.name) for c in g.__table__.columns} for g in readings_for_ward(db,ward_id)]
@router.get("/nowcast/{ward_id}")
def nowcast(ward_id:str,db:Session=Depends(get_db)):
    ward=db.get(Ward,ward_id)
    if not ward: raise HTTPException(404,"Ward not found")
    state=db.get(ScenarioState,1); gauges=readings_for_ward(db,ward_id)
    current=ward.rain_rate_mmhr
    history=[]
    if state and state.is_active:
        for minute in range(max(0,state.current_step-55),state.current_step+1,5):
            history.append((intensity_at(state.storm_event_id,minute) or 0)*({"SAFE":.75,"MODERATE":.9,"HIGH":1.05,"CRITICAL":1.2}.get(ward.baseline_risk,1)))
    history=history[-12:]
    if not history: history=[current]*12
    else: history[-1]=current
    predictions=predict_nowcast(history)
    return {"ward_id":ward_id,"model":"lightweight Ridge regressor trained on synthetic storm sequences","predictions":predictions}
@router.patch("/teams/{id}")
def patch_team(id:str,body:TeamPatch,db:Session=Depends(get_db),u=Depends(get_current_authority_user)):
    x=db.get(RescueTeam,id)
    if not x:raise HTTPException(404,"Team not found")
    for k,v in body.model_dump(exclude_none=True).items():setattr(x,k,v)
    audit(db,u,"team_updated","team",id,body.model_dump(exclude_none=True));db.commit();return x
@router.get("/audit")
def audit_list(limit:int=100,db:Session=Depends(get_db),u=Depends(get_current_authority_user)): return db.query(AuditEvent).order_by(desc(AuditEvent.timestamp)).limit(limit).all()

@router.post("/routing/safe-route")
def safe_route(body:RouteRequest,db:Session=Depends(get_db)):
    edges=db.query(RoadSegment).all()
    if not edges:raise HTTPException(503,"Road graph is empty")
    # Request points are [latitude, longitude]; stored GeoJSON points are [longitude, latitude].
    def node(pt):return (round(pt[1],5),round(pt[0],5))
    G=nx.MultiGraph()
    for r in edges:
        a=node(r.geometry_geojson[0]);b=node(r.geometry_geojson[-1]);G.add_edge(a,b,key=r.id,road=r)
    coords=list(G.nodes)
    src=min(coords,key=lambda p:(p[0]-body.origin[0])**2+(p[1]-body.origin[1])**2)
    dst=min(coords,key=lambda p:(p[0]-body.destination[0])**2+(p[1]-body.destination[1])**2)
    def best(weighted):
        def weight(a,b,attrs):
            vals=[]
            for key,data in attrs.items():
                r=data["road"]
                if weighted: cost,_=route_edge_cost(r.base_travel_time_min,r.current_depth_cm,r.status,body.vehicle_class,.2)
                else: cost=r.base_travel_time_min
                if math.isfinite(cost):vals.append((cost,key))
                return min(vals)[0] if vals else math.inf
        path=nx.shortest_path(G,src,dst,weight=weight)
        selected=[]
        for a,b in zip(path,path[1:]):
            options=[]
            for key,data in G[a][b].items():
                r=data["road"]
                cost,br=route_edge_cost(r.base_travel_time_min,r.current_depth_cm,r.status,body.vehicle_class,.2) if weighted else (r.base_travel_time_min,{"travel_time_min":r.base_travel_time_min})
                if math.isfinite(cost):options.append((cost,r,br))
            if options:selected.append(min(options,key=lambda q:q[0]))
        return selected
    try: safe=best(True)
    except (nx.NetworkXNoPath,nx.NodeNotFound):raise HTTPException(422,"No passable safe route between nearest graph points")
    try: naive=best(False)
    except nx.NetworkXNoPath:naive=safe
    def pack(rows):return {"segments":[{"road_id":r.id,"name":r.name,"coordinates":r.geometry_geojson,"breakdown":b} for _,r,b in rows],"travel_time_min":round(sum(r.base_travel_time_min for _,r,_ in rows),2),"risk_cost":round(sum(c for c,_,_ in rows),2)}
    return {"safe_route":pack(safe),"naive_route":pack(naive),"comparison":{"extra_minutes":round(pack(safe)["travel_time_min"]-pack(naive)["travel_time_min"],2),"avoided_flooded_or_closed_segments":sum(r.status in ("flooded","closed") for _,r,_ in naive)-sum(r.status in ("flooded","closed") for _,r,_ in safe)}}
