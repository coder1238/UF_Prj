import React from 'react';
import { X, Truck, Bus, Car, Bike, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function TrafficRestorationTimelineModal({
  isOpen,
  onClose,
  selectedCorridorName,
  depthMitigationCm,
  hoursSaved,
}) {
  if (!isOpen) return null;

  const vehicleTiers = [
    {
      tier: 'Priority 1',
      category: 'Ambulances & Fire Tenders (High-Clearance)',
      maxDepthCm: 32,
      baselineClearance: '20:45 IST',
      mitigatedClearance: '19:15 IST',
      timeSavedMin: Math.round(hoursSaved * 50),
      status: 'RESTORED EARLY',
      icon: Truck,
      color: 'text-purple',
    },
    {
      tier: 'Priority 2',
      category: 'BEST Municipal Transit Buses (Axle Clearance)',
      maxDepthCm: 25,
      baselineClearance: '21:30 IST',
      mitigatedClearance: '19:55 IST',
      timeSavedMin: Math.round(hoursSaved * 60),
      status: 'RESTORED EARLY',
      icon: Bus,
      color: 'text-blue-600',
    },
    {
      tier: 'Priority 3',
      category: 'Heavy Commercial Goods & Logistics Trucks',
      maxDepthCm: 28,
      baselineClearance: '21:15 IST',
      mitigatedClearance: '19:40 IST',
      timeSavedMin: Math.round(hoursSaved * 55),
      status: 'RESTORED EARLY',
      icon: Truck,
      color: 'text-amber-600',
    },
    {
      tier: 'Priority 4',
      category: 'Private Sedans & Light Motor Vehicles',
      maxDepthCm: 15,
      baselineClearance: '22:45 IST',
      mitigatedClearance: '20:50 IST',
      timeSavedMin: Math.round(hoursSaved * 65),
      status: 'ACCELERATING',
      icon: Car,
      color: 'text-emerald-700',
    },
    {
      tier: 'Priority 5',
      category: 'Two-Wheelers & Auto-Rickshaws (Exhaust Sump)',
      maxDepthCm: 10,
      baselineClearance: '23:30 IST',
      mitigatedClearance: '21:40 IST',
      timeSavedMin: Math.round(hoursSaved * 70),
      status: 'STAGE 2 RESTORATION',
      icon: Bike,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Traffic & Transit Modal Restoration Estimator
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Corridor: {selectedCorridorName} • Vehicle category water-depth re-entry thresholds.
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
        <div className="p-5 overflow-y-auto space-y-3.5">
          {vehicleTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-white shadow-subtle hover:border-purple/30 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-surface-secondary ${tier.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-ink-secondary">
                        {tier.tier}
                      </span>
                      <h5 className="text-xs font-bold text-ink">{tier.category}</h5>
                    </div>
                    <div className="text-[11px] text-ink-secondary mt-0.5">
                      Safe Submergence Limit: <strong>&le; {tier.maxDepthCm} cm</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-status-safe font-bold">
                    Mitigated: {tier.mitigatedClearance}
                  </div>
                  <div className="text-[10px] text-ink-secondary line-through">
                    Baseline: {tier.baselineClearance}
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-semibold">
                    +{tier.timeSavedMin}m earlier
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Based on CIRIA C688 & IRC:SP:42 Urban Road Drainage Guidelines.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep"
          >
            Acknowledge Forecast
          </button>
        </div>
      </div>
    </div>
  );
}

