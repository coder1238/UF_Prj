import React, { useState } from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function HydrographComparisonChart({
  corridorData,
  activeInterventionsCount,
  depthMitigationCm,
  sensitivityFactor = 1.0,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!corridorData || !corridorData.timeSeries) {
    return (
      <div className="p-4 bg-surface-secondary rounded-xl text-center text-xs text-ink-secondary">
        Select a corridor to view hydrodynamic hydrograph.
      </div>
    );
  }

  const times = corridorData.timeSeries;
  const maxDepth = Math.max(
    ...times.map((t) => t.baseline * sensitivityFactor),
    60
  );

  // SVG Chart Dimensions
  const width = 640;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Calculate coordinates for points
  const points = times.map((pt, idx) => {
    const x = padLeft + (idx / (times.length - 1)) * chartW;
    const baseVal = Math.round(pt.baseline * sensitivityFactor * 10) / 10;
    // Mitigation effect ramps up around peak
    const mitEff = Math.min(
      baseVal - 3,
      depthMitigationCm * (0.4 + (idx / times.length) * 0.7)
    );
    const mitVal = Math.max(2, Math.round((baseVal - mitEff) * 10) / 10);

    const yBase = padTop + chartH - (baseVal / maxDepth) * chartH;
    const yMit = padTop + chartH - (mitVal / maxDepth) * chartH;

    return {
      time: pt.time,
      rainfallMm: pt.rainfallMm,
      baseVal,
      mitVal,
      delta: Math.round((baseVal - mitVal) * 10) / 10,
      x,
      yBase,
      yMit,
    };
  });

  // Polyline path strings
  const baselinePath = points.map((p) => `${p.x},${p.yBase}`).join(' ');
  const mitigatedPath = points.map((p) => `${p.x},${p.yMit}`).join(' ');

  // Area under mitigated path
  const mitigatedArea = `${points[0].x},${padTop + chartH} ${mitigatedPath} ${
    points[points.length - 1].x
  },${padTop + chartH}`;

  // Threshold lines
  const yCurbside = padTop + chartH - (15 / maxDepth) * chartH;
  const yAxle = padTop + chartH - (30 / maxDepth) * chartH;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Hydrodynamic Inundation Hydrograph
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-medium">
              PINN 2D-SWE SOLVER
            </span>
          </div>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Temporal depth progression: Baseline Unmitigated vs Active Counterfactual ({activeInterventionsCount} deployed)
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-status-alert rounded-full inline-block border-t border-dashed border-status-alert"></span>
            <span className="text-ink-secondary">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-status-safe rounded-full inline-block"></span>
            <span className="font-semibold text-status-safe">Mitigated Twin</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 font-mono text-[10px]">
            <span>15cm / 30cm Critical</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 select-none"
        >
          <defs>
            <linearGradient id="mitigatedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B8F67" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B8F67" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[0, 15, 30, 45, 60].map((val) => {
            const y = padTop + chartH - (val / maxDepth) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E3E0EA"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-ink-secondary"
                >
                  {val} cm
                </text>
              </g>
            );
          })}

          {/* Curbside 15cm threshold line */}
          {yCurbside > padTop && (
            <line
              x1={padLeft}
              y1={yCurbside}
              x2={width - padRight}
              y2={yCurbside}
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
          )}

          {/* Axle 30cm threshold line */}
          {yAxle > padTop && (
            <line
              x1={padLeft}
              y1={yAxle}
              x2={width - padRight}
              y2={yAxle}
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
          )}

          {/* Area fill for mitigated curve */}
          <polygon points={mitigatedArea} fill="url(#mitigatedGrad)" />

          {/* Baseline curve (red dashed) */}
          <polyline
            points={baselinePath}
            fill="none"
            stroke="#D94A4A"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Mitigated curve (green solid) */}
          <polyline
            points={mitigatedPath}
            fill="none"
            stroke="#3B8F67"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Baseline marker */}
              <circle
                cx={p.x}
                cy={p.yBase}
                r="3.5"
                className="fill-surface stroke-status-alert stroke-2 group-hover:r-5 transition-all"
              />
              {/* Mitigated marker */}
              <circle
                cx={p.x}
                cy={p.yMit}
                r="4"
                className="fill-status-safe stroke-surface stroke-2 group-hover:r-5.5 transition-all"
              />
              {/* X-axis label */}
              <text
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] font-mono fill-ink-secondary"
              >
                {p.time}
              </text>
            </g>
          ))}

          {/* Hover Crosshair */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padTop}
                x2={hoveredPoint.x}
                y2={padTop + chartH}
                stroke="#6D4AFF"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-surface/95 backdrop-blur-sm border border-border shadow-elevated rounded-lg p-2.5 text-xs text-ink transition-all"
            style={{
              left: Math.min(width - 160, Math.max(50, hoveredPoint.x - 70)),
              top: 10,
            }}
          >
            <div className="font-mono font-bold text-[11px] text-purple flex items-center justify-between gap-4">
              <span>{hoveredPoint.time} IST</span>
              <span className="text-[10px] text-ink-secondary">Rain: {hoveredPoint.rainfallMm} mm/h</span>
            </div>
            <div className="mt-1 space-y-0.5 font-mono text-[11px]">
              <div className="flex justify-between gap-3 text-status-alert">
                <span>Baseline:</span>
                <span className="font-bold">{hoveredPoint.baseVal} cm</span>
              </div>
              <div className="flex justify-between gap-3 text-status-safe">
                <span>Mitigated:</span>
                <span className="font-bold">{hoveredPoint.mitVal} cm</span>
              </div>
              <div className="flex justify-between gap-3 text-purple font-semibold pt-1 border-t border-border mt-1">
                <span>Delta Reduction:</span>
                <span>-{hoveredPoint.delta} cm</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Threshold Legend Bar */}
      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-secondary">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>15 cm: Two-wheelers & Sedans impeded</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>30 cm: Bus & Emergency transit halted</span>
          </span>
        </div>
        <div className="font-mono text-status-safe font-semibold flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Peak Depressurization: -{depthMitigationCm} cm</span>
        </div>
      </div>
    </div>
  );
}

