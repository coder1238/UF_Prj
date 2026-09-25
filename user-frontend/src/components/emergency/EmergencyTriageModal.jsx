import React, { useState, useEffect } from 'react';
import { 
  Heart, Activity, AlertOctagon, ShieldAlert, CheckCircle, 
  Clock, Play, Square, X, RefreshCw, Volume2, ShieldCheck, Thermometer
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function EmergencyTriageModal({ isOpen, onClose }) {
  // START protocol steps: 'walking' | 'breathing' | 'airway' | 'rate' | 'perfusion' | 'mental' | 'result'
  const [step, setStep] = useState('walking');
  const [triageCategory, setTriageCategory] = useState(null); // 'RED' | 'YELLOW' | 'GREEN' | 'BLACK'
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'cpr' | 'firstaid'

  useEffect(() => {
    return () => {
      emergencyAudio.stopCPRMetronome();
    };
  }, []);

  const toggleMetronome = () => {
    if (isMetronomeActive) {
      emergencyAudio.stopCPRMetronome();
      setIsMetronomeActive(false);
    } else {
      setIsMetronomeActive(true);
      emergencyAudio.startCPRMetronome(() => {
        setHeartPulse(prev => !prev);
      });
    }
  };

  const resetTriage = () => {
    setStep('walking');
    setTriageCategory(null);
  };

  const completeWithTag = (tag) => {
    setTriageCategory(tag);
    setStep('result');
    if (tag === 'RED') {
      emergencyAudio.playCountdownBeep(920);
    } else {
      emergencyAudio.playCountdownBeep(600);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider">Feature #02</span>
                <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-mono border border-red-800">
                  START Protocol & Medical Assessment
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Waterborne Clinical Triage & CPR Metronome</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('triage')}
            className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 transition-all ${
              activeTab === 'triage'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            START Triage Evaluator
          </button>
          <button
            onClick={() => setActiveTab('cpr')}
            className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cpr'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-500" /> CPR 110-BPM Metronome
          </button>
          <button
            onClick={() => setActiveTab('firstaid')}
            className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 transition-all ${
              activeTab === 'firstaid'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Flood Immersion Protocols
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'triage' && (
            <div>
              {step !== 'result' ? (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>TRIAGE ALGORITHM STEP</span>
                    <button 
                      onClick={resetTriage}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  {step === 'walking' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Can the casualty walk independently?</h3>
                      <p className="text-xs text-slate-400">Ask the patient to walk towards safety or a high dry step.</p>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => completeWithTag('GREEN')}
                          className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs"
                        >
                          YES (Walking Wounded)
                        </button>
                        <button
                          onClick={() => setStep('breathing')}
                          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
                        >
                          NO (Proceed to Breathing)
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'breathing' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Is the casualty breathing spontaneously?</h3>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => setStep('rate')}
                          className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs"
                        >
                          YES (Check Rate)
                        </button>
                        <button
                          onClick={() => setStep('airway')}
                          className="py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-bold text-xs"
                        >
                          NO (Position Airway)
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'airway' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Reposition airway (Head tilt / Chin lift). Does breathing start?</h3>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => completeWithTag('RED')}
                          className="py-3 px-4 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500 text-red-300 font-bold text-xs"
                        >
                          YES (Immediate Priority)
                        </button>
                        <button
                          onClick={() => completeWithTag('BLACK')}
                          className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-black border border-slate-700 text-slate-400 font-bold text-xs"
                        >
                          NO (Expectant / Deceased)
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'rate' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">What is their respiratory rate?</h3>
                      <p className="text-xs text-slate-400">Count breaths for 15 seconds and multiply by 4.</p>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => completeWithTag('RED')}
                          className="py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-bold text-xs"
                        >
                          Rapid: &gt; 30 / min (or &lt; 10)
                        </button>
                        <button
                          onClick={() => setStep('perfusion')}
                          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
                        >
                          Normal: 10 - 30 / min
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'perfusion' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Capillary Refill Time (Press fingernail bed 5s)</h3>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => completeWithTag('RED')}
                          className="py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-bold text-xs"
                        >
                          Delayed: &gt; 2 seconds / Weak Pulse
                        </button>
                        <button
                          onClick={() => setStep('mental')}
                          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
                        >
                          Brisk: &lt; 2 seconds / Radial Pulse Present
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'mental' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Mental Status: Can they obey simple commands?</h3>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => completeWithTag('YELLOW')}
                          className="py-3 px-4 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 font-bold text-xs"
                        >
                          YES (Can follow commands)
                        </button>
                        <button
                          onClick={() => completeWithTag('RED')}
                          className="py-3 px-4 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500 text-red-300 font-bold text-xs"
                        >
                          NO (Confused / Unresponsive)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Result Tag Card */
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                    triageCategory === 'RED' 
                      ? 'bg-red-950/60 border-red-500 text-red-200'
                      : triageCategory === 'YELLOW'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : triageCategory === 'GREEN'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-700 text-slate-400'
                  }`}>
                    <span className="text-xs font-mono uppercase tracking-widest block font-bold">
                      ASSIGNED CLINICAL TRIAGE CATEGORY
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-wider">
                      {triageCategory === 'RED' && 'PRIORITY 1 — RED (IMMEDIATE)'}
                      {triageCategory === 'YELLOW' && 'PRIORITY 2 — YELLOW (DELAYED)'}
                      {triageCategory === 'GREEN' && 'PRIORITY 3 — GREEN (MINOR)'}
                      {triageCategory === 'BLACK' && 'PRIORITY 0 — BLACK (EXPECTANT)'}
                    </h3>
                    <p className="text-xs max-w-lg mx-auto leading-relaxed">
                      {triageCategory === 'RED' && 'Requires immediate life-saving medical evacuation via Rubber Boat or high-water rescue team. Severe hypothermia, shock, or airway compromise.'}
                      {triageCategory === 'YELLOW' && 'Serious injuries requiring hospitalization but not in immediate airway or cardiac shock. Keep dry on upper floor; stage for secondary evacuation.'}
                      {triageCategory === 'GREEN' && 'Minor lacerations or bruises. Walking wounded. Direct to municipal high-ground dry relief camp on foot.'}
                      {triageCategory === 'BLACK' && 'Catastrophic immersion arrest without signs of life. Focus resuscitation resources on viable salvageable casualties.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={resetTriage}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Assess Another Casualty
                    </button>
                    {triageCategory === 'RED' && (
                      <button
                        onClick={() => setActiveTab('cpr')}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30"
                      >
                        <Heart className="w-3.5 h-3.5" /> Launch CPR Metronome
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cpr' && (
            <div className="space-y-6 text-center">
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-transform duration-100 ${
                  heartPulse ? 'scale-110 bg-red-600/30 border-2 border-red-500' : 'scale-100 bg-red-950/40 border border-red-800'
                }`}>
                  <Heart className={`w-14 h-14 ${heartPulse ? 'text-red-400' : 'text-red-600'}`} />
                </div>

                <div>
                  <span className="text-3xl font-mono font-extrabold text-white block">110 BPM</span>
                  <span className="text-xs font-mono text-slate-400">AHA Guideline CPR Chest Compression Rate</span>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={toggleMetronome}
                    className={`px-8 py-3.5 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                      isMetronomeActive 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    }`}
                  >
                    {isMetronomeActive ? (
                      <>
                        <Square className="w-4 h-4" /> Stop CPR Metronome
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Start Acoustic Beat
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Protocol Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-red-400 font-bold block mb-1">DEPTH: 5-6 CM</span>
                  <p className="text-[11px] text-slate-400">Push hard and fast in center of chest. Allow full chest recoil between compressions.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">CYCLE: 30 : 2</span>
                  <p className="text-[11px] text-slate-400">30 chest compressions followed by 2 gentle rescue breaths (if trained & airway clear).</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">WATER DRAINAGE</span>
                  <p className="text-[11px] text-slate-400">Do not waste time doing abdominal thrusts to expel water; begin chest compressions immediately.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firstaid' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                  <Thermometer className="w-4 h-4" /> Immersion Hypothermia Protocol
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Wet clothing loses heat 25x faster than dry clothing. Strip saturated clothes immediately. Wrap in emergency space blanket or dry wool blankets. Warm the trunk (chest, neck, groin) first; avoid vigorous rubbing of limbs as cold peripheral blood can cause cardiac arrhythmia (after-drop).
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                  <AlertOctagon className="w-4 h-4" /> Leptospirosis Prophylaxis (BMC Directive)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Citizens who have waded through floodwaters contaminated with rodent urine must take prophylactic Doxycycline (200mg single dose within 24-72 hours of exposure) under medical supervision, especially if cuts or abrasions are present.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" /> Electric Submersion Shock Triage
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Never reach into water with a victim until the main breaker or overhead feeder line is 100% disconnected. Use a non-conductive dry wooden pole or thick rubber rope if manual extraction is required before power disconnection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

