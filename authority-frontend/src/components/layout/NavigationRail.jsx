import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useFloodCommand } from '../../context/FloodCommandContext';
import {
  LayoutDashboard,
  MapPin,
  CloudRain,
  GitBranch,
  Waves,
  AlertTriangle,
  Building2,
  ShieldAlert,
  Navigation2,
  Bell,
  SlidersHorizontal,
  History,
  BrainCircuit,
  Activity,
  Settings,
  Wrench,
  Camera,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react';

// Categorized Navigation Structure
export const NAV_CATEGORIES = [
  {
    category: 'COMMAND & MONITORING',
    items: [
      { path: '/command', num: '01', label: 'Command Center', icon: LayoutDashboard },
      { path: '/live-map', num: '02', label: 'Live Flood Map', icon: MapPin },
      { path: '/nowcast', num: '03', label: 'Rainfall Nowcast', icon: CloudRain },
    ],
  },
  {
    category: 'HYDROLOGY & DRAINAGE TWIN',
    items: [
      { path: '/drainage', num: '04', label: 'Drainage Network', icon: GitBranch },
      { path: '/surface-flow', num: '05', label: 'Surface Flow Model', icon: Waves },
      { path: '/hotspots', num: '06', label: 'Flood Hotspots', icon: AlertTriangle },
      {
        path: '/intervention-lab',
        num: '16',
        label: 'Intervention Lab',
        icon: Wrench,
        highlight: true,
      },
    ],
  },
  {
    category: 'EMERGENCY RESPONSE & ASSETS',
    items: [
      { path: '/infrastructure', num: '07', label: 'Critical Assets', icon: Building2 },
      {
        path: '/incidents',
        num: '08',
        label: 'Incident Response',
        icon: ShieldAlert,
        badgeKey: 'incidents',
        badgeColor: 'bg-status-alert text-white',
      },
      { path: '/mobility', num: '09', label: 'Safe Routing', icon: Navigation2 },
      {
        path: '/alerts',
        num: '10',
        label: 'Alerts & Warnings',
        icon: Bell,
        badgeKey: 'alerts',
        badgeColor: 'bg-purple-soft text-purple-deep',
      },
    ],
  },
  {
    category: 'SENSORS & SIMULATION',
    items: [
      {
        path: '/cctv-vision',
        num: '17',
        label: 'CCTV & Sensor Vision',
        icon: Camera,
        highlight: true,
      },
      { path: '/scenario-lab', num: '11', label: 'Scenario Simulator', icon: SlidersHorizontal },
      { path: '/historical', num: '12', label: 'Historical Analytics', icon: History },
      { path: '/models', num: '13', label: 'Model Intelligence', icon: BrainCircuit },
    ],
  },
  {
    category: 'SYSTEM & ADMINISTRATION',
    items: [
      { path: '/system-health', num: '14', label: 'Data & System Health', icon: Activity },
      { path: '/admin', num: '15', label: 'Authority Admin', icon: Settings },
    ],
  },
];

// Flattened items for lookup by TopUtilityBar
export const NAV_ITEMS = NAV_CATEGORIES.flatMap((c) => c.items);

export default function NavigationRail() {
  const location = useLocation();
  const { incidentList, alertsList } = useFloodCommand();
  const isCitizenView = location.pathname === '/citizen-view';

  return (
    <aside className="w-[260px] flex-shrink-0 h-screen bg-surface border-r border-border flex flex-col justify-between z-40 select-none">
      {/* Top Section */}
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {/* Branding */}
        <Link
          to="/command"
          className="p-4 border-b border-border flex items-center gap-3 block hover:bg-surface-secondary/50 transition-colors flex-shrink-0"
        >
          {/* Custom geometric water contour logo */}
          <div className="w-9 h-9 rounded-lg bg-purple flex items-center justify-center text-white shadow-subtle flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 7v5l3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="14" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-ink">UrbanFlood</span>
              <span className="text-[10px] bg-purple-soft text-purple-deep px-1.5 py-0.5 rounded font-mono font-semibold">
                CMD
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary font-medium uppercase tracking-wider">
              Municipal Operations
            </p>
          </div>
        </Link>

        {/* Dual Portal Switcher Banner */}
        <div className="px-3 pt-3 flex-shrink-0">
          <Link
            to={isCitizenView ? '/command' : '/citizen-view'}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors border ${
              isCitizenView
                ? 'bg-status-safe-soft text-status-safe border-status-safe/30 hover:bg-status-safe/20'
                : 'bg-surface-secondary text-ink hover:border-purple/40 border-border'
            }`}
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="w-3.5 h-3.5 text-purple" />
              <span>{isCitizenView ? 'Switch to Authority View' : 'Preview Citizen View'}</span>
            </span>
            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/70">
              {isCitizenView ? 'CITIZEN' : 'GOV'}
            </span>
          </Link>
        </div>

        {/* Categorized Navigation List (Scrollable) */}
        <nav className="p-2 space-y-3 overflow-y-auto flex-1 mt-1">
          {NAV_CATEGORIES.map((section) => (
            <div key={section.category} className="space-y-0.5">
              {/* Category Header */}
              <div className="px-3 pt-1.5 pb-1 flex items-center justify-between">
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-ink-muted font-bold">
                  {section.category}
                </span>
              </div>

              {/* Category Nav Items */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const badge =
                  item.badgeKey === 'incidents'
                    ? incidentList.filter((i) => i.status.includes('PENDING')).length || '4'
                    : item.badgeKey === 'alerts'
                    ? alertsList.length
                    : null;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all relative text-left group ${
                        isActive
                          ? 'bg-purple-soft text-purple font-semibold shadow-subtle'
                          : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active vertical purple bar indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-purple rounded-r" />
                        )}

                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className={`font-mono text-[10px] ${
                              isActive ? 'text-purple font-bold' : 'text-ink-muted'
                            }`}
                          >
                            {item.num}
                          </span>
                          <Icon
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isActive
                                ? 'text-purple'
                                : 'text-ink-secondary group-hover:text-ink'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {badge && (
                          <span
                            className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                              item.badgeColor || 'bg-surface-secondary text-ink-secondary'
                            }`}
                          >
                            {badge}
                          </span>
                        )}

                        {item.highlight && !isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-purple"
                            title="Integrated Intelligence Feature"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Authority Footer */}
      <div className="p-3 border-t border-border bg-surface-subtle flex-shrink-0">
        <div className="p-2 bg-surface rounded-lg border border-border flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink">MCGM Emergency Ops</span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-status-safe">
              <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse" />
              98.7%
            </span>
          </div>
          <div className="text-[10px] text-ink-secondary flex items-center justify-between">
            <span>Disaster Control Cell</span>
            <span className="font-mono text-[10px] text-purple font-semibold">STATION 04</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
