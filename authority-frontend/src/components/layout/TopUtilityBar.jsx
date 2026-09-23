import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFloodCommand } from '../../context/FloodCommandContext';
import { WARDS, ROAD_CORRIDORS, DRAINAGE_NODES, INCIDENTS } from '../../data/floodData';
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  Check,
  MapPin,
  ShieldAlert,
  GitBranch,
  X,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { NAV_ITEMS } from './NavigationRail';

export default function TopUtilityBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedWard, setSelectedWard, alertsList, setMapFocusTarget } = useFloodCommand();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [wardSearch, setWardSearch] = useState('');
  const [riskFilterTab, setRiskFilterTab] = useState('ALL');

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Match current route to find module title and number
  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname) || {
    num: '01',
    label: 'Command Center',
  };

  // Close dropdown on click outside or ESC key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWardDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsWardDropdownOpen(false);
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtered wards for selection menu
  const filteredWards = WARDS.filter((w) => {
    const query = wardSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      w.name.toLowerCase().includes(query) ||
      w.code.toLowerCase().includes(query) ||
      (w.shortName && w.shortName.toLowerCase().includes(query)) ||
      (w.subAreas && w.subAreas.toLowerCase().includes(query)) ||
      (w.zone && w.zone.toLowerCase().includes(query));

    const matchesRisk =
      riskFilterTab === 'ALL' ||
      (riskFilterTab === 'CRITICAL' && w.activeRisk === 'CRITICAL') ||
      (riskFilterTab === 'HIGH' && w.activeRisk === 'HIGH') ||
      (riskFilterTab === 'NORMAL' && (w.activeRisk === 'MODERATE' || w.activeRisk === 'LOW'));

    return matchesSearch && matchesRisk;
  });

  const activeWardObj = WARDS.find((w) => w.id === selectedWard) || WARDS[0];

  // Global search matching results
  const searchResults = searchQuery.trim()
    ? [
        ...ROAD_CORRIDORS.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => ({
          type: 'road',
          title: r.name,
          subtitle: `${r.ward} • ${r.currentDepth}cm depth`,
          coords: [r.coordinates[1], r.coordinates[0]],
          route: '/command',
        })),
        ...DRAINAGE_NODES.filter((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map((n) => ({
          type: 'node',
          title: n.name,
          subtitle: `${n.type} • ${n.status}`,
          coords: [n.coordinates[1], n.coordinates[0]],
          route: '/drainage',
        })),
        ...INCIDENTS.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.location.toLowerCase().includes(searchQuery.toLowerCase())).map((i) => ({
          type: 'incident',
          title: i.title,
          subtitle: `${i.location} • ${i.severity}`,
          coords: [i.coordinates[1], i.coordinates[0]],
          route: '/incidents',
        })),
      ].slice(0, 6)
    : [];

  return (
    <header className="h-[64px] bg-surface border-b border-border px-5 flex items-center justify-between z-30 select-none flex-shrink-0">
      {/* Left: Operational Module Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple animate-pulse" />
          <span className="font-mono text-xs font-bold text-purple px-1.5 py-0.5 rounded bg-purple-soft">
            {currentNav.num}
          </span>
          <h1 className="font-bold text-[15px] tracking-tight text-ink uppercase">
            {currentNav.label}
          </h1>
        </div>
        <span className="hidden lg:inline text-border">|</span>
        <span className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-ink-secondary">
          <span>NOWCAST:</span>
          <span className="text-status-warning font-semibold">MODERATE-HEAVY (68.4 mm/h)</span>
        </span>
      </div>

      {/* Center: Global Search Bar with Autocomplete Dropdown */}
      <div ref={searchRef} className="flex-1 max-w-md mx-6 hidden md:block relative">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search road, drainage node, ward, incident... (Cmd+K)"
            className="w-full bg-surface-secondary text-ink text-xs pl-9 pr-14 py-2 rounded-lg border border-border focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all placeholder:text-ink-muted font-sans"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-muted bg-surface px-1.5 py-0.5 rounded border border-border">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Global Search Results Dropdown Menu */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-elevated py-2 z-50 animate-scaleUp">
            <div className="px-3 py-1 text-[10px] font-mono uppercase text-ink-muted font-bold tracking-wider">
              Matching Operational Entities
            </div>
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (res.coords) {
                    setMapFocusTarget({
                      coords: res.coords,
                      zoom: 15.5,
                      title: res.title,
                      subtitle: res.subtitle,
                    });
                  }
                  navigate(res.route);
                  setIsSearchFocused(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-surface-secondary flex items-center justify-between transition-colors border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  {res.type === 'road' && <MapPin className="w-4 h-4 text-purple" />}
                  {res.type === 'node' && <GitBranch className="w-4 h-4 text-status-warning" />}
                  {res.type === 'incident' && <ShieldAlert className="w-4 h-4 text-status-alert" />}
                  <div>
                    <div className="text-xs font-bold text-ink">{res.title}</div>
                    <div className="text-[11px] text-ink-secondary">{res.subtitle}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-purple bg-purple-soft/60 px-1.5 py-0.5 rounded">
                  {res.type.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Ward Selection Menu & Status Telemetry */}
      <div className="flex items-center gap-3">
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* EXECUTIVE JURISDICTION SELECTION MENU                                      */}
        {/* ========================================================================= */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
            className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 shadow-subtle ${
              isWardDropdownOpen
                ? 'border-purple bg-purple-soft/60 ring-2 ring-purple/20 text-purple shadow-md'
                : 'border-border bg-surface hover:bg-surface-secondary text-ink hover:border-border/80'
            }`}
            title="Switch Municipal Ward Jurisdiction"
          >
            {/* Stable Dual-Ring Live Status Pulse Dot */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  activeWardObj.activeRisk === 'CRITICAL'
                    ? 'bg-status-alert'
                    : activeWardObj.activeRisk === 'HIGH'
                    ? 'bg-status-warning'
                    : 'bg-status-safe'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  activeWardObj.activeRisk === 'CRITICAL'
                    ? 'bg-status-alert'
                    : activeWardObj.activeRisk === 'HIGH'
                    ? 'bg-status-warning'
                    : 'bg-status-safe'
                }`}
              />
            </span>

            {/* Ward Code Pill */}
            <span className="font-mono text-[11px] font-bold text-purple bg-purple-soft px-1.5 py-0.5 rounded border border-purple/20 flex-shrink-0">
              {activeWardObj.code}
            </span>

            {/* Ward Jurisdiction Name & Subtext */}
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-mono uppercase tracking-wider text-ink-secondary">
                Ward
              </span>
              <span className="font-bold text-ink max-w-[130px] lg:max-w-[160px] truncate text-xs mt-0.5">
                {activeWardObj.shortName || activeWardObj.name.split(' (')[0]}
              </span>
            </div>

            {/* Down Chevron */}
            <ChevronDown
              className={`w-3.5 h-3.5 text-ink-secondary transition-transform duration-200 ml-0.5 flex-shrink-0 ${
                isWardDropdownOpen ? 'rotate-180 text-purple' : 'group-hover:text-ink'
              }`}
            />
          </button>

          {/* Expanded Selection Menu Popover Card */}
          {isWardDropdownOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-surface/98 backdrop-blur-md border border-border rounded-2xl shadow-elevated overflow-hidden z-50 animate-scaleUp">
              {/* Menu Header with Category Tabs & Search */}
              <div className="p-3 bg-surface-secondary/80 border-b border-border">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple" />
                    <span className="text-[11px] font-mono uppercase font-bold text-ink tracking-wider">
                      Municipal Jurisdiction
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-ink-secondary">
                    {filteredWards.length} Wards Listed
                  </span>
                </div>

                {/* Filter Search Input */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={wardSearch}
                    onChange={(e) => setWardSearch(e.target.value)}
                    placeholder="Search by ward (e.g. F/N, Kurla, Sion)..."
                    className="w-full bg-surface text-ink text-xs pl-8 pr-7 py-1.5 rounded-lg border border-border focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all font-sans placeholder:text-ink-muted"
                    autoFocus
                  />
                  {wardSearch && (
                    <button
                      onClick={() => setWardSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Quick Risk Category Tabs */}
                <div className="flex items-center gap-1 pt-1.5 border-t border-border/40">
                  {[
                    { label: 'All', value: 'ALL', count: WARDS.length },
                    { label: 'Critical', value: 'CRITICAL', count: WARDS.filter((w) => w.activeRisk === 'CRITICAL').length },
                    { label: 'High', value: 'HIGH', count: WARDS.filter((w) => w.activeRisk === 'HIGH').length },
                    { label: 'Moderate', value: 'NORMAL', count: WARDS.filter((w) => w.activeRisk === 'MODERATE' || w.activeRisk === 'LOW').length },
                  ].map((tab) => {
                    const isActive = riskFilterTab === tab.value;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setRiskFilterTab(tab.value)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all flex items-center gap-1 ${
                          isActive
                            ? 'bg-purple text-white shadow-subtle'
                            : 'text-ink-secondary hover:bg-surface hover:text-ink'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[9px] px-1 rounded ${isActive ? 'bg-white/20' : 'bg-surface-secondary border border-border/50'}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ward Options List */}
              <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                {filteredWards.length === 0 ? (
                  <div className="p-6 text-center text-ink-secondary flex flex-col items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-ink-muted mb-1.5" />
                    <div className="text-xs font-semibold text-ink">No Wards Found</div>
                    <div className="text-[11px] text-ink-secondary mt-0.5">
                      No jurisdiction matches '{wardSearch}'
                    </div>
                    <button
                      onClick={() => {
                        setWardSearch('');
                        setRiskFilterTab('ALL');
                      }}
                      className="mt-2.5 px-3 py-1 bg-purple-soft text-purple hover:bg-purple hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredWards.map((ward) => {
                    const isSelected = selectedWard === ward.id;
                    return (
                      <button
                        key={ward.id}
                        onClick={() => {
                          setSelectedWard(ward.id);
                          setIsWardDropdownOpen(false);
                          setWardSearch('');
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all relative flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-purple-soft/60 border border-purple/30 shadow-subtle'
                            : 'hover:bg-surface-secondary border border-transparent'
                        }`}
                      >
                        {/* Active Accent Pill on Left */}
                        {isSelected && (
                          <div className="absolute left-0.5 top-2 bottom-2 w-1 bg-purple rounded-full" />
                        )}

                        <div className="flex items-center justify-between pl-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                isSelected
                                  ? 'bg-purple text-white border-purple'
                                  : 'bg-surface-secondary text-ink-secondary border-border'
                              }`}
                            >
                              {ward.code}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-ink text-xs">
                                {ward.shortName || ward.name.split(' (')[0]}
                              </span>
                              {ward.zone && (
                                <span className="text-[10px] text-ink-secondary ml-1.5 font-normal">
                                  ({ward.zone})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Risk Level Badge */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                ward.activeRisk === 'CRITICAL'
                                  ? 'bg-status-alert-soft text-status-alert border border-status-alert/30'
                                  : ward.activeRisk === 'HIGH'
                                  ? 'bg-status-warning-soft text-status-warning border border-status-warning/30'
                                  : 'bg-status-safe-soft text-status-safe border border-status-safe/30'
                              }`}
                            >
                              {ward.activeRisk}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-purple flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sub-areas & Key Telemetry Counters */}
                        <div className="pl-1 flex items-center justify-between text-[10px] font-mono text-ink-secondary">
                          <span className="truncate max-w-[210px]">
                            {ward.subAreas || ward.name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {ward.sensors && <span>{ward.sensors} AWS</span>}
                            {ward.criticalRoads && <span>• {ward.criticalRoads} Roads</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Popover Footer with Metro-wide reset */}
              <div className="px-3 py-2 bg-surface-secondary/90 border-t border-border flex items-center justify-between text-[10px] font-mono text-ink-secondary">
                <button
                  onClick={() => {
                    setSelectedWard('all');
                    setIsWardDropdownOpen(false);
                    setWardSearch('');
                    setRiskFilterTab('ALL');
                  }}
                  className="hover:text-purple text-ink font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Reset to Metro-Wide View</span>
                </button>
                <span className="text-ink-muted">ESC to close</span>
              </div>
            </div>
          )}
        </div>

        {/* System Health Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-[11px] font-mono text-ink-secondary shadow-subtle">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" />
          <span>HEALTH: <strong className="text-ink">98.7%</strong></span>
        </div>

        {/* Notifications Bell */}
        <button
          className="relative p-2 rounded-xl hover:bg-surface-secondary text-ink-secondary hover:text-ink transition-colors border border-border shadow-subtle"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertsList.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-alert animate-ping" />
          )}
        </button>

        {/* Authority Commander Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-purple-soft text-purple border border-purple/30 flex items-center justify-center font-mono font-bold text-xs shadow-subtle">
            RV
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-ink leading-tight">Cmdr. R. Verma</div>
            <div className="text-[10px] text-ink-secondary font-medium">Ops Director</div>
          </div>
        </div>
      </div>
    </header>
  );
}
