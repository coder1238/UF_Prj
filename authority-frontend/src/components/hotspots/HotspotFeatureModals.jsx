import React, { useState, useEffect, useRef } from 'react';
import { useFloodCommand } from '../../context/FloodCommandContext';
import { HOTSPOT_DATA, calculateHpiScore } from '../../data/floodHotspotsData';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Send,
  Download,
  Printer,
  Eye,
  Waves,
  Truck,
  Building,
  PhoneCall,
  FileText,
  Users,
  Search,
  Sliders,
  TrendingUp,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  Activity,
  ArrowRight,
  ArrowDown,
  Clock,
  Radio,
  Share2,
  AlertOctagon,
  RefreshCw,
  Gauge,
  Compass,
  Cpu,
  BarChart2,
  HelpCircle,
} from 'lucide-react';

// Common Modal Backdrop
function ModalBackdrop({ children, onClose, maxWidth = 'max-w-3xl' }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`bg-surface border border-border rounded-2xl shadow-elevated w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp`}
      >
        {children}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 1: Hotspot Priority Index (HPI) Scoring Matrix & Configurator
// -------------------------------------------------------------
export function HotspotPriorityMatrixModal({ isOpen, onClose, hotspots, onSelectHotspot }) {
  const [weights, setWeights] = useState({
    depth: 0.35,
    traffic: 0.25,
    population: 0.20,
    drainage: 0.20,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const scoredHotspots = [...hotspots].map((spot) => ({
    ...spot,
    hpiScore: calculateHpiScore(spot, weights),
  })).sort((a, b) => b.hpiScore - a.hpiScore);

  const handleWeightChange = (key, val) => {
    setWeights((prev) => ({ ...prev, [key]: parseFloat(val) }));
    setSavedSuccess(false);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Rank,Name,Ward,PredictedDepth(cm),Severity,PopulationAtRisk,DrainLoad(%),HPIScore\n' +
      scoredHotspots
        .map(
          (s, i) =>
            `${i + 1},"${s.name}","${s.ward}",${s.predictedDepth},${s.severity},${s.populationAtRisk},${s.drainCapacityLoad}%,${s.hpiScore}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HPI_Rankings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Hotspot Priority Index (HPI) Matrix &amp; Multi-Criteria Tuner</h3>
            <p className="text-[11px] text-ink-secondary">
              Algorithmic prioritization engine weighting inundation, arterial traffic, demographics &amp; drainage stress
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Weight Sliders */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-3">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Multi-Criteria Risk Weights (Sum = {((weights.depth + weights.traffic + weights.population + weights.drainage) * 100).toFixed(0)}%)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-secondary">Flood Depth</span>
                <span className="font-mono font-bold text-purple">{Math.round(weights.depth * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={weights.depth}
                onChange={(e) => handleWeightChange('depth', e.target.value)}
                className="w-full accent-purple cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-secondary">Arterial Traffic</span>
                <span className="font-mono font-bold text-purple">{Math.round(weights.traffic * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={weights.traffic}
                onChange={(e) => handleWeightChange('traffic', e.target.value)}
                className="w-full accent-purple cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-secondary">Vulnerable Pop</span>
                <span className="font-mono font-bold text-purple">{Math.round(weights.population * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={weights.population}
                onChange={(e) => handleWeightChange('population', e.target.value)}
                className="w-full accent-purple cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-secondary">Drain Surcharge</span>
                <span className="font-mono font-bold text-purple">{Math.round(weights.drainage * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={weights.drainage}
                onChange={(e) => handleWeightChange('drainage', e.target.value)}
                className="w-full accent-purple cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Scored Hotspots Table */}
        <div className="border border-border rounded-xl overflow-hidden shadow-subtle">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-secondary text-[11px] text-ink-secondary font-mono border-b border-border">
              <tr>
                <th className="p-2.5">PRIORITY</th>
                <th className="p-2.5">HOTSPOT CORRIDOR</th>
                <th className="p-2.5">WARD</th>
                <th className="p-2.5">DEPTH</th>
                <th className="p-2.5">AT-RISK POP</th>
                <th className="p-2.5">DRAIN LOAD</th>
                <th className="p-2.5">HPI SCORE</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-xs">
              {scoredHotspots.map((spot, idx) => (
                <tr key={spot.id} className="hover:bg-purple-soft/30 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-purple">#{String(idx + 1).padStart(2, '0')}</td>
                  <td className="p-2.5 font-bold text-ink">
                    {spot.name}
                    <div className="text-[10px] text-ink-secondary font-normal">{spot.transitImpact}</div>
                  </td>
                  <td className="p-2.5 text-ink-secondary font-mono">{spot.ward}</td>
                  <td className="p-2.5 font-mono font-bold text-status-alert">{spot.predictedDepth} cm</td>
                  <td className="p-2.5 font-mono text-ink-secondary">{spot.populationAtRisk.toLocaleString()}</td>
                  <td className="p-2.5 font-mono text-ink-secondary">{spot.drainCapacityLoad}%</td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        spot.hpiScore >= 80
                          ? 'bg-status-alert-soft text-status-alert'
                          : spot.hpiScore >= 60
                          ? 'bg-status-caution-soft text-status-caution'
                          : 'bg-status-safe-soft text-status-safe'
                      }`}
                    >
                      {spot.hpiScore} / 100
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => {
                        onSelectHotspot(spot);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-surface border border-purple/40 text-purple font-semibold rounded text-[11px] hover:bg-purple hover:text-white transition-colors"
                    >
                      Focus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Criteria profile locked into Municipal Dispatch Engine for this shift.</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <button
          onClick={handleExportCsv}
          className="px-3 py-1.5 bg-surface border border-border hover:border-ink-secondary text-ink rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export HPI Ranking (CSV)</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSavedSuccess(true)}
            className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
          >
            Apply Active Priority Weights
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 2: Topographic Sump & Cross-Section Elevation Profiler (2D SVG)
// -------------------------------------------------------------
export function TopographicSumpProfilerModal({ isOpen, onClose, hotspot }) {
  const [simDepth, setSimDepth] = useState(hotspot?.predictedDepth || 35);

  useEffect(() => {
    if (hotspot) setSimDepth(hotspot.predictedDepth);
  }, [hotspot]);

  if (!isOpen || !hotspot) return null;

  // Convert simulated depth in cm to SVG water level coordinate
  // Invert level is around MSL 0.0, ground road around 3.5, surface surrounding around 6.0
  const roadY = 160;
  const invertY = 210;
  const waterHeightPx = (simDepth / 60) * 80;
  const waterY = Math.max(80, roadY - waterHeightPx);

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Topographic Sump &amp; Cross-Section Elevation Profiler</h3>
            <p className="text-[11px] text-ink-secondary">
              2D Geotechnical Elevation Profile • {hotspot.name} • Elevation {hotspot.elevationMsl}m MSL
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Interactive Depth Slider */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">Simulate Water Level:</span>
            <span className="font-mono text-base font-bold text-status-alert">{simDepth} cm</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={simDepth}
            onChange={(e) => setSimDepth(parseFloat(e.target.value))}
            className="flex-1 accent-purple cursor-pointer max-w-xs"
          />
          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
              simDepth > 30 ? 'bg-status-alert-soft text-status-alert' : 'bg-status-safe-soft text-status-safe'
            }`}
          >
            {simDepth > 30 ? 'SUBMERGED (NO PASS)' : simDepth > 15 ? 'HAZARDOUS (CAUTION)' : 'SAFE CLEARANCE'}
          </span>
        </div>

        {/* 2D SVG Cross-Section Profiler */}
        <div className="bg-canvas border border-border rounded-xl p-4 flex flex-col items-center">
          <svg viewBox="0 0 600 260" className="w-full h-56 select-none font-mono">
            {/* Background Sky / Atmospheric Grid */}
            <rect x="0" y="0" width="600" height="260" fill="#0d1117" rx="8" />
            <line x1="40" y1="40" x2="560" y2="40" stroke="#21262d" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="560" y2="80" stroke="#21262d" strokeDasharray="3 3" />
            <line x1="40" y1="120" x2="560" y2="120" stroke="#21262d" strokeDasharray="3 3" />
            <line x1="40" y1="160" x2="560" y2="160" stroke="#30363d" />

            {/* Natural Terrain Profile (The Sump Depression Bowl) */}
            {/* Left ridge at (40, 80), slope down to underpass floor (200, 160) to (400, 160), slope up to right ridge (560, 80) */}
            <polygon
              points="40,90 190,160 410,160 560,90 560,260 40,260"
              fill="#1f242c"
              stroke="#38444d"
              strokeWidth="2"
            />

            {/* Subterranean Box Culvert Drain beneath underpass */}
            <rect x="250" y="190" width="100" height="40" fill="#0b0e14" stroke="#6D4AFF" strokeWidth="1.5" />
            <text x="300" y="215" fill="#a5b4fc" fontSize="9" textAnchor="middle">
              BOX DRAIN {hotspot.upstreamNode.split(' ')[0]}
            </text>

            {/* Rising Flood Water Body */}
            {simDepth > 0 && (
              <polygon
                points={`
                  ${Math.max(40, 190 - (waterHeightPx * 150) / 70)},${waterY}
                  190,160
                  410,160
                  ${Math.min(560, 410 + (waterHeightPx * 150) / 70)},${waterY}
                `}
                fill="rgba(56, 189, 248, 0.45)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
            )}

            {/* Water Surface Line & Label */}
            {simDepth > 0 && (
              <g>
                <line
                  x1={Math.max(40, 190 - (waterHeightPx * 150) / 70)}
                  y1={waterY}
                  x2={Math.min(560, 410 + (waterHeightPx * 150) / 70)}
                  y2={waterY}
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle cx="300" cy={waterY} r="4" fill="#38bdf8" />
                <text x="300" y={waterY - 8} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  CURRENT WATER LEVEL ({simDepth} cm)
                </text>
              </g>
            )}

            {/* Road Surface Label */}
            <line x1="200" y1="160" x2="400" y2="160" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="300" y="176" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
              ROAD CARRIAGEWAY DECK ({hotspot.roadDeckMsl}m MSL)
            </text>

            {/* Elevation Scales (Left Side) */}
            <text x="35" y="93" fill="#64748b" fontSize="8" textAnchor="end">
              +6.5m MSL
            </text>
            <text x="35" y="163" fill="#64748b" fontSize="8" textAnchor="end">
              +3.6m MSL
            </text>
            <text x="35" y="213" fill="#64748b" fontSize="8" textAnchor="end">
              +1.2m MSL
            </text>

            {/* Critical Car Intake Threshold Line (25 cm) */}
            <line x1="160" y1="135" x2="440" y2="135" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
            <text x="445" y="138" fill="#f87171" fontSize="8">
              Critical Engine Ingress (25 cm)
            </text>
          </svg>
        </div>

        {/* Engineering Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2 rounded-lg bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Ground Elevation</span>
            <span className="font-bold text-ink text-sm">{hotspot.elevationMsl}m MSL</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Invert Drain Level</span>
            <span className="font-bold text-ink text-sm">{hotspot.invertLevelMsl}m MSL</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Hydraulic Head</span>
            <span className="font-bold text-purple text-sm">{(hotspot.elevationMsl - hotspot.invertLevelMsl).toFixed(1)}m</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Topographic Sump Deficit</span>
            <span className="font-bold text-status-alert text-sm">-2.8m</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">
          Data derived from MCGM LIDAR Digital Elevation Model (DEM 1m resolution)
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
        >
          Done
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 3: Subsurface Hydraulic Culvert Surcharge Tracer
// -------------------------------------------------------------
export function HydraulicCulvertTracerModal({ isOpen, onClose, hotspot }) {
  const [siltLevel, setSiltLevel] = useState(hotspot?.siltAccumulationPct || 70);
  const [jettingCrewDispatched, setJettingCrewDispatched] = useState(false);
  const { addCommandLog } = useFloodCommand();

  if (!isOpen || !hotspot) return null;

  const currentCapacityLoad = jettingCrewDispatched
    ? Math.max(75, hotspot.drainCapacityLoad - 45)
    : Math.round(hotspot.drainCapacityLoad + (siltLevel - 50) * 0.4);

  const handleDispatchJetting = () => {
    setJettingCrewDispatched(true);
    setSiltLevel(22);
    addCommandLog({
      officer: 'Drainage Hydraulics Desk',
      type: 'SUPER_SUCKER_DESILTING',
      details: `High-pressure jetting unit & vacuum super-sucker dispatched to ${hotspot.upstreamNode} at ${hotspot.name}. Silt load cleared from ${siltLevel}% to 22%.`,
      status: 'EXECUTING',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Subsurface Hydraulic Inundation &amp; Culvert Surcharge Tracer</h3>
            <p className="text-[11px] text-ink-secondary">
              Hydraulic node-to-outfall gradient modeling • {hotspot.upstreamNode}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Culvert Flow Diagram (Step Sequence) */}
        <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Subsurface Stormwater Flow Conveyance Path
          </span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            <div className="bg-surface border border-border rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] font-mono text-purple font-bold">1. SURFACE INFLOW</span>
              <div className="font-bold text-ink">Catchpit Grates</div>
              <div className="text-[11px] text-ink-secondary">Runoff Ingress: 4.8 m³/s</div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-status-safe-soft text-status-safe">
                OPEN GRATES
              </span>
            </div>

            <div className="bg-surface border border-status-alert/30 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] font-mono text-status-alert font-bold">2. CONDUIT NODE</span>
              <div className="font-bold text-ink">{hotspot.upstreamNode.split(' ')[0]}</div>
              <div className="text-[11px] text-ink-secondary">Hydraulic Load: {currentCapacityLoad}%</div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-status-alert-soft text-status-alert">
                {currentCapacityLoad > 100 ? 'SURCHARGED' : 'CLEAR FLOW'}
              </span>
            </div>

            <div className="bg-surface border border-border rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] font-mono text-purple font-bold">3. LATERAL BOX DRAIN</span>
              <div className="font-bold text-ink">3.5m x 2.2m RCC</div>
              <div className="text-[11px] text-ink-secondary">Silt Level: {siltLevel}%</div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-status-caution-soft text-status-caution">
                {siltLevel > 50 ? 'HEAVY SILT' : 'CLEARED'}
              </span>
            </div>

            <div className="bg-surface border border-border rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] font-mono text-purple font-bold">4. TIDAL OUTFALL</span>
              <div className="font-bold text-ink">{hotspot.downstreamOutfall.split(' -> ')[0]}</div>
              <div className="text-[11px] text-ink-secondary">Tidal Flap Sluice</div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-soft text-purple">
                HIGH TIDE SURGE
              </span>
            </div>
          </div>
        </div>

        {/* Silt Blockage Simulator Slider */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">Culvert Silt &amp; Debris Accumulation:</span>
            <span className="font-mono font-bold text-status-alert">{siltLevel}% Cross-Section Clogged</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            step="1"
            value={siltLevel}
            onChange={(e) => {
              setSiltLevel(parseInt(e.target.value));
              setJettingCrewDispatched(false);
            }}
            className="w-full accent-purple cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-secondary font-mono">
            <span>10% (Desilted Pristine)</span>
            <span>50% (Standard Monsoon Debris)</span>
            <span>95% (Critical Choke / Complete Blockage)</span>
          </div>
        </div>

        {/* Desilting Dispatch CTA */}
        {jettingCrewDispatched ? (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <div className="font-bold">Super-Sucker Tanker #SS-08 Dispatched</div>
                <div className="text-[11px]">Crews en route with high-pressure water jetting lances. Flow capacity restored.</div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-white/60 px-2 py-1 rounded">ETA 8 MIN</span>
          </div>
        ) : (
          <button
            onClick={handleDispatchJetting}
            className="w-full py-2.5 px-4 bg-purple text-white hover:bg-purple-deep rounded-xl font-bold flex items-center justify-center gap-2 shadow-subtle transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>Emergency Dispatch BMC Super-Sucker Vacuum Jetting Unit</span>
          </button>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Connected Outfall: {hotspot.downstreamOutfall}</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 4: Rapid Mobile Dewatering Pump Fleet Allocator
// -------------------------------------------------------------
export function MobilePumpFleetModal({ isOpen, onClose, hotspot }) {
  const { mobilePumpsList, dispatchMobilePump, addCommandLog } = useFloodCommand();
  const [assignedSquadId, setAssignedSquadId] = useState(mobilePumpsList[0]?.id || 'PUMP-SQUAD-01');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !hotspot) return null;

  const handleDispatch = () => {
    dispatchMobilePump(assignedSquadId, hotspot.name, hotspot.ward);
    addCommandLog({
      officer: 'Emergency Pump Logistics',
      type: 'PUMP_DISPATCH',
      details: `${assignedSquadId} (500HP Turbo) re-routed directly to hotspot: ${hotspot.name} (${hotspot.ward}).`,
      status: 'EN ROUTE',
    });
    setSuccessMsg(`Mobile Dewatering Unit ${assignedSquadId} successfully dispatched to ${hotspot.name}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Rapid Mobile Dewatering Pump Fleet Allocator</h3>
            <p className="text-[11px] text-ink-secondary">
              Deploy high-capacity mobile diesel pumps to target sump • {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Active Pump Fleet Status */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Municipal Mobile Dewatering Fleet (8 High-Output Units)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mobilePumpsList.map((pump) => {
              const isSelected = assignedSquadId === pump.id;
              const isHere = pump.location.includes(hotspot.shortName) || pump.location.includes(hotspot.name);
              return (
                <div
                  key={pump.id}
                  onClick={() => setAssignedSquadId(pump.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-soft/50 border-purple shadow-sm'
                      : 'bg-surface border-border hover:border-purple/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple text-xs">{pump.id}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isHere
                          ? 'bg-status-safe-soft text-status-safe'
                          : pump.status.includes('ACTIVE')
                          ? 'bg-status-caution-soft text-status-caution'
                          : 'bg-surface-secondary text-ink-secondary'
                      }`}
                    >
                      {isHere ? 'DEPLOYED ON SITE' : pump.status}
                    </span>
                  </div>
                  <div className="font-bold text-ink text-xs mt-1">{pump.name}</div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">Location: {pump.location}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-border">
                    <span className="text-ink-secondary">Capacity: {pump.capacity}</span>
                    <span className="text-ink font-bold">Fuel: {pump.fuel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action feedback */}
        {successMsg && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">
          Target Hotspot: <strong className="text-ink">{hotspot.shortName}</strong> ({hotspot.ward})
        </span>
        <button
          onClick={handleDispatch}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Dispatch Selected Dewatering Pump</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 5: Emergency Flood Barrier & Sandbag Deployment Simulator
// -------------------------------------------------------------
export function RapidBarrierSimulatorModal({ isOpen, onClose, hotspot }) {
  const { addBarrier, placedBarriers, addCommandLog } = useFloodCommand();
  const [barrierType, setBarrierType] = useState('tiger-dam');
  const [barrierUnits, setBarrierUnits] = useState(4);
  const [isDeployed, setIsDeployed] = useState(false);

  if (!isOpen || !hotspot) return null;

  const barrierConfigs = {
    'sandbag-3tier': { name: 'Heavy Jute Sandbags (3-Tier Dike)', heightCm: 45, mitigationCm: 14, deployTimeMin: 25 },
    'tiger-dam': { name: 'Inflatable Water Dam (Tiger Dam)', heightCm: 60, mitigationCm: 22, deployTimeMin: 15 },
    'aluminum-barrier': { name: 'Demountable Aluminum Flood Wall', heightCm: 90, mitigationCm: 28, deployTimeMin: 35 },
  };

  const activeConfig = barrierConfigs[barrierType];

  const handleDeployBarrier = () => {
    addBarrier({
      id: `bar-${Date.now()}`,
      name: `${activeConfig.name} at ${hotspot.shortName}`,
      coordinates: hotspot.coordinates,
      heightCm: activeConfig.heightCm,
      mitigationDeltaCm: -activeConfig.mitigationCm,
      deployedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      type: `${activeConfig.name} (${barrierUnits} modules)`,
    });
    addCommandLog({
      officer: 'Rapid Defense Engineering',
      type: 'FLOOD_BARRIER_DEPLOYMENT',
      details: `${activeConfig.name} installed across ingress ramp at ${hotspot.name}. Mitigation: -${activeConfig.mitigationCm}cm water depth reduction.`,
      status: 'DEPLOYED',
    });
    setIsDeployed(true);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Emergency Flood Barrier &amp; Sandbag Simulator</h3>
            <p className="text-[11px] text-ink-secondary">
              Virtual barrier perimeter deployment • Ingress mitigation for {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Barrier Selection */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Select Temporary Protective Perimeter Type
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'sandbag-3tier', name: 'Jute Sandbags (3-Tier)', height: '45 cm', mitigation: '-14 cm', time: '25 min' },
              { id: 'tiger-dam', name: 'Tiger Inflatable Dam', height: '60 cm', mitigation: '-22 cm', time: '15 min' },
              { id: 'aluminum-barrier', name: 'Aluminum Flood Wall', height: '90 cm', mitigation: '-28 cm', time: '35 min' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBarrierType(b.id);
                  setIsDeployed(false);
                }}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  barrierType === b.id
                    ? 'bg-purple-soft border-purple text-ink font-bold shadow-subtle'
                    : 'bg-surface border-border text-ink-secondary hover:text-ink'
                }`}
              >
                <div className="font-bold text-xs text-ink">{b.name}</div>
                <div className="text-[11px] text-purple font-mono mt-1">Height: {b.height}</div>
                <div className="text-[10px] text-status-safe font-mono mt-0.5">Mitigates: {b.mitigation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Impact Delta Comparison Card */}
        <div className="bg-surface-secondary border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <span className="text-[10px] text-ink-secondary uppercase block">Baseline Peak Depth</span>
            <span className="font-mono text-xl font-bold text-status-alert">{hotspot.predictedDepth} cm</span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted" />
          <div className="text-center flex-1">
            <span className="text-[10px] text-ink-secondary uppercase block">Perimeter Reduction</span>
            <span className="font-mono text-xl font-bold text-status-safe">-{activeConfig.mitigationCm} cm</span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted" />
          <div className="text-center flex-1 bg-surface border border-purple/30 rounded-lg p-2">
            <span className="text-[10px] text-purple font-bold uppercase block">Mitigated Sump Depth</span>
            <span className="font-mono text-xl font-bold text-purple">
              {Math.max(0, hotspot.predictedDepth - activeConfig.mitigationCm).toFixed(1)} cm
            </span>
          </div>
        </div>

        {isDeployed && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold">Virtual Barrier Placed on GIS Map</div>
              <div className="text-[11px]">
                {activeConfig.name} logged into Command Context. Map twin now renders temporary dike boundary.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">
          Estimated deployment crew: <strong>12 Disaster Management Personnel</strong>
        </span>
        <button
          onClick={handleDeployBarrier}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Deploy Virtual Barrier Now</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 6: Automated Traffic Diversion & Dynamic VMS Sign Override
// -------------------------------------------------------------
export function VmsTrafficDiversionModal({ isOpen, onClose, hotspot }) {
  const { vmsSigns, updateVmsSign, addCommandLog } = useFloodCommand();
  const [customText, setCustomText] = useState(hotspot?.diversionRoute?.vmsRecommendedText || '');
  const [broadcastDone, setBroadcastDone] = useState(false);

  useEffect(() => {
    if (hotspot?.diversionRoute?.vmsRecommendedText) {
      setCustomText(hotspot.diversionRoute.vmsRecommendedText);
      setBroadcastDone(false);
    }
  }, [hotspot]);

  if (!isOpen || !hotspot) return null;

  const targetVms = vmsSigns.find((v) => v.id === hotspot.diversionRoute.vmsId) || vmsSigns[0];

  const handleBroadcast = () => {
    updateVmsSign(targetVms.id, customText, 'OVERRIDDEN / ACTIVE HOTSPOT WARNING');
    addCommandLog({
      officer: 'Traffic Mobility Control',
      type: 'VMS_OVERRIDE_BROADCAST',
      details: `VMS Board [${targetVms.id}] updated with traffic diversion advisory for ${hotspot.name}: "${customText}"`,
      status: 'PUBLISHED',
    });
    setBroadcastDone(true);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Automated Traffic Diversion &amp; Dynamic VMS Sign Override</h3>
            <p className="text-[11px] text-ink-secondary">
              Arterial rerouting protocol • Highway Electronic Variable Message Boards
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Diversion Blueprint Card */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Recommended Traffic Diversion Route
          </span>
          <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
            <div className="font-bold text-ink text-sm">{hotspot.diversionRoute.corridorName}</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-ink-secondary block">Divert Traffic At:</span>
                <span className="font-semibold text-ink">{hotspot.diversionRoute.divertAt}</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Rejoin Arterial At:</span>
                <span className="font-semibold text-ink">{hotspot.diversionRoute.rejoinAt}</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Route Delta:</span>
                <span className="font-mono text-purple font-bold">+{hotspot.diversionRoute.distanceDeltaKm} km</span>
              </div>
              <div>
                <span className="text-ink-secondary block">Expected Delay:</span>
                <span className="font-mono text-status-caution font-bold">+{hotspot.diversionRoute.expectedDelayMin} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic VMS Board Simulator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
              Feeder VMS Sign Display ({targetVms.id} • {targetVms.name})
            </span>
            <span className="text-[10px] font-mono text-status-safe font-bold bg-status-safe-soft px-1.5 py-0.5 rounded">
              ONLINE
            </span>
          </div>

          {/* LED Matrix Screen Simulation */}
          <div className="bg-black border-4 border-neutral-800 rounded-xl p-4 font-mono text-amber-400 text-center font-bold tracking-widest text-sm shadow-inner min-h-[72px] flex items-center justify-center">
            {customText || 'NO ACTIVE OVERRIDE'}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-ink-secondary">Edit VMS Advisory Message (Max 80 chars):</label>
            <input
              type="text"
              maxLength={80}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value.toUpperCase());
                setBroadcastDone(false);
              }}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono text-ink focus:border-purple focus:outline-none"
            />
          </div>
        </div>

        {broadcastDone && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold">VMS Board Telemetry Overridden</div>
              <div className="text-[11px]">
                Electronic signboard updated. Highway Traffic Police notified of diversion routing.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Target Sign: {targetVms.location}</span>
        <button
          onClick={handleBroadcast}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Override to VMS Board</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 7: AI CCTV Vision & Ultrasonic Sensor Ground-Truth Cross-Check
// -------------------------------------------------------------
export function CctvAiVisionInspectorModal({ isOpen, onClose, hotspot }) {
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  if (!isOpen || !hotspot) return null;

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">AI CCTV Vision &amp; Sensor Ground-Truth Cross-Check</h3>
            <p className="text-[11px] text-ink-secondary">
              Camera: {hotspot.cctvName} ({hotspot.cctvId}) • Dual Verification
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* CCTV Viewport Simulation */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-neutral-800 shadow-elevated flex items-center justify-center">
          {/* Simulated Street Underpass Scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-sky-950/70" />

          {/* Underpass Concrete Bridge Structure */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-neutral-900 border-b-4 border-neutral-700 flex items-center justify-between px-4 text-[10px] text-neutral-400 font-mono">
            <span>MCGM SURVEILLANCE • {hotspot.cctvId}</span>
            <span className="flex items-center gap-1.5 text-red-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE 25 FPS
            </span>
          </div>

          {/* Water Surface Simulation */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-sky-900/80 to-transparent border-t border-sky-400/30" />

          {/* AI Bounding Boxes */}
          {showAiBoxes && (
            <>
              {/* Box 1: Stalled Auto */}
              <div className="absolute bottom-10 left-20 border-2 border-amber-400 bg-amber-400/10 rounded p-1 font-mono text-[9px] text-amber-300">
                <span className="font-bold">AUTO_RICKSHAW [CONF: 94%]</span>
                <div>DEPTH: ~18cm (WHEELS IMMERSED)</div>
              </div>

              {/* Box 2: Submerged Curb */}
              <div className="absolute bottom-6 right-28 border-2 border-red-500 bg-red-500/10 rounded p-1 font-mono text-[9px] text-red-300">
                <span className="font-bold">SUMP_WATER_SURFACE</span>
                <div>AI EST DEPTH: {hotspot.predictedDepth} cm</div>
              </div>

              {/* Box 3: Barricade */}
              <div className="absolute bottom-16 right-10 border-2 border-cyan-400 bg-cyan-400/10 rounded p-1 font-mono text-[9px] text-cyan-300">
                <span>POLICE_BARRICADE</span>
              </div>
            </>
          )}

          {/* Telemetry OSD Overlay (Bottom) */}
          <div className="absolute bottom-2 left-3 right-3 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-lg p-2 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <div>
              <span className="text-neutral-500 block text-[9px]">AI INFERENCE STATUS</span>
              <span className="text-status-alert font-bold">{hotspot.cctvStatus}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block text-[9px]">YOLOv8 FLOOD MODEL</span>
              <span className="text-purple font-bold">98.4% CONFIDENCE</span>
            </div>
          </div>
        </div>

        {/* Dual Verification Sensor vs Model Comparison */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Physical Sensor Telemetry</span>
            <div className="font-mono text-lg font-bold text-ink mt-0.5">{hotspot.sensorReading} cm</div>
            <div className="text-[10px] text-ink-secondary mt-1">{hotspot.sensorType}</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">AI CCTV Visual Gauge</span>
            <div className="font-mono text-lg font-bold text-purple mt-0.5">
              {(hotspot.sensorReading + 0.3).toFixed(1)} cm
            </div>
            <div className="text-[10px] text-status-safe font-mono mt-1">Ground-truth verified (+0.3cm)</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Hydrodynamic 1h Peak</span>
            <div className="font-mono text-lg font-bold text-status-alert mt-0.5">{hotspot.predictedDepth} cm</div>
            <div className="text-[10px] text-ink-secondary mt-1">Peak ETA: {hotspot.peakTime}</div>
          </div>
        </div>

        {snapshotTaken && (
          <div className="p-2.5 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>AI CCTV inspection frame archived into Municipal Evidence Log #EVD-992.</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <button
          onClick={() => setShowAiBoxes((prev) => !prev)}
          className="px-3 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-purple" />
          <span>{showAiBoxes ? 'Hide AI Bounding Overlays' : 'Show AI Bounding Overlays'}</span>
        </button>
        <button
          onClick={() => setSnapshotTaken(true)}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Snapshot to Traffic Police Dispatch</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 8: Vulnerable Demographics & Critical Asset Exposure Scanner
// -------------------------------------------------------------
export function VulnerableAssetExposureModal({ isOpen, onClose, hotspot }) {
  const [bufferRadius, setBufferRadius] = useState(500); // 250m, 500m, 1000m
  const [alertSent, setAlertSent] = useState(false);
  const { addCommandLog } = useFloodCommand();

  if (!isOpen || !hotspot) return null;

  const handleNotifyHospitals = () => {
    addCommandLog({
      officer: 'Public Health Contingency Desk',
      type: 'HOSPITAL_IMMERSION_WARNING',
      details: `Advance flood exposure advisory transmitted to medical centers near ${hotspot.name}: ${hotspot.exposure.hospitals.join(', ')}.`,
      status: 'TRANSMITTED',
    });
    setAlertSent(true);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Vulnerable Demographics &amp; Critical Asset Exposure Scanner</h3>
            <p className="text-[11px] text-ink-secondary">
              Exposure buffer analysis around {hotspot.name} • {hotspot.ward}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Buffer Switcher */}
        <div className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl p-3">
          <span className="font-bold text-ink">Geospatial Inundation Envelope Buffer:</span>
          <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
            {[250, 500, 1000].map((radius) => (
              <button
                key={radius}
                onClick={() => setBufferRadius(radius)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  bufferRadius === radius
                    ? 'bg-purple text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {radius}m Buffer
              </button>
            ))}
          </div>
        </div>

        {/* Demographics Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Total Pop in Envelope</span>
            <div className="font-mono text-lg font-bold text-ink mt-0.5">
              {Math.round(hotspot.populationAtRisk * (bufferRadius / 500)).toLocaleString()}
            </div>
            <div className="text-[10px] text-ink-secondary mt-0.5">Census Ward Projection</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Infants &amp; Elderly</span>
            <div className="font-mono text-lg font-bold text-status-alert mt-0.5">
              {Math.round(hotspot.exposure.infantsElderly * (bufferRadius / 500)).toLocaleString()}
            </div>
            <div className="text-[10px] text-status-alert font-mono mt-0.5">High evacuation priority</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Healthcare Centers</span>
            <div className="font-mono text-lg font-bold text-purple mt-0.5">{hotspot.exposure.hospitals.length}</div>
            <div className="text-[10px] text-ink-secondary mt-0.5">Critical ICUs &amp; Dialysis</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Substations at Risk</span>
            <div className="font-mono text-lg font-bold text-status-caution mt-0.5">
              {hotspot.exposure.substations.length}
            </div>
            <div className="text-[10px] text-ink-secondary mt-0.5">Ground transformer plinths</div>
          </div>
        </div>

        {/* Detailed Exposed Infrastructure List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-purple" />
              Hospitals &amp; Medical Facilities
            </span>
            <ul className="space-y-1.5">
              {hotspot.exposure.hospitals.map((h, i) => (
                <li key={i} className="p-2 rounded bg-surface border border-border flex items-center justify-between text-ink">
                  <span>{h}</span>
                  <span className="font-mono text-[10px] text-status-safe font-bold">POWER BACKUP OK</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple" />
              Substations &amp; Feeder Plinths
            </span>
            <ul className="space-y-1.5">
              {hotspot.exposure.substations.map((s, i) => (
                <li key={i} className="p-2 rounded bg-surface border border-border flex items-center justify-between text-ink">
                  <span>{s}</span>
                  <span className="font-mono text-[10px] text-status-caution font-bold">14cm CLEARANCE</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {alertSent && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Priority alert dispatched to nearby hospital disaster coordinators and ambulance depots.</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">MCGM Disaster Management GIS Layer</span>
        <button
          onClick={handleNotifyHospitals}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Dispatch Inundation Notice to Medical Facilities</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 9: Citizen SOS Incident Correlation & Heatmap Cluster
// -------------------------------------------------------------
export function CitizenSosClusterModal({ isOpen, onClose, hotspot }) {
  const { citizenReportsList, verifyCitizenReport, addCommandLog } = useFloodCommand();
  const [selectedSos, setSelectedSos] = useState(null);

  if (!isOpen || !hotspot) return null;

  // Filter or correlate reports around this ward/area
  const wardReports = citizenReportsList.filter(
    (rep) => rep.location.toLowerCase().includes(hotspot.shortName.toLowerCase()) || rep.ward === hotspot.ward
  );

  const displayReports = wardReports.length > 0 ? wardReports : citizenReportsList.slice(0, 3);

  const handleVerify = (repId) => {
    verifyCitizenReport(repId, 'VERIFIED / CREW DISPATCHED');
    addCommandLog({
      officer: 'Citizen Response Desk',
      type: 'CITIZEN_SOS_VERIFIED',
      details: `Citizen distress call [${repId}] near ${hotspot.name} verified by duty officer. Rescue squad notified.`,
      status: 'DISPATCHED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Citizen SOS Incident Correlation &amp; Cluster Inspector</h3>
            <p className="text-[11px] text-ink-secondary">
              Crowdsourced JalDrishti distress reports clustered near {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        <div className="bg-surface-secondary border border-border rounded-xl p-3 flex items-center justify-between">
          <span className="font-bold text-ink">Correlated SOS Alerts in 500m Radius:</span>
          <span className="font-mono text-xs font-bold text-status-alert bg-status-alert-soft px-2 py-0.5 rounded">
            {displayReports.length} Reports Logged
          </span>
        </div>

        <div className="space-y-2">
          {displayReports.map((rep) => (
            <div
              key={rep.id}
              className="p-3.5 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-purple text-xs">{rep.id}</span>
                  <span className="font-bold text-ink">{rep.type || 'Waterlogging Emergency'}</span>
                  <span className="text-[10px] font-mono text-ink-secondary font-semibold">({rep.timestamp || 'Recent'})</span>
                </div>
                <div className="text-ink-secondary text-[11px]">{rep.location} • Depth: {rep.depthCm || 20}cm</div>
                <div className="text-ink text-xs font-medium">"{rep.description || 'Water entering shops and stalling vehicles.'}"</div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                    rep.status?.includes('VERIFIED')
                      ? 'bg-status-safe-soft text-status-safe'
                      : 'bg-status-alert-soft text-status-alert'
                  }`}
                >
                  {rep.status || 'PENDING VERIFICATION'}
                </span>
                {!rep.status?.includes('VERIFIED') && (
                  <button
                    onClick={() => handleVerify(rep.id)}
                    className="px-3 py-1 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
                  >
                    Verify &amp; Dispatch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Direct Citizen Portal Sync (JalDrishti Integration)</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 10: Multi-Horizon Scenario Stress Tester
// -------------------------------------------------------------
export function StressTestScenarioModal({ isOpen, onClose, hotspot }) {
  const [rainRate, setRainRate] = useState(80);
  const [tideLevel, setTideLevel] = useState(4.2);
  const [pumpingPct, setPumpingPct] = useState(70);

  if (!isOpen || !hotspot) return null;

  // Dynamic stressed depth calculation
  const stressedDepth = Math.max(
    0,
    Math.round(
      hotspot.predictedDepth * (rainRate / 70) * (tideLevel / 3.8) * (1.2 - pumpingPct / 200) * 10
    ) / 10
  );

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Multi-Horizon Scenario Stress Tester</h3>
            <p className="text-[11px] text-ink-secondary">
              Dynamic rainfall &amp; tidal surge sensitivity modeling • {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Sliders */}
        <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-ink">Peak Convective Rainfall Rate:</span>
              <span className="font-mono font-bold text-purple">{rainRate} mm/hr</span>
            </div>
            <input
              type="range"
              min="30"
              max="160"
              step="5"
              value={rainRate}
              onChange={(e) => setRainRate(parseInt(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-ink">High Tide Surge Peak:</span>
              <span className="font-mono font-bold text-purple">{tideLevel.toFixed(2)} m MSL</span>
            </div>
            <input
              type="range"
              min="2.5"
              max="5.2"
              step="0.05"
              value={tideLevel}
              onChange={(e) => setTideLevel(parseFloat(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-ink">Available Dewatering Pumping Capacity:</span>
              <span className="font-mono font-bold text-purple">{pumpingPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={pumpingPct}
              onChange={(e) => setPumpingPct(parseInt(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
          </div>
        </div>

        {/* Stress Results Comparison */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border text-center">
            <span className="text-[10px] text-ink-secondary uppercase block">Normal Forecast Depth</span>
            <div className="font-mono text-xl font-bold text-ink mt-1">{hotspot.predictedDepth} cm</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-status-alert/40 text-center">
            <span className="text-[10px] text-status-alert font-bold uppercase block">Stressed Peak Inundation</span>
            <div className="font-mono text-2xl font-bold text-status-alert mt-0.5">{stressedDepth} cm</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border text-center">
            <span className="text-[10px] text-ink-secondary uppercase block">Time to Inundation Peak</span>
            <div className="font-mono text-xl font-bold text-purple mt-1">
              {rainRate > 100 ? '25 min' : '55 min'}
            </div>
          </div>
        </div>

        {/* Resilience Verdict */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            stressedDepth > 50
              ? 'bg-status-alert-soft border-status-alert/40 text-status-alert'
              : 'bg-status-caution-soft border-status-caution/40 text-status-caution'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold text-xs">
                {stressedDepth > 50 ? 'CATASTROPHIC FLOOD RISK' : 'SEVERE RESTRICTION REQUIRED'}
              </span>
              <div className="text-[11px]">
                {stressedDepth > 50
                  ? 'Water height exceeds vehicle roof lines. Absolute corridor shutdown and perimeter sandbags required.'
                  : 'Corridor closed for passenger vehicles. Emergency heavy trucks only.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Engine: EPA-SWMM 5.2 Hydrological Simulator</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
        >
          Accept Scenario
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 11: Evacuation Shelter & Rescue Route Pathfinder
// -------------------------------------------------------------
export function EvacuationRoutePathfinderModal({ isOpen, onClose, hotspot }) {
  const { updateShelterOccupancy, addCommandLog } = useFloodCommand();
  const [reservedCamp, setReservedCamp] = useState(null);

  if (!isOpen || !hotspot) return null;

  const handleReserve = (shelter) => {
    updateShelterOccupancy(shelter.name, 50);
    addCommandLog({
      officer: 'Evacuation Coordination Desk',
      type: 'SHELTER_CAPACITY_STAGED',
      details: `Staged 50 emergency relief beds at ${shelter.name} for evacuees from ${hotspot.name}.`,
      status: 'CONFIRMED',
    });
    setReservedCamp(shelter.name);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Evacuation Shelter &amp; Safe Rescue Route Pathfinder</h3>
            <p className="text-[11px] text-ink-secondary">
              Nearest high-ground relief camps &amp; dry pedestrian routes from {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Safe Walking Corridor Recommendation */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Optimal Dry Pedestrian Evacuation Corridor
          </span>
          <div className="p-3 bg-surface border border-border rounded-lg space-y-1.5">
            <div className="font-bold text-ink text-xs">High-Ground Ridge Path via Elevated Sidewalk</div>
            <div className="text-[11px] text-ink-secondary">
              Route avoids low sump basin; bypasses submerged node {hotspot.upstreamNode.split(' ')[0]} via 4.5m MSL ridge.
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-status-safe font-bold pt-1">
              <span>Zero Subway Crossings</span>
              <span>•</span>
              <span>Fully Illuminated</span>
              <span>•</span>
              <span>Dry Clearance &gt; 35cm</span>
            </div>
          </div>
        </div>

        {/* Nearby Shelters List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Nearest Municipal Relief Shelters
          </span>
          <div className="space-y-2">
            {hotspot.shelters.map((sh, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 shadow-subtle"
              >
                <div>
                  <div className="font-bold text-ink text-xs">{sh.name}</div>
                  <div className="text-[11px] text-ink-secondary">
                    Distance: <strong className="text-ink">{sh.distanceM}m</strong> • Available Beds:{' '}
                    <strong className="text-purple">{sh.availableBeds}</strong>
                  </div>
                  <div className="text-[10px] font-mono text-status-safe mt-0.5">
                    {sh.accessible ? 'Wheelchair & Stretcher Accessible' : 'Standard Stair Access'}
                  </div>
                </div>

                <button
                  onClick={() => handleReserve(sh)}
                  className="px-3 py-1.5 bg-surface border border-purple/40 text-purple font-semibold rounded-lg text-xs hover:bg-purple hover:text-white transition-colors"
                >
                  Stage 50 Beds
                </button>
              </div>
            ))}
          </div>
        </div>

        {reservedCamp && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Emergency staging notification sent to Ward Officer &amp; {reservedCamp} caretaker.</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Ward Disaster Management Cell</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
        >
          Done
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 12: Historical Inundation Analog Matcher & Trend Comparison
// -------------------------------------------------------------
export function HistoricalAnalogModal({ isOpen, onClose, hotspot }) {
  if (!isOpen || !hotspot) return null;

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Historical Inundation Analog Matcher &amp; Flood Trend Analyzer</h3>
            <p className="text-[11px] text-ink-secondary">
              Benchmark against historical deluge records at {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Historical Deluge Comparison Table */}
        <div className="border border-border rounded-xl overflow-hidden shadow-subtle">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-secondary text-[11px] text-ink-secondary font-mono border-b border-border">
              <tr>
                <th className="p-2.5">HISTORICAL FLOOD EVENT</th>
                <th className="p-2.5">24H RAIN</th>
                <th className="p-2.5">PEAK DEPTH</th>
                <th className="p-2.5">DURATION</th>
                <th className="p-2.5">HYDROLOGICAL SIMILARITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-xs">
              {hotspot.historicalPeaks.map((hist, idx) => (
                <tr key={idx} className="hover:bg-purple-soft/30 transition-colors">
                  <td className="p-2.5 font-bold text-ink">{hist.event}</td>
                  <td className="p-2.5 font-mono text-ink-secondary">{hist.rainfall24h}</td>
                  <td className="p-2.5 font-mono font-bold text-status-alert">{hist.peakDepth} cm</td>
                  <td className="p-2.5 font-mono text-ink-secondary">{hist.durationHrs} hrs</td>
                  <td className="p-2.5">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-surface border border-purple/30 text-purple">
                      {idx === 3 ? '89% Close Match' : idx === 2 ? '74% Match' : 'Extreme Outlier'}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-purple-soft/40 font-bold">
                <td className="p-2.5 text-purple font-mono">TODAY'S FORECAST EVENT</td>
                <td className="p-2.5 font-mono text-purple">180 mm (Est)</td>
                <td className="p-2.5 font-mono text-purple">{hotspot.predictedDepth} cm</td>
                <td className="p-2.5 font-mono text-purple">~4.5 hrs</td>
                <td className="p-2.5 font-mono text-purple">ACTIVE RUNNING</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Hydrological Insight */}
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Historical Trend &amp; Receding Pattern Insight
          </span>
          <p className="text-ink-secondary text-xs leading-relaxed">
            Historical telemetry proves that once peak rainfall subsides, {hotspot.name} recedes at an average rate of{' '}
            <strong className="text-ink">8.5 cm/hour</strong> under gravity flow alone, or{' '}
            <strong className="text-purple">16.2 cm/hour</strong> when auxiliary 500HP dewatering pumps operate in
            tandem with tidal sluice gates.
          </p>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">MCGM Hydrology Archives (2005–2025)</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
        >
          Close
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 13: Targeted Cell Broadcast & Marathi/English Multi-Channel Dispatcher
// -------------------------------------------------------------
export function CellBroadcastDispatcherModal({ isOpen, onClose, hotspot }) {
  const { publishAlert, addCommandLog } = useFloodCommand();
  const [language, setLanguage] = useState('both'); // en, mr, both
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen || !hotspot) return null;

  const englishAlert = `[MCGM ALERT] FLASH FLOODING AT ${hotspot.name.toUpperCase()} (${hotspot.predictedDepth}CM AT ${hotspot.peakTime}). ROAD IMPASSABLE FOR LIGHT VEHICLES. USE DIVERSION: ${hotspot.diversionRoute.corridorName.toUpperCase()}.`;
  const marathiAlert = `[मनपा इशारा] ${hotspot.name} येथे अतिवृष्टीमुळे पाण्याचा निचरा रोखला गेला असून ${hotspot.predictedDepth} सेमी पाणी साचले आहे. हलक्या वाहनांसाठी रस्ता बंद. कृपया पर्यायी मार्गाचा वापर करावा.`;

  const handleBroadcast = () => {
    publishAlert({
      id: `AL-HOT-${Date.now().toString().slice(-4)}`,
      title: `FLASH FLOOD EMERGENCY: ${hotspot.name.toUpperCase()}`,
      wards: [hotspot.ward],
      status: 'PUBLISHED - ACTIVE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      audienceReach: `${hotspot.populationAtRisk.toLocaleString()} citizens`,
      depthRange: `${hotspot.predictedDepth} cm`,
      channels: ['Cell Broadcast', 'JalDrishti App', 'SMS Gateway'],
    });

    addCommandLog({
      officer: 'Public Warning & Siren Desk',
      type: 'CELL_BROADCAST_TRANSMISSION',
      details: `Dispatched bilingual CAP emergency cell broadcast targeting cell towers around ${hotspot.name}. Estimated reach: ${hotspot.populationAtRisk.toLocaleString()} recipients.`,
      status: 'TRANSMITTED',
    });

    setBroadcastSent(true);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Targeted Cell Broadcast &amp; Multi-Channel Alert Dispatcher</h3>
            <p className="text-[11px] text-ink-secondary">
              CAP (Common Alerting Protocol) Geospatial Radio Broadcast • {hotspot.ward}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Language Switcher */}
        <div className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl p-3">
          <span className="font-bold text-ink">Broadcast Language Template:</span>
          <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border text-xs">
            {['en', 'mr', 'both'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
                  language === lang ? 'bg-purple text-white shadow-sm' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'mr' ? 'मराठी' : 'Bilingual'}
              </button>
            ))}
          </div>
        </div>

        {/* Message Previews */}
        <div className="space-y-3">
          {(language === 'en' || language === 'both') && (
            <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple uppercase">English SMS &amp; Cell Broadcast</span>
              <p className="font-mono text-xs text-ink bg-surface-secondary p-2.5 rounded-lg border border-border">
                {englishAlert}
              </p>
            </div>
          )}

          {(language === 'mr' || language === 'both') && (
            <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple uppercase">मराठी संदेश (Regional Broadcast)</span>
              <p className="font-sans text-xs text-ink bg-surface-secondary p-2.5 rounded-lg border border-border">
                {marathiAlert}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Estimated Cell Subscribers</span>
            <span className="font-bold text-purple text-sm">{hotspot.populationAtRisk.toLocaleString()} Phones</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Tower Sectors Activated</span>
            <span className="font-bold text-ink text-sm">6 Macro BTS Towers</span>
          </div>
        </div>

        {broadcastSent && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Emergency Broadcast authorized and pushed into Department of Telecommunications (DoT) Gateway!</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Authorized by Municipal Commissioner Protocol</span>
        <button
          onClick={handleBroadcast}
          className="px-4 py-2 bg-status-alert text-white hover:bg-status-alert/90 rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Authorize &amp; Transmit Emergency Siren</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 14: Hydrodynamic Silt & Debris Clog Mitigation Dispatcher
// -------------------------------------------------------------
export function SiltDredgingRequisitionModal({ isOpen, onClose, hotspot }) {
  const [ticketId, setTicketId] = useState(null);
  const { addCommandLog } = useFloodCommand();

  if (!isOpen || !hotspot) return null;

  const handleIssueTicket = () => {
    const generatedId = `WO-SILT-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedId);
    addCommandLog({
      officer: 'Drain Maintenance Depot',
      type: 'SILT_REMOVAL_REQUISITION',
      details: `Work Order [${generatedId}] created for emergency catchpit dredging & screen clearing at ${hotspot.name}. Assigned to BMC Quick Response Desilting Crew #4.`,
      status: 'APPROVED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Hydrodynamic Silt &amp; Debris Clog Mitigation Dispatcher</h3>
            <p className="text-[11px] text-ink-secondary">
              Emergency desilting work-order generator • {hotspot.upstreamNode}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Silt Depth</span>
            <span className="font-bold text-status-alert text-base mt-0.5">{hotspot.siltAccumulationPct}%</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Hydraulic Loss</span>
            <span className="font-bold text-ink text-base mt-0.5">-38% Flow</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Trash Screen State</span>
            <span className="font-bold text-status-caution text-base mt-0.5">CHOKED</span>
          </div>
        </div>

        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Scope of Emergency Silt Intervention
          </span>
          <ul className="space-y-1.5 text-xs text-ink-secondary list-disc pl-4">
            <li>Deploy 1x Super-Sucker High-Capacity Vacuum Tanker (Capacity 9,000L).</li>
            <li>Deploy 1x High-Pressure Hydraulic Water Jetting Lance (150 bar).</li>
            <li>Mechanical raking of trash screens at the mouth of {hotspot.downstreamOutfall.split(' -> ')[0]}.</li>
            <li>Clearing manhole access frames to prevent water stagnation in Ward {hotspot.ward}.</li>
          </ul>
        </div>

        {ticketId && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-bold">Work Order Requisition #{ticketId} Generated</div>
                <div className="text-[11px]">Dispatched to Ward Maintenance Depot. Contractor on alert.</div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-white/60 px-2 py-1 rounded">PRIORITY 1</span>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Stormwater Drains (SWD) Department</span>
        <button
          onClick={handleIssueTicket}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Issue Emergency Desilting Requisition</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 15: Power Grid & Substation Submersion Safeguard
// -------------------------------------------------------------
export function PowerGridTripSafeguardModal({ isOpen, onClose, hotspot }) {
  const [isTripped, setIsTripped] = useState(false);
  const { addCommandLog } = useFloodCommand();

  if (!isOpen || !hotspot) return null;

  const handleTripFeeder = () => {
    setIsTripped(true);
    addCommandLog({
      officer: 'Power Grid Safety Desk',
      type: 'ELECTRICAL_FEEDER_TRIP',
      details: `Emergency preemptive feeder cut executed for [${hotspot.transformerSubstation}] to prevent street water electrification at ${hotspot.name}. Essential hospital feeders isolated on auto-UPS.`,
      status: 'POWER_ISOLATED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-ink">Power Grid &amp; Substation Submersion Safeguard</h3>
            <p className="text-[11px] text-ink-secondary">
              Transformer plinth water-immersion safety interlock • {hotspot.transformerSubstation}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Substation Distance</span>
            <span className="font-bold text-ink text-base mt-0.5">{hotspot.substationDistanceM} meters</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Plinth Clearance</span>
            <span className="font-bold text-status-caution text-base mt-0.5">{hotspot.substationWaterClearanceCm} cm</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] text-ink-secondary uppercase block">Grid Protection</span>
            <span className={`font-bold text-base mt-0.5 ${isTripped ? 'text-status-safe' : 'text-amber-500'}`}>
              {isTripped ? 'SAFE (TRIPPED)' : 'ENERGIZED'}
            </span>
          </div>
        </div>

        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Public Safety &amp; Electrocution Risk Protocol
          </span>
          <p className="text-ink-secondary leading-relaxed">
            When flood depth reaches within <strong className="text-status-alert">10 cm</strong> of distribution
            transformer plinths or streetlight feeder pillars, automated SCADA trip isolation prevents fatal public
            electrocution in flooded carriageways.
          </p>
        </div>

        {isTripped && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold">Substation Remote Trip Executed</div>
              <div className="text-[11px]">
                Low-voltage circuit opened. Streetlights and feeder boxes in flooded zone de-energized. Hospital
                sub-lines safeguarded on generator loop.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Utility: BEST / Adani / MSEDCL SCADA Gateway</span>
        {!isTripped ? (
          <button
            onClick={handleTripFeeder}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Remote Feeder Plinth Trip</span>
          </button>
        ) : (
          <button
            onClick={() => setIsTripped(false)}
            className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary text-ink rounded-lg text-xs font-semibold transition-colors"
          >
            Reset Grid Interlock
          </button>
        )}
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 16: Inter-Agency Escalation & NDRF / SDRF Mobilization Requisition
// -------------------------------------------------------------
export function NdrfMobilizationModal({ isOpen, onClose, hotspot }) {
  const [boats, setBoats] = useState(4);
  const [personnel, setPersonnel] = useState(24);
  const [mobilized, setMobilized] = useState(false);
  const { addCommandLog } = useFloodCommand();

  if (!isOpen || !hotspot) return null;

  const handleMobilize = () => {
    setMobilized(true);
    addCommandLog({
      officer: 'NDRF Liaison Officer',
      type: 'NDRF_MOBILIZATION_ORDER',
      details: `Requisition order transmitted to NDRF 8th Battalion: ${boats} Inflatable Rescue Boats & ${personnel} Swiftwater Rescuers deployed to staging area at ${hotspot.name} (${hotspot.ward}).`,
      status: 'MOBILIZED',
    });
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="text-sm font-bold text-ink">Inter-Agency Escalation &amp; NDRF / SDRF Mobilization</h3>
            <p className="text-[11px] text-ink-secondary">
              National Disaster Response Force &amp; Military Aid to Civil Authority
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        <div className="bg-surface-secondary border border-border rounded-xl p-3.5 space-y-3">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Requested Rescue Assets for Hotspot Envelope ({hotspot.name})
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Inflatable Gemini Rescue Boats:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={boats}
                onChange={(e) => setBoats(parseInt(e.target.value) || 1)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 font-mono text-ink text-xs focus:border-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Swiftwater Rescue Personnel:</label>
              <input
                type="number"
                min="6"
                max="60"
                step="6"
                value={personnel}
                onChange={(e) => setPersonnel(parseInt(e.target.value) || 6)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 font-mono text-ink text-xs focus:border-purple focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-purple font-bold">STAGING DESTINATION</span>
          <div className="font-bold text-ink">{hotspot.name} Staging Base</div>
          <div className="text-[11px] text-ink-secondary">Coordinated with BMC Ward {hotspot.ward} Disaster Officer</div>
        </div>

        {mobilized && (
          <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl text-status-safe flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold">NDRF Battalion Requisition Form Sealed</div>
              <div className="text-[11px]">
                8th Bn NDRF Andheri Base alerted. Swiftwater Rescue Team dispatch timer initiated.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Section 34, Disaster Management Act 2005</span>
        <button
          onClick={handleMobilize}
          className="px-4 py-2 bg-status-alert text-white hover:bg-status-alert/90 rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Authorize Formal NDRF Mobilization Order</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 17: Custom Hotspot Geoprobe & New Vulnerability Injector
// -------------------------------------------------------------
export function CustomHotspotGeoprobeModal({ isOpen, onClose, onAddHotspot }) {
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward F/N');
  const [lng, setLng] = useState(72.85);
  const [lat, setLat] = useState(19.05);
  const [depth, setDepth] = useState(32);
  const [cause, setCause] = useState('Culvert Silt Surcharge + Surface Funneling');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHotspot = {
      id: `hotspot-${Date.now()}`,
      rank: '#NEW',
      name: name.trim(),
      shortName: name.trim().split(' ')[0],
      ward,
      zone: 'Zone Active',
      coordinates: [parseFloat(lng), parseFloat(lat)],
      predictedDepth: parseFloat(depth),
      currentDepth: 8.0,
      peakTime: '20:10 IST',
      probability: '88.5% (High)',
      severity: depth > 35 ? 'CRITICAL' : 'HIGH RISK',
      elevationMsl: 3.5,
      roadDeckMsl: 3.2,
      invertLevelMsl: 1.0,
      criticalDepthThreshold: 22.0,
      populationAtRisk: 32000,
      transitImpact: 'Traffic Stalled on Ingress Ramp',
      primaryCause: cause,
      secondaryCause: 'High Surface Imperviousness (90%)',
      accessibility: 'Restricted Transit',
      sensorId: `RAD-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      sensorType: 'Ultrasonic Ad-hoc Survey Node',
      sensorReading: 8.2,
      upstreamNode: 'D-CUSTOM-99',
      downstreamOutfall: 'Local Stormwater Drain Outfall',
      drainCapacityLoad: 135,
      siltAccumulationPct: 65,
      cctvId: 'CCTV-CUSTOM',
      cctvName: `${name} Survey Camera`,
      cctvStatus: 'AI DETECTING: Surface Ponding',
      transformerSubstation: 'Local Feeder Pillar',
      substationDistanceM: 80,
      substationWaterClearanceCm: 18,
      trajectory: {
        current: { depth: 8, label: '8 cm (Wet)', speed: '20 km/h', status: 'PASSABLE' },
        plus1h: { depth: parseFloat(depth), label: `${depth} cm (Severe Inundation)`, speed: '0 km/h', status: 'IMPASSABLE' },
        plus2h: { depth: Math.max(5, depth - 10), label: `${depth - 10} cm (Pumping)`, speed: '5 km/h', status: 'SLOW TRANSIT' },
        plus3h: { depth: 6, label: '6 cm (Clearing)', speed: '30 km/h', status: 'PASSABLE' },
      },
      causalChain: [
        { step: 1, title: 'Intense Downpour', metric: '70 mm/hr', desc: 'Convective cell over local catchment' },
        { step: 2, title: 'Dense Runoff', metric: '90% Impervious', desc: 'Heavy paved coverage' },
        { step: 3, title: 'Local Depression', metric: '3.5m MSL', desc: 'Natural topographic sump' },
        { step: 4, title: 'Drain Surcharge', metric: '135% Load', desc: cause },
        { step: 5, title: 'Surface Flooding', metric: `${depth} cm`, desc: 'Immediate municipal response needed' },
      ],
      exposure: {
        vulnerablePop: 2800,
        infantsElderly: 850,
        hospitals: ['Local Municipal Clinic'],
        schools: ['Ward Secondary School'],
        substations: ['Local Feeder Box'],
        transitHubs: ['Local Bus Stop'],
      },
      historicalPeaks: [
        { event: '26 July 2005 Deluge', peakDepth: 125, rainfall24h: '944 mm', durationHrs: 18 },
      ],
      diversionRoute: {
        corridorName: 'Adjacent Arterial Bypass',
        divertAt: 'Previous Crossroads',
        rejoinAt: 'Main Highway Link',
        vmsId: 'VMS-01',
        vmsRecommendedText: `${name.toUpperCase()} FLOODED (${depth}CM) - DIVERT TRAFFIC`,
        distanceDeltaKm: 1.5,
        expectedDelayMin: 10,
      },
      shelters: [
        { name: 'Ward Municipal School Relief Shelter', distanceM: 350, availableBeds: 150, accessible: true },
      ],
    };

    onAddHotspot(newHotspot);
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple" />
            <div>
              <h3 className="text-sm font-bold text-ink">Custom Hotspot Geoprobe &amp; Vulnerability Injector</h3>
              <p className="text-[11px] text-ink-secondary">
                Drop and track an ad-hoc flash flood pinpoint into the live command grid
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-ink-secondary block mb-1">Hotspot Name &amp; Junction Description:</label>
            <input
              type="text"
              required
              placeholder="e.g. Mankhurd Railway Subway or Sewri Crossroad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-ink text-xs focus:border-purple focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Municipal Ward:</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-ink text-xs focus:border-purple focus:outline-none"
              >
                <option value="Ward F/N">Ward F/North (Sion-Matunga)</option>
                <option value="Ward K/E">Ward K/East (Andheri East)</option>
                <option value="Ward L">Ward L (Kurla-LBS)</option>
                <option value="Ward G/N">Ward G/North (Dadar-Dharavi)</option>
                <option value="Ward H/W">Ward H/West (Bandra-Khar)</option>
                <option value="Ward S">Ward S (Bhandup-Kanjurmarg)</option>
                <option value="Ward M/E">Ward M/East (Govandi-Mankhurd)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Estimated Inundation Depth (cm):</label>
              <input
                type="number"
                min="5"
                max="100"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value) || 20)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-ink text-xs focus:border-purple focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Longitude (GIS Lng):</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-ink text-xs focus:border-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-ink-secondary block mb-1">Latitude (GIS Lat):</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-ink text-xs focus:border-purple focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-ink-secondary block mb-1">Primary Causal Bottleneck:</label>
            <input
              type="text"
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-ink text-xs focus:border-purple focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-surface border border-border hover:bg-surface-secondary text-ink rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Register Hotspot into Grid</span>
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 18: Automated SitRep (Situation Report) & Executive PDF Generator
// -------------------------------------------------------------
export function SitRepDossierModal({ isOpen, onClose, hotspot }) {
  if (!isOpen || !hotspot) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Automated Situation Report (SitRep) Dossier</h3>
            <p className="text-[11px] text-ink-secondary">
              Executive Municipal Incident Dossier • {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs font-sans print:p-0">
        {/* Printable Municipal Header */}
        <div className="border-b-2 border-ink pb-3 flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] text-ink-secondary font-bold tracking-widest block">
              MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM)
            </span>
            <h2 className="text-base font-bold text-ink mt-0.5">
              EMERGENCY SITUATION REPORT (SITREP) - HOTSPOT DOSSIER
            </h2>
            <div className="text-[11px] text-ink-secondary mt-0.5">
              Incident File: MCGM-FLOOD-{hotspot.id.toUpperCase()} • Generated:{' '}
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </div>
          </div>
          <span className="font-mono font-bold text-xs bg-status-alert-soft text-status-alert px-2.5 py-1 rounded border border-status-alert/30">
            {hotspot.severity}
          </span>
        </div>

        {/* Core Metrics Summary */}
        <div className="grid grid-cols-4 gap-2 font-mono text-center">
          <div className="p-2 border border-border rounded-lg bg-surface-secondary">
            <span className="text-[9px] text-ink-secondary uppercase block">Location</span>
            <span className="font-bold text-ink text-xs">{hotspot.shortName}</span>
          </div>
          <div className="p-2 border border-border rounded-lg bg-surface-secondary">
            <span className="text-[9px] text-ink-secondary uppercase block">Peak Depth</span>
            <span className="font-bold text-status-alert text-xs">{hotspot.predictedDepth} cm</span>
          </div>
          <div className="p-2 border border-border rounded-lg bg-surface-secondary">
            <span className="text-[9px] text-ink-secondary uppercase block">Peak Window</span>
            <span className="font-bold text-ink text-xs">{hotspot.peakTime}</span>
          </div>
          <div className="p-2 border border-border rounded-lg bg-surface-secondary">
            <span className="text-[9px] text-ink-secondary uppercase block">Pop Exposure</span>
            <span className="font-bold text-purple text-xs">{hotspot.populationAtRisk.toLocaleString()}</span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-3 space-y-1">
            <span className="font-bold text-xs text-ink block">1. Causal Hydrological Assessment</span>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              {hotspot.primaryCause}. Catchment runoff coefficient reaches 92% due to dense urban development.
              Subsurface stormwater node {hotspot.upstreamNode} is operating at {hotspot.drainCapacityLoad}% load with{' '}
              {hotspot.siltAccumulationPct}% silt accumulation. Outfall drainage throttled by tidal backflow.
            </p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <span className="font-bold text-xs text-ink block">2. Mobility &amp; Arterial Diversion</span>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Transit impact: {hotspot.transitImpact}. Traffic diverted to {hotspot.diversionRoute.corridorName} via{' '}
              {hotspot.diversionRoute.divertAt}. Electronic VMS Board {hotspot.diversionRoute.vmsId} broadcasting bypass text.
            </p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <span className="font-bold text-xs text-ink block">3. Commanding Officer Certification</span>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-ink-secondary">
                Certified by: <strong>Shift Commander, Disaster Management Control Room</strong>
              </span>
              <span className="font-mono text-[10px] text-status-safe font-bold bg-status-safe-soft px-2 py-0.5 rounded">
                DIGITALLY VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Official Document under MCGM Emergency Protocol</span>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export SitRep PDF</span>
        </button>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 19: Real-Time Audio Siren & Acoustic High-Risk Horn Trigger
// -------------------------------------------------------------
export function AudioEvacuationSirenModal({ isOpen, onClose, hotspot }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toneType, setToneType] = useState('wail'); // 'wail' | 'hi-lo' | 'pulse'
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  if (!isOpen || !hotspot) return null;

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = toneType === 'hi-lo' ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      if (toneType === 'wail') {
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.5);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 2.0);
      } else if (toneType === 'hi-lo') {
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.setValueAtTime(450, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(650, ctx.currentTime + 0.6);
        osc.frequency.setValueAtTime(450, ctx.currentTime + 0.9);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      setIsPlayingAudio(true);

      setTimeout(() => {
        setIsPlayingAudio(false);
        try {
          ctx.close();
        } catch {}
      }, 2300);
    } catch (e) {
      console.warn('Audio siren error', e);
    }
  };

  const stopSiren = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    setIsPlayingAudio(false);
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-status-alert" />
          <div>
            <h3 className="text-sm font-bold text-ink">Emergency Audio Siren &amp; Acoustic High-Risk Horn</h3>
            <p className="text-[11px] text-ink-secondary">
              Acoustic Public Warning Tone Synthesizer • {hotspot.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Tone Selection */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
            Select Emergency Horn Tone Profile
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'wail', name: 'Code Red Wail', desc: '440Hz -> 880Hz Sawtooth' },
              { id: 'hi-lo', name: 'Hi-Lo Evac Siren', desc: '650Hz / 450Hz Square' },
              { id: 'pulse', name: 'Sump Pulse Warning', desc: 'Intermittent 800Hz' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setToneType(t.id)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  toneType === t.id
                    ? 'bg-status-alert-soft border-status-alert/40 text-ink font-bold shadow-subtle'
                    : 'bg-surface border-border text-ink-secondary hover:text-ink'
                }`}
              >
                <div className="font-bold text-xs text-ink">{t.name}</div>
                <div className="text-[10px] text-ink-secondary font-mono mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Waveform Meter Animation */}
        <div className="bg-canvas border border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[96px]">
          <div className="flex items-end gap-1.5 h-12">
            {[20, 45, 80, 60, 95, 30, 75, 90, 50, 85, 35, 70].map((h, i) => (
              <div
                key={i}
                style={{ height: isPlayingAudio ? `${h}%` : '15%' }}
                className={`w-2.5 rounded-full transition-all duration-150 ${
                  isPlayingAudio ? 'bg-status-alert animate-pulse' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-ink-secondary mt-2">
            {isPlayingAudio ? 'AUDIO STREAM ACTIVE (SYNTHESIZED VIA WEB AUDIO API)' : 'SIREN INACTIVE (STANDBY)'}
          </span>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Target Public Address Sector: {hotspot.ward}</span>
        <div className="flex items-center gap-2">
          {isPlayingAudio ? (
            <button
              onClick={stopSiren}
              className="px-4 py-2 bg-surface border border-border hover:bg-surface-secondary text-ink rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <VolumeX className="w-3.5 h-3.5 text-status-alert" />
              <span>Stop Siren</span>
            </button>
          ) : (
            <button
              onClick={startSiren}
              className="px-4 py-2 bg-status-alert text-white hover:bg-status-alert/90 rounded-lg text-xs font-semibold shadow-subtle flex items-center gap-2 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Sound Emergency Evacuation Horn</span>
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// -------------------------------------------------------------
// FEATURE 20: Live Hotspot Telemetry CSV & GeoJSON Export Suite
// -------------------------------------------------------------
export function GisDataExportSuiteModal({ isOpen, onClose, hotspot, allHotspots }) {
  if (!isOpen || !hotspot) return null;

  const handleExportGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: allHotspots.map((h) => ({
        type: 'Feature',
        properties: {
          id: h.id,
          name: h.name,
          ward: h.ward,
          predictedDepthCm: h.predictedDepth,
          peakTime: h.peakTime,
          severity: h.severity,
          populationAtRisk: h.populationAtRisk,
          primaryCause: h.primaryCause,
          upstreamNode: h.upstreamNode,
          downstreamOutfall: h.downstreamOutfall,
        },
        geometry: {
          type: 'Point',
          coordinates: h.coordinates,
        },
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MCGM_Hotspots_GIS_${new Date().toISOString().slice(0, 10)}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportHourlyCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'TimeStep,HotspotName,DepthCm,Status,TransitSpeed\n' +
      `Current,"${hotspot.name}",${hotspot.trajectory.current.depth},${hotspot.trajectory.current.status},${hotspot.trajectory.current.speed}\n` +
      `+1 Hour,"${hotspot.name}",${hotspot.trajectory.plus1h.depth},${hotspot.trajectory.plus1h.status},${hotspot.trajectory.plus1h.speed}\n` +
      `+2 Hours,"${hotspot.name}",${hotspot.trajectory.plus2h.depth},${hotspot.trajectory.plus2h.status},${hotspot.trajectory.plus2h.speed}\n` +
      `+3 Hours,"${hotspot.name}",${hotspot.trajectory.plus3h.depth},${hotspot.trajectory.plus3h.status},${hotspot.trajectory.plus3h.speed}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${hotspot.shortName}_Inundation_Trajectory.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <ModalBackdrop onClose={onClose} maxWidth="max-w-xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-purple" />
          <div>
            <h3 className="text-sm font-bold text-ink">Live Hotspot Telemetry CSV &amp; GeoJSON Export Suite</h3>
            <p className="text-[11px] text-ink-secondary">
              ArcGIS / QGIS spatial layer export &amp; hydrology time series
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-border text-ink-secondary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-3 text-xs">
        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
          <div className="font-bold text-ink">1. Complete Hotspot Grid GeoJSON Layer</div>
          <p className="text-ink-secondary text-[11px]">
            Contains geometry coordinates, hydraulic properties, and causal tags for all 10 active metropolitan hotspots.
          </p>
          <button
            onClick={handleExportGeoJson}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Hotspots GeoJSON (QGIS / ArcGIS)</span>
          </button>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
          <div className="font-bold text-ink">2. {hotspot.name} Hourly Hydrograph CSV</div>
          <p className="text-ink-secondary text-[11px]">
            Inundation depth, transit status, and estimated road speed across current and +3 hour horizon.
          </p>
          <button
            onClick={handleExportHourlyCsv}
            className="px-3 py-1.5 bg-surface border border-border hover:bg-surface-secondary text-ink rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Hourly Trajectory CSV</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 border-t border-border bg-surface-secondary flex items-center justify-between">
        <span className="text-xs text-ink-secondary">Spatial Reference: WGS 84 / EPSG:4326</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold shadow-subtle transition-colors"
        >
          Done
        </button>
      </div>
    </ModalBackdrop>
  );
}

