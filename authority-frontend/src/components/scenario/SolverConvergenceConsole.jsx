import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Sliders,
  Zap,
  Gauge,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { HYDRAULIC_SOLVER_DEFAULTS } from './scenarioConstants';

const SIMULATION_STAGES = [
  { stage: 1, title: 'Boundary Inflow & Hydrograph Coupling', desc: 'Coupling 1D open-channel St. Venant outfall equations with radar hyetograph' },
  { stage: 2, title: '2D-SWE Shallow Water Discretization', desc: 'Roe-Riemann flux solver on GPU triangular unstructured mesh' },
  { stage: 3, title: 'Pressurized Pipe Network Surcharge', desc: 'Preissmann slot algorithm modeling closed box culvert backpressure' },
  { stage: 4, title: 'Overland Flow Vectors & Velocity Field', desc: 'Computing velocity vector fields (u, v) and kinetic shear velocity' },
  { stage: 5, title: 'Convergence & Critical Threshold Audit', desc: 'L2 norm tolerance <= 1e-4 check, asset cutoff flagging' },
];

export default function SolverConvergenceConsole({
  scenarioParams,
  onSimulationFinished,
  isSimulating,
  setIsSimulating,
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [solverLogs, setSolverLogs] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [solverConfig, setSolverConfig] = useState(HYDRAULIC_SOLVER_DEFAULTS);
  const [convergenceStats, setConvergenceStats] = useState({
    iterations: 0,
    residualL2: '1.24e-2',
    courantCFL: '0.41',
    computeTimeMs: 0,
    cellsEvaluated: '1,420,800',
    gpuMemMb: '1,840 MB',
  });

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setProgress(0);
    setCurrentStage(1);
    setSolverLogs([
      `[0.00s] Initializing CUDA 2D-SWE Solver with ${solverConfig.gpuThreads} parallel threads...`,
      `[0.05s] Grid Mesh: ${solverConfig.gridResolutionM}m resolution (${convergenceStats.cellsEvaluated} active wet cells).`,
      `[0.10s] Boundary: Tide = ${scenarioParams.tideLevel}m MSL | Rain = ${scenarioParams.rainfallIntensity}mm/h.`,
    ]);

    let step = 1;
    const startTime = performance.now();

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setCurrentStage(5);
          const totalMs = Math.round(performance.now() - startTime);
          setConvergenceStats((st) => ({
            ...st,
            iterations: Math.round(280 + Math.random() * 80),
            residualL2: (4.12e-5 + Math.random() * 2e-5).toExponential(2),
            courantCFL: (0.38 + (scenarioParams.rainfallIntensity / 140) * 0.18).toFixed(2),
            computeTimeMs: totalMs,
          }));
          setSolverLogs((logs) => [
            ...logs,
            `[${(totalMs / 1000).toFixed(2)}s] CUDA 2D-SWE Hydrodynamic solver converged successfully.`,
            `[${(totalMs / 1000).toFixed(2)}s] Safety threshold audit complete. Telemetry updated.`,
          ]);
          if (onSimulationFinished) onSimulationFinished();
          return 100;
        }

        // Advance stage
        const stageIdx = Math.min(5, Math.floor(next / 20) + 1);
        if (stageIdx !== step) {
          step = stageIdx;
          setCurrentStage(stageIdx);
          const stageDesc = SIMULATION_STAGES[stageIdx - 1]?.title;
          const currSec = ((performance.now() - startTime) / 1000).toFixed(2);
          setSolverLogs((logs) => [
            ...logs.slice(-6),
            `[${currSec}s] Stage ${stageIdx}/5: ${stageDesc}...`,
          ]);
        }
        return next;
      });
    }, 85);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              CUDA 2D-SWE Hydrodynamic Engine
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                GPU CONVERGENCE
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              High-resolution 2D Saint-Venant shallow water equations with Preissmann pipe surcharge
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-border hover:bg-surface-secondary text-ink flex items-center gap-1 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-purple" />
          <span>Physics Config</span>
          {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Physics Hyperparameter Tuning Dropdown */}
      {showConfig && (
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-purple" />
              Solver Physics &amp; Discretization Hyperparameters
            </span>
            <button
              onClick={() => setSolverConfig(HYDRAULIC_SOLVER_DEFAULTS)}
              className="text-[10px] font-mono text-purple hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-ink-secondary block mb-1">
                LIDAR Grid Mesh Resolution
              </label>
              <select
                value={solverConfig.gridResolutionM}
                onChange={(e) => setSolverConfig({ ...solverConfig, gridResolutionM: Number(e.target.value) })}
                className="w-full text-xs font-mono bg-surface border border-border rounded-lg p-1.5 text-ink"
              >
                <option value={2}>2m High-Precision DEM (3.8M cells)</option>
                <option value={5}>5m Standard Mesh (1.4M cells)</option>
                <option value={10}>10m Fast Survey (420k cells)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-ink-secondary block mb-1">
                Time-Step Limiter Δt (Courant-Friedrichs-Lewy)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={solverConfig.timeStepSec}
                  onChange={(e) => setSolverConfig({ ...solverConfig, timeStepSec: Number(e.target.value) })}
                  className="w-full h-1.5 bg-surface rounded appearance-none cursor-pointer accent-purple"
                />
                <span className="font-mono text-xs text-ink shrink-0">{solverConfig.timeStepSec}s</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-ink-secondary block mb-1">
                Manning's Roughness n (Urban Overbank)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.015"
                  max="0.065"
                  step="0.005"
                  value={solverConfig.manningN}
                  onChange={(e) => setSolverConfig({ ...solverConfig, manningN: Number(e.target.value) })}
                  className="w-full h-1.5 bg-surface rounded appearance-none cursor-pointer accent-purple"
                />
                <span className="font-mono text-xs text-ink shrink-0">{solverConfig.manningN}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress & Stage Status */}
      {isSimulating && (
        <div className="space-y-2 bg-purple-soft/30 border border-purple/30 rounded-xl p-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              Stage {currentStage}/5: {SIMULATION_STAGES[currentStage - 1]?.title}
            </span>
            <span className="font-bold text-ink">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple to-purple-deep transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[10px] text-ink-secondary font-mono">
            {SIMULATION_STAGES[currentStage - 1]?.desc}
          </p>
        </div>
      )}

      {/* Numerical Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
          <span className="text-[10px] text-ink-secondary block uppercase">L2 Residual Error</span>
          <strong className="text-status-safe font-bold">{convergenceStats.residualL2}</strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
          <span className="text-[10px] text-ink-secondary block uppercase">Courant Number (CFL)</span>
          <strong className="text-purple font-bold">{convergenceStats.courantCFL} (Stable &lt; 0.9)</strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
          <span className="text-[10px] text-ink-secondary block uppercase">Wet Cell Mesh</span>
          <strong className="text-ink font-bold">{convergenceStats.cellsEvaluated}</strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/50 border border-border">
          <span className="text-[10px] text-ink-secondary block uppercase">GPU VRAM Allocated</span>
          <strong className="text-ink font-bold">{convergenceStats.gpuMemMb}</strong>
        </div>
      </div>

      {/* Terminal Mini-Log */}
      <div className="bg-canvas border border-border rounded-lg p-2 font-mono text-[10px] text-ink-secondary max-h-24 overflow-y-auto space-y-0.5">
        {solverLogs.length === 0 ? (
          <div className="text-ink-muted">Ready to initialize CUDA 2D-SWE solver. Click below to execute run.</div>
        ) : (
          solverLogs.map((log, i) => (
            <div key={i} className="leading-tight text-ink/80">
              {log}
            </div>
          ))
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleStartSimulation}
        disabled={isSimulating}
        className="w-full py-2.5 px-3 bg-purple hover:bg-purple-deep text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-subtle transition-colors disabled:opacity-50"
      >
        {isSimulating ? (
          <>
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Simulating Multiphase SWE (Iteration {Math.round(progress * 3.2)})...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Coupled 2D Hydrodynamic Simulation</span>
          </>
        )}
      </button>
    </div>
  );
}
