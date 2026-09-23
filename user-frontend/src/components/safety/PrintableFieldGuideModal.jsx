import React from 'react';
import { X, Printer, ShieldCheck, PhoneCall, Droplets, Zap, Car, AlertTriangle, FileText } from 'lucide-react';

export default function PrintableFieldGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Top Header (Hidden on print) */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-primary" />
            <div>
              <h3 className="font-extrabold text-sm text-ink">Printable Flood Survival Field Guide</h3>
              <p className="text-[11px] text-muted font-mono">Offline-ready PDF dossier with emergency procedures</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Dossier */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 font-sans print:p-0 print:space-y-4">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">
                  CIVIL EMERGENCY FIELD DIRECTIVE
                </span>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                  Urban Flood Survival Quick-Reference Protocol
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Standard Operating Procedures for Heavy Monsoon Cloudbursts & Estuarine Storm Surges
                </p>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <div>Document: AGY-FLD-2026</div>
                <div>Status: ACTIVE PROTOCOL</div>
              </div>
            </div>
          </div>

          {/* Emergency Helplines Box */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 print:bg-white">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-900 mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Essential Disaster Helplines
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-muted block">BMC Disaster Cell</span>
                <strong className="text-red-600 font-bold text-sm">1916</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-muted block">National Emergency</span>
                <strong className="text-slate-900 font-bold text-sm">112</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-muted block">Medical Ambulance</span>
                <strong className="text-slate-900 font-bold text-sm">108</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-muted block">Snake / Wildlife Rescue</span>
                <strong className="text-emerald-700 font-bold text-sm">1926</strong>
              </div>
            </div>
          </div>

          {/* Quick Action Matrix (3 Key Pillars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-950 mb-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Electrical Step Potential</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                If feet tingle, <strong>bring feet together immediately</strong>. Hop on one leg or shuffle both feet tightly without lifting. Stay 10m away from fallen wires or transformer boxes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-950 mb-1.5">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Vehicle Inundation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                Remember: <strong>Seatbelt - Window - Children - Out</strong>. Electric windows die in 60s. Break lower corner of side window with headrest metal prongs. Do NOT hit windshield.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-950 mb-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Water Purification</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                Pre-filter through cotton cloth. Add <strong>2 drops bleach/Litre</strong> (4 drops if cloudy) or 1 tablet NaDCC per 5 Litres. Wait <strong>30 minutes</strong> before drinking.
              </p>
            </div>
          </div>

          {/* 72-Hour Evacuation Go-Bag Cheat Sheet */}
          <div className="p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-950 mb-2">
              72-Hour Survival Go-Bag Minimum Checklist
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono text-slate-700">
              <div>• 9 Litres Potable Water (3L/person/day)</div>
              <div>• 20,000 mAh Waterproof Power Bank</div>
              <div>• 50x Chlorine Purification Tablets (NaDCC)</div>
              <div>• Waterproof LED Headlamp + Batteries</div>
              <div>• 14-Day Prescription Meds + Doxycycline</div>
              <div>• Pea-less Whistle (Fox 40) on strap</div>
              <div>• IP68 Sealed Aadhaar & Insurance Policies</div>
              <div>• Silver Mylar Emergency Blankets</div>
              <div>• ₹5,000 Cash in ₹100/₹200 notes</div>
              <div>• Roasted Chana, Dates, High-Calorie Bars</div>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-200 flex justify-between items-center">
            <span>Urban Flood Intelligence System • Municipal Disaster Preparedness</span>
            <span>Print or laminate this page before monsoon season</span>
          </div>
        </div>
      </div>
    </div>
  );
}

