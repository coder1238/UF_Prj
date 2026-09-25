import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import InteractiveMapCanvas from '../shared/InteractiveMapCanvas';
import ForecastTimeline from '../shared/ForecastTimeline';
import FloodClock from '../shared/FloodClock';

// Icons
import { 
  CloudRain, 
  Droplets, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck, 
  ShieldAlert,
  ArrowUpRight,
  Info,
  Car,
  Bike,
  Truck,
  Footprints,
  Radio,
  Sliders,
  Share2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Layers,
  MapPin,
  ExternalLink,
  ChevronDown,
  Search,
  Wifi,
  WifiOff,
  Crosshair,
  Building,
  Activity,
  Ruler,
  AlertCircle
} from 'lucide-react';

// Data imports
import { 
  WARDS_DATA, 
  ROAD_SEGMENTS, 
  VEHICLE_PROFILES, 
  TIDE_TELEMETRY_DATA,
  PUMPING_STATIONS_DATA
} from '../../data/floodData';
import { 
  WARD_HYDROGRAPHS, 
  CRITICAL_SUBWAYS_DATA, 
  IOT_SURCHARGE_SENSORS, 
  CRITICAL_INFRASTRUCTURE_DATA, 
  HISTORICAL_ANALOG_EVENTS, 
  SEED_GROUND_REPORTS,
  ENSEMBLE_DETAILS
} from '../../data/forecastExtraData';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

// Modals
import ForecastEnsembleModal from '../forecast/ForecastEnsembleModal';
import DepartureWindowModal from '../forecast/DepartureWindowModal';
import ReportConditionModal from '../forecast/ReportConditionModal';
import CorridorElevationDrawer from '../forecast/CorridorElevationDrawer';

