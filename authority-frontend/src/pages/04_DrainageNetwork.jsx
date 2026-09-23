import React, { useState, useMemo } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import { EXTENDED_DRAINAGE_NODES } from '../components/drainage/drainageConstants';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';

// 20 Specialized Operational Feature Components for Municipal Authorities
import SWMMProfileModal from '../components/drainage/SWMMProfileModal';
import PumpingStationScadaModal from '../components/drainage/PumpingStationScadaModal';
import TidalLockoutModal from '../components/drainage/TidalLockoutModal';
import CCTVDrainageAIDrawer from '../components/drainage/CCTVDrainageAIDrawer';
import RunoffHydrographModal from '../components/drainage/RunoffHydrographModal';
import SurchargeEarlyWarningModal from '../components/drainage/SurchargeEarlyWarningModal';
import RetentionBasinModal from '../components/drainage/RetentionBasinModal';
import BottleneckRankerModal from '../components/drainage/BottleneckRankerModal';
import DesiltingFleetModal from '../components/drainage/DesiltingFleetModal';
import PiezometerTelemetryModal from '../components/drainage/PiezometerTelemetryModal';
import FlowTopologyModal from '../components/drainage/FlowTopologyModal';
import MicroTunnelBypassModal from '../components/drainage/MicroTunnelBypassModal';
import TrashScreenRakeModal from '../components/drainage/TrashScreenRakeModal';
import SalineIntrusionModal from '../components/drainage/SalineIntrusionModal';
import DrainageSOPModal from '../components/drainage/DrainageSOPModal';
import GutterInflowModal from '../components/drainage/GutterInflowModal';
import WardDrainageDeficitModal from '../components/drainage/WardDrainageDeficitModal';
import MobilePumpRequisitionModal from '../components/drainage/MobilePumpRequisitionModal';
import HydraulicStressSandboxModal from '../components/drainage/HydraulicStressSandboxModal';
import DrainageWorkOrderModal from '../components/drainage/DrainageWorkOrderModal';

import {
  GitBranch,
  Activity,
  AlertTriangle,
  Gauge,
  CheckCircle2,
  Sliders,
  Search,
  Filter,
  Layers,
  Wrench,
  Video,
  Radio,
  Waves,
  Truck,
  Droplets,
  ClipboardCheck,
  FileText,
  Flame,
  Building2,
  Trash2,
  Zap,
  ArrowRight,
} from 'lucide-react';

