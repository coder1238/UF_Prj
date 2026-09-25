import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Play, Square, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DistressAcousticSynthesizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSignal, setActiveSignal] = useState(null); // 'whistle3', 'sos', 'siren'
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const timeoutsRef = useRef([]);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAllAudio = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    setActiveSignal(null);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Play single tone helper
  const playTone = (ctx, freq, startTime, duration, type = 'sine') => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Volume envelope to avoid clicks
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.setValueAtTime(volume, startTime + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Three-Blast Whistle
  const startWhistle3 = () => {
    stopAllAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    setIsPlaying(true);
    setActiveSignal('whistle3');

    const scheduleWhistles = () => {
      const now = ctx.currentTime;
      // 3 blasts: 0.6s on, 0.4s off
      // Whistle has 2 harmonics (850Hz and 1700Hz)
      for (let i = 0; i < 3; i++) {
        const t = now + i * 1.0;
        playTone(ctx, 880, t, 0.6, 'sine');
        playTone(ctx, 1760, t, 0.6, 'triangle');
      }

      // Loop after 4.5 seconds
      const timeoutId = setTimeout(() => {
        if (isPlaying) {
          scheduleWhistles();
        }
      }, 4500);
      timeoutsRef.current.push(timeoutId);
    };

    scheduleWhistles();
  };

  // 2. SOS Morse Code (... --- ...)
  const startSosMorse = () => {
    stopAllAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    setIsPlaying(true);
    setActiveSignal('sos');

    const dotDuration = 0.15;
    const dashDuration = 0.45;
    const freq = 800;

    const scheduleSos = () => {
      let t = ctx.currentTime + 0.1;

      // 3 dots
      for (let i = 0; i < 3; i++) {
        playTone(ctx, freq, t, dotDuration, 'sine');
        t += dotDuration + 0.15;
      }
      t += 0.2; // letter pause

      // 3 dashes
      for (let i = 0; i < 3; i++) {
        playTone(ctx, freq, t, dashDuration, 'sine');
        t += dashDuration + 0.15;
      }
      t += 0.2; // letter pause

      // 3 dots
      for (let i = 0; i < 3; i++) {
        playTone(ctx, freq, t, dotDuration, 'sine');
        t += dotDuration + 0.15;
      }

      // Loop after 5 seconds
      const timeoutId = setTimeout(() => {
        if (isPlaying) scheduleSos();
      }, 5000);
      timeoutsRef.current.push(timeoutId);
    };

    scheduleSos();
  };

  // 3. Siren Sweep
  const startSirenSweep = () => {
    stopAllAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    setIsPlaying(true);
    setActiveSignal('siren');

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

    // LFO for sweep
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime); // 0.5 Hz sweep (2 sec period)
    lfoGain.gain.setValueAtTime(300, ctx.currentTime); // sweep +/- 300Hz

    osc.frequency.setValueAtTime(800, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-600 uppercase tracking-wider">
            <Radio className="w-4 h-4" /> Feature 06: Search & Rescue Acoustic Beacon
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Universal Acoustic Distress Whistle & SOS Siren Synthesizer
          </h2>
          <p className="text-xs text-muted mt-1">
            Generates high-decibel acoustic beacon signals using Web Audio API to alert disaster rescue boats and airborne search teams.
          </p>
        </div>

        {isPlaying && (
          <button
            onClick={stopAllAudio}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> Silence Alarm
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Signal 1: 3-Blast Whistle */}
        <div className={`p-5 rounded-2xl border transition-all ${
          activeSignal === 'whistle3' ? 'border-purple-primary bg-purple-50/50 shadow-xs' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono font-bold text-purple-primary uppercase">Standard Search & Rescue</span>
            {activeSignal === 'whistle3' && (
              <span className="w-2.5 h-2.5 rounded-full bg-purple-primary animate-ping"></span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-ink">3-Blast Universal Distress Whistle</h3>
          <p className="text-xs text-muted mt-1 leading-snug">
            3 distinct whistle bursts (880Hz / 1760Hz harmonics). Repeats every 4.5 seconds.
          </p>
          <button
            onClick={activeSignal === 'whistle3' ? stopAllAudio : startWhistle3}
            className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSignal === 'whistle3'
                ? 'bg-purple-primary text-white'
                : 'bg-canvas text-ink hover:bg-purple-soft hover:text-purple-deep'
            }`}
          >
            {activeSignal === 'whistle3' ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {activeSignal === 'whistle3' ? 'Stop Whistle' : 'Play 3-Blast Whistle'}
          </button>
        </div>

        {/* Signal 2: SOS Morse */}
        <div className={`p-5 rounded-2xl border transition-all ${
          activeSignal === 'sos' ? 'border-red-500 bg-red-50/50 shadow-xs' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono font-bold text-red-600 uppercase">International Maritime</span>
            {activeSignal === 'sos' && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-ink">SOS Morse Code Beacon</h3>
          <p className="text-xs text-muted mt-1 leading-snug">
            Standard acoustic Morse pattern: 3 dots, 3 dashes, 3 dots (... --- ...) at 800Hz.
          </p>
          <button
            onClick={activeSignal === 'sos' ? stopAllAudio : startSosMorse}
            className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSignal === 'sos'
                ? 'bg-red-600 text-white'
                : 'bg-canvas text-ink hover:bg-red-50 hover:text-red-700'
            }`}
          >
            {activeSignal === 'sos' ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {activeSignal === 'sos' ? 'Stop SOS Beacon' : 'Play SOS Morse Code'}
          </button>
        </div>

        {/* Signal 3: Evacuation Siren */}
        <div className={`p-5 rounded-2xl border transition-all ${
          activeSignal === 'siren' ? 'border-amber-500 bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Civic Warning</span>
            {activeSignal === 'siren' && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-ink">High-Frequency Warning Siren</h3>
          <p className="text-xs text-muted mt-1 leading-snug">
            Continuous variable frequency siren sweep (600Hz–1200Hz) penetrating heavy rain noise.
          </p>
          <button
            onClick={activeSignal === 'siren' ? stopAllAudio : startSirenSweep}
            className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSignal === 'siren'
                ? 'bg-amber-600 text-white'
                : 'bg-canvas text-ink hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            {activeSignal === 'siren' ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {activeSignal === 'siren' ? 'Stop Siren' : 'Play Siren Sweep'}
          </button>
        </div>
      </div>

      {/* Volume Slider & Audio Safety Tips */}
      <div className="p-4 rounded-2xl bg-canvas border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-600 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-700">Synthesizer Volume:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="accent-purple-primary w-28 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-slate-600">{Math.round(volume * 100)}%</span>
        </div>

        <span className="text-[11px] text-muted font-sans">
          <strong>Acoustic Range Fact:</strong> A 105 dB whistle frequency cuts through monsoon rain noise up to <strong>1.6 km</strong>, while screaming carries only 150m.
        </span>
      </div>
    </div>
  );
}

