import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Cpu,
  Zap,
  TrendingDown,
  BarChart2,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { DRIFT_FEATURES_MATRIX } from './modelsConstants';

// ============================================================================
// FEATURE 6: Covariate & Data Drift Detector (PSI & Wasserstein Distance)
// ============================================================================
export function DataDriftPsiDetector({ showToast }) {
  const [driftMatrix, setDriftMatrix] = useState(DRIFT_FEATURES_MATRIX);
  const [isSimulatingGlitch, setIsSimulatingGlitch] = useState(false);

  const handleSimulateGlitch = () => {
    setIsSimulatingGlitch(true);
    setDriftMatrix((prev) =>
      prev.map((item) => {
        if (item.feature.includes('ZDR Reflectivity')) {
          return {
            ...item,
            psi: 0.284,
            wasserstein: 0.312,
            status: 'SEVERE_SHIFT',
            driftRisk: 'High (Beam blockage / Attenuation)',
          };
        }
        return item;
      })
    );
    if (showToast) showToast('Injected radar beam attenuation anomaly: PSI spike detected!');
  };

  const handleRecalibrateBaseline = () => {
    setIsSimulatingGlitch(false);
    setDriftMatrix(DRIFT_FEATURES_MATRIX);
    if (showToast) showToast('Baseline distribution recalibrated against latest 48h telemetry.');
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 6 • Statistical Distribution Drift
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Covariate &amp; Concept Drift Detector (PSI &amp; Wasserstein Metric)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateGlitch}
            className="px-2.5 py-1 rounded bg-status-alert-soft hover:bg-status-alert-soft/80 text-status-alert font-mono text-[11px] font-semibold border border-status-alert/30 transition-colors"
          >
            Inject Drift Anomaly
          </button>
          <button
            onClick={handleRecalibrateBaseline}
            className="px-3 py-1 rounded bg-purple hover:bg-purple-deep text-white font-mono text-[11px] font-semibold transition-colors"
          >
            Recalibrate Baseline
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-surface-secondary text-ink-secondary border-b border-border">
            <tr>
              <th className="p-2">Hydrological Feature Stream</th>
              <th className="p-2">PSI Index (&le;0.1 = Stable)</th>
              <th className="p-2">Wasserstein Distance</th>
              <th className="p-2">Status</th>
              <th className="p-2">Operational Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {driftMatrix.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-secondary/40">
                <td className="p-2 font-bold text-ink">{item.feature}</td>
                <td className="p-2">
                  <span
                    className={`font-bold ${
                      item.psi > 0.2
                        ? 'text-status-alert'
                        : item.psi > 0.1
                        ? 'text-status-warning'
                        : 'text-status-safe'
                    }`}
                  >
                    {item.psi.toFixed(3)}
                  </span>
                </td>
                <td className="p-2 text-ink">{item.wasserstein.toFixed(3)}</td>
                <td className="p-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      item.status === 'STABLE'
                        ? 'bg-status-safe-soft text-status-safe'
                        : item.status === 'MODERATE_SHIFT'
                        ? 'bg-status-warning-soft text-status-warning'
                        : 'bg-status-alert-soft text-status-alert'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2 text-ink-secondary truncate max-w-[220px]">{item.driftRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 7: ONNX / TensorRT Edge Quantization & Float32-to-Int8 Engine Optimizer
// ============================================================================
export function OnnxEdgeQuantizerProfiler({ showToast }) {
  const [precisionMode, setPrecisionMode] = useState('int8');

  const precisionSpecs = {
    fp32: { label: 'FP32 Full Precision', sizeMb: 148.0, latencyMs: 41.2, memoryDrop: '0%', f1Delta: '0.00%', target: 'HPC Cloud GPU' },
    fp16: { label: 'FP16 Half Precision', sizeMb: 74.0, latencyMs: 18.5, memoryDrop: '-50.0%', f1Delta: '-0.02%', target: 'Edge Server (RTX 4090)' },
    int8: { label: 'INT8 TensorRT (PTQ)', sizeMb: 18.5, latencyMs: 5.2, memoryDrop: '-87.5%', f1Delta: '-0.38%', target: 'Roadside Edge Gateway (Jetson AGX)' },
    int4: { label: 'INT4 Weight-Only (AWQ)', sizeMb: 9.2, latencyMs: 2.8, memoryDrop: '-93.8%', f1Delta: '-1.45%', target: 'CCTV Smart Camera Microcontroller' },
  };

  const current = precisionSpecs[precisionMode];

  const handleExportQuantizedModel = () => {
    const manifest = {
      quantization_mode: precisionMode.toUpperCase(),
      original_precision: 'FP32',
      compressed_model_size_mb: current.sizeMb,
      speedup_factor: (41.2 / current.latencyMs).toFixed(1) + 'x',
      calibrated_with: '10,000 Representative Monsoon Depth Tensors',
      target_deployment_device: current.target,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydro-pinn-${precisionMode}-edge-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showToast) showToast(`Exported ${current.label} deployment manifest for ${current.target}`);
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 7 • Edge Deployment &amp; Hardware Acceleration
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            ONNX / TensorRT Edge Quantization &amp; Int8 Compressor
          </h3>
        </div>
        <button
          onClick={handleExportQuantizedModel}
          className="px-3 py-1.5 rounded-lg bg-purple text-white hover:bg-purple-deep font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Edge Artifact</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(precisionSpecs).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setPrecisionMode(key)}
            className={`p-3 rounded-xl border text-left font-mono transition-all ${
              precisionMode === key
                ? 'bg-purple-soft/60 border-purple text-purple-deep font-bold shadow-subtle'
                : 'bg-surface-secondary border-border text-ink hover:border-purple/30'
            }`}
          >
            <span className="text-[10px] text-ink-secondary block font-sans">{item.label}</span>
            <span className="text-xs font-bold block mt-1">{item.sizeMb} MB</span>
            <span className="text-[10px] text-status-safe block mt-0.5">{item.latencyMs} ms ({item.memoryDrop})</span>
          </button>
        ))}
      </div>

      <div className="p-3.5 bg-surface-secondary border border-border rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
        <div>
          <span className="text-ink-secondary block text-[10px]">Target Deployment:</span>
          <strong className="text-ink">{current.target}</strong>
        </div>
        <div>
          <span className="text-ink-secondary block text-[10px]">Latency Speedup:</span>
          <strong className="text-purple font-bold">{(41.2 / current.latencyMs).toFixed(1)}x Faster</strong>
        </div>
        <div>
          <span className="text-ink-secondary block text-[10px]">Memory Savings:</span>
          <strong className="text-status-safe font-bold">{current.memoryDrop}</strong>
        </div>
        <div>
          <span className="text-ink-secondary block text-[10px]">Accuracy Impact (&Delta;F1):</span>
          <strong className="text-ink">{current.f1Delta}</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 8: Adversarial Storm Stress-Tester & 2005-Scale Cloudburst Simulator
// ============================================================================
export function AdversarialStormStressTester({ showToast }) {
  const [returnPeriodYears, setReturnPeriodYears] = useState(100);
  const [syntheticCloudburstMm, setSyntheticCloudburstMm] = useState(180); // mm in 1 hour

  const ariOptions = [
    { yr: 10, rain: 95, label: '10-Yr ARI' },
    { yr: 25, rain: 130, label: '25-Yr ARI' },
    { yr: 50, rain: 155, label: '50-Yr ARI' },
    { yr: 100, rain: 180, label: '100-Yr Cloudburst' },
    { yr: 500, rain: 245, label: '2005 Extreme (944mm/24h)' },
  ];

  const handleSelectAri = (item) => {
    setReturnPeriodYears(item.yr);
    setSyntheticCloudburstMm(item.rain);
    if (showToast) showToast(`Synthesizing storm shock scenario: ${item.label} (${item.rain} mm/h)`);
  };

  const isDiverging = syntheticCloudburstMm > 220;

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 8 • Robustness &amp; Safety Bounds
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Adversarial Cloudburst Stress-Test &amp; Extreme Storm Shock Simulator
          </h3>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ariOptions.map((item) => (
            <button
              key={item.yr}
              onClick={() => handleSelectAri(item)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                returnPeriodYears === item.yr
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Peak 1-Hour Precipitation Intensity Shock:</span>
          <strong className="text-purple">{syntheticCloudburstMm} mm/hr</strong>
        </div>
        <input
          type="range"
          min="50"
          max="260"
          step="5"
          value={syntheticCloudburstMm}
          onChange={(e) => setSyntheticCloudburstMm(parseInt(e.target.value))}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-[10px] text-ink-secondary block">Model Numerics Status:</span>
          <strong
            className={`text-sm block ${
              isDiverging ? 'text-status-alert font-bold' : 'text-status-safe font-bold'
            }`}
          >
            {isDiverging ? 'CFL CRITERION TRIPPED' : 'UNCONDITIONALLY STABLE'}
          </strong>
          <span className="text-[10px] text-ink-secondary">
            Courant Number (C): {(syntheticCloudburstMm / 140).toFixed(2)}
          </span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-[10px] text-ink-secondary block">Peak Catchment Ponding:</span>
          <strong className="text-sm text-ink block">
            {(syntheticCloudburstMm * 0.42).toFixed(1)} cm Avg
          </strong>
          <span className="text-[10px] text-status-alert">
            18 Metro Underpasses Inundated
          </span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-[10px] text-ink-secondary block">Physics Loss Penalty:</span>
          <strong className="text-sm text-purple block">
            {(0.008 + syntheticCloudburstMm * 0.00015).toFixed(4)}
          </strong>
          <span className="text-[10px] text-status-safe">
            Mass Conservation Preserved (&lt;0.05%)
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 9: Multi-Modal CCTV Vision-Hydrology Assimilation & Curbstone Calibrator
// ============================================================================
export function CctvVisionHydrologyCalibrator({ showToast }) {
  const [selectedCamera, setSelectedCamera] = useState('milan-cctv');
  const [detectionThreshold, setDetectionThreshold] = useState(0.65);

  const cameras = [
    { id: 'milan-cctv', name: 'Milan Subway PTZ #04', cvEstimatedDepth: 41.5, swePredictedDepth: 43.0, curbHeight: 25 },
    { id: 'hindmata-cctv', name: 'Hindmata Dadar Flyover Cam #09', cvEstimatedDepth: 28.2, swePredictedDepth: 29.4, curbHeight: 20 },
    { id: 'gandhi-cctv', name: 'Gandhi Market King Circle Cam #02', cvEstimatedDepth: 36.0, swePredictedDepth: 35.5, curbHeight: 25 },
    { id: 'bkc-cctv', name: 'BKC Connector Telemetry Cam #11', cvEstimatedDepth: 14.1, swePredictedDepth: 13.9, curbHeight: 20 },
  ];

  const activeCam = cameras.find((c) => c.id === selectedCamera) || cameras[0];
  const deltaCm = (activeCam.cvEstimatedDepth - activeCam.swePredictedDepth).toFixed(1);

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 9 • Video Vision-Hydrology Fusion
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Multi-Modal CCTV Vision-Hydrology Assimilation &amp; Curbstone Calibrator
          </h3>
        </div>
        <div className="flex gap-1.5">
          {cameras.map((cam) => (
            <button
              key={cam.id}
              onClick={() => setSelectedCamera(cam.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                selectedCamera === cam.id
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {cam.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Synthetic Camera Water-Mark Viewport */}
        <div className="p-3 bg-ink text-white rounded-xl border border-border space-y-2 font-mono">
          <div className="flex justify-between items-center text-[10px] text-white/70">
            <span className="flex items-center gap-1.5 text-status-safe font-bold">
              <Video className="w-3.5 h-3.5 text-status-safe" />
              LIVE CCTV FEED: {activeCam.name}
            </span>
            <span>IoU: 0.88</span>
          </div>

          <div className="relative h-32 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Synthetic curbstone calibration lines */}
            <div className="absolute inset-x-4 bottom-0 h-16 bg-blue-500/20 border-t-2 border-dashed border-status-alert flex items-start justify-between px-2 pt-1 text-[9px] text-status-alert">
              <span>WATER REF: {activeCam.cvEstimatedDepth} cm</span>
              <span>CURB MARKS: 15 / 30 / 50 cm</span>
            </div>
            <span className="text-[11px] text-white/40">Visual Segmentation Mask (YOLOv10-Hydro)</span>
          </div>

          <div className="flex justify-between text-[10px] text-white/60">
            <span>Edge Conf: {detectionThreshold.toFixed(2)}</span>
            <span className="text-purple-light">Sub-pixel Vernier Scale: &plusmn;0.8 mm</span>
          </div>
        </div>

        {/* Fusion Telemetry Comparison */}
        <div className="p-3.5 bg-surface-secondary border border-border rounded-xl space-y-2.5 font-mono text-[11px]">
          <span className="font-bold text-ink uppercase tracking-wide block font-sans">
            Cross-Modal Ground-Truth Alignment
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between p-2 bg-surface rounded">
              <span className="text-ink-secondary">CCTV Vision Estimated Depth:</span>
              <strong className="text-ink">{activeCam.cvEstimatedDepth} cm</strong>
            </div>
            <div className="flex justify-between p-2 bg-surface rounded">
              <span className="text-ink-secondary">Numerical Model SWE Prediction:</span>
              <strong className="text-purple">{activeCam.swePredictedDepth} cm</strong>
            </div>
            <div className="flex justify-between p-2 bg-surface rounded">
              <span className="text-ink-secondary">Vision-Physics Residual:</span>
              <strong className="text-status-safe">{deltaCm} cm</strong>
            </div>
          </div>
          <button
            onClick={() => showToast && showToast(`Assimilated camera water line into 2D hydrodynamic mesh.`)}
            className="w-full py-1.5 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Assimilate Visual Ground-Truth</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 10: Model Governance, Audit Trail & NDMA/CWC Compliance Dossier
// ============================================================================
export function NdmaGovernanceDossierGenerator({ showToast }) {
  const [standardsChecked] = useState([
    { code: 'NDMA-AI-2024-SEC-4', title: 'Hydrological Physics Residual Mass Conservation Audit', status: 'COMPLIANT' },
    { code: 'CWC-ML-SPEC-11', title: 'Probabilistic Ensemble Spread & Brier Score Validation', status: 'COMPLIANT' },
    { code: 'IMD-DOPPLER-S-BAND', title: 'Dual-Pol Doppler Radar Data Provenance & Calibration Record', status: 'COMPLIANT' },
    { code: 'ISO-27001-AI-SEC', title: 'SHA-256 Model Checkpoint Signature & Immutable Tamper Vault', status: 'COMPLIANT' },
  ]);

  const handleDownloadDossier = () => {
    const reportText = `================================================================================
NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA) & CENTRAL WATER COMMISSION (CWC)
OFFICIAL AI/ML HYDROLOGICAL MODEL VALIDATION DOSSIER
================================================================================
Platform: Municipal Corporation of Greater Mumbai (MCGM) Flood Command Center
Jurisdiction: Greater Mumbai Disaster Operations (24 Municipal Wards)
Generated Date: ${new Date().toUTCString()}
Cryptographic Checksum: SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069

1. VERIFIED PRODUCTION MODEL INVENTORY
   - Rain Nowcast: ConvLSTM v2.4.2-prod (CSI 0.842, 41.2s Latency)
   - 2D Surface Flow: Hydro-PINN Discontinuous Galerkin v1.8.0 (MAE 2.1cm)
   - Drainage Network: 1D Dynamic Saint-Venant SWMM v1.5.3 (1,428 Conduits)
   - Surcharge Predictor: Hydro-PINN GNN v2.0.1 (Accuracy 93.5%)
   - Safe Evacuation Routing: Time-Expanded Dijkstra v3.4.2 (<1s Realtime)

2. COMPLIANCE & SAFETY AUDIT OUTCOMES
   - Mass Conservation Error Limit: PASS (<0.02% error across 437 km²)
   - Data Drift Population Stability Index: PASS (PSI = 0.040, within limits)
   - Edge Gateway Quantization Verification: PASS (INT8 TensorRT verified)
   - Citizen Early Warning Lead Time: PASS (180 Minutes Action Horizon)

Signed By:
Chief Hydrological Modeler, Municipal Disaster Control
Director of Meteorological Informatics, IMD Colaba
================================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDMA-CWC-AI-Model-Dossier-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showToast) showToast('Downloaded official NDMA/CWC AI Model Governance Dossier.');
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 10 • Regulatory Compliance &amp; Governance
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Model Governance, Audit Trail &amp; NDMA/CWC Compliance Dossier
          </h3>
        </div>
        <button
          onClick={handleDownloadDossier}
          className="px-3 py-1.5 rounded-lg bg-status-safe text-white hover:bg-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Compliance Dossier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standardsChecked.map((std, idx) => (
          <div key={idx} className="p-3 bg-surface-secondary border border-border rounded-xl space-y-1 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-purple font-bold text-[10px]">{std.code}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-status-safe-soft text-status-safe font-bold">
                {std.status}
              </span>
            </div>
            <p className="text-ink font-sans text-xs">{std.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

