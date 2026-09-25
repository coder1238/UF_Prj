"""Train a prototype-scale rainfall regressor from synthetic storm sequences."""
from pathlib import Path
import random
import numpy as np
import joblib
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from .storm_replay import list_storms

OUT=Path(__file__).parent/"data"/"nowcast_model.joblib"
HORIZONS=(15,30,60,90)
LAGS=12

def train():
    rng=random.Random(41); storms=list_storms(); X=[]; y=[]
    for _ in range(2500):
        storm=rng.choice(storms)["rainfall_mmhr"]
        scale=rng.uniform(.55,1.5); shift=rng.randint(-2,2)
        curve=[max(0,storm[min(len(storm)-1,max(0,i+shift))]*scale+rng.gauss(0,3)) for i in range(len(storm))]
        for t in range(LAGS+1,len(curve)-18):
            X.append(curve[t-LAGS:t]); y.append([curve[t+h] for h in (3,6,12,18)])
    X=np.asarray(X); y=np.asarray(y)
    xtrain,xval,ytrain,yval=train_test_split(X,y,test_size=.2,random_state=7)
    model=Ridge(alpha=2.0).fit(xtrain,ytrain)
    residual_std=np.sqrt(np.mean((model.predict(xval)-yval)**2,axis=0))
    joblib.dump({"model":model,"residual_std":residual_std,"horizons_minutes":HORIZONS,"lags":LAGS,"training":"synthetic storm curves generated in-repository","sample_count":len(X)},OUT)
    print(f"trained synthetic Ridge nowcast: {len(X)} samples; validation RMSE={np.round(residual_std,2).tolist()} mm/hr; saved={OUT}")

if __name__=="__main__": train()
