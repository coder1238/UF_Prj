import React, { useState, useEffect } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';

// Domain constants
import {
  MOBILITY_VEHICLES,
  WAYPOINT_PRESETS,
  ROUTE_PROFILES,
  UNDERPASS_SUMPS,
  ACTIVE_MOBILITY_FLEET,
  GREEN_WAVE_CORRIDORS,
  MULTIMODAL_TRANSIT_STATUS,
  TURN_BY_TURN_GUIDANCE,
  HISTORICAL_FLOOD_BENCHMARKS,
  INITIAL_BARRICADES,
  ELEVATED_STAGING_DEPOTS,
  DRONE_RECON_FEEDS,
  ROADBED_PAVEMENT_RISK,
} from '../components/mobility/mobilityConstants';

// Operational Feature Modals & Drawers
import ElevationCrossSectionModal from '../components/mobility/ElevationCrossSectionModal';
import LiveFleetTelemetryModal from '../components/mobility/LiveFleetTelemetryModal';
import BarricadeManagerDrawer from '../components/mobility/BarricadeManagerDrawer';
import UnderpassSumpTelemetryModal from '../components/mobility/UnderpassSumpTelemetryModal';
import GreenWaveControllerModal from '../components/mobility/GreenWaveControllerModal';
import MultimodalTransitMatrixModal from '../components/mobility/MultimodalTransitMatrixModal';
import MultiCriteriaParetoModal from '../components/mobility/MultiCriteriaParetoModal';
import CitizenMobilityBroadcastModal from '../components/mobility/CitizenMobilityBroadcastModal';
import VmsNetworkProgrammerModal from '../components/mobility/VmsNetworkProgrammerModal';
import TidalRoadInundationModal from '../components/mobility/TidalRoadInundationModal';
import TurnByTurnGuidanceDrawer from '../components/mobility/TurnByTurnGuidanceDrawer';
import RoadbedPavementRiskModal from '../components/mobility/RoadbedPavementRiskModal';
import DroneAerialReconModal from '../components/mobility/DroneAerialReconModal';
import StagingDepotAllocatorModal from '../components/mobility/StagingDepotAllocatorModal';
import VehicleWaterIngressSimulatorModal from '../components/mobility/VehicleWaterIngressSimulatorModal';
import InterAgencyCoordinationModal from '../components/mobility/InterAgencyCoordinationModal';
import IsochroneReachabilityModal from '../components/mobility/IsochroneReachabilityModal';
import ApiGeoJsonExportModal from '../components/mobility/ApiGeoJsonExportModal';
import HistoricalHotspotReplayModal from '../components/mobility/HistoricalHotspotReplayModal';
import MobilityAuditManifestModal from '../components/mobility/MobilityAuditManifestModal';

