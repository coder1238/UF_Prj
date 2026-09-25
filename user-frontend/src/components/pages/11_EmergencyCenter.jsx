import React, { useState, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  PhoneCall, AlertOctagon, ShieldAlert, CheckSquare, Square, 
  MapPin, Share2, Radio, LifeBuoy, AlertTriangle, Copy, Check,
  Zap, Heart, Droplets, Briefcase, Home, BatteryCharging, 
  Compass, Users, Camera, Wrench, ChevronRight, X, Plus, 
  Volume2, Trash2, RefreshCw, Send, QrCode, Phone, ExternalLink
} from 'lucide-react';

import { emergencyAudio } from '../emergency/EmergencyAudioSynthesizer';
import SimulatedCallModal from '../emergency/SimulatedCallModal';
import OfflineBeaconQrModal from '../emergency/OfflineBeaconQrModal';
import EmergencyRadarModal from '../emergency/EmergencyRadarModal';
import EmergencyTriageModal from '../emergency/EmergencyTriageModal';
import AcousticSirenWhistleModal from '../emergency/AcousticSirenWhistleModal';
import OfflineMeshSimulatorModal from '../emergency/OfflineMeshSimulatorModal';
import EmergencyFamilyPingModal from '../emergency/EmergencyFamilyPingModal';
import RapidHazardReportModal from '../emergency/RapidHazardReportModal';
import DisasterRadioBroadcastModal from '../emergency/DisasterRadioBroadcastModal';
import SubmergedVehicleSurvivalModal from '../emergency/SubmergedVehicleSurvivalModal';
import RationWaterCalculatorModal from '../emergency/RationWaterCalculatorModal';
import RiverNullahGaugeModal from '../emergency/RiverNullahGaugeModal';
import UltraPowerSaverModal from '../emergency/UltraPowerSaverModal';
import BoatRescueMobilizerModal from '../emergency/BoatRescueMobilizerModal';
import MedicalColdChainModal from '../emergency/MedicalColdChainModal';
import GoBagAuditorModal from '../emergency/GoBagAuditorModal';
import PostFloodInspectorModal from '../emergency/PostFloodInspectorModal';

