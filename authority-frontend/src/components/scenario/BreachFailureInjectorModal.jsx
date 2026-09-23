import React from 'react';
import { X, ShieldAlert, Flame, CheckCircle2 } from 'lucide-react';
import { FAILURE_INJECTOR_ITEMS } from './scenarioConstants';

export default function BreachFailureInjectorModal({ isOpen, onClose, activeBreaches, onToggleBreach }) {
  if (!isOpen) return null;

  const totalDeltaDepth = FAILURE_INJECTOR_ITEMS
    .filter((f) => activeBreaches[f.id])
    .reduce((sum, f) => sum + f.deltaDepth, 0);

  const totalDeltaArea = FAILURE_INJECTOR_ITEMS
    .filter((f) => activeBreaches[f.id])
    .reduce((sum, f) => sum + f.deltaArea, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Hydraulic Structural Breach &amp; Failure Point Injector
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                  FAILURE MODE SIMULATION
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Stress-test municipal resilience against catastrophic structural collapses, gate jams, and transformer blackouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Cumulative Impact Bar */}
        <div className="p-3.5 bg-canvas border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Active Failures</span>
            <div className="text-lg font-bold font-mono text-status-alert mt-0.5">
              {Object.values(activeBreaches).filter(Boolean).length} / {FAILURE_INJECTOR_ITEMS.length} Active
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Cumulative Depth Spike</span>
            <div className="text-lg font-bold font-mono text-status-alert mt-0.5">
              +{totalDeltaDepth.toFixed(1)} cm
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Additional Flooded Area</span>
            <div className="text-lg font-bold font-mono text-status-warning mt-0.5">
              +{totalDeltaArea.toFixed(2)} km²
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Cascading Hazard Risk</span>
            <div className="text-lg font-bold font-mono text-purple mt-0.5">
              {Object.values(activeBreaches).filter(Boolean).length > 2 ? 'CRITICAL (TIER-4)' : Object.values(activeBreaches).filter(Boolean).length > 0 ? 'ELEVATED' : 'NOMINAL'}
            </div>
          </div>
        </div>

        {/* Breach Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {FAILURE_INJECTOR_ITEMS.map((item) => {
            const isActive = !!activeBreaches[item.id];
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-status-alert-soft/30 border-status-alert shadow-subtle'
                    : 'bg-surface border-border hover:border-purple/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-ink">{item.title}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          item.severity === 'CATASTROPHIC'
                            ? 'bg-status-alert text-white'
                            : item.severity === 'SEVERE'
                            ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                            : 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary font-mono mb-1.5 flex items-center gap-2">
                      <span className="text-ink font-semibold">{item.location}</span>
                      <span>•</span>
                      <span className="text-purple font-semibold">{item.dischargeRate}</span>
                    </div>

                    <p className="text-xs text-ink-secondary leading-relaxed">{item.impactDesc}</p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] font-mono">
                      <span className="text-status-alert font-bold">
                        Local Depth Surge: +{item.deltaDepth} cm
                      </span>
                      <span className="text-status-warning font-semibold">
                        Impact Footprint: +{item.deltaArea} km²
                      </span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => onToggleBreach(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-status-alert text-white shadow-subtle'
                        : 'bg-surface-secondary border border-border text-ink hover:border-status-alert/40'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Flame className="w-3.5 h-3.5" />
                        <span>BREACH INJECTED</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" />
                        <span>STRUCTURAL INTACT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-ink-secondary">
            Hydrodynamic shockwaves recalculated using Riemann shock-capturing solver
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white font-bold rounded-xl text-xs shadow-subtle hover:bg-purple-deep transition-colors"
          >
            Apply Breaches &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
