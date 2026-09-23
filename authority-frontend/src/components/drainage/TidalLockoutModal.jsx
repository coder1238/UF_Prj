import React, { useState } from 'react';
import { X, Waves, Lock, Unlock, Clock } from 'lucide-react';
import { TIDAL_SLUICE_GATES } from './drainageConstants';

export default function TidalLockoutModal({ isOpen, onClose, showToast }) {
  const [sluiceGates, setSluiceGates] = useState(TIDAL_SLUICE_GATES);
  const [selectedGateId, setSelectedGateId] = useState(TIDAL_SLUICE_GATES[0].id);
  const [seaTideHeight, setSeaTideHeight] = useState(4.25); // m MSL

  if (!isOpen) return null;

  const activeGate = sluiceGates.find((g) => g.id === selectedGateId) || sluiceGates[0];

  const handleManualOverride = (gateId) => {
    setSluiceGates((prev) =>
      prev.map((g) => {
        if (g.id !== gateId) return g;
        const isShut = g.autoStatus.includes('SHUT');
        return {
          ...g,
          autoStatus: isShut ? 'MANUAL OVERRIDE: OPEN' : 'AUTO CONTROL: SHUT',
          gateAngleDeg: isShut ? 75 : 0,
          dischargeM3s: isShut ? 24.5 : 0.0,
          lockoutRisk: isShut ? 'OVERRIDE DISCHARGE ACTIVE' : 'LOCKED',
        };
      })
    );
    showToast(`Manual Hydraulic Override executed for ${activeGate.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-500">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Tidal Lockout & Flap Gate Hydrodynamic Simulator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-500 font-bold">
                  ARABIAN SEA TIDE TELEMETRY
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Coastal Sluice Backflow Prevention & Gravitational Discharge Windows
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Tide Level Controller */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-ink-secondary block">Astronomical Spring High Tide</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-mono font-bold text-ink">{seaTideHeight.toFixed(2)} m</span>
                <span className="text-xs font-mono text-cyan-500 font-semibold">MSL (Peak 4.88m at 19:45 IST)</span>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-ink-secondary">Simulate Sea Surge:</span>
                <span className="text-cyan-500 font-bold">{seaTideHeight.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="2.50"
                max="5.10"
                step="0.05"
                value={seaTideHeight}
                onChange={(e) => setSeaTideHeight(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Gate Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sluiceGates.map((gate) => {
              const diff = gate.drainLevelMSL - seaTideHeight;
              const isLocked = diff < 0;
              return (
                <button
                  key={gate.id}
                  onClick={() => setSelectedGateId(gate.id)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all ${
                    selectedGateId === gate.id
                      ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  <div className="text-[10px] text-ink-secondary truncate">{gate.location}</div>
                  <div className="text-xs font-bold truncate mt-0.5">{gate.name.split(' (')[0]}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-status-alert' : 'bg-status-safe'}`} />
                    <span className={isLocked ? 'text-status-alert font-bold' : 'text-status-safe'}>
                      {isLocked ? 'TIDAL LOCK' : 'DISCHARGING'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Gate Hydrodynamics */}
          <div className="bg-canvas border border-border rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-sm text-ink">{activeGate.name}</h4>
                <p className="text-xs text-ink-secondary">{activeGate.location} • Opening: {activeGate.gateWidthM}m x {activeGate.gateHeightM}m</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                activeGate.autoStatus.includes('SHUT') ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
              }`}>
                {activeGate.autoStatus}
              </span>
            </div>

            {/* Differential Head Calculation Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] uppercase font-mono text-ink-secondary block">Inland Stormwater Head</span>
                <span className="text-xl font-mono font-bold text-ink">{activeGate.drainLevelMSL.toFixed(2)} m MSL</span>
                <span className="text-[10px] text-ink-secondary block mt-0.5">At culvert outfall apron</span>
              </div>

              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] uppercase font-mono text-ink-secondary block">Sea / Tide Surface Level</span>
                <span className="text-xl font-mono font-bold text-cyan-500">{seaTideHeight.toFixed(2)} m MSL</span>
                <span className="text-[10px] text-ink-secondary block mt-0.5">Estuarine water elevation</span>
              </div>

              <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                <span className="text-[10px] uppercase font-mono text-ink-secondary block">Differential Head (ΔH)</span>
                {(() => {
                  const deltaH = activeGate.drainLevelMSL - seaTideHeight;
                  return (
                    <>
                      <span className={`text-xl font-mono font-bold ${deltaH < 0 ? 'text-status-alert' : 'text-status-safe'}`}>
                        {deltaH > 0 ? `+${deltaH.toFixed(2)} m` : `${deltaH.toFixed(2)} m`}
                      </span>
                      <span className="text-[10px] text-ink-secondary block mt-0.5">
                        {deltaH < 0 ? 'Reverse Backflow Pressure (+0.35 bar)' : 'Positive Gravitational Head'}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Gravity Window Countdown */}
            <div className="bg-surface-secondary p-3.5 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple" />
                <span className="text-xs text-ink">
                  Estimated Gravity Outfall Window: <strong>{activeGate.gravityWindowNext}</strong>
                </span>
              </div>
              <button
                onClick={() => handleManualOverride(activeGate.id)}
                className="px-3 py-1.5 rounded-lg bg-surface border border-purple text-purple hover:bg-purple hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {activeGate.autoStatus.includes('SHUT') ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Toggle Manual Gate Actuator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

