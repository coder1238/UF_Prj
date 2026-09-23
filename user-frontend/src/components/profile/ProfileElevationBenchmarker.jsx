import React, { useState } from 'react';
import { 
  Building2, Home, Layers, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowUpRight, TrendingUp, Sliders, Info
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

export default function ProfileElevationBenchmarker({ 
  elevationProfile, 
  onUpdateElevation, 
  currentWardId, 
  speakAlert 
}) {
  const currentWard = WARDS_DATA.find(w => w.id === currentWardId) || WARDS_DATA[0];

  // Ward water level baseline simulation in cm
  const wardWaterLevelCm = currentWard.vulnLevel === 'High' ? 38 : currentWard.vulnLevel === 'Moderate' ? 18 : 6;

  const [data, setData] = useState({
    plinthHeightCm: elevationProfile.plinthHeightCm ?? 45,
    floorLevel: elevationProfile.floorLevel ?? 4, // 0 = ground, -1 = basement
    hasBasementParking: elevationProfile.hasBasementParking ?? true,
    basementRampBermCm: elevationProfile.basementRampBermCm ?? 20,
    sumpPumpInstalled: elevationProfile.sumpPumpInstalled ?? true,
    sumpCapacityLpm: elevationProfile.sumpCapacityLpm ?? 450,
    structureType: elevationProfile.structureType ?? 'High-Rise RCC'
  });

  const handleChange = (field, val) => {
    const updated = { ...data, [field]: val };
    setData(updated);
    onUpdateElevation(updated);
  };

  // Calculations
  const isBasementAtRisk = data.hasBasementParking && wardWaterLevelCm > data.basementRampBermCm;
  const isGroundFloorAtRisk = data.floorLevel === 0 && wardWaterLevelCm > data.plinthHeightCm;
  const residenceSafetyStatus = data.floorLevel > 0 
    ? 'Safe (Elevated Upper Floor)' 
    : isGroundFloorAtRisk 
      ? 'Inundation Hazard Expected' 
      : 'Protected by Plinth Elevation';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-soft text-purple-primary shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Home & Workplace Elevation Benchmarking</h2>
            <p className="text-xs text-muted">
              LiDAR Digital Terrain Model (DTM) cross-referencing your residence plinth and parking floor against ward gauge forecasts.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-mono font-bold self-start sm:self-center">
          {currentWard.name} Live Gauge: <strong className="text-purple-primary">{wardWaterLevelCm} cm</strong>
        </span>
      </div>

      {/* Residence Risk Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Living Quarters Card */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isGroundFloorAtRisk 
            ? 'bg-red-50 border-red-200 text-red-900' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          {isGroundFloorAtRisk ? (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block font-mono">
              Residence Living Quarters Status
            </span>
            <div className="text-sm font-extrabold mt-0.5">
              {residenceSafetyStatus}
            </div>
            <p className="text-[11px] mt-1 opacity-90">
              {data.floorLevel > 0 
                ? `Located on Floor ${data.floorLevel}. Safe from flood ingress even during high tide surges.`
                : isGroundFloorAtRisk
                  ? `Street flood (${wardWaterLevelCm} cm) exceeds plinth clearance (${data.plinthHeightCm} cm) by ${wardWaterLevelCm - data.plinthHeightCm} cm!`
                  : `Ground plinth is ${data.plinthHeightCm - wardWaterLevelCm} cm above projected street peak.`}
            </p>
          </div>
        </div>

        {/* Basement / Parking Card */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isBasementAtRisk 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          {isBasementAtRisk ? (
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block font-mono">
              Parking & Basement Sump Risk
            </span>
            <div className="text-sm font-extrabold mt-0.5">
              {data.hasBasementParking 
                ? (isBasementAtRisk ? 'Basement Inundation Warning' : 'Basement Berm Protected') 
                : 'Stilt / Open-Ground Parking'}
            </div>
            <p className="text-[11px] mt-1 opacity-90">
              {data.hasBasementParking
                ? isBasementAtRisk
                  ? `Water level (${wardWaterLevelCm} cm) crests over entry ramp hump (${data.basementRampBermCm} cm). Move cars immediately!`
                  : `Entry ramp berm of ${data.basementRampBermCm} cm provides barrier margin against street runoff.`
                : 'No underground basement risk. Vehicles parked at surface stilt level.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Calibration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-canvas p-5 rounded-2xl border border-slate-200/80">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Residential Floor Level</label>
          <select
            value={data.floorLevel}
            onChange={(e) => handleChange('floorLevel', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-primary/30"
          >
            <option value={0}>Ground Floor (Plinth sensitive)</option>
            <option value={1}>1st Floor (~3.5m above ground)</option>
            <option value={2}>2nd Floor</option>
            <option value={3}>3rd Floor</option>
            <option value={4}>4th Floor or Higher</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
            Plinth Elevation Above Road ({data.plinthHeightCm} cm)
          </label>
          <input 
            type="range"
            min="0"
            max="120"
            value={data.plinthHeightCm}
            onChange={(e) => handleChange('plinthHeightCm', Number(e.target.value))}
            className="w-full accent-purple-primary h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
            <span>Road Level (0 cm)</span>
            <span>45 cm (Standard)</span>
            <span>120 cm (Raised Stilt)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Building Structural Type</label>
          <select
            value={data.structureType}
            onChange={(e) => handleChange('structureType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="High-Rise RCC">High-Rise RCC Framed</option>
            <option value="Low-Rise Apartment">Low-Rise Masonry Apartment</option>
            <option value="Chawl / Row House">Chawl / Row House Structure</option>
            <option value="Independent Bungalow">Independent Villa / Bungalow</option>
          </select>
        </div>

        {/* Basement Toggle */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink block">Basement Parking Present</span>
            <span className="text-[11px] text-muted">Underground vehicle stack</span>
          </div>
          <input
            type="checkbox"
            checked={data.hasBasementParking}
            onChange={(e) => handleChange('hasBasementParking', e.target.checked)}
            className="w-4 h-4 accent-purple-primary rounded"
          />
        </div>

        {data.hasBasementParking && (
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
              Ramp Retaining Berm / Hump ({data.basementRampBermCm} cm)
            </label>
            <input 
              type="range"
              min="0"
              max="60"
              value={data.basementRampBermCm}
              onChange={(e) => handleChange('basementRampBermCm', Number(e.target.value))}
              className="w-full accent-purple-primary h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
            />
          </div>
        )}

        {/* Sump Pump Toggle */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink block">Automatic Sump Pump</span>
            <span className="text-[11px] text-muted">Dewatering backup generator</span>
          </div>
          <input
            type="checkbox"
            checked={data.sumpPumpInstalled}
            onChange={(e) => handleChange('sumpPumpInstalled', e.target.checked)}
            className="w-4 h-4 accent-purple-primary rounded"
          />
        </div>
      </div>
    </div>
  );
}

