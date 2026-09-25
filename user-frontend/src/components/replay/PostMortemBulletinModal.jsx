import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, FileText } from 'lucide-react';

export default function PostMortemBulletinModal({ isOpen, onClose, selectedEvent, currentStep }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-primary uppercase">
              Official Bulletin Generator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-deep transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-500 hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document Body */}
        <div className="p-8 overflow-y-auto font-serif text-slate-900 space-y-6">
          
          {/* Municipal Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-600">
              Brihanmumbai Municipal Corporation &bull; Disaster Management Cell
            </div>
            <h1 className="text-xl font-bold tracking-tight mt-1 text-slate-950 uppercase font-sans">
              Hydrological Post-Mortem & Incident Debrief
            </h1>
            <div className="text-xs font-mono text-slate-500 mt-1">
              Doc Ref: BMC/SWD/{selectedEvent.id.toUpperCase()}/AUDIT-2026 &bull; Published: Official Record
            </div>
          </div>

          {/* Event Executive Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs font-sans border border-slate-200 p-4 rounded-xl bg-slate-50/50">
            <div>
              <span className="font-bold text-slate-700 block">Meteorological Event:</span>
              <span className="text-sm font-bold text-slate-900">{selectedEvent.name}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Incident Date:</span>
              <span className="text-sm font-mono text-slate-900">{selectedEvent.date}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Total Precipitation:</span>
              <span className="text-sm font-mono text-slate-900">{selectedEvent.totalRainfall}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Peak Inundation Recorded:</span>
              <span className="text-sm font-mono font-bold text-red-700">{selectedEvent.peakWaterDepth}</span>
            </div>
          </div>

          {/* Chronological Engineering Progression */}
          <div>
            <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
              Chronological Incident Timeline & Interventions
            </h3>
            <div className="space-y-3">
              {selectedEvent.timelineSteps.map((step, idx) => (
                <div key={idx} className="text-xs font-sans flex items-start gap-4">
                  <span className="font-mono font-bold text-slate-700 w-14 shrink-0">{step.time} IST</span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">{step.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 ml-2">
                      (Rain: {step.rain} mm/h &bull; Depth: {step.depth} cm &bull; Roads Blocked: {step.roadsClosed})
                    </span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Findings */}
          <div className="border-t border-slate-200 pt-4 text-xs font-sans">
            <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-1">
              Engineering Findings & Civil Adaptation Legacy
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {selectedEvent.casualtiesAvoidedNote}. Post-event hydrological modeling confirmed that gravity drains in island city sumps become ineffective when rainfall rate exceeds 50 mm/h concurrently with Arabian Sea high tide exceeding +3.8m MSL.
            </p>
          </div>

          {/* Stamp & Signatures */}
          <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs font-sans text-slate-500">
            <div>
              <div className="font-bold text-slate-800">Chief Engineer (Storm Water Drains)</div>
              <div>Municipal Corporation of Greater Mumbai</div>
            </div>
            <div className="text-right">
              <div className="inline-block border-2 border-purple-800 text-purple-800 font-mono font-bold text-[10px] px-3 py-1 rounded uppercase tracking-widest">
                VERIFIED ARCHIVAL COPY
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

