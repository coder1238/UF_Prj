import React, { useState } from 'react';
import { X, Table, Download, Search, Filter, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CORRIDOR_HYDRODYNAMICS } from './interventionConstants';

export default function CorridorComparisonMatrixModal({
  isOpen,
  onClose,
  activeInterventionsCount,
  depthMitigationCm,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('ALL');

  if (!isOpen) return null;

  const corridors = Object.values(CORRIDOR_HYDRODYNAMICS);

  const filtered = corridors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = wardFilter === 'ALL' || c.ward === wardFilter;
    return matchesSearch && matchesWard;
  });

  const exportCsv = () => {
    const headers = 'ID,Name,Ward,Elevation(m),UnmitigatedPeak(cm),MitigatedPeak(cm),Delta(cm),Status\n';
    const rows = filtered
      .map((c) => {
        const mitPeak = Math.max(4, Math.round((c.unmitigatedPeak - depthMitigationCm * 0.4) * 10) / 10);
        const delta = Math.round((c.unmitigatedPeak - mitPeak) * 10) / 10;
        const status = mitPeak <= 25 ? 'PASSABLE' : 'IMPEDED';
        return `"${c.id}","${c.name}","${c.ward}",${c.elevation},${c.unmitigatedPeak},${mitPeak},${delta},"${status}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MCGM_Corridor_Matrix_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Multi-Corridor Hydrodynamic Comparative Matrix
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Simultaneous counterfactual evaluation across {corridors.length} vulnerable arterial choke corridors.
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

        {/* Toolbar */}
        <div className="p-3 bg-surface border-b border-border flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search corridor or ward..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple w-56"
              />
            </div>

            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink font-medium focus:outline-none focus:border-purple"
            >
              <option value="ALL">All Wards</option>
              <option value="Ward F/N">Ward F/N (Sion / Matunga)</option>
              <option value="Ward L">Ward L (Kurla)</option>
              <option value="Ward K/E">Ward K/E (Andheri East)</option>
              <option value="Ward H/W">Ward H/W (Bandra / Santacruz)</option>
              <option value="Ward G/N">Ward G/N (Dadar)</option>
            </select>
          </div>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-purple-soft hover:text-purple transition-all flex items-center gap-1.5 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Table</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1 p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-mono text-ink-secondary uppercase">
                <th className="py-2.5 px-3">Corridor & Hotspot</th>
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3">Elev.</th>
                <th className="py-2.5 px-3">Unmitigated</th>
                <th className="py-2.5 px-3">With {activeInterventionsCount} Active</th>
                <th className="py-2.5 px-3">Head Delta</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filtered.map((c) => {
                const mitPeak = Math.max(
                  4,
                  Math.round((c.unmitigatedPeak - depthMitigationCm * 0.4) * 10) / 10
                );
                const delta = Math.round((c.unmitigatedPeak - mitPeak) * 10) / 10;
                const isPassable = mitPeak <= 25;

                return (
                  <tr key={c.id} className="hover:bg-surface-secondary/50 transition-all">
                    <td className="py-2.5 px-3 font-semibold text-ink">
                      <div>{c.name.split('(')[0]}</div>
                      <div className="text-[10px] text-ink-secondary font-normal">{c.cause}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-purple font-medium">{c.ward}</td>
                    <td className="py-2.5 px-3 font-mono text-ink-secondary">{c.elevation}m</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-status-alert">
                      {c.unmitigatedPeak} cm
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-status-safe">
                      {mitPeak} cm
                    </td>
                    <td className="py-2.5 px-3 font-mono text-status-safe font-semibold">
                      -{delta} cm
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isPassable
                            ? 'bg-status-safe-soft text-status-safe'
                            : 'bg-status-alert-soft text-status-alert'
                        }`}
                      >
                        {isPassable ? 'PASSABLE' : 'IMPEDED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs text-ink-secondary">
          <span>Showing {filtered.length} of {corridors.length} arterial corridors under active simulation.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

