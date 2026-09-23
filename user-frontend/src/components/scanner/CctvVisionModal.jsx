import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, RefreshCw, ZoomIn, ZoomOut, Moon, Sun, Download, 
  Eye, ShieldCheck, AlertTriangle, Crosshair, Radio, Activity, Volume2
} from 'lucide-react';

export default function CctvVisionModal({ hub, onClose, onSpeak }) {
  if (!hub) return null;

  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [isNightVision, setIsNightVision] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(null);
  const [aiTrackingEnabled, setAiTrackingEnabled] = useState(true);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const cameras = hub.cctvFeed?.cameras || [
    { id: 'cam-1', name: 'Main Ingress Portal', angle: 'Front Wide', depthEstimate: hub.waterDepth }
  ];
  const currentCam = cameras[activeCamIndex] || cameras[0];

  // Canvas animation for live simulated video feed with rain & water ripples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 640;
    let height = canvas.height = 360;

    // Rain particles
    const raindrops = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 15,
      speed: 12 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.4
    }));

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Background simulated road/entrance
      if (isNightVision) {
        // Infrared green tinted background
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#041f0b');
        grad.addColorStop(0.5, '#0a3314');
        grad.addColorStop(1, '#021206');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Realistic rainy dusk road gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.4, '#334155');
        grad.addColorStop(0.7, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Simulated curb and road horizon
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);

      // Roadway asphalt
      ctx.fillStyle = isNightVision ? '#0d2818' : '#1e2638';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      ctx.lineTo(width, height * 0.45);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Curb & portal pillars
      ctx.fillStyle = isNightVision ? '#184d28' : '#475569';
      ctx.fillRect(width * 0.05, height * 0.25, 40, height * 0.6);
      ctx.fillRect(width * 0.88, height * 0.25, 40, height * 0.6);
      ctx.fillRect(width * 0.05, height * 0.25, width * 0.85, 20);

      // Water reflection pool
      const waterLevelPx = Math.min(height * 0.35, (currentCam.depthEstimate / 70) * (height * 0.35));
      const waterTopY = height - 20 - waterLevelPx;

      const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, height);
      if (isNightVision) {
        waterGrad.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
        waterGrad.addColorStop(1, 'rgba(16, 185, 129, 0.7)');
      } else {
        waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        waterGrad.addColorStop(1, 'rgba(14, 116, 144, 0.65)');
      }
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterTopY, width, height - waterTopY);

      // Animated ripples on water surface
      ctx.strokeStyle = isNightVision ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const rippleX = (width * 0.2 + (i * 120) + (frameCount * 0.8)) % width;
        const rippleY = waterTopY + 10 + (i * 12);
        ctx.beginPath();
        ctx.ellipse(rippleX, rippleY, 25 + (Math.sin(frameCount * 0.05 + i) * 8), 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw AI Bounding Boxes if enabled
      if (aiTrackingEnabled) {
        // Water pool bounding box
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(30, waterTopY, width - 60, height - waterTopY - 10);
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px monospace';
        ctx.fillText(`[WATER POOL: ${currentCam.depthEstimate}cm • CONF: ${(hub.cctvFeed?.aiConfidence || 97).toFixed(1)}%]`, 34, waterTopY - 6);

        // Submerged curb marker
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(width * 0.05 - 4, waterTopY, 48, 30);
        ctx.fillStyle = '#eab308';
        ctx.fillText(`[CURB DATUM]`, width * 0.05 - 4, waterTopY - 4);
      }

      ctx.restore();

      // Falling raindrops overlay
      ctx.strokeStyle = isNightVision ? 'rgba(74, 222, 128, 0.4)' : 'rgba(203, 213, 225, 0.5)';
      ctx.lineWidth = 1.2;
      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= 1;
        if (drop.y > height) {
          drop.y = -10;
          drop.x = Math.random() * width;
        }
      });

      // HUD Optical Ruler along right side
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(width - 45, 20, 35, height - 40);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let cm = 0; cm <= 70; cm += 10) {
        const yPos = (height - 30) - (cm / 70) * (height - 60);
        ctx.beginPath();
        ctx.moveTo(width - 45, yPos);
        ctx.lineTo(width - 35, yPos);
        ctx.stroke();
        ctx.fillStyle = cm <= currentCam.depthEstimate ? '#ef4444' : '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`${cm}`, width - 30, yPos + 3);
      }

      // Red line at detected depth
      const activeY = (height - 30) - (currentCam.depthEstimate / 70) * (height - 60);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 45, activeY);
      ctx.lineTo(width - 15, activeY);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentCam, isNightVision, zoomLevel, panOffset, aiTrackingEnabled]);

  const handleCaptureSnapshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshotTaken(dataUrl);
        // Trigger auto-download
        const link = document.createElement('a');
        link.download = `${hub.id}-${currentCam.id}-snapshot-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
      setIsCapturing(false);
    }, 400);
  };

  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.5, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.5, 1));
      if (zoomLevel <= 1.5) setPanOffset({ x: 0, y: 0 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-none">{hub.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {hub.cctvFeed?.id || 'CAM-HUB'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {currentCam.name} • {hub.cctvFeed?.resolution || '4K UHD • 30 FPS'} • Verified {hub.lastVerified}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSpeak && (
              <button
                onClick={() => onSpeak(`${hub.name}. Camera ${currentCam.name} reports water depth of ${currentCam.depthEstimate} centimeters.`)}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                title="Voice read out"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Selector Tabs */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {cameras.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => {
                setActiveCamIndex(idx);
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeCamIndex === idx
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Radio className={`w-3 h-3 ${activeCamIndex === idx ? 'text-white animate-pulse' : 'text-slate-500'}`} />
              <span>{cam.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                cam.depthEstimate > 20 ? 'bg-red-900/60 text-red-300' : 'bg-emerald-900/60 text-emerald-300'
              }`}>
                {cam.depthEstimate}cm
              </span>
            </button>
          ))}
        </div>

        {/* Video Canvas Workspace */}
        <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[340px]">
          <canvas 
            ref={canvasRef}
            className="w-full h-full max-h-[460px] object-contain cursor-crosshair"
          />

          {/* Top-Left Telemetry Overlay */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/70 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STREAM OPTICAL FEED ONLINE
            </div>
            <div>SENSOR DEPTH: <span className="text-white font-bold">{currentCam.depthEstimate} cm</span></div>
            <div>AI CONFIDENCE: <span className="text-yellow-400 font-bold">{hub.cctvFeed?.aiConfidence || 97.4}%</span></div>
            <div>SURFACE FLOW: <span className="text-blue-400">0.42 m/s (Runoff)</span></div>
          </div>

          {/* Top-Right Control Buttons */}
          <div className="absolute top-4 right-16 flex flex-col gap-2">
            <button
              onClick={() => setIsNightVision(!isNightVision)}
              className={`p-2 rounded-xl text-xs font-mono transition flex items-center gap-1.5 shadow ${
                isNightVision ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700'
              }`}
              title="Toggle Night Vision / Infrared"
            >
              {isNightVision ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isNightVision ? 'IR: ON' : 'IR: OFF'}</span>
            </button>

            <button
              onClick={() => setAiTrackingEnabled(!aiTrackingEnabled)}
              className={`p-2 rounded-xl text-xs font-mono transition flex items-center gap-1.5 shadow ${
                aiTrackingEnabled ? 'bg-purple-600 text-white' : 'bg-slate-800/90 text-slate-400'
              }`}
              title="Toggle AI Bounding Box Overlay"
            >
              <Crosshair className="w-4 h-4" />
              <span>{aiTrackingEnabled ? 'AI BOX: ON' : 'AI BOX: OFF'}</span>
            </button>
          </div>

          {/* PTZ Zoom Buttons */}
          <div className="absolute bottom-4 right-16 flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-xl p-1 text-white">
            <button
              onClick={() => handleZoom('out')}
              disabled={zoomLevel <= 1}
              className="p-1.5 hover:bg-slate-800 rounded disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2">{zoomLevel}x</span>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoomLevel >= 3}
              className="p-1.5 hover:bg-slate-800 rounded disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Pan Directional Controls when zoomed in */}
          {zoomLevel > 1 && (
            <div className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-700 rounded-xl p-1 flex items-center gap-1 text-white text-xs font-mono">
              <button 
                onClick={() => setPanOffset(prev => ({ ...prev, x: prev.x + 30 }))}
                className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
              >
                ←
              </button>
              <button 
                onClick={() => setPanOffset(prev => ({ ...prev, x: prev.x - 30 }))}
                className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
              >
                →
              </button>
              <button 
                onClick={() => setPanOffset({ x: 0, y: 0 })}
                className="px-2 py-1 text-[10px] text-slate-400 hover:text-white"
              >
                Reset Pan
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300">
          <div className="text-xs font-mono flex items-center gap-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Telemetry: Optical flow vector calibrated via BMC Disaster Control Cell</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition flex items-center gap-2 border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isCapturing ? 'Saving Snapshot...' : 'Capture Optical PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
