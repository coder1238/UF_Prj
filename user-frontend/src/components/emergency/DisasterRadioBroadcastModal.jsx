import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Volume2, VolumeX, Play, Square, AlertTriangle, 
  X, Mic, Activity, Clock, ShieldCheck, Share2 
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function DisasterRadioBroadcastModal({ isOpen, onClose, speakAlert }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [channel, setChannel] = useState('100.1'); // '100.1' | '91.2' | '156.8'
  const canvasRef = useRef(null);

  const bulletins = [
    { time: '20:45 IST', text: 'BMC Disaster Control: High tide of 4.87m active at Arabian Sea outfalls. Sluice gates at Love Grove and Cleave Land Bunder partially throttled to prevent seawater backflow into Hindmata.' },
    { time: '20:30 IST', text: 'NDRF Advisory: 4 Rubber dinghy units deployed in Kalina and Kranti Nagar along Mithi River basin. Citizens on ground floors advised to relocate to designated upper floor relief schools.' },
    { time: '20:15 IST', text: 'Western Railway Status: Fast corridors between Bandra and Andheri running at restricted speed of 30 km/h due to track waterlogging at Matunga.' }
  ];

  // Visualizer loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const numBars = 32;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const h = Math.random() * (height * 0.7) + (height * 0.15);
        ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#34d399';
        ctx.fillRect(i * (barWidth + 2), (height - h) / 2, barWidth, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      emergencyAudio.stopAll();
    } else {
      setIsPlaying(true);
      emergencyAudio.playRadioBurst();
      if (speakAlert) {
        speakAlert(bulletins[0].text);
      }
    }
  };

  const handleTestSiren = () => {
    emergencyAudio.playSiren(3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Feature #07</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                  Govt Disaster Frequency
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">All India Radio & BMC Disaster Broadcast</h2>
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
        <div className="p-6 space-y-5">
          {/* Station Selector */}
          <div className="flex gap-2">
            {[
              { id: '100.1', label: 'AIR 100.1 FM (Disaster)' },
              { id: '91.2', label: 'BMC Disaster 91.2 FM' },
              { id: '156.8', label: 'Naval Coastal VHF 16' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setChannel(item.id)}
                className={`flex-1 py-2 px-2 text-center rounded-xl border font-mono text-xs font-bold transition-all ${
                  channel === item.id 
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Visualizer & Tuner */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
                {isPlaying ? 'LIVE BROADCAST ACTIVE' : 'RADIO STANDBY'}
              </span>
              <span>BITRATE: 64 kbps Opus</span>
            </div>

            <canvas 
              ref={canvasRef} 
              width={340} 
              height={70} 
              className="w-full h-16 bg-slate-950 rounded-xl border border-slate-800/80" 
            />

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlayback}
                className={`px-8 py-3.5 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-4 h-4" /> Stop Audio Feed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Tune In Live Audio
                  </>
                )}
              </button>

              <button
                onClick={handleTestSiren}
                className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-2xl border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                title="Test Municipal Siren Tone"
              >
                <AlertTriangle className="w-4 h-4" /> Siren Test
              </button>
            </div>
          </div>

          {/* Live Transcript Bulletins */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Official Control Room Bulletins:
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {bulletins.map((b, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-mono text-emerald-400 font-bold block text-[10px] mb-0.5">{b.time}</span>
                  <p className="text-slate-300 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

