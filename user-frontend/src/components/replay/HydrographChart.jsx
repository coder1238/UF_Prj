import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, Waves, CloudRain } from 'lucide-react';

export default function HydrographChart({ 
  timelineSteps, 
  currentStepIndex, 
  onSelectIndex, 
  whatIfModifiers 
}) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;

  // Chart dimensions
  const width = 600;
  const height = 220;
  const padding = { top: 25, right: 35, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max values
  const maxRain = Math.max(...timelineSteps.map(s => s.rain), 120);
  const rawDepths = timelineSteps.map(s => s.depth);
  const adjustedDepths = timelineSteps.map(s => Math.round(s.depth * depthFactor));
  const maxDepth = Math.max(...rawDepths, 80);

  // Coordinate mappers
  const getX = (idx) => padding.left + (idx / (timelineSteps.length - 1)) * graphWidth;
  const getYRain = (val) => padding.top + (val / maxRain) * (graphHeight * 0.45); // Hyetograph hanging from top
  const getYDepth = (val) => padding.top + graphHeight - (val / maxDepth) * (graphHeight * 0.85);

  // Generate SVG path for depth curve
  const points = adjustedDepths.map((d, idx) => `${getX(idx)},${getYDepth(d)}`).join(' L ');
  const areaPath = `M ${getX(0)},${padding.top + graphHeight} L ${points} L ${getX(adjustedDepths.length - 1)},${padding.top + graphHeight} Z`;

  // Baseline comparison path if what-if is active
  const hasWhatIf = depthFactor !== 1;
  const rawPoints = rawDepths.map((d, idx) => `${getX(idx)},${getYDepth(d)}`).join(' L ');

  // Danger threshold Y coordinates
  const stallY = getYDepth(35);
  const floatY = getYDepth(60);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Dual-Axis Hydrodynamics Chart
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Rainfall Hyetograph vs Basin Water Depth Hydrograph
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500/80 inline-block" />
            <span className="text-slate-600">Rain (mm/h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-purple-600 rounded-full inline-block" />
            <span className="text-purple-700 font-bold">Simulated Depth (cm)</span>
          </div>
          {hasWhatIf && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-red-400 inline-block" />
              <span className="text-red-500">Unmitigated Baseline</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-56 select-none cursor-pointer"
        >
          {/* Grid lines */}
          <line 
            x1={padding.left} 
            y1={padding.top + graphHeight} 
            x2={width - padding.right} 
            y2={padding.top + graphHeight} 
            stroke="#e2e8f0" 
            strokeWidth="1" 
          />

          {/* Engine Stall Threshold (35cm) */}
          {stallY >= padding.top && stallY <= padding.top + graphHeight && (
            <g>
              <line 
                x1={padding.left} 
                y1={stallY} 
                x2={width - padding.right} 
                y2={stallY} 
                stroke="#f59e0b" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <text 
                x={width - padding.right + 4} 
                y={stallY + 3} 
                fill="#d97706" 
                fontSize="9" 
                fontFamily="monospace"
              >
                35cm Stall
              </text>
            </g>
          )}

          {/* Vehicle Flotation Threshold (60cm) */}
          {floatY >= padding.top && floatY <= padding.top + graphHeight && (
            <g>
              <line 
                x1={padding.left} 
                y1={floatY} 
                x2={width - padding.right} 
                y2={floatY} 
                stroke="#ef4444" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <text 
                x={width - padding.right + 4} 
                y={floatY + 3} 
                fill="#dc2626" 
                fontSize="9" 
                fontFamily="monospace"
              >
                60cm Float
              </text>
            </g>
          )}

          {/* Inverted Rainfall Hyetograph Bars */}
          {timelineSteps.map((step, idx) => {
            const x = getX(idx);
            const barW = Math.max(12, graphWidth / (timelineSteps.length * 2.2));
            const barH = getYRain(step.rain) - padding.top;
            return (
              <rect
                key={idx}
                x={x - barW / 2}
                y={padding.top}
                width={barW}
                height={barH}
                fill="#60a5fa"
                opacity={idx === currentStepIndex ? 0.9 : 0.45}
                rx="2"
              />
            );
          })}

          {/* Unmitigated baseline curve if what-if active */}
          {hasWhatIf && (
            <path
              d={`M ${rawPoints}`}
              fill="none"
              stroke="#f87171"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
          )}

          {/* Water Depth Area Fill & Gradient Curve */}
          <defs>
            <linearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#depthGradient)" />
          <path d={`M ${points}`} fill="none" stroke="#7c3aed" strokeWidth="3" />

          {/* Interactive Step Circles */}
          {timelineSteps.map((step, idx) => {
            const x = getX(idx);
            const y = getYDepth(adjustedDepths[idx]);
            const isCurrent = idx === currentStepIndex;

            return (
              <g 
                key={idx} 
                onClick={() => onSelectIndex(idx)}
                className="cursor-pointer group"
              >
                {/* Vertical time marker line */}
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + graphHeight}
                  stroke={isCurrent ? '#8b5cf6' : '#f1f5f9'}
                  strokeWidth={isCurrent ? 2 : 1}
                  strokeDasharray={isCurrent ? 'none' : '2 2'}
                />

                {/* Point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 7 : 4}
                  fill={isCurrent ? '#7c3aed' : '#ffffff'}
                  stroke="#7c3aed"
                  strokeWidth={isCurrent ? 3 : 2}
                  className="transition-all"
                />

                {/* X Axis Time label */}
                <text
                  x={x}
                  y={padding.top + graphHeight + 18}
                  fill={isCurrent ? '#7c3aed' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {step.time}
                </text>
              </g>
            );
          })}

          {/* Current Scrubber Indicator Callout */}
          {(() => {
            const cx = getX(currentStepIndex);
            const cy = getYDepth(adjustedDepths[currentStepIndex]);
            const currentStep = timelineSteps[currentStepIndex];
            return (
              <g pointerEvents="none">
                <rect
                  x={Math.max(padding.left, Math.min(cx - 45, width - padding.right - 90))}
                  y={Math.max(10, cy - 28)}
                  width="90"
                  height="22"
                  rx="6"
                  fill="#1e1b4b"
                />
                <text
                  x={Math.max(padding.left, Math.min(cx - 45, width - padding.right - 90)) + 45}
                  y={Math.max(10, cy - 28) + 15}
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {adjustedDepths[currentStepIndex]} cm | {currentStep.rain} mm/h
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
      <p className="text-[11px] text-muted font-mono mt-2 text-center">
        Click any node on the timeline curve to scrub directly to that meteorological phase.
      </p>
    </div>
  );
}

