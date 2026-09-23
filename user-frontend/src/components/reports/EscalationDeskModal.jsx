import React, { useState } from 'react';
import { Phone, PhoneCall, AlertTriangle, ShieldAlert, CheckCircle2, X, Clock, UserCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function EscalationDeskModal({ report, isOpen, onClose, onEscalateTicket }) {
  const [activeTab, setActiveTab] = useState('call'); // 'call' | 'escalate'
  const [callingState, setCallingState] = useState('idle'); // 'idle' | 'dialing' | 'connected' | 'ended'
  const [callTimer, setCallTimer] = useState(0);
  const [escalationReason, setEscalationReason] = useState('water_rising_rapidly');
  const [escalationRemarks, setEscalationRemarks] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationComplete, setEscalationComplete] = useState(false);

  if (!isOpen || !report) return null;

  const officerName = report.assignedOfficer || 'Er. V. Desai (MCGM Stormwater Cell)';
  const officerRole = report.officerRole || 'Executive Engineer - Stormwater Drain Management';
  const officerPhone = report.officerPhone || '+91 22 2628 5381 (Desk Ref: MCGM-SW-48)';
  const officerBadge = report.officerBadge || 'EE-8491-KW';

  const handleStartCall = () => {
    setCallingState('dialing');
    setTimeout(() => {
      setCallingState('connected');
      const timer = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, 1800);
  };

  const handleEndCall = () => {
    setCallingState('ended');
    setTimeout(() => {
      setCallingState('idle');
      setCallTimer(0);
    }, 1000);
  };

  const handleConfirmEscalation = (e) => {
    e.preventDefault();
    setIsEscalating(true);
    setTimeout(() => {
      setIsEscalating(false);
      setEscalationComplete(true);
      if (onEscalateTicket) {
        onEscalateTicket(report.id, {
          escalated: true,
          escalationTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          escalationReason,
          escalationRemarks,
          severity: 'critical'
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Ward Officer Emergency Desk</h3>
              <p className="text-[11px] font-mono text-purple-200">Incident Ticket #{report.id} • {report.ward || 'Ward K-West'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('call')}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'call'
                ? 'border-purple-primary text-purple-primary bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-ink'
            }`}
          >
            <PhoneCall className="w-4 h-4" /> Direct Desk Hotline
          </button>
          <button
            onClick={() => setActiveTab('escalate')}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'escalate'
                ? 'border-red-600 text-red-600 bg-red-50/50'
                : 'border-transparent text-slate-500 hover:text-ink'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Level 2 Disaster Escalation
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'call' && (
            <div className="space-y-5 text-xs">
              {/* Officer Bio Card */}
              <div className="bg-canvas p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-primary/10 border border-purple-primary/30 flex items-center justify-center text-purple-primary text-xl font-bold font-mono shrink-0">
                  {officerBadge.slice(0, 2)}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-black text-ink text-base">{officerName}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
                      {officerBadge}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium text-xs mt-0.5">{officerRole}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-primary" /> {officerPhone}
                  </p>
                </div>
              </div>

              {/* Calling Simulator Interface */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-4">
                {callingState === 'idle' && (
                  <div>
                    <span className="text-xs font-mono text-purple-300 block mb-2">Simulated Civic VoIP Protocol</span>
                    <button
                      onClick={handleStartCall}
                      className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-lg transition-transform active:scale-95"
                    >
                      <PhoneCall className="w-4 h-4" /> Connect to Ward Desk Now
                    </button>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      Average pickup latency: 4 seconds • Direct line to Stormwater Control
                    </span>
                  </div>
                )}

                {callingState === 'dialing' && (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-ping">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-sm">Dialing Ward Desk {officerPhone}...</div>
                    <p className="text-xs text-slate-400 font-mono">Routing priority call through BMC Emergency Gateway...</p>
                  </div>
                )}

                {callingState === 'connected' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      CALL ACTIVE • 00:{callTimer < 10 ? `0${callTimer}` : callTimer}
                    </div>

                    <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-left text-xs font-mono text-slate-200">
                      <div className="text-purple-300 font-bold text-[10px] uppercase mb-1">
                        Live Audio Feedback Simulation:
                      </div>
                      <p className="italic">
                        "MCGM Stormwater Desk, Er. Desai speaking. We have verified your report #{report.id} on the live acoustic radar. High-capacity dewatering unit #7 is operating at 2,400 LPM and water level has begun receding."
                      </p>
                    </div>

                    <button
                      onClick={handleEndCall}
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto"
                    >
                      End Call
                    </button>
                  </div>
                )}

                {callingState === 'ended' && (
                  <div className="text-xs text-slate-300 font-mono">
                    Call logged in Incident Record Audit Trail.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'escalate' && (
            <div className="space-y-4 text-xs font-sans">
              {report.escalated || escalationComplete ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-red-900 text-base">Ticket Escalated to Municipal War Room</h4>
                  <p className="text-xs text-red-700">
                    This incident has been elevated to Priority 1 (Disaster Management Commissioner Desk). Additional high-capacity amphibious pumps are being diverted.
                  </p>
                  <span className="text-[10px] font-mono text-red-600 font-bold block pt-2">
                    Escalation Hash: 0xESC-{report.id}-{Date.now().toString(16).slice(-4)}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleConfirmEscalation} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs">
                    <strong>Level 2 Escalation:</strong> Use this protocol if water level is rising towards power substations, basement ingress is imminent, or emergency dewatering units have not reported on scene within 30 minutes.
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Primary Escalation Trigger:</label>
                    <select
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs bg-white"
                    >
                      <option value="water_rising_rapidly">Water Depth Rising Rapidly (&gt;10 cm / 15 mins)</option>
                      <option value="basement_ingress">Threat of Basement / Hospital Flooding</option>
                      <option value="electrical_hazard">Exposed Live Electrical Junction / Sparking</option>
                      <option value="traffic_gridlock">Ambulance / Emergency Transit Trapped in Flood</option>
                      <option value="unit_unresponsive">Assigned Unit Unresponsive &gt; 30 Mins</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Additional Urgent Observations:</label>
                    <textarea
                      value={escalationRemarks}
                      onChange={(e) => setEscalationRemarks(e.target.value)}
                      placeholder="Specify immediate danger or stranded citizens requiring immediate NDRF boat or high-lift assistance..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isEscalating}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isEscalating ? (
                      <span>Transmitting Level 2 Alert to War Room...</span>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" /> Escalate to Disaster Control Room (1916)
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
          >
            Close Desk
          </button>
        </div>

      </div>
    </div>
  );
}

