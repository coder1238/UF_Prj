import React from 'react';
import { 
  X, Route, ShieldCheck, AlertTriangle, ArrowRight, 
  CheckCircle, Clock, Mountain, Droplets 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export const CORRIDOR_OPTIONS = [
  {
    id: 'corridor_bkc_elevated',
    name: 'BKC Elevated Connector Flyover',
    tagline: 'Recommended Safe High-Ground Bypass',
    isRecommended: true,
    distance: '6.2 km',
    eta: '18 min',
    maxDepth: 2,
    risk: 'SAFE',
    elevationProfile: '+8.5m to +14.8m MSL',
    trafficSpeed: '38 km/h',
    features: [
      'Elevated viaduct remains 100% dry above storm runoff',
      'Direct grade-separated entry to BKC Financial Hub',
      'No underpasses or low-lying stormwater dips'
    ],
    steps: [
      {
        turn: 'straight',
        distance: '400 m',
        instruction: 'Head North on Dr. Ambedkar Road toward Sion Overbridge',
        depth: 4,
        risk: 'low',
        eta: '18 min',
        nextAction: 'In 400m, keep right for BKC Elevated Ramp'
      },
      {
        turn: 'right',
        distance: '1.8 km',
        instruction: 'Ascend Ramp onto BKC Elevated Flyover (Elev: +14.8m MSL)',
        depth: 0,
        risk: 'safe',
        eta: '14 min',
        nextAction: 'Continue on elevated high deck for 1.8km'
      },
      {
        turn: 'straight',
        distance: '2.4 km',
        instruction: 'Cross over flooded Mithi River Channel safely above waters',
        depth: 0,
        risk: 'safe',
        eta: '10 min',
        nextAction: 'Prepare for gentle descent into G-Block'
      },
      {
        turn: 'left',
        distance: '1.2 km',
        instruction: 'Descend into BKC Avenue 3 (Flood Barrier Active)',
        depth: 2,
        risk: 'safe',
        eta: '4 min',
        nextAction: 'Park in designated Elevated Multi-Tier P2'
      },
      {
        turn: 'destination',
        distance: '400 m',
        instruction: 'Arrive at Bandra Kurla Complex G-Block Hub',
        depth: 1,
        risk: 'safe',
        eta: 'Arrived',
        nextAction: 'Dry haven verified by Municipal command'
      }
    ]
  },
  {
    id: 'corridor_lbs_underpass',
    name: 'LBS Marg & Kurla Underpass',
    tagline: 'Direct Low-Level Route (Hazardous Sag Point)',
    isRecommended: false,
    distance: '4.8 km',
    eta: '14 min (Stalled)',
    maxDepth: 46,
    risk: 'CRITICAL',
    elevationProfile: '+2.1m to +8.5m MSL (Low Sag)',
    trafficSpeed: '8 km/h',
    features: [
      'Kurla Underpass submerged under 46cm standing water',
      'High risk of engine hydrostatic water ingestion',
      'Severe traffic congestion due to stalled vehicles'
    ],
    steps: [
      {
        turn: 'straight',
        distance: '350 m',
        instruction: 'Head North on Dr. Ambedkar Road toward Sion Flyover',
        depth: 6,
        risk: 'low',
        eta: '18 min',
        nextAction: 'In 350m, prepare to turn left on LBS Marg'
      },
      {
        turn: 'left',
        distance: '1.2 km',
        instruction: 'Turn Left onto Lal Bahadur Shastri (LBS) Marg',
        depth: 18,
        risk: 'caution',
        eta: '14 min',
        nextAction: 'Kurla Underpass approaching in 900m'
      },
      {
        turn: 'warning',
        distance: '450 m',
        instruction: 'CRITICAL ALERT: Kurla Underpass depth surge (+46 cm flood)',
        depth: 46,
        risk: 'danger',
        eta: '11 min',
        nextAction: 'DO NOT PROCEED: Extreme stall hazard'
      },
      {
        turn: 'right',
        distance: '2.8 km',
        instruction: 'Crawl through deep backwater toward BKC East perimeter',
        depth: 32,
        risk: 'danger',
        eta: '8 min',
        nextAction: 'Vehicle damage probable'
      },
      {
        turn: 'destination',
        distance: '150 m',
        instruction: 'Arrive at Bandra Kurla Complex G-Block Hub',
        depth: 3,
        risk: 'safe',
        eta: 'Arriving',
        nextAction: 'Underground flood barriers deployed'
      }
    ]
  },
  {
    id: 'corridor_sion_ridge',
    name: 'Sion Hill Ridge & Chunabhatti Detour',
    tagline: 'High MSL Natural Ridge Arterial (100% Dry)',
    isRecommended: false,
    distance: '7.5 km',
    eta: '22 min',
    maxDepth: 0,
    risk: 'SAFE',
    elevationProfile: '+12.0m to +24.0m MSL',
    trafficSpeed: '42 km/h',
    features: [
      'Natural basalt ridge topography completely immune to water accumulation',
      'Ideal for two-wheelers and ultra-low clearance vehicles',
      '+4 minutes additional travel time for guaranteed dry transit'
    ],
    steps: [
      {
        turn: 'right',
        distance: '600 m',
        instruction: 'Follow Sion East Hill Contour Road toward Fort Ridge',
        depth: 0,
        risk: 'safe',
        eta: '22 min',
        nextAction: 'Proceed along dry basalt ridge line'
      },
      {
        turn: 'straight',
        distance: '3.2 km',
        instruction: 'Maintain course on Chunabhatti-BKC Ridge Highway',
        depth: 0,
        risk: 'safe',
        eta: '15 min',
        nextAction: 'High elevation +21m MSL bypass'
      },
      {
        turn: 'left',
        distance: '2.5 km',
        instruction: 'Cross Santacruz Chembur Link Road Flyover',
        depth: 0,
        risk: 'safe',
        eta: '8 min',
        nextAction: 'Turn into BKC North Entrance'
      },
      {
        turn: 'destination',
        distance: '1.2 km',
        instruction: 'Arrive at BKC G-Block Hub (Dry Approach)',
        depth: 0,
        risk: 'safe',
        eta: 'Arrived',
        nextAction: 'Safe parking ready'
      }
    ]
  }
];

export default function HUDRouteSelectorModal({
  isOpen = false,
  onClose = () => {},
  selectedCorridorId = 'corridor_bkc_elevated',
  onSelectCorridor = () => {}
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <Route className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Dynamic Multi-Corridor Reroute Engine</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Real-time topological recalculation based on road elevation & hydraulic models
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

        {/* Corridor Options Cards */}
        <div className="space-y-4 my-5">
          {CORRIDOR_OPTIONS.map(corridor => {
            const isSelected = selectedCorridorId === corridor.id;
            const isSafe = corridor.risk === 'SAFE';

            return (
              <div 
                key={corridor.id}
                onClick={() => {
                  hudAudio.playTurnChime();
                  onSelectCorridor(corridor);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-purple-primary/20 border-purple-primary shadow-xl shadow-purple-primary/10 ring-1 ring-purple-primary' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{corridor.name}</h3>
                      {corridor.isRecommended && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Recommended Bypass
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted font-mono mt-0.5">{corridor.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 animate-pulse'
                    }`}>
                      {corridor.risk === 'SAFE' ? 'PASSABLE' : 'CRITICAL FLOOD'}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-xl bg-black/40 border border-white/5 text-center text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-muted block">DISTANCE</span>
                    <span className="font-bold text-white">{corridor.distance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">EST. TIME</span>
                    <span className="font-bold text-white">{corridor.eta}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">MAX DEPTH</span>
                    <span className={`font-bold ${corridor.maxDepth > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {corridor.maxDepth} cm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">ELEVATION</span>
                    <span className="font-bold text-purple-soft">{corridor.elevationProfile.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <ul className="text-xs text-muted space-y-1 mb-3">
                  {corridor.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-soft mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Select button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      hudAudio.playTurnChime();
                      onSelectCorridor(corridor);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      isSelected 
                        ? 'bg-purple-primary text-white shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 text-muted hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Active Corridor</span>
                      </>
                    ) : (
                      <>
                        <span>Switch to This Corridor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
          <span>Navigation automatically updates turn instructions & voice guidance.</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            Apply & Return to HUD
          </button>
        </div>

      </div>
    </div>
  );
}

