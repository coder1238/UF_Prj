import React, { useState } from 'react';
import { X, Cpu, Plus, Sliders, CheckCircle2 } from 'lucide-react';

export default function RuleBuilderModal({ onClose, onSave }) {
  const [ruleName, setRuleName] = useState('');
  const [sensorType, setSensorType] = useState('River Gauge Level');
  const [operator, setOperator] = useState('>');
  const [thresholdVal, setThresholdVal] = useState('2.80 m MSL');
  const [actionActuator, setActionActuator] = useState('Auto-Open Sluice Flaps (100%)');
  const [priority, setPriority] = useState('CRITICAL (Tier-1)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule = {
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      name: ruleName,
      condition: `${sensorType} ${operator} ${thresholdVal}`,
      action: actionActuator,
      priority,
      status: 'ACTIVE',
      triggeredCount: 0,
    };

    onSave(newRule);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Create Automated SCADA Policy Rule
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Rule-Based Automation for Sluice Gates, Storm Sumps &amp; Pumps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          <form id="rule-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Rule Policy Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Milan Subway Sump High-Inundation Pump Auto-Start"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
              />
            </div>

            <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-3">
              <label className="block text-[11px] font-bold text-ink uppercase">
                IF Condition Trigger (Telemetry Sensor)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  className="p-2 bg-surface border border-border rounded-lg text-ink font-semibold text-xs col-span-1"
                >
                  <option value="River Gauge Level">River Level</option>
                  <option value="Tidal Surge Level">Tidal Level</option>
                  <option value="Rainfall Nowcast Rate">Rainfall Rate</option>
                  <option value="Drain Surcharge Index">Surcharge %</option>
                </select>

                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="p-2 bg-surface border border-border rounded-lg text-ink font-mono font-bold text-xs col-span-1"
                >
                  <option value=">">&gt; (Greater than)</option>
                  <option value=">=">&gt;= (Greater or equal)</option>
                  <option value="<">&lt; (Less than)</option>
                </select>

                <input
                  type="text"
                  value={thresholdVal}
                  onChange={(e) => setThresholdVal(e.target.value)}
                  className="p-2 bg-surface border border-border rounded-lg text-ink font-mono font-bold text-xs col-span-1"
                />
              </div>
            </div>

            <div className="p-3 bg-purple-soft/30 border border-purple/30 rounded-xl space-y-2">
              <label className="block text-[11px] font-bold text-purple-deep uppercase">
                THEN Actuator Output Action
              </label>
              <select
                value={actionActuator}
                onChange={(e) => setActionActuator(e.target.value)}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-ink font-semibold text-xs focus:outline-none focus:border-purple"
              >
                <option value="Auto-Open Sluice Flaps (100%)">Auto-Open Sluice Flaps (100% Gravity Outflow)</option>
                <option value="Auto-Shut Flap Gates (Anti-Backflow)">Auto-Shut Flap Gates (Anti-Backflow Surge)</option>
                <option value="Engage Standby Turbines (115% Overdrive)">Engage Standby Turbines (115% Overdrive)</option>
                <option value="Trigger Subway Barricade VMS Red Sign">Trigger Subway Barricade VMS Red Sign</option>
                <option value="Dispatch Mobile Dewatering Squad (Ward Pool)">Dispatch Mobile Dewatering Squad (Ward Pool)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                  Enforcement Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                >
                  <option value="CRITICAL (Tier-1)">CRITICAL (Tier-1 - Instant Override)</option>
                  <option value="HIGH (Tier-2)">HIGH (Tier-2 - 30s Debounce)</option>
                  <option value="MEDIUM (Tier-3)">MEDIUM (Tier-3 - Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                  Safety Interlock
                </label>
                <div className="p-2.5 bg-surface-secondary border border-border rounded-xl text-[11px] text-status-safe font-mono flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SCADA FAIL-SAFE ENABLED</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="rule-form"
            className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors shadow-subtle"
          >
            Save &amp; Activate Policy Rule
          </button>
        </div>
      </div>
    </div>
  );
}

