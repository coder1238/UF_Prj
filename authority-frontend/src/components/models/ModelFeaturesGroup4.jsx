import React, { useState } from 'react';
import {
  GitCommit,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  Activity,
  Layers,
  BarChart2,
  ShieldAlert,
  Sliders,
  Check,
  X,
  Download,
} from 'lucide-react';
import { CANARY_CONFIG_DEFAULT } from './modelsConstants';

// ============================================================================
// FEATURE 16: Human-in-the-Loop Active Learning & False-Alarm Review Queue
// ============================================================================
export function ActiveLearningReviewQueue({ showToast }) {
  const [cases, setCases] = useState([
    { id: 'AL-104', location: 'Dadar TT Circle Bus Depot', flaggedBy: 'Traffic Warden Cam #14', mlPredDepth: 28, sensorObs: 4, status: 'PENDING' },
    { id: 'AL-105', location: 'Chunabhatti Railway Line Subway', flaggedBy: 'IoT Ultrasonic Gauge #08', mlPredDepth: 12, sensorObs: 34, status: 'PENDING' },
    { id: 'AL-106', location: 'Sion Circle Flyover Slipway', flaggedBy: 'Field Engineer App Report', mlPredDepth: 38, sensorObs: 36, status: 'RESOLVED' },
  ]);

  const handleResolve = (id, resolution) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: resolution } : c))
    );
    if (showToast) showToast(`Case ${id} marked as ${resolution}. Appended to active learning queue.`);
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 16 • Human-in-the-Loop MLOps
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Active Learning &amp; Anomaly False-Alarm Review Queue
          </h3>
        </div>
        <button
          onClick={() => showToast && showToast('Exported curated active learning dataset to fine-tuning cluster.')}
          className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-mono text-[11px] font-semibold transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Curated Dataset</span>
        </button>
      </div>

      <div className="space-y-2">
        {cases.map((c) => (
          <div
            key={c.id}
            className="p-3 bg-surface-secondary border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
          >
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-purple text-[11px]">{c.id}</strong>
                <span className="text-ink font-sans font-bold">{c.location}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    c.status === 'PENDING'
                      ? 'bg-status-warning-soft text-status-warning'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1">
                Source: {c.flaggedBy} • Model: <strong className="text-purple">{c.mlPredDepth}cm</strong> vs Observed: <strong className="text-ink">{c.sensorObs}cm</strong>
              </p>
            </div>

            {c.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResolve(c.id, 'ACCEPTED_GROUND_TRUTH')}
                  className="px-2.5 py-1 bg-status-safe text-white hover:bg-emerald-700 rounded text-[10px] font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Accept Ground Truth</span>
                </button>
                <button
                  onClick={() => handleResolve(c.id, 'REJECTED_FALSE_ALARM')}
                  className="px-2.5 py-1 bg-surface border border-border text-ink hover:bg-surface-secondary rounded text-[10px] font-semibold flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reject Sensor Glitch</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 17: Tidal Lockout & Sluice Gate Hydrodynamic Coupling Co-Simulator
// ============================================================================
export function TidalSluiceGateCoSimulator({ showToast }) {
  const [tideLevelM, setTideLevelM] = useState(4.25); // Spring tide in meters MSL
  const [sluiceGateState, setSluiceGateState] = useState('AUTO_TIDE_LOCKED');

  const isLockoutActive = tideLevelM >= 3.6;

  const handleToggleGate = () => {
    const newState = sluiceGateState === 'OPEN_OVERRIDE' ? 'AUTO_TIDE_LOCKED' : 'OPEN_OVERRIDE';
    setSluiceGateState(newState);
    if (showToast) {
      showToast(`Sluice gate state set to: ${newState}`);
    }
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 17 • Marine-Catchment Boundary Condition
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Tidal Lockout &amp; Sluice Gate Hydrodynamic Coupling Co-Simulator
          </h3>
        </div>
        <button
          onClick={handleToggleGate}
          className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-mono text-[11px] font-semibold transition-colors"
        >
          {sluiceGateState === 'OPEN_OVERRIDE' ? 'Revert to Auto-Lock' : 'Emergency Gate Override'}
        </button>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Arabian Sea Astronomical Tide Level:</span>
          <strong className="text-purple">{tideLevelM.toFixed(2)} m MSL</strong>
        </div>
        <input
          type="range"
          min="1.2"
          max="5.1"
          step="0.05"
          value={tideLevelM}
          onChange={(e) => setTideLevelM(parseFloat(e.target.value))}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-ink-secondary text-[10px] block">Flap Gate Lockout:</span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
              isLockoutActive
                ? 'bg-status-alert-soft text-status-alert'
                : 'bg-status-safe-soft text-status-safe'
            }`}
          >
            {isLockoutActive ? 'LOCKED OUT (SEA LEVEL HIGHER)' : 'FREE GRAVITY DISCHARGE'}
          </span>
          <span className="text-[10px] text-ink-secondary block">Threshold: 3.60 m MSL</span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-ink-secondary text-[10px] block">Backpressure Surge Head:</span>
          <strong className="text-sm text-ink block">
            {isLockoutActive ? `+${((tideLevelM - 3.6) * 100).toFixed(0)} cm H2O` : '0 cm (Depressurized)'}
          </strong>
          <span className="text-[10px] text-ink-secondary">Affecting 428 Coastal Storm Inlets</span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-xl space-y-1">
          <span className="text-ink-secondary text-[10px] block">Coastal Pumping Stations:</span>
          <strong className="text-sm text-purple block">
            {isLockoutActive ? 'PUMP DISCHARGE MANDATORY' : 'STANDBY IDLE'}
          </strong>
          <span className="text-[10px] text-status-safe">Lovegrove &amp; Cleveland Bunder Sync</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 18: Blue/Green Canary Deployment & Model Version Rollback Manager
// ============================================================================
export function CanaryRollbackManager({ showToast }) {
  const [canaryConfig, setCanaryConfig] = useState(CANARY_CONFIG_DEFAULT);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const handleSlider = (val) => {
    setCanaryConfig((prev) => ({ ...prev, trafficSplitPct: parseInt(val) }));
  };

  const handleRollback = () => {
    setIsRollingBack(true);
    setTimeout(() => {
      setIsRollingBack(false);
      setCanaryConfig((prev) => ({
        ...prev,
        trafficSplitPct: 0,
        candidateVersion: 'ROLLED_BACK (v2.4.2-prod active 100%)',
      }));
      if (showToast) {
        showToast('Emergency Rollback Executed: 100% traffic restored to stable v2.4.2-prod.');
      }
    }, 1000);
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 18 • Zero-Downtime Deployment
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Blue/Green Canary Deployment &amp; Instant Rollback Manager
          </h3>
        </div>
        <button
          onClick={handleRollback}
          disabled={isRollingBack || canaryConfig.trafficSplitPct === 0}
          className="px-3 py-1.5 bg-status-alert text-white hover:bg-rose-700 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {isRollingBack ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          <span>Instant Rollback to Prod</span>
        </button>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Canary Traffic Routing Split:</span>
          <strong className="text-purple">{canaryConfig.trafficSplitPct}% Candidate</strong>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={canaryConfig.trafficSplitPct}
          onChange={(e) => handleSlider(e.target.value)}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-ink-secondary">
          <span>Production: {100 - canaryConfig.trafficSplitPct}% ({canaryConfig.activeProdVersion})</span>
          <span>Canary: {canaryConfig.trafficSplitPct}% ({canaryConfig.candidateVersion})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Prod Error Rate:</span>
          <strong className="text-status-safe text-xs block mt-0.5">{canaryConfig.prodErrorRate}</strong>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Canary Error Rate:</span>
          <strong className="text-status-safe text-xs block mt-0.5">{canaryConfig.candidateErrorRate}</strong>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Candidate Speedup:</span>
          <strong className="text-purple text-xs block mt-0.5">{canaryConfig.candidateLatency}</strong>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Rollback Guard:</span>
          <strong className="text-ink text-xs block mt-0.5">Automated Circuit Breaker</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 19: SHAP & Integrated Gradients Feature Explainability Inspector
// ============================================================================
export function ShapFeatureExplainabilityInspector({ showToast }) {
  const [selectedHotspot, setSelectedHotspot] = useState('hindmata');

  const hotspots = {
    hindmata: {
      name: 'Hindmata Flyover Underbelly',
      predDepth: '29.4 cm',
      factors: [
        { feature: 'Upstream Radar Intensity (58 mm/h)', impact: '+42%', isPositive: true },
        { feature: 'Soil Saturated Infiltration Deficit', impact: '+24%', isPositive: true },
        { feature: 'High Tide Lockout Backpressure', impact: '+18%', isPositive: true },
        { feature: 'Culvert Throat Restriction Factor', impact: '+11%', isPositive: true },
        { feature: 'Topographic Slope Elevation Gradient', impact: '-5%', isPositive: false },
      ],
    },
    milan: {
      name: 'Milan Subway Santacruz',
      predDepth: '42.1 cm',
      factors: [
        { feature: 'Depression Bowl Topography', impact: '+48%', isPositive: true },
        { feature: 'Irkalla Nullah Backpressure Head', impact: '+28%', isPositive: true },
        { feature: 'Runoff Overland Convergence', impact: '+16%', isPositive: true },
        { feature: 'Auxiliary Pumping Discharge Rate', impact: '-12%', isPositive: false },
      ],
    },
  };

  const activeData = hotspots[selectedHotspot];

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 19 • Explainable AI (XAI)
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            SHAP Waterfall &amp; Feature Attribution Explainability Inspector
          </h3>
        </div>
        <div className="flex gap-2">
          {Object.entries(hotspots).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedHotspot(key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                selectedHotspot === key
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {item.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-surface border border-border rounded-xl space-y-2.5">
        <div className="flex justify-between items-center font-mono text-[11px] pb-1 border-b border-border">
          <span className="font-sans font-bold text-ink">{activeData.name}</span>
          <span className="text-purple font-bold">Predicted Depth: {activeData.predDepth}</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          {activeData.factors.map((f, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-surface-secondary/70 rounded-lg">
              <span className="text-ink">{f.feature}</span>
              <strong
                className={`font-bold ${
                  f.isPositive ? 'text-status-alert' : 'text-status-safe'
                }`}
              >
                {f.impact}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 20: Real-Time Audio Telemetry & Acoustic Model Health Sonification
// ============================================================================
export function WebAudioTelemetrySonification({ showToast }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [pitchHz, setPitchHz] = useState(440);

  const playSynthesizerChime = (freq = pitchHz, durationMs = 150) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn('Web Audio not accessible:', e);
    }
  };

  const handleTestChime = () => {
    playSynthesizerChime(pitchHz, 200);
    if (showToast) showToast(`Synthesized telemetry ping at ${pitchHz} Hz.`);
  };

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    if (next) {
      playSynthesizerChime(523.25, 180); // C5
    }
    if (showToast) {
      showToast(next ? 'Audio sonification telemetry enabled.' : 'Audio sonification telemetry muted.');
    }
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 20 • Acoustic Sonification Telemetry
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Real-Time Audio Telemetry &amp; Acoustic Model Health Sonification
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
              isAudioEnabled
                ? 'bg-status-safe text-white'
                : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80 border border-border'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioEnabled ? 'Audio Active' : 'Unmute Telemetry'}</span>
          </button>
          <button
            onClick={handleTestChime}
            className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Tone</span>
          </button>
        </div>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Inference Pulse Frequency Modulation:</span>
          <strong className="text-purple">{pitchHz} Hz (Nominal Pipeline Health)</strong>
        </div>
        <input
          type="range"
          min="220"
          max="880"
          step="20"
          value={pitchHz}
          onChange={(e) => setPitchHz(parseInt(e.target.value))}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-ink-secondary">
          <span>220 Hz (Low Latency / Stable Convergence)</span>
          <span>880 Hz (High Latency Spikes / Anomaly Warning)</span>
        </div>
      </div>
    </div>
  );
}

