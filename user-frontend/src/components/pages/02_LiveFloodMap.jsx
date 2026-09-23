import React, { useState, useMemo, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import InteractiveMapCanvas from '../shared/InteractiveMapCanvas';
import ForecastTimeline from '../shared/ForecastTimeline';
import StreetRiskStrip from '../shared/StreetRiskStrip';
import { 
  Search, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight, 
  Car, 
  Bike, 
  Truck, 
  Footprints,
  Compass,
  ArrowRight,
  Video,
  Droplets,
  Waves,
  Radio,
  Activity,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Printer,
  Crosshair,
  Ruler,
  CheckCircle2,
  X,
  Download,
  ShieldCheck,
  Clock,
  Sliders,
  PhoneCall,
  Camera,
  Play,
  RotateCcw,
  CloudRain
} from 'lucide-react';
import { 
  ROAD_SEGMENTS, 
  WARDS_DATA, 
  HAZARDS_DATA, 
  CCTV_CAMERAS_DATA, 
  PUMPING_STATIONS_DATA, 
  TIDE_TELEMETRY_DATA, 
  ELEVATION_PROFILES_DATA, 
  COMMUNITY_MAP_PINS, 
  VEHICLE_PROFILES 
} from '../../data/floodData';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

export default function LiveFloodMap() {
  const { 
    currentWard, 
    selectedWardId, 
    setSelectedWardId, 
    currentTimeline, 
    timelineIndex,
    speakAlert,
    voiceLanguage,
    setVoiceLanguage,
    isVoiceEnabled,
    setIsVoiceEnabled
  } = useFlood();
  const { navigateTo } = useNavigation();

  // Selected road & focused map target
  const [selectedRoadId, setSelectedRoadId] = useState('rd-milan');
  const [focusTarget, setFocusTarget] = useState(null);

  // Search & Autocomplete
  const [localSearch, setLocalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Feature 4: Dynamic Water Depth Scrubber (+0 to +50 cm)
  const [depthSurcharge, setDepthSurcharge] = useState(0);

  // Feature 5: Vehicle Selection Simulator
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');

  // Feature 6: CCTV Stream Modal
  const [activeCctv, setActiveCctv] = useState(null);
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  const [isSnapshotCaptured, setIsSnapshotCaptured] = useState(false);

  // Feature 10: Interactive Map Pin Dropper Modal
  const [isPinDropperMode, setIsPinDropperMode] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('WATERLOGGING');
  const [reportDepth, setReportDepth] = useState('25');
  const [communityPinsList, setCommunityPinsList] = useState(COMMUNITY_MAP_PINS);

  // Feature 11: Distance Measurement Tool
  const [isMeasuringMode, setIsMeasuringMode] = useState(false);
  const [measuredKm, setMeasuredKm] = useState(0);

  // Feature 12: Safe Corridor Overlay Target
  const [safeCorridorTarget, setSafeCorridorTarget] = useState(null);

  // Feature 13: Doppler Precipitation Radar
  const [isDopplerActive, setIsDopplerActive] = useState(false);

  // Feature 14: Elevation Contour DEM Drawer
  const [isElevationDrawerOpen, setIsElevationDrawerOpen] = useState(false);

  // Feature 16: Emergency SOS Callout Modal
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosCopied, setSosCopied] = useState(false);

  // Feature 18: Saved Citizen Bookmarks
  const [savedBookmarks, setSavedBookmarks] = useState([
    { id: 'bm-1', label: 'My Residence (Bandra 14th Rd)', type: 'HOME', roadId: 'rd-perry', isSafe: true },
    { id: 'bm-2', label: 'Office Tower (BKC G-Block)', type: 'WORK', roadId: 'rd-bkc-connector', isSafe: true },
    { id: 'bm-3', label: 'Child School (Matunga)', type: 'SCHOOL', roadId: 'rd-ambedkar', isSafe: false }
  ]);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);

  // Feature 19: Offline Situation Report Exporter
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Resolve current active road
  const selectedRoad = useMemo(() => {
    return ROAD_SEGMENTS.find(r => r.id === selectedRoadId || r.legacyId === selectedRoadId) || ROAD_SEGMENTS[0];
  }, [selectedRoadId]);

  // Recalculated road depth with slider surcharge
  const dynamicRoadDepth = Math.max(0, selectedRoad.currentDepth + depthSurcharge);
  const vehicleConfig = VEHICLE_PROFILES[selectedVehicle] || VEHICLE_PROFILES.sedan;
  const isRoadPassableForVehicle = dynamicRoadDepth <= vehicleConfig.clearanceCm;

  // Search Autocomplete Index
  const searchResults = useMemo(() => {
    if (!localSearch.trim()) return [];
    const q = localSearch.toLowerCase();
    const list = [];

    // Search Roads
    ROAD_SEGMENTS.forEach(r => {
      if (r.name.toLowerCase().includes(q) || r.ward.toLowerCase().includes(q)) {
        list.push({ type: 'ROAD', item: r, title: r.name, sub: `${r.ward} • ${r.status} (${r.currentDepth}cm)` });
      }
    });

    // Search Wards
    WARDS_DATA.forEach(w => {
      if (w.name.toLowerCase().includes(q)) {
        list.push({ type: 'WARD', item: w, title: w.name, sub: `Risk: ${w.risk} • Mean: ${w.currentWater}cm` });
      }
    });

    // Search Havens
    SAFE_PLACES_DATA.forEach(sp => {
      if (sp.name.toLowerCase().includes(q) || sp.categoryLabel.toLowerCase().includes(q)) {
        list.push({ type: 'HAVEN', item: sp, title: sp.name, sub: `${sp.categoryLabel} • Elevation: ${sp.elevation}` });
      }
    });

    // Search CCTVs
    CCTV_CAMERAS_DATA.forEach(cam => {
      if (cam.name.toLowerCase().includes(q) || cam.camCode.toLowerCase().includes(q)) {
        list.push({ type: 'CCTV', item: cam, title: `${cam.camCode}: ${cam.name}`, sub: `Water: ${cam.waterLevelCm}cm • ${cam.ward}` });
      }
    });

    // Search Hazards
    HAZARDS_DATA.forEach(h => {
      if (h.title.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)) {
        list.push({ type: 'HAZARD', item: h, title: h.title, sub: `${h.location} • ${h.severity}` });
      }
    });

    return list.slice(0, 7);
  }, [localSearch]);

  // Handle Search item click
  const handleSelectSearchResult = (result) => {
    setLocalSearch(result.title);
    setIsSearchFocused(false);

    if (result.type === 'ROAD') {
      setSelectedRoadId(result.item.id);
      setFocusTarget({ lat: result.item.coordinates.lat, lng: result.item.coordinates.lng, zoom: 14.8 });
    } else if (result.type === 'WARD') {
      setSelectedWardId(result.item.id);
      setFocusTarget({ lat: result.item.defaultCenter.lat, lng: result.item.defaultCenter.lng, zoom: 13.5 });
    } else if (result.type === 'HAVEN') {
      setSafeCorridorTarget(result.item);
      setFocusTarget({ lat: result.item.coordinates.lat, lng: result.item.coordinates.lng, zoom: 15.0 });
    } else if (result.type === 'CCTV') {
      setActiveCctv(result.item);
      setIsCctvModalOpen(true);
      setFocusTarget({ lat: result.item.coordinates.lat, lng: result.item.coordinates.lng, zoom: 15.2 });
    } else if (result.type === 'HAZARD') {
      setFocusTarget({ lat: result.item.coordinates.lat, lng: result.item.coordinates.lng, zoom: 15.4 });
    }
  };

  // Trigger Audio Voice Alert (Feature 20)
  const handlePlayVoiceBroadcast = () => {
    const text = `Monsoon flood intelligence update for ${currentWard.name}. ${selectedRoad.name} currently has ${dynamicRoadDepth} centimeters of water. Passability status for ${vehicleConfig.label} is ${isRoadPassableForVehicle ? 'passable with care' : 'impassable stalling hazard'}. Astronomical high tide is 4.87 meters. Avoid subway dips.`;
    speakAlert(text);
  };

  // Handle Map Pin Drop submission (Feature 10)
  const handlePinDropOnMap = (coords) => {
    setNewPinCoords(coords);
    setIsPinDropperMode(false);
    setIsReportModalOpen(true);
  };

  const handleSubmitNewPinReport = (e) => {
    e.preventDefault();
    if (!newPinCoords) return;

    const newPin = {
      id: `cmp-${Date.now()}`,
      type: reportType,
      title: reportTitle || 'Citizen Reported Waterlogging',
      location: `Pinned at GPS (${newPinCoords.lat.toFixed(4)}, ${newPinCoords.lng.toFixed(4)})`,
      coordinates: newPinCoords,
      depthCm: parseInt(reportDepth, 10) || 20,
      upvotes: 1,
      userUpvoted: true,
      reportedBy: 'You (Citizen Scout)',
      timeAgo: 'Just now',
      verified: false
    };

    setCommunityPinsList([newPin, ...communityPinsList]);
    setIsReportModalOpen(false);
    setReportTitle('');
    alert('Thank you! Your flood incident has been pinned to the live map and broadcast to nearby citizens.');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 space-y-4">

      {/* Top Smart Search & Quick Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Autocomplete Search Input (Feature 1) */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search road, ward, transit station or shelter (e.g. Milan Subway, Kurla, Kokilaben)..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition"
          />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-slideUp">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSelectSearchResult(res)}
                  className="w-full text-left px-4 py-2.5 hover:bg-purple-50/70 flex items-center justify-between gap-3 transition"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{res.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">{res.sub}</div>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Location Pills (Feature 2) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-mono font-semibold shrink-0">
          <button 
            onClick={() => {
              setSelectedRoadId('rd-milan');
              setFocusTarget({ lat: 19.0825, lng: 72.8410, zoom: 15 });
            }}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedRoadId === 'rd-milan' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Milan Subway (35cm)
          </button>
          <button 
            onClick={() => {
              setSelectedRoadId('rd-lbs');
              setFocusTarget({ lat: 19.0680, lng: 72.8800, zoom: 14.5 });
            }}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedRoadId === 'rd-lbs' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            L.B.S. Marg (24cm)
          </button>
          <button 
            onClick={() => {
              setSelectedRoadId('rd-ambedkar');
              setFocusTarget({ lat: 19.0125, lng: 72.8425, zoom: 14.5 });
            }}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedRoadId === 'rd-ambedkar' ? 'bg-red-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hindmata Sump (32cm)
          </button>
          <button 
            onClick={() => {
              setSelectedRoadId('rd-weh');
              setFocusTarget({ lat: 19.0720, lng: 72.8510, zoom: 14.2 });
            }}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedRoadId === 'rd-weh' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            WEH Flyover (0cm)
          </button>
        </div>
      </div>

      {/* Auxiliary Operational Ribbon (Tide Alert, Voice Broadcast, Tools) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Astronomical Tide Gauge Bar (Feature 8) */}
        <div className="md:col-span-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-3 rounded-2xl shadow-sm flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-cyan-300">ARABIAN SEA HIGH TIDE:</span>
                <span className="font-bold text-white">{TIDE_TELEMETRY_DATA.nextHighTideHeightM}m MSL</span>
                <span className="bg-red-600/90 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  SPRING TIDE
                </span>
              </div>
              <div className="text-[10px] text-blue-200/80">
                Peak at {TIDE_TELEMETRY_DATA.nextHighTideTime} • Sluice gates locked (gravity drainage restricted)
              </div>
            </div>
          </div>
          <span className="hidden sm:inline text-[11px] font-bold text-cyan-200 bg-white/10 px-2.5 py-1 rounded-xl">
            Locked: {TIDE_TELEMETRY_DATA.lockDurationRemainingMin}m
          </span>
        </div>

        {/* Action Tool Strip: Voice Broadcast, Measure, Pin Dropper, Bookmarks */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          {/* Voice Broadcast Button (Feature 20) */}
          <button
            onClick={handlePlayVoiceBroadcast}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-mono text-xs font-bold border border-purple-200 transition shadow-xs"
            title="Listen to synthesized audio road update"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Voice Briefing</span>
          </button>

          {/* Interactive Distance Measuring Tool (Feature 11) */}
          <button
            onClick={() => setIsMeasuringMode(!isMeasuringMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition shadow-xs ${
              isMeasuringMode 
                ? 'bg-indigo-600 text-white border-indigo-700' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Measure route distance & flood exposure"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{isMeasuringMode ? 'Done Measuring' : 'Measure Route'}</span>
          </button>

          {/* Pin Dropper Button (Feature 10) */}
          <button
            onClick={() => setIsPinDropperMode(!isPinDropperMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition shadow-xs ${
              isPinDropperMode 
                ? 'bg-amber-600 text-white border-amber-700 animate-pulse' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Click anywhere on the map to pin a hazard"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isPinDropperMode ? 'Click Map...' : 'Pin Hazard'}</span>
          </button>

          {/* Saved Bookmarks Hub (Feature 18) */}
          <button
            onClick={() => setIsBookmarksModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 font-mono text-xs font-bold border border-slate-200 transition shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-600" />
            <span>Bookmarks ({savedBookmarks.length})</span>
          </button>

          {/* Situation Report PDF/PNG Export (Feature 19) */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 font-mono text-xs font-bold border border-slate-200 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Map Workspace with Left Floating Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Floating Area Status Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            {/* Ward Selector & Risk Banner */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">
                  SELECTED MUNICIPAL CATCHMENT
                </span>
                {/* Ward Switcher Dropdown */}
                <select
                  value={selectedWardId}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  className="font-extrabold text-sm text-slate-900 bg-transparent border-none p-0 focus:outline-none cursor-pointer hover:text-purple-700"
                >
                  {WARDS_DATA.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold border ${
                currentWard.risk === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                currentWard.risk === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {currentWard.risk} RISK
              </span>
            </div>

            {/* 2x2 Catchment Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase">MEAN BASIN DEPTH</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {Math.max(0, currentWard.currentWater + depthSurcharge)}
                </span>
                <span className="text-xs text-slate-400 ml-1">cm</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase">EXPECTED PEAK</span>
                <span className="text-xl font-extrabold text-red-600">
                  {Math.max(0, currentWard.peakWater + depthSurcharge)}
                </span>
                <span className="text-xs text-slate-400 ml-1">cm</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase">PUMP DISCHARGE</span>
                <span className="text-base font-extrabold text-cyan-700">179,300</span>
                <span className="text-[10px] text-slate-500 ml-1">LPS</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase">RAIN NOWCAST</span>
                <span className="text-base font-extrabold text-purple-700">{currentWard.rainRate} mm/h</span>
              </div>
            </div>

            {/* Feature 4: Real-Time Dynamic Flood Depth Scrubber */}
            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  Cloudburst Scrubber
                </span>
                <span className="font-extrabold text-purple-700">
                  {depthSurcharge > 0 ? `+${depthSurcharge} cm Surcharge` : 'Normal Live Model'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                step="5"
                value={depthSurcharge}
                onChange={(e) => setDepthSurcharge(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-purple-200 rounded-lg"
              />
              <div className="flex justify-between text-[9px] font-mono text-purple-500">
                <span>0cm (Current)</span>
                <span>+20cm (Heavy Rain)</span>
                <span>+40cm (Cloudburst)</span>
              </div>
            </div>

            {/* Feature 5: Vehicle Ground Clearance Simulator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                  YOUR VEHICLE PROFILE
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">
                  Clearance: {vehicleConfig.clearanceCm}cm
                </span>
              </div>

              {/* Vehicle Pill Toggles */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold">
                {Object.entries(VEHICLE_PROFILES).slice(0, 6).map(([key, v]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedVehicle(key)}
                    className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                      selectedVehicle === key 
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{v.label.split(' ')[0]}</span>
                    <span className="text-[9px] font-normal opacity-85">{v.clearanceCm}cm</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Street Risk Strip Component */}
            <StreetRiskStrip 
              roadName={selectedRoad.name}
              currentWater={dynamicRoadDepth}
              expectedPeak={selectedRoad.peakDepth + depthSurcharge}
              peakEta={selectedRoad.peakTime}
              velocity={selectedRoad.velocity}
              startElevation={selectedRoad.elevation + 4}
              endElevation={selectedRoad.elevation}
            />

            {/* Passability Matrix for Selected Road */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                  CORRIDOR PASSABILITY AUDIT
                </span>
                <button
                  onClick={() => setIsElevationDrawerOpen(true)}
                  className="text-[10px] font-mono text-purple-700 hover:underline flex items-center gap-0.5"
                >
                  Elevation Profile →
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono font-bold">
                <div className={`p-2 rounded-xl border ${dynamicRoadDepth <= 15 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  <Car className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>SEDAN</span>
                  <div className="text-[9px] font-normal">{dynamicRoadDepth <= 15 ? 'SAFE' : 'STALL'}</div>
                </div>

                <div className={`p-2 rounded-xl border ${dynamicRoadDepth <= 12 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  <Bike className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>2-WHEELER</span>
                  <div className="text-[9px] font-normal">{dynamicRoadDepth <= 12 ? 'SAFE' : 'AVOID'}</div>
                </div>

                <div className={`p-2 rounded-xl border ${dynamicRoadDepth <= 28 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  <Truck className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>SUV / BUS</span>
                  <div className="text-[9px] font-normal">{dynamicRoadDepth <= 28 ? 'CLEAR' : 'WARNING'}</div>
                </div>

                <div className={`p-2 rounded-xl border ${dynamicRoadDepth <= 10 && selectedRoad.velocity < 0.4 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  <Footprints className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>WALKING</span>
                  <div className="text-[9px] font-normal">{dynamicRoadDepth <= 10 ? 'SAFE' : 'UNSAFE'}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button 
                onClick={() => navigateTo('route')}
                className="flex-1 bg-purple-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-purple-700 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Find Escape Route</span>
                <Navigation className="w-3.5 h-3.5" />
              </button>

              {/* SOS 1916 Quick Trigger (Feature 16) */}
              <button 
                onClick={() => setIsSosModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SOS 1916</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveMapCanvas 
            height="h-[580px]"
            onSelectRoad={(roadId) => setSelectedRoadId(roadId)}
            selectedRoadId={selectedRoadId}
            depthSurcharge={depthSurcharge}
            selectedVehicle={selectedVehicle}
            focusTarget={focusTarget}
            isPinDropperMode={isPinDropperMode}
            onMapPinDrop={handlePinDropOnMap}
            isMeasuringMode={isMeasuringMode}
            onMeasurementUpdate={(km) => setMeasuredKm(km)}
            safeCorridorTarget={safeCorridorTarget}
            isDopplerActive={isDopplerActive}
            onOpenCCTVModal={(cam) => {
              setActiveCctv(cam);
              setIsCctvModalOpen(true);
            }}
          />

          {/* Contextual Street Inspector & Safe Corridor Drawer */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  ROADWAY INSPECTOR
                </span>
                <span className="font-extrabold text-sm text-slate-900">{selectedRoad.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isRoadPassableForVehicle ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isRoadPassableForVehicle ? 'CLEAR FOR YOUR VEHICLE' : 'DO NOT CROSS'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {selectedRoad.recommendation}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Radar Doppler Toggle (Feature 13) */}
              <button
                onClick={() => setIsDopplerActive(!isDopplerActive)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 ${
                  isDopplerActive ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Doppler Radar</span>
              </button>

              {/* Safe Corridor Projection to Kokilaben / Nearest Haven (Feature 12) */}
              <button 
                onClick={() => {
                  const targetHaven = SAFE_PLACES_DATA[0];
                  setSafeCorridorTarget(targetHaven);
                  setFocusTarget({ lat: targetHaven.coordinates.lat, lng: targetHaven.coordinates.lng, zoom: 14.5 });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Evacuation Haven</span>
              </button>

              <button 
                onClick={() => navigateTo('route')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <span>Reroute Away</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 0–3h Forecast Timeline */}
      <ForecastTimeline />

      {/* MODAL 1: Live CCTV Stream Simulator (Feature 6) */}
      {isCctvModalOpen && activeCctv && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-mono font-extrabold text-sm text-white">
                  LIVE CCTV FEED • {activeCctv.camCode}
                </h3>
                <span className="text-[10px] font-mono bg-purple-900 text-purple-200 px-2 py-0.5 rounded">
                  {activeCctv.fps} FPS
                </span>
              </div>
              <button 
                onClick={() => setIsCctvModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Video Canvas */}
            <div className="relative bg-slate-950 h-72 flex items-center justify-center overflow-hidden border-b border-slate-800">
              {/* Animated Scanlines */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_4px] pointer-events-none" />

              {/* Water Level Overlay Indicator */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  AI WATER GAUGE: {activeCctv.waterLevelCm} cm
                </div>
                <div className="text-[10px] text-slate-300">
                  Optical Flow: {activeCctv.flowVelocity}
                </div>
              </div>

              {/* Timestamp & Location */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono text-right text-slate-300">
                <div>LIVE • 2026-09-23 {new Date().toLocaleTimeString()}</div>
                <div className="text-emerald-400">{activeCctv.location}</div>
              </div>

              {/* Visual Simulated Underpass View */}
              <div className="text-center space-y-2 select-none">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-cyan-500/40 border-t-cyan-400 animate-spin flex items-center justify-center">
                  <Camera className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-xs font-mono text-slate-400">
                  OPTICAL SENSOR STREAM CONNECTED (MUNICIPAL CCTV NETWORK)
                </div>
                <div className="text-[11px] font-mono text-amber-400 max-w-md mx-auto px-4">
                  {activeCctv.liveNotice}
                </div>
              </div>

              {/* Optical Water Level Bar on Right Side */}
              <div className="absolute right-4 bottom-4 top-16 w-8 bg-black/80 border border-slate-700 rounded-lg flex flex-col justify-end p-1 text-[8px] font-mono text-slate-400 text-center">
                <div 
                  className="w-full bg-gradient-to-t from-red-600 to-amber-500 rounded transition-all duration-500"
                  style={{ height: `${Math.min(100, (activeCctv.waterLevelCm / activeCctv.maxThresholdCm) * 100)}%` }}
                />
                <span className="mt-1 font-bold text-white">{activeCctv.waterLevelCm}cm</span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400">
                AI Detection: <strong className="text-white">{activeCctv.detectedVehicles} vehicles</strong> • Submergence: <strong className="text-red-400">{activeCctv.submergencePercent}%</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSnapshotCaptured(true);
                    setTimeout(() => setIsSnapshotCaptured(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isSnapshotCaptured ? 'Snapshot Saved!' : 'Capture Snapshot'}</span>
                </button>
                <button
                  onClick={() => setIsCctvModalOpen(false)}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Incident Report (Pin Dropper) (Feature 10) */}
      {isReportModalOpen && newPinCoords && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Crosshair className="w-4 h-4 text-purple-600" />
                <span>Pin Flood Incident on Live Map</span>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewPinReport} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-500 block mb-1">GPS Coordinates</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${newPinCoords.lat.toFixed(5)}, ${newPinCoords.lng.toFixed(5)}`}
                  className="w-full bg-slate-100 p-2 rounded-xl text-slate-700 border border-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Incident Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                >
                  <option value="WATERLOGGING">Severe Waterlogging</option>
                  <option value="OPEN_MANHOLE">Dislodged Manhole Grate</option>
                  <option value="STALLED_VEHICLE">Stalled Bus / Car Blocking Lane</option>
                  <option value="TREE_FALL">Fallen Tree / Electric Wire</option>
                  <option value="SAFE_PASSAGE">Safe Dry Route</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Observed Depth (cm)</label>
                <input 
                  type="number" 
                  value={reportDepth}
                  onChange={(e) => setReportDepth(e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  placeholder="e.g. 25"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description / Landmark</label>
                <input 
                  type="text" 
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Water knee-deep outside station entrance"
                  className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Emergency SOS Dispatch Hub (Feature 16) */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Municipal Flood SOS (Helpline 1916)</span>
              </div>
              <button onClick={() => setIsSosModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If you or someone nearby is trapped by rising floodwater, trigger an immediate emergency dispatch. Your location telemetry is pre-compiled below:
            </p>

            <div className="bg-red-50 p-3 rounded-2xl border border-red-200 font-mono text-xs text-red-950 space-y-1">
              <div><strong>Ward:</strong> {currentWard.name}</div>
              <div><strong>Nearby Arterial:</strong> {selectedRoad.name}</div>
              <div><strong>Current Water Level:</strong> {dynamicRoadDepth} cm</div>
              <div><strong>GPS Coordinates:</strong> 19.0682° N, 72.8791° E</div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href="tel:1916"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <PhoneCall className="w-4 h-4" /> Call BMC Disaster Control (1916)
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`EMERGENCY: Trapped by flood at ${selectedRoad.name}, ${currentWard.name}. Water depth approx ${dynamicRoadDepth}cm. GPS: 19.0682, 72.8791`);
                  setSosCopied(true);
                  setTimeout(() => setSosCopied(false), 2500);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{sosCopied ? 'Dispatch Text Copied!' : 'Copy Emergency Dispatch Message'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Elevation Contour DEM Profile Drawer (Feature 14) */}
      {isElevationDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">DIGITAL ELEVATION MODEL (DEM)</span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {ELEVATION_PROFILES_DATA[selectedRoad.id]?.name || `${selectedRoad.name} Elevation Cross-Section`}
                </h3>
              </div>
              <button onClick={() => setIsElevationDrawerOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                ✕
              </button>
            </div>

            {/* Elevation SVG Chart */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <svg viewBox="0 0 500 180" className="w-full h-44">
                {/* Ground profile */}
                <path
                  d="M 20,40 L 120,80 L 250,140 L 380,90 L 480,45 L 480,170 L 20,170 Z"
                  fill="#E2E8F0"
                  stroke="#64748B"
                  strokeWidth="2"
                />
                {/* Water profile */}
                <path
                  d="M 160,110 L 340,110 L 250,140 Z"
                  fill="rgba(59, 130, 246, 0.4)"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
                {/* Labels */}
                <text x="25" y="35" className="text-[10px] font-mono fill-slate-600">+7.2m MSL (Approach)</text>
                <text x="210" y="160" className="text-[10px] font-mono font-bold fill-red-600">+3.2m Lowest Sump</text>
                <text x="200" y="105" className="text-[10px] font-mono font-bold fill-blue-700">Water Depth: {dynamicRoadDepth}cm</text>
                <text x="400" y="40" className="text-[10px] font-mono fill-slate-600">+7.0m MSL (Exit)</text>
              </svg>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This topographical cross-section shows the elevation dip where the underpass penetrates beneath the railway tracks. When precipitation exceeds the storm drain capacity of <strong>25 mm/h</strong>, gravitational drainage reverses, creating a hydraulic ponding trap.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setIsElevationDrawerOpen(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Citizen Saved Bookmarks Hub (Feature 18) */}
      {isBookmarksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Bookmark className="w-4 h-4 text-purple-600" />
                <span>My Saved Locations</span>
              </div>
              <button onClick={() => setIsBookmarksModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {savedBookmarks.map(bm => (
                <div 
                  key={bm.id}
                  onClick={() => {
                    setSelectedRoadId(bm.roadId);
                    setIsBookmarksModalOpen(false);
                  }}
                  className="p-3 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200 cursor-pointer flex items-center justify-between transition"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{bm.label}</div>
                    <div className="text-[10px] font-mono text-slate-500">Route Link: {bm.roadId}</div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    bm.isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bm.isSafe ? 'DRY' : 'FLOOD ALERT'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const newLabel = prompt('Enter a label for current location:');
                if (newLabel) {
                  setSavedBookmarks([...savedBookmarks, {
                    id: `bm-${Date.now()}`,
                    label: newLabel,
                    type: 'CUSTOM',
                    roadId: selectedRoad.id,
                    isSafe: dynamicRoadDepth <= 10
                  }]);
                }
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-purple-700 rounded-xl font-mono text-xs font-bold transition"
            >
              + Bookmark Current Road ({selectedRoad.name})
            </button>
          </div>
        </div>
      )}

      {/* MODAL 6: Situation Report Exporter (Feature 19) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Printer className="w-4 h-4 text-purple-600" />
                <span>Flood Situation Briefing (Print / PDF)</span>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                ✕
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-xs font-mono">
              <div className="border-b border-slate-200 pb-2">
                <div className="font-extrabold text-slate-900">MUMBAI METROPOLITAN MONSOON SITREP</div>
                <div className="text-[10px] text-slate-500">Generated: {new Date().toLocaleString()} IST</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Catchment: <strong>{currentWard.name}</strong></div>
                <div>Risk Status: <strong className="text-red-600">{currentWard.risk}</strong></div>
                <div>High Tide: <strong>{TIDE_TELEMETRY_DATA.nextHighTideHeightM}m at {TIDE_TELEMETRY_DATA.nextHighTideTime}</strong></div>
                <div>Active Pumps: <strong>27 of 38 turbines</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] space-y-1">
                <div className="font-bold text-slate-700">IMPASSABLE CORRIDORS:</div>
                {ROAD_SEGMENTS.filter(r => r.currentDepth > 20).map(r => (
                  <div key={r.id} className="text-red-700">• {r.name}: {r.currentDepth}cm ({r.recommendation.split('.')[0]})</div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
