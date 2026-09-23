import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Droplets,
  Wrench,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function CCTVDebrisOcclusionModal({
  isOpen,
  onClose,
  cameraName = 'Andheri Subway',
  onDispatchCrew,
}) {
  const [blockagePercent, setBlockagePercent] = useState(58);
  const [debrisType, setDebrisType] = useState('Plastic bottles, discarded bags & floating foliage');
  const [isDispatched, setIsDispatched] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  if (!isOpen) return null;

  const handleDispatch = () => {
    const id = `SWM-DESILT-${Date.now().toString().slice(-4)}`;
    setTicketId(id);
    setIsDispatched(true);
    if (onDispatchCrew) {
      onDispatchCrew(id, blockagePercent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-amber-soft text-status-amber">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Culvert & Trash-Rack Debris Occlusion
              </h2>
              <p className="text-xs text-ink-secondary">
                Edge CV segmentation of storm-drain grate ingress at {cameraName}
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

        {/* Body */}
        <div className="p-6 space-y-5 text-ink">
          {/* Status Metric Card */}
          <div className="p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-secondary uppercase">
                Grate Surface Occlusion
              </span>
              <span className="font-mono text-xl font-bold text-status-alert">
                {blockagePercent}% BLOCKED
              </span>
            </div>

            {/* Blockage progress bar */}
            <div className="w-full bg-border h-3 rounded-full overflow-hidden">
              <div
                className="bg-status-alert h-full rounded-full transition-all duration-500"
                style={{ width: `${blockagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted mt-1.5">
              <span>0% (Clean Flow)</span>
              <span>40% (Warning Threshold)</span>
              <span>100% (Full Damming)</span>
            </div>
          </div>

          {/* Diagnostic Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border">
              <span className="text-ink-secondary">Detected Debris Classification:</span>
              <span className="font-medium text-ink text-right max-w-[240px] truncate">
                {debrisType}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border">
              <span className="text-ink-secondary">Effective Inflow Reduction:</span>
              <span className="font-mono font-bold text-status-alert">-42.5 L/sec</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border">
              <span className="text-ink-secondary">Hydraulic Head Loss:</span>
              <span className="font-mono font-bold text-ink">+12.4 cm backwater pool</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ink-secondary">Vision Confidence:</span>
              <span className="font-mono font-semibold text-purple">93.2% (YOLO-GrateSeg)</span>
            </div>
          </div>

          {/* Dispatch Outcome */}
          {isDispatched ? (
            <div className="p-3.5 bg-status-safe-soft rounded-xl border border-status-safe/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-status-safe">
                <CheckCircle2 className="w-4 h-4" />
                Desiltation Work Order Dispatched
              </div>
              <div className="text-ink-secondary text-[11px] mt-1 font-mono">
                Order Ticket: <span className="font-bold text-ink">{ticketId}</span>
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Ward SWM Emergency Jetting Squad notified via MCGM Disaster Desk.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Debris exceeds critical 40% threshold. Immediate jetting and manual raking required to restore gravity discharge.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-end gap-2 bg-surface-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-ink hover:bg-white"
          >
            Close
          </button>
          {!isDispatched && (
            <button
              onClick={handleDispatch}
              className="px-4 py-2 bg-status-amber text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition-all shadow-subtle flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              Dispatch Emergency Desilt Squad
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

