"""Inference for the model trained by app.train_nowcast on synthetic data."""
from pathlib import Path
import joblib
import numpy as np

_ARTIFACT=Path(__file__).parent/"data"/"nowcast_model.joblib"
_bundle=None
def load_model():
    global _bundle
    if not _ARTIFACT.exists():
        from .train_nowcast import train
        train()
    _bundle=joblib.load(_ARTIFACT)

def predict_nowcast(recent_intensities):
    global _bundle
    if _bundle is None: load_model()
    values=list(recent_intensities)[-_bundle["lags"]:]
    if len(values)<_bundle["lags"]: values=[0.0]*(_bundle["lags"]-len(values))+values
    predictions=np.maximum(0,_bundle["model"].predict(np.asarray([values]))[0])
    std=_bundle["residual_std"]
    return [{"horizon_minutes":h,"rainfall_mmhr":round(float(p),2),"lower_mmhr":round(float(max(0,p-1.96*s)),2),"upper_mmhr":round(float(p+1.96*s),2)} for h,p,s in zip(_bundle["horizons_minutes"],predictions,std)]
