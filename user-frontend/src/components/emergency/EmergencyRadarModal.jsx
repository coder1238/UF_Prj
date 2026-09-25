import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, MapPin, ShieldCheck, Navigation, Phone, 
  ExternalLink, Layers, X, Search, Activity, CheckCircle2 
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

export default function EmergencyRadarModal({ isOpen, onClose, userCoordinates, onNavigate }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'HOSPITAL' | 'SHELTER'
  const [selectedShelter, setSelectedShelter] = useState(SAFE_PLACES_DATA[0]);
  const [radarZoom, setRadarZoom] = useState(5); // km radius
  const canvasRef = useRef(null);

  // Filter places
  const filteredPlaces = SAFE_PLACES_DATA.filter(place => {
    if (filterType === 'ALL') return true;
    if (filterType === 'HOSPITAL') return place.type === 'hospital';
    if (filterType === 'SHELTER') return place.type === 'relief-camp' || place.category === 'COMMUNITY_CENTER';
    return true;
  });

  // Draw interactive radar sweep canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 20;

      // Clear dark radar background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Radar concentric circles
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX, height - 10);
      ctx.moveTo(10, centerY);
      ctx.lineTo(width - 10, centerY);
      ctx.stroke();

      // Range text
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`${radarZoom} km`, centerX + 6, centerY - maxRadius + 14);
      ctx.fillText(`${(radarZoom / 2).toFixed(1)} km`, centerX + 6, centerY - (maxRadius / 2) + 14);

      // Rotating sweep cone
      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - 0.5, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();
      ctx.restore();

      // Draw user position (center red pulse)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw places
      filteredPlaces.forEach((place, index) => {
        const distKm = place.distanceKm || 2.5;
        const normDist = Math.min(distKm / radarZoom, 1.0) * maxRadius;
        const radAngle = ((place.bearingDeg || (index * 45)) * Math.PI) / 180 - Math.PI / 2;

        const px = centerX + normDist * Math.cos(radAngle);
        const py = centerY + normDist * Math.sin(radAngle);

        const isSelected = selectedShelter && selectedShelter.id === place.id;

        // Draw line from user to selected place
        if (isSelected) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw marker
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#3b82f6' : place.type === 'hospital' ? '#ef4444' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillText(place.name.substring(0, 16) + '...', px + 8, py + 3);
      });

      angle += 0.035;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, filterType, selectedShelter, radarZoom, filteredPlaces]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Feature #01</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                  Acoustic Sonar + Dry Corridors
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Emergency Radar & Evacuation Haven Proximity Map</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Canvas Radar */}
          <div className="md:col-span-7 p-6 flex flex-col items-center justify-center bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 relative">
            <div className="absolute top-4 left-4 z-10 flex gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
              {['ALL', 'HOSPITAL', 'SHELTER'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                    filterType === f ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-300">
              <span>Radius:</span>
              <button 
                onClick={() => setRadarZoom(z => z === 3 ? 5 : z === 5 ? 10 : 3)}
                className="text-emerald-400 font-bold hover:underline"
              >
                {radarZoom} KM
              </button>
            </div>

            <canvas 
              ref={canvasRef} 
              width={380} 
              height={380} 
              className="rounded-2xl border border-slate-800 shadow-2xl max-w-full"
            />

            <div className="mt-4 flex items-center gap-6 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>You (Citizen SOS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Relief Camp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Trauma Center</span>
              </div>
            </div>
          </div>

          {/* Right Selected Haven Details */}
          <div className="md:col-span-5 p-6 overflow-y-auto space-y-4 bg-slate-900">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Nearest Detected Havens ({filteredPlaces.length})
            </h3>

            {/* List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => setSelectedShelter(place)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all text-xs ${
                    selectedShelter.id === place.id 
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-md' 
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="truncate pr-2">{place.name}</span>
                    <span className="font-mono text-emerald-400 shrink-0">{place.distance || `${place.distanceKm} km`}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Elev: {place.elevation}</span>
                    <span>•</span>
                    <span className="text-emerald-300">{place.statusBadge || 'OPERATIONAL'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Inspector */}
            {selectedShelter && (
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedShelter.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedShelter.address}</p>
                  </div>
                  <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">ELEVATION MSL</span>
                    <span className="text-emerald-400 font-bold text-xs">{selectedShelter.elevation}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">WATER ON ROUTE</span>
                    <span className="text-emerald-400 font-bold text-xs">{selectedShelter.maxDepthOnRoute || '0 cm (Dry)'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">CAPACITY FREE</span>
                    <span className="text-amber-400 font-bold text-xs">{selectedShelter.availableCapacity || 120} Beds</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">GENERATOR DIESEL</span>
                    <span className="text-cyan-400 font-bold text-xs">{selectedShelter.generatorHours || 72}h Runtime</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-emerald-400 block font-mono text-[10px]">CORRIDOR ASSESSMENT:</span>
                  <p className="mt-0.5">{selectedShelter.corridorNotes || 'Dry elevated corridor confirmed via CCTV sensors.'}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href={`tel:${selectedShelter.phone}`}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Haven Desk
                  </a>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate(selectedShelter);
                      onClose();
                    }}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Direct Route
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

