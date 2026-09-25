import React, { useState } from 'react';
import { 
  Waves, 
  Radio, 
  Camera, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  RefreshCw, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function LocationDrainageAndSensors({ selectedPlace }) {
  const [activeCctvModal, setActiveCctvModal] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock Drainage Telemetry calibrated to this place
  const drainageData = {
    boxDrainName: selectedPlace.drainageDistance.includes('from ') ? selectedPlace.drainageDistance.split('from ')[1] : 'Municipal Storm Drain Line',
    distanceM: selectedPlace.drainageDistance.split('m')[0] || '80',
    capacityPercent: Math.min(100, Math.round((selectedPlace.currentDepth / 40) * 100 + 25)),
    siltationIndex: 28, // 28% silted
    desiltDate: '14 May 2026 (BMC Pre-monsoon Desilting Pass)',
    sluiceGateStatus: selectedPlace.currentDepth > 15 ? 'RESTRICTED / TIDAL FLAP CLOSED' : 'GRAVITATIONAL DISCHARGE ACTIVE',
    pumpsTotal: 4,
    pumpsRunning: selectedPlace.currentDepth > 10 ? 3 : 1,
    pumpDischargeLps: 2800 // Litres per second
  };

  // Nearby IoT Ultrasonic Sensors
  const nearbySensors = [
    {
      id: 'BMC-IOT-F09',
      name: `${selectedPlace.name.split(' ')[0]} Box Drain Inflow Sensor`,
      distance: `${drainageData.distanceM}m away`,
      depth: selectedPlace.currentDepth,
      trend: '+2.8 cm/15m',
      battery: '94%',
      signal: 'LoRaWAN 868MHz (Strong)',
      status: 'ONLINE',
      frequency: 'Every 60s'
    },
    {
      id: 'IITB-RADAR-44',
      name: 'Ambedkar Road Over-bridge Radar',
      distance: '180m away',
      depth: Math.max(0, selectedPlace.currentDepth - 3),
      trend: '+1.4 cm/15m',
      battery: 'Solar (100%)',
      signal: 'NB-IoT 4G LTE',
      status: 'ONLINE',
      frequency: 'Every 30s'
    },
    {
      id: 'BMC-CCTV-CAM-12',
      name: 'Hindmata Flyover Underpass Camera',
      distance: '210m away',
      depth: selectedPlace.peakDepth > 20 ? 28 : 12,
      trend: 'RISING',
      battery: 'Grid Powered + UPS',
      signal: 'Fibre Optic (BMC HQ)',
      status: 'STREAMING',
      frequency: 'Live 1080p AI Optical Depth'
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-6">
      {/* Section 1: Local Storm Drainage Network & Culvert Health */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Waves className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Storm Drainage Network & Culvert Telemetry</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Hydraulic conveyance telemetry for <span className="font-semibold text-ink">{drainageData.boxDrainName}</span> ({drainageData.distanceM}m away)
            </p>
          </div>

          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-primary' : ''}`} />
            <span>Poll Telemetry</span>
          </button>
        </div>

        {/* Drainage Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          {/* Capacity */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Box Drain Utilization</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-extrabold text-ink">{drainageData.capacityPercent}%</span>
              <span className={`text-[10px] font-mono font-bold ${drainageData.capacityPercent > 80 ? 'text-red-600' : 'text-emerald-700'}`}>
                {drainageData.capacityPercent > 80 ? 'SURCHARGE' : 'PASSING'}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all rounded-full ${
                  drainageData.capacityPercent > 85 ? 'bg-red-500' : drainageData.capacityPercent > 60 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, drainageData.capacityPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-mono">Cross-section 3.2m x 2.4m</span>
          </div>

          {/* Siltation Index */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Siltation / Choke Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-extrabold text-amber-700">{drainageData.siltationIndex}%</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">DESILTED</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${drainageData.siltationIndex}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-mono truncate">{drainageData.desiltDate}</span>
          </div>

          {/* Sluice Gate */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Tidal Flap Sluice Gate</span>
            <span className="text-xs font-mono font-bold text-ink mt-2 block leading-snug">
              {drainageData.sluiceGateStatus}
            </span>
            <span className="text-[10px] text-slate-500 block mt-2 font-mono">
              Prevents creek seawater backflow
            </span>
          </div>

          {/* Submersible Pumps */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">High-Capacity Dewatering</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-extrabold text-purple-primary">
                {drainageData.pumpsRunning}/{drainageData.pumpsTotal}
              </span>
              <span className="text-[10px] font-mono text-purple-deep font-bold">PUMPS ACTIVE</span>
            </div>
            <span className="text-xs font-mono text-slate-700 block mt-1">
              {drainageData.pumpDischargeLps} L/sec discharge
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Diesel Generator Standby</span>
          </div>
        </div>
      </div>

      {/* Section 2: Live IoT Ultrasonic Sensors & CCTV Feeds within Catchment */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Radio className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-ink">Live Municipal & Research IoT Sensor Nodes</h4>
          </div>
          <span className="text-xs font-mono text-emerald-800 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All 3 Nodes Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbySensors.map(sensor => (
            <div 
              key={sensor.id}
              className="p-4 rounded-2xl bg-canvas border border-slate-200/80 hover:border-purple-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {sensor.id}
                  </span>
                  <span className="text-[10px] font-mono text-muted">{sensor.distance}</span>
                </div>
                <h5 className="text-xs font-bold text-ink leading-snug">{sensor.name}</h5>
                
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-muted uppercase block">Telemetry Depth</span>
                    <span className="text-xl font-mono font-extrabold text-ink">{sensor.depth} <span className="text-xs font-normal">cm</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-muted uppercase block">Rate of Change</span>
                    <span className="text-xs font-mono font-bold text-amber-700">{sensor.trend}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Batt: {sensor.battery}</span>
                {sensor.id.includes('CCTV') ? (
                  <button 
                    onClick={() => setActiveCctvModal(sensor)}
                    className="text-purple-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" /> View Feed
                  </button>
                ) : (
                  <span className="text-emerald-800 font-semibold">{sensor.signal.split(' ')[0]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CCTV Snapshot Modal */}
      {activeCctvModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  LIVE CCTV FEED • {activeCctvModal.id}
                </span>
              </div>
              <button 
                onClick={() => setActiveCctvModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Camera Video Frame */}
            <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
              {/* Camera timestamp overlay */}
              <div className="absolute top-3 left-3 text-[11px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                CAM-12 [HINDMATA FLYOVER WEST] • 2026-09-23 {new Date().toLocaleTimeString()}
              </div>

              {/* Water gauge overlay simulated on screen */}
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded">
                AI WATER LEVEL: {activeCctvModal.depth}cm • SPEED: 0.35m/s
              </div>

              {/* Simulated camera view graphic */}
              <div className="text-center p-6 space-y-2">
                <Camera className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400 font-mono">
                  Optical AI Water Gauge calibrated to curb edge marking.
                </p>
                <div className="inline-block px-3 py-1 bg-purple-900/60 border border-purple-500/40 rounded-full text-[11px] font-mono text-purple-200">
                  Roadway partially submerged • Traffic diversion recommended
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-mono">Authority Feed ID: BMC-DISASTER-HQ-STREAM-04</span>
              <button 
                onClick={() => setActiveCctvModal(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

