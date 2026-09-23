import React, { useState } from 'react';
import { X, Activity } from 'lucide-react';

export default function InundationHydrographModal({ isOpen, onClose }) {
  const [selectedJunction, setSelectedJunction] = useState('andheri');

  if (!isOpen) return null;

  const JUNCTIONS = {
    'andheri': {
      name: 'Andheri Subway (SV Road Underpass)',
      baselinePeakCm: 88,
      baselineDrainH: 4.8,
      currentPeakCm: 42,
      currentDrainH: 1.6,
      interventions: '2,500 m³/h high-head dewatering station + Mogra training',
      curveBaseline: [0, 8, 28, 65, 88, 85, 74, 58, 42, 28, 14, 0],
      curveRemediated: [0, 6, 18, 38, 42, 34, 20, 8, 2, 0, 0, 0],
    },
    'milan': {
      name: 'Milan Subway (Santacruz)',
      baselinePeakCm: 78,
      baselineDrainH: 4.2,
      currentPeakCm: 32,
      currentDrainH: 1.2,
      interventions: '30,000 m³ underground retention reservoir + automated sump pumps',
      curveBaseline: [0, 10, 32, 60, 78, 72, 60, 45, 30, 18, 8, 0],
      curveRemediated: [0, 8, 20, 30, 32, 24, 12, 4, 0, 0, 0, 0],
    },
    'sion': {
      name: 'Sion East Circle & Rail Junction',
      baselinePeakCm: 68,
      baselineDrainH: 3.8,
      currentPeakCm: 28,
      currentDrainH: 1.4,
      interventions: 'Sion holding tank Phase 1 + 4x 1,200 m³/h diesel dewatering skid',
      curveBaseline: [0, 6, 22, 50, 68, 64, 52, 38, 24, 14, 6, 0],
      curveRemediated: [0, 5, 14, 25, 28, 22, 10, 2, 0, 0, 0, 0],
    },
    'hindmata': {
      name: 'Hindmata Flyover Underbelly (Dadar)',
      baselinePeakCm: 76,
      baselineDrainH: 4.5,
      currentPeakCm: 18,
      currentDrainH: 0.8,
      interventions: '105,000 m³ twin underground holding reservoirs at Pramod Mahajan Park',
      curveBaseline: [0, 12, 35, 62, 76, 70, 58, 42, 28, 16, 8, 0],
      curveRemediated: [0, 4, 10, 16, 18, 12, 4, 0, 0, 0, 0, 0],
    }
  };

  const current = JUNCTIONS[selectedJunction];
  const timeLabels = ['T+0h', 'T+30m', 'T+1h', 'T+1.5h', 'T+2h', 'T+2.5h', 'T+3h', 'T+3.5h', 'T+4h', 'T+4.5h', 'T+5h', 'T+6h'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Inundation Depth Hydrograph Temporal Lag &amp; Recession Animator
              </h2>
              <p className="text-xs text-ink-secondary">
                Comparative Hydrographs: Historical Baseline vs Post-Mitigation Recession Curves ($T_p$ &amp; $T_d$)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Junction Tabs */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {Object.keys(JUNCTIONS).map(key => (
            <button
              key={key}
              onClick={() => setSelectedJunction(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                selectedJunction === key
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {JUNCTIONS[key].name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Metrics Comparison */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Pre-Mitigation Peak Depth</span>
              <div className="text-2xl font-bold font-mono text-status-alert mt-0.5">{current.baselinePeakCm} cm</div>
              <span className="text-[10px] text-ink-secondary font-mono">Uncontrolled ponding</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Post-Mitigation Peak Depth</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">{current.currentPeakCm} cm</div>
              <span className="text-[10px] text-status-safe font-mono font-bold">
                -{Math.round((1 - current.currentPeakCm / current.baselinePeakCm) * 100)}% Depth Attenuation
              </span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Drainage Lag Time (Td)</span>
              <div className="text-2xl font-bold font-mono text-purple mt-0.5">{current.baselineDrainH}h → {current.currentDrainH}h</div>
              <span className="text-[10px] text-purple font-mono">
                {Math.round((1 - current.currentDrainH / current.baselineDrainH) * 100)}% Faster Clearance
              </span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Installed Remediation</span>
              <div className="text-xs font-bold text-ink mt-1 leading-snug">{current.interventions}</div>
            </div>
          </div>

          {/* SVG Comparative Hydrograph */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Temporal Waterlogging Recession Hydrograph
              </h4>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-status-alert block" />
                  <span className="text-status-alert">Historical Baseline (Pre-Works)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-purple block" />
                  <span className="text-purple font-bold">Current Engineered System</span>
                </div>
              </div>
            </div>

            <div className="w-full h-64 relative bg-surface-subtle border border-border rounded-lg p-3">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Horizontal Grid */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="40" y1="175" x2="480" y2="175" stroke="#CBC7D6" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="175" stroke="#CBC7D6" strokeWidth="1" />

                {/* Y labels */}
                <text x="35" y="24" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">100cm</text>
                <text x="35" y="64" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">75cm</text>
                <text x="35" y="104" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">50cm</text>
                <text x="35" y="144" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">25cm</text>
                <text x="35" y="178" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">0cm</text>

                {/* Baseline Line */}
                {(() => {
                  const pts = current.curveBaseline.map((val, idx) => {
                    const x = 40 + (idx / (current.curveBaseline.length - 1)) * 440;
                    const y = 175 - (val / 100) * 155;
                    return `${x},${y}`;
                  }).join(' L ');
                  return <path d={`M ${pts}`} fill="none" stroke="#D94A4A" strokeWidth="2.5" strokeDasharray="4 2" />;
                })()}

                {/* Remediated Line */}
                {(() => {
                  const pts = current.curveRemediated.map((val, idx) => {
                    const x = 40 + (idx / (current.curveRemediated.length - 1)) * 440;
                    const y = 175 - (val / 100) * 155;
                    return `${x},${y}`;
                  }).join(' L ');
                  return <path d={`M ${pts}`} fill="none" stroke="#6D4AFF" strokeWidth="3" />;
                })()}

                {/* X labels */}
                {timeLabels.map((lbl, idx) => {
                  const x = 40 + (idx / (timeLabels.length - 1)) * 440;
                  return (
                    <text key={idx} x={x} y="190" fill="#706B78" textAnchor="middle" className="text-[8px] font-mono">
                      {lbl}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Ultrasonic Level Sensor Telemetry Corroboration</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Hydrograph
          </button>
        </div>
      </div>
    </div>
  );
}
