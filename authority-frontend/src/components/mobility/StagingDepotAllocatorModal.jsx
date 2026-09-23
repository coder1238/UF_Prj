import React, { useState } from 'react';
import { X, Building2, Fuel, Zap, Truck, CheckCircle2, Shield, Wrench } from 'lucide-react';
import { ELEVATED_STAGING_DEPOTS } from './mobilityConstants';

export default function StagingDepotAllocatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [depots, setDepots] = useState(ELEVATED_STAGING_DEPOTS);
  const [selectedDepot, setSelectedDepot] = useState(ELEVATED_STAGING_DEPOTS[0]);
  const [toast, setToast] = useState(null);

  const handleDispatchCrane = (depotId) => {
    setDepots((prev) =>
      prev.map((d) =>
        d.id === depotId && d.availableTowingCranes > 0
          ? { ...d, availableTowingCranes: d.availableTowingCranes - 1 }
          : d
      )
    );
    setToast(`Heavy Towing Crane dispatched from ${depotId} to clear stranded traffic.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Building2 className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Elevated Emergency Staging Depots &amp; Resource Allocation
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe text-white">
                  4 High-Ground Hubs
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Secure high-elevation fleet marshaling grounds with towing cranes, reserve dewatering pumps, and fuel depots
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {toast && (
            <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {/* Depots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {depots.map((depot) => {
              const isSelected = selectedDepot.id === depot.id;
              return (
                <div
                  key={depot.id}
                  onClick={() => setSelectedDepot(depot)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple bg-purple-soft/30 shadow-elevated'
                      : 'border-border bg-surface hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink">{depot.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-purple border border-border">
                      +{depot.elevationM}m MSL
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-status-safe font-semibold block mt-1">
                    {depot.status} &bull; Capacity: {depot.capacityVehicles} Vehicles
                  </span>

                  {/* Resource Inventory */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                    <div className="flex items-center gap-1.5 text-ink">
                      <Truck className="w-3.5 h-3.5 text-purple" />
                      <span>{depot.availableTowingCranes} Tow Cranes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink">
                      <Wrench className="w-3.5 h-3.5 text-status-warning" />
                      <span>{depot.dewateringPumpsReserve} Spare Pumps</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink">
                      <Fuel className="w-3.5 h-3.5 text-status-alert" />
                      <span>{depot.emergencyFuelLiters.toLocaleString()} L Diesel</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink">
                      <Zap className="w-3.5 h-3.5 text-status-safe" />
                      <span>{depot.chargingPortsEV} EV Fast Chargers</span>
                    </div>
                  </div>

                  {/* Dispatch Action */}
                  <div className="mt-3 pt-2 border-t border-border/40 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatchCrane(depot.id);
                      }}
                      disabled={depot.availableTowingCranes === 0}
                      className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep disabled:opacity-50 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-subtle"
                    >
                      <Truck className="w-3 h-3" /> Dispatch Recovery Crane
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">
            Strategic fleet depot reserves certified above 100-year flood datum.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Depot Allocator
          </button>
        </div>
      </div>
    </div>
  );
}

