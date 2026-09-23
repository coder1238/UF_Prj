import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Clock,
  Terminal,
  Server,
  Zap,
} from 'lucide-react';

export default function DagNodeProfilerModal({ isOpen, onClose, node, onRunNode, showToast }) {
  const [isRunning, setIsRunning] = useState(false);
  const [nodeOutput, setNodeOutput] = useState(null);
  const [selectedTensor, setSelectedTensor] = useState('tensor_primary');
  const [threadCount, setThreadCount] = useState(16);

  if (!isOpen || !node) return null;

  const handleExecuteSingleNode = () => {
    setIsRunning(true);
    setNodeOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setNodeOutput({
        timestamp: new Date().toLocaleTimeString(),
        executionDurationMs: (parseFloat(node.latency) * 1000 * 0.85).toFixed(1),
        peakVramMb: parseInt(node.gpuMemory) * 980 || 2048,
        status: 'SUCCESS',
        tensorsGenerated: node.outputTensors.length,
        massConservationDelta: '0.004%',
      });
      if (showToast) {
        showToast(`Successfully executed DAG Stage ${node.num}: ${node.name} (${node.ver})`);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-purple text-white font-mono text-xs flex items-center justify-center font-bold">
              {node.num}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-ink">{node.name} Execution Profiler</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  {node.ver}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                  {node.status}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">{node.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Hardware & Runtime Engine Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-surface-secondary border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary block font-mono">Backend Kernel</span>
              <strong className="text-ink font-mono text-xs truncate block mt-0.5">
                {node.computeBackend}
              </strong>
            </div>
            <div className="p-3 bg-surface-secondary border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary block font-mono">Baseline Latency</span>
              <strong className="text-purple font-mono text-xs block mt-0.5">{node.latency}</strong>
            </div>
            <div className="p-3 bg-surface-secondary border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary block font-mono">GPU VRAM Allocation</span>
              <strong className="text-ink font-mono text-xs block mt-0.5">{node.gpuMemory}</strong>
            </div>
            <div className="p-3 bg-surface-secondary border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary block font-mono">Precision Mode</span>
              <strong className="text-status-safe font-mono text-xs block mt-0.5">{node.precision}</strong>
            </div>
          </div>

          {/* Input & Output Graph Linkages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Input Sources */}
            <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
              <span className="font-bold text-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-purple" />
                Upstream Input Dependencies
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {node.inputSources.map((inp, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-surface-secondary/70 border border-border/70 flex items-center justify-between text-ink"
                  >
                    <span className="truncate">{inp}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                      RESOLVED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Tensors */}
            <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
              <span className="font-bold text-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple" />
                Downstream Generated Tensors
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {node.outputTensors.map((out, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTensor(out)}
                    className={`w-full p-2 rounded border text-left flex items-center justify-between transition-all ${
                      selectedTensor === out
                        ? 'bg-purple-soft/60 border-purple text-purple-deep font-bold'
                        : 'bg-surface-secondary/70 border-border/70 text-ink hover:border-purple/30'
                    }`}
                  >
                    <span className="truncate">{out}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-soft text-purple">
                      Active
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Kernel Controls */}
          <div className="p-3.5 bg-surface border border-border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple" />
                Dynamic Thread &amp; Memory Allocation
              </span>
              <span className="font-mono text-[11px] text-purple font-bold">
                Parallel Workers: {threadCount}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-ink-secondary font-mono">4 Cores</span>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={threadCount}
                onChange={(e) => setThreadCount(parseInt(e.target.value))}
                className="flex-1 accent-purple h-1.5 bg-surface-secondary rounded cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">64 Cores (HPC)</span>
            </div>
          </div>

          {/* Execution Simulation Output Terminal */}
          {nodeOutput && (
            <div className="p-3.5 bg-ink text-white rounded-xl font-mono text-xs space-y-2 border border-border">
              <div className="flex items-center justify-between text-status-safe border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Execution Verified [EXIT 0]
                </span>
                <span className="text-[10px] text-white/60">{nodeOutput.timestamp}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-white/60 block text-[10px]">Real Execution:</span>
                  <span className="text-white font-bold">{nodeOutput.executionDurationMs} ms</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Peak VRAM:</span>
                  <span className="text-purple-light font-bold">{nodeOutput.peakVramMb} MB</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Tensors Produced:</span>
                  <span className="text-status-safe font-bold">{nodeOutput.tensorsGenerated} Tensors</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px]">Mass Balance Dev:</span>
                  <span className="text-status-safe font-bold">{nodeOutput.massConservationDelta}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-ink-secondary">
            Throughput: <strong className="text-ink">{node.throughput}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-border rounded-lg text-ink hover:bg-surface-secondary font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleExecuteSingleNode}
              disabled={isRunning}
              className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Kernel...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Stage {node.num} Kernel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
