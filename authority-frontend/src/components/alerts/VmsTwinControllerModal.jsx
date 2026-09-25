import React, { useState } from 'react';
import { X, Tv, Send, RefreshCw, CheckCircle2, AlertTriangle, Eye, Sliders } from 'lucide-react';

const INITIAL_VMS_SIGNS = [
  { id: 'VMS-WEH-01', location: 'Western Express Highway (Kalanagar)', corridor: 'WEH Northbound', currentLine1: 'FLASH FLOOD AHEAD: SION CIRCLE', currentLine2: 'AVOID UNDERPASS // DIVERT FREEWAY', status: 'OVERRIDDEN / ACTIVE', brightness: '95%' },
  { id: 'VMS-EEH-02', location: 'Eastern Express Highway (Chedda Nagar)', corridor: 'EEH Southbound', currentLine1: 'HEAVY INUNDATION KURLA LBS MARG', currentLine2: 'USE EASTERN FREEWAY ONLY', status: 'OVERRIDDEN / ACTIVE', brightness: '95%' },
  { id: 'VMS-SION-03', location: 'Sion Circle Flyover Approach', corridor: 'Sion Junction', currentLine1: 'SION SUBWAY WATER DEPTH 45CM', currentLine2: 'CORRIDOR CLOSED: DETOUR VIA WADALA', status: 'OVERRIDDEN / ACTIVE', brightness: '100%' },
  { id: 'VMS-ANDHERI-04', location: 'Andheri Subway Western Gantry', corridor: 'SV Road to WEH', currentLine1: 'ANDHERI SUBWAY CLOSED: WATERLOGGED', currentLine2: 'DIVERT VIA GOKHALE BRIDGE', status: 'OVERRIDDEN / ACTIVE', brightness: '100%' },
  { id: 'VMS-MILAN-05', location: 'Milan Subway East Ramp Gantry', corridor: 'Santacruz East', currentLine1: 'MILAN SUBWAY PUMPS AT FULL LOAD', currentLine2: 'EXPECT 20-30 MIN DELAYS', status: 'OVERRIDDEN / ACTIVE', brightness: '90%' },
  { id: 'VMS-FREEWAY-06', location: 'Eastern Freeway Anik Wadala Ramp', corridor: 'Freeway Southbound', currentLine1: 'FREEWAY CLEAR: NO WATERLOGGING', currentLine2: 'MAX SPEED 60 KM/H DURING RAINS', status: 'STANDARD ADVISORY', brightness: '85%' },
];

