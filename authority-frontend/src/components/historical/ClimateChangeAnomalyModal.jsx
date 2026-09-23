import React, { useState } from 'react';
import { X, Thermometer } from 'lucide-react';
import { CLIMATE_DECADE_ANOMALY } from './historicalConstants';

export default function ClimateChangeAnomalyModal({ isOpen, onClose }) {
  const [selectedMetric, setSelectedMetric] = useState('cloudburst'); // cloudburst | seaLevel | heavyDays | peakIntensity

  if (!isOpen) return null;

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
                12-Year Decadal Climate Change Anomaly &amp; Extreme Weather Tracker
              </h2>
              <p className="text-xs text-ink-secondary">
                Meteorological Climatology Shifts (2014–2026) • Arabian Sea Warming &amp; Cloudburst Multipliers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[11px] font-mono text-ink-secondary">Cloudburst Hours / Year</span>
              <span className="text-xl font-bold font-mono text-status-alert">14h → 42h</span>
              <span className="text-[10px] text-purple font-mono">+200% Surge (2014-2026)</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[11px] font-mono text-ink-secondary">Mean Sea Level Anomaly</span>
              <span className="text-xl font-bold font-mono text-status-alert">+51.2 mm</span>
              <span className="text-[10px] text-ink-secondary font-mono">Rate: +4.2 mm / year</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[11px] font-mono text-ink-secondary">Days &gt;100mm Rainfall</span>
              <span className="text-xl font-bold font-mono text-ink">6 → 17 Days</span>
              <span className="text-[10px] text-status-warning font-mono">+183% Frequency Shift</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[11px] font-mono text-ink-secondary">Peak 1h Intensity Max</span>
              <span className="text-xl font-bold font-mono text-purple">68 → 135 mm/h</span>
              <span className="text-[10px] text-status-alert font-mono">Nearly Doubled Peak Rate</span>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex border-b border-border gap-2 pb-2">
            {[
              { id: 'cloudburst', label: 'Extreme Cloudburst Hours (>50mm/h)' },
              { id: 'seaLevel', label: 'Arabian Sea Level Drift (mm MSL)' },
              { id: 'heavyDays', label: 'Days with >100mm Inundation Risk' },
              { id: 'peakIntensity', label: 'Maximum Recorded 1h Rate (mm/h)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedMetric === tab.id
                    ? 'bg-purple text-white shadow-xs'
                    : 'bg-surface-secondary text-ink hover:bg-surface-subtle'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic SVG Trend Chart */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Temporal Trajectory (2014–2026)
            </h4>
            <div className="w-full h-56 relative bg-surface-subtle border border-border rounded-lg p-3">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Horizontal Grid */}
                <line x1="30" y1="20" x2="480" y2="20" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="65" x2="480" y2="65" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="110" x2="480" y2="110" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="155" x2="480" y2="155" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="180" x2="480" y2="180" stroke="#CBC7D6" strokeWidth="1" />

                {/* Bars & Points */}
                {CLIMATE_DECADE_ANOMALY.map((item, idx) => {
                  const x = 45 + idx * 35;
                  let val = 0;
                  let maxVal = 50;
                  let color = '#6D4AFF';

                  if (selectedMetric === 'cloudburst') {
                    val = item.extremeCloudburstHours;
                    maxVal = 50;
                    color = '#6D4AFF';
                  } else if (selectedMetric === 'seaLevel') {
                    val = item.seaLevelAnomalyMm;
                    maxVal = 60;
                    color = '#D94A4A';
                  } else if (selectedMetric === 'heavyDays') {
                    val = item.daysAbove100mm;
                    maxVal = 20;
                    color = '#C58A25';
                  } else {
                    val = item.peakHourMaxMm;
                    maxVal = 150;
                    color = '#9B51E0';
                  }

                  const barHeight = Math.max(4, (val / maxVal) * 155);
                  const y = 180 - barHeight;

                  return (
                    <g key={item.year}>
                      {/* Bar */}
                      <rect
                        x={x - 10}
                        y={y}
                        width="20"
                        height={barHeight}
                        rx="3"
                        fill={color}
                        opacity="0.85"
                      />
                      {/* Value label */}
                      <text x={x} y={y - 5} fill="#24212B" textAnchor="middle" className="text-[8px] font-mono font-bold">
                        {val}
                      </text>
                      {/* Year label */}
                      <text x={x} y="195" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">
                        '{String(item.year).slice(2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Adaptation Directive Box */}
          <div className="p-3.5 bg-purple-soft/60 rounded-xl border border-purple/30 text-xs text-ink leading-relaxed">
            <strong className="text-purple font-mono block mb-1">CLIMATOLOGY FORENSIC INSIGHT:</strong>
            Rapid sea surface temperature (SST) warming in the North Arabian Sea (+1.2°C over 1980 baseline) provides higher latent heat of condensation, feeding meso-scale convective cells with rapid precipitation intensification. As tidal baselines creep upward (+5.1cm since 2014), gravity discharge windows through flap gates have shrunk by an average of 42 minutes per high tide cycle.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Data ground-truthed with IMD Colaba &amp; Santacruz Observatories</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

