import React, { useState, useEffect, useRef } from 'react';
import { 
  X, AlertOctagon, PhoneCall, Radio, ShieldAlert, 
  MapPin, CheckCircle2, Copy, Share2, Volume2, 
  Sliders, ShieldCheck, CheckSquare, Square, 
  Car, Heart, Plus, Clock, FileText, QrCode, 
  Activity, Battery, BatteryCharging, BatteryWarning,
  Navigation, Play, Pause, RotateCcw, AlertTriangle,
  Send, ExternalLink, Download, Layers, Sparkles
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';
import { WARDS_DATA } from '../../data/floodData';

/* =========================================================================
   1. Mass Circle SOS Broadcast Modal
========================================================================= */
export function FamilySOSBroadcastModal({ isOpen, onClose, members, speakAlert }) {
  const [countdown, setCountdown] = useState(3);
  const [broadcasted, setBroadcasted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && !broadcasted) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setBroadcasted(true);
        if (speakAlert) {
          speakAlert('Family emergency SOS initiated. Coordinates and water risk sent to all circle members and BMC control room.');
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, broadcasted, speakAlert]);

  if (!isOpen) return null;

  const totalMembers = members.length;
  const criticalMembers = members.filter(m => m.status === 'danger');

  const sosPayload = `🚨 *URGENT FAMILY FLOOD SOS* 🚨
Circle: Sharma Family Protection Circle
Timestamp: ${new Date().toLocaleTimeString()}
Total Members: ${totalMembers} | High Basin Danger: ${criticalMembers.length}
Critical Status:
${members.map(m => `• ${m.name} (${m.relation}): ${m.locationFuzzy} [Water: ${m.localWaterDepth}cm, Bat: ${m.batteryLevel}]`).join('\n')}

Nearest Rendezvous: Don Bosco High Ground Hall (Elevated Hall)
BMC Disaster Control 1916 notified.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sosPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(sosPayload)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Urgent Header */}
        <div className="bg-red-600 text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">Family Emergency SOS</h3>
                <span className="text-xs text-red-100 font-mono">PRIORITY TIER-1 RESCUE BROADCAST</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!broadcasted ? (
            <div className="mt-4 bg-black/20 p-3 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span>Auto-broadcasting in:</span>
              <span className="text-2xl font-black text-white px-3 py-0.5 rounded-lg bg-red-700 animate-pulse">
                00:0{countdown}
              </span>
            </div>
          ) : (
            <div className="mt-4 bg-emerald-700/80 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Broadcast active! All devices pinged with high-priority tone.</span>
            </div>
          )}
        </div>

        {/* Payload details */}
        <div className="p-6 space-y-4 text-xs font-sans">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono">
            <div className="text-[10px] text-muted uppercase font-bold mb-2">Emergency Dispatch Payload</div>
            <pre className="text-ink text-[11px] whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
              {sosPayload}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
              <span className="text-[10px] text-red-700 block uppercase">Critical Danger</span>
              <span className="text-lg font-black text-red-700">{criticalMembers.length} Members</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
              <span className="text-[10px] text-purple-700 block uppercase">BMC 1916 Relay</span>
              <span className="text-lg font-black text-purple-primary">CONNECTED</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </button>
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-ink font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Payload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. Simulated In-App Walkie-Talkie & Intercom Call Modal
========================================================================= */
export function FamilyIntercomCallModal({ isOpen, onClose, member, speakAlert }) {
  const [callState, setCallState] = useState('connected'); // 'connecting' | 'connected'
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [simulatedTranscript, setSimulatedTranscript] = useState([
    { sender: member?.name || 'Member', time: 'Just now', text: 'I can hear you! Water is rising slightly outside, but I am dry on the upper floor.' }
  ]);

  if (!isOpen || !member) return null;

  const handleTalkStart = () => {
    setIsPushToTalkActive(true);
  };

  const handleTalkEnd = () => {
    setIsPushToTalkActive(false);
    // simulate member response
    setTimeout(() => {
      const responses = [
        "Roger that. Battery is good, we've got potable water and torches ready.",
        "Understood. If water reaches 40cm, school warden says we move to the 2nd floor auditorium.",
        "Copy. Staying sheltered until the high tide recession window at 22:30."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setSimulatedTranscript(prev => [
        ...prev,
        { sender: 'You', time: 'Now', text: 'Status check. Stay safe and avoid ground floor.' },
        { sender: member.name, time: 'Now', text: randomResponse }
      ]);
      if (speakAlert) {
        speakAlert(`${member.name} says: ${randomResponse}`);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Top Status */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-lg">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{member.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                VoIP Intercom • {member.relation} ({member.ward})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-center font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Water Level</span>
            <span className="text-red-400 font-bold">{member.localWaterDepth} cm</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Battery</span>
            <span className="text-emerald-400 font-bold">{member.batteryLevel}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Signal</span>
            <span className="text-purple-300 font-bold">4G Mesh (Good)</span>
          </div>
        </div>

        {/* Audio Waveform Visualizer */}
        <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="flex items-center gap-1.5 h-16 mb-4">
            {[40, 65, 30, 85, 95, 45, 70, 30, 90, 60, 40].map((h, i) => (
              <span 
                key={i} 
                className={`w-1.5 rounded-full bg-purple-500 transition-all ${
                  isPushToTalkActive ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ height: `${isPushToTalkActive ? h : 15}%` }}
              />
            ))}
          </div>

          {/* Transcript Box */}
          <div className="w-full bg-slate-900/80 rounded-2xl p-3 border border-slate-800 max-h-36 overflow-y-auto space-y-2 text-xs font-sans">
            {simulatedTranscript.map((t, idx) => (
              <div key={idx} className={t.sender === 'You' ? 'text-right' : 'text-left'}>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {t.sender} • {t.time}
                </span>
                <p className={`inline-block px-3 py-1.5 rounded-xl mt-0.5 ${
                  t.sender === 'You' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Push-to-Talk Big Button */}
        <div className="p-6 border-t border-slate-800 flex flex-col items-center gap-3">
          <button
            onMouseDown={handleTalkStart}
            onMouseUp={handleTalkEnd}
            onTouchStart={handleTalkStart}
            onTouchEnd={handleTalkEnd}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 text-sm transition-all shadow-lg select-none ${
              isPushToTalkActive 
                ? 'bg-red-600 text-white scale-[0.98] ring-4 ring-red-500/40' 
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            <Radio className="w-5 h-5 animate-pulse" />
            {isPushToTalkActive ? 'Transmitting Audio... (Release to Send)' : 'Hold to Speak (Push-To-Talk)'}
          </button>

          <a 
            href={`tel:${member.phone}`}
            className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-mono"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Or switch to standard Cellular Call ({member.phone})
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. Family Rendezvous (Safe Haven Meetup) Manager Modal
========================================================================= */
export function FamilyRendezvousModal({ isOpen, onClose, selectedHaven, onSelectHaven, members, speakAlert }) {
  const [activeHaven, setActiveHaven] = useState(selectedHaven || SAFE_PLACES_DATA[1]);
  const [drillTriggered, setDrillTriggered] = useState(false);

  if (!isOpen) return null;

  const handleConfirmHaven = (haven) => {
    setActiveHaven(haven);
    onSelectHaven(haven);
  };

  const handleTriggerMeetup = () => {
    setDrillTriggered(true);
    if (speakAlert) {
      speakAlert(`Emergency meetup alert dispatched! All circle members instructed to navigate towards ${activeHaven.name}.`);
    }
    setTimeout(() => setDrillTriggered(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Designated Family Rendezvous Point</h3>
              <p className="text-xs text-muted">High-elevation meeting shelter during mass displacement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-sans">
          {/* Active Haven Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold uppercase">
                  ACTIVE SAFE HAVEN
                </span>
                <h4 className="text-base font-extrabold text-ink mt-1.5">{activeHaven.name}</h4>
                <p className="text-slate-600 text-xs mt-0.5">{activeHaven.address}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 block">
                  {activeHaven.elevation}
                </span>
                <span className="text-[10px] text-emerald-600 mt-1 block">Zero Flood Water</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
              <div className="bg-white p-2 rounded-xl border border-emerald-200">
                <span className="text-[9px] text-muted block">CAPACITY</span>
                <span className="text-xs font-bold text-ink">{activeHaven.availableCapacity} / {activeHaven.totalCapacity} slots</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-200">
                <span className="text-[9px] text-muted block">POWER</span>
                <span className="text-xs font-bold text-emerald-700">96h GenSet</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-200">
                <span className="text-[9px] text-muted block">DRINKING WATER</span>
                <span className="text-xs font-bold text-ink">45,000 L</span>
              </div>
            </div>
          </div>

          {/* Member ETAs to Haven */}
          <div>
            <h5 className="font-bold text-ink text-xs mb-3">Family Members' Estimated Walking Distance to Haven:</h5>
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-ink block">{member.name}</span>
                      <span className="text-[10px] text-muted font-mono">{member.locationFuzzy}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-ink block">~18 mins walk</span>
                    <span className="text-[10px] text-emerald-600">Dry Ridge Path</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Choose Alternative Haven */}
          <div>
            <h5 className="font-bold text-ink text-xs mb-2">Switch Designated Haven:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAFE_PLACES_DATA.slice(0, 4).map(place => (
                <button
                  key={place.id}
                  onClick={() => handleConfirmHaven(place)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeHaven.id === place.id 
                      ? 'border-purple-primary bg-purple-50 text-ink ring-2 ring-purple-soft' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-bold block text-xs truncate">{place.name}</span>
                  <span className="text-[10px] text-muted font-mono block mt-0.5">{place.elevation} • Ward {place.ward}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleTriggerMeetup}
              disabled={drillTriggered}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-md ${
                drillTriggered ? 'bg-emerald-600 text-white' : 'bg-purple-primary hover:bg-purple-deep text-white'
              }`}
            >
              {drillTriggered ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Evacuation Meetup Dispatched to Circle!
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" /> Dispatch Meetup Instructions to All Devices
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. Geofenced Safe Zones Manager Modal
========================================================================= */
export function FamilyGeofenceModal({ isOpen, onClose, speakAlert }) {
  const [zones, setZones] = useState(() => {
    try {
      const saved = localStorage.getItem('family_geofence_zones');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'gf-1', name: 'Home (Dadar West)', radiusM: 300, ward: 'G-North', thresholdCm: 25, currentDepth: 18, breached: false },
      { id: 'gf-2', name: 'Don Bosco School (Matunga)', radiusM: 400, ward: 'F-North', thresholdCm: 20, currentDepth: 34, breached: true },
      { id: 'gf-3', name: 'BKC Financial Center', radiusM: 600, ward: 'H-East', thresholdCm: 30, currentDepth: 2, breached: false }
    ];
  });

  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneWard, setNewZoneWard] = useState('G-North');

  useEffect(() => {
    localStorage.setItem('family_geofence_zones', JSON.stringify(zones));
  }, [zones]);

  if (!isOpen) return null;

  const handleAddZone = (e) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    const newZone = {
      id: `gf-${Date.now()}`,
      name: newZoneName,
      radiusM: 500,
      ward: newZoneWard,
      thresholdCm: 25,
      currentDepth: 8,
      breached: false
    };
    setZones([...zones, newZone]);
    setNewZoneName('');
    if (speakAlert) speakAlert(`New geofence zone added for ${newZoneName}`);
  };

  const handleDeleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Geofenced Safe Zones</h3>
              <p className="text-xs text-muted">Automatic perimeter breach alarms when water surrounds key spots</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Active Geofence List */}
          <div className="space-y-3">
            {zones.map(zone => (
              <div 
                key={zone.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  zone.breached 
                    ? 'border-red-300 bg-red-50/70 shadow-sm' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">{zone.name}</span>
                      {zone.breached && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                          WATER BREACH
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted font-mono block mt-0.5">
                      Ward {zone.ward} • {zone.radiusM}m Radius • Alert Trigger: &gt;{zone.thresholdCm}cm
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteZone(zone.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove Zone"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                  <span>Current Water in Zone:</span>
                  <span className={`font-extrabold ${zone.breached ? 'text-red-600' : 'text-emerald-700'}`}>
                    {zone.currentDepth} cm {zone.breached ? '(High Danger)' : '(Within Safe Threshold)'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Geofence */}
          <form onSubmit={handleAddZone} className="p-4 rounded-2xl border border-slate-200 bg-canvas space-y-3">
            <span className="font-bold text-ink block text-xs">Add New Monitored Safe Zone</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="e.g. Tuition Class / Daycare"
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-purple-primary"
              />
              <select 
                value={newZoneWard}
                onChange={e => setNewZoneWard(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                {WARDS_DATA.map(w => (
                  <option key={w.id} value={w.id.replace('ward-', '').toUpperCase()}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Geofence Perimeter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. Automated Escalation Rule Builder & Simulation Sandbox
========================================================================= */
export function FamilyEscalationModal({ isOpen, onClose, speakAlert }) {
  const [thresholdDepth, setThresholdDepth] = useState(30);
  const [dwellMinutes, setDwellMinutes] = useState(15);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [bmcRelayEnabled, setBmcRelayEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([]);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs(['[00:00] Simulation initialized: Setting virtual water level to 36cm at Matunga Basin...']);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[00:05] Dwell condition confirmed (> ${thresholdDepth}cm for ${dwellMinutes}m). Escalation rule tripped.`]);
    }, 1000);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, '[00:10] Automated SMS dispatch generated to 4 emergency contacts with evacuation routes.']);
    }, 2000);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, '[00:15] BMC 1916 Flood Cell pinged with GPS coordinates and high-ground shelter ETA. Simulation successful!']);
      setIsSimulating(false);
      if (speakAlert) speakAlert('Automated escalation simulation completed successfully.');
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Automated Escalation Rule Builder</h3>
              <p className="text-xs text-muted">Configure autonomous alerts when members are trapped in water</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-sans">
          {/* Depth Trigger Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-bold text-ink">
              <span>High-Water Trigger Threshold</span>
              <span className="font-mono text-purple-primary text-sm">{thresholdDepth} cm</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="60" 
              step="5"
              value={thresholdDepth} 
              onChange={e => setThresholdDepth(Number(e.target.value))}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-mono mt-1">
              <span>15cm (Curb Overwash)</span>
              <span>30cm (Exhaust Level)</span>
              <span>60cm (Waist Deep)</span>
            </div>
          </div>

          {/* Dwell Time Trigger Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-bold text-ink">
              <span>Dwell Time Before Circle Broadcast</span>
              <span className="font-mono text-purple-primary text-sm">{dwellMinutes} mins</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="45" 
              step="5"
              value={dwellMinutes} 
              onChange={e => setDwellMinutes(Number(e.target.value))}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-mono mt-1">
              <span>5 mins</span>
              <span>15 mins (Standard)</span>
              <span>45 mins</span>
            </div>
          </div>

          {/* Automation Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoSmsEnabled} 
                onChange={e => setAutoSmsEnabled(e.target.checked)}
                className="w-4 h-4 accent-purple-primary rounded"
              />
              <div>
                <span className="font-bold text-ink block">Auto-Dispatch Emergency SMS to Circle</span>
                <span className="text-[11px] text-muted">Sends nearest elevated haven coordinates if mobile data fails</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input 
                type="checkbox" 
                checked={bmcRelayEnabled} 
                onChange={e => setBmcRelayEnabled(e.target.checked)}
                className="w-4 h-4 accent-purple-primary rounded"
              />
              <div>
                <span className="font-bold text-ink block">BMC Disaster 1916 Telemetry Dispatch</span>
                <span className="text-[11px] text-muted">Shares anonymous micro-basin flood distress ticket with municipal control</span>
              </div>
            </label>
          </div>

          {/* Sandbox Simulation */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">Escalation Rule Sandbox</span>
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all disabled:opacity-50"
              >
                {isSimulating ? 'Simulating...' : 'Run Test Trigger'}
              </button>
            </div>

            <div className="text-[11px] text-slate-300 bg-black/40 p-3 rounded-xl max-h-32 overflow-y-auto space-y-1">
              {simulationLogs.length === 0 ? (
                <span className="text-slate-500">Click 'Run Test Trigger' to test rule execution in virtual sandbox.</span>
              ) : (
                simulationLogs.map((log, i) => (
                  <p key={i} className="text-emerald-400">{log}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. Zero-Track Privacy & Location Obfuscation Tuner
========================================================================= */
export function ZeroTrackPrivacyModal({ isOpen, onClose, currentMode, onSelectMode }) {
  if (!isOpen) return null;

  const modes = [
    {
      id: '1km',
      name: '1km Micro-Basin Fuzzy (Recommended)',
      desc: 'GPS coordinates blurred into 1km catchment bubble. Protects exact street privacy while accurately predicting flood basin inundation.',
      badge: 'STRICT PRIVACY'
    },
    {
      id: '500m',
      name: '500m Neighborhood Bubble',
      desc: 'Higher accuracy for dense street navigation. Coordinates mapped to nearest major municipal landmark without revealing apartment address.',
      badge: 'BALANCED'
    },
    {
      id: 'exact',
      name: 'Exact GPS with Family Passkey',
      desc: 'Pin-point meter-level accuracy. Only shared with authenticated circle members for targeted rescue boat extraction.',
      badge: 'PRECISION RESCUE'
    },
    {
      id: 'ghost',
      name: 'Ghost / Stealth Mode',
      desc: 'Coordinates completely hidden until an active SOS panic button is pressed by the member.',
      badge: 'MAX INCOGNITO'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Zero-Track Privacy Settings</h3>
              <p className="text-xs text-muted">Control coordinate fuzzing and micro-basin obfuscation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-sans">
          {modes.map(mode => (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                currentMode === mode.id 
                  ? 'border-purple-primary bg-purple-50 ring-2 ring-purple-soft' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-ink text-sm">{mode.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                  {mode.badge}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">{mode.desc}</p>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold transition-colors"
            >
              Apply Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   7. 48-Hour Go-Bag & Emergency Supplies Inventory
========================================================================= */
export function GoBagSuppliesModal({ isOpen, onClose }) {
  const [supplies, setSupplies] = useState(() => {
    try {
      const saved = localStorage.getItem('family_gobag_supplies');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'gb-1', category: 'Nutrition', item: '5L Potable Water per person (sealed cans/bottles)', packed: true },
      { id: 'gb-2', category: 'Nutrition', item: 'Dry Energy Bars / High-Calorie Biscuits (48h supply)', packed: true },
      { id: 'gb-3', category: 'Medical', item: 'ORS Hydration Sachets & Water Purification Tablets', packed: true },
      { id: 'gb-4', category: 'Medical', item: 'Essential Prescription Medicines in waterproof pouch', packed: false },
      { id: 'gb-5', category: 'Power', item: '2x 20,000mAh Power Banks charged to 100%', packed: false },
      { id: 'gb-6', category: 'Power', item: 'LED Headlamp & Heavy-Duty Waterproof Flashlight', packed: true },
      { id: 'gb-7', category: 'Survival', item: 'Emergency High-Decibel Safety Whistle for Boat Rescue', packed: false },
      { id: 'gb-8', category: 'Survival', item: 'Foil Thermal Space Blankets & Rain Ponchos', packed: true }
    ];
  });

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    localStorage.setItem('family_gobag_supplies', JSON.stringify(supplies));
  }, [supplies]);

  if (!isOpen) return null;

  const togglePacked = (id) => {
    setSupplies(supplies.map(s => s.id === id ? { ...s, packed: !s.packed } : s));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setSupplies([...supplies, { id: `gb-${Date.now()}`, category: 'Custom', item: newItem.trim(), packed: false }]);
    setNewItem('');
  };

  const packedCount = supplies.filter(s => s.packed).length;
  const pct = Math.round((packedCount / supplies.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Family 48-Hour Go-Bag Readiness</h3>
              <p className="text-xs text-muted">Vital survival rations ready for instant grab-and-go</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Progress Bar */}
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-ink text-xs">Readiness Score: {pct}%</span>
              <span className="font-mono text-xs font-bold text-purple-primary">{packedCount} of {supplies.length} packed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-purple-200 overflow-hidden">
              <div 
                className="h-full bg-purple-primary transition-all duration-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            {supplies.map(item => (
              <div 
                key={item.id}
                onClick={() => togglePacked(item.id)}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  item.packed ? 'bg-slate-50 border-slate-200 text-slate-500 line-through' : 'bg-white border-slate-200 text-ink hover:border-purple-300'
                }`}
              >
                {item.packed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className="text-xs font-medium">{item.item}</span>
                  <span className="text-[10px] font-mono text-muted block">{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item */}
          <form onSubmit={handleAddItem} className="flex gap-2 pt-2">
            <input 
              type="text" 
              placeholder="Add custom emergency item..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-purple-primary"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-primary text-white font-bold text-xs"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   8. Critical Medical & Vulnerability Registry Modal
========================================================================= */
export function MedicalRegistryModal({ isOpen, onClose, members, speakAlert }) {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadDossier = () => {
    setDownloaded(true);
    if (speakAlert) speakAlert('Medical emergency dossier generated and saved.');
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Family Medical & Triage Registry</h3>
              <p className="text-xs text-muted">Special assistance & medication profiles for NDRF/paramedics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          {members.map(member => (
            <div key={member.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink text-sm">{member.name} ({member.relation})</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                  {member.mobility || 'Walking / Agile'}
                </span>
              </div>
              <div className="text-[11px] space-y-1 font-mono">
                <p><span className="text-muted">Medical Dependency:</span> <span className="text-red-600 font-bold">{member.medicalFlag || 'None'}</span></p>
                <p><span className="text-muted">Blood Group:</span> <span className="font-bold text-ink">B+ Positive</span></p>
                <p><span className="text-muted">Rescue Priority:</span> <span className="font-bold text-ink">{member.status === 'danger' ? 'PRIORITY 1 (HIGH WATER TRAPPED)' : 'PRIORITY 3 (MONITORING)'}</span></p>
              </div>
            </div>
          ))}

          <button
            onClick={handleDownloadDossier}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {downloaded ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {downloaded ? 'Dossier Saved (Ready for First Responders)' : 'Export Triage Dossier (PDF / Text)'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   9. Family Vehicle Elevation & Parking Flood Guard Modal
========================================================================= */
export function VehicleSafetyModal({ isOpen, onClose }) {
  const [vehicles, setVehicles] = useState([
    { id: 'vh-1', name: 'Hyundai Creta (SUV)', parkingLevel: 'Basement -1', groundClearanceCm: 19, risk: 'HIGH', streetWaterCm: 32 },
    { id: 'vh-2', name: 'Honda Activa 6G (Scooter)', parkingLevel: 'Ground Floor Stilt', groundClearanceCm: 15, risk: 'CAUTION', streetWaterCm: 14 },
    { id: 'vh-3', name: 'Honda City (Sedan)', parkingLevel: 'Elevated Podium 2nd Floor', groundClearanceCm: 16, risk: 'SAFE', streetWaterCm: 0 }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Car className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Vehicle Submersion & Ramp Guard</h3>
              <p className="text-xs text-muted">Prevent catastrophic engine hydro-lock in low parking lots</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-sans">
          {vehicles.map(v => (
            <div key={v.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink text-sm">{v.name}</span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  v.risk === 'HIGH' ? 'bg-red-100 text-red-800' : v.risk === 'CAUTION' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {v.risk === 'HIGH' ? 'CRITICAL IMMERSION RISK' : v.risk === 'CAUTION' ? 'WATER APPROACHING' : 'SECURE ON PODIUM'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-3">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[10px]">CURRENT DECK</span>
                  <span className="font-bold text-ink">{v.parkingLevel}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[10px]">EXHAUST CLEARANCE</span>
                  <span className="font-bold text-ink">{v.groundClearanceCm} cm</span>
                </div>
              </div>
              {v.risk === 'HIGH' && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-100/70 border border-red-200 text-red-800 font-bold text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Basement water pumps overwhelmed. Immediate action: move vehicle to 1st floor podium ramp!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   10. Pet & Livestock Evacuation Readiness Modal
========================================================================= */
export function PetSafetyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Pet & Animal Evacuation Center</h3>
              <p className="text-xs text-muted">Ensure four-legged family members are safe and documented</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-ink text-sm">Bruno (Golden Retriever)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                CARRIER & LEASH READY
              </span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 font-mono mt-3">
              <li>✓ Rabies vaccination certificate stored in waterproof sleeve</li>
              <li>✓ 3-day dry kibble ration packed in sealed ziploc</li>
              <li>✓ Reflective high-visibility collar fitted</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
            <span className="font-bold text-ink block text-xs mb-1">Nearest Pet-Friendly Evacuation Haven:</span>
            <span className="text-purple-primary font-bold block text-sm">Kokilaben Dhirubhai Ambani Hospital (Basement Animal Enclosure)</span>
            <span className="text-muted text-[11px] block mt-0.5">35 animal kennels • On-duty volunteer veterinarian available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   11. Offline Emergency SMS & Bluetooth Mesh Payload Modal
========================================================================= */
export function OfflineSmsMeshModal({ isOpen, onClose, members }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Ultra-compact SMS payload that fits into a single 160-char SMS
  const smsString = `MUM-FLOOD# Sharma Circle
Safe: ${members.filter(m => m.status === 'safe').length}
Risk: ${members.filter(m => m.status !== 'safe').length}
Wards: ${members.map(m => m.ward).join(',')}
Rendezvous: Don Bosco Hall
Req Help: ${members.find(m => m.status === 'danger') ? 'YES' : 'NO'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Radio className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Offline SMS & BLE Mesh Telemetry</h3>
              <p className="text-xs text-muted">Compact encoded string for cell network tower blackout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono">
            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
              <span>COMPACT SMS (142 / 160 CHARS)</span>
              <span>NO 4G/WIFI REQUIRED</span>
            </div>
            <pre className="text-xs text-purple-300 whitespace-pre-wrap leading-relaxed">{smsString}</pre>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Compact SMS Payload'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   12. Family Circle QR Code Invite & Sharing Modal
========================================================================= */
export function CircleInviteModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const circleCode = 'MUM-SAFE-7842';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://mumbai-flood.gov.in/join?code=${circleCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center text-xs">
        <div className="w-12 h-12 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6 text-purple-primary" />
        </div>
        <h3 className="font-extrabold text-ink text-base">Invite Family to Safety Circle</h3>
        <p className="text-muted text-[11px] mt-1 mb-4">Scan or share this passkey to sync real-time basin telemetry</p>

        {/* QR Simulation Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-4 flex flex-col items-center justify-center">
          <div className="w-36 h-36 border-4 border-slate-900 rounded-2xl p-2 bg-white flex flex-wrap gap-1 items-center justify-center">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className={`w-3.5 h-3.5 rounded-sm ${i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-transparent'}`} />
            ))}
          </div>
          <span className="font-mono text-sm font-extrabold text-ink mt-3 tracking-widest">{circleCode}</span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Link Copied' : 'Copy Family Invite Link'}
        </button>

        <button onClick={onClose} className="mt-3 text-slate-500 hover:text-ink font-bold block mx-auto">
          Close
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   13. Municipal Storm Sensors & River Gauge Proximity Monitor Modal
========================================================================= */
export function ProximitySensorsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sensors = [
    { name: 'Mithi River Outfall Telemetry', distanceKm: 1.2, currentLevelM: 3.4, dangerLevelM: 4.0, trend: '+0.2m/hr', status: 'ALERT' },
    { name: 'Hindmata Underpass Storm Gauge', distanceKm: 2.1, currentLevelM: 0.45, dangerLevelM: 0.50, trend: '+0.05m/hr', status: 'CRITICAL' },
    { name: 'Dadar TT Flowmeter Sensor', distanceKm: 1.8, currentLevelM: 0.18, dangerLevelM: 0.35, trend: 'STABLE', status: 'NORMAL' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Activity className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Municipal River & Sump Sensors</h3>
              <p className="text-xs text-muted">Proximity to active hydrological telemetry stations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-sans">
          {sensors.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-ink text-sm">{s.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  s.status === 'CRITICAL' ? 'bg-red-200 text-red-900' : s.status === 'ALERT' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] mt-2">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[10px]">DISTANCE</span>
                  <span className="font-bold text-ink">{s.distanceKm} km away</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[10px]">CURRENT LEVEL</span>
                  <span className="font-bold text-red-600">{s.currentLevelM} m</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[10px]">RISE TREND</span>
                  <span className="font-bold text-ink">{s.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   14. Waterproof Family Document Vault Checklist Modal
========================================================================= */
export function DocumentVaultModal({ isOpen, onClose }) {
  const [docs, setDocs] = useState([
    { id: 'dc-1', name: 'Aadhaar Identity Cards (All Members)', verified: true },
    { id: 'dc-2', name: 'Original Property & Tenancy Deed in Waterproof Pouch', verified: false },
    { id: 'dc-3', name: 'Comprehensive Flood Insurance Policy Card', verified: true },
    { id: 'dc-4', name: 'Vehicle Registration Certificate (RC)', verified: false },
    { id: 'dc-5', name: 'Medical Insurance Health Cards & Prescriptions', verified: true }
  ]);

  if (!isOpen) return null;

  const toggleDoc = (id) => {
    setDocs(docs.map(d => d.id === id ? { ...d, verified: !d.verified } : d));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Waterproof Document Vault</h3>
              <p className="text-xs text-muted">Safeguard critical physical and digital proofs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-sans">
          {docs.map(doc => (
            <div
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                {doc.verified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span className={`font-medium ${doc.verified ? 'text-ink font-bold' : 'text-slate-600'}`}>
                  {doc.name}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {doc.verified ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   15. 15-Minute Evacuation Readiness Drill Stopwatch Modal
========================================================================= */
export function EvacuationDrillModal({ isOpen, onClose, speakAlert }) {
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const drillSteps = [
    { id: 1, title: 'Isolate main electricity MCB trip switch to prevent electrocution' },
    { id: 2, title: 'Collect 48h Go-Bag and medications in waterproof bag' },
    { id: 3, title: 'Secure pets in portable carriers with leash and identification' },
    { id: 4, title: 'Move to designated 1st floor stilt ramp or high-ground rendezvous' }
  ];

  useEffect(() => {
    let interval;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const toggleStep = (id) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleStartDrill = () => {
    setIsRunning(true);
    if (speakAlert) speakAlert('Family evacuation drill started. Complete all 4 safety steps before the 15 minute timer expires.');
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(900);
    setCompletedSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">15-Minute Evacuation Drill</h3>
              <p className="text-xs text-muted">Practice family muscle memory for emergency flood escape</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-sans">
          {/* Big Stopwatch Display */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 text-center">
            <span className="text-[11px] font-mono text-purple-300 uppercase block mb-1">DRILL COUNTDOWN TIMER</span>
            <div className="text-5xl font-black font-mono tracking-widest text-white mb-4">
              {timeFormatted}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause Drill' : 'Start Drill'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Steps checklist */}
          <div className="space-y-2">
            <span className="font-bold text-ink block text-xs">Drill Tasks Completed: ({completedSteps.length} of {drillSteps.length})</span>
            {drillSteps.map(step => (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  completedSteps.includes(step.id) 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs leading-relaxed">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   16. Real-Time Family Check-In Feed & Activity Timeline Modal
========================================================================= */
export function FamilyCheckInTimelineModal({ isOpen, onClose, events, onAddNote }) {
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Family Check-In Timeline & Audit</h3>
              <p className="text-xs text-muted">Chronological audit log of all circle telemetry & safety pings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Post Note Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Broadcast a note to the family feed..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-purple-primary"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-primary text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Post
            </button>
          </form>

          {/* Timeline list */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {events.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-purple-primary shrink-0 mt-2" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-ink text-xs">{ev.title}</span>
                    <span className="text-[10px] font-mono text-muted">{ev.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   17. Dry Safe Extraction Corridor Navigator Modal
========================================================================= */
export function SafeCorridorModal({ isOpen, onClose, members }) {
  const [selectedOrigin, setSelectedOrigin] = useState(members[0]?.id || '');
  const [routeType, setRouteType] = useState('pedestrian');

  if (!isOpen) return null;

  const currentMember = members.find(m => m.id === selectedOrigin) || members[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Dry Extraction Corridor</h3>
              <p className="text-xs text-muted">Safe elevated routing avoiding submerged subways</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-ink mb-1">Select Family Member to Extract:</label>
            <select 
              value={selectedOrigin}
              onChange={e => setSelectedOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink bg-slate-50 focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.locationFuzzy} - Water {m.localWaterDepth}cm)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
            <span className="text-[10px] font-mono uppercase font-bold text-purple-primary block mb-1">
              RECOMMENDED ESCAPE VECTOR
            </span>
            <h4 className="text-sm font-bold text-ink">
              Via Western Express Elevated Deck to Don Bosco Haven
            </h4>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Divert away from Milan Subway and Hindmata Underpass. Maintain altitude along Ambedkar Road flyover. Maximum estimated standing water on route is 4 cm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-muted block">TRAVEL DURATION</span>
              <span className="text-sm font-bold text-ink">14 Mins Walk</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-muted block">CORRIDOR ELEVATION</span>
              <span className="text-sm font-bold text-emerald-600">+16.2m MSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   18. Battery Saver & Low-Power Remote Beacon Modal
========================================================================= */
export function BatteryBeaconModal({ isOpen, onClose, members }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <BatteryWarning className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-lg">Battery Conservation Beacon</h3>
              <p className="text-xs text-muted">Prolong phone battery life during grid power failures</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-sans">
          {members.map(member => (
            <div key={member.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-soft text-purple-deep flex items-center justify-center font-bold text-xs">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-ink block">{member.name}</span>
                  <span className="text-[10px] text-muted font-mono">Ward {member.ward}</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-ink block">{member.batteryLevel}</span>
                <span className="text-[10px] text-emerald-600">Beacon Interval: 30m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

