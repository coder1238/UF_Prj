import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Gauge, Radio, Volume2, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RouteDrivingSimulator({
  isSimulating,
  setIsSimulating,
  simulatedProgress,
  setSimulatedProgress,
  activeCorridor,
  vehicleClearance = 15,
  onVoicePrompt = () => {}
}) {
  const [speedMultiplier, setSpeedMultiplier] = React.useState(1); // 1x, 2x, 4x

  // Animation ticker for virtual test drive
  useEffect(() => {
    let animFrame;
    if (isSimulating) {
      const step = () => {
        setSimulatedProgress(prev => {
          const delta = 0.0015 * speedMultiplier;
          if (prev + delta >= 1) {
            setIsSimulating(false);
            onVoicePrompt("You have arrived at your destination via the safe elevated corridor.");
            return 1;
          }
          return prev + delta;
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isSimulating, speedMultiplier]);

  const currentKm = (simulatedProgress * (activeCorridor?.distanceKm || 11.4)).toFixed(1);
  const totalKm = activeCorridor?.distanceKm || 11.4;
  const currentSpeed = isSimulating ? Math.round(35 * speedMultiplier) : 0;

  // Find approximate water depth at current progress
  const profile = activeCorridor?.elevationProfile || [];
  const currentStation = profile.find(p => p.km >= currentKm) || profile[profile.length - 1] || { depth: 0, roadElevation: 22 };
  const waterDepthUnderTires = currentStation.depth || 0;
  const isDepthExceeded = waterDepthUnderTires > vehicleClearance;

  const handleTogglePlay = () => {
    if (!isSimulating && simulatedProgress >= 1) {
      setSimulatedProgress(0);
    }
    setIsSimulating(!isSimulating);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulatedProgress(0);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-soft text-primary-deep flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">VIRTUAL TEST DRIVE</span>
            <h4 className="text-xs font-bold text-ink">Corridor Inundation Simulator</h4>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
              isSimulating
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'Pause Drive' : simulatedProgress >= 1 ? 'Replay Drive' : 'Simulate Drive'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl border border-border bg-canvas hover:bg-surface-secondary text-ink-secondary transition"
            title="Reset to Origin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center border border-border rounded-xl overflow-hidden text-[10px] font-mono">
            {[1, 2, 4].map(spd => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-1 font-bold transition ${
                  speedMultiplier === spd ? 'bg-ink text-white' : 'bg-canvas text-ink-muted hover:text-ink'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Track Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-secondary">
          <span>Odometer: <strong className="text-ink">{currentKm} / {totalKm} km</strong></span>
          <span>Simulation: <strong>{Math.round(simulatedProgress * 100)}%</strong></span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.005"
          value={simulatedProgress}
          onChange={(e) => setSimulatedProgress(parseFloat(e.target.value))}
          className="w-full h-2 bg-canvas rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Real-time Telemetry Gauges */}
      <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
        <div className="bg-canvas p-2 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Virtual Speed</span>
          <span className="font-extrabold text-sm text-ink">{currentSpeed} <span className="text-[10px] font-normal">km/h</span></span>
        </div>

        <div className="bg-canvas p-2 rounded-xl border border-border text-center">
          <span className="text-[9px] text-ink-muted block uppercase">Road Elevation</span>
          <span className="font-extrabold text-sm text-emerald-700">+{currentStation.roadElevation}m</span>
        </div>

        <div className={`p-2 rounded-xl border text-center ${
          isDepthExceeded ? 'bg-rose-100 border-rose-300' : 'bg-canvas border-border'
        }`}>
          <span className="text-[9px] text-ink-muted block uppercase">Water on Wheels</span>
          <span className={`font-extrabold text-sm ${isDepthExceeded ? 'text-rose-800' : 'text-primary'}`}>
            {waterDepthUnderTires} cm
          </span>
        </div>
      </div>
    </div>
  );
}
