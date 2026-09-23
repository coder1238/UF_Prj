import React from 'react';
import { Shield } from 'lucide-react';

export default function ResilienceSpiderRadar({
  scenarioParams,
  mitigationDepthCm = 0,
}) {
  // Compute 6 indices (0-100 score, 100 = optimal resilient, 0 = complete breakdown)
  const stress = (scenarioParams.rainfallIntensity - 50) * 0.5 + scenarioParams.drainBlockage * 0.4 - mitigationDepthCm * 0.8;

  const baselineScores = [88, 82, 90, 85, 80, 86];
  const scenarioScores = [
    Math.max(15, Math.min(100, Math.round(88 - stress * 0.8))), // Drainage Adequacy
    Math.max(10, Math.min(100, Math.round(82 - stress * 1.1))), // Mobility Continuity
    Math.max(25, Math.min(100, Math.round(90 - stress * 0.6))), // Power Grid Resilience
    Math.max(20, Math.min(100, Math.round(85 - stress * 0.75))), // Healthcare Access
    Math.max(15, Math.min(100, Math.round(80 - stress * 0.95))), // Evacuation Clearance
    Math.max(20, Math.min(100, Math.round(86 - stress * 0.7))), // Asset Protection
  ];

  const axes = [
    { label: 'Drainage Adequacy', desc: 'Sump head & sluice discharge' },
    { label: 'Mobility Continuity', desc: 'Arterial road & rail clearance' },
    { label: 'Power Grid Resilience', desc: 'Substation dry margin' },
    { label: 'Healthcare Access', desc: 'Hospital ambulance ingress' },
    { label: 'Evac Clearance Margin', desc: 'Shelter route accessibility' },
    { label: 'Asset Protection', desc: 'Critical infrastructure safety' },
  ];

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const angleStep = (Math.PI * 2) / axes.length;

  const getCoord = (idx, value) => {
    const angle = idx * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: +(center + r * Math.cos(angle)).toFixed(1),
      y: +(center + r * Math.sin(angle)).toFixed(1),
    };
  };

  const baselinePoly = baselineScores
    .map((val, idx) => {
      const c = getCoord(idx, val);
      return `${c.x},${c.y}`;
    })
    .join(' ');

  const scenarioPoly = scenarioScores
    .map((val, idx) => {
      const c = getCoord(idx, val);
      return `${c.x},${c.y}`;
    })
    .join(' ');

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Multi-Domain Resilience Radar
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                6-AXIS URBAN AUDIT
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Holistic baseline vs stress-test index across critical municipal sectors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-[10px] text-status-safe">
            <span className="w-2.5 h-2.5 rounded-sm bg-status-safe/40 border border-status-safe inline-block" /> Baseline
          </span>
          <span className="flex items-center gap-1 text-[10px] text-status-alert">
            <span className="w-2.5 h-2.5 rounded-sm bg-status-alert/40 border border-status-alert inline-block" /> Scenario
          </span>
        </div>
      </div>

      {/* Spider Chart & Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Spider */}
        <div className="relative shrink-0">
          <svg width={size} height={size} className="select-none">
            {/* Concentric Polygons */}
            {[25, 50, 75, 100].map((level) => {
              const polyPoints = axes
                .map((_, idx) => {
                  const c = getCoord(idx, level);
                  return `${c.x},${c.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={polyPoints}
                  fill="none"
                  stroke="#2e2b36"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Spokes */}
            {axes.map((_, idx) => {
              const c = getCoord(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={c.x}
                  y2={c.y}
                  stroke="#2e2b36"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Baseline Polygon */}
            <polygon
              points={baselinePoly}
              fill="#10B981"
              fillOpacity="0.15"
              stroke="#10B981"
              strokeWidth="1.8"
            />

            {/* Scenario Polygon */}
            <polygon
              points={scenarioPoly}
              fill="#EF4444"
              fillOpacity="0.25"
              stroke="#EF4444"
              strokeWidth="2"
            />

            {/* Data Points */}
            {scenarioScores.map((val, idx) => {
              const c = getCoord(idx, val);
              return (
                <circle
                  key={idx}
                  cx={c.x}
                  cy={c.y}
                  r="3.5"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
              );
            })}
          </svg>
        </div>

        {/* Axis Metrics Breakdown */}
        <div className="flex-1 w-full space-y-2 text-xs font-mono">
          {axes.map((axis, i) => {
            const baseVal = baselineScores[i];
            const scenVal = scenarioScores[i];
            const delta = scenVal - baseVal;

            return (
              <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-surface-secondary/40 border border-border/60">
                <div>
                  <span className="text-ink font-semibold block text-[11px]">{axis.label}</span>
                  <span className="text-[9px] text-ink-muted">{axis.desc}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-ink">{scenVal} / 100</span>
                  <span className={`text-[10px] block font-bold ${delta < 0 ? 'text-status-alert' : 'text-status-safe'}`}>
                    {delta < 0 ? `${delta}` : `+${delta}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
