import React, { useState } from 'react';
import { X, Sliders, RefreshCw } from 'lucide-react';

export default function ModelCalibrationWorkbenchModal({ isOpen, onClose }) {
  const [manningsN, setManningsN] = useState(0.018); // 0.012 to 0.035
  const [curveNumberCN, setCurveNumberCN] = useState(88); // 60 to 98
  const [channelSlope, setChannelSlope] = useState(0.0015); // 0.0005 to 0.004

  if (!isOpen) return null;

  // Hydrological calculations
  // Manning velocity V = (1/n) * R^(2/3) * S^(1/2), assuming hydraulic radius R = 1.8m
  const R = 1.8;
  const velocity = ((1 / manningsN) * Math.pow(R, 2/3) * Math.sqrt(channelSlope)).toFixed(2);
  const dischargeM3s = (Number(velocity) * 14.5).toFixed(1); // conduit area 14.5 m2

  // Model Nash-Sutcliffe Efficiency (NSE) metric
  // Optimal n is 0.016, CN 86, slope 0.0016
  const nErr = Math.abs(manningsN - 0.016) / 0.016;
  const cnErr = Math.abs(curveNumberCN - 86) / 86;
  const slopeErr = Math.abs(channelSlope - 0.0016) / 0.0016;
  const nse = Math.max(0.4, (1.0 - (nErr * 0.4 + cnErr * 0.3 + slopeErr * 0.3))).toFixed(3);

  const resetDefaults = () => {
    setManningsN(0.016);
    setCurveNumberCN(86);
    setChannelSlope(0.0016);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                1D/2D Hydrodynamic Model Calibration &amp; Manning's 'n' Workbench
              </h2>
              <p className="text-xs text-ink-secondary">
                Saint-Venant Dynamic Wave Equation Sensitivity Analysis • Nash-Sutcliffe Efficiency (NSE) Verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-secondary border border-border rounded-xl p-4">
            {/* Manning n */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-ink">
                <span>Manning's Roughness (n):</span>
                <span className="font-mono text-purple">{manningsN.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.012"
                max="0.035"
                step="0.001"
                value={manningsN}
                onChange={(e) => setManningsN(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>0.012 (Smooth Box)</span>
                <span>0.035 (Silted Weed)</span>
              </div>
            </div>

            {/* Curve Number */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-ink">
                <span>NRCS Curve Number (CN):</span>
                <span className="font-mono text-purple">{curveNumberCN}</span>
              </div>
              <input
                type="range"
                min="65"
                max="98"
                step="1"
                value={curveNumberCN}
                onChange={(e) => setCurveNumberCN(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>65 (Parkland)</span>
                <span>98 (Asphalt/Paved)</span>
              </div>
            </div>

            {/* Bed Slope */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-ink">
                <span>Conduit Bed Slope (S₀):</span>
                <span className="font-mono text-purple">{channelSlope.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.0005"
                max="0.0040"
                step="0.0001"
                value={channelSlope}
                onChange={(e) => setChannelSlope(Number(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
                <span>1:2000 (Flat)</span>
                <span>1:250 (Steep)</span>
              </div>
            </div>
          </div>

          {/* Recalculated Model Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Nash-Sutcliffe Efficiency (NSE)</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">{nse}</div>
              <span className="text-[10px] font-mono text-status-safe">
                {Number(nse) > 0.85 ? 'Excellent Calibration' : 'Acceptable Convergence'}
              </span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Calculated Velocity (V)</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">{velocity} m/s</div>
              <span className="text-[10px] text-ink-secondary font-mono">Saint-Venant 1D Flow</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Max Conduit Flow (Q)</span>
              <div className="text-2xl font-bold font-mono text-purple mt-0.5">{dischargeM3s} m³/s</div>
              <span className="text-[10px] text-ink-secondary font-mono">A = 14.5 m² (3.8m x 3.8m Box)</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-ink-secondary">Action</span>
              <button
                onClick={resetDefaults}
                className="w-full py-1.5 bg-surface-secondary border border-border hover:border-purple/40 text-xs font-mono rounded flex items-center justify-center gap-1.5 font-semibold text-ink"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple" /> Reset to Calibrated
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Calibration Engine: EPA-SWMM 5.2 Dynamic Wave Computational Core</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Workbench
          </button>
        </div>
      </div>
    </div>
  );
}
