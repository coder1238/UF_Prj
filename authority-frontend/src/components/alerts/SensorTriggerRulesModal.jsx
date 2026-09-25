import React, { useState } from 'react';
import {
  X,
  Cpu,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sliders,
  Droplets,
  Radio,
  ArrowRight,
} from 'lucide-react';

const INITIAL_RULES = [
  {
    id: 'RULE-MITHI-01',
    name: 'Mithi River (Kranti Nagar) High-Water Sensor',
    sensorId: 'IOT-MITHI-04',
    metric: 'River Water Level',
    threshold: 3.8,
    unit: 'm MSL',
    currentVal: 3.42,
    severity: 'ORANGE WATCH',
    targetWards: ['Ward L', 'Ward K/E'],
    action: 'Auto-Draft Orange Alert + Armed Sirens',
    active: true,
  },
  {
    id: 'RULE-ANDHERI-02',
    name: 'Andheri Subway Inundation Ultrasonic Sump',
    sensorId: 'IOT-SUBWAY-01',
    metric: 'Underpass Ponding Depth',
    threshold: 35,
    unit: 'cm',
    currentVal: 28,
    severity: 'RED WARNING',
    targetWards: ['Ward K/E'],
    action: 'Barricade Order + Emergency Cell Broadcast',
    active: true,
  },
  {
    id: 'RULE-SION-03',
    name: 'Sion Circle Storm Drain Ultrasonic Level',
    sensorId: 'IOT-DRAIN-09',
    metric: 'Storm Drain Surcharge',
    threshold: 85,
    unit: '% Capacity',
    currentVal: 76,
    severity: 'ORANGE WATCH',
    targetWards: ['Ward F/N'],
    action: 'Pumping Station Boost + VMS Override',
    active: true,
  },
  {
    id: 'RULE-TIDE-04',
    name: 'Mahim Bay High-Tide Coastal Gauge',
    sensorId: 'IOT-TIDE-01',
    metric: 'Tidal Height MSL',
    threshold: 4.45,
    unit: 'm MSL',
    currentVal: 4.22,
    severity: 'YELLOW ADVISORY',
    targetWards: ['Ward G/N', 'Ward H/E'],
    action: 'Sluice Flap Lockout Warning',
    active: true,
  },
];

export default function SensorTriggerRulesModal({
  isOpen,
  onClose,
  onTriggerSimulatedAlert,
}) {
  if (!isOpen) return null;

  const [rules, setRules] = useState(INITIAL_RULES);
  const [triggeredToast, setTriggeredToast] = useState(null);

  const toggleRule = (id) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleSimulateBreach = (rule) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id ? { ...r, currentVal: r.threshold + (rule.unit === 'cm' ? 12 : 0.45) } : r
      )
    );

    const draft = {
      alertType: `${rule.name.split(' (')[0]} Threshold Breach`,
      selectedWards: rule.targetWards,
      depthThreshold: `${rule.threshold} ${rule.unit}`,
      message: `AUTOMATED EMERGENCY WARNING: ${rule.name} has breached critical safety threshold (${rule.threshold} ${rule.unit}). Evacuate immediate flood plain corridors and avoid subway approaches. Response crews dispatched.`,
    };

    setTriggeredToast(`Triggered: ${rule.id} breached! Loaded alert draft.`);

    if (onTriggerSimulatedAlert) {
      onTriggerSimulatedAlert(draft);
    }

    setTimeout(() => {
      setTriggeredToast(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Automated IoT Sensor Flood Alert Trigger Policies
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Autonomous edge threshold monitors connecting river gauges, sumps &amp; coastal sensors to CAP alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-5 py-2.5 bg-surface-secondary border-b border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-status-safe flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 4 Active Trigger Rules Online
            </span>
            <span className="text-ink-secondary">•</span>
            <span className="font-mono text-ink-secondary">Sampling Rate: 10 seconds</span>
          </div>

          {triggeredToast && (
            <span className="text-status-alert font-bold font-mono text-[11px] animate-pulse">
              {triggeredToast}
            </span>
          )}
        </div>

        {/* Rules Table */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {rules.map((rule) => {
            const isBreached = rule.currentVal >= rule.threshold;
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isBreached
                    ? 'bg-status-alert-soft border-status-alert/40'
                    : rule.active
                    ? 'bg-surface border-border shadow-subtle'
                    : 'bg-surface-secondary/70 border-border opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-ink">{rule.id}</span>
                    <span className="font-bold text-xs text-ink">{rule.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        rule.severity.includes('RED')
                          ? 'bg-status-alert-soft text-status-alert'
                          : 'bg-status-warning-soft text-status-warning'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>

                  <div className="text-[11px] text-ink-secondary flex items-center gap-4 font-mono">
                    <span>Sensor: {rule.sensorId}</span>
                    <span>Wards: {rule.targetWards.join(', ')}</span>
                    <span>
                      Trigger Threshold: <strong>&gt;{rule.threshold} {rule.unit}</strong>
                    </span>
                  </div>

                  <div className="text-[10px] text-purple font-semibold">
                    Action: {rule.action}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  {/* Current Reading */}
                  <div className="text-right font-mono">
                    <span
                      className={`text-sm font-bold block ${
                        isBreached ? 'text-status-alert' : 'text-ink'
                      }`}
                    >
                      {rule.currentVal} {rule.unit}
                    </span>
                    <span className="text-[9px] text-ink-secondary uppercase">
                      {isBreached ? 'THRESHOLD BREACHED!' : 'Current Live Level'}
                    </span>
                  </div>

                  {/* Simulate Button */}
                  <button
                    onClick={() => handleSimulateBreach(rule)}
                    className="px-3 py-1.5 rounded-lg bg-status-alert hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate Breach</span>
                  </button>

                  {/* Toggle Rule */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      rule.active ? 'bg-purple' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        rule.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary">
          <span>Automated triggers adhere to NDMA Standing Operating Procedures for Urban Flooding.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-ink font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

