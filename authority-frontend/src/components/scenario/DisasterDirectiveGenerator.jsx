import React, { useState } from 'react';
import {
  Megaphone,
  Radio,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function DisasterDirectiveGenerator({ scenarioParams }) {
  const { setAlertsList } = useFloodCommand();
  const [copied, setCopied] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);

  const isRedAlert = scenarioParams.rainfallIntensity >= 90 || scenarioParams.tideLevel >= 4.8;
  const isOrangeAlert = !isRedAlert && (scenarioParams.rainfallIntensity >= 65 || scenarioParams.drainBlockage >= 45);

  const alertLevel = isRedAlert ? 'RED ALERT (LEVEL 3 CATASTROPHIC)' : isOrangeAlert ? 'ORANGE ALERT (LEVEL 2 SEVERE)' : 'YELLOW ADVISORY (LEVEL 1)';

  const directiveText = `MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM) // DISASTER MANAGEMENT CELL
URGENT DIRECTIVE REF: BMC-DM/FLD/${new Date().getFullYear()}/${Math.round(scenarioParams.rainfallIntensity * 12)}
DATE/TIME: ${new Date().toLocaleDateString('en-IN')} | ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
STATUS: ${alertLevel}

1. METEOROLOGICAL SITUATION:
Parametric hydrodynamic simulation models severe rainfall rate of ${scenarioParams.rainfallIntensity} mm/h over next ${scenarioParams.durationMin} minutes coupled with coastal sea outfall tide level of ${scenarioParams.tideLevel}m MSL. Infill siltation estimated at ${scenarioParams.drainBlockage}%.

2. HIGH-RISK ZONES & INUNDATION HOTSPOTS:
- Low-lying depressions: Hindmata Sump, Milan Subway, Andheri Subway, Kurla Chunabhatti, Sion Circle, Dharavi T-Junction.
- Projected peak inundation depth: ${(42 + (scenarioParams.rainfallIntensity - 50) * 0.4).toFixed(0)} - ${(55 + (scenarioParams.rainfallIntensity - 50) * 0.5).toFixed(0)} cm.

3. MANDATORY OPERATIONAL ORDERS:
- TRAFFIC POLICE: Enforce immediate physical barricading and traffic diversion at Milan, Andheri, and Khar Subways. Divert SV Road traffic to Western Express Highway flyovers.
- CITIZEN ADVISORY: Citizens advised to remain indoors, avoid wading through submerged roads, and refrain from venturing near Mahim Creek, Mithi River banks, and sea promenades during high tide lock.
- MUNICIPAL WARD CREWS: Immediate deployment of high-discharge mobile trailer de-watering pumps at Sion F/N and Kurla Ward L.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(directiveText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBroadcast = () => {
    const newAlert = {
      id: `AL-${Date.now().toString().slice(-4)}`,
      title: `${alertLevel}: ${scenarioParams.rainfallIntensity}mm/h CONVECTIVE STORM FORECAST`,
      wards: ['Ward F/N', 'Ward L', 'Ward K/E', 'Ward G/N'],
      status: 'PUBLISHED - ACTIVE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      audienceReach: '1,250,000 citizens',
      depthRange: `${(35 + (scenarioParams.rainfallIntensity - 50) * 0.3).toFixed(0)}–${(50 + (scenarioParams.rainfallIntensity - 50) * 0.4).toFixed(0)} cm`,
      channels: ['Cell Broadcast (CAP)', 'VMS Dynamic Screens', 'Disaster Citizen App', 'Emergency Siren'],
    };

    if (setAlertsList) {
      setAlertsList((prev) => [newAlert, ...prev]);
    }
    setBroadcasted(true);
    setTimeout(() => setBroadcasted(false), 3500);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-alert-soft text-status-alert">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Automated Disaster Directive &amp; Advisory Dispatcher
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isRedAlert ? 'bg-status-alert-soft text-status-alert' : 'bg-status-warning-soft text-status-warning'
              }`}>
                {alertLevel.split(' ')[0]} {alertLevel.split(' ')[1]}
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Algorithmic synthesis of official NDMA / BMC emergency orders, traffic diversions, and public CAP broadcasts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-mono rounded-lg border border-border hover:bg-surface-secondary text-ink flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-purple" />
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handleBroadcast}
            disabled={broadcasted}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-status-alert hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors shadow-subtle disabled:opacity-50"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{broadcasted ? 'Broadcast Sent!' : 'Push to Emergency Queue'}</span>
          </button>
        </div>
      </div>

      {/* Directive Preview Block */}
      <div className="p-3 bg-canvas border border-border rounded-xl font-mono text-[11px] text-ink/90 leading-relaxed max-h-44 overflow-y-auto whitespace-pre-wrap select-all">
        {directiveText}
      </div>

      {/* Broadcast Status Confirmation */}
      {broadcasted && (
        <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe/40 flex items-center gap-2 text-xs font-mono text-status-safe animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Emergency Directive staged and published to Common Alerting Protocol (CAP) gateway. Total Reach: 1.25M Citizens.
          </span>
        </div>
      )}
    </div>
  );
}
