import React, { useState } from 'react';
import { X, Camera, RefreshCw, Eye, ShieldAlert, CheckCircle2, Maximize2, Radio } from 'lucide-react';

export default function AlertCctvModal({ alert, onClose }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshotTime, setSnapshotTime] = useState('LIVE • 00:08s ago');
  const [showRulerGrid, setShowRulerGrid] = useState(true);

  if (!alert) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSnapshotTime('LIVE • 00:01s ago');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <Camera className="w-5 h-5" /> Municipal Traffic CCTV & Water Line Vision
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Details Top Row */}
        <div className="flex items-center justify-between my-3 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> {snapshotTime}
            </span>
            <span className="text-slate-600">Camera ID: {alert.cctvCameraId || 'CCTV-MUM-01'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRulerGrid(!showRulerGrid)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors ${
                showRulerGrid ? 'bg-purple-50 border-purple-300 text-purple-primary' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {showRulerGrid ? 'Hide Depth Grid' : 'Show Depth Grid'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh camera snapshot"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Simulated Camera Monitor Screen */}
        <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
          {/* Simulated Street View Camera Canvas */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 opacity-90" />

          {/* Road Perspective Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <line x1="10%" y1="100%" x2="48%" y2="40%" stroke="#475569" strokeWidth="2" />
            <line x1="90%" y1="100%" x2="52%" y2="40%" stroke="#475569" strokeWidth="2" />
            {/* Subway arch silhouette */}
            <path d="M 160 220 Q 300 80 440 220" fill="none" stroke="#334155" strokeWidth="6" />
          </svg>

          {/* Water Surface Simulation Layer */}
          <div 
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cyan-900/80 via-blue-900/60 to-transparent transition-all duration-700 pointer-events-none"
            style={{ height: `${Math.min(alert.waterDepth * 2, 75)}%` }}
          >
            {/* Animated water ripples */}
            <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400/60 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          </div>

          {/* Calibrated Depth Grid Overlay */}
          {showRulerGrid && (
            <div className="absolute right-4 bottom-0 top-12 w-28 border-l border-amber-400/40 pointer-events-none z-10 flex flex-col justify-between py-2 text-right pr-2">
              <div className="text-[10px] font-mono text-red-400 font-black border-b border-red-400/50 pb-0.5">
                50 cm [DANGER]
              </div>
              <div className="text-[10px] font-mono text-amber-400 font-bold border-b border-amber-400/50 pb-0.5">
                35 cm [CRITICAL]
              </div>
              <div className="text-[10px] font-mono text-yellow-300 font-semibold border-b border-yellow-300/50 pb-0.5">
                20 cm [CAUTION]
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-medium border-b border-emerald-400/50 pb-0.5">
                05 cm [DRY/CURB]
              </div>
            </div>
          )}

          {/* AI Vision Detection Bounding Box */}
          <div className="absolute top-1/3 left-1/4 p-2 border-2 border-red-500 rounded-lg bg-red-950/40 backdrop-blur-[1px] pointer-events-none z-10">
            <span className="text-[9px] font-mono font-bold text-red-300 uppercase block">
              AI Detection: Submerged Subway Ingress
            </span>
            <span className="text-[10px] font-mono text-white font-extrabold">
              Depth: {alert.waterDepth} cm (Confidence: 96.4%)
            </span>
          </div>

          {/* Camera HUD Overlays */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm z-10">
            BMC TRAFFIC CONTROL • {alert.ward} • FPS: 29.97
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded z-10">
            REC ● 1080p H.265
          </div>
        </div>

        {/* Footer Advice */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>Vehicular underpass barrier closed automatically by sensor trigger.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
}

