import React, { useState, useEffect, useRef } from 'react';
import { Radio, Crosshair, ZoomIn, ZoomOut, Layers, Eye, AlertTriangle } from 'lucide-react';

export default function AlertRadarMap({ alerts, selectedAlert, onSelectAlert }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRadii, setShowRadii] = useState(true);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Animate radar beam sweep
  useEffect(() => {
    let animId;
    const animate = () => {
      setRadarAngle(prev => (prev + 1.5) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Map coordinates relative to Mumbai bounding box
  // Lat: 18.95 to 19.16, Lng: 72.80 to 72.92
  const minLat = 18.98, maxLat = 19.14;
  const minLng = 72.81, maxLng = 72.91;

  const projectCoords = (lat, lng) => {
    // Return x, y in range 10% to 90%
    const normX = (lng - minLng) / (maxLng - minLng);
    const normY = 1 - (lat - minLat) / (maxLat - minLat); // invert Y
    const x = Math.max(12, Math.min(88, normX * 100));
    const y = Math.max(12, Math.min(88, normY * 100));
    return { x, y };
  };

  return (
    <div className="relative bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 text-white overflow-hidden shadow-2xl">
      {/* Background Grid Pattern & Coordinates */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6D4AFF_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Geospatial Doppler Radar & Hazard Perimeters
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowRadii(!showRadii)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors flex items-center gap-1.5 ${
              showRadii ? 'bg-purple-900/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {showRadii ? 'Hide Radii' : 'Show Radii'}
          </button>
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] text-slate-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Radar Viewport */}
      <div 
        className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#080B14] border border-slate-800/80 overflow-hidden flex items-center justify-center cursor-crosshair"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
      >
        {/* Concentric Radar Rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-slate-800/60 pointer-events-none" />
        <div className="absolute w-[56%] h-[56%] rounded-full border border-slate-800/80 pointer-events-none" />
        <div className="absolute w-[32%] h-[32%] rounded-full border border-slate-800 pointer-events-none" />
        <div className="absolute w-[10%] h-[10%] rounded-full border border-purple-900/40 pointer-events-none" />

        {/* Crosshair grid lines */}
        <div className="absolute w-full h-[1px] bg-slate-800/50 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-slate-800/50 pointer-events-none" />

        {/* Animated Radar Sweep Beam */}
        <div 
          className="absolute inset-0 pointer-events-none origin-center"
          style={{
            transform: `rotate(${radarAngle}deg)`,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(109, 74, 255, 0.28) 25deg, transparent 28deg)'
          }}
        />

        {/* Range Labels */}
        <span className="absolute top-2 right-3 text-[10px] font-mono text-slate-600 pointer-events-none">2.5 km RADIUS</span>
        <span className="absolute bottom-2 left-3 text-[10px] font-mono text-purple-400 pointer-events-none">BMC SANTACRUZ DOPPLER RADAR 45 dBZ</span>

        {/* Interactive Hazard Pins */}
        {alerts.map(alert => {
          const { x, y } = projectCoords(alert.coordinates.lat, alert.coordinates.lng);
          const isSelected = selectedAlert && selectedAlert.id === alert.id;
          const isCritical = alert.severity === 'critical';
          const isDanger = alert.severity === 'danger';
          const isCaution = alert.severity === 'caution';

          const colorClass = isCritical ? 'bg-red-500 text-red-500' : isDanger ? 'bg-amber-500 text-amber-500' : 'bg-yellow-400 text-yellow-400';
          const ringColor = isCritical ? 'border-red-500/50 bg-red-500/10' : isDanger ? 'border-amber-500/40 bg-amber-500/10' : 'border-yellow-400/30 bg-yellow-400/10';

          return (
            <div
              key={alert.id}
              className="absolute z-20 transition-transform transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredPin(alert)}
              onMouseLeave={() => setHoveredPin(null)}
              onClick={() => onSelectAlert(alert)}
            >
              {/* Pulsing Danger Zone Radius */}
              {showRadii && (
                <div 
                  className={`absolute -inset-6 rounded-full border animate-pulse pointer-events-none ${ringColor}`}
                  style={{ animationDuration: isCritical ? '1.2s' : '2.2s' }}
                />
              )}

              {/* Pin Marker */}
              <div className={`relative p-1.5 rounded-full cursor-pointer transition-all ${
                isSelected ? 'ring-4 ring-white shadow-xl scale-125' : 'hover:scale-110 shadow-lg'
              } ${isCritical ? 'bg-red-600' : isDanger ? 'bg-amber-500' : 'bg-yellow-500'}`}>
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Pin Label */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur px-2 py-0.5 rounded border border-slate-700 text-[10px] font-mono pointer-events-none">
                <span className="font-bold text-white">{alert.ward}</span>
                <span className="text-slate-400 ml-1">({alert.waterDepthCm}cm)</span>
              </div>
            </div>
          );
        })}

        {/* Hovered Pin Card / Tooltip */}
        {hoveredPin && (
          <div className="absolute bottom-4 right-4 z-30 max-w-xs bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur text-left pointer-events-none">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                hoveredPin.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {hoveredPin.severity}
              </span>
              <span className="text-slate-400">{hoveredPin.ward}</span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-1">{hoveredPin.translations?.en?.title || hoveredPin.title}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Measured Depth:</span>
              <span className="text-red-400 font-extrabold">{hoveredPin.waterDepthCm} cm</span>
            </div>
            <div className="text-[10px] text-purple-300 mt-1 font-mono">
              Pumps: {hoveredPin.activePumps} Active ({hoveredPin.pumpDutyCycle}% Duty)
            </div>
          </div>
        )}
      </div>

      {/* Radar Footer Stats */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">ACTIVE SECTOR COORD</span>
          <span className="text-white font-bold">19.04° N, 72.85° E</span>
        </div>
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">PEAK WATER LOGGED</span>
          <span className="text-red-400 font-bold">38 cm (Hindmata)</span>
        </div>
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">BMC PUMPS ACTIVE</span>
          <span className="text-emerald-400 font-bold">48 Units Discharging</span>
        </div>
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">RADAR REFRESH</span>
          <span className="text-purple-400 font-bold">Continuous Telemetry</span>
        </div>
      </div>
    </div>
  );
}

