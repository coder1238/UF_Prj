import React, { useState } from 'react';
import {
  ZapOff,
  Zap,
  AlertTriangle,
  X,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function ScadaTripModal({ asset, bay, onClose, onTripped }) {
  const { addCommandLog } = useFloodCommand();
  const [operatorId, setOperatorId] = useState('ENG-EOC-782');
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState('FLOOD_SUBMERSION_PREVENTIVE');

  const handleTrip = (e) => {
    e.preventDefault();
    if (!confirmed) return;

    addCommandLog({
      officer: `SCADA Grid Dispatcher (${operatorId})`,
      type: 'ELECTRICAL_BAY_SCADA_TRIP',
      details: `EMERGENCY ISOLATION: De-energized ${bay.name} (${bay.voltage}) at ${asset.name}. Water clearance was ${bay.waterProximityCm}cm. Circuit verified OPEN and GROUNDED.`,
      status: 'ISOLATED_SECURED',
    });

    onTripped(bay.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-status-alert/40 rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-status-alert-soft border-b border-status-alert/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-status-alert text-white flex items-center justify-center shadow-subtle">
              <ZapOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-status-alert flex items-center gap-2">
                CRITICAL SCADA CIRCUIT TRIP INTERLOCK
              </h3>
              <p className="text-xs text-ink-secondary">
                Two-Person Verification Protocol (IEEE/CEA Grid Standards)
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
        <form onSubmit={handleTrip} className="p-4 space-y-4 text-xs">
          {/* Warning Banner */}
          <div className="p-3 bg-status-alert-soft/50 rounded-xl border border-status-alert/30 text-ink space-y-1">
            <div className="font-bold text-status-alert flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>CAUTION: Electrical Arc-Flash &amp; Blackout Hazard</span>
            </div>
            <p className="text-[11px] text-ink-secondary">
              Tripping <strong className="text-ink">{bay.name}</strong> will isolate high-tension busbars feeding municipal circuits. Ensure standby diesel generators are synchronized prior to opening breaker contacts.
            </p>
          </div>

          {/* Bay Details */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono bg-surface-secondary p-3 rounded-xl border border-border">
            <div>
              <span className="text-[10px] text-ink-secondary uppercase block">Switchgear Bay</span>
              <span className="text-xs font-bold text-ink">{bay.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary uppercase block">Operating Voltage</span>
              <span className="text-xs font-bold text-purple">{bay.voltage}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-secondary uppercase block">Water Proximity</span>
              <span className="text-xs font-bold text-status-alert">{bay.waterProximityCm} cm</span>
            </div>
          </div>

          {/* Form Inputs */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Authorized Senior SCADA Operator Badge ID
            </label>
            <input
              type="text"
              required
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-status-alert"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Emergency Isolation Justification
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-status-alert"
            >
              <option value="FLOOD_SUBMERSION_PREVENTIVE">Flood Inundation &lt; 30cm Clearance (Flashover Prevention)</option>
              <option value="EQUIPMENT_INSULATION_BREAKDOWN">Moisture Insulation Degradation (Partial Discharge Detected)</option>
              <option value="FIRE_RESCUE_ELECTRICAL_SAFETY">Fire Brigade Personnel Standing Water Safety Protocol</option>
            </select>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-secondary/70 border border-border cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-status-alert focus:ring-status-alert"
            />
            <span className="text-[11px] text-ink font-semibold">
              I certify that emergency auxiliary loads have been transferred or shed, and authorize remote SCADA vacuum breaker trip.
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmed}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-status-alert text-white hover:bg-status-alert/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle flex items-center gap-2 transition-all"
            >
              <ZapOff className="w-3.5 h-3.5" />
              <span>Confirm Emergency Breaker Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

