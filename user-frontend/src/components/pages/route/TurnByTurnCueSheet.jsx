import React from 'react';
import { 
  ArrowUp, 
  ArrowRight, 
  ArrowLeft, 
  CornerUpRight, 
  Flag, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Layers 
} from 'lucide-react';

export default function TurnByTurnCueSheet({
  activeCorridor,
  onSelectTurn = () => {},
  selectedStep = null
}) {
  if (!activeCorridor || !activeCorridor.turns) return null;

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'straight':
        return <ArrowUp className="w-4 h-4 text-primary" />;
      case 'left':
        return <ArrowLeft className="w-4 h-4 text-blue-600" />;
      case 'right':
        return <ArrowRight className="w-4 h-4 text-emerald-600" />;
      case 'ramp-up':
        return <CornerUpRight className="w-4 h-4 text-purple-600" />;
      case 'merge':
        return <CornerUpRight className="w-4 h-4 text-amber-600" />;
      case 'flag':
        return <Flag className="w-4 h-4 text-purple-700" />;
      case 'danger':
      case 'critical':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <ArrowUp className="w-4 h-4 text-ink-muted" />;
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">HYDRO-AWARE CUE SHEET</span>
          <h3 className="text-sm font-extrabold text-ink">Turn-by-Turn Inundation Maneuvers</h3>
        </div>
        <span className="text-[11px] font-mono text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border">
          {activeCorridor.turns.length} Navigation Steps
        </span>
      </div>

      <p className="text-xs text-ink-secondary">
        Every junction displays calibrated road MSL datum, forecast water level, and bridge/flyover status.
      </p>

      {/* Maneuvers List */}
      <div className="space-y-2 mt-2 max-h-[380px] overflow-y-auto pr-1">
        {activeCorridor.turns.map((turn, idx) => {
          const isSelected = selectedStep === turn.step;
          const isHazard = turn.risk === 'critical' || turn.risk === 'danger' || turn.risk === 'warning';

          return (
            <div
              key={idx}
              onClick={() => onSelectTurn(turn)}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                isSelected 
                  ? 'border-primary bg-primary-soft/50 ring-2 ring-primary/20' 
                  : isHazard 
                  ? 'border-rose-300 bg-rose-50/50 hover:border-rose-400' 
                  : 'border-border bg-canvas/40 hover:bg-canvas hover:border-primary/40'
              }`}
            >
              {/* Maneuver Icon Box */}
              <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${
                isHazard 
                  ? 'bg-rose-100 border-rose-300' 
                  : 'bg-white border-border shadow-xs'
              }`}>
                {renderIcon(turn.icon)}
              </div>

              {/* Maneuver Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-ink-muted">
                    STEP {turn.step} • {turn.distance}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="text-ink-secondary bg-white px-1.5 py-0.5 rounded border border-border">
                      Elev: {turn.roadElev}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isHazard ? 'bg-rose-200 text-rose-900' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Water: {turn.depth}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-ink mt-1 leading-snug">
                  {turn.instruction}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

