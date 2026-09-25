import React, { useState } from 'react';
import { X, Send, Radio, FileText, CheckCircle2, Shield, Users, AlertTriangle } from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function OperationalDirectiveModal({
  isOpen,
  onClose,
  selectedCorridor,
  activeInterventionsList,
  depthMitigationCm,
}) {
  const { addCommandLog } = useFloodCommand();
  const [commanderName, setCommanderName] = useState('Dy. Municipal Commissioner (Disaster Mgmt)');
  const [radioChannel, setRadioChannel] = useState('VHF Band 142.150 MHz (Zone 2)');
  const [trafficDiversionLink, setTrafficDiversionLink] = useState('EEH Sion Flyover Flank & Eastern Freeway');
  const [ndrfStandby, setNdrfStandby] = useState(true);
  const [broadcastDispatched, setBroadcastDispatched] = useState(false);

  if (!isOpen) return null;

  const directiveCode = `MCGM-DIR-${Date.now().toString().slice(-4)}`;

  const handleTransmit = () => {
    if (addCommandLog) {
      addCommandLog({
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        category: 'TACTICAL DIRECTIVE',
        level: 'HIGH',
        message: `DIRECTIVE ${directiveCode}: Field execution deployed to ${selectedCorridor.name} (${selectedCorridor.ward}). ${activeInterventionsList.length} units engaged. Depth mitigated: -${depthMitigationCm}cm. Radio channel: ${radioChannel}.`,
      });
    }

    setBroadcastDispatched(true);
    setTimeout(() => {
      setBroadcastDispatched(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center text-purple">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-ink">
                  Tactical SOP Directive Dispatcher
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple text-white font-bold">
                  {directiveCode}
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary">
                Official MCGM Disaster Management field execution transmission.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {broadcastDispatched ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-status-safe-soft text-status-safe flex items-center justify-center mx-auto border border-status-safe/30">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-sm font-bold text-ink">
                Operational Directives Transmitted & Logged
              </h4>
              <p className="text-xs text-ink-secondary">
                Dispatched to Ward Control Room, Mumbai Traffic Police, and Field Crews via Encrypted VHF Radio.
              </p>
            </div>
          ) : (
            <>
              {/* Mission Summary Card */}
              <div className="p-3.5 bg-surface-secondary rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-medium">Target Zone / Hotspot:</span>
                  <span className="font-bold text-ink">{selectedCorridor.name} ({selectedCorridor.ward})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-medium">Active Countermeasures:</span>
                  <span className="font-mono text-purple font-bold">
                    {activeInterventionsList.length} Units ({activeInterventionsList.map((i) => i.name.split(' ')[0]).join(', ')})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-medium">Forecast Head Relief:</span>
                  <span className="font-mono text-status-safe font-bold">
                    -{depthMitigationCm} cm Water Level Drop
                  </span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-ink mb-1 block">
                    Incident Commander Sign-Off Authority
                  </label>
                  <input
                    type="text"
                    value={commanderName}
                    onChange={(e) => setCommanderName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink mb-1 block">
                      VHF / Wireless Radio Channel
                    </label>
                    <input
                      type="text"
                      value={radioChannel}
                      onChange={(e) => setRadioChannel(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink mb-1 block">
                      Emergency Traffic Diversion Link
                    </label>
                    <input
                      type="text"
                      value={trafficDiversionLink}
                      onChange={(e) => setTrafficDiversionLink(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-surface-secondary border border-border rounded-lg text-ink focus:outline-none focus:border-purple"
                    />
                  </div>
                </div>

                {/* NDRF Standby Checkbox */}
                <div className="p-3 bg-surface-subtle rounded-xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple" />
                    <div>
                      <div className="text-xs font-semibold text-ink">
                        Alert NDRF 5th Battalion (Andheri Camp) on Warm Standby
                      </div>
                      <div className="text-[11px] text-ink-secondary">
                        Synchronizes rescue zodiacs and dewatering rigs
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={ndrfStandby}
                    onChange={(e) => setNdrfStandby(e.target.checked)}
                    className="w-4 h-4 accent-purple cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!broadcastDispatched && (
          <div className="p-3.5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
            <span className="text-[11px] text-ink-secondary">
              Directives are legally archived under Disaster Management Act 2005.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg border border-border bg-white text-ink hover:bg-surface-secondary font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTransmit}
                className="px-4 py-2 bg-purple text-white text-xs font-semibold rounded-lg hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Transmit SOP Broadcast
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

