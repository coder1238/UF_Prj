import React, { useState, useEffect } from 'react';
import {
  History,
  TrendingUp,
  RotateCcw,
  Play,
  Pause,
  Download,
  CheckCircle2,
  GitCompare,
  Waves,
  Gauge,
  DollarSign,
  Activity,
  MapPin,
  PhoneCall,
  Radio,
  Satellite,
  Truck,
  Building2,
  Sliders,
  Sparkles,
  Thermometer,
  Award,
  GitFork,
  Droplets,
  Search,
  ChevronRight,
  X,
} from 'lucide-react';

import {
  HISTORICAL_STORMS,
  REGRESSION_DATA_POINTS,
  RECURRING_HOTSPOTS_EXTENDED,
} from '../components/historical/historicalConstants';

// 20 Specialized Operational Forensic & Climatology Feature Components
import StormComparatorModal from '../components/historical/StormComparatorModal';
import IDFCurveAnalyzerModal from '../components/historical/IDFCurveAnalyzerModal';
import ClimateChangeAnomalyModal from '../components/historical/ClimateChangeAnomalyModal';
import WaterBudgetForensicsModal from '../components/historical/WaterBudgetForensicsModal';
import CompoundTidalFloodModal from '../components/historical/CompoundTidalFloodModal';
import WardVulnerabilityScorecardModal from '../components/historical/WardVulnerabilityScorecardModal';
import ForensicRootCauseTreeModal from '../components/historical/ForensicRootCauseTreeModal';
import PumpingTelemetryArchiveModal from '../components/historical/PumpingTelemetryArchiveModal';
import EconomicLossLedgerModal from '../components/historical/EconomicLossLedgerModal';
import InundationHydrographModal from '../components/historical/InundationHydrographModal';
import HotspotMigrationMapModal from '../components/historical/HotspotMigrationMapModal';
import CitizenDistressArchiveModal from '../components/historical/CitizenDistressArchiveModal';
import RadarGaugeBiasAuditModal from '../components/historical/RadarGaugeBiasAuditModal';
import SatelliteSARArchiveModal from '../components/historical/SatelliteSARArchiveModal';
import NallahDesiltingAuditModal from '../components/historical/NallahDesiltingAuditModal';
import CriticalInfraImpactModal from '../components/historical/CriticalInfraImpactModal';
import ModelCalibrationWorkbenchModal from '../components/historical/ModelCalibrationWorkbenchModal';
import AlertVerificationAuditModal from '../components/historical/AlertVerificationAuditModal';
import MicroclimateUHIModal from '../components/historical/MicroclimateUHIModal';
import AnalogStormFinderModal from '../components/historical/AnalogStormFinderModal';
import ForensicAuditExportModal from '../components/historical/ForensicAuditExportModal';

