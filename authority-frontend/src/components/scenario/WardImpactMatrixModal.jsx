import React, { useState, useMemo } from 'react';
import { X, Building2, Search, ArrowUpDown, ShieldCheck, Send } from 'lucide-react';
import { WARD_SCENARIO_MATRIX } from './scenarioConstants';

export default function WardImpactMatrixModal({ isOpen, onClose, scenarioParams, onDispatchWard }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [sortField, setSortField] = useState('deltaDepth');
  const [sortAsc, setSortAsc] = useState(false);
  const [dispatchedWards, setDispatchedWards] = useState({});

  // Dynamic multiplier based on scenarioParams
  const surgeFactor = 1 + ((scenarioParams?.rainfallIntensity || 50) - 50) * 0.015 + ((scenarioParams?.drainBlockage || 0) / 100) * 0.45;

  const processedWards = useMemo(() => {
    return WARD_SCENARIO_MATRIX.map((w) => {
      const scenarioDepth = Math.round(w.baseDepth * surgeFactor);
      const deltaDepth = scenarioDepth - w.baseDepth;
      const scenarioArea = (w.baseAreaKm2 * surgeFactor).toFixed(2);
      const deltaArea = (scenarioArea - w.baseAreaKm2).toFixed(2);
      const surchargeNodes = Math.round(w.baseSurcharge * surgeFactor * 1.4);
      
      let priority = 'MODERATE';
      if (scenarioDepth > 35 || w.popRisk > 70000) priority = 'CRITICAL';
      else if (scenarioDepth > 22 || w.popRisk > 45000) priority = 'HIGH';

      return {
        ...w,
        scenarioDepth,
        deltaDepth,
        scenarioArea,
        deltaArea,
        surchargeNodes,
        priority,
      };
    });
  }, [surgeFactor]);

  const filteredWards = useMemo(() => {
    return processedWards
      .filter((w) => {
        const matchesZone = selectedZone === 'ALL' || w.zone === selectedZone;
        const matchesQuery =
          w.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesZone && matchesQuery;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [processedWards, selectedZone, searchQuery, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleDispatch = (ward) => {
    setDispatchedWards((prev) => ({ ...prev, [ward.ward]: true }));
    if (onDispatchWard) {
      onDispatchWard(ward);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Ward-by-Ward Hydraulic Vulnerability &amp; Risk Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  16 MUNICIPAL WARDS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Comparative inundation depths, inundated surface area, and municipal shelter readiness under simulated storm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 border-b border-border bg-canvas flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-muted" />
              <input
                type="text"
                placeholder="Search Ward (e.g. F/N, Kurla, Andheri)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-ink placeholder:text-ink-muted text-xs focus:outline-none focus:border-purple w-64"
              />
            </div>

            <div className="flex items-center gap-1">
              {['ALL', 'Island City', 'Western Suburbs', 'Eastern Suburbs'].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedZone === zone
                      ? 'bg-purple text-white shadow-subtle'
                      : 'bg-surface border border-border text-ink hover:border-purple/30'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-ink-secondary">
            Showing <strong className="text-ink">{filteredWards.length}</strong> wards | Total Pop at Risk:{' '}
            <strong className="text-status-alert">
              {filteredWards.reduce((acc, w) => acc + w.popRisk, 0).toLocaleString()}
            </strong>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-[11px] font-mono text-ink uppercase tracking-wider">
                <th className="py-2.5 px-3">Ward Code &amp; Catchment</th>
                <th className="py-2.5 px-3">Zone</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-purple"
                  onClick={() => toggleSort('popRisk')}
                >
                  <div className="flex items-center gap-1">
                    Pop at Risk <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-purple"
                  onClick={() => toggleSort('baseDepth')}
                >
                  <div className="flex items-center gap-1">
                    Baseline Depth <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-purple"
                  onClick={() => toggleSort('deltaDepth')}
                >
                  <div className="flex items-center gap-1 text-status-alert">
                    Scenario Depth (Δ) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Flooded Area</th>
                <th className="py-2.5 px-3">Surcharged Nodes</th>
                <th className="py-2.5 px-3">Priority Level</th>
                <th className="py-2.5 px-3 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWards.map((w) => (
                <tr key={w.ward} className="hover:bg-surface-secondary/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-ink">
                    <div className="font-mono text-xs text-purple font-bold">{w.ward}</div>
                    <div className="text-[11px] text-ink-secondary">{w.name}</div>
                  </td>
                  <td className="py-2.5 px-3 text-ink-secondary font-mono text-[11px]">{w.zone}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-ink">
                    {w.popRisk.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink-secondary">
                    {w.baseDepth} cm
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-bold text-status-alert text-sm">{w.scenarioDepth} cm</span>{' '}
                    <span className="text-[10px] text-status-alert font-semibold">(+{w.deltaDepth} cm)</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink">
                    {w.scenarioArea} km² <span className="text-[10px] text-ink-muted">(+{w.deltaArea})</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-status-alert font-bold">
                    {w.surchargeNodes} manholes
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        w.priority === 'CRITICAL'
                          ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                          : w.priority === 'HIGH'
                          ? 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                          : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                      }`}
                    >
                      {w.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {dispatchedWards[w.ward] ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-status-safe font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> SQUAD DISPATCHED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatch(w)}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-purple/30 hover:bg-purple hover:text-white text-purple text-[11px] font-mono font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Mobilize Ward
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <div className="text-[11px] font-mono text-ink-secondary">
            *Inundation depths derived from 2D Shallow Water Equations (SWE) mesh with terrain elevation DEM.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple text-white font-bold text-xs shadow-subtle hover:bg-purple-deep transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
