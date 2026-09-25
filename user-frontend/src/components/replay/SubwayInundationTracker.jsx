import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import { SUBWAYS_DATA } from '../../data/replayData';

export default function SubwayInundationTracker({ currentStep, whatIfModifiers }) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const currentBasinDepth = currentStep.depth * depthFactor;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Subterranean Inundation Telemetry
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Subways & Underpasses Real-Time Inundation Tracker
          </h3>
        </div>
        <span className="text-xs font-mono bg-purple-soft text-purple-deep px-3 py-1 rounded-full font-bold">
          {SUBWAYS_DATA.length} Critical Underpasses Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBWAYS_DATA.map((subway) => {
          const depth = Math.round(currentBasinDepth * subway.depthMultiplier);
          const percentFull = Math.min(100, Math.round((depth / subway.maxCapacityCm) * 100));
          
          let statusBadge = {
            label: 'OPEN',
            color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            barrier: 'Barriers Open'
          };

          if (depth > 40) {
            statusBadge = {
              label: 'DROWNED - CLOSED',
              color: 'bg-red-100 text-red-800 border-red-300',
              barrier: 'Drop Gates Locked Down'
            };
          } else if (depth > 20) {
            statusBadge = {
              label: 'CAUTION',
              color: 'bg-amber-100 text-amber-800 border-amber-300',
              barrier: 'Single Lane Flume'
            };
          }

          return (
            <div 
              key={subway.id}
              className="p-4 rounded-2xl bg-canvas border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-ink">{subway.name}</h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted font-mono mt-0.5">{subway.road}</p>

                {/* Depth & Capacity Gauge */}
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                    <span className="text-muted">Water Level:</span>
                    <span className={`font-extrabold text-sm ${depth > 35 ? 'text-red-600' : 'text-slate-800'}`}>
                      {depth} cm <span className="text-[10px] font-normal text-muted">/ {subway.maxCapacityCm} cm</span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        percentFull > 60 ? 'bg-red-500' : percentFull > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentFull}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pump & Gate Info */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Pumps: {subway.pumpRating}</span>
                <span className="text-slate-700 font-semibold">{statusBadge.barrier}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

