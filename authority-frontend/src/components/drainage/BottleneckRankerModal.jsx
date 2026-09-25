import React, { useState } from 'react';
import { X, Download, ArrowUpDown, Search } from 'lucide-react';
import { EXTENDED_DRAINAGE_NODES } from './drainageConstants';

export default function BottleneckRankerModal({ isOpen, onClose, onSelectNode, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [sortField, setSortField] = useState('bsi'); // bsi | load | silt

  if (!isOpen) return null;

  // Calculate Bottleneck Severity Index (BSI)
  const rankedNodes = EXTENDED_DRAINAGE_NODES.map((node) => {
    const qCap = parseFloat(node.maxFlow) || 12;
    const qIn = node.upstreamInflow || 15;
    const siltFactor = 1 + (node.siltPercentage || 30) / 100;
    const bsi = ((qIn / qCap) * siltFactor * 100).toFixed(1);
    return {
      ...node,
      bsiScore: parseFloat(bsi),
    };
  })
    .filter((n) => {
      const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWard = selectedWard === 'ALL' || n.ward.includes(selectedWard);
      return matchesSearch && matchesWard;
    })
    .sort((a, b) => {
      if (sortField === 'bsi') return b.bsiScore - a.bsiScore;
      if (sortField === 'load') return b.currentLoad - a.currentLoad;
      if (sortField === 'silt') return b.siltPercentage - a.siltPercentage;
      return 0;
    });

  const handleExportCSV = () => {
    const headers = 'ID,Name,Ward,Type,BSI Score,Current Load (%),Silt (%),Max Capacity,Inflow\n';
    const rows = rankedNodes
      .map(
        (n) =>
          `"${n.id}","${n.name}","${n.ward}","${n.type}",${n.bsiScore},${n.currentLoad},${n.siltPercentage},"${n.maxFlow}",${n.upstreamInflow}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BMC_Drainage_Bottleneck_Rankings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Exported BMC Drainage Bottleneck CSV Report');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Hydraulic Bottleneck Severity Index (BSI) Network Ranker
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                  1,428 MONITORED CONDUITS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Prioritized Choke-Points Ranking based on Inflow Overload, Silt Deposition &amp; Tidal Lockout
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search junction by ID or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-ink placeholder:text-ink-secondary focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-surface-secondary border border-border rounded-lg text-xs font-mono px-2.5 py-1.5 text-ink focus:outline-none focus:border-purple"
            >
              <option value="ALL">All Wards</option>
              <option value="F/N">Ward F/N (Sion)</option>
              <option value="L">Ward L (Kurla)</option>
              <option value="G/N">Ward G/N (Dadar)</option>
              <option value="H/W">Ward H/W (Bandra)</option>
              <option value="K/E">Ward K/E (Andheri)</option>
            </select>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-surface-secondary border border-border rounded-lg text-xs font-mono px-2.5 py-1.5 text-ink focus:outline-none focus:border-purple"
            >
              <option value="bsi">Sort: BSI Score (Highest)</option>
              <option value="load">Sort: Hydraulic Load (%)</option>
              <option value="silt">Sort: Silt Choke (%)</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-xs font-mono text-ink flex items-center gap-1.5 shadow-subtle transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] text-ink-secondary uppercase">
                <th className="p-2">Rank</th>
                <th className="p-2">Node ID &amp; Location</th>
                <th className="p-2">Ward</th>
                <th className="p-2">Conduit Profile</th>
                <th className="p-2 text-right">BSI Score</th>
                <th className="p-2 text-right">Load %</th>
                <th className="p-2 text-right">Silt %</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rankedNodes.map((node, idx) => (
                <tr key={node.id} className="hover:bg-surface-secondary/60 transition-colors">
                  <td className="p-2 font-bold text-ink">#{idx + 1}</td>
                  <td className="p-2">
                    <span className="font-bold text-purple">{node.id}</span>
                    <span className="text-ink block text-[11px] font-sans font-medium">{node.name}</span>
                  </td>
                  <td className="p-2 text-ink-secondary">{node.ward}</td>
                  <td className="p-2 text-ink-secondary text-[11px]">{node.conduitShape}</td>
                  <td className="p-2 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        node.bsiScore > 160
                          ? 'bg-status-alert-soft text-status-alert'
                          : node.bsiScore > 120
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {node.bsiScore}
                    </span>
                  </td>
                  <td className="p-2 text-right font-bold text-ink">{node.currentLoad}%</td>
                  <td className="p-2 text-right text-amber-500">{node.siltPercentage}%</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => {
                        if (onSelectNode) onSelectNode(node);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-purple-soft text-purple hover:bg-purple hover:text-white transition-colors text-[10px] font-bold"
                    >
                      Inspect Node
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Formula: <code>BSI = (Q_inflow / Q_capacity) × (1 + Silt%) × 100</code>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Ranker
          </button>
        </div>
      </div>
    </div>
  );
}

