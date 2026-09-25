import React, { useState } from 'react';
import { 
  X, Camera, Activity, Gauge, Droplets, ShieldAlert, 
  ArrowRight, Volume2, Share2, CheckCircle2, AlertTriangle, RefreshCw
} from 'lucide-react';

export default function AlertDiagnosticsModal({ alert, onClose, onSpeak, onAvoidOnRoute, onShare }) {
  const [selectedCamIndex, setSelectedCamIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cameraTimestamp, setCameraTimestamp] = useState(new Date().toLocaleTimeString());

  if (!alert) return null;

  const currentCam = alert.cctvStreams?.[selectedCamIndex] || {
    id: 'cam-gen',
    name: 'Municipal Telemetry Camera',
    status: 'ONLINE',
    depth: `${alert.waterDepthCm} cm`,
    angle: 'Wide Angle 1080p'
  };

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCameraTimestamp(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
              alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {alert.severity} Incident
            </span>
            <h2 className="text-base font-bold truncate max-w-md">
              Forensic Diagnostics: {alert.wardName || alert.ward}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Overview Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-canvas border border-slate-200">
            <div>
              <span className="text-xs font-mono text-muted uppercase">Incident Location</span>
              <h3 className="text-lg font-extrabold text-ink">{alert.translations?.en?.title || alert.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{alert.translations?.en?.message || alert.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSpeak(alert.translations?.en?.soundAlert || alert.soundAlert)}
                className="px-3 py-2 rounded-xl bg-purple-50 text-purple-primary border border-purple-200 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100"
              >
                <Volume2 className="w-4 h-4" /> Audio Readout
              </button>
              <button 
                onClick={() => onShare(alert)}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* CCTV Feed Simulation & Camera Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-primary" />
                <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                  Live CCTV Municipal Feed Simulation
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                  {currentCam.status}
                </span>
              </div>
              <button
                onClick={handleRefreshFeed}
                disabled={isRefreshing}
                className="text-xs font-mono text-muted hover:text-ink flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-primary' : ''}`} /> Refresh Frame
              </button>
            </div>

            {/* Simulated Camera Viewport */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              {/* CCTV Overlay Top */}
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC • {currentCam.name}
                </span>
                <span>{cameraTimestamp} IST • 30 FPS</span>
              </div>

              {/* Center Simulated Visual */}
              <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-none">
                <div className="w-20 h-20 rounded-full border border-purple-500/30 flex items-center justify-center mb-2 bg-purple-950/40">
                  <Activity className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
                <span className="text-white font-mono text-sm font-bold tracking-wider">
                  SURFACE WATER LEVEL: {currentCam.depth}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-1">
                  AI Optical Gauge Sensor Verified • Precision ±1.5cm
                </span>
              </div>

              {/* CCTV Overlay Bottom */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>LENS: {currentCam.angle}</span>
                <span className="text-amber-400">ALERT VECTOR: {alert.depthTrend}</span>
              </div>
            </div>

            {/* Camera Switcher Buttons */}
            {alert.cctvStreams && alert.cctvStreams.length > 1 && (
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                {alert.cctvStreams.map((cam, idx) => (
                  <button
                    key={cam.id}
                    onClick={() => setSelectedCamIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all shrink-0 ${
                      selectedCamIndex === idx
                        ? 'bg-ink text-white border-ink font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Cam {idx + 1}: {cam.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Measured Depth
              </div>
              <div className="text-2xl font-mono font-extrabold text-red-600">{alert.waterDepthCm} cm</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{alert.depthTrend}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-1">
                <Gauge className="w-3.5 h-3.5 text-amber-500" /> Peak Predicted
              </div>
              <div className="text-2xl font-mono font-extrabold text-amber-600">{alert.peakPredictedDepthCm} cm</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Expected at T+45 min</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-1">
                <Activity className="w-3.5 h-3.5 text-purple-500" /> Soil Saturation
              </div>
              <div className="text-2xl font-mono font-extrabold text-purple-700">{alert.soilSaturationPercent}%</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Critical Infiltration Limit</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dewatering Pumps
              </div>
              <div className="text-2xl font-mono font-extrabold text-emerald-600">{alert.activePumps} Active</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{alert.pumpDutyCycle}% Duty Cycle ({alert.pumpCapacityGPM} GPM)</div>
            </div>
          </div>

          {/* Actionable Directives & Recommended Bypass */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider block mb-2.5">
              Official Municipal Directives:
            </span>
            <div className="space-y-2">
              {(alert.translations?.en?.directives || alert.directives).map((dir, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{dir}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-muted">Bypass Route:</span>
              <span className="font-bold text-purple-primary">{alert.bypassRoute}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-muted">
            Coordinates: {alert.coordinates.lat.toFixed(4)}° N, {alert.coordinates.lng.toFixed(4)}° E
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white"
            >
              Close Diagnostics
            </button>
            <button
              onClick={() => {
                onAvoidOnRoute(alert);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              Avoid on Safe Route <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

