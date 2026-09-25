import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  CheckCircle2,
  PhoneCall,
  Bell,
} from 'lucide-react';

const MUMBAI_WARDS = [
  { code: 'L', name: 'Kurla, Chandivali & Ghatkopar W', current: 84.5, f30: 92.0, acc: 68.2, risk: 'CRITICAL', underpasses: 'Kurla Subway, LBS Marg Lowland' },
  { code: 'K/E', name: 'Andheri East, MIDC & SEEPZ', current: 78.2, f30: 88.5, acc: 62.4, risk: 'CRITICAL', underpasses: 'Andheri Subway, WEH Sump' },
  { code: 'F/N', name: 'Sion, Matunga & Wadala', current: 72.0, f30: 84.0, acc: 58.1, risk: 'CRITICAL', underpasses: 'Sion Circle, Gandhi Market' },
  { code: 'G/N', name: 'Dadar West, Mahim & Dharavi', current: 62.8, f30: 71.2, acc: 51.0, risk: 'HIGH', underpasses: 'Hindmata Flyover Underpass, Sena Bhavan' },
  { code: 'H/E', name: 'Santacruz East & Khar East', current: 65.4, f30: 76.0, acc: 53.6, risk: 'HIGH', underpasses: 'Milan Subway, Vakola Bridge' },
  { code: 'M/W', name: 'Chembur West & Tilak Nagar', current: 58.0, f30: 67.5, acc: 47.2, risk: 'HIGH', underpasses: 'Shell Colony, Postal Colony' },
  { code: 'H/W', name: 'Bandra West & Khar West', current: 41.2, f30: 48.0, acc: 34.0, risk: 'MODERATE', underpasses: 'SV Road Bandra' },
  { code: 'K/W', name: 'Andheri West, Juhu & Versova', current: 46.5, f30: 52.0, acc: 38.5, risk: 'MODERATE', underpasses: 'Veera Desai Road, DN Nagar' },
  { code: 'P/S', name: 'Goregaon South & Oshiwara', current: 38.4, f30: 44.0, acc: 31.2, risk: 'MODERATE', underpasses: 'Goregaon Flyover Junction' },
  { code: 'P/N', name: 'Malad West & Marve', current: 32.0, f30: 36.5, acc: 25.8, risk: 'NORMAL', underpasses: 'Subway Malad Station' },
  { code: 'R/S', name: 'Kandivali West & Charkop', current: 28.5, f30: 31.0, acc: 22.0, risk: 'NORMAL', underpasses: 'SV Road Kandivali' },
  { code: 'R/C', name: 'Borivali West & Gorai', current: 24.0, f30: 27.5, acc: 18.5, risk: 'NORMAL', underpasses: 'Borivali Station East' },
  { code: 'S', name: 'Bhandup & Powai Basin', current: 54.2, f30: 63.0, acc: 44.0, risk: 'HIGH', underpasses: 'LBS Marg Bhandup' },
  { code: 'T', name: 'Mulund West & Nahur', current: 36.0, f30: 41.0, acc: 29.0, risk: 'MODERATE', underpasses: 'Mulund Check Naka' },
  { code: 'N', name: 'Ghatkopar East & Pant Nagar', current: 61.0, f30: 70.0, acc: 49.5, risk: 'HIGH', underpasses: 'Pant Nagar Sump' },
  { code: 'E', name: 'Byculla & Mazgaon', current: 30.5, f30: 34.0, acc: 24.5, risk: 'NORMAL', underpasses: 'Byculla Railway Sump' },
  { code: 'D', name: 'Grant Road, Malabar Hill & Walkeshwar', current: 22.0, f30: 25.0, acc: 17.0, risk: 'NORMAL', underpasses: 'Nana Chowk' },
  { code: 'A', name: 'Colaba, Fort & Churchgate', current: 18.5, f30: 21.0, acc: 14.2, risk: 'NORMAL', underpasses: 'Marine Lines Underpass' },
];

export default function WardRainfallRiskMatrix({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredWards = MUMBAI_WARDS.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || w.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Ward-by-Ward Rainfall &amp; Inundation Risk Matrix (BMC 24 Wards)
              </h3>
              <p className="text-xs text-ink-secondary">
                Doppler cell advection overlay on municipal ward administrative boundaries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-surface-secondary px-3 py-1.5 rounded-lg border border-border flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search by Ward (e.g. Ward L, Kurla, Sion, Andheri)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-mono text-ink placeholder:text-ink-secondary"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'NORMAL'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  filterRisk === lvl
                    ? 'bg-purple text-white border-purple shadow-sm'
                    : 'bg-surface-secondary text-ink-secondary border-border hover:text-ink'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mx-4 mt-2 p-2.5 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-secondary text-ink-secondary text-[10px] uppercase border-b border-border">
                <tr>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Current Rain</th>
                  <th className="p-3">+30m Forecast</th>
                  <th className="p-3">Accumulation</th>
                  <th className="p-3">Vulnerable Sump / Underpass</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredWards.map((w) => (
                  <tr key={w.code} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-ink">Ward {w.code}</div>
                      <div className="text-[10px] text-ink-secondary">{w.name}</div>
                    </td>
                    <td className="p-3 font-bold text-ink">{w.current} mm/h</td>
                    <td className="p-3 font-semibold text-purple">{w.f30} mm/h</td>
                    <td className="p-3 text-ink-secondary">{w.acc} mm</td>
                    <td className="p-3 text-[11px] text-ink max-w-[200px] truncate" title={w.underpasses}>
                      {w.underpasses}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          w.risk === 'CRITICAL'
                            ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                            : w.risk === 'HIGH'
                            ? 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                            : w.risk === 'MODERATE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                        }`}
                      >
                        {w.risk}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => showToast(`Automated Dispatch Advisory issued to Ward ${w.code} Control Room!`)}
                        className="px-2.5 py-1 rounded bg-purple-soft text-purple hover:bg-purple hover:text-white border border-purple/30 font-semibold text-[10px] transition-colors inline-flex items-center gap-1"
                      >
                        <Bell className="w-3 h-3" />
                        Alert Ward
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Showing {filteredWards.length} of {MUMBAI_WARDS.length} Municipal Wards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

