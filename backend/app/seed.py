import argparse
from datetime import datetime, timezone, timedelta
from .database import Base, engine, SessionLocal
from .models import *
from .auth import hash_password
from .scoring import priority_score
from .hydraulics import manning_capacity
from sqlalchemy import inspect, text

WARD_DATA = [
 ("ward-l","Ward L - Kurla & Kalina Basin",19.0682,72.8791,"HIGH",24,39,38,890000,14),
 ("ward-k-west","Ward K-West - Andheri West & Juhu",19.1136,72.8497,"CRITICAL",34,45,44,750000,19),
 ("ward-k-east","Ward K-East - Andheri East & Saki Naka",19.1150,72.8750,"HIGH",22,36,36,820000,12),
 ("ward-h-west","Ward H-West - Bandra West & Khar",19.0600,72.8338,"MODERATE",7,16,22,420000,6),
 ("ward-g-north","Ward G-North - Mahim & Dharavi Outfall",19.0400,72.8500,"MODERATE",14,26,28,680000,11),
 ("ward-f-north","Ward F-North - Sion, Matunga & Hindmata",19.0250,72.8520,"CRITICAL",32,46,42,540000,16),
 ("ward-a","Ward A - Fort & South Coast",18.9300,72.8300,"SAFE",2,5,14,210000,2),
]
REPORTS = [
 ("FLD-2048","Waterlogging & Impassable Underpass","Subway Trap","critical","SV Road under Milan Subway, Santacruz: water is over the curb and vehicles are turning back.","ward-k-west",19.0825,72.8415),
 ("FLD-1982","Open Stormwater Manhole Near 14th Road","Manhole Hazard","critical","Dislodged cover near Khar Danda Road; pedestrians and two-wheelers are at risk.","ward-h-west",19.0710,72.8360),
 ("FLD-2071","Waterlogging at Saki Naka Junction","Waterlogging","high","Water pooling across the Andheri-Kurla Road service lane; avoid the curb-side lane.","ward-k-east",19.1120,72.8830),
 ("FLD-2114","Vehicle Stranded at L.B.S. Marg","Stranded Vehicle","high","A hatchback is stalled near Phoenix Marketcity with water rising around the wheels.","ward-l",19.0680,72.8800),
 ("FLD-2120","Fallen Tree Blocking Linking Road","Downed Tree","moderate","A large branch is blocking one lane near Bandra; traffic is moving slowly.","ward-h-west",19.0605,72.8360),
 ("FLD-2142","Water Across Hindmata Junction","Waterlogging","critical","Deep water at the low point on Dr. B.R. Ambedkar Road; small vehicles should divert.","ward-f-north",19.0125,72.8425),
 ("FLD-2150","Dharavi Outfall Backflow","Drainage","high","Water is backing up along the Mahim outfall access road after heavy rain.","ward-g-north",19.0400,72.8500),
 ("FLD-2166","Pothole Hidden Under Runoff","Road Hazard","moderate","A deep pothole is submerged on the Fort approach; proceed carefully.","ward-a",18.9300,72.8300),
]
ROAD = [
 ("rd-milan","Milan Subway (SV Road underpass)","ward-k-west",19.0825,72.8410,5,"closed",35),
 ("rd-gokhale","Gokhale Bridge approach","ward-k-west",19.0880,72.8400,12,"open",2),
 ("rd-weh","Western Express Highway elevated deck","ward-k-west",19.0960,72.8460,4,"open",0),
 ("rd-lbs","L.B.S. Marg near Phoenix Marketcity","ward-l",19.0680,72.8800,7,"restricted",24),
 ("rd-bkc","BKC Elevated Connector","ward-l",19.0620,72.8650,5,"open",0),
 ("rd-sakinaka","Saki Naka Junction","ward-k-east",19.1120,72.8830,6,"restricted",16),
 ("rd-jvlr","JVLR Elevated Connector","ward-k-east",19.1280,72.8710,8,"open",0),
 ("rd-perry","Perry Road coastal ridge","ward-h-west",19.0600,72.8300,5,"open",2),
 ("rd-linking","Linking Road, Bandra","ward-h-west",19.0660,72.8350,7,"open",4),
 ("rd-mahim","Mahim Causeway approach","ward-g-north",19.0400,72.8500,6,"restricted",14),
 ("rd-dharavi","Dharavi outfall road","ward-g-north",19.0440,72.8560,5,"flooded",28),
 ("rd-ambedkar","Dr. B.R. Ambedkar Road (Hindmata)","ward-f-north",19.0125,72.8425,8,"closed",32),
 ("rd-sion","Sion Circle","ward-f-north",19.0310,72.8550,6,"restricted",26),
 ("rd-eastern","Eastern Express Highway service road","ward-f-north",19.0350,72.8640,8,"open",1),
 ("rd-colaba","Marine Drive / Fort approach","ward-a",18.9300,72.8300,5,"open",0),
 ("rd-horniman","Horniman Circle access","ward-a",18.9320,72.8340,4,"open",1),
]

