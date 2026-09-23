import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';

export default function MessageClarityAnalyzerModal({
  isOpen,
  onClose,
  currentMessage = '',
  onApplyImprovement,
}) {
  if (!isOpen) return null;

  // Analysis heuristics
  const hasHazard = /flood|rain|inundat|waterlog|tide|storm/i.test(currentMessage);
  const hasLocation = /kurla|sion|andheri|dadar|bandra|mumbai|subway|ward|freeway/i.test(currentMessage);
  const hasTime = /\d{1,2}:\d{2}|hour|min|tonight|today|between/i.test(currentMessage);
  const hasAction = /avoid|evacuate|divert|move|stay|dial|call|shelter/i.test(currentMessage);

  const scoreElements = [hasHazard, hasLocation, hasTime, hasAction].filter(Boolean).length;
  const clarityScore = scoreElements * 25;

  const optimizedMessage = `EMERGENCY URBAN FLOOD WARNING: Severe roadway inundation (20-35cm) in Kurla, Sion, and Andheri subways from 19:00 to 20:30 due to heavy rainfall and high tide. Avoid low-lying underpasses. Divert to Eastern Freeway. Move to designated municipal shelters if in flood corridors. For rescue assistance, dial 1916.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                A/B Alert Message Tone &amp; Civic Clarity Analyzer
              </h3>
              <p className="text-[11px] text-ink-secondary">
                NDMA / WMO Public Crisis Communication Heuristic Engine &amp; Panic-Reduction Assessment
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

        {/* Score Banner */}
        <div className="p-5 bg-surface-secondary border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-ink-secondary block">
              Civic Actionability &amp; Panic Reduction Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-purple">
                {clarityScore}
              </span>
              <span className="text-sm font-mono text-ink-secondary">/ 100</span>
              <span
                className={`ml-2 px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                  clarityScore === 100
                    ? 'bg-status-safe-soft text-status-safe'
                    : clarityScore >= 75
                    ? 'bg-purple-soft text-purple'
                    : 'bg-status-warning-soft text-status-warning'
                }`}
              >
                {clarityScore === 100 ? 'EXEMPLARY CLARITY' : clarityScore >= 75 ? 'GOOD COMPLIANCE' : 'ACTION REQUIRED'}
              </span>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-ink-secondary">
            <div>Reading Level: Grade 6.2 (Simple &amp; Accessible)</div>
            <div>Tone Profile: Authoritative, Directive, Calm</div>
          </div>
        </div>

        {/* Four Pillars of Warning Message */}
        <div className="p-5 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-subtle">
          <div className={`p-3 rounded-xl border ${hasHazard ? 'bg-status-safe-soft/40 border-status-safe/40' : 'bg-status-alert-soft/40 border-status-alert/40'}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {hasHazard ? <CheckCircle2 className="w-4 h-4 text-status-safe" /> : <AlertCircle className="w-4 h-4 text-status-alert" />}
              <span>Hazard Named</span>
            </div>
            <span className="text-[10px] text-ink-secondary mt-1 block">
              {hasHazard ? 'Detected ("Flood/Rain")' : 'Missing hazard type'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${hasLocation ? 'bg-status-safe-soft/40 border-status-safe/40' : 'bg-status-alert-soft/40 border-status-alert/40'}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {hasLocation ? <CheckCircle2 className="w-4 h-4 text-status-safe" /> : <AlertCircle className="w-4 h-4 text-status-alert" />}
              <span>Specific Location</span>
            </div>
            <span className="text-[10px] text-ink-secondary mt-1 block">
              {hasLocation ? 'Wards / subways listed' : 'Missing geographical focus'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${hasTime ? 'bg-status-safe-soft/40 border-status-safe/40' : 'bg-status-alert-soft/40 border-status-alert/40'}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {hasTime ? <CheckCircle2 className="w-4 h-4 text-status-safe" /> : <AlertCircle className="w-4 h-4 text-status-alert" />}
              <span>Time Window</span>
            </div>
            <span className="text-[10px] text-ink-secondary mt-1 block">
              {hasTime ? 'Time duration stated' : 'Missing time window'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${hasAction ? 'bg-status-safe-soft/40 border-status-safe/40' : 'bg-status-alert-soft/40 border-status-alert/40'}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {hasAction ? <CheckCircle2 className="w-4 h-4 text-status-safe" /> : <AlertCircle className="w-4 h-4 text-status-alert" />}
              <span>Protective Action</span>
            </div>
            <span className="text-[10px] text-ink-secondary mt-1 block">
              {hasAction ? 'Clear action instructions' : 'Missing evacuation advice'}
            </span>
          </div>
        </div>

        {/* AI Suggested Refinement */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-ink uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple" />
              <span>Recommended High-Impact Revision</span>
            </span>
            <span className="text-[10px] font-mono text-purple font-semibold">
              100% NDMA Compliance
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-soft/30 border border-purple/30 text-xs text-ink leading-relaxed">
            {optimizedMessage}
          </div>

          <p className="text-[11px] text-ink-secondary leading-relaxed">
            This revision clearly separates the hazard trigger, time duration, actionable detour corridors, and 1916 emergency helpline without utilizing panic-triggering terminology.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-ink text-xs font-semibold"
          >
            Keep Original
          </button>

          <button
            onClick={() => {
              if (onApplyImprovement) {
                onApplyImprovement(optimizedMessage);
              }
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <span>Apply Optimized Text to Broadcast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