export default function VmsTwinControllerModal({
  isOpen,
  onClose,
  initialText = '',
}) {
  if (!isOpen) return null;

  const [signs, setSigns] = useState(INITIAL_VMS_SIGNS);
  const [selectedSignId, setSelectedSignId] = useState(INITIAL_VMS_SIGNS[0].id);
  const [phase1Line1, setPhase1Line1] = useState('FLASH FLOOD AHEAD: SION CIRCLE');
  const [phase1Line2, setPhase1Line2] = useState('WATER DEPTH >35CM AVOID SUBWAYS');
  const [phase2Line1, setPhase2Line1] = useState('DIVERT TO EASTERN FREEWAY');
  const [phase2Line2, setPhase2Line2] = useState('DIAL 1916 FOR RESCUE CONTROL');
  const [activePhase, setActivePhase] = useState(1);
  const [ledColor, setLedColor] = useState('amber'); // 'amber' | 'red'
  const [isBlinking, setIsBlinking] = useState(true);
  const [successToast, setSuccessToast] = useState(false);

  const selectedSign = signs.find((s) => s.id === selectedSignId) || signs[0];

  const handlePushOverride = () => {
    setSigns((prev) =>
      prev.map((s) =>
        s.id === selectedSignId
          ? {
              ...s,
              currentLine1: phase1Line1,
              currentLine2: phase1Line2,
              status: 'OVERRIDDEN / ACTIVE',
            }
          : s
      )
    );
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  const handlePushAll = () => {
    setSigns((prev) =>
      prev.map((s) => ({
        ...s,
        currentLine1: phase1Line1,
        currentLine2: phase1Line2,
        status: 'OVERRIDDEN / ACTIVE',
      }))
    );
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-warning-soft text-status-warning">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Roadside Variable Message Sign (VMS) LED Digital Twin
              </h3>
              <p className="text-[11px] text-ink-secondary">
                NTCIP 1203 Standard Arterial LED Display Controller &amp; Dual-Phase Preview
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

        {/* LED Simulator Bench */}
        <div className="p-5 bg-[#0C0B10] border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-safe animate-ping" />
              <span>Gantry Live Feed: {selectedSign.location} ({selectedSign.id})</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePhase(1)}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  activePhase === 1 ? 'bg-purple text-white font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                Phase 1 (Hazard)
              </button>
              <button
                onClick={() => setActivePhase(2)}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  activePhase === 2 ? 'bg-purple text-white font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                Phase 2 (Detour)
              </button>
            </div>
          </div>

          {/* Realistic VMS LED Housing */}
          <div className="bg-[#121118] p-4 rounded-2xl border-4 border-[#222] shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase">
              <span>MCGM TRAFFIC VMS • NTCIP 1203 PROTOCOL</span>
            </div>

            <div
              className={`pt-5 pb-4 px-2 font-mono text-sm md:text-base tracking-[0.25em] font-extrabold text-center uppercase leading-relaxed ${
                ledColor === 'red' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              } ${isBlinking ? 'animate-pulse' : ''}`}
            >
              {activePhase === 1 ? (
                <>
                  <div>[ {phase1Line1} ]</div>
                  <div className="mt-1">[ {phase1Line2} ]</div>
                </>
              ) : (
                <>
                  <div>[ {phase2Line1} ]</div>
                  <div className="mt-1">[ {phase2Line2} ]</div>
                </>
              )}
            </div>
          </div>

          {/* LED Visual Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1">
            <div className="flex items-center gap-3">
              <span>LED Color:</span>
              <button
                onClick={() => setLedColor('amber')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ledColor === 'amber' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-300'
                }`}
              >
                Amber Caution
              </button>
              <button
                onClick={() => setLedColor('red')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ledColor === 'red' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                Red Hazard
              </button>
              <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBlinking}
                  onChange={(e) => setIsBlinking(e.target.checked)}
                  className="accent-purple"
                />
                <span className="text-[10px]">Hazard Pulse Blink</span>
              </label>
            </div>

            {successToast && (
              <span className="text-status-safe font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Gantry Override Deployed Successfully!
              </span>
            )}
          </div>
        </div>

        {/* Workspace: Message Customizer & Sign Selectors */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase 1 & 2 Inputs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wide text-[11px]">
              VMS Dual-Phase Sequence Programming
            </h4>

            <div>
              <label className="text-[10px] font-mono font-bold text-ink-secondary uppercase block mb-1">
                Phase 1 Line 1 (Hazard Condition)
              </label>
              <input
                type="text"
                maxLength={32}
                value={phase1Line1}
                onChange={(e) => setPhase1Line1(e.target.value.toUpperCase())}
                className="w-full p-2 rounded-lg bg-surface-secondary border border-border font-mono font-bold text-ink text-xs focus:border-purple"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-ink-secondary uppercase block mb-1">
                Phase 1 Line 2 (Immediate Warning)
              </label>
              <input
                type="text"
                maxLength={32}
                value={phase1Line2}
                onChange={(e) => setPhase1Line2(e.target.value.toUpperCase())}
                className="w-full p-2 rounded-lg bg-surface-secondary border border-border font-mono font-bold text-ink text-xs focus:border-purple"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-ink-secondary uppercase block mb-1">
                Phase 2 Line 1 (Detour Guidance)
              </label>
              <input
                type="text"
                maxLength={32}
                value={phase2Line1}
                onChange={(e) => setPhase2Line1(e.target.value.toUpperCase())}
                className="w-full p-2 rounded-lg bg-surface-secondary border border-border font-mono font-bold text-ink text-xs focus:border-purple"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-ink-secondary uppercase block mb-1">
                Phase 2 Line 2 (Emergency Contact)
              </label>
              <input
                type="text"
                maxLength={32}
                value={phase2Line2}
                onChange={(e) => setPhase2Line2(e.target.value.toUpperCase())}
                className="w-full p-2 rounded-lg bg-surface-secondary border border-border font-mono font-bold text-ink text-xs focus:border-purple"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handlePushOverride}
                className="flex-1 py-2 px-3 bg-purple hover:bg-purple-deep text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Override Selected ({selectedSign.id})</span>
              </button>

              <button
                onClick={handlePushAll}
                className="py-2 px-3 bg-surface border border-border hover:bg-surface-secondary text-ink font-bold rounded-lg text-xs transition-colors"
              >
                Push to All 24 Gantries
              </button>
            </div>
          </div>

          {/* VMS Gantries Directory */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-ink uppercase tracking-wide text-[11px]">
              Highway Gantries Network ({signs.length} Active Displays)
            </span>

            <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
              {signs.map((sign) => (
                <div
                  key={sign.id}
                  onClick={() => setSelectedSignId(sign.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedSignId === sign.id
                      ? 'bg-purple-soft/30 border-purple text-ink font-semibold'
                      : 'bg-surface-secondary border-border hover:border-purple/30 text-ink-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-bold text-ink">{sign.id} • {sign.corridor}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-status-safe-soft text-status-safe font-bold">
                      {sign.status.split(' / ')[0]}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink font-medium truncate">{sign.location}</div>
                  <div className="text-[10px] font-mono text-ink-secondary mt-1">
                    Line 1: {sign.currentLine1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between bg-surface-subtle text-[11px] text-ink-secondary font-mono">
          <span>VMS updates broadcast over MCGM Optical Fiber SCADA loop.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-ink hover:bg-surface-secondary text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

