import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

export default function HotspotMigrationMapModal({ isOpen, onClose }) {
  const [filterCategory, setFilterCategory] = useState('all'); // all | eliminated | persistent | emerging

  if (!isOpen) return null;

  const HOTSPOT_MIGRATION = [
    { name: 'Hindmata Flyover (Dadar)', ward: 'F/South', status: 'ELIMINATED', baselineYear: '2016 (48 events)', currentYear: '2025 (1 event)', note: 'Remediated by 105,000 m³ Pramod Mahajan holding tank', delta: '-96%' },
    { name: 'Milan Subway (Santacruz)', ward: 'H/East', status: 'MITIGATED', baselineYear: '2016 (36 events)', currentYear: '2025 (2 events)', note: 'Remediated by 30,000 m³ tank + high-head pumps', delta: '-94%' },
    { name: 'Gandhi Market (Matunga)', ward: 'F/North', status: 'MITIGATED', baselineYear: '2016 (34 events)', currentYear: '2025 (2 events)', note: 'Pumping station lift + micro-drainage deepening', delta: '-91%' },
    { name: 'Sion East Circle', ward: 'F/North', status: 'PERSISTENT', baselineYear: '2016 (45 events)', currentYear: '2025 (18 events)', note: 'High tide 4.4m lockout remains critical bottleneck', delta: '-40%' },
    { name: 'Andheri Subway', ward: 'K/East', status: 'PERSISTENT', baselineYear: '2016 (42 events)', currentYear: '2025 (16 events)', note: 'Topographic bowl requires permanent flood boom barrier', delta: '-35%' },
    { name: 'Kurla West (LBS Marg)', ward: 'Ward L', status: 'PERSISTENT', baselineYear: '2016 (32 events)', currentYear: '2025 (14 events)', note: 'Mithi River backflow prevents complete gravity drainage', delta: '-38%' },
    { name: 'Lokhandwala Backroad', ward: 'K/West', status: 'EMERGING', baselineYear: '2016 (2 events)', currentYear: '2025 (12 events)', note: 'New high-density construction runoff overload', delta: '+500%' },
    { name: 'Bhandup Sonapur Junction', ward: 'Ward S', status: 'EMERGING', baselineYear: '2016 (4 events)', currentYear: '2025 (15 events)', note: 'Upstream hill slope rapid concrete runoff ingress', delta: '+275%' },
    { name: 'Chembur Postal Colony', ward: 'Ward M/West', status: 'EMERGING', baselineYear: '2016 (3 events)', currentYear: '2025 (11 events)', note: 'Siltation choke on Mahul creek branch drain', delta: '+266%' },
  ];

  const filtered = filterCategory === 'all'
    ? HOTSPOT_MIGRATION
    : HOTSPOT_MIGRATION.filter(h => h.status.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Geospatial Hotspot Temporal Heatmap &amp; Migration Viewer
              </h2>
              <p className="text-xs text-ink-secondary">
                10-Year Spatial Shift Analysis: Eliminated Sump Zones vs Newly Emerged Urban Concretization Hotspots (2016–2026)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="p-3 bg-surface border-b border-border flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink-secondary">Filter Classification:</span>
          {[
            { id: 'all', label: 'All Hotspots (9)' },
            { id: 'eliminated', label: 'Eliminated / Mitigated' },
            { id: 'persistent', label: 'Persistent Choke Points' },
            { id: 'emerging', label: 'Newly Emergent Sump Zones' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                filterCategory === c.id
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-status-safe font-bold">Successfully Remediated</span>
              <div className="text-xl font-bold font-mono text-status-safe mt-0.5">3 Major Hotspots</div>
              <span className="text-[10px] text-ink-secondary font-mono">Hindmata, Milan &amp; Gandhi Mkt</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-status-alert font-bold">Persistent Tidal Bottlenecks</span>
              <div className="text-xl font-bold font-mono text-status-alert mt-0.5">3 Critical Junctions</div>
              <span className="text-[10px] text-ink-secondary font-mono">Sion Circle, Andheri, Kurla LBS</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-status-warning font-bold">Newly Emergent Sump Zones</span>
              <div className="text-xl font-bold font-mono text-status-warning mt-0.5">3 Developing Nodes</div>
              <span className="text-[10px] text-ink-secondary font-mono">Bhandup, Lokhandwala, Chembur</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-border text-ink-secondary text-[11px]">
                  <th className="p-3">Hotspot Node &amp; Ward</th>
                  <th className="p-3 text-center">Status Category</th>
                  <th className="p-3 text-center">2016 Baseline</th>
                  <th className="p-3 text-center">2025 Current</th>
                  <th className="p-3 text-center">10-Yr Trend</th>
                  <th className="p-3">Forensic Assessment &amp; Engineering Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item, idx) => {
                  let badge = 'text-status-safe bg-status-safe-soft';
                  if (item.status === 'PERSISTENT') badge = 'text-status-alert bg-status-alert-soft font-bold';
                  if (item.status === 'EMERGING') badge = 'text-status-warning bg-status-warning-soft font-bold';

                  return (
                    <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-ink">{item.name}</div>
                        <div className="text-[10px] text-ink-secondary">{item.ward}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${badge}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center text-ink-secondary">{item.baselineYear}</td>
                      <td className="p-3 text-center font-bold text-ink">{item.currentYear}</td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${item.delta.startsWith('-') ? 'text-status-safe' : 'text-status-alert'}`}>
                          {item.delta}
                        </span>
                      </td>
                      <td className="p-3 text-ink-secondary text-[11px] leading-relaxed">
                        {item.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Geospatial Correlation: Satellite InSAR &amp; City Watermarking</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
