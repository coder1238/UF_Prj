import React, { useState } from 'react';
import { X, RefreshCw, Trash2, Zap } from 'lucide-react';
import { BAR_SCREENS } from './drainageConstants';

export default function TrashScreenRakeModal({ isOpen, onClose, showToast }) {
  const [screens, setScreens] = useState(BAR_SCREENS);
  const [rakingId, setRakingId] = useState(null);

  if (!isOpen) return null;

  const handleManualRake = (screenId) => {
    setRakingId(screenId);
    setScreens((prev) =>
      prev.map((s) =>
        s.id === screenId
          ? {
              ...s,
              rakeStatus: 'MANUAL RAKE CYCLE ENGAGED',
              motorAmps: 22.4,
            }
          : s
      )
    );

    setTimeout(() => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? {
                ...s,
                rakeStatus: 'STANDBY (CLEANED)',
                deltaHM: 0.12,
                upstreamHeadM: s.downstreamHeadM + 0.12,
                debrisCollectedKg: s.debrisCollectedKg + 180,
                motorAmps: 0.0,
              }
            : s
        )
      );
      setRakingId(null);
      showToast(`Mechanical trash rake completed for ${screenId}. Debris cleared (+180 kg).`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Mechanical Bar Screen &amp; Automated Trash Rack Controller
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  NULLAH INLET PROTECTION
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Differential Head Monitoring &amp; High-Torque Mechanical Rake Cycles
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {screens.map((screen) => {
              const isChoked = screen.deltaHM > screen.autoTriggerDeltaM;
              const isRaking = rakingId === screen.id || screen.rakeStatus.includes('ACTIVE');

              return (
                <div
                  key={screen.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isChoked
                      ? 'bg-amber-500/5 border-amber-500/40 shadow-subtle'
                      : 'bg-surface-secondary border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-ink">{screen.id}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        isRaking
                          ? 'bg-purple text-white animate-pulse'
                          : isChoked
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {screen.rakeStatus}
                    </span>
                  </div>

                  <div className="text-xs text-ink font-semibold mb-3 truncate">{screen.location}</div>

                  {/* Differential Head */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Upstream Head</span>
                      <span className="font-bold text-ink">{screen.upstreamHeadM.toFixed(2)}m</span>
                    </div>
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Downstream</span>
                      <span className="font-bold text-ink">{screen.downstreamHeadM.toFixed(2)}m</span>
                    </div>
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Head Loss (ΔH)</span>
                      <span className={`font-bold ${isChoked ? 'text-status-alert' : 'text-purple'}`}>
                        {screen.deltaHM.toFixed(2)}m
                      </span>
                    </div>
                  </div>

                  {/* Telemetry footer */}
                  <div className="flex items-center justify-between text-[10px] text-ink-secondary pt-2 border-t border-border/50">
                    <span>Debris: {screen.debrisCollectedKg} kg</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {screen.motorAmps} A
                    </span>
                    <button
                      disabled={isRaking}
                      onClick={() => handleManualRake(screen.id)}
                      className="px-2.5 py-1 rounded bg-purple-soft text-purple hover:bg-purple hover:text-white font-bold transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRaking ? 'animate-spin' : ''}`} />
                      <span>{isRaking ? 'Raking...' : 'Trigger Rake'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Auto-clean trigger threshold: <strong>ΔH &gt; 0.35m head differential</strong>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Rack Controller
          </button>
        </div>
      </div>
    </div>
  );
}

