import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, QrCode, FileText } from 'lucide-react';

export default function ClearanceCertificateModal({ report, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !report) return null;

  const cert = report.resolutionCertificate || {
    certId: `MCGM-CERT-${report.id}-RES`,
    issuedBy: `Office of the Executive Engineer (Stormwater Cell), ${report.ward || 'Ward K-West'}`,
    signatory: report.assignedOfficer || 'Er. V. Desai, M.E. (Civil)',
    digitalSealHash: '0x8f4c399b1a0304e2',
    targetCompletion: report.status === 'resolved' ? 'Certified Cleared' : 'Under Active Pumping',
    closureWaterDepth: report.status === 'resolved' ? '0 cm (Road fully drained)' : `${report.depth} cm`,
    drainStatus: 'Silt screens cleaned & stormwater evacuated'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-primary" />
            <h3 className="font-bold text-ink text-base">Official Incident Resolution Certificate</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 text-slate-800 font-sans print:p-8">
          
          {/* Header Banner */}
          <div className="border-b-2 border-purple-primary/40 pb-5 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-mono font-bold uppercase mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-primary" /> Municipal Corporation of Greater Mumbai (MCGM)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              STORM WATER DRAINAGE EMERGENCY RESOLUTION AUDIT
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Issued under Disaster Management Act (Sec. 34) & Unified Hydro-Met Inundation Protocol
            </p>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CERTIFICATE ID</span>
              <span className="font-bold text-slate-900">{cert.certId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">INCIDENT TICKET</span>
              <span className="font-bold text-purple-primary">{report.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">STATUS</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {report.status.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">WARD JURISDICTION</span>
              <span className="font-bold text-slate-900">{report.ward || 'Ward K-West'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TIME OF INTAKE</span>
              <span className="font-bold text-slate-900">{report.submittedAt || report.timestamp}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">GPS LOCATION</span>
              <span className="font-bold text-slate-900">
                {report.coordinates ? `${report.coordinates.lat.toFixed(4)}, ${report.coordinates.lng.toFixed(4)}` : '19.0825, 72.8415'}
              </span>
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">1. Incident Specification</h4>
            <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <strong>Observed Issue:</strong> {report.title} ({report.category}) located at <em>{report.location}</em>. Peak recorded water depth stood at <strong>{report.depth} cm</strong> with {report.aiConfidence || 92}% automated vision verification match.
            </p>
          </div>

          {/* Action Taken & Machinery Deployed */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">2. Emergency Dewatering & Mitigation Deployed</h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Deployed:</span>
                <span className="font-bold text-slate-900">{report.unitAssigned?.name || 'High-Capacity Dewatering Pump Unit #7'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Registration:</span>
                <span className="font-bold text-slate-900">{report.unitAssigned?.vehicleReg || 'MH-02-EE-4102'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Discharge Capacity:</span>
                <span className="font-bold text-purple-primary">{report.unitAssigned?.dischargeRateLpm || 2400} Litres/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Drainage Outfall Route:</span>
                <span className="font-bold text-slate-900">{report.unitAssigned?.drainOutfall || 'Hindmata Box Culvert (Gate 3)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Commuters Safeguarded / Diverted:</span>
                <span className="font-bold text-emerald-700">{report.affectedCommutersDiverted || 1420} Citizens</span>
              </div>
            </div>
          </div>

          {/* Signature & Digital Cryptographic Seal */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-xl p-1.5 flex flex-col items-center justify-center text-center font-mono">
                <div className="text-[8px] font-bold">DIGITAL</div>
                <div className="text-[12px] font-black">SEAL</div>
                <div className="text-[7px] text-purple-300">MCGM-SW</div>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                <div className="font-bold text-slate-800">Tamper-Proof Verification Hash</div>
                <div className="text-purple-primary font-mono">{cert.digitalSealHash}</div>
                <div>Authenticated via MCGM IoT GNN Mesh</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-base text-slate-900 font-bold border-b border-slate-300 pb-1 px-4 inline-block">
                {cert.signatory}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Executive Engineer / Disaster Cell Superintendent
              </div>
              <div className="text-[9px] text-slate-400 font-mono">Ward MCGM Disaster Command</div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs font-mono text-slate-500 rounded-b-3xl print:hidden">
          This digital certificate is officially valid for municipal road audits and insurance waterlogging loss verifications.
        </div>
      </div>
    </div>
  );
}
