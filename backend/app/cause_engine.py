def classify_cause(segment):
    """Explain a road's current restriction using explicit prototype rules."""
    capacity=max(float(segment.drainage_capacity_lps or 0), 1e-6)
    inflow=float(segment.current_inflow_lps or 0)
    outflow=float(segment.current_outflow_lps or 0)
    ratio=inflow/capacity
    factors={"inflow_lps":round(inflow,2),"outflow_lps":round(outflow,2),"capacity_lps":round(capacity,2),"inflow_capacity_ratio":round(ratio,3),"surcharge_ticks":int(segment.surcharge_ticks or 0),"scenario_step_min":int(segment.current_scenario_step or 0),"depth_cm":round(float(segment.current_depth_cm or 0),2)}
    if segment.outfall_adjacent and 90 <= (segment.current_scenario_step or 0) <= 150:
        kind="outfall_backwater"; explanation="Outfall-adjacent segment during the replay peak window; tide is represented by a seeded rule, not measured tide data."
    elif segment.basin_prone and outflow <= 0.01 and inflow < capacity*0.25:
        kind="basin_trapping"; explanation="Seeded basin-prone low point retains water while current rainfall inflow is low and modeled outflow is zero."
    elif ratio >= 1.5 and (segment.surcharge_ticks or 0) >= 2:
        kind="surcharge_backflow"; explanation="Rainfall-derived inflow exceeds modeled drainage capacity by a sustained large margin."
    elif ratio >= 0.65 and ratio < 1.5:
        kind="inlet_bypass"; explanation="High inflow approaches capacity; rapid runoff bypassing inlets is represented by this simplified rule."
    else:
        kind=None; explanation="No current rule threshold identifies a specific flooding cause."
    return {"type":kind,"explanation":explanation,"factors":factors}
