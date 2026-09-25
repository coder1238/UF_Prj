import React, { useState } from 'react';
import {
  Share2,
  X,
  Truck,
  HeartPulse,
  Fuel,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function MutualAidModal({ asset, sisterAssets, onClose, onTransferred }) {
  const { addCommandLog } = useFloodCommand();
  const [selectedSisterId, setSelectedSisterId] = useState(sisterAssets[0]?.id || '');
  const [resourceType, setResourceType] = useState('ICU_BEDS'); // ICU_BEDS, AUX_PUMP, DIESEL_FUEL, OXYGEN_CYLINDERS, SANDBAGS
  const [quantity, setQuantity] = useState(10);
  const [escortRequired, setEscortRequired] = useState(true);

  const selectedSister = sisterAssets.find((a) => a.id === selectedSisterId) || sisterAssets[0];

  const handleRequest = (e) => {
    e.preventDefault();

    addCommandLog({
      officer: 'Inter-Facility Mutual Aid Coordinator',
      type: 'MUTUAL_AID_DISPATCH',
      details: `Dispatched ${quantity} units of ${resourceType} from ${selectedSister?.name || 'Sister Facility'} to ${asset.name}. Escort: ${escortRequired ? 'Traffic Police Escort Active' : 'Standard Transport'}.`,
      status: 'CONVOY_EN_ROUTE',
    });

    onTransferred(`Requisition of ${quantity} ${resourceType} from ${selectedSister?.name} approved. Convoy rolling.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/30">
              <Share2 className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Inter-Facility Resource Balancing &amp; Mutual Aid
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold uppercase">
                  Sister Network
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Mutual Aid Destination: {asset.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-border/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRequest} className="p-4 space-y-4 text-xs">
          {/* Source Sister Facility */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Select Providing Sister Facility (Source)
            </label>
            <select
              value={selectedSisterId}
              onChange={(e) => setSelectedSisterId(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-purple"
            >
              {sisterAssets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.ward} • Exposure: {s.exposure} • Accessibility: {s.accessibility}%)
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Requisition Resource Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'ICU_BEDS', label: 'ICU / Critical Beds', icon: HeartPulse, unit: 'Beds' },
                { id: 'AUX_PUMP', label: 'Aux Dewatering Pump', icon: Truck, unit: 'Pumps' },
                { id: 'DIESEL_FUEL', label: 'Diesel Fuel Tanker', icon: Fuel, unit: 'Liters (x100)' },
                { id: 'OXYGEN_CYLINDERS', label: 'Medical Oxygen Jumbo', icon: Share2, unit: 'Cylinders' },
                { id: 'SANDBAGS', label: 'Pre-filled Sandbags', icon: ShieldCheck, unit: 'Units (x50)' },
              ].map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setResourceType(res.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      resourceType === res.id
                        ? 'bg-purple-soft border-purple text-ink font-semibold'
                        : 'bg-surface border-border text-ink-secondary hover:border-purple/30'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-purple mb-1" />
                    <div className="font-bold text-xs text-ink">{res.label}</div>
                    <div className="text-[10px] text-ink-secondary mt-0.5">{res.unit}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="bg-surface-secondary/70 p-3.5 rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-ink-secondary uppercase font-bold">Transfer Quantity:</span>
              <span className="font-bold text-purple text-sm">{quantity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
          </div>

          {/* Transit & Police Escort */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
              <input
                type="checkbox"
                checked={escortRequired}
                onChange={(e) => setEscortRequired(e.target.checked)}
                className="rounded text-purple focus:ring-purple"
              />
              <span>Deploy Mumbai Traffic Police High-Water Pilot Escort</span>
            </label>
            <span className="font-mono text-[10px] text-status-safe font-bold">EST. TRANSIT: 14 MIN</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple text-white hover:bg-purple-deep shadow-subtle flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Dispatch Mutual Aid Convoy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

