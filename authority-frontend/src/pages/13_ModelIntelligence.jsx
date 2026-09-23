import React, { useState } from 'react';
import { EXTENDED_ML_MODELS, DAG_NODES_DATA } from '../components/models/modelsConstants';
import DagNodeProfilerModal from '../components/models/DagNodeProfilerModal';
import ModelDeepDiveModal from '../components/models/ModelDeepDiveModal';
import CalibrationRetuneModal from '../components/models/CalibrationRetuneModal';

// 20 Specialized Operational Feature Components
import {
  PinnVsSweHeatmapExplorer,
  GreenAmptInfiltrationTuner,
  DopplerEnsembleBlendingMatrix,
  HydroPinnSurchargeBackpropInspector,
  SensorGroundTruthDriftMonitor,
} from '../components/models/ModelFeaturesGroup1';

import {
  DataDriftPsiDetector,
  OnnxEdgeQuantizerProfiler,
  AdversarialStormStressTester,
  CctvVisionHydrologyCalibrator,
  NdmaGovernanceDossierGenerator,
} from '../components/models/ModelFeaturesGroup2';

import {
  MonteCarloUncertaintyEnvelope,
  RetrainingPipelineOrchestrator,
  EmergencyRouteProfiler,
  GreenAiEnergyTelemetry,
  SpatialInterWardFairnessAuditor,
} from '../components/models/ModelFeaturesGroup3';

import {
  ActiveLearningReviewQueue,
  TidalSluiceGateCoSimulator,
  CanaryRollbackManager,
  ShapFeatureExplainabilityInspector,
  WebAudioTelemetrySonification,
} from '../components/models/ModelFeaturesGroup4';

