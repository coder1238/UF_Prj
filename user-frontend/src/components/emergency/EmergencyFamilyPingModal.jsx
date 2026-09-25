import React, { useState, useEffect } from 'react';
import { 
  Users, Heart, Battery, BatteryCharging, Clock, 
  MapPin, Send, CheckCircle2, AlertTriangle, ShieldCheck, X, RefreshCw, BellRing
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function EmergencyFamilyPingModal({ isOpen, onClose }) {
  const [myStatus, setMyStatus] = useState('safe');
  const [lastBroadcast, setLastBroadcast] = useState('Just now');
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('emergency_family_ping_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, name: 'Ananya (Spouse)', location: 'BKC Office (2nd Floor)', status: 'SAFE', battery: '84%', lastPing: '4m ago', notes: 'Corridor clear, remaining inside.' },
      { id: 2, name: 'Ramesh (Father)', location: 'Dadar West', status: 'CAUTION', battery: '52%', lastPing: '12m ago', notes: 'Ground floor water entering compound; moved to 1st floor.' },
      { id: 3, name: 'Aarav (Son)', location: 'Don Bosco School, Matunga', status: 'DANGER', battery: '38%', lastPing: '2m ago', notes: 'High water at school gate; assembly in 2nd floor auditorium.' }
    ];
  });

  const [pingSentId, setPingSentId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('emergency_family_ping_list', JSON.stringify(members));
    } catch (e) {}
  }, [members]);

  if (!isOpen) return null;

  const handleBroadcastMyStatus = (newStatus) => {
    setMyStatus(newStatus);
    setLastBroadcast('Just now');
    emergencyAudio.playCountdownBeep(newStatus === 'danger' ? 880 : 540);
  };

  const handlePingMember = (id) => {
    setPingSentId(id);
    emergencyAudio.playRadioBurst();
    setTimeout(() => {
      setPingSentId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">Feature #05</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-800">
                  Real-Time Check-In Board
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Emergency Family Safety Ping Board</h2>
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
          {/* Broadcast My Status */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                Broadcast My Live Status to Circle:
              </span>
              <span className="text-[11px] font-mono text-purple-400">Sent: {lastBroadcast}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleBroadcastMyStatus('safe')}
                className={`py-3 px-2 rounded-xl text-center border font-bold text-xs font-mono transition-all ${
                  myStatus === 'safe'
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                I AM SAFE
              </button>
              <button
                onClick={() => handleBroadcastMyStatus('moving')}
                className={`py-3 px-2 rounded-xl text-center border font-bold text-xs font-mono transition-all ${
                  myStatus === 'moving'
                    ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                MOVING TO SHELTER
              </button>
              <button
                onClick={() => handleBroadcastMyStatus('danger')}
                className={`py-3 px-2 rounded-xl text-center border font-bold text-xs font-mono transition-all ${
                  myStatus === 'danger'
                    ? 'bg-red-600/30 border-red-500 text-red-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                TRAPPED / NEED HELP
              </button>
            </div>
          </div>

          {/* Circle Members Status List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold">
              <span>Family Circle Telemetry</span>
              <span>All 3 Devices Synced</span>
            </div>

            <div className="space-y-2.5">
              {members.map(member => (
                <div 
                  key={member.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{member.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        member.status === 'SAFE' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : member.status === 'CAUTION'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {member.location}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">"{member.notes}"</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1 justify-end text-slate-300">
                        <Battery className="w-3 h-3 text-emerald-400" />
                        <span>{member.battery}</span>
                      </div>
                      <span>{member.lastPing}</span>
                    </div>

                    <button
                      onClick={() => handlePingMember(member.id)}
                      disabled={pingSentId === member.id}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white rounded-xl border border-slate-700 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                      title="Send Immediate Safety Ping"
                    >
                      <BellRing className={`w-3.5 h-3.5 ${pingSentId === member.id ? 'animate-bounce text-purple-400' : ''}`} />
                      <span>{pingSentId === member.id ? 'Pinged!' : 'Ping'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

