import React, { useState } from 'react';
import {
  X,
  Navigation,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { MOBILITY_CORRIDORS } from './scenarioConstants';

export default function MobilityCorridorChokepointsModal({ isOpen, onClose, scenarioParams, onIssueDiversion }) {
  const [issuedDiversions, setIssuedDiversions] = useState({});

  // Speed reduction multiplier based on rain and blockage
  const speedReductionRatio = Math.min(
    0.85,
    (((scenarioParams?.rainfallIntensity || 50) - 40) * 0.007 + ((scenarioParams?.drainBlockage || 0) / 100) * 0.4)
  );

  const evaluatedCorridors = MOBILITY_CORRIDORS.map((corridor) => {
    const degradedSpeed = Math.max(4, Math.round(corridor.baselineSpeed * (1 - speedReductionRatio)));
    const speedLossPct = Math.round(((corridor.baselineSpeed - degradedSpeed) / corridor.baselineSpeed) * 100);
    const submergedKm = +(corridor.lengthKm * (speedReductionRatio * 0.65)).toFixed(1);
    const isCritical = degradedSpeed < 12;

    return {
      ...corridor,
      degradedSpeed,
      speedLossPct,
      submergedKm,
      isCritical,
    };
  });

  const handleIssueDiversion = (corridor) => {
    setIssuedDiversions((prev) => ({
      ...prev,
      [corridor.id]: true,
    }));
    if (onIssueDiversion) {
      onIssueDiversion(corridor);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Arterial Highway &amp; Mobility Corridor Chokepoint Simulator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                  TRAFFIC POLICE OPS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Simulate traffic transit speed bottlenecks, submerged carriage-ways, and emergency diversion corridors
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

        {/* Telemetry Bar */}
        <div className="p-3 bg-canvas border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] text-ink-secondary uppercase">Average Grid Speed</span>
            <div className="text-lg font-bold text-status-alert mt-0.5">
              {Math.round(
                evaluatedCorridors.reduce((sum, c) => sum + c.degradedSpeed, 0) / evaluatedCorridors.length
              )}{' '}
              km/h
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] text-ink-secondary uppercase">Average Speed Drop</span>
            <div className="text-lg font-bold text-status-alert mt-0.5">
              -{Math.round(speedReductionRatio * 100)}%
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] text-ink-secondary uppercase">Total Inundated Roads</span>
            <div className="text-lg font-bold text-purple mt-0.5">
              {evaluatedCorridors.reduce((sum, c) => sum + c.submergedKm, 0).toFixed(1)} km
            </div>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-border">
            <span className="text-[10px] text-ink-secondary uppercase">Critical Gridlock Nodes</span>
            <div className="text-lg font-bold text-status-alert mt-0.5">
              {evaluatedCorridors.filter((c) => c.isCritical).length} Corridors
            </div>
          </div>
        </div>

        {/* Corridor List */}
        <div className="p-4 overflow-y-auto max-h-[calc(92vh-180px)] space-y-3">
          {evaluatedCorridors.map((corridor) => {
            const isIssued = issuedDiversions[corridor.id];

            return (
              <div
                key={corridor.id}
                className="p-3.5 rounded-xl border border-border bg-surface hover:border-purple/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-ink">{corridor.name}</h4>
                      <span className="text-[10px] font-mono text-ink-secondary">
                        ({corridor.lengthKm} km segment)
                      </span>
                      {corridor.isCritical ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SEVERE GRIDLOCK
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-warning-soft text-status-warning font-bold">
                          MODERATE SLOWDOWN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-secondary mt-1">
                      {corridor.segment} • Primary bottleneck at <strong className="text-ink">{corridor.bottleneckDip}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleIssueDiversion(corridor)}
                      disabled={isIssued}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isIssued
                          ? 'bg-status-safe-soft text-status-safe border border-status-safe/40'
                          : 'bg-purple text-white hover:bg-purple-deep shadow-subtle'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isIssued ? 'Diversion Enforced' : 'Dispatch Traffic Diversion'}</span>
                    </button>
                  </div>
                </div>

                {/* Speed Comparison Strip */}
                <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-surface-secondary/50">
                    <span className="text-[10px] text-ink-secondary block">Baseline Speed</span>
                    <strong className="text-ink">{corridor.baselineSpeed} km/h</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-secondary/50">
                    <span className="text-[10px] text-ink-secondary block">Scenario Speed</span>
                    <strong className={corridor.isCritical ? 'text-status-alert' : 'text-status-warning'}>
                      {corridor.degradedSpeed} km/h (-{corridor.speedLossPct}%)
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-secondary/50">
                    <span className="text-[10px] text-ink-secondary block">Submerged Extent</span>
                    <strong className="text-status-alert">{corridor.submergedKm} km</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-secondary/50">
                    <span className="text-[10px] text-ink-secondary block">Road Crown MSL</span>
                    <strong className="text-ink">+{corridor.elevationMsl} m MSL</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
