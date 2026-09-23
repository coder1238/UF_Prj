import React, { useState } from 'react';
import { X, GitCompare, ArrowRight, ShieldCheck, BarChart2 } from 'lucide-react';
import { HISTORICAL_EVENTS } from '../../data/replayData';

export default function ComparativeBenchmarkModal({ isOpen, onClose }) {
  const [eventAId, setEventAId] = useState('event-2005');
  const [eventBId, setEventBId] = useState('event-2023');

  if (!isOpen) return null;

  const eventA = HISTORICAL_EVENTS.find(e => e.id === eventAId) || HISTORICAL_EVENTS[0];
  const eventB = HISTORICAL_EVENTS.find(e => e.id === eventBId) || HISTORICAL_EVENTS[3];

  const metrics = [
    { label: 'Total 24h Precipitation', a: eventA.totalRainfall, b: eventB.totalRainfall },
    { label: 'Peak 1-Hour Cloudburst Rate', a: eventA.peakRainRate, b: eventB.peakRainRate },
    { label: 'Max Hindmata/Kurla Water Depth', a: eventA.peakWaterDepth, b: eventB.peakWaterDepth },
    { label: 'High Tide Astronomical Peak', a: eventA.highTidePeak, b: eventB.highTidePeak },
    { label: 'Critical Subways Submerged', a: `${eventA.subwaysFlooded} Subways`, b: `${eventB.subwaysFlooded} Subways` }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">Historical Event Comparative Benchmark</h3>
              <p className="text-xs text-muted font-mono">Contrast multi-decade cloudburst dynamics and civic adaptation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-500 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Selectors */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event A Selector */}
            <div className="p-4 rounded-2xl bg-canvas border border-slate-200">
              <label className="text-xs font-mono font-bold text-muted block mb-2">Primary Event (Baseline)</label>
              <select 
                value={eventAId}
                onChange={(e) => setEventAId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary shadow-xs"
              >
                {HISTORICAL_EVENTS.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <div className="text-xs text-muted mt-2 font-mono">{eventA.date} &bull; {eventA.category}</div>
            </div>

            {/* Event B Selector */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-primary/30">
              <label className="text-xs font-mono font-bold text-purple-primary block mb-2">Comparison Event</label>
              <select 
                value={eventBId}
                onChange={(e) => setEventBId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary shadow-xs"
              >
                {HISTORICAL_EVENTS.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <div className="text-xs text-purple-700 mt-2 font-mono">{eventB.date} &bull; {eventB.category}</div>
            </div>
          </div>

          {/* Metrics Comparison Grid */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 text-xs font-mono font-bold text-slate-700 py-3 px-4 border-b border-slate-200">
              <span>Hydraulic Metric</span>
              <span>{eventA.name.split('(')[0]}</span>
              <span className="text-purple-700">{eventB.name.split('(')[0]}</span>
            </div>

            {metrics.map((m, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-3 text-xs py-3 px-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800">{m.label}</span>
                <span className="font-mono text-slate-600">{m.a}</span>
                <span className="font-mono font-bold text-purple-700">{m.b}</span>
              </div>
            ))}
          </div>

          {/* Institutional Learning & Adaptation Takeaway */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Key Legacy: {eventA.date}</span>
              <p className="text-muted leading-relaxed">{eventA.casualtiesAvoidedNote}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-primary/30 text-xs">
              <span className="font-bold text-purple-900 block mb-1">Key Legacy: {eventB.date}</span>
              <p className="text-purple-800 leading-relaxed">{eventB.casualtiesAvoidedNote}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-deep transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

