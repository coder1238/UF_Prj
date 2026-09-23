import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, ArrowUpRight, 
  Droplets, Volume2, Car, Navigation, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useFlood } from '../../context/FloodContext';

export default function PersonalSafetyRing({ 
  riskLevel = 'MODERATE', 
  locationName = 'Andheri East (Kurla Basin Corridor)',
  currentDepth = 7, 
  peakDepth = 19, 
  arrivalTime = '+46 min', 
  rainRate = 24,
  actionText = 'Western Express Highway access clear. Avoid SV Road subway.'
}) {
  const { setActivePage } = useNavigation();
  const { 
    vehicleType, 
    setVehicleType, 
    clearanceThreshold, 
    setClearanceThreshold,
    speakAlert 
  } = useFlood();

  const [simulatedGpsActive, setSimulatedGpsActive] = useState(false);

  // Clearance presets
  const vehiclePresets = [
    { id: 'pedestrian', label: 'Walk', clearance: 8 },
    { id: 'two-wheeler', label: 'Bike', clearance: 13 },
    { id: 'sedan', label: 'Sedan', clearance: 16 },
    { id: 'suv', label: 'SUV', clearance: 22 }
  ];

  const currentVehiclePreset = vehiclePresets.find(v => v.id === vehicleType) || vehiclePresets[2];
  const clearanceMargin = currentVehiclePreset.clearance - currentDepth;
  const isVehicleSubmerged = clearanceMargin < 0;

  const handleSimulateGPS = () => {
    setSimulatedGpsActive(true);
    setTimeout(() => setSimulatedGpsActive(false), 2000);
  };

  const handleSpeakStatus = () => {
    const speech = `Safety update for ${locationName}. Risk is ${riskLevel}. Current water depth is ${currentDepth} centimeters. Peak expected is ${peakDepth} centimeters. ${actionText}`;
    speakAlert(speech);
  };

  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'SAFE':
      case 'LOW':
        return {
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          indicator: 'bg-emerald-500',
          icon: ShieldCheck,
          label: 'LOW RISK',
          subtext: 'Safe for normal travel and parking.'
        };
      case 'CAUTION':
      case 'MODERATE':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          indicator: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'MODERATE RISK',
          subtext: 'Ponding detected on low curb areas. Two-wheelers exercise caution.'
        };
      case 'HIGH':
        return {
          badge: 'bg-red-100 text-red-900 border-red-300',
          indicator: 'bg-red-500',
          icon: AlertOctagon,
          label: 'HIGH RISK',
          subtext: 'Water rising rapidly. Impassable for standard sedans in ~20m.'
        };
      default:
        return {
          badge: 'bg-red-200 text-red-950 border-red-400',
          indicator: 'bg-red-700',
          icon: AlertOctagon,
          label: 'CRITICAL RISK',
          subtext: 'Severe inundation. Do not enter roadways or subterranean basements.'
        };
    }
  };

  const risk = getRiskStyles();
  const IconComponent = risk.icon;

  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-card relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-ink-muted uppercase">
              YOUR CURRENT VICINITY
            </span>
            <button
              onClick={handleSimulateGPS}
              className="text-[10px] font-mono text-purple-primary hover:underline flex items-center gap-1 font-semibold"
              title="Re-acquire GPS fix"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${simulatedGpsActive ? 'animate-spin' : ''}`} />
              <span>{simulatedGpsActive ? 'Locking GPS...' : 'GPS Live'}</span>
            </button>
          </div>
          <div className="text-sm font-bold text-ink flex items-center gap-1.5">
            {locationName}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeakStatus}
            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-primary hover:bg-slate-100 transition"
            title="Read Safety Status via Voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-extrabold border flex items-center gap-1.5 ${risk.badge}`}>
            <span className={`w-2 h-2 rounded-full ${risk.indicator} animate-ping`}></span>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Interactive Vehicle Clearance Selector Strip */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
          <Car className="w-3.5 h-3.5 text-purple-primary" />
          <span className="font-bold">Mode:</span>
        </div>
        <div className="flex items-center gap-1">
          {vehiclePresets.map(vp => (
            <button
              key={vp.id}
              onClick={() => {
                setVehicleType(vp.id);
                setClearanceThreshold(vp.clearance);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                vehicleType === vp.id
                  ? 'bg-purple-primary text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {vp.label} ({vp.clearance}cm)
            </button>
          ))}
        </div>
      </div>

      {/* 3 Telemetry Readouts in JetBrains Mono */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <div className="bg-canvas rounded-xl p-2.5 border border-border/80">
          <div className="text-[10px] font-mono text-ink-muted flex items-center gap-1">
            <Droplets className="w-3 h-3 text-primary" />
            WATER DEPTH
          </div>
          <div className="text-xl font-bold font-mono text-ink mt-0.5">
            {currentDepth} <span className="text-xs font-normal text-ink-muted">cm</span>
          </div>
          <div className="text-[10px] font-mono text-ink-secondary">
            Peak: <strong className="text-ink">{peakDepth} cm</strong>
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-2.5 border border-border/80">
          <div className="text-[10px] font-mono text-ink-muted">
            HAZARD ARRIVAL
          </div>
          <div className="text-xl font-bold font-mono text-ink mt-0.5 text-primary">
            {arrivalTime}
          </div>
          <div className="text-[10px] font-mono text-ink-secondary">
            Est. 21:16 IST
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-2.5 border border-border/80">
          <div className="text-[10px] font-mono text-ink-muted">
            RAINFALL RATE
          </div>
          <div className="text-xl font-bold font-mono text-ink mt-0.5">
            {rainRate} <span className="text-xs font-normal text-ink-muted">mm/h</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold">
            Steady cell
          </div>
        </div>
      </div>

      {/* Vehicle Margin Indicator Bar */}
      <div className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between mb-3 ${
        isVehicleSubmerged 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}>
        <span className="font-bold">
          {isVehicleSubmerged ? `Warning: Clearance exceeded by ${Math.abs(clearanceMargin)} cm` : `Safe: +${clearanceMargin} cm wading margin`}
        </span>
        <span className="text-[10px] text-slate-500">
          {currentVehiclePreset.label} limit: {currentVehiclePreset.clearance}cm
        </span>
      </div>

      {/* Recommended Action Callout */}
      <div className="p-3 rounded-xl bg-primary-soft/50 border border-primary/20 flex items-start gap-2.5">
        <IconComponent className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs flex-1">
          <strong className="text-primary-deep font-semibold">Recommended Action: </strong>
          <span className="text-ink-secondary">{actionText}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 flex items-center gap-2">
        <button 
          onClick={() => setActivePage('route')}
          className="flex-1 bg-primary text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm hover:bg-primary-hover transition flex items-center justify-center gap-1.5"
        >
          <span>Plan Safe Route</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => setActivePage('safe-places')}
          className="bg-canvas hover:bg-surface-secondary text-ink-secondary text-xs font-semibold py-2 px-3 rounded-lg border border-border transition"
        >
          Find Safe Havens
        </button>
      </div>
    </div>
  );
}
