import React, { useState, useEffect, useRef } from 'react';
import { X, BellRing, Volume2, VolumeX, ShieldAlert, Zap, AlertTriangle, Play, Square, Activity } from 'lucide-react';
import { SIREN_PRESETS } from '../../data/alertsData';

export default function AlertSirenTestModal({ onClose }) {
  const [selectedSiren, setSelectedSiren] = useState(SIREN_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [enableStrobe, setEnableStrobe] = useState(true);
  const [strobeState, setStrobeState] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const animationIntervalRef = useRef(null);

  // Initialize or get Web Audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    return audioCtxRef.current;
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // already stopped
      }
      oscillatorRef.current = null;
    }
    clearInterval(animationIntervalRef.current);
    setIsPlaying(false);
    setStrobeState(false);
  };

  const playSiren = () => {
    stopSiren();
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = selectedSiren.type === 'chime' ? 'sine' : 'sawtooth';
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);

    const now = ctx.currentTime;
    if (selectedSiren.type === 'wail') {
      // Sweeping frequency
      osc.frequency.setValueAtTime(selectedSiren.baseFreq, now);
      for (let i = 0; i < 15; i++) {
        const cycle = i * 2.5;
        osc.frequency.linearRampToValueAtTime(selectedSiren.maxFreq, now + cycle + 1.25);
        osc.frequency.linearRampToValueAtTime(selectedSiren.baseFreq, now + cycle + 2.5);
      }
    } else if (selectedSiren.type === 'yelp') {
      // Fast pulsed frequency
      for (let i = 0; i < 30; i++) {
        const cycle = i * 0.8;
        osc.frequency.setValueAtTime(selectedSiren.baseFreq, now + cycle);
        osc.frequency.exponentialRampToValueAtTime(selectedSiren.maxFreq, now + cycle + 0.4);
      }
    } else {
      // Gentle chime
      osc.frequency.setValueAtTime(selectedSiren.baseFreq, now);
      osc.frequency.setValueAtTime(selectedSiren.maxFreq, now + 0.7);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    setIsPlaying(true);

    // Strobe animation
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = setInterval(() => {
      setStrobeState(s => !s);
    }, 400);

    // Auto stop after 10 seconds for user comfort
    setTimeout(() => {
      stopSiren();
    }, 10000);
  };

  useEffect(() => {
    return () => {
      stopSiren();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-200 ${
      enableStrobe && strobeState ? 'bg-red-950/80' : 'bg-ink/70'
    }`}>
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <BellRing className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} /> Municipal Alarm & Siren Simulator
          </div>
          <button
            onClick={() => {
              stopSiren();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning banner */}
        <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Acoustic test generates synthesized audio tones through your device speakers.</span>
        </div>

        {/* Siren Preset Selectors */}
        <div className="space-y-2.5 my-4">
          <label className="text-[11px] font-mono text-muted uppercase tracking-wider block">
            Select Siren Tone Profile
          </label>
          {SIREN_PRESETS.map((siren) => (
            <div
              key={siren.id}
              onClick={() => {
                if (isPlaying) stopSiren();
                setSelectedSiren(siren);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedSiren.id === siren.id
                  ? 'bg-purple-50/60 border-purple-400 shadow-sm ring-1 ring-purple-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">{siren.name}</span>
                <span className="text-[10px] font-mono font-extrabold text-purple-primary bg-purple-100 px-2 py-0.5 rounded-full">
                  ~{siren.decibelSim} dB
                </span>
              </div>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                {siren.description}
              </p>
            </div>
          ))}
        </div>

        {/* Controls: Volume and Strobe */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-500" /> Tone Output Volume
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (gainNodeRef.current && audioCtxRef.current) {
                gainNodeRef.current.gain.setValueAtTime(val * 0.3, audioCtxRef.current.currentTime);
              }
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
          />

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs text-slate-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Screen Strobe Warning Flash
            </span>
            <input
              type="checkbox"
              checked={enableStrobe}
              onChange={(e) => setEnableStrobe(e.target.checked)}
              className="w-4 h-4 rounded text-purple-primary focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Main Trigger Button */}
        <div className="pt-3 flex items-center gap-3">
          {isPlaying ? (
            <button
              onClick={stopSiren}
              className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" /> Stop Alarm Siren
            </button>
          ) : (
            <button
              onClick={playSiren}
              className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-ink text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" /> Test Siren Audio ({selectedSiren.name.split(' ')[0]})
            </button>
          )}

          <button
            onClick={() => {
              stopSiren();
              onClose();
            }}
            className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

