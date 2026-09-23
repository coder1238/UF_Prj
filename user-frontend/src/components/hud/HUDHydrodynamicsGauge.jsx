import React, { useState } from 'react';
import { Waves, AlertTriangle, ShieldCheck, HelpCircle, Activity } from 'lucide-react';

export default function HUDHydrodynamicsGauge({
  depth = 18, // cm
  vehicleType = 'sedan',
  clearanceLimit = 16 // cm
}) {
  const [velocity, setVelocity] = useState(0.48); // m/s current speed
  const [showPhysicsBreakdown, setShowPhysicsBreakdown] = useState(false);

  // Vehicle curb weight & lateral surface constants
  const vehicleSpecs = {
    hatchback: { weight: 1050, width: 1.68, cd: 0.85, limit: 14 },
    sedan: { weight: 1350, width: 1.78, cd: 0.82, limit: 16 },
    suv: { weight: 1850, width: 1.90, cd: 0.90, limit: 22 },
    heavy: { weight: 4200, width: 2.20, cd: 1.05, limit: 35 },
    ev: { weight: 1750, width: 1.82, cd: 0.78, limit: 15 }
  };

  const spec = vehicleSpecs[vehicleType] || vehicleSpecs.sedan;

  // Hydrodynamic Drag Force Calculation: Fd = 0.5 * rho * Cd * A * v^2
  // Submerged frontal/lateral projected area (m^2)
  const submergedHeightM = Math.min(1.2, depth / 100);
  const projectedArea = spec.width * submergedHeightM;
  const waterDensity = 1020; // kg/m^3 (sediment-laden storm runoff)
  const dragForceNewtons = Math.round(0.5 * waterDensity * spec.cd * projectedArea * (velocity * velocity));

  // Displaced buoyancy volume (approx cubic meters)
  const displacedVolumeM3 = Math.max(0, (depth - 10) / 100) * (spec.width * 2.5) * 0.4;
  const buoyantForceNewtons = Math.round(displacedVolumeM3 * waterDensity * 9.81);
  const vehicleGravityNewtons = spec.weight * 9.81;

  // Net tire downward normal force
  const netNormalForce = Math.max(0, vehicleGravityNewtons - buoyantForceNewtons);
  const tireAdhesionPercent = Math.max(0, Math.min(100, Math.round((netNormalForce / vehicleGravityNewtons) * 100)));

  // Risk categorization
  let riskStatus = 'SAFE';
  let riskColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
  let riskText = 'Solid Road Grip — Low Hydrodynamic Drag';

  if (depth > clearanceLimit + 10 || tireAdhesionPercent < 45 || dragForceNewtons > 1200) {
    riskStatus = 'CRITICAL';
    riskColor = 'text-red-400 bg-red-500/20 border-red-500/40 animate-pulse';
    riskText = 'CATACLYSMIC BUOYANCY — Vehicle Floats & Slides';
  } else if (depth > clearanceLimit || tireAdhesionPercent < 70 || dragForceNewtons > 500) {
    riskStatus = 'CAUTION';
    riskColor = 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    riskText = 'Hydrodynamic Slip Risk — Reduce Speed to <10 km/h';
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
            Current Hydrodynamics & Buoyancy
          </span>
        </div>
        <button
          onClick={() => setShowPhysicsBreakdown(!showPhysicsBreakdown)}
          className="text-muted hover:text-white text-[11px] font-mono flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Physics</span>
        </button>
      </div>

      {/* Main Gauges */}
      <div className="grid grid-cols-3 gap-2 my-3 text-center">
        {/* Flow Velocity */}
        <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
          <span className="text-[10px] text-muted font-mono block uppercase">Water Flow</span>
          <span className="text-lg font-mono font-extrabold text-cyan-300">{velocity.toFixed(2)}</span>
          <span className="text-[10px] text-muted block">m/s current</span>
        </div>

        {/* Drag Force */}
        <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
          <span className="text-[10px] text-muted font-mono block uppercase">Lateral Thrust</span>
          <span className="text-lg font-mono font-extrabold text-amber-300">{dragForceNewtons}</span>
          <span className="text-[10px] text-muted block">Newtons force</span>
        </div>

        {/* Tire Adhesion */}
        <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
          <span className="text-[10px] text-muted font-mono block uppercase">Tire Traction</span>
          <span className={`text-lg font-mono font-extrabold ${tireAdhesionPercent < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
            {tireAdhesionPercent}%
          </span>
          <span className="text-[10px] text-muted block">road adhesion</span>
        </div>
      </div>

      {/* Flow Velocity Slider adjuster */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[10px] font-mono text-muted">
          <span>Flow Speed Simulator:</span>
          <span>{velocity.toFixed(2)} m/s ({Math.round(velocity * 3.6)} km/h)</span>
        </div>
        <input 
          type="range"
          min="0.1"
          max="2.5"
          step="0.05"
          value={velocity}
          onChange={(e) => setVelocity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Dynamic Traction Assessment Box */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${riskColor}`}>
        {riskStatus === 'CRITICAL' ? (
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
        ) : (
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
        )}
        <div className="leading-tight">
          <div className="font-bold font-mono uppercase text-[11px] tracking-wide">{riskStatus} TRACTION LEVEL</div>
          <div className="text-[11px] opacity-90">{riskText}</div>
        </div>
      </div>

      {/* Physics Breakdown Drawer */}
      {showPhysicsBreakdown && (
        <div className="mt-3 p-3 bg-black/60 rounded-xl border border-white/10 text-[10px] font-mono text-muted space-y-1.5 animate-fadeIn">
          <div className="flex justify-between">
            <span>Vehicle Mass & Gravity:</span>
            <span className="text-white font-bold">{spec.weight} kg ({Math.round(vehicleGravityNewtons)} N)</span>
          </div>
          <div className="flex justify-between">
            <span>Displaced Water Buoyancy:</span>
            <span className="text-amber-300 font-bold">{buoyantForceNewtons} N upward lift</span>
          </div>
          <div className="flex justify-between">
            <span>Critical Float Velocity:</span>
            <span className="text-cyan-300 font-bold">{(Math.sqrt((spec.weight * 0.3) / (spec.cd * projectedArea * 500))).toFixed(2)} m/s</span>
          </div>
          <p className="text-[9px] text-slate-400 italic pt-1 border-t border-white/5">
            USGS & NDMA guideline: Just 30cm (1 foot) of fast-moving water exerts up to 1,500 lbs of lateral force on cars.
          </p>
        </div>
      )}
    </div>
  );
}

