import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StreetRiskStrip({ 
  roadName = 'L.B.S. Marg (Kurla West Corridor)',
  currentWater = 24,
  expectedPeak = 39,
  peakEta = '+40 min',
  velocity = 0.42,
  startElevation = 8.2,
  endElevation = 2.1
}) {
  return (
    <div className="bg-canvas rounded-xl p-3.5 border border-border space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-ink truncate max-w-[200px]">{roadName}</span>
        <span className="font-mono text-[11px] text-red-700 bg-red-100 font-bold px-2 py-0.5 rounded">
          {currentWater} cm WATER
        </span>
      </div>

      {/* Visual Longitudinal Elevation Cross-section Strip */}
      <div className="relative pt-2">
        <div className="h-6 w-full rounded-lg bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600 relative overflow-hidden flex items-center px-2">
          {/* Subtle water ripples overlay */}
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px]"></div>
          
          <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono font-extrabold text-white drop-shadow">
            <span>+{startElevation}m (Elevated Ridge)</span>
            <span>Flow: {velocity} m/s ➔</span>
            <span>+{endElevation}m (Basin Dip)</span>
          </div>
        </div>

        {/* Pointer showing current water accumulation hotspot */}
        <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mt-1">
          <span>Ridge (Passable)</span>
          <span className="text-amber-800 font-bold">Camber Center (14cm)</span>
          <span className="text-red-700 font-bold">Gutter Dip ({currentWater}cm)</span>
        </div>
      </div>

      {/* Status metrics footer */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60 text-[11px] font-mono">
        <div>
          <span className="text-ink-muted text-[10px] block">EXPECTED PEAK</span>
          <span className="font-bold text-ink">{expectedPeak} cm</span>
        </div>
        <div>
          <span className="text-ink-muted text-[10px] block">PEAK ARRIVAL</span>
          <span className="font-bold text-primary">{peakEta}</span>
        </div>
        <div>
          <span className="text-ink-muted text-[10px] block">WATER VELOCITY</span>
          <span className="font-bold text-ink">{velocity} m/s</span>
        </div>
      </div>
    </div>
  );
}

