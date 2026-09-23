import React, { useRef, useEffect, useState } from 'react';
import {
  Camera,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Sliders,
  Crosshair,
  ShieldAlert,
  Flame,
  Droplets,
  CloudRain,
  Eye,
  Layers,
  Zap,
} from 'lucide-react';

export default function CCTVCanvasStream({
  selectedCam,
  showOverlays = true,
  showCalibrationGrid = true,
  activeFilter = 'normal', // 'normal' | 'ir' | 'rain-clean' | 'dehaze' | 'thermal'
  zoom = 1,
  panX = 0,
  panY = 0,
  datumOffset = 0,
  roiList = [],
  activeRoiMode = false,
  onAddRoi,
  activeModel = 'YOLOv8-HydroEdge',
  isWiperActive = false,
  isPlayingStream = true,
  onCaptureSnapshot,
  vehicles = [],
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(29.8);
  const [currentTime, setCurrentTime] = useState('');
  const [drawingStart, setDrawingStart] = useState(null);
  const [currentBox, setCurrentBox] = useState(null);

  // Live timestamp clock & slight FPS fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 100));
      setFps((29.4 + Math.random() * 0.8).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // HTML5 Canvas animation loop: renders dynamic water waves, rain streaks, reflections, optical flow vectors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let waveOffset = 0;
    let rainDrops = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 6 + Math.random() * 8,
      length: 12 + Math.random() * 10,
    }));

    const render = () => {
      if (!isPlayingStream) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Perspective Road / Underpass Geometry
      const w = canvas.width;
      const h = canvas.height;

      // Dark asphalt ground with perspective lines
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Road tunnel walls/curbs
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h);
      ctx.lineTo(w * 0.35, h * 0.28);
      ctx.lineTo(w * 0.65, h * 0.28);
      ctx.lineTo(w * 0.92, h);
      ctx.closePath();
      const roadGrad = ctx.createLinearGradient(0, h * 0.28, 0, h);
      roadGrad.addColorStop(0, '#1e293b');
      roadGrad.addColorStop(1, '#0b1120');
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Road lane dash markings
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 16]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.3);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Dynamic Rain Streaks (if not rain-clean filtered)
      if (activeFilter !== 'rain-clean') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.25)';
        ctx.lineWidth = 1;
        rainDrops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.length);
          ctx.stroke();
          d.y += d.speed;
          d.x -= 1;
          if (d.y > h) {
            d.y = -10;
            d.x = Math.random() * w;
          }
        });
      }

      // 3. Water Inundation Simulation
      // Calculate water surface position from detectedDepth (0 to 60 cm)
      const depth = selectedCam?.detectedDepth || 24;
      const waterHeightRatio = Math.min(0.75, Math.max(0.12, depth / 65));
      const waterTopY = h - h * waterHeightRatio;

      waveOffset += 0.04;

      // Water body gradient
      const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, h);
      if (activeFilter === 'thermal') {
        waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
        waterGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.9)');
        waterGrad.addColorStop(1, 'rgba(239, 68, 68, 0.95)');
      } else if (activeFilter === 'ir') {
        waterGrad.addColorStop(0, 'rgba(200, 240, 200, 0.4)');
        waterGrad.addColorStop(1, 'rgba(20, 60, 20, 0.7)');
      } else {
        waterGrad.addColorStop(0, 'rgba(14, 165, 233, 0.55)');
        waterGrad.addColorStop(0.4, 'rgba(2, 132, 199, 0.7)');
        waterGrad.addColorStop(1, 'rgba(3, 105, 161, 0.88)');
      }

      // Sine wave surface
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, waterTopY);
      for (let x = 0; x <= w; x += 15) {
        const y = waterTopY + Math.sin(x * 0.015 + waveOffset) * 4 + Math.cos(x * 0.03 - waveOffset * 0.8) * 2.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Waterline specular crest highlight
      ctx.strokeStyle = activeFilter === 'thermal' ? '#fde047' : 'rgba(224, 242, 254, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 15) {
        const y = waterTopY + Math.sin(x * 0.015 + waveOffset) * 4 + Math.cos(x * 0.03 - waveOffset * 0.8) * 2.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Floating optical debris / turbidity markers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 5; i++) {
        const px = ((i * 140 + waveOffset * 15) % (w - 40)) + 20;
        const py = waterTopY + 12 + (i * 11) % 40;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Optical flow motion vectors (subtle floating arrows on water surface)
      if (showOverlays) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.5;
        for (let vx = 80; vx < w - 80; vx += 120) {
          const vy = waterTopY + 28;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx + 18, vy + 4);
          ctx.lineTo(vx + 14, vy - 1);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedCam, activeFilter, isPlayingStream, showOverlays]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // ROI Interactive Drawing Handlers
  const handleMouseDown = (e) => {
    if (!activeRoiMode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawingStart({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!drawingStart || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const x = Math.min(drawingStart.x, currentX);
    const y = Math.min(drawingStart.y, currentY);
    const width = Math.abs(currentX - drawingStart.x);
    const height = Math.abs(currentY - drawingStart.y);

    setCurrentBox({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (drawingStart && currentBox && currentBox.width > 3 && currentBox.height > 3) {
      if (onAddRoi) {
        onAddRoi({
          id: `ROI-${Date.now().toString().slice(-4)}`,
          name: `Custom Zone #${roiList.length + 1}`,
          type: 'water-gauge',
          ...currentBox,
          confidence: 95,
        });
      }
    }
    setDrawingStart(null);
    setCurrentBox(null);
  };

  // Visual Filter Style Mapping
  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'ir':
        return {
          filter: 'grayscale(0.6) hue-rotate(90deg) contrast(1.4) brightness(1.2)',
        };
      case 'rain-clean':
        return {
          filter: 'contrast(1.2) saturate(1.15) brightness(1.05)',
        };
      case 'dehaze':
        return {
          filter: 'contrast(1.5) brightness(1.1) saturate(1.3)',
        };
      case 'thermal':
        return {
          filter: 'invert(0.9) hue-rotate(180deg) saturate(2.5) contrast(1.3)',
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden select-none bg-slate-950 border border-border shadow-subtle ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'min-h-[460px] flex-1 flex flex-col'
      }`}
    >
      {/* Viewport Sub-header / Overlay Controls Bar */}
      <div className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3.5 flex items-center justify-between text-white pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-alert animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
              REC ● LIVE
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {selectedCam?.name}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
            {selectedCam?.ward}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            {activeModel}
          </span>
        </div>

        {/* Quick Stream Controls */}
        <div className="flex items-center gap-2">
          {activeFilter !== 'normal' && (
            <span className="text-[10px] font-mono uppercase bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-300" />
              {activeFilter}
            </span>
          )}

          {activeRoiMode && (
            <span className="text-[10px] font-bold bg-amber-500 text-slate-900 px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
              <Crosshair className="w-3 h-3" />
              DRAW ROI ACTIVE: Drag box on video
            </span>
          )}

          <button
            onClick={() => onCaptureSnapshot && onCaptureSnapshot()}
            title="Forensic Snapshot"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all flex items-center gap-1 text-xs px-2.5"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stream Layer with Zoom / Pan Transforms */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="relative w-full h-full transition-transform duration-150 ease-out origin-center"
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            ...getFilterStyle(),
          }}
        >
          {/* HTML5 Canvas Rendering Wave & Environment */}
          <canvas
            ref={canvasRef}
            width={840}
            height={500}
            className="w-full h-full object-cover block"
          />

          {/* Synthetic Moving Vehicles & Obstacles in Stream */}
          {vehicles.map((v) => {
            const isStalled = v.status === 'STALLED';
            return (
              <div
                key={v.id}
                className="absolute transition-all duration-300 pointer-events-auto group cursor-pointer"
                style={{
                  left: `${v.x}%`,
                  top: `${v.y}%`,
                  width: `${v.width}px`,
                  height: `${v.height}px`,
                }}
              >
                {/* Vehicle SVG Silhouette */}
                <div
                  className={`w-full h-full rounded border-2 flex items-center justify-center relative ${
                    isStalled
                      ? 'border-status-alert bg-status-alert/20 animate-pulse'
                      : 'border-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  <span className="text-[14px]">
                    {v.type === 'BUS' ? '🚌' : v.type === 'AUTO' ? '🛺' : v.type === 'BIKE' ? '🛵' : '🚗'}
                  </span>

                  {/* Water splash wake when moving */}
                  {!isStalled && (
                    <div className="absolute -bottom-1 inset-x-0 h-1.5 bg-blue-300/40 rounded-full blur-[1px] animate-pulse" />
                  )}

                  {/* Bounding box label tag */}
                  {showOverlays && (
                    <div
                      className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-sm ${
                        isStalled ? 'bg-status-alert text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {v.type}: {v.plate} ({v.speed} km/h) • {v.clearanceCm}cm clr
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Operator-defined and Pre-set ROIs */}
          {showOverlays &&
            roiList.map((roi) => (
              <div
                key={roi.id}
                className="absolute border-2 border-dashed border-purple-400 bg-purple-500/15 rounded pointer-events-none"
                style={{
                  left: `${roi.x}%`,
                  top: `${roi.y}%`,
                  width: `${roi.width}%`,
                  height: `${roi.height}%`,
                }}
              >
                <div className="absolute -top-4 left-1 bg-purple-600 text-white font-mono text-[9px] px-1 py-0.2 rounded font-bold">
                  {roi.name} (Conf: {roi.confidence || 95}%)
                </div>
              </div>
            ))}

          {/* Dynamic box being drawn */}
          {currentBox && (
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none"
              style={{
                left: `${currentBox.x}%`,
                top: `${currentBox.y}%`,
                width: `${currentBox.width}%`,
                height: `${currentBox.height}%`,
              }}
            />
          )}

          {/* Computer Vision Overlays */}
          {showOverlays && (
            <>
              {/* Water Inundation Polygon Detection Tag */}
              <div
                className="absolute left-12 right-20 border-2 border-status-alert/80 rounded bg-status-alert/10 pointer-events-none"
                style={{
                  bottom: `${Math.min(70, Math.max(12, ((selectedCam?.detectedDepth || 24) / 65) * 100))}%`,
                  height: '32px',
                }}
              >
                <span className="absolute -top-3 left-3 bg-status-alert text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold shadow-md flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  WATERLINE SEGMENT: {selectedCam?.detectedDepth} cm (CONF: {selectedCam?.confidence}%)
                </span>
                <span className="absolute right-2 top-1 text-[9px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
                  SURFACE FLOW: 0.82 m/s ↗
                </span>
              </div>

              {/* Physical Curb Datum Reference Marker */}
              <div
                className="absolute left-6 w-32 border-2 border-sky-400 rounded bg-sky-500/15 pointer-events-none p-1"
                style={{
                  bottom: `${Math.min(50, Math.max(8, ((15 + datumOffset) / 65) * 100))}%`,
                  height: '42px',
                }}
              >
                <span className="absolute -top-3 left-1 bg-sky-600 text-white text-[9px] font-mono px-1 rounded font-bold">
                  CURB DATUM REF #04
                </span>
                <span className="text-[10px] font-mono text-sky-200 block mt-1">
                  Curb Elevation: {15 + datumOffset} cm
                </span>
              </div>
            </>
          )}

          {/* Physical Gauge Calibration Markings */}
          {showCalibrationGrid && (
            <div className="absolute right-3 top-10 bottom-8 w-14 border-l-2 border-dashed border-white/40 flex flex-col justify-between py-1 text-[9px] font-mono text-white/80 pointer-events-none bg-black/30 backdrop-blur-xs px-1 rounded-r">
              {[60, 50, 40, 30, 20, 10, 0].map((level) => {
                const isClosest = Math.abs((selectedCam?.detectedDepth || 24) - level) <= 5;
                return (
                  <div
                    key={level}
                    className={`flex items-center justify-between border-b border-white/20 pb-0.5 ${
                      isClosest ? 'text-amber-300 font-bold bg-amber-500/20 px-1 rounded' : ''
                    }`}
                  >
                    <span>{level}cm</span>
                    <span className="text-[8px] text-white/50">—</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Wiper Sweep Graphic */}
          {isWiperActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              <div className="w-4 h-full bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent blur-xs animate-wiperSweep" />
            </div>
          )}
        </div>
      </div>

      {/* Camera Stream Lower Telemetry Watermark & HUD */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="bg-black/60 px-2 py-1 rounded border border-white/10 flex items-center gap-2">
            <span className="text-slate-400">CAM:</span>
            <span className="font-bold text-white uppercase">{selectedCam?.id}</span>
          </div>
          <div className="bg-black/60 px-2 py-1 rounded border border-white/10">
            TIME: <span className="text-emerald-400 font-bold">{currentTime} IST</span>
          </div>
          <div className="bg-black/60 px-2 py-1 rounded border border-white/10 hidden md:block">
            FPS: <span className="text-white font-bold">{fps}</span> | 1920x1080@30Hz
          </div>
          <div className="bg-black/60 px-2 py-1 rounded border border-white/10 hidden lg:block">
            BITRATE: <span className="text-sky-400 font-bold">4.2 Mbps</span> (H.265 RTSP)
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="text-[10px] text-slate-400 hidden sm:block">
            Zoom: {zoom.toFixed(1)}x {panX !== 0 || panY !== 0 ? `| Pan(${panX},${panY})` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

