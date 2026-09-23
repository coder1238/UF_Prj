import React, { useState, useEffect, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Navigation, AlertTriangle, ShieldCheck, Volume2, VolumeX, PhoneCall, 
  ArrowUp, ArrowRight, ArrowLeft, RotateCcw, XCircle, MapPin, Gauge,
  Compass, Radio, Zap, Camera, Mountain, CloudRain, Users, 
  Download, Car, ShieldAlert, Sparkles, Sliders, Play, Pause,
  Layers, FlipHorizontal, HelpCircle, Eye, AlertOctagon, Repeat
} from 'lucide-react';

// Specialized HUD Sub-Modules
import hudAudio from '../hud/HUDAudioSynthesizer';
import HUDMiniRadar from '../hud/HUDMiniRadar';
import HUDSimulationControls from '../hud/HUDSimulationControls';
import HUDHydrodynamicsGauge from '../hud/HUDHydrodynamicsGauge';
import HUDHazardReportModal from '../hud/HUDHazardReportModal';
import HUDRouteSelectorModal, { CORRIDOR_OPTIONS } from '../hud/HUDRouteSelectorModal';
import HUDCCTVModal from '../hud/HUDCCTVModal';
import HUDVehicleSwitcherModal from '../hud/HUDVehicleSwitcherModal';
import HUDWeatherRadarBar from '../hud/HUDWeatherRadarBar';
import HUDElevationProfileModal from '../hud/HUDElevationProfileModal';
import HUDRescueBeaconModal from '../hud/HUDRescueBeaconModal';
import HUDShelterRadarModal from '../hud/HUDShelterRadarModal';
import HUDFamilyShareModal from '../hud/HUDFamilyShareModal';
import HUDBlackboxLoggerModal from '../hud/HUDBlackboxLoggerModal';

