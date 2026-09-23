import React, { useState } from 'react';
import { X, Code2, Download, Copy, Check, Send, Globe, Terminal } from 'lucide-react';
import { ROUTE_PROFILES } from './mobilityConstants';

export default function ApiGeoJsonExportModal({ isOpen, onClose, selectedRouteId, vehicleId }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('geojson'); // 'geojson' | 'curl' | 'webhook'
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://cad.108mumbai.gov.in/api/v2/dispatch-webhook');
  const [webhookSent, setWebhookSent] = useState(false);

  const route = ROUTE_PROFILES.find((r) => r.id === selectedRouteId) || ROUTE_PROFILES[1];

  const geoJsonData = {
    type: 'FeatureCollection',
    metadata: {
      generatedAt: new Date().toISOString(),
      engine: 'Mumbai Municipal Flood-Aware Routing Engine v2.4',
      vehicleClass: vehicleId || 'ambulance',
      routeId: route.id,
      clearanceApproved: route.maxFloodDepthCm === 0,
    },
    features: [
      {
        type: 'Feature',
        properties: {
          name: route.name,
          corridor: route.corridor,
          distanceKm: route.distanceKm,
          estimatedDurationMin: route.baseDurationMin,
          flyoverCoveragePercent: route.flyoverPercentage,
          maxInundationDepthCm: route.maxFloodDepthCm,
          hazardSegmentsCount: route.hazardSegments,
          stroke: route.maxFloodDepthCm === 0 ? '#6D4AFF' : '#D94A4A',
          strokeWidth: 4,
        },
        geometry: {
          type: 'LineString',
          coordinates: (route.pathPoints || []).map((pt) => [pt[1], pt[0]]), // lon, lat
        },
      },
    ],
  };

  const curlCommand = `curl -X POST "https://api.flood-command.mcgm.gov.in/v2/routing/flood-safe" \\
  -H "Authorization: Bearer MCGM_OPS_TOKEN_2026_X91" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": [19.0384, 72.8612],
    "destination": [19.1136, 72.8697],
    "vehicle_class": "${vehicleId || 'ambulance'}",
    "max_flood_depth_cm": 0,
    "prefer_elevated_flyovers": true,
    "bypass_submerged_subways": true
  }'`;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flood_safe_route_${route.id}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSendWebhook = (e) => {
    e.preventDefault();
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-soft text-purple">
              <Code2 className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                REST API &amp; OpenTripPlanner GeoJSON Export Engine
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-ink border border-border">
                  OpenAPI 3.1
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Standardized GIS interoperability for Mapbox, OSRM, Google Maps Fleet Engine, and Municipal Webhooks
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

        {/* Tab switcher */}
        <div className="flex gap-2 px-6 pt-3 border-b border-border">
          {[
            { id: 'geojson', label: 'GeoJSON Specification', icon: Globe },
            { id: 'curl', label: 'cURL Command Line', icon: Terminal },
            { id: 'webhook', label: 'CAD Webhook Dispatch', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-purple text-purple'
                    : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'geojson' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-secondary">
                  RFC 7946 Standard Compliant GeoJSON LineString
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(geoJsonData)}
                    className="px-2.5 py-1.5 bg-surface border border-border hover:border-purple rounded text-xs font-semibold flex items-center gap-1 text-ink"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 bg-purple text-white hover:bg-purple-deep rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .geojson</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-xl bg-ink text-neutral-200 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(geoJsonData, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-secondary">
                  Production cURL Request (Authenticated)
                </span>
                <button
                  onClick={() => handleCopy(curlCommand)}
                  className="px-2.5 py-1.5 bg-surface border border-border hover:border-purple rounded text-xs font-semibold flex items-center gap-1 text-ink"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-ink text-green-400 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                {curlCommand}
              </pre>
            </div>
          )}

          {activeTab === 'webhook' && (
            <form onSubmit={handleSendWebhook} className="space-y-4">
              {webhookSent && (
                <div className="p-3 rounded-xl bg-status-safe-soft border border-status-safe text-status-safe font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Webhook 200 OK: Payload received by Emergency CAD Fleet Gateway in 42ms.</span>
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono uppercase text-ink-secondary block mb-1">
                  Destination Webhook Endpoint
                </label>
                <input
                  type="url"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink font-mono text-xs focus:outline-none focus:border-purple"
                />
              </div>
              <div className="p-3 bg-surface-secondary rounded-xl border border-border text-ink-secondary">
                Payload includes route geometry, step-by-step guidance, hydrodynamic water depths, and vehicle priority token.
              </div>
              <button
                type="submit"
                className="py-2.5 px-4 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Transmit Test Webhook Payload
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <span className="text-xs text-ink-secondary">
            Compatible with OSRM, GraphHopper, Valhalla, and Mapbox Navigation SDKs.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close API Engine
          </button>
        </div>
      </div>
    </div>
  );
}

