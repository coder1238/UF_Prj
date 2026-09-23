import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import { AWS_STATIONS } from './radarConstants';

export default function AWSValidationDrawer({ isOpen, onClose, onApplyCalibration }) {
  const [biasFactor, setBiasFactor] = useState(1.04);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [selectedStation, setSelectedStation] = useState(AWS_STATIONS[0]);

  if (!isOpen) return null;

  // Station dataset with radar vs gauge readings
  const STATIONS_DATA = AWS_STATIONS.map((s) => {
    // Generate realistic radar comparison
    const radarEst = Math.round(s.rate * (1 / biasFactor) * (0.94 + ((s.rate % 7) / 100)) * 10) / 10;
    const diff = Math.round((radarEst - s.rate) * 10) / 10;
    const grRatio = Math.round((s.rate / (radarEst || 1)) * 100) / 100;
    return {
      ...s,
      radarEst,
      diff,
      grRatio,
      status: Math.abs(diff) <= 5 ? 'EXCELLENT' : Math.abs(diff) <= 12 ? 'ACCEPTABLE' : 'DRIFTING',
    };
  });

  const handleAutoCalibrate = () => {
    // Average G/R ratio
    const avgGR = STATIONS_DATA.reduce((acc, s) => acc + s.grRatio, 0) / STATIONS_DATA.length;
    setBiasFactor(Math.round(avgGR * 100) / 100);
    setIsCalibrated(true);
  };

  const handleApply = () => {
    setIsCalibrated(true);
    if (onApplyCalibration) {
      onApplyCalibration(biasFactor);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-surface border-l border-border shadow-elevated z-50 flex flex-col animate-slide-left">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-status-safe-soft text-status-safe flex items-center justify-center font-bold">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
              AWS Ground-Truth Validation &amp; Bias Calibrator
            </h3>
            <p className="text-xs text-ink-secondary">
              8 Ground Tipping Bucket Rain Gauges vs IMD Doppler Radar
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
      <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
        {/* Metric Summary Strip */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-secondary border border-border rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-ink-secondary">Mean Absolute Error</span>
            <div className="text-lg font-mono font-bold text-ink mt-0.5">2.14 mm/h</div>
            <div className="text-[9px] font-mono text-status-safe">Target: &lt; 3.5 mm/h</div>
          </div>
          <div className="bg-surface-secondary border border-border rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-ink-secondary">Gauge/Radar (G/R)</span>
            <div className="text-lg font-mono font-bold text-purple mt-0.5">{biasFactor}x</div>
            <div className="text-[9px] font-mono text-ink-secondary">Domain Bias Ratio</div>
          </div>
          <div className="bg-surface-secondary border border-border rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-ink-secondary">Pearson Corr. r</span>
            <div className="text-lg font-mono font-bold text-status-safe mt-0.5">0.962</div>
            <div className="text-[9px] font-mono text-status-safe">High Confidence</div>
          </div>
        </div>

        {/* Bias Calibration Controls */}
        <div className="bg-surface border border-purple/30 rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple" />
              Real-Time Bias Factor (Z-R Field Tuning)
            </span>
            <span className="font-mono text-xs font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
              {biasFactor.toFixed(2)}x
            </span>
          </div>

          <input
            type="range"
            min="0.70"
            max="1.30"
            step="0.01"
            value={biasFactor}
            onChange={(e) => {
              setBiasFactor(Number(e.target.value));
              setIsCalibrated(false);
            }}
            className="w-full accent-purple h-2 bg-surface-secondary rounded-lg cursor-pointer"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary">
            <span>0.70x (Under-read Compensate)</span>
            <span>1.00x (Neutral)</span>
            <span>1.30x (Over-read Attenuate)</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAutoCalibrate}
              className="flex-1 py-2 px-3 rounded-lg bg-surface-secondary border border-border text-ink hover:border-purple text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple" />
              Auto-Compute Optimal Bias
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-deep flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Apply to Radar Field
            </button>
          </div>
          {isCalibrated && (
            <div className="text-[11px] font-mono text-status-safe flex items-center gap-1 bg-status-safe-soft p-2 rounded-lg border border-status-safe/30">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Calibrated bias {biasFactor.toFixed(2)}x successfully synced to Nowcast inference grid.</span>
            </div>
          )}
        </div>

        {/* Station Discrepancy Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-ink uppercase tracking-wider">
            <span>Ground Station Observations</span>
            <span className="text-[10px] font-mono text-ink-secondary">UPDATED 2 MIN AGO</span>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-secondary text-ink-secondary text-[10px] uppercase border-b border-border">
                <tr>
                  <th className="p-2.5">Station</th>
                  <th className="p-2.5">AWS Gauge</th>
                  <th className="p-2.5">Radar Est</th>
                  <th className="p-2.5">Residual</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STATIONS_DATA.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStation(s)}
                    className={`cursor-pointer transition-colors ${
                      selectedStation.id === s.id ? 'bg-purple-soft/50 font-bold' : 'hover:bg-surface-secondary'
                    }`}
                  >
                    <td className="p-2.5 text-ink">
                      <div>{s.name}</div>
                      <div className="text-[9px] text-ink-secondary">{s.type}</div>
                    </td>
                    <td className="p-2.5 text-status-safe font-bold">{s.rate} mm/h</td>
                    <td className="p-2.5 text-purple font-semibold">{s.radarEst} mm/h</td>
                    <td className="p-2.5">
                      <span className={s.diff > 0 ? 'text-status-alert' : 'text-cyan-600'}>
                        {s.diff > 0 ? `+${s.diff}` : s.diff} mm/h
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          s.status === 'EXCELLENT'
                            ? 'bg-status-safe-soft text-status-safe'
                            : s.status === 'ACCEPTABLE'
                            ? 'bg-status-warning-soft text-status-warning'
                            : 'bg-status-alert-soft text-status-alert'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Station Deep-Dive */}
        {selectedStation && (
          <div className="bg-surface-secondary border border-border rounded-xl p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-ink">
              Sensor Audit: {selectedStation.name}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink-secondary">
              <div>Coordinates: <strong className="text-ink">{selectedStation.lat}°N, {selectedStation.lon}°E</strong></div>
              <div>Gauge Type: <strong className="text-ink">0.2mm Tipping Bucket</strong></div>
              <div>Last Siphon: <strong className="text-ink">18:28 IST</strong></div>
              <div>Telemetry Link: <strong className="text-status-safe">4G LTE (99.8%)</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
        <span className="text-[11px] font-mono text-ink-secondary">
          MCGM Hydrology Div. Calibration Standards
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
