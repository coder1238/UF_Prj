"""Simulated gauges and a small weighted observation correction."""
from .models import RainGauge

def effective_rainfall(true_intensity, gauges):
    if not gauges: return max(0.0, true_intensity)
    observed=sum(g.current_reading_mmhr for g in gauges)/len(gauges)
    # Simplified stand-in for ensemble Kalman filter style data assimilation.
    return max(0.0,0.75*true_intensity+0.25*observed)

def readings_for_ward(db, ward_id):
    return db.query(RainGauge).filter_by(ward_id=ward_id).all()
