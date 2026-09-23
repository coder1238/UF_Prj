import React from 'react';
import { Navigation, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { EVACUATION_CORRIDORS } from '../../data/replayData';

export default function CorridorAccessChecker({ currentStep, whatIfModifiers }) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const currentDepth = currentStep.depth * depthFactor;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Navigation className="w-4 h-4" /> Strategic Arterials
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Arterial Evacuation Corridors Clearance Status
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EVACUATION_CORRIDORS.map(corridor => {
          const isChoked = currentDepth >= corridor.criticalChokeDepthCm;
          const isDelayed = currentDepth > 15 && !isChoked;

          let badge = {
            label: 'CLEAR & PASSABLE',
            color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
          };

          if (isChoked) {
            badge = {
              label: 'BLOCKED / SUBMERGED',
              color: 'bg-red-100 text-red-800 border-red-300'
            };
          } else if (isDelayed) {
            badge = {
              label: 'CONGESTED (+25m DELAY)',
              color: 'bg-amber-100 text-amber-800 border-amber-300'
            };
          }

          return (
            <div 
              key={corridor.id}
              className={`p-4 rounded-2xl border transition-all ${
                isChoked ? 'bg-red-50/40 border-red-200' : 'bg-canvas border-slate-200/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-ink">{corridor.name}</h4>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shrink-0 ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-muted mt-2">
                <span>Length: {corridor.lengthKm} km</span>
                <span>Normal: {corridor.normalTravelMins} mins</span>
                <span>Choke Limit: {corridor.criticalChokeDepthCm} cm</span>
              </div>

              {isChoked && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-100/70 border border-red-200 text-xs text-red-900 font-sans flex items-center justify-between">
                  <span><strong>Diversion:</strong> Take {corridor.alternativeRoute}</span>
                  <ArrowRight className="w-4 h-4 text-red-700 shrink-0" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

