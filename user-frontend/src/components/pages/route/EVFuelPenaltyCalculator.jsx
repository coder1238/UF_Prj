import React, { useState } from 'react';
import { Fuel, BatteryCharging, Zap, Gauge, AlertTriangle } from 'lucide-react';

export default function EVFuelPenaltyCalculator({
  activeCorridor,
  vehicleType
}) {
  const [engineType, setEngineType] = useState('ice'); // 'ice' or 'ev'

  const waterDepth = activeCorridor?.maxWaterDepthCm || 4;
  const distanceKm = activeCorridor?.distanceKm || 11.4;

  // Hydrodynamic resistance drag equations:
  // Extra drag factor scales quadratically with water depth above 5cm
  const dragFactor = waterDepth <= 2 ? 0.04 : (waterDepth / 20) * 0.35;
  const extraFuelLitres = ((distanceKm * 0.08) * (1 + dragFactor) - (distanceKm * 0.08)).toFixed(2);
  const extraKwh = ((distanceKm * 0.16) * (1 + dragFactor) - (distanceKm * 0.16)).toFixed(2);
  const extraCostInr = Math.round(extraFuelLitres * 104);

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">ENERGY & HYDRODYNAMIC DRAG</span>
          <h3 className="text-sm font-extrabold text-ink">Fuel & EV Battery Surcharge</h3>
        </div>
        <div className="flex items-center border border-border rounded-xl overflow-hidden text-[10px] font-mono">
          <button
            onClick={() => setEngineType('ice')}
            className={`px-2.5 py-1 font-bold transition flex items-center gap-1 ${
              engineType === 'ice' ? 'bg-ink text-white' : 'bg-canvas text-ink-muted'
            }`}
          >
            <Fuel className="w-3 h-3" /> ICE Petrol
          </button>
          <button
            onClick={() => setEngineType('ev')}
            className={`px-2.5 py-1 font-bold transition flex items-center gap-1 ${
              engineType === 'ev' ? 'bg-primary text-white' : 'bg-canvas text-ink-muted'
            }`}
          >
            <Zap className="w-3 h-3" /> EV Battery
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-secondary">
        Wading through standing water causes significant viscous resistance and air conditioning demister battery consumption.
      </p>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Hydro Drag</span>
          <span className="font-extrabold text-sm text-ink">+{(dragFactor * 100).toFixed(0)}%</span>
          <span className="text-[9px] text-ink-muted block">Wheel Resistance</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Extra Energy</span>
          <span className="font-extrabold text-sm text-primary">
            {engineType === 'ice' ? `+${extraFuelLitres} L` : `+${extraKwh} kWh`}
          </span>
          <span className="text-[9px] text-ink-muted block">Water Displacement</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Est. Cost Surge</span>
          <span className="font-extrabold text-sm text-emerald-700">₹ {extraCostInr}</span>
          <span className="text-[9px] text-ink-muted block">Fuel Loss / Wear</span>
        </div>
      </div>
    </div>
  );
}
