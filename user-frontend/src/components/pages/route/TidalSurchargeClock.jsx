import React from 'react';
import { Waves, AlertCircle, ArrowUpRight, Anchor } from 'lucide-react';
import { TIDE_FORECAST } from '../../../data/routePresetsData';

export default function TidalSurchargeClock() {
  const peakTide = TIDE_FORECAST.find(t => t.heightM >= 4.4) || TIDE_FORECAST[3];

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="w-4 h-4 text-cyan-600" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">COASTAL TIDAL HYDRODYNAMICS</span>
            <h4 className="text-xs font-bold text-ink">Mithi River Tidal Gate Surcharge</h4>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
          Mahim Bay Gauge
        </span>
      </div>

      <p className="text-xs text-ink-secondary">
        When sea tide exceeds 4.2m MSL, gravity storm outfalls automatically close floodgates, trapping rainwater in inland basins.
      </p>

      {/* Tidal Forecast Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 font-mono text-center pt-1">
        {TIDE_FORECAST.map((t, idx) => {
          const isPeak = t.heightM >= 4.4;
          return (
            <div
              key={idx}
              className={`p-2 rounded-xl border transition ${
                isPeak 
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold shadow-xs' 
                  : 'bg-canvas border-border text-ink-secondary'
              }`}
            >
              <span className="text-[10px] block opacity-75">{t.time}</span>
              <span className="text-xs font-extrabold block my-0.5">{t.heightM}m</span>
              <span className={`text-[8px] uppercase block truncate ${isPeak ? 'text-rose-700 font-bold' : 'text-ink-muted'}`}>
                {isPeak ? 'GATE LOCK' : t.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-canvas rounded-xl border border-border text-[11px] font-mono text-ink-secondary flex items-center justify-between">
        <span>Spring Tide Peak: <strong className="text-rose-700">{peakTide.time} ({peakTide.heightM}m)</strong></span>
        <span>•</span>
        <span>Backflow Risk: <strong className="text-rose-800">{peakTide.backflowRisk}</strong></span>
      </div>
    </div>
  );
}
