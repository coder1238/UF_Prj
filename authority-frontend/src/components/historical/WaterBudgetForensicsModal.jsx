import React, { useState } from 'react';
import { X, Droplets } from 'lucide-react';
import { DRAINAGE_BASINS_BUDGET } from './historicalConstants';

export default function WaterBudgetForensicsModal({ isOpen, onClose }) {
  const [selectedBasinIndex, setSelectedBasinIndex] = useState(0);
  const [simulatedRainfallMm, setSimulatedRainfallMm] = useState(100);

  if (!isOpen) return null;

  const currentBasin = DRAINAGE_BASINS_BUDGET[selectedBasinIndex];

  // Calculate volumetric runoff: Q = C * I * A
  // Area in m2 = areaKm2 * 1,000,000
  // Depth in m = simulatedRainfallMm / 1000
  // Total Vol m3 = Area * Depth * C
  const runoffCoeff = Number(currentBasin.runoffCoeff10Y.split(' -> ')[1]);
  const areaM2 = currentBasin.areaKm2 * 1_000_000;
  const grossRainVolumeM3 = (areaM2 * simulatedRainfallMm) / 1000;
  const netRunoffVolumeM3 = Math.round(grossRainVolumeM3 * runoffCoeff);
  const infiltrationLossM3 = Math.round(grossRainVolumeM3 * (1 - runoffCoeff));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Catchment Water Budget &amp; Runoff Coefficient Forensics
              </h2>
              <p className="text-xs text-ink-secondary">
                Hydrological Basin Volumetric Ingress, Soil Infiltration Deficit &amp; Urban Concretization Shift (2014–2026)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basin Selector Tabs */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {DRAINAGE_BASINS_BUDGET.map((b, idx) => (
            <button
              key={b.basin}
              onClick={() => setSelectedBasinIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                selectedBasinIndex === idx
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {b.basin.split(' ')[0]} Catchment ({b.areaKm2} km²)
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Basin Specs & Interactive Simulator */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left 7 Cols: Basin Volumetric Breakdown */}
            <div className="md:col-span-7 bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h3 className="text-sm font-bold text-ink">{currentBasin.basin}</h3>
                <span className="text-[11px] font-mono text-purple bg-purple-soft px-2 py-0.5 rounded font-bold">
                  Area: {currentBasin.areaKm2} km²
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[10px]">10-Year Impervious Expansion</span>
                  <div className="text-base font-bold text-status-alert mt-0.5">{currentBasin.impervious10YChange}</div>
                  <span className="text-[10px] text-ink-secondary">Urban concrete sprawl</span>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[10px]">Runoff Coefficient Evolution</span>
                  <div className="text-base font-bold text-purple mt-0.5">{currentBasin.runoffCoeff10Y}</div>
                  <span className="text-[10px] text-ink-secondary">Manning overland C</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-ink-secondary">Annual Mean Discharge:</span>
                  <strong className="text-ink">{currentBasin.annualDischargeMm3} Million m³ (Mm³)</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-secondary">Peak Conveyance Capacity:</span>
                  <strong className="text-purple">{currentBasin.peakVolumeRateM3s} m³/s</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-secondary">Tidal Outfall Receptor:</span>
                  <strong className="text-ink">{currentBasin.outfallPoints}</strong>
                </div>
              </div>

              <div className="p-2.5 bg-surface rounded-lg border border-border text-xs">
                <span className="font-bold text-ink block mb-0.5">Critical Hydraulic Bottleneck:</span>
                <span className="text-ink-secondary">{currentBasin.criticalBottleneck}</span>
              </div>
            </div>

            {/* Right 5 Cols: Water Balance Simulator */}
            <div className="md:col-span-5 bg-surface border border-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Storm Runoff Simulator</span>
                  <span className="font-mono text-purple">{simulatedRainfallMm} mm</span>
                </h4>

                <label className="text-[11px] text-ink-secondary block mb-1">
                  Adjust 24h Cumulative Precipitation:
                </label>
                <input
                  type="range"
                  min="25"
                  max="350"
                  step="25"
                  value={simulatedRainfallMm}
                  onChange={(e) => setSimulatedRainfallMm(Number(e.target.value))}
                  className="w-full accent-purple cursor-pointer mb-3"
                />

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-surface-secondary rounded-lg border border-border">
                    <span className="text-ink-secondary text-[10px]">Gross Ingress Volume</span>
                    <div className="text-sm font-bold text-ink">{(grossRainVolumeM3 / 1_000_000).toFixed(2)} Million m³</div>
                  </div>
                  <div className="p-2.5 bg-purple-soft/60 rounded-lg border border-purple/30">
                    <span className="text-purple text-[10px] font-bold">Generated Overland Runoff ({Math.round(runoffCoeff * 100)}%)</span>
                    <div className="text-base font-bold text-purple">{(netRunoffVolumeM3 / 1_000_000).toFixed(2)} Million m³</div>
                  </div>
                  <div className="p-2.5 bg-status-safe-soft rounded-lg border border-status-safe/30">
                    <span className="text-status-safe text-[10px] font-bold">Soil &amp; Canopy Infiltration ({Math.round((1 - runoffCoeff) * 100)}%)</span>
                    <div className="text-sm font-bold text-status-safe">{(infiltrationLossM3 / 1_000_000).toFixed(2)} Million m³</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[10px] font-mono text-ink-secondary">
                At {simulatedRainfallMm} mm downpour, basin generates {(netRunoffVolumeM3 / 1000).toLocaleString()} kiloliters of storm runoff into {currentBasin.outfallPoints}.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Runoff Method: Rational &amp; NRCS-CN Hydrodynamic Modeling</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

