import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Download,
  Printer,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function MeteorologicalBulletinModal({ isOpen, onClose, selectedCell }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const now = new Date();
  const bulletinRef = `NOWCAST/MCGM-IMD/${now.toISOString().slice(0, 10)}/1830IST`;

  const reportText = `================================================================================
IMD COLABA DOPPLER RADAR & MCGM DISASTER MANAGEMENT CELL
HIGH-RESOLUTION SEVERE WEATHER NOWCAST & SITUATION BULLETIN (0–3 HOURS)
================================================================================
BULLETIN ID    : ${bulletinRef}
ISSUE TIME     : 18:30 IST (${now.toLocaleDateString()})
RADAR SOURCE   : IMD Colaba S-Band Dual-Polarization Radar (100km Range, 0.5° Tilt)
LEAD TIME      : 0 to 180 Minutes (Valid until 21:30 IST)
CONFIDENCE     : 91.8% (Dual-Pol ConvLSTM + AWS Assimilation)

1. CURRENT METEOROLOGICAL SITUATION:
--------------------------------------------------------------------------------
Doppler Radar Volume Scans detect multiple intense convective thunderstorm
cells propagating along a prevailing 042° (Northeast) trajectory at 18–21 km/h.
Core reflectivity exceeds 58–62 dBZ over Kurla, Sion, and Andheri East corridors,
producing instantaneous precipitation intensities of 75–95 mm/hr.

2. TRACKED CONVECTIVE CELLS:
--------------------------------------------------------------------------------
• CELL ALPHA (C-01): 58 dBZ | 88 mm/hr | Bearing 042° @ 18.2 km/h | Echo Top 13.8 km
  Targeting: Ward L (Kurla), Ward F/N (Sion), LBS Marg Corridors.
• CELL BETA (C-02) : 62 dBZ | 94 mm/hr | Bearing 038° @ 19.0 km/h | Echo Top 14.5 km
  Targeting: Chunabhatti, Eastern Freeway, Chembur Mahul Catchment.
• CELL GAMMA (C-03): 46 dBZ | 52 mm/hr | Bearing 085° @ 14.5 km/h | Echo Top 10.2 km
  Targeting: Ghatkopar East, Pant Nagar, Vikhroli.
• CELL DELTA (C-04): 51 dBZ | 64 mm/hr | Bearing 045° @ 21.0 km/h | Echo Top 12.1 km
  Targeting: South Coastal Channel, Mahim Bay Outfall.

3. CRITICAL INUNDATION RISKS & CIVIC LIFELINES:
--------------------------------------------------------------------------------
• KURLA RAILWAY SUBWAY & LBS MARG: Critical surcharge imminent. Predicted depth
  reaching 30–45 cm within 20 minutes. Immediate barricading mandatory.
• ANDHERI SUBWAY: Depression funnel accumulation. High water velocity 0.45 m/s.
• SION CIRCLE / GANDHI MARKET: Mithi river backpressure coincides with upcoming
  tide level. Drainage surcharge alert active.
• CSMIA AIRPORT (RUNWAY 09/27): Torrential downpour threshold advisory issued.

4. MANDATED OPERATIONAL DIRECTIVES:
--------------------------------------------------------------------------------
1. Activate all 6 Archimedean screw pumps at Mahim Stormwater Pumping Station.
2. Deploy mobile 100 HP trailer pumps to Kurla Subway and Milan Underpass sumps.
3. Keep Western & Central Railway suburban control rooms on high alert for signal track sumps.
4. Broadcast automated CAP v1.2 cell broadcast advisory to Wards K/E, L, and F/N.
5. Next scheduled radar sweep update in 1.8 minutes.

================================================================================
AUTHORIZED BY: Duty Meteorologist, IMD Colaba Nowcast Unit
COORDINATED WITH: MCGM Chief Disaster Management Officer (CDMO)
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nowcast_Situation_Bulletin_${bulletinRef.replace(/\//g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Automated Meteorological Situation Bulletin &amp; Handover Briefing
              </h3>
              <p className="text-xs text-ink-secondary">
                Official IMD Colaba &amp; MCGM Disaster Management Operational Dispatch
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

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-ink-secondary">
              Bulletin Reference: <strong className="text-purple">{bulletinRef}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border hover:border-purple text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-purple text-white hover:bg-purple-deep text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
              >
                {downloaded ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloaded ? 'Downloaded' : 'Download TXT'}</span>
              </button>
            </div>
          </div>

          {/* Monospace Situation Report Viewport */}
          <pre className="p-4 bg-[#14111B] text-[#EDE8FF] rounded-xl border border-border font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre selection:bg-purple selection:text-white">
            {reportText}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Compliant with WMO-No. 558 &amp; NDMA National Disaster Warning Protocols
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

