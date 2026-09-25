import React from 'react';
import {
  X,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  Waves,
  Building,
  CheckCircle2,
} from 'lucide-react';

const PLAYBOOKS = [
  {
    id: 'SOP-FLOOD-04',
    title: 'Mithi River Extreme Basin Surcharge Protocol',
    severity: 'RED SEVERE WARNING',
    classification: 'Urban Flash Flood Warning',
    wards: ['Ward L', 'Ward K/E'],
    depth: '35-50 cm',
    channels: ['Cell Broadcast', 'VMS Displays', 'Acoustic Sirens', 'App Push'],
    summary: 'Triggered when Kranti Nagar gauge breaches 3.8m. Immediate river corridor evacuation advisory and subway closure.',
    message: 'CRITICAL EMERGENCY: Mithi River has exceeded danger mark at Kranti Nagar (3.85m). Severe inundation (35-50cm) expected in Kurla, Jarimari, and Kalina within 45 mins. Evacuate ground-level structures to Municipal Shelters immediately. Avoid LBS Marg.',
  },
  {
    id: 'SOP-TIDE-08',
    title: 'High-Tide Storm Surge & Coastal Lockout Protocol',
    severity: 'RED SEVERE WARNING',
    classification: 'High Tide Coastal Lockout Warning',
    wards: ['Ward G/N', 'Ward F/N', 'Ward H/E'],
    depth: '25-40 cm',
    channels: ['Cell Broadcast', 'VMS Displays', 'App Push'],
    summary: 'Spring tide >4.5m coinciding with >60mm/hr cloudburst. All sea outfall flap gates forced closed; backwater pooling in low wards.',
    message: 'COASTAL FLOOD WARNING: Spring high tide (4.62m MSL) lockout active until 21:00. Flap gates shut. Severe backwater inundation in Dadar TT, Hindmata, and Sion Circle. Divert all vehicular traffic to elevated corridors.',
  },
  {
    id: 'SOP-SUBWAY-02',
    title: 'Subway & Underpass Inundation Curfew Protocol',
    severity: 'ORANGE WATCH',
    classification: 'Roadway Inundation Advisory',
    wards: ['Ward K/E', 'Ward L'],
    depth: '20-35 cm',
    channels: ['VMS Displays', 'App Push', 'NDMA Sachet SMS'],
    summary: 'Rapid ponding in Andheri, Milan, and Khar subways. Barricading activated by Traffic Police.',
    message: 'ROADWAY HAZARD ADVISORY: Andheri, Milan, and Kurla subway approaches are experiencing rapid waterlogging (20-35cm). Traffic police have barricaded subway access. Use Gokhale Bridge and Santacruz Flyover for east-west transit.',
  },
  {
    id: 'SOP-DAM-11',
    title: 'Catchment Dam Sluice Discharge Warning',
    severity: 'ORANGE WATCH',
    classification: 'Drainage Surcharge Hazard Alert',
    wards: ['Ward K/E', 'Ward L', 'Ward M/W'],
    depth: '30-45 cm',
    channels: ['Cell Broadcast', 'App Push', 'Acoustic Sirens'],
    summary: 'Upstream reservoir emergency spillway discharge into urban channels.',
    message: 'RIVERINE SURGE ALERT: Upstream catchment gates opened at 14,000 cusecs discharge. Low-lying riverbank settlements along downstream corridors must evacuate to higher ground. Do not enter water channels.',
  },
  {
    id: 'SOP-ALLCLEAR-01',
    title: 'Post-Event De-escalation & All-Clear Protocol',
    severity: 'GREEN ALL-CLEAR',
    classification: 'All-Clear Normalcy Restored',
    wards: ['Ward K/E', 'Ward L', 'Ward F/N', 'Ward G/N'],
    depth: '<10 cm',
    channels: ['VMS Displays', 'App Push', 'Citizen App'],
    summary: 'Floodwaters pumped out and receded below hazard thresholds. Normal vehicular transit safe.',
    message: 'ALL CLEAR ADVISORY: Floodwaters have receded across Andheri, Kurla, and Sion underpasses. Subways reopened for traffic. Municipal pumping stations returning to baseline operation. Emergency conditions de-escalated.',
  },
];

export default function EmergencyPlaybooksModal({
  isOpen,
  onClose,
  onLoadPlaybook,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Standard Operating Procedure (SOP) Flood Contingency Playbooks
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Pre-authorized NDMA / MCGM Disaster Management protocols ready for instant blast
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

        {/* Playbooks List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {PLAYBOOKS.map((pb) => (
            <div
              key={pb.id}
              className="p-4 rounded-xl border border-border bg-surface hover:border-purple/40 transition-all shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-purple">{pb.id}</span>
                  <h4 className="font-bold text-xs text-ink">{pb.title}</h4>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      pb.severity.includes('RED')
                        ? 'bg-status-alert-soft text-status-alert'
                        : pb.severity.includes('ORANGE')
                        ? 'bg-status-warning-soft text-status-warning'
                        : 'bg-status-safe-soft text-status-safe'
                    }`}
                  >
                    {pb.severity}
                  </span>
                </div>

                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  {pb.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-ink-secondary pt-1">
                  <span>Wards: <strong className="text-ink">{pb.wards.join(', ')}</strong></span>
                  <span>Depth: <strong className="text-ink">{pb.depth}</strong></span>
                  <span>Channels: <strong className="text-purple">{pb.channels.join(' • ')}</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onLoadPlaybook) {
                    onLoadPlaybook(pb);
                  }
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-subtle transition-colors shrink-0"
              >
                <span>Load Playbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary">
          <span>Playbooks comply with NDMA Guidelines for Management of Urban Flooding (Section 5.4).</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-ink font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

