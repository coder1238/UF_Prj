# Flood Response & Safe Mobility API

FastAPI backend for a Mumbai ward scale proof of concept.

## What's simulated vs. what's real

This backend runs a synthetic historical-storm replay from source-controlled JSON curves. Their rapid rise, peak/plateau, and decay shape is a qualitative assumption informed by published accounts of Mumbai monsoon bursts; the curves are not digitized historical measurements. A simulated rain gauge network adds noise and nudges replay rainfall with a weighted observation correction. Road drainage capacity is calculated with Manning's equation from seeded pipe assumptions; segment water depth uses a lumped road-segment bucket mass balance, not a full 1D/2D hydraulic solver. Cause explanations use transparent seeded rules, including a demo outfall rule without tide observations.

The nowcast is a lightweight Ridge regressor trained from scratch on synthetic variations of those curves. Its uncertainty bands use validation residuals from that synthetic training run. This prototype has no external weather ingestion, live IMD/AWS gauges, live radar, or pretrained model. A production deployment would need measured gauge/radar feeds, calibrated drainage inputs, and a trained spatio-temporal model such as a ConvLSTM/Earthformer-class approach; those are outside this prototype's data availability.

## Run locally

```bash
cd backend
python -m venv venv
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

The nowcast model artifact (`app/data/nowcast_model.joblib`) is trained from scratch. The app trains it on first start when the artifact is missing; to create it explicitly, run `python -m app.train_nowcast`.

### Windows PowerShell activation

If PowerShell blocks `Activate.ps1` with an execution-policy error, allow locally created scripts for your Windows user, then activate the project environment:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

The policy is scoped to `CurrentUser`; after setting it once, use the same activation command in later PowerShell sessions. To avoid changing PowerShell policy, run commands directly through `venv\Scripts\python.exe` instead.

Swagger UI: http://localhost:8000/docs. SQLite is stored at `backend/app.db` when launched from this directory. Set `DATABASE_URL` to switch databases, `JWT_SECRET` to a private signing key, and `SIMULATION_TICK_SECONDS` to tune demo speed. CORS permits ports 3000 and 5173 plus 5174/4173.

Demo authority credentials: `operator1` / `demo1234` (operator), `admin` / `demo1234` (admin). Login uses `application/x-www-form-urlencoded` fields `username` and `password`; send the returned token as `Authorization: Bearer <token>`. Citizens can submit reports anonymously. Connect both dashboards to `ws://localhost:8000/ws` for shared updates.

To restore the original demo data, stop the server and run `python -m app.seed --reset`.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Exchange authority credentials for a JWT |
| GET | `/api/auth/me` | Return the authenticated authority profile |
| GET | `/api/wards` | List ward flood and population state |
| GET | `/api/wards/{id}` | Read one ward |
| GET | `/api/roads` | List road graph segments and status |
| GET | `/api/roads/{id}/status` | Read a road's current status |
| PATCH | `/api/roads/{id}/status?status=...` | Change road status (authority) |
| GET | `/api/scenario/current` | Read simulation clock and activity |
| GET | `/api/scenario/storm-events` | List available synthetic replay curves |
| POST | `/api/scenario/activate?storm_event_id=storm-cloudburst` | Start a named scenario at T+0 (authority) |
| POST | `/api/scenario/reset` | Stop and restore baseline (authority) |
| POST | `/api/reports` | Submit a citizen flood or hazard report |
| GET | `/api/reports` | List reports, optionally filtered by status |
| GET | `/api/reports/{id}` | Read one report |
| PATCH | `/api/reports/{id}/verify` | Verify, reject, merge, or escalate (authority) |
| GET | `/api/incidents` | List incidents ranked by explainable priority score |
| PATCH | `/api/incidents/{id}/assign` | Assign a rescue team to an incident (authority) |
| GET | `/api/alerts` | List active seeded and issued alerts |
| POST | `/api/alerts` | Issue an alert (authority) |
| GET | `/api/shelters` | List shelter capacity and services |
| GET | `/api/teams` | List rescue team availability |
| GET | `/api/gauges` and `/api/gauges/{ward_id}` | Read simulated gauge locations and readings |
| GET | `/api/nowcast/{ward_id}` | Read learned synthetic-data forecasts with residual confidence bands |
| GET | `/api/roads/{id}/cause-explanation` | Explain current road cause classification |
| PATCH | `/api/teams/{id}` | Update rescue team availability or location (authority) |
| POST | `/api/routing/safe-route` | Compare risk weighted and shortest time routes |
| GET | `/api/audit` | Read recent authority and system audit events (authority) |
| GET | `/health` | Check service availability |
| WS | `/ws` | Receive scenario, report, and incident events |

Scenario WebSocket events use `scenario_tick` with ward values and changed roads; report and incident mutations send `report_update` and `incident_update` events.

## Smoke test

With the server running on port 8000, run `python smoke_test.py` (or `venv\Scripts\python.exe smoke_test.py` in PowerShell). The script checks seeded API data, every GET route, authority access, report verification/audit, routing, and the complete WebSocket scenario cycle.
