import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert, Radio, LifeBuoy, CheckCircle2, Filter } from 'lucide-react';

export default function DistressStreamDrawer({ currentStep, selectedEvent }) {
  const [filterType, setFilterType] = useState('all');

  // Procedural emergency dispatches matching the event and timestamp
  const sampleDispatches = [
    {
      id: 'disp-1',
      time: currentStep.time,
      type: 'rescue',
      tag: 'NDRF BATTALION 5',
      location: 'Kurla West (Bail Bazaar)',
      msg: 'Inflatable boat unit dispatched to rescue 14 commuters stranded near submerged BEST bus depot.',
      severity: 'high'
    },
    {
      id: 'disp-2',
      time: currentStep.time,
      type: 'citizen',
      tag: '1916 HELPLINE SOS',
      location: 'Dadar TT Circle / Hindmata',
      msg: 'Water reached 50cm; citizen reports senior citizen trapped on ground floor residential society.',
      severity: 'critical'
    },
    {
      id: 'disp-3',
      time: currentStep.time,
      type: 'transit',
      tag: 'CENTRAL RAILWAY CONTROL',
      location: 'Matunga - Sion Railway Sump',
      msg: 'Track water depth exceeds 200mm above rail crown. Fast suburban services temporarily suspended.',
      severity: 'medium'
    },
    {
      id: 'disp-4',
      time: currentStep.time,
      type: 'shelter',
      tag: 'BMC DISASTER MANAGEMENT',
      location: 'Sion Municipal School #4',
      msg: 'Civic transit relief shelter activated with dry rations, emergency power backup, and first-aid medics.',
      severity: 'info'
    }
  ];

  const filtered = filterType === 'all' 
    ? sampleDispatches 
    : sampleDispatches.filter(d => d.type === filterType);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Radio className="w-4 h-4" /> Live Dispatch Wire
          </div>
          <div className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
            <PhoneCall className="w-3 h-3" />
            <span>{currentStep.distressCalls || 320} Helpline Calls</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-ink">
          Emergency Distress & Inter-Agency Dispatch Log
        </h3>
        <p className="text-xs text-muted mt-1">
          Chronological emergency communication log during this meteorological timestep ({currentStep.time} IST).
        </p>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 text-xs font-mono">
          {['all', 'citizen', 'rescue', 'transit', 'shelter'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                filterType === f 
                  ? 'bg-purple-primary text-white font-bold' 
                  : 'bg-canvas text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {f === 'all' ? 'All Logs' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch Feed List */}
      <div className="my-4 space-y-2.5 overflow-y-auto max-h-56 pr-1">
        {filtered.map(d => (
          <div 
            key={d.id}
            className={`p-3 rounded-2xl border text-xs transition-all ${
              d.severity === 'critical' 
                ? 'bg-red-50/70 border-red-200' 
                : d.severity === 'high' 
                ? 'bg-amber-50/70 border-amber-200' 
                : 'bg-canvas border-slate-200/60'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
              <span className="font-bold text-ink">{d.tag}</span>
              <span>{d.time} IST</span>
            </div>
            <p className="text-slate-800 leading-snug font-sans">{d.msg}</p>
            <div className="text-[10px] font-mono text-purple-700 mt-1.5 font-bold">
              Loc: {d.location}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] font-mono text-muted text-center pt-2 border-t border-slate-100">
        Dispatches synchronized to BMC Emergency Operations Cell (1916)
      </div>
    </div>
  );
}

