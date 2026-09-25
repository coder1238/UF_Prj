import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS
from .database import Base, engine
from .seed import seed
from .routers.api import router
from .websocket_manager import manager
from .simulation import SimulationEngine
from .nowcast import load_model

@asynccontextmanager
async def lifespan(app:FastAPI):
    Base.metadata.create_all(engine);seed();load_model();task=asyncio.create_task(SimulationEngine(manager).run())
    yield
    task.cancel()
    try: await task
    except asyncio.CancelledError: pass

app=FastAPI(title="Flood Response & Safe Mobility API",version="1.0.0",description="Mumbai ward scale simulated flood response proof of concept",lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=CORS_ORIGINS,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(router)

@app.websocket("/ws")
async def websocket_endpoint(websocket:WebSocket):
    await manager.connect(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect: manager.disconnect(websocket)

@app.get("/health")
def health():return {"status":"ok"}
