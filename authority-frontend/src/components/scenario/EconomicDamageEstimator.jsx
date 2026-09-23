import React from 'react';
import {
  IndianRupee,
  TrendingUp,
  Building,
  Truck,
  Wrench,
} from 'lucide-react';

export default function EconomicDamageEstimator({
  scenarioParams,
  mitigationDepthCm = 0,
}) {

  // Baseline economic damage estimates (in ₹ Crores) for normal monsoon ops
  const baseLosses = {
    residential: 18.5,
    commercial: 24.0,
    infrastructure: 12.2,
    transitDelay: 9.8,
    emergencyOps: 4.5,
  };

  // Stress multiplier based on scenarioParams and mitigations
  const intensityFactor = Math.pow(scenarioParams.rainfallIntensity / 50, 1.45);
  const blockageFactor = 1 + (scenarioParams.drainBlockage / 100) * 0.8;
  const tideFactor = 1 + Math.max(0, (scenarioParams.tideLevel - 3.0) * 0.3);
  const reliefFactor = Math.max(0.65, 1 - (mitigationDepthCm / 50) * 0.45);

  const scenarioMultiplier = intensityFactor * blockageFactor * tideFactor * reliefFactor;

  const scenarioLosses = {
    residential: +(baseLosses.residential * scenarioMultiplier).toFixed(1),
    commercial: +(baseLosses.commercial * scenarioMultiplier * 1.15).toFixed(1),
    infrastructure: +(baseLosses.infrastructure * scenarioMultiplier * 0.95).toFixed(1),
    transitDelay: +(baseLosses.transitDelay * scenarioMultiplier * 1.25).toFixed(1),
    emergencyOps: +(baseLosses.emergencyOps * scenarioMultiplier * 0.8).toFixed(1),
  };

  const totalBase = +(Object.values(baseLosses).reduce((a, b) => a + b, 0)).toFixed(1);
  const totalScenario = +(Object.values(scenarioLosses).reduce((a, b) => a + b, 0)).toFixed(1);
  const totalDelta = +(totalScenario - totalBase).toFixed(1);

  const sectorCards = [
    {
      id: 'residential',
      name: 'Residential Property & Basements',
      icon: Building,
      base: baseLosses.residential,
      scenario: scenarioLosses.residential,
      desc: 'Ground floor ingress, plinth erosion, furniture and electrical circuitry replacements across slums and chawls.',
    },
    {
      id: 'commercial',
      name: 'Commercial & Retail Business Loss',
      icon: TrendingUp,
      base: baseLosses.commercial,
      scenario: scenarioLosses.commercial,
      desc: 'Store closures, basement warehouse flooding, and inventory damage in Dadar, Bandra, and Kurla markets.',
    },
    {
      id: 'infrastructure',
      name: 'Municipal & Grid Infrastructure Repair',
      icon: Wrench,
      base: baseLosses.infrastructure,
      scenario: scenarioLosses.infrastructure,
      desc: 'Pumping station motor overhauls, transformer de-watering, box culvert structural repair, and silt clearing.',
    },
    {
      id: 'transitDelay',
      name: 'Workforce Productivity & Transit Delays',
      icon: Truck,
      base: baseLosses.transitDelay,
      scenario: scenarioLosses.transitDelay,
      desc: 'Suburban train stalls, road commute hours lost, airport cargo freight diversions, and supply chain idle time.',
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-alert-soft text-status-alert">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Municipal Economic Loss &amp; Damage Assessor
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                EST. ₹ CRORES
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Direct and indirect multi-sector fiscal exposure calibrated against municipal depth-damage curves
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[10px] text-ink-secondary block">Total Projected Exposure</span>
          <strong className="text-status-alert font-bold text-base">₹{totalScenario} Cr</strong>
          <span className="text-[10px] text-status-alert block font-bold">(Δ +₹{totalDelta} Cr)</span>
        </div>
      </div>

      {/* Comparison Totals Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-surface-secondary/40 border border-border">
          <span className="text-[10px] text-ink-secondary block">Baseline Losses</span>
          <strong className="text-ink">₹{totalBase} Crores</strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/40 border border-border">
          <span className="text-[10px] text-ink-secondary block">Stress Escalation</span>
          <strong className="text-status-alert">+{(scenarioMultiplier * 100 - 100).toFixed(0)}% Surge</strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/40 border border-border">
          <span className="text-[10px] text-ink-secondary block">Counterfactual Savings</span>
          <strong className="text-status-safe">
            {mitigationDepthCm > 0 ? `₹${(totalScenario * 0.18).toFixed(1)} Cr Saved` : '0 Cr (No Mitigation)'}
          </strong>
        </div>
        <div className="p-2 rounded-lg bg-surface-secondary/40 border border-border">
          <span className="text-[10px] text-ink-secondary block">Fiscal Risk Class</span>
          <strong className="text-purple font-bold">
            {totalScenario > 150 ? 'CATASTROPHIC' : totalScenario > 90 ? 'SEVERE' : 'MODERATE'}
          </strong>
        </div>
      </div>

      {/* Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {sectorCards.map((sector) => {
          const Icon = sector.icon;
          const delta = +(sector.scenario - sector.base).toFixed(1);

          return (
            <div
              key={sector.id}
              className="p-3 rounded-xl border border-border bg-surface-secondary/30 hover:bg-surface-secondary/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-surface text-purple border border-border">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h5 className="font-bold text-ink text-[11px]">{sector.name}</h5>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-status-alert">₹{sector.scenario} Cr</span>
                  <span className="text-[9px] text-ink-secondary block">Base: ₹{sector.base} Cr (Δ +₹{delta})</span>
                </div>
              </div>

              <p className="text-[10px] text-ink-secondary mt-1.5 leading-relaxed">
                {sector.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
