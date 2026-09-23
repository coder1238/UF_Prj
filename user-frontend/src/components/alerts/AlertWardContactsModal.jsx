import React from 'react';
import { X, PhoneCall, MessageCircle, ShieldCheck, UserCheck, Flame, Radio, Clock } from 'lucide-react';

export default function AlertWardContactsModal({ alert, onClose }) {
  if (!alert) return null;

  const contacts = alert.emergencyContacts || {
    wardControlDesk: '022-24024355',
    wardOfficer: 'Mr. S. Kulkarni (9820144512)',
    fireStation: 'Central Fire Control (101 / 022-23076111)',
    ndrfBattalion: 'NDRF Unit 5 Camp (9423578910)'
  };

  const handleCall = (num) => {
    const cleanNum = num.replace(/[^0-9+]/g, '');
    window.open(`tel:${cleanNum}`, '_self');
  };

  const handleWhatsAppDesk = () => {
    const text = encodeURIComponent(`URGENT INQUIRY / SOS regarding Alert ${alert.id} (${alert.title}) in Ward ${alert.ward}. Current water level reported: ${alert.waterDepth}cm.`);
    window.open(`https://api.whatsapp.com/send?phone=919820144512&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <PhoneCall className="w-5 h-5" /> Ward {alert.ward} Emergency Control Directory
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ward Badge */}
        <div className="my-3 p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-primary animate-pulse" />
            <span className="text-xs font-bold text-purple-900">{alert.wardName || `Ward ${alert.ward}`}</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Lines Operational
          </span>
        </div>

        {/* Directory Contact Cards */}
        <div className="space-y-3 my-4">
          {/* Ward Control Desk */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-primary flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">Ward Disaster Control Desk</span>
                <span className="text-xs font-mono font-semibold text-purple-primary">{contacts.wardControlDesk}</span>
              </div>
            </div>
            <button
              onClick={() => handleCall(contacts.wardControlDesk)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </button>
          </div>

          {/* On-Duty Ward Officer */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">Ward Disaster Officer</span>
                <span className="text-xs font-mono font-semibold text-slate-700">{contacts.wardOfficer}</span>
              </div>
            </div>
            <button
              onClick={() => handleCall(contacts.wardOfficer)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </button>
          </div>

          {/* Fire Brigade */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">Municipal Fire Brigade</span>
                <span className="text-xs font-mono font-semibold text-slate-700">{contacts.fireStation}</span>
              </div>
            </div>
            <button
              onClick={() => handleCall(contacts.fireStation)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </button>
          </div>

          {/* NDRF / Police */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">NDRF / Flood Rescue Team</span>
                <span className="text-xs font-mono font-semibold text-slate-700">{contacts.ndrfBattalion}</span>
              </div>
            </div>
            <button
              onClick={() => handleCall(contacts.ndrfBattalion)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </button>
          </div>
        </div>

        {/* WhatsApp Direct Inquiry */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleWhatsAppDesk}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Ward Disaster Desk
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

