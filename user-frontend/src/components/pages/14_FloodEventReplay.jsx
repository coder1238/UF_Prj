import React, { useState, useEffect, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Play, Pause, RotateCcw, FastForward, Clock, History, 
  Droplets, Waves, ShieldAlert, BarChart3, AlertTriangle, ArrowRight,
  Volume2, VolumeX, Sparkles, Sliders, Maximize2, Camera, GitCompare,
  Download, Printer, Bookmark, Radio, Layers, Mountain, Gauge, 
  IndianRupee, ChevronLeft, ChevronRight, Repeat, Info, Zap
} from 'lucide-react';

import { HISTORICAL_EVENTS } from '../../data/replayData';
import { replayAudio } from '../replay/ReplayAudioSynthesizer';

// 20 Modular Subcomponents
import ReplayBasinMap from '../replay/ReplayBasinMap';
import HydrographChart from '../replay/HydrographChart';
import WhatIfSimulator from '../replay/WhatIfSimulator';
import SubwayInundationTracker from '../replay/SubwayInundationTracker';
import TidalConfluenceClock from '../replay/TidalConfluenceClock';
import VehicleStabilityAdvisor from '../replay/VehicleStabilityAdvisor';
import WardHeatmapMatrix from '../replay/WardHeatmapMatrix';
import CCTVSimulatorModal from '../replay/CCTVSimulatorModal';
import ComparativeBenchmarkModal from '../replay/ComparativeBenchmarkModal';
import HoldingTankVisualizer from '../replay/HoldingTankVisualizer';
import DistressStreamDrawer from '../replay/DistressStreamDrawer';
import ElevationCrossSection from '../replay/ElevationCrossSection';
import CorridorAccessChecker from '../replay/CorridorAccessChecker';
import EconomicImpactCounter from '../replay/EconomicImpactCounter';
import ReplayLogModal from '../replay/ReplayLogModal';
import PostMortemBulletinModal from '../replay/PostMortemBulletinModal';
import MilestoneBookmarks from '../replay/MilestoneBookmarks';
import PumpingTelemetryConsole from '../replay/PumpingTelemetryConsole';
import TheaterModeHUD from '../replay/TheaterModeHUD';

