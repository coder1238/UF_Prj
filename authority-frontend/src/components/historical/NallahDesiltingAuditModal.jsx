import React, { useState } from 'react';
import { X, Truck } from 'lucide-react';
import { NALLAH_DESILTING_AUDIT_LOGS } from './historicalConstants';

export default function NallahDesiltingAuditModal({ isOpen, onClose }) {
  const [selectedYear, setSelectedYear] = useState(2025);

  if (!isOpen) return null;

  const current = NALLAH_DESILTING_AUDIT_LOGS.find(l => l.year === selectedYear) || NALLAH_DESILTING_AUDIT_LOGS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Pre-Monsoon Nallah Desilting Audit &amp; Waterlogging Choke-Point History
              </h2>
              <p className="text-xs text-ink-secondary">
                Excavated Silt Tonnage Verification vs Post-Monsoon Drain Surcharge Incidents (2019–2025)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Selector */}
        <div className="p-3 bg-surface border-b border-border flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink-secondary">Select Monsoon Season:</span>
          {NALLAH_DESILTING_AUDIT_LOGS.map(l => (
            <button
              key={l.year}
              onClick={() => setSelectedYear(l.year)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                selectedYear === l.year
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {l.year} Season
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Target Silt Excavation</span>
              <div className="text-xl font-bold font-mono text-ink mt-0.5">{(current.targetTonnes / 100000).toFixed(2)} Lakh MT</div>
              <span className="text-[10px] text-ink-secondary font-mono">{current.majorNallahs} Major / {current.minorNallahs} Minor Drains</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Achieved Desilted Volume</span>
              <div className="text-xl font-bold font-mono text-status-safe mt-0.5">{(current.achievedTonnes / 100000).toFixed(2)} Lakh MT</div>
              <span className="text-[10px] text-status-safe font-mono font-bold">{current.pctAchieved}% Target Compliance</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Post-Monsoon Choke Incidents</span>
              <div className="text-xl font-bold font-mono text-purple mt-0.5">{current.postMonsoonChokeIncidents} Spots</div>
              <span className="text-[10px] text-purple font-mono">-81% Decline vs 2019</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">RFID Weighed Dump Trips</span>
              <div className="text-xl font-bold font-mono text-ink mt-0.5">{current.siltRemovedLakhCuM} Lakh m³</div>
              <span className="text-[10px] text-ink-secondary font-mono">GPS Verified Toll Weighment</span>
            </div>
          </div>

          {/* Historical Desilting Table */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider p-3 bg-surface-secondary border-b border-border">
              Multi-Year Desilting vs Choke Incident Trajectory
            </h4>
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-ink-secondary text-[11px]">
                  <th className="p-3">Year</th>
                  <th className="p-3 text-right">Target (MT)</th>
                  <th className="p-3 text-right">Achieved (MT)</th>
                  <th className="p-3 text-center">Achievement %</th>
                  <th className="p-3 text-right">Major Nallahs</th>
                  <th className="p-3 text-right">Minor Nallahs</th>
                  <th className="p-3 text-center font-bold">Choke Incidents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {NALLAH_DESILTING_AUDIT_LOGS.map(l => (
                  <tr key={l.year} className={`hover:bg-surface-subtle ${selectedYear === l.year ? 'bg-purple-soft/40 font-bold' : ''}`}>
                    <td className="p-3 text-ink font-bold">{l.year}</td>
                    <td className="p-3 text-right text-ink-secondary">{l.targetTonnes.toLocaleString()}</td>
                    <td className="p-3 text-right text-ink">{l.achievedTonnes.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.pctAchieved >= 100 ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'
                      }`}>
                        {l.pctAchieved}%
                      </span>
                    </td>
                    <td className="p-3 text-right text-ink-secondary">{l.majorNallahs}</td>
                    <td className="p-3 text-right text-ink-secondary">{l.minorNallahs}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        l.postMonsoonChokeIncidents < 60 ? 'bg-status-safe-soft text-status-safe' :
                        l.postMonsoonChokeIncidents < 120 ? 'bg-status-warning-soft text-status-warning' :
                        'bg-status-alert-soft text-status-alert'
                      }`}>
                        {l.postMonsoonChokeIncidents}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Quality Control: Third-Party Audit by VJTI &amp; IIT Bombay Environmental Engineering</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
