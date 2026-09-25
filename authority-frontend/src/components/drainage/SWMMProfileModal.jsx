import React, { useState } from 'react';
import { X, Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function SWMMProfileModal({ isOpen, onClose, selectedNode, onApplyHydraulics }) {
  // Interactive Hydraulic Parameters (unconditionally initialized)
  const [roughnessN, setRoughnessN] = useState(selectedNode?.manningN || 0.016);
  const [channelSlope, setChannelSlope] = useState(selectedNode?.slope || 0.0025);
  const [inflowQ, setInflowQ] = useState(selectedNode?.upstreamInflow || 16.8);
  const [conduitDiameter] = useState(selectedNode?.diameterM || 3.2);

  if (!isOpen || !selectedNode) return null;

  // Hydraulic Calculations (Manning's Equation & Saint-Venant 1D)
  // Box Culvert: Area = B * y, Hydraulic Radius R = (B * y) / (B + 2y)
  const B = conduitDiameter;
  const S_sqrt = Math.sqrt(Math.max(0.0001, channelSlope));
  const normalDepthM = Math.min(
    B * 1.2,
    Math.max(0.2, Math.pow((inflowQ * roughnessN) / (B * S_sqrt * 1.0), 0.6))
  );
  const wetArea = B * normalDepthM;
  const velocity = inflowQ / Math.max(0.1, wetArea);
  const g = 9.81;
  const froudeNumber = velocity / Math.sqrt(g * normalDepthM);
  
  // HGL and EGL calculations
  const invertElev = selectedNode.invertLevel;
  const crownElev = invertElev + B;
  const hglElev = invertElev + normalDepthM;
  const velocityHead = Math.pow(velocity, 2) / (2 * g);
  const eglElev = hglElev + velocityHead;
  const isSurcharged = hglElev >= crownElev;
  const freeboardM = Math.max(0, crownElev - hglElev);

  const handleApply = () => {
    if (onApplyHydraulics) {
      onApplyHydraulics({
        nodeId: selectedNode.id,
        roughnessN,
        channelSlope,
        inflowQ,
        velocity: velocity.toFixed(2),
        froudeNumber: froudeNumber.toFixed(2),
        isSurcharged,
        hglElev: hglElev.toFixed(2),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                1D Saint-Venant Dynamic Wave Cross-Section Profile
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple">
                  SWMM 5.2 ENGINE
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • Culvert Invert Level: {invertElev}m MSL
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Top Status & Regime Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Flow Velocity (V)</span>
              <span className="text-xl font-bold font-mono text-ink">{velocity.toFixed(2)} m/s</span>
              <span className="text-[10px] text-ink-secondary block mt-0.5">Self-cleaning &gt; 0.9 m/s</span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Froude Number (Fr)</span>
              <span className={`text-xl font-bold font-mono ${froudeNumber >= 1 ? 'text-status-alert' : 'text-purple'}`}>
                {froudeNumber.toFixed(2)}
              </span>
              <span className="text-[10px] text-ink-secondary block mt-0.5">
                {froudeNumber < 1 ? 'Subcritical Flow (Fr < 1)' : 'Supercritical Flow (Fr > 1)'}
              </span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Hydraulic Grade (HGL)</span>
              <span className="text-xl font-bold font-mono text-ink">{hglElev.toFixed(2)} m</span>
              <span className="text-[10px] text-ink-secondary block mt-0.5">EGL: {eglElev.toFixed(2)} m MSL</span>
            </div>
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block">Conduit State</span>
              <span className={`text-sm font-bold font-mono flex items-center gap-1.5 mt-1 ${isSurcharged ? 'text-status-alert' : 'text-status-safe'}`}>
                {isSurcharged ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                {isSurcharged ? 'SURCHARGED / PRESSURE' : `OPEN GRAVITY (${freeboardM.toFixed(2)}m Freeboard)`}
              </span>
            </div>
          </div>

          {/* Cross Section SVG Dynamic Visualization */}
          <div className="bg-canvas border border-border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex justify-between items-center text-xs font-mono text-ink-secondary mb-2">
              <span>Street Grade: +{selectedNode.surfaceElevation}m MSL</span>
              <span className="text-purple font-bold">Conduit Box: {B.toFixed(1)}m x {B.toFixed(1)}m</span>
              <span>Invert Level: +{invertElev}m MSL</span>
            </div>

            <svg viewBox="0 0 600 240" className="w-full max-h-56 bg-surface-secondary/40 rounded-lg border border-border">
              {/* Street Surface line */}
              <line x1="20" y1="20" x2="580" y2="20" stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />
              <text x="25" y="15" fill="#71717A" fontSize="10" fontFamily="monospace">Ground Surface (+{selectedNode.surfaceElevation}m)</text>

              {/* Box Culvert Outline */}
              <rect x="180" y="60" width="240" height="150" fill="#18181B" stroke="#A855F7" strokeWidth="3" rx="4" />
              <text x="185" y="55" fill="#A855F7" fontSize="10" fontFamily="monospace">Culvert Crown (+{crownElev.toFixed(2)}m)</text>
              <text x="185" y="225" fill="#71717A" fontSize="10" fontFamily="monospace">Culvert Invert (+{invertElev.toFixed(2)}m)</text>

              {/* Water Depth Level */}
              {(() => {
                const fillFraction = Math.min(1.0, normalDepthM / B);
                const waterHeight = fillFraction * 150;
                const waterY = 60 + (150 - waterHeight);
                return (
                  <>
                    <rect
                      x="182"
                      y={waterY}
                      width="236"
                      height={waterHeight}
                      fill={isSurcharged ? '#EF4444' : '#3B82F6'}
                      fillOpacity="0.55"
                    />
                    <line x1="182" y1={waterY} x2="418" y2={waterY} stroke={isSurcharged ? '#EF4444' : '#60A5FA'} strokeWidth="2.5" />
                    <text x="425" y={waterY + 4} fill={isSurcharged ? '#EF4444' : '#60A5FA'} fontSize="10" fontFamily="monospace">
                      Water Level: {normalDepthM.toFixed(2)}m ({(fillFraction * 100).toFixed(0)}%)
                    </text>
                  </>
                );
              })()}

              <line x1="40" y1="90" x2="560" y2="90" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 3" />
              <text x="460" y="85" fill="#EC4899" fontSize="10" fontFamily="monospace">HGL Line (+{hglElev.toFixed(2)}m)</text>
            </svg>
          </div>

          {/* Interactive Hydraulic Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-secondary p-4 rounded-xl border border-border">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-ink font-semibold">Manning's Roughness (n):</span>
                <span className="text-purple font-bold">{roughnessN}</span>
              </div>
              <input
                type="range"
                min="0.010"
                max="0.025"
                step="0.001"
                value={roughnessN}
                onChange={(e) => setRoughnessN(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Smooth Concrete (0.012) to Silted (0.022)</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-ink font-semibold">Inflow Discharge (Q):</span>
                <span className="text-purple font-bold">{inflowQ} m³/s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="35.0"
                step="0.5"
                value={inflowQ}
                onChange={(e) => setInflowQ(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Peak storm run-off into junction</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-ink font-semibold">Bed Slope (S₀):</span>
                <span className="text-purple font-bold">{(channelSlope * 1000).toFixed(1)} ‰</span>
              </div>
              <input
                type="range"
                min="0.0005"
                max="0.0080"
                step="0.0005"
                value={channelSlope}
                onChange={(e) => setChannelSlope(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Gradient towards outfall</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <button
            onClick={() => {
              setRoughnessN(0.016);
              setChannelSlope(0.0025);
              setInflowQ(selectedNode?.upstreamInflow || 16.8);
            }}
            className="px-3 py-1.5 rounded-lg border border-border text-xs text-ink-secondary hover:text-ink hover:bg-surface flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-ink hover:bg-surface">
              Cancel
            </button>
            <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-purple text-white hover:bg-purple-deep text-xs font-semibold shadow-subtle flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Apply Dynamic Parameters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
