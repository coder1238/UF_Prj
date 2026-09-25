import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Terminal,
  Pause,
  Play,
  Trash2,
} from 'lucide-react';

export default function RadarTelemetryTerminalModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([
    '[18:30:45.102] [SIGMET-RX] Sweep started: PPI scan tilt 0.5° elevation.',
    '[18:30:45.310] [RF-TRANS] Klystron power: 852 kW, PRF 600/1200 Hz dual-staggered.',
    '[18:30:45.890] [DSP-CH1] Horizontal polarization ray packet 360/1440 verified (CRC32: 0x8F1C).',
    '[18:30:46.420] [DSP-CH2] Vertical polarization ray packet 720/1440 verified (Differential Phase ZDR: +2.84 dB).',
    '[18:30:47.110] [TREC-ENG] Cross-correlation displacement matrix converged in 18.4ms.',
    '[18:30:47.880] [CONV-CELL] Convective Cell C-01 centroid locked: 19.08°N 72.86°E (58.2 dBZ).',
    '[18:30:48.240] [CALIB-AWS] Ground AWS correlation verified (Colaba HQ residual: +0.4 mm/h).',
    '[18:30:49.010] [SWEEP-FIN] 360° volume azimuth scan complete. Frame buffered to GPU VRAM.',
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (!isStreaming || !isOpen) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const azimuth = (Math.random() * 360).toFixed(1);
      const dbz = (40 + Math.random() * 25).toFixed(1);

      const newLog = `[${timeStr}] [RADAR-RAY] Azimuth ${azimuth}° | Ray #${Math.floor(Math.random() * 1440)} | Echo ${dbz} dBZ | Noise: -112 dBm [OK]`;

      setLogs((prev) => [...prev.slice(-40), newLog]);
    }, 900);

    return () => clearInterval(interval);
  }, [isStreaming, isOpen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D1A25] text-purple flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
                <span>Radar Engineering Diagnostics &amp; Raw Telemetry Stream</span>
                <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
              </h3>
              <p className="text-xs text-ink-secondary">
                IMD Colaba S-Band Radar Hardware Bus &amp; Signal Processing Engine
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
          {/* Hardware Telemetry Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] text-ink-secondary uppercase">Transmitter RF Power</div>
              <div className="text-lg font-bold text-ink mt-0.5">852 kW Peak</div>
              <div className="text-[9px] text-status-safe font-semibold">Klystron Amplified</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] text-ink-secondary uppercase">Cavity Temp</div>
              <div className="text-lg font-bold text-purple mt-0.5">42.6°C</div>
              <div className="text-[9px] text-ink-secondary">Chiller Loop Nominal</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] text-ink-secondary uppercase">Dual-Pulse PRF</div>
              <div className="text-lg font-bold text-ink mt-0.5">600 / 1200 Hz</div>
              <div className="text-[9px] text-status-safe font-semibold">Nyquist Range 100km</div>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-3">
              <div className="text-[10px] text-ink-secondary uppercase">Noise Figure</div>
              <div className="text-lg font-bold text-purple mt-0.5">2.14 dB</div>
              <div className="text-[9px] text-ink-secondary">Dynamic Range 105 dB</div>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="bg-[#14111B] border border-border rounded-xl p-4 flex flex-col gap-2 flex-1 min-h-[260px] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-[#AFA9C2]">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Terminal className="w-3.5 h-3.5 text-purple" />
                TTY: /dev/radar/sigmet_ch0 (115200 baud, 8N1)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors flex items-center gap-1"
                >
                  {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isStreaming ? 'Pause Stream' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[#D6D2E6] text-[11px] max-h-[280px]">
              {logs.map((log, index) => (
                <div key={index} className="hover:text-white transition-colors">
                  {log.includes('CRC32') || log.includes('verified') ? (
                    <span className="text-status-safe">{log}</span>
                  ) : log.includes('CONV-CELL') ? (
                    <span className="text-status-alert font-bold">{log}</span>
                  ) : log.includes('SIGMET') ? (
                    <span className="text-purple-soft">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-[11px] font-mono text-ink-secondary">
            NSSL WSR-88D &amp; Sigmet RVP900 Standard Format
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
