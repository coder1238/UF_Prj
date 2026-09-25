from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ORMRead(BaseModel): model_config = ConfigDict(from_attributes=True)
class WardRead(ORMRead): id:str; name:str; lat:float; lng:float; risk_level:str; current_water_cm:float; peak_water_cm:float; rain_rate_mmhr:float; population:int; vulnerable_spots:int
class RoadRead(ORMRead): id:str; name:str; ward_id:str; geometry_geojson:list; base_travel_time_min:float; status:str; risk_level:str; current_depth_cm:float
class ReportCreate(BaseModel): title:str; category:str; severity:str; description:str; ward_id:str; lat:float; lng:float; reporter_name:str|None=None; photo_url:str|None=None
class ReportRead(ORMRead): id:str; title:str; category:str; severity:str; description:str; ward_id:str; lat:float; lng:float; reporter_name:str|None; photo_url:str|None; submitted_at:datetime; status:str; verification_source:str|None; verified_by:str|None; verified_at:datetime|None
class VerifyRequest(BaseModel): action:str=Field(pattern="^(verify|reject|merge|escalate)$"); verification_source:str|None=None; merge_into:str|None=None
class AssignRequest(BaseModel): team_id:str; estimated_arrival_min:int=10
class ScenarioRead(ORMRead): id:int; is_active:bool; current_step:int; rainfall_intensity_mmhr:float; started_at:datetime|None
class AlertCreate(BaseModel): severity:str; hazard_category:str; title:str; message:str; ward_id:str|None=None; source:str="official"
class TeamPatch(BaseModel): availability:str|None=None; current_lat:float|None=None; current_lng:float|None=None
class LoginRequest(BaseModel): username:str; password:str
class RouteRequest(BaseModel): origin:list[float]; destination:list[float]; vehicle_class:str="sedan"

