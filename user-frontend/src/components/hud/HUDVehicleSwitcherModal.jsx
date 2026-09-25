import React from 'react';
import { 
  X, Car, Bike, Truck, Zap, ShieldCheck, 
  AlertTriangle, CheckCircle, Info 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export const VEHICLE_PROFILES = [
  {
    id: 'hatchback',
    name: 'Compact Hatchback',
    icon: Car,
    clearance: 14,
    intakeHeight: 38,
    exhaustHeight: 28,
    evBatteryRisk: false,
    weightKg: 1050,
    desc: 'Low ground clearance. Engine will intake water in depths over 14cm.',
    safeDepth: 12
  },
  {
    id: 'sedan',
    name: 'Executive Sedan',
    icon: Car,
    clearance: 16,
    intakeHeight: 44,
    exhaustHeight: 32,
    evBatteryRisk: false,
    weightKg: 1350,
    desc: 'Moderate ground clearance. Safe on light surface ponding.',
    safeDepth: 15
  },
  {
    id: 'suv',
    name: 'Compact / Mid SUV',
    icon: Truck,
    clearance: 22,
    intakeHeight: 65,
    exhaustHeight: 42,
    evBatteryRisk: false,
    weightKg: 1850,
    desc: 'Elevated stance. Capable of fording moderate street puddles up to 22cm.',
    safeDepth: 20
  },
  {
    id: 'heavy',
    name: '4x4 Rescue / Ambulance',
    icon: Truck,
    clearance: 35,
    intakeHeight: 85,
    exhaustHeight: 60,
    evBatteryRisk: false,
    weightKg: 3200,
    desc: 'Heavy-duty disaster response vehicle. High wading capacity.',
    safeDepth: 32
  },
  {
    id: 'ev',
    name: 'Electric Vehicle (EV)',
    icon: Zap,
    clearance: 15,
    intakeHeight: 999, // No air intake
    exhaustHeight: 999, // No exhaust
    evBatteryRisk: true,
    weightKg: 1750,
    desc: 'Sealed IP67 floor battery pack. High-voltage isolation trip risk in standing water.',
    safeDepth: 14
  }
];

export default function HUDVehicleSwitcherModal({
  isOpen = false,
  onClose = () => {},
  currentVehicleId = 'sedan',
  onSelectVehicle = () => {}
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Vehicle Clearance & Engine Calibrator</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Calibrates dynamic safe depth limits and hydrostatic stall warnings
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle List */}
        <div className="space-y-3 my-4">
          {VEHICLE_PROFILES.map(veh => {
            const Icon = veh.icon;
            const isSelected = currentVehicleId === veh.id;

            return (
              <div
                key={veh.id}
                onClick={() => {
                  hudAudio.playTurnChime();
                  onSelectVehicle(veh);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-purple-primary/20 border-purple-primary shadow-lg ring-1 ring-purple-primary' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-purple-primary text-white' : 'bg-white/10 text-muted'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{veh.name}</span>
                        {veh.evBatteryRisk && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            EV Pack Warning
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{veh.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-mono font-extrabold text-purple-soft">
                      {veh.clearance} <span className="text-xs font-normal text-muted">cm limit</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted block">
                      Mass: {veh.weightKg} kg
                    </span>
                  </div>
                </div>

                {/* Additional Spec Bars */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/5 text-[11px] font-mono text-muted">
                  <div>
                    <span>Intake Level: </span>
                    <strong className="text-white">{veh.intakeHeight === 999 ? 'N/A' : `${veh.intakeHeight} cm`}</strong>
                  </div>
                  <div>
                    <span>Exhaust Tail: </span>
                    <strong className="text-white">{veh.exhaustHeight === 999 ? 'N/A' : `${veh.exhaustHeight} cm`}</strong>
                  </div>
                  <div className="text-right">
                    <span>Safe Wading: </span>
                    <strong className="text-emerald-400">≤ {veh.safeDepth} cm</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
          <span>HUD thresholds recalculate immediately upon selection.</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold"
          >
            Apply Profile
          </button>
        </div>

      </div>
    </div>
  );
}

