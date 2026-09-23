import React, { useState } from 'react';
import { MapPin, Navigation, Radio, Copy, Check, ExternalLink, Truck, ShieldAlert, Compass } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function ReportMiniMapRadar({ report }) {
  const { navigateTo } = useNavigation();
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const coords = report.coordinates || { lat: 19.0825, lng: 72.8415 };

  const handleCopyCoords = () => {
    const text = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-primary" />
          <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
            Hydraulic Radar & Asset Position
          </h4>
        </div>
        <button
          onClick={handleCopyCoords}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
          title="Copy GPS coordinates"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" /> {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
            </>
          )}
        </button>
      </div>

      {/* Stylized Visual Interactive Radar Canvas */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
        
        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        {/* Concentric Radar Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-purple-500/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-purple-500/40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-purple-500/50 pointer-events-none" />

        {/* Animated Sweep Line */}
        <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none origin-bottom-right animate-spin" style={{ animationDuration: '6s' }}>
          <div className="w-full h-full bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent" />
        </div>

        {/* Center: Incident Ground Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping" />
            <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-3 h-3 fill-current" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[9px] font-mono font-bold whitespace-nowrap border border-slate-700">
            {report.depth}cm • {report.id}
          </span>
        </div>

        {/* Dewatering Pump Truck Asset Pin */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-6 h-6 rounded-lg bg-purple-primary text-white flex items-center justify-center shadow-md border border-purple-300">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <span className="mt-0.5 px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-200 text-[8px] font-mono">
            Pump #7 (250m away)
          </span>
        </div>

        {/* Stormwater Drain Outfall Pin */}
        <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border border-emerald-300 text-[9px] font-mono font-bold">
            D
          </div>
          <span className="mt-0.5 px-1.5 py-0.2 rounded bg-slate-900/80 text-emerald-300 text-[8px] font-mono">
            Box Culvert Outfall
          </span>
        </div>

        {/* Compass Header in Corner */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-lg border border-slate-800">
          <Compass className="w-3 h-3 text-purple-400" />
          <span>350m CATCHMENT RADAR</span>
        </div>

        {/* Bottom Coordinates & Watermark */}
        <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-lg border border-slate-800">
          Lat {coords.lat.toFixed(4)}°N • Lng {coords.lng.toFixed(4)}°E
        </div>
      </div>

      {/* Map Action Quick Bar */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => navigateTo('live-map')}
          className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary font-bold flex items-center justify-center gap-1.5 transition-colors border border-purple-200"
        >
          <Navigation className="w-3.5 h-3.5" /> Full Live Map View
        </button>

        <button
          onClick={() => navigateTo('route')}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Plan Bypass Detour
        </button>
      </div>

    </div>
  );
}
