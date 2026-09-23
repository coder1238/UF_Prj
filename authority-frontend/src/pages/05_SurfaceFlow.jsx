import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFloodCommand } from '../context/FloodCommandContext';
import InteractiveMapTwin from '../components/gis/InteractiveMapTwin';
import TimelineScrubber from '../components/layout/TimelineScrubber';
import {
  Waves,
  Mountain,
  Gauge,
  TrendingUp,
  Sliders,
  Send,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Layers,
  Shield,
  Activity,
  Compass,
  Crosshair,
  Droplets,
  Download,
  Copy,
  FileText,
  Volume2,
  VolumeX,
  Radio,
  Truck,
  Zap,
  Wind,
  Filter,
  MapPin,
  Search,
  ChevronDown,
} from 'lucide-react';

// ==========================================
// 6 Real High-Risk Municipal Micro-Basins
// ==========================================
const MUNICIPAL_BASINS = [
  {
    id: 'cell-4821',
    name: 'Sion West Trough (LBS-CST Ingress)',
    ward: 'Ward F/North',
    coords: [72.8624, 19.0392],
    elevation: 8.7, // m MSL
    baseRainfall: 71.4, // mm/h
    baseRunoffCoeff: 0.88,
    baseVelocity: 0.84, // m/s
    baseDepth: 18.5, // cm
    accumulation: 'HIGH',
    inlets: 82,
    overflow: 18,
    catchmentAreaKm2: 1.42,
    longestFlowPathM: 1240,
    pourPoint: 'Mahim Creek / Dharavi Channel',
    slopePct: 1.8,
    aspect: '245° (WSW)',
    d8Direction: 'West',
    curbHeightCm: 20,
    curbCrossSlope: 2.5, // %
    curbLongSlope: 1.2, // %
  },
  {
    id: 'cell-3104',
    name: 'Andheri East Valley & Subway Ingress',
    ward: 'Ward K/East',
    coords: [72.8468, 19.1197],
    elevation: 5.4,
    baseRainfall: 78.0,
    baseRunoffCoeff: 0.92,
    baseVelocity: 1.12,
    baseDepth: 26.0,
    accumulation: 'CRITICAL',
    inlets: 74,
    overflow: 26,
    catchmentAreaKm2: 0.98,
    longestFlowPathM: 980,
    pourPoint: 'Mogra Nullah Basin',
    slopePct: 3.4,
    aspect: '190° (S)',
    d8Direction: 'South',
    curbHeightCm: 22,
    curbCrossSlope: 3.0,
    curbLongSlope: 2.1,
  },
  {
    id: 'cell-6291',
    name: 'Kurla LBS Depressed Watershed',
    ward: 'Ward L',
    coords: [72.8791, 19.0684],
    elevation: 6.2,
    baseRainfall: 68.5,
    baseRunoffCoeff: 0.86,
    baseVelocity: 0.65,
    baseDepth: 15.2,
    accumulation: 'HIGH',
    inlets: 80,
    overflow: 20,
    catchmentAreaKm2: 2.15,
    longestFlowPathM: 1850,
    pourPoint: 'Mithi River Outfall #4',
    slopePct: 1.2,
    aspect: '160° (SSE)',
    d8Direction: 'South-East',
    curbHeightCm: 18,
    curbCrossSlope: 2.0,
    curbLongSlope: 0.9,
  },
  {
    id: 'cell-1904',
    name: 'Hindmata Flyover Depression Bowl',
    ward: 'Ward F/South',
    coords: [72.8423, 19.0089],
    elevation: 4.8,
    baseRainfall: 82.5,
    baseRunoffCoeff: 0.94,
    baseVelocity: 0.95,
    baseDepth: 29.5,
    accumulation: 'CRITICAL',
    inlets: 68,
    overflow: 32,
    catchmentAreaKm2: 1.12,
    longestFlowPathM: 1100,
    pourPoint: 'Britannia Outfall Pumping Station',
    slopePct: 2.8,
    aspect: '210° (SSW)',
    d8Direction: 'South-West',
    curbHeightCm: 20,
    curbCrossSlope: 2.8,
    curbLongSlope: 1.5,
  },
  {
    id: 'cell-5520',
    name: 'Dadar TT Circle Lowland Funnel',
    ward: 'Ward G/North',
    coords: [72.8492, 19.0185],
    elevation: 6.9,
    baseRainfall: 64.0,
    baseRunoffCoeff: 0.85,
    baseVelocity: 0.72,
    baseDepth: 14.0,
    accumulation: 'MODERATE',
    inlets: 85,
    overflow: 15,
    catchmentAreaKm2: 1.64,
    longestFlowPathM: 1450,
    pourPoint: 'Pramod Mahajan Holding Basin',
    slopePct: 1.5,
    aspect: '270° (W)',
    d8Direction: 'West',
    curbHeightCm: 20,
    curbCrossSlope: 2.0,
    curbLongSlope: 1.0,
  },
  {
    id: 'cell-7812',
    name: 'Milan Subway Ingress & Low Choke',
    ward: 'Ward H/East',
    coords: [72.8398, 19.0882],
    elevation: 3.9,
    baseRainfall: 85.0,
    baseRunoffCoeff: 0.95,
    baseVelocity: 1.35,
    baseDepth: 34.0,
    accumulation: 'CRITICAL',
    inlets: 62,
    overflow: 38,
    catchmentAreaKm2: 0.85,
    longestFlowPathM: 820,
    pourPoint: 'Irla Nullah Trunk Drain',
    slopePct: 4.1,
    aspect: '180° (S)',
    d8Direction: 'South',
    curbHeightCm: 25,
    curbCrossSlope: 3.5,
    curbLongSlope: 2.8,
  },
];

// Manning's Surface Materials
const MANNING_MATERIALS = [
  { id: 'asphalt', name: 'Smooth Asphalt Highway', n: 0.013, desc: 'Paved multilane arterial corridor' },
  { id: 'concrete', name: 'Concrete Pavers / Footpaths', n: 0.015, desc: 'Interlocking concrete pedestrian pavement' },
  { id: 'compacted_soil', name: 'Compacted Soil / Gravel', n: 0.025, desc: 'Unpaved road shoulders and construction zones' },
  { id: 'slum_alley', name: 'Dense Urban Footpaths & Alleys', n: 0.035, desc: 'High hydraulic resistance with building obstructions' },
  { id: 'vegetated', name: 'Vegetated Swale / Median Grassy Verge', n: 0.040, desc: 'Short natural grass with moderate retention' },
  { id: 'debris_choked', name: 'Debris & Silt Choked Urban Corridor', n: 0.065, desc: 'High resistance with floating urban solid waste' },
  { id: 'custom', name: 'Custom Resistance Coefficient', n: 0.020, desc: 'User calibrated urban hydraulic friction parameter' },
];

// Return Periods
const RETURN_PERIODS = [
  { label: '2-Year (Monsoon Normal)', value: 35, coeff: 1.0 },
  { label: '5-Year (Heavy Rainstorm)', value: 55, coeff: 1.18 },
  { label: '10-Year (Torrential Downpour)', value: 75, coeff: 1.35 },
  { label: '25-Year (Severe Waterlogging)', value: 95, coeff: 1.55 },
  { label: '50-Year (Extreme Cloudburst)', value: 120, coeff: 1.82 },
  { label: '100-Year (July 26 Deluge Repeat)', value: 155, coeff: 2.2 },
];

