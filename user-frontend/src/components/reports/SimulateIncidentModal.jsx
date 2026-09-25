import React, { useState } from 'react';
import { PlusCircle, Zap, CheckCircle2, X, Sparkles, MapPin, Droplets, AlertTriangle } from 'lucide-react';

const HOTSPOT_TEMPLATES = [
  {
    title: 'Severe Underpass Inundation & Trapped Bus',
    category: 'Subway Trap',
    location: 'Milan Subway, Santacruz West',
    ward: 'Ward K-West',
    depth: 48,
    severity: 'critical',
    coordinates: { lat: 19.0825, lng: 72.8415 },
    sensorId: 'CCTV-K114 & Ultrasonic-U09',
    unitName: 'Submersible 2800 LPM High-Lift Unit #4',
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Dislodged Deep Stormwater Drain Cover',
    category: 'Open Manhole',
    location: 'Hindmata Flyover Junction, Dadar East',
    ward: 'Ward F-South',
    depth: 35,
    severity: 'critical',
    coordinates: { lat: 19.0125, lng: 72.8435 },
    sensorId: 'ACOUSTIC-FS-18',
    unitName: 'Rapid Ductile Iron Manhole Anchor Truck #2',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Tidal Backflow & Silt Choked Drain',
    category: 'Nullah Breach',
    location: 'Gandhi Market, King\'s Circle, Matunga',
    ward: 'Ward F-North',
    depth: 40,
    severity: 'high',
    coordinates: { lat: 19.0270, lng: 72.8550 },
    sensorId: 'SENSOR-FN-KINGS-02',
    unitName: 'Amphibious Desilting Skimmer DMU-12',
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Submerged Traffic Light Controller',
    category: 'Electrical Hazard',
    location: 'Saki Naka Metro Junction, Andheri East',
    ward: 'Ward L',
    depth: 26,
    severity: 'high',
    coordinates: { lat: 19.1020, lng: 72.8870 },
    sensorId: 'METER-WL-SN-04',
    unitName: 'BEST Grid High-Voltage Isolation Van #3',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Curb Ponding Outside Metro Station Concourse',
    category: 'Waterlogging',
    location: 'Chakala JB Nagar Metro Gate 3',
    ward: 'Ward K-East',
    depth: 18,
    severity: 'moderate',
    coordinates: { lat: 19.1115, lng: 72.8620 },
    sensorId: 'CCTV-CH-04',
    unitName: 'Mobile Vacuum Sucker Truck #08',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60'
  }
];

