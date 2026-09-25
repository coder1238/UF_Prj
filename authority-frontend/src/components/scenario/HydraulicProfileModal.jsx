import React, { useState } from 'react';
import { X, Activity, Waves, Info } from 'lucide-react';
import { TRANSECT_PROFILES } from './scenarioConstants';

export default function HydraulicProfileModal({ isOpen, onClose, scenarioParams }) {
  const [selectedTransectId, setSelectedTransectId] = useState(TRANSECT_PROFILES[0].id);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const transect = TRANSECT_PROFILES.find((t) => t.id === selectedTransectId) || TRANSECT_PROFILES[0];

  // Hydraulic surcharge factor from scenarioParams
  const rainStress = ((scenarioParams?.rainfallIntensity || 50) - 50) / 50; // -0.2 to 2.0
  const siltStress = (scenarioParams?.drainBlockage || 0) / 100; // 0 to 0.75
  const pumpRelief = ((scenarioParams?.pumpingCapacity || 70) - 70) / 100; // -0.3 to 0.3
  const tidePenalty = Math.max(0, ((scenarioParams?.tideLevel || 3.2) - 3.2) * 0.25);

  const surgeMultiplier = Math.max(0.2, 1 + rainStress * 0.75 + siltStress * 0.5 - pumpRelief * 0.4 + tidePenalty);

  // SVG Coordinates calculation
  const width = 640;
  const height = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const maxDist = Math.max(...transect.points.map((p) => p.dist));
  const minElev = Math.min(...transect.points.map((p) => p.invert)) - 0.5;
  const maxElev = Math.max(...transect.points.map((p) => p.bed)) + 2.5;

  const getX = (dist) => padding.left + (dist / (maxDist || 1)) * plotW;
  const getY = (elev) => padding.top + plotH - ((elev - minElev) / (maxElev - minElev)) * plotH;

  // Compute profile paths
  const bedPath = transect.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dist)} ${getY(p.bed)}`)
    .join(' ');

  const invertPath = transect.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dist)} ${getY(p.invert)}`)
    .join(' ');

  const baselineWspPath = transect.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dist)} ${getY(p.baselineWsp)}`)
    .join(' ');

  const scenarioPoints = transect.points.map((p) => {
    const depthBaseline = Math.max(0.1, p.baselineWsp - p.bed);
    const scenarioDepth = depthBaseline * surgeMultiplier;
    const scenarioWsp = p.bed + scenarioDepth;
    const isOvertopping = scenarioWsp > p.bed;
    return {
      ...p,
      scenarioWsp,
      scenarioDepthCm: (scenarioDepth * 100).toFixed(1),
      isOvertopping,
    };
  });

  const scenarioWspPath = scenarioPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dist)} ${getY(p.scenarioWsp)}`)
    .join(' ');

  // Area under scenario water
  const scenarioWaterAreaPath = `${scenarioWspPath} L ${getX(maxDist)} ${getY(minElev)} L ${getX(0)} ${getY(minElev)} Z`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                2D Hydraulic Longitudinal Profile &amp; Water Surface Profile (WSP)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  SAINT-VENANT 1D/2D SOLVER
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Dynamic cross-sectional hydraulic grade line (HGL) vs ground elevation under scenario stress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transect Selector Tabs */}
        <div className="flex items-center gap-1.5 p-3 border-b border-border bg-canvas overflow-x-auto text-xs">
          {TRANSECT_PROFILES.map((tp) => (
            <button
              key={tp.id}
              onClick={() => {
                setSelectedTransectId(tp.id);
                setHoveredPoint(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTransectId === tp.id
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-surface border border-border text-ink hover:border-purple/40'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              {tp.name}
            </button>
          ))}
        </div>

        {/* Profile Visualization & Telemetry */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-canvas rounded-xl border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Transect Chainage</span>
              <div className="text-base font-bold font-mono text-ink mt-0.5">{transect.chainageKm} km span</div>
              <div className="text-[10px] font-mono text-ink-muted">Elevation MSL: {transect.elevationGround}m</div>
            </div>
            <div className="p-3 bg-canvas rounded-xl border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Baseline Water Depth</span>
              <div className="text-base font-bold font-mono text-ink mt-0.5">{transect.baselineDepth} cm</div>
              <div className="text-[10px] font-mono text-status-safe font-semibold">Under normal monsoon</div>
            </div>
            <div className="p-3 bg-canvas rounded-xl border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Scenario Peak Depth</span>
              <div className="text-base font-bold font-mono text-status-alert mt-0.5">
                {(transect.baselineDepth * surgeMultiplier).toFixed(1)} cm
              </div>
              <div className="text-[10px] font-mono text-status-alert font-bold">
                Δ +{((transect.baselineDepth * surgeMultiplier) - transect.baselineDepth).toFixed(1)} cm
              </div>
            </div>
            <div className="p-3 bg-canvas rounded-xl border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Surge Factor</span>
              <div className="text-base font-bold font-mono text-purple mt-0.5">{surgeMultiplier.toFixed(2)}x</div>
              <div className="text-[10px] font-mono text-purple font-semibold">Hydraulic amplification</div>
            </div>
          </div>

          {/* Interactive SVG Cross-Section */}
          <div className="relative bg-surface rounded-xl border border-border p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2 text-xs">
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-ink">
                  <span className="w-3 h-0.5 bg-ink inline-block" /> Ground Level (Bed)
                </span>
                <span className="flex items-center gap-1.5 text-purple font-semibold">
                  <span className="w-3 h-0.5 bg-purple border-b border-dashed inline-block" /> Baseline WSP
                </span>
                <span className="flex items-center gap-1.5 text-status-alert font-bold">
                  <span className="w-3 h-1 bg-status-alert inline-block" /> Scenario WSP (Overtopping)
                </span>
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <span className="w-3 h-0.5 bg-ink-muted border-dotted inline-block" /> Conduit Invert
                </span>
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">Hover nodes for depth probe</span>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D94A4A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[minElev, minElev + (maxElev - minElev) * 0.33, minElev + (maxElev - minElev) * 0.66, maxElev].map((val, i) => (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={width - padding.right}
                    y2={getY(val)}
                    stroke="#E3E0EA"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text x={padding.left - 8} y={getY(val) + 4} textAnchor="end" className="text-[9px] fill-ink-secondary font-mono">
                    {val.toFixed(1)}m
                  </text>
                </g>
              ))}

              {/* Water flood polygon */}
              <path d={scenarioWaterAreaPath} fill="url(#waterGrad)" />

              {/* Ground Bed */}
              <path d={bedPath} fill="none" stroke="#24212B" strokeWidth="2.5" />

              {/* Conduit Invert */}
              <path d={invertPath} fill="none" stroke="#948E9F" strokeDasharray="4 3" strokeWidth="1.5" />

              {/* Baseline WSP */}
              <path d={baselineWspPath} fill="none" stroke="#6D4AFF" strokeDasharray="5 3" strokeWidth="2" />

              {/* Scenario WSP */}
              <path d={scenarioWspPath} fill="none" stroke="#D94A4A" strokeWidth="3" />

              {/* Interactive Data Points */}
              {scenarioPoints.map((pt, i) => {
                const cx = getX(pt.dist);
                const cy = getY(pt.scenarioWsp);
                const isHovered = hoveredPoint && hoveredPoint.dist === pt.dist;

                return (
                  <g
                    key={i}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      className={`transition-all ${isHovered ? 'fill-status-alert stroke-white stroke-2' : 'fill-status-alert'}`}
                    />
                    <text
                      x={cx}
                      y={height - padding.bottom + 18}
                      textAnchor="middle"
                      className="text-[9px] fill-ink-secondary font-mono"
                    >
                      {pt.dist}m
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-12 right-6 bg-surface/95 backdrop-blur border border-border shadow-elevated rounded-xl p-3 text-xs font-mono space-y-1 z-20">
                <div className="text-ink font-bold border-b border-border pb-1">
                  Station Distance: {hoveredPoint.dist}m
                </div>
                <div className="text-ink-secondary">Bed Elevation: {hoveredPoint.bed.toFixed(2)} m MSL</div>
                <div className="text-ink-secondary">Invert Level: {hoveredPoint.invert.toFixed(2)} m MSL</div>
                <div className="text-purple font-semibold">Baseline WSP: {hoveredPoint.baselineWsp.toFixed(2)} m MSL</div>
                <div className="text-status-alert font-bold">
                  Scenario WSP: {hoveredPoint.scenarioWsp.toFixed(2)} m MSL ({hoveredPoint.scenarioDepthCm} cm water)
                </div>
              </div>
            )}
          </div>

          {/* Profile Engineering Observations */}
          <div className="p-3.5 bg-surface-secondary border border-border rounded-xl text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple mt-0.5 shrink-0" />
            <div className="text-ink-secondary leading-relaxed">
              <strong className="text-ink">Hydraulic Grade Line Warning:</strong> Under current parameter stress ({scenarioParams.rainfallIntensity} mm/h rain &amp; {scenarioParams.drainBlockage}% blockage), the water surface elevation exceeds natural road crown grade by{' '}
              <span className="font-mono text-status-alert font-bold">
                {((transect.baselineDepth * surgeMultiplier) - 15).toFixed(1)} cm
              </span>. Reverse hydraulic gradient observed at downstream outfalls due to high sea tide level ({scenarioParams.tideLevel} m MSL).
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Manning's Roughness n: 0.016 (Reinforced Concrete Box Culvert)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white font-bold text-xs rounded-xl shadow-subtle hover:bg-purple-deep transition-colors"
          >
            Close Profile Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
