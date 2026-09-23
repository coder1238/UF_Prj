import React, { useState } from 'react';
import {
  X,
  Home,
  AlertTriangle,
  CheckCircle2,
  Users,
  Fuel,
  Droplets,
  Truck,
  Search,
} from 'lucide-react';
import { RELIEF_SHELTERS_DATA } from './scenarioConstants';

export default function ShelterCapacityTrackerModal({ isOpen, onClose, scenarioParams }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestedSupplies, setRequestedSupplies] = useState({});

  // Dynamic flood water level around low areas based on rainfall and tide
  const floodLevelMsl = 2.8 + ((scenarioParams?.rainfallIntensity || 50) - 50) * 0.015 + ((scenarioParams?.tideLevel || 3.0) - 3.0) * 0.2;

  const handleRequestSupply = (id) => {
    setRequestedSupplies((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const filteredShelters = RELIEF_SHELTERS_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ward.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-warning-soft text-status-warning">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Emergency Evacuation Shelter Inundation &amp; Logistics Tracker
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-warning-soft text-status-warning font-bold">
                  CIVIC RESILIENCE
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Monitor safe access routes, plinth clearance, generator fuel life, and dry food rations across relief camps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="p-3 border-b border-border bg-surface-secondary/40 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search shelter by name or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-ink placeholder:text-ink-muted focus:outline-none focus:border-purple"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-ink-secondary">
              Modeled Water Level: <strong className="text-status-alert">+{floodLevelMsl.toFixed(2)}m MSL</strong>
            </span>
            <span className="text-ink-secondary">
              Total Safe Capacity: <strong className="text-purple">11,000 Persons</strong>
            </span>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="p-4 overflow-y-auto max-h-[calc(92vh-160px)] space-y-3">
          {filteredShelters.map((shelter) => {
            const isAccessCut = floodLevelMsl > shelter.accessRoadElev;
            const occupancyPct = Math.round((shelter.current / shelter.capacity) * 100);
            const isRequested = requestedSupplies[shelter.id];

            return (
              <div
                key={shelter.id}
                className="p-3.5 rounded-xl border border-border bg-surface hover:border-purple/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-ink">{shelter.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink font-semibold">
                        {shelter.ward}
                      </span>
                      {isAccessCut ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> ACCESS ROAD INUNDATED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ROAD DRY &amp; CLEAR
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-secondary mt-1 flex items-center gap-4">
                      <span>Plinth Structure: <strong>{shelter.groundFloorSafety}</strong></span>
                      <span>Access Road Elev: <strong>{shelter.accessRoadElev}m MSL</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRequestSupply(shelter.id)}
                      disabled={isRequested}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isRequested
                          ? 'bg-status-safe-soft text-status-safe border border-status-safe/40'
                          : 'bg-purple text-white hover:bg-purple-deep shadow-subtle'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isRequested ? 'Resupply Dispatched' : 'Request Relief Rations'}</span>
                    </button>
                  </div>
                </div>

                {/* Logistics Bar */}
                <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-surface-secondary/40">
                    <div className="flex items-center justify-between text-[10px] text-ink-secondary mb-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple" /> Occupancy
                      </span>
                      <span>{shelter.current} / {shelter.capacity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple"
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-surface-secondary/40">
                    <span className="text-[10px] text-ink-secondary block flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-status-safe" /> Water &amp; Dry Rations
                    </span>
                    <strong className="text-ink font-bold mt-0.5 block">
                      {shelter.waterFoodDays} Days Reserves
                    </strong>
                  </div>

                  <div className="p-2 rounded-lg bg-surface-secondary/40">
                    <span className="text-[10px] text-ink-secondary block flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-status-warning" /> DG Genset Fuel Life
                    </span>
                    <strong className="text-status-warning font-bold mt-0.5 block">
                      {shelter.gensetFuelHrs} Hours Autonomous
                    </strong>
                  </div>

                  <div className="p-2 rounded-lg bg-surface-secondary/40">
                    <span className="text-[10px] text-ink-secondary block">Road Water Depth</span>
                    <strong
                      className={`font-bold mt-0.5 block ${
                        isAccessCut ? 'text-status-alert' : 'text-status-safe'
                      }`}
                    >
                      {isAccessCut
                        ? `+${((floodLevelMsl - shelter.accessRoadElev) * 100).toFixed(0)} cm Water Cut`
                        : '0 cm (Submersion Free)'}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
