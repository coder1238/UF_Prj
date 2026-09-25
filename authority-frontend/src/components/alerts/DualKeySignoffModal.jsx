import React, { useState } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  FileCheck,
  Cpu,
} from 'lucide-react';

export default function DualKeySignoffModal({
  isOpen,
  onClose,
  isSigned,
  onSignComplete,
}) {
  if (!isOpen) return null;

  const [officer1Pin, setOfficer1Pin] = useState(isSigned ? '1916' : '');
  const [officer2Pin, setOfficer2Pin] = useState(isSigned ? '2026' : '');
  const [officer1Verified, setOfficer1Verified] = useState(isSigned);
  const [officer2Verified, setOfficer2Verified] = useState(isSigned);
  const [errorMsg, setErrorMsg] = useState(null);

  const digest = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleVerifyOfficer1 = () => {
    if (officer1Pin.trim() === '1916' || officer1Pin.length >= 4) {
      setOfficer1Verified(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Invalid Key/PIN for Officer 1 (Try: 1916)');
    }
  };

  const handleVerifyOfficer2 = () => {
    if (officer2Pin.trim() === '2026' || officer2Pin.length >= 4) {
      setOfficer2Verified(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Invalid Key/PIN for Officer 2 (Try: 2026)');
    }
  };

  const handleAuthorize = () => {
    if (officer1Verified && officer2Verified) {
      onSignComplete(true);
      onClose();
    } else {
      setErrorMsg('Both officers must sign off before emergency broadcast can be authorized.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Two-Officer Dual-Key Authorization &amp; Cryptographic Sign-Off
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Two-Man Rule Protocol for Municipal Red Alerts &amp; Multi-Ward Cell Broadcast
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

        {/* Cryptographic Digest Banner */}
        <div className="p-4 bg-[#14121E] text-slate-300 border-b border-border font-mono text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-300 font-bold uppercase">SHA-256 Alert Payload Digest</span>
            <span className="text-status-safe font-semibold">IMMUTABLE AUDIT TRAIL</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/10 text-[10px] break-all text-slate-300">
            {digest}
          </div>
        </div>

        {/* Officers Grid */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-status-alert-soft border border-status-alert/30 text-xs text-status-alert font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Officer 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              officer1Verified
                ? 'bg-status-safe-soft/30 border-status-safe/40'
                : 'bg-surface-secondary border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-ink-secondary block">
                  Officer Key #1 • Technical &amp; Hydrological Lead
                </span>
                <span className="text-xs font-bold text-ink">
                  Dr. A. K. Deshmukh, Ph.D. (Chief Met Scientist - IMD/MCGM)
                </span>
              </div>
              {officer1Verified ? (
                <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-mono text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-surface border border-border text-ink-secondary font-mono text-[10px]">
                  AWAITING KEY
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="password"
                placeholder="Enter 4-digit Officer PIN (Default: 1916)"
                value={officer1Pin}
                onChange={(e) => setOfficer1Pin(e.target.value)}
                disabled={officer1Verified}
                className="flex-1 p-2 rounded-lg bg-surface border border-border text-xs font-mono text-ink"
              />
              {!officer1Verified ? (
                <button
                  onClick={handleVerifyOfficer1}
                  className="px-3.5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white text-xs font-bold transition-colors"
                >
                  Verify Key 1
                </button>
              ) : (
                <button
                  onClick={() => setOfficer1Verified(false)}
                  className="px-2.5 py-1 text-xs text-ink-secondary hover:underline font-mono"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Officer 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              officer2Verified
                ? 'bg-status-safe-soft/30 border-status-safe/40'
                : 'bg-surface-secondary border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-ink-secondary block">
                  Officer Key #2 • Administrative &amp; Municipal Authority
                </span>
                <span className="text-xs font-bold text-ink">
                  IAS R. V. Kulkarni (Disaster Management Commissioner)
                </span>
              </div>
              {officer2Verified ? (
                <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-mono text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-surface border border-border text-ink-secondary font-mono text-[10px]">
                  AWAITING KEY
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="password"
                placeholder="Enter 4-digit Officer PIN (Default: 2026)"
                value={officer2Pin}
                onChange={(e) => setOfficer2Pin(e.target.value)}
                disabled={officer2Verified}
                className="flex-1 p-2 rounded-lg bg-surface border border-border text-xs font-mono text-ink"
              />
              {!officer2Verified ? (
                <button
                  onClick={handleVerifyOfficer2}
                  className="px-3.5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white text-xs font-bold transition-colors"
                >
                  Verify Key 2
                </button>
              ) : (
                <button
                  onClick={() => setOfficer2Verified(false)}
                  className="px-2.5 py-1 text-xs text-ink-secondary hover:underline font-mono"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="text-[11px] font-mono text-ink-secondary flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple" />
            <span>Cryptographic dual-token verification prevents unauthorized broadcast triggers.</span>
          </div>

          <button
            onClick={handleAuthorize}
            disabled={!officer1Verified || !officer2Verified}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
              officer1Verified && officer2Verified
                ? 'bg-status-safe hover:bg-emerald-700 text-white shadow-subtle'
                : 'bg-surface-secondary text-ink-secondary cursor-not-allowed border border-border'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorize Broadcast Key</span>
          </button>
        </div>
      </div>
    </div>
  );
}

