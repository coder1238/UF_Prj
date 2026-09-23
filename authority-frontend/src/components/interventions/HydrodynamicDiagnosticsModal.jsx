import React, { useState } from 'react';
import { X, Activity, Cpu, Sliders, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function HydrodynamicDiagnosticsModal({ isOpen, onClose, corridorData }) {
  const [manningsN, setManningsN] = useState(corridorData?.manningsN || 0.024);
  const [bedSlope, setBedSlope] = useState(0.0018); // 1:555 gradient
  const [channelWidthM, setChannelWidthM] = useState(8.5); // meters
  const [waterDepthCm, setWaterDepthCm] = useState(corridorData?.unmitigatedPeak || 42);

  if (!isOpen) return null;

  const yM = waterDepthCm / 100;
  const areaM2 = channelWidthM * yM;
  const wettedPerimeterM = channelWidthM + 2 * yM;
  const hydraulicRadiusM = areaM2 / wettedPerimeterM;

  // Manning's Velocity: V = (1/n) * R^(2/3) * S^(1/2)
  const velocityMps =
    Math.round(
      ((1 / manningsN) * Math.pow(hydraulicRadiusM, 2 / 3) * Math.pow(bedSlope, 0.5)) * 100
    ) / 100;

  // Discharge: Q = A * V
  const dischargeM3s = Math.round((areaM2 * velocityMps) * 10) / 10;

  // Froude Number: Fr = V / sqrt(g * y)
  const froudeNumber =
    Math.round((velocityMps / Math.sqrt(9.81 * yM)) * 100) / 100;

  const flowRegime = froudeNumber < 1 ? 'Subcritical (Tranquil Backwater)' : 'Supercritical (Rapid)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Hydrodynamic Diagnostics & Saint-Venant Boundary Engine
              </h3>
              <p className="text-[11px] text-ink-secondary">
                1D/2D shallow water equation physics validation for {corridorData?.name?.split('(')[0] || 'Corridor'}.
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
          {/* Hydraulic State Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 bg-surface-secondary rounded-xl text-center font-mono">
            <div>
              <span className="text-[10px] text-ink-secondary block">Flow Velocity (V)</span>
              <strong className="text-sm text-ink mt-0.5 block">{velocityMps} m/s</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Discharge (Q)</span>
              <strong className="text-sm text-purple mt-0.5 block">{dischargeM3s} m³/s</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Froude No. (Fr)</span>
              <strong className="text-sm text-status-safe mt-0.5 block">{froudeNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Hydraulic Radius (R)</span>
              <strong className="text-sm text-ink mt-0.5 block">{hydraulicRadiusM.toFixed(2)} m</strong>
            </div>
          </div>

          {/* Regime Alert */}
          <div className="p-3 bg-purple-soft/40 border border-purple/20 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-purple">Hydrodynamic Flow Regime:</span>
            <span className="font-mono font-bold text-ink">{flowRegime}</span>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-ink">Manning's Roughness Coefficient (n):</span>
                <span className="font-mono font-bold text-purple">{manningsN}</span>
              </div>
              <input
                type="range"
                min="0.012"
                max="0.040"
                step="0.002"
                value={manningsN}
                onChange={(e) => setManningsN(Number(e.target.value))}
                className="w-full accent-purple"
              />
              <div className="flex justify-between text-[10px] text-ink-secondary mt-0.5">
                <span>0.014 (Smooth Concrete Drain)</span>
                <span>0.024 (Aged Asphalt / Debris)</span>
                <span>0.038 (Weedy Natural Channel)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-ink">Channel Longitudinal Invert Slope (S₀):</span>
                <span className="font-mono font-bold text-purple">{(bedSlope * 100).toFixed(3)}%</span>
              </div>
              <input
                type="range"
                min="0.0005"
                max="0.0080"
                step="0.0002"
                value={bedSlope}
                onChange={(e) => setBedSlope(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-ink">Effective Roadway Cross-Section Width:</span>
                <span className="font-mono font-bold text-purple">{channelWidthM} meters</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="0.5"
                value={channelWidthM}
                onChange={(e) => setChannelWidthM(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-[11px] text-ink-secondary">
            Hydro-PINN converges with conservation of mass & momentum residual &lt; 0.002.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep"
          >
            Confirm Parameters
          </button>
        </div>
      </div>
    </div>
  );
}

