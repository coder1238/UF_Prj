import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';
import {
  WARDS,
  THREAT_LEVELS,
} from '../data/floodData';
import {
  CloudRain,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  Gauge,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  ArrowRight,
  Waves,
  Truck,
  Eye,
  PhoneCall,
  Building,
  FileText,
  Users,
  Volume2,
  VolumeX,
  Printer,
  Sparkles,
  Plus,
  Maximize2,
  LifeBuoy,
  Building2,
  ChevronDown,
  Check,
} from 'lucide-react';

// Import All 20 Operational Modals & Drilldown Drawers
import {
  SluiceGateConsoleModal,
  PumpFleetDispatcherModal,
  CCTVVisionFeedsModal,
  CitizenReportsTriageModal,
  CAPAlertComposerModal,
  CriticalInfraModal,
  HydrodynamicChartModal,
  QuickIncidentCreatorModal,
  VMSControllerModal,
  AIModelExplainerModal,
  VehicleClearanceModal,
  EvacuationSheltersModal,
  ShiftLogbookModal,
  InterAgencyHubModal,
  DrainageSurchargeMatrixModal,
  DopplerRadarModal,
  SupplyDepotModal,
  EscalationMatrixModal,
  SITREPReportModal,
  RapidBarricadeModal,
  DrainageTeleInspectionModal,
  TrafficDiversionModal,
  RainfallTelemetryModal,
  AffectedRoadsModal,
} from '../components/command/CommandFeatureModals';