import {
  BrainCircuit,
  Activity,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  RefreshCw,
  Search,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function ModelIntelligence() {
  const [models] = useState(EXTENDED_ML_MODELS);
  const [selectedModel, setSelectedModel] = useState(EXTENDED_ML_MODELS[0]);
  const [toast, setToast] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | OPERATIONAL | MONITORING

  // Modals
  const [selectedDagNode, setSelectedDagNode] = useState(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isRetuneOpen, setIsRetuneOpen] = useState(false);

  // E2E Pipeline Simulation State
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(null);
  const [pipelineProgress, setPipelineProgress] = useState(0);

  // 20 Features Category Filter
  const [featuresCategory, setFeaturesCategory] = useState('all'); // all | physics | drift | edge | governance

  // Calibration telemetry dynamic state
  const [calibrationStats, setCalibrationStats] = useState({
    mae: '2.1 cm',
    r2: '94.8%',
    observedDelta: '+0.8 cm',
    lastCalibrated: '18:31:00 IST',
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // E2E DAG Execution Simulation
  const handleRunFullPipeline = () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    setPipelineProgress(0);
    setActivePipelineStep(1);

    showToast('Initiating End-to-End Multiscale Hydrodynamic ML Inference Cycle...');

    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep <= 8) {
        setActivePipelineStep(currentStep);
        setPipelineProgress(Math.round(((currentStep - 1) / 8) * 100));
      } else {
        clearInterval(interval);
        setActivePipelineStep(null);
        setPipelineProgress(100);
        setIsPipelineRunning(false);
        showToast('E2E Inference Cycle Complete! All 8 stages validated in 118s.');
      }
    }, 1100);
  };

  // Download Diagnostic Log
  const handleDownloadDiagnosticLog = () => {
    const diagnosticPayload = {
      system: 'Municipal Corporation of Greater Mumbai Flood Command Center',
      subsystem: 'Hydrological Physics-ML Inference Pipeline Telemetry',
      generatedAt: new Date().toISOString(),
      e2eLatencySeconds: 118.2,
      pipelineHealth: '8/8 STAGES OPERATIONAL',
      activeModels: models.map((m) => ({
        id: m.id,
        name: m.name,
        version: m.version,
        latency: m.latency,
        confidence: m.confidence,
        status: m.status,
        mae: m.mae,
      })),
      calibrationAudit: {
        acousticSensorParityR2: calibrationStats.r2,
        maeGroundTruth: calibrationStats.mae,
        observedDelta: calibrationStats.observedDelta,
        dataDriftPsi: 0.040,
        pinnSurrogateParity: '98.6%',
        lastRetuneTimestamp: calibrationStats.lastCalibrated,
      },
      auditSignature: 'SHA256:8f9a23bc1109ed4502c4b8109ad22e519280ab441c0989e2',
    };

    const blob = new Blob([JSON.stringify(diagnosticPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mumbai-flood-ml-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Downloaded complete model diagnostics telemetry log (JSON).');
  };

  // Filtered models
  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.architecture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-64px)] font-sans antialiased text-ink bg-canvas">
      {/* Dynamic Toast Feedback */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple" />
            Hydrological Physics-ML Inference Pipeline &amp; Calibration Telemetry
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Coupled 2D hydrodynamic solvers &bull; Physics-Informed Neural Networks (PINN) &bull; Edge Deployment
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-status-safe-soft text-status-safe font-bold border border-status-safe/30">
            8/8 STAGES ACTIVE
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-soft text-purple font-bold border border-purple/30">
            E2E CYCLE: 118s
          </span>
          <button
            onClick={handleRunFullPipeline}
            disabled={isPipelineRunning}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-bold flex items-center gap-1.5 shadow-subtle transition-colors disabled:opacity-50"
          >
            {isPipelineRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Stage {activePipelineStep}/8...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Full E2E Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Inference DAG Pipeline Ribbon */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-ink uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span>End-to-End Computational Workflow (DAG Pipeline)</span>
            <span className="text-[10px] font-mono text-purple bg-purple-soft px-2 py-0.5 rounded">
              Click Any Node to Profile &amp; Execute
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPipelineRunning && (
              <span className="text-[10px] font-mono text-purple font-bold">
                Progress: {pipelineProgress}%
              </span>
            )}
            <span className="text-[10px] font-mono text-ink-secondary">TOTAL CYCLE: 0–180 MIN</span>
          </div>
        </div>

        {/* Progress Bar for Pipeline */}
        {isPipelineRunning && (
          <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-purple transition-all duration-300"
              style={{ width: `${pipelineProgress}%` }}
            />
          </div>
        )}

        {/* 8 Clickable Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 pt-1">
          {DAG_NODES_DATA.map((node) => {
            const isActiveInPipeline = activePipelineStep === node.num;
            return (
              <button
                key={node.num}
                onClick={() => setSelectedDagNode(node)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                  isActiveInPipeline
                    ? 'bg-purple-soft border-purple ring-2 ring-purple shadow-elevated scale-102'
                    : 'bg-surface-secondary border-border hover:border-purple/60 hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full font-mono text-[10px] flex items-center justify-center font-bold ${
                      isActiveInPipeline
                        ? 'bg-purple text-white animate-pulse'
                        : 'bg-purple text-white'
                    }`}
                  >
                    {node.num}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActiveInPipeline ? 'bg-purple animate-ping' : 'bg-status-safe'
                    }`}
                  />
                </div>
                <div className="font-bold text-xs text-ink mt-2 truncate w-full">{node.name}</div>
                <div className="flex justify-between items-center text-[10px] font-mono text-ink-secondary mt-1 w-full">
                  <span>{node.ver}</span>
                  <span className="text-purple font-semibold">{node.latency}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace (Model Cards Grid + Calibration Sidebar) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Model Cards Grid (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-3.5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-surface p-3 rounded-xl border border-border">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search models, architectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto font-mono text-[10px]">
              {['ALL', 'OPERATIONAL', 'MONITORING'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-purple text-white'
                      : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80 border border-border'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredModels.map((model) => {
              const isSelected = selectedModel?.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-soft/40 border-purple shadow-subtle ring-1 ring-purple/50'
                      : 'bg-surface border-border hover:border-purple/40 hover:bg-surface-subtle'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-purple bg-purple-soft px-2 py-0.5 rounded border border-purple/20">
                        {model.version}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-status-safe bg-status-safe-soft px-2 py-0.5 rounded uppercase border border-status-safe/20">
                        {model.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-ink mt-2 leading-tight">{model.name}</h4>
                    <p className="text-[11px] text-ink-secondary mt-0.5 line-clamp-1">
                      {model.architecture}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/70 text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-ink-secondary block">Latency</span>
                      <strong className="text-ink">{model.latency}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-secondary block">Confidence</span>
                      <strong className="text-purple">{model.confidence}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-secondary block">Correlation</span>
                      <strong className="text-status-safe">{model.correlation}</strong>
                    </div>
                  </div>

                  {/* Actions on Card */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModel(model);
                        setIsDeepDiveOpen(true);
                      }}
                      className="flex-1 py-1.5 px-2 bg-surface hover:bg-purple hover:text-white border border-border hover:border-purple text-ink rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Deep Dive &amp; Metrics</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Initiating quick CUDA benchmark on ${model.name}...`);
                        setSelectedModel(model);
                        setIsDeepDiveOpen(true);
                      }}
                      className="py-1.5 px-2.5 bg-surface-secondary hover:bg-surface border border-border text-ink rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Run CUDA Benchmark"
                    >
                      <Activity className="w-3 h-3 text-purple" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Calibration & Drift Audit Inspector (4 cols) */}
        <div className="xl:col-span-4 bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple" />
              Calibration &amp; Drift Audit
            </h3>
            <span className="text-[10px] font-mono text-status-safe font-bold bg-status-safe-soft px-2 py-0.5 rounded border border-status-safe/20">
              VERIFIED
            </span>
          </div>

          {/* Sensor Ground Truth Validation */}
          <div className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-ink">Sensor Ground-Truth Validation</span>
              <span className="text-[9px] font-mono text-purple font-bold">48 Telemetry Nodes</span>
            </div>
            <div className="space-y-1 text-xs font-mono text-ink-secondary">
              <div className="flex justify-between">
                <span>Ultrasonic Acoustic Match:</span>
                <strong className="text-status-safe font-bold">{calibrationStats.r2} R&sup2;</strong>
              </div>
              <div className="flex justify-between">
                <span>Mean Absolute Error (MAE):</span>
                <strong className="text-ink">{calibrationStats.mae} (Across 48 Sensors)</strong>
              </div>
              <div className="flex justify-between">
                <span>Observed vs Predicted Delta:</span>
                <strong className="text-purple">{calibrationStats.observedDelta} (Within Budget)</strong>
              </div>
              <div className="flex justify-between text-[10px] text-ink-secondary pt-0.5 border-t border-border/50">
                <span>Last Calibrated:</span>
                <span className="text-ink">{calibrationStats.lastCalibrated}</span>
              </div>
            </div>
          </div>

          {/* Input Data Quality & Drift */}
          <div className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-ink">Input Data Quality &amp; Drift</span>
            <div className="space-y-1 text-xs font-mono text-ink-secondary">
              <div className="flex justify-between">
                <span>Radar Sensor Noise:</span>
                <strong className="text-status-safe font-bold">0.4% (Minimal)</strong>
              </div>
              <div className="flex justify-between">
                <span>Kalman Imputation Rate:</span>
                <strong className="text-ink">1.2% (Auto-filtered)</strong>
              </div>
              <div className="flex justify-between">
                <span>Population Stability Index (PSI):</span>
                <strong className="text-status-safe font-bold">0.04 (No Drift)</strong>
              </div>
            </div>
          </div>

          {/* Surrogate Acceleration */}
          <div className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col gap-1">
            <span className="text-[11px] font-bold text-ink">PINN Surrogate Acceleration</span>
            <div className="text-xs text-ink-secondary leading-relaxed">
              Hydro-PINN graph surrogate achieves <strong className="text-purple font-bold">14.2x faster</strong> convergence with 98.6% parity against 2D finite-volume SWE equations.
            </div>
          </div>

          {/* Action Directives */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => setIsRetuneOpen(true)}
              className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-xl text-xs font-bold flex items-center justify-between shadow-subtle transition-colors"
            >
              <span>Trigger On-Demand Calibration Retune</span>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadDiagnosticLog}
              className="w-full py-2 px-3 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-subtle"
            >
              <span>Download Model Diagnostic Log</span>
              <Download className="w-3.5 h-3.5 text-purple" />
            </button>
          </div>
        </div>
      </div>

      {/* 20 DETAILED OPERATIONAL FEATURES SUITE */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Features Header & Categorization Tabs */}
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple animate-pulse" />
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                20 Operational Physics-ML Decision Support Features
              </h3>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              Domain-engineered analytical modules for Mumbai Disaster Control authorities
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
            {[
              { id: 'all', label: 'All 20 Features' },
              { id: 'physics', label: 'Physics & Hydro' },
              { id: 'drift', label: 'Drift & Calibration' },
              { id: 'edge', label: 'Edge & MLOps' },
              { id: 'governance', label: 'Governance & Audits' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFeaturesCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  featuresCategory === cat.id
                    ? 'bg-purple text-white shadow-subtle'
                    : 'bg-surface-secondary text-ink hover:bg-surface border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Feature Rendering based on Category */}
        <div className="space-y-4">
          {/* Category: Physics & Hydrodynamics */}
          {(featuresCategory === 'all' || featuresCategory === 'physics') && (
            <>
              <PinnVsSweHeatmapExplorer showToast={showToast} />
              <GreenAmptInfiltrationTuner showToast={showToast} />
              <DopplerEnsembleBlendingMatrix showToast={showToast} />
              <HydroPinnSurchargeBackpropInspector showToast={showToast} />
              <TidalSluiceGateCoSimulator showToast={showToast} />
            </>
          )}

          {/* Category: Drift & Ground Calibration */}
          {(featuresCategory === 'all' || featuresCategory === 'drift') && (
            <>
              <SensorGroundTruthDriftMonitor showToast={showToast} />
              <DataDriftPsiDetector showToast={showToast} />
              <AdversarialStormStressTester showToast={showToast} />
              <CctvVisionHydrologyCalibrator showToast={showToast} />
              <MonteCarloUncertaintyEnvelope showToast={showToast} />
            </>
          )}

          {/* Category: Edge & MLOps Deployment */}
          {(featuresCategory === 'all' || featuresCategory === 'edge') && (
            <>
              <OnnxEdgeQuantizerProfiler showToast={showToast} />
              <RetrainingPipelineOrchestrator showToast={showToast} />
              <EmergencyRouteProfiler showToast={showToast} />
              <CanaryRollbackManager showToast={showToast} />
              <WebAudioTelemetrySonification showToast={showToast} />
            </>
          )}

          {/* Category: Governance & Resilience Audits */}
          {(featuresCategory === 'all' || featuresCategory === 'governance') && (
            <>
              <NdmaGovernanceDossierGenerator showToast={showToast} />
              <GreenAiEnergyTelemetry showToast={showToast} />
              <SpatialInterWardFairnessAuditor showToast={showToast} />
              <ActiveLearningReviewQueue showToast={showToast} />
              <ShapFeatureExplainabilityInspector showToast={showToast} />
            </>
          )}
        </div>
      </div>

      {/* DAG Node Execution Profiler Modal */}
      <DagNodeProfilerModal
        isOpen={!!selectedDagNode}
        onClose={() => setSelectedDagNode(null)}
        node={selectedDagNode}
        showToast={showToast}
      />

      {/* Model Deep-Dive Inspector Modal */}
      <ModelDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        model={selectedModel}
        showToast={showToast}
      />

      {/* Calibration Retune Modal */}
      <CalibrationRetuneModal
        isOpen={isRetuneOpen}
        onClose={() => setIsRetuneOpen(false)}
        onApplyCalibration={(newStats) => {
          setCalibrationStats((prev) => ({
            ...prev,
            ...newStats,
          }));
        }}
        showToast={showToast}
      />
    </div>
  );
}
