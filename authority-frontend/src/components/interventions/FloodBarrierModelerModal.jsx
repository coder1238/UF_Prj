import React, { useState } from 'react';
import { X, Shield, Sliders, CheckCircle2, AlertTriangle, Layers, Ruler } from 'lucide-react';

export default function FloodBarrierModelerModal({ isOpen, onClose, selectedCorridorName }) {
  const [lengthM, setLengthM] = useState(200);
  const [heightCm, setHeightCm] = useState(65);
  const [waterHeadCm, setWaterHeadCm] = useState(45);
  const [barrierType, setBarrierType] = useState('Rapid Inflatable Polyurethane Berm');

  if (!isOpen) return null;

  // Hydrostatic engineering calculations
  const waterDepthM = waterHeadCm / 100;
  const hydrostaticThrustKnPerM = Math.round(0.5 * 1000 * 9.81 * Math.pow(waterDepthM, 2) / 1000 * 10) / 10;
  const totalThrustKn = Math.round(hydrostaticThrustKnPerM * lengthM * 10) / 10;
  const overturningFactorOfSafety = Math.round((heightCm / Math.max(10, waterHeadCm)) * 1.8 * 10) / 10;
  const seepageRateLps = Math.round(lengthM * 0.08 * (waterHeadCm / 50) * 10) / 10;
  const deflectedRunoffM3h = Math.round(lengthM * 0.015 * 3600 * (waterHeadCm / 50));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Rapid Flood Barrier Deflection & Hydrostatic CAD Modeler
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Surface water perimeter deflection geometry and structural stability audit.
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
          <div className="p-3 bg-surface-secondary rounded-xl border border-border text-xs flex items-center justify-between">
            <span className="font-semibold text-ink">Target Perimeter Location:</span>
            <span className="font-mono text-purple font-bold">{selectedCorridorName}</span>
          </div>

          {/* Barrier Type Selection */}
          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">
              Barrier Core Material
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Rapid Inflatable Polyurethane Berm',
                'Interlocking Aluminum Flood Wall',
                'Geotextile Sandbag Trapezoidal Dike',
                'Self-Rising Buoyant Flood Gate',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBarrierType(type)}
                  className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all ${
                    barrierType === type
                      ? 'border-purple bg-purple-soft/40 text-purple shadow-subtle'
                      : 'border-border bg-white text-ink hover:border-purple/30'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-ink">Deployment Span Length:</span>
                <span className="font-mono font-bold text-purple">{lengthM} meters</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={lengthM}
                onChange={(e) => setLengthM(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-ink">Barrier Retaining Height:</span>
                <span className="font-mono font-bold text-purple">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-ink">Forecast Impounded Water Head:</span>
              <span className="font-mono font-bold text-status-alert">{waterHeadCm} cm</span>
            </div>
            <input
              type="range"
              min="10"
              max={heightCm}
              step="1"
              value={waterHeadCm}
              onChange={(e) => setWaterHeadCm(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Engineering Metrics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 bg-surface-subtle rounded-xl border border-border text-center font-mono">
            <div>
              <span className="text-[10px] text-ink-secondary block">Hydrostatic Load</span>
              <strong className="text-xs text-ink mt-0.5 block">{totalThrustKn} kN</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Safety Factor (FS)</span>
              <strong
                className={`text-xs mt-0.5 block ${
                  overturningFactorOfSafety >= 1.5 ? 'text-status-safe' : 'text-status-alert font-bold'
                }`}
              >
                {overturningFactorOfSafety} {overturningFactorOfSafety >= 1.5 ? '✓ SAFE' : '⚠ MARGINAL'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Seepage Rate</span>
              <strong className="text-xs text-ink mt-0.5 block">{seepageRateLps} L/s</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary block">Deflected Inflow</span>
              <strong className="text-xs text-purple mt-0.5 block">{deflectedRunoffM3h} m³/h</strong>
            </div>
          </div>

          {/* Freeboard Status */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Residual Protective Freeboard:</span>
            <span className="font-mono font-bold text-status-safe">
              +{heightCm - waterHeadCm} cm clearance remaining
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-[11px] text-ink-secondary">
            Complies with FEMA P-259 and IS 11527 flood barrier structural standards.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle"
          >
            Lock Barrier Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}

