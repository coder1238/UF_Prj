import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useFlood } from '../../context/FloodContext';
import PersonalSafetyRing from '../shared/PersonalSafetyRing';
import FloodClock from '../shared/FloodClock';
import InteractiveMapCanvas from '../shared/InteractiveMapCanvas';
import ForecastTimeline from '../shared/ForecastTimeline';
import CitizenFeaturesHub from '../home/CitizenFeaturesHub';
import { 
  ActiveWarningsModal, 
  EmergencyPanicModal, 
  TelemetryInspectorModal, 
  QuickHazardReportModal 
} from '../home/QuickActionModals';
import { 
  ShieldAlert, 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Droplets, 
  Clock, 
  Compass, 
  PhoneCall,
  Search,
  Sparkles,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { PLACES_STATUS } from '../../data/floodData';

export default function HomeSafetyOverview() {
  const { setActivePage, navigateTo } = useNavigation();
  const { currentWard, currentTimeline } = useFlood();

  // Modal States for 100% Workable Features
  const [isWarningsModalOpen, setIsWarningsModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [activeTelemetryMetric, setActiveTelemetryMetric] = useState(null);

  // Dynamic High Tide countdown
  const [tideSecondsLeft, setTideSecondsLeft] = useState(3840);
  useEffect(() => {
    const t = setInterval(() => setTideSecondsLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const tideMins = Math.floor(tideSecondsLeft / 60);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* 1. Top Banner Alert Bar (With Dynamic Tide & Interactive Triggers) */}
      <div className="bg-gradient-to-r from-primary-deep via-primary to-primary-deep rounded-2xl p-4 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide uppercase">MUMBAI MONSOON SURGE ACTIVE</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-mono font-bold tracking-wider">
                HIGH TIDE 21:40 (4.18m) • IN {tideMins} MIN
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Convective rainband moving northeast across {currentWard.name}. Nowcasting active for next 3 hours with sluice gate telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsWarningsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Active Warnings (5)</span>
          </button>
          <button 
            onClick={() => setIsSOSModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition shadow-sm flex items-center gap-1.5 animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Section: Asymmetric Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Value Proposition, Personal Safety & Flood Clock */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Headline Block */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary-deep text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              CITIZEN FLOOD INTELLIGENCE & NOWCASTING
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
              Know the water <br />
              <span className="text-primary">before you meet it.</span>
            </h1>

            <p className="text-sm text-ink-secondary leading-relaxed">
              Street-level flood forecasts, safer routes, and hyper-local warnings for the next three hours. Powered by real-time Doppler radar nowcasting and drainage simulations.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setActivePage('map')}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition shadow-card flex items-center gap-2"
              >
                <span>Check My Area</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setActivePage('route')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-canvas text-ink font-semibold text-sm border border-border transition shadow-subtle flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-primary" />
                <span>Plan a Safe Route</span>
              </button>
            </div>
          </div>

          {/* Signature Component 1: Personal Safety Ring (100% Workable) */}
          <PersonalSafetyRing 
            locationName={`${currentWard.name}`}
            riskLevel={currentWard.risk}
            currentDepth={currentWard.currentWater}
            peakDepth={currentWard.peakWater}
            rainRate={currentWard.rainRate}
          />

          {/* Signature Component 2: Flood Arrival Clock (100% Workable) */}
          <FloodClock 
            initialSeconds={1721} 
            thresholdTitle={`Estimated time until water reaches hazardous depth in ${currentWard.name}`}
            expectedDepth={`${currentWard.peakWater} cm`}
          />
        </div>

        {/* Right Column (7 Cols): Large Interactive Map & Clickable Spatial Telemetry */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <InteractiveMapCanvas 
              height="h-[480px]"
              onSelectRoad={(road) => setActivePage('map')}
            />
          </div>

          {/* Clickable Immediate Spatial Telemetry Strip (4 Deep-Dive Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              onClick={() => setActiveTelemetryMetric('precipitation')}
              className="bg-white hover:bg-purple-50/50 rounded-xl p-3.5 border border-border hover:border-purple-primary/40 shadow-subtle text-left transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase">PRECIPITATION</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-primary transition" />
              </div>
              <div className="text-lg font-bold font-mono text-ink mt-0.5">{currentTimeline.rainRate} mm/h</div>
              <div className="text-[10px] font-mono text-primary font-semibold flex items-center gap-1">
                <span>Santacruz Radar</span>
              </div>
            </button>

            <button 
              onClick={() => setActiveTelemetryMetric('water')}
              className="bg-white hover:bg-amber-50/50 rounded-xl p-3.5 border border-border hover:border-amber-400 shadow-subtle text-left transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase">CURRENT BASIN WATER</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition" />
              </div>
              <div className="text-lg font-bold font-mono text-ink mt-0.5">{currentWard.currentWater} cm</div>
              <div className="text-[10px] font-mono text-amber-700 font-semibold">
                Peak: {currentWard.peakWater} cm
              </div>
            </button>

            <button 
              onClick={() => setActiveTelemetryMetric('passability')}
              className="bg-white hover:bg-emerald-50/50 rounded-xl p-3.5 border border-border hover:border-emerald-400 shadow-subtle text-left transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase">ROAD PASSABILITY</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition" />
              </div>
              <div className="text-lg font-bold font-mono text-ink mt-0.5">82% Clear</div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold">Flyovers Normal</div>
            </button>

            <button 
              onClick={() => setActiveTelemetryMetric('peak')}
              className="bg-white hover:bg-purple-50/50 rounded-xl p-3.5 border border-border hover:border-purple-primary/40 shadow-subtle text-left transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-muted uppercase">NEXT FORECAST PEAK</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-primary transition" />
              </div>
              <div className="text-lg font-bold font-mono text-primary mt-0.5">+45 min</div>
              <div className="text-[10px] font-mono text-ink-secondary">High Tide Sync</div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Persistent 0–3 Hour Forecast Timeline Ribbon (100% Workable with Speed & Scrubbing) */}
      <ForecastTimeline />

      {/* 4. Quick Access Citizens Action Drawers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div 
          onClick={() => setActivePage('route')}
          className="bg-white hover:bg-surface-secondary/60 cursor-pointer p-4 rounded-2xl border border-border shadow-subtle transition group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink group-hover:text-primary transition">Flood-Aware Route Planner</h3>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition" />
            </div>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Find elevation-cleared routes bypassing inundated subways, open manholes, and low camber depressions.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setIsHazardModalOpen(true)}
          className="bg-white hover:bg-surface-secondary/60 cursor-pointer p-4 rounded-2xl border border-border shadow-subtle transition group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink group-hover:text-red-700 transition">Crowdsource Water Hazard</h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">AI Vision</span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Report standing water, live cables or missing manhole covers with instant computer vision depth estimation.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setActivePage('safe-places')}
          className="bg-white hover:bg-surface-secondary/60 cursor-pointer p-4 rounded-2xl border border-border shadow-subtle transition group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink group-hover:text-emerald-800 transition">Find Safe Havens & Shelters</h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">14 Verified</span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Locate high-ground evacuation shelters, 24/7 hospitals and relief points with live bed availability.
            </p>
          </div>
        </div>
      </div>

      {/* 5. THE 20 DETAILED NEW FEATURES CITIZEN INTELLIGENCE SUITE */}
      <div className="pt-4">
        <CitizenFeaturesHub 
          onOpenSOS={() => setIsSOSModalOpen(true)}
          onOpenHazardReport={() => setIsHazardModalOpen(true)}
        />
      </div>

      {/* Modals for 100% Workable Features */}
      <ActiveWarningsModal 
        isOpen={isWarningsModalOpen} 
        onClose={() => setIsWarningsModalOpen(false)} 
      />

      <EmergencyPanicModal 
        isOpen={isSOSModalOpen} 
        onClose={() => setIsSOSModalOpen(false)} 
      />

      <TelemetryInspectorModal 
        metricType={activeTelemetryMetric} 
        isOpen={!!activeTelemetryMetric} 
        onClose={() => setActiveTelemetryMetric(null)} 
      />

      <QuickHazardReportModal 
        isOpen={isHazardModalOpen} 
        onClose={() => setIsHazardModalOpen(false)} 
        onHazardSubmitted={(hazard) => {
          // Can provide feedback or toast
        }}
      />
    </div>
  );
}
