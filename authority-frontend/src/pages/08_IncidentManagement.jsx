import React, { useState, useEffect } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import {
  ShieldAlert,
  Clock,
  MapPin,
  Send,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Shield,
  FileCheck,
  Radio,
  PhoneCall,
  Volume2,
  Camera,
  Activity,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Check,
  X,
  Droplets,
  Zap,
  TrendingDown,
  LifeBuoy,
  FileText,
  Box,
  Compass,
  Megaphone,
  Crosshair,
  Sliders,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

// Import All 20 Specialized Operational Feature Components
import {
  IncidentCreationModal,
  SquadAllocationModal,
  LiveSquadTrackerDrawer,
  CitizenSOSAssimilationModal,
  TrafficBarricadeModal,
  EscalationWorkflowModal,
  AIRootCauseModal,
  IncidentRadioCommsDrawer,
  IncidentSurveillanceModal,
  EvacuationReliefModal,
  InfraProtectionModal,
  MobilePumpStationingModal,
  WaterRecessionPredictorModal,
  SafetyCasualtyLogModal,
  SITREPExportModal,
  SupplyRequisitionModal,
  ResolutionSignOffModal,
  UpstreamCatchmentModal,
  IncidentBatchOperationsBar,
  IncidentAudioAlertModal,
} from '../components/incidents/IncidentFeatureModals';

export default function IncidentManagement() {
  const {
    incidentList,
    dispatchIncident,
    addIncident,
    updateIncident,
    resolveIncident,
    addIncidentTimelineEvent,
    batchUpdateIncidents,
    selectedIncident,
    setSelectedIncident,
    setMapFocusTarget,
    updateVmsSign,
  } = useFloodCommand();

  // Filters, search & sorting
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('severity'); // 'severity' | 'depth' | 'newest'
  const [activeSuiteTab, setActiveSuiteTab] = useState('dispatch'); // 'dispatch' | 'police' | 'ai' | 'logistics' | 'all'
  const [toast, setToast] = useState(null);

  // Multi-select Batch mode state (Feature 19)
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);

  // Timeline custom note state
  const [timelineInput, setTimelineInput] = useState('');

  // 20 Modal & Drawer states
  const [modalStates, setModalStates] = useState({
    createIncident: false,     // Feature 1
    squadAllocation: false,    // Feature 2
    squadTracker: false,       // Feature 3
    citizenSOS: false,         // Feature 4
    trafficBarricade: false,   // Feature 5
    escalation: false,         // Feature 6
    aiRootCause: false,        // Feature 7
    radioComms: false,         // Feature 8
    surveillance: false,       // Feature 9
    evacuation: false,         // Feature 10
    infraProtection: false,    // Feature 11
    mobilePump: false,         // Feature 12
    recessionCurve: false,     // Feature 13
    safetyCasualty: false,     // Feature 14
    sitrepExport: false,       // Feature 15
    supplyRequisition: false,  // Feature 16
    resolutionSignOff: false,  // Feature 17
    upstreamCatchment: false,  // Feature 18
    audioAlert: false,         // Feature 20
  });

  const openModal = (name) => setModalStates((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModalStates((prev) => ({ ...prev, [name]: false }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync selected incident to map camera
  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    if (incident.coordinates && setMapFocusTarget) {
      setMapFocusTarget({
        coords: [incident.coordinates[1], incident.coordinates[0]], // [lng, lat]
        zoom: 14.8,
        title: incident.title,
        subtitle: `${incident.location} • ${incident.depth}cm depth`,
      });
    }
  };

  // On initial mount or if selectedIncident changes without coordinates trigger
  useEffect(() => {
    if (selectedIncident?.coordinates && setMapFocusTarget) {
      setMapFocusTarget({
        coords: [selectedIncident.coordinates[1], selectedIncident.coordinates[0]],
        zoom: 14.5,
        title: selectedIncident.title,
        subtitle: `${selectedIncident.location} • ${selectedIncident.depth}cm depth`,
      });
    }
  }, []);

  // Filter & Search Logic
  const filteredIncidents = incidentList
    .filter((inc) => {
      if (filterSeverity !== 'ALL' && inc.severity.toLowerCase() !== filterSeverity.toLowerCase()) {
        return false;
      }
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'RESOLVED' && !inc.status?.includes('RESOLVED')) return false;
        if (filterStatus === 'ACTIVE' && inc.status?.includes('RESOLVED')) return false;
        if (filterStatus === 'EN ROUTE' && !inc.status?.includes('EN ROUTE') && !inc.status?.includes('DEPLOYED')) return false;
        if (filterStatus === 'PENDING' && !inc.status?.includes('PENDING')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inc.id?.toLowerCase().includes(q);
        const matchesTitle = inc.title?.toLowerCase().includes(q);
        const matchesLoc = inc.location?.toLowerCase().includes(q);
        const matchesSquad = inc.assignedSquad?.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesLoc || matchesSquad;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'depth') return b.depth - a.depth;
      if (sortBy === 'severity') {
        const score = { Critical: 3, High: 2, Moderate: 1 };
        return (score[b.severity] || 0) - (score[a.severity] || 0);
      }
      return 0; // default order
    });

  // Batch Selection Handlers
  const toggleBatchSelect = (id, e) => {
    e.stopPropagation();
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchAction = (actionType) => {
    if (actionType === 'DISPATCH_ALL_PUMPS') {
      batchUpdateIncidents(selectedBatchIds, {
        status: 'CREW DEPLOYED / EN ROUTE',
        assignedSquad: 'Multi-Agency Dewatering Pool',
      });
      showToast(`Dispatched high-flow dewatering pumps to ${selectedBatchIds.length} incidents!`);
    } else if (actionType === 'BARRICADE_ALL') {
      batchUpdateIncidents(selectedBatchIds, {
        status: 'BARRICADED / TRAFFIC DIVERTED',
      });
      showToast(`Issued traffic barricades for ${selectedBatchIds.length} locations to Traffic Police!`);
    } else if (actionType === 'ESCALATE_ALL') {
      batchUpdateIncidents(selectedBatchIds, {
        severity: 'Critical',
        status: 'ESCALATED: Joint Disaster Control',
      });
      showToast(`Escalated ${selectedBatchIds.length} incidents to Critical Status.`);
    }
    setSelectedBatchIds([]);
  };

  // Add timeline note handler
  const handleAddTimelineNote = (e) => {
    e.preventDefault();
    if (!timelineInput.trim() || !selectedIncident) return;
    addIncidentTimelineEvent(selectedIncident.id, timelineInput.trim());
    setTimelineInput('');
    showToast('Appended operational note to incident timeline.');
  };

  // Quick Depth Adjuster
  const handleDepthChange = (delta) => {
    if (!selectedIncident) return;
    const newDepth = Math.max(0, (selectedIncident.depth || 0) + delta);
    updateIncident(selectedIncident.id, { depth: newDepth });
    showToast(`Adjusted water level to ${newDepth} cm.`);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)] bg-canvas">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-status-safe" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Operational Command Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-status-alert-soft flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-status-alert animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-ink uppercase tracking-wide">
                Operational Incident Command &amp; Multi-Agency Dispatch
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-bold uppercase">
                ● C4i ACTIVE
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              Live Inter-Agency Dispatch linking Municipal Ward DMUs, Mumbai Traffic Police, Fire Brigade &amp; NDRF
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => openModal('createIncident')}
            className="px-3.5 py-2 bg-purple hover:bg-purple-deep text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Incident</span>
          </button>

          <button
            onClick={() => openModal('sitrepExport')}
            className="px-3 py-2 bg-surface hover:bg-surface-secondary border border-border text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-purple" />
            <span>Export SITREP</span>
          </button>

          <button
            onClick={() => openModal('audioAlert')}
            className="px-3 py-2 bg-status-alert-soft hover:bg-status-alert/20 text-status-alert border border-status-alert/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>PA Siren Broadcast</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION BELOW HEADER: Live Operational Telemetry HUD & Command Deck     */}
      {/* ========================================================================= */}

      {/* 1. Live Operational Telemetry HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Active Incidents */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary block">
              Active Incidents
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-ink">
                {incidentList.filter((i) => !i.status?.includes('RESOLVED')).length}
              </span>
              <span className="text-[10px] font-mono text-ink-secondary">of {incidentList.length} total</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-status-alert-soft text-status-alert">
                {incidentList.filter((i) => i.severity === 'Critical').length} Critical
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-status-warning-soft text-status-warning">
                {incidentList.filter((i) => i.severity === 'High').length} High
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-status-alert-soft/60 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-status-alert" />
          </div>
        </div>

        {/* KPI 2: Max Inundation Depth */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary block">
              Max Flood Depth
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-status-alert">
                {Math.max(...incidentList.map((i) => i.depth || 0))} cm
              </span>
              <span className="text-[10px] font-mono text-status-alert font-bold">● PEAK ALERT</span>
            </div>
            <p className="text-[10px] text-ink-secondary mt-1.5 truncate max-w-[170px]">
              {selectedIncident ? selectedIncident.location.split(' (')[0] : 'Sion Circle LBS'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-soft/60 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-purple" />
          </div>
        </div>

        {/* KPI 3: Squads Dispatched */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary block">
              Dispatched Units
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-purple">
                {incidentList.filter((i) => i.status?.includes('DEPLOYED') || i.status?.includes('EN ROUTE')).length}
              </span>
              <span className="text-[10px] font-mono text-status-safe font-bold">Units En Route</span>
            </div>
            <button
              onClick={() => openModal('squadTracker')}
              className="text-[10px] font-mono text-purple hover:underline font-bold mt-1.5 flex items-center gap-1"
            >
              <span>TRACK LIVE GPS</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-status-safe-soft/60 flex items-center justify-center">
            <Truck className="w-5 h-5 text-status-safe" />
          </div>
        </div>

        {/* KPI 4: Inter-Agency C4i Link */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary block">
              Multi-Agency Net
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm font-bold font-mono text-status-safe">
                ALL 4 AGENCIES SYNCED
              </span>
            </div>
            <p className="text-[10px] text-ink-secondary mt-1.5 font-mono">
              VHF 156.8MHz • CAD Gateway Live
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-secondary flex items-center justify-center">
            <Radio className="w-5 h-5 text-purple animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Categorized Tactical Command Suite (20 Specialized Features) */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3.5">
        {/* Category Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <Sliders className="w-4 h-4 text-purple" />
              <span>Operational Command Suites:</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-surface-secondary p-1 rounded-xl border border-border text-xs">
            {[
              { id: 'dispatch', label: 'Squad & Dispatch', icon: Truck, count: 5 },
              { id: 'police', label: 'Police & Public Safety', icon: Shield, count: 5 },
              { id: 'ai', label: 'AI & Hydraulic Intel', icon: Zap, count: 5 },
              { id: 'logistics', label: 'Logistics & Sign-Off', icon: FileCheck, count: 5 },
              { id: 'all', label: 'View All (20)', icon: Maximize2, count: 20 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSuiteTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSuiteTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
                    isActive
                      ? 'bg-surface text-purple shadow-subtle font-bold border border-purple/20'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple' : 'text-ink-secondary'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                      isActive ? 'bg-purple-soft text-purple' : 'bg-surface border border-border text-ink-secondary'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Cards Grid (Responsive 2 to 5 columns depending on screen size) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {/* Group 1: Squad & Dispatch */}
          {(activeSuiteTab === 'dispatch' || activeSuiteTab === 'all') && (
            <>
              <div
                onClick={() => openModal('squadAllocation')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      DISPATCH
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Squad Allocation
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Pair pumps, zodiacs &amp; desilt units to scene
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Allocate Unit &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('squadTracker')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-safe-soft flex items-center justify-center">
                      <Radio className="w-3.5 h-3.5 text-status-safe" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                      LIVE GPS
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Live GPS Telemetry
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Real-time vehicle speed, fuel &amp; route trail
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-safe flex items-center gap-1">
                  <span>Telemetry Ping &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('mobilePump')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Droplets className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      500HP PUMPS
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Dewatering Fleet
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Station high-flow trailer pumps (2500 m³/hr)
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Deploy Pump &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('radioComms')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-ink font-bold">
                      156.8 MHz
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Radio VHF Terminal
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Inter-agency radio chatter &amp; broadcast
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Open Channels &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('createIncident')}
                className="p-3 rounded-xl border border-purple/30 bg-purple-soft/30 hover:bg-purple-soft/60 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple text-white flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple text-white font-bold">
                      LOG INCIDENT
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Incident Creator
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Log new inundation with exact coordinates
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Create Dossier &rarr;</span>
                </div>
              </div>
            </>
          )}

          {/* Group 2: Police, Traffic & Public Safety */}
          {(activeSuiteTab === 'police' || activeSuiteTab === 'all') && (
            <>
              <div
                onClick={() => openModal('citizenSOS')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-alert-soft flex items-center justify-center">
                      <PhoneCall className="w-3.5 h-3.5 text-status-alert" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      112 / 108
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Citizen SOS Hub
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Trapped residents &amp; voice AI transcripts
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-alert flex items-center gap-1">
                  <span>View Distress &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('trafficBarricade')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-warning-soft flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-status-warning" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-warning-soft text-status-warning font-bold">
                      TRAFFIC
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Barricades &amp; VMS
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Highway electronic signs &amp; road cordons
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-warning flex items-center gap-1">
                  <span>Divert Traffic &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('audioAlert')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-alert-soft flex items-center justify-center">
                      <Megaphone className="w-3.5 h-3.5 text-status-alert" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      PA SIREN
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Siren &amp; PA Broadcast
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Synthesize Hindi/Marathi/English street audio
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-alert flex items-center gap-1">
                  <span>Sound Alarm &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('evacuation')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-warning-soft flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-status-warning" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-warning-soft text-status-warning font-bold">
                      RELIEF
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Evacuation Estimator
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Vulnerable residents &amp; shelter capacities
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-warning flex items-center gap-1">
                  <span>Assess Impact &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('safetyCasualty')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-alert-soft flex items-center justify-center">
                      <LifeBuoy className="w-3.5 h-3.5 text-status-alert" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      TRIAGE
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Casualty Logbook
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Stranded vehicles &amp; medical evacuations
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-alert flex items-center gap-1">
                  <span>Log Rescue &rarr;</span>
                </div>
              </div>
            </>
          )}

          {/* Group 3: AI & Hydraulic Intelligence */}
          {(activeSuiteTab === 'ai' || activeSuiteTab === 'all') && (
            <>
              <div
                onClick={() => openModal('aiRootCause')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      AI SWE 2D
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    AI Root Cause Advisor
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Tidal backpressure vs drop inlet siltation
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>View Hydro AI &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('recessionCurve')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <TrendingDown className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      RECESSION
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Hydrograph Curve
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Estimated road clearance &amp; drawdown time
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Plot Hydrograph &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('upstreamCatchment')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Compass className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      RADAR
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Catchment Radar
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Doppler reflectivity &amp; basin soil saturation
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Catchment Telemetry &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('surveillance')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      CCTV / DRONE
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Drone &amp; CCTV Feeds
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Live roadway camera &amp; aerial orthomosaics
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>View Feeds &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => {
                  if (selectedIncident && setMapFocusTarget) {
                    setMapFocusTarget({
                      coords: [selectedIncident.coordinates[1], selectedIncident.coordinates[0]],
                      zoom: 15.2,
                      title: selectedIncident.title,
                      subtitle: `${selectedIncident.location} (${selectedIncident.depth}cm)`,
                    });
                    showToast(`Camera zoomed to ${selectedIncident.id} scene`);
                  }
                }}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Crosshair className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-ink font-bold">
                      GIS 3D
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    GIS Camera Fly-To
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Center digital twin map on current scene
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Center Scene &rarr;</span>
                </div>
              </div>
            </>
          )}

          {/* Group 4: Logistics & Governance */}
          {(activeSuiteTab === 'logistics' || activeSuiteTab === 'all') && (
            <>
              <div
                onClick={() => openModal('infraProtection')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-alert-soft flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-status-alert" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      POWER / GAS
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Utility Lockout
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    De-energize 33kV substations &amp; gas valves
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-alert flex items-center gap-1">
                  <span>Isolate Grid &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('supplyRequisition')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <Box className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                      DEPOT
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Sandbags &amp; Supplies
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Requisition geotextile bags &amp; light masts
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Requisition &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('escalation')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-alert-soft flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-status-alert" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      SOP TIER 4
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    SEOC Escalation
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Escalate to State Disaster Management Authority
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-alert flex items-center gap-1">
                  <span>Escalate Tier &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('sitrepExport')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-soft flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-purple" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-ink font-bold">
                      SITREP
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    SITREP Exporter
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Generate official MHA disaster dossier
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-purple flex items-center gap-1">
                  <span>Print &amp; Copy &rarr;</span>
                </div>
              </div>

              <div
                onClick={() => openModal('resolutionSignOff')}
                className="p-3 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface hover:border-purple/50 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-status-safe-soft flex items-center justify-center">
                      <FileCheck className="w-3.5 h-3.5 text-status-safe" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                      CLOSURE
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-ink group-hover:text-purple transition-colors">
                    Resolution Sign-Off
                  </h4>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                    Digital closure &amp; road clearance certificate
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-status-safe flex items-center gap-1">
                  <span>Sign Off Scene &rarr;</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Multi-Pane Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Pane: Interactive Incident Queue (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-2.5">
          {/* Search Bar & Filters */}
          <div className="bg-surface border border-border rounded-xl p-2.5 shadow-subtle space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, road, ward, squad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Severity Pill Filters */}
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <div className="flex items-center gap-1 bg-surface-secondary p-0.5 rounded-lg border border-border w-full justify-between">
                {['ALL', 'Critical', 'High', 'Moderate'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`flex-1 py-1 rounded-md transition-colors text-center text-[10px] ${
                      filterSeverity === sev
                        ? 'bg-surface text-purple shadow-sm font-bold'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Status & Sort Selectors */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 rounded-lg bg-surface-secondary border border-border text-ink focus:outline-none"
              >
                <option value="ALL">Status: All</option>
                <option value="ACTIVE">Active Incidents</option>
                <option value="PENDING">Dispatch Pending</option>
                <option value="EN ROUTE">Squad En Route</option>
                <option value="RESOLVED">Resolved / Closed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 rounded-lg bg-surface-secondary border border-border text-ink focus:outline-none"
              >
                <option value="severity">Sort: Priority</option>
                <option value="depth">Sort: Water Depth</option>
                <option value="newest">Sort: Detection Time</option>
              </select>
            </div>
          </div>

          {/* Queue Count Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Active Incidents ({filteredIncidents.length})
            </span>
            <span className="text-[10px] font-mono text-status-safe font-semibold">● FULL DUPLEX LIVE</span>
          </div>

          {/* Incident Cards List */}
          <div className="space-y-2 overflow-y-auto max-h-[640px] pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-ink-secondary">
                No incidents match current filter criteria.
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                const isBatchSelected = selectedBatchIds.includes(incident.id);

                return (
                  <div
                    key={incident.id}
                    onClick={() => handleSelectIncident(incident)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-purple-soft/60 border-purple shadow-subtle ring-1 ring-purple/50'
                        : 'bg-surface border-border hover:border-purple/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Checkbox for batch selection */}
                        <input
                          type="checkbox"
                          checked={isBatchSelected}
                          onChange={(e) => toggleBatchSelect(incident.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded text-purple w-3.5 h-3.5 cursor-pointer"
                          title="Select for batch operations"
                        />
                        <span className="font-mono text-xs font-bold text-ink">{incident.id}</span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          incident.severity === 'Critical'
                            ? 'bg-status-alert-soft text-status-alert'
                            : incident.severity === 'High'
                            ? 'bg-status-warning-soft text-status-warning'
                            : 'bg-purple-soft text-purple'
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-ink mt-1.5 leading-tight">{incident.title}</h4>

                    <div className="text-[11px] text-ink-secondary mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-purple flex-shrink-0" />
                      <span className="truncate">{incident.location}</span>
                    </div>

                    {/* Assigned Squad tag */}
                    <div className="text-[10px] font-mono text-ink-secondary mt-1 flex items-center gap-1 truncate">
                      <Truck className="w-3 h-3 text-ink-secondary flex-shrink-0" />
                      <span className="truncate">{incident.assignedSquad || 'No squad assigned'}</span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-ink-secondary">{incident.detectedTime}</span>
                      <span className={`font-bold ${incident.depth > 30 ? 'text-status-alert' : 'text-purple'}`}>
                        {incident.depth} cm depth
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Pane: Selected Incident Tactical Map (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          {/* Map Container with automatic camera fly-to */}
          <div className="relative rounded-xl overflow-hidden border border-border shadow-subtle">
            <InteractiveMapTwin
              height="490px"
              customCenter={
                selectedIncident?.coordinates
                  ? [selectedIncident.coordinates[1], selectedIncident.coordinates[0]]
                  : [72.868, 19.075]
              }
              customZoom={14.5}
            />

            {/* Tactical Over-Map HUD Badge */}
            {selectedIncident && (
              <div className="absolute top-3 left-3 z-10 bg-surface/90 backdrop-blur-md border border-border p-2.5 rounded-xl shadow-subtle flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-status-alert animate-ping" />
                <div>
                  <div className="text-[11px] font-mono font-bold text-ink flex items-center gap-1.5">
                    <span>{selectedIncident.id}</span>
                    <span className="text-purple">• {selectedIncident.depth} cm</span>
                  </div>
                  <div className="text-[10px] text-ink-secondary truncate max-w-[200px]">
                    {selectedIncident.location}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tactical Dispatch Unit Status Bar with Working Live Telemetry */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
                <Truck className="w-4 h-4 text-purple" />
              </div>
              <div>
                <span className="font-bold text-ink block">
                  {selectedIncident?.assignedSquad || 'Squad-04 (500HP Dewatering Pump)'}
                </span>
                <span className="text-[10px] text-ink-secondary font-mono flex items-center gap-2">
                  <span>ETA: {selectedIncident?.squadEta || '6 mins'}</span>
                  <span>• Status: {selectedIncident?.status || 'DISPATCHED'}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Live GPS Telemetry pinging ${selectedIncident?.assignedSquad || 'Squad-04'}...`);
                  openModal('squadTracker');
                }}
                className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 shadow-subtle transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>PING SQUAD GPS</span>
              </button>

              <button
                onClick={() => openModal('squadAllocation')}
                className="px-2.5 py-1.5 bg-surface-secondary hover:bg-surface border border-border rounded-lg text-[11px] font-mono font-bold text-ink"
              >
                REASSIGN
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Command Dossier & Action Dispatch Console (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {selectedIncident ? (
            <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3.5">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-border pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple font-bold px-2 py-0.5 rounded bg-purple-soft">
                      {selectedIncident.id} • {selectedIncident.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-secondary text-ink-secondary border border-border">
                      {selectedIncident.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink mt-1.5">{selectedIncident.title}</h3>
                </div>
              </div>

              {/* Incident Telemetry with Interactive Live Depth Adjuster */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-surface-secondary border border-border rounded-lg p-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-ink-secondary uppercase">Water Depth</span>
                    {/* Live depth step buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDepthChange(-5)}
                        title="Reduce water level by 5cm"
                        className="w-4 h-4 rounded bg-surface border border-border text-ink hover:text-purple text-[10px] flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleDepthChange(5)}
                        title="Increase water level by 5cm"
                        className="w-4 h-4 rounded bg-surface border border-border text-ink hover:text-status-alert text-[10px] flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-status-alert mt-0.5">
                    {selectedIncident.depth} cm
                  </div>
                </div>

                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <span className="text-[10px] text-ink-secondary uppercase">Predicted Peak</span>
                  <div className="text-xs font-bold text-ink mt-1.5">
                    {selectedIncident.predictedPeak}
                  </div>
                </div>
              </div>

              {/* Location & Root Cause Card */}
              <div className="p-3 rounded-lg bg-surface-secondary border border-border text-xs space-y-1.5">
                <div>
                  <strong className="text-ink">Location:</strong>{' '}
                  <span className="text-ink-secondary">{selectedIncident.location}</span>
                </div>
                <div>
                  <strong className="text-ink">Root Cause:</strong>{' '}
                  <span className="text-ink-secondary">{selectedIncident.cause}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-status-safe font-semibold">
                    AI Model Confidence: {selectedIncident.confidence}
                  </span>
                  <button
                    onClick={() => openModal('aiRootCause')}
                    className="text-[10px] font-mono text-purple font-bold hover:underline"
                  >
                    EXPLAIN AI ROOT CAUSE &rarr;
                  </button>
                </div>
              </div>

              {/* Action Buttons: 100% Workable with interactive modal workflows */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => openModal('squadAllocation')}
                  className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-between shadow-subtle transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Rapid Dewatering Squad</span>
                  </div>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openModal('trafficBarricade')}
                  className="w-full py-1.5 px-3 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-status-warning" />
                    <span>Issue Barricade Order to Traffic Police</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-secondary" />
                </button>

                <button
                  onClick={() => openModal('escalation')}
                  className="w-full py-1.5 px-3 bg-status-alert-soft hover:bg-status-alert/20 text-status-alert border border-status-alert/30 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Escalate to State Emergency Operations (SEOC)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-status-alert" />
                </button>

                <button
                  onClick={() => openModal('resolutionSignOff')}
                  className="w-full py-1.5 px-3 bg-status-safe-soft hover:bg-status-safe/20 text-status-safe border border-status-safe/30 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Incident Resolution &amp; Road Clearance Sign-Off</span>
                  </div>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Incident Chronological Timeline with Interactive Append */}
              <div className="border-t border-border pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                    Incident Action Timeline ({selectedIncident.timeline?.length || 0})
                  </span>
                  <span className="text-[10px] font-mono text-purple font-semibold">● REALTIME SYNC</span>
                </div>

                <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                  {selectedIncident.timeline?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-mono text-[10px] font-bold text-purple">{step.time}</span>
                        <p className="text-ink text-[11px] leading-snug">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline entry form */}
                <form onSubmit={handleAddTimelineNote} className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Log field update / radio note..."
                    value={timelineInput}
                    onChange={(e) => setTimelineInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-8 text-center text-ink-secondary text-xs">
              Select an incident from the queue to view command dossier.
            </div>
          )}
        </div>
      </div>

      {/* FEATURE 19: Floating Batch Operations Bar */}
      <IncidentBatchOperationsBar
        selectedIds={selectedBatchIds}
        totalCount={filteredIncidents.length}
        onClearSelection={() => setSelectedBatchIds([])}
        onBatchAction={handleBatchAction}
      />

      {/* ALL 20 MODALS & DRAWERS MOUNTED HERE */}
      <IncidentCreationModal
        isOpen={modalStates.createIncident}
        onClose={() => closeModal('createIncident')}
        onAddIncident={addIncident}
        showToast={showToast}
      />

      <SquadAllocationModal
        isOpen={modalStates.squadAllocation}
        onClose={() => closeModal('squadAllocation')}
        incident={selectedIncident}
        onUpdateIncident={updateIncident}
        showToast={showToast}
      />

      <LiveSquadTrackerDrawer
        isOpen={modalStates.squadTracker}
        onClose={() => closeModal('squadTracker')}
        incident={selectedIncident}
        onMapFocus={(coords, zoom, title) => {
          if (setMapFocusTarget) {
            setMapFocusTarget({
              coords: [coords[1], coords[0]],
              zoom: zoom || 15.5,
              title: title || 'Tactical Squad GPS Location',
            });
          }
        }}
        showToast={showToast}
      />

      <CitizenSOSAssimilationModal
        isOpen={modalStates.citizenSOS}
        onClose={() => closeModal('citizenSOS')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <TrafficBarricadeModal
        isOpen={modalStates.trafficBarricade}
        onClose={() => closeModal('trafficBarricade')}
        incident={selectedIncident}
        onUpdateVms={updateVmsSign}
        showToast={showToast}
      />

      <EscalationWorkflowModal
        isOpen={modalStates.escalation}
        onClose={() => closeModal('escalation')}
        incident={selectedIncident}
        onUpdateIncident={updateIncident}
        showToast={showToast}
      />

      <AIRootCauseModal
        isOpen={modalStates.aiRootCause}
        onClose={() => closeModal('aiRootCause')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <IncidentRadioCommsDrawer
        isOpen={modalStates.radioComms}
        onClose={() => closeModal('radioComms')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <IncidentSurveillanceModal
        isOpen={modalStates.surveillance}
        onClose={() => closeModal('surveillance')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <EvacuationReliefModal
        isOpen={modalStates.evacuation}
        onClose={() => closeModal('evacuation')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <InfraProtectionModal
        isOpen={modalStates.infraProtection}
        onClose={() => closeModal('infraProtection')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <MobilePumpStationingModal
        isOpen={modalStates.mobilePump}
        onClose={() => closeModal('mobilePump')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <WaterRecessionPredictorModal
        isOpen={modalStates.recessionCurve}
        onClose={() => closeModal('recessionCurve')}
        incident={selectedIncident}
      />

      <SafetyCasualtyLogModal
        isOpen={modalStates.safetyCasualty}
        onClose={() => closeModal('safetyCasualty')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <SITREPExportModal
        isOpen={modalStates.sitrepExport}
        onClose={() => closeModal('sitrepExport')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <SupplyRequisitionModal
        isOpen={modalStates.supplyRequisition}
        onClose={() => closeModal('supplyRequisition')}
        incident={selectedIncident}
        showToast={showToast}
      />

      <ResolutionSignOffModal
        isOpen={modalStates.resolutionSignOff}
        onClose={() => closeModal('resolutionSignOff')}
        incident={selectedIncident}
        onResolve={resolveIncident}
        showToast={showToast}
      />

      <UpstreamCatchmentModal
        isOpen={modalStates.upstreamCatchment}
        onClose={() => closeModal('upstreamCatchment')}
        incident={selectedIncident}
      />

      <IncidentAudioAlertModal
        isOpen={modalStates.audioAlert}
        onClose={() => closeModal('audioAlert')}
        incident={selectedIncident}
        showToast={showToast}
      />
    </div>
  );
}
