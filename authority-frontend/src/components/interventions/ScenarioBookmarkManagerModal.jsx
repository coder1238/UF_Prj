import React, { useState } from 'react';
import { X, Bookmark, Plus, RotateCcw, Trash2, CheckCircle2, Sliders } from 'lucide-react';

export default function ScenarioBookmarkManagerModal({
  isOpen,
  onClose,
  activeInterventions = [],
  depthMitigationCm = 0,
  onRestoreScenario,
  scenarioParams,
  onRestoreScenarioParams,
}) {
  const [scenarioName, setScenarioName] = useState('');
  const [savedScenarios, setSavedScenarios] = useState([
    {
      id: 'scen-01',
      name: 'Plan Alpha: Spring-Tide Heavy Defense',
      interventions: ['int-sluice-02', 'int-basin-04', 'int-sluice-07'],
      scenarioParams: { rainfallIntensity: 95, durationMin: 90, drainBlockage: 40, pumpingCapacity: 50, tideLevel: 5.1 },
      depthMitigation: 27.2,
      hoursSaved: 3.6,
      timestamp: '18:15 IST',
      notes: 'Focuses on gravity sluices and holding ponds to preserve diesel for night operations.',
    },
    {
      id: 'scen-02',
      name: 'Plan Bravo: Maximum Dewatering Overdrive',
      interventions: ['int-pump-01', 'int-pump-05', 'int-barrier-03', 'int-vac-06'],
      scenarioParams: { rainfallIntensity: 110, durationMin: 120, drainBlockage: 50, pumpingCapacity: 60, tideLevel: 4.95 },
      depthMitigation: 42.0,
      hoursSaved: 4.8,
      timestamp: '18:40 IST',
      notes: 'All mobile diesel pumps and rapid barriers deployed to force emergency route reopening.',
    },
  ]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    const newScenario = {
      id: `scen-${Date.now()}`,
      name: scenarioName.trim(),
      interventions: [...activeInterventions],
      scenarioParams: scenarioParams ? { ...scenarioParams } : null,
      depthMitigation: depthMitigationCm,
      hoursSaved: Math.round((depthMitigationCm / 10) * 10) / 10,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      notes: `${activeInterventions.length} interventions & ${scenarioParams ? `${scenarioParams.rainfallIntensity}mm/h` : ''} coupled in solver at save time.`,
    };

    setSavedScenarios([newScenario, ...savedScenarios]);
    setScenarioName('');
  };

  const handleDelete = (id) => {
    setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
  };

  const handleRestore = (scenario) => {
    if (onRestoreScenario) {
      onRestoreScenario(scenario.interventions);
    }
    if (onRestoreScenarioParams && scenario.scenarioParams) {
      onRestoreScenarioParams(scenario.scenarioParams);
    }
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Scenario Snapshot & Portfolio Bookmark Vault
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Save, recall, and benchmark alternative hydrodynamic intervention configurations.
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
          {/* Create New Bookmark */}
          <form onSubmit={handleSaveCurrent} className="p-3 bg-surface-secondary rounded-xl border border-border space-y-2">
            <label className="text-xs font-semibold text-ink block">
              Bookmark Current Setup ({activeInterventions.length} Active • -{depthMitigationCm} cm)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Scenario name (e.g. Plan Delta: Night Low-Tide Shift)"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-white border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
              />
              <button
                type="submit"
                disabled={!scenarioName.trim()}
                className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Saved Scenarios List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink">Saved Operational Plans</h4>
            {savedScenarios.map((scen) => (
              <div
                key={scen.id}
                className="p-3.5 rounded-xl border border-border bg-white shadow-subtle hover:border-purple/30 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-ink">{scen.name}</h5>
                    <div className="text-[11px] text-ink-secondary mt-0.5">{scen.notes}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(scen.id)}
                    className="text-ink-secondary hover:text-status-alert p-1"
                    title="Delete scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-purple font-bold">
                      {scen.interventions.length} Units
                    </span>
                    <span className="text-status-safe font-bold">
                      -{scen.depthMitigation} cm
                    </span>
                    <span className="text-ink-secondary">
                      +{scen.hoursSaved}h saved
                    </span>
                    <span className="text-ink-secondary text-[10px]">
                      Saved {scen.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRestore(scen)}
                    className="px-3 py-1 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple text-xs font-semibold rounded-lg border border-border flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px]">
            Saved plans persist in browser memory for multi-scenario comparative drills.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

