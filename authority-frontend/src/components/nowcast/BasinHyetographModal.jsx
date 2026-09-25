import React, { useState } from 'react';
import {
  X,
  Waves,
  TrendingUp,
  BarChart2,
  Droplets,
  AlertTriangle,
  Info,
  Download,
} from 'lucide-react';

const BASINS = [
  {
    id: 'mithi',
    name: 'Mithi River Basin Channel',
    areaKm2: 128.5,
    imperviousRatio: 0.82,
    runoffCoeff: 0.84,
    outfall: 'Mahim Creek & Bay',
    pumpCapacityM3s: 240,
    currentIntensity: 78.4,
    tideSensitive: true,
  },
  {
    id: 'poisar',
    name: 'Poisar River Basin',
    areaKm2: 42.1,
    imperviousRatio: 0.74,
    runoffCoeff: 0.76,
    outfall: 'Marve Creek (Malad)',
    pumpCapacityM3s: 85,
    currentIntensity: 54.2,
    tideSensitive: true,
  },
  {
    id: 'dahisar',
    name: 'Dahisar River Basin',
    areaKm2: 34.2,
    imperviousRatio: 0.68,
    runoffCoeff: 0.72,
    outfall: 'Gorai Creek',
    pumpCapacityM3s: 60,
    currentIntensity: 42.0,
    tideSensitive: false,
  },
  {
    id: 'oshiwara',
    name: 'Oshiwara River Catchment',
    areaKm2: 51.6,
    imperviousRatio: 0.85,
    runoffCoeff: 0.87,
    outfall: 'Versova Creek',
    pumpCapacityM3s: 110,
    currentIntensity: 68.5,
    tideSensitive: true,
  },
];

