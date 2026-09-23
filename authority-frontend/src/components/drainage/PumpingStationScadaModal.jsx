import React, { useState } from 'react';
import { X, Gauge, Zap, Flame, Sliders, Play, Square } from 'lucide-react';
import { BMC_PUMPING_STATIONS } from './drainageConstants';

export default function PumpingStationScadaModal({ isOpen, onClose, onBoostStation, showToast }) {
  const [stations, setStations] = useState(BMC_PUMPING_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState(BMC_PUMPING_STATIONS[0].id);

  if (!isOpen) return null;

  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  const handleTogglePump = (stationId, pumpId) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id !== stationId) return st;
        const updatedPumps = st.pumps.map((p) => {
          if (p.id !== pumpId) return p;
          const isRunning = p.status === 'RUNNING';
          return {
            ...p,
            status: isRunning ? 'STANDBY READY' : 'RUNNING',
            rpm: isRunning ? 0 : 740,
            hz: isRunning ? 0 : 50,
            flowM3h: isRunning ? 0 : 6000,
          };
        });
        const runningCount = updatedPumps.filter((p) => p.status === 'RUNNING').length;
        const newDischarge = updatedPumps.reduce((acc, p) => acc + p.flowM3h, 0);
        return {
          ...st,
          pumps: updatedPumps,
          runningPumps: runningCount,
          dischargeRate: newDischarge,
          currentLoadPct: Math.round((newDischarge / (parseInt(st.ratedCapacity) || 36000)) * 100),
        };
      })
    );
    showToast(`Toggled ${pumpId} on ${activeStation.name}`);
  };

  const handleVfdChange = (stationId, newHz) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id !== stationId) return st;
        const ratio = newHz / 50.0;
        const updatedPumps = st.pumps.map((p) =>
          p.status === 'RUNNING'
            ? {
                ...p,
                hz: newHz,
                rpm: Math.round(740 * ratio),
                flowM3h: Math.round(6000 * ratio),
              }
            : p
        );
        const newDischarge = updatedPumps.reduce((acc, p) => acc + p.flowM3h, 0);
        return {
          ...st,
          vfdFrequencyHz: newHz,
          pumps: updatedPumps,
          dischargeRate: newDischarge,
        };
      })
    );
  };

  const handleEmergencyOverdrive = (stationId) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id !== stationId) return st;
        const boostedPumps = st.pumps.map((p) => ({
          ...p,
          status: 'RUNNING',
          hz: 55,
          rpm: 810,
          flowM3h: 6800,
          tempC: 68,
        }));
        return {
          ...st,
          status: 'EMERGENCY OVERDRIVE (115%)',
          runningPumps: st.totalPumps,
          dischargeRate: boostedPumps.reduce((acc, p) => acc + p.flowM3h, 0),
          currentLoadPct: 115,
          vfdFrequencyHz: 55.0,
          pumps: boostedPumps,
        };
      })
    );
    if (onBoostStation) onBoostStation(stationId);
    showToast(`EMERGENCY BOOST ENGAGED: ${activeStation.name} running at 115% Overdrive!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Stormwater Pumping Stations SCADA Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                  IEC 60870-5-104 PROTOCOL
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Centralized High-Discharge Submersible & Axial Dewatering Telemetry
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Station Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {stations.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStationId(st.id)}
                className={`px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all text-xs font-mono ${
                  selectedStationId === st.id
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">{st.name.split(' Stormwater')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-canvas border border-border">
                    {st.runningPumps}/{st.totalPumps}
                  </span>
                </div>
                <div className="text-[10px] text-ink-secondary mt-0.5">
                  {st.dischargeRate.toLocaleString()} m³/hr ({st.currentLoadPct}%)
                </div>
              </button>
            ))}
          </div>

          {/* Active Station Overview Banner */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-ink text-sm">{activeStation.name}</span>
                <span className="px-2 py-0.5 rounded bg-purple-soft text-purple text-[10px]">{activeStation.ward}</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 text-[10px]">{activeStation.outfall}</span>
              </div>
              <p className="text-xs text-ink-secondary mt-1">
                Power: {activeStation.powerSource} • Fuel Buffer: <span className="text-emerald-500 font-bold">{activeStation.fuelBufferHours} hrs</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-[10px] uppercase text-ink-secondary block">Wet-Well Sump Level</span>
                <span className="text-lg font-bold text-ink">
                  {activeStation.wetWellDepthM}m / {activeStation.maxWetWellM}m
                </span>
              </div>
              <button
                onClick={() => handleEmergencyOverdrive(activeStation.id)}
                className="px-3.5 py-2 rounded-xl bg-status-alert text-white hover:bg-red-600 text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Flame className="w-4 h-4" />
                <span>Trigger Emergency Overdrive</span>
              </button>
            </div>
          </div>

          {/* Master VFD Frequency Slider */}
          <div className="bg-canvas border border-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Sliders className="w-4 h-4 text-purple" />
              <span className="text-ink font-semibold">Master VFD Frequency Inverter:</span>
              <span className="text-purple font-bold text-sm">{activeStation.vfdFrequencyHz} Hz</span>
            </div>
            <div className="w-full sm:w-72 flex items-center gap-3">
              <span className="text-[10px] font-mono text-ink-secondary">30 Hz</span>
              <input
                type="range"
                min="35"
                max="55"
                step="0.5"
                value={activeStation.vfdFrequencyHz}
                onChange={(e) => handleVfdChange(activeStation.id, parseFloat(e.target.value))}
                className="flex-1 accent-purple cursor-pointer"
              />
              <span className="text-[10px] font-mono text-ink-secondary">55 Hz</span>
            </div>
          </div>

          {/* Individual Pump Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeStation.pumps.map((pump) => {
              const isRunning = pump.status === 'RUNNING';
              return (
                <div
                  key={pump.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isRunning
                      ? 'bg-surface-secondary border-purple/40 shadow-subtle'
                      : 'bg-surface-secondary/40 border-border opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-ink flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isRunning ? 'text-amber-500' : 'text-ink-secondary'}`} />
                      Unit {pump.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isRunning ? 'bg-emerald-500/20 text-emerald-500' : 'bg-canvas text-ink-secondary'
                      }`}
                    >
                      {pump.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3">
                    <div className="bg-canvas p-1.5 rounded border border-border">
                      <span className="text-[9px] text-ink-secondary block">Speed / Hz</span>
                      <span className="font-bold text-ink">{pump.rpm} RPM ({pump.hz}Hz)</span>
                    </div>
                    <div className="bg-canvas p-1.5 rounded border border-border">
                      <span className="text-[9px] text-ink-secondary block">Discharge</span>
                      <span className="font-bold text-purple">{pump.flowM3h} m³/h</span>
                    </div>
                    <div className="bg-canvas p-1.5 rounded border border-border">
                      <span className="text-[9px] text-ink-secondary block">Winding Temp</span>
                      <span className={`font-bold ${pump.tempC > 65 ? 'text-status-alert' : 'text-ink'}`}>
                        {pump.tempC}°C
                      </span>
                    </div>
                    <div className="bg-canvas p-1.5 rounded border border-border">
                      <span className="text-[9px] text-ink-secondary block">Vibration</span>
                      <span className="font-bold text-ink">{pump.vibrationMmS} mm/s</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePump(activeStation.id, pump.id)}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isRunning
                        ? 'bg-status-alert-soft text-status-alert hover:bg-status-alert hover:text-white'
                        : 'bg-purple-soft text-purple hover:bg-purple hover:text-white'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Halt Unit</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Pump</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Cumulative Municipal Dewatering Output:{' '}
            <strong className="text-purple">
              {stations.reduce((acc, s) => acc + s.dischargeRate, 0).toLocaleString()} m³/hr
            </strong>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close SCADA Console
          </button>
        </div>
      </div>
    </div>
  );
}

