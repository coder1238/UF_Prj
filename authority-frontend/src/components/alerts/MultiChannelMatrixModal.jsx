import React, { useState } from 'react';
import {
  X,
  Share2,
  Radio,
  MessageSquare,
  Tv,
  Volume2,
  Smartphone,
  Send,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react';

const INITIAL_CHANNELS = [
  {
    id: 'cbc',
    name: 'Cell Broadcast Service (CBC)',
    protocol: '3GPP TS 23.041 / WEA 3.0',
    icon: Radio,
    enabled: true,
    latency: '1.2s',
    throughput: '450,000 / sec',
    gateway: 'DoT / C-DOT CBC Gateway',
    redundancy: 'Quadruple Telco Link',
    status: 'OPERATIONAL',
  },
  {
    id: 'sachet',
    name: 'NDMA Sachet SMS Gateway',
    protocol: 'SMPP v3.4 over TLS',
    icon: MessageSquare,
    enabled: true,
    latency: '14.8s',
    throughput: '8,500 sms / sec',
    gateway: 'C-DAC Sachet Hub Pune',
    redundancy: 'Primary + Disaster DR',
    status: 'OPERATIONAL',
  },
  {
    id: 'vms',
    name: 'Roadside VMS LED Gantries',
    protocol: 'NTCIP 1203 v03',
    icon: Tv,
    enabled: true,
    latency: '3.4s',
    throughput: '24 Displays Active',
    gateway: 'MCGM Traffic Command Center',
    redundancy: 'Optical Fiber Ring',
    status: 'OPERATIONAL',
  },
  {
    id: 'siren',
    name: 'Municipal Acoustic Sirens',
    protocol: 'Modbus TCP / LoRaWAN 865MHz',
    icon: Volume2,
    enabled: true,
    latency: '0.8s',
    throughput: '18 Stations Armed',
    gateway: 'Civil Defense Master Node',
    redundancy: 'Solar + VHF Radio Fallback',
    status: 'OPERATIONAL',
  },
  {
    id: 'app_push',
    name: 'JalDrishti Citizen Mobile App Push',
    protocol: 'HTTP/2 FCM v1 & APNS',
    icon: Smartphone,
    enabled: true,
    latency: '2.1s',
    throughput: '120,000 pushes / sec',
    gateway: 'Google Cloud Pub/Sub',
    redundancy: 'Multi-Region High Availability',
    status: 'OPERATIONAL',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Official Disaster Bot',
    protocol: 'Meta Cloud API v20.0',
    icon: MessageSquare,
    enabled: true,
    latency: '4.2s',
    throughput: '2,500 msgs / sec',
    gateway: 'Infobip Enterprise Gateway',
    redundancy: 'Dual Carrier Webhook',
    status: 'OPERATIONAL',
  },
  {
    id: 'fm_radio',
    name: 'AIR FM Emergency Interrupt (RDS)',
    protocol: 'EAS-CAP Subcarrier Tone',
    icon: Radio,
    enabled: false,
    latency: '8.5s',
    throughput: '6 Metro FM Frequencies',
    gateway: 'All India Radio Worli Transmitter',
    redundancy: 'Manual Audio Patch',
    status: 'STANDBY',
  },
  {
    id: 'social',
    name: 'Public Safety Social Webhooks (X/Meta)',
    protocol: 'RESTful Webhooks (HMAC-SHA256)',
    icon: Share2,
    enabled: true,
    latency: '1.9s',
    throughput: 'Instant Broadcast',
    gateway: 'MCGM IT Cell Social API',
    redundancy: 'Direct Graph API',
    status: 'OPERATIONAL',
  },
];

export default function MultiChannelMatrixModal({
  isOpen,
  onClose,
  onUpdateChannels,
}) {
  if (!isOpen) return null;

  const [channels, setChannels] = useState(INITIAL_CHANNELS);

  const toggleChannel = (id) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
    );
  };

  const activeCount = channels.filter((c) => c.enabled).length;

  const handleSave = () => {
    if (onUpdateChannels) {
      onUpdateChannels(channels.filter((c) => c.enabled).map((c) => c.name));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Multi-Channel Dissemination Matrix &amp; Gateway Health Orchestrator
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Simultaneous multi-path alert blast across cellular, highway VMS, acoustic, app push &amp; civic social
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

        {/* Global Pipeline Health Banner */}
        <div className="px-5 py-3 bg-surface-secondary border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold font-mono text-status-safe">
              <Activity className="w-4 h-4 animate-spin" />
              <span>{activeCount} of {channels.length} CHANNELS ARMED</span>
            </span>
            <span className="text-ink-secondary">•</span>
            <span className="text-ink-secondary font-mono">
              Avg Pipeline Latency: 2.8s
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
              ALL GATEWAYS GREEN
            </span>
          </div>
        </div>

        {/* Channel Grid */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                  channel.enabled
                    ? 'bg-surface border-border shadow-subtle'
                    : 'bg-surface-secondary/70 border-border/80 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        channel.enabled
                          ? 'bg-purple-soft text-purple'
                          : 'bg-surface border border-border text-ink-secondary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink">{channel.name}</h4>
                      <p className="text-[10px] font-mono text-ink-secondary mt-0.5">
                        {channel.protocol}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      channel.enabled ? 'bg-purple' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        channel.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-[10px] font-mono">
                  <div>
                    <span className="text-ink-secondary block">Latency</span>
                    <span className="font-bold text-ink">{channel.latency}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Throughput</span>
                    <span className="font-bold text-purple">{channel.throughput}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Status</span>
                    <span
                      className={`font-bold ${
                        channel.status === 'OPERATIONAL'
                          ? 'text-status-safe'
                          : 'text-status-warning'
                      }`}
                    >
                      {channel.status}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-ink-secondary flex items-center justify-between font-mono bg-surface-subtle px-2 py-1 rounded border border-border/60">
                  <span className="truncate">Hub: {channel.gateway}</span>
                  <span className="text-purple font-semibold">{channel.redundancy}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="text-xs text-ink-secondary font-mono">
            Channels adhere to NDMA Common Alerting Protocol dissemination hierarchy.
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Selected Channels ({activeCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