export default function BasinHyetographModal({ isOpen, onClose }) {
  const [selectedBasin, setSelectedBasin] = useState(BASINS[0]);
  const [soilSaturation, setSoilSaturation] = useState(85); // %

  if (!isOpen) return null;

  // Hyetograph time bins (mm/hr)
  const HYETOGRAPH = [
    { time: '-30m', rate: Math.round(selectedBasin.currentIntensity * 0.65) },
    { time: '-15m', rate: Math.round(selectedBasin.currentIntensity * 0.82) },
    { time: 'LIVE NOW', rate: selectedBasin.currentIntensity, isLive: true },
    { time: '+15m', rate: Math.round(selectedBasin.currentIntensity * 1.15) },
    { time: '+30m (PEAK)', rate: Math.round(selectedBasin.currentIntensity * 1.28), isPeak: true },
    { time: '+60m', rate: Math.round(selectedBasin.currentIntensity * 0.95) },
    { time: '+90m', rate: Math.round(selectedBasin.currentIntensity * 0.60) },
  ];

  // Rational Runoff Formula: Q = (C * I * A) / 3.6  [m^3/s]
  // Adjust C slightly with soil saturation
  const effectiveC = selectedBasin.runoffCoeff * (0.8 + (soilSaturation / 100) * 0.2);
  const peakDischargeM3s = Math.round(((effectiveC * selectedBasin.currentIntensity * selectedBasin.areaKm2) / 3.6) * 10) / 10;

  // Inflow volume in million liters (ML) per hour: V = I (mm) * A (km^2) * 1000 m3/mm*km2 = I * A * 1,000 m3 = I * A ML
  const inflowVolumeML = Math.round(selectedBasin.currentIntensity * selectedBasin.areaKm2);

  // Pump capacity vs discharge ratio
  const surchargeRisk = peakDischargeM3s > selectedBasin.pumpCapacityM3s ? 'CRITICAL SURCHARGE' : 'ELEVATED FLOW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Catchment Basin Hyetograph &amp; Volumetric Runoff Integrator
              </h3>
              <p className="text-xs text-ink-secondary">
                Doppler Radar rainfall integration over Mumbai watershed drainage polygons
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Basin Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {BASINS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBasin(b)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedBasin.id === b.id
                    ? 'bg-purple-soft border-purple text-purple shadow-sm'
                    : 'bg-surface-secondary border-border text-ink hover:border-purple/40'
                }`}
              >
                <span className="font-bold text-xs truncate">{b.name}</span>
                <div className="flex justify-between items-baseline mt-2 font-mono text-[10px] text-ink-secondary">
                  <span>{b.areaKm2} km²</span>
                  <span className="font-bold text-ink">{b.currentIntensity} mm/h</span>
                </div>
              </button>
            ))}
          </div>

          {/* Hyetograph Bar Chart SVG */}
          <div className="bg-[#14111B] border border-border/80 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#D6D2E6]">
              <span className="font-bold uppercase text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple" />
                {selectedBasin.name} — Radar Hyetograph (mm/hr)
              </span>
              <span className="text-[#88819C]">TEMPORAL RESOLUTION: 15 MIN BINS</span>
            </div>

            <svg viewBox="0 0 600 200" className="w-full h-auto">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = 160 - (val / 100) * 130;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="580" y2={y} stroke="#2D283A" strokeWidth="0.8" />
                    <text x="32" y={y + 3} fill="#88819C" fontSize="8" fontFamily="monospace" textAnchor="end">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Hyetograph Bars */}
              {HYETOGRAPH.map((item, idx) => {
                const x = 70 + idx * 75;
                const barHeight = (item.rate / 100) * 130;
                const y = 160 - barHeight;
                const isPeak = item.isPeak;
                const isLive = item.isLive;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width="42"
                      height={barHeight}
                      rx="4"
                      fill={isPeak ? '#E74C3C' : isLive ? '#6D4AFF' : '#3498DB'}
                      fillOpacity={isPeak ? 0.9 : 0.8}
                    />
                    <text
                      x={x + 21}
                      y={y - 6}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {item.rate}
                    </text>
                    <text
                      x={x + 21}
                      y="178"
                      fill={isLive ? '#6D4AFF' : '#88819C'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight={isLive || isPeak ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {item.time}
                    </text>
                  </g>
                );
              })}

              {/* Surcharge Threshold Line */}
              <line x1="40" y1="75" x2="580" y2="75" stroke="#E67E22" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="575" y="70" fill="#E67E22" fontSize="7" fontFamily="monospace" textAnchor="end">
                DRAINAGE SYSTEM FULL SURCHARGE THRESHOLD (65 mm/hr)
              </text>
            </svg>
          </div>

          {/* Hydrologic Runoff Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-ink-secondary">Catchment Inflow Volume</span>
              <div className="text-xl font-mono font-bold text-ink mt-1">
                {inflowVolumeML.toLocaleString()} ML/h
              </div>
              <p className="text-[9px] font-mono text-ink-secondary mt-0.5">
                {(inflowVolumeML * 1000).toLocaleString()} m³/hour
              </p>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-ink-secondary">Peak Runoff Discharge (Q)</span>
              <div className="text-xl font-mono font-bold text-status-alert mt-1">
                {peakDischargeM3s} m³/s
              </div>
              <p className="text-[9px] font-mono text-status-alert font-semibold mt-0.5">
                {surchargeRisk}
              </p>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-ink-secondary">Municipal Outfall Pump Cap</span>
              <div className="text-xl font-mono font-bold text-purple mt-1">
                {selectedBasin.pumpCapacityM3s} m³/s
              </div>
              <p className="text-[9px] font-mono text-ink-secondary mt-0.5">
                Outfall: {selectedBasin.outfall}
              </p>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-ink-secondary">
                <span>Soil Saturation Index</span>
                <span className="text-purple font-mono font-bold">{soilSaturation}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={soilSaturation}
                onChange={(e) => setSoilSaturation(Number(e.target.value))}
                className="w-full accent-purple h-1.5 bg-surface rounded-lg cursor-pointer"
              />
              <p className="text-[9px] font-mono text-ink-secondary">
                Directly amplifies Rational Runoff C coeff.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Rational Hydrologic Method • Q = (C · I · A) / 3.6
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

