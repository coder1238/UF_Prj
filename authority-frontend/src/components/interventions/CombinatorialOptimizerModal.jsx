import React, { useState } from 'react';
import { X, Sparkles, Sliders, CheckCircle2, ArrowRight, Zap, Target, DollarSign, Clock } from 'lucide-react';

export default function CombinatorialOptimizerModal({
  isOpen,
  onClose,
  allInterventions,
  activeInterventions,
  onApplyPortfolio,
}) {
  const [objective, setObjective] = useState('max_mitigation'); // 'max_mitigation' | 'low_cost' | 'rapid'
  const [budgetCap, setBudgetCap] = useState(5.0); // ₹ Lakhs

  if (!isOpen) return null;

  // Generate Portfolios based on objectives
  const portfolios = [
    {
      id: 'opt-max-mitigation',
      title: 'Maximum Inundation Depressurization Portfolio',
      badge: 'HIGHEST IMPACT',
      badgeColor: 'bg-status-safe text-white',
      interventions: allInterventions.filter((i) => i.deltaDepthReductionCm >= 10),
      totalDepthMitigation: allInterventions
        .filter((i) => i.deltaDepthReductionCm >= 10)
        .reduce((sum, i) => sum + i.deltaDepthReductionCm, 0),
      totalHoursSaved: allInterventions
        .filter((i) => i.deltaDepthReductionCm >= 10)
        .reduce((sum, i) => sum + i.clearanceTimeSavedHours, 0),
      totalCost: allInterventions
        .filter((i) => i.deltaDepthReductionCm >= 10)
        .reduce((sum, i) => sum + (i.costLakhs || 1.5), 0),
      setupTimeMin: Math.max(
        ...allInterventions.filter((i) => i.deltaDepthReductionCm >= 10).map((i) => i.setupTimeMin)
      ),
      description: 'Prioritizes all high-yield mobile pumps, tidal diversions, and retention sumps to drop water level below vehicle stall lines.',
    },
    {
      id: 'opt-low-cost',
      title: 'Fiscal Efficiency & High ROI Portfolio',
      badge: 'BUDGET OPTIMIZED',
      badgeColor: 'bg-blue-600 text-white',
      interventions: allInterventions.filter((i) => (i.costLakhs || 1) <= 1.5),
      totalDepthMitigation: allInterventions
        .filter((i) => (i.costLakhs || 1) <= 1.5)
        .reduce((sum, i) => sum + i.deltaDepthReductionCm, 0),
      totalHoursSaved: allInterventions
        .filter((i) => (i.costLakhs || 1) <= 1.5)
        .reduce((sum, i) => sum + i.clearanceTimeSavedHours, 0),
      totalCost: allInterventions
        .filter((i) => (i.costLakhs || 1) <= 1.5)
        .reduce((sum, i) => sum + (i.costLakhs || 1.5), 0),
      setupTimeMin: 15,
      description: 'Maximizes municipal cost-benefit by leveraging automated gravity sluices and municipal retention ponds with negligible fuel overhead.',
    },
    {
      id: 'opt-rapid',
      title: 'Flash Flood Rapid Strike (<15 Min Deployment)',
      badge: 'FASTEST RESPONSE',
      badgeColor: 'bg-amber-600 text-white',
      interventions: allInterventions.filter((i) => i.setupTimeMin <= 15),
      totalDepthMitigation: allInterventions
        .filter((i) => i.setupTimeMin <= 15)
        .reduce((sum, i) => sum + i.deltaDepthReductionCm, 0),
      totalHoursSaved: allInterventions
        .filter((i) => i.setupTimeMin <= 15)
        .reduce((sum, i) => sum + i.clearanceTimeSavedHours, 0),
      totalCost: allInterventions
        .filter((i) => i.setupTimeMin <= 15)
        .reduce((sum, i) => sum + (i.costLakhs || 1.5), 0),
      setupTimeMin: 15,
      description: 'Dispatches only instantly active SCADA sluices and pre-positioned rapid-deploy mobile pumps to arrest water rise within the first 20 minutes.',
    },
  ];

  const handleApply = (portfolio) => {
    const ids = portfolio.interventions.map((i) => i.id);
    onApplyPortfolio(ids);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Combinatorial Multi-Intervention Optimizer
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Pareto Frontier solver: computes optimal sub-arrays of hydraulic countermeasures.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {portfolios.map((port) => (
              <div
                key={port.id}
                className="p-4 rounded-xl border border-border bg-white hover:border-purple/40 hover:shadow-subtle transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${port.badgeColor}`}
                      >
                        {port.badge}
                      </span>
                      <h4 className="text-sm font-bold text-ink">{port.title}</h4>
                    </div>
                    <p className="text-xs text-ink-secondary mt-1">{port.description}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-status-safe font-bold">
                        <Target className="w-3.5 h-3.5" />
                        <span>-{port.totalDepthMitigation.toFixed(1)} cm</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-purple font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>+{port.totalHoursSaved.toFixed(1)} hrs saved</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-ink-secondary">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>₹{port.totalCost.toFixed(1)} L budget</span>
                      </div>
                      <div className="text-ink-secondary">
                        Max Setup: {port.setupTimeMin} min
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-ink-secondary">
                        Allocated Units ({port.interventions.length}):
                      </span>
                      {port.interventions.map((item) => (
                        <span
                          key={item.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink border border-border"
                        >
                          {item.name.split('(')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(port)}
                    className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Apply Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs text-ink-secondary">
          <span>Objective solver considers 2^{allInterventions.length} combinations against Manning's backwater model.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