export default function FloodForecast() {
  const { 
    selectedWardId, 
    setSelectedWardId, 
    timelineIndex, 
    setTimelineIndex, 
    timelineSlices, 
    currentTimeline, 
    currentWard,
    vehicleType,
    setVehicleType,
    isVoiceEnabled,
    isOfflineMode,
    setIsOfflineMode
  } = useFlood();

  const { navigateTo } = useNavigation();

  // Component States
  const [activeScenario, setActiveScenario] = useState('baseline'); // 'baseline' | 'cloudburst' | 'deluge' | 'drainage-choke'
  const [depthSurcharge, setDepthSurcharge] = useState(0); // cm
  const [selectedRoadId, setSelectedRoadId] = useState(null);
  const [corridorFilter, setCorridorFilter] = useState('ALL'); // 'ALL' | 'PASSABLE' | 'CAUTION' | 'IMPASSABLE'
  const [focusTarget, setFocusTarget] = useState(null);

  // Map Feature Toggles
  const [isDopplerActive, setIsDopplerActive] = useState(true);
  const [showRunoffVectors, setShowRunoffVectors] = useState(true);
  const [showIoTSensors, setShowIoTSensors] = useState(true);
  const [showSubwayBadges, setShowSubwayBadges] = useState(true);

  // Modals
  const [isEnsembleModalOpen, setIsEnsembleModalOpen] = useState(false);
  const [isDepartureModalOpen, setIsDepartureModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isElevationDrawerOpen, setIsElevationDrawerOpen] = useState(false);
  const [elevationCorridorId, setElevationCorridorId] = useState('rd-milan');

  // Hydrograph Interactive States
  const [hydroPercentile, setHydroPercentile] = useState('p50'); // 'p10' | 'p50' | 'p90'
  const [hoveredHydroPoint, setHoveredHydroPoint] = useState(null);

  // AI Speech Briefing (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLang, setTtsLang] = useState('en'); // 'en' | 'hi' | 'mr'

  // Crowdsourced Reports Live State
  const [groundReports, setGroundReports] = useState(SEED_GROUND_REPORTS);

  // Personal Custom Alert Threshold
  const [customAlertThreshold, setCustomAlertThreshold] = useState(20); // cm
  const [alertTriggered, setAlertTriggered] = useState(false);

  // WhatsApp Advisory Copy Toast
  const [copiedAdvisory, setCopiedAdvisory] = useState(false);

  // Offline Cache Timestamp
  const [cacheTimestamp, setCacheTimestamp] = useState('Just now (Live)');

  // Tidal Lock override
  const [tidalLockOverride, setTidalLockOverride] = useState(false);

  // Vehicle Profile Config
  const currentVehicleConfig = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.sedan;
  const clearanceThreshold = currentVehicleConfig.clearanceCm;

  // Ward Hydrograph Data
  const currentHydroData = WARD_HYDROGRAPHS[selectedWardId] || WARD_HYDROGRAPHS['ward-l'];
  const currentHydroPoint = currentHydroData.points[timelineIndex] || currentHydroData.points[0];

  // Dynamic Road Calculations for Current Timeline & Vehicle
  const dynamicRoads = useMemo(() => {
    const factor = timelineIndex === 0 ? 1.0 : timelineIndex === 1 ? 1.25 : timelineIndex === 2 ? 1.6 : timelineIndex === 3 ? 2.0 : timelineIndex === 4 ? 2.35 : 1.7;
    return ROAD_SEGMENTS.map(road => {
      const calculatedDepth = Math.max(0, Math.round(road.currentDepth * factor + depthSurcharge));
      const isPassable = calculatedDepth <= clearanceThreshold;
      const isStallRisk = !isPassable && calculatedDepth <= clearanceThreshold * 1.5;
      const isClosed = calculatedDepth > clearanceThreshold * 1.5;
      let statusCategory = 'PASSABLE';
      if (isClosed) statusCategory = 'IMPASSABLE';
      else if (isStallRisk) statusCategory = 'CAUTION';

      return {
        ...road,
        simulatedDepth: calculatedDepth,
        statusCategory,
        isPassable,
        isStallRisk,
        isClosed
      };
    });
  }, [timelineIndex, depthSurcharge, clearanceThreshold]);

  // Passability Counters
  const passabilityStats = useMemo(() => {
    let passableCount = 0;
    let cautionCount = 0;
    let closedCount = 0;

    dynamicRoads.forEach(r => {
      if (r.statusCategory === 'PASSABLE') passableCount++;
      else if (r.statusCategory === 'CAUTION') cautionCount++;
      else closedCount++;
    });

    return {
      total: dynamicRoads.length,
      passable: passableCount,
      caution: cautionCount,
      closed: closedCount
    };
  }, [dynamicRoads]);

  // Filtered Roads for Table
  const filteredRoads = useMemo(() => {
    if (corridorFilter === 'ALL') return dynamicRoads;
    return dynamicRoads.filter(r => r.statusCategory === corridorFilter);
  }, [dynamicRoads, corridorFilter]);

  // Scenario Switcher Handler
  const handleScenarioChange = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    if (scenarioKey === 'baseline') {
      setDepthSurcharge(0);
    } else if (scenarioKey === 'cloudburst') {
      setDepthSurcharge(12);
    } else if (scenarioKey === 'deluge') {
      setDepthSurcharge(24);
    } else if (scenarioKey === 'drainage-choke') {
      setDepthSurcharge(16);
    }
  };

  // Sound Warning Chime Generator (Web Audio API)
  const playWarningTone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.warn('Audio tone unsupported:', e);
    }
  };

  // Trigger alert if current water exceeds user threshold
  useEffect(() => {
    const depth = currentHydroPoint.depth + depthSurcharge;
    if (depth >= customAlertThreshold && !alertTriggered) {
      setAlertTriggered(true);
      playWarningTone();
    } else if (depth < customAlertThreshold && alertTriggered) {
      setAlertTriggered(false);
    }
  }, [currentHydroPoint, depthSurcharge, customAlertThreshold, alertTriggered]);

  // Web Speech API Voice Narration (Feature 9)
  const handleToggleVoiceBriefing = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const currentDepth = currentHydroPoint.depth + depthSurcharge;
    const currentRain = currentHydroPoint.rain;
    const timeLabel = currentTimeline.label;

    let speechText = '';
    if (ttsLang === 'hi') {
      speechText = `${currentWard.name} के लिए ${timeLabel} का पूर्वानुमान। बारिश की तीव्रता ${currentRain} मिलीमीटर प्रति घंटा है, और अनुमानित जलभराव ${currentDepth} सेंटीमीटर है। निम्न स्तरीय सड़कों पर यात्रा से बचें।`;
    } else if (ttsLang === 'mr') {
      speechText = `${currentWard.name} साठी ${timeLabel} चा पूर अंदाज. पावसाचा वेग ${currentRain} मिलीमीटर प्रति तास असून, पाण्याचा साठा ${currentDepth} सेंटीमीटर अपेक्षित आहे. सबवे आणि सखल भागातून प्रवास टाळा.`;
    } else {
      speechText = `Hydro synoptic briefing for ${currentWard.name} at step ${timeLabel}. Rain intensity is ${currentRain} millimeters per hour. Forecasted surface water depth is ${currentDepth} centimeters. Caution advised for low-clearance vehicles near railway subways. High tide restriction locks gravity drainage until twenty-two hours.`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = ttsLang === 'hi' ? 'hi-IN' : ttsLang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // WhatsApp Safety Advisory Formatter (Feature 19)
  const handleCopyWhatsAppAdvisory = () => {
    const depth = currentHydroPoint.depth + depthSurcharge;
    const time = currentTimeline.time;
    const closedSubways = CRITICAL_SUBWAYS_DATA.filter(s => s.barrierStatus.includes('CLOSED')).map(s => s.name).join(', ') || 'None';

    const advisoryText = `🚨 *MUMBAI FLOOD ADVISORY (${time} IST)* 🚨
Ward: ${currentWard.name}
🌧️ Current Rain Rate: ${currentHydroPoint.rain} mm/h
🌊 Forecasted Flood Depth: ${depth} cm (${currentTimeline.label})
⛔ Impassable Corridors: ${closedSubways}
🚗 Vehicle Advice: Sedans/2-wheelers at high stall risk (>15cm). Use elevated flyovers.
🌊 Arabian Sea High Tide: 4.87m at 21:42 IST (Sluice gates locked).
📞 Emergency Helplines: BMC 1916 | Police 112 | Ambulance 108
Generated by HydroSense Citizen Platform.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(advisoryText);
      setCopiedAdvisory(true);
      setTimeout(() => setCopiedAdvisory(false), 2500);
    }
  };

  // Offline Snapshot Caching (Feature 20)
  const handleToggleOfflineMode = () => {
    const nextMode = !isOfflineMode;
    setIsOfflineMode(nextMode);
    if (nextMode) {
      try {
        const cachePayload = {
          ward: currentWard,
          timeline: currentTimeline,
          hydrograph: currentHydroData,
          roadStats: passabilityStats,
          timestamp: new Date().toLocaleTimeString()
        };
        localStorage.setItem('mumbai_flood_forecast_snapshot', JSON.stringify(cachePayload));
        setCacheTimestamp(`Cached at ${new Date().toLocaleTimeString()} (Offline Ready)`);
      } catch (e) {
        console.warn('LocalStorage unavailable:', e);
      }
    } else {
      setCacheTimestamp('Live Connected');
    }
  };

  // Upvote Community Ground Report
  const handleUpvoteReport = (reportId) => {
    setGroundReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          upvotes: rep.userUpvoted ? rep.upvotes - 1 : rep.upvotes + 1,
          userUpvoted: !rep.userUpvoted
        };
      }
      return rep;
    }));
  };

  // Add new report submitted from modal
  const handleAddNewReport = (newRep) => {
    setGroundReports(prev => [newRep, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Header Banner & Micro-Catchment Hydro-Selector (Feature 1) */}
      <div className="bg-white p-5 rounded-3xl border border-border shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-soft text-primary-deep text-[11px] font-mono font-bold">
                0–3 HOUR SPATIAL NOWCAST
              </span>
              <button 
                onClick={() => setIsEnsembleModalOpen(true)}
                className="text-xs text-primary font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>• 32 Ensemble Members</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-xs text-ink-muted font-mono">• GNN-SWMM Hybrid Inference</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Hyper-Local Flood & Runoff Nowcasting
            </h1>
            <p className="text-xs text-ink-secondary">
              Real-time Doppler radar extrapolation, Digital Elevation Model overland flow, and street hydraulic surcharge forecast for Greater Mumbai.
            </p>
          </div>

          {/* Quick Action Buttons & Offline Mode (Feature 20) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleToggleOfflineMode}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                isOfflineMode ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-canvas text-ink-secondary border-border hover:bg-white'
              }`}
              title="Cache forecast data locally for spotty mobile networks"
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOfflineMode ? 'Offline Mode (Active)' : 'Save Offline'}</span>
            </button>

            <button
              onClick={handleCopyWhatsAppAdvisory}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-xs"
              title="Copy formatted citizen advisory for WhatsApp sharing"
            >
              {copiedAdvisory ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedAdvisory ? 'Advisory Copied!' : 'Share Advisory'}</span>
            </button>

            <button
              onClick={() => setIsDepartureModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Can I Travel?</span>
            </button>
          </div>
        </div>

        {/* Micro-Catchment Ward Selector Bar */}
        <div className="pt-2 border-t border-border/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-mono font-bold text-ink uppercase">Selected Micro-Catchment:</span>
            <div className="relative inline-block">
              <select
                value={selectedWardId}
                onChange={(e) => {
                  setSelectedWardId(e.target.value);
                  const newWard = WARDS_DATA.find(w => w.id === e.target.value);
                  if (newWard && newWard.defaultCenter) {
                    setFocusTarget({ lat: newWard.defaultCenter.lat, lng: newWard.defaultCenter.lng, zoom: 13.5 });
                  }
                }}
                className="bg-slate-100 font-mono text-xs font-bold text-ink px-3 py-1.5 pr-8 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {WARDS_DATA.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.risk})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Synoptic stats for current ward */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
            <span>Pop. at Risk: <strong className="text-ink">{currentWard.population}</strong></span>
            <span>•</span>
            <span>Catchment: <strong className="text-ink">{currentHydroData.catchmentAreaKm2} km²</strong></span>
            <span>•</span>
            <span>Spillway: <strong className="text-purple-primary">{currentHydroData.criticalSpillway}</strong></span>
            <span>•</span>
            <span className="text-[10px] text-slate-400 font-mono">{cacheTimestamp}</span>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Step Timeline Ribbon */}
      <ForecastTimeline />

      {/* 3. Scenario Sandbox Bar & Vehicle Clearance Selector (Features 2 & 14) */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-card flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* What-If Rain Scenario Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-mono font-bold text-ink uppercase">
              WHAT-IF INUNDATION SCENARIO STRESS-TEST
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold">
            {[
              { id: 'baseline', label: 'Baseline Nowcast (0cm Surcharge)', surcharge: 0 },
              { id: 'cloudburst', label: '🌩️ Cloudburst Surge (+12cm)', surcharge: 12 },
              { id: 'deluge', label: '⛈️ Extreme Deluge (+24cm)', surcharge: 24 },
              { id: 'drainage-choke', label: '🍂 Sluice Choke (+16cm)', surcharge: 16 }
            ].map(sc => (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  activeScenario === sc.id
                    ? 'bg-purple-primary text-white border-purple-primary shadow-xs'
                    : 'bg-canvas text-slate-700 border-border hover:bg-slate-100'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Ingress Profile Selector */}
        <div className="space-y-1.5 border-t lg:border-t-0 lg:border-l border-border/80 lg:pl-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-mono font-bold text-ink uppercase flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-primary" />
              <span>YOUR VEHICLE CLEARANCE:</span>
            </span>
            <span className="text-xs font-mono font-bold text-primary">
              {currentVehicleConfig.label} ({clearanceThreshold}cm)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs font-mono font-bold">
            {[
              { id: 'pedestrian', label: 'Walking (10cm)', icon: Footprints },
              { id: 'twoWheeler', label: '2-Wheeler (12cm)', icon: Bike },
              { id: 'sedan', label: 'Sedan (15cm)', icon: Car },
              { id: 'suv', label: 'SUV (22cm)', icon: Truck },
              { id: 'ambulance', label: 'Ambulance (28cm)', icon: ShieldAlert },
              { id: 'heavy', label: 'Heavy Bus (35cm)', icon: Truck }
            ].map(v => {
              const IconComp = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicleType(v.id)}
                  className={`px-2.5 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                    vehicleType === v.id
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-canvas text-slate-700 border-border hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-3 h-3" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Map & Dual-Axis Hydrograph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Forecast Map Canvas & Passability Corridor Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-border shadow-card space-y-3">
            
            {/* Map Header with Time & Extra Layer Toggles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-ink uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                SIMULATED INUNDATION @ {currentTimeline.label} ({currentTimeline.time} IST)
              </span>
              
              {/* Map Layer Switches (Features 3 & 4) */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                <button
                  onClick={() => setIsDopplerActive(!isDopplerActive)}
                  className={`px-2 py-0.5 rounded-lg border transition ${
                    isDopplerActive ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="Toggle Doppler Precipitation Reflectivity (dBZ)"
                >
                  🌧️ Radar dBZ
                </button>
                <button
                  onClick={() => setShowRunoffVectors(!showRunoffVectors)}
                  className={`px-2 py-0.5 rounded-lg border transition ${
                    showRunoffVectors ? 'bg-cyan-100 text-cyan-900 border-cyan-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="Toggle Overland Flow Velocity Streamlines"
                >
                  ↘️ Runoff Flow
                </button>
                <button
                  onClick={() => setShowIoTSensors(!showIoTSensors)}
                  className={`px-2 py-0.5 rounded-lg border transition ${
                    showIoTSensors ? 'bg-teal-100 text-teal-900 border-teal-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="Toggle IoT Ultrasonic Surcharge Sensors"
                >
                  📡 Sensors
                </button>
              </div>
            </div>

            {/* Interactive Map Component wired with all forecast dummy data */}
            <InteractiveMapCanvas 
              height="h-[460px]" 
              selectedVehicle={vehicleType}
              selectedRoadId={selectedRoadId}
              onSelectRoad={(roadId) => {
                setSelectedRoadId(roadId);
                setElevationCorridorId(roadId);
              }}
              depthSurcharge={depthSurcharge}
              focusTarget={focusTarget}
              isDopplerActive={isDopplerActive}
              showRunoffVectors={showRunoffVectors}
              showIoTSensors={showIoTSensors}
              showSubwayBadges={showSubwayBadges}
              onSelectSubway={(sub) => {
                setElevationCorridorId(sub.id === 'sub-milan' ? 'rd-milan' : 'rd-lbs');
              }}
            />

            {/* Fully Dynamic Corridor Passability Counters (Click to Filter) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs font-mono">
              <button
                onClick={() => setCorridorFilter('ALL')}
                className={`p-2.5 rounded-2xl border transition ${
                  corridorFilter === 'ALL'
                    ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-400/20'
                    : 'bg-slate-50 text-slate-700 border-border hover:bg-white'
                }`}
              >
                <span className="text-[10px] block text-slate-500 uppercase font-bold">ALL MONITORED</span>
                <strong className="text-base font-extrabold">{passabilityStats.total} Corridors</strong>
              </button>

              <button
                onClick={() => setCorridorFilter('PASSABLE')}
                className={`p-2.5 rounded-2xl border transition ${
                  corridorFilter === 'PASSABLE'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/60'
                }`}
              >
                <span className="text-[10px] block text-emerald-700 uppercase font-bold">PASSABLE (SAFE)</span>
                <strong className="text-base font-extrabold">{passabilityStats.passable} Corridors</strong>
              </button>

              <button
                onClick={() => setCorridorFilter('CAUTION')}
                className={`p-2.5 rounded-2xl border transition ${
                  corridorFilter === 'CAUTION'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-500/20'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <span className="text-[10px] block text-amber-700 uppercase font-bold">PONDING / CAUTION</span>
                <strong className="text-base font-extrabold">{passabilityStats.caution} Corridors</strong>
              </button>

              <button
                onClick={() => setCorridorFilter('IMPASSABLE')}
                className={`p-2.5 rounded-2xl border transition ${
                  corridorFilter === 'IMPASSABLE'
                    ? 'bg-red-100 text-red-900 border-red-400 ring-2 ring-red-500/20'
                    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100/60'
                }`}
              >
                <span className="text-[10px] block text-red-700 uppercase font-bold">CLOSED / STALL</span>
                <strong className="text-base font-extrabold">{passabilityStats.closed} Subways</strong>
              </button>
            </div>
          </div>

          {/* Filtered Arterial Corridors Table with DEM Elevation Trigger (Feature 11) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR PASSABILITY MATRIX</span>
                <h3 className="text-sm font-bold text-ink">
                  Arterial Roads at {currentTimeline.label} ({filteredRoads.length} shown)
                </h3>
              </div>
              <button
                onClick={() => setIsElevationDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-soft text-purple-deep hover:bg-purple-primary hover:text-white text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>DEM Topo Profile</span>
              </button>
            </div>

            <div className="space-y-2">
              {filteredRoads.map(road => {
                const isSelected = selectedRoadId === road.id;
                return (
                  <div
                    key={road.id}
                    onClick={() => {
                      setSelectedRoadId(road.id);
                      setElevationCorridorId(road.id);
                      if (road.coordinates) {
                        setFocusTarget({ lat: road.coordinates.lat, lng: road.coordinates.lng, zoom: 14.5 });
                      }
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-soft/50 border-primary ring-2 ring-primary/20'
                        : 'bg-canvas hover:bg-white border-border'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-ink">{road.name}</strong>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          road.statusCategory === 'PASSABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : road.statusCategory === 'CAUTION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {road.statusCategory}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted line-clamp-1">{road.recommendation}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-ink-muted block uppercase">PREDICTED DEPTH</span>
                        <strong className={`text-sm ${road.simulatedDepth > clearanceThreshold ? 'text-red-600' : 'text-emerald-700'}`}>
                          {road.simulatedDepth} cm
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-ink-muted block uppercase">ELEVATION</span>
                        <strong className="text-xs text-ink">+{road.elevation}m MSL</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Critical Subways Status Board (Feature 7) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CRITICAL BOTTLENECKS</span>
                  <h3 className="text-sm font-bold text-ink">Mumbai Underpass & Subway Status</h3>
                </div>
              </div>
              <span className="text-[11px] font-mono text-ink-muted">Automated Sump Gauges</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRITICAL_SUBWAYS_DATA.map(sub => {
                const isClosed = sub.barrierStatus.includes('CLOSED');
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setFocusTarget({ lat: sub.coordinates.lat, lng: sub.coordinates.lng, zoom: 15.0 });
                      setElevationCorridorId(sub.id === 'sub-milan' ? 'rd-milan' : 'rd-lbs');
                    }}
                    className="p-3.5 rounded-2xl bg-canvas border border-border hover:bg-white hover:border-primary/40 transition cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-xs font-bold text-ink block">{sub.name}</strong>
                        <span className="text-[10px] font-mono text-ink-muted">{sub.carriageway}</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isClosed ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.barrierStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 font-mono text-center text-xs">
                      <div className="p-1.5 rounded-xl bg-white border border-border">
                        <span className="text-[9px] text-ink-muted block uppercase">Current</span>
                        <strong className="text-red-600 font-bold">{sub.currentDepthCm} cm</strong>
                      </div>
                      <div className="p-1.5 rounded-xl bg-white border border-border">
                        <span className="text-[9px] text-ink-muted block uppercase">Forecast</span>
                        <strong className="text-purple-primary font-bold">{sub.forecastPeakDepthCm} cm</strong>
                      </div>
                      <div className="p-1.5 rounded-xl bg-white border border-border">
                        <span className="text-[9px] text-ink-muted block uppercase">Peak In</span>
                        <span className="text-ink font-bold">{sub.peakTimeETA}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-600 flex items-center justify-between pt-1 border-t border-border">
                      <span>Pumps: {sub.activePumps}</span>
                      <span className="text-primary hover:underline font-bold flex items-center gap-1">
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Hydrograph, High Tide Lock, TTS Briefing, Havens, Analytics */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Dual-Axis Hydrograph with Hover Tooltips & Click-to-Scrub */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">TIME-SERIES HYDROGRAPH</span>
                <h4 className="text-sm font-bold text-ink">{currentWard.name} Rainfall vs Depth</h4>
              </div>
              
              {/* P10 / P50 / P90 Percentile Selector (Feature 6) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[10px] font-mono font-bold">
                {['p10', 'p50', 'p90'].map(p => (
                  <button
                    key={p}
                    onClick={() => setHydroPercentile(p)}
                    className={`px-2 py-0.5 rounded-lg transition uppercase ${
                      hydroPercentile === p ? 'bg-white text-purple-primary shadow-xs' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Dual-Axis Chart */}
            <div className="relative pt-2">
              <svg viewBox="0 0 400 160" className="w-full h-44 overflow-visible cursor-pointer">
                {/* Horizontal grid lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#E5E0EF" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="#E5E0EF" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="#E5E0EF" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="380" y2="140" stroke="#18151F" strokeWidth="1.5" />

                {/* Y-axis labels Left (Rain mm/h) */}
                <text x="32" y="24" textAnchor="end" fill="#716C7C" fontSize="9" fontFamily="JetBrains Mono">70</text>
                <text x="32" y="64" textAnchor="end" fill="#716C7C" fontSize="9" fontFamily="JetBrains Mono">45</text>
                <text x="32" y="104" textAnchor="end" fill="#716C7C" fontSize="9" fontFamily="JetBrains Mono">20</text>
                <text x="32" y="144" textAnchor="end" fill="#716C7C" fontSize="9" fontFamily="JetBrains Mono">0</text>

                {/* Y-axis labels Right (Depth cm) */}
                <text x="388" y="24" fill="#B42318" fontSize="9" fontFamily="JetBrains Mono">60cm</text>
                <text x="388" y="64" fill="#B42318" fontSize="9" fontFamily="JetBrains Mono">40cm</text>
                <text x="388" y="104" fill="#B42318" fontSize="9" fontFamily="JetBrains Mono">20cm</text>

                {/* Rainfall Bars (Blue/Purple) Clickable to scrub */}
                {currentHydroData.points.map((pt, idx) => {
                  const x = 65 + idx * 58;
                  const barHeight = Math.min(115, Math.max(10, (pt.rain / 70) * 115));
                  const y = 140 - barHeight;
                  const isCurrent = timelineIndex === idx;

                  return (
                    <g 
                      key={idx} 
                      onClick={() => setTimelineIndex(idx)}
                      onMouseEnter={() => setHoveredHydroPoint(pt)}
                      onMouseLeave={() => setHoveredHydroPoint(null)}
                      className="cursor-pointer group"
                    >
                      <rect 
                        x={x - 8} 
                        y={y} 
                        width="16" 
                        height={barHeight} 
                        fill={isCurrent ? '#6D4AFF' : '#6D4AFF'} 
                        fillOpacity={isCurrent ? 0.6 : 0.25} 
                        rx="2"
                        className="transition-all group-hover:fill-opacity-80"
                      />
                    </g>
                  );
                })}

                {/* Uncertainty Band (Shaded area around depth curve) */}
                <polygon 
                  points="73,130 131,118 189,105 247,88 305,70 363,94 363,112 305,88 247,108 189,122 131,134 73,140" 
                  fill="#6D4AFF" 
                  fillOpacity="0.12" 
                />

                {/* Dynamic Water Depth Trend Polyline */}
                <polyline 
                  points={currentHydroData.points.map((pt, idx) => {
                    const x = 73 + idx * 58;
                    const val = hydroPercentile === 'p10' ? pt.p10 : hydroPercentile === 'p90' ? pt.p90 : pt.p50;
                    const adjusted = Math.min(58, val + depthSurcharge);
                    const y = 140 - (adjusted / 60) * 115;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none" 
                  stroke="#6D4AFF" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                />

                {/* Current playhead vertical line */}
                <line 
                  x1={73 + timelineIndex * 58} 
                  y1="10" 
                  x2={73 + timelineIndex * 58} 
                  y2="140" 
                  stroke="#DC2626" 
                  strokeWidth="2" 
                  strokeDasharray="4 2" 
                />

                {/* Playhead thumb circle */}
                <circle
                  cx={73 + timelineIndex * 58}
                  cy="10"
                  r="4"
                  fill="#DC2626"
                />

                {/* X-axis time points */}
                {currentHydroData.points.map((pt, idx) => (
                  <text 
                    key={idx}
                    x={73 + idx * 58} 
                    y="154" 
                    textAnchor="middle" 
                    fill={timelineIndex === idx ? '#6D4AFF' : '#716C7C'} 
                    fontWeight={timelineIndex === idx ? 'bold' : 'normal'}
                    fontSize="9" 
                    fontFamily="JetBrains Mono"
                    onClick={() => setTimelineIndex(idx)}
                    className="cursor-pointer"
                  >
                    {pt.slice}
                  </text>
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredHydroPoint && (
                <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-mono p-2 rounded-xl shadow-lg border border-slate-700 pointer-events-none space-y-0.5">
                  <div className="font-bold text-primary-soft">{hoveredHydroPoint.slice} ({hoveredHydroPoint.time} IST)</div>
                  <div>Rain: <strong>{hoveredHydroPoint.rain} mm/h</strong></div>
                  <div>Depth ({hydroPercentile.toUpperCase()}): <strong>{hoveredHydroPoint[hydroPercentile] + depthSurcharge} cm</strong></div>
                  <div className="text-slate-400">Runoff Coeff: {hoveredHydroPoint.runoffCoeff}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted pt-1 border-t border-border">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary/50 rounded"></span> Rain mm/h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-primary rounded"></span> Depth cm ({hydroPercentile.toUpperCase()})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary/10 rounded"></span> 90% Ensemble Band
              </span>
            </div>
          </div>

          {/* 5. Astronomical High Tide & Sluice Gate Lockout Widget (Feature 5) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Droplets className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">ASTRONOMICAL TIDE COUPLING</span>
                  <h4 className="text-sm font-bold text-ink">Arabian Sea Spring Tide Lockout</h4>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {TIDE_TELEMETRY_DATA.highTideRisk}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-canvas border border-border">
                <span className="text-[10px] text-ink-muted block uppercase">PEAK HIGH TIDE</span>
                <strong className="text-base font-extrabold text-blue-900 block mt-0.5">
                  {TIDE_TELEMETRY_DATA.nextHighTideHeightM}m MSL
                </strong>
                <span className="text-[10px] text-ink-muted">ETA: {TIDE_TELEMETRY_DATA.nextHighTideTime}</span>
              </div>

              <div className="p-3 rounded-2xl bg-canvas border border-border">
                <span className="text-[10px] text-ink-muted block uppercase">SLUICE GATE STATUS</span>
                <strong className={`text-base font-extrabold block mt-0.5 ${tidalLockOverride ? 'text-emerald-700' : 'text-red-700'}`}>
                  {tidalLockOverride ? 'EMERGENCY DISCHARGE' : 'FLAP GATES LOCKED'}
                </strong>
                <span className="text-[10px] text-ink-muted">Lockout: 74 min remaining</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-secondary leading-relaxed">
              {TIDE_TELEMETRY_DATA.advisory}
            </p>

            <button
              onClick={() => setTidalLockOverride(!tidalLockOverride)}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold border border-blue-200 text-blue-800 hover:bg-blue-50 transition"
            >
              {tidalLockOverride ? 'Revert to Natural Gravitational Lock' : 'Simulate Tidal Sluice Gate Overdrive'}
            </button>
          </div>

          {/* 8. Pumping Station Telemetry Monitor (Feature 8) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">DEWATERING NETWORK</span>
                  <h4 className="text-sm font-bold text-ink">BMC Stormwater Pumping Stations</h4>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700">6 of 6 Online</span>
            </div>

            <div className="space-y-2">
              {PUMPING_STATIONS_DATA.slice(0, 3).map(p => (
                <div key={p.id} className="p-2.5 rounded-2xl bg-canvas border border-border flex items-center justify-between text-xs font-mono">
                  <div>
                    <strong className="text-ink block">{p.name.split(' ')[0]} Station</strong>
                    <span className="text-[10px] text-ink-muted">{p.runningPumps} of {p.totalPumps} Turbines Running</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-800 block">{p.currentDischargeLPS.toLocaleString()} LPS</span>
                    <span className="text-[9px] text-emerald-700 font-bold">{p.gateStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. AI Hydro-Synoptic Briefing Generator with Multi-Lingual TTS (Feature 9) */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/40 rounded-3xl p-5 border border-purple-200/80 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-primary" />
                <span className="text-xs font-mono font-bold text-ink uppercase">AI SYNOPTIC BRIEFING</span>
              </div>

              {/* TTS Language Selector */}
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-purple-200 text-[10px] font-mono font-bold">
                {[
                  { id: 'en', label: 'EN' },
                  { id: 'hi', label: 'हिन्दी' },
                  { id: 'mr', label: 'मराठी' }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setTtsLang(l.id);
                      if (isSpeaking) window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      ttsLang === l.id ? 'bg-primary text-white' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {ttsLang === 'hi' 
                ? `${currentWard.name} में संवहनीय वर्षा पट्टी उत्तर-पूर्व की ओर बढ़ रही है। साकी नाका और कुर्ला नाले में 21:50 तक जलभराव चरम पर पहुंचने का अनुमान है।`
                : ttsLang === 'mr'
                ? `${currentWard.name} विभागात जोरदार पर्जन्यवृष्टी सुरू असून मिठी नदी पात्रातील पाणी पातळी वाढण्याची शक्यता आहे. नागरिकांनी सतर्क राहावे.`
                : `Convective rainband moving northeast over ${currentWard.name}. Saki Naka culvert drainage capacity expected to exceed threshold by 21:50. Arabian sea tide of 4.87m locks gravity discharge into Mahim Creek.`}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleToggleVoiceBriefing}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs ${
                  isSpeaking ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Stop Voice Narration' : `Listen Audio Briefing (${ttsLang.toUpperCase()})`}</span>
              </button>

              <button
                onClick={() => navigateTo('route')}
                className="py-2.5 px-4 rounded-xl bg-white border border-border text-xs font-bold text-ink hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <span>Reroute</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Signature Flood Arrival Clock */}
          <FloodClock 
            initialSeconds={1721} 
            thresholdTitle="Estimated time until hazardous water reaches low-lying roads"
            expectedDepth={`${currentHydroPoint.depth + depthSurcharge} cm`}
          />

          {/* 12. Crowdsourced Ground Verification Feed (Feature 12) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CROWDSOURCED GROUND TRUTH</span>
                  <h4 className="text-sm font-bold text-ink">Citizen & Scout Verification Feed</h4>
                </div>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-primary text-white text-[11px] font-mono font-bold hover:bg-primary-hover transition shadow-xs"
              >
                + Report Spot
              </button>
            </div>

            <div className="space-y-2.5">
              {groundReports.slice(0, 3).map(rep => (
                <div key={rep.id} className="p-3 rounded-2xl bg-canvas border border-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-ink">{rep.author}</strong>
                    <span className="text-[10px] font-mono text-ink-muted">{rep.timeAgo}</span>
                  </div>
                  <div className="text-[11px] text-ink-secondary leading-snug">
                    {rep.statusText}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-red-700 font-bold">Water Depth: {rep.depthCm} cm</span>
                    <button
                      onClick={() => handleUpvoteReport(rep.id)}
                      className={`px-2 py-0.5 rounded-lg border transition ${
                        rep.userUpvoted ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-border hover:bg-slate-50'
                      }`}
                    >
                      👍 Confirm ({rep.upvotes})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 13. Emergency Safe Havens & Shelters Matrix (Feature 13) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">EMERGENCY ASSEMBLY</span>
                  <h4 className="text-sm font-bold text-ink">Nearby High-Ground Safe Havens</h4>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700">Dry Access</span>
            </div>

            <div className="space-y-2">
              {SAFE_PLACES_DATA.slice(0, 3).map(sp => (
                <div 
                  key={sp.id} 
                  onClick={() => {
                    if (sp.coordinates) {
                      setFocusTarget({ lat: sp.coordinates.lat, lng: sp.coordinates.lng, zoom: 15.0 });
                    }
                  }}
                  className="p-3 rounded-2xl bg-canvas border border-border hover:bg-white hover:border-emerald-300 transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-ink block">{sp.name}</strong>
                    <span className="text-[10px] font-mono text-ink-muted">{sp.type} • +{sp.elevation} MSL</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 block">Cap: {sp.capacity}</span>
                    <span className="text-[10px] font-mono text-primary flex items-center gap-0.5 justify-end">
                      Navigate <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 18. Historical Deluge Analog Matcher (Feature 18) */}
          <div className="bg-white rounded-3xl p-5 border border-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">EVENT MEMORY</span>
                  <h4 className="text-sm font-bold text-ink">Historical Mumbai Storm Analog Match</h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-primary">
                {HISTORICAL_ANALOG_EVENTS[0].similarityScore}% Match
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-canvas border border-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <strong className="text-ink">{HISTORICAL_ANALOG_EVENTS[0].title}</strong>
                <span className="text-slate-500">{HISTORICAL_ANALOG_EVENTS[0].date}</span>
              </div>
              <p className="text-[11px] text-ink-secondary leading-snug font-sans">
                {HISTORICAL_ANALOG_EVENTS[0].outcomeSummary}
              </p>
              <div className="text-[10px] text-amber-800 font-bold pt-1 border-t border-border">
                Key Lesson: {HISTORICAL_ANALOG_EVENTS[0].keyMitigation}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Supporting Modals & Drawers */}
      <ForecastEnsembleModal
        isOpen={isEnsembleModalOpen}
        onClose={() => setIsEnsembleModalOpen(false)}
        selectedWard={currentWard}
      />

      <DepartureWindowModal
        isOpen={isDepartureModalOpen}
        onClose={() => setIsDepartureModalOpen(false)}
        currentWard={currentWard}
        vehicleType={vehicleType}
      />

      <ReportConditionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentWard={currentWard}
        onSubmitReport={handleAddNewReport}
      />

      <CorridorElevationDrawer
        isOpen={isElevationDrawerOpen}
        onClose={() => setIsElevationDrawerOpen(false)}
        defaultCorridorId={elevationCorridorId}
      />

    </div>
  );
}