import {
  Navigation2,
  Truck,
  Shield,
  Clock,
  Send,
  Code,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRightLeft,
  Activity,
  Layers,
  Radio,
  Tv,
  Waves,
  Train,
  Sliders,
  Bell,
  Cpu,
  Eye,
  Building2,
  Users,
  FileText,
  History,
  Hammer,
  Volume2,
  MapPin,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Search,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function FloodAwareMobility() {
  const { nowcastMinutes } = useFloodCommand();

  // Core Interactive States
  const [selectedRouteId, setSelectedRouteId] = useState('flood-aware'); // 'standard' | 'flood-aware' | 'emergency' | 'coastal-freeway'
  const [selectedVehicleId, setSelectedVehicleId] = useState('ambulance');
  const [originWaypointId, setOriginWaypointId] = useState('sion-hospital');
  const [destinationWaypointId, setDestinationWaypointId] = useState('andheri-relief');
  const [toast, setToast] = useState(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [dispatchSuccessToken, setDispatchSuccessToken] = useState(null);

  // Active Vehicle simulation progress along route (0 to 100%)
  const [isSimulatingRun, setIsSimulatingRun] = useState(true);
  const [simVehicleProgress, setSimVehicleProgress] = useState(38);
  const [simVehicleSpeed, setSimVehicleSpeed] = useState(48);

  // API Console interactive editable parameters
  const [apiPreferFlyovers, setApiPreferFlyovers] = useState(true);
  const [apiBypassSubways, setApiBypassSubways] = useState(true);
  const [apiMaxDepthCm, setApiMaxDepthCm] = useState(0);

  // Feature category filter for right section
  const [featureCategory, setFeatureCategory] = useState('all'); // 'all' | 'telemetry' | 'traffic' | 'analytics' | 'dispatch'
  const [featureSearch, setFeatureSearch] = useState('');

  // 20 Modal Open/Close States
  const [modals, setModals] = useState({
    crossSection: false,
    fleetTelemetry: false,
    barricades: false,
    underpasses: false,
    greenWave: false,
    transitMatrix: false,
    pareto: false,
    citizenBroadcast: false,
    vms: false,
    tidal: false,
    turnByTurn: false,
    pavement: false,
    droneRecon: false,
    stagingDepots: false,
    waterIngress: false,
    interAgency: false,
    isochrone: false,
    apiExport: false,
    historical: false,
    manifest: false,
  });

  const openModal = (name) => setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModals((prev) => ({ ...prev, [name]: false }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Resolve active objects
  const activeVehicle = MOBILITY_VEHICLES.find((v) => v.id === selectedVehicleId) || MOBILITY_VEHICLES[0];
  const originWaypoint = WAYPOINT_PRESETS.find((w) => w.id === originWaypointId) || WAYPOINT_PRESETS[0];
  const destinationWaypoint = WAYPOINT_PRESETS.find((w) => w.id === destinationWaypointId) || WAYPOINT_PRESETS[1];

  // Dynamic route calculation taking into account nowcast timeline multiplier
  // As nowcastMinutes increases (0 -> 180 min), water depth increases proportionally
  const nowcastSurgeMultiplier = 1 + Math.sin(((nowcastMinutes || 0) / 180) * Math.PI) * 0.45;

  const dynamicRoutes = ROUTE_PROFILES.map((route) => {
    const dynamicDepth = route.maxFloodDepthCm > 0
      ? Math.round(route.maxFloodDepthCm * nowcastSurgeMultiplier)
      : 0;

    return {
      ...route,
      dynamicDepth,
    };
  });

  const activeRoute = dynamicRoutes.find((r) => r.id === selectedRouteId) || dynamicRoutes[1];

  // Dynamic Clearance Evaluation based on vehicle clearance vs dynamic water depth
  const vehicleWadingLimitCm = activeVehicle.wadingMaxCm;
  const isRoutePassable = activeRoute.dynamicDepth <= vehicleWadingLimitCm;
  const clearanceDeficitCm = Math.max(0, activeRoute.dynamicDepth - vehicleWadingLimitCm);

  // Quick Tactical Mission Presets
  const MISSION_PRESETS = [
    {
      label: 'Trauma Patient Transfer',
      origin: 'sion-hospital',
      dest: 'andheri-relief',
      vehicle: 'ambulance',
      route: 'flood-aware',
    },
    {
      label: 'Dewatering Pump Logistics',
      origin: 'bkc-command',
      dest: 'kurla-station',
      vehicle: 'supply_truck',
      route: 'emergency',
    },
    {
      label: 'Subway Rescue Extraction',
      origin: 'milan-subway',
      dest: 'airport-cargo',
      vehicle: 'heavy_crane',
      route: 'emergency',
    },
    {
      label: 'South Mumbai Evacuation Corridor',
      origin: 'nair-hospital',
      dest: 'chembur-naka',
      vehicle: 'transit',
      route: 'coastal-freeway',
    },
  ];

  const handleApplyMissionPreset = (preset) => {
    setOriginWaypointId(preset.origin);
    setDestinationWaypointId(preset.dest);
    setSelectedVehicleId(preset.vehicle);
    setSelectedRouteId(preset.route);
    showToast(`Tactical mission loaded: ${preset.label}.`);
  };

  // Swap origin & destination
  const handleSwapWaypoints = () => {
    const temp = originWaypointId;
    setOriginWaypointId(destinationWaypointId);
    setDestinationWaypointId(temp);
    showToast('Origin and Destination waypoints swapped. Corridor reversed.');
  };

  // Automated vehicle simulation loop
  useEffect(() => {
    if (!isSimulatingRun) return;
    const timer = setInterval(() => {
      setSimVehicleProgress((prev) => (prev >= 98 ? 10 : prev + 2));
      if (selectedRouteId === 'standard') {
        setSimVehicleSpeed(18); // slowed by waterlogged conditions
      } else {
        setSimVehicleSpeed(54); // fast on elevated flyovers
      }
    }, 1600);
    return () => clearInterval(timer);
  }, [isSimulatingRun, selectedRouteId]);

  // Transmit Route to 108 CAD
  const handleTransmitRoute = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      const token = `CAD-MCGM-${Math.floor(1000 + Math.random() * 9000)}-${activeVehicle.id.toUpperCase()}`;
      setDispatchSuccessToken(token);
      showToast(`Safe route transmitted to 108 Fleet CAD. Token: ${token}`);
    }, 1100);
  };

  // All 20 Operational Authority Features - completely without numbering
  const OPERATIONAL_FEATURES = [
    {
      id: 'crossSection',
      title: 'Elevation Profile',
      desc: 'Roadbed datum vs hydraulic water depth',
      icon: TrendingUp,
      color: 'text-purple',
      category: 'telemetry',
    },
    {
      id: 'fleetTelemetry',
      title: 'Fleet Telemetry',
      desc: 'Live GPS AVL & CAD link monitor',
      icon: Radio,
      color: 'text-purple',
      category: 'telemetry',
    },
    {
      id: 'underpasses',
      title: 'Sump Probes',
      desc: 'Ultrasonic sensors & pump SCADA',
      icon: Activity,
      color: 'text-status-warning',
      category: 'telemetry',
    },
    {
      id: 'greenWave',
      title: 'Green Wave',
      desc: 'Signal corridor preemption',
      icon: Clock,
      color: 'text-status-safe',
      category: 'traffic',
    },
    {
      id: 'droneRecon',
      title: 'Drone Video',
      desc: 'UAV aerial feeds & CV bounding',
      icon: Eye,
      color: 'text-purple',
      category: 'telemetry',
    },
    {
      id: 'tidal',
      title: 'Tidal Surge',
      desc: 'Outfall lockout & backflow predictor',
      icon: Waves,
      color: 'text-blue-500',
      category: 'telemetry',
    },
    {
      id: 'barricades',
      title: 'Barricades',
      desc: 'Road closure orders & detours',
      icon: Shield,
      color: 'text-status-alert',
      category: 'traffic',
    },
    {
      id: 'vms',
      title: 'Highway VMS',
      desc: 'Overhead LED matrix programmer',
      icon: Tv,
      color: 'text-amber-500',
      category: 'traffic',
    },
    {
      id: 'transitMatrix',
      title: 'Rail & BEST',
      desc: 'Suburban tracks & bus bridging',
      icon: Train,
      color: 'text-blue-600',
      category: 'traffic',
    },
    {
      id: 'pavement',
      title: 'Pavement Risk',
      desc: 'Bitumen washout & manhole safety',
      icon: Hammer,
      color: 'text-status-warning',
      category: 'traffic',
    },
    {
      id: 'stagingDepots',
      title: 'Staging Depots',
      desc: 'Elevated fleet marshaling hubs',
      icon: Building2,
      color: 'text-emerald-600',
      category: 'traffic',
    },
    {
      id: 'turnByTurn',
      title: 'Turn by Turn',
      desc: 'Sequential maneuvers & hazards',
      icon: Navigation2,
      color: 'text-purple',
      category: 'traffic',
    },
    {
      id: 'pareto',
      title: 'Pareto Tradeoff',
      desc: 'Multi-criteria route MCDA optimizer',
      icon: Sliders,
      color: 'text-purple',
      category: 'analytics',
    },
    {
      id: 'waterIngress',
      title: 'Wading Physics',
      desc: 'Engine hydrolock & buoyancy simulation',
      icon: Cpu,
      color: 'text-purple',
      category: 'analytics',
    },
    {
      id: 'isochrone',
      title: 'Isochrones',
      desc: 'Travel-time catchment shrinkage',
      icon: Compass,
      color: 'text-purple',
      category: 'analytics',
    },
    {
      id: 'historical',
      title: 'Historical Logs',
      desc: 'Cloudburst benchmark archive replay',
      icon: History,
      color: 'text-purple',
      category: 'analytics',
    },
    {
      id: 'citizenBroadcast',
      title: 'Citizen Alerts',
      desc: 'Geofenced CAP alerts (SMS/WhatsApp)',
      icon: Bell,
      color: 'text-status-alert',
      category: 'dispatch',
    },
    {
      id: 'interAgency',
      title: 'Inter-Agency',
      desc: 'Joint BMC-Police-NDRF sign-off',
      icon: Users,
      color: 'text-blue-600',
      category: 'dispatch',
    },
    {
      id: 'apiExport',
      title: 'API & GeoJSON',
      desc: 'OpenAPI 3.1 & CAD webhook engine',
      icon: Code,
      color: 'text-purple',
      category: 'dispatch',
    },
    {
      id: 'manifest',
      title: 'Legal Manifest',
      desc: 'Official route clearance authorization',
      icon: FileText,
      color: 'text-purple',
      category: 'dispatch',
    },
  ];

  // Filter features by search and category
  const filteredFeatures = OPERATIONAL_FEATURES.filter((f) => {
    const matchesCategory = featureCategory === 'all' || f.category === featureCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.desc.toLowerCase().includes(featureSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)] text-ink">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-status-safe flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar with Actionable Operational Badges */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-4 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
              <Navigation2 className="w-5 h-5 text-purple" />
            </div>
            <h2 className="text-base font-bold text-ink uppercase tracking-wide">
              Flood-Aware Emergency Mobility &amp; Dynamic Hazard Routing Engine
            </h2>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Real-time hydrodynamic clearance routing with flyover prioritization, SCADA sump telemetry, and 108 CAD preemption
          </p>
        </div>

        {/* Actionable Status Badges (Click directly opens the operational feature) */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <button
            onClick={() => openModal('greenWave')}
            className="px-2.5 py-1 rounded-lg bg-purple-soft hover:bg-purple hover:text-white text-purple border border-purple/30 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Click to open Green Wave Signal Controller"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple group-hover:text-white" />
            <span>Green Wave: 7 Signals Sync</span>
          </button>

          <button
            onClick={() => openModal('tidal')}
            className="px-2.5 py-1 rounded-lg bg-status-alert-soft hover:bg-status-alert hover:text-white text-status-alert border border-status-alert/30 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Click to open Tidal Surge Predictor"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>High Tide: +4.87m (19:42 IST)</span>
          </button>

          <button
            onClick={() => openModal('fleetTelemetry')}
            className="px-2.5 py-1 rounded-lg bg-status-safe-soft hover:bg-status-safe hover:text-white text-status-safe border border-status-safe/30 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Click to open Fleet GPS CAD Monitor"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5 CAD Units Deployed</span>
          </button>
        </div>
      </div>

      {/* Vehicle Selector Bar with Real Clearance Ratings */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-purple" />
          <span className="text-xs font-mono font-bold uppercase text-ink-secondary">
            Emergency Fleet Class:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-secondary p-1 rounded-xl border border-border overflow-x-auto w-full sm:w-auto">
          {MOBILITY_VEHICLES.map((v) => {
            const isSelected = selectedVehicleId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  showToast(`Vehicle class switched to ${v.label} (Clearance: ${v.clearanceMm}mm).`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple text-white shadow-subtle font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface'
                }`}
              >
                <span>{v.label.split('(')[0]}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-surface text-purple border border-border'
                  }`}
                >
                  {v.clearanceMm}mm
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Left Map (8 cols) + Right Operational Features & Route Controls (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Interactive GIS Map Twin & Live Route Telemetry (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          {/* Map Container with Route Overlay HUD */}
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-elevated bg-canvas">
            {/* Live Corridor Status HUD Floating Pill */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-surface/90 backdrop-blur-md p-2 rounded-xl border border-border shadow-subtle text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isRoutePassable ? 'bg-status-safe animate-pulse' : 'bg-status-alert animate-bounce'}`}></span>
                <span className="font-bold text-ink">{activeRoute.name.split('(')[0]}</span>
              </div>
              <span className="text-ink-secondary font-mono">
                {activeRoute.distanceKm} km &bull; {activeRoute.baseDurationMin}m &bull; {activeRoute.flyoverPercentage}% Flyover
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isRoutePassable ? 'bg-status-safe text-white' : 'bg-status-alert text-white'
                }`}
              >
                {isRoutePassable ? 'CLEARANCE OK' : `BLOCKED (${activeRoute.dynamicDepth}cm)`}
              </span>
            </div>

            {/* Live Simulated Vehicle Telemetry HUD Floating Pill with Interactive Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-ink/90 backdrop-blur-md text-white p-2 px-3 rounded-xl border border-neutral-700 shadow-elevated text-xs font-mono">
              <button
                onClick={() => setIsSimulatingRun(!isSimulatingRun)}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white"
                title={isSimulatingRun ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isSimulatingRun ? <Pause className="w-3 h-3 text-status-warning" /> : <Play className="w-3 h-3 text-status-safe" />}
              </button>
              <button
                onClick={() => setSimVehicleProgress(10)}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white"
                title="Restart Vehicle Run"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <span>GPS: {activeVehicle.label.split('(')[0]}</span>
              <span className="text-purple-soft font-bold">{simVehicleSpeed} km/h</span>
              <span className="text-neutral-400">Prog: {simVehicleProgress}%</span>
            </div>

            {/* Embedded Interactive Map Twin */}
            <InteractiveMapTwin
              height="580px"
              customCenter={[72.875, 19.075]}
              customZoom={12.4}
            />

            {/* Bottom HUD Bar on Map: Route Choke Points & Cross-Section Quick Peek */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-surface/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-status-warning" />
                  Corridor Choke Points:
                </span>
                {activeRoute.chokePoints.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {activeRoute.chokePoints.map((cp, idx) => (
                      <button
                        key={idx}
                        onClick={() => openModal('underpasses')}
                        className="px-2 py-0.5 rounded bg-status-alert-soft hover:bg-status-alert hover:text-white border border-status-alert/40 text-status-alert font-mono text-[11px] font-bold transition-all"
                        title="Click to inspect underpass SCADA telemetry"
                      >
                        {cp.name}: {cp.depthCm}cm ({cp.velocity})
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-status-safe font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-status-safe" /> Zero Submerged Segments on Elevated Flyovers
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal('crossSection')}
                  className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold text-[11px] flex items-center gap-1.5 shadow-subtle transition-colors whitespace-nowrap"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Elevation Profile
                </button>
              </div>
            </div>
          </div>

          <TimelineScrubber />
        </div>

        {/* Right Column: Operational Features Panel + Waypoints, Route Cards & CAD Dispatch (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Authority Operational Features Panel */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple" /> Authority Operational Modules
              </span>
              <span className="text-[10px] font-mono text-ink-muted">
                {filteredFeatures.length} Available
              </span>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search operational modules..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-medium text-ink-secondary">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'telemetry', label: 'Telemetry' },
                  { id: 'traffic', label: 'Traffic' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'dispatch', label: 'Dispatch' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFeatureCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                      featureCategory === cat.id
                        ? 'bg-purple text-white font-bold shadow-subtle'
                        : 'bg-surface-secondary text-ink hover:text-purple'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Features Grid in Right Section */}
            <div className="grid grid-cols-2 gap-2 max-h-[290px] overflow-y-auto pr-1">
              {filteredFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <button
                    key={feat.id}
                    onClick={() => openModal(feat.id)}
                    className="p-2.5 rounded-xl bg-surface-secondary/70 hover:bg-purple-soft/50 border border-border hover:border-purple text-left flex flex-col justify-between gap-1 transition-all group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-1.5 rounded-lg bg-surface border border-border group-hover:border-purple/30">
                        <Icon className={`w-3.5 h-3.5 ${feat.color}`} />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-purple group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-ink block group-hover:text-purple transition-colors">
                        {feat.title}
                      </span>
                      <span className="text-[10px] text-ink-secondary line-clamp-1 leading-tight">
                        {feat.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Waypoints Manager with Quick Mission Presets */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple" /> Trip Waypoints Planner
              </span>
              <button
                onClick={handleSwapWaypoints}
                className="text-[11px] text-purple hover:underline flex items-center gap-1 font-semibold"
                title="Swap Origin and Destination"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Reverse Trip
              </button>
            </div>

            {/* Quick Tactical Mission Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase block">
                Quick Tactical Missions:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {MISSION_PRESETS.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyMissionPreset(m)}
                    className="p-1.5 rounded-lg bg-surface-secondary hover:bg-purple-soft hover:text-purple border border-border text-[10px] font-semibold text-ink text-left truncate transition-colors"
                    title={m.label}
                  >
                    &bull; {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Waypoint A (Origin) */}
            <div className="p-2.5 bg-surface-secondary rounded-xl border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-status-safe text-white font-mono font-bold text-[9px] flex items-center justify-center">
                    A
                  </span>
                  Trip Origin
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">{originWaypoint.ward}</span>
              </div>
              <select
                value={originWaypointId}
                onChange={(e) => {
                  setOriginWaypointId(e.target.value);
                  showToast(`Origin changed to ${e.target.value}.`);
                }}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink focus:outline-none focus:border-purple"
              >
                {WAYPOINT_PRESETS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.ward})
                  </option>
                ))}
              </select>
            </div>

            {/* Waypoint B (Destination) */}
            <div className="p-2.5 bg-surface-secondary rounded-xl border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-purple text-white font-mono font-bold text-[9px] flex items-center justify-center">
                    B
                  </span>
                  Trip Destination
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">{destinationWaypoint.ward}</span>
              </div>
              <select
                value={destinationWaypointId}
                onChange={(e) => {
                  setDestinationWaypointId(e.target.value);
                  showToast(`Destination changed to ${e.target.value}.`);
                }}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink focus:outline-none focus:border-purple"
              >
                {WAYPOINT_PRESETS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.ward})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Route Options Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-ink-secondary">
                Alternative Hydrodynamic Corridors
              </span>
              <button
                onClick={() => openModal('pareto')}
                className="text-[11px] text-purple hover:underline font-semibold"
              >
                Compare Pareto
              </button>
            </div>

            {dynamicRoutes.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const failsClearance = route.dynamicDepth > vehicleWadingLimitCm;

              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    showToast(`Route corridor switched to ${route.name.split('(')[0]}.`);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple shadow-elevated bg-purple-soft/40'
                      : failsClearance
                      ? 'border-status-alert/40 bg-status-alert-soft/20 hover:border-status-alert'
                      : 'border-border bg-surface hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple flex-shrink-0" />}
                      {route.name}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${route.badgeColor}`}>
                      {route.statusBadge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono">
                    <div>
                      Distance: <strong>{route.distanceKm} km</strong>
                    </div>
                    <div>
                      Est. Time: <strong>{route.baseDurationMin} min</strong>
                    </div>
                  </div>

                  {/* Dynamic Flood Depth vs Vehicle Clearance */}
                  <div className="mt-2 pt-2 border-t border-border/50 text-[11px]">
                    {route.dynamicDepth === 0 ? (
                      <span className="text-status-safe font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Reliable &bull; 0 Submerged Segments
                      </span>
                    ) : failsClearance ? (
                      <span className="text-status-alert font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Max Depth {route.dynamicDepth}cm (Exceeds {vehicleWadingLimitCm}cm clearance!)
                      </span>
                    ) : (
                      <span className="text-status-warning font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Max Depth {route.dynamicDepth}cm (Passable for {activeVehicle.label.split('(')[0]})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Developer API Console & CAD Fleet Dispatcher with Editable Parameters */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-ink flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-purple" />
                POST /api/v2/routing/flood-safe
              </span>
              <span className="text-[10px] font-mono font-bold text-status-safe">200 OK &bull; 34ms</span>
            </div>

            {/* Interactive API Parameters */}
            <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-surface-secondary rounded-lg border border-border">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiPreferFlyovers}
                  onChange={(e) => setApiPreferFlyovers(e.target.checked)}
                  className="accent-purple rounded"
                />
                <span>Prefer Flyovers</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiBypassSubways}
                  onChange={(e) => setApiBypassSubways(e.target.checked)}
                  className="accent-purple rounded"
                />
                <span>Bypass Subways</span>
              </label>
            </div>

            <pre className="p-3 rounded-xl bg-surface-secondary border border-border text-[10px] font-mono text-ink overflow-x-auto leading-relaxed">
{`{
  "origin": [${originWaypoint.coordinates[0]}, ${originWaypoint.coordinates[1]}],
  "destination": [${destinationWaypoint.coordinates[0]}, ${destinationWaypoint.coordinates[1]}],
  "vehicle_class": "${activeVehicle.id}",
  "wading_limit_cm": ${activeVehicle.wadingMaxCm},
  "prefer_elevated_flyovers": ${apiPreferFlyovers},
  "bypass_submerged_subways": ${apiBypassSubways},
  "current_surge_depth_cm": ${activeRoute.dynamicDepth},
  "route_id": "${activeRoute.id}"
}`}
            </pre>

            {dispatchSuccessToken && (
              <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>MDT Dispatch Token Active: <strong>{dispatchSuccessToken}</strong></span>
              </div>
            )}

            <button
              disabled={isTransmitting}
              onClick={handleTransmitRoute}
              className="w-full mt-1 py-2.5 px-3 bg-purple text-white hover:bg-purple-deep disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center justify-between shadow-subtle transition-all"
            >
              <span>{isTransmitting ? 'Transmitting to 108 CAD Network...' : 'Transmit Route to Vehicle Navigation & CAD'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => openModal('apiExport')}
                className="py-1.5 px-2 bg-surface-secondary hover:bg-surface border border-border rounded-lg text-[11px] font-semibold text-ink flex items-center justify-center gap-1 transition-colors"
              >
                <Code className="w-3 h-3 text-purple" /> API / GeoJSON
              </button>
              <button
                onClick={() => openModal('manifest')}
                className="py-1.5 px-2 bg-surface-secondary hover:bg-surface border border-border rounded-lg text-[11px] font-semibold text-ink flex items-center justify-center gap-1 transition-colors"
              >
                <FileText className="w-3 h-3 text-purple" /> Legal Manifest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Feature Modals & Drawers */}
      <ElevationCrossSectionModal
        isOpen={modals.crossSection}
        onClose={() => closeModal('crossSection')}
        selectedRouteId={selectedRouteId}
        vehicle={activeVehicle}
      />

      <LiveFleetTelemetryModal
        isOpen={modals.fleetTelemetry}
        onClose={() => closeModal('fleetTelemetry')}
      />

      <BarricadeManagerDrawer
        isOpen={modals.barricades}
        onClose={() => closeModal('barricades')}
        onBarricadeChange={(updated) => showToast(`Barricades updated: ${updated.length} entries registered.`)}
      />

      <UnderpassSumpTelemetryModal
        isOpen={modals.underpasses}
        onClose={() => closeModal('underpasses')}
      />

      <GreenWaveControllerModal
        isOpen={modals.greenWave}
        onClose={() => closeModal('greenWave')}
      />

      <MultimodalTransitMatrixModal
        isOpen={modals.transitMatrix}
        onClose={() => closeModal('transitMatrix')}
      />

      <MultiCriteriaParetoModal
        isOpen={modals.pareto}
        onClose={() => closeModal('pareto')}
      />

      <CitizenMobilityBroadcastModal
        isOpen={modals.citizenBroadcast}
        onClose={() => closeModal('citizenBroadcast')}
      />

      <VmsNetworkProgrammerModal
        isOpen={modals.vms}
        onClose={() => closeModal('vms')}
      />

      <TidalRoadInundationModal
        isOpen={modals.tidal}
        onClose={() => closeModal('tidal')}
      />

      <TurnByTurnGuidanceDrawer
        isOpen={modals.turnByTurn}
        onClose={() => closeModal('turnByTurn')}
        routeName={activeRoute.name}
      />

      <RoadbedPavementRiskModal
        isOpen={modals.pavement}
        onClose={() => closeModal('pavement')}
      />

      <DroneAerialReconModal
        isOpen={modals.droneRecon}
        onClose={() => closeModal('droneRecon')}
      />

      <StagingDepotAllocatorModal
        isOpen={modals.stagingDepots}
        onClose={() => closeModal('stagingDepots')}
      />

      <VehicleWaterIngressSimulatorModal
        isOpen={modals.waterIngress}
        onClose={() => closeModal('waterIngress')}
        currentVehicle={activeVehicle}
      />

      <InterAgencyCoordinationModal
        isOpen={modals.interAgency}
        onClose={() => closeModal('interAgency')}
        selectedRoute={activeRoute}
      />

      <IsochroneReachabilityModal
        isOpen={modals.isochrone}
        onClose={() => closeModal('isochrone')}
      />

      <ApiGeoJsonExportModal
        isOpen={modals.apiExport}
        onClose={() => closeModal('apiExport')}
        selectedRouteId={selectedRouteId}
        vehicleId={selectedVehicleId}
      />

      <HistoricalHotspotReplayModal
        isOpen={modals.historical}
        onClose={() => closeModal('historical')}
      />

      <MobilityAuditManifestModal
        isOpen={modals.manifest}
        onClose={() => closeModal('manifest')}
        selectedRouteId={selectedRouteId}
        vehicle={activeVehicle}
      />
    </div>
  );
}
