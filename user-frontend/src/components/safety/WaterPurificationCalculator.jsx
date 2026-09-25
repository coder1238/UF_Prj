import React, { useState, useEffect } from 'react';
import { Droplets, Clock, AlertTriangle, ShieldCheck, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

export default function WaterPurificationCalculator() {
  const [litres, setLitres] = useState(10);
  const [clarity, setClarity] = useState('cloudy'); // 'clear', 'cloudy'
  const [method, setMethod] = useState('bleach'); // 'bleach', 'nadcc', 'boiling', 'sodis'

  // 30-min contact timer
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 mins
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      setTimerDone(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const resetTimer = (secs = 1800) => {
    setTimerActive(false);
    setTimerSeconds(secs);
    setTimerDone(false);
  };

  // Calculations
  const isCloudy = clarity === 'cloudy';

  // Bleach (5% Sodium Hypochlorite): 2 drops/L if clear, 4 drops/L if cloudy
  const dropsPerLitre = isCloudy ? 4 : 2;
  const totalBleachDrops = litres * dropsPerLitre;
  const bleachMl = (totalBleachDrops * 0.05).toFixed(1); // ~20 drops per ml

  // NaDCC (Sodium Dichloroisocyanurate): 1x 33mg tab per 4-5L clear, or 1 tab per 2.5L cloudy
  const nadccTabs = isCloudy ? Math.ceil(litres / 2.5) : Math.ceil(litres / 4.5);

  // Boiling
  const boilTimeMins = isCloudy ? 'Pre-filter through cloth, then 3 min rolling boil' : '1 min rolling boil';

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Droplets className="w-4 h-4" /> Feature 03: Emergency Water Chemistry & Disinfection
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Emergency Water Purification Dosing & Contact Timer
          </h2>
          <p className="text-xs text-muted mt-1">
            Calculates chemical proportions (Bleach, NaDCC Chlorine tablets, Boiling) to neutralize cholera, typhoid, and leptospirosis in flood runoff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Volume Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-700">
                Water Volume to Purify: <span className="text-blue-600 font-extrabold">{litres} Litres</span>
              </label>
              <span className="text-[11px] font-mono text-muted">
                {litres <= 5 ? 'Personal Hydration (1-2 days)' : litres <= 20 ? 'Family Jerrycan Reserve' : 'Multi-day Water Drum'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={litres}
              onChange={e => setLitres(Number(e.target.value))}
              className="w-full accent-blue-600 h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>1 Litre (Bottle)</span>
              <span>10 Litres (Bucket)</span>
              <span>25 Litres (Jerrycan)</span>
              <span>50 Litres (Drum)</span>
            </div>
          </div>

          {/* Clarity Picker */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Water Source Clarity / Turbidity</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClarity('clear')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  clarity === 'clear'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-300"></div>
                  <span className="text-xs">Clear Tap / Rainwater</span>
                </div>
                <span className="text-[10px] font-mono text-muted block mt-1">Turbidity &lt; 5 NTU</span>
              </button>

              <button
                type="button"
                onClick={() => setClarity('cloudy')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  clarity === 'cloudy'
                    ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-600"></div>
                  <span className="text-xs">Cloudy / Muddy Runoff</span>
                </div>
                <span className="text-[10px] font-mono text-muted block mt-1">Organic Silt Present (2x Dose)</span>
              </button>
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Disinfection Agent</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bleach', label: '5% Bleach (NaOCl)' },
                { id: 'nadcc', label: 'Chlorine Tabs (NaDCC)' },
                { id: 'boiling', label: 'Thermal Boiling' },
                { id: 'sodis', label: 'SODIS Solar UV' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMethod(m.id);
                    if (m.id === 'boiling') resetTimer(180);
                    else if (m.id === 'sodis') resetTimer(21600); // 6 hours
                    else resetTimer(1800); // 30 mins
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    method === m.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-canvas text-ink border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Critical Pre-Treatment Advisory */}
          {isCloudy && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">MANDATORY PRE-FILTER STEP:</strong> Turbid water contains organic silt that neutralizes chlorine biocides. Pour water through a clean 4-layer folded cotton sari or coffee filter before adding chemicals.
              </div>
            </div>
          )}
        </div>

        {/* Calculated Dosage & Biocidal Timer */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
              Calculated Biochemical Treatment Prescription
            </span>

            {method === 'bleach' && (
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-blue-900">{totalBleachDrops} Drops</span>
                <span className="text-xs font-mono text-blue-700 block mt-0.5">
                  (~{bleachMl} mL) of 5.25% unscented household chlorine bleach.
                </span>
                <p className="text-xs mt-2 text-blue-800 leading-snug">
                  Mix well and let stand for <strong>30 minutes</strong>. Water should have a faint chlorine odor. If not, repeat dose once and wait 15 more minutes.
                </p>
              </div>
            )}

            {method === 'nadcc' && (
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-blue-900">{nadccTabs} Tablet{nadccTabs > 1 ? 's' : ''}</span>
                <span className="text-xs font-mono text-blue-700 block mt-0.5">
                  (Standard 33mg NaDCC / Halazone water purification tablets).
                </span>
                <p className="text-xs mt-2 text-blue-800 leading-snug">
                  Crush and dissolve thoroughly. Keep container covered. Wait <strong>30 minutes</strong> contact kill cycle.
                </p>
              </div>
            )}

            {method === 'boiling' && (
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-blue-900">{boilTimeMins}</span>
                <p className="text-xs mt-2 text-blue-800 leading-snug">
                  A rolling boil kills all vegetative bacteria, viruses, and amoebic cysts. Allow water to cool naturally in a sanitized covered vessel.
                </p>
              </div>
            )}

            {method === 'sodis' && (
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-blue-900">6 Hours Direct Sunlight</span>
                <p className="text-xs mt-2 text-blue-800 leading-snug">
                  Fill clean PET plastic bottles (max 2L) and place horizontally on a corrugated metal roof under direct midday sun. (Requires 2 consecutive sunny days if overcast).
                </p>
              </div>
            )}
          </div>

          {/* Interactive Biocidal Contact Timer */}
          <div className="mt-4 p-4 rounded-2xl bg-canvas border border-slate-200 text-center">
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Biocidal Contact Timer
              </span>
              <span className={timerActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                {timerActive ? 'DISINFECTING...' : timerDone ? 'SAFE TO DRINK' : 'STANDBY'}
              </span>
            </div>

            <div className="text-3xl font-mono font-extrabold text-ink my-2 tracking-wider">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex justify-center gap-2 mt-3">
              {!timerActive ? (
                <button
                  onClick={() => setTimerActive(true)}
                  disabled={timerDone}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> Start Kill Cycle
                </button>
              ) : (
                <button
                  onClick={() => setTimerActive(false)}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              )}

              <button
                onClick={() => resetTimer(method === 'boiling' ? 180 : method === 'sodis' ? 21600 : 1800)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {timerDone && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                30-Minute Kill Cycle Complete. Water is potably safe.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

