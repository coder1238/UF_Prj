import React, { useState } from 'react';
import { Gauge, AlertTriangle, ShieldCheck, UserCheck, Activity, Info, RefreshCw } from 'lucide-react';

export default function HydrodynamicDragCalculator() {
  const [depthCm, setDepthCm] = useState(35);
  const [velocity, setVelocity] = useState(1.2);
  const [bodyWeight, setBodyWeight] = useState(70);
  const [stance, setStance] = useState('braced'); // 'stride', 'braced', 'lifting'
  const [surface, setSurface] = useState('silted'); // 'asphalt', 'silted', 'algae'

  // Physics calculation
  const rho = 1000; // Water density kg/m3
  const g = 9.81;

  // Stance factors
  const stanceConfig = {
    stride: { label: 'Walking Stride (Forward)', cd: 1.2, widthM: 0.32, balanceFactor: 1.0 },
    braced: { label: 'Sideways Braced (Low Profile)', cd: 0.85, widthM: 0.22, balanceFactor: 1.4 },
    lifting: { label: 'Single-Foot Lifted (High Risk)', cd: 1.3, widthM: 0.35, balanceFactor: 0.6 }
  };

  const surfaceMu = {
    asphalt: { label: 'Dry/Clean Asphalt', mu: 0.65 },
    silted: { label: 'Silted Monsoon Tarmac', mu: 0.32 },
    algae: { label: 'Algae / Wet Paver Blocks', mu: 0.18 }
  };

  const currentStance = stanceConfig[stance];
  const currentMu = surfaceMu[surface].mu;

  // Submerged depth in meters
  const depthM = depthCm / 100;

  // Projected frontal area A = depth * width
  const area = Math.min(depthM * currentStance.widthM, 0.55);

  // Buoyant volume estimation (approx cylinder for legs/body)
  const legVolume = Math.min(depthM * 0.025, 0.055); // cubic meters
  const buoyantForceN = rho * g * legVolume;
  const buoyantWeightKg = buoyantForceN / g;

  // Effective weight on ground
  const effectiveWeightKg = Math.max(bodyWeight - buoyantWeightKg, 5);
  const normalForceN = effectiveWeightKg * g;

  // Maximum resisting friction before slip
  const maxFrictionN = normalForceN * currentMu;

  // Drag force Fd = 0.5 * rho * v^2 * Cd * A
  const dragForceN = 0.5 * rho * Math.pow(velocity, 2) * currentStance.cd * area;
  const dragForceKgf = dragForceN / g;

  // Overturning moment around base (arm is depth / 2)
  const leverArmM = depthM * 0.55;
  const tippingMomentNm = dragForceN * leverArmM;

  // Resistance moment: body weight * stance base half-width
  const baseHalfWidthM = stance === 'braced' ? 0.35 : stance === 'stride' ? 0.22 : 0.10;
  const resistingMomentNm = normalForceN * baseHalfWidthM * currentStance.balanceFactor;

  // Stability Index (Ratio of Drag to Friction and Tipping)
  const forceRatio = dragForceN / maxFrictionN;
  const momentRatio = tippingMomentNm / resistingMomentNm;
  const riskScore = Math.max(forceRatio, momentRatio);

  let status = {
    title: 'STABLE WADING CLEARANCE',
    badge: 'SAFE',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    description: 'Ground friction comfortably exceeds water lateral drag. Maintain three-point stick contact.'
  };

  if (riskScore >= 1.2 || depthCm >= 75) {
    status = {
      title: 'IMMINENT TIPPING / SWEPT AWAY',
      badge: 'LETHAL RISK',
      color: 'text-red-700 bg-red-50 border-red-300',
      description: 'Drag force and overturning moment exceed human stability. Foot traction is zero. DO NOT ENTER.'
    };
  } else if (riskScore >= 0.8 || depthCm >= 45) {
    status = {
      title: 'SLIPPAGE & INSTABILITY THRESHOLD',
      badge: 'HIGH DANGER',
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      description: 'Lateral drag force approaches maximum frictional adhesion. Any misstep will cause a fall.'
    };
  } else if (riskScore >= 0.5) {
    status = {
      title: 'MODERATE RESISTANCE (PROCEED CAUTIOUSLY)',
      badge: 'CAUTION',
      color: 'text-blue-800 bg-blue-50 border-blue-300',
      description: 'Water pressure noticeable against shins. Walk sideways with feet parallel to current.'
    };
  }

  const handleReset = () => {
    setDepthCm(30);
    setVelocity(1.0);
    setBodyWeight(70);
    setStance('braced');
    setSurface('silted');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-primary uppercase tracking-wider">
            <Gauge className="w-4 h-4" /> Feature 01: Hydrodynamic Human Kinematics Engine
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Human Lateral Drag & Hydrodynamic Tipping Force Calculator
          </h2>
          <p className="text-xs text-muted mt-1">
            Computes whether moving water will overpower normal friction and topple an adult based on fluid drag (Fd = 0.5 · ρ · v² · Cd · A).
          </p>
        </div>
        <button
          onClick={handleReset}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Water Depth Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Water Depth on Road: <span className="text-purple-primary font-extrabold">{depthCm} cm</span> ({((depthCm)/30.48).toFixed(1)} ft)
              </label>
              <span className="text-[11px] font-mono text-muted">
                {depthCm < 20 ? 'Ankle Level' : depthCm < 45 ? 'Knee Level' : depthCm < 70 ? 'Thigh Level' : 'Waist/Chest Level'}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              step="1"
              value={depthCm}
              onChange={e => setDepthCm(Number(e.target.value))}
              className="w-full accent-purple-primary h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>5 cm (Pavement)</span>
              <span>30 cm (Knee)</span>
              <span>60 cm (Thigh)</span>
              <span>95 cm (Chest)</span>
            </div>
          </div>

          {/* Flow Velocity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Water Flow Velocity: <span className="text-purple-primary font-extrabold">{velocity.toFixed(1)} m/s</span> ({(velocity * 3.6).toFixed(1)} km/h)
              </label>
              <span className="text-[11px] font-mono text-muted">
                {velocity < 0.6 ? 'Sluggish Runoff' : velocity < 1.5 ? 'Moderate Street Current' : velocity < 2.5 ? 'Torrential Cloudburst' : 'Flash Surge Bore'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.5"
              step="0.1"
              value={velocity}
              onChange={e => setVelocity(Number(e.target.value))}
              className="w-full accent-purple-primary h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>0.2 m/s (Slow)</span>
              <span>1.5 m/s (Standard Runoff)</span>
              <span>2.5 m/s (Dangerous Torrent)</span>
              <span>3.5 m/s (Flash Wave)</span>
            </div>
          </div>

          {/* Person Body Mass Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Body Mass of Person: <span className="text-purple-primary font-extrabold">{bodyWeight} kg</span>
              </label>
              <span className="text-[11px] font-mono text-muted">
                {bodyWeight < 50 ? 'Lightweight / Adolescent' : bodyWeight < 80 ? 'Standard Adult' : 'Heavy Build'}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="2"
              value={bodyWeight}
              onChange={e => setBodyWeight(Number(e.target.value))}
              className="w-full accent-purple-primary h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Stance & Road Surface Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Wading Stance</label>
              <select
                value={stance}
                onChange={e => setStance(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary"
              >
                <option value="braced">Sideways Low-Profile Braced (Cd = 0.85)</option>
                <option value="stride">Forward Walking Stride (Cd = 1.20)</option>
                <option value="lifting">Single-Foot Lifted / Running (Cd = 1.30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Ground Roadbed Surface</label>
              <select
                value={surface}
                onChange={e => setSurface(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary"
              >
                <option value="silted">Silted Monsoon Tarmac (μ = 0.32)</option>
                <option value="asphalt">Dry / Coarse Asphalt (μ = 0.65)</option>
                <option value="algae">Muddy Algae Cobblestones (μ = 0.18)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Physics Gauge & Output Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className={`p-5 rounded-2xl border ${status.color} transition-all`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/70">
                {status.badge}
              </span>
              <span className="text-xs font-mono font-bold">
                Instability Index: {riskScore.toFixed(2)}x
              </span>
            </div>

            <h3 className="text-base font-extrabold mt-2 leading-snug">{status.title}</h3>
            <p className="text-xs mt-1.5 leading-relaxed">{status.description}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-current/15 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase block opacity-75">Lateral Drag Force</span>
                <span className="text-base font-extrabold">{dragForceN.toFixed(0)} N</span>
                <span className="text-[10px] block opacity-75">({dragForceKgf.toFixed(1)} kgf push)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block opacity-75">Max Resisting Grip</span>
                <span className="text-base font-extrabold">{maxFrictionN.toFixed(0)} N</span>
                <span className="text-[10px] block opacity-75">({(maxFrictionN/g).toFixed(1)} kgf friction)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block opacity-75">Buoyant Lift</span>
                <span className="text-sm font-bold">-{buoyantWeightKg.toFixed(1)} kg</span>
                <span className="text-[10px] block opacity-75">effective: {effectiveWeightKg.toFixed(1)} kg</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block opacity-75">Tipping Moment</span>
                <span className="text-sm font-bold">{tippingMomentNm.toFixed(0)} N·m</span>
                <span className="text-[10px] block opacity-75">limit: {resistingMomentNm.toFixed(0)} N·m</span>
              </div>
            </div>
          </div>

          {/* Visual Mini Representation */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
              <span>Wading Stance Cross-Section</span>
              <span>Depth × Velocity: <strong className="text-ink">{(depthM * velocity).toFixed(2)} m²/s</strong></span>
            </div>
            
            {/* Visual Water Height Bar */}
            <div className="relative h-14 bg-slate-200 rounded-xl overflow-hidden flex items-end">
              <div 
                className="absolute inset-0 bg-blue-500/30 transition-all duration-300"
                style={{ height: `${Math.min((depthCm / 100) * 100, 100)}%` }}
              >
                <div className="w-full h-1.5 bg-blue-500 animate-pulse"></div>
              </div>

              <div className="relative z-10 w-full px-3 py-1 flex justify-between items-center text-[11px] font-mono font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Submerged: {depthCm} cm
                </span>
                <span className={velocity > 1.8 ? 'text-red-600' : 'text-slate-600'}>
                  Current: {velocity} m/s
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-2 leading-relaxed">
              <strong>Rule of Hydrology:</strong> When the product of Depth (m) × Velocity (m/s) exceeds <strong>0.6 m²/s</strong>, even fit adults lose footing. At <strong>0.8 m²/s</strong>, rescue boats are required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
