import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { WARD_SCENARIO_MATRIX } from './scenarioConstants';

export default function ExportDossierModal({
  isOpen,
  onClose,
  scenarioParams,
  activeBreaches,
  activeWhatIfs,
  deltaRoads,
  deltaDepth,
  deltaArea,
  deltaSurcharge,
  deltaClearance,
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleDownloadJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      system: 'BMC Flood Command Center // Scenario Simulator',
      modelSolver: 'CUDA 2D-SWE Shallow Water Navier-Stokes',
      scenarioParams,
      activeBreaches: Object.keys(activeBreaches).filter((k) => activeBreaches[k]),
      activeWhatIfs: Object.keys(activeWhatIfs).filter((k) => activeWhatIfs[k]),
      telemetry: {
        affectedRoads: deltaRoads,
        maxDepthCm: deltaDepth,
        floodedAreaKm2: deltaArea,
        surchargeNodes: deltaSurcharge,
        clearanceTimeHrs: deltaClearance,
      },
      wardInundationMatrix: WARD_SCENARIO_MATRIX,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Scenario_Simulation_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('JSON Data Package downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadCSV = () => {
    const surgeFactor = 1 + (scenarioParams.rainfallIntensity - 50) * 0.015 + (scenarioParams.drainBlockage / 100) * 0.45;
    const headers = ['Ward', 'Name', 'Zone', 'Population At Risk', 'Baseline Depth (cm)', 'Scenario Depth (cm)', 'Delta Depth (cm)', 'Baseline Area (km2)', 'Scenario Area (km2)', 'Shelters Available', 'Priority'];
    const rows = WARD_SCENARIO_MATRIX.map((w) => {
      const scenarioDepth = Math.round(w.baseDepth * surgeFactor);
      const deltaDepthVal = scenarioDepth - w.baseDepth;
      const scenarioArea = (w.baseAreaKm2 * surgeFactor).toFixed(2);
      const priority = scenarioDepth > 35 ? 'CRITICAL' : scenarioDepth > 22 ? 'HIGH' : 'MODERATE';
      return [
        w.ward,
        `"${w.name}"`,
        w.zone,
        w.popRisk,
        w.baseDepth,
        scenarioDepth,
        deltaDepthVal,
        w.baseAreaKm2,
        scenarioArea,
        w.shelters,
        priority,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ward_Inundation_Delta_Matrix_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Ward Matrix CSV downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Export Hydrodynamic Simulation Dossier
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  DATA EXPORT
                </span>
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Download model boundary conditions, ward delta matrices, and executive briefing reports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {downloadSuccess && (
          <div className="m-4 p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl flex items-center gap-2 text-xs font-mono text-status-safe animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* JSON Export */}
          <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-purple/50 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-soft text-purple">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Complete Model Parameters &amp; Results (.JSON)</h4>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Full programmatic bundle with mesh boundary parameters, failure injections, and converged telemetry.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* CSV Export */}
          <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-purple/50 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-safe-soft text-status-safe">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Ward Inundation Delta Matrix (.CSV)</h4>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Tabular spreadsheet containing baseline vs scenario depths, population exposure, and priority ratings.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-status-safe hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Print Briefing Preview */}
          <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-purple/50 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-warning-soft text-status-warning">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Printable Executive Briefing Report</h4>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Clean printable document formatted for Municipal Commissioner and Disaster Management briefings.
                </p>
              </div>
            </div>
            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-purple" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
          <span className="text-ink-secondary text-[11px] font-mono">
            Calibrated on BMC MCGM GIS Datum (WGS84 UTM 43N)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg font-semibold text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
