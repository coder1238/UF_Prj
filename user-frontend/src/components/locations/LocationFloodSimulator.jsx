import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  CloudRain, 
  Waves, 
  Cpu, 
  RotateCcw, 
  TrendingUp, 
  AlertOctagon, 
  ShieldCheck, 
  Gauge,
  Info,
  Timer
} from 'lucide-react';

export default function LocationFloodSimulator({ selectedPlace }) {
  // Scenario simulation parameters
  const [rainRate, setRainRate] = useState(45); // mm/h
  const [tideLevel, setTideLevel] = useState(3.6); // meters MSL (High Tide)
  const [pumpCapacity, setPumpCapacity] = useState(100); // 100% capacity, 50%, or 0%
  const [soilSaturation, setSoilSaturation] = useState('saturated'); // 'dry', 'moderate', 'saturated'

  // Presets
  const applyPreset = (preset) => {
    if (preset === 'monsoon-normal') {
      setRainRate(25);
      setTideLevel(3.2);
      setPumpCapacity(100);
      setSoilSaturation('moderate');
    } else if (preset === 'heavy-downpour') {
      setRainRate(65);
      setTideLevel(4.1);
      setPumpCapacity(75);
      setSoilSaturation('saturated');
    } else if (preset === 'cloudburst-kingtide') {
      setRainRate(110);
      setTideLevel(4.87);
      setPumpCapacity(50);
      setSoilSaturation('saturated');
    }
  };

  // Dynamic simulation computations
  const simulationResults = useMemo(() => {
    // Base surface elevation in meters
    const rawElevation = parseFloat(selectedPlace.elevation) || 5.0;
    
    // Inundation model calculation:
    // Rain runoff load
    const runoffMultiplier = soilSaturation === 'saturated' ? 1.0 : soilSaturation === 'moderate' ? 0.75 : 0.45;
    const rainLoad = (rainRate / 50) * 18 * runoffMultiplier;

    // Tide backpressure factor (if elevation is below tide level + 2m, drainage gravity fails)
    const tideBackpressure = Math.max(0, (tideLevel - (rawElevation - 1.5)) * 8);

    // Pump alleviation
    const pumpAlleviation = (pumpCapacity / 100) * 12;

    // Simulated depths
    const calculatedDepth = Math.max(0, Math.round(rainLoad + tideBackpressure - pumpAlleviation));
    const simulatedPeak = Math.max(calculatedDepth, Math.round(calculatedDepth * 1.45 + (rainRate > 60 ? 10 : 2)));
    
    // Time to peak
    const peakMinutes = Math.max(20, Math.round(110 - (rainRate * 0.5) - (tideLevel > 4.0 ? 25 : 0)));

    // Runoff velocity (m/s)
    const velocity = (0.2 + (simulatedPeak / 100) * 0.9).toFixed(2);

    // Severity
    let risk = 'SAFE';
    if (simulatedPeak > 35) risk = 'CRITICAL';
    else if (simulatedPeak > 20) risk = 'DANGER';
    else if (simulatedPeak > 8) risk = 'MODERATE';
    else if (simulatedPeak > 0) risk = 'LOW';

    return {
      simulatedCurrent: calculatedDepth,
      simulatedPeak,
      peakMinutes,
      velocity,
      risk,
      drainCapacityUtilized: Math.min(180, Math.round((rainRate / 50) * 80 + (tideLevel > 3.8 ? 40 : 10) * (150 - pumpCapacity) / 100))
    };
  }, [selectedPlace, rainRate, tideLevel, pumpCapacity, soilSaturation]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-ink">Multi-Scenario Micro-Basin Simulator</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Test rainfall stress, coastal spring tides, and pump outage coincidence for {selectedPlace.name}
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-muted mr-1">Presets:</span>
          <button 
            onClick={() => applyPreset('monsoon-normal')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Normal Monsoon
          </button>
          <button 
            onClick={() => applyPreset('heavy-downpour')}
            className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium border border-amber-200 transition"
          >
            Heavy Downpour
          </button>
          <button 
            onClick={() => applyPreset('cloudburst-kingtide')}
            className="text-xs px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 font-medium border border-red-200 transition"
          >
            Cloudburst + King Tide
          </button>
        </div>
      </div>

      {/* Simulator Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Rainfall Intensity Slider */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" /> Rain Intensity
            </span>
            <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              {rainRate} mm/h
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="120" 
            step="5"
            value={rainRate}
            onChange={(e) => setRainRate(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
            <span>Drizzle (5)</span>
            <span>Heavy (50)</span>
            <span>Cloudburst (120)</span>
          </div>
        </div>

        {/* Coastal Tide Level */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-cyan-600" /> Marine Tide Level
            </span>
            <span className="text-xs font-mono font-extrabold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-md">
              {tideLevel.toFixed(2)}m MSL
            </span>
          </div>
          <input 
            type="range" 
            min="1.8" 
            max="5.0" 
            step="0.1"
            value={tideLevel}
            onChange={(e) => setTideLevel(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
            <span>Neap (2.0m)</span>
            <span>Mean (3.5m)</span>
            <span>King Spring (4.9m)</span>
          </div>
        </div>

        {/* Dewatering Pump Capacity */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-primary" /> Storm Pump Power
            </span>
            <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-md ${
              pumpCapacity === 100 ? 'bg-emerald-100 text-emerald-800' : pumpCapacity === 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {pumpCapacity}% Operational
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {[100, 50, 0].map(pct => (
              <button
                key={pct}
                onClick={() => setPumpCapacity(pct)}
                className={`text-xs py-1.5 rounded-lg font-mono font-semibold transition ${
                  pumpCapacity === pct 
                    ? 'bg-purple-primary text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pct === 100 ? '100% Full' : pct === 50 ? '50% Half' : '0% Tripped'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Output Dashboard */}
      <div className="p-5 rounded-2xl bg-canvas border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-purple-primary" /> Simulated Hydrodynamic Output
          </span>
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
            simulationResults.risk === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' :
            simulationResults.risk === 'DANGER' ? 'bg-orange-100 text-orange-800 border-orange-300' :
            simulationResults.risk === 'MODERATE' ? 'bg-amber-100 text-amber-800 border-amber-300' :
            'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}>
            Simulated Risk: {simulationResults.risk}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
            <span className="text-[10px] font-mono text-muted uppercase block">Instant Water Depth</span>
            <span className="text-2xl font-mono font-extrabold text-ink mt-0.5 block">
              {simulationResults.simulatedCurrent} <span className="text-xs font-normal">cm</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              vs {selectedPlace.currentDepth}cm actual
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
            <span className="text-[10px] font-mono text-muted uppercase block">Simulated Peak Depth</span>
            <span className="text-2xl font-mono font-extrabold text-purple-primary mt-0.5 block">
              {simulationResults.simulatedPeak} <span className="text-xs font-normal">cm</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              Inundation crest
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
            <span className="text-[10px] font-mono text-muted uppercase block">Peak Arrival Time</span>
            <span className="text-2xl font-mono font-extrabold text-slate-700 mt-0.5 block">
              +{simulationResults.peakMinutes} <span className="text-xs font-normal">min</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              Evacuation lead window
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
            <span className="text-[10px] font-mono text-muted uppercase block">Surface Runoff Velocity</span>
            <span className="text-2xl font-mono font-extrabold text-amber-700 mt-0.5 block">
              {simulationResults.velocity} <span className="text-xs font-normal">m/s</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              {Number(simulationResults.velocity) > 0.8 ? 'Dangerous drag!' : 'Moderate flow'}
            </span>
          </div>
        </div>

        {/* Culvert Surcharge Warning */}
        {simulationResults.drainCapacityUtilized > 100 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Drainage Surcharge Warning ({simulationResults.drainCapacityUtilized}% network load):</span>
              <p className="mt-0.5 text-red-700">
                Culverts around {selectedPlace.name} cannot discharge due to combination of rain load and high tide outfall backpressure. Ground backflow through manhole gratings anticipated within 20 mins.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

