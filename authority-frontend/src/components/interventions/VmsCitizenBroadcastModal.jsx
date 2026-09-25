import React, { useState } from 'react';
import { X, Tv, Send, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function VmsCitizenBroadcastModal({
  isOpen,
  onClose,
  selectedCorridorName,
  simulatedPeak,
  hoursSaved,
}) {
  const { updateVmsSign, publishAlert, vmsSigns } = useFloodCommand();
  const [targetVmsId, setTargetVmsId] = useState(vmsSigns?.[0]?.id || 'vms-01');
  const [broadcastText, setBroadcastText] = useState(
    `MCGM TRAFFIC ALERT: ${selectedCorridorName.toUpperCase()} FLOOD HEAD MITIGATED TO ${simulatedPeak}CM. RESTRICTED TO HEAVY TRANSIT. USE ADVISORY BYPASS.`
  );
  const [citizenPushEnabled, setCitizenPushEnabled] = useState(true);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    // 1. Update VMS Display
    if (updateVmsSign) {
      updateVmsSign(targetVmsId, broadcastText, 'ACTIVE / LIVE DISPLAY');
    }

    // 2. Publish Citizen App Alert
    if (citizenPushEnabled && publishAlert) {
      publishAlert({
        id: `AL-${Date.now().toString().slice(-4)}`,
        title: `TRAFFIC ADVISORY: ${selectedCorridorName}`,
        wards: ['Ward F/N', 'Ward L'],
        status: 'PUBLISHED - ACTIVE',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        audienceReach: '320,000 citizens',
        depthRange: `${simulatedPeak} cm (Mitigated)`,
        channels: ['Traffic VMS LED', 'Citizen App', 'Emergency Cell Broadcast'],
      });
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Variable Message Sign (VMS) & Citizen Advisory Sync
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Transmit counterfactual street clearance updates to roadside LED signs and citizen phones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {successNotice ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-status-safe-soft text-status-safe flex items-center justify-center mx-auto border border-status-safe/30">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-sm font-bold text-ink">
                Highway VMS Displays Synchronized!
              </h4>
              <p className="text-xs text-ink-secondary">
                LED signboards updated and push notification sent to JalDrishti citizen mobile app.
              </p>
            </div>
          ) : (
            <>
              {/* VMS LED Sign Preview */}
              <div>
                <label className="text-xs font-semibold text-ink mb-1 block">
                  Highway LED Billboard Simulation Preview
                </label>
                <div className="p-4 bg-black rounded-xl border-2 border-slate-700 shadow-inner">
                  <div className="font-mono text-amber-400 text-xs font-bold tracking-widest leading-relaxed uppercase animate-pulse">
                    {broadcastText}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    <span>SIGN ID: {targetVmsId.toUpperCase()}</span>
                    <span>STATUS: READY TO OVERRIDE</span>
                  </div>
                </div>
              </div>

              {/* Message Editor */}
              <div>
                <label className="text-xs font-semibold text-ink mb-1 block">
                  Advisory Text Formulation
                </label>
                <textarea
                  rows="3"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-mono"
                />
              </div>

              {/* Citizen App Push Checkbox */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-ink">
                    Broadcast to JalDrishti Citizen Mobile App & Cell Broadcast
                  </div>
                  <div className="text-[11px] text-ink-secondary">
                    Notifies motorists in a 3 km geo-fence around {selectedCorridorName}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={citizenPushEnabled}
                  onChange={(e) => setCitizenPushEnabled(e.target.checked)}
                  className="w-4 h-4 accent-purple cursor-pointer"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!successNotice && (
          <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
            <span className="text-ink-secondary text-[11px]">
              Directly connected to Mumbai Traffic Police VMS Controller.
            </span>
            <button
              onClick={handleBroadcast}
              className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Live Broadcast
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

