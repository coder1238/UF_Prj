import React, { useState, useEffect } from 'react';
import {
  Compass,
  Eye,
  X,
  Camera,
  Layers,
  Crosshair,
  Maximize2,
  RefreshCw,
  Sun,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export default function DroneSurveillanceModal({ asset, onClose }) {
  const [viewMode, setViewMode] = useState('THERMAL'); // 'THERMAL', 'OPTICAL', 'EDGES'
  const [activeFlightLeg, setActiveFlightLeg] = useState('ORBIT_GATE_1'); // ORBIT_GATE_1, FLYOVER_RAMP, PERIMETER_SWEEP
  const [zoomLevel, setZoomLevel] = useState(2);
  const [altitude, setAltitude] = useState(120);
  const [batteryPercent, setBatteryPercent] = useState(88);

  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryPercent((prev) => Math.max(20, prev - 0.05));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-ink border border-purple/40 rounded-2xl shadow-elevated w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header HUD */}
        <div className="bg-ink/90 border-b border-white/10 p-3.5 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-status-alert animate-ping" />
            <span className="font-bold text-white tracking-widest uppercase">
              UAV RECON-04 TACTICAL AERIAL STREAM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple/30 text-purple border border-purple/40">
              TARGET: {asset.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-ink-secondary text-[11px]">
            <span>ALT: <strong className="text-white">{altitude}m AGL</strong></span>
            <span>BAT: <strong className="text-status-safe">{Math.round(batteryPercent)}%</strong></span>
            <span>GIMBAL: <strong className="text-white">-45° PITCH</strong></span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas (Simulated Drone HUD with Canvas Simulation) */}
        <div className="relative w-full h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
          {/* Synthetic Map/Aerial View Styling */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              viewMode === 'THERMAL'
                ? 'bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-900 opacity-95'
                : viewMode === 'EDGES'
                ? 'bg-slate-950 opacity-95'
                : 'bg-gradient-to-tr from-stone-900 via-neutral-800 to-slate-900'
            }`}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Simulated Water Ingress Polygons */}
            <div
              className={`absolute top-1/4 left-1/3 w-64 h-48 rounded-[40%] blur-sm transition-all duration-1000 ${
                viewMode === 'THERMAL'
                  ? 'bg-cyan-400/50 mix-blend-screen shadow-[0_0_50px_rgba(34,211,238,0.5)]'
                  : viewMode === 'EDGES'
                  ? 'border-2 border-dashed border-status-alert bg-status-alert/10'
                  : 'bg-sky-900/60'
              }`}
            />
            <div
              className={`absolute bottom-12 right-1/4 w-48 h-32 rounded-[50%] blur-sm transition-all duration-1000 ${
                viewMode === 'THERMAL'
                  ? 'bg-blue-500/40 mix-blend-screen'
                  : viewMode === 'EDGES'
                  ? 'border-2 border-dashed border-status-warning bg-status-warning/10'
                  : 'bg-sky-800/40'
              }`}
            />

            {/* Target Facility Footprint Wireframe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 border border-purple/60 bg-purple/10 rounded-xl flex items-center justify-center">
              <div className="text-center font-mono text-[11px] text-white/90">
                <div className="font-bold text-purple-light uppercase">{asset.name}</div>
                <div className="text-[10px] text-white/60">Plinth: {asset.plinthElevationMsl || 4.8}m MSL</div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded bg-status-alert/40 text-status-alert text-[10px] font-bold border border-status-alert/50">
                  INGRESS DEPTH: {asset.predictedDepth} cm
                </div>
              </div>
            </div>
          </div>

          {/* Crosshairs & Flight Reticle */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            <div className="flex justify-between items-start font-mono text-[10px] text-white/70">
              <div className="space-y-0.5 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                <div>LAT: {asset.coordinates[0].toFixed(5)}° N</div>
                <div>LON: {asset.coordinates[1].toFixed(5)}° E</div>
                <div>SURFACE RUNOFF: 1.4 m/s</div>
              </div>
              <div className="text-right space-y-0.5 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                <div>AI WATER DETECTION: 98.4% CONF</div>
                <div>INUNDATED AREA: ~4,200 m²</div>
                <div className="text-status-alert font-bold">CREST ETA: 35 MIN</div>
              </div>
            </div>

            {/* Center Reticle */}
            <div className="self-center flex items-center justify-center text-purple">
              <Crosshair className="w-16 h-16 opacity-60 animate-spin-slow" />
            </div>

            {/* Bottom Ingress Status */}
            <div className="flex justify-between items-end font-mono text-[10px]">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-white/80">
                MODE: <span className="font-bold text-purple">{viewMode}</span> • ZOOM: <span className="font-bold text-white">{zoomLevel}x</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-status-safe font-bold">
                ENCRYPTED RTMP STREAM STABLE (0.12s LATENCY)
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Control Bar */}
        <div className="bg-ink/95 border-t border-white/10 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sensor Mode Switch */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] text-white/60 uppercase">Sensor Lens:</span>
            {[
              { id: 'THERMAL', label: 'FLIR Thermal IR' },
              { id: 'EDGES', label: 'AI Ingress Contours' },
              { id: 'OPTICAL', label: 'True-Color 4K' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  viewMode === m.id
                    ? 'bg-purple text-white shadow-subtle'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Waypoints Switch */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] text-white/60 uppercase">Flight Path:</span>
            {[
              { id: 'ORBIT_GATE_1', label: 'Gate 1 Orbit' },
              { id: 'FLYOVER_RAMP', label: 'Ramp Flyover' },
              { id: 'PERIMETER_SWEEP', label: 'Perimeter Sweep' },
            ].map((leg) => (
              <button
                key={leg.id}
                onClick={() => setActiveFlightLeg(leg.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeFlightLeg === leg.id
                    ? 'bg-status-safe-soft text-status-safe border border-status-safe/40'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {leg.label}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1">
            {[1, 2, 4].map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  zoomLevel === z ? 'bg-white text-ink' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

