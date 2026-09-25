import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send, QrCode } from 'lucide-react';

export default function RouteShareModal({
  isOpen,
  onClose,
  activeCorridor,
  originLoc,
  destLoc
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `🚨 Safe Flood Route Update (Mumbai Monsoon Intelligence):
Driving from: ${originLoc?.name || 'Powai Hiranandani'}
To: ${destLoc?.name || 'CSMT Airport T2'}
Chosen Corridor: ${activeCorridor.name} (96% Hydro-Safe Elevated Flyover)
Max Water on Route: ${activeCorridor.maxWaterDepthCm} cm
Estimated Arrival: ${activeCorridor.estimatedMinutes} mins
Live Safety Tracker: https://urbanflood.bmc.gov.in/route?corridor=${activeCorridor.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-5 lg:max-h-none lg:overflow-visible">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-extrabold text-ink">Share Safe Route with Family</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-canvas hover:bg-surface-secondary text-ink-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-ink-secondary">
          Transmit your verified elevated corridor, water exposure status, and live ETA to family or fleet dispatchers.
        </p>

        {/* Message Preview Box */}
        <div className="bg-canvas p-3.5 rounded-2xl border border-border font-mono text-xs text-ink space-y-1.5 whitespace-pre-wrap leading-relaxed">
          {shareText}
        </div>

        {/* Sharing Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsApp}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="py-3 px-4 bg-ink hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Route Link'}</span>
          </button>
        </div>

        {/* Simulated QR Code for In-Cab Mobile Sync */}
        <div className="p-3 bg-surface-secondary rounded-2xl border border-border flex items-center gap-3">
          <div className="w-14 h-14 bg-white p-1 rounded-xl border border-border flex items-center justify-center shrink-0">
            <QrCode className="w-12 h-12 text-ink" />
          </div>
          <div className="text-[11px] text-ink-secondary">
            <strong className="text-ink block font-bold">In-Cab Mobile Hand-off</strong>
            Scan QR code with driver’s phone camera to stream live GPS HUD to Android Auto / Apple CarPlay.
          </div>
        </div>
      </div>
    </div>
  );
}
