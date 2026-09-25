import React, { useState } from 'react';
import { 
  AlertTriangle, X, ShieldAlert, CheckCircle, 
  MapPin, Radio, Zap, AlertOctagon, Car, TreePine 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDHazardReportModal({
  isOpen = false,
  onClose = () => {},
  currentLocationName = 'Kurla Underpass Approach',
  currentDepth = 18,
  onReportSubmitted = () => {}
}) {
  const [selectedHazard, setSelectedHazard] = useState('manhole');
  const [severity, setSeverity] = useState('critical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const hazardOptions = [
    { id: 'manhole', label: 'Open Submerged Manhole', icon: AlertOctagon, desc: 'Cover dislodged under flood waters' },
    { id: 'stalled_car', label: 'Stalled Bus / Car Blocking', icon: Car, desc: 'Lane completely obstructed' },
    { id: 'water_surge', label: 'Surging Water Depth (+15cm)', icon: AlertTriangle, desc: 'Depth much higher than map forecast' },
    { id: 'power_debris', label: 'Live Wire / Fallen Tree', icon: Zap, desc: 'Electrocution & physical road block' }
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    hudAudio.playTurnChime();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      if (onReportSubmitted) {
        onReportSubmitted({
          hazard: selectedHazard,
          severity,
          location: currentLocationName,
          timestamp: new Date().toLocaleTimeString(),
          depth: currentDepth
        });
      }

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">1-Tap Driver Hazard Report</h2>
              <p className="text-xs text-muted font-mono flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-400" />
                {currentLocationName} (GPS Tagged)
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Hazard Dispatched to BMC Disaster Cell!</h3>
            <p className="text-xs text-muted font-mono max-w-sm mx-auto">
              Your warning beacon has been broadcasted to all citizens routing through {currentLocationName} within 500m.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-4">
            {/* Quick Hazard Buttons (Large touch targets for driving) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {hazardOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedHazard === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      hudAudio.playClick();
                      setSelectedHazard(opt.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected 
                        ? 'bg-purple-primary/30 border-purple-primary shadow-lg shadow-purple-primary/20 text-white' 
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-purple-primary text-white' : 'bg-white/10 text-muted'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{opt.label}</div>
                      <div className="text-[10px] text-muted font-mono mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Severity Level */}
            <div>
              <span className="text-xs font-mono uppercase text-muted block mb-2">Urgency Level</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'caution', label: 'Caution (Passable)', color: 'border-amber-500/40 text-amber-300' },
                  { id: 'critical', label: 'Critical (Blockage)', color: 'border-red-500/40 text-red-300' },
                  { id: 'emergency', label: 'Fatal Risk (Rescue)', color: 'border-red-600 bg-red-600/20 text-red-200' }
                ].map(sev => (
                  <button
                    key={sev.id}
                    onClick={() => setSeverity(sev.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all text-center ${
                      severity === sev.id ? `${sev.color} bg-white/15` : 'border-white/10 text-muted'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold font-mono text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>{isSubmitting ? 'Transmitting to NDRF & BMC...' : 'BROADCAST HAZARD ALERT'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

