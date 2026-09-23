import React, { useState } from 'react';
import { X, Navigation, ShieldCheck, AlertTriangle, Volume2, ArrowRight, CornerUpRight, CornerUpLeft } from 'lucide-react';
import { TURN_BY_TURN_GUIDANCE } from './mobilityConstants';

export default function TurnByTurnGuidanceDrawer({ isOpen, onClose, routeName }) {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState(1);
  const [audioPrompt, setAudioPrompt] = useState(null);

  const playVoicePrompt = (text) => {
    setAudioPrompt(`CAD Audio Voice Dispatch: "${text}"`);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // Fallback gracefully
      }
    }
    setTimeout(() => setAudioPrompt(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border-l border-border w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 px-6 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Turn-by-Turn Hazard Navigator</h3>
              <p className="text-xs text-ink-secondary">
                Corridor: {routeName || 'Recommended Flood-Aware Route'}
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {audioPrompt && (
            <div className="p-3 rounded-xl bg-purple-soft border border-purple text-purple font-mono text-xs flex items-center gap-2">
              <Volume2 className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span>{audioPrompt}</span>
            </div>
          )}

          {/* Guidance Sequence */}
          <div className="space-y-3">
            {TURN_BY_TURN_GUIDANCE.map((step) => {
              const isCurrent = activeStep === step.step;
              const isPast = activeStep > step.step;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-purple-soft/40 border-purple shadow-elevated'
                      : isPast
                      ? 'bg-surface-secondary/30 border-border opacity-60'
                      : 'bg-surface border-border hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          isCurrent
                            ? 'bg-purple text-white'
                            : isPast
                            ? 'bg-status-safe text-white'
                            : 'bg-surface-secondary text-ink'
                        }`}
                      >
                        {step.step}
                      </span>
                      <span className="font-bold text-xs text-ink">{step.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      {step.distanceM}m &bull; {step.durationSec}s
                    </span>
                  </div>

                  <p className="text-xs text-ink font-medium mt-2 leading-relaxed">
                    {step.instruction}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-ink-muted block text-[10px]">Road Bed Type</span>
                      <span className="font-semibold text-purple">{step.roadType}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px]">Speed &amp; Flood Level</span>
                      <span className="font-mono font-semibold text-ink">
                        {step.speedLimitKmh} km/h &bull;{' '}
                        <span className={step.waterHazardCm > 0 ? 'text-status-alert' : 'text-status-safe'}>
                          {step.waterHazardCm}cm water
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-secondary">
                    <span className="italic">{step.warning}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePrompt(step.instruction);
                      }}
                      className="text-purple hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3 h-3" /> Voice Cue
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">8 Total Navigation Maneuvers</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Guidance
          </button>
        </div>
      </div>
    </div>
  );
}

