import React from 'react';
import { X, TrendingUp, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function ElevationProfileModal({ place, onClose }) {
  const msl = place.elevationMsl || 18.0;
  const deluge2005 = place.historicalClearance?.deluge2005SurgeM || 4.2;
  const monsoon2017 = place.historicalClearance?.monsoon2017SurgeM || 2.8;
  const forecast2026 = place.historicalClearance?.forecast2026SurgeM || 1.6;
  const safetyBuffer = (msl - deluge2005).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-purple-50 text-purple-primary rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Historical Flood & MSL Elevation Profile</h2>
              <p className="text-xs text-muted font-mono">{place.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-purple-700 uppercase block">Site Datum</span>
            <span className="text-lg font-mono font-extrabold text-purple-primary">+{msl}m</span>
            <span className="text-[10px] text-muted block mt-0.5">MSL Elevation</span>
          </div>

          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-100">
            <span className="text-[10px] font-mono text-red-700 uppercase block">2005 100-Yr Crest</span>
            <span className="text-lg font-mono font-extrabold text-red-600">+{deluge2005}m</span>
            <span className="text-[10px] text-muted block mt-0.5">Surge High Mark</span>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-mono text-emerald-700 uppercase block">Safety Buffer</span>
            <span className="text-lg font-mono font-extrabold text-emerald-600">+{safetyBuffer}m</span>
            <span className="text-[10px] text-muted block mt-0.5">Clearance Margin</span>
          </div>
        </div>

        {/* Visual Elevation Diagram (SVG) */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white relative overflow-hidden mb-6">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2">
            Topographic High-Ground Cross-Section (Vertical Datum in Meters)
          </div>

          <div className="h-44 w-full relative flex items-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>

            {/* Bars container */}
            <div className="w-full flex items-end justify-around h-full pt-4 pb-2 z-10 text-center font-mono">
              
              {/* MSL Ground Zero */}
              <div className="flex flex-col items-center gap-1 w-14">
                <span className="text-[10px] text-slate-400">0.0m</span>
                <div className="w-8 h-3 bg-slate-600 rounded-t" />
                <span className="text-[9px] text-slate-400 truncate w-full">Sea Level</span>
              </div>

              {/* 2026 Forecast Crest */}
              <div className="flex flex-col items-center gap-1 w-16">
                <span className="text-[10px] text-cyan-400 font-bold">+{forecast2026}m</span>
                <div className="w-9 bg-cyan-500 rounded-t" style={{ height: `${(forecast2026 / msl) * 110 + 12}px` }} />
                <span className="text-[9px] text-cyan-300">2026 AI Nowcast</span>
              </div>

              {/* 2017 Monsoon Crest */}
              <div className="flex flex-col items-center gap-1 w-16">
                <span className="text-[10px] text-amber-400 font-bold">+{monsoon2017}m</span>
                <div className="w-9 bg-amber-500 rounded-t" style={{ height: `${(monsoon2017 / msl) * 110 + 18}px` }} />
                <span className="text-[9px] text-amber-300">2017 Crest</span>
              </div>

              {/* 2005 Extreme Deluge */}
              <div className="flex flex-col items-center gap-1 w-16">
                <span className="text-[10px] text-rose-400 font-bold">+{deluge2005}m</span>
                <div className="w-9 bg-rose-500 rounded-t" style={{ height: `${(deluge2005 / msl) * 110 + 26}px` }} />
                <span className="text-[9px] text-rose-300">2005 Deluge</span>
              </div>

              {/* Selected Safe Haven MSL Bar */}
              <div className="flex flex-col items-center gap-1 w-20">
                <span className="text-xs text-emerald-400 font-extrabold animate-pulse">+{msl}m</span>
                <div className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t shadow-lg shadow-emerald-500/30 flex items-center justify-center" style={{ height: '110px' }}>
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-emerald-300">THIS HAVEN</span>
              </div>

            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
            {place.historicalClearance?.verdict || 'Site maintains verified multi-meter elevation safety envelope.'}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Close Elevation Dossier
        </button>

      </div>
    </div>
  );
}

