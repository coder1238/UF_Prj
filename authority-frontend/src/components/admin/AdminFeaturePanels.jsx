import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Cpu,
  Truck,
  BellRing,
  Package,
  Home,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Sliders,
  Database,
  Layers,
  MapPin,
  Key,
  Flame,
  Zap,
  PhoneCall,
  HardDrive,
  Download,
  Upload,
  Search,
  Plus,
  Eye,
  Check,
  X,
  ExternalLink,
  Smartphone,
  Server,
  ArrowRightLeft,
  Activity,
} from 'lucide-react';
import {
  MULTI_AGENCIES_DATA,
  TELEMETRY_PIPELINES_DATA,
  SIREN_NETWORK_DATA,
  SCADA_RULES_DATA,
  DESILTING_TENDERS_DATA,
  API_KEYS_DATA,
  PRE_MONSOON_COMPLIANCE_ITEMS,
} from './adminConstants';

// -------------------------------------------------------------
// FEATURE 1: Emergency Threat Escalation & DEFCON Matrix Controller
// -------------------------------------------------------------
export function ThreatEscalationPanel({ currentThreat, onThreatChange, showToast }) {
  const [checklist, setChecklist] = useState({
    cwcSync: true,
    ndrfStandby: true,
    mumbaiPoliceCoord: true,
    subwayGatesArmed: true,
    pumpingOverdrivePrimed: true,
  });

  const THREAT_LEVELS = [
    { id: 'LEVEL-1', name: 'LEVEL 1: NORMAL MONSOON ADVISORY', color: 'bg-status-safe text-white', border: 'border-status-safe', desc: 'Routine drainage patrols and routine pump maintenance' },
    { id: 'LEVEL-2', name: 'LEVEL 2: YELLOW ADVISORY ALERT', color: 'bg-status-warning text-white', border: 'border-status-warning', desc: 'Rainfall > 40mm/hr predicted; activate ward duty squads' },
    { id: 'LEVEL-3', name: 'LEVEL 3: ORANGE SEVERE SURGE', color: 'bg-orange-600 text-white', border: 'border-orange-500', desc: 'Spring tide > 4.2m co-occurring with intense downpour; subway diversions active' },
    { id: 'LEVEL-4', name: 'LEVEL 4: RED EMERGENCY (NDMA CODE VIOLET)', color: 'bg-status-alert text-white', border: 'border-status-alert', desc: 'Life safety risk; statutory disaster powers invoked, boat rescue deployed' },
  ];

  const toggleCheck = (k) => {
    setChecklist((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handleEscalate = (lvl) => {
    onThreatChange(lvl);
    showToast(`Municipal Emergency Posture transitioned to: ${lvl}`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Flame className="w-4 h-4 text-status-alert" />
            Feature 1: Municipal Threat Escalation &amp; Statutory DEFCON Matrix
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            National Disaster Management Act (NDMA Sec. 34) Special Emergency Authorization
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
          currentThreat === 'LEVEL-4' ? 'bg-status-alert text-white animate-pulse' : 'bg-status-warning text-white'
        }`}>
          CURRENT: {currentThreat}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {THREAT_LEVELS.map((lvl) => (
          <div
            key={lvl.id}
            onClick={() => handleEscalate(lvl.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              currentThreat === lvl.id
                ? `${lvl.border} ring-2 ring-purple/40 bg-surface shadow-subtle`
                : 'border-border bg-surface-secondary/60 hover:bg-surface'
            }`}
          >
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mb-1.5 ${lvl.color}`}>
              {lvl.id}
            </div>
            <div className="font-bold text-xs text-ink">{lvl.name}</div>
            <p className="text-[10px] text-ink-secondary mt-1 leading-relaxed">{lvl.desc}</p>
          </div>
        ))}
      </div>

      {/* Mandatory Statutory Protocol Checklist */}
      <div className="p-3 bg-surface-secondary/80 border border-border rounded-xl space-y-2">
        <div className="text-[11px] font-bold text-ink uppercase flex items-center justify-between">
          <span>Statutory Pre-Condition Verification Checklist</span>
          <span className="text-[10px] font-mono text-purple font-semibold">ALL MANDATORY</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {[
            { key: 'cwcSync', label: 'CWC & IMD Doppler Radar Synchronized' },
            { key: 'ndrfStandby', label: 'NDRF 5th Battalion Alert Transmitted' },
            { key: 'mumbaiPoliceCoord', label: 'Mumbai Traffic Police Subway Closure Ready' },
            { key: 'subwayGatesArmed', label: 'Andheri & Milan Subway Sluice Gates Primed' },
            { key: 'pumpingOverdrivePrimed', label: '6 Major Pumping Stations in 115% Standby' },
          ].map((chk) => (
            <div
              key={chk.key}
              onClick={() => toggleCheck(chk.key)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface cursor-pointer select-none"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                checklist[chk.key] ? 'bg-status-safe border-status-safe text-white' : 'border-border bg-surface'
              }`}>
                {checklist[chk.key] && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-[11px] text-ink">{chk.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 2: Multi-Agency Inter-Operability & SSO Federation Manager
// -------------------------------------------------------------
export function MultiAgencyPanel({ showToast }) {
  const [agencies, setAgencies] = useState(MULTI_AGENCIES_DATA);
  const [testingId, setTestingId] = useState(null);

  const handlePing = (id) => {
    setTestingId(id);
    setTimeout(() => {
      setAgencies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, latencyMs: Math.floor(15 + Math.random() * 40), lastSync: 'Just now' } : a))
      );
      setTestingId(null);
      showToast(`Agency handshake test verified: ${id.toUpperCase()}`);
    }, 600);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple" />
            Feature 2: Multi-Agency Inter-Operability &amp; SSO Federation
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Federated APIs &amp; Live Webhook Handshakes (8 Partner Organizations)
          </p>
        </div>
        <button
          onClick={() => {
            agencies.forEach((a) => handlePing(a.id));
          }}
          className="px-3 py-1 bg-surface-secondary hover:bg-border rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-purple" />
          <span>Ping All Gateways</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {agencies.map((ag) => (
          <div key={ag.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex flex-col justify-between gap-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-soft text-purple-deep font-bold">
                  {ag.protocol}
                </span>
                <span className="font-mono text-[10px] text-status-safe font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-ping" />
                  {ag.status}
                </span>
              </div>
              <h4 className="font-bold text-ink text-xs line-clamp-1">{ag.name}</h4>
              <p className="text-[10px] text-ink-secondary mt-0.5">Lead: {ag.lead}</p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[10px]">
              <div>
                <span className="text-ink-secondary">Latency: </span>
                <strong className="text-ink">{ag.latencyMs} ms</strong>
              </div>
              <button
                disabled={testingId === ag.id}
                onClick={() => handlePing(ag.id)}
                className="px-2 py-0.5 bg-surface border border-border hover:bg-surface-secondary rounded text-purple font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                {testingId === ag.id ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Activity className="w-2.5 h-2.5" />}
                <span>Ping</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 3: Security Posture, Network Firewall & Zero-Trust Access
// -------------------------------------------------------------
export function SecurityPosturePanel({ showToast }) {
  const [zeroTrustEnforced, setZeroTrustEnforced] = useState(true);
  const [fido2Required, setFido2Required] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [score, setScore] = useState(98);

  const handleRunVulnerabilityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScore(99);
      showToast('Zero-Trust Vulnerability Scan Complete: 0 CVEs Detected.');
    }, 1200);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple" />
            Feature 3: Security Posture, Zero-Trust Firewall &amp; mTLS
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            ISO/IEC 27001 Compliance, Mutual TLS 1.3, &amp; Hardware Key Policies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-status-safe-soft text-status-safe font-mono font-bold text-xs">
            HARDENING SCORE: {score}/100
          </span>
          <button
            disabled={isScanning}
            onClick={handleRunVulnerabilityScan}
            className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-purple-deep transition-colors disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>Run SecScan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">Zero-Trust Network Perimeter</span>
            <input
              type="checkbox"
              checked={zeroTrustEnforced}
              onChange={(e) => {
                setZeroTrustEnforced(e.target.checked);
                showToast(`Perimeter Enforcement: ${e.target.checked ? 'STRICT' : 'PERMISSIVE'}`);
              }}
              className="w-4 h-4 accent-purple cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-ink-secondary">
            Enforces mutual TLS 1.3 on all internal sensor telemetry endpoints and SCADA brokers.
          </p>
          <div className="font-mono text-[10px] text-status-safe font-bold">mTLS CERT VALID: 312 DAYS</div>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">Strict FIDO2 Hardware Tokens</span>
            <input
              type="checkbox"
              checked={fido2Required}
              onChange={(e) => {
                setFido2Required(e.target.checked);
                showToast(`FIDO2 Token Requirement: ${e.target.checked ? 'ENFORCED' : 'OPTIONAL'}`);
              }}
              className="w-4 h-4 accent-purple cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-ink-secondary">
            Requires hardware YubiKey 5 NFC / Bio for all broadcast alerts and pump overrides.
          </p>
          <div className="font-mono text-[10px] text-purple font-bold">WEBAUTHN LEVEL-2 STRICT</div>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">Gov-Cloud WAF &amp; Rate Throttling</span>
            <span className="text-status-safe font-mono text-[10px] font-bold">SHIELD ACTIVE</span>
          </div>
          <p className="text-[10px] text-ink-secondary">
            DDOS mitigation rate limit of 100,000 req/sec via Cloudflare Enterprise NIC Gateway.
          </p>
          <div className="font-mono text-[10px] text-ink-secondary">LAST BLOCKED ATTACK: 42m AGO</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 4: Municipal Compliance & NDMA Guidelines Audit Checklist
// -------------------------------------------------------------
export function MunicipalCompliancePanel({ showToast }) {
  const [items, setItems] = useState(PRE_MONSOON_COMPLIANCE_ITEMS);

  const handleExportPDF = () => {
    showToast('NDMA Statutory Monsoon Compliance Report exported (PDF/A format).');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple" />
            Feature 4: Municipal Compliance &amp; High Court Mandated Directives
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Pre-Monsoon Preparedness Certifications (Bombay High Court PIL No. 71/2026)
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="px-3 py-1 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-purple" />
          <span>Export Statutory PDF</span>
        </button>
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-2.5 bg-surface-secondary/60 border border-border rounded-xl flex items-center justify-between text-xs">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{it.title}</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-ink-secondary">
                  {it.id}
                </span>
              </div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                Authority: {it.authority} &bull; Officer: {it.officer}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-24 text-right">
                <div className="font-mono font-bold text-purple text-xs">{it.progress}%</div>
                <div className="w-full bg-border rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${it.progress === 100 ? 'bg-status-safe' : 'bg-purple'}`}
                    style={{ width: `${it.progress}%` }}
                  />
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                it.status === 'COMPLETED' ? 'bg-status-safe-soft text-status-safe' : 'bg-purple-soft text-purple-deep'
              }`}>
                {it.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 5: API Keys, Webhooks & Developer Access Token Manager
// -------------------------------------------------------------
export function ApiKeysPanel({ showToast }) {
  const [keys, setKeys] = useState(API_KEYS_DATA);
  const [newKeyName, setNewKeyName] = useState('');

  const handleGenerateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const generated = {
      id: `KEY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newKeyName,
      service: 'Custom External Municipal Partner',
      scopes: ['read:floods', 'read:hotspots'],
      rateLimit: '1,000 req/min',
      ipWhitelist: 'Dynamic CIDR',
      created: '2026-09-23',
      expires: '2027-09-23',
      status: 'ACTIVE',
    };
    setKeys([generated, ...keys]);
    setNewKeyName('');
    showToast(`New Scoped API Token generated: ${generated.id}`);
  };

  const handleRevoke = (id) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'REVOKED' } : k)));
    showToast(`Token ${id} has been revoked.`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Key className="w-4 h-4 text-purple" />
            Feature 5: API Keys, Webhooks &amp; Developer Access Tokens
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Secure machine-to-machine integrations for CAD, Emergency Apps &amp; NDMA
          </p>
        </div>
        <form onSubmit={handleGenerateKey} className="flex items-center gap-1.5 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Partner or service name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="p-1.5 px-2.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors shrink-0"
          >
            + Generate Key
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {keys.map((k) => (
          <div key={k.id} className="p-3 bg-surface-secondary/60 border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{k.name}</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-purple font-semibold">
                  {k.id}
                </span>
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  k.status === 'ACTIVE' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-alert-soft text-status-alert'
                }`}>
                  {k.status}
                </span>
              </div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                Service: {k.service} &bull; Whitelist: <span className="font-mono">{k.ipWhitelist}</span> &bull; Quota: <span className="font-mono">{k.rateLimit}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-ink-secondary">Expires: {k.expires}</span>
              {k.status === 'ACTIVE' && (
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="px-2.5 py-1 text-status-alert hover:bg-status-alert-soft border border-status-alert/20 rounded-lg text-xs font-semibold transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 6: SCADA & IoT Telemetry Ingestion Pipeline Manager
// -------------------------------------------------------------
export function ScadaTelemetryPanel({ showToast }) {
  const [pipelines, setPipelines] = useState(TELEMETRY_PIPELINES_DATA);

  const handleRestart = (id) => {
    showToast(`Restarting stream pipeline: ${id}...`);
    setTimeout(() => {
      setPipelines((prev) =>
        prev.map((p) => (p.id === id ? { ...p, pps: p.pps + Math.floor(Math.random() * 20 - 10) } : p))
      );
      showToast(`Stream ${id} re-synchronized.`);
    }, 800);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Server className="w-4 h-4 text-purple" />
            Feature 6: SCADA &amp; IoT Telemetry Ingestion Pipeline
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            MQTT, Modbus TCP, LoRaWAN &amp; Piezometer High-Throughput Streams
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {pipelines.map((pipe) => (
          <div key={pipe.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink font-sans">{pipe.protocol}</span>
                <span className="text-[10px] text-purple font-semibold">{pipe.endpoint}</span>
              </div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                Topic: <span className="text-ink">{pipe.topic}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="font-bold text-ink text-xs">{pipe.pps} PPS</div>
                <div className="text-[10px] text-ink-secondary">Drop: {pipe.dropRate}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold text-[10px]">
                {pipe.uptime}
              </span>
              <button
                onClick={() => handleRestart(pipe.id)}
                className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink transition-colors"
                title="Restart stream"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 7: AI & Hydrodynamic Physics Engine Calibration Console
// -------------------------------------------------------------
export function PhysicsEnginePanel({ showToast }) {
  const [params, setParams] = useState({
    cflCondition: 0.85,
    manningsConcrete: 0.013,
    manningsNatural: 0.035,
    meshResolution: 5.0,
    timeStepSec: 2.5,
    pinnLossPenalty: 0.04,
  });

  const handleCommit = () => {
    showToast('Hydrodynamic SWE-2D physics engine parameters committed.');
  };

  const handleResetDefaults = () => {
    setParams({
      cflCondition: 0.85,
      manningsConcrete: 0.013,
      manningsNatural: 0.035,
      meshResolution: 5.0,
      timeStepSec: 2.5,
      pinnLossPenalty: 0.04,
    });
    showToast('Physics parameters restored to MCGM-CWC baseline.');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple" />
            Feature 7: AI &amp; Hydrodynamic Physics Engine Calibration
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            2D Shallow Water Equations (SWE) &amp; PINN Loss Discretization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-2.5 py-1 text-ink-secondary hover:text-ink text-xs font-semibold"
          >
            Reset Baseline
          </button>
          <button
            onClick={handleCommit}
            className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Commit Physics Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>Courant Number (CFL Limit):</span>
            <span className="text-purple font-mono">{params.cflCondition}</span>
          </label>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={params.cflCondition}
            onChange={(e) => setParams({ ...params, cflCondition: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">Controls numerical stability of hydraulic shockwaves</p>
        </div>

        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>Manning's n (Concrete Channels):</span>
            <span className="text-purple font-mono">{params.manningsConcrete}</span>
          </label>
          <input
            type="range"
            min="0.010"
            max="0.025"
            step="0.001"
            value={params.manningsConcrete}
            onChange={(e) => setParams({ ...params, manningsConcrete: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">Frictional roughness for paved roadside box drains</p>
        </div>

        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>Manning's n (Natural Nullahs):</span>
            <span className="text-purple font-mono">{params.manningsNatural}</span>
          </label>
          <input
            type="range"
            min="0.025"
            max="0.060"
            step="0.001"
            value={params.manningsNatural}
            onChange={(e) => setParams({ ...params, manningsNatural: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">Bed resistance for Mithi River and Dahisar creek</p>
        </div>

        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>Terrain Mesh Grid Resolution:</span>
            <span className="text-purple font-mono">{params.meshResolution} m</span>
          </label>
          <input
            type="range"
            min="2.0"
            max="10.0"
            step="1.0"
            value={params.meshResolution}
            onChange={(e) => setParams({ ...params, meshResolution: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">LiDAR digital elevation grid interpolation cell size</p>
        </div>

        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>Simulation Time-Step (\Delta t):</span>
            <span className="text-purple font-mono">{params.timeStepSec} s</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={params.timeStepSec}
            onChange={(e) => setParams({ ...params, timeStepSec: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">Numerical integration time step for 180m nowcasting</p>
        </div>

        <div>
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px] mb-1">
            <span>PINN Physics Loss Weight (\lambda):</span>
            <span className="text-purple font-mono">{params.pinnLossPenalty}</span>
          </label>
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={params.pinnLossPenalty}
            onChange={(e) => setParams({ ...params, pinnLossPenalty: parseFloat(e.target.value) })}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary mt-1">Mass conservation loss constraint penalty in neural net</p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 8: Sluice Gate & Pumping Station Automated Policy Engine
// -------------------------------------------------------------
export function ScadaRulesPanel({ onOpenRuleBuilder, showToast }) {
  const [rules, setRules] = useState(SCADA_RULES_DATA);

  const handleToggleRule = (id) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = r.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
          showToast(`Rule ${id} status: ${next}`);
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple" />
            Feature 8: Sluice Gate &amp; Pumping Station Automated Policy Engine
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Closed-Loop Edge Automation Rules for Flood Protection Infrastructure
          </p>
        </div>
        <button
          onClick={onOpenRuleBuilder}
          className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-purple-deep transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>+ Create Automation Rule</span>
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex items-center justify-between text-xs">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{rule.name}</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-purple font-semibold">
                  {rule.id}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-soft text-purple-deep font-bold">
                  {rule.priority}
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink-secondary">
                <span className="text-purple font-bold">IF:</span> {rule.condition}
              </div>
              <div className="font-mono text-[10px] text-ink-secondary">
                <span className="text-status-safe font-bold">THEN:</span> {rule.action}
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="font-mono text-[10px] text-ink-secondary">
                Triggers: <strong className="text-ink">{rule.triggeredCount}</strong>
              </div>
              <button
                onClick={() => handleToggleRule(rule.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  rule.status === 'ACTIVE'
                    ? 'bg-status-safe-soft text-status-safe hover:bg-status-safe hover:text-white'
                    : 'bg-surface-secondary text-ink-secondary hover:bg-border'
                }`}
              >
                {rule.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 9: Emergency Power Grid & Backup Telecommunications Monitor
// -------------------------------------------------------------
export function PowerTelecomPanel({ showToast }) {
  const [testingVSAT, setTestingVSAT] = useState(false);

  const handleTestVSAT = () => {
    setTestingVSAT(true);
    setTimeout(() => {
      setTestingVSAT(false);
      showToast('Satellite BGAN / VSAT Failover Link Confirmed: 100% Signal.');
    }, 1000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple" />
            Feature 9: Emergency Power Grid &amp; Backup Telecommunications
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Heavy Diesel Generator Autonomy &amp; Satellite Failover Link
          </p>
        </div>
        <button
          disabled={testingVSAT}
          onClick={handleTestVSAT}
          className="px-3 py-1 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          {testingVSAT ? <RefreshCw className="w-3 h-3 animate-spin text-purple" /> : <Radio className="w-3 h-3 text-purple" />}
          <span>Test Satellite VSAT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {[
          { title: 'HQ Disaster Ops Diesel Gen', fuel: '94%', runHours: '48.5 hrs remaining', status: 'STANDBY READY', color: 'text-status-safe' },
          { title: 'Haji Ali Pumping Station Gen', fuel: '88%', runHours: '36.0 hrs remaining', status: 'STANDBY READY', color: 'text-status-safe' },
          { title: 'Cleveland Bunder Pump Gen', fuel: '79%', runHours: '28.5 hrs remaining', status: 'OPERATIONAL', color: 'text-purple' },
          { title: 'Colaba Doppler Radar UPS', fuel: '100%', runHours: 'Battery 100% (8h)', status: 'GRID + UPS', color: 'text-status-safe' },
        ].map((unit, i) => (
          <div key={i} className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink line-clamp-1">{unit.title}</span>
              <span className={`font-mono text-[9px] font-bold ${unit.color}`}>{unit.status}</span>
            </div>
            <div className="text-xl font-bold font-mono text-purple">{unit.fuel}</div>
            <div className="text-[10px] text-ink-secondary">{unit.runHours}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 10: Contractor & Desilting Tender Operations Tracker
// -------------------------------------------------------------
export function ContractorDesiltingPanel({ showToast }) {
  const [tenders, setTenders] = useState(DESILTING_TENDERS_DATA);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple" />
            Feature 10: Contractor &amp; Desilting Tender Operations Tracker
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Automated Weighbridge Slips &amp; Silt Excavation SLA Verification
          </p>
        </div>
        <button
          onClick={() => showToast('Tender Weighbridge Database Synchronized with RFID Gateways.')}
          className="px-3 py-1 bg-surface-secondary hover:bg-border rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-purple" />
          <span>Sync Weighbridge Slips</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-[10px] text-ink-secondary uppercase">
              <th className="pb-2">Tender ID / Contractor</th>
              <th className="pb-2">River / Nullah Scope</th>
              <th className="pb-2 text-right">Excavated / Target (Tons)</th>
              <th className="pb-2 text-center">Progress %</th>
              <th className="pb-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenders.map((t) => (
              <tr key={t.id} className="hover:bg-surface-secondary/60">
                <td className="py-2.5">
                  <div className="font-bold text-ink font-sans">{t.contractor}</div>
                  <div className="text-[10px] text-purple">{t.id}</div>
                </td>
                <td className="py-2.5 font-sans text-ink-secondary">{t.scope}</td>
                <td className="py-2.5 text-right">
                  <span className="font-bold text-ink">{t.excavatedTons.toLocaleString()}</span> / {t.targetTons.toLocaleString()}
                </td>
                <td className="py-2.5 text-center font-bold text-purple">{t.percentDone}%</td>
                <td className="py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    t.status === 'COMPLIANT' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-alert-soft text-status-alert'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 11: GIS Vector Spatial Layer & Bathymetry Layer Publisher
// -------------------------------------------------------------
export function GisVectorPublisherPanel({ showToast }) {
  const [layers, setLayers] = useState([
    { id: 'lyr-01', name: 'Stormwater Box Sewers (1,428 Nodes)', type: 'GeoJSON Polyline', visible: true, opacity: 0.9, format: 'EPSG:4326' },
    { id: 'lyr-02', name: 'Mithi River Natural Floodplain Contours', type: 'Vector Polygon', visible: true, opacity: 0.75, format: 'EPSG:4326' },
    { id: 'lyr-03', name: 'Coastal Regulation Zone (CRZ-I Mangroves)', type: 'Vector Boundary', visible: true, opacity: 0.5, format: 'EPSG:4326' },
    { id: 'lyr-04', name: 'Railway Culverts & Inundation Traps', type: 'Point Vector', visible: true, opacity: 1.0, format: 'EPSG:4326' },
    { id: 'lyr-05', name: 'Subway Boom Barrier Automatic Locks', type: 'Hardware Geo-Fence', visible: false, opacity: 0.8, format: 'EPSG:4326' },
  ]);

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleExportGeoJSON = () => {
    const geojsonData = {
      type: 'FeatureCollection',
      features: layers.map((l) => ({
        type: 'Feature',
        properties: { name: l.name, id: l.id, format: l.format },
        geometry: { type: 'Point', coordinates: [72.8777, 19.0760] },
      })),
    };
    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-gis-vector-bundle-${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Vector Layer FeatureCollection exported.');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple" />
            Feature 11: GIS Vector Spatial Layer &amp; Bathymetry Publisher
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Vector Tile Layer Opacity, Coordinate Formats &amp; Feature Export
          </p>
        </div>
        <button
          onClick={handleExportGeoJSON}
          className="px-3 py-1 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-purple" />
          <span>Export GeoJSON Bundle</span>
        </button>
      </div>

      <div className="space-y-2">
        {layers.map((lyr) => (
          <div key={lyr.id} className="p-2.5 bg-surface-secondary/70 border border-border rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={lyr.visible}
                onChange={() => toggleLayer(lyr.id)}
                className="w-4 h-4 accent-purple cursor-pointer"
              />
              <div>
                <span className="font-bold text-ink">{lyr.name}</span>
                <div className="text-[10px] text-ink-secondary font-mono">{lyr.type} &bull; {lyr.format}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-ink-secondary">Opacity: {Math.round(lyr.opacity * 100)}%</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                lyr.visible ? 'bg-status-safe-soft text-status-safe' : 'bg-surface border border-border text-ink-secondary'
              }`}>
                {lyr.visible ? 'PUBLISHED' : 'HIDDEN'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 12: Digital Twin 3D Mesh & LiDAR DEM Calibration Console
// -------------------------------------------------------------
export function DigitalTwinLidarPanel({ showToast }) {
  const [datumOffsetM, setDatumOffsetM] = useState(3.20);
  const [subsidenceFactor, setSubsidenceFactor] = useState(0.02);

  const handleCalibrate = () => {
    showToast('LiDAR Elevation Benchmark calibrated against Mumbai Town Hall Datum.');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Database className="w-4 h-4 text-purple" />
            Feature 12: Digital Twin 3D Mesh &amp; LiDAR DEM Calibration
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Vertical Datum Translation (WGS84 Ellipsoid vs Mumbai Town Hall Datum)
          </p>
        </div>
        <button
          onClick={handleCalibrate}
          className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
        >
          Calibrate Datum
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
            <span>Vertical Datum Offset (MSL Delta):</span>
            <span className="text-purple font-mono font-bold">+{datumOffsetM} m</span>
          </label>
          <input
            type="range"
            min="2.0"
            max="4.5"
            step="0.05"
            value={datumOffsetM}
            onChange={(e) => setDatumOffsetM(parseFloat(e.target.value))}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary">
            Anchored to historic benchmark at Mumbai Town Hall (Fort). MSL = 0.00m.
          </p>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
            <span>Annual Coastal Subsidence Correction:</span>
            <span className="text-purple font-mono font-bold">-{subsidenceFactor} m/yr</span>
          </label>
          <input
            type="range"
            min="0.00"
            max="0.05"
            step="0.005"
            value={subsidenceFactor}
            onChange={(e) => setSubsidenceFactor(parseFloat(e.target.value))}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary">
            Applies InSAR differential interferometry settlement factor across reclaimed zones.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 13: Citizen JalDrishti Portal Moderation Desk
// -------------------------------------------------------------
export function CitizenModerationPanel({ reports, onVerifyReport, showToast }) {
  const [filter, setFilter] = useState('ALL');

  const pendingReports = [
    { id: 'CIT-801', ward: 'Ward K/E', location: 'Near Chakala Metro Station', depthCm: 35, confidence: '94% AI Match', text: 'Water reached knee level on service road, 2 autos stuck', status: 'PENDING' },
    { id: 'CIT-802', ward: 'Ward L', location: 'Bail Bazar, Kurla West', depthCm: 45, confidence: '97% AI Match', text: 'Mithi water overflowing curb, entry road submerged', status: 'PENDING' },
    { id: 'CIT-803', ward: 'Ward G/N', location: 'Dharavi 90ft Road', depthCm: 20, confidence: '82% AI Match', text: 'Gutter overflowing near tea stall', status: 'PENDING' },
  ];

  const [queue, setQueue] = useState(pendingReports);

  const handleAction = (id, newStatus) => {
    setQueue((prev) => prev.filter((r) => r.id !== id));
    showToast(`Report ${id} marked as: ${newStatus}`);
    if (onVerifyReport) onVerifyReport(id, newStatus);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple" />
            Feature 13: Citizen JalDrishti Portal Content &amp; Crowd Moderation
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            AI-Assisted Photo Water-Depth Verification &amp; Inundation Pin Publishing
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-purple px-2 py-0.5 rounded bg-purple-soft">
          {queue.length} Reports Awaiting Review
        </span>
      </div>

      <div className="space-y-2">
        {queue.length === 0 ? (
          <div className="p-4 text-center text-xs text-ink-secondary bg-surface-secondary rounded-xl">
            All citizen crowd-sourced submissions moderated and published.
          </div>
        ) : (
          queue.map((rep) => (
            <div key={rep.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{rep.location}</span>
                  <span className="font-mono text-[10px] text-purple font-semibold">({rep.ward})</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                    {rep.confidence}
                  </span>
                </div>
                <div className="text-[11px] text-ink-secondary mt-0.5">
                  Reported Depth: <strong className="text-ink">{rep.depthCm} cm</strong> &bull; &ldquo;{rep.text}&rdquo;
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAction(rep.id, 'VERIFIED & PUBLISHED')}
                  className="px-2.5 py-1 bg-status-safe text-white hover:bg-green-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Verify &amp; Publish</span>
                </button>
                <button
                  onClick={() => handleAction(rep.id, 'REJECTED - FALSE PIN')}
                  className="px-2.5 py-1 bg-surface border border-border text-status-alert hover:bg-status-alert-soft rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 14: SMS / WhatsApp Citizen Alert Broadcast Gateway
// -------------------------------------------------------------
export function SmsWhatsappGatewayPanel({ showToast }) {
  const [balance, setBalance] = useState(842000);

  const handleTestBlast = () => {
    setBalance((prev) => prev - 500);
    showToast('Sample WhatsApp Business Template Alert dispatched to 500 subscribed ward wardens.');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-purple" />
            Feature 14: SMS / WhatsApp Citizen Alert Broadcast Gateway
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Meta WhatsApp Cloud API &amp; NIC National DLT SMS Gateway Quotas
          </p>
        </div>
        <button
          onClick={handleTestBlast}
          className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
        >
          Send Warden Blast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1">
          <div className="text-[10px] text-ink-secondary uppercase">NIC SMS Gateway Quota</div>
          <div className="text-xl font-bold text-ink">{balance.toLocaleString()}</div>
          <div className="text-[10px] text-status-safe font-bold">DLT TEMPLATE APPROVED</div>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1">
          <div className="text-[10px] text-ink-secondary uppercase">WhatsApp API TPS (Throughput)</div>
          <div className="text-xl font-bold text-purple">250 msg/sec</div>
          <div className="text-[10px] text-ink-secondary">Meta Tier-4 High Tier</div>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1">
          <div className="text-[10px] text-ink-secondary uppercase">Delivery Success Rate</div>
          <div className="text-xl font-bold text-status-safe">99.4%</div>
          <div className="text-[10px] text-ink-secondary">Avg latency 2.4 sec</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 15: System Backup, Disaster Recovery (DR) & Cold Vault
// -------------------------------------------------------------
export function DisasterRecoveryPanel({ showToast }) {
  const [isFailingOver, setIsFailingOver] = useState(false);
  const [drStatus, setDrStatus] = useState('PUNE DATA CENTER HOT STANDBY');

  const handleFailoverTest = () => {
    setIsFailingOver(true);
    setTimeout(() => {
      setIsFailingOver(false);
      setDrStatus('FAILOVER TEST VERIFIED (RTO: 42s, RPO: 0s)');
      showToast('Disaster Recovery Failover Simulation: Passed.');
    }, 1500);
  };

  const handleExportFullConfig = () => {
    const configDump = {
      system: 'MCGM Flood Operations & Governance Twin',
      version: '2026.4.1-LTS',
      exportedAt: new Date().toISOString(),
      activeThreatLevel: 'LEVEL-4',
      wardsConfigured: 24,
      pumpingStationsCount: 6,
      swmmNodesCount: 1428,
    };
    const blob = new Blob([JSON.stringify(configDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-full-admin-snapshot-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full Platform Admin JSON Snapshot downloaded.');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple" />
            Feature 15: System Backup, Disaster Recovery (DR) &amp; Cold Vault
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            MeghRaj Govt Cloud Geosynchronous Database Replication &amp; Failover
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullConfig}
            className="px-3 py-1 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            <span>Export Snapshot</span>
          </button>
          <button
            disabled={isFailingOver}
            onClick={handleFailoverTest}
            className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isFailingOver ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>Simulate DR Failover</span>
          </button>
        </div>
      </div>

      <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-ink-secondary">Secondary DR Site Status: </span>
          <strong className="text-status-safe">{drStatus}</strong>
        </div>
        <span className="text-[10px] text-ink-secondary">Sync Lag: &lt; 0.2ms (Fiber Ring)</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 16: Mobile Dewatering Fleet & Heavy Asset Allocation Roster
// -------------------------------------------------------------
export function MobilePumpsFleetPanel({ pumps, onDispatchPump, showToast }) {
  const [selectedWard, setSelectedWard] = useState('Ward K/E');

  const handleReassign = (pumpId) => {
    if (onDispatchPump) {
      onDispatchPump(pumpId, `${selectedWard} Immediate Sump Ingress`, selectedWard);
    }
    showToast(`Pump Squad ${pumpId} reassigned to ${selectedWard}`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple" />
            Feature 16: Mobile Dewatering Fleet &amp; Heavy Asset Allocation Roster
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            500HP Diesel Turbo Pumps &amp; Amphibious Rescue Vehicle Positioning
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-ink-secondary font-semibold">Assign Target:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="p-1 px-2 bg-surface-secondary border border-border rounded-lg text-ink font-semibold focus:outline-none"
          >
            <option value="Ward K/E">Ward K/E (Andheri)</option>
            <option value="Ward L">Ward L (Kurla)</option>
            <option value="Ward F/N">Ward F/N (Sion)</option>
            <option value="Ward G/N">Ward G/N (Dadar)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {pumps.map((pump) => (
          <div key={pump.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-ink">{pump.name}</div>
              <div className="text-[10px] text-ink-secondary mt-0.5">
                Location: {pump.location} &bull; Ward: <strong className="text-purple">{pump.assignedTo}</strong>
              </div>
              <div className="font-mono text-[10px] text-ink-secondary mt-0.5">
                Capacity: {pump.capacity} &bull; Fuel: <strong className="text-status-safe">{pump.fuel}</strong>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                {pump.status}
              </span>
              <button
                onClick={() => handleReassign(pump.id)}
                className="px-2 py-1 bg-purple text-white rounded text-[10px] font-semibold hover:bg-purple-deep transition-colors"
              >
                Reassign &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 17: Disaster Relief Inventory & Central Buffer Stock Depot Manager
// -------------------------------------------------------------
export function BufferStockDepotPanel({ depots, onRequestTransfer, showToast }) {
  const [transferAmount, setTransferAmount] = useState(500);

  const handleTransfer = (depotId, itemName) => {
    if (onRequestTransfer) {
      onRequestTransfer(depotId, itemName, transferAmount);
    }
    showToast(`Dispatched ${transferAmount} ${itemName} to emergency frontline.`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Package className="w-4 h-4 text-purple" />
            Feature 17: Disaster Relief Inventory &amp; Central Buffer Stock Depots
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Bandra, Byculla, Chembur &amp; Borivali Municipal Logistics Hubs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {depots.map((depot) => (
          <div key={depot.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div>
                <span className="font-bold text-ink">{depot.name}</span>
                <span className="text-[10px] text-ink-secondary ml-1">({depot.location})</span>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-soft text-purple-deep font-bold">
                {depot.id}
              </span>
            </div>

            <div className="space-y-1.5">
              {depot.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center font-mono text-[11px]">
                  <span className="text-ink">{item.name}:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-purple">{item.currentStock.toLocaleString()}</strong>
                    <button
                      onClick={() => handleTransfer(depot.id, item.name)}
                      className="px-2 py-0.5 bg-surface border border-border hover:bg-purple hover:text-white rounded text-[9px] font-sans font-semibold transition-colors"
                    >
                      + Requisition 500
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 18: Evacuation Shelter & Emergency Relief Camp Capacity
// -------------------------------------------------------------
export function EvacuationSheltersPanel({ shelters, onUpdateShelter, showToast }) {
  const handleToggleOccupants = (id, delta) => {
    if (onUpdateShelter) {
      onUpdateShelter(id, delta);
    }
    showToast(`Shelter ${id} occupancy adjusted by ${delta > 0 ? `+${delta}` : delta}`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Home className="w-4 h-4 text-purple" />
            Feature 18: Evacuation Shelter &amp; Relief Camp Capacity Allocator
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            Municipal Schools, Sports Complexes &amp; Flood Relief Shelters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shelters.map((sh) => (
          <div key={sh.id} className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-ink">{sh.name}</span>
                <span className="text-[10px] text-purple ml-1">({sh.ward})</span>
              </div>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                sh.status.includes('FULL') ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
              }`}>
                {sh.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-ink-secondary">Occupancy:</span>
                <span><strong className="text-ink">{sh.currentOccupants}</strong> / {sh.totalCapacity} Beds</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (sh.currentOccupants / sh.totalCapacity) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-[10px] text-ink-secondary font-mono">Medical: {sh.medicalOfficer || 'Dr. Assigned'}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleOccupants(sh.id, -20)}
                  className="px-2 py-0.5 bg-surface border border-border rounded text-[10px] font-bold text-ink hover:bg-border"
                >
                  -20
                </button>
                <button
                  onClick={() => handleToggleOccupants(sh.id, 20)}
                  className="px-2 py-0.5 bg-purple text-white rounded text-[10px] font-bold hover:bg-purple-deep"
                >
                  +20 Check-In
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 19: Stormwater Sub-Catchments & SWMM Node Tuner
// -------------------------------------------------------------
export function SwmmSubCatchmentsPanel({ showToast }) {
  const [cFactor, setCFactor] = useState(0.82);

  const handleAdjustCFactor = () => {
    showToast(`Runoff Coefficient (C-Factor) adjusted to ${cFactor} for high-impervious zones.`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple" />
            Feature 19: Stormwater Sub-Catchments &amp; SWMM Runoff Node Tuner
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            64 Drainage Sub-Zones &amp; Rational Method Runoff Coefficients (C-Factor)
          </p>
        </div>
        <button
          onClick={handleAdjustCFactor}
          className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
        >
          Update C-Factor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
            <span>High-Density Urban Paved Runoff (C):</span>
            <span className="text-purple font-mono font-bold">{cFactor}</span>
          </label>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.01"
            value={cFactor}
            onChange={(e) => setCFactor(parseFloat(e.target.value))}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary">
            Fraction of rainfall converted to immediate overland discharge. Higher = faster flash inundation.
          </p>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1 font-mono text-[11px]">
          <div className="text-ink font-bold font-sans">Active SWMM Sub-Catchment Summary:</div>
          <div className="flex justify-between"><span className="text-ink-secondary">Monitored Inflow Nodes:</span> <strong>1,428 Points</strong></div>
          <div className="flex justify-between"><span className="text-ink-secondary">Gravity Tidal Outfalls:</span> <strong>64 Flap Gates</strong></div>
          <div className="flex justify-between"><span className="text-ink-secondary">Mean Infiltration Rate:</span> <strong>4.2 mm/hr (SGNP)</strong></div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 20: Critical Geo-Fenced Assets & Vulnerability Perimeter
// -------------------------------------------------------------
export function CriticalGeoFencePanel({ showToast }) {
  const [bufferRadiusM, setBufferRadiusM] = useState(150);

  const handleUpdateBuffer = () => {
    showToast(`Critical Infrastructure Geo-Fence buffer radius set to ${bufferRadiusM}m.`);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple" />
            Feature 20: Critical Geo-Fenced Assets &amp; Protection Perimeter
          </h3>
          <p className="text-[11px] text-ink-secondary mt-0.5">
            328 Tagged Hospitals, Electric Sub-stations &amp; Railway Traction Power Centers
          </p>
        </div>
        <button
          onClick={handleUpdateBuffer}
          className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
        >
          Update Perimeter Buffer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
          <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
            <span>Automated Protective Geo-Fence Radius:</span>
            <span className="text-purple font-mono font-bold">{bufferRadiusM} meters</span>
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={bufferRadiusM}
            onChange={(e) => setBufferRadiusM(parseInt(e.target.value))}
            className="w-full accent-purple"
          />
          <p className="text-[10px] text-ink-secondary">
            When floodwater exceeds 15cm within this radius, automated Priority-1 dispatch triggers.
          </p>
        </div>

        <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-1 font-mono text-[11px]">
          <div className="text-ink font-bold font-sans">Active Protected Facilities:</div>
          <div className="flex justify-between"><span className="text-ink-secondary">KEM, Sion &amp; Nair Hospitals:</span> <strong className="text-status-safe">SURROUNDED BY DIKES</strong></div>
          <div className="flex justify-between"><span className="text-ink-secondary">BEST Power Sub-Stations:</span> <strong className="text-status-safe">PLINTH ELEVATED +1.2m</strong></div>
          <div className="flex justify-between"><span className="text-ink-secondary">Metro 3 Underground Stations:</span> <strong className="text-status-safe">FLOOD GATES ARMED</strong></div>
        </div>
      </div>
    </div>
  );
}

