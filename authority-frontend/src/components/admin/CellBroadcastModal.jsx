import React, { useState } from 'react';
import { X, Radio, Smartphone, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CellBroadcastModal({ onClose, onBroadcastSuccess }) {
  const [targetWard, setTargetWard] = useState('Ward K/E (Andheri East)');
  const [severity, setSeverity] = useState('EXTREME (Life Safety Threat)');
  const [language, setLanguage] = useState('en');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const TEMPLATES = {
    en: 'EMERGENCY ALERT (MCGM/NDMA): Severe waterlogging at Andheri Subway & Milan Subway (>40cm). Avoid low-lying underpasses immediately. Dial 1916 for boat rescue.',
    mr: 'तातडीची पूर चेतावणी (मनपा / आपत्ती व्यवस्थापन): अंधेरी भुयारी मार्ग व मिलन सबवे येथे तीव्र पाणी साचले आहे (>४० सेमी). कृपया सखल भागात जाणे टाळा. मदतीसाठी १९१६ वर संपर्क करा.',
    hi: 'आपातकालीन चेतावनी (मनपा / एनडीएमए): अंधेरी सबवे और मिलन सबवे में गंभीर जलभराव (>40 सेमी)। तुरंत निचले इलाकों में जाने से बचें। आपातकालीन सहायता के लिए 1916 डायल करें।',
  };

  const [message, setMessage] = useState(TEMPLATES.en);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMessage(TEMPLATES[lang]);
  };

  const handleSendTestBroadcast = () => {
    setIsTransmitting(true);
    // Web Audio alert beep
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(853, ctx.currentTime);
        osc.frequency.setValueAtTime(960, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch {
        // audio context fallback
      }
    }

    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      if (onBroadcastSuccess) {
        onBroadcastSuccess({
          ward: targetWard,
          severity,
          message,
          timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-alert text-white">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                CAP-v1.2 XML / National Cell Broadcast Gateway (CBC)
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Direct Geo-Targeted Tower Broadcast via DoT / Telecom Operators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
          {/* Left Configuration (7 cols) */}
          <div className="md:col-span-7 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Target Geo-Fenced Ward Polygon
              </label>
              <select
                value={targetWard}
                onChange={(e) => setTargetWard(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
              >
                <option value="Ward K/E (Andheri East)">Ward K/E (Andheri East &amp; Subway)</option>
                <option value="Ward L (Kurla &amp; Mithi River)">Ward L (Kurla &amp; Mithi River)</option>
                <option value="Ward G/N (Dadar, Dharavi, Mahim)">Ward G/N (Dadar, Dharavi, Mahim)</option>
                <option value="Ward F/N (Sion Circle &amp; Matunga)">Ward F/N (Sion Circle &amp; Matunga)</option>
                <option value="All 24 Wards (Citywide Red Alert)">All 24 Wards (Citywide Broadcast)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Emergency Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
              >
                <option value="EXTREME (Life Safety Threat)">EXTREME (Life Safety Threat - Sound Siren)</option>
                <option value="SEVERE (Inundation Danger)">SEVERE (Inundation Danger - High Clearance Only)</option>
                <option value="ADVISORY (Travel Caution)">ADVISORY (Travel Caution - Low Risk)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-ink-secondary uppercase">
                  Alert Message Content
                </label>
                <div className="flex items-center gap-1">
                  {[
                    { key: 'en', label: 'English' },
                    { key: 'mr', label: 'मराठी' },
                    { key: 'hi', label: 'हिंदी' },
                  ].map((l) => (
                    <button
                      key={l.key}
                      type="button"
                      onClick={() => handleLanguageChange(l.key)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        language === l.key
                          ? 'bg-purple text-white'
                          : 'bg-surface-secondary text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink text-xs font-sans leading-relaxed focus:outline-none focus:border-purple"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-secondary mt-1">
                <span>Characters: {message.length}/360</span>
                <span>Max 1 Alert / 15 min per polygon</span>
              </div>
            </div>

            {/* Carrier Gateways status */}
            <div className="p-3 bg-surface-secondary rounded-xl font-mono text-[10px] space-y-1.5">
              <div className="text-ink font-bold uppercase pb-1 border-b border-border flex items-center justify-between">
                <span>Telecom Operator CBC Links</span>
                <span className="text-status-safe font-bold">ALL CONNECTED</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Jio CBC:</span>
                  <span className="text-status-safe font-bold">ACTIVE (18ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Airtel CBC:</span>
                  <span className="text-status-safe font-bold">ACTIVE (22ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Vodafone-Idea:</span>
                  <span className="text-status-safe font-bold">ACTIVE (29ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">BSNL MTNL:</span>
                  <span className="text-status-safe font-bold">ACTIVE (35ms)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Mobile Phone Lockscreen Mockup (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="text-[11px] font-bold text-ink-secondary uppercase mb-2 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple" />
              <span>Simulated Citizen Mobile View</span>
            </div>

            <div className="w-[220px] h-[370px] bg-ink rounded-[32px] p-3 shadow-elevated border-4 border-slate-700 flex flex-col justify-between relative overflow-hidden text-white font-sans">
              {/* Notch */}
              <div className="w-20 h-4 bg-black rounded-b-xl mx-auto flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* Time display */}
              <div className="text-center mt-2">
                <div className="text-2xl font-bold font-mono">18:35</div>
                <div className="text-[9px] text-slate-400">Wednesday, 23 September</div>
              </div>

              {/* Lockscreen Alert Popup Card */}
              <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md animate-pulse">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-[10px] uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>NATIONAL EMERGENCY ALERT</span>
                </div>
                <div className="text-[10px] text-white/95 font-medium mt-1 leading-snug">
                  {message}
                </div>
                <div className="mt-2 text-[8px] font-mono text-slate-300 flex justify-between border-t border-red-800 pt-1">
                  <span>MCGM / NDMA CELL BROADCAST</span>
                  <span>TAP TO SNOOZE</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="w-16 h-1 bg-slate-600 rounded-full mx-auto mb-1" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ink-secondary">
            {transmitted && (
              <span className="text-status-safe font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                BROADCAST EMITTED TO TOWERS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isTransmitting}
              onClick={handleSendTestBroadcast}
              className="px-4 py-2 bg-status-alert text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
            >
              {isTransmitting ? (
                <>
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING VIA CARRIER TOWER...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Cell Broadcast</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
