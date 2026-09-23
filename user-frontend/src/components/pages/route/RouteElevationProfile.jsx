import React, { useState } from 'react';
import { TrendingUp, Waves, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RouteElevationProfile({
  activeCorridor,
  scrubbedKm,
  onScrubKm,
  vehicleClearance = 15
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!activeCorridor || !activeCorridor.elevationProfile) return null;

  const profile = activeCorridor.elevationProfile;
  const maxElev = 30; // 30m max datum
  const svgWidth = 540;
  const svgHeight = 140;
  const padLeft = 40;
  const padRight = 40;
  const padBottom = 30;
  const padTop = 20;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const totalDistance = activeCorridor.distanceKm;

  // Coordinate mapping helper
  const getX = (km) => padLeft + (km / totalDistance) * chartWidth;
  const getY = (elev) => padTop + chartHeight - (elev / maxElev) * chartHeight;

  // Build Road Elevation SVG path
  const roadPoints = profile.map(p => `${getX(p.km)},${getY(p.roadElevation)}`).join(' L ');
  const roadPathD = `M ${roadPoints}`;

  // Build Area under road for subtle gradient fill
  const areaPathD = `M ${getX(0)},${getY(0)} L ${roadPoints} L ${getX(totalDistance)},${getY(0)} Z`;

  // Build Flood Water Table polygon
  const waterPoints = profile.map(p => {
    const waterElev = p.waterLevel;
    return `${getX(p.km)},${getY(waterElev)}`;
  }).join(' L ');
  const waterPathD = `M ${getX(0)},${getY(0)} L ${waterPoints} L ${getX(totalDistance)},${getY(0)} Z`;

  // Handle SVG hover / scrub
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const clampedX = Math.max(padLeft, Math.min(padLeft + chartWidth, mouseX));
    const fraction = (clampedX - padLeft) / chartWidth;
    const km = fraction * totalDistance;
    onScrubKm(km);

    // Find closest profile datum
    let closest = profile[0];
    let minDiff = 999;
    profile.forEach(p => {
      const diff = Math.abs(p.km - km);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    });
    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    onScrubKm(null);
    setHoveredPoint(null);
  };

  const minElevation = Math.min(...profile.map(p => p.roadElevation));
  const maxWaterDepth = Math.max(...profile.map(p => p.depth));
  const safetyMarginM = (minElevation - 3.2).toFixed(1);

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">LONGITUDINAL ELEVATION PROFILE</span>
            <span className="text-[10px] font-mono text-purple-primary bg-purple-soft px-1.5 py-0.5 rounded font-bold">
              DATUM: MSL (MUMBAI HIGH LEVEL)
            </span>
          </div>
          <h4 className="text-xs font-bold text-ink mt-0.5">
            Road Surface Elevation vs Inundation Water Table ({activeCorridor.name})
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {maxWaterDepth > vehicleClearance ? (
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Water Exceeds Clearance ({maxWaterDepth}cm)
            </span>
          ) : (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              +{safetyMarginM}m Min Road Clearance
            </span>
          )}
        </div>
      </div>

      {/* Interactive SVG Elevation Inspector */}
      <div className="relative pt-1 cursor-crosshair">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-32 overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Grid Datum Lines */}
          <line x1={padLeft} y1={getY(0)} x2={padLeft + chartWidth} y2={getY(0)} stroke="#e2e8f0" strokeWidth="1" />
          <line x1={padLeft} y1={getY(10)} x2={padLeft + chartWidth} y2={getY(10)} stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1={padLeft} y1={getY(20)} x2={padLeft + chartWidth} y2={getY(20)} stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* Y Axis Labels */}
          <text x={padLeft - 6} y={getY(0) + 3} fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">0m</text>
          <text x={padLeft - 6} y={getY(10) + 3} fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">10m</text>
          <text x={padLeft - 6} y={getY(20) + 3} fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">20m</text>

          {/* Area fill under road */}
          <path d={areaPathD} fill="url(#roadGradient)" />

          {/* Flood Water Table Basin */}
          <path d={waterPathD} fill="url(#waterGradient)" />

          {/* Road Surface Line */}
          <path 
            d={roadPathD} 
            fill="none" 
            stroke={activeCorridor.color} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Profile Data Points */}
          {profile.map((p, idx) => (
            <g key={idx}>
              <circle 
                cx={getX(p.km)} 
                cy={getY(p.roadElevation)} 
                r={hoveredPoint?.km === p.km ? 6 : 3.5} 
                fill={p.depth > 15 ? '#ef4444' : p.depth > 5 ? '#f59e0b' : '#10b981'} 
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text 
                x={getX(p.km)} 
                y={padTop + chartHeight + 14} 
                fill="#64748b" 
                fontSize="8" 
                fontFamily="JetBrains Mono" 
                textAnchor="middle"
              >
                {p.km}k
              </text>
            </g>
          ))}

          {/* Vertical Scrub Line on Hover */}
          {scrubbedKm !== null && (
            <g>
              <line 
                x1={getX(scrubbedKm)} 
                y1={padTop} 
                x2={getX(scrubbedKm)} 
                y2={padTop + chartHeight} 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeDasharray="2 2" 
              />
              <circle 
                cx={getX(scrubbedKm)} 
                cy={getY(hoveredPoint?.roadElevation || minElevation)} 
                r="5" 
                fill="#6366f1" 
                stroke="#fff" 
                strokeWidth="2" 
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-ink/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/20 text-xs font-mono flex items-center gap-3 pointer-events-none">
            <div>
              <span className="text-[9px] text-purple-soft uppercase block">Station</span>
              <strong>{hoveredPoint.label} ({hoveredPoint.km} km)</strong>
            </div>
            <div>
              <span className="text-[9px] text-purple-soft uppercase block">Elevation</span>
              <span className="text-emerald-400 font-bold">+{hoveredPoint.roadElevation}m</span>
            </div>
            <div>
              <span className="text-[9px] text-purple-soft uppercase block">Water Depth</span>
              <span className={hoveredPoint.depth > 15 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                {hoveredPoint.depth} cm
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics footer strip */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-muted pt-2 border-t border-border">
        <span>Min Road Datum: <strong className="text-ink">{minElevation}m MSL</strong></span>
        <span>•</span>
        <span>Flyover Deck Portion: <strong className="text-emerald-700">{activeCorridor.flyoverPercentage}% Elevated</strong></span>
        <span>•</span>
        <span>Max Water Depth: <strong className={maxWaterDepth > 15 ? 'text-rose-600' : 'text-emerald-700'}>{maxWaterDepth} cm</strong></span>
        <span>•</span>
        <span className="text-purple-primary font-bold">Hover graph to crosshair map</span>
      </div>
    </div>
  );
}

