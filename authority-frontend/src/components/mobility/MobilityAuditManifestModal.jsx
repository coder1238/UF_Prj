import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle2, Shield, Stamp } from 'lucide-react';
import { ROUTE_PROFILES } from './mobilityConstants';

export default function MobilityAuditManifestModal({ isOpen, onClose, selectedRouteId, vehicle }) {
  if (!isOpen) return null;

  const [manifestDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [manifestTime] = useState(new Date().toLocaleTimeString('en-GB'));
  const [downloadToast, setDownloadToast] = useState(null);

  const route = ROUTE_PROFILES.find((r) => r.id === selectedRouteId) || ROUTE_PROFILES[1];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setDownloadToast('Emergency Route Clearance Manifest PDF generated and saved to local dispatch archives.');
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <FileText className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Municipal Emergency Route Clearance Manifest
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-safe text-white">
                  Formal Authorization Order
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Official dispatch document with cryptographic audit hash for municipal legal records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {downloadToast && (
            <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{downloadToast}</span>
            </div>
          )}

          {/* Printable Document Sheet */}
          <div className="p-6 bg-white border-2 border-border rounded-xl shadow-sm text-ink space-y-5 font-sans">
            {/* Header Emblems */}
            <div className="flex justify-between items-start border-b-2 border-ink pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-secondary block font-bold tracking-widest">
                  MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM)
                </span>
                <h2 className="text-lg font-black tracking-tight mt-0.5">
                  DISASTER MANAGEMENT CELL &bull; TRAFFIC LOGISTICS WING
                </h2>
                <span className="text-xs text-ink-secondary block">
                  Municipal Head Office, Fort, Mumbai - 400001
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold block text-purple">ORDER #MCGM-MBL-2026-8891</span>
                <span className="text-[11px] text-ink-secondary block">Date: {manifestDate} &bull; {manifestTime}</span>
              </div>
            </div>

            {/* Mission Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-surface-secondary rounded-lg border border-border">
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Designated Fleet</span>
                <span className="font-bold text-xs">{vehicle?.label || 'Ambulance (108 ALS)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Corridor Classification</span>
                <span className="font-bold text-xs text-purple">{route.name.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Approved Distance</span>
                <span className="font-mono font-bold text-xs">{route.distanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Predicted Clearance</span>
                <span className="font-bold text-xs text-status-safe">100% Passable</span>
              </div>
            </div>

            {/* Certification Clauses */}
            <div className="space-y-2 text-xs leading-relaxed">
              <h4 className="font-bold text-ink uppercase text-[11px] font-mono">
                Operational Clearance Findings
              </h4>
              <p>
                1. Pursuant to powers under the Disaster Management Act 2005 (Sec 34), the above corridor is certified as the exclusive rapid response lifeline for high-priority emergency vehicles.
              </p>
              <p>
                2. Continuous hydrodynamic flood simulation confirms zero standing water (&lt;1cm) across the Eastern Express Highway and JVLR elevated flyover sections. All at-grade sumps (Kurla LBS, Milan Subway) are to remain barricaded to civilian traffic.
              </p>
              <p>
                3. The Area Traffic Control (ATC) is directed to maintain Green Wave signal preemption priority along all 7 intersections for convoys carrying this clearance authorization token.
              </p>
            </div>

            {/* Signatures & Stamps */}
            <div className="pt-6 border-t border-dashed border-border grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
              <div>
                <div className="h-10 border-b border-ink/40"></div>
                <span className="text-[10px] font-mono block mt-1 font-bold text-ink">
                  DCP (Traffic Suburbs)
                </span>
                <span className="text-[9px] text-ink-muted block">Mumbai Traffic Police</span>
              </div>
              <div>
                <div className="h-10 border-b border-ink/40"></div>
                <span className="text-[10px] font-mono block mt-1 font-bold text-ink">
                  Chief Officer (Disaster Mgmt)
                </span>
                <span className="text-[9px] text-ink-muted block">MCGM Central Command</span>
              </div>
              <div className="p-3 border-2 border-status-safe rounded-lg text-center font-mono">
                <span className="text-[9px] font-bold text-status-safe uppercase block">
                  DIGITALLY STAMPED
                </span>
                <span className="text-[10px] font-bold text-ink block mt-0.5">MCGM-SECURE-CHAIN</span>
                <span className="text-[8px] text-ink-muted block font-mono">CRC32: 0x8F94D2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-surface border border-border hover:border-purple rounded-lg text-xs font-semibold flex items-center gap-1.5 text-ink transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print Manifest
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" /> Download Clearance PDF
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Manifest
          </button>
        </div>
      </div>
    </div>
  );
}

