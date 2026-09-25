import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 480
SIMULATION_TICK_SECONDS = float(os.getenv("SIMULATION_TICK_SECONDS", "8"))
_LOCAL_CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:4173"]
_EXTRA_CORS_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "").split(",") if origin.strip()]
CORS_ORIGINS = list(dict.fromkeys(_LOCAL_CORS_ORIGINS + _EXTRA_CORS_ORIGINS))
