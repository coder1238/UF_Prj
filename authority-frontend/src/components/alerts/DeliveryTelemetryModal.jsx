import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  Smartphone,
  Radio,
  Clock,
  AlertTriangle,
  RefreshCw,
  Users,
  ShieldCheck,
} from 'lucide-react';

export default function DeliveryTelemetryModal({
  isOpen,
  onClose,
  alert = {
    id: 'AL-0841',
    title: 'FLASH FLOOD INUNDATION WARNING',
    audienceReach: '480,000 citizens',
  },
}) {
  if (!isOpen) return null;

  const [ticker, setTicker] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const carriers = [
    { name: 'Reliance Jio 4G/5G', packetsSent: 284000, ackRate: 98.7, latency: '1.1s', status: 'HEALTHY' },
    { name: 'Bharti Airtel 4G/5G', packetsSent: 162000, ackRate: 98.2, latency: '1.4s', status: 'HEALTHY' },
    { name: 'Vodafone Idea (Vi)', packetsSent: 48000, ackRate: 96.5, latency: '2.1s', status: 'HEALTHY' },
    { name: 'BSNL Mobile GSM', packetsSent: 18000, ackRate: 94.1, latency: '3.6s', status: 'MINOR_LATENCY' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Activity className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Delivery Telemetry &amp; Citizen Handset Handshake Analytics
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Tracking target alert: {alert.id} • Real-time carrier broadcast confirmation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1 transition-colors ${
                autoRefresh ? 'bg-status-safe-soft text-status-safe font-bold' : 'bg-surface-secondary text-ink-secondary'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Live Streaming' : 'Paused'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-subtle border-b border-border">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono uppercase text-ink-secondary block">
              Handsets Reached
            </span>
            <div className="text-xl font-bold font-mono text-ink mt-0.5">
              472,840
            </div>
            <span className="text-[10px] font-mono text-status-safe font-bold">
              98.5% of target radius
            </span>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono uppercase text-ink-secondary block">
              Cell Broadcast Latency
            </span>
            <div className="text-xl font-bold font-mono text-purple mt-0.5">
              1.28s
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              eNodeB blast velocity
            </span>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono uppercase text-ink-secondary block">
              Citizen Read / ACK
            </span>
            <div className="text-xl font-bold font-mono text-status-alert mt-0.5">
              341,200
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              72.1% screen opens
            </span>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono uppercase text-ink-secondary block">
              Safe Route Tap Rate
            </span>
            <div className="text-xl font-bold font-mono text-status-safe mt-0.5">
              88,410
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              Navigated away from hazard
            </span>
          </div>
        </div>

        {/* Carrier Breakdown Table */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          <span className="text-xs font-bold text-ink uppercase tracking-wide block">
            Telecom Carrier BTS Throughput &amp; Radio Delivery Rates
          </span>

          <div className="space-y-2.5">
            {carriers.map((c) => (
              <div
                key={c.name}
                className="p-3.5 bg-surface-secondary/60 rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{c.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        c.status === 'HEALTHY'
                          ? 'bg-status-safe-soft text-status-safe'
                          : 'bg-status-warning-soft text-status-warning'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-ink-secondary flex items-center gap-4">
                    <span>Packets: {c.packetsSent.toLocaleString()}</span>
                    <span>Carrier Latency: {c.latency}</span>
                  </div>
                </div>

                <div className="w-full md:w-56 font-mono self-end md:self-auto">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-secondary text-[11px]">Delivery Rate:</span>
                    <span className="font-bold text-ink">{c.ackRate}%</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.ackRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Timeline / Channels Histogram */}
          <div className="mt-4 p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wide block">
              Dissemination Speed Profile (T+0s to T+60s)
            </span>
            <div className="grid grid-cols-6 gap-2 text-center font-mono text-[10px]">
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">0-5s</span>
                <span className="font-bold text-purple text-xs">Cell BC (85%)</span>
              </div>
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">5-10s</span>
                <span className="font-bold text-purple text-xs">VMS LED (100%)</span>
              </div>
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">10-20s</span>
                <span className="font-bold text-purple text-xs">Sirens Armed</span>
              </div>
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">20-40s</span>
                <span className="font-bold text-purple text-xs">App Push (92%)</span>
              </div>
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">40-60s</span>
                <span className="font-bold text-purple text-xs">SMS Blast (88%)</span>
              </div>
              <div className="bg-purple-soft/40 p-2 rounded-lg border border-purple/20">
                <span className="text-ink-secondary block">&gt;60s</span>
                <span className="font-bold text-purple text-xs">WhatsApp API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary font-mono">
          <span>Telecommunications regulatory logs certified under DoT Alert Directive 2026.</span>
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

