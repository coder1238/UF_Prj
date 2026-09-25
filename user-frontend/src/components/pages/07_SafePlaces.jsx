import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { safePlacesData } from '../../data/safePlacesData';
import InteractiveMapCanvas from '../shared/InteractiveMapCanvas';

// Modals
import ShelterPassModal from '../safeplaces/ShelterPassModal';
import EmergencyDeskModal from '../safeplaces/EmergencyDeskModal';
import ShelterReportModal from '../safeplaces/ShelterReportModal';
import CctvCorridorModal from '../safeplaces/CctvCorridorModal';
import SpecialAssistanceModal from '../safeplaces/SpecialAssistanceModal';
import FamilyPlanModal from '../safeplaces/FamilyPlanModal';
import ElevationProfileModal from '../safeplaces/ElevationProfileModal';

import { 
  Building, Hospital, ShieldCheck, Navigation, Phone, 
  MapPin, CheckCircle2, AlertTriangle, Car, Users, Zap, 
  Search, Filter, ChevronRight, Compass, Volume2, VolumeX,
  QrCode, Radio, Camera, HeartHandshake, Star, Share2, 
  Copy, Check, TrendingUp, Sliders, RefreshCw, Layers,
  Droplets, Flame, ArrowRight, ShieldAlert, Sparkles, X,
  Activity, Clock, Truck, Eye
} from 'lucide-react';

