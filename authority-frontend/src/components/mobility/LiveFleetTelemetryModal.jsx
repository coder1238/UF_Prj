import React, { useState } from 'react';
import { X, Radio, Truck, Activity, BatteryCharging, Navigation, Phone, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { ACTIVE_MOBILITY_FLEET, MOBILITY_VEHICLES } from './mobilityConstants';

export default function LiveFleetTelemetryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [fleet, setFleet] = useState(ACTIVE_MOBILITY_FLEET);
  const [selectedUnit, setSelectedUnit] = useState(ACTIVE_MOBILITY_FLEET[0]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [pingStatus, setPingStatus] = useState(null);

  const handlePingUnit = (unitId) => {
    setPingStatus(`CAD Link Verified: Ping packet ACK from ${unitId} in 32ms.`);
    setTimeout(() => setPingStatus(null), 3500);
  };

  const handleReroute = (unitId, newRoute) => {
    setFleet((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, assignedRoute: newRoute, status: `REROUTED TO ${newRoute.toUpperCase()}` } : u))
    );
    if (selectedUnit.id === unitId) {
      setSelectedUnit((prev) => ({ ...prev, assignedRoute: newRoute, status: `REROUTED TO ${newRoute.toUpperCase()}` }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Radio className="w-5 h-5 animate-pulse text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Emergency Fleet CAD Telemetry &amp; GPS Monitor
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe">
                  5 Units Active
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Real-time automated vehicle location (AVL), water depth under carriage, and dynamic detour assignment
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

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1">
          {/* Left Column: Fleet List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-ink-secondary">
                Dispatched Emergency Fleet
              </span>
              <span className="text-[11px] font-mono text-ink-muted">Frequency: 148.550 MHz</span>
            </div>

            {pingStatus && (
              <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pingStatus}</span>
              </div>
            )}

            <div className="space-y-2">
              {fleet.map((u) => {
                const vehMeta = MOBILITY_VEHICLES.find((v) => v.id === u.vehicleType) || MOBILITY_VEHICLES[0];
                const isSelected = selectedUnit.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUnit(u)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-soft/50 border-purple shadow-elevated'
                        : 'bg-surface border-border hover:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: vehMeta.color }}
                        ></span>
                        <span className="font-bold text-xs text-ink">{u.callsign}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-ink-secondary border border-border">
                          {u.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-purple border border-border">
                        {u.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-[10px] text-ink-muted block">Location</span>
                        <span className="font-medium text-ink truncate block">{u.currentLocation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink-muted block">Speed / Water</span>
                        <span className="font-mono font-semibold text-ink">
                          {u.speedKmh} km/h •{' '}
                          <span className={u.currentWaterDepthCm > 0 ? 'text-status-alert' : 'text-status-safe'}>
                            {u.currentWaterDepthCm}cm
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink-muted block">ETA / Battery</span>
                        <span className="font-mono text-ink">
                          {u.etaMin > 0 ? `${u.etaMin}m` : 'On Scene'} • {u.fuelBatteryPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Unit Detail & Dispatcher Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-surface-secondary/40 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-mono font-bold text-ink uppercase">Unit Telemetry Card</span>
              <button
                onClick={() => handlePingUnit(selectedUnit.id)}
                className="text-[11px] text-purple hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Ping Unit
              </button>
            </div>

            {/* Selected unit quick info */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-surface border border-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Operator / Driver:</span>
                  <span className="font-bold text-ink">{selectedUnit.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Direct Comms:</span>
                  <span className="font-mono font-semibold text-purple flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {selectedUnit.contact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-ink">
                    {selectedUnit.lat.toFixed(4)}°N, {selectedUnit.lng.toFixed(4)}°E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Destination Hub:</span>
                  <span className="font-semibold text-ink">{selectedUnit.destination}</span>
                </div>
              </div>

              {/* Reroute Selector */}
              <div className="p-3 rounded-lg bg-surface border border-border space-y-2">
                <span className="text-[11px] font-bold text-ink block">Dynamic Corridor Assignment</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleReroute(selectedUnit.id, 'flood-aware')}
                    className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedUnit.assignedRoute === 'flood-aware'
                        ? 'bg-purple text-white border-purple'
                        : 'bg-surface-secondary text-ink hover:border-purple'
                    }`}
                  >
                    EEH &amp; JVLR Flyovers
                  </button>
                  <button
                    onClick={() => handleReroute(selectedUnit.id, 'emergency')}
                    className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedUnit.assignedRoute === 'emergency'
                        ? 'bg-status-warning text-white border-status-warning'
                        : 'bg-surface-secondary text-ink hover:border-status-warning'
                    }`}
                  >
                    BKC Elevated Bypass
                  </button>
                </div>
              </div>

              {/* Instant CAD Terminal Message to Driver */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-ink-secondary block">
                  Transmit CAD MDT Alert to {selectedUnit.callsign}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="e.g. Kurla choke point 34cm, maintain flyover lane"
                    className="flex-1 bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-purple"
                  />
                  <button
                    onClick={() => {
                      if (!broadcastMessage) return;
                      handlePingUnit(selectedUnit.id);
                      setBroadcastMessage('');
                    }}
                    className="px-3 py-1.5 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary">
            Syncing with Mumbai Traffic Police CAD Gateway &amp; 108 Emergency Medical Response Centre.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close CAD Monitor
          </button>
        </div>
      </div>
    </div>
  );
}

