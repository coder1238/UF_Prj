import React, { useState } from 'react';
import { Camera, X, Maximize2, Radio, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';
import { CCTV_REPLAY_HOTSPOTS } from '../../data/replayData';

export default function CCTVSimulatorModal({ isOpen, onClose, currentStep, selectedEvent }) {
  const [activeCamId, setActiveCamId] = useState(null);

  if (!isOpen) return null;

  const currentCam = CCTV_REPLAY_HOTSPOTS.find(c => c.id === activeCamId) || CCTV_REPLAY_HOTSPOTS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Disaster Command CCTV Network Simulator</span>
                <span className="flex items-center gap-1 text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC HISTORICAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedEvent.name} &bull; Timestamp: {currentStep.time} IST
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveCamId(null)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                !activeCamId ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              4-Grid View
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feeds Container */}
        <div className="p-6 overflow-y-auto">
          {activeCamId ? (
            /* Single Camera Focus */
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Procedural CCTV Video Canvas Mock */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90" />
                
                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />

                {/* Road Waterline Visual Simulation */}
                <div 
                  className="absolute bottom-0 inset-x-0 bg-blue-900/40 border-t border-cyan-400/50 backdrop-blur-xs flex items-center justify-center"
                  style={{ height: `${Math.min(85, Math.max(10, currentStep.depth * 0.8))}%` }}
                >
                  <span className="text-cyan-300/80 font-mono text-xs font-bold tracking-widest uppercase">
                    Water Surface: ~{currentStep.depth} cm
                  </span>
                </div>

                {/* CCTV OSD Overlay */}
                <div className="absolute top-4 left-4 font-mono text-xs text-emerald-400 space-y-1 drop-shadow">
                  <div className="font-bold">{currentCam.name}</div>
                  <div className="text-[10px] text-slate-300">{currentCam.location}</div>
                  <div className="text-[10px] text-yellow-400">Angle: {currentCam.viewAngle}</div>
                </div>

                <div className="absolute top-4 right-4 text-right font-mono text-xs text-emerald-400 space-y-1 drop-shadow">
                  <div className="font-bold">{currentStep.time}:42 IST</div>
                  <div className="text-[10px] text-slate-300">BITRATE: 4.8 Mbps &bull; 25 FPS</div>
                  <div className="text-[10px] text-cyan-300">PUMP DISCHARGE: {currentStep.pumps}</div>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-xs text-slate-300 bg-black/60 px-3 py-1 rounded-lg border border-slate-800">
                  Telemetry Status: <span className="text-emerald-400 font-bold">{currentStep.cctvStatus}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveCamId(null)}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 font-bold"
              >
                &larr; Return to 4-Split Grid
              </button>
            </div>
          ) : (
            /* 4-Grid CCTV Array */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CCTV_REPLAY_HOTSPOTS.map((cam) => {
                const simulatedDepth = Math.round(currentStep.depth * (cam.id === 'cctv-milan' ? 1.4 : 1.0));

                return (
                  <div 
                    key={cam.id}
                    onClick={() => setActiveCamId(cam.id)}
                    className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer group"
                  >
                    {/* Dark gradient & scanlines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />

                    {/* Water Level Fill */}
                    <div 
                      className="absolute bottom-0 inset-x-0 bg-blue-900/35 border-t border-cyan-400/40"
                      style={{ height: `${Math.min(80, Math.max(10, simulatedDepth * 0.7))}%` }}
                    />

                    {/* Overlay info */}
                    <div className="absolute top-3 left-3 font-mono text-[10px] text-emerald-400">
                      <div className="font-bold text-white group-hover:text-purple-300 transition-colors">{cam.name}</div>
                      <div className="text-slate-400 text-[9px]">{cam.location}</div>
                    </div>

                    <div className="absolute top-3 right-3 font-mono text-[9px] text-right text-emerald-400">
                      <div>{currentStep.time} IST</div>
                      <div className="text-cyan-300">{simulatedDepth} cm</div>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> Expand
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

