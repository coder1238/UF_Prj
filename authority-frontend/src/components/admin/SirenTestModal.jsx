import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, AlertOctagon, CheckCircle2, Radio, BellRing, Play, Square } from 'lucide-react';

export default function SirenTestModal({ sirens, onClose, onSirenTriggered }) {
  const [selectedSiren, setSelectedSiren] = useState(sirens[0]?.id || 'SRN-01');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [testMode, setTestMode] = useState('single'); // 'single' | 'ward' | 'citywide'
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);

  const startAcousticSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const now = ctx.currentTime;
      // Wailing siren frequency cycle
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(800, now + 1.2);
      osc.frequency.linearRampToValueAtTime(450, now + 2.4);
      osc.frequency.linearRampToValueAtTime(800, now + 3.6);
      osc.frequency.linearRampToValueAtTime(450, now + 4.8);

      gain.gain.setValueAtTime(0.08, now);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);

      oscillatorRef.current = osc;
      gainRef.current = gain;
      setIsPlayingSound(true);

      // Stop after 5 seconds automatically
      setTimeout(() => {
        stopAcousticSiren();
      }, 5000);
    } catch (err) {
      console.error('Audio synthesizer error:', err);
    }
  };

  const stopAcousticSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch {
      // ignore
    }
    oscillatorRef.current = null;
    audioContextRef.current = null;
    setIsPlayingSound(false);
  };

  useEffect(() => {
    return () => {
      stopAcousticSiren();
    };
  }, []);

  const handleExecuteActivation = () => {
    startAcousticSiren();
    if (onSirenTriggered) {
      onSirenTriggered({
        mode: testMode,
        sirenId: selectedSiren,
        time: new Date().toLocaleTimeString('en-IN') + ' IST',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-alert text-white">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Municipal High-Decibel Acoustic Siren Controller
              </h3>
              <p className="text-[11px] text-ink-secondary">
                135 dB Outdoor Warning Network (42 Active Siren Towers)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAcousticSiren();
              onClose();
            }}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Test Mode Selector */}
          <div>
            <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1.5">
              Activation Scope
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single', label: 'Single Tower Ping', desc: 'Silent telemetry diagnostic' },
                { id: 'ward', label: 'Ward Cluster Blast', desc: 'Active audible evacuation' },
                { id: 'citywide', label: 'Citywide Coastal', desc: 'All 42 towers simultaneous' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTestMode(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    testMode === m.id
                      ? 'bg-purple-soft/40 border-purple text-ink font-bold shadow-subtle'
                      : 'bg-surface-secondary/60 border-border text-ink-secondary hover:text-ink'
                  }`}
                >
                  <div className="text-xs">{m.label}</div>
                  <div className="text-[9px] font-normal text-ink-secondary mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Siren Selector */}
          {testMode !== 'citywide' && (
            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Select Siren Node
              </label>
              <select
                value={selectedSiren}
                onChange={(e) => setSelectedSiren(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
              >
                {sirens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.location} ({s.ward}) - {s.dbLevel} dB
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sound Synthesizer Banner */}
          <div className="p-3 bg-ink text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isPlayingSound ? 'bg-status-alert animate-bounce' : 'bg-white/10'}`}>
                {isPlayingSound ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white/60" />}
              </div>
              <div>
                <div className="font-bold text-xs font-mono">
                  {isPlayingSound ? 'ACOUSTIC SYNTHESIZER EMITTING (5 SEC TEST)' : 'ACOUSTIC SYNTHESIZER READY'}
                </div>
                <div className="text-[10px] text-white/60">
                  Dual-tone wail audio generated via HTML5 Web Audio API
                </div>
              </div>
            </div>

            {isPlayingSound ? (
              <button
                type="button"
                onClick={stopAcousticSiren}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Mute</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startAcousticSiren}
                className="px-3 py-1 bg-purple hover:bg-purple-deep text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Play Sound</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl text-[11px] text-ink-secondary space-y-1 font-mono">
            <div className="flex justify-between">
              <span>National Acoustic Standard:</span>
              <strong className="text-ink">NDMA Disaster Sirens 130dB</strong>
            </div>
            <div className="flex justify-between">
              <span>Telemetry Control Link:</span>
              <strong className="text-status-safe">Secured UHF / 4G VPN</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ink-secondary">
            {testMode === 'citywide' ? (
              <span className="text-status-alert font-bold">ALL 42 SIRENS SELECTED</span>
            ) : (
              <span>1 Node Selected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopAcousticSiren();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteActivation}
              className="px-4 py-2 bg-status-alert text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>
                {testMode === 'single' && 'Ping Silent Diagnostic'}
                {testMode === 'ward' && 'Trigger Ward Siren'}
                {testMode === 'citywide' && 'TRIGGER CITYWIDE SIRENS'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