export default function FloodEventReplay() {
  const { navigateTo } = useNavigation();

  // Events state (supports imported custom events)
  const [eventsList, setEventsList] = useState(HISTORICAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState('event-2023');
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Active view tab: 'overview' | 'hydrodynamics' | 'infrastructure' | 'dispatch' | 'analytics'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [isCCTVOpen, setIsCCTVOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // "What-If" Counterfactual Infrastructure State
  const [whatIfState, setWhatIfState] = useState({
    tanksActive: true,
    flapGatesActive: false,
    pumpBoostActive: false,
    mithiDesiltingActive: false
  });

  // Calculate composite depth factor from counterfactuals
  let reductionPercent = 0;
  if (whatIfState.tanksActive) reductionPercent += 28;
  if (whatIfState.flapGatesActive) reductionPercent += 16;
  if (whatIfState.pumpBoostActive) reductionPercent += 22;
  if (whatIfState.mithiDesiltingActive) reductionPercent += 18;
  reductionPercent = Math.min(65, reductionPercent);
  const depthFactor = 1 - (reductionPercent / 100);

  const whatIfModifiers = {
    ...whatIfState,
    reductionPercent,
    depthFactor
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find active event
  const currentEvent = eventsList.find(e => e.id === selectedEventId) || eventsList[0];
  const currentStep = currentEvent.timelineSteps[playbackIndex] || currentEvent.timelineSteps[0];

  // Automated playback loop
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= currentEvent.timelineSteps.length - 1) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, currentEvent, isLooping]);

  // Audio update on timestep change
  useEffect(() => {
    if (!isMuted) {
      replayAudio.updateIntensity(currentStep.rain, 75, isPlaying);
      if (currentStep.rain > 100) {
        // Occasional thunder burst
        replayAudio.triggerThunder();
      }
    }
  }, [playbackIndex, isPlaying, isMuted, currentStep]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setPlaybackIndex(prev => Math.min(currentEvent.timelineSteps.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setPlaybackIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'r' || e.key === 'R') {
        setPlaybackIndex(0);
        setIsPlaying(false);
        showToast('Timeline reset to step 1.');
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsTheaterOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentEvent, isMuted]);

  // Toggle Mute Audio
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    replayAudio.setMuted(nextMuted);
    if (!nextMuted) {
      replayAudio.updateIntensity(currentStep.rain, 75, isPlaying);
      showToast('Sound effects unmuted: Procedural storm ambience active.');
    } else {
      showToast('Audio muted.');
    }
  };

  // Trigger siren test
  const handleTriggerSiren = () => {
    replayAudio.triggerSiren();
    showToast('Sounding civil defense flood evacuation siren...');
  };

  // Handle What-If toggle
  const handleToggleWhatIf = (key) => {
    setWhatIfState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Reset What-If
  const handleResetWhatIf = () => {
    setWhatIfState({
      tanksActive: false,
      flapGatesActive: false,
      pumpBoostActive: false,
      mithiDesiltingActive: false
    });
    showToast('Reset to unmitigated historical baseline.');
  };

  // Handle custom scenario import
  const handleImportCustomEvent = (newEvent) => {
    setEventsList(prev => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
    setPlaybackIndex(0);
    setIsPlaying(false);
    showToast(`Loaded scenario: "${newEvent.name}"`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-mono px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1.5">
            <History className="w-4 h-4" /> Historical Hydrodynamic Simulator & Incident Debrief
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Mumbai Cloudburst Event Replay
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Second-by-second meteorological playback, high-tide outfall blockades, hydrodynamic vehicle physics, and counterfactual municipal engineering simulations.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio toggle button */}
          <button 
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-colors shadow-xs ${
              !isMuted 
                ? 'bg-purple-primary text-white border-purple-primary' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle procedural storm sound effects (rain, pumps, thunder)"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>

          {/* Siren test button */}
          <button
            onClick={handleTriggerSiren}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors shadow-xs"
            title="Sound Civil Defense Siren"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Test Siren</span>
          </button>

          {/* CCTV Modal button */}
          <button
            onClick={() => setIsCCTVOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Camera className="w-4 h-4 text-purple-primary" />
            <span>CCTV Sim</span>
          </button>

          {/* Comparative Benchmark button */}
          <button
            onClick={() => setIsBenchmarkOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <GitCompare className="w-4 h-4 text-purple-primary" />
            <span>Compare Events</span>
          </button>

          {/* Scenario JSON Log button */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-purple-primary" />
            <span>Import / Export</span>
          </button>

          {/* Official Bulletin Generator */}
          <button
            onClick={() => setIsBulletinOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-purple-primary" />
            <span>Debrief PDF</span>
          </button>

          {/* Theater Mode button */}
          <button
            onClick={() => setIsTheaterOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Theater (F)</span>
          </button>
        </div>
      </div>

      {/* Event Selector & Category Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-soft text-purple-deep rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-muted font-bold block">
              Active Historical Cloudburst Scenario
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-base text-ink">{currentEvent.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                {currentEvent.date}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {currentEvent.category} &bull; Total Rain: <strong className="text-ink">{currentEvent.totalRainfall}</strong> &bull; Tide Peak: <strong className="text-ink">{currentEvent.highTidePeak}</strong>
            </p>
          </div>
        </div>

        {/* Dropdown selector */}
        <select 
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            setPlaybackIndex(0);
            setIsPlaying(false);
          }}
          className="px-4 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary shadow-xs"
        >
          {eventsList.map(e => (
            <option key={e.id} value={e.id}>{e.name} ({e.date})</option>
          ))}
        </select>
      </div>

      {/* Main Playback Console (Scrubber, Controls & Telemetry Cards) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        
        {/* Playback Controls & Scrubber */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            {/* Step Backward */}
            <button
              onClick={() => setPlaybackIndex(prev => Math.max(0, prev - 1))}
              className="p-3 rounded-2xl bg-canvas hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200"
              title="Step Backward (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play/Pause Button */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white flex items-center justify-center shadow-md shadow-purple-primary/25 transition-transform active:scale-95"
              title="Play / Pause (Spacebar)"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            {/* Step Forward */}
            <button
              onClick={() => setPlaybackIndex(prev => Math.min(currentEvent.timelineSteps.length - 1, prev + 1))}
              className="p-3 rounded-2xl bg-canvas hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200"
              title="Step Forward (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Reset */}
            <button 
              onClick={() => {
                setPlaybackIndex(0);
                setIsPlaying(false);
              }}
              className="p-3 rounded-2xl bg-canvas hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200"
              title="Reset Timeline (R)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-3 rounded-2xl border transition-colors ${
                isLooping ? 'bg-purple-50 text-purple-primary border-purple-primary' : 'bg-canvas text-slate-400 border-slate-200 hover:text-slate-700'
              }`}
              title="Toggle Auto-Repeat Loop"
            >
              <Repeat className="w-5 h-5" />
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-canvas p-1 rounded-2xl border border-slate-200">
              {[0.5, 1, 2, 4, 8].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    playbackSpeed === spd ? 'bg-purple-primary text-white shadow-xs' : 'text-muted hover:text-ink'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Time & Milestone counter */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted">Step:</span>
            <span className="text-base font-extrabold text-ink">{playbackIndex + 1} / {currentEvent.timelineSteps.length}</span>
            <span className="px-3 py-1 rounded-full bg-purple-soft text-purple-deep font-bold border border-purple-200">
              Time: {currentStep.time} IST
            </span>
          </div>
        </div>

        {/* Continuous Slider Scrub Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
            <span>{currentEvent.timelineSteps[0].time} IST (Initiation)</span>
            <span className="font-bold text-purple-primary">{currentStep.time} IST &bull; {currentStep.title}</span>
            <span>{currentEvent.timelineSteps[currentEvent.timelineSteps.length - 1].time} IST (Clearance)</span>
          </div>
          <input
            type="range"
            min="0"
            max={currentEvent.timelineSteps.length - 1}
            value={playbackIndex}
            onChange={(e) => {
              setPlaybackIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
          />
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
            <span className="text-[10px] font-mono text-muted uppercase block">Instant Rain Rate</span>
            <span className="text-2xl font-mono font-extrabold text-purple-primary">
              {currentStep.rain} <span className="text-xs text-muted font-normal">mm/h</span>
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Radar reflectivity</span>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
            <span className="text-[10px] font-mono text-muted uppercase block">Basin Water Depth</span>
            <span className={`text-2xl font-mono font-extrabold ${currentStep.depth > 35 ? 'text-red-600' : 'text-ink'}`}>
              {Math.round(currentStep.depth * depthFactor)} <span className="text-xs text-muted font-normal">cm</span>
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {depthFactor < 1 ? `(${currentStep.depth}cm unmitigated)` : 'Hindmata SWMM node'}
            </span>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
            <span className="text-[10px] font-mono text-muted uppercase block">Closed Arterials</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {currentStep.roadsClosed} <span className="text-xs text-muted font-normal">routes</span>
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Subways & bypasses</span>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70">
            <span className="text-[10px] font-mono text-muted uppercase block">Sea Tide Surge</span>
            <span className={`text-2xl font-mono font-extrabold ${currentStep.tide > 3.8 ? 'text-red-600' : 'text-cyan-700'}`}>
              {currentStep.tide?.toFixed(2) || '2.50'} <span className="text-xs text-muted font-normal">m MSL</span>
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {currentStep.tide > 3.8 ? 'Gates Locked Shut' : 'Gravity Drain Open'}
            </span>
          </div>

          {/* Card 5 */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/70 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono text-muted uppercase block">Dewatering Duty</span>
            <span className="text-base font-mono font-extrabold text-emerald-700 block truncate mt-1">
              {currentStep.pumps}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">{currentStep.activeTurbines || 6} Turbines Running</span>
          </div>
        </div>

        {/* Narrative Box of Current Timestamp */}
        <div className="bg-purple-50/60 border border-purple-primary/20 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Phase {playbackIndex + 1}: {currentStep.title}
            </div>
            <span className="text-xs font-mono text-slate-500">{currentStep.time} IST</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {currentStep.note}
          </p>
        </div>

        {/* Horizontal Timeline Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {currentEvent.timelineSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPlaybackIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                playbackIndex === idx 
                  ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                  : 'bg-canvas border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className={`text-[10px] font-mono block ${playbackIndex === idx ? 'text-purple-soft' : 'text-muted'}`}>
                {step.time} IST
              </span>
              <span className="text-xs font-bold block truncate mt-0.5">{step.title}</span>
              <span className="text-[10px] font-mono block mt-1">
                {Math.round(step.depth * depthFactor)} cm &bull; {step.rain} mm/h
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Tab Navigation for Detailed Interactive Modules */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-mono font-bold">
        {[
          { id: 'overview', label: 'Basin Map & Radar', icon: Waves },
          { id: 'hydrodynamics', label: 'Hydrodynamics & Hydrograph', icon: BarChart3 },
          { id: 'infrastructure', label: 'What-If & Retention Tanks', icon: Sliders },
          { id: 'dispatch', label: 'Distress Log & Arterials', icon: Radio },
          { id: 'analytics', label: 'Economics & Annotations', icon: IndianRupee }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-purple-primary text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Basin Map & Radar View */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReplayBasinMap 
                currentStep={currentStep} 
                whatIfModifiers={whatIfModifiers} 
              />
            </div>
            <div>
              <TidalConfluenceClock 
                currentStep={currentStep} 
                selectedEvent={currentEvent} 
              />
            </div>
          </div>

          <WardHeatmapMatrix 
            currentStep={currentStep} 
            whatIfModifiers={whatIfModifiers} 
          />
        </div>
      )}

      {/* TAB 2: Hydrodynamics & Physics */}
      {activeTab === 'hydrodynamics' && (
        <div className="space-y-6">
          <HydrographChart 
            timelineSteps={currentEvent.timelineSteps}
            currentStepIndex={playbackIndex}
            onSelectIndex={(idx) => {
              setPlaybackIndex(idx);
              setIsPlaying(false);
            }}
            whatIfModifiers={whatIfModifiers}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ElevationCrossSection 
              currentStep={currentStep}
              whatIfModifiers={whatIfModifiers}
            />
            <SubwayInundationTracker 
              currentStep={currentStep}
              whatIfModifiers={whatIfModifiers}
            />
          </div>

          <VehicleStabilityAdvisor 
            currentStep={currentStep}
            whatIfModifiers={whatIfModifiers}
          />
        </div>
      )}

      {/* TAB 3: Infrastructure & Counterfactuals */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <WhatIfSimulator 
            whatIfState={whatIfState}
            onToggleWhatIf={handleToggleWhatIf}
            onResetWhatIf={handleResetWhatIf}
            currentStep={currentStep}
            selectedEvent={currentEvent}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HoldingTankVisualizer 
              currentStep={currentStep}
              whatIfModifiers={whatIfModifiers}
            />
            <PumpingTelemetryConsole 
              currentStep={currentStep}
              whatIfModifiers={whatIfModifiers}
            />
          </div>
        </div>
      )}

      {/* TAB 4: Disaster Logs & Arterials */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistressStreamDrawer 
              currentStep={currentStep}
              selectedEvent={currentEvent}
            />
            <CorridorAccessChecker 
              currentStep={currentStep}
              whatIfModifiers={whatIfModifiers}
            />
          </div>
        </div>
      )}

      {/* TAB 5: Economics, Analytics & Bookmarks */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <EconomicImpactCounter 
            currentStep={currentStep}
            whatIfModifiers={whatIfModifiers}
            playbackIndex={playbackIndex}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MilestoneBookmarks 
              currentStep={currentStep}
              currentStepIndex={playbackIndex}
              onSelectIndex={(idx) => {
                setPlaybackIndex(idx);
                setIsPlaying(false);
              }}
              selectedEvent={currentEvent}
            />

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider block mb-1">
                  Simulation & Model Center
                </span>
                <h3 className="text-lg font-bold text-ink">
                  AI Hydraulic Transparency & SWMM Simulation
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Historical simulations leverage SWMM (Storm Water Management Model) 5.2 1D/2D hydrodynamic coupling with LSTM deep learning calibration for rainfall-runoff forecasts.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => navigateTo('ai-models')}
                  className="px-4 py-2 bg-purple-primary text-white text-xs font-bold rounded-xl hover:bg-purple-deep transition-colors"
                >
                  Explore AI Hydraulic Models &rarr;
                </button>
                <button
                  onClick={() => navigateTo('forecast')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Check Live 0-3h Forecast &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CCTVSimulatorModal 
        isOpen={isCCTVOpen}
        onClose={() => setIsCCTVOpen(false)}
        currentStep={currentStep}
        selectedEvent={currentEvent}
      />

      <ComparativeBenchmarkModal 
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      <ReplayLogModal 
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        currentEvent={currentEvent}
        onImportCustomEvent={handleImportCustomEvent}
      />

      <PostMortemBulletinModal 
        isOpen={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
        selectedEvent={currentEvent}
        currentStep={currentStep}
      />

      <TheaterModeHUD 
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
        selectedEvent={currentEvent}
        currentStep={currentStep}
        playbackIndex={playbackIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setPlaybackIndex(0);
          setIsPlaying(false);
        }}
        onStepChange={(idx) => setPlaybackIndex(idx)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        whatIfModifiers={whatIfModifiers}
      />

    </div>
  );
}
