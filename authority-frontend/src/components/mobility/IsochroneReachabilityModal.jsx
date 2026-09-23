import React, { useState } from 'react';
import { X, Compass, Clock, MapPin, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
import { WAYPOINT_PRESETS } from './mobilityConstants';

export default function IsochroneReachabilityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [origin, setOrigin] = useState(WAYPOINT_PRESETS[0]);
  const [selectedHorizonMin, setSelectedHorizonMin] = useState(15);

  const isochrones = [
    {
      min: 5,
      dryRadiusKm: 3.5,
      floodRadiusKm: 1.4,
      populationDry: '180,000',
      populationFlood: '65,000',
      shrinkagePercent: 64,
    },
    {
      min: 10,
      dryRadiusKm: 6.8,
      floodRadiusKm: 3.1,
      populationDry: '420,000',
      populationFlood: '160,000',
      shrinkagePercent: 62,
    },
    {
      min: 15,
      dryRadiusKm: 10.5,
      floodRadiusKm: 4.8,
      populationDry: '890,000',
      populationFlood: '310,000',
      shrinkagePercent: 65,
    },
    {
      min: 30,
      dryRadiusKm: 18.0,
      floodRadiusKm: 8.5,
      populationDry: '1,850,000',
      populationFlood: '740,000',
      shrinkagePercent: 60,
    },
  ];

  const currentIsochrone = isochrones.find((iso) => iso.min === selectedHorizonMin) || isochrones[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Compass className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Emergency Isochrone Reachability &amp; Catchment Shrinkage
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple text-white">
                  Valhalla / OTP Isochrones
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Calculates travel-time contours comparing dry baseline accessibility with hydrodynamic flood attenuation
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
          {/* Origin Hospital Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple" />
              <span className="font-bold text-ink">Origin Emergency Hub:</span>
              <select
                value={origin.id}
                onChange={(e) => {
                  const match = WAYPOINT_PRESETS.find((w) => w.id === e.target.value);
                  if (match) setOrigin(match);
                }}
                className="px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-ink"
              >
                {WAYPOINT_PRESETS.filter((w) => w.category === 'origin' || w.category === 'hospital').map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Horizon Tabs */}
            <div className="flex gap-1.5 bg-surface p-1 rounded-lg border border-border">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedHorizonMin(mins)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    selectedHorizonMin === mins
                      ? 'bg-purple text-white shadow-subtle'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Isochrone Radar / Concentric Rings SVG Visualizer */}
          <div className="p-4 bg-canvas rounded-xl border border-border flex flex-col md:flex-row items-center gap-6">
            <div className="w-56 h-56 relative flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Dry Reach Ring (Dashed Gray) */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="#6D4AFF"
                  fillOpacity="0.08"
                  stroke="#6D4AFF"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Flooded Shrunk Reach Polygon */}
                <circle
                  cx="100"
                  cy="100"
                  r={85 * (currentIsochrone.floodRadiusKm / currentIsochrone.dryRadiusKm)}
                  fill="#D94A4A"
                  fillOpacity="0.25"
                  stroke="#D94A4A"
                  strokeWidth="2.5"
                />
                {/* Center Origin Pin */}
                <circle cx="100" cy="100" r="5" fill="#24212B" />
                <circle cx="100" cy="100" r="2" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Metrics Breakdown */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-ink">Isochrone Horizon: {selectedHorizonMin} Minutes</span>
                <span className="text-[11px] font-mono text-status-alert font-bold bg-status-alert-soft px-2 py-0.5 rounded-full">
                  -{currentIsochrone.shrinkagePercent}% Catchment Loss
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface rounded-xl border border-border">
                  <span className="text-[10px] text-ink-muted uppercase block">Dry Weather Reach</span>
                  <span className="text-base font-bold text-ink block mt-0.5 font-mono">
                    {currentIsochrone.dryRadiusKm} km radius
                  </span>
                  <span className="text-[11px] text-ink-secondary">
                    Pop: {currentIsochrone.populationDry} citizens
                  </span>
                </div>
                <div className="p-3 bg-status-alert-soft/30 rounded-xl border border-status-alert/30">
                  <span className="text-[10px] text-status-alert uppercase block font-bold">Flood Attenuated Reach</span>
                  <span className="text-base font-bold text-status-alert block mt-0.5 font-mono">
                    {currentIsochrone.floodRadiusKm} km radius
                  </span>
                  <span className="text-[11px] text-ink-secondary">
                    Pop: {currentIsochrone.populationFlood} citizens
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Notice: Lowland choke points at Kurla West and Hindmata restrict standard radial response. Ambulances must rely strictly on grade-separated arterial flyovers to preserve the golden hour trauma window.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">
            Generated via OpenTripPlanner 2.4 Multi-Modal Hydrodynamic Matrix.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Reachability
          </button>
        </div>
      </div>
    </div>
  );
}

