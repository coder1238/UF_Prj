import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Activity,
  FileText,
  SunMedium,
  ShieldAlert,
  FileCode,
  RotateCw,
  Download,
  Server,
  Radio,
  Sliders,
  RefreshCw
} from 'lucide-react';
import {
  SUBSYSTEM_DIAGNOSTICS_DATA,
  RAW_FEED_PAYLOADS,
  TAMPER_EVIDENT_AUDIT_LOGS
} from './systemHealthConstants';

// 15. Storage Volumes & Ceph/NVMe Distributed Disk Array
export function StorageNvmeArrayModal({ isOpen, onClose, onNotify }) {
  const [pools, setPools] = useState([
    { name: 'LiDAR 3D Point Clouds', used: '18.4 TB', total: '25.0 TB', pct: 73, type: 'NVMe All-Flash Tier' },
    { name: 'Doppler Raw Sweeps', used: '8.2 TB', total: '12.0 TB', pct: 68, type: 'Ceph Erasure Coded' },
    { name: 'Dynamic SWE netCDF Rasters', used: '4.1 TB', total: '10.0 TB', pct: 41, type: 'Ceph Block Device' },
    { name: 'CCTV Telemetry Snippets', used: '12.6 TB', total: '15.0 TB', pct: 84, type: 'Ceph S3 Object Store' }
  ]);
  const [isApplyingPolicy, setIsApplyingPolicy] = useState(false);

  if (!isOpen) return null;

  const handleApplyPolicy = () => {
    setIsApplyingPolicy(true);
    setTimeout(() => {
      setPools(prev => prev.map(p => p.name === 'Doppler Raw Sweeps' ? { ...p, used: '5.8 TB', pct: 48 } : p));
      setIsApplyingPolicy(false);
      onNotify('90-day cold retention lifecycle policy executed. 2.4 TB transitioned to Glacier tier.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Storage Volumes &amp; Ceph/NVMe Distributed Disk Array
              </h3>
              <p className="text-xs text-ink-secondary">Enterprise storage pools for LiDAR DEMs, Doppler raw files, and raster netCDFs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-3">
            {pools.map((p) => (
              <div key={p.name} className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{p.name}</span>
                  <span className="font-mono text-xs text-purple font-semibold">
                    {p.used} / {p.total} ({p.pct}%)
                  </span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.pct > 80 ? 'bg-status-warning' : 'bg-purple'}`}
                    style={{ width: `${p.pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-ink-secondary font-mono">
                  <span>Storage Tier: {p.type}</span>
                  <span className="text-status-safe">IOPS Health: 142k</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Cold Retention Lifecycle</span>
              <span className="text-[11px] text-ink-secondary">Archive historical radar sweeps older than 90 days to municipal cold storage.</span>
            </div>
            <button
              disabled={isApplyingPolicy}
              onClick={handleApplyPolicy}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isApplyingPolicy ? 'animate-spin' : ''}`} />
              <span>{isApplyingPolicy ? 'Applying...' : 'Enforce Lifecycle'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 16. Live Synthetic Health Prober & Heartbeat Suite
export function SyntheticHealthProberModal({ isOpen, onClose, onNotify }) {
  const [probes, setProbes] = useState([
    { name: 'GIS Spatial Inundation API', url: 'https://spatial.mcgm.gov.in/health', status: 200, latency: 14, freq: '30s' },
    { name: 'Hydrology IoT Ingestion MQTT', url: 'mqtts://telemetry-iot.mcgm.gov.in:8883', status: 200, latency: 22, freq: '10s' },
    { name: 'IMD Doppler Radar Stream', url: 'wss://radar-telemetry.imd.gov.in', status: 200, latency: 38, freq: '15s' },
    { name: 'Emergency CAD Routing Gateway', url: 'https://cad.mcgm.gov.in/v1/route', status: 200, latency: 8, freq: '5s' }
  ]);
  const [probing, setProbing] = useState(false);

  if (!isOpen) return null;

  const handleRunProbes = () => {
    setProbing(true);
    setTimeout(() => {
      setProbes(prev => prev.map(p => ({
        ...p,
        latency: Math.max(4, p.latency + Math.floor(Math.random() * 6 - 3))
      })));
      setProbing(false);
      onNotify('All synthetic health check probes returned HTTP 200 OK.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Live Synthetic Health Prober &amp; Heartbeat Suite
              </h3>
              <p className="text-xs text-ink-secondary">Automated synthetic transactions executing continuous end-to-end probes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="p-2.5">Probe Target</th>
                  <th className="p-2.5">Endpoint URL</th>
                  <th className="p-2.5">Interval</th>
                  <th className="p-2.5">Latency</th>
                  <th className="p-2.5">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {probes.map((p) => (
                  <tr key={p.name} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink font-sans">{p.name}</td>
                    <td className="p-2.5 text-ink-secondary truncate max-w-[200px]">{p.url}</td>
                    <td className="p-2.5 text-ink">{p.freq}</td>
                    <td className="p-2.5 text-purple font-bold">{p.latency} ms</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {p.status} OK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-surface-secondary/40 rounded-xl border border-border">
            <span className="text-[11px] text-ink-secondary">All probes running via distributed agents across Mumbai POPs.</span>
            <button
              disabled={probing}
              onClick={handleRunProbes}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${probing ? 'animate-spin' : ''}`} />
              <span>{probing ? 'Probing...' : 'Run All Probes Now'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 17. Incident & Outage Post-Mortem Generator
export function IncidentPostmortemModal({ isOpen, onClose, onNotify }) {
  if (!isOpen) return null;

  const handleDownloadReport = () => {
    const reportText = `# MCGM DISASTER MANAGEMENT AUTHORITY - INCIDENT POST-MORTEM
Incident ID: INC-20260922-04
Date/Time: 2026-09-22 18:31 IST
Severity: SEV-2 (Moderate Degradation)
Subsystem: MITHI_WL_09 Ultrasonic Telemetry Dropout

## Summary
A signal attenuation incident occurred on sensor MITHI_WL_09 located at BKC Dharavi Bridge due to localized antenna dampening.
The sensor transitioned to cellular fallback.

## Timeline
- 18:25 IST: RSSI dropped from -64 dBm to -88 dBm.
- 18:28 IST: Gateway flagged degradation warning.
- 18:30 IST: Automated failover to Secondary 4G APN.
- 18:32 IST: Sensor telemetry re-stabilized.

## Metrics
- Time to Detect (TTD): 3.0 min
- Time to Mitigate (TTM): 4.0 min
- Mean Time to Repair (MTTR): 18.4 min
- Hydraulic Impact: Zero (Interpolated from MITHI_WL_08)

Audited by: MCGM Disaster Operations Center
`;
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-postmortem-INC-20260922-04.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Incident post-mortem report downloaded (.md).');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Incident &amp; Outage Post-Mortem Generator (ISO/ITIL)
              </h3>
              <p className="text-xs text-ink-secondary">Automated root-cause analysis and operational audit report generator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Incident MTTR</span>
              <div className="text-xl font-bold text-purple mt-0.5">18.4 min</div>
              <span className="text-[10px] text-status-safe">Target: &lt; 30 min</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Active Incident</span>
              <div className="text-xl font-bold text-status-warning mt-0.5">SEV-2 Alert</div>
              <span className="text-[10px] text-ink-secondary">MITHI_WL_09 Signal</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Data Loss</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">0.00%</div>
              <span className="text-[10px] text-ink-secondary">Buffered on Edge</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-2 font-sans">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Executive Summary</h4>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Automated generator compiles sensor logs, network traces, and operator decisions into a formal ITIL/ISO 20000 post-mortem document for civic audit and regulatory review.
            </p>
            <div className="pt-2">
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Post-Mortem Report (.md)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 18. Environmental Sensor Power Grid & Solar Microgrid Telemetry
export function SensorSolarTelemetryModal({ isOpen, onClose, onNotify }) {
  const [ecoMode, setEcoMode] = useState(false);

  if (!isOpen) return null;

  const handleToggleEco = () => {
    setEcoMode(!ecoMode);
    onNotify(!ecoMode ? 'Eco-Mode engaged. Sensor polling interval changed from 30s to 120s to conserve battery.' : 'Standard mode restored. 30s polling interval.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Environmental Sensor Power Grid &amp; Solar Microgrid
              </h3>
              <p className="text-xs text-ink-secondary">Solar panel wattage vs battery discharge curves during continuous overcast monsoon days</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Mean System Voltage</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">13.4 V</div>
              <span className="text-[10px] text-ink-secondary">Nominal (12V LiFePO4)</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Solar Irradiance</span>
              <div className="text-xl font-bold text-ink mt-0.5">340 W/m²</div>
              <span className="text-[10px] text-status-warning">Heavy Overcast</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Autonomy Reserve</span>
              <div className="text-xl font-bold text-purple mt-0.5">96 Hours</div>
              <span className="text-[10px] text-status-safe">Without Direct Sun</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-ink block">Dynamic Low-Power Eco-Mode</span>
                <span className="text-[11px] text-ink-secondary">
                  When overcast monsoon skies persist &gt; 48 hours, automatically throttle telemetry reporting frequency.
                </span>
              </div>
              <button
                onClick={handleToggleEco}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  ecoMode ? 'bg-amber-500 text-white' : 'bg-surface hover:bg-surface-secondary text-ink border border-border'
                }`}
              >
                {ecoMode ? 'Eco-Mode Active' : 'Enable Eco-Mode'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 19. Security Firewall & WAF Threat Telemetry
export function WafFirewallTelemetryModal({ isOpen, onClose, onNotify }) {
  const [blockedCount, setBlockedCount] = useState(1420);

  if (!isOpen) return null;

  const handleBlockIp = () => {
    setBlockedCount(prev => prev + 1);
    onNotify('Suspicious CIDR range added to GovNET dynamic blackhole filter.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Web Application Firewall (WAF) &amp; Threat Telemetry
              </h3>
              <p className="text-xs text-ink-secondary">Cloudflare / ModSecurity OWASP Core Rule Set guarding critical GIS infrastructure</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Threats Blocked (24h)</span>
              <div className="text-xl font-bold text-status-alert mt-0.5">{blockedCount.toLocaleString()}</div>
              <span className="text-[10px] text-status-safe">100% Mitigated</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Spatial SQL Injections</span>
              <div className="text-xl font-bold text-ink mt-0.5">8 Attempts</div>
              <span className="text-[10px] text-ink-secondary">ST_Intersects fuzzing</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Geo-Fence Status</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">HARDENED</div>
              <span className="text-[10px] text-ink-secondary">India Only (GovNET)</span>
            </div>
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border space-y-2 font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink text-xs uppercase tracking-wider">Recent Blocked Attack Vectors</span>
              <button
                onClick={handleBlockIp}
                className="px-2.5 py-1 bg-purple text-white hover:bg-purple-600 rounded text-[10px] font-semibold transition-colors"
              >
                + Blacklist Detected Rogue CIDR
              </button>
            </div>
            <div className="font-mono text-[11px] space-y-1.5">
              <div className="p-2 bg-surface rounded border border-border flex justify-between">
                <span className="text-status-alert font-bold">[BLOCKED] SQLi payload on /api/v1/wards?filter=OR+1=1</span>
                <span className="text-ink-secondary">Source: 185.220.101.4</span>
              </div>
              <div className="p-2 bg-surface rounded border border-border flex justify-between">
                <span className="text-status-alert font-bold">[BLOCKED] Unauthorized LoRaWAN MQTT Client Token</span>
                <span className="text-ink-secondary">Source: Rogue Gateway</span>
              </div>
              <div className="p-2 bg-surface rounded border border-border flex justify-between">
                <span className="text-status-alert font-bold">[BLOCKED] High-rate Layer 7 volumetric flood (8,200 req/s)</span>
                <span className="text-ink-secondary">Mitigated by Token Bucket</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 20. Audit Log & Tamper-Evident SHA-256 Event Chain
export function Sha256AuditChainModal({ isOpen, onClose, onNotify }) {
  const [logs, setLogs] = useState(TAMPER_EVIDENT_AUDIT_LOGS);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setLogs(prev => prev.map(l => ({ ...l, status: 'CRYPTOGRAPHICALLY VALIDATED' })));
      setIsVerifying(false);
      onNotify('Cryptographic SHA-256 hash chaining verification passed. 4,829 blocks intact.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Audit Log &amp; Tamper-Evident SHA-256 Event Chain
              </h3>
              <p className="text-xs text-ink-secondary">Cryptographically hashed operational blockchain ledger for municipal legal defensibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="p-2.5">Block #</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Operator</th>
                  <th className="p-2.5">Action Executed</th>
                  <th className="p-2.5">SHA-256 Hash</th>
                  <th className="p-2.5">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {logs.map((l) => (
                  <tr key={l.block} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-purple">#{l.block}</td>
                    <td className="p-2.5 text-ink-secondary">{l.timestamp}</td>
                    <td className="p-2.5 font-sans font-medium text-ink">{l.operator}</td>
                    <td className="p-2.5 text-ink font-semibold">{l.action}</td>
                    <td className="p-2.5 text-ink-secondary">{l.hash}</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border flex items-center justify-between font-sans">
            <div>
              <span className="font-bold text-ink block">Cryptographic Chain Verification</span>
              <span className="text-[11px] text-ink-secondary">Walk through Merkle trees and verify prevHash matches to detect data tampering.</span>
            </div>
            <button
              disabled={isVerifying}
              onClick={handleVerifyLedger}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Ledger Integrity'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// CORE EXISTING FEATURE ENHANCEMENT MODALS:

// Subsystem Deep Dive Modal (For clicking the 5 top cards)
export function SubsystemDeepDiveModal({ subsystemId, isOpen, onClose, onNotify }) {
  const [isRestarting, setIsRestarting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  if (!isOpen || !subsystemId) return null;
  const data = SUBSYSTEM_DIAGNOSTICS_DATA[subsystemId] || SUBSYSTEM_DIAGNOSTICS_DATA['api-gateway'];

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      onNotify(`Subsystem ${data.name} rolling worker restart completed.`);
    }, 1200);
  };

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      onNotify(`Ping response from ${data.name}: 200 OK (Latency: ${data.p50Latency})`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Subsystem Diagnostics: {data.name}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  {data.status} ({data.uptime})
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">{data.version}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">p99 Latency</span>
              <div className="text-lg font-bold text-status-safe mt-0.5">{data.p99Latency}</div>
              <span className="text-[9px] text-ink-secondary">p50: {data.p50Latency}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Throughput</span>
              <div className="text-lg font-bold text-ink mt-0.5">{data.rps}</div>
              <span className="text-[9px] text-status-safe">Errors: {data.errorRate}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">CPU Usage</span>
              <div className="text-lg font-bold text-purple mt-0.5">{data.cpuUsage}%</div>
              <span className="text-[9px] text-ink-secondary">RAM: {data.memUsage}%</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Active Conns</span>
              <div className="text-lg font-bold text-ink mt-0.5">{data.activeConnections}</div>
              <span className="text-[9px] text-status-safe">Pool Healthy</span>
            </div>
          </div>

          <div className="p-3 bg-surface-secondary/40 rounded-xl border border-border space-y-1.5">
            <span className="font-bold text-ink text-xs font-sans">Active Clustered Nodes</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {data.nodes.map(n => (
                <span key={n} className="px-2 py-1 bg-surface border border-border rounded-md text-ink">
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-ink text-xs font-sans">Recent Subsystem Stream Events</span>
            <div className="p-3 bg-[#1B1924] text-[#D8D4E5] rounded-xl font-mono text-[10px] space-y-1 max-h-32 overflow-y-auto">
              {data.recentLogs.map((log, i) => (
                <div key={i} className="text-white/90">{log}</div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1 font-sans">
            <button
              disabled={isPinging}
              onClick={handlePing}
              className="px-3.5 py-2 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 text-purple ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Send Test Ping'}</span>
            </button>

            <button
              disabled={isRestarting}
              onClick={handleRestart}
              className="px-3.5 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
              <span>{isRestarting ? 'Restarting Pods...' : 'Simulate Rolling Worker Restart'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Feed Stream Packet Inspector (For clicking ingestion stream rows)
export function FeedStreamInspectorModal({ feed, isOpen, onClose, onNotify, onToggleStatus }) {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen || !feed) return null;
  const payloadData = RAW_FEED_PAYLOADS[feed.source] || {
    endpoint: 'https://telemetry.mcgm.gov.in/api/v1/stream',
    authType: 'Standard API Key',
    samplePayload: { source: feed.source, status: feed.status, timestamp: new Date().toISOString() }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onNotify(`Ingest pipeline force-synced for ${feed.source}. Latest packet received.`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Ingestion Stream Inspector: {feed.source}
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  feed.status === 'ONLINE' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'
                }`}>
                  {feed.status}
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">{feed.protocol}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Ingest Latency</span>
              <div className="text-xl font-bold text-ink mt-0.5">{feed.latency}</div>
              <span className="text-[10px] text-status-safe">Target &lt; 500ms</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Payload Quality</span>
              <div className="text-xl font-bold text-purple mt-0.5">{feed.quality}</div>
              <span className="text-[10px] text-ink-secondary">SLA: 99.4%</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Spatial Coverage</span>
              <div className="text-xs font-bold text-ink mt-1 truncate">{feed.coverage}</div>
              <span className="text-[10px] text-status-safe">All Wards Active</span>
            </div>
          </div>

          <div className="p-3 bg-surface-secondary/40 rounded-xl border border-border space-y-1 font-sans">
            <div className="text-[11px] font-bold text-ink">Stream Endpoint:</div>
            <div className="font-mono text-[10px] text-purple truncate">{payloadData.endpoint}</div>
            <div className="text-[11px] font-bold text-ink mt-2">Authentication Token:</div>
            <div className="font-mono text-[10px] text-ink-secondary">{payloadData.authType}</div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-ink text-xs font-sans">Sample Ingested JSON/GeoJSON Telemetry Packet</span>
            <div className="p-3 bg-[#1B1924] text-[#86EFAC] rounded-xl font-mono text-[10px] max-h-48 overflow-y-auto">
              <pre>{JSON.stringify(payloadData.samplePayload, null, 2)}</pre>
            </div>
          </div>

          <div className="flex gap-2 pt-1 font-sans">
            <button
              disabled={isSyncing}
              onClick={handleSync}
              className="px-3.5 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Force Immediate Stream Sync'}</span>
            </button>

            <button
              onClick={() => {
                onToggleStatus(feed.source);
                onNotify(`Simulated state toggled for ${feed.source}`);
              }}
              className="px-3.5 py-2 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg text-xs font-semibold transition-colors"
            >
              Simulate Status Toggle ({feed.status === 'ONLINE' ? 'Degrade' : 'Restore'})
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Queue Management Console Modal (For clicking execution queues)
export function QueueManagerModal({ queueData, isOpen, onClose, onNotify, onUpdateQueue }) {
  const [concurrency, setConcurrency] = useState(queueData?.concurrency || 4);
  const [isRetryingDLQ, setIsRetryingDLQ] = useState(false);

  if (!isOpen || !queueData) return null;

  const handleConcurrencyChange = (delta) => {
    const next = Math.max(1, Math.min(16, concurrency + delta));
    setConcurrency(next);
    onUpdateQueue({ ...queueData, concurrency: next });
    onNotify(`Queue concurrency set to ${next} workers.`);
  };

  const handleRetryDLQ = () => {
    setIsRetryingDLQ(true);
    setTimeout(() => {
      setIsRetryingDLQ(false);
      onUpdateQueue({ ...queueData, deadLetterQueueCount: 0 });
      onNotify('Dead Letter Queue reprocessed. 0 failed jobs remaining.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Execution Queue Manager: {queueData.name}
              </h3>
              <p className="text-xs text-ink-secondary">Manage Celery/BullMQ worker concurrency, backlog queue, and dead-letter tasks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Throughput</span>
              <div className="text-xl font-bold text-ink mt-0.5">{queueData.throughput}</div>
              <span className="text-[10px] text-status-safe">Processed: {queueData.jobsProcessedToday}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Current Depth</span>
              <div className={`text-xl font-bold mt-0.5 ${queueData.queueDepth > 0 ? 'text-status-alert' : 'text-status-safe'}`}>
                {queueData.queueDepth} queued
              </div>
              <span className="text-[10px] text-ink-secondary">Avg Duration: {queueData.avgJobDuration}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Failed in DLQ</span>
              <div className="text-xl font-bold text-status-warning mt-0.5">{queueData.deadLetterQueueCount} jobs</div>
              <span className="text-[10px] text-ink-secondary">Auto-Retry: 3x</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-2 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-ink block">Worker Pool Concurrency</span>
                <span className="text-[11px] text-ink-secondary">Scale parallel execution threads for this operational queue.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConcurrencyChange(-1)}
                  className="px-2.5 py-1 bg-surface hover:bg-surface-secondary border border-border rounded font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm px-2 text-purple">{concurrency} Workers</span>
                <button
                  onClick={() => handleConcurrencyChange(1)}
                  className="px-2.5 py-1 bg-surface hover:bg-surface-secondary border border-border rounded font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-ink text-xs font-sans">Recent Queue Jobs</span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {queueData.recentJobs.map((j) => (
                <div key={j.id} className="p-2 bg-surface rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple">{j.id}</span>
                    <span className="text-ink ml-2 font-sans">{j.task}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-ink-secondary text-[10px]">{j.duration}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      j.status === 'COMPLETED'
                        ? 'bg-status-safe-soft text-status-safe'
                        : j.status === 'RUNNING'
                        ? 'bg-purple/10 text-purple'
                        : 'bg-status-alert-soft text-status-alert'
                    }`}>
                      {j.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {queueData.deadLetterQueueCount > 0 && (
            <div className="p-3 bg-status-warning-soft rounded-xl border border-status-warning flex items-center justify-between font-sans">
              <span className="text-status-warning text-xs font-semibold">
                There are {queueData.deadLetterQueueCount} jobs in the Dead Letter Queue.
              </span>
              <button
                disabled={isRetryingDLQ}
                onClick={handleRetryDLQ}
                className="px-3 py-1.5 bg-status-warning text-white font-semibold rounded-lg text-xs flex items-center gap-1.5"
              >
                <RotateCw className={`w-3 h-3 ${isRetryingDLQ ? 'animate-spin' : ''}`} />
                <span>Retry DLQ</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Flush Ingest Cache Modal
export function FlushCacheModal({ isOpen, onClose, onNotify }) {
  const [flushing, setFlushing] = useState(false);
  const [stats, setStats] = useState({ keys: 14820, memoryMb: 1420, tiles: 8940 });

  if (!isOpen) return null;

  const handleFlush = () => {
    setFlushing(true);
    setTimeout(() => {
      setStats({ keys: 0, memoryMb: 0, tiles: 0 });
      setFlushing(false);
      onNotify('Ingestion & GIS tile cache flushed successfully. 1.42 GB memory reclaimed.');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-elevated flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-ink flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple" />
            Flush Ingest &amp; GIS Cache
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <p className="text-ink-secondary">
            This operation will purge active Redis L1 cache keys and invalidate cached MapLibre MVT vector tiles across all 24 wards.
          </p>

          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="p-2 bg-surface-secondary rounded-lg border border-border">
              <div className="text-[10px] text-ink-secondary">Keys to Evict</div>
              <div className="font-bold text-ink mt-0.5">{stats.keys.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-surface-secondary rounded-lg border border-border">
              <div className="text-[10px] text-ink-secondary">Tiles to Purge</div>
              <div className="font-bold text-ink mt-0.5">{stats.tiles.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-surface-secondary rounded-lg border border-border">
              <div className="text-[10px] text-ink-secondary">Memory Freed</div>
              <div className="font-bold text-purple mt-0.5">{stats.memoryMb} MB</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2 bg-surface-secondary/20">
          <button onClick={onClose} className="px-3.5 py-1.5 border border-border rounded-lg text-xs font-semibold text-ink">
            Cancel
          </button>
          <button
            disabled={flushing}
            onClick={handleFlush}
            className="px-4 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${flushing ? 'animate-spin' : ''}`} />
            <span>{flushing ? 'Flushing Cache...' : 'Confirm Flush'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
