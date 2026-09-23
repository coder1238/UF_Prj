import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Layers,
  Info,
  ShieldAlert,
  Radio,
  Eye,
} from 'lucide-react';

const MAP_WARDS = [
  { id: 'Ward K/E', name: 'Andheri East / Marol', risk: 'CRITICAL', riskScore: 92, depth: '35cm', pop: '840k', cx: 160, cy: 90, r: 48 },
  { id: 'Ward L', name: 'Kurla / Mithi Basin', risk: 'CRITICAL', riskScore: 94, depth: '48cm', pop: '920k', cx: 280, cy: 150, r: 54 },
  { id: 'Ward F/N', name: 'Sion / Matunga', risk: 'HIGH', riskScore: 88, depth: '38cm', pop: '520k', cx: 270, cy: 260, r: 46 },
  { id: 'Ward G/N', name: 'Dadar / Mahim', risk: 'HIGH', riskScore: 82, depth: '28cm', pop: '580k', cx: 180, cy: 280, r: 44 },
  { id: 'Ward H/E', name: 'Bandra East / BKC', risk: 'MODERATE', riskScore: 74, depth: '22cm', pop: '610k', cx: 180, cy: 190, r: 42 },
  { id: 'Ward M/W', name: 'Chembur / Tilak Nagar', risk: 'MODERATE', riskScore: 68, depth: '18cm', pop: '440k', cx: 370, cy: 220, r: 40 },
];

