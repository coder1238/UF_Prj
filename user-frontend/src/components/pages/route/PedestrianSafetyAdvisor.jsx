import React from 'react';
import { Footprints, AlertTriangle, ShieldCheck, Waves, ExternalLink } from 'lucide-react';

export default function PedestrianSafetyAdvisor({
  vehicleType,
  waterDepthCm = 4,
  waterVelocity = 0.2 // m/s
}) {
  const isVulnerableMode = vehicleType === 'pedestrian' || vehicleType === 'two-wheeler';

  // Hydrodynamic stability metric: Product of water depth (m) and velocity (m/s)
  // Human wading limit is generally d * v < 0.35 m^2/s for adults, 0.20 for children/elderly
  const depthM = waterDepthCm / 100;
  const stabilityProduct = (depthM * waterVelocity).toFixed(3);
  const isKnockdownHazard = stabilityProduct > 0.08 || waterDepthCm > 20;

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-purple-600" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">HUMAN HYDRODYNAMICS</span>
            <h4 className="text-xs font-bold text-ink">Pedestrian & 2-Wheeler Stability Index</h4>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
          isKnockdownHazard 
            ? 'bg-rose-100 text-rose-800 border-rose-300' 
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {isKnockdownHazard ? 'KNOCKDOWN RISK' : 'WALKABLE STABLE'}
        </span>
      </div>

      <p className="text-xs text-ink-secondary">
        Flowing water exerts surprising hydraulic force. Just 15cm of swift water can sweep adults off their feet or wash away scooters.
      </p>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Hydraulic Metric</span>
          <span className="font-extrabold text-sm text-ink">{stabilityProduct} <span className="text-[10px] font-normal">m²/s</span></span>
          <span className="text-[9px] text-ink-muted block">Depth × Velocity</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Current Speed</span>
          <span className="font-extrabold text-sm text-primary">{waterVelocity} m/s</span>
          <span className="text-[9px] text-ink-muted block">Runoff Velocity</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Skywalk / FOB</span>
          <span className="font-extrabold text-sm text-emerald-700">Available</span>
          <span className="text-[9px] text-ink-muted block">Elevated Walkway</span>
        </div>
      </div>

      {isVulnerableMode && (
        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pedestrian Safe Route Notice:</strong> Use the Metro Line 6 and JVLR elevated Foot-Over-Bridges (FOBs) equipped with safety handrails to cross low basins safely.
          </div>
        </div>
      )}
    </div>
  );
}
