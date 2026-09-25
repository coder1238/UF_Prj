import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck, Volume2, Play, Pause, RotateCcw, Sliders } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export default function FloodClock({ 
  initialSeconds = 1721, // ~28m 41s
  thresholdTitle = "Time until hazardous water reaches low-lying roads", 
  expectedDepth = "31 cm",
  isUrgent = true 
}) {
  const { currentWard } = useFlood();
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [scenario, setScenario] = useState('cloudburst'); // 'cloudburst' (18m) | 'ponding' (28m) | 'tidal' (45m)
  const [customThreshold, setCustomThreshold] = useState('25'); // cm
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);

  // Set timer based on scenario
  const setScenarioPreset = (sc) => {
    setScenario(sc);
    if (sc === 'cloudburst') {
      setSecondsLeft(1080); // 18m
    } else if (sc === 'ponding') {
      setSecondsLeft(1721); // 28m
    } else if (sc === 'tidal') {
      setSecondsLeft(2700); // 45m
    }
    setIsRunning(true);
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Progress percent based on max 45 min window (2700s)
  const percent = Math.min(100, Math.max(0, (secondsLeft / 2700) * 100));
  const strokeDashoffset = 283 - (283 * percent) / 100;

  // Gentle acoustic alarm test
  const testAlarmTone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      setIsPlayingSiren(true);
      setTimeout(() => setIsPlayingSiren(false), 800);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-card relative overflow-hidden">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            FLOOD ARRIVAL CLOCK
          </span>
          <span className="text-[11px] font-mono text-ink-muted">
            Depth Trigger: <strong className="text-ink font-bold">{customThreshold} cm</strong>
          </span>
        </div>

        {/* Preset Scenarios */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-[10px] font-mono font-bold">
          <button
            onClick={() => setScenarioPreset('cloudburst')}
            className={`px-2 py-0.5 rounded-lg transition ${
              scenario === 'cloudburst' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-ink'
            }`}
          >
            Flash (18m)
          </button>
          <button
            onClick={() => setScenarioPreset('ponding')}
            className={`px-2 py-0.5 rounded-lg transition ${
              scenario === 'ponding' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-ink'
            }`}
          >
            Ponding (28m)
          </button>
          <button
            onClick={() => setScenarioPreset('tidal')}
            className={`px-2 py-0.5 rounded-lg transition ${
              scenario === 'tidal' ? 'bg-purple-primary text-white' : 'text-slate-600 hover:text-ink'
            }`}
          >
            Tide (45m)
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-3">
        {/* Radial Clock Circle */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-surface-secondary"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-1000 ${secondsLeft < 600 ? 'stroke-red-600' : isUrgent ? 'stroke-amber-500' : 'stroke-primary'}`}
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Clock className={`w-4 h-4 mb-0.5 ${secondsLeft < 600 ? 'text-red-600 animate-bounce' : isUrgent ? 'text-amber-600 animate-pulse' : 'text-primary'}`} />
            <span className="font-mono font-extrabold text-base tracking-tight text-ink">
              {formattedTime}
            </span>
            <span className="text-[9px] font-mono text-ink-muted uppercase">ETA COUNTDOWN</span>
          </div>
        </div>

        {/* Clock Details & Directive */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h4 className="text-sm font-bold text-ink leading-snug">
            {thresholdTitle}
          </h4>

          <p className="text-xs text-ink-secondary leading-relaxed">
            Hydro-nowcast predicts water accumulating to impassable levels along low-lying roads in {currentWard.name}. Plan departure before countdown expires.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] font-mono text-ink-muted">
            <span>Rain Rate: <strong className="text-ink">{currentWard.rainRate} mm/h</strong></span>
            <span>•</span>
            <span>Threshold: <strong className="text-emerald-700">{customThreshold} cm</strong></span>
          </div>

          {/* Clock Action Buttons */}
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center gap-1 transition"
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => setScenarioPreset(scenario)}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono transition"
              title="Reset Countdown"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={testAlarmTone}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                isPlayingSiren ? 'bg-amber-600 text-white' : 'bg-purple-soft text-purple-deep hover:bg-purple-primary hover:text-white'
              }`}
              title="Test Warning Chime"
            >
              <Volume2 className="w-3 h-3" />
              <span>{isPlayingSiren ? 'Chiming...' : 'Test Chime'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
