import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { ALERT_VERIFICATION_STATS } from './historicalConstants';

export default function AlertVerificationAuditModal({ isOpen, onClose }) {
  const [sensitivityThreshold, setSensitivityThreshold] = useState(50); // 30 to 80

  if (!isOpen) return null;

  // Dynamically calculate adjusted stats based on sensitivity threshold slider
  const adjHits = Math.round(ALERT_VERIFICATION_STATS.hits * (1 + (50 - sensitivityThreshold) * 0.003));
  const adjFalseAlarms = Math.round(ALERT_VERIFICATION_STATS.falseAlarms * (1 + (50 - sensitivityThreshold) * 0.012));
  const adjMisses = Math.round(ALERT_VERIFICATION_STATS.misses * (1 - (50 - sensitivityThreshold) * 0.008));

  const pod = (adjHits / (adjHits + adjMisses)).toFixed(3);
  const far = (adjFalseAlarms / (adjHits + adjFalseAlarms)).toFixed(3);
  const csi = (adjHits / (adjHits + adjFalseAlarms + adjMisses)).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Severe Monsoon Weather Alert Verification &amp; Confusion Matrix Audit
              </h2>
              <p className="text-xs text-ink-secondary">
                10-Year IMD / Municipal Red Alert Statistical Skill Scores • Probability of Detection (POD) &amp; False Alarm Ratio (FAR)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Skill Score Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Probability of Detection (POD)</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">{(Number(pod) * 100).toFixed(1)}%</div>
              <span className="text-[10px] text-ink-secondary font-mono">Hits / (Hits + Misses)</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">False Alarm Ratio (FAR)</span>
              <div className="text-2xl font-bold font-mono text-status-warning mt-0.5">{(Number(far) * 100).toFixed(1)}%</div>
              <span className="text-[10px] text-ink-secondary font-mono">False Alarms / Total Forecasts</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Critical Success Index (CSI)</span>
              <div className="text-2xl font-bold font-mono text-purple mt-0.5">{csi}</div>
              <span className="text-[10px] text-purple font-mono">Threat Score Index</span>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Average Lead Time</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">{ALERT_VERIFICATION_STATS.leadTimeHoursAvg} Hours</div>
              <span className="text-[10px] text-status-safe font-mono font-bold">Dispatched prior to onset</span>
            </div>
          </div>

          {/* 2x2 Contingency Table (Confusion Matrix) */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              10-Year Contingency 2x2 Matrix (N = 1,204 Operational Forecast Days)
            </h4>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 bg-status-safe-soft border border-status-safe/30 rounded-xl">
                <div className="flex justify-between items-center text-status-safe font-bold">
                  <span>HITS (Observed &amp; Warned)</span>
                  <span className="text-xl font-extrabold">{adjHits}</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">Severe rainfall correctly forecasted with timely red alert issued.</p>
              </div>

              <div className="p-4 bg-status-warning-soft border border-status-warning/30 rounded-xl">
                <div className="flex justify-between items-center text-status-warning font-bold">
                  <span>FALSE ALARMS (Warned, Not Observed)</span>
                  <span className="text-xl font-extrabold">{adjFalseAlarms}</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">Red alert declared but convective cell moved offshore or decayed.</p>
              </div>

              <div className="p-4 bg-status-alert-soft border border-status-alert/30 rounded-xl">
                <div className="flex justify-between items-center text-status-alert font-bold">
                  <span>MISSES (Observed, Not Warned)</span>
                  <span className="text-xl font-extrabold">{adjMisses}</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">Unforeseen localized microburst without preceding red alert.</p>
              </div>

              <div className="p-4 bg-surface-secondary border border-border rounded-xl">
                <div className="flex justify-between items-center text-ink-secondary font-bold">
                  <span>CORRECT REJECTIONS</span>
                  <span className="text-xl font-extrabold">{ALERT_VERIFICATION_STATS.correctNegatives}</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">Quiet weather days correctly diagnosed with no emergency alert.</p>
              </div>
            </div>
          </div>

          {/* Interactive Threshold Slider */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-ink">
              <span>Alert Trigger Probability Cutoff (ROC Curve Tuning):</span>
              <span className="font-mono text-purple">{sensitivityThreshold}% Probability</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={sensitivityThreshold}
              onChange={(e) => setSensitivityThreshold(Number(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-secondary">
              <span>30% (High POD / Higher False Alarms)</span>
              <span>50% (Calibrated Optimal Balance)</span>
              <span>80% (Zero False Alarms / Lower Detection)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">WMO Verification Standard: World Meteorological Organization WWRP Guidelines</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
