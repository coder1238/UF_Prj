import React from 'react';
import { X, Sliders, AlertOctagon, RefreshCw, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SensitivityStressLabModal({
  isOpen,
  onClose,
  sensitivityParams,
  onChangeParams,
  onResetParams,
}) {
  if (!isOpen) return null;

  const {
    rainMultiplier = 1.0,
    siltationPercent = 25,
    tidalSurgeM = 0.2,
    pumpFailureNMinusOne = false,
  } = sensitivityParams;

  // Composite stress factor
  const stressFactor =
    Math.round(
      (rainMultiplier *
        (1 + siltationPercent / 100 * 0.4) *
        (1 + tidalSurgeM * 0.15) *
        (pumpFailureNMinusOne ? 1.25 : 1.0)) *
        100
    ) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-status-alert">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Hydrodynamic Sensitivity & Stress-Testing Sandbox
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Simulate extreme weather anomalies and N-1 hardware contingencies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Stress Factor Display */}
          <div className="p-3.5 rounded-xl border border-status-alert/30 bg-status-alert-soft/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-status-alert uppercase font-bold">
                Hydrodynamic Stress Coefficient
              </span>
              <div className="text-xs text-ink-secondary mt-0.5">
                Composite model multiplier applied to runoff & backwater
              </div>
            </div>
            <div className="font-mono text-2xl font-bold text-status-alert">
              {stressFactor}x
            </div>
          </div>

          {/* Slider 1: Rain Multiplier */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-ink">Rainfall Cloudburst Intensity:</span>
              <span className="font-mono font-bold text-purple">
                {Math.round((rainMultiplier - 1) * 100)}% ({Math.round(80 * rainMultiplier)} mm/h)
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={rainMultiplier}
              onChange={(e) =>
                onChangeParams({ ...sensitivityParams, rainMultiplier: Number(e.target.value) })
              }
              className="w-full accent-purple"
            />
          </div>

          {/* Slider 2: Drain Siltation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-ink">Trunk Drain Siltation & Solid Choking:</span>
              <span className="font-mono font-bold text-amber-600">
                {siltationPercent}% Section Restricted
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={siltationPercent}
              onChange={(e) =>
                onChangeParams({ ...sensitivityParams, siltationPercent: Number(e.target.value) })
              }
              className="w-full accent-amber-500"
            />
          </div>

          {/* Slider 3: Tidal Surge Anomaly */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-ink">Coastal Storm Surge / Wave Setup Anomaly:</span>
              <span className="font-mono font-bold text-cyan-700">
                +{tidalSurgeM.toFixed(2)} m MSL
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.2"
              step="0.05"
              value={tidalSurgeM}
              onChange={(e) =>
                onChangeParams({ ...sensitivityParams, tidalSurgeM: Number(e.target.value) })
              }
              className="w-full accent-cyan-600"
            />
          </div>

          {/* Contingency Toggle: N-1 Pump Failure */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-ink">N-1 Critical Pump Failure Contingency</div>
              <div className="text-[11px] text-ink-secondary">
                Simulates unexpected diesel generator trip at primary sump
              </div>
            </div>
            <button
              onClick={() =>
                onChangeParams({
                  ...sensitivityParams,
                  pumpFailureNMinusOne: !pumpFailureNMinusOne,
                })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pumpFailureNMinusOne
                  ? 'bg-status-alert text-white shadow-subtle'
                  : 'bg-white text-ink-secondary border border-border'
              }`}
            >
              {pumpFailureNMinusOne ? 'TRIP ACTIVE' : 'NOMINAL'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <button
            onClick={onResetParams}
            className="px-3 py-1.5 rounded-lg border border-border bg-white text-ink-secondary hover:text-ink flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Baseline (1.0x)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle"
          >
            Apply Sensitivity Factor
          </button>
        </div>
      </div>
    </div>
  );
}

