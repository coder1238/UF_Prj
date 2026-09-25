import React, { useState, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { INITIAL_HUBS_DATA, SCENARIOS, VEHICLE_CLEARANCES } from '../../data/scannerData';

// Subcomponents & Modals
import CctvVisionModal from '../scanner/CctvVisionModal';
import BasementDiagnosticsDrawer from '../scanner/BasementDiagnosticsDrawer';
import CitizenIngressLensModal from '../scanner/CitizenIngressLensModal';
import CrowdVerificationModal from '../scanner/CrowdVerificationModal';
import HubSafetyPassModal from '../scanner/HubSafetyPassModal';
import HubRadarMapModal from '../scanner/HubRadarMapModal';
import RoutePreviewDrawer from '../scanner/RoutePreviewDrawer';

import { 
  Building, ShoppingBag, Train, Car, ShieldCheck, AlertTriangle, 
  CheckCircle2, XCircle, Search, Filter, RefreshCw, Eye, Camera,
  MapPin, Clock, ArrowRight, Volume2, Star, Bell, BellRing, Compass,
  SlidersHorizontal, ChevronDown, ChevronUp, Radio, Share2, Footprints,
  Bike, Zap, Shield, AlertCircle, Droplets, Gauge, ArrowUpRight, Check
} from 'lucide-react';

export default function PlaceStatusScanner() {
  const { currentWard, vehicleType, setVehicleType, speakAlert } = useFlood();
  const { navigateTo, setActivePage } = useNavigation();

  // Primary hubs state
  const [hubs, setHubs] = useState(INITIAL_HUBS_DATA);
  const [activeScenario, setActiveScenario] = useState('current');

  // Filters & Search
  const [category, setCategory] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPassable, setOnlyPassable] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('depth_desc'); // 'depth_desc' | 'depth_asc' | 'risk' | 'name'

  // View mode: 'grid' or 'radar'
  const [viewMode, setViewMode] = useState('grid');

  // Scanning animation state
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');

  // Expandable details state per card (id -> boolean)
  const [expandedForecasts, setExpandedForecasts] = useState({});
  const [expandedUtilities, setExpandedUtilities] = useState({});

  // LocalStorage-backed state: Bookmarks / Favorites & Alert Subscriptions
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('flood_hub_favorites');
      return saved ? JSON.parse(saved) : ['p-1', 'p-2'];
    } catch {
      return ['p-1', 'p-2'];
    }
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('flood_hub_subscriptions');
      return saved ? JSON.parse(saved) : ['p-1', 'p-4'];
    } catch {
      return ['p-1', 'p-4'];
    }
  });

  // Simulated Push Notification Banner State
  const [simulatedAlert, setSimulatedAlert] = useState(null);

  // Active Modals & Drawers
  const [cctvModalHub, setCctvModalHub] = useState(null);
  const [basementDrawerHub, setBasementDrawerHub] = useState(null);
  const [crowdModalHub, setCrowdModalHub] = useState(null);
  const [passModalHub, setPassModalHub] = useState(null);
  const [routeDrawerHub, setRouteDrawerHub] = useState(null);
  const [showLensModal, setShowLensModal] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);

  // Save favorites & subscriptions to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('flood_hub_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('flood_hub_subscriptions', JSON.stringify(subscriptions));
    } catch (e) {
      console.error(e);
    }
  }, [subscriptions]);

  // Handle Scenario Switcher: modifies water depths dynamically
  const handleScenarioChange = (scenarioId) => {
    setActiveScenario(scenarioId);
    const scen = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];

    setHubs(prevHubs => prevHubs.map(hub => {
      const initialHub = INITIAL_HUBS_DATA.find(h => h.id === hub.id) || hub;
      const newDepth = Math.round(initialHub.waterDepth * scen.multiplier);
      
      let newSeverity = 'safe';
      let newStatusLabel = initialHub.statusLabel;

      if (newDepth > 25) {
        newSeverity = 'critical';
        newStatusLabel = `Submerged Ingress (${newDepth} cm)`;
      } else if (newDepth > 10) {
        newSeverity = 'caution';
        newStatusLabel = `Ponding Caution (${newDepth} cm)`;
      } else {
        newSeverity = 'safe';
        newStatusLabel = 'Dry & Accessible';
      }

      return {
        ...hub,
        waterDepth: newDepth,
        severity: newSeverity,
        statusLabel: newStatusLabel,
        lastVerified: 'Just now (Scenario Sync)'
      };
    }));

    if (speakAlert) {
      speakAlert(`Monsoon scenario switched to ${scen.name}. All gateway sensors recalibrated.`);
    }
  };

  // Workable Feature: Rescan IoT sensors with multi-stage progress
  const handleRescan = () => {
    setScanning(true);
    setScanStep('Pinging 14 LoRaWAN Depth Transceivers...');

    setTimeout(() => {
      setScanStep('Analyzing Doppler Radar & Tidal Outflows...');
    }, 400);

    setTimeout(() => {
      setScanStep('Calibrating Optical CCTV Edge Vectors...');
    }, 800);

    setTimeout(() => {
      // Apply slight realistic variation to depths
      setHubs(prev => prev.map(hub => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2 cm
        const updatedDepth = Math.max(0, hub.waterDepth + delta);
        return {
          ...hub,
          waterDepth: updatedDepth,
          lastVerified: 'Just now',
          trustScore: Math.min(100, Math.max(85, (hub.trustScore || 90) + (Math.random() > 0.5 ? 1 : 0)))
        };
      }));

      setScanning(false);
      setScanStep('');

      if (speakAlert) {
        speakAlert('Gateway sensor telemetry updated. 14 optical checkpoints synchronized.');
      }
    }, 1200);
  };

  // Toggle favorite / bookmark
  const toggleFavorite = (hubId) => {
    if (favorites.includes(hubId)) {
      setFavorites(favorites.filter(id => id !== hubId));
    } else {
      setFavorites([...favorites, hubId]);
    }
  };

  // Toggle alert subscription
  const toggleSubscription = (hub) => {
    if (subscriptions.includes(hub.id)) {
      setSubscriptions(subscriptions.filter(id => id !== hub.id));
    } else {
      setSubscriptions([...subscriptions, hub.id]);
      // Trigger a simulated notification banner
      setSimulatedAlert({
        hubName: hub.name,
        message: `Alert subscription confirmed for ${hub.name}. You will receive instant push notifications when water ingress exceeds 15 cm.`,
        timestamp: new Date().toLocaleTimeString()
      });
      setTimeout(() => setSimulatedAlert(null), 6000);
    }
  };

  // Fire a simulated test notification
  const handleSimulateAlertTrigger = () => {
    const subscribedHub = hubs.find(h => subscriptions.includes(h.id)) || hubs[0];
    setSimulatedAlert({
      hubName: subscribedHub.name,
      message: `HIGH WATER WARNING: ${subscribedHub.name} entrance water depth has surged to ${subscribedHub.waterDepth} cm. Basement flood barriers are deploying!`,
      timestamp: new Date().toLocaleTimeString()
    });
    if (speakAlert) {
      speakAlert(`Emergency alert for ${subscribedHub.name}. Entrance water depth is ${subscribedHub.waterDepth} centimeters.`);
    }
  };

  // Update a single hub from crowd verification modal
  const handleUpdateHub = (updatedHub) => {
    setHubs(prev => prev.map(h => h.id === updatedHub.id ? updatedHub : h));
  };

  // Audio readout for entire scanner summary
  const handleSpeakOverview = () => {
    const criticalCount = hubs.filter(h => h.severity === 'critical').length;
    const safeCount = hubs.filter(h => h.severity === 'safe').length;
    const speech = `Place status summary. Out of ${hubs.length} scanned hubs, ${safeCount} are completely safe and dry, while ${criticalCount} have critical entrance waterlogging. Phoenix Mall and Andheri Subway require high-ground diversion.`;
    if (speakAlert) {
      speakAlert(speech);
    }
  };

  // Vehicle clearance check
  const activeVehicleProfile = VEHICLE_CLEARANCES[vehicleType] || VEHICLE_CLEARANCES.sedan;

  // Filtered & Sorted places
  const filteredPlaces = hubs.filter(p => {
    const matchesCat = category === 'all' || p.type === category;
    const matchesSeverity = severityFilter === 'all' || p.severity === severityFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.approachRoad.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPassable = !onlyPassable || p.waterDepth <= activeVehicleProfile.clearance;
    const matchesFav = !onlyFavorites || favorites.includes(p.id);

    return matchesCat && matchesSeverity && matchesSearch && matchesPassable && matchesFav;
  }).sort((a, b) => {
    if (sortBy === 'depth_desc') return b.waterDepth - a.waterDepth;
    if (sortBy === 'depth_asc') return a.waterDepth - b.waterDepth;
    if (sortBy === 'risk') {
      const order = { critical: 3, caution: 2, safe: 1 };
      return order[b.severity] - order[a.severity];
    }
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getStatusBadge = (sev) => {
    switch (sev) {
      case 'safe':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'caution':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'critical':
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Simulated Live Alert Banner */}
      {simulatedAlert && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg border border-red-500 flex items-start justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <BellRing className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block text-red-200">
                Live Hub Warning Push Notification • {simulatedAlert.timestamp}
              </span>
              <h4 className="font-bold text-sm mt-0.5">{simulatedAlert.hubName}</h4>
              <p className="text-xs text-red-100 mt-1 leading-relaxed">{simulatedAlert.message}</p>
            </div>
          </div>
          <button
            onClick={() => setSimulatedAlert(null)}
            className="p-1 rounded-lg hover:bg-red-700 transition"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" /> Transit, Commercial & Underpass Gateway Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Place & Hub Status Scanner
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Real-time optical ingress detection, multi-level basement parking flood gates, and CCTV sensor checkpoints across Greater Mumbai.
          </p>
        </div>

        {/* Top Action Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio Overview TTS */}
          <button
            onClick={handleSpeakOverview}
            className="p-2.5 rounded-xl bg-canvas hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
            title="Readout Overview in Audio"
          >
            <Volume2 className="w-4 h-4 text-purple-primary" />
          </button>

          {/* AR Camera / Photo Scanner Lens */}
          <button
            onClick={() => setShowLensModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary border border-purple-200 font-semibold text-xs transition"
          >
            <Camera className="w-4 h-4" />
            <span>Citizen Lens (AR Scan)</span>
          </button>

          {/* Tactical Radar Map View */}
          <button
            onClick={() => setShowRadarModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
          >
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Hub Tactical Radar</span>
          </button>

          {/* Rescan IoT Sensors */}
          <button 
            onClick={handleRescan}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? (scanStep || 'Syncing Sensors...') : 'Refresh Optical Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Feature 4: Scenario Stress-Test Bar */}
      <div className="bg-canvas border border-slate-200/90 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-primary" />
            <span className="text-xs font-mono font-bold uppercase text-ink">
              Monsoon Stress-Test Simulation Matrix
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted">
            Test how entrance flood gates & subways respond under cloudbursts
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SCENARIOS.map(scen => (
            <button
              key={scen.id}
              onClick={() => handleScenarioChange(scen.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition border ${
                activeScenario === scen.id
                  ? `${scen.badgeColor} shadow-sm font-bold ring-2 ring-purple-400/40`
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>
      </div>
      {/* Vehicle Clearance & Test Trigger Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Vehicle Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 mr-1">
            <Car className="w-4 h-4 text-purple-primary" /> Calibrate Clearance:
          </span>
          {Object.entries(VEHICLE_CLEARANCES).map(([key, prof]) => (
            <button
              key={key}
              onClick={() => setVehicleType(key)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                vehicleType === key
                  ? 'bg-purple-primary text-white font-bold shadow-sm'
                  : 'bg-canvas text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {prof.name} ({prof.clearance}cm)
            </button>
          ))}
        </div>

        {/* Quick passability toggle & Alert Simulator */}
        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyPassable}
              onChange={e => setOnlyPassable(e.target.checked)}
              className="accent-purple-primary rounded"
            />
            <span>Passable Only ({activeVehicleProfile.clearance}cm)</span>
          </label>

          <button
            onClick={handleSimulateAlertTrigger}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1.5 border border-slate-300"
            title="Simulate sudden alert trigger on subscribed hub"
          >
            <Bell className="w-3.5 h-3.5 text-purple-primary" />
            <span>Test Alert Push</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'All Hubs' },
              { id: 'transit', label: 'Rail & Metro' },
              { id: 'commercial', label: 'Malls & Retail' },
              { id: 'office', label: 'Tech & Offices' },
              { id: 'hospital', label: 'Hospitals & Havens' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  category === c.id 
                    ? 'bg-purple-primary text-white shadow-sm' 
                    : 'bg-canvas text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {c.label}
              </button>
            ))}

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                onlyFavorites
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                  : 'bg-canvas text-slate-600 hover:bg-slate-100 border-slate-200/60'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>Watchlist ({favorites.length})</span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search hub, station, mall, ward..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
              />
            </div>

            {/* Severity Filter Dropdown */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-primary w-full sm:w-auto"
            >
              <option value="all">All Severities</option>
              <option value="safe">Safe Only</option>
              <option value="caution">Caution Only</option>
              <option value="critical">Critical Flooded</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-primary w-full sm:w-auto"
            >
              <option value="depth_desc">Water Depth (High to Low)</option>
              <option value="depth_asc">Water Depth (Low to High)</option>
              <option value="risk">Risk Severity</option>
              <option value="name">Hub Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Stats summary bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted pt-2 border-t border-slate-100">
          <span>Showing {filteredPlaces.length} of {hubs.length} gateways</span>
          <span className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold">
              {hubs.filter(h => h.severity === 'safe').length} Safe
            </span>
            <span className="text-amber-700 font-bold">
              {hubs.filter(h => h.severity === 'caution').length} Caution
            </span>
            <span className="text-red-700 font-bold">
              {hubs.filter(h => h.severity === 'critical').length} Critical Flooded
            </span>
          </span>
        </div>
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map(place => {
          const isFav = favorites.includes(place.id);
          const isSubscribed = subscriptions.includes(place.id);
          const isPassableForCar = place.waterDepth <= activeVehicleProfile.clearance;
          const isForecastOpen = expandedForecasts[place.id];
          const isUtilitiesOpen = expandedUtilities[place.id];

          return (
            <div 
              key={place.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group"
            >
              <div>
                {/* Card Top Utility Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-muted tracking-wider">
                        {place.ward}
                      </span>
                      <span className="text-[10px] font-mono text-purple-primary font-bold">
                        +{place.elevationMSL}m MSL
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-ink leading-snug mt-0.5">{place.name}</h2>
                  </div>

                  {/* Bookmark & Subscription Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSubscription(place)}
                      className={`p-1.5 rounded-lg transition ${
                        isSubscribed ? 'text-purple-primary bg-purple-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={isSubscribed ? 'Subscribed to push alerts' : 'Subscribe to push alerts'}
                    >
                      <Bell className={`w-4 h-4 ${isSubscribed ? 'fill-purple-primary' : ''}`} />
                    </button>

                    <button
                      onClick={() => toggleFavorite(place.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title="Bookmark to Watchlist"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                    </button>

                    <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-bold uppercase border shrink-0 ${getStatusBadge(place.severity)}`}>
                      {place.severity}
                    </span>
                  </div>
                </div>

                {/* Status Banner */}
                <div className={`p-3 rounded-xl text-xs font-bold font-mono mb-4 flex items-center justify-between gap-2 ${
                  place.severity === 'critical' ? 'bg-red-50 text-red-700' : place.severity === 'caution' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {place.severity === 'critical' ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{place.statusLabel}</span>
                  </div>
                  <span className="text-sm font-black shrink-0 font-mono">
                    {place.waterDepth} cm
                  </span>
                </div>

                {/* Feature 6: Vehicle Ingress Clearance Verdict */}
                <div className={`p-2 rounded-xl text-[11px] font-mono mb-4 flex items-center justify-between border ${
                  isPassableForCar ? 'bg-emerald-50/50 text-emerald-800 border-emerald-200' : 'bg-red-50/50 text-red-800 border-red-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" />
                    <span>{activeVehicleProfile.name} Clearance ({activeVehicleProfile.clearance}cm):</span>
                  </div>
                  <span className="font-bold">
                    {isPassableForCar ? 'CLEAR TO ENTER' : 'STALL RISK'}
                  </span>
                </div>

                {/* Deep Interactive Diagnostics Checklist */}
                <div className="space-y-2.5 text-xs text-slate-700 mb-5 font-sans">
                  {/* Basement with Click-to-Inspect Drawer */}
                  <button 
                    onClick={() => setBasementDrawerHub(place)}
                    className="w-full text-left flex items-start gap-2 p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 group/item"
                  >
                    <Car className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">Basement Gates: </span>
                        <span className="text-[10px] font-mono text-purple-primary font-bold group-hover/item:underline">
                          View Sump Telemetry →
                        </span>
                      </div>
                      <span className="text-muted block truncate">{place.basementParking.status}</span>
                    </div>
                  </button>

                  {/* Premises & Retail */}
                  <div className="flex items-start gap-2 px-2">
                    <Building className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ink">Premises: </span>
                      <span className="text-muted">{place.retailFloors}</span>
                    </div>
                  </div>

                  {/* Approach Road */}
                  <div className="flex items-start gap-2 px-2">
                    <MapPin className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ink">Approach: </span>
                      <span className="text-muted">{place.approachRoad}</span>
                    </div>
                  </div>

                  {/* Feature 8: Skywalk connection info if available */}
                  {place.skywalk?.available && (
                    <div className="flex items-start gap-2 px-2 py-1 rounded-lg bg-purple-50/50 text-purple-900 text-[11px] font-mono">
                      <Footprints className="w-3.5 h-3.5 text-purple-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Skywalk: </span>
                        <span>{place.skywalk.name} ({place.skywalk.status})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature 10: Alternative Safe Haven Recommender (if flooded) */}
                {place.alternativeHaven && (
                  <div className="mb-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
                    <span className="font-bold text-amber-900 block font-mono text-[10px] uppercase">
                      Dry Alternative Haven Suggested
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-ink">{place.alternativeHaven.name}</span>
                      <span className="font-mono text-purple-primary font-bold">{place.alternativeHaven.distanceKm} km</span>
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">{place.alternativeHaven.safeApproach}</p>
                  </div>
                )}

                {/* Expandable Accordions: Forecast Timeline & Utilities */}
                <div className="border-t border-slate-100 pt-3 mb-4 space-y-2">
                  {/* Feature 5: 0-3h Forecast Hydrograph Toggle */}
                  <button
                    onClick={() => setExpandedForecasts(prev => ({ ...prev, [place.id]: !prev[place.id] }))}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 hover:text-ink py-1"
                  >
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-purple-primary" />
                      0–3h Ingress Forecast Curve
                    </span>
                    {isForecastOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isForecastOpen && place.forecast && (
                    <div className="bg-canvas p-3 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center font-mono">
                        {place.forecast.map(f => (
                          <div key={f.time} className="space-y-1">
                            <span className="text-[9px] text-muted block">{f.time}</span>
                            <span className={`text-[11px] font-bold block ${
                              f.depth > 25 ? 'text-red-600' : f.depth > 10 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              {f.depth}cm
                            </span>
                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${f.depth > 25 ? 'bg-red-500' : f.depth > 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (f.depth / 60) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feature 9: Utility & Facility Continuity Matrix Toggle */}
                  <button
                    onClick={() => setExpandedUtilities(prev => ({ ...prev, [place.id]: !prev[place.id] }))}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 hover:text-ink py-1"
                  >
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-purple-primary" />
                      Power, Elevators & First Aid Status
                    </span>
                    {isUtilitiesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isUtilitiesOpen && place.utilities && (
                    <div className="bg-canvas p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px] animate-in fade-in duration-150">
                      <div className="flex justify-between">
                        <span className="text-muted">Grid / Generator:</span>
                        <span className="font-mono font-bold text-ink">
                          {place.utilities.gridPower ? 'Grid Online' : 'Running on DG Backup'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Elevators:</span>
                        <span className="font-mono text-ink text-right">{place.utilities.elevators}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Medical / First Aid:</span>
                        <span className="font-mono text-emerald-700 font-bold">{place.utilities.firstAid}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions Row */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {/* CCTV Badge (Clickable) and Crowd Verification Trigger */}
                <div className="flex items-center justify-between">
                  {/* Clickable CCTV Feed */}
                  <button 
                    onClick={() => setCctvModalHub(place)}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 hover:text-purple-primary transition group/cam"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600 group-hover/cam:scale-110 transition-transform" />
                    <span className="font-bold underline decoration-dotted">{place.cctvFeed?.id || 'CCTV'} Live Stream</span>
                  </button>

                  {/* Citizen Crowd Ground Verify Button */}
                  <button
                    onClick={() => setCrowdModalHub(place)}
                    className="text-[10px] font-mono text-purple-primary hover:text-purple-deep font-bold flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg transition"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verify Ground ({place.trustScore}%)</span>
                  </button>
                </div>

                {/* Primary Action Buttons: Safety Pass & Route Preview */}
                <div className="flex items-center gap-2">
                  {/* Official Safety Pass */}
                  <button
                    onClick={() => setPassModalHub(place)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-1 transition"
                    title="Export Official BMC Ingress Certificate"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Pass</span>
                  </button>

                  {/* Safe Route to Hub */}
                  <button 
                    onClick={() => setRouteDrawerHub(place)}
                    className="flex-1 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Safe Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Modals & Drawers */}
      {cctvModalHub && (
        <CctvVisionModal
          hub={cctvModalHub}
          onClose={() => setCctvModalHub(null)}
          onSpeak={speakAlert}
        />
      )}

      {basementDrawerHub && (
        <BasementDiagnosticsDrawer
          hub={basementDrawerHub}
          onClose={() => setBasementDrawerHub(null)}
          onSpeak={speakAlert}
        />
      )}

      {showLensModal && (
        <CitizenIngressLensModal
          onClose={() => setShowLensModal(false)}
          onSpeak={speakAlert}
          currentVehicle={vehicleType}
        />
      )}

      {crowdModalHub && (
        <CrowdVerificationModal
          hub={crowdModalHub}
          onClose={() => setCrowdModalHub(null)}
          onUpdateHub={handleUpdateHub}
          onSpeak={speakAlert}
        />
      )}

      {passModalHub && (
        <HubSafetyPassModal
          hub={passModalHub}
          onClose={() => setPassModalHub(null)}
        />
      )}

      {showRadarModal && (
        <HubRadarMapModal
          hubs={hubs}
          onClose={() => setShowRadarModal(false)}
          onInspectCctv={(hub) => {
            setShowRadarModal(false);
            setCctvModalHub(hub);
          }}
          onNavigateRoute={(hub) => {
            setShowRadarModal(false);
            setRouteDrawerHub(hub);
          }}
          onSpeak={speakAlert}
        />
      )}

      {routeDrawerHub && (
        <RoutePreviewDrawer
          hub={routeDrawerHub}
          vehicleType={vehicleType}
          onClose={() => setRouteDrawerHub(null)}
          onLaunchHud={(hub) => {
            setRouteDrawerHub(null);
            navigateTo('hud');
          }}
          onOpenFullRoute={(hub) => {
            setRouteDrawerHub(null);
            navigateTo('route');
          }}
          onSpeak={speakAlert}
        />
      )}
    </div>
  );
}
