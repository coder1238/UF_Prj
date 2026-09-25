import React, { useState } from 'react';
import { X, ClipboardCheck, CheckSquare, Square, Download } from 'lucide-react';
import { DRAINAGE_SOP_STEPS } from './drainageConstants';

export default function DrainageSOPModal({ isOpen, onClose, showToast }) {
  const [steps, setSteps] = useState(DRAINAGE_SOP_STEPS);

  if (!isOpen) return null;

  const handleToggleStep = (stepId) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        const willCheck = !s.checked;
        return {
          ...s,
          checked: willCheck,
          signoff: willCheck ? 'Signed off: On-Duty Cmdr (Just now)' : 'Pending Action',
        };
      })
    );
    showToast(`Updated protocol item ${stepId}`);
  };

  const handleExportLog = () => {
    const logText = steps
      .map(
        (s) =>
          `[${s.checked ? 'COMPLETED' : 'PENDING'}] ${s.id} | Stage: ${s.stage} | Action: ${s.text} | Signed: ${s.signoff}`
      )
      .join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BMC_Drainage_SOP_Signoff_Log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    showToast('Exported Drainage SOP Audit Log');
  };

  const completedCount = steps.filter((s) => s.checked).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Drainage Emergency SOP Playbook
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                  {completedCount}/{steps.length} ACTIONS EXECUTED ({progressPct}%)
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Standard Operating Procedures for Municipal Hydraulic Operations &amp; High Tide Protocol
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 font-mono">
          {/* Progress Bar */}
          <div className="bg-surface-secondary p-3 rounded-xl border border-border space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-ink font-semibold">Incident Playbook Execution:</span>
              <span className="text-emerald-500 font-bold">{progressPct}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* SOP Checkable List */}
          <div className="space-y-2">
            {steps.map((s) => (
              <div
                key={s.id}
                onClick={() => handleToggleStep(s.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  s.checked
                    ? 'bg-emerald-500/5 border-emerald-500/40 text-ink'
                    : 'bg-surface-secondary border-border text-ink-secondary hover:border-purple/40'
                }`}
              >
                <div className="mt-0.5 text-emerald-500">
                  {s.checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-ink-secondary" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface border border-border text-purple">
                      {s.stage}
                    </span>
                    <span className="text-[10px] text-ink-secondary">{s.signoff}</span>
                  </div>
                  <p className="text-xs font-sans font-medium text-ink">{s.text}</p>
                  <span className="text-[10px] text-ink-secondary block">Assigned Role: {s.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <button
            onClick={handleExportLog}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs text-ink font-mono flex items-center gap-1.5 shadow-subtle"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            <span>Export Official SOP Sign-off Log</span>
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
}