def seed(reset=False):
    Base.metadata.create_all(engine)
    # Additive migration for existing SQLite demo databases; only static schema identifiers below.
    additions={"wards":{"baseline_rain_rate_mmhr":"FLOAT NOT NULL DEFAULT 0"},"scenario_state":{"storm_event_id":"VARCHAR NOT NULL DEFAULT 'storm-mumbai-typical'"},"road_segments":{
        "pipe_diameter_m":"FLOAT NOT NULL DEFAULT 0.7","slope":"FLOAT NOT NULL DEFAULT 0.0015","roughness_n":"FLOAT NOT NULL DEFAULT 0.013","drainage_capacity_lps":"FLOAT NOT NULL DEFAULT 100","catchment_area_m2":"FLOAT NOT NULL DEFAULT 7000","runoff_coefficient":"FLOAT NOT NULL DEFAULT 0.8","current_inflow_lps":"FLOAT NOT NULL DEFAULT 0","current_outflow_lps":"FLOAT NOT NULL DEFAULT 0","previous_depth_cm":"FLOAT NOT NULL DEFAULT 0","surcharge_ticks":"INTEGER NOT NULL DEFAULT 0","basin_prone":"BOOLEAN NOT NULL DEFAULT 0","outfall_adjacent":"BOOLEAN NOT NULL DEFAULT 0","current_scenario_step":"INTEGER NOT NULL DEFAULT 0"}}
    with engine.begin() as conn:
        for table, cols in additions.items():
            existing={c["name"] for c in inspect(engine).get_columns(table)}
            for column, ddl in cols.items():
                if column not in existing: conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}"))
    db=SessionLocal()
    try:
        if reset:
            for model in [Assignment, AuditEvent, Incident, Alert, Report, RainGauge, RoadSegment, Shelter, RescueTeam, AuthorityUser, ScenarioState, Ward]: db.query(model).delete()
            db.commit()
        if db.query(Ward).first():
            _configure_hydraulic_demo(db)
            db.commit()
            return
        if not db.query(Ward).first():
          for x in WARD_DATA:
            id,name,lat,lng,risk,water,peak,rain,pop,spots=x
            db.add(Ward(id=id,name=name,lat=lat,lng=lng,risk_level=risk,current_water_cm=water,peak_water_cm=peak,rain_rate_mmhr=rain,population=pop,vulnerable_spots=spots,baseline_water_cm=water,baseline_risk=risk))
          db.flush()
          db.add(ScenarioState(id=1,is_active=False,current_step=0,rainfall_intensity_mmhr=18))
        # A connected, ordered path for demonstrable safe-vs-fast route comparison; each segment is a graph edge.
          points=[(19.0825,72.8415),(19.087,72.842),(19.092,72.844),(19.097,72.847),(19.102,72.850),(19.107,72.854),(19.112,72.858),(19.117,72.862),(19.122,72.866),(19.127,72.870),(19.132,72.874),(19.137,72.878),(19.142,72.882),(19.147,72.886),(19.152,72.890),(19.157,72.894),(19.162,72.898)]
          for i,(id,name,ward,lat,lng,mins,status,depth) in enumerate(ROAD):
            # Milan Subway is closed; Gokhale Bridge is the longer bypass while the shorter link is flooded.
              if id=="rd-gokhale": geom=[list(reversed(points[0])),list(reversed(points[2]))]
              elif id=="rd-weh": geom=[list(reversed(points[1])),list(reversed(points[2]))]
              else: geom=[list(reversed(points[i])),list(reversed(points[i+1]))]
              db.add(RoadSegment(id=id,name=name,ward_id=ward,geometry_geojson=geom,base_travel_time_min=mins,status=status,risk_level="CRITICAL" if depth>=30 else "HIGH" if depth>=15 else "SAFE",current_depth_cm=depth,baseline_status=status,baseline_depth_cm=depth))
          db.flush()
          for i,(id,title,cat,sev,desc,ward,lat,lng) in enumerate(REPORTS):
            report=Report(id=id,title=title,category=cat,severity=sev,description=desc,ward_id=ward,lat=lat,lng=lng,reporter_name=["Aarav Mehta","Pooja Iyer","Resident reporter"][i%3],submitted_at=datetime.now(timezone.utc)-timedelta(minutes=8+i*5),status="verified" if i<3 else "submitted",verification_source="Municipal sensor cross-check" if i<3 else None)
            db.add(report)
            if i<5:
                score,parts=priority_score(5 if sev=="critical" else 4,180+i*75,i in (0,5),4,45+i*8)
                db.add(Incident(id=f"INC-{i+1:04d}",report_id=id,category=cat,severity=5 if sev=="critical" else 4,people_affected=180+i*75,is_critical_infra_nearby=i in (0,5),access_difficulty=4,priority_score=score,priority_breakdown=parts))
          shelters=[("SH-01","Cooper Hospital Relief Centre","hospital","ward-k-west",19.116,72.846,320,112,True),("SH-02","Bhabha Hospital Bandra","hospital","ward-h-west",19.055,72.833,240,88,True),("SH-03","Sion Hospital Emergency Hall","hospital","ward-f-north",19.039,72.862,400,95,True),("SH-04","Kurla Municipal School Shelter","school","ward-l",19.072,72.884,180,74,False),("SH-05","Mahim Municipal School","school","ward-g-north",19.043,72.845,150,63,False),("SH-06","St. Xavier's Fort Relief Centre","school","ward-a",18.938,72.835,120,51,False),("SH-07","Andheri East Community Hall","community_hall","ward-k-east",19.118,72.879,200,120,True)]
        for id,n,t,w,lat,lng,cap,avail,power in shelters: db.add(Shelter(id=id,name=n,type=t,ward_id=w,lat=lat,lng=lng,total_capacity=cap,available_capacity=avail,has_power_backup=power,has_medical_staff=t=="hospital",phone="+91 22 0000 0000"))
        teams=[("TEAM-01","NDRF Boat Team Alpha","ndrf",8,19.08,72.84,["inflatable_boat","life_jackets"]),("TEAM-02","Kurla Municipal Pump Unit 7","pump",5,19.068,72.879,["2400_lpm_pump"]),("TEAM-03","Ward F Rescue Boat","boat",6,19.025,72.852,["boat","ropes"]),("TEAM-04","Bandra Emergency Ambulance","medical",4,19.06,72.834,["ambulance","first_aid"]),("TEAM-05","Saki Naka Dewatering Unit","pump",5,19.115,72.875,["portable_pump"]),("TEAM-06","NDRF Boat Team Bravo","ndrf",8,19.04,72.85,["inflatable_boat","medical_kit"])]
        for id,n,t,c,lat,lng,eq in teams: db.add(RescueTeam(id=id,name=n,team_type=t,capacity=c,current_lat=lat,current_lng=lng,equipment=eq))
        now=datetime.now(timezone.utc)
        for x in [("ALT-01","critical","subway_flood","Milan Subway closed","Underpass impassable; use Gokhale Bridge approach.","ward-k-west"),("ALT-02","high","waterlogging","Hindmata waterlogging","Avoid low-lying Hindmata junction.","ward-f-north"),("ALT-03","moderate","heavy_rain","Heavy rain in Kurla","Expect ponding on L.B.S. Marg.","ward-l"),("ALT-04","high","road_flood","Dharavi outfall road flooded","Use Mahim Causeway approach.","ward-g-north"),("ALT-05","moderate","weather","Citywide rain advisory","Allow extra travel time and avoid underpasses.",None)]: db.add(Alert(id=x[0],severity=x[1],hazard_category=x[2],title=x[3],message=x[4],ward_id=x[5],issued_at=now,valid_until=now+timedelta(hours=4),source="official"))
        db.add_all([AuthorityUser(username="operator1",hashed_password=hash_password("demo1234"),full_name="Demo Ward Operator",role="operator",ward_id="ward-k-west"),AuthorityUser(username="admin",hashed_password=hash_password("demo1234"),full_name="Demo Administrator",role="admin")])
        db.add(AuditEvent(actor="system",action="seed_completed",entity_type="database",entity_id="mumbai-demo",metadata_json={"wards":len(WARD_DATA),"reports":len(REPORTS)}))
        _configure_hydraulic_demo(db)
        db.commit()
    finally: db.close()

