import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, ShieldCheck, ShieldAlert, AlertTriangle, Activity, 
  Droplets, CloudRain, Radio, Video, Layers, Users, 
  CheckSquare, Waves, Train, Volume2, Zap, GlassWater, 
  Building2, History, ThumbsUp, Printer, Compass, 
  MapPin, Clock, Search, ExternalLink, ArrowRight, 
  CheckCircle2, XCircle, RefreshCw, AlertOctagon, PhoneCall,
  Info, Sparkles, Navigation, Send, Share2, Award, Download
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { WARDS_DATA, ROAD_SEGMENTS, HAZARDS_DATA } from '../../data/floodData';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

export default function CitizenFeaturesHub({ onOpenSOS, onOpenHazardReport }) {
  const { 
    currentWard, 
    selectedWardId, 
    setSelectedWardId, 
    currentTimeline, 
    timelineIndex,
    vehicleType,
    setVehicleType,
    clearanceThreshold,
    setClearanceThreshold,
    speakAlert,
    voiceLanguage,
    setVoiceLanguage
  } = useFlood();
  
  const { navigateTo } = useNavigation();

  // Active Tab State (5 Core Domains)
  const [activeTab, setActiveTab] = useState('mobility'); // 'mobility' | 'radar_cctv' | 'emergency' | 'civil_infra' | 'community'

  // ==========================================
  // FEATURE 1: WARD & NEIGHBORHOOD SEARCH
  // ==========================================
  const [wardSearchQuery, setWardSearchQuery] = useState('');
  const filteredWards = useMemo(() => {
    return WARDS_DATA.filter(w => 
      w.name.toLowerCase().includes(wardSearchQuery.toLowerCase())
    );
  }, [wardSearchQuery]);

  // ==========================================
  // FEATURE 2: VEHICLE CLEARANCE CALCULATOR
  // ==========================================
  const VEHICLE_SPECS = {
    pedestrian: { name: 'Pedestrian / Walking', clearance: 8, exhaustHeight: 25, alert: 'Walking through >15cm water is unsafe due to invisible open drains.' },
    twoWheeler: { name: 'Motorcycle / Scooter (Activa)', clearance: 13, exhaustHeight: 18, alert: 'Water >15cm will enter air filter / exhaust causing immediate engine kill.' },
    sedan: { name: 'Hatchback / Sedan (Honda City / Swift)', clearance: 16, exhaustHeight: 24, alert: 'Air intake is positioned low behind front bumper. Severe hydro-lock risk above 20cm.' },
    suv: { name: 'Compact SUV (Creta / Nexon)', clearance: 21, exhaustHeight: 32, alert: 'Higher wading clearance but beware of hidden bow waves from passing heavy trucks.' },
    thar: { name: '4x4 Offroader (Thar / Hilux)', clearance: 28, exhaustHeight: 45, alert: 'Excellent water wading up to 50cm. Verify bridge structural integrity before crossing.' },
    ev: { name: 'Electric Vehicle (Nexon EV / ZS EV)', clearance: 19, exhaustHeight: 999, alert: 'IP67 sealed battery pack prevents shock, but ECU controller will shut down if wading too long.' }
  };

  const selectedVehicleSpec = VEHICLE_SPECS[vehicleType] || VEHICLE_SPECS.sedan;
  const currentDepth = currentWard.currentWater;
  const clearanceMargin = selectedVehicleSpec.clearance - currentDepth;
  const isVehicleAtRisk = clearanceMargin < 0;

  // ==========================================
  // FEATURE 3: LIVE TIDE & SLUICE GATES
  // ==========================================
  const [tideSecondsLeft, setTideSecondsLeft] = useState(3840); // Countdown to 21:40 peak
  useEffect(() => {
    const t = setInterval(() => setTideSecondsLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const tideHours = Math.floor(tideSecondsLeft / 3600);
  const tideMins = Math.floor((tideSecondsLeft % 3600) / 60);

  const SLUICE_GATES = [
    { name: 'Love Grove (Worli)', status: 'CLOSED', flow: 'Zero Gravity Flow', reason: 'Tidal backflow prevention' },
    { name: 'Britannia Outfall (Reay Rd)', status: 'CLOSED', flow: '6 Pumps Discharging', reason: 'Pumps pushing 36,000 LPS' },
    { name: 'Cleave Land Bunder (Worli)', status: 'CLOSED', flow: 'Pumping active', reason: 'Sea elevation higher than drains' },
    { name: 'Haji Ali Outfall', status: 'PARTIAL', flow: '2 Gates Open', reason: 'Restricted high-tide flap' }
  ];

  // ==========================================
  // FEATURE 5: DOPPLER RADAR VIEWER
  // ==========================================
  const [radarLayer, setRadarLayer] = useState('reflectivity'); // 'reflectivity' | 'velocity' | 'echo_tops'
  const [isRadarSweeping, setIsRadarSweeping] = useState(true);

  // ==========================================
  // FEATURE 6: CCTV WATER-LEVEL SIMULATOR
  // ==========================================
  const CCTV_FEEDS = [
    { id: 'cctv-1', name: 'Milan Subway West Barrel (CCTV-K114)', depth: '38 cm', passability: 'NO PASSAGE', status: 'DANGER', lastSync: '12s ago', notes: 'Water level covers tire axle' },
    { id: 'cctv-2', name: 'Hindmata Flyover Under-Deck (CCTV-HM02)', depth: '29 cm', passability: 'HIGH CLEARANCE ONLY', status: 'CAUTION', lastSync: '4s ago', notes: 'Holding pond pumps at full throttle' },
    { id: 'cctv-3', name: 'Saki Naka Metro Pillar 41 (CCTV-SN41)', depth: '16 cm', passability: 'PASSABLE WITH CAUTION', status: 'MODERATE', lastSync: '8s ago', notes: 'Central median lane clear' },
    { id: 'cctv-4', name: 'L.B.S. Marg Kurla Depot (CCTV-L09)', depth: '24 cm', passability: 'BUSES & 4x4 ONLY', status: 'RESTRICTED', lastSync: '15s ago', notes: 'Severe curb runoff ponding' }
  ];
  const [activeCctvIndex, setActiveCctvIndex] = useState(0);

  // ==========================================
  // FEATURE 8: SHELTER SEARCH & DISTANCE
  // ==========================================
  const [shelterFilter, setShelterFilter] = useState('all');
  const filteredShelters = useMemo(() => {
    if (shelterFilter === 'all') return SAFE_PLACES_DATA;
    return SAFE_PLACES_DATA.filter(s => s.category.toLowerCase() === shelterFilter.toLowerCase());
  }, [shelterFilter]);

  // ==========================================
  // FEATURE 9: PUMP STATIONS TELEMETRY
  // ==========================================
  const PUMP_STATIONS = [
    { name: 'Britannia Dewatering Station', runningPumps: 6, totalPumps: 6, dischargeLps: 36000, sumpLevel: '3.4m', status: 'PEAK_DUTY' },
    { name: 'Irla Nullah Stormwater Pumps', runningPumps: 7, totalPumps: 8, dischargeLps: 42000, sumpLevel: '2.8m', status: 'OPTIMAL' },
    { name: 'Gazdarbandh Pumping Station', runningPumps: 5, totalPumps: 6, dischargeLps: 30000, sumpLevel: '3.1m', status: 'OPTIMAL' },
    { name: 'Haji Ali Outfall Pump Bay', runningPumps: 4, totalPumps: 4, dischargeLps: 24000, sumpLevel: '3.8m', status: 'PEAK_DUTY' }
  ];

  // ==========================================
  // FEATURE 10: FAMILY SAFETY RADAR
  // ==========================================
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Aarav (Son)', location: 'Bandra West (School)', status: 'SAFE', water: '4 cm', battery: '82%', lastPing: '4m ago' },
    { id: 2, name: 'Priya (Spouse)', location: 'BKC Business Complex', status: 'CAUTION', water: '19 cm', battery: '64%', lastPing: '8m ago' },
    { id: 3, name: 'Grandmother', location: 'Kurla West (Residence)', status: 'HIGH RISK', water: '28 cm', battery: '95%', lastPing: '1m ago' }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberLoc, setNewMemberLoc] = useState('');
  const [checkinRequested, setCheckinRequested] = useState(false);

  const addFamilyMember = (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    setFamilyMembers(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newMemberName,
        location: newMemberLoc || 'Mumbai Metro',
        status: 'SAFE',
        water: '8 cm',
        battery: '90%',
        lastPing: 'Just now'
      }
    ]);
    setNewMemberName('');
    setNewMemberLoc('');
  };

  const handleRequestCheckin = () => {
    setCheckinRequested(true);
    setTimeout(() => setCheckinRequested(false), 3000);
  };

  // ==========================================
  // FEATURE 11: DISASTER GO-BAG TRACKER (LOCALSTORAGE)
  // ==========================================
  const INITIAL_CHECKLIST = [
    { id: 'cb-1', label: '72-Hour Clean Drinking Water (3L / person)', checked: true },
    { id: 'cb-2', label: 'High-Capacity Power Bank charged to 100%', checked: true },
    { id: 'cb-3', label: 'Waterproof pouch with Aadhaar, PAN & Property deeds', checked: false },
    { id: 'cb-4', label: 'Emergency LED Flashlight + Extra AA Batteries', checked: true },
    { id: 'cb-5', label: 'Essential Prescription Medicines (7-day stock) & ORS', checked: false },
    { id: 'cb-6', label: 'Loud Emergency Distress Whistle (Acoustic backup)', checked: true },
    { id: 'cb-7', label: 'Dry High-Energy Rations (Chana, Dates, Energy Bars)', checked: false }
  ];

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('mumbai_flood_gobag');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const toggleChecklistItem = (id) => {
    setChecklist(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      localStorage.setItem('mumbai_flood_gobag', JSON.stringify(updated));
      return updated;
    });
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const goBagPercent = Math.round((completedCount / checklist.length) * 100);

  // ==========================================
  // FEATURE 12: CHOKED CULVERT & DRAINAGE MONITOR
  // ==========================================
  const CULVERTS = [
    { name: 'Mithi River Outfall — Mahim Creek', siltLevel: '34% (Safe)', velocity: '1.4 m/s', trashStatus: 'CLEAR', risk: 'LOW' },
    { name: 'Chamdewali Nullah — Kurla Cross', siltLevel: '78% (High)', velocity: '0.4 m/s', trashStatus: 'CLOGGED TRASH RACK', risk: 'CRITICAL' },
    { name: 'Poisar River Culvert — Kandivali', siltLevel: '45% (Moderate)', velocity: '0.9 m/s', trashStatus: 'CLEAR', risk: 'MODERATE' },
    { name: 'Oshiwara River Tidal Flap', siltLevel: '52% (Moderate)', velocity: '0.7 m/s', trashStatus: 'DEBRIS ACCUMULATION', risk: 'HIGH' }
  ];

  // ==========================================
  // FEATURE 13: PUBLIC TRANSIT & SUBURBAN RAIL
  // ==========================================
  const TRANSIT_LINES = [
    { mode: 'Western Railway', line: 'Churchgate – Virar', status: 'NORMAL', delay: '5-7 min', note: 'Fast & slow corridors operating smoothly. No water on tracks.' },
    { mode: 'Central Railway', line: 'CSMT – Kalyan / Thane', status: 'DELAYED', delay: '15-20 min', note: 'Water accumulation near tracks at Sion & Kurla station slow tracks.' },
    { mode: 'Harbour Line', line: 'CSMT – Panvel', status: 'RESTRICTED', delay: '25 min', note: 'Services running at restricted speed between Wadala and Chunabhatti.' },
    { mode: 'Metro Line 1', line: 'Versova – Ghatkopar', status: 'NORMAL', delay: 'ON TIME', note: 'Elevated guideway 100% weather resilient. Normal peak frequency.' },
    { mode: 'BEST Buses', line: 'Citywide Network', status: 'DIVERTED', delay: 'Var. routes', note: 'Routes 201, 202, 332 diverted away from Milan & Andheri Subways.' }
  ];

  // ==========================================
  // FEATURE 14: AUDIO VOICE SIREN & MULTI-LANGUAGE TEST
  // ==========================================
  const [testSpeechLang, setTestSpeechLang] = useState('en');
  const [speechPitch, setSpeechPitch] = useState(1);
  const handleTestVoiceBroadcast = () => {
    let message = '';
    if (testSpeechLang === 'hi') {
      message = `सावधान! ${currentWard.name} में बाढ़ का स्तर ${currentWard.currentWater} सेंटीमीटर पहुंच गया है। कृपया सबवे और निचले मार्गों से दूर रहें।`;
    } else if (testSpeechLang === 'mr') {
      message = `सतर्कता इशारा! ${currentWard.name} येथे पाण्याचा स्तर ${currentWard.currentWater} सेमी झाला आहे. सखल भागातील रस्त्यांवर जाणे टाळा.`;
    } else {
      message = `Attention Mumbai Citizens. Water inundation in ${currentWard.name} has reached ${currentWard.currentWater} centimeters. Please avoid subways and low elevation roads.`;
    }
    speakAlert(message);
  };

  // ==========================================
  // FEATURE 15: ELECTRICITY GRID & SUBSTATION SAFETY
  // ==========================================
  const SUBSTATIONS = [
    { name: 'Tata Power Kurla Distribution Hub', voltage: '33 kV', status: 'ENERGIZED', waterInCompound: '12 cm', dangerLevel: 'SAFE' },
    { name: 'Adani D.N. Nagar Feeder Station', voltage: '11 kV', status: 'ISOLATED FOR SAFETY', waterInCompound: '38 cm', dangerLevel: 'DE-ENERGIZED' },
    { name: 'BEST Colaba Main Receiving Stn', voltage: '110 kV', status: 'ENERGIZED', waterInCompound: '0 cm', dangerLevel: 'SAFE' },
    { name: 'Bandra Reclamation Feeder Pillar #4', voltage: '415 V', status: 'TRIPPED', waterInCompound: '32 cm', dangerLevel: 'STEP POTENTIAL RISK' }
  ];

  // ==========================================
  // FEATURE 16: DRINKING WATER CONTAMINATION METER
  // ==========================================
  const [waterTestedPurity, setWaterTestedPurity] = useState('WARNING');
  const potabilityData = {
    status: 'BOIL WATER ADVISORY IN EFFECT',
    reason: 'Negative hydraulic suction in submerged distribution pipelines may introduce curb runoff.',
    recommendedBoilTime: '20 minutes rolling boil',
    chlorineDose: '1 tablet (0.5g chlorine) per 20 Liters of water'
  };

  // ==========================================
  // FEATURE 17: BASEMENT SUMP BACKFLOW RISK
  // ==========================================
  const [basementLevel, setBasementLevel] = useState('-1'); // '-1' | '-2'
  const [sumpPumpHp, setSumpPumpHp] = useState('5'); // HP
  const basementRiskFactor = useMemo(() => {
    const depth = currentWard.currentWater;
    if (basementLevel === '-2' && depth > 15) return { level: 'SEVERE', text: 'Hydrostatic pressure will overpower gravity non-return valves. Active flooding imminent without secondary generator pump.' };
    if (depth > 20) return { level: 'HIGH', text: 'Basement entry ramp threshold breached. Seal driveway barrier gates immediately.' };
    return { level: 'MODERATE', text: 'Ensure drainage sumps are clear of sediment and backup generator is tested.' };
  }, [basementLevel, currentWard.currentWater]);

  // ==========================================
  // FEATURE 18: HISTORICAL CLOUDBURST COMPARISON
  // ==========================================
  const HISTORICAL_STORMS = [
    { event: '26 July 2005 Deluge', rain24h: '944 mm', peakRate: '190 mm/h', mithiLevel: '5.2m (Flooded)', outcome: 'Citywide paralysis. Mithi River burst banks.' },
    { event: '29 August 2017 Storm', rain24h: '315 mm', peakRate: '85 mm/h', mithiLevel: '3.8m (Warning)', outcome: 'Subways submerged, train lines stalled 12h.' },
    { event: '23 September 2020 Surge', rain24h: '286 mm', peakRate: '72 mm/h', mithiLevel: '3.4m (High)', outcome: 'South Mumbai coastal flooding & Nair hospital inundation.' },
    { event: 'Today (Live Scenario)', rain24h: '142 mm', peakRate: `${currentWard.rainRate} mm/h`, mithiLevel: '2.8m (Controlled)', outcome: 'High-tide coincidence occurring. Dewatering pumps holding line.' }
  ];

  // ==========================================
  // FEATURE 19: CROWD WATER DEPTH GAUGE & UPVOTES
  // ==========================================
  const [crowdReports, setCrowdReports] = useState([
    { id: 'cr-1', location: 'Outside Kurla West Station (Platform 1 gate)', depth: 35, reporter: 'Citizen Scout Vikram', upvotes: 24, hasUpvoted: false, time: '3 min ago' },
    { id: 'cr-2', location: 'Milan Subway South Approach Rd', depth: 40, reporter: 'Auto Driver Ramesh', upvotes: 42, hasUpvoted: true, time: '8 min ago' },
    { id: 'cr-3', location: 'Saki Vihar Road near Ansa Estate', depth: 18, reporter: 'Engineer Sneha', upvotes: 15, hasUpvoted: false, time: '14 min ago' }
  ]);

  const toggleCrowdUpvote = (id) => {
    setCrowdReports(prev => prev.map(cr => {
      if (cr.id === id) {
        return {
          ...cr,
          hasUpvoted: !cr.hasUpvoted,
          upvotes: cr.hasUpvoted ? cr.upvotes - 1 : cr.upvotes + 1
        };
      }
      return cr;
    }));
  };

  // ==========================================
  // FEATURE 20: EXPORT / PRINT ACTION SHEET
  // ==========================================
  const handlePrintActionSheet = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-purple-deep via-purple-primary to-purple-deep text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-mono font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CITIZEN FLOOD INTELLIGENCE SUITE • 20 INTERACTIVE CAPABILITIES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Metropolitan Flood Control & Citizen Life-Safety Hub
            </h2>
            <p className="text-xs text-white/80 max-w-2xl">
              Equipping Mumbai residents with actionable engineering telemetry, vehicle clearance physics, live radar feeds, and emergency life-support tools.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintActionSheet}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold font-mono flex items-center gap-1.5 backdrop-blur-sm transition border border-white/20"
              title="Print Emergency Action Sheet"
            >
              <Printer className="w-4 h-4" />
              <span>Print Action Sheet</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition animate-pulse"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS Panic Flash</span>
            </button>
          </div>
        </div>

        {/* 5 Domain Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-2 border-t border-white/15 text-xs font-semibold scrollbar-none">
          {[
            { id: 'mobility', label: '1. Mobility & Inundation Calculators', icon: Car },
            { id: 'radar_cctv', label: '2. Doppler Radar, CCTV & Civil Sensors', icon: Video },
            { id: 'emergency', label: '3. Emergency, Family & Life-Safety', icon: Users },
            { id: 'civil_infra', label: '4. Infrastructure, Power & Water', icon: Zap },
            { id: 'community', label: '5. Community Truth & Deluge History', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  isTabActive 
                    ? 'bg-white text-purple-deep font-bold shadow-md' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Workspace Content */}
      <div className="p-6">
        
        {/* ========================================================
            TAB 1: MOBILITY & INUNDATION CALCULATORS
            ======================================================== */}
        {activeTab === 'mobility' && (
          <div className="space-y-6">
            
            {/* FEATURE 1: Ward & Neighborhood Quick-Risk Switcher */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 1 • HYPERLOCAL RE-CALCULATION
                  </span>
                  <h3 className="font-bold text-ink text-base">Ward & Neighborhood Quick-Risk Switcher</h3>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={wardSearchQuery}
                    onChange={(e) => setWardSearchQuery(e.target.value)}
                    placeholder="Search 24 Mumbai Wards..."
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-primary"
                  />
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {filteredWards.map(w => {
                  const isSelected = selectedWardId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWardId(w.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-purple-primary text-white border-purple-primary shadow-xs' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{w.name.split('—')[0]}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        w.risk === 'CRITICAL' ? 'bg-red-500 text-white' : w.risk === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {w.currentWater}cm
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEATURE 2: Vehicle Inundation & Hydro-Lock Margin Calculator */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 2 • ENGINE PROTECTION PHYSICS
                  </span>
                  <h3 className="font-bold text-ink text-base">Vehicle Ground Clearance & Hydro-Lock Calculator</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  isVehicleAtRisk ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {isVehicleAtRisk ? 'HYDRO-LOCK DANGER' : 'SAFE CLEARANCE MARGIN'}
                </span>
              </div>

              {/* Vehicle Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                {Object.entries(VEHICLE_SPECS).map(([key, spec]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setVehicleType(key);
                      setClearanceThreshold(spec.clearance);
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      vehicleType === key 
                        ? 'bg-purple-soft border-purple-primary ring-2 ring-purple-primary/30 text-purple-deep' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{spec.name.split(' ')[0]}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Clearance: {spec.clearance}cm</div>
                  </button>
                ))}
              </div>

              {/* Clearance Comparison Gauge */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-mono">SELECTED VEHICLE</div>
                  <div className="font-bold text-ink text-sm">{selectedVehicleSpec.name}</div>
                  <div className="text-xs font-mono text-purple-primary">Max Safe Wading: {selectedVehicleSpec.clearance} cm</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-mono">CURRENT WARD WATER LEVEL</div>
                  <div className="text-2xl font-extrabold font-mono text-ink">{currentDepth} cm</div>
                  <div className="text-xs font-mono text-slate-500">Peak expected: {currentWard.peakWater} cm</div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-mono font-semibold ${
                  isVehicleAtRisk ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <div className="font-bold text-sm mb-0.5">
                    {isVehicleAtRisk ? `Water Exceeds Clearance by ${Math.abs(clearanceMargin)} cm` : `+${clearanceMargin} cm Safety Margin Remaining`}
                  </div>
                  <div>{selectedVehicleSpec.alert}</div>
                </div>
              </div>
            </div>

            {/* FEATURE 13: Public Transit & Suburban Rail Waterlogging Disruptions */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 13 • METRO & SUBURBAN TRANSIT
                  </span>
                  <h3 className="font-bold text-ink text-base">Suburban Rail, Metro & BEST Bus Water Disruption Board</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Live Traffic Control Sync</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TRANSIT_LINES.map((line, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Train className="w-3.5 h-3.5 text-purple-primary" /> {line.mode} ({line.line})
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        line.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : line.status === 'DIVERTED' ? 'bg-purple-soft text-purple-deep' : 'bg-red-100 text-red-800'
                      }`}>
                        {line.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">{line.note}</div>
                    <div className="text-[10px] font-mono text-slate-400 pt-1">Delay Estimate: {line.delay}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 17: Basement & Ground-Floor Sump Backflow Risk Forecaster */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 17 • BUILDING & RESIDENTIAL SAFETY
                  </span>
                  <h3 className="font-bold text-ink text-base">Basement Parking & Sump Backflow Hydraulic Forecaster</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 block mb-1">Basement Elevation</label>
                  <select 
                    value={basementLevel}
                    onChange={(e) => setBasementLevel(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white border border-slate-200 font-semibold"
                  >
                    <option value="-1">Lower Ground (-1 Level, -3.0m)</option>
                    <option value="-2">Sub-Basement (-2 Level, -6.5m)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 block mb-1">Dewatering Pump Capacity</label>
                  <select 
                    value={sumpPumpHp}
                    onChange={(e) => setSumpPumpHp(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white border border-slate-200 font-semibold"
                  >
                    <option value="2">2 HP (Domestic Sump)</option>
                    <option value="5">5 HP (Commercial Duty)</option>
                    <option value="15">15 HP (High-Volume Submersible)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 block mb-1">Check Valve Rating</label>
                  <div className="text-xs p-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-700">
                    Dual Cast-Iron Flap (1.5 Bar)
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
                basementRiskFactor.level === 'SEVERE' ? 'bg-red-50 border-red-300 text-red-900' : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>Basement Risk Status: {basementRiskFactor.level}</span>
                </div>
                <p>{basementRiskFactor.text}</p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: RADAR, CCTV & CIVIL SENSORS
            ======================================================== */}
        {activeTab === 'radar_cctv' && (
          <div className="space-y-6">

            {/* FEATURE 3: Live Tide & Storm Surge Synchronizer */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 3 • ARABIAN SEA HYDROLOGY
                  </span>
                  <h3 className="font-bold text-ink text-base">Live Arabian Sea Tide & Flood Sluice Gate Status</h3>
                </div>

                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs">
                  <span className="text-slate-500">TIDE PEAK IN:</span>
                  <span className="font-extrabold text-red-600">{tideHours}h {tideMins}m</span>
                  <span className="text-slate-400">@ 21:40 IST (4.18m)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SLUICE_GATES.map((gate, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{gate.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        gate.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {gate.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-purple-primary font-semibold">{gate.flow}</div>
                    <div className="text-[11px] text-slate-500">{gate.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 5: Hyperlocal Doppler Radar Scan Viewer */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 5 • METEOROLOGICAL RADAR
                  </span>
                  <h3 className="font-bold text-ink text-base">Doppler Weather Radar (Santacruz S-Band) Live Scan</h3>
                </div>

                <div className="flex items-center gap-2">
                  {['reflectivity', 'velocity', 'echo_tops'].map(layer => (
                    <button
                      key={layer}
                      onClick={() => setRadarLayer(layer)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition ${
                        radarLayer === layer ? 'bg-purple-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {layer.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Radar Visualizer Screen */}
              <div className="relative bg-slate-900 rounded-2xl p-6 text-white overflow-hidden h-64 flex flex-col justify-between border border-slate-800">
                {/* Radar Grid Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-56 h-56 rounded-full border border-emerald-400" />
                  <div className="w-40 h-40 rounded-full border border-emerald-400 absolute" />
                  <div className="w-24 h-24 rounded-full border border-emerald-400 absolute" />
                  <div className="w-full h-[1px] bg-emerald-400 absolute" />
                  <div className="h-full w-[1px] bg-emerald-400 absolute" />
                </div>

                {/* Sweep Animation */}
                {isRadarSweeping && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent animate-spin origin-center" style={{ animationDuration: '4s' }} />
                  </div>
                )}

                {/* Simulated Convective Cells */}
                <div className="absolute top-16 left-28 w-20 h-16 rounded-full bg-red-600/60 blur-md animate-pulse" />
                <div className="absolute top-24 left-36 w-28 h-20 rounded-full bg-amber-500/50 blur-lg" />
                <div className="absolute top-12 left-20 w-36 h-28 rounded-full bg-emerald-500/30 blur-xl" />

                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Radio className="w-4 h-4 animate-pulse" />
                    S-BAND AZIMUTH 240° • 10-MIN VOLUME SCAN
                  </span>
                  <span className="text-slate-400">Peak Echo: 54 dBZ (Kurla-Kalina cell)</span>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div className="text-xs font-mono space-y-1">
                    <div className="text-slate-400">Cloud-Top Height: <strong className="text-white">11.8 km</strong></div>
                    <div className="text-slate-400">Precipitation Core: <strong className="text-amber-400">44 mm/h</strong></div>
                  </div>

                  {/* dBZ Color Bar */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-slate-400">Reflectivity Scale (dBZ)</span>
                    <div className="flex h-3 w-40 rounded overflow-hidden">
                      <div className="flex-1 bg-blue-600" title="15 dBZ" />
                      <div className="flex-1 bg-emerald-500" title="25 dBZ" />
                      <div className="flex-1 bg-yellow-400" title="35 dBZ" />
                      <div className="flex-1 bg-amber-500" title="45 dBZ" />
                      <div className="flex-1 bg-red-600" title="55 dBZ" />
                      <div className="flex-1 bg-purple-600" title="65 dBZ" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURE 6: CCTV Water-Level Camera Feed Simulator */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 6 • COMPUTER VISION VERIFICATION
                  </span>
                  <h3 className="font-bold text-ink text-base">Real-Time CCTV Water-Level AI Feeds</h3>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> 4 Cameras Online
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Feeds Selector List */}
                <div className="space-y-2">
                  {CCTV_FEEDS.map((feed, idx) => (
                    <button
                      key={feed.id}
                      onClick={() => setActiveCctvIndex(idx)}
                      className={`w-full p-2.5 rounded-xl border text-left transition ${
                        activeCctvIndex === idx 
                          ? 'bg-purple-soft border-purple-primary text-purple-deep shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{feed.name.split('(')[0]}</div>
                      <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                        <span className="text-red-600 font-bold">Water: {feed.depth}</span>
                        <span className="text-slate-400">{feed.lastSync}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active CCTV Screen */}
                <div className="md:col-span-3 bg-slate-900 rounded-2xl p-4 text-white relative min-h-[220px] flex flex-col justify-between border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-red-500 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      LIVE FEED • {CCTV_FEEDS[activeCctvIndex].name}
                    </span>
                    <span className="text-slate-400">FPS: 25 • AI Latency: 42ms</span>
                  </div>

                  {/* Synthetic AI Bounding Box Overlay */}
                  <div className="my-auto py-6 flex flex-col items-center justify-center">
                    <div className="border-2 border-red-500 bg-red-500/10 p-4 rounded-xl text-center max-w-sm">
                      <span className="text-[10px] font-mono uppercase bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                        AI WATER BOUNDING BOX DETECTED
                      </span>
                      <div className="text-3xl font-extrabold font-mono text-white mt-2">
                        {CCTV_FEEDS[activeCctvIndex].depth}
                      </div>
                      <div className="text-xs font-mono text-red-300 mt-1">
                        VERDICT: {CCTV_FEEDS[activeCctvIndex].passability}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        {CCTV_FEEDS[activeCctvIndex].notes}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                    <span>Edge Device: Jetson Orin AGX #04</span>
                    <span>Status: {CCTV_FEEDS[activeCctvIndex].status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURE 9: Dewatering Pump Stations & Sluice Gate Monitor */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 9 • CIVIL ENGINEERING ASSETS
                  </span>
                  <h3 className="font-bold text-ink text-base">Major Stormwater Dewatering Pump Stations</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PUMP_STATIONS.map((ps, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{ps.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {ps.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[9px] text-slate-400 block">Duty Pumps</span>
                        <span className="font-bold text-ink">{ps.runningPumps} / {ps.totalPumps} Active</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[9px] text-slate-400 block">Discharge Rate</span>
                        <span className="font-bold text-purple-primary">{(ps.dischargeLps / 1000).toFixed(0)}k LPS</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[9px] text-slate-400 block">Wet Sump</span>
                        <span className="font-bold text-red-600">{ps.sumpLevel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: EMERGENCY, FAMILY & LIFE-SAFETY
            ======================================================== */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">

            {/* FEATURE 4: 1-Click SOS Trigger */}
            <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold block">
                  FEATURE 4 • DISTRESS SIGNAL BEACON
                </span>
                <h3 className="font-extrabold text-ink text-base">Instant Emergency Life-Safety Distress Mode</h3>
                <p className="text-xs text-slate-600">
                  Broadcasts GPS distress beacon, triggers 880Hz acoustic disaster siren, and generates ready WhatsApp/SMS packets for Disaster Room 1916.
                </p>
              </div>

              <button
                onClick={onOpenSOS}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 transition shrink-0 animate-bounce"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Launch SOS Console</span>
              </button>
            </div>

            {/* FEATURE 8: Safe Haven & Evacuation Center Quick Finder */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 8 • HIGH-GROUND HAVENS
                  </span>
                  <h3 className="font-bold text-ink text-base">Vetted Evacuation Shelters & Relief Camps</h3>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'shelter', 'hospital'].map(f => (
                    <button
                      key={f}
                      onClick={() => setShelterFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition ${
                        shelterFilter === f ? 'bg-purple-primary text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredShelters.slice(0, 4).map(shelter => (
                  <div key={shelter.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-ink">{shelter.name}</h4>
                        <span className="text-[11px] font-mono text-purple-primary">{shelter.elevation} • {shelter.distance} away</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {shelter.availableCapacity} / {shelter.totalCapacity} Available
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {shelter.corridorNotes || shelter.safeRouteInfo}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                      <span className="text-slate-500">Power: <strong className="text-ink">{shelter.generatorBackup ? 'Generator 100%' : 'Standard'}</strong></span>
                      <a href={`tel:${shelter.phone}`} className="text-purple-primary font-bold hover:underline">
                        Call {shelter.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 10: Family & Loved Ones Safety Radar Ping */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 10 • FAMILY RADAR
                  </span>
                  <h3 className="font-bold text-ink text-base">Family Safety Circle & Geofence Monitor</h3>
                </div>

                <button
                  onClick={handleRequestCheckin}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                    checkinRequested 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-purple-primary hover:bg-purple-deep text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{checkinRequested ? 'Check-in Sent to All!' : 'Ping Safety Check-in'}</span>
                </button>
              </div>

              {/* Family Members List */}
              <div className="space-y-2 mb-4">
                {familyMembers.map(member => (
                  <div key={member.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple-deep font-bold flex items-center justify-center text-xs">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-ink">{member.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{member.location} • Battery: {member.battery}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        member.status === 'SAFE' ? 'bg-emerald-100 text-emerald-800' : member.status === 'CAUTION' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status} ({member.water})
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">Updated {member.lastPing}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Member Mini Form */}
              <form onSubmit={addFamilyMember} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMemberName} 
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Family Member Name..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-primary"
                />
                <input 
                  type="text" 
                  value={newMemberLoc} 
                  onChange={(e) => setNewMemberLoc(e.target.value)}
                  placeholder="Location (e.g., Dadar)..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-primary text-white text-xs font-bold rounded-xl hover:bg-purple-deep transition"
                >
                  Add Member
                </button>
              </form>
            </div>

            {/* FEATURE 11: Offline Disaster Preparedness Checklist & Go-Bag Tracker */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 11 • SURVIVAL READINESS (OFFLINE CACHED)
                  </span>
                  <h3 className="font-bold text-ink text-base">72-Hour Flood Survival Go-Bag Tracker</h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-primary bg-purple-soft px-2.5 py-1 rounded-full">
                  {goBagPercent}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-purple-primary to-emerald-500 transition-all duration-500"
                  style={{ width: `${goBagPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      item.checked ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {item.checked && <CheckSquare className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium leading-snug">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: CIVIL INFRASTRUCTURE & UTILITIES
            ======================================================== */}
        {activeTab === 'civil_infra' && (
          <div className="space-y-6">

            {/* FEATURE 12: Micro-Drainage & Choked Culvert Watchlist */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 12 • STORM DRAIN HYDRAULICS
                  </span>
                  <h3 className="font-bold text-ink text-base">Micro-Drainage & Chronic Choked Culvert Watchlist</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CULVERTS.map((culvert, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{culvert.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        culvert.risk === 'LOW' ? 'bg-emerald-100 text-emerald-800' : culvert.risk === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {culvert.risk} RISK
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      Siltation: <strong>{culvert.siltLevel}</strong> • Outfall Velocity: <strong>{culvert.velocity}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-0.5">Trash Rack: {culvert.trashStatus}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 15: Electricity Grid & Substation Hazard Map */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 15 • ELECTRICAL SAFETY
                  </span>
                  <h3 className="font-bold text-ink text-base">Power Substation Submergence & Feeder De-Energization Grid</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUBSTATIONS.map((sub, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{sub.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        sub.dangerLevel === 'SAFE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.dangerLevel}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-purple-primary">Rating: {sub.voltage} • Grid: {sub.status}</div>
                    <div className="text-[11px] text-slate-500">Compound Water: {sub.waterInCompound}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 16: Drinking Water Contamination Meter */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 16 • PUBLIC HEALTH & POTABILITY
                  </span>
                  <h3 className="font-bold text-ink text-base">Municipal Drinking Water Ingress & Boil Advisory</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {potabilityData.status}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Risk Assessment: </strong>{potabilityData.reason}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">Disinfection Protocol</span>
                    <span className="font-bold text-ink">{potabilityData.recommendedBoilTime}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">Emergency Chlorine Dosing</span>
                    <span className="font-bold text-emerald-700">{potabilityData.chlorineDose}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURE 14: Audio Voice Siren & Multi-Language Broadcast Test */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 14 • CITIZEN ACCESSIBILITY (TTS)
                  </span>
                  <h3 className="font-bold text-ink text-base">Emergency Voice Siren & Multi-Language Broadcast Test</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono font-bold">
                  {['en', 'hi', 'mr'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setTestSpeechLang(lang)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        testSpeechLang === lang ? 'bg-purple-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : 'मराठी (Marathi)'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleTestVoiceBroadcast}
                  className="px-4 py-2 bg-purple-primary text-white text-xs font-bold rounded-xl hover:bg-purple-deep transition flex items-center gap-1.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Synthesize Live Spoken Directive</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: COMMUNITY TRUTH & DELUGE HISTORY
            ======================================================== */}
        {activeTab === 'community' && (
          <div className="space-y-6">

            {/* FEATURE 7: Citizen Street Hazard Quick-Report */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                  FEATURE 7 • CROWDSOURCE HAZARD
                </span>
                <h3 className="font-bold text-ink text-base">Report Water Hazard with Instant AI Depth Estimation</h3>
                <p className="text-xs text-slate-600">
                  Tag fallen power cables, dislodged manholes, and stalled cars with photographic proof.
                </p>
              </div>

              <button
                onClick={onOpenHazardReport}
                className="px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit Street Hazard</span>
              </button>
            </div>

            {/* FEATURE 19: Community Water Depth Crowd-Gauge */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 19 • GROUND TRUTH VERIFICATION
                  </span>
                  <h3 className="font-bold text-ink text-base">Community Depth Crowd-Gauge & Upvote Consensus</h3>
                </div>
              </div>

              <div className="space-y-2">
                {crowdReports.map(cr => (
                  <div key={cr.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-ink">{cr.location}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Depth: <strong className="text-red-600">{cr.depth} cm</strong> • Logged by {cr.reporter} ({cr.time})
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCrowdUpvote(cr.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                        cr.hasUpvoted ? 'bg-purple-primary text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{cr.upvotes} Confirmations</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 18: Historical Cloudburst Scenario Simulator */}
            <div className="bg-canvas p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                    FEATURE 18 • DELUGE HISTORICAL BENCHMARK
                  </span>
                  <h3 className="font-bold text-ink text-base">Historical Cloudburst Benchmarking (2005 vs 2017 vs Today)</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HISTORICAL_STORMS.map((storm, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{storm.event}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-soft text-purple-deep">
                        Peak {storm.peakRate}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      24h Total: <strong>{storm.rain24h}</strong> • Mithi Gauge: <strong>{storm.mithiLevel}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-0.5">{storm.outcome}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 20: Export / Print Emergency Action Sheet */}
            <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-primary font-bold block">
                  FEATURE 20 • OFFLINE PHYSICAL SURVIVAL
                </span>
                <h3 className="font-bold text-ink text-base">Export / Print Emergency Ward Action Sheet</h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Outputs clean printable document with active shelter phone desk contacts, safe route high points, water potability rules, and BMC Ward Control direct lines for zero-battery power cuts.
                </p>
              </div>

              <button
                onClick={handlePrintActionSheet}
                className="px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold transition shadow-sm flex items-center gap-2 shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>Print Action Sheet</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

