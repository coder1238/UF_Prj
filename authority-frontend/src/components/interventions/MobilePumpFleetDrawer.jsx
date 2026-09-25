import React, { useState } from 'react';
import { X, Wrench, Fuel, Gauge, Zap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { MOBILE_PUMP_FLEET_DATA } from './interventionConstants';

export default function MobilePumpFleetDrawer({ isOpen, onClose }) {
  const [fleet, setFleet] = useState(MOBILE_PUMP_FLEET_DATA);
  const [actionNotice, setActionNotice] = useState(null);

  if (!isOpen) return null;

  const handleToggleOverdrive = (pumpId) => {
    setFleet((prev) =>
      prev.map((p) => {
        if (p.id === pumpId) {
          const nextOverdrive = !p.overdrive;
          const boost = nextOverdrive ? 1.15 : 1.0;
          return {
            ...p,
            overdrive: nextOverdrive,
            rpm: nextOverdrive ? Math.round(p.rpm * 1.1) : 1750,
            flowRateM3h: Math.round((nextOverdrive ? 2070 : 1800)),
            status: nextOverdrive ? 'EMERGENCY OVERDRIVE (115%)' : 'RUNNING (92% LOAD)',
          };
        }
        return p;
      })
    );
    setActionNotice(`Pump ${pumpId} overdrive toggled.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRefuel = (pumpId) => {
    setFleet((prev) =>
      prev.map((p) => (p.id === pumpId ? { ...p, fuelPercent: 100 } : p))
    );
    setActionNotice(`Fuel bowser dispatched. Pump ${pumpId} refueled to 100%.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleTogglePower = (pumpId) => {
    setFleet((prev) =>
      prev.map((p) => {
        if (p.id === pumpId) {
          const isRunning = p.status.includes('RUNNING') || p.status.includes('OVERDRIVE');
          return {
            ...p,
            status: isRunning ? 'IDLE / ENGINE HALTED' : 'RUNNING (NORMAL LOAD)',
            rpm: isRunning ? 0 : 1750,
            flowRateM3h: isRunning ? 0 : 1800,
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border-l border-border w-full max-w-xl h-full shadow-elevated overflow-hidden flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Mobile Dewatering Pump Fleet Telemetry
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Live CAN-bus engine monitoring, fuel burn rates, and suction head.
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

        {/* Action toast */}
        {actionNotice && (
          <div className="px-4 py-2 bg-purple text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {actionNotice}
          </div>
        )}

        {/* Fleet List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5">
          {fleet.map((pump) => {
            const isRunning = pump.status.includes('RUNNING') || pump.status.includes('OVERDRIVE');

            return (
              <div
                key={pump.id}
                className="p-4 rounded-xl border border-border bg-white shadow-subtle hover:border-purple/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink font-semibold">
                      {pump.ward} • {pump.model}
                    </span>
                    <h4 className="text-xs font-bold text-ink mt-1">{pump.name}</h4>
                    <div className="text-[11px] text-ink-secondary mt-0.5">
                      Position: <strong className="text-ink">{pump.currentLocation}</strong>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      pump.overdrive
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : isRunning
                        ? 'bg-status-safe-soft text-status-safe'
                        : 'bg-surface-secondary text-ink-secondary'
                    }`}
                  >
                    {pump.status}
                  </span>
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-4 gap-2 my-3 p-2.5 bg-surface-secondary rounded-lg text-center font-mono text-[11px]">
                  <div>
                    <div className="text-[10px] text-ink-secondary flex items-center justify-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-500" />
                      <span>Fuel</span>
                    </div>
                    <div className="font-bold text-ink mt-0.5">{pump.fuelPercent}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">Engine</div>
                    <div className="font-bold text-ink mt-0.5">{pump.rpm} RPM</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">Discharge</div>
                    <div className="font-bold text-purple mt-0.5">{pump.flowRateM3h} m³/h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">Suction Lift</div>
                    <div className="font-bold text-ink mt-0.5">{pump.suctionLiftM} m</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleOverdrive(pump.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        pump.overdrive
                          ? 'bg-amber-600 text-white shadow-subtle'
                          : 'bg-surface-secondary text-ink hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>{pump.overdrive ? 'Overdrive ON' : 'Engage 115% Boost'}</span>
                    </button>

                    <button
                      onClick={() => handleRefuel(pump.id)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-surface-secondary text-ink hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Fuel className="w-3 h-3" />
                      <span>Refuel Unit</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleTogglePower(pump.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      isRunning
                        ? 'bg-status-alert text-white hover:bg-status-alert/90'
                        : 'bg-purple text-white hover:bg-purple-deep'
                    }`}
                  >
                    {isRunning ? 'Stop Pump' : 'Start Pump'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs text-ink-secondary">
          <span>Telemetry feeds synchronized via LoRaWAN 865 MHz telemetry gateway.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

