import React, { useState } from 'react';
import { 
  User, ShieldCheck, QrCode, Phone, Mail, MapPin, 
  Droplets, Heart, FileText, CheckCircle2, Download, Printer, 
  ExternalLink, Sparkles, X, Camera, AlertCircle
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

export default function ProfileIdentityCard({ profile, onUpdate, speakAlert }) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: profile.name || 'Rahul Deshmukh',
    phone: profile.phone || '+91 98201 54321',
    email: profile.email || 'rahul.deshmukh@mumbai.gov.in',
    wardId: profile.wardId || 'ward-f-north',
    bloodGroup: profile.bloodGroup || 'B+ Positive',
    emergencyAlt: profile.emergencyAlt || '+91 98200 98765 (Spouse)',
    address: profile.address || 'Flat 402, Sai Kripa Heights, Matunga East, Mumbai - 400019',
    citizenId: profile.citizenId || 'BMC-DIS-2026-F9420',
    avatarUrl: profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  });

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onUpdate(updated);
  };

  const currentWardObj = WARDS_DATA.find(w => w.id === form.wardId) || WARDS_DATA[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
      {/* Background watermark badge */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 pointer-events-none opacity-5">
        <ShieldCheck className="w-64 h-64 text-purple-primary" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-soft text-purple-primary shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink">Digital Citizen Flood Identity Card</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" /> BMC VERIFIED
              </span>
            </div>
            <p className="text-xs text-muted">
              Municipal disaster registry token authorized for emergency green-corridor vehicle transit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 bg-purple-soft hover:bg-purple-100 text-purple-deep border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <QrCode className="w-4 h-4 text-purple-primary" />
            <span>Digital QR Pass</span>
          </button>
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="px-3.5 py-2 bg-canvas hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition"
          >
            {editMode ? 'Done Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Main Identity Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Left: Official ID Card Preview */}
        <div className="md:col-span-1 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-purple-800/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-purple-300 block font-bold">
                  MCGM • DISASTER CELL
                </span>
                <span className="text-xs font-extrabold text-white">CITIZEN PASS 2026</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                CLASS-A
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-800/50 border border-purple-400/40 overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg text-purple-200 shadow-inner">
                {form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'RD'}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm text-white truncate">{form.name}</h3>
                <span className="text-[11px] text-purple-200 font-mono block">{form.citizenId}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Inundation Sensor Linked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/5 rounded-xl p-2.5 border border-white/10">
              <div>
                <span className="text-[9px] text-slate-400 block">PRIMARY WARD</span>
                <span className="text-white font-bold truncate block">{currentWardObj.name}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">BLOOD GROUP</span>
                <span className="text-red-300 font-bold block">{form.bloodGroup}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/10">
                <span className="text-[9px] text-slate-400 block">EMERGENCY SOS CELL</span>
                <span className="text-purple-200 font-bold block truncate">{form.emergencyAlt}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>CHIP: RFID-90214-MH</span>
            <span className="text-purple-300 font-bold">BMC HYD-MESH</span>
          </div>
        </div>

        {/* Right: Editable Form Controls */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Full Citizen Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.name}
                  disabled={!editMode}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                  placeholder="e.g. Rahul Deshmukh"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Registered Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.phone}
                  disabled={!editMode}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Email (Alert Broadcasts)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={form.email}
                  disabled={!editMode}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Primary Municipal Ward</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-purple-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={form.wardId}
                  disabled={!editMode}
                  onChange={(e) => handleChange('wardId', e.target.value)}
                  className={`w-full pl-9 pr-8 py-2 text-sm rounded-xl border cursor-pointer ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {WARDS_DATA.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.vulnLevel} Risk)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Blood Group (Triage Records)</label>
              <div className="relative">
                <Heart className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={form.bloodGroup}
                  disabled={!editMode}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Immediate Next-of-Kin SOS Contact</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.emergencyAlt}
                  disabled={!editMode}
                  onChange={(e) => handleChange('emergencyAlt', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    editMode 
                      ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                  placeholder="+91 XXXXX XXXXX (Relation)"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Permanent Residential Address</label>
              <input
                type="text"
                value={form.address}
                disabled={!editMode}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  editMode 
                    ? 'border-purple-primary bg-white focus:outline-none ring-2 ring-purple-100 text-ink' 
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              />
            </div>
          </div>

          {editMode && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  speakAlert('Citizen identity details updated.');
                }}
                className="px-4 py-2 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Save Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Digital BMC Citizen QR Pass */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-ink rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 bg-purple-soft rounded-2xl text-purple-primary mb-2">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-ink">Citizen Emergency Transit QR Pass</h3>
              <p className="text-xs text-muted">Scan by NDRF, BMC Ward Wardens & Mumbai Traffic Police</p>
            </div>

            {/* Mock High-Res QR Code */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-white p-3 border-2 border-slate-800 rounded-xl shadow-inner flex items-center justify-center relative">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                  <rect x="35" y="10" width="10" height="10" />
                  <rect x="50" y="10" width="15" height="5" />
                  <rect x="40" y="25" width="20" height="8" />
                  <rect x="10" y="35" width="8" height="20" />
                  <rect x="25" y="40" width="15" height="15" />
                  <rect x="45" y="40" width="10" height="25" />
                  <rect x="65" y="40" width="25" height="10" />
                  <rect x="35" y="70" width="15" height="20" />
                  <rect x="55" y="65" width="10" height="10" />
                  <rect x="70" y="65" width="20" height="25" />
                </svg>
                {/* Center Seal */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-purple-primary text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
                    BMC
                  </div>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-purple-primary mt-3">
                {form.citizenId}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Cryptographically signed with ED25519 • Valid Season 2026
              </span>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-purple-soft/50 border border-purple-200 text-xs text-purple-deep flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
              <span>
                Permits green-channel transit on coastal roads & high-ground elevated flyovers when red alerts are active.
              </span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" /> Print / Save Pass
              </button>
              <button
                type="button"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `BMC_Citizen_Pass_${form.name.replace(/\s+/g, '_')}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Export Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

