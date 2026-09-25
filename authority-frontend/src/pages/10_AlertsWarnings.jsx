import React, { useState, useMemo } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import {
  Bell,
  Radio,
  Smartphone,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Send,
  Shield,
  FileCheck,
  Code,
  Globe,
  Share2,
  Volume2,
  Users,
  Cpu,
  Key,
  BookOpen,
  Home,
  RotateCcw,
  Activity,
  Megaphone,
  Building2,
  MapPin,
  BrainCircuit,
  History,
  PhoneCall,
  Search,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

// 20 Specialized Operational Feature Components
import CapXmlInspectorModal from '../components/alerts/CapXmlInspectorModal';
import MultilingualStudioModal from '../components/alerts/MultilingualStudioModal';
import CellBroadcastGeofenceModal from '../components/alerts/CellBroadcastGeofenceModal';
import MultiChannelMatrixModal from '../components/alerts/MultiChannelMatrixModal';
import SirenAudioNetworkModal from '../components/alerts/SirenAudioNetworkModal';
import DemographicVulnerabilityModal from '../components/alerts/DemographicVulnerabilityModal';
import VmsTwinControllerModal from '../components/alerts/VmsTwinControllerModal';
import SensorTriggerRulesModal from '../components/alerts/SensorTriggerRulesModal';
import DualKeySignoffModal from '../components/alerts/DualKeySignoffModal';
import EmergencyPlaybooksModal from '../components/alerts/EmergencyPlaybooksModal';
import ShelterEvacuationModal from '../components/alerts/ShelterEvacuationModal';
import AllClearRevocationModal from '../components/alerts/AllClearRevocationModal';
import DeliveryTelemetryModal from '../components/alerts/DeliveryTelemetryModal';
import VoiceAnnouncerModal from '../components/alerts/VoiceAnnouncerModal';
import CriticalFacilityDirectModal from '../components/alerts/CriticalFacilityDirectModal';
import WardGeofenceMapModal from '../components/alerts/WardGeofenceMapModal';
import SocialPressGeneratorModal from '../components/alerts/SocialPressGeneratorModal';
import MessageClarityAnalyzerModal from '../components/alerts/MessageClarityAnalyzerModal';
import HistoricalArchiveModal from '../components/alerts/HistoricalArchiveModal';
import EmergencyHelplineBridgeModal from '../components/alerts/EmergencyHelplineBridgeModal';

const AVAILABLE_WARDS = [
  { code: 'Ward K/E', name: 'Andheri East', pop: 840000 },
  { code: 'Ward L', name: 'Kurla / Mithi', pop: 920000 },
  { code: 'Ward F/N', name: 'Sion / Matunga', pop: 520000 },
  { code: 'Ward G/N', name: 'Dadar / Mahim', pop: 580000 },
  { code: 'Ward H/E', name: 'Bandra East', pop: 610000 },
  { code: 'Ward M/W', name: 'Chembur West', pop: 440000 },
];

export default function AlertsWarnings() {
  const { alertsList, publishAlert, revokeAlert, retransmitAlert } = useFloodCommand();

  // Core Compose State
  const [alertType, setAlertType] = useState('Urban Flash Flood Warning');
  const [severityLevel, setSeverityLevel] = useState('Extreme (Red)');
  const [selectedWards, setSelectedWards] = useState(['Ward K/E', 'Ward L']);
  const [depthThreshold, setDepthThreshold] = useState('20-35 cm');
  const [message, setMessage] = useState(
    'Heavy convective rainfall coupled with high tide will cause severe roadway inundation (20-35cm) in Kurla, Sion, and Andheri subways between 19:00 and 20:30. Avoid low-lying underpasses. Divert to Eastern Freeway. Dial 1916 for emergency assistance.'
  );

  // Active Dissemination Channels for draft
  const [selectedChannels, setSelectedChannels] = useState([
    'Cell Broadcast',
    'VMS Displays',
    'App Push',
  ]);

  // Two-Officer Key Status
  const [twoOfficerSigned, setTwoOfficerSigned] = useState(true);

  // Interactive UI State
  const [toast, setToast] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'RED' | 'ORANGE' | 'YELLOW'
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneLang, setPhoneLang] = useState('en'); // 'en' | 'hi' | 'mr'
  const [phoneAcknowledged, setPhoneAcknowledged] = useState(false);
  const [vmsIsRed, setVmsIsRed] = useState(false);
  const [selectedInspectionAlert, setSelectedInspectionAlert] = useState(null);

  // 20 Modal Open/Close States
  const [modals, setModals] = useState({
    capXml: false,
    multilingual: false,
    cellBroadcast: false,
    multiChannel: false,
    sirenAudio: false,
    demographics: false,
    vmsTwin: false,
    sensorRules: false,
    dualKey: false,
    playbooks: false,
    shelters: false,
    allClear: false,
    telemetry: false,
    voiceAnnouncer: false,
    criticalFacility: false,
    wardMap: false,
    socialPress: false,
    messageClarity: false,
    historical: false,
    helplineBridge: false,
  });

  const openModal = (name) => setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModals((prev) => ({ ...prev, [name]: false }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Dynamic Audience Reach calculation
  const totalAudienceCount = useMemo(() => {
    return selectedWards.reduce((acc, wardCode) => {
      const w = AVAILABLE_WARDS.find((item) => item.code === wardCode);
      return acc + (w ? w.pop : 500000);
    }, 0);
  }, [selectedWards]);

  // Alert Broadcasting Handler
  const handleBroadcast = () => {
    if (!twoOfficerSigned) {
      openModal('dualKey');
      showToast('Action Required: Two-Officer Key sign-off needed before broadcasting.');
      return;
    }

    const newId = `AL-08${Math.floor(45 + Math.random() * 50)}`;
    const newAlert = {
      id: newId,
      title: `${alertType.toUpperCase()}: ${selectedWards.join(', ')}`,
      wards: selectedWards,
      status: 'PUBLISHED - ACTIVE',
      timestamp: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST)`,
      audienceReach: `${(totalAudienceCount / 1000).toLocaleString()}k citizens`,
      depthRange: depthThreshold,
      channels: selectedChannels,
      severity: severityLevel,
      messageBody: message,
    };

    publishAlert(newAlert);
    showToast(`Success: Emergency Alert ${newId} Broadcast Issued across ${selectedWards.length} Wards.`);
  };

  // Ward Toggling
  const toggleWard = (wardCode) => {
    setSelectedWards((prev) =>
      prev.includes(wardCode) ? prev.filter((w) => w !== wardCode) : [...prev, wardCode]
    );
  };

  const handleSelectAllWards = () => {
    setSelectedWards(AVAILABLE_WARDS.map((w) => w.code));
  };

  const handleClearWards = () => {
    setSelectedWards([]);
  };

  // SOP Playbook loader
  const handleLoadPlaybook = (pb) => {
    setAlertType(pb.classification);
    setSelectedWards(pb.wards);
    setDepthThreshold(pb.depth);
    setMessage(pb.message);
    setSelectedChannels(pb.channels);
    if (pb.severity.includes('RED')) setSeverityLevel('Extreme (Red)');
    else if (pb.severity.includes('ORANGE')) setSeverityLevel('Severe (Orange)');
    else setSeverityLevel('Moderate (Yellow)');
    showToast(`Loaded SOP Playbook: ${pb.id}`);
  };

  // Automated trigger integration
  const handleApplySimulatedAlert = (draft) => {
    setAlertType(draft.alertType);
    setSelectedWards(draft.selectedWards);
    setDepthThreshold(draft.depthThreshold);
    setMessage(draft.message);
    showToast('Applied IoT Sensor Triggered Alert Draft.');
  };

  // Filtered Alert List
  const filteredAlerts = useMemo(() => {
    return alertsList.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.wards && a.wards.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;
      if (severityFilter === 'ALL') return true;
      if (severityFilter === 'RED') return a.title.includes('WARNING') || a.title.includes('FLASH');
      if (severityFilter === 'ORANGE') return a.title.includes('ADVISORY') || a.title.includes('WATCH');
      if (severityFilter === 'YELLOW') return a.title.includes('CAUTION') || a.title.includes('SURCHARGE');
      return true;
    });
  }, [alertsList, severityFilter, searchQuery]);

  // Dynamic Top Metrics
  const redCount = alertsList.filter((a) => a.title.includes('WARNING') || a.title.includes('FLASH')).length;
  const orangeCount = alertsList.filter((a) => a.title.includes('ADVISORY') || a.title.includes('WATCH')).length;
  const yellowCount = alertsList.filter((a) => a.title.includes('CAUTION') || a.title.includes('SURCHARGE')).length;

  return (
    <div className="p-4 md:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* 20 Specialized Operational Modals */}
      <CapXmlInspectorModal
        isOpen={modals.capXml}
        onClose={() => closeModal('capXml')}
        alertData={
          selectedInspectionAlert || {
            id: 'CAP-IN-MH-MCGM-2026-0842',
            title: alertType,
            severity: severityLevel.split(' ')[0],
            wards: selectedWards,
            depthThreshold: depthThreshold,
            message: message,
          }
        }
      />
      <MultilingualStudioModal
        isOpen={modals.multilingual}
        onClose={() => closeModal('multilingual')}
        englishMessage={message}
        onApplyLanguage={(translatedText) => setMessage(translatedText)}
      />
      <CellBroadcastGeofenceModal
        isOpen={modals.cellBroadcast}
        onClose={() => closeModal('cellBroadcast')}
        targetWards={selectedWards}
        onApplyAudience={(formattedAudience) => showToast(`Audience locked: ${formattedAudience}`)}
      />
      <MultiChannelMatrixModal
        isOpen={modals.multiChannel}
        onClose={() => closeModal('multiChannel')}
        onUpdateChannels={(chs) => {
          setSelectedChannels(chs);
          showToast(`Active broadcast channels updated: ${chs.length} selected.`);
        }}
      />
      <SirenAudioNetworkModal
        isOpen={modals.sirenAudio}
        onClose={() => closeModal('sirenAudio')}
      />
      <DemographicVulnerabilityModal
        isOpen={modals.demographics}
        onClose={() => closeModal('demographics')}
        selectedWards={selectedWards}
      />
      <VmsTwinControllerModal
        isOpen={modals.vmsTwin}
        onClose={() => closeModal('vmsTwin')}
        initialText={message}
      />
      <SensorTriggerRulesModal
        isOpen={modals.sensorRules}
        onClose={() => closeModal('sensorRules')}
        onTriggerSimulatedAlert={handleApplySimulatedAlert}
      />
      <DualKeySignoffModal
        isOpen={modals.dualKey}
        onClose={() => closeModal('dualKey')}
        isSigned={twoOfficerSigned}
        onSignComplete={(status) => {
          setTwoOfficerSigned(status);
          showToast('Two-Officer Digital Authorization Key Verified.');
        }}
      />
      <EmergencyPlaybooksModal
        isOpen={modals.playbooks}
        onClose={() => closeModal('playbooks')}
        onLoadPlaybook={handleLoadPlaybook}
      />
      <ShelterEvacuationModal
        isOpen={modals.shelters}
        onClose={() => closeModal('shelters')}
        targetWards={selectedWards}
        onAttachShelterInfo={(snippet) => setMessage((prev) => `${prev} ${snippet}`)}
      />
      <AllClearRevocationModal
        isOpen={modals.allClear}
        onClose={() => closeModal('allClear')}
        activeAlerts={alertsList}
        onRevokeConfirm={(id, reason) => {
          revokeAlert(id, reason);
          showToast(`Alert ${id} revoked. All-Clear broadcast issued.`);
        }}
      />
      <DeliveryTelemetryModal
        isOpen={modals.telemetry}
        onClose={() => closeModal('telemetry')}
        alert={selectedInspectionAlert || alertsList[0] || {}}
      />
      <VoiceAnnouncerModal
        isOpen={modals.voiceAnnouncer}
        onClose={() => closeModal('voiceAnnouncer')}
        messageText={message}
      />
      <CriticalFacilityDirectModal
        isOpen={modals.criticalFacility}
        onClose={() => closeModal('criticalFacility')}
        targetWards={selectedWards}
      />
      <WardGeofenceMapModal
        isOpen={modals.wardMap}
        onClose={() => closeModal('wardMap')}
        selectedWards={selectedWards}
        onToggleWard={toggleWard}
      />
      <SocialPressGeneratorModal
        isOpen={modals.socialPress}
        onClose={() => closeModal('socialPress')}
        alertTitle={alertType}
        message={message}
        wards={selectedWards}
      />
      <MessageClarityAnalyzerModal
        isOpen={modals.messageClarity}
        onClose={() => closeModal('messageClarity')}
        currentMessage={message}
        onApplyImprovement={(refined) => {
          setMessage(refined);
          showToast('Applied NDMA Panic-Mitigation Refinement to Draft.');
        }}
      />
      <HistoricalArchiveModal
        isOpen={modals.historical}
        onClose={() => closeModal('historical')}
      />
      <EmergencyHelplineBridgeModal
        isOpen={modals.helplineBridge}
        onClose={() => closeModal('helplineBridge')}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <Radio className="w-4 h-4 text-status-alert animate-pulse" />
            Public Safety &amp; Multi-Channel Emergency Warning Command Console
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            OASIS Common Alerting Protocol (CAP-v1.2) Compliant Disaster Broadcast Studio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => openModal('capXml')}
            className="px-2.5 py-1 rounded-md bg-purple-soft text-purple font-bold hover:bg-purple-light transition-colors flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>CAP-XML v1.2</span>
          </button>
          <span className="px-2.5 py-1 rounded-md bg-status-safe-soft text-status-safe font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GATEWAY: ONLINE</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-surface-secondary text-ink font-bold">
            REACH: {(totalAudienceCount / 1000).toLocaleString()}k CITIZENS
          </span>
        </div>
      </div>

      {/* 20 Specialized Features Quick Command Strip */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple" />
            <span>20 Specialized Public Safety &amp; Broadcast Operations Modules</span>
          </span>
          <span className="text-[10px] font-mono text-purple font-semibold">
            All Modules Active &amp; Interconnected
          </span>
        </div>

        {/* 4 Groups of 5 Tools Each */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Group 1: Protocols & Authoring */}
          <div className="p-2 bg-surface-secondary/70 rounded-lg border border-border/80 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-secondary uppercase">
              1. Standards &amp; Authoring
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => openModal('capXml')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Code className="w-3 h-3 text-purple" /> CAP-XML Inspector
              </button>
              <button
                onClick={() => openModal('multilingual')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Globe className="w-3 h-3 text-purple" /> Multilingual Studio (4 Lang)
              </button>
              <button
                onClick={() => openModal('messageClarity')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <BrainCircuit className="w-3 h-3 text-purple" /> Tone &amp; Clarity Analyzer
              </button>
              <button
                onClick={() => openModal('playbooks')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3 h-3 text-purple" /> SOP Flood Playbooks
              </button>
              <button
                onClick={() => openModal('demographics')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3 h-3 text-purple" /> Vulnerability Calculator
              </button>
            </div>
          </div>

          {/* Group 2: Dissemination Radios */}
          <div className="p-2 bg-surface-secondary/70 rounded-lg border border-border/80 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-secondary uppercase">
              2. Dissemination Radios
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => openModal('cellBroadcast')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Radio className="w-3 h-3 text-status-alert" /> Cell Broadcast (eNodeB)
              </button>
              <button
                onClick={() => openModal('multiChannel')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3 h-3 text-purple" /> 8-Channel Gateway Matrix
              </button>
              <button
                onClick={() => openModal('vmsTwin')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Tv className="w-3 h-3 text-status-warning" /> Roadside VMS LED Twin
              </button>
              <button
                onClick={() => openModal('sirenAudio')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3 h-3 text-status-alert" /> Siren Synthesizer (125dB)
              </button>
              <button
                onClick={() => openModal('voiceAnnouncer')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Megaphone className="w-3 h-3 text-purple" /> TTS PA Voice Announcer
              </button>
            </div>
          </div>

          {/* Group 3: Tactical Emergency Assets */}
          <div className="p-2 bg-surface-secondary/70 rounded-lg border border-border/80 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-secondary uppercase">
              3. Tactical Coordination
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => openModal('sensorRules')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3 h-3 text-purple" /> IoT Sensor Trigger Rules
              </button>
              <button
                onClick={() => openModal('wardMap')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3 text-purple" /> Interactive Ward Geofence
              </button>
              <button
                onClick={() => openModal('shelters')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3 h-3 text-status-safe" /> Relief Shelters &amp; Corridors
              </button>
              <button
                onClick={() => openModal('criticalFacility')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3 h-3 text-purple" /> Hospital &amp; Transit Dispatch
              </button>
              <button
                onClick={() => openModal('allClear')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3 text-status-safe" /> "All-Clear" De-escalation
              </button>
            </div>
          </div>

          {/* Group 4: Telemetry, Social & Hotlines */}
          <div className="p-2 bg-surface-secondary/70 rounded-lg border border-border/80 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-secondary uppercase">
              4. Telemetry &amp; Response
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => openModal('dualKey')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Key className="w-3 h-3 text-status-alert" /> Two-Officer Key Vault
              </button>
              <button
                onClick={() => openModal('telemetry')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-3 h-3 text-purple" /> Live Handset Telemetry
              </button>
              <button
                onClick={() => openModal('socialPress')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3 h-3 text-purple" /> Social &amp; Press Wire
              </button>
              <button
                onClick={() => openModal('historical')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <History className="w-3 h-3 text-purple" /> Historical Warning Audit
              </button>
              <button
                onClick={() => openModal('helplineBridge')}
                className="text-left px-2 py-1 rounded bg-surface hover:bg-purple-soft hover:text-purple text-[11px] font-medium text-ink transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3 h-3 text-status-alert" /> 1916 Helpline &amp; Agencies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Severity Filter Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setSeverityFilter(severityFilter === 'RED' ? 'ALL' : 'RED')}
          className={`border rounded-xl p-3 shadow-subtle cursor-pointer transition-all ${
            severityFilter === 'RED'
              ? 'bg-status-alert-soft border-status-alert ring-2 ring-status-alert/30'
              : 'bg-surface border-border hover:border-status-alert/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
              Red Severe Warnings
            </span>
            {severityFilter === 'RED' && (
              <span className="text-[9px] font-mono font-bold text-status-alert">[FILTER ACTIVE]</span>
            )}
          </div>
          <div className="text-xl font-bold font-mono text-status-alert mt-1">
            {redCount} Active
          </div>
          <div className="text-[10px] text-ink-secondary">Flash Flood &gt;35cm depth • Click to filter</div>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
          className={`border rounded-xl p-3 shadow-subtle cursor-pointer transition-all ${
            severityFilter === 'ORANGE'
              ? 'bg-status-warning-soft border-status-warning ring-2 ring-status-warning/30'
              : 'bg-surface border-border hover:border-status-warning/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
              Orange Watch
            </span>
            {severityFilter === 'ORANGE' && (
              <span className="text-[9px] font-mono font-bold text-status-warning">[FILTER ACTIVE]</span>
            )}
          </div>
          <div className="text-xl font-bold font-mono text-status-warning mt-1">
            {orangeCount} Active
          </div>
          <div className="text-[10px] text-ink-secondary">Waterlogging 15-30cm • Click to filter</div>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'YELLOW' ? 'ALL' : 'YELLOW')}
          className={`border rounded-xl p-3 shadow-subtle cursor-pointer transition-all ${
            severityFilter === 'YELLOW'
              ? 'bg-purple-soft border-purple ring-2 ring-purple/30'
              : 'bg-surface border-border hover:border-purple/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
              Yellow Advisory
            </span>
            {severityFilter === 'YELLOW' && (
              <span className="text-[9px] font-mono font-bold text-purple">[FILTER ACTIVE]</span>
            )}
          </div>
          <div className="text-xl font-bold font-mono text-purple mt-1">
            {yellowCount} Active
          </div>
          <div className="text-[10px] text-ink-secondary">Moderate Traffic Delay • Click to filter</div>
        </div>

        <div
          onClick={() => openModal('demographics')}
          className="bg-surface border border-border hover:border-status-safe/60 rounded-xl p-3 shadow-subtle cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
              Target Audience
            </span>
            <Users className="w-3.5 h-3.5 text-status-safe" />
          </div>
          <div className="text-xl font-bold font-mono text-status-safe mt-1">
            {(totalAudienceCount / 1000).toLocaleString()}k
          </div>
          <div className="text-[10px] text-ink-secondary">Citizens in selected wards • View demographics</div>
        </div>
      </div>

      {/* Workspace Grid: Form (5 cols) + Previews (4 cols) + History (3 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Alert Authoring (5 cols) */}
        <div className="xl:col-span-5 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3.5">
          <div className="border-b border-border pb-2.5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
                Compose Emergency Broadcast
              </h3>
              <p className="text-[10px] text-ink-secondary">Real-time dissemination authoring</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openModal('playbooks')}
                className="px-2 py-1 rounded bg-purple-soft text-purple hover:bg-purple-light text-[10px] font-bold flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3 h-3" /> SOP Playbooks
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Classification & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-ink-secondary uppercase block mb-1">
                  Alert Classification
                </label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface-secondary border border-border text-ink font-semibold focus:outline-none focus:border-purple"
                >
                  <option>Urban Flash Flood Warning</option>
                  <option>Roadway Inundation Advisory</option>
                  <option>Drainage Surcharge Hazard Alert</option>
                  <option>High Tide Coastal Lockout Warning</option>
                  <option>Catchment Dam Spillway Release</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-secondary uppercase block mb-1">
                  Severity Urgency
                </label>
                <select
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface-secondary border border-border text-ink font-semibold focus:outline-none focus:border-purple"
                >
                  <option>Extreme (Red)</option>
                  <option>Severe (Orange)</option>
                  <option>Moderate (Yellow)</option>
                  <option>Informational (Green)</option>
                </select>
              </div>
            </div>

            {/* Targeted Municipal Wards */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-ink-secondary uppercase">
                  Targeted Municipal Wards ({selectedWards.length} Selected)
                </label>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <button
                    onClick={handleSelectAllWards}
                    className="text-purple hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-ink-secondary">•</span>
                  <button
                    onClick={handleClearWards}
                    className="text-ink-secondary hover:text-ink"
                  >
                    Clear
                  </button>
                  <span className="text-ink-secondary">•</span>
                  <button
                    onClick={() => openModal('wardMap')}
                    className="text-purple hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <MapPin className="w-3 h-3" /> Map View
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_WARDS.map((w) => {
                  const isSel = selectedWards.includes(w.code);
                  return (
                    <button
                      key={w.code}
                      onClick={() => toggleWard(w.code)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                        isSel
                          ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                          : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                      }`}
                    >
                      {isSel && <Check className="w-3 h-3" />}
                      <span>{w.code} ({w.name.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Depth Threshold with Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-ink-secondary uppercase">
                  Water Depth Hazard Threshold
                </label>
                <div className="flex items-center gap-1">
                  {['15-25 cm', '20-35 cm', '35-50 cm', '>50 cm'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setDepthThreshold(chip)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        depthThreshold === chip
                          ? 'bg-purple text-white font-bold'
                          : 'bg-surface-secondary text-ink-secondary hover:bg-border'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={depthThreshold}
                onChange={(e) => setDepthThreshold(e.target.value)}
                className="w-full p-2 rounded-lg bg-surface-secondary border border-border font-mono text-ink font-bold text-xs"
              />
            </div>

            {/* Message Body & Helper Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-ink-secondary uppercase">
                  Broadcast Message Body
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('multilingual')}
                    className="text-[10px] font-semibold text-purple hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" /> Multi-Language
                  </button>
                  <button
                    onClick={() => openModal('messageClarity')}
                    className="text-[10px] font-semibold text-purple hover:underline flex items-center gap-1"
                  >
                    <BrainCircuit className="w-3 h-3" /> Clarity Check
                  </button>
                  <button
                    onClick={() => openModal('shelters')}
                    className="text-[10px] font-semibold text-status-safe hover:underline flex items-center gap-1"
                  >
                    <Home className="w-3 h-3" /> Attach Shelter
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-sans focus:outline-none focus:border-purple leading-relaxed"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary mt-1">
                <span className="flex items-center gap-1 text-purple">
                  <Volume2 className="w-3 h-3" />
                  TTS Read Time: ~{Math.round(message.length / 18)} seconds
                </span>
                <span>{message.length} / 360 Characters</span>
              </div>
            </div>

            {/* Multi-Channel selection strip */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-ink-secondary uppercase">
                Active Channels:
              </span>
              <button
                onClick={() => openModal('multiChannel')}
                className="text-purple font-mono font-bold text-[11px] hover:underline flex items-center gap-1"
              >
                <span>{selectedChannels.join(', ')}</span>
                <Sliders className="w-3 h-3" />
              </button>
            </div>

            {/* Authorize & Dual Key Button */}
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                onClick={() => openModal('dualKey')}
                className={`text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  twoOfficerSigned
                    ? 'bg-status-safe-soft text-status-safe border-status-safe/30'
                    : 'bg-status-alert-soft text-status-alert border-status-alert/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{twoOfficerSigned ? 'Two-Officer Key Signed' : 'Click to Sign Dual Key'}</span>
              </button>

              <button
                onClick={handleBroadcast}
                className="w-full sm:w-auto py-2.5 px-4 bg-status-alert hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-subtle transition-colors"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Authorize &amp; Broadcast Alert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Live Device Simulation Previews (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3.5">
          {/* Smartphone WEA Notification Preview */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-ink-secondary flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple" />
                Citizen Smartphone Preview
              </span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setPhoneLang('en')}
                  className={`px-1.5 py-0.5 rounded ${
                    phoneLang === 'en' ? 'bg-purple text-white font-bold' : 'bg-surface-secondary text-ink-secondary'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setPhoneLang('hi')}
                  className={`px-1.5 py-0.5 rounded ${
                    phoneLang === 'hi' ? 'bg-purple text-white font-bold' : 'bg-surface-secondary text-ink-secondary'
                  }`}
                >
                  HI
                </button>
                <button
                  onClick={() => setPhoneLang('mr')}
                  className={`px-1.5 py-0.5 rounded ${
                    phoneLang === 'mr' ? 'bg-purple text-white font-bold' : 'bg-surface-secondary text-ink-secondary'
                  }`}
                >
                  MR
                </button>
              </div>
            </div>

            {/* Phone Enclosure */}
            <div className="bg-black text-white p-4 rounded-2xl border border-border shadow-elevated relative overflow-hidden">
              <div className="flex items-center justify-between text-status-alert text-xs font-bold uppercase">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 fill-current text-status-alert animate-bounce" />
                  <span>Emergency Alert: {alertType.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => openModal('voiceAnnouncer')}
                  className="p-1 rounded hover:bg-white/10 text-slate-300"
                  title="Test Audio Readout"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                <span>MCGM Disaster Unit • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                <span className="text-purple-300">Target: {selectedWards.join(', ')}</span>
              </div>

              <p className="text-xs text-slate-100 mt-2.5 leading-relaxed font-medium">
                {phoneLang === 'en'
                  ? message
                  : phoneLang === 'hi'
                  ? 'भारी मानसूनी वर्षा और उच्च ज्वार के कारण कुर्ला, सायन और अंधेरी सबवे में जलभराव होगा। निचले अंडरपास से बचें। ईस्टर्न फ्रीवे का उपयोग करें।'
                  : 'अतिवृष्टी आणि समुद्रातील भरतीमुळे कुर्ला, सायन आणि अंधेरी भुयारी मार्गात पाणी साचण्याची शक्यता आहे. सखल भुयारी मार्ग टाळा. ईस्टर्न फ्रीवेचा वापर करा.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                <button
                  onClick={() => {
                    setPhoneAcknowledged(true);
                    showToast('Citizen handset acknowledged emergency warning.');
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    phoneAcknowledged
                      ? 'bg-status-safe text-white font-bold'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  {phoneAcknowledged ? '✓ Acknowledged' : '[Acknowledge Alert]'}
                </button>
                <button
                  onClick={() => openModal('wardMap')}
                  className="text-purple-300 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>[View Safe Corridor]</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Roadside Variable Message Sign (VMS) Preview */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-ink-secondary flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple" />
                Roadside VMS Arterial Displays (24 Screens)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVmsIsRed(!vmsIsRed)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    vmsIsRed ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                  }`}
                >
                  {vmsIsRed ? 'Red Mode' : 'Amber Mode'}
                </button>
                <button
                  onClick={() => openModal('vmsTwin')}
                  className="text-[10px] text-purple hover:underline font-mono font-bold"
                >
                  Studio Twin
                </button>
              </div>
            </div>

            <div className="bg-[#111] p-3.5 rounded-xl border border-border font-mono text-xs tracking-wider leading-relaxed text-center font-bold relative">
              <div
                className={`${
                  vmsIsRed ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-status-warning drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                }`}
              >
                <div>[ {alertType.toUpperCase()}: {selectedWards.join(' / ')} ]</div>
                <div className="mt-1 text-[11px]">
                  [ WATER DEPTH: {depthThreshold} // DIVERT VIA FREEWAY ]
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alert History & Actions (3 cols) */}
        <div className="xl:col-span-3 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Broadcast Log History ({filteredAlerts.length})
            </span>
            <button
              onClick={() => openModal('historical')}
              className="text-[10px] font-semibold text-purple hover:underline font-mono"
            >
              Past Archive
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-2 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search alert ID or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1 rounded-lg bg-surface-secondary border border-border text-[11px] text-ink focus:border-purple"
            />
          </div>

          {/* Alerts Scrollable List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
            {filteredAlerts.map((alert) => {
              const isRevoked = alert.status.includes('REVOKED');
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isRevoked
                      ? 'bg-surface-secondary/50 border-border opacity-60'
                      : 'bg-surface-secondary border-border hover:border-purple/40 shadow-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-ink">{alert.id}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isRevoked
                          ? 'bg-status-safe-soft text-status-safe'
                          : 'bg-purple-soft text-purple'
                      }`}
                    >
                      {alert.status.split(' - ')[0]}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-ink mt-1 leading-tight">{alert.title}</h5>

                  <div className="text-[10px] font-mono text-ink-secondary mt-1">
                    Time: {alert.timestamp}
                  </div>
                  <div className="text-[10px] font-mono text-purple font-semibold mt-0.5">
                    Reach: {alert.audienceReach}
                  </div>

                  {alert.revocationReason && (
                    <div className="text-[9px] font-mono text-status-safe mt-1">
                      Reason: {alert.revocationReason}
                    </div>
                  )}

                  {/* Operational Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-border flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                    <button
                      onClick={() => {
                        setSelectedInspectionAlert(alert);
                        openModal('capXml');
                      }}
                      className="px-2 py-0.5 rounded bg-surface hover:bg-purple-soft hover:text-purple text-ink border border-border transition-colors"
                    >
                      CAP-XML
                    </button>

                    <button
                      onClick={() => {
                        setSelectedInspectionAlert(alert);
                        openModal('telemetry');
                      }}
                      className="px-2 py-0.5 rounded bg-surface hover:bg-purple-soft hover:text-purple text-ink border border-border transition-colors"
                    >
                      Telemetry
                    </button>

                    {!isRevoked ? (
                      <button
                        onClick={() => {
                          revokeAlert(alert.id, 'Waters receded - All Clear');
                          showToast(`Alert ${alert.id} revoked. All-Clear issued.`);
                        }}
                        className="px-2 py-0.5 rounded bg-status-safe-soft text-status-safe hover:bg-status-safe hover:text-white font-bold transition-colors"
                      >
                        All-Clear
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          retransmitAlert(alert.id);
                          showToast(`Alert ${alert.id} retransmitted.`);
                        }}
                        className="px-2 py-0.5 rounded bg-purple-soft text-purple hover:bg-purple hover:text-white font-bold transition-colors"
                      >
                        Retransmit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
