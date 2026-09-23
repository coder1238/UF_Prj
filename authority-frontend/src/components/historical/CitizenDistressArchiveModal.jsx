import React from 'react';
import { X, PhoneCall } from 'lucide-react';

export default function CitizenDistressArchiveModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const DISTRESS_CALL_LOGS = [
    { type: 'Vehicle Stranded in Underpass', count: 1840, share: '38%', avgDispatchMins: 14, priority: 'CRITICAL', notes: 'Automated barrier interlock reduces rescue requirements' },
    { type: 'Residential Ground Floor Inundation', count: 1210, share: '25%', avgDispatchMins: 22, priority: 'HIGH', notes: 'Dewatering pump crew deployment to low-lying chawls' },
    { type: 'Fallen Tree / Road Obstruction', count: 760, share: '16%', avgDispatchMins: 18, priority: 'MODERATE', notes: 'Garden dept motorized woodcutter chainsaws' },
    { type: 'Open Manhole Cover / Gutter Hazard', count: 580, share: '12%', avgDispatchMins: 9, priority: 'CRITICAL', notes: 'Iron grill safety net installed on 98.4% of city manholes' },
    { type: 'Power Sub-Station Water Ingress', count: 440, share: '9%', avgDispatchMins: 12, priority: 'HIGH', notes: 'Disaster management pre-emptive power isolation' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Historical Citizen Emergency SOS &amp; Helpline 1916 Distress Call Archive
              </h2>
              <p className="text-xs text-ink-secondary">
                10-Year Public Safety Telemetry • Call-to-Cloudburst Ingress Correlation &amp; Emergency Dispatch Latency (2015–2025)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Peak Event 1916 Calls</span>
              <div className="text-2xl font-bold font-mono text-status-alert mt-0.5">4,892 Calls</div>
              <span className="text-[10px] text-purple font-mono">29 Aug 2025 Cloudburst</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Mean Dispatch Latency</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">14.8 Mins</div>
              <span className="text-[10px] text-status-safe font-mono font-bold">-38.4% Faster vs 2018</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Resolution Compliance</span>
              <div className="text-2xl font-bold font-mono text-purple mt-0.5">96.8%</div>
              <span className="text-[10px] text-ink-secondary font-mono">Dispatched within SOP window</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Citizen Lives Evacuated</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">14,200+</div>
              <span className="text-[10px] text-status-safe font-mono font-bold">Zero Drowning Casualties 2025</span>
            </div>
          </div>

          {/* Distress Type Distribution */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              Distress Incident Taxonomy &amp; Dispatch Performance
            </h4>
            <div className="space-y-3">
              {DISTRESS_CALL_LOGS.map((item, i) => (
                <div key={i} className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.priority === 'CRITICAL' ? 'bg-status-alert-soft text-status-alert' :
                        item.priority === 'HIGH' ? 'bg-status-warning-soft text-status-warning' :
                        'bg-purple-soft text-purple'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="font-bold text-xs text-ink">{item.type}</span>
                    </div>
                    <p className="text-[11px] text-ink-secondary">{item.notes}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-ink-secondary text-[10px]">Calls Logged</span>
                      <div className="font-bold text-ink">{item.count.toLocaleString()} ({item.share})</div>
                    </div>
                    <div>
                      <span className="text-ink-secondary text-[10px]">Avg Response</span>
                      <div className="font-bold text-status-safe">{item.avgDispatchMins} mins</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Integrated with Disaster Management Control Room CAD (Computer-Aided Dispatch)</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
}
