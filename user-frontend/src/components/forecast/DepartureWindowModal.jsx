import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Navigation, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Car, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';
import { WARDS_DATA, VEHICLE_PROFILES } from '../../data/floodData';
import { useNavigation } from '../../context/NavigationContext';

export default function DepartureWindowModal({ isOpen, onClose, currentWard, vehicleType }) {
  const { navigateTo } = useNavigation();
  const [selectedDepartureMin, setSelectedDepartureMin] = useState(15);
  const [destWardId, setDestWardId] = useState('ward-h-west'); // Bandra

  if (!isOpen) return null;

  const currentVehicle = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.sedan;
  const destWard = WARDS_DATA.find(w => w.id === destWardId) || WARDS_DATA[3];

  // Dynamic calculation based on departure minute
  let safetyStatus = 'SAFE';
  let title = 'Recommended Departure Window';
  let message = 'Route corridor is dry and unobstructed for your vehicle type.';
  let expectedBottleNeckDepth = 4;
  let statusColor = 'emerald';

  if (selectedDepartureMin >= 60) {
    safetyStatus = 'DANGEROUS';
    title = 'DO NOT DEPART — High Risk of Hydro-Lock';
    message = `By +${selectedDepartureMin}m, peak flood surge along low corridors will exceed your vehicle clearance (${currentVehicle.clearanceCm}cm).`;
    expectedBottleNeckDepth = 34;
    statusColor = 'red';
  } else if (selectedDepartureMin >= 30) {
    safetyStatus = 'CAUTION';
    title = 'Marginal Travel Window — Tight Timeline';
    message = `Surface ponding increasing to 18cm near underpasses. Drive on high camber lanes and depart without delay.`;
    expectedBottleNeckDepth = 19;
    statusColor = 'amber';
  } else {
    safetyStatus = 'SAFE';
    title = 'Ideal Departure Window';
    message = `Depart now or within next 20 minutes to reach destination before peak drainage surcharge.`;
    expectedBottleNeckDepth = 8;
    statusColor = 'emerald';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-soft text-purple-deep">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                AI TRAVEL ADVISORY ENGINE
              </span>
              <h2 className="text-lg font-bold text-ink">
                Can I Travel? Departure Advisor
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Controls: Intended Departure & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold text-ink-muted uppercase block mb-1.5">
                Intended Departure Time
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-bold">
                {[
                  { label: 'Now', min: 0 },
                  { label: '+15m', min: 15 },
                  { label: '+30m', min: 30 },
                  { label: '+60m', min: 60 }
                ].map(item => (
                  <button
                    key={item.min}
                    onClick={() => setSelectedDepartureMin(item.min)}
                    className={`py-2 rounded-xl border transition ${
                      selectedDepartureMin === item.min
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white border-border text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-ink-muted uppercase block mb-1.5">
                Destination Ward / Area
              </label>
              <select
                value={destWardId}
                onChange={(e) => setDestWardId(e.target.value)}
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {WARDS_DATA.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-2xl border ${
            statusColor === 'emerald' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : statusColor === 'amber'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-red-50 border-red-300 text-red-950'
          } space-y-2`}>
            <div className="flex items-center gap-2">
              {statusColor === 'emerald' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : statusColor === 'amber' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <h3 className="font-extrabold text-sm">{title}</h3>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {message}
            </p>
          </div>

          {/* Route Metrics Breakdown */}
          <div className="bg-canvas p-4 rounded-2xl border border-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-ink-muted uppercase text-[10px]">CURRENT CORRIDOR</span>
              <span className="font-bold text-ink">{currentWard?.name || 'Kurla Basin'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-ink-muted uppercase text-[10px]">VEHICLE THRESHOLD</span>
              <span className="font-bold text-purple-primary">{currentVehicle.label} ({currentVehicle.clearanceCm}cm)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-ink-muted uppercase text-[10px]">MAX FORECASTED DEPTH ON ROUTE</span>
              <span className={`font-bold ${expectedBottleNeckDepth > currentVehicle.clearanceCm ? 'text-red-600' : 'text-emerald-700'}`}>
                {expectedBottleNeckDepth} cm
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted uppercase text-[10px]">OPTIMAL CLEARANCE WINDOW</span>
              <span className="font-bold text-ink">Depart before 21:15 or after 23:40</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-border text-xs font-bold rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              navigateTo('route');
            }}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Open Dynamic Safe Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

