import React, { useState } from 'react';
import { X, Building2, Truck, CheckCircle2, Clock, Shield, Send } from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function CrossAgencyMutualAidModal({ isOpen, onClose }) {
  const { addCommandLog } = useFloodCommand();
  const [selectedAgency, setSelectedAgency] = useState('MMRDA Heavy Infrastructure');
  const [equipmentType, setEquipmentType] = useState('Trailer-Mounted 1000 m³/hr Axial Pump (2 Units)');
  const [targetCorridor, setTargetCorridor] = useState('LBS Marg Kurla');
  const [urgency, setUrgency] = useState('P1 - CRITICAL (Immediate)');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const agencyOptions = [
    {
      name: 'MMRDA Heavy Infrastructure Division',
      readiness: 'IMMEDIATE',
      assets: 'Trailer pumps, excavators, heavy crane loaders',
      eta: '25 min',
    },
    {
      name: 'Indian Navy (Western Naval Command, Colaba)',
      readiness: 'STANDBY',
      assets: 'High-lift salvage submersible pumps & divers',
      eta: '45 min',
    },
    {
      name: 'NDRF 5th Battalion (Andheri Rapid Base)',
      readiness: 'DEPLOYED',
      assets: 'Zodiac inflatable flood boats, satellite comms',
      eta: '18 min',
    },
    {
      name: 'Mumbai Port Authority (MbPA Marine Works)',
      readiness: 'AVAILABLE',
      assets: 'Cutter suction dredger & outfall excavators',
      eta: '60 min',
    },
  ];

  const handleRequisition = (e) => {
    e.preventDefault();
    if (addCommandLog) {
      addCommandLog({
        id: `req-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        category: 'MUTUAL AID REQUISITION',
        level: 'CRITICAL',
        message: `Mutual aid requisition issued to ${selectedAgency} for ${equipmentType} to hotspot ${targetCorridor} (Urgency: ${urgency}).`,
      });
    }

    setDispatchedSuccess(true);
    setTimeout(() => {
      setDispatchedSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Inter-Agency Mutual Aid Resource Requisition
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Request external heavy equipment from MMRDA, Navy, NDRF, and Port Authority.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {dispatchedSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-status-safe-soft text-status-safe flex items-center justify-center mx-auto border border-status-safe/30">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-sm font-bold text-ink">
                Requisition Confirmed & Transmitted
              </h4>
              <p className="text-xs text-ink-secondary">
                Emergency logistics order broadcasted to {selectedAgency}. Asset tracking initiated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequisition} className="space-y-4">
              {/* Agency List Cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink block">
                  Select Partner Agency
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {agencyOptions.map((ag) => (
                    <button
                      key={ag.name}
                      type="button"
                      onClick={() => setSelectedAgency(ag.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedAgency === ag.name
                          ? 'border-purple bg-purple-soft/40 shadow-subtle'
                          : 'border-border bg-white hover:border-purple/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink truncate">{ag.name.split('(')[0]}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-ink-secondary">
                          ETA {ag.eta}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-secondary mt-1 line-clamp-1">
                        {ag.assets}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Spec & Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink mb-1 block">
                    Equipment / Asset Description
                  </label>
                  <input
                    type="text"
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink mb-1 block">
                    Destination Staging Hotspot
                  </label>
                  <input
                    type="text"
                    value={targetCorridor}
                    onChange={(e) => setTargetCorridor(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-medium"
                    required
                  />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">
                  Priority Escalation Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'P1 - CRITICAL (Immediate)',
                    'P2 - HIGH (Under 45m)',
                    'P3 - STAGED (Next Shift)',
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        urgency === level
                          ? 'border-status-alert bg-status-alert-soft text-status-alert'
                          : 'border-border bg-white text-ink-secondary'
                      }`}
                    >
                      {level.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-secondary rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Issue Inter-Agency Requisition
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

