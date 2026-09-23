import React, { useState } from 'react';
import { 
  Navigation, ZoomIn, ZoomOut, Compass, Layers, 
  MapPin, AlertTriangle, ShieldCheck, Crosshair 
} from 'lucide-react';

export default function HUDMiniRadar({ 
  currentStep = 0, 
  routeSteps = [], 
  routeCoordinates = [], 
  vehicleHeading = 18, 
  onSelectStep = () => {},
  hazards = [] 
}) {
  const [zoomLevel, setZoomLevel] = useState(1.2);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isCentered, setIsCentered] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Corridor waypoints projected into 2D SVG canvas (width 400, height 260)
  const waypoints = [
    { id: 0, x: 50, y: 220, label: 'Origin: Sion', depth: 4, elev: 8.5, type: 'start' },
    { id: 1, x: 130, y: 170, label: 'LBS Marg', depth: 18, elev: 4.2, type: 'caution' },
    { id: 2, x: 210, y: 135, label: 'Kurla Underpass', depth: 46, elev: 2.1, type: 'danger' },
    { id: 3, x: 290, y: 85, label: 'BKC Connector', depth: 2, elev: 14.8, type: 'elevated' },
    { id: 4, x: 360, y: 40, label: 'BKC G-Block Hub', depth: 3, elev: 11.2, type: 'destination' }
  ];

  // Current car position interpolated along the waypoints
  const activeWp = waypoints[Math.min(currentStep, waypoints.length - 1)] || waypoints[0];
  const nextWp = waypoints[Math.min(currentStep + 1, waypoints.length - 1)] || activeWp;

  return (
    <div className="relative bg-slate-950/80 border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col justify-between select-none">
      {/* Mini Radar Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono font-bold tracking-wider text-emerald-400 uppercase text-[11px]">
            Spatial Vector Radar
          </span>
          <span className="font-mono text-[10px] text-muted">
            19.0682°N, 72.8791°E
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`p-1.5 rounded-lg border text-[10px] font-mono transition-colors flex items-center gap-1 ${
              showHeatmap ? 'bg-purple-primary/30 border-purple-primary text-purple-200' : 'bg-white/5 border-white/10 text-muted'
            }`}
            title="Toggle Flood Heatmap"
          >
            <Layers className="w-3 h-3" />
            <span>Heatmap</span>
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsCentered(!isCentered)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isCentered ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 border-white/10 text-muted'
            }`}
            title="Center Lock on Vehicle"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-[180px] sm:h-[210px] my-2 bg-gradient-to-b from-slate-900 to-black rounded-xl overflow-hidden border border-white/5">
        
        {/* Radar concentric sweep circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-cyan-400 animate-pulse" />
          <div className="w-32 h-32 rounded-full border border-cyan-400 absolute" />
          <div className="w-16 h-16 rounded-full border border-cyan-400 absolute" />
          <div className="absolute w-full h-[1px] bg-cyan-400/30" />
          <div className="absolute h-full w-[1px] bg-cyan-400/30" />
        </div>

        <svg 
          viewBox="0 0 400 260" 
          className="w-full h-full cursor-crosshair transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Simulated Flood Hazard Zones (Heatmap puddles) */}
          {showHeatmap && (
            <g opacity="0.6">
              {/* Kurla low-lying basin puddle */}
              <ellipse cx="210" cy="135" rx="55" ry="35" fill="rgba(239, 68, 68, 0.35)" filter="blur(8px)" />
              <ellipse cx="210" cy="135" rx="30" ry="18" fill="rgba(239, 68, 68, 0.6)" filter="blur(4px)" />
              {/* LBS Marg ponding */}
              <ellipse cx="130" cy="170" rx="35" ry="20" fill="rgba(245, 158, 11, 0.3)" filter="blur(6px)" />
              {/* Safe elevated ridge corridor in green */}
              <ellipse cx="290" cy="85" rx="40" ry="15" fill="rgba(16, 185, 129, 0.2)" filter="blur(5px)" />
            </g>
          )}

          {/* Road Corridor Path (Segmented with risk colors) */}
          {/* Leg 0-1: Sion to LBS Marg (Caution - Amber) */}
          <line x1="50" y1="220" x2="130" y2="170" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          {/* Leg 1-2: LBS to Kurla Underpass (Critical - Red) */}
          <line x1="130" y1="170" x2="210" y2="135" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeDasharray="4 2" />
          {/* Leg 2-3: Elevated Flyover Ramp (Safe - Emerald) */}
          <line x1="210" y1="135" x2="290" y2="85" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
          {/* Leg 3-4: BKC Connector to Terminal (Safe - Emerald) */}
          <line x1="290" y1="85" x2="360" y2="40" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />

          {/* Underpass bypass alternative flyover dashed line */}
          <path 
            d="M 130 170 Q 180 90 290 85" 
            fill="none" 
            stroke="#a855f7" 
            strokeWidth="3" 
            strokeDasharray="5 3" 
            opacity="0.9" 
          />

          {/* Waypoint Nodes */}
          {waypoints.map((wp, idx) => {
            const isPassed = idx < currentStep;
            const isCurrent = idx === currentStep;
            const color = wp.type === 'danger' ? '#ef4444' : wp.type === 'caution' ? '#f59e0b' : wp.type === 'elevated' ? '#a855f7' : '#10b981';

            return (
              <g 
                key={wp.id} 
                onClick={() => {
                  setSelectedPoint(wp);
                  onSelectStep(idx);
                }}
                className="cursor-pointer group"
              >
                <circle 
                  cx={wp.x} 
                  cy={wp.y} 
                  r={isCurrent ? "9" : "6"} 
                  fill={isCurrent ? "#ffffff" : color} 
                  stroke={color} 
                  strokeWidth={isCurrent ? "4" : "2"}
                  className="transition-all"
                />
                {isCurrent && (
                  <circle cx={wp.x} cy={wp.y} r="16" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7">
                    <animate attributeName="r" values="8;20" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <text 
                  x={wp.x} 
                  y={wp.y - 12} 
                  fill="#ffffff" 
                  fontSize="9" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md"
                >
                  {wp.label} ({wp.depth}cm)
                </text>
              </g>
            );
          })}

          {/* Vehicle Marker with Heading Arrow */}
          <g 
            transform={`translate(${activeWp.x}, ${activeWp.y}) rotate(${vehicleHeading})`}
            className="transition-all duration-500 ease-out"
          >
            {/* Pulsing GPS ring */}
            <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="0,-12 7,8 0,4 -7,8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Hazard icons on map */}
          <g transform="translate(205, 120)" className="pointer-events-none">
            <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#ef4444" />
            <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">!</text>
          </g>
        </svg>

        {/* Selected Point Popover */}
        {selectedPoint && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-white/20 p-2 rounded-lg text-xs flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="font-bold text-white">{selectedPoint.label}</span>
              <span className="text-[10px] text-muted font-mono ml-2">Elev: +{selectedPoint.elev}m MSL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                selectedPoint.depth > 30 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedPoint.depth} cm flood
              </span>
              <button 
                onClick={() => setSelectedPoint(null)}
                className="text-muted hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mini Radar Bottom Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-1 rounded-sm bg-emerald-500" />
          <span>Elevated Bypass Clear</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-1 rounded-sm bg-red-500" />
          <span>Kurla Sag Flood</span>
        </div>
        <div className="text-purple-soft font-semibold">
          GPS Heading: {vehicleHeading}° NNE
        </div>
      </div>
    </div>
  );
}