export default function SurfaceFlow() {
  const {
    nowcastMinutes,
    placedBarriers,
    addBarrier,
    removeBarrier,
    setMapFocusTarget,
    addCommandLog,
    mobilePumpsList,
    dispatchMobilePump,
    publishAlert,
    toggleSiren,
    isSirenActive,
  } = useFloodCommand();

  // Navigation Tabs for Console
  const [activeTab, setActiveTab] = useState('map-live'); // 'map-live' | 'physics' | 'structures' | 'hydrographs' | 'tactical'
  const [selectedCellId, setSelectedCellId] = useState('cell-4821');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Current active basin
  const currentCell = useMemo(
    () => MUNICIPAL_BASINS.find((c) => c.id === selectedCellId) || MUNICIPAL_BASINS[0],
    [selectedCellId]
  );

  // When selected basin changes, auto-center map and update local structure attributes
  const handleSelectCell = (cell) => {
    setSelectedCellId(cell.id);
    setCurbHeightCm(cell.curbHeightCm);
    setCrossSlopePct(cell.curbCrossSlope);
    setLongSlopePct(cell.curbLongSlope);
    setMapFocusTarget({
      coords: cell.coords,
      zoom: 15.2,
      title: cell.name,
      subtitle: `${cell.ward} • Elevation: ${cell.elevation}m MSL • Hydrodynamic Risk: ${cell.accumulation}`,
    });
    showToast(`Focused camera on ${cell.name} (${cell.ward})`);
  };

  // -------------------------------------------------------------
  // FEATURE 1: 2D SWE Numerical Solver Playground State
  // -------------------------------------------------------------
  const [sweTimeStep, setSweTimeStep] = useState(0.5); // seconds
  const [sweScheme, setSweScheme] = useState('Kurganov-Petrova (Central-Upwind)');
  const [sweTurbulence, setSweTurbulence] = useState('Smagorinsky (SGS)');
  const [sweCFLTarget, setSweCFLTarget] = useState(0.85);

  // -------------------------------------------------------------
  // FEATURE 2: Manning's Roughness (n) Editor
  // -------------------------------------------------------------
  const [selectedManningId, setSelectedManningId] = useState('asphalt');
  const [customManningN, setCustomManningN] = useState(0.022);
  const activeManning = useMemo(
    () => MANNING_MATERIALS.find((m) => m.id === selectedManningId) || MANNING_MATERIALS[0],
    [selectedManningId]
  );
  const effectiveN = selectedManningId === 'custom' ? customManningN : activeManning.n;

  // -------------------------------------------------------------
  // FEATURE 3: Soil Infiltration Model (Horton / Green-Ampt / SCS-CN)
  // -------------------------------------------------------------
  const [infiltrationModel, setInfiltrationModel] = useState('Horton'); // 'Horton' | 'Green-Ampt' | 'SCS-CN'
  const [hortonF0, setHortonF0] = useState(50); // Initial capacity mm/h
  const [hortonFc, setHortonFc] = useState(8); // Steady state mm/h
  const [hortonK, setHortonK] = useState(2.0); // Decay factor hr^-1
  const [curveNumberCN, setCurveNumberCN] = useState(88); // SCS CN (Urban paved/dense)

  // -------------------------------------------------------------
  // FEATURE 5: Flow Vector & Particle Density Controls
  // -------------------------------------------------------------
  const [vectorDensity, setVectorDensity] = useState('Standard'); // 'Low' | 'Standard' | 'Dense' | 'Ultra'
  const [particleSpeed, setParticleSpeed] = useState('Normal'); // 'Slow' | 'Normal' | 'Fast' | 'Frozen'
  const [vectorColorMode, setVectorColorMode] = useState('Velocity'); // 'Velocity' | 'Depth' | 'Shear' | 'Froude'
  const canvasRef = useRef(null);

  // -------------------------------------------------------------
  // FEATURE 7: Curb Overtopping & Street Gutter Parameters
  // -------------------------------------------------------------
  const [curbHeightCm, setCurbHeightCm] = useState(currentCell.curbHeightCm);
  const [crossSlopePct, setCrossSlopePct] = useState(currentCell.curbCrossSlope);
  const [longSlopePct, setLongSlopePct] = useState(currentCell.curbLongSlope);

  // -------------------------------------------------------------
  // FEATURE 10: Storm Drain Inlet Clogging Stress-Tester
  // -------------------------------------------------------------
  const [inletBlockagePct, setInletBlockagePct] = useState(22); // % blocked by trash
  const [activeSweeperSquad, setActiveSweeperSquad] = useState(false);

  // -------------------------------------------------------------
  // FEATURE 11: Mobile Dewatering Pump Deployment
  // -------------------------------------------------------------
  const [selectedPumpId, setSelectedPumpId] = useState(mobilePumpsList[0]?.id || 'PUMP-SQUAD-01');

  // -------------------------------------------------------------
  // FEATURE 12: Hydraulic Structure Simulator (Culverts & Weirs)
  // -------------------------------------------------------------
  const [structureType, setStructureType] = useState('Box Culvert'); // 'Box Culvert' | 'Circular Pipe' | 'Broad Weir'
  const [structureSpanM, setStructureSpanM] = useState(2.4);
  const [structureRiseM, setStructureRiseM] = useState(1.8);
  const [tailwaterDepthM, setTailwaterDepthM] = useState(0.6);

  // -------------------------------------------------------------
  // FEATURE 14: Geo-Probe Hotspot / Coordinate Probe
  // -------------------------------------------------------------
  const [probeLat, setProbeLat] = useState(currentCell.coords[1]);
  const [probeLng, setProbeLng] = useState(currentCell.coords[0]);
  const [probeResult, setProbeResult] = useState(null);

  // -------------------------------------------------------------
  // FEATURE 15: Storm Intensity / IDF Cloudburst Generator
  // -------------------------------------------------------------
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState(RETURN_PERIODS[2].label); // 10-Yr
  const [customRainfallRate, setCustomRainfallRate] = useState(currentCell.baseRainfall);

  // -------------------------------------------------------------
  // FEATURE 16: Sandbag & Deflector Wall Architect
  // -------------------------------------------------------------
  const [barrierType, setBarrierType] = useState('Heavy Sandbag Dike');
  const [barrierHeightCm, setBarrierHeightCm] = useState(65);
  const [barrierLengthM, setBarrierLengthM] = useState(30);
  const [barrierAngleDeg, setBarrierAngleDeg] = useState(45);

  // -------------------------------------------------------------
  // Dynamic Hydrodynamic Computations
  // -------------------------------------------------------------
  const activeStormMultiplier = useMemo(() => {
    const rp = RETURN_PERIODS.find((r) => r.label === selectedReturnPeriod);
    return rp ? rp.coeff : 1.0;
  }, [selectedReturnPeriod]);

  // Check if barriers exist at this cell
  const cellBarriers = useMemo(() => {
    return placedBarriers.filter((b) => b.cellId === currentCell.id || b.name.includes(currentCell.name.split(' ')[0]));
  }, [placedBarriers, currentCell]);

  const barrierMitigationDeltaCm = useMemo(() => {
    return cellBarriers.reduce((sum, b) => sum + (b.mitigationDeltaCm || 14), 0);
  }, [cellBarriers]);

  // Dynamic rainfall rate
  const dynamicRainfall = useMemo(() => {
    return Math.round(customRainfallRate * activeStormMultiplier * 10) / 10;
  }, [customRainfallRate, activeStormMultiplier]);

  // Dynamic infiltration loss rate (mm/h)
  const dynamicInfiltrationRate = useMemo(() => {
    if (infiltrationModel === 'Horton') {
      const tHr = Math.max(0.1, (nowcastMinutes + 15) / 60);
      const rate = hortonFc + (hortonF0 - hortonFc) * Math.exp(-hortonK * tHr);
      return Math.round(Math.min(dynamicRainfall, rate) * 10) / 10;
    } else if (infiltrationModel === 'Green-Ampt') {
      const rate = hortonFc * (1 + 45 / (Math.max(10, nowcastMinutes + 20)));
      return Math.round(Math.min(dynamicRainfall, rate) * 10) / 10;
    } else {
      // SCS-CN
      const S = (25400 / curveNumberCN) - 254; // potential retention mm
      const Ia = 0.2 * S;
      const rate = dynamicRainfall > Ia ? (dynamicRainfall - Ia) * 0.18 : dynamicRainfall;
      return Math.round(Math.min(dynamicRainfall, Math.max(4, rate)) * 10) / 10;
    }
  }, [infiltrationModel, hortonF0, hortonFc, hortonK, curveNumberCN, dynamicRainfall, nowcastMinutes]);

  // Dynamic Runoff Rate (mm/h)
  const dynamicRunoff = useMemo(() => {
    return Math.max(0, Math.round((dynamicRainfall - dynamicInfiltrationRate) * currentCell.baseRunoffCoeff * 10) / 10);
  }, [dynamicRainfall, dynamicInfiltrationRate, currentCell]);

  // Timeline growth multiplier (0 to 180 min)
  const timelineMultiplier = useMemo(() => {
    return nowcastMinutes === 0 ? 1 : 1 + (nowcastMinutes / 60) * 0.65;
  }, [nowcastMinutes]);

  // Base depth before barrier & pumps
  const rawDepth = useMemo(() => {
    const depthFromRain = currentCell.baseDepth * (dynamicRainfall / currentCell.baseRainfall) * timelineMultiplier;
    return Math.max(2, Math.round(depthFromRain * 10) / 10);
  }, [currentCell, dynamicRainfall, timelineMultiplier]);

  // Active pump drawdown impact
  const activePumpOnCell = useMemo(() => {
    return mobilePumpsList.find((p) => p.location.includes(currentCell.name.split(' ')[0]) && p.status.includes('ACTIVE'));
  }, [mobilePumpsList, currentCell]);

  const pumpMitigationDeltaCm = activePumpOnCell ? 9.5 : 0;

  // Final Net Depth (cm)
  const dynamicDepth = useMemo(() => {
    const net = rawDepth - barrierMitigationDeltaCm - pumpMitigationDeltaCm;
    return Math.max(1.5, Math.round(net * 10) / 10);
  }, [rawDepth, barrierMitigationDeltaCm, pumpMitigationDeltaCm]);

  // Hydraulic Radius R (m) & Surface Flow Velocity (Manning equation)
  // v = (1/n) * R^(2/3) * S^(1/2)
  const dynamicVelocity = useMemo(() => {
    const depthM = dynamicDepth / 100;
    const hydraulicRadius = depthM; // for wide overland sheet flow R ≈ y
    const slopeFraction = currentCell.slopePct / 100;
    const v = (1 / effectiveN) * Math.pow(hydraulicRadius, 2 / 3) * Math.pow(slopeFraction, 1 / 2);
    return Math.round(Math.min(3.8, Math.max(0.15, v)) * 100) / 100;
  }, [dynamicDepth, effectiveN, currentCell]);

  // Froude Number: Fr = v / sqrt(g * y)
  const froudeNumber = useMemo(() => {
    const g = 9.81;
    const depthM = Math.max(0.02, dynamicDepth / 100);
    const fr = dynamicVelocity / Math.sqrt(g * depthM);
    return Math.round(fr * 100) / 100;
  }, [dynamicVelocity, dynamicDepth]);

  // Time of concentration: Tc (minutes) = 0.0078 * L^0.77 * S^-0.385 (Kirpich formula)
  const timeOfConcentrationMin = useMemo(() => {
    const L = currentCell.longestFlowPathM;
    const S = currentCell.slopePct / 100;
    const tc = 0.0078 * Math.pow(L, 0.77) * Math.pow(S, -0.385);
    return Math.round(tc * 10) / 10;
  }, [currentCell]);

  // Gutter Spread Width T (m)
  // Spread width based on Manning gutter equation
  const gutterSpreadWidthM = useMemo(() => {
    const depthM = dynamicDepth / 100;
    const Sx = crossSlopePct / 100;
    // Spread T = y / Sx
    const spread = depthM / Math.max(0.01, Sx);
    return Math.round(Math.min(18.0, spread) * 10) / 10;
  }, [dynamicDepth, crossSlopePct]);

  const isCurbOvertopped = useMemo(() => {
    return dynamicDepth >= curbHeightCm;
  }, [dynamicDepth, curbHeightCm]);

  // Inlets Capture % vs Overland Overflow %
  const effectiveInletCapture = useMemo(() => {
    let cap = currentCell.inlets;
    // Reduce if blocked
    cap = cap * (1 - (inletBlockagePct / 100) * 0.75);
    // Increase if sweeper active
    if (activeSweeperSquad) cap = Math.min(97, cap + 24);
    // Reduce if high rainfall exceeds gutter capacity
    if (dynamicRainfall > 80) cap = cap * 0.88;
    return Math.round(Math.max(15, Math.min(98, cap)));
  }, [currentCell, inletBlockagePct, activeSweeperSquad, dynamicRainfall]);

  const effectiveOverlandOverflow = useMemo(() => {
    return 100 - effectiveInletCapture;
  }, [effectiveInletCapture]);

  // Bed Shear Stress: tau = rho * g * R * S (N/m^2)
  const shearStressPa = useMemo(() => {
    const rho = 1000;
    const g = 9.81;
    const R = dynamicDepth / 100;
    const S = currentCell.slopePct / 100;
    return Math.round(rho * g * R * S * 10) / 10;
  }, [dynamicDepth, currentCell]);

  // Human / Vehicle Safety product: D (m) x V (m/s)
  const hazardProductDV = useMemo(() => {
    const depthM = dynamicDepth / 100;
    return Math.round(depthM * dynamicVelocity * 100) / 100;
  }, [dynamicDepth, dynamicVelocity]);

  const safetyClassification = useMemo(() => {
    if (hazardProductDV < 0.4) {
      return { level: 'LOW HAZARD', color: 'text-status-safe bg-status-safe-soft border-status-safe/30', note: 'Safe for all pedestrians and vehicles.' };
    } else if (hazardProductDV < 0.6) {
      return { level: 'MODERATE HAZARD', color: 'text-status-warning bg-status-warning-soft border-status-warning/30', note: 'Hazardous for children, elderly, and small two-wheelers.' };
    } else if (hazardProductDV < 1.0) {
      return { level: 'HIGH HAZARD', color: 'text-status-alert bg-status-alert-soft border-status-alert/30', note: 'Pedestrians unstable; small cars and sedans will stall/float.' };
    } else {
      return { level: 'EXTREME LIFE-SAFETY RISK', color: 'text-white bg-status-alert border-status-alert', note: 'Structural sweep hazard; heavy SUVs and buses washed away.' };
    }
  }, [hazardProductDV]);

  // Peak discharge Q = C * I * A / 360 (m^3/s)
  const peakDischargeM3s = useMemo(() => {
    const C = currentCell.baseRunoffCoeff;
    const I = dynamicRainfall; // mm/h
    const A = currentCell.catchmentAreaKm2 * 100; // hectares (1 km2 = 100 ha)
    const Q = (C * I * A) / 360;
    return Math.round(Q * 10) / 10;
  }, [currentCell, dynamicRainfall]);

  // SWE CFL Number: Cr = v * dt / dx
  const computedCourantNumber = useMemo(() => {
    const dx = 5.0; // 5m grid
    const c = dynamicVelocity + Math.sqrt(9.81 * Math.max(0.05, dynamicDepth / 100)); // wave celerity
    const cr = (c * sweTimeStep) / dx;
    return Math.round(cr * 100) / 100;
  }, [dynamicVelocity, dynamicDepth, sweTimeStep]);

  // -------------------------------------------------------------
  // FEATURE 5: Streamline & Particle Canvas Visualizer
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = 140);

    const count = vectorDensity === 'Low' ? 30 : vectorDensity === 'Standard' ? 65 : vectorDensity === 'Dense' ? 120 : 180;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: (Math.random() * 0.8 + 0.4) * (particleSpeed === 'Slow' ? 0.5 : particleSpeed === 'Fast' ? 2.0 : particleSpeed === 'Frozen' ? 0 : 1.0),
      size: Math.random() * 2 + 1.2,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(247, 247, 251, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Color mapping
      let strokeColor = '#6D4AFF';
      if (vectorColorMode === 'Depth') {
        strokeColor = dynamicDepth > 25 ? '#D94A4A' : dynamicDepth > 15 ? '#C58A25' : '#3B8F67';
      } else if (vectorColorMode === 'Shear') {
        strokeColor = shearStressPa > 8 ? '#D94A4A' : '#6D4AFF';
      } else if (vectorColorMode === 'Froude') {
        strokeColor = froudeNumber >= 1.0 ? '#D94A4A' : '#4930A8';
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Vector tail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speed * 8 * dynamicVelocity, p.y + p.speed * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = p.size * 0.75;
        ctx.stroke();

        // Move downstream
        if (particleSpeed !== 'Frozen') {
          p.x += p.speed * 2.5 * dynamicVelocity;
          p.y += p.speed * 0.6;
          if (p.x > width) p.x = 0;
          if (p.y > height) p.y = 0;
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [vectorDensity, particleSpeed, vectorColorMode, dynamicVelocity, dynamicDepth, shearStressPa, froudeNumber]);

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------

  // Add barrier with custom architect
  const handleDeployBarrier = () => {
    const newId = `bar-${Date.now().toString().slice(-4)}`;
    const mitigation = Math.round((barrierHeightCm * 0.35 + (barrierAngleDeg / 90) * 8) * 10) / 10;
    const newBarrier = {
      id: newId,
      cellId: currentCell.id,
      name: `${barrierType} (${barrierLengthM}m @ ${currentCell.name.split(' ')[0]})`,
      coordinates: currentCell.coords,
      heightCm: barrierHeightCm,
      mitigationDeltaCm: mitigation,
      deployedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      type: `${barrierType} (${barrierLengthM}m, angle: ${barrierAngleDeg}°)`,
    };

    addBarrier(newBarrier);
    addCommandLog({
      officer: 'Hydraulic Operations Desk',
      type: 'DEFLECTOR_BARRIER_DEPLOYED',
      details: `Installed ${barrierType} along ${currentCell.name}. Estimated overland depth reduction: -${mitigation} cm.`,
      status: 'EXECUTED',
    });
    showToast(`Barrier deployed: ${newBarrier.name} (-${mitigation}cm depth mitigation)`);
  };

  // Assign Street Sweeper Clearance
  const handleAssignSweeper = () => {
    setActiveSweeperSquad(true);
    addCommandLog({
      officer: 'Ward Maintenance Supt.',
      type: 'GRATE_CLEARANCE_DISPATCH',
      details: `Dispatched Municipal Sweeper Squad #12 to clear inlet grates across ${currentCell.name}. Inlet capture boosted to 96%.`,
      status: 'DISPATCHED',
    });
    showToast(`Gutter Grate Clearance Squad dispatched to ${currentCell.name}! Inlet capture restored.`);
    setTimeout(() => {
      setActiveSweeperSquad(false);
    }, 45000); // 45s active squad mode
  };

  // Deploy Mobile Dewatering Pump
  const handleDeployPump = () => {
    dispatchMobilePump(selectedPumpId, currentCell.name, currentCell.ward);
    addCommandLog({
      officer: 'Pump Dispatch Controller',
      type: 'MOBILE_PUMP_DEPLOYED',
      details: `Dispatched ${selectedPumpId} to ${currentCell.name}. Dewatering capacity: 1,800 m³/hr.`,
      status: 'PUMPING',
    });
    showToast(`Pump Squad ${selectedPumpId} deployed to ${currentCell.name}!`);
  };

  // Dispatch Authority Emergency Broadcast
  const handleDispatchAlert = () => {
    const alertId = `AL-SF-${Date.now().toString().slice(-4)}`;
    const newAlert = {
      id: alertId,
      title: `OVERLAND SHEET INUNDATION: ${currentCell.name.toUpperCase()}`,
      wards: [currentCell.ward],
      status: 'PUBLISHED - ACTIVE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      audienceReach: '120,000 citizens in catchment',
      depthRange: `${Math.round(dynamicDepth)} cm (Velocity: ${dynamicVelocity} m/s)`,
      channels: ['Cell Broadcast', 'VMS Display Screens', 'Citizen Emergency App', 'Ward War Room'],
    };
    publishAlert(newAlert);
    addCommandLog({
      officer: 'Municipal Disaster Controller',
      type: 'EMERGENCY_BROADCAST',
      details: `Issued public flood advisory ${alertId} for ${currentCell.name}. Depth: ${Math.round(dynamicDepth)}cm.`,
      status: 'BROADCASTED',
    });
    showToast(`Emergency alert ${alertId} published to all municipal channels!`);
  };

  // Probe coordinate DEM
  const handleRunProbe = () => {
    const lat = parseFloat(probeLat);
    const lng = parseFloat(probeLng);
    const elev = Math.round((7.5 + Math.sin(lat * 100) * 3.2 + Math.cos(lng * 100) * 2.1) * 10) / 10;
    const slope = Math.round((1.4 + Math.abs(Math.sin(lat + lng)) * 3.5) * 10) / 10;
    const aspectDeg = Math.round((lat * 1000 + lng * 1000) % 360);
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const d8 = directions[Math.floor(aspectDeg / 45) % 8];

    setProbeResult({
      lat,
      lng,
      elevation: elev,
      slope,
      aspect: `${aspectDeg}°`,
      d8,
      soilType: 'Urban Fill & Alluvium',
      manningN: 0.02,
    });
    showToast(`Geo-probe completed at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
  };

  // Exporters
  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: MUNICIPAL_BASINS.map((basin) => ({
        type: 'Feature',
        properties: {
          id: basin.id,
          name: basin.name,
          ward: basin.ward,
          elevationMSL: basin.elevation,
          waterDepthCm: dynamicDepth,
          velocityMs: dynamicVelocity,
          rainfallMmH: dynamicRainfall,
          froudeNumber,
          hazardLevel: safetyClassification.level,
        },
        geometry: {
          type: 'Point',
          coordinates: basin.coords,
        },
      })),
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mumbai_surface_flow_${Date.now()}.geojson`;
    a.click();
    showToast('Exported Surface Flow GeoJSON layer!');
  };

  const handleExportCSV = () => {
    let csv = 'Timestamp_Min,Inflow_m3s,Outflow_m3s,Depth_cm,Velocity_ms,Rainfall_mmh\n';
    for (let t = 0; t <= 180; t += 15) {
      const qIn = Math.round(peakDischargeM3s * Math.sin(Math.PI * (t / 180)) * 10) / 10;
      const qOut = Math.round(qIn * (effectiveInletCapture / 100) * 10) / 10;
      const d = Math.round(currentCell.baseDepth * (1 + (t / 60) * 0.5) * 10) / 10;
      csv += `${t},${Math.max(0, qIn)},${Math.max(0, qOut)},${d},${dynamicVelocity},${dynamicRainfall}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydrograph_discharge_${currentCell.id}.csv`;
    a.click();
    showToast('Exported Hydrograph CSV dataset!');
  };

  const handleCopyParameters = () => {
    const state = {
      basin: currentCell.name,
      ward: currentCell.ward,
      demElevation: currentCell.elevation,
      waterDepthCm: dynamicDepth,
      sheetVelocityMs: dynamicVelocity,
      froudeNumber,
      manningN: effectiveN,
      rainfallMmH: dynamicRainfall,
      inletCapturePct: effectiveInletCapture,
      overlandBypassPct: effectiveOverlandOverflow,
      hazardLevel: safetyClassification.level,
      courantNumber: computedCourantNumber,
      nowcastHorizon: `${nowcastMinutes} min`,
    };
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    showToast('Hydrodynamic state copied to clipboard!');
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)] bg-canvas">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Operational Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3.5 bg-surface border border-border rounded-xl p-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-soft flex items-center justify-center text-purple">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-purple px-2 py-0.5 rounded bg-purple-soft">
                MODULE 05
              </span>
              <h1 className="text-base sm:text-lg font-bold text-ink tracking-tight">
                2D Overland Surface Hydrodynamics &amp; Flow Vector Routing
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple text-white font-medium">
                SWE • 5m LiDAR DEM
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              Coupled 2D Shallow Water Equations with Manning-Strickler surface friction, Green-Ampt infiltration &amp; gutter interception dynamics.
            </p>
          </div>
        </div>

        {/* Global Telemetry Chips & Siren Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink">
            <Activity className="w-3.5 h-3.5 text-purple" />
            <span className="text-ink-secondary">GRID:</span>
            <span className="font-bold">5m × 5m LiDAR</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-soft text-purple border border-purple/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>n = {effectiveN.toFixed(3)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-alert-soft text-status-alert border border-status-alert/20 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Qpeak: {peakDischargeM3s} m³/s</span>
          </div>

          <button
            onClick={toggleSiren}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSirenActive
                ? 'bg-status-alert text-white animate-pulse'
                : 'bg-surface hover:bg-surface-secondary text-ink border border-border'
            }`}
            title="Operational Acoustic Alert Siren"
          >
            {isSirenActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-ink-secondary" />}
            <span>{isSirenActive ? 'SIREN ACTIVE' : 'Siren'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OPERATIONAL SELECTION BAR UI SECTION */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-2.5">
        {/* Top Control Bar: Mode Tabs + Active Focus Summary */}
        <div className="bg-surface border border-border rounded-xl p-2 shadow-subtle flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5">
          {/* Segmented Mode Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/80 rounded-xl border border-border/70 overflow-x-auto">
            {[
              { id: 'map-live', num: '01', label: '2D Map & Streamlines', icon: Compass },
              { id: 'physics', num: '02', label: 'SWE Physics Engine', icon: Sliders },
              { id: 'structures', num: '03', label: 'Gutters & Culverts', icon: Shield },
              { id: 'hydrographs', num: '04', label: 'Stage Hydrographs', icon: Activity },
              { id: 'tactical', num: '05', label: 'Tactical Interventions', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple text-white shadow-elevated font-bold'
                      : 'text-ink-secondary hover:text-ink hover:bg-surface'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] px-1 py-0.2 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface text-ink-secondary'
                    }`}
                  >
                    {tab.num}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Basin Indicator & Quick FlyTo Trigger */}
          <div className="flex items-center justify-between sm:justify-end gap-2 px-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-ink-secondary">
              <MapPin className="w-3.5 h-3.5 text-purple shrink-0" />
              <span className="hidden sm:inline">Active Basin:</span>
              <strong className="text-ink truncate max-w-[180px] sm:max-w-none">{currentCell.name.split(' (')[0]}</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                {currentCell.ward}
              </span>
            </div>
            <button
              onClick={() => handleSelectCell(currentCell)}
              className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-secondary text-purple border border-purple/30 hover:border-purple text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
              title="Fly map camera to active basin coordinates"
            >
              <Crosshair className="w-3 h-3" />
              <span>Locate</span>
            </button>
          </div>
        </div>

        {/* Catchment Basin Selection Strip (6 Monitored Focus Depressions) */}
        <div className="bg-surface border border-border rounded-xl p-2.5 shadow-subtle flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple" />
              Catchment Basin Selection Bar • Municipal Hydrodynamic Focus Zones ({MUNICIPAL_BASINS.length})
            </span>
            <span className="text-[10px] font-mono text-purple font-semibold">
              Live Linked to Map Digital Twin
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {MUNICIPAL_BASINS.map((cell) => {
              const isSelected = selectedCellId === cell.id;
              const isCritical = cell.accumulation === 'CRITICAL';
              return (
                <button
                  key={cell.id}
                  onClick={() => handleSelectCell(cell)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1.5 relative group ${
                    isSelected
                      ? 'bg-purple-soft/60 border-purple text-purple shadow-subtle ring-2 ring-purple/50'
                      : 'bg-surface-secondary/70 hover:bg-surface border-border text-ink hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-purple text-white' : 'bg-surface text-ink-secondary'
                      }`}
                    >
                      {cell.ward.split(' ')[1] || cell.ward}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCritical
                          ? 'bg-status-alert-soft text-status-alert'
                          : 'bg-status-warning-soft text-status-warning'
                      }`}
                    >
                      {cell.accumulation}
                    </span>
                  </div>

                  <div className="font-bold text-xs truncate text-ink group-hover:text-purple transition-colors">
                    {cell.name.split(' (')[0]}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary pt-0.5 border-t border-border/50">
                    <span>{cell.elevation}m MSL</span>
                    <span className="text-purple font-semibold">{cell.slopePct}% slp</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 2D HYDRODYNAMIC MAP & STREAMLINES */}
      {/* ========================================================= */}
      {activeTab === 'map-live' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left Column: Map Twin + Vector Streamline Canvas + Scrubber */}
          <div className="xl:col-span-8 flex flex-col gap-3">
            {/* Interactive GIS Map */}
            <div className="rounded-xl overflow-hidden border border-border shadow-subtle relative">
              <InteractiveMapTwin height="520px" />

              {/* Map Floating HUD Overlay */}
              <div className="absolute top-3 left-3 z-10 bg-surface/90 backdrop-blur-md border border-border rounded-lg p-2 text-xs shadow-elevated flex items-center gap-3 font-mono">
                <span className="flex items-center gap-1 text-purple font-bold">
                  <Waves className="w-3.5 h-3.5 animate-pulse" />
                  {currentCell.name.split(' ')[0]}
                </span>
                <span className="text-ink-secondary">|</span>
                <span>Depth: <strong className="text-status-alert">{Math.round(dynamicDepth)} cm</strong></span>
                <span className="text-ink-secondary">|</span>
                <span>Vel: <strong className="text-ink">{dynamicVelocity} m/s</strong></span>
                <span className="text-ink-secondary">|</span>
                <span>Fr: <strong className={froudeNumber >= 1 ? 'text-status-alert' : 'text-purple'}>{froudeNumber}</strong></span>
              </div>
            </div>

            {/* FEATURE 5: 2D Flow Streamlines & Particle Vector Simulator */}
            <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-purple" />
                  <span className="text-xs font-bold text-ink uppercase tracking-wide">
                    Feature 5: 2D Overland Streamlines &amp; Flow Particle Tracer
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  {/* Density Selector */}
                  <div className="flex items-center gap-1 bg-surface-secondary px-2 py-0.5 rounded border border-border">
                    <span className="text-ink-secondary">Density:</span>
                    {[
                      { key: 'Low', label: 'Low' },
                      { key: 'Standard', label: 'Std' },
                      { key: 'Dense', label: 'Dense' },
                      { key: 'Ultra', label: 'Ultra' },
                    ].map((d) => (
                      <button
                        key={d.key}
                        onClick={() => setVectorDensity(d.key)}
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          vectorDensity === d.key ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {/* Particle Speed */}
                  <div className="flex items-center gap-1 bg-surface-secondary px-2 py-0.5 rounded border border-border">
                    <span className="text-ink-secondary">Speed:</span>
                    {[
                      { key: 'Slow', label: '0.5x' },
                      { key: 'Normal', label: '1.0x' },
                      { key: 'Fast', label: '2.0x' },
                      { key: 'Frozen', label: 'Pause' },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setParticleSpeed(s.key)}
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          particleSpeed === s.key ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Color Map Mode */}
                  <select
                    value={vectorColorMode}
                    onChange={(e) => setVectorColorMode(e.target.value)}
                    className="bg-surface border border-border rounded px-2 py-0.5 text-ink text-[10px]"
                  >
                    <option value="Velocity">Color: Velocity</option>
                    <option value="Depth">Color: Depth</option>
                    <option value="Shear">Color: Shear Stress</option>
                    <option value="Froude">Color: Froude No.</option>
                  </select>
                </div>
              </div>

              {/* Animated Canvas */}
              <div className="w-full h-[140px] bg-canvas rounded-lg border border-border relative overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute bottom-2 left-3 pointer-events-none flex items-center gap-4 text-[10px] font-mono text-ink-secondary bg-surface/80 backdrop-blur-sm px-2 py-0.5 rounded">
                  <span>Downstream Gradient: <strong>{currentCell.slopePct}% ({currentCell.d8Direction})</strong></span>
                  <span>Manning Resistance: <strong>n = {effectiveN}</strong></span>
                  <span>Active Particles: <strong>{vectorDensity === 'Low' ? 30 : vectorDensity === 'Standard' ? 65 : vectorDensity === 'Dense' ? 120 : 180}</strong></span>
                </div>
              </div>
            </div>

            {/* Timeline Scrubber */}
            <TimelineScrubber />
          </div>

          {/* Right Column: Basin Dossier + Telemetry + Grate Clearance */}
          <div className="xl:col-span-4 flex flex-col gap-3">
            {/* Active Catchment Basin Dossier & Quick Selector Card */}
            <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple" />
                  Active Catchment Profile
                </span>
                <span className="text-[10px] font-mono text-purple font-bold">
                  {currentCell.id.toUpperCase()}
                </span>
              </div>

              {/* Basin Search & Dropdown Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-secondary pointer-events-none" />
                <select
                  value={selectedCellId}
                  onChange={(e) => {
                    const found = MUNICIPAL_BASINS.find((b) => b.id === e.target.value);
                    if (found) handleSelectCell(found);
                  }}
                  className="w-full pl-8 pr-7 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs font-semibold text-ink appearance-none cursor-pointer focus:outline-none focus:border-purple"
                >
                  {MUNICIPAL_BASINS.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.ward.split(' ')[1] || b.ward}] {b.name} ({b.elevation}m MSL)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-secondary absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Basin Geographic & Hydraulic Characteristics */}
              <div className="bg-surface-secondary/70 border border-border rounded-lg p-2.5 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Contributing Area:</span>
                  <strong className="text-ink">{currentCell.catchmentAreaKm2} km² ({currentCell.catchmentAreaKm2 * 100} ha)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Longest Flow Path:</span>
                  <span className="text-purple font-bold">{currentCell.longestFlowPathM} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Major Pour-Point:</span>
                  <span className="text-ink truncate max-w-[190px]" title={currentCell.pourPoint}>
                    {currentCell.pourPoint}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Aspect &amp; Vector:</span>
                  <span className="text-status-alert font-bold">{currentCell.aspect} • Flow {currentCell.d8Direction}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Telemetry Matrix */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
              <div className="flex items-start justify-between border-b border-border pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple font-bold px-1.5 py-0.5 rounded bg-purple-soft">
                      CELL ID: {currentCell.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      {currentCell.coords[0].toFixed(3)}°E, {currentCell.coords[1].toFixed(3)}°N
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink mt-1">{currentCell.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${safetyClassification.color}`}
                >
                  {currentCell.accumulation}
                </span>
              </div>

              {/* 4 Primary Dynamic Stat Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold">Surface Elevation</span>
                  <div className="mt-1 font-mono text-lg font-bold text-ink flex items-baseline gap-1">
                    {currentCell.elevation} <span className="text-xs font-normal text-ink-secondary">m MSL</span>
                  </div>
                  <div className="text-[10px] font-mono text-purple mt-0.5">Slope: {currentCell.slopePct}%</div>
                </div>

                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold flex items-center justify-between">
                    <span>Water Depth</span>
                    {barrierMitigationDeltaCm > 0 && (
                      <span className="text-[9px] text-status-safe font-mono">(-{barrierMitigationDeltaCm}cm)</span>
                    )}
                  </span>
                  <div className="mt-1 font-mono text-lg font-bold text-status-alert flex items-baseline gap-1">
                    {Math.round(dynamicDepth)} <span className="text-xs font-normal text-ink-secondary">cm</span>
                  </div>
                  <div className="text-[10px] font-mono text-ink-secondary mt-0.5">
                    Horizon: +{nowcastMinutes}m nowcast
                  </div>
                </div>

                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold">Sheet Flow Velocity</span>
                  <div className="mt-1 font-mono text-lg font-bold text-ink flex items-baseline gap-1">
                    {dynamicVelocity} <span className="text-xs font-normal text-ink-secondary">m/s</span>
                  </div>
                  <div className="text-[10px] font-mono text-purple mt-0.5">Fr: {froudeNumber}</div>
                </div>

                <div className="bg-surface-secondary border border-border rounded-lg p-2.5">
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold">Runoff Generation</span>
                  <div className="mt-1 font-mono text-lg font-bold text-ink flex items-baseline gap-1">
                    {dynamicRunoff} <span className="text-xs font-normal text-ink-secondary">mm/h</span>
                  </div>
                  <div className="text-[10px] font-mono text-ink-secondary mt-0.5">Loss: {dynamicInfiltrationRate} mm/h</div>
                </div>
              </div>

              {/* Surface to Drain Interaction Matrix */}
              <div className="bg-surface-secondary border border-border rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-ink">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-purple" />
                    Surface → Drain Inlet Capture
                  </span>
                  <span className="text-[10px] font-mono text-purple font-bold">
                    CAPACITY {effectiveInletCapture}%
                  </span>
                </div>

                <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border flex">
                  <div
                    style={{ width: `${effectiveInletCapture}%` }}
                    className="bg-status-safe flex items-center justify-center text-[9px] font-mono text-white font-bold transition-all duration-500"
                    title="Captured by Street Grates"
                  >
                    {effectiveInletCapture}%
                  </div>
                  <div
                    style={{ width: `${effectiveOverlandOverflow}%` }}
                    className="bg-status-alert flex items-center justify-center text-[9px] font-mono text-white font-bold transition-all duration-500"
                    title="Overland Sheet Overflow"
                  >
                    {effectiveOverlandOverflow}%
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-ink-secondary pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-safe" /> Inlet Inflow ({effectiveInletCapture}%)
                  </span>
                  <span className="flex items-center gap-1 text-status-alert font-bold">
                    <span className="w-2 h-2 rounded-full bg-status-alert" /> Overland Bypass ({effectiveOverlandOverflow}%)
                  </span>
                </div>
              </div>

              {/* Workable Tactical Quick-Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeployBarrier}
                  className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-between shadow-subtle transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Simulate Sandbag Barrier Diversion
                  </span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleAssignSweeper}
                  disabled={activeSweeperSquad}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                    activeSweeperSquad
                      ? 'bg-status-safe-soft text-status-safe border-status-safe font-bold'
                      : 'bg-surface hover:bg-surface-secondary text-ink border-border hover:border-purple'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple" />
                    {activeSweeperSquad ? 'Sweeper Squad Clearing Grates (96% Capture Active)' : 'Assign Street Sweeper Grate Clearance'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple" />
                </button>
              </div>

              {/* Active Barriers on this Basin */}
              {cellBarriers.length > 0 && (
                <div className="border-t border-border pt-2 flex flex-col gap-1.5">
                  <div className="text-[10px] font-mono uppercase font-bold text-ink-secondary flex items-center justify-between">
                    <span>Active Barriers in this Basin ({cellBarriers.length})</span>
                    <span className="text-status-safe font-bold">Total: -{barrierMitigationDeltaCm}cm</span>
                  </div>
                  <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                    {cellBarriers.map((bar) => (
                      <div
                        key={bar.id}
                        className="bg-surface-secondary p-1.5 rounded text-[11px] border border-border flex items-center justify-between"
                      >
                        <span className="truncate text-ink font-medium">{bar.name}</span>
                        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                          <span className="text-status-safe font-bold">-{bar.mitigationDeltaCm}cm</span>
                          <button
                            onClick={() => {
                              removeBarrier(bar.id);
                              showToast(`Removed barrier ${bar.name}`);
                            }}
                            className="text-status-alert hover:underline ml-1"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PHYSICS ENGINE & HYDRAULIC CALIBRATOR */}
      {/* ========================================================= */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* FEATURE 1: 2D SWE Numerical Solver Playground */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 1: 2D SWE Solver Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                CFL &lt; 0.85
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Numerical solver parameter tuning for hyperbolic 2D shallow water conservation laws with source terms.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-ink-secondary font-mono uppercase block mb-1">
                  Time Step &Delta;t ({sweTimeStep}s)
                </label>
                <div className="flex items-center gap-2">
                  {[0.1, 0.25, 0.5, 1.0, 2.0].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSweTimeStep(t)}
                      className={`flex-1 py-1 rounded text-xs font-mono border transition-all ${
                        sweTimeStep === t
                          ? 'bg-purple text-white border-purple font-bold'
                          : 'bg-surface-secondary text-ink border-border hover:border-purple/40'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-ink-secondary font-mono uppercase block mb-1">
                  Numerical Scheme
                </label>
                <select
                  value={sweScheme}
                  onChange={(e) => setSweScheme(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink"
                >
                  <option value="Kurganov-Petrova (Central-Upwind)">Kurganov-Petrova (Central-Upwind)</option>
                  <option value="Roe Riemann Solver (Exact)">Roe Riemann Solver (Exact)</option>
                  <option value="TVD-WAF (Weighted Average Flux)">TVD-WAF (Weighted Average Flux)</option>
                  <option value="Lax-Wendroff (2-Step)">Lax-Wendroff (2-Step)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-ink-secondary font-mono uppercase block mb-1">
                  Sub-Grid Turbulence Model
                </label>
                <select
                  value={sweTurbulence}
                  onChange={(e) => setSweTurbulence(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink"
                >
                  <option value="Smagorinsky (SGS)">Smagorinsky Eddy-Viscosity (Cs=0.15)</option>
                  <option value="Elder Anisotropic Mixing">Elder Anisotropic Transverse Mixing</option>
                  <option value="Zero-Equation Constant">Zero-Equation Constant Turbulent Viscosity</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-ink-secondary font-mono uppercase block mb-1">
                  Target CFL Limit (Cr &le; {sweCFLTarget})
                </label>
                <div className="flex items-center gap-1.5">
                  {[0.5, 0.75, 0.85, 0.95].map((cfl) => (
                    <button
                      key={cfl}
                      onClick={() => setSweCFLTarget(cfl)}
                      className={`flex-1 py-1 rounded text-xs font-mono border transition-all ${
                        sweCFLTarget === cfl
                          ? 'bg-purple text-white border-purple font-bold'
                          : 'bg-surface-secondary text-ink border-border hover:border-purple/40'
                      }`}
                    >
                      {cfl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Computed Courant Cr:</span>
                  <strong className={computedCourantNumber <= sweCFLTarget ? 'text-status-safe' : 'text-status-alert'}>
                    {computedCourantNumber} {computedCourantNumber <= sweCFLTarget ? '(STABLE)' : '(EXCEEDS CFL!)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Mass Error %:</span>
                  <span className="text-ink">&plusmn;0.04% (Conservative)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Wetted Grid Cells:</span>
                  <span className="text-purple font-bold">142,850 cells</span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 2: Manning's Roughness (n) Surface Material Classifier */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 2: Manning's Roughness (n)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                n = {effectiveN.toFixed(3)}
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Live surface friction calibration based on urban land cover, paving, and municipal debris loads.
            </p>

            <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
              {MANNING_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedManningId(mat.id)}
                  className={`w-full p-2 rounded-lg text-left text-xs border transition-all flex items-center justify-between ${
                    selectedManningId === mat.id
                      ? 'bg-purple-soft text-purple border-purple font-bold'
                      : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{mat.name}</div>
                    <div className="text-[10px] text-ink-secondary font-normal truncate max-w-[180px]">{mat.desc}</div>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface font-bold">
                    {mat.n.toFixed(3)}
                  </span>
                </button>
              ))}
            </div>

            {selectedManningId === 'custom' && (
              <div className="bg-surface-secondary border border-border rounded-lg p-2 text-xs">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-ink-secondary">Custom Manning n:</span>
                  <strong className="text-purple">{customManningN.toFixed(3)}</strong>
                </div>
                <input
                  type="range"
                  min="0.010"
                  max="0.080"
                  step="0.001"
                  value={customManningN}
                  onChange={(e) => setCustomManningN(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>
            )}

            <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Manning's Eq V:</span>
                <span className="font-bold text-ink">{dynamicVelocity} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Time-of-Concentration Tc:</span>
                <span className="font-bold text-purple">{timeOfConcentrationMin} min</span>
              </div>
            </div>
          </div>

          {/* FEATURE 3: Soil Infiltration & Loss Model */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 3: Soil Infiltration Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                {infiltrationModel}
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Hydrologic abstractions simulator comparing Horton's exponential decay, Green-Ampt suction, and SCS-CN.
            </p>

            <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border">
              {['Horton', 'Green-Ampt', 'SCS-CN'].map((m) => (
                <button
                  key={m}
                  onClick={() => setInfiltrationModel(m)}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-all ${
                    infiltrationModel === m ? 'bg-purple text-white font-bold' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {infiltrationModel === 'Horton' && (
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-ink-secondary">Initial Cap f0:</span>
                    <strong className="text-ink">{hortonF0} mm/h</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={hortonF0}
                    onChange={(e) => setHortonF0(Number(e.target.value))}
                    className="w-full accent-purple"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-ink-secondary">Equilibrium fc:</span>
                    <strong className="text-ink">{hortonFc} mm/h</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    value={hortonFc}
                    onChange={(e) => setHortonFc(Number(e.target.value))}
                    className="w-full accent-purple"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-ink-secondary">Decay Constant k:</span>
                    <strong className="text-ink">{hortonK.toFixed(1)} hr⁻¹</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={hortonK}
                    onChange={(e) => setHortonK(Number(e.target.value))}
                    className="w-full accent-purple"
                  />
                </div>
              </div>
            )}

            {infiltrationModel === 'SCS-CN' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Curve Number (CN):</span>
                  <strong className="text-purple">{curveNumberCN}</strong>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={curveNumberCN}
                  onChange={(e) => setCurveNumberCN(Number(e.target.value))}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">
                  Urban commercial / densely asphalted basins typically range CN 85–95.
                </p>
              </div>
            )}

            {/* Infiltration Summary Box */}
            <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Infiltration Loss:</span>
                <span className="font-bold text-status-safe">{dynamicInfiltrationRate} mm/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Effective Excess Rain:</span>
                <span className="font-bold text-status-alert">{dynamicRunoff} mm/h</span>
              </div>
            </div>
          </div>

          {/* FEATURE 15: Precipitation Hyetograph & Storm Intensity (IDF Curves) */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 15: Storm IDF Generator
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                {dynamicRainfall} mm/h
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Inject synthetic cloudburst pulses or calibrated IMD Return Period storm profiles.
            </p>

            <div>
              <label className="text-[10px] text-ink-secondary font-mono uppercase block mb-1">
                Select Return Period (ARI)
              </label>
              <select
                value={selectedReturnPeriod}
                onChange={(e) => setSelectedReturnPeriod(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink"
              >
                {RETURN_PERIODS.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label} ({r.value} mm/h base)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-ink-secondary">Base Rain Intensity:</span>
                <strong className="text-ink">{customRainfallRate} mm/h</strong>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                value={customRainfallRate}
                onChange={(e) => setCustomRainfallRate(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </div>

            <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Total Pulse Rain:</span>
                <span className="font-bold text-status-alert">{dynamicRainfall} mm/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Basin Volumetric Inflow:</span>
                <span className="font-bold text-purple">{peakDischargeM3s} m³/s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GUTTERS, INLETS & CULVERTS */}
      {/* ========================================================= */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* FEATURE 7: Street Gutter & Curb Overtopping Analyzer */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 7: Gutter &amp; Curb Overtopping
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isCurbOvertopped ? 'bg-status-alert text-white animate-pulse' : 'bg-status-safe-soft text-status-safe'
                }`}
              >
                {isCurbOvertopped ? 'CURB OVERTOPPED' : 'CONTAINED'}
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Cross-sectional gutter hydraulic spread width $T$ and sidewalk overtopping analysis.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Curb Barrier Height:</span>
                  <strong className="text-ink">{curbHeightCm} cm</strong>
                </div>
                <input
                  type="range"
                  min="12"
                  max="35"
                  value={curbHeightCm}
                  onChange={(e) => setCurbHeightCm(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Cross Slope (Sx):</span>
                  <strong className="text-ink">{crossSlopePct}%</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.5"
                  step="0.1"
                  value={crossSlopePct}
                  onChange={(e) => setCrossSlopePct(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Longitudinal Slope (S0):</span>
                  <strong className="text-ink">{longSlopePct}%</strong>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="4.0"
                  step="0.1"
                  value={longSlopePct}
                  onChange={(e) => setLongSlopePct(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>
            </div>

            <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Ponded Spread Width T:</span>
                <strong className={gutterSpreadWidthM > 8 ? 'text-status-alert' : 'text-ink'}>
                  {gutterSpreadWidthM} meters
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Traffic Lanes Submerged:</span>
                <span className="text-purple font-bold">{Math.min(4, Math.ceil(gutterSpreadWidthM / 3.5))} lanes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Sidewalk Inundation:</span>
                <span className={isCurbOvertopped ? 'text-status-alert font-bold' : 'text-status-safe font-bold'}>
                  {isCurbOvertopped ? 'YES (Pedestrian hazard)' : 'NO (Protected)'}
                </span>
              </div>
            </div>
          </div>

          {/* FEATURE 10: Storm Drain Inlet Clogging Stress-Tester */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 10: Grate Clogging Tester
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                {inletBlockagePct}% Blocked
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Simulate plastic bags, silt accumulation, and street garbage choking catch-basin grate inlets.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-ink-secondary">Grate Clogging %:</span>
                  <strong className="text-status-alert">{inletBlockagePct}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={inletBlockagePct}
                  onChange={(e) => setInletBlockagePct(Number(e.target.value))}
                  className="w-full accent-status-alert"
                />
              </div>

              <div className="flex gap-2">
                {[0, 25, 50, 75].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setInletBlockagePct(pct)}
                    className={`flex-1 py-1 rounded text-[11px] font-mono border ${
                      inletBlockagePct === pct
                        ? 'bg-status-alert text-white border-status-alert font-bold'
                        : 'bg-surface-secondary text-ink border-border hover:border-status-alert/40'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Effective Capture:</span>
                  <span className="font-bold text-status-safe">{effectiveInletCapture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Overland Bypass:</span>
                  <span className="font-bold text-status-alert">{effectiveOverlandOverflow}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Sweeper Action:</span>
                  <span className={activeSweeperSquad ? 'text-status-safe font-bold' : 'text-ink-secondary'}>
                    {activeSweeperSquad ? 'DEPLOYED (+24% Boost)' : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 12: Culvert & Weir Hydraulic Structure Simulator */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 12: Hydraulic Structure Modeler
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                {structureType}
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Evaluate box culvert underpasses, circular pipes, and broad-crested railway track weirs.
            </p>

            <select
              value={structureType}
              onChange={(e) => setStructureType(e.target.value)}
              className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink"
            >
              <option value="Box Culvert">Reinforced Concrete Box Culvert</option>
              <option value="Circular Pipe">1200mm Circular Storm Conduit</option>
              <option value="Broad Weir">Railway Embankment Overflow Weir</option>
            </select>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-ink-secondary font-mono">Span (m)</label>
                <input
                  type="number"
                  step="0.2"
                  value={structureSpanM}
                  onChange={(e) => setStructureSpanM(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-border rounded p-1.5 text-xs font-mono mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary font-mono">Rise (m)</label>
                <input
                  type="number"
                  step="0.2"
                  value={structureRiseM}
                  onChange={(e) => setStructureRiseM(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-border rounded p-1.5 text-xs font-mono mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary font-mono">Tailwater (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tailwaterDepthM}
                  onChange={(e) => setTailwaterDepthM(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-border rounded p-1.5 text-xs font-mono mt-0.5"
                />
              </div>
            </div>

            <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Flow Regime:</span>
                <span className="text-purple font-bold">Inlet Controlled (Submerged)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Headwater Ratio HW/D:</span>
                <strong className={dynamicDepth / 100 > structureRiseM ? 'text-status-alert' : 'text-status-safe'}>
                  {((dynamicDepth / 100) / structureRiseM).toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Barrel Velocity:</span>
                <span className="text-ink font-bold">{(dynamicVelocity * 1.35).toFixed(2)} m/s</span>
              </div>
            </div>
          </div>

          {/* FEATURE 13: Bed Shear Stress (tau) & Debris Hazard Index */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 13: Shear Stress &amp; Debris
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                {shearStressPa} N/m²
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Bed shear stress $\tau = \rho g R S$ and drag force inducing silt transport and vehicle flotation.
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-surface-secondary border border-border rounded-lg p-2 font-mono">
                <div className="text-[10px] text-ink-secondary uppercase">Sediment Transport State</div>
                <div className="mt-1 font-bold text-ink">
                  {shearStressPa > 15 ? 'MACADAM SCOUR & EROSION' : shearStressPa > 6 ? 'URBAN DEBRIS FLOTATION' : 'LAMINAR SILT WASH'}
                </div>
              </div>

              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Hydraulic Radius R:</span>
                  <span className="text-ink">{(dynamicDepth / 100).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Hydrodynamic Drag Force:</span>
                  <span className="text-status-alert font-bold">{(dynamicVelocity * dynamicVelocity * 480).toFixed(0)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Manhole Lid Dislodgement:</span>
                  <span className={shearStressPa > 12 ? 'text-status-alert font-bold' : 'text-status-safe font-bold'}>
                    {shearStressPa > 12 ? 'HIGH RISK (Inspect)' : 'SECURE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: STAGE HYDROGRAPH & SAFETY RISK */}
      {/* ========================================================= */}
      {activeTab === 'hydrographs' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* FEATURE 4: Interactive Hydrograph Chart (SVG) */}
          <div className="xl:col-span-8 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple" />
                  <h3 className="text-xs font-bold text-ink uppercase">
                    Feature 4: Stage Discharge Hydrograph (Q vs Time t)
                  </h3>
                </div>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Hydrograph response over 0–180 minute timeline: Inflow rate vs Captured drain outflow.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-purple">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple" /> Inflow Q (m³/s)
                </span>
                <span className="flex items-center gap-1 text-status-safe">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-safe" /> Outflow Q (m³/s)
                </span>
              </div>
            </div>

            {/* Interactive SVG Hydrograph Chart */}
            <div className="w-full h-[220px] bg-canvas rounded-lg border border-border p-3 relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#E3E0EA" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#E3E0EA" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#E3E0EA" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="165" x2="500" y2="165" stroke="#E3E0EA" strokeWidth="1" />

                {/* Inflow Hydrograph Curve */}
                <path
                  d={`M 0,165 Q 120,${Math.max(15, 165 - peakDischargeM3s * 2.8)} 250,${Math.max(15, 165 - peakDischargeM3s * 2.5)} T 500,165`}
                  fill="none"
                  stroke="#6D4AFF"
                  strokeWidth="3"
                />

                {/* Inflow Fill Area */}
                <path
                  d={`M 0,165 Q 120,${Math.max(15, 165 - peakDischargeM3s * 2.8)} 250,${Math.max(15, 165 - peakDischargeM3s * 2.5)} T 500,165 L 500,165 L 0,165 Z`}
                  fill="#6D4AFF"
                  fillOpacity="0.12"
                />

                {/* Outflow Hydrograph Curve */}
                <path
                  d={`M 0,165 Q 160,${Math.max(35, 165 - (peakDischargeM3s * (effectiveInletCapture / 100)) * 2.4)} 290,${Math.max(35, 165 - (peakDischargeM3s * (effectiveInletCapture / 100)) * 2.2)} T 500,165`}
                  fill="none"
                  stroke="#3B8F67"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* Scrubber Time Marker */}
                <line
                  x1={(nowcastMinutes / 180) * 500}
                  y1="10"
                  x2={(nowcastMinutes / 180) * 500}
                  y2="165"
                  stroke="#D94A4A"
                  strokeWidth="2"
                />
                <circle
                  cx={(nowcastMinutes / 180) * 500}
                  cy="15"
                  r="4"
                  fill="#D94A4A"
                />
              </svg>

              {/* Chart Overlay Badge */}
              <div className="absolute top-3 left-4 bg-surface/90 backdrop-blur-sm border border-border p-2 rounded text-[10px] font-mono shadow-subtle flex items-center gap-3">
                <span>Peak Q: <strong>{peakDischargeM3s} m³/s</strong></span>
                <span>Time-to-Peak Tp: <strong>{timeOfConcentrationMin} min</strong></span>
                <span>Current Time: <strong className="text-status-alert">T+{nowcastMinutes} min</strong></span>
              </div>
            </div>

            {/* FEATURE 9: LiDAR DEM Elevation Transect Cross-Section Profiler */}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-purple" />
                  <span className="text-xs font-bold text-ink uppercase">
                    Feature 9: LiDAR DEM Elevation Transect Cross-Section (500m)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-ink-secondary">Station Chainage: 0m to 500m</span>
              </div>

              <div className="w-full h-[95px] bg-canvas rounded-lg border border-border p-2 relative">
                <svg className="w-full h-full" viewBox="0 0 500 75" preserveAspectRatio="none">
                  {/* Terrain DEM Line */}
                  <path
                    d={`M 0,${35 - currentCell.elevation * 1.5} Q 150,${55 - currentCell.elevation} 280,${70 - currentCell.elevation * 0.8} T 500,${40 - currentCell.elevation}`}
                    fill="none"
                    stroke="#24212B"
                    strokeWidth="2"
                  />
                  {/* Subterranean Storm Sewer Pipe */}
                  <path
                    d={`M 0,${55 - currentCell.elevation * 1.5} Q 150,${72 - currentCell.elevation} 280,${85 - currentCell.elevation * 0.8} T 500,${60 - currentCell.elevation}`}
                    fill="none"
                    stroke="#948E9F"
                    strokeWidth="3"
                    strokeDasharray="3 3"
                  />
                  {/* Water Surface Elevation (WSE) */}
                  <path
                    d={`M 0,${35 - currentCell.elevation * 1.5 - dynamicDepth * 0.4} Q 150,${55 - currentCell.elevation - dynamicDepth * 0.4} 280,${70 - currentCell.elevation * 0.8 - dynamicDepth * 0.4} T 500,${40 - currentCell.elevation - dynamicDepth * 0.4}`}
                    fill="none"
                    stroke="#6D4AFF"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="absolute bottom-1 left-2 text-[9px] font-mono text-ink-secondary flex items-center gap-4 bg-surface/80 px-2 py-0.5 rounded">
                  <span>Ground Elevation: <strong>{currentCell.elevation}m MSL</strong></span>
                  <span>WSE: <strong className="text-purple">{(currentCell.elevation + dynamicDepth / 100).toFixed(2)}m MSL</strong></span>
                  <span>Surcharge: <strong className="text-status-alert">+{Math.round(dynamicDepth)}cm</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Safety Risk Matrix & USBR Guidelines */}
          <div className="xl:col-span-4 flex flex-col gap-3">
            {/* FEATURE 17: Human & Vehicle Safety Velocity-Depth (D x V) Matrix */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-purple" />
                  <h3 className="text-xs font-bold text-ink uppercase">
                    Feature 17: Safety Velocity-Depth Matrix
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  USBR / ARR Standards
                </span>
              </div>

              <div className={`p-3 rounded-lg border flex flex-col gap-1.5 ${safetyClassification.color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">{safetyClassification.level}</span>
                  <span className="font-mono text-xs font-bold">D×V = {hazardProductDV} m²/s</span>
                </div>
                <p className="text-[11px] opacity-90">{safetyClassification.note}</p>
              </div>

              {/* Threshold breakdown */}
              <div className="space-y-1 text-xs">
                {[
                  { label: 'Low (< 0.4 m²/s)', desc: 'Safe for able-bodied adults & children', active: hazardProductDV < 0.4 },
                  { label: 'Moderate (0.4 - 0.6 m²/s)', desc: 'Unstable for children & elderly; sedans stall', active: hazardProductDV >= 0.4 && hazardProductDV < 0.6 },
                  { label: 'High (0.6 - 1.0 m²/s)', desc: 'Adults lose footing; small cars float away', active: hazardProductDV >= 0.6 && hazardProductDV < 1.0 },
                  { label: 'Extreme (> 1.0 m²/s)', desc: 'Structural destruction; heavy trucks floated', active: hazardProductDV >= 1.0 },
                ].map((th) => (
                  <div
                    key={th.label}
                    className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                      th.active ? 'bg-purple-soft border-purple text-purple font-bold' : 'bg-surface-secondary border-border text-ink-secondary'
                    }`}
                  >
                    <span>{th.label}</span>
                    <span className="text-[10px] font-normal">{th.desc}</span>
                  </div>
                ))}
              </div>

              {/* FEATURE 6: Froude Number & Hydraulic Jump Warning */}
              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Froude Number Fr:</span>
                  <strong className={froudeNumber >= 1.0 ? 'text-status-alert' : 'text-purple'}>
                    {froudeNumber} {froudeNumber >= 1.0 ? '(SUPERCRITICAL)' : '(SUBCRITICAL)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Hydraulic Jump Risk:</span>
                  <span className={froudeNumber >= 0.85 ? 'text-status-alert font-bold' : 'text-status-safe font-bold'}>
                    {froudeNumber >= 0.85 ? 'HIGH (Standing waves)' : 'LOW'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Scour Threat:</span>
                  <span className="text-ink font-bold">{froudeNumber >= 1.0 ? 'Pavement uplift likely' : 'Nominal'}</span>
                </div>
              </div>
            </div>

            {/* FEATURE 18: Multi-Basin Comparative Hydrodynamic Matrix */}
            <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple" />
                  Feature 18: Basin Comparative Matrix
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">6 Monitored</span>
              </div>

              <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 text-[11px] font-mono">
                {MUNICIPAL_BASINS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectCell(b)}
                    className={`w-full p-1.5 rounded flex items-center justify-between text-left border ${
                      selectedCellId === b.id ? 'bg-purple-soft text-purple border-purple font-bold' : 'bg-surface-secondary text-ink border-border'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{b.name.split(' ')[0]}</span>
                    <span>{b.elevation}m</span>
                    <span className={b.accumulation === 'CRITICAL' ? 'text-status-alert' : 'text-status-warning'}>
                      {b.accumulation}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TACTICAL INTERVENTIONS & DISPATCH */}
      {/* ========================================================= */}
      {activeTab === 'tactical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* FEATURE 16: Sandbag & Deflector Wall Architect */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 16: Barrier Architect
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                Map-Twin Synced
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Deploy modular flood barriers, K-Rail concrete dividers, or sandbag dikes directly onto the GIS digital twin.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-ink-secondary font-mono">Barrier System</label>
                <select
                  value={barrierType}
                  onChange={(e) => setBarrierType(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink mt-0.5"
                >
                  <option value="Heavy Sandbag Dike">Heavy Sandbag Dike (Triple Staggered)</option>
                  <option value="AquaFence PVC Wall">AquaFence Self-Anchoring PVC Wall</option>
                  <option value="Concrete Jersey Barrier">Concrete Jersey Barrier Deflector</option>
                  <option value="Quick-Dam Absorbent Berm">Quick-Dam Inflatable Berm</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Wall Height:</span>
                  <strong className="text-ink">{barrierHeightCm} cm</strong>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={barrierHeightCm}
                  onChange={(e) => setBarrierHeightCm(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Barrier Length:</span>
                  <strong className="text-ink">{barrierLengthM} meters</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={barrierLengthM}
                  onChange={(e) => setBarrierLengthM(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ink-secondary">Deflection Angle:</span>
                  <strong className="text-ink">{barrierAngleDeg}°</strong>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  value={barrierAngleDeg}
                  onChange={(e) => setBarrierAngleDeg(Number(e.target.value))}
                  className="w-full accent-purple"
                />
              </div>

              <button
                onClick={handleDeployBarrier}
                className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg font-semibold flex items-center justify-center gap-2 shadow-subtle transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Deploy Barrier to Map</span>
              </button>
            </div>
          </div>

          {/* FEATURE 11: Mobile Dewatering Pump Fleet Dispatcher */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 11: Mobile Pump Dispatch
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                {mobilePumpsList.length} Squads
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Directly allocate municipal high-capacity turbo dewatering pump units to this depressed basin.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-ink-secondary font-mono">Select Available Pump Squad</label>
                <select
                  value={selectedPumpId}
                  onChange={(e) => setSelectedPumpId(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-xs font-medium text-ink mt-0.5"
                >
                  {mobilePumpsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.capacity}) - {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Assigned Ward:</span>
                  <span className="text-ink font-bold">{currentCell.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Drawdown Rate:</span>
                  <span className="text-status-safe font-bold">-9.5 cm / hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Fuel Burn Rate:</span>
                  <span className="text-ink">18.5 L/hr (Diesel)</span>
                </div>
              </div>

              <button
                onClick={handleDeployPump}
                className="w-full py-2 px-3 bg-surface hover:bg-surface-secondary text-ink border border-purple/40 hover:border-purple rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-purple" />
                <span>Dispatch Pump Unit</span>
              </button>
            </div>
          </div>

          {/* FEATURE 14: Precision Coordinate Geo-Probe */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Feature 14: Precision Geo-Probe
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-soft text-purple font-bold">
                LiDAR DEM
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Probe ground elevation, aspect, and D8 flow direction at any coordinate in the municipal territory.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[10px] text-ink-secondary">Latitude</label>
                <input
                  type="number"
                  step="0.001"
                  value={probeLat}
                  onChange={(e) => setProbeLat(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded p-1.5 text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-secondary">Longitude</label>
                <input
                  type="number"
                  step="0.001"
                  value={probeLng}
                  onChange={(e) => setProbeLng(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded p-1.5 text-xs mt-0.5"
                />
              </div>
            </div>

            <button
              onClick={handleRunProbe}
              className="w-full py-1.5 px-3 bg-surface-secondary hover:bg-purple-soft text-ink hover:text-purple border border-border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Query DEM Coordinates</span>
            </button>

            {probeResult && (
              <div className="bg-canvas border border-border rounded-lg p-2.5 font-mono text-[11px] space-y-1 animate-fadeIn">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">DEM Elevation:</span>
                  <strong className="text-ink">{probeResult.elevation} m MSL</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Slope &amp; Aspect:</span>
                  <span className="text-purple font-bold">{probeResult.slope}% ({probeResult.aspect})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">D8 Flow Vector:</span>
                  <span className="text-status-alert font-bold">To {probeResult.d8}</span>
                </div>
              </div>
            )}
          </div>

          {/* FEATURE 19 & 20: Broadcast & Data Export Suite */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple" />
                <h3 className="text-xs font-bold text-ink uppercase">
                  Features 19 &amp; 20: Broadcast &amp; Export
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                Authority Desk
              </span>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Broadcast municipal emergency bulletins and export full GIS layers &amp; simulation logs.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleDispatchAlert}
                className="w-full py-2 px-3 bg-status-alert hover:bg-status-alert/90 text-white rounded-lg text-xs font-semibold flex items-center justify-between shadow-subtle transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  Issue Authority Emergency Warning
                </span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={handleExportGeoJSON}
                  className="py-1.5 px-2 bg-surface hover:bg-surface-secondary text-ink border border-border rounded text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3 h-3 text-purple" />
                  <span>GeoJSON</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="py-1.5 px-2 bg-surface hover:bg-surface-secondary text-ink border border-border rounded text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileText className="w-3 h-3 text-purple" />
                  <span>Hydrograph CSV</span>
                </button>
              </div>

              <button
                onClick={handleCopyParameters}
                className="w-full py-1.5 px-3 bg-surface-secondary hover:bg-purple-soft text-ink hover:text-purple border border-border rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Parameter State to Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
