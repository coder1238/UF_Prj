import React from 'react';
import { Mountain, Waves, Info } from 'lucide-react';

export default function ElevationCrossSection({ currentStep, whatIfModifiers }) {
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const currentDepth = currentStep.depth * depthFactor;

  // Key topographic points along Island City cross-section: [name, distKm, elevM]
  const terrainPoints = [
    { name: 'Western Hwy (Dadar)', km: 0, elev: 12.0 },
    { name: 'Khodadad Circle', km: 1.2, elev: 6.5 },
    { name: 'Hindmata Sump Bowl', km: 2.1, elev: 2.3 },
    { name: 'Chitra Cinema', km: 2.9, elev: 5.2 },
    { name: 'Gandhi Market Sump', km: 3.8, elev: 2.8 },
    { name: 'Sion Circle', km: 4.6, elev: 4.8 },
    { name: 'Mahim Creek Outfall', km: 5.5, elev: 0.8 }
  ];

  // SVG coordinate transformation
  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 35 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxElev = 14;
  const maxKm = 5.5;

  const getX = (km) => padding.left + (km / maxKm) * graphWidth;
  const getY = (elev) => padding.top + graphHeight - (elev / maxElev) * graphHeight;

  // Generate terrain path
  const terrainPath = terrainPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.km)},${getY(p.elev)}`).join(' ');
  const terrainFill = `${terrainPath} L ${getX(maxKm)},${padding.top + graphHeight} L ${getX(0)},${padding.top + graphHeight} Z`;

  // Water level in Hindmata sump (elev 2.3m + depth in meters)
  const waterSurfaceElev = 2.3 + (currentDepth / 100);
  const waterY = getY(waterSurfaceElev);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Mountain className="w-4 h-4" /> Topographic Elevation Profile
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Island City Hydrological Sump Cross-Section
          </h3>
        </div>
        <div className="text-xs font-mono text-muted">
          Bowl Water Elev: <span className="font-bold text-purple-700">+{waterSurfaceElev.toFixed(2)}m MSL</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 select-none">
          <defs>
            <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="waterSumpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Sea Level Baseline (0m MSL) */}
          <line
            x1={padding.left}
            y1={padding.top + graphHeight}
            x2={width - padding.right}
            y2={padding.top + graphHeight}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text 
            x={padding.left - 5} 
            y={padding.top + graphHeight + 4} 
            fill="#64748b" 
            fontSize="9" 
            fontFamily="monospace"
            textAnchor="end"
          >
            0m MSL
          </text>

          {/* Terrain fill & outline */}
          <path d={terrainFill} fill="url(#terrainGrad)" opacity="0.85" />
          <path d={terrainPath} fill="none" stroke="#64748b" strokeWidth="2.5" />

          {/* Sump Ponding Water in the Hindmata Depression */}
          {currentDepth > 10 && (
            <path
              d={`M ${getX(1.6)},${waterY} Q ${getX(2.1)},${waterY + 2} ${getX(2.6)},${waterY} L ${getX(2.6)},${getY(2.3)} L ${getX(1.6)},${getY(2.3)} Z`}
              fill="url(#waterSumpGrad)"
            />
          )}

          {/* Terrain Landmark Points */}
          {terrainPoints.map((p, idx) => {
            const x = getX(p.km);
            const y = getY(p.elev);
            const isBowl = p.km === 2.1;

            return (
              <g key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isBowl ? 5 : 3.5}
                  fill={isBowl ? '#ef4444' : '#ffffff'}
                  stroke={isBowl ? '#991b1b' : '#475569'}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y - 8}
                  fill={isBowl ? '#dc2626' : '#94a3b8'}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight={isBowl ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {p.name.split(' ')[0]} ({p.elev}m)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-primary/20 text-xs text-purple-900 font-sans">
        <Info className="w-4 h-4 text-purple-600 shrink-0" />
        <span>
          Hindmata sits in an artificial bowl at <strong>+2.3m MSL</strong>, surrounded by higher ridges (+6m to +12m). Runoff naturally ponds here like a bathtub unless pumped uphill to the sea.
        </span>
      </div>
    </div>
  );
}

