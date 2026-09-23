import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Send,
  Zap,
  Train,
  HeartPulse,
  Bus,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const CRITICAL_FACILITIES = [
  {
    id: 'FAC-HOSP-01',
    name: 'L.T.M.G (Sion) Hospital & Trauma Center',
    type: 'Healthcare',
    ward: 'Ward F/N',
    contact: 'Dr. Mohan Joshi (Dean - 98200XXXXX)',
    actionDirective: 'Trigger basement pump battery. Elevate mobile oxygen manifolds. Prepare casualty surge ward.',
    icon: HeartPulse,
    status: 'ACTIVE_STANDBY',
  },
  {
    id: 'FAC-METRO-02',
    name: 'Metro Line 3 (Aqua Line) Marol & SEEPZ Underground Stations',
    type: 'Transit',
    ward: 'Ward K/E',
    contact: 'MMRCL Operations Controller (022-263XXXXX)',
    actionDirective: 'Deploy hydraulic flood barrier gates at station entry plazas. Engage dual sump submersibles.',
    icon: Train,
    status: 'ACTIVE_STANDBY',
  },
  {
    id: 'FAC-POWER-03',
    name: 'Dharavi 220kV Extra High Voltage (EHV) Receiving Substation',
    type: 'Energy',
    ward: 'Ward G/N',
    contact: 'Tata Power Grid Dispatch (022-666XXXXX)',
    actionDirective: 'Isolate ground-level 11kV bus couplers if bund water exceeds 40cm. Switch load to Chembur EHV.',
    icon: Zap,
    status: 'ACTIVE_STANDBY',
  },
  {
    id: 'FAC-BEST-04',
    name: 'Kurla West BEST Bus Depot & Fleet Staging Ground',
    type: 'Logistics',
    ward: 'Ward L',
    contact: 'Depot Manager Patil (98199XXXXX)',
    actionDirective: 'Evacuate 80 electric feeder buses to BKC Elevated Connector. Stand by for emergency citizen evacuation runs.',
    icon: Bus,
    status: 'ACTIVE_STANDBY',
  },
];

export default function CriticalFacilityDirectModal({
  isOpen,
  onClose,
  targetWards = [],
}) {
  if (!isOpen) return null;

  const [facilities, setFacilities] = useState(CRITICAL_FACILITIES);
  const [selectedIds, setSelectedIds] = useState(CRITICAL_FACILITIES.map((f) => f.id));
  const [dispatchedToast, setDispatchedToast] = useState(false);

  const toggleFacility = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDispatch = () => {
    setFacilities((prev) =>
      prev.map((f) =>
        selectedIds.includes(f.id)
          ? { ...f, status: 'DIRECTIVE_TRANSMITTED_ACK' }
          : f
      )
    );
    setDispatchedToast(true);
    setTimeout(() => {
      setDispatchedToast(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Critical Infrastructure &amp; Vital Facility Priority Hotline
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Direct SCADA and dedicated telemetry dispatch to hospitals, metro tunnels, and power substations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-5 py-2.5 bg-surface-secondary border-b border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-ink">
              Target Facilities: {selectedIds.length} of {facilities.length} Armed
            </span>
            <span className="text-ink-secondary">•</span>
            <span className="font-mono text-status-safe font-semibold">Priority 1 Dedicated Ring</span>
          </div>

          {dispatchedToast && (
            <span className="text-status-safe font-bold font-mono text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Priority Directive Wire Sent!
            </span>
          )}
        </div>

        {/* Facilities List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {facilities.map((fac) => {
            const Icon = fac.icon;
            const isSelected = selectedIds.includes(fac.id);
            return (
              <div
                key={fac.id}
                onClick={() => toggleFacility(fac.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-surface border-purple/60 shadow-subtle'
                    : 'bg-surface-secondary/70 border-border opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-purple border-purple text-white' : 'border-border bg-surface'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-ink">{fac.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-soft text-purple font-semibold">
                        {fac.ward}
                      </span>
                      <span className="text-[10px] font-mono text-ink-secondary">
                        {fac.contact}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink font-medium leading-relaxed bg-surface-secondary p-2 rounded-lg border border-border/60">
                      <strong>Operational Directive:</strong> {fac.actionDirective}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-xs self-end md:self-auto shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold block text-center ${
                      fac.status.includes('ACK')
                        ? 'bg-status-safe-soft text-status-safe'
                        : 'bg-status-warning-soft text-status-warning'
                    }`}
                  >
                    {fac.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-xs text-ink-secondary font-mono">
            Directives transmitted via National Critical Information Infrastructure Protection (NCIIPC) link.
          </span>

          <button
            onClick={handleDispatch}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 rounded-lg bg-status-alert hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Directives to Selected ({selectedIds.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

