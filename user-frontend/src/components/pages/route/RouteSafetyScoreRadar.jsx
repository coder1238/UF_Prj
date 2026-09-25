import React from 'react';
import { Cpu, ShieldCheck, ChevronRight } from 'lucide-react';

export default function RouteSafetyScoreRadar({
  activeCorridor
}) {
  if (!activeCorridor || !activeCorridor.scoreBreakdown) return null;

  const score = activeCorridor.hydroGnnScore;
  const breakdown = activeCorridor.scoreBreakdown;

  const factors = [
    { label: 'Elevation Profile', value: breakdown.elevationProfile, desc: 'MSL datum & flyover deck height' },
    { label: 'Drainage Capacity', value: breakdown.drainageCapacity, desc: 'Nearby storm culvert load %' },
    { label: 'Historical Flood Free', value: breakdown.historicFloodRisk, desc: 'Past 10 years BMC waterlogging records' },
    { label: 'Emergency Access', value: breakdown.emergencyAccess, desc: 'Distance to trauma centers & staging' },
    { label: 'Flow Velocity Safety', value: breakdown.flowVelocitySafety, desc: 'Hydraulic surface water current' }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">EXPLAINABLE AI ENGINE</span>
          </div>
          <h3 className="text-sm font-extrabold text-ink">Hydro-GNN Corridor Safety Score</h3>
        </div>

        <div className="flex items-baseline gap-1 bg-primary-soft text-primary-deep px-2.5 py-1 rounded-xl">
          <span className="text-lg font-extrabold font-mono">{score}</span>
          <span className="text-[10px] font-mono font-bold">/100</span>
        </div>
      </div>

      <p className="text-xs text-ink-secondary">
        Graph Neural Network evaluated 1,420 micro-catchment nodes and tidal gate parameters along this corridor.
      </p>

      {/* 5-Factor Score Bars */}
      <div className="space-y-2 pt-1">
        {factors.map((f, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-ink">{f.label}</span>
              <span className="font-extrabold text-primary">{f.value}%</span>
            </div>

            <div className="w-full bg-canvas h-2 rounded-full overflow-hidden border border-border/60">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  f.value > 85 ? 'bg-emerald-500' : f.value > 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${f.value}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-ink-muted block">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
