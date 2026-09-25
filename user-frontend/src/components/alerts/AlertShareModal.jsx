import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send, Share2, Smartphone } from 'lucide-react';

export default function AlertShareModal({ alert, onClose, onToast }) {
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const title = alert.translations?.en?.title || alert.title;
  const message = alert.translations?.en?.message || alert.message;
  const depth = `${alert.waterDepthCm} cm`;
  const directives = (alert.translations?.en?.directives || alert.directives).slice(0, 2).join('; ');

  const shareText = `⚠️ *MUMBAI FLOOD ALERT — ${alert.ward.toUpperCase()}* ⚠️\n\n*Incident:* ${title}\n*Water Depth:* ${depth}\n*Current Status:* ${message}\n*Safety Directives:* ${directives}\n\n🚨 *Emergency Helpline:* BMC Disaster Control 1916 / Police 112\n*Live Portal:* http://localhost:3000/alerts`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    if (onToast) onToast('Emergency alert text copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const twitterText = `⚠️ #MumbaiRains Alert: ${title} (${depth} waterlogging in Ward ${alert.ward}). Avoid area. Dial 1916.`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    const url = `sms:?body=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold">Broadcast Citizen Alert</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Share this geofenced flood warning with family, neighborhood WhatsApp groups, or social networks:
          </p>

          {/* Formatted Text Preview */}
          <div className="bg-canvas border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto select-all">
            {shareText}
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsApp}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Share on WhatsApp
            </button>

            <button
              onClick={handleCopy}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                copied 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-canvas hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
            </button>

            <button
              onClick={handleTwitter}
              className="p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" /> Post to Twitter / X
            </button>

            <button
              onClick={handleSMS}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Smartphone className="w-4 h-4" /> Send via SMS
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

