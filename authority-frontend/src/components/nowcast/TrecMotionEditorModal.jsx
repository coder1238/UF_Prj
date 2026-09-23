import React, { useState } from 'react';
import {
  X,
  Compass,
  Wind,
  Sliders,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Info,
} from 'lucide-react';

export default function TrecMotionEditorModal({
  isOpen,
  onClose,
  currentSpeed = 18.2,
  currentHeading = 42,
  onApplyWind,
}) {
  const [speed, setSpeed] = useState(currentSpeed);
  const [heading, setHeading] = useState(currentHeading);
  const [correlationCutoff, setCorrelationCutoff] = useState(0.75);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Compute recalculated ETAs based on speed and heading
  const SITES = [
    { name: 'Kurla Junction', baseDistKm: 14.5, directionDeg: 40 },
    { name: 'Sion East Circle', baseDistKm: 12.0, directionDeg: 35 },
    { name: 'Andheri Subway', baseDistKm: 21.0, directionDeg: 10 },
    { name: 'Bandra-Kurla Complex', baseDistKm: 11.2, directionDeg: 30 },
    { name: 'Dadar TT Circle', baseDistKm: 9.8, directionDeg: 25 },
  ];

  const siteETAs = SITES.map((site) => {
    // Relative angle offset
    const angleDiff = Math.abs(site.directionDeg - heading);
    // Effective transit speed component along radial
    const effectiveSpeed = Math.max(5, speed * Math.cos((angleDiff * Math.PI) / 180));
    const etaMinutes = Math.round((site.baseDistKm / effectiveSpeed) * 60);
    const directHit = angleDiff <= 25;
    return {
      ...site,
      etaMinutes,
      directHit,
    };
  });

  const handleApply = () => {
    setIsSaved(true);
    if (onApplyWind) {
      onApplyWind({ speed, heading, correlationCutoff });
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                TREC Storm Motion &amp; Steering Wind Vector Editor
              </h3>
              <p className="text-xs text-ink-secondary">
                Tracking Radar Echoes by Cross-Correlation • 850 hPa Atmospheric Advection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Controls: Heading & Speed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple" />
                  Steering Heading
                </span>
                <span className="font-mono text-xs font-bold text-purple bg-surface px-2 py-0.5 rounded border border-border">
                  {heading}° ({heading >= 20 && heading <= 70 ? 'NORTHEAST' : heading <= 20 || heading >= 340 ? 'NORTH' : 'EAST'})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={heading}
                onChange={(e) => setHeading(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>0° (N)</span>
                <span>90° (E)</span>
                <span>180° (S)</span>
                <span>270° (W)</span>
                <span>360° (N)</span>
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-purple" />
                  Advection Velocity
                </span>
                <span className="font-mono text-xs font-bold text-purple bg-surface px-2 py-0.5 rounded border border-border">
                  {speed.toFixed(1)} km/h
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>5 km/h (Stagnant)</span>
                <span>25 km/h (Moderate)</span>
                <span>60 km/h (Fast Squall)</span>
              </div>
            </div>
          </div>

          {/* Correlation Cutoff */}
          <div className="bg-surface-secondary border border-border rounded-xl p-3 flex justify-between items-center">
            <div>
              <div className="text-xs font-mono font-bold text-ink">TREC Cross-Correlation Threshold</div>
              <div className="text-[10px] text-ink-secondary">Discards spurious vectors below correlation score</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={correlationCutoff}
                onChange={(e) => setCorrelationCutoff(Number(e.target.value))}
                className="w-24 accent-purple h-1.5 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-purple">{correlationCutoff.toFixed(2)}</span>
            </div>
          </div>

          {/* Recalculated Downwind Arrival Times */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Recalculated Downwind Vulnerability Envelopes
            </span>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-secondary text-ink-secondary text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="p-2.5">Key Vulnerable Site</th>
                    <th className="p-2.5">Bearing</th>
                    <th className="p-2.5">Direct Trajectory</th>
                    <th className="p-2.5 text-right">Projected ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {siteETAs.map((site) => (
                    <tr key={site.name} className="hover:bg-surface-secondary/50">
                      <td className="p-2.5 font-semibold text-ink">{site.name}</td>
                      <td className="p-2.5 text-ink-secondary">{site.directionDeg}° ({site.baseDistKm}km)</td>
                      <td className="p-2.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            site.directHit
                              ? 'bg-status-alert-soft text-status-alert'
                              : 'bg-surface-secondary text-ink-secondary'
                          }`}
                        >
                          {site.directHit ? 'DIRECT IMPACT PATH' : 'PERIPHERAL SWEEP'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-purple">
                        +{site.etaMinutes} min (ETA ~18:{String(30 + site.etaMinutes).padStart(2, '0')} IST)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isSaved && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>TREC advection vectors applied to Doppler extrapolation pipeline!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Cross-correlation grid resolution: 500m × 500m
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Apply Wind Vectors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
