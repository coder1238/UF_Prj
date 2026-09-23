import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function DynamicHydrographChart({
  scenarioParams,
  mitigationDepthCm = 0,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Generate 12-hour simulation time-steps (t=0 to t=12h in 30-min intervals = 25 points)
  const duration = scenarioParams.durationMin / 60; // hours of rain
  const intensity = scenarioParams.rainfallIntensity; // mm/h
  const basePeak = 42 + (intensity - 50) * 0.4 + scenarioParams.drainBlockage * 0.15 - mitigationDepthCm;

  const points = [];
  const hours = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'
  ];

  hours.forEach((timeStr, idx) => {
    const t = idx * 0.5; // hour
    // Rainfall Hyetograph (bell curve peaking at t = duration * 0.4)
    let rain = 0;
    if (t <= duration) {
      const rainShape = Math.sin((Math.PI * t) / Math.max(0.5, duration));
      rain = Math.max(0, +(intensity * rainShape).toFixed(1));
    }

    // Inflow Hydrograph Qin (m3/s) lagging rainfall slightly
    const lag = 0.5;
    const tLag = Math.max(0, t - lag);
    let qIn = 0;
    if (tLag <= duration + 1.5) {
      const inflowShape = Math.sin((Math.PI * tLag) / (duration + 1.5));
      qIn = Math.max(0, +(rain * 1.8 * inflowShape).toFixed(1));
    }

    // Outflow Qout based on pump capacity and gravity drainage
    const maxDrainCap = 85 * (scenarioParams.pumpingCapacity / 100) * (1 - scenarioParams.drainBlockage / 200);
    const qOut = +(Math.min(maxDrainCap, qIn * 0.85 + 10)).toFixed(1);

    // Depth hydrograph (cm) accumulating until peak, then receding
    const tPeak = duration * 0.6 + 0.8;
    let depth = 0;
    if (t <= tPeak) {
      depth = (basePeak * Math.pow(t / tPeak, 1.6)).toFixed(1);
    } else {
      const recFactor = Math.exp(-(t - tPeak) / (2.2 * (1 + scenarioParams.drainBlockage / 100)));
      depth = Math.max(0, +(basePeak * recFactor).toFixed(1));
    }

    points.push({
      time: timeStr,
      hour: t,
      rain,
      qIn: Number(qIn),
      qOut: Number(qOut),
      depth: Number(depth),
    });
  });

  const maxDepthVal = Math.max(...points.map((p) => p.depth), 60);
  const maxRainVal = Math.max(...points.map((p) => p.rain), 100);

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 180;
  const pad = { top: 20, right: 30, bottom: 25, left: 40 };
  const plotW = svgWidth - pad.left - pad.right;
  const plotH = svgHeight - pad.top - pad.bottom;

  const getX = (idx) => pad.left + (idx / (points.length - 1)) * plotW;
  const getYDepth = (val) => pad.top + plotH - (val / maxDepthVal) * plotH;

  // Paths
  const depthPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getYDepth(p.depth)}`)
    .join(' ');

  const depthArea = `${depthPath} L ${getX(points.length - 1)} ${pad.top + plotH} L ${pad.left} ${pad.top + plotH} Z`;

  const hoveredData = hoverIndex !== null ? points[hoverIndex] : points[Math.round(points.length * 0.3)];

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Hydrograph &amp; Inundation Recession Curve
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                12-HR HYDRODYNAMICS
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Synchronous rainfall hyetograph against runoff routing and overland storage drainage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-[10px] text-blue-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/40 inline-block" /> Rain (mm/h)
          </span>
          <span className="flex items-center gap-1 text-[10px] text-purple">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple inline-block" /> Surcharge Depth (cm)
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative border border-border rounded-xl bg-canvas p-2 overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <line
              key={i}
              x1={pad.left}
              y1={pad.top + plotH * pct}
              x2={pad.left + plotW}
              y2={pad.top + plotH * pct}
              stroke="#2e2b36"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
          ))}

          {/* Rainfall Hyetograph (Bars descending from top) */}
          {points.map((p, idx) => {
            const barW = (plotW / points.length) * 0.7;
            const barH = (p.rain / maxRainVal) * (plotH * 0.45);
            return (
              <rect
                key={`rain-${idx}`}
                x={getX(idx) - barW / 2}
                y={pad.top}
                width={barW}
                height={barH}
                fill="#38BDF8"
                opacity="0.35"
                rx="1"
              />
            );
          })}

          {/* Depth Area & Line */}
          <path d={depthArea} fill="url(#depthGradient)" />
          <path d={depthPath} fill="none" stroke="#8B5CF6" strokeWidth="2.2" />

          {/* Interactive Hover Point Indicator */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={pad.top}
                x2={getX(hoverIndex)}
                y2={pad.top + plotH}
                stroke="#A78BFA"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getYDepth(points[hoverIndex].depth)}
                r="4.5"
                fill="#8B5CF6"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Transparent Hover Hitbox Columns */}
          {points.map((_, idx) => (
            <rect
              key={`hit-${idx}`}
              x={getX(idx) - plotW / points.length / 2}
              y={pad.top}
              width={plotW / points.length}
              height={plotH}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(idx)}
            />
          ))}

          {/* Axes labels */}
          <text x={pad.left - 5} y={pad.top + 8} fill="#706B78" fontSize="9" textAnchor="end" fontFamily="monospace">
            {maxDepthVal.toFixed(0)}cm
          </text>
          <text x={pad.left - 5} y={pad.top + plotH} fill="#706B78" fontSize="9" textAnchor="end" fontFamily="monospace">
            0cm
          </text>
          <text x={pad.left} y={svgHeight - 6} fill="#706B78" fontSize="9" textAnchor="start" fontFamily="monospace">
            T+0h
          </text>
          <text x={pad.left + plotW / 2} y={svgHeight - 6} fill="#706B78" fontSize="9" textAnchor="middle" fontFamily="monospace">
            T+6h Peak
          </text>
          <text x={pad.left + plotW} y={svgHeight - 6} fill="#706B78" fontSize="9" textAnchor="end" fontFamily="monospace">
            T+12h Recession
          </text>
        </svg>
      </div>

      {/* Scrubber Readout */}
      {hoveredData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
            <span className="text-[10px] text-ink-secondary block">Timeline Offset</span>
            <strong className="text-ink">+{hoveredData.hour} hrs ({hoveredData.time})</strong>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
            <span className="text-[10px] text-ink-secondary block">Rainfall Rate</span>
            <strong className="text-blue-400">{hoveredData.rain} mm/h</strong>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
            <span className="text-[10px] text-ink-secondary block">Hydrodynamic Depth</span>
            <strong className="text-purple">{hoveredData.depth} cm</strong>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
            <span className="text-[10px] text-ink-secondary block">Inflow Q_in</span>
            <strong className="text-status-alert">{hoveredData.qIn} m³/s</strong>
          </div>
        </div>
      )}
    </div>
  );
}
