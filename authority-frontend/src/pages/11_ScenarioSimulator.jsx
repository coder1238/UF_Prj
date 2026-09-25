import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';
import {
  SlidersHorizontal,
  RotateCcw,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Activity,
  History,
  Download,
  Bookmark,
  Navigation,
  Home,
  Waves,
  SplitSquareVertical,
  Columns2,
  Grid3X3,
  Zap,
} from 'lucide-react';

// Specialized Scenario & Hydraulics Modals
import WardImpactMatrixModal from '../components/scenario/WardImpactMatrixModal';
import HydraulicProfileModal from '../components/scenario/HydraulicProfileModal';
import MonteCarloEnsembleModal from '../components/scenario/MonteCarloEnsembleModal';
import BreachFailureInjectorModal from '../components/scenario/BreachFailureInjectorModal';
import AssetFailureCascadeModal from '../components/scenario/AssetFailureCascadeModal';
import ScenarioBenchmarkPresets from '../components/scenario/ScenarioBenchmarkPresets';
import ShelterCapacityTrackerModal from '../components/scenario/ShelterCapacityTrackerModal';
import MobilityCorridorChokepointsModal from '../components/scenario/MobilityCorridorChokepointsModal';
import ScenarioBookmarkManagerModal from '../components/interventions/ScenarioBookmarkManagerModal';
import ExportDossierModal from '../components/scenario/ExportDossierModal';

// Advanced Scenario Subcomponents
import SolverConvergenceConsole from '../components/scenario/SolverConvergenceConsole';
import WhatIfInterventionLayer from '../components/scenario/WhatIfInterventionLayer';
import DynamicHydrographChart from '../components/scenario/DynamicHydrographChart';
import VirtualWaterGaugeInspector from '../components/scenario/VirtualWaterGaugeInspector';
import ResilienceSpiderRadar from '../components/scenario/ResilienceSpiderRadar';
import EconomicDamageEstimator from '../components/scenario/EconomicDamageEstimator';
import SensitivityTornadoChart from '../components/scenario/SensitivityTornadoChart';
import DisasterDirectiveGenerator from '../components/scenario/DisasterDirectiveGenerator';
import DifferenceHeatmapCanvas from '../components/scenario/DifferenceHeatmapCanvas';

import {
  FAILURE_INJECTOR_ITEMS,
  WHAT_IF_INTERVENTIONS,
  BENCHMARK_PRESETS,
} from '../components/scenario/scenarioConstants';

