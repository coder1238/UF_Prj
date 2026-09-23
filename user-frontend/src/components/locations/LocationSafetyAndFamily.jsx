import React, { useState, useEffect } from 'react';
import { 
  Users, 
  History, 
  CheckSquare, 
  MessageSquare, 
  Share2, 
  Send, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Plus, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function LocationSafetyAndFamily({ selectedPlace }) {
  const { navigateTo } = useNavigation();

  // Feature 11: Family Members assigned to this location
  const [familyMembers, setFamilyMembers] = useState([
    { id: 'fm-1', name: 'Rohan (Self)', role: 'Resident', status: 'At Location', phone: '+91 98201 12345' },
    { id: 'fm-2', name: 'Aarav (Son)', role: 'Family', status: 'Sheltered Safe', phone: '+91 98201 54321' },
    { id: 'fm-3', name: 'Elderly Parents', role: 'Parents', status: 'On 2nd Floor', phone: '+91 98201 99887' }
  ]);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Feature 13: Mitigation Checklist with localStorage persistence
  const checklistKey = `flood_checklist_${selectedPlace.id}`;
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(checklistKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'chk-1', task: 'Deploy aluminium flood barriers / sandbags across main gate & lobby threshold', done: selectedPlace.currentDepth > 10 },
      { id: 'chk-2', task: 'Move ground-level parked two-wheelers and sedans up to the 1st floor stilt ramp', done: false },
      { id: 'chk-3', task: 'Isolate municipal water inlet valve to prevent sewage back-siphonage into sump', done: false },
      { id: 'chk-4', task: 'Verify backup diesel generator fuel reserve & lift elevator cars to top floor', done: true },
      { id: 'chk-5', task: 'Stock emergency 48-hour drinking water bottles and phone power banks', done: true }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(checklistKey, JSON.stringify(checklist));
    } catch (e) {}
  }, [checklist, checklistKey]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const completedCount = checklist.filter(c => c.done).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  // Feature 12: Crowd Reports within 800m
  const [crowdReports, setCrowdReports] = useState([
    {
      id: 'cr-1',
      author: 'Sunil M. (Hindmata Resident)',
      time: '12 mins ago',
      text: 'Water level rising quickly outside gate. High-wheel municipal bus passing created heavy wake into shops.',
      upvotes: 8,
      verified: true
    },
    {
      id: 'cr-2',
      author: 'BMC Ward Worker Ramesh',
      time: '24 mins ago',
      text: 'Hindmata Underpass holding tank pumps 1 and 2 running at full power. Box drain grating cleared of plastic debris.',
      upvotes: 14,
      verified: true
    },
    {
      id: 'cr-3',
      author: 'Citizen Watch Dadar',
      time: '45 mins ago',
      text: 'Traffic moving very slowly on Dr. Ambedkar Road flyover approaches. Avoid curb lane.',
      upvotes: 5,
      verified: false
    }
  ]);

  const handleUpvote = (id) => {
    setCrowdReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  // Feature 11: One-click "I am Safe" WhatsApp / SMS broadcast
  const generateBroadcastMessage = () => {
    const text = encodeURIComponent(
      `URGENT FLOOD UPDATE: I am currently at ${selectedPlace.name} (Ward ${selectedPlace.ward}). Water depth is currently ${selectedPlace.currentDepth}cm (Forecast Peak: ${selectedPlace.peakDepth}cm in +${selectedPlace.peakArrivalMin}m). Everyone is safe and sheltered. Track live basin status via Mumbai Flood Intelligence.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  // Feature 10: Historical Analog Events
  const historicalEvents = [
    {
      event: '26 July 2005 Extreme Deluge',
      rain24h: '944 mm',
      basinDepth: '145 cm',
      severity: 'CATASTROPHIC',
      note: 'Complete basin submergence; modern underground holding tanks were not yet constructed.'
    },
    {
      event: '29 August 2017 Cloudburst',
      rain24h: '315 mm',
      basinDepth: '72 cm',
      severity: 'SEVERE',
      note: 'High tide overlap at 3.2m trapped storm discharge; rail tracks submerged for 18h.'
    },
    {
      event: '2024 Monsoon Peak Surcharge',
      rain24h: '185 mm',
      basinDepth: '38 cm',
      severity: 'MODERATE',
      note: 'Holding tank storage reduced crest duration by 60 mins; flyover bypass remained passable.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-8">
      {/* Feature 13: Property Flood Mitigation & Action Checklist */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
                <CheckSquare className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">Property Mitigation & Pre-Flood Checklist</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Personalized structural safeguard checklist for {selectedPlace.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-purple-primary">
              {completedCount} of {checklist.length} Complete ({progressPct}%)
            </span>
            <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-purple-primary h-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {checklist.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                item.done 
                  ? 'bg-purple-50/50 border-purple-200 text-slate-700' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <input 
                type="checkbox" 
                checked={item.done}
                onChange={() => {}}
                className="mt-0.5 w-4 h-4 accent-purple-primary rounded cursor-pointer shrink-0"
              />
              <span className={`text-xs font-medium leading-relaxed ${item.done ? 'line-through text-slate-400' : 'text-ink'}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 11: Household & Family Safety Check-In */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600">
                <Users className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Household & Family Member Check-In</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Individuals currently present or sheltered at this property
            </p>
          </div>

          <button 
            onClick={generateBroadcastMessage}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{broadcastSent ? 'WhatsApp Opened!' : 'Send WhatsApp "I am Safe" Status'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {familyMembers.map(member => (
            <div key={member.id} className="p-3.5 rounded-2xl bg-canvas border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">{member.name}</span>
                <span className="text-[10px] text-muted font-mono">{member.role} • {member.phone}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 12: Hyper-Local Citizen Crowd Hazard Feed */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <MessageSquare className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Ground Reality Feed ({selectedPlace.name.split(' ')[0]} 800m Radius)</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Live ground reports submitted by nearby citizens and municipal ward engineers
            </p>
          </div>

          <button 
            onClick={() => navigateTo('report')}
            className="text-xs font-semibold text-purple-primary hover:text-purple-deep flex items-center gap-1 transition"
          >
            Post Ground Report <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {crowdReports.map(rep => (
            <div key={rep.id} className="p-4 rounded-2xl bg-canvas border border-slate-200/80 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{rep.author}</span>
                  <span className="text-[10px] text-muted font-mono">• {rep.time}</span>
                  {rep.verified && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> BMC VERIFIED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rep.text}</p>
              </div>

              <button 
                onClick={() => handleUpvote(rep.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 transition shrink-0"
              >
                <ThumbsUp className="w-3 h-3 text-purple-primary" />
                <span>{rep.upvotes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 10: Historical Flood Analog Events & Catchment Memory */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <History className="w-4 h-4" />
          </span>
          <h4 className="text-sm font-bold text-ink">Micro-Basin Historical Analog Deluges</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-muted font-mono uppercase text-[10px]">
                <th className="pb-2">Historical Event</th>
                <th className="pb-2">24h Rainfall</th>
                <th className="pb-2">Peak Basin Water</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2">Catchment Mitigation Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicalEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-bold text-ink">{evt.event}</td>
                  <td className="py-2.5 font-mono text-slate-600">{evt.rain24h}</td>
                  <td className="py-2.5 font-mono font-bold text-purple-primary">{evt.basinDepth}</td>
                  <td className="py-2.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      evt.severity === 'CATASTROPHIC' ? 'bg-red-100 text-red-800' :
                      evt.severity === 'SEVERE' ? 'bg-orange-100 text-orange-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600 text-[11px]">{evt.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

