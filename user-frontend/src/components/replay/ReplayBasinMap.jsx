import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, MapPin, Waves, Navigation, ZoomIn, ZoomOut, 
  RotateCcw, ShieldCheck, AlertTriangle, Eye, Activity
} from 'lucide-react';

const REPLAY_HOTSPOTS = [
  { id: 'hindmata', name: 'Hindmata Sump (Dadar)', x: 48, y: 56, basin: 'G/North', normalDepth: 8, baseDrainCapacity: 45 },
  { id: 'gandhi-mkt', name: 'Gandhi Market (Matunga)', x: 53, y: 49, basin: 'F/North', normalDepth: 12, baseDrainCapacity: 40 },
  { id: 'sion', name: 'Sion Circle Lowland', x: 58, y: 44, basin: 'F/North', normalDepth: 15, baseDrainCapacity: 35 },
  { id: 'kurla-mithi', name: 'Kurla Kranti Nagar (Mithi)', x: 64, y: 38, basin: 'L Ward', normalDepth: 20, baseDrainCapacity: 30 },
  { id: 'milan-subway', name: 'Milan Subway (Santacruz)', x: 42, y: 33, basin: 'H/West', normalDepth: 25, baseDrainCapacity: 28 },
  { id: 'andheri-subway', name: 'Andheri Subway Dip', x: 44, y: 24, basin: 'K/East', normalDepth: 30, baseDrainCapacity: 25 },
  { id: 'bkc-junction', name: 'BKC Dharavi Outfall', x: 52, y: 41, basin: 'H/East', normalDepth: 10, baseDrainCapacity: 50 },
  { id: 'worli-naka', name: 'Worli Point Outfall', x: 38, y: 64, basin: 'G/South', normalDepth: 5, baseDrainCapacity: 75 }
];

