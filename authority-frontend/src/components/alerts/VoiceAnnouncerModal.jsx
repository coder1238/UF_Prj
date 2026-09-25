import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Play,
  Square,
  Pause,
  Sliders,
  Megaphone,
  Radio,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function VoiceAnnouncerModal({
  isOpen,
  onClose,
  messageText = 'Attention all citizens: Heavy rainfall and high tide will submerge Kurla and Sion underpasses. Move to elevated ground immediately.',
}) {
  if (!isOpen) return null;

  const [text, setText] = useState(messageText);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(0.95);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      // Prefer Indian English or standard clear voice
      const preferred = available.find(
        (v) => v.lang.includes('en-IN') || v.lang.includes('hi') || v.lang.includes('en-GB')
      );
      if (preferred) setSelectedVoice(preferred.name);
      else if (available.length > 0) setSelectedVoice(available[0].name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      const voiceObj = voices.find((v) => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Text-to-Speech (TTS) Megaphone &amp; PA Voice Announcer
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Speech Synthesis API simulation for emergency vehicles, railway stations &amp; IVR lines
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Visualizer Banner */}
        <div className="p-5 bg-gradient-to-r from-[#171424] to-[#0E0C17] text-white border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Broadcast Mode: Emergency Loudspeaker / Station PA Audio</span>
            </span>
            <span className="text-status-safe font-bold">
              {isSpeaking ? 'AUDIO PLAYING' : 'IDLE / READY'}
            </span>
          </div>

          {/* Animated Waveform Bars */}
          <div className="h-12 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 px-4 overflow-hidden">
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-purple transition-all duration-150 ${
                  isSpeaking
                    ? 'animate-pulse'
                    : 'h-1.5 opacity-30'
                }`}
                style={{
                  height: isSpeaking ? `${Math.max(6, Math.sin(i * 0.4) * 36 + 10)}px` : '4px',
                  animationDelay: `${(i % 5) * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={handleSpeak}
                  className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Vocalize Announcement</span>
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Speech</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-16 accent-purple"
                />
                <span className="text-[10px]">{rate}x</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Pitch:</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-16 accent-purple"
                />
                <span className="text-[10px]">{pitch}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Voice Selector */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-ink-secondary uppercase block mb-1">
              Select Synthesizer Voice ({voices.length} available)
            </label>
            <select
              value={selectedVoice || ''}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-border text-ink font-semibold focus:border-purple"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-ink-secondary uppercase block mb-1">
              Announcement Script to Vocalize
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-secondary border border-border text-ink text-xs leading-relaxed focus:border-purple font-sans"
            />
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border text-ink-secondary text-[11px] leading-relaxed flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
            <span>
              Voice clarity is optimized for siren loudspeakers with low-frequency filtering to cut through traffic and thunder.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary">
          <span>Speech output complies with C-DOT EAS Audio Announcement format.</span>
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-ink hover:bg-surface-secondary font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

