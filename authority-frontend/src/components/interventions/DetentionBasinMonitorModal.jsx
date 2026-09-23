import React, { useState } from 'react';
import { X, Droplets, CheckCircle2, AlertTriangle, Play, Pause, RefreshCw } from 'lucide-react';
import { DETENTION_BASINS_DATA } from './interventionConstants';

export default function DetentionBasinMonitorModal({ isOpen, onClose }) {
  const [basins, setBasins] = useState(DETENTION_BASINS_DATA);

  if (!isOpen) return null;

  const handleTogglePumping = (basinId) => {
    setBasins((prev) =>
      prev.map((b) => {
        if (b.id === basinId) {
          const isAccelerated = b.outflowPumpM3s > 2.0;
          return {
            ...b,
            outflowPumpM3s: isAccelerated ? 1.0 : 3.5,
            headRoomMin: isAccelerated ? 45 : 110,
            status: isAccelerated ? 'NORMAL EVACUATION' : 'TURBO PUMP-DOWN (3.5 m³/s)',
          };
        }
        return b;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Municipal Detention Basins & Underground Retention Budget
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Volumetric telemetry for stormwater retention buffers across low-lying sumps.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {basins.map((basin) => (
            <div
              key={basin.id}
              className="p-4 rounded-xl border border-border bg-white shadow-subtle hover:border-purple/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink">{basin.name}</h4>
                  <div className="text-[11px] text-ink-secondary">{basin.location}</div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    basin.fillPercent > 70
                      ? 'bg-status-alert-soft text-status-alert'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {basin.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-ink-secondary">
                    Stored: <strong>{basin.currentStoredM3.toLocaleString()} m³</strong> / {basin.maxCapacityM3.toLocaleString()} m³
                  </span>
                  <span className="font-bold text-purple">{basin.fillPercent}% Full</span>
                </div>
                <div className="w-full bg-surface-secondary rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      basin.fillPercent > 70 ? 'bg-status-alert' : 'bg-purple'
                    }`}
                    style={{ width: `${basin.fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Inflow vs Outflow */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2 bg-surface-secondary rounded-lg">
                <div>
                  <span className="text-[10px] text-ink-secondary block">Trunk Inflow</span>
                  <strong className="text-ink mt-0.5 block">{basin.inflowM3s} m³/s</strong>
                </div>
                <div>
                  <span className="text-[10px] text-ink-secondary block">Pump Outflow</span>
                  <strong className="text-status-safe mt-0.5 block">{basin.outflowPumpM3s} m³/s</strong>
                </div>
                <div>
                  <span className="text-[10px] text-ink-secondary block">Overflow Buffer</span>
                  <strong className="text-purple mt-0.5 block">~{basin.headRoomMin} min</strong>
                </div>
              </div>

              {/* Control button */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-ink-secondary text-[11px]">
                  Underground holding tank prevents surface runoff choking rail culverts.
                </span>
                <button
                  onClick={() => handleTogglePumping(basin.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    basin.outflowPumpM3s > 2.0
                      ? 'bg-amber-600 text-white'
                      : 'bg-purple text-white hover:bg-purple-deep'
                  }`}
                >
                  {basin.outflowPumpM3s > 2.0 ? 'Throttle Evacuation' : 'Turbo Pump-Out (3.5 m³/s)'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            SCADA ultrasonic level sensors verified 2 minutes ago.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

