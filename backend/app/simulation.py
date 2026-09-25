import asyncio, random
from .config import SIMULATION_TICK_SECONDS
from .database import SessionLocal
from .models import ScenarioState, Ward, RoadSegment, RainGauge, AuditEvent
from .storm_replay import intensity_at
from .gauges import effective_rainfall
from .hydraulics import rainfall_inflow_lps, drainage_outflow_lps, mass_balance_depth_cm
from .cause_engine import classify_cause

STEPS=[0,30,60,90,120,150,180]
RISK_NAME=["SAFE","MODERATE","HIGH","CRITICAL"]

class SimulationEngine:
    def __init__(self, manager): self.manager=manager
    async def run(self):
        while True:
            await asyncio.sleep(SIMULATION_TICK_SECONDS)
            db=SessionLocal()
            try:
                state=db.get(ScenarioState,1)
                if not state or not state.is_active: continue
                nextstep=next((s for s in STEPS if s>state.current_step),0)
                if nextstep==0:
                    state.is_active=False; db.commit(); continue
                state.current_step=nextstep
                state.rainfall_intensity_mmhr=intensity_at(state.storm_event_id, nextstep) or 0
                wards=db.query(Ward).all()
                progress={0:0,30:.2,60:.45,90:.75,120:1,150:.65,180:.25}[nextstep]
                for w in wards:
                    gauges=db.query(RainGauge).filter_by(ward_id=w.id).all()
                    scale={"SAFE":.75,"MODERATE":.9,"HIGH":1.05,"CRITICAL":1.2}.get(w.baseline_risk,1)
                    true_rain=state.rainfall_intensity_mmhr*scale
                    for gauge in gauges:
                        gauge.current_reading_mmhr=max(0,round(true_rain+random.gauss(0,2.0),2))
                        history=(gauge.reading_history or [])[-23:]+[{"step_min":nextstep,"mmhr":gauge.current_reading_mmhr}]
                        gauge.reading_history=history
                    w.rain_rate_mmhr=round(effective_rainfall(true_rain,gauges),2)
                    w.current_water_cm=round(min(150,max(0,w.baseline_water_cm+state.rainfall_intensity_mmhr*scale*progress*.12-(5 if nextstep==180 else 0))),1)
                    w.peak_water_cm=max(w.peak_water_cm,w.current_water_cm)
                    idx=min(3,max(0,int(w.current_water_cm//20)))
                    w.risk_level=RISK_NAME[idx]
                changed=[]
                road_wards={w.id:w for w in wards}
                roads=db.query(RoadSegment).all()
                for road in roads:
                    w=road_wards[road.ward_id]
                    road.previous_depth_cm=road.current_depth_cm
                    road.current_scenario_step=nextstep
                    road.current_inflow_lps=rainfall_inflow_lps(w.rain_rate_mmhr,road.catchment_area_m2,road.runoff_coefficient)
                    road.current_outflow_lps=drainage_outflow_lps(road.drainage_capacity_lps,road.current_depth_cm)
                    ratio=road.current_inflow_lps/max(road.drainage_capacity_lps,1e-6)
                    road.surcharge_ticks=road.surcharge_ticks+1 if ratio>=1.5 else 0
                    road.current_depth_cm=round(mass_balance_depth_cm(road.current_depth_cm,road.current_inflow_lps,road.current_outflow_lps,1800,road.catchment_area_m2*.08),2)
                    road.risk_level="CRITICAL" if road.current_depth_cm>=30 else "HIGH" if road.current_depth_cm>=15 else "MODERATE" if road.current_depth_cm>=5 else "SAFE"
                    road.status="closed" if road.current_depth_cm>=30 else "flooded" if road.current_depth_cm>=20 else "restricted" if road.current_depth_cm>=8 else "open"
                    cause=classify_cause(road)
                    changed.append({"id":road.id,"name":road.name,"status":road.status,"risk_level":road.risk_level,"current_depth_cm":road.current_depth_cm,"current_inflow_lps":round(road.current_inflow_lps,2),"drainage_capacity_lps":round(road.drainage_capacity_lps,2),"cause":cause})
                payload={"type":"scenario_tick","step":nextstep,"storm_event_id":state.storm_event_id,"rainfall_intensity_mmhr":state.rainfall_intensity_mmhr,"wards":[{"id":w.id,"risk_level":w.risk_level,"current_water_cm":w.current_water_cm,"rain_rate_mmhr":w.rain_rate_mmhr} for w in wards],"roads_changed":changed}
                db.commit()
            finally: db.close()
            await self.manager.broadcast(payload)
