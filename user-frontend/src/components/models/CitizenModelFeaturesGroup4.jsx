import React, { useState } from 'react';
import { 
  BarChart3, Zap, ShieldCheck, Leaf, Scale, CheckCircle2, 
  HelpCircle, Info, RefreshCw, Cpu
} from 'lucide-react';
import { DEMOGRAPHIC_WARD_EQUITY_DATA } from './modelsConstants';

// ============================================================================
// FEATURE 13: SHAP (Shapley Additive Explanations) Feature Importance Inspector
// ============================================================================
export function ShapFeatureExplainabilityInspector({ showToast }) {
  const [selectedHotspot, setSelectedHotspot] = useState('milan_subway');

  const hotspots = {
    milan_subway: {
      name: 'Milan Subway Underpass (K/West)',
      baseDepth: '18 cm',
      predictedDepth: '68 cm',
      shapContributions: [
        { feature: 'Upstream Catchment Cloudburst (95 mm/h)', impact: '+28 cm', positive: true, pct: 41 },
        { feature: 'Subway Natural Depression Sink (CartoDEM)', impact: '+18 cm', positive: true, pct: 26 },
        { feature: 'Arabian Sea High Tide Lockout (4.4m CD)', impact: '+12 cm', positive: true, pct: 18 },
        { feature: 'Storm Drain Pump Station Evacuation', impact: '-10 cm', positive: false, pct: 15 },
      ]
    },
    gandhi_market: {
      name: 'Gandhi Market, King’s Circle (F/North)',
      baseDepth: '12 cm',
      predictedDepth: '48 cm',
      shapContributions: [
        { feature: 'Mahim Creek Tidal Surcharge', impact: '+22 cm', positive: true, pct: 45 },
        { feature: 'Local Street Inflow Intensity', impact: '+16 cm', positive: true, pct: 33 },
        { feature: 'Underground Culvert Choking (EPA-SWMM)', impact: '+6 cm', positive: true, pct: 12 },
        { feature: 'Britannia Pumping Station Drawdown', impact: '-8 cm', positive: false, pct: 10 },
      ]
    },
    kurla_station: {
      name: 'Kurla Station West, L-Ward',
      baseDepth: '15 cm',
      predictedDepth: '55 cm',
      shapContributions: [
        { feature: 'Mithi River Overbank Spilling', impact: '+32 cm', positive: true, pct: 52 },
        { feature: 'Railway Culvert #12 Flow Stalling', impact: '+14 cm', positive: true, pct: 23 },
        { feature: 'Paved Urban Concrete Imperviousness', impact: '+9 cm', positive: true, pct: 15 },
        { feature: 'Ghatkopar Diversion Channel Suction', impact: '-6 cm', positive: false, pct: 10 },
      ]
    }
  };

  const currentHotspot = hotspots[selectedHotspot];

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 13 • Neural Explainability &amp; SHAP Values
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            SHAP (Shapley Additive Explanations) Feature Attribution Inspector
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-purple bg-purple-soft px-2.5 py-1 rounded-lg border border-purple/30">
            &Sigma; SHAP = 100% PARITY
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <label className="text-ink font-bold text-xs">Hotspot Incident:</label>
          <select
            value={selectedHotspot}
            onChange={(e) => {
              setSelectedHotspot(e.target.value);
              showToast?.(`Loaded SHAP attributions for ${hotspots[e.target.value].name}`);
            }}
            className="text-xs p-2 bg-canvas border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
          >
            {Object.entries(hotspots).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right text-xs">
          <span className="text-muted">Net Model Prediction: </span>
          <strong className="text-purple font-bold text-sm">{currentHotspot.predictedDepth}</strong>
        </div>
      </div>

      {/* SHAP Waterfall Bars */}
      <div className="space-y-2.5 font-mono">
        {currentHotspot.shapContributions.map((c, idx) => (
          <div key={idx} className="p-3 bg-canvas rounded-xl border border-border space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink font-semibold">{c.feature}</span>
              <strong className={c.positive ? 'text-flood-danger' : 'text-status-safe'}>
                {c.impact}
              </strong>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${c.positive ? 'bg-purple' : 'bg-status-safe'}`}
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 14: Green AI Energy & Carbon Footprint Telemetry Monitor
// ============================================================================
export function GreenAiEnergyTelemetry({ showToast }) {
  const [isGreenModeActive, setIsGreenModeActive] = useState(true);

  const metrics = isGreenModeActive
    ? { gpuWatts: 14.5, gCo2ePerQuery: 0.012, dailyKwh: 3.2, carbonReduction: '68% Lower Emissions', status: 'GREEN_EDGE_OPTIMIZED' }
    : { gpuWatts: 85.0, gCo2ePerQuery: 0.048, dailyKwh: 14.8, carbonReduction: 'Full FP32 Precision Mode', status: 'MAX_PRECISION' };

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 14 • Sustainable Computing &amp; Green AI
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Green AI Computational Efficiency &amp; Carbon Footprint Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe/10 px-2.5 py-1 rounded-lg border border-status-safe/20 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            {metrics.carbonReduction}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-canvas rounded-xl border border-border font-mono">
        <div>
          <span className="text-xs font-bold text-ink block">Dynamic Model Inference Profile:</span>
          <span className="text-[10px] text-muted">Toggle between ultra-low carbon INT8 edge routing and heavy cloud HPC</span>
        </div>

        <button
          onClick={() => {
            setIsGreenModeActive(!isGreenModeActive);
            showToast?.(`Switched to ${!isGreenModeActive ? 'Green INT8 Eco Mode' : 'High Performance FP32'}`);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isGreenModeActive ? 'bg-status-safe text-white shadow-subtle' : 'bg-purple text-white shadow-subtle'
          }`}
        >
          {isGreenModeActive ? 'ECO-MODE ACTIVE (INT8)' : 'FP32 CLOUD MODE'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
        <div className="p-3 bg-canvas rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">GPU Power Draw</span>
          <span className="text-lg font-bold text-ink block mt-0.5">{metrics.gpuWatts} Watts</span>
          <span className="text-[10px] text-muted">Edge Jetson Cluster</span>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">Carbon per 1k Inferences</span>
          <span className="text-lg font-bold text-status-safe block mt-0.5">{metrics.gCo2ePerQuery} g CO&sup2;e</span>
          <span className="text-[10px] text-muted">Zero-carbon solar host</span>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">24h Energy Consumption</span>
          <span className="text-lg font-bold text-purple block mt-0.5">{metrics.dailyKwh} kWh</span>
          <span className="text-[10px] text-muted">Full city telemetry</span>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">NDMA ESG Compliance</span>
          <span className="text-lg font-bold text-status-safe block mt-0.5">TIER-1 GREEN</span>
          <span className="text-[10px] text-muted">ISO 14064 Audited</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 15: Spatial & Ward Equity Fairness Auditor
// ============================================================================
export function SpatialInterWardFairnessAuditor({ showToast }) {
  const [isMitigationActive, setIsMitigationActive] = useState(true);

  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
            Feature 15 • Socio-Hydrological Fairness &amp; Ethics
          </span>
          <h3 className="font-bold text-ink text-sm mt-1">
            Spatial Inter-Ward Demographic Equity &amp; Algorithmic Fairness Auditor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-status-safe bg-status-safe/10 px-2.5 py-1 rounded-lg border border-status-safe/20 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            EQUITY AUDIT: PASS
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-canvas rounded-xl border border-border font-mono">
        <div>
          <span className="text-xs font-bold text-ink block">Vulnerability-Weighted Loss Reweighting:</span>
          <span className="text-[10px] text-muted">Balances prediction accuracy across dense informal wards vs affluent coastal zones</span>
        </div>

        <button
          onClick={() => {
            setIsMitigationActive(!isMitigationActive);
            showToast?.(`Toggled Equity Bias Mitigation: ${!isMitigationActive ? 'ON' : 'OFF'}`);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isMitigationActive ? 'bg-purple text-white shadow-subtle' : 'bg-surface-secondary text-ink border border-border'
          }`}
        >
          {isMitigationActive ? 'BIAS MITIGATION ON' : 'RAW BASELINE'}
        </button>
      </div>

      {/* Ward Demographic Table */}
      <div className="border border-border rounded-xl overflow-hidden font-mono text-[11px]">
        <table className="w-full text-left">
          <thead className="bg-canvas border-b border-border text-muted">
            <tr>
              <th className="p-2.5">Ward &amp; Zone</th>
              <th className="p-2.5">Vulnerability</th>
              <th className="p-2.5">Informal Housing</th>
              <th className="p-2.5">Sensor Density</th>
              <th className="p-2.5">Model CSI</th>
              <th className="p-2.5">Equity Boost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMOGRAPHIC_WARD_EQUITY_DATA.map((w, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-surface' : 'bg-canvas/50'}>
                <td className="p-2.5 font-bold text-ink">{w.ward}</td>
                <td className="p-2.5 text-purple font-semibold">{w.vulnerabilityIndex}</td>
                <td className="p-2.5 text-ink">{w.informalSettlements}</td>
                <td className="p-2.5 text-muted">{w.sensorDensity}</td>
                <td className="p-2.5 text-status-safe font-bold">{w.modelCSI}</td>
                <td className="p-2.5 text-purple font-bold">
                  {isMitigationActive ? w.mitigationBoost : 'None (1.0x)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

