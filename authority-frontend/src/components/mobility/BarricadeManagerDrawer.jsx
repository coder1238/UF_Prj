import React, { useState } from 'react';
import { X, ShieldAlert, Plus, Check, AlertTriangle, FileText, Trash2, MapPin } from 'lucide-react';
import { INITIAL_BARRICADES } from './mobilityConstants';

export default function BarricadeManagerDrawer({ isOpen, onClose, onBarricadeChange }) {
  if (!isOpen) return null;

  const [barricades, setBarricades] = useState(INITIAL_BARRICADES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoad, setNewRoad] = useState('');
  const [newWard, setNewWard] = useState('Ward L');
  const [newReason, setNewReason] = useState('Waterlogging > 30cm');
  const [newType, setNewType] = useState('Hard Concrete Barrier');
  const [noticeToast, setNoticeToast] = useState(null);

  const toggleStatus = (id) => {
    setBarricades((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status.includes('ACTIVE') || b.status.includes('LOCKED') ? 'LIFTED / OPEN' : 'ACTIVE BARRICADE';
          return { ...b, status: nextStatus };
        }
        return b;
      });
      if (onBarricadeChange) onBarricadeChange(updated);
      return updated;
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newRoad) return;
    const item = {
      id: `BAR-0${barricades.length + 1}`,
      roadName: newRoad,
      ward: newWard,
      type: newType,
      status: 'ACTIVE BARRICADE',
      reason: newReason,
      authorizedBy: 'BMC Joint Control Cell',
      diversionRoute: 'Diverted to nearest elevated connector',
      timestamp: 'Just now',
    };
    const nextList = [item, ...barricades];
    setBarricades(nextList);
    if (onBarricadeChange) onBarricadeChange(nextList);
    setNewRoad('');
    setShowAddForm(false);
  };

  const handleRemove = (id) => {
    const nextList = barricades.filter((b) => b.id !== id);
    setBarricades(nextList);
    if (onBarricadeChange) onBarricadeChange(nextList);
  };

  const handleExportGazette = () => {
    setNoticeToast('Municipal Gazette Order #MCGM/DIS/2026/089 Generated & Transmitted to Traffic Police.');
    setTimeout(() => setNoticeToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border-l border-border w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 px-6 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-status-alert-soft text-status-alert">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Barricade &amp; Road Closure Manager</h3>
              <p className="text-xs text-ink-secondary">
                Enact legally binding emergency closures and coordinate traffic police barricades
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {noticeToast && (
            <div className="p-3 rounded-xl bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono">
              {noticeToast}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Total Barricades</span>
              <span className="text-base font-bold text-ink">{barricades.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-status-alert-soft border border-status-alert/30">
              <span className="text-[10px] text-status-alert uppercase block">Active Closures</span>
              <span className="text-base font-bold text-status-alert">
                {barricades.filter((b) => !b.status.includes('LIFTED')).length}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-status-safe-soft border border-status-safe/30">
              <span className="text-[10px] text-status-safe uppercase block">Corridors Lifted</span>
              <span className="text-base font-bold text-status-safe">
                {barricades.filter((b) => b.status.includes('LIFTED')).length}
              </span>
            </div>
          </div>

          {/* Add Barricade Button / Form */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-3 bg-purple-soft text-purple hover:bg-purple hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-purple/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Enact New Road Closure Barricade
            </button>
          ) : (
            <form onSubmit={handleAdd} className="p-4 rounded-xl bg-surface-secondary border border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ink">New Barricade Declaration</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-ink-secondary hover:text-ink"
                >
                  Cancel
                </button>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">Road / Corridor Name</label>
                <input
                  type="text"
                  required
                  value={newRoad}
                  onChange={(e) => setNewRoad(e.target.value)}
                  placeholder="e.g. S.V. Road near Milan Crossing"
                  className="w-full px-2.5 py-1.5 text-xs bg-surface border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">Ward</label>
                  <select
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-ink"
                  >
                    <option value="Ward L">Ward L (Kurla)</option>
                    <option value="Ward F/N">Ward F/N (Sion/Matunga)</option>
                    <option value="Ward K/E">Ward K/E (Andheri E)</option>
                    <option value="Ward H/W">Ward H/W (Bandra/Khar)</option>
                    <option value="Ward F/S">Ward F/S (Dadar)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">Barrier Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-ink"
                  >
                    <option value="Hard Concrete Barrier">Hard Concrete Barrier</option>
                    <option value="Automated Hydraulic Gate">Automated Hydraulic Gate</option>
                    <option value="Police Flare & Chevrons">Police Flare &amp; Chevrons</option>
                    <option value="Sandbag Wall Dike">Sandbag Wall Dike</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">Closure Rationale</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-surface border border-border rounded-lg text-ink"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
              >
                Issue Barricade Order
              </button>
            </form>
          )}

          {/* Barricade items list */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary block">
              Active Municipal Barricades Registry
            </span>
            {barricades.map((b) => {
              const isClosed = !b.status.includes('LIFTED');
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isClosed
                      ? 'bg-status-alert-soft/40 border-status-alert/40'
                      : 'bg-surface-secondary/40 border-border opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isClosed ? 'bg-status-alert animate-ping' : 'bg-status-safe'}`}></span>
                      <span className="font-bold text-xs text-ink">{b.roadName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-ink-secondary">
                        {b.ward}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isClosed ? 'bg-status-alert text-white' : 'bg-status-safe text-white'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-secondary mt-1.5 leading-snug">
                    <strong className="text-ink">Cause:</strong> {b.reason}
                  </p>
                  <p className="text-[11px] text-purple mt-0.5 font-medium">
                    &rarr; {b.diversionRoute}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60 text-[10px] text-ink-muted">
                    <span>Auth: {b.authorizedBy} • {b.timestamp}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(b.id)}
                        className="text-ink font-semibold hover:underline"
                      >
                        {isClosed ? 'Lift Closure' : 'Re-Activate'}
                      </button>
                      <button
                        onClick={() => handleRemove(b.id)}
                        className="text-status-alert hover:text-status-alert/80"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <button
            onClick={handleExportGazette}
            className="px-3.5 py-2 bg-surface border border-border hover:border-purple text-ink rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-purple" />
            Export Gazette Notice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}

