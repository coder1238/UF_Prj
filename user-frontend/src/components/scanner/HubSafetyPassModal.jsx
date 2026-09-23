import React, { useState } from 'react';
import { 
  X, Printer, Check, Copy, ShieldCheck, Download, 
  MapPin, Clock, Phone, AlertCircle, QrCode
} from 'lucide-react';

export default function HubSafetyPassModal({ hub, onClose }) {
  if (!hub) return null;

  const [copied, setCopied] = useState(false);

  const passId = `BMC-HUB-${hub.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toLocaleString();

  const handleCopyLink = () => {
    const text = `https://mumbai-flood.gov.in/verify-pass?id=${passId}&hub=${encodeURIComponent(hub.name)}&depth=${hub.waterDepth}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const data = {
      passId,
      hubName: hub.name,
      ward: hub.ward,
      coordinates: hub.coordinates,
      waterDepthCm: hub.waterDepth,
      status: hub.statusLabel,
      severity: hub.severity,
      issuedAt: timestamp,
      opticalConfidence: hub.cctvFeed?.aiConfidence || 98.2,
      emergencyCoordinator: '+91 22 2269 4725 (BMC Disaster Cell)'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafetyPass-${hub.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold uppercase tracking-wider">Official BMC Hub Ingress Pass</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]" id="printable-hub-pass">
          {/* Certificate Header */}
          <div className="border-b-2 border-dashed border-slate-200 pb-5 text-center">
            <div className="inline-block p-2 bg-purple-50 rounded-2xl mb-2">
              <ShieldCheck className="w-8 h-8 text-purple-primary mx-auto" />
            </div>
            <h2 className="text-xl font-extrabold text-ink uppercase tracking-tight">
              Greater Mumbai Disaster Management Cell
            </h2>
            <p className="text-xs font-mono text-muted mt-0.5">
              Rapid Flood Ingress & Transit Clearance Pass
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold rounded-full">
              DOC REF: {passId}
            </span>
          </div>

          {/* Place & Telemetry Details */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-muted uppercase block">Facility / Hub Name</span>
                <span className="font-bold text-sm text-ink">{hub.name}</span>
                <span className="text-muted block">{hub.ward}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-muted uppercase block">Current Depth</span>
                <span className={`text-xl font-black font-mono ${
                  hub.waterDepth > 25 ? 'text-red-600' : hub.waterDepth > 10 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {hub.waterDepth} cm
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-canvas p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-muted uppercase block">Status Verdict</span>
                <span className="font-bold text-ink mt-0.5 block">{hub.statusLabel}</span>
              </div>

              <div className="bg-canvas p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-muted uppercase block">Elevation (MSL)</span>
                <span className="font-bold text-ink mt-0.5 block">+{hub.elevationMSL}m High Ground</span>
              </div>
            </div>

            <div className="bg-canvas p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase block">Approach Road Condition</span>
              <p className="text-slate-700 font-medium leading-relaxed">{hub.approachRoad}</p>
            </div>
          </div>

          {/* QR Verification & Emergency Contacts */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
            {/* Simulated High-Res QR Matrix */}
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-sm shrink-0">
              <div className="w-20 h-20 bg-slate-900 grid grid-cols-5 gap-1 p-1 rounded">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24)
                        ? 'bg-white'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-center block text-slate-500 mt-1">SCAN TO VERIFY</span>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-mono text-[10px] font-bold text-purple-900 uppercase block">
                Verification Details
              </span>
              <p className="text-muted text-[11px]">
                Valid for rapid transit checkpoint verification. Timestamped with BMC radar synchrony.
              </p>
              <div className="text-[11px] font-mono text-ink font-semibold flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-purple-primary" />
                <span>Disaster Desk: 1916 / 022-22694725</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL!' : 'Copy Verification URL'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Audit JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
