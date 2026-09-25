import React, { useState } from 'react';
import { 
  X, CheckCircle2, ThumbsUp, ThumbsDown, AlertTriangle, 
  Send, ShieldCheck, MapPin, Droplets, MessageSquare
} from 'lucide-react';

export default function CrowdVerificationModal({ hub, onClose, onUpdateHub, onSpeak }) {
  if (!hub) return null;

  const [gateStatus, setGateStatus] = useState(hub.status);
  const [estimatedDepth, setEstimatedDepth] = useState(hub.waterDepth);
  const [pumpStatus, setPumpStatus] = useState('running');
  const [hazards, setHazards] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleHazard = (item) => {
    if (hazards.includes(item)) {
      setHazards(hazards.filter(h => h !== item));
    } else {
      setHazards([...hazards, item]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSeverity = estimatedDepth > 30 ? 'critical' : estimatedDepth > 10 ? 'caution' : 'safe';
    const statusLabel = estimatedDepth > 30 
      ? `Citizen Reported: Flooded (${estimatedDepth} cm)` 
      : estimatedDepth > 10 
        ? `Citizen Reported: Caution (${estimatedDepth} cm)` 
        : 'Citizen Verified: Clear & Passable';

    const updated = {
      ...hub,
      waterDepth: estimatedDepth,
      status: gateStatus,
      statusLabel,
      severity: updatedSeverity,
      lastVerified: 'Just now (Community Verified)',
      trustScore: Math.min(100, (hub.trustScore || 90) + 1),
      upvotes: (hub.upvotes || 0) + 1
    };

    onUpdateHub(updated);
    setSubmitted(true);

    if (onSpeak) {
      onSpeak(`Thank you. Your ground report for ${hub.name} has been verified and broadcast to citizen navigation network.`);
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleQuickVote = (type) => {
    const updated = {
      ...hub,
      upvotes: type === 'up' ? (hub.upvotes || 0) + 1 : hub.upvotes,
      downvotes: type === 'down' ? (hub.downvotes || 0) + 1 : hub.downvotes,
      trustScore: type === 'up' ? Math.min(100, (hub.trustScore || 90) + 2) : Math.max(50, (hub.trustScore || 90) - 2),
      lastVerified: 'Just now'
    };
    onUpdateHub(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 font-bold uppercase">
              <ShieldCheck className="w-4 h-4" /> Ground Truth Sensor Verification
            </div>
            <h3 className="text-lg font-bold mt-0.5">{hub.name}</h3>
            <p className="text-xs text-slate-400 font-mono">Ward: {hub.ward}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-ink">Ground Report Submitted!</h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your real-time observation was broadcast to fellow citizens and integrated into the safe route navigation matrix.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
            {/* Quick Upvote/Downvote Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Community Trust Score</span>
                <span className="text-[11px] font-mono text-muted">
                  {hub.trustScore}% Verified ({hub.upvotes} confirmations)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickVote('up')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold font-mono border border-emerald-200 flex items-center gap-1.5 transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Accurate (+1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickVote('down')}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold font-mono border border-red-200 flex items-center gap-1.5 transition"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Dispute</span>
                </button>
              </div>
            </div>

            {/* Detailed Ground Report Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Gate Ingress Status */}
              <div>
                <label className="text-xs font-mono font-bold uppercase text-ink block mb-2">
                  Observed Ingress Condition
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'operational', label: 'Dry & Open' },
                    { id: 'caution', label: 'Ponding (Caution)' },
                    { id: 'flooded_entrance', label: 'Entrance Flooded' },
                    { id: 'closed', label: 'Gate Barricaded' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGateStatus(item.id)}
                      className={`p-2.5 rounded-xl border font-semibold text-center transition ${
                        gateStatus === item.id
                          ? 'bg-purple-primary text-white border-purple-primary shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Depth Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-ink uppercase">Estimated Water Depth</span>
                  <span className="text-purple-primary font-bold text-sm">{estimatedDepth} cm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={estimatedDepth}
                  onChange={(e) => setEstimatedDepth(Number(e.target.value))}
                  className="w-full accent-purple-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
                  <span>0 cm (Dry)</span>
                  <span>15 cm (Curb)</span>
                  <span>35 cm (Axle)</span>
                  <span>80 cm (Severe)</span>
                </div>
              </div>

              {/* Hazard Checkboxes */}
              <div>
                <label className="text-xs font-mono font-bold uppercase text-ink block mb-2">
                  Report Hazards Nearby
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Open Manhole / Chamber',
                    'Fallen Tree Branch',
                    'Stalled Vehicle in Lane',
                    'Water Ingress into Basement',
                    'High Voltage Cable Ponding'
                  ].map(hazard => (
                    <button
                      key={hazard}
                      type="button"
                      onClick={() => toggleHazard(hazard)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        hazards.includes(hazard)
                          ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {hazard}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment / Note */}
              <div>
                <label className="text-xs font-mono font-bold uppercase text-ink block mb-1">
                  Ground Observer Note (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Traffic police diverting cars via flyover; basement ramp barrier deployed..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:border-purple-primary bg-canvas"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ground Report</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

