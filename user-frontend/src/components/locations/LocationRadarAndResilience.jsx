import React, { useState, useMemo } from 'react';
import { 
  Radar, 
  Award, 
  TrendingUp, 
  Sliders, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Wind, 
  CheckCircle2, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LocationRadarAndResilience({ selectedPlace }) {
  // Feature 24: Doppler Radar State
  const [radarLayer, setRadarLayer] = useState('reflectivity'); // 'reflectivity' | 'velocity' | 'echoTops'
  const [radarRangeKm, setRadarRangeKm] = useState(25);

  const dopplerData = {
    station: 'IMD Mumbai Doppler Weather Radar (Veravali / Colaba S-Band)',
    cloudReflectivityDbz: 52, // 52 dBZ is extreme heavy tropical rainfall
    rainRateEquivalent: '68 mm/hr',
    stormCellVelocity: '22 km/h North-East (Heading towards Thane Creek)',
    convectiveCloudTopKm: '14.2 km',
    incomingRainBandMin: 22,
    lightningDischargeCount: '14 strikes / min'
  };

  // Feature 25: Resilience Scorecard & "What-If" Optimizer
  const [hasFloodBarrier, setHasFloodBarrier] = useState(true);
  const [hasElevatedTransformer, setHasElevatedTransformer] = useState(true);
  const [hasStiltRampParking, setHasStiltRampParking] = useState(false);
  const [hasAutomaticSumpValve, setHasAutomaticSumpValve] = useState(false);
  const [hasCommunityGenerator, setHasCommunityGenerator] = useState(true);

  // Dynamic resilience score computation
  const resilienceResults = useMemo(() => {
    let score = 30; // base score

    // Elevation bonus (up to 25 pts)
    const rawElev = parseFloat(selectedPlace.elevation) || 5.0;
    if (rawElev >= 12.0) score += 25;
    else if (rawElev >= 8.0) score += 18;
    else if (rawElev >= 5.0) score += 10;
    else score += 4;

    // Drainage distance factor (up to 15 pts)
    const drainDist = parseInt(selectedPlace.drainageDistance) || 60;
    if (drainDist <= 50) score += 15;
    else if (drainDist <= 120) score += 10;
    else score += 5;

    // What-if booster options
    if (hasFloodBarrier) score += 12;
    if (hasElevatedTransformer) score += 8;
    if (hasStiltRampParking) score += 8;
    if (hasAutomaticSumpValve) score += 6;
    if (hasCommunityGenerator) score += 6;

    score = Math.min(100, score);

    let grade = 'C';
    let label = 'Vulnerable Plinth';
    let colorClass = 'text-amber-800 bg-amber-50 border-amber-200';

    if (score >= 85) {
      grade = 'A+';
      label = 'Superior Flood Resilience';
      colorClass = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    } else if (score >= 70) {
      grade = 'A';
      label = 'High Resilience Protection';
      colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (score >= 55) {
      grade = 'B+';
      label = 'Moderate Multi-Layer Defense';
      colorClass = 'text-purple-primary bg-purple-50 border-purple-200';
    }

    return { score, grade, label, colorClass };
  }, [selectedPlace, hasFloodBarrier, hasElevatedTransformer, hasStiltRampParking, hasAutomaticSumpValve, hasCommunityGenerator]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-8">
      {/* SECTION 1: CATCHMENT DOPPLER RADAR & CLOUDBURST VECTOR TRACKER */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
                <Radar className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Catchment Doppler Radar & Cloudburst Vector Tracker</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Live radar reflectivity (dBZ) and convective cloudburst cell motion vector over {selectedPlace.name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['reflectivity', 'velocity', 'echoTops'].map(lyr => (
              <button
                key={lyr}
                onClick={() => setRadarLayer(lyr)}
                className={`text-xs px-3 py-1.5 rounded-lg font-mono capitalize transition ${
                  radarLayer === lyr ? 'bg-purple-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:text-ink'
                }`}
              >
                {lyr}
              </button>
            ))}
          </div>
        </div>

        {/* Doppler Telemetry Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200">
            <span className="text-[10px] font-mono text-red-700 uppercase block font-semibold">Radar Reflectivity</span>
            <span className="text-2xl font-mono font-extrabold text-red-900 mt-0.5 block">{dopplerData.cloudReflectivityDbz} dBZ</span>
            <span className="text-[10px] text-red-700 font-mono">Equivalent: {dopplerData.rainRateEquivalent}</span>
          </div>

          <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Cloudburst Lead Time</span>
            <span className="text-2xl font-mono font-extrabold text-purple-primary mt-0.5 block">+{dopplerData.incomingRainBandMin} min</span>
            <span className="text-[10px] text-slate-500 font-mono">Convective band arrival</span>
          </div>

          <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Cell Motion Vector</span>
            <span className="text-sm font-mono font-bold text-ink mt-1 block leading-tight">22 km/h North-East</span>
            <span className="text-[10px] text-slate-500 font-mono">Towards Thane Basin</span>
          </div>

          <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Cloud Top Altitude</span>
            <span className="text-2xl font-mono font-extrabold text-slate-700 mt-0.5 block">{dopplerData.convectiveCloudTopKm}</span>
            <span className="text-[10px] text-slate-500 font-mono">Deep Tropical Cumulonimbus</span>
          </div>
        </div>

        {/* Simulated Doppler Radar Visual Scope */}
        <div className="relative w-full h-56 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Radar Sweep Animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full border border-purple-500/20" />
            <div className="w-56 h-56 rounded-full border border-purple-500/30" />
            <div className="w-32 h-32 rounded-full border border-purple-500/40" />
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" />
          </div>

          {/* Sweeping Beam */}
          <div 
            className="absolute inset-0 pointer-events-none animate-spin"
            style={{ 
              animationDuration: '6s',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 315deg, rgba(109, 74, 255, 0.3) 360deg)'
            }}
          />

          {/* Simulated Rain Cloud Echo Blob */}
          <div className="relative z-10 text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30">
              IMD VERAVALI S-BAND DOPPLER • SWEEP RADIUS: {radarRangeKm}km
            </span>
            <div className="text-xs text-slate-300 font-mono pt-1">
              Active precipitation core detected 3.8km South-West of {selectedPlace.name}
            </div>
            <div className="text-[11px] text-red-400 font-mono font-bold animate-pulse">
              Heavy convective downdraft imminent in +{dopplerData.incomingRainBandMin} mins
            </div>
          </div>

          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">
            Resolution: 250m Gate Length
          </div>
        </div>
      </div>

      {/* SECTION 2: PROPERTY FLOOD RESILIENCE SCORECARD (0-100) & WHAT-IF OPTIMIZER */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <Award className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Property Flood Resilience Scorecard & "What-If" Optimizer</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Hydraulic rating out of 100 with interactive structural defense upgrades
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-xl uppercase border ${resilienceResults.colorClass}`}>
              Grade: {resilienceResults.grade} ({resilienceResults.label})
            </span>
          </div>
        </div>

        {/* Big Scorecard Banner */}
        <div className="p-5 rounded-2xl bg-canvas border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 mb-5">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-white border-4 border-purple-primary flex items-center justify-center shadow-md shrink-0">
              <span className="text-2xl font-mono font-extrabold text-ink">{resilienceResults.score}</span>
              <span className="absolute bottom-1 text-[9px] font-mono text-muted">/100</span>
            </div>
            <div>
              <h5 className="font-bold text-sm text-ink">{selectedPlace.name} Flood Rating</h5>
              <p className="text-xs text-muted mt-0.5">
                Composite index derived from CartoDEM surface elevation, box drain hydraulics, and barrier deployment.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-muted block uppercase">Structural Mitigation Status</span>
            <span className="text-xs font-bold text-purple-primary block mt-0.5">
              {resilienceResults.score >= 80 ? 'Certified Storm-Resilient' : 'Actionable Upgrades Available'}
            </span>
          </div>
        </div>

        {/* Interactive "What-If" Defense Toggles */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono text-muted uppercase block font-bold">
            Interactive "What-If" Structural Upgrades (Toggle to see score impact):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
              <div>
                <span className="font-semibold text-ink block">Deploy Aluminium Flood Barriers (+25cm)</span>
                <span className="text-[10px] text-muted font-mono">+12 Resilience Points</span>
              </div>
              <input 
                type="checkbox" 
                checked={hasFloodBarrier} 
                onChange={(e) => setHasFloodBarrier(e.target.checked)} 
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>

            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
              <div>
                <span className="font-semibold text-ink block">Elevated Transformer / Inverter (+45cm)</span>
                <span className="text-[10px] text-muted font-mono">+8 Resilience Points</span>
              </div>
              <input 
                type="checkbox" 
                checked={hasElevatedTransformer} 
                onChange={(e) => setHasElevatedTransformer(e.target.checked)} 
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>

            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
              <div>
                <span className="font-semibold text-ink block">Stilt Ramp Elevated Vehicle Parking</span>
                <span className="text-[10px] text-muted font-mono">+8 Resilience Points</span>
              </div>
              <input 
                type="checkbox" 
                checked={hasStiltRampParking} 
                onChange={(e) => setHasStiltRampParking(e.target.checked)} 
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>

            <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
              <div>
                <span className="font-semibold text-ink block">Automatic Sump Backflow Non-Return Valve</span>
                <span className="text-[10px] text-muted font-mono">+6 Resilience Points</span>
              </div>
              <input 
                type="checkbox" 
                checked={hasAutomaticSumpValve} 
                onChange={(e) => setHasAutomaticSumpValve(e.target.checked)} 
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

