import React, { useState } from 'react';
import { Car, AlertTriangle, Truck, CheckCircle2, ShieldAlert, Navigation, ArrowUpRight } from 'lucide-react';

export default function CCTVVehicleTracker({
  vehicles = [],
  currentDepth = 28,
  onDispatchTow,
}) {
  const [dispatchedIds, setDispatchedIds] = useState([]);

  const handleTow = (v) => {
    setDispatchedIds((prev) => [...prev, v.id]);
    if (onDispatchTow) {
      onDispatchTow(v);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-purple" />
          <h3 className="text-sm font-bold text-ink">
            Vehicle Inundation & Stall Hazards
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-amber-soft text-status-amber font-semibold">
          {vehicles.filter((v) => v.status === 'STALLED').length} IMMOBILIZED
        </span>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
        {vehicles.map((v) => {
          const isStalled = v.status === 'STALLED';
          const isDispatched = dispatchedIds.includes(v.id);
          const clearanceRisk = v.clearanceCm <= currentDepth;

          return (
            <div
              key={v.id}
              className={`p-3 rounded-xl border transition-all ${
                isStalled
                  ? 'border-status-alert/50 bg-status-alert/5'
                  : clearanceRisk
                  ? 'border-status-amber/40 bg-status-amber/5'
                  : 'border-border bg-surface-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {v.type === 'BUS' ? '🚌' : v.type === 'AUTO' ? '🛺' : v.type === 'BIKE' ? '🛵' : '🚗'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <span>{v.plate}</span>
                      <span className="text-[10px] font-normal text-ink-secondary">({v.type})</span>
                    </div>
                    <div className="text-[10px] text-ink-muted">
                      Air Intake Height: {v.clearanceCm} cm • Est. Speed: {v.speed} km/h
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isStalled ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert text-white font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      HYDRO-LOCKED
                    </span>
                  ) : clearanceRisk ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 font-bold">
                      HIGH RISK
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700">
                      TRAVERSABLE
                    </span>
                  )}
                </div>
              </div>

              {/* Action row for stalled vehicles */}
              {isStalled && (
                <div className="mt-2.5 pt-2 border-t border-status-alert/20 flex items-center justify-between">
                  <div className="text-[10px] text-status-alert font-medium">
                    Engine stalled in water. Blocking underpass lane 2.
                  </div>
                  {isDispatched ? (
                    <span className="text-[10px] font-bold text-status-safe bg-status-safe-soft px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      TOW TRUCK DISPATCHED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTow(v)}
                      className="px-2.5 py-1 bg-status-alert text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Truck className="w-3 h-3" />
                      Dispatch MCGM Tow Crane
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

