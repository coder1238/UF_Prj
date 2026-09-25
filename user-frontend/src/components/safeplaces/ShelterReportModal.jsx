import React, { useState } from 'react';
import { 
  X, CheckCircle2, AlertTriangle, Users, Droplets, 
  Zap, MessageSquare, ShieldCheck, Sparkles, Send 
} from 'lucide-react';

export default function ShelterReportModal({ place, onClose, onReportSubmitted }) {
  const [crowd, setCrowd] = useState('MODERATE');
  const [approachRoad, setApproachRoad] = useState('DRY');
  const [waterFood, setWaterFood] = useState('SUFFICIENT');
  const [power, setPower] = useState('OPERATIONAL');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `rep-${Date.now()}`,
      placeId: place.id,
      placeName: place.name,
      timestamp: 'Just now',
      crowd,
      approachRoad,
      waterFood,
      power,
      notes: notes.trim() || 'On-site conditions verified by citizen volunteer.'
    };

    if (onReportSubmitted) {
      onReportSubmitted(newReport);
    }
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-purple-50 text-purple-primary rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Field Report: On-Ground Conditions</h2>
              <p className="text-xs text-muted font-mono">{place.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ink">Report Logged & Propagated</h3>
            <p className="text-xs text-muted max-w-xs mx-auto">
              Thank you! Your verified report updates the live safety score and helps other citizens navigate dry ground safely.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-primary shrink-0" />
              <span>Ground reports sync to the BMC Central Flood Dashboard every 60 seconds.</span>
            </div>

            {/* Crowd Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-primary" /> Current Crowd Occupancy
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'LOW', label: 'Plenty Cots' },
                  { id: 'MODERATE', label: 'Moderate' },
                  { id: 'CROWDED', label: 'Near Full' },
                  { id: 'FULL', label: 'At Capacity' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setCrowd(opt.id)}
                    className={`py-2 px-2 rounded-xl border font-bold text-[11px] transition-all ${
                      crowd === opt.id 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                        : 'bg-canvas text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Approach Road Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-primary" /> Approach Road Water Condition
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'DRY', label: 'Dry / Passable (0-2cm)' },
                  { id: 'PUDDLES', label: 'Puddles (5-10cm)' },
                  { id: 'FLOODED', label: 'Waterlogged (>20cm)' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setApproachRoad(opt.id)}
                    className={`py-2 px-2 rounded-xl border font-bold text-[11px] transition-all ${
                      approachRoad === opt.id 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                        : 'bg-canvas text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drinking Water & Food */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-purple-primary" /> Drinking Water & Ration Supplies
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'ABUNDANT', label: 'Ample Supply' },
                  { id: 'SUFFICIENT', label: 'Adequate' },
                  { id: 'LOW', label: 'Needs Restock' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setWaterFood(opt.id)}
                    className={`py-2 px-2 rounded-xl border font-bold text-[11px] transition-all ${
                      waterFood === opt.id 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                        : 'bg-canvas text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Power Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-primary" /> Electric Power Status
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'OPERATIONAL', label: 'Grid Power ON' },
                  { id: 'GENERATOR', label: 'Diesel Genset' },
                  { id: 'OUTAGE', label: 'Power Cut' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPower(opt.id)}
                    className={`py-2 px-2 rounded-xl border font-bold text-[11px] transition-all ${
                      power === opt.id 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                        : 'bg-canvas text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-primary" /> Ground Observations & Landmarks
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Approach gate is clear. High curb allows dry pedestrian walking. Volunteer registration desk is open."
                className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" /> Submit Live Citizen Verification
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

