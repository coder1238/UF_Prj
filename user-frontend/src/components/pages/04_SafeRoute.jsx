import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useFlood } from '../../context/FloodContext';
import SafeRouteMap from './route/SafeRouteMap';
import RouteElevationProfile from './route/RouteElevationProfile';
import TurnByTurnCueSheet from './route/TurnByTurnCueSheet';
import RouteDrivingSimulator from './route/RouteDrivingSimulator';
import VehicleCalibrator from './route/VehicleCalibrator';
import DepartureTimePlanner from './route/DepartureTimePlanner';
import RouteWaypointsManager from './route/RouteWaypointsManager';
import RouteFiltersAndAvoidance from './route/RouteFiltersAndAvoidance';
import VoiceGuidancePlayer from './route/VoiceGuidancePlayer';
import RouteWeatherTelemetry from './route/RouteWeatherTelemetry';
import OfflineRouteExporter from './route/OfflineRouteExporter';
import RouteSafetyScoreRadar from './route/RouteSafetyScoreRadar';
import SafeHavensDrawer from './route/SafeHavensDrawer';
import RoadClosuresFeed from './route/RoadClosuresFeed';
import EVFuelPenaltyCalculator from './route/EVFuelPenaltyCalculator';
import PedestrianSafetyAdvisor from './route/PedestrianSafetyAdvisor';
import TidalSurchargeClock from './route/TidalSurchargeClock';
import RouteComparisonModal from './route/RouteComparisonModal';
import RouteShareModal from './route/RouteShareModal';
import CrowdsourcedHazardModal from './route/CrowdsourcedHazardModal';
import EmergencySOSModal from './route/EmergencySOSModal';

import { 
  MUMBAI_LOCATIONS, 
  ROUTE_CORRIDORS 
} from '../../data/routePresetsData';

