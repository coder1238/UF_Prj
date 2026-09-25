import React, { useState } from 'react';
import { X, Activity, Waves, CloudRain, Cpu, ArrowUpRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export default function AlertTelemetryHydrographModal({ alert, onClose }) {
  if (!alert) return null;

  const telemetryData = alert.telemetry || [
    { time: '19:30', depth: 8, rain: 22 },
    { time: '19:50', depth: 16, rain: 42 },
    { time: '20:10', depth: 27, rain: 58 },
    { time: '20:30', depth: 38, rain: 68 },
    { time: '20:50 (Forecast)', depth: 44, rain: 60, isForecast: true },
    { time: '21:15 (Forecast)', depth: 32, rain: 28, isForecast: true }
  ];

  const maxDepth = Math.max(...telemetryData.map(d => d.depth), 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <Activity className="w-5 h-5" /> Ultrasonic Sensor Telemetry & Hydrograph
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Telemetry Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-mono text-muted uppercase block">Sensor Station</span>
            <span className="text-xs font-mono font-extrabold text-ink flex items-center gap-1 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-purple-primary" /> {alert.sensorId || 'US-STN-01'}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-mono text-muted uppercase block">Current Depth</span>
            <span className="text-sm font-mono font-black text-red-600 mt-0.5 block">
              {alert.waterDepth} cm
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-mono text-muted uppercase block">Rainfall Rate</span>
            <span className="text-xs font-mono font-extrabold text-sky-600 flex items-center gap-1 mt-0.5">
              <CloudRain className="w-3.5 h-3.5" /> {alert.rainfallRate || 45} mm/hr
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-mono text-muted uppercase block">Pumping Status</span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 80% Duty Cycle
            </span>
          </div>
        </div>

        {/* Interactive Hydrograph Chart */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 my-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                Hydrograph Depth Progression (cm)
              </span>
              <p className="text-xs text-slate-300">Measured 10-minute intervals + predictive runoff model</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Actual Sensor
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-dashed border-white inline-block" /> AI Forecast
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative h-44 w-full pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>

            {/* Bars Visualization */}
            <div className="relative h-full flex items-end justify-between gap-2 px-2 z-10">
              {telemetryData.map((pt, idx) => {
                const heightPercent = Math.min(Math.round((pt.depth / maxDepth) * 100), 100);
                const isCritical = pt.depth >= 30;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                      Depth: {pt.depth}cm | Rain: {pt.rain}mm/h
                    </div>

                    <span className="text-[10px] font-mono font-bold mb-1 text-slate-200">
                      {pt.depth}
                    </span>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                        pt.isForecast
                          ? 'bg-gradient-to-t from-purple-700/80 to-purple-400/80 border-t-2 border-purple-300'
                          : isCritical
                          ? 'bg-gradient-to-t from-red-700 to-red-400'
                          : 'bg-gradient-to-t from-sky-600 to-sky-400'
                      }`}
                    />

                    <span className="text-[9px] font-mono text-slate-400 mt-2 truncate w-full text-center">
                      {pt.time.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Predictive Recession Summary */}
        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-purple-primary shrink-0" />
            <div>
              <span className="text-xs font-bold text-ink block">Expected Basin Recession Time</span>
              <p className="text-[11px] text-muted">
                Runoff model projects water receding below safe vehicular clearance (15cm) in <span className="font-bold text-purple-primary">55 minutes</span>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs shrink-0 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

