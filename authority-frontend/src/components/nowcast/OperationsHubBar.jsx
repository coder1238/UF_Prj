import React, { useState, useRef } from 'react';
import {
  Layers,
  Cpu,
  Wind,
  Zap,
  BarChart2,
  Droplets,
  CheckCircle2,
  Send,
  Building2,
  AlertTriangle,
  Volume2,
  Sparkles,
  Activity,
  Play,
  Terminal,
  Search,
  X,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const OPERATIONS_TOOLS = [
  // Category: Meteorology & Atmosphere
  {
    id: 'rhiProfile',
    category: 'met',
    categoryName: 'Meteorology',
    name: 'RHI Cross-Section',
    sub: '0–15km Vertical Slice',
    icon: Layers,
    color: 'text-purple',
    bg: 'bg-purple-soft/60',
    border: 'border-purple/30',
    hoverBorder: 'hover:border-purple',
    badge: 'Dual-Pol',
  },
  {
    id: 'hydrometeor',
    category: 'met',
    categoryName: 'Meteorology',
    name: 'Hydrometeors (HID)',
    sub: 'Fuzzy Phase Classifier',
    icon: Cpu,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-400',
    badge: 'ZH / ZDR',
  },
  {
    id: 'trecMotion',
    category: 'met',
    categoryName: 'Meteorology',
    name: 'TREC Wind Vectors',
    sub: '850 hPa Advection',
    icon: Wind,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-400',
    badge: '42 km/h',
  },
  {
    id: 'lightningPanel',
    category: 'met',
    categoryName: 'Meteorology',
    name: 'Lightning Density',
    sub: 'IITM Stroke Network',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    badge: '142 Strokes',
  },

  // Category: Hydrology & Basins
  {
    id: 'basinHyetograph',
    category: 'hydro',
    categoryName: 'Hydrology',
    name: 'Catchment Hyetograph',
    sub: '4 Major River Basins',
    icon: BarChart2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    badge: 'Q=CIA/3.6',
  },
  {
    id: 'waterBudget',
    category: 'hydro',
    categoryName: 'Hydrology',
    name: 'Water Budget Deficit',
    sub: 'Mass Flux vs Pumps',
    icon: Droplets,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    hoverBorder: 'hover:border-sky-400',
    badge: '425 kt/min',
  },
  {
    id: 'isohyetPanel',
    category: 'hydro',
    categoryName: 'Hydrology',
    name: 'Isohyet Contours',
    sub: '1h/2h/3h Accumulation',
    icon: Droplets,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    badge: '>100mm',
  },
  {
    id: 'awsValidation',
    category: 'hydro',
    categoryName: 'Hydrology',
    name: 'AWS Calibration',
    sub: '8 Ground Rain Gauges',
    icon: CheckCircle2,
    color: 'text-status-safe',
    bg: 'bg-status-safe-soft',
    border: 'border-status-safe/30',
    hoverBorder: 'hover:border-status-safe',
    badge: '1.04x Bias',
  },

  // Category: Public Safety & Alerts
  {
    id: 'severeAlert',
    category: 'alerts',
    categoryName: 'Alerts',
    name: 'CAP Alert Dispatch',
    sub: 'ITU-T Emergency XML',
    icon: Send,
    color: 'text-status-alert',
    bg: 'bg-status-alert-soft',
    border: 'border-status-alert/40',
    hoverBorder: 'hover:border-status-alert',
    badge: 'Emergency',
  },
  {
    id: 'wardRisk',
    category: 'alerts',
    categoryName: 'Alerts',
    name: '24 Wards Matrix',
    sub: 'BMC Ward Inundation',
    icon: Building2,
    color: 'text-purple',
    bg: 'bg-purple-soft/60',
    border: 'border-purple/30',
    hoverBorder: 'hover:border-purple',
    badge: '24 Wards',
  },
  {
    id: 'criticalInfra',
    category: 'alerts',
    categoryName: 'Alerts',
    name: 'Infra Strike Watch',
    sub: 'Airport, Subways & Sump',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    badge: '6 Assets',
  },
  {
    id: 'audioAlert',
    category: 'alerts',
    categoryName: 'Alerts',
    name: 'Tactical Audio Siren',
    sub: 'Web Audio Synthesizer',
    icon: Volume2,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    badge: 'Audio API',
  },

  // Category: Simulation & Diagnostics
  {
    id: 'stormInjector',
    category: 'sim',
    categoryName: 'Simulation',
    name: 'Inject Storm Drill',
    sub: 'Synthetic Cloudburst',
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    badge: 'What-If',
  },
  {
    id: 'ensembleModel',
    category: 'sim',
    categoryName: 'Simulation',
    name: 'Ensemble Models',
    sub: 'ConvLSTM vs DGMR PINN',
    icon: Activity,
    color: 'text-purple',
    bg: 'bg-purple-soft/60',
    border: 'border-purple/30',
    hoverBorder: 'hover:border-purple',
    badge: '4 Models',
  },
  {
    id: 'radarLoop',
    category: 'sim',
    categoryName: 'Simulation',
    name: 'Radar Loop Player',
    sub: '-30m to +180m Frames',
    icon: Play,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    badge: '10 Frames',
  },
  {
    id: 'skillScore',
    category: 'sim',
    categoryName: 'Simulation',
    name: 'Verification Matrix',
    sub: 'WMO POD / FAR / CSI',
    icon: CheckCircle2,
    color: 'text-status-safe',
    bg: 'bg-status-safe-soft',
    border: 'border-status-safe/30',
    hoverBorder: 'hover:border-status-safe',
    badge: 'CSI 87%',
  },
  {
    id: 'telemetryTerminal',
    category: 'sim',
    categoryName: 'Simulation',
    name: 'Hardware Terminal',
    sub: 'Raw NSSL/Sigmet Ray Bus',
    icon: Terminal,
    color: 'text-ink',
    bg: 'bg-surface-secondary',
    border: 'border-border',
    hoverBorder: 'hover:border-purple/50',
    badge: '852 kW',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Operations', count: OPERATIONS_TOOLS.length },
  { id: 'met', label: 'Meteorology', count: 4 },
  { id: 'hydro', label: 'Hydrology & Basins', count: 4 },
  { id: 'alerts', label: 'Alerts & Safety', count: 4 },
  { id: 'sim', label: 'Drills & Diagnostics', count: 5 },
];

export default function OperationsHubBar({ onOpenTool }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(false);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const filteredTools = OPERATIONS_TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.sub.toLowerCase().includes(query) ||
      tool.categoryName.toLowerCase().includes(query) ||
      tool.badge.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-surface border border-border rounded-xl shadow-subtle p-3 flex flex-col gap-2.5 transition-all">
      {/* Top Header & Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-2.5">
        {/* Title & Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2 h-2 rounded-full bg-purple animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
              Operations Hub
            </span>
            <span className="text-[10px] font-mono font-bold bg-purple-soft text-purple px-1.5 py-0.2 rounded">
              {filteredTools.length}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-surface text-purple shadow-sm font-bold border border-border/80'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1 rounded-full ${
                    activeCategory === cat.id ? 'bg-purple-soft text-purple font-bold' : 'bg-canvas text-ink-muted'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Tools: Search & Layout View Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-ink-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Find operational tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs font-mono bg-surface-secondary border border-border rounded-lg text-ink placeholder:text-ink-muted focus:border-purple outline-none w-44 transition-all focus:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-ink-muted hover:text-ink p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Grid vs Ribbon Toggle */}
          <button
            onClick={() => setIsGridView(!isGridView)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isGridView
                ? 'bg-purple text-white border-purple font-semibold shadow-sm'
                : 'bg-surface-secondary text-ink-secondary hover:text-ink border-border'
            }`}
            title={isGridView ? 'Switch to Horizontal Ribbon' : 'Switch to Expanded Grid View'}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{isGridView ? 'Grid View' : 'Ribbon'}</span>
          </button>

          {/* Scroll Nav Buttons (Visible in ribbon view) */}
          {!isGridView && (
            <div className="flex items-center gap-1">
              <button
                onClick={scrollLeft}
                className="p-1 rounded-lg bg-surface-secondary border border-border hover:bg-surface text-ink-secondary hover:text-ink transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-1 rounded-lg bg-surface-secondary border border-border hover:bg-surface text-ink-secondary hover:text-ink transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Operations Tools Presentation */}
      {isGridView ? (
        /* Expanded Multi-column Grid View */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 pt-1 animate-fade-in">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all group bg-surface-secondary/70 hover:bg-surface border-border ${tool.hoverBorder} hover:shadow-subtle`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className={`w-7 h-7 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border/80 text-ink-secondary font-medium shrink-0">
                    {tool.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-ink truncate group-hover:text-purple transition-colors">
                    {tool.name}
                  </div>
                  <div className="text-[10px] font-mono text-ink-secondary truncate mt-0.5">
                    {tool.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Ergonomic Horizontal Scrollable Ribbon with Clean Cards */
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto select-none pt-0.5 pb-1 scrollbar-thin"
        >
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                className={`px-3 py-2 rounded-xl border text-left flex items-center gap-2.5 shrink-0 transition-all group bg-surface-secondary/70 hover:bg-surface border-border ${tool.hoverBorder} hover:shadow-subtle min-w-[210px]`}
              >
                <div className={`w-7 h-7 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-ink truncate group-hover:text-purple transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-surface border border-border/80 text-ink-secondary shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-ink-secondary truncate mt-0.5">
                    {tool.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
