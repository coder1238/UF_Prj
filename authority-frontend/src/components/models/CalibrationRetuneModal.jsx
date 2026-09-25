import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Activity,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function CalibrationRetuneModal({ isOpen, onClose, onApplyCalibration, showToast }) {
  const [isRetuning, setIsRetuning] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs] = useState(5);
  const [learningRate, setLearningRate] = useState(0.0003);
  const [physicsWeight, setPhysicsWeight] = useState(0.25); // lambda_phys
  const [lossHistory, setLossHistory] = useState([
    { epoch: 0, loss: 0.0482, mae: 2.10, r2: 94.8 },
  ]);
  const [retuneComplete, setRetuneComplete] = useState(false);

  if (!isOpen) return null;

  const startRetuneSimulation = () => {
    setIsRetuning(true);
    setCurrentEpoch(0);
    setRetuneComplete(false);
    setLossHistory([{ epoch: 0, loss: 0.0482, mae: 2.10, r2: 94.8 }]);

    let ep = 0;
    const interval = setInterval(() => {
      ep += 1;
      setCurrentEpoch(ep);

      const newLoss = Math.max(0.012, 0.0482 * Math.exp(-0.35 * ep));
      const newMae = Math.max(1.4, 2.10 - ep * 0.14);
      const newR2 = Math.min(97.2, 94.8 + ep * 0.45);

      setLossHistory((prev) => [
        ...prev,
        {
          epoch: ep,
          loss: parseFloat(newLoss.toFixed(4)),
          mae: parseFloat(newMae.toFixed(2)),
          r2: parseFloat(newR2.toFixed(1)),
        },
      ]);

      if (ep >= 5) {
        clearInterval(interval);
        setIsRetuning(false);
        setRetuneComplete(true);
        if (showToast) {
          showToast('Monsoon Telemetry Retune complete: MAE improved to 1.40 cm (R² = 97.1%).');
        }
      }
    }, 900);
  };

  const handleApplyToProduction = () => {
    if (onApplyCalibration) {
      onApplyCalibration({
        mae: '1.4 cm',
        r2: '97.1%',
        lastCalibrated: 'Just now (Retuned)',
      });
    }
    if (showToast) {
      showToast('Calibrated model weights published to live inference pipeline!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink">On-Demand Hydrodynamic Calibration Retune</h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Couples live AWS gauge observations with PINN surrogate loss function
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Hyperparameter Config Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
              <div className="flex justify-between items-center font-mono">
                <span className="text-ink-secondary text-[11px]">Fine-Tuning LR:</span>
                <strong className="text-purple text-xs">{learningRate}</strong>
              </div>
              <input
                type="range"
                min="0.0001"
                max="0.001"
                step="0.0001"
                value={learningRate}
                disabled={isRetuning}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-purple h-1.5 bg-surface-secondary rounded cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary block">
                AdamW with Cosine Annealing decay
              </span>
            </div>

            <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
              <div className="flex justify-between items-center font-mono">
                <span className="text-ink-secondary text-[11px]">Physics-Loss Weight (&lambda;<sub>phys</sub>):</span>
                <strong className="text-status-safe text-xs">{physicsWeight.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={physicsWeight}
                disabled={isRetuning}
                onChange={(e) => setPhysicsWeight(parseFloat(e.target.value))}
                className="w-full accent-status-safe h-1.5 bg-surface-secondary rounded cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary block">
                Mass conservation penalty multiplier
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="p-4 bg-surface border border-border rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-ink font-bold">
                Retuning Progress: Epoch {currentEpoch} / {totalEpochs}
              </span>
              <span className="text-purple font-bold">
                {Math.round((currentEpoch / totalEpochs) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-purple transition-all duration-500 rounded-full"
                style={{ width: `${(currentEpoch / totalEpochs) * 100}%` }}
              />
            </div>
          </div>

          {/* Convergence Metrics Table & SVG Curve */}
          <div className="p-4 bg-surface border border-border rounded-xl space-y-3">
            <span className="font-bold text-[11px] text-ink uppercase tracking-wider block">
              Convergence Telemetry History
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-border text-ink-secondary">
                    <th className="pb-1.5">Epoch</th>
                    <th className="pb-1.5">Navier-Stokes Loss</th>
                    <th className="pb-1.5">MAE (cm)</th>
                    <th className="pb-1.5">R² Correlation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {lossHistory.map((row) => (
                    <tr key={row.epoch} className="hover:bg-surface-secondary/40">
                      <td className="py-1 text-ink font-bold">{row.epoch === 0 ? 'Baseline (t0)' : `Epoch ${row.epoch}`}</td>
                      <td className="py-1 text-purple">{row.loss}</td>
                      <td className="py-1 text-ink">{row.mae} cm</td>
                      <td className="py-1 text-status-safe font-bold">{row.r2}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-border rounded-lg text-xs font-semibold text-ink hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!retuneComplete ? (
              <button
                onClick={startRetuneSimulation}
                disabled={isRetuning}
                className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isRetuning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing Loss Gradients...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Start 5-Epoch Retuning</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleApplyToProduction}
                className="px-4 py-2 bg-status-safe text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-subtle"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publish Retuned Model to Prod</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
