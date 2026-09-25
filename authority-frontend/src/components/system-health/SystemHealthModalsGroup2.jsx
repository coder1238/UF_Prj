import React, { useState } from 'react';
import {
  X,
  Network,
  AlertCircle,
  BellRing,
  Radar,
  Lock,
  Sliders,
  Archive,
  RotateCw
} from 'lucide-react';
import { NETWORK_LATENCY_DATA } from './systemHealthConstants';

// 8. Inter-Agency WAN Latency & Geo-DNS Matrix Modal
export function NetworkLatencyModal({ isOpen, onClose, onNotify }) {
  const [links, setLinks] = useState(NETWORK_LATENCY_DATA);
  const [isPinging, setIsPinging] = useState(false);

  if (!isOpen) return null;

  const handleRunPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLinks(prev => prev.map(l => ({
        ...l,
        rttMs: Number((l.rttMs + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        jitterMs: Number((l.jitterMs + (Math.random() * 0.2 - 0.1)).toFixed(1))
      })));
      setIsPinging(false);
      onNotify('ICMP Ping benchmark completed across all inter-agency government links.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Inter-Agency WAN Latency &amp; Geo-DNS Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  0% Packet Loss
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Dedicated GovNET dark-fiber and encrypted SD-WAN backbones across Mumbai</p>
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
                  <th className="p-2.5">Endpoint Destination</th>
                  <th className="p-2.5">GovNET IP</th>
                  <th className="p-2.5">Round-Trip Time (RTT)</th>
                  <th className="p-2.5">Jitter</th>
                  <th className="p-2.5">Packet Loss</th>
                  <th className="p-2.5">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {links.map((link) => (
                  <tr key={link.target} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink font-sans">{link.target}</td>
                    <td className="p-2.5 text-ink-secondary">{link.ip}</td>
                    <td className="p-2.5 text-purple font-bold">{link.rttMs} ms</td>
                    <td className="p-2.5 text-ink-secondary">{link.jitterMs} ms</td>
                    <td className="p-2.5 text-status-safe">{link.packetLoss}</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {link.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Real-Time ICMP Latency Prober</span>
              <span className="text-[11px] text-ink-secondary">Transmit continuous 64-byte probe bursts to verify SD-WAN SLA.</span>
            </div>
            <button
              disabled={isPinging}
              onClick={handleRunPing}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging Nodes...' : 'Benchmark All Links'}</span>
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

// 9. Sensor Telemetry Data Drift & ML Anomaly Detector
export function SensorDriftModal({ isOpen, onClose, onNotify }) {
  const [anomalies, setAnomalies] = useState([
    {
      sensorId: 'MITHI_WL_09 (BKC Bridge)',
      issue: 'Acoustic Signal Attenuation & Flatline',
      delta: 'Static 3.42m for 45 mins despite 54mm/hr rainfall',
      severity: 'CRITICAL',
      status: 'FLAGGED'
    },
    {
      sensorId: 'DAHISAR_WL_03 (WEH)',
      issue: 'High-Frequency Phantom Spike',
      delta: '+1.4m oscillation in 30 seconds',
      severity: 'WARNING',
      status: 'FLAGGED'
    }
  ]);

  if (!isOpen) return null;

  const handleQuarantine = (sensorId) => {
    setAnomalies(prev => prev.map(a => a.sensorId === sensorId ? { ...a, status: a.status === 'QUARANTINED' ? 'FLAGGED' : 'QUARANTINED' } : a));
    onNotify(`Sensor ${sensorId} quarantine state toggled.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Sensor Telemetry Data Drift &amp; ML Anomaly Detector
              </h3>
              <p className="text-xs text-ink-secondary">Autoencoder-based sanity checker for acoustic hydro-sensors and rain gauges</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-3">
            {anomalies.map((item) => (
              <div key={item.sensorId} className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-sm">{item.sensorId}</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    item.status === 'QUARANTINED'
                      ? 'bg-purple/10 text-purple'
                      : item.severity === 'CRITICAL'
                      ? 'bg-status-alert-soft text-status-alert'
                      : 'bg-status-warning-soft text-status-warning'
                  }`}>
                    {item.status === 'QUARANTINED' ? 'QUARANTINED FROM MODEL' : item.severity}
                  </span>
                </div>
                <div className="font-medium text-ink">{item.issue}</div>
                <div className="p-2 bg-surface-secondary/60 rounded-lg text-[11px] font-mono text-ink-secondary">
                  Detected Drift: {item.delta}
                </div>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => handleQuarantine(item.sensorId)}
                    className="px-3 py-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg text-xs font-semibold transition-colors"
                  >
                    {item.status === 'QUARANTINED' ? 'Restore Sensor to Simulation Mesh' : 'Quarantine & Exclude from SWE Model'}
                  </button>
                </div>
              </div>
            ))}
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

// 10. CAP Emergency Broadcast & Coastal Siren Health
export function CapBroadcastGatewayModal({ isOpen, onClose, onNotify }) {
  const [sirens] = useState([
    { id: 'SIREN_WORLI_01', site: 'Worli Seaface Koliwada', battery: 99, hornDb: 130, status: 'READY' },
    { id: 'SIREN_MAHIM_02', site: 'Mahim Causeway Gate', battery: 94, hornDb: 130, status: 'READY' },
    { id: 'SIREN_BANDRA_03', site: 'Bandra Reclamation Pier', battery: 91, hornDb: 130, status: 'READY' },
    { id: 'SIREN_COLABA_04', site: 'Colaba Sassoon Dock', battery: 97, hornDb: 130, status: 'READY' }
  ]);
  const [testingSirenId, setTestingSirenId] = useState(null);

  if (!isOpen) return null;

  const handleSilentTest = (id) => {
    setTestingSirenId(id);
    setTimeout(() => {
      setTestingSirenId(null);
      onNotify(`Silent acoustic impedance test passed for ${id}.`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                CAP Emergency Broadcast &amp; Coastal Siren Health
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  14/14 Sirens Armed
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Common Alerting Protocol (CAP v1.2) telco cellular broadcast &amp; 130dB IP sirens</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Cell Broadcast Capacity</span>
              <div className="text-xl font-bold text-ink mt-0.5">50,000 SMS/s</div>
              <span className="text-[10px] text-status-safe">All Telecom Hubs Active</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Acoustic Coastal Sirens</span>
              <div className="text-xl font-bold text-purple mt-0.5">14 Ready</div>
              <span className="text-[10px] text-ink-secondary">130 dB High Output</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Disaster Siren Relay</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">&lt; 2.5s Latency</div>
              <span className="text-[10px] text-ink-secondary">Encrypted VPN Mesh</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="p-2.5">Siren ID</th>
                  <th className="p-2.5">Geographic Location</th>
                  <th className="p-2.5">Battery</th>
                  <th className="p-2.5">Output</th>
                  <th className="p-2.5">State</th>
                  <th className="p-2.5 text-right">Self-Test</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {sirens.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink">{s.id}</td>
                    <td className="p-2.5 font-sans text-ink-secondary">{s.site}</td>
                    <td className="p-2.5 text-status-safe font-bold">{s.battery}%</td>
                    <td className="p-2.5 text-ink">{s.hornDb} dB</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-sans">
                      <button
                        disabled={testingSirenId === s.id}
                        onClick={() => handleSilentTest(s.id)}
                        className="px-2.5 py-1 bg-surface hover:bg-surface-secondary text-ink border border-border rounded text-[10px] font-semibold transition-colors disabled:opacity-50"
                      >
                        {testingSirenId === s.id ? 'Testing...' : 'Silent Ping'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

// 11. Doppler Radar S-Band Raw Ingest & Beam QC
export function RadarQcInspectorModal({ isOpen, onClose, onNotify }) {
  const [clutterFilter, setClutterFilter] = useState('GMTI + Neural De-Speckle');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Doppler Radar S-Band Raw Ingest &amp; Beam Quality Control
              </h3>
              <p className="text-xs text-ink-secondary">IMD Colaba 100km volume scan reflectivity Z-factor, SNR, and beam blockage QC</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Carrier Frequency</span>
              <div className="text-lg font-bold text-ink mt-0.5">2.85 GHz</div>
              <span className="text-[9px] text-ink-secondary">S-Band Dual-Pol</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Pulse Repetition (PRF)</span>
              <div className="text-lg font-bold text-purple mt-0.5">1,200 Hz</div>
              <span className="text-[9px] text-status-safe">Max Unambiguous: 125km</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">SNR Threshold</span>
              <div className="text-lg font-bold text-status-safe mt-0.5">42 dB</div>
              <span className="text-[9px] text-ink-secondary">High Fidelity</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Beam Blockage</span>
              <div className="text-lg font-bold text-status-safe mt-0.5">0.02%</div>
              <span className="text-[9px] text-ink-secondary">Clear Coastal Horizon</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3 font-sans">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Ground Clutter &amp; Sea Spray Suppression</h4>
            <div className="flex gap-2">
              {['Standard IIR Notch', 'GMTI + Neural De-Speckle', 'Raw Bypass (Research Mode)'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setClutterFilter(filter);
                    onNotify(`Clutter filter set to ${filter}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    clutterFilter === filter
                      ? 'border-purple bg-purple/10 text-purple font-bold'
                      : 'border-border bg-surface text-ink hover:border-purple/30'
                  }`}
                >
                  {filter}
                </button>
              ))}
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

// 12. SSL/TLS Certificates & Gov-Cloud PKI Expiry Tracker
export function SslPkiTrackerModal({ isOpen, onClose, onNotify }) {
  const [certs, setCerts] = useState([
    { domain: 'api.authority.mcgm.gov.in', issuer: 'National Informatics Centre (NIC) CA', daysLeft: 82, cipher: 'TLS 1.3 AES-GCM', status: 'VALID' },
    { domain: 'iot-mqtt.mcgm.gov.in', issuer: 'Municipal Gov-Cloud Intermediate CA', daysLeft: 144, cipher: 'mTLS ECDSA P-384', status: 'VALID' },
    { domain: 'radar-stream.imd.gov.in', issuer: 'DigiCert Global Root G2', daysLeft: 218, cipher: 'TLS 1.3 ChaCha20', status: 'VALID' }
  ]);
  const [renewing, setRenewing] = useState(false);

  if (!isOpen) return null;

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => {
      setCerts(prev => prev.map(c => ({ ...c, daysLeft: 365 })));
      setRenewing(false);
      onNotify('Automated PKI ACME certificate challenge succeeded. All certs renewed for 365 days.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                SSL/TLS Certificates &amp; Gov-Cloud PKI Lifecycle Tracker
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  Grade A+ (SSLLabs)
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Cryptographic X.509 certificates for edge sensors, public APIs, and gRPC backplanes</p>
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
                  <th className="p-2.5">Domain / Endpoint</th>
                  <th className="p-2.5">Certificate Authority</th>
                  <th className="p-2.5">Days Left</th>
                  <th className="p-2.5">Cipher Suite</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {certs.map((c) => (
                  <tr key={c.domain} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink">{c.domain}</td>
                    <td className="p-2.5 font-sans text-ink-secondary">{c.issuer}</td>
                    <td className="p-2.5 font-bold text-status-safe">{c.daysLeft} days</td>
                    <td className="p-2.5 text-purple">{c.cipher}</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Automated ACME Certificate Renewal</span>
              <span className="text-[11px] text-ink-secondary">Force an immediate DNS-01 verification and re-issue mutual TLS certificates.</span>
            </div>
            <button
              disabled={renewing}
              onClick={handleRenew}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${renewing ? 'animate-spin' : ''}`} />
              <span>{renewing ? 'Renewing Certs...' : 'Test Force Renewal'}</span>
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

// 13. API Rate Limiter & Token Bucket Governor
export function ApiRateGovernorModal({ isOpen, onClose, onNotify }) {
  const [tiers, setTiers] = useState([
    { tier: 'Tier 1: Emergency & Police CAD', limit: 100000, current: 8420, burst: 150000 },
    { tier: 'Tier 2: Citizen Mobile App', limit: 25000, current: 18400, burst: 35000 },
    { tier: 'Tier 3: Public Open Data API', limit: 2000, current: 710, burst: 3000 }
  ]);

  if (!isOpen) return null;

  const handleUpdateTier = (index, delta) => {
    setTiers(prev => prev.map((t, idx) => idx === index ? { ...t, limit: Math.max(500, t.limit + delta) } : t));
    onNotify('API rate limit bucket capacity updated.');
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
                API Rate Limiter &amp; Token Bucket Governor
              </h3>
              <p className="text-xs text-ink-secondary">Protect core municipal microservices from traffic spikes during flood alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-3">
            {tiers.map((t, idx) => (
              <div key={t.tier} className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-sm">{t.tier}</span>
                  <span className="font-mono text-xs text-purple font-semibold">
                    Current: {t.current.toLocaleString()} / {t.limit.toLocaleString()} req/min
                  </span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple h-full rounded-full"
                    style={{ width: `${Math.min(100, (t.current / t.limit) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-ink-secondary">Burst Capacity: {t.burst.toLocaleString()} req</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleUpdateTier(idx, -500)}
                      className="px-2 py-0.5 bg-surface hover:bg-surface-secondary border border-border rounded text-[10px] font-bold"
                    >
                      -500
                    </button>
                    <button
                      onClick={() => handleUpdateTier(idx, 1000)}
                      className="px-2 py-0.5 bg-surface hover:bg-surface-secondary border border-border rounded text-[10px] font-bold"
                    >
                      +1000
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

// 14. Database Backup & Point-in-Time Recovery (PITR) Console
export function BackupPitrModal({ isOpen, onClose, onNotify }) {
  const [isRestoring, setIsRestoring] = useState(false);

  if (!isOpen) return null;

  const handleTestRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      onNotify('Sandbox Point-in-Time Recovery successful. Verified 1.4M rows at 18:30 IST snapshot.');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Database Backup &amp; Point-in-Time Recovery (PITR)
              </h3>
              <p className="text-xs text-ink-secondary">Write-Ahead Log (WAL) streaming and immutable S3 disaster archives</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">WAL Stream Status</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">CONTINUOUS (0s Lag)</div>
              <span className="text-[10px] text-ink-secondary">Encrypted SHA-256</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Latest Full Snapshot</span>
              <div className="text-xl font-bold text-ink mt-0.5">Today 04:00 IST</div>
              <span className="text-[10px] text-purple">Size: 482.4 GB</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3 font-sans">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Automated Sandbox Restore Validation</h4>
            <p className="text-ink-secondary text-[11px]">
              Execute an isolated ephemeral container restore to verify cryptographic backup integrity without impacting live traffic.
            </p>

            <button
              disabled={isRestoring}
              onClick={handleTestRestore}
              className="px-4 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>{isRestoring ? 'Verifying Sandbox Restore...' : 'Test Sandbox Restore to 18:30 IST'}</span>
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
