import React, { useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, FastForward, Gauge, 
  ChevronsRight, CheckCircle2 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDSimulationControls({
  isPlaying = false,
  onTogglePlay = () => {},
  onReset = () => {},
  simSpeed = 1,
  onChangeSimSpeed = () => {},
  currentStep = 0,
  totalSteps = 5,
  tripProgress = 0, // 0 - 100%
  onChangeProgress = () => {},
  remainingMeters = 350,
  onStepAutoAdvanced = () => {}
}) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      {/* Header & Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {isPlaying ? 'Auto-Drive Simulation Active' : 'Simulation Paused / Standby'}
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="text-muted">Sim Rate:</span>
          {[1, 2, 4].map(rate => (
            <button
              key={rate}
              onClick={() => {
                hudAudio.playClick();
                onChangeSimSpeed(rate);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                simSpeed === rate 
                  ? 'bg-purple-primary text-white' 
                  : 'bg-white/10 text-muted hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress Scrubber Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-muted">Route Progression: {Math.round(tripProgress)}%</span>
          <span className="text-purple-soft font-semibold">{remainingMeters}m to Next Maneuver</span>
        </div>
        <div className="relative flex items-center">
          <input 
            type="range"
            min="0"
            max="100"
            value={tripProgress}
            onChange={(e) => onChangeProgress(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-primary"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              hudAudio.playClick();
              onTogglePlay();
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Sim' : 'Play Drive Sim'}</span>
          </button>

          <button
            onClick={() => {
              hudAudio.playClick();
              onReset();
            }}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Reset to Origin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-muted flex items-center gap-2">
          <span>Leg {currentStep + 1} / {totalSteps}</span>
          {tripProgress >= 99 && (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Destination Arrived
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

