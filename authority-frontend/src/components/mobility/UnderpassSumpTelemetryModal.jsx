import React, { useState } from 'react';
import { X, Gauge, AlertTriangle, ShieldCheck, Power, RefreshCw, Zap } from 'lucide-react';
import { UNDERPASS_SUMPS } from './mobilityConstants';

export default function UnderpassSumpTelemetryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [sumps, setSumps] = useState(UNDERPASS_SUMPS);
  const [selectedSump, setSelectedSump] = useState(UNDERPASS_SUMPS[0]);
  const [toast, setToast] = useState(null);

  const togglePump = (sumpId) => {
    setSumps((prev) =>
      prev.map((s) => {
        if (s.id === sumpId) {
          const nextActive = s.activePumps < s.totalPumps ? s.activePumps + 1 : 1;
          return { ...s, activePumps: nextActive };
        }
        return s;
      })
    );
    setToast(`SCADA Command: Pump stage toggled for ${sumpId}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleGate = (sumpId) => {
    setSumps((prev) =>
      prev.map((s) => {
        if (s.id === sumpId) {
          const nextGate = s.gateStatus.includes('CLOSED') ? 'OPEN' : 'CLOSED';
          return { ...s, gateStatus: nextGate };
        }
        return s;
      })
    );
    setToast(`Hydraulic Barrier: Gate toggled for ${sumpId}.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Subway &amp; Underpass Sump Telemetry Console
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-alert-soft text-status-alert">
                  SCADA Live
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Ultrasonic water depth probes, automated hydraulic floodgates, and dewatering pump arrays
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {toast && (
            <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono">
              {toast}
            </div>
          )}

          {/* Sump Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sumps.map((sump) => {
              const isOverThreshold = sump.waterDepthCm >= sump.dangerThresholdCm;
              return (
                <div
                  key={sump.id}
                  onClick={() => setSelectedSump(sump)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedSump.id === sump.id
                      ? 'border-purple shadow-elevated bg-purple-soft/20'
                      : isOverThreshold
                      ? 'border-status-alert/40 bg-status-alert-soft/20'
                      : 'border-border bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink">{sump.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isOverThreshold ? 'bg-status-alert text-white' : 'bg-status-safe text-white'
                      }`}
                    >
                      {sump.waterDepthCm} cm
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-ink-muted">{sump.ward} • {sump.lastUpdated}</span>

                  {/* Water Depth Level Indicator */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-ink-secondary">Water Level:</span>
                      <span className={`font-mono font-bold ${isOverThreshold ? 'text-status-alert' : 'text-status-safe'}`}>
                        {sump.waterDepthCm} / {sump.dangerThresholdCm} cm (Threshold)
                      </span>
                    </div>
                    <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden border border-border">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isOverThreshold ? 'bg-status-alert' : 'bg-status-safe'
                        }`}
                        style={{ width: `${Math.min(100, (sump.waterDepthCm / 60) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pump & Gate Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/60">
                    <div>
                      <span className="text-ink-muted block text-[10px]">Active Pumps</span>
                      <span className="font-semibold text-ink">
                        {sump.activePumps} / {sump.totalPumps} ({sump.pumpCapacityLps} L/s)
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px]">Barrier Gate</span>
                      <span className={`font-semibold ${sump.gateStatus.includes('CLOSED') ? 'text-status-alert' : 'text-status-safe'}`}>
                        {sump.gateStatus}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex gap-2 pt-2 border-t border-border/40">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePump(sump.id);
                      }}
                      className="flex-1 py-1.5 px-2 bg-surface-secondary hover:bg-surface border border-border rounded-lg text-[10px] font-semibold text-ink flex items-center justify-center gap-1"
                    >
                      <Power className="w-3 h-3 text-purple" /> Cycle Pump
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGate(sump.id);
                      }}
                      className="flex-1 py-1.5 px-2 bg-surface-secondary hover:bg-surface border border-border rounded-lg text-[10px] font-semibold text-ink flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-status-warning" /> Toggle Gate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Sump Detailed Sensor Telemetry */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-ink block">
              Direct SCADA Sensor Readout &bull; {selectedSump.name}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-surface rounded-lg border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Ultrasonic Echo Sensor</span>
                <span className="text-sm font-mono font-bold text-ink">{selectedSump.sensors.ultrasonic} cm</span>
                <span className="text-[10px] text-status-safe block mt-0.5">Calibrated &bull; +/-0.2%</span>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Hydrostatic Pressure</span>
                <span className="text-sm font-mono font-bold text-ink">{selectedSump.sensors.hydroPressure} cm</span>
                <span className="text-[10px] text-status-safe block mt-0.5">Dual-sensor crosscheck OK</span>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Sump Silt Accumulation</span>
                <span className="text-sm font-mono font-bold text-ink">{selectedSump.sensors.siltLevelCm} cm</span>
                <span className="text-[10px] text-ink-secondary block mt-0.5">Desilt threshold 25cm</span>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Warning Beacon</span>
                <span className="text-sm font-mono font-bold text-status-alert">{selectedSump.flashingBeacon}</span>
                <span className="text-[10px] text-ink-secondary block mt-0.5">VMS Diversion Linked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            Telemetry connected to MCGM Stormwater Drainage (SWD) Department Central Telemetry Node.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}