export default function WardGeofenceMapModal({
  isOpen,
  onClose,
  selectedWards = ['Ward K/E', 'Ward L'],
  onToggleWard,
}) {
  if (!isOpen) return null;

  const [hoveredWard, setHoveredWard] = useState(null);
  const [showContours, setShowContours] = useState(true);
  const [showTowers, setShowTowers] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Interactive Ward Risk &amp; Inundation Geofence Visualizer
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Click map nodes to include or exclude municipal wards from the active alert envelope
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Layers Toolbar */}
        <div className="px-5 py-2.5 bg-surface-secondary border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-ink">
              <input
                type="checkbox"
                checked={showContours}
                onChange={(e) => setShowContours(e.target.checked)}
                className="accent-purple"
              />
              <span>Inundation Water Depth Contours</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-ink">
              <input
                type="checkbox"
                checked={showTowers}
                onChange={(e) => setShowTowers(e.target.checked)}
                className="accent-purple"
              />
              <span>Cell Tower Broadcast Centroids</span>
            </label>
          </div>

          <span className="font-mono text-xs text-purple font-semibold">
            {selectedWards.length} Wards Targeted in Active Broadcast
          </span>
        </div>

        {/* SVG Interactive Map Area */}
        <div className="flex-1 p-4 bg-[#110E1B] flex flex-col md:flex-row items-center justify-center gap-6 overflow-hidden relative">
          <div className="relative w-full max-w-[500px] h-[360px] flex items-center justify-center">
            <svg
              viewBox="0 0 500 360"
              className="w-full h-full drop-shadow-2xl select-none"
            >
              {/* Background Coastline & Bay Water */}
              <path
                d="M 50 0 L 100 80 L 110 180 L 120 280 L 140 360 L 0 360 L 0 0 Z"
                fill="#1E2A4A"
                opacity="0.4"
              />
              <text x="25" y="190" fill="#4B6B94" fontSize="10" fontFamily="monospace">
                ARABIAN SEA
              </text>

              {/* Mithi River Channel */}
              <path
                d="M 220 50 Q 240 120 270 170 T 210 260 L 160 300"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.7"
              />
              <text x="260" y="110" fill="#60A5FA" fontSize="9" fontFamily="monospace">
                MITHI RIVER CORRIDOR
              </text>

              {/* Flood Contours if enabled */}
              {showContours && (
                <>
                  <ellipse cx="280" cy="150" rx="80" ry="60" fill="#EF4444" opacity="0.15" />
                  <ellipse cx="270" cy="260" rx="65" ry="50" fill="#F59E0B" opacity="0.15" />
                  <ellipse cx="160" cy="90" rx="65" ry="50" fill="#EF4444" opacity="0.15" />
                </>
              )}

              {/* Ward Interactive Circular Polygons */}
              {MAP_WARDS.map((w) => {
                const isSelected = selectedWards.includes(w.id);
                const isHovered = hoveredWard?.id === w.id;

                return (
                  <g
                    key={w.id}
                    onClick={() => onToggleWard && onToggleWard(w.id)}
                    onMouseEnter={() => setHoveredWard(w)}
                    onMouseLeave={() => setHoveredWard(null)}
                    className="cursor-pointer transition-transform duration-200"
                  >
                    {/* Pulsing ring if selected and critical */}
                    {isSelected && (
                      <circle
                        cx={w.cx}
                        cy={w.cy}
                        r={w.r + 6}
                        fill="none"
                        stroke={w.risk === 'CRITICAL' ? '#EF4444' : '#6D4AFF'}
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${w.cx}px ${w.cy}px`, animationDuration: '8s' }}
                      />
                    )}

                    {/* Main Ward Node */}
                    <circle
                      cx={w.cx}
                      cy={w.cy}
                      r={w.r}
                      fill={
                        isSelected
                          ? w.risk === 'CRITICAL'
                            ? '#991B1B'
                            : '#4930A8'
                          : '#252136'
                      }
                      stroke={isSelected ? '#FFFFFF' : '#494460'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      opacity={isSelected ? 0.95 : 0.65}
                    />

                    {/* Label inside node */}
                    <text
                      x={w.cx}
                      y={w.cy - 6}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {w.id}
                    </text>
                    <text
                      x={w.cx}
                      y={w.cy + 8}
                      textAnchor="middle"
                      fill="#DDD"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {w.depth}
                    </text>
                    <text
                      x={w.cx}
                      y={w.cy + 20}
                      textAnchor="middle"
                      fill={isSelected ? '#93C5FD' : '#888'}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {isSelected ? '[TARGETED]' : '[CLICK]'}
                    </text>

                    {/* Cell Tower Pin Icon if enabled */}
                    {showTowers && (
                      <circle
                        cx={w.cx - w.r + 14}
                        cy={w.cy - w.r + 14}
                        r="4"
                        fill="#10B981"
                        stroke="#FFF"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover / Selected Ward Info Card */}
          <div className="w-full md:w-64 bg-surface/95 backdrop-blur rounded-xl p-4 border border-border text-xs space-y-2 shadow-elevated">
            <span className="text-[10px] font-mono text-ink-secondary uppercase block">
              Inspection Telemetry
            </span>
            <div className="font-bold text-sm text-ink">
              {hoveredWard ? hoveredWard.name : 'Hover or Click a Ward'}
            </div>
            {hoveredWard ? (
              <div className="space-y-1 font-mono text-[11px] text-ink-secondary pt-1">
                <div>Code: <strong>{hoveredWard.id}</strong></div>
                <div>Risk Status: <strong className={hoveredWard.risk === 'CRITICAL' ? 'text-status-alert' : 'text-status-warning'}>{hoveredWard.risk} ({hoveredWard.riskScore}/100)</strong></div>
                <div>Water Depth: <strong>{hoveredWard.depth}</strong></div>
                <div>Population: <strong>{hoveredWard.pop}</strong></div>
                <div className="pt-1 text-[10px] font-sans text-purple font-semibold">
                  {selectedWards.includes(hoveredWard.id) ? '✓ Currently targeted in broadcast' : '+ Click to add to broadcast'}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Click any municipal ward circle to toggle its inclusion in the active cell broadcast geofence.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-xs text-ink-secondary font-mono">
            Geospatial boundary polygons synchronized with MCGM GIS Server 2026.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white text-xs font-bold transition-colors"
          >
            Apply &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}

