import React, { useState } from 'react';
import { X, Droplets, ArrowDownRight } from 'lucide-react';
import { RETENTION_BASINS } from './drainageConstants';

export default function RetentionBasinModal({ isOpen, onClose, showToast }) {
  const [basins, setBasins] = useState(RETENTION_BASINS);
  const [selectedBasinId, setSelectedBasinId] = useState(RETENTION_BASINS[0].id);

  if (!isOpen) return null;

  const activeBasin = basins.find((b) => b.id === selectedBasinId) || basins[0];

  const handleGateChange = (basinId, newGatePct) => {
    setBasins((prev) =>
      prev.map((b) => {
        if (b.id !== basinId) return b;
        return {
          ...b,
          inflowGatePct: newGatePct,
        };
      })
    );
  };

  const handleFlushRelease = (basinId) => {
    setBasins((prev) =>
      prev.map((b) => {
        if (b.id !== basinId) return b;
        const newVol = Math.max(5000, b.currentVolumeM3 - 10000);
        return {
          ...b,
          currentVolumeM3: newVol,
          fillPercentage: Math.round((newVol / b.designCapacityM3) * 100),
          status: 'DRAIN FLUSH IN PROGRESS',
        };
      })
    );
    showToast(`Retention drain-down flush triggered for ${activeBasin.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Underground Stormwater Retention Basins &amp; Holding Tanks
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                  BRIMSTOWAD II VAULTS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Sub-Surface Flash-Flood Retention &amp; Gravity Release Gate Automation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Basin Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {basins.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBasinId(b.id)}
                className={`p-3 rounded-xl border text-left font-mono transition-all ${
                  selectedBasinId === b.id
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                <div className="text-[10px] text-ink-secondary">{b.ward}</div>
                <div className="text-xs font-bold truncate mt-0.5">{b.name.split(' (')[0]}</div>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span>Fill: {b.fillPercentage}%</span>
                  <span className="text-ink-secondary">{(b.designCapacityM3 / 1000).toFixed(0)}k m³</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Basin Details Card */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-sm text-ink">{activeBasin.name}</h4>
                <p className="text-xs text-ink-secondary">{activeBasin.location} • Installed Pumps: {activeBasin.pumpsInstalled} ({activeBasin.pumpsRunning} Active)</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-soft text-purple">
                {activeBasin.status}
              </span>
            </div>

            {/* Basin Storage Gauge */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-secondary p-3 rounded-xl border border-border font-mono">
                <span className="text-[10px] text-ink-secondary uppercase block">Current Volume</span>
                <span className="text-lg font-bold text-ink">{activeBasin.currentVolumeM3.toLocaleString()} m³</span>
                <span className="text-[10px] text-ink-secondary block">Max: {activeBasin.designCapacityM3.toLocaleString()} m³</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border font-mono">
                <span className="text-[10px] text-ink-secondary uppercase block">Water Elevation</span>
                <span className="text-lg font-bold text-emerald-500">+{activeBasin.waterElevationMSL}m MSL</span>
                <span className="text-[10px] text-ink-secondary block">Spill: +{activeBasin.criticalSpillElevationMSL}m MSL</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border font-mono">
                <span className="text-[10px] text-ink-secondary uppercase block">Time Until 100% Full</span>
                <span className="text-lg font-bold text-amber-500">{activeBasin.estimatedTimeFullMin} mins</span>
                <span className="text-[10px] text-ink-secondary block">At current inflow rate</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border font-mono">
                <span className="text-[10px] text-ink-secondary uppercase block">Release Drain Rate</span>
                <span className="text-lg font-bold text-purple">{activeBasin.releaseDischargeRateM3h.toLocaleString()} m³/h</span>
                <span className="text-[10px] text-ink-secondary block">To trunk storm drain</span>
              </div>
            </div>

            {/* Visual Tank Fill Bar */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-ink-secondary text-[11px]">
                <span>Vault Capacity Utilization</span>
                <span className="font-bold text-ink">{activeBasin.fillPercentage}% Full</span>
              </div>
              <div className="w-full h-4 bg-surface-secondary rounded-full overflow-hidden border border-border p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeBasin.fillPercentage > 90
                      ? 'bg-status-alert'
                      : activeBasin.fillPercentage > 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeBasin.fillPercentage}%` }}
                />
              </div>
            </div>

            {/* Inflow Gate Aperture Control */}
            <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-ink font-semibold">Inflow Diversion Sluice Gate:</span>
                  <span className="text-purple font-bold">{activeBasin.inflowGatePct}% Open</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={activeBasin.inflowGatePct}
                  onChange={(e) => handleGateChange(activeBasin.id, parseInt(e.target.value))}
                  className="w-full accent-purple cursor-pointer"
                />
                <span className="text-[10px] font-mono text-ink-secondary">Controls surface water intake from highway drains</span>
              </div>

              <button
                onClick={() => handleFlushRelease(activeBasin.id)}
                className="px-4 py-2.5 rounded-xl bg-purple text-white hover:bg-purple-deep text-xs font-bold font-mono flex items-center gap-2 shadow-subtle transition-colors shrink-0"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Trigger Controlled Drain-Down Flush</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Holding Tank Console
          </button>
        </div>
      </div>
    </div>
  );
}

