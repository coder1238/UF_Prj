import React, { useState, useEffect, useMemo } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Bell, AlertTriangle, ShieldAlert, CheckCircle2, Volume2, 
  MapPin, Clock, Filter, ArrowRight, Share2, Radio, PhoneCall,
  Search, Sliders, RefreshCw, Car, CheckSquare, Square,
  Activity, Camera, Radar, ShieldCheck, Printer, Settings,
  Users, ChevronDown, Sparkles, Layers, CloudRain, Waves,
  GitCommit, AlertOctagon, HelpCircle, HardDriveDownload
} from 'lucide-react';

import { INITIAL_ALERTS, HAZARD_CATEGORIES, WARDS_LIST } from '../../data/alertsData';

// Modals and Features
import AlertAudioPlayer from '../alerts/AlertAudioPlayer';
import AlertShareModal from '../alerts/AlertShareModal';
import AlertGeofenceRadarModal from '../alerts/AlertGeofenceRadarModal';
import AlertTelemetryHydrographModal from '../alerts/AlertTelemetryHydrographModal';
import AlertCctvModal from '../alerts/AlertCctvModal';
import AlertSirenTestModal from '../alerts/AlertSirenTestModal';
import AlertWardContactsModal from '../alerts/AlertWardContactsModal';
import AlertCitizenVerificationModal from '../alerts/AlertCitizenVerificationModal';
import AlertBulletinExportModal from '../alerts/AlertBulletinExportModal';
import AlertPreferencesModal from '../alerts/AlertPreferencesModal';
import AlertSimulateModal from '../alerts/AlertSimulateModal';

