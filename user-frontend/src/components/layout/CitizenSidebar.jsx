import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useFlood } from '../../context/FloodContext';
import { 
  ShieldCheck,
  MapPin,
  Clock,
  Compass,
  Navigation,
  Building,
  Camera,
  FileText,
  Users,
  Heart,
  AlertTriangle,
  PhoneCall,
  BookOpen,
  History,
  Cpu,
  Sliders,
  Layers,
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import HydroSenseLogo from '../shared/HydroSenseLogo';

export const CATEGORIZED_NAV = [
  {
    category: 'Live Nowcast & Maps',
    items: [
      { path: '/', num: '01', label: 'Safety Overview', icon: ShieldCheck },
      { path: '/live-map', num: '02', label: 'Live Flood Map', icon: MapPin, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-700' },
      { path: '/forecast', num: '03', label: '0–3h Forecast Timeline', icon: Clock, badge: '0-3h', badgeColor: 'bg-purple-primary/20 text-purple-deep' },
      { path: '/locations', num: '04', label: 'Location Risk Profiler', icon: Compass },
      { path: '/scanner', num: '05', label: 'Place & Mall Scanner', icon: Layers }
    ]
  },
  {
    category: 'Mobility & Dry Routes',
    items: [
      { path: '/route', num: '06', label: 'Flood-Aware Route', icon: Navigation },
      { path: '/hud', num: '07', label: 'Turn-by-Turn Drive HUD', icon: Radio, badge: 'HUD', badgeColor: 'bg-purple-primary text-white font-bold' },
      { path: '/safe-places', num: '08', label: 'Safe Places & Shelters', icon: Building, badge: 'DRY CORRIDORS', badgeColor: 'bg-emerald-100 text-emerald-800' }
    ]
  },
  {
    category: 'Community & Reporting',
    items: [
      { path: '/report', num: '09', label: 'Report Water / Hazard', icon: Camera, highlight: true },
      { path: '/my-reports', num: '10', label: 'My Incident Reports', icon: FileText, badge: 'TRACK', badgeColor: 'bg-slate-100 text-slate-700' },
      { path: '/community', num: '11', label: 'Community Sensor Map', icon: Users },
      { path: '/family-safety', num: '12', label: 'Family Safety Circle', icon: Heart }
    ]
  },
  {
    category: 'Crisis & Emergency',
    items: [
      { path: '/alerts', num: '13', label: 'Urgent Citizen Alerts', icon: AlertTriangle, badge: '4 ACTIVE', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
      { path: '/emergency', num: '14', label: 'Emergency SOS Console', icon: PhoneCall, badge: '1916', badgeColor: 'bg-red-600 text-white font-bold animate-pulse', isEmergency: true },
      { path: '/safety-guide', num: '15', label: 'Flood Survival Physics', icon: BookOpen }
    ]
  },
  {
    category: 'Intelligence & Settings',
    items: [
      { path: '/replay', num: '16', label: 'Historical Event Replay', icon: History },
      { path: '/models', num: '17', label: '15-Model AI Hub', icon: Cpu, badge: '15 AI', badgeColor: 'bg-purple-soft text-purple-deep font-bold' },
      { path: '/profile', num: '18', label: 'Vehicle Clearance & Profile', icon: Sliders }
    ]
  }
];

export default function CitizenSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentWard } = useFlood();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Rail Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } select-none shadow-sm`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <HydroSenseLogo variant="full" onClick={onClose} />

            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-muted hover:text-ink hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ward Telemetry Micro-Pill */}
          <div className="px-4 py-2.5 bg-canvas/80 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-muted">Ward: <strong className="text-ink">{currentWard?.name || 'F-North'}</strong></span>
            </div>
            <span className="text-[10px] font-mono text-purple-primary font-bold bg-purple-soft px-2 py-0.5 rounded-full">
              0–3h Nowcast
            </span>
          </div>

          {/* Categorized Navigation Tree */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin">
            {CATEGORIZED_NAV.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                {/* Section Header */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted flex items-center justify-between">
                  <span>{sec.category}</span>
                  <span className="text-[9px] text-slate-400">0{idx + 1}</span>
                </div>

                {/* Section Links */}
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || 
                      (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`min-h-11 lg:min-h-0 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all relative text-left group ${
                          item.isEmergency
                            ? isActive 
                              ? 'bg-red-600 text-white font-bold shadow-sm'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200'
                            : isActive
                            ? 'bg-purple-primary text-white font-semibold shadow-sm'
                            : 'text-slate-600 hover:text-ink hover:bg-slate-50'
                        }`}
                      >
                        {/* Active vertical accent tick */}
                        {isActive && !item.isEmergency && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-purple-deep rounded-r" />
                        )}

                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`font-mono text-[10px] ${
                            isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {item.num}
                          </span>
                          <Icon className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : item.isEmergency ? 'text-red-600' : 'text-purple-primary group-hover:text-purple-deep'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Fast Action SOS Card */}
        <div className="p-3 border-t border-slate-100 bg-canvas">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">BMC Disaster SOS</span>
                <a href="tel:1916" className="text-sm font-mono font-extrabold text-red-600 hover:underline">1916 / 108</a>
              </div>
            </div>

            <Link 
              to="/emergency" 
              onClick={onClose}
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-mono text-[10px] font-bold rounded-lg transition-colors"
            >
              SOS Hub
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
