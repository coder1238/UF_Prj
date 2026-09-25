import React from 'react';
import { SlidersHorizontal, ShieldAlert, Waves, ArrowUpRight, Check } from 'lucide-react';

export default function RouteFiltersAndAvoidance({
  filters,
  onToggleFilter
}) {
  const FILTER_ITEMS = [
    {
      id: 'avoidSubways',
      label: 'Avoid Subways & Sump Dips',
      desc: 'Mandatory diversion around Milan, Khar, Andheri, and Malad rail subways.',
      badge: 'HIGH IMPACT',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'preferFlyovers',
      label: 'Prefer Elevated Flyovers Only',
      desc: 'Route strictly over JVLR, Eastern Express & Western Express upper decks.',
      badge: 'SAFE CORRIDOR',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'avoidRiverBanks',
      label: 'Avoid Mithi River 200m Buffer',
      desc: 'Bypasses Kurla LBS Marg, CST Road, and Kalina floodplains.',
      badge: 'TIDAL LOCK',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'avoidHighVelocity',
      label: 'Avoid Strong Water Currents (>0.4 m/s)',
      desc: 'Prevents lateral hydrodynamic drift on sedans, two-wheelers, and walkers.',
      badge: 'HYDRODYNAMICS',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR RESTRICTION FILTERS</span>
          <h3 className="text-sm font-extrabold text-ink">Hazard & Infrastructure Avoidance</h3>
        </div>
        <SlidersHorizontal className="w-4 h-4 text-ink-muted" />
      </div>

      <div className="space-y-2 mt-2">
        {FILTER_ITEMS.map(item => {
          const isActive = !!filters[item.id];
          return (
            <div
              key={item.id}
              onClick={() => onToggleFilter(item.id)}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                isActive 
                  ? 'border-primary bg-primary-soft/40 shadow-xs' 
                  : 'border-border bg-canvas/40 hover:bg-canvas hover:border-slate-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{item.label}</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-snug">{item.desc}</p>
              </div>

              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                isActive ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
              }`}>
                {isActive && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
