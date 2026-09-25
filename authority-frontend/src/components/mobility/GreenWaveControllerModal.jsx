import React, { useState, useEffect } from 'react';
import { X, Radio, Play, Pause, CheckCircle, Shield, Clock, Camera } from 'lucide-react';
import { GREEN_WAVE_CORRIDORS } from './mobilityConstants';

export default function GreenWaveControllerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [signals, setSignals] = useState(GREEN_WAVE_CORRIDORS);
  const [isPreemptionActive, setIsPreemptionActive] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState(GREEN_WAVE_CORRIDORS[0]);
  const [corridorTimeSavedMin, setCorridorTimeSavedMin] = useState(7.5);
  const [toast, setToast] = useState(null);

  // Simulated countdown
  useEffect(() => {
    if (!isPreemptionActive) return;
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => ({
          ...s,
          countdownSec: s.countdownSec > 1 ? s.countdownSec - 1 : 90,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isPreemptionActive]);

  const toggleHold = (id) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, preemptionStatus: s.preemptionStatus === 'GREEN LOCKED' ? 'PREEMPTION READY' : 'GREEN LOCKED' } : s))
    );
    setToast(`Signal ${id} state manually locked/released.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTriggerAll = () => {
    setIsPreemptionActive(true);
    setSignals((prev) => prev.map((s) => ({ ...s, preemptionStatus: 'GREEN LOCKED' })));
    setToast('Full Emergency Green Wave Activated across 7 Intersections!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-status-safe-soft text-status-safe">
              <Radio className="w-5 h-5 animate-pulse text-status-safe" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Emergency Traffic Signal Green Wave &amp; Corridor Preemption
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe text-white">
                  Active Sync
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Coordinated signal preemption prioritizing emergency ambulances and rescue convoys on EEH &amp; JVLR
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

          {/* Master Control Bar */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-ink block">Coordinated Corridor Preemption Mode</span>
              <span className="text-[11px] text-ink-secondary">
                Estimated Transit Savings: <strong className="text-status-safe">~{corridorTimeSavedMin} minutes</strong> vs static cycles
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTriggerAll}
                className="px-3.5 py-2 bg-status-safe text-white hover:bg-status-safe/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Lock All Signals Green
              </button>
              <button
                onClick={() => setIsPreemptionActive(!isPreemptionActive)}
                className="px-3.5 py-2 bg-surface border border-border text-ink hover:border-border-dark rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isPreemptionActive ? <Pause className="w-4 h-4 text-status-alert" /> : <Play className="w-4 h-4 text-status-safe" />}
                {isPreemptionActive ? 'Pause Preemption' : 'Resume Preemption'}
              </button>
            </div>
          </div>

          {/* Signal Intersections List */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary block">
              Synchronized Junction Controllers (7 Corridors)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {signals.map((sig) => {
                const isGreen = sig.preemptionStatus === 'GREEN LOCKED' || sig.preemptionStatus === 'GREEN HOLD ACTIVE';
                return (
                  <div
                    key={sig.id}
                    onClick={() => setSelectedSignal(sig)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedSignal.id === sig.id
                        ? 'border-purple bg-purple-soft/30 shadow-subtle'
                        : 'border-border bg-surface hover:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isGreen ? 'bg-status-safe animate-pulse' : 'bg-status-warning'}`}></span>
                        <span className="font-bold text-xs text-ink">{sig.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-ink border border-border">
                        {sig.id}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                      <span className="text-ink-secondary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Hold: {sig.countdownSec}s
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isGreen ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'}`}>
                        {sig.preemptionStatus}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted flex items-center gap-1">
                        <Camera className="w-3 h-3" /> ANPR CCTV {sig.cameraLive ? 'Online' : 'Offline'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHold(sig.id);
                        }}
                        className="text-purple font-semibold hover:underline"
                      >
                        Override State
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            NTCIP 1202 Protocol interface with Mumbai Traffic Police Area Traffic Control (ATC) System.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Controller
          </button>
        </div>
      </div>
    </div>
  );
}

