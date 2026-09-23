import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Radio, Zap, AlertTriangle, 
  X, Play, Square, Eye, Sun, Flashlight
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function AcousticSirenWhistleModal({ isOpen, onClose }) {
  const [activeSound, setActiveSound] = useState(null); // 'whistle' | 'siren' | 'morse'
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState('white'); // 'white' | 'red' | 'black'

  useEffect(() => {
    return () => {
      emergencyAudio.stopAll();
    };
  }, []);

  // Optical Strobe Loop (SOS Pattern: 3 short, 3 long, 3 short)
  useEffect(() => {
    let timeoutId;
    if (!isStrobeActive) {
      setStrobeColor('white');
      return;
    }

    const pattern = [
      // 3 short
      { color: 'white', dur: 150 }, { color: 'black', dur: 150 },
      { color: 'white', dur: 150 }, { color: 'black', dur: 150 },
      { color: 'white', dur: 150 }, { color: 'black', dur: 400 },
      // 3 long
      { color: 'red', dur: 450 }, { color: 'black', dur: 200 },
      { color: 'red', dur: 450 }, { color: 'black', dur: 200 },
      { color: 'red', dur: 450 }, { color: 'black', dur: 400 },
      // 3 short
      { color: 'white', dur: 150 }, { color: 'black', dur: 150 },
      { color: 'white', dur: 150 }, { color: 'black', dur: 150 },
      { color: 'white', dur: 150 }, { color: 'black', dur: 1200 }
    ];

    let index = 0;
    const step = () => {
      const current = pattern[index];
      setStrobeColor(current.color);
      index = (index + 1) % pattern.length;
      timeoutId = setTimeout(step, current.dur);
    };

    step();
    return () => clearTimeout(timeoutId);
  }, [isStrobeActive]);

  const handleTriggerSound = (type) => {
    if (activeSound === type) {
      emergencyAudio.stopAll();
      setActiveSound(null);
    } else {
      setActiveSound(type);
      if (type === 'whistle') {
        emergencyAudio.playAcousticWhistle(6, false);
      } else if (type === 'siren') {
        emergencyAudio.playSiren(6);
      } else if (type === 'morse') {
        emergencyAudio.playMorseCodeSOS();
      }
    }
  };

  const handleStopAll = () => {
    emergencyAudio.stopAll();
    setActiveSound(null);
    setIsStrobeActive(false);
  };

  if (!isOpen) return null;

  // Fullscreen Strobe Mode view
  if (isStrobeActive) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-8 transition-colors select-none"
        style={{
          backgroundColor: strobeColor === 'white' ? '#ffffff' : strobeColor === 'red' ? '#dc2626' : '#000000',
          color: strobeColor === 'white' ? '#000000' : '#ffffff'
        }}
      >
        <div className="w-full flex justify-between items-center">
          <span className="font-mono text-sm font-extrabold tracking-widest uppercase">
            INTERNATIONAL SOS OPTICAL STROBE (••• ——— •••)
          </span>
          <button
            onClick={() => setIsStrobeActive(false)}
            className="px-5 py-2.5 rounded-full bg-black/80 text-white font-mono text-xs font-bold border border-white/40 shadow-xl"
          >
            EXIT STROBE [ESC]
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-6xl sm:text-8xl font-black tracking-widest uppercase animate-pulse">
            S O S
          </h1>
          <p className="mt-4 font-mono text-sm font-bold opacity-80">
            Signal pointing towards sky / helicopter / rubber boat
          </p>
        </div>

        <div className="text-xs font-mono opacity-60">
          Screen set to max visual contrast. Tap anywhere to exit.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">Feature #03</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800">
                  Web Audio Synthesizer
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Acoustic Rescue Whistle & Optical Strobe</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-300 leading-relaxed">
            When trapped on roofs or in dark flooded corridors, human voices tire after 15 minutes. Use high-penetration acoustic frequencies (3.2 kHz) and screen strobes that cut through Mumbai monsoon cloudburst noise.
          </p>

          {/* Sound Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleTriggerSound('whistle')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                activeSound === 'whistle'
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-lg'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-white'
              }`}
            >
              <Volume2 className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-xs block">3.2 kHz Whistle</span>
              <span className="text-[10px] font-mono text-slate-400 block">Rain-Penetrating</span>
            </button>

            <button
              onClick={() => handleTriggerSound('siren')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                activeSound === 'siren'
                  ? 'bg-red-600/30 border-red-500 text-red-300 shadow-lg'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-white'
              }`}
            >
              <Radio className="w-6 h-6 text-red-400" />
              <span className="font-bold text-xs block">Warble Siren</span>
              <span className="text-[10px] font-mono text-slate-400 block">Dual Tone Sweep</span>
            </button>

            <button
              onClick={() => handleTriggerSound('morse')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                activeSound === 'morse'
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-lg'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-white'
              }`}
            >
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-xs block">Morse SOS</span>
              <span className="text-[10px] font-mono text-slate-400 block">... --- ... Audio</span>
            </button>
          </div>

          {/* Strobe Trigger Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Fullscreen High-Luminance Strobe
              </h4>
              <p className="text-xs text-slate-400">
                Pulsing SOS optical beacon for rescue helicopters and naval dinghies.
              </p>
            </div>
            <button
              onClick={() => setIsStrobeActive(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-colors"
            >
              Launch Strobe
            </button>
          </div>

          {/* Stop All Button */}
          {(activeSound || isStrobeActive) && (
            <button
              onClick={handleStopAll}
              className="w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Square className="w-4 h-4" /> Stop All Acoustic Signals
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

