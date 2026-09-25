import React, { useState, useEffect, useMemo } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  User, Sliders, Car, Bell, Volume2, ShieldCheck, 
  Smartphone, HardDrive, Eye, CheckCircle2, RefreshCw, Save,
  AlertTriangle, Radio, QrCode, Download, ShieldAlert,
  Heart, Users, Briefcase, Zap, Compass, Building2,
  ChevronRight, Sparkles, Printer, FileText, Check, ArrowRight
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

// Modular Feature Components
import ProfileIdentityCard from '../profile/ProfileIdentityCard';
import ProfileVehicleGarage from '../profile/ProfileVehicleGarage';
import ProfileElevationBenchmarker from '../profile/ProfileElevationBenchmarker';
import ProfileMedicalSafety from '../profile/ProfileMedicalSafety';
import ProfileEmergencyContacts from '../profile/ProfileEmergencyContacts';
import ProfileGoBagAuditor, { DEFAULT_GO_BAG_ITEMS } from '../profile/ProfileGoBagAuditor';
import ProfileAudioSirenModal from '../profile/ProfileAudioSirenModal';
import ProfileMeshSimulatorModal from '../profile/ProfileMeshSimulatorModal';
import ProfileExportModal from '../profile/ProfileExportModal';
import ProfileAdditionalFeatures from '../profile/ProfileAdditionalFeatures';

const LOCAL_STORAGE_KEY = 'citizen_profile_v2';

