import React, { useState } from 'react';
import { X, Users, Shield, CheckCircle2, FileCheck, PhoneCall, Radio } from 'lucide-react';
import { INTER_AGENCIES } from '../../data/floodData';

export default function InterAgencyCoordinationModal({ isOpen, onClose, selectedRoute }) {
  if (!isOpen) return null;

  const [agencies, setAgencies] = useState(
    INTER_AGENCIES || [
      { id: 'AG-01', agency: 'BMC Disaster Management Department', rep: 'Dr. V. Samant', status: 'AUTHORIZED' },
      { id: 'AG-02', agency: 'Mumbai Traffic Police (MTP)', rep: 'DCP Traffic (Suburbs)', status: 'AUTHORIZED' },
      { id: 'AG-03', agency: 'National Disaster Response Force (NDRF)', rep: 'Commandant R. Negi', status: 'PENDING ACK' },
      { id: 'AG-04', agency: '108 Emergency Medical Fleet CAD', rep: 'Chief Medical Officer', status: 'AUTHORIZED' },
    ]
  );
  const [signOffHash, setSignOffHash] = useState(null);

  const handleSignOff = () => {
    const hash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setSignOffHash(hash);
    setAgencies((prev) => prev.map((a) => ({ ...a, status: 'AUTHORIZED' })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Users className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Inter-Agency Corridor Authorization &amp; Handover Hub
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe text-white">
                  Multi-Agency Sign-Off
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Synchronized route approval across BMC Disaster Cell, Mumbai Traffic Police, NDRF, and 108 Emergency CAD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {signOffHash && (
            <div className="p-3 rounded-xl bg-status-safe-soft border border-status-safe text-status-safe flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono text-xs">Joint Multi-Agency Clearance Verified: {signOffHash}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-status-safe text-white px-2 py-0.5 rounded font-bold">
                ENFORCED
              </span>
            </div>
          )}

          {/* Agency Roster */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary block">
              Coordinating Command Entities
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agencies.map((agency, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink">{agency.agency || agency.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        agency.status === 'AUTHORIZED'
                          ? 'bg-status-safe-soft text-status-safe'
                          : 'bg-status-warning-soft text-status-warning'
                      }`}
                    >
                      {agency.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary flex justify-between">
                    <span>Authorized Representative:</span>
                    <span className="font-semibold text-ink">{agency.rep || agency.officer || 'Duty Incident Commander'}</span>
                  </div>
                  <div className="text-[11px] text-ink-secondary flex justify-between">
                    <span>Secure Comms Channel:</span>
                    <span className="font-mono text-purple font-semibold">TETRA Encrypted #TG-402</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Joint Protocol Checkbox Banner */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-ink block">Joint Municipal Flood Corridors Protocol (JMFCP)</span>
              <span className="text-[11px] text-ink-secondary">
                Authorizes exclusive lane reservation on Eastern Express Highway flyovers for 108 CAD ambulances.
              </span>
            </div>
            <button
              onClick={handleSignOff}
              className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all whitespace-nowrap"
            >
              <FileCheck className="w-4 h-4" /> Issue Multi-Agency Digital Sign-Off
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">
            Complies with Disaster Management Act 2005 &bull; Section 34 Unified Incident Command.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Coordination Hub
          </button>
        </div>
      </div>
    </div>
  );
}