const OPERATIONAL_FEATURE_GROUPS = [
  {
    id: 'all',
    label: 'All Tools',
  },
  {
    id: 'modeling',
    label: 'Hydraulic Modeling',
    description: '1D Saint-Venant solvers, runoff synthesis, and street inlet interception',
    tools: [
      { key: 'swmmProfile', name: 'SWMM 1D Profile', desc: 'Saint-Venant dynamic wave & HGL solver', icon: Activity, color: 'text-purple' },
      { key: 'runoffHydrograph', name: 'Runoff Hydrograph', desc: 'Rational & SCS-CN storm runoff curves', icon: Droplets, color: 'text-blue-500' },
      { key: 'flowTopology', name: 'Force-Main Topology', desc: 'Pressurized flow & water hammer surge', icon: Sliders, color: 'text-indigo-500' },
      { key: 'gutterInflow', name: 'Street Grate Intake', desc: 'Curb interception efficiency & bypass', icon: Sliders, color: 'text-purple' },
      { key: 'stressSandbox', name: 'Stress Test Sandbox', desc: 'Multi-variable cascading failure simulator', icon: Flame, color: 'text-status-alert' },
    ],
  },
  {
    id: 'pumping',
    label: 'Pumping & Outfall',
    description: 'SCADA pumping overdrive, coastal tidal lockout, retention vaults, and deep corridors',
    tools: [
      { key: 'pumpingScada', name: 'SCADA Pump Matrix', desc: '7-station multi-pump VFD overdrive', icon: Gauge, color: 'text-blue-500' },
      { key: 'tidalLockout', name: 'Tidal Sluice Simulator', desc: 'Marine backflow & gravity discharge window', icon: Waves, color: 'text-cyan-500' },
      { key: 'retentionBasin', name: 'Holding Basin Tanks', desc: 'Underground flood vaults & gate controls', icon: Layers, color: 'text-emerald-500' },
      { key: 'microTunnel', name: 'Micro-Tunnel Bypass', desc: '-18m MSL deep subterranean diversion', icon: GitBranch, color: 'text-purple' },
      { key: 'mobilePump', name: 'Mobile Dewatering Unit', desc: '500 HP diesel pump pre-positioning', icon: Truck, color: 'text-blue-500' },
    ],
  },
  {
    id: 'telemetry',
    label: 'Telemetry & AI',
    description: 'Robotic CCTV computer vision, LoRaWAN piezometers, and trash screen rakes',
    tools: [
      { key: 'cctvAI', name: 'CCTV Robotic AI', desc: 'Conduit crawler silt & debris detection', icon: Video, color: 'text-amber-500' },
      { key: 'piezometer', name: 'IoT Piezometer Grid', desc: 'Ultrasonic & hydrostatic head telemetry', icon: Radio, color: 'text-teal-500' },
      { key: 'trashRake', name: 'Trash Screen Rakes', desc: 'Nullah automatic mechanical bar cleaners', icon: Trash2, color: 'text-amber-500' },
      { key: 'salineIntrusion', name: 'Estuarine Salinity', desc: 'Marine outfall water quality & salt wedge', icon: Waves, color: 'text-teal-400' },
    ],
  },
  {
    id: 'operations',
    label: 'Municipal Operations',
    description: 'Surcharge early warnings, desilting fleet tracking, SOPs, and work directives',
    tools: [
      { key: 'surchargeWarning', name: 'Early Surcharge Alarm', desc: 'Predictive drop junction overtopping EW-SOF', icon: AlertTriangle, color: 'text-status-alert' },
      { key: 'bottleneckRanker', name: 'Choke-Point Ranker', desc: 'Bottleneck Severity Index network audit', icon: Filter, color: 'text-amber-500' },
      { key: 'desiltingFleet', name: 'Super-Sucker Fleet', desc: '16 BMC vacuum & jetting trucks tracking', icon: Truck, color: 'text-purple' },
      { key: 'wardDeficit', name: 'Ward Drainage Deficits', desc: 'BRIMSTOWAD II CapEx priority matrix', icon: Building2, color: 'text-amber-600' },
      { key: 'drainageSOP', name: 'Emergency SOP Playbook', desc: 'Protocol checklist & engineer sign-off', icon: ClipboardCheck, color: 'text-emerald-500' },
      { key: 'workOrder', name: 'Work Order Dispatcher', desc: 'Official electronic BMC work directives', icon: FileText, color: 'text-purple' },
    ],
  },
];

