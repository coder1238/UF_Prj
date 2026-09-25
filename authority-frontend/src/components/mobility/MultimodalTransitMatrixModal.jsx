import React, { useState } from 'react';
import { X, Train, Bus, AlertTriangle, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { MULTIMODAL_TRANSIT_STATUS } from './mobilityConstants';

export default function MultimodalTransitMatrixModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [modes, setModes] = useState(MULTIMODAL_TRANSIT_STATUS);
  const [toast, setToast] = useState(null);

  const handleDeployBuses = (lineName) => {
    setToast(`BEST Emergency Evacuation: 12 additional buses dispatched to relieve ${lineName}.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Train className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Multimodal Transit &amp; Suburban Rail Flooding Matrix
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-alert-soft text-status-alert">
                  Railway &amp; BEST Live
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Suburban rail track waterlogging, Metro elevated capacity, and emergency bus bridging operations
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {toast && (
            <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono">
              {toast}
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-status-alert-soft border border-status-alert/30">
              <span className="text-[10px] uppercase font-bold text-status-alert">Suburban Tracks Flooded</span>
              <p className="text-base font-bold text-status-alert mt-0.5">Sion &amp; Chunabhatti</p>
              <span className="text-[11px] text-ink-secondary">Max track water: 28cm</span>
            </div>
            <div className="p-3 rounded-xl bg-status-safe-soft border border-status-safe/30">
              <span className="text-[10px] uppercase font-bold text-status-safe">Elevated Metro Line 1</span>
              <p className="text-base font-bold text-status-safe mt-0.5">100% Operational</p>
              <span className="text-[11px] text-ink-secondary">Carrying 450k passengers/day</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-soft border border-purple/30">
              <span className="text-[10px] uppercase font-bold text-purple">Emergency BEST Buses</span>
              <p className="text-base font-bold text-purple mt-0.5">64 Buses Deployed</p>
              <span className="text-[11px] text-ink-secondary">Bypassing LBS Marg via EEH</span>
            </div>
          </div>

          {/* Multimodal Table */}
          <div className="border border-border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary text-ink-secondary font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Transit Network</th>
                  <th className="py-2.5 px-3">Operational Status</th>
                  <th className="py-2.5 px-3">Track / Road Depth</th>
                  <th className="py-2.5 px-3">Choke Point</th>
                  <th className="py-2.5 px-3">Commuter Impact</th>
                  <th className="py-2.5 px-3 text-right">Emergency Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {modes.map((m, i) => (
                  <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-ink block">{m.mode}</span>
                      <span className="text-[11px] text-ink-secondary">{m.line}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.statusBg} ${m.color}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {m.waterDepthTrackCm > 0 ? (
                        <span className="text-status-alert font-bold">{m.waterDepthTrackCm} cm</span>
                      ) : (
                        <span className="text-status-safe font-medium">0 cm (Clear)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-ink-secondary">{m.chokeLocation}</td>
                    <td className="py-2.5 px-3 text-ink-secondary">{m.passengerImpact}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeployBuses(m.line)}
                        className="px-2.5 py-1 bg-purple-soft text-purple hover:bg-purple hover:text-white rounded-md text-[11px] font-semibold transition-colors"
                      >
                        Deploy Bus Shuttle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            Joint telemetry feed from Central Railway Control Office, Western Railway Mumbai Central, and BEST Bhavan.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Transit Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

