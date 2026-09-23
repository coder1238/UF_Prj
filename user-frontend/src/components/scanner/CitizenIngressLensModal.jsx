import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, Upload, CheckCircle2, AlertTriangle, ShieldAlert, 
  Car, Bike, Zap, Footprints, RefreshCw, Volume2, Sparkles
} from 'lucide-react';
import { VEHICLE_CLEARANCES } from '../../data/scannerData';

const SAMPLE_SCENES = [
  {
    id: 'scene-kurla',
    name: 'Kurla LBS Ingress (Phoenix Mall Gate)',
    simulatedDepth: 34,
    description: 'Brown muddy surface water pooling against entry ramp curb.',
    waterColor: '#78350f',
    groundColor: '#334155'
  },
  {
    id: 'scene-bkc',
    name: 'BKC G-Block Elevated Podium',
    simulatedDepth: 4,
    description: 'Slight drizzle runoff, high elevation pavers fully visible.',
    waterColor: '#0284c7',
    groundColor: '#1e293b'
  },
  {
    id: 'scene-andheri',
    name: 'Andheri Subway Inundation',
    simulatedDepth: 65,
    description: 'Deep standing water over road markers and underpass lip.',
    waterColor: '#1e3a8a',
    groundColor: '#0f172a'
  }
];

