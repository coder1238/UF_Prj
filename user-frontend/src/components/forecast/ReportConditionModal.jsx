import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Upload,
  Send,
  ShieldCheck
} from 'lucide-react';

export default function ReportConditionModal({ isOpen, onClose, currentWard, onSubmitReport }) {
  const [hazardType, setHazardType] = useState('WATERLOGGING');
  const [locationName, setLocationName] = useState(currentWard ? `${currentWard.name} Main Carriageway` : '');
  const [depthCm, setDepthCm] = useState(25);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitReport) {
        onSubmitReport({
          id: `rep-${Date.now()}`,
          author: 'Citizen Scout (You)',
          location: locationName || 'Local Street',
          ward: currentWard?.id || 'ward-l',
          timeAgo: 'Just now',
          depthCm: Number(depthCm),
          statusText: description || 'Ground water reported by citizen',
          verified: false,
          verificationBadge: 'Citizen Ground Ping',
          upvotes: 1,
          hasImage: false,
          userUpvoted: true
        });
      }
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary-soft text-primary-deep">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-soft text-primary-deep">
                CROWDSOURCED VERIFICATION
              </span>
              <h2 className="text-lg font-bold text-ink">
                Submit Real-Time Ground Report
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-ink">Ground Report Submitted!</h3>
            <p className="text-xs text-ink-secondary">
              Thank you for keeping Mumbai safe. Your report has been broadcasted to nearby citizens and routed to BMC Ward Control Room.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-ink uppercase block mb-1">
                Report Type
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                {[
                  { id: 'WATERLOGGING', label: '💧 Waterlogging' },
                  { id: 'MANHOLE', label: '⚠️ Open Drain' },
                  { id: 'SUBWAY', label: '🚇 Subway Block' },
                  { id: 'STALLED', label: '🚗 Stalled Car' },
                  { id: 'TREE_FALL', label: '🌳 Obstruction' },
                  { id: 'DRY_ROAD', label: '✅ Clear Passage' }
                ].map(item => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setHazardType(item.id)}
                    className={`p-2 rounded-xl border transition text-center ${
                      hazardType === item.id
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white border-border text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-ink uppercase block mb-1">
                Specific Landmark or Street
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near Phoenix Mall Gate 3, LBS Marg"
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-ink uppercase block mb-1">
                  Observed Water Depth (cm)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={depthCm}
                    onChange={(e) => setDepthCm(e.target.value)}
                    className="w-full accent-purple-primary"
                  />
                  <span className="text-xs font-bold font-mono text-red-600 w-12 text-right">
                    {depthCm} cm
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-ink uppercase block mb-1">
                  Water Reference
                </label>
                <div className="text-xs text-ink-muted font-mono pt-1">
                  {depthCm < 10 ? 'Ankle depth (Walkable)' : depthCm < 25 ? 'Knee depth (Sedan stall risk)' : 'Waist depth (Hazardous)'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-ink uppercase block mb-1">
                Citizen Note / Guidance
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details to help fellow drivers and pedestrians..."
                className="w-full bg-white border border-border rounded-xl p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-border text-xs font-bold rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <span>Broadcasting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Verified Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

