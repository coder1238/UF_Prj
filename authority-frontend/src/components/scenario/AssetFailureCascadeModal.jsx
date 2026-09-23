import React from 'react';
import { X, Zap, BatteryCharging } from 'lucide-react';
import { INFRASTRUCTURE_NODES } from './scenarioConstants';

export default function AssetFailureCascadeModal({ isOpen, onClose, scenarioParams }) {
  if (!isOpen) return null;

  // Base depth multiplier from scenario
  const surgeMultiplier = 1 + (scenarioParams.rainfallIntensity - 50) * 0.012 + (scenarioParams.drainBlockage / 100) * 0.35;

  const evaluatedNodes = INFRASTRUCTURE_NODES.map((node) => {
    // Local water depth modeled around asset elevation
    const localizedDepth = Math.max(0, Math.round((46.0 - node.groundMsl * 5.2) * surgeMultiplier));
    const isBreached = localizedDepth >= node.thresholdCm;
    const isWarning = localizedDepth >= node.thresholdCm * 0.75 && !isBreached;

    let status = 'OPERATIONAL';
    let statusClass = 'bg-status-safe-soft text-status-safe border-status-safe/30';

    if (isBreached) {
      status = 'SUBMERGED / INGRESS BREACH';
      statusClass = 'bg-status-alert text-white';
    } else if (isWarning) {
      status = 'AT RISK (SURCHARGE WARNING)';
      statusClass = 'bg-status-warning-soft text-status-warning border-status-warning/30';
    }

    return {
      ...node,
      localizedDepth,
      isBreached,
      isWarning,
      status,
      statusClass,
    };
  });

  const breachedCount = evaluatedNodes.filter((n) => n.isBreached).length;
  const warningCount = evaluatedNodes.filter((n) => n.isWarning).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Cascading Infrastructure Failure &amp; Critical Asset Exposure
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  12 CRITICAL SITES
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Real-time tracking of electrical substation trips, hospital entrance inundation, and railway traction cutoffs
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

        {/* Telemetry Summary Strip */}
        <div className="p-3.5 bg-canvas border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-surface border border-border rounded-xl">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Asset Threshold Breaches</span>
            <div className="text-xl font-bold font-mono text-status-alert mt-0.5">
              {breachedCount} Sites Inundated
            </div>
          </div>
          <div className="p-2.5 bg-surface border border-border rounded-xl">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">High Vulnerability Warning</span>
            <div className="text-xl font-bold font-mono text-status-warning mt-0.5">
              {warningCount} Sites Surcharging
            </div>
          </div>
          <div className="p-2.5 bg-surface border border-border rounded-xl">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Hospitals Impacted</span>
            <div className="text-xl font-bold font-mono text-ink mt-0.5">
              {evaluatedNodes.filter((n) => n.type === 'Hospital' && n.isBreached).length} / 3 Hospitals
            </div>
          </div>
          <div className="p-2.5 bg-surface border border-border rounded-xl">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Substation Grid Threat</span>
            <div className="text-xl font-bold font-mono text-purple mt-0.5">
              {evaluatedNodes.filter((n) => n.type === 'Electrical Grid' && (n.isBreached || n.isWarning)).length > 0 ? 'GRID CONTINGENCY ACT' : 'NOMINAL'}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {evaluatedNodes.map((asset) => (
            <div
              key={asset.id}
              className={`p-3.5 rounded-xl border transition-all ${
                asset.isBreached
                  ? 'bg-status-alert-soft/40 border-status-alert shadow-subtle'
                  : asset.isWarning
                  ? 'bg-status-warning-soft/30 border-status-warning'
                  : 'bg-surface border-border hover:border-purple/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="font-bold text-xs text-ink">{asset.name}</h4>
                  <span className="text-[10px] font-mono text-ink-secondary">{asset.type} • Ground: {asset.groundMsl}m MSL</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 border ${asset.statusClass}`}>
                  {asset.status}
                </span>
              </div>

              {/* Depth bar relative to threshold */}
              <div className="space-y-1 my-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Modeled Inundation Depth</span>
                  <span className={asset.isBreached ? 'text-status-alert font-bold' : 'text-ink font-semibold'}>
                    {asset.localizedDepth} cm / Threshold {asset.thresholdCm} cm
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      asset.isBreached ? 'bg-status-alert' : asset.isWarning ? 'bg-status-warning' : 'bg-status-safe'
                    }`}
                    style={{ width: `${Math.min(100, (asset.localizedDepth / asset.thresholdCm) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Contingency Specs */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] font-mono text-ink-secondary">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-purple" />
                  Genset Backup: {asset.backupPowerHrs}h
                </span>
                {asset.isBreached ? (
                  <span className="text-status-alert font-bold">DEPLOY AUXILIARY BARRIERS</span>
                ) : (
                  <span className="text-status-safe">Defenses Adequate</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-ink-secondary">
            Continuous SCADA telemetry linkage with BEST, Tata Power &amp; Central Railway Control
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white font-bold rounded-xl text-xs shadow-subtle hover:bg-purple-deep transition-colors"
          >
            Close Asset Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
