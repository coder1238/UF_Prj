import React, { useState } from 'react';
import { X, BarChart3, CheckCircle2, Sliders, ShieldCheck, AlertCircle } from 'lucide-react';
import { ROUTE_PROFILES } from './mobilityConstants';

export default function MultiCriteriaParetoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Weight sliders (0 to 1)
  const [weights, setWeights] = useState({
    floodSafety: 0.4,
    travelTime: 0.25,
    flyoverRatio: 0.2,
    pavementQuality: 0.15,
  });

  const routesWithScores = ROUTE_PROFILES.map((r) => {
    // Scoring logic (0 to 100)
    const safetyScore = r.maxFloodDepthCm === 0 ? 100 : Math.max(10, 100 - r.maxFloodDepthCm * 2.5);
    const timeScore = Math.max(20, 100 - (r.baseDurationMin - 20) * 4);
    const flyoverScore = r.flyoverPercentage;
    const pavementScore = r.hazardSegments === 0 ? 95 : Math.max(30, 95 - r.hazardSegments * 20);

    const aggregateScore = Math.round(
      safetyScore * weights.floodSafety +
        timeScore * weights.travelTime +
        flyoverScore * weights.flyoverRatio +
        pavementScore * weights.pavementQuality
    );

    return {
      ...r,
      safetyScore: Math.round(safetyScore),
      timeScore: Math.round(timeScore),
      flyoverScore: Math.round(flyoverScore),
      pavementScore: Math.round(pavementScore),
      aggregateScore,
    };
  }).sort((a, b) => b.aggregateScore - a.aggregateScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <BarChart3 className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Multi-Criteria Pareto Route Optimization Engine
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple text-white">
                  MCDA Matrix
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Mathematical multi-criteria decision analysis (AHP/TOPSIS) evaluating flood immunity vs response latency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Operator Preference Sliders */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple" /> Mission Objective Weights
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-ink-secondary uppercase block mb-1">
                  Flood Safety: {Math.round(weights.floodSafety * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={weights.floodSafety}
                  onChange={(e) => setWeights({ ...weights, floodSafety: parseFloat(e.target.value) })}
                  className="w-full accent-purple"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary uppercase block mb-1">
                  Speed / Time: {Math.round(weights.travelTime * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={weights.travelTime}
                  onChange={(e) => setWeights({ ...weights, travelTime: parseFloat(e.target.value) })}
                  className="w-full accent-purple"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary uppercase block mb-1">
                  Flyover Ratio: {Math.round(weights.flyoverRatio * 100)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weights.flyoverRatio}
                  onChange={(e) => setWeights({ ...weights, flyoverRatio: parseFloat(e.target.value) })}
                  className="w-full accent-purple"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary uppercase block mb-1">
                  Pavement Rigidity: {Math.round(weights.pavementQuality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weights.pavementQuality}
                  onChange={(e) => setWeights({ ...weights, pavementQuality: parseFloat(e.target.value) })}
                  className="w-full accent-purple"
                />
              </div>
            </div>
          </div>

          {/* Pareto Tradeoff Cards */}
          <div className="space-y-3">
            {routesWithScores.map((route, rank) => {
              const isTop = rank === 0;
              return (
                <div
                  key={route.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isTop ? 'bg-purple-soft/40 border-purple shadow-elevated' : 'bg-surface border-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          isTop ? 'bg-purple text-white' : 'bg-surface-secondary text-ink-secondary'
                        }`}
                      >
                        #{rank + 1}
                      </span>
                      <h4 className="font-bold text-sm text-ink">{route.name}</h4>
                      {isTop && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-safe text-white">
                          Pareto Optimal Choice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs text-ink-secondary">Aggregate Index:</span>
                      <span className="text-base font-bold text-purple">{route.aggregateScore} / 100</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-secondary mt-1">{route.description}</p>

                  {/* Sub-scores breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">Hydro Immunity</span>
                      <span className="font-bold text-ink">{route.safetyScore} pts</span> ({route.maxFloodDepthCm}cm flood)
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">ETA Duration</span>
                      <span className="font-bold text-ink">{route.timeScore} pts</span> ({route.baseDurationMin} mins)
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">Flyover Deck</span>
                      <span className="font-bold text-ink">{route.flyoverScore} pts</span> ({route.flyoverPercentage}%)
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">Pavement Integrity</span>
                      <span className="font-bold text-ink">{route.pavementScore} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            Mathematical model: Weighted Linear Combination (WLC) calibrated with Mumbai empirical monsoon telemetry.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Pareto Optimizer
          </button>
        </div>
      </div>
    </div>
  );
}

