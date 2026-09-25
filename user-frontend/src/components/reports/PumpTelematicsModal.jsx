import React, { useState, useEffect } from 'react';
import { Truck, Activity, Droplets, Gauge, Fuel, Phone, PhoneCall, X, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function PumpTelematicsModal({ report, isOpen, onClose }) {
  const [liveRpm, setLiveRpm] = useState(report?.unitAssigned?.pumpRpm || 1850);
  const [liveLpm, setLiveLpm] = useState(report?.unitAssigned?.dischargeRateLpm || 2400);
  const [callingOfficer, setCallingOfficer] = useState(false);
  const [callStatus, setCallStatus] = useState(null); // 'connecting' | 'connected' | 'ended'

  const unit = report?.unitAssigned || {
    id: 'DMU-04F',
    name: 'High-Capacity Dewatering Pump Unit #7',
    vehicleReg: 'MH-02-EE-4102',
    crewChief: 'Sub-Inspector M. Kadam',
    crewPhone: '+91 98201 44520',
    crewSize: 4,
    pumpType: 'Submersible 2400 LPM Dewatering Rig',
    pumpRpm: 1850,
    dischargeRateLpm: 2400,
    fuelPct: 84,
    drainOutfall: 'Hindmata Box Culvert Outfall',
    etaMinutes: 4,
    status: 'Operational - Active Discharge'
  };

  // Fluctuate RPM and LPM realistically
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const deltaRpm = Math.floor(Math.random() * 50) - 25;
      const deltaLpm = Math.floor(Math.random() * 60) - 30;
      setLiveRpm(prev => Math.min(2200, Math.max(1600, prev + deltaRpm)));
      setLiveLpm(prev => Math.min(2800, Math.max(2000, prev + deltaLpm)));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !report) return null;

  const handleStartCall = () => {
    setCallingOfficer(true);
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallingOfficer(false);
      setCallStatus(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{unit.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {unit.status.includes('Active') || report.status === 'in_progress' ? 'TELEMETRY LIVE' : 'STATIONED'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">Asset ID: {unit.id} • Reg: {unit.vehicleReg}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Telemetry Dials / Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Turbine Speed</span>
              <div className="text-2xl font-black font-mono text-slate-900">{liveRpm}</div>
              <span className="text-[10px] font-mono text-purple-primary font-bold">RPM (Dynamic)</span>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 text-center">
              <span className="text-[10px] font-mono uppercase text-purple-600 block mb-1">Discharge Rate</span>
              <div className="text-2xl font-black font-mono text-purple-primary">{liveLpm}</div>
              <span className="text-[10px] font-mono text-purple-600 font-bold">LPM (~{Math.round(liveLpm * 0.06)} m³/hr)</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Diesel Reserves</span>
              <div className="text-2xl font-black font-mono text-emerald-600">{unit.fuelPct}%</div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">~6.8h Runtime</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Drain Outfall</span>
              <div className="text-xs font-bold font-mono text-slate-800 truncate" title={unit.drainOutfall}>
                {unit.drainOutfall.split(' ')[0]} Sluice
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">Flow Unobstructed</span>
            </div>
          </div>

          {/* Real-time Operation Status Timeline */}
          <div className="bg-canvas p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Operational Telematics</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> CAN-Bus Sensor Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">Assigned Ward:</span>
                <span className="font-mono font-bold text-slate-800">{report.ward || 'Ward K-West'} Disaster Desk</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">Discharge Pump Hardware:</span>
                <span className="font-mono font-bold text-slate-800">{unit.pumpType}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">Crew Personnel on Ground:</span>
                <span className="font-mono font-bold text-slate-800">{unit.crewChief} + {unit.crewSize} MCGM Staff</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">Incident Target Water Clearance:</span>
                <span className="font-mono font-bold text-purple-primary">&lt; 8 cm target (Currently {report.depth} cm)</span>
              </div>
            </div>
          </div>

          {/* Quick Officer Contact & Direct Emergency Dispatch Link */}
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-primary" />
                <h4 className="font-bold text-ink text-sm">Designated Incident Officer</h4>
              </div>
              <p className="text-xs text-muted mt-0.5">{report.assignedOfficer || 'Ward Officer V. Desai (MCGM Stormwater Cell)'}</p>
              <p className="text-[11px] font-mono text-purple-primary mt-0.5">{report.officerPhone || '+91 22 2628 5381 (Ref: MCGM-SW-48)'}</p>
            </div>

            <button
              onClick={handleStartCall}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" /> Call Field Desk
            </button>
          </div>

          {/* Simulated Active Call Overlay */}
          {callingOfficer && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {callStatus === 'connecting' ? 'Routing encrypted call to MCGM Field Terminal...' : 'Connected with Emergency Field Dispatcher'}
                  </span>
                </div>
                <button
                  onClick={handleEndCall}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono"
                >
                  End Call
                </button>
              </div>

              {callStatus === 'connected' && (
                <div className="text-xs text-slate-300 font-mono bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <p className="text-emerald-400 font-bold mb-1">Dispatcher [Duty Officer]:</p>
                  <p>"MCGM Stormwater Control Room here. We confirm Unit #{unit.id} ({unit.vehicleReg}) is actively pumping at {report.location}. Twin 2400 LPM lines deployed. Water level dropping steadily."</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 rounded-b-3xl">
          <span>Connected via MCGM VHF & Cellular Telematics</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
          >
            Close HUD
          </button>
        </div>
      </div>
    </div>
  );
}
