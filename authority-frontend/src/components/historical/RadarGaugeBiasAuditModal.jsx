import React, { useState } from 'react';
import { X, Radio } from 'lucide-react';

export default function RadarGaugeBiasAuditModal({ isOpen, onClose }) {
  const [selectedZrProfile, setSelectedZrProfile] = useState('tropical'); // marshall | tropical | maritime

  if (!isOpen) return null;

  const ZR_PROFILES = {
    marshall: {
      name: 'Standard Marshall-Palmer (Z = 200 R^1.6)',
      mfb: 0.84,
      rmse: '7.8 mm/h',
      biasNote: 'Severe underestimation during heavy convective tropical cloudbursts',
      color: '#D94A4A',
    },
    tropical: {
      name: 'IMD Mumbai Convective Optimized (Z = 300 R^1.4)',
      mfb: 1.02,
      rmse: '3.6 mm/h',
      biasNote: 'Optimal operational calibration for Arabian Sea coastal convective cells',
      color: '#3B8F67',
    },
    maritime: {
      name: 'Rosenfeld Deep Tropical Maritime (Z = 250 R^1.2)',
      mfb: 1.14,
      rmse: '5.2 mm/h',
      biasNote: 'Slight overestimation in low-intensity stratiform drizzle',
      color: '#C58A25',
    }
  };

  const currentProfile = ZR_PROFILES[selectedZrProfile];

  // 10 Station Comparisons
  const STATIONS = [
    { name: 'Colaba AWS', awsMm: 64, radarMm: selectedZrProfile === 'tropical' ? 65 : selectedZrProfile === 'marshall' ? 52 : 72 },
    { name: 'Santacruz AWS', awsMm: 92, radarMm: selectedZrProfile === 'tropical' ? 94 : selectedZrProfile === 'marshall' ? 76 : 105 },
    { name: 'Kurla West AWS', awsMm: 115, radarMm: selectedZrProfile === 'tropical' ? 118 : selectedZrProfile === 'marshall' ? 95 : 132 },
    { name: 'Dadar TT AWS', awsMm: 78, radarMm: selectedZrProfile === 'tropical' ? 80 : selectedZrProfile === 'marshall' ? 64 : 89 },
    { name: 'Bandra West AWS', awsMm: 58, radarMm: selectedZrProfile === 'tropical' ? 59 : selectedZrProfile === 'marshall' ? 46 : 66 },
    { name: 'Andheri East AWS', awsMm: 104, radarMm: selectedZrProfile === 'tropical' ? 106 : selectedZrProfile === 'marshall' ? 85 : 119 },
    { name: 'Vikhroli AWS', awsMm: 85, radarMm: selectedZrProfile === 'tropical' ? 87 : selectedZrProfile === 'marshall' ? 69 : 98 },
    { name: 'Borivali AWS', awsMm: 62, radarMm: selectedZrProfile === 'tropical' ? 63 : selectedZrProfile === 'marshall' ? 50 : 71 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Doppler Radar QPE vs Ground AWS Rain Gauge Bias Calibrator
              </h2>
              <p className="text-xs text-ink-secondary">
                Quantitative Precipitation Estimation (QPE) Cross-Validation • Z-R Power Law Optimization (Colaba S-band &amp; Veravali X-band)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Z-R Profile Selector */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
              Select Reflectivity-to-Rainrate (Z-R) Algorithm
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(ZR_PROFILES).map(k => {
                const prof = ZR_PROFILES[k];
                const isSelected = selectedZrProfile === k;
                return (
                  <button
                    key={k}
                    onClick={() => setSelectedZrProfile(k)}
                    className={`p-3 rounded-lg text-left text-xs border transition-all ${
                      isSelected
                        ? 'bg-surface border-purple ring-2 ring-purple/20 font-bold'
                        : 'bg-surface text-ink border-border hover:border-purple/30'
                    }`}
                  >
                    <div className="font-bold text-ink">{prof.name.split(' (')[0]}</div>
                    <div className="text-[10px] font-mono text-purple mt-0.5">{prof.name.split(' (')[1]?.replace(')', '')}</div>
                    <div className="text-[11px] text-ink-secondary mt-1">MFB: <strong>{prof.mfb}</strong> | RMSE: <strong>{prof.rmse}</strong></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Mean Field Bias (MFB)</span>
              <div className="text-2xl font-bold font-mono text-purple mt-0.5">{currentProfile.mfb}</div>
              <span className="text-[10px] text-status-safe font-mono">Ideal = 1.00</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Root Mean Square Error</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">{currentProfile.rmse}</div>
              <span className="text-[10px] text-ink-secondary font-mono">60 AWS Ground Stations</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Pearson Correlation (r)</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">0.942</div>
              <span className="text-[10px] text-status-safe font-mono">High Spatial Coherence</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Active Radar Network</span>
              <div className="text-sm font-bold text-ink mt-1">Colaba S-band (250km) + Veravali X-band (100km)</div>
            </div>
          </div>

          {/* Station Comparison Bars */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              Ground Truth AWS Rain Gauge vs Radar QPE Prediction
            </h4>
            <div className="space-y-2.5">
              {STATIONS.map((st, i) => {
                const diff = st.radarMm - st.awsMm;
                return (
                  <div key={i} className="p-2.5 bg-surface-secondary border border-border rounded-lg text-xs font-mono flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <span className="font-bold text-ink min-w-[140px]">{st.name}</span>
                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-ink-secondary mb-0.5">
                          <span>AWS Gauge: {st.awsMm} mm</span>
                          <span>Radar QPE: {st.radarMm} mm</span>
                        </div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden flex">
                          <div className="h-full bg-ink" style={{ width: `${Math.min(100, (st.awsMm / 140) * 100)}%` }} />
                          <div className="h-full bg-purple" style={{ width: `${Math.min(100, (st.radarMm / 140) * 100)}%` }} />
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        Math.abs(diff) <= 3 ? 'bg-status-safe-soft text-status-safe' :
                        diff > 0 ? 'bg-status-warning-soft text-status-warning' : 'bg-status-alert-soft text-status-alert'
                      }`}>
                        {diff > 0 ? `+${diff}` : diff} mm
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Calibrated via Kalman Filter Radar-Gauge Merged (KFRGM) Technique</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Calibrator
          </button>
        </div>
      </div>
    </div>
  );
}
