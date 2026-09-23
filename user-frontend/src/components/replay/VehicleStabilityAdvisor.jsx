import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Car, Bike, Truck, Bus } from 'lucide-react';
import { VEHICLE_HYDRO_SPECS } from '../../data/replayData';

export default function VehicleStabilityAdvisor({ currentStep, whatIfModifiers }) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const currentDepth = Math.round(currentStep.depth * depthFactor);
  const velocity = currentStep.flowVelocity || 1.0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Hydrodynamic Vehicle Physics
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Buoyancy & Lateral Sweeping Risk at {currentDepth} cm Depth ({velocity} m/s)
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {VEHICLE_HYDRO_SPECS.map(spec => {
          const isStalled = currentDepth >= spec.exhaustHeightCm;
          const isFloated = currentDepth >= spec.flotationDepthCm;
          const isSwept = isFloated || (currentDepth > spec.exhaustHeightCm && velocity >= spec.criticalVelocityMs);

          let status = {
            label: 'SAFE',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            desc: 'Sub-clearance transit permitted'
          };

          if (isSwept) {
            status = {
              label: 'SWEPT / CAPSIZING',
              badgeBg: 'bg-red-600 text-white border-red-700 animate-pulse',
              desc: 'High velocity lateral drag risk'
            };
          } else if (isFloated) {
            status = {
              label: 'BUOYANT FLOAT',
              badgeBg: 'bg-red-500 text-white border-red-600',
              desc: 'Tires lose road traction'
            };
          } else if (isStalled) {
            status = {
              label: 'ENGINE HYDRO-LOCK',
              badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
              desc: 'Exhaust/intake submergence'
            };
          }

          const ratio = Math.min(100, Math.round((currentDepth / spec.flotationDepthCm) * 100));

          return (
            <div 
              key={spec.id} 
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isFloated ? 'bg-red-50/50 border-red-200' : 'bg-canvas border-slate-200/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-ink truncate">{spec.name}</span>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border block text-center mb-3 ${status.badgeBg}`}>
                  {status.label}
                </span>

                <div className="text-[11px] font-mono space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Exhaust Level:</span>
                    <span className="font-bold">{spec.exhaustHeightCm} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Float Threshold:</span>
                    <span className="font-bold text-red-600">{spec.flotationDepthCm} cm</span>
                  </div>
                </div>

                {/* Progress bar to float */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${ratio >= 100 ? 'bg-red-600' : ratio > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-muted text-right block mt-1">
                    {ratio}% of float limit
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-muted italic mt-3 pt-2 border-t border-slate-200/60 leading-tight">
                {spec.advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

