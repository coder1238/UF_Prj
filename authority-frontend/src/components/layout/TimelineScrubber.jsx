import React from 'react';
import { useFloodCommand } from '../../context/FloodCommandContext';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

export default function TimelineScrubber() {
  const { nowcastMinutes, setNowcastMinutes, isPlaying, setIsPlaying, playbackSpeed, setPlaybackSpeed } =
    useFloodCommand();

  const TIMESTAMPS = [
    { min: 0, label: 'NOW', time: '18:30' },
    { min: 15, label: '+15m', time: '18:45' },
    { min: 30, label: '+30m', time: '19:00' },
    { min: 60, label: '+60m (PEAK)', time: '19:30' },
    { min: 90, label: '+90m', time: '20:00' },
    { min: 120, label: '+120m', time: '20:30' },
    { min: 180, label: '+180m', time: '21:30' },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-lg bg-purple text-white flex items-center justify-center hover:bg-purple-deep transition-colors shadow-subtle"
            title={isPlaying ? 'Pause Nowcast' : 'Play 3h Nowcast Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setNowcastMinutes(0);
            }}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
            title="Reset to Live Current"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-surface-secondary rounded-lg p-0.5 border border-border text-[10px] font-mono font-semibold">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-1.5 py-0.5 rounded ${
                  playbackSpeed === speed ? 'bg-surface text-purple shadow-sm' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Current Forecast Marker */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-purple" />
          <span className="font-mono text-xs font-bold text-ink">
            {nowcastMinutes === 0 ? 'LIVE NOW (18:30 IST)' : `+${nowcastMinutes} MIN FORECAST`}
          </span>
          <span className="text-[10px] font-mono text-ink-secondary bg-surface-secondary px-2 py-0.5 rounded border border-border">
            CONFIDENCE: 92.4%
          </span>
        </div>
      </div>

      {/* Progress Track & Gradient */}
      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min="0"
          max="180"
          step="5"
          value={nowcastMinutes}
          onChange={(e) => {
            setIsPlaying(false);
            setNowcastMinutes(Number(e.target.value));
          }}
          className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-purple border border-border"
        />

        {/* Risk Envelope Gradient Indicator Bar */}
        <div className="h-1 w-full rounded-full mt-1.5 flex overflow-hidden opacity-80">
          <div className="w-[15%] bg-status-safe" title="0-15m: Surface Runoff Onset" />
          <div className="w-[20%] bg-status-warning" title="15-45m: Infiltration Saturation" />
          <div className="w-[30%] bg-status-alert" title="45-90m: Peak Surcharge & Inundation" />
          <div className="w-[35%] bg-purple" title="90-180m: Tidal Lockout & Recession" />
        </div>

        {/* Ticks */}
        <div className="flex justify-between items-center text-[10px] font-mono text-ink-secondary mt-1">
          {TIMESTAMPS.map((t) => (
            <button
              key={t.min}
              onClick={() => {
                setIsPlaying(false);
                setNowcastMinutes(t.min);
              }}
              className={`hover:text-purple transition-colors ${
                Math.abs(nowcastMinutes - t.min) <= 5 ? 'text-purple font-bold' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

