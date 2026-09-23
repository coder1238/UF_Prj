import React, { useState, useMemo } from 'react';
import { 
  Sliders, Activity, Layers, Zap, TrendingUp, Droplets, 
  Radio, CheckCircle2, AlertTriangle, RefreshCw, GitBranch, ShieldCheck
} from 'lucide-react';

// ============================================================================
// FEATURE 1: Hydro-PINN Neural Surrogate vs 2D SWE Solver Parity Explorer
// ============================================================================
export function PinnVsSweHeatmapExplorer({ showToast }) {
  const [leadTimeMinutes, setLeadTimeMinutes] = useState(60);
  const [viscosityMultiplier, setViscosityMultiplier] = useState(1.2);
  const [selectedCell, setSelectedCell] = useState({ r: 2, c: 3 });

  // 6x6 spatial grid simulated depth residuals
  const gridCells = useMemo(() => {
    const cells = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const distFromCenter = Math.sqrt(Math.pow(r - 2.5, 2) + Math.pow(c - 2.5, 2));
        const sweDepth = 15 + distFromCenter * 8 + (leadTimeMinutes / 180) * 22;
        const pinnError = (Math.sin(r * 1.5 + c) * 0.8 * viscosityMultiplier).toFixed(2);
        const pinnDepth = (sweDepth + parseFloat(pinnError)).toFixed(1);
        cells.push({
          r,
          c,
          sweDepth: sweDepth.toFixed(1),
          pinnDepth,
          residualCm: Math.abs(parseFloat(pinnError)),
          froude: (0.35 + distFromCenter * 0.08).toFixed(2)
        });
      }
    }
    return cells;
  }, [leadTimeMinutes, viscosityMultiplier]);

  const activeCellData = gridCells.find(
    (cell) => cell.r === selectedCell.r && cell.c === selectedCell.c
  ) || gridCells[0];

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 1 • Physics-Informed ML Surrogate Parity
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Hydro-PINN Neural Surrogate vs 2D Saint-Venant SWE Solver
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe/10 px-2.5 py-1 rounded-lg border border-status-safe/20">
            14.2x ACCELERATION
          </span>
          <span className="font-mono text-[11px] font-bold text-purple bg-purple-soft px-2.5 py-1 rounded-lg border border-purple/30">
            &Delta;M: 0.014% MASS PARITY
          </span>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Hydrodynamic Horizon:</span>
            <strong className="text-purple">+{leadTimeMinutes} Min</strong>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="15"
            value={leadTimeMinutes}
            onChange={(e) => setLeadTimeMinutes(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>

        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Kinematic Eddy Viscosity (&nu;):</span>
            <strong className="text-purple">{viscosityMultiplier.toFixed(2)} m&sup2;/s</strong>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={viscosityMultiplier}
            onChange={(e) => setViscosityMultiplier(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 6x6 Spatial Grid & Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Heatmap Grid (7 cols) */}
        <div className="md:col-span-7 bg-ink p-3 rounded-xl border border-border space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
            <span>Spatial Mesh (6x6 Catchment Sub-Grid)</span>
            <span>Residual Error |PINN - SWE|</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {gridCells.map((c) => {
              const isSelected = selectedCell.r === c.r && selectedCell.c === c.c;
              let bg = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40';
              if (c.residualCm > 1.2) {
                bg = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
              } else if (c.residualCm > 0.6) {
                bg = 'bg-purple-950/80 text-purple-300 border-purple-800/50';
              }
              return (
                <button
                  key={`${c.r}-${c.c}`}
                  onClick={() => {
                    setSelectedCell({ r: c.r, c: c.c });
                    showToast?.(`Selected Mesh Node (${c.r}, ${c.c}): Residual ${c.residualCm} cm`);
                  }}
                  className={`p-2 rounded-lg border text-center transition-all ${bg} ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10' : 'hover:opacity-90'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block">{c.residualCm}</span>
                  <span className="text-[8px] text-white/60 font-mono block">cm &Delta;</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/60 pt-1">
            <span className="text-emerald-400">&bull; &le; 0.6cm (Perfect)</span>
            <span className="text-purple-300">&bull; 0.6 - 1.2cm (Minimal)</span>
            <span className="text-amber-300">&bull; &gt; 1.2cm (Turbulent)</span>
          </div>
        </div>

        {/* Selected Cell Inspector (5 cols) */}
        <div className="md:col-span-5 bg-canvas p-3 rounded-xl border border-border flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-muted font-bold mb-1">
              Active Mesh Node ({activeCellData.r}, {activeCellData.c})
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-border/60 pb-1">
                <span className="text-muted">2D SWE Solver Depth:</span>
                <strong className="text-ink">{activeCellData.sweDepth} cm</strong>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1">
                <span className="text-muted">Hydro-PINN Surrogate:</span>
                <strong className="text-purple">{activeCellData.pinnDepth} cm</strong>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1">
                <span className="text-muted">Absolute Residual:</span>
                <strong className="text-status-safe">{activeCellData.residualCm} cm</strong>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted">Local Froude No.:</span>
                <strong className="text-ink">{activeCellData.froude} (Subcritical)</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => showToast?.(`Recalibrated PINN collocation weights for Node (${activeCellData.r}, ${activeCellData.c})`)}
            className="w-full mt-3 py-1.5 rounded-lg bg-purple text-white text-[11px] font-bold hover:bg-purple-deep flex items-center justify-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Recalibrate Collocation Point
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2: Green-Ampt Dynamic Soil Infiltration & Runoff Tuner
// ============================================================================
export function GreenAmptInfiltrationTuner({ showToast }) {
  const [soilType, setSoilType] = useState('clay_loam'); // clay_loam, sandy_loam, silty_clay, impervious
  const [suctionHeadPsi, setSuctionHeadPsi] = useState(160); // mm
  const [rainfallRate, setRainfallRate] = useState(70); // mm/hr

  const soilParams = {
    sandy_loam: { ks: 21.8, label: 'Sandy Loam (High Infiltration)', initialInfiltration: 45 },
    clay_loam: { ks: 4.2, label: 'Clay Loam (Moderate Infiltration)', initialInfiltration: 18 },
    silty_clay: { ks: 1.5, label: 'Silty Clay (Low Infiltration)', initialInfiltration: 8 },
    impervious: { ks: 0.1, label: 'Paved Urban Concrete (0% Infiltration)', initialInfiltration: 0.5 },
  };

  const currentParam = soilParams[soilType];
  const excessRunoffRate = Math.max(0, rainfallRate - currentParam.ks).toFixed(1);
  const timeToPondingMinutes = Math.max(1, Math.round((suctionHeadPsi * currentParam.ks) / Math.max(1, rainfallRate)));

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 2 • Vadose Zone Infiltration Physics
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Green-Ampt Dynamic Soil Infiltration &amp; Overland Runoff Engine
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe/10 px-2.5 py-1 rounded-lg border border-status-safe/20">
            K_SAT CONVERGENCE: OK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
        {/* Soil Selector */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <label className="text-ink font-bold block">Soil Substrate Class:</label>
          <select
            value={soilType}
            onChange={(e) => {
              setSoilType(e.target.value);
              showToast?.(`Selected ${soilParams[e.target.value].label}`);
            }}
            className="w-full text-xs p-2 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
          >
            {Object.entries(soilParams).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted block">Ks = {currentParam.ks} mm/hr</span>
        </div>

        {/* Suction Head Slider */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Suction Head (&Psi;):</span>
            <strong className="text-purple">{suctionHeadPsi} mm</strong>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={suctionHeadPsi}
            onChange={(e) => setSuctionHeadPsi(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Wetting Front Capillary Suction</span>
        </div>

        {/* Rain Intensity */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Rainfall Rate (i):</span>
            <strong className="text-purple">{rainfallRate} mm/hr</strong>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={rainfallRate}
            onChange={(e) => setRainfallRate(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Instantaneous Storm Inflow</span>
        </div>
      </div>

      {/* Calculated Results Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-canvas border border-border rounded-xl font-mono text-center">
          <span className="text-[10px] text-muted uppercase block">Time to Surface Ponding (tp)</span>
          <span className="text-lg font-bold text-ink block mt-0.5">{timeToPondingMinutes} min</span>
          <span className="text-[10px] text-muted">Saturation transition</span>
        </div>

        <div className="p-3 bg-purple-soft/50 border border-purple/30 rounded-xl font-mono text-center">
          <span className="text-[10px] text-purple uppercase font-bold block">Excess Overland Runoff Rate</span>
          <span className="text-lg font-bold text-purple block mt-0.5">{excessRunoffRate} mm/hr</span>
          <span className="text-[10px] text-muted">Direct street drainage burden</span>
        </div>

        <div className="p-3 bg-canvas border border-border rounded-xl font-mono text-center">
          <span className="text-[10px] text-muted uppercase block">Steady Infiltration Capacity</span>
          <span className="text-lg font-bold text-status-safe block mt-0.5">{currentParam.ks} mm/hr</span>
          <span className="text-[10px] text-muted">Saturated matrix rate</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3: Multi-Doppler Radar & Satellite Ensemble Blending Matrix
// ============================================================================
export function DopplerEnsembleBlendingMatrix({ showToast }) {
  const [colabaWeight, setColabaWeight] = useState(0.45);
  const [veravaliWeight, setVeravaliWeight] = useState(0.35);
  const [insatWeight, setInsatWeight] = useState(0.20);
  const [reflectivityDbz, setReflectivityDbz] = useState(48);

  // Marshall-Palmer Z-R conversion: Z = 200 * R^1.6
  // R = (Z / 200) ^ (1 / 1.6)
  const zLinear = Math.pow(10, reflectivityDbz / 10);
  const rainRateMmHr = Math.pow(zLinear / 200, 1 / 1.6).toFixed(1);

  const normalizedSum = (colabaWeight + veravaliWeight + insatWeight).toFixed(2);

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 3 • Sensor Blending &amp; Convex Fusion
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Dual S-Band Doppler &amp; INSAT-3DR Geostationary Blending Matrix
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe/10 px-2.5 py-1 rounded-lg border border-status-safe/20">
            SUM &Sigma; = {normalizedSum}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
        {/* Colaba Slider */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>IMD Colaba S-Band:</span>
            <strong className="text-purple">{(colabaWeight * 100).toFixed(0)}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={colabaWeight}
            onChange={(e) => setColabaWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">South Mumbai &amp; Harbour Sector</span>
        </div>

        {/* Veravali Slider */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Veravali C-Band:</span>
            <strong className="text-purple">{(veravaliWeight * 100).toFixed(0)}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={veravaliWeight}
            onChange={(e) => setVeravaliWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Western Suburbs &amp; Thane Approach</span>
        </div>

        {/* INSAT Slider */}
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>INSAT-3DR Thermal IR:</span>
            <strong className="text-purple">{(insatWeight * 100).toFixed(0)}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={insatWeight}
            onChange={(e) => setInsatWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Cloud-Top Brightness Temp</span>
        </div>
      </div>

      {/* Reflectivity to Rain Rate Calculator */}
      <div className="p-4 bg-canvas rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="w-full sm:w-1/2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-ink font-bold">Simulated Reflectivity (dBZ):</span>
            <strong className="text-purple">{reflectivityDbz} dBZ</strong>
          </div>
          <input
            type="range"
            min="20"
            max="65"
            step="1"
            value={reflectivityDbz}
            onChange={(e) => setReflectivityDbz(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted">Marshall-Palmer Z-R Model: Z = 200 &times; R^1.6</span>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-2 bg-surface rounded-xl border border-border min-w-[120px]">
            <span className="text-[10px] text-muted uppercase block">Derived Rain Rate</span>
            <span className="text-xl font-bold text-ink block">{rainRateMmHr} <span className="text-xs font-normal">mm/hr</span></span>
          </div>
          <button
            onClick={() => showToast?.(`Applied optimal radar fusion matrix to DGMR input pipeline!`)}
            className="px-4 py-2 bg-purple text-white text-xs font-bold rounded-xl hover:bg-purple-deep transition-colors shadow-subtle"
          >
            Apply Blending
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4: Hydro-PINN Physics Loss & Surcharge Backprop Inspector
// ============================================================================
export function HydroPinnSurchargeBackpropInspector({ showToast }) {
  const [lossDataWeight, setLossDataWeight] = useState(1.0);
  const [lossMassWeight, setLossMassWeight] = useState(2.5);
  const [lossMomWeight, setLossMomWeight] = useState(1.8);
  const [iterationEpoch, setIterationEpoch] = useState(450);

  // Dynamic loss curve calculation
  const totalLoss = (
    0.042 * (1 / (iterationEpoch / 100)) * lossDataWeight +
    0.015 * (1 / (iterationEpoch / 120)) * lossMassWeight +
    0.021 * (1 / (iterationEpoch / 110)) * lossMomWeight
  ).toFixed(5);

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 4 • Gradient Dynamics &amp; PINN Physics Loss
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Hydro-PINN Surcharge Gradient &amp; Backpropagation Inspector
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-purple bg-purple-soft px-2.5 py-1 rounded-lg border border-purple/30">
            TOTAL RESIDUAL: {totalLoss}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>&lambda;_data (Observation Loss):</span>
            <strong className="text-purple">{lossDataWeight.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={lossDataWeight}
            onChange={(e) => setLossDataWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Sensor Ground Truth Anchor</span>
        </div>

        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>&lambda;_mass (Continuity PDE):</span>
            <strong className="text-purple">{lossMassWeight.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={lossMassWeight}
            onChange={(e) => setLossMassWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">&part;h/&part;t + &nabla;&bull;(uh) = 0</span>
        </div>

        <div className="p-3 bg-canvas rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>&lambda;_mom (Momentum PDE):</span>
            <strong className="text-purple">{lossMomWeight.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={lossMomWeight}
            onChange={(e) => setLossMomWeight(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted block">Navier-Stokes Convective Flux</span>
        </div>
      </div>

      {/* Epoch Stepper & Telemetry */}
      <div className="p-4 bg-canvas rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="w-full sm:w-1/2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-ink font-bold">Collocation Epochs:</span>
            <strong className="text-purple">{iterationEpoch} Iterations</strong>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={iterationEpoch}
            onChange={(e) => setIterationEpoch(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
          <span className="text-[10px] text-muted">Adam Optimizer + L-BFGS-B Fine Tuning</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIterationEpoch(850);
              showToast?.('Executed 400 additional Adam gradient steps on PINN surrogate');
            }}
            className="px-4 py-2 bg-purple text-white text-xs font-bold rounded-xl hover:bg-purple-deep flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Step 400 Gradients
          </button>
        </div>
      </div>
    </div>
  );
}

