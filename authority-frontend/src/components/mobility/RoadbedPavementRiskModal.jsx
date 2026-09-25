import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Hammer, CheckCircle2, Info } from 'lucide-react';
import { ROADBED_PAVEMENT_RISK } from './mobilityConstants';

export default function RoadbedPavementRiskModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [pavementData, setPavementData] = useState(ROADBED_PAVEMENT_RISK);
  const [toast, setToast] = useState(null);

  const handleDispatchRepair = (segmentName) => {
    setToast(`Municipal Road Works: Rapid cold-mix asphalt patch crew notified for ${segmentName}.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-status-warning-soft text-status-warning">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                Roadbed Structural Integrity &amp; Washout Risk Assessment
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-status-warning text-white">
                  Pavement Health
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Subsurface soil saturation, bitumen stripping, displaced manhole lids, and heavy axle limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {toast && (
            <div className="p-2.5 rounded-lg bg-status-safe-soft border border-status-safe text-status-safe text-xs font-mono">
              {toast}
            </div>
          )}

          {/* High Level Risk Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-status-alert-soft border border-status-alert/30">
              <span className="text-[10px] uppercase font-bold text-status-alert block">Displaced Manholes</span>
              <p className="text-base font-bold text-status-alert mt-0.5">2 Chambers Open</p>
              <span className="text-[11px] text-ink-secondary">Kurla LBS corridor</span>
            </div>
            <div className="p-3 rounded-xl bg-status-safe-soft border border-status-safe/30">
              <span className="text-[10px] uppercase font-bold text-status-safe block">Reinforced Flyovers</span>
              <p className="text-base font-bold text-status-safe mt-0.5">100% Intact</p>
              <span className="text-[11px] text-ink-secondary">EEH &amp; JVLR Box Girders</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-mono text-ink-secondary block">Axle Rating Check</span>
              <p className="text-base font-bold text-ink mt-0.5">Heavy Tenders Verified</p>
              <span className="text-[11px] text-ink-secondary">Fire tenders &lt; 24 Tons</span>
            </div>
          </div>

          {/* Pavement Assessment Cards */}
          <div className="space-y-3">
            {pavementData.map((item, i) => {
              const isCritical = item.potholeWashoutRisk === 'CRITICAL';
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-status-alert-soft/30 border-status-alert/40'
                      : 'bg-surface border-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink">{item.segment}</h4>
                      <span className="text-[10px] font-mono text-ink-secondary">
                        Pavement Type: {item.pavementType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-ink-secondary">Structural Index:</span>
                      <span
                        className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                          item.structuralIndex < 50
                            ? 'bg-status-alert text-white'
                            : item.structuralIndex < 75
                            ? 'bg-status-warning text-white'
                            : 'bg-status-safe text-white'
                        }`}
                      >
                        {item.structuralIndex} / 100
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/60">
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">Pothole / Washout Risk</span>
                      <span className={`font-semibold ${isCritical ? 'text-status-alert' : 'text-status-safe'}`}>
                        {item.potholeWashoutRisk}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">Manhole Safety</span>
                      <span className="font-semibold text-ink">{item.openManholeRisk}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">Axle Load Limit</span>
                      <span className="font-mono font-semibold text-purple">{item.heavyAxleRestriction}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
                    <span className="text-ink-secondary italic">
                      Action: {item.recommendedAction}
                    </span>
                    <button
                      onClick={() => handleDispatchRepair(item.segment)}
                      className="px-2.5 py-1 bg-surface-secondary hover:bg-surface border border-border rounded text-[11px] font-semibold text-ink flex items-center gap-1"
                    >
                      <Hammer className="w-3 h-3 text-purple" /> Log Patch Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
          <div className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-status-warning" />
            Ground Penetrating Radar (GPR) and municipal pavement quality database updated quarterly.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink/90 transition-colors"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

