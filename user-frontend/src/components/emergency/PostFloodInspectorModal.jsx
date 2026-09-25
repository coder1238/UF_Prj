import React, { useState } from 'react';
import { 
  Home, ShieldAlert, CheckCircle2, AlertOctagon, 
  Droplets, Zap, Wrench, X, Calculator, RefreshCw 
} from 'lucide-react';

export default function PostFloodInspectorModal({ isOpen, onClose }) {
  const [checkedSteps, setCheckedSteps] = useState({
    electric: false,
    gas: false,
    structure: false,
    wildlife: false,
    waterTest: false
  });

  const [floodAreaSqFt, setFloodAreaSqFt] = useState(650);

  if (!isOpen) return null;

  const toggleStep = (key) => {
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Disinfection formula: 1 cup bleach (240ml) per 19 liters water per 200 sq ft
  const bleachNeededLiters = ((floodAreaSqFt / 200) * 0.24).toFixed(2);
  const waterDilutionLiters = Math.round((floodAreaSqFt / 200) * 19);

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Home className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">Feature #15</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800">
                  CDC & MCGM Re-Entry Rules
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Post-Flood Structural & Re-Entry Safety Inspector</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Re-entry Checklist */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Mandatory Re-Entry Clearance Checklist:
            </span>

            <div className="space-y-2.5">
              {[
                { key: 'electric', title: '01. Main Electrical Circuit Breaker Lockout', desc: 'Do NOT turn power on from inside wet rooms. Have a certified wireman inspect meters first; arc flash risk is critical.', icon: Zap },
                { key: 'gas', title: '02. MGL Pipeline Sniff Inspection', desc: 'Smell for rotten-egg mercaptan odor. If detected, do not flip light switches or ignite matches. Evacuate immediately.', icon: AlertOctagon },
                { key: 'structure', title: '03. Structural Foundation & Plinth Subsidence', desc: 'Check walls for 45-degree diagonal shear cracks. If lintels or door frames are jammed, soil settlement has occurred.', icon: Home },
                { key: 'wildlife', title: '04. Displaced Viper / Snake Check', desc: 'Receding floodwaters force vipers, cobras, and scorpions into dry furniture, cupboards, and mattresses. Prod with a stick before handling.', icon: ShieldAlert }
              ].map(item => {
                const Icon = item.icon;
                const isDone = checkedSteps[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleStep(item.key)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors text-xs ${
                      isDone 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span>{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isDone ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isDone ? 'VERIFIED ✓' : 'UNCHECKED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disinfection Dosage Calculator */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> SEWAGE DISINFECTION DOSAGE CALCULATOR
              </span>
              <span className="text-white font-bold">{floodAreaSqFt} sq ft</span>
            </div>

            <input 
              type="range"
              min="200"
              max="2500"
              step="50"
              value={floodAreaSqFt}
              onChange={(e) => setFloodAreaSqFt(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HOUSEHOLD BLEACH (5-6% SODIUM HYPOCHLORITE)</span>
                <span className="text-amber-400 font-bold text-base">{bleachNeededLiters} Liters</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">POTABLE DILUTION WATER</span>
                <span className="text-cyan-400 font-bold text-base">{waterDilutionLiters} Liters</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal">
              *Never mix bleach with ammonia or acid cleaners (causes deadly toxic chloramine gas). Wear rubber boots, gloves, and eye goggles during scrubbing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

