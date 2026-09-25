import React, { useState } from 'react';
import { 
  X, 
  Ruler, 
  Layers, 
  Waves, 
  TrendingDown, 
  Info,
  ChevronRight
} from 'lucide-react';
import { ELEVATION_PROFILES_DATA } from '../../data/floodData';

export default function CorridorElevationDrawer({ isOpen, onClose, defaultCorridorId = 'rd-milan' }) {
  const [selectedCorridor, setSelectedCorridor] = useState(defaultCorridorId);

  if (!isOpen) return null;

  const profile = ELEVATION_PROFILES_DATA[selectedCorridor] || ELEVATION_PROFILES_DATA['rd-milan'];
  const maxElev = Math.max(...profile.points.map(p => Math.max(p.groundElevationM, p.waterLevelM || 0))) + 2;
  const minElev = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary-soft text-primary-deep">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                DIGITAL ELEVATION MODEL (DEM)
              </span>
              <h2 className="text-lg font-bold text-ink">
                Topographical Corridor Profile & Sump Cross-Section
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Corridor selector buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(ELEVATION_PROFILES_DATA).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedCorridor(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  selectedCorridor === key
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white border-border text-slate-700 hover:bg-slate-50'
                }`}
              >
                {val.name}
              </button>
            ))}
          </div>

          {/* SVG Elevation Cross-Section */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
              <span className="text-slate-400">Elevation Profile (Meters above Mean Sea Level)</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span> Flood Sump Level
              </span>
            </div>

            <div className="pt-3">
              <svg viewBox="0 0 500 180" className="w-full h-48 overflow-visible">
                {/* Horizontal reference grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#475569" strokeWidth="1.5" />

                {/* Y-axis labels (MSL Meters) */}
                <text x="32" y="24" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">20m</text>
                <text x="32" y="64" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">12m</text>
                <text x="32" y="104" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">6m</text>
                <text x="32" y="144" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">0m</text>

                {/* Ground terrain polygon & line */}
                {profile.points.length > 0 && (
                  <>
                    {/* Road terrain curve */}
                    <path
                      d={`M 60 ${140 - (profile.points[0].groundElevationM / maxElev) * 120} ` +
                        profile.points.slice(1).map((p, idx) => {
                          const x = 60 + ((idx + 1) * (400 / (profile.points.length - 1)));
                          const y = 140 - (p.groundElevationM / maxElev) * 120;
                          return `L ${x} ${y}`;
                        }).join(' ')
                      }
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Ground points and labels */}
                    {profile.points.map((p, idx) => {
                      const x = 60 + (idx * (400 / (profile.points.length - 1)));
                      const y = 140 - (p.groundElevationM / maxElev) * 120;
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                          <text x={x} y={160} textAnchor="middle" fill="#CBD5E1" fontSize="8" fontFamily="JetBrains Mono">
                            {p.distanceM}m
                          </text>
                          <text x={x} y={y - 8} textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                            +{p.groundElevationM}m
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Points list breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-ink uppercase">Cross-Section Station Markers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {profile.points.map((p, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-canvas border border-border flex items-center justify-between">
                  <div>
                    <strong className="text-ink block">{p.label}</strong>
                    <span className="text-[10px] text-ink-muted">Distance: {p.distanceM}m from entry</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary block">+{p.groundElevationM}m MSL</span>
                    {p.waterLevelM > 0 && (
                      <span className="text-[10px] text-red-600 font-bold block">Water: +{p.waterLevelM}m</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synoptic insight */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Hydro-Topographic Insight:</strong> Natural surface slope gradients funnel water directly into the center sag point (+3.2m MSL). When Arabian Sea high tide exceeds +4.1m, gravity outfalls seal shut, creating artificial bowl ponding until high-capacity centrifugal pumps evacuate the basin.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition"
          >
            Close Elevation Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

