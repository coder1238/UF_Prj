import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Footprints, Info } from 'lucide-react';

export default function StepPotentialVisualizer() {
  const [voltageLevel, setVoltageLevel] = useState('11000'); // 230, 415, 11000, 33000
  const [waterSalinity, setWaterSalinity] = useState('runoff'); // 'rainwater', 'runoff', 'brackish'
  const [distanceFromPoint, setDistanceFromPoint] = useState(3.5); // meters
  const [locomotion, setLocomotion] = useState('stride'); // 'stride' (80cm), 'short' (30cm), 'shuffle' (5cm), 'hop' (0cm)

  const voltageConfigs = {
    '230': { label: '230V Domestic Single-Phase Wire', v: 230, current: 40 },
    '415': { label: '415V Industrial / DP Box Feeder', v: 415, current: 150 },
    '11000': { label: '11 kV Municipal Overhead Line', v: 11000, current: 800 },
    '33000': { label: '33 kV Sub-transmission Feeder', v: 33000, current: 2000 }
  };

  const salinityResistivity = {
    rainwater: { label: 'Fresh Rainwater (Low Conductivity)', rho: 120 },
    runoff: { label: 'Urban Sewage Runoff (High Salinity)', rho: 25 },
    brackish: { label: 'Coastal / Creek Brackish Water (Extreme)', rho: 4 }
  };

  const locomotionConfig = {
    stride: { label: 'Normal Walking Stride', strideM: 0.80 },
    short: { label: 'Short Cautious Step', strideM: 0.30 },
    shuffle: { label: 'Tightly Shuffled Feet (Sliding)', strideM: 0.05 },
    hop: { label: 'Single-Leg Hopping (One Foot)', strideM: 0.0 }
  };

  const currentV = voltageConfigs[voltageLevel];
  const currentRho = salinityResistivity[waterSalinity].rho;
  const currentStride = locomotionConfig[locomotion].strideM;

  // Potential V(x) = (rho * I) / (2 * pi * x)
  const calcPotential = (x) => {
    if (x <= 0.2) return currentV.v;
    const calc = (currentRho * currentV.current) / (2 * Math.PI * x);
    return Math.min(calc, currentV.v);
  };

  const vFoot1 = calcPotential(distanceFromPoint);
  const vFoot2 = calcPotential(distanceFromPoint + currentStride);
  const stepVoltage = Math.abs(vFoot1 - vFoot2);

  // Safe exclusion radius: where Vstep for 0.8m stride drops below 50V
  let safeRadius = 1.0;
  for (let r = 0.5; r <= 30; r += 0.5) {
    const v1 = (currentRho * currentV.current) / (2 * Math.PI * r);
    const v2 = (currentRho * currentV.current) / (2 * Math.PI * (r + 0.8));
    if (Math.abs(v1 - v2) <= 50) {
      safeRadius = r;
      break;
    }
  }

  let hazard = {
    level: 'SAFE CLEARANCE (<50V)',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    desc: 'Potential difference across your legs is below the human ventricular fibrillation threshold.'
  };

  if (stepVoltage >= 250) {
    hazard = {
      level: 'LETHAL CARDIAC ARREST (>250V)',
      color: 'text-red-700 bg-red-50 border-red-300',
      desc: 'Sufficient current drives through the pelvic core to induce involuntary muscle lock and ventricular fibrillation.'
    };
  } else if (stepVoltage >= 50) {
    hazard = {
      level: 'SEVERE MUSCLE TETANY & SHOCK (50V - 250V)',
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      desc: 'Causes painful involuntary leg contractions, causing the victim to fall. Once submerged, chest immersion is fatal.'
    };
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Feature 04: High-Voltage Electrical Field Visualizer
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Step Potential & Equipotential Voltage Gradient Calculator
          </h2>
          <p className="text-xs text-muted mt-1">
            Simulates radial voltage drop curves from downed conductors (Vstep = [ρ · I / 2π] · [1/x - 1/(x+s)]) and demonstrates why single-leg hopping prevents electrocution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Sliders and Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Voltage Selection */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Conductor Source Voltage</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(voltageConfigs).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setVoltageLevel(key)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    voltageLevel === key
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-canvas text-ink border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] truncate">{val.label}</div>
                  <span className={`text-[10px] font-mono block ${voltageLevel === key ? 'text-amber-100' : 'text-muted'}`}>
                    Peak: {val.v >= 1000 ? `${val.v/1000} kV` : `${val.v} V`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Distance From Submerged Conductor: <span className="text-amber-600 font-extrabold">{distanceFromPoint.toFixed(1)} meters</span>
              </label>
              <span className="text-[11px] font-mono text-muted">
                Safe Exclusion Radius: &gt;{safeRadius.toFixed(1)}m
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.1"
              value={distanceFromPoint}
              onChange={e => setDistanceFromPoint(Number(e.target.value))}
              className="w-full accent-amber-500 h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>0.5 m (Lethal Core)</span>
              <span>5.0 m</span>
              <span>10.0 m</span>
              <span>15.0 m (Far Field)</span>
            </div>
          </div>

          {/* Stride & Locomotion Mode */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Locomotion Stride Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(locomotionConfig).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setLocomotion(key)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    locomotion === key
                      ? 'bg-purple-primary text-white border-purple-primary shadow-xs'
                      : 'bg-canvas text-ink border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5" />
                    <span>{val.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono block mt-0.5 ${locomotion === key ? 'text-purple-100' : 'text-muted'}`}>
                    Leg Spread: {val.strideM * 100} cm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Water Salinity */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Water Salinity & Conductivity</label>
            <select
              value={waterSalinity}
              onChange={e => setWaterSalinity(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-amber-500"
            >
              {Object.entries(salinityResistivity).map(([k, v]) => (
                <option key={k} value={k}>{v.label} (ρ = {v.rho} Ω·m)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hazard Output and Visual Rings */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className={`p-5 rounded-2xl border ${hazard.color}`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80 block">
              Calculated Step Potential
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold">{stepVoltage.toFixed(0)} Volts</span>
              <span className="text-xs font-mono opacity-80">across legs</span>
            </div>

            <span className="text-xs font-extrabold block mt-2 uppercase">{hazard.level}</span>
            <p className="text-xs mt-1 leading-snug">{hazard.desc}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-current/15 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase opacity-75">Near Foot V(x)</span>
                <span className="text-sm font-extrabold">{vFoot1.toFixed(0)} V</span>
              </div>
              <div>
                <span className="text-[10px] uppercase opacity-75">Far Foot V(x+s)</span>
                <span className="text-sm font-extrabold">{vFoot2.toFixed(0)} V</span>
              </div>
            </div>
          </div>

          {/* Concentric Voltage Gradient Diagram */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Radial Equipotential Rings Simulation
            </span>

            {/* Visual concentric circles */}
            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
              {/* Outer Safe Ring */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/40 bg-emerald-500/5"></div>
              {/* Mid Danger Ring */}
              <div className="absolute inset-4 rounded-full border border-amber-500/50 bg-amber-500/10"></div>
              {/* Inner Lethal Ring */}
              <div className="absolute inset-10 rounded-full border-2 border-red-500/70 bg-red-500/20 animate-pulse"></div>
              {/* Central Conductor Source */}
              <div className="w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24] flex items-center justify-center text-slate-950 font-bold text-[10px]">
                ⚡
              </div>

              {/* User Position Dot */}
              <div 
                className="absolute w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-white shadow-md transition-all duration-300"
                style={{ 
                  transform: `translate(${Math.min(distanceFromPoint * 5.5, 78)}px, 0px)`
                }}
                title={`You are here (${distanceFromPoint}m)`}
              ></div>
            </div>

            <div className="text-[11px] font-mono text-slate-300 leading-snug">
              <strong>Tactical Physics Insight:</strong> When you hop on one single foot, your stride length is 0 cm. Therefore, V_foot1 = V_foot2, and V_step = 0 Volts, completely eliminating electrocution current!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
