import React, { useState, useEffect } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import { RADAR_CELLS } from '../data/floodData';
import TimelineScrubber from '../components/layout/TimelineScrubber';
import NowcastRadarCanvas from '../components/nowcast/NowcastRadarCanvas';

// 20 Specialized Operational Feature Components
import RHIProfileModal from '../components/nowcast/RHIProfileModal';
import AWSValidationDrawer from '../components/nowcast/AWSValidationDrawer';
import BasinHyetographModal from '../components/nowcast/BasinHyetographModal';
import SevereAlertDispatcherModal from '../components/nowcast/SevereAlertDispatcherModal';
import TrecMotionEditorModal from '../components/nowcast/TrecMotionEditorModal';
import HydrometeorClassifierModal from '../components/nowcast/HydrometeorClassifierModal';
import RadarCoordinateProbe from '../components/nowcast/RadarCoordinateProbe';
import EnsembleModelComparatorModal from '../components/nowcast/EnsembleModelComparatorModal';
import WardRainfallRiskMatrix from '../components/nowcast/WardRainfallRiskMatrix';
import ClutterFilterControls from '../components/nowcast/ClutterFilterControls';
import IsohyetAccumulationPanel from '../components/nowcast/IsohyetAccumulationPanel';
import CriticalInfrastructureExposureModal from '../components/nowcast/CriticalInfrastructureExposureModal';
import DopplerAudioAlertSystem from '../components/nowcast/DopplerAudioAlertSystem';
import NowcastSkillScoreModal from '../components/nowcast/NowcastSkillScoreModal';
import LightningCorrelationPanel from '../components/nowcast/LightningCorrelationPanel';
import PrecipitationWaterBudgetModal from '../components/nowcast/PrecipitationWaterBudgetModal';
import RadarLoopExportModal from '../components/nowcast/RadarLoopExportModal';
import StormCellInjectorModal from '../components/nowcast/StormCellInjectorModal';
import MeteorologicalBulletinModal from '../components/nowcast/MeteorologicalBulletinModal';
import RadarTelemetryTerminalModal from '../components/nowcast/RadarTelemetryTerminalModal';
import OperationsHubBar from '../components/nowcast/OperationsHubBar';

import {
  Radio,
  Play,
  Pause,
  FileText,
  Volume2,
  Crosshair,
  Sparkles,
  Send,
} from 'lucide-react';

