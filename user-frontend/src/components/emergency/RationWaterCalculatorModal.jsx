import React, { useState } from 'react';
import { 
  Droplet, Utensils, Users, Clock, ShieldCheck, 
  Copy, Check, X, Plus, Minus, Download, AlertCircle 
} from 'lucide-react';

export default function RationWaterCalculatorModal({ isOpen, onClose }) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [elderly, setElderly] = useState(1);
  const [pets, setPets] = useState(1);
  const [days, setDays] = useState(3);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // WHO / NDMA emergency standards:
  // 3 liters drinking water per adult/elderly per day, 2 liters per child per day, 1 liter per pet per day
  // 4 liters sanitation water per person per day
  const drinkingWaterLiters = (adults * 3 + elderly * 3 + children * 2 + pets * 1) * days;
  const sanitationWaterLiters = (adults + elderly + children) * 4 * days;
  const totalWaterLiters = drinkingWaterLiters + sanitationWaterLiters;

  // Calorie needs: ~2000 kcal adult, 1600 child, 1800 elder, 500 pet
  const totalCalories = (adults * 2000 + elderly * 1800 + children * 1600 + pets * 500) * days;
  const orsSachets = (adults + elderly + children) * 2 * days;
  const chlorineTablets = Math.ceil(totalWaterLiters / 20); // 1 tablet per 20 liters

  const exportSummary = `EMERGENCY DISASTER RATIONS (${days} DAYS):
- Household: ${adults} Adults, ${children} Children, ${elderly} Elderly, ${pets} Pets
- Drinking Water: ${drinkingWaterLiters} Liters
- Sanitation Water: ${sanitationWaterLiters} Liters
- Total Potable/Sanitation Reserve: ${totalWaterLiters} Liters
- Total Caloric Reserve: ${totalCalories.toLocaleString()} kcal (Dry rations / canned legumes / energy bars)
- Oral Rehydration Salts (ORS): ${orsSachets} sachets
- Chlorine Disinfection Tablets: ${chlorineTablets} tablets (1 per 20L water)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Droplet className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Feature #09</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                  WHO & NDMA Calibrated
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Emergency Water & Ration Calculator</h2>
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
          {/* Household Controls */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Family & Household Composition:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { label: 'Adults', val: adults, set: setAdults },
                { label: 'Children', val: children, set: setChildren },
                { label: 'Elderly', val: elderly, set: setElderly },
                { label: 'Pets', val: pets, set: setPets }
              ].map(item => (
                <div key={item.label} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-[11px] block">{item.label}</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => item.set(Math.max(0, item.val - 1))}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-white">{item.val}</span>
                    <button
                      onClick={() => item.set(item.val + 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Duration Selector */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">ISOLATION HORIZON:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      days === d ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Supply Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold block">DRINKING WATER</span>
              <span className="text-2xl font-extrabold text-white block">{drinkingWaterLiters} L</span>
              <span className="text-[10px] text-slate-400">Strictly potable / sealed</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-teal-400 font-bold block">SANITATION WATER</span>
              <span className="text-2xl font-extrabold text-white block">{sanitationWaterLiters} L</span>
              <span className="text-[10px] text-slate-400">Washing & hygiene</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold block">CALORIC RESERVE</span>
              <span className="text-2xl font-extrabold text-white block">{(totalCalories / 1000).toFixed(1)}k</span>
              <span className="text-[10px] text-slate-400">Total kcal provisions</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold block">ORS SACHETS</span>
              <span className="text-2xl font-extrabold text-white block">{orsSachets}</span>
              <span className="text-[10px] text-slate-400">Electrolyte preservation</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">CHLORINE TABS</span>
              <span className="text-2xl font-extrabold text-white block">{chlorineTablets}</span>
              <span className="text-[10px] text-slate-400">1 tab purifies 20L</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-red-400 font-bold block">TOTAL LIQUID</span>
              <span className="text-2xl font-extrabold text-white block">{totalWaterLiters} L</span>
              <span className="text-[10px] text-slate-400">Combined weight: {totalWaterLiters} kg</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Supply List' : 'Copy Supply Checklist'}
            </button>

            <button
              onClick={() => window.print()}
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

