import React, { useState } from 'react';
import { X, Building2, Train, Plane, Hospital, Zap, ShieldCheck } from 'lucide-react';

export default function CriticalInfraImpactModal({ isOpen, onClose }) {
  const [selectedAsset, setSelectedAsset] = useState('railway');

  if (!isOpen) return null;

  const INFRA_ASSETS = {
    railway: {
      title: 'Central & Western Suburban Railway Tracks',
      icon: Train,
      vulnerableSectors: 'Kurla - Sion corridor, Matunga slow line tracks, Chunabhatti Harbour line',
      peakDisruptionEvent: '08 Jul 2024 (Tracks submerged under 32cm; services suspended for 4.2h)',
      historicalDisruptions10Y: 28,
      defenseMeasures: 'Track lifting (+15cm), micro-tunneling under tracks, 18 high-capacity track dewatering pumps',
      currentResilience: 'Operating with up to 12cm track water depth at 15 km/h restricted speed'
    },
    airport: {
      title: 'Chhatrapati Shivaji Maharaj Int Airport (BOM)',
      icon: Plane,
      vulnerableSectors: 'Secondary Runway 14/32 & Mithi River culvert crossing near Kurla end',
      peakDisruptionEvent: '26 Jul 2005 (Runway perimeter wall breached by Mithi surge; 36h closure)',
      historicalDisruptions10Y: 3,
      defenseMeasures: 'Reinforced concrete retaining wall along 4.5km airport boundary, automated flood gates, retention sump',
      currentResilience: 'Zero runway closures reported since 2019 monsoon'
    },
    hospital: {
      title: 'Municipal Tertiary Care Hospitals (Sion LTMG & KEM)',
      icon: Hospital,
      vulnerableSectors: 'Sion Hospital ground-floor OPD and pediatric wards; KEM pathology basement',
      peakDisruptionEvent: '29 Aug 2017 (Ground floor inundated by 25cm; emergency ward relocation required)',
      historicalDisruptions10Y: 7,
      defenseMeasures: 'Perimeter flood-barrier ramps, dual sump pumps, elevated electrical switchgear (+2.5m above ground)',
      currentResilience: 'Zero patient care disruption during 2024 and 2025 extreme downpours'
    },
    substation: {
      title: 'High-Voltage Power Distribution Sub-Stations (33kV/11kV)',
      icon: Zap,
      vulnerableSectors: 'Dharavi 33kV receiving sub-station, Kurla West transformer yard',
      peakDisruptionEvent: '05 Aug 2020 (Precautionary shutdown for 6 hours affecting 85,000 households)',
      historicalDisruptions10Y: 9,
      defenseMeasures: 'Transformer plinth height raised to RL +5.5m; submersible automated sump drainage with SCADA alerts',
      currentResilience: 'Rapid selective feeder isolation without cascading blackout'
    }
  };

  const current = INFRA_ASSETS[selectedAsset];
  const IconComp = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Critical Infrastructure Ingress &amp; Transport Hub Impact History
              </h2>
              <p className="text-xs text-ink-secondary">
                Suburban Rail Lines, Airport Runways, Tertiary Hospitals &amp; Power Sub-Station Flood Disruption Ledger
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Selector */}
        <div className="p-3 bg-surface border-b border-border flex flex-wrap gap-2">
          {Object.keys(INFRA_ASSETS).map(k => {
            const asset = INFRA_ASSETS[k];
            const BtnIcon = asset.icon;
            return (
              <button
                key={k}
                onClick={() => setSelectedAsset(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
                  selectedAsset === k
                    ? 'bg-purple-soft text-purple border-purple font-bold'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                <BtnIcon className="w-4 h-4" />
                <span>{asset.title.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Asset Card */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="p-2.5 bg-purple rounded-xl text-white">
                <IconComp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{current.title}</h3>
                <p className="text-xs text-ink-secondary mt-0.5">{current.vulnerableSectors}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-surface rounded-lg border border-border space-y-1">
                <span className="text-[10px] text-ink-secondary">Worst Recorded Inundation Event</span>
                <div className="text-xs font-bold text-status-alert">{current.peakDisruptionEvent}</div>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border space-y-1">
                <span className="text-[10px] text-ink-secondary">10-Year Disruption Incidents</span>
                <div className="text-xs font-bold text-purple">{current.historicalDisruptions10Y} Cumulative Ingress Incidents</div>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-lg border border-border space-y-1.5 text-xs">
              <span className="font-bold text-ink block font-mono text-[11px]">Engineering Defense Interventions Deployed:</span>
              <p className="text-ink-secondary leading-relaxed">{current.defenseMeasures}</p>
            </div>

            <div className="p-3 bg-status-safe-soft rounded-lg border border-status-safe/30 space-y-1 text-xs">
              <span className="font-bold text-status-safe block font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Current Operational Resilience Standard
              </span>
              <p className="text-ink leading-relaxed">{current.currentResilience}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Emergency Protocol: Critical Infrastructure Protection (CIP) Directive 2024</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Asset Ledger
          </button>
        </div>
      </div>
    </div>
  );
}

