import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, PhoneCall, Volume2, 
  MapPin, CheckCircle2, Copy, Check, Radio, Activity, 
  Droplets, CloudRain, Car, ArrowRight, Share2, Compass,
  Camera, Upload, Eye, Zap, Flame, ShieldCheck, Clock
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';

// 1. ACTIVE WARNINGS DRAWER / MODAL
export function ActiveWarningsModal({ isOpen, onClose }) {
  const { currentWard, speakAlert } = useFlood();
  const { navigateTo } = useNavigation();

  const [warnings, setWarnings] = useState([
    {
      id: 'w-1',
      severity: 'CRITICAL',
      title: 'Milan Subway & SV Road Underpass Impassable',
      location: 'Ward K-West, Santacruz',
      depth: '38 cm',
      time: 'Issued 6 min ago',
      validUntil: 'Valid next 2 hours',
      action: 'Mandatory diversion via Milan Flyover or Gokhale Bridge.',
      acknowledged: false
    },
    {
      id: 'w-2',
      severity: 'HIGH',
      title: 'L.B.S. Marg Rapid Inundation Near Phoenix',
      location: 'Ward L, Kurla West',
      depth: '26 cm',
      time: 'Issued 12 min ago',
      validUntil: 'Valid next 90 min',
      action: 'Sedan stall threshold reached. Use BKC Elevated Connector.',
      acknowledged: false
    },
    {
      id: 'w-3',
      severity: 'CRITICAL',
      title: 'Open Manhole Hydraulic Vortex Detected',
      location: '14th Road & SV Road Junction, Khar',
      depth: '42 cm (Submerged)',
      time: 'Issued 18 min ago',
      validUntil: 'Active until BMC cordon set',
      action: 'Severe suction danger. Do not walk or drive through opaque flood water.',
      acknowledged: false
    },
    {
      id: 'w-4',
      severity: 'MODERATE',
      title: 'Saki Naka Junction Sump Overflow Warning',
      location: 'Ward K-East, Andheri-Kurla Rd',
      depth: '18 cm',
      time: 'Issued 24 min ago',
      validUntil: 'Valid next 60 min',
      action: 'Stick strictly to central high camber lanes; curb lanes ponded.',
      acknowledged: false
    },
    {
      id: 'w-5',
      severity: 'HIGH',
      title: 'High Tide Storm Surge Sluice Gate Closure',
      location: 'Britannia & Love Grove Outfalls, Arabian Sea',
      depth: 'Sea Level +4.18m',
      time: 'Issued 30 min ago',
      validUntil: 'Gates reopen at 23:15 IST',
      action: 'Gravity discharge halted. Stormwater pumps engaged at 100% capacity.',
      acknowledged: false
    }
  ]);

  const toggleAcknowledge = (id) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, acknowledged: !w.acknowledged } : w));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">Active City Flood Warnings</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-mono font-bold">
                  {warnings.filter(w => !w.acknowledged).length} Pending
                </span>
              </div>
              <p className="text-xs text-white/80">Directives issued by Municipal Disaster Management Cell (MCGM)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {warnings.map((warn) => (
            <div 
              key={warn.id}
              className={`p-4 rounded-2xl border transition ${
                warn.acknowledged 
                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                  : warn.severity === 'CRITICAL' 
                    ? 'bg-red-50/80 border-red-300 ring-1 ring-red-300' 
                    : 'bg-amber-50/80 border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                    warn.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {warn.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{warn.time}</span>
                  <span className="text-xs font-mono text-purple-primary font-semibold">{warn.validUntil}</span>
                </div>

                <button 
                  onClick={() => speakAlert(`${warn.title}. ${warn.action}`)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-purple-primary hover:bg-white transition"
                  title="Speak Warning"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-ink text-sm mt-2">{warn.title}</h4>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-primary" /> {warn.location}
                </span>
                <span>•</span>
                <span className="font-bold text-red-600">Depth: {warn.depth}</span>
              </div>

              <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 mt-2.5">
                <strong className="text-ink">Action Required:</strong> {warn.action}
              </p>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => toggleAcknowledge(warn.id)}
                  className={`text-xs font-mono font-semibold flex items-center gap-1.5 px-3 py-1 rounded-lg border transition ${
                    warn.acknowledged 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{warn.acknowledged ? 'Acknowledged' : 'Mark Acknowledged'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigateTo('route');
                  }}
                  className="text-xs font-semibold text-purple-primary hover:text-purple-deep flex items-center gap-1"
                >
                  <span>Route Bypass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setWarnings(prev => prev.map(w => ({ ...w, acknowledged: true })))}
            className="text-xs font-mono font-semibold text-slate-600 hover:text-ink"
          >
            Acknowledge All (5)
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-deep transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. 1-CLICK SOS EMERGENCY PANIC FLASH MODAL
export function EmergencyPanicModal({ isOpen, onClose }) {
  const { currentWard } = useFlood();
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  const coords = currentWard?.defaultCenter 
    ? `${currentWard.defaultCenter.lat.toFixed(5)}, ${currentWard.defaultCenter.lng.toFixed(5)}`
    : `19.06820, 72.87910`;
  const w3w = "safety.shelter.mumbai";

  const toggleAcousticBeacon = () => {
    if (!isBeaconActive) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz alert tone
        // Modulate frequency to create an emergency warble siren
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(3, ctx.currentTime); // 3 Hz modulation
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAudioCtx(ctx);
        setOscillator(osc);
        setIsBeaconActive(true);
      } catch (e) {
        console.warn('Audio beacon failed:', e);
      }
    } else {
      if (oscillator) {
        try { oscillator.stop(); } catch (e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
      }
      setIsBeaconActive(false);
      setOscillator(null);
      setAudioCtx(null);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillator) {
        try { oscillator.stop(); } catch (e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
      }
    };
  }, [oscillator, audioCtx]);

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`URGENT FLOOD SOS: I am trapped in water at ${currentWard.name}. GPS: ${coords}. What3Words: ///${w3w}. Please dispatch rescue team.`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className={`bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 transition-all duration-300 ${
        isBeaconActive ? 'border-red-600 animate-pulse' : 'border-red-500/40'
      }`}>
        {/* Header */}
        <div className="p-5 bg-red-600 text-white rounded-t-[20px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Citizen Emergency SOS Beacon</h3>
              <p className="text-xs text-white/90">Instant Disaster Response & Life Safety Distress</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (isBeaconActive) toggleAcousticBeacon();
              onClose();
            }}
            className="p-2 rounded-xl text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Quick Dial 1916 Callout */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-mono text-red-700 font-bold uppercase tracking-wider block">
              MUNICIPAL DISASTER CONTROL ROOM (TOLL-FREE 24/7)
            </span>
            <div className="text-3xl font-extrabold font-mono text-red-600 my-1">
              1916
            </div>
            <a
              href="tel:1916"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Disaster Hotline 1916</span>
            </a>
          </div>

          {/* Current GPS Coordinates Ready for Dispatch */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>YOUR DISTRESS COORDINATES</span>
              <span className="text-emerald-700 font-bold">Accuracy: ±4 meters</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs">
              <div>
                <span className="text-ink font-bold">{coords}</span>
                <span className="text-slate-400 block text-[10px]">/// {w3w} ({currentWard.name})</span>
              </div>
              <button
                onClick={copyCoordinates}
                className="px-3 py-1.5 rounded-lg bg-purple-soft text-purple-deep hover:bg-purple-primary hover:text-white transition font-bold flex items-center gap-1"
              >
                {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoords ? 'Copied' : 'Copy SOS Text'}</span>
              </button>
            </div>
          </div>

          {/* Acoustic Audio Beacon Siren (Web Audio API) */}
          <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-white">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink block">High-Frequency Audio Siren</span>
              <span className="text-[11px] text-slate-500 block">
                Emits penetrating 880Hz disaster warble so rescue teams can locate you in darkness.
              </span>
            </div>
            <button
              onClick={toggleAcousticBeacon}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition flex items-center gap-1.5 ${
                isBeaconActive 
                  ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/40' 
                  : 'bg-slate-100 text-ink hover:bg-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isBeaconActive ? 'STOP SIREN' : 'SOUND SIREN'}</span>
            </button>
          </div>

          {/* Quick SOS WhatsApp Sharing */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`URGENT FLOOD SOS: I need evacuation assistance in ${currentWard.name}. Coordinates: ${coords}. Link: https://maps.google.com/?q=${coords}`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Family SOS</span>
            </a>
            <a
              href="tel:108"
              className="py-2.5 px-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Ambulance (108)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. TELEMETRY DEEP-DIVE INSPECTION MODAL
export function TelemetryInspectorModal({ metricType, isOpen, onClose }) {
  const { currentWard, currentTimeline } = useFlood();

  if (!isOpen || !metricType) return null;

  const dataMap = {
    precipitation: {
      title: 'Real-Time Precipitation & Convective Nowcast',
      value: `${currentTimeline.rainRate} mm/h`,
      status: currentTimeline.rainRate > 35 ? 'Torrential Cloudburst' : currentTimeline.rainRate > 20 ? 'Heavy Downpour' : 'Moderate Showers',
      statusColor: 'text-red-600 bg-red-50 border-red-200',
      description: 'Derived from Santacruz S-band Doppler Weather Radar (10-minute azimuthal volume scan) and calibrated against 60 BMC automatic weather stations (AWS).',
      sparkline: [12, 18, 26, 38, 44, 32, 28],
      meta: [
        { label: 'Cumulative 24h Rain', val: '142.6 mm' },
        { label: 'Cloud-Top Altitude', val: '11.4 km' },
        { label: 'Peak Reflectivity', val: '54 dBZ (Red core)' },
        { label: 'Rainband Velocity', val: '18 km/h NE' }
      ]
    },
    water: {
      title: 'Basin Hydrological Water Level Telemetry',
      value: `${currentWard.currentWater} cm`,
      status: currentWard.currentWater > 30 ? 'Critical Inundation' : currentWard.currentWater > 15 ? 'Moderate Waterlogging' : 'Low Ponding',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      description: 'Hydro-dynamic surface runoff model (SWMM + LISFLOOD 2D) simulating micro-catchment ponding and curb overflow in low elevation depressions.',
      sparkline: [4, 8, 14, 24, 34, 39, 28],
      meta: [
        { label: 'Ward Baseline Elevation', val: '+4.2m MSL' },
        { label: 'Peak Forecast Depth', val: `${currentWard.peakWater} cm in 45m` },
        { label: 'Infiltration Capacity', val: '0 mm/h (Saturated)' },
        { label: 'Drainage Culvert Load', val: '92% Surcharge' }
      ]
    },
    passability: {
      title: 'Road Network Passability Index',
      value: '82% Clear',
      status: 'Flyovers 100% Passable • Underpasses Closed',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Continuous analysis across 140km of arterial corridors in Mumbai. Cross-references vehicle clearance with ultrasonic curb depth sensors.',
      sparkline: [95, 90, 86, 82, 74, 80, 88],
      meta: [
        { label: 'Sedan Passable Roads', val: '64% open' },
        { label: 'SUV Passable Roads', val: '94% open' },
        { label: 'Subways Closed', val: '3 (Milan, Andheri, Malad)' },
        { label: 'Active Traffic Diversions', val: '12 Corridors' }
      ]
    },
    peak: {
      title: 'Forecast Flood Peak & Tidal Confluence Horizon',
      value: '+45 min',
      status: 'High Tide Confluence at 21:40 IST',
      statusColor: 'text-purple-primary bg-purple-soft border-purple-primary/20',
      description: 'The critical convergence of peak convective cloudburst runoff with the 4.18m Arabian Sea astronomical high tide, causing gravity outfalls to lock shut.',
      sparkline: [10, 20, 35, 60, 95, 75, 45],
      meta: [
        { label: 'High Tide Elevation', val: '4.18 meters' },
        { label: 'Sluice Gates Shut', val: '4/4 Major Outfalls' },
        { label: 'Dewatering Pumps', val: '38,000 LPS Active' },
        { label: 'Water Recession Time', val: '23:15 IST' }
      ]
    }
  };

  const metric = dataMap[metricType] || dataMap.precipitation;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-soft text-purple-deep">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                TELEMETRY DIAGNOSTIC
              </span>
              <h3 className="font-extrabold text-ink text-base">{metric.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold font-mono text-ink">{metric.value}</span>
              <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold border inline-block ${metric.statusColor}`}>
                {metric.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            {metric.description}
          </p>

          {/* Sparkline Visualization */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-500 mb-2 flex items-center justify-between">
              <span>NOWCAST TREND (Past 60m → Next 120m)</span>
              <span className="text-purple-primary font-bold">15m Intervals</span>
            </div>
            <div className="h-20 flex items-end gap-2 pt-2">
              {metric.sparkline.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {val}
                  </span>
                  <div 
                    className={`w-full rounded-t-lg transition-all ${
                      idx === 3 ? 'bg-purple-primary ring-2 ring-purple-300' : 'bg-slate-200 group-hover:bg-purple-soft'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-400">
                    {idx === 0 ? '-45m' : idx === 3 ? 'NOW' : idx === 4 ? '+30m' : idx === 6 ? '+120m' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Metric Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {metric.meta.map((m, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">{m.label}</span>
                <span className="font-bold text-ink text-xs mt-0.5 block">{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-primary text-white text-xs font-bold rounded-xl hover:bg-purple-deep transition"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. QUICK HAZARD REPORT MODAL (WITH SIMULATED AI DEPTH ESTIMATOR)
export function QuickHazardReportModal({ isOpen, onClose, onHazardSubmitted }) {
  const { currentWard } = useFlood();
  const [hazardType, setHazardType] = useState('waterlogging');
  const [selectedDepth, setSelectedDepth] = useState(25);
  const [description, setDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const simulateAIDepthScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        detectedWaterLevel: 28,
        confidence: 94,
        hazardKeypoints: ['Submerged Car Wheel (Hubcap drowned)', 'Sidewalk curb underwater', 'High sediment turbidity'],
        severity: 'HIGH'
      });
      setSelectedDepth(28);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onHazardSubmitted) {
        onHazardSubmitted({
          id: `HZ-${Date.now().toString().slice(-4)}`,
          type: hazardType.toUpperCase(),
          title: `${hazardType.replace('_', ' ').toUpperCase()}: ${currentWard.name}`,
          location: currentWard.name,
          severity: selectedDepth > 30 ? 'CRITICAL' : 'HIGH',
          depth: selectedDepth,
          timeReported: 'Just now'
        });
      }
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-purple-primary to-purple-deep text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Crowdsource Street Water Hazard</h3>
              <p className="text-xs text-white/80">With Automated AI Computer Vision Depth Estimation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-mono font-bold text-slate-700 block mb-1">HAZARD CATEGORY</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              {[
                { id: 'waterlogging', label: 'Waterlogging' },
                { id: 'open_manhole', label: 'Open Manhole' },
                { id: 'electrical', label: 'Live Cable/Pillar' },
                { id: 'stalled_vehicle', label: 'Stalled Car' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setHazardType(cat.id)}
                  className={`p-2 rounded-xl border text-center transition ${
                    hazardType === cat.id 
                      ? 'bg-purple-soft border-purple-primary text-purple-deep font-bold ring-1 ring-purple-primary' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Vision Photo Scanner Simulation */}
          <div className="border-2 border-dashed border-purple-300 rounded-2xl p-4 bg-purple-50/50 text-center">
            <div className="flex flex-col items-center">
              <Camera className="w-6 h-6 text-purple-primary mb-1" />
              <span className="text-xs font-bold text-ink">Simulate AI Camera Depth Gauge</span>
              <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                Upload or snap flood photo. Edge-detection models analyze tire submergence ratios.
              </p>
              <button
                type="button"
                onClick={simulateAIDepthScan}
                disabled={isScanning}
                className="mt-2.5 px-4 py-1.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-deep transition shadow-xs flex items-center gap-1.5"
              >
                {isScanning ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isScanning ? 'Running AI Feature Extractor...' : 'Run Simulated AI Image Scan'}</span>
              </button>
            </div>

            {scanResult && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-300 text-left text-xs font-mono animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    AI Estimate: {scanResult.detectedWaterLevel} cm
                  </span>
                  <span>Confidence: {scanResult.confidence}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Keypoints: {scanResult.hazardKeypoints.join(' • ')}
                </div>
              </div>
            )}
          </div>

          {/* Manual Depth Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-700 font-bold">OBSERVED WATER DEPTH:</span>
              <span className="text-purple-primary font-bold text-sm">{selectedDepth} cm</span>
            </div>
            <input 
              type="range"
              min="0"
              max="60"
              value={selectedDepth}
              onChange={(e) => setSelectedDepth(Number(e.target.value))}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
              <span>Ankle (10cm)</span>
              <span>Knee (30cm)</span>
              <span>Waist (60cm)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-700 block mb-1">LOCATION & NOTES</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`E.g., Near petrol pump, water rising quickly along ${currentWard.name}...`}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5"
          >
            {submitted ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{submitted ? 'Verified & Dispatched to BMC!' : 'Submit Crowd-Hazard & Pin to Map'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

