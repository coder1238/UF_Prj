import React, { useState } from 'react';
import { X, AlertOctagon, Clock, Send } from 'lucide-react';
import { EXTENDED_DRAINAGE_NODES } from './drainageConstants';

export default function SurchargeEarlyWarningModal({ isOpen, onClose, showToast }) {
  const [nodes] = useState(EXTENDED_DRAINAGE_NODES);
  const [warningThreshold, setWarningThreshold] = useState(85); // %
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');

  if (!isOpen) return null;

  // Filter nodes exceeding threshold
  const surchargedNodes = nodes.filter((n) => {
    const matchesWard = selectedWardFilter === 'ALL' || n.ward.includes(selectedWardFilter);
    return matchesWard && n.currentLoad >= warningThreshold;
  });

  const handleBroadcastAlert = (node) => {
    showToast(`FLASH OVERFLOW WARNING BROADCAST: ${node.name} (${node.ward}) - Immediate evacuation advisory.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Conduit Surcharge Early Warning &amp; Sump Overflow Countdown (EW-SOF)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold">
                  {surchargedNodes.length} NODES AT CRITICAL THRESHOLD
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Predictive Hydraulic Overtopping &amp; Manhole Cover Dislodgement Forecast
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Controls Bar */}
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-ink font-semibold">Alarm Threshold:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {[75, 80, 85, 90, 95].map((th) => (
                  <button
                    key={th}
                    onClick={() => setWarningThreshold(th)}
                    className={`px-2 py-1 rounded-md border transition-colors ${
                      warningThreshold === th
                        ? 'bg-status-alert text-white border-status-alert font-bold'
                        : 'bg-surface text-ink border-border hover:bg-surface-secondary'
                    }`}
                  >
                    {th}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-secondary">Ward:</span>
              <select
                value={selectedWardFilter}
                onChange={(e) => setSelectedWardFilter(e.target.value)}
                className="bg-surface border border-border rounded-lg text-xs font-mono px-2.5 py-1 text-ink focus:outline-none focus:border-purple"
              >
                <option value="ALL">All Wards</option>
                <option value="F/N">Ward F/N (Sion/Matunga)</option>
                <option value="L">Ward L (Kurla/Sakinaka)</option>
                <option value="G/N">Ward G/N (Dadar/Mahim)</option>
                <option value="H/W">Ward H/W (Bandra/Khar)</option>
                <option value="K/E">Ward K/E (Andheri)</option>
              </select>
            </div>
          </div>

          {/* Surcharged Nodes Cards */}
          <div className="space-y-2.5">
            {surchargedNodes.length === 0 ? (
              <div className="text-center py-12 text-ink-secondary font-mono text-xs">
                No nodes currently exceeding {warningThreshold}% hydraulic load.
              </div>
            ) : (
              surchargedNodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-surface-secondary border border-border hover:border-red-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                        NODE {node.id}
                      </span>
                      <span className="text-xs font-bold text-ink">{node.name}</span>
                      <span className="text-[10px] font-mono text-ink-secondary">({node.ward})</span>
                    </div>
                    <div className="text-[11px] text-ink-secondary font-mono">
                      Throttle: {node.downstreamThrottle}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-status-alert">{node.currentLoad}% Load</div>
                      <div className="text-[10px] text-ink-secondary flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Surcharge: {node.predictedSurcharge}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBroadcastAlert(node)}
                      className="px-3 py-1.5 rounded-lg bg-status-alert text-white hover:bg-red-600 text-xs font-bold font-mono flex items-center gap-1.5 shadow-subtle transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Issue Early Warning</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Automatic SCADA Poll Frequency: <strong>Every 10 seconds</strong>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

