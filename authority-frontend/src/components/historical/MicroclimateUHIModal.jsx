import React, { useState } from 'react';
import { X, Thermometer } from 'lucide-react';

export default function MicroclimateUHIModal({ isOpen, onClose }) {
  const [selectedStation, setSelectedStation] = useState('kurla');

  if (!isOpen) return null;

  const MICROCLIMATE_NODES = {
    kurla: {
      name: 'Kurla - BKC Industrial Corridor',
      uhiAnomalyC: '+4.2°C',
      surfaceTempC: 34.8,
      rhPct: 82,
      capeJkg: 2680,
      convectiveTriggerProbability: '88% (Severe)',
      mechanism: 'Dense glass facade and concrete thermal plume creates localized vertical updraft convergence zone triggering evening thunder cells.',
    },
    chembur: {
      name: 'Chembur - Trombay Thermal Belt',
      uhiAnomalyC: '+3.9°C',
      surfaceTempC: 34.2,
      rhPct: 84,
      capeJkg: 2420,
      convectiveTriggerProbability: '82% (High)',
      mechanism: 'Industrial thermal emissions meet moist Arabian Sea breeze over Mahul creek, forcing rapid meso-scale cloud column formation.',
    },
    powai: {
      name: 'Powai - Vikhroli Valley Basin',
      uhiAnomalyC: '+2.8°C',
      surfaceTempC: 32.6,
      rhPct: 86,
      capeJkg: 2150,
      convectiveTriggerProbability: '74% (Moderate)',
      mechanism: 'Orographic lift against Powai hills combined with lake moisture feedback intensifies passing monsoon squalls.',
    },
    colaba: {
      name: 'Colaba Coastal Maritime Baseline',
      uhiAnomalyC: '+0.6°C',
      surfaceTempC: 30.2,
      rhPct: 88,
      capeJkg: 1450,
      convectiveTriggerProbability: '35% (Low)',
      mechanism: 'Constant oceanic breeze dissipation prevents excessive thermal bubble accumulation.',
    }
  };

  const current = MICROCLIMATE_NODES[selectedStation];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Microclimate &amp; Urban Heat Island (UHI) Precipitation Trigger Forensics
              </h2>
              <p className="text-xs text-ink-secondary">
                Sea-Breeze Moisture Convergence, Canopy Thermal Plumes &amp; Convective Cloudburst Generation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Select */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {Object.keys(MICROCLIMATE_NODES).map(k => (
            <button
              key={k}
              onClick={() => setSelectedStation(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                selectedStation === k
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {MICROCLIMATE_NODES[k].name.split(' - ')[0]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Station Metrics */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-sm font-bold text-ink">{current.name}</h3>
              <span className="text-xs font-mono font-bold text-status-alert bg-status-alert-soft px-2.5 py-1 rounded">
                Cloudburst Trigger Risk: {current.convectiveTriggerProbability}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-surface rounded-lg border border-border">
                <span className="text-ink-secondary text-[10px]">UHI Thermal Anomaly</span>
                <div className="text-xl font-bold text-status-alert mt-0.5">{current.uhiAnomalyC}</div>
                <span className="text-[10px] text-ink-secondary">Over maritime base</span>
              </div>
              <div className="p-2.5 bg-surface rounded-lg border border-border">
                <span className="text-ink-secondary text-[10px]">Surface Skin Temp</span>
                <div className="text-xl font-bold text-ink mt-0.5">{current.surfaceTempC}°C</div>
                <span className="text-[10px] text-ink-secondary">Thermal IR Sensor</span>
              </div>
              <div className="p-2.5 bg-surface rounded-lg border border-border">
                <span className="text-ink-secondary text-[10px]">Relative Humidity</span>
                <div className="text-xl font-bold text-purple mt-0.5">{current.rhPct}%</div>
                <span className="text-[10px] text-ink-secondary">Boundary Layer Moisture</span>
              </div>
              <div className="p-2.5 bg-surface rounded-lg border border-border">
                <span className="text-ink-secondary text-[10px]">Atmospheric CAPE</span>
                <div className="text-xl font-bold text-status-safe mt-0.5">{current.capeJkg} J/kg</div>
                <span className="text-[10px] text-ink-secondary">Convective Energy</span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-lg border border-border text-xs leading-relaxed">
              <span className="font-bold text-ink block font-mono text-[11px] mb-1">Convective Genesis Mechanism:</span>
              <p className="text-ink-secondary">{current.mechanism}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Sensors: INSAT-3D Thermal Radiometer &amp; Dense IoT Weather Network</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
