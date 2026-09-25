import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Scale,
  Zap,
  Truck,
  Flame,
  Radio,
} from 'lucide-react';

// ============================================================================
// FEATURE 11: Monte Carlo Stochastic Flood Uncertainty Envelope (P10, P50, P90)
// ============================================================================
export function MonteCarloUncertaintyEnvelope({ showToast }) {
  const [riskTolerancePercentile, setRiskTolerancePercentile] = useState(90); // 10, 50, 90
  const [evacThresholdCm, setEvacThresholdCm] = useState(40);

  const forecastPoints = [
    { time: '0m', p10: 12, p50: 14, p90: 16 },
    { time: '+30m', p10: 18, p50: 24, p90: 31 },
    { time: '+60m', p10: 24, p50: 34, p90: 45 },
    { time: '+90m', p10: 28, p50: 41, p90: 58 },
    { time: '+120m', p10: 22, p50: 36, p90: 52 },
    { time: '+150m', p10: 15, p50: 26, p90: 39 },
    { time: '+180m', p10: 8, p50: 16, p90: 25 },
  ];

  const peakP90 = Math.max(...forecastPoints.map((p) => p.p90));
  const triggersEvacuation = peakP90 >= evacThresholdCm;

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 11 • Stochastic Risk Propagation
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Monte Carlo Uncertainty Envelope (P<sub>10</sub>, P<sub>50</sub>, P<sub>90</sub> Probabilistic Fan)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-secondary">500 Stochastic Runs</span>
          <span
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold ${
              triggersEvacuation
                ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
            }`}
          >
            {triggersEvacuation ? 'EVACUATION THRESHOLD BREACH' : 'BELOW EVAC THRESHOLD'}
          </span>
        </div>
      </div>

      <div className="p-3 bg-surface-secondary rounded-xl space-y-1.5 border border-border font-mono text-[11px]">
        <div className="flex justify-between text-ink">
          <span>Municipal Evacuation Water Level Trigger:</span>
          <strong className="text-purple">{evacThresholdCm} cm</strong>
        </div>
        <input
          type="range"
          min="20"
          max="70"
          step="5"
          value={evacThresholdCm}
          onChange={(e) => setEvacThresholdCm(parseInt(e.target.value))}
          className="w-full accent-purple h-1.5 bg-border rounded cursor-pointer"
        />
      </div>

      {/* SVG Uncertainty Fan Chart */}
      <div className="p-4 bg-ink text-white rounded-xl space-y-2 border border-border">
        <div className="flex justify-between text-[11px] font-mono text-white/70">
          <span>Stochastic Inundation Depth Over Lead Time</span>
          <span className="text-purple-light font-bold">Peak P90: {peakP90} cm</span>
        </div>

        <div className="relative h-32 w-full bg-white/5 rounded-lg p-2 flex items-end justify-between gap-2 border border-white/10">
          {forecastPoints.map((pt, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative">
              {/* P90 Bar (Red/Alert) */}
              <div
                className="w-full bg-status-alert/30 rounded-t border-t border-status-alert"
                style={{ height: `${(pt.p90 / 60) * 85}%` }}
              />
              {/* P50 Bar (Purple) */}
              <div
                className="w-full bg-purple/70 rounded-t -mt-full"
                style={{ height: `${(pt.p50 / 60) * 85}%` }}
              />
              {/* P10 Bar (Safe) */}
              <div
                className="w-full bg-status-safe rounded-t -mt-full"
                style={{ height: `${(pt.p10 / 60) * 85}%` }}
              />
              <span className="text-[8px] font-mono text-white/50 mt-1">{pt.time}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-white/60 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-status-safe inline-block" />
            P10 Best-Case
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple inline-block" />
            P50 Median Expectation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-status-alert inline-block" />
            P90 Extreme Tail Risk
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 12: Automated Retraining Pipeline Orchestrator & Monsoon Continuous Learning
// ============================================================================
export function RetrainingPipelineOrchestrator({ showToast }) {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.042);
  const [batchSize, setBatchSize] = useState(32);

  const handleStartTrainingRun = () => {
    setIsTraining(true);
    setEpoch(0);
    setLoss(0.042);

    let ep = 0;
    const timer = setInterval(() => {
      ep += 1;
      setEpoch(ep);
      setLoss((prev) => parseFloat((prev * 0.78).toFixed(4)));

      if (ep >= 6) {
        clearInterval(timer);
        setIsTraining(false);
        if (showToast) {
          showToast('Continuous learning checkpoint saved: loss converged to 0.0094.');
        }
      }
    }, 800);
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 12 • MLOps Orchestration
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Automated Retraining Pipeline &amp; Monsoon Continuous Learning Loop
          </h3>
        </div>
        <button
          onClick={handleStartTrainingRun}
          disabled={isTraining}
          className="px-3.5 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {isTraining ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isTraining ? `Training Epoch ${epoch}/6...` : 'Trigger Retraining Job'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Batch Size:</span>
          <strong className="text-ink text-xs block mt-0.5">{batchSize} Hydrographs</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Learning Rate Schedule:</span>
          <strong className="text-purple text-xs block mt-0.5">Cosine Decay (1e-4)</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Training Step Epoch:</span>
          <strong className="text-ink text-xs block mt-0.5">{epoch} / 6</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Composite Physics Loss:</span>
          <strong className="text-status-safe text-xs block mt-0.5">{loss}</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 13: Emergency Route Optimizer (Time-Expanded Dijkstra) Profiler
// ============================================================================
export function EmergencyRouteProfiler({ showToast }) {
  const [vehicleType, setVehicleType] = useState('ambulance');

  const fleetSpecs = {
    ambulance: { name: '108 Emergency Ambulance', maxWadingCm: 25, passableRoutesPct: '74%', detourDelay: '+8 mins', clearanceStatus: 'PASSABLE WITH DETOUR' },
    ndrfBoat: { name: 'NDRF Inflatable Rescue Boat', maxWadingCm: 999, passableRoutesPct: '100%', detourDelay: '0 mins', clearanceStatus: 'UNRESTRICTED WATERWAY' },
    fireTender: { name: 'BMC Heavy 4x4 Fire Tender', maxWadingCm: 65, passableRoutesPct: '92%', detourDelay: '+2 mins', clearanceStatus: 'DIRECT ROUTE' },
    sedan: { name: 'Citizen Passenger Sedan', maxWadingCm: 15, passableRoutesPct: '42%', detourDelay: '+26 mins', clearanceStatus: 'SEVERE CHOKEPOINTS' },
  };

  const activeSpec = fleetSpecs[vehicleType];

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 13 • Dynamic Mobility Routing
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Emergency Mobility Route Optimizer (Time-Expanded Dijkstra Profiler)
          </h3>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(fleetSpecs).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setVehicleType(key);
                if (showToast) showToast(`Re-routed CAD graph for ${item.name}`);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                vehicleType === key
                  ? 'bg-purple text-white'
                  : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {item.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Max Wading Depth:</span>
          <strong className="text-ink text-xs block mt-0.5">{activeSpec.maxWadingCm} cm</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Passable City Corridors:</span>
          <strong className="text-purple text-xs block mt-0.5">{activeSpec.passableRoutesPct}</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Detour Delay Penalty:</span>
          <strong className="text-status-warning text-xs block mt-0.5">{activeSpec.detourDelay}</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Navigation Advisory:</span>
          <strong className="text-status-safe text-xs block mt-0.5">{activeSpec.clearanceStatus}</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 14: Green AI HPC Carbon & GPU Cluster Energy Telemetry
// ============================================================================
export function GreenAiEnergyTelemetry({ showToast }) {
  const [ecoMode, setEcoMode] = useState(false);

  const powerKw = ecoMode ? 3.4 : 6.8;
  const carbonGrams = ecoMode ? 142 : 285;

  const toggleEco = () => {
    setEcoMode(!ecoMode);
    if (showToast) {
      showToast(ecoMode ? 'Eco-Inference disabled (Full resolution 250m mesh)' : 'Eco-Inference enabled (-48% energy footprint)');
    }
  };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-status-safe bg-status-safe-soft px-2 py-0.5 rounded">
            Feature 14 • Sustainability &amp; Carbon Footprint
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Green AI &amp; High-Performance Computing (HPC) Carbon Telemetry
          </h3>
        </div>
        <button
          onClick={toggleEco}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
            ecoMode
              ? 'bg-status-safe text-white'
              : 'bg-surface-secondary text-ink hover:bg-surface-secondary/80 border border-border'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>{ecoMode ? 'Eco-Mode Active (-48% Power)' : 'Enable Eco-Inference'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Cluster Power Draw:</span>
          <strong className="text-ink text-xs block mt-0.5">{powerKw} kW</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Carbon Emissions:</span>
          <strong className="text-status-safe text-xs block mt-0.5">{carbonGrams} g CO&sub2;/cycle</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Inference Efficiency:</span>
          <strong className="text-purple text-xs block mt-0.5">14.8 J/km&sup2;</strong>
        </div>
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <span className="text-ink-secondary text-[10px] block">Compute Hardware:</span>
          <strong className="text-ink text-xs block mt-0.5">8x NVIDIA H100 SXM5</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 15: Spatial Prediction Fairness & Inter-Ward Parity Auditor
// ============================================================================
export function SpatialInterWardFairnessAuditor({ showToast }) {
  const wards = [
    { ward: 'Ward G/N (Dharavi / Dadar)', sensorDensity: 'High (8 gauges)', fpr: '3.8%', fnr: '2.4%', parityIndex: '0.96' },
    { ward: 'Ward L (Kurla West)', sensorDensity: 'High (11 gauges)', fpr: '4.1%', fnr: '2.8%', parityIndex: '0.94' },
    { ward: 'Ward H/E (Bandra East / BKC)', sensorDensity: 'Medium (6 gauges)', fpr: '2.5%', fnr: '1.9%', parityIndex: '0.98' },
    { ward: 'Ward M/E (Govandi / Mankhurd)', sensorDensity: 'Low (3 gauges - Under-instrumented)', fpr: '6.4%', fnr: '5.2%', parityIndex: '0.88' },
  ];

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 15 • Algorithmic Fairness &amp; Equity
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Spatial Model Fairness &amp; Inter-Ward Prediction Parity Auditor
          </h3>
        </div>
        <button
          onClick={() => showToast && showToast('Dispatched sensor augmentation request for Ward M/E Govandi.')}
          className="px-3 py-1.5 bg-purple text-white hover:bg-purple-deep rounded-lg font-mono text-[11px] font-semibold transition-colors"
        >
          Flag Sensor Gaps
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-surface-secondary text-ink-secondary border-b border-border">
            <tr>
              <th className="p-2">Municipal Ward Catchment</th>
              <th className="p-2">Sensor Telemetry Density</th>
              <th className="p-2">False Alarm Rate (FPR)</th>
              <th className="p-2">Miss Rate (FNR)</th>
              <th className="p-2">Equality of Odds Parity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {wards.map((w, idx) => (
              <tr key={idx} className="hover:bg-surface-secondary/40">
                <td className="p-2 font-bold text-ink">{w.ward}</td>
                <td className="p-2 text-ink">{w.sensorDensity}</td>
                <td className="p-2 text-status-warning font-bold">{w.fpr}</td>
                <td className="p-2 text-status-alert font-bold">{w.fnr}</td>
                <td className="p-2">
                  <span
                    className={`font-bold ${
                      parseFloat(w.parityIndex) > 0.92 ? 'text-status-safe' : 'text-status-warning'
                    }`}
                  >
                    {w.parityIndex}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

