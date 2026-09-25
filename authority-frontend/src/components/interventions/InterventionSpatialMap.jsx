import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Sliders,
  Shield,
  Droplets,
  Activity,
  Maximize2,
  Compass,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';

export default function InterventionSpatialMap({
  interventions,
  activeInterventions,
  toggleIntervention,
  selectedCorridorId,
  onSelectCorridor,
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showRings, setShowRings] = useState(true);
  const [filterLayer, setFilterLayer] = useState('all'); // 'all' | 'pumps' | 'sluices' | 'basins'

  // Map coordinate conversion for SVG viewport (Mumbai Metro: Lat 18.9 to 19.2, Lng 72.8 to 72.95)
  // We project into a 800x520 coordinate box
  const project = (lat, lng) => {
    const minLat = 18.96;
    const maxLat = 19.16;
    const minLng = 72.80;
    const maxLng = 72.94;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 460 + 30;
    return { x, y };
  };

  // Strategic Hotspots
  const corridors = [
    { id: 'andheri-subway', name: 'Andheri Subway', lat: 19.1197, lng: 72.8468, peak: 52, ward: 'Ward K/E' },
    { id: 'milan-subway', name: 'Milan Subway', lat: 19.0912, lng: 72.8431, peak: 48, ward: 'Ward H/W' },
    { id: 'lbs-marg', name: 'LBS Marg Kurla', lat: 19.0645, lng: 72.8835, peak: 31, ward: 'Ward L' },
    { id: 'sion-circle', name: 'Sion East Circle', lat: 19.0392, lng: 72.8619, peak: 43, ward: 'Ward F/N' },
    { id: 'kings-circle', name: 'King’s Circle Gandhi Mkt', lat: 19.0315, lng: 72.8582, peak: 39, ward: 'Ward F/N' },
    { id: 'hindmata-dadar', name: 'Hindmata Dadar TT', lat: 19.0178, lng: 72.8428, peak: 36, ward: 'Ward G/N' },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border shadow-subtle flex flex-col overflow-hidden">
      {/* Top Map Toolbar */}
      <div className="p-3 bg-surface-subtle border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-soft text-purple">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-ink">
              Spatial Intervention & Hydrodynamic Influence Twin
            </h3>
            <p className="text-[10px] text-ink-secondary">
              Mumbai Coastal Catchment • Real-time hydrodynamic dissipation zones
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-surface-secondary p-1 rounded-lg border border-border">
            {['all', 'pumps', 'sluices', 'basins'].map((flt) => (
              <button
                key={flt}
                onClick={() => setFilterLayer(flt)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition-all ${
                  filterLayer === flt
                    ? 'bg-purple text-white shadow-subtle'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {flt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowRings(!showRings)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              showRings
                ? 'bg-purple-soft text-purple border-purple/30'
                : 'bg-surface text-ink-secondary border-border'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Influence Radii</span>
          </button>
        </div>
      </div>

      {/* Main Map SVG Viewport */}
      <div className="relative w-full h-[450px] bg-slate-900 overflow-hidden select-none">
        <svg viewBox="0 0 800 520" className="w-full h-full">
          <defs>
            {/* Coastal & terrain glow */}
            <radialGradient id="oceanGlow" cx="15%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="1" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="pumpRadius" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#6D4AFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sluiceRadius" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Map Canvas (Arabian Sea + Landform) */}
          <rect width="800" height="520" fill="url(#oceanGlow)" />

          {/* Mumbai Stylized Peninsula Vector Outline */}
          <path
            d="M 120 10 Q 180 80 200 160 Q 220 220 230 300 Q 235 360 210 430 Q 190 480 180 510 L 460 510 L 470 300 Q 420 180 340 70 Z"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Mithi River Channel */}
          <path
            d="M 450 140 Q 340 180 300 240 Q 260 280 230 310 Q 200 330 180 345"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeDasharray="6 3"
            opacity="0.75"
          />
          <text x="320" y="210" fill="#38BDF8" className="text-[10px] font-mono opacity-60">
            Mithi River Estuary
          </text>

          {/* Mahim Bay / Creek */}
          <path
            d="M 180 345 Q 160 360 140 370"
            fill="none"
            stroke="#0284C7"
            strokeWidth="6"
            opacity="0.6"
          />

          {/* Western Express Highway Spine */}
          <path
            d="M 280 40 L 260 180 L 245 320 L 220 440"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <text x="270" y="70" fill="#94A3B8" className="text-[8px] font-mono rotate-12">
            Western Express Hwy
          </text>

          {/* Eastern Express Highway Spine */}
          <path
            d="M 420 50 L 380 190 L 340 310 L 300 450"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Interventions with Influence Radii */}
          {interventions.map((intv) => {
            const isActive = activeInterventions.includes(intv.id);
            const isPump = intv.category === 'Active Dewatering';
            const isSluice = intv.category === 'Hydraulic Diversion';
            const isBasin = intv.category === 'Retention Storage';

            if (filterLayer === 'pumps' && !isPump) return null;
            if (filterLayer === 'sluices' && !isSluice) return null;
            if (filterLayer === 'basins' && !isBasin) return null;

            const coords = intv.coordinates || [19.05, 72.86];
            const { x, y } = project(coords[0], coords[1]);
            const radius = isActive ? (isSluice ? 75 : 55) : 35;

            return (
              <g key={intv.id} className="cursor-pointer group">
                {/* Dissipation Radial Wave */}
                {isActive && showRings && (
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={isSluice ? 'url(#sluiceRadius)' : 'url(#pumpRadius)'}
                    className="animate-pulse"
                  />
                )}

                {/* Node Icon Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 8 : 6}
                  fill={isActive ? (isSluice ? '#06B6D4' : '#6D4AFF') : '#475569'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="group-hover:r-10 transition-all shadow-lg"
                  onClick={() => setSelectedNode(intv)}
                />

                {/* Status Indicator Pip */}
                {isActive && (
                  <circle cx={x + 7} cy={y - 7} r="3" fill="#10B981" />
                )}

                {/* Label text */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  className="text-[9px] font-mono font-bold drop-shadow group-hover:fill-purple-300 transition-all pointer-events-none"
                >
                  {intv.name.split(' ')[0]} {intv.name.split(' ')[1]}
                </text>
              </g>
            );
          })}

          {/* Road Corridors Hotspots */}
          {corridors.map((rd) => {
            const { x, y } = project(rd.lat, rd.lng);
            const isSelected = selectedCorridorId === rd.id;

            return (
              <g
                key={rd.id}
                className="cursor-pointer"
                onClick={() => onSelectCorridor(rd.id)}
              >
                {/* Outer flood ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray="3 3"
                  className="animate-spin"
                  style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '8s' }}
                />
                {/* Center marker */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={isSelected ? '#EF4444' : '#F87171'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x={x + 10}
                  y={y + 4}
                  fill={isSelected ? '#FCA5A5' : '#CBD5E1'}
                  className="text-[10px] font-sans font-semibold drop-shadow"
                >
                  {rd.name} ({rd.peak}cm)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Drawer / Floating Inspector */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-30 w-72 bg-surface/95 backdrop-blur-md rounded-xl border border-border p-4 shadow-elevated animate-fade-in text-ink">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-soft text-purple font-semibold">
                  {selectedNode.category}
                </span>
                <h4 className="text-xs font-bold text-ink mt-1">
                  {selectedNode.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-ink-secondary hover:text-ink text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-secondary">
                <span>Location:</span>
                <span className="font-semibold text-ink">{selectedNode.targetLocation}</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Flow Capacity:</span>
                <span className="font-mono text-purple font-bold">{selectedNode.capacity}</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Peak Reduction:</span>
                <span className="font-mono text-status-safe font-bold">
                  -{selectedNode.deltaDepthReductionCm} cm
                </span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Deployment Time:</span>
                <span className="font-mono">{selectedNode.setupTimeMin} min</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-secondary">
                Status:{' '}
                <strong
                  className={
                    activeInterventions.includes(selectedNode.id)
                      ? 'text-status-safe'
                      : 'text-ink-secondary'
                  }
                >
                  {activeInterventions.includes(selectedNode.id)
                    ? 'COUPLED'
                    : 'STANDBY'}
                </strong>
              </span>

              <button
                onClick={() => toggleIntervention(selectedNode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeInterventions.includes(selectedNode.id)
                    ? 'bg-status-alert text-white hover:bg-status-alert/90'
                    : 'bg-purple text-white hover:bg-purple-deep'
                }`}
              >
                {activeInterventions.includes(selectedNode.id)
                  ? 'Deactivate'
                  : 'Engage Solver'}
              </button>
            </div>
          </div>
        )}

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md rounded-lg p-2.5 border border-slate-800 text-[10px] text-slate-300 space-y-1">
          <div className="font-bold text-white uppercase text-[9px] tracking-wider mb-1">
            Spatial Symbols
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Flooded Road Choke-Point</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple"></span>
            <span>High-Capacity Dewatering Pump</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Tidal Sluice Outfall Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