export default function CommandCenter() {
  const {
    nowcastMinutes,
    selectedWard,
    setSelectedWard,
    threatLevel,
    isSirenActive,
    toggleSiren,
    vmsSigns,
    citizenReportsList,
    setMapFocusTarget,
  } = useFloodCommand();

  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // String identifier for modal
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const wardMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wardMenuRef.current && !wardMenuRef.current.contains(event.target)) {
        setIsWardDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Telemetry calculation derived from nowcastMinutes & selectedWard
  const telemetry = useMemo(() => {
    const isAll = selectedWard === 'all';
    // Base curves reacting to nowcast timeline
    const factor = Math.sin((nowcastMinutes / 180) * Math.PI);
    const rain = +(isAll ? (68.4 + factor * 22.8).toFixed(1) : (74.2 + factor * 20.1).toFixed(1));
    const peak = +(91.2 + (isAll ? 0 : 4.5)).toFixed(1);
    const affectedRoads = Math.round(isAll ? 27 + factor * 7 : 7 + factor * 3);
    const criticalNodes = Math.round(isAll ? 6 + factor * 4 : 2 + factor * 2);
    const incidents = Math.round(isAll ? 4 + factor * 3 : 1 + factor * 2);
    const confidence = +(92.4 - nowcastMinutes * 0.03).toFixed(1);

    return {
      rain,
      peak,
      affectedRoads,
      criticalNodes,
      incidents,
      confidence,
    };
  }, [nowcastMinutes, selectedWard]);

  // Current threat level definition
  const currentThreat = THREAT_LEVELS.find((t) => t.code === threatLevel) || THREAT_LEVELS[3];

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-64px)] select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-border/30 text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-status-safe" />
          <span>{toastMessage}</span>
        </div>
      )}

      <section className="flex flex-wrap items-end justify-between gap-3 px-1 pt-1" aria-labelledby="command-center-title">
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-purple">HydroSense · Municipal Operations</p>
          <h1 id="command-center-title" className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">Command Center</h1>
          <p className="max-w-2xl text-xs leading-relaxed text-ink-secondary sm:text-sm">Live flood conditions, ward priorities, and response actions in one operational view.</p>
        </div>
        <div className="mb-0.5 inline-flex items-center gap-2 rounded-full border border-status-safe/20 bg-status-safe-soft px-3 py-1.5 text-[11px] font-semibold text-status-safe">
          <span className="h-2 w-2 rounded-full bg-status-safe" /> Live monitoring active
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. MUNICIPAL THREAT LEVEL & FEATURE QUICK LAUNCH STRIP                     */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        {/* Threat Level Switcher & Siren Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('ESCALATION_MATRIX')}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${currentThreat.badgeColor}`}
            title="Click to Change Municipal Disaster Threat Level"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{currentThreat.code}: {currentThreat.name.split(' (')[0]}</span>
            <span className="text-[10px] underline opacity-80 ml-1">Change SOP</span>
          </button>

          <button
            onClick={() => {
              toggleSiren();
              showToast(isSirenActive ? 'Audio Siren Muted' : 'Audio Warning Siren Activated!');
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
              isSirenActive
                ? 'bg-status-alert text-white border-status-alert animate-pulse'
                : 'bg-surface-secondary text-ink border-border hover:bg-surface'
            }`}
            title="Toggle Command Station Siren Audio"
          >
            {isSirenActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-ink-secondary" />}
            <span>{isSirenActive ? 'SIREN ACTIVE' : 'SIREN READY'}</span>
          </button>
        </div>

        {/* Live VMS Highway Notice Preview */}
        <div
          onClick={() => setActiveModal('VMS_CONTROLLER')}
          className="hidden md:flex items-center gap-2 bg-black/90 text-amber-400 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hover:border-amber-500 transition-colors"
          title="Click to Edit Highway VMS Billboards"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold">LIVE VMS:</span>
          <span className="truncate max-w-[280px] text-amber-300">
            {vmsSigns[0]?.currentText}
          </span>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('QUICK_INCIDENT')}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1 shadow-subtle transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>

          <button
            onClick={() => setActiveModal('SITREP_REPORT')}
            className="px-3 py-1.5 bg-surface hover:bg-surface-secondary border border-border text-ink rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Print Official Municipal Situation Report"
          >
            <Printer className="w-3.5 h-3.5 text-purple" />
            <span>SITREP Brief</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MULTI-WARD JURISDICTION MATRIX & SELECTION MENU                        */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-surface border border-border rounded-xl p-2.5 shadow-subtle">
        {/* Left: Ward Selection Dropdown Menu Button */}
        <div className="flex items-center gap-2">
          <div ref={wardMenuRef} className="relative">
            <button
              onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isWardDropdownOpen
                  ? 'border-purple bg-purple-soft/60 ring-2 ring-purple/20 text-purple'
                  : 'border-border bg-surface-secondary hover:bg-surface text-ink'
              }`}
              title="Click to Open Ward Selection Menu"
            >
              <Building2 className="w-3.5 h-3.5 text-purple" />
              <span className="font-mono text-[10px] font-bold text-purple bg-purple-soft px-1.5 py-0.5 rounded border border-purple/20">
                {WARDS.find((w) => w.id === selectedWard)?.code || 'ALL'}
              </span>
              <span className="font-bold text-ink max-w-[140px] truncate">
                {WARDS.find((w) => w.id === selectedWard)?.shortName || 'Mumbai Metro'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-secondary transition-transform duration-200 ${
                  isWardDropdownOpen ? 'rotate-180 text-purple' : ''
                }`}
              />
            </button>

            {/* In-Page Ward Selection Popover Menu */}
            {isWardDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-surface border border-border rounded-2xl shadow-elevated p-2 z-50 text-xs animate-scaleUp">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-ink-muted px-2.5 py-1.5 mb-1 border-b border-border/50">
                  <span>Municipal Jurisdiction</span>
                  <span className="text-purple font-semibold">{WARDS.length} Wards</span>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto p-0.5">
                  {WARDS.map((ward) => {
                    const isSelected = selectedWard === ward.id;
                    return (
                      <button
                        key={ward.id}
                        onClick={() => {
                          setSelectedWard(ward.id);
                          setIsWardDropdownOpen(false);
                          showToast(`Viewport Filtered: ${ward.name}`);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-purple text-white font-bold shadow-subtle'
                            : 'hover:bg-surface-secondary text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-surface-secondary text-ink-secondary border border-border'
                            }`}
                          >
                            {ward.code}
                          </span>
                          <div className="truncate">
                            <div className={`truncate ${isSelected ? 'text-white' : 'text-ink font-semibold'}`}>
                              {ward.shortName || ward.name.split(' (')[0]}
                            </div>
                            {ward.subAreas && (
                              <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-ink-secondary'}`}>
                                {ward.subAreas}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              isSelected
                                ? 'bg-white text-purple'
                                : ward.activeRisk === 'CRITICAL'
                                ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                                : ward.activeRisk === 'HIGH'
                                ? 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                                : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                            }`}
                          >
                            {ward.activeRisk}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <span className="hidden sm:inline text-border">|</span>
          <span className="hidden sm:inline text-[11px] font-mono font-bold text-ink-secondary uppercase">
            Quick Filter:
          </span>
        </div>

        {/* Right: Quick Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1 max-w-full">
          {WARDS.map((ward) => {
            const isSelected = selectedWard === ward.id;
            return (
              <button
                key={ward.id}
                onClick={() => {
                  setSelectedWard(ward.id);
                  showToast(`Viewport Filtered: ${ward.name}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple text-white shadow-subtle'
                    : 'bg-surface-secondary border border-border text-ink hover:bg-surface'
                }`}
              >
                <span>{ward.shortName || ward.name.split(' (')[0]}</span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : ward.activeRisk === 'CRITICAL'
                      ? 'bg-status-alert-soft text-status-alert'
                      : ward.activeRisk === 'HIGH'
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {ward.activeRisk}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC 6 TOP OPERATIONAL TELEMETRY KPI CARDS                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* KPI 1: Current Rainfall */}
        <div
          onClick={() => setActiveModal('RAINFALL_TELEMETRY')}
          className="bg-surface border border-border hover:border-purple/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Current Rainfall</span>
            <CloudRain className="w-4 h-4 text-purple group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{telemetry.rain}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">mm/hr</span>
          </div>
          <div className="text-[10px] font-mono text-status-warning flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% / last 15 min • Click AWS Grid</span>
          </div>
        </div>

        {/* KPI 2: Peak Forecast */}
        <div
          onClick={() => setActiveModal('HYDRO_CHART')}
          className="bg-surface border border-border hover:border-status-alert/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Peak Forecast</span>
            <TrendingUp className="w-4 h-4 text-status-alert group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-status-alert">{telemetry.peak}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">mm/hr</span>
          </div>
          <div className="text-[10px] font-mono text-ink-secondary mt-1">
            At 19:35 IST (+65m) • View Curve
          </div>
        </div>

        {/* KPI 3: Affected Roads */}
        <div
          onClick={() => setActiveModal('AFFECTED_ROADS')}
          className="bg-surface border border-border hover:border-status-warning/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Affected Roads</span>
            <AlertTriangle className="w-4 h-4 text-status-warning group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{telemetry.affectedRoads}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">corridors</span>
          </div>
          <div className="text-[10px] font-mono text-status-alert font-semibold mt-1">
            6 Closures • View Registry
          </div>
        </div>

        {/* KPI 4: Critical Surcharge Nodes */}
        <div
          onClick={() => setActiveModal('DRAINAGE_MATRIX')}
          className="bg-surface border border-border hover:border-purple/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Critical Nodes</span>
            <GitBranch className="w-4 h-4 text-purple group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-status-alert">{telemetry.criticalNodes}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">/ 142 mon.</span>
          </div>
          <div className="text-[10px] font-mono text-status-warning mt-1">
            Surcharge Active • Open Matrix
          </div>
        </div>

        {/* KPI 5: Active Incidents */}
        <div
          onClick={() => setActiveModal('QUICK_INCIDENT')}
          className="bg-surface border border-border hover:border-status-alert/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Active Incidents</span>
            <ShieldAlert className="w-4 h-4 text-status-alert group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{telemetry.incidents}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">operational</span>
          </div>
          <div className="text-[10px] font-mono text-status-safe font-semibold mt-1">
            Crews En Route • Dispatch Unit
          </div>
        </div>

        {/* KPI 6: Model AI Confidence */}
        <div
          onClick={() => setActiveModal('AI_MODELS')}
          className="bg-surface border border-border hover:border-status-safe/50 rounded-xl p-3.5 shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:shadow-elevated group"
        >
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-medium uppercase">
            <span>Model Confidence</span>
            <Gauge className="w-4 h-4 text-status-safe group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{telemetry.confidence}</span>
            <span className="text-xs font-mono text-ink-secondary ml-1">%</span>
          </div>
          <div className="text-[10px] font-mono text-status-safe font-semibold mt-1">
            SWE Hydro Twin • Tune Weights
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN WORKSPACE (65% MAP + 35% INTELLIGENCE & AUTHORITY CONSOLES)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: 65% Interactive Geospatial Map & Timeline */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          <InteractiveMapTwin height="520px" />
          <TimelineScrubber />
        </div>

        {/* Right: 35% Operational Intelligence & Decision Panel */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Causal Driver with Tide Gauge & Sluice Gate Control */}
          <div className="bg-purple-soft/60 border border-purple/30 rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-purple uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple animate-pulse" />
                Primary Causal Driver
              </span>
              <button
                onClick={() => setActiveModal('SLUICE_CONSOLE')}
                className="text-[10px] font-mono text-purple bg-white/80 hover:bg-white px-2 py-0.5 rounded border border-purple/30 font-bold transition-colors"
              >
                GATE OVERRIDE ↗
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg border border-purple/20">
              <div className="w-12 h-12 rounded-lg bg-purple text-white flex flex-col items-center justify-center font-mono font-bold">
                <span className="text-sm leading-none">4.25</span>
                <span className="text-[9px] opacity-80">m MSL</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-ink">Astronomical High Tide Peak (19:15 IST)</div>
                <div className="text-[10px] font-mono text-status-alert font-bold mt-0.5">
                  TIDAL LOCKOUT ACTIVE (+0.38 bar backpressure)
                </div>
              </div>
            </div>

            <p className="text-xs text-ink leading-relaxed font-medium">
              Gravity outfall discharge locked out at Mahim &amp; Mithi Creek barriers. Reverse flow surcharging low-lying arterial culverts.
            </p>
          </div>

          {/* Next 60 Minutes Intelligence Feed (Interactive!) */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ink-secondary" />
                Next 60 Minutes Intelligence
              </h2>
              <span className="text-[10px] font-mono font-semibold text-purple">NOWCAST FEED</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {/* Item 1: Andheri Subway */}
              <div
                onClick={() => {
                  setMapFocusTarget({
                    coords: [72.8468, 19.1197],
                    zoom: 15.5,
                    title: 'Andheri Subway Underpass',
                    subtitle: 'Current: 28cm | Est Peak: 52cm at 19:25 IST',
                  });
                  showToast('Map Centered on Andheri Subway');
                }}
                className="p-2.5 rounded-lg bg-surface-secondary border border-border hover:border-purple/50 cursor-pointer transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-status-warning">18:45 IST</span>
                    <span className="text-xs font-semibold text-ink group-hover:text-purple transition-colors">
                      Road Inundation Rising
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">Andheri Subway • Est. 38cm depth</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold bg-status-alert-soft text-status-alert px-1.5 py-0.5 rounded">
                    HIGH RISK
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal('CCTV_FEEDS');
                    }}
                    className="text-[9px] font-mono text-purple hover:underline"
                  >
                    View CCTV ↗
                  </button>
                </div>
              </div>

              {/* Item 2: Node D-204 */}
              <div
                onClick={() => {
                  setMapFocusTarget({
                    coords: [72.8812, 19.0668],
                    zoom: 15.5,
                    title: 'Drainage Node D-204 (Kurla West)',
                    subtitle: 'Backflow threat • Surcharge at 19:17 IST',
                  });
                  showToast('Map Centered on Node D-204');
                }}
                className="p-2.5 rounded-lg bg-surface-secondary border border-border hover:border-purple/50 cursor-pointer transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-status-alert">19:05 IST</span>
                    <span className="text-xs font-semibold text-ink group-hover:text-purple transition-colors">
                      Drainage Surcharge Imminent
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">Node D-204 (Kurla West) • Backflow threat</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold bg-status-alert-soft text-status-alert px-1.5 py-0.5 rounded">
                    CRITICAL
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal('TELE_INSPECTION');
                    }}
                    className="text-[9px] font-mono text-purple hover:underline"
                  >
                    Inspect ↗
                  </button>
                </div>
              </div>

              {/* Item 3: Sion East Circle */}
              <div
                onClick={() => {
                  setMapFocusTarget({
                    coords: [72.8619, 19.0392],
                    zoom: 15.5,
                    title: 'Sion East Circle Junction',
                    subtitle: 'Est. 43cm depth at 19:35 IST',
                  });
                  showToast('Map Centered on Sion East Circle');
                }}
                className="p-2.5 rounded-lg bg-surface-secondary border border-border hover:border-purple/50 cursor-pointer transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-status-alert">19:20 IST</span>
                    <span className="text-xs font-semibold text-ink group-hover:text-purple transition-colors">
                      Intersection Risk Peak
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">Sion East Circle • Est. 43cm depth</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold bg-status-alert-soft text-status-alert px-1.5 py-0.5 rounded">
                    CRITICAL
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal('VEHICLE_CLEARANCE');
                    }}
                    className="text-[9px] font-mono text-purple hover:underline"
                  >
                    Wading ↗
                  </button>
                </div>
              </div>

              {/* Item 4: LBS Marg */}
              <div
                onClick={() => {
                  setMapFocusTarget({
                    coords: [72.8835, 19.0645],
                    zoom: 15.0,
                    title: 'LBS Marg Corridor',
                    subtitle: 'Impassable for LMVs • 85% Congestion',
                  });
                  showToast('Map Centered on LBS Marg');
                }}
                className="p-2.5 rounded-lg bg-surface-secondary border border-border hover:border-purple/50 cursor-pointer transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">19:35 IST</span>
                    <span className="text-xs font-semibold text-ink group-hover:text-purple transition-colors">
                      Severe Corridor Overflow
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">LBS Marg Corridor • Impassable for LMVs</div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-status-warning-soft text-status-warning px-1.5 py-0.5 rounded">
                  ELEVATED
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Critical Decisions Required (Workable Modal Triggers!) */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <h2 className="text-xs font-bold text-ink uppercase tracking-wider">
              Critical Authority Decisions
            </h2>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveModal('RAPID_BARRICADE')}
                className="w-full py-2.5 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-between shadow-subtle transition-colors"
              >
                <span>Deploy Barricades — Andheri Subway</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModal('TELE_INSPECTION')}
                className="w-full py-2 px-3 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Inspect Drainage Node D-204</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple" />
              </button>

              <button
                onClick={() => setActiveModal('TRAFFIC_DIVERSION')}
                className="w-full py-2 px-3 bg-surface hover:bg-surface-secondary text-ink border border-border hover:border-purple rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Reroute Emergency Traffic to Freeway</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple" />
              </button>

              <button
                onClick={() => setActiveModal('CAP_BROADCAST')}
                className="w-full py-2 px-3 bg-status-alert-soft hover:bg-status-alert/20 text-status-alert border border-status-alert/30 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Broadcast Ward L &amp; K/E Flood Warning</span>
                <Radio className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. 20 DETAILED OPERATIONAL AUTHORITY MODULES TOOLBAR & CONTROL GRID       */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
              Municipal Operations Command Center Tools (20 Advanced Features)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary bg-surface-secondary px-2 py-0.5 rounded border border-border">
            100% OPERATIONAL FRONTEND CONTROLS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {/* F1: Multi-Ward Situation Matrix */}
          <button
            onClick={() => setActiveModal('AFFECTED_ROADS')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">01. MATRIX</span>
              <Maximize2 className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Ward Risk Grid</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Multi-ward exposure</span>
          </button>

          {/* F2: Sluice Gate Control Console */}
          <button
            onClick={() => setActiveModal('SLUICE_CONSOLE')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">02. SLUICE</span>
              <Waves className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Tidal Barriers</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Arabian sea outfalls</span>
          </button>

          {/* F3: Dewatering Pump Fleet */}
          <button
            onClick={() => setActiveModal('PUMP_FLEET')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">03. PUMPS</span>
              <Truck className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Pump Fleet Dispatch</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">8 High-capacity units</span>
          </button>

          {/* F4: CCTV Vision AI */}
          <button
            onClick={() => setActiveModal('CCTV_FEEDS')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">04. VISION</span>
              <Eye className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">CCTV Depth AI</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Live subway feeds</span>
          </button>

          {/* F5: Citizen SOS Triage */}
          <button
            onClick={() => setActiveModal('CITIZEN_TRIAGE')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">05. CITIZEN</span>
              <PhoneCall className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Citizen SOS Triage</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">
              {citizenReportsList.length} verified reports
            </span>
          </button>

          {/* F6: CAP Public Warning */}
          <button
            onClick={() => setActiveModal('CAP_BROADCAST')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">06. ALERT</span>
              <Radio className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">CAP Alert Broadcast</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Multi-channel NDMA push</span>
          </button>

          {/* F7: Critical Infrastructure */}
          <button
            onClick={() => setActiveModal('CRITICAL_INFRA')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">07. ASSETS</span>
              <Building className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Lifeline Infrastructure</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Hospitals &amp; Power grids</span>
          </button>

          {/* F8: Hydrodynamic Hyetograph */}
          <button
            onClick={() => setActiveModal('HYDRO_CHART')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">08. HYDRO</span>
              <TrendingUp className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Runoff Hyetograph</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Discharge curves</span>
          </button>

          {/* F9: Quick Incident Dispatch */}
          <button
            onClick={() => setActiveModal('QUICK_INCIDENT')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">09. TICKET</span>
              <ShieldAlert className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Incident Ticket</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Direct squad dispatch</span>
          </button>

          {/* F10: VMS Highway Signs */}
          <button
            onClick={() => setActiveModal('VMS_CONTROLLER')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">10. TRAFFIC</span>
              <FileText className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">VMS Sign Diverter</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Highway LED boards</span>
          </button>

          {/* F11: Multi-Model AI Ensemble */}
          <button
            onClick={() => setActiveModal('AI_MODELS')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">11. AI MODELS</span>
              <Gauge className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">AI Ensemble Engine</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Physics SWE + PINN</span>
          </button>

          {/* F12: Vehicle Clearance Simulator */}
          <button
            onClick={() => setActiveModal('VEHICLE_CLEARANCE')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">12. CLEARANCE</span>
              <Truck className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Vehicle Wading Check</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Sedan / SUV / Bus limits</span>
          </button>

          {/* F13: Evacuation Shelters Board */}
          <button
            onClick={() => setActiveModal('EVAC_SHELTERS')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">13. SHELTERS</span>
              <Users className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Evacuation Havens</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">BMC relief school camps</span>
          </button>

          {/* F14: Shift Commander Logbook */}
          <button
            onClick={() => setActiveModal('SHIFT_LOGBOOK')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">14. LOGBOOK</span>
              <FileText className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Commander Logbook</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Audit history &amp; Siren</span>
          </button>

          {/* F15: Inter-Agency Tactical Desk */}
          <button
            onClick={() => setActiveModal('INTER_AGENCY')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">15. AGENCIES</span>
              <Radio className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Inter-Agency Comms</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Police, NDRF &amp; Navy</span>
          </button>

          {/* F16: Underground SWMM Surcharge Matrix */}
          <button
            onClick={() => setActiveModal('DRAINAGE_MATRIX')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">16. CONDUITS</span>
              <GitBranch className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">SWMM Pipe Matrix</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">1.4k Nodes surcharge</span>
          </button>

          {/* F17: Doppler Radar Plume Scanner */}
          <button
            onClick={() => setActiveModal('DOPPLER_RADAR')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">17. RADAR</span>
              <CloudRain className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Doppler Reflectivity</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">IMD S-Band Plumes</span>
          </button>

          {/* F18: Municipal Supply Depots */}
          <button
            onClick={() => setActiveModal('SUPPLY_DEPOT')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">18. DEPOTS</span>
              <LifeBuoy className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Supply Inventory</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Boats, Sandbags &amp; Fuel</span>
          </button>

          {/* F19: Threat Level Matrix */}
          <button
            onClick={() => setActiveModal('ESCALATION_MATRIX')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">19. ESCALATE</span>
              <AlertTriangle className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Threat Level SOP</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Conditions Green to Red</span>
          </button>

          {/* F20: SITREP PDF/Print Briefing */}
          <button
            onClick={() => setActiveModal('SITREP_REPORT')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:border-purple/50 hover:bg-purple-soft/30 text-left transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-purple">20. SITREP</span>
              <Printer className="w-3 h-3 text-ink-muted group-hover:text-purple" />
            </div>
            <span className="text-xs font-bold text-ink">Print SITREP Brief</span>
            <span className="text-[10px] text-ink-secondary mt-0.5">Official BMC dispatch doc</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL & DRAWER DIALOG CONTROLLERS (CONDITIONALLY RENDERED)             */}
      {/* ========================================================================= */}
      {activeModal === 'SLUICE_CONSOLE' && (
        <SluiceGateConsoleModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'PUMP_FLEET' && (
        <PumpFleetDispatcherModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'CCTV_FEEDS' && (
        <CCTVVisionFeedsModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'CITIZEN_TRIAGE' && (
        <CitizenReportsTriageModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'CAP_BROADCAST' && (
        <CAPAlertComposerModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'CRITICAL_INFRA' && (
        <CriticalInfraModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'HYDRO_CHART' && (
        <HydrodynamicChartModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'QUICK_INCIDENT' && (
        <QuickIncidentCreatorModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'VMS_CONTROLLER' && (
        <VMSControllerModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'AI_MODELS' && (
        <AIModelExplainerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'VEHICLE_CLEARANCE' && (
        <VehicleClearanceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'EVAC_SHELTERS' && (
        <EvacuationSheltersModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'SHIFT_LOGBOOK' && (
        <ShiftLogbookModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'INTER_AGENCY' && (
        <InterAgencyHubModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'DRAINAGE_MATRIX' && (
        <DrainageSurchargeMatrixModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'DOPPLER_RADAR' && (
        <DopplerRadarModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'SUPPLY_DEPOT' && (
        <SupplyDepotModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'ESCALATION_MATRIX' && (
        <EscalationMatrixModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'SITREP_REPORT' && (
        <SITREPReportModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'RAPID_BARRICADE' && (
        <RapidBarricadeModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'TELE_INSPECTION' && (
        <DrainageTeleInspectionModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'TRAFFIC_DIVERSION' && (
        <TrafficDiversionModal onClose={() => setActiveModal(null)} showToast={showToast} />
      )}
      {activeModal === 'RAINFALL_TELEMETRY' && (
        <RainfallTelemetryModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'AFFECTED_ROADS' && (
        <AffectedRoadsModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
