import React, { useState } from 'react';
import { X, Gauge, CheckCircle2 } from 'lucide-react';
import { PUMPING_STATIONS_ARCHIVE } from './historicalConstants';

export default function PumpingTelemetryArchiveModal({ isOpen, onClose }) {
  const [selectedStationId, setSelectedStationId] = useState('britannia');

  if (!isOpen) return null;

  const currentStation = PUMPING_STATIONS_ARCHIVE.find(s => s.id === selectedStationId) || PUMPING_STATIONS_ARCHIVE[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Stormwater Pumping Station SCADA Historical Telemetry Archive
              </h2>
              <p className="text-xs text-ink-secondary">
                Municipal Outfall Lift Operations, Turbine Generator Logs &amp; Tidal Backpressure Efficiency (7 Major Stations)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Selector Tabs */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {PUMPING_STATIONS_ARCHIVE.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStationId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                selectedStationId === s.id
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {s.name.split(' ')[0]} ({s.capacityM3s} m³/s)
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Station Overview Banner */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">{currentStation.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {currentStation.status}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                Commissioned {currentStation.commissioned} • Catchment Area: {currentStation.catchmentAreaHa} Hectares • Outfall: {currentStation.dischargeOutfall}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple bg-purple-soft px-3 py-1.5 rounded-lg border border-purple/30">
                Outfall: {currentStation.outfallGateStatus}
              </span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-ink-secondary">Total Design Discharge</span>
              <span className="text-2xl font-bold font-mono text-purple">{currentStation.capacityM3s} m³/s</span>
              <span className="text-[10px] text-ink-secondary font-mono">{currentStation.pumpUnits} Heavy Axial Pump Units</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-ink-secondary">Historical Operating Hours</span>
              <span className="text-2xl font-bold font-mono text-ink">{currentStation.totalHistoricalHoursRun.toLocaleString()} hrs</span>
              <span className="text-[10px] text-purple font-mono">10-Year Cumulative Run</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-ink-secondary">Annual HSD Diesel Burn</span>
              <span className="text-2xl font-bold font-mono text-status-warning">{currentStation.annualFuelConsumedKL} kL</span>
              <span className="text-[10px] text-ink-secondary font-mono">{currentStation.dieselGenerators} Emergency DG Sets</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-ink-secondary">Hydraulic Operating Efficiency</span>
              <span className="text-2xl font-bold font-mono text-status-safe">{currentStation.efficiencyPct}%</span>
              <span className="text-[10px] text-ink-secondary font-mono">Last Overhaul: {currentStation.lastMajorOverhaul}</span>
            </div>
          </div>

          {/* Hourly Pump Staging Log Simulation During Peak Monsoons */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Storm SCADA Automated Staging Sequence (29 Aug 2025 Event Replay)
            </h4>
            <div className="space-y-2">
              {[
                { time: '13:45 IST', activeUnits: '2 / ' + currentStation.pumpUnits, powerSource: 'Grid Power (BEST/Adani)', sumpLevelM: '1.45m', dischargeM3s: (currentStation.capacityM3s * 0.33).toFixed(1), notes: 'Initial dry weather sump clearance' },
                { time: '14:20 IST', activeUnits: '4 / ' + currentStation.pumpUnits, powerSource: 'Grid + 1x DG Set', sumpLevelM: '2.80m', dischargeM3s: (currentStation.capacityM3s * 0.66).toFixed(1), notes: 'Cloudburst inflow detected; auto-start pump 3 & 4' },
                { time: '15:10 IST', activeUnits: currentStation.pumpUnits + ' / ' + currentStation.pumpUnits, powerSource: 'Full Diesel Turbine Backup', sumpLevelM: '3.65m', dischargeM3s: currentStation.capacityM3s.toFixed(1), notes: 'High tide 4.4m shuts gravity gates; 100% duty cycle against 4.8m total dynamic head' },
                { time: '17:00 IST', activeUnits: '3 / ' + currentStation.pumpUnits, powerSource: 'Grid Power Restored', sumpLevelM: '1.90m', dischargeM3s: (currentStation.capacityM3s * 0.50).toFixed(1), notes: 'Sump water level dropping; step-down pump throttling' },
              ].map((log, i) => (
                <div key={i} className="p-3 bg-surface-secondary border border-border rounded-lg text-xs font-mono flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple">{log.time}</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-ink font-bold">
                      {log.activeUnits} Units
                    </span>
                    <span className="text-ink-secondary text-[11px]">{log.powerSource}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Sump: <strong className="text-ink">{log.sumpLevelM}</strong></span>
                    <span>Discharge: <strong className="text-status-safe">{log.dischargeM3s} m³/s</strong></span>
                    <span className="text-ink-secondary hidden lg:inline">{log.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">SCADA Protocol: Modbus TCP/IP &amp; IEC 60870-5-104 Telemetry</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
}
