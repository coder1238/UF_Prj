import React, { useState } from 'react';
import { X, Radio, Signal, CheckCircle2, ShieldCheck, MapPin, RefreshCw, Smartphone } from 'lucide-react';

const INITIAL_TOWERS = [
  { id: 'TOW-KURLA-01', name: 'Kurla Central Telecom Hub (eNodeB)', ward: 'Ward L', operator: 'Shared Multi-Telco (Jio/Airtel/Vi/BSNL)', lat: 19.0726, lng: 72.8794, radiusKm: 2.4, activeSims: 184000, status: 'ONLINE', power: '48 dBm' },
  { id: 'TOW-SION-02', name: 'Sion Circle High-Site (gNodeB 5G)', ward: 'Ward F/N', operator: 'Shared Multi-Telco', lat: 19.0400, lng: 72.8624, radiusKm: 2.1, activeSims: 142000, status: 'ONLINE', power: '46 dBm' },
  { id: 'TOW-ANDHERI-03', name: 'Andheri East SEEPZ Mast', ward: 'Ward K/E', operator: 'Shared Multi-Telco', lat: 19.1197, lng: 72.8468, radiusKm: 2.6, activeSims: 215000, status: 'ONLINE', power: '49 dBm' },
  { id: 'TOW-DADAR-04', name: 'Dadar TT Junction Macro Cell', ward: 'Ward G/N', operator: 'Shared Multi-Telco', lat: 19.0178, lng: 72.8478, radiusKm: 1.8, activeSims: 128000, status: 'ONLINE', power: '44 dBm' },
  { id: 'TOW-BANDRA-05', name: 'Bandra East BKC Financial Gantry', ward: 'Ward H/E', operator: 'Shared Multi-Telco', lat: 19.0607, lng: 72.8640, radiusKm: 2.2, activeSims: 165000, status: 'ONLINE', power: '47 dBm' },
  { id: 'TOW-CHEMBUR-06', name: 'Chembur Naka Coastal Relay', ward: 'Ward M/W', operator: 'Shared Multi-Telco', lat: 19.0522, lng: 72.8995, radiusKm: 2.0, activeSims: 98000, status: 'ONLINE', power: '45 dBm' },
];

export default function CellBroadcastGeofenceModal({
  isOpen,
  onClose,
  targetWards = [],
  onApplyAudience,
}) {
  if (!isOpen) return null;

  const [towers, setTowers] = useState(INITIAL_TOWERS);
  const [selectedTowerIds, setSelectedTowerIds] = useState(
    INITIAL_TOWERS.slice(0, 4).map((t) => t.id)
  );

  const toggleTower = (id) => {
    setSelectedTowerIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedTowerIds(towers.map((t) => t.id));
  const deselectAll = () => setSelectedTowerIds([]);

  const snapToWards = () => {
    // Select towers located in target wards
    const matching = towers
      .filter((t) => targetWards.some((w) => t.ward.includes(w) || w.includes(t.ward)))
      .map((t) => t.id);
    setSelectedTowerIds(matching.length > 0 ? matching : towers.slice(0, 3).map((t) => t.id));
  };

  const totalSims = towers
    .filter((t) => selectedTowerIds.includes(t.id))
    .reduce((acc, curr) => acc + curr.activeSims, 0);

  const avgRadius = (
    towers
      .filter((t) => selectedTowerIds.includes(t.id))
      .reduce((acc, curr) => acc + curr.radiusKm, 0) / (selectedTowerIds.length || 1)
  ).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-alert-soft text-status-alert">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Cell Broadcast (WEA/CMAS) Geofence &amp; Base Station Matrix
              </h3>
              <p className="text-[11px] text-ink-secondary">
                3GPP TS 23.041 Cell Broadcast Centre (CBC) &amp; Telecom Carrier Interconnect
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="px-5 py-3 bg-surface-secondary border-b border-border grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-surface p-2.5 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Active Base Stations</span>
            <div className="text-base font-bold font-mono text-purple mt-0.5">
              {selectedTowerIds.length} / {towers.length} eNodeB/gNodeB
            </div>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Connected Handsets</span>
            <div className="text-base font-bold font-mono text-status-alert mt-0.5">
              {(totalSims / 1000).toFixed(0)}k SIMs Active
            </div>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Average Broadcast Radius</span>
            <div className="text-base font-bold font-mono text-ink mt-0.5">
              ~{avgRadius} km Radial
            </div>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">CBC Gateway Latency</span>
            <div className="text-base font-bold font-mono text-status-safe mt-0.5">
              1.2s Handshake
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-5 py-2.5 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-border text-ink font-semibold text-[11px]"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-border text-ink font-semibold text-[11px]"
            >
              Deselect All
            </button>
            <button
              onClick={snapToWards}
              className="px-2.5 py-1 rounded bg-purple-soft text-purple hover:bg-purple-light font-bold text-[11px] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Snap to Selected Wards</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-ink-secondary">
            Broadcasting via: Jio 5G NR • Airtel 4G LTE • Vi • BSNL GSM
          </span>
        </div>

        {/* Towers List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
          {towers.map((tower) => {
            const isSelected = selectedTowerIds.includes(tower.id);
            return (
              <div
                key={tower.id}
                onClick={() => toggleTower(tower.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-purple-soft/30 border-purple shadow-subtle'
                    : 'bg-surface-secondary border-border opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-purple border-purple text-white' : 'border-border bg-surface'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-ink">{tower.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-surface border border-border text-ink-secondary font-semibold">
                        {tower.ward}
                      </span>
                      <span className="text-[10px] font-mono text-status-safe font-bold">
                        {tower.power}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-secondary flex items-center gap-3 mt-1 font-mono">
                      <span>Coordinates: {tower.lat.toFixed(4)}, {tower.lng.toFixed(4)}</span>
                      <span>Radius: {tower.radiusKm} km</span>
                      <span>Target: {tower.operator}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-ink font-bold block">
                      {(tower.activeSims / 1000).toLocaleString()}k
                    </span>
                    <span className="text-[10px] text-ink-secondary">Live SIM Handsets</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tower.status === 'ONLINE'
                        ? 'bg-status-safe-soft text-status-safe'
                        : 'bg-status-alert-soft text-status-alert'
                    }`}
                  >
                    {tower.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary">
            <Signal className="w-4 h-4 text-purple" />
            <span>Cell Broadcast overrides silent mode on LTE/5G handsets within target radius.</span>
          </div>

          <button
            onClick={() => {
              if (onApplyAudience) {
                onApplyAudience(`${(totalSims / 1000).toFixed(0)},000 citizens`);
              }
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-status-alert hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Lock Geofence &amp; Apply Audience Reach</span>
          </button>
        </div>
      </div>
    </div>
  );
}

