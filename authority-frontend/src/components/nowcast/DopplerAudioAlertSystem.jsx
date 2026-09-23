import React, { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function DopplerAudioAlertSystem({ isOpen, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(65); // 0 to 100
  const [autoAlarmEnabled, setAutoAlarmEnabled] = useState(true);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  // Synthesize audio using Web Audio API
  const playSynthesizedTone = (type = 'siren') => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime((volume / 100) * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'siren') {
        setIsPlayingTest(true);
        // Dual-tone alternating siren
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.6);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.9);
        osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 1.2);

        osc.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);

        setTimeout(() => setIsPlayingTest(false), 1300);
      } else if (type === 'ping') {
        // Radar acoustic sweep blip
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);

        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'chime') {
        // Advisory two-tone chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.2);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.error('Web Audio error', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-elevated overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Tactical Radar Acoustic Alert System
              </h3>
              <p className="text-xs text-ink-secondary">
                Web Audio synthesized acoustic sirens &amp; Doppler sweep sounds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Master Mute & Volume */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink uppercase">Master Audio Output</span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 ${
                  isMuted
                    ? 'bg-status-alert-soft text-status-alert border-status-alert/40'
                    : 'bg-status-safe-soft text-status-safe border-status-safe/40'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'MUTED' : 'UNMUTED'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                disabled={isMuted}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer disabled:opacity-50"
              />
              <span className="font-mono text-xs font-bold text-purple w-10 text-right">
                {volume}%
              </span>
            </div>
          </div>

          {/* Automated Cloudburst Trigger */}
          <label className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border cursor-pointer hover:bg-surface transition-colors">
            <div>
              <div className="text-xs font-bold text-ink">Auto-Sound Cloudburst Alarm</div>
              <div className="text-[10px] text-ink-secondary">
                Trigger siren when any convective cell exceeds 55 dBZ threshold
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoAlarmEnabled}
              onChange={() => setAutoAlarmEnabled(!autoAlarmEnabled)}
              className="rounded accent-purple w-4 h-4"
            />
          </label>

          {/* Test Audio Synthesizer Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Acoustic Profile Tests
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => playSynthesizedTone('siren')}
                disabled={isMuted}
                className="p-2.5 rounded-xl border border-status-alert/40 bg-status-alert-soft text-status-alert hover:bg-red-100 text-xs font-mono font-bold flex flex-col items-center gap-1 transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Severe Siren</span>
              </button>

              <button
                onClick={() => playSynthesizedTone('ping')}
                disabled={isMuted}
                className="p-2.5 rounded-xl border border-purple/30 bg-purple-soft text-purple hover:bg-purple-100 text-xs font-mono font-bold flex flex-col items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Radio className="w-4 h-4" />
                <span>Sweep Ping</span>
              </button>

              <button
                onClick={() => playSynthesizedTone('chime')}
                disabled={isMuted}
                className="p-2.5 rounded-xl border border-border bg-surface-secondary text-ink hover:bg-surface text-xs font-mono font-bold flex flex-col items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Advisory Chime</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[10px] font-mono text-ink-secondary">
            Synthesizer: Web Audio API (No audio files needed)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

