import React, { useState } from 'react';
import { X, Tv, Send, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { VMS_SIGNS } from '../../data/floodData';

export default function VmsNetworkProgrammerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [signs, setSigns] = useState(VMS_SIGNS || []);
  const [selectedSign, setSelectedSign] = useState(VMS_SIGNS[0]);
  const [line1, setLine1] = useState(selectedSign?.currentText?.split('-')[0]?.trim() || 'LBS MARG WATERLOGGED');
  const [line2, setLine2] = useState(selectedSign?.currentText?.split('-')[1]?.trim() || 'DIVERT TO EEH FLYOVER');
  const [toast, setToast] = useState(null);

  const handleSelect = (sign) => {
    setSelectedSign(sign);
    const parts = (sign.currentText || '').split('-');
    setLine1(parts[0]?.trim() || 'FLOOD ADVISORY');
    setLine2(parts[1]?.trim() || 'REDUCE SPEED');
  };

  const handlePushUpdate = (e) => {
    e.preventDefault();
    const updatedText = `${line1.toUpperCase()} - ${line2.toUpperCase()}`;
    setSigns((prev) =>
      prev.map((s) => (s.id === selectedSign.id ? { ...s, currentText: updatedText } : s))
    );
    setSelectedSign((prev) => ({ ...prev, currentText: updatedText }));
    setToast(`Gantry ${selectedSign.id} LED Display Updated Successfully!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Tv className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Variable Message Signs (VMS) Highway Network Programmer
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe text-white">
                  10 Gantries Online
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Push real-time arterial diversion notices to electronic highway LED overhead gantries
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
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1 text-xs">
          {/* Left Column: Sign List (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary block">
              Highway Gantry Displays
            </span>

            {toast && (
              <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{toast}</span>
              </div>
            )}

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {signs.map((sign) => {
                const isSelected = selectedSign?.id === sign.id;
                return (
                  <div
                    key={sign.id}
                    onClick={() => handleSelect(sign)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-soft/40 border-purple shadow-elevated'
                        : 'bg-surface border-border hover:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{sign.name}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-secondary text-ink-secondary border border-border">
                        {sign.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-secondary block mt-0.5 font-mono">{sign.location}</span>
                    <div className="mt-2 p-1.5 bg-ink text-amber-400 font-mono text-[10px] rounded border border-neutral-800 tracking-wider font-bold truncate">
                      {sign.currentText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: LED Preview & Programmer (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4 bg-surface-secondary/40 p-4 rounded-xl border border-border">
            <span className="text-xs font-mono font-bold text-ink uppercase">
              Live LED Matrix Simulator &bull; {selectedSign?.id}
            </span>

            {/* Simulated Amber LED Highway Sign Board */}
            <div className="p-4 rounded-xl bg-black border-4 border-neutral-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-1.5 font-mono">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">OVERHEAD GANTRY DISPLAY</span>
              <div className="text-amber-400 text-sm font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                {line1 || 'LINE 1 MESSAGE'}
              </div>
              <div className="text-amber-400 text-sm font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                {line2 || 'LINE 2 DETOUR INSTRUCTION'}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handlePushUpdate} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">
                  Line 1 Text (Hazard / Closure)
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full px-2.5 py-1.5 uppercase font-mono text-xs bg-surface border border-border rounded-lg text-ink"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">
                  Line 2 Text (Action / Detour)
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full px-2.5 py-1.5 uppercase font-mono text-xs bg-surface border border-border rounded-lg text-ink"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px] text-ink-secondary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0" />
                <span>Synchronized with Mumbai Traffic Control (MTP) Smart Gantry Server.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
              >
                <Send className="w-3.5 h-3.5" /> Push Update to Highway Gantry
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            Compliant with IRC:SP:85 Highway Intelligent Transportation Systems Guidelines.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close VMS Programmer
          </button>
        </div>
      </div>
    </div>
  );
}

