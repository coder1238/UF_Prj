import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function AllClearRevocationModal({
  isOpen,
  onClose,
  activeAlerts = [],
  onRevokeConfirm,
}) {
  if (!isOpen) return null;

  const [selectedAlertId, setSelectedAlertId] = useState(
    activeAlerts.length > 0 ? activeAlerts[0].id : ''
  );
  const [reason, setReason] = useState('Floodwaters receded below 10cm hazard depth across all corridors.');
  const [resetVms, setResetVms] = useState(true);
  const [silenceSirens, setSilenceSirens] = useState(true);
  const [broadcastAllClear, setBroadcastAllClear] = useState(true);

  const selectedAlert = activeAlerts.find((a) => a.id === selectedAlertId) || activeAlerts[0];

  const handleRevoke = () => {
    if (onRevokeConfirm && selectedAlert) {
      onRevokeConfirm(selectedAlert.id, reason);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-safe-soft text-status-safe">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                CAP Alert Revocation &amp; "All-Clear" De-escalation Protocol
              </h3>
              <p className="text-[11px] text-ink-secondary">
                OASIS CAP &lt;msgType&gt;Cancel&lt;/msgType&gt; broadcast and civic normalcy restoration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <div>
            <label className="font-bold text-ink-secondary uppercase block mb-1">
              Select Active Alert to Cancel / Revoke
            </label>
            {activeAlerts.length === 0 ? (
              <div className="p-3 rounded-lg bg-surface-secondary text-ink-secondary text-center">
                No active alerts in queue to revoke.
              </div>
            ) : (
              <select
                value={selectedAlertId}
                onChange={(e) => setSelectedAlertId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-secondary border border-border text-ink font-semibold focus:border-purple"
              >
                {activeAlerts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} • {a.title} ({a.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="font-bold text-ink-secondary uppercase block mb-1">
              De-escalation Justification / Field Verification Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-border text-ink focus:border-purple leading-relaxed"
            />
          </div>

          {/* Quick Reasons */}
          <div className="flex flex-wrap gap-1.5">
            {[
              'Waters receded below 10cm',
              'Subways inspected & reopened by Police',
              'Tidal high-tide peak passed',
              'Pumping stations cleared ponding',
            ].map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-[11px] text-ink hover:border-purple/40"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Automated System Actions Checklist */}
          <div className="pt-2 border-t border-border space-y-2">
            <span className="font-bold text-ink uppercase text-[11px] block">
              Automated Coordinated Actions upon Revocation
            </span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resetVms}
                onChange={(e) => setResetVms(e.target.checked)}
                className="accent-purple"
              />
              <span className="text-ink">Reset Roadside VMS Displays to "NORMAL TRAFFIC CONDITIONS"</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={silenceSirens}
                onChange={(e) => setSilenceSirens(e.target.checked)}
                className="accent-purple"
              />
              <span className="text-ink">Sound 30-second "All-Clear" 440Hz Steady Tone &amp; Silence Sirens</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={broadcastAllClear}
                onChange={(e) => setBroadcastAllClear(e.target.checked)}
                className="accent-purple"
              />
              <span className="text-ink">Push "Safe to Re-enter / Roads Open" notification to JalDrishti App</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-xs text-ink-secondary font-mono">
            CAP &lt;msgType&gt;Cancel&lt;/msgType&gt; will be broadcast to all gateways.
          </span>

          <button
            onClick={handleRevoke}
            disabled={!selectedAlert}
            className="px-4 py-2 rounded-lg bg-status-safe hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirm Revocation &amp; Broadcast All-Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}

