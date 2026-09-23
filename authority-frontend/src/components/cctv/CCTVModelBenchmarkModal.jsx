import React from 'react';
import { Cpu, CheckCircle2, Zap, X, Activity, Award, Gauge } from 'lucide-react';

export const AI_MODELS = [
  {
    id: 'YOLOv8-HydroEdge',
    name: 'YOLOv8-HydroEdge (v2.4)',
    type: 'TensorRT INT8',
    latency: '26.4 ms',
    fps: 37.8,
    map: '91.4%',
    vram: '1.82 GB',
    description: 'Specialized for high-speed edge waterline boundary segmentation on Jetson Orin.',
    status: 'ACTIVE RUNTIME',
    recommended: true,
  },
  {
    id: 'YOLOv11-FloodSeg',
    name: 'YOLOv11-FloodSeg (v1.1)',
    type: 'TensorRT FP16',
    latency: '34.2 ms',
    fps: 29.2,
    map: '93.8%',
    vram: '2.45 GB',
    description: 'Next-gen attention heads for adverse rain reflections and nighttime curb tracking.',
    status: 'STANDBY',
    recommended: false,
  },
  {
    id: 'Mask2Former-Waterline',
    name: 'Mask2Former UrbanGauge',
    type: 'ONNX INT8',
    latency: '58.6 ms',
    fps: 17.0,
    map: '96.2%',
    vram: '3.80 GB',
    description: 'Pixel-perfect semantic mask segmentation, best for post-incident forensic analysis.',
    status: 'STANDBY',
    recommended: false,
  },
  {
    id: 'Faster-RCNN-Gauge',
    name: 'Faster-RCNN GaugeDatum',
    type: 'PyTorch FP16',
    latency: '48.1 ms',
    fps: 20.8,
    map: '89.6%',
    vram: '3.10 GB',
    description: 'High-accuracy structural reference anchor detector for physical staff gauges.',
    status: 'STANDBY',
    recommended: false,
  },
];

export default function CCTVModelBenchmarkModal({
  isOpen,
  onClose,
  activeModel = 'YOLOv8-HydroEdge',
  onSelectModel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Edge Computer Vision Model Benchmark & Registry
              </h2>
              <p className="text-xs text-ink-secondary">
                Switch neural network backends deployed to municipal Jetson Orin nodes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Cards */}
        <div className="p-6 space-y-3.5 overflow-y-auto flex-1 text-ink">
          {AI_MODELS.map((m) => {
            const isSelected = m.id === activeModel;

            return (
              <div
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple bg-purple-soft/30 ring-2 ring-purple shadow-subtle'
                    : 'border-border bg-surface-secondary hover:border-purple/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink">{m.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-ink-secondary">
                        {m.type}
                      </span>
                      {m.recommended && (
                        <span className="text-[10px] font-bold text-status-safe bg-status-safe-soft px-1.5 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-secondary mt-1">{m.description}</p>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-purple text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Performance Metrics Strip */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/60 text-center">
                  <div>
                    <div className="text-[10px] text-ink-secondary">Latency</div>
                    <div className="font-mono text-xs font-bold text-purple">{m.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">Throughput</div>
                    <div className="font-mono text-xs font-bold text-ink">{m.fps} FPS</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">mAP@50</div>
                    <div className="font-mono text-xs font-bold text-status-safe">{m.map}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-secondary">VRAM Footprint</div>
                    <div className="font-mono text-xs font-bold text-ink">{m.vram}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-end gap-2 bg-surface-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-semibold hover:bg-purple-deep transition-all shadow-subtle"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

