import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Maximize2,
  Waves,
  Activity
} from 'lucide-react';

export default function LocationCatchmentMap({ selectedPlace, onSelectSensor, onSelectShelter }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayers, setActiveLayers] = useState({
    floodContours: true,
    stormDrains: true,
    iotSensors: true,
    safeShelters: true,
    radarPings: true
  });
  const [hoveredEntity, setHoveredEntity] = useState(null);

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Mock surrounding catchment topology around the selected place
  const nearbySensors = [
    { id: 'SEN-01', name: 'Hindmata Culvert Ultrasonic-A', dist: '45m', depth: selectedPlace.currentDepth, trend: '+2cm/10m', x: 42, y: 38 },
    { id: 'SEN-02', name: 'Dr. Ambedkar Rd Storm Inflow', dist: '130m', depth: Math.max(0, selectedPlace.currentDepth - 4), trend: '+4cm/10m', x: 68, y: 62 },
    { id: 'SEN-03', name: 'Central Railway Sump Outflow', dist: '220m', depth: Math.max(0, selectedPlace.currentDepth + 6), trend: '-1cm/10m', x: 25, y: 70 },
  ];

  const nearbyShelters = [
    { id: 'SH-01', name: 'Don Bosco Relief Centre', dist: '380m', elev: '+12.4m', cap: '850/1200', x: 75, y: 22 },
    { id: 'SH-02', name: 'Khalsa College High Ground', dist: '520m', elev: '+14.1m', cap: '420/800', x: 20, y: 28 },
  ];

  const drainLines = [
    { id: 'dl-1', path: 'M 10 30 Q 35 45 50 50 T 90 60', name: 'Box Drain Main Canal' },
    { id: 'dl-2', path: 'M 40 10 L 50 50 L 60 90', name: 'Ambedkar Rd Feeder Culvert' },
    { id: 'dl-3', path: 'M 80 15 Q 65 55 20 85', name: 'Gravity Relief Conduit' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
      {/* Header & Layer Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-ink">Interactive Catchment & Micro-Basin Radar</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Micro-topography contour map centered on <span className="font-semibold text-ink">{selectedPlace.name}</span> ({selectedPlace.elevation})
          </p>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))} 
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition" 
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} 
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition" 
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)} 
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition" 
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-xl">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Layer Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-mono text-muted mr-1">Layers:</span>
        <button 
          onClick={() => toggleLayer('floodContours')}
          className={`text-xs px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
            activeLayers.floodContours ? 'bg-purple-100 text-purple-primary border border-purple-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Waves className="w-3 h-3" /> Inundation Contours
        </button>
        <button 
          onClick={() => toggleLayer('stormDrains')}
          className={`text-xs px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
            activeLayers.stormDrains ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Layers className="w-3 h-3" /> Storm Drains & Culverts
        </button>
        <button 
          onClick={() => toggleLayer('iotSensors')}
          className={`text-xs px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
            activeLayers.iotSensors ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Radio className="w-3 h-3" /> IoT Ultrasonic Nodes
        </button>
        <button 
          onClick={() => toggleLayer('safeShelters')}
          className={`text-xs px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
            activeLayers.safeShelters ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <ShieldCheck className="w-3 h-3" /> Emergency Shelters
        </button>
      </div>

      {/* Canvas Radar View */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 select-none">
        {/* Grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #6D4AFF 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Scalable Container */}
        <div 
          className="absolute inset-0 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Inundation Contours (SVG) */}
          {activeLayers.floodContours && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={selectedPlace.currentDepth > 20 ? "0.45" : "0.2"} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="35" ry="28" fill="url(#floodGlow)" />
              <path d="M 15,50 Q 50,20 85,50 Q 50,80 15,50 Z" fill="none" stroke="#6D4AFF" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
              <path d="M 25,50 Q 50,30 75,50 Q 50,70 25,50 Z" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.4" />
            </svg>
          )}

          {/* Storm Drain Lines */}
          {activeLayers.stormDrains && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {drainLines.map(dl => (
                <path 
                  key={dl.id} 
                  d={dl.path} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="1.2" 
                  strokeDasharray="3,2"
                  className="animate-pulse"
                />
              ))}
            </svg>
          )}

          {/* Central Active Location Marker */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{ left: '50%', top: '50%' }}
            onMouseEnter={() => setHoveredEntity({ title: selectedPlace.name, desc: `${selectedPlace.elevation} • Current Depth: ${selectedPlace.currentDepth}cm` })}
            onMouseLeave={() => setHoveredEntity(null)}
          >
            {/* Pulsing Radar Ring */}
            <div className="absolute -inset-4 rounded-full bg-purple-500/25 animate-ping pointer-events-none" />
            <div className="absolute -inset-8 rounded-full bg-purple-500/10 pointer-events-none" />
            
            <div className="relative px-3 py-1.5 rounded-xl bg-purple-primary text-white text-xs font-bold shadow-xl border-2 border-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>{selectedPlace.name}</span>
            </div>
          </div>

          {/* Surrounding IoT Sensors */}
          {activeLayers.iotSensors && nearbySensors.map(sen => (
            <div 
              key={sen.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              style={{ left: `${sen.x}%`, top: `${sen.y}%` }}
              onClick={() => onSelectSensor && onSelectSensor(sen)}
              onMouseEnter={() => setHoveredEntity({ title: sen.name, desc: `${sen.dist} away • Depth: ${sen.depth}cm (${sen.trend})` })}
              onMouseLeave={() => setHoveredEntity(null)}
            >
              <div className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-white border border-emerald-400/50 shadow-lg transition-transform group-hover:scale-110">
                <Radio className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
              </div>
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 bg-black/90 text-emerald-300 text-[10px] font-mono rounded whitespace-nowrap z-30 pointer-events-none">
                {sen.id}: {sen.depth}cm ({sen.trend})
              </div>
            </div>
          ))}

          {/* Surrounding Safe Shelters */}
          {activeLayers.safeShelters && nearbyShelters.map(sh => (
            <div 
              key={sh.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              style={{ left: `${sh.x}%`, top: `${sh.y}%` }}
              onClick={() => onSelectShelter && onSelectShelter(sh)}
              onMouseEnter={() => setHoveredEntity({ title: sh.name, desc: `${sh.dist} away • Elevation: ${sh.elev} • Capacity: ${sh.cap}` })}
              onMouseLeave={() => setHoveredEntity(null)}
            >
              <div className="relative p-2 rounded-xl bg-amber-500/90 hover:bg-amber-600 text-white border border-amber-300 shadow-lg transition-transform group-hover:scale-110">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 bg-black/90 text-amber-200 text-[10px] font-mono rounded whitespace-nowrap z-30 pointer-events-none">
                {sh.name} ({sh.elev})
              </div>
            </div>
          ))}
        </div>

        {/* Hovered Entity Floating Details Bar */}
        {hoveredEntity ? (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-slate-900/95 backdrop-blur border border-slate-700 p-2.5 rounded-xl text-white shadow-xl text-xs z-30 max-w-md animate-fadeIn">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {hoveredEntity.title}
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5">{hoveredEntity.desc}</div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700/60 px-3 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono z-30">
            Hover or click markers to inspect telemetry • Scale 1:2,500
          </div>
        )}

        {/* Compass & North Indicator */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700/60 px-2.5 py-1.5 rounded-xl text-[10px] font-mono text-slate-300 flex items-center gap-1 z-20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE RADAR • N ↑</span>
        </div>
      </div>
    </div>
  );
}

