import React from 'react';
import { AlertOctagon, CornerUpRight, ShieldAlert, ArrowRight } from 'lucide-react';
import { ROUTE_BARRICADES } from '../../../data/routePresetsData';

export default function RoadClosuresFeed({
  onSelectDetour = () => {}
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">BMC TRAFFIC POLICE DISPATCH</span>
          <h3 className="text-sm font-extrabold text-ink">Active Barricades & Submerged Closures</h3>
        </div>
        <span className="text-[10px] font-mono text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded font-bold">
          2 Active Closures
        </span>
      </div>

      <div className="space-y-2 mt-2">
        {ROUTE_BARRICADES.map(bar => (
          <div
            key={bar.id}
            className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-bold text-ink">{bar.road}</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">
                {bar.status}
              </span>
            </div>

            <p className="text-[11px] text-rose-900 leading-snug">
              {bar.reason}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-200/80 text-[10px] font-mono">
              <span className="text-rose-800 truncate">Detour: {bar.detourRecommended}</span>
              <button
                onClick={() => onSelectDetour('safer')}
                className="px-2 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold transition flex items-center gap-1 shrink-0"
              >
                <span>Apply Safe Detour</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
