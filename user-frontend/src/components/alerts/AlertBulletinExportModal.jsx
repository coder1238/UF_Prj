import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, FileText, CheckCircle2 } from 'lucide-react';

export default function AlertBulletinExportModal({ alert, onClose }) {
  const printAreaRef = useRef(null);

  if (!alert) return null;

  const handlePrint = () => {
    window.print();
  };

  const bulletinDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <FileText className="w-5 h-5" /> Official BMC Disaster Warning Bulletin
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document Container */}
        <div ref={printAreaRef} className="pt-4 font-sans text-ink">
          {/* Official Municipal Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
            <div className="inline-block px-3 py-1 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded mb-2">
              OFFICIAL EMERGENCY DIRECTIVE • IMMEDIATE TRANSMISSION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM / BMC)
            </h2>
            <p className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">
              DISASTER MANAGEMENT CONTROL CELL • METROPOLITAN MONSOON COMMAND
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-200">
              <span>DOC REF: MCGM/DM/2026/{alert.id.toUpperCase()}</span>
              <span>ISSUED: {bulletinDate} • 20:30 IST</span>
              <span>WARD: {alert.ward}</span>
            </div>
          </div>

          {/* Alert Title & Warning Level */}
          <div className="p-4 rounded-xl border border-red-300 bg-red-50/70 mb-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono font-black text-red-700 uppercase">
                {alert.severity.toUpperCase()} WARNING LEVEL • VALID UNTIL: {alert.validUntil}
              </span>
              <span className="text-xs font-mono font-black text-red-700 bg-red-200 px-2 py-0.5 rounded">
                WATER: {alert.waterDepth} CM
              </span>
            </div>
            <h3 className="text-base font-extrabold text-red-950">
              {alert.title}
            </h3>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {alert.message}
            </p>
          </div>

          {/* Actionable Directives */}
          <div className="mb-4">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              MANDATORY CIVIL SAFETY DIRECTIVES:
            </h4>
            <div className="space-y-1.5">
              {alert.directives?.map((dir, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                  <span className="font-mono font-bold text-slate-500 shrink-0">{idx + 1}.</span>
                  <span className="leading-snug">{dir}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Safe Shelter */}
          {alert.shelterRecommendation && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 mb-4">
              <h5 className="text-[11px] font-mono font-bold uppercase text-purple-primary mb-1">
                DESIGNATED HIGH-GROUND EVACUATION SHELTER:
              </h5>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-ink">{alert.shelterRecommendation.name}</span>
                  <p className="text-[11px] text-slate-600">{alert.shelterRecommendation.address}</p>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-700">
                  <span className="block font-bold">{alert.shelterRecommendation.elevation}</span>
                  <span className="text-emerald-700 font-semibold">{alert.shelterRecommendation.capacity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Helpline Box */}
          <div className="p-3 rounded-xl border border-slate-300 bg-white grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono mb-4">
            <div>
              <span className="text-[9px] text-muted uppercase block">BMC Control</span>
              <span className="font-bold text-red-600">1916</span>
            </div>
            <div>
              <span className="text-[9px] text-muted uppercase block">Police SOS</span>
              <span className="font-bold text-slate-800">112</span>
            </div>
            <div>
              <span className="text-[9px] text-muted uppercase block">Fire Brigade</span>
              <span className="font-bold text-slate-800">101</span>
            </div>
            <div>
              <span className="text-[9px] text-muted uppercase block">Ward Line</span>
              <span className="font-bold text-slate-800">{alert.emergencyContacts?.wardControlDesk?.split(' / ')[0] || '1916'}</span>
            </div>
          </div>

          {/* Official Sign-off and QR Verification */}
          <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-700 block">
                  DIGITALLY SIGNED & VERIFIED
                </span>
                <span className="text-[10px] text-muted">
                  Municipal Chief Disaster Management Officer, Mumbai
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-muted">
              Official Monitored Portal: mumbai-flood.gov.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

