import React, { useState } from 'react';
import { X, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function IDFCurveAnalyzerModal({ isOpen, onClose }) {
  const [selectedDuration, setSelectedDuration] = useState(60); // minutes (15, 30, 60, 120, 360, 1440)
  const [customIntensity, setCustomIntensity] = useState(85); // mm/h

  if (!isOpen) return null;

  // Standard Mumbai IDF formula coefficients: I = (c * T^m) / (t + d)^n
  // Durations in minutes: 15, 30, 60, 120, 360, 720, 1440
  const DURATIONS = [15, 30, 60, 120, 240, 360, 720, 1440];
  const RETURN_PERIODS = [
    { label: '2-Year Return', T: 2, color: '#3B8F67' },
    { label: '5-Year Return', T: 5, color: '#C58A25' },
    { label: '10-Year Return', T: 10, color: '#6D4AFF' },
    { label: '25-Year Return', T: 25, color: '#9B51E0' },
    { label: '50-Year Return (BRIMSTOWAD Standard)', T: 50, color: '#D94A4A' },
    { label: '100-Year Extreme', T: 100, color: '#A81E1E' },
  ];

  // Calculate intensity in mm/hr for given T (years) and t (minutes)
  const calculateIntensity = (T, t) => {
    // Empirical fit for MMR: I = (740 * T^0.22) / (t + 18)^0.72
    const num = 740 * Math.pow(T, 0.22);
    const den = Math.pow(t + 18, 0.72);
    return Math.round(num / den);
  };

  // Estimate return period for custom intensity & duration
  // T = [ (I * (t+18)^0.72) / 740 ] ^ (1/0.22)
  const estimatedReturnPeriod = Math.max(
    1,
    Math.round(Math.pow((customIntensity * Math.pow(selectedDuration + 18, 0.72)) / 740, 1 / 0.22))
  );

  const brimstowad50YrIntensity = calculateIntensity(50, selectedDuration);
  const isExceedingDesign = customIntensity > brimstowad50YrIntensity;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Rainfall Intensity-Duration-Frequency (IDF) Return Period Workbench
              </h2>
              <p className="text-xs text-ink-secondary">
                Hydrological Gumbel Extreme Value Analysis • BRIMSTOWAD 50-Year Drainage Design Standard
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-surface-secondary border border-border rounded-xl p-4">
            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Storm Duration (t):</span>
                <span className="font-mono text-purple">{selectedDuration} mins ({selectedDuration / 60 >= 1 ? `${selectedDuration / 60}h` : ''})</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`px-2 py-1 rounded text-[11px] font-mono border ${
                      selectedDuration === d
                        ? 'bg-purple text-white border-purple font-bold'
                        : 'bg-surface text-ink border-border hover:border-purple/30'
                    }`}
                  >
                    {d < 60 ? `${d}m` : `${d / 60}h`}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Observed Storm Intensity:</span>
                <span className="font-mono text-status-alert">{customIntensity} mm/h</span>
              </label>
              <input
                type="range"
                min="10"
                max="160"
                step="5"
                value={customIntensity}
                onChange={(e) => setCustomIntensity(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>10 mm/h</span>
                <span>80 mm/h</span>
                <span>160 mm/h</span>
              </div>
            </div>

            <div className="md:col-span-4 bg-surface border border-border rounded-lg p-3 flex flex-col justify-center">
              <div className="text-[11px] font-mono text-ink-secondary">Calculated Return Period (T):</div>
              <div className="text-xl font-bold font-mono text-ink flex items-baseline gap-2 mt-0.5">
                <span className={estimatedReturnPeriod > 50 ? 'text-status-alert' : 'text-purple'}>
                  1 in {estimatedReturnPeriod} Years
                </span>
              </div>
              <div className="text-[11px] mt-1 flex items-center gap-1 font-mono">
                {isExceedingDesign ? (
                  <span className="text-status-alert flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Exceeds 50-Yr Design
                  </span>
                ) : (
                  <span className="text-status-safe flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Within 50-Yr Capacity
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SVG IDF Curve Canvas */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Logarithmic Intensity-Duration-Frequency Curves
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                {RETURN_PERIODS.map(rp => (
                  <div key={rp.T} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rp.color }} />
                    <span className="text-ink-secondary">{rp.T}y</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-64 relative bg-surface-subtle border border-border rounded-lg p-3">
              <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                {/* Grid */}
                <line x1="45" y1="20" x2="480" y2="20" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="45" y1="65" x2="480" y2="65" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="45" y1="110" x2="480" y2="110" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="45" y1="155" x2="480" y2="155" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="45" y1="195" x2="480" y2="195" stroke="#CBC7D6" strokeWidth="1" />
                <line x1="45" y1="20" x2="45" y2="195" stroke="#CBC7D6" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="40" y="24" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">150mm/h</text>
                <text x="40" y="69" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">100mm/h</text>
                <text x="40" y="114" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">50mm/h</text>
                <text x="40" y="159" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">25mm/h</text>
                <text x="40" y="198" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">0mm/h</text>

                {/* X-axis labels */}
                <text x="45" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">15m</text>
                <text x="110" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">30m</text>
                <text x="180" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">1h</text>
                <text x="260" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">2h</text>
                <text x="340" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">6h</text>
                <text x="420" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">12h</text>
                <text x="475" y="208" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">24h</text>

                {/* Render Return Period Curves */}
                {RETURN_PERIODS.map((rp) => {
                  const pts = DURATIONS.map((d, idx) => {
                    const intensity = calculateIntensity(rp.T, d);
                    const x = 45 + (idx / (DURATIONS.length - 1)) * 430;
                    const y = 195 - (intensity / 150) * 175;
                    return `${x},${y}`;
                  }).join(' L ');

                  return (
                    <path
                      key={rp.T}
                      d={`M ${pts}`}
                      fill="none"
                      stroke={rp.color}
                      strokeWidth={rp.T === 50 ? '3' : '1.8'}
                      strokeDasharray={rp.T === 50 ? '4 2' : 'none'}
                    />
                  );
                })}

                {/* Active probe point */}
                {(() => {
                  const durationIdx = DURATIONS.indexOf(selectedDuration);
                  const activeX = durationIdx !== -1 ? 45 + (durationIdx / (DURATIONS.length - 1)) * 430 : 180;
                  const activeY = 195 - (Math.min(150, customIntensity) / 150) * 175;
                  return (
                    <g>
                      <circle cx={activeX} cy={activeY} r="6" fill="#D94A4A" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1={activeX} y1="20" x2={activeX} y2="195" stroke="#D94A4A" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Tabular Return Period Matrix */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 overflow-x-auto">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Intensity Matrix by Duration &amp; Return Period (mm/h)
            </h4>
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-border text-ink-secondary">
                  <th className="py-1.5 px-2">Return Period</th>
                  {DURATIONS.map(d => (
                    <th key={d} className="py-1.5 px-2 text-right">{d < 60 ? `${d}m` : `${d / 60}h`}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RETURN_PERIODS.map(rp => (
                  <tr key={rp.T} className={rp.T === 50 ? 'bg-purple-soft/40 font-bold' : ''}>
                    <td className="py-1.5 px-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rp.color }} />
                      <span>{rp.label}</span>
                    </td>
                    {DURATIONS.map(d => (
                      <td key={d} className="py-1.5 px-2 text-right text-ink">
                        {calculateIntensity(rp.T, d)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Design Standard: MCGM BRIMSTOWAD 50-Year Recurrence Baseline</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Workbench
          </button>
        </div>
      </div>
    </div>
  );
}