export default function AlertCenter() {
  const { currentWard, speakAlert, vehicleType, clearanceThreshold } = useFlood();
  const { navigateTo } = useNavigation();

  // Persistent alerts state
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('citizen_active_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch (e) {
      return INITIAL_ALERTS;
    }
  });

  // Save alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('citizen_active_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [alerts]);

  // View state & filters
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'acknowledged'
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedHazard, setSelectedHazard] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('severity'); // 'severity' | 'newest' | 'depth'

  // Multi-Language state ('en' | 'mr' | 'hi')
  const [language, setLanguage] = useState('en');

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'share' | 'radar' | 'telemetry' | 'cctv' | 'siren' | 'contacts' | 'verification' | 'bulletin' | 'preferences' | 'simulate'
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAudioDigest, setShowAudioDigest] = useState(false);
  const [speakingAlertId, setSpeakingAlertId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state for Feature 15
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Trigger brief floating toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Acknowledge single alert
  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          acknowledged: true,
          acknowledgedAt: 'Just now'
        };
      }
      return a;
    }));
    showToast('Alert moved to Acknowledged / Archive.');
  };

  // Un-acknowledge (restore)
  const handleRestore = (id) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          acknowledged: false,
          acknowledgedAt: null
        };
      }
      return a;
    }));
    showToast('Alert restored to Active Urgencies.');
  };

  // Mark all active alerts as acknowledged
  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true, acknowledgedAt: 'Just now' })));
    showToast('All active alerts marked as acknowledged.');
  };

  // Toggle individual checklist item
  const handleToggleDirective = (alertId, dirIndex) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        const checked = { ...(a.userCheckedDirectives || {}) };
        checked[dirIndex] = !checked[dirIndex];
        return { ...a, userCheckedDirectives: checked };
      }
      return a;
    }));
  };

  // Avoid on route handler
  const handleAvoidOnRoute = (alert) => {
    try {
      sessionStorage.setItem('route_hazard_avoid', JSON.stringify({
        id: alert.id,
        title: alert.title,
        coordinates: alert.coordinates,
        waterDepth: alert.waterDepth,
        ward: alert.ward
      }));
    } catch (e) {}
    showToast(`Avoiding ${alert.title.split(':')[0]} on Route Planner.`);
    setTimeout(() => {
      navigateTo('route');
    }, 600);
  };

  // Family broadcast trigger
  const handleFamilyPing = (alert) => {
    try {
      const familyMsg = {
        alertId: alert.id,
        ward: alert.ward,
        message: `Safety ping: I am aware of the ${alert.severity} alert in ${alert.ward}. Safe and taking precautions.`,
        timestamp: Date.now()
      };
      localStorage.setItem('citizen_last_family_ping', JSON.stringify(familyMsg));
    } catch (e) {}
    showToast(`Safety ping broadcasted to your Family Circle for ${alert.ward}!`);
  };

  // Single alert speech synthesis
  const handleSpeakAlert = (alert) => {
    if (speakingAlertId === alert.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingAlertId(null);
      return;
    }

    setSpeakingAlertId(alert.id);
    let textToSpeak = alert.soundAlert;
    if (language === 'mr' && alert.translations?.mr) {
      textToSpeak = alert.translations.mr.soundAlert;
    } else if (language === 'hi' && alert.translations?.hi) {
      textToSpeak = alert.translations.hi.soundAlert;
    }

    speakAlert(textToSpeak);
    setTimeout(() => setSpeakingAlertId(null), 7000);
  };

  // Force sync simulation (Feature 15)
  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast('Alert cache re-synchronized with BMC Central Dispatch.');
    }, 800);
  };

  // Filter & Sort Logic
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        // Tab filter
        if (activeTab === 'active' && alert.acknowledged) return false;
        if (activeTab === 'acknowledged' && !alert.acknowledged) return false;

        // Severity filter
        if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;

        // Ward filter
        if (selectedWard !== 'all') {
          if (alert.ward !== selectedWard && !alert.ward.includes(selectedWard)) return false;
        }

        // Hazard Category filter
        if (selectedHazard !== 'all') {
          if (alert.hazardCategory && alert.hazardCategory !== selectedHazard) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = alert.title?.toLowerCase().includes(q);
          const matchMsg = alert.message?.toLowerCase().includes(q);
          const matchWard = alert.ward?.toLowerCase().includes(q);
          const matchDirectives = alert.directives?.some(d => d.toLowerCase().includes(q));
          if (!matchTitle && !matchMsg && !matchWard && !matchDirectives) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity') {
          const rank = { critical: 4, danger: 3, caution: 2, advisory: 1 };
          return (rank[b.severity] || 0) - (rank[a.severity] || 0);
        }
        if (sortBy === 'depth') {
          return (b.waterDepth || 0) - (a.waterDepth || 0);
        }
        // newest
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
  }, [alerts, activeTab, selectedSeverity, selectedWard, selectedHazard, searchQuery, sortBy]);

  // Severity badge helper
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-500 text-white', ring: 'border-red-300 ring-1 ring-red-200/80', label: 'RED ALERT (CRITICAL)' };
      case 'danger':
        return { bg: 'bg-amber-600 text-white', ring: 'border-amber-300 ring-1 ring-amber-200/80', label: 'ORANGE ALERT (DANGER)' };
      case 'caution':
        return { bg: 'bg-amber-100 text-amber-900 border border-amber-300', ring: 'border-amber-200', label: 'YELLOW ADVISORY' };
      default:
        return { bg: 'bg-purple-100 text-purple-900 border border-purple-200', ring: 'border-slate-200', label: 'CIVIC NOTICE' };
    }
  };

  // Vehicle passability analysis (Feature 9)
  const getVehiclePassability = (waterDepthCm) => {
    const userClearance = clearanceThreshold || 15;
    const diff = waterDepthCm - userClearance;

    if (diff > 15) {
      return {
        status: 'UNSAFE / STALL HAZARD',
        color: 'text-red-700 bg-red-100 border-red-300',
        note: `Depth exceeds your ${vehicleType} clearance by ${diff}cm. Air intake and tailpipe submersion expected.`
      };
    } else if (diff > 0) {
      return {
        status: 'MARGINAL PASSABILITY',
        color: 'text-amber-800 bg-amber-100 border-amber-300',
        note: `Exceeds clearance by ${diff}cm. Drive only along central road crown.`
      };
    } else {
      return {
        status: 'VEHICLE PASSABLE',
        color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        note: `Water depth (${waterDepthCm}cm) is safely within your ${vehicleType} threshold (${userClearance}cm).`
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-purple-100">
      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-500/40 text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Broadcast Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" /> Live Disaster Control Warning Broadcast
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight flex items-center gap-3">
            Urgent Citizen Alerts & Directives
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Official geofenced flood warnings, waterlogging telemetry, and survival directives from BMC Disaster Control & Municipal Nowcasting.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Multi-language selector (Feature 2) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                language === 'en' ? 'bg-purple-primary text-white' : 'text-slate-600 hover:text-ink'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                language === 'mr' ? 'bg-purple-primary text-white' : 'text-slate-600 hover:text-ink'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                language === 'hi' ? 'bg-purple-primary text-white' : 'text-slate-600 hover:text-ink'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Audio Digest Toggle */}
          <button 
            onClick={() => setShowAudioDigest(!showAudioDigest)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              showAudioDigest 
                ? 'bg-purple-primary text-white border-purple-primary shadow-sm' 
                : 'bg-purple-50 hover:bg-purple-100 text-purple-primary border-purple-200'
            }`}
          >
            <Volume2 className="w-4 h-4" /> {showAudioDigest ? 'Hide Audio Digest' : 'Audio Digest'}
          </button>

          {/* Test Siren & Alarms (Feature 3) */}
          <button 
            onClick={() => setActiveModal('siren')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Radio className="w-4 h-4 text-amber-600" /> Test Siren
          </button>

          {/* Simulate Alert Broadcast (Feature 13) */}
          <button 
            onClick={() => setActiveModal('simulate')}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Simulate incoming alert"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-primary" /> Simulate Drill
          </button>

          {/* Notification Preferences (Feature 11) */}
          <button 
            onClick={() => setActiveModal('preferences')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Configure Alert Rules"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Emergency SOS 1916 */}
          <button 
            onClick={() => navigateTo('emergency')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" /> SOS 1916
          </button>
        </div>
      </div>

      {/* Audio Digest Floating / Inline Player */}
      {showAudioDigest && (
        <AlertAudioPlayer 
          alerts={alerts}
          currentLanguage={language}
          onClose={() => setShowAudioDigest(false)}
        />
      )}

      {/* Offline & Server Cache Status Strip (Feature 15) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-600">
          <HardDriveDownload className="w-4 h-4 text-purple-primary" />
          <span>Offline Ready: <strong className="text-ink">{alerts.length} bulletins cached</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Last Synced: {lastSyncTime}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="text-purple-primary hover:text-purple-deep flex items-center gap-1 font-bold text-[11px] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /> Force Server Sync
          </button>

          {alerts.filter(a => !a.acknowledged).length > 0 && activeTab === 'active' && (
            <button
              onClick={handleAcknowledgeAll}
              className="text-slate-600 hover:text-ink text-[11px] font-semibold underline decoration-slate-300"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Search, Ward, and Hazard Filters (Feature 14) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 space-y-4">
        {/* Search bar + Ward dropdown + Sort dropdown */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by location, subway, railway line, or directive keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-canvas border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-purple-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Ward Selector Dropdown */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-canvas border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-primary cursor-pointer w-full md:w-auto"
            >
              {WARDS_LIST.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-canvas border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-primary cursor-pointer shrink-0"
            >
              <option value="severity">Sort: Highest Severity</option>
              <option value="depth">Sort: Deepest Water</option>
              <option value="newest">Sort: Most Recent</option>
            </select>
          </div>
        </div>

        {/* Hazard Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {HAZARD_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedHazard(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium text-xs transition-all flex items-center gap-1.5 ${
                selectedHazard === cat.id
                  ? 'bg-purple-primary text-white shadow-sm'
                  : 'bg-canvas border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Tab Switcher & Severity Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'active' 
                ? 'bg-ink text-white shadow-sm' 
                : 'bg-canvas text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Active Urgencies</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-600 text-white">
              {alerts.filter(a => !a.acknowledged).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('acknowledged')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'acknowledged' 
                ? 'bg-ink text-white shadow-sm' 
                : 'bg-canvas text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Acknowledged / Archive</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700">
              {alerts.filter(a => a.acknowledged).length}
            </span>
          </button>
        </div>

        {/* Severity Badge Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'critical', 'danger', 'caution', 'advisory'].map(sev => {
            const count = sev === 'all' 
              ? alerts.filter(a => activeTab === 'active' ? !a.acknowledged : a.acknowledged).length
              : alerts.filter(a => (activeTab === 'active' ? !a.acknowledged : a.acknowledged) && a.severity === sev).length;

            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition-all flex items-center gap-1.5 ${
                  selectedSeverity === sev 
                    ? 'bg-purple-primary text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-muted hover:text-ink'
                }`}
              >
                <span>{sev}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSeverity === sev ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-ink">No Alerts Match Selected Filters</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              All monitored flood warnings for this category have been acknowledged or no hazards meet the active criteria.
            </p>
            <button
              onClick={() => {
                setSelectedSeverity('all');
                setSelectedWard('all');
                setSelectedHazard('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary font-bold text-xs border border-purple-200 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const badge = getSeverityBadge(alert.severity);
            const passability = getVehiclePassability(alert.waterDepth);
            const checkedDirectivesCount = Object.values(alert.userCheckedDirectives || {}).filter(Boolean).length;
            const totalDirectivesCount = alert.directives?.length || 0;

            // Localized text rendering
            const displayTitle = language === 'mr' && alert.translations?.mr?.title 
              ? alert.translations.mr.title 
              : language === 'hi' && alert.translations?.hi?.title
              ? alert.translations.hi.title
              : alert.title;

            const displayMessage = language === 'mr' && alert.translations?.mr?.message
              ? alert.translations.mr.message
              : language === 'hi' && alert.translations?.hi?.message
              ? alert.translations.hi.message
              : alert.message;

            const displayDirectives = language === 'mr' && alert.translations?.mr?.directives
              ? alert.translations.mr.directives
              : language === 'hi' && alert.translations?.hi?.directives
              ? alert.translations.hi.directives
              : alert.directives;

            return (
              <div 
                key={alert.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all ${
                  alert.severity === 'critical' 
                    ? 'border-red-300 shadow-md ring-1 ring-red-200/80' 
                    : alert.severity === 'danger'
                    ? 'border-amber-300 shadow-sm'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Top Row: Severity, Ward, Time, and Valid Until */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-muted flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-purple-primary" /> Ward {alert.ward}
                    </span>
                    {alert.hazardCategory && (
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {alert.hazardCategory}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {alert.issuedAt}
                    </span>
                    <span className="text-purple-primary font-bold">Valid: {alert.validUntil}</span>
                  </div>
                </div>

                {/* Title & Measured Depth Block */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-ink leading-snug">
                      {displayTitle}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {displayMessage}
                    </p>
                  </div>

                  {/* Water Depth Box */}
                  <div className="bg-canvas border border-slate-200 px-4 py-3 rounded-2xl shrink-0 text-center sm:min-w-[120px]">
                    <span className="text-[10px] font-mono uppercase text-muted block">Measured Depth</span>
                    <span className="text-2xl font-mono font-black text-red-600">{alert.waterDepth} cm</span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      {alert.waterDepthTrend || 'Sensor Active'}
                    </span>
                  </div>
                </div>

                {/* Vehicle Clearance Compatibility Strip (Feature 9) */}
                <div className={`p-3 rounded-2xl border mb-4 flex items-center justify-between gap-3 text-xs ${passability.color}`}>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="font-mono font-black uppercase tracking-wider block">
                        {passability.status} (Your vehicle: {vehicleType.toUpperCase()})
                      </span>
                      <p className="text-[11px] leading-tight mt-0.5 opacity-90">
                        {passability.note}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold shrink-0 uppercase underline decoration-current cursor-pointer"
                    onClick={() => navigateTo('profile')}
                  >
                    Adjust Clearance &rarr;
                  </span>
                </div>

                {/* Interactive Actionable Safety Directives Checklist */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-purple-primary" /> Actionable Safety Directives Checklist:
                    </span>
                    <span className="text-[11px] font-mono text-purple-primary font-bold">
                      {checkedDirectivesCount} of {totalDirectivesCount} Completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {displayDirectives?.map((dir, idx) => {
                      const isChecked = !!(alert.userCheckedDirectives && alert.userCheckedDirectives[idx]);
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleToggleDirective(alert.id, idx)}
                          className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors text-xs ${
                            isChecked ? 'bg-purple-100/50 text-purple-950 line-through opacity-80' : 'hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <button 
                            type="button" 
                            className="mt-0.5 shrink-0 text-purple-primary"
                          >
                            {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                          </button>
                          <span className="leading-relaxed select-none">{dir}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contextual Nearest Safe Shelter Recommendation (Feature 6) */}
                {alert.shelterRecommendation && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 my-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
                          Nearest High-Ground Safe Haven • {alert.shelterRecommendation.distance}
                        </span>
                        <span className="font-bold text-ink text-xs block">
                          {alert.shelterRecommendation.name} ({alert.shelterRecommendation.elevation})
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          {alert.shelterRecommendation.address} • <strong className="text-emerald-700">{alert.shelterRecommendation.capacity}</strong>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo('safe-places')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                    >
                      View Shelter Pass &rarr;
                    </button>
                  </div>
                )}

                {/* Feature Toolbar Buttons on Each Alert */}
                <div className="py-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                  {/* Radar & Geofence (Feature 1) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('radar');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Radar className="w-3.5 h-3.5 text-purple-primary" /> Radar Geofence
                  </button>

                  {/* Telemetry Hydrograph (Feature 7) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('telemetry');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-sky-600" /> Sensor Hydrograph
                  </button>

                  {/* CCTV View (Feature 8) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('cctv');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-600" /> Live CCTV
                  </button>

                  {/* Ward Control Desk Direct Lines (Feature 4) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('contacts');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Ward Helplines
                  </button>

                  {/* Ground Truth Verification (Feature 5) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('verification');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-primary font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ground Check ({alert.crowdsourced?.risingVotes || 0})
                  </button>

                  {/* Official Bulletin Export (Feature 10) */}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActiveModal('bulletin');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" /> Bulletin (PDF)
                  </button>

                  {/* Family Ping (Feature 12) */}
                  <button
                    onClick={() => handleFamilyPing(alert)}
                    className="px-2.5 py-1.5 rounded-xl bg-canvas hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                    title="Alert my family about this hazard"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" /> Alert Family
                  </button>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Audio Readout */}
                    <button 
                      onClick={() => handleSpeakAlert(alert)}
                      className={`p-2 rounded-xl text-xs flex items-center gap-1.5 font-medium transition-colors ${
                        speakingAlertId === alert.id 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Speak Alert in selected language"
                    >
                      <Volume2 className={`w-4 h-4 ${speakingAlertId === alert.id ? 'animate-bounce' : 'text-purple-primary'}`} />
                      {speakingAlertId === alert.id ? 'Reading...' : 'Audio Readout'}
                    </button>

                    {/* Share Modal Trigger */}
                    <button 
                      onClick={() => {
                        setSelectedAlert(alert);
                        setActiveModal('share');
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-slate-600" /> Share Alert
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Acknowledge or Restore */}
                    {!alert.acknowledged ? (
                      <button 
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleRestore(alert.id)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-purple-primary hover:bg-purple-50 transition-colors"
                      >
                        Restore to Active
                      </button>
                    )}

                    {/* Avoid on Route */}
                    <button 
                      onClick={() => handleAvoidOnRoute(alert)}
                      className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                    >
                      Avoid on Route <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals rendering */}
      {activeModal === 'share' && selectedAlert && (
        <AlertShareModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'radar' && selectedAlert && (
        <AlertGeofenceRadarModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'telemetry' && selectedAlert && (
        <AlertTelemetryHydrographModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'cctv' && selectedAlert && (
        <AlertCctvModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'siren' && (
        <AlertSirenTestModal 
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'contacts' && selectedAlert && (
        <AlertWardContactsModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'verification' && selectedAlert && (
        <AlertCitizenVerificationModal 
          alert={selectedAlert}
          onUpdateAlert={(updated) => {
            setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
            setSelectedAlert(updated);
          }}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'bulletin' && selectedAlert && (
        <AlertBulletinExportModal 
          alert={selectedAlert}
          onClose={() => {
            setActiveModal(null);
            setSelectedAlert(null);
          }}
        />
      )}

      {activeModal === 'preferences' && (
        <AlertPreferencesModal 
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'simulate' && (
        <AlertSimulateModal 
          onSimulate={(newAlert) => {
            setAlerts(prev => [newAlert, ...prev]);
            showToast(`Simulated Broadcast: "${newAlert.title.split(':')[0]}" received!`);
            speakAlert(newAlert.soundAlert);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
