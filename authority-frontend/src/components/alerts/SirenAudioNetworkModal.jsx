import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  AlertTriangle,
  BatteryCharging,
  Radio,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

const SIREN_STATIONS = [
  { id: 'SRN-KURLA-01', location: 'Kurla Kranti Nagar (Mithi River Bank)', decibels: '125 dB', coverageRadius: '2.2 km', battery: '98% (Solar Trickle)', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
  { id: 'SRN-SION-02', location: 'Sion Circle Municipal Water Tank Mast', decibels: '125 dB', coverageRadius: '1.9 km', battery: '95%', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
  { id: 'SRN-ANDHERI-03', location: 'Andheri Subway Western Approach Gantry', decibels: '120 dB', coverageRadius: '1.5 km', battery: '100%', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
  { id: 'SRN-DHARAVI-04', location: 'Dharavi Transit Camp High-Site', decibels: '125 dB', coverageRadius: '2.0 km', battery: '92%', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
  { id: 'SRN-DADAR-05', location: 'Dadar Flower Market Central Mast', decibels: '120 dB', coverageRadius: '1.7 km', battery: '97%', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
  { id: 'SRN-BANDRA-06', location: 'Bandra Reclamation Storm Outfall', decibels: '125 dB', coverageRadius: '2.4 km', battery: '99%', status: 'ARMED / READY', lastAcousticTest: 'Today 06:00' },
];

export default function SirenAudioNetworkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTone, setActiveTone] = useState(null); // 'wail' | 'pulse' | 'allclear' | null
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // safe default volume
  const [sirens] = useState(SIREN_STATIONS);

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const timerRef = useRef(null);

  // Stop sound safely
  const stopAudio = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      gainRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    setActiveTone(null);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const playTone = (type) => {
    stopAudio();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.connect(gain);
      oscRef.current = osc;

      const now = ctx.currentTime;
      setActiveTone(type);
      setIsPlaying(true);

      if (type === 'wail') {
        // Oscillate pitch between 450Hz and 850Hz every 2.5 seconds
        osc.frequency.setValueAtTime(450, now);
        let up = true;
        let freq = 450;
        osc.start();

        timerRef.current = setInterval(() => {
          if (!audioCtxRef.current) return;
          freq = up ? freq + 40 : freq - 40;
          if (freq >= 850) up = false;
          if (freq <= 450) up = true;
          try {
            osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
          } catch (e) {
            // ignore
          }
        }, 80);
      } else if (type === 'pulse') {
        // Fast burst pulses
        osc.type = 'square';
        osc.frequency.setValueAtTime(620, now);
        osc.start();

        let isOn = true;
        timerRef.current = setInterval(() => {
          if (!gainRef.current || !audioCtxRef.current) return;
          isOn = !isOn;
          gainRef.current.gain.setValueAtTime(
            isOn ? volume : 0.0001,
            audioCtxRef.current.currentTime
          );
        }, 220);
      } else if (type === 'allclear') {
        // Steady continuous harmonic tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.start();
      }
    } catch (err) {
      console.error('Audio synthesis failed:', err);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Acoustic Siren Network &amp; Electronic Sound Bench
              </h3>
              <p className="text-[11px] text-ink-secondary">
                125 dB Outdoor Warning Electronic Siren Masts • Web Audio API Synthesizer
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Bench */}
        <div className="p-5 bg-gradient-to-r from-[#1E192B] to-[#12101C] text-white border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
              Acoustic Siren Signal Generator
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {isPlaying ? `Broadcasting: ${activeTone?.toUpperCase()} TONE` : 'Acoustic Sirens Standing By (Silent)'}
              </span>
              {isPlaying && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-alert opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-alert"></span>
                </span>
              )}
            </div>
          </div>

          {/* Tone Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => playTone('wail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTone === 'wail'
                  ? 'bg-status-alert text-white shadow-elevated'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Red Alert Wail (Oscillating)</span>
            </button>

            <button
              onClick={() => playTone('pulse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTone === 'pulse'
                  ? 'bg-status-warning text-white shadow-elevated'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Evacuate Pulse (Rapid)</span>
            </button>

            <button
              onClick={() => playTone('allclear')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTone === 'allclear'
                  ? 'bg-status-safe text-white shadow-elevated'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>All-Clear Steady (440Hz)</span>
            </button>

            {isPlaying && (
              <button
                onClick={stopAudio}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Mute / Stop</span>
              </button>
            )}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <Volume2 className="w-4 h-4 text-purple-300" />
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-purple cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Siren Stations List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
          <div className="text-xs font-bold text-ink uppercase tracking-wide flex items-center justify-between mb-2">
            <span>Outdoor Siren Physical Installations ({sirens.length} Sites)</span>
            <span className="text-[10px] font-mono text-status-safe font-semibold">
              100% HARDWARE TELEMETRY OK
            </span>
          </div>

          {sirens.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-xl border border-border bg-surface-secondary/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ink">{s.id}</span>
                  <span className="font-bold text-ink">{s.location}</span>
                </div>
                <div className="text-[11px] text-ink-secondary mt-1 flex items-center gap-4 font-mono">
                  <span>Acoustic Output: {s.decibels}</span>
                  <span>Effective Reach: {s.coverageRadius}</span>
                  <span>Daily Test: {s.lastAcousticTest}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] self-end md:self-auto">
                <span className="flex items-center gap-1 text-ink-secondary">
                  <BatteryCharging className="w-3.5 h-3.5 text-status-safe" />
                  {s.battery}
                </span>
                <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary">
          <span>Electronic sirens comply with Bureau of Indian Standards (BIS) Public Safety Siren Standards.</span>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink font-semibold text-xs transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

