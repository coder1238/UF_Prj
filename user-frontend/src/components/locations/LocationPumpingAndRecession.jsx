import React, { useState } from 'react';
import { 
  Waves, 
  Clock, 
  Activity, 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  Gauge, 
  ShieldCheck, 
  AlertTriangle,
  Timer,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function LocationPumpingAndRecession({ selectedPlace }) {
  // Pumping Station State
  const [selectedStation, setSelectedStation] = useState('britannia');

  const pumpingStations = {
    britannia: {
      name: 'Britannia Stormwater Pumping Station',
      catchment: 'Hindmata & Dadar TT Basin',
      capacityM3hr: 216000,
      pumpsOnline: 5,
      pumpsTotal: 6,
      sumpLevelM: 2.8,
      outfallGate: 'TIDAL FLAP DISCHARGING',
      powerSource: 'Dual Grid 22kV + 4x DG Sets Standby',
      dischargeDest: 'Mahatsa Bay / Arabian Sea'
    },
    lovegrove: {
      name: 'Lovegrove Pumping Station (Worli)',
      catchment: 'Worli & Lower Parel Basin',
      capacityM3hr: 180000,
      pumpsOnline: 4,
      pumpsTotal: 5,
      sumpLevelM: 3.1,
      outfallGate: 'GRAVITATIONAL SLUICE OPEN',
      powerSource: 'Tata Power 33kV dedicated line',
      dischargeDest: 'Worli Outfall / Arabian Sea'
    },
    irla: {
      name: 'Irla Nullah Stormwater Pumping Station',
      catchment: 'Juhu & Vile Parle Basin',
      capacityM3hr: 162000,
      pumpsOnline: 4,
      pumpsTotal: 4,
      sumpLevelM: 2.4,
      outfallGate: 'PUMP DISCHARGE ACTIVE',
      powerSource: 'Adani Electricity Grid',
      dischargeDest: 'Juhu Beach Outfall'
    }
  };

  const activeStation = pumpingStations[selectedStation] || pumpingStations.britannia;

  // Feature 20: Recession Countdown Clock calculation
  // Base recession rate: 6 to 9 cm/hr depending on station pump status
  const recessionRateCmHr = 7.5;
  const currentDepth = selectedPlace.currentDepth;
  const peakDepth = selectedPlace.peakDepth;
  const peakArrivalMin = selectedPlace.peakArrivalMin;

  // Minutes from now to drop below 15cm (safe for sedans)
  const depthAbove15 = Math.max(0, peakDepth - 15);
  const timeToPeakHours = peakArrivalMin / 60;
  const drainTo15Hours = depthAbove15 / recessionRateCmHr;
  const totalMinTo15 = Math.round((timeToPeakHours + drainTo15Hours) * 60);

  // Minutes from now to drop below 5cm (dry road/pedestrians)
  const depthAbove5 = Math.max(0, peakDepth - 5);
  const drainTo5Hours = depthAbove5 / recessionRateCmHr;
  const totalMinTo5 = Math.round((timeToPeakHours + drainTo5Hours) * 60);

  const formatHoursMins = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-8">
      {/* SECTION 1: INUNDATION RECESSION & ROAD CLEARANCE COUNTDOWN CLOCK */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
                <Timer className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Inundation Recession & Road Clearance Countdown Clock</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Hydraulic dewatering forecast answering: When will the road outside {selectedPlace.name} be passable again?
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
            Drainage Velocity: ~{recessionRateCmHr} cm/hr
          </span>
        </div>

        {/* Big Countdown Displays */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* Milestone 1: Peak Inundation */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Crest Peak Crests In</span>
            <span className="text-3xl font-mono font-extrabold text-purple-primary mt-1 block">
              +{peakArrivalMin} <span className="text-sm font-normal">min</span>
            </span>
            <span className="text-xs font-mono text-slate-500 mt-1 block">Expected depth: {peakDepth}cm</span>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">Stage: Accumulation Phase</div>
          </div>

          {/* Milestone 2: Sedan Passable (<15cm) */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80">
            <span className="text-[10px] font-mono text-purple-deep uppercase block font-semibold">Sedan & 2-Wheeler Passable</span>
            <span className="text-3xl font-mono font-extrabold text-purple-deep mt-1 block">
              {formatHoursMins(totalMinTo15)}
            </span>
            <span className="text-xs font-mono text-purple-700 mt-1 block">When water drops below 15cm</span>
            <div className="mt-2 text-[10px] text-purple-primary font-mono font-semibold">Stage: Primary Pump Relief</div>
          </div>

          {/* Milestone 3: Completely Dry Ground (<5cm) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-[10px] font-mono text-emerald-800 uppercase block font-semibold">Normal Foot Pedestrian Dry</span>
            <span className="text-3xl font-mono font-extrabold text-emerald-900 mt-1 block">
              {formatHoursMins(totalMinTo5)}
            </span>
            <span className="text-xs font-mono text-emerald-700 mt-1 block">When curb water drops below 5cm</span>
            <div className="mt-2 text-[10px] text-emerald-800 font-mono font-semibold">Stage: Gravity Outfall Clear</div>
          </div>
        </div>

        {/* Phase Progression Timeline */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
            <span>Now ({currentDepth}cm)</span>
            <span className="text-purple-primary font-bold">Peak (+{peakArrivalMin}m, {peakDepth}cm)</span>
            <span>Passable (+{formatHoursMins(totalMinTo15)})</span>
            <span className="text-emerald-800 font-bold">Clear (+{formatHoursMins(totalMinTo5)})</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-red-500 h-full" style={{ width: '25%' }} title="Rising" />
            <div className="bg-purple-primary h-full" style={{ width: '20%' }} title="Crest" />
            <div className="bg-amber-400 h-full" style={{ width: '30%' }} title="Receding" />
            <div className="bg-emerald-500 h-full" style={{ width: '25%' }} title="Clear" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1.5">
            <span>1. Surcharge</span>
            <span>2. Crest Inundation</span>
            <span>3. Pump Drawdown</span>
            <span>4. Tidal Recession</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: SERVICING MUNICIPAL PUMPING STATION TELEMETRY STREAM */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Waves className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">BMC Municipal Stormwater Pumping Station Telemetry</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Direct telemetry from the major high-capacity sea outfall pumping station draining this catchment
            </p>
          </div>

          {/* Station selector */}
          <div className="flex items-center gap-1.5">
            {Object.keys(pumpingStations).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStation(st)}
                className={`text-xs px-3 py-1.5 rounded-xl font-mono capitalize transition ${
                  selectedStation === st ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} Station
              </button>
            ))}
          </div>
        </div>

        {/* Station Telemetry Card */}
        <div className="p-5 rounded-2xl bg-canvas border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <h5 className="font-bold text-sm text-ink">{activeStation.name}</h5>
              <span className="text-xs text-muted font-mono">{activeStation.catchment} • Outfall: {activeStation.dischargeDest}</span>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {activeStation.outfallGate}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Active Turbine Pumps</span>
              <span className="text-xl font-mono font-bold text-blue-600 mt-0.5 block">
                {activeStation.pumpsOnline} / {activeStation.pumpsTotal}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Vertical Axial Flow</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Discharge Rate</span>
              <span className="text-xl font-mono font-bold text-ink mt-0.5 block">
                {(activeStation.capacityM3hr / 1000).toFixed(0)}k m³/h
              </span>
              <span className="text-[10px] text-slate-500 font-mono">60,000 Litres/sec</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Suction Sump Depth</span>
              <span className="text-xl font-mono font-bold text-purple-primary mt-0.5 block">
                {activeStation.sumpLevelM}m MSL
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Trash screen desilted</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-mono text-muted uppercase block">Grid Power Backup</span>
              <span className="text-xs font-mono font-bold text-emerald-800 mt-1 block">
                100% ONLINE
              </span>
              <span className="text-[10px] text-slate-500 font-mono truncate">{activeStation.powerSource}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

