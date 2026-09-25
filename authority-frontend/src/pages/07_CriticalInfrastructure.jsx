import React, { useState, useMemo } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import {
  INFRASTRUCTURE_CATEGORIES,
  ENRICHED_CRITICAL_ASSETS,
} from '../data/infrastructureData';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import FacilityCommanderModal from '../components/infrastructure/FacilityCommanderModal';
import BarrierDeploymentModal from '../components/infrastructure/BarrierDeploymentModal';
import FleetCadRouteModal from '../components/infrastructure/FleetCadRouteModal';
import MobilePumpDispatchModal from '../components/infrastructure/MobilePumpDispatchModal';
import IncidentActionPlanModal from '../components/infrastructure/IncidentActionPlanModal';
import ScadaTripModal from '../components/infrastructure/ScadaTripModal';
import DroneSurveillanceModal from '../components/infrastructure/DroneSurveillanceModal';
import MutualAidModal from '../components/infrastructure/MutualAidModal';

import {
  Building2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Navigation2,
  Send,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  ZapOff,
  Radio,
  FileText,
  Camera,
  Share2,
  Truck,
  Droplets,
  Gauge,
  Thermometer,
  Compass,
  Search,
  Filter,
  Layers,
  MapPin,
  Clock,
  HeartPulse,
  Fuel,
  Volume2,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Check,
  SlidersHorizontal,
  Crosshair,
} from 'lucide-react';

