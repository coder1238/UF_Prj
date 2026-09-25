import React, { useState, useMemo } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import CCTVCanvasStream from '../components/cctv/CCTVCanvasStream';
import CCTVQuadMatrix from '../components/cctv/CCTVQuadMatrix';
import CCTVEnKFTunerModal from '../components/cctv/CCTVEnKFTunerModal';
import CCTVVehicleTracker from '../components/cctv/CCTVVehicleTracker';
import CCTVDebrisOcclusionModal from '../components/cctv/CCTVDebrisOcclusionModal';
import CCTVSnapshotModal from '../components/cctv/CCTVSnapshotModal';
import CCTVDiagnosticsDrawer from '../components/cctv/CCTVDiagnosticsDrawer';
import CCTVHistoricalScrubber from '../components/cctv/CCTVHistoricalScrubber';
import CCTVModelBenchmarkModal from '../components/cctv/CCTVModelBenchmarkModal';
import CCTVFieldVerificationModal from '../components/cctv/CCTVFieldVerificationModal';
import CCTVAlertPolicyModal from '../components/cctv/CCTVAlertPolicyModal';

import {
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Eye,
  Sliders,
  RefreshCw,
  Cpu,
  Radio,
  Car,
  Droplets,
  Wrench,
  Truck,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Crosshair,
  FileText,
  Filter,
  Search,
  Play,
  Pause,
} from 'lucide-react';

// ==========================================
// 8 Real High-Risk Municipal CCTV Feeds
// ==========================================
const EXPANDED_CCTV_FEEDS = [
  {
    id: 'cctv-andheri',
    name: 'CAM-04: Andheri Subway Underpass',
    ward: 'Ward K/E',
    status: 'LIVE STREAMING',
    baseDepth: 28,
    detectedDepth: 28,
    confidence: 96,
    vehiclesDetected: 3,
    flowStatus: 'IMPASSABLE - WATER SURGING',
    lastSync: 'Just now',
    rtspUrl: 'rtsp://10.24.18.104:554/h265/ch1',
    sensorId: 'WL-ANDHERI-02',
    coordinates: [72.8468, 19.1197],
    lensStatus: 'CLEAN (WIPER READY)',
    inflowRate: '+4.2 cm/10m',
    flowVelocity: '0.86 m/s',
    submersionEta: '18 min',
    grateBlockage: 58,
  },
  {
    id: 'cctv-milan',
    name: 'CAM-02: Milan Subway Underpass',
    ward: 'Ward H/E',
    status: 'LIVE STREAMING',
    baseDepth: 22,
    detectedDepth: 22,
    confidence: 97,
    vehiclesDetected: 1,
    flowStatus: 'BARRICADED - PUMPS RUNNING',
    lastSync: '1s ago',
    rtspUrl: 'rtsp://10.24.18.102:554/h265/ch1',
    sensorId: 'WL-MILAN-01',
    coordinates: [72.8432, 19.0912],
    lensStatus: 'NORMAL',
    inflowRate: '+2.8 cm/10m',
    flowVelocity: '0.64 m/s',
    submersionEta: '32 min',
    grateBlockage: 34,
  },
  {
    id: 'cctv-sion',
    name: 'CAM-08: Sion Circle Roundabout',
    ward: 'Ward F/N',
    status: 'LIVE STREAMING',
    baseDepth: 19,
    detectedDepth: 19,
    confidence: 94,
    vehiclesDetected: 14,
    flowStatus: 'SLOW / WHEEL-ARCH INUNDATION',
    lastSync: 'Just now',
    rtspUrl: 'rtsp://10.24.18.108:554/h265/ch1',
    sensorId: 'WL-SION-04',
    coordinates: [72.8624, 19.0392],
    lensStatus: 'NORMAL',
    inflowRate: '+1.9 cm/10m',
    flowVelocity: '0.42 m/s',
    submersionEta: '45 min',
    grateBlockage: 26,
  },
  {
    id: 'cctv-kurla',
    name: 'CAM-12: Kurla LBS Marg Trough',
    ward: 'Ward L',
    status: 'LIVE STREAMING',
    baseDepth: 31,
    detectedDepth: 31,
    confidence: 95,
    vehiclesDetected: 6,
    flowStatus: 'CRITICAL - ROAD DAMMED',
    lastSync: '2s ago',
    rtspUrl: 'rtsp://10.24.18.112:554/h265/ch1',
    sensorId: 'WL-KURLA-03',
    coordinates: [72.8760, 19.0682],
    lensStatus: 'WATER SPRAY DETECTED',
    inflowRate: '+5.4 cm/10m',
    flowVelocity: '1.12 m/s',
    submersionEta: '12 min',
    grateBlockage: 72,
  },
  {
    id: 'cctv-hindmata',
    name: 'CAM-06: Hindmata Flyover Pit',
    ward: 'Ward G/N',
    status: 'LIVE STREAMING',
    baseDepth: 25,
    detectedDepth: 25,
    confidence: 98,
    vehiclesDetected: 8,
    flowStatus: 'HEAVY RECEDING / PUMPS ACTIVE',
    lastSync: '1s ago',
    rtspUrl: 'rtsp://10.24.18.106:554/h265/ch1',
    sensorId: 'WL-HINDMATA-01',
    coordinates: [72.8415, 19.0084],
    lensStatus: 'CLEAN',
    inflowRate: '-1.2 cm/10m',
    flowVelocity: '0.55 m/s',
    submersionEta: 'RECEDING',
    grateBlockage: 41,
  },
  {
    id: 'cctv-khar',
    name: 'CAM-09: Khar Subway North Portal',
    ward: 'Ward H/W',
    status: 'LIVE STREAMING',
    baseDepth: 16,
    detectedDepth: 16,
    confidence: 93,
    vehiclesDetected: 5,
    flowStatus: 'CAUTION - LIGHT WATER POOLING',
    lastSync: '3s ago',
    rtspUrl: 'rtsp://10.24.18.109:554/h265/ch1',
    sensorId: 'WL-KHAR-02',
    coordinates: [72.8368, 19.0701],
    lensStatus: 'NORMAL',
    inflowRate: '+0.8 cm/10m',
    flowVelocity: '0.31 m/s',
    submersionEta: '> 60 min',
    grateBlockage: 18,
  },
  {
    id: 'cctv-kings',
    name: "CAM-15: King's Circle Rail Ingress",
    ward: 'Ward F/N',
    status: 'LIVE STREAMING',
    baseDepth: 29,
    detectedDepth: 29,
    confidence: 96,
    vehiclesDetected: 4,
    flowStatus: 'IMPASSABLE - WATER LOGGED',
    lastSync: 'Just now',
    rtspUrl: 'rtsp://10.24.18.115:554/h265/ch1',
    sensorId: 'WL-KINGS-05',
    coordinates: [72.8576, 19.0305],
    lensStatus: 'NORMAL',
    inflowRate: '+3.8 cm/10m',
    flowVelocity: '0.78 m/s',
    submersionEta: '15 min',
    grateBlockage: 64,
  },
  {
    id: 'cctv-chuna',
    name: 'CAM-18: Chunabhatti Station Culvert',
    ward: 'Ward L',
    status: 'LIVE STREAMING',
    baseDepth: 14,
    detectedDepth: 14,
    confidence: 92,
    vehiclesDetected: 2,
    flowStatus: 'NORMAL CLEARANCE',
    lastSync: '2s ago',
    rtspUrl: 'rtsp://10.24.18.118:554/h265/ch1',
    sensorId: 'WL-CHUNA-01',
    coordinates: [72.8712, 19.0522],
    lensStatus: 'CLEAN',
    inflowRate: '+0.4 cm/10m',
    flowVelocity: '0.22 m/s',
    submersionEta: '> 90 min',
    grateBlockage: 12,
  },
];

