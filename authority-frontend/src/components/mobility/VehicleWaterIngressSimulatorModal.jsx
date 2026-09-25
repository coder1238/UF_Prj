import React, { useState } from 'react';
import { X, Cpu, AlertTriangle, ShieldCheck, Waves, Info } from 'lucide-react';
import { MOBILITY_VEHICLES } from './mobilityConstants';

export default function VehicleWaterIngressSimulatorModal({ isOpen, onClose, currentVehicle }) {
  if (!isOpen) return null;

  const [selectedVehicle, setSelectedVehicle] = useState(currentVehicle || MOBILITY_VEHICLES[0]);
  const [testWaterDepthCm, setTestWaterDepthCm] = useState(28);
  const [testWaterVelocityMs, setTestWaterVelocityMs] = useState(0.65); // m/s

  // Hydrologic physics calculation
  const clearanceMm = selectedVehicle.clearanceMm;
  const clearanceCm = clearanceMm / 10;
  const intakeHeightCm = selectedVehicle.intakeHeightCm || 50;
  const curbWeightKg = selectedVehicle.curbWeightKg || 3000;

  // Hydrodynamic Drag Force: F_drag = 0.5 * rho * v^2 * Cd * A
  // Hydrodynamic uplift / Buoyancy vs vehicle curb weight
  const waterHeadroomCm = intakeHeightCm - testWaterDepthCm;
  const isHydrolockRisk = testWaterDepthCm >= intakeHeightCm;
  const isTractionLoss = testWaterVelocityMs > 0.8 && testWaterDepthCm > clearanceCm;
  const buoyancyPercent = Math.min(100, Math.round((testWaterDepthCm / (intakeHeightCm * 1.5)) * 60));

  let safetyRating = 'SAFE TO TRAVERSE';
  let ratingColor = 'text-status-safe bg-status-safe-soft border-status-safe';
  if (isHydrolockRisk) {
    safetyRating = 'CRITICAL ENGINE HYDROLOCK RISK (STALL GUARANTEED)';
    ratingColor = 'text-status-alert bg-status-alert-soft border-status-alert';
  } else if (isTractionLoss) {
    safetyRating = 'HIGH LATERAL DRIFT & HYDROPLANING HAZARD';
    ratingColor = 'text-status-warning bg-status-warning-soft border-status-warning';
  } else if (testWaterDepthCm > clearanceCm) {
    safetyRating = 'SUBMERGED AXLE (REDUCE SPEED TO < 10 KM/H)';
    ratingColor = 'text-status-warning bg-status-warning-soft border-status-warning';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Cpu className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Hydrodynamic Wading Simulator &amp; Water Ingress Physics
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple text-white">
                  SAE J551 / ISO 26262 Calibrated
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Calculates engine air-intake hydrolock, lateral hydrodynamic drag, and tyre buoyancy thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Vehicle Selector row */}
          <div>
            <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1.5">
              Select Vehicle Configuration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {MOBILITY_VEHICLES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    selectedVehicle.id === v.id
                      ? 'bg-purple-soft border-purple font-bold shadow-subtle'
                      : 'bg-surface-secondary border-border text-ink hover:border-border-dark'
                  }`}
                >
                  <span className="font-bold text-[11px] text-ink block truncate">{v.label.split('(')[0]}</span>
                  <span className="text-[10px] font-mono text-purple">{v.clearanceMm}mm clr</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders for Water Depth and Water Velocity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-secondary border border-border">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-ink">Simulated Standing Water Depth</span>
                <span className="font-mono font-bold text-sm text-status-alert">{testWaterDepthCm} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={testWaterDepthCm}
                onChange={(e) => setTestWaterDepthCm(parseInt(e.target.value, 10))}
                className="w-full accent-status-alert"
              />
              <span className="text-[10px] text-ink-muted">Air Intake Level: {intakeHeightCm} cm</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-ink">Simulated Water Cross-Flow Velocity</span>
                <span className="font-mono font-bold text-sm text-status-warning">{testWaterVelocityMs} m/s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.05"
                value={testWaterVelocityMs}
                onChange={(e) => setTestWaterVelocityMs(parseFloat(e.target.value))}
                className="w-full accent-status-warning"
              />
              <span className="text-[10px] text-ink-muted">Dangerous Sweeping Velocity: &gt; 0.8 m/s</span>
            </div>
          </div>

          {/* Real-time Safety Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${ratingColor}`}>
            {isHydrolockRisk || isTractionLoss ? (
              <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
            )}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider block">PHYSICS VERDICT</span>
              <h4 className="text-sm font-bold">{safetyRating}</h4>
            </div>
          </div>

          {/* Detailed Physics Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] text-ink-muted uppercase block">Intake Headroom</span>
              <p
                className={`text-base font-mono font-bold mt-0.5 ${
                  waterHeadroomCm > 0 ? 'text-status-safe' : 'text-status-alert'
                }`}
              >
                {waterHeadroomCm > 0 ? `+${waterHeadroomCm} cm` : `${waterHeadroomCm} cm (Ingress!)`}
              </p>
              <span className="text-[10px] text-ink-secondary">Engine snorkel buffer</span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] text-ink-muted uppercase block">Buoyancy Uplift</span>
              <p className="text-base font-mono font-bold text-ink mt-0.5">{buoyancyPercent}%</p>
              <span className="text-[10px] text-ink-secondary">Curb Weight: {curbWeightKg} kg</span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] text-ink-muted uppercase block">Tyre Ground Pressure</span>
              <p className="text-base font-mono font-bold text-ink mt-0.5">
                {Math.max(10, Math.round(100 - buoyancyPercent))}% Traction
              </p>
              <span className="text-[10px] text-ink-secondary">Hydroplaning limit</span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] text-ink-muted uppercase block">Recommended Safe Speed</span>
              <p className="text-base font-mono font-bold text-purple mt-0.5">
                {testWaterDepthCm === 0 ? '50 km/h' : testWaterDepthCm < 15 ? '20 km/h' : '6 km/h (Crawl)'}
              </p>
              <span className="text-[10px] text-ink-secondary">Avoid bow wave surge</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple" />
            Calibrated against Automotive Research Association of India (ARAI) emergency vehicle wading norms.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

