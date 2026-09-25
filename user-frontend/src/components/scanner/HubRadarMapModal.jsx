import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Radio, Compass, MapPin, Eye, ArrowRight, ShieldCheck, 
  AlertTriangle, ZoomIn, ZoomOut, RotateCcw, Volume2
} from 'lucide-react';

export default function HubRadarMapModal({ hubs, onSelectHub, onClose, onInspectCctv, onNavigateRoute, onSpeak }) {
  const [selectedPin, setSelectedPin] = useState(hubs[0] || null);
  const [radarFilter, setRadarFilter] = useState('all');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Center reference (Mumbai central hub - BKC: lat ~19.0657, lng ~72.8688)
  const centerCoord = { lat: 19.0750, lng: 72.8600 };

  const filteredHubs = hubs.filter(h => radarFilter === 'all' || h.type === radarFilter);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 680;
    const height = canvas.height = 480;
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Save transform for zoom & pan
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);
      ctx.translate(-centerX, -centerY);

      // Concentric range rings
      const rings = [60, 120, 180, 240];
      const ringDistances = ['2 km', '5 km', '10 km', '15 km'];

      ctx.lineWidth = 1;
      rings.forEach((r, idx) => {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(ringDistances[idx], centerX + 8, centerY - r + 12);
      });

      // Crosshair axis lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.moveTo(centerX - 260, centerY);
      ctx.lineTo(centerX + 260, centerY);
      ctx.moveTo(centerX, centerY - 240);
      ctx.lineTo(centerX, centerY + 240);
      ctx.stroke();

      // Sweeping radar beam gradient
      angle = (angle + 0.02) % (Math.PI * 2);
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 240);
      sweepGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      sweepGrad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 240, angle - 0.35, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Center user / reference radar tower
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Render Hub Blips on radar
      filteredHubs.forEach(hub => {
        // Map lat/lng delta to X/Y relative to center
        const dx = (hub.coordinates.lng - centerCoord.lng) * 2200;
        const dy = -(hub.coordinates.lat - centerCoord.lat) * 2200; // invert latitude
        const pinX = centerX + dx;
        const pinY = centerY + dy;

        // Is currently highlighted
        const isSelected = selectedPin?.id === hub.id;

        // Color by severity
        const color = hub.severity === 'critical' ? '#ef4444' : hub.severity === 'caution' ? '#f59e0b' : '#10b981';

        // Ripple pulse on critical or selected hubs
        if (hub.severity === 'critical' || isSelected) {
          const pulseR = 8 + (Math.sin(Date.now() * 0.005 + hub.waterDepth) + 1) * 6;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(pinX, pinY, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner solid dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pinX, pinY, isSelected ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();

        // Hub Label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.fillText(hub.name.split(' (')[0].slice(0, 18), pinX + 8, pinY + 3);

        // Depth badge
        ctx.fillStyle = color;
        ctx.fillText(`${hub.waterDepth}cm`, pinX + 8, pinY + 13);
      });

      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [filteredHubs, selectedPin, zoom]);

  // Click on canvas to detect nearest hub pin
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Convert mouse to unzoomed radar coords
    const adjX = (mouseX - centerX) / zoom + centerX;
    const adjY = (mouseY - centerY) / zoom + centerY;

    let closest = null;
    let minDist = 30; // 30px click radius

    filteredHubs.forEach(hub => {
      const dx = (hub.coordinates.lng - centerCoord.lng) * 2200;
      const dy = -(hub.coordinates.lat - centerCoord.lat) * 2200;
      const pinX = centerX + dx;
      const pinY = centerY + dy;

      const dist = Math.hypot(adjX - pinX, adjY - pinY);
      if (dist < minDist) {
        minDist = dist;
        closest = hub;
      }
    });

    if (closest) {
      setSelectedPin(closest);
      if (onSpeak) {
        onSpeak(`Selected ${closest.name}. Status: ${closest.statusLabel}. Water depth: ${closest.waterDepth} centimeters.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-base leading-none">Live Hub Tactical Radar & GIS Scanner</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time Doppler storm surface correlation across Greater Mumbai transit nodes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'transit', label: 'Transit' },
                { id: 'commercial', label: 'Malls' },
                { id: 'office', label: 'Offices' },
                { id: 'hospital', label: 'Hospitals' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setRadarFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                    radarFilter === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Radar Canvas with interactive overlay */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[360px]">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full max-h-[480px] object-contain cursor-crosshair"
          />

          {/* Radar Zoom Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 bg-slate-900/80 border border-slate-700 rounded-xl p-1 text-white">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.3, 2.5))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.3, 0.8))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Selected Pin Mini HUD Card */}
          {selectedPin && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 text-white shadow-xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">{selectedPin.ward}</span>
                  <h4 className="font-bold text-sm leading-tight text-white">{selectedPin.name}</h4>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                  selectedPin.severity === 'critical'
                    ? 'bg-red-950 text-red-400 border-red-800'
                    : selectedPin.severity === 'caution'
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {selectedPin.waterDepth} cm
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 font-mono leading-tight">
                {selectedPin.statusLabel}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    onInspectCctv(selectedPin);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspect CCTV</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateRoute(selectedPin);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow"
                >
                  <span>Route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
