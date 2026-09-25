import React, { useState } from 'react';
import { Plus, Trash2, MapPin, ArrowUpDown, Check } from 'lucide-react';

const PRESET_WAYPOINTS = [
  { id: 'wp-seepz', name: 'SEEPZ Flyover Deck Entry', address: 'JVLR Elevated Ramp, Andheri East', lat: 19.1240, lng: 72.8740 },
  { id: 'wp-marol', name: 'Marol Naka Metro Station', address: 'Andheri-Kurla Rd, Marol', lat: 19.1105, lng: 72.8872 },
  { id: 'wp-bkc-connector', name: 'BKC Elevated Connector Ingress', address: 'BKC Flyover, Bandra East', lat: 19.0620, lng: 72.8650 },
  { id: 'wp-sahar', name: 'Sahar Elevated Road Interchange', address: 'WEH Sahar Ramp, Vile Parle East', lat: 19.0970, lng: 72.8560 }
];

export default function RouteWaypointsManager({
  waypoints = [],
  onAddWaypoint = () => {},
  onRemoveWaypoint = () => {},
  onReorderWaypoints = () => {}
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  const handleAddPreset = () => {
    if (!selectedPresetId) return;
    const preset = PRESET_WAYPOINTS.find(p => p.id === selectedPresetId);
    if (preset) {
      onAddWaypoint({
        ...preset,
        uniqueId: Date.now()
      });
      setSelectedPresetId('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR WAYPOINTS</span>
          <h4 className="text-xs font-bold text-ink">Multi-Stop Via Points & Staging</h4>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1 rounded-xl bg-canvas hover:bg-surface-secondary border border-border text-ink text-xs font-mono font-bold transition flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>{isAdding ? 'Cancel' : 'Add Stop'}</span>
        </button>
      </div>

      {/* Add Waypoint Dropdown Form */}
      {isAdding && (
        <div className="p-3 bg-canvas rounded-xl border border-border space-y-2">
          <label className="text-[10px] font-mono uppercase text-ink-muted block font-bold">
            Select Key Mumbai Waypoint / Elevated Interchange:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="flex-1 bg-white border border-border rounded-xl px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-primary font-medium"
            >
              <option value="">-- Choose safe corridor stop --</option>
              {PRESET_WAYPOINTS.map(wp => (
                <option key={wp.id} value={wp.id}>{wp.name} ({wp.address})</option>
              ))}
            </select>
            <button
              onClick={handleAddPreset}
              disabled={!selectedPresetId}
              className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-primary-hover transition"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Active Waypoints List */}
      {waypoints.length === 0 ? (
        <p className="text-[11px] text-ink-muted font-mono italic">
          No intermediate stops configured. Routing directly from Origin to Destination.
        </p>
      ) : (
        <div className="space-y-1.5">
          {waypoints.map((wp, idx) => (
            <div
              key={wp.uniqueId || idx}
              className="p-2.5 bg-canvas/70 rounded-xl border border-border flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <span className="text-xs font-bold text-ink block truncate">{wp.name}</span>
                  <span className="text-[10px] font-mono text-ink-muted truncate block">{wp.address}</span>
                </div>
              </div>

              <button
                onClick={() => onRemoveWaypoint(idx)}
                className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 transition shrink-0"
                title="Remove Stop"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
