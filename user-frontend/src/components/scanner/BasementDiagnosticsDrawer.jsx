import React, { useState } from 'react';
import { 
  X, Car, Droplets, Gauge, AlertTriangle, ShieldCheck, 
  ArrowDown, CheckCircle2, RotateCw, Power, Zap, AlertCircle, Volume2
} from 'lucide-react';

export default function BasementDiagnosticsDrawer({ hub, onClose, onSpeak }) {
  if (!hub) return null;

  const [pumpsBoosted, setPumpsBoosted] = useState(false);
  const [boostTimer, setBoostTimer] = useState(null);

  const parking = hub.basementParking || {
    status: 'No subterranean parking facility',
    floors: [],
    sumpPumps: { total: 0, active: 0, flowRateM3Hr: 0, rpm: 0, powerSource: 'N/A' },
    floodGatePressureBar: 0
  };

  const floors = parking.floors || [];
  const pumps = parking.sumpPumps;

  const handleTogglePumpBoost = () => {
    if (pumpsBoosted) {
      setPumpsBoosted(false);
    } else {
      setPumpsBoosted(true);
      if (onSpeak) {
        onSpeak(`Emergency auxiliary storm sump engaged for ${hub.name}. Pumping rate boosted to 850 cubic meters per hour.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-200">
        <div>
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
                <Car className="w-4 h-4" /> Subterranean Flood Gate & Sump Monitor
              </div>
              <h2 className="text-xl font-bold">{hub.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Ward: {hub.ward} • MSL: {hub.elevationMSL}m • {parking.status}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onSpeak && (
                <button
                  onClick={() => onSpeak(`Basement diagnostics for ${hub.name}. Flood barrier pressure is ${parking.floodGatePressureBar} bars. ${pumps.active} of ${pumps.total} sump pumps are running.`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Voice Readout"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Hydrostatic Seal Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              parking.floodGatePressureBar > 2.0 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : parking.floodGatePressureBar > 0.5 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-3">
                <Gauge className="w-6 h-6 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase font-bold">Hydrostatic Flood Gate Seal</div>
                  <div className="text-sm font-semibold mt-0.5">
                    Pressure: {parking.floodGatePressureBar} bar • {parking.floodGatePressureBar > 2.0 ? 'High Hydrostatic Strain' : 'Nominal Barrier Resistance'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full font-bold uppercase bg-white/80 border">
                {parking.floodGatePressureBar > 2.0 ? 'CRITICAL SEAL' : 'INTACT'}
              </span>
            </div>

            {/* Sump Pump Telemetry Matrix */}
            <div className="bg-canvas border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-purple-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-ink">Active Sump Dewatering Matrix</h3>
                </div>
                <button
                  onClick={handleTogglePumpBoost}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm ${
                    pumpsBoosted
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{pumpsBoosted ? 'Aux Pumps Engaged (Max)' : 'Engage Emergency Boost'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-muted uppercase block">Pumps Active</span>
                  <span className="text-lg font-bold text-ink font-mono">
                    {pumpsBoosted ? pumps.total : pumps.active} / {pumps.total}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-muted uppercase block">Discharge Flow</span>
                  <span className="text-lg font-bold text-purple-primary font-mono">
                    {pumpsBoosted ? (pumps.flowRateM3Hr * 1.5).toFixed(0) : pumps.flowRateM3Hr} m³/h
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-muted uppercase block">Impeller Speed</span>
                  <span className="text-lg font-bold text-ink font-mono">
                    {pumpsBoosted ? 3400 : pumps.rpm} RPM
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-muted uppercase block">Power Bus</span>
                  <span className="text-[11px] font-bold text-emerald-700 font-mono block mt-1">
                    {pumps.powerSource}
                  </span>
                </div>
              </div>
            </div>

            {/* Basement Cross-Section Floor Elevation */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-ink mb-3 flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-purple-primary" /> Subterranean Floor Ingress & Slots
              </h3>

              {floors.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-muted text-center">
                  This facility has no underground vehicle parking decks (grade/podium level only).
                </div>
              ) : (
                <div className="space-y-3">
                  {floors.map((floor) => (
                    <div 
                      key={floor.level}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs">
                            {floor.level}
                          </span>
                          <span className="text-xs font-bold text-ink">{floor.status}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                          floor.depth > 20 
                            ? 'bg-red-100 text-red-700' 
                            : floor.depth > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {floor.depth} cm water
                        </span>
                      </div>

                      {/* Water Level Bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full transition-all ${
                            floor.depth > 20 ? 'bg-red-500' : floor.depth > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (floor.depth / 50) * 100)}%` }}
                        />
                      </div>

                      {/* Slots availability */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                        <span>Vehicle Slots: {floor.vehicleSlotsAvailable} / {floor.vehicleSlotsTotal} Open</span>
                        <span className={floor.vehicleSlotsAvailable > 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                          {floor.vehicleSlotsAvailable > 0 ? 'Safe for Parking' : 'EVACUATED / CLOSED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ingress Advisory Checklist */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold font-mono text-purple-900 block uppercase">
                Basement Vehicle Safety Protocol
              </span>
              <p className="text-slate-700">
                1. If basement flood gates are activated, do not enter ramps. Water pressure behind barriers can breach upon unsealing.
              </p>
              <p className="text-slate-700">
                2. EV charging sockets in sub-levels B1 & B2 are automatically de-energized by ground-fault circuit interrupters when sump water exceeds 5 cm.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
