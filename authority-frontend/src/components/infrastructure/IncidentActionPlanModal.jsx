import React, { useState } from 'react';
import {
  FileText,
  X,
  Printer,
  Copy,
  CheckCircle2,
  Download,
  Shield,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function IncidentActionPlanModal({ asset, onClose }) {
  const { addCommandLog } = useFloodCommand();
  const [copied, setCopied] = useState(false);
  const [operationalPeriod, setOperationalPeriod] = useState('18:00 - 24:00 IST (Monsoon Flash Flood Window)');
  const [commanderSignoff, setCommanderSignoff] = useState('Cmdr. Duty Officer (BMC EOC Operations)');

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const iapText = `================================================================================
MUNICIPAL CORPORATION OF GREATER MUMBAI - DISASTER MANAGEMENT DEPARTMENT
INCIDENT ACTION PLAN (IAP) - CRITICAL INFRASTRUCTURE DEFENSE DOSSIER
FORM ICS-202 / ICS-204 (TACTICAL SITE DEFENSE SPECIFICATION)
================================================================================

1. FACILITY NAME: ${asset.name}
2. ADMINISTRATIVE WARD: ${asset.ward}
3. SECTOR CLASSIFICATION: ${asset.type}
4. OPERATIONAL PERIOD: ${operationalPeriod}
5. DATE GENERATED: ${currentDate} | STATUS: ACTIVE OPERATIONAL DIRECTIVE

--------------------------------------------------------------------------------
SECTION I: HAZARD ASSESSMENT & HYDRAULIC PROFILE
--------------------------------------------------------------------------------
- Topographic Plinth Elevation: ${asset.plinthElevationMsl || 4.8} m MSL
- Peak Predicted Flood Depth: ${asset.predictedDepth} cm (Exposure Category: ${asset.exposure})
- Accessibility Rating: ${asset.accessibility}% Passable
- Submerged Approach Corridors: ${asset.affectedAccessRoads} Roadway(s)
- Primary Safe Corridor: ${asset.nearestSafeRoute || 'Eastern Express Elevated Bypass'}
- Foundation Hydrostatic Uplift: ${asset.foundationHealth?.upliftKPa || 22.4} kPa (Safe Limit: ${asset.foundationHealth?.allowableUpliftKPa || 65.0} kPa)

--------------------------------------------------------------------------------
SECTION II: OPERATIONAL OBJECTIVES & DEFENSE PRIORITIES
--------------------------------------------------------------------------------
1. Maintain zero water penetration into ground floor Casualty, ICU & Transformer bays.
2. Deploy physical barrier defense to all entry gates within 20 minutes of warning trigger.
3. Ensure uninterrupted power via elevated DG backup generators (minimum 24h fuel buffer).
4. Keep emergency ambulance/tender egress corridor clear with dedicated police pilot escort.
5. In case of water depth exceeding 30cm, declare Code Black divert to sister facilities.

--------------------------------------------------------------------------------
SECTION III: INGRESS GATE DEFENSE ASSIGNMENTS
--------------------------------------------------------------------------------
${(asset.ingressGates || [])
  .map(
    (g, idx) =>
      `GATE #${idx + 1}: ${g.name}
  - Flood Depth: ${g.depthCm} cm | Barrier: ${g.barrierType} (${g.barrierHeightCm}cm)
  - Seal Status: ${g.gasketSealed ? 'Pneumatic Silicone Sealed' : 'Awaiting Inspection'}
  - Operational Status: ${g.status}`
  )
  .join('\n\n')}

--------------------------------------------------------------------------------
SECTION IV: CRITICAL RESILIENCE TELEMETRY & RESOURCES
--------------------------------------------------------------------------------
- Backup Power: ${asset.dgGenerators?.[0]?.name || 'Cummins Heavy Genset'} (Fuel: ${asset.dgGenerators?.[0]?.fuelPercent || 85}%, ${asset.dgGenerators?.[0]?.runtimeHours || 24}h runtime)
- Dewatering Capacity: ${asset.sumpPumps?.reduce((acc, p) => acc + (p.capacityM3 || 0), 0) || 1200} m³/hr across on-site pumps
- Medical Lifeline Status: ${asset.beds || 0} Beds (${asset.icuBeds || 0} ICUs, ${asset.ventilators || 0} Ventilators)
- Emergency Oxygen Buffer: ${asset.reserves?.medicalOxygenDays || 4.5} Days Supply
- Diesel Fuel Reserves: ${asset.reserves?.dieselReserveLiters || 12000} Liters
- On-Site Flood Sandbags: ${asset.reserves?.sandbagsOnSite || 400} Units Staged

--------------------------------------------------------------------------------
SECTION V: INTER-AGENCY LIAISON & ESCALATION CONTACTS
--------------------------------------------------------------------------------
- Designated On-Site Lead: ${asset.incidentCommander?.name || 'Medical Superintendent / Chief Engineer'}
- Direct Tactical Radio: ${asset.incidentCommander?.radioCh || 'VHF Ch-01'} | Phone: ${asset.incidentCommander?.phone || '+91 22 2400 0000'}
- Dedicated Sister Facility: ${asset.nearestSisterHospital || 'Regional Apex Hospital'}
- Emergency Heli-Evacuation LZ: ${asset.heliPadLocation || 'Designated Regional Helipad'}
- Incident Signoff: ${commanderSignoff}
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    addCommandLog({
      officer: 'Operations Desk',
      type: 'IAP_EXPORTED',
      details: `Generated and copied formal Disaster Incident Action Plan for ${asset.name}`,
      status: 'DOCUMENTED',
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; font-size: 11px; white-space: pre-wrap; padding: 20px;">${iapText}</pre>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/30">
              <FileText className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Incident Action Plan (IAP) Generator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold uppercase">
                  ICS-202/204 Standard
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Official Operational Defense Directive for {asset.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-border/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          {/* Inputs Row */}
          <div className="grid grid-cols-2 gap-3 bg-surface-secondary/50 p-3 rounded-xl border border-border">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-ink-secondary mb-1">
                Operational Period
              </label>
              <input
                type="text"
                value={operationalPeriod}
                onChange={(e) => setOperationalPeriod(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono focus:outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-ink-secondary mb-1">
                Authorizing Incident Commander
              </label>
              <input
                type="text"
                value={commanderSignoff}
                onChange={(e) => setCommanderSignoff(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          {/* IAP Document Preview */}
          <div className="bg-canvas border border-border rounded-xl p-3.5 font-mono text-[11px] leading-relaxed text-ink overflow-x-auto max-h-[50vh] whitespace-pre-wrap select-all">
            {iapText}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-purple text-ink flex items-center gap-1.5 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied IAP Text' : 'Copy Formatted Text'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple text-white hover:bg-purple-deep shadow-subtle flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

