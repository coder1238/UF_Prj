import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Radio,
  Send,
  CheckCircle2,
  Bell,
  Layers,
  Code,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function SevereAlertDispatcherModal({ isOpen, onClose, selectedCell }) {
  const { publishAlert } = useFloodCommand();

  const [severity, setSeverity] = useState('CRITICAL');
  const [selectedWards, setSelectedWards] = useState(['Ward K/E', 'Ward L', 'Ward F/N']);
  const [channels, setChannels] = useState(['Cell Broadcast', 'Citizen App', 'Traffic VMS']);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const WARDS_OPTIONS = [
    'Ward K/E (Andheri E)',
    'Ward L (Kurla/LBS)',
    'Ward F/N (Sion/Matunga)',
    'Ward G/N (Dadar/Mahim)',
    'Ward H/E (Santacruz E)',
    'Ward H/W (Bandra W)',
    'Ward S (Bhandup)',
    'Ward T (Mulund)',
  ];

  const CHANNELS_OPTIONS = [
    'Cell Broadcast (Geo-targeted SMS)',
    'Citizen App (JalDrishti Push)',
    'Traffic VMS (Variable Message Displays)',
    'NDMA / SEOC Emergency Line',
    'BMC Disaster Siren Towers',
  ];

  const toggleWard = (w) => {
    setSelectedWards((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const toggleChannel = (c) => {
    setChannels((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleDispatch = () => {
    const newAlert = {
      id: `AL-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `DOPPLER NOWCAST: ${severity} CONVECTIVE CLOUDBURST ALERT`,
      wards: selectedWards,
      status: 'PUBLISHED - ACTIVE',
      timestamp: 'Just now (18:32 IST)',
      audienceReach: `${(selectedWards.length * 160000).toLocaleString()} citizens`,
      depthRange: selectedCell?.dbz >= 60 ? '30–50 cm' : '15–30 cm',
      channels: channels,
    };

    publishAlert(newAlert);
    setIsDispatched(true);
    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 2000);
  };

  const capPayload = {
    identifier: `IN-MCGM-NOWCAST-${Date.now()}`,
    sender: 'imd_colaba_radar@mcgm.gov.in',
    sent: new Date().toISOString(),
    status: 'Actual',
    msgType: 'Alert',
    scope: 'Public',
    info: {
      category: 'Met',
      event: 'Extreme Convective Rain / Flash Flood Surcharge',
      urgency: 'Immediate',
      severity: severity,
      certainty: 'Observed',
      headline: `Severe Convective Cell ${selectedCell?.id || 'C-01'} tracking northeast with rain rates >85 mm/hr`,
      area: {
        areaDesc: selectedWards.join(', '),
        polygon: '19.04,72.84 19.08,72.89 19.12,72.86 19.09,72.82',
      },
      channels: channels,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft text-status-alert flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                CAP Severe Meteorological Alert Dispatcher
              </h3>
              <p className="text-xs text-ink-secondary">
                Common Alerting Protocol (ITU-T X.1303) Flash Flood Warning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Severity Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Alert Urgency &amp; Severity Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ADVISORY', label: 'Yellow Advisory', sub: '30–50 mm/hr' },
                { id: 'WARNING', label: 'Orange Warning', sub: '50–80 mm/hr' },
                { id: 'CRITICAL', label: 'Red Cloudburst', sub: '> 80 mm/hr (Emergency)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col ${
                    severity === s.id
                      ? s.id === 'CRITICAL'
                        ? 'bg-status-alert-soft border-status-alert text-status-alert font-bold shadow-sm'
                        : 'bg-status-warning-soft border-status-warning text-status-warning font-bold shadow-sm'
                      : 'bg-surface-secondary border-border text-ink'
                  }`}
                >
                  <span className="text-xs">{s.label}</span>
                  <span className="text-[10px] text-ink-secondary font-mono">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Wards Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Target Inundation Wards (Geo-Fence Envelope)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
              {WARDS_OPTIONS.map((w) => (
                <button
                  key={w}
                  onClick={() => toggleWard(w)}
                  className={`p-2 rounded-lg text-xs font-mono border transition-all text-left ${
                    selectedWards.includes(w)
                      ? 'bg-purple-soft text-purple border-purple font-semibold'
                      : 'bg-surface-secondary text-ink-secondary border-border hover:border-purple/30'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Channels */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Public Safety Dissemination Vectors
            </label>
            <div className="space-y-1.5">
              {CHANNELS_OPTIONS.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2.5 p-2 bg-surface-secondary rounded-lg border border-border text-xs cursor-pointer hover:bg-surface transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={channels.includes(c)}
                    onChange={() => toggleChannel(c)}
                    className="rounded accent-purple"
                  />
                  <span className="font-medium text-ink">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payload Preview Toggle */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={() => setShowJsonPreview(!showJsonPreview)}
              className="text-xs font-mono text-purple hover:underline flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              {showJsonPreview ? 'Hide CAP XML/JSON Payload' : 'View CAP v1.2 Standard Payload'}
            </button>
            <span className="text-[11px] font-mono text-ink-secondary">
              Estimated Reach: ~{(selectedWards.length * 160000).toLocaleString()} recipients
            </span>
          </div>

          {showJsonPreview && (
            <pre className="bg-[#14111B] text-status-safe font-mono text-[10px] p-3 rounded-xl border border-border overflow-x-auto max-h-40">
              {JSON.stringify(capPayload, null, 2)}
            </pre>
          )}

          {isDispatched && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>CAP Alert successfully broadcast across all selected emergency channels!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            disabled={isDispatched || selectedWards.length === 0}
            className="px-5 py-2 rounded-lg bg-status-alert text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-elevated disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Broadcast Emergency CAP Alert
          </button>
        </div>
      </div>
    </div>
  );
}

