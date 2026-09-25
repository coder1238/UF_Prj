import React, { useRef } from 'react';
import { QrCode, ShieldCheck, Download, Printer, X, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';

export default function OfflineQrPassModal({ report, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !report) return null;

  const qrSeed = `https://mumbai.disaster.gov.in/verify/incident?ticket=${report.id}&ward=${encodeURIComponent(report.ward || 'Ward K-West')}&hash=${report.cryptographicHash || report.id}`;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-primary text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Offline Emergency Barricade Pass</h3>
              <p className="text-[11px] font-mono text-purple-200">Incident Token #{report.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div ref={printRef} className="p-6 space-y-5 text-slate-800 font-sans print:p-6">
          {/* Top Banner */}
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono font-bold uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-primary" /> Greater Mumbai Emergency Relief Authorization
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              OFFLINE CITIZEN INCIDENT PASS
            </h2>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Authorized for Police & Traffic Ward Barricade Verification
            </p>
          </div>

          {/* Stylized QR Code Graphic Container */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
            {/* SVG Procedural QR Code representation */}
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <svg className="w-44 h-44" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Pattern Simulation */}
                <rect x="0" y="0" width="28" height="28" fill="#1e1b4b" rx="2" />
                <rect x="4" y="4" width="20" height="20" fill="white" rx="1" />
                <rect x="8" y="8" width="12" height="12" fill="#6d4aff" rx="1" />

                <rect x="72" y="0" width="28" height="28" fill="#1e1b4b" rx="2" />
                <rect x="76" y="4" width="20" height="20" fill="white" rx="1" />
                <rect x="80" y="8" width="12" height="12" fill="#6d4aff" rx="1" />

                <rect x="0" y="72" width="28" height="28" fill="#1e1b4b" rx="2" />
                <rect x="4" y="76" width="20" height="20" fill="white" rx="1" />
                <rect x="8" y="80" width="12" height="12" fill="#6d4aff" rx="1" />

                {/* Central and Distributed Data Bits */}
                <rect x="36" y="8" width="6" height="6" fill="#1e1b4b" />
                <rect x="46" y="14" width="8" height="4" fill="#6d4aff" />
                <rect x="58" y="8" width="6" height="6" fill="#1e1b4b" />

                <rect x="8" y="36" width="6" height="6" fill="#1e1b4b" />
                <rect x="18" y="46" width="6" height="8" fill="#6d4aff" />
                <rect x="8" y="58" width="6" height="6" fill="#1e1b4b" />

                <rect x="34" y="34" width="32" height="32" fill="#1e1b4b" rx="2" />
                <rect x="38" y="38" width="24" height="24" fill="white" rx="1" />
                <rect x="44" y="44" width="12" height="12" fill="#6d4aff" rx="1" />

                <rect x="72" y="36" width="6" height="12" fill="#1e1b4b" />
                <rect x="82" y="44" width="12" height="6" fill="#6d4aff" />
                <rect x="74" y="56" width="8" height="8" fill="#1e1b4b" />

                <rect x="36" y="74" width="8" height="6" fill="#1e1b4b" />
                <rect x="48" y="80" width="14" height="6" fill="#6d4aff" />
                <rect x="56" y="72" width="6" height="6" fill="#1e1b4b" />
                <rect x="74" y="74" width="8" height="8" fill="#1e1b4b" />
                <rect x="86" y="84" width="8" height="8" fill="#6d4aff" />
              </svg>
            </div>
            
            <span className="text-[10px] font-mono text-slate-500 mt-3 font-semibold text-center">
              Scan via MCGM Ground Inspector App to verify bypass corridor credentials
            </span>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Ticket Reference:</span>
              <span className="font-bold text-purple-primary">{report.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Location Point:</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[240px]" title={report.location}>
                {report.location}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Hazard Clearance:</span>
              <span className="font-bold text-amber-700">{report.category} ({report.depth} cm)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Jurisdiction:</span>
              <span className="font-bold text-slate-800">{report.ward || 'Ward K-West'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Digital Signature:</span>
              <span className="font-bold text-slate-700 text-[10px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                {report.resolutionCertificate?.digitalSealHash || '0x8f4c399b1a0304e2'}
              </span>
            </div>
          </div>

          {/* Notice to Checkpoint Personnel */}
          <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-[11px] text-purple-900 leading-snug">
            <strong>Officer Notice:</strong> This pass confirms the holder is a registered citizen observer or affected commuter within the active de-watering perimeter. Grant passage via designated high-elevation bypass corridors.
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl print:hidden">
          <span className="text-[11px] font-mono text-slate-500">Offline-ready • No cellular data needed</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

