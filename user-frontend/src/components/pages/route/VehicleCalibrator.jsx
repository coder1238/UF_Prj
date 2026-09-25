import React from 'react';
import { Car, Bike, Bus, ShieldAlert, Footprints, Truck, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

const VEHICLES = [
  { id: 'sedan', label: 'Sedan', icon: Car, defaultClearance: 15, intakeHeight: 28, description: 'Standard ground clearance. Low air-intake.' },
  { id: 'two-wheeler', label: '2-Wheeler', icon: Bike, defaultClearance: 12, intakeHeight: 22, description: 'High stability risk in water currents >0.3 m/s.' },
  { id: 'suv', label: 'SUV / 4x4', icon: Truck, defaultClearance: 22, intakeHeight: 42, description: 'High ground clearance and snorkel intake ready.' },
  { id: 'ev-auto', label: 'EV Rickshaw', icon: Zap, defaultClearance: 14, intakeHeight: 20, description: 'IP67 battery tray, avoid standing water >15cm.' },
  { id: 'bus', label: 'City Bus', icon: Bus, defaultClearance: 32, intakeHeight: 65, description: 'Heavy diesel transit. Can forge water up to 32cm.' },
  { id: 'emergency', label: 'Ambulance', icon: ShieldAlert, defaultClearance: 20, intakeHeight: 38, description: 'Priority life-support response vehicle.' },
  { id: 'pedestrian', label: 'Walk', icon: Footprints, defaultClearance: 8, intakeHeight: 15, description: 'Pedestrian wading limit before hydrodynamic knock-down.' }
];

export default function VehicleCalibrator({
  vehicleType,
  setVehicleType,
  clearanceThreshold,
  setClearanceThreshold,
  maxRouteWater = 4
}) {
  const currentVehicle = VEHICLES.find(v => v.id === vehicleType) || VEHICLES[0];
  const intakeHeight = currentVehicle.intakeHeight;

  // Hydrostatic lock stall calculation
  const depthDiff = clearanceThreshold - maxRouteWater;
  let stallRiskLabel = 'MINIMAL RISK';
  let stallRiskColor = 'text-emerald-700 bg-emerald-100 border-emerald-300';
  let stallRiskScore = 4; // %

  if (maxRouteWater > intakeHeight) {
    stallRiskLabel = 'CATASTROPHIC STALL (ENGINE FLOOD)';
    stallRiskColor = 'text-rose-900 bg-rose-200 border-rose-400';
    stallRiskScore = 98;
  } else if (maxRouteWater > clearanceThreshold) {
    stallRiskLabel = 'HIGH STALL & EXHAUST BACKPRESSURE';
    stallRiskColor = 'text-rose-700 bg-rose-100 border-rose-300';
    stallRiskScore = 78;
  } else if (maxRouteWater > clearanceThreshold * 0.7) {
    stallRiskLabel = 'MODERATE PONDING RISK';
    stallRiskColor = 'text-amber-700 bg-amber-100 border-amber-300';
    stallRiskScore = 35;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">VEHICLE HYDROSTATIC CALIBRATOR</span>
          <h3 className="text-sm font-extrabold text-ink">Mobility Profile & Ground Clearance</h3>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
          {clearanceThreshold} cm Limit
        </span>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
        {VEHICLES.map(v => {
          const Icon = v.icon;
          const isSelected = vehicleType === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setVehicleType(v.id);
                setClearanceThreshold(v.defaultClearance);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                isSelected
                  ? 'bg-primary text-white border-primary font-bold shadow-sm'
                  : 'bg-canvas text-ink-secondary hover:bg-surface-secondary border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Clearance Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-ink-secondary">Ground Clearance Calibrator:</span>
          <span className="font-extrabold text-ink">{clearanceThreshold} cm</span>
        </div>
        <input
          type="range"
          min="6"
          max="45"
          value={clearanceThreshold}
          onChange={(e) => setClearanceThreshold(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-canvas rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted">
          <span>6 cm (Low Sedan / Wading)</span>
          <span>Air Intake: ~{intakeHeight} cm</span>
          <span>45 cm (Heavy Bus)</span>
        </div>
      </div>

      {/* Hydrostatic Risk Meter Bar */}
      <div className="p-3 rounded-xl border bg-canvas space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-ink">Engine Hydrostatic Stall Risk:</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${stallRiskColor}`}>
            {stallRiskLabel}
          </span>
        </div>

        {/* Visual Gauge */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
          <div 
            className={`h-full transition-all duration-500 ${
              stallRiskScore > 70 ? 'bg-rose-500' : stallRiskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${stallRiskScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted">
          <span>Route Peak Water: <strong className="text-ink">{maxRouteWater} cm</strong></span>
          <span>Vehicle Clearance: <strong className="text-ink">{clearanceThreshold} cm</strong></span>
          <span>Safety Delta: <strong className={depthDiff >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
            {depthDiff >= 0 ? `+${depthDiff} cm safe` : `${depthDiff} cm exceed`}
          </strong></span>
        </div>
      </div>
    </div>
  );
}
