import React, { useState } from 'react';
import { X, Waves } from 'lucide-react';
import { WATER_QUALITY_ESTUARINE } from './drainageConstants';

export default function SalineIntrusionModal({ isOpen, onClose }) {
  const [stations] = useState(WATER_QUALITY_ESTUARINE);
  const [selectedStationId, setSelectedStationId] = useState(WATER_QUALITY_ESTUARINE[0].id);

  if (!isOpen) return null;

  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-500">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Outfall Saline Intrusion &amp; Estuarine Water Quality
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-500 font-bold">
                  MPCB REAL-TIME MONITORS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Seawater Wedge Upstream Propagation &amp; Flap Gate Seal Integrity
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Station Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {stations.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStationId(st.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedStationId === st.id
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                <div className="text-xs font-bold truncate">{st.name}</div>
                <div className="text-[10px] text-ink-secondary truncate mt-0.5">{st.tideDirection}</div>
                <div className="text-[10px] text-teal-500 font-bold mt-1.5">
                  Salinity: {st.salinityPsu} PSU
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Water Quality Gauges */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="font-bold text-sm text-ink">{activeStation.name}</span>
              <span className="text-xs text-teal-500 font-bold">Saline Wedge Ingress: {activeStation.salineWedgeKm} km inland</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Salinity</span>
                <span className="text-lg font-bold text-ink">{activeStation.salinityPsu} PSU</span>
                <span className="text-[10px] text-ink-secondary block">Ocean: ~35 PSU</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Conductivity</span>
                <span className="text-lg font-bold text-teal-500">{activeStation.conductMsCm} mS/cm</span>
                <span className="text-[10px] text-ink-secondary block">Ionic concentration</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Dissolved Oxygen</span>
                <span className={`text-lg font-bold ${activeStation.doMgL < 2.0 ? 'text-status-alert' : 'text-emerald-500'}`}>
                  {activeStation.doMgL} mg/L
                </span>
                <span className="text-[10px] text-ink-secondary block">Hypoxic &lt; 2 mg/L</span>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">pH &amp; Turbidity</span>
                <span className="text-lg font-bold text-purple">{activeStation.ph} pH</span>
                <span className="text-[10px] text-ink-secondary block">{activeStation.turbidityNtu} NTU</span>
              </div>
            </div>

            {/* Saline Wedge Visualization Diagram */}
            <div className="bg-surface-secondary p-3.5 rounded-xl border border-border text-center">
              <span className="text-[11px] text-ink-secondary block mb-2 font-sans font-semibold">
                Estuarine Stratified Density Wedge (Saline Bottom Layer vs Fresh Surface Stormwater)
              </span>
              <svg viewBox="0 0 500 100" className="w-full max-h-24 bg-canvas rounded-lg border border-border">
                <rect x="0" y="0" width="500" height="100" fill="#09090B" />
                {/* Freshwater Top */}
                <polygon points="0,20 500,20 500,60 0,90" fill="#3B82F6" fillOpacity="0.4" />
                <text x="20" y="45" fill="#60A5FA" fontSize="9" fontFamily="monospace">Freshwater Storm Discharge Q(t)</text>

                {/* Saltwater Wedge Bottom */}
                <polygon points="120,90 500,60 500,95 120,95" fill="#0D9488" fillOpacity="0.6" />
                <text x="320" y="85" fill="#2DD4BF" fontSize="9" fontFamily="monospace">Dense Seawater Wedge &gt;&gt;</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

