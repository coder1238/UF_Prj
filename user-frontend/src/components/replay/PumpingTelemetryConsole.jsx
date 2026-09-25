import React from 'react';
import { Gauge, Fuel, Zap, Activity, Waves } from 'lucide-react';
import { PUMPING_STATIONS } from '../../data/replayData';

export default function PumpingTelemetryConsole({ currentStep, whatIfModifiers }) {
  const isBoost = whatIfModifiers?.pumpBoostActive;
  const activeTurbinesBase = currentStep.activeTurbines || 6;
  const activeTurbines = isBoost ? Math.min(12, Math.round(activeTurbinesBase * 1.5)) : activeTurbinesBase;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Gauge className="w-4 h-4" /> Heavy Dewatering Infrastructure
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Shoreline Pumping Station Operational Fleet
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" /> Total Active: {activeTurbines} Turbines
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PUMPING_STATIONS.map((station, idx) => {
          const stationActiveTurbines = Math.min(
            station.turbines, 
            Math.max(1, Math.round((activeTurbines / 12) * station.turbines))
          );
          const activePercent = Math.round((stationActiveTurbines / station.turbines) * 100);

          return (
            <div 
              key={station.id}
              className="p-4 rounded-2xl bg-canvas border border-slate-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-ink">{station.name}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800">
                    {stationActiveTurbines}/{station.turbines} Running
                  </span>
                </div>
                <div className="text-[11px] text-muted font-mono mt-0.5">{station.location}</div>

                {/* Turbine status progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-muted">Duty Cycle:</span>
                    <span className="font-bold text-ink">{activePercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${activePercent > 75 ? 'bg-purple-600' : activePercent > 40 ? 'bg-cyan-500' : 'bg-slate-400'}`}
                      style={{ width: `${activePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Discharge Rate:</span>
                    <span className="font-bold text-purple-700">{station.totalCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outfall Basin:</span>
                    <span>{station.outfall}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-amber-500" /> {station.fuelReserves}
                </span>
                <span className="text-emerald-700 font-bold">Synchronized Genset</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

