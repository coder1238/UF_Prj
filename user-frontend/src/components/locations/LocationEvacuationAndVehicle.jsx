import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  ArrowRight, 
  Navigation, 
  AlertTriangle, 
  Footprints, 
  Clock, 
  MapPin, 
  ExternalLink,
  CheckCircle2,
  ParkingSquare
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';
import { useNavigation } from '../../context/NavigationContext';

export default function LocationEvacuationAndVehicle({ selectedPlace }) {
  const { navigateTo } = useNavigation();

  // Selected vehicle at this site
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');
  const [showCorridorDetail, setShowCorridorDetail] = useState(false);

  // Vehicle clearance profiles (exhaust & air intake / battery pack heights)
  const vehicleProfiles = {
    'two-wheeler': { name: 'Motorcycle / Scooter', clearanceCm: 12, exhaustHeightCm: 18, label: 'Low Clearance' },
    'hatchback': { name: 'Compact Hatchback', clearanceCm: 15, exhaustHeightCm: 22, label: 'Standard Hatch' },
    'sedan': { name: 'Mid-size Sedan', clearanceCm: 16, exhaustHeightCm: 24, label: 'Standard Sedan' },
    'suv': { name: 'Compact / Full SUV', clearanceCm: 22, exhaustHeightCm: 35, label: 'High Clearance' },
    'ev': { name: 'Electric Vehicle (EV)', clearanceCm: 18, exhaustHeightCm: 28, label: 'IP67 Battery Pack' }
  };

  const activeVehicle = vehicleProfiles[selectedVehicle];
  const peakWater = selectedPlace.peakDepth;
  const currentWater = selectedPlace.currentDepth;

  // Time remaining to move vehicle before water touches exhaust/intake
  const waterMargin = activeVehicle.exhaustHeightCm - currentWater;
  const willSubmergeAtPeak = peakWater >= activeVehicle.exhaustHeightCm;
  const relocationCountdownMin = willSubmergeAtPeak 
    ? Math.max(10, Math.round(selectedPlace.peakArrivalMin * (waterMargin / Math.max(1, peakWater))))
    : null;

  // Compute nearest shelters from SAFE_PLACES_DATA
  const nearestShelters = [
    {
      id: 'sp-1',
      name: 'Don Bosco High School Auditorium & Relief Camp',
      category: 'School / High Ground',
      elevation: '+14.2m MSL',
      elevationGain: '+9.4m higher',
      distanceM: '380m',
      walkingTime: '5 mins walk',
      capacity: '650/1000',
      wheelchairAccessible: true,
      corridorAvoidance: 'Via Kings Circle Flyover Service Walkway (High elevation corridor)'
    },
    {
      id: 'sp-2',
      name: 'Matunga Gymkhana Pavilion Ground',
      category: 'Sports Complex / Open Stilt',
      elevation: '+12.8m MSL',
      elevationGain: '+8.0m higher',
      distanceM: '540m',
      walkingTime: '8 mins walk',
      capacity: '400/800',
      wheelchairAccessible: true,
      corridorAvoidance: 'Avoid Bhaudaji Road culvert; take Telang Cross Road'
    },
    {
      id: 'sp-3',
      name: 'BMC Disaster Relief Transit Centre — Sion',
      category: 'Municipal Shelter',
      elevation: '+16.5m MSL',
      elevationGain: '+11.7m higher',
      distanceM: '890m',
      walkingTime: '13 mins walk',
      capacity: '1200/1500',
      wheelchairAccessible: true,
      corridorAvoidance: 'Elevated railway skywalk pedestrian corridor'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-6">
      {/* Section 1: Nearest Safe Evacuation Corridors & Shelters */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Emergency Evacuation Corridors & High-Ground Shelters</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Topographic high-ground refuges with designated flood-free walking corridors from {selectedPlace.name}
            </p>
          </div>

          <button 
            onClick={() => navigateTo('safe-places')}
            className="text-xs font-semibold text-purple-primary hover:text-purple-deep flex items-center gap-1 transition"
          >
            All City Shelters <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shelters List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {nearestShelters.map((shelter, idx) => (
            <div 
              key={shelter.id}
              className="p-4 rounded-2xl bg-canvas border border-slate-200/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    PRIORITY {idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-primary">{shelter.elevation}</span>
                </div>
                <h4 className="text-xs font-bold text-ink leading-snug">{shelter.name}</h4>
                <span className="text-[11px] text-muted block mt-0.5">{shelter.category}</span>

                <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-muted block uppercase">Distance</span>
                    <span className="font-bold text-ink">{shelter.distanceM}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-muted block uppercase">Walk Time</span>
                    <span className="font-bold text-emerald-800">{shelter.walkingTime}</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200/50">
                  <span className="font-bold text-slate-800 block text-[10px] uppercase font-mono">Safe Corridor:</span>
                  <span className="text-[11px] leading-tight">{shelter.corridorAvoidance}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-500">Cap: {shelter.capacity}</span>
                <button 
                  onClick={() => navigateTo('route')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  <Navigation className="w-3 h-3" /> Safe Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Vehicle Parked Inundation Risk & Relocation Advisor */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
              <Car className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-ink">Vehicle Parked Inundation Risk & Relocation Advisor</h4>
          </div>

          {/* Vehicle Type Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.entries(vehicleProfiles).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedVehicle(key)}
                className={`text-xs px-2.5 py-1 rounded-xl font-medium transition ${
                  selectedVehicle === key 
                    ? 'bg-purple-primary text-white shadow-sm font-semibold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {key === 'two-wheeler' ? '2-Wheeler' : key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Risk Dashboard */}
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center mb-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Vehicle Type</span>
              <span className="text-sm font-bold text-ink mt-0.5 block">{activeVehicle.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">Ground clearance: {activeVehicle.clearanceCm}cm</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Exhaust / Battery Critical Limit</span>
              <span className="text-lg font-mono font-extrabold text-purple-primary mt-0.5 block">
                {activeVehicle.exhaustHeightCm} cm
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Engine hydro-lock threshold</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Predicted Peak Water</span>
              <span className={`text-lg font-mono font-extrabold mt-0.5 block ${
                willSubmergeAtPeak ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {peakWater} cm
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Arrival in +{selectedPlace.peakArrivalMin}m</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              willSubmergeAtPeak ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[10px] font-mono uppercase block font-semibold">Relocation Window</span>
              <span className="text-lg font-mono font-extrabold mt-0.5 block">
                {willSubmergeAtPeak ? `MOVE IN <${relocationCountdownMin} MIN` : 'SAFE IN STILT'}
              </span>
              <span className="text-[10px] font-mono">
                {willSubmergeAtPeak ? 'Submersion expected' : 'Exhaust stays above water'}
              </span>
            </div>
          </div>

          {/* Elevated Parking Recommendation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-purple-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-primary">
                <ParkingSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">
                  Recommended Elevated Safe Deck: BMC Multi-Tier Parking (Hindmata Flyover Stilt)
                </span>
                <span className="text-[11px] text-muted font-mono">
                  320m away • +11.5m MSL Ramp Elevation • 140 dry slots available
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('route')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition"
            >
              Route Vehicle to Deck <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

