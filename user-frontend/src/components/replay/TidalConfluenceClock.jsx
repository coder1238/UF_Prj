import React from 'react';
import { Waves, Clock, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function TidalConfluenceClock({ currentStep, selectedEvent }) {
  const tide = currentStep.tide || 2.5;
  const isGatesClosed = tide >= 3.8;
  const peakTideInfo = selectedEvent.highTidePeak || '4.2m at 18:00 IST';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Waves className="w-4 h-4" /> Astronomical Ocean Telemetry
          </div>
          <span className="text-[10px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full font-bold">
            Arabian Sea Gauge
          </span>
        </div>

        <h3 className="text-base font-bold text-ink">
          High Tide & Outfall Lockout Harmonic Clock
        </h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          When Arabian Sea tide crests above 3.8m, Mumbai's 45 shoreline gravity flap gates close automatically to prevent seawater from flooding into the low-lying island city.
        </p>
      </div>

      {/* Main Gauge Graphic */}
      <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-cyan-300 uppercase block">Current Astronomical Tide</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-0.5">
            {tide.toFixed(2)} <span className="text-sm font-normal text-slate-300">m above MSL</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            Peak for Event: <span className="text-cyan-300 font-bold">{peakTideInfo}</span>
          </span>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
            isGatesClosed 
              ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
          }`}>
            {isGatesClosed ? 'OUTLET GATES CLOSED' : 'GRAVITY OUTFLOW OPEN'}
          </span>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {isGatesClosed ? 'Backflow prevention active' : 'Free discharge into bay'}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-canvas p-3 rounded-2xl border border-slate-200/70">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-purple-primary" />
          <span>Timestamp: <span className="font-bold text-ink">{currentStep.time} IST</span></span>
        </div>
        <div className="text-[11px]">
          Surcharge Penalty: <span className={`font-bold ${isGatesClosed ? 'text-red-600' : 'text-emerald-600'}`}>
            {isGatesClosed ? '100% Gravity Blocked' : '0% Gravity Loss'}
          </span>
        </div>
      </div>
    </div>
  );
}

