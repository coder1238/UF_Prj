import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function StormCellInjectorModal({
  isOpen,
  onClose,
  onInjectCell,
  onClearCustomCells,
  customCellCount = 0,
}) {
  const [cellName, setCellName] = useState('SIM-Cloudburst-01');
  const [dbz, setDbz] = useState(65);
  const [velocityKm, setVelocityKm] = useState(22);
  const [headingDeg, setHeadingDeg] = useState(45);
  const [radius, setRadius] = useState(8.5);
  const [presetLocation, setPresetLocation] = useState('arabian-sea');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const LOCATIONS = [
    { id: 'arabian-sea', name: 'Arabian Sea Inflow (Off Colaba)', x: 190, y: 320 },
    { id: 'thane-creek', name: 'Thane Creek Approach', x: 330, y: 190 },
    { id: 'powai-basin', name: 'Powai / Vihar Lake Basin', x: 300, y: 150 },
    { id: 'borivali-ridge', name: 'Northern SGNP Ridge', x: 280, y: 110 },
  ];

  const handleInject = () => {
    const loc = LOCATIONS.find((l) => l.id === presetLocation) || LOCATIONS[0];
    const newCell = {
      id: `SIM-${Math.floor(10 + Math.random() * 90)}`,
      name: cellName,
      dbz: dbz,
      intensity: Math.round(Math.pow(Math.pow(10, dbz / 10) / 200, 1 / 1.6)),
      velocityKm: velocityKm,
      headingDeg: headingDeg,
      headingText: `${headingDeg}° @ ${velocityKm} km/h`,
      baseX: loc.x,
      baseY: loc.y,
      radius: radius,
      vil: Math.round((dbz / 65) * 55),
      zdr: 3.4,
      kdp: 4.1,
      topKm: 14.8,
      isSimulated: true,
    };

    if (onInjectCell) {
      onInjectCell(newCell);
    }
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Custom Storm Cell Injector (What-If Stress Testing)
              </h3>
              <p className="text-xs text-ink-secondary">
                Inject synthetic convective storm cores to evaluate drainage contingency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Cell Identification */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase font-bold text-ink-secondary">
              Simulation Cell Label
            </label>
            <input
              type="text"
              value={cellName}
              onChange={(e) => setCellName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-secondary border border-border text-xs font-mono text-ink font-bold focus:border-purple outline-none"
            />
          </div>

          {/* Preset Origin Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase font-bold text-ink-secondary">
              Genesis Origin Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setPresetLocation(loc.id)}
                  className={`p-2.5 rounded-lg text-xs font-mono border text-left transition-all ${
                    presetLocation === loc.id
                      ? 'bg-purple-soft border-purple text-purple font-bold'
                      : 'bg-surface-secondary border-border text-ink hover:border-purple/30'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity and Radius */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-ink">Peak Core dBZ</span>
                <span className="font-bold text-status-alert">{dbz} dBZ</span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                value={dbz}
                onChange={(e) => setDbz(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">
                Est. Rain Rate: {Math.round(Math.pow(Math.pow(10, dbz / 10) / 200, 1 / 1.6))} mm/h
              </span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-ink">Cell Radius</span>
                <span className="font-bold text-purple">{radius} km</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="15.0"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">
                Footprint: {Math.round(Math.PI * radius * radius)} km²
              </span>
            </div>
          </div>

          {/* Heading & Speed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-ink">Advection Bearing</span>
                <span className="font-bold text-purple">{headingDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={headingDeg}
                onChange={(e) => setHeadingDeg(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Vector heading</span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-ink">Propagation Speed</span>
                <span className="font-bold text-purple">{velocityKm} km/h</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={velocityKm}
                onChange={(e) => setVelocityKm(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Displacement speed</span>
            </div>
          </div>

          {isCreated && (
            <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Simulated convective storm cell successfully injected onto active radar!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          {customCellCount > 0 ? (
            <button
              onClick={onClearCustomCells}
              className="px-3 py-1.5 rounded-lg bg-status-alert-soft text-status-alert hover:bg-red-100 border border-status-alert/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear {customCellCount} Injected Cells
            </button>
          ) : (
            <span className="text-[11px] font-mono text-ink-secondary">
              No simulated cells currently active
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInject}
              className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inject Storm Cell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