def _configure_hydraulic_demo(db):
    risk_factor={"SAFE":1.0,"MODERATE":.8,"HIGH":.65,"CRITICAL":.55}
    gauge_names={"ward-l":[("Kurla AWS-1",19.0682,72.8791),("Kalina Gauge-2",19.082,72.868)],"ward-k-west":[("Andheri West Gauge-1",19.1136,72.8497)],"ward-k-east":[("Saki Naka Gauge-1",19.115,72.875)],"ward-h-west":[("Bandra Gauge-1",19.06,72.8338)],"ward-g-north":[("Mahim Outfall Gauge-1",19.04,72.85)],"ward-f-north":[("Hindmata Gauge-1",19.025,72.852)],"ward-a":[("Fort Gauge-1",18.93,72.83)]}
    for ward in db.query(Ward).all():
        if not ward.baseline_rain_rate_mmhr: ward.baseline_rain_rate_mmhr=ward.rain_rate_mmhr
    for road in db.query(RoadSegment).all():
        ward=db.get(Ward,road.ward_id)
        if not road.pipe_diameter_m or road.pipe_diameter_m==.7:
            road.pipe_diameter_m=.45+.5*risk_factor.get(ward.baseline_risk, .8)
        road.slope=.0012 if ward.baseline_risk in ("HIGH","CRITICAL") else .002
        road.roughness_n=.013
        road.drainage_capacity_lps=manning_capacity(road.pipe_diameter_m,road.slope,road.roughness_n)
        road.catchment_area_m2=13000 if ward.baseline_risk in ("HIGH","CRITICAL") else 9000
        road.runoff_coefficient=.82
        road.basin_prone=road.id in ("rd-milan","rd-sakinaka","rd-ambedkar","rd-sion")
        road.outfall_adjacent=ward.id=="ward-g-north" and road.id=="rd-dharavi"
    existing={g.id for g in db.query(RainGauge).all()}
    for ward_id, rows in gauge_names.items():
        for idx,(name,lat,lng) in enumerate(rows,1):
            gid=f"gauge-{ward_id}-{idx}"
            if gid not in existing: db.add(RainGauge(id=gid,ward_id=ward_id,name=name,lat=lat,lng=lng,current_reading_mmhr=0,reading_history=[]))

if __name__ == "__main__":
    parser=argparse.ArgumentParser(); parser.add_argument("--reset",action="store_true"); seed(parser.parse_args().reset)
