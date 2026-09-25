import React, { useState } from 'react';
import {
  X,
  History,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';

const HISTORICAL_ALERTS = [
  {
    id: 'HIST-2024-0718',
    date: '18 Jul 2024',
    title: 'RED ALERT: Kurla LBS Marg & Sion Circle Extreme Flash Flood',
    wards: ['Ward L', 'Ward F/N'],
    leadTimeMin: 74,
    forecastRate: '85 mm/hr',
    observedRate: '92 mm/hr',
    pod: '98%',
    far: '4.2%',
    evacuated: '14,200',
    status: 'VERIFIED_ACCURATE',
  },
  {
    id: 'HIST-2023-0726',
    date: '26 Jul 2023',
    title: 'RED ALERT: Andheri Subway & Milan Subway Severe Sump Overflow',
    wards: ['Ward K/E', 'Ward H/W'],
    leadTimeMin: 65,
    forecastRate: '70 mm/hr',
    observedRate: '68 mm/hr',
    pod: '96%',
    far: '6.0%',
    evacuated: '8,400',
    status: 'VERIFIED_ACCURATE',
  },
  {
    id: 'HIST-2022-0808',
    date: '08 Aug 2022',
    title: 'ORANGE WATCH: Mahim Creek Backwater Surcharge Advisory',
    wards: ['Ward G/N', 'Ward H/E'],
    leadTimeMin: 90,
    forecastRate: '50 mm/hr',
    observedRate: '42 mm/hr',
    pod: '91%',
    far: '9.8%',
    evacuated: '3,100',
    status: 'MODERATE_ACCURACY',
  },
  {
    id: 'HIST-2021-0716',
    date: '16 Jul 2021',
    title: 'RED ALERT: Chembur & Trombay Landslide & Inundation Warning',
    wards: ['Ward M/E', 'Ward M/W'],
    leadTimeMin: 55,
    forecastRate: '95 mm/hr',
    observedRate: '108 mm/hr',
    pod: '99%',
    far: '2.1%',
    evacuated: '22,000',
    status: 'VERIFIED_ACCURATE',
  },
];

export default function HistoricalArchiveModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [alerts] = useState(HISTORICAL_ALERTS);

  const filtered = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.wards.some((w) => w.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportCsv = () => {
    const headers = 'ID,Date,Title,Wards,LeadTimeMin,ForecastRate,ObservedRate,POD,FAR,Evacuated,Status\n';
    const rows = filtered
      .map(
        (a) =>
          `"${a.id}","${a.date}","${a.title}","${a.wards.join(', ')}",${a.leadTimeMin},"${a.forecastRate}","${a.observedRate}","${a.pod}","${a.far}","${a.evacuated}","${a.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MCGM_Historical_Warning_Audit_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Historical Warning Archive &amp; Post-Incident Accuracy Audit
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Meteorological verification of forecast vs ground observations &amp; False Alarm Ratio (FAR)
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

        {/* Search & Actions Strip */}
        <div className="px-5 py-2.5 bg-surface-secondary border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search past alerts by ward, event, or incident ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-ink text-xs focus:border-purple"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Archive List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl border border-border bg-surface hover:border-purple/30 transition-all shadow-subtle flex flex-col justify-between gap-2.5 text-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-purple">{a.id}</span>
                  <span className="text-[11px] font-mono text-ink-secondary">({a.date})</span>
                  <span className="font-bold text-ink text-xs">{a.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-mono text-[10px] font-bold self-start md:self-auto">
                  {a.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-border font-mono text-[11px]">
                <div>
                  <span className="text-ink-secondary block text-[10px]">Lead Time</span>
                  <strong className="text-ink">{a.leadTimeMin} mins</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block text-[10px]">Forecast Rate</span>
                  <strong className="text-ink">{a.forecastRate}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block text-[10px]">Observed Rate</span>
                  <strong className="text-purple">{a.observedRate}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block text-[10px]">POD / FAR</span>
                  <strong className="text-status-safe">{a.pod} / {a.far}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block text-[10px]">Citizens Evacuated</span>
                  <strong className="text-ink">{a.evacuated}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle text-xs text-ink-secondary font-mono">
          <span>Historical validation scores computed using WMO Forecast Verification Guidelines.</span>
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