export default function SafePlaces() {
  const { currentWard, speakAlert, vehicleType, setVehicleType } = useFlood();
  const { navigateTo } = useNavigation();

  // Primary State
  const [places, setPlaces] = useState(safePlacesData);
  const [selectedPlace, setSelectedPlace] = useState(safePlacesData[0]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('directory'); // 'directory' | 'map' | 'elevation'
  const [activeTab, setActiveTab] = useState('corridor'); // 'corridor' | 'supplies' | 'parking' | 'pets' | 'benchmark'

  // Advanced Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [minElevation, setMinElevation] = useState(0);
  const [dryRouteOnly, setDryRouteOnly] = useState(false);
  const [generatorRequired, setGeneratorRequired] = useState(false);
  const [medicalStaffRequired, setMedicalStaffRequired] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'elevation' | 'capacity' | 'travelTime' | 'waterDepth'

  // Saved Favorites (persisted in localStorage)
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => {
    try {
      const stored = localStorage.getItem('urbanflood_favorite_havens');
      return stored ? JSON.parse(stored) : ['sp-1', 'sp-2'];
    } catch (e) {
      return ['sp-1', 'sp-2'];
    }
  });

  // Modals visibility
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isDeskModalOpen, setIsDeskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  const [isSpecialAssistanceOpen, setIsSpecialAssistanceOpen] = useState(false);
  const [isFamilyPlanOpen, setIsFamilyPlanOpen] = useState(false);
  const [isElevationModalOpen, setIsElevationModalOpen] = useState(false);

  // Audio briefing state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en'); // 'en' | 'hi' | 'mr'

  // Restock requested toast
  const [restockAlert, setRestockAlert] = useState(null);
  const [copiedSms, setCopiedSms] = useState(false);

  // Synchronize saved favorites
  useEffect(() => {
    try {
      localStorage.setItem('urbanflood_favorite_havens', JSON.stringify(savedPlaceIds));
    } catch (e) {}
  }, [savedPlaceIds]);

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setSavedPlaceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Find absolute nearest dry safe haven for the emergency radar banner
  const nearestDryHaven = useMemo(() => {
    const dryPlaces = places.filter(p => p.routeClear || p.maxWaterOnRoute === 0);
    if (dryPlaces.length === 0) return places[0];
    return dryPlaces.reduce((prev, curr) => (prev.distanceKm < curr.distanceKm ? prev : curr));
  }, [places]);

  // Filtering & Sorting Logic
  const filteredPlaces = useMemo(() => {
    let result = places.filter(place => {
      // Category filter
      if (activeFilter !== 'all' && place.type !== activeFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesWard = place.ward.toLowerCase().includes(q);
        const matchesAddr = place.address.toLowerCase().includes(q);
        const matchesCat = place.categoryLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesWard && !matchesAddr && !matchesCat) return false;
      }

      // Advanced filters
      if (place.elevationMsl < minElevation) return false;
      if (dryRouteOnly && !place.routeClear) return false;
      if (generatorRequired && !place.generatorBackup) return false;
      if (medicalStaffRequired && !place.hasMedicalStaff) return false;
      if (petFriendlyOnly && !place.petFacilities?.supported) return false;
      if (accessibleOnly && place.accessibility !== 'FULLY ACCESSIBLE') return false;
      if (parkingOnly && !place.parkingDeck?.hasElevatedDeck) return false;
      if (favoritesOnly && !savedPlaceIds.includes(place.id)) return false;

      return true;
    });

    // Sort result
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'elevation') return b.elevationMsl - a.elevationMsl;
      if (sortBy === 'capacity') return b.availableCapacity - a.availableCapacity;
      if (sortBy === 'travelTime') return a.travelTimeMins - b.travelTimeMins;
      if (sortBy === 'waterDepth') return a.maxWaterOnRoute - b.maxWaterOnRoute;
      return 0;
    });

    return result;
  }, [
    places, activeFilter, searchQuery, minElevation, dryRouteOnly, 
    generatorRequired, medicalStaffRequired, petFriendlyOnly, 
    accessibleOnly, parkingOnly, favoritesOnly, sortBy, savedPlaceIds
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minElevation > 0) count++;
    if (dryRouteOnly) count++;
    if (generatorRequired) count++;
    if (medicalStaffRequired) count++;
    if (petFriendlyOnly) count++;
    if (accessibleOnly) count++;
    if (parkingOnly) count++;
    if (favoritesOnly) count++;
    return count;
  }, [minElevation, dryRouteOnly, generatorRequired, medicalStaffRequired, petFriendlyOnly, accessibleOnly, parkingOnly, favoritesOnly]);

  const resetFilters = () => {
    setMinElevation(0);
    setDryRouteOnly(false);
    setGeneratorRequired(false);
    setMedicalStaffRequired(false);
    setPetFriendlyOnly(false);
    setAccessibleOnly(false);
    setParkingOnly(false);
    setFavoritesOnly(false);
    setActiveFilter('all');
    setSearchQuery('');
  };

  // Handle Voice Audio Guide via Web Speech API
  const handleVoiceBriefing = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    let text = '';
    let lang = 'en-IN';

    if (speechLanguage === 'hi') {
      lang = 'hi-IN';
      text = `सुरक्षित स्थान: ${selectedPlace.name}. ऊंचाई: ${selectedPlace.elevation}. वर्तमान दूरी: ${selectedPlace.distance}. प्रवेश मार्ग: ${selectedPlace.routeClear ? 'पूरी तरह से सूखा और सुरक्षित है.' : 'सावधानी बरतें. कुछ हिस्सों में जलजमाव है.'} हेल्पलाइन नंबर: ${selectedPlace.phone}.`;
    } else if (speechLanguage === 'mr') {
      lang = 'mr-IN';
      text = `सुरक्षित निवारा: ${selectedPlace.name}. समुद्रसपाटीपासून उंची: ${selectedPlace.elevation}. अंतर: ${selectedPlace.distance}. मार्ग: ${selectedPlace.routeClear ? 'पाणी साचलेले नाही. रस्ता सुरक्षित आहे.' : 'पाणी साचल्यामुळे सावधगिरी बाळगा.'} आपत्कालीन संपर्क: ${selectedPlace.phone}.`;
    } else {
      lang = 'en-IN';
      text = `Safe Haven: ${selectedPlace.name}. Ground Elevation: ${selectedPlace.elevation}. Distance: ${selectedPlace.distance}. Approach Corridor: ${selectedPlace.routeClear ? 'Completely dry and passable.' : 'Caution advised due to localized standing water.'} Emergency Desk: ${selectedPlace.phone}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech if switching places
  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [selectedPlace]);

  // Handle spot registration deduction
  const handleRegisterSuccess = (partyCount) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === selectedPlace.id) {
        return {
          ...p,
          availableCapacity: Math.max(0, p.availableCapacity - partyCount)
        };
      }
      return p;
    }));
    setSelectedPlace(prev => ({
      ...prev,
      availableCapacity: Math.max(0, prev.availableCapacity - partyCount)
    }));
  };

  // Handle crowd report submission
  const handleReportSubmitted = (newReport) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === selectedPlace.id) {
        const count = (p.communityReports?.recentCount || 0) + 1;
        return {
          ...p,
          communityReports: {
            ...p.communityReports,
            recentCount: count,
            crowdDensity: newReport.crowd,
            lastReportedMinAgo: 1
          }
        };
      }
      return p;
    }));
    setSelectedPlace(prev => ({
      ...prev,
      communityReports: {
        ...prev.communityReports,
        recentCount: (prev.communityReports?.recentCount || 0) + 1,
        crowdDensity: newReport.crowd,
        lastReportedMinAgo: 1
      }
    }));
  };

  // Request restock logistics alert
  const handleRequestRestock = (item) => {
    setRestockAlert(`Logistics Restock Ticket logged for ${item} at ${selectedPlace.name}. Dispatched to BMC Ward ${selectedPlace.ward} Logistics Hub.`);
    setTimeout(() => setRestockAlert(null), 4000);
  };

  // Generate and Copy Emergency SMS Dossier
  const handleCopySmsDossier = () => {
    const text = `*URBAN FLOOD SAFE HAVEN DOSSIER*\nFacility: ${selectedPlace.name}\nWard: ${selectedPlace.ward}\nElevation: ${selectedPlace.elevation} MSL\nGPS: ${selectedPlace.coordinates.lat.toFixed(4)}, ${selectedPlace.coordinates.lng.toFixed(4)}\nDistance: ${selectedPlace.distance}\nApproach: ${selectedPlace.corridorNotes || selectedPlace.safeRouteInfo}\nDesk: ${selectedPlace.phone}\nFree Slots: ${selectedPlace.availableCapacity}/${selectedPlace.totalCapacity}`;
    navigator.clipboard?.writeText(text);
    
    // Save to offline storage as well
    try {
      localStorage.setItem('urbanflood_offline_haven', JSON.stringify(selectedPlace));
    } catch (e) {}

    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  // Launch Active HUD with pre-selected place
  const handleLaunchHUD = () => {
    try {
      sessionStorage.setItem('hud_target_place', JSON.stringify({
        name: selectedPlace.name,
        address: selectedPlace.address,
        elevation: selectedPlace.elevation,
        coordinates: selectedPlace.coordinates
      }));
    } catch (e) {}
    navigateTo('hud');
  };

  const filterCategories = [
    { id: 'all', label: 'All Safe Havens' },
    { id: 'hospital', label: 'Hospitals & Trauma' },
    { id: 'civic_shelter', label: 'BMC Relief Shelters' },
    { id: 'parking_ramp', label: 'Elevated Car Parks' },
    { id: 'transit_hub', label: 'High-Ground Stations' }
  ];

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'hospital': return Hospital;
      case 'parking_ramp': return Car;
      case 'civic_shelter': return Building;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Emergency "Nearest Dry Ground Instant Escape" Radar Widget */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white border border-purple-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-full bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <Compass className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                RADAR ACTIVE • 0cm WATER CORRIDOR
              </span>
              <span className="text-xs text-purple-300 font-mono hidden sm:inline">
                Bearing: {nearestDryHaven.bearingDeg || 340}° N
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5">
              Nearest High-Ground Refuge: <span className="text-purple-300">{nearestDryHaven.name}</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Elevation: <strong className="text-emerald-400">{nearestDryHaven.elevation}</strong> • Distance: <strong className="text-white">{nearestDryHaven.distance}</strong> ({nearestDryHaven.travelTimeMins} mins via dry ridge)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto relative z-10">
          <button
            onClick={() => {
              setSelectedPlace(nearestDryHaven);
              setIsPassModalOpen(true);
            }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Instant Cot Pass
          </button>
          <button
            onClick={() => {
              setSelectedPlace(nearestDryHaven);
              handleLaunchHUD();
            }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" /> Evacuate Now
          </button>
        </div>
      </div>

      {/* Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Vetted Dry Havens & Ingress Corridors
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Safe Places & High-Ground Shelters
          </h1>
          <p className="text-sm text-muted mt-1">
            Verified shelters, apex trauma centers, and elevated multi-level parking ramps reachable via non-submerged paths.
          </p>
        </div>

        {/* View Switcher: Directory vs Map vs Elevation */}
        <div className="flex items-center gap-2 bg-canvas p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('directory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'directory' ? 'bg-white text-purple-primary shadow-sm' : 'text-slate-600 hover:text-ink'
            }`}
          >
            Haven Dossier
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map' ? 'bg-white text-purple-primary shadow-sm' : 'text-slate-600 hover:text-ink'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Geospatial Map
          </button>
          <button
            onClick={() => setViewMode('elevation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'elevation' ? 'bg-white text-purple-primary shadow-sm' : 'text-slate-600 hover:text-ink'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Elevation Cross-Section
          </button>
        </div>
      </div>

      {/* Restock Notification Toast */}
      {restockAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-primary shrink-0" />
            <span>{restockAlert}</span>
          </div>
          <button onClick={() => setRestockAlert(null)} className="text-purple-700 hover:text-purple-950 font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {filterCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === cat.id 
                    ? 'bg-purple-primary text-white shadow-sm' 
                    : 'bg-canvas text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Advanced Filter Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search facility, road, ward..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeFilterCount > 0 || isFilterDrawerOpen
                  ? 'bg-purple-50 text-purple-primary border-purple-primary' 
                  : 'bg-canvas text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-primary text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsFamilyPlanOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Family Protocol</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Multi-Criteria Filter Bar */}
        {isFilterDrawerOpen && (
          <div className="pt-4 border-t border-slate-100 animate-in fade-in duration-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Min Elevation Slider */}
              <div className="p-3 bg-canvas rounded-xl border border-slate-200/80">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-700">Min Site Elevation</span>
                  <span className="font-mono text-purple-primary font-bold">+{minElevation}m MSL</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={35} 
                  step={2}
                  value={minElevation} 
                  onChange={e => setMinElevation(Number(e.target.value))}
                  className="w-full accent-purple-primary cursor-pointer"
                />
              </div>

              {/* Sorting Criteria */}
              <div className="p-3 bg-canvas rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Sort Safe Havens By</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-ink focus:outline-none focus:border-purple-primary font-bold"
                >
                  <option value="distance">Nearest Distance (GPS)</option>
                  <option value="elevation">Highest Elevation (MSL)</option>
                  <option value="capacity">Most Available Free Capacity</option>
                  <option value="travelTime">Fastest Travel Time</option>
                  <option value="waterDepth">Lowest Water on Approach</option>
                </select>
              </div>

              {/* Toggles Group 1 */}
              <div className="space-y-2 p-3 bg-canvas rounded-xl border border-slate-200/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={dryRouteOnly} 
                    onChange={e => setDryRouteOnly(e.target.checked)} 
                    className="accent-purple-primary rounded" 
                  />
                  <span className="text-slate-700">0cm Dry Route Only (Zero Water)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={medicalStaffRequired} 
                    onChange={e => setMedicalStaffRequired(e.target.checked)} 
                    className="accent-purple-primary rounded" 
                  />
                  <span className="text-slate-700">Active Trauma / Medical Desk</span>
                </label>
              </div>

              {/* Toggles Group 2 */}
              <div className="space-y-2 p-3 bg-canvas rounded-xl border border-slate-200/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={petFriendlyOnly} 
                    onChange={e => setPetFriendlyOnly(e.target.checked)} 
                    className="accent-purple-primary rounded" 
                  />
                  <span className="text-slate-700">Pet & Domestic Animal Refuge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={parkingOnly} 
                    onChange={e => setParkingOnly(e.target.checked)} 
                    className="accent-purple-primary rounded" 
                  />
                  <span className="text-slate-700">Elevated Multi-Tier Car Parking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={favoritesOnly} 
                    onChange={e => setFavoritesOnly(e.target.checked)} 
                    className="accent-purple-primary rounded" 
                  />
                  <span className="text-purple-primary font-bold">★ My Bookmarked Havens Only</span>
                </label>
              </div>

            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted font-mono">
                Matching {filteredPlaces.length} of {places.length} Total Facilities
              </span>
              <button
                onClick={resetFilters}
                className="text-purple-primary hover:text-purple-deep font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: GEOSPATIAL MAP VIEW */}
      {viewMode === 'map' && (
        <div className="mb-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-ink">Corridor Ingress Geospatial Engine</span>
                <span className="text-muted hidden sm:inline">• Focused on: <strong>{selectedPlace.name}</strong></span>
              </div>
              <span className="font-mono text-purple-primary font-bold">{selectedPlace.elevation}</span>
            </div>

            <InteractiveMapCanvas 
              height="h-[520px]"
              showRoutes={true}
              safeCorridorTarget={selectedPlace}
              focusTarget={selectedPlace.coordinates}
              onSelectSafePlace={(id) => {
                const found = places.find(p => p.id === id);
                if (found) setSelectedPlace(found);
              }}
            />

            {/* Quick Facility Carousel at Bottom of Map */}
            <div className="flex items-center gap-3 overflow-x-auto pt-4">
              {filteredPlaces.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlace(p)}
                  className={`p-3 rounded-2xl border text-left shrink-0 w-64 transition-all ${
                    selectedPlace.id === p.id 
                      ? 'bg-purple-50 border-purple-primary ring-2 ring-purple-primary/20' 
                      : 'bg-canvas border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-ink truncate block w-40">{p.name}</span>
                    <span className="text-[10px] font-mono font-bold text-purple-primary">{p.elevation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted mt-1">
                    <span>{p.distance} away</span>
                    <span className={p.routeClear ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {p.routeClear ? 'DRY ROUTE' : 'CAUTION'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ELEVATION CROSS-SECTION VIEW */}
      {viewMode === 'elevation' && (
        <div className="mb-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
                Topographic Relief Analysis
              </span>
              <h3 className="text-2xl font-bold text-ink mt-0.5">
                Comparative Site Elevation vs Historical Cloudburst Crests
              </h3>
              <p className="text-xs text-muted mt-1">
                Visualizing safety envelopes above the 2005 deluge (+4.2m) and 2017 monsoon crest (+2.8m).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPlaces.map(place => {
              const msl = place.elevationMsl;
              const buffer = (msl - 4.2).toFixed(1);
              const isSelected = selectedPlace.id === place.id;
              return (
                <div 
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-purple-50/70 border-purple-primary shadow-sm' 
                      : 'bg-canvas border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-ink text-sm">{place.name}</span>
                      <span className="text-xs text-muted font-mono">Ward {place.ward}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-base font-extrabold text-purple-primary">+{msl}m MSL</span>
                      <span className="text-[10px] text-emerald-600 block">+{buffer}m over 2005 crest</span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-purple-primary to-purple-deep h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (msl / 45) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRIMARY TWO COLUMN LAYOUT: List & Safe Haven Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Places Directory List */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-mono text-muted uppercase tracking-wider mb-1">
            <span>Showing {filteredPlaces.length} Havens</span>
            <span>Sorted by: {sortBy}</span>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-ink text-sm">No Facilities Match Selected Filters</h3>
              <p className="text-xs text-muted">Try relaxing your elevation slider or category criteria.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-purple-primary text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredPlaces.map(place => {
              const Icon = getCategoryIcon(place.type);
              const isSelected = selectedPlace.id === place.id;
              const isFavorite = savedPlaceIds.includes(place.id);
              const occupancyPct = Math.round(((place.totalCapacity - place.availableCapacity) / place.totalCapacity) * 100);

              return (
                <div 
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-purple-50/60 border-purple-primary shadow-md ring-1 ring-purple-primary/30' 
                      : 'bg-white border-slate-200/80 hover:border-purple-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected ? 'bg-purple-primary text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-ink text-sm leading-snug">{place.name}</h3>
                          <button
                            onClick={(e) => toggleFavorite(place.id, e)}
                            className="text-slate-300 hover:text-amber-400 transition-colors p-0.5"
                            title={isFavorite ? 'Remove bookmark' : 'Bookmark this haven'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{place.address} • Ward {place.ward}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border ${
                      place.routeClear ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {place.routeClear ? 'DRY ROUTE' : 'CAUTION'}
                    </span>
                  </div>

                  {/* Badges strip */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                      {place.elevation}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {place.distance} • {place.travelTimeMins}m
                    </span>
                    {place.petFacilities?.supported && (
                      <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded border border-cyan-200 font-bold">
                        🐾 Pet Refuge
                      </span>
                    )}
                    {place.parkingDeck?.hasElevatedDeck && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200 font-bold">
                        🚗 Car Deck
                      </span>
                    )}
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-mono text-muted mb-1">
                      <span>Occupancy ({occupancyPct}%)</span>
                      <span>{place.availableCapacity} spots left</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          occupancyPct > 85 ? 'bg-red-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Safe Haven Deep Dossier */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            
            {/* Dossier Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
                    Safe Haven Dossier
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(selectedPlace.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${savedPlaceIds.includes(selectedPlace.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <span className="text-xs font-mono text-slate-400">ID: {selectedPlace.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-ink mt-1">{selectedPlace.name}</h2>
                <p className="text-xs text-muted font-mono mt-0.5">{selectedPlace.address}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-purple-primary block">
                  {selectedPlace.distance}
                </span>
                <span className="text-xs font-mono text-muted">~{selectedPlace.travelTimeMins} mins via dry ridge</span>
              </div>
            </div>

            {/* Audio Voice Guide Bar */}
            <div className="my-4 p-3 rounded-2xl bg-canvas border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleVoiceBriefing}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isSpeaking 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-purple-primary text-white hover:bg-purple-deep'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Voice Audio Briefing'}</span>
                </button>

                {isSpeaking && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-purple-primary animate-[bounce_0.6s_infinite_100ms] rounded" />
                    <span className="w-1 h-5 bg-purple-primary animate-[bounce_0.6s_infinite_200ms] rounded" />
                    <span className="w-1 h-2 bg-purple-primary animate-[bounce_0.6s_infinite_300ms] rounded" />
                    <span className="text-[10px] font-mono text-purple-primary font-bold pl-1">Broadcasting</span>
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-muted text-[10px]">Lang:</span>
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'mr', label: 'मराठी' }
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => setSpeechLanguage(l.code)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                      speechLanguage === l.code 
                        ? 'bg-purple-primary text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 bg-canvas rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-mono text-muted uppercase block">Site Elevation</span>
                <span className="text-base font-mono font-extrabold text-ink">{selectedPlace.elevation}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">High ground benchmark</span>
              </div>

              <div className="p-3 bg-canvas rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-mono text-muted uppercase block">Power Continuity</span>
                <span className="text-base font-mono font-extrabold text-purple-primary">
                  {selectedPlace.generatorBackup ? `${selectedPlace.generatorHours || 72}h Genset` : 'Grid Only'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Diesel fuel reserve</span>
              </div>

              <div className="p-3 bg-canvas rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-mono text-muted uppercase block">Medical Triage</span>
                <span className="text-base font-mono font-extrabold text-ink">
                  {selectedPlace.hasMedicalStaff ? 'Active Desk' : 'First Aid Only'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Paramedic on duty</span>
              </div>

              <div className="p-3 bg-canvas rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-mono text-muted uppercase block">Free Capacity</span>
                <span className="text-base font-mono font-extrabold text-ink">
                  {selectedPlace.availableCapacity} / {selectedPlace.totalCapacity}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Registered cots</span>
              </div>
            </div>

            {/* Deep Detail Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4 overflow-x-auto text-xs font-bold">
              {[
                { id: 'corridor', label: 'Safe Corridor Route' },
                { id: 'supplies', label: 'Provisions & Stock' },
                { id: 'parking', label: 'Elevated Car Park' },
                { id: 'pets', label: 'Pet Refuge' },
                { id: 'benchmark', label: 'Flood Benchmark' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-primary text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: SAFE CORRIDOR ROUTE */}
            {activeTab === 'corridor' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-canvas rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-purple-primary" />
                      <h4 className="text-xs font-bold text-ink">Approach Water Risk Assessment</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                      Max Water on Path: {selectedPlace.maxDepthOnRoute || '0 cm'}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {selectedPlace.corridorNotes || selectedPlace.safeRouteInfo}
                  </p>
                </div>

                {/* Turn-by-Turn Waypoints */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-muted font-bold block">
                    Turn-By-Turn Corridor Legs
                  </span>
                  {(selectedPlace.corridorSteps || [
                    { step: 1, text: 'Depart current location via elevated connecting artery', distance: '800m', waterDepth: '0cm', safe: true },
                    { step: 2, text: 'Proceed past high-ground ridge benchmark', distance: '1.2km', waterDepth: '0cm', safe: true },
                    { step: 3, text: 'Enter designated disaster intake security gates', distance: '400m', waterDepth: '0cm', safe: true }
                  ]).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <span className="text-slate-800 font-medium block">{step.text}</span>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-muted mt-0.5">
                          <span>Dist: {step.distance}</span>
                          <span className={step.safe ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            Water Depth: {step.waterDepth}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PROVISIONS & LIVE STOCK INVENTORY */}
            {activeTab === 'supplies' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted">Last BMC Logistics Restock: {selectedPlace.supplies?.lastRestocked || '15m ago'}</span>
                  <span className="text-emerald-600 font-bold font-mono">100% RATION INTACT</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-600">Potable Water Tanker</span>
                      <span className="font-bold text-ink">{selectedPlace.supplies?.potableWaterLitres || 40000} L</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block font-mono">~{selectedPlace.supplies?.potableWaterHours || 72}h supply</span>
                    <button 
                      onClick={() => handleRequestRestock('Drinking Water Tanker')}
                      className="text-[10px] font-bold text-purple-primary hover:underline mt-1 block"
                    >
                      + Request Civic Water Tanker
                    </button>
                  </div>

                  <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-600">Dry Ration Food Packs</span>
                      <span className="font-bold text-ink">{selectedPlace.supplies?.dryRationKits || 1500} Kits</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">Ready-to-eat calorie packs</span>
                    <button 
                      onClick={() => handleRequestRestock('Dry Ration Packs')}
                      className="text-[10px] font-bold text-purple-primary hover:underline mt-1 block"
                    >
                      + Request Ration Delivery
                    </button>
                  </div>

                  <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-600">Baby Infant Formula</span>
                      <span className="font-bold text-ink">{selectedPlace.supplies?.infantFormulaKits || 200} Kits</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">Pediatric electrolyte & milk</span>
                  </div>

                  <div className="p-3 bg-canvas rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-600">Mobile Charging Plugs</span>
                      <span className="font-bold text-purple-primary">{selectedPlace.supplies?.chargingSockets || 90} Ports</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block font-mono">AC power banks active</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ELEVATED CAR PARK RESCUE */}
            {activeTab === 'parking' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-canvas border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink">Elevated Ramp Vehicle Refuge</span>
                    <span className="font-mono text-purple-primary font-bold">
                      {selectedPlace.parkingDeck?.availableStalls || 80} / {selectedPlace.parkingDeck?.totalStalls || 250} Stalls
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    Stilt and upper ramp levels are engineered above maximum inundation lines. Ramp vertical clearance: <strong>{selectedPlace.parkingDeck?.rampClearanceM || 2.4} meters</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-muted font-bold block">Floor-by-Floor Flood Status</span>
                  {(selectedPlace.parkingDeck?.levels || [
                    { level: 'Ground Stilt Area', status: 'Drains running at capacity', safe: true },
                    { level: 'Level P1 Ramp', status: '100% Dry (+4m elevation)', safe: true },
                    { level: 'Level P2 Ramp', status: '100% Dry (+8m elevation)', safe: true }
                  ]).map((lvl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800">{lvl.level}</span>
                      <span className={`font-mono text-[11px] font-bold ${lvl.safe ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {lvl.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PET REFUGE */}
            {activeTab === 'pets' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className={`p-4 rounded-2xl border text-xs ${
                  selectedPlace.petFacilities?.supported 
                    ? 'bg-cyan-50/60 border-cyan-200 text-cyan-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">
                      {selectedPlace.petFacilities?.supported ? '🐾 Domestic Pet Refuge Supported' : 'No Pets Allowed'}
                    </span>
                    {selectedPlace.petFacilities?.supported && (
                      <span className="font-mono text-[11px] font-bold text-cyan-800">
                        {selectedPlace.petFacilities.currentPets} / {selectedPlace.petFacilities.enclosureCapacity} Pets Sheltered
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {selectedPlace.petFacilities?.rules || 'Due to sterile trauma hospital protocols, domestic animals cannot enter medical wards.'}
                  </p>
                  {selectedPlace.petFacilities?.vetOnDuty && (
                    <div className="mt-2 text-[10px] font-mono text-emerald-700 font-bold">
                      ✓ Municipal Veterinary Officer on duty with emergency dry pet kibble.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: HISTORICAL FLOOD BENCHMARK */}
            {activeTab === 'benchmark' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 bg-canvas rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">50-Year Deluge Safety Margin</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      +{selectedPlace.historicalClearance?.safetyBufferM || 12.5}m Clearance
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    {selectedPlace.historicalClearance?.verdict || 'Site elevation is well above historical flood surges.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-muted block">2005 Cloudburst</span>
                    <span className="font-bold text-rose-600">+{selectedPlace.historicalClearance?.deluge2005SurgeM || 4.2}m</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-muted block">2017 Monsoon</span>
                    <span className="font-bold text-amber-600">+{selectedPlace.historicalClearance?.monsoon2017SurgeM || 2.8}m</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-muted block">2026 AI Nowcast</span>
                    <span className="font-bold text-cyan-600">+{selectedPlace.historicalClearance?.forecast2026SurgeM || 1.6}m</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsElevationModalOpen(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  View Interactive Elevation Cross-Section Diagram
                </button>
              </div>
            )}

            {/* Citizen Verification Ticker */}
            <div className="mt-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified by <strong>{selectedPlace.communityReports?.recentCount || 18} citizens</strong> in the last 60 mins. Approach is 100% passable.
                </span>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="font-bold text-emerald-800 hover:underline shrink-0 ml-2"
              >
                + Log Ground Report
              </button>
            </div>

          </div>

          {/* Action Footer & Operational Buttons */}
          <div className="border-t border-slate-100 pt-5 mt-6 space-y-3">
            
            {/* Quick Action Matrix (8 Working Actions) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" /> Cot Pass
              </button>

              <button
                onClick={() => setIsDeskModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-ink font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-purple-primary" /> Radio Intercom
              </button>

              <button
                onClick={() => setIsCctvModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-ink font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> Live CCTV
              </button>

              <button
                onClick={() => setIsSpecialAssistanceOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-ink font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" /> Special Needs
              </button>

            </div>

            {/* Primary Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono text-muted">
                <button
                  onClick={handleCopySmsDossier}
                  className="hover:text-purple-primary flex items-center gap-1 font-bold"
                  title="Copy offline SMS coordinates"
                >
                  {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSms ? 'Offline SMS Copied!' : 'Copy Offline SMS'}</span>
                </button>
                <span>|</span>
                <a href={`tel:${selectedPlace.phone}`} className="hover:text-ink">
                  Desk: {selectedPlace.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleLaunchHUD}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-deep flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate via Dry Corridor
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ALL MODALS */}
      {isPassModalOpen && (
        <ShelterPassModal 
          place={selectedPlace} 
          onClose={() => setIsPassModalOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {isDeskModalOpen && (
        <EmergencyDeskModal 
          place={selectedPlace} 
          onClose={() => setIsDeskModalOpen(false)} 
        />
      )}

      {isReportModalOpen && (
        <ShelterReportModal 
          place={selectedPlace} 
          onClose={() => setIsReportModalOpen(false)}
          onReportSubmitted={handleReportSubmitted}
        />
      )}

      {isCctvModalOpen && (
        <CctvCorridorModal 
          place={selectedPlace} 
          onClose={() => setIsCctvModalOpen(false)} 
        />
      )}

      {isSpecialAssistanceOpen && (
        <SpecialAssistanceModal 
          place={selectedPlace} 
          onClose={() => setIsSpecialAssistanceOpen(false)} 
        />
      )}

      {isFamilyPlanOpen && (
        <FamilyPlanModal 
          savedPlaces={savedPlaceIds} 
          allPlaces={places} 
          onClose={() => setIsFamilyPlanOpen(false)} 
        />
      )}

      {isElevationModalOpen && (
        <ElevationProfileModal 
          place={selectedPlace} 
          onClose={() => setIsElevationModalOpen(false)} 
        />
      )}

    </div>
  );
}