export default function ActiveNavigationHUD() {
  const { 
    currentWard, 
    clearanceThreshold, 
    setClearanceThreshold, 
    vehicleType, 
    setVehicleType,
    voiceLanguage,
    setVoiceLanguage,
    speakAlert 
  } = useFlood();

  const { navigateTo } = useNavigation();

  // Active corridor selection (Feature 6)
  const [activeCorridor, setActiveCorridor] = useState(CORRIDOR_OPTIONS[0]); // BKC Elevated Connector by default
  const routeSteps = activeCorridor.steps;

  // Navigation progression state
  const [activeStep, setActiveStep] = useState(0);
  const [speed, setSpeed] = useState(34);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [audioEffectsMuted, setAudioEffectsMuted] = useState(false);
  const [isProjectionMode, setIsProjectionMode] = useState(false); // Feature 3: Windshield Reflection HUD

  // Simulation engine state (Feature 2)
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [tripProgress, setTripProgress] = useState(10);
  const [stepRemainingMeters, setStepRemainingMeters] = useState(380);
  const [vehicleHeading, setVehicleHeading] = useState(24);

  // Modals state for 15 detailed features
  const [showHazardModal, setShowHazardModal] = useState(false); // Feature 5
  const [showRouteModal, setShowRouteModal] = useState(false); // Feature 6
  const [showCCTVModal, setShowCCTVModal] = useState(false); // Feature 7
  const [showVehicleModal, setShowVehicleModal] = useState(false); // Feature 9
  const [showElevationModal, setShowElevationModal] = useState(false); // Feature 11
  const [showBeaconModal, setShowBeaconModal] = useState(false); // Feature 12
  const [showShelterModal, setShowShelterModal] = useState(false); // Feature 13
  const [showFamilyModal, setShowFamilyModal] = useState(false); // Feature 14
  const [showBlackboxModal, setShowBlackboxModal] = useState(false); // Feature 15

  // Custom driver hazard pins created in this session
  const [customHazards, setCustomHazards] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const currentStepData = routeSteps[activeStep] || routeSteps[0];
  const isClearanceExceeded = currentStepData.depth > clearanceThreshold;

  // Speak announcement & sound alert on step change
  const triggerVoiceGuidance = (step = currentStepData) => {
    if (!step) return;

    if (!audioEffectsMuted) {
      if (step.risk === 'danger' || isClearanceExceeded) {
        hudAudio.playHazardAlarm(2);
      } else {
        hudAudio.playTurnChime();
      }
    }

    if (!voiceMuted) {
      if (step.risk === 'danger' || isClearanceExceeded) {
        speakAlert(`Warning: Approaching hazardous flooding of ${step.depth} centimeters. Water level exceeds your ${vehicleType} clearance limit. Recommending elevated bypass.`);
      } else {
        speakAlert(step.instruction);
      }
    }
  };

  useEffect(() => {
    triggerVoiceGuidance(currentStepData);
  }, [activeStep, activeCorridor]);

  // Simulation Engine Interval (Feature 2)
  useEffect(() => {
    if (!isSimPlaying) return;

    const interval = setInterval(() => {
      setStepRemainingMeters(prev => {
        const decrement = Math.round(15 * simSpeed);
        if (prev - decrement <= 0) {
          // Advance to next step
          if (activeStep < routeSteps.length - 1) {
            setActiveStep(s => s + 1);
            hudAudio.playSonarPing();
            return 450;
          } else {
            setIsSimPlaying(false);
            hudAudio.playTurnChime();
            showToast("Destination Arrived: Safe High Ground Haven Reached!");
            return 0;
          }
        }
        return prev - decrement;
      });

      // Update total trip progress percentage
      setTripProgress(prev => {
        const next = prev + (0.5 * simSpeed);
        return Math.min(100, next);
      });

      // Realistic speed fluctuation during drive
      setSpeed(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(18, Math.min(48, prev + delta));
      });

      // Slight compass drift
      setVehicleHeading(prev => (prev + (Math.floor(Math.random() * 3) - 1) + 360) % 360);

    }, 800);

    return () => clearInterval(interval);
  }, [isSimPlaying, simSpeed, activeStep, routeSteps.length]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setIsSimPlaying(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setVoiceMuted(prev => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        setIsProjectionMode(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        setShowRouteModal(true);
      } else if (e.key === 'Escape') {
        setShowHazardModal(false);
        setShowRouteModal(false);
        setShowCCTVModal(false);
        setShowVehicleModal(false);
        setShowElevationModal(false);
        setShowBeaconModal(false);
        setShowShelterModal(false);
        setShowFamilyModal(false);
        setShowBlackboxModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNextStep = () => {
    if (activeStep < routeSteps.length - 1) {
      hudAudio.playClick();
      setActiveStep(prev => prev + 1);
      setStepRemainingMeters(400);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      hudAudio.playClick();
      setActiveStep(prev => prev - 1);
      setStepRemainingMeters(400);
    }
  };

  const handleApplyReroute = () => {
    // Switch to BKC Elevated Connector
    const bypassCorridor = CORRIDOR_OPTIONS[0];
    setActiveCorridor(bypassCorridor);
    setActiveStep(1); // Jump onto the safe elevated ramp
    showToast("Auto-Reroute Activated: BKC Elevated Connector (0cm water)");
    hudAudio.playTurnChime();
  };

  const handleHazardSubmitted = (newHazard) => {
    setCustomHazards(prev => [newHazard, ...prev]);
    showToast(`Hazard Broadcasted: ${newHazard.hazard} at ${newHazard.location}`);
  };

  const handleShelterDiverted = (shelter) => {
    showToast(`Destination Diverted to: ${shelter.name}`);
  };

  return (
    <div className={`min-h-screen text-white select-none transition-all duration-300 ${
      isProjectionMode 
        ? 'bg-black font-mono scale-x-[-1] contrast-200' 
        : 'bg-ink'
    }`}>
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-purple-primary text-white px-5 py-2.5 rounded-2xl shadow-2xl font-mono text-xs font-bold border border-white/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Projection Mode Top Bar Notice */}
      {isProjectionMode && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 font-bold">
          <span className="flex items-center gap-2">
            <FlipHorizontal className="w-4 h-4" />
            WINDSHIELD REFLECTION MODE ACTIVE (Place device flat on dashboard facing glass)
          </span>
          <button 
            onClick={() => setIsProjectionMode(false)}
            className="px-3 py-1 bg-emerald-500 text-black rounded-lg text-xs font-bold"
          >
            Exit Mirror HUD
          </button>
        </div>
      )}

      <div className="p-4 sm:p-6 flex flex-col justify-between min-h-screen max-w-[1600px] mx-auto space-y-4">
        
        {/* TOP HUD BAR */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          
          {/* Left: Branding & Satellite GPS Status */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-primary text-white shadow-lg shadow-purple-primary/30 flex items-center justify-center animate-pulse">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-purple-soft uppercase">
                  IN-TRANSIT DISASTER HUD
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Radio className="w-3 h-3 animate-ping" /> RTK GPS Active (±0.3m)
                </span>
              </div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {activeCorridor.name}
                <button
                  onClick={() => setShowRouteModal(true)}
                  className="text-xs font-mono text-purple-soft hover:underline font-normal flex items-center gap-1"
                >
                  [Change Corridor]
                </button>
              </h1>
            </div>
          </div>

          {/* Right: Telemetry Badges & Quick Tool Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Speedometer with Manual Throttle / Cruise Adjusters */}
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-3">
              <div className="text-center">
                <span className="text-[9px] text-muted block uppercase font-mono">Speed</span>
                <span className="text-2xl font-mono font-black text-white">
                  {speed} <span className="text-[10px] font-normal text-muted">km/h</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l border-white/10 pl-2">
                <button 
                  onClick={() => setSpeed(s => Math.min(80, s + 5))}
                  className="px-1.5 py-0.5 text-[9px] bg-white/10 hover:bg-white/20 rounded font-mono"
                  title="Throttle +5 km/h"
                >
                  +5
                </button>
                <button 
                  onClick={() => setSpeed(s => Math.max(10, s - 5))}
                  className="px-1.5 py-0.5 text-[9px] bg-white/10 hover:bg-white/20 rounded font-mono"
                  title="Brake -5 km/h"
                >
                  -5
                </button>
              </div>
            </div>

            {/* Vehicle Limit Badge (Feature 9 Trigger) */}
            <button 
              onClick={() => setShowVehicleModal(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-2xl text-center transition-colors group"
              title="Click to Switch Vehicle Profile"
            >
              <div className="flex items-center justify-center gap-1 text-[9px] text-muted uppercase font-mono">
                <span>{vehicleType} Limit</span>
                <Sliders className="w-2.5 h-2.5 text-purple-soft group-hover:rotate-90 transition-transform" />
              </div>
              <span className="text-2xl font-mono font-bold text-purple-soft">
                {clearanceThreshold} <span className="text-[10px] font-normal text-muted">cm</span>
              </span>
            </button>

            {/* Repeat Audio Instruction Button */}
            <button 
              onClick={() => triggerVoiceGuidance()}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white transition-colors"
              title="Repeat Voice Announcement"
            >
              <Repeat className="w-5 h-5" />
            </button>

            {/* Voice Mute Toggle */}
            <button 
              onClick={() => {
                hudAudio.playClick();
                setVoiceMuted(!voiceMuted);
              }}
              className={`p-3 rounded-2xl border transition-colors ${
                voiceMuted 
                  ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-white'
              }`}
              title={voiceMuted ? 'Unmute Audio Guidance' : 'Mute Guidance'}
            >
              {voiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Windshield Reflection Mirror Mode Toggle (Feature 3) */}
            <button 
              onClick={() => {
                hudAudio.playClick();
                setIsProjectionMode(!isProjectionMode);
              }}
              className={`p-3 rounded-2xl border transition-colors flex items-center gap-1 ${
                isProjectionMode 
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold' 
                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-muted hover:text-white'
              }`}
              title="Toggle Windshield Reflection Mode (HUD Inversion)"
            >
              <FlipHorizontal className="w-5 h-5" />
            </button>

            {/* Exit HUD Button */}
            <button 
              onClick={() => navigateTo('route')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-muted hover:text-white border border-white/10 transition-colors"
              title="Exit HUD to Safe Route Planning"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* DRIVER QUICK-ACTION DOCK BAR (Access to 15 Features) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <button
            onClick={() => setShowHazardModal(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>1-Tap Hazard Report</span>
          </button>

          <button
            onClick={() => setShowRouteModal(true)}
            className="px-3 py-2 rounded-xl bg-purple-primary/20 hover:bg-purple-primary/30 border border-purple-primary/30 text-purple-200 font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Corridor Switcher</span>
          </button>

          <button
            onClick={() => setShowCCTVModal(true)}
            className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Underpass CCTV Live</span>
          </button>

          <button
            onClick={() => setShowElevationModal(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>MSL Elevation Profile</span>
          </button>

          <button
            onClick={() => setShowShelterModal(true)}
            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Nearby Shelter Haven</span>
          </button>

          <button
            onClick={() => setShowFamilyModal(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Share ETA Beacon</span>
          </button>

          <button
            onClick={() => setShowBeaconModal(true)}
            className="px-3 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500/40 text-red-300 font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Rescue Strobe Beacon</span>
          </button>

          <button
            onClick={() => setShowBlackboxModal(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-muted hover:text-white font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Insurance Blackbox</span>
          </button>
        </div>

        {/* MAIN HUD STAGE (12-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
          
          {/* Left Column (7 cols): Turn Maneuver Box & Real-Time Simulation Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            
            {/* Large Maneuver Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-muted tracking-wider">
                      Leg {activeStep + 1} of {routeSteps.length}
                    </span>
                    <span className="text-[11px] font-mono text-purple-soft bg-purple-primary/20 px-3 py-1 rounded-full border border-purple-primary/30">
                      ETA: {currentStepData.eta}
                    </span>
                  </div>

                  <span className={`text-xs font-mono px-3 py-1 rounded-full font-bold uppercase border ${
                    currentStepData.risk === 'danger' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                      : currentStepData.risk === 'caution'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentStepData.risk.toUpperCase()} SECTOR
                  </span>
                </div>

                <div className="flex items-start gap-6 my-4">
                  {/* Directional Maneuver Arrow */}
                  <div className={`p-5 rounded-2xl shrink-0 transition-transform ${
                    currentStepData.risk === 'danger' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-bounce' 
                      : 'bg-purple-primary text-white shadow-xl shadow-purple-primary/30'
                  }`}>
                    {currentStepData.turn === 'straight' && <ArrowUp className="w-12 h-12" />}
                    {currentStepData.turn === 'left' && <ArrowLeft className="w-12 h-12" />}
                    {currentStepData.turn === 'right' && <ArrowRight className="w-12 h-12" />}
                    {currentStepData.turn === 'warning' && <AlertTriangle className="w-12 h-12 text-red-400" />}
                    {currentStepData.turn === 'destination' && <ShieldCheck className="w-12 h-12 text-emerald-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
                        {isSimPlaying ? `${stepRemainingMeters} m` : currentStepData.distance}
                      </span>
                      <span className="text-xs font-mono text-muted uppercase">remaining in leg</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white/95 leading-snug">
                      {currentStepData.instruction}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Maneuver Bottom Strip */}
              <div className="border-t border-white/10 pt-4 mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted font-mono flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-soft shrink-0" />
                  <span>Next Action: <strong className="text-white">{currentStepData.nextAction}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevStep}
                    disabled={activeStep === 0}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono font-bold disabled:opacity-30 hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={activeStep === routeSteps.length - 1}
                    className="px-5 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-xs font-mono font-bold text-white disabled:opacity-30 shadow-lg shadow-purple-primary/30 transition-all"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Real-time Auto-Drive Simulation Engine */}
            <HUDSimulationControls
              isPlaying={isSimPlaying}
              onTogglePlay={() => setIsSimPlaying(!isSimPlaying)}
              onReset={() => {
                setIsSimPlaying(false);
                setActiveStep(0);
                setTripProgress(0);
                setStepRemainingMeters(380);
              }}
              simSpeed={simSpeed}
              onChangeSimSpeed={setSimSpeed}
              currentStep={activeStep}
              totalSteps={routeSteps.length}
              tripProgress={tripProgress}
              onChangeProgress={setTripProgress}
              remainingMeters={stepRemainingMeters}
            />

          </div>

          {/* Right Column (5 cols): Spatial Vector Radar, Submerged Depth Meter, Hydrodynamics & Emergency SOS */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            
            {/* Feature 1: Interactive Live Spatial Mini-Radar Map */}
            <HUDMiniRadar
              currentStep={activeStep}
              routeSteps={routeSteps}
              vehicleHeading={vehicleHeading}
              onSelectStep={(idx) => {
                setActiveStep(idx);
                hudAudio.playSonarPing();
              }}
              hazards={customHazards}
            />

            {/* Submerged Depth Sensor & Clearance Exceeded Alert */}
            <div className={`p-5 rounded-3xl border transition-all ${
              isClearanceExceeded 
                ? 'bg-red-950/60 border-red-500/60 shadow-xl shadow-red-950/50' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-muted tracking-wider">Submerged Depth Sensor</span>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  isClearanceExceeded 
                    ? 'bg-red-500/30 text-red-300 border border-red-500/40 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isClearanceExceeded ? 'Exceeds Clearance' : 'Safe to Cross'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl font-mono font-extrabold text-white">{currentStepData.depth}</span>
                <span className="text-sm font-mono text-muted">cm current water depth</span>
              </div>

              {/* Progress gauge bar */}
              <div className="w-full h-3.5 rounded-full bg-white/10 overflow-hidden relative mt-2">
                <div 
                  className={`h-full transition-all duration-500 ${
                    currentStepData.depth > 30 ? 'bg-red-500' : currentStepData.depth > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentStepData.depth / 60) * 100)}%` }}
                />
                {/* Vehicle clearance tick */}
                <div 
                  className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg z-10"
                  style={{ left: `${Math.min(100, (clearanceThreshold / 60) * 100)}%` }}
                  title={`Vehicle clearance: ${clearanceThreshold} cm`}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-muted mt-1.5">
                <span>0 cm (Dry)</span>
                <span className="text-purple-soft font-bold">Limit: {clearanceThreshold} cm ({vehicleType})</span>
                <span>60 cm (Severe)</span>
              </div>

              {/* Warning advisory if clearance is exceeded */}
              {isClearanceExceeded && (
                <div className="mt-4 p-4 rounded-2xl bg-red-900/60 border border-red-500/60 text-xs">
                  <div className="flex items-center gap-2 font-bold text-red-200 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    HYDROSTATIC ENGINE IMMERSION HAZARD
                  </div>
                  <p className="text-red-200/90 leading-relaxed text-[11px]">
                    Water level exceeds vehicle intake clearance ({clearanceThreshold} cm). Exhaust backflow risk is severe. Rerouting through BKC flyover.
                  </p>
                  <button 
                    onClick={handleApplyReroute}
                    className="mt-3 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> ACCEPT AUTO-REROUTE (+2 min, 0 cm water)
                  </button>
                </div>
              )}
            </div>

            {/* Feature 4: Hydrodynamic Current Velocity & Buoyancy Risk Meter */}
            <HUDHydrodynamicsGauge 
              depth={currentStepData.depth}
              vehicleType={vehicleType}
              clearanceLimit={clearanceThreshold}
            />

            {/* Quick Helpline SOS Bar with Direct Action Drawer */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-mono block">Vehicle Stalled?</span>
                  <span className="text-xs font-bold text-white">Disaster Cell: 1916 / 108</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowBeaconModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono text-xs font-bold"
                >
                  Beacon
                </button>
                <button 
                  onClick={() => navigateTo('emergency')}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold shadow-lg shadow-red-600/20"
                >
                  Open SOS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Feature 10: Real-Time Doppler Rain Radar & Cloudburst Alert Bar */}
        <HUDWeatherRadarBar rainRate={42} isCloudburstRisk={true} />

        {/* BOTTOM BREADCRUMB SEQUENCE */}
        <footer className="border-t border-white/10 pt-4 flex items-center justify-between overflow-x-auto gap-2">
          {routeSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                hudAudio.playClick();
                setActiveStep(idx);
                setStepRemainingMeters(400);
              }}
              className={`flex-1 min-w-[140px] p-2.5 rounded-xl border text-left transition-all ${
                activeStep === idx 
                  ? 'bg-purple-primary/30 border-purple-primary text-white shadow-lg shadow-purple-primary/20 ring-1 ring-purple-primary' 
                  : 'bg-white/5 border-white/10 text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase font-bold">Leg 0{idx + 1}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  step.risk === 'danger' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {step.depth} cm
                </span>
              </div>
              <p className="text-xs font-semibold truncate text-white/90">{step.instruction}</p>
            </button>
          ))}
        </footer>

      </div>

      {/* MODALS FOR THE 15 DETAILED FEATURES */}
      <HUDHazardReportModal
        isOpen={showHazardModal}
        onClose={() => setShowHazardModal(false)}
        currentLocationName={currentStepData.instruction}
        currentDepth={currentStepData.depth}
        onReportSubmitted={handleHazardSubmitted}
      />

      <HUDRouteSelectorModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        selectedCorridorId={activeCorridor.id}
        onSelectCorridor={(newCorridor) => {
          setActiveCorridor(newCorridor);
          setActiveStep(0);
          setShowRouteModal(false);
          showToast(`Switched Corridor: ${newCorridor.name}`);
        }}
      />

      <HUDCCTVModal
        isOpen={showCCTVModal}
        onClose={() => setShowCCTVModal(false)}
      />

      <HUDVehicleSwitcherModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        currentVehicleId={vehicleType}
        onSelectVehicle={(veh) => {
          setVehicleType(veh.id);
          setClearanceThreshold(veh.clearance);
          setShowVehicleModal(false);
          showToast(`Calibrated for ${veh.name} (${veh.clearance} cm limit)`);
        }}
      />

      <HUDElevationProfileModal
        isOpen={showElevationModal}
        onClose={() => setShowElevationModal(false)}
        currentStep={activeStep}
      />

      <HUDRescueBeaconModal
        isOpen={showBeaconModal}
        onClose={() => setShowBeaconModal(false)}
        currentLocationName={currentStepData.instruction}
        vehicleType={vehicleType}
      />

      <HUDShelterRadarModal
        isOpen={showShelterModal}
        onClose={() => setShowShelterModal(false)}
        onDivertToShelter={handleShelterDiverted}
      />

      <HUDFamilyShareModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        eta={currentStepData.eta}
        currentCorridor={activeCorridor.name}
        speed={speed}
      />

      <HUDBlackboxLoggerModal
        isOpen={showBlackboxModal}
        onClose={() => setShowBlackboxModal(false)}
        vehicleType={vehicleType}
        clearanceLimit={clearanceThreshold}
        maxDepthTraversed={currentStepData.depth}
        averageSpeed={speed}
      />

    </div>
  );
}
