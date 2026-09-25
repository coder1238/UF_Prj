import React, { useState } from 'react';
import {
  X,
  BrainCircuit,
  Cpu,
  CheckCircle2,
  Activity,
  Sliders,
  TrendingUp,
} from 'lucide-react';

const ENSEMBLE_MODELS = [
  {
    id: 'convlstm',
    name: 'ConvLSTM v2.4-Prod',
    type: 'Spatiotemporal Recurrent',
    csi30: '0.842',
    ets: '0.718',
    ssim: '0.912',
    latency: '41.2s',
    resolution: '250m Gridded Mesh',
    leadTime: '0–3 Hours',
    description: 'IMD-calibrated ConvLSTM trained on 10 years of Colaba S-Band radar sweeps.',
    isRecommended: true,
  },
  {
    id: 'dgmr',
    name: 'DGMR v1.2 (Deep Generative)',
    type: 'Conditional GAN / Diffusion',
    csi30: '0.865',
    ets: '0.744',
    ssim: '0.884',
    latency: '58.0s',
    resolution: '250m Gridded Mesh',
    leadTime: '0–90 Min Peak',
    description: 'Generates sharp realistic convective cell boundaries without blurring at +60m.',
  },
  {
    id: 'phydnet',
    name: 'PhyDNet v2.0 (PINN)',
    type: 'Physics-Informed Advection',
    csi30: '0.810',
    ets: '0.688',
    ssim: '0.925',
    latency: '24.5s',
    resolution: '500m Gridded Mesh',
    leadTime: '0–2 Hours',
    description: 'Constrained by partial differential Navier-Stokes 2D mass conservation.',
  },
  {
    id: 'optical-flow',
    name: 'Farnebäck Optical Flow',
    type: 'Deterministic Echo Tracking',
    csi30: '0.725',
    ets: '0.590',
    ssim: '0.840',
    latency: '2.1s',
    resolution: '1 km Mesh',
    leadTime: '0–45 Min',
    description: 'Baseline fast vector extrapolation without deep learning cell growth/decay.',
  },
];

export default function EnsembleModelComparatorModal({
  isOpen,
  onClose,
  activeModelId = 'convlstm',
  onSelectModel,
}) {
  const [selectedId, setSelectedId] = useState(activeModelId);
  const [ensembleBlend, setEnsembleBlend] = useState(70); // % Deep Learning vs Physics
  const [isApplied, setIsApplied] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsApplied(true);
    if (onSelectModel) {
      onSelectModel(selectedId);
    }
    setTimeout(() => {
      setIsApplied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Ensemble Nowcasting Model Comparator &amp; Engine Switcher
              </h3>
              <p className="text-xs text-ink-secondary">
                Deep Generative vs ConvLSTM vs Physics-Informed Extrapolation Benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ENSEMBLE_MODELS.map((m) => {
              const isSelected = selectedId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-soft/40 border-purple ring-1 ring-purple shadow-sm'
                      : 'bg-surface-secondary border-border hover:border-purple/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">{m.name}</span>
                        {m.isRecommended && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-purple font-semibold bg-surface px-2 py-0.5 rounded border border-border">
                        {m.type}
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary mt-1">{m.description}</p>
                  </div>

                  {/* Benchmark Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/80 font-mono text-[11px]">
                    <div>
                      <div className="text-[9px] text-ink-secondary uppercase">CSI @ 30mm/h</div>
                      <div className="font-bold text-ink">{m.csi30}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-ink-secondary uppercase">ETS Skill</div>
                      <div className="font-bold text-purple">{m.ets}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-ink-secondary uppercase">Inference Latency</div>
                      <div className="font-bold text-ink">{m.latency}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Weights Blending Slider */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-ink uppercase">Ensemble Physics vs Generative Blending Weight</span>
              <span className="font-bold text-purple">{ensembleBlend}% Deep Learning / {100 - ensembleBlend}% PINN Physics</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={ensembleBlend}
              onChange={(e) => setEnsembleBlend(Number(e.target.value))}
              className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
              <span>Pure PINN Conservation</span>
              <span>Balanced Hybrid (Optimal)</span>
              <span>Pure DGMR Latent Extrapolation</span>
            </div>
          </div>

          {isApplied && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Active Nowcast driving engine switched successfully! Radar field updated.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            CUDA 12.4 Accelerated • PyTorch Hydro-ML Stack
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Set Active Model Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

