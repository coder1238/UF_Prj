import React, { useState, useEffect } from 'react';
import { 
  X, AlertOctagon, PhoneCall, Volume2, VolumeX, 
  Radio, ShieldAlert, Zap, Compass 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDRescueBeaconModal({
  isOpen = false,
  onClose = () => {},
  currentLocationName = 'Kurla Underpass (East Approach)',
  vehicleType = 'Sedan'
}) {
  const [strobeColor, setStrobeColor] = useState('red');
  const [audioBeepEnabled, setAudioBeepEnabled] = useState(true);
  const [strobeSpeed, setStrobeSpeed] = useState(600); // ms per flash

  // Strobe flashing effect
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setStrobeColor(prev => prev === 'red' ? 'amber' : 'red');
    }, strobeSpeed);

    return () => clearInterval(interval);
  }, [isOpen, strobeSpeed]);

  // Audio SOS beeps loop
  useEffect(() => {
    if (!isOpen || !audioBeepEnabled) return;

    hudAudio.playSOSMorse();
    const soundInterval = setInterval(() => {
      if (audioBeepEnabled) {
        hudAudio.playSOSMorse();
      }
    }, 4500);

    return () => clearInterval(soundInterval);
  }, [isOpen, audioBeepEnabled]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 transition-colors duration-200 ${
      strobeColor === 'red' 
        ? 'bg-red-950 text-white' 
        : 'bg-amber-950 text-amber-100'
    }`}>
      
      {/* Top Warning Banner */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white text-red-600 animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              DISTRESS BEACON BROADCASTING
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              SOS RESCUE SIGNAL ACTIVE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioBeepEnabled(!audioBeepEnabled)}
            className={`p-3 rounded-2xl border transition-colors ${
              audioBeepEnabled ? 'bg-white text-black font-bold' : 'bg-black/50 text-white/50 border-white/20'
            }`}
            title="Toggle Morse SOS Siren"
          >
            {audioBeepEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-black/60 hover:bg-black text-white border border-white/30 font-bold"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Central Screen High-Visibility Flasher */}
      <div className="text-center my-auto space-y-6">
        <div className="inline-block p-8 rounded-full border-4 border-white/40 bg-black/40 backdrop-blur-md animate-pulse">
          <span className="text-6xl sm:text-8xl font-black tracking-widest font-mono text-white">
            S O S
          </span>
        </div>

        <div className="max-w-xl mx-auto bg-black/60 border border-white/20 rounded-3xl p-5 backdrop-blur-md space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-white/70">
            Emergency Geolocation Broadcast
          </div>
          <div className="text-xl font-bold text-white font-mono">
            19.0682° N, 72.8791° E • {currentLocationName}
          </div>
          <div className="text-xs font-mono text-white/80">
            Stalled Vehicle: {vehicleType.toUpperCase()} • Hazard: Fast-Rising Flood Waters
          </div>
        </div>

        <div className="text-sm font-mono tracking-widest uppercase text-white/90">
          • • • — — — • • • (MORSE CODE DISTRESS TRANSMISSION)
        </div>
      </div>

      {/* Bottom Emergency Dial Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/20 pt-4">
        <a 
          href="tel:1916"
          className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-center font-mono font-bold flex items-center justify-center gap-3 shadow-2xl"
        >
          <PhoneCall className="w-5 h-5" />
          <span>CALL 1916 (BMC DISASTER CELL)</span>
        </a>

        <a 
          href="tel:112"
          className="p-4 rounded-2xl bg-white hover:bg-slate-200 text-red-900 text-center font-mono font-bold flex items-center justify-center gap-3 shadow-2xl"
        >
          <Radio className="w-5 h-5 text-red-600" />
          <span>CALL 112 (NATIONAL EMERGENCY)</span>
        </a>

        <a 
          href="tel:108"
          className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black text-center font-mono font-bold flex items-center justify-center gap-3 shadow-2xl"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>CALL 108 (TRAUMA AMBULANCE)</span>
        </a>
      </div>

    </div>
  );
}

