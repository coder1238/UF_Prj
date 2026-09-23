import React, { useEffect } from 'react';
import { 
  Maximize2, Minimize2, Play, Pause, RotateCcw, 
  Volume2, VolumeX, ShieldAlert, Waves, X, Clock 
} from 'lucide-react';
import ReplayBasinMap from './ReplayBasinMap';

export default function TheaterModeHUD({
  isOpen,
  onClose,
  selectedEvent,
  currentStep,
  playbackIndex,
  isPlaying,
  onTogglePlay,
  onReset,
  onStepChange,
  playbackSpeed,
  onChangeSpeed,
  isMuted,
  onToggleMute,
  whatIfModifiers
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      }
      if (e.key === 'ArrowRight') {
        onStepChange(Math.min(selectedEvent.timelineSteps.length - 1, playbackIndex + 1));
      }
      if (e.key === 'ArrowLeft') {
        onStepChange(Math.max(0, playbackIndex - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, playbackIndex, isPlaying, selectedEvent, onClose, onTogglePlay, onStepChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/30 text-purple-400 rounded-xl border border-purple-500/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight">{selectedEvent.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold">
                THEATER SIMULATION
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Date: {selectedEvent.date} &bull; Total Precip: {selectedEvent.totalRainfall} &bull; Peak Tide: {selectedEvent.highTidePeak}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl border transition-colors ${
              !isMuted ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
          >
            <Minimize2 className="w-4 h-4" /> Exit Theater (Esc)
          </button>
        </div>
      </div>

      {/* Main Theater Center Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto items-center">
        {/* Left: Huge Key Metrics */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block">Rainfall Intensity</span>
            <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-1">
              {currentStep.rain} <span className="text-sm font-normal text-slate-400">mm/h</span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-1 block">Radar Echo Reflection</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block">Basin Water Depth</span>
            <div className={`text-4xl font-extrabold font-mono mt-1 ${currentStep.depth > 35 ? 'text-red-400' : 'text-slate-100'}`}>
              {currentStep.depth} <span className="text-sm font-normal text-slate-400">cm</span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-1 block">Hindmata & Kurla Depression</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block">Closed Arterial Routes</span>
            <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1">
              {currentStep.roadsClosed} <span className="text-sm font-normal text-slate-400">subways & roads</span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-1 block">Dewatering: {currentStep.pumps}</span>
          </div>
        </div>

        {/* Center: Vector Basin Map */}
        <div className="lg:col-span-2">
          <ReplayBasinMap 
            currentStep={currentStep} 
            whatIfModifiers={whatIfModifiers} 
          />
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <button
              onClick={onReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Speeds */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              {[0.5, 1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                    playbackSpeed === s ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Step:</span>
            <span className="text-base font-extrabold text-white">{playbackIndex + 1} / {selectedEvent.timelineSteps.length}</span>
            <span className="px-3 py-1 rounded-full bg-purple-900/80 text-purple-300 border border-purple-700 font-bold">
              Time: {currentStep.time} IST
            </span>
            <span className="text-slate-400 font-sans truncate max-w-xs">{currentStep.title}</span>
          </div>
        </div>

        {/* Steps Scrubber */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {selectedEvent.timelineSteps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => onStepChange(idx)}
              className={`p-2 rounded-xl text-left border transition-all ${
                playbackIndex === idx 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-mono block opacity-80">{st.time}</span>
              <span className="text-xs font-bold block truncate">{st.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

