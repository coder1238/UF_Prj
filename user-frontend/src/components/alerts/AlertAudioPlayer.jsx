import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Globe2, X, Sparkles } from 'lucide-react';

export default function AlertAudioPlayer({ alerts = [], currentLanguage = 'en', onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const intervalRef = useRef(null);

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const currentAlert = activeAlerts[currentIndex] || alerts[0];

  // Get localized speech text
  const getSpeechContent = (alert) => {
    if (!alert) return 'No active alerts to broadcast.';
    if (currentLanguage === 'mr' && alert.translations?.mr) {
      return `${alert.translations.mr.soundAlert}. ${alert.translations.mr.directives?.join('. ')}`;
    }
    if (currentLanguage === 'hi' && alert.translations?.hi) {
      return `${alert.translations.hi.soundAlert}. ${alert.translations.hi.directives?.join('. ')}`;
    }
    return `${alert.soundAlert}. Directives: ${alert.directives?.join('. ')}`;
  };

  const startSpeaking = (index) => {
    if (!synthRef.current || !activeAlerts.length) return;
    synthRef.current.cancel();

    const targetAlert = activeAlerts[index];
    if (!targetAlert) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const text = getSpeechContent(targetAlert);
    const utterance = new SpeechSynthesisUtterance(text);

    if (currentLanguage === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (currentLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setProgress(p => Math.min(p + 3, 95));
      }, 500);
    };

    utterance.onend = () => {
      clearInterval(intervalRef.current);
      setProgress(100);
      if (index + 1 < activeAlerts.length) {
        setCurrentIndex(index + 1);
        setTimeout(() => startSpeaking(index + 1), 600);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (!synthRef.current) return;
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      startSpeaking(currentIndex);
    }
  };

  const restartDigest = () => {
    setCurrentIndex(0);
    startSpeaking(0);
  };

  const nextAlert = () => {
    if (currentIndex + 1 < activeAlerts.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (isPlaying) startSpeaking(nextIdx);
    }
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-purple-500/30 shadow-xl mb-6 relative overflow-hidden">
      {/* Background audio glow animation */}
      <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all ${
        isPlaying ? 'bg-purple-600/30 animate-pulse' : 'bg-transparent'
      }`} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            {isPlaying ? (
              <div className="flex items-end gap-1 h-6">
                <span className="w-1 bg-purple-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce h-6" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce h-5" style={{ animationDelay: '450ms' }} />
              </div>
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Official Audio Digest
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Item {activeAlerts.length > 0 ? currentIndex + 1 : 0} of {activeAlerts.length}
              </span>
              <span className="text-[10px] font-mono uppercase text-purple-300 font-semibold">
                [{currentLanguage.toUpperCase()}]
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 line-clamp-1 mt-0.5">
              {currentAlert ? (currentLanguage === 'mr' && currentAlert.translations?.mr?.title ? currentAlert.translations.mr.title : currentAlert.title) : 'No alerts'}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setPlaybackRate(r => (r === 1.0 ? 1.25 : r === 1.25 ? 1.5 : 1.0))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-300 transition-colors"
            title="Adjust voice speed"
          >
            {playbackRate}x
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={restartDigest}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Restart digest"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            {isPlaying ? 'Pause' : 'Play Digest'}
          </button>

          {currentIndex + 1 < activeAlerts.length && (
            <button
              onClick={nextAlert}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Skip to next alert"
            >
              <FastForward className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
              title="Close audio digest"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

