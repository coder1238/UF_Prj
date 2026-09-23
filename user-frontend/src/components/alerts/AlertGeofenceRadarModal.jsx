import React, { useState, useEffect } from 'react';
import { X, Radar, Compass, MapPin, ShieldAlert, ShieldCheck, Navigation, Sliders, ArrowRight } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function AlertGeofenceRadarModal({ alert, onClose }) {
  const { navigateTo } = useNavigation();
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(1200);
  const [userDistanceMeters, setUserDistanceMeters] = useState(650);
  const [radarDegree, setRadarDegree] = useState(0);

  // Animate radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarDegree(d => (d + 4) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  if (!alert) return null;

  const isInsideDangerZone = userDistanceMeters <= geofenceRadiusMeters * 0.6;
  const isNearPerimeter = !isInsideDangerZone && userDistanceMeters <= geofenceRadiusMeters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} /> Geofenced Hazard Radar
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proximity Status Card */}
        <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isInsideDangerZone
            ? 'bg-red-50 border-red-200 text-red-900'
            : isNearPerimeter
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isInsideDangerZone ? 'bg-red-500 text-white' : isNearPerimeter ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {isInsideDangerZone ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold block">
                {isInsideDangerZone ? 'CRITICAL PROXIMITY ALERT' : isNearPerimeter ? 'PERIMETER WARNING' : 'OUTSIDE DANGER PERIMETER'}
              </span>
              <p className="text-xs font-bold leading-tight mt-0.5">
                {isInsideDangerZone
                  ? `You are ${userDistanceMeters}m inside the flooded catchment zone!`
                  : isNearPerimeter
                  ? `You are ${userDistanceMeters}m from the epicenter. Water rising towards you.`
                  : `You are safe at ${userDistanceMeters}m outside the cordon.`}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-muted uppercase block">Estimated Distance</span>
            <span className="text-lg font-mono font-black">{userDistanceMeters} m</span>
          </div>
        </div>

        {/* Visual Radar Scope Screen */}
        <div className="my-5 relative w-full aspect-square max-h-64 mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Concentric distance rings */}
          <div className="absolute w-[80%] h-[80%] rounded-full border border-purple-500/20 pointer-events-none" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-purple-500/30 pointer-events-none" />
          <div className="absolute w-[40%] h-[40%] rounded-full border border-purple-500/40 pointer-events-none" />
          <div className="absolute w-[20%] h-[20%] rounded-full border border-red-500/50 pointer-events-none bg-red-500/10" />

          {/* Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-purple-500/20" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-purple-500/20" />

          {/* Radar Sweep Line */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left pointer-events-none"
            style={{
              transform: `rotate(${radarDegree}deg)`,
              background: 'linear-gradient(to right, rgba(168, 85, 247, 0.9), transparent)',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
            }}
          />

          {/* Epicenter Hazard Blip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
            <div className="w-5 h-5 rounded-full bg-red-600 animate-ping absolute -inset-0.5 opacity-75" />
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg mx-auto" />
            <span className="text-[9px] font-mono font-extrabold text-red-400 bg-slate-900/90 px-1.5 py-0.5 rounded mt-1 inline-block">
              {alert.waterDepth}cm EPICENTER
            </span>
          </div>

          {/* Citizen GPS Location Blip */}
          <div 
            className="absolute z-20 transition-all duration-500 text-center"
            style={{
              top: '32%',
              left: '68%'
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded mt-1 inline-block">
              YOU ({userDistanceMeters}m)
            </span>
          </div>

          {/* Drainage Outfall / Pump Blip */}
          <div className="absolute top-[75%] left-[25%] z-10 text-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
            <span className="text-[8px] font-mono text-emerald-300 block">Outfall Sump</span>
          </div>

          {/* Compass & Lat/Lng Watermark */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-purple-400" /> N 19°01'30" E 72°51'07"
          </div>
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
            Scale: 100m / ring
          </div>
        </div>

        {/* Distance simulation slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-1.5">
            <span className="flex items-center gap-1 font-bold">
              <Sliders className="w-3.5 h-3.5" /> Simulate Citizen GPS Proximity
            </span>
            <span className="font-bold text-purple-primary">{userDistanceMeters} meters away</span>
          </div>
          <input
            type="range"
            min="100"
            max="2500"
            step="50"
            value={userDistanceMeters}
            onChange={(e) => setUserDistanceMeters(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
            <span>100m (Immediate Basin)</span>
            <span>1200m (Buffer Limit)</span>
            <span>2500m (Out of Range)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              navigateTo('route');
            }}
            className="flex-1 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" /> Route Away from Geofence <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}

