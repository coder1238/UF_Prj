import React, { useState } from 'react';
import { X, GitCommit } from 'lucide-react';

export default function FlowTopologyModal({ isOpen, onClose, selectedNode, showToast }) {
  const [regimeMode, setRegimeMode] = useState('gravity'); // gravity | pressurized
  const [internalPressureBar, setInternalPressureBar] = useState(0.35); // bar
  const [airValvesWorking, setAirValvesWorking] = useState(true);

  if (!isOpen || !selectedNode) return null;

  // Water hammer wave speed a ~ 1000 m/s for concrete/water
  const rho = 1000; // kg/m3
  const a = 1000; // m/s
  const deltaV = regimeMode === 'pressurized' ? 2.4 : 0.4;
  const JoukowskySurgePressureKPa = ((rho * a * deltaV) / 1000).toFixed(0);
  const surgeRisk = regimeMode === 'pressurized' && !airValvesWorking ? 'HIGH RISK' : 'CONTROLLED';

  const handleToggleMode = (mode) => {
    setRegimeMode(mode);
    showToast(`Conduit hydraulic regime switched to: ${mode.toUpperCase()} FLOW`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Hydraulic Flow Regime &amp; Force-Main Topology Switcher
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  SURCHARGE TRANSITION SOLVER
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • Gravity Free-Surface vs Pressurized Full-Pipe Transition
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Regime Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleToggleMode('gravity')}
              className={`p-4 rounded-xl border text-left transition-all ${
                regimeMode === 'gravity'
                  ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              <div className="text-xs font-bold uppercase mb-1">Gravity Open-Channel Flow</div>
              <p className="text-[11px] text-ink-secondary font-sans">
                Free surface water profile, atmospheric pressure crown, Manning equation governing flow.
              </p>
            </button>

            <button
              onClick={() => handleToggleMode('pressurized')}
              className={`p-4 rounded-xl border text-left transition-all ${
                regimeMode === 'pressurized'
                  ? 'bg-red-500/10 text-red-500 border-red-500 font-bold shadow-subtle'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              <div className="text-xs font-bold uppercase mb-1">Pressurized Force-Main Regime</div>
              <p className="text-[11px] text-ink-secondary font-sans">
                Crown submerged, full-pipe pressurized conveyance, piezometric head exceeds ground level.
              </p>
            </button>
          </div>

          {/* Water Hammer & Surge Gauge */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center justify-between">
              <span>Transient Water Hammer &amp; Surge Pressure Analysis</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                surgeRisk === 'HIGH RISK' ? 'bg-status-alert-soft text-status-alert' : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                {surgeRisk}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Joukowsky Transient Head (ΔP)</span>
                <span className="text-lg font-bold text-ink">{JoukowskySurgePressureKPa} kPa</span>
                <span className="text-[10px] text-ink-secondary block">ΔP = ρ × a × ΔV</span>
              </div>

              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Internal Pressure</span>
                <span className="text-lg font-bold text-purple">{internalPressureBar} Bar</span>
                <span className="text-[10px] text-ink-secondary block">Design limit: 1.20 Bar</span>
              </div>

              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Air Release Valves (ARV)</span>
                <div className="flex items-center justify-between mt-1">
                  <span className={`font-bold ${airValvesWorking ? 'text-status-safe' : 'text-status-alert'}`}>
                    {airValvesWorking ? 'Active (8/8 Venting)' : 'Clogged / Staged'}
                  </span>
                  <button
                    onClick={() => setAirValvesWorking(!airValvesWorking)}
                    className="text-[9px] underline text-purple"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>

            {/* Pressure Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-secondary">Internal Piezometric Backpressure:</span>
                <span className="text-purple font-bold">{internalPressureBar} Bar</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.05"
                value={internalPressureBar}
                onChange={(e) => setInternalPressureBar(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Topology Switcher
          </button>
        </div>
      </div>
    </div>
  );
}

