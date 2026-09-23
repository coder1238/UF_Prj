import React, { useState } from 'react';
import { 
  X, Share2, Users, Send, CheckCircle2, 
  Copy, QrCode, Smartphone, ShieldCheck 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDFamilyShareModal({
  isOpen = false,
  onClose = () => {},
  eta = '14 min',
  currentCorridor = 'BKC Elevated Connector',
  speed = 32
}) {
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const trackingUrl = `https://mumbai-flood-citizen.gov.in/track/tr-8849?lat=19.0682&lng=72.8791&eta=${encodeURIComponent(eta)}`;

  const contacts = [
    { name: 'Papa (Mobile)', phone: '+91 98201 44821', status: 'Linked' },
    { name: 'Pooja (Sister)', phone: '+91 99302 91823', status: 'Linked' },
    { name: 'Home Emergency Group', phone: 'WhatsApp Broadcast', status: 'Active' }
  ];

  const handleCopyLink = () => {
    hudAudio.playClick();
    navigator.clipboard?.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSMS = () => {
    setIsSending(true);
    hudAudio.playTurnChime();

    setTimeout(() => {
      setIsSending(false);
      setSmsSent(true);
      setTimeout(() => setSmsSent(false), 3000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Family Safety Circle Live Beacon</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Share real-time GPS transit telemetry & flood clearance status
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code & Live Link Box */}
        <div className="my-5 p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
          {/* Simulated SVG QR Code */}
          <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
              {/* Outer corners */}
              <rect x="5" y="5" width="28" height="28" fill="black" />
              <rect x="9" y="9" width="20" height="20" fill="white" />
              <rect x="13" y="13" width="12" height="12" fill="black" />

              <rect x="67" y="5" width="28" height="28" fill="black" />
              <rect x="71" y="9" width="20" height="20" fill="white" />
              <rect x="75" y="13" width="12" height="12" fill="black" />

              <rect x="5" y="67" width="28" height="28" fill="black" />
              <rect x="9" y="71" width="20" height="20" fill="white" />
              <rect x="13" y="75" width="12" height="12" fill="black" />

              {/* Data dots */}
              <rect x="38" y="10" width="8" height="8" />
              <rect x="50" y="20" width="8" height="8" />
              <rect x="38" y="38" width="14" height="14" />
              <rect x="60" y="45" width="8" height="8" />
              <rect x="75" y="55" width="10" height="10" />
              <rect x="42" y="72" width="12" height="8" />
              <rect x="68" y="78" width="10" height="10" />
            </svg>
          </div>

          <div className="flex-1 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Ground Safe Transit
              </span>
              <span className="text-[10px] font-mono text-muted">• ETA: {eta}</span>
            </div>
            <p className="text-xs text-muted font-mono leading-relaxed">
              Family members can track your vehicle's live water depth clearance, speed ({speed} km/h), and battery status without installing an app.
            </p>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white flex items-center gap-2 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Live Tracking URL'}</span>
            </button>
          </div>
        </div>

        {/* Emergency SMS Contact List */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-mono uppercase text-muted block">Emergency Circle Contacts</span>
          {contacts.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-white block">{c.name}</span>
                <span className="text-[10px] text-muted">{c.phone}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {smsSent ? (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Dispatched to 3 Emergency Contacts via SMS/WhatsApp!</span>
            </div>
          ) : (
            <button
              onClick={handleSendSMS}
              disabled={isSending}
              className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-xs font-bold shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Transmitting Live Beacon...' : 'DISPATCH INSTANT STATUS SMS TO CIRCLE'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

