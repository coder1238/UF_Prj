import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  PhoneForwarded,
  Shield,
  Activity,
  CheckCircle2,
  Users,
  Radio,
  Headphones,
} from 'lucide-react';

const HOTLINES = [
  {
    id: 'NDRF-HQ',
    agency: 'NDRF 5th Battalion (Flood Rescue Team)',
    commander: 'Commandant R. K. Verma',
    phone: '+91-22-257XXXXX',
    speedDial: 'SPEED-01',
    status: 'READY / STANDBY',
    specialty: 'Inflatable Zodiac Boats & Deep Water Rescue',
  },
  {
    id: 'MFB-CONTROL',
    agency: 'Mumbai Fire Brigade Command (Byculla HQ)',
    commander: 'Chief Fire Officer Parab',
    phone: '101 / 022-230XXXXX',
    speedDial: 'SPEED-02',
    status: 'READY / STANDBY',
    specialty: 'Heavy Dewatering Pumps & Tree Clearance',
  },
  {
    id: 'TRAFFIC-HQ',
    agency: 'Mumbai Traffic Police HQ Control Room',
    commander: 'DCP Traffic Operations',
    phone: '022-249XXXXX',
    speedDial: 'SPEED-03',
    status: 'READY / STANDBY',
    specialty: 'Arterial Barricading & Subway Divert Routing',
  },
  {
    id: 'NAVY-WNC',
    agency: 'Indian Navy (Western Naval Command - Op Jalrahat)',
    commander: 'Naval Flood Duty Officer',
    phone: '022-226XXXXX',
    speedDial: 'SPEED-04',
    status: 'ALERTED / ON CALL',
    specialty: 'Diving Teams & Sea King Airborne Drops',
  },
];

export default function EmergencyHelplineBridgeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeCall, setActiveCall] = useState(null);
  const [conferenceActive, setConferenceActive] = useState(false);

  const handleDial = (hotline) => {
    setActiveCall(hotline);
    setTimeout(() => {
      // simulate connection
    }, 1000);
  };

  const handleHangup = () => {
    setActiveCall(null);
    setConferenceActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Emergency Helpline (1916 / 112) Load &amp; Multi-Agency Hotlines
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Citizen distress call load balancing &amp; instant tactical bridge to NDRF, Fire &amp; Police
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

        {/* 1916 Call Queue Telemetry */}
        <div className="p-5 bg-surface-secondary border-b border-border grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-surface p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase block">
              1916 Active Call Queue
            </span>
            <div className="text-xl font-bold font-mono text-status-alert mt-0.5">
              142 Calls Waiting
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              Avg Wait Time: 18s
            </span>
          </div>

          <div className="bg-surface p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase block">
              Call Operators on Duty
            </span>
            <div className="text-xl font-bold font-mono text-purple mt-0.5">
              64 Lines Active
            </div>
            <span className="text-[10px] font-mono text-status-safe font-bold">
              Surge Capacity 100%
            </span>
          </div>

          <div className="bg-surface p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase block">
              Top Distress Ward
            </span>
            <div className="text-xl font-bold font-mono text-ink mt-0.5">
              Ward L (Kurla)
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              42% of total distress calls
            </span>
          </div>

          <div className="bg-surface p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase block">
              Dispatched Field Units
            </span>
            <div className="text-xl font-bold font-mono text-status-safe mt-0.5">
              28 Rescue Vans
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              En route to coordinates
            </span>
          </div>
        </div>

        {/* Active Call Banner if active */}
        {activeCall && (
          <div className="p-3.5 bg-[#1B1829] text-white border-b border-border flex items-center justify-between px-5 text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-status-alert animate-ping" />
              <div>
                <span className="font-bold text-white block">
                  CONNECTED: {activeCall.agency}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  Commander: {activeCall.commander} • Encrypted Radio Circuit
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConferenceActive(!conferenceActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  conferenceActive ? 'bg-purple text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {conferenceActive ? 'Conference Live' : 'Bridge to Commissioner'}
              </button>
              <button
                onClick={handleHangup}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Disconnect Call
              </button>
            </div>
          </div>
        )}

        {/* Agency Hotlines List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-ink uppercase tracking-wide">
            <span>Direct Tactical Inter-Agency Hotlines</span>
            <span className="text-[10px] font-mono text-status-safe font-semibold">
              CRYPTO-VOICE SECURE
            </span>
          </div>

          {HOTLINES.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-xl border border-border bg-surface hover:border-purple/30 transition-all shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-ink">{h.agency}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-soft text-purple font-semibold">
                    {h.speedDial}
                  </span>
                  <span className="text-[10px] font-mono text-status-safe font-bold">
                    {h.status}
                  </span>
                </div>
                <div className="text-[11px] text-ink-secondary flex items-center gap-4 font-mono">
                  <span>Contact: {h.commander}</span>
                  <span>Direct Line: {h.phone}</span>
                </div>
                <div className="text-[11px] text-ink-secondary">
                  Capability: <strong className="text-ink">{h.specialty}</strong>
                </div>
              </div>

              <button
                onClick={() => handleDial(h)}
                className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors shrink-0 self-end md:self-auto"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Initiate Direct Call</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary font-mono">
          <span>Inter-agency hotline bridged through Maharashtra State Disaster Management Network (MSDN).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-ink hover:bg-surface-secondary font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

