import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  HardDrive,
  Wifi,
  Thermometer,
  ShieldCheck,
  RotateCw,
  Droplet,
  Power,
  Zap,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function CCTVDiagnosticsDrawer({
  isOpen,
  onClose,
  selectedCam,
  onTriggerWiper,
  activeModel = 'YOLOv8-HydroEdge',
}) {
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootMsg, setRebootMsg] = useState('');

  if (!isOpen) return null;

  const handleReboot = () => {
    setIsRebooting(true);
    setRebootMsg('Restarting edge container...');
    setTimeout(() => {
      setRebootMsg('Jetson Orin RTOS re-initialized online.');
      setIsRebooting(false);
      setTimeout(() => setRebootMsg(''), 2500);
    }, 1800);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-soft text-purple">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">
              Edge Hardware & Stream Diagnostics
            </h3>
            <p className="text-[11px] text-ink-secondary">
              NVIDIA Jetson AGX Orin • {selectedCam?.id?.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-ink text-xs">
        {rebootMsg && (
          <div className="p-3 bg-status-safe-soft text-status-safe rounded-xl border border-status-safe/30 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {rebootMsg}
          </div>
        )}

        {/* Hardware Status Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between text-ink-secondary text-[11px]">
              <span>GPU Junction Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-status-safe" />
            </div>
            <div className="font-mono text-xl font-bold text-ink mt-1">
              54.2 <span className="text-xs font-normal">°C</span>
            </div>
            <div className="text-[10px] text-status-safe mt-0.5">Normal operating range</div>
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between text-ink-secondary text-[11px]">
              <span>Inference Precision</span>
              <Zap className="w-3.5 h-3.5 text-purple" />
            </div>
            <div className="font-mono text-xl font-bold text-purple mt-1">
              INT8
            </div>
            <div className="text-[10px] text-ink-secondary mt-0.5">TensorRT 10.2 Engine</div>
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between text-ink-secondary text-[11px]">
              <span>RTSP Bitrate</span>
              <Wifi className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="font-mono text-xl font-bold text-ink mt-1">
              4.18 <span className="text-xs font-normal">Mbps</span>
            </div>
            <div className="text-[10px] text-ink-secondary mt-0.5">H.265 / Main Profile</div>
          </div>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center justify-between text-ink-secondary text-[11px]">
              <span>Packet Loss</span>
              <Activity className="w-3.5 h-3.5 text-status-safe" />
            </div>
            <div className="font-mono text-xl font-bold text-status-safe mt-1">
              0.02%
            </div>
            <div className="text-[10px] text-ink-secondary mt-0.5">Optical Fiber Uplink</div>
          </div>
        </div>

        {/* Camera Enclosure Environmental Telemetry */}
        <div className="p-3.5 bg-surface-secondary rounded-xl border border-border space-y-2">
          <div className="font-bold text-ink flex items-center justify-between">
            <span>Enclosure Sensors (IP68)</span>
            <ShieldCheck className="w-4 h-4 text-status-safe" />
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-ink-secondary">Internal Humidity:</span>
            <span className="font-mono font-medium text-ink">46% (Desiccant OK)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-ink-secondary">PoE+ Input Power:</span>
            <span className="font-mono font-medium text-ink">48.2 V / 24.5 W</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">Lens Condensation Heater:</span>
            <span className="font-mono font-bold text-status-safe">ACTIVE (Auto)</span>
          </div>
        </div>

        {/* Active Model Benchmark Breakdown */}
        <div className="p-3.5 bg-surface-secondary rounded-xl border border-border space-y-2">
          <div className="font-bold text-ink flex items-center justify-between">
            <span>Edge Neural Net Runtime</span>
            <span className="font-mono text-[10px] text-purple">{activeModel}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-ink-secondary">Forward Pass Latency:</span>
            <span className="font-mono font-bold text-purple">26.4 ms</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-ink-secondary">Mean Average Precision (mAP@50):</span>
            <span className="font-mono font-bold text-status-safe">91.4%</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">VRAM Allocation:</span>
            <span className="font-mono font-medium text-ink">1.82 GB / 32 GB</span>
          </div>
        </div>

        {/* Physical Maintenance Actions */}
        <div className="space-y-2 pt-2">
          <div className="font-bold text-ink text-xs uppercase tracking-wider">
            Remote Maintenance Actuators
          </div>

          <button
            onClick={onTriggerWiper}
            className="w-full py-2.5 px-3 bg-surface hover:bg-sky-50 text-ink border border-border rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Droplet className="w-4 h-4 text-sky-500" />
            Trigger High-Pressure Lens Jet Wiper
          </button>

          <button
            onClick={handleReboot}
            disabled={isRebooting}
            className="w-full py-2.5 px-3 bg-surface hover:bg-rose-50 text-status-alert border border-border rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
            {isRebooting ? 'Rebooting Node...' : 'Soft Reboot Jetson Edge Container'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface-secondary flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-semibold bg-surface border border-border rounded-lg text-ink hover:bg-white"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}

