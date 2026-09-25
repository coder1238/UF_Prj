from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

def utcnow(): return datetime.now(timezone.utc)

class Ward(Base):
    __tablename__ = "wards"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String, default="SAFE")
    current_water_cm: Mapped[float] = mapped_column(Float, default=0)
    peak_water_cm: Mapped[float] = mapped_column(Float, default=0)
    rain_rate_mmhr: Mapped[float] = mapped_column(Float, default=0)
    population: Mapped[int] = mapped_column(Integer, default=0)
    vulnerable_spots: Mapped[int] = mapped_column(Integer, default=0)
    baseline_water_cm: Mapped[float] = mapped_column(Float, default=0)
    baseline_risk: Mapped[str] = mapped_column(String, default="SAFE")
    baseline_rain_rate_mmhr: Mapped[float] = mapped_column(Float, default=0)

class RoadSegment(Base):
    __tablename__ = "road_segments"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"))
    geometry_geojson: Mapped[list] = mapped_column(JSON)
    base_travel_time_min: Mapped[float] = mapped_column(Float, default=5)
    status: Mapped[str] = mapped_column(String, default="open")
    risk_level: Mapped[str] = mapped_column(String, default="SAFE")
    current_depth_cm: Mapped[float] = mapped_column(Float, default=0)
    baseline_status: Mapped[str] = mapped_column(String, default="open")
    baseline_depth_cm: Mapped[float] = mapped_column(Float, default=0)
    pipe_diameter_m: Mapped[float] = mapped_column(Float, default=0.7)
    slope: Mapped[float] = mapped_column(Float, default=0.0015)
    roughness_n: Mapped[float] = mapped_column(Float, default=0.013)
    drainage_capacity_lps: Mapped[float] = mapped_column(Float, default=100)
    catchment_area_m2: Mapped[float] = mapped_column(Float, default=7000)
    runoff_coefficient: Mapped[float] = mapped_column(Float, default=0.8)
    current_inflow_lps: Mapped[float] = mapped_column(Float, default=0)
    current_outflow_lps: Mapped[float] = mapped_column(Float, default=0)
    previous_depth_cm: Mapped[float] = mapped_column(Float, default=0)
    surcharge_ticks: Mapped[int] = mapped_column(Integer, default=0)
    basin_prone: Mapped[bool] = mapped_column(Boolean, default=False)
    outfall_adjacent: Mapped[bool] = mapped_column(Boolean, default=False)
    current_scenario_step: Mapped[int] = mapped_column(Integer, default=0)

class RainGauge(Base):
    __tablename__ = "rain_gauges"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"), index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    current_reading_mmhr: Mapped[float] = mapped_column(Float, default=0)
    reading_history: Mapped[list] = mapped_column(JSON, default=list)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class ScenarioState(Base):
    __tablename__ = "scenario_state"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    current_step: Mapped[int] = mapped_column(Integer, default=0)
    rainfall_intensity_mmhr: Mapped[float] = mapped_column(Float, default=18)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    storm_event_id: Mapped[str] = mapped_column(String, default="storm-mumbai-typical")

class Report(Base):
    __tablename__ = "reports"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    reporter_name: Mapped[str | None] = mapped_column(String, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    status: Mapped[str] = mapped_column(String, default="submitted")
    verification_source: Mapped[str | None] = mapped_column(String, nullable=True)
    verified_by: Mapped[str | None] = mapped_column(String, nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class Incident(Base):
    __tablename__ = "incidents"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    report_id: Mapped[str | None] = mapped_column(ForeignKey("reports.id"), nullable=True)
    category: Mapped[str] = mapped_column(String)
    severity: Mapped[int] = mapped_column(Integer)
    people_affected: Mapped[int] = mapped_column(Integer, default=0)
    is_critical_infra_nearby: Mapped[bool] = mapped_column(Boolean, default=False)
    access_difficulty: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    status: Mapped[str] = mapped_column(String, default="open")
    priority_score: Mapped[float] = mapped_column(Float, default=0)
    priority_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)

class Shelter(Base):
    __tablename__ = "shelters"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"))
    lat: Mapped[float] = mapped_column(Float); lng: Mapped[float] = mapped_column(Float)
    total_capacity: Mapped[int] = mapped_column(Integer); available_capacity: Mapped[int] = mapped_column(Integer)
    has_power_backup: Mapped[bool] = mapped_column(Boolean, default=True)
    has_medical_staff: Mapped[bool] = mapped_column(Boolean, default=False)
    phone: Mapped[str] = mapped_column(String, default="")

class RescueTeam(Base):
    __tablename__ = "rescue_teams"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String); team_type: Mapped[str] = mapped_column(String)
    capacity: Mapped[int] = mapped_column(Integer); current_lat: Mapped[float] = mapped_column(Float)
    current_lng: Mapped[float] = mapped_column(Float); availability: Mapped[str] = mapped_column(String, default="available")
    equipment: Mapped[list] = mapped_column(JSON, default=list)

class Assignment(Base):
    __tablename__ = "assignments"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"))
    team_id: Mapped[str] = mapped_column(ForeignKey("rescue_teams.id"))
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    status: Mapped[str] = mapped_column(String, default="dispatched")
    estimated_arrival_min: Mapped[int] = mapped_column(Integer, default=10)

class Alert(Base):
    __tablename__ = "alerts"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    severity: Mapped[str] = mapped_column(String); hazard_category: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String); message: Mapped[str] = mapped_column(Text)
    ward_id: Mapped[str | None] = mapped_column(ForeignKey("wards.id"), nullable=True)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    valid_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    source: Mapped[str] = mapped_column(String, default="official")

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor: Mapped[str] = mapped_column(String); action: Mapped[str] = mapped_column(String)
    entity_type: Mapped[str] = mapped_column(String); entity_id: Mapped[str] = mapped_column(String)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

class AuthorityUser(Base):
    __tablename__ = "authority_users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String); full_name: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String); ward_id: Mapped[str | None] = mapped_column(ForeignKey("wards.id"), nullable=True)
