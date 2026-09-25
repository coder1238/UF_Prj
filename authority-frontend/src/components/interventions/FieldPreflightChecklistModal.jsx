import React, { useState } from 'react';
import { X, CheckSquare, Square, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FieldPreflightChecklistModal({
  isOpen,
  onClose,
  selectedCorridorName,
  onCertificationComplete,
}) {
  const [checks, setChecks] = useState([
    { id: 1, label: 'Suction intake strainer cleared of plastic waste, sludge, and debris.', checked: true },
    { id: 2, label: 'Diesel engine oil pressure & fuel reserve (>70% capacity) verified.', checked: true },
    { id: 3, label: 'High-pressure layflat discharge hose couplings locked with safety pins.', checked: true },
    { id: 4, label: 'Electrical earthing and shock protection verified for submersible cables.', checked: false },
    { id: 5, label: 'Traffic Police retro-reflective diversion barricades deployed 150m upstream.', checked: true },
    { id: 6, label: 'Radio communication link established on MCGM VHF disaster channel.', checked: true },
  ]);

  const [certified, setCertified] = useState(false);

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setChecks(checks.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const completedCount = checks.filter((c) => c.checked).length;
  const isAllComplete = completedCount === checks.length;

  const handleCertify = () => {
    setCertified(true);
    setTimeout(() => {
      setCertified(false);
      if (onCertificationComplete) onCertificationComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-status-safe">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Field Deployment Pre-Flight QA/QC Verification
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Safety and compliance checklist prior to tactical execution at {selectedCorridorName}.
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
          {/* Progress Strip */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Verification Progress: {completedCount} / {checks.length} Items Passed
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                isAllComplete ? 'text-status-safe' : 'text-amber-600'
              }`}
            >
              {isAllComplete ? 'READY FOR CERTIFICATION' : 'PENDING CHECKS'}
            </span>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {checks.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  item.checked
                    ? 'border-status-safe/40 bg-status-safe-soft/30'
                    : 'border-border bg-white hover:border-purple/30'
                }`}
              >
                <div className="mt-0.5">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-status-safe" />
                  ) : (
                    <Square className="w-4 h-4 text-ink-secondary" />
                  )}
                </div>
                <div className="text-xs text-ink font-medium leading-relaxed">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {certified && (
            <div className="p-3 bg-status-safe text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Field Safety Clearance Certified. Deployment Authorized.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-white text-ink-secondary hover:text-ink font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleCertify}
            disabled={!isAllComplete}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep disabled:opacity-50 transition-all shadow-subtle flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Certify Field Safety Clearance
          </button>
        </div>
      </div>
    </div>
  );
}

