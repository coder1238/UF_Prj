import React, { useState } from 'react';
import { 
  X, CheckCircle2, QrCode, ShieldCheck, Users, 
  HeartHandshake, AlertCircle, Download, Printer, Copy, Check, Sparkles 
} from 'lucide-react';

export default function ShelterPassModal({ place, onClose, onRegisterSuccess }) {
  const [step, setStep] = useState('form'); // 'form' | 'pass'
  const [formData, setFormData] = useState({
    headName: '',
    phone: '',
    adults: 1,
    children: 0,
    seniors: 0,
    infants: 0,
    pets: false,
    specialNeeds: 'none' // 'none' | 'dialysis' | 'oxygen' | 'wheelchair' | 'pregnancy'
  });
  const [passData, setPassData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.headName.trim() || !formData.phone.trim()) return;

    const totalParty = parseInt(formData.adults) + parseInt(formData.children) + parseInt(formData.seniors) + parseInt(formData.infants);
    const token = `BMC-HAVEN-${place.ward.replace(/\s+/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pass = {
      tokenId: token,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      placeName: place.name,
      ward: place.ward,
      address: place.address,
      elevation: place.elevation,
      headName: formData.headName,
      phone: formData.phone,
      totalParty,
      partyBreakdown: `${formData.adults} Adults • ${formData.children} Children • ${formData.seniors} Seniors • ${formData.infants} Infants`,
      pets: formData.pets,
      specialNeeds: formData.specialNeeds,
      priority: formData.specialNeeds !== 'none' || formData.infants > 0 ? 'PRIORITY RED (Fast-Track Ingress)' : 'STANDARD CITIZEN (Green)'
    };

    setPassData(pass);
    setStep('pass');
    if (onRegisterSuccess) {
      onRegisterSuccess(totalParty);
    }
  };

  const handleCopyToken = () => {
    if (!passData) return;
    const text = `*BMC DISASTER HAVEN INGRESS PASS*\nPass ID: ${passData.tokenId}\nFacility: ${passData.placeName}\nElevation: ${passData.elevation} MSL\nPrimary Name: ${passData.headName}\nParty Size: ${passData.totalParty} persons\nPriority: ${passData.priority}\nWard: ${passData.ward}\nAddress: ${passData.address}\n\nPresent this SMS at Haven Gate for priority admission.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-purple-50 text-purple-primary rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">
                {step === 'form' ? 'Pre-Register High-Ground Cot / Spot' : 'Verified Ingress Token'}
              </h2>
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

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
              <span>
                Pre-registering guarantees reserved high-ground cots and accelerates security triage at the checkpoint. No payment required.
              </span>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Head of Household</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aarti Kulkarni"
                  value={formData.headName}
                  onChange={e => setFormData({ ...formData, headName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98200 XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
                />
              </div>
            </div>

            {/* Party Size Counts */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Party Members Evacuating</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'adults', label: 'Adults (18-59)', min: 1 },
                  { key: 'seniors', label: 'Seniors (60+)', min: 0 },
                  { key: 'children', label: 'Kids (2-17)', min: 0 },
                  { key: 'infants', label: 'Infants (<2)', min: 0 }
                ].map(item => (
                  <div key={item.key} className="bg-canvas p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-muted block">{item.label}</span>
                    <input 
                      type="number" 
                      min={item.min}
                      max={12}
                      value={formData[item.key]}
                      onChange={e => setFormData({ ...formData, [item.key]: parseInt(e.target.value) || 0 })}
                      className="w-full text-center font-bold text-ink bg-transparent text-sm focus:outline-none mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Special Medical Needs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Medical Triage Needs</label>
              <select
                value={formData.specialNeeds}
                onChange={e => setFormData({ ...formData, specialNeeds: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
              >
                <option value="none">None (Standard Mobility)</option>
                <option value="oxygen">Oxygen Dependency / Respiratory Support</option>
                <option value="dialysis">Dialysis Patient (Scheduled Care)</option>
                <option value="wheelchair">Non-Ambulatory / Wheelchair Accessible Cot</option>
                <option value="pregnancy">High-Risk Expectant Mother</option>
              </select>
            </div>

            {/* Pets Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-canvas rounded-xl border border-slate-200">
              <input 
                type="checkbox"
                id="petsCheckbox"
                checked={formData.pets}
                onChange={e => setFormData({ ...formData, pets: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
              <label htmlFor="petsCheckbox" className="text-xs text-slate-700 cursor-pointer select-none">
                Accompanied by domestic pets (dogs, cats, small birds)
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4" /> Generate Disaster Ingress Pass
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            {/* Visual Pass Badge */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between border-b border-slate-700/80 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                    BMC Municipal Disaster Pass
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{passData.placeName}</h3>
                  <p className="text-[11px] text-slate-300 font-mono">Elevation: {passData.elevation}</p>
                </div>
                <div className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONFIRMED
                </div>
              </div>

              {/* Dynamic QR Schematic */}
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="w-20 h-20 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="36" y="10" width="10" height="10" />
                    <rect x="52" y="10" width="8" height="24" />
                    <rect x="10" y="38" width="22" height="8" />
                    <rect x="38" y="38" width="24" height="24" />
                    <rect x="68" y="44" width="22" height="12" />
                    <rect x="14" y="52" width="12" height="10" />
                    <rect x="44" y="68" width="18" height="8" />
                    <rect x="68" y="68" width="14" height="24" />
                    <rect x="88" y="86" width="12" height="14" />
                    <rect x="38" y="82" width="22" height="8" />
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-mono text-purple-300 font-extrabold text-sm">{passData.tokenId}</div>
                  <div className="text-[11px] text-slate-300">Name: <strong className="text-white">{passData.headName}</strong></div>
                  <div className="text-[11px] text-slate-300">Party: <strong className="text-white">{passData.totalParty} Person(s)</strong></div>
                  <div className="text-[10px] text-amber-300 font-mono">{passData.priority}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div>Date: {passData.date} {passData.timestamp}</div>
                <div className="text-right">Desk: {place.phone}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyToken}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-canvas hover:bg-slate-100 text-xs font-bold text-ink flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Pass Copied!' : 'Copy SMS Pass'}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print / Save Pass
              </button>
            </div>

            <p className="text-[11px] text-center text-muted">
              Pass is saved in your browser storage. You can access it offline if cellular towers go down.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
