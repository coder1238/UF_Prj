import React, { useState } from 'react';
import { X, AlertTriangle, Camera, CheckCircle2, MapPin } from 'lucide-react';

export default function CrowdsourcedHazardModal({
  isOpen,
  onClose,
  activeCorridor,
  onHazardReported = () => {}
}) {
  const [hazardType, setHazardType] = useState('PONDING');
  const [waterDepth, setWaterDepth] = useState('20');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onHazardReported({
      type: hazardType,
      depth: waterDepth,
      desc: description,
      time: 'Just now',
      corridor: activeCorridor.name
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-border shadow-2xl max-h-[90vh] max-w-md w-full p-4 sm:p-6 overflow-y-auto space-y-5 lg:max-h-none lg:overflow-visible">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-extrabold text-ink">Report Hazard on Route</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-canvas hover:bg-surface-secondary text-ink-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-ink">Hazard Report Dispatched!</h4>
            <p className="text-xs text-ink-secondary">
              BMC Disaster Cell and other motorists on this corridor have been alerted. Thank you for keeping Mumbai safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold uppercase text-ink-muted block mb-1">
                Corridor Location
              </label>
              <div className="p-2.5 bg-canvas rounded-xl border border-border text-xs font-semibold text-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{activeCorridor.name}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase text-ink-muted block mb-1">
                Hazard Classification
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {[
                  { id: 'PONDING', label: 'Standing Water' },
                  { id: 'STALLED_CAR', label: 'Stalled Vehicle' },
                  { id: 'MANHOLE', label: 'Dislodged Manhole' },
                  { id: 'FALLEN_TREE', label: 'Fallen Tree / Wire' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHazardType(item.id)}
                    className={`p-2 rounded-xl border text-center transition ${
                      hazardType === item.id
                        ? 'bg-ink text-white font-bold border-ink'
                        : 'bg-canvas text-ink-secondary hover:text-ink border-border'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase text-ink-muted block mb-1">
                Estimated Water Depth: <span className="text-primary font-bold">{waterDepth} cm</span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={waterDepth}
                onChange={(e) => setWaterDepth(e.target.value)}
                className="w-full h-2 bg-canvas rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase text-ink-muted block mb-1">
                Incident Description & Landmark
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Near JVLR bridge ramp, curb drain overflowing..."
                className="w-full bg-canvas border border-border rounded-xl p-2.5 text-xs text-ink focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Broadcast Hazard to Motorists
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
