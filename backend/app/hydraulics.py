"""Rule-based, lumped road-segment hydraulic capacity demonstration."""
import math

def manning_capacity(pipe_diameter_m, slope, roughness_n):
    """Full circular conduit Manning capacity, returned in litres/second."""
    area=math.pi*pipe_diameter_m**2/4
    hydraulic_radius=pipe_diameter_m/4
    return (1/roughness_n)*area*(hydraulic_radius**(2/3))*math.sqrt(max(slope, 0))*1000

def rainfall_inflow_lps(rain_mmhr, catchment_area_m2, runoff_coefficient):
    return max(0, rain_mmhr)*catchment_area_m2*runoff_coefficient/3600

def drainage_outflow_lps(capacity_lps, depth_cm):
    return max(0, capacity_lps)*min(1.0, max(0, depth_cm)/5.0)

def mass_balance_depth_cm(previous_depth_cm, inflow_lps, outflow_lps, duration_seconds, pond_area_m2):
    # A lumped bucket for a road segment: 1 L = 0.001 m3 and depth is volume / pond area.
    # It is not a full one-dimensional or two-dimensional hydraulic solver.
    delta_cm=(inflow_lps-outflow_lps)*duration_seconds/(pond_area_m2*10)
    return min(250.0, max(0.0, previous_depth_cm+delta_cm))
