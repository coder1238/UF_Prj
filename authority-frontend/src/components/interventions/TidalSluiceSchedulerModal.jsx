import React, { useState } from 'react';
import { X, Waves, Sliders, AlertTriangle, CheckCircle, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TIDAL_SCHEDULE_DATA } from './interventionConstants';

export default function TidalSluiceSchedulerModal({ isOpen, onClose }) {
  const [gates, setGates] = useState([
    {
      id: 'gate-mahim',
      name: 'Mahim Creek Outfall Auxiliary Flap Gate #4',
      location: 'Mithi River Outfall / Mahim Causeway',
      status: 'OPEN - GRAVITY DRAINAGE',
      angleDeg: 75,
      flowM3s: 12.0,
      autoScada: true,
      reverseBackflowRisk: 'LOW (Tide < 3.8m)',
    },
    {
      id: 'gate-haji-ali',
      name: 'Haji Ali Bay Stormwater Sluice #2',
      location: 'Worli-Haji Ali Outfall',
      status: 'THROTTLED (TIDAL BUFFER)',
      angleDeg: 35,
      flowM3s: 6.5,
      autoScada: true,
      reverseBackflowRisk: 'MODERATE (Tide 4.1m)',
    },
    {
      id: 'gate-love-grove',
      name: 'Love Grove Pumping Station Seaward Gates',
      location: 'Worli Naka Coastal Ingress',
      status: 'LOCKED / TIDAL SEAL ACTIVE',
      angleDeg: 0,
      flowM3s: 0.0,
      autoScada: true,
      reverseBackflowRisk: 'HIGH - SEAWATER INTRUSION HAZARD',
    },
    {
      id: 'gate-cleaveland',
      name: 'CleaveLand Bandar Outfall Barrier',
      location: 'Dharavi-Sion Storm Channel',
      status: 'EMERGENCY DISCHARGE',
      angleDeg: 85,
      flowM3s: 14.2,
      autoScada: false,
      reverseBackflowRisk: 'LOW',
    },
  ]);

  const [tideSchedule] = useState(TIDAL_SCHEDULE_DATA);

  if (!isOpen) return null;

  const handleToggleGate = (gateId) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === gateId) {
          const isOpenState = g.angleDeg > 10;
          return {
            ...g,
            angleDeg: isOpenState ? 0 : 80,
            flowM3s: isOpenState ? 0 : 12.5,
            status: isOpenState ? 'MANUALLY SHUT (LOCKOUT)' : 'MANUALLY OPENED',
            autoScada: false,
          };
        }
        return g;
      })
    );
  };

  const handleAngleChange = (gateId, newAngle) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gateId
          ? {
              ...g,
              angleDeg: Number(newAngle),
              flowM3s: Math.round((Number(newAngle) / 90) * 16 * 10) / 10,
              status: Number(newAngle) === 0 ? 'LOCKED / SEALED' : `THROTTLED (${newAngle}°)`,
            }
          : g
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Arabian Sea Tidal Sluice Gate Automation & Lockout
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Coastal boundary condition synchronization with astronomical tide cycles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Tidal Curve Bar */}
          <div className="p-4 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                  ASTRONOMICAL TIDE TELEMETRY (APOLLO BANDAR / COLABA)
                </span>
                <div className="text-sm font-bold mt-1">
                  Spring High Tide Alert: <span className="text-amber-400">4.87 m MSL</span> at 19:42 IST
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-300">
                Current Level: <strong className="text-white text-sm">4.35 m</strong> (Rising)
              </div>
            </div>

            {/* Tide timeline strip */}
            <div className="grid grid-cols-7 gap-1.5 mt-3 pt-3 border-t border-slate-700/60 font-mono text-[10px]">
              {tideSchedule.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded text-center ${
                    t.heightM >= 4.5
                      ? 'bg-red-500/30 border border-red-500/50 text-red-200'
                      : 'bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{t.time}</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{t.heightM}m</div>
                  <div className="text-[8px] truncate opacity-75 mt-0.5">{t.state.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sluice Gate Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple" />
              Tidal Outfall Flap Gates & Hydraulic Actuators
            </h4>

            {gates.map((gate) => (
              <div
                key={gate.id}
                className="p-3.5 rounded-xl border border-border bg-white shadow-subtle hover:border-purple/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-ink">{gate.name}</h5>
                    <div className="text-[11px] text-ink-secondary mt-0.5">{gate.location}</div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      gate.angleDeg === 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-status-safe-soft text-status-safe'
                    }`}
                  >
                    {gate.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2.5 items-center">
                  <div>
                    <label className="text-[10px] text-ink-secondary block mb-1">
                      Flap Angle: <strong>{gate.angleDeg}°</strong> (0° Shut, 90° Full Open)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={gate.angleDeg}
                      onChange={(e) => handleAngleChange(gate.id, e.target.value)}
                      className="w-full accent-cyan-600"
                    />
                  </div>

                  <div className="text-xs font-mono">
                    <span className="text-ink-secondary text-[10px] block">Discharge Flow:</span>
                    <strong className="text-cyan-700 text-sm">{gate.flowM3s} m³/s</strong>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => handleToggleGate(gate.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        gate.angleDeg > 0
                          ? 'bg-status-alert text-white hover:bg-status-alert/90'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {gate.angleDeg > 0 ? 'Emergency Seal Gate' : 'Open Sluice Gate'}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-ink-secondary pt-2 border-t border-border flex items-center justify-between">
                  <span>Reverse Intrusion Risk: <strong>{gate.reverseBackflowRisk}</strong></span>
                  <span>Control Mode: {gate.autoScada ? 'SCADA Auto-Regulated' : 'MANUAL COMMAND OVERRIDE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Tidal gates prevent reverse Arabian Sea inundation into Mithi riverbed.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep"
          >
            Apply Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

