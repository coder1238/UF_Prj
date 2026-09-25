import React, { useState, useEffect } from 'react';
import { PackageCheck, CheckSquare, Square, AlertTriangle, ShieldCheck, RefreshCw, Sparkles, Download } from 'lucide-react';

const INITIAL_GO_BAG_ITEMS = [
  // Hydration
  { id: 'gb-1', category: 'Hydration', label: '9 Litres Sealed Potable Water (3L/person × 3 days)', critical: true },
  { id: 'gb-2', category: 'Hydration', label: 'NaDCC Water Purification Tablets (50 tablets blister pack)', critical: true },
  { id: 'gb-3', category: 'Hydration', label: 'Electrolyte ORS sachets (6 packets for dehydration)', critical: false },

  // Nutrition
  { id: 'gb-4', category: 'Nutrition', label: 'High-calorie non-perishable foods (roasted chana, almonds, energy bars, dry dates)', critical: true },
  { id: 'gb-5', category: 'Nutrition', label: 'Ready-to-eat cans with pull-tabs (no can-opener needed)', critical: false },
  { id: 'gb-6', category: 'Nutrition', label: 'Sterile infant feeding formula & bottles (if traveling with infants)', critical: false },

  // Medical
  { id: 'gb-7', category: 'Medical', label: '14-Day Supply of Chronic Prescriptions (BP, Diabetes, Thyroid, Inhalers)', critical: true },
  { id: 'gb-8', category: 'Medical', label: 'Prophylactic Doxycycline (100mg) for Leptospirosis prevention', critical: true },
  { id: 'gb-9', category: 'Medical', label: 'First Aid Kit (sterile gauze, povidone-iodine ointment, paracetamol, waterproof tape)', critical: true },

  // Documentation
  { id: 'gb-10', category: 'Documentation', label: 'Aadhaar, Voter ID, Passports sealed in IP68 waterproof zip-pouch', critical: true },
  { id: 'gb-11', category: 'Documentation', label: 'Home & Health Insurance Policy Numbers + 24x7 TPA emergency contact cards', critical: true },
  { id: 'gb-12', category: 'Documentation', label: '₹5,000 Physical Cash in ₹100 / ₹200 small denominations (ATMs & UPI fail)', critical: true },

  // Power & Comms
  { id: 'gb-13', category: 'Power & Tools', label: '20,000 mAh Waterproof Power Bank fully charged + braided charging cables', critical: true },
  { id: 'gb-14', category: 'Power & Tools', label: 'Waterproof LED Headlamp (hands-free wading) + spare lithium batteries', critical: true },
  { id: 'gb-15', category: 'Power & Tools', label: 'Fox 40 High-Decibel Pea-less Acoustic Whistle attached to shoulder strap', critical: true },
  { id: 'gb-16', category: 'Power & Tools', label: 'Compact Swiss Multi-Tool (pliers, wire cutters, knife blade)', critical: false },

  // Thermal & Protection
  { id: 'gb-17', category: 'Protection', label: 'Silver Mylar Emergency Foil Blankets (reflects 90% body heat)', critical: true },
  { id: 'gb-18', category: 'Protection', label: 'Heavy-duty puncture-resistant rubber work gloves', critical: false },
  { id: 'gb-19', category: 'Protection', label: 'Spare dry synthetic socks and light change of clothes in ziplock bag', critical: false }
];

export default function GoBagAuditor() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('flood_gobag_audit');
      if (saved) {
        const savedIds = JSON.parse(saved);
        return INITIAL_GO_BAG_ITEMS.map(i => ({
          ...i,
          checked: savedIds.includes(i.id)
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GO_BAG_ITEMS.map(i => ({ ...i, checked: false }));
  });

  const [activeCategory, setActiveCategory] = useState('All');

  // Save to localStorage
  useEffect(() => {
    try {
      const checkedIds = items.filter(i => i.checked).map(i => i.id);
      localStorage.setItem('flood_gobag_audit', JSON.stringify(checkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleReset = () => {
    if (window.confirm('Reset Go-Bag checklist to uncheck all items?')) {
      setItems(INITIAL_GO_BAG_ITEMS.map(i => ({ ...i, checked: false })));
    }
  };

  const categories = ['All', 'Hydration', 'Nutrition', 'Medical', 'Documentation', 'Power & Tools', 'Protection'];

  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const percentage = Math.round((checkedCount / totalCount) * 100);

  const criticalItems = items.filter(i => i.critical);
  const criticalChecked = criticalItems.filter(i => i.checked).length;
  const missingCritical = criticalItems.filter(i => !i.checked);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <PackageCheck className="w-4 h-4" /> Feature 05: 72-Hour Survival Logistics
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Flood Evacuation Go-Bag Readiness Auditor
          </h2>
          <p className="text-xs text-muted mt-1">
            Interactive readiness auditor with persistent local storage saving. Verifies life-critical supplies before evacuation.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Checklist
        </button>
      </div>

      {/* Progress Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200 flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="5" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#6D4AFF'}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - percentage / 100)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute font-mono text-xs font-extrabold text-ink">{percentage}%</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted uppercase block">Readiness Score</span>
            <span className="text-sm font-extrabold text-ink">{checkedCount} of {totalCount} Items Packed</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-canvas border border-slate-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-soft text-purple-primary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted uppercase block">Critical Essentials</span>
            <span className="text-sm font-extrabold text-ink">{criticalChecked} of {criticalItems.length} Packed</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          missingCritical.length > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="p-3 rounded-xl bg-white/80 shrink-0">
            <AlertTriangle className={`w-5 h-5 ${missingCritical.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase block font-bold">Readiness Verdict</span>
            <span className="text-xs font-bold leading-snug">
              {missingCritical.length > 0 ? `${missingCritical.length} Critical Items Missing` : 'Fully Certified Ready for 72h Survival'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-slate-100 pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-purple-primary text-white shadow-xs'
                : 'bg-canvas text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              item.checked
                ? 'bg-emerald-50/50 border-emerald-300 text-slate-800'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${item.checked ? 'text-emerald-950' : 'text-ink'}`}>
                  {item.label}
                </span>
                {item.critical && (
                  <span className="shrink-0 text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                    CRITICAL
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-muted block mt-0.5">{item.category}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

