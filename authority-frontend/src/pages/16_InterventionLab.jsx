import React, { useState, useMemo } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import { ROAD_CORRIDORS } from '../data/floodData';
import {
  EXTENDED_INTERVENTIONS,
  CORRIDOR_HYDRODYNAMICS,
  DETENTION_BASINS_DATA,
  MOBILE_PUMP_FLEET_DATA,
  TIDAL_SCHEDULE_DATA,
} from '../components/interventions/interventionConstants';

// 20 Domain Feature Components
import HydrographComparisonChart from '../components/interventions/HydrographComparisonChart';
import CustomInterventionModal from '../components/interventions/CustomInterventionModal';
import InterventionSpatialMap from '../components/interventions/InterventionSpatialMap';
import CombinatorialOptimizerModal from '../components/interventions/CombinatorialOptimizerModal';
import EconomicRoiCalculatorModal from '../components/interventions/EconomicRoiCalculatorModal';
import MobilePumpFleetDrawer from '../components/interventions/MobilePumpFleetDrawer';
import TidalSluiceSchedulerModal from '../components/interventions/TidalSluiceSchedulerModal';
import FloodBarrierModelerModal from '../components/interventions/FloodBarrierModelerModal';
import SensitivityStressLabModal from '../components/interventions/SensitivityStressLabModal';
import OperationalDirectiveModal from '../components/interventions/OperationalDirectiveModal';
import HydrodynamicDiagnosticsModal from '../components/interventions/HydrodynamicDiagnosticsModal';
import DetentionBasinMonitorModal from '../components/interventions/DetentionBasinMonitorModal';
import CorridorComparisonMatrixModal from '../components/interventions/CorridorComparisonMatrixModal';
import TrafficRestorationTimelineModal from '../components/interventions/TrafficRestorationTimelineModal';
import CrossAgencyMutualAidModal from '../components/interventions/CrossAgencyMutualAidModal';
import VmsCitizenBroadcastModal from '../components/interventions/VmsCitizenBroadcastModal';
import ScenarioBookmarkManagerModal from '../components/interventions/ScenarioBookmarkManagerModal';
import ElevationCrossSectionModal from '../components/interventions/ElevationCrossSectionModal';
import FieldPreflightChecklistModal from '../components/interventions/FieldPreflightChecklistModal';
import CounterfactualAuditReportModal from '../components/interventions/CounterfactualAuditReportModal';

import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Droplets,
  Layers,
  Shield,
  PlusCircle,
  Sliders,
  Send,
  Sparkles,
  MapPin,
  Search,
  RefreshCw,
  Compass,
  Table,
  DollarSign,
  Activity,
  Gauge,
  Waves,
  Building2,
  Tv,
  Bookmark,
  FileCheck,
  ShieldCheck,
  Bus,
  Cpu,
} from 'lucide-react';

