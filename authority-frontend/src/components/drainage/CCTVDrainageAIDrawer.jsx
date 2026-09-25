import React, { useState } from 'react';
import { X, Video, AlertTriangle, Truck, Play, Pause, Sparkles } from 'lucide-react';

export default function CCTVDrainageAIDrawer({ isOpen, onClose, selectedNode, onDispatchDesilter, showToast }) {
  const [crawlerDistanceM, setCrawlerDistanceM] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCameraId] = useState('CAM-DR-04');
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(true);

  if (!isOpen || !selectedNode) return null;

  // Simulated AI Detections
  const siltDepthPct = selectedNode.siltPercentage || 42;
  const isSevereChoke = siltDepthPct > 40;

  const handleDispatch = () => {
    if (onDispatchDesilter) {
      onDispatchDesilter(selectedNode.id);
    }
    showToast(`BMC Jetting & Super-Sucker dispatched to ${selectedNode.name} (Chainage: +${crawlerDistanceM}m)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface border-l border-border w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Underground CCTV Robotic Crawler AI Feed
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  YOLOv10-DRAIN AI
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • Pipe Chainage: +{crawlerDistanceM}m
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Simulated CCTV Video Feed with AI Overlays */}
          <div className="relative bg-black rounded-xl overflow-hidden border border-border aspect-video flex items-center justify-center">
            {/* Background Conduit Simulation SVG */}
            <svg viewBox="0 0 400 225" className="w-full h-full">
              {/* Conduit Vanishing Perspective */}
              <rect x="0" y="0" width="400" height="225" fill="#121214" />
              <polygon points="0,0 150,75 150,150 0,225" fill="#1C1C22" stroke="#27272A" />
              <polygon points="400,0 250,75 250,150 400,225" fill="#1C1C22" stroke="#27272A" />
              <polygon points="0,0 400,0 250,75 150,75" fill="#18181B" stroke="#27272A" />
              
              {/* Bottom Invert & Silt Bed */}
              <polygon points="0,170 150,135 250,135 400,170 400,225 0,225" fill="#3B2A1A" opacity="0.85" />
              <polygon points="0,185 150,142 250,142 400,185 400,225 0,225" fill="#2E2014" />
              
              {/* Water Layer */}
              <polygon points="0,150 150,125 250,125 400,150 400,170 0,170" fill="#1E3A8A" opacity="0.6" />

              {/* Distant Tunnel Center */}
              <rect x="150" y="75" width="100" height="75" fill="#09090B" stroke="#3F3F46" />
            </svg>

            {/* AI Bounding Boxes (if enabled) */}
            {aiOverlayEnabled && (
              <div className="absolute inset-0 p-4 pointer-events-none">
                {/* Silt Bounding Box */}
                <div className="absolute bottom-6 left-12 right-12 border-2 border-amber-500 rounded bg-amber-500/10 p-1 flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">
                    Silt Deposition: {siltDepthPct}% Choke (Conf: 94.2%)
                  </span>
                  <span className="text-[9px] font-mono text-amber-300 bg-black/60 px-1 rounded">
                    Area: 1.45 m²
                  </span>
                </div>

                {/* Floating Debris Bounding Box */}
                <div className="absolute top-20 right-16 border-2 border-red-500 rounded bg-red-500/10 p-1">
                  <span className="text-[9px] font-mono font-bold bg-red-500 text-white px-1 py-0.5 rounded">
                    Plastic Waste Obstruction (88.4%)
                  </span>
                </div>
              </div>
            )}

            {/* OSD Telemetry Banner */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono text-emerald-400 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE REC • {activeCameraId}
              </span>
              <span>CHAINAGE: +{crawlerDistanceM}m</span>
              <span>BATTERY: 84%</span>
            </div>
          </div>

          {/* Crawler Controls */}
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-ink font-semibold">Tethered Crawler Position:</span>
              <span className="text-purple font-bold">+{crawlerDistanceM} meters from Manhole Rim</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={crawlerDistanceM}
              onChange={(e) => setCrawlerDistanceM(parseInt(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  aiOverlayEnabled
                    ? 'bg-purple-soft text-purple border-purple'
                    : 'bg-surface text-ink-secondary border-border'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Computer Vision Overlay: {aiOverlayEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink hover:bg-surface-secondary flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>
            </div>
          </div>

          {/* AI Inspection Findings */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${isSevereChoke ? 'text-status-alert' : 'text-status-warning'}`} />
              Automated Conduit Defect Assessment
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-surface p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary block">Cross-Section Silt Choke</span>
                <span className={`text-base font-bold ${isSevereChoke ? 'text-status-alert' : 'text-amber-500'}`}>
                  {siltDepthPct}% Reduction
                </span>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary block">Sediment Volume</span>
                <span className="text-base font-bold text-ink">~18.5 m³ silt</span>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary block">Structural Integrity</span>
                <span className="text-base font-bold text-status-safe">Good (No Spalling)</span>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary block">Manning Roughness Impact</span>
                <span className="text-base font-bold text-purple">+45% (n = 0.021)</span>
              </div>
            </div>

            <button
              onClick={handleDispatch}
              className="w-full py-2.5 px-4 bg-purple text-white hover:bg-purple-deep rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-subtle transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch Super-Sucker &amp; High-Pressure Jetting Unit</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close CCTV View
          </button>
        </div>
      </div>
    </div>
  );
}