export default function ScenarioSimulator() {
  const {
    scenarioParams,
    setScenarioParams,
    setMapFocusTarget,
    dispatchIncident,
    resetScenario,
  } = useFloodCommand();

  // Split Viewport & Visual Modes
  const [splitPosition, setSplitPosition] = useState(50); // percentage 0 to 100
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [viewMode, setViewMode] = useState('wipe'); // 'wipe' | 'dual' | 'diff'
  const [activeTab, setActiveTab] = useState('hydrograph'); // 'hydrograph' | 'gauge' | 'resilience' | 'economic' | 'tornado' | 'directive'

  // Solver & Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState(null);

  // Active Breaches & What-If Interventions
  const [activeBreaches, setActiveBreaches] = useState({});
  const [activeWhatIfs, setActiveWhatIfs] = useState({
    'wi-pump-boost': false,
    'wi-flood-barrier': false,
    'wi-holding-tank': false,
  });

  // Modal Visibility States
  const [showPresets, setShowPresets] = useState(false);
  const [showWardMatrix, setShowWardMatrix] = useState(false);
  const [showTransect, setShowTransect] = useState(false);
  const [showMonteCarlo, setShowMonteCarlo] = useState(false);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [showAssetCascade, setShowAssetCascade] = useState(false);
  const [showShelters, setShowShelters] = useState(false);
  const [showMobility, setShowMobility] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const containerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Draggable Split Wipe Logic
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingSplit || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      if (!clientX) return;
      const pos = ((clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(10, Math.min(90, Math.round(pos))));
    };

    const handlePointerUp = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };

    if (isDraggingSplit) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDraggingSplit]);

  // Toggle Breaches & Interventions
  const handleToggleBreach = (id) => {
    setActiveBreaches((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(`Physical Breach point ${updated[id] ? 'INJECTED' : 'CLEARED'}.`);
      return updated;
    });
  };

  const handleToggleWhatIf = (id) => {
    setActiveWhatIfs((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(`What-If Intervention ${updated[id] ? 'APPLIED' : 'REVERTED'}.`);
      return updated;
    });
  };

  // Reset to Baseline
  const handleResetBaseline = async () => {
    try {
      await resetScenario();
    } catch (error) {
      console.warn('[FloodCommandContext] Backend unreachable, using local mock data');
    }
    const baseline = BENCHMARK_PRESETS.find((p) => p.id === 'preset-baseline')?.params || {
      rainfallIntensity: 50,
      durationMin: 60,
      drainBlockage: 15,
      pumpingCapacity: 95,
      tideLevel: 2.8,
      stormSpeed: 14,
    };
    setScenarioParams(baseline);
    setActiveBreaches({});
    setActiveWhatIfs({});
    showToast('Reset to Calibrated Operational Baseline.');
  };

  // Dynamic Delta Calculations with Breach Spikes and Mitigation Relief
  const breachSpikeDepth = FAILURE_INJECTOR_ITEMS
    .filter((f) => activeBreaches[f.id])
    .reduce((sum, f) => sum + f.deltaDepth, 0);

  const breachSpikeArea = FAILURE_INJECTOR_ITEMS
    .filter((f) => activeBreaches[f.id])
    .reduce((sum, f) => sum + f.deltaArea, 0);

  const mitigationDepth = WHAT_IF_INTERVENTIONS
    .filter((w) => activeWhatIfs[w.id])
    .reduce((sum, w) => sum + w.depthReductionCm, 0);

  const mitigationClearance = WHAT_IF_INTERVENTIONS
    .filter((w) => activeWhatIfs[w.id])
    .reduce((sum, w) => sum + w.clearanceReductionHrs, 0);

  const deltaRoads = Math.max(
    5,
    Math.round(
      27 +
        (scenarioParams.rainfallIntensity - 50) * 0.6 +
        scenarioParams.drainBlockage * 0.3 +
        Object.values(activeBreaches).filter(Boolean).length * 4 -
        Object.values(activeWhatIfs).filter(Boolean).length * 2
    )
  );

  const deltaDepth = Math.max(
    10,
    +(
      42.0 +
      (scenarioParams.rainfallIntensity - 50) * 0.4 +
      scenarioParams.drainBlockage * 0.15 +
      breachSpikeDepth -
      mitigationDepth
    ).toFixed(1)
  );

  const deltaArea = Math.max(
    0.8,
    +(
      2.1 +
      (scenarioParams.rainfallIntensity - 50) * 0.06 +
      scenarioParams.drainBlockage * 0.03 +
      breachSpikeArea -
      mitigationDepth * 0.04
    ).toFixed(1)
  );

  const deltaSurcharge = Math.max(
    2,
    Math.round(
      6 +
        (scenarioParams.drainBlockage / 100) * 20 +
        (scenarioParams.rainfallIntensity > 70 ? 8 : 0) +
        Object.values(activeBreaches).filter(Boolean).length * 3
    )
  );

  const deltaClearance = Math.max(
    0.8,
    +(
      2.8 +
      (scenarioParams.drainBlockage / 100) * 4.0 +
      (100 - scenarioParams.pumpingCapacity) * 0.05 +
      breachSpikeDepth * 0.08 -
      mitigationClearance
    ).toFixed(1)
  );

  // Focus Map on Landmark
  const handleFocusMapLocation = (coords, title) => {
    if (setMapFocusTarget) {
      setMapFocusTarget({
        coords,
        title,
        subtitle: `Spot depth: ${deltaDepth} cm`,
        zoom: 14.8,
      });
      showToast(`Map centered on ${title}`);
    }
  };

  // Dispatch Ward Action
  const handleDispatchWard = (ward) => {
    if (dispatchIncident) {
      dispatchIncident('INC-001', `Emergency mobile pump squad dispatched to ${ward.ward} (${ward.name})`);
    }
    showToast(`Emergency squad deployed to ${ward.ward}!`);
  };

  return (
    <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple" />
            Flood Scenario Lab &amp; Hydraulic Counterfactual Engine
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Parametric stress-testing coupled with dual-viewport counterfactual validation and 2D-SWE solver
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          <button
            onClick={() => setShowPresets(true)}
            className="px-2.5 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <History className="w-3.5 h-3.5" />
            <span>Benchmark Presets</span>
          </button>

          <button
            onClick={handleResetBaseline}
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={() => setShowBookmarkModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-purple" />
            <span>Bookmark Vault</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            <span>Export Dossier</span>
          </button>

          <span className="px-2.5 py-1.5 rounded-lg bg-purple-soft text-purple font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            CUDA 2D-SWE (GPU 68%)
          </span>
        </div>
      </div>

      {/* Advanced Analytical Tools Ribbon (Quick-Launch Access) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setShowWardMatrix(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Building2 className="w-3.5 h-3.5 text-purple" />
          <span>Ward Impact Matrix</span>
        </button>

        <button
          onClick={() => setShowTransect(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span>Hydraulic Transect Profile (WSP)</span>
        </button>

        <button
          onClick={() => setShowMonteCarlo(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Cpu className="w-3.5 h-3.5 text-purple" />
          <span>Monte Carlo Ensemble</span>
        </button>

        <button
          onClick={() => setShowBreachModal(true)}
          className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle ${
            Object.values(activeBreaches).filter(Boolean).length > 0
              ? 'bg-status-alert-soft border-status-alert text-status-alert font-bold'
              : 'bg-surface border-border hover:border-status-alert/50 text-ink'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-status-alert" />
          <span>Breach Failure Injector ({Object.values(activeBreaches).filter(Boolean).length})</span>
        </button>

        <button
          onClick={() => setShowAssetCascade(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Zap className="w-3.5 h-3.5 text-status-warning" />
          <span>Asset Cascade Tracker</span>
        </button>

        <button
          onClick={() => setShowShelters(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Home className="w-3.5 h-3.5 text-status-safe" />
          <span>Evacuation Shelters</span>
        </button>

        <button
          onClick={() => setShowMobility(true)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-purple/50 text-ink font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
        >
          <Navigation className="w-3.5 h-3.5 text-purple" />
          <span>Mobility Corridors</span>
        </button>
      </div>

      {/* Comparison Telemetry Strip (Delta Baseline vs Scenario Stress) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Simulated Rain</span>
          <div className="text-xl font-bold font-mono text-ink mt-1">
            {scenarioParams.rainfallIntensity} <span className="text-xs font-normal">mm/h</span>
          </div>
          <div className="text-[10px] font-mono text-status-alert font-bold">
            {scenarioParams.durationMin}m Cloudburst
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Affected Roads</span>
          <div className="text-xl font-bold font-mono text-status-alert mt-1">
            {deltaRoads} <span className="text-xs font-normal">cuts</span>
          </div>
          <div className="text-[10px] font-mono text-status-alert font-bold">
            Baseline: 27 (Δ +{deltaRoads - 27})
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Max Water Depth</span>
          <div className="text-xl font-bold font-mono text-status-alert mt-1">
            {deltaDepth} <span className="text-xs font-normal">cm</span>
          </div>
          <div className="text-[10px] font-mono text-status-alert font-bold">
            Baseline: 42.0 (Δ +{(deltaDepth - 42.0).toFixed(1)})
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Flooded Area</span>
          <div className="text-xl font-bold font-mono text-status-warning mt-1">
            {deltaArea} <span className="text-xs font-normal">km²</span>
          </div>
          <div className="text-[10px] font-mono text-status-warning font-bold">
            Baseline: 2.1 (Δ +{(deltaArea - 2.1).toFixed(1)})
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Surcharge Nodes</span>
          <div className="text-xl font-bold font-mono text-status-alert mt-1">
            {deltaSurcharge} <span className="text-xs font-normal">nodes</span>
          </div>
          <div className="text-[10px] font-mono text-status-alert font-bold">
            Baseline: 6 (Δ +{deltaSurcharge - 6})
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-secondary">Clearance Time</span>
          <div className="text-xl font-bold font-mono text-purple mt-1">
            {deltaClearance} <span className="text-xs font-normal">hrs</span>
          </div>
          <div className="text-[10px] font-mono text-purple font-bold">
            Baseline: 2.8 (Δ +{(deltaClearance - 2.8).toFixed(1)}h)
          </div>
        </div>
      </div>

      {/* Main Workspace (Left 33% Controls & Solvers + Right 67% Dual Viewport Canvas) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Parametric Stress Controls + Solver Engine + What-If Layer */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Parametric Stress Controls Card */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3.5">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple" />
                Parametric Stress Controls
              </h3>
              <span className="text-[10px] font-mono text-purple font-semibold">1-in-50 Yr Storm</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Control 1: Rainfall Intensity */}
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink font-semibold">Rainfall Intensity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setScenarioParams((p) => ({
                          ...p,
                          rainfallIntensity: Math.max(40, p.rainfallIntensity - 5),
                        }))
                      }
                      className="px-1 py-0.5 rounded bg-surface-secondary text-ink hover:bg-surface border border-border text-[10px]"
                    >
                      -5
                    </button>
                    <strong className="text-status-alert">{scenarioParams.rainfallIntensity} mm/hr</strong>
                    <button
                      onClick={() =>
                        setScenarioParams((p) => ({
                          ...p,
                          rainfallIntensity: Math.min(140, p.rainfallIntensity + 5),
                        }))
                      }
                      className="px-1 py-0.5 rounded bg-surface-secondary text-ink hover:bg-surface border border-border text-[10px]"
                    >
                      +5
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="5"
                  value={scenarioParams.rainfallIntensity}
                  onChange={(e) =>
                    setScenarioParams((p) => ({ ...p, rainfallIntensity: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>

              {/* Control 2: Rainfall Duration */}
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink font-semibold">Rainfall Duration</span>
                  <strong className="text-ink">{scenarioParams.durationMin} Minutes</strong>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="15"
                  value={scenarioParams.durationMin}
                  onChange={(e) =>
                    setScenarioParams((p) => ({ ...p, durationMin: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>

              {/* Control 3: Drainage Siltation & Infill Blockage */}
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink font-semibold">Drain Siltation Blockage</span>
                  <strong className="text-status-warning">{scenarioParams.drainBlockage}% Blocked</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="75"
                  step="5"
                  value={scenarioParams.drainBlockage}
                  onChange={(e) =>
                    setScenarioParams((p) => ({ ...p, drainBlockage: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>

              {/* Control 4: Pumping Operating Capacity */}
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink font-semibold">Pumping Operating Capacity</span>
                  <strong className="text-purple">{scenarioParams.pumpingCapacity}% Operating</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={scenarioParams.pumpingCapacity}
                  onChange={(e) =>
                    setScenarioParams((p) => ({ ...p, pumpingCapacity: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>

              {/* Control 5: Sea Outfall Tide Level */}
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink font-semibold">Sea Outfall Tide Level</span>
                  <strong className="text-status-alert">{scenarioParams.tideLevel} m MSL</strong>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="5.2"
                  step="0.1"
                  value={scenarioParams.tideLevel}
                  onChange={(e) =>
                    setScenarioParams((p) => ({ ...p, tideLevel: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-surface-secondary rounded appearance-none cursor-pointer accent-purple"
                />
              </div>

              {/* Active Breaches Warning Strip */}
              {Object.values(activeBreaches).filter(Boolean).length > 0 && (
                <div className="p-2.5 rounded-lg bg-status-alert-soft border border-status-alert/40 flex items-center justify-between text-xs font-mono text-status-alert">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{Object.values(activeBreaches).filter(Boolean).length} Failure Points Active</span>
                  </div>
                  <button
                    onClick={() => setShowBreachModal(true)}
                    className="underline text-[11px] font-bold hover:text-red-700"
                  >
                    Edit Failures
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CUDA 2D-SWE Solver Convergence Console */}
          <SolverConvergenceConsole
            scenarioParams={scenarioParams}
            onSimulationFinished={() => showToast('Convergence achieved: 2D-SWE solution stable.')}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
          />

          {/* Counterfactual What-If Interventions Layer */}
          <WhatIfInterventionLayer
            activeWhatIfs={activeWhatIfs}
            onToggleWhatIf={handleToggleWhatIf}
          />
        </div>

        {/* Right Column: Viewport (Split Wipe / Dual / Heatmap) & Analytical Tabs */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Viewport Card */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-subtle flex flex-col">
            {/* Viewport Top Controls Bar */}
            <div className="p-3 border-b border-border bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-ink-secondary uppercase">Display View:</span>
                <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 text-xs font-mono">
                  <button
                    onClick={() => setViewMode('wipe')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                      viewMode === 'wipe'
                        ? 'bg-purple text-white font-bold shadow-subtle'
                        : 'text-ink hover:text-purple'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    <span>Split Wipe ({splitPosition}%)</span>
                  </button>
                  <button
                    onClick={() => setViewMode('dual')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                      viewMode === 'dual'
                        ? 'bg-purple text-white font-bold shadow-subtle'
                        : 'text-ink hover:text-purple'
                    }`}
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    <span>Side-by-Side Dual</span>
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                      viewMode === 'diff'
                        ? 'bg-purple text-white font-bold shadow-subtle'
                        : 'text-ink hover:text-purple'
                    }`}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span>Δ Heatmap Matrix</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-safe inline-block" />
                  <span className="text-ink-secondary">Left: Baseline (48 mm/h)</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-alert inline-block" />
                  <span className="text-ink-secondary">Right: Scenario (+{scenarioParams.rainfallIntensity} mm/h)</span>
                </div>
              </div>
            </div>

            {/* Viewport Canvas Container */}
            <div
              ref={containerRef}
              className="relative w-full h-[520px] bg-canvas overflow-hidden select-none"
            >
              {viewMode === 'diff' ? (
                /* Differential Heatmap Matrix View */
                <div className="p-4 h-full overflow-y-auto">
                  <DifferenceHeatmapCanvas
                    scenarioParams={scenarioParams}
                    onSelectWard={(w) => {
                      showToast(`Selected ${w.ward}: +${w.deltaDepth || 14}cm surge depth.`);
                    }}
                  />
                </div>
              ) : viewMode === 'dual' ? (
                /* Synchronized Side-by-Side Dual Viewports */
                <div className="grid grid-cols-2 h-full w-full divide-x divide-purple/60">
                  <div className="relative h-full">
                    <div className="absolute top-3 left-3 z-30 bg-surface/90 backdrop-blur px-3 py-1 rounded-lg border border-border text-[10px] font-mono text-ink shadow-sm">
                      <strong>LEFT:</strong> BASELINE OPS (48 mm/h)
                    </div>
                    <InteractiveMapTwin
                      height="100%"
                      showLayerToggle={false}
                      splitMode={true}
                      splitSide="live"
                    />
                  </div>
                  <div className="relative h-full">
                    <div className="absolute top-3 right-3 z-30 bg-status-alert-soft/90 backdrop-blur px-3 py-1 rounded-lg border border-status-alert/30 text-[10px] font-mono text-status-alert shadow-sm font-bold">
                      <strong>RIGHT:</strong> SCENARIO (+{scenarioParams.rainfallIntensity} mm/h)
                    </div>
                    <InteractiveMapTwin
                      height="100%"
                      showLayerToggle={false}
                      splitMode={true}
                      splitSide="peak"
                    />
                  </div>
                </div>
              ) : (
                /* Interactive Split Wipe Slider Viewport */
                <div className="relative w-full h-full">
                  {/* Left Layer: Baseline Map */}
                  <div className="absolute inset-0">
                    <InteractiveMapTwin
                      height="100%"
                      showLayerToggle={false}
                      splitMode={true}
                      splitSide="live"
                    />
                  </div>

                  {/* Right Layer: Scenario Stress Map clipped to right of split divider */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{
                      clipPath: `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)`,
                    }}
                  >
                    <div className="w-full h-full pointer-events-auto">
                      <InteractiveMapTwin
                        height="100%"
                        showLayerToggle={false}
                        splitMode={true}
                        splitSide="peak"
                      />
                    </div>
                  </div>

                  {/* Viewport Indicators */}
                  <div className="absolute top-3 left-3 z-30 bg-surface/90 backdrop-blur px-3 py-1.5 rounded-lg border border-border text-[10px] font-mono text-ink shadow-sm">
                    <strong>LEFT:</strong> BASELINE OPERATIONS (48 mm/h)
                  </div>
                  <div className="absolute top-3 right-3 z-30 bg-status-alert-soft/90 backdrop-blur px-3 py-1.5 rounded-lg border border-status-alert/30 text-[10px] font-mono text-status-alert shadow-sm font-bold">
                    <strong>RIGHT:</strong> SCENARIO STRESS TEST (+{scenarioParams.rainfallIntensity} mm/h)
                  </div>

                  {/* Draggable Split Divider Line & Handle */}
                  <div
                    onPointerDown={handlePointerDown}
                    className={`absolute top-0 bottom-0 w-1.5 bg-purple shadow-elevated z-40 cursor-ew-resize flex items-center justify-center transition-colors ${
                      isDraggingSplit ? 'bg-purple-deep ring-2 ring-purple/50' : 'hover:bg-purple-deep'
                    }`}
                    style={{ left: `${splitPosition}%` }}
                  >
                    <div className="w-9 h-9 rounded-full bg-purple text-white shadow-elevated flex items-center justify-center text-xs font-mono font-bold select-none border-2 border-surface cursor-ew-resize hover:scale-110 transition-transform">
                      ↔
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Scrubber */}
            <div className="p-3 border-t border-border bg-surface-secondary/40">
              <TimelineScrubber />
            </div>
          </div>

          {/* Analytical Suite Tabs Header */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono border-b border-border/70 pb-2">
              <button
                onClick={() => setActiveTab('hydrograph')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'hydrograph'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>12h Hydrograph &amp; Inundation Curve</span>
              </button>

              <button
                onClick={() => setActiveTab('gauge')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'gauge'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Virtual Water Gauge (7 Landmarks)</span>
              </button>

              <button
                onClick={() => setActiveTab('resilience')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'resilience'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>6-Axis Resilience Radar</span>
              </button>

              <button
                onClick={() => setActiveTab('economic')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'economic'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Economic Damage (₹ Cr)</span>
              </button>

              <button
                onClick={() => setActiveTab('tornado')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'tornado'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sensitivity Tornado</span>
              </button>

              <button
                onClick={() => setActiveTab('directive')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTab === 'directive'
                    ? 'bg-purple text-white shadow-sm'
                    : 'bg-surface-secondary/60 text-ink-secondary hover:text-ink'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>CAP Disaster Directives</span>
              </button>
            </div>

            {/* Active Analytical Sub-Component */}
            {activeTab === 'hydrograph' && (
              <DynamicHydrographChart
                scenarioParams={scenarioParams}
                mitigationDepthCm={mitigationDepth}
              />
            )}

            {activeTab === 'gauge' && (
              <VirtualWaterGaugeInspector
                scenarioParams={scenarioParams}
                mitigationDepthCm={mitigationDepth}
                onFocusMapLocation={handleFocusMapLocation}
              />
            )}

            {activeTab === 'resilience' && (
              <ResilienceSpiderRadar
                scenarioParams={scenarioParams}
                mitigationDepthCm={mitigationDepth}
              />
            )}

            {activeTab === 'economic' && (
              <EconomicDamageEstimator
                scenarioParams={scenarioParams}
                mitigationDepthCm={mitigationDepth}
              />
            )}

            {activeTab === 'tornado' && (
              <SensitivityTornadoChart scenarioParams={scenarioParams} />
            )}

            {activeTab === 'directive' && (
              <DisasterDirectiveGenerator scenarioParams={scenarioParams} />
            )}
          </div>
        </div>
      </div>

      {/* ================= SPECIALIZED DIALOGS / DRAWERS ================= */}

      {/* 1. Historical Benchmark Presets */}
      <ScenarioBenchmarkPresets
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        currentParams={scenarioParams}
        onApplyPreset={(p) => {
          setScenarioParams(p);
          showToast('Historical extreme storm profile loaded into hydrodynamic engine.');
        }}
      />

      {/* 2. Ward-by-Ward Vulnerability Matrix */}
      <WardImpactMatrixModal
        isOpen={showWardMatrix}
        onClose={() => setShowWardMatrix(false)}
        scenarioParams={scenarioParams}
        onDispatchWard={handleDispatchWard}
      />

      {/* 3. Hydraulic Transect Profile (WSP) */}
      <HydraulicProfileModal
        isOpen={showTransect}
        onClose={() => setShowTransect(false)}
        scenarioParams={scenarioParams}
      />

      {/* 4. Monte Carlo Probabilistic Ensemble */}
      <MonteCarloEnsembleModal
        isOpen={showMonteCarlo}
        onClose={() => setShowMonteCarlo(false)}
        scenarioParams={scenarioParams}
      />

      {/* 5. Physical Breach & Failure Point Injector */}
      <BreachFailureInjectorModal
        isOpen={showBreachModal}
        onClose={() => setShowBreachModal(false)}
        activeBreaches={activeBreaches}
        onToggleBreach={handleToggleBreach}
      />

      {/* 6. Critical Asset Failure Cascade Tracker */}
      <AssetFailureCascadeModal
        isOpen={showAssetCascade}
        onClose={() => setShowAssetCascade(false)}
        scenarioParams={scenarioParams}
      />

      {/* 7. Evacuation Shelter Capacity & Access Tracker */}
      <ShelterCapacityTrackerModal
        isOpen={showShelters}
        onClose={() => setShowShelters(false)}
        scenarioParams={scenarioParams}
      />

      {/* 8. Arterial Mobility Corridor Speed Simulator */}
      <MobilityCorridorChokepointsModal
        isOpen={showMobility}
        onClose={() => setShowMobility(false)}
        scenarioParams={scenarioParams}
        onIssueDiversion={(c) => {
          showToast(`Emergency traffic diversion enforced on ${c.name}.`);
        }}
      />

      {/* 9. Scenario Snapshot Bookmark Vault */}
      <ScenarioBookmarkManagerModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        activeInterventions={Object.keys(activeWhatIfs).filter((k) => activeWhatIfs[k])}
        depthMitigationCm={mitigationDepth}
        scenarioParams={scenarioParams}
        onRestoreScenarioParams={(p) => {
          setScenarioParams(p);
          showToast('Scenario parameters restored from bookmark vault.');
        }}
        onRestoreScenario={(interventions) => {
          const restored = {};
          interventions.forEach((id) => (restored[id] = true));
          setActiveWhatIfs(restored);
        }}
      />

      {/* 10. Export Hydrodynamic Dossier */}
      <ExportDossierModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        scenarioParams={scenarioParams}
        activeBreaches={activeBreaches}
        activeWhatIfs={activeWhatIfs}
        deltaRoads={deltaRoads}
        deltaDepth={deltaDepth}
        deltaArea={deltaArea}
        deltaSurcharge={deltaSurcharge}
        deltaClearance={deltaClearance}
      />
    </div>
  );
}
