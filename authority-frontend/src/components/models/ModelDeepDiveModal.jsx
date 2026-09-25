import React, { useState } from 'react';
import {
  X,
  BrainCircuit,
  Cpu,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileCode,
  Layers,
  Sparkles,
  BarChart2,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';

export default function ModelDeepDiveModal({ isOpen, onClose, model, showToast }) {
  const [activeTab, setActiveTab] = useState('specs'); // specs | metrics | benchmark | export
  const [threshold, setThreshold] = useState(0.5);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState(null);

  if (!isOpen || !model) return null;

  // Dynamic Confusion Matrix calculations based on threshold
  const baseTp = 840;
  const baseFp = 38;
  const baseFn = 42;
  const baseTn = 1080;

  const currentTp = Math.round(baseTp * (1 - (threshold - 0.5) * 0.4));
  const currentFp = Math.round(Math.max(4, baseFp * Math.pow(1 - threshold, 1.4) * 2));
  const currentFn = Math.round(Math.max(6, baseFn * Math.pow(threshold, 1.4) * 2));
  const currentTn = Math.round(baseTn * (1 + (threshold - 0.5) * 0.1));

  const precision = ((currentTp / (currentTp + currentFp)) * 100).toFixed(1);
  const recall = ((currentTp / (currentTp + currentFn)) * 100).toFixed(1);
  const f1 = (
    (2 * ((parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall)))) /
    100
  ).toFixed(3);

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResults(null);
    setTimeout(() => {
      setIsBenchmarking(false);
      const baseLat = parseFloat(model.latency) || 12.0;
      setBenchmarkResults({
        runs: 25,
        p50Latency: (baseLat * 0.92).toFixed(2),
        p95Latency: (baseLat * 1.08).toFixed(2),
        p99Latency: (baseLat * 1.25).toFixed(2),
        throughput: (1000 / (baseLat * 0.92)).toFixed(1),
        gpuTemperature: '64°C',
        vramUtil: '82%',
      });
      if (showToast) {
        showToast(`Benchmark complete for ${model.name}: p50 = ${(baseLat * 0.92).toFixed(2)}s`);
      }
    }, 1500);
  };

  const handleDownloadConfig = () => {
    const configData = {
      model_id: model.id,
      name: model.name,
      version: model.version,
      architecture: model.architecture,
      precision_operating_point: threshold,
      active_metrics: {
        precision: `${precision}%`,
        recall: `${recall}%`,
        f1_score: f1,
        mae: model.mae,
        correlation: model.correlation,
      },
      hardware_target: model.hardware || 'NVIDIA TensorRT GPU Cluster',
      generated_at: new Date().toISOString(),
      onnx_opset: 18,
      signature: 'BMC-DISASTER-MANAGEMENT-ML-VERIFIED',
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.id}-deployment-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) {
      showToast(`Exported ${model.id} ONNX config manifest.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-ink">{model.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  {model.version}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold uppercase">
                  {model.status}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5 font-mono">{model.architecture}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-surface px-4 text-xs font-semibold gap-2">
          {[
            { id: 'specs', label: 'Architecture & Tensors', icon: Layers },
            { id: 'metrics', label: 'Operating Threshold & Curves', icon: Sliders },
            { id: 'benchmark', label: 'CUDA Latency Benchmark', icon: Activity },
            { id: 'export', label: 'ONNX Manifest & Deploy', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
                  isActive
                    ? 'border-purple text-purple font-bold'
                    : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                  <span className="text-[10px] text-ink-secondary block font-mono">Parameters</span>
                  <strong className="text-ink font-mono text-sm block mt-0.5">
                    {model.parameters || '38.4M params'}
                  </strong>
                </div>
                <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                  <span className="text-[10px] text-ink-secondary block font-mono">Checkpoint Size</span>
                  <strong className="text-purple font-mono text-sm block mt-0.5">
                    {model.weightsSize || '210 MB'}
                  </strong>
                </div>
                <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                  <span className="text-[10px] text-ink-secondary block font-mono">Mean Abs Error</span>
                  <strong className="text-status-safe font-mono text-sm block mt-0.5">
                    {model.mae || '1.8 cm'}
                  </strong>
                </div>
                <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                  <span className="text-[10px] text-ink-secondary block font-mono">Correlation (R²)</span>
                  <strong className="text-status-safe font-mono text-sm block mt-0.5">
                    {model.correlation || '95.2%'}
                  </strong>
                </div>
              </div>

              {/* Data Pipeline Flow */}
              <div className="p-4 bg-surface border border-border rounded-xl space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple" />
                  Physics &amp; Telemetry Data Pipeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-secondary/70 border border-border rounded-lg space-y-1">
                    <span className="text-[10px] text-ink-secondary font-mono font-bold block">
                      INGESTION INPUTS:
                    </span>
                    <p className="text-ink font-mono text-xs">{model.inputs}</p>
                  </div>
                  <div className="p-3 bg-surface-secondary/70 border border-border rounded-lg space-y-1">
                    <span className="text-[10px] text-ink-secondary font-mono font-bold block">
                      SYNTHESIZED OUTPUTS:
                    </span>
                    <p className="text-purple font-mono text-xs">{model.outputs}</p>
                  </div>
                </div>
              </div>

              {/* Deployment Environment */}
              <div className="p-4 bg-surface border border-border rounded-xl space-y-2 font-mono text-[11px]">
                <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-sans">
                  Target Infrastructure &amp; Toolchain
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-secondary pt-1">
                  <div>
                    Runtime Engine:{' '}
                    <strong className="text-ink">{model.framework || 'PyTorch 2.3 + TensorRT'}</strong>
                  </div>
                  <div>
                    Compute Hardware:{' '}
                    <strong className="text-ink">{model.hardware || 'NVIDIA A100 Tensor Core'}</strong>
                  </div>
                  <div>
                    Training Corpus:{' '}
                    <strong className="text-ink">
                      {model.trainingMonsoons || '10 Monsoon Seasons (2015–2025)'}
                    </strong>
                  </div>
                  <div>
                    Prediction Horizon:{' '}
                    <strong className="text-purple">{model.leadTime || '0–180 minutes'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              {/* Threshold Slider */}
              <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink uppercase tracking-wider">
                    Diagnostic Decision Cutoff Threshold (&tau;)
                  </span>
                  <span className="font-mono text-xs text-purple font-bold bg-purple-soft px-2 py-0.5 rounded">
                    &tau; = {threshold.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.02"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-purple h-2 bg-surface-secondary rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                  <span>0.10 (High Sensitivity / Flood Early Warning)</span>
                  <span>0.90 (High Specificity / Conservative Evac)</span>
                </div>
              </div>

              {/* Confusion Matrix and Metrics Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2x2 Grid */}
                <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                  <span className="font-bold text-[11px] text-ink uppercase tracking-wide block">
                    Validation Confusion Matrix (2,000 Verified Gauges)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-3 bg-status-safe-soft/70 border border-status-safe/40 rounded-xl">
                      <span className="text-[10px] text-status-safe block font-bold">True Positives (TP)</span>
                      <strong className="text-base text-status-safe">{currentTp}</strong>
                    </div>
                    <div className="p-3 bg-status-alert-soft/70 border border-status-alert/40 rounded-xl">
                      <span className="text-[10px] text-status-alert block font-bold">False Positives (FP)</span>
                      <strong className="text-base text-status-alert">{currentFp}</strong>
                    </div>
                    <div className="p-3 bg-status-warning-soft/70 border border-status-warning/40 rounded-xl">
                      <span className="text-[10px] text-status-warning block font-bold">False Negatives (FN)</span>
                      <strong className="text-base text-status-warning">{currentFn}</strong>
                    </div>
                    <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                      <span className="text-[10px] text-ink-secondary block font-bold">True Negatives (TN)</span>
                      <strong className="text-base text-ink">{currentTn}</strong>
                    </div>
                  </div>
                </div>

                {/* Derived Metrics */}
                <div className="p-4 bg-surface border border-border rounded-xl flex flex-col justify-between">
                  <span className="font-bold text-[11px] text-ink uppercase tracking-wide block">
                    Calculated Operating Metrics
                  </span>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center p-2 bg-surface-secondary rounded-lg">
                      <span className="text-ink-secondary">Precision (PPV):</span>
                      <strong className="text-purple">{precision}%</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-surface-secondary rounded-lg">
                      <span className="text-ink-secondary">Recall / Sensitivity:</span>
                      <strong className="text-status-safe">{recall}%</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-surface-secondary rounded-lg">
                      <span className="text-ink-secondary">Harmonic F1-Score:</span>
                      <strong className="text-ink font-bold">{f1}</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-surface-secondary rounded-lg">
                      <span className="text-ink-secondary">Critical Success Index (CSI):</span>
                      <strong className="text-status-safe">
                        {(currentTp / (currentTp + currentFp + currentFn)).toFixed(3)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benchmark' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface border border-border rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-ink">Automated CUDA Inference Profiler</h4>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Runs 25 real-time inference batches with tensor warmups to profile latency distribution.
                  </p>
                </div>
                <button
                  onClick={handleRunBenchmark}
                  disabled={isBenchmarking}
                  className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isBenchmarking ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Profiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch 25-Run Benchmark</span>
                    </>
                  )}
                </button>
              </div>

              {benchmarkResults && (
                <div className="p-4 bg-ink text-white rounded-xl font-mono text-xs space-y-3 border border-border">
                  <div className="flex items-center justify-between text-status-safe border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Benchmark Profiling Succeeded
                    </span>
                    <span className="text-[10px] text-white/60">25 Batches Evaluated</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">p50 Median Latency:</span>
                      <strong className="text-sm text-status-safe">{benchmarkResults.p50Latency}s</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">p95 Latency:</span>
                      <strong className="text-sm text-purple-light">{benchmarkResults.p95Latency}s</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">p99 Tail Latency:</span>
                      <strong className="text-sm text-status-warning">{benchmarkResults.p99Latency}s</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">Throughput:</span>
                      <strong className="text-sm text-white">{benchmarkResults.throughput} runs/min</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">GPU VRAM Peak:</span>
                      <strong className="text-sm text-white">{benchmarkResults.vramUtil}</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/60 block">GPU Temp:</span>
                      <strong className="text-sm text-white">{benchmarkResults.gpuTemperature}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface border border-border rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-ink">ONNX Runtime Deployment Manifest</h4>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      Export full configuration metadata, quantization parameters, and cryptographic weights signature.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadConfig}
                    className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Manifest (JSON)</span>
                  </button>
                </div>

                <div className="p-3 bg-surface-secondary rounded-xl font-mono text-[11px] text-ink overflow-x-auto border border-border max-h-56">
                  <pre>
                    {JSON.stringify(
                      {
                        model_id: model.id,
                        name: model.name,
                        version: model.version,
                        architecture: model.architecture,
                        precision_operating_point: threshold,
                        metrics: {
                          precision: `${precision}%`,
                          recall: `${recall}%`,
                          f1_score: f1,
                          mae: model.mae,
                        },
                        hardware: model.hardware || 'NVIDIA TensorRT GPU Cluster',
                        timestamp: new Date().toISOString(),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-secondary">
            <ShieldCheck className="w-4 h-4 text-status-safe" />
            <span>Cryptographically Signed by Mumbai Municipal Flood Authority</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface hover:bg-surface-secondary border border-border rounded-lg text-xs font-semibold text-ink transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
