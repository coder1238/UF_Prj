import React, { useState } from 'react';
import { X, CheckCircle2, UploadCloud, Camera, Check, ShieldCheck } from 'lucide-react';

export default function AlertClearanceReportModal({ alert, onClose, onSubmitted, onToast }) {
  const [recessionStatus, setRecessionStatus] = useState('drained');
  const [observedDepth, setObservedDepth] = useState('5');
  const [comment, setComment] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!alert) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitted) onSubmitted(alert.id);
      if (onToast) onToast('Clearance verification submitted! Municipal supervisor notified.');
      onClose();
    }, 700);
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Report Hazard Clearance / Recession</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-canvas border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-mono text-muted uppercase block">Target Alert</span>
            <p className="text-xs font-bold text-ink truncate">{alert.translations?.en?.title || alert.title}</p>
            <span className="text-[11px] font-mono text-slate-500">Ward {alert.ward} • Logged depth: {alert.waterDepthCm} cm</span>
          </div>

          <div>
            <label className="text-xs font-mono text-muted block mb-1.5 font-bold">
              Observed Water Condition:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setRecessionStatus('drained'); setObservedDepth('0'); }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                  recessionStatus === 'drained'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-emerald-600 font-extrabold">Fully Drained (0 cm)</span>
                <span className="text-[10px] text-slate-500">Vehicles passing safely</span>
              </button>

              <button
                type="button"
                onClick={() => { setRecessionStatus('receding'); setObservedDepth('10'); }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                  recessionStatus === 'receding'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-amber-600 font-extrabold">Significantly Receding</span>
                <span className="text-[10px] text-slate-500">Pumps actively clearing</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted block mb-1 font-bold">
              Observed Water Depth (cm)
            </label>
            <input
              type="number"
              min="0"
              max="150"
              value={observedDepth}
              onChange={e => setObservedDepth(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted block mb-1 font-bold">
              Citizen Notes / Details
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="e.g. BMC cleaning crew arrived with suction tanker, road reopened to light traffic..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
            />
          </div>

          {/* Simulated Photo Upload */}
          <div>
            <label className="text-xs font-mono text-muted block mb-1 font-bold">
              Verification Photo (Optional)
            </label>
            <div 
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                hasPhoto 
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800' 
                  : 'border-slate-200 hover:border-purple-primary bg-canvas text-slate-500'
              }`}
            >
              {hasPhoto ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>street_clearance_photo_1932.jpg attached</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-xs">
                  <Camera className="w-5 h-5 text-purple-primary" />
                  <span>Click to attach live street photo proof</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Submitting to BMC...' : 'Submit Clearance Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

