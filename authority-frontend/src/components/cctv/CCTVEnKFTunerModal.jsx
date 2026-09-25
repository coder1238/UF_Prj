import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
  Cpu,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';

export default function CCTVEnKFTunerModal({
  isOpen,
  onClose,
  onApplyParams,
  initialParams = {
    ensembleSize: 100,
    processNoiseQ: 0.15,
    measurementNoiseR: 0.45,
    cvWeight: 0.85,
    iotWeight: 0.95,
    sweModelWeight: 0.65,
  },
}) {
  const [params, setParams] = useState(initialParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [convergenceHistory, setConvergenceHistory] = useState([
    { iter: 1, residual: 4.8 },
    { iter: 2, residual: 3.2 },
    { iter: 3, residual: 2.1 },
    { iter: 4, residual: 1.4 },
    { iter: 5, residual: 0.9 },
    { iter: 6, residual: 0.65 },
    { iter: 7, residual: 0.52 },
    { iter: 8, residual: 0.45 },
  ]);

  if (!isOpen) return null;

  // Calculate simulated Kalman gain
  const kalmanGainK = (
    params.processNoiseQ /
    (params.processNoiseQ + params.measurementNoiseR)
  ).toFixed(3);

  const covarianceTrace = (
    (1 - parseFloat(kalmanGainK)) *
    params.processNoiseQ *
    100
  ).toFixed(2);

  const handleSimulateAssimilation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newHistory = Array.from({ length: 8 }, (_, i) => ({
        iter: i + 1,
        residual: parseFloat(
          (4.8 * Math.exp(-0.45 * (i + 1)) * (params.measurementNoiseR / 0.5)).toFixed(2)
        ),
      }));
      setConvergenceHistory(newHistory);
      setIsSimulating(false);
    }, 600);
  };

  const handleSave = () => {
    onApplyParams(params);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Ensemble Kalman Filter (EnKF) Hyperparameter Tuner
              </h2>
              <p className="text-xs text-ink-secondary">
                Adjust stochastic perturbation matrix, covariance priors, and multi-sensor innovation weights.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-ink">
          {/* Kalman Gain & Covariance Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-purple-soft/30 rounded-xl border border-purple/20">
              <div className="text-[11px] font-mono text-purple uppercase font-semibold">
                Kalman Gain K
              </div>
              <div className="font-mono text-2xl font-bold text-purple mt-1">
                {kalmanGainK}
              </div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                Optimal weight: CV vs Gauge
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border">
              <div className="text-[11px] font-mono text-ink-secondary uppercase font-semibold">
                Covariance Trace P
              </div>
              <div className="font-mono text-2xl font-bold text-ink mt-1">
                {covarianceTrace}
              </div>
              <div className="text-[10px] text-status-safe mt-0.5">
                Bounded state uncertainty
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border">
              <div className="text-[11px] font-mono text-ink-secondary uppercase font-semibold">
                Filter State
              </div>
              <div className="font-mono text-2xl font-bold text-status-safe mt-1">
                CONVERGED
              </div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                8 Monte Carlo passes
              </div>
            </div>
          </div>

          {/* Hyperparameter Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              EnKF Stochastic Parameters
            </h4>

            {/* Ensemble Size N */}
            <div className="space-y-1.5 bg-surface-secondary p-3.5 rounded-xl border border-border">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-ink">Ensemble Particle Count (N):</span>
                <span className="font-mono font-bold text-purple">{params.ensembleSize} members</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={params.ensembleSize}
                onChange={(e) => setParams({ ...params, ensembleSize: parseInt(e.target.value) })}
                className="w-full accent-purple h-1.5 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-muted">
                <span>N=20 (Low CPU)</span>
                <span>N=100 (Nominal)</span>
                <span>N=200 (Sub-cm Precision)</span>
              </div>
            </div>

            {/* Process Noise Q */}
            <div className="space-y-1.5 bg-surface-secondary p-3.5 rounded-xl border border-border">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-ink">Process Hydrodynamic Noise (Q):</span>
                <span className="font-mono font-bold text-purple">{params.processNoiseQ}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="1.0"
                step="0.02"
                value={params.processNoiseQ}
                onChange={(e) => setParams({ ...params, processNoiseQ: parseFloat(e.target.value) })}
                className="w-full accent-purple h-1.5 bg-border rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-ink-muted">
                Higher Q trusts video observation more than hydrodynamic prior model.
              </div>
            </div>

            {/* Measurement Noise R */}
            <div className="space-y-1.5 bg-surface-secondary p-3.5 rounded-xl border border-border">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-ink">Sensor Measurement Noise (R):</span>
                <span className="font-mono font-bold text-purple">{params.measurementNoiseR}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={params.measurementNoiseR}
                onChange={(e) => setParams({ ...params, measurementNoiseR: parseFloat(e.target.value) })}
                className="w-full accent-purple h-1.5 bg-border rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-ink-muted">
                Accounts for camera lens droplet distortion and ultrasonic acoustic jitter.
              </div>
            </div>
          </div>

          {/* Observation Weights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Observation Sensor Innovation Weights
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                <div className="text-ink-secondary text-[11px] mb-1">CCTV Edge CV</div>
                <div className="font-mono font-bold text-purple text-base">
                  {(params.cvWeight * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={params.cvWeight}
                  onChange={(e) => setParams({ ...params, cvWeight: parseFloat(e.target.value) })}
                  className="w-full accent-purple h-1 mt-2"
                />
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                <div className="text-ink-secondary text-[11px] mb-1">Ultrasonic IoT</div>
                <div className="font-mono font-bold text-ink text-base">
                  {(params.iotWeight * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={params.iotWeight}
                  onChange={(e) => setParams({ ...params, iotWeight: parseFloat(e.target.value) })}
                  className="w-full accent-purple h-1 mt-2"
                />
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                <div className="text-ink-secondary text-[11px] mb-1">2D SWE Model</div>
                <div className="font-mono font-bold text-ink text-base">
                  {(params.sweModelWeight * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={params.sweModelWeight}
                  onChange={(e) => setParams({ ...params, sweModelWeight: parseFloat(e.target.value) })}
                  className="w-full accent-purple h-1 mt-2"
                />
              </div>
            </div>
          </div>

          {/* Convergence Curve Visualizer */}
          <div className="p-3.5 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-purple" />
                Residual Error Convergence (Monte Carlo Passes)
              </span>
              <button
                onClick={handleSimulateAssimilation}
                disabled={isSimulating}
                className="text-[11px] font-semibold text-purple hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                Recalculate Convergence
              </button>
            </div>
            <div className="h-16 flex items-end gap-2 pt-2 border-b border-border">
              {convergenceHistory.map((item) => {
                const heightPercent = Math.min(100, Math.max(10, (item.residual / 5) * 100));
                return (
                  <div key={item.iter} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full bg-purple/60 rounded-t hover:bg-purple transition-all"
                      style={{ height: `${heightPercent}%` }}
                      title={`Iter ${item.iter}: ±${item.residual}cm error`}
                    />
                    <span className="text-[9px] font-mono text-ink-muted">{item.iter}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-surface-secondary">
          <button
            onClick={() => setParams(initialParams)}
            className="px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink"
          >
            Reset Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-ink hover:bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-semibold hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Apply & Assimilate State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

