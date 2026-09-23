import React, { useState } from 'react';
import { 
  Bell, BatteryCharging, Shield, Users, Compass, 
  CloudRain, Dog, Lock, Receipt, History, Award, 
  CheckCircle2, AlertTriangle, Sliders, ChevronDown, ChevronUp,
  FileCheck, ExternalLink, Zap, Radio, Trash2, Plus, Sparkles
} from 'lucide-react';

export default function ProfileAdditionalFeatures({
  profileExtras,
  onUpdateExtras,
  speakAlert
}) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const updateSection = (sectionKey, updatedValues) => {
    const updated = {
      ...profileExtras,
      [sectionKey]: {
        ...profileExtras[sectionKey],
        ...updatedValues
      }
    };
    onUpdateExtras(updated);
  };

  const {
    notifications = {
      levelRed: true,
      levelOrange: true,
      levelYellow: false,
      recessionNotices: true,
      overrideQuietHours: true,
      smsDelivery: true,
      pushDelivery: true
    },
    batterySaver = {
      enabled: false,
      oledBlackTheme: true,
      disableAnimations: true,
      throttleGpsIntervalSec: 60,
      estimatedHoursRemaining: 34
    },
    insurance = {
      policyNumber: 'HDFC-ERGO-FL-89210',
      provider: 'HDFC ERGO General Insurance',
      vehicleClaimHelpDesk: '1800-2666',
      zeroDepreciationCover: true,
      hydrostaticLockProtection: true,
      preFloodPhotosStored: 4
    },
    volunteer = {
      isEnrolled: true,
      volunteerRole: '4x4 Off-Road Rescue Volunteer',
      certifications: ['CPR & First Aid Level 2', 'NDMA Citizen First Responder'],
      hasInflatableBoat: false,
      hasHamRadio: true,
      callSign: 'VU2-MUM-FLOOD',
      availableForDuty: true
    },
    routePreferences = {
      avoidUnderpasses: true,
      avoidBridgeRamps: true,
      preferMonorailCorridors: true,
      maxDetourMinutes: 25,
      pedestrianElevationBufferCm: 10
    },
    rainGauge = {
      pairedDevice: 'Davis Vantage Pro2 / ESP32-Balcony-L4',
      isConnected: true,
      liveRainRateMmHr: 42.5,
      drainClearanceAlert: true,
      lastSync: '1 min ago'
    },
    petSafety = {
      hasPets: true,
      petName: 'Bruno & Milo',
      species: 'Golden Retriever & Indie Cat',
      carrierWeightKg: 28,
      isVaccinated: true,
      filterPetSheltersOnly: true
    },
    privacy = {
      precisionMode: 'differential', // 'precise' | 'differential' | 'stealth'
      jitterRadiusM: 450,
      scrambleCoordinates: true
    },
    taxSubsidy = {
      applicationId: 'BMC-SUB-2026-8812',
      cessRebatePercent: 15,
      status: 'APPROVED (₹4,200 Municipal Credit)',
      sumpPumpVerified: true
    },
    incidentDiary = {
      logs: [
        { id: 'inc-1', year: '2024', location: 'Milan Subway', notes: 'Water reached 65cm. Hydrostatic stall avoided by reversing.' },
        { id: 'inc-2', year: '2025', location: 'Hindmata Flyover Under-Berm', notes: 'Severe 40cm waterlogging during 140mm cloudburst.' }
      ]
    }
  } = profileExtras;

  const [newLog, setNewLog] = useState({ year: '2026', location: '', notes: '' });

  return (
    <div className="space-y-4">
      {/* SECTION 6: Notification Frequency & Quiet Hours */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('notifs')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-soft text-purple-primary rounded-2xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Disaster Alert Rules & Quiet Hours Override</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 6
                </span>
              </div>
              <p className="text-xs text-muted">Filter alert thresholds, sirens, and midnight emergency overrides.</p>
            </div>
          </div>
          {activeAccordion === 'notifs' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'notifs' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fadeIn">
            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-ink">Red Alert (Cloudburst &gt;65mm/h)</span>
              <input 
                type="checkbox"
                checked={notifications.levelRed}
                onChange={e => updateSection('notifications', { levelRed: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-ink">Orange Alert (High Waterlogging)</span>
              <input 
                type="checkbox"
                checked={notifications.levelOrange}
                onChange={e => updateSection('notifications', { levelOrange: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-ink">Water Recession & Clearance</span>
              <input 
                type="checkbox"
                checked={notifications.recessionNotices}
                onChange={e => updateSection('notifications', { recessionNotices: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>

            <div className="sm:col-span-2 lg:col-span-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 block">Bypass Phone Silent / Do-Not-Disturb</span>
                <span className="text-[11px] text-amber-800">Critical sirens will pierce quiet hours during flash flood alerts</span>
              </div>
              <input 
                type="checkbox"
                checked={notifications.overrideQuietHours}
                onChange={e => updateSection('notifications', { overrideQuietHours: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: Ultra-Power Disaster Battery Saver */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('battery')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Ultra-Power Disaster Battery Saver Mode</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 7
                </span>
              </div>
              <p className="text-xs text-muted">Throttles animations and radar polling to extend device runtime to 34+ hours.</p>
            </div>
          </div>
          {activeAccordion === 'battery' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'battery' && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-ink block">Survival Battery Runtime Predictor</span>
                <span className="text-xs text-muted">Device can sustain emergency GPS & SMS beacons for up to:</span>
              </div>
              <span className="text-2xl font-mono font-extrabold text-emerald-600">
                ~{batterySaver.estimatedHoursRemaining} Hours
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-ink block">OLED Pure Black Contrast</span>
                  <span className="text-[10px] text-muted">Turns off screen pixels on AMOLED displays</span>
                </div>
                <input 
                  type="checkbox"
                  checked={batterySaver.oledBlackTheme}
                  onChange={e => updateSection('batterySaver', { oledBlackTheme: e.target.checked })}
                  className="w-4 h-4 accent-purple-primary rounded"
                />
              </label>

              <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-ink block">Disable Map Canvas Animations</span>
                  <span className="text-[10px] text-muted">Reduces GPU drain by 80%</span>
                </div>
                <input 
                  type="checkbox"
                  checked={batterySaver.disableAnimations}
                  onChange={e => updateSection('batterySaver', { disableAnimations: e.target.checked })}
                  className="w-4 h-4 accent-purple-primary rounded"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 10: Flood Insurance Vault */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('insurance')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Flood Insurance Policy Vault & Damage Stash</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 10
                </span>
              </div>
              <p className="text-xs text-muted">Instant policy claim hotline and pre-flood vehicle timestamp proof stash.</p>
            </div>
          </div>
          {activeAccordion === 'insurance' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'insurance' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Insurance Provider</label>
              <input
                type="text"
                value={insurance.provider}
                onChange={e => updateSection('insurance', { provider: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Comprehensive Policy Number</label>
              <input
                type="text"
                value={insurance.policyNumber}
                onChange={e => updateSection('insurance', { policyNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Engine Protector / Hydrostatic Rider</span>
                <span className="text-[10px] text-muted">Protects against water ingress engine seize</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">ACTIVE</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Pre-Flood Photos Verified</span>
                <span className="text-[10px] text-muted">Stored securely for rapid claim settlement</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-primary">{insurance.preFloodPhotosStored} Photos</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 11: Good Samaritan & Volunteer Credentialing */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('volunteer')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Good Samaritan & Disaster Volunteer Credentialing</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 11
                </span>
              </div>
              <p className="text-xs text-muted">Register volunteer skills: 4x4 rescue, ham radio, boat owner, first aid.</p>
            </div>
          </div>
          {activeAccordion === 'volunteer' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'volunteer' && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-3.5 animate-fadeIn">
            <div className="p-3.5 bg-canvas rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Available on Community Live Map</span>
                <span className="text-[11px] text-muted">Nearby citizens can view you as a vetted emergency responder</span>
              </div>
              <input 
                type="checkbox"
                checked={volunteer.availableForDuty}
                onChange={e => updateSection('volunteer', { availableForDuty: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Specialized Capability</label>
                <select
                  value={volunteer.volunteerRole}
                  onChange={e => updateSection('volunteer', { volunteerRole: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="4x4 Off-Road Rescue Volunteer">4x4 High-Clearance Rescue Vehicle</option>
                  <option value="Certified First-Aid Medic">Certified First-Aid Medic</option>
                  <option value="Inflatable Zodiac Boat Operator">Inflatable Zodiac Boat Operator</option>
                  <option value="Ham Radio / Telecomm Operator">Ham Radio (Amateur VHF/UHF) Relay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Ham Radio Call Sign</label>
                <input
                  type="text"
                  value={volunteer.callSign}
                  onChange={e => updateSection('volunteer', { callSign: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 12: Evacuation Route Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('routePref')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-soft text-purple-primary rounded-2xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Personal Evacuation Route Preference Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 12
                </span>
              </div>
              <p className="text-xs text-muted">Customize avoidance algorithms: skip subways, flyover traps, and choke points.</p>
            </div>
          </div>
          {activeAccordion === 'routePref' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'routePref' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fadeIn">
            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-ink block">Avoid Low-Lying Subways</span>
                <span className="text-[10px] text-muted">Milan, Andheri & Khar underpasses</span>
              </div>
              <input 
                type="checkbox"
                checked={routePreferences.avoidUnderpasses}
                onChange={e => updateSection('routePreferences', { avoidUnderpasses: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-ink block">Avoid Gridlocked Flyover Ramps</span>
                <span className="text-[10px] text-muted">Prevent multi-hour vehicle stranding</span>
              </div>
              <input 
                type="checkbox"
                checked={routePreferences.avoidBridgeRamps}
                onChange={e => updateSection('routePreferences', { avoidBridgeRamps: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-ink block">Prefer Monorail / Elevated Sea Link</span>
                <span className="text-[10px] text-muted">Guaranteed unflooded concrete corridors</span>
              </div>
              <input 
                type="checkbox"
                checked={routePreferences.preferMonorailCorridors}
                onChange={e => updateSection('routePreferences', { preferMonorailCorridors: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded"
              />
            </label>
          </div>
        )}
      </div>

      {/* SECTION 13: IoT Micro-Weather Station & Balcony Rain Gauge */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('rainGauge')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Balcony Ultrasonic Rain Gauge & IoT Weather Node</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 13
                </span>
              </div>
              <p className="text-xs text-muted">Pairs personal rooftop ESP32 rain gauges to contribute hyper-local ground truth.</p>
            </div>
          </div>
          {activeAccordion === 'rainGauge' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'rainGauge' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            <div className="p-3.5 bg-canvas rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-muted font-bold block">Connected Hardware</span>
              <span className="text-xs font-bold text-ink block mt-0.5">{rainGauge.pairedDevice}</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Bluetooth LE Telemetry Active
              </span>
            </div>

            <div className="p-3.5 bg-canvas rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-muted font-bold block">Live Rain Rate</span>
              <span className="text-xl font-mono font-black text-cyan-700 block mt-0.5">
                {rainGauge.liveRainRateMmHr} mm/hr
              </span>
              <span className="text-[10px] text-muted">Intense Monsoon Downpour</span>
            </div>

            <div className="p-3.5 bg-canvas rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Rooftop Drain Warning</span>
                <span className="text-[10px] text-muted">Alert if balcony water does not discharge in 5 mins</span>
              </div>
              <input 
                type="checkbox"
                checked={rainGauge.drainClearanceAlert}
                onChange={e => updateSection('rainGauge', { drainClearanceAlert: e.target.checked })}
                className="w-4 h-4 accent-purple-primary rounded mt-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 14: Pet & Livestock Evacuation Passport */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('petSafety')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
              <Dog className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Pet & Domestic Animal Evacuation Safety Passport</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 14
                </span>
              </div>
              <p className="text-xs text-muted">Registers pet crate weights and filters pet-welcoming flood relief shelters.</p>
            </div>
          </div>
          {activeAccordion === 'petSafety' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'petSafety' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Registered Companion Animals</label>
              <input
                type="text"
                value={petSafety.petName}
                onChange={e => updateSection('petSafety', { petName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">Combined Evacuation Crate Weight (kg)</label>
              <input
                type="number"
                value={petSafety.carrierWeightKg}
                onChange={e => updateSection('petSafety', { carrierWeightKg: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <label className="sm:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-amber-950 block">Only Show Pet-Friendly Relief Shelters</span>
                <span className="text-[11px] text-amber-800">Filters out municipal camps that forbid domestic animals</span>
              </div>
              <input 
                type="checkbox"
                checked={petSafety.filterPetSheltersOnly}
                onChange={e => updateSection('petSafety', { filterPetSheltersOnly: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded"
              />
            </label>
          </div>
        )}
      </div>

      {/* SECTION 15: Zero-Knowledge Location Privacy */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('privacy')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-soft text-purple-primary rounded-2xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Differential Location Privacy & Coordinate Scrambler</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 15
                </span>
              </div>
              <p className="text-xs text-muted">Jitter your GPS coordinate by 500m to safeguard home privacy while preserving safe routing.</p>
            </div>
          </div>
          {activeAccordion === 'privacy' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'privacy' && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-3 animate-fadeIn">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'precise', label: 'Pinpoint GPS (5m)', desc: 'Accurate navigation' },
                { id: 'differential', label: 'Ward Centroid (450m)', desc: 'Differential Privacy' },
                { id: 'stealth', label: 'Stealth Mode', desc: 'Zero cloud telemetry' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSection('privacy', { precisionMode: opt.id })}
                  className={`p-3 rounded-xl border text-left transition ${
                    privacy.precisionMode === opt.id
                      ? 'border-purple-primary bg-purple-soft/40 text-purple-deep ring-2 ring-purple-primary font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-muted block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 16: Municipal Flood Tax & Sump Pump Subsidy */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('tax')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">BMC Municipal Flood Tax Cess Rebate & Subsidy</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 16
                </span>
              </div>
              <p className="text-xs text-muted">15% Property Tax rebate for certified rainwater harvesting and submersible pump installation.</p>
            </div>
          </div>
          {activeAccordion === 'tax' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'tax' && (
          <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Annual Rebate Status</span>
              <span className="text-base font-bold text-emerald-950 block mt-1">{taxSubsidy.status}</span>
              <span className="text-xs text-emerald-700 mt-1 block">Application ref: {taxSubsidy.applicationId}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">Neighborhood Storm Drain Desilting Petition</span>
                <span className="text-[11px] text-muted">Escalates roadside silt buildup directly to Assistant Municipal Commissioner.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert("Desilting petition filed for your road. BMC Ward inspector assigned (Ticket #BMC-DES-9021).");
                  speakAlert("Roadside drain desilting petition filed with Assistant Municipal Commissioner.");
                }}
                className="mt-3 px-3 py-1.5 bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs rounded-xl self-start"
              >
                File Desilting Petition
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 17: Incident Diary & Historical Flood Traps */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('diary')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Personal Incident Diary & Commute Danger Hotspots</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FEATURE 17
                </span>
              </div>
              <p className="text-xs text-muted">Past flood traps encountered. The routing engine warns you before entering them.</p>
            </div>
          </div>
          {activeAccordion === 'diary' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'diary' && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-4 animate-fadeIn">
            <div className="space-y-2">
              {incidentDiary.logs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-ink">{log.location}</span>
                      <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 font-mono text-[10px] rounded font-bold">
                        {log.year} Monsoon
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{log.notes}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = incidentDiary.logs.filter(l => l.id !== log.id);
                      updateSection('incidentDiary', { logs: updated });
                    }}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Log Form */}
            <div className="p-3 bg-canvas rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Danger Spot (e.g. Hindmata, Kurla LBS)"
                value={newLog.location}
                onChange={e => setNewLog({ ...newLog, location: e.target.value })}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white flex-1"
              />
              <input
                type="text"
                placeholder="Water depth / experience notes..."
                value={newLog.notes}
                onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white flex-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newLog.location) return;
                  const item = { ...newLog, id: 'inc-' + Date.now() };
                  updateSection('incidentDiary', { logs: [...incidentDiary.logs, item] });
                  setNewLog({ year: '2026', location: '', notes: '' });
                  speakAlert(`Added ${item.location} to your historical danger hotspots.`);
                }}
                className="px-3 py-1.5 bg-purple-primary text-white text-xs font-bold rounded-lg hover:bg-purple-deep transition shrink-0"
              >
                Add Spot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

