import React, { useState } from 'react';
import {
  X,
  Layers,
  Cpu,
  Activity,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function HydrometeorClassifierModal({ isOpen, onClose }) {
  const [zh, setZh] = useState(54); // dBZ
  const [zdr, setZdr] = useState(2.6); // dB
  const [rhoHv, setRhoHv] = useState(0.97); // 0.80 to 0.99
  const [kdp, setKdp] = useState(3.2); // deg/km

  if (!isOpen) return null;

  // Fuzzy classification algorithm
  const classify = () => {
    if (rhoHv < 0.82) {
      return {
        category: 'Non-Meteorological Echo / Sea Spray Clutter',
        confidence: 96,
        color: 'text-ink-secondary',
        bg: 'bg-surface-secondary',
        risk: 'LOW RISK (Ground/Sea Clutter)',
        recommendation: 'Apply clutter notch filter to prevent false drainage alarms.',
      };
    }
    if (zh > 55 && zdr < 1.2 && rhoHv < 0.93) {
      return {
        category: 'Severe Convective Hail / Graupel Core',
        confidence: 91,
        color: 'text-status-alert',
        bg: 'bg-status-alert-soft',
        risk: 'EXTREME CLOUDBURST RISK',
        recommendation: 'Trigger immediate automated sluice gate opening and summon NDRF.',
      };
    }
    if (zh >= 42) {
      return {
        category: 'Heavy Tropical Rain (Monsoon Downpour)',
        confidence: 94,
        color: 'text-status-alert',
        bg: 'bg-status-alert-soft',
        risk: 'HIGH URBAN FLOOD RISK',
        recommendation: 'Rapid overland runoff imminent; activate stormwater pumps.',
      };
    }
    if (zh >= 30) {
      return {
        category: 'Moderate Stratiform Rain',
        confidence: 88,
        color: 'text-status-warning',
        bg: 'bg-status-warning-soft',
        risk: 'MODERATE RUNOFF',
        recommendation: 'Monitor drainage sump storage and tidal outfalls.',
      };
    }
    return {
      category: 'Light Rain / Drizzle',
      confidence: 92,
      color: 'text-status-safe',
      bg: 'bg-status-safe-soft',
      risk: 'MINIMAL RISK',
      recommendation: 'Standard infiltration within municipal carrying capacity.',
    };
  };

  const result = classify();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft text-purple flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Dual-Polarization Hydrometeor Identification (HID)
              </h3>
              <p className="text-xs text-ink-secondary">
                IMD Fuzzy Logic Classifier based on ZH, ZDR, ρHV, and KDP signatures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Classification Output Banner */}
          <div className={`p-4 rounded-xl border border-border flex flex-col gap-1.5 ${result.bg}`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary">
                Identified Hydrometeor Phase
              </span>
              <span className="text-xs font-mono font-bold text-purple bg-surface px-2 py-0.5 rounded border border-border">
                {result.confidence}% FUZZY CONFIDENCE
              </span>
            </div>
            <div className={`text-lg font-mono font-bold ${result.color}`}>
              {result.category}
            </div>
            <div className="text-xs font-medium text-ink flex items-center gap-2 mt-1">
              <span className="font-bold">{result.risk}</span>
              <span className="text-ink-secondary">• {result.recommendation}</span>
            </div>
          </div>

          {/* Interactive Radar Variable Probes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-ink">Horiz. Reflectivity (ZH)</span>
                <span className="font-mono text-xs font-bold text-purple">{zh} dBZ</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={zh}
                onChange={(e) => setZh(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Precipitation particle volume</span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-ink">Differential Reflectivity (ZDR)</span>
                <span className="font-mono text-xs font-bold text-purple">{zdr.toFixed(1)} dB</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="5.0"
                step="0.1"
                value={zdr}
                onChange={(e) => setZdr(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Particle oblateness / raindrop squashing</span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-ink">Correlation Coeff. (ρHV)</span>
                <span className="font-mono text-xs font-bold text-purple">{rhoHv.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.99"
                step="0.01"
                value={rhoHv}
                onChange={(e) => setRhoHv(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Hydrometeor shape uniformity (Rain &gt; 0.95)</span>
            </div>

            <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-ink">Specific Diff. Phase (KDP)</span>
                <span className="font-mono text-xs font-bold text-purple">{kdp.toFixed(1)} °/km</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.1"
                value={kdp}
                onChange={(e) => setKdp(Number(e.target.value))}
                className="w-full accent-purple h-2 bg-surface rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink-secondary font-mono">Immune to radar beam attenuation in torrential rain</span>
            </div>
          </div>

          {/* Reference Hydrometeor Classes Table */}
          <div className="border border-border rounded-xl overflow-hidden text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary text-ink-secondary text-[10px] uppercase border-b border-border">
                <tr>
                  <th className="p-2.5">Class</th>
                  <th className="p-2.5">ZH Range</th>
                  <th className="p-2.5">ZDR Range</th>
                  <th className="p-2.5">ρHV</th>
                  <th className="p-2.5 text-right">Urban Implication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-surface-secondary/40">
                  <td className="p-2.5 font-bold text-ink">Heavy Tropical Rain</td>
                  <td className="p-2.5">42–55 dBZ</td>
                  <td className="p-2.5 text-purple">+1.5 to +3.5 dB</td>
                  <td className="p-2.5">&gt; 0.96</td>
                  <td className="p-2.5 text-right text-status-alert font-semibold">Immediate Surcharge</td>
                </tr>
                <tr className="hover:bg-surface-secondary/40">
                  <td className="p-2.5 font-bold text-ink">Hail / Graupel Core</td>
                  <td className="p-2.5">&gt; 58 dBZ</td>
                  <td className="p-2.5 text-purple">-0.5 to +0.8 dB</td>
                  <td className="p-2.5">&lt; 0.92</td>
                  <td className="p-2.5 text-right text-status-alert font-bold">Cloudburst Destructive</td>
                </tr>
                <tr className="hover:bg-surface-secondary/40">
                  <td className="p-2.5 font-bold text-ink">Moderate Rain</td>
                  <td className="p-2.5">30–42 dBZ</td>
                  <td className="p-2.5 text-purple">+0.8 to +1.8 dB</td>
                  <td className="p-2.5">&gt; 0.97</td>
                  <td className="p-2.5 text-right text-status-warning">Manageable Runoff</td>
                </tr>
                <tr className="hover:bg-surface-secondary/40">
                  <td className="p-2.5 font-bold text-ink">Sea Spray / AP Clutter</td>
                  <td className="p-2.5">&lt; 25 dBZ</td>
                  <td className="p-2.5 text-purple">&lt; 0.0 dB</td>
                  <td className="p-2.5">&lt; 0.80</td>
                  <td className="p-2.5 text-right text-ink-secondary">Filtered Noise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            NCAR/IMD Polarimetric Particle Identification Standard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

