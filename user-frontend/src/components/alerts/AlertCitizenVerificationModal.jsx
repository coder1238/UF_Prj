import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, TrendingDown, AlertOctagon, LifeBuoy, Send, MessageSquare } from 'lucide-react';

export default function AlertCitizenVerificationModal({ alert, onUpdateAlert, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState('rising'); // 'rising' | 'receding' | 'blocked' | 'rescue'
  const [observedDepth, setObservedDepth] = useState(alert?.waterDepth || 30);
  const [userNote, setUserNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!alert) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentStats = alert.crowdsourced || {
      risingVotes: 10,
      recedingVotes: 2,
      blockedReports: 5,
      rescueRequests: 0
    };

    const updatedStats = {
      ...currentStats,
      risingVotes: selectedStatus === 'rising' ? currentStats.risingVotes + 1 : currentStats.risingVotes,
      recedingVotes: selectedStatus === 'receding' ? currentStats.recedingVotes + 1 : currentStats.recedingVotes,
      blockedReports: selectedStatus === 'blocked' ? currentStats.blockedReports + 1 : currentStats.blockedReports,
      rescueRequests: selectedStatus === 'rescue' ? currentStats.rescueRequests + 1 : currentStats.rescueRequests,
      lastReportedMinsAgo: 0
    };

    onUpdateAlert({
      ...alert,
      crowdsourced: updatedStats
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" /> Ground-Truth Verification ("I Am Here")
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ink">Ground Status Recorded!</h3>
            <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
              Your report has been aggregated into the BMC Municipal Nowcasting map and local citizen feeds.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-slate-600">
              Are you currently at or near <span className="font-bold text-ink">{alert.ward} — {alert.title.split(':')[1] || alert.title}</span>? Help first responders and commuters with real-time ground truth.
            </p>

            {/* Status Option Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedStatus('rising')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  selectedStatus === 'rising'
                    ? 'bg-red-50 border-red-400 ring-1 ring-red-400 text-red-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block">Water Rising</span>
                  <span className="text-[10px] text-muted block">Ingress increasing</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('receding')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  selectedStatus === 'receding'
                    ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 text-emerald-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block">Water Receding</span>
                  <span className="text-[10px] text-muted block">Pumps clearing water</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('blocked')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  selectedStatus === 'blocked'
                    ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 text-amber-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block">Road Blocked</span>
                  <span className="text-[10px] text-muted block">Vehicles stalled / impassable</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('rescue')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  selectedStatus === 'rescue'
                    ? 'bg-purple-50 border-purple-400 ring-1 ring-purple-400 text-purple-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LifeBuoy className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block">Need Rescue</span>
                  <span className="text-[10px] text-muted block">Stranded citizens present</span>
                </div>
              </button>
            </div>

            {/* Depth Slider */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700">Observed Water Depth (Approximate)</span>
                <span className="font-mono font-bold text-purple-primary">{observedDepth} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={observedDepth}
                onChange={(e) => setObservedDepth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
                <span>Ankle (10cm)</span>
                <span>Knee (45cm)</span>
                <span>Waist (80cm)</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1.5">
                Quick Landmark or Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near bus stop #12, traffic stalled in middle lane"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                className="w-full bg-canvas border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-purple-primary"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Send className="w-4 h-4" /> Submit Ground Verification
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

