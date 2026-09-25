import React, { useState } from 'react';
import {
  Activity,
  X,
  Zap,
  Gauge,
  CheckCircle2,
  Truck,
  Fuel,
  MapPin,
  Clock,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function MobilePumpDispatchModal({ asset, onClose, onDispatched }) {
  const { mobilePumpsList, dispatchMobilePump, addCommandLog } = useFloodCommand();
  const [selectedPumpId, setSelectedPumpId] = useState(mobilePumpsList[0]?.id || 'PUMP-SQUAD-01');
  const [selectedGate, setSelectedGate] = useState(asset.ingressGates?.[0]?.name || 'Main Ingress Ramp');
  const [operationalMode, setOperationalMode] = useState('CONTINUOUS_MAX'); // CONTINUOUS_MAX, PULSED_SUMP, FLOATING_SUCTION

  const targetPump = mobilePumpsList.find((p) => p.id === selectedPumpId) || mobilePumpsList[0];

  const handleDispatch = (e) => {
    e.preventDefault();

    const targetLoc = `${asset.name} (${selectedGate})`;
    dispatchMobilePump(selectedPumpId, targetLoc, asset.ward);

    addCommandLog({
      officer: 'Municipal Dewatering Ops Command',
      type: 'MOBILE_PUMP_DISPATCH',
      details: `Dispatched ${targetPump.name} (${targetPump.capacity}) to ${targetLoc}. Mission: Ingress dewatering with ETA 6 min.`,
      status: 'DISPATCHED_EN_ROUTE',
    });

    onDispatched(`Mobile Dewatering Squad ${targetPump.name} dispatched to ${selectedGate}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/30">
              <Zap className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Emergency Mobile Dewatering Squad Staging &amp; Dispatch
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold uppercase">
                  500HP Turbo Units
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Direct Dewatering Reinforcement for {asset.name}
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
        <form onSubmit={handleDispatch} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Target Ingress Gate */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Select Inundated Facility Gate for Pump Staging
            </label>
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-purple"
            >
              {(asset.ingressGates || [{ name: 'Main Ingress Gate' }]).map((gate) => (
                <option key={gate.name || gate.id} value={gate.name}>
                  {gate.name} ({gate.depthCm || asset.predictedDepth} cm water depth)
                </option>
              ))}
              <option value="Basement Electrical Cable Vault Trench">Basement Electrical Cable Vault Trench</option>
              <option value="Emergency Ambulance Ingress Portico">Emergency Ambulance Ingress Portico</option>
            </select>
          </div>

          {/* Fleet Selection List */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Available Mobile Dewatering Fleet ({mobilePumpsList.length} Units)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {mobilePumpsList.map((pump) => (
                <button
                  key={pump.id}
                  type="button"
                  onClick={() => setSelectedPumpId(pump.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedPumpId === pump.id
                      ? 'bg-purple-soft/70 border-purple text-ink ring-1 ring-purple font-semibold'
                      : 'bg-surface border-border text-ink-secondary hover:border-purple/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-purple" />
                    <div>
                      <div className="font-bold text-xs text-ink">{pump.name}</div>
                      <div className="text-[10px] text-ink-secondary flex items-center gap-2 mt-0.5 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-ink-secondary" /> {pump.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Fuel className="w-3 h-3 text-status-warning" /> Fuel: {pump.fuel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-purple">{pump.capacity}</span>
                    <div className="text-[10px] text-status-safe font-bold mt-0.5">{pump.status}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pump Operating Mode */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Hydraulic Discharge Operation Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CONTINUOUS_MAX', label: 'Continuous Max Overdrive', desc: '100% impeller speed to prevent gate overtopping' },
                { id: 'PULSED_SUMP', label: 'Basement Sump Cycle', desc: 'Auto-cycling between suction pit and outer drain' },
                { id: 'FLOATING_SUCTION', label: 'Floating Skimmer Suction', desc: 'Surface water extraction with debris cage' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setOperationalMode(mode.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    operationalMode === mode.id
                      ? 'bg-purple-soft border-purple text-ink font-semibold'
                      : 'bg-surface border-border text-ink-secondary hover:border-purple/30'
                  }`}
                >
                  <div className="font-bold text-xs text-ink">{mode.label}</div>
                  <div className="text-[10px] text-ink-secondary mt-1">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Staging Summary */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-status-safe" />
              <span>Calculated Staging Time to Gate: <strong>4.8 - 7.5 min</strong></span>
            </div>
            <span className="text-status-safe font-bold">CREW ON STANDBY</span>
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
              <Zap className="w-3.5 h-3.5" />
              <span>Dispatch Mobile Pump Squad to Gate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

