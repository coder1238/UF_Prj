import React, { useState } from 'react';
import {
  X,
  Home,
  CheckCircle2,
  Building,
  HeartPulse,
  BatteryCharging,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const SHELTERS = [
  {
    id: 'SHL-KURLA-01',
    name: 'Kalina Municipal Education Complex',
    ward: 'Ward L',
    capacity: 1200,
    occupied: 420,
    medicalOfficer: 'Dr. Neha Varma (MBBS)',
    generators: '2x 125kVA Gensets Active',
    rationDays: 5,
    safeCorridor: 'Via Hans Bhugra Marg & CST Road Elevated Flyover',
    status: 'OPEN & STAGED',
  },
  {
    id: 'SHL-SION-02',
    name: 'Sion Municipal Gymnasium & Community Hall',
    ward: 'Ward F/N',
    capacity: 850,
    occupied: 310,
    medicalOfficer: 'Dr. Suresh Patil (MD)',
    generators: '1x 100kVA Genset Active',
    rationDays: 4,
    safeCorridor: 'Via Wadala West Elevated Ridge & Eastern Freeway Slip',
    status: 'OPEN & STAGED',
  },
  {
    id: 'SHL-ANDHERI-03',
    name: 'Andheri Sports Complex Multipurpose Stadium',
    ward: 'Ward K/E',
    capacity: 2500,
    occupied: 680,
    medicalOfficer: 'Dr. R. K. Iyer (Civil Surgeon)',
    generators: '3x 250kVA Gensets Active',
    rationDays: 7,
    safeCorridor: 'Via Western Express Highway Flyover Bypass',
    status: 'OPEN & STAGED',
  },
  {
    id: 'SHL-DADAR-04',
    name: 'Dadar Sharadashram Vidyamandir Hall',
    ward: 'Ward G/N',
    capacity: 700,
    occupied: 180,
    medicalOfficer: 'Dr. Kavita Shinde',
    generators: '1x 80kVA Genset Active',
    rationDays: 6,
    safeCorridor: 'Via Senapati Bapat Marg Elevated Flyover',
    status: 'OPEN & STAGED',
  },
];

export default function ShelterEvacuationModal({
  isOpen,
  onClose,
  targetWards = [],
  onAttachShelterInfo,
}) {
  if (!isOpen) return null;

  const [selectedShelterIds, setSelectedShelterIds] = useState(
    SHELTERS.slice(0, 2).map((s) => s.id)
  );

  const toggleShelter = (id) => {
    setSelectedShelterIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAttach = () => {
    const selected = SHELTERS.filter((s) => selectedShelterIds.includes(s.id));
    const textSnippet = ` DESIGNATED RELIEF SHELTERS: ${selected
      .map((s) => `${s.name} (${s.ward}) [Remaining Beds: ${s.capacity - s.occupied}]`)
      .join('; ')}. Evacuate via elevated corridors.`;

    if (onAttachShelterInfo) {
      onAttachShelterInfo(textSnippet);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-status-safe-soft text-status-safe">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink uppercase tracking-wide">
                Designated Municipal Relief Shelters &amp; Evacuation Corridors
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Emergency shelter staging, live bed vacancies &amp; flood-safe pedestrian corridors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shelters List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {SHELTERS.map((s) => {
            const isSelected = selectedShelterIds.includes(s.id);
            const remainingBeds = s.capacity - s.occupied;
            const occupancyPct = Math.round((s.occupied / s.capacity) * 100);

            return (
              <div
                key={s.id}
                onClick={() => toggleShelter(s.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-status-safe-soft/30 border-status-safe shadow-subtle'
                    : 'bg-surface-secondary border-border opacity-75 hover:opacity-100'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-status-safe border-status-safe text-white'
                          : 'border-border bg-surface'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-mono font-bold text-xs text-ink">{s.id}</span>
                    <span className="font-bold text-xs text-ink">{s.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-purple font-semibold">
                      {s.ward}
                    </span>
                  </div>

                  <div className="text-[11px] text-ink-secondary flex flex-wrap items-center gap-4 font-mono">
                    <span className="flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-status-alert" /> {s.medicalOfficer}
                    </span>
                    <span className="flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-status-safe" /> {s.generators}
                    </span>
                    <span>Food Rations: {s.rationDays} Days</span>
                  </div>

                  <div className="text-[11px] text-ink font-medium flex items-center gap-1.5 pt-1">
                    <Navigation className="w-3.5 h-3.5 text-purple shrink-0" />
                    <span>Safe Ingress Corridor: {s.safeCorridor}</span>
                  </div>
                </div>

                {/* Bed Occupancy Meter */}
                <div className="w-full md:w-48 text-right font-mono self-end md:self-auto shrink-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-secondary font-sans text-[11px]">Available:</span>
                    <span className="font-bold text-status-safe">{remainingBeds} Beds Free</span>
                  </div>
                  <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-status-safe h-full rounded-full transition-all"
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-secondary mt-0.5 block">
                    {s.occupied} / {s.capacity} occupied ({occupancyPct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-xs text-ink-secondary font-mono">
            {selectedShelterIds.length} Shelters Selected for Broadcast Integration
          </span>

          <button
            onClick={handleAttach}
            className="px-4 py-2 rounded-lg bg-status-safe hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <span>Attach Shelters to Alert Message</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

