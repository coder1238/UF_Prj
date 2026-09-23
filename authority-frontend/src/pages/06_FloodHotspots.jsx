import React, { useState, useMemo, useEffect } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import { HOTSPOT_DATA, calculateHpiScore } from '../data/floodHotspotsData';

// 20 Specialized Operational Feature Components
import {
  HotspotPriorityMatrixModal,
  TopographicSumpProfilerModal,
  HydraulicCulvertTracerModal,
  MobilePumpFleetModal,
  RapidBarrierSimulatorModal,
  VmsTrafficDiversionModal,
  CctvAiVisionInspectorModal,
  VulnerableAssetExposureModal,
  CitizenSosClusterModal,
  StressTestScenarioModal,
  EvacuationRoutePathfinderModal,
  HistoricalAnalogModal,
  CellBroadcastDispatcherModal,
  SiltDredgingRequisitionModal,
  PowerGridTripSafeguardModal,
  NdrfMobilizationModal,
  CustomHotspotGeoprobeModal,
  SitRepDossierModal,
  AudioEvacuationSirenModal,
  GisDataExportSuiteModal,
} from '../components/hotspots/HotspotFeatureModals';

import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Clock,
  Send,
  Layers,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Sliders,
  Activity,
  Truck,
  ShieldAlert,
  Radio,
  Eye,
  Building,
  Users,
  Cpu,
  Compass,
  BarChart2,
  FileText,
  Volume2,
  Download,
  Zap,
  RefreshCw,
  MapPin,
  Maximize2,
  ChevronRight,
  Navigation,
  Waves,
} from 'lucide-react';

