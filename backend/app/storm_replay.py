"""Synthetic storm curves shaped after published descriptions of Mumbai bursts.

The curves below are demo data, not digitized observations. The rapid rise,
peak/plateau and decay are a qualitative assumption informed by NIDM's account
of the July 2005 Mumbai event (https://nidm.gov.in/journal/PDF/Journal/Journal20092/Journal20092.pdf).
"""
import json
from pathlib import Path

# Source-controlled synthetic replay files.
DATA = Path(__file__).parent / "data" / "storm_events"

def list_storms():
    events=[]
    for path in sorted(DATA.glob("*.json")):
        events.append(json.loads(path.read_text(encoding="utf-8")))
    return events

def get_storm(storm_event_id):
    return next((e for e in list_storms() if e["id"] == storm_event_id), None)

def intensity_at(storm_event_id, minute):
    event=get_storm(storm_event_id)
    if event is None: return None
    values=event["rainfall_mmhr"]
    return float(values[min(len(values)-1, max(0, round(minute/5)))])
