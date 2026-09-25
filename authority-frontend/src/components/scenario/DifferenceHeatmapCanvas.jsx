import React from 'react';
import { Flame } from 'lucide-react';
import { WARD_SCENARIO_MATRIX } from './scenarioConstants';

export default function DifferenceHeatmapCanvas({ scenarioParams, onSelectWard }) {
  const surgeFactor = 1 + (scenarioParams.rainfallIntensity - 50) * 0.015 + (scenarioParams.drainBlockage / 100) * 0.45;

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-alert-soft text-status-alert">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Differential Inundation Heat Matrix (Δ Depth Heatmap)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                16 WARDS
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Spatial differential heatmap illustrating localized surge spikes over operational baseline
            </p>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-ink-secondary">Heat scale:</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">&lt;10cm</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">10-25cm</span>
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">25-40cm</span>
          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold">&gt;40cm</span>
        </div>
      </div>

      {/* Heat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {WARD_SCENARIO_MATRIX.map((w) => {
          const scenarioDepth = Math.round(w.baseDepth * surgeFactor);
          const deltaDepth = scenarioDepth - w.baseDepth;

          let heatBg = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
          if (deltaDepth > 30) {
            heatBg = 'bg-red-600/30 border-red-500 text-red-400 font-bold';
          } else if (deltaDepth > 18) {
            heatBg = 'bg-amber-500/20 border-amber-500/40 text-amber-400';
          } else if (deltaDepth > 10) {
            heatBg = 'bg-purple-soft border-purple/40 text-purple';
          }

          return (
            <div
              key={w.ward}
              onClick={() => onSelectWard && onSelectWard(w)}
              className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.03] ${heatBg}`}
            >
              <div>
                <span className="text-[10px] font-mono block opacity-80">{w.ward}</span>
                <span className="text-xs font-bold block truncate" title={w.name}>{w.name.split('/')[0]}</span>
              </div>

              <div className="mt-2 pt-1.5 border-t border-current/20 font-mono text-right">
                <span className="text-sm font-bold block">+{deltaDepth} cm</span>
                <span className="text-[9px] opacity-75 block">Total: {scenarioDepth}cm</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
