import React, { useState, useEffect, useRef } from 'react';
import {
  Crosshair,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { PRODUCT_PALETTES, AWS_STATIONS, CRITICAL_INFRA_PINS } from './radarConstants';
export { PRODUCT_PALETTES, AWS_STATIONS, CRITICAL_INFRA_PINS };


export default function NowcastRadarCanvas({
  radarProduct = 'reflectivity',
  selectedCell,
  onSelectCell,
  nowcastMinutes = 0,
  maxRangeKm = 100,
  elevationAngle = 0.5,
  isSweeping = true,
  sweepSpeed = 1,
  clutterFilterEnabled = true,
  showIsohyets = false,
  showAwsStations = true,
  showCriticalInfra = true,
  showLightning = false,
  showRivers = true,
  showTrecGrid = false,
  customCells = [],
  onProbePoint,
  rhiCutAzimuth = null,
}) {
  const [sweepAngle, setSweepAngle] = useState(42);
  const [hoverCoord, setHoverCoord] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);

  // Sweep rotation animation frame
  useEffect(() => {
    if (!isSweeping) return;
    let animationFrameId;
    let lastTime = performance.now();

    const animateSweep = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setSweepAngle((prev) => (prev + delta * 36 * sweepSpeed) % 360);
      animationFrameId = requestAnimationFrame(animateSweep);
    };

    animationFrameId = requestAnimationFrame(animateSweep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSweeping, sweepSpeed]);

  // Combine default and custom injected cells
  const allCells = [
    {
      id: 'C-01',
      name: 'Convective Cell Alpha',
      dbz: 58,
      intensity: 88,
      velocityKm: 18.2,
      headingDeg: 42,
      headingText: 'NE @ 18.2 km/h',
      baseX: 280,
      baseY: 210,
      radius: 6.5,
      vil: 48,
      zdr: 2.8,
      kdp: 3.6,
      topKm: 13.8,
      isSimulated: false,
    },
    {
      id: 'C-02',
      name: 'Convective Cell Beta',
      dbz: 62,
      intensity: 94,
      velocityKm: 19.0,
      headingDeg: 38,
      headingText: 'NE @ 19.0 km/h',
      baseX: 210,
      baseY: 300,
      radius: 8.0,
      vil: 54,
      zdr: 3.2,
      kdp: 4.4,
      topKm: 14.5,
      isSimulated: false,
    },
    {
      id: 'C-03',
      name: 'Trailing Band Gamma',
      dbz: 46,
      intensity: 52,
      velocityKm: 14.5,
      headingDeg: 85,
      headingText: 'E @ 14.5 km/h',
      baseX: 330,
      baseY: 160,
      radius: 5.0,
      vil: 32,
      zdr: 1.8,
      kdp: 1.9,
      topKm: 10.2,
      isSimulated: false,
    },
    {
      id: 'C-04',
      name: 'Southern Coastal Cell',
      dbz: 51,
      intensity: 64,
      velocityKm: 21.0,
      headingDeg: 45,
      headingText: 'NE @ 21.0 km/h',
      baseX: 180,
      baseY: 330,
      radius: 7.2,
      vil: 39,
      zdr: 2.3,
      kdp: 2.7,
      topKm: 12.1,
      isSimulated: false,
    },
    ...customCells,
  ];

  // Dynamic cell extrapolation based on nowcastMinutes
  // Heading in degrees (0 is North, 90 is East)
  const extrapolatedCells = allCells.map((cell) => {
    const headingRad = (cell.headingDeg * Math.PI) / 180;
    // Map scale: 230px radius = maxRangeKm (100km). 2.3 px per km.
    const pxPerKm = 230 / maxRangeKm;
    const distanceKmTraveled = (cell.velocityKm * nowcastMinutes) / 60;
    const dx = Math.sin(headingRad) * distanceKmTraveled * pxPerKm;
    const dy = -Math.cos(headingRad) * distanceKmTraveled * pxPerKm;

    // Intensity evolution over 0-180m: peak at ~50-60m, gradual decay
    const evolutionFactor = 1 + Math.sin((nowcastMinutes / 180) * Math.PI) * 0.45;
    const currentDbz = Math.min(72, Math.max(25, Math.round(cell.dbz * (nowcastMinutes === 0 ? 1 : 0.85 + 0.35 * Math.sin((nowcastMinutes / 120) * Math.PI)))));
    const currentIntensity = Math.min(140, Math.max(10, Math.round(cell.intensity * evolutionFactor)));

    return {
      ...cell,
      cx: cell.baseX + dx,
      cy: cell.baseY + dy,
      currentDbz,
      currentIntensity,
      currentRadius: cell.radius * 4.5 * (1 + (evolutionFactor - 1) * 0.3),
    };
  });

  // Handle probe point on canvas click or hover
  const handleSvgInteraction = (e, isClick = false) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert to 500x500 viewBox space
    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;
    const svgX = (clientX * scaleX - panOffset.x) / zoomLevel;
    const svgY = (clientY * scaleY - panOffset.y) / zoomLevel;

    // Distance from center (250, 250)
    const dx = svgX - 250;
    const dy = svgY - 250;
    const pixelDist = Math.sqrt(dx * dx + dy * dy);
    const distanceKm = (pixelDist / 230) * maxRangeKm;

    // Azimuth (0° is North, 90° is East)
    let azimuthDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (azimuthDeg < 0) azimuthDeg += 360;

    // Radar beam height at distance: H = r * sin(theta) + r^2 / (2 * 4/3 * Re)
    const thetaRad = (elevationAngle * Math.PI) / 180;
    const beamHeightKm = distanceKm * Math.sin(thetaRad) + (distanceKm * distanceKm) / (2 * 8495);

    // Approximate Mumbai Lat/Lon from Colaba (18.89 N, 72.81 E)
    const lat = 18.89 + (-dy / 230) * 0.45;
    const lon = 72.81 + (dx / 230) * 0.45;

    // Estimate local reflectivity based on proximity to active cells
    let localDbz = 12;
    extrapolatedCells.forEach((c) => {
      const cDist = Math.sqrt((svgX - c.cx) ** 2 + (svgY - c.cy) ** 2);
      if (cDist < c.currentRadius * 1.6) {
        const influence = 1 - cDist / (c.currentRadius * 1.6);
        localDbz = Math.max(localDbz, Math.round(c.currentDbz * influence));
      }
    });

    // Marshall-Palmer Z = 200 * R^1.6 => R = (10^(Z/10) / 200)^(1/1.6)
    const Z_linear = Math.pow(10, localDbz / 10);
    const rainRateMmHr = localDbz < 15 ? 0 : Math.round(Math.pow(Z_linear / 200, 1 / 1.6) * 10) / 10;

    const probeData = {
      svgX: Math.round(svgX),
      svgY: Math.round(svgY),
      distanceKm: Math.round(distanceKm * 10) / 10,
      azimuthDeg: Math.round(azimuthDeg * 10) / 10,
      beamHeightKm: Math.round(beamHeightKm * 100) / 100,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      dbz: localDbz,
      rainRateMmHr,
    };

    setHoverCoord(probeData);
    if (isClick && onProbePoint) {
      onProbePoint(probeData);
    }
  };

  // Pan interaction
  const handleMouseDown = (e) => {
    if (e.button === 0 && e.shiftKey) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else {
      handleSvgInteraction(e, false);
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Cell product fill helper
  const getCellFill = (cell) => {
    if (radarProduct === 'reflectivity') {
      if (cell.currentDbz >= 60) return '#E74C3C';
      if (cell.currentDbz >= 50) return '#E67E22';
      if (cell.currentDbz >= 40) return '#F1C40F';
      return '#2ECC71';
    }
    if (radarProduct === 'intensity') {
      if (cell.currentIntensity >= 85) return '#C0392B';
      if (cell.currentIntensity >= 50) return '#D35400';
      if (cell.currentIntensity >= 25) return '#F39C12';
      return '#27AE60';
    }
    if (radarProduct === 'zdr') {
      if (cell.zdr >= 3.0) return '#E67E22';
      if (cell.zdr >= 1.5) return '#2ECC71';
      return '#7F8C8D';
    }
    if (radarProduct === 'kdp') {
      if (cell.kdp >= 3.5) return '#8E44AD';
      if (cell.kdp >= 2.0) return '#F1C40F';
      return '#3498DB';
    }
    if (radarProduct === 'vil') {
      if (cell.vil >= 50) return '#C0392B';
      if (cell.vil >= 30) return '#F39C12';
      return '#16A085';
    }
    return '#E74C3C';
  };

  return (
    <div className="bg-[#1D1A25] border border-border rounded-xl p-4 shadow-subtle relative flex flex-col items-center justify-center min-h-[520px] select-none overflow-hidden group">
      {/* Top Floating Controls Strip */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="text-[10px] font-mono text-[#AFA9C2] bg-black/60 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-purple animate-pulse" />
            <span>IMD COLABA S-BAND (3.0 GHz)</span>
            <span className="text-white/30">|</span>
            <span className="text-status-safe font-bold">{maxRangeKm}km RANGE</span>
            <span className="text-white/30">|</span>
            <span className="text-[#EDE8FF]">{elevationAngle.toFixed(1)}° PPI TILT</span>
          </div>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-white/10 text-white text-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <span className="font-mono text-[10px] text-purple-soft font-bold px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors text-ink-muted hover:text-white"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main SVG Radar Canvas */}
      <div
        className="w-full flex items-center justify-center cursor-crosshair overflow-hidden"
        onMouseLeave={() => setHoverCoord(null)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full max-w-[500px] h-auto transition-transform"
          onClick={(e) => handleSvgInteraction(e, true)}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Atmospheric Core Gradient */}
            <radialGradient id="stormCellRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#E74C3C" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#F1C40F" stopOpacity="0.6" />
              <stop offset="90%" stopColor="#2ECC71" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3498DB" stopOpacity="0.0" />
            </radialGradient>

            {/* Sweep Radial Sector Fade */}
            <radialGradient id="sweepTrailGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#6D4AFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
            </radialGradient>

            {/* Clutter Mask Pattern */}
            <pattern id="clutterNoise" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill="#4F4763" opacity="0.35" />
            </pattern>
          </defs>

          {/* Deep Space Background / Radar Screen Horizon */}
          <circle cx="250" cy="250" r="236" fill="#14111B" />

          {/* Concentric Range Rings */}
          <circle cx="250" cy="250" r="57.5" fill="none" stroke="#2F293E" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="250" cy="250" r="115" fill="none" stroke="#3D374D" strokeWidth="1.2" />
          <circle cx="250" cy="250" r="172.5" fill="none" stroke="#2F293E" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="250" cy="250" r="230" fill="none" stroke="#6D4AFF" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Azimuth Ray Crosshairs (Every 30 degrees) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = 250 + 230 * Math.sin(rad);
            const y2 = 250 - 230 * Math.cos(rad);
            const isMajor = deg % 90 === 0;
            return (
              <g key={deg}>
                <line
                  x1="250"
                  y1="250"
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#4F4763' : '#2A2536'}
                  strokeWidth={isMajor ? '1' : '0.6'}
                  strokeDasharray={isMajor ? 'none' : '2 3'}
                />
                {/* Azimuth Degrees Label on Ring Perimeter */}
                <text
                  x={250 + 242 * Math.sin(rad)}
                  y={250 - 242 * Math.cos(rad)}
                  fill="#78708C"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {deg}°
                </text>
              </g>
            );
          })}

          {/* Range Labels along 045° Radial */}
          <text x="295" y="215" fill="#88819C" fontSize="8" fontFamily="monospace">
            {Math.round(maxRangeKm * 0.25)}km
          </text>
          <text x="335" y="175" fill="#88819C" fontSize="8" fontFamily="monospace">
            {Math.round(maxRangeKm * 0.5)}km
          </text>
          <text x="375" y="135" fill="#88819C" fontSize="8" fontFamily="monospace">
            {Math.round(maxRangeKm * 0.75)}km
          </text>
          <text x="415" y="95" fill="#6D4AFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {maxRangeKm}km
          </text>

          {/* Mumbai Shoreline & Island City Coastline Skeleton Reference */}
          <path
            d="M 210,70 Q 235,160 250,210 T 270,260 T 265,310 T 255,360 T 250,420"
            fill="none"
            stroke="#5C5374"
            strokeWidth="2"
            strokeDasharray="5 2"
          />
          {/* Thane Creek & Harbor Basin */}
          <path
            d="M 260,270 Q 300,240 320,180 T 330,120"
            fill="none"
            stroke="#3F3950"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />

          {/* Mithi River & Major Catchment Channels */}
          {showRivers && (
            <g id="river-basins">
              {/* Mithi River Channel (Vihar Lake -> BKC -> Mahim Bay) */}
              <path
                d="M 305,155 Q 295,175 285,190 T 265,208"
                fill="none"
                stroke="#3498DB"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
              <text x="292" y="180" fill="#3498DB" fontSize="7" fontFamily="monospace" fontWeight="bold">
                Mithi River
              </text>
              {/* Poisar River */}
              <path d="M 285,120 Q 260,135 245,140" fill="none" stroke="#2980B9" strokeWidth="1.5" strokeOpacity="0.7" />
              {/* Dahisar River */}
              <path d="M 290,95 Q 270,105 250,110" fill="none" stroke="#2980B9" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>
          )}

          {/* Clutter Suppression Mask (if active, shows filtered ground zones) */}
          {clutterFilterEnabled && (
            <g id="clutter-mask" opacity="0.4">
              {/* Trombay Hills Clutter Shadow Notch */}
              <polygon points="250,250 310,210 325,235" fill="url(#clutterNoise)" stroke="#6D4AFF" strokeWidth="0.5" strokeDasharray="2 2" />
              {/* Malabar Hill Clutter Notch */}
              <circle cx="240" cy="270" r="14" fill="url(#clutterNoise)" stroke="#6D4AFF" strokeWidth="0.5" />
            </g>
          )}

          {/* Isohyet Accumulation Contours (if active) */}
          {showIsohyets && (
            <g id="isohyet-contours">
              <ellipse cx="270" cy="190" rx="65" ry="45" fill="#3498DB" fillOpacity="0.1" stroke="#3498DB" strokeWidth="1" strokeDasharray="3 3" />
              <text x="315" y="185" fill="#3498DB" fontSize="7" fontFamily="monospace">25mm</text>
              <ellipse cx="275" cy="195" rx="42" ry="30" fill="#F1C40F" fillOpacity="0.12" stroke="#F1C40F" strokeWidth="1.2" />
              <text x="298" y="195" fill="#F1C40F" fontSize="7" fontFamily="monospace">50mm</text>
              <circle cx="282" cy="198" r="18" fill="#E74C3C" fillOpacity="0.2" stroke="#E74C3C" strokeWidth="1.5" />
              <text x="282" y="198" fill="#E74C3C" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">100mm+</text>
            </g>
          )}

          {/* TREC Advection Grid Vectors (if active) */}
          {showTrecGrid && (
            <g id="trec-grid" opacity="0.6">
              {[150, 200, 250, 300, 350].map((gx) =>
                [150, 200, 250, 300, 350].map((gy) => {
                  const dist = Math.sqrt((gx - 250) ** 2 + (gy - 250) ** 2);
                  if (dist > 220) return null;
                  return (
                    <g key={`${gx}-${gy}`}>
                      <line x1={gx} y1={gy} x2={gx + 12} y2={gy - 10} stroke="#AFA9C2" strokeWidth="1" strokeLinecap="round" />
                      <circle cx={gx} cy={gy} r="1.5" fill="#AFA9C2" />
                    </g>
                  );
                })
              )}
            </g>
          )}

          {/* Convective Storm Cells Rendering with Extrapolated Positions */}
          {extrapolatedCells.map((cell) => {
            const isSelected = selectedCell && selectedCell.id === cell.id;
            const fillColor = getCellFill(cell);

            return (
              <g
                key={cell.id}
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCell(cell);
                }}
              >
                {/* Projected Trajectory Path (0 to 180 min dotted line) */}
                <line
                  x1={cell.baseX}
                  y1={cell.baseY}
                  x2={cell.baseX + Math.sin((cell.headingDeg * Math.PI) / 180) * 120}
                  y2={cell.baseY - Math.cos((cell.headingDeg * Math.PI) / 180) * 120}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  strokeOpacity="0.4"
                />

                {/* Storm Cell Body Outer Ring & Glow */}
                <circle
                  cx={cell.cx}
                  cy={cell.cy}
                  r={cell.currentRadius * 1.5}
                  fill={fillColor}
                  fillOpacity="0.3"
                  className={isSelected ? 'animate-pulse' : ''}
                />
                {/* Core Density */}
                <circle
                  cx={cell.cx}
                  cy={cell.cy}
                  r={cell.currentRadius}
                  fill={fillColor}
                  fillOpacity="0.75"
                />
                {/* Cell Center Kernel */}
                <circle cx={cell.cx} cy={cell.cy} r="3" fill="#FFFFFF" />

                {/* Velocity Vector Arrow */}
                <line
                  x1={cell.cx}
                  y1={cell.cy}
                  x2={cell.cx + Math.sin((cell.headingDeg * Math.PI) / 180) * 32}
                  y2={cell.cy - Math.cos((cell.headingDeg * Math.PI) / 180) * 32}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Active Selection Reticle */}
                {isSelected && (
                  <g>
                    <circle
                      cx={cell.cx}
                      cy={cell.cy}
                      r={cell.currentRadius + 14}
                      fill="none"
                      stroke="#EDE8FF"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                    <rect
                      x={cell.cx - 2}
                      y={cell.cy - (cell.currentRadius + 18)}
                      width="4"
                      height="8"
                      fill="#6D4AFF"
                    />
                    <rect
                      x={cell.cx - 2}
                      y={cell.cy + (cell.currentRadius + 10)}
                      width="4"
                      height="8"
                      fill="#6D4AFF"
                    />
                    <rect
                      x={cell.cx - (cell.currentRadius + 18)}
                      y={cell.cy - 2}
                      width="8"
                      height="4"
                      fill="#6D4AFF"
                    />
                    <rect
                      x={cell.cx + (cell.currentRadius + 10)}
                      y={cell.cy - 2}
                      width="8"
                      height="4"
                      fill="#6D4AFF"
                    />
                  </g>
                )}

                {/* Storm Tag Label */}
                <g transform={`translate(${cell.cx + 10}, ${cell.cy - 12})`}>
                  <rect
                    x="0"
                    y="0"
                    width="78"
                    height="24"
                    rx="4"
                    fill="#1D1A25"
                    fillOpacity="0.9"
                    stroke={isSelected ? '#6D4AFF' : '#4F4763'}
                    strokeWidth={isSelected ? '1.5' : '0.8'}
                  />
                  <text x="6" y="10" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    {cell.id} • {cell.currentDbz} dBZ
                  </text>
                  <text x="6" y="19" fill="#AFA9C2" fontSize="7" fontFamily="monospace">
                    {cell.currentIntensity} mm/h ({cell.velocityKm}km/h)
                  </text>
                </g>
              </g>
            );
          })}

          {/* AWS Weather Station Markers */}
          {showAwsStations &&
            AWS_STATIONS.map((aws) => (
              <g key={aws.id} className="cursor-pointer" transform={`translate(${aws.x}, ${aws.y})`}>
                <circle cx="0" cy="0" r="4" fill="#3B8F67" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="0" cy="0" r="7" fill="none" stroke="#3B8F67" strokeWidth="0.8" opacity="0.6" />
                <text x="6" y="3" fill="#D6D2E6" fontSize="7" fontFamily="monospace">
                  {aws.name.split(' ')[0]} ({aws.rate}mm)
                </text>
              </g>
            ))}

          {/* Critical Infrastructure Markers */}
          {showCriticalInfra &&
            CRITICAL_INFRA_PINS.map((infra) => (
              <g key={infra.id} className="cursor-pointer" transform={`translate(${infra.x}, ${infra.y})`}>
                <polygon points="0,-5 5,4 -5,4" fill="#C58A25" stroke="#FFFFFF" strokeWidth="0.8" />
                <text x="7" y="3" fill="#EAE7F0" fontSize="7" fontFamily="monospace">
                  {infra.name.split(' ')[0]}
                </text>
              </g>
            ))}

          {/* Lightning Flash Sensors (if active) */}
          {showLightning && (
            <g id="lightning-strikes">
              {[
                { x: 275, y: 198 },
                { x: 288, y: 205 },
                { x: 260, y: 185 },
                { x: 310, y: 168 },
              ].map((pt, i) => (
                <g key={i} transform={`translate(${pt.x}, ${pt.y})`} className="animate-ping">
                  <polygon points="0,-7 3,-1 1,-1 3,6 -2,1 0,1" fill="#F1C40F" />
                </g>
              ))}
            </g>
          )}

          {/* RHI Vertical Slicing Cut Ray (if selected) */}
          {rhiCutAzimuth !== null && (
            <g id="rhi-cut-ray">
              <line
                x1="250"
                y1="250"
                x2={250 + 230 * Math.sin((rhiCutAzimuth * Math.PI) / 180)}
                y2={250 - 230 * Math.cos((rhiCutAzimuth * Math.PI) / 180)}
                stroke="#E74C3C"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle
                cx={250 + 230 * Math.sin((rhiCutAzimuth * Math.PI) / 180)}
                cy={250 - 230 * Math.cos((rhiCutAzimuth * Math.PI) / 180)}
                r="4"
                fill="#E74C3C"
              />
              <text
                x={250 + 215 * Math.sin((rhiCutAzimuth * Math.PI) / 180)}
                y={250 - 215 * Math.cos((rhiCutAzimuth * Math.PI) / 180)}
                fill="#E74C3C"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RHI CUT ({rhiCutAzimuth}°)
              </text>
            </g>
          )}

          {/* Real-time Rotating Sweep Line */}
          {isSweeping && (
            <g id="doppler-sweep-beam">
              <line
                x1="250"
                y1="250"
                x2={250 + 230 * Math.sin((sweepAngle * Math.PI) / 180)}
                y2={250 - 230 * Math.cos((sweepAngle * Math.PI) / 180)}
                stroke="#6D4AFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.9"
              />
              {/* Trailing sweep wedge */}
              <path
                d={`M 250,250 L ${250 + 230 * Math.sin(((sweepAngle - 25) * Math.PI) / 180)},${
                  250 - 230 * Math.cos(((sweepAngle - 25) * Math.PI) / 180)
                } A 230,230 0 0,1 ${250 + 230 * Math.sin((sweepAngle * Math.PI) / 180)},${
                  250 - 230 * Math.cos((sweepAngle * Math.PI) / 180)
                } Z`}
                fill="url(#sweepTrailGrad)"
              />
            </g>
          )}

          {/* Center Radar Station Marker (Colaba IMD) */}
          <circle cx="250" cy="250" r="5" fill="#6D4AFF" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="1.5" fill="#FFFFFF" />

          {/* Interactive Probe Crosshair (when hovering) */}
          {hoverCoord && (
            <g id="interactive-probe-reticle">
              <line x1={hoverCoord.svgX - 10} y1={hoverCoord.svgY} x2={hoverCoord.svgX + 10} y2={hoverCoord.svgY} stroke="#EDE8FF" strokeWidth="1" />
              <line x1={hoverCoord.svgX} y1={hoverCoord.svgY - 10} x2={hoverCoord.svgX} y2={hoverCoord.svgY + 10} stroke="#EDE8FF" strokeWidth="1" />
              <circle cx={hoverCoord.svgX} cy={hoverCoord.svgY} r="6" fill="none" stroke="#EDE8FF" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Hover Point Probe Telemetry Box */}
      {hoverCoord && (
        <div className="absolute bottom-14 left-4 bg-black/85 backdrop-blur-md border border-purple/40 p-2.5 rounded-lg text-white font-mono text-[10px] space-y-1 shadow-elevated pointer-events-none z-30">
          <div className="flex items-center justify-between gap-3 text-purple-soft font-bold border-b border-white/10 pb-1">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-purple" />
              RADAR COORDINATE PROBE
            </span>
            <span>{hoverCoord.distanceKm} km @ {hoverCoord.azimuthDeg}°</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[#C9C4D9]">
            <div>Lat / Lon: <strong className="text-white">{hoverCoord.lat}°N, {hoverCoord.lon}°E</strong></div>
            <div>Beam MSL: <strong className="text-white">{hoverCoord.beamHeightKm} km</strong></div>
            <div>Echo Intensity: <strong className="text-status-alert">{hoverCoord.dbz} dBZ</strong></div>
            <div>Precip Rate: <strong className="text-purple-soft">{hoverCoord.rainRateMmHr} mm/h</strong></div>
          </div>
        </div>
      )}

      {/* dBZ / Product Legend Bar */}
      <div className="w-full mt-2 bg-black/60 backdrop-blur px-3 py-2 rounded-lg flex flex-col gap-1 text-[10px] font-mono text-[#D6D2E6]">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white uppercase">{PRODUCT_PALETTES[radarProduct]?.name}</span>
          <span className="text-[#AFA9C2]">
            {PRODUCT_PALETTES[radarProduct]?.min} {PRODUCT_PALETTES[radarProduct]?.unit} → {PRODUCT_PALETTES[radarProduct]?.max} {PRODUCT_PALETTES[radarProduct]?.unit}
          </span>
        </div>
        <div className={`h-2.5 w-full rounded bg-gradient-to-r ${PRODUCT_PALETTES[radarProduct]?.gradient}`} />
        <div className="flex justify-between text-[9px] text-[#AFA9C2] pt-0.5">
          {PRODUCT_PALETTES[radarProduct]?.stops?.map((stop, idx) => (
            <span key={idx} className="truncate">{stop.label.split(' ')[0]}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
