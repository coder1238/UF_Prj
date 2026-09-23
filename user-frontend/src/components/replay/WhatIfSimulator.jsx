import React from 'react';
import { Sliders, ShieldCheck, CheckCircle2, AlertTriangle, ArrowDownRight, RotateCcw } from 'lucide-react';

export default function WhatIfSimulator({ 
  whatIfState, 
  onToggleWhatIf, 
  onResetWhatIf,
  currentStep,
  selectedEvent
}) {
  const { tanksActive, flapGatesActive, pumpBoostActive, mithiDesiltingActive } = whatIfState;

  // Compute depth reduction percentage
  let reductionPercent = 0;
  if (tanksActive) reductionPercent += 28;
  if (flapGatesActive && currentStep.tide > 3.0) reductionPercent += 16;
  if (pumpBoostActive) reductionPercent += 22;
  if (mithiDesiltingActive) reductionPercent += 18;

  // Cap reduction at 65% max physical limit
  reductionPercent = Math.min(65, reductionPercent);

  const baselineDepth = currentStep.depth;
  const mitigatedDepth = Math.max(2, Math.round(baselineDepth * (1 - reductionPercent / 100)));
  const depthSaved = baselineDepth - mitigatedDepth;

  // Road closures prevented
  const roadsSaved = Math.min(currentStep.roadsClosed, Math.round(currentStep.roadsClosed * (reductionPercent / 100) * 1.2));
  const activeRoadsClosed = Math.max(0, currentStep.roadsClosed - roadsSaved);

  // Economic loss avoided (Crores INR)
  const economicSaved = ((currentStep.economicRate * (reductionPercent / 100))).toFixed(1);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Sliders className="w-4 h-4" /> Counterfactual Hydraulic Engine
          </div>
          <h3 className="text-lg font-bold text-ink mt-0.5">
            "What-If" Municipal Infrastructure Interventions
          </h3>
          <p className="text-xs text-muted mt-1">
            Toggle modern flood defense projects to simulate how past disasters would play out today.
          </p>
        </div>

        <button 
          onClick={onResetWhatIf}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
        </button>
      </div>

      {/* 4 Interactive Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Toggle 1: 30ML Tanks */}
        <div 
          onClick={() => onToggleWhatIf('tanksActive')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            tanksActive 
              ? 'bg-purple-50/70 border-purple-primary shadow-sm' 
              : 'bg-canvas border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink">30-ML Subterranean Tanks</span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              tanksActive ? 'bg-purple-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {tanksActive ? '✓' : ''}
            </span>
          </div>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Pramod Mahajan & St. Xavier's retention sumps buffering 30,000 m³ of gravity runoff.
          </p>
          <div className="mt-2 text-[11px] font-mono font-bold text-purple-700">
            Impact: -28% Localized Inundation
          </div>
        </div>

        {/* Toggle 2: Flap Gates */}
        <div 
          onClick={() => onToggleWhatIf('flapGatesActive')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            flapGatesActive 
              ? 'bg-purple-50/70 border-purple-primary shadow-sm' 
              : 'bg-canvas border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink">Automated Tide Flap Gates</span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              flapGatesActive ? 'bg-purple-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {flapGatesActive ? '✓' : ''}
            </span>
          </div>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            One-way flap barriers preventing Arabian Sea tidal ingress during high tide crests.
          </p>
          <div className="mt-2 text-[11px] font-mono font-bold text-purple-700">
            Impact: -16% Backflow Suppression
          </div>
        </div>

        {/* Toggle 3: Pump Boost */}
        <div 
          onClick={() => onToggleWhatIf('pumpBoostActive')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            pumpBoostActive 
              ? 'bg-purple-50/70 border-purple-primary shadow-sm' 
              : 'bg-canvas border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink">+50% Dewatering Pump Boost</span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              pumpBoostActive ? 'bg-purple-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {pumpBoostActive ? '✓' : ''}
            </span>
          </div>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Heavy diesel turbine generators deployed at critical depression sumps & subways.
          </p>
          <div className="mt-2 text-[11px] font-mono font-bold text-purple-700">
            Impact: -22% Peak Depth Duration
          </div>
        </div>

        {/* Toggle 4: Mithi River Desilting */}
        <div 
          onClick={() => onToggleWhatIf('mithiDesiltingActive')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            mithiDesiltingActive 
              ? 'bg-purple-50/70 border-purple-primary shadow-sm' 
              : 'bg-canvas border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink">Mithi River Deepening & Desilting</span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              mithiDesiltingActive ? 'bg-purple-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {mithiDesiltingActive ? '✓' : ''}
            </span>
          </div>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Enlarged cross-sectional discharge profile mitigating Kurla & Kalina overflow.
          </p>
          <div className="mt-2 text-[11px] font-mono font-bold text-purple-700">
            Impact: -18% Fluvial Overtopping
          </div>
        </div>
      </div>

      {/* Real-Time Counterfactual Impact Bar */}
      <div className="bg-purple-950 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-900 rounded-2xl text-purple-300">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-purple-300 tracking-wider">
              Counterfactual Simulated Depth
            </div>
            <div className="text-3xl font-extrabold font-mono mt-0.5">
              {mitigatedDepth} cm
              <span className="text-sm font-normal text-purple-300 ml-2">
                (vs {baselineDepth} cm baseline)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] font-mono text-purple-300 uppercase block">Roads Rescued</span>
            <span className="text-xl font-bold font-mono text-emerald-400">+{roadsSaved}</span>
            <span className="text-[10px] text-purple-300 block">{activeRoadsClosed} still closed</span>
          </div>

          <div className="h-8 w-px bg-purple-800" />

          <div className="text-center">
            <span className="text-[10px] font-mono text-purple-300 uppercase block">Disruption Avoided</span>
            <span className="text-xl font-bold font-mono text-cyan-400">₹{economicSaved} Cr</span>
            <span className="text-[10px] text-purple-300 block">estimated savings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

