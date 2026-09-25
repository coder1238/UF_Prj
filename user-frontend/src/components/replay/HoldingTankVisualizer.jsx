import React from 'react';
import { Database, Waves, ArrowDown, ArrowUp, ShieldCheck } from 'lucide-react';

export default function HoldingTankVisualizer({ currentStep, whatIfModifiers }) {
  const isTanksActive = whatIfModifiers?.tanksActive ?? true;
  const rawFill = currentStep.tankFill || 0;
  // If what-if disabled tanks, show disabled
  const fillPercent = isTanksActive ? rawFill : 0;
  const totalVolumeML = 30; // 30 Million Litres
  const currentVolumeML = ((fillPercent / 100) * totalVolumeML).toFixed(1);
  const remainingVolumeML = (totalVolumeML - currentVolumeML).toFixed(1);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Database className="w-4 h-4" /> Underground Retention Telematics
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
            isTanksActive ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            {isTanksActive ? '30-ML TANKS ONLINE' : 'OFFLINE (COUNTERFACTUAL)'}
          </span>
        </div>

        <h3 className="text-base font-bold text-ink">
          Hindmata Subterranean Retention Tanks (Pramod Mahajan & St. Xavier's)
        </h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Twin subterranean concrete holding reservoirs located 15 meters below ground to buffer cloudburst runoff during high tide blockades.
        </p>
      </div>

      {/* Animated 3D Reservoir Cross-Section */}
      <div className="my-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
        {/* Ground Surface Line */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-700 pb-1 mb-3">
          <span>SURFACE GRADE (EL +4.2m MSL)</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <ArrowDown className="w-3 h-3 animate-bounce" /> Gravity Inflow: {currentStep.rain > 50 ? '3,400 L/s' : '850 L/s'}
          </span>
        </div>

        {/* Concrete Reservoir Chamber Visual */}
        <div className="h-28 bg-slate-950 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col justify-end p-2">
          {/* Water fill gradient */}
          <div 
            className="w-full bg-gradient-to-t from-blue-700 via-cyan-600 to-cyan-400 transition-all duration-500 relative"
            style={{ height: `${fillPercent}%` }}
          >
            {/* Water surface wave line */}
            <div className="w-full h-1 bg-cyan-200 opacity-80" />
          </div>

          {/* Chamber HUD overlay text */}
          <div className="absolute inset-0 flex items-center justify-center font-mono text-center pointer-events-none">
            <div>
              <span className="text-2xl font-extrabold text-white drop-shadow-md">
                {currentVolumeML} <span className="text-xs font-normal text-cyan-200">ML stored</span>
              </span>
              <span className="text-[11px] text-cyan-100 block font-bold drop-shadow">
                {fillPercent}% Capacity Filled
              </span>
            </div>
          </div>
        </div>

        {/* Pump Outflow Discharge Line */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 mt-2">
          <span>SUBTERRANEAN SUMP FLOOR (-11.0m)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ArrowUp className="w-3 h-3" /> Pump Evacuation: {fillPercent > 80 ? 'Heavy Dewatering' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Metrics footer */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-canvas border border-slate-200 text-slate-700">
          <span className="text-[10px] text-muted block uppercase">Buffer Remaining</span>
          <span className="font-extrabold text-purple-700">{remainingVolumeML} Million Litres</span>
        </div>
        <div className="p-2.5 rounded-xl bg-canvas border border-slate-200 text-slate-700">
          <span className="text-[10px] text-muted block uppercase">Discharge Basin</span>
          <span className="font-extrabold text-ink">Mahim Bay Pipeline</span>
        </div>
      </div>
    </div>
  );
}

