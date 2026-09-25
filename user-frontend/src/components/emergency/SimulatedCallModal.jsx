import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, 
  Clock, AlertTriangle, UserCheck, X, MessageSquare, Radio
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function SimulatedCallModal({ isOpen, onClose, contact }) {
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeIvrKey, setActiveIvrKey] = useState(null);
  const [operatorSpeech, setOperatorSpeech] = useState('');
  const [queuePosition, setQueuePosition] = useState(1);

  useEffect(() => {
    if (!isOpen || !contact) {
      setCallState('ringing');
      setCallDuration(0);
      setOperatorSpeech('');
      return;
    }

    setCallState('ringing');
    setCallDuration(0);
    setOperatorSpeech('Connecting to emergency dispatcher...');

    // Ringing sound burst
    emergencyAudio.playRadioBurst();

    const connectTimer = setTimeout(() => {
      setCallState('connected');
      setOperatorSpeech(
        `"BMC Emergency Cell Operator #41 on line. You are connected to ${contact.title}. We have your GPS coordinates locked. State your immediate distress or press 1 for Rubber Boat Rescue, 2 for Medical Ambulance, 3 for Tree/Power Hazard."`
      );
    }, 2800);

    return () => {
      clearTimeout(connectTimer);
    };
  }, [isOpen, contact]);

  // Duration timer when connected
  useEffect(() => {
    let timer = null;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen || !contact) return null;

  const handleEndCall = () => {
    setCallState('ended');
    emergencyAudio.playCountdownBeep(440);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleIvrPress = (key) => {
    setActiveIvrKey(key);
    emergencyAudio.playCountdownBeep(650 + key * 40);
    if (key === 1) {
      setOperatorSpeech('"Option 1 selected: Routing to NDRF Rubber Boat Evacuation Squadron 4. Standby, boats operating in Kurla/Sion basin."');
    } else if (key === 2) {
      setOperatorSpeech('"Option 2 selected: Priority medical triage flagged. High-water ambulance dispatch requested."');
    } else if (key === 3) {
      setOperatorSpeech('"Option 3 selected: MCGM Rapid Response Tree & 11kV Power line detachment crew alerted."');
    } else {
      setOperatorSpeech(`"Key ${key} acknowledged. Dispatcher reviewing priority queue."`);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono tracking-wider uppercase text-red-400 font-bold">
              {callState === 'ringing' ? 'Direct Dispatch Dialing...' : callState === 'connected' ? 'Secure Line Connected' : 'Call Terminated'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Visualizer Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center relative">
            {callState === 'ringing' ? (
              <PhoneCall className="w-10 h-10 text-red-400 animate-bounce" />
            ) : (
              <Radio className="w-10 h-10 text-emerald-400 animate-pulse" />
            )}
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-mono text-emerald-400">
              VoIP HD
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{contact.title}</h3>
            <p className="text-sm font-mono text-red-400 font-bold mt-0.5">{contact.number}</p>
            <p className="text-xs text-slate-400 mt-1">{contact.desc}</p>
          </div>

          <div className="py-2 inline-flex items-center gap-2 px-3 bg-slate-800/80 rounded-full border border-slate-700/80 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{callState === 'connected' ? formatTime(callDuration) : 'Connecting Dispatch...'}</span>
            <span className="text-slate-500">•</span>
            <span>Latency: 18ms</span>
          </div>

          {/* Operator Dialogue Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-cyan-400 font-bold mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Officer Transcript (Auto-Generated)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              {operatorSpeech}
            </p>
          </div>

          {/* Simulated Keypad for IVR routing */}
          {callState === 'connected' && (
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Emergency IVR Quick Dial:
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {[
                  { num: 1, label: 'Boat' },
                  { num: 2, label: 'Ambulance' },
                  { num: 3, label: 'Wires/Tree' },
                  { num: 4, label: 'Shelter' },
                  { num: 5, label: 'Towing' },
                  { num: 9, label: 'Operator' }
                ].map(item => (
                  <button
                    key={item.num}
                    onClick={() => handleIvrPress(item.num)}
                    className={`py-2 px-1 rounded-xl text-center border font-mono transition-all ${
                      activeIvrKey === item.num
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                        : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-bold block">{item.num}</span>
                    <span className="text-[10px] text-slate-400 block">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-colors ${
              isMuted ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Mute Microphone"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>

          <a
            href={`tel:${contact.number}`}
            className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Open Native Phone Dialer"
          >
            <PhoneCall className="w-5 h-5 text-emerald-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
