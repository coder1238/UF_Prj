import React, { useState } from 'react';
import { 
  X, HeartHandshake, ShieldAlert, CheckCircle2, 
  Accessibility, Activity, Baby, Sparkles, Send, Copy, Check 
} from 'lucide-react';

export default function SpecialAssistanceModal({ place, onClose }) {
  const [assistanceType, setAssistanceType] = useState('wheelchair');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [needsOxygenPower, setNeedsOxygenPower] = useState(false);
  const [dispatchedTicket, setDispatchedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    const beaconId = `CARE-${place.ward.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setDispatchedTicket({
      beaconId,
      name,
      contact,
      type: assistanceType,
      placeName: place.name,
      ward: place.ward,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      etaMins: 14
    });
  };

  const handleCopyBeacon = () => {
    if (!dispatchedTicket) return;
    const text = `*BMC SPECIAL ASSISTANCE EVAC BEACON*\nBeacon ID: ${dispatchedTicket.beaconId}\nPatient: ${dispatchedTicket.name}\nNeed: ${dispatchedTicket.type.toUpperCase()}\nTarget Haven: ${dispatchedTicket.placeName}\nContact: ${dispatchedTicket.contact}\nEstimated Paramedic Escort ETA: ${dispatchedTicket.etaMins} mins`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Special Needs Evacuation Dispatch</h2>
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

        {dispatchedTicket ? (
          <div className="space-y-4 py-2 animate-in zoom-in-95 duration-200">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">Assistance Beacon Active</h3>
              <p className="text-xs text-emerald-700">
                Civic Disaster Paramedic Escort Unit dispatched to your coordinates.
              </p>
            </div>

            <div className="bg-canvas p-4 rounded-2xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-muted">Beacon ID:</span>
                <span className="font-bold text-purple-primary">{dispatchedTicket.beaconId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-muted">Target Shelter:</span>
                <span className="font-bold text-ink">{dispatchedTicket.placeName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-muted">Assistance Tier:</span>
                <span className="font-bold text-rose-600 uppercase">{dispatchedTicket.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Estimated Escort Arrival:</span>
                <span className="font-bold text-emerald-600">~{dispatchedTicket.etaMins} mins</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyBeacon}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-canvas hover:bg-slate-100 text-xs font-bold text-ink flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Beacon SMS'}
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 text-xs text-rose-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Priority medical transport with dedicated battery/oxygen backup and wheelchair ramps.</span>
            </div>

            {/* Assistance Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Category of Assistance</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'wheelchair', label: 'Wheelchair / Cot', icon: Accessibility },
                  { id: 'oxygen', label: 'Oxygen / Ventilator', icon: Activity },
                  { id: 'dialysis', label: 'Dialysis Transfer', icon: Activity },
                  { id: 'senior', label: 'Senior (65+) Escort', icon: HeartHandshake }
                ].map(item => {
                  const Icon = item.icon;
                  const isSel = assistanceType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAssistanceType(item.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-left font-bold transition-all ${
                        isSel 
                          ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' 
                          : 'bg-canvas text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient / Citizen Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attendant Mobile Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98200 XXXXX"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Location Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Floor / Landmark Description</label>
              <textarea
                rows={2}
                value={locationDesc}
                onChange={e => setLocationDesc(e.target.value)}
                placeholder="e.g. 2nd Floor, Wing B, Near S.V. Road Metro Pillar 142. Ground lobby dry."
                className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-canvas rounded-xl border border-slate-200">
              <input 
                type="checkbox"
                id="oxygenNeed"
                checked={needsOxygenPower}
                onChange={e => setNeedsOxygenPower(e.target.checked)}
                className="w-4 h-4 accent-rose-600 rounded"
              />
              <label htmlFor="oxygenNeed" className="text-xs text-slate-700 cursor-pointer select-none">
                Requires continuous 230V power for life-support apparatus
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" /> Transmit Special Assistance Beacon
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

