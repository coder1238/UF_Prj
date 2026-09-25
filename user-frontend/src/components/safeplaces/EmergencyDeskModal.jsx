import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Phone, Radio, ShieldAlert, Mic, MicOff, Volume2, 
  VolumeX, AlertTriangle, CheckCircle2, LifeBuoy, ArrowRight, PhoneCall, Waves
} from 'lucide-react';

export default function EmergencyDeskModal({ place, onClose }) {
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [evacRequested, setEvacRequested] = useState(false);
  const [evacTicket, setEvacTicket] = useState(null);
  const [radioLogs, setRadioLogs] = useState([]);

  const audioCtxRef = useRef(null);

  // Play realistic radio squelch/beep on connection using Web Audio API
  const playRadioBeep = (freq = 880, type = 'sine', duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  };

  useEffect(() => {
    // Ringing state timer
    const ringTimer = setTimeout(() => {
      setCallState('connected');
      playRadioBeep(640, 'triangle', 0.2);
      setTimeout(() => playRadioBeep(980, 'sine', 0.15), 180);
      setRadioLogs([
        { sender: 'DISPATCH', time: '00:01', text: `BMC Ward ${place.ward} Emergency Command on line. Go ahead with your report or shelter request.` }
      ]);
    }, 2400);

    return () => clearTimeout(ringTimer);
  }, [place]);

  useEffect(() => {
    let interval = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRequestBoatOrAmbulance = () => {
    playRadioBeep(520, 'square', 0.15);
    const ticketId = `EVAC-${place.ward.replace(/\s+/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;
    setEvacTicket(ticketId);
    setEvacRequested(true);
    setRadioLogs(prev => [
      ...prev,
      { sender: 'CITIZEN', time: formatTimer(seconds), text: `REQUEST: Emergency High-Clearance Amphibious Transport to ${place.name}. GPS Broadcast Active.` },
      { sender: 'DISPATCH', time: formatTimer(seconds + 1), text: `ACKNOWLEDGED. Beacon ${ticketId} assigned to NDRF Unit 4 & Municipal Fire Tender. ETA 18 mins via dry corridor.` }
    ]);
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10 mb-4">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${callState === 'connected' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-xs font-mono tracking-widest uppercase font-bold text-slate-300">
              Disaster Hotline Radio Bridge
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Status Center */}
        <div className="text-center py-4 relative z-10">
          <div className="relative inline-block mb-3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mx-auto ${
              callState === 'connected' 
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 ring-8 ring-emerald-500/10' 
                : 'bg-purple-950/50 border-purple-500 text-purple-300 ring-8 ring-purple-500/10 animate-pulse'
            }`}>
              <Radio className="w-9 h-9" />
            </div>
            {callState === 'connected' && (
              <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
            )}
          </div>

          <h3 className="text-lg font-bold text-white">{place.name}</h3>
          <p className="text-xs font-mono text-purple-300 mt-0.5">
            Coordinator: {place.deskCoordinator?.name || 'BMC Disaster Warden'} ({place.deskCoordinator?.callsign || 'HOTLINE-DESK'})
          </p>

          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-800 border border-slate-700">
            {callState === 'ringing' && (
              <span className="text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Connecting Secure Ward Intercom...
              </span>
            )}
            {callState === 'connected' && (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected • {formatTimer(seconds)}
              </span>
            )}
            {callState === 'ended' && <span className="text-slate-400">Call Terminated</span>}
          </div>
        </div>

        {/* Radio Intercom Log Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 my-4 h-36 overflow-y-auto font-mono text-xs space-y-2 relative z-10">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-1 mb-2">
            Encrypted Radio Transmission Log
          </div>
          {radioLogs.length === 0 ? (
            <div className="text-slate-500 italic text-[11px] py-4 text-center">
              Awaiting operator link handshake...
            </div>
          ) : (
            radioLogs.map((log, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className={log.sender === 'DISPATCH' ? 'text-purple-400 font-bold' : 'text-cyan-400 font-bold'}>
                    [{log.sender}]
                  </span>
                  <span>{log.time}</span>
                </div>
                <div className="text-slate-200 text-[11px] leading-relaxed pl-2 border-l border-slate-700">
                  {log.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Emergency Evac Request Banner */}
        {evacRequested && evacTicket && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-2xl mb-4 text-xs text-emerald-200 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">Assigned Beacon: {evacTicket}</span>
                <span className="text-[10px] text-emerald-300">NDRF Unit dispatched to current coordinates</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
        )}

        {/* Dispatch Actions */}
        <div className="space-y-2.5 relative z-10">
          <button
            onClick={handleRequestBoatOrAmbulance}
            disabled={callState !== 'connected' || evacRequested}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              evacRequested
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/30'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            {evacRequested ? 'Emergency Evacuation Unit Dispatched' : 'Request Amphibious Boat / Ambulance Evacuation'}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${place.phone}`}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" /> PSTN Dial ({place.phone})
            </a>
            <button
              onClick={handleEndCall}
              className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> End Radio Link
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

