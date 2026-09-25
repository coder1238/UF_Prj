import React, { useState, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Users, ShieldCheck, AlertTriangle, Heart, Phone, 
  Send, Plus, CheckCircle2, MapPin, Clock, Lock, Sparkles,
  Radio, AlertOctagon, Share2, Compass, QrCode, FileText,
  Sliders, Activity, Battery, BatteryCharging, BatteryWarning,
  Navigation, Car, ShieldAlert, CheckSquare, Trash2, Edit3,
  PhoneCall, Eye, RefreshCw, Volume2, Shield, LifeBuoy,
  ChevronRight, Layers, Bell, Check
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';
import FamilyRadarView from '../family/FamilyRadarView';
import AddEditMemberModal from '../family/AddEditMemberModal';
import {
  FamilySOSBroadcastModal,
  FamilyIntercomCallModal,
  FamilyRendezvousModal,
  FamilyGeofenceModal,
  FamilyEscalationModal,
  ZeroTrackPrivacyModal,
  GoBagSuppliesModal,
  MedicalRegistryModal,
  VehicleSafetyModal,
  PetSafetyModal,
  OfflineSmsMeshModal,
  CircleInviteModal,
  ProximitySensorsModal,
  DocumentVaultModal,
  EvacuationDrillModal,
  FamilyCheckInTimelineModal,
  SafeCorridorModal,
  BatteryBeaconModal
} from '../family/FamilyModals';

export default function FamilySafety() {
  const { currentWard, speakAlert } = useFlood();
  const { navigateTo } = useNavigation();

  // Primary Family Members State with LocalStorage Persistence
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('family_members_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'fam-1',
        name: 'Ananya Sharma',
        relation: 'Spouse',
        locationFuzzy: 'BKC Financial Center (Elevated Zone)',
        ward: 'H-East',
        status: 'safe',
        lastCheckIn: '6 mins ago',
        localWaterDepth: 2,
        batteryLevel: '88%',
        phone: '+91 98201 44521',
        mobility: 'Walking / Agile',
        medicalFlag: 'None',
        safetyStatusText: 'Confirmed Safe at Office — Elevated corridor clear'
      },
      {
        id: 'fam-2',
        name: 'Ramesh Sharma',
        relation: 'Father',
        locationFuzzy: 'Dadar West (Near Portuguese Church)',
        ward: 'G-North',
        status: 'caution',
        lastCheckIn: '14 mins ago',
        localWaterDepth: 18,
        batteryLevel: '64%',
        phone: '+91 98203 11980',
        mobility: 'Elderly / Slow Pace',
        medicalFlag: 'Hypertension',
        safetyStatusText: 'Minor Street Ponding (18 cm) — Advised to remain indoors'
      },
      {
        id: 'fam-3',
        name: 'Aarav Sharma',
        relation: 'Son',
        locationFuzzy: 'Don Bosco High School (Matunga)',
        ward: 'F-North',
        status: 'danger',
        lastCheckIn: '2 mins ago',
        localWaterDepth: 34,
        batteryLevel: '42%',
        phone: '+91 98204 77610',
        mobility: 'Walking / Agile',
        medicalFlag: 'Asthma / Inhaler',
        safetyStatusText: 'High Basin Ponding — School holding students on 1st Floor'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('family_members_list_v2', JSON.stringify(members));
    } catch (e) {}
  }, [members]);

  // Designated Rendezvous Haven
  const [rendezvousPoint, setRendezvousPoint] = useState(SAFE_PLACES_DATA[1] || {
    id: 'sp-2',
    name: 'Don Bosco High School Hall',
    elevation: '+14.2m MSL',
    address: 'Matunga West',
    availableCapacity: 320,
    totalCapacity: 500
  });

  // Selected Member for radar inspection
  const [selectedMemberId, setSelectedMemberId] = useState('fam-3');

  // Privacy Mode ('1km' | '500m' | 'exact' | 'ghost')
  const [privacyMode, setPrivacyMode] = useState('1km');

  // Activity Log
  const [activityEvents, setActivityEvents] = useState([
    { title: 'Check-In Acknowledged', time: '2 mins ago', desc: 'Aarav confirmed safe on 1st floor at Don Bosco School.' },
    { title: 'Water Level Alert', time: '12 mins ago', desc: 'Basin telemetry near Matunga exceeded 30cm depth threshold.' },
    { title: 'Circle Synced', time: '25 mins ago', desc: 'All 3 members synchronized via encrypted municipal mesh.' }
  ]);

  // Interactive Ping State
  const [pingSentMemberId, setPingSentMemberId] = useState(null);
  const [selfSafeActive, setSelfSafeActive] = useState(false);

  // Active filter tab ('all' | 'danger' | 'caution' | 'safe')
  const [filterTab, setFilterTab] = useState('all');

  // Modals States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isIntercomOpen, setIsIntercomOpen] = useState(false);
  const [activeCallMember, setActiveCallMember] = useState(null);
  const [isRendezvousOpen, setIsRendezvousOpen] = useState(false);
  const [isGeofenceOpen, setIsGeofenceOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isGoBagOpen, setIsGoBagOpen] = useState(false);
  const [isMedicalOpen, setIsMedicalOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isPetOpen, setIsPetOpen] = useState(false);
  const [isOfflineSmsOpen, setIsOfflineSmsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSensorsOpen, setIsSensorsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isCorridorOpen, setIsCorridorOpen] = useState(false);
  const [isBatteryBeaconOpen, setIsBatteryBeaconOpen] = useState(false);

  // 1. Send Ping with realistic simulated reply from member
  const handleSendPing = (id, name) => {
    setPingSentMemberId(id);
    speakAlert(`Safety ping sent to ${name}.`);

    // Add ping to timeline
    setActivityEvents(prev => [
      { title: `Ping Dispatched to ${name}`, time: 'Just now', desc: 'Manual status inquiry sent over GSM & Push network.' },
      ...prev
    ]);

    setTimeout(() => {
      setPingSentMemberId(null);
      // Simulate automatic response from that family member
      const responses = [
        "Status received! Water has stopped rising. Staying sheltered on 2nd floor.",
        "Acknowledged. Phone battery at stable level. Power inverter active.",
        "All clear here. Municipal pumps are actively operating in the street."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setActivityEvents(prev => [
        { title: `${name} Checked In`, time: 'Just now', desc: reply },
        ...prev
      ]);
      speakAlert(`${name} replied: ${reply}`);
    }, 2500);
  };

  // 2. Open Walkie-Talkie Intercom
  const handleOpenIntercom = (member) => {
    setActiveCallMember(member);
    setIsIntercomOpen(true);
    speakAlert(`Connecting intercom voice channel to ${member.name}.`);
  };

  // 3. Quick Status Toggle for any member
  const handleStatusChange = (id, newStatus) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          status: newStatus,
          lastCheckIn: 'Just now'
        };
      }
      return m;
    }));
    const target = members.find(m => m.id === id);
    speakAlert(`${target?.name || 'Member'} status marked as ${newStatus}.`);
  };

  // 4. Delete member
  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the Family Safety Circle?`)) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setActivityEvents(prev => [
        { title: 'Member Removed', time: 'Just now', desc: `${name} was removed from the family circle.` },
        ...prev
      ]);
      speakAlert(`${name} removed from circle.`);
    }
  };

  // 5. Save Member (Add or Edit)
  const handleSaveMember = (memberData) => {
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === memberData.id ? memberData : m));
      speakAlert(`${memberData.name}'s safety profile updated.`);
    } else {
      setMembers(prev => [...prev, memberData]);
      speakAlert(`${memberData.name} added to Family Safety Circle.`);
    }
    setEditingMember(null);
  };

  // 6. 1-Click "I am Safe" Quick Action for User
  const handleSelfSafeBroadcast = () => {
    setSelfSafeActive(true);
    speakAlert('Status updated. You are broadcasted as Safe on High Ground to all family circle members.');
    setActivityEvents(prev => [
      { title: 'You Checked In as SAFE', time: 'Just now', desc: 'Broadcasted to entire family circle via push and SMS gateway.' },
      ...prev
    ]);
    setTimeout(() => setSelfSafeActive(false), 3000);
  };

  // Status visual styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'SAFE ON HIGH GROUND'
        };
      case 'caution':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'WATER IN VICINITY'
        };
      case 'danger':
      default:
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: 'HIGH BASIN RISK'
        };
    }
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    if (filterTab === 'danger') return m.status === 'danger';
    if (filterTab === 'caution') return m.status === 'caution';
    if (filterTab === 'safe') return m.status === 'safe';
    if (filterTab === 'pets') return m.relation.toLowerCase().includes('pet');
    return true;
  });

  const highRiskCount = members.filter(m => m.status === 'danger').length;
  const cautionCount = members.filter(m => m.status === 'caution').length;
  const safeCount = members.filter(m => m.status === 'safe').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 text-purple-primary fill-purple-primary/20" /> 
            Privacy-First Family Protection Circle
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight flex items-center gap-3">
            Family Safety Circle & Geofence Radar
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-soft text-purple-deep border border-purple-200 font-bold">
              {members.length} Members Monitored
            </span>
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Real-time automated status telemetry for loved ones with privacy-safe 1km micro-basin bubbles and autonomous flood escalations.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1-Click "I am Safe" broadcast */}
          <button
            onClick={handleSelfSafeBroadcast}
            disabled={selfSafeActive}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
              selfSafeActive 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {selfSafeActive ? 'Broadcasted Safe!' : 'I Am Safe (1-Click)'}
          </button>

          {/* Mass Circle SOS */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" /> Circle SOS Panic
          </button>

          {/* Add Member */}
          <button
            onClick={() => {
              setEditingMember(null);
              setIsAddEditOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>

          {/* Zero-Track Privacy Mode Pill */}
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-2xl text-left transition-colors"
          >
            <Lock className="w-4 h-4 text-purple-primary shrink-0" />
            <div className="text-[11px]">
              <span className="font-bold text-ink block leading-none">Privacy: {privacyMode.toUpperCase()}</span>
              <span className="text-[10px] text-muted">Click to Tune Blur</span>
            </div>
          </button>
        </div>
      </div>

      {/* Feature Navigation / Action Hub Bar (20 Detailed Features Quick Grid) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-purple-primary" /> Family Protection Command Center & Tools
          </div>
          <span className="text-[11px] font-mono text-muted">20 Fully Workable Modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          <button
            onClick={() => setIsRendezvousOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Safe Haven</span>
            <span className="text-[10px] text-muted block truncate">{rendezvousPoint.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => setIsGeofenceOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <MapPin className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Geofenced Zones</span>
            <span className="text-[10px] text-red-600 font-bold block truncate">1 Breach Alert</span>
          </button>

          <button
            onClick={() => setIsEscalationOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Sliders className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Escalation Rules</span>
            <span className="text-[10px] text-muted block truncate">&gt;30cm / 15m Dwell</span>
          </button>

          <button
            onClick={() => setIsGoBagOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <CheckSquare className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">48h Go-Bag</span>
            <span className="text-[10px] text-emerald-700 font-bold block truncate">85% Prepared</span>
          </button>

          <button
            onClick={() => setIsMedicalOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Heart className="w-4 h-4 text-red-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Medical Triage</span>
            <span className="text-[10px] text-muted block truncate">Asthma / ORS</span>
          </button>

          <button
            onClick={() => setIsVehicleOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Car className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Vehicle Guard</span>
            <span className="text-[10px] text-red-600 font-bold block truncate">1 at Risk (B-1)</span>
          </button>

          <button
            onClick={() => setIsPetOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Heart className="w-4 h-4 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Pet Evacuation</span>
            <span className="text-[10px] text-muted block truncate">Leash & Food OK</span>
          </button>

          <button
            onClick={() => setIsOfflineSmsOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Radio className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Offline SMS Mesh</span>
            <span className="text-[10px] text-muted block truncate">142 Chars Ready</span>
          </button>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <QrCode className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">QR Circle Pass</span>
            <span className="text-[10px] text-muted block truncate">Invite Family</span>
          </button>

          <button
            onClick={() => setIsSensorsOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Activity className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">River Sensors</span>
            <span className="text-[10px] text-muted block truncate">Mithi / Hindmata</span>
          </button>

          <button
            onClick={() => setIsDocsOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <FileText className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">Document Vault</span>
            <span className="text-[10px] text-muted block truncate">Aadhaar & Deeds</span>
          </button>

          <button
            onClick={() => setIsDrillOpen(true)}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition-all group"
          >
            <Clock className="w-4 h-4 text-purple-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-ink block truncate">15m Evac Drill</span>
            <span className="text-[10px] text-purple-primary font-bold block truncate">Start Stopwatch</span>
          </button>
        </div>
      </div>

      {/* Feature 1: Interactive Family Basin Micro-Radar Canvas */}
      <FamilyRadarView 
        members={members}
        rendezvousPoint={rendezvousPoint}
        selectedMemberId={selectedMemberId}
        onSelectMember={(id) => setSelectedMemberId(id)}
        privacyMode={privacyMode}
      />

      {/* Circle Status Summary & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all' 
                ? 'bg-purple-primary text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Members ({members.length})
          </button>
          <button
            onClick={() => setFilterTab('danger')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'danger' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            High Danger ({highRiskCount})
          </button>
          <button
            onClick={() => setFilterTab('caution')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'caution' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Water Nearby ({cautionCount})
          </button>
          <button
            onClick={() => setFilterTab('safe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'safe' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Safe ({safeCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsTimelineOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
          >
            <Clock className="w-3.5 h-3.5 text-purple-primary" /> View Check-In Timeline
          </button>
          <button
            onClick={() => setIsCorridorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
          >
            <Navigation className="w-3.5 h-3.5 text-purple-primary" /> Safe Extraction Path
          </button>
        </div>
      </div>

      {/* Circle Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMembers.map(member => {
          const statusStyle = getStatusColor(member.status);
          const isPinged = pingSentMemberId === member.id;
          const isSelected = selectedMemberId === member.id;

          return (
            <div 
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between cursor-pointer relative ${
                isSelected ? 'ring-2 ring-purple-primary shadow-md' : ''
              } ${
                member.status === 'danger' 
                  ? 'border-red-300 ring-1 ring-red-100 hover:border-red-400' 
                  : member.status === 'caution'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200/80 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Member Top Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      member.status === 'danger' ? 'bg-red-100 text-red-700' : 'bg-purple-soft/70 text-purple-deep'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-ink text-base leading-snug flex items-center gap-2">
                        {member.name}
                        {isSelected && <span className="w-2 h-2 rounded-full bg-purple-primary" title="Selected on Radar" />}
                      </h3>
                      <span className="text-xs text-muted font-mono">{member.relation} • Ward {member.ward}</span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border uppercase ${statusStyle.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
                    {statusStyle.label}
                  </span>
                </div>

                {/* Status Switcher Toolbar */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 p-1 rounded-xl mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2">Set Status:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(member.id, 'safe'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        member.status === 'safe' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Safe
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(member.id, 'caution'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        member.status === 'caution' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Caution
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(member.id, 'danger'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        member.status === 'danger' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Danger
                    </button>
                  </div>
                </div>

                {/* Vicinity Water Depth, Battery, Mobility */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs font-mono">
                  <div className="bg-canvas p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-muted block uppercase">Water Depth</span>
                    <span className={`text-sm font-extrabold ${member.localWaterDepth > 20 ? 'text-red-600' : 'text-ink'}`}>
                      {member.localWaterDepth} cm
                    </span>
                  </div>
                  <div className="bg-canvas p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-muted block uppercase">Battery</span>
                    <span className="text-sm font-extrabold text-slate-700">{member.batteryLevel}</span>
                  </div>
                  <div className="bg-canvas p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-muted block uppercase">Mobility</span>
                    <span className="text-[11px] font-bold text-slate-700 truncate block">{member.mobility?.split('/')[0] || 'Walking'}</span>
                  </div>
                </div>

                {/* Location Bubble */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-xs mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-ink">
                      <MapPin className="w-3.5 h-3.5 text-purple-primary" />
                      <span className="truncate">{member.locationFuzzy}</span>
                    </div>
                    <span className="text-[9px] font-mono text-purple-primary bg-purple-100 px-1.5 py-0.5 rounded">
                      {privacyMode.toUpperCase()} BLUR
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {member.safetyStatusText || 'Sheltered safe.'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted mt-2 pt-2 border-t border-slate-200/50">
                    <span>Check-in: {member.lastCheckIn}</span>
                    {member.medicalFlag && member.medicalFlag !== 'None' && (
                      <span className="text-red-600 font-bold">{member.medicalFlag}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Push-to-Talk Intercom */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenIntercom(member); }}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-purple-soft hover:bg-purple-100 text-purple-deep font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 text-purple-primary" /> Intercom
                  </button>

                  {/* Standard Cellular Call */}
                  <a 
                    href={`tel:${member.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-ink font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>

                  {/* Request Check-In */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSendPing(member.id, member.name); }}
                    disabled={isPinged}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isPinged 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-purple-primary hover:bg-purple-deep text-white shadow-sm'
                    }`}
                  >
                    {isPinged ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ping Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Check-In
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom utility controls: Edit / Delete */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMember(member);
                      setIsAddEditOpen(true);
                    }}
                    className="flex items-center gap-1 hover:text-purple-primary transition-colors font-medium"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Profile
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMember(member.id, member.name);
                    }}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rendezvous Haven & Escalation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Designated Haven Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                DESIGNATED FAMILY HAVEN
              </span>
              <button 
                onClick={() => setIsRendezvousOpen(true)}
                className="text-xs text-purple-primary hover:underline font-bold"
              >
                Change Haven →
              </button>
            </div>

            <h3 className="text-xl font-bold text-ink">{rendezvousPoint.name}</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">{rendezvousPoint.address}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="bg-canvas p-3 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] text-muted block uppercase">ELEVATION DATUM</span>
                <span className="text-base font-extrabold text-emerald-700">{rendezvousPoint.elevation}</span>
              </div>
              <div className="bg-canvas p-3 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] text-muted block uppercase">AVAILABLE BEDS</span>
                <span className="text-base font-extrabold text-ink">{rendezvousPoint.availableCapacity} / {rendezvousPoint.totalCapacity}</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button 
              onClick={() => navigateTo('safe-places')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-ink font-bold text-xs transition-colors"
            >
              Browse All Shelters
            </button>
            <button 
              onClick={() => setIsRendezvousOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-purple-soft text-purple-deep hover:bg-purple-primary hover:text-white font-bold text-xs transition-colors"
            >
              Simulate Family Rendezvous
            </button>
          </div>
        </div>

        {/* Automated Escalation Rule Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                AUTONOMOUS PROTOCOL
              </span>
              <button 
                onClick={() => setIsEscalationOpen(true)}
                className="text-xs text-purple-primary hover:underline font-bold"
              >
                Configure Rule →
              </button>
            </div>

            <h3 className="text-xl font-bold text-ink">Automated High-Water Trigger</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              If any member stays in a zone where water rises above <strong>30 cm</strong> for more than <strong>15 minutes</strong>, 
              an automated high-ground emergency package is dispatched to the entire circle and BMC Flood Desk.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 font-mono">
              <span className="font-bold block mb-0.5">Active Rule Trigger State:</span>
              <span>1 Member (Aarav at Matunga Basin: 34cm) is currently exceeding the 30cm limit.</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button 
              onClick={() => setIsEscalationOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" /> Open Escalation Rule Sandbox & Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
         ALL 18 INTERACTIVE MODALS
      ========================================================================= */}
      <AddEditMemberModal 
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      <FamilySOSBroadcastModal 
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        members={members}
        speakAlert={speakAlert}
      />

      <FamilyIntercomCallModal 
        isOpen={isIntercomOpen}
        onClose={() => setIsIntercomOpen(false)}
        member={activeCallMember}
        speakAlert={speakAlert}
      />

      <FamilyRendezvousModal 
        isOpen={isRendezvousOpen}
        onClose={() => setIsRendezvousOpen(false)}
        selectedHaven={rendezvousPoint}
        onSelectHaven={(h) => setRendezvousPoint(h)}
        members={members}
        speakAlert={speakAlert}
      />

      <FamilyGeofenceModal 
        isOpen={isGeofenceOpen}
        onClose={() => setIsGeofenceOpen(false)}
        speakAlert={speakAlert}
      />

      <FamilyEscalationModal 
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        speakAlert={speakAlert}
      />

      <ZeroTrackPrivacyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        currentMode={privacyMode}
        onSelectMode={(m) => setPrivacyMode(m)}
      />

      <GoBagSuppliesModal 
        isOpen={isGoBagOpen}
        onClose={() => setIsGoBagOpen(false)}
      />

      <MedicalRegistryModal 
        isOpen={isMedicalOpen}
        onClose={() => setIsMedicalOpen(false)}
        members={members}
        speakAlert={speakAlert}
      />

      <VehicleSafetyModal 
        isOpen={isVehicleOpen}
        onClose={() => setIsVehicleOpen(false)}
      />

      <PetSafetyModal 
        isOpen={isPetOpen}
        onClose={() => setIsPetOpen(false)}
      />

      <OfflineSmsMeshModal 
        isOpen={isOfflineSmsOpen}
        onClose={() => setIsOfflineSmsOpen(false)}
        members={members}
      />

      <CircleInviteModal 
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <ProximitySensorsModal 
        isOpen={isSensorsOpen}
        onClose={() => setIsSensorsOpen(false)}
      />

      <DocumentVaultModal 
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <EvacuationDrillModal 
        isOpen={isDrillOpen}
        onClose={() => setIsDrillOpen(false)}
        speakAlert={speakAlert}
      />

      <FamilyCheckInTimelineModal 
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        events={activityEvents}
        onAddNote={(note) => {
          setActivityEvents(prev => [
            { title: 'Family Feed Note', time: 'Just now', desc: note },
            ...prev
          ]);
          speakAlert(`Note posted to circle: ${note}`);
        }}
      />

      <SafeCorridorModal 
        isOpen={isCorridorOpen}
        onClose={() => setIsCorridorOpen(false)}
        members={members}
      />

      <BatteryBeaconModal 
        isOpen={isBatteryBeaconOpen}
        onClose={() => setIsBatteryBeaconOpen(false)}
        members={members}
      />
    </div>
  );
}
