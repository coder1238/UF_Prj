import React, { useState } from 'react';
import { X, History, Calendar, AlertTriangle, CheckCircle, TrendingUp, Info } from 'lucide-react';
import { HISTORICAL_FLOOD_BENCHMARKS } from './mobilityConstants';

export default function HistoricalHotspotReplayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [benchmarks] = useState(HISTORICAL_FLOOD_BENCHMARKS);
  const [selectedBenchmark, setSelectedBenchmark] = useState(HISTORICAL_FLOOD_BENCHMARKS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <History className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Historical Cloudburst Benchmarks &amp; Corridor Replay
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple text-white">
                  2005 &ndash; 2023 Archive
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Empirical monsoon waterlogging records, stranded vehicle logs, and structural mitigation milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Year selector cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {benchmarks.map((b) => {
              const isSelected = selectedBenchmark.year === b.year;
              return (
                <div
                  key={b.year}
                  onClick={() => setSelectedBenchmark(b)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-soft/40 border-purple shadow-elevated'
                      : 'bg-surface border-border hover:border-border-dark'
                  }`}
                >
                  <span className="font-bold text-xs text-ink block">{b.year}</span>
                  <span className="text-[10px] font-mono text-purple block mt-0.5">
                    {b.rainfallMm24h} mm / 24h
                  </span>
                  <span className="text-[10px] text-ink-secondary block mt-1 font-semibold">
                    {b.strandedVehicles} Stranded Cars
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Event Deep Dive */}
          <div className="p-5 rounded-xl bg-surface-secondary border border-border space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple" />
                  Historical Deluge Assessment &bull; {selectedBenchmark.year}
                </h4>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Precipitation: <strong className="text-ink">{selectedBenchmark.rainfallMm24h} mm in 24 hours</strong>
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-status-alert text-white">
                {selectedBenchmark.passability}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Kurla LBS Corridor Depth</span>
                <span className="text-lg font-mono font-bold text-status-alert block mt-0.5">
                  {selectedBenchmark.kurlaLbsDepthCm} cm
                </span>
                <span className="text-[10px] text-ink-secondary">Complete roadbed drowning</span>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Milan Subway Inundation</span>
                <span className="text-lg font-mono font-bold text-status-alert block mt-0.5">
                  {selectedBenchmark.milanSubwayDepthCm} cm
                </span>
                <span className="text-[10px] text-ink-secondary">Subway roof reached</span>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border">
                <span className="text-[10px] text-ink-muted uppercase block">Stranded Vehicles Count</span>
                <span className="text-lg font-mono font-bold text-ink block mt-0.5">
                  {selectedBenchmark.strandedVehicles.toLocaleString()}
                </span>
                <span className="text-[10px] text-ink-secondary">Towed by emergency cranes</span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-muted block mb-1">
                Lessons Learned &amp; Infrastructure Upgrades Adopted
              </span>
              <p className="text-xs text-ink leading-relaxed font-medium">
                &ldquo;{selectedBenchmark.lessons}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple" />
            Empirical data verified from Chitale Committee Report &amp; BMC Monsoon Post-Mortem Audits.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
}

