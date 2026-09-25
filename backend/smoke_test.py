"""Run against a live server: .\\venv\\Scripts\\python.exe smoke_test.py"""
import asyncio, json, sys, time
from pathlib import Path
import httpx
import websockets

BASE="http://127.0.0.1:8000"
WS="ws://127.0.0.1:8000/ws"
ROOT=Path(__file__).resolve().parent
results=[]

def check(n, title, passed, detail):
    results.append((n,title,passed,detail))
    print(f"{'PASS' if passed else 'FAIL'} {n}/14 {title}: {detail}",flush=True)

async def run():
    # 1: requirements installed and importable.
    p=await asyncio.create_subprocess_exec(sys.executable,"-c","import fastapi, sqlalchemy, pydantic, jose, passlib, networkx, httpx, websockets",cwd=ROOT,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
    _,err=await p.communicate()
    pip=await asyncio.create_subprocess_exec(sys.executable,"-m","pip","check",cwd=ROOT,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
    pipout,_=await pip.communicate()
    check(1,"Python requirements",p.returncode==0 and pip.returncode==0, f"imports={'OK' if p.returncode==0 else err.decode().strip()} pip_check={pipout.decode().strip()}")
    async with httpx.AsyncClient(base_url=BASE,timeout=120) as c:
        # 2: idempotent seed command plus actual API data.
        p=await asyncio.create_subprocess_exec(sys.executable,"-m","app.seed",cwd=ROOT,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
        _,err=await p.communicate()
        w=await c.get("/api/wards"); r=await c.get("/api/reports")
        wards=w.json() if w.status_code==200 else []; reports=r.json() if r.status_code==200 else []
        ok=p.returncode==0 and len(wards)>=7 and len(reports)>=8
        print("SEEDED WARDS:",json.dumps(wards,ensure_ascii=False),flush=True)
        print("SEEDED REPORTS:",json.dumps(reports,ensure_ascii=False),flush=True)
        check(2,"Seeded database is served",ok,f"seed_exit={p.returncode} wards={w.status_code}/{len(wards)} reports={r.status_code}/{len(reports)}")

        # Get an authority token first so protected GET endpoints are also checked.
        login=await c.post("/api/auth/login",data={"username":"operator1","password":"demo1234"})
        token=login.json().get("access_token","") if login.status_code==200 else ""
        headers={"Authorization":"Bearer "+token}
        me=await c.get("/api/auth/me",headers=headers) if token else None
        # 3: docs/schema and every GET endpoint return 200 and useful data.
        paths=["/health","/api/auth/me","/api/wards","/api/wards/ward-l","/api/roads","/api/roads/rd-milan/status","/api/scenario/current","/api/reports","/api/reports/FLD-2048","/api/incidents","/api/alerts","/api/shelters","/api/teams","/api/audit","/docs","/openapi.json"]
        get_results=[]
        for path in paths:
            x=await c.get(path,headers=headers if path in ("/api/auth/me","/api/audit") else None); good=x.status_code==200
            if path in ("/api/wards","/api/roads","/api/reports","/api/incidents","/api/alerts","/api/shelters","/api/teams","/api/audit"):
                good=good and isinstance(x.json(),list) and len(x.json())>0
            get_results.append((path,x.status_code,good))
        check(3,"GET endpoints, docs, and OpenAPI",all(x[2] for x in get_results),str(get_results))

        # 4: login form returns a structurally valid JWT, accepted by protected /me.
        check(4,"Authority JWT login",login.status_code==200 and len(token.split("."))==3 and me is not None and me.status_code==200,f"login={login.status_code} jwt_parts={len(token.split('.'))} me={me.status_code if me else None}")

        # 5: protected write denies anonymous caller, allows JWT caller.
        road=(await c.get("/api/roads")).json()[0]
        params={"status":road["status"]}
        no=await c.patch(f"/api/roads/{road['id']}/status",params=params)
        yes=await c.patch(f"/api/roads/{road['id']}/status",params=params,headers=headers)
        check(5,"Protected PATCH authorization",no.status_code==401 and yes.status_code==200,f"without_token={no.status_code} with_token={yes.status_code}")

        # 6: consume complete 30..180 minute WS cycle and compare each ward snapshot.
        storms=await c.get("/api/scenario/storm-events")
        gauge_before=(await c.get("/api/gauges/ward-l")).json()
        activate=await c.post("/api/scenario/activate?storm_event_id=storm-cloudburst",headers=headers)
        seen=[]; snapshots=[]; changed=False; cause_seen=[]; flooded_cause_seen=[]
        try:
            if activate.status_code==200:
                async with websockets.connect(WS,open_timeout=10,close_timeout=5) as ws:
                    until=time.monotonic()+100
                    while time.monotonic()<until and (not seen or seen[-1]!=180):
                        msg=json.loads(await asyncio.wait_for(ws.recv(),timeout=until-time.monotonic()))
                        if msg.get("type")=="scenario_tick":
                            seen.append(msg["step"]); snapshot=tuple((q["id"],q["current_water_cm"]) for q in msg["wards"])
                            cause_seen.extend((r.get("cause") or {}).get("type") for r in msg.get("roads_changed",[]) if (r.get("cause") or {}).get("type"))
                            flooded_cause_seen.extend((r.get("cause") or {}).get("type") for r in msg.get("roads_changed",[]) if r.get("status") in ("flooded","restricted","closed") and (r.get("cause") or {}).get("type"))
                            if snapshots and snapshot!=snapshots[-1]:changed=True
                            snapshots.append(snapshot)
            ok=activate.status_code==200 and seen[-6:]==[30,60,90,120,150,180] and changed
        except Exception as e: ok=False; seen.append(f"ERROR:{type(e).__name__}:{e}")
        check(6,"WebSocket scenario full cycle and changing water",ok,f"activate={activate.status_code} steps={seen} changing_levels={changed}")

        # 7: citizen submit, authority verifies, audit row records the action.
        body={"title":"Smoke test report","category":"Waterlogging","severity":"moderate","description":"Automated acceptance smoke-test report.","ward_id":"ward-l","lat":19.0682,"lng":72.8791,"reporter_name":"smoke-test"}
        created=await c.post("/api/reports",json=body); rid=created.json().get("id") if created.status_code==201 else None
        verified=await c.patch(f"/api/reports/{rid}/verify",json={"action":"verify","verification_source":"smoke test"},headers=headers) if rid else None
        audit=await c.get("/api/audit",headers=headers); events=audit.json() if audit.status_code==200 else []
        event=any(e.get("entity_type")=="report" and e.get("entity_id")==rid and e.get("action")=="report_verify" for e in events)
        ok=created.status_code==201 and verified is not None and verified.status_code==200 and verified.json().get("status")=="verified" and event
        check(7,"Report create, verify, and audit",ok,f"create={created.status_code} id={rid} verify={verified.status_code if verified else None} status={verified.json().get('status') if verified and verified.status_code==200 else None} audit_event={event}")

        # Restore seed baselines after scenario randomness so the route assertion stays deterministic.
        await c.post("/api/scenario/reset",headers=headers)
        # 8: seeded Milan Subway closure should divert the sedan onto Gokhale Bridge.
        route=await c.post("/api/routing/safe-route",json={"origin":[19.0825,72.8415],"destination":[19.092,72.844],"vehicle_class":"sedan"})
        data=route.json() if route.status_code==200 else {}; safe=data.get("safe_route",{}); naive=data.get("naive_route",{})
        safe_ids=[s.get("road_id") for s in safe.get("segments",[])]; naive_ids=[s.get("road_id") for s in naive.get("segments",[])]
        explanation=any(s.get("breakdown") for s in safe.get("segments",[]))
        differs=bool(safe_ids and naive_ids and safe_ids!=naive_ids)
        check(8,"Safe route differs from naive flooded route",route.status_code==200 and differs and explanation,f"status={route.status_code} safe={safe_ids} naive={naive_ids} differs={differs} breakdown={explanation} comparison={data.get('comparison')}")

        # 9: endpoint catalog and explicit PowerShell execution-policy instructions.
        readme=(ROOT/"README.md").read_text(encoding="utf-8")
        endpoint_paths=["/api/auth/login","/api/auth/me","/api/wards","/api/roads","/api/scenario/current","/api/reports","/api/incidents","/api/alerts","/api/shelters","/api/teams","/api/routing/safe-route","/api/audit","/ws"]
        catalog=all(x in readme for x in endpoint_paths)
        policy="Set-ExecutionPolicy" in readme and "RemoteSigned" in readme and "venv\\Scripts\\Activate.ps1" in readme
        setup="python -m venv venv" in readme and "pip install -r requirements.txt" in readme and "uvicorn app.main:app" in readme
        credentials="operator1" in readme and "demo1234" in readme
        check(9,"README run steps, credentials, endpoint list, Windows policy fix",catalog and policy and setup and credentials,f"run_steps={setup} credentials={credentials} endpoint_catalog={catalog} execution_policy={policy}")

        chosen=activate.json().get("storm_event_id") if activate.status_code==200 else None
        check(10,"Named synthetic storm listing and activation",storms.status_code==200 and len(storms.json())>=3 and chosen=="storm-cloudburst",f"list={storms.status_code}/{len(storms.json()) if storms.status_code==200 else 0} selected={chosen}")
        gauge_after=(await c.get("/api/gauges/ward-l")).json()
        values_before=[g.get("current_reading_mmhr") for g in gauge_before]; values_after=[g.get("current_reading_mmhr") for g in gauge_after]
        check(11,"Simulated gauge readings update during replay",bool(gauge_after) and values_before!=values_after,f"before={values_before} after={values_after}")
        from app.hydraulics import mass_balance_depth_cm
        computed=mass_balance_depth_cm(10,20,5,60,100)
        formula_ok=abs(computed-10.9)<1e-9 and mass_balance_depth_cm(10,5,20,60,100)<10 and mass_balance_depth_cm(10,30,5,60,100)>10
        check(12,"Road depth follows numeric mass-balance formula",formula_ok,f"depth_cm(inflow=20,outflow=5,dt=60,area=100)={computed:.2f}; increased inflow raises depth; increased outflow lowers depth")
        forecast=await c.get("/api/nowcast/ward-l"); pred=forecast.json().get("predictions",[]) if forecast.status_code==200 else []
        forecast_ok=len(pred)==4 and [p.get("horizon_minutes") for p in pred]==[15,30,60,90] and all(0<=p["lower_mmhr"]<=p["rainfall_mmhr"]<=p["upper_mmhr"] for p in pred)
        check(13,"Synthetic-trained nowcast returns four bounded horizons",forecast_ok,f"status={forecast.status_code} predictions={pred}")
        cause_rows=await c.get("/api/roads"); cause_data=cause_rows.json() if cause_rows.status_code==200 else []
        surfaced=[r for r in cause_data if r["status"] in ("flooded","restricted","closed") and r.get("cause",{}).get("type")]
        cause_api=await c.get(f"/api/roads/{surfaced[0]['id']}/cause-explanation") if surfaced else None
        check(14,"Cause classification appears in active WS and road explanation API",bool(flooded_cause_seen) and bool(surfaced) and cause_api is not None and cause_api.status_code==200,f"ws_flooded_causes={sorted(set(flooded_cause_seen))} other_ws_causes={sorted(set(cause_seen))} road={surfaced[0]['id'] if surfaced else None} cause={surfaced[0].get('cause') if surfaced else None} explanation_status={cause_api.status_code if cause_api else None}")

    print("\nACCEPTANCE SUMMARY",flush=True)
    for n,title,passed,detail in results: print(f"{'PASS' if passed else 'FAIL'} {n}/14 {title}",flush=True)
    return 0 if all(r[2] for r in results) else 1

if __name__=="__main__": sys.exit(asyncio.run(run()))
