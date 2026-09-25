import React, { useState } from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const INFRASTRUCTURE_ASSETS = [
  {
    id: 'csmia',
    name: 'CSMIA Mumbai International Airport (Runway 09/27)',
    category: 'Aviation',
    currentRate: 74.5,
    threshold: 60.0,
    etaMinutes: 18,
    status: 'SURCHARGE WARNING',
    action: 'Runway drainage pumps on standby; air traffic radar advisory active.',
  },
  {
    id: 'kurla-subway',
    name: 'Kurla Railway Station & Low-Lying Subway',
    category: 'Mass Transit',
    currentRate: 88.0,
    threshold: 45.0,
    etaMinutes: 8,
    status: 'CRITICAL INUNDATION',
    action: 'Subway barricading recommended; 2x 100 HP dewatering pumps engaged.',
  },
  {
    id: 'sion-hospital',
    name: 'Lokmanya Tilak Sion Municipal Hospital (Ground Floor)',
    category: 'Healthcare',
    currentRate: 71.0,
    threshold: 50.0,
    etaMinutes: 12,
    status: 'SURCHARGE WARNING',
    action: 'Emergency triage flood gates sealed; auxiliary power checked.',
  },
  {
    id: 'milan-subway',
    name: 'Milan Subway Underpass (Santacruz)',
    category: 'Road Transit',
    currentRate: 64.0,
    threshold: 45.0,
    etaMinutes: 24,
    status: 'IMMINENT CLOSURE',
    action: 'Traffic police diversion to Western Express Highway initiated.',
  },
  {
    id: 'bkc',
    name: 'Bandra-Kurla Complex (BKC Financial Center)',
    category: 'Commercial Hub',
    currentRate: 58.2,
    threshold: 55.0,
    etaMinutes: 28,
    status: 'ELEVATED WATCH',
    action: 'Mithi River tidal gate 02 monitoring for backflow.',
  },
  {
    id: 'mahim-pumps',
    name: 'Mahim Stormwater Pumping Station',
    category: 'Flood Control',
    currentRate: 61.5,
    threshold: 65.0,
    etaMinutes: 32,
    status: 'OPERATIONAL HIGH LOAD',
    action: 'All 6 Archimedean screw pumps operational at 92% load.',
  },
];

export default function CriticalInfrastructureExposureModal({ isOpen, onClose }) {
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft text-status-alert flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Critical Infrastructure Convective Strike Watch
              </h3>
              <p className="text-xs text-ink-secondary">
                Doppler cell trajectory intercept with vital civic &amp; transport lifelines
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

        {/* Toast */}
        {toast && (
          <div className="mx-4 mt-3 p-2.5 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-mono flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {INFRASTRUCTURE_ASSETS.map((asset) => {
            const isCritical = asset.status.includes('CRITICAL');
            const isWarning = asset.status.includes('WARNING') || asset.status.includes('IMMINENT');

            return (
              <div
                key={asset.id}
                className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-purple/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-ink">{asset.name}</span>
                    <span className="text-[10px] font-mono text-ink-secondary bg-surface-secondary px-2 py-0.5 rounded">
                      {asset.category}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary">{asset.action}</p>
                  <div className="flex items-center gap-3 font-mono text-[11px] pt-1">
                    <span>
                      Current Rate: <strong className="text-ink">{asset.currentRate} mm/h</strong>
                    </span>
                    <span className="text-border">|</span>
                    <span>
                      Design Threshold: <strong className="text-purple">{asset.threshold} mm/h</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-ink">
                      <Clock className="w-3.5 h-3.5 text-purple" />
                      <span>ETA: +{asset.etaMinutes} min</span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono ${
                        isCritical
                          ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                          : isWarning
                          ? 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                          : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>

                  <button
                    onClick={() => showToast(`Emergency Quick-Response Dewatering Order issued for ${asset.name}!`)}
                    className="px-3 py-1 rounded-lg bg-surface-secondary hover:bg-purple hover:text-white border border-border text-ink font-semibold text-xs transition-colors"
                  >
                    Deploy Mobile Pumps
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            Continuous trajectory collision algorithm running at 250m resolution
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

