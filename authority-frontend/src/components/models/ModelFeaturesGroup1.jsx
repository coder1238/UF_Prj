import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Activity,
  Layers,
  Zap,
  TrendingUp,
  TrendingDown,
  Droplets,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import { SENSOR_GROUND_TRUTH_LOG } from './modelsConstants';

// ============================================================================
// FEATURE 1: PINN vs 2D Shallow Water Equations (SWE) Residual Heatmap & Parity Explorer
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
          froude: (0.35 + distFromCenter * 0.08).toFixed(2),
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
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe-soft px-2.5 py-1 rounded-lg">
            14.2x ACCELERATION
          </span>
          <span className="font-mono text-[11px] font-bold text-purple bg-purple-soft px-2.5 py-1 rounded-lg">
            &Delta;M: 0.014% MASS PARITY
          </span>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border">
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

        <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border">
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
              // Color scale based on residual: 0-0.5 = safe emerald, 0.5-1.2 = purple, >1.2 = amber
              const colorBg =
                c.residualCm < 0.4
                  ? 'bg-status-safe/80'
                  : c.residualCm < 0.9
                  ? 'bg-purple/80'
                  : 'bg-status-warning/80';

              return (
                <button
                  key={`${c.r}-${c.c}`}
                  onClick={() => setSelectedCell({ r: c.r, c: c.c })}
                  className={`h-11 rounded-lg flex flex-col items-center justify-center font-mono text-[9px] text-white transition-all ${colorBg} ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : 'hover:opacity-90'
                  }`}
                >
                  <span className="font-bold">{c.pinnDepth}m</span>
                  <span className="text-[8px] opacity-80">&plusmn;{c.residualCm}cm</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-1 border-t border-white/10">
            <span>&bull; &lt;0.4cm (Optimal Match)</span>
            <span>&bull; 0.4–0.9cm (Nominal)</span>
            <span>&bull; &gt;0.9cm (Local Turbulence)</span>
          </div>
        </div>

        {/* Selected Cell Telemetry (5 cols) */}
        <div className="md:col-span-5 p-3.5 bg-surface-secondary border border-border rounded-xl space-y-2.5 font-mono">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wide block font-sans">
            Grid Cell ({activeCellData.r}, {activeCellData.c}) Telemetry
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-1.5 bg-surface rounded">
              <span className="text-ink-secondary">SWE Classical Solver:</span>
              <strong className="text-ink">{activeCellData.sweDepth} cm</strong>
            </div>
            <div className="flex justify-between p-1.5 bg-surface rounded">
              <span className="text-ink-secondary">PINN Neural Surrogate:</span>
              <strong className="text-purple">{activeCellData.pinnDepth} cm</strong>
            </div>
            <div className="flex justify-between p-1.5 bg-surface rounded">
              <span className="text-ink-secondary">Absolute Residual Delta:</span>
              <strong className="text-status-safe">&plusmn;{activeCellData.residualCm} cm</strong>
            </div>
            <div className="flex justify-between p-1.5 bg-surface rounded">
              <span className="text-ink-secondary">Sub-grid Froude (Fr):</span>
              <strong className="text-ink">{activeCellData.froude} (Subcritical)</strong>
            </div>
          </div>
          <button
            onClick={() => showToast && showToast(`Calibrated Cell (${activeCellData.r}, ${activeCellData.c}) PINN loss gradient.`)}
            className="w-full py-1.5 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalibrate Local Node</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2: Green-Ampt Soil Infiltration & Runoff Hydro-Response Tuner
// ============================================================================
export function GreenAmptInfiltrationTuner({ showToast }) {
  const [soilType, setSoilType] = useState('urbanAsphalt');
  const [hydraulicConductivity, setHydraulicConductivity] = useState(1.2); // Ks in mm/hr
  const [suctionHead, setSuctionHead] = useState(110); // psi in mm
  const [moistureDeficit, setMoistureDeficit] = useState(0.18); // Delta theta

  const soilPresets = {
    urbanAsphalt: { name: 'Mumbai Urban Core (85% Impervious)', ks: 0.4, psi: 45, dtheta: 0.08 },
    marineClay: { name: 'Mahim & Mithi Marine Silt Clay', ks: 1.5, psi: 180, dtheta: 0.22 },
    lateriteBasalt: { name: 'Sanjay Gandhi Lateritic Basalt', ks: 8.5, psi: 90, dtheta: 0.35 },
  };

  const handleSelectSoilPreset = (key) => {
    setSoilType(key);
    setHydraulicConductivity(soilPresets[key].ks);
    setSuctionHead(soilPresets[key].psi);
    setMoistureDeficit(soilPresets[key].dtheta);
    if (showToast) showToast(`Loaded soil parameter profile: ${soilPresets[key].name}`);
  };

  // Runoff hydrograph calculation
  const totalRainfallMm = 65;
  const infiltrationMm = Math.min(
    totalRainfallMm * 0.85,
    hydraulicConductivity * 3 + (suctionHead * moistureDeficit) * 0.12
  );
  const netExcessRunoffMm = (totalRainfallMm - infiltrationMm).toFixed(1);
  const runoffCoeff = ((totalRainfallMm - infiltrationMm) / totalRainfallMm).toFixed(2);
  const lagTimeMins = Math.round(45 * (1 - runoffCoeff * 0.5));

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 2 • Soil Hydrodynamics
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Green-Ampt Soil Infiltration &amp; Catchment Runoff Tuner
          </h3>
        </div>
        <div className="flex gap-2">
          {Object.entries(soilPresets).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleSelectSoilPreset(key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                soilType === key
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {key === 'urbanAsphalt' ? 'Urban Concrete' : key === 'marineClay' ? 'Marine Clay' : 'Laterite'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary rounded-xl space-y-1 border border-border">
          <div className="flex justify-between text-ink">
            <span>Hydraulic Conductivity (K<sub>s</sub>):</span>
            <strong className="text-purple">{hydraulicConductivity} mm/hr</strong>
          </div>
          <input
            type="range"
            min="0.1"
            max="15"
            step="0.1"
            value={hydraulicConductivity}
            onChange={(e) => setHydraulicConductivity(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>

        <div className="p-3 bg-surface-secondary rounded-xl space-y-1 border border-border">
          <div className="flex justify-between text-ink">
            <span>Suction Head (&psi;):</span>
            <strong className="text-purple">{suctionHead} mm</strong>
          </div>
          <input
            type="range"
            min="20"
            max="250"
            step="5"
            value={suctionHead}
            onChange={(e) => setSuctionHead(parseInt(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>

        <div className="p-3 bg-surface-secondary rounded-xl space-y-1 border border-border">
          <div className="flex justify-between text-ink">
            <span>Moisture Deficit (&Delta;&theta;):</span>
            <strong className="text-purple">{moistureDeficit.toFixed(2)}</strong>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.45"
            step="0.01"
            value={moistureDeficit}
            onChange={(e) => setMoistureDeficit(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Hydrograph Visualizer */}
      <div className="p-4 bg-ink text-white rounded-xl space-y-2 border border-border">
        <div className="flex justify-between text-[11px] font-mono text-white/70">
          <span>Catchment Hyetograph vs Net Surface Hydrograph</span>
          <span className="text-status-safe font-bold">Lag Time to Peak: {lagTimeMins} mins</span>
        </div>
        <div className="relative h-28 w-full bg-white/5 rounded-lg p-2 border border-white/10 flex items-end justify-between gap-1">
          {/* Simulated 12 time step hydrograph bars */}
          {[12, 28, 48, 65, 58, 42, 30, 21, 14, 8, 4, 2].map((rain, idx) => {
            const runoffHeight = Math.max(2, Math.round(rain * parseFloat(runoffCoeff)));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {/* Rainfall Bar (Blue) */}
                <div
                  className="w-full bg-purple/40 rounded-t-sm"
                  style={{ height: `${(rain / 65) * 60}%` }}
                />
                {/* Surface Runoff Bar (Green/Alert) */}
                <div
                  className="w-full bg-status-alert rounded-t-sm"
                  style={{ height: `${(runoffHeight / 65) * 60}%` }}
                />
                <span className="text-[8px] font-mono text-white/40">+{idx * 15}m</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-white/60 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-purple/40 inline-block" />
            <span>Gross Precip ({totalRainfallMm} mm)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-status-alert inline-block" />
            <span>Excess Runoff ({netExcessRunoffMm} mm • C = {runoffCoeff})</span>
          </div>
          <div className="flex items-center gap-2 text-status-safe">
            <span>Soil Retention: {(totalRainfallMm - parseFloat(netExcessRunoffMm)).toFixed(1)} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3: Doppler Nowcast Ensemble Model Blending Matrix
// ============================================================================
export function DopplerEnsembleBlendingMatrix({ showToast }) {
  const [weights, setWeights] = useState({
    convlstm: 40,
    dgmr: 25,
    phydnet: 25,
    opticalFlow: 10,
  });

  const handleSliderChange = (key, val) => {
    setWeights((prev) => ({ ...prev, [key]: parseInt(val) }));
  };

  const handleNormalize = () => {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum === 0) return;
    const norm = {
      convlstm: Math.round((weights.convlstm / sum) * 100),
      dgmr: Math.round((weights.dgmr / sum) * 100),
      phydnet: Math.round((weights.phydnet / sum) * 100),
      opticalFlow: 100 - (Math.round((weights.convlstm / sum) * 100) + Math.round((weights.dgmr / sum) * 100) + Math.round((weights.phydnet / sum) * 100)),
    };
    setWeights(norm);
    if (showToast) showToast('Normalized ensemble weights to exactly 100%.');
  };

  const ensembleCsi = (
    (weights.convlstm * 0.842 + weights.dgmr * 0.865 + weights.phydnet * 0.81 + weights.opticalFlow * 0.725) /
    100
  ).toFixed(3);

  const ensembleEts = (
    (weights.convlstm * 0.718 + weights.dgmr * 0.744 + weights.phydnet * 0.688 + weights.opticalFlow * 0.59) /
    100
  ).toFixed(3);

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 3 • Ensemble Synthesis
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Bayesian Ensemble Radar Nowcast Model Blending Matrix
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNormalize}
            className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-surface-secondary/80 text-ink font-mono text-[11px] font-semibold border border-border transition-colors"
          >
            Auto-Normalize to 100%
          </button>
          <button
            onClick={() => showToast && showToast('Live nowcast feed updated with new Bayesian blended weights.')}
            className="px-3 py-1 rounded bg-purple hover:bg-purple-deep text-white font-mono text-[11px] font-semibold transition-colors"
          >
            Broadcast to Live Feed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
        {[
          { key: 'convlstm', label: 'ConvLSTM v2.4 (Prod)', desc: 'Spatiotemporal Recurrent', defaultScore: 'CSI 0.842' },
          { key: 'dgmr', label: 'DGMR Generative', desc: 'Deep Diffusion Extrapolation', defaultScore: 'CSI 0.865' },
          { key: 'phydnet', label: 'PhyDNet PINN', desc: 'Navier-Stokes Constrained', defaultScore: 'CSI 0.810' },
          { key: 'opticalFlow', label: 'Farnebäck Flow', desc: 'Deterministic Echo Vector', defaultScore: 'CSI 0.725' },
        ].map((item) => (
          <div key={item.key} className="p-3 bg-surface-secondary rounded-xl space-y-2 border border-border">
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink truncate">{item.label}</span>
              <span className="text-purple font-bold">{weights[item.key]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights[item.key]}
              onChange={(e) => handleSliderChange(item.key, e.target.value)}
              className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-secondary">
              <span>{item.desc}</span>
              <span className="text-status-safe font-bold">{item.defaultScore}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Skill Score Output */}
      <div className="p-3.5 bg-surface border border-border rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div>
          <span className="text-[10px] text-ink-secondary block">Blended Critical Success Index (CSI):</span>
          <strong className="text-base text-purple font-bold">{ensembleCsi}</strong>
        </div>
        <div>
          <span className="text-[10px] text-ink-secondary block">Equitable Threat Score (ETS):</span>
          <strong className="text-base text-status-safe font-bold">{ensembleEts}</strong>
        </div>
        <div>
          <span className="text-[10px] text-ink-secondary block">Ensemble Resolution:</span>
          <strong className="text-base text-ink font-bold">250m Gridded Mesh</strong>
        </div>
        <div>
          <span className="text-[10px] text-ink-secondary block">Latency Budget:</span>
          <strong className="text-base text-ink font-bold">36.4s Parallelized</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4: Hydro-PINN Graph Neural Network (GNN) Surcharge Node Backprop Inspector
// ============================================================================
export function HydroPinnSurchargeBackpropInspector({ showToast }) {
  const [selectedJunction, setSelectedJunction] = useState('kurla-j104');
  const [tideGateBackpressureM, setTideGateBackpressureM] = useState(3.8);

  const junctions = [
    { id: 'kurla-j104', name: 'Kurla West Junction J-104', normalHead: 2.4, critHead: 3.2, pipeDia: 1200 },
    { id: 'hindmata-mh88', name: 'Hindmata Flyover MH-88', normalHead: 1.8, critHead: 2.5, pipeDia: 900 },
    { id: 'milan-mh12', name: 'Milan Subway Culvert MH-12', normalHead: 2.1, critHead: 2.8, pipeDia: 1400 },
    { id: 'gandhi-mh33', name: 'Gandhi Market King Circle MH-33', normalHead: 1.9, critHead: 2.6, pipeDia: 1000 },
  ];

  const activeJunction = junctions.find((j) => j.id === selectedJunction) || junctions[0];
  const simulatedHead = (activeJunction.normalHead + (tideGateBackpressureM - 2.0) * 0.45).toFixed(2);
  const isSurcharging = parseFloat(simulatedHead) >= activeJunction.critHead;
  const overflowFluxM3s = isSurcharging ? ((parseFloat(simulatedHead) - activeJunction.critHead) * 3.4).toFixed(2) : 0.0;

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 4 • Subterranean GNN Backprop
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Hydro-PINN Graph Neural Network Surcharge &amp; Backflow Propagation
          </h3>
        </div>
        <div className="flex gap-1.5">
          {junctions.map((j) => (
            <button
              key={j.id}
              onClick={() => setSelectedJunction(j.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                selectedJunction === j.id
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {j.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Arabian Sea Outfall Backpressure (Tidal Surge):</span>
          <strong className="text-purple">{tideGateBackpressureM.toFixed(1)} m MSL</strong>
        </div>
        <input
          type="range"
          min="2.0"
          max="5.2"
          step="0.1"
          value={tideGateBackpressureM}
          onChange={(e) => setTideGateBackpressureM(parseFloat(e.target.value))}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-ink-secondary">
          <span>2.0m (Low Tide / Free Gravity Discharge)</span>
          <span>5.2m (Spring High Tide / Severe Hydraulic Lockout)</span>
        </div>
      </div>

      {/* Surcharge Analysis Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1 font-mono">
          <span className="text-[10px] text-ink-secondary block">Simulated Hydraulic Head:</span>
          <strong className="text-lg text-ink block">{simulatedHead} m</strong>
          <span className="text-[10px] text-ink-secondary">
            Crown Limit: {activeJunction.critHead} m
          </span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1 font-mono">
          <span className="text-[10px] text-ink-secondary block">Surcharge Status:</span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
              isSurcharging
                ? 'bg-status-alert-soft text-status-alert'
                : 'bg-status-safe-soft text-status-safe'
            }`}
          >
            {isSurcharging ? 'PRESSURIZED GEYSERING' : 'NORMAL GRAVITY FLOW'}
          </span>
          <span className="text-[10px] text-ink-secondary block">
            Conduit &empty;: {activeJunction.pipeDia} mm
          </span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1 font-mono">
          <span className="text-[10px] text-ink-secondary block">Street Surface Egress Flux:</span>
          <strong
            className={`text-lg block ${
              isSurcharging ? 'text-status-alert font-bold' : 'text-status-safe'
            }`}
          >
            {overflowFluxM3s} m&sup3;/s
          </strong>
          <span className="text-[10px] text-ink-secondary">
            GNN Hazard Probability: {isSurcharging ? '96.4%' : '4.2%'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 5: Sensor Ground-Truth Residual Drift Monitor & Kalman Gain Tuner
// ============================================================================
export function SensorGroundTruthDriftMonitor({ showToast }) {
  const [sensors, setSensors] = useState(SENSOR_GROUND_TRUTH_LOG);
  const [measurementNoiseR, setMeasurementNoiseR] = useState(0.04);
  const [processNoiseQ, setProcessNoiseQ] = useState(0.01);

  const handleApplyKalmanSmoothing = () => {
    setSensors((prev) =>
      prev.map((s) => {
        const smoothDelta = (parseFloat(s.delta) * (measurementNoiseR / (measurementNoiseR + processNoiseQ))).toFixed(1);
        return {
          ...s,
          observed: (s.predicted + parseFloat(smoothDelta)).toFixed(1),
          delta: `${smoothDelta >= 0 ? '+' : ''}${smoothDelta} cm`,
          r2: Math.min(0.99, s.r2 + 0.015),
        };
      })
    );
    if (showToast) {
      showToast(`Kalman Filter weights re-parameterized (R=${measurementNoiseR}, Q=${processNoiseQ}).`);
    }
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 5 • Telemetry Ground Truth
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Sensor Ground-Truth Residual Drift Monitor &amp; Kalman Gain Tuner
          </h3>
        </div>
        <button
          onClick={handleApplyKalmanSmoothing}
          className="px-3 py-1.5 rounded-lg bg-purple text-white hover:bg-purple-deep font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Apply Kalman Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Measurement Noise Covariance (R):</span>
            <strong className="text-purple">{measurementNoiseR}</strong>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.20"
            step="0.01"
            value={measurementNoiseR}
            onChange={(e) => setMeasurementNoiseR(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>

        <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border">
          <div className="flex justify-between text-ink">
            <span>Process Noise Covariance (Q):</span>
            <strong className="text-purple">{processNoiseQ}</strong>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.05"
            step="0.005"
            value={processNoiseQ}
            onChange={(e) => setProcessNoiseQ(parseFloat(e.target.value))}
            className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Sensor Residual Table */}
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-surface-secondary text-ink-secondary border-b border-border">
            <tr>
              <th className="p-2">Sensor ID</th>
              <th className="p-2">Physical Location</th>
              <th className="p-2">Observed (cm)</th>
              <th className="p-2">ML Predicted (cm)</th>
              <th className="p-2">Residual (&Delta;)</th>
              <th className="p-2">R&sup2; Match</th>
              <th className="p-2">Drift State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {sensors.map((s) => (
              <tr key={s.id} className="hover:bg-surface-secondary/40">
                <td className="p-2 font-bold text-ink">{s.id}</td>
                <td className="p-2 text-ink truncate max-w-[200px]">{s.location}</td>
                <td className="p-2 text-ink">{s.observed}</td>
                <td className="p-2 text-purple font-bold">{s.predicted}</td>
                <td
                  className={`p-2 font-bold ${
                    s.delta.startsWith('+') ? 'text-status-warning' : 'text-status-safe'
                  }`}
                >
                  {s.delta}
                </td>
                <td className="p-2 text-status-safe font-bold">{s.r2}</td>
                <td className="p-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      s.status === 'OPTIMAL'
                        ? 'bg-status-safe-soft text-status-safe'
                        : 'bg-status-warning-soft text-status-warning'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

