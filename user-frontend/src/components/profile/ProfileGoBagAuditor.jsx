import React, { useState } from 'react';
import { 
  Briefcase, CheckCircle2, AlertTriangle, RefreshCw, 
  Calendar, ShieldCheck, Plus, CheckSquare, Square, Info
} from 'lucide-react';

export const DEFAULT_GO_BAG_ITEMS = [
  { id: 'gb-1', name: 'Waterproof LED Torch & Spare Batteries', checked: true, category: 'Survival Gear', expiry: 'Nov 2027' },
  { id: 'gb-2', name: 'Water Purification Chlorine Tablets (50x)', checked: true, category: 'Hydration', expiry: 'Jan 2028' },
  { id: 'gb-3', name: 'Sealed High-Calorie Energy Bars (72h supply)', checked: true, category: 'Food', expiry: 'Aug 2026' },
  { id: 'gb-4', name: '20,000 mAh Waterproof Power Bank (100% Charged)', checked: true, category: 'Power', expiry: 'Inspect Weekly' },
  { id: 'gb-5', name: 'High-Pitch Acoustic Emergency Whistle', checked: true, category: 'Signaling', expiry: 'Permanent' },
  { id: 'gb-6', name: 'First Aid Kit (Bandages, Betadine, Paracetamol)', checked: true, category: 'Medical', expiry: 'Dec 2026' },
  { id: 'gb-7', name: 'Laminated Photocopies of Aadhar, PAN & Deeds', checked: false, category: 'Documents', expiry: 'Permanent' },
  { id: 'gb-8', name: 'Heavy-Duty Mylar Thermal Emergency Blanket', checked: false, category: 'Shelter', expiry: 'Permanent' },
  { id: 'gb-9', name: 'Essential Prescription Medicines (7-Day Cache)', checked: true, category: 'Medical', expiry: 'Oct 2026' },
  { id: 'gb-10', name: 'Cash Emergency Currency (₹5,000 in ₹100 notes)', checked: true, category: 'Financial', expiry: 'N/A' },
  { id: 'gb-11', name: 'N95 / Dust & Mold Masks for Inundation Zones', checked: false, category: 'Health', expiry: '2029' },
  { id: 'gb-12', name: 'Waterproof Phone Dry-Bag with Lanyard', checked: true, category: 'Protection', expiry: 'Permanent' }
];

export default function ProfileGoBagAuditor({ 
  goBagItems, 
  onUpdateGoBag, 
  speakAlert 
}) {
  const items = goBagItems?.length ? goBagItems : DEFAULT_GO_BAG_ITEMS;

  const checkedCount = items.filter(i => i.checked).length;
  const completionPercent = Math.round((checkedCount / items.length) * 100);

  const toggleItem = (id) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const next = !item.checked;
        if (next) {
          speakAlert(`${item.name} verified in go-bag.`);
        }
        return { ...item, checked: next };
      }
      return item;
    });
    onUpdateGoBag(updated);
  };

  const markAll = (status) => {
    const updated = items.map(i => ({ ...i, checked: status }));
    onUpdateGoBag(updated);
    speakAlert(status ? 'All go-bag items marked as packed.' : 'Go-bag inventory reset.');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 shadow-xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Go-Bag Survival Kit Readiness Auditor</h2>
            <p className="text-xs text-muted">
              72-Hour Rapid Evacuation Backpack inventory based on NDMA & BMC standard survival guidelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => markAll(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Mark All Ready
          </button>
          <button
            type="button"
            onClick={() => markAll(false)}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress & Status Card */}
      <div className="mb-6 p-5 rounded-2xl bg-canvas border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold block">
            Evacuation Pack Readiness Index
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-purple-primary">
              {completionPercent}%
            </span>
            <span className="text-xs font-semibold text-slate-600">
              ({checkedCount} of {items.length} Essential Supplies Verified)
            </span>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                completionPercent >= 80 
                  ? 'bg-emerald-500' 
                  : completionPercent >= 50 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted text-right block mt-1">
            {completionPercent === 100 ? 'Fully Battle-Ready for Monsoons' : `${100 - completionPercent}% items still missing or unpacked`}
          </span>
        </div>
      </div>

      {/* 12-Item Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              item.checked
                ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="mt-0.5">
              {item.checked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className={`text-xs font-bold block leading-tight ${item.checked ? 'text-emerald-950' : 'text-ink'}`}>
                {item.name}
              </span>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted mt-1.5">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{item.category}</span>
                <span>Exp: {item.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

