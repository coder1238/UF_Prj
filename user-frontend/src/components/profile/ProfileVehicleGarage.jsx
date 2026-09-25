import React, { useState } from 'react';
import { 
  Car, Zap, AlertTriangle, ShieldCheck, Plus, Trash2, 
  CheckCircle2, Gauge, Compass, Info, ShieldAlert, Cpu
} from 'lucide-react';

export default function ProfileVehicleGarage({ 
  vehicles, 
  activeVehicleId, 
  onSelectActive, 
  onUpdateVehicles, 
  vehicleClearance, 
  setVehicleClearance, 
  speakAlert 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEvSafetyModal, setShowEvSafetyModal] = useState(false);
  const [selectedEv, setSelectedEv] = useState(null);

  // New vehicle form
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'hatchback',
    regNumber: '',
    clearance: 18,
    isEv: false,
    airIntakeCm: 32,
    batterySealRating: 'IP67',
    submergenceLimitMinutes: 15
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.name) return;
    const vId = 'veh-' + Date.now();
    const created = { ...newVehicle, id: vId };
    const updated = [...vehicles, created];
    onUpdateVehicles(updated);
    onSelectActive(vId);
    setVehicleClearance(created.clearance);
    setShowAddModal(false);
    setNewVehicle({
      name: '',
      type: 'hatchback',
      regNumber: '',
      clearance: 18,
      isEv: false,
      airIntakeCm: 32,
      batterySealRating: 'IP67',
      submergenceLimitMinutes: 15
    });
    speakAlert(`Vehicle ${created.name} added to garage and calibrated to ${created.clearance} cm.`);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (vehicles.length <= 1) {
      alert("You must keep at least one registered vehicle profile in your garage.");
      return;
    }
    const updated = vehicles.filter(v => v.id !== id);
    onUpdateVehicles(updated);
    if (activeVehicleId === id) {
      onSelectActive(updated[0].id);
      setVehicleClearance(updated[0].clearance);
    }
  };

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-soft text-purple-primary shadow-xs">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Multi-Vehicle Garage & EV Wading Profiler</h2>
            <p className="text-xs text-muted">
              Select or register your active daily commute vehicle. Calibrates road hydrodynamics across all routes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeVehicle?.isEv && (
            <button
              type="button"
              onClick={() => {
                setSelectedEv(activeVehicle);
                setShowEvSafetyModal(true);
              }}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>EV Ingress Protocol</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-purple-primary hover:bg-purple-deep text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicle Garage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        {vehicles.map((v) => {
          const isActive = v.id === activeVehicleId;
          return (
            <div
              key={v.id}
              onClick={() => {
                onSelectActive(v.id);
                setVehicleClearance(v.clearance);
                speakAlert(`Active vehicle switched to ${v.name}. Clearance set to ${v.clearance} cm.`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isActive
                  ? 'border-purple-primary bg-purple-soft/30 ring-2 ring-purple-primary shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-ink">{v.name}</span>
                    {v.isEv && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 text-amber-600" /> EV
                      </span>
                    )}
                  </div>
                  {isActive ? (
                    <span className="px-2 py-0.5 bg-purple-primary text-white text-[10px] font-bold rounded-full">
                      ACTIVE
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(v.id, e)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-mono text-muted space-y-0.5">
                  <div className="flex justify-between">
                    <span>Reg No:</span>
                    <span className="font-bold text-slate-700">{v.regNumber || 'MH-01-XX-0000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air / Pack Limit:</span>
                    <span className="font-bold text-slate-700">{v.airIntakeCm || v.clearance + 12} cm</span>
                  </div>
                  {v.isEv && (
                    <div className="flex justify-between text-amber-700 font-bold">
                      <span>Battery Ingress:</span>
                      <span>{v.batterySealRating || 'IP67'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Max Water Clearance:</span>
                <span className="text-base font-extrabold font-mono text-purple-primary">
                  {v.clearance} cm
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Vehicle Calibration Bar & Hydro Inundation Gauge */}
      <div className="bg-canvas p-6 rounded-2xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold block">
              Active Wading Depth Calibration: <strong className="text-ink">{activeVehicle?.name}</strong>
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Live Safe Route engine marks any street with water deeper than <strong className="text-purple-primary">{vehicleClearance} cm</strong> as impassable.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-black text-purple-primary">
              {vehicleClearance} <span className="text-sm font-sans font-medium text-slate-500">cm</span>
            </span>
          </div>
        </div>

        {/* Dynamic Water vs Vehicle Graphic */}
        <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
            <span>Ground Zero (0 cm)</span>
            <span className="text-emerald-600 font-bold">Wheel Rim (15 cm)</span>
            <span className="text-amber-600 font-bold">Exhaust/Floor (25 cm)</span>
            <span className="text-red-600 font-bold">Engine Ingress (45+ cm)</span>
          </div>

          <div className="relative h-6 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {/* Water Fill Visualizer */}
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.min(100, (vehicleClearance / 60) * 100)}%` }}
            />
            {/* Vehicle Indicator Pin */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-ink shadow-md"
              style={{ left: `${Math.min(100, (vehicleClearance / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* Range Slider */}
        <input 
          type="range"
          min="5"
          max="60"
          value={vehicleClearance}
          onChange={(e) => {
            const val = Number(e.target.value);
            setVehicleClearance(val);
            // Update in vehicles list
            const updated = vehicles.map(v => v.id === activeVehicleId ? { ...v, clearance: val } : v);
            onUpdateVehicles(updated);
          }}
          className="w-full accent-purple-primary h-2.5 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-muted mt-2">
          <span>5 cm (Low Sedan / Scooter)</span>
          <span>18 cm (Typical Hatchback)</span>
          <span>35 cm (4WD SUV / Thar)</span>
          <span>60 cm (Heavy Amphibious / Truck)</span>
        </div>
      </div>

      {/* MODAL: Add New Vehicle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6">
            <h3 className="text-lg font-bold text-ink mb-1">Add Vehicle to Garage</h3>
            <p className="text-xs text-muted mb-4">Register your car, motorcycle, EV, or cycle for route calibration.</p>

            <form onSubmit={handleAddVehicle} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Vehicle Nickname / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. White Creta SX or Ather 450X"
                  value={newVehicle.name}
                  onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Vehicle Category</label>
                  <select
                    value={newVehicle.type}
                    onChange={e => {
                      const type = e.target.value;
                      const defaults = {
                        twowheeler: 12,
                        hatchback: 18,
                        sedan: 20,
                        suv: 35,
                        walking: 15
                      };
                      setNewVehicle({ 
                        ...newVehicle, 
                        type, 
                        clearance: defaults[type] || 18,
                        airIntakeCm: (defaults[type] || 18) + 14
                      });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="twowheeler">Two-Wheeler / Scooter</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV / Offroader</option>
                    <option value="walking">Pedestrian / Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Registration Plate</label>
                  <input
                    type="text"
                    placeholder="MH-02-AB-1234"
                    value={newVehicle.regNumber}
                    onChange={e => setNewVehicle({ ...newVehicle, regNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Safe Water Wading (cm)</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={newVehicle.clearance}
                    onChange={e => setNewVehicle({ ...newVehicle, clearance: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Air Intake Height (cm)</label>
                  <input
                    type="number"
                    min="15"
                    max="100"
                    value={newVehicle.airIntakeCm}
                    onChange={e => setNewVehicle({ ...newVehicle, airIntakeCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-canvas rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVehicle.isEv}
                    onChange={e => setNewVehicle({ ...newVehicle, isEv: e.target.checked })}
                    className="w-4 h-4 accent-purple-primary rounded"
                  />
                  <span className="text-xs font-bold text-ink flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> This is an Electric Vehicle (EV / Hybrid)
                  </span>
                </label>
                {newVehicle.isEv && (
                  <p className="text-[11px] text-muted mt-1.5 pl-6">
                    Enables high-voltage automatic isolator telemetry and battery immersion warnings.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold rounded-xl transition"
                >
                  Save to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EV Submergence Safety Protocol */}
      {showEvSafetyModal && selectedEv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">EV High-Voltage Ingress Protocol</h3>
                <span className="text-xs font-mono text-muted">{selectedEv.name} • {selectedEv.batterySealRating || 'IP67 Ingress Rated'}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 block font-bold">Pyrotechnic Safety Disconnect</strong>
                  Modern EV traction batteries isolate automatically if immersion sensors detect water infiltration. Do not attempt to restart if stalled in standing water.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-ink mb-1">Standard Operating Guidelines for Mumbai Monsoons:</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Never exceed rated pack seal height ({selectedEv.clearance} cm) in moving water.</li>
                  <li>Do not plug into street EV chargers or basement charging sockets during red alerts.</li>
                  <li>In the event of vehicle flotation or loss of traction, press the 12V auxiliary power cutoff.</li>
                  <li>If battery thermal runaway smoke is detected, exit immediately and move 50m upwind.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowEvSafetyModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition"
              >
                Understood & Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