export default function CCTVSensorAssimilation() {
  // Central Command Context Connections
  const {
    vmsSigns,
    updateVmsSign,
    incidentList,
    dispatchIncident,
    mobilePumpsList,
    dispatchMobilePump,
    addCommandLog,
    isSirenActive,
    toggleSiren,
  } = useFloodCommand();

  // Primary State
  const [cameras, setCameras] = useState(EXPANDED_CCTV_FEEDS);
  const [selectedCamId, setSelectedCamId] = useState('cctv-andheri');
  const [layoutMode, setLayoutMode] = useState('single'); // 'single' | 'quad' | 'matrix'
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Video Player & PTZ Controls
  const [showOverlays, setShowOverlays] = useState(true);
  const [showCalibrationGrid, setShowCalibrationGrid] = useState(true);
  const [activeFilter, setActiveFilter] = useState('normal'); // 'normal' | 'ir' | 'rain-clean' | 'dehaze' | 'thermal'
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [datumOffset, setDatumOffset] = useState(0);
  const [isPlayingStream, setIsPlayingStream] = useState(true);
  const [isWiperActive, setIsWiperActive] = useState(false);

  // Operator ROI Drawing State
  const [activeRoiMode, setActiveRoiMode] = useState(false);
  const [roiList, setRoiList] = useState([
    { id: 'ROI-01', name: 'Lane 1 Inundation Box', x: 20, y: 55, width: 60, height: 35, confidence: 96 },
  ]);

  // Model & Diagnostics Selection
  const [activeModel, setActiveModel] = useState('YOLOv8-HydroEdge');
  const [syncedMessage, setSyncedMessage] = useState('');
  const [actionAlert, setActionAlert] = useState('');

  // Modals & Drawers
  const [isEnKFTunerOpen, setIsEnKFTunerOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isDebrisModalOpen, setIsDebrisModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [isModelBenchmarkOpen, setIsModelBenchmarkOpen] = useState(false);
  const [isFieldVerificationOpen, setIsFieldVerificationOpen] = useState(false);
  const [isAlertPolicyOpen, setIsAlertPolicyOpen] = useState(false);

  // Kalman Filter Simulation Parameters
  const [enkfParams, setEnkfParams] = useState({
    ensembleSize: 100,
    processNoiseQ: 0.15,
    measurementNoiseR: 0.45,
    cvWeight: 0.85,
    iotWeight: 0.95,
    sweModelWeight: 0.65,
  });

  // Alert Policies
  const [alertPolicy, setAlertPolicy] = useState({
    safeThreshold: 15,
    warningThreshold: 25,
    criticalThreshold: 35,
    autoVmsBroadcast: true,
    autoPumpTrigger: true,
    autoSirenAlarm: true,
    autoTowDispatch: false,
  });

  // Session Snapshots Archive
  const [snapshots, setSnapshots] = useState([]);

  // Moving Simulated Road Vehicles
  const [vehicles, setVehicles] = useState([
    { id: 'veh-01', type: 'CAR', plate: 'MH-02-EE-4192', clearanceCm: 22, speed: 0, status: 'STALLED', x: 42, y: 62, width: 48, height: 32 },
    { id: 'veh-02', type: 'BUS', plate: 'MH-01-AP-8921', clearanceCm: 55, speed: 18, status: 'MOVING', x: 16, y: 48, width: 64, height: 38 },
    { id: 'veh-03', type: 'AUTO', plate: 'MH-02-CB-1033', clearanceCm: 20, speed: 12, status: 'MOVING', x: 68, y: 56, width: 36, height: 30 },
  ]);

  // Selected camera reference
  const selectedCam = useMemo(() => {
    return cameras.find((c) => c.id === selectedCamId) || cameras[0];
  }, [cameras, selectedCamId]);

  // Filtered cameras based on Ward and Search
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchWard = selectedWardFilter === 'ALL' || cam.ward.includes(selectedWardFilter);
      const matchSearch =
        cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.ward.toLowerCase().includes(searchQuery.toLowerCase());
      return matchWard && matchSearch;
    });
  }, [cameras, selectedWardFilter, searchQuery]);

  // Computed Sensor Fusion Concordance Math
  const fusionConcordance = useMemo(() => {
    const cvDepth = selectedCam.detectedDepth;
    const iotDepth = cvDepth - 1.2;
    const sweDepth = cvDepth + 2.1;

    // Weighted fusion calculation based on EnKF weights
    const totalWeight = enkfParams.cvWeight + enkfParams.iotWeight + enkfParams.sweModelWeight;
    const fusedDepth = (
      (cvDepth * enkfParams.cvWeight +
        iotDepth * enkfParams.iotWeight +
        sweDepth * enkfParams.sweModelWeight) /
      totalWeight
    ).toFixed(1);

    const residualError = Math.abs(fusedDepth - iotDepth).toFixed(1);
    const kalmanCorrection = (fusedDepth - sweDepth).toFixed(1);

    return {
      cvDepth,
      iotDepth: iotDepth.toFixed(1),
      sweDepth: sweDepth.toFixed(1),
      fusedDepth,
      residualError,
      kalmanCorrection,
      concordancePercent: (100 - residualError * 2.2).toFixed(1),
    };
  }, [selectedCam, enkfParams]);

  // Handle Trigger EnKF Re-assimilation with full state update, audio chime, and command log
  const handleTriggerSync = () => {
    // Web audio subtle synthesis chime
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } catch {}
    }

    // Slightly fluctuate readings across cameras to simulate freshly assimilated state
    setCameras((prev) =>
      prev.map((c) => ({
        ...c,
        lastSync: 'Just now',
        confidence: Math.min(99, Math.max(91, c.confidence + (Math.random() > 0.5 ? 1 : -1))),
      }))
    );

    setSyncedMessage('Ensemble Kalman Filter (EnKF) Assimilated Across 8 Nodes');
    if (addCommandLog) {
      addCommandLog({
        type: 'ALGORITHMIC_ASSIMILATION',
        officer: 'Edge AI Telemetry Daemon',
        details: `EnKF re-assimilation executed for ${selectedCam.name}. Filter covariance updated: K=${(enkfParams.processNoiseQ / (enkfParams.processNoiseQ + enkfParams.measurementNoiseR)).toFixed(3)}, Concordance=${fusionConcordance.concordancePercent}%.`,
      });
    }

    setTimeout(() => setSyncedMessage(''), 3500);
  };

  // PTZ Camera Preset Buttons
  const applyPtzPreset = (preset) => {
    switch (preset) {
      case 'waterline':
        setZoom(2.2);
        setPanX(10);
        setPanY(-40);
        break;
      case 'traffic':
        setZoom(1.4);
        setPanX(-20);
        setPanY(-15);
        break;
      case 'curb':
        setZoom(2.8);
        setPanX(-65);
        setPanY(-30);
        break;
      case 'reset':
      default:
        setZoom(1);
        setPanX(0);
        setPanY(0);
        break;
    }
  };

  // Trigger Wiper
  const handleTriggerWiper = () => {
    setIsWiperActive(true);
    setActionAlert('High-pressure de-icing and rain wiper activated on camera lens.');
    setTimeout(() => {
      setIsWiperActive(false);
      setActionAlert('');
    }, 2800);
  };

  // Trigger Traffic VMS Message Board Linkage
  const handleBroadcastVMS = () => {
    const text = `${selectedCam.name.split(':')[0]} INUNDATED (${selectedCam.detectedDepth}CM) - DIVERSION IN EFFECT`;
    if (updateVmsSign && vmsSigns?.length > 0) {
      updateVmsSign(vmsSigns[0].id, text, 'ACTIVE EMERGENCY BROADCAST');
    }
    if (dispatchIncident) {
      dispatchIncident(
        incidentList?.[0]?.id || 'INC-101',
        `Traffic police deployed barricades at ${selectedCam.name}. VMS signs updated with detour advisory.`
      );
    }
    if (addCommandLog) {
      addCommandLog({
        type: 'VMS_DIVERSION_BROADCAST',
        officer: 'Traffic Ops Desk',
        details: `Upstream LED VMS Gantries updated: "${text}" with physical traffic barrier orders.`,
      });
    }
    setActionAlert(`VMS Gantry Display Updated: "${text}"`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  // Auto-Engage Mobile Dewatering Pump Linkage
  const handleEngagePump = () => {
    const targetPump = mobilePumpsList?.[0] || { id: 'PUMP-SQUAD-01' };
    if (dispatchMobilePump) {
      dispatchMobilePump(targetPump.id, selectedCam.name, selectedCam.ward);
    }
    if (addCommandLog) {
      addCommandLog({
        type: 'EMERGENCY_DEWATERING_PUMP',
        officer: 'Drainage Superintending Eng.',
        details: `Dispatched 500HP Turbo Dewatering Squad (${targetPump.id}) to ${selectedCam.name}. Automatic bypass engaged.`,
      });
    }
    setActionAlert(`High-Capacity Dewatering Pump dispatched to ${selectedCam.name}!`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  // Dispatch Tow Crane
  const handleDispatchTow = (veh) => {
    if (addCommandLog) {
      addCommandLog({
        type: 'VEHICLE_RESCUE_TOW',
        officer: 'Traffic Recovery Unit',
        details: `Dispatched MCGM heavy recovery crane to tow hydro-locked vehicle ${veh.plate} at ${selectedCam.name}.`,
      });
    }
    setActionAlert(`MCGM Emergency Tow Truck dispatched for stalled vehicle (${veh.plate}).`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  // Export Unified Telemetry Dossier (CSV/JSON)
  const handleExportTelemetry = () => {
    const exportData = {
      report: 'MUNICIPAL_CCTV_ASSIMILATION_TELEMETRY',
      generatedAt: new Date().toISOString(),
      activeCamera: selectedCam,
      sensorFusion: fusionConcordance,
      kalmanParameters: enkfParams,
      vehiclesTracked: vehicles,
      allCamerasSummary: cameras.map((c) => ({
        id: c.id,
        name: c.name,
        ward: c.ward,
        detectedDepth: c.detectedDepth,
        flowStatus: c.flowStatus,
        confidence: c.confidence,
        flowVelocity: c.flowVelocity,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CCTV_Assimilation_Dossier_${selectedCam.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setActionAlert('Unified CCTV & Sensor Assimilation Dossier exported as JSON.');
    setTimeout(() => setActionAlert(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-y-auto">
      {/* Module Operational Header */}
      <div className="bg-surface px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-purple px-2 py-0.5 rounded bg-purple-soft">
              MODULE 17
            </span>
            <h1 className="text-xl font-bold text-ink">
              CCTV Computer Vision & Sensor Data Assimilation
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse" />
              EDGE CV ACTIVE • 8 NODES
            </span>
            {selectedCam.detectedDepth >= alertPolicy.warningThreshold && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-status-alert text-white font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                REDLINE SUBMERSION
              </span>
            )}
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Continuous boundary-layer sensor fusion: Municipal traffic cameras run real-time YOLO-Edge neural networks for curb water-level detection, cross-validated against ultrasonic gauges via Ensemble Kalman Filtering.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {syncedMessage && (
            <span className="text-xs font-semibold text-status-safe bg-status-safe-soft px-3 py-1.5 rounded-lg border border-status-safe/30 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              {syncedMessage}
            </span>
          )}

          {actionAlert && (
            <span className="text-xs font-semibold text-purple bg-purple-soft px-3 py-1.5 rounded-lg border border-purple/30 flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              {actionAlert}
            </span>
          )}

          <button
            onClick={() => setIsEnKFTunerOpen(true)}
            className="px-3 py-2 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple border border-border text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            title="EnKF Hyperparameters & Observation Weights"
          >
            <Sliders className="w-3.5 h-3.5 text-purple" />
            EnKF Tuner
          </button>

          <button
            onClick={() => setIsModelBenchmarkOpen(true)}
            className="px-3 py-2 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple border border-border text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            title="Switch Neural Network Inference Engine"
          >
            <Cpu className="w-3.5 h-3.5 text-purple" />
            Models ({activeModel.split('-')[0]})
          </button>

          <button
            onClick={handleTriggerSync}
            className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Trigger EnKF Re-assimilation
          </button>

          {toggleSiren && (
            <button
              onClick={toggleSiren}
              className={`p-2 rounded-lg text-xs font-semibold transition-all border ${
                isSirenActive
                  ? 'bg-status-alert text-white border-status-alert animate-bounce'
                  : 'bg-surface-secondary text-ink hover:bg-white border-border'
              }`}
              title={isSirenActive ? 'Silence Acoustic Redline Siren' : 'Test Acoustic Redline Siren'}
            >
              {isSirenActive ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-purple" />
              )}
            </button>
          )}

          <button
            onClick={handleExportTelemetry}
            className="p-2 bg-surface-secondary text-ink hover:bg-white border border-border rounded-lg text-xs font-semibold transition-all"
            title="Export Telemetry Dossier (JSON)"
          >
            <Download className="w-4 h-4 text-ink-secondary" />
          </button>
        </div>
      </div>

      {/* Top Telemetry Strip (Interactive) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 sm:p-6 pb-2">
        <div
          onClick={() => setLayoutMode(layoutMode === 'matrix' ? 'single' : 'matrix')}
          className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle cursor-pointer hover:border-purple/50 transition-all group"
        >
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Active Edge Cameras</span>
            <Camera className="w-3.5 h-3.5 text-purple group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {cameras.length} <span className="text-xs font-normal text-ink-secondary">/ {cameras.length} online</span>
          </div>
          <div className="text-[10px] text-status-safe font-medium mt-0.5 flex items-center gap-1">
            <span>● 100% video stream uptime</span>
            <span className="text-purple ml-auto font-semibold">View Matrix →</span>
          </div>
        </div>

        <div
          onClick={() => setIsDiagnosticsOpen(true)}
          className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle cursor-pointer hover:border-purple/50 transition-all group"
        >
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Inference Latency</span>
            <Cpu className="w-3.5 h-3.5 text-purple group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple mt-1">
            26.4 <span className="text-xs font-normal text-ink-secondary">ms</span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 flex items-center justify-between">
            <span>TensorRT INT8 on Orin</span>
            <span className="text-purple font-semibold">Diagnostics →</span>
          </div>
        </div>

        <div
          onClick={() => setIsEnKFTunerOpen(true)}
          className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle cursor-pointer hover:border-purple/50 transition-all group"
        >
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>IoT Sensor Concordance</span>
            <Radio className="w-3.5 h-3.5 text-status-safe group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-2xl font-bold text-status-safe mt-1">
            {fusionConcordance.concordancePercent}%
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 flex items-center justify-between">
            <span>±{fusionConcordance.residualError} cm residual error</span>
            <span className="text-status-safe font-semibold">Tuner →</span>
          </div>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById('vehicle-tracker-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle cursor-pointer hover:border-purple/50 transition-all group"
        >
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Vehicle Hazard Detections</span>
            <Car className="w-3.5 h-3.5 text-status-amber group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-2xl font-bold text-status-amber mt-1">
            {vehicles.filter((v) => v.status === 'STALLED').length}{' '}
            <span className="text-xs font-normal text-ink-secondary">stall risk</span>
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 truncate flex items-center justify-between">
            <span>{selectedCam.name.split(':')[0]} lane 2</span>
            <span className="text-status-amber font-semibold">Tow Fleet →</span>
          </div>
        </div>

        <div
          onClick={handleTriggerSync}
          className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle cursor-pointer hover:border-purple/50 transition-all group"
        >
          <div className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider flex items-center justify-between">
            <span>EnKF Filter State</span>
            <Activity className="w-3.5 h-3.5 text-purple group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple mt-1">
            CONVERGED
          </div>
          <div className="text-[10px] text-ink-secondary mt-0.5 flex items-center justify-between">
            <span>Observation weight 0.85</span>
            <span className="text-purple font-semibold">Sync ↻</span>
          </div>
        </div>
      </div>

      {/* Ward Filter and Search Strip */}
      <div className="px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-ink-secondary mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Ward:
          </span>
          {['ALL', 'Ward K/E', 'Ward H/E', 'Ward F/N', 'Ward L', 'Ward G/N', 'Ward H/W'].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWardFilter(w)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                selectedWardFilter === w
                  ? 'bg-purple text-white font-semibold shadow-xs'
                  : 'bg-surface border border-border text-ink-secondary hover:text-ink'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search camera or road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-surface border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple w-48"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                layoutMode === 'single'
                  ? 'bg-purple text-white font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Single Feed
            </button>
            <button
              onClick={() => setLayoutMode('quad')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                layoutMode === 'quad'
                  ? 'bg-purple text-white font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Quad (2x2)
            </button>
            <button
              onClick={() => setLayoutMode('matrix')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                layoutMode === 'matrix'
                  ? 'bg-purple text-white font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Matrix (8)
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {layoutMode !== 'single' ? (
        <div className="p-6 pt-2 flex-1 flex flex-col">
          <CCTVQuadMatrix
            cameras={filteredCameras}
            selectedCamId={selectedCamId}
            onSelectCamera={(id) => {
              setSelectedCamId(id);
              setLayoutMode('single');
            }}
            layoutMode={layoutMode}
            onChangeLayout={setLayoutMode}
          />
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 pt-2">
          {/* Left Column: Live Feed & Computer Vision Inspection (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex-1 flex flex-col">
              {/* Viewport Secondary Bar: Shaders, Overlays, PTZ Presets */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-border mb-3 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Visual Filter Shaders */}
                  <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs">
                    <span className="text-[10px] text-ink-muted uppercase font-bold px-1">Shader:</span>
                    {[
                      { id: 'normal', label: 'RGB' },
                      { id: 'ir', label: 'IR Night' },
                      { id: 'rain-clean', label: 'Rain-Clean' },
                      { id: 'dehaze', label: 'De-Haze' },
                      { id: 'thermal', label: 'Thermal' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-2 py-0.5 rounded font-medium transition-all ${
                          activeFilter === f.id
                            ? 'bg-purple text-white font-bold shadow-xs'
                            : 'text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Overlays Toggles */}
                  <button
                    onClick={() => setShowOverlays(!showOverlays)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      showOverlays
                        ? 'bg-purple-soft text-purple border border-purple/30 font-semibold'
                        : 'bg-surface-secondary text-ink-secondary border border-border'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    CV Tags
                  </button>

                  <button
                    onClick={() => setShowCalibrationGrid(!showCalibrationGrid)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      showCalibrationGrid
                        ? 'bg-purple-soft text-purple border border-purple/30 font-semibold'
                        : 'bg-surface-secondary text-ink-secondary border border-border'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Scale Ruler
                  </button>

                  {/* ROI Editor Toggle */}
                  <button
                    onClick={() => setActiveRoiMode(!activeRoiMode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeRoiMode
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-surface-secondary text-ink-secondary border border-border hover:text-ink'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    {activeRoiMode ? 'Finish ROI' : 'Draw ROI'}
                  </button>

                  {/* Play / Pause Stream Toggle */}
                  <button
                    onClick={() => setIsPlayingStream(!isPlayingStream)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      !isPlayingStream
                        ? 'bg-amber-500/20 text-amber-700 border border-amber-500/40 font-semibold'
                        : 'bg-surface-secondary text-ink-secondary border border-border hover:text-ink'
                    }`}
                    title={isPlayingStream ? 'Pause Live Stream' : 'Resume Live Stream'}
                  >
                    {!isPlayingStream ? <Play className="w-3.5 h-3.5 text-amber-700" /> : <Pause className="w-3.5 h-3.5" />}
                    {isPlayingStream ? 'Live' : 'Paused'}
                  </button>
                </div>

                {/* PTZ Quick Presets */}
                <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs">
                  <span className="text-[10px] text-ink-muted uppercase font-bold px-1">PTZ:</span>
                  <button
                    onClick={() => applyPtzPreset('waterline')}
                    className="px-2 py-0.5 text-xs text-ink-secondary hover:text-purple hover:bg-white rounded transition-all"
                  >
                    Waterline
                  </button>
                  <button
                    onClick={() => applyPtzPreset('curb')}
                    className="px-2 py-0.5 text-xs text-ink-secondary hover:text-purple hover:bg-white rounded transition-all"
                  >
                    Curb Gauge
                  </button>
                  <button
                    onClick={() => applyPtzPreset('traffic')}
                    className="px-2 py-0.5 text-xs text-ink-secondary hover:text-purple hover:bg-white rounded transition-all"
                  >
                    Traffic
                  </button>
                  <button
                    onClick={() => applyPtzPreset('reset')}
                    className="px-2 py-0.5 text-xs font-bold text-ink hover:bg-white rounded transition-all"
                    title="Reset Zoom & Pan"
                  >
                    1x Reset
                  </button>
                </div>
              </div>

              {/* Core Dynamic Canvas Video Stream Surface */}
              <CCTVCanvasStream
                selectedCam={selectedCam}
                showOverlays={showOverlays}
                showCalibrationGrid={showCalibrationGrid}
                activeFilter={activeFilter}
                zoom={zoom}
                panX={panX}
                panY={panY}
                datumOffset={datumOffset}
                roiList={roiList}
                activeRoiMode={activeRoiMode}
                onAddRoi={(newRoi) => setRoiList((prev) => [...prev, newRoi])}
                activeModel={activeModel}
                isWiperActive={isWiperActive}
                isPlayingStream={isPlayingStream}
                onCaptureSnapshot={() => setIsSnapshotModalOpen(true)}
                vehicles={vehicles}
              />

              {/* PTZ & Zero-Datum Fine Tuning Toolbar */}
              <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                {/* Zero-Datum Road Level Calibrator Slider */}
                <div className="flex items-center gap-2">
                  <span className="text-ink-secondary font-medium">Optical Gauge Datum Offset:</span>
                  <input
                    type="range"
                    min="-10"
                    max="15"
                    value={datumOffset}
                    onChange={(e) => setDatumOffset(parseInt(e.target.value))}
                    className="w-28 accent-purple h-1.5"
                  />
                  <span className="font-mono font-bold text-purple">
                    {datumOffset >= 0 ? `+${datumOffset}` : datumOffset} cm
                  </span>
                </div>

                {/* Actuators */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerWiper}
                    className="px-2.5 py-1 bg-surface-secondary text-ink hover:bg-sky-50 hover:text-sky-600 border border-border rounded-lg transition-all flex items-center gap-1"
                  >
                    <Droplets className="w-3 h-3 text-sky-500" />
                    Lens Wiper
                  </button>

                  <button
                    onClick={() => setIsDebrisModalOpen(true)}
                    className="px-2.5 py-1 bg-surface-secondary text-ink hover:bg-amber-50 hover:text-amber-700 border border-border rounded-lg transition-all flex items-center gap-1"
                  >
                    <Wrench className="w-3 h-3 text-amber-500" />
                    Grate Blockage ({selectedCam.grateBlockage}%)
                  </button>

                  <button
                    onClick={() => setIsDiagnosticsOpen(true)}
                    className="px-2.5 py-1 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple border border-border rounded-lg transition-all flex items-center gap-1"
                  >
                    <Cpu className="w-3 h-3 text-purple" />
                    Hardware Health
                  </button>
                </div>
              </div>

              {/* Bottom Multi-Camera Thumbnails Carousel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {filteredCameras.map((cam) => {
                  const isSelected = cam.id === selectedCam.id;
                  const isCritical = cam.detectedDepth >= alertPolicy.warningThreshold;

                  return (
                    <button
                      key={cam.id}
                      onClick={() => setSelectedCamId(cam.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                        isSelected
                          ? 'border-purple bg-purple-soft/40 shadow-subtle ring-1 ring-purple'
                          : 'border-border bg-white hover:border-purple/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-ink truncate">
                          {cam.name.split(':')[0]}
                        </span>
                        <span className="font-mono text-xs text-purple font-bold">
                          {cam.detectedDepth} cm
                        </span>
                      </div>
                      <div className="text-[10px] text-ink-secondary truncate">
                        {cam.ward}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-status-safe font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse" />
                          LIVE
                        </span>
                        {isCritical ? (
                          <span className="font-mono font-bold text-status-alert">
                            SURGING
                          </span>
                        ) : (
                          <span className="font-mono text-ink-muted">
                            Conf {cam.confidence}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Historical 24h Scrubber Module */}
            <CCTVHistoricalScrubber
              currentDepth={selectedCam.detectedDepth}
              onTimeChange={(hoursAgo, depth) => {
                if (hoursAgo > 0) {
                  setCameras((prev) =>
                    prev.map((c) => (c.id === selectedCam.id ? { ...c, detectedDepth: depth } : c))
                  );
                } else {
                  setCameras((prev) =>
                    prev.map((c) => (c.id === selectedCam.id ? { ...c, detectedDepth: c.baseDepth } : c))
                  );
                }
              }}
            />

            {/* Vehicle Hazard & Stall Telemetry Component */}
            <div id="vehicle-tracker-section">
              <CCTVVehicleTracker
                vehicles={vehicles}
                currentDepth={selectedCam.detectedDepth}
                onDispatchTow={handleDispatchTow}
              />
            </div>
          </div>

          {/* Right Column: Sensor Assimilation, Kalman Concordance & Actuators (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-border shadow-subtle p-4 flex flex-col space-y-4">
              <div>
                <h3 className="text-sm font-bold text-ink mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple" />
                    Sensor Fusion Concordance
                  </span>
                  <button
                    onClick={() => setIsEnKFTunerOpen(true)}
                    className="text-[11px] font-semibold text-purple hover:underline flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" /> Tune
                  </button>
                </h3>
                <p className="text-xs text-ink-secondary">
                  Triangulating CV detection, acoustic IoT gauge, and 2D shallow water hydrodynamic numerical model.
                </p>
              </div>

              {/* Triangulation Metric Cards */}
              <div className="space-y-2.5">
                <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-secondary">Computer Vision (Camera):</span>
                    <span className="font-mono font-bold text-purple">
                      {fusionConcordance.cvDepth} cm
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted mt-0.5 flex justify-between">
                    <span>Confidence: {selectedCam.confidence}%</span>
                    <span className="font-mono">Weight: {(enkfParams.cvWeight * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-secondary">IoT Ultrasonic Gauge:</span>
                    <span className="font-mono font-bold text-ink">
                      {fusionConcordance.iotDepth} cm
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted mt-0.5 flex justify-between">
                    <span>Sensor ID: {selectedCam.sensorId}</span>
                    <span className="font-mono">Weight: {(enkfParams.iotWeight * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-secondary rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-secondary">2D SWE Hydrodynamic Model:</span>
                    <span className="font-mono font-bold text-ink">
                      {fusionConcordance.sweDepth} cm
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted mt-0.5 flex justify-between">
                    <span>Prior estimate before EnKF</span>
                    <span className="font-mono">Weight: {(enkfParams.sweModelWeight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic EnKF Fused State Outcome */}
              <div className="p-3.5 bg-purple-soft/30 rounded-xl border border-purple/20">
                <div className="flex items-center justify-between text-xs font-semibold text-purple mb-1">
                  <span>EnKF Optimal Fused Depth</span>
                  <span className="font-mono text-base font-bold text-purple">
                    {fusionConcordance.fusedDepth} cm
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-secondary">
                  <span>Kalman Correction Nudge:</span>
                  <span className="font-mono font-bold text-status-safe">
                    {fusionConcordance.kalmanCorrection} cm
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-secondary mt-1">
                  <span>Innovation Residual:</span>
                  <span className="font-mono font-bold text-ink">
                    ±{fusionConcordance.residualError} cm error
                  </span>
                </div>
              </div>

              {/* Water Ingress Velocity & ETA Telemetry */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    Surface Flow & Surge Kinetics
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-surface rounded-lg border border-border">
                    <div className="text-[10px] text-ink-secondary">Velocity</div>
                    <div className="font-mono font-bold text-purple">{selectedCam.flowVelocity}</div>
                  </div>
                  <div className="p-2 bg-surface rounded-lg border border-border">
                    <div className="text-[10px] text-ink-secondary">Rise Rate</div>
                    <div className="font-mono font-bold text-status-alert">{selectedCam.inflowRate}</div>
                  </div>
                  <div className="p-2 bg-surface rounded-lg border border-border">
                    <div className="text-[10px] text-ink-secondary">Submersion</div>
                    <div className="font-mono font-bold text-amber-600">{selectedCam.submersionEta}</div>
                  </div>
                </div>
              </div>

              {/* Traffic Passability Advisory & Command Actuation Linkages */}
              <div className="p-3.5 bg-surface-subtle rounded-xl border border-border space-y-3">
                <div>
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-status-alert" />
                    Traffic Passability & Dispatch Hub
                  </span>
                  <div className="text-xs text-ink-secondary">
                    Flow Status:{' '}
                    <span className="font-bold text-status-alert">
                      {selectedCam.flowStatus}
                    </span>
                  </div>
                </div>

                {/* 1-Click Operational Dispatch Actuators */}
                <div className="space-y-2 pt-1 border-t border-border">
                  <button
                    onClick={handleBroadcastVMS}
                    className="w-full py-2 px-3 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    Broadcast Detour on Upstream VMS Screens
                  </button>

                  <button
                    onClick={handleEngagePump}
                    className="w-full py-2 px-3 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple text-xs font-semibold rounded-lg border border-border transition-all flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-purple" />
                    Auto-Deploy 500HP Dewatering Pump Unit
                  </button>

                  <button
                    onClick={() => setIsFieldVerificationOpen(true)}
                    className="w-full py-2 px-3 bg-surface-secondary text-ink hover:bg-purple-soft hover:text-purple text-xs font-semibold rounded-lg border border-border transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-ink-secondary" />
                    Dispatch Junior Engineer Field Audit Ticket
                  </button>

                  <button
                    onClick={() => setIsSnapshotModalOpen(true)}
                    className="w-full py-2 px-3 bg-surface hover:bg-white text-ink text-xs font-semibold rounded-lg border border-border transition-all flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-sky-500" />
                    Capture Certified Ground-Truth Snapshot
                  </button>
                </div>

                {/* Policy Trigger Rule Config Link */}
                <div className="pt-1 text-center">
                  <button
                    onClick={() => setIsAlertPolicyOpen(true)}
                    className="text-[11px] text-purple hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    Configure Auto-Action Depth Policies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <CCTVEnKFTunerModal
        isOpen={isEnKFTunerOpen}
        onClose={() => setIsEnKFTunerOpen(false)}
        initialParams={enkfParams}
        onApplyParams={(newParams) => {
          setEnkfParams(newParams);
          handleTriggerSync();
        }}
      />

      <CCTVDiagnosticsDrawer
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        selectedCam={selectedCam}
        onTriggerWiper={handleTriggerWiper}
        activeModel={activeModel}
      />

      <CCTVDebrisOcclusionModal
        isOpen={isDebrisModalOpen}
        onClose={() => setIsDebrisModalOpen(false)}
        cameraName={selectedCam.name}
        onDispatchCrew={(ticketId, blockage) => {
          if (addCommandLog) {
            addCommandLog({
              type: 'SWM_DESILTATION_DISPATCH',
              officer: 'Solid Waste Desk',
              details: `Dispatched emergency culvert jetting squad to ${selectedCam.name} (Ticket ${ticketId}, Grate Blockage: ${blockage}%).`,
            });
          }
          setActionAlert(`SWM Jetting Squad dispatched (Ticket ${ticketId})`);
          setTimeout(() => setActionAlert(''), 4000);
        }}
      />

      <CCTVSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        selectedCam={selectedCam}
        snapshots={snapshots}
        onSaveSnapshot={(snap) => {
          setSnapshots((prev) => [snap, ...prev]);
          if (addCommandLog) {
            addCommandLog({
              type: 'GROUND_TRUTH_SNAPSHOT',
              officer: snap.operator,
              details: `Archived forensic optical verification snapshot (${snap.id}) for ${snap.camName}. Verified depth: ${snap.groundTruth} cm.`,
            });
          }
        }}
      />

      <CCTVModelBenchmarkModal
        isOpen={isModelBenchmarkOpen}
        onClose={() => setIsModelBenchmarkOpen(false)}
        activeModel={activeModel}
        onSelectModel={(modelId) => {
          setActiveModel(modelId);
          setActionAlert(`Edge model switched to ${modelId}`);
          setTimeout(() => setActionAlert(''), 3000);
        }}
      />

      <CCTVFieldVerificationModal
        isOpen={isFieldVerificationOpen}
        onClose={() => setIsFieldVerificationOpen(false)}
        selectedCam={selectedCam}
        onDispatchTicket={(ticket) => {
          if (addCommandLog) {
            addCommandLog({
              type: 'FIELD_VERIFICATION_TICKET',
              officer: ticket.assignedJE,
              details: `Dispatched physical gauge field verification ticket (${ticket.id}) to ${ticket.camName}.`,
            });
          }
          setActionAlert(`Field verification ticket dispatched to ${ticket.assignedJE}`);
          setTimeout(() => setActionAlert(''), 4000);
        }}
      />

      <CCTVAlertPolicyModal
        isOpen={isAlertPolicyOpen}
        onClose={() => setIsAlertPolicyOpen(false)}
        initialPolicy={alertPolicy}
        onSavePolicy={(newPolicy) => {
          setAlertPolicy(newPolicy);
          setActionAlert('Alert threshold policies updated.');
          setTimeout(() => setActionAlert(''), 3000);
        }}
      />
    </div>
  );
}
