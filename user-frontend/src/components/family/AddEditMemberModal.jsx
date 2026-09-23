import React, { useState, useEffect } from 'react';
import { 
  X, UserPlus, Save, Users, MapPin, Phone, 
  Battery, AlertTriangle, ShieldCheck, Heart, Activity
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

export default function AddEditMemberModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingMember = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Spouse',
    ward: 'H-East',
    locationFuzzy: '',
    phone: '',
    status: 'safe',
    localWaterDepth: 0,
    batteryLevel: '90%',
    mobility: 'Walking / Agile',
    medicalFlag: 'None',
    safetyStatusText: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        relation: editingMember.relation || 'Spouse',
        ward: editingMember.ward || 'H-East',
        locationFuzzy: editingMember.locationFuzzy || '',
        phone: editingMember.phone || '',
        status: editingMember.status || 'safe',
        localWaterDepth: editingMember.localWaterDepth ?? 0,
        batteryLevel: editingMember.batteryLevel || '80%',
        mobility: editingMember.mobility || 'Walking / Agile',
        medicalFlag: editingMember.medicalFlag || 'None',
        safetyStatusText: editingMember.safetyStatusText || ''
      });
    } else {
      setFormData({
        name: '',
        relation: 'Spouse',
        ward: 'H-East',
        locationFuzzy: '',
        phone: '',
        status: 'safe',
        localWaterDepth: 5,
        batteryLevel: '95%',
        mobility: 'Walking / Agile',
        medicalFlag: 'None',
        safetyStatusText: 'Sheltered safely on high ground'
      });
    }
    setErrors({});
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Emergency phone contact required';
    if (!formData.locationFuzzy.trim()) newErrors.locationFuzzy = 'Current neighborhood/location required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      id: editingMember ? editingMember.id : `fam-${Date.now()}`,
      lastCheckIn: editingMember ? editingMember.lastCheckIn : 'Just now',
      localWaterDepth: Number(formData.localWaterDepth) || 0
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              {editingMember ? <Users className="w-5 h-5 text-purple-primary" /> : <UserPlus className="w-5 h-5 text-purple-primary" />}
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">
                {editingMember ? 'Edit Circle Member' : 'Add Family Member or Pet'}
              </h3>
              <p className="text-xs text-muted">Protect and monitor their real-time flood exposure</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          {/* Name & Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Full Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all ${
                  errors.name ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Relation / Role *</label>
              <select 
                value={formData.relation}
                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              >
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Sibling">Sibling</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Pet / Dog">Pet (Dog / Companion)</option>
                <option value="Pet / Cat">Pet (Cat / Small Animal)</option>
                <option value="Roommate">Roommate</option>
              </select>
            </div>
          </div>

          {/* Ward & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Assigned Mumbai Ward</label>
              <select 
                value={formData.ward}
                onChange={e => setFormData({ ...formData, ward: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              >
                {WARDS_DATA.map(w => (
                  <option key={w.id} value={w.id.replace('ward-', '').toUpperCase()}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Emergency Phone *</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98200 00000"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all ${
                  errors.phone ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'
                }`}
              />
              {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Fuzzy Location */}
          <div>
            <label className="block font-bold text-ink mb-1">Neighborhood / Micro-Basin Landmark *</label>
            <input 
              type="text" 
              value={formData.locationFuzzy}
              onChange={e => setFormData({ ...formData, locationFuzzy: e.target.value })}
              placeholder="e.g. Lower Parel West (Near Phoenix Mills)"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all ${
                errors.locationFuzzy ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            />
            {errors.locationFuzzy && <p className="text-[10px] text-red-500 mt-1">{errors.locationFuzzy}</p>}
          </div>

          {/* Safety Status & Water Depth */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Initial Safety State</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              >
                <option value="safe">Safe (High Ground)</option>
                <option value="caution">Caution (Water Nearby)</option>
                <option value="danger">Danger (High Risk)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Local Water (cm)</label>
              <input 
                type="number" 
                min="0"
                max="150"
                value={formData.localWaterDepth}
                onChange={e => setFormData({ ...formData, localWaterDepth: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Phone Battery</label>
              <input 
                type="text" 
                value={formData.batteryLevel}
                onChange={e => setFormData({ ...formData, batteryLevel: e.target.value })}
                placeholder="85%"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Mobility & Medical Support Needs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Mobility Mode</label>
              <select 
                value={formData.mobility}
                onChange={e => setFormData({ ...formData, mobility: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              >
                <option value="Walking / Agile">Walking / Agile</option>
                <option value="Elderly / Slow Pace">Elderly / Slow Pace</option>
                <option value="Wheelchair / Special Assist">Wheelchair / Special Assist</option>
                <option value="Two-Wheeler">Two-Wheeler</option>
                <option value="SUV / High-Clearance">SUV / High-Clearance 4x4</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Medical Vulnerability</label>
              <select 
                value={formData.medicalFlag}
                onChange={e => setFormData({ ...formData, medicalFlag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
              >
                <option value="None">None (Standard)</option>
                <option value="Insulin Dependent">Insulin (Cold Storage Needed)</option>
                <option value="Asthma / Inhaler">Asthma / Inhaler</option>
                <option value="Dialysis Schedule">Dialysis Schedule</option>
                <option value="Cardiac / Hypertension">Cardiac / Hypertension</option>
                <option value="Sensory / Autism">Sensory / Autism Support</option>
              </select>
            </div>
          </div>

          {/* Safety Status Narrative */}
          <div>
            <label className="block font-bold text-ink mb-1">Live Safety Note / Instructions</label>
            <textarea 
              rows="2"
              value={formData.safetyStatusText}
              onChange={e => setFormData({ ...formData, safetyStatusText: e.target.value })}
              placeholder="e.g. Currently holding on 3rd floor. Dry supplies available."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-primary/30 transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" /> {editingMember ? 'Save Changes' : 'Add to Circle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

