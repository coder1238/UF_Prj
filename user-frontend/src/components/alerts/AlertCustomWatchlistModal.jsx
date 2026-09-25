import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin, Bell, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

const DEFAULT_WATCHLIST = [
  { id: 'watch-1', label: 'My Home (Matunga East)', ward: 'F-North', radiusKm: 1.0, notifyOn: 'all' },
  { id: 'watch-2', label: 'Office Campus (BKC G-Block)', ward: 'H-East', radiusKm: 0.5, notifyOn: 'critical' },
  { id: 'watch-3', label: 'Parents Residence (Santacruz)', ward: 'K-West', radiusKm: 1.5, notifyOn: 'danger' }
];

export default function AlertCustomWatchlistModal({ activeAlerts, onClose, onToast }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mumbai_citizen_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch (e) {
      return DEFAULT_WATCHLIST;
    }
  });

  const [newLabel, setNewLabel] = useState('');
  const [newWard, setNewWard] = useState('F-North');
  const [newRadius, setNewRadius] = useState(1.0);
  const [newNotifyOn, setNewNotifyOn] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('mumbai_citizen_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      // ignore
    }
  }, [watchlist]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const item = {
      id: `watch-${Date.now()}`,
      label: newLabel.trim(),
      ward: newWard,
      radiusKm: Number(newRadius),
      notifyOn: newNotifyOn
    };
    setWatchlist([item, ...watchlist]);
    setNewLabel('');
    if (onToast) onToast(`Added "${item.label}" to Custom Geofence Watchlist`);
  };

  const handleDelete = (id, label) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
    if (onToast) onToast(`Removed "${label}" from Watchlist`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold">Custom Geofence Watchlist</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs text-slate-600">
            Set custom alert perimeters around your home, workplace, elder residences, or school zones. The system monitors live water accumulation in these wards.
          </p>

          {/* Add New Geofence Form */}
          <form onSubmit={handleAdd} className="bg-canvas border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider block">
              + Add Custom Watch Location
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted block mb-1">Location Label</label>
                <input
                  type="text"
                  placeholder="e.g. My Flat, Kids School, Warehouse"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted block mb-1">Ward Selection</label>
                <select
                  value={newWard}
                  onChange={e => setNewWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
                >
                  <option value="F-North">Ward F-North (Sion / Matunga / Hindmata)</option>
                  <option value="H-East">Ward H-East (BKC / Bandra East)</option>
                  <option value="K-West">Ward K-West (Andheri West / Milan)</option>
                  <option value="Ward L">Ward L (Kurla / Kalina Basin)</option>
                  <option value="Ward K-East">Ward K-East (Andheri East / Saki Naka)</option>
                  <option value="Citywide">Citywide Coastal Strip</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted block mb-1">Geofence Radius</label>
                <select
                  value={newRadius}
                  onChange={e => setNewRadius(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
                >
                  <option value="0.5">500 meters (Immediate Street)</option>
                  <option value="1.0">1.0 kilometer (Neighborhood)</option>
                  <option value="2.0">2.0 kilometers (Sector Basin)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted block mb-1">Notification Sensitivity</label>
                <select
                  value={newNotifyOn}
                  onChange={e => setNewNotifyOn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
                >
                  <option value="all">All Alerts (Critical + Danger + Caution)</option>
                  <option value="critical">Critical & Flash Floods Only</option>
                  <option value="danger">Danger & Critical Only</option>
                </select>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Save Geofence Location
              </button>
            </div>
          </form>

          {/* Current Watchlist Items */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider block">
              Active Watch Perimeters ({watchlist.length})
            </span>

            {watchlist.map(item => {
              // Check if any active alert matches this ward
              const activeBreach = activeAlerts.find(a => 
                (a.ward.toLowerCase() === item.ward.toLowerCase() || 
                 a.wardName?.toLowerCase().includes(item.ward.toLowerCase())) && !a.acknowledged
              );

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    activeBreach 
                      ? 'bg-red-50/70 border-red-300 ring-1 ring-red-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      activeBreach ? 'bg-red-500 text-white' : 'bg-purple-50 text-purple-primary'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.label}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted mt-1">
                        <span>Ward {item.ward}</span>
                        <span>•</span>
                        <span>{item.radiusKm} km Radius</span>
                        <span>•</span>
                        <span className="capitalize">{item.notifyOn} Alerts</span>
                      </div>

                      {activeBreach && (
                        <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold mt-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>ACTIVE HAZARD IN RADIUS: {activeBreach.waterDepthCm} cm waterlogging</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.label)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Geofence"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

