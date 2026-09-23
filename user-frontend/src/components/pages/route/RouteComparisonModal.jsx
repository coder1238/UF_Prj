import React from 'react';
import { X, ShieldCheck, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { ROUTE_CORRIDORS } from '../../../data/routePresetsData';

export default function RouteComparisonModal({
  isOpen,
  onClose,
  selectedRouteId,
  onSelectRoute
}) {
  if (!isOpen) return null;

  const corridors = Object.values(ROUTE_CORRIDORS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR BENCHMARK MATRIX</span>
            <h2 className="text-xl font-extrabold text-ink">Multi-Route Hydrodynamic Comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-canvas hover:bg-surface-secondary text-ink-muted hover:text-ink transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-ink-muted text-[10px] uppercase">
                <th className="py-3 px-3">Metric / Corridor</th>
                {corridors.map(c => (
                  <th key={c.id} className="py-3 px-3 min-w-[180px]">
                    <span className="block font-bold text-xs text-ink">{c.name}</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${c.tagColor}`}>
                      {c.tag}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Estimated Travel Time</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 font-extrabold text-ink">{c.estimatedMinutes} min</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Total Distance</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 text-ink">{c.distanceKm} km</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Max Inundation Water</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3">
                    <span className={`font-extrabold ${c.maxWaterDepthCm > 15 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {c.maxWaterDepthCm} cm
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Flyover Deck Ratio</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 text-ink">{c.flyoverPercentage}% Elevated</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Average MSL Elevation</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 text-ink">+{c.elevationAvgM}m MSL</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Engine Stall Hazard</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 font-bold">
                    <span className={c.stallRiskPercentage > 40 ? 'text-rose-700' : 'text-emerald-700'}>
                      {c.stallRiskPercentage}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-ink">Hydro-GNN Score</td>
                {corridors.map(c => (
                  <td key={c.id} className="py-2.5 px-3 font-extrabold text-primary">{c.hydroGnnScore} / 100</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-ink">Select Corridor</td>
                {corridors.map(c => {
                  const isSelected = selectedRouteId === c.id;
                  return (
                    <td key={c.id} className="py-3 px-3">
                      <button
                        onClick={() => {
                          onSelectRoute(c.id);
                          onClose();
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-ink text-white'
                            : 'bg-primary text-white hover:bg-primary-hover shadow-xs'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        <span>{isSelected ? 'Active Route' : 'Switch Route'}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
