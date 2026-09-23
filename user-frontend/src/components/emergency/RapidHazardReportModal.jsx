import React, { useState } from 'react';
import { 
  AlertOctagon, Camera, Upload, CheckCircle2, MapPin, 
  Sliders, ShieldAlert, X, Send, Zap, FileText 
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function RapidHazardReportModal({ isOpen, onClose, currentWard }) {
  const [hazardType, setHazardType] = useState('manhole'); // 'manhole' | 'wire' | 'collapse' | 'gas' | 'vehicle'
  const [waterDepth, setWaterDepth] = useState(45);
  const [address, setAddress] = useState('Near Kurla Depot / LBS Marg Junction');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    emergencyAudio.playRadioBurst();

    setTimeout(() => {
      const ticketId = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
      const result = {
        id: ticketId,
        type: hazardType,
        depth: waterDepth,
        address,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unit: 'BMC Stormwater Unit #7 & Fire Response Squad'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('rapid_emergency_reports') || '[]');
        localStorage.setItem('rapid_emergency_reports', JSON.stringify([result, ...existing]));
      } catch (err) {}

      setTicketResult(result);
      setSubmitting(false);
      emergencyAudio.playCountdownBeep(940);
    }, 1200);
  };

  const resetForm = () => {
    setTicketResult(null);
    setPhotoAdded(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider">Feature #06</span>
                <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-mono border border-red-800">
                  Instant Dispatch
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">30-Second Rapid Life Hazard Reporter</h2>
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
        <div className="p-6 space-y-5">
          {ticketResult ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  PRIORITY 1 DISPATCH GENERATED
                </span>
                <h3 className="text-2xl font-mono font-extrabold text-white mt-1">{ticketResult.id}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Assigned directly to <strong>{ticketResult.unit}</strong>. First responders notified with GPS telemetry.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-slate-300 space-y-1">
                <div><strong>Location:</strong> {ticketResult.address}</div>
                <div><strong>Water Depth:</strong> {ticketResult.depth} cm</div>
                <div><strong>Timestamp:</strong> {ticketResult.timestamp} IST</div>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl transition-colors"
              >
                Report Another Hazard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                  Select Urgent Life Threat:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'manhole', label: 'Open Manhole Vortex', icon: AlertOctagon },
                    { id: 'wire', label: 'Fallen 11kV Wire', icon: Zap },
                    { id: 'collapse', label: 'Wall Collapse', icon: ShieldAlert },
                    { id: 'gas', label: 'MGL Gas Pipeline', icon: AlertOctagon },
                    { id: 'vehicle', label: 'Submerged Car', icon: Sliders },
                    { id: 'trap', label: 'Elderly Trapped', icon: FileText }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setHazardType(item.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex flex-col gap-1 ${
                          hazardType === item.id 
                            ? 'bg-red-600/30 border-red-500 text-red-300 shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-red-400" />
                        <span className="font-bold text-[11px] leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Water Depth Slider */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 font-bold">ESTIMATED WATER DEPTH:</span>
                  <span className="text-red-400 font-bold text-sm">{waterDepth} cm</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="220" 
                  value={waterDepth}
                  onChange={(e) => setWaterDepth(Number(e.target.value))}
                  className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Ankle (15cm)</span>
                  <span>Knee (45cm)</span>
                  <span>Waist (90cm)</span>
                  <span>Car Roof (&gt;180cm)</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">
                  Location Landmark:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 pl-9 font-mono"
                  />
                  <MapPin className="w-4 h-4 text-red-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Photo Simulation */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>{photoAdded ? 'Optical Sensor Evidence Attached' : 'Attach Camera Snapshot'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoAdded(!photoAdded)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                    photoAdded ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {photoAdded ? 'Attached ✓' : 'Simulate Capture'}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Incident...' : 'Transmit Priority Hazard Ticket'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

