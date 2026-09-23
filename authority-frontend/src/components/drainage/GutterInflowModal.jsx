import React, { useState } from 'react';
import { X, Sliders, AlertTriangle } from 'lucide-react';

export default function GutterInflowModal({ isOpen, onClose, selectedNode, showToast }) {
  const [cloggedRatioPct, setCloggedRatioPct] = useState(65); // 0 to 90%
  const [grateType, setGrateType] = useState('curved-vane'); // curved-vane | p-50-bar | curb-opening
  const [streetFlowLps] = useState(140); // L/s

  if (!isOpen || !selectedNode) return null;

  // Interception efficiency E calculation
  const baseEfficiency = grateType === 'curved-vane' ? 0.92 : grateType === 'curved-opening' ? 0.75 : 0.85;
  const clogFactor = 1 - cloggedRatioPct / 100;
  const effectiveEfficiency = Math.max(0.05, baseEfficiency * clogFactor);
  const interceptedFlowLps = (streetFlowLps * effectiveEfficiency).toFixed(0);
  const bypassedFlowLps = (streetFlowLps - interceptedFlowLps).toFixed(0);

  const handleClearGrates = () => {
    setCloggedRatioPct(10);
    showToast(`Municipal Grate Clearance deployed at ${selectedNode.name}. Grate intake restored to 88%!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Urban Surface Gutter &amp; Grate Inflow Efficiency Calculator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  HEC-22 FHWA STANDARDS
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • Surface Runoff Grate Bypass &amp; Debris Clog Hydrodynamics
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Street Runoff Rate</span>
              <span className="text-lg font-bold text-ink">{streetFlowLps} L/s</span>
              <span className="text-[10px] text-ink-secondary block">Approaching inlet</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Captured Inflow</span>
              <span className="text-lg font-bold text-emerald-500">{interceptedFlowLps} L/s</span>
              <span className="text-[10px] text-ink-secondary block">Into underground pipe</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Surface Bypass</span>
              <span className="text-lg font-bold text-status-alert">{bypassedFlowLps} L/s</span>
              <span className="text-[10px] text-ink-secondary block">Flooding street surface</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Inflow Efficiency</span>
              <span className={`text-lg font-bold ${(effectiveEfficiency * 100) < 50 ? 'text-status-alert' : 'text-purple'}`}>
                {(effectiveEfficiency * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-ink-secondary block">Interception factor</span>
            </div>
          </div>

          {/* Grate Type Selector */}
          <div className="bg-surface-secondary p-3.5 rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs text-ink font-semibold">Street Inlet Grate Type:</span>
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'curved-vane', label: 'Curved Vane Grate' },
                { id: 'p-50-bar', label: 'Bar Grate (P-50)' },
                { id: 'curb-opening', label: 'Curb Opening Inlet' },
              ].map((gt) => (
                <button
                  key={gt.id}
                  onClick={() => setGrateType(gt.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    grateType === gt.id
                      ? 'bg-purple text-white border-purple font-bold'
                      : 'bg-surface text-ink border-border hover:bg-surface-secondary'
                  }`}
                >
                  {gt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clog Slider */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-ink font-semibold">Grate Debris &amp; Silt Clog Ratio:</span>
              <span className={`font-bold ${cloggedRatioPct > 50 ? 'text-status-alert' : 'text-emerald-500'}`}>
                {cloggedRatioPct}% Clogged by Plastic &amp; Leaves
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={cloggedRatioPct}
              onChange={(e) => setCloggedRatioPct(parseInt(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-ink-secondary pt-1">
              <span>0% (Clean Grate)</span>
              <span>45% (Moderate Obstruction)</span>
              <span>90% (Near Complete Blockage)</span>
            </div>
          </div>

          {/* Diagram showing street bypass flooding */}
          <div className="bg-surface-secondary p-4 rounded-xl border border-border text-xs text-ink-secondary space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Hydraulic Insight: Why Streets Flood While Pipes Are Half-Full</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed">
              When street grates are {cloggedRatioPct}% obstructed, <strong>{bypassedFlowLps} L/s</strong> of storm runoff cannot penetrate the drop inlet and carries forward across road lanes, causing 15–30 cm waterlogging on road surfaces even when the underground box culvert below has over 40% spare headroom.
            </p>
            <button
              onClick={handleClearGrates}
              className="px-3.5 py-1.5 rounded-lg bg-purple text-white hover:bg-purple-deep text-xs font-bold transition-colors shadow-subtle mt-1"
            >
              Order Immediate Mechanical Grate Clearance
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

