import React, { useState } from 'react';
import { X, Layers, Cpu, Database, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';

export default function ModelLayerVisualizerDrawer({ isOpen, onClose, model, showToast }) {
  if (!isOpen || !model) return null;

  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const layers = model.layers || [
    { name: 'Input Feature Raster', shape: '[1, 4, 256, 256]', type: 'Input Layer', params: '0', activation: 'Linear' },
    { name: 'Spatial Feature Encoder', shape: '[1, 64, 128, 128]', type: 'ResNet / Conv2D Block', params: '2.4M', activation: 'GELU' },
    { name: 'Hydrodynamic Latent Bottleneck', shape: '[1, 128, 64, 64]', type: 'Graph / Attention Backbone', params: '6.8M', activation: 'LayerNorm' },
    { name: 'Inundation Regression Head', shape: '[1, 2, 256, 256]', type: 'Physics Decoder', params: '3.1M', activation: 'ReLU' }
  ];

  const currentLayer = layers[selectedLayerIndex] || layers[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-surface border-l border-border h-full shadow-elevated flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft flex items-center justify-center text-purple">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                  Layer-By-Layer Tensor Profiler
                </span>
                <span className="text-xs font-mono text-muted">{model.code}</span>
              </div>
              <h2 className="text-base font-bold text-ink">{model.name}</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-border flex items-center justify-center text-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Computational Graph Flow */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="bg-canvas p-4 rounded-2xl border border-border">
            <h3 className="text-xs font-mono font-bold text-ink mb-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple" />
              Computational DAG & Execution Graph
            </h3>
            <p className="text-xs text-muted">
              Select any stage below to profile intermediate tensor shapes, memory footprint, and activation dynamics.
            </p>
          </div>

          {/* Interactive Layer Pipeline */}
          <div className="space-y-3">
            {layers.map((l, idx) => {
              const isSelected = idx === selectedLayerIndex;
              return (
                <div key={idx} className="flex flex-col">
                  <div
                    onClick={() => {
                      setSelectedLayerIndex(idx);
                      showToast?.(`Selected Layer ${idx + 1}: ${l.name}`);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-purple-50/70 border-purple ring-2 ring-purple/20 shadow-subtle' 
                        : 'bg-surface hover:bg-canvas border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center font-bold ${
                        isSelected ? 'bg-purple text-white' : 'bg-surface-secondary text-ink-secondary'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-ink">{l.name}</h4>
                        <span className="text-[10px] font-mono text-muted">{l.type}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="text-purple font-bold block">{l.shape}</span>
                      <span className="text-[10px] text-muted">{l.params} params</span>
                    </div>
                  </div>

                  {idx < layers.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-3 bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Layer Inspector */}
          <div className="bg-canvas p-5 rounded-2xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                Layer {selectedLayerIndex + 1} Inspector: {currentLayer.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                {currentLayer.activation}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-muted block">Output Tensor Dimension</span>
                <strong className="text-ink text-sm block mt-0.5">{currentLayer.shape}</strong>
                <span className="text-[9px] text-muted mt-1 block">Batch x Channel x Height x Width</span>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-muted block">Learnable Weights</span>
                <strong className="text-purple text-sm block mt-0.5">{currentLayer.params}</strong>
                <span className="text-[9px] text-muted mt-1 block">Optimized TensorRT Kernel</span>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-muted block">Non-linear Activation</span>
                <strong className="text-status-safe text-sm block mt-0.5">{currentLayer.activation}</strong>
                <span className="text-[9px] text-muted mt-1 block">Zero-gradient Saturation</span>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-muted block">Precision & Quantization</span>
                <strong className="text-ink text-sm block mt-0.5">{model.quantization || 'FP16 / INT8'}</strong>
                <span className="text-[9px] text-muted mt-1 block">Hardware Accelerated</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/60 text-xs text-ink-secondary leading-relaxed">
              <strong className="text-purple block mb-1 font-mono uppercase text-[10px]">Physics Loss Constraint:</strong>
              Enforces 2D Saint-Venant mass continuity divergence [div(u*h) + dh/dt = R - f] during backpropagation to prevent artificial puddle inflation.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
          <span className="text-xs font-mono text-muted">
            Total Model Parameters: <strong className="text-ink">{model.params || '24.2M'}</strong>
          </span>
          <button
            onClick={() => {
              showToast?.(`Verified ONNX runtime layer compatibility for ${model.name}`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-purple text-white hover:bg-purple-deep transition-colors"
          >
            Confirm Architecture
          </button>
        </div>
      </div>
    </div>
  );
}