export default function RainfallNowcast() {
  const { nowcastMinutes } = useFloodCommand();

  // Core Interactive States
  const [selectedCell, setSelectedCell] = useState(RADAR_CELLS[0]);
  const [radarProduct, setRadarProduct] = useState('reflectivity'); // reflectivity | intensity | vectors | zdr | kdp | vil
  const [elevationAngle, setElevationAngle] = useState(0.5); // 0.5°, 1.2°, 2.4°, 4.5°, 9.0°
  const [maxRangeKm, setMaxRangeKm] = useState(100); // 50, 100, 150 km
  const [isSweeping, setIsSweeping] = useState(true);
  const [sweepSpeed, setSweepSpeed] = useState(1); // 0.5, 1, 2, 4
  const [rayCount, setRayCount] = useState(1440);
  const [lastSweepSeconds, setLastSweepSeconds] = useState(14);
  const [customCells, setCustomCells] = useState([]);
  const [probeData, setProbeData] = useState(null);

  // Layer Toggles
  const [showIsohyets, setShowIsohyets] = useState(false);
  const [showAwsStations, setShowAwsStations] = useState(true);
  const [showCriticalInfra, setShowCriticalInfra] = useState(true);
  const [showLightning, setShowLightning] = useState(false);
  const [showRivers, setShowRivers] = useState(true);
  const [showTrecGrid, setShowTrecGrid] = useState(false);

  // Clutter Filters
  const [clutterFilters, setClutterFilters] = useState({
    zeroVelocityNotch: true,
    anomalousPropagation: true,
    terrainMask: true,
    despeckleMedian: true,
    kdpAttenuationCorrection: true,
  });

  const toggleClutterFilter = (key) => {
    setClutterFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 20 Modal & Drawer Open States
  const [modalStates, setModalStates] = useState({
    rhiProfile: false,
    awsValidation: false,
    basinHyetograph: false,
    severeAlert: false,
    trecMotion: false,
    hydrometeor: false,
    ensembleModel: false,
    wardRisk: false,
    clutterFilter: false,
    isohyetPanel: false,
    criticalInfra: false,
    audioAlert: false,
    skillScore: false,
    lightningPanel: false,
    waterBudget: false,
    radarLoop: false,
    stormInjector: false,
    metBulletin: false,
    telemetryTerminal: false,
  });

  const openModal = (name) => setModalStates((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModalStates((prev) => ({ ...prev, [name]: false }));

  // Dynamic factors based on time scrubber
  const intensityFactor = 1 + Math.sin((nowcastMinutes / 180) * Math.PI) * 0.55;

  // Real-time ray counter and sweep refresh ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSweepSeconds((prev) => (prev >= 60 ? 0 : prev + 1));
      setRayCount((prev) => (prev >= 1440 ? 360 : prev + 180));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Compute beam height MSL at 50km: H = r * sin(theta) + r^2 / (2 * 4/3 * Re)
  const beamHeightAt50km = (
    50 * Math.sin((elevationAngle * Math.PI) / 180) +
    (50 * 50) / (2 * 8495)
  ).toFixed(2);

  // Cell strike calculations based on selectedCell
  const currentCellDbz = Math.round(
    (selectedCell?.dbz || 58) * (nowcastMinutes === 0 ? 1 : 0.85 + 0.35 * Math.sin((nowcastMinutes / 120) * Math.PI))
  );
  const currentCellRate = Math.round(58.2 * intensityFactor);

  return (
    <div className="p-4 md:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* 20 Feature Modals & Drawers */}
      <RHIProfileModal
        isOpen={modalStates.rhiProfile}
        onClose={() => closeModal('rhiProfile')}
        initialAzimuth={42}
      />
      <AWSValidationDrawer
        isOpen={modalStates.awsValidation}
        onClose={() => closeModal('awsValidation')}
      />
      <BasinHyetographModal
        isOpen={modalStates.basinHyetograph}
        onClose={() => closeModal('basinHyetograph')}
      />
      <SevereAlertDispatcherModal
        isOpen={modalStates.severeAlert}
        onClose={() => closeModal('severeAlert')}
        selectedCell={selectedCell}
      />
      <TrecMotionEditorModal
        isOpen={modalStates.trecMotion}
        onClose={() => closeModal('trecMotion')}
      />
      <HydrometeorClassifierModal
        isOpen={modalStates.hydrometeor}
        onClose={() => closeModal('hydrometeor')}
      />
      <EnsembleModelComparatorModal
        isOpen={modalStates.ensembleModel}
        onClose={() => closeModal('ensembleModel')}
      />
      <WardRainfallRiskMatrix
        isOpen={modalStates.wardRisk}
        onClose={() => closeModal('wardRisk')}
      />
      <IsohyetAccumulationPanel
        isOpen={modalStates.isohyetPanel}
        onClose={() => closeModal('isohyetPanel')}
        showIsohyets={showIsohyets}
        onToggleIsohyets={() => setShowIsohyets(!showIsohyets)}
      />
      <CriticalInfrastructureExposureModal
        isOpen={modalStates.criticalInfra}
        onClose={() => closeModal('criticalInfra')}
      />
      <DopplerAudioAlertSystem
        isOpen={modalStates.audioAlert}
        onClose={() => closeModal('audioAlert')}
      />
      <NowcastSkillScoreModal
        isOpen={modalStates.skillScore}
        onClose={() => closeModal('skillScore')}
      />
      <LightningCorrelationPanel
        isOpen={modalStates.lightningPanel}
        onClose={() => closeModal('lightningPanel')}
        showLightning={showLightning}
        onToggleLightning={() => setShowLightning(!showLightning)}
      />
      <PrecipitationWaterBudgetModal
        isOpen={modalStates.waterBudget}
        onClose={() => closeModal('waterBudget')}
      />
      <RadarLoopExportModal
        isOpen={modalStates.radarLoop}
        onClose={() => closeModal('radarLoop')}
      />
      <StormCellInjectorModal
        isOpen={modalStates.stormInjector}
        onClose={() => closeModal('stormInjector')}
        customCellCount={customCells.length}
        onInjectCell={(newCell) => {
          setCustomCells((prev) => [newCell, ...prev]);
          setSelectedCell(newCell);
        }}
        onClearCustomCells={() => setCustomCells([])}
      />
      <MeteorologicalBulletinModal
        isOpen={modalStates.metBulletin}
        onClose={() => closeModal('metBulletin')}
        selectedCell={selectedCell}
      />
      <RadarTelemetryTerminalModal
        isOpen={modalStates.telemetryTerminal}
        onClose={() => closeModal('telemetryTerminal')}
      />

      {/* Top Operational Status Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple animate-pulse" />
            <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
              Doppler Weather Radar Nowcasting (0–3 Hours Lead Time)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
              DUAL-POL S-BAND ACTIVE
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            IMD Colaba S-Band Radar (3.0 GHz) • 250m Resolution Convective Cell Tracking • MCGM Urban Flood Command
          </p>
        </div>

        {/* Real-Time Scan Sweep Telemetry */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-surface-secondary px-2.5 py-1 rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
            <span>SWEEP REFRESH: <strong>{lastSweepSeconds}s AGO</strong></span>
          </div>
          <div className="bg-surface-secondary px-2.5 py-1 rounded-lg border border-border text-purple font-semibold">
            {rayCount.toLocaleString()} RAYS / SWEEP
          </div>
          <button
            onClick={() => openModal('audioAlert')}
            className="p-1.5 rounded-lg bg-surface-secondary hover:bg-purple-soft hover:text-purple text-ink-secondary border border-border transition-colors"
            title="Audio Siren Controls"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openModal('metBulletin')}
            className="px-3 py-1 rounded-lg bg-purple text-white hover:bg-purple-deep transition-colors font-semibold flex items-center gap-1.5 shadow-subtle text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Met Bulletin</span>
          </button>
        </div>
      </div>

      {/* Upgraded Operations Hub Selection Bar */}
      <OperationsHubBar onOpenTool={(toolId) => openModal(toolId)} />

      {/* Main Meteorological Three-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Products, Hardware Controls & Convective Queue (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-3">
          {/* Radar Products Card */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Radar Display Products
            </span>

            <div className="space-y-1.5">
              {[
                { id: 'reflectivity', label: 'Reflectivity (dBZ)', sub: 'Precipitation volume core' },
                { id: 'intensity', label: 'Rain Intensity (mm/hr)', sub: 'Instantaneous surface rate' },
                { id: 'vectors', label: 'Motion Vectors (TREC)', sub: 'Cell storm advection velocity' },
                { id: 'zdr', label: 'Differential Reflectivity (ZDR)', sub: 'Drop oblateness & shape' },
                { id: 'kdp', label: 'Specific Phase (KDP)', sub: 'Attenuation-free heavy core' },
                { id: 'vil', label: 'Vertically Integrated Liq (VIL)', sub: 'Atmospheric liquid mass kg/m²' },
              ].map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setRadarProduct(prod.id)}
                  className={`w-full p-2 rounded-lg text-left border transition-all flex flex-col ${
                    radarProduct === prod.id
                      ? 'bg-purple-soft text-purple border-purple/50 font-bold shadow-sm'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  <span className="text-xs">{prod.label}</span>
                  <span className="text-[10px] text-ink-secondary font-normal font-mono">{prod.sub}</span>
                </button>
              ))}
            </div>

            {/* Interactive Hardware Calibration Controls */}
            <div className="border-t border-border pt-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                  Hardware Beam Calibration
                </span>
                <button
                  onClick={() => openModal('telemetryTerminal')}
                  className="text-[10px] font-mono text-purple hover:underline"
                >
                  Raw Bus
                </button>
              </div>

              {/* Elevation Angle Tilt Selector */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-secondary">Elevation Angle (PPI):</span>
                <select
                  value={elevationAngle}
                  onChange={(e) => setElevationAngle(Number(e.target.value))}
                  className="bg-surface-secondary border border-border text-ink font-bold px-2 py-0.5 rounded text-xs outline-none focus:border-purple cursor-pointer"
                >
                  <option value={0.5}>0.5° (Surveillance)</option>
                  <option value={1.2}>1.2° (Low Layer)</option>
                  <option value={2.4}>2.4° (Mid Column)</option>
                  <option value={4.5}>4.5° (Core Slice)</option>
                  <option value={9.0}>9.0° (Overhead Core)</option>
                </select>
              </div>

              {/* Max Range Selector */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-secondary">Max Radar Range:</span>
                <div className="flex gap-1">
                  {[50, 100, 150].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMaxRangeKm(r)}
                      className={`px-2 py-0.5 rounded text-[11px] border ${
                        maxRangeKm === r
                          ? 'bg-purple text-white border-purple font-bold'
                          : 'bg-surface-secondary text-ink border-border hover:border-purple/40'
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Beam Calculations */}
              <div className="space-y-1 text-xs text-ink-secondary font-mono pt-1">
                <div className="flex justify-between">
                  <span>Beam Height @ 50km:</span>
                  <strong className="text-ink">{beamHeightAt50km} km MSL</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dual-Pol ZDR Bias:</span>
                  <strong className="text-status-safe">+1.45 dB (Calibrated)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Doppler Nyquist:</span>
                  <strong className="text-ink">±34.2 m/s (123 km/h)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Identified Storm Cells Queue */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                Tracked Convective Storm Cells ({[...RADAR_CELLS, ...customCells].length})
              </span>
              <button
                onClick={() => openModal('stormInjector')}
                className="text-[10px] font-mono text-purple hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>+ Inject</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {[...RADAR_CELLS, ...customCells].map((cell) => {
                const isSelected = selectedCell && selectedCell.id === cell.id;
                return (
                  <button
                    key={cell.id}
                    onClick={() => setSelectedCell(cell)}
                    className={`w-full p-2 rounded-lg text-left text-xs border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-soft text-purple border-purple font-bold shadow-sm'
                        : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{cell.name}</span>
                        {cell.isSimulated && (
                          <span className="text-[8px] font-mono px-1 rounded bg-amber-100 text-amber-700">
                            DRILL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-ink-secondary">
                        {cell.headingText || cell.velocity}
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                        cell.dbz >= 58
                          ? 'bg-status-alert-soft text-status-alert'
                          : cell.dbz >= 50
                          ? 'bg-status-warning-soft text-status-warning'
                          : 'bg-status-safe-soft text-status-safe'
                      }`}
                    >
                      {cell.dbz} dBZ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clutter Suppression Filter Panel */}
          <ClutterFilterControls
            filters={clutterFilters}
            onToggleFilter={toggleClutterFilter}
          />
        </div>

        {/* Center Column: Polar Doppler Radar Canvas & Controls (6 cols) */}
        <div className="xl:col-span-6 flex flex-col gap-3">
          {/* Main Polar Radar Canvas Component */}
          <NowcastRadarCanvas
            radarProduct={radarProduct}
            selectedCell={selectedCell}
            onSelectCell={(cell) => setSelectedCell(cell)}
            nowcastMinutes={nowcastMinutes}
            maxRangeKm={maxRangeKm}
            elevationAngle={elevationAngle}
            isSweeping={isSweeping}
            sweepSpeed={sweepSpeed}
            clutterFilterEnabled={clutterFilters.zeroVelocityNotch}
            showIsohyets={showIsohyets}
            showAwsStations={showAwsStations}
            showCriticalInfra={showCriticalInfra}
            showLightning={showLightning}
            showRivers={showRivers}
            showTrecGrid={showTrecGrid}
            customCells={customCells}
            onProbePoint={(p) => setProbeData(p)}
          />

          {/* Canvas Sub-layer Toggle Controls Strip */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-ink-secondary uppercase">Layers:</span>
              <button
                onClick={() => setShowIsohyets(!showIsohyets)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showIsohyets ? 'bg-purple-soft text-purple border-purple' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Isohyets
              </button>
              <button
                onClick={() => setShowAwsStations(!showAwsStations)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showAwsStations ? 'bg-status-safe-soft text-status-safe border-status-safe' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                AWS Gauges
              </button>
              <button
                onClick={() => setShowCriticalInfra(!showCriticalInfra)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showCriticalInfra ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Critical Infra
              </button>
              <button
                onClick={() => setShowLightning(!showLightning)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showLightning ? 'bg-yellow-50 text-yellow-700 border-yellow-400' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Lightning
              </button>
              <button
                onClick={() => setShowTrecGrid(!showTrecGrid)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showTrecGrid ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Wind Grid
              </button>
              <button
                onClick={() => setShowRivers(!showRivers)}
                className={`px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
                  showRivers ? 'bg-cyan-50 text-cyan-700 border-cyan-300' : 'bg-surface-secondary text-ink-secondary border-border'
                }`}
              >
                Rivers
              </button>
            </div>

            {/* Sweep Animation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSweeping(!isSweeping)}
                className="p-1.5 rounded-lg bg-surface-secondary hover:bg-purple-soft hover:text-purple border border-border transition-colors flex items-center gap-1"
                title={isSweeping ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
              >
                {isSweeping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold">{isSweeping ? 'PAUSE SWEEP' : 'SWEEP'}</span>
              </button>
              <select
                value={sweepSpeed}
                onChange={(e) => setSweepSpeed(Number(e.target.value))}
                className="bg-surface-secondary border border-border text-ink font-bold px-1.5 py-1 rounded text-[11px] outline-none cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1.0x</option>
                <option value={2}>2.0x</option>
                <option value={4}>4.0x</option>
              </select>
            </div>
          </div>

          {/* Active Probe Floating Telemetry Card if point clicked */}
          {probeData && (
            <RadarCoordinateProbe
              probeData={probeData}
              onClose={() => setProbeData(null)}
            />
          )}

          {/* Integrated Operational Timeline Scrubber (0 to 180 Min) */}
          <TimelineScrubber />
        </div>

        {/* Right Column: Rainfall Telemetry & Selected Cell Analytics (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-3">
          {/* Selected Convective Cell Deep Diagnostics */}
          {selectedCell && (
            <div className="bg-surface border border-purple/30 rounded-xl p-4 shadow-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-[11px] font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-purple" />
                  Target Cell: {selectedCell.id}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    currentCellDbz >= 58 ? 'bg-status-alert-soft text-status-alert' : 'bg-status-warning-soft text-status-warning'
                  }`}
                >
                  {currentCellDbz >= 58 ? 'EXTREME CONVECTIVE' : 'INTENSE STRATIFORM'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="bg-surface-secondary p-2.5 rounded-lg border border-border">
                  <div className="text-[10px] text-ink-secondary uppercase">Current Core Intensity</div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-status-alert">{currentCellRate}</span>
                    <span className="text-xs text-ink-secondary">mm/hr</span>
                    <span className="text-xs text-purple font-bold ml-2">({currentCellDbz} dBZ)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-ink-secondary">
                  <div className="bg-surface-secondary p-2 rounded-lg border border-border">
                    <div className="text-[9px] uppercase">Echo Top Height</div>
                    <div className="font-bold text-ink mt-0.5">{selectedCell.topKm || 13.8} km MSL</div>
                  </div>
                  <div className="bg-surface-secondary p-2 rounded-lg border border-border">
                    <div className="text-[9px] uppercase">VIL Liquid Mass</div>
                    <div className="font-bold text-purple mt-0.5">{selectedCell.vil || 48} kg/m²</div>
                  </div>
                  <div className="bg-surface-secondary p-2 rounded-lg border border-border">
                    <div className="text-[9px] uppercase">Trajectory Bearing</div>
                    <div className="font-bold text-ink mt-0.5">{selectedCell.headingText || 'NE @ 18.2 km/h'}</div>
                  </div>
                  <div className="bg-surface-secondary p-2 rounded-lg border border-border">
                    <div className="text-[9px] uppercase">Dual-Pol ZDR</div>
                    <div className="font-bold text-status-safe mt-0.5">+{selectedCell.zdr || 2.8} dB</div>
                  </div>
                </div>

                <div className="bg-surface-secondary p-2.5 rounded-lg border border-border">
                  <div className="text-[10px] text-ink-secondary uppercase">Direct Vulnerability Corridor</div>
                  <div className="font-bold text-ink mt-0.5">Kurla West, Sion Circle, LBS Marg Corridor</div>
                  <div className="text-[10px] text-status-alert font-bold mt-1">
                    ETA to Kurla Lowland: +18 min (18:48 IST)
                  </div>
                </div>

                <button
                  onClick={() => openModal('severeAlert')}
                  className="w-full py-2 rounded-lg bg-status-alert text-white font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Alert For Cell {selectedCell.id}
                </button>
              </div>
            </div>
          )}

          {/* Rainfall Intelligence & Model Verification */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
              Metropolitan Nowcast Telemetry
            </span>

            <div className="space-y-3">
              <div className="bg-surface-secondary border border-border rounded-lg p-3">
                <div className="text-[10px] font-medium text-ink-secondary uppercase">Domain Peak Forecast</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-status-alert">91.4</span>
                  <span className="text-xs font-mono text-ink-secondary">mm/hr</span>
                </div>
                <div className="text-[10px] font-mono text-ink-secondary mt-1">
                  Expected Peak: 19:25 IST (+55m)
                </div>
              </div>

              <div className="bg-surface-secondary border border-border rounded-lg p-3">
                <div className="text-[10px] font-medium text-ink-secondary uppercase">Hydrological Inflow Flux</div>
                <div className="mt-1 font-mono text-base font-bold text-purple">
                  425 kt/min (Rainfall Mass)
                </div>
                <div className="text-[10px] font-mono text-status-alert font-semibold mt-1">
                  Pumping Deficit: -220 m³/s into tidal sumps
                </div>
              </div>
            </div>

            {/* Model Verification Stats */}
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary">
                  ML Model Verification
                </span>
                <button
                  onClick={() => openModal('skillScore')}
                  className="text-[10px] font-mono text-purple hover:underline"
                >
                  Skill Metrics
                </button>
              </div>

              <div className="space-y-1 text-xs font-mono text-ink-secondary">
                <div className="flex justify-between">
                  <span>Model Engine:</span>
                  <strong className="text-ink">ConvLSTM v2.4-Prod</strong>
                </div>
                <div className="flex justify-between">
                  <span>Forecast Confidence:</span>
                  <strong className="text-purple font-bold">92.4%</strong>
                </div>
                <div className="flex justify-between">
                  <span>CSI @ 30mm/hr:</span>
                  <strong className="text-status-safe font-bold">0.874 (High)</strong>
                </div>
                <div className="flex justify-between">
                  <span>AWS Correlation:</span>
                  <strong className="text-status-safe font-bold">97.3% Match</strong>
                </div>
                <div className="flex justify-between">
                  <span>Farnebäck Residual:</span>
                  <strong className="text-ink">&lt; 1.8 mm/h MAE</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
