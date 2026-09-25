import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { WHAT_IF_INTERVENTIONS } from './scenarioConstants';

export default function WhatIfInterventionLayer({
  activeWhatIfs,
  onToggleWhatIf,
}) {
  const activeCount = Object.values(activeWhatIfs).filter(Boolean).length;
  
  const totalDepthMitigation = WHAT_IF_INTERVENTIONS
    .filter((w) => activeWhatIfs[w.id])
    .reduce((sum, w) => sum + w.depthReductionCm, 0);

  const totalClearanceMitigation = WHAT_IF_INTERVENTIONS
    .filter((w) => activeWhatIfs[w.id])
    .reduce((sum, w) => sum + w.clearanceReductionHrs, 0);

  const totalCostLakhs = WHAT_IF_INTERVENTIONS
    .filter((w) => activeWhatIfs[w.id])
    .reduce((sum, w) => sum + w.costLakhs, 0);

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-safe-soft text-status-safe">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Counterfactual "What-If" Interventions
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                {activeCount} APPLIED
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Overlay rapid municipal emergency countermeasures to model hydraulic flood attenuation
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-status-safe font-bold">
              Δ -{totalDepthMitigation.toFixed(1)} cm
            </span>
            <span className="text-purple font-bold">
              -{totalClearanceMitigation.toFixed(1)} hrs
            </span>
          </div>
        )}
      </div>

      {/* Intervention Toggle Items */}
      <div className="space-y-2">
        {WHAT_IF_INTERVENTIONS.map((item) => {
          const isActive = !!activeWhatIfs[item.id];

          return (
            <div
              key={item.id}
              onClick={() => onToggleWhatIf(item.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-status-safe-soft/30 border-status-safe/60'
                  : 'bg-surface-secondary/40 border-border hover:border-border-strong hover:bg-surface-secondary/80'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  className="mt-0.5 text-ink-muted hover:text-ink transition-colors"
                >
                  {isActive ? (
                    <ToggleRight className="w-6 h-6 text-status-safe" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-ink-muted" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{item.title}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-ink-secondary font-bold">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">
                    Target Area: <strong className="text-ink">{item.targetArea}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-right font-mono text-[11px] shrink-0">
                <div>
                  <span className="text-status-safe font-bold block">-{item.depthReductionCm} cm</span>
                  <span className="text-[9px] text-ink-muted">-{item.clearanceReductionHrs}h clear</span>
                </div>
                <div className="text-[10px] text-ink-secondary px-2 py-1 rounded bg-surface border border-border">
                  ₹{item.costLakhs}L
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cumulative Attenuation Summary Bar */}
      {activeCount > 0 && (
        <div className="p-2 rounded-lg bg-surface-secondary/70 border border-border flex items-center justify-between text-xs font-mono">
          <span className="text-ink-secondary">Net Deployment Cost: <strong>₹{totalCostLakhs} Lakhs</strong></span>
          <span className="text-status-safe font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reduces citywide flooded footprint by ~{(totalDepthMitigation * 0.08).toFixed(2)} km²
          </span>
        </div>
      )}
    </div>
  );
}
