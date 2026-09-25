import React, { useState } from 'react';
import { 
  Waves, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  ShieldCheck, X, RefreshCw, Layers, ShieldAlert, Activity 
} from 'lucide-react';

export default function RiverNullahGaugeModal({ isOpen, onClose }) {
  const [selectedRiver, setSelectedRiver] = useState('mithi');

  const riverGauges = [
    {
      id: 'mithi',
      name: 'Mithi River (Kurla - CST Bridge Station)',
      currentLevelM: 3.85,
      dangerLevelM: 4.20,
      warningLevelM: 3.50,
      rateOfRiseCmHr: '+14 cm/hr',
      flowVelocityMs: '2.4 m/s',
      tideStatus: 'High Tide Ingress 4.87m active',
      sluiceStatus: 'THROTTLED (60% Open)',
      dischargeCusecs: '1,840 cusecs',
      risk: 'CRITICAL',
      alert: 'Warning: 35cm before bank overflow into Kranti Nagar settlements.'
    },
    {
      id: 'dahisar',
      name: 'Dahisar River (SV Road Bridge Station)',
      currentLevelM: 2.10,
      dangerLevelM: 3.10,
      warningLevelM: 2.50,
      rateOfRiseCmHr: '+6 cm/hr',
      flowVelocityMs: '1.2 m/s',
      tideStatus: 'Normal Tidal Outflow',
      sluiceStatus: 'OPEN (100% Gravity Drainage)',
      dischargeCusecs: '620 cusecs',
      risk: 'MODERATE',
      alert: 'River channel flowing with adequate freeboard margin.'
    },
    {
      id: 'poisar',
      name: 'Poisar River (Kandivali Outfall)',
      currentLevelM: 2.65,
      dangerLevelM: 3.40,
      warningLevelM: 2.80,
      rateOfRiseCmHr: '+9 cm/hr',
      flowVelocityMs: '1.6 m/s',
      tideStatus: 'Tidal Swell Rising',
      sluiceStatus: 'OPEN (Auto Flap Gates Active)',
      dischargeCusecs: '910 cusecs',
      risk: 'CAUTION',
      alert: 'Poisar culvert water level approaching caution threshold.'
    },
    {
      id: 'lovegrove',
      name: 'Love Grove Pumping Station (Worli Outfall)',
      currentLevelM: 1.40,
      dangerLevelM: 2.80,
      warningLevelM: 2.00,
      rateOfRiseCmHr: '-4 cm/hr',
      flowVelocityMs: '0.8 m/s',
      tideStatus: 'Sea Barrier Closed - 6 Diesel Dewatering Pumps Active',
      sluiceStatus: 'PUMPING (Capacity: 36,000 m³/hr)',
      dischargeCusecs: '2,200 cusecs',
      risk: 'SAFE',
      alert: 'High-power submersible pumps actively evacuating stormwater into Arabian Sea.'
    }
  ];

  if (!isOpen) return null;

  const current = riverGauges.find(r => r.id === selectedRiver) || riverGauges[0];
  const fillPercentage = Math.min(100, Math.round((current.currentLevelM / current.dangerLevelM) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">Feature #10</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
                  MCGM Real-Time Hydro-Sensors
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">River & Stormwater Nullah Overflow Telemetry</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Station Selector */}
          <div className="grid grid-cols-2 gap-2">
            {riverGauges.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedRiver(item.id)}
                className={`p-3 rounded-xl border text-left font-mono transition-all text-xs ${
                  selectedRiver === item.id
                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold truncate pr-1">{item.name.split('(')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    item.risk === 'CRITICAL' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-emerald-400'
                  }`}>
                    {item.currentLevelM}m
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">{item.rateOfRiseCmHr}</span>
              </button>
            ))}
          </div>

          {/* Active River Gauge Display */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-bold text-white text-base">{current.name}</h3>
                <span className="text-xs font-mono text-slate-400">{current.tideStatus}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                current.risk === 'CRITICAL' 
                  ? 'bg-red-950 border-red-500 text-red-300' 
                  : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {current.risk} LEVEL
              </span>
            </div>

            {/* Gauge Vertical Bar */}
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Level: <strong className="text-white">{current.currentLevelM}m</strong></span>
                <span className="text-red-400 font-bold">Danger Mark: {current.dangerLevelM}m</span>
              </div>
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    fillPercentage > 85 ? 'bg-red-500' : fillPercentage > 70 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0m Baseline</span>
                <span>Warning: {current.warningLevelM}m</span>
                <span>{fillPercentage}% Capacity</span>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">RATE OF RISE</span>
                <span className="text-white font-bold">{current.rateOfRiseCmHr}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">FLOW VELOCITY</span>
                <span className="text-cyan-400 font-bold">{current.flowVelocityMs}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SLUICE FLAP</span>
                <span className="text-amber-400 font-bold truncate block">{current.sluiceStatus}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">DISCHARGE</span>
                <span className="text-emerald-400 font-bold">{current.dischargeCusecs}</span>
              </div>
            </div>

            {/* Alert Banner */}
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{current.alert}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

