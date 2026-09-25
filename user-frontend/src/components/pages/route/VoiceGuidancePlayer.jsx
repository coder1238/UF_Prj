import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, Globe } from 'lucide-react';

export default function VoiceGuidancePlayer({
  isVoiceEnabled,
  setIsVoiceEnabled,
  voiceLanguage,
  setVoiceLanguage,
  activeCorridor,
  onSpeak = () => {}
}) {
  const [lastSpoken, setLastSpoken] = useState('Voice guidance initialized for elevated corridor.');

  const sampleMessages = {
    en: "Safe navigation active via JVLR Flyover. Maintain lane discipline. Next 4 kilometers are free of standing water.",
    hi: "सुरक्षित मार्ग सक्रिय है। जेवीएलआर फ्लाईओवर का उपयोग करें। अगले चार किलोमीटर तक कोई जलभराव नहीं है।",
    mr: "सुरक्षित जलमार्ग सुरू आहे. जेव्हीएलआर उड्डाणपुलाचा वापर करा. पुढील ४ किलोमीटर रस्ता कोरडा आहे."
  };

  const handleTestAnnouncement = () => {
    const text = sampleMessages[voiceLanguage] || sampleMessages.en;
    setLastSpoken(text);
    onSpeak(text);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-soft text-primary-deep">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">VOICE AUDIO GUIDANCE (TTS)</span>
            <h4 className="text-xs font-bold text-ink">In-Cab Hydro Voice Synthesizer</h4>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`p-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
            isVoiceEnabled
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-canvas text-ink-muted border-border'
          }`}
        >
          {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isVoiceEnabled ? 'Voice ON' : 'Muted'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border">
        {/* Language selector */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-ink-muted">Language:</span>
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिंदी (Hindi)' },
            { id: 'mr', label: 'मराठी (Marathi)' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setVoiceLanguage(lang.id)}
              className={`px-2 py-0.5 rounded-lg transition ${
                voiceLanguage === lang.id
                  ? 'bg-ink text-white font-bold'
                  : 'bg-canvas text-ink-secondary hover:text-ink'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Audio Test Button */}
        <button
          onClick={handleTestAnnouncement}
          disabled={!isVoiceEnabled}
          className="px-3 py-1 bg-canvas hover:bg-surface-secondary text-ink border border-border rounded-xl text-xs font-mono font-semibold transition disabled:opacity-50"
        >
          Test Announcement
        </button>
      </div>

      {/* Last Spoken Status */}
      <div className="bg-canvas p-2.5 rounded-xl border border-border text-[11px] font-mono text-ink-secondary flex items-start gap-2">
        <Mic className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <span className="truncate italic">"{lastSpoken}"</span>
      </div>
    </div>
  );
}
