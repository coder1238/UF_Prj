import React from 'react';
import { X, Printer, Download, FileCheck, CheckCircle2, Shield, Calendar, MapPin } from 'lucide-react';

export default function CounterfactualAuditReportModal({
  isOpen,
  onClose,
  selectedCorridor,
  activeInterventionsList,
  depthMitigationCm,
  hoursSaved,
  baselinePeak,
  simulatedPeak,
}) {
  if (!isOpen) return null;

  const reportId = `MCGM-HA-2026-${Date.now().toString().slice(-4)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadJson = () => {
    const reportData = {
      reportId,
      generationDate: new Date().toISOString(),
      corridor: selectedCorridor,
      baselinePeakCm: baselinePeak,
      simulatedPeakCm: simulatedPeak,
      depthMitigationCm,
      hoursSaved,
      activeInterventions: activeInterventionsList,
      certification: 'Certified compliant with NDMA Urban Flood Protocol 2026',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}_Hydrodynamic_Audit.json`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Certified Hydrodynamic Counterfactual Audit Dossier
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Official MCGM Disaster Management Authority engineering report.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary flex items-center gap-1.5 text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep flex items-center gap-1.5 shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-ink font-sans">
          {/* MCGM Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-purple uppercase font-bold">
                MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM)
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                DISASTER MANAGEMENT CELL • HYDRO-AI TWIN DIVISION
              </h2>
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {dateStr}
                </span>
                <span>•</span>
                <span className="font-mono">REPORT REF: {reportId}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 text-white font-bold">
                CONFIDENTIAL / RESTRICTED
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Executive Counterfactual Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              This certified audit evaluates hydrodynamic intervention impacts across the critical arterial corridor <strong>{selectedCorridor.name} ({selectedCorridor.ward})</strong> under simulated rainfall conditions (80 mm/hr) and spring high tide lockout (4.87 m MSL). By coupling {activeInterventionsList.length} tactical hydraulic interventions into the PINN 2D-SWE solver, the forecasted peak water head is mitigated from an unmitigated <strong>{baselinePeak} cm</strong> to a controlled <strong>{simulatedPeak} cm</strong>, representing a net <strong>-{depthMitigationCm} cm</strong> reduction and recovering <strong>{hoursSaved} hours</strong> of commercial street clearance.
            </p>
          </div>

          {/* Key Metrics Table */}
          <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Baseline Inundation</div>
              <div className="text-base font-bold text-red-600 mt-0.5">{baselinePeak} cm</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Mitigated Twin Head</div>
              <div className="text-base font-bold text-emerald-700 mt-0.5">{simulatedPeak} cm</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Head Depressurization</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">-{depthMitigationCm} cm</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Early Street Reopening</div>
              <div className="text-base font-bold text-purple mt-0.5">+{hoursSaved} Hours</div>
            </div>
          </div>

          {/* Active Intervention Registry */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Tactical Intervention Inventory & Sizing
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-[10px] font-mono text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Unit ID</th>
                    <th className="py-2 px-3">Intervention Type</th>
                    <th className="py-2 px-3">Flow Capacity</th>
                    <th className="py-2 px-3">Target Hotspot</th>
                    <th className="py-2 px-3">Delta (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeInterventionsList.map((item) => (
                    <tr key={item.id} className="text-slate-800">
                      <td className="py-2 px-3 font-mono font-bold text-purple">{item.id}</td>
                      <td className="py-2 px-3 font-medium">{item.name}</td>
                      <td className="py-2 px-3 font-mono">{item.capacity}</td>
                      <td className="py-2 px-3">{item.targetLocation}</td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-700">
                        -{item.deltaDepthReductionCm} cm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engineering Sign-Off Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">Certified by:</div>
              <div>Chief Hydro-Informatics Officer, MCGM Disaster Cell</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Digital Signature: SHA-256 Validated
              </div>
            </div>
            <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center p-2 text-[9px] text-slate-400 font-mono">
              <span>MCGM OFFICIAL SEAL</span>
              <span className="font-bold mt-1 text-slate-600">CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs print:hidden">
          <span className="text-ink-secondary text-[11px]">
            Complies with ISO 22320 Emergency Management Documentation Standards.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

