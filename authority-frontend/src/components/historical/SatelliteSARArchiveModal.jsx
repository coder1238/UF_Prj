import React, { useState } from 'react';
import { X, Satellite } from 'lucide-react';

export default function SatelliteSARArchiveModal({ isOpen, onClose }) {
  const [selectedPass, setSelectedPass] = useState('2025-08-30');

  if (!isOpen) return null;

  const SATELLITE_PASSES = [
    {
      id: '2025-08-30',
      satellite: 'ESA Sentinel-1C (C-Band SAR)',
      acquisitionTime: '30 Aug 2025 • 06:12 IST (T+14h)',
      orbit: 'Descending Orbit 142 (VV Polarization)',
      floodedAreaKm2: 24.2,
      iouMatchPct: 88.4,
      kappaScore: 0.84,
      verifiedWards: ['Ward L (Kurla)', 'Ward F/N (Sion)', 'Ward K/E (Andheri)'],
      summary: 'High spatial resolution (10m) backscatter drop detection clearly delineating water accumulation in Mithi river floodplain and low-lying railway yards.'
    },
    {
      id: '2024-07-09',
      satellite: 'ISRO RISAT-1A / EOS-04 (C-Band SAR)',
      acquisitionTime: '09 Jul 2024 • 05:40 IST (T+4h)',
      orbit: 'Ascending Orbit 88 (Dual Pol HH/HV)',
      floodedAreaKm2: 18.9,
      iouMatchPct: 85.2,
      kappaScore: 0.81,
      verifiedWards: ['Ward F/S (Parel)', 'Ward G/N (Dadar)'],
      summary: 'Cloud-penetrating SAR confirms post-midnight deluge retention in central railway low-level embankments and Dadar TT.'
    },
    {
      id: '2021-09-05',
      satellite: 'Sentinel-1A SAR',
      acquisitionTime: '05 Sep 2021 • 18:22 IST (T+24h)',
      orbit: 'Descending Track 12',
      floodedAreaKm2: 17.6,
      iouMatchPct: 83.0,
      kappaScore: 0.79,
      verifiedWards: ['Ward A (Colaba)', 'Ward G/S (Worli)'],
      summary: 'Detected coastal promenade seawater deposition following Cyclone Tauktae storm surge.'
    }
  ];

  const current = SATELLITE_PASSES.find(p => p.id === selectedPass) || SATELLITE_PASSES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Synthetic Aperture Radar (SAR) Satellite Flood Extent Archive
              </h2>
              <p className="text-xs text-ink-secondary">
                Sentinel-1 &amp; ISRO EOS-04 C-Band Cloud-Penetrating Backscatter Footprints vs Hydraulic Model Verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orbit Pass Selector */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {SATELLITE_PASSES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPass(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                selectedPass === p.id
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {p.satellite.split(' (')[0]} ({p.id})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata banner */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-ink">{current.satellite}</h3>
              <p className="text-xs text-ink-secondary mt-0.5">{current.acquisitionTime} • {current.orbit}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-soft text-purple text-xs font-mono font-bold">
                Model IoU Match: {current.iouMatchPct}%
              </span>
              <span className="px-2.5 py-1 rounded bg-status-safe-soft text-status-safe text-xs font-mono font-bold">
                Kappa Score: {current.kappaScore}
              </span>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">SAR Inundation Footprint</span>
              <div className="text-2xl font-bold font-mono text-ink mt-0.5">{current.floodedAreaKm2} km²</div>
              <span className="text-[10px] text-purple font-mono">10m Pixel Pixel Ground Resolution</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Hydraulic 2D Model Match</span>
              <div className="text-2xl font-bold font-mono text-status-safe mt-0.5">{current.iouMatchPct}%</div>
              <span className="text-[10px] text-ink-secondary font-mono">SWMM-2D Spatial Congruence</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Backscatter Threshold</span>
              <div className="text-2xl font-bold font-mono text-status-alert mt-0.5">&sigma;° &lt; -18.4 dB</div>
              <span className="text-[10px] text-ink-secondary font-mono">Specular Water Reflection</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <span className="text-[10px] font-mono text-ink-secondary">Affected Municipal Wards</span>
              <div className="text-xs font-bold text-ink mt-1">{current.verifiedWards.join(', ')}</div>
            </div>
          </div>

          {/* SAR Imagery Summary Box */}
          <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Earth Observation Forensic Interpretation
            </h4>
            <p className="text-xs text-ink-secondary leading-relaxed">{current.summary}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Imagery Catalog: Copernicus Open Access Hub &amp; ISRO Bhoovan</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Satellite Archive
          </button>
        </div>
      </div>
    </div>
  );
}
