import React from 'react';
import { X, History, Check, ArrowRight } from 'lucide-react';
import { BENCHMARK_PRESETS } from './scenarioConstants';

export default function ScenarioBenchmarkPresets({
  isOpen,
  onClose,
  currentParams,
  onApplyPreset,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Historical Extreme Storm &amp; Calibrated Benchmark Presets
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  BMC ARCHIVES
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Load validated historical storm profiles, cloudburst footprints, and boundary tidal surge states
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

        {/* Preset List */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-140px)]">
          {BENCHMARK_PRESETS.map((preset) => {
            const isMatch =
              currentParams.rainfallIntensity === preset.params.rainfallIntensity &&
              currentParams.durationMin === preset.params.durationMin &&
              currentParams.drainBlockage === preset.params.drainBlockage &&
              currentParams.pumpingCapacity === preset.params.pumpingCapacity &&
              currentParams.tideLevel === preset.params.tideLevel;

            return (
              <div
                key={preset.id}
                className={`p-4 rounded-xl border transition-all ${
                  isMatch
                    ? 'bg-purple-soft/40 border-purple ring-1 ring-purple'
                    : 'bg-surface border-border hover:border-purple/50 hover:bg-surface-secondary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-ink">{preset.name}</h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${preset.badgeColor}`}>
                        {preset.badge}
                      </span>
                      {isMatch && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE APPLIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onApplyPreset(preset.params);
                      onClose();
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isMatch
                        ? 'bg-purple text-white shadow-sm'
                        : 'bg-surface border border-border hover:bg-purple hover:text-white text-ink'
                    }`}
                  >
                    <span>{isMatch ? 'Re-Apply' : 'Load Preset'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Param telemetry tags */}
                <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                  <div className="p-1.5 rounded bg-surface-secondary/60">
                    <span className="text-[10px] text-ink-secondary block">Intensity</span>
                    <strong className="text-status-alert">{preset.params.rainfallIntensity} mm/h</strong>
                  </div>
                  <div className="p-1.5 rounded bg-surface-secondary/60">
                    <span className="text-[10px] text-ink-secondary block">Duration</span>
                    <strong className="text-ink">{preset.params.durationMin} mins</strong>
                  </div>
                  <div className="p-1.5 rounded bg-surface-secondary/60">
                    <span className="text-[10px] text-ink-secondary block">Drain Silt</span>
                    <strong className="text-status-warning">{preset.params.drainBlockage}% blocked</strong>
                  </div>
                  <div className="p-1.5 rounded bg-surface-secondary/60">
                    <span className="text-[10px] text-ink-secondary block">Pump Cap</span>
                    <strong className="text-purple">{preset.params.pumpingCapacity}% ops</strong>
                  </div>
                  <div className="p-1.5 rounded bg-surface-secondary/60">
                    <span className="text-[10px] text-ink-secondary block">Tide Level</span>
                    <strong className="text-status-alert">{preset.params.tideLevel} m MSL</strong>
                  </div>
                </div>

                {/* Modeled Baseline Impact */}
                <div className="mt-2 flex items-center gap-4 text-[10px] font-mono text-ink-secondary">
                  <span>Modeled Roads Cut: <strong className="text-status-alert">{preset.metrics.roadsCut}</strong></span>
                  <span>Max Depth: <strong className="text-status-alert">{preset.metrics.maxDepthCm} cm</strong></span>
                  <span>Clearance: <strong className="text-purple">{preset.metrics.clearanceHrs} hrs</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Selecting a preset updates all hydrodynamic stress sliders and boundary hydrodynamic states instantly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg font-semibold text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
