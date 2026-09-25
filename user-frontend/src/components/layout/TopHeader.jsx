import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFlood } from '../../context/FloodContext';
import { 
  Menu, 
  MapPin, 
  ChevronDown, 
  Bell, 
  Volume2, 
  VolumeX, 
  Eye, 
  Wifi, 
  WifiOff, 
  ShieldAlert,
  AlertTriangle,
  Radio
} from 'lucide-react';
import HydroSenseLogo from '../shared/HydroSenseLogo';
import { WARDS_DATA } from '../../data/floodData';

export default function TopHeader({ onToggleSidebar }) {
  const location = useLocation();
  const { 
    selectedWardId, 
    setSelectedWardId, 
    isVoiceEnabled, 
    setIsVoiceEnabled, 
    isHighContrast, 
    setIsHighContrast,
    isOfflineMode,
    setIsOfflineMode,
    notificationCount,
    speakAlert
  } = useFlood();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const selectedWard = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];

  const handleVoiceToggle = () => {
    const nextState = !isVoiceEnabled;
    setIsVoiceEnabled(nextState);
    if (nextState) {
      speakAlert("Voice Safety Mode activated. Spoken flood warnings enabled.");
    }
  };

  // Human-readable titles mapped to paths
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Safety Overview';
      case '/live-map': return 'Live Flood Map & Spatial GIS';
      case '/forecast': return '0–3h Forecast Nowcast Timeline';
      case '/locations': return 'Location Risk & Catchment Profiler';
      case '/scanner': return 'Place & Mall Ingress Scanner';
      case '/route': return 'Flood-Aware Safe Mobility Routing';
      case '/hud': return 'Active In-Cab Turn-by-Turn HUD';
      case '/safe-places': return 'Safe Places & Vetted High-Ground Shelters';
      case '/report': return 'Report Waterlogging & Street Hazards';
      case '/my-reports': return 'Incident Reports & Resolution Stepper';
      case '/community': return 'Community Ground Truth & Sensor Mesh';
      case '/family-safety': return 'Family Safety Circle & Geofence Radar';
      case '/alerts': return 'Urgent Citizen Alerts & BMC Directives';
      case '/emergency': return 'Emergency Center & SOS Console';
      case '/safety-guide': 
      case '/safety-guides': return 'Flood Survival Physics & Depth Guide';
      case '/replay': return 'Historical Cloudburst Event Replay';
      case '/models': return '15-Model AI & Simulation Architecture Hub';
      case '/profile': return 'Vehicle Clearance & Profile Preferences';
      default: return 'HydroSense';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Telemetry & Accessibility Strip */}
      <div className="bg-canvas border-b border-slate-200/60 px-4 py-1 text-xs text-muted flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-purple-primary">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            LIVE METROPOLITAN RADAR (0–3h)
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline font-mono text-[11px] text-slate-500">
            DGMR Nowcast + SWMM-LISFLOOD • Assimilated 2m ago
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          {/* Offline Mode Toggle */}
          <button 
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              isOfflineMode ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:text-ink text-slate-500'
            }`}
            title="Toggle Offline Simulation Mode"
          >
            {isOfflineMode ? <WifiOff className="w-3 h-3 text-amber-600" /> : <Wifi className="w-3 h-3 text-emerald-600" />}
            <span className="hidden sm:inline">{isOfflineMode ? 'OFFLINE CACHE' : 'ONLINE MESH'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button 
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
              isHighContrast ? 'bg-ink text-white font-bold' : 'hover:text-ink text-slate-500'
            }`}
            title="Toggle High Contrast for Sunlight / Rain Glare"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">CONTRAST</span>
          </button>

          {/* Voice Alerts Toggle */}
          <button 
            onClick={handleVoiceToggle}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
              isVoiceEnabled ? 'text-purple-primary font-semibold' : 'text-slate-500 hover:text-ink'
            }`}
            title="Toggle Spoken Voice Flood Alerts"
          >
            {isVoiceEnabled ? <Volume2 className="w-3 h-3 text-purple-primary" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline">VOICE {isVoiceEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Top Header Bar */}
      <div className="px-2 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
        {/* Left: Mobile Sidebar Hamburger + Brand on mobile + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden min-h-11 min-w-11 p-2 rounded-xl text-slate-600 hover:text-ink hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Compact brand logo visible on mobile/tablet */}
          <div className="lg:hidden shrink-0 sm:hidden">
            <HydroSenseLogo variant="icon-only" size="sm" showBadge={false} />
          </div>
          <div className="hidden sm:block lg:hidden shrink-0">
            <HydroSenseLogo variant="compact" size="sm" showBadge={false} />
          </div>

          <div className="hidden lg:block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">Citizen Safety Portal</span>
            <h1 className="text-base sm:text-lg font-bold text-ink truncate leading-tight">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </div>

        {/* Right Actions: Ward Selector, Notifications, Report Hazard CTA, Profile */}
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          {/* Ward Selector */}
          <div className="relative">
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="min-h-11 lg:min-h-0 max-w-[112px] sm:max-w-none appearance-none bg-canvas hover:bg-slate-100 border border-slate-200 rounded-xl pl-7 sm:pl-8 pr-6 sm:pr-8 py-2.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-purple-primary transition shadow-2xs"
            >
              {WARDS_DATA.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-purple-primary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="min-h-11 min-w-11 p-2.5 rounded-xl text-slate-600 hover:text-ink hover:bg-slate-100 border border-slate-200 relative transition-colors shadow-2xs"
              title="Notifications & Directives"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold font-mono flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1rem))] sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn"
                onMouseLeave={() => setIsNotificationsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Active Flood Alerts (3)
                  </span>
                  <Link 
                    to="/alerts" 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[11px] text-purple-primary hover:underline font-semibold"
                  >
                    View All
                  </Link>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                    <div className="font-bold text-red-800">Critical: Andheri Subway Closed</div>
                    <div className="text-red-700 text-[11px] mt-0.5">Water depth exceeds 34cm. Divert via Gokhale Flyover.</div>
                    <div className="text-red-500 font-mono text-[10px] mt-1">20:41 IST • Valid 2h</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="font-bold text-amber-800">Warning: Kurla Surcharge</div>
                    <div className="text-amber-700 text-[11px] mt-0.5">L.B.S. Marg drains at 94% capacity. Avoid curb lanes.</div>
                    <div className="text-amber-600 font-mono text-[10px] mt-1">20:25 IST</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick "Report Hazard" Button */}
          <Link
            to="/report"
            className="hidden sm:flex items-center gap-1.5 bg-purple-primary hover:bg-purple-deep text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report Hazard</span>
          </Link>

          {/* Profile Badge Link */}
          <Link
            to="/profile"
            className={`min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-colors ${
              location.pathname === '/profile' 
                ? 'bg-purple-primary text-white border-purple-primary shadow-xs' 
                : 'bg-canvas text-ink hover:bg-slate-100 border-slate-200'
            }`}
            title="Profile & Settings"
          >
            {(() => {
              try {
                const saved = localStorage.getItem('citizen_profile_v2');
                if (saved) {
                  const parsed = JSON.parse(saved);
                  if (parsed.identity?.name) {
                    return parsed.identity.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  }
                }
              } catch (e) {}
              return 'RD';
            })()}
          </Link>
        </div>
      </div>
    </header>
  );
}
