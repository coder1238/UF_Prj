import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

export default function EconomicLossLedgerModal({ isOpen, onClose }) {
  const [selectedYear, setSelectedYear] = useState('All');

  if (!isOpen) return null;

  const ECONOMIC_DATA = [
    { year: 2025, storm: '29 Aug Cloudburst', directAssetCr: 125, commuterDelayCr: 180, commercialLossCr: 82, civicResponseCr: 25, totalLossCr: 412, avertedLossCr: 340 },
    { year: 2024, storm: '08 Jul Midnight Deluge', directAssetCr: 72, commuterDelayCr: 98, commercialLossCr: 52, civicResponseCr: 18, totalLossCr: 240, avertedLossCr: 280 },
    { year: 2023, storm: '16 Jul Squall Line', directAssetCr: 28, commuterDelayCr: 38, commercialLossCr: 20, civicResponseCr: 9, totalLossCr: 95, avertedLossCr: 190 },
    { year: 2022, storm: '06 Jul Flash Floods', directAssetCr: 54, commuterDelayCr: 76, commercialLossCr: 44, civicResponseCr: 16, totalLossCr: 190, avertedLossCr: 170 },
    { year: 2021, storm: '04 Sep Cyclone Tauktae', directAssetCr: 68, commuterDelayCr: 52, commercialLossCr: 48, civicResponseCr: 17, totalLossCr: 185, avertedLossCr: 150 },
    { year: 2020, storm: '05 Aug Island City Surge', directAssetCr: 88, commuterDelayCr: 110, commercialLossCr: 74, civicResponseCr: 22, totalLossCr: 294, avertedLossCr: 130 },
    { year: 2019, storm: '02 Jul Malad Wall Collapse Event', directAssetCr: 145, commuterDelayCr: 195, commercialLossCr: 112, civicResponseCr: 38, totalLossCr: 490, avertedLossCr: 90 },
    { year: 2017, storm: '29 Aug Paralyzing Storm', directAssetCr: 185, commuterDelayCr: 260, commercialLossCr: 140, civicResponseCr: 45, totalLossCr: 630, avertedLossCr: 60 },
  ];

  const filtered = selectedYear === 'All' ? ECONOMIC_DATA : ECONOMIC_DATA.filter(d => d.year === Number(selectedYear));

  const totalDirect = filtered.reduce((acc, c) => acc + c.directAssetCr, 0);
  const totalCommuter = filtered.reduce((acc, c) => acc + c.commuterDelayCr, 0);
  const totalLoss = filtered.reduce((acc, c) => acc + c.totalLossCr, 0);
  const totalAverted = filtered.reduce((acc, c) => acc + c.avertedLossCr, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Historical Flood Damage &amp; Economic Loss Exposure Ledger
              </h2>
              <p className="text-xs text-ink-secondary">
                Direct Infrastructure Destruction, Commuter Productivity Hours &amp; BRIMSTOWAD Mitigation ROI (2017–2025)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ink-secondary">Filter Storm Year:</span>
            {['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2017'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                  selectedYear === yr
                    ? 'bg-purple text-white border-purple font-bold'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Cumulative Economic Loss</span>
              <div className="text-2xl font-bold font-mono text-status-alert mt-0.5">₹{totalLoss.toLocaleString()} Cr</div>
              <span className="text-[10px] text-ink-secondary font-mono">Gross Municipal Impact</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Commuter Productivity Loss</span>
              <div className="text-2xl font-bold font-mono text-status-warning mt-0.5">₹{totalCommuter.toLocaleString()} Cr</div>
              <span className="text-[10px] text-ink-secondary font-mono">Traffic &amp; Suburban Rail Halts</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Physical Pavement &amp; Asset Damage</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">₹{totalDirect.toLocaleString()} Cr</div>
              <span className="text-[10px] text-ink-secondary font-mono">Road Resurfacing &amp; Culvert Repairs</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Losses Averted by Interventions</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">₹{totalAverted.toLocaleString()} Cr</div>
              <span className="text-[10px] text-status-safe font-mono">Tanks &amp; Pumping Net ROI</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-border text-ink-secondary text-[11px]">
                  <th className="p-3">Year &amp; Storm Event</th>
                  <th className="p-3 text-right">Physical Asset (₹Cr)</th>
                  <th className="p-3 text-right">Commuter Delay (₹Cr)</th>
                  <th className="p-3 text-right">Commercial Loss (₹Cr)</th>
                  <th className="p-3 text-right">Emergency Svc (₹Cr)</th>
                  <th className="p-3 text-right font-bold">Total Damage (₹Cr)</th>
                  <th className="p-3 text-right text-status-safe font-bold">Averted Loss (₹Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(row => (
                  <tr key={row.year} className="hover:bg-surface-subtle transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-ink">{row.storm}</div>
                      <div className="text-[10px] text-ink-secondary">{row.year} Monsoon Season</div>
                    </td>
                    <td className="p-3 text-right text-ink">₹{row.directAssetCr}</td>
                    <td className="p-3 text-right text-ink">₹{row.commuterDelayCr}</td>
                    <td className="p-3 text-right text-ink">₹{row.commercialLossCr}</td>
                    <td className="p-3 text-right text-ink">₹{row.civicResponseCr}</td>
                    <td className="p-3 text-right font-bold text-status-alert">₹{row.totalLossCr}</td>
                    <td className="p-3 text-right font-bold text-status-safe">₹{row.avertedLossCr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Economic Methodology: World Bank Urban Resilience &amp; Loss Modeling</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
