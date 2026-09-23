import React, { useState } from 'react';
import {
  X,
  Award,
} from 'lucide-react';

export default function NowcastSkillScoreModal({ isOpen, onClose }) {
  const [selectedThreshold, setSelectedThreshold] = useState('30mm');

  if (!isOpen) return null;

  const CONFUSION_DATA = {
    '30mm': { hits: 1428, misses: 92, falseAlarms: 114, correctNeg: 12866, pod: '93.9%', far: '7.4%', csi: '87.4%', ets: '0.748', hss: '0.812' },
    '50mm': { hits: 642, misses: 58, falseAlarms: 71, correctNeg: 14729, pod: '91.7%', far: '9.9%', csi: '83.3%', ets: '0.712', hss: '0.785' },
    '75mm': { hits: 184, misses: 26, falseAlarms: 31, correctNeg: 16259, pod: '87.6%', far: '14.4%', csi: '76.3%', ets: '0.640', hss: '0.720' },
  };

  const data = CONFUSION_DATA[selectedThreshold];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-safe-soft text-status-safe flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Nowcast Skill Score &amp; Verification Matrix
              </h3>
              <p className="text-xs text-ink-secondary">
                WMO &amp; IMD Contingency Table Verification (0–3h Lead Time)
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
          {/* Threshold Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink uppercase">Rainfall Verification Threshold</span>
            <div className="flex gap-1.5">
              {[
                { id: '30mm', label: 'Heavy (30 mm/hr)' },
                { id: '50mm', label: 'Torrential (50 mm/hr)' },
                { id: '75mm', label: 'Cloudburst (75 mm/hr)' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThreshold(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    selectedThreshold === t.id
                      ? 'bg-purple text-white border-purple shadow-sm'
                      : 'bg-surface-secondary text-ink-secondary border-border hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Probability of Detection (POD)</div>
              <div className="text-xl font-mono font-bold text-status-safe mt-0.5">{data.pod}</div>
              <div className="text-[9px] text-ink-secondary font-mono">Target: &gt; 90%</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">False Alarm Ratio (FAR)</div>
              <div className="text-xl font-mono font-bold text-purple mt-0.5">{data.far}</div>
              <div className="text-[9px] text-ink-secondary font-mono">Target: &lt; 10%</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Critical Success Index (CSI)</div>
              <div className="text-xl font-mono font-bold text-ink mt-0.5">{data.csi}</div>
              <div className="text-[9px] text-status-safe font-mono">High Skill</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-ink-secondary">Heidke Skill Score (HSS)</div>
              <div className="text-xl font-mono font-bold text-purple mt-0.5">{data.hss}</div>
              <div className="text-[9px] text-ink-secondary font-mono">Range -1 to +1</div>
            </div>
          </div>

          {/* 2x2 Contingency Matrix Table */}
          <div className="border border-border rounded-xl p-4 bg-surface-secondary flex flex-col gap-2">
            <span className="text-xs font-mono uppercase font-bold text-ink">
              2×2 Contingency Verification Grid
            </span>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 font-bold text-ink-secondary">Radar \ Ground AWS</div>
              <div className="p-2 font-bold bg-surface border border-border rounded-lg text-ink">
                Observed Rain
              </div>
              <div className="p-2 font-bold bg-surface border border-border rounded-lg text-ink">
                Observed No Rain
              </div>

              <div className="p-2 font-bold bg-surface border border-border rounded-lg text-ink flex items-center justify-center">
                Forecast Rain
              </div>
              <div className="p-3 bg-status-safe-soft border border-status-safe/40 rounded-xl">
                <div className="font-bold text-status-safe text-base">{data.hits.toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-status-safe">HITS (True Positives)</div>
              </div>
              <div className="p-3 bg-status-alert-soft border border-status-alert/40 rounded-xl">
                <div className="font-bold text-status-alert text-base">{data.falseAlarms.toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-status-alert">FALSE ALARMS</div>
              </div>

              <div className="p-2 font-bold bg-surface border border-border rounded-lg text-ink flex items-center justify-center">
                Forecast No Rain
              </div>
              <div className="p-3 bg-status-alert-soft border border-status-alert/40 rounded-xl">
                <div className="font-bold text-status-alert text-base">{data.misses.toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-status-alert">MISSES (False Negatives)</div>
              </div>
              <div className="p-3 bg-surface border border-border rounded-xl">
                <div className="font-bold text-ink text-base">{data.correctNeg.toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-ink-secondary">CORRECT NEGATIVES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Evaluated on 16,500 AWS ground verification pixel-hours
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
