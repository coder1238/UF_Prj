import math

def priority_score(severity_1to5, people_affected, is_critical_infra_nearby, access_difficulty_1to5, age_minutes):
    # Severity and access map 1..5 linearly to 0..1; affected people saturate at 500; age saturates at 180min.
    factors = {
        "severity": 0.30 * max(0, min(1, (severity_1to5 - 1) / 4)),
        "people_affected": 0.25 * max(0, min(1, people_affected / 500)),
        "criticality": 0.20 * float(bool(is_critical_infra_nearby)),
        "access_difficulty": 0.15 * max(0, min(1, (access_difficulty_1to5 - 1) / 4)),
        "age": 0.10 * max(0, min(1, age_minutes / 180)),
    }
    return round(sum(factors.values()) * 100, 2), {k: round(v * 100, 2) for k, v in factors.items()}

def route_edge_cost(travel_time_min, water_depth_cm, road_status, vehicle_class, forecast_uncertainty_0to1):
    limits = {"sedan": 20, "emergency": 50, "pedestrian": 10}
    if vehicle_class not in limits: raise ValueError("vehicle_class must be sedan, emergency, or pedestrian")
    maximum = limits[vehicle_class]
    if road_status == "closed" or water_depth_cm >= maximum:
        return math.inf, {"reason": "impassable for vehicle class", "water_depth_cm": water_depth_cm}
    depth_ratio = max(0.0, water_depth_cm / maximum)
    status_penalty = {"open": 0.0, "restricted": 0.35, "flooded": 1.0}.get(road_status, 0.0)
    risk_penalty = depth_ratio + status_penalty
    uncertainty_penalty = max(0, min(1, forecast_uncertainty_0to1)) * 2.0
    cost = travel_time_min * (1 + risk_penalty) + uncertainty_penalty
    return cost, {"travel_time_min": travel_time_min, "depth_ratio": round(depth_ratio, 3), "status_penalty": status_penalty, "risk_penalty": round(risk_penalty, 3), "uncertainty_penalty": round(uncertainty_penalty, 3), "cost": round(cost, 3)}

