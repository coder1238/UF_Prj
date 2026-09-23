import React, { useState } from 'react';
import { X, Radio, AlertOctagon, CloudLightning, Waves, PlusCircle, Check } from 'lucide-react';

const SIMULATION_PRESETS = [
  {
    title: 'RAPID CLOUDBURST ALERT: Andheri Subway Underpass',
    ward: 'K-West',
    severity: 'critical',
    hazardCategory: 'subway',
    waterDepth: 45,
    rainfallRate: 84,
    sensorId: 'ULTRASONIC-ANDH-01',
    message: 'High-intensity cloudburst over Andheri West. Andheri subway water accumulation reached 45cm within 12 minutes. Traffic police have closed vehicular barrels.',
    directives: [
      'Avoid Andheri Subway completely; take Gokhale Bridge or Balasaheb Thackeray Flyover',
      'Move vehicles parked on low-lying SV Road to multi-storey parking',
      'Pedestrians keep clear of subway entry ramps due to vortex suction'
    ],
    soundAlert: 'Critical Flood Alert: Andheri Subway water depth 45 centimeters. Barrier closed.'
  },
  {
    title: 'POWAI LAKE WEIR OVERTOPPING: Saki Vihar Inundation',
    ward: 'Ward L',
    severity: 'danger',
    hazardCategory: 'drain-breach',
    waterDepth: 32,
    rainfallRate: 58,
    sensorId: 'WEIR-POWAI-03',
    message: 'Powai lake overflow weir has breached nominal discharge crest by 22cm. Water flowing onto Saki Vihar road adjacent to L&T junction.',
    directives: [
      'Exercise caution on Saki Vihar Road; reduce speed below 20 km/h',
      'Follow diversion signs towards JVLR elevated highway',
      'Stay away from unbarricaded nallah margins'
    ],
    soundAlert: 'Danger Alert: Powai Lake weir overtopping onto Saki Vihar Road.'
  },
  {
    title: 'ASTRONOMICAL TIDAL SURGE: Marine Drive & Worli Seaface',
    ward: 'Citywide',
    severity: 'caution',
    hazardCategory: 'high-tide',
    waterDepth: 18,
    rainfallRate: 24,
    sensorId: 'TIDE-WORLI-01',
    message: 'Arabian Sea high tide waves reaching 4.87 meters overtopping promenade barriers. Coastal promenade cordoned off for pedestrian safety.',
    directives: [
      'Marine Drive and Worli Seaface promenades closed to all pedestrians',
      'Do not take selfies or approach seaside parapet walls',
      'Coastal road southbound lanes operating with reduced speed limits'
    ],
    soundAlert: 'Caution: High tide coastal surge overtopping promenade at Worli and Marine Drive.'
  }
];

export default function AlertSimulateModal({ onSimulate, onClose }) {
  const [selectedPreset, setSelectedPreset] = useState(0);

  const handleTrigger = () => {
    const preset = SIMULATION_PRESETS[selectedPreset];
    const newAlert = {
      id: `alt-sim-${Date.now()}`,
      severity: preset.severity,
      hazardCategory: preset.hazardCategory,
      title: preset.title,
      ward: preset.ward,
      wardName: `Ward ${preset.ward}`,
      coordinates: { lat: 19.1136, lng: 72.8497 },
      issuedAt: 'Just now',
      timestamp: Date.now(),
      validUntil: 'T+90 min',
      waterDepth: preset.waterDepth,
      waterDepthTrend: '+5 cm / 10m',
      rainfallRate: preset.rainfallRate,
      vehicleMaxClearance: 15,
      sensorId: preset.sensorId,
      cctvCameraId: 'CCTV-SIM-01',
      message: preset.message,
      directives: preset.directives,
      soundAlert: preset.soundAlert,
      acknowledged: false,
      acknowledgedAt: null,
      userCheckedDirectives: {},
      crowdsourced: {
        risingVotes: 1,
        recedingVotes: 0,
        blockedReports: 1,
        rescueRequests: 0,
        lastReportedMinsAgo: 0
      },
      telemetry: [
        { time: '19:45', depth: 4, rain: 20 },
        { time: '20:00', depth: 15, rain: 45 },
        { time: '20:15', depth: 32, rain: 68 },
        { time: '20:30', depth: preset.waterDepth, rain: preset.rainfallRate }
      ],
      shelterRecommendation: {
        name: 'Municipal Flood Shelter Depot',
        distance: '500m',
        elevation: '+15m MSL',
        capacity: '200 spaces',
        address: 'High Elevation Municipal Grounds'
      }
    };

    onSimulate(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-primary font-bold text-sm">
            <Radio className="w-5 h-5 animate-pulse" /> Simulate Incoming Municipal Broadcast
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted my-3">
          Simulate how the citizen platform receives and presents real-time emergency broadcasts dispatched by the BMC Disaster Control Center.
        </p>

        {/* Preset Cards */}
        <div className="space-y-2.5 my-4">
          {SIMULATION_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPreset(idx)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPreset === idx
                  ? 'bg-purple-50/70 border-purple-400 ring-1 ring-purple-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full ${
                  preset.severity === 'critical' ? 'bg-red-500 text-white' : preset.severity === 'danger' ? 'bg-amber-500 text-white' : 'bg-yellow-400 text-yellow-950'
                }`}>
                  {preset.severity} • {preset.ward}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {preset.waterDepth} cm depth
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink mt-1.5 leading-snug">
                {preset.title}
              </h4>
              <p className="text-[11px] text-muted mt-1 line-clamp-2">
                {preset.message}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleTrigger}
            className="flex-1 py-3 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Dispatch Simulated Broadcast
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