export default function FloodHotspots() {
  const {
    nowcastMinutes,
    setNowcastMinutes,
    setMapFocusTarget,
    setSelectedRoad,
    publishAlert,
    updateVmsSign,
    addCommandLog,
    placedBarriers,
    mobilePumpsList,
  } = useFloodCommand();

  // Dynamic Hotspots State (initialized with 10 detailed Mumbai hotspots)
  const [hotspotList, setHotspotList] = useState(HOTSPOT_DATA);
  const [selectedHotspotId, setSelectedHotspotId] = useState(HOTSPOT_DATA[0].id);

  // Time Horizon Step ('current' | '+1h' | '+2h' | '+3h')
  const [horizonStep, setHorizonStep] = useState('current');

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('depth'); // 'depth' | 'hpi' | 'pop' | 'time'

  // Toast feedback
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 20 Operational Modals State Manager
  const [modals, setModals] = useState({
    hpiMatrix: false,
    topoProfiler: false,
    culvertTracer: false,
    mobilePump: false,
    barrierSim: false,
    vmsDiversion: false,
    cctvVision: false,
    vulnerableAssets: false,
    citizenSos: false,
    stressTest: false,
    evacuationRoute: false,
    historicalAnalog: false,
    cellBroadcast: false,
    siltDredging: false,
    powerGridTrip: false,
    ndrfMobilization: false,
    customGeoprobe: false,
    sitRep: false,
    audioSiren: false,
    gisExport: false,
  });

  const openModal = (key) => setModals((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) => setModals((prev) => ({ ...prev, [key]: false }));

  // Find currently active hotspot
  const currentHotspot = useMemo(() => {
    return hotspotList.find((h) => h.id === selectedHotspotId) || hotspotList[0];
  }, [hotspotList, selectedHotspotId]);

  // Synchronize GIS Map whenever active hotspot changes
  const handleSelectHotspot = (spot) => {
    setSelectedHotspotId(spot.id);
    if (spot.coordinates && setMapFocusTarget) {
      setMapFocusTarget({
        coords: spot.coordinates,
        zoom: 14.8,
        title: spot.name,
        subtitle: `${spot.ward} • Peak ${spot.predictedDepth} cm (${spot.severity})`,
      });
    }
  };

  // Sync with timeline scrubber from context if scrubbed
  useEffect(() => {
    if (nowcastMinutes === 0) setHorizonStep('current');
    else if (nowcastMinutes <= 60) setHorizonStep('+1h');
    else if (nowcastMinutes <= 120) setHorizonStep('+2h');
    else setHorizonStep('+3h');
  }, [nowcastMinutes]);

  // Handle Horizon Step Change
  const handleHorizonChange = (hId) => {
    setHorizonStep(hId);
    if (hId === 'current') setNowcastMinutes(0);
    else if (hId === '+1h') setNowcastMinutes(60);
    else if (hId === '+2h') setNowcastMinutes(120);
    else if (hId === '+3h') setNowcastMinutes(180);
  };

  // Filtered and Sorted Hotspots
  const filteredHotspots = useMemo(() => {
    return hotspotList
      .filter((spot) => {
        const matchesSearch =
          spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.primaryCause.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWard = selectedWardFilter === 'ALL' || spot.ward === selectedWardFilter;
        const matchesSeverity = severityFilter === 'ALL' || spot.severity === severityFilter;
        return matchesSearch && matchesWard && matchesSeverity;
      })
      .sort((a, b) => {
        if (sortBy === 'depth') return b.predictedDepth - a.predictedDepth;
        if (sortBy === 'pop') return b.populationAtRisk - a.populationAtRisk;
        if (sortBy === 'hpi') return calculateHpiScore(b) - calculateHpiScore(a);
        return a.peakTime.localeCompare(b.peakTime);
      });
  }, [hotspotList, searchQuery, selectedWardFilter, severityFilter, sortBy]);

  // Add custom hotspot handler
  const handleAddCustomHotspot = (newSpot) => {
    setHotspotList((prev) => [newSpot, ...prev]);
    handleSelectHotspot(newSpot);
    showToast(`New hotspot "${newSpot.name}" declared and mapped into Command Grid.`);
  };

  // Calculate dynamic metrics for currently selected horizon
  const horizonDepth = useMemo(() => {
    if (horizonStep === 'current') return currentHotspot.currentDepth;
    if (horizonStep === '+1h') return currentHotspot.trajectory.plus1h.depth;
    if (horizonStep === '+2h') return currentHotspot.trajectory.plus2h.depth;
    return currentHotspot.trajectory.plus3h.depth;
  }, [currentHotspot, horizonStep]);

  const horizonStatus = useMemo(() => {
    if (horizonStep === 'current') return currentHotspot.trajectory.current.status;
    if (horizonStep === '+1h') return currentHotspot.trajectory.plus1h.status;
    if (horizonStep === '+2h') return currentHotspot.trajectory.plus2h.status;
    return currentHotspot.trajectory.plus3h.status;
  }, [currentHotspot, horizonStep]);

  // Check if barriers or pumps are placed at current hotspot
  const hasActivePump = mobilePumpsList.some(
    (p) =>
      p.status.includes('ACTIVE') &&
      (p.location.includes(currentHotspot.shortName) || p.assignedTo === currentHotspot.ward)
  );

  const activeBarriersHere = placedBarriers.filter((b) =>
    b.name.toLowerCase().includes(currentHotspot.shortName.toLowerCase())
  );

  // Dispatch Traffic Advisory CTA
  const handleIssueAdvisory = () => {
    const advisoryTitle = `TRAFFIC ADVISORY: ${currentHotspot.name.toUpperCase()} FLOODED`;
    publishAlert({
      id: `AL-TRAF-${Date.now().toString().slice(-4)}`,
      title: advisoryTitle,
      wards: [currentHotspot.ward],
      status: 'PUBLISHED - ACTIVE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      audienceReach: `${currentHotspot.populationAtRisk.toLocaleString()} citizens`,
      depthRange: `${currentHotspot.predictedDepth} cm`,
      channels: ['Traffic VMS', 'JalDrishti App', 'Control Room'],
    });

    if (currentHotspot.diversionRoute?.vmsId) {
      updateVmsSign(
        currentHotspot.diversionRoute.vmsId,
        currentHotspot.diversionRoute.vmsRecommendedText,
        'ACTIVE / TRAFFIC DIVERTED'
      );
    }

    addCommandLog({
      officer: 'Traffic Ops Desk',
      type: 'TRAFFIC_ADVISORY_ISSUED',
      details: `Targeted traffic diversion advisory dispatched for ${currentHotspot.name}. Feeder VMS ${currentHotspot.diversionRoute?.vmsId || 'VMS-01'} updated.`,
      status: 'EXECUTED',
    });

    showToast(`Targeted advisory published for ${currentHotspot.name}. VMS board updated.`);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-status-safe flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
                Ranked Flood Hotspot Intelligence &amp; Causal Diagnostics
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Geospatial prioritization of vulnerable urban intersections, underpasses, and railway sumps ({hotspotList.length} monitored)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Toolbar (Feature Launchers) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Switcher */}
          <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-border text-xs font-semibold">
            {[
              { id: 'current', label: 'Current' },
              { id: '+1h', label: '+1 Hour' },
              { id: '+2h', label: '+2 Hours' },
              { id: '+3h', label: '+3 Hours' },
            ].map((h) => (
              <button
                key={h.id}
                onClick={() => handleHorizonChange(h.id)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  horizonStep === h.id
                    ? 'bg-surface text-purple shadow-sm font-bold'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Feature 1: HPI Matrix */}
          <button
            onClick={() => openModal('hpiMatrix')}
            className="px-3 py-1.5 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Hotspot Priority Index Ranking"
          >
            <Sliders className="w-3.5 h-3.5 text-purple" />
            <span>HPI Matrix</span>
          </button>

          {/* Feature 17: Custom Geoprobe */}
          <button
            onClick={() => openModal('customGeoprobe')}
            className="px-3 py-1.5 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Add Custom Hotspot Pinpoint"
          >
            <MapPin className="w-3.5 h-3.5 text-purple" />
            <span>+ Add Hotspot</span>
          </button>

          {/* Feature 19: Audio Siren */}
          <button
            onClick={() => openModal('audioSiren')}
            className="px-3 py-1.5 bg-status-alert-soft border border-status-alert/30 text-status-alert hover:bg-status-alert hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Acoustic Emergency Siren"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Siren</span>
          </button>

          {/* Feature 18: SitRep */}
          <button
            onClick={() => openModal('sitRep')}
            className="px-3 py-1.5 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Situation Report Generator"
          >
            <FileText className="w-3.5 h-3.5 text-purple" />
            <span>SitRep</span>
          </button>

          {/* Feature 20: GIS Export */}
          <button
            onClick={() => openModal('gisExport')}
            className="px-3 py-1.5 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Export GIS Data"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            <span>GIS Export</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-surface border border-border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle text-xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hotspot by name, ward, or cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-secondary border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-ink focus:border-purple focus:outline-none"
            />
          </div>

          {/* Ward Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-ink-secondary" />
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(e.target.value)}
              className="bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-purple focus:outline-none"
            >
              <option value="ALL">All Wards</option>
              <option value="Ward F/N">Ward F/North</option>
              <option value="Ward K/E">Ward K/East</option>
              <option value="Ward L">Ward L</option>
              <option value="Ward G/N">Ward G/North</option>
              <option value="Ward H/E">Ward H/East</option>
              <option value="Ward H/W">Ward H/West</option>
              <option value="Ward S">Ward S</option>
            </select>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-purple focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH RISK">High Risk Only</option>
          </select>
        </div>

        {/* Sort By Controls */}
        <div className="flex items-center gap-2">
          <span className="text-ink-secondary font-mono text-[11px]">SORT BY:</span>
          <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border">
            {[
              { id: 'depth', label: 'Max Depth' },
              { id: 'hpi', label: 'HPI Score' },
              { id: 'pop', label: 'At-Risk Pop' },
              { id: 'time', label: 'Peak Time' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  sortBy === s.id ? 'bg-purple text-white shadow-sm' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK SWITCHER STRIP (Horizontal Scroller of Hotspots) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-2">
        {filteredHotspots.map((spot, idx) => {
          const isSelected = selectedHotspotId === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => handleSelectHotspot(spot)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-soft border-purple shadow-sm ring-1 ring-purple'
                  : 'bg-surface border-border hover:border-purple/40 hover:bg-surface-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple">{spot.rank}</span>
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    spot.predictedDepth >= 40
                      ? 'bg-status-alert-soft text-status-alert'
                      : spot.predictedDepth >= 25
                      ? 'bg-status-caution-soft text-status-caution'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {spot.predictedDepth}cm
                </span>
              </div>
              <div className="font-bold text-xs text-ink truncate mt-1.5" title={spot.name}>
                {spot.shortName}
              </div>
              <div className="flex items-center justify-between text-[10px] text-ink-secondary mt-1">
                <span>{spot.ward}</span>
                <span className="font-mono">{spot.elevationMsl}m</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN ASYMMETRIC OPERATIONAL WORKSPACE (7 Cols Map + 5 Cols Deep Dossier) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* LEFT COLUMN: GIS MAP TWIN & OPERATIONAL DISPATCH PANELS (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          {/* Real MapLibre Twin */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-subtle relative bg-surface">
            <InteractiveMapTwin height="520px" customCenter={currentHotspot.coordinates} customZoom={14.6} />

            {/* Quick Map Floating Badge with Active Focus */}
            <div className="absolute top-3 left-3 z-10 bg-surface/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl shadow-subtle flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-purple animate-pulse" />
              <div className="text-xs">
                <span className="text-ink font-bold">{currentHotspot.name}</span>
                <span className="text-ink-secondary text-[10px] ml-1.5">
                  [{currentHotspot.coordinates[1].toFixed(4)}, {currentHotspot.coordinates[0].toFixed(4)}]
                </span>
              </div>
            </div>
          </div>

          {/* 15 OPERATIONAL ACTION TILES (Organized Grid of Specialized Features) */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple" />
                Specialized Authority Intervention Tools ({currentHotspot.shortName})
              </span>
              <span className="text-[10px] font-mono text-ink-secondary">15 ACTIVE CONTROLS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {/* Feature 2: Topo Profiler */}
              <button
                onClick={() => openModal('topoProfiler')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Topo Profiler</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">2D Cross-section</div>
              </button>

              {/* Feature 3: Culvert Surcharge Tracer */}
              <button
                onClick={() => openModal('culvertTracer')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Waves className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Culvert Tracer</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">{currentHotspot.drainCapacityLoad}% Surcharged</div>
              </button>

              {/* Feature 4: Mobile Dewatering Pump */}
              <button
                onClick={() => openModal('mobilePump')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Mobile Pumps</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">
                  {hasActivePump ? 'Pump Active' : 'Dispatch Squad'}
                </div>
              </button>

              {/* Feature 5: Barrier Simulator */}
              <button
                onClick={() => openModal('barrierSim')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Flood Barriers</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Tiger Dam / Sandbags</div>
              </button>

              {/* Feature 6: Traffic Diversion & VMS */}
              <button
                onClick={() => openModal('vmsDiversion')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">VMS Diversion</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">
                  {currentHotspot.diversionRoute.vmsId} Sign
                </div>
              </button>

              {/* Feature 7: AI CCTV Vision */}
              <button
                onClick={() => openModal('cctvVision')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">AI CCTV Vision</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">{currentHotspot.cctvId}</div>
              </button>

              {/* Feature 8: Vulnerable Assets Scanner */}
              <button
                onClick={() => openModal('vulnerableAssets')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Building className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Asset Exposure</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Hospitals &amp; Grid</div>
              </button>

              {/* Feature 9: Citizen SOS Clusters */}
              <button
                onClick={() => openModal('citizenSos')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Citizen SOS</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Clustered Reports</div>
              </button>

              {/* Feature 10: Stress Testing */}
              <button
                onClick={() => openModal('stressTest')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Stress Tester</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Rain &amp; Tide Slider</div>
              </button>

              {/* Feature 11: Evacuation Pathfinder */}
              <button
                onClick={() => openModal('evacuationRoute')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Evacuation Path</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Relief Shelters</div>
              </button>

              {/* Feature 12: Historical Analog */}
              <button
                onClick={() => openModal('historicalAnalog')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Historical Analog</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">2005 vs Today</div>
              </button>

              {/* Feature 13: Targeted Cell Broadcast */}
              <button
                onClick={() => openModal('cellBroadcast')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Cell Broadcast</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">English / मराठी</div>
              </button>

              {/* Feature 14: Silt Desilting Requisition */}
              <button
                onClick={() => openModal('siltDredging')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Desilt Sucker</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Vacuum Jetting</div>
              </button>

              {/* Feature 15: Power Grid Trip Safeguard */}
              <button
                onClick={() => openModal('powerGridTrip')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">Grid Trip Cut</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Electrocution Interlock</div>
              </button>

              {/* Feature 16: NDRF Mobilization */}
              <button
                onClick={() => openModal('ndrfMobilization')}
                className="p-2.5 rounded-xl bg-surface-secondary border border-border hover:border-purple/50 text-left flex flex-col justify-between group transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-surface border border-border w-fit text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="font-bold text-ink mt-2">NDRF Requisition</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">Gemini Boats</div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE HOTSPOT DEEP DOSSIER & CAUSAL FLOW (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          {/* Deep Dossier Container */}
          <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col gap-4">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-purple font-bold px-2 py-0.5 rounded-md bg-purple-soft">
                    {currentHotspot.rank} • {currentHotspot.ward}
                  </span>
                  <span className="text-[10px] font-mono text-ink-secondary">
                    ELEV: {currentHotspot.elevationMsl}m MSL
                  </span>
                </div>
                <h3 className="font-bold text-base text-ink mt-1.5">
                  {currentHotspot.name}
                </h3>
                <div className="text-xs text-ink-secondary mt-0.5">
                  {currentHotspot.primaryCause}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md ${
                    currentHotspot.severity === 'CRITICAL'
                      ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                      : 'bg-status-caution-soft text-status-caution border border-status-caution/30'
                  }`}
                >
                  {currentHotspot.severity}
                </span>
                <span className="text-[10px] font-mono text-status-safe font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse" />
                  {currentHotspot.sensorId}
                </span>
              </div>
            </div>

            {/* 3 Core Primary Dynamic Metric Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-surface-secondary border border-border rounded-xl p-3">
                <span className="text-[10px] text-ink-secondary uppercase block">
                  Depth ({horizonStep === 'current' ? 'Live' : horizonStep})
                </span>
                <div className="font-mono text-2xl font-bold text-status-alert mt-0.5">
                  {horizonDepth} <span className="text-xs font-normal">cm</span>
                </div>
                <div className="text-[10px] font-mono text-ink-secondary mt-1 truncate">
                  {horizonStatus}
                </div>
              </div>

              <div className="bg-surface-secondary border border-border rounded-xl p-3">
                <span className="text-[10px] text-ink-secondary uppercase block">Peak Window</span>
                <div className="font-mono text-sm font-bold text-ink mt-1">
                  {currentHotspot.peakTime}
                </div>
                <div className="text-[10px] font-mono text-status-safe mt-1">
                  {currentHotspot.probability}
                </div>
              </div>

              <div className="bg-surface-secondary border border-border rounded-xl p-3">
                <span className="text-[10px] text-ink-secondary uppercase block">At-Risk Pop</span>
                <div className="font-mono text-sm font-bold text-purple mt-1">
                  {currentHotspot.populationAtRisk.toLocaleString()}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">
                  {currentHotspot.exposure.hospitals.length} Hospitals
                </div>
              </div>
            </div>

            {/* Depth Level Indicator Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-ink-secondary">Inundation Gauge:</span>
                <span className="font-bold text-status-alert">{horizonDepth} cm / 60 cm Max</span>
              </div>
              <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden border border-border">
                <div
                  style={{ width: `${Math.min(100, (horizonDepth / 60) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    horizonDepth >= 35 ? 'bg-status-alert' : horizonDepth >= 15 ? 'bg-status-caution' : 'bg-status-safe'
                  }`}
                />
              </div>
            </div>

            {/* INTERACTIVE CAUSAL EXPLANATION CHAIN (Step-by-Step Flow) */}
            <div className="bg-surface-secondary border border-border rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-ink flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple" />
                  Why This Location Floods (Causal Chain)
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">CLICK STEP TO INSPECT</span>
              </div>

              <div className="space-y-2 text-xs text-ink font-sans">
                {currentHotspot.causalChain.map((step, idx) => (
                  <React.Fragment key={step.step}>
                    <div
                      onClick={() => {
                        if (step.step === 3) openModal('topoProfiler');
                        else if (step.step === 4) openModal('culvertTracer');
                        else openModal('stressTest');
                      }}
                      className="p-2.5 rounded-xl bg-surface border border-border hover:border-purple/50 cursor-pointer transition-all flex items-center justify-between group shadow-subtle"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-ink group-hover:text-purple transition-colors">
                          {step.step}. {step.title}
                        </div>
                        <div className="text-[11px] text-ink-secondary">{step.desc}</div>
                      </div>
                      <span className="font-mono text-xs font-bold text-purple bg-purple-soft px-2 py-1 rounded-md flex-shrink-0">
                        {step.metric}
                      </span>
                    </div>

                    {idx < currentHotspot.causalChain.length - 1 && (
                      <div className="flex justify-center text-ink-muted my-[-3px]">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* TIME HORIZON TRAJECTORY STRIP (Interactive Horizon Cards) */}
            <div className="bg-surface-secondary border border-border rounded-2xl p-3.5 flex flex-col gap-2">
              <span className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Inundation Trajectory Across Horizon</span>
                <span className="text-[10px] font-mono text-ink-secondary">CLICK TO SCRUB</span>
              </span>

              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono mt-1">
                {[
                  { id: 'current', label: 'Current', data: currentHotspot.trajectory.current },
                  { id: '+1h', label: '+1 Hour', data: currentHotspot.trajectory.plus1h },
                  { id: '+2h', label: '+2 Hours', data: currentHotspot.trajectory.plus2h },
                  { id: '+3h', label: '+3 Hours', data: currentHotspot.trajectory.plus3h },
                ].map((item) => {
                  const isActive = horizonStep === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleHorizonChange(item.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-surface border-purple shadow-sm ring-1 ring-purple text-purple font-bold'
                          : 'bg-surface border-border hover:border-purple/30 text-ink'
                      }`}
                    >
                      <div className="text-ink-secondary text-[9px] uppercase">{item.label}</div>
                      <div className="font-mono font-bold text-xs mt-1 text-status-alert">{item.data.depth} cm</div>
                      <div className="text-[9px] text-ink-secondary mt-0.5 truncate">{item.data.speed}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRIMARY CALLS TO ACTION (Fully Workable Action Dispatchers) */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleIssueAdvisory}
                className="w-full py-2.5 px-4 bg-purple text-white hover:bg-purple-deep rounded-xl text-xs font-bold flex items-center justify-between shadow-subtle transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Issue Targeted Ward Traffic Advisory</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openModal('vmsDiversion')}
                  className="py-2 px-3 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-purple" />
                  <span>Override VMS Sign</span>
                </button>
                <button
                  onClick={() => openModal('sitRep')}
                  className="py-2 px-3 bg-surface-secondary border border-border hover:border-purple/40 text-ink rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-purple" />
                  <span>Generate SitRep</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 20 OPERATIONAL FEATURE MODALS */}
      <HotspotPriorityMatrixModal
        isOpen={modals.hpiMatrix}
        onClose={() => closeModal('hpiMatrix')}
        hotspots={hotspotList}
        onSelectHotspot={handleSelectHotspot}
      />

      <TopographicSumpProfilerModal
        isOpen={modals.topoProfiler}
        onClose={() => closeModal('topoProfiler')}
        hotspot={currentHotspot}
      />

      <HydraulicCulvertTracerModal
        isOpen={modals.culvertTracer}
        onClose={() => closeModal('culvertTracer')}
        hotspot={currentHotspot}
      />

      <MobilePumpFleetModal
        isOpen={modals.mobilePump}
        onClose={() => closeModal('mobilePump')}
        hotspot={currentHotspot}
      />

      <RapidBarrierSimulatorModal
        isOpen={modals.barrierSim}
        onClose={() => closeModal('barrierSim')}
        hotspot={currentHotspot}
      />

      <VmsTrafficDiversionModal
        isOpen={modals.vmsDiversion}
        onClose={() => closeModal('vmsDiversion')}
        hotspot={currentHotspot}
      />

      <CctvAiVisionInspectorModal
        isOpen={modals.cctvVision}
        onClose={() => closeModal('cctvVision')}
        hotspot={currentHotspot}
      />

      <VulnerableAssetExposureModal
        isOpen={modals.vulnerableAssets}
        onClose={() => closeModal('vulnerableAssets')}
        hotspot={currentHotspot}
      />

      <CitizenSosClusterModal
        isOpen={modals.citizenSos}
        onClose={() => closeModal('citizenSos')}
        hotspot={currentHotspot}
      />

      <StressTestScenarioModal
        isOpen={modals.stressTest}
        onClose={() => closeModal('stressTest')}
        hotspot={currentHotspot}
      />

      <EvacuationRoutePathfinderModal
        isOpen={modals.evacuationRoute}
        onClose={() => closeModal('evacuationRoute')}
        hotspot={currentHotspot}
      />

      <HistoricalAnalogModal
        isOpen={modals.historicalAnalog}
        onClose={() => closeModal('historicalAnalog')}
        hotspot={currentHotspot}
      />

      <CellBroadcastDispatcherModal
        isOpen={modals.cellBroadcast}
        onClose={() => closeModal('cellBroadcast')}
        hotspot={currentHotspot}
      />

      <SiltDredgingRequisitionModal
        isOpen={modals.siltDredging}
        onClose={() => closeModal('siltDredging')}
        hotspot={currentHotspot}
      />

      <PowerGridTripSafeguardModal
        isOpen={modals.powerGridTrip}
        onClose={() => closeModal('powerGridTrip')}
        hotspot={currentHotspot}
      />

      <NdrfMobilizationModal
        isOpen={modals.ndrfMobilization}
        onClose={() => closeModal('ndrfMobilization')}
        hotspot={currentHotspot}
      />

      <CustomHotspotGeoprobeModal
        isOpen={modals.customGeoprobe}
        onClose={() => closeModal('customGeoprobe')}
        onAddHotspot={handleAddCustomHotspot}
      />

      <SitRepDossierModal
        isOpen={modals.sitRep}
        onClose={() => closeModal('sitRep')}
        hotspot={currentHotspot}
      />

      <AudioEvacuationSirenModal
        isOpen={modals.audioSiren}
        onClose={() => closeModal('audioSiren')}
        hotspot={currentHotspot}
      />

      <GisDataExportSuiteModal
        isOpen={modals.gisExport}
        onClose={() => closeModal('gisExport')}
        hotspot={currentHotspot}
        allHotspots={hotspotList}
      />
    </div>
  );
}
