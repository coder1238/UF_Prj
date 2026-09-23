import React, { useState } from 'react';
import { X, CloudRain, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RunoffHydrographModal({ isOpen, onClose, selectedNode }) {
  const [returnPeriod, setReturnPeriod] = useState(10); // 2, 5, 10, 25, 50, 100 years
  const [catchmentAreaHa, setCatchmentAreaHa] = useState(selectedNode?.catchmentAreaHa || 120);
  const [runoffC, setRunoffC] = useState(selectedNode?.runoffCoeff || 0.82);
  const [timeOfConcMin, setTimeOfConcMin] = useState(25);

  if (!isOpen || !selectedNode) return null;

  // IDF Empirical formula for Mumbai: I = a / (t + b)^c
  const idfParams = {
    2: 55,
    5: 75,
    10: 95,
    25: 120,
    50: 145,
    100: 175,
  };
  const rainfallIntensityMmHr = idfParams[returnPeriod] || 95;

  // Rational Formula: Q = (C * I * A) / 360  (Q in m3/s, A in hectares, I in mm/hr)
  const peakDischargeQ = (runoffC * rainfallIntensityMmHr * catchmentAreaHa) / 360;
  const conduitCapacity = parseFloat(selectedNode.maxFlow) || 14.2;
  const isOverCapacity = peakDischargeQ > conduitCapacity;
  const deficitRatio = ((peakDischargeQ / conduitCapacity) * 100).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Sub-Catchment Runoff Hydrograph &amp; IDF Synthesis
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold">
                  RATIONAL / SCS-CN MODEL
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • {selectedNode.ward} Drainage Basin
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Return Period Selector */}
          <div className="flex items-center justify-between bg-surface-secondary p-3 rounded-xl border border-border">
            <span className="text-xs font-semibold text-ink">Design Return Period (Storm Frequency):</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {[2, 5, 10, 25, 50, 100].map((rp) => (
                <button
                  key={rp}
                  onClick={() => setReturnPeriod(rp)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    returnPeriod === rp
                      ? 'bg-purple text-white border-purple font-bold'
                      : 'bg-surface text-ink border-border hover:bg-surface-secondary'
                  }`}
                >
                  {rp}-YR
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-ink-secondary">Catchment Area (A):</span>
                <span className="text-purple font-bold">{catchmentAreaHa} Ha</span>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                step="5"
                value={catchmentAreaHa}
                onChange={(e) => setCatchmentAreaHa(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-ink-secondary">Runoff Coeff (C):</span>
                <span className="text-purple font-bold">{runoffC.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.40"
                max="0.95"
                step="0.02"
                value={runoffC}
                onChange={(e) => setRunoffC(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Urban Impervious: 0.80 - 0.90</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-ink-secondary">Time of Conc (Tc):</span>
                <span className="text-purple font-bold">{timeOfConcMin} min</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={timeOfConcMin}
                onChange={(e) => setTimeOfConcMin(parseInt(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Overland + pipe travel time</span>
            </div>
          </div>

          {/* Peak Hydrograph Output Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Rainfall Intensity</span>
              <span className="text-lg font-bold font-mono text-blue-500">{rainfallIntensityMmHr} mm/hr</span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Peak Inflow (Qpeak)</span>
              <span className={`text-lg font-bold font-mono ${isOverCapacity ? 'text-status-alert' : 'text-status-safe'}`}>
                {peakDischargeQ.toFixed(2)} m³/s
              </span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Conduit Capacity</span>
              <span className="text-lg font-bold font-mono text-purple">{conduitCapacity} m³/s</span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Capacity Ratio</span>
              <span className={`text-lg font-bold font-mono ${isOverCapacity ? 'text-status-alert' : 'text-status-safe'}`}>
                {deficitRatio}%
              </span>
            </div>
          </div>

          {/* SVG Inflow Hydrograph vs Conduit Capacity */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-ink font-semibold">Triangular Synthetic Inflow Hydrograph:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-3 h-0.5 bg-blue-500 inline-block" /> Inflow Q(t)
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-3 h-0.5 bg-red-500 inline-block stroke-dasharray" /> Max Conduit Cap ({conduitCapacity} m³/s)
                </span>
              </div>
            </div>

            <svg viewBox="0 0 600 200" className="w-full max-h-52 bg-surface-secondary/40 rounded-lg border border-border">
              {/* Axes */}
              <line x1="40" y1="170" x2="570" y2="170" stroke="#52525B" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="#52525B" strokeWidth="1" />

              {/* Grid lines */}
              <line x1="40" y1="120" x2="570" y2="120" stroke="#27272A" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="570" y2="70" stroke="#27272A" strokeDasharray="3 3" />

              {/* Conduit Capacity Line */}
              {(() => {
                const maxPlotQ = Math.max(30, peakDischargeQ * 1.25);
                const capY = 170 - (conduitCapacity / maxPlotQ) * 140;
                const peakY = 170 - (peakDischargeQ / maxPlotQ) * 140;
                const peakX = 40 + (timeOfConcMin / 120) * 500;
                return (
                  <>
                    <line x1="40" y1={capY} x2="570" y2={capY} stroke="#EF4444" strokeWidth="2" strokeDasharray="6 3" />
                    <text x="45" y={capY - 6} fill="#EF4444" fontSize="10" fontFamily="monospace">
                      Max Conduit Capacity ({conduitCapacity} m³/s)
                    </text>

                    {/* Hydrograph Polygon */}
                    <polygon
                      points={`40,170 ${peakX},${peakY} ${peakX + 220},170`}
                      fill="#3B82F6"
                      fillOpacity="0.4"
                    />
                    <polyline
                      points={`40,170 ${peakX},${peakY} ${peakX + 220},170`}
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="2.5"
                    />

                    {/* Peak Dot */}
                    <circle cx={peakX} cy={peakY} r="4" fill="#60A5FA" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={peakX - 30} y={peakY - 10} fill="#60A5FA" fontSize="10" fontFamily="monospace">
                      Peak: {peakDischargeQ.toFixed(1)} m³/s (t={timeOfConcMin}m)
                    </text>
                  </>
                );
              })()}

              {/* Time Axis Labels */}
              <text x="40" y="185" fill="#71717A" fontSize="9" fontFamily="monospace">0m</text>
              <text x="165" y="185" fill="#71717A" fontSize="9" fontFamily="monospace">30m</text>
              <text x="290" y="185" fill="#71717A" fontSize="9" fontFamily="monospace">60m</text>
              <text x="415" y="185" fill="#71717A" fontSize="9" fontFamily="monospace">90m</text>
              <text x="540" y="185" fill="#71717A" fontSize="9" fontFamily="monospace">120m</text>
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            {isOverCapacity ? (
              <span className="text-status-alert font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Hydraulic Deficit: Inflow exceeds box capacity by {(peakDischargeQ - conduitCapacity).toFixed(1)} m³/s!
              </span>
            ) : (
              <span className="text-status-safe font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Adequate Freeboard: Conduit absorbs 100% of peak runoff.
              </span>
            )}
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Hydrograph
          </button>
        </div>
      </div>
    </div>
  );
}