export default function CriticalInfrastructure() {
  const {
    selectedAsset,
    setSelectedAsset,
    setActiveModule,
    addCommandLog,
    setMapFocusTarget,
    placedBarriers,
    mobilePumpsList,
    evacuationShelters,
    updateShelterOccupancy,
    updateVmsSign,
    requestSupplyTransfer,
  } = useFloodCommand();

  // Local state for assets list to allow reactive modifications (barriers, depths, status)
  const [facilities, setFacilities] = useState(ENRICHED_CRITICAL_ASSETS);
  const [currentAssetId, setCurrentAssetId] = useState(
    selectedAsset?.id || ENRICHED_CRITICAL_ASSETS[0].id
  );

  // Active facility object
  const activeAsset = useMemo(() => {
    return facilities.find((f) => f.id === currentAssetId) || facilities[0];
  }, [facilities, currentAssetId]);

  // Filtering & Search State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [exposureFilter, setExposureFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Dossier Tab (1 to 6)
  const [activeTab, setActiveTab] = useState('defense'); // 'defense' | 'scada' | 'lifeline' | 'mobility' | 'surveillance' | 'command'

  // Modals visibility state
  const [showCommanderModal, setShowCommanderModal] = useState(false);
  const [showBarrierModal, setShowBarrierModal] = useState(false);
  const [showCadModal, setShowCadModal] = useState(false);
  const [showPumpModal, setShowPumpModal] = useState(false);
  const [showIapModal, setShowIapModal] = useState(false);
  const [showDroneModal, setShowDroneModal] = useState(false);
  const [showMutualAidModal, setShowMutualAidModal] = useState(false);
  const [scadaBayToTrip, setScadaBayToTrip] = useState(null);

  // Feature 14: AVHI Stress Test Parameters
  const [simRainfallDelta, setSimRainfallDelta] = useState(0); // 0 to 60 mm/hr
  const [simTideSurcharge, setSimTideSurcharge] = useState(0); // 0 to 1.5 m

  // Feature 18: Shift Log input state
  const [newLogText, setNewLogText] = useState('');

  // Feature 20: Map Overlays State
  const [showBuffer, setShowBuffer] = useState(true);
  const [showHeliPad, setShowHeliPad] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        item.category === selectedCategory ||
        item.type.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchWard =
        selectedWardFilter === 'ALL' || item.ward === selectedWardFilter;

      const matchExposure =
        exposureFilter === 'ALL' || item.exposure === exposureFilter;

      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchWard && matchExposure && matchSearch;
    });
  }, [facilities, selectedCategory, selectedWardFilter, exposureFilter, searchQuery]);

  // Aggregate Counters
  const totalCount = facilities.length;
  const criticalCount = facilities.filter((f) => f.exposure === 'Critical').length;
  const activeBarriersCount = placedBarriers.length;
  const pumpsOnlineCount = facilities.reduce(
    (acc, f) => acc + (f.sumpPumps?.filter((p) => p.status === 'RUNNING').length || 0),
    0
  );

  // Select facility & fly map
  const handleSelectFacility = (facility) => {
    setCurrentAssetId(facility.id);
    setSelectedAsset(facility);
    if (facility.coordinates) {
      setMapFocusTarget({
        coords: [facility.coordinates[1], facility.coordinates[0]],
        title: facility.name,
        subtitle: `${facility.type} • Exposure: ${facility.exposure} (${facility.predictedDepth}cm)`,
        zoom: 14.8,
      });
    }
  };

  // Feature 1: Toggle Sump Pump Turbo Overdrive
  const handleTogglePumpTurbo = (pumpId) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== activeAsset.id) return f;
        const updatedPumps = f.sumpPumps.map((p) => {
          if (p.id !== pumpId) return p;
          const isTurbo = p.status === 'TURBO_OVERDRIVE';
          return {
            ...p,
            status: isTurbo ? 'RUNNING' : 'TURBO_OVERDRIVE',
            currentFlow: isTurbo ? p.capacityM3 * 0.8 : Math.round(p.capacityM3 * 1.15),
            rpm: isTurbo ? 1450 : 1720,
          };
        });
        return { ...f, sumpPumps: updatedPumps };
      })
    );
    showToast(`Pump ${pumpId} switched to 115% Emergency Turbo Overdrive.`);
  };

  // Feature 2: Ingress Gate Hydraulic Barrier Toggle
  const handleToggleGateBarrier = (gateId) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== activeAsset.id) return f;
        const updatedGates = f.ingressGates.map((g) => {
          if (g.id !== gateId) return g;
          const nextActive = !g.barrierActive;
          return {
            ...g,
            barrierActive: nextActive,
            status: nextActive ? 'PROTECTED' : 'AT_RISK',
          };
        });
        return { ...f, ingressGates: updatedGates };
      })
    );
    showToast(`Gate defense actuator updated.`);
  };

  // Feature 3: DG Generator Emergency Load Transfer
  const handleTransferToRooftopDg = (dgId) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== activeAsset.id) return f;
        const updatedDgs = f.dgGenerators.map((dg) => {
          if (dg.id !== dgId) return dg;
          return {
            ...dg,
            status: 'RUNNING_FULL_LOAD',
            loadPercent: 88,
          };
        });
        return { ...f, dgGenerators: updatedDgs };
      })
    );
    addCommandLog({
      officer: 'Facility Power Specialist',
      type: 'DG_LOAD_TRANSFER',
      details: `Transferred critical power load to elevated rooftop generator (${dgId}) at ${activeAsset.name}`,
      status: 'EXECUTED',
    });
    showToast(`Critical power load transferred to ${dgId}. Backup secured.`);
  };

  // Feature 5: Toggle Hospital Code Status (Code Yellow / Code Black)
  const handleToggleCodeStatus = (nextCode) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== activeAsset.id) return f;
        return { ...f, codeStatus: nextCode };
      })
    );
    addCommandLog({
      officer: 'Emergency Medical Coordinator',
      type: `HOSPITAL_${nextCode}_DECLARED`,
      details: `${activeAsset.name} declared ${nextCode}. Emergency 108 CAD routing updated.`,
      status: 'DISPATCHED',
    });
    showToast(`Facility status updated to ${nextCode}.`);
  };

  // Feature 10: Deploy Traffic Police Diversion & Push VMS Road Sign
  const handlePushVmsDiversion = (road) => {
    const vmsMsg = `INGRESS CLOSED: ${road.name} SUBMERGED (${road.floodDepthCm}cm). USE ${road.diversion}`;
    updateVmsSign('VMS-01', vmsMsg, 'ACTIVE / FLOOD DIVERT');
    addCommandLog({
      officer: 'Traffic Coordination Cell',
      type: 'VMS_CORRIDOR_CLOSURE',
      details: `Pushed road diversion to VMS displays around ${activeAsset.name}: ${vmsMsg}`,
      status: 'PUBLISHED_ACTIVE',
    });
    showToast(`Traffic diversion pushed to Variable Message Signs (VMS).`);
  };

  // Feature 11: Request Emergency Supply Transfer from BMC Depot
  const handleRequestResupply = (itemName) => {
    requestSupplyTransfer('DEPOT-01', itemName, 200);
    addCommandLog({
      officer: 'Logistics Liaison',
      type: 'EMERGENCY_RESUPPLY_REQUEST',
      details: `Requisitioned immediate transfer of ${itemName} from BMC Central Depot to ${activeAsset.name}`,
      status: 'CONVOY_DISPATCHED',
    });
    showToast(`Emergency requisition of ${itemName} dispatched from Central Depot.`);
  };

  // Feature 13: Handle SCADA Breaker Tripped from modal
  const handleScadaTripped = (bayId) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== activeAsset.id) return f;
        const updatedBays = (f.scadaBays || []).map((b) => {
          if (b.id !== bayId) return b;
          return {
            ...b,
            status: 'TRIPPED_ISOLATED',
            loadAmps: 0,
          };
        });
        return { ...f, scadaBays: updatedBays };
      })
    );
    showToast(`SCADA Switchgear Bay ${bayId} isolated and locked.`);
  };

  // Feature 18: Add Custom Log to Shift Commander Logbook
  const handleAddShiftLog = (e) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    addCommandLog({
      officer: 'Duty Operations Desk',
      type: 'FACILITY_INSPECTION_NOTE',
      details: `[${activeAsset.name}] ${newLogText}`,
      status: 'LOGGED',
    });
    setNewLogText('');
    showToast('Operational directive logged into Municipal Archive.');
  };

  // Feature 14: Dynamic AVHI Calculation
  const calculatedHazardScore = useMemo(() => {
    const base = activeAsset.predictedDepth * 1.5;
    const rainFactor = simRainfallDelta * 0.45;
    const tideFactor = simTideSurcharge * 12.0;
    const plinthResistance = (activeAsset.plinthElevationMsl || 5.0) * 3.5;
    const score = Math.max(10, Math.min(100, Math.round(base + rainFactor + tideFactor - plinthResistance + 35)));
    return score;
  }, [activeAsset, simRainfallDelta, simTideSurcharge]);

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)] text-ink">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Municipal Readiness Overview */}
      <div className="flex flex-col gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink uppercase tracking-wide flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple" />
              Critical Municipal Infrastructure Protection &amp; Ingress Defense
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                MUNICIPAL DEFENSE DESK
              </span>
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Real-time telemetry, flood barrier actuation, dewatering automation &amp; fleet ingress coordination for 16 lifeline facilities
            </p>
          </div>

          {/* Quick Aggregate Operational Metrics */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="bg-surface-secondary px-3 py-1.5 rounded-xl border border-border flex items-center gap-2">
              <span className="text-[10px] text-ink-secondary uppercase">Monitored Facilities</span>
              <strong className="text-ink font-bold">{totalCount}</strong>
            </div>
            <div className="bg-status-alert-soft px-3 py-1.5 rounded-xl border border-status-alert/30 text-status-alert flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">Critical Exposure</span>
              <strong>{criticalCount}</strong>
            </div>
            <div className="bg-purple-soft px-3 py-1.5 rounded-xl border border-purple/30 text-purple flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">Active Barriers</span>
              <strong>{activeBarriersCount}</strong>
            </div>
            <div className="bg-status-safe-soft px-3 py-1.5 rounded-xl border border-status-safe/30 text-status-safe flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">Sump Pumps Active</span>
              <strong>{pumpsOnlineCount}</strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {INFRASTRUCTURE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple text-white shadow-sm font-bold'
                    : 'bg-surface-secondary text-ink-secondary hover:text-ink border border-border'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 opacity-75 font-mono text-[10px]">
                  ({facilities.filter((f) => cat.id === 'ALL' || f.category === cat.id).length})
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Search, Ward & Exposure */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-56">
              <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility, ward, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg pl-8 pr-2.5 py-1 text-xs text-ink focus:outline-none focus:border-purple"
              />
            </div>

            {/* Ward Selector */}
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(e.target.value)}
              className="bg-surface-secondary border border-border rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-purple"
            >
              <option value="ALL">All Wards</option>
              <option value="Ward F/N">Ward F/N (Sion)</option>
              <option value="Ward L">Ward L (Kurla)</option>
              <option value="Ward K/E">Ward K/E (Andheri East)</option>
              <option value="Ward K/W">Ward K/W (Andheri West)</option>
              <option value="Ward G/N">Ward G/N (Dharavi)</option>
              <option value="Ward H/W">Ward H/W (Bandra)</option>
              <option value="Ward G/S">Ward G/S (Worli)</option>
              <option value="Ward S">Ward S (Bhandup)</option>
            </select>

            {/* Exposure Filter */}
            <select
              value={exposureFilter}
              onChange={(e) => setExposureFilter(e.target.value)}
              className="bg-surface-secondary border border-border rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-purple"
            >
              <option value="ALL">All Exposure</option>
              <option value="Critical">Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Safe">Safe</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Operational Split Workspace (65% Map & Spatial GIS + 35% Asset Dossier & Command Deck) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Interactive GIS Canvas + Spatial Deck (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          {/* Spatial Canvas Container */}
          <div className="bg-surface border border-border rounded-2xl p-2 shadow-subtle relative flex flex-col">
            <InteractiveMapTwin height="610px" />

            {/* Spatial Tactical Quick Floating Bar */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-surface/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-elevated">
              <button
                onClick={() => handleSelectFacility(activeAsset)}
                className="px-2.5 py-1 rounded-lg bg-purple text-white text-[11px] font-bold flex items-center gap-1 hover:bg-purple-deep transition-colors"
                title="Center camera on current facility"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Fly To Facility</span>
              </button>

              <button
                onClick={() => setShowDroneModal(true)}
                className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-purple-soft text-ink text-[11px] font-bold flex items-center gap-1 border border-border transition-colors"
                title="Launch Drone Reconnaissance"
              >
                <Camera className="w-3.5 h-3.5 text-purple" />
                <span>UAV Drone Recon</span>
              </button>

              <button
                onClick={() => setShowBuffer(!showBuffer)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  showBuffer
                    ? 'bg-status-warning-soft text-status-warning border-status-warning/40'
                    : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                500m Hazard Buffer: {showBuffer ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setShowHeliPad(!showHeliPad)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  showHeliPad
                    ? 'bg-status-safe-soft text-status-safe border-status-safe/40'
                    : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Heli-LZ: {showHeliPad ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>

            {/* Active Facility Quick Card Overlay at Bottom of Map */}
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surface/95 backdrop-blur-md p-3 rounded-xl border border-border shadow-elevated flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-ink">{activeAsset.name}</div>
                  <div className="text-[10px] text-ink-secondary font-mono flex items-center gap-2">
                    <span>{activeAsset.ward}</span>
                    <span>•</span>
                    <span>Plinth: {activeAsset.plinthElevationMsl || 4.8}m MSL</span>
                    <span>•</span>
                    <span className="text-purple font-bold">Nearest Safe: {activeAsset.nearestSafeRoute}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeAsset.exposure === 'Critical'
                      ? 'bg-status-alert-soft text-status-alert'
                      : activeAsset.exposure === 'Moderate'
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {activeAsset.exposure} EXPOSURE
                </span>
                <span className="text-xs font-bold text-ink bg-surface-secondary px-2 py-0.5 rounded border border-border">
                  {activeAsset.predictedDepth} cm Depth
                </span>
              </div>
            </div>
          </div>

          {/* Quick Facility Cluster Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-surface border border-border rounded-xl p-2.5 text-xs">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Strategic Sector Jump:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { name: 'Sion Hospital', id: 'hosp-sion' },
                { name: 'Kurla 33kV Substation', id: 'substation-kurla' },
                { name: 'Bandra Stormwater Pumps', id: 'pump-bandra' },
                { name: 'Kurla Rail Hub', id: 'transit-kurla' },
                { name: 'Bhandup Filtration Complex', id: 'water-bhandup' },
              ].map((jump) => (
                <button
                  key={jump.id}
                  onClick={() => {
                    const match = facilities.find((f) => f.id === jump.id);
                    if (match) handleSelectFacility(match);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-purple-soft text-ink hover:text-purple text-[11px] font-semibold border border-border transition-colors"
                >
                  {jump.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Master Facility Inspector & 6-Tab Tactical Console (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          {/* Facility List Selector (Horizontal scroll / compact list) */}
          <div className="bg-surface border border-border rounded-2xl p-3 shadow-subtle flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                Monitored Municipal Facilities ({filteredFacilities.length})
              </span>
              <span className="text-[10px] text-ink-secondary font-mono">
                Click to Inspect &amp; Fly
              </span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredFacilities.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleSelectFacility(asset)}
                  className={`w-full p-2 rounded-xl text-left text-xs border transition-all flex items-center justify-between ${
                    activeAsset.id === asset.id
                      ? 'bg-purple-soft text-purple border-purple shadow-sm font-bold ring-1 ring-purple'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-bold truncate text-xs text-ink">{asset.name}</div>
                    <div className="text-[10px] text-ink-secondary flex items-center gap-2 mt-0.5">
                      <span>{asset.ward}</span>
                      <span>•</span>
                      <span>{asset.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="font-bold text-ink">{asset.predictedDepth}cm</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        asset.exposure === 'Critical'
                          ? 'bg-status-alert-soft text-status-alert'
                          : asset.exposure === 'Moderate'
                          ? 'bg-status-warning-soft text-status-warning'
                          : 'bg-status-safe-soft text-status-safe'
                      }`}
                    >
                      {asset.exposure}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Facility Dossier */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3.5">
            {/* Dossier Header */}
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple font-bold px-2 py-0.5 rounded bg-purple-soft">
                    {activeAsset.ward} • {activeAsset.type}
                  </span>
                  {activeAsset.codeStatus && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        activeAsset.codeStatus === 'CODE_BLACK'
                          ? 'bg-status-alert text-white'
                          : activeAsset.codeStatus === 'CODE_YELLOW'
                          ? 'bg-status-warning-soft text-status-warning'
                          : 'bg-status-safe-soft text-status-safe'
                      }`}
                    >
                      {activeAsset.codeStatus}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-ink mt-1.5">{activeAsset.name}</h3>
                <div className="text-[11px] text-ink-secondary flex items-center gap-3 mt-1 font-mono">
                  <span>Plinth: {activeAsset.plinthElevationMsl || 4.8}m MSL</span>
                  <span>•</span>
                  <span>Access: {activeAsset.accessibility}%</span>
                  <span>•</span>
                  <span className="text-status-alert">Submerged Rds: {activeAsset.affectedAccessRoads}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded inline-block ${
                    activeAsset.exposure === 'Critical'
                      ? 'bg-status-alert-soft text-status-alert'
                      : activeAsset.exposure === 'Moderate'
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {activeAsset.exposure} HAZARD
                </span>
                <div className="font-mono text-xl font-bold text-ink mt-1">
                  {activeAsset.predictedDepth} <span className="text-xs font-normal">cm water</span>
                </div>
              </div>
            </div>

            {/* Quick Primary Actions Bar (All 3 Base Actions Made 100% Workable + Modals) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setShowCommanderModal(true)}
                className="py-2 px-2.5 bg-purple text-white hover:bg-purple-deep rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-subtle transition-all transform active:scale-95"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Notify Commander</span>
              </button>

              <button
                onClick={() => setShowBarrierModal(true)}
                className="py-2 px-2.5 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple" />
                <span>Deploy Barrier Dike</span>
              </button>

              <button
                onClick={() => setShowCadModal(true)}
                className="py-2 px-2.5 bg-status-safe-soft hover:bg-status-safe/20 text-status-safe border border-status-safe/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation2 className="w-3.5 h-3.5" />
                <span>Transmit Fleet CAD</span>
              </button>
            </div>

            {/* Secondary Action Toolbar: IAP, Mobile Pump, Mutual Aid */}
            <div className="flex items-center justify-between gap-1.5 bg-surface-secondary/60 p-1.5 rounded-xl border border-border text-[11px] font-semibold">
              <button
                onClick={() => setShowIapModal(true)}
                className="flex-1 py-1 px-2 rounded-lg bg-surface border border-border hover:border-purple text-ink flex items-center justify-center gap-1 transition-colors"
              >
                <FileText className="w-3 h-3 text-purple" />
                <span>Incident Action Plan</span>
              </button>

              <button
                onClick={() => setShowPumpModal(true)}
                className="flex-1 py-1 px-2 rounded-lg bg-surface border border-border hover:border-purple text-ink flex items-center justify-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3 text-status-safe" />
                <span>Stage 500HP Pump</span>
              </button>

              <button
                onClick={() => setShowMutualAidModal(true)}
                className="flex-1 py-1 px-2 rounded-lg bg-surface border border-border hover:border-purple text-ink flex items-center justify-center gap-1 transition-colors"
              >
                <Share2 className="w-3 h-3 text-purple" />
                <span>Mutual Aid</span>
              </button>
            </div>

            {/* 6 Organized Operational Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-1 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'defense', label: '1. Ingress & Barriers' },
                { id: 'scada', label: '2. Sump & SCADA' },
                { id: 'lifeline', label: '3. Power & Reserves' },
                { id: 'mobility', label: '4. Corridors & Evac' },
                { id: 'surveillance', label: '5. CCTV & Radar' },
                { id: 'command', label: '6. Tactical Command' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-soft text-purple font-bold'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Ingress Gates & Barrier Defense */}
            {activeTab === 'defense' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                    Ingress Gates Defense Matrix (Feature 2)
                  </span>
                  <button
                    onClick={() => setShowBarrierModal(true)}
                    className="text-[10px] text-purple font-bold hover:underline"
                  >
                    + Add Barrier Wall
                  </button>
                </div>

                <div className="space-y-2">
                  {(activeAsset.ingressGates || []).map((gate) => (
                    <div
                      key={gate.id}
                      className="p-3 bg-surface-secondary/70 rounded-xl border border-border flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{gate.name}</span>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="text-ink-secondary">Depth:</span>
                          <strong className="text-status-alert">{gate.depthCm} cm</strong>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              gate.status === 'PROTECTED'
                                ? 'bg-status-safe-soft text-status-safe'
                                : 'bg-status-alert-soft text-status-alert'
                            }`}
                          >
                            {gate.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-ink-secondary">
                        <span>Barrier: <strong className="text-ink">{gate.barrierType}</strong> ({gate.barrierHeightCm}cm)</span>
                        <span className="font-mono">{gate.gasketSealed ? 'Pneumatic Seal: ACTIVE' : 'Unsealed'}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                        <button
                          onClick={() => handleToggleGateBarrier(gate.id)}
                          className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-purple text-[10px] font-semibold text-ink transition-colors"
                        >
                          {gate.barrierActive ? 'Lower / Open Barrier' : 'Erect Hydraulic Barrier'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Staged Dewatering Squad Summary */}
                <div className="p-3 bg-purple-soft/40 border border-purple/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple" />
                    <div>
                      <div className="font-bold text-xs text-ink">Assigned Mobile Dewatering Squad</div>
                      <div className="text-[10px] text-ink-secondary">
                        {mobilePumpsList[0]?.name} staged at perimeter
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPumpModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple text-white text-[10px] font-bold"
                  >
                    Manage Pump
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Sump Pumps, Basement Sensors & SCADA Trip */}
            {activeTab === 'scada' && (
              <div className="space-y-3.5 text-xs">
                {/* Feature 1: Submersible Sump Pumps */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                      Submersible Sump Dewatering Pumps (Feature 1)
                    </span>
                    <span className="text-[10px] font-mono text-status-safe font-bold">ALL PUMPS OPERATIONAL</span>
                  </div>

                  <div className="space-y-2">
                    {(activeAsset.sumpPumps || []).map((pump) => (
                      <div
                        key={pump.id}
                        className="p-2.5 bg-surface-secondary/70 rounded-xl border border-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-ink">{pump.name}</div>
                          <div className="text-[10px] text-ink-secondary font-mono mt-0.5">
                            {pump.type} • Cap: {pump.capacityM3} m³/hr • Fill: {pump.fillPercent}%
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right font-mono">
                            <span className="text-xs font-bold text-purple">{pump.currentFlow} m³/hr</span>
                            <div className="text-[10px] text-ink-secondary">{pump.rpm} RPM</div>
                          </div>
                          <button
                            onClick={() => handleTogglePumpTurbo(pump.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              pump.status === 'TURBO_OVERDRIVE'
                                ? 'bg-status-alert text-white border-status-alert'
                                : 'bg-surface hover:bg-surface-secondary text-ink border-border'
                            }`}
                          >
                            {pump.status === 'TURBO_OVERDRIVE' ? '115% TURBO' : 'Set Turbo'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 4: Basement Ingress Early Warning Sensors */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Basement &amp; Sub-Surface Moisture Sensors (Feature 4)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(activeAsset.basementSensors || []).map((bs) => (
                      <div key={bs.id} className="p-2.5 bg-surface-secondary/50 rounded-xl border border-border">
                        <div className="font-bold text-xs text-ink truncate">{bs.zone}</div>
                        <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] font-mono">
                          <div>Hydrostatic: <strong>{bs.hydrostaticKPa} kPa</strong></div>
                          <div>Infiltration: <strong>{bs.infiltrationLpm} L/min</strong></div>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                          <span>Water Film: <strong className="text-purple">{bs.waterFilmDepthMm} mm</strong></span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${bs.alertState === 'CRITICAL' ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'}`}>
                            {bs.alertState}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 13: SCADA Electrical Isolation */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    SCADA Electrical Switchgear &amp; Substation Isolators (Feature 13)
                  </span>
                  <div className="space-y-1.5">
                    {(activeAsset.scadaBays || []).map((bay) => (
                      <div key={bay.id} className="p-2.5 bg-surface-secondary/70 rounded-xl border border-border flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink text-xs">{bay.name}</div>
                          <div className="text-[10px] text-ink-secondary font-mono">
                            {bay.voltage} • Clearance: <strong className={bay.waterProximityCm < 30 ? 'text-status-alert' : 'text-ink'}>{bay.waterProximityCm} cm</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            bay.status === 'TRIPPED_ISOLATED' ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
                          }`}>
                            {bay.status}
                          </span>
                          {bay.status !== 'TRIPPED_ISOLATED' && (
                            <button
                              onClick={() => setScadaBayToTrip(bay)}
                              className="px-2 py-1 rounded-lg bg-status-alert-soft hover:bg-status-alert/20 text-status-alert border border-status-alert/30 text-[10px] font-bold"
                            >
                              Trip Breaker
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 16: Foundation Hydrostatic Uplift */}
                {activeAsset.foundationHealth && (
                  <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-ink-secondary uppercase block">Foundation Uplift Pressure (Feature 16)</span>
                      <strong className="text-ink">{activeAsset.foundationHealth.upliftKPa} kPa</strong>
                      <span className="text-[10px] text-ink-secondary"> (Limit: {activeAsset.foundationHealth.allowableUpliftKPa} kPa)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-ink-secondary uppercase block">Structural Tilt</span>
                      <strong className="text-purple">{activeAsset.foundationHealth.structuralTiltSec} arcsec</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Power Backup, Medical Capacity & Disaster Reserves */}
            {activeTab === 'lifeline' && (
              <div className="space-y-3.5 text-xs">
                {/* Feature 3: Diesel Generators Matrix */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Emergency Power &amp; Elevated DG Gensets (Feature 3)
                  </span>
                  <div className="space-y-2">
                    {(activeAsset.dgGenerators || []).map((dg) => (
                      <div key={dg.id} className="p-3 bg-surface-secondary/70 rounded-xl border border-border flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink">{dg.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-status-safe-soft text-status-safe">
                            {dg.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-ink-secondary">
                          <div>Fuel: <strong className="text-ink">{dg.fuelPercent}%</strong></div>
                          <div>Runtime: <strong className="text-status-safe">{dg.runtimeHours} hrs</strong></div>
                          <div>Plinth: <strong className="text-purple">+{dg.plinthAboveGroundCm} cm</strong></div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleTransferToRooftopDg(dg.id)}
                            className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-purple text-[10px] font-bold text-ink transition-colors"
                          >
                            Transfer Critical Load Here
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 5: Medical / Lifeline Capacity Dashboard (Hospitals) */}
                {activeAsset.category === 'Hospital' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                        Medical Lifeline Triage Capacity (Feature 5)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleCodeStatus('CODE_YELLOW')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-warning-soft text-status-warning border border-status-warning/30"
                        >
                          Code Yellow
                        </button>
                        <button
                          onClick={() => handleToggleCodeStatus('CODE_BLACK')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-alert-soft text-status-alert border border-status-alert/30"
                        >
                          Code Black Divert
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-2 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">Total Beds</span>
                        <strong className="text-sm font-bold text-ink">{activeAsset.beds}</strong>
                      </div>
                      <div className="p-2 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">ICU Beds</span>
                        <strong className="text-sm font-bold text-purple">{activeAsset.icuBeds}</strong>
                      </div>
                      <div className="p-2 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">Ventilators</span>
                        <strong className="text-sm font-bold text-status-safe">{activeAsset.ventilators}</strong>
                      </div>
                      <div className="p-2 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">Dialysis Units</span>
                        <strong className="text-sm font-bold text-ink">{activeAsset.dialysisUnits}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature 11: Critical Supply Reserves */}
                {activeAsset.reserves && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                        Critical Reserves &amp; Resupply Hub (Feature 11)
                      </span>
                      <button
                        onClick={() => handleRequestResupply('Heavy Polypropylene Sandbags')}
                        className="text-[10px] text-purple font-bold hover:underline"
                      >
                        + Request Depot Resupply
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                      <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                        <span className="text-ink-secondary block">Medical Oxygen</span>
                        <strong className="text-ink text-xs">{activeAsset.reserves.medicalOxygenDays} Days</strong>
                      </div>
                      <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                        <span className="text-ink-secondary block">Diesel Fuel</span>
                        <strong className="text-ink text-xs">{activeAsset.reserves.dieselReserveLiters} L</strong>
                      </div>
                      <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                        <span className="text-ink-secondary block">Sandbags Staged</span>
                        <strong className="text-purple text-xs">{activeAsset.reserves.sandbagsOnSite} Units</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature 19: Sister Facility Mutual Aid Linkage */}
                <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-ink">Designated Sister Facility</div>
                    <div className="text-[10px] text-ink-secondary">{activeAsset.nearestSisterHospital || 'Regional Emergency Facility'}</div>
                  </div>
                  <button
                    onClick={() => setShowMutualAidModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple text-white text-xs font-bold"
                  >
                    Requisition Aid
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Approach Corridors & Evacuation Linkage */}
            {activeTab === 'mobility' && (
              <div className="space-y-3.5 text-xs">
                {/* Feature 10: Approach Roads Matrix */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Approach Road Corridors &amp; Ingress Vulnerability (Feature 10)
                  </span>
                  <div className="space-y-2">
                    {(activeAsset.approachRoads || []).map((road) => (
                      <div key={road.id} className="p-2.5 bg-surface-secondary/70 rounded-xl border border-border flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-xs">{road.name}</span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            road.status === 'CLOSED'
                              ? 'bg-status-alert-soft text-status-alert'
                              : road.status === 'OPEN_SAFE'
                              ? 'bg-status-safe-soft text-status-safe'
                              : 'bg-status-warning-soft text-status-warning'
                          }`}>
                            {road.status} ({road.floodDepthCm}cm)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-ink-secondary">
                          <span>Diversion: <strong className="text-ink">{road.diversion}</strong></span>
                          <button
                            onClick={() => handlePushVmsDiversion(road)}
                            className="px-2 py-0.5 rounded bg-surface border border-border hover:border-purple text-[10px] font-bold text-purple"
                          >
                            Push to VMS
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 12: Evacuation Shelters Linkage */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                      Municipal Evacuation Shelters Linked (Feature 12)
                    </span>
                    <span className="text-[10px] font-mono text-ink-secondary">{evacuationShelters.length} Shelters Staged</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {evacuationShelters.map((shelter) => (
                      <div key={shelter.id} className="p-2 bg-surface-secondary/60 rounded-xl border border-border flex items-center justify-between text-[11px]">
                        <div>
                          <div className="font-bold text-ink">{shelter.name}</div>
                          <div className="text-[10px] text-ink-secondary font-mono">
                            {shelter.ward} • Cap: {shelter.currentOccupants}/{shelter.totalCapacity}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            updateShelterOccupancy(shelter.id, 25);
                            showToast(`Dispatched evacuation convoy of 25 to ${shelter.name}`);
                          }}
                          className="px-2 py-1 rounded bg-purple text-white text-[10px] font-bold"
                        >
                          Dispatch +25
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heli-Evacuation LZ */}
                <div className="p-3 bg-surface-secondary rounded-xl border border-border text-xs font-mono">
                  <span className="text-[10px] text-ink-secondary uppercase block">Designated Heli-Evacuation Landing Zone (LZ)</span>
                  <strong className="text-ink">{activeAsset.heliPadLocation || 'Somaiya College Ground Helipad'}</strong>
                </div>
              </div>
            )}

            {/* Tab 5: Surveillance, CCTV AI Gauging & Micro-Radar */}
            {activeTab === 'surveillance' && (
              <div className="space-y-3.5 text-xs">
                {/* Feature 17: CCTV Feeds with AI Gauging */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Live CCTV Ingress AI Water-Level Gauges (Feature 17)
                  </span>
                  <div className="space-y-2">
                    {(activeAsset.cctvStreams || []).map((cam) => (
                      <div key={cam.id} className="p-2.5 bg-ink text-white rounded-xl border border-white/10 flex items-center justify-between font-mono">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-purple" />
                            <span>{cam.name}</span>
                          </div>
                          <div className="text-[10px] text-white/60 mt-0.5">
                            AI Confidence: <strong className="text-status-safe">{cam.confidence}%</strong> • Vehicle: {cam.vehiclePassable ? 'PASSABLE' : 'HALTED'}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-status-alert">{cam.waterReadingCm} cm</span>
                          <div className="text-[9px] text-white/50">OPTICAL GAUGE</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 9: Micro-Radar Forecast at Coordinates */}
                {activeAsset.microForecast && (
                  <div>
                    <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                      Hyper-Local Radar Micro-Nowcast (Feature 9)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-mono">
                      <div className="p-2.5 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">+30 min Rain</span>
                        <strong className="text-xs font-bold text-ink">{activeAsset.microForecast.next30mRainMm} mm</strong>
                      </div>
                      <div className="p-2.5 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">+60 min Rain</span>
                        <strong className="text-xs font-bold text-purple">{activeAsset.microForecast.next60mRainMm} mm</strong>
                      </div>
                      <div className="p-2.5 bg-surface-secondary rounded-xl border border-border">
                        <span className="text-[10px] text-ink-secondary block">Peak Flood ETA</span>
                        <strong className="text-xs font-bold text-status-alert">{activeAsset.microForecast.peakFloodEtaMin} min</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drone Simulator Trigger */}
                <div className="p-3 bg-purple-soft/50 border border-purple/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-ink">Perimeter Aerial Drone Surveillance (Feature 7)</div>
                    <div className="text-[10px] text-ink-secondary">Thermal IR &amp; Water Ingress Contours</div>
                  </div>
                  <button
                    onClick={() => setShowDroneModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple text-white text-xs font-bold"
                  >
                    Open Live UAV Stream
                  </button>
                </div>
              </div>
            )}

            {/* Tab 6: Tactical Command, AVHI Stress Simulator & Shift Logs */}
            {activeTab === 'command' && (
              <div className="space-y-3.5 text-xs">
                {/* Feature 14: AVHI Stress Test Simulator */}
                <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono">
                      Asset Vulnerability Index (AVHI) Simulator (Feature 14)
                    </span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      calculatedHazardScore > 75 ? 'bg-status-alert text-white' : 'bg-status-warning-soft text-status-warning'
                    }`}>
                      Index Score: {calculatedHazardScore}/100
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-ink-secondary mb-1">
                      <span>Simulated Rainfall Surge: +{simRainfallDelta} mm/hr</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={simRainfallDelta}
                      onChange={(e) => setSimRainfallDelta(Number(e.target.value))}
                      className="w-full accent-purple cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-ink-secondary mb-1">
                      <span>Simulated Tidal Surge: +{simTideSurcharge} m MSL</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1.5}
                      step={0.1}
                      value={simTideSurcharge}
                      onChange={(e) => setSimTideSurcharge(Number(e.target.value))}
                      className="w-full accent-purple cursor-pointer"
                    />
                  </div>
                </div>

                {/* Feature 15: Multi-Agency Task Force Assignment */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Multi-Agency Task Force Assigned (Feature 15)
                  </span>
                  <div className="space-y-1.5">
                    {(activeAsset.assignedUnits || []).map((unit) => (
                      <div key={unit.id} className="p-2 bg-surface-secondary/60 rounded-xl border border-border flex items-center justify-between text-[11px]">
                        <div>
                          <div className="font-bold text-ink">{unit.agency} ({unit.id})</div>
                          <div className="text-[10px] text-ink-secondary">{unit.role} • Contact: {unit.contact}</div>
                        </div>
                        <span className="font-mono text-xs font-bold text-purple">{unit.personnel} Personnel</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature 18: Shift Commander Logbook */}
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block mb-1.5">
                    Facility Shift Logbook Entry (Feature 18)
                  </span>
                  <form onSubmit={handleAddShiftLog} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Log tactical order, inspection, or status note..."
                      value={newLogText}
                      onChange={(e) => setNewLogText(e.target.value)}
                      className="flex-1 bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-purple"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-purple text-white font-bold text-xs hover:bg-purple-deep transition-colors"
                    >
                      Log
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tactical Modals */}
      {showCommanderModal && (
        <FacilityCommanderModal
          asset={activeAsset}
          onClose={() => setShowCommanderModal(false)}
          onDispatched={(msg) => showToast(msg)}
        />
      )}

      {showBarrierModal && (
        <BarrierDeploymentModal
          asset={activeAsset}
          onClose={() => setShowBarrierModal(false)}
          onDeployed={(result) => {
            setFacilities((prev) =>
              prev.map((f) => {
                if (f.id !== activeAsset.id) return f;
                const nextDepth = Math.max(0, f.predictedDepth - result.calculatedDeflection);
                return {
                  ...f,
                  predictedDepth: nextDepth,
                  deflectedDepth: nextDepth,
                  exposure: nextDepth > 25 ? 'Critical' : nextDepth > 10 ? 'Moderate' : 'Safe',
                };
              })
            );
            showToast(`Barrier deployed at Gate. Inundation depth deflected by -${result.calculatedDeflection}cm!`);
          }}
        />
      )}

      {showCadModal && (
        <FleetCadRouteModal
          asset={activeAsset}
          onClose={() => setShowCadModal(false)}
          onTransmitted={(msg) => showToast(msg)}
        />
      )}

      {showPumpModal && (
        <MobilePumpDispatchModal
          asset={activeAsset}
          onClose={() => setShowPumpModal(false)}
          onDispatched={(msg) => showToast(msg)}
        />
      )}

      {showIapModal && (
        <IncidentActionPlanModal
          asset={activeAsset}
          onClose={() => setShowIapModal(false)}
        />
      )}

      {showDroneModal && (
        <DroneSurveillanceModal
          asset={activeAsset}
          onClose={() => setShowDroneModal(false)}
        />
      )}

      {showMutualAidModal && (
        <MutualAidModal
          asset={activeAsset}
          sisterAssets={facilities.filter((f) => f.id !== activeAsset.id)}
          onClose={() => setShowMutualAidModal(false)}
          onTransferred={(msg) => showToast(msg)}
        />
      )}

      {scadaBayToTrip && (
        <ScadaTripModal
          asset={activeAsset}
          bay={scadaBayToTrip}
          onClose={() => setScadaBayToTrip(null)}
          onTripped={(bayId) => handleScadaTripped(bayId)}
        />
      )}
    </div>
  );
}
