import React, { useState } from 'react';
import { X, Globe, Check, Copy, ArrowRight, Volume2, Sparkles, RefreshCw } from 'lucide-react';

export default function MultilingualStudioModal({
  isOpen,
  onClose,
  englishMessage,
  onApplyLanguage,
}) {
  if (!isOpen) return null;

  const [selectedLang, setSelectedLang] = useState('marathi');
  const [copiedKey, setCopiedKey] = useState(null);

  // Regional translations for disaster management in Maharashtra / Western India
  const [translations, setTranslations] = useState({
    english: englishMessage || 'Heavy convective rainfall coupled with high tide will cause severe roadway inundation (20-35cm) in Kurla, Sion, and Andheri subways between 19:00 and 20:30. Avoid low-lying underpasses. Divert to Eastern Freeway. Dial 1916 for emergency assistance.',
    marathi: 'अतिवृष्टी आणि समुद्रातील भरतीमुळे कुर्ला, सायन आणि अंधेरी भुयारी मार्गात 19:00 ते 20:30 दरम्यान 20-35 सेमी पाणी साचण्याची शक्यता आहे. सखल भुयारी मार्ग टाळा. ईस्टर्न फ्रीवेचा वापर करा. आपत्कालीन मदतीसाठी 1916 वर संपर्क साधा.',
    hindi: 'भारी मानसूनी वर्षा और उच्च ज्वार के कारण कुर्ला, सायन और अंधेरी सबवे में शाम 19:00 से 20:30 के बीच 20-35 सेमी गंभीर जलभराव होगा। निचले अंडरपास से बचें। ईस्टर्न फ्रीवे की ओर डायवर्ट करें। आपातकालीन सहायता के लिए 1916 डायल करें।',
    gujarati: 'ભારે વરસાદ અને ભરતીના કારણે કુર્લા, સાયન અને અંધેરી સબવેમાં 19:00 થી 20:30 વચ્ચે 20-35 સેમી પાણી ભરાવાની શક્યતા છે. નીચાણવાળા અંડરપાસ ટાળો. ઇસ્ટર્ન ફ્રીવેનો ઉપયોગ કરો. કટોકટી સહાય માટે 1916 ડાયલ કરો.'
  });

  const languages = [
    { id: 'english', label: 'English', native: 'English', code: 'en-IN', defaultVoice: 'en-IN-Standard-A' },
    { id: 'marathi', label: 'Marathi (State Official)', native: 'मराठी', code: 'mr-IN', defaultVoice: 'mr-IN-Standard-A' },
    { id: 'hindi', label: 'Hindi (National Official)', native: 'हिन्दी', code: 'hi-IN', defaultVoice: 'hi-IN-Standard-B' },
    { id: 'gujarati', label: 'Gujarati (Commercial Metro)', native: 'ગુજરાતી', code: 'gu-IN', defaultVoice: 'gu-IN-Standard-A' },
  ];

  const handleCopy = (key) => {
    navigator.clipboard.writeText(translations[key]);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApply = (key) => {
    if (onApplyLanguage) {
      onApplyLanguage(translations[key]);
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
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Disaster Multi-Language Auto-Translation Studio
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Synchronized CAP multi-lingual blocks for NDMA Sachet &amp; State Emergency Portals
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

        {/* Language Tabs */}
        <div className="px-4 py-2 bg-surface-secondary border-b border-border flex flex-wrap items-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedLang === lang.id
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-surface border border-border text-ink hover:border-purple/40'
              }`}
            >
              <span>{lang.native}</span>
              <span className="text-[10px] opacity-80">({lang.label})</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Language Editor */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
                <span>{languages.find((l) => l.id === selectedLang)?.label} Content</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple">
                  {languages.find((l) => l.id === selectedLang)?.code}
                </span>
              </label>
              <span className="text-[10px] font-mono text-ink-secondary">
                {translations[selectedLang].length} chars (~{Math.round(translations[selectedLang].length / 18)}s TTS)
              </span>
            </div>

            <textarea
              rows={6}
              value={translations[selectedLang]}
              onChange={(e) =>
                setTranslations({ ...translations, [selectedLang]: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-surface-secondary border border-border text-ink text-xs font-sans focus:outline-none focus:border-purple leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleCopy(selectedLang)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-ink text-xs font-semibold flex items-center gap-1 hover:bg-surface-secondary transition-colors"
              >
                {copiedKey === selectedLang ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === selectedLang ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => handleApply(selectedLang)}
                className="px-4 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-colors"
              >
                <span>Apply to Live Broadcast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Regional Synchronized Matrix */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase tracking-wide">
                Synchronized Multi-Dialect Status
              </span>
              <span className="text-[10px] font-mono text-status-safe font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NDMA Approved Grammar
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedLang === lang.id
                      ? 'bg-purple-soft/30 border-purple text-ink'
                      : 'bg-surface-secondary border-border hover:border-purple/30 text-ink-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink">{lang.native} • {lang.label}</span>
                    <span className="text-[10px] font-mono">{translations[lang.id].length} chars</span>
                  </div>
                  <p className="line-clamp-2 text-[11px] leading-relaxed">
                    {translations[lang.id]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between bg-surface-subtle text-[11px] text-ink-secondary">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple" />
            <span>Audio Text-to-Speech compatible with AIR FM and MCGM Disaster sirens</span>
          </div>
          <button
            onClick={() => {
              setTranslations({
                english: englishMessage,
                marathi: 'अतिवृष्टी आणि समुद्रातील भरतीमुळे कुर्ला, सायन आणि अंधेरी भुयारी मार्गात 20-35 सेमी पाणी साचण्याची शक्यता आहे.',
                hindi: 'भारी वर्षा और उच्च ज्वार के कारण कुर्ला, सायन और अंधेरी सबवे में 20-35 सेमी जलभराव होगा।',
                gujarati: 'ભારે વરસાદ અને ભરતીના કારણે કુર્લા, સાયન અને અંધેરી સબવેમાં પાણી ભરાવાની શક્યતા છે.'
              });
            }}
            className="text-xs font-semibold text-purple hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Translations
          </button>
        </div>
      </div>
    </div>
  );
}

