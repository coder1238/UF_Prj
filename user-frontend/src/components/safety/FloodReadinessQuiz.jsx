import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ShieldCheck, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'You feel a tingling sensation in your legs while wading through calf-deep water near a fallen street lamppost. What should you immediately do?',
    options: [
      { text: 'Run as fast as possible to reach dry ground', correct: false, reason: 'Taking long rapid strides maximizes step potential (Vstep), triggering fatal electrocution.' },
      { text: 'Stop, bring feet tightly together, and hop on one foot or shuffle feet without lifting them', correct: true, reason: 'Keeping feet together or hopping reduces the distance between contact points to zero, reducing step voltage to 0 Volts.' },
      { text: 'Lie down flat on your stomach to distribute your weight', correct: false, reason: 'Lying flat exposes your entire chest and heart directly to the water-ground potential gradient.' },
      { text: 'Grab the nearest metal railing to pull yourself up', correct: false, reason: 'Metal railings conduct fault current, causing severe touch potential shock.' }
    ]
  },
  {
    id: 'q2',
    question: 'Your car is submerged in rising water past the door handles and electric windows have failed. Which glass should you attempt to break?',
    options: [
      { text: 'The front windshield using your shoes or elbows', correct: false, reason: 'Windshields are laminated shatterproof glass with tough PVB plastic that cannot be kicked open.' },
      { text: 'The lower corner of a side window using the metal prongs of a removable headrest', correct: true, reason: 'Side windows are tempered glass. Concentrating pressure on a corner causes the entire sheet to disintegrate instantly.' },
      { text: 'The rear panoramic windscreen with your hands', correct: false, reason: 'Hands cannot break tempered automotive safety glass and will suffer severe lacerations.' },
      { text: 'Do not break any glass; wait inside until the vehicle sinks to the bottom', correct: false, reason: 'Vehicles often invert upside down, trapping occupants in zero-visibility silt.' }
    ]
  },
  {
    id: 'q3',
    question: 'Why does just 15 cm of moving floodwater against an outward-opening basement door prevent an adult from escaping?',
    options: [
      { text: 'The door lock automatically latches when water touches the metal', correct: false, reason: 'Mechanical door locks do not engage from water.' },
      { text: 'Hydrostatic pressure differential generates over 100 kg of resisting force on the door face', correct: true, reason: 'Water density (1000 kg/m³) creates massive unyielding hydrostatic force across the surface area of the door.' },
      { text: 'The door wood expands and jams into the frame in under 2 seconds', correct: false, reason: 'Wood swells over hours, not instantaneously.' },
      { text: 'Air pressure inside the basement drops to a total vacuum', correct: false, reason: 'Air does not form a vacuum under normal conditions.' }
    ]
  },
  {
    id: 'q4',
    question: 'When wading along an inundated urban street where curbs are invisible, where is the safest place to walk?',
    options: [
      { text: 'Near the building compound walls and footpaths', correct: false, reason: 'Stormwater culverts and open drain gutters run directly along the curb edges.' },
      { text: 'Along the crown (centerline) of the asphalt road using a probing stick', correct: true, reason: 'Road crowns have the highest elevation, shallowest water depth, and are furthest from suction vortex manholes.' },
      { text: 'Directly behind large moving BEST buses or trucks', correct: false, reason: 'Heavy vehicles create high bow waves and churn turbulent vortices.' },
      { text: 'Through swirling eddies of water where foam is gathering', correct: false, reason: 'Surface foam and swirls indicate an open suction manhole below.' }
    ]
  },
  {
    id: 'q5',
    question: 'To protect yourself from Leptospirosis after wading through contaminated floodwaters with skin abrasions, what is the medical directive?',
    options: [
      { text: 'Drink fresh sugarcane juice from roadside stalls', correct: false, reason: 'Roadside juices carry high risk of enteric hepatitis and cholera.' },
      { text: 'Take prophylactic Doxycycline within 72 hours as prescribed by BMC health camps and wash skin with soap', correct: true, reason: 'Doxycycline halts Leptospira bacterial replication before severe renal and hepatic failure sets in.' },
      { text: 'Apply petroleum jelly to wounds and ignore symptoms', correct: false, reason: 'Petroleum jelly traps pathogens in macerated tissue.' },
      { text: 'Take an aspirin tablet and go to sleep', correct: false, reason: 'Aspirin increases bleeding risk in hemorrhagic leptospirosis.' }
    ]
  }
];

