import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  X,
  UserCheck,
  Send,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function CCTVFieldVerificationModal({
  isOpen,
  onClose,
  selectedCam,
  onDispatchTicket,
}) {
  const [tickets, setTickets] = useState([
    {
      id: 'VERIF-7102',
      camName: 'CAM-04: Andheri Subway Underpass',
      ward: 'Ward K/E',
      assignedJE: 'Er. R. Kulkarni (JE Stormwater)',
      status: 'VERIFIED',
      cvDepth: 28,
      physicalDepth: 28.5,
      delta: '+0.5 cm',
      timestamp: '17:45 IST',
    },
    {
      id: 'VERIF-7098',
      camName: 'CAM-08: Sion Circle Roundabout',
      ward: 'Ward F/N',
      assignedJE: 'Er. P. Deshmukh (JE Roads)',
      status: 'EN ROUTE',
      cvDepth: 19,
      physicalDepth: 'Pending...',
      delta: '—',
      timestamp: '18:12 IST',
    },
  ]);

  const [assignedJE, setAssignedJE] = useState('Er. Amit Patil (JE Drainage)');
  const [priority, setPriority] = useState('HIGH');
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const handleCreateTicket = () => {
    const newTicket = {
      id: `VERIF-${Date.now().toString().slice(-4)}`,
      camName: selectedCam.name,
      ward: selectedCam.ward,
      assignedJE: assignedJE,
      status: 'DISPATCHED',
      cvDepth: selectedCam.detectedDepth,
      physicalDepth: 'Pending...',
      delta: '—',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };
    setTickets([newTicket, ...tickets]);
    setIsDispatched(true);
    if (onDispatchTicket) {
      onDispatchTicket(newTicket);
    }
    setTimeout(() => setIsDispatched(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Junior Engineer Ground-Truth Verification Workflow
              </h2>
              <p className="text-xs text-ink-secondary">
                Dispatch municipal field engineers to physically verify optical staff gauges against CV readings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-ink">
          {/* Dispatch Box */}
          <div className="p-4 bg-purple-soft/20 rounded-xl border border-purple/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-ink">
                Create Verification Ticket for {selectedCam.name}
              </div>
              <span className="font-mono text-xs font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                CV Depth: {selectedCam.detectedDepth} cm
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-ink-secondary block mb-1">Assigned Junior Engineer:</label>
                <select
                  value={assignedJE}
                  onChange={(e) => setAssignedJE(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-border text-ink"
                >
                  <option value="Er. Amit Patil (JE Drainage)">Er. Amit Patil (JE Drainage)</option>
                  <option value="Er. Priya Sharma (JE Roads)">Er. Priya Sharma (JE Roads)</option>
                  <option value="Er. Rajesh Mane (JE Disaster)">Er. Rajesh Mane (JE Disaster)</option>
                </select>
              </div>

              <div>
                <label className="text-ink-secondary block mb-1">Inspection Urgency:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-border text-ink"
                >
                  <option value="CRITICAL">CRITICAL (Within 15 mins)</option>
                  <option value="HIGH">HIGH (Within 30 mins)</option>
                  <option value="ROUTINE">ROUTINE (Periodic)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateTicket}
              className="w-full py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <Send className="w-3.5 h-3.5" />
              {isDispatched ? 'Field Ticket Dispatched!' : 'Dispatch JE Field Verification Order'}
            </button>
          </div>

          {/* Ticket History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Recent Verification Audits ({tickets.length})
            </h4>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-ink flex items-center gap-2">
                      <span>{t.id}</span>
                      <span className="text-[10px] text-ink-secondary font-normal">{t.camName}</span>
                    </div>
                    <div className="text-[11px] text-ink-muted mt-0.5">
                      {t.assignedJE} • CV: {t.cvDepth}cm | Staff: {t.physicalDepth} ({t.delta})
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        t.status === 'VERIFIED'
                          ? 'bg-status-safe-soft text-status-safe'
                          : t.status === 'EN ROUTE'
                          ? 'bg-purple-soft text-purple'
                          : 'bg-amber-500/20 text-amber-700'
                      }`}
                    >
                      {t.status}
                    </span>
                    <div className="text-[10px] text-ink-muted mt-0.5">{t.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-end bg-surface-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-ink hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

