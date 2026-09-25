import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  TrendingUp,
  Sliders,
  Calendar,
} from 'lucide-react';

export default function CCTVHistoricalScrubber({
  currentDepth = 28,
  onTimeChange,
}) {
  const [hoursAgo, setHoursAgo] = useState(0); // 0 (now) to 24 (24h ago)
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Generate synthetic 24-hour flood surge curve
  const timelineData = Array.from({ length: 25 }, (_, i) => {
    const h = 24 - i;
    // Bell-shaped high-tide surge curve peaking around 6h ago
    const surge = Math.max(
      4,
      Math.round(currentDepth * Math.exp(-Math.pow(h - 6, 2) / 36) + (24 - h) * 0.4)
    );
    return { hoursAgo: h, depth: surge };
  });

  // Playback timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setHoursAgo((prev) => {
          if (prev <= 0) {
            setIsPlaying(false);
            return 24;
          }
          return Math.max(0, prev - 1);
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  useEffect(() => {
    const pt = timelineData.find((d) => d.hoursAgo === hoursAgo) || { depth: currentDepth };
    if (onTimeChange) {
      onTimeChange(hoursAgo, pt.depth);
    }
  }, [hoursAgo]);

  const activePoint = timelineData.find((d) => d.hoursAgo === hoursAgo) || { depth: currentDepth };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple" />
          <h3 className="text-sm font-bold text-ink">
            24-Hour Waterline Scrubber & Historical Playback
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink border border-border">
            {hoursAgo === 0 ? 'LIVE (NOW)' : `T - ${hoursAgo}h 00m`}
          </span>
          <span className="font-mono text-xs font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Depth: {activePoint.depth} cm
          </span>
        </div>
      </div>

      {/* Mini Hydrograph Timeline Graph */}
      <div className="h-16 flex items-end gap-1 px-1 bg-surface-secondary rounded-lg border border-border pt-2">
        {timelineData.map((d) => {
          const isCurrent = d.hoursAgo === hoursAgo;
          const heightPercent = Math.min(100, Math.max(10, (d.depth / 45) * 100));
          return (
            <div
              key={d.hoursAgo}
              onClick={() => setHoursAgo(d.hoursAgo)}
              className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
              title={`T - ${d.hoursAgo}h: ${d.depth}cm`}
            >
              <div
                className={`w-full rounded-t transition-all ${
                  isCurrent
                    ? 'bg-status-alert ring-1 ring-white'
                    : 'bg-purple/40 group-hover:bg-purple'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Scrubber Range Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={24 - hoursAgo}
          onChange={(e) => setHoursAgo(24 - parseInt(e.target.value))}
          className="w-full accent-purple h-2 bg-border rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-ink-muted">
          <span>-24 Hours (Yesterday)</span>
          <span>-12h (Mid-Storm)</span>
          <span>-6h (Surge Peak)</span>
          <span className="font-bold text-status-safe">0h (Real-Time Live)</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-all flex items-center gap-1 shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Replay' : 'Play Timeline'}
          </button>
          <button
            onClick={() => setHoursAgo(0)}
            className="px-2.5 py-1.5 bg-surface-secondary border border-border text-ink rounded-lg text-xs hover:bg-white transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Jump to Live
          </button>
        </div>

        <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded font-mono ${
                speed === s ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

