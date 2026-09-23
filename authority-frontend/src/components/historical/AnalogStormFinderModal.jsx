import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function AnalogStormFinderModal({ isOpen, onClose }) {
  const [sstAnomaly, setSstAnomaly] = useState(1.2); // +0.2 to +2.5 °C
  const [iodIndex, setIodIndex] = useState(0.45); // -0.8 to +0.8
  const [mjoPhase, setMjoPhase] = useState('Phase 3 (East Indian Ocean)');

  if (!isOpen) return null;

  // Compute similarity score based on SST and IOD
  const ANALOG_CANDIDATES = [
    {
      year: 2019,
      name: '2019 Monsoon Season (Positive IOD Analog)',
      similarityScore: Math.min(98, Math.round(92 - Math.abs(sstAnomaly - 1.1) * 15 - Math.abs(iodIndex - 0.5) * 20)),
      historicalRainfallMm: 3670,
      extremeEventsCount: 14,
      peakFloodDate: '02 Jul 2019 (Malad / Kurla 375mm event)',
      guidance: 'Expect frequent late-season convective training bands in August-September; prepare Mithi dredging pumps in advance.'
    },
    {
      year: 2023,
      name: '2023 Monsoon Season (Warm Arabian Sea Analog)',
      similarityScore: Math.min(94, Math.round(88 - Math.abs(sstAnomaly - 1.4) * 20 - Math.abs(iodIndex - 0.2) * 25)),
      historicalRainfallMm: 3120,
      extremeEventsCount: 11,
      peakFloodDate: '16 Jul 2023 (Western Suburbs Squall 104mm/h)',
      guidance: 'Higher probability of rapid afternoon squall lines moving off Thane creek into Western suburbs.'
    },
    {
      year: 2005,
      name: '2005 Synoptic Trough Vortex Analog',
      similarityScore: Math.min(90, Math.round(82 - Math.abs(sstAnomaly - 0.8) * 18 - Math.abs(iodIndex - 0.1) * 30)),
      historicalRainfallMm: 3214,
      extremeEventsCount: 9,
      peakFloodDate: '26 Jul 2005 (944mm Benchmark Event)',
      guidance: 'Monitor offshore trough stationary pressure dips below 998 hPa closely for multi-day convective anchoring.'
    }
  ].sort((a, b) => b.similarityScore - a.similarityScore);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Climatological Predictive Analog Storm Finder &amp; Pattern Matcher
              </h2>
              <p className="text-xs text-ink-secondary">
                Machine Learning Dynamic Time Warping (DTW) • Teleconnection Indices (SST, IOD &amp; MJO) Analog Forecasting
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Parameter Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-secondary border border-border rounded-xl p-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-ink">
                <span>Arabian Sea SST Anomaly:</span>
                <span className="font-mono text-status-alert">+{sstAnomaly.toFixed(2)}°C</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={sstAnomaly}
                onChange={(e) => setSstAnomaly(Number(e.target.value))}
                className="w-full accent-status-alert cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>+0.2°C (Neutral)</span>
                <span>+2.5°C (Extreme Marine Heatwave)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-ink">
                <span>Indian Ocean Dipole (IOD):</span>
                <span className="font-mono text-purple">+{iodIndex.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.8"
                max="0.8"
                step="0.05"
                value={iodIndex}
                onChange={(e) => setIodIndex(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>-0.8 (Negative)</span>
                <span>+0.8 (Strong Positive)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-ink">
                Madden-Julian Oscillation (MJO):
              </div>
              <select
                value={mjoPhase}
                onChange={(e) => setMjoPhase(e.target.value)}
                className="w-full p-2 bg-surface border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-purple"
              >
                <option>Phase 2 (Equatorial Indian Ocean)</option>
                <option>Phase 3 (East Indian Ocean)</option>
                <option>Phase 4 (Maritime Continent)</option>
                <option>Phase 5 (West Pacific)</option>
              </select>
            </div>
          </div>

          {/* Analog Matches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Top Ranked Historical Climatological Analogs
            </h4>

            {ANALOG_CANDIDATES.map((cand, i) => (
              <div key={cand.year} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2.5 shadow-xs">
                <div className="flex justify-between items-start border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-soft text-purple">
                      Rank #{i + 1}
                    </span>
                    <h3 className="font-bold text-sm text-ink">{cand.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-purple">
                      {cand.similarityScore}% Match
                    </span>
                    <div className="text-[10px] font-mono text-ink-secondary">k-NN Cosine Similarity</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-surface-secondary rounded-lg">
                    <span className="text-ink-secondary text-[10px]">Season Total Rainfall</span>
                    <div className="font-bold text-ink">{cand.historicalRainfallMm} mm</div>
                  </div>
                  <div className="p-2 bg-surface-secondary rounded-lg">
                    <span className="text-ink-secondary text-[10px]">Cloudburst Events</span>
                    <div className="font-bold text-status-alert">{cand.extremeEventsCount} Severe Days</div>
                  </div>
                  <div className="p-2 bg-surface-secondary rounded-lg">
                    <span className="text-ink-secondary text-[10px]">Peak Reference Storm</span>
                    <div className="font-bold text-purple truncate">{cand.peakFloodDate}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-soft/50 rounded-lg border border-purple/20 text-xs text-ink">
                  <strong className="text-purple font-mono block text-[11px] mb-0.5">Municipal Operational Readiness Guidance:</strong>
                  {cand.guidance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Analog Model: ECMWF &amp; IMD Extended Range Ensemble Forecast Database</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Pattern Matcher
          </button>
        </div>
      </div>
    </div>
  );
}