export default function ProfileSettings() {
  const { 
    selectedWardId,
    setSelectedWardId,
    vehicleClearance, 
    setVehicleClearance, 
    vehicleType,
    setVehicleType,
    isHighContrast, 
    setIsHighContrast,
    isLargeText,
    setIsLargeText,
    isVoiceEnabled,
    setIsVoiceEnabled,
    voiceLanguage,
    setVoiceLanguage,
    isOfflineMode,
    setIsOfflineMode,
    speakAlert
  } = useFlood();

  const { navigateTo } = useNavigation();

  // Load initial persistent profile or use comprehensive defaults
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error parsing profile localStorage:", e);
    }
    return {
      identity: {
        name: 'Rahul Deshmukh',
        phone: '+91 98201 54321',
        email: 'rahul.deshmukh@mumbai.gov.in',
        wardId: selectedWardId || 'ward-f-north',
        bloodGroup: 'B+ Positive',
        emergencyAlt: '+91 98200 98765 (Spouse)',
        address: 'Flat 402, Sai Kripa Heights, Matunga East, Mumbai - 400019',
        citizenId: 'BMC-DIS-2026-F9420'
      },
      vehicles: [
        { id: 'veh-1', name: 'Hyundai Creta SX (Primary)', type: 'suv', regNumber: 'MH-01-DK-4912', clearance: 22, isEv: false, airIntakeCm: 38 },
        { id: 'veh-2', name: 'Ather 450X Gen 3', type: 'twowheeler', regNumber: 'MH-02-EV-9021', clearance: 14, isEv: true, airIntakeCm: 22, batterySealRating: 'IP67' },
        { id: 'veh-3', name: 'Maruti Suzuki Swift', type: 'hatchback', regNumber: 'MH-03-BW-3310', clearance: 18, isEv: false, airIntakeCm: 30 }
      ],
      activeVehicleId: 'veh-1',
      elevationProfile: {
        plinthHeightCm: 45,
        floorLevel: 4,
        hasBasementParking: true,
        basementRampBermCm: 20,
        sumpPumpInstalled: true,
        sumpCapacityLpm: 450,
        structureType: 'High-Rise RCC'
      },
      medicalProfile: {
        hasInsulin: true,
        insulinDosesLeft: 14,
        icePacksHours: 18,
        hasDialysis: false,
        dialysisDaysFreq: 'Every 2 Days',
        requiresOxygen: false,
        oxygenCylinderBackupHours: 12,
        mobilityStatus: 'Agile / Fully Mobile',
        bloodThinnerMeds: false,
        cardiacConditions: false,
        allergies: 'Penicillin, Shellfish',
        doctorContact: 'Dr. Mehta (KEM Hospital) +91 98200 11223'
      },
      contacts: [
        { id: 'ice-1', name: 'Sunita Deshmukh', relationship: 'Spouse', phone: '+91 98200 98765', notifyOnRedAlert: true },
        { id: 'ice-2', name: 'Amit Deshmukh', relationship: 'Brother', phone: '+91 98201 12345', notifyOnRedAlert: true },
        { id: 'ice-3', name: 'Sanjay Shinde (CHS Secretary)', relationship: 'Neighbor', phone: '+91 98204 77889', notifyOnRedAlert: false }
      ],
      goBagItems: DEFAULT_GO_BAG_ITEMS,
      extras: {
        notifications: {
          levelRed: true,
          levelOrange: true,
          levelYellow: false,
          recessionNotices: true,
          overrideQuietHours: true,
          smsDelivery: true,
          pushDelivery: true
        },
        batterySaver: {
          enabled: false,
          oledBlackTheme: true,
          disableAnimations: true,
          throttleGpsIntervalSec: 60,
          estimatedHoursRemaining: 34
        },
        insurance: {
          policyNumber: 'HDFC-ERGO-FL-89210',
          provider: 'HDFC ERGO General Insurance',
          vehicleClaimHelpDesk: '1800-2666',
          zeroDepreciationCover: true,
          hydrostaticLockProtection: true,
          preFloodPhotosStored: 4
        },
        volunteer: {
          isEnrolled: true,
          volunteerRole: '4x4 Off-Road Rescue Volunteer',
          certifications: ['CPR & First Aid Level 2', 'NDMA Citizen First Responder'],
          hasInflatableBoat: false,
          hasHamRadio: true,
          callSign: 'VU2-MUM-FLOOD',
          availableForDuty: true
        },
        routePreferences: {
          avoidUnderpasses: true,
          avoidBridgeRamps: true,
          preferMonorailCorridors: true,
          maxDetourMinutes: 25,
          pedestrianElevationBufferCm: 10
        },
        rainGauge: {
          pairedDevice: 'Davis Vantage Pro2 / ESP32-Balcony-L4',
          isConnected: true,
          liveRainRateMmHr: 42.5,
          drainClearanceAlert: true,
          lastSync: '1 min ago'
        },
        petSafety: {
          hasPets: true,
          petName: 'Bruno & Milo',
          species: 'Golden Retriever & Indie Cat',
          carrierWeightKg: 28,
          isVaccinated: true,
          filterPetSheltersOnly: true
        },
        privacy: {
          precisionMode: 'differential',
          jitterRadiusM: 450,
          scrambleCoordinates: true
        },
        taxSubsidy: {
          applicationId: 'BMC-SUB-2026-8812',
          cessRebatePercent: 15,
          status: 'APPROVED (₹4,200 Municipal Credit)',
          sumpPumpVerified: true
        },
        incidentDiary: {
          logs: [
            { id: 'inc-1', year: '2024', location: 'Milan Subway', notes: 'Water reached 65cm. Hydrostatic stall avoided by reversing.' },
            { id: 'inc-2', year: '2025', location: 'Hindmata Flyover Under-Berm', notes: 'Severe 40cm waterlogging during 140mm cloudburst.' }
          ]
        }
      }
    };
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'garage' | 'elevation' | 'medical' | 'contacts' | 'gobag' | 'advanced'

  // Modals
  const [showSirenModal, setShowSirenModal] = useState(false);
  const [showMeshModal, setShowMeshModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Offline tile cache telemetry
  const [cacheSizeMb, setCacheSizeMb] = useState(14.8);
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);

  // Save state
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Persist to localStorage whenever profileData changes
  const saveToDisk = (newData) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  };

  const handleUpdateSection = (sectionKey, updatedValues) => {
    setProfileData(prev => {
      const next = { ...prev, [sectionKey]: updatedValues };
      saveToDisk(next);
      return next;
    });
  };

  // Sync ward change from Identity Card to FloodContext
  useEffect(() => {
    if (profileData.identity?.wardId && profileData.identity.wardId !== selectedWardId) {
      setSelectedWardId(profileData.identity.wardId);
    }
  }, [profileData.identity?.wardId]);

  // Sync active vehicle clearance to FloodContext
  useEffect(() => {
    const activeVeh = profileData.vehicles?.find(v => v.id === profileData.activeVehicleId);
    if (activeVeh && activeVeh.clearance !== vehicleClearance) {
      setVehicleClearance(activeVeh.clearance);
    }
    if (activeVeh?.type && activeVeh.type !== vehicleType) {
      setVehicleType(activeVeh.type);
    }
  }, [profileData.activeVehicleId, profileData.vehicles]);

  // Dynamic Disaster Preparedness Audit Score (Feature 20)
  const auditScore = useMemo(() => {
    let score = 20; // baseline

    // 1. Identity completed (+15)
    if (profileData.identity?.name && profileData.identity?.phone && profileData.identity?.emergencyAlt) {
      score += 15;
    }
    // 2. Active vehicle calibrated (+15)
    if (profileData.vehicles?.length > 0 && vehicleClearance > 0) {
      score += 15;
    }
    // 3. ICE Contacts (+15)
    if (profileData.contacts?.length >= 2) {
      score += 15;
    }
    // 4. Go-Bag completion (+20)
    const goBagChecked = profileData.goBagItems?.filter(i => i.checked).length || 0;
    const goBagTotal = profileData.goBagItems?.length || 12;
    score += Math.round((goBagChecked / goBagTotal) * 20);

    // 5. Medical profile set (+10)
    if (profileData.medicalProfile?.doctorContact) {
      score += 10;
    }
    // 6. Offline cache updated (+5)
    if (cacheSizeMb > 0) {
      score += 5;
    }

    return Math.min(100, score);
  }, [profileData, vehicleClearance, cacheSizeMb]);

  // Manual save handler
  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    saveToDisk(profileData);
    setSavedSuccess(true);
    speakAlert("Disaster profile and vehicle calibration saved successfully.");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Cache download simulation
  const handleUpdateCache = () => {
    setIsUpdatingCache(true);
    setCacheProgress(10);
    speakAlert("Initiating offline Mumbai GIS tile package download.");

    const interval = setInterval(() => {
      setCacheProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdatingCache(false);
          setCacheSizeMb(28.4);
          speakAlert("Offline GIS elevation mesh and flood evacuation maps updated.");
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleClearCache = () => {
    setCacheSizeMb(0.0);
    speakAlert("Offline cache purged.");
  };

  const currentWardObj = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" /> Comprehensive Citizen Disaster Readiness
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            Profile & Vehicle Safety Center
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 border border-purple-200">
              20 PRO FEATURES
            </span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Calibrate vehicle wading thresholds, emergency ICE speed-dial, medical cold-chain backup, and offline disaster mesh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> All Settings Synced
            </div>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>

      {/* FEATURE 20: Disaster Preparedness Score & Interactive Readiness Audit Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                FEATURE 20: DISASTER PREPAREDNESS INDEX
              </span>
              <span className="text-xs text-purple-300 font-semibold">Ward: {currentWardObj.name}</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Preparedness Score: <span className="text-purple-300">{auditScore}% Readiness</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated from vehicle exhaust wading clearance, 72h go-bag supplies, emergency ICE ring, and medical cold-chain status.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-purple-300" /> {vehicleClearance}cm Wading Limit
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-300" /> Go-Bag {profileData.goBagItems.filter(i => i.checked).length}/12 Packed
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-300" /> {profileData.contacts.length} ICE Contacts
              </span>
            </div>
          </div>

          {/* Quick Trigger Toolbuttons */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSirenModal(true)}
              className="px-4 py-2.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition border border-red-500/40"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Test Audio Siren (Web Audio)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMeshModal(true)}
              className="px-4 py-2.5 bg-purple-700/80 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition border border-purple-500/40"
            >
              <Smartphone className="w-4 h-4" />
              <span>Offline P2P Mesh Nodes</span>
            </button>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Disaster Plan</span>
            </button>
          </div>
        </div>

        {/* Readiness Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 transition-all duration-700 rounded-full"
              style={{ width: `${auditScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tab Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'identity', label: 'Citizen ID & Pass', icon: User },
          { id: 'garage', label: 'Vehicle & EV Wading', icon: Car },
          { id: 'elevation', label: 'Home Elevation Risk', icon: Building2 },
          { id: 'medical', label: 'Medical & Cold-Chain', icon: Heart },
          { id: 'contacts', label: 'Emergency ICE Circle', icon: Users },
          { id: 'gobag', label: '72h Go-Bag Auditor', icon: Briefcase },
          { id: 'advanced', label: 'Disaster Rules & Extras (14)', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-primary text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-ink hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="space-y-8">
        {/* TAB 1: Citizen ID Card & Pass */}
        {activeTab === 'identity' && (
          <ProfileIdentityCard 
            profile={profileData.identity}
            onUpdate={(updated) => handleUpdateSection('identity', updated)}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 2: Multi-Vehicle Garage */}
        {activeTab === 'garage' && (
          <ProfileVehicleGarage 
            vehicles={profileData.vehicles}
            activeVehicleId={profileData.activeVehicleId}
            onSelectActive={(id) => handleUpdateSection('activeVehicleId', id)}
            onUpdateVehicles={(updated) => handleUpdateSection('vehicles', updated)}
            vehicleClearance={vehicleClearance}
            setVehicleClearance={setVehicleClearance}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 3: Home Elevation Benchmarking */}
        {activeTab === 'elevation' && (
          <ProfileElevationBenchmarker 
            elevationProfile={profileData.elevationProfile}
            onUpdateElevation={(updated) => handleUpdateSection('elevationProfile', updated)}
            currentWardId={selectedWardId}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 4: Medical Safety Profile */}
        {activeTab === 'medical' && (
          <ProfileMedicalSafety 
            medicalProfile={profileData.medicalProfile}
            onUpdateMedical={(updated) => handleUpdateSection('medicalProfile', updated)}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 5: Emergency Contacts */}
        {activeTab === 'contacts' && (
          <ProfileEmergencyContacts 
            contacts={profileData.contacts}
            onUpdateContacts={(updated) => handleUpdateSection('contacts', updated)}
            userWardName={currentWardObj.name}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 6: Go-Bag Auditor */}
        {activeTab === 'gobag' && (
          <ProfileGoBagAuditor 
            goBagItems={profileData.goBagItems}
            onUpdateGoBag={(updated) => handleUpdateSection('goBagItems', updated)}
            speakAlert={speakAlert}
          />
        )}

        {/* TAB 7: Additional Features (Features 6, 7, 10, 11, 12, 13, 14, 15, 16, 17) */}
        {activeTab === 'advanced' && (
          <ProfileAdditionalFeatures 
            profileExtras={profileData.extras}
            onUpdateExtras={(updated) => handleUpdateSection('extras', updated)}
            speakAlert={speakAlert}
          />
        )}

        {/* SECTION: Voice Guidance, Speech Rate & Accessibility (Fixed and Enhanced) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-soft text-purple-primary">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Voice Guidance & Accessibility Settings</h2>
              <p className="text-xs text-muted">Real-time spoken cloudburst warnings, daylight glare contrast, and font scaling.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Audio Language */}
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase font-semibold">
                Spoken Alert Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'mr', label: 'मराठी (Marathi)' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setVoiceLanguage(lang.code);
                      speakAlert(`Language updated to ${lang.label}`);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      voiceLanguage === lang.code 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-xs' 
                        : 'bg-canvas border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => speakAlert("Warning: Flood level in your ward exceeds vehicle wading limits. Safe evacuation route recalculated.")}
                className="mt-3 text-xs text-purple-primary font-bold flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" /> Test Voice Synthesis Readout
              </button>
            </div>

            {/* High Contrast */}
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase font-semibold">
                High-Contrast Sun / Rain Glare Mode
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = !isHighContrast;
                  setIsHighContrast(next);
                  speakAlert(next ? "High contrast glare mode active" : "Standard visual theme restored");
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isHighContrast 
                    ? 'bg-ink text-white border-ink shadow-sm' 
                    : 'bg-canvas border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{isHighContrast ? 'High Contrast Active' : 'Standard Theme Active'}</span>
                <Eye className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-muted block mt-1.5">
                Enhances street boundary lines and depth gauges under blinding monsoon rain.
              </span>
            </div>

            {/* Font Size Scaling */}
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase font-semibold">
                Emergency Font Scaling
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = !isLargeText;
                  setIsLargeText(next);
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isLargeText 
                    ? 'bg-purple-soft text-purple-deep border-purple-300 ring-2 ring-purple-primary/40' 
                    : 'bg-canvas border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{isLargeText ? 'Large Text Mode (120%)' : 'Standard Text (100%)'}</span>
                <span className="text-xs font-mono font-bold">A+</span>
              </button>
              <span className="text-[10px] text-muted block mt-1.5">
                Increases depth readings and road names for rapid legibility while driving.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: Offline Map Storage & GIS Tile Cache (Fixed and Enhanced) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-soft text-purple-primary">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Offline Map Cache & Cellular Failure Resilience</h2>
              <p className="text-xs text-muted">Pre-cached vector elevation tiles for 24 Mumbai administrative wards.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-canvas border border-slate-200/80">
              <div>
                <span className="text-xs font-bold text-ink block">Pre-Cached Mumbai GIS Elevation Mesh</span>
                <span className="text-xs font-mono text-muted">
                  Storage Occupied: <strong className="text-purple-primary">{cacheSizeMb.toFixed(1)} MB</strong> (24 Wards, Lidar DTM & Drainage Mesh)
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isUpdatingCache}
                  onClick={handleUpdateCache}
                  className="px-3.5 py-2 bg-purple-primary hover:bg-purple-deep disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingCache ? 'animate-spin' : ''}`} />
                  <span>{isUpdatingCache ? `Downloading (${cacheProgress}%)` : 'Update Offline Tiles'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Clear Cache
                </button>
              </div>
            </div>

            {isUpdatingCache && (
              <div className="p-3 bg-purple-soft/40 border border-purple-200 rounded-xl">
                <div className="flex justify-between text-xs font-mono text-purple-900 mb-1">
                  <span>Downloading GeoJSON Elevation Contours...</span>
                  <span>{cacheProgress}%</span>
                </div>
                <div className="h-2 w-full bg-purple-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-primary transition-all duration-300"
                    style={{ width: `${cacheProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Save Button Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-8 py-3.5 bg-purple-primary hover:bg-purple-deep text-white font-bold text-sm rounded-2xl shadow-md shadow-purple-primary/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Profile Preferences
          </button>
        </div>
      </div>

      {/* MODALS */}
      <ProfileAudioSirenModal
        isOpen={showSirenModal}
        onClose={() => setShowSirenModal(false)}
      />

      <ProfileMeshSimulatorModal
        isOpen={showMeshModal}
        onClose={() => setShowMeshModal(false)}
        userWard={currentWardObj.name}
        citizenName={profileData.identity?.name || 'Citizen'}
        speakAlert={speakAlert}
      />

      <ProfileExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        fullProfileData={profileData}
        onImportData={(imported) => {
          setProfileData(imported);
          saveToDisk(imported);
        }}
        speakAlert={speakAlert}
      />
    </div>
  );
}
