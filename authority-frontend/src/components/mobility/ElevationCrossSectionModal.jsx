import React, { useState } from 'react';
import { X, TrendingUp, AlertTriangle, ShieldCheck, Waves, Info } from 'lucide-react';
import { ROUTE_PROFILES } from './mobilityConstants';

export default function ElevationCrossSectionModal({ isOpen, onClose, selectedRouteId, vehicle }) {
  if (!isOpen) return null;

  const [activeProfileId, setActiveProfileId] = useState(selectedRouteId || 'flood-aware');
  const route = ROUTE_PROFILES.find((r) => r.id === activeProfileId) || ROUTE_PROFILES[1];

  const vehicleWadingCm = vehicle?.wadingMaxCm || 20;

  // Elevation data points for SVG rendering
  const maxElev = 25;
  const maxDist = route.distanceKm || 14;

  const points = route.elevationProfile || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Hydrodynamic Road Elevation & Water Depth Cross-Section
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple">
                  LiDAR + Hydro Profile
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Correlates roadbed datum (m MSL) against 1D/2D hydraulic water depths and vehicle wading threshold
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

        {/* Route selector tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-border overflow-x-auto pb-2">
          {ROUTE_PROFILES.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveProfileId(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeProfileId === r.id
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-surface-secondary text-ink-secondary hover:text-ink'
              }`}
            >
              <span>{r.name.split('(')[0]}</span>
              {r.maxFloodDepthCm > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-status-alert text-white font-mono">
                  {r.maxFloodDepthCm}cm
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-status-safe text-white font-mono">
                  0cm Safe
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Corridor Length</span>
              <p className="text-base font-bold text-ink mt-0.5">{route.distanceKm} km</p>
              <span className="text-[11px] text-ink-secondary">Est: {route.baseDurationMin} mins</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Elevated Flyovers</span>
              <p className="text-base font-bold text-purple mt-0.5">{route.flyoverPercentage}%</p>
              <span className="text-[11px] text-ink-secondary">Grade separated spans</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Max Inundation Depth</span>
              <p className={`text-base font-bold mt-0.5 ${route.maxFloodDepthCm > 0 ? 'text-status-alert' : 'text-status-safe'}`}>
                {route.maxFloodDepthCm} cm
              </p>
              <span className="text-[11px] text-ink-secondary">Threshold: {vehicleWadingCm}cm</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Vehicle Clearance Check</span>
              <p className="text-xs font-bold mt-1 flex items-center gap-1 text-ink">
                {route.maxFloodDepthCm > vehicleWadingCm ? (
                  <span className="text-status-alert flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Fails Clearance
                  </span>
                ) : (
                  <span className="text-status-safe flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Passable
                  </span>
                )}
              </p>
              <span className="text-[10px] font-mono text-ink-secondary">
                Vehicle: {vehicle?.label || 'Ambulance'}
              </span>
            </div>
          </div>

          {/* Interactive SVG Elevation Profile Graph */}
          <div className="bg-canvas border border-border rounded-xl p-4 shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-secondary pb-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple"></span> Ground/Flyover Elevation (m MSL)
                <span className="w-3 h-3 rounded bg-status-alert ml-2"></span> Standing Water Depth (cm)
                <span className="w-3 h-0.5 border-t-2 border-dashed border-status-warning ml-2"></span> Vehicle Intake Ceiling ({vehicleWadingCm}cm)
              </span>
              <span className="text-[10px]">Datum: Mumbai High Water Spring (+4.5m)</span>
            </div>

            {/* SVG Canvas */}
            <div className="w-full h-56 relative border-b border-l border-border/80">
              <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D94A4A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#D94A4A" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 5, 10, 15, 20, 25].map((elev, i) => {
                  const y = 180 - (elev / maxElev) * 160;
                  return (
                    <g key={i}>
                      <line x1="0" y1={y} x2="700" y2={y} stroke="#E3E0EA" strokeDasharray="3 3" />
                      <text x="-8" y={y + 3} textAnchor="end" fontSize="9" fill="#948E9F" fontFamily="monospace">
                        {elev}m
                      </text>
                    </g>
                  );
                })}

                {/* Roadbed Elevation Path */}
                {points.length > 1 && (
                  <>
                    <path
                      d={`M 0 180 ${points
                        .map((pt) => {
                          const x = (pt.km / maxDist) * 700;
                          const y = 180 - (pt.roadElevM / maxElev) * 160;
                          return `L ${x} ${y}`;
                        })
                        .join(' ')} L 700 180 Z`}
                      fill="url(#roadGradient)"
                    />
                    <path
                      d={`M ${points
                        .map((pt) => {
                          const x = (pt.km / maxDist) * 700;
                          const y = 180 - (pt.roadElevM / maxElev) * 160;
                          return `${x} ${y}`;
                        })
                        .join(' L ')}`}
                      fill="none"
                      stroke="#6D4AFF"
                      strokeWidth="3"
                    />
                  </>
                )}

                {/* Water Columns / Sump Inundation Polygons */}
                {points.map((pt, idx) => {
                  if (pt.waterDepthCm <= 0) return null;
                  const x = (pt.km / maxDist) * 700;
                  const roadY = 180 - (pt.roadElevM / maxElev) * 160;
                  const waterHeightPx = (pt.waterDepthCm / 50) * 45; // scale water depth
                  const waterY = roadY - waterHeightPx;

                  return (
                    <g key={idx}>
                      <rect
                        x={x - 18}
                        y={waterY}
                        width="36"
                        height={waterHeightPx}
                        rx="3"
                        fill="url(#waterGradient)"
                        stroke="#D94A4A"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x}
                        y={waterY - 6}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#D94A4A"
                        fontFamily="monospace"
                      >
                        +{pt.waterDepthCm}cm
                      </text>
                    </g>
                  );
                })}

                {/* Waypoint Milestone Pins */}
                {points.map((pt, idx) => {
                  const x = (pt.km / maxDist) * 700;
                  const y = 180 - (pt.roadElevM / maxElev) * 160;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#6D4AFF" strokeWidth="2.5" />
                      <text
                        x={x}
                        y="196"
                        textAnchor="middle"
                        fontSize="8.5"
                        fill="#706B78"
                        fontFamily="sans-serif"
                      >
                        {pt.km}km
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Segment Details Table */}
          <div className="border border-border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary text-ink-secondary font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Segment Point</th>
                  <th className="py-2.5 px-3">Chainage</th>
                  <th className="py-2.5 px-3">Road Surface (m MSL)</th>
                  <th className="py-2.5 px-3">Water Depth</th>
                  <th className="py-2.5 px-3">Clearance Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {points.map((pt, i) => (
                  <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-ink">{pt.label}</td>
                    <td className="py-2 px-3 font-mono">{pt.km} km</td>
                    <td className="py-2 px-3 font-mono">{pt.roadElevM.toFixed(1)} m</td>
                    <td className="py-2 px-3">
                      {pt.waterDepthCm > 0 ? (
                        <span className="font-mono font-bold text-status-alert">
                          {pt.waterDepthCm} cm
                        </span>
                      ) : (
                        <span className="text-status-safe font-mono font-medium">0 cm (Dry)</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {pt.waterDepthCm === 0 ? (
                        <span className="text-[11px] font-semibold text-status-safe flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 100% Clearance
                        </span>
                      ) : pt.waterDepthCm > vehicleWadingCm ? (
                        <span className="text-[11px] font-semibold text-status-alert flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Breach by {pt.waterDepthCm - vehicleWadingCm}cm
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-status-warning flex items-center gap-1">
                          Caution (Within {vehicleWadingCm}cm limit)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple" />
            Elevation cross-section synthesized from 1m Digital Terrain Model (DTM) &amp; BMC Stormwater telemetry.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

