import React, { useState } from 'react';
import { X, Send, Bell, Smartphone, Radio, CheckCircle2, Users, MessageSquare } from 'lucide-react';

export default function CitizenMobilityBroadcastModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [channel, setChannel] = useState('all'); // 'all' | 'cell_broadcast' | 'whatsapp' | 'sms'
  const [targetWard, setTargetWard] = useState('Ward L & F/N (Kurla & Sion)');
  const [severity, setSeverity] = useState('HIGH');
  const [messageText, setMessageText] = useState(
    'MUNICIPAL FLOOD MOBILITY ADVISORY: LBS Marg (Kurla) and Andheri Subway are IMPASSABLE due to waterlogging (>35cm). Please use Eastern Express Highway & JVLR elevated flyovers. Avoid low-lying underpasses. Dial 1916 for emergency disaster assistance.'
  );
  const [recipientCount, setRecipientCount] = useState(485000);
  const [dispatched, setDispatched] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Bell className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Automated Citizen Mobility Advisory Broadcast
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-alert text-white">
                  Geofenced CAP Alert
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Disseminates road closure detours and transit advisories across Cell Broadcast, WhatsApp, and SMS
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
        <form onSubmit={handleBroadcast} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {dispatched ? (
            <div className="p-6 text-center space-y-3 bg-status-safe-soft rounded-xl border border-status-safe">
              <CheckCircle2 className="w-10 h-10 text-status-safe mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-status-safe">Advisory Broadcast Successfully Dispatched!</h4>
              <p className="text-xs text-ink-secondary font-mono">
                Transmitted via Common Alerting Protocol (CAP-CP) to {recipientCount.toLocaleString()} active cell towers in {targetWard}.
              </p>
            </div>
          ) : (
            <>
              {/* Channel Selector */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Channels', icon: Radio },
                  { id: 'cell_broadcast', label: 'Cell Broadcast', icon: Smartphone },
                  { id: 'whatsapp', label: 'WhatsApp Alert', icon: MessageSquare },
                  { id: 'sms', label: 'Emergency SMS', icon: Users },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setChannel(c.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        channel === c.id
                          ? 'bg-purple text-white border-purple font-bold shadow-subtle'
                          : 'bg-surface border-border text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Targeting Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">
                    Geofenced Target Area
                  </label>
                  <select
                    value={targetWard}
                    onChange={(e) => {
                      setTargetWard(e.target.value);
                      setRecipientCount(e.target.value.includes('Citywide') ? 2200000 : 485000);
                    }}
                    className="w-full px-2.5 py-2 bg-surface-secondary border border-border rounded-lg text-ink"
                  >
                    <option value="Ward L & F/N (Kurla & Sion)">Ward L &amp; F/N (Kurla &amp; Sion)</option>
                    <option value="Ward K/E (Andheri East Corridor)">Ward K/E (Andheri East Corridor)</option>
                    <option value="Ward H/W (Bandra & Khar Subways)">Ward H/W (Bandra &amp; Khar Subways)</option>
                    <option value="All Mumbai Suburban Corridors (Citywide)">All Mumbai Suburban Corridors (Citywide)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">
                    Threat Severity Tag
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-2.5 py-2 bg-surface-secondary border border-border rounded-lg text-ink"
                  >
                    <option value="HIGH">HIGH (Severe Traffic Impairment)</option>
                    <option value="CRITICAL">CRITICAL (Total Submergence / Road Shut)</option>
                    <option value="MODERATE">MODERATE (Water Pooling / Heavy Delay)</option>
                  </select>
                </div>
              </div>

              {/* Message Payload */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono uppercase text-ink-secondary">
                    Citizen Alert Message Body (Max 240 chars)
                  </label>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {messageText.length} / 240 chars
                  </span>
                </div>
                <textarea
                  rows="4"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-lg text-xs font-sans text-ink focus:outline-none focus:border-purple leading-relaxed"
                ></textarea>
              </div>

              {/* Audience Reach Stats */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-secondary uppercase block">Estimated Instant Reach</span>
                  <span className="text-sm font-bold text-ink">
                    ~{recipientCount.toLocaleString()} Citizens
                  </span>
                </div>
                <span className="text-[11px] font-mono text-status-safe font-semibold">
                  Carrier Latency &lt; 4.2s
                </span>
              </div>
            </>
          )}

          {/* Footer inside form */}
          {!dispatched && (
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-ink-muted">Authenticated by Mumbai Disaster Management Cell (MCGM)</span>
              <button
                type="submit"
                className="py-2.5 px-4 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Transmit Geofenced Broadcast
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

