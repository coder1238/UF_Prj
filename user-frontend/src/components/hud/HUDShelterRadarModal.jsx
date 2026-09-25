import React, { useState } from 'react';
import { 
  X, ShieldCheck, MapPin, Building, BedDouble, 
  Zap, Car, ArrowRight, CheckCircle2 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export const NEARBY_SHELTERS = [
  {
    id: 'shelter-bkc-1',
    name: 'BKC MMRDA Disaster Relocation Center (Hall 2)',
    category: 'MUNICIPAL REFUGE',
    distanceKm: 1.4,
    travelTimeMins: 6,
    elevation: '+14.2m MSL',
    status: 'DRY HIGH GROUND',
    totalCapacity: 800,
    availableCapacity: 340,
    dryParkingSpots: 85,
    hasMedical: true,
    hasGenerator: true,
    address: 'MMRDA Grounds, G-Block, Bandra Kurla Complex',
    phone: '+91 22 2659 0001'
  },
  {
    id: 'shelter-sion-2',
    name: 'Lokmanya Tilak Municipal General Hospital Relief Wing',
    category: 'TRAUMA CARE & HAVEN',
    distanceKm: 2.1,
    travelTimeMins: 9,
    elevation: '+18.5m MSL',
    status: 'RECOMMENDED HAVEN',
    totalCapacity: 600,
    availableCapacity: 120,
    dryParkingSpots: 40,
    hasMedical: true,
    hasGenerator: true,
    address: 'Sion West, Near Sion Railway Station',
    phone: '+91 22 2407 6381'
  },
  {
    id: 'shelter-kurla-3',
    name: 'Don Bosco High School Elevated Relief Gymnasium',
    category: 'CIVIC SHELTER',
    distanceKm: 2.8,
    travelTimeMins: 12,
    elevation: '+16.0m MSL',
    status: 'OPEN & OPERATIONAL',
    totalCapacity: 500,
    availableCapacity: 280,
    dryParkingSpots: 60,
    hasMedical: false,
    hasGenerator: true,
    address: 'Premier Automobiles Rd, Kurla West',
    phone: '+91 22 2504 0134'
  }
];

export default function HUDShelterRadarModal({
  isOpen = false,
  onClose = () => {},
  onDivertToShelter = () => {}
}) {
  const [selectedShelterId, setSelectedShelterId] = useState('shelter-bkc-1');
  const [divertedSuccess, setDivertedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDivert = (shelter) => {
    hudAudio.playTurnChime();
    setSelectedShelterId(shelter.id);
    setDivertedSuccess(true);

    setTimeout(() => {
      onDivertToShelter(shelter);
      setDivertedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">High-Ground Evacuation Shelter Radar</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Designated municipal havens with flood-immune dry vehicle parking & generators
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {divertedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Route Diverted to Shelter Haven!</h3>
            <p className="text-xs text-muted font-mono max-w-md mx-auto">
              Navigation has updated turn-by-turn guidance to take elevated ramps directly into the shelter perimeter.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-4">
            {NEARBY_SHELTERS.map(shelter => {
              const occupancyPercent = Math.round(((shelter.totalCapacity - shelter.availableCapacity) / shelter.totalCapacity) * 100);

              return (
                <div
                  key={shelter.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {shelter.elevation}
                        </span>
                        <span className="text-[10px] font-mono text-muted uppercase">
                          {shelter.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{shelter.name}</h3>
                      <p className="text-xs text-muted font-mono mt-0.5">{shelter.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-mono font-extrabold text-emerald-400">{shelter.distanceKm} km</span>
                      <span className="text-xs font-mono text-muted block">~{shelter.travelTimeMins} mins drive</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-muted">Occupancy: {occupancyPercent}%</span>
                      <span className="text-emerald-400 font-bold">{shelter.availableCapacity} beds available</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-muted">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-purple-soft" />
                      <span>{shelter.dryParkingSpots} Dry Car Bays</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Diesel Backup Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Medical: {shelter.hasMedical ? '24/7 Doctor' : 'First Aid'}</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleDivert(shelter)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <span>DIVERT NAVIGATION HERE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
          <span>Official MCGM Disaster Preparedness Havens.</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            Return to HUD
          </button>
        </div>

      </div>
    </div>
  );
}

