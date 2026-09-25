import React, { useState } from 'react';
import { Users, ShieldCheck, CheckCircle2, X, ThumbsUp, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function WitnessCorroborationModal({ report, isOpen, onClose, onAddWitness }) {
  const [witnessName, setWitnessName] = useState('Citizen Observer');
  const [tier, setTier] = useState('Level 3 Ground Scout');
  const [depthAdjustment, setDepthAdjustment] = useState(report?.depth || 25);
  const [observationNote, setObservationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      const newWitness = {
        name: witnessName || 'Citizen Observer',
        tier: tier,
        time: nowStr,
        note: observationNote || `Corroborated water depth ~${depthAdjustment} cm.`
      };
      if (onAddWitness) {
        onAddWitness(report.id, newWitness, depthAdjustment);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-primary text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Log Ground Witness Corroboration</h3>
              <p className="text-[11px] font-mono text-purple-200">Incident Ticket #{report.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-black text-slate-900 text-lg">Observation Corroborated!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you! Your verified ground telemetry has been added to ticket #{report.id} and assimilated into the hydraulic nowcast model.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-primary" /> +25 Citizen Trust Karma Earned
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-purple-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-primary" />
                  Crowdsourced Truth Multiplier
                </div>
                <p className="text-[11px]">
                  When multiple citizens independently corroborate water depth, the municipal algorithm automatically elevates pump response priority.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Contributor Handle:</label>
                  <input
                    type="text"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Citizen Scout Tier:</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs bg-white"
                  >
                    <option value="Level 1 Citizen Scout">Level 1 Scout (1-5 reports)</option>
                    <option value="Level 3 Ground Scout">Level 3 Scout (6-15 reports)</option>
                    <option value="Level 5 Senior Scout">Level 5 Senior Scout (Verified)</option>
                    <option value="Transit Operator / BEST Scout">Transit Driver / Municipal Scout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Refined Water Depth at Your Location: <span className="font-mono text-purple-primary font-bold">{depthAdjustment} cm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={depthAdjustment}
                  onChange={(e) => setDepthAdjustment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0 cm (Dry)</span>
                  <span>25 cm (Knee)</span>
                  <span>50 cm (Car Hood)</span>
                  <span>100 cm+</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Observation Details:</label>
                <textarea
                  value={observationNote}
                  onChange={(e) => setObservationNote(e.target.value)}
                  placeholder="e.g. Traffic blocked by police tape. Municipal pump vehicle actively pumping water through red hoses."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Hashing and Signing Ground Witness Entry...</span>
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4" /> Submit Independent Ground Corroboration
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

