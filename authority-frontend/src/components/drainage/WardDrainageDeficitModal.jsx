import React, { useState } from 'react';
import { X, MapPin, Building2, IndianRupee } from 'lucide-react';
import { WARD_DRAINAGE_DEFICITS } from './drainageConstants';

export default function WardDrainageDeficitModal({ isOpen, onClose, showToast }) {
  const [wards] = useState(WARD_DRAINAGE_DEFICITS);
  const [selectedWard, setSelectedWard] = useState(WARD_DRAINAGE_DEFICITS[0].ward);
  const [capexBudgetCrores, setCapexBudgetCrores] = useState(500); // 500 Cr budget

  if (!isOpen) return null;

  const activeWard = wards.find((w) => w.ward === selectedWard) || wards[0];

  const handleApproveBudget = () => {
    showToast(`BRIMSTOWAD II CapEx Budget of ₹${capexBudgetCrores} Crores approved for prioritized wards!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Ward Drainage Capacity Deficit &amp; BRIMSTOWAD II Priority Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                  INFRASTRUCTURE AUDIT
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Hydraulic Carrying Deficit vs Peak Cloudburst Runoff &amp; CapEx Upgrades
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Ward Table */}
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-[10px] text-ink-secondary uppercase border-b border-border">
                <tr>
                  <th className="p-3">Ward Name</th>
                  <th className="p-3 text-right">Drain Cap (m³/s)</th>
                  <th className="p-3 text-right">Peak Runoff (m³/s)</th>
                  <th className="p-3 text-right">Deficit (%)</th>
                  <th className="p-3 text-right">Impervious %</th>
                  <th className="p-3 text-right">Priority Tier</th>
                  <th className="p-3 text-right">CapEx (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {wards.map((w) => {
                  const isSevere = w.deficitPct < -30;
                  return (
                    <tr
                      key={w.ward}
                      onClick={() => setSelectedWard(w.ward)}
                      className={`cursor-pointer transition-colors ${
                        selectedWard === w.ward ? 'bg-purple-soft/50 font-bold' : 'hover:bg-surface-secondary/50'
                      }`}
                    >
                      <td className="p-3 font-semibold text-ink flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple" />
                        {w.ward}
                      </td>
                      <td className="p-3 text-right text-ink-secondary">{w.capacityM3s}</td>
                      <td className="p-3 text-right text-ink">{w.peakRunoffM3s}</td>
                      <td className={`p-3 text-right font-bold ${isSevere ? 'text-status-alert' : w.deficitPct < 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {w.deficitPct > 0 ? `+${w.deficitPct}%` : `${w.deficitPct}%`}
                      </td>
                      <td className="p-3 text-right text-ink-secondary">{w.imperviousPct}%</td>
                      <td className="p-3 text-right">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            w.brimstowadPriority.includes('TIER-1')
                              ? 'bg-status-alert-soft text-status-alert'
                              : w.brimstowadPriority.includes('TIER-2')
                              ? 'bg-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {w.brimstowadPriority}
                        </span>
                      </td>
                      <td className="p-3 text-right text-purple font-bold">₹{w.capexCrores} Cr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Active Ward Deep-Dive & Budget Allocation */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
              <div>
                <h4 className="font-bold text-sm text-ink">{activeWard.ward}</h4>
                <p className="text-xs text-ink-secondary">
                  Historical Cloudburst Inundation Incidents: <strong>{activeWard.historicalFloodsPerYr} events/year</strong>
                </p>
              </div>
              <span className="text-xs font-bold text-purple">
                Proposed BRIMSTOWAD Upgrade: ₹{activeWard.capexCrores} Crores
              </span>
            </div>

            {/* CapEx Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-ink-secondary">Municipal Drainage CapEx Allocation Pool:</span>
                <span className="text-purple font-bold">₹{capexBudgetCrores} Crores</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="25"
                value={capexBudgetCrores}
                onChange={(e) => setCapexBudgetCrores(parseInt(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
            </div>

            <button
              onClick={handleApproveBudget}
              className="w-full py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-1.5"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Approve CapEx Work Plan for {activeWard.ward}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Deficit Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

