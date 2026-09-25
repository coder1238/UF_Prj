import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFloodCommand } from '../context/FloodCommandContext';
import {
  ROAD_CORRIDORS,
  CRITICAL_ASSETS,
  DRAINAGE_NODES,
  RADAR_CELLS,
  CCTV_FEEDS,
  RESCUE_UNITS,
  PUMPING_STATIONS,
  TIDAL_STATION,
  DEM_CONTOURS_GEOJSON,
  BATHYMETRY_PROFILES,
  IOT_SENSORS_GRID,
  WARD_RISK_MATRIX,
  WARDS,
} from '../data/floodData';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';
import {
  Layers,
  MapPin,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  Send,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Crosshair,
  Ruler,
  Camera,
  Building2,
  Waves,
  Radio,
  Anchor,
  Gauge,
  LifeBuoy,
  Users,
  FileText,
  Volume2,
  VolumeX,
  Navigation,
  Route,
  RefreshCw,
  Download,
  Share2,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  Filter,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Info,
  Shield,
  Zap,
  Flame,
  Droplets,
  ArrowUpRight,
  Activity,
  Plus,
  Trash2,
} from 'lucide-react';

export default function LiveFloodMap() {
  const navigate = useNavigate();

  const {
    activeLayers,
    setActiveLayers,
    toggleLayer,
    setAllLayers,
    selectedRoad,
    setSelectedRoad,
    selectedNode,
    setSelectedNode,
    selectedAsset,
    setSelectedAsset,
    selectedWard,
    setSelectedWard,
    nowcastMinutes,
    setNowcastMinutes,
    dispatchIncident,
    setActiveModule,
    activeMapTool,
    setActiveMapTool,
    inspectedPoint,
    setInspectedPoint,
    rulerPoints,
    setRulerPoints,
    placedBarriers,
    addBarrier,
    removeBarrier,
    rescueFleet,
    dispatchRescueUnit,
    citizenReportsList,
    verifyCitizenReport,
    pumpingStationsList,
    boostPumpingStation,
    sluiceGatesList,
    toggleSluiceGate,
    activeSafeRoute,
    setActiveSafeRoute,
    scenarioParams,
    setScenarioParams,
    alertsList,
    publishAlert,
  } = useFloodCommand();

  // Mode: 'live' | 'forecast' | 'split'
  const [mapMode, setMapMode] = useState('forecast');
  const [toastMsg, setToastMsg] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);

  // Active Tool Drawer Modals
  const [activeDrawer, setActiveDrawer] = useState(null);
  // 'spotInspect' | 'ruler' | 'cctv' | 'infra' | 'drainage' | 'radar' | 'tidal' | 'pumps' |
  // 'rescue' | 'citizen' | 'whatif' | 'safeRoute' | 'barriers' | 'capBroadcast' | 'wardMatrix' |
  // 'bathymetry' | 'iotGrid' | 'sitrep'

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Synthetic Audio Siren Klaxon using Web Audio API
  const toggleSirenAudio = () => {
    if (!isSirenActive) {
      setIsSirenActive(true);
      showToast('AUDIBLE WARNING: Siren Klaxon Activated (110dB Acoustic Tone)');
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(640, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.6);
        osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setTimeout(() => {
          try {
            osc.stop();
            audioCtx.close();
          } catch (e) {}
          setIsSirenActive(false);
        }, 2400);
      } catch (err) {
        setTimeout(() => setIsSirenActive(false), 2000);
      }
    } else {
      setIsSirenActive(false);
    }
  };

  // Switch Map Mode
  const handleMapModeChange = (mode) => {
    setMapMode(mode);
    if (mode === 'live') {
      setNowcastMinutes(0);
      showToast('Mode set to REAL-TIME LIVE SENSOR STREAM (t=0)');
    } else if (mode === 'forecast') {
      showToast('Mode set to 0–3h HYDROLOGIC NOWCAST SIMULATION');
    } else if (mode === 'split') {
      showToast('SPLIT COMPARE: Synchronized Live (t=0) vs Peak Forecast (+60m)');
    }
  };

  // Calculate Ruler Measurement
  const rulerDistanceKm = useMemo(() => {
    if (rulerPoints.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < rulerPoints.length - 1; i++) {
      const [lon1, lat1] = rulerPoints[i];
      const [lon2, lat2] = rulerPoints[i + 1];
      // Haversine approx
      const dLat = (lat2 - lat1) * 111.32;
      const dLon = (lon2 - lon1) * 105.2;
      dist += Math.hypot(dLat, dLon);
    }
    return +dist.toFixed(2);
  }, [rulerPoints]);

  const rulerTransitTimeMin = useMemo(() => {
    if (rulerDistanceKm === 0) return 0;
    // Avg speed 24 km/h under flood friction
    return Math.round((rulerDistanceKm / 24) * 60);
  }, [rulerDistanceKm]);

  // Safe Emergency Routing Waypoints calculation
  const [routeFrom, setRouteFrom] = useState('hosp-sion');
  const [routeTo, setRouteTo] = useState('camp-andheri');

  const handleComputeSafeRoute = () => {
    // Generate route avoiding submerged lowlands
    const safeCoordinates = [
      [72.8601, 19.0365], // Sion Hospital
      [72.865, 19.042],
      [72.875, 19.055],   // Eastern Express Highway Safe Flyover
      [72.890, 19.085],
      [72.902, 19.110],   // JVLR Elevated Corridor
      [72.868, 19.118],
      [72.8468, 19.122],  // Andheri Relief Camp
    ];
    setActiveSafeRoute({
      origin: 'Sion Municipal General Hospital',
      destination: 'Andheri East Emergency Relief Camp',
      distanceKm: 11.4,
      transitMinutes: 18,
      clearancePercent: 100,
      coordinates: safeCoordinates,
    });
    showToast('Calculated Flood-Resilient Safe Corridor avoiding submerged subways');
  };

  // SITREP generator data
  const handleExportSITREP = () => {
    const sitrepData = {
      timestamp: '2026-09-22T18:35:00 IST',
      authority: 'Brihanmumbai Municipal Corporation // Disaster Management Cell',
      status: 'HIGH ALERT - LEVEL 3',
      rainfallIntensity: `${scenarioParams.rainfallIntensity} mm/hr (IMD Doppler Validated)`,
      astronomicalTide: `${TIDAL_STATION.currentTideLevelM}m MSL (${TIDAL_STATION.tidalLockStatus})`,
      criticalRoadClosures: ROAD_CORRIDORS.filter((r) => r.status === 'CRITICAL').map((r) => r.name),
      hospitalStatus: CRITICAL_ASSETS.filter((a) => a.type.includes('Hospital')).map((h) => ({
        name: h.name,
        exposure: h.exposure,
        accessibility: `${h.accessibility}%`,
      })),
      pumpsDischargeTotal: '149,500 m³/hr across 5 stations',
      ndrfUnitsActive: rescueFleet.map((r) => `${r.name}: ${r.status}`),
      citizenReportsVerified: citizenReportsList.filter((c) => c.status.includes('VERIFIED')).length,
    };

    const blob = new Blob([JSON.stringify(sitrepData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BMC_SITREP_${Date.now()}.json`;
    a.click();
    showToast('Situation Report (SITREP) Exported Successfully');
  };

  // GIS Layer Catalog grouped by domain
  const LAYER_GROUPS = [
    {
      id: 'hydrology',
      name: 'Hydrology & Inundation',
      items: [
        { key: 'floodDepth', label: 'Flood Inundation (2D SWE)', desc: 'Surface depth field grid', color: '#6D4AFF', icon: Droplets },
        { key: 'predictedFlood', label: 'Forecast Spread (+60m)', desc: 'Peak hydrologic inundation', color: '#8B5CF6', icon: TrendingUp },
        { key: 'radar', label: 'Doppler Radar Storm Cells', desc: 'IMD S-Band reflectivity (dBZ)', color: '#E11D48', icon: Radio },
        { key: 'surfaceFlow', label: 'Mithi River Flow & Runoff', desc: 'Flow velocity vectors', color: '#2563EB', icon: Waves },
        { key: 'dem', label: 'Topography 2m Contours', desc: 'LiDAR bare-earth terrain', color: '#10B981', icon: Activity },
      ],
    },
    {
      id: 'drainage',
      name: 'Drainage & Roads Network',
      items: [
        { key: 'roads', label: 'Road Network Submergence', desc: 'Passability and clearances', color: '#C58A25', icon: Route },
        { key: 'drainage', label: 'SWMM Drainage Nodes', desc: 'Manholes & surcharging sumps', color: '#D94A4A', icon: GitBranch },
      ],
    },
    {
      id: 'operations',
      name: 'Emergency Assets & Response',
      items: [
        { key: 'infrastructure', label: 'Critical Assets & Hospitals', desc: 'Trauma hospitals & substations', color: '#DC2626', icon: Building2 },
        { key: 'cctv', label: 'CCTV Surveillance Feeds', desc: 'AI visual depth cameras', color: '#0284C7', icon: Camera },
        { key: 'citizenReports', label: 'Citizen Crowdsourced Pins', desc: 'Geocoded waterlogging queue', color: '#EA580C', icon: Users },
        { key: 'rescueUnits', label: 'NDRF Rescue Boats & Trucks', desc: 'Deployed rapid vessels', color: '#059669', icon: LifeBuoy },
        { key: 'sandbags', label: 'Placed Sandbags & Dikes', desc: 'Defensive flood barriers', color: '#F59E0B', icon: Shield },
      ],
    },
  ];

  // Flat list for quick lookups
  const ALL_LAYERS = useMemo(() => LAYER_GROUPS.flatMap((g) => g.items), []);
  const totalLayersCount = ALL_LAYERS.length;
  const activeLayersCount = Object.values(activeLayers).filter(Boolean).length;

  // Floating Layer Panel State
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(true);
  const [layerSearchQuery, setLayerSearchQuery] = useState('');

  // GIS Tools Selection Bar State
  const [toolsCategory, setToolsCategory] = useState('all'); // 'all' | 'survey' | 'interventions' | 'surveillance' | 'response'

  // Operational Tools Catalog
  const GIS_TOOLS = [
    {
      id: 'spotInspect',
      category: 'survey',
      name: 'Spot Inspector',
      icon: Crosshair,
      isMapTool: true,
      mapToolKey: 'inspect',
      badge: 'Query',
      desc: 'Inspect DEM elevation & SWE water depth',
    },
    {
      id: 'ruler',
      category: 'survey',
      name: 'Distance Ruler',
      icon: Ruler,
      isMapTool: true,
      mapToolKey: 'ruler',
      badge: `${rulerDistanceKm > 0 ? rulerDistanceKm + 'km' : 'Measure'}`,
      desc: 'Measure distance & transit time',
    },
    {
      id: 'bathymetry',
      category: 'survey',
      name: 'Bathymetry Profile',
      icon: Activity,
      desc: 'Mithi River channel depth & freeboard',
    },
    {
      id: 'barriers',
      category: 'interventions',
      name: 'Place Barrier',
      icon: Shield,
      isMapTool: true,
      mapToolKey: 'barrier',
      badge: `${placedBarriers.length} Dikes`,
      desc: 'Drop virtual sandbags & calculate mitigation',
    },
    {
      id: 'safeRoute',
      category: 'interventions',
      name: 'Safe Path Finder',
      icon: Route,
      badge: 'Routing',
      desc: 'Compute flood-avoidance transit route',
    },
    {
      id: 'pumps',
      category: 'interventions',
      name: 'Pump Stations',
      icon: Gauge,
      badge: '5 Stations',
      desc: 'Live telemetry & emergency 115% boost',
    },
    {
      id: 'tidal',
      category: 'interventions',
      name: 'Tidal Sluice Gates',
      icon: Waves,
      badge: `${TIDAL_STATION.currentTideLevelM}m`,
      desc: 'Arabian Sea tide curve & outfall gates',
    },
    {
      id: 'cctv',
      category: 'surveillance',
      name: 'CCTV AI Vision',
      icon: Camera,
      badge: 'LIVE',
      desc: 'Camera feeds with YOLO depth detection',
    },
    {
      id: 'infra',
      category: 'surveillance',
      name: 'Critical Assets',
      icon: Building2,
      badge: 'Hospitals',
      desc: 'Hospital ICU & substation exposure status',
    },
    {
      id: 'radar',
      category: 'surveillance',
      name: 'Doppler Radar',
      icon: Radio,
      badge: 'dBZ Loop',
      desc: 'IMD convective storm cell tracking',
    },
    {
      id: 'iotGrid',
      category: 'surveillance',
      name: 'IoT Gauges Grid',
      icon: Zap,
      badge: '48 Nodes',
      desc: 'Ultrasonic sensor telemetry & battery levels',
    },
    {
      id: 'rescue',
      category: 'response',
      name: 'NDRF Rescue Fleet',
      icon: LifeBuoy,
      badge: 'Active',
      desc: 'Boats & suction rigs deployment',
    },
    {
      id: 'citizen',
      category: 'response',
      name: 'Citizen Reports',
      icon: Users,
      badge: `${citizenReportsList.length}`,
      desc: 'Crowdsourced waterlogging queue',
    },
    {
      id: 'wardMatrix',
      category: 'response',
      name: 'Ward Vulnerability',
      icon: AlertTriangle,
      badge: 'Rank',
      desc: 'Ward risk scores & relief shelters',
    },
    {
      id: 'whatif',
      category: 'response',
      name: 'What-If Stress Lab',
      icon: Sliders,
      badge: 'Simulate',
      desc: 'Compound cloudburst & surge sliders',
    },
    {
      id: 'capBroadcast',
      category: 'response',
      name: 'CAP Siren Alert',
      icon: ShieldAlert,
      badge: 'Broadcast',
      highlight: 'alert',
      desc: 'Transmit emergency warning & sirens',
    },
    {
      id: 'sitrep',
      category: 'response',
      name: 'SITREP Report',
      icon: FileText,
      badge: 'Export',
      highlight: 'dark',
      desc: 'Generate BMC Situation Report dossier',
    },
  ];

  const filteredTools = useMemo(() => {
    if (toolsCategory === 'all') return GIS_TOOLS;
    return GIS_TOOLS.filter((t) => t.category === toolsCategory);
  }, [toolsCategory, rulerDistanceKm, placedBarriers.length, citizenReportsList.length]);

  return (
    <div
      className={`p-4 md:p-5 flex flex-col gap-4 overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-canvas p-4 max-h-screen'
          : 'max-h-[calc(100vh-64px)]'
      }`}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
                Live Geospatial Flood Intelligence &amp; Digital Twin
              </h2>
              <span className="text-[10px] font-mono bg-status-alert-soft text-status-alert px-2 py-0.5 rounded-full font-bold">
                MUMBAI BASIN
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              Hydrodynamic 2D SWE Inundation, Surcharging Drainage Nodes &amp; Real-time Command
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Fullscreen + Siren */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ward Quick Selector */}
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 text-purple absolute left-2.5 pointer-events-none" />
            <select
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
                showToast(`Focused map on ${WARDS.find((w) => w.id === e.target.value)?.name || 'Mumbai'}`);
              }}
              className="pl-8 pr-8 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-ink focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all appearance-none cursor-pointer shadow-subtle"
            >
              {WARDS.map((w) => (
                <option key={w.id} value={w.id} className="bg-surface text-ink py-1">
                  [{w.code}] {w.shortName || w.name.split(' (')[0]} ({w.activeRisk})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-secondary absolute right-2.5 pointer-events-none" />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-surface-secondary p-0.5 rounded-lg border border-border text-xs font-semibold">
            <button
              onClick={() => handleMapModeChange('live')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapMode === 'live'
                  ? 'bg-surface text-purple shadow-sm font-bold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Live Current
            </button>
            <button
              onClick={() => handleMapModeChange('forecast')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapMode === 'forecast'
                  ? 'bg-surface text-purple shadow-sm font-bold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              0–3h Nowcast
            </button>
            <button
              onClick={() => handleMapModeChange('split')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapMode === 'split'
                  ? 'bg-purple text-white shadow-sm font-bold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Split Compare
            </button>
          </div>

          {/* Audible Siren Alert Toggle */}
          <button
            onClick={toggleSirenAudio}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSirenActive
                ? 'bg-status-alert text-white border-status-alert animate-bounce'
                : 'bg-surface-secondary text-ink border-border hover:bg-surface'
            }`}
            title="Acoustic Emergency Siren Sounder"
          >
            {isSirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Siren Test</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-surface-secondary border border-border text-ink hover:bg-surface transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Tactical Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Upgraded GIS Tools Selection Bar */}
      <div className="bg-surface border border-border rounded-xl p-2.5 shadow-subtle flex flex-col gap-2 select-none">
        {/* Category Filter Pills & Active Tool HUD */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full text-xs font-semibold">
            {[
              { id: 'all', label: 'All Tools', count: 17 },
              { id: 'survey', label: 'Survey & Measure', count: 3 },
              { id: 'interventions', label: 'Interventions & Routing', count: 4 },
              { id: 'surveillance', label: 'Feeds & Sensors', count: 4 },
              { id: 'response', label: 'Emergency Ops', count: 6 },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setToolsCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  toolsCategory === cat.id
                    ? 'bg-purple text-white shadow-xs font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    toolsCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-secondary text-ink-muted'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Active Canvas Tool Indicator Banner */}
          {activeMapTool !== 'none' && (
            <div className="flex items-center gap-2 bg-purple-soft border border-purple/30 text-purple px-2.5 py-1 rounded-lg text-xs font-mono font-bold animate-pulse">
              <Crosshair className="w-3.5 h-3.5" />
              <span>ACTIVE TOOL: {activeMapTool.toUpperCase()} (CLICK ON MAP)</span>
              <button
                onClick={() => setActiveMapTool('none')}
                className="ml-1 text-[10px] bg-purple text-white px-1.5 py-0.5 rounded hover:bg-purple-deep transition-colors"
                title="Cancel Tool"
              >
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Tools Grid / Horizontal Chips Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isMapActive = tool.isMapTool && activeMapTool === tool.mapToolKey;
            const isDrawerActive = activeDrawer === tool.id;
            const isHighlighted = isMapActive || isDrawerActive;

            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.isMapTool) {
                    const next = activeMapTool === tool.mapToolKey ? 'none' : tool.mapToolKey;
                    setActiveMapTool(next);
                    if (next !== 'none') {
                      setActiveDrawer(tool.id);
                      showToast(`${tool.name} Activated: Click on map to interact`);
                    }
                  } else {
                    setActiveDrawer(activeDrawer === tool.id ? null : tool.id);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 border shadow-2xs group ${
                  tool.highlight === 'alert'
                    ? 'bg-status-alert text-white border-status-alert hover:bg-red-700'
                    : tool.highlight === 'dark'
                    ? 'bg-ink text-white border-ink hover:bg-black'
                    : isHighlighted
                    ? 'bg-purple text-white border-purple shadow-sm ring-1 ring-purple/40'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/40 hover:bg-surface'
                }`}
                title={tool.desc}
              >
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isHighlighted ? 'text-white' : 'text-purple'
                  }`}
                />
                <span className="truncate max-w-[130px]">{tool.name}</span>
                {tool.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isHighlighted
                        ? 'bg-white/25 text-white'
                        : tool.highlight === 'alert'
                        ? 'bg-white/20 text-white'
                        : 'bg-surface text-ink-secondary border border-border/80'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Workspace (or Split-Screen Compare Mode) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Dominant Map Area (8 cols in single, 12 cols in split) */}
        <div className={mapMode === 'split' ? 'xl:col-span-12 flex flex-col gap-3' : 'xl:col-span-8 flex flex-col gap-3'}>
          {mapMode === 'split' ? (
            /* Split Compare Mode: Two Synchronized Maps side-by-side */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 relative">
              {/* Left: Live Current (t=0) */}
              <div className="flex flex-col gap-1.5">
                <div className="bg-surface px-3 py-1.5 rounded-lg border border-border flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-status-safe" />
                    LIVE CURRENT (18:30 IST)
                  </span>
                  <span className="text-ink-secondary text-[11px]">Tide: 4.25m | Rain: 80 mm/h</span>
                </div>
                <InteractiveMapTwin
                  height="520px"
                  showLayerToggle={false}
                  splitMode={true}
                  splitSide="live"
                  onSelectRoad={setSelectedRoad}
                  onSelectNode={setSelectedNode}
                  onSelectAsset={setSelectedAsset}
                />
              </div>

              {/* Right: Peak Nowcast (+60m) */}
              <div className="flex flex-col gap-1.5">
                <div className="bg-surface px-3 py-1.5 rounded-lg border border-status-alert/30 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-status-alert flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-status-alert animate-ping" />
                    PEAK FORECAST (+60m / 19:30 IST)
                  </span>
                  <span className="text-status-alert text-[11px] font-bold">Delta Depth: +24 cm</span>
                </div>
                <InteractiveMapTwin
                  height="520px"
                  showLayerToggle={false}
                  splitMode={true}
                  splitSide="peak"
                  onSelectRoad={setSelectedRoad}
                  onSelectNode={setSelectedNode}
                  onSelectAsset={setSelectedAsset}
                />
              </div>
            </div>
          ) : (
            /* Standard Single View */
            <div className="relative">
              <InteractiveMapTwin
                height="560px"
                showLayerToggle={false}
                onSelectRoad={setSelectedRoad}
                onSelectNode={setSelectedNode}
                onSelectAsset={setSelectedAsset}
                onSelectCCTV={() => setActiveDrawer('cctv')}
                onSelectRescue={() => setActiveDrawer('rescue')}
                onSelectCitizenReport={() => setActiveDrawer('citizen')}
              />

              {/* Upgraded Floating GIS Layer Selection Bar */}
              <div className="absolute top-14 left-3 z-30 select-none">
                {!isLayersPanelOpen ? (
                  /* Collapsed Floating Pill */
                  <button
                    onClick={() => setIsLayersPanelOpen(true)}
                    className="px-3 py-2 rounded-xl bg-surface/95 backdrop-blur-md border border-border hover:border-purple text-ink shadow-elevated flex items-center gap-2 text-xs font-semibold transition-all hover:scale-102 group"
                    title="Expand GIS Layers Catalog"
                  >
                    <Layers className="w-4 h-4 text-purple group-hover:rotate-12 transition-transform" />
                    <span>GIS Layers</span>
                    <span className="font-mono text-[10px] bg-purple-soft text-purple px-1.5 py-0.5 rounded-full font-bold">
                      {activeLayersCount}/{totalLayersCount}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-secondary" />
                  </button>
                ) : (
                  /* Expanded Floating GIS Layer Catalog Panel */
                  <div className="w-72 bg-surface/98 backdrop-blur-md border border-border rounded-2xl shadow-elevated p-3 flex flex-col gap-2.5 animate-in fade-in zoom-in-95">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-soft text-purple flex items-center justify-center">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-ink leading-tight">GIS Layers</h4>
                          <span className="text-[10px] font-mono text-purple font-semibold">
                            {activeLayersCount}/{totalLayersCount} Layers Active
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAllLayers(true)}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-secondary hover:bg-purple-soft text-ink hover:text-purple border border-border transition-colors"
                          title="Enable All Layers"
                        >
                          All
                        </button>
                        <button
                          onClick={() => setAllLayers(false)}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-secondary hover:bg-surface text-ink-secondary hover:text-status-alert border border-border transition-colors"
                          title="Disable All Layers"
                        >
                          None
                        </button>
                        <button
                          onClick={() => setIsLayersPanelOpen(false)}
                          className="p-1 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors ml-0.5"
                          title="Collapse GIS Layers Panel"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Filter Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={layerSearchQuery}
                        onChange={(e) => setLayerSearchQuery(e.target.value)}
                        placeholder="Filter map layers..."
                        className="w-full bg-surface-secondary text-ink text-[11px] pl-7 pr-2.5 py-1.5 rounded-lg border border-border focus:outline-none focus:border-purple font-sans placeholder:text-ink-muted"
                      />
                      {layerSearchQuery && (
                        <button
                          onClick={() => setLayerSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Grouped Layer Rows */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {LAYER_GROUPS.map((group) => {
                        const filteredItems = group.items.filter(
                          (item) =>
                            item.label.toLowerCase().includes(layerSearchQuery.toLowerCase()) ||
                            item.desc.toLowerCase().includes(layerSearchQuery.toLowerCase())
                        );
                        if (filteredItems.length === 0) return null;

                        return (
                          <div key={group.id} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-ink-muted px-1">
                              <span>{group.name}</span>
                              <span>
                                {filteredItems.filter((i) => activeLayers[i.key]).length}/{filteredItems.length}
                              </span>
                            </div>

                            <div className="space-y-0.5">
                              {filteredItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = !!activeLayers[item.key];

                                return (
                                  <div
                                    key={item.key}
                                    onClick={() => toggleLayer(item.key)}
                                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                                      isActive
                                        ? 'bg-surface-secondary/80 hover:bg-surface-secondary text-ink'
                                        : 'opacity-55 hover:opacity-90 hover:bg-surface-secondary/40 text-ink-secondary'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 pr-1">
                                      <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                      />
                                      <Icon className="w-3.5 h-3.5 flex-shrink-0 text-ink-secondary" />
                                      <span className="text-[11px] font-semibold truncate leading-tight">
                                        {item.label}
                                      </span>
                                    </div>

                                    {/* Toggle Pill */}
                                    <div
                                      className={`w-7 h-4 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                                        isActive ? 'bg-purple' : 'bg-gray-300'
                                      }`}
                                    >
                                      <div
                                        className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                                          isActive ? 'left-3.5' : 'left-0.5'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Scrubber */}
          <TimelineScrubber />
        </div>

        {/* Right Floating Analytical Road Inspector (4 cols in single, collapsed underneath in split) */}
        <div className={mapMode === 'split' ? 'xl:col-span-12 flex flex-col gap-3' : 'xl:col-span-4 flex flex-col gap-3'}>
          {/* Quick Road Corridor Selector */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Select Monitored Road Corridor
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {ROAD_CORRIDORS.map((road) => (
                <button
                  key={road.id}
                  onClick={() => setSelectedRoad(road)}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold truncate border transition-colors ${
                    selectedRoad?.id === road.id
                      ? 'bg-purple-soft text-purple border-purple/40 font-bold'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  {road.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Road Segment Dossier */}
          {selectedRoad && (
            <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3.5">
              <div className="flex items-start justify-between border-b border-border pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-purple font-bold px-1.5 py-0.5 rounded bg-purple-soft">
                      {selectedRoad.ward}
                    </span>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      MSL: {selectedRoad.elevation}m
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink mt-1 leading-tight">
                    {selectedRoad.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedRoad.status === 'CRITICAL'
                      ? 'bg-status-alert-soft text-status-alert'
                      : 'bg-status-warning-soft text-status-warning'
                  }`}
                >
                  {selectedRoad.status}
                </span>
              </div>

              {/* Depth Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <div className="text-[10px] text-ink-secondary font-medium uppercase">Current Depth</div>
                  <div className="mt-1">
                    <span className="font-mono text-2xl font-bold text-ink">
                      {Math.round(selectedRoad.currentDepth * (nowcastMinutes === 0 ? 1 : 1 + (nowcastMinutes / 60) * 0.8))}
                    </span>
                    <span className="text-xs font-mono text-ink-secondary ml-1">cm</span>
                  </div>
                  <div className="text-[10px] text-ink-secondary mt-0.5">
                    Velocity: {selectedRoad.waterVelocity}
                  </div>
                </div>

                <div className="bg-status-alert-soft/50 border border-status-alert/20 rounded-lg p-2.5">
                  <div className="text-[10px] text-status-alert font-medium uppercase">Forecast Peak</div>
                  <div className="mt-1">
                    <span className="font-mono text-2xl font-bold text-status-alert">
                      {selectedRoad.forecastPeak}
                    </span>
                    <span className="text-xs font-mono text-status-alert ml-1">cm</span>
                  </div>
                  <div className="text-[10px] text-status-alert mt-0.5 font-mono">
                    Peak: {selectedRoad.peakTime}
                  </div>
                </div>
              </div>

              {/* Hydrograph Chart */}
              <div className="bg-surface-secondary border border-border rounded-lg p-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-ink mb-2">
                  <span>Hydrograph: Water Depth vs Time</span>
                  <span className="text-[10px] font-mono text-status-alert font-bold">CRITICAL &gt; 30cm</span>
                </div>

                <div className="w-full h-24 relative">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="35" x2="300" y2="35" stroke="#D94A4A" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="5" y="32" fill="#D94A4A" className="text-[8px] font-mono font-bold">
                      30cm IMPASSABLE
                    </text>
                    <polygon
                      points={`0,100 ${selectedRoad.history
                        .map((pt, i) => `${(i / (selectedRoad.history.length - 1)) * 300},${100 - pt.depth * 1.8}`)
                        .join(' ')} 300,100`}
                      fill="#EDE8FF"
                      opacity="0.8"
                    />
                    <polyline
                      fill="none"
                      stroke="#6D4AFF"
                      strokeWidth="2.5"
                      points={selectedRoad.history
                        .map((pt, i) => `${(i / (selectedRoad.history.length - 1)) * 300},${100 - pt.depth * 1.8}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>

              {/* Causal Diagnostics */}
              <div className="p-2.5 rounded-lg bg-surface border border-border text-xs">
                <span className="font-bold text-ink text-[11px] block">Causal Mechanism:</span>
                <p className="text-ink-secondary text-[11px] mt-0.5 leading-relaxed">
                  {selectedRoad.cause}
                </p>
                <div className="text-[10px] font-mono text-status-warning mt-1">
                  Traffic State: {selectedRoad.trafficStatus}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    dispatchIncident(
                      'INC-2041',
                      `Traffic Divert & Barricade placed on ${selectedRoad.name}`
                    );
                    addBarrier({
                      id: `bar-road-${Date.now()}`,
                      name: `Barricade on ${selectedRoad.name}`,
                      coordinates: [selectedRoad.coordinates[1], selectedRoad.coordinates[0]],
                      heightCm: 75,
                      mitigationDeltaCm: -22,
                      deployedAt: 'Just now',
                      type: 'Hydraulic Divert Barricades',
                    });
                    showToast(`Dispatched barricade orders & placed dikes on ${selectedRoad.name}`);
                  }}
                  className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-between shadow-subtle transition-colors"
                >
                  <span>Deploy Barricades &amp; Diversion</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setActiveModule('04-drainage');
                    navigate('/drainage');
                  }}
                  className="w-full py-1.5 px-3 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Inspect Surcharging Drainage Graph</span>
                  <GitBranch className="w-3.5 h-3.5 text-purple" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 20 DETAILED FEATURE DRAWERS & INTERACTIVE MODALS                           */}
      {/* ========================================================================= */}

      {/* Feature 2: Spot Depth & Elevation Inspector Card */}
      {activeDrawer === 'spotInspect' && inspectedPoint && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-[min(20rem,calc(100vw-1.5rem))] sm:w-80 bg-surface border border-border rounded-xl shadow-elevated p-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
            <span className="text-xs font-bold text-ink uppercase flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-purple" />
              Spot Hydraulic Inspector
            </span>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-ink-secondary">Coordinates:</span>
              <span className="font-mono font-bold text-ink">{inspectedPoint.lat}°N, {inspectedPoint.lng}°E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-ink-secondary">DEM Elevation:</span>
              <span className="font-mono font-bold text-ink">{inspectedPoint.elevation} m MSL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-ink-secondary">Simulated Depth:</span>
              <span className={`font-mono font-bold ${inspectedPoint.depth > 30 ? 'text-status-alert' : 'text-purple'}`}>
                {inspectedPoint.depth} cm ({inspectedPoint.hazardLevel})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-ink-secondary">Flow Velocity:</span>
              <span className="font-mono text-ink">{inspectedPoint.velocity}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-ink-secondary">Soil Saturation:</span>
              <span className="font-mono text-ink">{inspectedPoint.soilSat}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Recession Time:</span>
              <span className="font-mono text-ink">{inspectedPoint.clearanceTime}</span>
            </div>
          </div>
          <button
            onClick={() => {
              addBarrier({
                id: `bar-${Date.now()}`,
                name: 'Field Placed Sandbag Dike',
                coordinates: [inspectedPoint.lng, inspectedPoint.lat],
                heightCm: 60,
                mitigationDeltaCm: -18,
                deployedAt: 'Just now',
                type: 'Rapid Dike',
              });
              showToast('Placed Sandbag Barrier at inspected coordinates');
            }}
            className="w-full mt-3 py-1.5 bg-purple text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-subtle hover:bg-purple-deep"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Drop Barrier Here</span>
          </button>
        </div>
      )}

      {/* Feature 3: Distance & Emergency Transit Ruler */}
      {activeDrawer === 'ruler' && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-[min(20rem,calc(100vw-1.5rem))] sm:w-80 bg-surface border border-border rounded-xl shadow-elevated p-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
            <span className="text-xs font-bold text-ink uppercase flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-purple" />
              Emergency Distance Ruler
            </span>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-ink-secondary mb-3">
            Click points sequentially on the map to measure transit vector and evacuation times.
          </p>
          <div className="bg-surface-secondary p-3 rounded-lg border border-border space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Path Distance:</span>
              <span className="font-bold text-purple text-sm">{rulerDistanceKm} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Points Clicked:</span>
              <span className="font-bold text-ink">{rulerPoints.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Est. Transit (Ambulance):</span>
              <span className="font-bold text-status-warning">{rulerTransitTimeMin} min</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setRulerPoints([]);
                showToast('Cleared ruler measurement');
              }}
              className="flex-1 py-1.5 bg-surface text-ink text-xs font-semibold border border-border rounded-lg hover:bg-surface-secondary"
            >
              Reset Points
            </button>
            <button
              onClick={() => setActiveDrawer(null)}
              className="flex-1 py-1.5 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Feature 4: Live CCTV Visual AI Feeds Drawer */}
      {activeDrawer === 'cctv' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-sm text-ink uppercase">Live CCTV Visual AI Feeds</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {CCTV_FEEDS.map((feed) => (
              <div key={feed.id} className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink">{feed.name}</span>
                  <span className="text-[10px] font-mono bg-status-alert-soft text-status-alert px-1.5 py-0.5 rounded font-bold">
                    {feed.status}
                  </span>
                </div>

                {/* Simulated Camera Video Viewport */}
                <div className="w-full h-36 bg-gray-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-800">
                  <div className="absolute inset-0 bg-blue-900/20" />
                  {/* Artificial Water Ripple */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-blue-500/30 backdrop-blur-xs border-t border-blue-400/40 animate-pulse flex items-center justify-center">
                    <span className="font-mono text-xs text-white bg-black/60 px-2 py-0.5 rounded">
                      YOLO Water Level: {feed.detectedDepth} cm ({feed.confidence}% Conf)
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 font-mono text-[9px] text-green-400 bg-black/70 px-1.5 py-0.5 rounded">
                    REC ● 1080p 30fps
                  </div>
                  <div className="absolute top-2 right-2 font-mono text-[9px] text-white bg-black/70 px-1.5 py-0.5 rounded">
                    {feed.ward}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-secondary">
                  <span>Vehicles Detected: <strong className="text-ink">{feed.vehiclesDetected}</strong></span>
                  <span>Flow: <strong className="text-status-alert">{feed.flowStatus}</strong></span>
                </div>

                <button
                  onClick={() => {
                    showToast(`Dispatched barricade squad to ${feed.name}`);
                  }}
                  className="w-full py-1.5 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-colors shadow-subtle"
                >
                  Confirm Automated Barricade
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 5: Critical Infrastructure Impact Drawer */}
      {activeDrawer === 'infra' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-sm text-ink uppercase">Critical Infrastructure Impact</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {CRITICAL_ASSETS.map((asset) => (
              <div key={asset.id} className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-purple font-bold px-1.5 py-0.5 rounded bg-purple-soft">
                      {asset.ward}
                    </span>
                    <h4 className="font-bold text-xs text-ink mt-1">{asset.name}</h4>
                    <span className="text-[11px] text-ink-secondary">{asset.type}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    asset.exposure === 'Critical' ? 'bg-status-alert-soft text-status-alert' : 'bg-status-warning-soft text-status-warning'
                  }`}>
                    {asset.exposure} ({asset.predictedDepth}cm)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-ink-secondary block">Accessibility</span>
                    <span className="font-bold text-ink text-sm">{asset.accessibility}%</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-ink-secondary block">Safe Ingress</span>
                    <span className="font-bold text-ink">{asset.nearestSafeRoute}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedAsset(asset);
                    showToast(`Dispatched emergency flood barrier squad to ${asset.name}`);
                  }}
                  className="w-full mt-1 py-1.5 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-colors shadow-subtle"
                >
                  Deploy Emergency Defenses
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 7: Doppler Radar Tracker Drawer */}
      {activeDrawer === 'radar' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(440px,80vw)] lg:w-[440px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm text-ink uppercase">IMD Doppler Radar Interceptor</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary border border-border text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Radar Sensor:</span>
              <span className="font-bold text-ink">IMD Colaba (S-Band Dual-Pol)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Scan Elevation:</span>
              <span className="font-mono text-ink">0.5° Beam Tilt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Latest Sweep:</span>
              <span className="font-mono text-status-safe">18:31:02 IST (Synced)</span>
            </div>
          </div>

          <h4 className="font-bold text-xs text-ink uppercase font-mono mt-1">Tracked Convective Cells</h4>
          <div className="space-y-3">
            {RADAR_CELLS.map((cell) => (
              <div key={cell.id} className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-ink">{cell.name}</span>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {cell.dbz} dBZ
                  </span>
                </div>
                <div className="flex justify-between text-xs text-ink-secondary">
                  <span>Rain Rate: <strong className="text-ink">{cell.intensity}</strong></span>
                  <span>Motion: <strong className="text-ink">{cell.velocity}</strong></span>
                </div>
                <div className="text-[11px] font-mono text-purple">
                  ETA over Kurla Basin: <strong>~12 mins</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 8: Tidal Hydrograph & Sluice Gate Control HUD */}
      {activeDrawer === 'tidal' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm text-ink uppercase">Tidal Hydrograph &amp; Sluice Gates</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Tide Gauge Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-indigo-900">
              <span>ARABIAN SEA TIDE LEVEL</span>
              <span className="bg-status-alert text-white px-2 py-0.5 rounded text-[10px]">
                {TIDAL_STATION.tidalLockStatus}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-mono font-bold text-indigo-950">
                {TIDAL_STATION.currentTideLevelM}
              </span>
              <span className="text-sm font-mono text-indigo-800">m MSL</span>
              <span className="text-xs text-status-alert font-mono ml-auto">
                PEAK {TIDAL_STATION.peakTideLevelM}m @ {TIDAL_STATION.peakTime}
              </span>
            </div>
            <div className="text-[11px] text-indigo-800">
              Storm Surge Anomaly: <strong>+{TIDAL_STATION.surgeAnomalyCm} cm</strong> over astronomical prediction.
            </div>
          </div>

          <h4 className="font-bold text-xs text-ink uppercase font-mono mt-1">Outfall Flap Gates &amp; Sluices</h4>
          <div className="space-y-3">
            {sluiceGatesList.map((gate) => (
              <div key={gate.id} className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-ink">{gate.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    gate.status.includes('OPEN') ? 'bg-status-safe-soft text-status-safe' : 'bg-status-alert-soft text-status-alert'
                  }`}>
                    {gate.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink-secondary">
                  <span>Flap Angle: <strong>{gate.flapAngleDeg}°</strong></span>
                  <span>Head Diff: <strong>{gate.headDifferentialM}m</strong></span>
                </div>
                <button
                  onClick={() => {
                    toggleSluiceGate(gate.id);
                    showToast(`Toggled manual override on ${gate.name}`);
                  }}
                  className="w-full mt-1 py-1.5 bg-surface border border-border text-ink hover:border-purple text-xs font-semibold rounded-lg transition-colors"
                >
                  Manual Hydraulic Override Toggle
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 9: Stormwater Pumping Stations Booster Console */}
      {activeDrawer === 'pumps' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-sm text-ink uppercase">Stormwater Pumping Stations</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {pumpingStationsList.map((st) => (
              <div key={st.id} className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-ink">{st.name}</h4>
                    <span className="text-[11px] text-ink-secondary">{st.ward}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    st.status.includes('BOOST') ? 'bg-purple text-white animate-pulse' : 'bg-status-safe-soft text-status-safe'
                  }`}>
                    {st.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono mt-1">
                  <div className="bg-surface p-1.5 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">Pumps</span>
                    <span className="font-bold text-ink">{st.pumpsRunning}/{st.totalPumps}</span>
                  </div>
                  <div className="bg-surface p-1.5 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">RPM</span>
                    <span className="font-bold text-ink">{st.currentRPM}</span>
                  </div>
                  <div className="bg-surface p-1.5 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">Fuel</span>
                    <span className="font-bold text-ink">{st.fuelBufferHours}h</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-purple font-semibold">
                  Discharge: {st.dischargeRate}
                </div>

                <button
                  onClick={() => {
                    boostPumpingStation(st.id);
                    showToast(`Boosted ${st.name} to Emergency Overdrive (+6,000 m³/hr)`);
                  }}
                  className="w-full mt-1 py-1.5 bg-cyan-700 text-white text-xs font-semibold rounded-lg hover:bg-cyan-800 transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Engage Emergency Boost (115%)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 10: NDRF Rescue Fleet Dispatcher Drawer */}
      {activeDrawer === 'rescue' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-ink uppercase">NDRF &amp; Emergency Rescue Fleet</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {rescueFleet.map((unit) => (
              <div key={unit.id} className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-ink">{unit.name}</h4>
                    <span className="text-[11px] text-ink-secondary">{unit.team} ({unit.assignedWard})</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {unit.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono mt-1">
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">Crew</span>
                    <span className="font-bold text-ink">{unit.crew} Pax</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">Capacity</span>
                    <span className="font-bold text-ink">{unit.capacity}</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-ink-secondary block">Battery/Fuel</span>
                    <span className="font-bold text-ink">{unit.batteryFuel}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {unit.equipment.map((eq, i) => (
                    <span key={i} className="text-[9px] font-mono bg-surface px-1.5 py-0.5 rounded border border-border text-ink-secondary">
                      {eq}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    dispatchRescueUnit(unit.id, 'Sion Circle Basin', 'Emergency Evacuation & Sump Clearance');
                    showToast(`Dispatched ${unit.name} to Sion Circle Basin`);
                  }}
                  className="w-full mt-1 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Re-route to Sion / Kurla Sump</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 11: Citizen Crowdsourced Reports Verification Queue */}
      {activeDrawer === 'citizen' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-sm text-ink uppercase">Citizen Reports Queue</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {citizenReportsList.map((rep) => (
              <div key={rep.id} className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-ink">{rep.location}</span>
                    <span className="text-[11px] text-ink-secondary block">Reported by {rep.user} @ {rep.timestamp}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                    Depth: {rep.reportedDepth}
                  </span>
                </div>

                <p className="text-xs text-ink bg-surface p-2 rounded border border-border italic">
                  "{rep.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-purple">
                  <span>Status: <strong>{rep.status}</strong></span>
                  <span>Votes: <strong>+{rep.votes}</strong></span>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      verifyCitizenReport(rep.id, 'OFFICIALLY VERIFIED & SQUAD EN ROUTE');
                      showToast(`Verified and escalated report ${rep.id}`);
                    }}
                    className="flex-1 py-1 bg-purple text-white text-xs font-semibold rounded hover:bg-purple-deep"
                  >
                    Verify &amp; Escalate
                  </button>
                  <button
                    onClick={() => {
                      verifyCitizenReport(rep.id, 'RESOLVED BY FIELD PUMPING');
                      showToast(`Marked report ${rep.id} as resolved`);
                    }}
                    className="flex-1 py-1 bg-surface border border-border text-ink text-xs font-semibold rounded hover:bg-surface-secondary"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 12: Rapid What-If Scenario Stress-Test Drawer */}
      {activeDrawer === 'whatif' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple" />
              <h3 className="font-bold text-sm text-ink uppercase">Rapid What-If Scenario Stress</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-ink-secondary">
            Simulate instantaneous compound cloudburst and tidal anomalies on the live map surface.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Rainfall Intensity</span>
                <span className="font-bold text-purple">{scenarioParams.rainfallIntensity} mm/hr</span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                value={scenarioParams.rainfallIntensity}
                onChange={(e) => setScenarioParams({ ...scenarioParams, rainfallIntensity: +e.target.value })}
                className="w-full accent-purple cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>High Tide Peak</span>
                <span className="font-bold text-indigo-600">{scenarioParams.tideLevel} m MSL</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.5"
                step="0.1"
                value={scenarioParams.tideLevel}
                onChange={(e) => setScenarioParams({ ...scenarioParams, tideLevel: +e.target.value })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Drainage Siltation / Blockage</span>
                <span className="font-bold text-status-alert">{scenarioParams.drainBlockage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={scenarioParams.drainBlockage}
                onChange={(e) => setScenarioParams({ ...scenarioParams, drainBlockage: +e.target.value })}
                className="w-full accent-status-alert cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Pump Station Available Capacity</span>
                <span className="font-bold text-status-safe">{scenarioParams.pumpingCapacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={scenarioParams.pumpingCapacity}
                onChange={(e) => setScenarioParams({ ...scenarioParams, pumpingCapacity: +e.target.value })}
                className="w-full accent-status-safe cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              showToast('Recalculated 2D SWE Inundation mesh for modified scenario params');
              setActiveDrawer(null);
            }}
            className="w-full mt-2 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-colors shadow-subtle"
          >
            Apply Scenario to Live Map
          </button>
        </div>
      )}

      {/* Feature 13: Emergency Safe Route Finder Drawer */}
      {activeDrawer === 'safeRoute' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-status-safe" />
              <h3 className="font-bold text-sm text-ink uppercase">Emergency Safe Path Finder</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-ink-secondary block mb-1">Origin Point</label>
              <select
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-semibold"
              >
                <option value="hosp-sion">Sion Municipal Trauma General Hospital</option>
                <option value="kurla-fire">Kurla West Fire & Rescue Post</option>
                <option value="dadar-flyover">Hindmata Dadar Elevated Ramp</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-ink-secondary block mb-1">Destination</label>
              <select
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-semibold"
              >
                <option value="camp-andheri">Andheri East Emergency Relief Camp</option>
                <option value="hosp-rajawadi">Rajawadi Hospital Secondary Care</option>
                <option value="bkc-shelter">BKC Disaster Operations Shelter</option>
              </select>
            </div>

            <button
              onClick={handleComputeSafeRoute}
              className="w-full py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Compute Flood-Avoidance Route</span>
            </button>

            {activeSafeRoute && (
              <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Route Verified: 100% Free of &gt;15cm Submergence</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-ink-secondary">Distance:</span>
                  <span className="font-bold text-ink">{activeSafeRoute.distanceKm} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-ink-secondary">Ambulance ETA:</span>
                  <span className="font-bold text-ink">{activeSafeRoute.transitMinutes} mins</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-secondary">Primary Arterial:</span>
                  <span className="font-bold text-ink">Eastern Express Highway Flyover</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature 14: Dynamic Flood Barriers & Sandbags Drawer */}
      {activeDrawer === 'barriers' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-status-warning" />
              <h3 className="font-bold text-sm text-ink uppercase">Placed Flood Barriers &amp; Sandbags</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-ink-secondary">
            Click on map while tool is active to drop rapid dikes and calculate localized hydraulic mitigation.
          </p>

          <div className="space-y-3">
            {placedBarriers.map((bar) => (
              <div key={bar.id} className="bg-surface-secondary border border-border rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-ink">{bar.name}</h4>
                  <span className="text-[11px] text-ink-secondary">{bar.type} • {bar.deployedAt}</span>
                  <div className="text-[11px] font-mono text-status-safe font-bold mt-0.5">
                    Mitigation: {bar.mitigationDeltaCm} cm local water depth
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeBarrier(bar.id);
                    showToast(`Removed barrier ${bar.name}`);
                  }}
                  className="p-1.5 rounded-lg text-ink-secondary hover:text-status-alert transition-colors"
                  title="Remove Barrier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 15: Automated CAP Broadcast Evacuation & Siren Modal */}
      {activeDrawer === 'capBroadcast' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
          <div className="bg-surface border border-border rounded-2xl shadow-elevated max-h-[90vh] max-w-lg w-full p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto animate-in zoom-in-95 lg:max-h-none lg:overflow-visible">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-status-alert" />
                <h3 className="font-bold text-sm text-ink uppercase">Transmit CAP Siren &amp; Evacuation Alert</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-status-alert-soft/60 border border-status-alert/30 rounded-xl p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-status-alert block">
                  Broadcast Message Draft (CAP v1.2 Protocol)
                </span>
                <p className="font-bold text-ink mt-1">
                  IMMEDIATE EVACUATION &amp; FLOOD WARNING: Severe inundation (&gt;45cm) in Kurla West &amp; Sion East. Avoid lowlands; proceed to designated Municipal Relief Centers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="bg-surface-secondary p-2 rounded border border-border">
                  <span className="text-[10px] text-ink-secondary block">Target Population</span>
                  <span className="font-bold text-ink text-sm">620,000 citizens</span>
                </div>
                <div className="bg-surface-secondary p-2 rounded border border-border">
                  <span className="text-[10px] text-ink-secondary block">Active Channels</span>
                  <span className="font-bold text-ink">Cell Broadcast, 24 VMS, App</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setActiveDrawer(null)}
                className="flex-1 py-2 bg-surface border border-border text-ink text-xs font-semibold rounded-lg hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  publishAlert({
                    id: `AL-${Date.now()}`,
                    title: 'EMERGENCY EVACUATION WARNING: KURLA & SION LOWLANDS',
                    wards: ['Ward L', 'Ward F/N'],
                    status: 'PUBLISHED - ACTIVE',
                    timestamp: 'Just now',
                    audienceReach: '620,000 citizens',
                    depthRange: '30–55 cm',
                    channels: ['Cell Broadcast', 'VMS 24 Screens', 'Citizen App', 'Audio Siren'],
                  });
                  toggleSirenAudio();
                  setActiveDrawer(null);
                  showToast('CAP Evacuation Alert Transmitted Across Metro');
                }}
                className="flex-1 py-2 bg-status-alert text-white text-xs font-semibold rounded-lg hover:bg-red-700 shadow-subtle flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Broadcast Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 16: Ward Hazard Heatmap & Vulnerability Ranking Drawer */}
      {activeDrawer === 'wardMatrix' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(460px,80vw)] lg:w-[460px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-ink uppercase">Ward Vulnerability Index</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {WARD_RISK_MATRIX.map((w) => (
              <div key={w.ward} className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-ink">{w.ward}: {w.name}</h4>
                    <span className="text-[11px] text-ink-secondary">Pop at risk: {w.populationAtRisk.toLocaleString()}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    w.vulnerabilityIndex > 80 ? 'bg-status-alert-soft text-status-alert' : 'bg-status-warning-soft text-status-warning'
                  }`}>
                    Score: {w.vulnerabilityIndex}/100
                  </span>
                </div>

                <div className="flex justify-between text-[11px] font-mono text-ink-secondary border-t border-border pt-1">
                  <span>Hotspots: <strong className="text-ink">{w.activeHotspots}</strong></span>
                  <span>Shelters: <strong className="text-ink">{w.evacSheltersOpen} ({w.shelterOccupancy}/{w.shelterCapacity})</strong></span>
                </div>

                <button
                  onClick={() => {
                    const match = WARDS.find((x) => x.name.includes(w.ward.split(' ')[1]));
                    if (match) setSelectedWard(match.id);
                    showToast(`Zoomed map to ${w.name}`);
                  }}
                  className="w-full mt-1 py-1 bg-surface border border-border hover:border-purple text-ink text-xs font-semibold rounded-lg"
                >
                  Zoom to Ward
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 17: Bathymetry & River Cross-Section Profile Drawer */}
      {activeDrawer === 'bathymetry' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(480px,80vw)] lg:w-[480px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-ink uppercase">Channel Bathymetry &amp; Freeboard</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-2">
            <h4 className="font-bold text-xs text-ink">{BATHYMETRY_PROFILES.mithiRiver.title}</h4>
            <div className="flex justify-between text-[11px] font-mono text-ink-secondary">
              <span>Discharge: <strong className="text-ink">{BATHYMETRY_PROFILES.mithiRiver.currentDischarge}</strong></span>
              <span className="text-status-alert font-bold">Freeboard: 20cm</span>
            </div>

            {/* SVG Bathymetric Cross-Section Diagram */}
            <div className="w-full h-36 bg-surface rounded-lg p-2 border border-border relative mt-1">
              <svg viewBox="0 0 350 120" className="w-full h-full overflow-visible">
                {/* River Bed Profile */}
                <polygon
                  points="0,120 0,35 50,60 100,90 150,115 200,113 250,85 300,55 350,30 350,120"
                  fill="#E5E7EB"
                />
                <polyline
                  points="0,35 50,60 100,90 150,115 200,113 250,85 300,55 350,30"
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth="2"
                />
                {/* Water Level Area */}
                <polygon
                  points="0,40 350,40 350,120 0,120"
                  fill="#60A5FA"
                  opacity="0.5"
                />
                <line x1="0" y1="40" x2="350" y2="40" stroke="#2563EB" strokeWidth="2.5" />
                <text x="10" y="36" fill="#1D4ED8" className="text-[9px] font-mono font-bold">
                  Water Surface (4.6m MSL)
                </text>
                <text x="120" y="112" fill="#374151" className="text-[8px] font-mono">
                  Deep Thalweg
                </text>
              </svg>
            </div>
            <div className="text-[11px] text-ink-secondary">
              Tidal Influence: {BATHYMETRY_PROFILES.mithiRiver.tidalInfluence}
            </div>
          </div>
        </div>
      )}

      {/* Feature 18: IoT Ultrasonic Gauge Telemetry Grid Drawer */}
      {activeDrawer === 'iotGrid' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[min(480px,80vw)] lg:w-[480px] bg-surface border-l border-border shadow-elevated p-5 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-sm text-ink uppercase">IoT Ultrasonic Gauges Grid (48)</h3>
            </div>
            <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {IOT_SENSORS_GRID.map((sensor) => (
              <div key={sensor.id} className="bg-surface-secondary border border-border rounded-xl p-3 flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">{sensor.id}</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    sensor.status === 'CRITICAL' ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
                  }`}>
                    {sensor.status}
                  </span>
                </div>
                <div className="text-[11px] text-ink-secondary truncate">{sensor.location}</div>
                <div className="font-mono text-base font-bold text-ink mt-1">{sensor.depthCm} cm</div>
                <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1 border-t border-border pt-1">
                  <span>Bat: {sensor.battery}%</span>
                  <span>{sensor.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 20: SITREP Situation Report Modal */}
      {activeDrawer === 'sitrep' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl shadow-elevated max-w-xl w-full p-5 flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple" />
                <h3 className="font-bold text-sm text-ink uppercase">BMC Situation Report (SITREP)</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="text-ink-secondary hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-surface-secondary p-3 rounded-lg border border-border space-y-1">
                <div>AUTHORITY: Brihanmumbai Municipal Corporation - Disaster Operations</div>
                <div>TIMESTAMP: 2026-09-22 18:35 IST | INCIDENT LEVEL 3</div>
                <div>PRECIPITATION: 80 mm/hr (IMD Doppler S-Band Ingest)</div>
                <div>ARABIAN SEA TIDE: 4.25m MSL (Tidal Lockout Active)</div>
              </div>

              <div className="space-y-1 text-ink">
                <span className="font-bold uppercase text-status-alert">1. Closed Critical Corridors:</span>
                <ul className="list-disc pl-5 space-y-0.5">
                  {ROAD_CORRIDORS.filter((r) => r.status === 'CRITICAL').map((r) => (
                    <li key={r.id}>{r.name} - Current Depth: {r.currentDepth}cm (Forecast Peak: {r.forecastPeak}cm)</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 text-ink">
                <span className="font-bold uppercase text-purple">2. Active Infrastructure Status:</span>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Sion Trauma Hospital: Free of basement flooding; gate auxiliary pump active</li>
                  <li>Bandra Stormwater Station: 6/6 pumps operating at 36,000 m³/hr</li>
                  <li>Total City Dewatering Discharge: 149,500 m³/hr</li>
                </ul>
              </div>

              <div className="space-y-1 text-ink">
                <span className="font-bold uppercase text-emerald-700">3. Rescue Fleet Disposition:</span>
                <ul className="list-disc pl-5 space-y-0.5">
                  {rescueFleet.map((r) => (
                    <li key={r.id}>{r.name} ({r.crew} crew): {r.status}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={handleExportSITREP}
                className="flex-1 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SITREP (JSON/Data)</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('BMC SITREP COPIED TO CLIPBOARD');
                  showToast('Copied SITREP summary to clipboard');
                }}
                className="flex-1 py-2 bg-surface border border-border text-ink text-xs font-semibold rounded-lg hover:bg-surface-secondary flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
