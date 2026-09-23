import React, { useState } from 'react';
import { X, Waves } from 'lucide-react';

export default function CompoundTidalFloodModal({ isOpen, onClose }) {
  const [selectedRainRate, setSelectedRainRate] = useState(65);
  const [selectedTideHeight, setSelectedTideHeight] = useState(4.2);

  if (!isOpen) return null;

  // Rain brackets: 20, 40, 60, 80, 100, 120+ mm/h
  // Tide brackets: 2.0, 3.0, 3.8, 4.2, 4.6, 5.0m MSL
  const RAIN_LEVELS = [20, 40, 60, 80, 100, 120];
  const TIDE_LEVELS = [2.0, 3.0, 3.8, 4.2, 4.6, 5.0];

  // Helper to determine risk matrix score (0-100)
  const calculateCompoundRisk = (rain, tide) => {
    // Lockout occurs when tide > 3.8m
    const tideFactor = Math.max(0, (tide - 2.0) / 2.8) * 50;
    const rainFactor = (rain / 120) * 50;
    const compoundMultiplier = tide >= 3.8 && rain >= 50 ? 1.25 : 1.0;
    return Math.min(100, Math.round((tideFactor + rainFactor) * compoundMultiplier));
  };

  const currentScore = calculateCompoundRisk(selectedRainRate, selectedTideHeight);
  const isLockoutActive = selectedTideHeight >= 3.8;

  const getRiskClassification = (score) => {
    if (score < 30) return { label: 'LOW HAZARD', color: 'text-status-safe bg-status-safe-soft border-status-safe/30' };
    if (score < 60) return { label: 'MODERATE BACKPRESSURE', color: 'text-status-warning bg-status-warning-soft border-status-warning/30' };
    if (score < 80) return { label: 'SEVERE FLAP GATE LOCKOUT', color: 'text-status-alert bg-status-alert-soft border-status-alert/30' };
    return { label: 'CATASTROPHIC COMPOUND OVERFLOW', color: 'text-white bg-status-alert border-red-700' };
  };

  const riskClass = getRiskClassification(currentScore);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Compound Astronomical High Tide &amp; Cloudburst Hazard Matrix
              </h2>
              <p className="text-xs text-ink-secondary">
                Non-linear Interaction of Coastal Sea-Level Surge with Overland Pluvial Drainage (Mahim, Worli, Haji Ali Outfalls)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Sliders and Score Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-ink flex justify-between">
                <span>Rainfall Intensity:</span>
                <span className="font-mono text-purple">{selectedRainRate} mm/h</span>
              </label>
              <input
                type="range"
                min="10"
                max="140"
                step="5"
                value={selectedRainRate}
                onChange={(e) => setSelectedRainRate(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />

              <label className="text-xs font-bold text-ink flex justify-between pt-2">
                <span>Astronomical Tide Level:</span>
                <span className="font-mono text-status-alert">{selectedTideHeight.toFixed(2)}m MSL</span>
              </label>
              <input
                type="range"
                min="1.5"
                max="5.2"
                step="0.1"
                value={selectedTideHeight}
                onChange={(e) => setSelectedTideHeight(Number(e.target.value))}
                className="w-full accent-status-alert cursor-pointer"
              />

              <div className="text-[11px] font-mono text-ink-secondary pt-1">
                Critical Flap Gate Shut Threshold: <strong className="text-status-alert">&ge; 3.80m MSL</strong>
              </div>
            </div>

            <div className="md:col-span-8 bg-surface border border-border rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono uppercase text-ink-secondary">Compound Hazard Index</span>
                  <div className="text-3xl font-extrabold font-mono text-ink mt-0.5">{currentScore} / 100</div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${riskClass.color}`}>
                  {riskClass.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-surface-secondary rounded-full overflow-hidden border border-border my-3">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${currentScore}%`,
                    backgroundColor: currentScore < 30 ? '#3B8F67' : currentScore < 60 ? '#C58A25' : '#D94A4A'
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2 bg-surface-secondary rounded-lg">
                  <span className="text-ink-secondary text-[10px]">Tidal Flap Gates</span>
                  <div className={`font-bold mt-0.5 ${isLockoutActive ? 'text-status-alert' : 'text-status-safe'}`}>
                    {isLockoutActive ? 'LOCKED CLOSED (No Gravity Drain)' : 'OPEN (Gravity Discharging)'}
                  </div>
                </div>
                <div className="p-2 bg-surface-secondary rounded-lg">
                  <span className="text-ink-secondary text-[10px]">Required Dewatering Protocol</span>
                  <div className="font-bold text-ink mt-0.5">
                    {currentScore > 70 ? '100% Pumping Station Power + Diesel Turbines' : 'Standard SCADA Sump Control'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2D Interactive Matrix Grid */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Compound Joint Hazard State Space (Click any cell to probe)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-ink-secondary text-left">Tide \ Rain</th>
                    {RAIN_LEVELS.map(r => (
                      <th key={r} className="p-2 text-ink">{r} mm/h</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIDE_LEVELS.slice().reverse().map(t => (
                    <tr key={t}>
                      <td className="p-2 font-bold text-ink-secondary text-left">{t.toFixed(1)}m MSL</td>
                      {RAIN_LEVELS.map(r => {
                        const score = calculateCompoundRisk(r, t);
                        let bg = 'bg-status-safe/10 text-status-safe border-status-safe/20';
                        if (score >= 40) bg = 'bg-status-warning/15 text-status-warning border-status-warning/30';
                        if (score >= 70) bg = 'bg-status-alert/20 text-status-alert border-status-alert/40 font-bold';
                        if (score >= 90) bg = 'bg-status-alert text-white font-extrabold';

                        const isSelected = selectedRainRate === r && Math.abs(selectedTideHeight - t) < 0.2;

                        return (
                          <td key={r} className="p-1">
                            <button
                              onClick={() => {
                                setSelectedRainRate(r);
                                setSelectedTideHeight(t);
                              }}
                              className={`w-full py-2 rounded border transition-all ${bg} ${
                                isSelected ? 'ring-2 ring-purple ring-offset-1 scale-105' : 'hover:scale-102'
                              }`}
                            >
                              {score}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Tidal Reference: Apollo Bunder Primary Tide Gauge Datum</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

