import React, { useState } from 'react';
import { X, FileText, Printer, CheckCircle2, Database, FileSpreadsheet } from 'lucide-react';
import { HISTORICAL_STORMS, RECURRING_HOTSPOTS_EXTENDED, PUMPING_STATIONS_ARCHIVE, WARD_VULNERABILITY_RECORDS } from './historicalConstants';

export default function ForensicAuditExportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState('full'); // full | storm | ward
  const [includeRadarAudit, setIncludeRadarAudit] = useState(true);
  const [includePumpingLogs, setIncludePumpingLogs] = useState(true);
  const [includeEconomicDamage, setIncludeEconomicDamage] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const exportData = {
      title: 'Municipal Corporation of Greater Mumbai - Historical Flood Forensics Audit',
      generatedAt: new Date().toISOString(),
      classification: 'OFFICIAL MUNICIPAL ARCHIVE - AUTHORITIES USE ONLY',
      historicalStorms: HISTORICAL_STORMS,
      recurringHotspots: RECURRING_HOTSPOTS_EXTENDED,
      pumpingStations: PUMPING_STATIONS_ARCHIVE,
      wardVulnerability: WARD_VULNERABILITY_RECORDS,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MCGM_Historical_Flood_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    // Generate CSV for recurring hotspots
    const headers = ['Hotspot Name', 'Ward', 'Zone', '10Y Events', 'Avg Depth (cm)', 'Max Depth (cm)', 'Avg Duration (h)', 'Flood Type', 'Economic Loss (Cr)'];
    const rows = RECURRING_HOTSPOTS_EXTENDED.map(h => [
      `"${h.name}"`,
      `"${h.ward}"`,
      `"${h.zone}"`,
      h.events10Y,
      h.avgDepthCm,
      h.maxDepthCm,
      h.avgDurationH,
      `"${h.type}"`,
      h.economicExposureCr
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MCGM_Recurring_Hotspots_Forensics_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Official Municipal Forensic Audit Report Generator &amp; Exporter
              </h2>
              <p className="text-xs text-ink-secondary">
                Generate Comprehensive Government Flood Dossier (Printable PDF, JSON Dataset, or CSV Ledger)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Options & Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-secondary border border-border rounded-xl p-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                Audit Scope &amp; Target
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { id: 'full', label: '12-Year Climatology & Forensics Complete Audit (2014-2026)' },
                  { id: 'storm', label: 'Milestone Convective Cloudburst Events Focus' },
                  { id: 'ward', label: '24-Ward Resiliency & Bottleneck Assessment' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      checked={reportType === opt.id}
                      onChange={() => setReportType(opt.id)}
                      className="accent-purple"
                    />
                    <span className="text-ink">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                Included Technical Annexures
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRadarAudit}
                    onChange={(e) => setIncludeRadarAudit(e.target.checked)}
                    className="accent-purple"
                  />
                  <span>Doppler Radar QPE &amp; AWS Validation Bias Audit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePumpingLogs}
                    onChange={(e) => setIncludePumpingLogs(e.target.checked)}
                    className="accent-purple"
                  />
                  <span>Stormwater Pumping Station SCADA Lift Telemetry</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEconomicDamage}
                    onChange={(e) => setIncludeEconomicDamage(e.target.checked)}
                    className="accent-purple"
                  />
                  <span>Economic Damage Ledger &amp; Mitigation Investment ROI</span>
                </label>
              </div>
            </div>
          </div>

          {/* Formatted Document Preview Box */}
          <div className="bg-surface border-2 border-border rounded-xl p-6 shadow-sm space-y-4 font-sans text-ink">
            <div className="flex justify-between items-start border-b-2 border-border pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple font-extrabold block">
                  GOVERNMENT OF MAHARASHTRA • MCGM DISASTER MANAGEMENT CELL
                </span>
                <h3 className="text-base font-extrabold tracking-tight mt-1">
                  HISTORICAL FLOOD FORENSIC AUDIT &amp; CLIMATOLOGICAL RESILIENCY REPORT
                </h3>
                <p className="text-xs text-ink-secondary font-mono mt-0.5">
                  Ref No: MCGM/SWD/2026/RETRO-8941 • Classification: Official Authority Record
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="font-bold text-ink">Date: {new Date().toLocaleDateString('en-GB')}</div>
                <div className="text-[10px] text-status-safe font-bold">DIGITALLY SIGNED &amp; SEALED</div>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>1. EXECUTIVE METEOROLOGICAL SUMMARY:</strong> Analysis of 418 monsoon storm events over the 12-year historical observational baseline (2014–2026) indicates a <strong>+200% increase</strong> in high-intensity convective cloudburst events (&gt;50 mm/h). Astronomical high tides exceeding 3.8m MSL systematically cause hydraulic flap gate lockouts at Mahim, Worli, and Cleave Land outfalls, requiring automated pumping intervention.
              </p>

              <p>
                <strong>2. INFRASTRUCTURE RESILIENCE COMPLIANCE:</strong> Commissioning of 135,000 m³ of underground stormwater retention reservoirs (Hindmata &amp; Milan Subway) alongside the modernization of 7 major stormwater pumping stations has mitigated <strong>₹3,800 Crores</strong> in commuter delay and physical damage losses since 2021.
              </p>

              <div className="p-3 bg-surface-secondary rounded-lg font-mono text-[11px] border border-border">
                <div className="font-bold text-ink mb-1">AUDIT SUMMARY STATS:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>Historical Storms: <strong>5 Milestone Events</strong></div>
                  <div>Monitored Hotspots: <strong>42 Critical Nodes</strong></div>
                  <div>Pumping Stations: <strong>7 Operational (251 m³/s)</strong></div>
                  <div>Alert Lead Time: <strong>3.4 Hours (POD: 88.7%)</strong></div>
                </div>
              </div>
            </div>

            {/* Signatory */}
            <div className="flex justify-between items-end pt-4 border-t border-border text-xs font-mono">
              <div>
                <div className="text-[10px] text-ink-secondary">Chief Hydraulic Engineer</div>
                <div className="font-bold text-ink">Stormwater Drainage Department, MCGM</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-ink-secondary">Director of Disaster Management</div>
                <div className="font-bold text-ink">Municipal Emergency Operations Centre</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border bg-surface-subtle flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            {downloadSuccess && (
              <span className="text-status-safe font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File exported successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-surface border border-border hover:border-purple/40 text-ink rounded-lg font-semibold font-mono flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-surface border border-border hover:border-purple/40 text-ink rounded-lg font-semibold font-mono flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-purple" />
              <span>Export Raw JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
