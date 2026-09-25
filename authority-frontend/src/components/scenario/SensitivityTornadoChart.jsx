import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function SensitivityTornadoChart({ scenarioParams }) {
  // Sensitivity factors (elasticity of delta depth in cm per ±20% parameter swing)
  const baseDepth = 42 + (scenarioParams.rainfallIntensity - 50) * 0.4;

  const factors = [
    {
      name: 'Rainfall Intensity (mm/h)',
      low: -+(baseDepth * 0.22).toFixed(1),
      high: +(baseDepth * 0.26).toFixed(1),
      elasticity: 'HIGH ELASTICITY (0.84)',
      color: 'bg-red-500',
    },
    {
      name: 'Sea Outfall Tide Level (m MSL)',
      low: -+(baseDepth * 0.16).toFixed(1),
      high: +(baseDepth * 0.21).toFixed(1),
      elasticity: 'HIGH ELASTICITY (0.72)',
      color: 'bg-purple',
    },
    {
      name: 'Drainage Siltation Blockage (%)',
      low: -+(baseDepth * 0.12).toFixed(1),
      high: +(baseDepth * 0.15).toFixed(1),
      elasticity: 'MODERATE (0.55)',
      color: 'bg-amber-500',
    },
    {
      name: 'Pumping Operating Capacity (%)',
      low: +(baseDepth * 0.11).toFixed(1),
      high: -+(baseDepth * 0.09).toFixed(1),
      elasticity: 'MODERATE (0.42)',
      color: 'bg-emerald-500',
    },
    {
      name: 'Storm Cell Translation Speed (km/h)',
      low: +(baseDepth * 0.06).toFixed(1),
      high: -+(baseDepth * 0.07).toFixed(1),
      elasticity: 'LOW ELASTICITY (0.22)',
      color: 'bg-blue-500',
    },
  ];

  const maxVal = Math.max(...factors.map((f) => Math.max(Math.abs(f.low), Math.abs(f.high))), 15);

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Hydraulic Sensitivity Tornado Analyzer
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                ±20% SENSITIVITY SWING
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Elasticity of citywide peak inundation depth relative to individual boundary perturbations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-ink-secondary">
          <span>← Depth Reduction (cm)</span>
          <span className="text-border">|</span>
          <span>Depth Increase (cm) →</span>
        </div>
      </div>

      {/* Tornado Rows */}
      <div className="space-y-2.5">
        {factors.map((factor, idx) => {
          const lowPct = (Math.abs(factor.low) / maxVal) * 50;
          const highPct = (Math.abs(factor.high) / maxVal) * 50;

          return (
            <div key={idx} className="p-2 rounded-lg bg-surface-secondary/40 border border-border/60 text-xs font-mono">
              <div className="flex items-center justify-between mb-1.5 text-[11px]">
                <strong className="text-ink">{factor.name}</strong>
                <span className="text-[10px] text-ink-secondary">{factor.elasticity}</span>
              </div>

              {/* Tornado Bar Visualizer (Center Axis at 50%) */}
              <div className="relative h-4 bg-surface rounded flex items-center border border-border/60 overflow-hidden">
                {/* Center baseline divider line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border z-10" />

                {/* Left Swing Bar (Reduction) */}
                <div className="w-1/2 h-full flex justify-end">
                  <div
                    className="h-full bg-status-safe/70 rounded-l"
                    style={{ width: `${lowPct}%` }}
                    title={`-20% Parameter gives ${factor.low}cm change`}
                  />
                </div>

                {/* Right Swing Bar (Increase) */}
                <div className="w-1/2 h-full flex justify-start">
                  <div
                    className="h-full bg-status-alert/70 rounded-r"
                    style={{ width: `${highPct}%` }}
                    title={`+20% Parameter gives +${factor.high}cm change`}
                  />
                </div>
              </div>

              {/* Numbers Below Bar */}
              <div className="flex justify-between text-[10px] text-ink-secondary mt-1">
                <span className="text-status-safe font-bold">{factor.low > 0 ? `+${factor.low}` : factor.low} cm</span>
                <span className="text-[9px] text-ink-muted">Baseline (42 cm)</span>
                <span className="text-status-alert font-bold">+{factor.high} cm</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
