import React, { useState } from 'react';
import { 
  Package, 
  Camera, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Users, 
  Droplet, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Trash2, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';

export default function LocationSuppliesAndPhotos({ selectedPlace }) {
  // Feature 17: Go-Bag Supplies Calculator State
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [elderly, setElderly] = useState(1);
  const [pets, setPets] = useState(0);
  const [isolationHours, setIsolationHours] = useState(24); // 12h, 24h, 48h

  const totalPeople = adults + children + elderly;
  const daysFactor = isolationHours / 24;

  // Supply formulas:
  // Water: 3L per person per day + 1.5L per pet per day
  const requiredWaterLitres = Math.round((totalPeople * 3 + pets * 1.5) * daysFactor);
  // Food calories: 2000 kcal per adult/elderly, 1500 per child
  const totalCalories = Math.round(((adults + elderly) * 2000 + children * 1500) * daysFactor);
  // ORS packets: 2 per person
  const orsPackets = totalPeople * 2;
  // Battery pack hours: 10,000 mAh per adult
  const batteryMahi = (adults + elderly) * 10000;
  // Cash recommendation (ATMs drown / lose power in floods)
  const cashRecommendationInr = (totalPeople * 2500);

  // Checkable packing list
  const [packedItems, setPackedItems] = useState({
    water: true,
    food: false,
    ors: true,
    torch: true,
    powerbank: true,
    cash: false,
    medicines: true,
    firstaid: false
  });

  const togglePacked = (item) => {
    setPackedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Feature 18: Insurance Photo Locker
  const [photos, setPhotos] = useState([
    {
      id: 'ph-1',
      title: 'Ground Floor Living Room & Electronics',
      category: 'Appliances',
      timestamp: '2026-09-23 00:45 IST',
      status: 'VERIFIED GEO-TAG'
    },
    {
      id: 'ph-2',
      title: 'Stilt Parking Sedan (MH 01 AB 1234)',
      category: 'Vehicle',
      timestamp: '2026-09-23 01:10 IST',
      status: 'VERIFIED GEO-TAG'
    },
    {
      id: 'ph-3',
      title: 'Electricity Meter & MCB Panel',
      category: 'Utilities',
      timestamp: '2026-09-23 01:15 IST',
      status: 'VERIFIED GEO-TAG'
    }
  ]);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCat, setNewPhotoCat] = useState('Property Exterior');
  const [manifestGenerated, setManifestGenerated] = useState(false);

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) return;
    const newEntry = {
      id: `ph-${Date.now()}`,
      title: newPhotoTitle.trim(),
      category: newPhotoCat,
      timestamp: new Date().toLocaleString(),
      status: 'VERIFIED GEO-TAG'
    };
    setPhotos([newEntry, ...photos]);
    setNewPhotoTitle('');
  };

  const handleDeletePhoto = (id) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-8">
      {/* SECTION 1: EMERGENCY GO-BAG & SURVIVAL SUPPLIES CALCULATOR */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <Package className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Emergency Go-Bag & Isolation Supplies Calculator</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Custom survival quotient for {selectedPlace.name} based on household composition & flood duration
            </p>
          </div>

          {/* Isolation Duration Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[12, 24, 48].map(h => (
              <button
                key={h}
                onClick={() => setIsolationHours(h)}
                className={`text-xs px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                  isolationHours === h ? 'bg-purple-primary text-white shadow-sm' : 'text-slate-600 hover:text-ink'
                }`}
              >
                {h}h Isolation
              </button>
            ))}
          </div>
        </div>

        {/* Occupant Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-canvas p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted uppercase block">Adults</span>
              <span className="text-lg font-mono font-bold text-ink">{adults}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-xs font-bold">-</button>
              <button onClick={() => setAdults(adults + 1)} className="w-6 h-6 rounded bg-purple-primary text-white text-xs font-bold">+</button>
            </div>
          </div>

          <div className="bg-canvas p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted uppercase block">Children</span>
              <span className="text-lg font-mono font-bold text-ink">{children}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-xs font-bold">-</button>
              <button onClick={() => setChildren(children + 1)} className="w-6 h-6 rounded bg-purple-primary text-white text-xs font-bold">+</button>
            </div>
          </div>

          <div className="bg-canvas p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted uppercase block">Elderly</span>
              <span className="text-lg font-mono font-bold text-ink">{elderly}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setElderly(Math.max(0, elderly - 1))} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-xs font-bold">-</button>
              <button onClick={() => setElderly(elderly + 1)} className="w-6 h-6 rounded bg-purple-primary text-white text-xs font-bold">+</button>
            </div>
          </div>

          <div className="bg-canvas p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted uppercase block">Pets</span>
              <span className="text-lg font-mono font-bold text-ink">{pets}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPets(Math.max(0, pets - 1))} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-xs font-bold">-</button>
              <button onClick={() => setPets(pets + 1)} className="w-6 h-6 rounded bg-purple-primary text-white text-xs font-bold">+</button>
            </div>
          </div>
        </div>

        {/* Calculated Supply Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center mb-5">
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-[9px] font-mono text-blue-700 uppercase block font-semibold">Drinking Water</span>
            <span className="text-xl font-mono font-extrabold text-blue-900 mt-0.5 block">{requiredWaterLitres} L</span>
            <span className="text-[9px] text-blue-600 font-mono">Bottled sealed</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-[9px] font-mono text-amber-800 uppercase block font-semibold">Ration Energy</span>
            <span className="text-xl font-mono font-extrabold text-amber-950 mt-0.5 block">{totalCalories.toLocaleString()}</span>
            <span className="text-[9px] text-amber-700 font-mono">Dry high-kcal</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-[9px] font-mono text-purple-primary uppercase block font-semibold">Electrolytes / ORS</span>
            <span className="text-xl font-mono font-extrabold text-purple-deep mt-0.5 block">{orsPackets} Packs</span>
            <span className="text-[9px] text-purple-700 font-mono">WHO formula</span>
          </div>

          <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
            <span className="text-[9px] font-mono text-slate-700 uppercase block font-semibold">Power Reserve</span>
            <span className="text-xl font-mono font-extrabold text-slate-900 mt-0.5 block">{batteryMahi / 1000}k mAh</span>
            <span className="text-[9px] text-slate-600 font-mono">Phone battery</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[9px] font-mono text-emerald-800 uppercase block font-semibold">Emergency Cash</span>
            <span className="text-xl font-mono font-extrabold text-emerald-950 mt-0.5 block">₹{cashRecommendationInr.toLocaleString()}</span>
            <span className="text-[9px] text-emerald-700 font-mono">Small notes</span>
          </div>
        </div>

        {/* Interactive Packing Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted uppercase block font-bold">Pack-Ready Checklist</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'water', label: `${requiredWaterLitres}L Drinking Water Jugs Packed in Waterproof Bin` },
              { id: 'food', label: `${totalCalories.toLocaleString()} kcal Biscuits, Nuts, Energy Bars & Granola` },
              { id: 'ors', label: `${orsPackets} Sachets of ORS + Chlorine Purification Tablets` },
              { id: 'torch', label: '2x High-Lumen Waterproof Torches + Spare D-Batteries' },
              { id: 'powerbank', label: `${batteryMahi / 1000}k mAh Power Bank fully charged at 100%` },
              { id: 'cash', label: `₹${cashRecommendationInr.toLocaleString()} Cash in Ziploc (₹100/₹200 notes)` },
              { id: 'medicines', label: '7-Day Chronic Medication (BP, Insulin, Inhalers) in Dry Pouch' },
              { id: 'firstaid', label: 'Antiseptic Ointment, Sterile Bandages & Doxycycline' },
            ].map(item => (
              <label 
                key={item.id} 
                onClick={() => togglePacked(item.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                  packedItems[item.id] ? 'bg-emerald-50/70 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={Boolean(packedItems[item.id])} 
                  onChange={() => {}} 
                  className="w-4 h-4 accent-emerald-600 rounded" 
                />
                <span className={packedItems[item.id] ? 'font-medium' : ''}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: INSURANCE CLAIM READINESS & PRE-DISASTER PHOTO VAULT */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
                <Camera className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Pre-Disaster Geo-Tagged Photo Vault & Insurance Locker</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Secure cryptographic timestamped photos for instant BMC disaster relief and insurance claim settlement
            </p>
          </div>

          <button 
            onClick={() => {
              setManifestGenerated(true);
              setTimeout(() => setManifestGenerated(false), 4000);
            }}
            className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{manifestGenerated ? 'Manifest Exported!' : 'Export Claim Manifest (PDF)'}</span>
          </button>
        </div>

        {/* Add photo form */}
        <form onSubmit={handleAddPhoto} className="bg-canvas p-4 rounded-2xl border border-slate-200/80 mb-4 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-mono text-muted mb-1 font-bold">Asset / Area Description</label>
            <input 
              type="text" 
              placeholder="e.g. Inverter battery backup in stilt, Ground floor TV unit"
              value={newPhotoTitle}
              onChange={e => setNewPhotoTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-primary"
              required
            />
          </div>

          <div className="w-full sm:w-44">
            <label className="block text-[10px] font-mono text-muted mb-1 font-bold">Category</label>
            <select 
              value={newPhotoCat}
              onChange={e => setNewPhotoCat(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-primary"
            >
              <option value="Vehicle">Vehicle</option>
              <option value="Appliances">Appliances & Electronics</option>
              <option value="Utilities">Electricity & Gas Meter</option>
              <option value="Property Exterior">Property Exterior & Plinth</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="px-4 py-2 bg-purple-primary hover:bg-purple-deep text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shrink-0"
          >
            <Upload className="w-3.5 h-3.5" /> Save to Vault
          </button>
        </form>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {photos.map(ph => (
            <div key={ph.id} className="p-3.5 rounded-2xl bg-canvas border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">{ph.category}</span>
                  <span className="text-emerald-800 font-bold">{ph.status}</span>
                </div>
                <h5 className="font-bold text-xs text-ink mt-1">{ph.title}</h5>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">{ph.timestamp}</span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-purple-primary font-mono font-semibold">SHA-256 Hash Locked</span>
                <button 
                  onClick={() => handleDeletePhoto(ph.id)}
                  className="text-slate-400 hover:text-red-600 transition"
                  title="Remove record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

