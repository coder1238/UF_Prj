import React, { useState } from 'react';
import {
  X,
  Droplets,
  TrendingUp,
  Activity,
  Gauge,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function PrecipitationWaterBudgetModal({ isOpen, onClose }) {
  const [meanRainRate, setMeanRainRate] = useState(58.4); // mm/hr
  const totalAreaKm2 = 437.7; // Greater Mumbai BMC Area

  if (!isOpen) return null;

  // Mass rate calculations:
  // 1 mm of rain over 1 km2 = 1,000 m3 = 1,000 metric tons
  // Total metric tons per hour = meanRainRate * totalAreaKm2 * 1000
  const totalTonsPerHour = Math.round(meanRainRate * totalAreaKm2 * 1000);
  const kilotonsPerMin = Math.round((totalTonsPerHour / 60 / 1000) * 10) / 10;
  const m3PerSecondFlux = Math.round((totalTonsPerHour / 3600) * 10) / 10;

  // Drainage capacity: Total MCGM outfall pump stations = 680 m3/s
  const municipalPumpCapM3s = 680;
  const netDeficitM3s = Math.round((m3PerSecondFlux * 0.75 - municipalPumpCapM3s) * 10) / 10;
  const isDeficit = netDeficitM3s > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Atmospheric Water Budget &amp; Municipal Drainage Deficit
              </h3>
              <p className="text-xs text-ink-secondary">
                Metropolitan mass precipitation flux vs stormwater pumping capacity
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
          {/* Interactive Rain Rate Slider */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-ink uppercase">Domain-Averaged Rainfall Intensity</span>
              <span className="font-bold text-purple bg-surface px-2 py-0.5 rounded border border-border">
                {meanRainRate.toFixed(1)} mm/hr
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="1"
              value={meanRainRate}
              onChange={(e) => setMeanRainRate(Number(e.target.value))}
              className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
              <span>10 mm/h (Light)</span>
              <span>60 mm/h (Severe Torrential)</span>
              <span>120 mm/h (Extreme Cloudburst)</span>
            </div>
          </div>

          {/* Mass Rate Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Mass Precipitation Rate</div>
              <div className="text-2xl font-mono font-bold text-ink mt-1">
                {kilotonsPerMin} <span className="text-xs font-normal text-ink-secondary">kt/min</span>
              </div>
              <div className="text-[10px] font-mono text-ink-secondary mt-0.5">
                {(totalTonsPerHour / 1000000).toFixed(2)} Million metric tons/hr
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Overland Runoff Flux</div>
              <div className="text-2xl font-mono font-bold text-purple mt-1">
                {Math.round(m3PerSecondFlux * 0.75)} <span className="text-xs font-normal text-ink-secondary">m³/s</span>
              </div>
              <div className="text-[10px] font-mono text-ink-secondary mt-0.5">
                75% Urban Impervious Runoff
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Pumping Balance</div>
              <div className={`text-2xl font-mono font-bold mt-1 ${isDeficit ? 'text-status-alert' : 'text-status-safe'}`}>
                {isDeficit ? `-${netDeficitM3s}` : `+${Math.abs(netDeficitM3s)}`} <span className="text-xs font-normal text-ink-secondary">m³/s</span>
              </div>
              <div className={`text-[10px] font-mono font-bold mt-0.5 ${isDeficit ? 'text-status-alert' : 'text-status-safe'}`}>
                {isDeficit ? 'PUMPING DEFICIT (PONDING)' : 'SURPLUS CAPACITY'}
              </div>
            </div>
          </div>

          {/* Major Retention Tanks Status */}
          <div className="border border-border rounded-xl p-3.5 bg-surface-secondary flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-ink">
              Subsurface Holding Tanks Utilization
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-ink-secondary mb-1">
                  <span>Hindmata Underground Retention Tanks (2 × 1.5 Cr Liters):</span>
                  <strong className="text-status-alert">84% FULL (1.8m head)</strong>
                </div>
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
                  <div className="bg-status-alert h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-ink-secondary mb-1">
                  <span>Gandhi Market Holding Sump (1.2 Cr Liters):</span>
                  <strong className="text-status-warning">72% FULL</strong>
                </div>
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
                  <div className="bg-status-warning h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            MCGM Stormwater Hydraulic Master Plan Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

