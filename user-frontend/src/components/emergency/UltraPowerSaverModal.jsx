import React, { useState } from 'react';
import { 
  BatteryCharging, Battery, Download, ShieldCheck, 
  FileText, Check, X, Moon, ZapOff, Sparkles, AlertCircle 
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

export default function UltraPowerSaverModal({ isOpen, onClose, isPowerSaver, onTogglePowerSaver }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadVault = () => {
    const offlinePackage = {
      title: 'MUMBAI URBAN FLOOD CITIZEN OFFLINE DISASTER VAULT',
      generatedAt: new Date().toISOString(),
      city: 'Mumbai, Maharashtra',
      criticalHelplines: [
        { name: 'BMC Disaster Control Room', phone: '1916' },
        { name: 'NDRF Disaster Response Force', phone: '1078' },
        { name: 'Emergency Medical Ambulance', phone: '108' },
        { name: 'Fire & Water Extrication Squad', phone: '101' },
        { name: 'Mumbai Traffic Police Helpline', phone: '8454999999' }
      ],
      triageProtocol: 'START Triage: Red = Immediate Life Threat, Yellow = Serious Delayed, Green = Walking Wounded, Black = Deceased',
      firstAidReminders: [
        'Leptospirosis Prophylaxis: Doxycycline 200mg single dose within 72h of wading in sewer runoff.',
        'Hypothermia: Strip saturated clothing; warm core/trunk with dry blankets before extremities.',
        'Electrical Safety: Maintain 10m buffer from fallen lines in pooled water.'
      ],
      designatedShelters: SAFE_PLACES_DATA.map(s => ({
        name: s.name,
        ward: s.ward,
        elevation: s.elevation,
        address: s.address,
        phone: s.phone,
        coordinates: s.coordinates
      }))
    };

    const blob = new Blob([JSON.stringify(offlinePackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mumbai_Flood_Offline_Vault_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BatteryCharging className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">Feature #11</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800">
                  Grid Blackout Mode
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Ultra Power Saver & Offline Vault</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Toggle Power Saver */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-400" /> Ultra OLED Battery Conservation
                </span>
                <p className="text-xs text-slate-400">
                  Switches UI to true-black monochrome, disables heavy canvas re-renders, and halts all non-critical network polls.
                </p>
              </div>
              <button
                onClick={onTogglePowerSaver}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  isPowerSaver 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isPowerSaver ? 'ACTIVE ON' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* Export Offline Vault */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" /> Complete Offline Disaster Vault
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export an encrypted, zero-dependency offline archive containing all BMC emergency contacts, GPS shelter coordinates, hospital hotlines, and waterborne first-aid protocols. Usable when 4G/5G towers collapse.
            </p>

            <button
              onClick={handleDownloadVault}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Vault Archive Saved to Device
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Complete Offline Vault (.JSON)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

