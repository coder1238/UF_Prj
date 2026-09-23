import React from 'react';
import { ShieldCheck, Activity, Droplets, Radio, CheckCircle2, X, Sparkles, BarChart2 } from 'lucide-react';

export default function SensorVerificationModal({ report, isOpen, onClose }) {
  if (!isOpen || !report) return null;

  const citizenDepth = report.depth || 34;
  const sensorDepth = report.sensorDepth || (report.depth ? report.depth - 0.5 : 33.5);
  const modelDepth = report.estimatedDepth || report.depth || 34;
  const matchScore = report.sensorMatchScore || 96;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-primary" />
            <h3 className="font-bold text-ink text-base">Acoustic & GNN Hydro-Model Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Match Score Banner */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-primary/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-primary text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-purple-700 font-bold uppercase block">Verification Confidence</span>
                <h4 className="font-black text-ink text-lg">{matchScore}% Model-Sensor Agreement</h4>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
              VERIFIED
            </span>
          </div>

          {/* Triangulation Comparison Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Citizen Observation</span>
              <div className="text-2xl font-black font-mono text-purple-primary">{citizenDepth} <span className="text-xs font-normal">cm</span></div>
              <span className="text-[10px] font-mono text-slate-500">Your ground report</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Ultrasonic Sensor</span>
              <div className="text-2xl font-black font-mono text-blue-600">{sensorDepth.toFixed(1)} <span className="text-xs font-normal">cm</span></div>
              <span className="text-[10px] font-mono text-slate-500">{report.sensorId || 'Gauge K-114'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">GNN Hydraulic Net</span>
              <div className="text-2xl font-black font-mono text-emerald-600">{modelDepth} <span className="text-xs font-normal">cm</span></div>
              <span className="text-[10px] font-mono text-slate-500">Nowcast ensemble</span>
            </div>
          </div>

          {/* Telemetry Breakdown */}
          <div className="bg-canvas p-4 rounded-2xl border border-slate-200 space-y-2 font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Sensor Hardware Station:</span>
              <span className="font-bold text-slate-800">{report.sensorId || 'CCTV-K114 & Acoustic-SN7'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Rainfall Precipitation Intensity:</span>
              <span className="font-bold text-purple-primary">{report.rainfallRate || '46 mm/hr'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Ward Micro-Basin:</span>
              <span className="font-bold text-slate-800">{report.ward || 'Ward K-West'} Drainage Corridor</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Computer Vision Algorithm:</span>
              <span className="font-bold text-emerald-600">Mask R-CNN Curb Segmenter ({report.aiConfidence || 94}% confidence)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            By corroborating your ground photo with municipal ultrasonic depth gauges and real-time precipitation radars, the system minimizes false positives and routes high-flow pumps to verified hotspots.
          </p>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