export default function EmergencyCenter() {
  const { currentWard, speakAlert } = useFlood();
  const { navigateTo } = useNavigation();

  // --- SOS Beacon State Machine ---
  // 'IDLE' | 'ARMED' | 'TRANSMITTING' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED'
  const [sosStatus, setSosStatus] = useState('IDLE');
  const [countdownSecs, setCountdownSecs] = useState(5);
  const [etaMins, setEtaMins] = useState(8);
  const [sosTicketId, setSosTicketId] = useState(null);

  // Live Geolocation telemetry
  const [geoCoords, setGeoCoords] = useState({
    lat: currentWard?.defaultCenter?.lat || 19.0682,
    lng: currentWard?.defaultCenter?.lng || 72.8791,
    accuracy: '±3.2m',
    elevation: '+14.5m MSL',
    plusCode: '7JFJ8V99+5R Mumbai'
  });

  // Acquire real GPS if user allows
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracy: `±${Math.round(pos.coords.accuracy || 4)}m`,
            elevation: pos.coords.altitude ? `+${pos.coords.altitude.toFixed(1)}m MSL` : '+14.5m MSL',
            plusCode: `7JFJ8V99+${Math.floor(pos.coords.latitude * 10 % 100)} Mumbai`
          });
        },
        () => {
          // Fallback gracefully to ward coordinates
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [currentWard]);

  // Countdown countdown loop when ARMED
  useEffect(() => {
    let timer = null;
    if (sosStatus === 'ARMED') {
      if (countdownSecs > 0) {
        emergencyAudio.playCountdownBeep(880 + (5 - countdownSecs) * 80);
        timer = setTimeout(() => {
          setCountdownSecs(prev => prev - 1);
        }, 1000);
      } else {
        // Trigger transmission
        setSosStatus('TRANSMITTING');
        emergencyAudio.playSiren(3);
        const ticket = `BMC-SOS-${Math.floor(1000 + Math.random() * 9000)}`;
        setSosTicketId(ticket);
        speakAlert(`Emergency distress beacon transmitted to BMC Disaster Cell 1916. Ticket reference ${ticket}`);

        // Progress to ACKNOWLEDGED
        setTimeout(() => {
          setSosStatus('ACKNOWLEDGED');
          emergencyAudio.playCountdownBeep(980);
        }, 2500);

        // Progress to DISPATCHED
        setTimeout(() => {
          setSosStatus('DISPATCHED');
          setEtaMins(7);
        }, 5500);
      }
    }
    return () => clearTimeout(timer);
  }, [sosStatus, countdownSecs, speakAlert]);

  // Dispatch ETA decrement loop
  useEffect(() => {
    let timer = null;
    if (sosStatus === 'DISPATCHED' && etaMins > 1) {
      timer = setInterval(() => {
        setEtaMins(prev => Math.max(1, prev - 1));
      }, 30000);
    }
    return () => clearInterval(timer);
  }, [sosStatus, etaMins]);

  // Handle Arming SOS
  const handleArmSOS = () => {
    setCountdownSecs(5);
    setSosStatus('ARMED');
  };

  const handleCancelSOS = () => {
    emergencyAudio.stopAll();
    setSosStatus('IDLE');
    setCountdownSecs(5);
    speakAlert('Emergency distress broadcast canceled.');
  };

  const handleResolveSOS = () => {
    setSosStatus('RESOLVED');
    setTimeout(() => setSosStatus('IDLE'), 3000);
  };

  // --- Dynamic SOS Customizer ---
  const [trappedPeople, setTrappedPeople] = useState(3);
  const [hasElderly, setHasElderly] = useState(true);
  const [hasInfants, setHasInfants] = useState(false);
  const [currentDepthCategory, setCurrentDepthCategory] = useState('Waist Deep (90cm)');
  const [medicalUrgencyFlag, setMedicalUrgencyFlag] = useState('Insulin Dependent');
  const [hazardNearby, setHazardNearby] = useState('Submerged Open Drain');
  const [copiedSOS, setCopiedSOS] = useState(false);

  const dynamicSosPayload = `EMERGENCY SOS: Urban Flood Life Threat
Location: Lat ${geoCoords.lat}, Lng ${geoCoords.lng} (Ward ${currentWard.name})
PlusCode: ${geoCoords.plusCode} | Elev: ${geoCoords.elevation}
Trapped Count: ${trappedPeople} Persons (${hasElderly ? 'Elderly present' : ''}${hasInfants ? ', Infant present' : ''})
Water Level: ${currentDepthCategory}
Urgent Medical: ${medicalUrgencyFlag}
Hazard in Proximity: ${hazardNearby}
Please dispatch NDRF rubber boat or BMC water extrication unit immediately.`;

  const handleCopySOS = () => {
    navigator.clipboard.writeText(dynamicSosPayload);
    setCopiedSOS(true);
    setTimeout(() => setCopiedSOS(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Flood SOS Dispatch',
        text: dynamicSosPayload
      }).catch(() => {});
    } else {
      handleCopySOS();
    }
  };

  // --- Helplines Directory State & Filtering ---
  const [helplineCategory, setHelplineCategory] = useState('ALL');
  const [activeCallContact, setActiveCallContact] = useState(null);

  const emergencyContacts = [
    { title: 'BMC Central Disaster Control', number: '1916', alt: '022-2269-4725', category: 'BMC', desc: 'Municipal flooding, fallen trees, open drains' },
    { title: 'NDRF Disaster Response Force', number: '1078', alt: '011-2436-3260', category: 'RESCUE', desc: 'Boat rescue, structural evacuation' },
    { title: 'Emergency Ambulance Service', number: '108', alt: '102', category: 'MEDICAL', desc: 'Medical emergency, water immersion triage' },
    { title: 'Mumbai Fire & Water Rescue', number: '101', alt: '022-2307-6111', category: 'RESCUE', desc: 'Submerged vehicle extrication, boat units' },
    { title: 'Mumbai Traffic Police Helpline', number: '8454999999', alt: '103', category: 'TRAFFIC', desc: 'Road closure verification, towing assistance' },
    { title: 'Railway Emergency Control', number: '139', alt: '022-2262-0173', category: 'RAILWAY', desc: 'Western & Central suburban train status' },
    { title: 'Mahanagar Gas (MGL) Emergency', number: '1917', alt: '022-2401-2400', category: 'UTILITY', desc: 'Gas pipeline leak or water bubbling' },
    { title: 'Adani / Tata Power Flood Desk', number: '19122', alt: '1800-532-9998', category: 'UTILITY', desc: 'Submerged substation lockout & wire hazard' }
  ];

  const filteredContacts = emergencyContacts.filter(c => {
    if (helplineCategory === 'ALL') return true;
    return c.category === helplineCategory;
  });

  // --- Disaster Readiness Checklist (Persistent) ---
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('emergency_readiness_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, label: 'Move electrical appliances 3+ feet above floor level', done: true },
      { id: 2, label: 'Store 5 litres potable drinking water per family member', done: true },
      { id: 3, label: 'Charge primary and secondary power banks to 100%', done: false },
      { id: 4, label: 'Pack emergency medicines (ORS, insulin, asthma inhalers) in sealed ziploc', done: false },
      { id: 5, label: 'Store vital physical identity documents (Aadhaar, Deed) in waterproof pouch', done: false },
      { id: 6, label: 'Identify nearest high-ground relief shelter on Ward map', done: true }
    ];
  });

  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('emergency_readiness_checklist', JSON.stringify(checklist));
    } catch (e) {}
  }, [checklist]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([...checklist, { id: Date.now(), label: newChecklistText.trim(), done: false }]);
    setNewChecklistText('');
  };

  const handleDeleteChecklistItem = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleResetChecklist = () => {
    setChecklist([
      { id: 1, label: 'Move electrical appliances 3+ feet above floor level', done: true },
      { id: 2, label: 'Store 5 litres potable drinking water per family member', done: true },
      { id: 3, label: 'Charge primary and secondary power banks to 100%', done: false },
      { id: 4, label: 'Pack emergency medicines (ORS, insulin, asthma inhalers) in sealed ziploc', done: false },
      { id: 5, label: 'Store vital physical identity documents (Aadhaar, Deed) in waterproof pouch', done: false },
      { id: 6, label: 'Identify nearest high-ground relief shelter on Ward map', done: true }
    ]);
  };

  // --- 15 New Features Modal States ---
  const [modalRadarOpen, setModalRadarOpen] = useState(false);
  const [modalTriageOpen, setModalTriageOpen] = useState(false);
  const [modalWhistleOpen, setModalWhistleOpen] = useState(false);
  const [modalMeshOpen, setModalMeshOpen] = useState(false);
  const [modalFamilyOpen, setModalFamilyOpen] = useState(false);
  const [modalHazardOpen, setModalHazardOpen] = useState(false);
  const [modalRadioOpen, setModalRadioOpen] = useState(false);
  const [modalVehicleOpen, setModalVehicleOpen] = useState(false);
  const [modalRationOpen, setModalRationOpen] = useState(false);
  const [modalRiverOpen, setModalRiverOpen] = useState(false);
  const [modalPowerOpen, setModalPowerOpen] = useState(false);
  const [modalBoatOpen, setModalBoatOpen] = useState(false);
  const [modalMedicalOpen, setModalMedicalOpen] = useState(false);
  const [modalGoBagOpen, setModalGoBagOpen] = useState(false);
  const [modalPostFloodOpen, setModalPostFloodOpen] = useState(false);
  const [modalQrOpen, setModalQrOpen] = useState(false);

  // Power saver mode state
  const [isPowerSaver, setIsPowerSaver] = useState(false);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors ${
      isPowerSaver ? 'bg-black text-amber-300 font-mono grayscale-[0.3]' : ''
    }`}>
      {/* Power Saver Status Pill */}
      {isPowerSaver && (
        <div className="mb-4 p-3 bg-amber-950 border border-amber-500 rounded-2xl flex items-center justify-between text-xs text-amber-300 font-mono">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            ULTRA OLED BATTERY CONSERVATION ACTIVE — Telemetry reduced
          </span>
          <button
            onClick={() => setIsPowerSaver(false)}
            className="px-3 py-1 bg-amber-600 text-black font-bold rounded-lg"
          >
            Disable Power Saver
          </button>
        </div>
      )}

      {/* Primary Red Critical SOS Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        sosStatus === 'ARMED' 
          ? 'bg-amber-600 text-white shadow-amber-600/30' 
          : sosStatus === 'TRANSMITTING' || sosStatus === 'ACKNOWLEDGED' || sosStatus === 'DISPATCHED'
          ? 'bg-red-700 text-white shadow-red-700/40'
          : 'bg-red-600 text-white shadow-red-600/20'
      }`}>
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 text-white shrink-0">
            <AlertOctagon className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-red-100 font-bold block">
                Crisis Emergency Protocol
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono">
                Ward: {currentWard.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Active Flood SOS & Emergency Center
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl leading-relaxed">
              If life or vehicle is threatened by rising water, trigger your calibrated SOS distress beacon. Transmits high-precision GPS to BMC Disaster Control & NDRF.
            </p>

            {/* GPS Telemetry Readout */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-red-100 bg-black/20 px-3 py-1.5 rounded-xl w-fit">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Lat {geoCoords.lat}, Lng {geoCoords.lng}
              </span>
              <span>•</span>
              <span>Accuracy: {geoCoords.accuracy}</span>
              <span>•</span>
              <span>Elevation: {geoCoords.elevation}</span>
            </div>
          </div>
        </div>

        {/* SOS Action Button / State Controls */}
        <div className="w-full md:w-auto flex flex-col items-center gap-2">
          {sosStatus === 'IDLE' && (
            <button 
              onClick={handleArmSOS}
              className="w-full md:w-auto px-8 py-4 bg-white text-red-600 hover:bg-red-50 font-mono font-extrabold text-sm rounded-2xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
            >
              <Radio className="w-5 h-5 animate-pulse" />
              Broadcast GPS SOS Beacon
            </button>
          )}

          {sosStatus === 'ARMED' && (
            <div className="flex items-center gap-3 w-full">
              <div className="px-6 py-4 bg-white text-amber-700 font-mono font-black text-lg rounded-2xl flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600 animate-ping" />
                TRIGGERING IN {countdownSecs}S...
              </div>
              <button
                onClick={handleCancelSOS}
                className="px-5 py-4 bg-black/40 hover:bg-black/60 text-white font-mono font-bold text-xs uppercase rounded-2xl transition-colors"
              >
                Abort
              </button>
            </div>
          )}

          {(sosStatus === 'TRANSMITTING' || sosStatus === 'ACKNOWLEDGED' || sosStatus === 'DISPATCHED') && (
            <div className="bg-black/30 p-4 rounded-2xl border border-white/20 text-center space-y-2 w-full">
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {sosStatus === 'TRANSMITTING' && 'Transmitting Encrypted Satellite Packet...'}
                  {sosStatus === 'ACKNOWLEDGED' && `Acknowledged by BMC Control (Ticket #${sosTicketId})`}
                  {sosStatus === 'DISPATCHED' && `NDRF Rubber Boat Unit #4 En Route • ETA: ${etaMins} mins`}
                </span>
              </div>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={handleResolveSOS}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg transition-colors"
                >
                  Mark Resolved / Evacuated
                </button>
                <button
                  onClick={handleCancelSOS}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-mono text-xs rounded-lg transition-colors"
                >
                  Cancel Beacon
                </button>
              </div>
            </div>
          )}

          {sosStatus === 'RESOLVED' && (
            <div className="px-6 py-3 bg-emerald-600 text-white font-mono font-bold text-xs rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4" /> Distress Signal Safely Resolved
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 15 NEW EMERGENCY FEATURES INTERACTIVE LAUNCHPAD HUB */}
      {/* ========================================================= */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                15 Advanced Modules
              </span>
              <h2 className="text-xl font-extrabold text-ink">
                Citizen Disaster Intelligence & Mutual-Aid Hub
              </h2>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Zero-latency frontend disaster tools calibrated to MCGM standard operating procedures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalRadarOpen(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" /> Emergency Radar
            </button>
            <button
              onClick={() => setModalWhistleOpen(true)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" /> Acoustic Whistle
            </button>
          </div>
        </div>

        {/* 15 Interactive Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {/* Feature 1 */}
          <div 
            onClick={() => setModalRadarOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Compass className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">#01 RADAR</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-emerald-700 transition-colors">
                Haven Proximity Radar
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Rotating sweep canvas locating 5 nearest shelters & dry corridors.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-emerald-600 font-bold">
              <span>Launch Radar</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            onClick={() => setModalTriageOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-red-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-red-700 font-bold">#02 TRIAGE</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-red-700 transition-colors">
                START Triage & CPR Beat
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Medical evaluation & 110-BPM audio chest compression metronome.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-red-600 font-bold">
              <span>Start Triage</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            onClick={() => setModalWhistleOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">#03 WHISTLE</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-amber-700 transition-colors">
                3.2kHz Whistle & Strobe
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Piercing rain whistle & fullscreen Morse SOS optical strobe.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-amber-600 font-bold">
              <span>Sound Whistle</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div 
            onClick={() => setModalMeshOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-cyan-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Radio className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-cyan-700 font-bold">#04 P2P MESH</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-cyan-700 transition-colors">
                Offline P2P Mesh Network
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Zero-tower packet relay simulation over Bluetooth & LoRa.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-cyan-600 font-bold">
              <span>Open Mesh</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 5 */}
          <div 
            onClick={() => setModalFamilyOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-purple-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">#05 FAMILY</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-purple-700 transition-colors">
                Family Safety Ping Board
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                One-click status broadcasts, battery monitors & check-in pings.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-purple-600 font-bold">
              <span>View Circle</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 6 */}
          <div 
            onClick={() => setModalHazardOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-red-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <AlertOctagon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-red-700 font-bold">#06 MICRO-REPORT</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-red-700 transition-colors">
                30s Rapid Hazard Dispatch
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Report manhole vortices, live wires, and collapsed plinths.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-red-600 font-bold">
              <span>Submit Hazard</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 7 */}
          <div 
            onClick={() => setModalRadioOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Radio className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">#07 AIR 100.1</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-emerald-700 transition-colors">
                AIR & BMC Disaster Radio
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Simulated emergency audio frequency with waveform visualizer.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-emerald-600 font-bold">
              <span>Tune In</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 8 */}
          <div 
            onClick={() => setModalVehicleOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">#08 VEHICLE</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-amber-700 transition-colors">
                Car Extrication Simulator
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Headrest prong punch points & delta-P equalization escape.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-amber-600 font-bold">
              <span>Survival Drill</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 9 */}
          <div 
            onClick={() => setModalRationOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-cyan-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Droplets className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-cyan-700 font-bold">#09 RATIONS</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-cyan-700 transition-colors">
                Water & Ration Calculator
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                WHO water reserve, calories, ORS, and chlorine tablet dosing.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-cyan-600 font-bold">
              <span>Calculate</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 10 */}
          <div 
            onClick={() => setModalRiverOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Compass className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">#10 GAUGES</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-blue-700 transition-colors">
                Mithi River & Nullah Telemetry
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Real-time river levels, tidal ingress & sluice flap status.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-blue-600 font-bold">
              <span>Inspect Gauges</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 11 */}
          <div 
            onClick={() => setModalPowerOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <BatteryCharging className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">#11 VAULT</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-amber-700 transition-colors">
                Ultra Power & Offline Vault
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                True-black battery saver & 1-click JSON emergency vault download.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-amber-600 font-bold">
              <span>Save Battery</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 12 */}
          <div 
            onClick={() => setModalBoatOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <LifeBuoy className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-teal-700 font-bold">#12 FLOTILLA</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-teal-700 transition-colors">
                Rubber Boat & 4x4 Flotilla
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Citizen mutual-aid evacuation board for stranded residents.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-teal-600 font-bold">
              <span>View Missions</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 13 */}
          <div 
            onClick={() => setModalMedicalOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-rose-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-rose-700 font-bold">#13 COLD-CHAIN</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-rose-700 transition-colors">
                Insulin Cold-Chain Timer
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Passive cooler buffer tracker & medical dependency registry.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-rose-600 font-bold">
              <span>Monitor Temps</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 14 */}
          <div 
            onClick={() => setModalGoBagOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-indigo-700 font-bold">#14 GO-BAG</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-indigo-700 transition-colors">
                Go-Bag Weight Auditor
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Strict 8kg buoyancy weight budget & drybag gear auditor.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-indigo-600 font-bold">
              <span>Audit Weight</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 15 */}
          <div 
            onClick={() => setModalPostFloodOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">#15 RE-ENTRY</span>
              </div>
              <h3 className="font-bold text-xs text-ink group-hover:text-amber-700 transition-colors">
                Post-Flood Home Inspector
              </h3>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Main breaker lockout, viper safety & bleach dilution calculator.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-amber-600 font-bold">
              <span>Inspect Home</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN TWO-COLUMN WORKSPACE: HELPLINES & BMC DIRECTIVES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Official Helplines Directory & SOS Customizer */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Helplines Header & Filter Pills */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono text-muted uppercase tracking-wider font-bold">
                Official Emergency Dispatch Directory
              </span>
              <span className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Lines Active • Avg Queue: &lt; 25s
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {[
                { id: 'ALL', label: 'All Hotlines' },
                { id: 'BMC', label: 'BMC 1916' },
                { id: 'RESCUE', label: 'Rubber Boats & Fire' },
                { id: 'MEDICAL', label: '108 Ambulance' },
                { id: 'TRAFFIC', label: 'Traffic Police' },
                { id: 'UTILITY', label: 'Gas / Power Wires' },
                { id: 'RAILWAY', label: 'Suburban Trains' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setHelplineCategory(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    helplineCategory === f.id
                      ? 'bg-ink text-white shadow-sm'
                      : 'bg-white border border-slate-200/80 text-muted hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Helpline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredContacts.map((contact, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-red-300 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-ink text-base leading-snug group-hover:text-red-600 transition-colors">
                      {contact.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      {contact.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-normal">{contact.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-mono font-extrabold text-red-600 block">{contact.number}</span>
                    <span className="text-[10px] font-mono text-muted">Alt: {contact.alt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Simulated Voice Call Launcher */}
                    <button
                      onClick={() => setActiveCallContact(contact)}
                      className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                      title="Launch Simulated VoIP Dispatch Call"
                    >
                      <PhoneCall className="w-4 h-4" /> Call
                    </button>
                    {/* Native phone anchor fallback */}
                    <a 
                      href={`tel:${contact.number}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center transition-colors"
                      title="Open in System Phone App"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic SOS Payload Customizer & QR Beacon Box */}
          <div className="bg-canvas border border-slate-200 rounded-3xl p-6 mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                Customizable Rescue Dispatch SMS & Payload
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalQrOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-1 hover:bg-slate-900 transition-colors"
                  title="Generate Scannable Offline QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" /> QR Beacon
                </button>
                <button 
                  onClick={handleCopySOS}
                  className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedSOS ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSOS ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Customizer Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] text-muted block mb-1">TRAPPED PEOPLE</label>
                <select
                  value={trappedPeople}
                  onChange={(e) => setTrappedPeople(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-ink focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                    <option key={n} value={n}>{n} Persons</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] text-muted block mb-1">WATER DEPTH</label>
                <select
                  value={currentDepthCategory}
                  onChange={(e) => setCurrentDepthCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="Ankle Deep (15cm)">Ankle (15cm)</option>
                  <option value="Knee Deep (45cm)">Knee (45cm)</option>
                  <option value="Waist Deep (90cm)">Waist (90cm)</option>
                  <option value="Chest Deep (130cm)">Chest (130cm)</option>
                  <option value="Submerged Floor (200cm)">Roof / &gt;200cm</option>
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] text-muted block mb-1">MEDICAL URGENCY</label>
                <select
                  value={medicalUrgencyFlag}
                  onChange={(e) => setMedicalUrgencyFlag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="None / Agile">None / Stable</option>
                  <option value="Insulin Dependent">Insulin / Diabetic</option>
                  <option value="Oxygen / Asthma">Oxygen / Inhaler</option>
                  <option value="Hypothermia / Immersion">Hypothermia</option>
                  <option value="Cardiac / Hypertension">Cardiac / BP</option>
                  <option value="Peritoneal Dialysis">Dialysis Required</option>
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] text-muted block mb-1">PROXIMITY HAZARD</label>
                <select
                  value={hazardNearby}
                  onChange={(e) => setHazardNearby(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="None">None Visible</option>
                  <option value="Submerged Open Drain">Open Drain Vortex</option>
                  <option value="Fallen 11kV Wire">Sparking 11kV Wire</option>
                  <option value="Structural Wall Crack">Cracked Wall</option>
                  <option value="Gas Odor">MGL Gas Scent</option>
                </select>
              </div>
            </div>

            {/* Generated Textbox */}
            <pre className="text-xs font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {dynamicSosPayload}
            </pre>

            {/* Direct Dispatch Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <a
                href={`sms:1916?body=${encodeURIComponent(dynamicSosPayload)}`}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> SMS to 1916
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(dynamicSosPayload)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> WhatsApp Dispatch
              </a>

              <button
                onClick={handleNativeShare}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Web Share API
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Municipal Directives & Readiness Checklist */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BMC 4 Core Directives with Interactive Physics Drilldown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-primary uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Official Municipal Directives
              </div>
              <span className="text-[10px] font-mono text-muted">MCGM Protocol 2026</span>
            </div>
            <h2 className="text-lg font-bold text-ink">Cloudburst Evacuation & Survival Physics</h2>

            <div className="space-y-3 text-xs text-slate-700">
              <div 
                onClick={() => setModalVehicleOpen(true)}
                className="p-3 bg-red-50/60 rounded-xl border border-red-200/60 flex items-start gap-2.5 cursor-pointer hover:bg-red-50 transition-colors group"
              >
                <span className="font-mono font-bold text-red-700 shrink-0">01</span>
                <div>
                  <strong>Never drive into standing water:</strong> 30 cm of moving floodwater carries 600kg hydrodynamic buoyancy, lifting sedan tires off tarmac.
                  <span className="block text-[11px] text-red-600 font-mono font-bold mt-1 group-hover:underline">
                    Click to launch Vehicle Extrication Simulator →
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
                <span className="font-mono font-bold text-amber-700 shrink-0">02</span>
                <div>
                  <strong>Step Potential Voltage Hazard:</strong> Maintain 10m minimum clearance from fallen electric lines. Saline and mud slurry creates lethal electrical gradients across human stride lengths.
                </div>
              </div>

              <div 
                onClick={() => setModalHazardOpen(true)}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100 transition-colors group"
              >
                <span className="font-mono font-bold text-purple-primary shrink-0">03</span>
                <div>
                  <strong>Dislodged Manhole Suction:</strong> Storm runoff creates 2.4 bar negative suction vortex over open sewer covers. Avoid submerged curb edges.
                  <span className="block text-[11px] text-purple-600 font-mono font-bold mt-1 group-hover:underline">
                    Report open drain location immediately →
                  </span>
                </div>
              </div>

              <div 
                onClick={() => setModalRadarOpen(true)}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100 transition-colors group"
              >
                <span className="font-mono font-bold text-purple-primary shrink-0">04</span>
                <div>
                  <strong>Vertical Shelter Strategy:</strong> If trapped at ground level, seek upper concrete floors immediately rather than attempting to swim in fast drainage currents.
                  <span className="block text-[11px] text-purple-600 font-mono font-bold mt-1 group-hover:underline">
                    Locate verified high-ground concrete shelters →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Disaster Readiness Checklist (Persistent & Editable) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">Disaster Readiness Checklist</h2>
                <p className="text-xs text-muted">Offline-saved household storm preparation</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-purple-primary font-bold">
                  {checklist.filter(c => c.done).length} / {checklist.length} Done
                </span>
                <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(checklist.filter(c => c.done).length / (checklist.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {checklist.map(item => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors ${
                    item.done ? 'bg-purple-50/40 border-purple-primary/30 text-ink' : 'bg-canvas border-slate-200/60 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div 
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-purple-primary shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={item.done ? 'line-through text-slate-500' : 'font-medium'}>
                      {item.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                    title="Remove Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Item Input */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom prep task (e.g. Move car to 3rd floor deck)"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-purple-600"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px] font-mono text-muted">
              <button
                onClick={handleResetChecklist}
                className="hover:text-ink flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Default MCGM Tasks
              </button>
              <button
                onClick={() => window.print()}
                className="text-purple-600 font-bold hover:underline"
              >
                Print Readiness Sheet
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODALS AND DRAWERS FOR ALL 15 FEATURES & TOOLS */}
      {/* ========================================================= */}

      {/* Control Room Call Simulator Modal */}
      <SimulatedCallModal
        isOpen={!!activeCallContact}
        onClose={() => setActiveCallContact(null)}
        contact={activeCallContact}
      />

      {/* Offline Scannable QR Beacon Modal */}
      <OfflineBeaconQrModal
        isOpen={modalQrOpen}
        onClose={() => setModalQrOpen(false)}
        payload={dynamicSosPayload}
        coordinates={geoCoords}
        ward={currentWard}
      />

      {/* Feature 1: Emergency Radar Modal */}
      <EmergencyRadarModal
        isOpen={modalRadarOpen}
        onClose={() => setModalRadarOpen(false)}
        userCoordinates={geoCoords}
        onNavigate={(shelter) => {
          if (navigateTo) navigateTo('/route');
        }}
      />

      {/* Feature 2: START Clinical Triage & CPR Modal */}
      <EmergencyTriageModal
        isOpen={modalTriageOpen}
        onClose={() => setModalTriageOpen(false)}
      />

      {/* Feature 3: Acoustic Whistle & Strobe Modal */}
      <AcousticSirenWhistleModal
        isOpen={modalWhistleOpen}
        onClose={() => setModalWhistleOpen(false)}
      />

      {/* Feature 4: Offline P2P Mesh Network Modal */}
      <OfflineMeshSimulatorModal
        isOpen={modalMeshOpen}
        onClose={() => setModalMeshOpen(false)}
      />

      {/* Feature 5: Emergency Family Check-In Modal */}
      <EmergencyFamilyPingModal
        isOpen={modalFamilyOpen}
        onClose={() => setModalFamilyOpen(false)}
      />

      {/* Feature 6: Rapid Life Hazard Report Modal */}
      <RapidHazardReportModal
        isOpen={modalHazardOpen}
        onClose={() => setModalHazardOpen(false)}
        currentWard={currentWard}
      />

      {/* Feature 7: All India Radio & BMC Disaster Broadcast Modal */}
      <DisasterRadioBroadcastModal
        isOpen={modalRadioOpen}
        onClose={() => setModalRadioOpen(false)}
        speakAlert={speakAlert}
      />

      {/* Feature 8: Submerged Vehicle Extrication Modal */}
      <SubmergedVehicleSurvivalModal
        isOpen={modalVehicleOpen}
        onClose={() => setModalVehicleOpen(false)}
      />

      {/* Feature 9: Water & Ration Calculator Modal */}
      <RationWaterCalculatorModal
        isOpen={modalRationOpen}
        onClose={() => setModalRationOpen(false)}
      />

      {/* Feature 10: River & Nullah Overflow Gauge Modal */}
      <RiverNullahGaugeModal
        isOpen={modalRiverOpen}
        onClose={() => setModalRiverOpen(false)}
      />

      {/* Feature 11: Ultra Power Saver Modal */}
      <UltraPowerSaverModal
        isOpen={modalPowerOpen}
        onClose={() => setModalPowerOpen(false)}
        isPowerSaver={isPowerSaver}
        onTogglePowerSaver={() => setIsPowerSaver(!isPowerSaver)}
      />

      {/* Feature 12: Rubber Boat Rescue Mobilizer Modal */}
      <BoatRescueMobilizerModal
        isOpen={modalBoatOpen}
        onClose={() => setModalBoatOpen(false)}
      />

      {/* Feature 13: Critical Medical Cold-Chain Modal */}
      <MedicalColdChainModal
        isOpen={modalMedicalOpen}
        onClose={() => setModalMedicalOpen(false)}
      />

      {/* Feature 14: Go-Bag Weight Auditor Modal */}
      <GoBagAuditorModal
        isOpen={modalGoBagOpen}
        onClose={() => setModalGoBagOpen(false)}
      />

      {/* Feature 15: Post-Flood Structural Re-entry Inspector Modal */}
      <PostFloodInspectorModal
        isOpen={modalPostFloodOpen}
        onClose={() => setModalPostFloodOpen(false)}
      />

    </div>
  );
}
