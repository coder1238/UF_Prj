import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Download,
  CheckCircle2,
  Sliders,
  Image,
} from 'lucide-react';

const FRAMES = [
  { id: 0, label: 'T-30m Historical', time: '18:00 IST', dbzPeak: 48, status: 'Cell Genesis' },
  { id: 1, label: 'T-15m Historical', time: '18:15 IST', dbzPeak: 54, status: 'Convective Intensification' },
  { id: 2, label: 'LIVE SWEEP', time: '18:30 IST', dbzPeak: 62, status: 'Torrential Core Over Kurla' },
  { id: 3, label: 'T+15m Forecast', time: '18:45 IST', dbzPeak: 64, status: 'Approaching Sion & Chunabhatti' },
  { id: 4, label: 'T+30m Forecast', time: '19:00 IST', dbzPeak: 66, status: 'Peak Surcharge Phase' },
  { id: 5, label: 'T+45m Forecast', time: '19:15 IST', dbzPeak: 63, status: 'Traversing Eastern Freeway' },
  { id: 6, label: 'T+60m PEAK', time: '19:30 IST', dbzPeak: 59, status: 'Inflow into Mithi River Outfall' },
  { id: 7, label: 'T+90m Forecast', time: '20:00 IST', dbzPeak: 50, status: 'Gradual Dissipation' },
  { id: 8, label: 'T+120m Forecast', time: '20:30 IST', dbzPeak: 42, status: 'Stratiform Tail' },
  { id: 9, label: 'T+180m Forecast', time: '21:30 IST', dbzPeak: 30, status: 'Recession Complete' },
];

export default function RadarLoopExportModal({ isOpen, onClose }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(2); // Start at live
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(3);
  const [loopMode, setLoopMode] = useState('continuous'); // continuous | bounce
  const [direction, setDirection] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (loopMode === 'continuous') {
            return (prev + 1) % FRAMES.length;
          } else {
            // bounce
            let next = prev + direction;
            if (next >= FRAMES.length) {
              setDirection(-1);
              return FRAMES.length - 2;
            }
            if (next < 0) {
              setDirection(1);
              return 1;
            }
            return next;
          }
        });
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fps, loopMode, direction]);

  if (!isOpen) return null;

  const currentFrame = FRAMES[currentFrameIndex];

  const handleExport = () => {
    setToast(`Radar Frame [${currentFrame.time} - ${currentFrame.label}] exported as GeoTIFF (WGS84 EPSG:4326)!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Doppler Radar Loop Player &amp; GeoTIFF Frame Exporter
              </h3>
              <p className="text-xs text-ink-secondary">
                Sequential convective cell stepping: -30m Historical to +180m Forecast
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
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Current Frame Banner */}
          <div className="bg-[#14111B] border border-border p-4 rounded-xl flex items-center justify-between text-white font-mono">
            <div>
              <span className="text-[10px] text-[#AFA9C2] uppercase font-bold">Active Radar Frame</span>
              <div className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{currentFrame.label}</span>
                <span className="text-xs px-2 py-0.5 bg-purple text-white rounded">
                  {currentFrame.time}
                </span>
              </div>
              <div className="text-xs text-status-warning mt-1">{currentFrame.status}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#AFA9C2] uppercase">Peak Reflectivity</div>
              <div className="text-2xl font-bold text-status-alert mt-0.5">
                {currentFrame.dbzPeak} dBZ
              </div>
              <div className="text-[10px] text-[#EDE8FF]">Frame {currentFrameIndex + 1} / {FRAMES.length}</div>
            </div>
          </div>

          {/* Timeline Frame Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-ink uppercase">
              <span>Scrub Frame Sequence</span>
              <span className="text-purple">{currentFrame.time}</span>
            </div>
            <input
              type="range"
              min="0"
              max={FRAMES.length - 1}
              value={currentFrameIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrameIndex(Number(e.target.value));
              }}
              className="w-full accent-purple h-2.5 bg-surface-secondary rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-ink-secondary">
              {FRAMES.map((f, i) => (
                <span
                  key={f.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex(i);
                  }}
                  className={`cursor-pointer ${currentFrameIndex === i ? 'text-purple font-bold' : 'hover:text-ink'}`}
                >
                  {f.time.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Playback Controls & FPS */}
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            {/* Player buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrameIndex((prev) => Math.max(0, prev - 1));
                }}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-purple-soft hover:text-purple text-ink transition-colors"
                title="Previous Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-purple text-white hover:bg-purple-deep transition-colors font-bold text-xs flex items-center gap-1.5 shadow-subtle"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{isPlaying ? 'PAUSE LOOP' : 'PLAY LOOP'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrameIndex((prev) => Math.min(FRAMES.length - 1, prev + 1));
                }}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-purple-soft hover:text-purple text-ink transition-colors"
                title="Next Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrameIndex(2); // reset to live
                }}
                className="p-2 rounded-lg bg-surface border border-border text-ink-secondary hover:text-ink transition-colors"
                title="Reset to Live"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Loop Mode & FPS */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
                <button
                  onClick={() => setLoopMode('continuous')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    loopMode === 'continuous' ? 'bg-purple-soft text-purple' : 'text-ink-secondary'
                  }`}
                >
                  Continuous
                </button>
                <button
                  onClick={() => setLoopMode('bounce')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    loopMode === 'bounce' ? 'bg-purple-soft text-purple' : 'text-ink-secondary'
                  }`}
                >
                  Rock / Bounce
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-ink-secondary">
                <span>Speed:</span>
                <span className="font-bold text-purple">{fps} FPS</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-16 accent-purple h-1.5 bg-surface rounded-lg cursor-pointer ml-1"
                />
              </div>
            </div>
          </div>

          {toast && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary text-ink flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            Export Frame GeoTIFF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Close Loop Player
          </button>
        </div>
      </div>
    </div>
  );
}

