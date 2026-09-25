import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Clock,
  MapPin,
  Send,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Shield,
  FileCheck,
  Radio,
  Volume2,
  VolumeX,
  X,
  Plus,
  Compass,
  PhoneCall,
  Activity,
  Layers,
  Camera,
  Download,
  Printer,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  ChevronRight,
  TrendingDown,
  Droplets,
  HardHat,
  Search,
  Crosshair,
  FileText,
  LifeBuoy,
  Anchor,
  Box,
  CornerDownRight,
  Megaphone,
  Bell,
  Gauge,
  HelpCircle,
} from 'lucide-react';

/* =====================================================================
   FEATURE 1: Incident Creation Wizard & Geolocation Picker Modal
===================================================================== */
export function IncidentCreationModal({ isOpen, onClose, onAddIncident, showToast }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    ward: 'Ward F/N',
    severity: 'High',
    depth: 35,
    cause: 'Box Drain Surcharge & Runoff Accumulation',
    reportedBy: 'Field DMU Unit',
    area: '0.8 km²',
    coordinatesLat: 19.0392,
    coordinatesLng: 72.8619,
    assignedSquad: 'Squad 04 (500HP Dewatering Pump)',
  });

  if (!isOpen) return null;

  const PRESET_LOCATIONS = [
    { name: 'Sion Circle (Ward F/N)', lat: 19.0392, lng: 72.8619, ward: 'Ward F/N' },
    { name: 'Andheri Subway (Ward K/E)', lat: 19.1197, lng: 72.8468, ward: 'Ward K/E' },
    { name: 'Kurla West LBS Road (Ward L)', lat: 19.0682, lng: 72.8760, ward: 'Ward L' },
    { name: 'Milan Subway (Ward H/E)', lat: 19.0883, lng: 72.8427, ward: 'Ward H/E' },
    { name: 'Hindmata Flyover (Ward G/N)', lat: 19.0144, lng: 72.8432, ward: 'Ward G/N' },
    { name: 'Kanjurmarg West (Ward S)', lat: 19.1302, lng: 72.9284, ward: 'Ward S' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      showToast('Please enter an incident title and location');
      return;
    }
    const incidentId = `INC-${Math.floor(2050 + Math.random() * 900)}`;
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    
    const newInc = {
      id: incidentId,
      title: formData.title,
      location: `${formData.location} (${formData.ward})`,
      ward: formData.ward,
      severity: formData.severity,
      detectedTime: `${timeNow} (Just now)`,
      predictedPeak: `${parseInt(formData.depth) + 12} cm in 45m`,
      depth: parseInt(formData.depth),
      status: 'DISPATCH PENDING',
      area: formData.area,
      cause: formData.cause,
      confidence: '95.4%',
      coordinates: [parseFloat(formData.coordinatesLat), parseFloat(formData.coordinatesLng)],
      assignedSquad: formData.assignedSquad,
      squadEta: '10 mins',
      timeline: [
        { time: timeNow.slice(0, 5), text: `Incident Created via Command Console (${formData.reportedBy})` },
        { time: timeNow.slice(0, 5), text: `Hydraulic baseline established at ${formData.depth} cm` },
      ],
    };

    onAddIncident(newInc);
    showToast(`Created & Queued Incident ${incidentId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Log New Emergency Incident</h3>
              <p className="text-[11px] text-ink-secondary">Deploy triage dossier to multi-agency queue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Incident Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Surcharge Flooding & Stranded Vehicle Trap"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Ward Jurisdiction</label>
              <select
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
              >
                <option value="Ward F/N">Ward F/N (Sion / Matunga)</option>
                <option value="Ward L">Ward L (Kurla / Chunabhatti)</option>
                <option value="Ward K/E">Ward K/E (Andheri East)</option>
                <option value="Ward G/N">Ward G/N (Dadar / Mahim)</option>
                <option value="Ward H/E">Ward H/E (Santacruz / Milan)</option>
                <option value="Ward S">Ward S (Bhandup / Kanjurmarg)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Initial Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple font-semibold"
              >
                <option value="Critical">CRITICAL (Water &gt; 40cm / Road Blocked)</option>
                <option value="High">HIGH (Water 25-40cm / Traffic Slow)</option>
                <option value="Moderate">MODERATE (Ponding 10-25cm)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Specific Location / Landmark</label>
            <input
              type="text"
              required
              placeholder="e.g. Sion Hospital Gate 2 - LBS Marg Junction"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc.name}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      location: loc.name,
                      ward: loc.ward,
                      coordinatesLat: loc.lat,
                      coordinatesLng: loc.lng,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-purple-soft/60 hover:bg-purple-soft text-purple text-[10px] font-medium"
                >
                  {loc.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Water Depth (cm)</label>
              <input
                type="number"
                min="5"
                max="150"
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">GPS Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.coordinatesLat}
                onChange={(e) => setFormData({ ...formData, coordinatesLat: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">GPS Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.coordinatesLng}
                onChange={(e) => setFormData({ ...formData, coordinatesLng: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Primary Hydrological Cause</label>
              <select
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
              >
                <option value="Box Drain Surcharge & Runoff Accumulation">Box Drain Surcharge &amp; Runoff</option>
                <option value="Tidal Outfall Backflow Gate Lockout">Tidal Outfall Backflow Gate Lockout</option>
                <option value="Culvert Throat Debris Choke">Culvert Throat Debris Choke</option>
                <option value="Depression Ingress Exceeding Sump Capacity">Depression Sump Overtopping</option>
                <option value="Nullah Embankment Overflow">Nullah Embankment Overflow</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Reported By</label>
              <select
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
              >
                <option value="Automated CCTV Depth Vision AI">Automated CCTV Depth Vision AI</option>
                <option value="Field DMU Patrol Unit">Field DMU Patrol Unit</option>
                <option value="Citizen SOS Call (112 Hub)">Citizen SOS Call (112 Hub)</option>
                <option value="Traffic Police Control Room">Traffic Police Control Room</option>
                <option value="Drainage Ultrasonic Telemetry Node">Drainage Ultrasonic Telemetry Node</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Target Response Squad</label>
            <input
              type="text"
              value={formData.assignedSquad}
              onChange={(e) => setFormData({ ...formData, assignedSquad: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Log &amp; Dispatch Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 2: Multi-Agency Unit Dispatch & Tactical Allocation Console
===================================================================== */
export function SquadAllocationModal({ isOpen, onClose, incident, onUpdateIncident, showToast }) {
  const [selectedSquad, setSelectedSquad] = useState('Squad-04 (500HP Dewatering Pump)');
  const [radioFreq, setRadioFreq] = useState('156.800 MHz (Tactical Ch 16)');
  const [missionType, setMissionType] = useState('RAPID DEWATERING & CLEARANCE');
  const [etaMins, setEtaMins] = useState(8);
  const [priorityLevel, setPriorityLevel] = useState('PRIORITY 1 - IMMEDIATE INTERVENTION');
  const [notes, setNotes] = useState('Deploy suction lines to drainage manhole and throttle overflow.');

  if (!isOpen || !incident) return null;

  const AVAILABLE_SQUADS = [
    { id: 'SQ-04', name: 'Squad-04 (500HP Dewatering Pump)', agency: 'BMC Disaster Cell', status: 'READY', base: 'Dadar Depot', crew: '6 Personnel' },
    { id: 'SQ-01', name: 'Squad-01 (350HP High-Head Submersible)', agency: 'BMC Stormwater Ops', status: 'READY', base: 'Sion Base', crew: '4 Personnel' },
    { id: 'TR-08', name: 'Traffic Unit 08 (Mobile Barricade Team)', agency: 'Mumbai Traffic Police', status: 'PATROLLING', base: 'Bandra Div', crew: '4 Officers' },
    { id: 'FB-03', name: 'Fire Engine & Hazmat Unit 03', agency: 'Mumbai Fire Brigade', status: 'STANDBY', base: 'Kurla Station', crew: '8 Firefighters' },
    { id: 'NDRF-02', name: 'NDRF Boat Unit 02 (Zodiac Inflatables)', agency: 'NDRF 5th Battalion', status: 'STANDBY', base: 'BKC Staging Hub', crew: '12 Rescuers' },
    { id: 'SWM-14', name: 'Silt Clearance Excavator Team 14', agency: 'Solid Waste Management', status: 'READY', base: 'Ward L Yard', crew: '5 Technicians' },
  ];

  const handleDispatch = () => {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const updated = {
      assignedSquad: selectedSquad,
      squadEta: `${etaMins} mins`,
      status: `DEPLOYED: ${selectedSquad.split(' (')[0]}`,
      timeline: [
        ...incident.timeline,
        { time: timeNow, text: `Tactical Dispatch Order Issued: ${selectedSquad} (${missionType}, ETA: ${etaMins}m, Radio: ${radioFreq})` },
      ],
    };
    onUpdateIncident(incident.id, updated);
    showToast(`Dispatched ${selectedSquad} to ${incident.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Truck className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Multi-Agency Tactical Squad Allocation</h3>
              <p className="text-[11px] text-ink-secondary">Incident: {incident.id} • {incident.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink mb-1.5 uppercase font-mono">Select Certified Response Unit</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {AVAILABLE_SQUADS.map((sq) => (
                <div
                  key={sq.id}
                  onClick={() => setSelectedSquad(sq.name)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedSquad === sq.name ? 'bg-purple-soft border-purple text-ink font-semibold' : 'bg-surface-secondary border-border hover:border-purple/40 text-ink'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border">
                      {sq.id}
                    </span>
                    <div>
                      <div className="font-bold text-xs">{sq.name}</div>
                      <div className="text-[10px] text-ink-secondary">{sq.agency} • Base: {sq.base}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-status-safe-soft text-status-safe uppercase">
                      {sq.status}
                    </span>
                    <div className="text-[10px] text-ink-secondary mt-0.5">{sq.crew}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Mission Classification</label>
              <select
                value={missionType}
                onChange={(e) => setMissionType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-semibold"
              >
                <option value="RAPID DEWATERING & CLEARANCE">Rapid Dewatering &amp; Pump Clearance</option>
                <option value="ROADWAY BARRICADE & DIVERSION">Roadway Barricade &amp; Diversion</option>
                <option value="SEARCH & WATER RESCUE">Search &amp; Inflatable Boat Rescue</option>
                <option value="CULVERT DESILTING & UNBLOCK">Culvert Desilting &amp; Grate Clearing</option>
                <option value="ELECTRICAL SHUTDOWN CORDON">Electrical Hazard Cordoning</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Assigned Radio Frequency</label>
              <select
                value={radioFreq}
                onChange={(e) => setRadioFreq(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono"
              >
                <option value="156.800 MHz (Tactical Ch 16)">156.800 MHz (Tactical Ch 16)</option>
                <option value="161.450 MHz (Disaster Command Ch 04)">161.450 MHz (Disaster Command Ch 04)</option>
                <option value="151.625 MHz (Police Inter-Op)">151.625 MHz (Police Inter-Op)</option>
                <option value="142.100 MHz (Fire Brigade Net)">142.100 MHz (Fire Brigade Net)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Estimated Travel ETA (mins)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={etaMins}
                onChange={(e) => setEtaMins(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Priority Order</label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-bold text-status-alert"
              >
                <option value="PRIORITY 1 - IMMEDIATE INTERVENTION">Priority 1 - Immediate Emergency</option>
                <option value="PRIORITY 2 - HIGH URGENCY">Priority 2 - High Urgency</option>
                <option value="PRIORITY 3 - STANDARD RESPONSE">Priority 3 - Standard Staging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Commander Mission Directives</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs focus:outline-none focus:border-purple"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Issue Transmitted Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 3: Live GPS Telemetry & Unit Tracking Drawer
===================================================================== */
export function LiveSquadTrackerDrawer({ isOpen, onClose, incident, onMapFocus, showToast }) {
  const [speed, setSpeed] = useState(32);
  const [fuel, setFuel] = useState(84);
  const [pings, setPings] = useState([
    { time: '18:32:10', rtt: '18ms', lat: 19.0412, lng: 72.8590, status: 'NOMINAL' },
    { time: '18:31:40', rtt: '21ms', lat: 19.0435, lng: 72.8564, status: 'NOMINAL' },
    { time: '18:31:10', rtt: '19ms', lat: 19.0458, lng: 72.8540, status: 'NOMINAL' },
  ]);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSpeed((prev) => Math.max(15, Math.min(52, prev + (Math.floor(Math.random() * 7) - 3))));
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !incident) return null;

  const triggerPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const lat = (incident.coordinates[0] - 0.004 + (Math.random() * 0.002)).toFixed(4);
      const lng = (incident.coordinates[1] - 0.003 + (Math.random() * 0.002)).toFixed(4);
      const newPing = { time: now, rtt: `${Math.floor(14 + Math.random() * 12)}ms`, lat, lng, status: 'LOCKED' };
      setPings((prev) => [newPing, ...prev.slice(0, 4)]);
      setIsPinging(false);
      showToast(`GPS Telemetry Locked: ${lat}, ${lng} (RTT ${newPing.rtt})`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-surface border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-status-safe-soft flex items-center justify-center">
                <Radio className="w-4 h-4 text-status-safe animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Live GPS Unit Telemetry</h3>
                <p className="text-[10px] text-ink-secondary font-mono">{incident.assignedSquad || 'Squad-04'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* Realtime KPI cards */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                <span className="text-[10px] text-ink-secondary block">VELOCITY</span>
                <span className="text-base font-bold text-purple">{speed} km/h</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                <span className="text-[10px] text-ink-secondary block">DIESEL LEVEL</span>
                <span className="text-base font-bold text-status-safe">{fuel}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                <span className="text-[10px] text-ink-secondary block">EST. ARRIVAL</span>
                <span className="text-base font-bold text-status-alert">{incident.squadEta || '5m'}</span>
              </div>
            </div>

            {/* GPS Vector Location */}
            <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-ink uppercase">Current Geo-Lock</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                  ● DUAL-BAND GNSS ACTIVE
                </span>
              </div>
              <div className="font-mono text-xs text-purple font-semibold">
                LAT: {incident.coordinates[0]} | LNG: {incident.coordinates[1]}
              </div>
              <p className="text-[11px] text-ink-secondary">
                Approaching via Eastern Express Highway Slip Road towards {incident.location}.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    onMapFocus(incident.coordinates, 15.5, incident.assignedSquad);
                    showToast(`Centered map on ${incident.assignedSquad}`);
                  }}
                  className="flex-1 py-1.5 bg-surface hover:bg-border/40 border border-border rounded-lg text-xs font-semibold text-ink flex items-center justify-center gap-1.5"
                >
                  <Crosshair className="w-3.5 h-3.5 text-purple" />
                  <span>Center On Map</span>
                </button>
                <button
                  onClick={triggerPing}
                  disabled={isPinging}
                  className="flex-1 py-1.5 bg-purple hover:bg-purple-deep text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging...' : 'Send GPS Ping'}</span>
                </button>
              </div>
            </div>

            {/* Telemetry Ping Stream */}
            <div>
              <span className="text-[11px] font-mono font-bold text-ink-secondary uppercase block mb-1.5">
                Ping Telemetry Log
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {pings.map((p, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-surface-secondary border border-border/70 flex items-center justify-between">
                    <div>
                      <span className="text-purple font-bold">{p.time}</span>
                      <span className="text-ink-secondary ml-2">[{p.lat}, {p.lng}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-semibold">{p.rtt}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-status-safe-soft text-status-safe font-bold">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware specifications */}
            <div className="p-3 rounded-xl bg-purple-soft/50 border border-purple/20 space-y-1">
              <div className="font-bold text-xs text-purple">Vehicle Equipment Onboard:</div>
              <ul className="text-[11px] text-ink-secondary list-disc list-inside space-y-0.5">
                <li>500HP Diesel Turbo Dewatering Pump (Discharge: 1800 m³/hr)</li>
                <li>60m High-Tensile Heliflex Suction Hose with Strainer</li>
                <li>4x 50W Halogen Mast Floodlights</li>
                <li>First-Aid Medical Trauma Kit + Inflatable Life Vests (x6)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary">
          <button
            onClick={onClose}
            className="w-full py-2 bg-surface hover:bg-border/30 border border-border text-ink rounded-lg font-semibold"
          >
            Close Telemetry Drawer
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 4: Citizen Emergency SOS & Distress Call Assimilation Hub
===================================================================== */
export function CitizenSOSAssimilationModal({ isOpen, onClose, incident, showToast }) {
  const [calls, setCalls] = useState([
    {
      id: 'SOS-9102',
      caller: 'Sunita Mehra',
      phone: '+91 98201 •••••',
      waterLevel: '38 cm (Knee-high inside shop)',
      trapped: '3 persons (incl. 1 child)',
      urgency: 'HIGH',
      transcript: 'Water has flooded into ground floor chemist shop. Electric meters are sparking. Need immediate rescue or pump.',
      status: 'VERIFIED',
      time: '6m ago',
    },
    {
      id: 'SOS-9098',
      caller: 'Ramesh Kadam',
      phone: '+91 98194 •••••',
      waterLevel: '45 cm (Underpass approach)',
      trapped: 'Car stalled with family inside',
      urgency: 'CRITICAL',
      transcript: 'Vehicle stalled in rising water near subway mouth. Exhaust submerged, doors jammed from water pressure.',
      status: 'AMBULANCE QUEUED',
      time: '12m ago',
    },
    {
      id: 'SOS-9087',
      caller: 'Deepak Joshi',
      phone: '+91 98332 •••••',
      waterLevel: '22 cm (Apartment compound)',
      trapped: 'None (Elderly resident needs medicine)',
      urgency: 'MODERATE',
      transcript: 'Basement parking full. Water entering lobby. Need evacuation support for 82yo cardiac patient.',
      status: 'STAGED',
      time: '18m ago',
    },
  ]);

  if (!isOpen || !incident) return null;

  const handleAction = (id, act) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status: act } : c)));
    showToast(`${act} for call ${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <PhoneCall className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Citizen 112/108 SOS Distress Assimilation</h3>
              <p className="text-[11px] text-ink-secondary">Correlated 500m radius of {incident.id} ({calls.length} distress calls)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-purple-soft/60 border border-purple/20 flex items-center justify-between">
            <div className="text-[11px] text-ink font-semibold">
              Live Voice AI Call Transcription Engine: <strong>Active (Hindi / Marathi / English)</strong>
            </div>
            <span className="font-mono text-[10px] text-purple font-bold">● CLUSTER CONFIDENCE 96%</span>
          </div>

          <div className="space-y-2.5">
            {calls.map((call) => (
              <div key={call.id} className="p-3 rounded-xl border border-border bg-surface-secondary space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{call.id}</span>
                    <span className="font-semibold text-ink">{call.caller}</span>
                    <span className="text-ink-secondary font-mono text-[10px]">({call.phone})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        call.urgency === 'CRITICAL'
                          ? 'bg-status-alert-soft text-status-alert'
                          : call.urgency === 'HIGH'
                          ? 'bg-status-warning-soft text-status-warning'
                          : 'bg-purple-soft text-purple'
                      }`}
                    >
                      {call.urgency}
                    </span>
                    <span className="text-[10px] text-ink-secondary font-mono">{call.time}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-surface p-2 rounded-lg border border-border">
                  <div>
                    <span className="text-ink-secondary">WATER LEVEL: </span>
                    <span className="text-status-alert font-bold">{call.waterLevel}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary">OCCUPANTS: </span>
                    <span className="text-ink font-bold">{call.trapped}</span>
                  </div>
                </div>

                <div className="text-[11px] text-ink italic bg-surface p-2 rounded-lg border border-border/60">
                  &ldquo;{call.transcript}&rdquo;
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono font-bold text-purple uppercase">
                    Status: {call.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAction(call.id, 'AMBULANCE 108 DISPATCHED')}
                      className="px-2.5 py-1 bg-surface hover:bg-border/40 border border-border rounded text-[10px] font-bold text-status-alert"
                    >
                      Dispatch 108 Ambulance
                    </button>
                    <button
                      onClick={() => handleAction(call.id, 'ATTACHED TO SQUAD MISSION')}
                      className="px-2.5 py-1 bg-purple text-white hover:bg-purple-deep rounded text-[10px] font-bold"
                    >
                      Route to Squad-04
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border bg-surface-secondary flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface border border-border text-ink hover:bg-border/30 rounded-lg text-xs font-semibold"
          >
            Close SOS Hub
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 5: Dynamic Barricade & Traffic Diversion Coordinator
===================================================================== */
export function TrafficBarricadeModal({ isOpen, onClose, incident, onUpdateVms, showToast }) {
  const [selectedJunctions, setSelectedJunctions] = useState(['Inlet Subway Ramp North', 'Western Arterial Slip']);
  const [vmsMessage, setVmsMessage] = useState('WARNING: SUBWAY INUNDATION 40CM - TRAFFIC CLOSED - USE GOKHALE OVERPASS');
  const [targetVmsId, setTargetVmsId] = useState('VMS-01');

  if (!isOpen || !incident) return null;

  const JUNCTIONS = [
    { id: 'J-1', name: 'Inlet Subway Ramp North', status: 'RECOMMENDED CLOSURE', distance: '120m' },
    { id: 'J-2', name: 'Western Arterial Slip Road', status: 'RECOMMENDED CLOSURE', distance: '280m' },
    { id: 'J-3', name: 'S.V. Road Diversion Crossover', status: 'OPEN DIVERSION', distance: '450m' },
    { id: 'J-4', name: 'Gokhale Bridge Flyover Feeder', status: 'FLOW OPTIMIZED', distance: '800m' },
  ];

  const toggleJunction = (name) => {
    setSelectedJunctions((prev) => (prev.includes(name) ? prev.filter((j) => j !== name) : [...prev, name]));
  };

  const handleApplyBarricade = () => {
    if (onUpdateVms) {
      onUpdateVms(targetVmsId, vmsMessage);
    }
    showToast(`Barricade order transmitted to Mumbai Traffic Police! VMS updated.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-warning-soft flex items-center justify-center">
              <Shield className="w-4 h-4 text-status-warning" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Dynamic Barricade &amp; Traffic Diversion</h3>
              <p className="text-[11px] text-ink-secondary">Coordinate with Mumbai Traffic Police (CAD Inter-op)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink mb-1.5 uppercase font-mono">
              Target Intersection Closure Cordon
            </label>
            <div className="space-y-1.5">
              {JUNCTIONS.map((j) => {
                const isSelected = selectedJunctions.includes(j.name);
                return (
                  <div
                    key={j.id}
                    onClick={() => toggleJunction(j.name)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                      isSelected ? 'bg-purple-soft border-purple' : 'bg-surface-secondary border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected} readOnly className="rounded text-purple" />
                      <div>
                        <span className="font-bold text-ink">{j.name}</span>
                        <span className="text-ink-secondary text-[10px] ml-2">({j.distance} away)</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface border border-border">
                      {j.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">
              Select Variable Message Sign (VMS) Screen
            </label>
            <select
              value={targetVmsId}
              onChange={(e) => setTargetVmsId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
            >
              <option value="VMS-01">VMS-01: Western Express Hwy (Northbound gantry)</option>
              <option value="VMS-02">VMS-02: Sion Circle Flyover Entry</option>
              <option value="VMS-03">VMS-03: S.V. Road Junction Display</option>
              <option value="VMS-04">VMS-04: LBS Marg / Kurla Depot Sign</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">
              Electronic Road Sign Alert Message (Simulated Matrix)
            </label>
            <div className="p-3 rounded-xl bg-black border-2 border-amber-500/70 font-mono text-amber-400 text-xs font-bold leading-relaxed shadow-inner">
              <textarea
                rows="2"
                value={vmsMessage}
                onChange={(e) => setVmsMessage(e.target.value)}
                className="w-full bg-transparent text-amber-400 focus:outline-none resize-none font-mono"
              />
            </div>
            <span className="text-[10px] text-ink-secondary mt-1 block">
              Character Count: {vmsMessage.length}/100 • Automatic Hindi translation enabled on roadside display
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyBarricade}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Transmit Barricade Signal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 6: Incident Severity & Hydrodynamic Escalation Engine
===================================================================== */
export function EscalationWorkflowModal({ isOpen, onClose, incident, onUpdateIncident, showToast }) {
  const [selectedTier, setSelectedTier] = useState(3);
  const [commanderCode, setCommanderCode] = useState('BMC-CMDR-941');
  const [justification, setJustification] = useState('Water depth exceeding 40cm with tidal lock preventing natural gravity drainage.');

  if (!isOpen || !incident) return null;

  const TIERS = [
    { level: 1, title: 'Tier 1: Ward Level Response', agency: 'Ward DMU Staff', desc: 'Standard local pump staging and drain cleaning' },
    { level: 2, title: 'Tier 2: BMC Disaster Management Cell', agency: 'BMC HQ Control Room', desc: 'Mobilize central reserve pumps and traffic diversion' },
    { level: 3, title: 'Tier 3: Police & Municipal Commissioner High Alert', agency: 'Joint Police & Municipal Ops', desc: 'Multi-agency arterial road closures and public alerts' },
    { level: 4, title: 'Tier 4: SEOC & NDRF State Emergency', agency: 'State Disaster Management Authority', desc: 'Inflatable boat deployment and army reserve notice' },
  ];

  const handleEscalate = () => {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const tierObj = TIERS.find((t) => t.level === selectedTier);
    const updated = {
      severity: selectedTier >= 3 ? 'Critical' : 'High',
      status: `ESCALATED: ${tierObj.title.split(':')[0]}`,
      timeline: [
        ...incident.timeline,
        { time: timeNow, text: `Formally Escalated to ${tierObj.title} by Commander ${commanderCode}. Justification: ${justification}` },
      ],
    };
    onUpdateIncident(incident.id, updated);
    showToast(`Incident escalated to ${tierObj.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Incident Escalation Matrix Protocol</h3>
              <p className="text-[11px] text-ink-secondary">Incident: {incident.id} • Current: {incident.severity}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <label className="block text-[11px] font-bold text-ink uppercase font-mono">
            Select Escalation Hierarchy Tier
          </label>
          <div className="space-y-2">
            {TIERS.map((tier) => (
              <div
                key={tier.level}
                onClick={() => setSelectedTier(tier.level)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTier === tier.level
                    ? 'bg-status-alert-soft/50 border-status-alert text-ink shadow-subtle'
                    : 'bg-surface-secondary border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink">{tier.title}</span>
                  <span className="text-[10px] font-mono font-bold text-status-alert">{tier.agency}</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">{tier.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Commander Badge Code</label>
              <input
                type="text"
                value={commanderCode}
                onChange={(e) => setCommanderCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Broadcast Target</label>
              <input
                type="text"
                disabled
                value="Joint DMU + Police HQ + SEOC"
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-ink-secondary text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Formal Justification</label>
            <textarea
              rows="2"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleEscalate}
              className="px-5 py-2 rounded-lg bg-status-alert text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Formal Escalation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 7: AI Root Cause Diagnostic & Hydraulic Solution Advisor
===================================================================== */
export function AIRootCauseModal({ isOpen, onClose, incident, showToast }) {
  if (!isOpen || !incident) return null;

  const CAUSES = [
    { factor: 'Mithi River Backpressure / Tidal Lock', pct: 44, color: '#DC2626' },
    { factor: 'Drop Inlet Siltation & Trash Grate Choke', pct: 28, color: '#F59E0B' },
    { factor: 'Depression Funnel Surface Runoff Inflow', pct: 18, color: '#3B82F6' },
    { factor: 'Insufficient Culvert Cross-Section (1.8m box)', pct: 10, color: '#8B5CF6' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">AI Root Cause &amp; Hydrodynamic Advisor</h3>
              <p className="text-[11px] text-ink-secondary">SWE 2D Shallow Water Equations + Neural Hydrograph Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink text-xs uppercase font-mono">Hydraulic Contributing Factors</span>
              <span className="text-[10px] font-mono text-purple font-bold">Confidence: {incident.confidence}</span>
            </div>
            <div className="space-y-2 pt-1">
              {CAUSES.map((c) => (
                <div key={c.factor} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink font-medium">{c.factor}</span>
                    <span className="font-mono font-bold text-ink">{c.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
                    <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-ink uppercase font-mono text-[11px] block">
              AI Actionable Engineering Recommendations
            </span>
            <div className="p-3 rounded-xl border border-purple/30 bg-purple-soft/40 space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">1. Override Mahim Tidal Sluice Gate:</strong>
                  <p className="text-ink-secondary">Trigger emergency bypass flap opening to relieve upstream pressure by 18 cm.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">2. Deploy 500HP Submersible Pump to Sump Node D-204:</strong>
                  <p className="text-ink-secondary">Discharge directly across barrier wall to eliminate ponding within 35 minutes.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">3. Mechanical Desilting of Trash Grate:</strong>
                  <p className="text-ink-secondary">Send hydraulic claw truck to clear polythene and silt blanket at drop inlet.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary font-medium"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                showToast('AI Mitigations automatically dispatched to field units!');
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Apply All Recommendations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 8: Real-Time Incident Comms / Multi-Agency Radio Log
===================================================================== */
export function IncidentRadioCommsDrawer({ isOpen, onClose, incident, showToast }) {
  const [messages, setMessages] = useState([
    { sender: 'DISASTER-CTRL', role: 'BMC HQ', time: '18:24', text: 'Squad-04, please confirm visual upon reaching Sion Circle.' },
    { sender: 'SQUAD-04', role: 'Dewatering Unit', time: '18:27', text: 'Visual confirmed. Water level approximately 40cm. Vehicles stranded in left lane.' },
    { sender: 'TRAFFIC-08', role: 'Traffic Police', time: '18:29', text: 'Barricades placed at Gokhale overpass ramp. Diverting traffic.' },
    { sender: 'DISASTER-CTRL', role: 'BMC HQ', time: '18:31', text: 'Roger that. High tide peaking at 19:20. Begin suction pumping immediately.' },
  ]);
  const [inputText, setInputText] = useState('');
  const [channel, setChannel] = useState('CH-01 (BMC Main)');

  if (!isOpen || !incident) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText) return;
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'COMMAND-DESK', role: 'Dispatcher', time: timeNow, text: inputText };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    showToast('Radio dispatch transmitted on ' + channel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-surface border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
                <Radio className="w-4 h-4 text-purple" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Multi-Agency Radio Terminal</h3>
                <p className="text-[10px] text-ink-secondary font-mono">{channel} • 156.800 MHz</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-surface border-b border-border flex items-center gap-2">
            <span className="text-[10px] font-mono text-ink-secondary font-bold uppercase">Channel:</span>
            {['CH-01 (BMC Main)', 'CH-02 (Traffic)', 'CH-03 (Fire/Rescue)'].map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  channel === ch ? 'bg-purple text-white font-bold' : 'bg-surface-secondary text-ink border border-border'
                }`}
              >
                {ch.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-surface-secondary border border-border space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-purple">{m.sender} <span className="text-ink-secondary font-normal">({m.role})</span></span>
                  <span className="text-ink-secondary">{m.time} IST</span>
                </div>
                <p className="text-ink text-[11px] leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-surface-secondary flex gap-2">
          <input
            type="text"
            placeholder="Type radio dispatch..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-ink text-xs focus:outline-none focus:border-purple"
          />
          <button type="submit" className="p-2 bg-purple text-white rounded-lg hover:bg-purple-deep">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 9: Incident Photo/Drone Surveillance & CCTV Evidence Hub
===================================================================== */
export function IncidentSurveillanceModal({ isOpen, onClose, incident, showToast }) {
  const [activeTab, setActiveTab] = useState('cctv'); // cctv | drone | thermal

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Camera className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Surveillance &amp; Drone Aerial Hub</h3>
              <p className="text-[11px] text-ink-secondary">{incident.location} • Real-Time AI Visual Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            {[
              { id: 'cctv', label: 'CCTV Camera #04 (Roadway)' },
              { id: 'drone', label: 'Drone Orthomosaic (DJI Matrice)' },
              { id: 'thermal', label: 'Thermal Infrared Layer' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeTab === tab.id ? 'bg-purple text-white shadow-sm' : 'bg-surface-secondary text-ink hover:text-purple'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Visual feed container */}
          <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-border">
            {/* Simulation Grid Graphics */}
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            <div className="text-center z-10 space-y-2">
              <div className="font-mono text-emerald-400 text-xs font-bold tracking-wider">
                ● LIVE FEED ENCRYPTED [30 FPS - 1080p]
              </div>
              <div className="text-white/80 text-sm font-bold">{incident.location}</div>
              <div className="inline-block px-3 py-1 rounded bg-black/60 border border-emerald-500/50 font-mono text-emerald-300 text-xs">
                DEPTH DETECTED: {incident.depth} CM (WATERLOGGING CONFIRMED)
              </div>
            </div>

            {/* Overlay Telemetry HUD */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-emerald-400 bg-black/70 px-2 py-1 rounded">
              GPS: {incident.coordinates[0]} N, {incident.coordinates[1]} E
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] text-amber-400 bg-black/70 px-2 py-1 rounded">
              AI DETECT: 2 STRANDED VEHICLES
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/70 bg-black/70 px-2 py-1 rounded">
              CAM-ID: MH-MUM-MCGM-094
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Automated AI Scene Summary</span>
              <p className="text-[11px] text-ink-secondary mt-0.5">
                Water surface velocity measured at 0.38 m/s towards south drainage intake. No live electrical sparks detected.
              </p>
            </div>
            <button
              onClick={() => showToast('Snapshot archived to incident evidentiary dossier!')}
              className="px-3 py-1.5 bg-surface hover:bg-border/30 border border-border rounded-lg text-xs font-semibold text-purple flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 10: Evacuation & Vulnerable Population Relief Estimator
===================================================================== */
export function EvacuationReliefModal({ isOpen, onClose, incident, showToast }) {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-warning-soft flex items-center justify-center">
              <Users className="w-4 h-4 text-status-warning" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Vulnerable Population &amp; Evacuation Relief</h3>
              <p className="text-[11px] text-ink-secondary">Impact envelope (300m radius around {incident.id})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">POPULATION</span>
              <span className="text-base font-bold text-ink">1,450</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">GROUND CHAWLS</span>
              <span className="text-base font-bold text-status-alert">182 Units</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">ELDERLY / BEDRIDDEN</span>
              <span className="text-base font-bold text-status-warning">14 Persons</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-2">
            <span className="font-bold text-ink text-xs uppercase font-mono">Designated Safe Relief Shelters</span>
            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">Sion Municipal Higher Secondary School</div>
                  <div className="text-[10px] text-ink-secondary">Capacity: 450 • Currently Occupied: 120 (330 beds free)</div>
                </div>
                <span className="font-mono text-[10px] font-bold text-status-safe bg-status-safe-soft px-1.5 py-0.5 rounded">
                  0.6 KM AWAY
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">Dadar Community Hall (Relief Station B)</div>
                  <div className="text-[10px] text-ink-secondary">Capacity: 300 • Ready for Intake</div>
                </div>
                <span className="font-mono text-[10px] font-bold text-purple bg-purple-soft px-1.5 py-0.5 rounded">
                  1.2 KM AWAY
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary">
              Cancel
            </button>
            <button
              onClick={() => {
                showToast('Precautionary Evacuation Alert Transmitted to Ward DMU!');
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold shadow-md"
            >
              Issue Evacuation Advisory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 11: Critical Infrastructure Exposure & Utility Isolation Controller
===================================================================== */
export function InfraProtectionModal({ isOpen, onClose, incident, showToast }) {
  const [utilities, setUtilities] = useState([
    { id: 'substation', name: 'Kurla 33kV Low-Bay Substation', type: 'POWER', status: 'STANDBY GENSET', atRisk: true },
    { id: 'telecom', name: 'BSNL Underground Fiber Vault', type: 'TELECOM', status: 'SEALED DRY', atRisk: false },
    { id: 'gas', name: 'Mahanagar Gas Main Valve #12', type: 'GAS', status: 'ACTIVE VALVE', atRisk: true },
  ]);

  if (!isOpen || !incident) return null;

  const toggleStatus = (id) => {
    setUtilities((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status.includes('ISOLATED') ? 'ACTIVE' : 'ISOLATED / LOCKOUT' } : u))
    );
    showToast(`Utility status updated.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <Zap className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Critical Utility Isolation &amp; Hazard Safeguard</h3>
              <p className="text-[11px] text-ink-secondary">{incident.location} • Adani Power / BEST / MGL Grid</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div className="space-y-2">
            {utilities.map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-surface-secondary border border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{u.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border font-bold text-purple">
                      {u.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-secondary font-mono mt-0.5">Status: {u.status}</div>
                </div>
                <button
                  onClick={() => toggleStatus(u.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    u.status.includes('ISOLATED')
                      ? 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                      : 'bg-status-alert-soft text-status-alert border border-status-alert/30 hover:bg-status-alert/20'
                  }`}
                >
                  {u.status.includes('ISOLATED') ? 'RESTORE POWER' : 'TRIGGER LOCKOUT'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-soft/50 border border-purple/20 text-[11px] text-ink-secondary">
            Lockout signals interface with SCADA relays at BEST Sub-Control and generate automated incident safety certificates.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 12: Mobile High-Capacity Dewatering Pump Fleet Stationing
===================================================================== */
export function MobilePumpStationingModal({ isOpen, onClose, incident, showToast }) {
  const [selectedPump, setSelectedPump] = useState('PUMP-SQUAD-01 (500HP Turbo)');
  const [hoseLength, setHoseLength] = useState(30);
  const [dischargePoint, setDischargePoint] = useState('Trunk Stormwater Canal Box 4');

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Droplets className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Mobile High-Capacity Dewatering Unit</h3>
              <p className="text-[11px] text-ink-secondary">Station mobile pumps from central emergency reserve</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Select Reserve Pump</label>
            <select
              value={selectedPump}
              onChange={(e) => setSelectedPump(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-semibold"
            >
              <option value="PUMP-SQUAD-01 (500HP Turbo)">PUMP-SQUAD-01: 500HP Turbo (1,800 m³/hr)</option>
              <option value="PUMP-SQUAD-02 (500HP Turbo)">PUMP-SQUAD-02: 500HP Turbo (2,200 m³/hr)</option>
              <option value="PUMP-SQUAD-03 (350HP High-Head)">PUMP-SQUAD-03: 350HP High-Head (1,400 m³/hr)</option>
              <option value="PUMP-SQUAD-08 (2500HP Reserve)">PUMP-SQUAD-08: Heavy Coastal Reserve (2,500 m³/hr)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Suction Hose Length: {hoseLength}m</label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={hoseLength}
                onChange={(e) => setHoseLength(e.target.value)}
                className="w-full accent-purple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Discharge Outfall Point</label>
              <input
                type="text"
                value={dischargePoint}
                onChange={(e) => setDischargePoint(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-ink-secondary">DRAWDOWN VELOCITY:</span>
              <span className="text-purple font-bold">~0.75 cm per minute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">ESTIMATED TIME TO CLEAR 30CM:</span>
              <span className="text-status-safe font-bold">~40 minutes</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary">
              Cancel
            </button>
            <button
              onClick={() => {
                showToast(`Pump unit ${selectedPump.split(' ')[0]} deployed to ${incident.id}!`);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold shadow-md"
            >
              Start Emergency Pumping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 13: Incident Hydrograph & Water Depth Recession Predictor
===================================================================== */
export function WaterRecessionPredictorModal({ isOpen, onClose, incident }) {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Water Depth Recession Curve</h3>
              <p className="text-[11px] text-ink-secondary">Hydrodynamic Decay Model (Tidal Ebb + Pump Discharge)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* SVG Graph */}
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold text-ink uppercase">Depth vs Time Horizon</span>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="flex items-center gap-1 text-status-alert">
                  <span className="w-2.5 h-0.5 bg-status-alert inline-block" /> Unmitigated
                </span>
                <span className="flex items-center gap-1 text-purple">
                  <span className="w-2.5 h-0.5 bg-purple inline-block" /> With Dewatering
                </span>
              </div>
            </div>

            <svg viewBox="0 0 400 160" className="w-full h-44 overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="currentColor" strokeOpacity="0.2" />

              {/* Labels */}
              <text x="30" y="25" textAnchor="end" fontSize="9" fill="currentColor" opacity="0.6">50cm</text>
              <text x="30" y="65" textAnchor="end" fontSize="9" fill="currentColor" opacity="0.6">35cm</text>
              <text x="30" y="105" textAnchor="end" fontSize="9" fill="currentColor" opacity="0.6">20cm</text>
              <text x="30" y="145" textAnchor="end" fontSize="9" fill="currentColor" opacity="0.6">0cm</text>

              {/* X Time stamps */}
              <text x="50" y="155" fontSize="9" fill="currentColor" opacity="0.6">Now</text>
              <text x="140" y="155" fontSize="9" fill="currentColor" opacity="0.6">+30m</text>
              <text x="230" y="155" fontSize="9" fill="currentColor" opacity="0.6">+60m</text>
              <text x="320" y="155" fontSize="9" fill="currentColor" opacity="0.6">+90m</text>

              {/* Unmitigated Path (Red) */}
              <path
                d="M 50 45 Q 140 30 230 55 T 380 90"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />

              {/* Mitigated Path (Purple) */}
              <path
                d="M 50 45 Q 140 70 230 115 T 350 140"
                fill="none"
                stroke="#6D4AFF"
                strokeWidth="3"
              />

              {/* Current Point Dot */}
              <circle cx="50" cy="45" r="4" fill="#6D4AFF" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">PEAK WATER DEPTH</span>
              <span className="text-sm font-bold text-status-alert">{incident.depth} cm</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">CLEARANCE TO ROADWAY</span>
              <span className="text-sm font-bold text-status-safe">19:45 IST (42 mins)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 14: Casualty & Public Safety Triage Logbook
===================================================================== */
export function SafetyCasualtyLogModal({ isOpen, onClose, incident, showToast }) {
  const [entries, setEntries] = useState([
    { id: 'CAS-01', type: 'Stranded Motorist', count: 2, condition: 'Safe / Rescued', transferredTo: 'High Ground Shelter' },
    { id: 'CAS-02', type: 'Submerged Scooter', count: 4, condition: 'Property Loss', transferredTo: 'N/A' },
  ]);
  const [newType, setNewType] = useState('Pedestrian Rescued');
  const [newCount, setNewCount] = useState(1);

  if (!isOpen || !incident) return null;

  const handleAdd = () => {
    setEntries((prev) => [
      ...prev,
      { id: `CAS-0${prev.length + 1}`, type: newType, count: parseInt(newCount), condition: 'Safe', transferredTo: 'Sion Hospital' },
    ]);
    showToast('Triage entry recorded in police disaster blotter.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <LifeBuoy className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Casualty &amp; Public Safety Triage Log</h3>
              <p className="text-[11px] text-ink-secondary">{incident.id} • Live field rescue logs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          <div className="space-y-1.5">
            {entries.map((e) => (
              <div key={e.id} className="p-2.5 rounded-xl bg-surface-secondary border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-ink">{e.type} ({e.count})</span>
                  <span className="text-[10px] text-ink-secondary block">Destination: {e.transferredTo}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                  {e.condition}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-bold text-ink uppercase font-mono text-[10px] block">Log Field Rescue Event</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
              />
              <input
                type="number"
                min="1"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                className="w-16 px-2 py-1.5 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono"
              />
              <button onClick={handleAdd} className="px-3 py-1.5 bg-purple text-white rounded-lg font-bold">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 15: Emergency SITREP Generator & Multi-Agency PDF/Print Exporter
===================================================================== */
export function SITREPExportModal({ isOpen, onClose, incident, showToast }) {
  if (!isOpen || !incident) return null;

  const sitrepContent = `=====================================================
MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM)
DISASTER MANAGEMENT DEPARTMENT - INCIDENT SITUATION REPORT
=====================================================
INCIDENT ID:      ${incident.id}
SEVERITY:         ${incident.severity.toUpperCase()}
DATE / TIME:      ${new Date().toLocaleDateString('en-IN')} - ${incident.detectedTime}
LOCATION:         ${incident.location}
COORDINATES:      ${incident.coordinates[0]} N, ${incident.coordinates[1]} E

HYDROLOGICAL PARAMETERS:
- Peak Water Inundation: ${incident.depth} cm
- Impacted Zone Area:    ${incident.area}
- Root Cause Diagnostic: ${incident.cause}
- Hydraulic Forecast:    ${incident.predictedPeak}

DEPLOYED RESPONSE UNITS:
- Primary Assigned Unit: ${incident.assignedSquad}
- Estimated Scene ETA:   ${incident.squadEta}
- Operational Status:    ${incident.status}

CHRONOLOGICAL EVENT LOG:
${incident.timeline?.map((t) => `[${t.time}] ${t.text}`).join('\n')}

CERTIFYING OFFICER:
Command Officer ID: BMC-OPS-4109
Report Generated via JalDrishti Real-Time Authority Console
=====================================================`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sitrepContent);
    showToast('SITREP copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Official Incident SITREP Dossier</h3>
              <p className="text-[11px] text-ink-secondary">Standard Government of Maharashtra Disaster Report Format</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          <pre className="p-3.5 rounded-xl bg-black text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre border border-emerald-900/60 shadow-inner">
            {sitrepContent}
          </pre>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-lg text-ink font-semibold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy SITREP</span>
            </button>
            <button
              onClick={() => {
                window.print();
                showToast('Printing SITREP Dossier...');
              }}
              className="px-5 py-2 bg-purple hover:bg-purple-deep text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official SITREP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 16: Supply Depot Logistics & Sandbag Requisition Form
===================================================================== */
export function SupplyRequisitionModal({ isOpen, onClose, incident, showToast }) {
  const [sandbags, setSandbags] = useState(300);
  const [lightTowers, setLightTowers] = useState(2);
  const [lifeVests, setLifeVests] = useState(15);
  const [depot, setDepot] = useState('Central Dadar Emergency Yard');

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Box className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Supply Depot Logistics Requisition</h3>
              <p className="text-[11px] text-ink-secondary">Allocate emergency flood barriers and safety equipment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Originating Depot</label>
            <select
              value={depot}
              onChange={(e) => setDepot(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-semibold"
            >
              <option value="Central Dadar Emergency Yard">Central Dadar Emergency Yard (Ward G/N)</option>
              <option value="Kurla Ward L Maintenance Depot">Kurla Ward L Maintenance Depot</option>
              <option value="Andheri West Disaster Depot">Andheri West Disaster Depot (Ward K/W)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Sandbags (Units)</label>
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={sandbags}
                onChange={(e) => setSandbags(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Floodlight Masts</label>
              <input
                type="number"
                min="1"
                max="10"
                value={lightTowers}
                onChange={(e) => setLightTowers(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Life Vests</label>
              <input
                type="number"
                min="5"
                max="100"
                value={lifeVests}
                onChange={(e) => setLifeVests(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary">
              Cancel
            </button>
            <button
              onClick={() => {
                showToast(`Logistics dispatch requisition of ${sandbags} sandbags approved!`);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold shadow-md"
            >
              Approve Depot Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 17: Post-Incident Debrief & Digital Resolution Sign-Off
===================================================================== */
export function ResolutionSignOffModal({ isOpen, onClose, incident, onResolve, showToast }) {
  const [officerName, setOfficerName] = useState('Deputy Commissioner A. K. Patil');
  const [checklist, setChecklist] = useState({
    waterReceded: true,
    siltCleared: true,
    trafficResumed: true,
    powerRestored: true,
  });
  const [debriefNotes, setDebriefNotes] = useState('Pumping squad cleared 40cm water in 35 mins. Silt cleared by Ward sweepers.');

  if (!isOpen || !incident) return null;

  const handleSignOff = () => {
    onResolve(incident.id, debriefNotes);
    showToast(`Incident ${incident.id} formally resolved and signed off!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-safe-soft flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-status-safe" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Incident Resolution &amp; Closure Sign-Off</h3>
              <p className="text-[11px] text-ink-secondary">{incident.id} • Formal de-escalation certification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <label className="block text-[11px] font-bold text-ink uppercase font-mono">
            Safety Clearance Verification Checklist
          </label>
          <div className="space-y-2">
            {[
              { key: 'waterReceded', label: 'Floodwater completely receded below road curb line (&lt;5cm)' },
              { key: 'siltCleared', label: 'SWM silt removal & road wash-down certified' },
              { key: 'trafficResumed', label: 'Mumbai Traffic Police confirmed normal lane flow reopened' },
              { key: 'powerRestored', label: 'Underground electrical conduits de-energization lifted safely' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary border border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                  className="rounded text-purple"
                />
                <span className="text-ink text-xs">{item.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Signing Officer</label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink mb-1 uppercase font-mono">Debrief Notes &amp; Root Cause Review</label>
            <textarea
              rows="2"
              value={debriefNotes}
              onChange={(e) => setDebriefNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-ink text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-ink hover:bg-surface-secondary">
              Cancel
            </button>
            <button
              onClick={handleSignOff}
              className="px-5 py-2 rounded-lg bg-status-safe hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Execute Digital Sign-Off</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 18: Ward Weather & Upstream Radar Catchment Overlay
===================================================================== */
export function UpstreamCatchmentModal({ isOpen, onClose, incident }) {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
              <Compass className="w-4 h-4 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Upstream Catchment Hydrology &amp; Radar</h3>
              <p className="text-[11px] text-ink-secondary">{incident.location} • Drainage Basin Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">BASIN RAINFALL</span>
              <span className="text-base font-bold text-status-alert">72 mm/hr</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">RADAR REFLECTIVITY</span>
              <span className="text-base font-bold text-purple">54 dBZ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-ink-secondary block">SOIL SATURATION</span>
              <span className="text-base font-bold text-status-warning">91%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-2">
            <span className="font-bold text-ink text-xs uppercase font-mono">Upstream Telemetry Stations</span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between p-2 rounded bg-surface border border-border">
                <span>IMD Colaba Doppler Radar Beam</span>
                <span className="font-mono text-purple font-bold">14km S (Clear Line of Sight)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-surface border border-border">
                <span>Vihar Lake Overflow Spillway</span>
                <span className="font-mono text-status-safe font-bold">DISCHARGING 4.2 m³/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 19: Incident Batch Operations & Quick Multi-Select Action Bar
===================================================================== */
export function IncidentBatchOperationsBar({
  selectedIds,
  onClearSelection,
  onBatchAction,
  totalCount,
}) {
  if (!selectedIds || selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-ink text-white px-5 py-3 rounded-2xl shadow-elevated border border-border flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="w-2 h-2 rounded-full bg-status-alert animate-ping" />
        <span className="font-bold text-status-alert">{selectedIds.length}</span>
        <span className="text-white/70">of {totalCount} Incidents Selected</span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => onBatchAction('DISPATCH_ALL_PUMPS')}
          className="px-3 py-1.5 bg-purple hover:bg-purple-deep text-white rounded-lg text-xs font-bold transition-colors"
        >
          Bulk Dispatch Pumps
        </button>
        <button
          onClick={() => onBatchAction('BARRICADE_ALL')}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Signal Traffic Police
        </button>
        <button
          onClick={() => onBatchAction('ESCALATE_ALL')}
          className="px-3 py-1.5 bg-status-alert-soft hover:bg-status-alert/30 text-status-alert rounded-lg text-xs font-semibold transition-colors"
        >
          Bulk Escalate
        </button>
      </div>

      <button onClick={onClearSelection} className="text-xs text-white/50 hover:text-white ml-2 underline">
        Clear
      </button>
    </div>
  );
}

/* =====================================================================
   FEATURE 20: Command Audio Siren & Broadcast Tone Dispatcher
===================================================================== */
export function IncidentAudioAlertModal({ isOpen, onClose, incident, showToast }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState('hi'); // en | hi | mr
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  if (!isOpen || !incident) return null;

  const playSirenTone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1200);
      showToast('Emergency audio klaxon synthesized on workstation speaker!');
    } catch {
      showToast('Audio synthesizer activated.');
    }
  };

  const BROADCAST_MESSAGES = {
    en: `ATTENTION RESIDENTS: Inundation detected at ${incident.location}. Water depth ${incident.depth} centimeters. Roadway closed. Divert via elevated corridors.`,
    hi: `DHYAN DEIN: ${incident.location} par ${incident.depth} sentimeter paani bhar chuka hai. Rasta band hai, kripya flyover ka upayog karein.`,
    mr: `LAKSHA DYA: ${incident.location} yethe ${incident.depth} sentimeter paani saachle aahe. Rasta band kela aahe. Krupaya flyover cha vapar kara.`,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-alert-soft flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-status-alert" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Public Address Siren &amp; Voice Broadcast</h3>
              <p className="text-[11px] text-ink-secondary">Acoustic Alert Synthesizer for Local Ward Sirens</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-border/50 rounded-lg text-ink-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Siren Klaxon Button */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-border text-center space-y-2">
            <span className="font-bold text-ink text-xs uppercase font-mono block">Station Klaxon Test</span>
            <button
              onClick={playSirenTone}
              className={`px-6 py-2.5 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 mx-auto transition-all ${
                isPlaying
                  ? 'bg-status-alert text-white animate-pulse shadow-lg'
                  : 'bg-surface hover:bg-border/40 border border-border text-ink'
              }`}
            >
              <Volume2 className="w-4 h-4 text-status-alert" />
              <span>{isPlaying ? 'SOUNDING KLAXON TONE...' : 'TEST EMERGENCY SIREN'}</span>
            </button>
          </div>

          {/* Multilingual Voice Broadcast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink uppercase font-mono text-[11px]">Public PA Announcement</span>
              <div className="flex gap-1">
                {['hi', 'mr', 'en'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      lang === l ? 'bg-purple text-white' : 'bg-surface-secondary text-ink'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-soft/50 border border-purple/30 font-medium text-ink text-xs leading-relaxed italic">
              &ldquo;{BROADCAST_MESSAGES[lang]}&rdquo;
            </div>

            <button
              onClick={() => {
                showToast(`PA Voice Broadcast transmitted to street speakers in ${incident.location}!`);
                onClose();
              }}
              className="w-full py-2 bg-purple hover:bg-purple-deep text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Over Ward Speakers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

