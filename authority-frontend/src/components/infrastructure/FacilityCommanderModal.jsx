import React, { useState } from 'react';
import {
  Radio,
  Send,
  X,
  AlertTriangle,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Signal,
  Flame,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function FacilityCommanderModal({ asset, onClose, onDispatched }) {
  const { addCommandLog, toggleSiren } = useFloodCommand();
  const [channel, setChannel] = useState(asset.incidentCommander?.radioCh || 'VHF-TAC-01');
  const [priority, setPriority] = useState('FLASH_PRIORITY'); // FLASH_PRIORITY, URGENT, ADVISORY
  const [protocol, setProtocol] = useState('INGRESS_DEFENSE_CODE_RED');
  const [customDirective, setCustomDirective] = useState(
    `IMMEDIATE MANDATE: Ingress Gate 1 & 2 predicted water depth ${asset.predictedDepth}cm. Seal flood gaskets, stage on-site dewatering pumps, verify backup DG fuel reserves, and establish VHF perimeter watch.`
  );
  const [includeSoundAlarm, setIncludeSoundAlarm] = useState(true);
  const [targetPersonnel, setTargetPersonnel] = useState({
    commander: true,
    deputy: true,
    securityGate: true,
    mepLead: true,
  });

  const handleSendTransmission = (e) => {
    e.preventDefault();

    if (includeSoundAlarm) {
      toggleSiren();
    }

    addCommandLog({
      officer: 'Joint Disaster Ops Room (Ops-Lead)',
      type: `TACTICAL_RADIO_ALERT [${priority}]`,
      details: `Dispatched to ${asset.name} via ${channel}: ${customDirective}`,
      status: 'TRANSMITTED & ACKNOWLEDGED',
    });

    onDispatched(`Tactical Emergency Order transmitted to ${asset.incidentCommander?.name || asset.name} via ${channel}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Facility Incident Commander Radio &amp; Dispatch Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold uppercase">
                  Encrypted VHF / TETRA
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Target: {asset.name} ({asset.ward})
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
        <form onSubmit={handleSendTransmission} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Commander Card */}
          <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-mono text-ink-secondary font-bold">Designated On-Site Incident Lead</div>
              <div className="font-bold text-ink text-sm flex items-center gap-1.5">
                {asset.incidentCommander?.name || 'Municipal Facility Superintendent'}
              </div>
              <div className="text-[11px] text-ink-secondary flex items-center gap-3">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-purple" /> {asset.incidentCommander?.phone || '+91 22 2400 0000'}</span>
                <span className="flex items-center gap-1"><Signal className="w-3 h-3 text-status-safe" /> {asset.incidentCommander?.radioCh || 'VHF Ch-01'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-status-safe-soft text-status-safe">
                RADIO LINK ONLINE
              </span>
            </div>
          </div>

          {/* Radio Channel & Priority Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
                Transmission Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-2 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-purple"
              >
                <option value={asset.incidentCommander?.radioCh || 'VHF-TAC-01'}>{asset.incidentCommander?.radioCh || 'VHF-TAC-01'} (Direct Facility Tactical)</option>
                <option value="VHF-DISASTER-MAIN">VHF-DISASTER-MAIN (BMC EOC Channel 14)</option>
                <option value="TETRA-POLICE-09">TETRA Encrypted Police/Disaster Link 09</option>
                <option value="SATCOM-INMARSAT">SATCOM Emergency Inmarsat Terminal</option>
                <option value="SMS-CELL-BROADCAST">Dual-Burst Emergency SMS &amp; IVR Broadcast</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
                Escalation Priority
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { key: 'ADVISORY', label: 'Advisory', color: 'bg-status-safe-soft text-status-safe border-status-safe/30' },
                  { key: 'URGENT', label: 'Urgent', color: 'bg-status-warning-soft text-status-warning border-status-warning/30' },
                  { key: 'FLASH_PRIORITY', label: 'Flash Red', color: 'bg-status-alert-soft text-status-alert border-status-alert/40' },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPriority(p.key)}
                    className={`py-1.5 text-[11px] font-mono font-bold rounded-lg border transition-all ${
                      priority === p.key ? `${p.color} ring-1 ring-offset-1 ring-purple` : 'bg-surface text-ink-secondary border-border'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Directives Preset */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Standard Operating Directive Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'INGRESS_DEFENSE',
                  label: 'Deploy Flood Gates & Sump Overdrive',
                  text: `URGENT ORDER: Predicted depth ${asset.predictedDepth}cm. Erect flood barriers on all ground entrances, activate secondary sump pumps, and clear drainage sumps.`,
                },
                {
                  id: 'CODE_YELLOW_TRIAGE',
                  label: 'Declare Internal Code Yellow Triage',
                  text: `ALERT: Shift all ground floor patients/critical electronics to Upper Tier. Lock elevator sumps at Level 1. Prepare auxiliary fuel tankers.`,
                },
                {
                  id: 'DG_TRANSFER',
                  label: 'Transfer Critical Bus to Elevated DG',
                  text: `POWER DIRECTIVE: Flood waters approaching switchyard ground level. Prepare remote SCADA busbar transfer to rooftop diesel generator within 15 minutes.`,
                },
                {
                  id: 'EVAC_ALERT',
                  label: 'Stage Emergency Rescue Evacuation Convoys',
                  text: `EVACUATION ADVISORY: Prepare non-ambulatory patients and critical records for high-clearance rescue vehicle evacuation via nearest safe corridor.`,
                },
              ].map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setProtocol(template.id);
                    setCustomDirective(template.text);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    protocol === template.id
                      ? 'bg-purple-soft/60 border-purple text-ink font-semibold'
                      : 'bg-surface border-border text-ink-secondary hover:border-purple/40'
                  }`}
                >
                  <div className="font-bold text-[11px] text-ink">{template.label}</div>
                  <div className="text-[10px] text-ink-secondary truncate mt-0.5">{template.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Tactical Message */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Live Dispatch Command Message (VHF Audio Synthesizer + Text Telemetry)
            </label>
            <textarea
              rows={3}
              value={customDirective}
              onChange={(e) => setCustomDirective(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-ink font-mono focus:outline-none focus:border-purple resize-none"
            />
          </div>

          {/* Recipients & Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-secondary/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetPersonnel.commander}
                  onChange={(e) => setTargetPersonnel((p) => ({ ...p, commander: e.target.checked }))}
                  className="rounded text-purple focus:ring-purple"
                />
                <span>Incident Commander</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetPersonnel.securityGate}
                  onChange={(e) => setTargetPersonnel((p) => ({ ...p, securityGate: e.target.checked }))}
                  className="rounded text-purple focus:ring-purple"
                />
                <span>Gate Ingress Force</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetPersonnel.mepLead}
                  onChange={(e) => setTargetPersonnel((p) => ({ ...p, mepLead: e.target.checked }))}
                  className="rounded text-purple focus:ring-purple"
                />
                <span>MEP &amp; Power Engineers</span>
              </label>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-status-alert font-bold">
              <input
                type="checkbox"
                checked={includeSoundAlarm}
                onChange={(e) => setIncludeSoundAlarm(e.target.checked)}
                className="rounded text-status-alert focus:ring-status-alert"
              />
              <Volume2 className="w-3.5 h-3.5" />
              <span>Broadcast EOC Siren Tone</span>
            </label>
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
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Tactical Order to Facility</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

