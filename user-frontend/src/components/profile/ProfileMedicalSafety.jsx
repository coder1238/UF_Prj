import React, { useState } from 'react';
import { 
  Heart, ShieldAlert, AlertCircle, ThermometerSnowflake, 
  BatteryCharging, Activity, Plus, CheckCircle2, Clock, 
  HelpCircle, Sparkles, FileText, Pill
} from 'lucide-react';

export default function ProfileMedicalSafety({ 
  medicalProfile, 
  onUpdateMedical, 
  speakAlert 
}) {
  const [data, setData] = useState({
    hasInsulin: medicalProfile.hasInsulin ?? true,
    insulinDosesLeft: medicalProfile.insulinDosesLeft ?? 14,
    icePacksHours: medicalProfile.icePacksHours ?? 18,
    hasDialysis: medicalProfile.hasDialysis ?? false,
    dialysisDaysFreq: medicalProfile.dialysisDaysFreq ?? 'Every 2 Days',
    requiresOxygen: medicalProfile.requiresOxygen ?? false,
    oxygenCylinderBackupHours: medicalProfile.oxygenCylinderBackupHours ?? 12,
    mobilityStatus: medicalProfile.mobilityStatus ?? 'Agile / Fully Mobile',
    bloodThinnerMeds: medicalProfile.bloodThinnerMeds ?? false,
    cardiacConditions: medicalProfile.cardiacConditions ?? false,
    allergies: medicalProfile.allergies ?? 'Penicillin, Shellfish',
    doctorContact: medicalProfile.doctorContact ?? 'Dr. Mehta (KEM Hospital) +91 98200 11223'
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (field, val) => {
    const updated = { ...data, [field]: val };
    setData(updated);
    onUpdateMedical(updated);
  };

  // Determine NDRF priority level
  const isHighPriority = data.requiresOxygen || data.hasDialysis || data.mobilityStatus === 'Bedridden / Stretcher';
  const isModeratePriority = data.hasInsulin || data.mobilityStatus === 'Wheelchair Dependent' || data.cardiacConditions;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 shadow-xs">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink">Emergency Medical Profile & Cold-Chain Vault</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isHighPriority 
                  ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' 
                  : isModeratePriority 
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {isHighPriority ? 'NDRF RED TRIAGE PRIORITY' : isModeratePriority ? 'NDRF AMBER PRIORITY' : 'STANDARD PRIORITY'}
              </span>
            </div>
            <p className="text-xs text-muted">
              Pre-registered with 108 Emergency Ambulance Dispatch and Indian Navy/NDRF zodiac boat manifests.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className="px-3.5 py-2 bg-canvas hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition self-start sm:self-center"
        >
          {editMode ? 'Save & Close' : 'Edit Medical Flags'}
        </button>
      </div>

      {/* Cold Chain Survival Box */}
      {data.hasInsulin && (
        <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white text-sky-600 rounded-xl shadow-xs border border-sky-100">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block font-mono">
                Insulin Cold-Chain Preservation Buffer
              </span>
              <p className="text-xs text-sky-800 mt-0.5">
                Current insulated freezer packs will keep vials under 8°C for approx <strong className="text-sky-950">{data.icePacksHours} hours</strong> without grid power.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-sky-700 block">Doses In Stock</span>
              <span className="text-lg font-bold font-mono text-sky-950">{data.insulinDosesLeft} Units</span>
            </div>
            {editMode && (
              <input
                type="number"
                min="1"
                max="72"
                value={data.icePacksHours}
                onChange={(e) => handleChange('icePacksHours', Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs rounded-lg border border-sky-300 bg-white"
                title="Hours of cold-chain protection"
              />
            )}
          </div>
        </div>
      )}

      {/* Conditions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Insulin Dependent */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-canvas/60 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-ink block">Insulin Dependent (Diabetes)</span>
              <span className="text-[11px] text-muted">Requires cold storage</span>
            </div>
            <input
              type="checkbox"
              disabled={!editMode}
              checked={data.hasInsulin}
              onChange={(e) => handleChange('hasInsulin', e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-500">
            Status: {data.hasInsulin ? <span className="text-red-700 font-bold">Active Cold-Chain Protocol</span> : 'None'}
          </div>
        </div>

        {/* Dialysis Dependent */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-canvas/60 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-ink block">Hemodialysis Schedule</span>
              <span className="text-[11px] text-muted">Critical hospital transit need</span>
            </div>
            <input
              type="checkbox"
              disabled={!editMode}
              checked={data.hasDialysis}
              onChange={(e) => handleChange('hasDialysis', e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-500">
            Frequency: <span className="font-bold text-ink">{data.dialysisDaysFreq}</span>
          </div>
        </div>

        {/* Oxygen Concentrator */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-canvas/60 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold text-ink block">Supplemental Oxygen Support</span>
              <span className="text-[11px] text-muted">Power-dependent concentrator</span>
            </div>
            <input
              type="checkbox"
              disabled={!editMode}
              checked={data.requiresOxygen}
              onChange={(e) => handleChange('requiresOxygen', e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-500">
            Backup: <span className="font-bold text-ink">{data.oxygenCylinderBackupHours}h O2 Tank Available</span>
          </div>
        </div>

        {/* Mobility Status */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-canvas/60">
          <span className="text-xs font-extrabold text-ink block mb-1">Mobility & Evacuation Agility</span>
          <select
            disabled={!editMode}
            value={data.mobilityStatus}
            onChange={(e) => handleChange('mobilityStatus', e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
          >
            <option value="Agile / Fully Mobile">Agile / Fully Mobile</option>
            <option value="Slow Walking / Elderly">Slow Walking / Elderly</option>
            <option value="Wheelchair Dependent">Wheelchair Dependent</option>
            <option value="Bedridden / Stretcher">Bedridden / Stretcher (Boat Required)</option>
          </select>
        </div>

        {/* Doctor Contact */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-canvas/60 sm:col-span-2">
          <span className="text-xs font-extrabold text-ink block mb-1">Attending Physician / Hospital Record</span>
          <input
            type="text"
            disabled={!editMode}
            value={data.doctorContact}
            onChange={(e) => handleChange('doctorContact', e.target.value)}
            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
            placeholder="Physician Name and Contact"
          />
        </div>
      </div>
    </div>
  );
}