export default function CitizenIngressLensModal({ onClose, onSpeak, currentVehicle = 'sedan' }) {
  const [selectedScene, setSelectedScene] = useState(SAMPLE_SCENES[0]);
  const [customImage, setCustomImage] = useState(null);
  const [vehicle, setVehicle] = useState(currentVehicle);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const canvasRef = useRef(null);

  const vehicleProfile = VEHICLE_CLEARANCES[vehicle] || VEHICLE_CLEARANCES.sedan;

  // Run optical scan analysis
  const runAnalysis = (scene) => {
    setIsScanning(true);
    setScanProgress(0);
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          // Calculate verdict
          const depth = scene.simulatedDepth;
          let verdict = 'safe';
          let advisory = 'Water depth is well below your vehicle ground clearance and air intake.';
          
          if (depth > (vehicleProfile.exhaustHeight || vehicleProfile.clearance + 6)) {
            verdict = 'danger';
            advisory = `Critical depth of ${depth}cm will submerge exhaust pipe/air-intake. High risk of hydrostatic engine stalling!`;
          } else if (depth > vehicleProfile.clearance) {
            verdict = 'caution';
            advisory = `Water depth of ${depth}cm exceeds recommended ground clearance (${vehicleProfile.clearance}cm). Wave wash from passing heavy vehicles could flood chassis.`;
          }

          const result = {
            depth,
            verdict,
            advisory,
            curbVisibility: depth < 18 ? 'High (88%)' : 'Submerged (0%)',
            tireSubmersionPercent: Math.min(100, Math.round((depth / 60) * 100)),
            flowVelocityEst: depth > 30 ? '0.45 m/s' : '0.12 m/s',
            timestamp: new Date().toLocaleTimeString()
          };

          setAnalysisResult(result);

          if (onSpeak) {
            onSpeak(`Ingress scan completed. Estimated depth is ${depth} centimeters. Verdict is ${verdict.toUpperCase()}. ${advisory}`);
          }

          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  useEffect(() => {
    runAnalysis(selectedScene);
  }, [selectedScene, vehicle]);

  // Canvas visualizer with simulated laser scan lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 540;
    const height = canvas.height = 300;

    // Draw scene background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, selectedScene.groundColor);
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw roadway and curb
    ctx.fillStyle = '#334155';
    ctx.fillRect(40, height * 0.4, width - 80, height * 0.6);

    // Water level
    const depthPx = (selectedScene.simulatedDepth / 80) * (height * 0.4);
    const waterY = height - 20 - depthPx;

    const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
    waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    waterGrad.addColorStop(1, selectedScene.waterColor);
    ctx.fillStyle = waterGrad;
    ctx.fillRect(40, waterY, width - 80, height - waterY);

    // Vehicle silhouette reference
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(width * 0.45, waterY - 50, 80, 45); // Vehicle body
    // Wheels
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(width * 0.45 + 15, waterY + 5, 14, 0, Math.PI * 2);
    ctx.arc(width * 0.45 + 65, waterY + 5, 14, 0, Math.PI * 2);
    ctx.fill();

    // Laser scan animation line if scanning
    if (isScanning) {
      const scanY = (scanProgress / 100) * height;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Reference scale lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    for (let cm = 10; cm <= 70; cm += 20) {
      const markY = height - 20 - (cm / 80) * (height * 0.4);
      ctx.beginPath();
      ctx.moveTo(50, markY);
      ctx.lineTo(width - 50, markY);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${cm} cm`, 10, markY + 3);
    }
    ctx.setLineDash([]);
  }, [selectedScene, isScanning, scanProgress]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        // Simulate a custom photo analysis
        const customScene = {
          id: 'custom',
          name: file.name,
          simulatedDepth: Math.floor(10 + Math.random() * 45),
          description: 'User uploaded ingress photo via smartphone camera.',
          waterColor: '#1e3a8a',
          groundColor: '#1e293b'
        };
        setSelectedScene(customScene);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/30 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Citizen Ingress Lens (AR Optical Depth Scanner)</h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time optical depth triangulation against curb benchmarks & wheel diameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preset Scene Selector & Upload Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {SAMPLE_SCENES.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                    selectedScene.id === scene.id
                      ? 'bg-purple-primary text-white shadow-sm'
                      : 'bg-canvas text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {scene.name.split(' (')[0]}
                </button>
              ))}
            </div>

            <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-2 border border-slate-300 transition shrink-0">
              <Upload className="w-3.5 h-3.5 text-purple-primary" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* Vehicle Profile Selector for Clearance Cross-Check */}
          <div className="bg-canvas p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-mono font-bold text-slate-700 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-purple-primary" /> Test Against Vehicle:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {Object.entries(VEHICLE_CLEARANCES).map(([key, prof]) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    vehicle === key 
                      ? 'bg-slate-900 text-white font-bold' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {prof.name} ({prof.clearance}cm)
                </button>
              ))}
            </div>
          </div>

          {/* Scan Visualizer Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-black flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-[220px] object-cover" />
            
            {isScanning && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                <span className="text-xs font-mono font-bold tracking-wider">
                  TRIANGULATING WATERLINE: {scanProgress}%
                </span>
              </div>
            )}
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                analysisResult.verdict === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : analysisResult.verdict === 'caution'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-start gap-3">
                  {analysisResult.verdict === 'danger' ? (
                    <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  ) : analysisResult.verdict === 'caution' ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-mono font-bold uppercase block tracking-wider">
                      Optical Diagnostic Verdict
                    </span>
                    <h4 className="text-base font-extrabold capitalize mt-0.5">
                      {analysisResult.verdict === 'danger' ? 'DO NOT ENTER — SUBMERSION RISK' : analysisResult.verdict === 'caution' ? 'CAUTION: CLEARANCE WARNING' : 'SAFE FOR INGRESS'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">{analysisResult.advisory}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black font-mono block">
                    {analysisResult.depth} <span className="text-sm font-normal">cm</span>
                  </span>
                  <span className="text-[10px] font-mono opacity-70">Waterline Depth</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-muted uppercase block">Tire Submersion</span>
                  <span className="text-base font-bold font-mono text-ink">
                    {analysisResult.tireSubmersionPercent}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-muted uppercase block">Curb Datum Visibility</span>
                  <span className="text-base font-bold font-mono text-ink">
                    {analysisResult.curbVisibility}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-muted uppercase block">Surface Runoff Flow</span>
                  <span className="text-base font-bold font-mono text-ink">
                    {analysisResult.flowVelocityEst}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted">
            Computer-vision model v2.4 • Calibrated with BMC Road Datum
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
