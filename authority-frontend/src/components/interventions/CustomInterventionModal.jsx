import React, { useState } from 'react';
import { X, PlusCircle, Wrench, Shield, Droplets, CheckCircle2, Sparkles } from 'lucide-react';
import { ROAD_CORRIDORS } from '../../data/floodData';

export default function CustomInterventionModal({ isOpen, onClose, onAddIntervention }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Active Dewatering');
  const [targetLocation, setTargetLocation] = useState(ROAD_CORRIDORS[0]?.name || 'Sion Circle');
  const [capacity, setCapacity] = useState('2,000 m³/hr');
  const [capacityNum, setCapacityNum] = useState(2000);
  const [setupTimeMin, setSetupTimeMin] = useState(15);
  const [costLakhs, setCostLakhs] = useState(2.0);
  const [deltaDepthReductionCm, setDeltaDepthReductionCm] = useState(12.5);
  const [clearanceTimeSavedHours, setClearanceTimeSavedHours] = useState(1.5);
  const [affectedRoadRelief, setAffectedRoadRelief] = useState('');
  const [powerType, setPowerType] = useState('Diesel Mobile (Tier-4)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `custom-int-${Date.now()}`;
    const newIntervention = {
      id: newId,
      name: name.trim() || `Tactical ${category} Unit`,
      targetLocation,
      category,
      capacity,
      capacityNum: Number(capacityNum),
      setupTimeMin: Number(setupTimeMin),
      status: 'DEPLOYED (CUSTOM)',
      costScore: Number(costLakhs) < 2 ? 'Low' : 'Moderate',
      costLakhs: Number(costLakhs),
      deltaDepthReductionCm: Number(deltaDepthReductionCm),
      clearanceTimeSavedHours: Number(clearanceTimeSavedHours),
      affectedRoadRelief:
        affectedRoadRelief.trim() || `Targeted countermeasure for ${targetLocation}`,
      powerType,
      coordinates: [19.05, 72.85],
      isCustom: true,
    };

    onAddIntervention(newIntervention);
    onClose();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'Active Dewatering') {
      setCapacity('2,200 m³/hr');
      setCapacityNum(2200);
      setDeltaDepthReductionCm(14.0);
      setClearanceTimeSavedHours(1.8);
      setPowerType('Diesel Mobile (Tier-4)');
    } else if (cat === 'Hydraulic Diversion') {
      setCapacity('15.0 m³/s gravity relief');
      setCapacityNum(54000);
      setDeltaDepthReductionCm(10.0);
      setClearanceTimeSavedHours(1.4);
      setPowerType('SCADA Gate Throttle');
    } else if (cat === 'Surface Water Deflection') {
      setCapacity('Deflects 1.2 m³/s street runoff');
      setCapacityNum(4320);
      setDeltaDepthReductionCm(16.5);
      setClearanceTimeSavedHours(2.2);
      setPowerType('Modular Inflatable / Sandbag');
    } else {
      setCapacity('25,000 m³ retention storage');
      setCapacityNum(12500);
      setDeltaDepthReductionCm(12.0);
      setClearanceTimeSavedHours(1.6);
      setPowerType('Gravity Siphon Tank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Configure Custom Hydraulic Countermeasure
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Inject custom mobile pumps, deflection barriers, or diversion routes into the live hydro-twin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">
              Intervention Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Active Dewatering',
                'Hydraulic Diversion',
                'Surface Water Deflection',
                'Retention Storage',
              ].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                    category === cat
                      ? 'border-purple bg-purple-soft/40 text-purple shadow-subtle'
                      : 'border-border bg-white text-ink-secondary hover:border-purple/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Intervention Name & Target Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Intervention Identifier / Name
              </label>
              <input
                type="text"
                placeholder="e.g. High-Pressure Axial Pump #9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Target Hotspot / Corridor
              </label>
              <select
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-medium"
              >
                {ROAD_CORRIDORS.map((road) => (
                  <option key={road.id} value={road.name}>
                    {road.name} ({road.ward})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Capacity, Setup time, Cost */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Flow / Retention Capacity
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-mono"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Setup Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={setupTimeMin}
                onChange={(e) => setSetupTimeMin(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-mono"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Estimated Cost (₹ Lakhs)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={costLakhs}
                onChange={(e) => setCostLakhs(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-mono"
                required
              />
            </div>
          </div>

          {/* Model Efficacy Estimates */}
          <div className="p-3.5 bg-purple-soft/30 rounded-xl border border-purple/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                PINN Hydrodynamic Solver Expected Output
              </span>
              <span className="text-[10px] font-mono text-purple">AUTO-CALIBRATED</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-ink-secondary block mb-1">
                  Peak Depth Reduction (cm)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="35"
                    step="0.5"
                    value={deltaDepthReductionCm}
                    onChange={(e) => setDeltaDepthReductionCm(e.target.value)}
                    className="flex-1 accent-purple"
                  />
                  <span className="font-mono text-xs font-bold text-status-safe w-14 text-right">
                    -{deltaDepthReductionCm} cm
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-ink-secondary block mb-1">
                  Street Clearance Saved (Hours)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={clearanceTimeSavedHours}
                    onChange={(e) => setClearanceTimeSavedHours(e.target.value)}
                    className="flex-1 accent-purple"
                  />
                  <span className="font-mono text-xs font-bold text-purple w-14 text-right">
                    +{clearanceTimeSavedHours} hrs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Relief Description & Power Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Primary Relief Impact
              </label>
              <input
                type="text"
                placeholder="e.g. Clears central carriageway for emergency ambulances"
                value={affectedRoadRelief}
                onChange={(e) => setAffectedRoadRelief(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-1 block">
                Power / Prime-Mover Spec
              </label>
              <input
                type="text"
                value={powerType}
                onChange={(e) => setPowerType(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-secondary rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Deploy & Couple with Hydrodynamic Twin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

