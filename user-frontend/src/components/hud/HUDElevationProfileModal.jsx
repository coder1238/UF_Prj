import React from 'react';
import { 
  X, Mountain, TrendingDown, TrendingUp, 
  AlertTriangle, ShieldCheck, Droplets 
} from 'lucide-react';

export default function HUDElevationProfileModal({
  isOpen = false,
  onClose = () => {},
  currentStep = 0
}) {
  if (!isOpen) return null;

  // Profile points along the corridor
  const profilePoints = [
    { km: 0.0, name: 'Sion Circle', roadMsl: 8.5, waterMsl: 8.54, depthCm: 4, isLowSag: false },
    { km: 1.2, name: 'LBS Marg', roadMsl: 4.2, waterMsl: 4.38, depthCm: 18, isLowSag: false },
    { km: 2.1, name: 'Kurla Underpass Sag', roadMsl: 2.1, waterMsl: 2.56, depthCm: 46, isLowSag: true },
    { km: 3.8, name: 'BKC Ramp Ascent', roadMsl: 14.8, waterMsl: 14.8, depthCm: 0, isLowSag: false },
    { km: 5.2, name: 'BKC Elevated Deck', roadMsl: 15.2, waterMsl: 15.2, depthCm: 0, isLowSag: false },
    { km: 6.2, name: 'G-Block Hub', roadMsl: 11.2, waterMsl: 11.22, depthCm: 2, isLowSag: false }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Route Elevation & Hydraulic Surcharge Profile</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Topographic cross-section with Mean Sea Level (MSL) water table elevation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cross-section SVG Graphic */}
        <div className="my-5 p-4 rounded-2xl bg-black/50 border border-white/10">
          <div className="flex justify-between text-[11px] font-mono text-muted mb-2">
            <span>Elevation: MSL (Meters above Mean Sea Level)</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-purple-soft">
                <span className="w-3 h-1 bg-purple-400 inline-block rounded" /> Road Surface
              </span>
              <span className="inline-flex items-center gap-1 text-red-400">
                <span className="w-3 h-1 bg-red-500 inline-block rounded" /> Flood Water Level
              </span>
            </span>
          </div>

          <div className="h-44 w-full relative">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" />
              <text x="30" y="24" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">+16m</text>

              <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.06)" />
              <text x="30" y="64" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">+12m</text>

              <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.06)" />
              <text x="30" y="104" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">+6m</text>

              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.1)" />
              <text x="30" y="144" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">+0m (MSL)</text>

              {/* Road Terrain Polygon & Line */}
              {/* Sion(8.5m->y=85), LBS(4.2m->y=118), Kurla(2.1m->y=135), BKCRamp(14.8m->y=30), BKCDeck(15.2m->y=26), GBlock(11.2m->y=68) */}
              <defs>
                <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="floodWaterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Road Terrain fill */}
              <polygon 
                points="50,85 130,118 200,135 320,30 400,26 470,68 470,140 50,140"
                fill="url(#roadGradient)"
              />

              {/* Road Surface Outline */}
              <polyline 
                points="50,85 130,118 200,135 320,30 400,26 470,68"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Sag Point Flood Ponding Puddle (at Kurla x=160 to x=240) */}
              <path 
                d="M 160 126 Q 200 123 240 100 L 240 130 L 200 135 L 160 126 Z"
                fill="url(#floodWaterGradient)"
                stroke="#ef4444"
                strokeWidth="2"
              />

              {/* Sag Point Warning Tag */}
              <g transform="translate(200, 100)">
                <rect x="-35" y="-18" width="70" height="16" rx="4" fill="#ef4444" />
                <text x="0" y="-7" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SAG: 46cm FLOOD
                </text>
              </g>

              {/* Viaduct Dry Tag */}
              <g transform="translate(360, 14)">
                <rect x="-38" y="-14" width="76" height="16" rx="4" fill="#10b981" />
                <text x="0" y="-3" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  VIADUCT: +15.2m DRY
                </text>
              </g>

              {/* Waypoint Markers */}
              {[
                { x: 50, y: 85, label: 'Sion' },
                { x: 130, y: 118, label: 'LBS' },
                { x: 200, y: 135, label: 'Kurla' },
                { x: 320, y: 30, label: 'Ramp' },
                { x: 400, y: 26, label: 'Flyover' },
                { x: 470, y: 68, label: 'BKC' }
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                  <text x={pt.x} y={pt.y + 14} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Spot Data Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          {profilePoints.map((pt, idx) => (
            <div 
              key={idx}
              className={`p-2.5 rounded-xl border ${
                pt.isLowSag 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white truncate">{pt.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  pt.depthCm > 20 ? 'bg-red-500 text-white font-bold' : 'text-muted'
                }`}>{pt.depthCm} cm</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted">
                <span>Elevation: +{pt.roadMsl}m</span>
                <span>{pt.km} km mark</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-muted">
          <span>Municipal datum: Survey of India Mumbai Town Level Datum (+0.0m MSL).</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}

