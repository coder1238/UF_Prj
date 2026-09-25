import React, { useState } from 'react';
import { ThermometerSnowflake, ShieldAlert, Heart, Clock, Users, Activity, Info } from 'lucide-react';

export default function HypothermiaSurvivalMatrix() {
  const [waterTemp, setWaterTemp] = useState(20); // 5 to 28 deg C
  const [posture, setPosture] = useState('help'); // 'swim', 'tread', 'help', 'huddle'
  const [clothing, setClothing] = useState('normal'); // 'minimal', 'normal', 'insulated'

  const postures = {
    swim: { label: 'Active Swimming', heatLossFactor: 1.45, desc: 'Increases peripheral blood flow; dumps heat 45% faster' },
    tread: { label: 'Treading Water', heatLossFactor: 1.25, desc: 'Continuous arm/leg movement drains muscular glycogen' },
    help: { label: 'H.E.L.P. Posture', heatLossFactor: 0.65, desc: 'Knees to chest, arms folded tight; shields femoral arteries' },
    huddle: { label: 'Group Huddle', heatLossFactor: 0.50, desc: 'Chests pressed together; shares body warmth and shields vitals' }
  };

  const clothingConfigs = {
    minimal: { label: 'Light T-Shirt / Shorts', insulationFactor: 1.0 },
    normal: { label: 'Full Pants & Cotton Shirt', insulationFactor: 0.82 },
    insulated: { label: 'Rain Jacket / Woolen Layer', insulationFactor: 0.65 }
  };

  const curPosture = postures[posture];
  const curClothing = clothingConfigs[clothing];

  // Baseline time to exhaustion/unconsciousness based on temperature (hours)
  let baseExhaustionMins = 0;
  if (waterTemp < 10) baseExhaustionMins = 30;
  else if (waterTemp < 15) baseExhaustionMins = 60;
  else if (waterTemp < 20) baseExhaustionMins = 180;
  else if (waterTemp < 25) baseExhaustionMins = 360;
  else baseExhaustionMins = 720;

  // Dexterity loss happens much faster (minutes)
  let baseDexterityMins = 0;
  if (waterTemp < 10) baseDexterityMins = 5;
  else if (waterTemp < 15) baseDexterityMins = 12;
  else if (waterTemp < 20) baseDexterityMins = 30;
  else if (waterTemp < 25) baseDexterityMins = 60;
  else baseDexterityMins = 120;

  // Apply modifiers
  const effectiveSurvivalMins = Math.round(baseExhaustionMins / (curPosture.heatLossFactor * curClothing.insulationFactor));
  const effectiveDexterityMins = Math.round(baseDexterityMins / (curPosture.heatLossFactor * curClothing.insulationFactor));

  const formatHours = (mins) => {
    if (mins < 60) return `${mins} mins`;
    const h = (mins / 60).toFixed(1);
    return `${h} hours`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-700 uppercase tracking-wider">
            <ThermometerSnowflake className="w-4 h-4" /> Feature 07: Thermal Survival Physiology
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Cold Water Immersion & Hypothermia Survival Estimator
          </h2>
          <p className="text-xs text-muted mt-1">
            Models the 1-10-1 survival timeline based on water temperature, posture thermodynamics (H.E.L.P.), and garment boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Water Temperature Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Floodwater Temperature: <span className="text-cyan-700 font-extrabold">{waterTemp}°C</span> ({((waterTemp * 9/5) + 32).toFixed(0)}°F)
              </label>
              <span className="text-[11px] font-mono text-muted">
                {waterTemp <= 10 ? 'Near Freezing Torrent' : waterTemp <= 18 ? 'Chilled Mountain Runoff' : waterTemp <= 24 ? 'Monsoon Deluge Water' : 'Warm Standing Water'}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="28"
              step="1"
              value={waterTemp}
              onChange={e => setWaterTemp(Number(e.target.value))}
              className="w-full accent-cyan-600 h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>5°C (Extreme Cold Shock)</span>
              <span>15°C (Rapid Heat Drain)</span>
              <span>22°C (Monsoon Puddles)</span>
              <span>28°C (Warm)</span>
            </div>
          </div>

          {/* Survival Posture Picker */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Immersion Posture</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(postures).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setPosture(k)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    posture === k
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{v.label}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {v.heatLossFactor < 1 ? `-${Math.round((1 - v.heatLossFactor) * 100)}% Heat Loss` : `+${Math.round((v.heatLossFactor - 1) * 100)}% Heat Loss`}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans text-muted block mt-1 leading-snug">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clothing Type */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Clothing / Insulation Layer</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(clothingConfigs).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setClothing(k)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    clothing === k
                      ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
                      : 'bg-canvas text-ink border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estimated Survival Indicators */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 block">
              Estimated Conscious Survival Thresholds
            </span>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-xs font-mono text-cyan-800 block">Manual Dexterity Window</span>
                <span className="text-2xl font-extrabold text-cyan-900">
                  {formatHours(effectiveDexterityMins)}
                </span>
                <span className="text-[11px] text-cyan-800 block mt-0.5">
                  Time until fingers stiffen; victims lose ability to grip thrown lifebuoys or tie knots.
                </span>
              </div>

              <div className="pt-3 border-t border-cyan-200">
                <span className="text-xs font-mono text-cyan-800 block">Expected Survival Time</span>
                <span className="text-3xl font-extrabold text-cyan-900">
                  ~{formatHours(effectiveSurvivalMins)}
                </span>
                <span className="text-[11px] text-cyan-800 block mt-0.5">
                  Until core temperature reaches 30°C (moderate-to-severe hypothermia).
                </span>
              </div>
            </div>
          </div>

          {/* 1-10-1 Protocol Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              Universal 1-10-1 Survival Law
            </span>
            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div><strong className="text-white">1 Minute:</strong> Calm cold shock gasp; do not inhale water.</div>
              <div><strong className="text-white">10 Minutes:</strong> Use remaining finger dexterity to secure self or exit.</div>
              <div><strong className="text-white">1 Hour:</strong> Hypothermia onset; adopt H.E.L.P. posture to delay exhaustion.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

