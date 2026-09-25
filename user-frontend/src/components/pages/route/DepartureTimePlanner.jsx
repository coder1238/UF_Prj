import React from 'react';
import { Clock, CloudRain, Waves, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TIDE_FORECAST } from '../../../data/routePresetsData';

const DEPARTURE_SLICES = [
  { id: 'now', label: 'Leave Now', offsetMin: 0, rainIntensity: '18 mm/h', tideLevelM: 3.65, surchargeFactor: 1.0 },
  { id: '15m', label: '+15 Min', offsetMin: 15, rainIntensity: '24 mm/h', tideLevelM: 3.90, surchargeFactor: 1.15 },
  { id: '30m', label: '+30 Min', offsetMin: 30, rainIntensity: '32 mm/h', tideLevelM: 4.15, surchargeFactor: 1.35 },
  { id: '1h', label: '+1 Hour', offsetMin: 60, rainIntensity: '44 mm/h', tideLevelM: 4.48, surchargeFactor: 1.70 },
  { id: '2h', label: '+2 Hours', offsetMin: 120, rainIntensity: '28 mm/h', tideLevelM: 3.80, surchargeFactor: 1.20 }
];

export default function DepartureTimePlanner({
  selectedDepartureId = 'now',
  onSelectDeparture = () => {},
  baseWaterDepth = 4
}) {
  const currentSlice = DEPARTURE_SLICES.find(s => s.id === selectedDepartureId) || DEPARTURE_SLICES[0];
  const projectedWaterDepth = Math.round(baseWaterDepth * currentSlice.surchargeFactor);
  const isHighTideLock = currentSlice.tideLevelM >= 4.2;

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">TIME-SHIFT MOBILITY ENGINE</span>
          <h3 className="text-sm font-extrabold text-ink">Departure Window & Tidal Forecast</h3>
        </div>
        <span className="text-xs font-mono font-bold text-ink bg-canvas px-2.5 py-0.5 rounded border border-border flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary" /> {currentSlice.label}
        </span>
      </div>

      <p className="text-xs text-ink-secondary">
        Monsoon cloudbursts synchronize with Arabian Sea tidal gates. Test future departure windows to avoid high-tide backflow locks.
      </p>

      {/* Departure Buttons */}
      <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
        {DEPARTURE_SLICES.map(slice => {
          const isSelected = selectedDepartureId === slice.id;
          return (
            <button
              key={slice.id}
              onClick={() => onSelectDeparture(slice.id)}
              className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                isSelected
                  ? 'bg-ink text-white border-ink font-bold shadow-sm'
                  : 'bg-canvas text-ink-secondary hover:bg-surface-secondary border-border'
              }`}
            >
              <span className="text-[11px] font-bold">{slice.label}</span>
              <span className="text-[9px] opacity-75">{slice.rainIntensity}</span>
            </button>
          );
        })}
      </div>

      {/* Projection Summary Card */}
      <div className={`p-3.5 rounded-xl border transition ${
        isHighTideLock ? 'bg-amber-50/70 border-amber-300' : 'bg-canvas border-border'
      } space-y-2`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-cyan-600" />
            <span className="font-bold text-ink">Sea Tide Level: {currentSlice.tideLevelM}m MSL</span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
            isHighTideLock ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isHighTideLock ? 'DRAIN LOCK RISK' : 'NORMAL DISCHARGE'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-secondary pt-1 border-t border-border/80">
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">Projected Water</span>
            <span className="font-extrabold text-sm text-ink">{projectedWaterDepth} cm</span>
          </div>
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">Rain Surcharge</span>
            <span className="font-bold text-ink">{currentSlice.rainIntensity}</span>
          </div>
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">Departure Advice</span>
            <span className="font-bold text-emerald-700">
              {currentSlice.offsetMin === 0 ? 'Leave Promptly' : 'Elevated Only'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
