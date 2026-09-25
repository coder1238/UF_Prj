import React, { useState, useEffect } from 'react';
import { X, Video, Crosshair, AlertTriangle, Battery, Wifi, Shield, Eye } from 'lucide-react';
import { DRONE_RECON_FEEDS } from './mobilityConstants';

export default function DroneAerialReconModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [drones, setDrones] = useState(DRONE_RECON_FEEDS);
  const [selectedDrone, setSelectedDrone] = useState(DRONE_RECON_FEEDS[0]);
  const [scanTick, setScanTick] = useState(0);

  // Simulated AI scanning bounding box movement
  useEffect(() => {
    const timer = setInterval(() => {
      setScanTick((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Video className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                UAV Drone Aerial Reconnaissance &amp; CV Detection Hub
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-alert text-white animate-pulse">
                  LIVE RTSP FEED
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Autonomous drone surveillance detecting submerged vehicles, trapped pedestrians, and floating obstacles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Drone Selector Tabs */}
          <div className="flex gap-2 border-b border-border pb-2">
            {drones.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDrone(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  selectedDrone.id === d.id
                    ? 'bg-purple text-white shadow-subtle'
                    : 'bg-surface-secondary text-ink-secondary hover:text-ink'
                }`}
              >
                <span>{d.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white">
                  {d.altitudeM}m ALT
                </span>
              </button>
            ))}
          </div>

          {/* Simulated HUD Video Viewport */}
          <div className="relative w-full h-80 bg-neutral-950 rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-inner flex flex-col justify-between p-4 font-mono text-white">
            {/* Top HUD Overlay */}
            <div className="flex justify-between items-center text-[11px] z-10 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-status-alert font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-alert"></span> REC [00:42:18]
                </span>
                <span>UAV: {selectedDrone.name.split('(')[0]}</span>
                <span>LATENCY: {selectedDrone.videoLatencyMs}ms</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-status-safe" /> {selectedDrone.batteryPercent}%
                </span>
                <span className="flex items-center gap-1">
                  <Wifi className="w-4 h-4 text-purple" /> 5G RELAY
                </span>
                <span className="text-amber-400">FLIR TEMP: {selectedDrone.thermalThermalPeakC}°C</span>
              </div>
            </div>

            {/* Central Crosshair & AI Bounding Boxes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                <Crosshair className="w-8 h-8 text-white/40" />
              </div>

              {/* Simulated Bounding Box 1 */}
              <div
                className="absolute border-2 border-status-alert bg-status-alert/10 rounded p-1 transition-all duration-700"
                style={{
                  top: `${35 + (scanTick % 10)}%`,
                  left: `${25 + (scanTick % 15)}%`,
                  width: '130px',
                  height: '75px',
                }}
              >
                <span className="text-[9px] bg-status-alert text-white px-1 py-0.2 rounded font-bold uppercase block -mt-4">
                  Submerged Car (94%)
                </span>
                <span className="text-[8px] text-white/90 font-mono block mt-1">Water Depth: ~34cm</span>
              </div>

              {/* Simulated Bounding Box 2 */}
              <div
                className="absolute border-2 border-status-warning bg-status-warning/10 rounded p-1 transition-all duration-700"
                style={{
                  top: `${48 - (scanTick % 8)}%`,
                  right: `${20 + (scanTick % 12)}%`,
                  width: '110px',
                  height: '60px',
                }}
              >
                <span className="text-[9px] bg-status-warning text-black px-1 py-0.2 rounded font-bold uppercase block -mt-4">
                  Civilians (96%)
                </span>
                <span className="text-[8px] text-white/90 font-mono block mt-1">Trapped on Foot: 12</span>
              </div>
            </div>

            {/* Bottom HUD Overlay */}
            <div className="flex justify-between items-center text-[10px] z-10 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-neutral-400">
              <span>TARGET GEO: 19.0655°N, 72.8798°E (Kurla LBS Corridor)</span>
              <span className="text-white">AI MODEL: YOLOv11-Flood-Hazard-TensorRT</span>
              <span>GIMBAL: PITCH -32° | YAW 114°</span>
            </div>
          </div>

          {/* AI Detection Summary */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2">
            <span className="text-xs font-mono font-bold text-ink uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple" /> Real-Time Object Recognition Ledger
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedDrone.aiDetections.map((det, i) => (
                <div key={i} className="p-3 bg-surface rounded-lg border border-border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-ink block">{det.type}</span>
                    <span className="text-[10px] text-ink-secondary">Confidence: {det.conf}</span>
                  </div>
                  <span className="text-base font-mono font-bold text-purple">{det.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">
            Encrypted RTSP Video Stream linked with BMC Disaster Management Center Video Wall.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Video Feed
          </button>
        </div>
      </div>
    </div>
  );
}

