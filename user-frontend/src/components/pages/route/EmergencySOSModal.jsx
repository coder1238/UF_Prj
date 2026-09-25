import React, { useState } from 'react';
import { X, PhoneCall, AlertOctagon, CheckCircle2, ShieldAlert, Radio } from 'lucide-react';

export default function EmergencySOSModal({
  isOpen,
  onClose,
  activeCorridor,
  vehicleType,
  waterDepth = 4
}) {
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-rose-300 shadow-2xl max-h-[90vh] max-w-md w-full p-4 sm:p-6 overflow-y-auto space-y-5 lg:max-h-none lg:overflow-visible">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
            <h3 className="text-lg font-extrabold text-ink">Emergency SOS & Rescue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-canvas hover:bg-surface-secondary text-ink-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {dispatched ? (
          <div className="p-6 text-center space-y-3 bg-rose-50/50 rounded-2xl border border-rose-200">
            <Radio className="w-12 h-12 text-rose-600 mx-auto animate-ping" />
            <h4 className="text-base font-extrabold text-rose-950">RESCUE PACKET BROADCASTED</h4>
            <p className="text-xs text-rose-900 leading-relaxed font-mono">
              GPS telemetry dispatched to BMC Disaster Management Control Room (1916) and Mumbai Traffic Police Towing Unit.
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs font-mono font-bold text-ink">
              Emergency Dispatch ID: #SOS-MUM-8921
            </div>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-ink text-white rounded-xl text-xs font-bold"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-ink-secondary leading-relaxed">
              If your vehicle is stranded, engine has stalled, or water is rising rapidly, activate immediate municipal rescue dispatch.
            </p>

            <div className="bg-canvas p-3 rounded-2xl border border-border space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Corridor:</span>
                <span className="font-bold text-ink truncate">{activeCorridor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Vehicle Type:</span>
                <span className="font-bold text-ink capitalize">{vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Current Water:</span>
                <span className="font-bold text-rose-700">{waterDepth} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Hotline:</span>
                <span className="font-bold text-rose-600">BMC 1916 / Police 100</span>
              </div>
            </div>

            <button
              onClick={handleTriggerSOS}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-extrabold transition shadow-lg flex items-center justify-center gap-2 animate-bounce"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Broadcast Immediate SOS (1916)</span>
            </button>

            <div className="text-[10px] text-center text-ink-muted font-mono">
              Do not leave vehicle if water velocity is above knee height. Await high-axle rescue boat.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
