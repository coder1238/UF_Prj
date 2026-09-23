import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Send, 
  Share2, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  HeartPulse, 
  Droplet, 
  MapPin, 
  Package, 
  Wrench,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function LocationCommunityAndHealth({ selectedPlace }) {
  // Feature 21: Equipment Sharing Pool state
  const [equipmentList, setEquipmentList] = useState([
    {
      id: 'eq-1',
      title: '1-HP Submersible Sump Pump + 20m Discharge Hose',
      owner: 'Hindmata Heights Society (Secretariat)',
      contact: 'Gate Security / +91 98200 11223',
      available: true,
      category: 'Pump'
    },
    {
      id: 'eq-2',
      title: '50x Coarse Sandbags with Jute Twine',
      owner: 'BMC Ward Depot (Near Flyover Ramp)',
      contact: 'Ward Supervisor Ramesh',
      available: true,
      category: 'Barrier'
    },
    {
      id: 'eq-3',
      title: 'Inflatable 4-Person Rescue Dinghy + Oars',
      owner: 'Citizens Aid Society Dadar',
      contact: 'Anil K. / Flat 402',
      available: false,
      category: 'Evacuation'
    },
    {
      id: 'eq-4',
      title: '2.5 kVA Portable Petrol Generator',
      owner: 'Star Commercial Stores',
      contact: 'Shop 4 / Main Road',
      available: true,
      category: 'Power'
    }
  ]);
  const [equipmentSuccessMsg, setEquipmentSuccessMsg] = useState(null);

  const toggleEquipmentClaim = (id) => {
    setEquipmentList(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.available;
        setEquipmentSuccessMsg(nextState ? `Released "${item.title}" back to community pool.` : `Reserved "${item.title}". Contact details sent to your phone.`);
        setTimeout(() => setEquipmentSuccessMsg(null), 3500);
        return { ...item, available: nextState };
      }
      return item;
    }));
  };

  // Feature 22: Ward Control Room SOS Dispatcher
  const [sosSent, setSosSent] = useState(false);
  const [sosCopied, setSosCopied] = useState(false);

  const wardData = {
    wardName: selectedPlace.ward,
    controlRoomTel: '022-24024000',
    dutyOfficer: 'Executive Engineer V. R. Patwardhan',
    wardControlRoomAddress: `Ward ${selectedPlace.ward} Municipal Office, Near Central Railway Station`,
    disasterHotline: '1916 (Ext 4)',
    boatUnitTel: '022-22694725'
  };

  const sosPayload = `CRITICAL FLOOD SOS DISPATCH:
Location: ${selectedPlace.name} (Ward ${selectedPlace.ward})
Elevation: ${selectedPlace.elevation}
Current Water Depth: ${selectedPlace.currentDepth}cm
Peak Predicted Depth: ${selectedPlace.peakDepth}cm (in +${selectedPlace.peakArrivalMin} mins)
Storm Drain Proximity: ${selectedPlace.drainageDistance}
Occupants: Urgent assistance required for elderly/children at ground level.
Timestamp: ${new Date().toLocaleString()} (Mumbai Flood Intelligence Citizen Portal)`;

  const handleCopySos = () => {
    navigator.clipboard.writeText(sosPayload);
    setSosCopied(true);
    setTimeout(() => setSosCopied(false), 3000);
  };

  const handleSendSos = () => {
    const text = encodeURIComponent(sosPayload);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setSosSent(true);
    setTimeout(() => setSosSent(false), 3000);
  };

  // Feature 23: Drinking Water & Health Advisor state
  const [sumpLiters, setSumpLiters] = useState(5000);
  // Chlorine dosage: 1 chlorine tablet (0.5g sodium dichloroisocyanurate) per 1,000L for pre-treated water, or 2 tabs/1000L post-flood
  const chlorineTabs = Math.ceil((sumpLiters / 1000) * 2);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-8">
      {/* SECTION 1: BMC WARD DISASTER CONTROL ROOM DIRECT SOS DISPATCHER */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-ink">BMC Ward Disaster Control Room SOS Dispatcher</h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Direct emergency telemetry dispatch to BMC Disaster Management Cell for Ward {selectedPlace.ward}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopySos}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{sosCopied ? 'SOS Copied!' : 'Copy Telemetry Payload'}</span>
            </button>
            <button 
              onClick={handleSendSos}
              className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sosSent ? 'Dispatched!' : 'Transmit WhatsApp SOS'}</span>
            </button>
          </div>
        </div>

        {/* Ward Control Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Ward {selectedPlace.ward} Control Room</span>
            <span className="text-xl font-mono font-extrabold text-ink mt-0.5 block">{wardData.controlRoomTel}</span>
            <span className="text-xs text-slate-500 block mt-1">{wardData.dutyOfficer}</span>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">BMC Central Emergency Hotline</span>
            <span className="text-xl font-mono font-extrabold text-red-600 mt-0.5 block">{wardData.disasterHotline}</span>
            <span className="text-xs text-slate-500 block mt-1">Direct Disaster Management Cell (HQ)</span>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80">
            <span className="text-[10px] font-mono text-muted uppercase block">Fire & Inflatable Boat Unit</span>
            <span className="text-xl font-mono font-extrabold text-purple-primary mt-0.5 block">{wardData.boatUnitTel}</span>
            <span className="text-xs text-slate-500 block mt-1">Stationed at Dadar Fire Headquarters</span>
          </div>
        </div>

        {/* SOS Telemetry Preview Box */}
        <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-300 border border-slate-800 space-y-1">
          <div className="text-red-400 font-bold flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            STANDARDIZED FIRST RESPONDER SOS TELEMETRY PAYLOAD:
          </div>
          <p className="text-slate-200 leading-relaxed whitespace-pre-line">{sosPayload}</p>
        </div>
      </div>

      {/* SECTION 2: NEIGHBORHOOD EQUIPMENT & SANDBAG SHARING POOL */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-primary">
                <Wrench className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Community Sandbag & Dewatering Equipment Pool</h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Citizen mutual-aid gear available within 300m of {selectedPlace.name}
            </p>
          </div>

          {equipmentSuccessMsg && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl animate-fadeIn">
              {equipmentSuccessMsg}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {equipmentList.map(eq => (
            <div key={eq.id} className="p-4 rounded-2xl bg-canvas border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase">{eq.category}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    eq.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {eq.available ? 'AVAILABLE' : 'IN USE'}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-ink">{eq.title}</h5>
                <p className="text-[11px] text-muted mt-1">Custodian: {eq.owner}</p>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">Contact: {eq.contact}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-end">
                <button
                  onClick={() => toggleEquipmentClaim(eq.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    eq.available 
                      ? 'bg-purple-primary hover:bg-purple-deep text-white shadow-sm' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {eq.available ? 'Request / Reserve Equipment' : 'Mark as Returned'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: DRINKING WATER CONTAMINATION & LEPTOSPIROSIS HEALTH ADVISOR */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <HeartPulse className="w-4 h-4" />
          </span>
          <h4 className="text-sm font-bold text-ink">Drinking Water Contamination & Leptospirosis Health Advisor</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Water Sump Chlorination Calculator */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-blue-600" /> Sump Disinfection Tablet Calculator
              </span>
              <span className="text-[10px] font-mono text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded">
                BMC Health Guideline
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If floodwaters overtop underground water tank inspection lips, municipal water supply can be contaminated with sewer backflow.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Underground Sump Capacity:</span>
                <span className="font-bold text-ink">{sumpLiters.toLocaleString()} Litres</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="25000" 
                step="1000"
                value={sumpLiters}
                onChange={(e) => setSumpLiters(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">Chlorine Dose Required</span>
                <span className="text-base font-mono font-extrabold text-blue-700 mt-0.5 block">
                  {chlorineTabs} Tablets (NaDCC 0.5g)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono text-right">
                Wait 30 mins before drinking
              </span>
            </div>
          </div>

          {/* Leptospirosis Prophylaxis */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-red-600" /> Leptospirosis Flood Water Warning
              </span>
              <span className="text-[10px] font-mono text-red-800 font-bold bg-red-100 px-2 py-0.5 rounded">
                High Risk Exposure
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Wading through floodwaters exposes cuts/skin to Leptospira bacteria from urban rodent runoff. BMC mandates prophylactic treatment within 72 hours of wading.
            </p>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
              <span className="font-bold block">Adult Prophylactic Protocol:</span>
              <p className="text-[11px] leading-snug">
                Cap. Doxycycline 200mg single dose within 24-72 hours of water contact (or Tab. Azithromycin 500mg for pregnant women/children under physician direction).
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center justify-between border-t border-slate-200/60">
              <span>Nearest Dispensary: Dadar Central (24/7)</span>
              <span className="text-emerald-800 font-bold">Free Medicine Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

