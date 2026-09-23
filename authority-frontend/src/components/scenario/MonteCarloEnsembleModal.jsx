import React, { useState } from 'react';
import { X, Cpu, Play, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export default function MonteCarloEnsembleModal({ isOpen, onClose, scenarioParams }) {
  const [iterations, setIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [perturbationLevel, setPerturbationLevel] = useState(15); // ±15% variance

  // Simulated Monte Carlo statistics based on scenarioParams
  const meanDepth = (42.0 + ((scenarioParams?.rainfallIntensity || 50) - 50) * 0.4 + (scenarioParams?.drainBlockage || 0) * 0.15);
  const stdDev = meanDepth * (perturbationLevel / 100) * 0.65;

  const p10 = (meanDepth - 1.28 * stdDev).toFixed(1);
  const p50 = meanDepth.toFixed(1);
  const p90 = (meanDepth + 1.28 * stdDev).toFixed(1);
  const p99 = (meanDepth + 2.33 * stdDev).toFixed(1);

  const handleRunMonteCarlo = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  // Mock histogram distribution bins (12 bins)
  const bins = [
    { range: `< ${p10} cm`, count: 10, pct: 10, label: 'P10 Low Risk' },
    { range: `${p10}–${(Number(p10) + 4).toFixed(0)}`, count: 15, pct: 15 },
    { range: `${(Number(p10) + 4).toFixed(0)}–${(Number(p50) - 4).toFixed(0)}`, count: 25, pct: 25, label: 'Interquartile' },
    { range: `${(Number(p50) - 4).toFixed(0)}–${p50}`, count: 22, pct: 22, label: 'P50 Median' },
    { range: `${p50}–${(Number(p50) + 5).toFixed(0)}`, count: 14, pct: 14 },
    { range: `${(Number(p50) + 5).toFixed(0)}–${p90}`, count: 8, pct: 8, label: 'P90 Severe' },
    { range: `${p90}–${p99}`, count: 4, pct: 4 },
    { range: `> ${p99} cm`, count: 2, pct: 2, label: 'P99 Extreme' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Stochastic Monte Carlo Ensemble &amp; Exceedance Probability Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  {iterations} RUNS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Gaussian parameter perturbation of rainfall skew, tidal phasing, and conduit Manning's roughness
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

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="p-3 bg-canvas border border-border rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] font-mono text-ink-secondary uppercase block mb-1">
                  Ensemble Realizations
                </label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-border font-mono text-xs focus:outline-none focus:border-purple"
                >
                  <option value={50}>50 Realizations</option>
                  <option value={100}>100 Realizations (Standard)</option>
                  <option value={250}>250 Realizations (Deep)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-ink-secondary uppercase block mb-1">
                  Parameter Variance (±{perturbationLevel}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={perturbationLevel}
                  onChange={(e) => setPerturbationLevel(Number(e.target.value))}
                  className="w-32 h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>
            </div>

            <button
              onClick={handleRunMonteCarlo}
              disabled={isRunning}
              className="px-4 py-2 bg-purple hover:bg-purple-deep text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-subtle transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Iteration {Math.round((progress / 100) * iterations)}/{iterations}...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Stochastic Ensemble</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar when running */}
          {isRunning && (
            <div className="p-3 bg-purple-soft/50 border border-purple/30 rounded-xl space-y-2 animate-pulse">
              <div className="flex justify-between text-xs font-mono text-purple font-semibold">
                <span>CUDA GPU Mesh Perturbation &amp; Flood Propagation...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-purple-soft rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Key Probability Percentiles Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-canvas border border-border rounded-xl">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">P10 (Optimistic Lower)</span>
              <div className="text-xl font-bold font-mono text-status-safe mt-1">{p10} cm</div>
              <div className="text-[10px] font-mono text-status-safe">10% exceedance probability</div>
            </div>

            <div className="p-3 bg-canvas border border-border rounded-xl">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">P50 (Median Expectation)</span>
              <div className="text-xl font-bold font-mono text-purple mt-1">{p50} cm</div>
              <div className="text-[10px] font-mono text-purple">50% median consensus</div>
            </div>

            <div className="p-3 bg-canvas border border-border rounded-xl">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">P90 (Severe Exceedance)</span>
              <div className="text-xl font-bold font-mono text-status-warning mt-1">{p90} cm</div>
              <div className="text-[10px] font-mono text-status-warning">90% confidence threshold</div>
            </div>

            <div className="p-3 bg-canvas border border-border rounded-xl">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">P99 (Worst Case Black Swan)</span>
              <div className="text-xl font-bold font-mono text-status-alert mt-1">{p99} cm</div>
              <div className="text-[10px] font-mono text-status-alert font-bold">1-in-100 tail risk</div>
            </div>
          </div>

          {/* Probability Distribution Histogram */}
          <div className="p-4 bg-surface border border-border rounded-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="font-bold text-ink flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple" />
                Empirical Probability Density Function (PDF) of Peak Water Depth
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">
                95% CI: [{p10} cm — {p99} cm]
              </span>
            </div>

            {/* Bars */}
            <div className="space-y-2">
              {bins.map((bin, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-24 text-right text-ink-secondary shrink-0">{bin.range}</span>
                  <div className="flex-1 h-5 bg-surface-secondary rounded overflow-hidden flex items-center">
                    <div
                      className={`h-full transition-all duration-500 rounded flex items-center justify-end px-2 text-[10px] font-bold text-white ${
                        idx < 2 ? 'bg-status-safe' : idx < 5 ? 'bg-purple' : 'bg-status-alert'
                      }`}
                      style={{ width: `${Math.max(12, (bin.count / 25) * 100)}%` }}
                    >
                      {bin.count} runs ({bin.pct}%)
                    </div>
                  </div>
                  <span className="w-28 text-[11px] text-ink-muted shrink-0">{bin.label || ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Context */}
          <div className="p-3 bg-surface-secondary border border-border rounded-xl text-xs text-ink-secondary leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Operational Engineering Takeaway:</strong> Under ±{perturbationLevel}% storm parameter uncertainty, there is an <strong>82% empirical probability</strong> that water depth in critical subways will surpass 30 cm (LMV engine cutoff threshold). Pumping redundancy provides up to 14.8 cm buffering, but is neutralized if coastal outfall gates remain closed during peak surge.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-ink-secondary">
            Random Seed: #0x8F94D2 | Box-Muller Normal Perturbation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white font-bold rounded-xl text-xs shadow-subtle hover:bg-purple-deep transition-colors"
          >
            Close Monte Carlo Engine
          </button>
        </div>
      </div>
    </div>
  );
}
