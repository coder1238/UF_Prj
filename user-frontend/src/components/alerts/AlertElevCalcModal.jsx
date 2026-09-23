import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, AlertTriangle, ArrowRight, Building, Car, Home } from 'lucide-react';

export default function AlertElevCalcModal({ onClose }) {
  const [floorLevel, setFloorLevel] = useState('ground'); // 'basement' | 'ground' | 'first' | 'higher'
  const [parkingType, setParkingType] = useState('basement'); // 'basement' | 'stilt' | 'street' | 'elevated'
  const [drainProximity, setDrainProximity] = useState('close'); // 'close' | 'medium' | 'far'
  const [wardTerrain, setWardTerrain] = useState('basin'); // 'basin' | 'coastal' | 'elevated'

  // Calculate Submersion Risk Score (0-100)
  const calculateRisk = () => {
    let score = 20;
    if (floorLevel === 'basement') score += 45;
    else if (floorLevel === 'ground') score += 28;
    else if (floorLevel === 'first') score += 10;
    else score += 2;

    if (parkingType === 'basement') score += 30;
    else if (parkingType === 'street') score += 22;
    else if (parkingType === 'stilt') score += 14;
    else score += 0;

    if (drainProximity === 'close') score += 18;
    else if (drainProximity === 'medium') score += 8;

    if (wardTerrain === 'basin') score += 15;
    else if (wardTerrain === 'coastal') score += 10;

    return Math.min(99, score);
  };

  const riskScore = calculateRisk();

  const getRiskCategory = (score) => {
    if (score >= 75) return { label: 'CRITICAL SUBMERSION THREAT', color: 'text-red-600 bg-red-50 border-red-200' };
    if (score >= 50) return { label: 'HIGH RISK ZONE', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 30) return { label: 'MODERATE VULNERABILITY', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    return { label: 'LOW RISK / RESILIENT', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const category = getRiskCategory(riskScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold">Submersion Risk & Floor Elevation Calculator</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs text-slate-600">
            Calculate your property's specific hydraulic flood vulnerability based on living floor elevation, vehicle parking location, and storm drain proximity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Living Floor */}
            <div>
              <label className="text-xs font-mono text-muted block mb-1.5 font-bold flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-purple-primary" /> Dwelling / Flat Floor
              </label>
              <select
                value={floorLevel}
                onChange={e => setFloorLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                <option value="basement">Basement / Semi-basement (-1)</option>
                <option value="ground">Ground Floor / Stilt Level (0)</option>
                <option value="first">1st Floor (+3 meters)</option>
                <option value="higher">2nd Floor or Above (&gt;6 meters)</option>
              </select>
            </div>

            {/* Parking Location */}
            <div>
              <label className="text-xs font-mono text-muted block mb-1.5 font-bold flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-purple-primary" /> Vehicle Parking Location
              </label>
              <select
                value={parkingType}
                onChange={e => setParkingType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                <option value="basement">Underground Basement Parking</option>
                <option value="street">Open Street Curb / Road Level</option>
                <option value="stilt">Building Stilt / Plinth Level</option>
                <option value="elevated">Upper Deck / Elevated Podium</option>
              </select>
            </div>

            {/* Drain Proximity */}
            <div>
              <label className="text-xs font-mono text-muted block mb-1.5 font-bold">
                Storm Drain / Nullah Distance
              </label>
              <select
                value={drainProximity}
                onChange={e => setDrainProximity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                <option value="close">Within 100 meters (High Surcharge)</option>
                <option value="medium">100 - 300 meters away</option>
                <option value="far">Greater than 300 meters</option>
              </select>
            </div>

            {/* Terrain Basin */}
            <div>
              <label className="text-xs font-mono text-muted block mb-1.5 font-bold">
                Local Catchment Topography
              </label>
              <select
                value={wardTerrain}
                onChange={e => setWardTerrain(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                <option value="basin">Depression Basin (Hindmata / Kurla)</option>
                <option value="coastal">Coastal Confluence Zone (BKC / Worli)</option>
                <option value="elevated">Naturally Elevated Ridge (Malabar Hill)</option>
              </select>
            </div>
          </div>

          {/* Results Card */}
          <div className={`p-5 rounded-2xl border ${category.color} transition-all`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">
                  Calculated Vulnerability Index
                </span>
                <h4 className="text-base font-extrabold">{category.label}</h4>
              </div>
              <div className="text-right">
                <span className="text-3xl font-mono font-extrabold">{riskScore}%</span>
                <span className="text-[10px] block opacity-80">Submersion Probability</span>
              </div>
            </div>

            {/* Tailored Directives */}
            <div className="space-y-1.5 pt-2 border-t border-current/20 text-xs">
              <span className="font-bold block uppercase text-[10px] tracking-wider mb-1">
                Prescribed Safety Actions:
              </span>
              {parkingType === 'basement' && (
                <p className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <strong>URGENT:</strong> Move vehicles immediately out of basement to upper podium before water ingress.
                </p>
              )}
              {floorLevel === 'ground' && (
                <p className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Elevate electrical appliances and switch off main floor circuit breaker if water reaches doorstep.
                </p>
              )}
              {floorLevel === 'basement' && (
                <p className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <strong>EVACUATE BASEMENT:</strong> High risk of drowning and trapped exits if storm drainage flaps seal.
                </p>
              )}
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                Keep go-bag ready near the primary exit with medical supplies and drinking water.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

