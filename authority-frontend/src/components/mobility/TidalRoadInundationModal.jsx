import React, { useState } from 'react';
import { X, Waves, AlertTriangle, Clock, Droplets, Info } from 'lucide-react';
import { TIDAL_STATION } from '../../data/floodData';

export default function TidalRoadInundationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [tideThreshold, setTideThreshold] = useState(4.2); // m MSL

  // Hourly tide curve around high tide (19:42 peak at 4.87m)
  const tidalTimeline = [
    { time: '17:00', tideLevelM: 3.42, roadRisk: 'LOW', backflowNodes: 1 },
    { time: '18:00', tideLevelM: 4.05, roadRisk: 'MODERATE', backflowNodes: 4 },
    { time: '18:30', tideLevelM: 4.38, roadRisk: 'HIGH', backflowNodes: 8 },
    { time: '19:00', tideLevelM: 4.65, roadRisk: 'CRITICAL', backflowNodes: 14 },
    { time: '19:42', tideLevelM: 4.87, roadRisk: 'EXTREME PEAK', backflowNodes: 22 }, // Peak
    { time: '20:15', tideLevelM: 4.68, roadRisk: 'CRITICAL', backflowNodes: 18 },
    { time: '21:00', tideLevelM: 4.15, roadRisk: 'HIGH', backflowNodes: 9 },
    { time: '22:00', tideLevelM: 3.55, roadRisk: 'LOW', backflowNodes: 2 },
  ];

  const affectedCoastalRoads = [
    {
      road: 'Sion East Circle & Ambedkar Road Crossing',
      elevationM: 3.8,
      inundationWindow: '18:15 IST - 20:45 IST',
      cause: 'Mahim Creek Tidal Lockout + Surcharged Box Drain',
      peakWaterDepthCm: 43,
      detour: 'Direct traffic up to Eastern Express Highway Flyover',
    },
    {
      road: 'Kurla West (LBS Marg Near Mithi Outfall)',
      elevationM: 2.6,
      inundationWindow: '18:00 IST - 21:15 IST',
      cause: 'Mithi River Backwater Intrusion through tidal flap gates',
      peakWaterDepthCm: 34,
      detour: 'Divert onto Santacruz-Chembur Link Road (SCLR) Elevated',
    },
    {
      road: 'Bandra-Kurla Complex (BKC) Low-Lying Slip Lanes',
      elevationM: 4.1,
      inundationWindow: '19:10 IST - 20:20 IST',
      cause: 'Vakola Nullah Confluence Surge',
      peakWaterDepthCm: 16,
      detour: 'Use BKC Elevated Connector directly to EEH',
    },
    {
      road: 'Mahim Causeway Coastal Arterial',
      elevationM: 4.4,
      inundationWindow: '19:25 IST - 20:00 IST',
      cause: 'Arabian Sea High Wave Overtopping',
      peakWaterDepthCm: 12,
      detour: 'Restrict to heavy transport; cars divert to Sea Link',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Tidal Surge &amp; High Tide Road Inundation Predictor
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-alert text-white">
                  Peak Tide: +4.87m at 19:42 IST
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Correlates Apollo Bunder oceanic tidal gauge with stormwater outfall lockout and arterial backflow
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
          {/* Tidal Status Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-200 block">
                Arabian Sea Tidal Regime &bull; Spring Tide Phase
              </span>
              <h4 className="text-lg font-black mt-0.5 flex items-center gap-2">
                Extreme High Tide Window: 18:30 &rarr; 21:00 IST
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                Gravitational flap gates at Mithi River and Mahim Bay locked. Gravity drainage disabled.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-center font-mono">
              <span className="text-[10px] text-blue-200 block">Lockout Threshold</span>
              <span className="text-base font-bold">+4.20 m MSL</span>
            </div>
          </div>

          {/* Tidal Timeline Grid */}
          <div>
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary block mb-2">
              Hydrodynamic Tidal Curve vs Outfall Lockout
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {tidalTimeline.map((slot, i) => {
                const isOverThreshold = slot.tideLevelM >= tideThreshold;
                const isPeak = slot.time === '19:42';
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-center font-mono transition-all ${
                      isPeak
                        ? 'bg-status-alert-soft border-status-alert shadow-subtle'
                        : isOverThreshold
                        ? 'bg-status-warning-soft border-status-warning/60'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-ink block">{slot.time}</span>
                    <span
                      className={`text-sm font-bold block mt-1 ${
                        isOverThreshold ? 'text-status-alert' : 'text-blue-600'
                      }`}
                    >
                      {slot.tideLevelM}m
                    </span>
                    <span className="text-[9px] text-ink-muted block mt-1 font-sans font-semibold">
                      {slot.backflowNodes} Outfalls Locked
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Affected Coastal & Creek Road Corridors Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="p-3 bg-surface-secondary border-b border-border flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-ink uppercase">
                Tide-Induced Backflow Road Vulnerability Registry
              </span>
              <span className="text-[10px] font-mono text-status-alert font-bold">
                4 Critical Corridors Affected
              </span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface-secondary/60 text-ink-secondary font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Road Corridor</th>
                  <th className="py-2.5 px-3">Road Elevation</th>
                  <th className="py-2.5 px-3">Submergence Window</th>
                  <th className="py-2.5 px-3">Peak Water Depth</th>
                  <th className="py-2.5 px-3">Mandatory Emergency Detour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {affectedCoastalRoads.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-ink block">{r.road}</span>
                      <span className="text-[10px] text-ink-muted">{r.cause}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-ink">{r.elevationM} m MSL</td>
                    <td className="py-2.5 px-3 font-mono text-status-alert font-bold">{r.inundationWindow}</td>
                    <td className="py-2.5 px-3 font-mono text-status-alert font-bold">+{r.peakWaterDepthCm} cm</td>
                    <td className="py-2.5 px-3 text-purple font-medium">{r.detour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Coordinated with Survey of India &amp; Maharashtra Maritime Board (MMB) real-time tide gauges.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Tidal Predictor
          </button>
        </div>
      </div>
    </div>
  );
}

