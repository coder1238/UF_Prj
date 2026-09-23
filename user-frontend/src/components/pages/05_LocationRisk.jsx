import React, { useState, useEffect, useMemo } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Home, 
  Building2, 
  School, 
  Heart, 
  Plus, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Droplets,
  TrendingUp, 
  Compass, 
  Sliders, 
  ChevronRight,
  Pin,
  Trash2,
  Edit2,
  Search,
  Filter,
  Columns,
  Printer,
  Layers,
  Activity,
  Car,
  Users,
  Waves,
  Eye,
  Settings,
  BellOff,
  Package,
  Camera,
  Timer,
  Radar,
  Award,
  Wrench,
  ShieldAlert,
  HeartPulse
} from 'lucide-react';

// Subcomponents for the 25 Features
import LocationCatchmentMap from '../locations/LocationCatchmentMap';
import LocationFloodSimulator from '../locations/LocationFloodSimulator';
import LocationBuildingVulnerability from '../locations/LocationBuildingVulnerability';
import LocationDrainageAndSensors from '../locations/LocationDrainageAndSensors';
import LocationEvacuationAndVehicle from '../locations/LocationEvacuationAndVehicle';
import LocationSafetyAndFamily from '../locations/LocationSafetyAndFamily';
import LocationCrossSection from '../locations/LocationCrossSection';
import LocationSuppliesAndPhotos from '../locations/LocationSuppliesAndPhotos';
import LocationPumpingAndRecession from '../locations/LocationPumpingAndRecession';
import LocationCommunityAndHealth from '../locations/LocationCommunityAndHealth';
import LocationRadarAndResilience from '../locations/LocationRadarAndResilience';
import { 
  LocationAlertSettingsModal, 
  LocationComparisonModal, 
  LocationAuditReportModal, 
  LocationEditModal 
} from '../locations/LocationModals';

// Default initial monitored places
const INITIAL_SAVED_PLACES = [
  {
    id: 'loc-1',
    name: 'Home (Hindmata Apartment)',
    type: 'Home',
    ward: 'F-North',
    elevation: '+4.2m MSL',
    drainageDistance: '45m from Hindmata Box Drain',
    currentDepth: 18,
    peakDepth: 34,
    peakArrivalMin: 72,
    riskLevel: 'critical',
    alertActive: true,
    lastInspected: '3 mins ago',
    pinned: true,
    alertThresholdCm: 15
  },
  {
    id: 'loc-2',
    name: 'Workplace (BKC Tower 3)',
    type: 'Office',
    ward: 'H-East',
    elevation: '+11.8m MSL',
    drainageDistance: '210m from Mithi River Embankment',
    currentDepth: 3,
    peakDepth: 8,
    peakArrivalMin: 120,
    riskLevel: 'safe',
    alertActive: true,
    lastInspected: '1 min ago',
    pinned: false,
    alertThresholdCm: 20
  },
  {
    id: 'loc-3',
    name: 'Parents Residence (Dadar West)',
    type: 'Family',
    ward: 'G-North',
    elevation: '+7.5m MSL',
    drainageDistance: '120m from Senapati Bapat Marg Drain',
    currentDepth: 7,
    peakDepth: 15,
    peakArrivalMin: 90,
    riskLevel: 'moderate',
    alertActive: true,
    lastInspected: '5 mins ago',
    pinned: false,
    alertThresholdCm: 15
  },
  {
    id: 'loc-4',
    name: 'Daughter\'s School (St. Mary\'s Matunga)',
    type: 'School',
    ward: 'F-North',
    elevation: '+5.1m MSL',
    drainageDistance: '95m from Kings Circle Culvert',
    currentDepth: 22,
    peakDepth: 38,
    peakArrivalMin: 45,
    riskLevel: 'danger',
    alertActive: true,
    lastInspected: 'Just now',
    pinned: true,
    alertThresholdCm: 10
  }
];

