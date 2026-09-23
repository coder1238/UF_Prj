import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, AlertTriangle, Radio, Play, Square, 
  X, Sparkles, Sliders, BellRing, ShieldCheck
} from 'lucide-react';
import { playEmergencyTone, stopEmergencySiren } from '../alerts/AlertSirenSynthesizer';

export default function ProfileAudioSirenModal({ isOpen, onClose }) {
  const [activeTone, setActiveTone] = useState(null);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopEmergencySiren();
    };
  }, []);

  if (!isOpen) return null;

  const handlePlayTone = (type) => {
    stopEmergencySiren();
    setActiveTone(type);
    setIsPlaying(true);
    playEmergencyTone(type, volume);
  };

  const handleStop = () => {
    stopEmergencySiren();
    setIsPlaying(false);
    setActiveTone(null);
  };

  const sirenOptions = [
    {
      id: 'siren',
      title: 'BMC Civil Defense Air-Raid Siren',
      freq: '450 Hz – 780 Hz Sawtooth Sweep',
      desc: 'Activated for Catastrophic Level-3 Mithi River flash surges and dam crest overflows.',
      badge: 'URGENT RED'
    },
    {
      id: 'klaxon',
      title: 'NDRF Evacuation Dual-Tone Klaxon',
      freq: '520 Hz / 680 Hz Alternating Square Wave',
      desc: 'Used by ground search & rescue zodiac boats to signal immediate neighborhood evacuation.',
      badge: 'EVACUATION'
    },
    {
      id: 'chime',
      title: 'Metropolitan Advisory Broadcast Chime',
      freq: 'Tri-Tone D5-F#5-A5 Sine Harmonic',
      desc: 'Gentle notification tone announcing high tide recession and water pump clearance.',
      badge: 'INFORMATIONAL'
    },
    {
      id: 'morse',
      title: 'Acoustic SOS Morse Code Broadcast',
      freq: '800 Hz Pure Sine Pulse (... --- ...)',
      desc: 'International distress pattern readable through torrential rain and acoustic static.',
      badge: 'LIFE-SAVING'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 relative">
        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-ink rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink">Emergency Siren Acoustic Calibrator</h3>
            <p className="text-xs text-muted">
              Web Audio API real-time acoustic synthesizer for testing hardware speaker penetration in heavy rain.
            </p>
          </div>
        </div>

        {/* Volume & Status Controller */}
        <div className="mb-6 p-4 rounded-2xl bg-canvas border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono uppercase text-muted font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-primary" /> Audio Test Volume: {Math.round(volume * 100)}%
            </span>
            {isPlaying && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 animate-pulse flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-600" /> BROADCASTING LIVE TONE
              </span>
            )}
          </div>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (isPlaying && activeTone) {
                playEmergencyTone(activeTone, val);
              }
            }}
            className="w-full accent-purple-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Tone Options List */}
        <div className="space-y-3 mb-6">
          {sirenOptions.map((opt) => {
            const isThisPlaying = isPlaying && activeTone === opt.id;
            return (
              <div
                key={opt.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isThisPlaying
                    ? 'border-red-500 bg-red-50/60 ring-2 ring-red-400/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-sm text-ink">{opt.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700">
                      {opt.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-primary block mb-0.5">{opt.freq}</span>
                  <p className="text-xs text-muted leading-tight">{opt.desc}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isThisPlaying ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop Tone
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePlayTone(opt.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-purple-primary hover:text-white text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Test Siren
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
          >
            Done Calibrating
          </button>
        </div>
      </div>
    </div>
  );
}

