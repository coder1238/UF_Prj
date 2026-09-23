import React from 'react';
import { X, Layers, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ElevationCrossSectionModal({
  isOpen,
  onClose,
  selectedCorridor,
  baselineDepthCm,
  simulatedDepthCm,
}) {
  if (!isOpen) return null;

  const curbHeightCm = selectedCorridor.curbHeightCm || 18;
  const roadWidthM = 16.0;

  // SVG coordinates: 600 width, 260 height
  const width = 600;
  const height = 260;
  const roadY = 180; // road lowest gutter level
  const roadCrownY = roadY - 8; // 2.5% camber crown
  const curbTopY = roadY - curbHeightCm * 1.5; // curb top

  // Water level Y in SVG
  const baselineWaterY = roadY - baselineDepthCm * 1.5;
  const simulatedWaterY = roadY - simulatedDepthCm * 1.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                DSM Cross-Section Inundation Visualizer
              </h3>
              <p className="text-[11px] text-ink-secondary">
                {selectedCorridor.name} • 2.5% Road Camber & Gutter Profile
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Depth comparison telemetry */}
          <div className="grid grid-cols-3 gap-2.5 text-center font-mono p-3 bg-surface-secondary rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-ink-secondary block">Unmitigated Head</span>
              <strong className="text-status-alert text-sm mt-0.5 block">{baselineDepthCm} cm</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Mitigated Twin Head</span>
              <strong className="text-status-safe text-sm mt-0.5 block">{simulatedDepthCm} cm</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Gutter Elevation</span>
              <strong className="text-ink text-sm mt-0.5 block">{selectedCorridor.elevation}m MSL</strong>
            </div>
          </div>

          {/* SVG Road Cross-Section */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none">
              <defs>
                <linearGradient id="unmitWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="mitWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Sub-base Soil Layer */}
              <rect x="0" y={roadY} width={width} height={height - roadY} fill="#1E293B" />

              {/* Left Sidewalk */}
              <rect x="40" y={curbTopY} width="70" height={roadY - curbTopY} fill="#475569" />
              <text x="75" y={curbTopY - 6} fill="#CBD5E1" textAnchor="middle" className="text-[9px] font-mono">
                Left Footpath
              </text>

              {/* Right Sidewalk */}
              <rect x="490" y={curbTopY} width="70" height={roadY - curbTopY} fill="#475569" />
              <text x="525" y={curbTopY - 6} fill="#CBD5E1" textAnchor="middle" className="text-[9px] font-mono">
                Right Footpath
              </text>

              {/* Road Asphalt Profile with crown */}
              <polygon
                points={`110,${roadY} 300,${roadCrownY} 490,${roadY} 490,${roadY + 15} 110,${roadY + 15}`}
                fill="#334155"
              />
              <text x="300" y={roadCrownY + 11} fill="#94A3B8" textAnchor="middle" className="text-[8px] font-mono">
                ROAD CROWN (CAMBER 2.5%)
              </text>

              {/* Storm Sewer Pipe underneath road */}
              <circle cx="300" cy="225" r="18" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
              <text x="300" y="228" fill="#38BDF8" textAnchor="middle" className="text-[8px] font-mono">
                900mm RCP
              </text>

              {/* Baseline Water Volume Fill */}
              {baselineWaterY < roadY && (
                <rect
                  x="110"
                  y={baselineWaterY}
                  width="380"
                  height={roadY - baselineWaterY}
                  fill="url(#unmitWater)"
                />
              )}

              {/* Baseline Water Surface Line */}
              <line
                x1="80"
                y1={baselineWaterY}
                x2="520"
                y2={baselineWaterY}
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text
                x="525"
                y={baselineWaterY + 3}
                fill="#EF4444"
                className="text-[9px] font-mono font-bold"
              >
                Unmitigated ({baselineDepthCm} cm)
              </text>

              {/* Mitigated Water Volume Fill */}
              {simulatedWaterY < roadY && (
                <rect
                  x="110"
                  y={simulatedWaterY}
                  width="380"
                  height={roadY - simulatedWaterY}
                  fill="url(#mitWater)"
                />
              )}

              {/* Mitigated Water Surface Line */}
              <line
                x1="80"
                y1={simulatedWaterY}
                x2="520"
                y2={simulatedWaterY}
                stroke="#10B981"
                strokeWidth="2.5"
              />
              <text
                x="525"
                y={simulatedWaterY + 3}
                fill="#10B981"
                className="text-[9px] font-mono font-bold"
              >
                Mitigated ({simulatedDepthCm} cm)
              </text>
            </svg>
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border text-xs flex items-center justify-between">
            <span className="text-ink-secondary">Curbside Inundation Clearance:</span>
            <span className="font-mono font-bold text-status-safe">
              {simulatedDepthCm <= curbHeightCm
                ? '✓ Sidewalk above floodline (Pedestrians safe)'
                : '⚠ Overtopping sidewalk by ' + (simulatedDepthCm - curbHeightCm) + ' cm'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Calibrated with LiDAR Digital Surface Model (DSM) high-resolution elevation raster.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

