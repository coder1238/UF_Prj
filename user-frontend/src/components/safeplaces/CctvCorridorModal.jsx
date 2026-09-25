import React, { useState, useEffect } from 'react';
import { 
  X, Camera, Video, ShieldCheck, Eye, RefreshCw, 
  Layers, CheckCircle2, AlertTriangle, Radio, Maximize2 
} from 'lucide-react';

export default function CctvCorridorModal({ place, onClose }) {
  const feeds = place.cctvFeeds || [
    { id: 'cam-main-1', name: 'Main Gate Ingress Corridor', waterDepthCm: 0, status: 'CLEAR' },
    { id: 'cam-main-2', name: 'Elevated Flyover Ramp Approach', waterDepthCm: 2, status: 'CLEAR' }
  ];

  const [activeCam, setActiveCam] = useState(feeds[0]);
  const [timeString, setTimeString] = useState(new Date().toLocaleTimeString());
  const [isAiOverlayActive, setIsAiOverlayActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-base font-bold text-white">Live CCTV Ingress Verification</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">{place.name} • Ward {place.ward}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
          {feeds.map(cam => (
            <button
              key={cam.id}
              onClick={() => setActiveCam(cam)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                activeCam.id === cam.id 
                  ? 'bg-purple-primary text-white border-purple-400 shadow-sm' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{cam.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                cam.waterDepthCm === 0 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
              }`}>
                {cam.waterDepthCm}cm
              </span>
            </button>
          ))}
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video rounded-2xl bg-black border border-slate-700/80 overflow-hidden shadow-inner flex flex-col justify-between p-4">
          
          {/* Simulated CCTV Background Scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center opacity-85">
            {/* Visual Grid Lines & Horizon */}
            <div className="w-full h-full relative overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
              
              {/* Roadway & Vehicle Silhouette */}
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-900 to-slate-800/80 border-t border-slate-600/40" />
              <div className="absolute bottom-8 left-1/4 w-36 h-20 border-2 border-emerald-400/70 rounded-lg bg-emerald-500/10 flex flex-col justify-between p-1.5">
                <span className="text-[9px] font-mono text-emerald-300 font-bold">CAR [98% CONF]</span>
                <span className="text-[9px] font-mono text-emerald-400">CLEARANCE: +18cm SAFE</span>
              </div>
              <div className="absolute bottom-6 right-1/4 w-28 h-28 border-2 border-cyan-400/70 rounded-lg bg-cyan-500/10 flex flex-col justify-between p-1.5">
                <span className="text-[9px] font-mono text-cyan-300 font-bold">DRY INGRESS LANE</span>
                <span className="text-[9px] font-mono text-cyan-400">DEPTH: {activeCam.waterDepthCm}cm</span>
              </div>
            </div>
          </div>

          {/* OSD Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-bold">{activeCam.id.toUpperCase()}</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-400">FPS: 29.8</span>
            </div>
            <div className="bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-white font-bold">
              {timeString} IST
            </div>
          </div>

          {/* OSD Bottom Watermark & AI Overlay */}
          <div className="relative z-10 flex items-end justify-between text-xs font-mono">
            <div className="space-y-1 bg-black/70 p-2 rounded-xl backdrop-blur-sm border border-white/10 max-w-xs">
              <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                YOLOv8-FloodNet Ingress Model
              </div>
              <div className="text-white text-[11px]">
                Water Depth: <strong className={activeCam.waterDepthCm > 10 ? 'text-amber-400' : 'text-emerald-400'}>{activeCam.waterDepthCm} cm</strong>
              </div>
              <div className="text-[10px] text-slate-300">
                Pavement: <span className="text-emerald-400 font-bold">100% PASSABLE / NO DEBRIS</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
              <button 
                onClick={() => setIsAiOverlayActive(!isAiOverlayActive)}
                className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
                  isAiOverlayActive ? 'bg-purple-primary text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px]">AI Annotations</span>
              </button>
            </div>
          </div>

        </div>

        {/* Corridor Note Footer */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Optical sensor telemetry verifies approach corridor is safe for low sedans and pedestrians.</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">Updated 1s ago</span>
        </div>

      </div>
    </div>
  );
}