export default function InterventionLab() {
  const { activeInterventions, toggleIntervention, addCommandLog } = useFloodCommand();

  // Selected Corridor State
  const [selectedCorridorId, setSelectedCorridorId] = useState('sion-circle');

  // Navigation Tabs: 'deck' | 'spatial' | 'matrix' | 'fleet' | 'roi'
  const [activeTab, setActiveTab] = useState('deck');

  // Master Interventions List (combines default extended catalogue + user custom created ones)
  const [interventionsList, setInterventionsList] = useState(EXTENDED_INTERVENTIONS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sensitivity Stress-Testing Parameters
  const [sensitivityParams, setSensitivityParams] = useState({
    rainMultiplier: 1.0,
    siltationPercent: 20,
    tidalSurgeM: 0.15,
    pumpFailureNMinusOne: false,
  });

  // Modal Open States for 20 Features
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isRoiOpen, setIsRoiOpen] = useState(false);
  const [isPumpDrawerOpen, setIsPumpDrawerOpen] = useState(false);
  const [isTidalModalOpen, setIsTidalModalOpen] = useState(false);
  const [isBarrierModalOpen, setIsBarrierModalOpen] = useState(false);
  const [isStressModalOpen, setIsStressModalOpen] = useState(false);
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
  const [isBasinModalOpen, setIsBasinModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isTrafficModalOpen, setIsTrafficModalOpen] = useState(false);
  const [isMutualAidOpen, setIsMutualAidOpen] = useState(false);
  const [isVmsModalOpen, setIsVmsModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isCrossSectionOpen, setIsCrossSectionOpen] = useState(false);
  const [isPreflightOpen, setIsPreflightOpen] = useState(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);

  // Success Toast for quick actions
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Resolve current selected corridor data
  const selectedCorridor = useMemo(() => {
    return (
      CORRIDOR_HYDRODYNAMICS[selectedCorridorId] ||
      ROAD_CORRIDORS.find((r) => r.id === selectedCorridorId) ||
      CORRIDOR_HYDRODYNAMICS['sion-circle']
    );
  }, [selectedCorridorId]);

  // Filtered active interventions
  const activeList = useMemo(() => {
    return interventionsList.filter((intv) => activeInterventions.includes(intv.id));
  }, [interventionsList, activeInterventions]);

  // Sensitivity composite factor
  const sensitivityMultiplier = useMemo(() => {
    const { rainMultiplier, siltationPercent, tidalSurgeM, pumpFailureNMinusOne } =
      sensitivityParams;
    return (
      rainMultiplier *
      (1 + (siltationPercent / 100) * 0.3) *
      (1 + tidalSurgeM * 0.12) *
      (pumpFailureNMinusOne ? 1.2 : 1.0)
    );
  }, [sensitivityParams]);

  // Calculations: Cumulative Head Mitigation & Hours Saved
  const totalDepthReduction = useMemo(() => {
    const rawSum = activeList.reduce((acc, curr) => acc + curr.deltaDepthReductionCm, 0);
    // Non-linear diminishing returns model
    return Math.round(rawSum * 0.85 * 10) / 10;
  }, [activeList]);

  const totalHoursSaved = useMemo(() => {
    const rawSum = activeList.reduce((acc, curr) => acc + curr.clearanceTimeSavedHours, 0);
    return Math.round(rawSum * 0.8 * 10) / 10;
  }, [activeList]);

  // Discharge / Diversion volume (m³/hr)
  const totalDischargeM3h = useMemo(() => {
    return activeList.reduce((acc, curr) => acc + (curr.capacityNum || 1500), 0);
  }, [activeList]);

  // Baseline vs Simulated Peak
  const baselinePeak = Math.round(
    (selectedCorridor.unmitigatedPeak || selectedCorridor.forecastPeak || 42) *
      sensitivityMultiplier *
      10
  ) / 10;

  const simulatedPeak = Math.max(
    4,
    Math.round((baselinePeak - totalDepthReduction * 0.45) * 10) / 10
  );

  const depthDelta = Math.round((baselinePeak - simulatedPeak) * 10) / 10;

  // Corridors protected calculation (count corridors with simulated head <= 25 cm)
  const protectedCorridorsCount = useMemo(() => {
    const all = Object.values(CORRIDOR_HYDRODYNAMICS);
    return all.filter((c) => {
      const sim = Math.max(4, c.unmitigatedPeak - totalDepthReduction * 0.45);
      return sim <= 25;
    }).length;
  }, [totalDepthReduction]);

  // Add custom intervention handler
  const handleAddCustomIntervention = (newIntv) => {
    setInterventionsList((prev) => [newIntv, ...prev]);
    if (!activeInterventions.includes(newIntv.id)) {
      toggleIntervention(newIntv.id);
    }
    showToast(`Custom Countermeasure "${newIntv.name}" added and coupled in solver.`);
  };

  // Portfolio application handler
  const handleApplyPortfolio = (ids) => {
    // activate all in portfolio
    ids.forEach((id) => {
      if (!activeInterventions.includes(id)) {
        toggleIntervention(id);
      }
    });
    // deactivate those not in portfolio
    activeInterventions.forEach((id) => {
      if (!ids.includes(id)) {
        toggleIntervention(id);
      }
    });
    showToast(`Optimal Portfolio applied (${ids.length} countermeasures engaged).`);
  };

  // Filtered interventions for catalog
  const filteredInterventions = useMemo(() => {
    return interventionsList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.affectedRoadRelief.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [interventionsList, selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-y-auto">
      {/* Module Operational Header */}
      <div className="bg-surface px-6 py-3.5 border-b border-border flex items-center justify-between flex-wrap gap-3 sticky top-0 z-30 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-purple px-2 py-0.5 rounded bg-purple-soft">
              MODULE 16
            </span>
            <h1 className="text-xl font-bold text-ink">
              Intervention Lab & Counterfactual Engine
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple text-white font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> HYDRO-PINN TWIN v2.4
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-ping"></span>
              SOLVER CONVERGED
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Real-time hydrodynamic intervention sandbox: simulate mobile dewatering pumps, tidal sluice triggers, and rapid-inflate flood barriers to forecast depth mitigation before deployment.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {toastMessage && (
            <span className="text-xs font-semibold text-status-safe bg-status-safe-soft px-3 py-1.5 rounded-lg border border-status-safe/30 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              {toastMessage}
            </span>
          )}

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3 py-2 bg-surface border border-border text-xs font-semibold text-ink rounded-lg hover:border-purple/40 hover:bg-purple-soft/30 transition-all flex items-center gap-1.5 shadow-subtle"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple" />
            <span>New Countermeasure</span>
          </button>

          <button
            onClick={() => setIsOptimizerOpen(true)}
            className="px-3 py-2 bg-purple-soft text-purple text-xs font-semibold rounded-lg hover:bg-purple hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfolio Optimizer</span>
          </button>

          <button
            onClick={() => setIsDirectiveModalOpen(true)}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Issue Operational Directives ({activeList.length})</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-6 pb-2">
        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle">
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Active Interventions</span>
            <Wrench className="w-3.5 h-3.5 text-purple" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple mt-1">
            {activeInterventions.length}{' '}
            <span className="text-xs font-normal text-ink-secondary">
              / {interventionsList.length} deployed
            </span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 truncate">
            {activeList.filter((i) => i.category === 'Active Dewatering').length} Pumps,{' '}
            {activeList.filter((i) => i.category === 'Hydraulic Diversion').length} Sluices,{' '}
            {activeList.filter((i) => i.category === 'Surface Water Deflection').length} Berms
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle">
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Peak Depth Mitigation</span>
            <TrendingDown className="w-3.5 h-3.5 text-status-safe" />
          </div>
          <div className="font-mono text-2xl font-bold text-status-safe mt-1">
            -{totalDepthReduction.toFixed(1)}{' '}
            <span className="text-xs font-normal text-ink-secondary">cm</span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5">
            Cumulative across target sumps
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle">
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Clearance Time Saved</span>
            <Clock className="w-3.5 h-3.5 text-purple" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple mt-1">
            {totalHoursSaved.toFixed(1)}{' '}
            <span className="text-xs font-normal text-ink-secondary">hours</span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5">
            Accelerated dry-out horizon
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle">
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Discharge / Diversion</span>
            <Droplets className="w-3.5 h-3.5 text-purple" />
          </div>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {totalDischargeM3h.toLocaleString()}{' '}
            <span className="text-xs font-normal text-ink-secondary">m³/hr</span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5">
            Combined active pump & sluice rate
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle">
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Corridors Protected</span>
            <Shield className="w-3.5 h-3.5 text-status-safe" />
          </div>
          <div className="font-mono text-2xl font-bold text-status-safe mt-1">
            {protectedCorridorsCount}{' '}
            <span className="text-xs font-normal text-ink-secondary">
              of {Object.keys(CORRIDOR_HYDRODYNAMICS).length} critical roads
            </span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 truncate">
            Water level kept &le; 25cm
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Feature Quick Launchers Bar */}
      <div className="px-6 py-2 flex items-center justify-between flex-wrap gap-2 border-b border-border bg-surface-subtle">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'deck', label: 'Intervention Deck & Controls', icon: Sliders },
            { id: 'spatial', label: 'Spatial GIS Twin', icon: Compass },
            { id: 'matrix', label: 'Multi-Corridor Matrix', icon: Table },
            { id: 'fleet', label: 'Asset & Sump Telemetry', icon: Gauge },
            { id: 'roi', label: 'ROI & Scenario Sandbox', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple text-white shadow-subtle'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Launchers for Modals */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setIsStressModalOpen(true)}
            className="px-2.5 py-1 rounded-md border border-border bg-white text-ink-secondary hover:text-ink hover:border-purple/40 flex items-center gap-1 transition-all"
            title="Stress-Testing Sliders"
          >
            <Sliders className="w-3 h-3 text-purple" />
            <span>Sensitivity ({sensitivityMultiplier.toFixed(2)}x)</span>
          </button>

          <button
            onClick={() => setIsRoiOpen(true)}
            className="px-2.5 py-1 rounded-md border border-border bg-white text-ink-secondary hover:text-ink hover:border-purple/40 flex items-center gap-1 transition-all"
            title="Economic Loss Avoidance"
          >
            <DollarSign className="w-3 h-3 text-status-safe" />
            <span>Economic ROI</span>
          </button>

          <button
            onClick={() => setIsBookmarkModalOpen(true)}
            className="px-2.5 py-1 rounded-md border border-border bg-white text-ink-secondary hover:text-ink hover:border-purple/40 flex items-center gap-1 transition-all"
            title="Scenario Snapshots"
          >
            <Bookmark className="w-3 h-3 text-purple" />
            <span>Snapshots</span>
          </button>

          <button
            onClick={() => setIsAuditReportOpen(true)}
            className="px-2.5 py-1 rounded-md border border-border bg-white text-ink-secondary hover:text-ink hover:border-purple/40 flex items-center gap-1 transition-all"
            title="Certified Engineering Audit"
          >
            <FileCheck className="w-3 h-3 text-purple" />
            <span>Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Viewport */}
      {activeTab === 'deck' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 pt-3">
          {/* Left Column: Interventions Inventory & Control Deck (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4">
              {/* Catalog Header with Search & Filter */}
              <div className="flex items-center justify-between mb-3 border-b border-border pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple" />
                    Hydraulic Intervention Catalog
                  </h2>
                  <p className="text-xs text-ink-secondary">
                    Toggle interventions to inject real-time boundary conditions into the hydraulic model.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      const allIds = interventionsList.map((i) => i.id);
                      allIds.forEach((id) => {
                        if (!activeInterventions.includes(id)) toggleIntervention(id);
                      });
                      showToast('All interventions activated in hydrodynamic model.');
                    }}
                    className="px-2.5 py-1 rounded-md bg-purple-soft text-purple font-semibold hover:bg-purple hover:text-white transition-all"
                  >
                    Engage All
                  </button>
                  <button
                    onClick={() => {
                      activeInterventions.forEach((id) => toggleIntervention(id));
                      showToast('All interventions deactivated (Baseline mode).');
                    }}
                    className="px-2.5 py-1 rounded-md border border-border bg-surface-secondary text-ink-secondary font-semibold hover:text-ink transition-all"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    'ALL',
                    'Active Dewatering',
                    'Hydraulic Diversion',
                    'Surface Water Deflection',
                    'Retention Storage',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-purple text-white shadow-subtle'
                          : 'bg-surface-secondary text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Types' : cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2 text-ink-secondary" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 pr-2.5 py-1 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple w-40"
                  />
                </div>
              </div>

              {/* List of Interventions */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredInterventions.map((item) => {
                  const isActive = activeInterventions.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'border-purple bg-purple-soft/30 shadow-subtle'
                          : 'border-border bg-white hover:border-purple/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                item.category === 'Active Dewatering'
                                  ? 'bg-blue-100 text-blue-700'
                                  : item.category === 'Hydraulic Diversion'
                                  ? 'bg-purple-soft text-purple-deep'
                                  : item.category === 'Surface Water Deflection'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.category}
                            </span>
                            <span className="text-xs font-bold text-ink">{item.name}</span>
                            {item.isCustom && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple text-white font-bold">
                                CUSTOM
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-ink-secondary mt-1 flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-ink">{item.targetLocation}</span>
                            <span>•</span>
                            <span className="font-mono">{item.capacity}</span>
                            {item.powerType && (
                              <>
                                <span>•</span>
                                <span className="text-[10px] text-ink-secondary">{item.powerType}</span>
                              </>
                            )}
                          </div>

                          <div className="mt-2.5 flex items-center gap-4 text-xs flex-wrap">
                            <div className="flex items-center gap-1 text-status-safe font-semibold">
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>-{item.deltaDepthReductionCm} cm peak</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple font-semibold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>+{item.clearanceTimeSavedHours}h clearance</span>
                            </div>
                            <div className="text-ink-secondary font-mono text-[11px]">
                              Setup: {item.setupTimeMin} min
                            </div>
                            {item.costLakhs && (
                              <div className="text-ink-secondary font-mono text-[11px]">
                                Cost: ₹{item.costLakhs} L
                              </div>
                            )}
                          </div>

                          <div className="mt-2 text-[11px] text-ink-secondary bg-surface-secondary/70 px-2.5 py-1 rounded">
                            <span className="font-semibold text-ink">Impact:</span>{' '}
                            {item.affectedRoadRelief}
                          </div>
                        </div>

                        {/* Toggle & Action */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleIntervention(item.id)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-purple text-white shadow-subtle hover:bg-purple-deep'
                                : 'bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple border border-border'
                            }`}
                          >
                            {isActive ? 'Active (Engaged)' : 'Simulate / Deploy'}
                          </button>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isActive
                                ? 'bg-status-safe-soft text-status-safe font-semibold'
                                : 'bg-surface-secondary text-ink-secondary'
                            }`}
                          >
                            {isActive ? 'COUPLED IN SOLVER' : 'STANDBY'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Hydrograph Comparison Chart (Feature 1) */}
            <HydrographComparisonChart
              corridorData={selectedCorridor}
              activeInterventionsCount={activeList.length}
              depthMitigationCm={depthDelta}
              sensitivityFactor={sensitivityMultiplier}
            />
          </div>

          {/* Right Column: Comparative Before-vs-After Delta Engine (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-purple" />
                    Before vs. After Delta Analytics
                  </h3>
                  <p className="text-xs text-ink-secondary">
                    Counterfactual comparison for critical choke-points.
                  </p>
                </div>

                {/* Corridor Selector */}
                <select
                  value={selectedCorridorId}
                  onChange={(e) => setSelectedCorridorId(e.target.value)}
                  className="text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 font-medium text-ink focus:outline-none focus:border-purple"
                >
                  {Object.values(CORRIDOR_HYDRODYNAMICS).map((road) => (
                    <option key={road.id} value={road.id}>
                      {road.name.split('(')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Target Deep Dive */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-ink">
                  <span>{selectedCorridor.name}</span>
                  <span className="font-mono text-purple">{selectedCorridor.ward}</span>
                </div>
                <div className="text-[11px] text-ink-secondary mt-0.5">
                  Elevation: {selectedCorridor.elevation}m MSL • Cause: {selectedCorridor.cause}
                </div>
              </div>

              {/* Depth Delta Comparison Card */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-xl border border-status-alert/30 bg-status-alert-soft/20 text-center">
                  <span className="text-[11px] font-mono text-status-alert uppercase font-semibold">
                    Without Intervention
                  </span>
                  <div className="font-mono text-3xl font-bold text-status-alert mt-1">
                    {baselinePeak} <span className="text-sm font-normal">cm</span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-1">
                    Peak at {selectedCorridor.peakTime || '19:30 IST'}
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-status-alert text-white font-medium">
                    {baselinePeak >= 30 ? 'ROAD IMPASSABLE' : 'HIGH WATER'}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-status-safe/30 bg-status-safe-soft/30 text-center">
                  <span className="text-[11px] font-mono text-status-safe uppercase font-semibold">
                    With Interventions ({activeList.length})
                  </span>
                  <div className="font-mono text-3xl font-bold text-status-safe mt-1">
                    {simulatedPeak} <span className="text-sm font-normal">cm</span>
                  </div>
                  <div className="text-[11px] text-status-safe font-semibold mt-1">
                    Mitigated by -{depthDelta} cm
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe text-white font-medium">
                    {simulatedPeak <= 25 ? 'EMERGENCY TRAFFIC RESTORED' : 'REDUCED SUBMERGENCE'}
                  </span>
                </div>
              </div>

              {/* Visual Depth Bar Graph */}
              <div className="p-3 bg-surface-subtle rounded-xl border border-border mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-ink mb-1.5">
                  <span>Inundation Head Reduction</span>
                  <span className="font-mono text-status-safe font-bold">
                    -{Math.round((depthDelta / Math.max(1, baselinePeak)) * 100)}% Water Depth
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-status-safe h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((simulatedPeak / Math.max(1, baselinePeak)) * 100)
                      )}%`,
                    }}
                    title="Simulated Depth"
                  />
                  <div
                    className="bg-status-alert/40 h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((depthDelta / Math.max(1, baselinePeak)) * 100)
                      )}%`,
                    }}
                    title="Mitigated Volume"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary mt-1">
                  <span>Mitigated Level: {simulatedPeak} cm</span>
                  <span>Unmitigated: {baselinePeak} cm</span>
                </div>
              </div>

              {/* Tactical Corridor Feature Launchers (8 Deep Domain Actions) */}
              <div className="p-3.5 bg-surface-secondary/60 rounded-xl border border-border mb-4 space-y-2">
                <div className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                  <span>Corridor Tactical Toolset</span>
                  <span className="text-[10px] text-purple font-mono">8 WORKABLE ACTIONS</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsCrossSectionOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple" />
                    <span>DSM Cross-Section</span>
                  </button>

                  <button
                    onClick={() => setIsTrafficModalOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Transit Restoration</span>
                  </button>

                  <button
                    onClick={() => setIsDiagnosticsModalOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Physics Diagnostics</span>
                  </button>

                  <button
                    onClick={() => setIsBarrierModalOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Barrier CAD Modeler</span>
                  </button>

                  <button
                    onClick={() => setIsVmsModalOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Tv className="w-3.5 h-3.5 text-purple" />
                    <span>Highway VMS Broadcast</span>
                  </button>

                  <button
                    onClick={() => setIsPreflightOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-status-safe" />
                    <span>Pre-Flight Safety QA</span>
                  </button>

                  <button
                    onClick={() => setIsPumpDrawerOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Mobile Pump Fleet</span>
                  </button>

                  <button
                    onClick={() => setIsMutualAidOpen(true)}
                    className="p-2 rounded-lg bg-white border border-border text-left hover:border-purple/40 hover:bg-purple-soft/20 text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-subtle"
                  >
                    <Building2 className="w-3.5 h-3.5 text-purple" />
                    <span>Navy / NDRF Requisition</span>
                  </button>
                </div>
              </div>

              {/* Time Horizon Recovery Comparison */}
              <div className="p-3.5 bg-surface rounded-xl border border-border flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple" />
                    Estimated Street Clearance Horizon
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-surface-secondary">
                      <span className="text-ink-secondary">Unmitigated Drain-down:</span>
                      <span className="font-mono font-bold text-status-alert">
                        22:45 IST (4h 15m)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-purple-soft/40 border border-purple/20">
                      <span className="text-ink font-semibold">
                        With Interventions Active:
                      </span>
                      <span className="font-mono font-bold text-purple">
                        {totalHoursSaved >= 2.0 ? '19:50 IST (1h 15m)' : '20:30 IST (1h 55m)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary SOP Dispatch Trigger */}
                <div className="pt-3 border-t border-border mt-3">
                  <button
                    onClick={() => setIsDirectiveModalOpen(true)}
                    className="w-full py-2.5 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Intervention Directive to Ward Control
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spatial GIS Twin Canvas (Feature 3) */}
      {activeTab === 'spatial' && (
        <div className="p-6">
          <InterventionSpatialMap
            interventions={interventionsList}
            activeInterventions={activeInterventions}
            toggleIntervention={toggleIntervention}
            selectedCorridorId={selectedCorridorId}
            onSelectCorridor={(id) => setSelectedCorridorId(id)}
          />
        </div>
      )}

      {/* Tab 3: Multi-Corridor Comparative Matrix (Feature 13) */}
      {activeTab === 'matrix' && (
        <div className="p-6">
          <div className="bg-surface rounded-xl border border-border shadow-subtle p-4">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Table className="w-4 h-4 text-purple" />
                  Corridor Counterfactual Matrix & Vulnerability Rankings
                </h3>
                <p className="text-xs text-ink-secondary">
                  Compare water head mitigation and traffic recovery across all metropolitan sumps.
                </p>
              </div>
              <button
                onClick={() => setIsMatrixModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep"
              >
                Open Fullscreen Table & Export
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(CORRIDOR_HYDRODYNAMICS).map((c) => {
                const mitPeak = Math.max(
                  4,
                  Math.round((c.unmitigatedPeak - depthDelta * 0.45) * 10) / 10
                );
                const delta = Math.round((c.unmitigatedPeak - mitPeak) * 10) / 10;
                const isSelected = selectedCorridorId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCorridorId(c.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple bg-purple-soft/30 shadow-subtle'
                        : 'border-border bg-white hover:border-purple/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink">{c.name.split('(')[0]}</span>
                      <span className="font-mono text-purple font-semibold">{c.ward}</span>
                    </div>
                    <div className="text-[10px] text-ink-secondary mt-0.5 line-clamp-1">
                      {c.cause}
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2.5 p-2 bg-surface-secondary rounded-lg font-mono text-center text-xs">
                      <div>
                        <span className="text-[10px] text-ink-secondary block">Baseline</span>
                        <strong className="text-status-alert">{c.unmitigatedPeak} cm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink-secondary block">Mitigated</span>
                        <strong className="text-status-safe">{mitPeak} cm</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border">
                      <span className="text-status-safe font-semibold">-{delta} cm Drop</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          mitPeak <= 25
                            ? 'bg-status-safe-soft text-status-safe'
                            : 'bg-status-alert-soft text-status-alert'
                        }`}
                      >
                        {mitPeak <= 25 ? 'PASSABLE' : 'IMPEDED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Asset & Sump Telemetry Hub (Features 6, 7, 12) */}
      {activeTab === 'fleet' && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mobile Pumps Hub Card */}
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Gauge className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-status-safe bg-status-safe-soft px-2 py-0.5 rounded">
                    4 UNITS ACTIVE
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Mobile Dewatering Fleet</h4>
                <p className="text-xs text-ink-secondary mt-1">
                  Engine CAN-bus telematics, RPM tachometers, fuel bowser coordination, and emergency 115% overdrive controls.
                </p>
              </div>
              <button
                onClick={() => setIsPumpDrawerOpen(true)}
                className="mt-4 w-full py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <span>Launch Pump Fleet Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tidal Sluice Gates Card */}
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
                    <Waves className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    SPRING TIDE 4.87m
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Tidal Sluice Outfall Automation</h4>
                <p className="text-xs text-ink-secondary mt-1">
                  Mahim Creek, Love Grove, and CleaveLand Bandar flap gates with automated tidal lockout and backwater reverse protection.
                </p>
              </div>
              <button
                onClick={() => setIsTidalModalOpen(true)}
                className="mt-4 w-full py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <span>Open Sluice Scheduler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Detention Basins Card */}
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <Droplets className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                    32,000 m³ BUFFER
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Underground Holding Tanks</h4>
                <p className="text-xs text-ink-secondary mt-1">
                  Pramod Mahajan Dadar holding basin and Milan underground sump live fill telemetry, headroom countdown, and siphon pumps.
                </p>
              </div>
              <button
                onClick={() => setIsBasinModalOpen(true)}
                className="mt-4 w-full py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <span>View Retention Buffers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: ROI & Optimization (Features 4, 5, 17) */}
      {activeTab === 'roi' && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Optimizer Preview Card */}
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Combinatorial Multi-Intervention Optimizer</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Calculates the mathematical Pareto Frontier across all 2^{interventionsList.length} possible deployment combinations, ranking portfolios by mitigation depth, budget cap, and speed.
              </p>
              <button
                onClick={() => setIsOptimizerOpen(true)}
                className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep shadow-subtle flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Optimizer Solver</span>
              </button>
            </div>

            {/* Economic ROI Preview Card */}
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-5 space-y-3">
              <div className="flex items-center gap-2 text-status-safe font-bold text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Quantified Economic Loss Avoidance Engine</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Transforms hydrodynamic reduction centimeters into tangible public economic savings: commercial vehicle delay hours, engine hydrolock prevention, and municipal cost-benefit ratio (BCR).
              </p>
              <button
                onClick={() => setIsRoiOpen(true)}
                className="px-4 py-2 bg-status-safe text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-subtle flex items-center gap-2"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Open Economic ROI Model</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20 Interlocking Feature Modals & Drawers */}
      <CustomInterventionModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddIntervention={handleAddCustomIntervention}
      />

      <CombinatorialOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        allInterventions={interventionsList}
        activeInterventions={activeInterventions}
        onApplyPortfolio={handleApplyPortfolio}
      />

      <EconomicRoiCalculatorModal
        isOpen={isRoiOpen}
        onClose={() => setIsRoiOpen(false)}
        activeInterventionsList={activeList}
        corridorsCount={Object.keys(CORRIDOR_HYDRODYNAMICS).length}
      />

      <MobilePumpFleetDrawer
        isOpen={isPumpDrawerOpen}
        onClose={() => setIsPumpDrawerOpen(false)}
      />

      <TidalSluiceSchedulerModal
        isOpen={isTidalModalOpen}
        onClose={() => setIsTidalModalOpen(false)}
      />

      <FloodBarrierModelerModal
        isOpen={isBarrierModalOpen}
        onClose={() => setIsBarrierModalOpen(false)}
        selectedCorridorName={selectedCorridor.name}
      />

      <SensitivityStressLabModal
        isOpen={isStressModalOpen}
        onClose={() => setIsStressModalOpen(false)}
        sensitivityParams={sensitivityParams}
        onChangeParams={(next) => setSensitivityParams(next)}
        onResetParams={() =>
          setSensitivityParams({
            rainMultiplier: 1.0,
            siltationPercent: 20,
            tidalSurgeM: 0.15,
            pumpFailureNMinusOne: false,
          })
        }
      />

      <OperationalDirectiveModal
        isOpen={isDirectiveModalOpen}
        onClose={() => setIsDirectiveModalOpen(false)}
        selectedCorridor={selectedCorridor}
        activeInterventionsList={activeList}
        depthMitigationCm={depthDelta}
      />

      <HydrodynamicDiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
        corridorData={selectedCorridor}
      />

      <DetentionBasinMonitorModal
        isOpen={isBasinModalOpen}
        onClose={() => setIsBasinModalOpen(false)}
      />

      <CorridorComparisonMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        activeInterventionsCount={activeList.length}
        depthMitigationCm={depthDelta}
      />

      <TrafficRestorationTimelineModal
        isOpen={isTrafficModalOpen}
        onClose={() => setIsTrafficModalOpen(false)}
        selectedCorridorName={selectedCorridor.name}
        depthMitigationCm={depthDelta}
        hoursSaved={totalHoursSaved}
      />

      <CrossAgencyMutualAidModal
        isOpen={isMutualAidOpen}
        onClose={() => setIsMutualAidOpen(false)}
      />

      <VmsCitizenBroadcastModal
        isOpen={isVmsModalOpen}
        onClose={() => setIsVmsModalOpen(false)}
        selectedCorridorName={selectedCorridor.name}
        simulatedPeak={simulatedPeak}
        hoursSaved={totalHoursSaved}
      />

      <ScenarioBookmarkManagerModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        activeInterventions={activeInterventions}
        depthMitigationCm={depthDelta}
        onRestoreScenario={(ids) => handleApplyPortfolio(ids)}
      />

      <ElevationCrossSectionModal
        isOpen={isCrossSectionOpen}
        onClose={() => setIsCrossSectionOpen(false)}
        selectedCorridor={selectedCorridor}
        baselineDepthCm={baselinePeak}
        simulatedDepthCm={simulatedPeak}
      />

      <FieldPreflightChecklistModal
        isOpen={isPreflightOpen}
        onClose={() => setIsPreflightOpen(false)}
        selectedCorridorName={selectedCorridor.name}
        onCertificationComplete={() =>
          showToast('Pre-flight field safety certification complete.')
        }
      />

      <CounterfactualAuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        selectedCorridor={selectedCorridor}
        activeInterventionsList={activeList}
        depthMitigationCm={depthDelta}
        hoursSaved={totalHoursSaved}
        baselinePeak={baselinePeak}
        simulatedPeak={simulatedPeak}
      />
    </div>
  );
}
