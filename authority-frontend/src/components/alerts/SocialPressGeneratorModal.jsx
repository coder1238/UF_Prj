import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  CheckCircle2,
  MessageSquare,
  Tv,
  ExternalLink,
} from 'lucide-react';

export default function SocialPressGeneratorModal({
  isOpen,
  onClose,
  alertTitle = 'URBAN FLASH FLOOD WARNING',
  message = 'Heavy convective rainfall coupled with high tide will cause severe roadway inundation in Kurla, Sion, and Andheri subways.',
  wards = ['Ward K/E', 'Ward L'],
}) {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState(null);
  const [webhookSent, setWebhookSent] = useState(false);

  const wardString = wards.join(', ');

  const twitterPost = `🚨 EMERGENCY FLOOD ALERT: ${alertTitle}
📍 Affected Wards: ${wardString}
⚠️ ${message.slice(0, 160)}...
📞 Emergency Control: Dial 1916 / 112
#MumbaiRains #MCGMAlert #DisasterResponse @mybmc`;

  const whatsappCard = `*🔴 DISASTER MANAGEMENT UNIT - BMC*
*EMERGENCY PUBLIC SAFETY BULLETIN*

*Hazard:* ${alertTitle}
*Target Wards:* ${wardString}
*Time of Warning:* ${new Date().toLocaleTimeString()} IST

*Summary:*
${message}

*Advisories:*
• Avoid all low-lying railway & arterial subways.
• Do not touch exposed utility poles or standing water.
• Stay indoors unless moving to designated relief shelters.

*Emergency Helpline:* 1916 (Toll-Free, 24x7)
*Citizen Portal:* https://jaldrishti.mcgm.gov.in`;

  const pressTicker = `FLASH / PTI WIRE // MUMBAI DISASTER CONTROL // ${alertTitle.toUpperCase()} ISSUED FOR ${wardString.toUpperCase()} // SEVERE INUNDATION REPORTED // CITIZENS ADVISED TO AVOID SUBWAYS // EMERGENCY HELPLINE 1916 OPERATIONAL // BMC CONTROL ROOM`;

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleWebhookBlast = () => {
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 3000);
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
                Social Media &amp; Newsroom Press Wire Automated Generator
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Auto-formatted civic communication for Twitter/X, WhatsApp Gov Channels &amp; TV News Tickers
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

        {/* Content Tabs / Columns */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Twitter / X Post */}
          <div className="p-4 bg-surface border border-border rounded-xl flex flex-col justify-between shadow-subtle gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-ink uppercase">Twitter / X Post</span>
                <span className="text-[10px] font-mono text-ink-secondary">
                  {twitterPost.length} / 280 Chars
                </span>
              </div>
              <div className="bg-[#111] text-slate-100 p-3 rounded-xl text-xs font-sans whitespace-pre-wrap leading-relaxed border border-border">
                {twitterPost}
              </div>
            </div>

            <button
              onClick={() => handleCopy('x', twitterPost)}
              className="w-full py-1.5 px-3 rounded-lg border border-border bg-surface-secondary hover:bg-border text-ink font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedKey === 'x' ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'x' ? 'Copied X Post!' : 'Copy Post'}</span>
            </button>
          </div>

          {/* WhatsApp Civic Broadcast */}
          <div className="p-4 bg-surface border border-border rounded-xl flex flex-col justify-between shadow-subtle gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-ink uppercase">WhatsApp Gov Channel</span>
                <span className="text-[10px] font-mono text-status-safe font-semibold">
                  Official Green Tick
                </span>
              </div>
              <div className="bg-[#0b141a] text-[#e9edef] p-3 rounded-xl text-[11px] font-sans whitespace-pre-wrap leading-relaxed border border-[#222d34] max-h-48 overflow-y-auto">
                {whatsappCard}
              </div>
            </div>

            <button
              onClick={() => handleCopy('wa', whatsappCard)}
              className="w-full py-1.5 px-3 rounded-lg border border-border bg-surface-secondary hover:bg-border text-ink font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'wa' ? 'Copied WhatsApp Text!' : 'Copy WhatsApp Message'}</span>
            </button>
          </div>

          {/* TV Newsroom Ticker */}
          <div className="p-4 bg-surface border border-border rounded-xl flex flex-col justify-between shadow-subtle gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-ink uppercase">TV News Ticker Wire</span>
                <span className="text-[10px] font-mono text-status-alert font-bold">
                  PTI / ANI FLASH
                </span>
              </div>
              <div className="bg-[#2D0A0A] text-[#FECACA] p-3 rounded-xl text-xs font-mono font-bold leading-relaxed border border-red-900/40">
                {pressTicker}
              </div>
            </div>

            <button
              onClick={() => handleCopy('ticker', pressTicker)}
              className="w-full py-1.5 px-3 rounded-lg border border-border bg-surface-secondary hover:bg-border text-ink font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedKey === 'ticker' ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ticker' ? 'Copied Ticker!' : 'Copy Newsroom Wire'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary">
            {webhookSent ? (
              <span className="text-status-safe font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Webhook payload pushed to PIB &amp; Press Bureau!
              </span>
            ) : (
              <span>Webhooks deliver instant updates to certified media desks.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWebhookBlast}
              className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Multi-Platform Dispatch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

