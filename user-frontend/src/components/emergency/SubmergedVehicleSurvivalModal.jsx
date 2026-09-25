import React, { useState } from 'react';
import { 
  Car, AlertOctagon, ShieldAlert, CheckCircle2, 
  HelpCircle, X, ChevronRight, Gauge, Droplet, ArrowUpCircle 
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function SubmergedVehicleSurvivalModal({ isOpen, onClose }) {
  const [activePhase, setActivePhase] = useState(1);
  const [windowBroken, setWindowBroken] = useState(false);
  const [vehicleWaterDepth, setVehicleWaterDepth] = useState(40); // cm

  if (!isOpen) return null;

  const handleSimulateWindowPunch = () => {
    emergencyAudio.playRadioBurst();
    setWindowBroken(true);
    setTimeout(() => {
      emergencyAudio.playCountdownBeep(980);
    }, 400);
  };

  // Buoyancy physics calculation
  const carWeightKg = 1200; // typical sedan
  const displacedVolumeLiters = vehicleWaterDepth * 40; // rough hull displacement
  const buoyantForceKg = displacedVolumeLiters;
  const netGripKg = Math.max(0, carWeightKg - buoyantForceKg);
  const gripPercentage = Math.round((netGripKg / carWeightKg) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Car className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">Feature #08</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800">
                  Hydrodynamic Physics
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Submerged Vehicle Extrication Simulator</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hydrodynamic Physics Calculator */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                Vehicle Water Ingress vs Hydrodynamic Grip:
              </span>
              <span className="text-xs font-mono text-white font-bold">{vehicleWaterDepth} cm Water Depth</span>
            </div>

            <input 
              type="range"
              min="10"
              max="120"
              value={vehicleWaterDepth}
              onChange={(e) => setVehicleWaterDepth(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">BUOYANT UPLIFT</span>
                <span className="text-amber-400 font-bold text-sm">+{buoyantForceKg} kg</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TIRE TRACTION</span>
                <span className={`font-bold text-sm ${gripPercentage < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {gripPercentage}% Remaining
                </span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CURRENT HAZARD</span>
                <span className={`font-bold text-xs ${vehicleWaterDepth >= 45 ? 'text-red-400' : 'text-amber-400'}`}>
                  {vehicleWaterDepth >= 60 ? 'SWEPT AWAY' : vehicleWaterDepth >= 30 ? 'FLOATING HAZARD' : 'PASSABLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Escape Timeline Phase Navigation */}
          <div className="space-y-4">
            <div className="flex gap-2">
              {[
                { phase: 1, label: 'Phase 1: Floating (0-60s)' },
                { phase: 2, label: 'Phase 2: Sinking (60-120s)' },
                { phase: 3, label: 'Phase 3: Submerged Equalization' }
              ].map(p => (
                <button
                  key={p.phase}
                  onClick={() => setActivePhase(p.phase)}
                  className={`flex-1 py-2 px-2 text-center rounded-xl border font-mono text-xs font-bold transition-all ${
                    activePhase === p.phase
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Active Phase Details */}
            {activePhase === 1 && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> 1. UNBUCKLE SEATBELT IMMEDIATELY
                </div>
                <p>
                  As soon as water touches the vehicle floor, unbuckle yourself and children (oldest to youngest). Modern vehicle door electronics remain functional for approximately 60 seconds after water ingress. Roll down both side windows at once before the electrical system short-circuits.
                </p>
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200">
                  <strong>CRITICAL WARNING:</strong> Never attempt to push open the car door during this phase. Water pressure on the outside holds doors closed with up to 600 kg of hydrostatic force.
                </div>
              </div>
            )}

            {activePhase === 2 && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> 2. HEADREST PRONG SHATTER TECHNIQUE
                </div>
                <p>
                  If power windows fail, remove the front seat headrest. Its two hardened steel prongs are engineered emergency egress tools. Jam one prong into the bottom corner seam of the side window and pry forcefully towards the door frame to shatter the tempered glass.
                </p>

                {/* Interactive Glass Punch Simulator */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Interactive Glass Punch Drill:
                  </span>
                  <button
                    onClick={handleSimulateWindowPunch}
                    className={`px-6 py-2.5 rounded-xl font-mono font-bold text-xs transition-all ${
                      windowBroken 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'
                    }`}
                  >
                    {windowBroken ? 'Tempered Glass Shattered ✓ — Egress Cleared' : 'Strike Lower Window Corner With Metal Prong'}
                  </button>
                  <p className="text-[10px] text-slate-500">
                    *Never strike the windshield (it is laminated safety glass and will not shatter). Strike side or rear windows.
                  </p>
                </div>
              </div>
            )}

            {activePhase === 3 && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> 3. PRESSURE EQUALIZATION EGRESS
                </div>
                <p>
                  If windows could not be broken, stay calm and allow cabin water to rise to chest/chin level. Once interior water level nears exterior water level, the pressure equalizes (delta P = 0). Take a deep breath, unlock the door, push hard with your shoulder, and swim upward following the path of rising air bubbles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

