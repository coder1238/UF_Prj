import React, { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight, RotateCcw, ShieldAlert, Award, Clock } from 'lucide-react';

export default function VehicleEscapeSimulator() {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);
  const [logs, setLogs] = useState([]);

  const stages = [
    {
      stageIndex: 0,
      title: 'Stage 1: Splashdown & Floating Phase',
      timeframe: '0 - 30 Seconds Remaining',
      waterPercent: 25,
      waterDesc: 'Water level reaches lower bumper & tire rims. Vehicle is buoyant.',
      narrative: 'Your vehicle has skidded into a submerged canal/underpass. The car is momentarily floating. Water is lapping against the lower door panels. What is your immediate priority action?',
      options: [
        {
          id: 'opt-1a',
          label: 'Call Emergency Services (112 / 100) on your mobile phone to share GPS coordinates',
          correct: false,
          feedback: 'FATAL DELAY: Calling for help while inside a sinking car consumes your only 30-second window. Rescue will take 15+ minutes to arrive, but the car sinks in 90 seconds.',
          points: 0
        },
        {
          id: 'opt-1b',
          label: 'Push open the driver door forcefully before water gets deeper',
          correct: false,
          feedback: 'PHYSICALLY IMPOSSIBLE: Even at 25cm of water, differential hydrostatic pressure holds the door shut with over 150 kg of force. You waste stamina and adrenaline.',
          points: 0
        },
        {
          id: 'opt-1c',
          label: 'Instantly UNBUCKLE seatbelts and POWER DOWN all side windows while electrical bus is alive',
          correct: true,
          feedback: 'PERFECT SURVIVAL ACTION: Electronic power windows remain operational for 30–60 seconds before water shorts the fuse box. Lowering the windows gives an immediate zero-resistance escape route.',
          points: 25
        }
      ]
    },
    {
      stageIndex: 1,
      title: 'Stage 2: Water Sills & Electrical Short-Circuit',
      timeframe: '30 - 60 Seconds Remaining',
      waterPercent: 55,
      waterDesc: 'Water level reaches door handles and mirrors. Electrical systems short-circuit.',
      narrative: 'Water has climbed past the side mirrors. The dashboard displays electrical error lights and power window switches no longer respond. You and your passenger are inside with closed windows. How do you breach the glass?',
      options: [
        {
          id: 'opt-2a',
          label: 'Kick the front windshield repeatedly with heavy boot heels',
          correct: false,
          feedback: 'INEFFECTIVE: Front windshields are laminated safety glass with a high-tensile PVB interlayer. Kicking simply cracks the plastic layer without creating an exit hole.',
          points: 0
        },
        {
          id: 'opt-2b',
          label: 'Remove seat headrest and wedge metal prongs into the bottom corner of the side window, levering firmly',
          correct: true,
          feedback: 'CORRECT TECHNIQUE: Side windows are tempered glass under internal tension. Focusing force on the lower corner with steel prongs or a spring-loaded center punch shatters the entire panel into granular pebbles instantly.',
          points: 25
        },
        {
          id: 'opt-2c',
          label: 'Wait inside until the car hits the canal bed so the vehicle stops shaking',
          correct: false,
          feedback: 'LETHAL: Sinking cars often flip upside down on riverbeds due to heavy engine weight in front, disorienting occupants in total pitch-black silt.',
          points: 0
        }
      ]
    },
    {
      stageIndex: 2,
      title: 'Stage 3: Water Ingress & Trapped Air Pocket',
      timeframe: '60 - 90 Seconds Remaining',
      waterPercent: 80,
      waterDesc: 'Water rushes through vents up to chest level. Air pocket trapped at roof ceiling.',
      narrative: 'Water has entered the cabin rapidly. The level is now at your chest and rising fast. You have a child in the back seat. What is the correct protocol?',
      options: [
        {
          id: 'opt-3a',
          label: 'Climb out first and reach back inside underwater to drag the child out',
          correct: false,
          feedback: 'HIGH RISK: Water current rushing into the cabin can pin the child or push them into unreachable footwells. Always release and push dependents out first.',
          points: 0
        },
        {
          id: 'opt-3b',
          label: 'Unbuckle child, elevate them into the ceiling air pocket, push child out the open/broken window onto roof first, then exit immediately',
          correct: true,
          feedback: 'LIFE-SAVING PROTOCOL: The mnemonic is SEATBELTS - WINDOWS - CHILDREN FIRST - OUT. Elevating the child into the air pocket prevents aspiration while preparing their exit.',
          points: 25
        },
        {
          id: 'opt-3c',
          label: 'Take off your shoes and jacket and start stuffing vents to slow the water down',
          correct: false,
          feedback: 'INEFFECTIVE: Water enters through thousands of body seams, climate vents, and door drain holes at over 200 liters/second.',
          points: 0
        }
      ]
    },
    {
      stageIndex: 3,
      title: 'Stage 4: Hydrostatic Equalization & Surface Ascent',
      timeframe: 'Cabin Fully Inundated (100% Water)',
      waterPercent: 95,
      waterDesc: 'Water reaches chin and ceiling. Internal pressure equals external hydrostatic pressure.',
      narrative: 'The cabin is almost entirely filled with water. The final air pocket is 5 cm deep at the roof headliner. How do you execute the final exit?',
      options: [
        {
          id: 'opt-4a',
          label: 'Take one calm final breath, push the door open smoothly (now equalized), and follow rising air bubbles to the surface',
          correct: true,
          feedback: 'TEXTBOOK ESCAPE: When water reaches ceiling level, ΔP drops to zero. The door can now be pushed open with normal human force. Swimming toward rising bubbles guarantees upward orientation in murky water.',
          points: 25
        },
        {
          id: 'opt-4b',
          label: 'Swim straight down toward the car floor to search for your mobile phone and bag',
          correct: false,
          feedback: 'FATAL: Every second underwater drains your remaining lung capacity. Belongings can be replaced; human life cannot.',
          points: 0
        },
        {
          id: 'opt-4c',
          label: 'Hold your breath tightly and stay seated hoping rescue divers arrive in 5 minutes',
          correct: false,
          feedback: 'FATAL HYPOXIA: Brain hypoxia occurs within 3 minutes of oxygen deprivation. Self-rescue is the only option.',
          points: 0
        }
      ]
    }
  ];

  const current = stages[currentStage];

  const handleSelectOption = (opt) => {
    if (selectedAction) return;
    setSelectedAction(opt);
    if (opt.correct) {
      setDrillScore(prev => prev + opt.points);
    }
    setLogs(prev => [...prev, { stage: current.title, opt, correct: opt.correct }]);
  };

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setSelectedAction(null);
    } else {
      setDrillFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStage(0);
    setSelectedAction(null);
    setDrillScore(0);
    setDrillFinished(false);
    setLogs([]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-600 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" /> Feature 02: Emergency Submersion Simulator
          </div>
          <h2 className="text-xl font-extrabold text-ink mt-1">
            Submerged Vehicle Window Escape & Pressure Equalization Drill
          </h2>
          <p className="text-xs text-muted mt-1">
            Interactive multi-stage decision simulator modeling vehicle flotation, electrical failure, glass shattering, and hydrostatic equalization.
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart Drill
        </button>
      </div>

      {!drillFinished ? (
        <div className="mt-6 space-y-6">
          {/* Progress & Visual Water Height Gauge */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="font-bold text-purple-primary uppercase">
                {current.title} ({currentStage + 1} of {stages.length})
              </span>
              <span className="text-red-600 font-extrabold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {current.timeframe}
              </span>
            </div>

            {/* Inundation Simulation Bar */}
            <div className="relative h-10 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 opacity-80"
                style={{ width: `${current.waterPercent}%` }}
              ></div>
              <div className="absolute inset-0 px-4 flex justify-between items-center text-xs font-mono font-bold text-ink drop-shadow-xs">
                <span>Cabin Inundation: {current.waterPercent}%</span>
                <span className="text-slate-700 hidden sm:inline">{current.waterDesc}</span>
              </div>
            </div>
          </div>

          {/* Narrative Scenario Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block mb-1">
              Active Emergency Situation
            </span>
            <p className="text-sm font-bold text-ink leading-relaxed">
              {current.narrative}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block">
              Select Your Immediate Tactical Action:
            </span>
            {current.options.map((opt) => {
              const isSelected = selectedAction?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={selectedAction !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    !selectedAction
                      ? 'bg-white border-slate-200/90 hover:border-purple-primary hover:bg-purple-50/30'
                      : isSelected
                      ? opt.correct
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                        : 'bg-red-50 border-red-400 text-red-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {selectedAction && isSelected ? (
                      opt.correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold leading-snug">{opt.label}</p>
                    {selectedAction && isSelected && (
                      <p className={`text-xs mt-2 font-mono leading-relaxed p-2.5 rounded-xl ${
                        opt.correct ? 'bg-emerald-100/70 text-emerald-950' : 'bg-red-100/70 text-red-950'
                      }`}>
                        {opt.feedback}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedAction && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover flex items-center gap-2 shadow-sm transition-all"
              >
                {currentStage < stages.length - 1 ? 'Proceed to Next Inundation Stage' : 'Complete Escape Drill'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drill Results Summary */
        <div className="mt-6 text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-soft mx-auto flex items-center justify-center text-purple-primary mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-ink">Submersion Survival Drill Completed</h3>
          <p className="text-xs font-mono text-muted mt-1">
            Performance Score: <strong className="text-purple-primary text-base font-extrabold">{drillScore} / 100</strong>
          </p>

          <div className="max-w-xl mx-auto my-6 p-4 rounded-2xl bg-canvas border border-slate-200 text-left text-xs space-y-2">
            <span className="font-mono font-bold text-slate-700 block uppercase">Critical Survival Mnemonic:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono font-extrabold">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-purple-primary">1. SEATBELT</div>
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600">2. WINDOWS</div>
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-600">3. CHILDREN</div>
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600">4. OUT</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover transition-colors shadow-sm"
          >
            Retake Survival Drill
          </button>
        </div>
      )}
    </div>
  );
}

