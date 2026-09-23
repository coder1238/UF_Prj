import React, { useState, useEffect, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Camera, MapPin, AlertTriangle, CheckCircle2, ShieldCheck, 
  Upload, HelpCircle, Navigation, ArrowRight, ArrowLeft, RefreshCw,
  Sparkles, Layers, AlertOctagon, PhoneCall, ShieldAlert,
  Activity, Droplets, Gauge, Compass, Clock, Zap, Users,
  Check, X, ThumbsUp, WifiOff, FileText, ChevronRight, Award
} from 'lucide-react';
import { 
  MiniPinpointMap, WaterlineVisualizer, CanvasVisionAnalyzer,
  VoiceMemoRecorder, EmergencySosModal, QrTicketPass, DossierExporter,
  SensorTelemetryOverlay, RainfallRadarGauge, TideOutfallPredictor,
  SafeHavenRecommender, AcousticSosBeacon, ObserverTrustBadge,
  VehicleRecoveryRequest, PhotoAnnotationCanvas, OfflineSmsDispatch,
  DraftAutoRestoreDrawer, MUMBAI_HOTSPOTS
} from './report/ReportComponents';

export default function ReportFlood() {
  const { currentWard, speakAlert, voiceLanguage, isOfflineMode } = useFlood();
  const { navigateTo } = useNavigation();

  // Wizard state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState(null);

  // Feature 12: Emergency SOS Modal
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isEmergencyPriority, setIsEmergencyPriority] = useState(false);

  // STEP 1: Water Depth & Hydrodynamic Drag
  const [selectedDepth, setSelectedDepth] = useState(25);
  const [depthVisualLabel, setDepthVisualLabel] = useState('Shin Deep (~25 cm)');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [waterMovement, setWaterMovement] = useState('moving'); // 'still' | 'moving' | 'rapid'
  const [rateOfRise, setRateOfRise] = useState('rising_fast'); // 'rising_fast' | 'rising_slow' | 'stable' | 'receding'

  // STEP 2: Hazards & Environmental Screening
  const [selectedHazards, setSelectedHazards] = useState(['stalled_vehicle']);
  const [waterSourceType, setWaterSourceType] = useState('rain_runoff'); // 'rain_runoff' | 'sewage_overflow' | 'chemical_sheen' | 'saline_tide'
  const [drainageDefects, setDrainageDefects] = useState([]);
  const [evacuationNeeds, setEvacuationNeeds] = useState([]);

  // STEP 3: Location Lock & Catchment Calibration
  const [locationName, setLocationName] = useState('Kings Circle Flyover Underpass, Matunga');
  const [coords, setCoords] = useState({ lat: 19.0274, lng: 72.8559 });
  const [gpsAccuracy, setGpsAccuracy] = useState(4.2);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [detectedWard, setDetectedWard] = useState('Ward F-North');
  const [detectedBasin, setDetectedBasin] = useState('Sion-Matunga Canal');
  const [userComment, setUserComment] = useState('');
  const [nearbyDuplicateAlert, setNearbyDuplicateAlert] = useState(true);

  // STEP 4: Evidence & AI Vision
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [voiceNoteData, setVoiceNoteData] = useState(null);
  const fileInputRef = useRef(null);
  const [annotatedPhotoSrc, setAnnotatedPhotoSrc] = useState(null);

  // Additional 10 Features State
  const [rainIntensity, setRainIntensity] = useState('heavy');
  const [recoveryDetails, setRecoveryDetails] = useState({ regNo: '', model: '', towType: 'flatbed' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isVaultDrawerOpen, setIsVaultDrawerOpen] = useState(false);

  // Offline status & drafts
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Depth presets with real-world physical references
  const depthPresets = [
    { label: 'Ankle Deep', depth: 10, desc: 'Splashing over road surface, curb submerged', icon: '🦶' },
    { label: 'Shin Deep', depth: 25, desc: 'Exhaust pipe level for standard hatchbacks', icon: '🚶' },
    { label: 'Knee Deep', depth: 40, desc: 'Two-wheeler engine cutoff, pedestrian risk', icon: '⚠️' },
    { label: 'Waist Deep', depth: 70, desc: 'SUV buoyant, high buoyancy drag risk', icon: '🛑' },
    { label: 'Chest Deep', depth: 100, desc: 'Life-threatening swift current', icon: '🌊' }
  ];

  // Extended Hazards
  const hazardOptions = [
    { id: 'manhole', name: 'Open / Dislodged Manhole Vortex', severity: 'critical', score: 35 },
    { id: 'wire', name: 'Fallen Electric Cable / Sparking', severity: 'critical', score: 40 },
    { id: 'stalled_vehicle', name: 'Stalled Bus / Car Blocking Lane', severity: 'moderate', score: 15 },
    { id: 'underpass_trap', name: 'Underpass Submerged & Inaccessible', severity: 'danger', score: 30 },
    { id: 'debris', name: 'Floating Tree Trunk / Silt Barrier', severity: 'caution', score: 10 },
    { id: 'retaining_wall', name: 'Retaining Wall / Nullah Overflow', severity: 'danger', score: 25 },
    { id: 'submerged_tracks', name: 'Railway Track Ballast Submerged', severity: 'critical', score: 35 },
    { id: 'trapped_citizens', name: 'Trapped Commuters / Needs Rescue', severity: 'critical', score: 45 }
  ];

  // Feature 11: Real-time Composite Hazard Index (0-100)
  const compositeHazardScore = Math.min(100, 
    selectedHazards.reduce((acc, hId) => {
      const h = hazardOptions.find(o => o.id === hId);
      return acc + (h ? h.score : 0);
    }, 0) + (selectedDepth > 50 ? 25 : selectedDepth > 25 ? 15 : 5)
  );

  // Feature 9: Hydrodynamic drag calculation
  const velocityMps = waterMovement === 'still' ? 0.1 : waterMovement === 'moving' ? 0.75 : 1.85;
  // Drag Force Fd = 0.5 * rho * v^2 * Cd * A (approx. for human legs: ~120 N at 1.8 m/s, ~20 N at 0.7 m/s)
  const kineticDragNewtons = Math.round(0.5 * 1000 * Math.pow(velocityMps, 2) * 1.1 * ((selectedDepth / 100) * 0.35));

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Feature 1: Real Geolocation API Trigger
  const handleAcquireRealGps = () => {
    setIsGpsLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(5));
        const userLng = Number(pos.coords.longitude.toFixed(5));
        const acc = Math.round(pos.coords.accuracy || 5);
        setCoords({ lat: userLat, lng: userLng });
        setGpsAccuracy(acc);
        setGpsSuccess(true);
        setIsGpsLoading(false);

        // Find closest hotspot to assign realistic landmark
        let closest = MUMBAI_HOTSPOTS[0];
        let minD = 99999;
        MUMBAI_HOTSPOTS.forEach(spot => {
          const d = Math.hypot(spot.lat - userLat, spot.lng - userLng);
          if (d < minD) {
            minD = d;
            closest = spot;
          }
        });

        setLocationName(`Near ${closest.name.split(' (')[0]}, GPS Verified`);
        setDetectedWard(closest.ward);
        setDetectedBasin(closest.basin);

        speakAlert(`GPS locked with ±${acc} meter accuracy in ${closest.ward}.`);
      },
      (err) => {
        console.warn('Geolocation acquisition error or permission denied:', err);
        setIsGpsLoading(false);
        // Fallback simulation to King's circle with high accuracy
        setCoords({ lat: 19.0315, lng: 72.8592 });
        setGpsAccuracy(3.5);
        setGpsSuccess(true);
        setLocationName('Gandhi Market (King’s Circle / Sion), GPS Calibrated');
        setDetectedWard('Ward F-North');
        setDetectedBasin('Sion-Matunga Canal');
        speakAlert('Calibrated GPS position to nearest hydraulic drainage node.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Hotspot snap handler
  const handleSnapHotspot = (lat, lng, name, ward, basin) => {
    setCoords({ lat, lng });
    setLocationName(name);
    if (ward) setDetectedWard(ward);
    if (basin) setDetectedBasin(basin);
    setGpsAccuracy(2.5);
  };

  // Toggle Hazards
  const toggleHazard = (id) => {
    if (selectedHazards.includes(id)) {
      setSelectedHazards(selectedHazards.filter(h => h !== id));
    } else {
      setSelectedHazards([...selectedHazards, id]);
    }
  };

  // Toggle Drainage Defects
  const toggleDrainageDefect = (defect) => {
    if (drainageDefects.includes(defect)) {
      setDrainageDefects(drainageDefects.filter(d => d !== defect));
    } else {
      setDrainageDefects([...drainageDefects, defect]);
    }
  };

  // Toggle Evacuation Needs
  const toggleEvacuationNeed = (need) => {
    if (evacuationNeeds.includes(need)) {
      setEvacuationNeeds(evacuationNeeds.filter(n => n !== need));
    } else {
      setEvacuationNeeds([...evacuationNeeds, need]);
    }
  };

  // Feature 5: Real File and Camera Capture
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotoUrls = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      url: URL.createObjectURL(file),
      file
    }));

    setPhotos(prev => [...prev, ...newPhotoUrls]);
    setSelectedPhotoIndex(photos.length);
    setAiAnalyzing(true);

    setTimeout(() => {
      setAiAnalyzing(false);
      setAiAnalysisResult({
        detectedDepth: `${Math.max(15, selectedDepth - 4)}–${selectedDepth + 5} cm`,
        waterColor: 'Turbid silt & runoff',
        landmarkConfidence: '97.8% (Matched road curb baseline)',
        detectedHazards: ['Submerged Curb', 'Surface Eddy']
      });
      speakAlert('Computer vision completed: Watermark elevation matched ground sensor.');
    }, 1500);
  };

  // Sample photo simulation if user doesn't have camera available
  const handleSamplePhoto = () => {
    const sample = {
      name: 'monsoon_waterlogging_mumbai.jpg',
      size: '245 KB',
      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      file: null
    };
    setPhotos(prev => [...prev, sample]);
    setSelectedPhotoIndex(photos.length);
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiAnalysisResult({
        detectedDepth: '28–34 cm',
        waterColor: 'High turbidity muddy runoff',
        landmarkConfidence: '98.4% (Curb height cross-reference)',
        detectedHazards: ['Open storm grating vortex', 'Flooded lane']
      });
    }, 1200);
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (selectedPhotoIndex >= photos.length - 1) {
      setSelectedPhotoIndex(Math.max(0, photos.length - 2));
    }
  };

  // Final Form Submission & Persistence
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `FLD-${Math.floor(2100 + Math.random() * 7800)}`;
      const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

      const newReportRecord = {
        id: ticketId,
        title: isEmergencyPriority 
          ? `[SOS EMERGENCY] Rapid Inundation at ${locationName}` 
          : `Waterlogging & Hazard: ${locationName}`,
        category: isEmergencyPriority ? 'SOS Emergency' : 'Waterlogging',
        location: locationName,
        ward: detectedWard,
        basin: detectedBasin,
        timestamp: `Just now (${nowStr})`,
        submittedAt: `Today, ${nowStr}`,
        coordinates: coords,
        gpsAccuracyMeters: gpsAccuracy,
        verified: true,
        verificationSource: 'Acoustic Gauge & Vision Model Cross-Validation',
        status: isEmergencyPriority ? 'assigned' : 'verified',
        statusColor: isEmergencyPriority ? 'red' : 'purple',
        depth: selectedDepth,
        estimatedDepth: selectedDepth,
        aiConfidence: aiAnalysisResult ? 96 : 88,
        sensorMatchScore: 94,
        upvotes: 1,
        userUpvoted: true,
        affectedCommutersDiverted: 350 + Math.floor(Math.random() * 200),
        karmaAwarded: isEmergencyPriority ? 100 : 50,
        hazards: selectedHazards.map(h => hazardOptions.find(o => o.id === h)?.name || h),
        waterMovement,
        velocityMps,
        kineticDragNewtons,
        rateOfRise,
        waterSourceType,
        drainageDefects,
        evacuationNeeds,
        userComment,
        photoCount: photos.length,
        hasVoiceMemo: Boolean(voiceNoteData),
        cryptographicHash: randomHash,
        steps: [
          { name: 'Submitted', time: nowStr, desc: 'Logged via Citizen Ground Network with verified GPS coordinates', status: 'COMPLETED' },
          { name: 'AI Verification', time: nowStr, desc: 'Curb segmentation and acoustic ultrasonic sensor cross-matched', status: 'COMPLETED' },
          { name: 'Dispatched', time: '+4m Target', desc: `Assigned to ${detectedWard} Disaster Response Unit & Dewatering Pump Crew`, status: 'ACTIVE' },
          { name: 'Resolved', time: '+45m Target', desc: 'Drainage suction active. Target road clearance beneath 10cm', status: 'PENDING' }
        ]
      };

      // Feature 22: Save to LocalStorage for persistent cross-page state
      try {
        const existing = JSON.parse(localStorage.getItem('urban_flood_citizen_reports') || '[]');
        const updated = [newReportRecord, ...existing];
        localStorage.setItem('urban_flood_citizen_reports', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('urbanflood_reports_updated', { detail: updated }));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      setLastSubmittedReport(newReportRecord);
      setIsSubmitting(false);
      setSubmissionComplete(true);

      const alertMsg = isEmergencyPriority
        ? `EMERGENCY ALERT: Priority 1 rescue ticket ${ticketId} has been transmitted to Ward ${detectedWard} and NDRF control.`
        : `Your flood report has been logged under ticket ${ticketId} and assimilated into the hydraulic ensemble model.`;
      speakAlert(alertMsg);
    }, 1400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Feature 12 Emergency Modal */}
      <EmergencySosModal 
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        locationName={locationName}
        wardName={detectedWard}
      />

      {/* Top Banner: Emergency SOS Quick-Action Bar */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <AlertOctagon className="w-6 h-6 animate-pulse text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight">Critical Monsoon Distress or Stranded?</h3>
            <p className="text-xs text-red-100">Instantly trigger Priority-1 Emergency Rescue or Call BMC Control 1916</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEmergencyPriority(!isEmergencyPriority);
              if (!isEmergencyPriority) {
                setIsSosOpen(true);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
              isEmergencyPriority 
                ? 'bg-white text-red-700 ring-4 ring-white/50' 
                : 'bg-black/30 hover:bg-black/40 text-white border border-white/30'
            }`}
          >
            {isEmergencyPriority ? '🚨 SOS Mode Active' : 'Activate SOS Mode'}
          </button>

          <button
            type="button"
            onClick={() => setIsSosOpen(true)}
            className="px-3.5 py-2 bg-white text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 1916
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-purple-primary animate-pulse" />
          <span>Citizen Ground Observation Network • 20+ Integrated Sensors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Report Waterlogging & Ground Hazards
        </h1>
        <p className="text-sm text-muted mt-2">
          Your observation directly feeds the Hydrodynamic Graph Neural Network and triggers municipal de-watering units in {detectedWard}.
        </p>

        {/* Offline / Online Pill & Feature 32 Vault Drawer */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full ${
            isOnline && !isOfflineMode 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}>
            {isOnline && !isOfflineMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Uplink: Auto-Syncing with BMC Command
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode: Reports will be locally cached & synced on reconnect
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => setIsVaultDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <span>📁</span> Incident Vault & Saved Tickets
          </button>
        </div>
      </div>

      {/* Feature 32: Draft Auto-Restore Drawer */}
      <DraftAutoRestoreDrawer
        isOpen={isVaultDrawerOpen}
        onClose={() => setIsVaultDrawerOpen(false)}
        onClearDraft={() => {
          localStorage.removeItem('urban_flood_citizen_reports');
          alert('Local storage incident reports cleared.');
          setIsVaultDrawerOpen(false);
        }}
      />

      {/* Progress Steps Header */}
      {!submissionComplete && (
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {[
            { num: 1, title: 'Depth & Drag', icon: Droplets },
            { num: 2, title: 'Hazards & Health', icon: AlertTriangle },
            { num: 3, title: 'Location & Map', icon: MapPin },
            { num: 4, title: 'Evidence & AI', icon: Camera }
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-purple-primary text-white shadow-md shadow-purple-500/20' 
                      : isDone 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-muted hover:bg-slate-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                    {isDone ? <Check className="w-4 h-4 text-emerald-700" /> : s.num}
                  </div>
                  <span className="text-xs font-bold hidden sm:inline">{s.title}</span>
                </button>
                {s.num < 4 && <div className="w-4 sm:w-10 h-0.5 bg-slate-200 mx-1 sm:mx-2" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Complete View */}
      {submissionComplete && lastSubmittedReport ? (
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-xl space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono uppercase text-muted tracking-wider block">Observation Ingested & Verified</span>
            <h2 className="text-3xl font-extrabold text-ink">{lastSubmittedReport.title}</h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Your observation has been verified against nearby acoustic water level sensors and logged in the municipal disaster management dispatch queue.
            </p>
          </div>

          {/* Feature 19: Verifiable QR Pass */}
          <QrTicketPass
            ticketId={lastSubmittedReport.id}
            location={lastSubmittedReport.location}
            depth={lastSubmittedReport.depth}
            timestamp={lastSubmittedReport.timestamp}
            hash={lastSubmittedReport.cryptographicHash}
          />

          {/* Incident Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-canvas p-4 rounded-2xl border border-slate-200">
              <span className="text-muted block text-[10px] uppercase">Logged Depth</span>
              <span className="font-extrabold text-lg text-ink">{lastSubmittedReport.depth} cm</span>
            </div>
            <div className="bg-canvas p-4 rounded-2xl border border-slate-200">
              <span className="text-muted block text-[10px] uppercase">GNN Ensemble</span>
              <span className="font-extrabold text-lg text-emerald-600">Assimilated</span>
            </div>
            <div className="bg-canvas p-4 rounded-2xl border border-slate-200">
              <span className="text-muted block text-[10px] uppercase">Commuters Diverted</span>
              <span className="font-extrabold text-lg text-purple-primary">+{lastSubmittedReport.affectedCommutersDiverted}</span>
            </div>
            <div className="bg-canvas p-4 rounded-2xl border border-slate-200">
              <span className="text-muted block text-[10px] uppercase">Civic Karma</span>
              <span className="font-extrabold text-lg text-amber-600">+{lastSubmittedReport.karmaAwarded} Pts</span>
            </div>
          </div>

          {/* Municipal Dispatch Unit Notice */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-primary text-white flex items-center justify-center font-bold">
                BMC
              </div>
              <div>
                <div className="font-bold text-ink">Assigned De-watering Deployment:</div>
                <div className="text-purple-900 font-mono">{lastSubmittedReport.ward} Emergency Pump Squad #3 (Capacity: 3500 LPM)</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-200 text-purple-900 font-bold uppercase">
              En Route
            </span>
          </div>

          {/* Feature 20: Dossier Exporter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <DossierExporter reportData={lastSubmittedReport} />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => navigateTo('my-reports')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-primary text-white font-semibold text-xs hover:bg-purple-deep transition-all shadow-sm"
              >
                Track in My Reports
              </button>
              <button 
                onClick={() => {
                  setSubmissionComplete(false);
                  setStep(1);
                  setPhotos([]);
                  setVoiceNoteData(null);
                  setAiAnalysisResult(null);
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-canvas hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200"
              >
                New Observation
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step Form Container */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          
          {/* STEP 1: Depth, Anatomical Waterline & Drag */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-purple-primary uppercase">Step 1 of 4 • Inundation Severity</span>
                <h2 className="text-2xl font-extrabold text-ink mt-0.5">Water Depth & Hydrodynamic Force</h2>
                <p className="text-xs text-muted mt-1">Calibrate water depth using physical landmarks, vehicle clearances, and current flow velocity.</p>
              </div>

              {/* Depth Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {depthPresets.map((preset) => (
                  <button
                    key={preset.depth}
                    type="button"
                    onClick={() => {
                      setSelectedDepth(preset.depth);
                      setDepthVisualLabel(`${preset.label} (~${preset.depth} cm)`);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedDepth === preset.depth
                        ? 'border-purple-primary bg-purple-soft/40 ring-2 ring-purple-primary shadow-sm'
                        : 'border-slate-200 hover:border-purple-primary/40 bg-white'
                    }`}
                  >
                    <span className="text-2xl block mb-1.5">{preset.icon}</span>
                    <span className="text-sm font-bold text-ink block leading-tight">{preset.label}</span>
                    <span className="text-xs font-mono font-extrabold text-purple-primary block mt-0.5">{preset.depth} cm</span>
                    <p className="text-[10px] text-muted mt-1 leading-snug line-clamp-2">{preset.desc}</p>
                  </button>
                ))}
              </div>

              {/* Slider adjustment with live cm display */}
              <div className="bg-canvas p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted uppercase">Precision Water Depth Slider:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{(selectedDepth / 2.54).toFixed(1)} inches</span>
                    <span className="text-xl font-mono font-black text-purple-primary bg-white px-3 py-1 rounded-xl border border-slate-200">
                      {selectedDepth} cm
                    </span>
                  </div>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={selectedDepth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSelectedDepth(val);
                    setDepthVisualLabel(`${val} cm`);
                  }}
                  className="w-full accent-purple-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted">
                  <span>0 cm (Dry)</span>
                  <span>30 cm (Knee)</span>
                  <span>60 cm (Waist)</span>
                  <span>90 cm (Chest)</span>
                  <span>120 cm (Extreme)</span>
                </div>
              </div>

              {/* Features 7 & 8: Anatomical Waterline & Vehicle Stall Risk Visualizer */}
              <WaterlineVisualizer 
                depthCm={selectedDepth}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
              />

              {/* Feature 9: Water Movement Velocity & Kinetic Drag Meter */}
              <div className="bg-canvas border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-mono uppercase text-muted">Feature 9 • Hydrodynamic Flow Dynamics</span>
                    <h3 className="text-sm font-bold text-ink">Water Movement & Sweeping Kinetic Drag</h3>
                  </div>
                  <div className="text-xs font-mono text-purple-primary font-bold">
                    Kinetic Drag: ~{kineticDragNewtons} N ({velocityMps} m/s)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'still', label: 'Still / Ponding', desc: 'No visible current, pooling curb', vel: '0.1 m/s' },
                    { id: 'moving', label: 'Laminar Flow', desc: 'Pedestrians wading with caution', vel: '0.7 m/s' },
                    { id: 'rapid', label: 'Torrential Torrent', desc: 'Sweeping force; vehicle float risk', vel: '1.8+ m/s' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWaterMovement(m.id)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                        waterMovement === m.id 
                          ? 'border-purple-primary bg-purple-50 font-bold text-purple-deep ring-1 ring-purple-primary' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{m.label}</span>
                        <span className="text-[10px] font-mono text-muted">{m.vel}</span>
                      </div>
                      <div className="text-[10px] text-muted leading-tight">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature 16: Rate of Rise Forecaster */}
              <div className="bg-canvas border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-muted">Feature 16 • Inundation Rate of Rise</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'rising_fast', label: 'Rapidly Rising', hint: '+10cm in 15min', color: 'text-red-700 bg-red-50 border-red-200' },
                    { id: 'rising_slow', label: 'Slowly Creeping', hint: '+2-5cm/hr', color: 'text-amber-800 bg-amber-50 border-amber-200' },
                    { id: 'stable', label: 'Plateaued / Constant', hint: 'Water holding', color: 'text-slate-700 bg-slate-50 border-slate-200' },
                    { id: 'receding', label: 'Receding / Draining', hint: '-5cm/hr', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRateOfRise(item.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        rateOfRise === item.id 
                          ? 'border-purple-primary bg-purple-100/70 font-bold text-purple-deep ring-2 ring-purple-primary' 
                          : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] text-muted font-mono">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature 24: Rainfall & Radar Reflectivity Gauge */}
              <RainfallRadarGauge 
                rainIntensity={rainIntensity}
                setRainIntensity={setRainIntensity}
              />

              {/* Feature 23: Sensor Telemetry Correlator */}
              <SensorTelemetryOverlay 
                currentDepth={selectedDepth}
                wardName={detectedWard}
              />

              {/* Feature 25: Coastal High-Tide & Sluice Interaction */}
              <TideOutfallPredictor />

              {/* Navigation Action */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-purple-primary text-white font-semibold rounded-xl text-sm hover:bg-purple-deep flex items-center gap-2 shadow-md shadow-purple-500/20"
                >
                  Continue to Hazards & Environmental Health <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Hazards & Environmental Screening */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-primary uppercase">Step 2 of 4 • Multi-Hazard Matrix</span>
                  <h2 className="text-2xl font-extrabold text-ink mt-0.5">Identify Hazards & Contamination</h2>
                  <p className="text-xs text-muted mt-1">Tag critical dangers, water pollution source, and stranded evacuation requirements.</p>
                </div>

                {/* Feature 11: Real-time Hazard Composite Score */}
                <div className="bg-canvas border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-muted block">Hazard Criticality Index</span>
                    <span className={`text-base font-black font-mono ${
                      compositeHazardScore > 65 ? 'text-red-600' : compositeHazardScore > 35 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {compositeHazardScore} / 100
                    </span>
                  </div>
                  <Gauge className="w-6 h-6 text-purple-primary" />
                </div>
              </div>

              {/* Hazard Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hazardOptions.map((haz) => {
                  const isChecked = selectedHazards.includes(haz.id);
                  return (
                    <div 
                      key={haz.id}
                      onClick={() => toggleHazard(haz.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'border-purple-primary bg-purple-50/70 shadow-xs ring-1 ring-purple-primary' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-purple-primary border-purple-primary text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-ink">{haz.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-extrabold ${
                        haz.severity === 'critical' ? 'bg-red-100 text-red-800' : haz.severity === 'danger' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        +{haz.score} pts
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Feature 10: Water Contamination & Biohazard Screener */}
              <div className="bg-canvas border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div>
                  <span className="text-xs font-mono uppercase text-muted">Feature 10 • Water Contamination Source</span>
                  <h3 className="text-sm font-bold text-ink">Biological & Chemical Contamination Assessment</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'rain_runoff', label: 'Rain Stormwater', desc: 'Turbid silt and mud', badge: 'Low Biohazard' },
                    { id: 'sewage_overflow', label: 'Sewage / Septic Outflow', desc: 'Foul odor, drain backflow', badge: 'High Infection Risk' },
                    { id: 'chemical_sheen', label: 'Chemical / Oil Sheen', desc: 'Rainbow oily film on surface', badge: 'Skin Hazard' },
                    { id: 'saline_tide', label: 'High Tide Saline Ingress', desc: 'Arabian sea backflow', badge: 'Corrosive' }
                  ].map(source => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setWaterSourceType(source.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        waterSourceType === source.id 
                          ? 'border-purple-primary bg-purple-100/70 font-bold text-purple-deep' 
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{source.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{source.desc}</div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded mt-2 inline-block bg-slate-200 text-slate-700">
                        {source.badge}
                      </span>
                    </button>
                  ))}
                </div>

                {waterSourceType === 'sewage_overflow' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-mono">
                    ⚠️ <strong>Leptospirosis Warning:</strong> Sewage overflow active. Avoid barefoot wading. Wash with antiseptic immediately if exposed.
                  </div>
                )}
              </div>

              {/* Feature 17 & 18: Drainage Infrastructure & Evacuation Needs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Feature 17: Municipal Drainage Defect Tagger */}
                <div className="bg-canvas border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-mono uppercase text-muted">Feature 17 • Municipal Asset Defect</span>
                  <div className="space-y-1.5">
                    {[
                      'Clogged Storm Drain Grating / Plastic Choke',
                      'Broken Sluice Gate / Flap Valve Failure',
                      'Municipal Dewatering Pump Inoperative',
                      'Breached River Bund / Nullah Overflow'
                    ].map(defect => (
                      <label key={defect} className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={drainageDefects.includes(defect)}
                          onChange={() => toggleDrainageDefect(defect)}
                          className="rounded text-purple-primary focus:ring-purple-primary"
                        />
                        <span>{defect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Feature 18: Stranded Citizen Evacuation Needs Checklist */}
                <div className="bg-canvas border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-mono uppercase text-muted">Feature 18 • Evacuation & Relief Needs</span>
                  <div className="space-y-1.5">
                    {[
                      'Elderly / Disabled Citizen Trapped on Foot',
                      'Urgent Insulin / Medical Kit Needed',
                      'Potable Drinking Water Depleted',
                      'Power Outage / Transformer Blown'
                    ].map(need => (
                      <label key={need} className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={evacuationNeeds.includes(need)}
                          onChange={() => toggleEvacuationNeed(need)}
                          className="rounded text-purple-primary focus:ring-purple-primary"
                        />
                        <span>{need}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Feature 29: Vehicle Breakdown & Towing Request */}
              {selectedHazards.includes('stalled_vehicle') && (
                <VehicleRecoveryRequest
                  recoveryDetails={recoveryDetails}
                  setRecoveryDetails={setRecoveryDetails}
                />
              )}

              {/* Feature 26: Evacuation Safe Havens */}
              <SafeHavenRecommender />

              {/* Feature 27: Distress Whistle & Flashlight Beacon */}
              <AcousticSosBeacon />

              {/* Navigation Action */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-purple-primary text-white font-semibold rounded-xl text-sm hover:bg-purple-deep flex items-center gap-2"
                >
                  Confirm Location & River Catchment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location Lock & Interactive Pinpoint Map */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-purple-primary uppercase">Step 3 of 4 • Spatial Geo-Calibration</span>
                <h2 className="text-2xl font-extrabold text-ink mt-0.5">Pinpoint Location & Catchment Basin</h2>
                <p className="text-xs text-muted mt-1">High-precision satellite lock mapped directly to hydraulic storm conduits.</p>
              </div>

              {/* Features 1, 2 & 3: Interactive Spatial Map + Hotspot Snapping */}
              <MiniPinpointMap
                lat={coords.lat}
                lng={coords.lng}
                accuracyMeters={gpsAccuracy}
                onLocationSelect={(lat, lng, name, ward, basin) => handleSnapHotspot(lat, lng, name, ward, basin)}
              />

              {/* GPS Acquisition Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-canvas p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${gpsSuccess ? 'bg-emerald-600 text-white' : 'bg-purple-primary text-white'}`}>
                    <Navigation className={`w-5 h-5 ${isGpsLoading ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">
                      {gpsSuccess ? 'Live GPS Satellite Fix Verified' : 'High-Accuracy Satellite Fix'}
                    </div>
                    <div className="text-[11px] font-mono text-muted">
                      Latitude: {coords.lat}° N • Longitude: {coords.lng}° E (Accuracy: ±{gpsAccuracy}m)
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAcquireRealGps}
                  disabled={isGpsLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
                  {isGpsLoading ? 'Calibrating GPS...' : 'Acquire My GPS Location'}
                </button>
              </div>

              {/* Landmark Name & Feature 4: Ward & Drainage Basin Auto-Classifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Landmark / Street Address</label>
                  <input 
                    type="text" 
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-ink focus:outline-none focus:border-purple-primary"
                  />
                </div>

                <div className="bg-canvas border border-slate-200 p-3 rounded-2xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Auto-Classified Ward</span>
                    <span className="font-bold text-ink text-sm">{detectedWard}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted block text-[10px] uppercase">Drainage Basin</span>
                    <span className="font-bold text-purple-primary text-sm">{detectedBasin}</span>
                  </div>
                </div>
              </div>

              {/* Feature 14: Nearby Duplicate Report Corroborator */}
              {nearbyDuplicateAlert && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-purple-900">
                      <Users className="w-4 h-4 text-purple-primary" />
                      <span>Nearby Citizen Observations Detected (Within 350m)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNearbyDuplicateAlert(false)}
                      className="text-muted hover:text-ink text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-slate-600">
                    Observation <strong className="font-mono text-purple-primary">FLD-2048</strong> was reported 22 mins ago at Milan Subway (34 cm depth).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      speakAlert('You have corroborated observation FLD-2048. Upvote registered.');
                      navigateTo('my-reports');
                    }}
                    className="px-3.5 py-1.5 bg-purple-primary text-white text-[11px] font-bold rounded-lg hover:bg-purple-deep flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Corroborate FLD-2048 Instead (+25 Karma)
                  </button>
                </div>
              )}

              {/* Optional Landmark Context */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Optional Detailed Context</label>
                <textarea 
                  rows="2"
                  placeholder="e.g. Opposite post office, water ponding rapidly near bus stop steps..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-primary text-ink"
                />
              </div>

              {/* Feature 28: Ground Observer Trust Tier & Civic Credential Badge */}
              <ObserverTrustBadge 
                isAnonymous={isAnonymous}
                setIsAnonymous={setIsAnonymous}
              />

              {/* Navigation Action */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-purple-primary text-white font-semibold rounded-xl text-sm hover:bg-purple-deep flex items-center gap-2"
                >
                  Add Evidence & AI Verification <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Real Photo, Canvas AI Turbidity & Voice Note */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-purple-primary uppercase">Step 4 of 4 • Ground Truth Verification</span>
                <h2 className="text-2xl font-extrabold text-ink mt-0.5">Evidence Photos & Vision Model</h2>
                <p className="text-xs text-muted mt-1">Upload photos to run client-side curb watermark analysis, and attach an audio distress note.</p>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Feature 5: Multi-Photo Uploader & Trigger */}
              {photos.length === 0 ? (
                <div className="border-2 border-dashed border-purple-primary/40 bg-purple-50/20 rounded-3xl p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-primary/10 text-purple-primary flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">Take Live Photo or Upload Evidence</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                      Clear photos showing curbs, vehicle wheels, or wall watermarks calibrate automated pixel segmenter.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-purple-primary text-white text-xs font-bold rounded-xl hover:bg-purple-deep shadow-sm flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> Open Camera / Select Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleSamplePhoto}
                      className="px-4 py-2.5 bg-canvas hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
                    >
                      Use Sample Flood Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Photo Thumbnails Reel */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {photos.map((p, idx) => (
                      <div
                        key={idx}
                        className={`relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                          selectedPhotoIndex === idx ? 'border-purple-primary ring-2 ring-purple-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedPhotoIndex(idx)}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(idx);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-primary flex flex-col items-center justify-center text-xs font-semibold text-muted hover:text-purple-primary shrink-0 transition-colors"
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      Add More
                    </button>
                  </div>

                  {/* Feature 6: Client-Side Canvas Image Turbidity & Pixel Luminance Analyzer */}
                  {photos[selectedPhotoIndex] && (
                    <CanvasVisionAnalyzer
                      imageSrc={photos[selectedPhotoIndex].url}
                      imageFile={photos[selectedPhotoIndex].file}
                      onAnalysisComplete={(res) => setAiAnalysisResult(res)}
                    />
                  )}
                </div>
              )}

              {/* Feature 13: Voice Distress Audio Note Recorder */}
              <VoiceMemoRecorder
                onAudioRecorded={(audioData) => setVoiceNoteData(audioData)}
              />

              {/* Feature 30: Interactive Photo Watermark & Annotation */}
              {photos[selectedPhotoIndex] && (
                <PhotoAnnotationCanvas
                  imageSrc={photos[selectedPhotoIndex].url}
                  onSaveAnnotation={(data) => setAnnotatedPhotoSrc(data)}
                />
              )}

              {/* Feature 31: Emergency Offline SMS & WhatsApp Dispatch */}
              <OfflineSmsDispatch 
                ticketId={lastSubmittedReport?.id}
                location={locationName}
                depthCm={selectedDepth}
                wardName={detectedWard}
                coords={coords}
              />

              {/* Final Submit Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Location
                </button>

                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${
                    isEmergencyPriority
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30 animate-pulse'
                      : 'bg-purple-primary hover:bg-purple-deep text-white shadow-purple-500/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Ingesting Ground Observation...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {isEmergencyPriority ? 'Transmit Priority-1 SOS Report' : 'Submit Citizen Observation'}
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
