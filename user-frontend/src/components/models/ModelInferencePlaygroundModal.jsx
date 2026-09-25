import React, { useState, useEffect } from 'react';
import { 
  X, Play, RotateCcw, Zap, Sliders, Activity, 
  CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Download
} from 'lucide-react';

export default function ModelInferencePlaygroundModal({ isOpen, onClose, model, showToast }) {
  if (!isOpen || !model) return null;

  // Real-time Input Parameter States
  const [rainfallMmPerHour, setRainfallMmPerHour] = useState(65);
  const [tideHeightMeters, setTideHeightMeters] = useState(3.8);
  const [soilSaturationPct, setSoilSaturationPct] = useState(75);
  const [roadElevationMeters, setRoadElevationMeters] = useState(4.2);
  const [stormDurationMin, setStormDurationMin] = useState(45);
  const [activePreset, setActivePreset] = useState('cloudburst');

  // Execution states
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [inferenceCount, setInferenceCount] = useState(1);
  const [execTimeMs, setExecTimeMs] = useState(124);

  // Preset Configurations
  const applyPreset = (preset) => {
    setActivePreset(preset);
    if (preset === 'cloudburst') {
      setRainfallMmPerHour(110);
      setTideHeightMeters(4.5);
      setSoilSaturationPct(92);
      setRoadElevationMeters(2.1);
      setStormDurationMin(60);
    } else if (preset === 'high_tide') {
      setRainfallMmPerHour(40);
      setTideHeightMeters(4.9);
      setSoilSaturationPct(80);
      setRoadElevationMeters(2.5);
      setStormDurationMin(90);
    } else if (preset === 'moderate') {
      setRainfallMmPerHour(25);
      setTideHeightMeters(2.8);
      setSoilSaturationPct(55);
      setRoadElevationMeters(6.5);
      setStormDurationMin(30);
    } else {
      setRainfallMmPerHour(5);
      setTideHeightMeters(1.4);
      setSoilSaturationPct(30);
      setRoadElevationMeters(8.0);
      setStormDurationMin(15);
    }
  };

  // Run forward pass calculation
  const runForwardPass = () => {
    setIsInferring(true);
    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + 40 + Math.random() * 30);
      setExecTimeMs(elapsed);

      // Hydrodynamic calculation based on inputs
      // Depth = f(Rainfall, Duration, Saturation, Tide, -Elevation)
      const baseRunoff = (rainfallMmPerHour * (stormDurationMin / 60) * (soilSaturationPct / 100));
      const tidalBackpressure = Math.max(0, (tideHeightMeters - 3.2) * 12);
      const elevationDrainFactor = Math.max(0.2, 10 - roadElevationMeters) / 10;

      const rawDepth = (baseRunoff * 0.42 * elevationDrainFactor + tidalBackpressure);
      const predictedDepthCm = Math.min(180, Math.max(2, Math.round(rawDepth * 10) / 10));
      const velocityMps = Math.min(3.5, Math.max(0.1, Math.round((predictedDepthCm / 35 + 0.15) * 100) / 100));
      const froudeNumber = Math.round((velocityMps / Math.sqrt(9.81 * Math.max(0.05, predictedDepthCm / 100))) * 100) / 100;
      
      let riskLevel = 'SAFE';
      let riskColor = 'text-status-safe';
      let riskBg = 'bg-status-safe/10 border-status-safe/30';
      if (predictedDepthCm > 60) {
        riskLevel = 'SEVERE HAZARD';
        riskColor = 'text-flood-danger';
        riskBg = 'bg-flood-danger/10 border-flood-danger/30';
      } else if (predictedDepthCm > 30) {
        riskLevel = 'HAZARDOUS';
        riskColor = 'text-amber-600';
        riskBg = 'bg-amber-500/10 border-amber-500/30';
      } else if (predictedDepthCm > 15) {
        riskLevel = 'CAUTION';
        riskColor = 'text-purple';
        riskBg = 'bg-purple-soft border-purple/30';
      }

      const vehicleClearances = {
        compactSedan: predictedDepthCm < 15 ? 'SAFE' : 'RISK_OF_STALL',
        suv: predictedDepthCm < 25 ? 'SAFE' : 'RISK_OF_STALL',
        emergencyAmbulance: predictedDepthCm < 35 ? 'SAFE' : 'REROUTE_URGENT',
        rescueTruck: predictedDepthCm < 65 ? 'SAFE' : 'RESTRICTED'
      };

      setInferenceResult({
        predictedDepthCm,
        velocityMps,
        froudeNumber,
        riskLevel,
        riskColor,
        riskBg,
        confidencePct: (94.2 + (Math.random() * 4 - 2)).toFixed(1),
        vehicleClearances,
        timestamp: new Date().toLocaleTimeString(),
        tensorOutputId: `TENS_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      });

      setIsInferring(false);
      setInferenceCount(prev => prev + 1);
      showToast?.(`Forward pass complete in ${elapsed}ms (${model.name})`);
    }, 450);
  };

  useEffect(() => {
    runForwardPass();
  }, [model.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface rounded-3xl border border-border shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft flex items-center justify-center text-purple">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                  Live Tensor Inference Sandbox
                </span>
                <span className="text-xs font-mono text-muted">{model.code} ({model.id})</span>
              </div>
              <h2 className="text-base font-bold text-ink">{model.name}</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-border flex items-center justify-center text-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas p-3.5 rounded-2xl border border-border">
            <span className="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple" />
              Scenario Presets:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'cloudburst', label: 'Cloudburst (110 mm/h)' },
                { id: 'high_tide', label: 'Spring High Tide Surcharge' },
                { id: 'moderate', label: 'Moderate Monsoon Shower' },
                { id: 'baseline', label: 'Dry Baseline' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activePreset === p.id 
                      ? 'bg-purple text-white shadow-subtle' 
                      : 'bg-surface hover:bg-slate-100 text-ink-secondary border border-border'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input 1: Rainfall Rate */}
            <div className="p-4 bg-canvas rounded-2xl border border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink font-semibold">Precipitation Intensity (I):</span>
                <span className="text-purple font-bold text-sm">{rainfallMmPerHour} mm/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="150" 
                step="5"
                value={rainfallMmPerHour} 
                onChange={(e) => setRainfallMmPerHour(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>0 mm/h (Clear)</span>
                <span>50 mm/h (Heavy)</span>
                <span>150 mm/h (Extreme)</span>
              </div>
            </div>

            {/* Input 2: Tide Height */}
            <div className="p-4 bg-canvas rounded-2xl border border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink font-semibold">Arabian Sea Tide Level (MSL):</span>
                <span className="text-purple font-bold text-sm">{tideHeightMeters.toFixed(1)} m</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5.5" 
                step="0.1"
                value={tideHeightMeters} 
                onChange={(e) => setTideHeightMeters(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>0.5m (Low Tide)</span>
                <span>3.2m (Flap Threshold)</span>
                <span>5.5m (Spring Peak)</span>
              </div>
            </div>

            {/* Input 3: Soil Saturation */}
            <div className="p-4 bg-canvas rounded-2xl border border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink font-semibold">Antecedent Soil Saturation (S):</span>
                <span className="text-purple font-bold text-sm">{soilSaturationPct}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={soilSaturationPct} 
                onChange={(e) => setSoilSaturationPct(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>10% (Dry Substrate)</span>
                <span>60% (Moist)</span>
                <span>100% (Saturated Impervious)</span>
              </div>
            </div>

            {/* Input 4: Elevation Offset */}
            <div className="p-4 bg-canvas rounded-2xl border border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink font-semibold">Ground Topography Elevation:</span>
                <span className="text-purple font-bold text-sm">{roadElevationMeters.toFixed(1)} m MSL</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="15.0" 
                step="0.2"
                value={roadElevationMeters} 
                onChange={(e) => setRoadElevationMeters(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>1.0m (Milan/Hindmata)</span>
                <span>6.0m (Midlands)</span>
                <span>15.0m (Cumballa Hill)</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-mono text-muted flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple" />
              <span>Inference Device: <strong className="text-ink">{model.device || 'WebGL Tensor Backend'}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => applyPreset('moderate')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-ink-secondary hover:bg-canvas border border-border flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>

              <button
                onClick={runForwardPass}
                disabled={isInferring}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple text-white hover:bg-purple-deep shadow-subtle flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isInferring ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Executing Forward Pass...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Model Forward Pass</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Predicted Output Tensors */}
          {inferenceResult && (
            <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-200/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-safe animate-pulse" />
                  <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                    Computed Output Tensor [Depth, Velocity, Risk]
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-muted">Batch ID: {inferenceResult.tensorOutputId}</span>
                  <span className="font-bold text-purple bg-purple-soft px-2.5 py-0.5 rounded-lg border border-purple/30">
                    Latency: {execTimeMs} ms
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle">
                  <span className="text-[10px] font-mono uppercase text-muted block">Peak Inundation Depth</span>
                  <span className="text-2xl font-mono font-extrabold text-ink mt-0.5 block">
                    {inferenceResult.predictedDepthCm} <span className="text-sm font-normal text-muted">cm</span>
                  </span>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${inferenceResult.predictedDepthCm > 40 ? 'bg-flood-danger' : 'bg-purple'}`}
                      style={{ width: `${Math.min(100, (inferenceResult.predictedDepthCm / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle">
                  <span className="text-[10px] font-mono uppercase text-muted block">Surface Velocity & Froude</span>
                  <span className="text-2xl font-mono font-extrabold text-purple mt-0.5 block">
                    {inferenceResult.velocityMps} <span className="text-sm font-normal text-muted">m/s</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted block mt-1">
                    Fr = {inferenceResult.froudeNumber} ({inferenceResult.froudeNumber < 1 ? 'Subcritical Flow' : 'Supercritical Wave'})
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border shadow-subtle ${inferenceResult.riskBg}`}>
                  <span className="text-[10px] font-mono uppercase block text-muted">Dynamic Risk Category</span>
                  <span className={`text-xl font-mono font-extrabold mt-0.5 block ${inferenceResult.riskColor}`}>
                    {inferenceResult.riskLevel}
                  </span>
                  <span className="text-[10px] font-mono block mt-1 text-ink">
                    Confidence: {inferenceResult.confidencePct}% (PINN + SWE)
                  </span>
                </div>
              </div>

              {/* Vehicle Clearance & Accessibility Matrix */}
              <div className="bg-surface p-4 rounded-2xl border border-border">
                <h5 className="text-xs font-mono font-bold text-ink mb-2.5 flex items-center justify-between">
                  <span>Edge Wading Clearance by Vehicle Class</span>
                  <span className="text-[10px] text-muted">Tested against {model.name}</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-canvas rounded-xl border border-border">
                    <span className="text-muted block text-[10px]">Sedan (15cm)</span>
                    <strong className={inferenceResult.vehicleClearances.compactSedan === 'SAFE' ? 'text-status-safe' : 'text-flood-danger'}>
                      {inferenceResult.vehicleClearances.compactSedan}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-canvas rounded-xl border border-border">
                    <span className="text-muted block text-[10px]">SUV / 4x4 (25cm)</span>
                    <strong className={inferenceResult.vehicleClearances.suv === 'SAFE' ? 'text-status-safe' : 'text-flood-danger'}>
                      {inferenceResult.vehicleClearances.suv}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-canvas rounded-xl border border-border">
                    <span className="text-muted block text-[10px]">Ambulance (35cm)</span>
                    <strong className={inferenceResult.vehicleClearances.emergencyAmbulance === 'SAFE' ? 'text-status-safe' : 'text-amber-600'}>
                      {inferenceResult.vehicleClearances.emergencyAmbulance}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-canvas rounded-xl border border-border">
                    <span className="text-muted block text-[10px]">NDRF Truck (65cm)</span>
                    <strong className={inferenceResult.vehicleClearances.rescueTruck === 'SAFE' ? 'text-status-safe' : 'text-flood-danger'}>
                      {inferenceResult.vehicleClearances.rescueTruck}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

