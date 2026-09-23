import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Sliders, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Eye, 
  Droplet,
  Compass,
  ArrowUp,
  Activity
} from 'lucide-react';

export default function LocationCrossSection({ selectedPlace }) {
  // Water depth slider (defaults to selected place current depth or peak)
  const [visualDepth, setVisualDepth] = useState(selectedPlace.currentDepth || 18);
  const [barrierHeight, setBarrierHeight] = useState(25); // cm barrier installed
  const [structureType, setStructureType] = useState('stilt'); // 'basement', 'stilt', 'ground'

  // Thresholds in cm relative to road level (0 cm)
  const ROAD_LEVEL = 0;
  const CURB_LEVEL = 15; // +15cm sidewalk
  const BARRIER_TOP = CURB_LEVEL + barrierHeight; // e.g. 15 + 25 = 40cm
  const GROUND_PLINTH = 25; // +25cm
  const BASEMENT_FLOOR = -120; // -120cm
  const STILT_FLOOR = 10; // +10cm

  // Compute status
  const isCurbSubmerged = visualDepth >= CURB_LEVEL;
  const isBarrierBreached = visualDepth > BARRIER_TOP;
  const isStiltFlooded = visualDepth >= STILT_FLOOR;
  const isGroundFloorFlooded = visualDepth >= GROUND_PLINTH;

  // Scale: 1 cm water = 1.6 px on SVG
  const maxWaterPx = Math.min(180, visualDepth * 2.2);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-ink">Property 2D Cross-Section & Ingress Waterline Visualizer</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Physical structural elevation cross-section for {selectedPlace.name} showing water rise against plinths and barriers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVisualDepth(selectedPlace.currentDepth)}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition"
          >
            Live ({selectedPlace.currentDepth}cm)
          </button>
          <button
            onClick={() => setVisualDepth(selectedPlace.peakDepth)}
            className="text-xs px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-primary font-mono font-bold transition"
          >
            Peak ({selectedPlace.peakDepth}cm)
          </button>
        </div>
      </div>

      {/* Interactive Waterline Slider */}
      <div className="bg-canvas p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-purple-primary" /> Test Inundation Waterline
          </span>
          <span className="text-xs font-mono font-extrabold text-purple-primary bg-purple-100 px-2 py-0.5 rounded-md">
            Waterline at +{visualDepth} cm
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="65" 
          step="1"
          value={visualDepth}
          onChange={(e) => setVisualDepth(Number(e.target.value))}
          className="w-full accent-purple-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
          <span>Dry (0cm)</span>
          <span>Sidewalk (+15cm)</span>
          <span>Barrier Top (+{BARRIER_TOP}cm)</span>
          <span>Ground Sill (+50cm)</span>
        </div>
      </div>

      {/* SVG Cross-Section Elevation Graphic */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 select-none flex flex-col justify-end">
        {/* Sky / Air Zone */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
          STRUCTURAL ELEVATION SECTION • SCALE 1:20
        </div>

        {/* SVG Drawing */}
        <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
          {/* Sub-surface Earth & Storm Drain Box */}
          <rect x="0" y="160" width="600" height="80" fill="#1e293b" />
          
          {/* Underground Municipal Box Drain */}
          <rect x="60" y="180" width="90" height="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="105" y="208" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">BOX DRAIN</text>

          {/* Road Surface (Level 0) */}
          <rect x="0" y="150" width="220" height="10" fill="#334155" />
          <text x="70" y="145" fill="#94a3b8" fontSize="9" fontFamily="monospace">PUBLIC ROAD (+0.0m)</text>

          {/* Curb / Sidewalk (+15cm) */}
          <rect x="220" y="135" width="60" height="25" fill="#475569" stroke="#64748b" />
          <text x="250" y="130" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">CURB (+15cm)</text>

          {/* Deployed Flood Barrier Gate */}
          <rect x="278" y={135 - (barrierHeight * 1.2)} width="8" height={barrierHeight * 1.2} fill="#eab308" stroke="#ca8a04" />
          <text x="282" y={125 - (barrierHeight * 1.2)} fill="#fde047" fontSize="8" fontFamily="monospace" textAnchor="middle">
            BARRIER (+{BARRIER_TOP}cm)
          </text>

          {/* Building Plinth & Stilt Entry */}
          <rect x="286" y="125" width="314" height="35" fill="#475569" stroke="#64748b" />
          <text x="440" y="145" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            BUILDING STILT PARKING / PLINTH (+10cm)
          </text>

          {/* Building 1st Floor Slab (+3.5m) */}
          <rect x="360" y="40" width="240" height="15" fill="#64748b" />
          <text x="480" y="32" fill="#a5b4fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
            1ST FLOOR RESIDENCE (+3.5m MSL - SAFE ZONE)
          </text>

          {/* Columns */}
          <rect x="380" y="55" width="16" height="70" fill="#475569" />
          <rect x="540" y="55" width="16" height="70" fill="#475569" />

          {/* Vehicle Parked in Stilt */}
          <rect x="420" y="95" width="70" height="30" rx="6" fill="#6366f1" opacity="0.8" />
          <circle cx="435" cy="125" r="7" fill="#1e1b4b" />
          <circle cx="475" cy="125" r="7" fill="#1e1b4b" />
          <text x="455" y="114" fill="#ffffff" fontSize="8" fontFamily="sans-serif" textAnchor="middle">VEHICLE</text>

          {/* DYNAMIC WATER BODY */}
          <rect 
            x="0" 
            y={150 - (visualDepth * 1.4)} 
            width={isBarrierBreached ? "600" : "280"} 
            height={visualDepth * 1.4 + 10} 
            fill="url(#waterGrad)" 
            opacity="0.75" 
          />

          {/* Waterline Indicator Line */}
          <line 
            x1="0" 
            y1={150 - (visualDepth * 1.4)} 
            x2={isBarrierBreached ? "600" : "280"} 
            y2={150 - (visualDepth * 1.4)} 
            stroke="#67e8f9" 
            strokeWidth="2" 
            strokeDasharray="4,2" 
          />

          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>

        {/* Real-time Status Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl shadow-md ${
            isBarrierBreached 
              ? 'bg-red-500 text-white animate-pulse' 
              : isCurbSubmerged 
              ? 'bg-amber-500 text-black' 
              : 'bg-emerald-600 text-white'
          }`}>
            {isBarrierBreached ? '⚠️ FLOOD BARRIER BREACHED!' : isCurbSubmerged ? '⚡ CURB OVERTOPPED (BARRIER HOLDING)' : '✅ WATER CONTAINED IN ROAD GUTTER'}
          </span>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
        <div className={`p-3 rounded-2xl border ${isCurbSubmerged ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <span className="text-[10px] font-mono text-muted uppercase block">Sidewalk Curb (+15cm)</span>
          <span className="font-bold text-sm mt-0.5 block">{isCurbSubmerged ? 'Submerged by ' + (visualDepth - 15) + 'cm' : 'Dry (+ ' + (15 - visualDepth) + 'cm margin)'}</span>
        </div>

        <div className={`p-3 rounded-2xl border ${isBarrierBreached ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <span className="text-[10px] font-mono text-muted uppercase block">Flood Gate Barrier (+{BARRIER_TOP}cm)</span>
          <span className="font-bold text-sm mt-0.5 block">{isBarrierBreached ? 'Overtopped by ' + (visualDepth - BARRIER_TOP) + 'cm' : 'Holding (+ ' + (BARRIER_TOP - visualDepth) + 'cm head)'}</span>
        </div>

        <div className={`p-3 rounded-2xl border ${isStiltFlooded && isBarrierBreached ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <span className="text-[10px] font-mono text-muted uppercase block">Stilt Parking Ingress</span>
          <span className="font-bold text-sm mt-0.5 block">{isStiltFlooded && isBarrierBreached ? 'Water Flooding Stilt' : 'Stilt Parking Protected'}</span>
        </div>
      </div>
    </div>
  );
}

