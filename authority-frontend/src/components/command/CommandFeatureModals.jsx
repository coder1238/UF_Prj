import React, { useState } from 'react';
import { useFloodCommand } from '../../context/FloodCommandContext';
import {
  WARDS,
  ROAD_CORRIDORS,
  CRITICAL_ASSETS,
  DRAINAGE_NODES,
  RADAR_CELLS,
  ML_MODELS,
  CCTV_FEEDS,
  THREAT_LEVELS,
} from '../../data/floodData';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Send,
  RefreshCw,
  Volume2,
  VolumeX,
  Download,
  Printer,
  Eye,
  MapPin,
  Waves,
  Truck,
  Building,
  PhoneCall,
  FileText,
  Users,
  Search,
  Lock,
  Unlock,
  Gauge,
  CloudRain,
  TrendingUp,
  GitBranch,
  Zap,
  LifeBuoy,
} from 'lucide-react';

// Common Modal Backdrop
function ModalBackdrop({ children, onClose, maxWidth = 'max-w-3xl' }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`bg-surface border border-border rounded-2xl shadow-elevated w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp`}
      >
        {children}
      </div>
    </div>
  );
}

// ==========================================
// FEATURE 2: Sluice Gate & Tidal Barrier Console
// ==========================================
export function SluiceGateConsoleModal({ onClose, showToast }) {
  const { sluiceGatesList, toggleSluiceGate, addCommandLog } = useFloodCommand();
  const [localGates, setLocalGates] = useState(sluiceGatesList);

  const handleToggle = (gateId) => {
    toggleSluiceGate(gateId);
    setLocalGates((prev) =>
      prev.map((g) =>
        g.id === gateId
          ? {
              ...g,
              status: g.status.includes('OPEN') ? 'MANUALLY SHUT' : 'EMERGENCY BYPASS OPEN',
              autoOverride: !g.autoOverride,
            }
          : g
      )
    );
    const gate = localGates.find((g) => g.id === gateId);
    const nextAction = gate?.status.includes('OPEN') ? 'Forced Closure' : 'Emergency Bypass Opened';
    showToast(`Hydraulic Override Executed: ${gate?.name} -> ${nextAction}`);
    addCommandLog({
      type: 'SLUICE_OVERRIDE',
      details: `Gate ${gateId} override: ${nextAction} under 4.25m tidal head.`,
      status: 'EXECUTED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Arabian Sea Tidal Sluice & Barrier Console
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Real-time flap gate telemetry & hydrostatic reverse-flow defense
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* Tide Summary Card */}
        <div className="bg-purple-soft/50 border border-purple/30 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple text-white flex items-center justify-center font-mono font-bold text-sm">
              4.25m
            </div>
            <div>
              <div className="text-xs font-bold text-ink">High Tide Peak: 4.45m MSL at 19:15 IST</div>
              <div className="text-[11px] text-ink-secondary mt-0.5">
                Surge Anomaly: <span className="font-mono text-status-alert font-bold">+32 cm</span> | Outfall Gravity Head Locked Out
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-status-alert text-white px-2 py-1 rounded">
            LOCKOUT ACTIVE
          </span>
        </div>

        {/* Gate List */}
        <div className="space-y-3">
          {localGates.map((gate) => (
            <div key={gate.id} className="p-4 rounded-xl border border-border bg-surface hover:border-purple/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-ink">{gate.name}</h4>
                  <div className="text-[11px] font-mono text-ink-secondary mt-0.5">
                    Differential Head: <strong className={gate.headDifferentialM < 0 ? 'text-status-alert' : 'text-status-safe'}>
                      {gate.headDifferentialM > 0 ? `+${gate.headDifferentialM}m` : `${gate.headDifferentialM}m`}
                    </strong> | Flap Angle: <strong>{gate.flapAngleDeg}°</strong>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                    gate.status.includes('OPEN')
                      ? 'bg-status-safe-soft text-status-safe'
                      : 'bg-status-alert-soft text-status-alert'
                  }`}
                >
                  {gate.status}
                </span>
              </div>

              {/* Angle visualization bar */}
              <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-purple h-full transition-all duration-500"
                  style={{ width: `${(gate.flapAngleDeg / 90) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] text-ink-secondary font-mono">
                  Mode: <strong>{gate.autoOverride ? 'MANUAL OVERRIDE' : 'AUTO SCADA'}</strong>
                </span>
                <button
                  onClick={() => handleToggle(gate.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    gate.status.includes('OPEN')
                      ? 'bg-status-alert text-white hover:bg-status-alert/90'
                      : 'bg-purple text-white hover:bg-purple-deep'
                  }`}
                >
                  {gate.status.includes('OPEN') ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{gate.status.includes('OPEN') ? 'Force Emergency Shut' : 'Force Manual Open'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 3: Dewatering Pump Fleet Dispatcher
// ==========================================
export function PumpFleetDispatcherModal({ onClose, showToast }) {
  const { mobilePumpsList, dispatchMobilePump, addCommandLog, setMapFocusTarget } = useFloodCommand();
  const [selectedPump, setSelectedPump] = useState(mobilePumpsList[0]?.id || '');
  const [targetLocation, setTargetLocation] = useState('Sion East Circle Sump');
  const [targetWard, setTargetWard] = useState('Ward F/N');

  const handleDispatch = (e) => {
    e.preventDefault();
    dispatchMobilePump(selectedPump, targetLocation, targetWard);
    showToast(`Dewatering Unit Dispatched to ${targetLocation} (${targetWard})`);
    addCommandLog({
      type: 'PUMP_DISPATCH',
      details: `Unit ${selectedPump} assigned to ${targetLocation} (${targetWard}) for immediate flood clearance.`,
      status: 'DISPATCHED',
    });
    setMapFocusTarget({
      coords: [72.8619, 19.0392],
      zoom: 14.5,
      title: `Pump Dispatch: ${selectedPump}`,
      subtitle: `Target: ${targetLocation}`,
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Emergency Dewatering Pump Fleet Telematics
            </h3>
            <p className="text-[11px] text-ink-secondary">
              8 mobile high-capacity dewatering squads (1,200 to 2,500 m³/hr)
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* Rapid Assignment Form */}
        <form onSubmit={handleDispatch} className="bg-surface-secondary p-4 rounded-xl border border-border flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Select Pump Unit
            </label>
            <select
              value={selectedPump}
              onChange={(e) => setSelectedPump(e.target.value)}
              className="w-full bg-surface border border-border text-xs rounded-lg px-2.5 py-1.5 text-ink font-semibold"
            >
              {mobilePumpsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status} - {p.fuel} fuel)
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Target Submerged Location
            </label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full bg-surface border border-border text-xs rounded-lg px-2.5 py-1.5 text-ink"
              placeholder="e.g. Andheri Subway East Ingress"
              required
            />
          </div>

          <div className="w-32">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Assigned Ward
            </label>
            <select
              value={targetWard}
              onChange={(e) => setTargetWard(e.target.value)}
              className="w-full bg-surface border border-border text-xs rounded-lg px-2.5 py-1.5 text-ink"
            >
              {WARDS.filter((w) => w.id !== 'all').map((w) => (
                <option key={w.id} value={w.name.split(' (')[0]}>
                  {w.name.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Order</span>
          </button>
        </form>

        {/* Pump List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mobilePumpsList.map((p) => (
            <div key={p.id} className="p-3.5 rounded-xl border border-border bg-surface flex flex-col justify-between hover:border-purple/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-purple">{p.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    p.status.includes('ACTIVE') || p.status.includes('RUNNING')
                      ? 'bg-status-safe-soft text-status-safe'
                      : p.status.includes('ROUTE')
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-surface-secondary text-ink-secondary'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink">{p.name}</h4>
                <div className="text-[11px] text-ink-secondary mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-status-alert" />
                  <span>{p.location} ({p.assignedTo})</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono">
                <span>Discharge: <strong>{p.capacity}</strong></span>
                <span className="text-status-safe font-bold">Fuel: {p.fuel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 4: Live CCTV Vision AI Water-Depth Feeds
// ==========================================
export function CCTVVisionFeedsModal({ onClose, showToast }) {
  const [selectedCam, setSelectedCam] = useState(CCTV_FEEDS[0]);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleSnapshot = () => {
    showToast(`CCTV Snapshot & Depth Calibration Archive Captured for ${selectedCam.name}`);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-4xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              CCTV Sensor Assimilation & AI Depth Vision
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Real-time deep learning watermark detection and vehicle arch submergence analytics
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        {/* Left: Video Player Simulation */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative aspect-video bg-ink rounded-xl overflow-hidden border border-border shadow-inner flex flex-col justify-between p-4">
            {/* Camera Simulated Viewport */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Simulated Water & Road Visual */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black animate-pulse" />
            </div>

            {/* AI Bounding Box Overlay */}
            <div className="relative z-10 flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-status-alert animate-ping" />
                <span className="font-bold">{selectedCam.name}</span>
                <span className="text-white/40">|</span>
                <span>{selectedCam.ward}</span>
              </div>
              <span className="bg-status-safe/80 px-2 py-0.5 rounded text-[10px]">
                YOLOv9-FLOOD CONFIDENCE: {selectedCam.confidence}%
              </span>
            </div>

            {/* Center Watermark Detection Box */}
            <div className="relative z-10 border-2 border-status-alert bg-status-alert/15 rounded-lg p-3 max-w-xs mx-auto backdrop-blur-sm text-center">
              <div className="text-[10px] font-mono text-status-alert font-bold uppercase tracking-wider">
                Waterline Edge Identified
              </div>
              <div className="text-3xl font-mono font-bold text-white mt-1">
                {selectedCam.detectedDepth} <span className="text-sm font-normal">cm depth</span>
              </div>
              <div className="text-[10px] text-white/80 font-mono mt-1">
                Status: {selectedCam.flowStatus}
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="relative z-10 flex items-center justify-between text-white text-[11px] font-mono">
              <span>SYNC: {selectedCam.lastSync}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCalibrating(true);
                    setTimeout(() => {
                      setIsCalibrating(false);
                      showToast('Waterline Re-calibrated against curb fiducial marker');
                    }, 1200);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isCalibrating ? 'animate-spin' : ''}`} />
                  <span>{isCalibrating ? 'Calibrating...' : 'Re-Calibrate'}</span>
                </button>
                <button
                  onClick={handleSnapshot}
                  className="bg-purple text-white hover:bg-purple-deep px-2 py-1 rounded text-[10px] flex items-center gap-1 font-bold"
                >
                  <Download className="w-3 h-3" />
                  <span>Capture Snapshot</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Camera Selector & Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Active Municipal Cameras</h4>
          <div className="space-y-2">
            {CCTV_FEEDS.map((feed) => (
              <button
                key={feed.id}
                onClick={() => setSelectedCam(feed)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                  selectedCam.id === feed.id
                    ? 'border-purple bg-purple-soft/40 shadow-sm'
                    : 'border-border bg-surface hover:bg-surface-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{feed.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-status-alert text-white px-1.5 py-0.2 rounded">
                    {feed.detectedDepth} cm
                  </span>
                </div>
                <div className="text-[11px] text-ink-secondary flex items-center justify-between">
                  <span>{feed.ward}</span>
                  <span className="text-status-safe font-mono">{feed.status}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-surface-secondary p-3.5 rounded-xl border border-border mt-auto">
            <div className="text-[11px] font-mono text-ink-secondary">
              <strong>Edge Inference:</strong> Real-time frame analysis running at 24 FPS with sub-millimeter waterline calibration against municipal road curbing.
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 5: Citizen SOS Emergency Reports Triage
// ==========================================
export function CitizenReportsTriageModal({ onClose, showToast }) {
  const { citizenReportsList, verifyCitizenReport, addCommandLog, setMapFocusTarget } = useFloodCommand();
  const [filter, setFilter] = useState('ALL');

  const handleVerify = (reportId, action) => {
    verifyCitizenReport(reportId, action);
    showToast(`Citizen Report #${reportId}: Status updated to ${action}`);
    addCommandLog({
      type: 'CITIZEN_TRIAGE',
      details: `Report #${reportId} triage action: ${action}`,
      status: 'VERIFIED',
    });
  };

  const filtered = citizenReportsList.filter((r) => {
    if (filter === 'PENDING') return r.status.includes('PENDING');
    if (filter === 'VERIFIED') return r.status.includes('VERIFIED');
    return true;
  });

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Citizen Crowdsourced SOS & Waterlogging Triage
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Real-time citizen ground reports verified with hydro-acoustic sensors
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          {['ALL', 'PENDING', 'VERIFIED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filter === tab ? 'bg-purple text-white shadow-subtle' : 'text-ink-secondary hover:text-ink bg-surface-secondary'
              }`}
            >
              {tab} ({tab === 'ALL' ? citizenReportsList.length : citizenReportsList.filter((r) => r.status.includes(tab)).length})
            </button>
          ))}
        </div>

        {/* List of Reports */}
        <div className="space-y-3">
          {filtered.map((report) => (
            <div key={report.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-2 hover:border-purple/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple">{report.id}</span>
                  <span className="text-xs font-semibold text-ink">{report.user}</span>
                  <span className="text-[10px] text-ink-secondary">• {report.timestamp}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  report.status.includes('VERIFIED')
                    ? 'bg-status-safe-soft text-status-safe'
                    : 'bg-status-warning-soft text-status-warning'
                }`}>
                  {report.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
                <MapPin className="w-3.5 h-3.5 text-status-alert" />
                <span>{report.location}</span>
                <span className="text-border">|</span>
                <span className="text-status-alert font-bold">Reported: {report.reportedDepth}</span>
              </div>

              <p className="text-xs text-ink-secondary bg-surface-secondary p-2.5 rounded-lg italic">
                "{report.comment}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
                <span className="text-[11px] font-mono text-ink-secondary">
                  Community Upvotes: <strong>{report.votes}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {report.coordinates && (
                    <button
                      onClick={() => {
                        setMapFocusTarget({
                          coords: [report.coordinates[1], report.coordinates[0]],
                          zoom: 15,
                          title: `Citizen SOS: ${report.location}`,
                          subtitle: report.comment,
                        });
                        showToast(`Map Centered on Citizen Report: ${report.location}`);
                      }}
                      className="px-2.5 py-1 text-xs border border-border hover:bg-surface-secondary text-ink rounded-lg font-medium flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-purple" />
                      <span>View Map</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleVerify(report.id, 'VERIFIED BY SENSOR WL-08')}
                    className="px-2.5 py-1 text-xs bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verify & Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 6: Multi-Channel Public Broadcast & CAP Alert Composer
// ==========================================
export function CAPAlertComposerModal({ onClose, showToast }) {
  const { publishAlert, addCommandLog, toggleSiren } = useFloodCommand();
  const [headline, setHeadline] = useState('FLASH FLOOD ALERT: IMMEDIATE WATERLOGGING EVACUATION');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [severity, setSeverity] = useState('Severe');
  const [selectedChannels, setSelectedChannels] = useState(['Cell Broadcast', 'VMS Screens', 'Citizen App']);

  const toggleChannel = (ch) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    const newAlert = {
      id: `AL-${Date.now().toString().slice(-4)}`,
      title: headline,
      wards: ['Ward K/E', 'Ward L', 'Ward F/N'],
      status: 'PUBLISHED - ACTIVE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      audienceReach: '620,000 citizens',
      depthRange: '25–45 cm',
      channels: selectedChannels,
    };
    publishAlert(newAlert);
    showToast(`CAP Emergency Warning Broadcast to ${selectedChannels.length} Channels!`);
    addCommandLog({
      type: 'CAP_BROADCAST',
      details: `Emergency public alert broadcast: "${headline}" across ${selectedChannels.join(', ')}.`,
      status: 'TRANSMITTED',
    });
    toggleSiren();
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-status-alert animate-pulse" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Common Alerting Protocol (CAP) Warning Console
            </h3>
            <p className="text-[11px] text-ink-secondary">
              National Disaster Management Authority (NDMA) standard multi-channel broadcast
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleBroadcast} className="p-5 overflow-y-auto space-y-4">
        {/* Severity & Language */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Urgency Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-semibold"
            >
              <option value="Severe">Severe (Immediate Danger)</option>
              <option value="Extreme">Extreme (Life Threatening)</option>
              <option value="Moderate">Moderate (Inundation Watch)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Primary Language
            </label>
            <div className="flex gap-1">
              {['English', 'मराठी', 'हिंदी'].map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedLanguage === lang
                      ? 'bg-purple text-white shadow-subtle'
                      : 'bg-surface-secondary text-ink-secondary hover:text-ink'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Headline */}
        <div>
          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
            Broadcast Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-semibold"
            required
          />
        </div>

        {/* Target Channels */}
        <div>
          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-2">
            Dissemination Channels (Multi-Modal Push)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Cell Broadcast', 'VMS Screens', 'Citizen App', 'Siren Network'].map((ch) => (
              <button
                type="button"
                key={ch}
                onClick={() => toggleChannel(ch)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedChannels.includes(ch)
                    ? 'border-purple bg-purple-soft/60 text-purple'
                    : 'border-border bg-surface text-ink-secondary hover:bg-surface-secondary'
                }`}
              >
                <span>{ch}</span>
                {selectedChannels.includes(ch) && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Reach Preview */}
        <div className="bg-status-alert-soft border border-status-alert/30 rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs text-ink">
            Target Audience Reach: <strong className="font-mono text-status-alert">620,000 citizens</strong> across 3 Municipal Wards
          </div>
          <span className="text-[10px] font-mono text-status-alert font-bold bg-white/80 px-2 py-0.5 rounded">
            SIREN ARMED
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-status-alert text-white hover:bg-status-alert/90 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Emergency Broadcast</span>
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 7: Critical Infrastructure Monitor
// ==========================================
export function CriticalInfraModal({ onClose, showToast }) {
  const { setMapFocusTarget, addCommandLog } = useFloodCommand();

  const handleProtect = (asset) => {
    showToast(`Rapid Flood Mats & Auxiliary Pumps Deployed to ${asset.name}`);
    addCommandLog({
      type: 'INFRA_PROTECTION',
      details: `Emergency protection deployed at ${asset.name} (${asset.type}).`,
      status: 'PROTECTED',
    });
    setMapFocusTarget({
      coords: [asset.coordinates[1], asset.coordinates[0]],
      zoom: 15,
      title: asset.name,
      subtitle: asset.type,
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Critical Infrastructure & Lifeline Asset Monitor
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Hospitals, 33kV Electrical Substations, Pumping Stations & Emergency Facilities
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {CRITICAL_ASSETS.map((asset) => (
          <div key={asset.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-2 hover:border-purple/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-ink">{asset.name}</h4>
                <div className="text-[11px] text-ink-secondary font-mono mt-0.5">
                  Type: {asset.type} | Ward: {asset.ward}
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                asset.exposure === 'Critical'
                  ? 'bg-status-alert-soft text-status-alert'
                  : asset.exposure === 'Moderate'
                  ? 'bg-status-warning-soft text-status-warning'
                  : 'bg-status-safe-soft text-status-safe'
              }`}>
                {asset.exposure.toUpperCase()} EXPOSURE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 bg-surface-secondary rounded-lg px-3 text-[11px] font-mono">
              <div>
                <span className="text-ink-secondary block">Simulated Depth</span>
                <span className="font-bold text-status-alert">{asset.predictedDepth} cm</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Affected Access</span>
                <span className="font-bold text-ink">{asset.affectedAccessRoads} roads blocked</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Accessibility</span>
                <span className="font-bold text-purple">{asset.accessibility}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-ink-secondary font-mono">
                Status: <strong>{asset.status}</strong>
              </span>
              <button
                onClick={() => handleProtect(asset)}
                className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Deploy Barrier &amp; Auxiliary Unit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 8: Hydrodynamic Runoff & Hyetograph Chart
// ==========================================
export function HydrodynamicChartModal({ onClose }) {
  const { nowcastMinutes } = useFloodCommand();

  const dataPoints = [
    { t: '18:00', rain: 28, runoff: 140, cap: 240 },
    { t: '18:15', rain: 45, runoff: 290, cap: 240 },
    { t: '18:30', rain: 68, runoff: 480, cap: 240 },
    { t: '18:45', rain: 82, runoff: 620, cap: 240 },
    { t: '19:00', rain: 91, runoff: 780, cap: 240 },
    { t: '19:15', rain: 88, runoff: 840, cap: 240 },
    { t: '19:30', rain: 74, runoff: 750, cap: 240 },
    { t: '19:45', rain: 52, runoff: 580, cap: 240 },
    { t: '20:00', rain: 35, runoff: 410, cap: 240 },
    { t: '20:30', rain: 18, runoff: 220, cap: 240 },
  ];

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Hydrodynamic Runoff & Hyetograph Simulation
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Nowcast Horizon: +{nowcastMinutes}m | Rainfall intensity (mm/hr) vs cumulative overland discharge (m³/s) vs trunk capacity
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* SVG Chart */}
        <div className="bg-surface-secondary p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="flex items-center gap-1.5 text-purple font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple" />
              Precipitation Rate (mm/hr)
            </span>
            <span className="flex items-center gap-1.5 text-status-alert font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-status-alert" />
              Surface Runoff Ingress (m³/s)
            </span>
            <span className="flex items-center gap-1.5 text-ink-secondary">
              <span className="w-2.5 h-0.5 bg-ink-muted" />
              Gravity Drain Capacity (240 m³/s)
            </span>
          </div>

          <svg viewBox="0 0 500 200" className="w-full h-52 overflow-visible">
            {/* Drain Capacity Line */}
            <line x1="40" y1="120" x2="480" y2="120" stroke="#948E9F" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="45" y="115" fontSize="9" fill="#948E9F" fontFamily="monospace">
              DRAINAGE GRAVITY BOTTLENECK (240 m³/s)
            </text>

            {/* Runoff Area & Line */}
            <path
              d="M 50 170 Q 150 140 200 90 T 275 40 T 350 70 T 450 160"
              fill="none"
              stroke="#D94A4A"
              strokeWidth="2.5"
            />

            {/* Rain Bars */}
            {dataPoints.map((pt, i) => {
              const x = 50 + i * 44;
              const h = (pt.rain / 100) * 120;
              return (
                <g key={pt.t}>
                  <rect
                    x={x - 6}
                    y={180 - h}
                    width="12"
                    height={h}
                    fill="#6D4AFF"
                    rx="2"
                    opacity="0.75"
                  />
                  <text x={x} y="195" fontSize="8" fill="#706B78" textAnchor="middle" fontFamily="monospace">
                    {pt.t}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Peak Overtopping</span>
            <div className="font-mono text-lg font-bold text-status-alert mt-1">+600 m³/s</div>
            <span className="text-[10px] text-ink-secondary">Exceeds gravity throughput</span>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Storage Deficit</span>
            <div className="font-mono text-lg font-bold text-ink mt-1">1.4M m³</div>
            <span className="text-[10px] text-ink-secondary">Ponded in low-lying sumps</span>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Recession Forecast</span>
            <div className="font-mono text-lg font-bold text-status-safe mt-1">21:45 IST</div>
            <span className="text-[10px] text-ink-secondary">Post-tide gravity restoration</span>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 9: Quick Incident Creator Form
// ==========================================
export function QuickIncidentCreatorModal({ onClose, showToast }) {
  const { dispatchIncident, addCommandLog, setMapFocusTarget } = useFloodCommand();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('Ward F/N');
  const [severity, setSeverity] = useState('Critical');
  const [depth, setDepth] = useState('35');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `INC-${Date.now().toString().slice(-4)}`;
    dispatchIncident(newId, `Manual Emergency Ticket Created: ${title} at ${location}`);
    showToast(`New Incident Logged: ${newId} — Dispatched to Quick Response Desk`);
    addCommandLog({
      type: 'INCIDENT_CREATED',
      details: `${newId} [${severity}]: ${title} at ${location} (${ward}) with ${depth}cm depth.`,
      status: 'LOGGED_AND_ASSIGNED',
    });
    setMapFocusTarget({
      coords: [72.8619, 19.0392],
      zoom: 14.5,
      title: `${newId}: ${title}`,
      subtitle: location,
    });
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Create Emergency Incident Dispatch
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Manual operational incident ticket dispatch with real-time asset assignment
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        <div>
          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
            Incident Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Surcharge Backflow Overtopping Underpass"
            className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-semibold"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Location Landmark
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sion East Ambedkar Road Junction"
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Municipal Ward
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink"
            >
              {WARDS.filter((w) => w.id !== 'all').map((w) => (
                <option key={w.id} value={w.name.split(' (')[0]}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink"
            >
              <option value="Critical">Critical (Immediate Hazard)</option>
              <option value="High">High (Subway Closure)</option>
              <option value="Moderate">Moderate (Street Waterlogging)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
              Estimated Flood Depth (cm)
            </label>
            <input
              type="number"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-mono"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Create &amp; Dispatch Incident</span>
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 10: Dynamic Traffic Corridor Diverter & VMS Message Sign Controller
// ==========================================
export function VMSControllerModal({ onClose, showToast }) {
  const { vmsSigns, updateVmsSign, addCommandLog } = useFloodCommand();
  const [selectedSign, setSelectedSign] = useState(vmsSigns[0]);
  const [customText, setCustomText] = useState(selectedSign?.currentText || '');

  const handleUpdate = (e) => {
    e.preventDefault();
    updateVmsSign(selectedSign.id, customText);
    showToast(`VMS Sign #${selectedSign.id} Message Updated on Highway Display`);
    addCommandLog({
      type: 'VMS_OVERRIDE',
      details: `Sign ${selectedSign.id} (${selectedSign.name}) overridden: "${customText}".`,
      status: 'TRANSMITTED',
    });
  };

  const presetMessages = [
    'ROAD CLOSED DUE TO WATERLOGGING - TAKE DETOUR',
    'EXTREME FLOOD RISK AHEAD - LMVs RESTRICTED',
    'USE ELEVATED FREEWAY - LOWER CORRIDOR IMPASSABLE',
    'HIGH TIDE ALERT - DRIVE WITH CAUTION AT 30 KM/H',
  ];

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Variable Message Signs (VMS) Traffic Diverter
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Highway digital LED signboards & automated green-wave corridor controllers
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto">
        {/* Left: Sign Selector */}
        <div className="md:col-span-5 space-y-2">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Highway Signs Network</h4>
          {vmsSigns.map((sign) => (
            <button
              key={sign.id}
              onClick={() => {
                setSelectedSign(sign);
                setCustomText(sign.currentText);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedSign.id === sign.id
                  ? 'border-purple bg-purple-soft/40 shadow-sm'
                  : 'border-border bg-surface hover:bg-surface-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple">{sign.id}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-ink-secondary">
                  {sign.status}
                </span>
              </div>
              <div className="text-xs font-semibold text-ink mt-1 truncate">{sign.name}</div>
              <div className="text-[11px] text-ink-secondary truncate">{sign.location}</div>
            </button>
          ))}
        </div>

        {/* Right: Message Editor & LED Preview */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* LED Highway Display Simulation */}
          <div className="bg-black p-4 rounded-xl border-4 border-slate-800 shadow-elevated">
            <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest flex items-center justify-between mb-1">
              <span>● HIGHWAY VMS BROADCAST // {selectedSign.id}</span>
              <span className="text-emerald-400">STATUS: ONLINE</span>
            </div>
            <div className="font-mono font-black text-amber-400 text-sm tracking-widest leading-relaxed py-2 text-center uppercase min-h-[64px] flex items-center justify-center">
              {customText || 'NO BROADCAST MESSAGE SET'}
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1.5">
              Quick Traffic Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {presetMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCustomText(msg)}
                  className="text-left text-xs bg-surface-secondary hover:bg-purple-soft/50 text-ink p-2 rounded-lg border border-border hover:border-purple/40 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate} className="mt-auto space-y-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={90}
              className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-mono font-bold"
              placeholder="Enter custom LED sign text..."
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Push Update to Highway Sign</span>
            </button>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 11: Multi-Model AI Ensemble & Confidence Explainer
// ==========================================
export function AIModelExplainerModal({ onClose }) {
  const [weights, setWeights] = useState({
    swe: 40,
    radar: 30,
    swmm: 20,
    pinn: 10,
  });

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Multi-Model AI Intelligence & Ensemble Explainer
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Physics SWE 2D + SWMM Dynamic Wave + Radar ConvLSTM + Graph Hydro-PINN
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ML_MODELS.slice(0, 4).map((model) => (
            <div key={model.id} className="p-3.5 rounded-xl border border-border bg-surface flex flex-col justify-between hover:border-purple/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-purple">{model.version}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-status-safe-soft text-status-safe">
                    {model.confidence} CONF
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink">{model.name}</h4>
                <p className="text-[11px] text-ink-secondary mt-1">{model.architecture}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono">
                <span>Latency: <strong>{model.latency}</strong></span>
                <span className="text-purple font-bold">MAE: {model.mae}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ensemble Weight Sliders */}
        <div className="bg-surface-secondary p-4 rounded-xl border border-border space-y-3">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
            Ensemble Fusion Weights Calibration
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>2D Shallow Water Equations</span>
                <span className="font-bold text-purple">{weights.swe}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={weights.swe}
                onChange={(e) => setWeights({ ...weights, swe: Number(e.target.value) })}
                className="w-full accent-purple h-1.5"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Radar ConvLSTM Extrapolator</span>
                <span className="font-bold text-purple">{weights.radar}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={weights.radar}
                onChange={(e) => setWeights({ ...weights, radar: Number(e.target.value) })}
                className="w-full accent-purple h-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 12: Inundation Depth Gauge & Vehicle Clearance Simulator
// ==========================================
export function VehicleClearanceModal({ onClose }) {
  const { selectedRoad } = useFloodCommand();
  const depth = selectedRoad?.currentDepth || 38;

  const vehicleClasses = [
    { type: 'Small Hatchback / Sedan', clearanceCm: 15, safe: depth < 15, label: 'WHEEL SUBMERGED — ENGINE HYDRO-LOCK RISK' },
    { type: 'SUV / Compact Crossover', clearanceCm: 25, safe: depth < 25, label: 'SAFE WITH CAUTION' },
    { type: 'BEST Municipal Transit Bus', clearanceCm: 45, safe: depth < 45, label: 'AXLE IMMERSED — PASSABLE AT LOW SPEED' },
    { type: 'Heavy Disaster 4x4 Squad Truck', clearanceCm: 75, safe: depth < 75, label: 'FULL CLEARANCE RESTORED' },
  ];

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Vehicle Wading Clearance & Impassability Simulator
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Evaluating road accessibility on: <strong>{selectedRoad?.name || 'Andheri Subway'}</strong>
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* Road Depth Banner */}
        <div className="bg-surface-secondary p-4 rounded-xl border border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-secondary uppercase font-mono">Current Inundation Level</span>
            <div className="font-mono text-3xl font-bold text-status-alert mt-0.5">
              {depth} <span className="text-sm font-normal text-ink">cm water depth</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded font-mono text-xs font-bold bg-status-alert text-white">
            {depth > 30 ? 'ROAD IMPASSABLE FOR PASSENGER CARS' : 'CAUTION ADVISED'}
          </span>
        </div>

        {/* Vehicles Matrix */}
        <div className="space-y-3">
          {vehicleClasses.map((v) => (
            <div key={v.type} className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-ink">{v.type}</h4>
                <div className="text-[11px] text-ink-secondary mt-0.5">
                  Safe Wading Limit: <span className="font-mono font-bold text-ink">{v.clearanceCm} cm</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  v.safe ? 'bg-status-safe-soft text-status-safe' : 'bg-status-alert-soft text-status-alert'
                }`}>
                  {v.safe ? 'PASSABLE' : 'IMPASSABLE / BLOCKED'}
                </span>
                <div className="text-[10px] text-ink-secondary mt-1 font-mono">
                  {v.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 13: Emergency Evacuation Centers Status Board
// ==========================================
export function EvacuationSheltersModal({ onClose, showToast }) {
  const { evacuationShelters, updateShelterOccupancy, addCommandLog, setMapFocusTarget } = useFloodCommand();

  const handleEvacuate = (shelter) => {
    updateShelterOccupancy(shelter.id, 50);
    showToast(`Transferred 50 evacuees to ${shelter.name}`);
    addCommandLog({
      type: 'SHELTER_EVAC',
      details: `Dispatched 50 residents to ${shelter.name} (${shelter.ward}).`,
      status: 'ADMITTED',
    });
    setMapFocusTarget({
      coords: [shelter.coordinates[1], shelter.coordinates[0]],
      zoom: 15,
      title: shelter.name,
      subtitle: `${shelter.currentOccupants}/${shelter.totalCapacity} Occupants`,
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Municipal Evacuation Shelters & Relief Camps
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Real-time shelter capacity, provisions, and standby medical triage
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {evacuationShelters.map((shelter) => {
          const pct = Math.round((shelter.currentOccupants / shelter.totalCapacity) * 100);
          return (
            <div key={shelter.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-2 hover:border-purple/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink">{shelter.name}</h4>
                  <div className="text-[11px] text-ink-secondary mt-0.5">
                    {shelter.ward} | Ground Elevation: <strong className="font-mono text-status-safe">{shelter.elevationM}m MSL</strong> (Flood Safe)
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  pct > 80 ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
                }`}>
                  {shelter.status}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span>Occupancy: <strong>{shelter.currentOccupants}</strong> / {shelter.totalCapacity}</span>
                  <span className="font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pct > 80 ? 'bg-status-alert' : 'bg-purple'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 bg-surface-secondary rounded-lg px-3 text-[10px] font-mono">
                <div>
                  <span className="text-ink-secondary block">Power System</span>
                  <span className="font-bold text-ink">{shelter.powerStatus}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Medical Team</span>
                  <span className="font-bold text-purple">{shelter.medicalUnit}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Ration Stock</span>
                  <span className="font-bold text-status-safe">{shelter.foodStockDays} days dry food</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleEvacuate(shelter)}
                  className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1 shadow-subtle"
                >
                  <Send className="w-3 h-3" />
                  <span>Transfer 50 Citizens Here</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 14: Shift Commander Logbook & Siren Controller
// ==========================================
export function ShiftLogbookModal({ onClose, showToast }) {
  const { commandLogs, isSirenActive, toggleSiren } = useFloodCommand();
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(commandLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BMC_Disaster_Logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Operational Audit Logbook Exported to JSON');
  };

  const filteredLogs = commandLogs.filter((l) =>
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Shift Commander Operational Audit Logbook
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Chronological ledger of orders, overrides, sirens, and dispatches
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {/* Siren Toggle and Action Row */}
        <div className="flex items-center justify-between bg-surface-secondary p-3 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toggleSiren();
                showToast(isSirenActive ? 'Emergency Siren Deactivated' : 'Emergency Audio Siren Activated');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSirenActive ? 'bg-status-alert text-white animate-pulse' : 'bg-surface text-ink border border-border'
              }`}
            >
              {isSirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-ink-secondary" />}
              <span>{isSirenActive ? 'SIREN ACTIVE (CLICK TO MUTE)' : 'TEST AUDIO SIREN CHIME'}</span>
            </button>
            <span className="text-[11px] text-ink-secondary hidden sm:inline">
              Audible threshold alert for commander station
            </span>
          </div>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search command orders, sluice overrides, dispatches..."
            className="w-full bg-surface-secondary border border-border rounded-lg text-xs pl-8 pr-3 py-2 text-ink"
          />
        </div>

        {/* Logs Timeline */}
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl border border-border bg-surface flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-purple">{log.time}</span>
                  <span className="font-semibold text-ink">{log.officer}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary font-bold text-ink-secondary">
                  {log.type}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">{log.details}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 15: Inter-Agency Comms Hub
// ==========================================
export function InterAgencyHubModal({ onClose, showToast }) {
  const { interAgencies, toggleAgencyStatus, addCommandLog } = useFloodCommand();

  const handleBroadcastSitrep = () => {
    showToast('Secure SITREP Packet Transmitted to Police, NDRF & Fire Control');
    addCommandLog({
      type: 'INTER_AGENCY_SITREP',
      details: 'Pushed tactical situation report to all 5 connected emergency agencies.',
      status: 'BROADCAST_SUCCESS',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Inter-Agency Multi-Department Command Desk
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Joint Tactical Coordination: MCGM Disaster Cell, Mumbai Police, NDRF, Fire Brigade, Navy
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between bg-purple-soft/50 p-3 rounded-xl border border-purple/30">
          <div className="text-xs text-ink">
            <strong>Joint Operations Center (JOC):</strong> All 5 nodal agencies linked via secure encrypted radio & telemetry.
          </div>
          <button
            onClick={handleBroadcastSitrep}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Send className="w-3 h-3" />
            <span>Broadcast SITREP</span>
          </button>
        </div>

        <div className="space-y-3">
          {interAgencies.map((agency) => (
            <div key={agency.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink">{agency.name}</h4>
                  <div className="text-[11px] text-ink-secondary mt-0.5">
                    Lead: <strong>{agency.leadOfficer}</strong> | Callsign: <span className="font-mono text-purple font-bold">{agency.callsign}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = agency.status === 'CONNECTED' ? 'TACTICAL PATROL' : 'CONNECTED';
                    toggleAgencyStatus(agency.id, next);
                    showToast(`${agency.name} status updated: ${next}`);
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-status-safe-soft text-status-safe hover:bg-status-safe/20 transition-colors"
                  title="Click to toggle tactical status"
                >
                  {agency.status}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] font-mono">
                <span>Freq: <strong>{agency.radioFreq}</strong></span>
                <span>Personnel Active: <strong className="text-purple">{agency.personnelDeployed}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 16: Underground SWMM Drainage Surcharge Heat Matrix
// ==========================================
export function DrainageSurchargeMatrixModal({ onClose, showToast }) {
  const { setMapFocusTarget, addCommandLog } = useFloodCommand();

  const handleClearSilt = (node) => {
    showToast(`High-Pressure Desilting Super-Sucker Crew Dispatched to ${node.name}`);
    addCommandLog({
      type: 'DESILTING_DISPATCH',
      details: `Dispatched rapid jetting unit to node ${node.id} to relieve hydraulic surcharge.`,
      status: 'DISPATCHED',
    });
    setMapFocusTarget({
      coords: [node.coordinates[1], node.coordinates[0]],
      zoom: 15,
      title: node.name,
      subtitle: `Node ${node.id} Surcharge`,
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Underground SWMM Drainage Surcharge Heat Matrix
            </h3>
            <p className="text-[11px] text-ink-secondary">
              1,428 Conduit Graph Nodes, Invert Levels, and Surcharge Timelines
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {DRAINAGE_NODES.map((node) => (
          <div key={node.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-purple">{node.id}</span>
                <h4 className="text-xs font-bold text-ink mt-0.5">{node.name}</h4>
                <div className="text-[11px] text-ink-secondary mt-0.5">{node.type} • {node.ward}</div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                node.status === 'SURCHARGING'
                  ? 'bg-status-alert-soft text-status-alert'
                  : 'bg-status-warning-soft text-status-warning'
              }`}>
                {node.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 bg-surface-secondary rounded-lg px-3 text-[11px] font-mono">
              <div>
                <span className="text-ink-secondary block">Hydraulic Load</span>
                <span className="font-bold text-status-alert">{node.currentLoad}%</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Max Flow</span>
                <span className="font-bold text-ink">{node.maxFlow}</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Invert Level</span>
                <span className="font-bold text-purple">{node.invertLevel}</span>
              </div>
            </div>

            <div className="text-[11px] text-ink-secondary">
              <strong>Downstream Throttle:</strong> {node.downstreamThrottle}
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => handleClearSilt(node)}
                className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1 shadow-subtle"
              >
                <Zap className="w-3 h-3" />
                <span>Dispatch High-Pressure Desilting Crew</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 17: Doppler Radar Plume & Reflectivity Scanner
// ==========================================
export function DopplerRadarModal({ onClose }) {
  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              IMD Colaba S-Band Doppler Radar Scanner
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Dual-polarization reflectivity (dBz) and convective storm tracking
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {/* Radar Plume Color Scale */}
        <div className="p-3 bg-surface-secondary rounded-xl border border-border">
          <div className="text-xs font-bold text-ink mb-1.5">Doppler Reflectivity Scale (dBz)</div>
          <div className="h-3 w-full rounded-full flex overflow-hidden">
            <div className="flex-1 bg-blue-400" title="20-30 dBz (Light Rain)" />
            <div className="flex-1 bg-green-500" title="30-40 dBz (Moderate)" />
            <div className="flex-1 bg-yellow-400" title="40-50 dBz (Heavy)" />
            <div className="flex-1 bg-red-600" title="50-60 dBz (Intense Torrential)" />
            <div className="flex-1 bg-purple-600" title=">60 dBz (Cloudburst / Severe Hail)" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-ink-secondary mt-1">
            <span>20 dBz</span>
            <span>35 dBz</span>
            <span>50 dBz (Torrential)</span>
            <span>65+ dBz</span>
          </div>
        </div>

        {/* Identified Cells */}
        <div className="space-y-2">
          {RADAR_CELLS.map((cell) => (
            <div key={cell.id} className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-purple">{cell.id}</span>
                <h4 className="text-xs font-bold text-ink mt-0.5">{cell.name}</h4>
                <div className="text-[11px] text-ink-secondary">Velocity: {cell.velocity}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-status-alert">{cell.intensity}</span>
                <div className="text-[10px] font-mono text-purple font-semibold mt-0.5">{cell.dbz} dBz</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 18: Resource & Inventory Supply Depot Monitor
// ==========================================
export function SupplyDepotModal({ onClose, showToast }) {
  const { depotInventory, requestSupplyTransfer, addCommandLog } = useFloodCommand();

  const handleTransfer = (depotId, item) => {
    requestSupplyTransfer(depotId, item.name, 500);
    showToast(`Dispatched Emergency Re-supply for ${item.name}`);
    addCommandLog({
      type: 'LOGISTICS_TRANSFER',
      details: `Re-supply order: +500 ${item.unit} of ${item.name} to ${depotId}.`,
      status: 'TRANSFER_DISPATCHED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Municipal Disaster Resource & Supply Depots
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Central stockpiles of sandbags, inflatable zodiac boats, pumps, and rations
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4">
        {depotInventory.map((depot) => (
          <div key={depot.id} className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div>
                <h4 className="text-xs font-bold text-ink">{depot.name}</h4>
                <span className="text-[11px] text-ink-secondary">{depot.ward}</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-surface-secondary px-2 py-0.5 rounded text-ink-secondary">
                WAREHOUSE
              </span>
            </div>

            <div className="space-y-2">
              {depot.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                  <div>
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="text-[10px] text-ink-secondary ml-2 font-mono">
                      (Min: {item.minThreshold})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${
                      item.currentStock < item.minThreshold ? 'text-status-alert' : 'text-status-safe'
                    }`}>
                      {item.currentStock} {item.unit}
                    </span>
                    {item.currentStock < item.minThreshold && (
                      <button
                        onClick={() => handleTransfer(depot.id, item)}
                        className="px-2 py-1 bg-purple text-white hover:bg-purple-deep rounded text-[10px] font-bold"
                      >
                        Re-supply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 19: Disaster Threat Level & Escalation Matrix Switcher
// ==========================================
export function EscalationMatrixModal({ onClose, showToast }) {
  const { threatLevel, setThreatLevel, addCommandLog, toggleSiren } = useFloodCommand();

  const handleSelectLevel = (code) => {
    setThreatLevel(code);
    showToast(`Municipal Disaster Alert Escalation changed to ${code}`);
    addCommandLog({
      type: 'THREAT_ESCALATION',
      details: `Municipal emergency status transitioned to ${code}.`,
      status: 'PROTOCOL_ENFORCED',
    });
    if (code === 'LEVEL-4' || code === 'LEVEL-5') {
      toggleSiren();
    }
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Municipal Disaster Threat Level Escalation
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Standard Operating Procedure (SOP) authority mobilization matrix
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {THREAT_LEVELS.map((lvl) => (
          <button
            key={lvl.code}
            onClick={() => handleSelectLevel(lvl.code)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 ${
              threatLevel === lvl.code
                ? 'border-purple ring-2 ring-purple/20 bg-purple-soft/30 shadow-sm'
                : 'border-border bg-surface hover:bg-surface-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${lvl.badgeColor}`}>
                {lvl.code}
              </span>
              {threatLevel === lvl.code && (
                <span className="text-[11px] font-bold text-purple flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CURRENT ACTIVE PROTOCOL
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-ink mt-1">{lvl.name}</h4>
            <p className="text-[11px] text-ink-secondary mt-0.5">{lvl.description}</p>
          </button>
        ))}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// FEATURE 20: SITREP One-Click PDF/Print Exporter
// ==========================================
export function SITREPReportModal({ onClose }) {
  const { commandLogs, threatLevel, selectedWard } = useFloodCommand();

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Official Municipal SITREP Briefing Document
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Brihanmumbai Municipal Corporation (BMC) Disaster Management Cell
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-4 font-sans text-ink bg-white">
        {/* Document Header */}
        <div className="border-b-2 border-ink pb-4 text-center">
          <div className="font-mono text-xs uppercase text-ink-secondary font-bold tracking-widest">
            BRIHANMUMBAI MUNICIPAL CORPORATION // DISASTER CONTROL ROOM
          </div>
          <h1 className="text-xl font-bold text-ink mt-1 uppercase tracking-tight">
            FLOOD OPERATIONS SITUATION REPORT (SITREP)
          </h1>
          <div className="text-xs font-mono text-ink-secondary mt-1">
            TIMESTAMP: {new Date().toLocaleString('en-IN')} | STATUS: <strong>{threatLevel}</strong> | SECTOR: <strong>{selectedWard.toUpperCase()}</strong>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-3 gap-3 border border-border p-3 rounded-lg text-xs">
          <div>
            <span className="text-ink-secondary block font-mono text-[10px]">CURRENT RAINFALL</span>
            <span className="font-bold font-mono text-sm text-ink">68.4 mm/hr</span>
          </div>
          <div>
            <span className="text-ink-secondary block font-mono text-[10px]">PEAK PREDICTED</span>
            <span className="font-bold font-mono text-sm text-status-alert">91.2 mm/hr (19:35 IST)</span>
          </div>
          <div>
            <span className="text-ink-secondary block font-mono text-[10px]">HIGH TIDE STAGE</span>
            <span className="font-bold font-mono text-sm text-purple">4.25m (Lockout Active)</span>
          </div>
        </div>

        {/* Closures */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1">
            1. Critical Corridor Closures &amp; Impassable Roads
          </h3>
          <ul className="text-xs space-y-1 list-disc list-inside text-ink-secondary">
            <li><strong>Andheri Subway:</strong> Waterlogged (52cm peak) — Completely Barricaded.</li>
            <li><strong>Sion Circle:</strong> 43cm flood — Diverted via Eastern Freeway.</li>
            <li><strong>Milan Subway:</strong> Impassable for LMVs — West approach closed.</li>
            <li><strong>LBS Marg Corridor:</strong> Severe congestion (85% impedance) due to Node D-204 backflow.</li>
          </ul>
        </div>

        {/* Audit Log Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1">
            2. Operational Decisions Dispatched
          </h3>
          <div className="space-y-1 text-xs">
            {commandLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex justify-between py-1 border-b border-border/40 font-mono text-[11px]">
                <span className="text-purple font-bold">{log.time}</span>
                <span className="text-ink truncate max-w-md">{log.details}</span>
                <span className="text-status-safe font-bold">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signoff */}
        <div className="pt-6 border-t border-border flex justify-between items-end text-xs font-mono">
          <div>
            <div>Authorized by: <strong>Cmdr. A. Verma</strong></div>
            <div className="text-ink-secondary">Chief Incident Commander, MCGM Disaster HQ</div>
          </div>
          <div className="text-right text-[10px] text-ink-secondary">
            SECURE SHA-256 MUNICIPAL SIGNATURE // VERIFIED
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// DECISION 1: Rapid Barricade Protocol Modal
// ==========================================
export function RapidBarricadeModal({ onClose, showToast }) {
  const { addCommandLog, dispatchIncident, updateVmsSign, setMapFocusTarget } = useFloodCommand();
  const [selectedSite, setSelectedSite] = useState('Andheri Subway (Ward K/E)');
  const [squadName, setSquadName] = useState('Traffic Squad 09 + Barricade Team');
  const [vmsPush, setVmsPush] = useState(true);

  const handleDeploy = (e) => {
    e.preventDefault();
    dispatchIncident('INC-2041', `Rapid Barricades Deployed at ${selectedSite}`);
    if (vmsPush) {
      updateVmsSign('VMS-01', `${selectedSite.toUpperCase()} CLOSED — RAPID BARRICADES ACTIVE`);
    }
    showToast(`Rapid Barricades Deployed & Enforced at ${selectedSite}`);
    addCommandLog({
      type: 'BARRICADE_DISPATCH',
      details: `Full corridor closure order issued for ${selectedSite}. VMS displays synchronized.`,
      status: 'EXECUTED',
    });
    setMapFocusTarget({
      coords: [72.8468, 19.1197],
      zoom: 15.5,
      title: 'Barricade Deployed: Andheri Subway',
      subtitle: 'Corridor Closed / Traffic Diverted to Gokhale Flyover',
    });
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Rapid Barricade & Subway Closure Protocol
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Physical water barrier deployment, police squad dispatch & highway sign sync
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleDeploy} className="p-5 space-y-4">
        <div>
          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
            Target Critical Corridor
          </label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink font-semibold"
          >
            <option value="Andheri Subway (Ward K/E)">Andheri Subway (Ward K/E) — 38cm depth</option>
            <option value="Milan Subway (Ward H/E)">Milan Subway (Ward H/E) — 34cm depth</option>
            <option value="Sion Circle Junction (Ward F/N)">Sion Circle Junction (Ward F/N) — 43cm depth</option>
            <option value="Hindmata Dadar Underpass (Ward G/N)">Hindmata Dadar Underpass (Ward G/N) — 29cm depth</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
            Assigned Tactical Interception Unit
          </label>
          <input
            type="text"
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            className="w-full bg-surface-secondary border border-border text-xs rounded-lg px-3 py-2 text-ink"
            required
          />
        </div>

        <div className="bg-surface-secondary p-3 rounded-xl border border-border flex items-center justify-between">
          <div className="text-xs text-ink font-medium">
            Automatically Broadcast Warning to Highway VMS Boards
          </div>
          <input
            type="checkbox"
            checked={vmsPush}
            onChange={(e) => setVmsPush(e.target.checked)}
            className="accent-purple w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-status-alert text-white hover:bg-status-alert/90 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Deploy Barricades Now</span>
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

// ==========================================
// DECISION 2: Drainage Node Tele-Inspection Modal
// ==========================================
export function DrainageTeleInspectionModal({ onClose, showToast }) {
  const { addCommandLog, setMapFocusTarget } = useFloodCommand();
  const [purging, setPurging] = useState(false);

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
      showToast('Hydraulic Sluice Valve Purge Sequence Completed on Node D-204');
      addCommandLog({
        type: 'DRAINAGE_PURGE',
        details: 'Node D-204 pneumatic de-silt purge executed; upstream head relieved by -14cm.',
        status: 'CONFIRMED',
      });
    }, 1200);
  };

  const handleViewMap = () => {
    setMapFocusTarget({
      coords: [72.8812, 19.0668],
      zoom: 15.5,
      title: 'Drainage Node D-204',
      subtitle: 'Kurla West Drop Junction — Surcharge Risk',
    });
    showToast('Map Centered on Node D-204');
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Drainage Node D-204 Tele-Inspection &amp; Hydraulic Sump
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Kurla West Drop Junction (RC Box Confluence • Ward L)
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Hydraulic Head</span>
            <div className="font-mono text-xl font-bold text-status-alert mt-0.5">87.4%</div>
            <span className="text-[10px] text-status-alert font-bold">Near Surcharge</span>
          </div>
          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Inflow Rate</span>
            <div className="font-mono text-xl font-bold text-ink mt-0.5">16.8 m³/s</div>
            <span className="text-[10px] text-ink-secondary">Capacity: 14.2 m³/s</span>
          </div>
          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <span className="text-[10px] font-mono text-ink-secondary uppercase">Invert Level</span>
            <div className="font-mono text-xl font-bold text-purple mt-0.5">2.10 m</div>
            <span className="text-[10px] text-ink-secondary">Tide: 4.25m (+0.38 bar)</span>
          </div>
        </div>

        <div className="p-3.5 bg-status-alert-soft border border-status-alert/30 rounded-xl text-xs text-ink">
          <div className="font-bold text-status-alert mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-status-alert" />
            <span>Downstream Throttle &amp; Backwater Threat</span>
          </div>
          Flap-gate F-09 submerged by astronomical high tide (+0.38 bar backpressure). Reverse-flow overtopping expected at 19:17 IST (+45m horizon).
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={handleViewMap}
            className="px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-purple" />
            <span>Focus Node on Map</span>
          </button>

          <button
            onClick={handlePurge}
            disabled={purging}
            className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${purging ? 'animate-spin' : ''}`} />
            <span>{purging ? 'Executing Purge...' : 'Trigger Automated Valve Flush'}</span>
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// DECISION 3: Emergency Traffic Diversion Modal
// ==========================================
export function TrafficDiversionModal({ onClose, showToast }) {
  const { addCommandLog, updateVmsSign } = useFloodCommand();

  const handleActivateDiversion = (corridor, detour) => {
    updateVmsSign('VMS-02', `${corridor.toUpperCase()} DIVERTED TO ${detour.toUpperCase()} VIA FREEWAY`);
    showToast(`Emergency Corridor Activated: ${corridor} diverted to ${detour}`);
    addCommandLog({
      type: 'TRAFFIC_DIVERSION',
      details: `Traffic diverted from ${corridor} to ${detour} with synchronized green-wave signal timing.`,
      status: 'ACTIVATED',
    });
  };

  const routes = [
    { from: 'Sion East & Ambedkar Road', to: 'Eastern Freeway Corridor', status: 'GREEN WAVE ACTIVE', savedTime: '24 mins' },
    { from: 'Andheri Subway Underpass', to: 'Gokhale Flyover Viaduct', status: 'DIVERSION ENFORCED', savedTime: '35 mins' },
    { from: 'Kurla LBS Marg Lowland', to: 'Santacruz Chembur Link Road (SCLR)', status: 'RECOMMENDED', savedTime: '18 mins' },
  ];

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Emergency Mobility &amp; Traffic Diversion Manager
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Automated bypass routing and traffic signal green-wave preemption
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-3">
        {routes.map((route, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between hover:border-purple/40 transition-colors">
            <div>
              <div className="text-xs font-bold text-ink">{route.from}</div>
              <div className="text-[11px] text-purple font-semibold mt-0.5">
                ↳ Detour: {route.to}
              </div>
              <div className="text-[10px] text-ink-secondary mt-1 font-mono">
                Avg ETA Savings: <strong>{route.savedTime}</strong>
              </div>
            </div>

            <button
              onClick={() => handleActivateDiversion(route.from, route.to)}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold shadow-subtle flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Activate Corridor</span>
            </button>
          </div>
        ))}
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// KPI DRILLDOWN 1: Rainfall & Weather Station Matrix
// ==========================================
export function RainfallTelemetryModal({ onClose }) {
  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-purple" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Mumbai Automated Weather Stations (AWS) Grid
            </h3>
            <p className="text-[11px] text-ink-secondary">
              62 MCGM &amp; IMD High-Precision Tipping-Bucket Rain Gauges
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { station: 'MCGM Colaba AWS', ward: 'Ward A', rate: '52.4 mm/h', total: '112 mm' },
            { station: 'Dadar BMC Compound', ward: 'Ward G/N', rate: '71.2 mm/h', total: '148 mm' },
            { station: 'Kurla LBS Sub-Center', ward: 'Ward L', rate: '88.5 mm/h', total: '184 mm' },
            { station: 'Sion Ambedkar School', ward: 'Ward F/N', rate: '92.0 mm/h', total: '196 mm' },
            { station: 'Andheri Fire Station', ward: 'Ward K/E', rate: '68.4 mm/h', total: '135 mm' },
            { station: 'Bandra Reclamation', ward: 'Ward H/W', rate: '44.0 mm/h', total: '98 mm' },
          ].map((st) => (
            <div key={st.station} className="p-3 bg-surface rounded-xl border border-border">
              <span className="font-bold text-xs text-ink block">{st.station}</span>
              <span className="text-[10px] text-ink-secondary block font-mono">{st.ward}</span>
              <div className="font-mono font-bold text-base text-purple mt-2">{st.rate}</div>
              <span className="text-[10px] text-ink-secondary font-mono">Accum: {st.total}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ==========================================
// KPI DRILLDOWN 2: Affected Roads Full Matrix
// ==========================================
export function AffectedRoadsModal({ onClose }) {
  const { setMapFocusTarget } = useFloodCommand();

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-4xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              Municipal Road Inundation &amp; Clearance Registry
            </h3>
            <p className="text-[11px] text-ink-secondary">
              27 Monitored Arterials, Subways, Underpasses &amp; Highway Viaducts
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg text-ink-secondary hover:text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-3">
        {ROAD_CORRIDORS.map((road) => (
          <div key={road.id} className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between hover:border-purple/40 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-ink">{road.name}</h4>
                <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                  road.status === 'CRITICAL' ? 'bg-status-alert-soft text-status-alert' : 'bg-status-warning-soft text-status-warning'
                }`}>
                  {road.status}
                </span>
              </div>
              <div className="text-[11px] text-ink-secondary mt-0.5">
                {road.ward} • Cause: {road.cause}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-status-alert">{road.currentDepth} cm</span>
                <span className="text-[10px] text-ink-secondary block font-mono">Peak: {road.forecastPeak} cm ({road.peakTime})</span>
              </div>
              <button
                onClick={() => {
                  setMapFocusTarget({
                    coords: [road.coordinates[1], road.coordinates[0]],
                    zoom: 15,
                    title: road.name,
                    subtitle: `${road.currentDepth}cm depth`,
                  });
                  onClose();
                }}
                className="px-2.5 py-1.5 bg-surface-secondary hover:bg-purple hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModalBackdrop>
  );
}
