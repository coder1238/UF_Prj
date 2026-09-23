import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, AlertOctagon, TrendingUp, 
  Compass, Eye, Droplet 
} from 'lucide-react';

export default function HUDWeatherRadarBar({
  rainRate = 42, // mm/hr
  isCloudburstRisk = true
}) {
  const [pressure, setPressure] = useState(994);
  const [windSpeed, setWindSpeed] = useState(38);
  const [radarAngle, setRadarAngle] = useState(0);

  // Animate radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 12) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Left: Doppler Radar Beam & Rain Intensity */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center overflow-hidden shrink-0">
          {/* Radar Sweep Line */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 to-transparent pointer-events-none origin-center"
            style={{ transform: `rotate(${radarAngle}deg)` }}
          />
          <CloudRain className="w-5 h-5 text-cyan-400 relative z-10" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold uppercase tracking-wider text-cyan-300 text-[11px]">
              Doppler Rain Radar
            </span>
            {isCloudburstRisk && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold uppercase animate-pulse flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> Cloudburst Warning
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-mono font-extrabold text-white">{rainRate}</span>
            <span className="text-xs font-mono text-muted">mm/hr (Monsoon Downpour)</span>
          </div>
        </div>
      </div>

      {/* Middle: Short-term Surge Trend */}
      <div className="hidden md:flex items-center gap-4 border-x border-white/10 px-4 font-mono text-[11px]">
        <div>
          <span className="text-muted block text-[10px] uppercase">15-Min Trend</span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +9 mm/hr surge
          </span>
        </div>

        <div>
          <span className="text-muted block text-[10px] uppercase">Barometric Low</span>
          <span className="text-white font-bold">{pressure} hPa</span>
        </div>

        <div>
          <span className="text-muted block text-[10px] uppercase">Gust Wind</span>
          <span className="text-white font-bold">{windSpeed} km/h WNW</span>
        </div>
      </div>

      {/* Right: Visibility & Driving Advisory */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          <Eye className="w-3.5 h-3.5 text-purple-soft" />
          <span>Visibility: <strong className="text-white">350m</strong> (Fog/Mist)</span>
        </div>
        <div className="hidden sm:block text-emerald-400 text-[10px] font-bold">
          WIPERS: MAX RAPID
        </div>
      </div>

    </div>
  );
}

