import React, { useState } from 'react';
import { X, GitBranch } from 'lucide-react';

export default function MicroTunnelBypassModal({ isOpen, onClose, selectedNode: _selectedNode, onApplyBypass, showToast }) {
  const [bypassActive, setBypassActive] = useState(false);
  const [diversionFlowM3s, setDiversionFlowM3s] = useState(18.5); // m3/s

  if (!isOpen) return null;

  const handleToggleBypass = () => {
    const newState = !bypassActive;
    setBypassActive(newState);
    if (onApplyBypass) {
      onApplyBypass(newState ? diversionFlowM3s : 0);
    }
    showToast(
      newState
        ? `DEEP TUNNEL ACTIVATED: Diverting ${diversionFlowM3s} m³/s to Mahim Deep Sea Outfall!`
        : 'Deep Tunnel Bypass closed. Returning to surface network.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Deep Micro-Tunneling Stormwater Diversion Planner
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  BRIMSTOWAD II DEEP CORRIDOR
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Sub-Basement Ø 5.5m Slurry-Shield Tunnel Invert at -18.0m MSL
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Tunnel Scheme Specs */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-ink block">Kurla-Dharavi-Mahim Deep Stormwater Artery</span>
              <p className="text-[11px] text-ink-secondary font-sans mt-0.5">
                Length: 6.4 km • Diameter: 5,500 mm • Gradient: 1:800 toward Mahim Bay Outfall
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                bypassActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-canvas text-ink-secondary border border-border'
              }`}
            >
              {bypassActive ? 'BYPASS ACTIVE (DIVERTLNG)' : 'GATE SEALED (STANDBY)'}
            </span>
          </div>

          {/* Cross Profile Diagram */}
          <div className="bg-canvas border border-border rounded-xl p-4 text-center">
            <svg viewBox="0 0 600 180" className="w-full max-h-48 bg-surface-secondary/40 rounded-lg border border-border">
              {/* Ground Surface */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />
              <text x="25" y="24" fill="#71717A" fontSize="9" fontFamily="monospace">Street Grade (+6.2m MSL)</text>

              {/* Surface Shallow Drain */}
              <rect x="40" y="45" width="120" height="30" fill="#27272A" stroke="#71717A" />
              <text x="45" y="40" fill="#71717A" fontSize="9" fontFamily="monospace">Shallow Box Drain D-204</text>

              {/* Vertical Drop Vortex Shaft */}
              <rect x="180" y="45" width="40" height="90" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
              <text x="140" y="95" fill="#A855F7" fontSize="9" fontFamily="monospace" transform="rotate(-90 140,95)">Vortex Drop Shaft</text>

              {/* Deep Tunnel at -18m */}
              <rect x="180" y="130" width="380" height="35" fill={bypassActive ? '#10B981' : '#27272A'} fillOpacity={bypassActive ? 0.4 : 1} stroke="#10B981" strokeWidth="2" rx="4" />
              <text x="260" y="152" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                Deep Tunnel Artery (-18m MSL) {bypassActive ? '>>> 18.5 m³/s FLOW' : '(Empty)'}
              </text>
            </svg>
          </div>

          {/* Diversion Rate Slider & Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-secondary">Vortex Intake Gate Flow:</span>
                <span className="text-purple font-bold">{diversionFlowM3s} m³/s</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={diversionFlowM3s}
                onChange={(e) => setDiversionFlowM3s(parseFloat(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary">Max intake capacity: 50.0 m³/s</span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-ink-secondary uppercase">Hydraulic Relief on Surface Junctions:</span>
              <div className="text-lg font-bold text-emerald-500">
                {bypassActive ? '-42% Surcharge Reduction' : '0% Relief (Inactive)'}
              </div>
              <button
                onClick={handleToggleBypass}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                  bypassActive
                    ? 'bg-status-alert text-white hover:bg-red-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {bypassActive ? 'Deactivate Deep Tunnel Bypass' : 'Engage Deep Micro-Tunnel Diverter'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Tunnel Planner
          </button>
        </div>
      </div>
    </div>
  );
}

