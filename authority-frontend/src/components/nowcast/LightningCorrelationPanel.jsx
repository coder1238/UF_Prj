import React from 'react';
import {
  Zap,
  ShieldAlert,
  X,
} from 'lucide-react';

export default function LightningCorrelationPanel({
  isOpen,
  onClose,
  showLightning,
  onToggleLightning,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-elevated overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Lightning Sensor Density &amp; Cell Electrification
              </h3>
              <p className="text-xs text-ink-secondary">
                IITM Lightning Detection Network assimilation with Doppler VIL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Radar Lightning Toggle */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-ink">Show Lightning Flashes on Radar</div>
              <div className="text-[10px] text-ink-secondary font-mono">
                Renders animated CG/IC stroke clusters on polar map
              </div>
            </div>
            <button
              onClick={onToggleLightning}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                showLightning
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-surface text-ink border-border hover:border-amber-400'
              }`}
            >
              {showLightning ? 'FLASHES ACTIVE' : 'ENABLE FLASHES'}
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">15-Min Stroke Count</div>
              <div className="text-2xl font-mono font-bold text-ink mt-1 flex items-baseline gap-1">
                <span>142</span>
                <span className="text-xs font-normal text-ink-secondary">strokes</span>
              </div>
              <div className="text-[10px] font-mono text-amber-600 font-bold mt-1">
                Rate: 9.5 strokes/min (High)
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Updraft Electrification</div>
              <div className="text-2xl font-mono font-bold text-status-alert mt-1">
                88.4%
              </div>
              <div className="text-[10px] font-mono text-status-alert font-bold mt-1">
                Severe Convective Jump
              </div>
            </div>
          </div>

          {/* Stroke Classification */}
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-ink-secondary">Stroke Breakdown</span>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span>Cloud-to-Ground (CG Hazardous):</span>
                <strong className="text-status-alert font-bold">38 strokes (26.8%)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Intra-Cloud (IC Convective):</span>
                <strong className="text-purple font-bold">104 strokes (73.2%)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Peak Current Amplitude:</span>
                <strong className="text-ink font-bold">-48.2 kA (Colaba-Kurla)</strong>
              </div>
            </div>
          </div>

          {/* Operational Safety Advisory */}
          <div className="p-3 bg-status-alert-soft border border-status-alert/30 rounded-xl text-xs font-mono text-status-alert flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">CREW SAFETY WARNING ACTIVE</div>
              <div className="text-[11px] text-ink-secondary mt-0.5">
                Suspend all crane operations, metal scaffolding, and open stormwater suction pipe maintenance along Mithi River until lightning jump subsides.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            IITM Lightning Sensor Network • VLF/LF Time-of-Arrival
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
