import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Info, 
  BarChart2, 
  ShieldAlert, 
  TrendingUp,
  Sliders,
  Cpu
} from 'lucide-react';
import { ENSEMBLE_DETAILS } from '../../data/forecastExtraData';

export default function ForecastEnsembleModal({ isOpen, onClose, selectedWard }) {
  const [percentileMode, setPercentileMode] = useState('p50'); // 'p10' | 'p50' | 'p90'
  const [activeTab, setActiveTab] = useState('spread'); // 'spread' | 'uncertainty' | 'models'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-soft text-purple-deep">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  32 ENSEMBLE MEMBERS
                </span>
                <span className="text-xs font-mono text-ink-muted">Spread: {ENSEMBLE_DETAILS.spreadVarianceCm}</span>
              </div>
              <h2 className="text-lg font-bold text-ink">
                Probabilistic Forecast & Error Decomposition
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-5 bg-white text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('spread')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'spread' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Ensemble Spread</span>
          </button>
          <button
            onClick={() => setActiveTab('uncertainty')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'uncertainty' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Uncertainty Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'models' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Model Weights</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'spread' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-soft/40 border border-purple-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-ink">Confidence Interval Percentiles</h4>
                  <p className="text-xs text-ink-secondary">
                    Evaluating Mumbai hydrodynamic envelope across 32 stochastic perturbation runs.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border text-xs font-mono font-bold shrink-0">
                  <button
                    onClick={() => setPercentileMode('p10')}
                    className={`px-3 py-1 rounded-lg transition ${
                      percentileMode === 'p10' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    P10 (Best Case)
                  </button>
                  <button
                    onClick={() => setPercentileMode('p50')}
                    className={`px-3 py-1 rounded-lg transition ${
                      percentileMode === 'p50' ? 'bg-purple-primary text-white' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    P50 (Median)
                  </button>
                  <button
                    onClick={() => setPercentileMode('p90')}
                    className={`px-3 py-1 rounded-lg transition ${
                      percentileMode === 'p90' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    P90 (Severe)
                  </button>
                </div>
              </div>

              {/* Percentile Explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
                <div className={`p-3.5 rounded-2xl border transition ${
                  percentileMode === 'p10' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-border'
                }`}>
                  <span className="text-[10px] text-emerald-800 font-bold block uppercase">P10 EXCEEDANCE</span>
                  <strong className="text-xl font-extrabold text-emerald-900 block mt-1">10% Probability</strong>
                  <span className="text-xs text-slate-600 mt-1 block">Peak depth limited to 26 cm. Gravity drainage partially holds.</span>
                </div>
                <div className={`p-3.5 rounded-2xl border transition ${
                  percentileMode === 'p50' ? 'bg-purple-soft/60 border-purple-primary ring-2 ring-primary/20' : 'bg-slate-50 border-border'
                }`}>
                  <span className="text-[10px] text-purple-deep font-bold block uppercase">P50 MEDIAN (CURRENT)</span>
                  <strong className="text-xl font-extrabold text-purple-primary block mt-1">50% Probability</strong>
                  <span className="text-xs text-slate-600 mt-1 block">Expected baseline: 39 cm peak depth at +90m.</span>
                </div>
                <div className={`p-3.5 rounded-2xl border transition ${
                  percentileMode === 'p90' ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20' : 'bg-slate-50 border-border'
                }`}>
                  <span className="text-[10px] text-red-800 font-bold block uppercase">P90 WORST CASE</span>
                  <strong className="text-xl font-extrabold text-red-700 block mt-1">90% Exceedance</strong>
                  <span className="text-xs text-slate-600 mt-1 block">Tidal lock + cloudburst core: 48 cm peak depth.</span>
                </div>
              </div>

              <div className="bg-canvas p-4 rounded-2xl border border-border text-xs text-ink-secondary space-y-2 leading-relaxed">
                <div className="flex items-center gap-2 text-ink font-bold font-mono">
                  <Info className="w-4 h-4 text-primary" />
                  <span>Why probabilistic forecasting saves lives:</span>
                </div>
                <p>
                  Deterministic flood heights create a false sense of precision. Our 32 ensemble runs account for micro-scale convective cloudburst variations, tidal boundary sloshing in Mahim Bay, and variable drain inlet grate clogging.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'uncertainty' && (
            <div className="space-y-3">
              <p className="text-xs text-ink-secondary">
                Rigorous scientific audit of hydrological variance sources in Greater Mumbai 0–3 hour nowcasts:
              </p>
              <div className="space-y-2">
                {ENSEMBLE_DETAILS.uncertaintyContributors.map((c, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white border border-border shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-ink flex items-center gap-2">
                        <span>{c.factor}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          ±{c.varianceCm} cm
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted">{c.description}</p>
                    </div>
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                      <div 
                        className="h-full bg-purple-primary rounded-full" 
                        style={{ width: `${(c.varianceCm / 2.5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-3">
              <p className="text-xs text-ink-secondary">
                Ensemble fusion weights across operational hydrodynamic and deep learning models:
              </p>
              <div className="space-y-2.5">
                {ENSEMBLE_DETAILS.modelsIncluded.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>{m.name}</span>
                      <span className="font-mono text-primary">{m.weight}% Weight</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${m.weight}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-ink-muted">
                      <span>Individual Spread: {m.spreadCm} cm</span>
                      <span>Physics Consistency: Certified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-muted">
            Model Run ID: #ENS-202609-MUM-89
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
}

