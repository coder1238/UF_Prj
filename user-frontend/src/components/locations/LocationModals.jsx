import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Car, 
  Phone, 
  Compass,
  FileText,
  Columns
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

/* =======================================================================
   FEATURE 9: Geo-Fence Alert Settings Modal & Siren Synthesizer
   ======================================================================= */
export function LocationAlertSettingsModal({ place, onClose, onSave }) {
  const [depthThreshold, setDepthThreshold] = useState(place.alertThresholdCm || 15);
  const [rateOfRiseAlert, setRateOfRiseAlert] = useState(true);
  const [tideWarningAlert, setTideWarningAlert] = useState(true);
  const [channels, setChannels] = useState({
    push: true,
    sms: true,
    whatsapp: true,
    audioSiren: true
  });
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);

  // Web Audio API Synthesizer Siren Test
  const playSirenTest = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);

      // Pitch sweep up and down
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, audioCtx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.8);
      osc.frequency.linearRampToValueAtTime(950, audioCtx.currentTime + 1.2);
      osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 1.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      setIsPlayingSiren(true);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.7);

      setTimeout(() => {
        setIsPlayingSiren(false);
      }, 1700);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  };

  const handleSave = () => {
    onSave({
      ...place,
      alertThresholdCm: depthThreshold,
      rateOfRiseAlert,
      tideWarningAlert,
      channels
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-primary">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">Geo-Fence Alert Thresholds</h3>
              <p className="text-xs text-muted font-mono">{place.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Depth Slider */}
          <div className="bg-canvas p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink">Water Depth Alert Trigger</span>
              <span className="text-xs font-mono font-extrabold text-purple-primary bg-purple-100 px-2 py-0.5 rounded-md">
                Alert at ≥ {depthThreshold} cm
              </span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5"
              value={depthThreshold}
              onChange={(e) => setDepthThreshold(Number(e.target.value))}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
              <span>Curb depth (5cm)</span>
              <span>Ankle deep (15cm)</span>
              <span>Knee deep (40cm)</span>
            </div>
          </div>

          {/* Additional Smart Triggers */}
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <span className="text-xs font-medium text-ink">Flash Inundation Alert (Rate of rise &gt; 5cm in 15 mins)</span>
              <input 
                type="checkbox" 
                checked={rateOfRiseAlert} 
                onChange={(e) => setRateOfRiseAlert(e.target.checked)}
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <span className="text-xs font-medium text-ink">High Tide Surge Coincidence Warning (Tide &gt; 3.8m MSL)</span>
              <input 
                type="checkbox" 
                checked={tideWarningAlert} 
                onChange={(e) => setTideWarningAlert(e.target.checked)}
                className="w-4 h-4 accent-purple-primary rounded" 
              />
            </label>
          </div>

          {/* Delivery Channels */}
          <div>
            <span className="text-xs font-mono text-muted uppercase block mb-2">Delivery Channels</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(channels).map(ch => (
                <label key={ch} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium capitalize cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={channels[ch]} 
                    onChange={() => setChannels(prev => ({ ...prev, [ch]: !prev[ch] }))}
                    className="w-3.5 h-3.5 accent-purple-primary rounded"
                  />
                  <span>{ch === 'audioSiren' ? 'Critical Siren' : ch}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Siren Sound Test */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-primary" />
              <span className="text-xs font-semibold text-purple-deep">Audible Warning Siren</span>
            </div>
            <button 
              type="button" 
              onClick={playSirenTest}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isPlayingSiren ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-primary text-white hover:bg-purple-deep'
              }`}
            >
              {isPlayingSiren ? 'Sounding Siren...' : 'Test Siren Audio'}
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="px-5 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold shadow-sm"
          >
            Save Alert Thresholds
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================================================================
   FEATURE 14: Side-by-Side Multi-Location Comparison Drawer
   ======================================================================= */
export function LocationComparisonModal({ places, selectedId, onSelectPlace, onClose }) {
  // Sort priority by peakDepth descending
  const sortedPlaces = [...places].sort((a, b) => b.peakDepth - a.peakDepth);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-primary">
              <Columns className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-ink">All Saved Locations — Comparative Risk Matrix</h3>
              <p className="text-xs text-muted">Comparative vulnerability analysis across your {places.length} monitored sites</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Comparison */}
        <div className="overflow-x-auto flex-1 my-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-muted font-mono uppercase text-[10px] bg-slate-50/80">
                <th className="p-3">Rank / Location</th>
                <th className="p-3">Category</th>
                <th className="p-3">Ward</th>
                <th className="p-3">Elevation</th>
                <th className="p-3">Water Now</th>
                <th className="p-3">Peak Forecast</th>
                <th className="p-3">Time to Peak</th>
                <th className="p-3">Severity</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPlaces.map((pl, idx) => {
                const isSelected = pl.id === selectedId;
                return (
                  <tr key={pl.id} className={isSelected ? 'bg-purple-50/60 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-center text-[10px] font-mono leading-5 font-bold ${
                          idx === 0 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-ink">{pl.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{pl.type}</td>
                    <td className="p-3 font-mono text-slate-600">{pl.ward}</td>
                    <td className="p-3 font-mono font-bold text-slate-700">{pl.elevation}</td>
                    <td className="p-3 font-mono font-bold text-ink">{pl.currentDepth} cm</td>
                    <td className="p-3 font-mono font-bold text-purple-primary">{pl.peakDepth} cm</td>
                    <td className="p-3 font-mono text-slate-700">+{pl.peakArrivalMin} m</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        pl.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        pl.riskLevel === 'danger' ? 'bg-orange-100 text-orange-800' :
                        pl.riskLevel === 'moderate' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pl.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => {
                          onSelectPlace(pl.id);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isSelected ? 'bg-purple-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Priority Focus: <span className="font-bold">{sortedPlaces[0]?.name}</span> faces highest peak inundation ({sortedPlaces[0]?.peakDepth}cm).
          </span>
          <button onClick={onClose} className="px-4 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-xl transition">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================================================================
   FEATURE 15: Citizen Basin Flood Safety Audit Card (Print / Export)
   ======================================================================= */
export function LocationAuditReportModal({ place, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-primary">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-ink">Citizen Basin Flood Risk Audit Card</h3>
              <p className="text-xs text-muted font-mono">Issued by the HydroSense Citizen Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Content */}
        <div className="space-y-6 text-xs text-ink print:text-black">
          {/* Metadata Block */}
          <div className="p-4 bg-canvas rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-ink">{place.name}</span>
              <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 bg-slate-200 rounded">
                Risk: {place.riskLevel}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-600">
              <div>Ward: <span className="font-bold text-ink">{place.ward}</span></div>
              <div>Elevation: <span className="font-bold text-ink">{place.elevation}</span></div>
              <div>Drain Dist: <span className="font-bold text-ink">{place.drainageDistance}</span></div>
              <div>Audit Date: <span className="font-bold text-ink">23 Sep 2026</span></div>
            </div>
          </div>

          {/* Current vs Peak Hydrodynamics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-muted uppercase block">Current Water Depth</span>
              <span className="text-xl font-mono font-bold text-ink mt-0.5 block">{place.currentDepth} cm</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-muted uppercase block">Predicted Peak Depth</span>
              <span className="text-xl font-mono font-bold text-purple-primary mt-0.5 block">{place.peakDepth} cm</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-muted uppercase block">Peak Lead Window</span>
              <span className="text-xl font-mono font-bold text-slate-700 mt-0.5 block">+{place.peakArrivalMin} mins</span>
            </div>
          </div>

          {/* Structural Safeguards Checklist */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-2 font-mono">
              Mandatory Structural Safeguards
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 leading-relaxed">
              <li>Deploy aluminium/sandbag barricades if road water exceeds 15cm.</li>
              <li>Isolate ground electrical distribution panel and stilt parking car chargers before peak depth.</li>
              <li>Keep elevator cars parked on 2nd floor or above with hoistway sump pumps active.</li>
              <li>Seal underground drinking water sump inspection hatches with gasket clamps.</li>
            </ul>
          </div>

          {/* Emergency Ward Contacts */}
          <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2">
            <span className="font-bold text-xs text-purple-deep flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Emergency Contacts for {place.ward}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-purple-900">
              <div>BMC Central Disaster Cell: <span className="font-bold">1916</span></div>
              <div>Ward Control Room: <span className="font-bold">022-24024000</span></div>
              <div>Fire Emergency: <span className="font-bold">101</span></div>
              <div>Flood Rescue Boat Unit: <span className="font-bold">022-22694725</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Close Audit Card
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================================================================
   Add / Edit Location Modal
   ======================================================================= */
export function LocationEditModal({ place, onClose, onSave }) {
  const isEditing = Boolean(place);
  const [name, setName] = useState(place?.name || '');
  const [type, setType] = useState(place?.type || 'Home');
  const [ward, setWard] = useState(place?.ward || 'F-North');
  const [elevation, setElevation] = useState(place?.elevation ? parseFloat(place.elevation) : 5.5);
  const [drainageDistance, setDrainageDistance] = useState(place?.drainageDistance || '60m from local storm drain');
  const [alertThresholdCm, setAlertThresholdCm] = useState(place?.alertThresholdCm || 15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: place?.id || `loc-${Date.now()}`,
      name: name.trim(),
      type,
      ward,
      elevation: `+${elevation.toFixed(1)}m MSL`,
      drainageDistance,
      currentDepth: place?.currentDepth || 6,
      peakDepth: place?.peakDepth || Math.round(10 + Math.random() * 20),
      peakArrivalMin: place?.peakArrivalMin || 65,
      riskLevel: elevation < 5.0 ? 'danger' : elevation < 8.0 ? 'moderate' : 'safe',
      alertActive: place?.alertActive ?? true,
      lastInspected: 'Just now',
      alertThresholdCm
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-base font-bold text-ink">
            {isEditing ? 'Edit Monitored Location' : 'Add New Monitored Location'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-mono text-muted mb-1 font-bold">Location Name / Label</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Grandma's Flat, Bandra West Office"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-muted mb-1 font-bold">Category</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary"
              >
                <option value="Home">Home</option>
                <option value="Office">Office / Workplace</option>
                <option value="School">School / College</option>
                <option value="Family">Family / Parents</option>
                <option value="Shop">Shop / Commercial</option>
                <option value="Warehouse">Warehouse / Godown</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-muted mb-1 font-bold">Administrative Ward</label>
              <select 
                value={ward} 
                onChange={e => setWard(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary"
              >
                {WARDS_DATA.map(w => (
                  <option key={w.id} value={w.name.split(' — ')[0].replace('Ward ', '')}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-muted mb-1 font-bold">Elevation (Meters MSL)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.5" 
                max="35.0" 
                value={elevation} 
                onChange={e => setElevation(parseFloat(e.target.value) || 5.0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-muted mb-1 font-bold">Alert Trigger (cm)</label>
              <input 
                type="number" 
                min="5" 
                max="60" 
                step="5" 
                value={alertThresholdCm} 
                onChange={e => setAlertThresholdCm(parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-muted mb-1 font-bold">Storm Drain Proximity Landmark</label>
            <input 
              type="text" 
              value={drainageDistance} 
              onChange={e => setDrainageDistance(e.target.value)}
              placeholder="e.g. 50m from Hindmata Box Drain"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold shadow-sm"
          >
            {isEditing ? 'Save Changes' : 'Add to Watchlist'}
          </button>
        </div>
      </form>
    </div>
  );
}
