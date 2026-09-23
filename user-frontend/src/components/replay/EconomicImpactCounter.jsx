import React from 'react';
import { IndianRupee, Clock, Car, TrendingDown, ShieldCheck } from 'lucide-react';

export default function EconomicImpactCounter({ currentStep, whatIfModifiers, playbackIndex }) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const isMitigated = depthFactor < 1;

  // Cumulative calculations based on step progression
  const stepWeight = (playbackIndex + 1);
  const baseLossCr = (currentStep.economicRate * stepWeight * 0.4).toFixed(1);
  const commuterHours = Math.round(currentStep.roadsClosed * 14500 * (playbackIndex + 1) * 0.3);
  const stalledVehicles = Math.round((currentStep.depth > 35 ? (currentStep.depth - 35) * 45 : 12) * (currentStep.roadsClosed || 1));
  const avoidedCr = isMitigated ? (baseLossCr * (1 - depthFactor) * 1.3).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <IndianRupee className="w-4 h-4" /> Civic Socio-Economic Telematics
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Transit Disruption & Macro-Economic Loss Model
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
          <span className="text-[10px] font-mono text-muted uppercase block">Cumulative Business Loss</span>
          <div className="text-2xl font-extrabold font-mono text-ink mt-0.5">
            ₹{baseLossCr} <span className="text-xs font-normal text-muted">Cr</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Direct commercial downtime</span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
          <span className="text-[10px] font-mono text-muted uppercase block">Commuter Hours Lost</span>
          <div className="text-2xl font-extrabold font-mono text-ink mt-0.5">
            {commuterHours.toLocaleString()} <span className="text-xs font-normal text-muted">hrs</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Railway & arterial gridlock</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
          <span className="text-[10px] font-mono text-muted uppercase block">Hydrolocked Vehicles</span>
          <div className="text-2xl font-extrabold font-mono text-red-600 mt-0.5">
            {stalledVehicles} <span className="text-xs font-normal text-muted">units</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Engine insurance claims</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <span className="text-[10px] font-mono text-emerald-800 uppercase block">Prevented Damage</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">
            {avoidedCr > 0 ? `₹${avoidedCr} Cr` : '₹0.0 Cr'}
          </div>
          <span className="text-[10px] text-emerald-600 font-mono block mt-1">
            {isMitigated ? 'Via modern defenses' : 'Toggle What-If to test'}
          </span>
        </div>
      </div>
    </div>
  );
}

