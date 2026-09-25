import React, { useState } from 'react';
import { X, Truck, CheckCircle, Fuel } from 'lucide-react';

export default function MobilePumpRequisitionModal({ isOpen, onClose, selectedNode, onDeployPump, showToast }) {
  const [pumpType, setPumpType] = useState('godwin-500'); // godwin-500 | kirloskar-350 | honda-15
  const [hoseLengthM, setHoseLengthM] = useState(150); // meters
  const [targetOutfall, setTargetOutfall] = useState('Mithi River Channel');
  const [dieselBufferHours] = useState(24);

  if (!isOpen || !selectedNode) return null;

  const pumpSpecs = {
    'godwin-500': { name: 'Godwin CD150M Dri-Prime 500 HP', capacityM3h: 1200, fuelLh: 42, headM: 45 },
    'kirloskar-350': { name: 'Kirloskar Auto-Prime Heavy 350 HP', capacityM3h: 850, fuelLh: 30, headM: 38 },
    'honda-15': { name: 'Honda Portable High-Trash 15 HP', capacityM3h: 180, fuelLh: 6, headM: 22 },
  };

  const activeSpec = pumpSpecs[pumpType];

  const handleDeploy = () => {
    if (onDeployPump) {
      onDeployPump({
        nodeId: selectedNode.id,
        pumpType: activeSpec.name,
        capacityM3h: activeSpec.capacityM3h,
      });
    }
    showToast(`REQUISITION APPROVED: ${activeSpec.name} deployed to ${selectedNode.name} (+${activeSpec.capacityM3h} m³/h dewatering)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Emergency Mobile Dewatering Trailer Requisition
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  DISASTER PRE-POSITIONING
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} ({selectedNode.ward}) • High-Head Diesel Trash Pump Dispatch
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono">
          {/* Pump Type Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-ink">Select High-Discharge Pump Unit:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(pumpSpecs).map(([key, spec]) => (
                <button
                  key={key}
                  onClick={() => setPumpType(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    pumpType === key
                      ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{spec.name}</div>
                  <div className="text-sm font-bold text-purple mt-1.5">{spec.capacityM3h} m³/hr</div>
                  <div className="text-[10px] text-ink-secondary mt-1">
                    Head: {spec.headM}m • Fuel: {spec.fuelLh} L/hr
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-ink-secondary block mb-1">Discharge Hose Length:</span>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={hoseLengthM}
                  onChange={(e) => setHoseLengthM(parseInt(e.target.value))}
                  className="w-full accent-purple cursor-pointer"
                />
                <span className="text-[10px] text-purple font-bold mt-1 block">{hoseLengthM} meters lay-flat hose</span>
              </div>

              <div>
                <span className="text-ink-secondary block mb-1">Target Discharge Outfall:</span>
                <select
                  value={targetOutfall}
                  onChange={(e) => setTargetOutfall(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs text-ink focus:outline-none focus:border-purple font-mono"
                >
                  <option value="Mithi River Channel">Mithi River Main Channel</option>
                  <option value="Mahim Bay Estuary">Mahim Bay Estuary Outfall</option>
                  <option value="Vakola Nullah">Vakola Nullah Confluence</option>
                  <option value="Storm Trunk C-118">Sion Trunk Box Drain C-118</option>
                </select>
              </div>
            </div>

            <div className="bg-surface-secondary p-3 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-500" />
                <span>Diesel Fuel Buffer Allocated:</span>
              </div>
              <span className="font-bold text-ink">{dieselBufferHours} Hours ({dieselBufferHours * activeSpec.fuelLh} Liters)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            className="px-4 py-2 rounded-lg bg-purple text-white hover:bg-purple-deep text-xs font-bold flex items-center gap-2 shadow-subtle transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve &amp; Dispatch Dewatering Unit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

