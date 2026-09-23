import React, { useState, useEffect } from 'react';
import { 
  Heart, Thermometer, ShieldAlert, Clock, AlertTriangle, 
  Plus, CheckCircle2, X, RefreshCw, Activity, Zap 
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function MedicalColdChainModal({ isOpen, onClose }) {
  const [coldChainHours, setColdChainHours] = useState(18); // hours remaining
  const [coldChainMins, setColdChainMins] = useState(42);
  const [temperatureC, setTemperatureC] = useState(5.2); // safe range 2°C - 8°C

  const [dependencies, setDependencies] = useState([
    { id: 1, type: 'Insulin (Lantus / Humalog)', requiredTemp: '2°C - 8°C', criticalHours: '24h before denaturation', status: 'COOLER PACKED' },
    { id: 2, type: 'Portable Oxygen Concentrator', requiredTemp: 'Dry 100% Battery', criticalHours: '4.5h battery remaining', status: 'BATTERY ACTIVE' },
    { id: 3, type: 'Peritoneal Dialysis Fluid Bags', requiredTemp: 'Dry Elevated Store', criticalHours: '3 bags ready', status: 'SEALED DRY' }
  ]);

  const [newMedName, setNewMedName] = useState('');

  // Ticking timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setColdChainMins(prev => {
        if (prev === 0) {
          setColdChainHours(h => Math.max(0, h - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setDependencies([
      ...dependencies,
      {
        id: Date.now(),
        type: newMedName.trim(),
        requiredTemp: 'Critical Medical Store',
        criticalHours: 'Tracked on Priority Desk',
        status: 'MONITORED'
      }
    ]);
    setNewMedName('');
  };

  const handleReIcePack = () => {
    setColdChainHours(24);
    setColdChainMins(0);
    setTemperatureC(3.4);
    emergencyAudio.playCountdownBeep(720);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Thermometer className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-rose-400 font-bold tracking-wider">Feature #13</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
                  Critical Cold-Chain Protocol
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Insulin & Life-Support Dependency Tracker</h2>
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
          {/* Cold Chain Countdown Box */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Thermometer className="w-4 h-4" /> PASSIVE THERMAL COOLER BUFFER
              </span>
              <span>INTERNAL TEMP: <strong className="text-emerald-400">{temperatureC}°C</strong> (Safe 2-8°C)</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-around items-center">
              <div>
                <span className="text-4xl font-mono font-extrabold text-white">
                  {coldChainHours.toString().padStart(2, '0')}:{coldChainMins.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">HOURS REMAINING BEFORE EXPIRY</span>
              </div>

              <button
                onClick={handleReIcePack}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Ice / Reset 24h
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono text-left leading-relaxed">
              *Insulin degrades rapidly above 30°C. In the absence of electricity, keep vials sealed inside a thermos or insulated pouch surrounded by gel ice-packs. Do not allow vials to touch raw ice directly.
            </p>
          </div>

          {/* Registered Critical Dependencies */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Registered Household Medical Equipment:
            </span>

            <div className="space-y-2">
              {dependencies.map(item => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{item.type}</span>
                    <span className="text-[11px] font-mono text-slate-400">{item.requiredTemp} • {item.criticalHours}</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddMed} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add medical equipment (e.g. Nebulizer, BiPAP)"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