export default function SimulateIncidentModal({ isOpen, onClose, onAddSimulatedReport }) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [customDepth, setCustomDepth] = useState(HOTSPOT_TEMPLATES[0].depth);
  const [reporterNote, setReporterNote] = useState('Flash ponding observed after sudden cloudburst. Vehicles reversing.');

  if (!isOpen) return null;

  const currentTemplate = HOTSPOT_TEMPLATES[selectedTemplateIndex];

  const handleSelectTemplate = (idx) => {
    setSelectedTemplateIndex(idx);
    setCustomDepth(HOTSPOT_TEMPLATES[idx].depth);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const idNum = Math.floor(2100 + Math.random() * 8900);
    const ticketId = `FLD-${idNum}`;
    const nowStr = 'Just now (1 min ago)';

    const newReport = {
      id: ticketId,
      title: currentTemplate.title,
      category: currentTemplate.category,
      severity: customDepth > 40 ? 'critical' : customDepth > 25 ? 'high' : 'moderate',
      location: currentTemplate.location,
      ward: currentTemplate.ward,
      timestamp: nowStr,
      submittedAt: nowStr,
      isoTimestamp: new Date().toISOString(),
      coordinates: currentTemplate.coordinates,
      verified: true,
      verificationSource: `${currentTemplate.sensorId} Telemetry & GNN Hydro Model`,
      status: 'assigned',
      statusColor: 'amber',
      depth: customDepth,
      initialDepth: customDepth,
      estimatedDepth: customDepth,
      aiConfidence: 95,
      sensorMatchScore: 97,
      sensorId: currentTemplate.sensorId,
      sensorDepth: customDepth - 0.6,
      rainfallRate: '54 mm/hr (Cloudburst Runoff)',
      upvotes: 4,
      userUpvoted: true,
      affectedCommutersDiverted: 850 + Math.floor(Math.random() * 600),
      busesRerouted: 3,
      trafficDelaySavedMin: 25,
      photoUrl: currentTemplate.photoUrl,
      beforePhotoUrl: currentTemplate.photoUrl,
      afterPhotoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
      exifMetadata: {
        device: 'Sony IMX766 Citizen Cam (Verified EXIF)',
        gpsPrecision: '±1.9m precision',
        capturedAt: 'Just now',
        opticalDepthTag: `Water level ~${customDepth} cm measured`
      },
      assignedOfficer: `Er. K. Mehta (MCGM Stormwater Cell, ${currentTemplate.ward})`,
      officerRole: 'Senior Drainage Superintendent',
      officerPhone: '+91 22 2269 4725 (Control Room)',
      officerBadge: `MCGM-${currentTemplate.ward.replace('Ward ', '')}-99`,
      unitAssigned: {
        id: `DMU-0${Math.floor(1 + Math.random() * 9)}X`,
        name: currentTemplate.unitName,
        vehicleReg: `MH-01-EE-${Math.floor(1000 + Math.random() * 9000)}`,
        crewChief: 'Officer R. Thorat',
        crewPhone: '+91 98200 44102',
        crewSize: 4,
        pumpType: 'Twin Cummins 2800 LPM Diesel Dewatering Rig',
        pumpRpm: 1820,
        dischargeRateLpm: 2800,
        fuelPct: 88,
        drainOutfall: 'Local Stormwater Outfall Sluice',
        etaMinutes: 6,
        status: 'Dispatched - En Route with Siren'
      },
      witnesses: [
        { name: 'Citizen Reporter (You)', tier: 'Incident Logger', time: nowStr, note: reporterNote }
      ],
      comments: [
        { id: Date.now(), author: 'Citizen Reporter (You)', role: 'Reporter', time: nowStr, text: reporterNote },
        { id: Date.now() + 1, author: 'MCGM Stormwater Bot', role: 'System', time: nowStr, text: `Telemetry verified. Assigned to ${currentTemplate.ward} emergency crew.` }
      ],
      smsSubscribed: true,
      notificationPhone: '+91 98765 43210',
      escalated: false,
      resolutionCertificate: {
        certId: `MCGM-CERT-${ticketId}-PEND`,
        issuedBy: `MCGM Stormwater Cell & Emergency Control (${currentTemplate.ward})`,
        signatory: 'Duty Executive Engineer',
        digitalSealHash: '0x' + Math.random().toString(16).substr(2, 16),
        targetCompletion: 'Under active de-watering',
        closureWaterDepth: `Current depth ${customDepth} cm`,
        drainStatus: 'Initial intake logged'
      },
      steps: [
        { name: 'Submitted', time: 'Just now', desc: 'GPS & multi-spectral camera certified', status: 'COMPLETED' },
        { name: 'Verification', time: 'Just now', desc: 'Corroborated with acoustic sensor telemetry (97% agreement)', status: 'COMPLETED' },
        { name: 'Assigned', time: 'Just now', desc: `Assigned to ${currentTemplate.unitName}`, status: 'ACTIVE' },
        { name: 'De-Watering Active', time: 'ETA 6m', desc: '2800 LPM high-lift extraction', status: 'PENDING' },
        { name: 'Resolved / Safe', time: 'Target 45m', desc: 'Complete recession beneath 8 cm', status: 'PENDING' }
      ]
    };

    onAddSimulatedReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-primary text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Simulate Flood Incident Ticket</h3>
              <p className="text-[11px] font-mono text-purple-200">Inject high-fidelity test ticket with live telematics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="font-bold text-slate-700 block mb-2">Select Vulnerable Urban Hotspot:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {HOTSPOT_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectTemplate(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTemplateIndex === idx
                      ? 'border-purple-primary bg-purple-50 ring-1 ring-purple-primary/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 truncate">{tmpl.category}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                      {tmpl.ward}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{tmpl.location}</p>
                  <span className="text-[10px] font-mono text-purple-primary font-bold block mt-1">
                    ~{tmpl.depth} cm depth
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Simulated Water Level: <span className="font-mono text-purple-primary font-bold">{customDepth} cm</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={customDepth}
              onChange={(e) => setCustomDepth(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>10 cm (Ankle)</span>
              <span>30 cm (Hubcaps)</span>
              <span>50 cm (Car Exhaust)</span>
              <span>90 cm (Severe)</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Citizen Initial Description:</label>
            <textarea
              value={reporterNote}
              onChange={(e) => setReporterNote(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
              required
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
            <div className="text-slate-500">Auto-Assigned Equipment:</div>
            <div className="font-bold text-slate-800">{currentTemplate.unitName}</div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Inject Report Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