export default function DrainageNetwork() {
  const { nowcastMinutes, toggleIntervention } = useFloodCommand();

  // Dynamic Nodes State with Local Modifiers
  const nodes = EXTENDED_DRAINAGE_NODES;
  const [selectedNodeId, setSelectedNodeId] = useState(EXTENDED_DRAINAGE_NODES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Right Section Navigation State: 'suite' | 'inspector' | 'nodes'
  const [rightPanelTab, setRightPanelTab] = useState('suite');
  const [activeFeatureCategory, setActiveFeatureCategory] = useState('all');
  const [toolSearchQuery, setToolSearchQuery] = useState('');

  // Throttle Override Slider for Selected Node
  const [localThrottlePct, setLocalThrottlePct] = useState({});

  // Active Emergency Interventions State
  const [activePumpInterventions, setActivePumpInterventions] = useState({});
  const [activeSluiceInterventions, setActiveSluiceInterventions] = useState({});
  const [deepTunnelFlow, setDeepTunnelFlow] = useState(0);
  const [mobilePumpsDeployed, setMobilePumpsDeployed] = useState([]);
  const [activeStressScenario, setActiveStressScenario] = useState(null);

  // Active Pumping Total Counter
  const [activePumpsCount, setActivePumpsCount] = useState(12);
  const totalPumpsCount = 14;

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 20 Modal & Drawer Open States
  const [modals, setModals] = useState({
    swmmProfile: false,
    pumpingScada: false,
    tidalLockout: false,
    cctvAI: false,
    runoffHydrograph: false,
    surchargeWarning: false,
    retentionBasin: false,
    bottleneckRanker: false,
    desiltingFleet: false,
    piezometer: false,
    flowTopology: false,
    microTunnel: false,
    trashRake: false,
    salineIntrusion: false,
    drainageSOP: false,
    gutterInflow: false,
    wardDeficit: false,
    mobilePump: false,
    stressSandbox: false,
    workOrder: false,
  });

  const toggleModal = (modalKey, state = true) => {
    setModals((prev) => ({ ...prev, [modalKey]: state }));
  };

  // Recalculate Node Metrics based on Nowcast Scrubber, Stress Scenarios, Interventions & Throttling
  const dynamicNodes = useMemo(() => {
    return nodes.map((node) => {
      let load = node.baseLoad;

      // Scrubber impact (0 - 180 min nowcast horizon)
      if (nowcastMinutes > 0) {
        const stormCurve = Math.sin((nowcastMinutes / 180) * Math.PI) * 22;
        load += stormCurve;
      }

      // Stress scenario impact
      if (activeStressScenario) {
        load += activeStressScenario.rainfallSpikeMmHr * 0.25;
        load += activeStressScenario.extraBlockagePct * 0.2;
      }

      // Aux pump relief
      if (activePumpInterventions[node.id]) {
        load -= 18.0;
      }

      // Sluice gate relief
      if (activeSluiceInterventions[node.id]) {
        load -= 12.0;
      }

      // Deep Tunnel bypass relief
      if (deepTunnelFlow > 0 && (node.id === 'D-204' || node.id === 'C-118' || node.id === 'DH-07')) {
        load -= (deepTunnelFlow / 18.5) * 24.0;
      }

      // Mobile pump relief
      const extraPump = mobilePumpsDeployed.find((p) => p.nodeId === node.id);
      if (extraPump) {
        load -= 14.0;
      }

      // Local throttle slider modifier
      const userThrottle = localThrottlePct[node.id];
      if (userThrottle !== undefined) {
        const deltaThrottle = userThrottle - node.throttlePct;
        load += deltaThrottle * 0.2;
      }

      load = Math.max(15, Math.min(138, Math.round(load)));

      let status = 'NORMAL CAPACITY';
      if (load >= 95) status = 'SURCHARGING';
      else if (load >= 80) status = 'NEAR SURCHARGE';

      return {
        ...node,
        currentLoad: load,
        status,
      };
    });
  }, [
    nodes,
    nowcastMinutes,
    activeStressScenario,
    activePumpInterventions,
    activeSluiceInterventions,
    deepTunnelFlow,
    mobilePumpsDeployed,
    localThrottlePct,
  ]);

  const selectedNode = dynamicNodes.find((n) => n.id === selectedNodeId) || dynamicNodes[0];

  // Filtered nodes for quick selector
  const filteredNodes = dynamicNodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWardFilter === 'ALL' || node.ward.includes(selectedWardFilter);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'SURCHARGING' && node.status === 'SURCHARGING') ||
      (statusFilter === 'NEAR' && node.status.includes('NEAR')) ||
      (statusFilter === 'NORMAL' && node.status === 'NORMAL CAPACITY');
    return matchesSearch && matchesWard && matchesStatus;
  });

  const surchargingCount = dynamicNodes.filter((n) => n.status === 'SURCHARGING').length;

  // Active tools filtered by selected category & search query
  const visibleTools = useMemo(() => {
    let tools = [];
    if (activeFeatureCategory === 'all') {
      tools = OPERATIONAL_FEATURE_GROUPS.filter((g) => g.id !== 'all').flatMap((g) => g.tools);
    } else {
      const group = OPERATIONAL_FEATURE_GROUPS.find((g) => g.id === activeFeatureCategory);
      tools = group ? group.tools : [];
    }

    if (toolSearchQuery.trim()) {
      const q = toolSearchQuery.toLowerCase();
      tools = tools.filter(
        (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      );
    }

    return tools;
  }, [activeFeatureCategory, toolSearchQuery]);

  // Handlers for operational actions
  const handleToggleAuxPump = (nodeId) => {
    const isCurrentlyActive = !!activePumpInterventions[nodeId];
    setActivePumpInterventions((prev) => ({
      ...prev,
      [nodeId]: !isCurrentlyActive,
    }));
    setActivePumpsCount((prev) => (isCurrentlyActive ? Math.max(10, prev - 1) : Math.min(totalPumpsCount, prev + 1)));
    toggleIntervention('int-pump-01');
    showToast(
      isCurrentlyActive
        ? `Auxiliary Dewatering Pump deactivated on ${nodeId}.`
        : `Auxiliary Dewatering Pump P-08 ACTIVATED on ${nodeId} (-18% Hydraulic Load)!`
    );
  };

  const handleToggleTidalSluice = (nodeId) => {
    const isCurrentlyActive = !!activeSluiceInterventions[nodeId];
    setActiveSluiceInterventions((prev) => ({
      ...prev,
      [nodeId]: !isCurrentlyActive,
    }));
    toggleIntervention('int-sluice-02');
    showToast(
      isCurrentlyActive
        ? `Tidal Flap Sluice Diversion closed for ${nodeId}.`
        : `Tidal Flap Sluice Diversion ENGAGED for ${nodeId} (-12% Surcharge Relief)!`
    );
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)] bg-canvas">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-purple/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar with Interactive Status Telemetry */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2 font-mono">
              <GitBranch className="w-4 h-4 text-purple" />
              Underground Stormwater Drainage Hydraulic Network Twin
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
              BMC SWD WING
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5 font-sans">
            1D Dynamic Wave Saint-Venant hydraulic graph • 1,428 monitored conduits &amp; drop junctions across Mumbai
          </p>
        </div>

        {/* Clickable Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => {
              setRightPanelTab('suite');
              toggleModal('surchargeWarning');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-subtle ${
              surchargingCount > 0
                ? 'bg-status-alert-soft text-status-alert hover:bg-status-alert hover:text-white border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{surchargingCount} NODES SURCHARGING</span>
          </button>

          <button
            onClick={() => {
              setRightPanelTab('suite');
              toggleModal('pumpingScada');
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-soft text-purple hover:bg-purple hover:text-white border border-purple/30 font-bold flex items-center gap-1.5 transition-all shadow-subtle"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>
              {activePumpsCount}/{totalPumpsCount} PUMPS ACTIVE
            </span>
          </button>

          <button
            onClick={() => {
              setRightPanelTab('suite');
              toggleModal('tidalLockout');
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 font-bold flex items-center gap-1.5 transition-all shadow-subtle"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>TIDE: 4.25m MSL</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Left: GIS Map Canvas | Right: Operational Features & Inspector) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: GIS Underground Twin Canvas (7 cols on 2xl, 7 cols on xl) */}
        <div className="xl:col-span-7 2xl:col-span-7 flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-subtle">
            <InteractiveMapTwin
              height="620px"
              customCenter={selectedNode.coordinates}
              onSelectNode={(node) => {
                setSelectedNodeId(node.id);
                setRightPanelTab('inspector');
                showToast(`Focused on GIS Node ${node.id}`);
              }}
            />

            {/* Floating Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-surface/90 backdrop-blur-md p-2.5 rounded-xl border border-border text-[10px] font-mono space-y-1 shadow-elevated">
              <span className="text-ink-secondary block font-bold uppercase">Hydraulic Graph Legend:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-status-alert">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-alert" /> Surcharging (&gt;95%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Near Surcharge (80-94%)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal (&lt;80%)
                </span>
              </div>
            </div>
          </div>

          <TimelineScrubber />
        </div>

        {/* Right Section: Operational Features Suite & Node Inspector (5 cols on 2xl, 5 cols on xl) */}
        <div className="xl:col-span-5 2xl:col-span-5 flex flex-col gap-3">
          {/* Right Section Navigation Tabs */}
          <div className="bg-surface border border-border rounded-2xl p-1.5 shadow-subtle flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setRightPanelTab('suite')}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                rightPanelTab === 'suite'
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Hydraulic Tools</span>
            </button>

            <button
              onClick={() => setRightPanelTab('inspector')}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                rightPanelTab === 'inspector'
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Node Inspector</span>
            </button>

            <button
              onClick={() => setRightPanelTab('nodes')}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                rightPanelTab === 'nodes'
                  ? 'bg-purple text-white shadow-subtle'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Junctions ({filteredNodes.length})</span>
            </button>
          </div>

          {/* TAB 1: OPERATIONAL FEATURES SUITE (Shown in Right Section) */}
          {rightPanelTab === 'suite' && (
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3.5">
              {/* Header and Category Pills */}
              <div className="space-y-2.5 border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                      Operational Engineering Tools
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple bg-purple-soft px-2 py-0.5 rounded font-bold">
                    Target: {selectedNode.id}
                  </span>
                </div>

                {/* Tool Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-secondary" />
                  <input
                    type="text"
                    placeholder="Search tools by name or function..."
                    value={toolSearchQuery}
                    onChange={(e) => setToolSearchQuery(e.target.value)}
                    className="w-full bg-surface-secondary border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-ink placeholder:text-ink-secondary focus:outline-none focus:border-purple"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs font-mono">
                  {OPERATIONAL_FEATURE_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setActiveFeatureCategory(group.id)}
                      className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-medium shrink-0 ${
                        activeFeatureCategory === group.id
                          ? 'bg-purple text-white font-bold shadow-subtle'
                          : 'bg-surface-secondary text-ink-secondary hover:text-ink hover:bg-surface'
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Tool Cards List in Right Section */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {visibleTools.length === 0 ? (
                  <div className="text-center py-8 text-ink-secondary font-mono text-xs">
                    No tools match your search query.
                  </div>
                ) : (
                  visibleTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.key}
                        onClick={() => toggleModal(tool.key)}
                        className="p-3 rounded-xl bg-surface-secondary hover:bg-surface border border-border hover:border-purple/40 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-xs hover:shadow-subtle"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-canvas border border-border group-hover:border-purple/30 ${tool.color} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-ink text-xs font-sans group-hover:text-purple transition-colors">
                              {tool.name}
                            </div>
                            <p className="text-[11px] text-ink-secondary font-sans leading-tight mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModal(tool.key);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface group-hover:bg-purple group-hover:text-white border border-border group-hover:border-purple text-ink text-[10px] font-mono font-bold transition-all shrink-0 flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED NODE INSPECTOR */}
          {rightPanelTab === 'inspector' && selectedNode && (
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3.5">
              {/* Node Title & Live Status */}
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-soft text-purple">
                      NODE {selectedNode.id}
                    </span>
                    <span className="text-[10px] font-mono text-ink-secondary">{selectedNode.ward}</span>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      • {selectedNode.conduitShape}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink mt-1 leading-tight font-sans">
                    {selectedNode.name}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    selectedNode.status === 'SURCHARGING'
                      ? 'bg-status-alert-soft text-status-alert'
                      : selectedNode.status.includes('NEAR')
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/20 text-emerald-500'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              {/* Hydraulic Metrics Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-surface-secondary border border-border rounded-xl p-3">
                  <span className="text-[10px] text-ink-secondary uppercase font-medium">Hydraulic Load</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-bold ${
                        selectedNode.currentLoad >= 95
                          ? 'text-status-alert'
                          : selectedNode.currentLoad >= 80
                          ? 'text-amber-500'
                          : 'text-ink'
                      }`}
                    >
                      {selectedNode.currentLoad}
                    </span>
                    <span className="text-xs text-ink-secondary">%</span>
                  </div>
                  <div className="text-[10px] text-ink-secondary mt-0.5">
                    Capacity: {selectedNode.maxFlow}
                  </div>
                </div>

                <div className="bg-surface-secondary border border-border rounded-xl p-3">
                  <span className="text-[10px] text-ink-secondary uppercase font-medium">Predicted Surcharge</span>
                  <div className="mt-1 font-bold text-sm text-status-alert truncate">
                    {selectedNode.predictedSurcharge}
                  </div>
                  <div className="text-[10px] text-ink-secondary mt-0.5">
                    Connected Pipes: {selectedNode.connectedPipes} Conduits
                  </div>
                </div>
              </div>

              {/* Invert Elevation & Headroom */}
              <div className="p-3 rounded-xl bg-surface-secondary border border-border font-mono text-xs grid grid-cols-3 text-center gap-1">
                <div>
                  <span className="text-[9px] text-ink-secondary uppercase block">Invert Level</span>
                  <span className="font-bold text-ink">+{selectedNode.invertLevel}m MSL</span>
                </div>
                <div>
                  <span className="text-[9px] text-ink-secondary uppercase block">Street Grade</span>
                  <span className="font-bold text-ink">+{selectedNode.surfaceElevation}m MSL</span>
                </div>
                <div>
                  <span className="text-[9px] text-ink-secondary uppercase block">Silt Depth</span>
                  <span className="font-bold text-amber-500">{selectedNode.siltPercentage}% Choke</span>
                </div>
              </div>

              {/* Upstream Inflow vs Downstream Discharge with Interactive Throttle Slider */}
              <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink font-sans">
                    Hydraulic Inflow vs Outfall Throttle
                  </span>
                  <span className="text-[10px] text-purple font-bold">
                    Throttle: {localThrottlePct[selectedNode.id] ?? selectedNode.throttlePct}%
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <div className="flex justify-between text-ink-secondary">
                      <span>Upstream Contribution</span>
                      <span className="text-status-alert font-bold">{selectedNode.upstreamInflow} m³/s</span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden mt-1 border border-border">
                      <div
                        className="h-full bg-status-alert"
                        style={{ width: `${Math.min(100, (selectedNode.upstreamInflow / 25) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-ink-secondary">
                      <span>Downstream Discharge Throttle</span>
                      <span className="text-purple font-bold">{selectedNode.maxFlow}</span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden mt-1 border border-border">
                      <div
                        className="h-full bg-purple"
                        style={{ width: `${localThrottlePct[selectedNode.id] ?? selectedNode.throttlePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Throttle Slider */}
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-ink-secondary mb-1">
                    <span>Adjust Outfall Gate Throttle:</span>
                    <span className="text-ink font-bold">
                      {localThrottlePct[selectedNode.id] ?? selectedNode.throttlePct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={localThrottlePct[selectedNode.id] ?? selectedNode.throttlePct}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setLocalThrottlePct((prev) => ({ ...prev, [selectedNode.id]: val }));
                    }}
                    className="w-full accent-purple cursor-pointer"
                  />
                </div>

                <div className="text-[10px] text-ink-secondary bg-surface p-2 rounded-lg border border-border font-sans">
                  <strong className="text-ink font-mono">Bottleneck Cause:</strong> {selectedNode.downstreamThrottle}
                </div>
              </div>

              {/* Action Buttons - Fully Reactive State Toggles */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleAuxPump(selectedNode.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-subtle transition-all font-mono ${
                    activePumpInterventions[selectedNode.id]
                      ? 'bg-status-alert text-white hover:bg-red-600'
                      : 'bg-purple text-white hover:bg-purple-deep'
                  }`}
                >
                  <span>
                    {activePumpInterventions[selectedNode.id]
                      ? `Halt Auxiliary Dewatering Pump (${selectedNode.id})`
                      : `Activate Auxiliary Dewatering Pump (${selectedNode.id})`}
                  </span>
                  <Zap className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleTidalSluice(selectedNode.id)}
                  className={`w-full py-2 px-3.5 border rounded-xl text-xs font-semibold flex items-center justify-between transition-all font-mono ${
                    activeSluiceInterventions[selectedNode.id]
                      ? 'bg-purple-soft text-purple border-purple'
                      : 'bg-surface hover:bg-surface-secondary text-ink border-border hover:border-purple'
                  }`}
                >
                  <span>
                    {activeSluiceInterventions[selectedNode.id]
                      ? 'Close Tidal Flap Sluice Diversion'
                      : 'Deploy Tidal Flap Sluice Diversion'}
                  </span>
                  <GitBranch className="w-3.5 h-3.5 text-purple" />
                </button>

                {/* Direct Shortcut to Deep Tunnel / CCTV / SWMM */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => toggleModal('swmmProfile')}
                    className="py-1.5 px-2.5 rounded-lg bg-surface-secondary hover:bg-surface border border-border text-xs font-mono text-ink flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-purple" />
                    <span>View SWMM Profile</span>
                  </button>

                  <button
                    onClick={() => toggleModal('cctvAI')}
                    className="py-1.5 px-2.5 rounded-lg bg-surface-secondary hover:bg-surface border border-border text-xs font-mono text-ink flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-500" />
                    <span>CCTV AI Camera</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JUNCTION DIRECTORY */}
          {rightPanelTab === 'nodes' && (
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                  Municipal Drainage Junctions Directory
                </span>
                <span className="text-[10px] font-mono text-purple font-semibold">
                  ACTIVE: {selectedNode.id}
                </span>
              </div>

              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-secondary" />
                  <input
                    type="text"
                    placeholder="Search node by name, ID or ward..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-secondary border border-border rounded-lg pl-8 pr-2 py-1.5 text-xs font-mono text-ink placeholder:text-ink-secondary focus:outline-none focus:border-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedWardFilter}
                    onChange={(e) => setSelectedWardFilter(e.target.value)}
                    className="bg-surface-secondary border border-border rounded-lg text-xs font-mono px-2 py-1.5 text-ink focus:outline-none focus:border-purple"
                  >
                    <option value="ALL">All Wards</option>
                    <option value="Ward L">Ward L (Kurla)</option>
                    <option value="Ward F/N">Ward F/N (Sion)</option>
                    <option value="Ward G/N">Ward G/N (Dadar)</option>
                    <option value="Ward H/W">Ward H/W (Bandra)</option>
                    <option value="Ward K/E">Ward K/E (Andheri)</option>
                    <option value="Ward H/E">Ward H/E (Santacruz)</option>
                    <option value="Ward M/W">Ward M/W (Chembur)</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-surface-secondary border border-border rounded-lg text-xs font-mono px-2 py-1.5 text-ink focus:outline-none focus:border-purple"
                  >
                    <option value="ALL">All Load Levels</option>
                    <option value="SURCHARGING">Surcharging (&gt;95%)</option>
                    <option value="NEAR">Near Surcharge (80-94%)</option>
                    <option value="NORMAL">Normal (&lt;80%)</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Node Cards Grid */}
              <div className="grid grid-cols-1 gap-1.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isSurcharge = node.status === 'SURCHARGING';
                  const isNear = node.status.includes('NEAR');

                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        setRightPanelTab('inspector');
                        showToast(`Selected Node ${node.id}`);
                      }}
                      className={`p-3 rounded-xl text-left text-xs border transition-all ${
                        isSelected
                          ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                          : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-sm">{node.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            isSurcharge
                              ? 'bg-status-alert-soft text-status-alert'
                              : isNear
                              ? 'bg-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {node.currentLoad}% Load
                        </span>
                      </div>
                      <div className="text-xs font-sans font-medium text-ink mt-1">
                        {node.name}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-ink-secondary font-mono mt-1 pt-1 border-t border-border/40">
                        <span>{node.ward} • {node.conduitShape}</span>
                        <span className="text-purple font-bold">Inspect &rarr;</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render all 20 Feature Modals / Drawers conditionally */}
      {modals.swmmProfile && (
        <SWMMProfileModal
          isOpen={modals.swmmProfile}
          onClose={() => toggleModal('swmmProfile', false)}
          selectedNode={selectedNode}
          onApplyHydraulics={(data) => {
            showToast(`Applied Saint-Venant parameters to Node ${data.nodeId}`);
          }}
        />
      )}

      {modals.pumpingScada && (
        <PumpingStationScadaModal
          isOpen={modals.pumpingScada}
          onClose={() => toggleModal('pumpingScada', false)}
          onBoostStation={() => {
            setActivePumpsCount(totalPumpsCount);
          }}
          showToast={showToast}
        />
      )}

      {modals.tidalLockout && (
        <TidalLockoutModal
          isOpen={modals.tidalLockout}
          onClose={() => toggleModal('tidalLockout', false)}
          showToast={showToast}
        />
      )}

      {modals.cctvAI && (
        <CCTVDrainageAIDrawer
          isOpen={modals.cctvAI}
          onClose={() => toggleModal('cctvAI', false)}
          selectedNode={selectedNode}
          onDispatchDesilter={() => {
            toggleModal('cctvAI', false);
            toggleModal('desiltingFleet', true);
          }}
          showToast={showToast}
        />
      )}

      {modals.runoffHydrograph && (
        <RunoffHydrographModal
          isOpen={modals.runoffHydrograph}
          onClose={() => toggleModal('runoffHydrograph', false)}
          selectedNode={selectedNode}
        />
      )}

      {modals.surchargeWarning && (
        <SurchargeEarlyWarningModal
          isOpen={modals.surchargeWarning}
          onClose={() => toggleModal('surchargeWarning', false)}
          showToast={showToast}
        />
      )}

      {modals.retentionBasin && (
        <RetentionBasinModal
          isOpen={modals.retentionBasin}
          onClose={() => toggleModal('retentionBasin', false)}
          showToast={showToast}
        />
      )}

      {modals.bottleneckRanker && (
        <BottleneckRankerModal
          isOpen={modals.bottleneckRanker}
          onClose={() => toggleModal('bottleneckRanker', false)}
          onSelectNode={(node) => {
            setSelectedNodeId(node.id);
            setRightPanelTab('inspector');
            showToast(`Inspecting Bottleneck Node ${node.id}`);
          }}
          showToast={showToast}
        />
      )}

      {modals.desiltingFleet && (
        <DesiltingFleetModal
          isOpen={modals.desiltingFleet}
          onClose={() => toggleModal('desiltingFleet', false)}
          showToast={showToast}
        />
      )}

      {modals.piezometer && (
        <PiezometerTelemetryModal
          isOpen={modals.piezometer}
          onClose={() => toggleModal('piezometer', false)}
          showToast={showToast}
        />
      )}

      {modals.flowTopology && (
        <FlowTopologyModal
          isOpen={modals.flowTopology}
          onClose={() => toggleModal('flowTopology', false)}
          selectedNode={selectedNode}
          showToast={showToast}
        />
      )}

      {modals.microTunnel && (
        <MicroTunnelBypassModal
          isOpen={modals.microTunnel}
          onClose={() => toggleModal('microTunnel', false)}
          selectedNode={selectedNode}
          onApplyBypass={(flow) => {
            setDeepTunnelFlow(flow);
          }}
          showToast={showToast}
        />
      )}

      {modals.trashRake && (
        <TrashScreenRakeModal
          isOpen={modals.trashRake}
          onClose={() => toggleModal('trashRake', false)}
          showToast={showToast}
        />
      )}

      {modals.salineIntrusion && (
        <SalineIntrusionModal
          isOpen={modals.salineIntrusion}
          onClose={() => toggleModal('salineIntrusion', false)}
        />
      )}

      {modals.drainageSOP && (
        <DrainageSOPModal
          isOpen={modals.drainageSOP}
          onClose={() => toggleModal('drainageSOP', false)}
          showToast={showToast}
        />
      )}

      {modals.gutterInflow && (
        <GutterInflowModal
          isOpen={modals.gutterInflow}
          onClose={() => toggleModal('gutterInflow', false)}
          selectedNode={selectedNode}
          showToast={showToast}
        />
      )}

      {modals.wardDeficit && (
        <WardDrainageDeficitModal
          isOpen={modals.wardDeficit}
          onClose={() => toggleModal('wardDeficit', false)}
          showToast={showToast}
        />
      )}

      {modals.mobilePump && (
        <MobilePumpRequisitionModal
          isOpen={modals.mobilePump}
          onClose={() => toggleModal('mobilePump', false)}
          selectedNode={selectedNode}
          onDeployPump={(pump) => {
            setMobilePumpsDeployed((prev) => [...prev, pump]);
          }}
          showToast={showToast}
        />
      )}

      {modals.stressSandbox && (
        <HydraulicStressSandboxModal
          isOpen={modals.stressSandbox}
          onClose={() => toggleModal('stressSandbox', false)}
          onApplyStressScenario={(scenario) => {
            setActiveStressScenario(scenario);
          }}
          showToast={showToast}
        />
      )}

      {modals.workOrder && (
        <DrainageWorkOrderModal
          isOpen={modals.workOrder}
          onClose={() => toggleModal('workOrder', false)}
          selectedNode={selectedNode}
          showToast={showToast}
        />
      )}
    </div>
  );
}
