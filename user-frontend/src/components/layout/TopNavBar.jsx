import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigation } from '../../context/NavigationContext';
import { useFlood } from '../../context/FloodContext';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Bell, 
  User, 
  Volume2, 
  VolumeX, 
  Eye, 
  ChevronDown, 
  Menu, 
  X, 
  Wifi, 
  WifiOff,
  Navigation,
  Layers,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { WARDS_DATA } from '../../data/floodData';

export default function TopNavBar() {
  const { navItems, moreNavItems, navigateTo } = useNavigation();
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

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const selectedWard = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];

  const handleVoiceToggle = () => {
    const nextState = !isVoiceEnabled;
    setIsVoiceEnabled(nextState);
    if (nextState) {
      speakAlert("Voice Safety Mode activated. You will receive spoken flood warnings.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-subtle">
      {/* Top Telemetry & Accessibility Strip */}
      <div className="bg-canvas border-b border-border/60 px-4 py-1 text-xs text-ink-muted flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE RADAR FEED (0-3h)
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="hidden sm:inline font-mono text-[11px]">DGMR Nowcast + SWMM Hydrology v4.2 • Updated 2m ago</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline Mode Toggle */}
          <button 
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${isOfflineMode ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:text-ink'}`}
            title="Toggle Offline Simulation Mode"
          >
            {isOfflineMode ? <WifiOff className="w-3 h-3 text-amber-600" /> : <Wifi className="w-3 h-3 text-emerald-600" />}
            <span className="font-mono text-[11px]">{isOfflineMode ? 'OFFLINE CACHE ACTIVE' : 'ONLINE MESH'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button 
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${isHighContrast ? 'bg-ink text-white font-bold' : 'hover:text-ink'}`}
            title="Toggle High Contrast for Sunlight / Rain"
          >
            <Eye className="w-3 h-3" />
            <span className="font-mono text-[11px]">CONTRAST</span>
          </button>

          {/* Voice Alerts Toggle */}
          <button 
            onClick={handleVoiceToggle}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${isVoiceEnabled ? 'text-primary font-semibold' : 'text-ink-muted hover:text-ink'}`}
            title="Toggle Spoken Voice Flood Alerts"
          >
            {isVoiceEnabled ? <Volume2 className="w-3 h-3 text-primary" /> : <VolumeX className="w-3 h-3" />}
            <span className="font-mono text-[11px]">VOICE {isVoiceEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline with discrete Link to / */}
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            to="/"
            className="flex items-center gap-2.5 text-left group"
          >
            <img src="/branding/hydrosense-icon.png" alt="" aria-hidden="true" className="w-10 h-10 object-contain group-hover:scale-105 transition" />
            <div>
              <div className="font-extrabold text-base tracking-tight text-ink flex items-center gap-1.5">
                HydroSense
              </div>
              <div className="text-[11px] text-ink-muted font-medium">
                Know the water before you meet it.
              </div>
            </div>
          </Link>
        </div>

        {/* Global Ward Selector */}
        <div className="hidden lg:flex items-center shrink-0">
          <div className="relative">
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="appearance-none bg-surface-secondary hover:bg-surface-subtle border border-border rounded-lg pl-8 pr-8 py-1.5 text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-primary transition"
            >
              {WARDS_DATA.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-primary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Navigation Links with React Router NavLink */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `relative px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                item.isEmergency 
                  ? isActive 
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200'
                  : isActive 
                    ? 'bg-primary text-white font-semibold shadow-sm' 
                    : 'text-ink-secondary hover:text-ink hover:bg-canvas'
              }`}
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full uppercase ${
                      isActive ? 'bg-white/20 text-white' : item.isEmergency ? 'bg-red-600 text-white' : 'bg-primary-soft text-primary-deep font-bold'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* More Dropdown for additional pages with React Router Link */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-ink-secondary hover:text-ink hover:bg-canvas ${isMoreMenuOpen ? 'bg-canvas text-ink' : ''}`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-border p-1.5 z-50 space-y-0.5"
                onMouseLeave={() => setIsMoreMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-mono font-bold text-ink-muted uppercase">Additional Features</div>
                {moreNavItems.map(item => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      location.pathname === item.path ? 'bg-primary-soft text-primary-deep font-bold' : 'text-ink hover:bg-canvas'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-canvas border border-border/80 relative"
              title="Notifications"
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
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-border p-3 z-50"
                onMouseLeave={() => setIsNotificationsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Active Flood Alerts (3)
                  </span>
                  <Link 
                    to="/alerts" 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                    <div className="font-bold text-red-800">Critical: Andheri Subway Closed</div>
                    <div className="text-red-700 text-[11px]">Water depth exceeds 34cm. Divert via Gokhale Flyover.</div>
                    <div className="text-red-500 font-mono text-[10px] mt-1">20:41 IST • Valid 2h</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="font-bold text-amber-800">Warning: Kurla Surcharge</div>
                    <div className="text-amber-700 text-[11px]">L.B.S. Marg drains at 94% capacity. Avoid curb lanes.</div>
                    <div className="text-amber-600 font-mono text-[10px] mt-1">20:25 IST</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Emergency Report CTA via Link */}
          <Link
            to="/report"
            className="hidden md:flex items-center gap-1.5 bg-primary text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-card hover:bg-primary-hover transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report Hazard</span>
          </Link>

          {/* Profile / Settings Button via Link */}
          <Link
            to="/profile"
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border transition ${
              location.pathname === '/profile' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-surface-secondary text-ink hover:bg-surface-subtle border-border'
            }`}
            title="Profile & Settings"
          >
            AM
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-canvas border border-border"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-border px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="pb-2 border-b border-border">
            <label className="text-[11px] font-mono text-ink-muted uppercase">Select Monitored Ward</label>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="mt-1 w-full bg-surface-secondary border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink"
            >
              {WARDS_DATA.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[...navItems, ...moreNavItems].map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  location.pathname === item.path ? 'bg-primary text-white font-bold' : item.isEmergency ? 'bg-red-50 text-red-700 font-bold' : 'text-ink hover:bg-canvas'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 rounded bg-black/10">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