import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Crosshair, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  SlidersHorizontal, 
  Share2, 
  Columns3, 
  PhoneCall, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function SafeRoute() {
  const { navigateTo } = useNavigation();
  const { 
    vehicleType, 
    setVehicleType, 
    clearanceThreshold, 
    setClearanceThreshold, 
    isVoiceEnabled, 
    setIsVoiceEnabled, 
    voiceLanguage, 
    setVoiceLanguage, 
    speakAlert 
  } = useFlood();

  // Route selection & endpoints
  const [selectedRouteOption, setSelectedRouteOption] = useState('safer');
  const [originLocation, setOriginLocation] = useState(MUMBAI_LOCATIONS[0]); // Powai
  const [destLocation, setDestLocation] = useState(MUMBAI_LOCATIONS[1]);   // Airport T2
  const [originSearch, setOriginSearch] = useState(MUMBAI_LOCATIONS[0].name);
  const [destSearch, setDestSearch] = useState(MUMBAI_LOCATIONS[1].name);

  // Intermediate Waypoints
  const [waypoints, setWaypoints] = useState([]);

  // Simulation & scrub state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [scrubbedKm, setScrubbedKm] = useState(null);
  const [focusCoord, setFocusCoord] = useState(null);

  // Filters & Departure window
  const [departureWindow, setDepartureWindow] = useState('now');
  const [filters, setFilters] = useState({
    avoidSubways: true,
    preferFlyovers: true,
    avoidRiverBanks: false,
    avoidHighVelocity: false
  });

  // Modal dialog states
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHazardOpen, setIsHazardOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Active secondary tab on right side
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('elevation'); // 'elevation' | 'cue-sheet' | 'ai-score' | 'havens' | 'closures'

  const activeCorridor = ROUTE_CORRIDORS[selectedRouteOption] || ROUTE_CORRIDORS.safer;

  // Swap Origin and Destination
  const handleSwapLocations = () => {
    const tempLoc = originLocation;
    const tempText = originSearch;
    setOriginLocation(destLocation);
    setOriginSearch(destSearch);
    setDestLocation(tempLoc);
    setDestSearch(tempText);
    speakAlert("Route endpoints reversed.");
  };

  // Set Origin from GPS
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gpsLoc = {
            id: 'gps-current',
            name: 'Current GPS Location (High Accuracy)',
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            elevation: 16.5
          };
          setOriginLocation(gpsLoc);
          setOriginSearch(gpsLoc.name);
          speakAlert("Acquired GPS position for current location.");
        },
        () => {
          // Fallback to Powai
          setOriginLocation(MUMBAI_LOCATIONS[0]);
          setOriginSearch(MUMBAI_LOCATIONS[0].name);
        }
      );
    }
  };

  // Waypoints management
  const handleAddWaypoint = (wp) => {
    setWaypoints(prev => [...prev, wp]);
    speakAlert(`Added waypoint: ${wp.name}`);
  };

  const handleRemoveWaypoint = (idx) => {
    setWaypoints(prev => prev.filter((_, i) => i !== idx));
  };

  // Toggle restriction filter
  const handleToggleFilter = (filterKey) => {
    setFilters(prev => {
      const next = { ...prev, [filterKey]: !prev[filterKey] };
      // If preferFlyovers or avoidSubways is toggled on, auto-recommend 'safer'
      if ((filterKey === 'avoidSubways' || filterKey === 'preferFlyovers') && next[filterKey]) {
        setSelectedRouteOption('safer');
      }
      return next;
    });
  };

  // Start Navigation / Launch HUD
  const handleStartNavigation = () => {
    speakAlert(`Safe navigation started via ${activeCorridor.name}. Calibrated for ${vehicleType.toUpperCase()} with ${clearanceThreshold}cm clearance.`);
    navigateTo('hud');
  };

  // When turn is clicked in cue sheet
  const handleSelectTurn = (turn) => {
    // Pick an approximate coordinate along the corridor
    const coords = activeCorridor.coordinates;
    const stepIdx = Math.min(turn.step - 1, coords.length - 1);
    const coord = coords[stepIdx];
    if (coord) {
      setFocusCoord({ lng: coord[0], lat: coord[1] });
      speakAlert(turn.instruction);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Top Banner / Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-soft text-primary-deep text-[11px] font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> HYDRO-GNN MOBILITY WORKSTATION
            </span>
            <span className="text-xs text-ink-muted font-mono">
              • Calibrated for {vehicleType.toUpperCase()} ({clearanceThreshold}cm clearance)
            </span>
            <span className="text-xs text-emerald-700 font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Mithi Tidal Interceptor Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Plan a Safe Flood Route
          </h1>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl leading-relaxed">
            Real-time routing considers road MSL datum, Doppler cloudburst accumulation, subway closures, and hydrodynamic water velocity across Mumbai corridors.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-canvas hover:bg-surface-secondary text-ink border border-border text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Compare all 3 evaluated corridors side-by-side"
          >
            <Columns3 className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Compare</span> Matrix
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-2.5 rounded-xl bg-canvas hover:bg-surface-secondary text-ink border border-border text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Share route link with family or WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => setIsHazardOpen(true)}
            className="px-3 py-2.5 rounded-xl bg-canvas hover:bg-surface-secondary text-amber-700 border border-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Report real-time hazard on this route"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Report</span>
          </button>

          <button
            onClick={() => setIsSOSOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-card"
            title="Direct emergency hotline to BMC Disaster Cell 1916"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS 1916</span>
          </button>

          <button 
            onClick={handleStartNavigation}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition shadow-card flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch In-Cab HUD</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Two-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): Routing Origin/Dest, Mode, Waypoints, Corridor Options, Calibrators */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Origin & Destination Card */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted uppercase font-bold">
              <span>TRIP CORRIDOR ENDPOINTS</span>
              <button 
                onClick={handleLocateMe}
                className="text-primary hover:underline flex items-center gap-1 normal-case font-semibold"
              >
                <Crosshair className="w-3 h-3" /> Use GPS Location
              </button>
            </div>

            {/* Inputs with Swap Button */}
            <div className="relative space-y-2">
              {/* Origin */}
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 shadow-xs"></span>
                <input 
                  type="text" 
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  placeholder="Enter origin location..."
                  className="w-full bg-canvas border border-border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              {/* Swap Button (Floating) */}
              <button
                onClick={handleSwapLocations}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border border-border shadow-md text-ink-secondary hover:text-primary transition"
                title="Swap Origin and Destination"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>

              {/* Destination */}
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-purple-600 absolute left-3 top-1/2 -translate-y-1/2 shadow-xs"></span>
                <input 
                  type="text" 
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder="Enter destination location..."
                  className="w-full bg-canvas border border-border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:border-primary shadow-inner"
                />
              </div>
            </div>

            {/* Quick Mumbai Hub Presets */}
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase text-ink-muted block mb-1">
                Popular Mumbai Hubs:
              </span>
              <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                {MUMBAI_LOCATIONS.slice(0, 5).map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setDestLocation(loc);
                      setDestSearch(loc.name);
                    }}
                    className={`px-2 py-0.5 rounded-lg border transition ${
                      destLocation.id === loc.id
                        ? 'bg-purple-100 border-purple-300 text-purple-900 font-bold'
                        : 'bg-canvas border-border text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                    }`}
                  >
                    {loc.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Intermediate Waypoints Manager (Feature 4) */}
          <RouteWaypointsManager 
            waypoints={waypoints}
            onAddWaypoint={handleAddWaypoint}
            onRemoveWaypoint={handleRemoveWaypoint}
          />

          {/* Evaluated Route Corridors (3 Cards: Safe, Balanced, Fastest) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">
                EVALUATED ROUTE CORRIDORS (HYDRO-GNN ENGINE)
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">
                3 Options Analyzed
              </span>
            </div>

            {/* Option 1: RECOMMENDED SAFE ROUTE */}
            <div 
              onClick={() => setSelectedRouteOption('safer')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                selectedRouteOption === 'safer'
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-card ring-2 ring-emerald-500/20'
                  : 'border-border bg-white hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold">
                  RECOMMENDED SAFE ROUTE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  96% HYDRO-SAFE
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-ink">{ROUTE_CORRIDORS.safer.name}</h3>

              <div className="grid grid-cols-3 gap-2 my-2.5 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">ETA</span>
                  <span className="font-extrabold text-base text-ink">{ROUTE_CORRIDORS.safer.estimatedMinutes} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">DISTANCE</span>
                  <span className="font-bold text-ink">{ROUTE_CORRIDORS.safer.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">MAX WATER</span>
                  <span className="font-bold text-emerald-700">{ROUTE_CORRIDORS.safer.maxWaterDepthCm} cm</span>
                </div>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                {ROUTE_CORRIDORS.safer.description}
              </p>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRouteOption('safer');
                  handleStartNavigation();
                }}
                className="mt-3 w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Start Safe Navigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Option 2: BALANCED ROUTE */}
            <div 
              onClick={() => setSelectedRouteOption('balanced')}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedRouteOption === 'balanced'
                  ? 'border-amber-500 bg-amber-50/50 shadow-card ring-2 ring-amber-500/20'
                  : 'border-border bg-white hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                  BALANCED ROUTE
                </span>
                <span className="text-xs font-mono font-bold text-amber-700">74% SAFE</span>
              </div>

              <h3 className="font-bold text-sm text-ink">{ROUTE_CORRIDORS.balanced.name}</h3>

              <div className="grid grid-cols-3 gap-2 my-2 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">ETA</span>
                  <span className="font-bold text-ink">{ROUTE_CORRIDORS.balanced.estimatedMinutes} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">DISTANCE</span>
                  <span className="font-bold text-ink">{ROUTE_CORRIDORS.balanced.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">MAX WATER</span>
                  <span className="font-bold text-amber-700">{ROUTE_CORRIDORS.balanced.maxWaterDepthCm} cm</span>
                </div>
              </div>

              <p className="text-xs text-ink-secondary">
                {ROUTE_CORRIDORS.balanced.description}
              </p>
            </div>

            {/* Option 3: FASTEST ROUTE (HAZARDOUS) */}
            <div 
              onClick={() => setSelectedRouteOption('fastest')}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedRouteOption === 'fastest'
                  ? 'border-rose-500 bg-rose-50/50 shadow-card ring-2 ring-rose-500/20'
                  : 'border-border bg-white hover:border-rose-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold flex items-center gap-1 border border-rose-300">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  FASTEST • HIGH SUBMERGENCE HAZARD
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">38% SAFE</span>
              </div>

              <h3 className="font-bold text-sm text-ink">{ROUTE_CORRIDORS.fastest.name}</h3>

              <div className="grid grid-cols-3 gap-2 my-2 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">ETA</span>
                  <span className="font-bold text-ink">{ROUTE_CORRIDORS.fastest.estimatedMinutes} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">DISTANCE</span>
                  <span className="font-bold text-ink">{ROUTE_CORRIDORS.fastest.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">MAX WATER</span>
                  <span className="font-bold text-rose-700">{ROUTE_CORRIDORS.fastest.maxWaterDepthCm} cm (Subway)</span>
                </div>
              </div>

              <p className="text-xs text-rose-800 font-medium">
                {ROUTE_CORRIDORS.fastest.description}
              </p>
            </div>
          </div>

          {/* Vehicle Hydrostatic Calibrator (Feature 1) */}
          <VehicleCalibrator 
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            clearanceThreshold={clearanceThreshold}
            setClearanceThreshold={setClearanceThreshold}
            maxRouteWater={activeCorridor.maxWaterDepthCm}
          />

          {/* Time-Shift Departure Window Planner (Feature 2) */}
          <DepartureTimePlanner 
            selectedDepartureId={departureWindow}
            onSelectDeparture={setDepartureWindow}
            baseWaterDepth={activeCorridor.maxWaterDepthCm}
          />

          {/* Restriction & Avoidance Filters (Feature 5) */}
          <RouteFiltersAndAvoidance 
            filters={filters}
            onToggleFilter={handleToggleFilter}
          />
        </div>

        {/* Right Column (7 Cols): Dedicated Route Map, Simulator, Elevation Graph & Detailed Features */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Dedicated Map Component for Route Planning */}
          <SafeRouteMap 
            selectedRouteId={selectedRouteOption}
            onSelectRoute={setSelectedRouteOption}
            originLoc={originLocation}
            destLoc={destLocation}
            waypoints={waypoints}
            simulatedProgress={simulatedProgress}
            isSimulating={isSimulating}
            scrubbedKm={scrubbedKm}
            focusCoord={focusCoord}
            height="h-[480px]"
          />

          {/* Virtual Driving Simulator Bar (Feature 7) */}
          <RouteDrivingSimulator 
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            simulatedProgress={simulatedProgress}
            setSimulatedProgress={setSimulatedProgress}
            activeCorridor={activeCorridor}
            vehicleClearance={clearanceThreshold}
            onVoicePrompt={speakAlert}
          />

          {/* Secondary Features Tab Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs border-b border-border">
            {[
              { id: 'elevation', label: 'Elevation Profile' },
              { id: 'cue-sheet', label: 'Turn Cue Sheet' },
              { id: 'weather-sensor', label: 'Weather & Sensors' },
              { id: 'ai-score', label: 'AI Safety Radar' },
              { id: 'havens', label: 'Shelters & Staging' },
              { id: 'closures', label: 'Police Barricades' },
              { id: 'drag-energy', label: 'EV Fuel Drag' },
              { id: 'pedestrian', label: 'Walking Physics' },
              { id: 'tides', label: 'Tidal Surcharge' },
              { id: 'voice-tts', label: 'Voice Audio' },
              { id: 'offline-export', label: 'Offline GPX' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSecondaryTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  activeSecondaryTab === tab.id
                    ? 'bg-ink text-white shadow-xs'
                    : 'bg-canvas text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Render Active Secondary Feature Component */}
          {activeSecondaryTab === 'elevation' && (
            <RouteElevationProfile 
              activeCorridor={activeCorridor}
              scrubbedKm={scrubbedKm}
              onScrubKm={setScrubbedKm}
              vehicleClearance={clearanceThreshold}
            />
          )}

          {activeSecondaryTab === 'cue-sheet' && (
            <TurnByTurnCueSheet 
              activeCorridor={activeCorridor}
              onSelectTurn={handleSelectTurn}
            />
          )}

          {activeSecondaryTab === 'weather-sensor' && (
            <RouteWeatherTelemetry 
              selectedRouteId={selectedRouteOption}
            />
          )}

          {activeSecondaryTab === 'ai-score' && (
            <RouteSafetyScoreRadar 
              activeCorridor={activeCorridor}
            />
          )}

          {activeSecondaryTab === 'havens' && (
            <SafeHavensDrawer 
              onAddHavenAsWaypoint={handleAddWaypoint}
            />
          )}

          {activeSecondaryTab === 'closures' && (
            <RoadClosuresFeed 
              onSelectDetour={(detourId) => setSelectedRouteOption(detourId)}
            />
          )}

          {activeSecondaryTab === 'drag-energy' && (
            <EVFuelPenaltyCalculator 
              activeCorridor={activeCorridor}
              vehicleType={vehicleType}
            />
          )}

          {activeSecondaryTab === 'pedestrian' && (
            <PedestrianSafetyAdvisor 
              vehicleType={vehicleType}
              waterDepthCm={activeCorridor.maxWaterDepthCm}
              waterVelocity={0.32}
            />
          )}

          {activeSecondaryTab === 'tides' && (
            <TidalSurchargeClock />
          )}

          {activeSecondaryTab === 'voice-tts' && (
            <VoiceGuidancePlayer 
              isVoiceEnabled={isVoiceEnabled}
              setIsVoiceEnabled={setIsVoiceEnabled}
              voiceLanguage={voiceLanguage}
              setVoiceLanguage={setVoiceLanguage}
              activeCorridor={activeCorridor}
              onSpeak={speakAlert}
            />
          )}

          {activeSecondaryTab === 'offline-export' && (
            <OfflineRouteExporter 
              activeCorridor={activeCorridor}
              originLoc={originLocation}
              destLoc={destLocation}
            />
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <RouteComparisonModal 
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedRouteId={selectedRouteOption}
        onSelectRoute={setSelectedRouteOption}
      />

      <RouteShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        activeCorridor={activeCorridor}
        originLoc={originLocation}
        destLoc={destLocation}
      />

      <CrowdsourcedHazardModal 
        isOpen={isHazardOpen}
        onClose={() => setIsHazardOpen(false)}
        activeCorridor={activeCorridor}
        onHazardReported={(hz) => speakAlert(`Reported ${hz.type} on ${activeCorridor.name}`)}
      />

      <EmergencySOSModal 
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        activeCorridor={activeCorridor}
        vehicleType={vehicleType}
        waterDepth={activeCorridor.maxWaterDepthCm}
      />
    </div>
  );
}