export default function ReplayBasinMap({ currentStep, whatIfModifiers, onSelectHotspot }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFlowVectors, setShowFlowVectors] = useState(true);
  const [showPumps, setShowPumps] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);
  const canvasRef = useRef(null);

  // Calculate adjusted depth with counterfactual modifiers
  const depthFactor = whatIfModifiers.depthFactor || 1;
  const currentDepth = Math.max(2, Math.round(currentStep.depth * depthFactor));

  // Canvas animated hydrodynamic vectors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (showFlowVectors) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;
        // Draw directional vectors toward Mahim Creek / Arabian Sea
        const vectors = [
          { sx: 180, sy: 140, ex: 140, ey: 180 }, // Kurla to Mahim
          { sx: 160, sy: 200, ex: 120, ey: 220 }, // Dadar to Worli
          { sx: 150, sy: 100, ex: 110, ey: 120 }, // Santacruz to Bay
          { sx: 200, sy: 170, ex: 150, ey: 190 }, // Sion to Dharavi
          { sx: 140, sy: 260, ex: 100, ey: 270 }  // Parel to Sea
        ];

        vectors.forEach((v, idx) => {
          ctx.beginPath();
          ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = -offset * (1 + idx * 0.2);
          ctx.moveTo(v.sx, v.sy);
          ctx.lineTo(v.ex, v.ey);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(v.ey - v.sy, v.ex - v.sx);
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.beginPath();
          ctx.arc(v.ex, v.ey, 3, 0, 2 * Math.PI);
          ctx.fill();
        });

        offset = (offset + (currentStep.flowVelocity || 0.8) * 0.8) % 30;
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [showFlowVectors, currentStep]);

  const handleHotspotClick = (spot) => {
    setSelectedPin(spot);
    if (onSelectHotspot) onSelectHotspot(spot);
  };

  return (
    <div className="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/70 text-white shadow-lg text-xs">
        <div className="flex items-center gap-1.5 font-bold font-mono text-purple-300 mr-2">
          <Waves className="w-4 h-4 text-purple-400" />
          <span>BASIN HYDRO-RADAR</span>
        </div>

        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
            showHeatmap ? 'bg-purple-600/80 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Inundation Heatmap"
        >
          Heatmap
        </button>

        <button 
          onClick={() => setShowFlowVectors(!showFlowVectors)}
          className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
            showFlowVectors ? 'bg-cyan-600/80 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Hydrodynamic Runoff Vectors"
        >
          Vectors
        </button>

        <button 
          onClick={() => setShowPumps(!showPumps)}
          className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
            showPumps ? 'bg-emerald-600/80 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Pumping Stations"
        >
          Pumps
        </button>
      </div>

      {/* Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 text-white shadow-lg">
        <button 
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={() => { setZoomLevel(1); setSelectedPin(null); }}
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
          title="Reset Canvas View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Vector / SVG Map Container */}
      <div 
        className="w-full h-80 sm:h-96 relative overflow-hidden transition-transform duration-300 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Background Stylized Mumbai Island GIS Silhouette */}
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full absolute inset-0 opacity-80 select-none pointer-events-none"
        >
          <defs>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#030712" />
              <stop offset="100%" stopColor="#0b132b" />
            </linearGradient>
            <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.45)" />
              <stop offset="50%" stopColor="rgba(249, 115, 22, 0.25)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>

          {/* Arabian Sea Base */}
          <rect width="400" height="400" fill="url(#seaGrad)" />

          {/* Stylized Mumbai Landmass Polygon */}
          <path 
            d="M 120 40 Q 150 20 180 30 T 230 50 Q 250 100 240 160 T 210 240 Q 190 320 160 380 Q 130 390 120 360 Q 140 300 130 250 T 110 180 Q 90 120 120 40 Z" 
            fill="#111827" 
            stroke="#1e293b" 
            strokeWidth="2"
          />

          {/* Mahim Creek & Mithi River Channel */}
          <path 
            d="M 230 110 Q 190 140 170 160 T 130 180 L 110 190" 
            fill="none" 
            stroke="#0ea5e9" 
            strokeWidth="3.5" 
            opacity="0.7"
          />

          {/* Thane Creek Shoreline */}
          <path 
            d="M 230 40 Q 270 100 280 180 T 250 300" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="2" 
            strokeDasharray="4 4"
          />

          {/* Inundation Heatmap Concentric Overlays */}
          {showHeatmap && currentDepth > 15 && (
            <>
              {/* Central Sump Oval (Hindmata / Matunga / Sion) */}
              <ellipse 
                cx="195" 
                cy="210" 
                rx={Math.min(75, currentDepth * 0.9)} 
                ry={Math.min(55, currentDepth * 0.65)} 
                fill="url(#floodGlow)" 
                className="animate-pulse"
              />
              {/* Kurla Mithi Ingress */}
              <circle 
                cx="225" 
                cy="150" 
                r={Math.min(45, currentDepth * 0.55)} 
                fill="url(#floodGlow)" 
              />
              {/* Milan / Andheri Subways */}
              <circle 
                cx="165" 
                cy="110" 
                r={Math.min(35, currentDepth * 0.45)} 
                fill="url(#floodGlow)" 
              />
            </>
          )}

          {/* Outfall High Tide Lockout Gates */}
          {currentStep.tide > 3.8 && (
            <g>
              <rect x="115" y="185" width="8" height="12" fill="#ef4444" rx="2" />
              <text x="75" y="194" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">GATES CLOSED</text>
            </g>
          )}
        </svg>

        {/* Dynamic Canvas Layer for Directional Vectors */}
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        />

        {/* Hotspot Markers */}
        {REPLAY_HOTSPOTS.map((spot) => {
          const spotDepth = Math.round((currentDepth * (spot.normalDepth / 15)));
          const isFlooded = spotDepth > 25;
          const isSelected = selectedPin?.id === spot.id;

          return (
            <div 
              key={spot.id}
              onClick={() => handleHotspotClick(spot)}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className={`relative flex items-center justify-center transition-all ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-115'
              }`}>
                {/* Ripple ring if flooded */}
                {isFlooded && (
                  <span className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping" />
                )}
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-md border ${
                  spotDepth > 45 
                    ? 'bg-red-600 text-white border-red-300' 
                    : spotDepth > 20 
                    ? 'bg-amber-500 text-white border-amber-300' 
                    : 'bg-emerald-600 text-white border-emerald-300'
                }`}>
                  {spotDepth}
                </div>
              </div>

              {/* Pin Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900/95 border border-slate-700 rounded-lg text-white text-[10px] font-mono whitespace-nowrap shadow-xl transition-opacity z-30">
                <p className="font-bold">{spot.name}</p>
                <p className="text-slate-400">Depth: <span className="text-cyan-300 font-bold">{spotDepth} cm</span> | Ward: {spot.basin}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hotspot Bottom Telemetry Bar */}
      {selectedPin && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-3 text-white text-xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-900/50 text-purple-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-100">{selectedPin.name}</div>
              <div className="text-[10px] font-mono text-slate-400">
                Basin: {selectedPin.basin} &bull; Est. Water Depth: <span className="text-red-400 font-bold">{Math.round(currentDepth * (selectedPin.normalDepth / 15))} cm</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800">
              Drainage Rating: {selectedPin.baseDrainCapacity} m³/min
            </span>
            <button 
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-white px-2 py-1"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

