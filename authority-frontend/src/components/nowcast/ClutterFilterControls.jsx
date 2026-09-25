import React from 'react';
import {
  Filter,
  Check,
  Radio,
  Sliders,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function ClutterFilterControls({
  filters,
  onToggleFilter,
  onClose,
}) {
  const FILTER_ITEMS = [
    {
      key: 'zeroVelocityNotch',
      label: 'Doppler Zero-Velocity Notch',
      sub: 'Filters static ground returns from skyscrapers & bridges',
      reduction: '98.4% ground clutter removed',
    },
    {
      key: 'anomalousPropagation',
      label: 'Sea-Breeze Ducting / AP Filter',
      sub: 'Eliminates false thermal inversion echoes over Arabian Sea',
      reduction: 'Suppresses false marine reflection',
    },
    {
      key: 'terrainMask',
      label: 'DEM Terrain Shadowing Mask',
      sub: 'Compensates beam blockage behind Trombay & SGNP ridges',
      reduction: '12.5% shadow-filled',
    },
    {
      key: 'despeckleMedian',
      label: '3×3 Median Despeckling',
      sub: 'Removes isolated single-pixel electromagnetic spikes',
      reduction: 'Clean contiguous storm boundaries',
    },
    {
      key: 'kdpAttenuationCorrection',
      label: 'KDP Attenuation Path Correction',
      sub: 'Restores attenuated reflectivity downrange of heavy rain cores',
      reduction: '+4.2 dB restored in downwind cells',
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-bold text-ink uppercase flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-purple" />
          Radar Clutter Suppression &amp; AP Filters
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-secondary text-ink-secondary hover:text-ink rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {FILTER_ITEMS.map((item) => {
          const isActive = !!filters[item.key];
          return (
            <div
              key={item.key}
              onClick={() => onToggleFilter(item.key)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                isActive
                  ? 'bg-purple-soft/40 border-purple text-ink font-semibold'
                  : 'bg-surface-secondary border-border text-ink-secondary hover:border-purple/30'
              }`}
            >
              <div>
                <div className="text-xs text-ink">{item.label}</div>
                <div className="text-[10px] text-ink-secondary mt-0.5">{item.sub}</div>
                <div className="text-[9px] text-purple font-bold mt-1">{item.reduction}</div>
              </div>
              <div
                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                  isActive ? 'bg-purple border-purple text-white' : 'bg-surface border-border'
                }`}
              >
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-secondary p-2 rounded-lg border border-border flex justify-between items-center text-[10px] text-ink-secondary">
        <span>Dynamic Clutter Rejection Ratio (CRR):</span>
        <strong className="text-status-safe font-bold">42.8 dB</strong>
      </div>
    </div>
  );
}