export default function LocationRisk() {
  const { currentWard, currentTimeline, timelineIndex, setTimelineIndex, timelineSlices } = useFlood();
  const { navigateTo } = useNavigation();

  // Saved user locations with LocalStorage persistence
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      const stored = localStorage.getItem('mumbai_flood_user_places');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_SAVED_PLACES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mumbai_flood_user_places', JSON.stringify(savedPlaces));
    } catch (e) {}
  }, [savedPlaces]);

  // Active selections & filters
  const [selectedLocationId, setSelectedLocationId] = useState(() => savedPlaces[0]?.id || 'loc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  
  // Tab categories & Active tab
  const [tabGroup, setTabGroup] = useState('ALL'); // 'ALL' | 'HYDRAULICS' | 'INFRA' | 'RESILIENCE' | 'COMMUNITY'
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Hydrograph time-slice selection
  const [selectedTimeSliceIdx, setSelectedTimeSliceIdx] = useState(timelineIndex || 0);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Place
  const selectedPlace = savedPlaces.find(p => p.id === selectedLocationId) || savedPlaces[0] || INITIAL_SAVED_PLACES[0];

  // Helper for place icons
  const getPlaceIcon = (type) => {
    switch (type) {
      case 'Home': return Home;
      case 'Office': return Building2;
      case 'School': return School;
      case 'Family': return Heart;
      default: return Building2;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'safe': return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'low': return 'text-emerald-900 bg-emerald-50 border-emerald-200';
      case 'moderate': return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'danger': return 'text-orange-800 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-900 bg-red-100 border-red-300';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  // Filtered & Sorted Places
  const filteredPlaces = useMemo(() => {
    return savedPlaces
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.drainageDistance.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || p.type.toLowerCase() === categoryFilter.toLowerCase();
        const matchesSeverity = severityFilter === 'ALL' || p.riskLevel.toLowerCase() === severityFilter.toLowerCase();
        return matchesSearch && matchesCategory && matchesSeverity;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.peakDepth - a.peakDepth;
      });
  }, [savedPlaces, searchQuery, categoryFilter, severityFilter]);

  // Handlers for Location CRUD & State
  const handleSavePlace = (placeData) => {
    if (editingPlace) {
      setSavedPlaces(prev => prev.map(p => p.id === placeData.id ? { ...p, ...placeData } : p));
      showToast(`Updated "${placeData.name}" successfully.`);
    } else {
      setSavedPlaces(prev => [placeData, ...prev]);
      setSelectedLocationId(placeData.id);
      showToast(`Added "${placeData.name}" to monitored places.`);
    }
    setEditingPlace(null);
  };

  const handleDeletePlace = (id, name, e) => {
    e.stopPropagation();
    if (savedPlaces.length <= 1) {
      showToast("Cannot delete the only remaining monitored location.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove "${name}" from your monitored locations?`)) {
      setSavedPlaces(prev => prev.filter(p => p.id !== id));
      if (selectedLocationId === id) {
        const remaining = savedPlaces.filter(p => p.id !== id);
        setSelectedLocationId(remaining[0]?.id || 'loc-1');
      }
      showToast(`Removed "${name}" from monitored places.`);
    }
  };

  const handleTogglePin = (id, e) => {
    e.stopPropagation();
    setSavedPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const newPinned = !p.pinned;
        showToast(newPinned ? `Pinned "${p.name}" to top.` : `Unpinned "${p.name}".`);
        return { ...p, pinned: newPinned };
      }
      return p;
    }));
  };

  const handleToggleAlert = (id, e) => {
    e.stopPropagation();
    setSavedPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.alertActive;
        showToast(newStatus ? `Alerts activated for "${p.name}".` : `Alerts muted for "${p.name}".`);
        return { ...p, alertActive: newStatus };
      }
      return p;
    }));
  };

  // Hydrograph Trajectory data for the active place
  const hydrographPoints = [
    { time: 'T+0m', label: 'NOW', depth: selectedPlace.currentDepth, rain: 22, vel: '0.2 m/s' },
    { time: 'T+30m', label: '+30m', depth: Math.round(selectedPlace.currentDepth * 1.3), rain: 35, vel: '0.4 m/s' },
    { time: 'T+60m', label: '+60m', depth: selectedPlace.peakDepth, rain: 48, vel: '0.7 m/s' },
    { time: 'T+90m', label: '+90m', depth: Math.round(selectedPlace.peakDepth * 0.9), rain: 38, vel: '0.5 m/s' },
    { time: 'T+120m', label: '+120m', depth: Math.round(selectedPlace.peakDepth * 0.7), rain: 25, vel: '0.3 m/s' },
    { time: 'T+180m', label: '+180m', depth: Math.round(selectedPlace.peakDepth * 0.4), rain: 12, vel: '0.1 m/s' },
  ];

  const activeHydroPoint = hydrographPoints[selectedTimeSliceIdx] || hydrographPoints[0];

  // All 11 Feature Tabs configured
  const ALL_TABS = [
    { id: 'overview', label: 'Hydrograph & Ingress', icon: TrendingUp, group: 'HYDRAULICS' },
    { id: 'cross-section', label: 'Cross-Section Ingress', icon: Building2, group: 'HYDRAULICS' },
    { id: 'map', label: 'Catchment Radar', icon: Activity, group: 'HYDRAULICS' },
    { id: 'simulator', label: 'Scenario Simulator', icon: Sliders, group: 'HYDRAULICS' },
    { id: 'drainage', label: 'Drains & IoT Sensors', icon: Waves, group: 'INFRA' },
    { id: 'pumping', label: 'Pumps & Recession Clock', icon: Timer, group: 'INFRA' },
    { id: 'radar', label: 'Doppler Cloudburst Radar', icon: Radar, group: 'INFRA' },
    { id: 'building', label: 'Building & Utilities', icon: Layers, group: 'INFRA' },
    { id: 'evacuation', label: 'Shelters & Vehicle', icon: Car, group: 'RESILIENCE' },
    { id: 'supplies', label: 'Supplies & Photo Vault', icon: Package, group: 'RESILIENCE' },
    { id: 'resilience', label: 'Resilience Scorecard', icon: Award, group: 'RESILIENCE' },
    { id: 'family', label: 'Family & Checklist', icon: Users, group: 'COMMUNITY' },
    { id: 'community', label: 'Equipment & Ward SOS', icon: Wrench, group: 'COMMUNITY' },
  ];

  const visibleTabs = useMemo(() => {
    if (tabGroup === 'ALL') return ALL_TABS;
    return ALL_TABS.filter(t => t.group === tabGroup);
  }, [tabGroup]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-mono px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> Hyper-Local Basin Profiler & 25-Point Early Warning Engine
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">Monitored Locations & Catchment Risk</h1>
          <p className="text-sm text-muted mt-1">
            Continuous micro-topography elevation, storm-drain proximity, cross-section ingress, Doppler radar, and community resilience for your Mumbai properties.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setIsComparisonOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-ink font-semibold text-xs border border-slate-200 shadow-sm transition"
          >
            <Columns className="w-4 h-4 text-purple-primary" /> Compare All ({savedPlaces.length})
          </button>
          <button 
            onClick={() => setIsAuditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-ink font-semibold text-xs border border-slate-200 shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-purple-primary" /> Audit Card
          </button>
          <button 
            onClick={() => {
              setEditingPlace(null);
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Place to Watchlist
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name, ward (e.g. F-North), or drain landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-primary bg-slate-50/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/70 overflow-x-auto">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 px-2 font-mono uppercase tracking-wider shrink-0">
              <Filter className="w-3 h-3 text-purple-primary" /> Category
            </span>
            {['ALL', 'Home', 'Office', 'School', 'Family'].map(cat => {
              const count = cat === 'ALL' 
                ? savedPlaces.length 
                : savedPlaces.filter(p => p.type.toLowerCase() === cat.toLowerCase()).length;
              const isSelected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected 
                      ? 'bg-purple-primary text-white font-semibold shadow-sm' 
                      : 'text-slate-600 hover:text-ink hover:bg-slate-200/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-purple-700/60 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Risk Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/70 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 px-2 font-mono uppercase tracking-wider shrink-0">
              Risk
            </span>
            {['ALL', 'critical', 'danger', 'moderate', 'safe'].map(risk => {
              const isSelected = severityFilter === risk;
              return (
                <button
                  key={risk}
                  onClick={() => setSeverityFilter(risk)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl font-mono uppercase transition-all shrink-0 ${
                    isSelected 
                      ? 'bg-slate-800 text-white font-bold shadow-sm' 
                      : 'text-slate-600 hover:text-ink hover:bg-slate-200/60'
                  }`}
                >
                  {risk}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Monitored Cards List & In-Depth Profiler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Monitored Cards List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted uppercase tracking-wider mb-2">
            <span>Saved Sites ({filteredPlaces.length})</span>
            <span>Alerts & Priorities</span>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-ink">No monitored sites match your filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); setSeverityFilter('ALL'); }}
                className="mt-2 text-xs font-semibold text-purple-primary hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredPlaces.map(place => {
              const Icon = getPlaceIcon(place.type);
              const isSelected = place.id === selectedPlace.id;

              return (
                <div 
                  key={place.id}
                  onClick={() => setSelectedLocationId(place.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all relative ${
                    isSelected 
                      ? 'bg-purple-50/60 border-purple-primary shadow-card ring-1 ring-purple-primary/30' 
                      : 'bg-white border-slate-200/80 hover:border-purple-primary/40 hover:shadow-sm'
                  }`}
                >
                  {/* Top Row: Icon, Title, Actions, Risk Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-purple-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-ink text-sm sm:text-base leading-snug">{place.name}</h3>
                          {place.pinned && (
                            <Pin className="w-3.5 h-3.5 text-purple-primary fill-purple-primary shrink-0" title="Pinned location" />
                          )}
                        </div>
                        <span className="text-xs text-muted font-mono block mt-0.5">
                          Ward {place.ward} • {place.elevation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-bold uppercase border ${getRiskColor(place.riskLevel)}`}>
                        {place.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-[10px] text-muted block font-mono uppercase">Water Now</span>
                      <span className="text-base font-mono font-bold text-ink">{place.currentDepth} <span className="text-[10px] font-normal">cm</span></span>
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-[10px] text-muted block font-mono uppercase">Peak Pred.</span>
                      <span className="text-base font-mono font-bold text-purple-primary">{place.peakDepth} <span className="text-[10px] font-normal">cm</span></span>
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-[10px] text-muted block font-mono uppercase">Peak In</span>
                      <span className="text-base font-mono font-bold text-slate-700">+{place.peakArrivalMin} <span className="text-[10px] font-normal">m</span></span>
                    </div>
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs text-muted">
                    <span className="font-mono text-[10px]">{place.lastInspected}</span>

                    <div className="flex items-center gap-1">
                      {/* Pin Toggle */}
                      <button 
                        onClick={(e) => handleTogglePin(place.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          place.pinned ? 'text-purple-primary bg-purple-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={place.pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Alert Active Toggle */}
                      <button 
                        onClick={(e) => handleToggleAlert(place.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          place.alertActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={place.alertActive ? 'Alerts Active (Click to mute)' : 'Alerts Muted (Click to activate)'}
                      >
                        {place.alertActive ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlace(place);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button 
                        onClick={(e) => handleDeletePlace(place.id, place.name, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove Location"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: In-Depth Micro-Basin Profiler for Selected Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header of Active Place */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
                    Micro-Basin Hydraulics
                  </span>
                  <span className="text-xs text-muted font-mono">• Ward {selectedPlace.ward}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">{selectedPlace.name}</h2>
                <p className="text-xs text-muted font-mono mt-0.5">
                  Inspected {selectedPlace.lastInspected} • Sensor Cluster 4B • Trigger: {selectedPlace.alertThresholdCm || 15}cm
                </p>
              </div>

              {/* Top Quick Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAlertSettingsOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Configure Geo-Fence Alert Thresholds"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigateTo('route')}
                  className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  Safe Route Here <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Segmented Category Filter for Diagnostic Views */}
            <div className="pt-4 pb-2 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-purple-primary" />
                  <span>DIAGNOSTIC VIEW FOCUS:</span>
                </span>
                <span className="text-[10px] font-mono text-muted">
                  Showing {visibleTabs.length} of {ALL_TABS.length} diagnostic modules
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/60">
                {[
                  { id: 'ALL', label: 'All 13 Views', icon: Layers, count: 13 },
                  { id: 'HYDRAULICS', label: 'Hydraulics & Ingress', icon: Waves, count: 4 },
                  { id: 'INFRA', label: 'Infrastructure & Telemetry', icon: Activity, count: 4 },
                  { id: 'RESILIENCE', label: 'Preparedness & Resilience', icon: ShieldCheck, count: 3 },
                  { id: 'COMMUNITY', label: 'Community & SOS', icon: Users, count: 2 },
                ].map(grp => {
                  const GrpIcon = grp.icon;
                  const isSelected = tabGroup === grp.id;
                  return (
                    <button
                      key={grp.id}
                      onClick={() => {
                        setTabGroup(grp.id);
                        if (grp.id !== 'ALL') {
                          const tabsInGroup = ALL_TABS.filter(t => t.group === grp.id);
                          if (!tabsInGroup.some(t => t.id === activeTab)) {
                            setActiveTab(tabsInGroup[0]?.id || 'overview');
                          }
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isSelected 
                          ? 'bg-white text-purple-primary font-bold shadow-sm ring-1 ring-purple-primary/20' 
                          : 'text-slate-600 hover:text-ink hover:bg-white/60'
                      }`}
                    >
                      <GrpIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-primary' : 'text-slate-400'}`} />
                      <span>{grp.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-purple-100 text-purple-primary font-bold' : 'bg-slate-200/80 text-slate-500'
                      }`}>
                        {grp.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature Tabs Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-100 text-xs font-semibold">
              {visibleTabs.map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                      isActive 
                        ? 'bg-purple-primary text-white shadow-sm font-bold' 
                        : 'text-slate-600 hover:text-ink hover:bg-slate-100'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: OVERVIEW & HYDROGRAPH */}
            {activeTab === 'overview' && (
              <div className="pt-5 space-y-6">
                {/* 4 Core Geographical Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200/60">
                    <span className="text-[10px] font-mono text-muted uppercase block">Surface Elevation</span>
                    <span className="text-lg font-mono font-extrabold text-ink">{selectedPlace.elevation}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">CartoDEM 5m raster</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200/60">
                    <span className="text-[10px] font-mono text-muted uppercase block">Drain Proximity</span>
                    <span className="text-lg font-mono font-extrabold text-purple-primary">{selectedPlace.drainageDistance.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 truncate">{selectedPlace.drainageDistance.split('from ')[1] || 'Storm network'}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200/60">
                    <span className="text-[10px] font-mono text-muted uppercase block">Soil Infiltration</span>
                    <span className="text-lg font-mono font-extrabold text-ink">4.2 mm/h</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Saturated clay/paved</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200/60">
                    <span className="text-[10px] font-mono text-muted uppercase block">GNN Ensemble</span>
                    <span className="text-lg font-mono font-extrabold text-emerald-700">94.8%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Confidence Agree</span>
                  </div>
                </div>

                {/* 0-3h Interactive Hydrograph with Clickable Slices */}
                <div className="bg-canvas rounded-2xl p-5 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-primary" />
                      <h3 className="text-sm font-bold text-ink">0–3h Water Depth Forecast Trajectory</h3>
                    </div>
                    <span className="text-xs font-mono text-muted">
                      Selected: <span className="font-bold text-purple-primary">{activeHydroPoint.time}</span> ({activeHydroPoint.depth}cm)
                    </span>
                  </div>

                  {/* Interactive Bar Chart */}
                  <div className="grid grid-cols-6 gap-2 text-center items-end h-32 pt-4">
                    {hydrographPoints.map((item, idx) => {
                      const heightPercent = Math.min(100, (item.depth / 50) * 100);
                      const isHigh = item.depth > 20;
                      const isSelectedTime = selectedTimeSliceIdx === idx;

                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedTimeSliceIdx(idx)}
                          className={`flex flex-col items-center h-full justify-end cursor-pointer group p-1 rounded-xl transition ${
                            isSelectedTime ? 'bg-purple-100/60 ring-1 ring-purple-primary' : 'hover:bg-slate-100'
                          }`}
                        >
                          <span className={`text-[10px] font-mono font-bold mb-1 ${
                            isSelectedTime ? 'text-purple-primary' : 'text-ink'
                          }`}>
                            {item.depth}cm
                          </span>
                          <div className="w-full bg-slate-200 rounded-t-lg relative overflow-hidden h-20 flex items-end">
                            <div 
                              className={`w-full transition-all rounded-t-lg ${
                                isHigh ? 'bg-red-500' : item.depth > 10 ? 'bg-amber-500' : 'bg-purple-primary'
                              } ${isSelectedTime ? 'brightness-110' : ''}`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                          <span className={`text-[9px] font-mono mt-1.5 ${
                            isSelectedTime ? 'font-bold text-purple-primary' : 'text-muted'
                          }`}>
                            {item.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hydrograph Detailed Telemetry Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                      <span className="text-muted block text-[10px]">Rain Rate at {activeHydroPoint.time}</span>
                      <span className="font-bold text-ink">{activeHydroPoint.rain} mm/h</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                      <span className="text-muted block text-[10px]">Predicted Flow Velocity</span>
                      <span className="font-bold text-amber-700">{activeHydroPoint.vel}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                      <span className="text-muted block text-[10px]">Sump Pump State</span>
                      <span className="font-bold text-emerald-700">Online (Discharging)</span>
                    </div>
                  </div>
                </div>

                {/* Neighborhood Safeguards Alert Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Basement & Ground Level Water Ingress Advisory
                    </h4>
                    <p className="text-xs text-amber-800/90 leading-relaxed mt-1">
                      At expected peak depth ({selectedPlace.peakDepth} cm at +{selectedPlace.peakArrivalMin} min), 
                      sub-surface parking lots in low-lying quadrants of {selectedPlace.ward} must deploy flood gates. Relocate parked two-wheelers to upper stilt ramps before T+45m.
                    </p>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Automated Geo-Fence Alerts Active ({selectedPlace.alertThresholdCm || 15}cm threshold)
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigateTo('report')}
                      className="px-4 py-2 rounded-xl bg-canvas hover:bg-slate-100 text-xs font-semibold text-ink border border-slate-200 transition-colors"
                    >
                      Submit Ground Report
                    </button>
                    <button 
                      onClick={() => navigateTo('safe-places')}
                      className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-xs font-semibold text-white transition-colors"
                    >
                      Nearest Safe Shelter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: FEATURE 16 - CROSS-SECTION VISUALIZER */}
            {activeTab === 'cross-section' && (
              <div className="pt-5">
                <LocationCrossSection selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 3: FEATURE 1 - CATCHMENT MAP RADAR */}
            {activeTab === 'map' && (
              <div className="pt-5">
                <LocationCatchmentMap 
                  selectedPlace={selectedPlace} 
                  onSelectSensor={(sen) => showToast(`Selected sensor ${sen.name}: ${sen.depth}cm (${sen.trend})`)}
                  onSelectShelter={(sh) => showToast(`Selected shelter ${sh.name}: ${sh.elev} elevation`)}
                />
              </div>
            )}

            {/* TAB CONTENT 4: FEATURE 2 - SCENARIO SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="pt-5">
                <LocationFloodSimulator selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 5: FEATURES 4 & 5 - DRAINAGE & IOT SENSORS */}
            {activeTab === 'drainage' && (
              <div className="pt-5">
                <LocationDrainageAndSensors selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 6: FEATURES 19 & 20 - PUMPS & RECESSION CLOCK */}
            {activeTab === 'pumping' && (
              <div className="pt-5">
                <LocationPumpingAndRecession selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 7: FEATURE 24 - DOPPLER CLOUDBURST RADAR */}
            {activeTab === 'radar' && (
              <div className="pt-5">
                <LocationRadarAndResilience selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 8: FEATURES 3 & 8 - BUILDING & UTILITIES */}
            {activeTab === 'building' && (
              <div className="pt-5">
                <LocationBuildingVulnerability selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 9: FEATURES 6 & 7 - EVACUATION & VEHICLES */}
            {activeTab === 'evacuation' && (
              <div className="pt-5">
                <LocationEvacuationAndVehicle selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 10: FEATURES 17 & 18 - SUPPLIES & PHOTO VAULT */}
            {activeTab === 'supplies' && (
              <div className="pt-5">
                <LocationSuppliesAndPhotos selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 11: FEATURE 25 - RESILIENCE SCORECARD */}
            {activeTab === 'resilience' && (
              <div className="pt-5">
                <LocationRadarAndResilience selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 12: FEATURES 10, 11, 12, 13 - FAMILY & CHECKLIST */}
            {activeTab === 'family' && (
              <div className="pt-5">
                <LocationSafetyAndFamily selectedPlace={selectedPlace} />
              </div>
            )}

            {/* TAB CONTENT 13: FEATURES 21, 22, 23 - COMMUNITY & WARD SOS */}
            {activeTab === 'community' && (
              <div className="pt-5">
                <LocationCommunityAndHealth selectedPlace={selectedPlace} />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Add / Edit Location Modal */}
      {isEditModalOpen && (
        <LocationEditModal 
          place={editingPlace}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPlace(null);
          }}
          onSave={handleSavePlace}
        />
      )}

      {/* 2. Geo-Fence Alert Settings Modal */}
      {isAlertSettingsOpen && (
        <LocationAlertSettingsModal 
          place={selectedPlace}
          onClose={() => setIsAlertSettingsOpen(false)}
          onSave={(updated) => {
            setSavedPlaces(prev => prev.map(p => p.id === updated.id ? updated : p));
            showToast(`Alert thresholds updated for "${updated.name}".`);
          }}
        />
      )}

      {/* 3. Comparison Modal */}
      {isComparisonOpen && (
        <LocationComparisonModal 
          places={savedPlaces}
          selectedId={selectedPlace.id}
          onSelectPlace={(id) => setSelectedLocationId(id)}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}

      {/* 4. Audit Report Modal */}
      {isAuditModalOpen && (
        <LocationAuditReportModal 
          place={selectedPlace}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}
    </div>
  );
}
