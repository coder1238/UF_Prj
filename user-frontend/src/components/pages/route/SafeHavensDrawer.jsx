import React from 'react';
import { Building, Plus, ShieldCheck, HeartPulse, Car } from 'lucide-react';
import { ROUTE_SAFE_HAVENS } from '../../../data/routePresetsData';

export default function SafeHavensDrawer({
  onAddHavenAsWaypoint = () => {}
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR EMERGENCY HAVENS</span>
          <h3 className="text-sm font-extrabold text-ink">High-Ground Shelters & Dry Parking</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
          4 Verified Havens
        </span>
      </div>

      <p className="text-xs text-ink-secondary">
        Certified municipal flood shelters and multi-level parking decks located within 800 meters of the active corridor.
      </p>

      <div className="space-y-2 mt-2">
        {ROUTE_SAFE_HAVENS.map(haven => (
          <div
            key={haven.id}
            className="p-3 bg-canvas/70 rounded-xl border border-border hover:border-emerald-400 transition flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-ink">{haven.name}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  {haven.elevation}
                </span>
              </div>

              <div className="text-[10px] font-mono text-ink-muted">
                {haven.type} • {haven.distanceFromRoute}
              </div>

              <div className="text-[10px] font-mono text-emerald-700 font-medium">
                {haven.capacity} • {haven.power}
              </div>
            </div>

            <button
              onClick={() => onAddHavenAsWaypoint({
                id: haven.id,
                name: haven.name,
                address: `${haven.type} (${haven.elevation})`,
                lat: haven.lat,
                lng: haven.lng
              })}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1 shrink-0 shadow-xs"
              title="Add this shelter as intermediate stop"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
