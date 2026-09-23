import React, { useState } from 'react';
import { 
  LifeBuoy, Anchor, Compass, Phone, CheckCircle2, 
  MapPin, Users, Plus, X, ShieldAlert, Award, Clock 
} from 'lucide-react';

export default function BoatRescueMobilizerModal({ isOpen, onClose }) {
  const [requests, setRequests] = useState([
    {
      id: 'BOAT-REQ-101',
      name: 'Sunita Patil (Dialysis Patient)',
      location: 'Kranti Nagar, Near Mithi Riverbank, Kurla',
      people: 2,
      depth: '120 cm (Ground floor flooded)',
      urgency: 'CRITICAL',
      status: 'DISPATCHED',
      claimedBy: 'Capt. R. Sawant (Zodiac Dinghy #3)',
      time: '8m ago'
    },
    {
      id: 'BOAT-REQ-102',
      name: 'Dr. Ansari & Family',
      location: 'Near Milan Subway Underpass',
      people: 4,
      depth: '85 cm',
      urgency: 'HIGH',
      status: 'OPEN',
      claimedBy: null,
      time: '14m ago'
    }
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientLocation, setPatientLocation] = useState('');
  const [headcount, setHeadcount] = useState(2);
  const [medicalUrgency, setMedicalUrgency] = useState('HIGH');

  if (!isOpen) return null;

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!patientName || !patientLocation) return;

    const newReq = {
      id: `BOAT-REQ-${Math.floor(100 + Math.random() * 900)}`,
      name: patientName,
      location: patientLocation,
      people: headcount,
      depth: 'Estimated 80-110 cm',
      urgency: medicalUrgency,
      status: 'OPEN',
      claimedBy: null,
      time: 'Just now'
    };

    setRequests([newReq, ...requests]);
    setShowRequestForm(false);
    setPatientName('');
    setPatientLocation('');
  };

  const handleClaimRescue = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'DISPATCHED', claimedBy: 'You (Volunteer Responder)' } : r));
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <LifeBuoy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-teal-400 font-bold tracking-wider">Feature #12</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 text-[10px] font-mono border border-teal-800">
                  Citizen Mutual-Aid Flotilla
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Community Boat & 4x4 Rescue Mobilizer</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Flotilla Telemetry Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">INFLATABLE BOATS</span>
              <span className="text-teal-400 font-bold text-sm">6 Inflatable Rafts</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SNORKEL 4x4 TRUCKS</span>
              <span className="text-cyan-400 font-bold text-sm">4 High Clearance</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ACTIVE EVACUATIONS</span>
              <span className="text-amber-400 font-bold text-sm">{requests.length} Missions</span>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Priority Evacuation Requests:
            </h3>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Request Boat Evacuation
            </button>
          </div>

          {/* Create Request Form Drawer */}
          {showRequestForm && (
            <form onSubmit={handleCreateRequest} className="p-4 bg-slate-950 rounded-2xl border border-teal-500/40 space-y-3">
              <h4 className="font-bold text-white text-xs font-mono uppercase text-teal-400">
                Log Stranded Citizen Evacuation Request:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Citizen Name / Dependent"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Exact Location / Floor Level"
                  value={patientLocation}
                  onChange={(e) => setPatientLocation(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={medicalUrgency}
                  onChange={(e) => setMedicalUrgency(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                >
                  <option value="CRITICAL">Critical (Dialysis / Pregnant / Oxygen)</option>
                  <option value="HIGH">High (Elderly / Children Trapped)</option>
                  <option value="MODERATE">Moderate (Property Stranded)</option>
                </select>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold font-mono text-xs rounded-xl transition-colors"
                >
                  Submit to Flotilla Dispatch
                </button>
              </div>
            </form>
          )}

          {/* Request Cards Feed */}
          <div className="space-y-3">
            {requests.map(req => (
              <div 
                key={req.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">#{req.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        req.urgency === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {req.location}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                    req.status === 'DISPATCHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>{req.people} Persons</span>
                    <span>Depth: {req.depth}</span>
                    <span>{req.time}</span>
                  </div>

                  {req.status === 'OPEN' ? (
                    <button
                      onClick={() => handleClaimRescue(req.id)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold transition-colors"
                    >
                      Claim Rescue Mission
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {req.claimedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

