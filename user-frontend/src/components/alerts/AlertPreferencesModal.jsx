import React, { useState, useEffect } from 'react';
import { X, Settings, Bell, MessageSquare, Smartphone, Volume2, ShieldAlert, Check } from 'lucide-react';
import { WARDS_LIST } from '../../data/alertsData';

const DEFAULT_PREFERENCES = {
  webPush: true,
  sms: true,
  whatsapp: true,
  audioAlarm: true,
  minDepthCm: 15,
  selectedWards: ['all'],
  overrideQuietHours: true,
  phoneNumber: '+91 98200 12345'
};

export default function AlertPreferencesModal({ onClose }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('citizen_alert_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('citizen_alert_preferences', JSON.stringify(preferences));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWard = (wardId) => {
    if (wardId === 'all') {
      setPreferences(p => ({ ...p, selectedWards: ['all'] }));
      return;
    }
    const current = preferences.selectedWards.filter(w => w !== 'all');
    if (current.includes(wardId)) {
      const next = current.filter(w => w !== wardId);
      setPreferences(p => ({ ...p, selectedWards: next.length ? next : ['all'] }));
    } else {
      setPreferences(p => ({ ...p, selectedWards: [...current, wardId] }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <Settings className="w-5 h-5" /> Alert Notification Rules & Subscriptions
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-ink">Preferences Saved!</h4>
            <p className="text-xs text-muted mt-1">Your threshold alerts have been synced to the municipal broadcast gateway.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {/* Delivery Channels */}
            <div>
              <label className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-2">
                Active Notification Channels
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-purple-primary" /> Web Push
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.webPush}
                    onChange={(e) => setPreferences({ ...preferences, webPush: e.target.checked })}
                    className="w-4 h-4 text-purple-primary rounded"
                  />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.whatsapp}
                    onChange={(e) => setPreferences({ ...preferences, whatsapp: e.target.checked })}
                    className="w-4 h-4 text-purple-primary rounded"
                  />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" /> SMS Cell
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                    className="w-4 h-4 text-purple-primary rounded"
                  />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-red-600" /> Siren Tone
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.audioAlarm}
                    onChange={(e) => setPreferences({ ...preferences, audioAlarm: e.target.checked })}
                    className="w-4 h-4 text-purple-primary rounded"
                  />
                </label>
              </div>
            </div>

            {/* Depth Threshold */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700">Minimum Water Depth Trigger</span>
                <span className="font-mono font-bold text-purple-primary">&ge; {preferences.minDepthCm} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={preferences.minDepthCm}
                onChange={(e) => setPreferences({ ...preferences, minDepthCm: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
              />
              <span className="text-[10px] font-mono text-muted block mt-1">
                Only notify if water reaches curb height or exceeds selected threshold.
              </span>
            </div>

            {/* Subscribed Wards */}
            <div>
              <label className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1.5">
                Geographic Subscription Wards
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WARDS_LIST.map((w) => {
                  const isSelected = preferences.selectedWards.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleWard(w.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                        isSelected
                          ? 'bg-purple-primary text-white font-bold'
                          : 'bg-canvas border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {w.id === 'all' ? 'All Wards' : w.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency override */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <ShieldAlert className="w-4 h-4 text-red-600" /> Override DND during Critical Red Alerts
              </span>
              <input
                type="checkbox"
                checked={preferences.overrideQuietHours}
                onChange={(e) => setPreferences({ ...preferences, overrideQuietHours: e.target.checked })}
                className="w-4 h-4 text-purple-primary rounded"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                Save Notification Rules
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

