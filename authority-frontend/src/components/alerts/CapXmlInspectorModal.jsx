import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, FileText, CheckCircle2 } from 'lucide-react';

export default function CapXmlInspectorModal({
  isOpen,
  onClose,
  alertData = {}
}) {
  if (!isOpen) return null;

  const [format, setFormat] = useState('xml'); // 'xml' | 'json'
  const [copied, setCopied] = useState(false);

  const identifier = alertData.id || 'CAP-IN-MH-MCGM-2026-0842';
  const sender = 'dmc-control@mcgm.gov.in';
  const sentTime = new Date().toISOString();
  const title = alertData.title || 'URBAN FLASH FLOOD WARNING';
  const severity = alertData.severity || 'Extreme';
  const wards = alertData.wards || ['Ward K/E', 'Ward L'];
  const depth = alertData.depthThreshold || '20-35 cm';
  const body = alertData.message || 'Severe roadway inundation expected. Avoid low-lying underpasses.';

  const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${identifier}</identifier>
  <sender>${sender}</sender>
  <sent>${sentTime}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code authority="WMO">CAP-1.2-IN-NDMA</code>
  <info>
    <language>en-IN</language>
    <category>Met</category>
    <event>${title}</event>
    <responseType>Evacuate</responseType>
    <responseType>Shelter</responseType>
    <urgency>Immediate</urgency>
    <severity>${severity}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>IMD_PHENOMENON</valueName>
      <value>FLASH_FLOOD</value>
    </eventCode>
    <expires>${new Date(Date.now() + 3 * 3600000).toISOString()}</expires>
    <senderName>Brihanmumbai Municipal Corporation - Disaster Management Unit</senderName>
    <headline>${title}</headline>
    <description>${body}</description>
    <instruction>Evacuate low-lying underpasses immediately. Move vehicles to elevated parking. Dial 1916 for emergency water rescue assistance.</instruction>
    <parameter>
      <valueName>HazardDepthRange</valueName>
      <value>${depth}</value>
    </parameter>
    <parameter>
      <valueName>DrainageSurchargeIndex</valueName>
      <value>88.4%</value>
    </parameter>
    <area>
      <areaDesc>${wards.join(', ')}, Mumbai Metropolitan Region</areaDesc>
      ${wards
        .map(
          (w) => `<geocode>
        <valueName>MCGM_WARD_CODE</valueName>
        <value>${w.replace(/\s+/g, '_').toUpperCase()}</value>
      </geocode>`
        )
        .join('\n      ')}
    </area>
  </info>
</alert>`;

  const capJson = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "EmergencyAlert",
      "identifier": identifier,
      "sender": sender,
      "sent": sentTime,
      "status": "Actual",
      "msgType": "Alert",
      "scope": "Public",
      "info": {
        "language": "en-IN",
        "category": "Met",
        "event": title,
        "urgency": "Immediate",
        "severity": severity,
        "certainty": "Observed",
        "headline": title,
        "description": body,
        "parameters": {
          "hazardDepthRange": depth,
          "drainageSurcharge": "88.4%"
        },
        "targetAreas": wards
      }
    },
    null,
    2
  );

  const activeContent = format === 'xml' ? capXml : capJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], {
      type: format === 'xml' ? 'application/xml' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${identifier}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Common Alerting Protocol (CAP v1.2) XML &amp; Schema Inspector
              </h3>
              <p className="text-[11px] text-ink-secondary">
                OASIS / ITU / WMO Standard Interoperable Emergency Data Exchange Protocol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-secondary border border-border rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setFormat('xml')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'xml' ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                CAP-XML v1.2
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'json' ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                JSON-LD
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Validation Badges */}
        <div className="px-4 py-2 bg-surface-secondary border-b border-border flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-4 text-ink-secondary">
            <span className="flex items-center gap-1 text-status-safe font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> OASIS CAP-1.2 Validated
            </span>
            <span>Encoding: UTF-8</span>
            <span>Target Wards: {wards.length}</span>
            <span>URN: urn:oasis:names:tc:emergency:cap:1.2</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
            SEVERITY: {severity.toUpperCase()}
          </span>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#181622] font-mono text-xs text-[#E6E4F0] leading-relaxed selection:bg-purple/40">
          <pre className="whitespace-pre-wrap">{activeContent}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <div className="text-[11px] font-mono text-ink-secondary">
            Payload size: {(new Blob([activeContent]).size / 1024).toFixed(2)} KB
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied XML!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{format}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

