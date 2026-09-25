import React, { useState } from 'react';
import { X, Radio, Battery, Wifi, RefreshCw } from 'lucide-react';
import { IOT_PIEZOMETERS } from './drainageConstants';

export default function PiezometerTelemetryModal({ isOpen, onClose, showToast }) {
  const [sensors, setSensors] = useState(IOT_PIEZOMETERS);
  const [calibratingId, setCalibratingId] = useState(null);

  if (!isOpen) return null;

  const handleCalibrate = (sensorId) => {
    setCalibratingId(sensorId);
    setTimeout(() => {
      setSensors((prev) =>
        prev.map((s) => (s.id === sensorId ? { ...s, lastPing: 'Just now (Zeroed)' } : s))
      );
      setCalibratingId(null);
      showToast(`Sensor ${sensorId} calibrated & baseline zeroed.`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Underground Culvert Piezometer &amp; Pressure Sensor Grid
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                  LORA-WAN TELEMETRY
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Hydrostatic Transducers &amp; Non-Contact Ultrasonic Level Gauges
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sensors.map((s) => {
              const isAlert = s.status.includes('ALERT') || s.status.includes('ALARM');
              const fillPct = Math.round((s.depthM / s.maxDepthM) * 100);
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAlert
                      ? 'bg-red-500/5 border-red-500/40 shadow-subtle'
                      : 'bg-surface-secondary border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                      <span className="text-purple">{s.id}</span>
                      <span className="text-ink-secondary">({s.node})</span>
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        isAlert ? 'bg-status-alert-soft text-status-alert' : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-ink-secondary mb-3">{s.type}</div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Water Head</span>
                      <span className={`font-bold ${isAlert ? 'text-status-alert' : 'text-ink'}`}>
                        {s.depthM.toFixed(2)}m
                      </span>
                    </div>
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Pressure</span>
                      <span className="font-bold text-purple">{s.pressureKPa} kPa</span>
                    </div>
                    <div className="bg-surface p-2 rounded-lg border border-border">
                      <span className="text-[9px] text-ink-secondary block">Capacity</span>
                      <span className="font-bold text-ink">{fillPct}%</span>
                    </div>
                  </div>

                  {/* Device health telemetry */}
                  <div className="flex items-center justify-between text-[10px] text-ink-secondary border-t border-border/60 pt-2.5">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-emerald-500" />
                      {s.batteryPct}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-blue-500" />
                      {s.loraSignalDbm} dBm
                    </span>
                    <span>Ping: {s.lastPing}</span>

                    <button
                      disabled={calibratingId === s.id}
                      onClick={() => handleCalibrate(s.id)}
                      className="px-2 py-0.5 rounded bg-surface border border-border hover:border-purple text-ink hover:text-purple text-[10px] transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${calibratingId === s.id ? 'animate-spin' : ''}`} />
                      <span>{calibratingId === s.id ? 'Zeroing...' : 'Zero Cal'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Gateway: <strong>BMC Central LoRaWAN Repeater #04 (Worli Tower)</strong>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Telemetry Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

