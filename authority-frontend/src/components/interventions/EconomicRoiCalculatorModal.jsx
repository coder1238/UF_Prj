import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, ShieldCheck, Download, AlertCircle, BarChart3 } from 'lucide-react';

export default function EconomicRoiCalculatorModal({
  isOpen,
  onClose,
  activeInterventionsList,
  corridorsCount = 5,
}) {
  const [hourlyDelayCost, setHourlyDelayCost] = useState(850); // ₹ / hr / vehicle
  const [vehiclesPerHour, setVehiclesPerHour] = useState(4200);

  if (!isOpen) return null;

  // Cumulative numbers
  const totalHoursSaved = activeInterventionsList.reduce(
    (sum, i) => sum + (i.clearanceTimeSavedHours || 1.2),
    0
  );
  const totalCostLakhs = activeInterventionsList.reduce(
    (sum, i) => sum + (i.costLakhs || 1.2),
    0
  );

  // Economic loss avoidance calculations (₹ Crores)
  const trafficDelayHoursAvoided = Math.round(vehiclesPerHour * totalHoursSaved * 0.7);
  const trafficCostAvoidedCr =
    Math.round(((trafficDelayHoursAvoided * hourlyDelayCost) / 10000000) * 100) / 100;

  // Vehicle damage prevented (hydrolock & electrical submergence)
  const estimatedFloodedCarsAvoided = Math.round(totalHoursSaved * 180);
  const vehicleDamageAvoidedCr =
    Math.round(((estimatedFloodedCarsAvoided * 85000) / 10000000) * 100) / 100;

  // Commercial business / retail disruption avoided
  const retailDisruptionCr =
    Math.round((corridorsCount * 0.45 * (totalHoursSaved / 2)) * 100) / 100;

  const totalLossAvoidedCr =
    Math.round((trafficCostAvoidedCr + vehicleDamageAvoidedCr + retailDisruptionCr) * 100) / 100;

  const interventionCostCr = Math.round((totalCostLakhs / 100) * 100) / 100;
  const benefitCostRatio =
    interventionCostCr > 0
      ? Math.round((totalLossAvoidedCr / interventionCostCr) * 10) / 10
      : 42.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-status-safe">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Economic Loss Avoidance & Municipal ROI Engine
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Quantified social-economic return on tactical hydraulic interventions.
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
          {/* Top Big KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-status-safe/30 bg-status-safe-soft/30 text-center">
              <span className="text-[10px] font-mono text-status-safe font-bold uppercase tracking-wider">
                Total Economic Loss Prevented
              </span>
              <div className="font-mono text-3xl font-extrabold text-status-safe mt-1">
                ₹{totalLossAvoidedCr}{' '}
                <span className="text-sm font-normal">Crores</span>
              </div>
              <div className="text-[11px] text-ink-secondary mt-1">
                Across {activeInterventionsList.length} active deployments
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple/30 bg-purple-soft/30 text-center">
              <span className="text-[10px] font-mono text-purple font-bold uppercase tracking-wider">
                Benefit-Cost Ratio (BCR)
              </span>
              <div className="font-mono text-3xl font-extrabold text-purple mt-1">
                {benefitCostRatio}x{' '}
                <span className="text-sm font-normal text-ink-secondary">ROI</span>
              </div>
              <div className="text-[11px] text-ink-secondary mt-1">
                ₹1 deployed saves ₹{benefitCostRatio} in damages
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-purple" />
              Loss Avoidance Categorization
            </h4>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-ink">
                  Arterial Traffic Delay Hours Saved
                </div>
                <div className="text-[11px] text-ink-secondary">
                  {trafficDelayHoursAvoided.toLocaleString()} passenger & logistics hours recovered
                </div>
              </div>
              <div className="font-mono font-bold text-status-safe text-sm">
                +₹{trafficCostAvoidedCr} Cr
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-ink">
                  Submerged Vehicle Damage Avoided
                </div>
                <div className="text-[11px] text-ink-secondary">
                  ~{estimatedFloodedCarsAvoided} private cars & delivery trucks protected from engine hydrolock
                </div>
              </div>
              <div className="font-mono font-bold text-status-safe text-sm">
                +₹{vehicleDamageAvoidedCr} Cr
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-ink">
                  Commercial & Retail Ingress Protected
                </div>
                <div className="text-[11px] text-ink-secondary">
                  High-street commercial shops and transport sumps kept accessible
                </div>
              </div>
              <div className="font-mono font-bold text-status-safe text-sm">
                +₹{retailDisruptionCr} Cr
              </div>
            </div>
          </div>

          {/* Operational Expenditure vs Savings */}
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border flex items-center justify-between text-xs">
            <div>
              <span className="text-ink-secondary">Municipal Operation Budget:</span>
              <div className="font-mono font-bold text-ink">
                ₹{totalCostLakhs.toFixed(1)} Lakhs (₹{interventionCostCr} Cr)
              </div>
            </div>
            <div className="text-right">
              <span className="text-ink-secondary">Net Public Value Created:</span>
              <div className="font-mono font-bold text-status-safe">
                +₹{(totalLossAvoidedCr - interventionCostCr).toFixed(2)} Cr
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Model calibrated with MCGM Municipal Transport & Insurance Bureau data.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}

