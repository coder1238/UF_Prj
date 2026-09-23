import React, { useState } from 'react';
import { X, GitCompare } from 'lucide-react';
import { HISTORICAL_STORMS } from './historicalConstants';

export default function StormComparatorModal({ isOpen, onClose }) {
  const [selectedStormIds, setSelectedStormIds] = useState(['29-aug-2025', '26-jul-2005', '08-jul-2024']);

  if (!isOpen) return null;

  const toggleStorm = (id) => {
    if (selectedStormIds.includes(id)) {
      if (selectedStormIds.length > 1) {
        setSelectedStormIds(selectedStormIds.filter(s => s !== id));
      }
    } else {
      if (selectedStormIds.length < 4) {
        setSelectedStormIds([...selectedStormIds, id]);
      }
    }
  };

  const selectedStorms = HISTORICAL_STORMS.filter(s => selectedStormIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Multi-Storm Climatological Benchmark Comparator
              </h2>
              <p className="text-xs text-ink-secondary">
                Side-by-side comparative analysis of milestone monsoon convective storm events (Select 2-4 events)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storm Selector Pills */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink-secondary mr-2">Compare Events:</span>
          {HISTORICAL_STORMS.map((storm) => {
            const isSelected = selectedStormIds.includes(storm.id);
            return (
              <button
                key={storm.id}
                onClick={() => toggleStorm(storm.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  isSelected
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-xs'
                    : 'bg-surface-secondary text-ink-secondary border-border hover:border-purple/30'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {storm.shortName}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Comparative Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${selectedStorms.length} gap-4`}>
            {selectedStorms.map((storm) => (
              <div key={storm.id} className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start border-b border-border pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-ink">{storm.shortName}</h3>
                    <span className="text-[10px] font-mono text-purple">{storm.date}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                    Peak {storm.peakRainRate} mm/h
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">24h Cumulative:</span>
                    <strong className="text-ink">{storm.cumulative24h} mm</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Peak Tide:</span>
                    <strong className="text-status-alert">{storm.peakTideMSL}m MSL</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Max Inundation:</span>
                    <strong className="text-ink">{storm.maxDepthCm} cm</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Flooded Area:</span>
                    <strong className="text-ink">{storm.peakInundationAreaKm2} km²</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Pumps Run Peak:</span>
                    <strong className="text-purple">{storm.pumpingDischargePeakM3s} m³/s</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Helpline 1916 Calls:</span>
                    <strong className="text-ink">{storm.civicHelplineCalls.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-ink-secondary">Est. Economic Loss:</span>
                    <strong className="text-status-alert">₹{storm.economicLossEstCr} Cr</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-surface rounded-lg border border-border text-[11px] text-ink-secondary leading-relaxed">
                  {storm.summary}
                </div>
              </div>
            ))}
          </div>

          {/* Comparative Radar/Bar Visualizer */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              Normalized Severity Index Comparison
            </h4>
            <div className="space-y-3">
              {selectedStorms.map(storm => {
                const normIntensity = Math.min(100, Math.round((storm.peakRainRate / 150) * 100));
                const normTide = Math.min(100, Math.round(((storm.peakTideMSL - 2.0) / 3.0) * 100));
                const normArea = Math.min(100, Math.round((storm.peakInundationAreaKm2 / 85) * 100));
                return (
                  <div key={storm.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-ink">{storm.shortName}</span>
                      <span className="text-ink-secondary">
                        Rain: {storm.peakRainRate} mm/h | Tide: {storm.peakTideMSL}m | Area: {storm.peakInundationAreaKm2} km²
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10px] text-ink-secondary font-mono">Rain Rate ({normIntensity}%)</div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-purple" style={{ width: `${normIntensity}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ink-secondary font-mono">Tidal Surge ({normTide}%)</div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-status-alert" style={{ width: `${normTide}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ink-secondary font-mono">Spatial Spread ({normArea}%)</div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-status-warning" style={{ width: `${normArea}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Source: MCGM Hydrometeorological & Flood Control Cell Archive</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Comparator
          </button>
        </div>
      </div>
    </div>
  );
}

