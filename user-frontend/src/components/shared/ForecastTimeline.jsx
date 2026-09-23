import React, { useState, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { Play, Pause, RotateCcw, Clock, Droplets, CloudRain, FastForward, Activity } from 'lucide-react';

export default function ForecastTimeline() {
  const { timelineIndex, setTimelineIndex, timelineSlices, currentTimeline } = useFlood();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x | 2x | 4x

  useEffect(() => {
    let interval;
    if (isPlaying) {
      const ms = 3000 / playSpeed;
      interval = setInterval(() => {
        setTimelineIndex(prev => (prev + 1) % timelineSlices.length);
      }, ms);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, timelineSlices.length, setTimelineIndex]);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-border shadow-elevated">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
          <span className="text-xs font-bold font-mono tracking-tight text-ink uppercase">
            0–3 HOUR NOWCAST HORIZON
          </span>
          <span className="text-xs font-mono text-ink-muted">
            (Step {timelineIndex + 1} of {timelineSlices.length})
          </span>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-mono font-bold">
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setPlaySpeed(s)}
                className={`px-2 py-0.5 rounded-md transition ${
                  playSpeed === s ? 'bg-white text-purple-primary shadow-xs' : 'text-slate-600 hover:text-ink'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Sim'}</span>
          </button>

          <button
            onClick={() => {
              setTimelineIndex(0);
              setIsPlaying(false);
            }}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition"
            title="Reset to NOW"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="text-xs font-mono font-bold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
            {currentTimeline.time} IST ({currentTimeline.label})
          </div>
        </div>
      </div>

      {/* Scrubbing Slider Track */}
      <div className="pt-3 pb-1 px-1">
        <input 
          type="range"
          min="0"
          max={timelineSlices.length - 1}
          value={timelineIndex}
          onChange={(e) => {
            setTimelineIndex(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full accent-purple-primary cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
          <span>NOW (0h)</span>
          <span>+30m</span>
          <span>+60m</span>
          <span>+90m (Peak Surge)</span>
          <span>+120m</span>
          <span>+180m (Recession)</span>
        </div>
      </div>

      {/* Horizontal Step Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
        {timelineSlices.map((slice, idx) => {
          const isSelected = timelineIndex === idx;
          const isHigh = slice.risk === 'HIGH' || slice.risk === 'CRITICAL';
          const isCaution = slice.risk === 'CAUTION';

          return (
            <button
              key={slice.id}
              onClick={() => {
                setTimelineIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition relative overflow-hidden ${
                isSelected 
                  ? 'bg-primary-soft/80 border-primary shadow-sm ring-2 ring-primary/20' 
                  : 'bg-canvas hover:bg-white border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-primary' : 'text-ink'}`}>
                  {slice.label}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isHigh ? 'bg-red-100 text-red-800' : isCaution ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {slice.risk}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-ink-secondary">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-primary" />
                  {slice.rainRate} mm/h
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-ink-muted" />
                  {slice.depth} cm
                </span>
              </div>

              <div className="text-[10px] text-ink-muted truncate mt-1">
                {slice.desc}
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
