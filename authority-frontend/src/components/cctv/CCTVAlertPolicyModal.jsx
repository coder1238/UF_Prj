import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, CheckCircle2, X, Bell, Zap } from 'lucide-react';

export default function CCTVAlertPolicyModal({
  isOpen,
  onClose,
  initialPolicy = {
    safeThreshold: 15,
    warningThreshold: 25,
    criticalThreshold: 35,
    autoVmsBroadcast: true,
    autoPumpTrigger: true,
    autoSirenAlarm: true,
    autoTowDispatch: false,
  },
  onSavePolicy,
}) {
  const [policy, setPolicy] = useState(initialPolicy);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePolicy(policy);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Threshold & Automated Incident Policies
              </h2>
              <p className="text-xs text-ink-secondary">
                Configure water depth triggers and automated command center actions
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
        <div className="p-6 space-y-5 text-ink text-xs">
          {/* Threshold Sliders */}
          <div className="space-y-3">
            <h4 className="font-bold text-ink uppercase tracking-wider">Depth Trigger Levels (cm)</h4>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-status-safe">Safe Level (Green):</span>
                <span className="font-mono font-bold">&lt; {policy.safeThreshold} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={policy.safeThreshold}
                onChange={(e) => setPolicy({ ...policy, safeThreshold: parseInt(e.target.value) })}
                className="w-full accent-status-safe h-1.5"
              />
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-status-amber">Warning / Caution Level (Amber):</span>
                <span className="font-mono font-bold">{policy.safeThreshold} - {policy.warningThreshold} cm</span>
              </div>
              <input
                type="range"
                min="15"
                max="40"
                value={policy.warningThreshold}
                onChange={(e) => setPolicy({ ...policy, warningThreshold: parseInt(e.target.value) })}
                className="w-full accent-status-amber h-1.5"
              />
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-status-alert">Critical Submersion Level (Red):</span>
                <span className="font-mono font-bold">&gt; {policy.warningThreshold} cm</span>
              </div>
            </div>
          </div>

          {/* Automated Trigger Checkboxes */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-ink uppercase tracking-wider">Automated Actuation Linkages</h4>

            <label className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border cursor-pointer hover:bg-purple-soft/20">
              <div>
                <div className="font-semibold text-ink">Auto-Broadcast to Traffic VMS Screens</div>
                <div className="text-[10px] text-ink-muted">Display detour warnings on approach gantries when &gt; Warning</div>
              </div>
              <input
                type="checkbox"
                checked={policy.autoVmsBroadcast}
                onChange={(e) => setPolicy({ ...policy, autoVmsBroadcast: e.target.checked })}
                className="w-4 h-4 accent-purple rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border cursor-pointer hover:bg-purple-soft/20">
              <div>
                <div className="font-semibold text-ink">Auto-Engage Mobile Dewatering Pumps</div>
                <div className="text-[10px] text-ink-muted">Send dispatch command to nearest 500HP Turbo Dewatering squad</div>
              </div>
              <input
                type="checkbox"
                checked={policy.autoPumpTrigger}
                onChange={(e) => setPolicy({ ...policy, autoPumpTrigger: e.target.checked })}
                className="w-4 h-4 accent-purple rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border cursor-pointer hover:bg-purple-soft/20">
              <div>
                <div className="font-semibold text-ink">Audio Siren & Flashing Redline Beacon</div>
                <div className="text-[10px] text-ink-muted">Sound acoustic operator siren when camera breaches &gt; 25 cm</div>
              </div>
              <input
                type="checkbox"
                checked={policy.autoSirenAlarm}
                onChange={(e) => setPolicy({ ...policy, autoSirenAlarm: e.target.checked })}
                className="w-4 h-4 accent-purple rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border cursor-pointer hover:bg-purple-soft/20">
              <div>
                <div className="font-semibold text-ink">Auto-Dispatch MCGM Heavy Tow Truck</div>
                <div className="text-[10px] text-ink-muted">Automatically alert tow cranes if a vehicle remains stationary in water &gt; 90s</div>
              </div>
              <input
                type="checkbox"
                checked={policy.autoTowDispatch}
                onChange={(e) => setPolicy({ ...policy, autoTowDispatch: e.target.checked })}
                className="w-4 h-4 accent-purple rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-end gap-2 bg-surface-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-ink hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-semibold hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-1.5"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Shield className="w-4 h-4" />}
            Save Policy Rules
          </button>
        </div>
      </div>
    </div>
  );
}