export default function HistoricalAnalytics() {
  // Replay Engine State
  const [selectedStormId, setSelectedStormId] = useState('29-aug-2025');
  const [replayStep, setReplayStep] = useState(2);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1); // 0.5, 1, 2, 5

  // Regression Chart Interactive States
  const [regressionModel, setRegressionModel] = useState('poly'); // 'poly' | 'linear' | 'power'
  const [severityFilter, setSeverityFilter] = useState('All'); // All | Extreme | Very Heavy | Heavy | Moderate
  const [thresholdRain, setThresholdRain] = useState(48);
  const [thresholdTide, setThresholdTide] = useState(3.8);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Hotspots Interactive States
  const [hotspotSearch, setHotspotSearch] = useState('');
  const [hotspotSort, setHotspotSort] = useState('events10Y');
  const [hotspotZoneFilter, setHotspotZoneFilter] = useState('All');
  const [selectedHotspotDossier, setSelectedHotspotDossier] = useState(null);

  // Failure Mode Drill-Down State
  const [selectedFailureMode, setSelectedFailureMode] = useState(null);
  const [failureTimeframe, setFailureTimeframe] = useState('10Y'); // '10Y' | '3Y'

  // Operational Control Deck Feature Search / Category
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [featureCategory, setFeatureCategory] = useState('All');

  // Modals Open/Close State (20 Features + 1 Exporter)
  const [modals, setModals] = useState({
    exportAudit: false,
    comparator: false,
    idfCurves: false,
    climateAnomaly: false,
    waterBudget: false,
    compoundTide: false,
    wardScorecard: false,
    rootCauseTree: false,
    pumpingArchive: false,
    economicLoss: false,
    inundationHydrograph: false,
    hotspotMigration: false,
    citizenDistress: false,
    radarBias: false,
    satelliteSAR: false,
    nallahDesilting: false,
    criticalInfra: false,
    modelCalibration: false,
    alertVerification: false,
    microclimateUHI: false,
    analogStorm: false,
  });

  const toggleModal = (modalKey, state) => {
    setModals((prev) => ({ ...prev, [modalKey]: state }));
  };

  const currentStorm = HISTORICAL_STORMS.find((s) => s.id === selectedStormId) || HISTORICAL_STORMS[0];
  const totalReplaySteps = currentStorm.timelineSteps.length;
  const activeStepData = currentStorm.timelineSteps[Math.min(replayStep, totalReplaySteps - 1)];

  // Automatic Replay Engine Interval Timer
  useEffect(() => {
    let interval = null;
    if (isReplaying) {
      interval = setInterval(() => {
        setReplayStep((prev) => {
          if (prev >= totalReplaySteps - 1) {
            setIsReplaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000 / replaySpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReplaying, replaySpeed, totalReplaySteps]);

  // Handle Storm Change in Replay Engine
  const handleStormChange = (newId) => {
    setSelectedStormId(newId);
    setReplayStep(0);
    setIsReplaying(false);
  };

  // Filter regression points
  const filteredRegressionPoints = REGRESSION_DATA_POINTS.filter((pt) => {
    if (severityFilter === 'All') return true;
    return pt.type === severityFilter;
  });

  // Calculate dynamic threshold breach percentage
  const thresholdBreachCount = REGRESSION_DATA_POINTS.filter(
    (pt) => pt.rainRate >= thresholdRain && pt.tideM >= thresholdTide
  ).length;
  const thresholdSevereCount = REGRESSION_DATA_POINTS.filter(
    (pt) => pt.rainRate >= thresholdRain && pt.tideM >= thresholdTide && pt.depthCm >= 35
  ).length;
  const calculatedRiskProb = thresholdBreachCount > 0
    ? Math.round((thresholdSevereCount / thresholdBreachCount) * 100)
    : 84;

  // Filter & Sort Hotspots
  const filteredHotspots = RECURRING_HOTSPOTS_EXTENDED.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(hotspotSearch.toLowerCase()) ||
                          h.ward.toLowerCase().includes(hotspotSearch.toLowerCase());
    const matchesZone = hotspotZoneFilter === 'All' || h.zone === hotspotZoneFilter;
    return matchesSearch && matchesZone;
  }).sort((a, b) => (b[hotspotSort] > a[hotspotSort] ? 1 : -1));

  // The 20 Detailed Operational Feature Directory Config
  const OPERATIONAL_FEATURES_CATALOG = [
    {
      id: 'comparator',
      title: 'Multi-Storm Climatology Comparator',
      category: 'Hydrometeorology & Climatology',
      desc: 'Side-by-side comparative analysis of peak rain rates, tide overlap, volume & flood area across milestone storms.',
      icon: GitCompare,
      badge: 'Benchmark',
      modalKey: 'comparator',
    },
    {
      id: 'idfCurves',
      title: 'IDF Return Period Curve Analyzer',
      category: 'Hydrometeorology & Climatology',
      desc: 'Standard Intensity-Duration-Frequency curves (2y to 100y) using Gumbel distribution with BRIMSTOWAD 50y design checks.',
      icon: TrendingUp,
      badge: 'Hydrology',
      modalKey: 'idfCurves',
    },
    {
      id: 'climateAnomaly',
      title: '12-Year Climate Change Anomaly Tracker',
      category: 'Hydrometeorology & Climatology',
      desc: 'Decadal shift in extreme cloudburst hours (+200%), Arabian Sea sea-level drift (+51.2mm), and peak hourly intensities.',
      icon: Thermometer,
      badge: 'Decadal Shift',
      modalKey: 'climateAnomaly',
    },
    {
      id: 'waterBudget',
      title: 'Catchment Water Budget & Runoff Forensics',
      category: 'Hydraulic & Drainage Forensics',
      desc: 'Volumetric runoff balance, soil infiltration losses & runoff coefficient (C) evolution across Mumbai’s 5 river basins.',
      icon: Droplets,
      badge: 'Mass Balance',
      modalKey: 'waterBudget',
    },
    {
      id: 'compoundTide',
      title: 'Compound Tidal & Rainfall Hazard Matrix',
      category: 'Hydrometeorology & Climatology',
      desc: '2D joint probability space analyzing astronomical high tides vs cloudburst rates with flap gate lockout danger zone.',
      icon: Waves,
      badge: 'Tidal Flap Gates',
      modalKey: 'compoundTide',
    },
    {
      id: 'wardScorecard',
      title: '24-Ward Resiliency & Vulnerability Scorecard',
      category: 'Infrastructure & Civic Impact',
      desc: 'Comprehensive 10-year audit across all MCGM wards: cumulative flood hours, pump density, holding capacity & recovery grades.',
      icon: Award,
      badge: '24 Wards',
      modalKey: 'wardScorecard',
    },
    {
      id: 'rootCauseTree',
      title: 'Post-Event Fault-Tree Analysis (FTA)',
      category: 'Hydraulic & Drainage Forensics',
      desc: '5-Why root-cause nodal deconstruction into hydrometeorological, tidal backwater, debris choke, and dispatch delays.',
      icon: GitFork,
      badge: 'Root Cause',
      modalKey: 'rootCauseTree',
    },
    {
      id: 'pumpingArchive',
      title: 'Pumping Station SCADA Historical Telemetry',
      category: 'Hydraulic & Drainage Forensics',
      desc: 'Operational run logs for 7 major stormwater pumping stations: diesel vs grid run hours, discharge rates & head loss.',
      icon: Gauge,
      badge: 'SCADA Logs',
      modalKey: 'pumpingArchive',
    },
    {
      id: 'economicLoss',
      title: 'Historical Damage & Economic Loss Ledger',
      category: 'Infrastructure & Civic Impact',
      desc: 'Direct physical damages, commuter delay loss, commercial interruption, and mitigation ROI (averted losses).',
      icon: DollarSign,
      badge: '₹ Crores',
      modalKey: 'economicLoss',
    },
    {
      id: 'inundationHydrograph',
      title: 'Inundation Depth Hydrograph Temporal Animator',
      category: 'Hydraulic & Drainage Forensics',
      desc: 'High-resolution water level rise and recession hydrographs (Tp & Td) comparing pre- vs post-intervention subways.',
      icon: Activity,
      badge: 'Hydrograph',
      modalKey: 'inundationHydrograph',
    },
    {
      id: 'hotspotMigration',
      title: 'Geospatial Hotspot Migration & Remediation Map',
      category: 'Infrastructure & Civic Impact',
      desc: 'Spatial tracking of eliminated sump hotspots (Hindmata, Milan) vs persistent chokes and newly emergent urban nodes.',
      icon: MapPin,
      badge: 'GIS Spatial',
      modalKey: 'hotspotMigration',
    },
    {
      id: 'citizenDistress',
      title: 'Helpline 1916 Citizen Distress Call Archive',
      category: 'Infrastructure & Civic Impact',
      desc: 'Correlation between cloudburst bursts and civic 1916 emergency helpline call volume with dispatch response latency.',
      icon: PhoneCall,
      badge: 'Public Safety',
      modalKey: 'citizenDistress',
    },
    {
      id: 'radarBias',
      title: 'Doppler Radar QPE vs AWS Gauge Bias Calibrator',
      category: 'Hydrometeorology & Climatology',
      desc: 'Doppler quantitative precipitation estimation (QPE) cross-validation against ground weather stations & Z-R tuning.',
      icon: Radio,
      badge: 'Radar QPE',
      modalKey: 'radarBias',
    },
    {
      id: 'satelliteSAR',
      title: 'Satellite Sentinel-1 SAR Flood Extent Archive',
      category: 'Hydrometeorology & Climatology',
      desc: 'Cloud-penetrating Synthetic Aperture Radar (SAR) backscatter extent comparison against 2D hydraulic simulation grids.',
      icon: Satellite,
      badge: 'Earth Obs',
      modalKey: 'satelliteSAR',
    },
    {
      id: 'nallahDesilting',
      title: 'Pre-Monsoon Nallah Desilting Audit History',
      category: 'Hydraulic & Drainage Forensics',
      desc: 'Desilting tonnage targets vs actual excavated muck across 696 drains correlated with subsequent flood choke-points.',
      icon: Truck,
      badge: 'Siltation',
      modalKey: 'nallahDesilting',
    },
    {
      id: 'criticalInfra',
      title: 'Critical Infrastructure Flood Disruption History',
      category: 'Infrastructure & Civic Impact',
      desc: 'Suburban railway tracks (Kurla/Sion), airport runways, tertiary hospitals, and power sub-station waterlogging history.',
      icon: Building2,
      badge: 'Life-Lines',
      modalKey: 'criticalInfra',
    },
    {
      id: 'modelCalibration',
      title: 'Hydrodynamic Model Calibration Workbench',
      category: 'Predictive & Modeling Intelligence',
      desc: 'Saint-Venant 1D/2D hydraulic equations tuning: adjust Manning’s n roughness, bed slope, and soil Curve Number CN.',
      icon: Sliders,
      badge: 'SWMM Tuning',
      modalKey: 'modelCalibration',
    },
    {
      id: 'alertVerification',
      title: 'Monsoon Alert Verification & Skill Score Audit',
      category: 'Predictive & Modeling Intelligence',
      desc: 'IMD / MCGM Red Alert confusion matrix: Probability of Detection (POD 88.7%), False Alarm Ratio (FAR 13.8%), CSI & Brier score.',
      icon: CheckCircle2,
      badge: 'Confusion Matrix',
      modalKey: 'alertVerification',
    },
    {
      id: 'microclimateUHI',
      title: 'Urban Heat Island (UHI) Precipitation Trigger',
      category: 'Predictive & Modeling Intelligence',
      desc: 'Microclimate thermal plumes and sea-breeze moisture convergence triggering localized inland convective cloudbursts.',
      icon: Thermometer,
      badge: 'Microclimate',
      modalKey: 'microclimateUHI',
    },
    {
      id: 'analogStorm',
      title: 'Climatological Predictive Analog Storm Finder',
      category: 'Predictive & Modeling Intelligence',
      desc: 'Machine learning dynamic time warping (DTW) matching current SST, IOD & MJO teleconnections with historical analog years.',
      icon: Sparkles,
      badge: 'ML Analog',
      modalKey: 'analogStorm',
    },
  ];

  const filteredFeatures = OPERATIONAL_FEATURES_CATALOG.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
                          f.desc.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
                          f.badge.toLowerCase().includes(featureSearchQuery.toLowerCase());
    const matchesCategory = featureCategory === 'All' || f.category === featureCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-4 shadow-subtle">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <History className="w-5 h-5 text-purple" />
            Historical Flood Retrospective Forensics &amp; Climatology Intelligence
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            12-Year Meteorological &amp; Inundation Archive (2014–2026) • 418 Monsoon Storm Events • 20 Operational Forensic Modules
          </p>
        </div>

        <button
          onClick={() => toggleModal('exportAudit', true)}
          className="px-3.5 py-2 bg-purple text-white hover:bg-purple-deep rounded-xl text-xs font-semibold flex items-center gap-2 shadow-subtle transition-all cursor-pointer hover:shadow-elevated"
        >
          <Download className="w-4 h-4" />
          <span>Export Forensic Audit (PDF &amp; Dataset)</span>
        </button>
      </div>

      {/* 20-Feature Quick Operational Forensic Control Deck */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-subtle flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-soft text-purple">
                20 OPERATIONAL MODULES
              </span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                Forensic Analysis &amp; Climatology Intelligence Launchpad
              </h3>
            </div>
            <p className="text-[11px] text-ink-secondary mt-0.5">
              Instant access to all specialized analytical workbenches, hydrological models, telemetry archives and audit tools
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search modules..."
                value={featureSearchQuery}
                onChange={(e) => setFeatureSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs font-mono focus:outline-none focus:border-purple w-44"
              />
            </div>

            {/* Category Selector */}
            <select
              value={featureCategory}
              onChange={(e) => setFeatureCategory(e.target.value)}
              className="py-1.5 px-2 bg-surface-secondary border border-border rounded-lg text-xs font-mono text-ink focus:outline-none focus:border-purple"
            >
              <option value="All">All Categories ({OPERATIONAL_FEATURES_CATALOG.length})</option>
              <option value="Hydrometeorology & Climatology">Hydrometeorology &amp; Climatology</option>
              <option value="Hydraulic & Drainage Forensics">Hydraulic &amp; Drainage Forensics</option>
              <option value="Infrastructure & Civic Impact">Infrastructure &amp; Civic Impact</option>
              <option value="Predictive & Modeling Intelligence">Predictive &amp; Modeling</option>
            </select>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredFeatures.map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => toggleModal(feat.modalKey, true)}
                className="p-3 bg-surface-secondary hover:bg-surface-subtle border border-border hover:border-purple/50 rounded-xl text-left transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="p-1.5 bg-purple-soft group-hover:bg-purple group-hover:text-white text-purple rounded-lg transition-colors">
                    <FeatIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface border border-border text-ink-secondary">
                    {feat.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-ink group-hover:text-purple transition-colors truncate">
                    {feat.title}
                  </div>
                  <div className="text-[10px] text-ink-secondary line-clamp-2 mt-0.5 leading-snug">
                    {feat.desc}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-purple font-semibold">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 1: Regression Scatter Plot (60%) + Top 10-Year Recurring Hotspots (40%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Rainfall vs Depth Regression Scatter Plot (7 cols) */}
        <div className="xl:col-span-7 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                  Rainfall Rate vs Maximum Flood Depth Correlation
                </h3>
                <span className="font-mono text-xs font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                  {regressionModel === 'poly' ? 'R² = 0.892 (Polynomial)' : regressionModel === 'linear' ? 'R² = 0.814 (Linear)' : 'R² = 0.865 (Power Law)'}
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary mt-0.5">
                N = {filteredRegressionPoints.length} Storm Events • Hover points to inspect telemetry
              </p>
            </div>

            {/* Regression Model & Severity Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <select
                value={regressionModel}
                onChange={(e) => setRegressionModel(e.target.value)}
                className="py-1 px-2 bg-surface-secondary border border-border rounded-lg text-[11px] text-ink focus:outline-none focus:border-purple"
              >
                <option value="poly">2nd Poly Fit</option>
                <option value="linear">Linear Fit</option>
                <option value="power">Power Law</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="py-1 px-2 bg-surface-secondary border border-border rounded-lg text-[11px] text-ink focus:outline-none focus:border-purple"
              >
                <option value="All">All Severities</option>
                <option value="Extreme">Extreme (&gt;100mm/h)</option>
                <option value="Very Heavy">Very Heavy (64-100mm/h)</option>
                <option value="Heavy">Heavy (35-64mm/h)</option>
                <option value="Moderate">Moderate (&lt;35mm/h)</option>
              </select>
            </div>
          </div>

          {/* Interactive Critical Threshold Banner & Controls */}
          <div className="p-3 bg-purple-soft/60 rounded-xl border border-purple/30 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-mono">
                <strong className="text-purple">CRITICAL THRESHOLD:</strong>
                <span className="text-ink">
                  At &gt;{thresholdRain} mm/h with Tide &gt;{thresholdTide}m MSL:
                </span>
              </div>
              <div className="text-[11px] text-ink-secondary">
                Probability of severe street inundation spikes to <strong className="text-status-alert font-bold">{calculatedRiskProb}%</strong>
              </div>
            </div>

            {/* Sliders to adjust threshold */}
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <div>
                <span className="text-ink-secondary">Rain: {thresholdRain} mm/h</span>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={thresholdRain}
                  onChange={(e) => setThresholdRain(Number(e.target.value))}
                  className="w-20 accent-purple block cursor-pointer"
                />
              </div>
              <div>
                <span className="text-ink-secondary">Tide: {thresholdTide}m</span>
                <input
                  type="range"
                  min="3.0"
                  max="4.6"
                  step="0.1"
                  value={thresholdTide}
                  onChange={(e) => setThresholdTide(Number(e.target.value))}
                  className="w-20 accent-purple block cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SVG Interactive Scatter & Curve Chart */}
          <div className="w-full h-64 relative bg-surface-secondary rounded-xl border border-border p-3">
            <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="#E3E0EA" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="170" x2="380" y2="170" stroke="#CBC7D6" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="#CBC7D6" strokeWidth="1" />

              {/* Threshold Lines */}
              {(() => {
                const threshX = 40 + (thresholdRain / 150) * 340;
                return (
                  <line
                    x1={threshX}
                    y1="20"
                    x2={threshX}
                    y2="170"
                    stroke="#D94A4A"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                );
              })()}

              {/* Axis Labels */}
              <text x="35" y="24" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">75cm</text>
              <text x="35" y="74" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">50cm</text>
              <text x="35" y="124" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">25cm</text>
              <text x="35" y="174" fill="#706B78" textAnchor="end" className="text-[8px] font-mono">0cm</text>

              <text x="40" y="185" fill="#706B78" className="text-[8px] font-mono">0 mm/h</text>
              <text x="150" y="185" fill="#706B78" className="text-[8px] font-mono">50 mm/h</text>
              <text x="260" y="185" fill="#706B78" className="text-[8px] font-mono">100 mm/h</text>
              <text x="370" y="185" fill="#706B78" className="text-[8px] font-mono">150 mm/h</text>

              {/* Dynamic Regression Curves */}
              {regressionModel === 'poly' && (
                <path d="M 40,168 Q 150,150 200,105 T 370,25" fill="none" stroke="#6D4AFF" strokeWidth="2.5" />
              )}
              {regressionModel === 'linear' && (
                <path d="M 40,165 L 370,30" fill="none" stroke="#3B8F67" strokeWidth="2.5" />
              )}
              {regressionModel === 'power' && (
                <path d="M 40,170 Q 220,165 370,20" fill="none" stroke="#C58A25" strokeWidth="2.5" />
              )}

              {/* Data Points */}
              {filteredRegressionPoints.map((pt) => {
                const cx = 40 + (pt.rainRate / 150) * 340;
                const cy = 170 - (Math.min(75, pt.depthCm) / 75) * 150;
                const isHovered = hoveredPoint?.id === pt.id;

                let fill = '#6D4AFF';
                if (pt.depthCm > 50) fill = '#D94A4A';
                else if (pt.depthCm > 25) fill = '#C58A25';

                return (
                  <circle
                    key={pt.id}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? '6' : '3.8'}
                    fill={fill}
                    stroke={isHovered ? '#FFFFFF' : 'none'}
                    strokeWidth={isHovered ? '2' : '0'}
                    opacity={isHovered ? '1' : '0.85'}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 bg-ink text-white p-2.5 rounded-xl shadow-elevated text-xs font-mono pointer-events-none border border-border z-10 space-y-0.5">
                <div className="font-bold text-purple">{hoveredPoint.ward} • {hoveredPoint.date}</div>
                <div>Rain Rate: <strong className="text-white">{hoveredPoint.rainRate} mm/h</strong></div>
                <div>Flood Depth: <strong className="text-status-alert">{hoveredPoint.depthCm} cm</strong></div>
                <div>Tide Level: <strong className="text-status-warning">{hoveredPoint.tideM}m MSL</strong></div>
                <div>Duration: <strong className="text-ink-muted">{hoveredPoint.durationH}h ({hoveredPoint.type})</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recurring Flood Locations 10-Year Ranking (5 cols) */}
        <div className="xl:col-span-5 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                Top 10-Year Recurring Hotspots
              </h3>
              <p className="text-[11px] text-ink-secondary">Click any card to inspect remediation dossier</p>
            </div>

            {/* Search, Sort & Zone Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <input
                type="text"
                placeholder="Search hotspots..."
                value={hotspotSearch}
                onChange={(e) => setHotspotSearch(e.target.value)}
                className="py-1 px-2 bg-surface-secondary border border-border rounded text-[11px] w-28 focus:outline-none focus:border-purple"
              />

              <select
                value={hotspotZoneFilter}
                onChange={(e) => setHotspotZoneFilter(e.target.value)}
                className="py-1 px-1.5 bg-surface-secondary border border-border rounded text-[11px]"
              >
                <option value="All">All Zones</option>
                <option value="Island City">Island City</option>
                <option value="Western Suburbs">Western</option>
                <option value="Eastern Suburbs">Eastern</option>
              </select>

              <select
                value={hotspotSort}
                onChange={(e) => setHotspotSort(e.target.value)}
                className="py-1 px-1.5 bg-surface-secondary border border-border rounded text-[11px]"
              >
                <option value="events10Y">Events</option>
                <option value="avgDepthCm">Depth</option>
                <option value="avgDurationH">Duration</option>
                <option value="economicExposureCr">Damage ₹</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredHotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedHotspotDossier(spot)}
                className="w-full p-2.5 bg-surface-secondary hover:bg-surface-subtle border border-border hover:border-purple/40 rounded-xl text-left text-xs transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink group-hover:text-purple transition-colors">
                    {spot.name}
                  </span>
                  <span className="font-mono text-status-alert font-bold bg-status-alert-soft px-1.5 py-0.5 rounded">
                    {spot.events10Y} Events
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-ink-secondary mt-1">
                  <span>Avg Depth: <strong className="text-ink">{spot.avgDepthCm}cm</strong></span>
                  <span>Duration: <strong className="text-ink">{spot.avgDurationH}h</strong></span>
                  <span className="text-purple font-semibold">{spot.type}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-ink-secondary mt-1 pt-1 border-t border-border/50">
                  <span>{spot.ward} ({spot.zone})</span>
                  <span className="text-status-warning font-semibold">₹{spot.economicExposureCr} Cr Loss</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Event Replay Engine (50%) + Failure Modes (50%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Event Replay Engine (6 cols) */}
        <div className="xl:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-purple" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                Forensic Event Replay Engine
              </h3>
            </div>

            {/* Storm Switcher Dropdown */}
            <select
              value={selectedStormId}
              onChange={(e) => handleStormChange(e.target.value)}
              className="py-1 px-2 bg-surface-secondary border border-border rounded-lg text-xs font-mono font-bold text-status-alert focus:outline-none focus:border-purple"
            >
              {HISTORICAL_STORMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName} ({s.peakRainRate} mm/h)
                </option>
              ))}
            </select>
          </div>

          {/* Replay Player Controls Bar */}
          <div className="flex items-center justify-between bg-surface-secondary p-2 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReplaying(!isReplaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isReplaying
                    ? 'bg-status-alert text-white shadow-xs'
                    : 'bg-purple text-white hover:bg-purple-deep'
                }`}
              >
                {isReplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isReplaying ? 'Pause Playback' : 'Auto Play Event'}</span>
              </button>

              <button
                onClick={() => {
                  setReplayStep(0);
                  setIsReplaying(false);
                }}
                className="p-1.5 bg-surface text-ink border border-border hover:border-purple rounded-lg text-xs"
                title="Restart Event"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="text-ink-secondary mr-1">Speed:</span>
              {[0.5, 1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setReplaySpeed(spd)}
                  className={`px-1.5 py-0.5 rounded border ${
                    replaySpeed === spd
                      ? 'bg-purple-soft text-purple border-purple font-bold'
                      : 'bg-surface text-ink border-border hover:border-purple/30'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Replay Steps Scrubber */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {currentStorm.timelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setReplayStep(idx);
                  setIsReplaying(false);
                }}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  replayStep === idx
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-xs'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                <div className="font-mono text-[10px]">{step.time}</div>
                <div className="truncate text-[11px] mt-0.5">{step.label}</div>
              </button>
            ))}
          </div>

          {/* Synchronized Telemetry Dashboard */}
          {activeStepData && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Rain Rate</span>
                  <div className="font-bold text-status-alert text-sm">{activeStepData.rainRate} mm/h</div>
                </div>
                <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Arabian Sea Tide</span>
                  <div className="font-bold text-status-warning text-sm">{activeStepData.tideM}m MSL</div>
                </div>
                <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Mithi River Level</span>
                  <div className="font-bold text-purple text-sm">{activeStepData.mithiLevelM}m</div>
                </div>
                <div className="p-2 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Pump Discharge</span>
                  <div className="font-bold text-status-safe text-sm">{activeStepData.pumpDischargeM3s} m³/s</div>
                </div>
              </div>

              <div className="p-3 bg-surface-secondary border border-border rounded-xl text-xs leading-relaxed space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-ink font-mono text-xs">
                    Phase: {activeStepData.phase} ({activeStepData.time})
                  </strong>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    activeStepData.status === 'CATASTROPHIC' || activeStepData.status === 'CRITICAL'
                      ? 'bg-status-alert-soft text-status-alert'
                      : activeStepData.status === 'WARNING'
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}>
                    {activeStepData.status}
                  </span>
                </div>
                <p className="text-ink-secondary">{activeStepData.detail}</p>
                <div className="pt-1 text-[11px] text-purple font-mono">
                  <strong>DISPATCH PROTOCOL:</strong> {activeStepData.dispatch}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drainage Failure Mode Breakdown (6 cols) */}
        <div className="xl:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                Historical Infrastructure Failure Mode Distribution
              </h3>
              <p className="text-[11px] text-ink-secondary">Click any mode to view root-cause engineering forensics</p>
            </div>
            <div className="flex gap-1 text-[10px] font-mono">
              <button
                onClick={() => setFailureTimeframe('10Y')}
                className={`px-2 py-0.5 rounded border ${failureTimeframe === '10Y' ? 'bg-purple text-white border-purple' : 'bg-surface-secondary border-border'}`}
              >
                10-Year Sample
              </button>
              <button
                onClick={() => setFailureTimeframe('3Y')}
                className={`px-2 py-0.5 rounded border ${failureTimeframe === '3Y' ? 'bg-purple text-white border-purple' : 'bg-surface-secondary border-border'}`}
              >
                Recent 3-Year
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Mode 1 */}
            <button
              onClick={() => setSelectedFailureMode(selectedFailureMode === 'lockout' ? null : 'lockout')}
              className="w-full text-left p-2.5 bg-surface-secondary hover:bg-surface-subtle border border-border rounded-xl transition-all"
            >
              <div className="flex justify-between text-ink mb-1">
                <span className="font-bold">1. High Tide Outfall Lockout &amp; Coastal Backwater</span>
                <strong className="text-status-alert">{failureTimeframe === '10Y' ? '62%' : '54%'}</strong>
              </div>
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-status-alert transition-all duration-500"
                  style={{ width: failureTimeframe === '10Y' ? '62%' : '54%' }}
                />
              </div>
              {selectedFailureMode === 'lockout' && (
                <div className="mt-2.5 p-2 bg-surface rounded-lg border border-border text-[11px] text-ink-secondary leading-relaxed font-sans">
                  <strong>ROOT-CAUSE FORENSICS:</strong> When astronomical spring tides cross +3.8m MSL, gravity flap gates shut at Mahim Creek, Love Grove, and Cleave Land outfalls. Without mechanical lift pumping, gravity drain drops to zero. Mitigated by commissioning 24x high-head pump units at Britannia and Haji Ali.
                </div>
              )}
            </button>

            {/* Mode 2 */}
            <button
              onClick={() => setSelectedFailureMode(selectedFailureMode === 'silt' ? null : 'silt')}
              className="w-full text-left p-2.5 bg-surface-secondary hover:bg-surface-subtle border border-border rounded-xl transition-all"
            >
              <div className="flex justify-between text-ink mb-1">
                <span className="font-bold">2. Trash Rack &amp; Siltation Debris Blockage</span>
                <strong className="text-status-warning">{failureTimeframe === '10Y' ? '24%' : '18%'}</strong>
              </div>
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-status-warning transition-all duration-500"
                  style={{ width: failureTimeframe === '10Y' ? '24%' : '18%' }}
                />
              </div>
              {selectedFailureMode === 'silt' && (
                <div className="mt-2.5 p-2 bg-surface rounded-lg border border-border text-[11px] text-ink-secondary leading-relaxed font-sans">
                  <strong>ROOT-CAUSE FORENSICS:</strong> Plastic consumer packaging, urban solid waste, and silty road runoff deposit in drop junctions and box culverts, throttling cross-sectional conveyance capacity by 20% to 45%. Mitigated by pre-monsoon RFID-tracked desilting and automated mechanical trash-rakes.
                </div>
              )}
            </button>

            {/* Mode 3 */}
            <button
              onClick={() => setSelectedFailureMode(selectedFailureMode === 'capacity' ? null : 'capacity')}
              className="w-full text-left p-2.5 bg-surface-secondary hover:bg-surface-subtle border border-border rounded-xl transition-all"
            >
              <div className="flex justify-between text-ink mb-1">
                <span className="font-bold">3. Pipe Hydraulic Design Capacity Exceeded</span>
                <strong className="text-purple">{failureTimeframe === '10Y' ? '14%' : '28%'}</strong>
              </div>
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-purple transition-all duration-500"
                  style={{ width: failureTimeframe === '10Y' ? '14%' : '28%' }}
                />
              </div>
              {selectedFailureMode === 'capacity' && (
                <div className="mt-2.5 p-2 bg-surface rounded-lg border border-border text-[11px] text-ink-secondary leading-relaxed font-sans">
                  <strong>ROOT-CAUSE FORENSICS:</strong> Legacy storm drains designed for 25-50 mm/h storms are overwhelmed by short-duration convective cloudbursts exceeding 100-135 mm/h. Remediation requires underground holding tanks (e.g. Hindmata 105,000 m³) and micro-tunneling augmentation.
                </div>
              )}
            </button>
          </div>

          <div className="pt-2 text-[11px] text-ink-secondary leading-relaxed border-t border-border">
            Average civic emergency response dispatch latency reduced by <strong>-38.4%</strong> since automated pump SCADA and ultrasonic level sensor deployment in 2024.
          </div>
        </div>
      </div>

      {/* Hotspot Forensic Dossier Drawer Modal */}
      {selectedHotspotDossier && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
              <div>
                <span className="text-[10px] font-mono text-purple uppercase font-bold">
                  HOTSPOT FORENSIC DOSSIER • {selectedHotspotDossier.ward}
                </span>
                <h3 className="text-base font-bold text-ink mt-0.5">{selectedHotspotDossier.name}</h3>
              </div>
              <button
                onClick={() => setSelectedHotspotDossier(null)}
                className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
                <div className="p-2.5 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">10-Yr Incidents</span>
                  <div className="text-lg font-bold text-status-alert">{selectedHotspotDossier.events10Y} Events</div>
                </div>
                <div className="p-2.5 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Worst Peak Depth</span>
                  <div className="text-lg font-bold text-ink">{selectedHotspotDossier.maxDepthCm} cm</div>
                </div>
                <div className="p-2.5 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Avg Duration</span>
                  <div className="text-lg font-bold text-purple">{selectedHotspotDossier.avgDurationH} hrs</div>
                </div>
                <div className="p-2.5 bg-surface-secondary rounded-lg border border-border">
                  <span className="text-[10px] text-ink-secondary">Economic Exposure</span>
                  <div className="text-lg font-bold text-status-warning">₹{selectedHotspotDossier.economicExposureCr} Cr</div>
                </div>
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-1">
                <strong className="text-ink font-mono text-xs block">Root Cause Engineering Diagnosis:</strong>
                <p className="text-ink-secondary leading-relaxed">{selectedHotspotDossier.rootCause}</p>
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-1">
                <strong className="text-ink font-mono text-xs block">Vulnerable Infrastructure &amp; Life-Lines:</strong>
                <p className="text-ink-secondary leading-relaxed">{selectedHotspotDossier.criticalInfraRisk}</p>
              </div>

              <div className="p-3 bg-status-safe-soft rounded-xl border border-status-safe/30 space-y-1">
                <strong className="text-status-safe font-mono text-xs block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Implemented Mitigation Works:
                </strong>
                <p className="text-ink leading-relaxed">{selectedHotspotDossier.mitigationsDone}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-ink font-mono text-xs uppercase">Annual Recurrence History (2020–2026):</span>
                <div className="grid grid-cols-7 gap-1 font-mono text-center">
                  {selectedHotspotDossier.recentYearLog.map((y) => (
                    <div key={y.year} className="p-2 bg-surface-secondary border border-border rounded-lg">
                      <div className="text-[10px] text-ink-secondary">'{String(y.year).slice(2)}</div>
                      <div className="font-bold text-status-alert text-xs mt-0.5">{y.events} ev</div>
                      <div className="text-[9px] text-ink-secondary">{y.maxDepth}cm</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border bg-surface-subtle flex justify-end">
              <button
                onClick={() => setSelectedHotspotDossier(null)}
                className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary font-semibold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20 Operational Feature Modals + 1 Exporter Modal */}
      <ForensicAuditExportModal
        isOpen={modals.exportAudit}
        onClose={() => toggleModal('exportAudit', false)}
      />
      <StormComparatorModal
        isOpen={modals.comparator}
        onClose={() => toggleModal('comparator', false)}
      />
      <IDFCurveAnalyzerModal
        isOpen={modals.idfCurves}
        onClose={() => toggleModal('idfCurves', false)}
      />
      <ClimateChangeAnomalyModal
        isOpen={modals.climateAnomaly}
        onClose={() => toggleModal('climateAnomaly', false)}
      />
      <WaterBudgetForensicsModal
        isOpen={modals.waterBudget}
        onClose={() => toggleModal('waterBudget', false)}
      />
      <CompoundTidalFloodModal
        isOpen={modals.compoundTide}
        onClose={() => toggleModal('compoundTide', false)}
      />
      <WardVulnerabilityScorecardModal
        isOpen={modals.wardScorecard}
        onClose={() => toggleModal('wardScorecard', false)}
      />
      <ForensicRootCauseTreeModal
        isOpen={modals.rootCauseTree}
        onClose={() => toggleModal('rootCauseTree', false)}
      />
      <PumpingTelemetryArchiveModal
        isOpen={modals.pumpingArchive}
        onClose={() => toggleModal('pumpingArchive', false)}
      />
      <EconomicLossLedgerModal
        isOpen={modals.economicLoss}
        onClose={() => toggleModal('economicLoss', false)}
      />
      <InundationHydrographModal
        isOpen={modals.inundationHydrograph}
        onClose={() => toggleModal('inundationHydrograph', false)}
      />
      <HotspotMigrationMapModal
        isOpen={modals.hotspotMigration}
        onClose={() => toggleModal('hotspotMigration', false)}
      />
      <CitizenDistressArchiveModal
        isOpen={modals.citizenDistress}
        onClose={() => toggleModal('citizenDistress', false)}
      />
      <RadarGaugeBiasAuditModal
        isOpen={modals.radarBias}
        onClose={() => toggleModal('radarBias', false)}
      />
      <SatelliteSARArchiveModal
        isOpen={modals.satelliteSAR}
        onClose={() => toggleModal('satelliteSAR', false)}
      />
      <NallahDesiltingAuditModal
        isOpen={modals.nallahDesilting}
        onClose={() => toggleModal('nallahDesilting', false)}
      />
      <CriticalInfraImpactModal
        isOpen={modals.criticalInfra}
        onClose={() => toggleModal('criticalInfra', false)}
      />
      <ModelCalibrationWorkbenchModal
        isOpen={modals.modelCalibration}
        onClose={() => toggleModal('modelCalibration', false)}
      />
      <AlertVerificationAuditModal
        isOpen={modals.alertVerification}
        onClose={() => toggleModal('alertVerification', false)}
      />
      <MicroclimateUHIModal
        isOpen={modals.microclimateUHI}
        onClose={() => toggleModal('microclimateUHI', false)}
      />
      <AnalogStormFinderModal
        isOpen={modals.analogStorm}
        onClose={() => toggleModal('analogStorm', false)}
      />
    </div>
  );
}
