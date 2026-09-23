import React from 'react';
import { 
  X, Navigation, MapPin, AlertTriangle, CheckCircle2, 
  ShieldCheck, ArrowRight, Car, Compass, Volume2, ExternalLink
} from 'lucide-react';
import { VEHICLE_CLEARANCES } from '../../data/scannerData';

export default function RoutePreviewDrawer({ hub, onClose, onLaunchHud, onOpenFullRoute, onSpeak, vehicleType = 'sedan' }) {
  if (!hub) return null;

  const vehicleProfile = VEHICLE_CLEARANCES[vehicleType] || VEHICLE_CLEARANCES.sedan;
  const isPassable = hub.waterDepth <= vehicleProfile.clearance;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-200">
        <div>
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Navigation className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                  Target Hub Safe Ingress Corridor
                </span>
                <h3 className="font-bold text-base mt-0.5 leading-snug">{hub.name}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Origin to Destination Strip */}
            <div className="bg-canvas border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="text-xs">
                  <span className="text-[10px] font-mono text-muted uppercase block">Departure</span>
                  <span className="font-semibold text-ink">Current User Location (Central Mumbai)</span>
                </div>
              </div>

              <div className="ml-1 pl-4 border-l-2 border-dashed border-slate-300 py-1 text-[11px] font-mono text-purple-primary font-bold">
                Via High-Ground Elevated Carriageways
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-primary shrink-0"></div>
                <div className="text-xs">
                  <span className="text-[10px] font-mono text-muted uppercase block">Destination Hub</span>
                  <span className="font-semibold text-ink">{hub.name} ({hub.ward})</span>
                </div>
              </div>
            </div>

            {/* Vehicle Ground Clearance Verdict */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isPassable 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {isPassable ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                  Clearance Cross-Check: {vehicleProfile.name}
                </span>
                <h4 className="text-sm font-bold mt-0.5">
                  {isPassable ? 'CORRIDOR PASSABLE' : 'HYDRO-LOCK STALL RISK DETECTED'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed">
                  Your vehicle clearance is {vehicleProfile.clearance} cm. Hub ingress water is {hub.waterDepth} cm.
                  {!isPassable && ' Water depth exceeds vehicle threshold; air intake flooding is probable.'}
                </p>
              </div>
            </div>

            {/* Approach Road Navigation Advice */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-ink flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-primary" /> Recommended Approach Vector
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-ink block">Primary Street Status:</span>
                  <p className="text-slate-600 mt-0.5">{hub.approachRoad}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-emerald-700 block">High-Ground Bypass:</span>
                  <p className="text-slate-600 mt-0.5">{hub.highGroundAccess || 'Use elevated connector flyover to avoid street level curb water'}</p>
                </div>
              </div>
            </div>

            {/* Skywalk Pedestrian Egress info */}
            {hub.skywalk?.available && (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                <span className="font-bold text-purple-900 block font-mono uppercase">
                  Connected Pedestrian Skywalk
                </span>
                <p className="text-slate-700 font-semibold">{hub.skywalk.name}</p>
                <p className="text-muted text-[11px]">
                  Clearance: {hub.skywalk.clearanceElevation} • {hub.skywalk.status}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          {onSpeak && (
            <button
              onClick={() => onSpeak(`Navigation guidance to ${hub.name}. Primary road: ${hub.approachRoad}. Clearance status: ${isPassable ? 'Passable' : 'Warning, water depth exceeds clearance.'}`)}
              className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Volume2 className="w-4 h-4 text-purple-primary" />
              <span>Listen to Turn-by-Turn Audio Advisory</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenFullRoute(hub)}
              className="py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-primary font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Route Plan</span>
            </button>

            <button
              onClick={() => onLaunchHud(hub)}
              className="py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Start In-Cab HUD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
