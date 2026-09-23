import React, { useState } from 'react';
import {
  Layers,
  Droplets,
  TrendingUp,
  Download,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function IsohyetAccumulationPanel({
  isOpen,
  onClose,
  showIsohyets,
  onToggleIsohyets,
}) {
  const [duration, setDuration] = useState('1h');
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const ACCUMULATION_TIERS = {
    '1h': [
      { tier: '> 25 mm', areaKm2: 184, wards: 'Kurla, Sion, Andheri, Chembur, Dadar', color: 'bg-blue-500' },
      { tier: '> 50 mm', areaKm2: 92, wards: 'Kurla West, Sion Circle, Santacruz E', color: 'bg-yellow-500' },
      { tier: '> 75 mm', areaKm2: 38, wards: 'LBS Marg, Andheri Subway Basin', color: 'bg-orange-500' },
      { tier: '> 100 mm', areaKm2: 14, wards: 'Mithi River Confluence Zone', color: 'bg-red-500' },
    ],
    '2h': [
      { tier: '> 25 mm', areaKm2: 310, wards: 'All Central & Eastern Suburbs', color: 'bg-blue-500' },
      { tier: '> 50 mm', areaKm2: 172, wards: 'Kurla, Sion, Dadar, Andheri, Powai', color: 'bg-yellow-500' },
      { tier: '> 75 mm', areaKm2: 78, wards: 'Kurla, Sion, Chembur', color: 'bg-orange-500' },
      { tier: '> 100 mm', areaKm2: 34, wards: 'LBS Marg, Sion Circle, Milan', color: 'bg-red-500' },
    ],
    '3h': [
      { tier: '> 25 mm', areaKm2: 440, wards: 'Entire Greater Mumbai BMC Jurisdiction', color: 'bg-blue-500' },
      { tier: '> 50 mm', areaKm2: 260, wards: 'Wards A through T Suburbs', color: 'bg-yellow-500' },
      { tier: '> 75 mm', areaKm2: 135, wards: 'Kurla, Sion, Andheri, Dadar, Powai', color: 'bg-orange-500' },
      { tier: '> 100 mm', areaKm2: 68, wards: 'Mithi Channel & Critical Sumps', color: 'bg-red-500' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Cumulative Rainfall Isohyet Contours
              </h3>
              <p className="text-xs text-ink-secondary">
                Spatial precipitation hyetographic integration across Greater Mumbai
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Duration Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink uppercase">Integration Timeframe</span>
            <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs font-mono">
              {[
                { id: '1h', label: '1-Hour Cumulative' },
                { id: '2h', label: '2-Hour Cumulative' },
                { id: '3h', label: '3-Hour Extrapolated Total' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`px-3 py-1 rounded font-semibold transition-all ${
                    duration === d.id
                      ? 'bg-purple text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Isohyet On-Radar Toggle */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-ink">Overlay Isohyet Contours on Polar Radar</div>
              <div className="text-[10px] text-ink-secondary font-mono">Draws 25mm, 50mm, and 100mm isolines directly on the canvas</div>
            </div>
            <button
              onClick={onToggleIsohyets}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                showIsohyets
                  ? 'bg-purple text-white border-purple'
                  : 'bg-surface text-ink border-border hover:border-purple'
              }`}
            >
              {showIsohyets ? 'CONTOURS ACTIVE' : 'ENABLE CONTOURS'}
            </button>
          </div>

          {/* Isohyet Tiers Table */}
          <div className="border border-border rounded-xl overflow-hidden text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary text-ink-secondary text-[10px] uppercase border-b border-border">
                <tr>
                  <th className="p-2.5">Accumulation Contour</th>
                  <th className="p-2.5">Areal Footprint</th>
                  <th className="p-2.5">Most Impacted Wards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ACCUMULATION_TIERS[duration].map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${row.color}`} />
                      <span>{row.tier}</span>
                    </td>
                    <td className="p-2.5 font-bold text-purple">{row.areaKm2} km²</td>
                    <td className="p-2.5 text-ink-secondary text-[11px]">{row.wards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {toast && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <button
            onClick={() => showToast('GeoJSON Isohyet Polygons exported to MCGM GIS Portal!')}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors flex items-center gap-1.5 text-ink"
          >
            <Download className="w-3.5 h-3.5" />
            Export GeoJSON Contours
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

