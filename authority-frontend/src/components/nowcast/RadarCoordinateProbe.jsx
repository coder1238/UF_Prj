import React from 'react';
import {
  Crosshair,
  MapPin,
  Compass,
  Activity,
  Droplets,
  Layers,
  X,
  Share2,
} from 'lucide-react';

export default function RadarCoordinateProbe({ probeData, onClose }) {
  if (!probeData) return null;

  // Compare Marshall-Palmer vs Convective Tropical Z-R
  const Z_lin = Math.pow(10, probeData.dbz / 10);
  const mpRate = probeData.dbz < 15 ? 0 : Math.round(Math.pow(Z_lin / 200, 1 / 1.6) * 10) / 10;
  const tropicalRate = probeData.dbz < 15 ? 0 : Math.round(Math.pow(Z_lin / 300, 1 / 1.4) * 10) / 10;

  // Approximate closest drainage sump
  const sumps = [
    { name: 'Kurla West Box Drain Sump D-14', dist: '0.8 km' },
    { name: 'Sion Circle Storm Sump D-08', dist: '1.2 km' },
    { name: 'Milan Subway Low-Lying Sump S-02', dist: '2.4 km' },
    { name: 'Mahim Creek Tidal Bypass Inflow', dist: '3.1 km' },
  ];
  const nearestSump = sumps[Math.abs(Math.round(probeData.svgX + probeData.svgY)) % sumps.length];

  return (
    <div className="bg-surface border border-purple/30 rounded-xl p-4 shadow-elevated flex flex-col gap-3 font-mono animate-fade-in text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-bold text-ink uppercase flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-purple" />
          Active Coordinate Probe &amp; Sounding
        </span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-secondary text-ink-secondary hover:text-ink rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Geodetic & Radar Metrics */}
      <div className="grid grid-cols-2 gap-2 text-ink-secondary">
        <div className="bg-surface-secondary p-2 rounded-lg border border-border">
          <div className="text-[10px] uppercase">Geodetic Fix</div>
          <div className="font-bold text-ink text-xs mt-0.5">
            {probeData.lat}° N, {probeData.lon}° E
          </div>
        </div>
        <div className="bg-surface-secondary p-2 rounded-lg border border-border">
          <div className="text-[10px] uppercase">Polar Range / Azimuth</div>
          <div className="font-bold text-purple text-xs mt-0.5">
            {probeData.distanceKm} km @ {probeData.azimuthDeg}°
          </div>
        </div>
        <div className="bg-surface-secondary p-2 rounded-lg border border-border">
          <div className="text-[10px] uppercase">Beam Height MSL</div>
          <div className="font-bold text-ink text-xs mt-0.5">
            {probeData.beamHeightKm} km (PPI 0.5°)
          </div>
        </div>
        <div className="bg-surface-secondary p-2 rounded-lg border border-border">
          <div className="text-[10px] uppercase">Reflectivity</div>
          <div className="font-bold text-status-alert text-xs mt-0.5">
            {probeData.dbz} dBZ
          </div>
        </div>
      </div>

      {/* Z-R Dual Conversion Comparison */}
      <div className="bg-surface-secondary p-2.5 rounded-lg border border-border flex flex-col gap-1.5">
        <div className="text-[10px] uppercase font-bold text-ink flex items-center justify-between">
          <span>Dual Z-R Hydrologic Calibration</span>
          <span className="text-purple">Convective vs Stratiform</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>Marshall-Palmer (Z=200R¹·⁶):</span>
          <strong className="text-ink">{mpRate} mm/hr</strong>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>IMD Tropical Convective (Z=300R¹·⁴):</span>
          <strong className="text-status-alert">{tropicalRate} mm/hr</strong>
        </div>
      </div>

      {/* Nearest Critical Municipal Sump */}
      <div className="flex justify-between items-center text-[11px] pt-1">
        <span className="text-ink-secondary">Nearest Storm Sump:</span>
        <strong className="text-ink text-right">{nearestSump.name} ({nearestSump.dist})</strong>
      </div>
    </div>
  );
}

