import React, { useState, useEffect } from 'react';
import { 
  X, Camera, Video, Eye, ShieldAlert, Radio, 
  RotateCw, Gauge, Zap, Disc, AlertTriangle 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDCCTVModal({
  isOpen = false,
  onClose = () => {}
}) {
  const [activeCam, setActiveCam] = useState('kurla');
  const [nightVision, setNightVision] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState('');
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toISOString().replace('T', ' ').substring(0, 19) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const cameras = [
    {
      id: 'kurla',
      label: 'Kurla Underpass (CAM-L09)',
      location: 'LBS Marg / Mithi Basin Ingress',
      depth: 46,
      trend: '+4 cm/15m',
      pumpsActive: 3,
      pumpsTotal: 4,
      flowRate: '12,400 LPM',
      status: 'CRITICAL INUNDATION',
      statusColor: 'bg-red-500/20 text-red-400 border-red-500/40'
    },
    {
      id: 'milan',
      label: 'Milan Subway (CAM-K114)',
      location: 'Santacruz SV Road Underpass',
      depth: 35,
      trend: '+1 cm/15m',
      pumpsActive: 4,
      pumpsTotal: 4,
      flowRate: '16,800 LPM',
      status: 'BARRIER DEPLOYED',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      id: 'bkc',
      label: 'BKC Connector High Flyover (CAM-BKC-01)',
      location: 'Elevated Corridor Deck Deck-P4',
      depth: 0,
      trend: '0 cm (DRY)',
      pumpsActive: 2,
      pumpsTotal: 2,
      flowRate: 'Gravity Outfall',
      status: 'CLEAR HIGH-GROUND',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    }
  ];

  const currentCam = cameras.find(c => c.id === activeCam) || cameras[0];

  const handleCaptureSnapshot = () => {
    hudAudio.playClick();
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Municipal Live CCTV & Sensor Telemetry
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> LIVE RTSP FEED
                </span>
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">{currentCam.location}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Selector Tabs */}
        <div className="flex items-center gap-2 my-4 overflow-x-auto pb-1">
          {cameras.map(cam => (
            <button
              key={cam.id}
              onClick={() => {
                hudAudio.playClick();
                setActiveCam(cam.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                activeCam === cam.id
                  ? 'bg-purple-primary text-white border-purple-primary shadow-md'
                  : 'bg-white/5 border-white/10 text-muted hover:text-white'
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>

        {/* CCTV Video Monitor Canvas Box */}
        <div className={`relative w-full h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border border-white/20 bg-black flex flex-col justify-between p-4 ${
          nightVision ? 'contrast-125 saturate-50 hue-rotate-90' : ''
        }`}>
          
          {/* Simulated scanlines and video overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent animate-pulse" />

          {/* Top Video OSD (On-Screen Display) */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-emerald-400 drop-shadow-md">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider uppercase">{currentCam.id.toUpperCase()}-FEED://HD-RTSP</span>
              <span>• 25.0 FPS</span>
              <span>• 1080p H.265</span>
            </div>
            <div>{liveTimestamp}</div>
          </div>

          {/* Center Optical Flood Water Ruler Bar */}
          <div className="relative z-10 my-auto flex items-center justify-between px-6">
            <div className="bg-black/70 border border-white/20 p-3 rounded-2xl backdrop-blur-md max-w-xs space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono uppercase text-muted">Optical AI Depth Ruler</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${currentCam.statusColor}`}>
                  {currentCam.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-extrabold text-white">{currentCam.depth}</span>
                <span className="text-sm font-mono text-muted">cm water depth</span>
              </div>
              <div className="text-[10px] font-mono text-amber-300">
                Rate of Surge: {currentCam.trend}
              </div>
            </div>

            {/* Visual Graphic Water Ruler Simulation */}
            <div className="h-44 w-10 bg-black/80 border border-white/20 rounded-xl relative p-1 flex flex-col justify-between font-mono text-[9px] text-muted">
              <span>60</span>
              <span>45</span>
              <span>30</span>
              <span>15</span>
              <span>00</span>
              {/* Water Level Rise Fill */}
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-red-600/80 to-amber-500/60 transition-all duration-700 border-t-2 border-red-400"
                style={{ height: `${Math.min(100, (currentCam.depth / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Bottom Video Telemetry & Camera Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 font-mono text-xs text-white">
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span>Submersible Pumps: <strong className="text-emerald-400">{currentCam.pumpsActive}/{currentCam.pumpsTotal} Online</strong></span>
              <span>Discharge Rate: <strong className="text-cyan-300">{currentCam.flowRate}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNightVision(!nightVision)}
                className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-colors ${
                  nightVision ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/20 text-muted hover:text-white'
                }`}
              >
                IR Night Vision: {nightVision ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={handleCaptureSnapshot}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{snapshotTaken ? 'Saved!' : 'Snapshot'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Advisory footer */}
        <div className="pt-3 flex items-center justify-between text-xs font-mono text-muted">
          <span>Camera stream is monitored 24/7 by MCGM Municipal Monsoon Disaster Cell.</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            Close Feed
          </button>
        </div>

      </div>
    </div>
  );
}

