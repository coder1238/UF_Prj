import React, { useState } from 'react';
import {
  Navigation2,
  X,
  Compass,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function FleetCadRouteModal({ asset, onClose, onTransmitted }) {
  const navigate = useNavigate();
  const { setActiveSafeRoute, addCommandLog } = useFloodCommand();
  const [vehicleClass, setVehicleClass] = useState('AMBULANCE_ADVANCED'); // AMBULANCE_ADVANCED, FIRE_TENDER_HEAVY, RESCUE_TRUCK_4X4, LOGISTICS_OXYGEN
  const [copied, setCopied] = useState(false);

  const WAYPOINTS = [
    {
      seq: 1,
      instruction: 'Depart Regional Depot / Hub',
      location: 'Eastern Express Highway South Flyover Concourse',
      elevationMsl: 11.2,
      depthCm: 0,
      status: 'FREE_FLOW',
    },
    {
      seq: 2,
      instruction: 'Take Elevated Bypass Ramp over flooded Ambedkar Rd Junction',
      location: 'Sion East High-Level Elevated Connector',
      elevationMsl: 14.5,
      depthCm: 0,
      status: 'ELEVATED_SAFE',
    },
    {
      seq: 3,
      instruction: 'Bypass Surcharged Node D-204 Box Drain',
      location: 'Sulochana Shetty Marg Ingress Loop (Escorted Lane)',
      elevationMsl: 6.8,
      depthCm: 4,
      status: 'SHALLOW_SURFACE',
    },
    {
      seq: 4,
      instruction: `Enter ${asset.name} via Gate 2 (Dedicated Ramp)`,
      location: `${asset.name} - Protected Ingress Ramp`,
      elevationMsl: asset.plinthElevationMsl || 5.2,
      depthCm: 2,
      status: 'DESTINATION_SECURED',
    },
  ];

  const cadPayload = {
    cadPacketId: `CAD-RT-${Date.now().toString().slice(-6)}`,
    destinationFacility: asset.name,
    ward: asset.ward,
    coordinates: asset.coordinates,
    recommendedGate: 'Gate 2 (Protected Ambulance Ramp)',
    maxInundationEnRouteCm: 4,
    estTransitTimeMinutes: 7,
    clearanceElevationMsl: 6.8,
    assignedVehicleClass: vehicleClass,
    turnByTurnWaypoints: WAYPOINTS,
    emergencyFrequencies: ['VHF-MED-04', '108-DISPATCH-TAC'],
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(cadPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTransmitCad = () => {
    setActiveSafeRoute({
      destination: asset.name,
      coordinates: asset.coordinates,
      waypoints: WAYPOINTS,
      cadPacketId: cadPayload.cadPacketId,
      maxDepth: 4,
    });

    addCommandLog({
      officer: 'Emergency Mobility Dispatch Desk',
      type: 'FLEET_CAD_ROUTE_STAGED',
      details: `Dispatched sanitized flood-safe ingress corridor for ${asset.name} (${cadPayload.cadPacketId}) to 108 Emergency Ambulance & Fire Fleet.`,
      status: 'ROUTED_ACTIVE',
    });

    onTransmitted(`Safe Ingress Corridor ${cadPayload.cadPacketId} pushed to Emergency Fleet CAD.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-status-safe-soft text-status-safe flex items-center justify-center border border-status-safe/30">
              <Navigation2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Emergency Fleet CAD Sanitized Ingress Routing
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold uppercase">
                  Flood-Free Nav Corridors
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                High-Clearance Routing to {asset.name}
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
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Vehicle Class Selector */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Vehicle Dispatch Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'AMBULANCE_ADVANCED', label: '108 ALS Ambulance', wading: '35 cm max' },
                { id: 'FIRE_TENDER_HEAVY', label: 'Heavy Fire Tender', wading: '70 cm max' },
                { id: 'RESCUE_TRUCK_4X4', label: '4x4 Disaster Rescue', wading: '65 cm max' },
                { id: 'LOGISTICS_OXYGEN', label: 'Oxygen Tanker Truck', wading: '40 cm max' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicleClass(v.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    vehicleClass === v.id
                      ? 'bg-status-safe-soft/60 border-status-safe text-ink font-semibold ring-1 ring-status-safe'
                      : 'bg-surface border-border text-ink-secondary hover:border-status-safe/40'
                  }`}
                >
                  <div className="font-bold text-xs text-ink">{v.label}</div>
                  <div className="text-[10px] font-mono text-status-safe mt-0.5">{v.wading}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-surface-secondary p-2.5 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Est Transit ETA</span>
              <span className="text-sm font-bold text-ink">7.2 min</span>
            </div>
            <div className="bg-surface-secondary p-2.5 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Corridor Length</span>
              <span className="text-sm font-bold text-purple">{asset.nearestSafeRoute || '2.8 km'}</span>
            </div>
            <div className="bg-surface-secondary p-2.5 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Peak Water On Route</span>
              <span className="text-sm font-bold text-status-safe">4 cm (Safe)</span>
            </div>
            <div className="bg-surface-secondary p-2.5 rounded-xl border border-border">
              <span className="text-[10px] text-ink-secondary uppercase block">Submerged Roads Avoided</span>
              <span className="text-sm font-bold text-status-alert">{asset.affectedAccessRoads || 3} Corridors</span>
            </div>
          </div>

          {/* Turn-by-Turn Waypoints */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Sanitized Turn-by-Turn Telemetry &amp; Bypass Nodes
            </label>
            <div className="space-y-2">
              {WAYPOINTS.map((wp) => (
                <div
                  key={wp.seq}
                  className="p-2.5 bg-surface-secondary/50 rounded-xl border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple text-white font-mono text-xs font-bold flex items-center justify-center">
                      {wp.seq}
                    </div>
                    <div>
                      <div className="font-bold text-ink">{wp.instruction}</div>
                      <div className="text-[10px] text-ink-secondary flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-purple" />
                        <span>{wp.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                      {wp.status}
                    </span>
                    <div className="text-[10px] text-ink-secondary mt-1">
                      Elev: {wp.elevationMsl}m MSL • {wp.depthCm}cm water
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packet Info */}
          <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-[11px] font-mono">
            <span className="text-ink-secondary">
              Telemetry Packet: <strong className="text-ink">{cadPayload.cadPacketId}</strong>
            </span>
            <button
              onClick={handleCopyToClipboard}
              className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-purple text-ink flex items-center gap-1.5 transition-colors font-semibold"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy CAD JSON'}</span>
            </button>
          </div>

          {/* Action Footer */}
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
                onClick={() => {
                  handleTransmitCad();
                  onClose();
                  navigate('/mobility');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-purple text-ink flex items-center gap-1.5 transition-colors"
              >
                <span>View on Mobility Grid (Module 09)</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple" />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTransmitCad();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-status-safe text-white hover:bg-status-safe/90 shadow-subtle flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Navigation2 className="w-3.5 h-3.5" />
                <span>Transmit Safe Route to Fleet CAD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