export default function FloodReadinessQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userName, setUserName] = useState('Citizen Resilient');
  const [showCertificate, setShowCertificate] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (currentQ.options[idx].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setCompleted(false);
    setShowCertificate(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-primary uppercase tracking-wider">
            <Award className="w-4 h-4" /> Feature 08: Flood Survival Drill & Certification
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Certified Flood-Ready Citizen Knowledge Drill
          </h2>
          <p className="text-xs text-muted mt-1">
            Validate your mastery of flood fluid mechanics, high-voltage stepping, and emergency escape protocols.
          </p>
        </div>
        {completed && (
          <button
            onClick={handleRestart}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Drill
          </button>
        )}
      </div>

      {!completed ? (
        <div className="mt-6 space-y-5">
          <div className="flex justify-between items-center text-xs font-mono text-muted">
            <span className="font-bold text-purple-primary">
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span>Score: {score} Correct</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-primary transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          <h3 className="text-base font-extrabold text-ink leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              return (
                <button
                  key={i}
                  disabled={selectedOpt !== null}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedOpt === null
                      ? 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20'
                      : isSelected
                      ? opt.correct
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-400 text-red-950 font-bold'
                      : opt.correct && selectedOpt !== null
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200/60 opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {selectedOpt !== null ? (
                      opt.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                      )
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm leading-snug block">{opt.text}</span>
                    {selectedOpt !== null && (isSelected || opt.correct) && (
                      <p className="text-[11px] font-mono mt-1.5 opacity-80 leading-relaxed">
                        {opt.reason}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover flex items-center gap-2 shadow-xs transition-colors"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results and Certificate Pass */
        <div className="mt-6 text-center py-4">
          <div className="w-14 h-14 rounded-full bg-purple-soft text-purple-primary flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-extrabold text-ink">Quiz Completed!</h3>
          <p className="text-xs font-mono text-muted mt-1">
            You scored <strong className="text-purple-primary text-base font-extrabold">{score} out of {QUIZ_QUESTIONS.length}</strong> ({Math.round((score/QUIZ_QUESTIONS.length)*100)}%)
          </p>

          {score >= 4 ? (
            <div className="max-w-md mx-auto my-6 p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white border border-purple-500/30 shadow-elevated text-left">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
                    Disaster Preparedness Authority
                  </span>
                  <h4 className="text-lg font-extrabold text-white">Certified Flood-Ready Citizen</h4>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-mono text-purple-300 uppercase block mb-1">Citizen Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-purple-800/50 border border-purple-400/30 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-purple-200 border-t border-purple-700/50 pt-3">
                <div>Verification ID: <span className="text-white font-bold">BMC-FLD-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">VERIFIED LEVEL-1</span></div>
                <div>Issued: <span className="text-white font-bold">{new Date().toLocaleDateString()}</span></div>
                <div>Score: <span className="text-white font-bold">{score}/5 ({Math.round(score/5*100)}%)</span></div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
              <span className="font-bold block mb-1">Score Below Certification Threshold (4/5 Required)</span>
              Review the detailed safety chapters on Step Potential and Hydrodynamic Drag, then retake the drill to qualify for your Certified Citizen Pass.
            </div>
          )}

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover transition-colors shadow-xs"
          >
            Retake Knowledge Drill
          </button>
        </div>
      )}
    </div>
  );
}

