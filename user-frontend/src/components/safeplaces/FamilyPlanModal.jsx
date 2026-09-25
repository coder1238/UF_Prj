import React, { useState } from 'react';
import { 
  X, Heart, ShieldCheck, Share2, Copy, Check, 
  Printer, MapPin, Phone, Users, Compass 
} from 'lucide-react';

export default function FamilyPlanModal({ savedPlaces, allPlaces, onClose }) {
  const [copied, setCopied] = useState(false);
  const [familyName, setFamilyName] = useState('Deshmukh Family');
  const [emergencyContact, setEmergencyContact] = useState('+91 98200 11223');

  const placesToInclude = savedPlaces.length > 0 
    ? allPlaces.filter(p => savedPlaces.includes(p.id))
    : allPlaces.slice(0, 3);

  const handleCopyPlan = () => {
    let text = `*FAMILY FLOOD EVACUATION PROTOCOL*\nFamily: ${familyName}\nEmergency Hotline: ${emergencyContact}\n\n*DESIGNATED HIGH-GROUND HAVENS:*\n`;
    placesToInclude.forEach((p, idx) => {
      text += `\n${idx + 1}. ${p.name}\n   • Type: ${p.categoryLabel}\n   • Elevation: ${p.elevation} MSL\n   • Address: ${p.address}\n   • Desk Phone: ${p.phone}\n   • Safe Corridor: ${p.safeRouteInfo || p.corridorNotes}\n`;
    });
    text += `\n*CONTINGENCY RULE:* If phone networks fail, congregate at haven #1. Always follow high ground ridges and avoid subways.`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-purple-50 text-purple-primary rounded-xl">
              <Heart className="w-5 h-5 fill-purple-primary text-purple-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Family Evacuation Rendezvous Plan</h2>
              <p className="text-xs text-muted font-mono">Designated High-Ground Assembly Points</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Household / Family Label</label>
            <input 
              type="text" 
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              className="w-full px-3.5 py-2 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Central Emergency Contact</label>
            <input 
              type="text" 
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              className="w-full px-3.5 py-2 bg-canvas border border-slate-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
            />
          </div>
        </div>

        {/* Designated Haven Cards */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
            Primary & Alternate Havens ({placesToInclude.length} Assigned)
          </div>

          {placesToInclude.map((p, idx) => (
            <div key={p.id} className="p-4 rounded-2xl bg-canvas border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-ink leading-snug">{p.name}</h4>
                    <p className="text-[11px] text-muted">{p.address} • Ward {p.ward}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-primary border border-purple-200 shrink-0">
                  {p.elevation}
                </span>
              </div>

              <div className="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600">
                <strong className="text-slate-800">Approach:</strong> {p.safeRouteInfo || p.corridorNotes}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1">
                <span>Desk: {p.phone}</span>
                <span className="text-emerald-700 font-bold">{p.routeClear ? '✓ Zero Standing Water' : '⚠ Caution Advised'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleCopyPlan}
            className="py-3 px-3 rounded-xl border border-slate-200 bg-canvas hover:bg-slate-100 text-xs font-bold text-ink flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Protocol!' : 'Copy WhatsApp Protocol'}
          </button>
          <button
            onClick={() => window.print()}
            className="py-3 px-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Protocol Card
          </button>
        </div>

      </div>
    </div>
  );
}

