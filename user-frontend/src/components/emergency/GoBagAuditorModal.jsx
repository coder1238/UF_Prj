import React, { useState } from 'react';
import { 
  Briefcase, CheckCircle2, AlertTriangle, Scale, 
  ShieldCheck, X, Plus, Trash2, Droplets, CheckSquare, Square 
} from 'lucide-react';

export default function GoBagAuditorModal({ isOpen, onClose }) {
  const [items, setItems] = useState([
    { id: 1, name: '1.5L Sealed Potable Water Bottle', weightKg: 1.5, category: 'Water', packed: true, waterproof: true },
    { id: 2, name: 'Waterproof Document Pouch (Passport/Aadhaar/Deeds)', weightKg: 0.3, category: 'Docs', packed: true, waterproof: true },
    { id: 3, name: 'First Aid Kit (Bandages, ORS, Doxycycline)', weightKg: 0.6, category: 'Medical', packed: true, waterproof: true },
    { id: 4, name: '20,000 mAh Heavy Duty Power Bank + Cables', weightKg: 0.5, category: 'Power', packed: true, waterproof: false },
    { id: 5, name: 'Emergency High-Calorie Nut Bars (6x 250 kcal)', weightKg: 0.7, category: 'Food', packed: false, waterproof: true },
    { id: 6, name: 'High-Lumen Waterproof LED Flashlight + Whistle', weightKg: 0.3, category: 'Tools', packed: true, waterproof: true },
    { id: 7, name: 'Mylar Space Blanket & Compact Rain Poncho', weightKg: 0.4, category: 'Warmth', packed: false, waterproof: true },
    { id: 8, name: 'Spare Prescription Eyeglasses & 7-Day Rx Meds', weightKg: 0.3, category: 'Medical', packed: true, waterproof: true }
  ]);

  if (!isOpen) return null;

  const togglePacked = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const totalPackedWeight = items.filter(i => i.packed).reduce((acc, i) => acc + i.weightKg, 0);
  const maxWeightLimit = 8.0; // kg max for swimming/wading agility
  const weightPct = Math.min(100, Math.round((totalPackedWeight / maxWeightLimit) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Briefcase className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">Feature #14</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-mono border border-indigo-800">
                  Buoyancy & Mobility Index
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Emergency Evacuation Go-Bag Weight Auditor</h2>
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
          {/* Weight Bar Gauge */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">TOTAL PACKED WEIGHT:</span>
              <span className={`font-bold text-base ${totalPackedWeight > maxWeightLimit ? 'text-red-400' : 'text-emerald-400'}`}>
                {totalPackedWeight.toFixed(1)} kg / {maxWeightLimit} kg Max
              </span>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  totalPackedWeight > maxWeightLimit ? 'bg-red-500' : totalPackedWeight > 6 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${weightPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 kg</span>
              <span>Optimal Swimming Agility (&lt; 6.0 kg)</span>
              <span>8.0 kg Strict Buoyancy Limit</span>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 font-bold">
              <span>Go-Bag Gear Checklist</span>
              <span>{items.filter(i => i.packed).length} of {items.length} Packed</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePacked(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    item.packed 
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.packed ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={item.packed ? 'font-medium' : 'text-slate-500'}>{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                    <span className="text-slate-400">{item.weightKg} kg</span>
                    {item.waterproof && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
                        Dry
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

