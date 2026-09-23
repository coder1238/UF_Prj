import React, { useState } from 'react';
import {
  X,
  Layers,
  Activity,
  Sliders,
  Compass,
  ArrowUpRight,
  Info,
  Download,
} from 'lucide-react';

export default function RHIProfileModal({ isOpen, onClose, initialAzimuth = 42, onAzimuthChange }) {
  const [azimuth, setAzimuth] = useState(initialAzimuth);
  const [showFreezingLevel, setShowFreezingLevel] = useState(true);
  const [showEchoTops, setShowEchoTops] = useState(true);
  const [showBrightBand, setShowBrightBand] = useState(true);

  if (!isOpen) return null;

  const PRESETS = [
    { name: 'Colaba → Kurla / Sion Basin', az: 42, peakEchoTop: '14.2 km', coreIntensity: '58 dBZ' },
    { name: 'Colaba → Thane / Mulund', az: 25, peakEchoTop: '12.8 km', coreIntensity: '52 dBZ' },
    { name: 'Colaba → Borivali / Dahisar', az: 355, peakEchoTop: '11.5 km', coreIntensity: '48 dBZ' },
    { name: 'Colaba → Navi Mumbai / Vashi', az: 65, peakEchoTop: '13.6 km', coreIntensity: '56 dBZ' },
  ];

  const handleAzChange = (newAz) => {
    setAzimuth(newAz);
    if (onAzimuthChange) onAzimuthChange(newAz);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Range-Height Indicator (RHI) Vertical Cross-Section
              </h3>
              <p className="text-xs text-ink-secondary">
                Atmospheric radar cut along Azimuth {azimuth}° • 0–15 km Altitude MSL Profile
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

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Preset Slices Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary whitespace-nowrap">
              Radial Cut Presets:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.az}
                onClick={() => handleAzChange(p.az)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${
                  azimuth === p.az
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-sm'
                    : 'bg-surface-secondary text-ink-secondary hover:text-ink border-border'
                }`}
              >
                {p.name} ({p.az}°)
              </button>
            ))}
          </div>

          {/* RHI SVG Canvas */}
          <div className="bg-[#14111B] border border-border/80 rounded-xl p-4 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#D6D2E6] mb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple" />
                AZIMUTH SLICE: <strong className="text-white">{azimuth}° TRUE NORTH</strong>
              </span>
              <span className="text-[#88819C]">RANGE: 0 TO 80 KM • VERTICAL RESOLUTION: 100M</span>
            </div>

            {/* RHI Diagram SVG */}
            <svg viewBox="0 0 700 320" className="w-full h-auto">
              <defs>
                <linearGradient id="cloudUpdraftGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.4" />
                  <stop offset="35%" stopColor="#F1C40F" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="#E74C3C" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="meltingLayerGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#E67E22" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#E67E22" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E67E22" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Grid Lines Altitude (0 to 15 km) */}
              {[0, 3, 6, 9, 12, 15].map((alt) => {
                const y = 280 - (alt / 15) * 240;
                return (
                  <g key={alt}>
                    <line x1="60" y1={y} x2="680" y2={y} stroke="#2D283A" strokeWidth="0.8" />
                    <text x="50" y={y + 3} fill="#88819C" fontSize="9" fontFamily="monospace" textAnchor="end">
                      {alt} km
                    </text>
                  </g>
                );
              })}

              {/* Distance Range Lines (0 to 80 km) */}
              {[0, 20, 40, 60, 80].map((dist) => {
                const x = 60 + (dist / 80) * 620;
                return (
                  <g key={dist}>
                    <line x1={x} y1="40" x2={x} y2="280" stroke="#2D283A" strokeWidth="0.8" />
                    <text x={x} y="295" fill="#88819C" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {dist} km
                    </text>
                  </g>
                );
              })}

              {/* Ground Elevation Axis Line */}
              <line x1="60" y1="280" x2="680" y2="280" stroke="#6D4AFF" strokeWidth="2" />
              <text x="60" y="310" fill="#6D4AFF" fontSize="8" fontFamily="monospace">
                IMD COLABA RADAR (0 km)
              </text>
              <text x="680" y="310" fill="#6D4AFF" fontSize="8" fontFamily="monospace" textAnchor="end">
                OUTER BASIN (80 km)
              </text>

              {/* Convective Cloud Core Shape (Dynamic based on azimuth) */}
              <g id="convective-plume">
                {/* Outer anvil & cloud boundary */}
                <path
                  d="M 180,280 C 190,160 210,60 280,55 C 340,50 380,80 430,120 C 470,160 480,240 500,280 Z"
                  fill="url(#cloudUpdraftGrad)"
                  stroke="#9B59B6"
                  strokeWidth="1.5"
                />

                {/* Severe Reflectivity Core (>55 dBZ) */}
                <path
                  d="M 240,280 C 250,210 260,140 290,120 C 330,110 360,140 370,220 C 375,260 380,270 385,280 Z"
                  fill="#E74C3C"
                  fillOpacity="0.8"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
                <circle cx="310" cy="180" r="18" fill="#9B59B6" fillOpacity="0.85" />
                <text x="310" y="183" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  62 dBZ
                </text>
              </g>

              {/* Freezing Level (0°C Isotherm at 4.6 km MSL in Indian Monsoon) */}
              {showFreezingLevel && (
                <g id="freezing-isotherm">
                  <line
                    x1="60"
                    y1={280 - (4.6 / 15) * 240}
                    x2="680"
                    y2={280 - (4.6 / 15) * 240}
                    stroke="#00D2D3"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                  <rect x="70" y={280 - (4.6 / 15) * 240 - 14} width="125" height="13" fill="#14111B" rx="2" />
                  <text
                    x="75"
                    y={280 - (4.6 / 15) * 240 - 4}
                    fill="#00D2D3"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    0°C FREEZING LEVEL (4.6 km)
                  </text>
                </g>
              )}

              {/* Melting Layer / Radar Bright Band */}
              {showBrightBand && (
                <g id="bright-band">
                  <rect
                    x="200"
                    y={280 - (4.8 / 15) * 240}
                    width="260"
                    height="10"
                    fill="url(#meltingLayerGlow)"
                  />
                  <text
                    x="465"
                    y={280 - (4.8 / 15) * 240 + 7}
                    fill="#E67E22"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    BRIGHT BAND (MELTING ICE)
                  </text>
                </g>
              )}

              {/* Storm Echo Top (ET 40 dBZ Altitude) */}
              {showEchoTops && (
                <g id="echo-top-marker">
                  <line x1="280" y1="55" x2="280" y2="35" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
                  <rect x="235" y="22" width="105" height="15" fill="#6D4AFF" rx="3" />
                  <text x="287" y="33" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    ECHO TOP: 14.1 km
                  </text>
                </g>
              )}

              {/* Radar Beam Projection Fan */}
              <line x1="60" y1="280" x2="680" y2="230" stroke="#6D4AFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1="60" y1="280" x2="680" y2="170" stroke="#6D4AFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>

          {/* Interactive Slicing Controls & Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-ink">Azimuth Steering</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={azimuth}
                  onChange={(e) => handleAzChange(Number(e.target.value))}
                  className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
                />
                <span className="font-mono text-sm font-bold text-purple px-2 py-0.5 bg-surface rounded border border-border">
                  {azimuth}°
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary">
                Rotates the vertical slicing plane around IMD Colaba radar.
              </p>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-ink">Layer Annotations</span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <button
                  onClick={() => setShowFreezingLevel(!showFreezingLevel)}
                  className={`px-2 py-1 rounded border text-[11px] ${
                    showFreezingLevel ? 'bg-cyan-50 text-cyan-700 border-cyan-300 font-bold' : 'bg-surface text-ink-secondary border-border'
                  }`}
                >
                  0°C Isotherm
                </button>
                <button
                  onClick={() => setShowBrightBand(!showBrightBand)}
                  className={`px-2 py-1 rounded border text-[11px] ${
                    showBrightBand ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold' : 'bg-surface text-ink-secondary border-border'
                  }`}
                >
                  Bright Band
                </button>
                <button
                  onClick={() => setShowEchoTops(!showEchoTops)}
                  className={`px-2 py-1 rounded border text-[11px] ${
                    showEchoTops ? 'bg-purple-soft text-purple border-purple font-bold' : 'bg-surface text-ink-secondary border-border'
                  }`}
                >
                  Echo Tops
                </button>
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col justify-between text-xs font-mono">
              <span className="text-[11px] uppercase font-bold text-ink">Atmospheric Sounding</span>
              <div className="space-y-1 text-ink-secondary">
                <div className="flex justify-between">
                  <span>Convective Updraft:</span>
                  <strong className="text-status-alert font-bold">+18.4 m/s</strong>
                </div>
                <div className="flex justify-between">
                  <span>Liquid Water Path:</span>
                  <strong className="text-ink font-bold">4.8 kg/m²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hail Risk Index:</span>
                  <strong className="text-status-warning font-bold">MODERATE (34%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="text-[11px] font-mono text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple" />
            <span>Dual-pol RHI scan reconstructed from 14 elevation sweeps (0.5° to 19.5°).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Close RHI View
          </button>
        </div>
      </div>
    </div>
  );
}

