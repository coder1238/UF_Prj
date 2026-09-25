import React, { useState } from 'react';
import { X, Play, RefreshCw, Flame } from 'lucide-react';
import { EXTENDED_DRAINAGE_NODES } from './drainageConstants';

export default function HydraulicStressSandboxModal({ isOpen, onClose, onApplyStressScenario, showToast }) {
  const [rainfallSpikeMmHr, setRainfallSpikeMmHr] = useState(40); // +0 to +120 mm/hr
  const [tideSurgeM, setTideSurgeM] = useState(0.6); // +0 to +2.0 m
  const [pumpingFailurePct, setPumpingFailurePct] = useState(25); // 0 to 80% failure
  const [extraBlockagePct, setExtraBlockagePct] = useState(30); // 0 to 50% extra debris

  if (!isOpen) return null;

  // Calculate stress effects
  const totalRainfall = 65 + rainfallSpikeMmHr;
  const simulatedTide = 4.25 + tideSurgeM;
  const overtoppingNodesCount = Math.min(
    EXTENDED_DRAINAGE_NODES.length,
    Math.round(3 + (rainfallSpikeMmHr / 25) + (tideSurgeM * 2) + (pumpingFailurePct / 30))
  );
  const overtoppingDischargeM3s = (14.5 + rainfallSpikeMmHr * 0.45 + extraBlockagePct * 0.3).toFixed(1);

  const handleRunStressTest = () => {
    if (onApplyStressScenario) {
      onApplyStressScenario({
        rainfallSpikeMmHr,
        tideSurgeM,
        pumpingFailurePct,
        extraBlockagePct,
        overtoppingNodesCount,
      });
    }
    showToast(`STRESS SCENARIO APPLIED: ${overtoppingNodesCount} nodes surcharging under +${rainfallSpikeMmHr}mm/hr cloudburst!`);
  };

  const handleReset = () => {
    setRainfallSpikeMmHr(0);
    setTideSurgeM(0);
    setPumpingFailurePct(0);
    setExtraBlockagePct(0);
    if (onApplyStressScenario) {
      onApplyStressScenario(null);
    }
    showToast('Reset to Live Sensor Telemetry.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Hydraulic Stress-Testing &amp; Cascading Failure Sandbox
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                  MULTI-VARIABLE MONTE CARLO
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Simulate Cloudburst Extremes, Spring Tide Surges, and Power Blackout Vulnerabilities
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Stress Outcomes Preview Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Total Storm Intensity</span>
              <span className="text-xl font-bold text-blue-500">{totalRainfall} mm/hr</span>
              <span className="text-[10px] text-ink-secondary block">Cloudburst Level</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Estuarine Tide Head</span>
              <span className="text-xl font-bold text-cyan-500">{simulatedTide.toFixed(2)} m MSL</span>
              <span className="text-[10px] text-ink-secondary block">Storm Surge Peak</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Surcharging Conduits</span>
              <span className="text-xl font-bold text-status-alert">
                {overtoppingNodesCount} / {EXTENDED_DRAINAGE_NODES.length}
              </span>
              <span className="text-[10px] text-ink-secondary block">Manholes Overtopping</span>
            </div>

            <div className="bg-surface-secondary p-3 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Surface Spill Volume</span>
              <span className="text-xl font-bold text-amber-500">{overtoppingDischargeM3s} m³/s</span>
              <span className="text-[10px] text-ink-secondary block">Inundation Ingress</span>
            </div>
          </div>

          {/* Interactive Stress Sliders */}
          <div className="space-y-4 bg-canvas border border-border rounded-xl p-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-semibold">1. Rainfall Spike (+Δ mm/hr):</span>
                <span className="text-purple font-bold">+{rainfallSpikeMmHr} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={rainfallSpikeMmHr}
                onChange={(e) => setRainfallSpikeMmHr(parseInt(e.target.value))}
                className="w-full accent-purple cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-semibold">2. High Tide Storm Surge Anomaly (+Δ meters MSL):</span>
                <span className="text-cyan-500 font-bold">+{tideSurgeM.toFixed(2)} m MSL</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={tideSurgeM}
                onChange={(e) => setTideSurgeM(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-semibold">3. Municipal Pumping Station Grid Outage:</span>
                <span className="text-status-alert font-bold">{pumpingFailurePct}% Capacity Down</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="10"
                value={pumpingFailurePct}
                onChange={(e) => setPumpingFailurePct(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-semibold">4. Nullah Garbage &amp; Silt Blockage Ratio:</span>
                <span className="text-amber-500 font-bold">+{extraBlockagePct}% Extra Choke</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={extraBlockagePct}
                onChange={(e) => setExtraBlockagePct(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface text-ink-secondary hover:text-ink text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Live Telemetry</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
              Close
            </button>
            <button
              onClick={handleRunStressTest}
              className="px-4 py-2 rounded-lg bg-purple text-white hover:bg-purple-deep text-xs font-bold flex items-center gap-2 shadow-subtle transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Simulate Stress Wave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

