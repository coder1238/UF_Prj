import React, { useState, useMemo } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  BookOpen, Car, Zap, AlertTriangle, ShieldCheck, Droplets, 
  Wind, Waves, Gauge, Info, ChevronDown, ChevronUp, ArrowRight,
  Search, Bookmark, BookmarkCheck, Printer, Radio, Flame, 
  CheckCircle2, Sparkles, Filter, FileText, ArrowDownUp,
  ThermometerSnowflake, PackageCheck, Award
} from 'lucide-react';

import { SAFETY_CATEGORIES, SAFETY_CHAPTERS } from '../safety/SafetyGuideData';
import HydrodynamicDragCalculator from '../safety/HydrodynamicDragCalculator';
import VehicleEscapeSimulator from '../safety/VehicleEscapeSimulator';
import WaterPurificationCalculator from '../safety/WaterPurificationCalculator';
import StepPotentialVisualizer from '../safety/StepPotentialVisualizer';
import GoBagAuditor from '../safety/GoBagAuditor';
import DistressAcousticSynthesizer from '../safety/DistressAcousticSynthesizer';
import HypothermiaSurvivalMatrix from '../safety/HypothermiaSurvivalMatrix';
import FloodReadinessQuiz from '../safety/FloodReadinessQuiz';
import PrintableFieldGuideModal from '../safety/PrintableFieldGuideModal';

export default function FloodSafetyGuide() {
  const { navigateTo } = useNavigation();

  // Navigation tab for the page: 'dossier' or one of the 8 dedicated tools
  const [activeTab, setActiveTab] = useState('dossier');

  // Chapter dossier state
  const [activeChapterId, setActiveChapterId] = useState('ch-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Bookmarking state (persistent in localStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('flood_safety_bookmarks');
      return saved ? JSON.parse(saved) : ['ch-1', 'ch-3', 'ch-12'];
    } catch (e) {
      return ['ch-1', 'ch-3', 'ch-12'];
    }
  });

  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Original Vehicle Float Simulator state
  const [calcCarType, setCalcCarType] = useState('hatchback');
  const [calcWaterDepth, setCalcWaterDepth] = useState(25);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('flood_safety_bookmarks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Filter chapters
  const filteredChapters = useMemo(() => {
    return SAFETY_CHAPTERS.filter(ch => {
      // Category match
      if (selectedCategory !== 'all' && ch.category !== selectedCategory) {
        return false;
      }
      // Bookmark filter
      if (showBookmarksOnly && !bookmarks.includes(ch.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = ch.title.toLowerCase().includes(q);
        const inSummary = ch.summary.toLowerCase().includes(q);
        const inOverview = ch.content?.overview?.toLowerCase().includes(q);
        const inBadge = ch.badge?.toLowerCase().includes(q);
        if (!inTitle && !inSummary && !inOverview && !inBadge) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, showBookmarksOnly, bookmarks, searchQuery]);

  // Selected Chapter object
  const currentChapter = useMemo(() => {
    return SAFETY_CHAPTERS.find(c => c.id === activeChapterId) || SAFETY_CHAPTERS[0];
  }, [activeChapterId]);

  // Vehicle Float Calculator Logic
  const getVehicleRisk = () => {
    const limits = {
      twowheeler: { stall: 12, float: 22 },
      hatchback: { stall: 18, float: 30 },
      sedan: { stall: 22, float: 35 },
      suv: { stall: 35, float: 50 },
      bus: { stall: 60, float: 85 }
    };

    const limit = limits[calcCarType];
    if (calcWaterDepth >= limit.float) {
      return { status: 'BUOYANT / LOSS OF CONTROL', color: 'text-red-700 bg-red-50 border-red-200', desc: 'Tires lose contact with roadbed; water current sweeps vehicle.' };
    }
    if (calcWaterDepth >= limit.stall) {
      return { status: 'ENGINE IMMERSION RISK', color: 'text-amber-800 bg-amber-50 border-amber-200', desc: 'Water entering air intake duct; high probability of catastrophic engine failure.' };
    }
    return { status: 'SAFE OPERATIONAL CLEARANCE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Clearance maintained below exhaust backflow threshold.' };
  };

  const vehicleRiskResult = getVehicleRisk();

  const toolTabs = [
    { id: 'dossier', label: `20 Safety Modules (${SAFETY_CHAPTERS.length})`, icon: BookOpen },
    { id: 'drag-calc', label: 'Hydrodynamic Drag Calculator', icon: Gauge },
    { id: 'vehicle-escape', label: 'Vehicle Sinking Escape Drill', icon: Car },
    { id: 'water-purification', label: 'Water Purification Dosing', icon: Droplets },
    { id: 'step-potential', label: 'Step Potential Field Visualizer', icon: Zap },
    { id: 'gobag', label: '72h Go-Bag Auditor', icon: PackageCheck },
    { id: 'acoustic-siren', label: 'Acoustic Distress Siren', icon: Radio },
    { id: 'hypothermia', label: 'Hypothermia Survival Matrix', icon: ThermometerSnowflake },
    { id: 'quiz', label: 'Survival Quiz & Certification', icon: Award }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
              Citizen Physical Safety & Hydrology Handbook
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-soft text-purple-deep">
              20 MODULES • 10 INTERACTIVE FEATURES
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mt-1.5">
            Flood Survival Physics & Tactical Preparedness
          </h1>
          <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            Quantitative hydrodynamic equations, step potential electrical kinematics, vehicle sinking mechanics, and field-tested emergency survival protocols for monsoon cloudbursts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-ink text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-purple-primary" />
            <span>Print Field Dossier</span>
          </button>

          <button
            onClick={() => navigateTo('safe-places')}
            className="px-4 py-2.5 rounded-xl bg-purple-primary text-white text-xs font-bold hover:bg-purple-hover flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Locate Shelters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tool Navigation Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {toolTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-purple-primary text-white shadow-card scale-[1.02]'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:text-ink'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-primary'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 20 COMPREHENSIVE SAFETY CHAPTERS & DOSSIER BROWSER */}
      {activeTab === 'dossier' && (
        <div className="space-y-8">
          {/* Quick Vehicle Float Calculator Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-primary uppercase tracking-wider">
                <Gauge className="w-4 h-4" /> Quick Vehicle Clearance & Intake Immersion Check
              </div>
              <button
                onClick={() => setActiveTab('vehicle-escape')}
                className="text-xs font-mono font-bold text-purple-primary hover:underline flex items-center gap-1"
              >
                Open Vehicle Sinking Drill <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 font-bold">Vehicle Classification</label>
                <select 
                  value={calcCarType}
                  onChange={e => setCalcCarType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary"
                >
                  <option value="twowheeler">Motorcycle / Scooter (Air Filter: 15cm)</option>
                  <option value="hatchback">Hatchback (Swift / i10 / WagonR: 28cm)</option>
                  <option value="sedan">Sedan (City / Verna / Ciaz: 32cm)</option>
                  <option value="suv">Compact / Full SUV (Creta / Fortuner: 45cm)</option>
                  <option value="bus">BEST Bus / Heavy Commercial (75cm)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono font-bold text-muted">Water Depth on Roadbed</label>
                  <span className="text-sm font-mono font-extrabold text-purple-primary">{calcWaterDepth} cm</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="90"
                  value={calcWaterDepth}
                  onChange={e => setCalcWaterDepth(Number(e.target.value))}
                  className="w-full accent-purple-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className={`p-4 rounded-2xl border ${vehicleRiskResult.color}`}>
                <span className="text-[10px] font-mono uppercase block font-bold">Clearance Status</span>
                <span className="text-sm font-bold block mt-0.5">{vehicleRiskResult.status}</span>
                <p className="text-[11px] mt-1 leading-snug">{vehicleRiskResult.desc}</p>
              </div>
            </div>
          </div>

          {/* Search, Category Filter & Bookmark Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across all 20 modules (e.g. manhole, drag force, bleach, snakes, H2S gas)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas border border-slate-200 text-xs font-medium text-ink placeholder:text-slate-400 focus:outline-none focus:border-purple-primary"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-canvas border border-slate-200 rounded-xl text-xs font-bold text-ink focus:outline-none focus:border-purple-primary"
              >
                {SAFETY_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  showBookmarksOnly
                    ? 'bg-purple-50 border-purple-300 text-purple-primary font-extrabold'
                    : 'bg-canvas border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
                <span>Bookmarks ({bookmarks.length})</span>
              </button>
            </div>
          </div>

          {/* Chapters Directory & Reader View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Navigation List Column (4 cols) */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
              <div className="flex justify-between items-center px-1 mb-1">
                <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
                  Modules ({filteredChapters.length} of {SAFETY_CHAPTERS.length})
                </span>
                {filteredChapters.length === 0 && (
                  <span className="text-xs text-red-500 font-mono">No matches found</span>
                )}
              </div>

              {filteredChapters.map(ch => {
                const Icon = ch.icon;
                const isSelected = activeChapterId === ch.id;
                const isBookmarked = bookmarks.includes(ch.id);

                return (
                  <div
                    key={ch.id}
                    onClick={() => setActiveChapterId(ch.id)}
                    className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative ${
                      isSelected 
                        ? 'bg-purple-primary text-white border-purple-primary shadow-card scale-[1.01]' 
                        : 'bg-white border-slate-200/90 text-ink hover:bg-purple-50/20'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-white/10 text-white' : 'bg-purple-50 text-purple-primary'}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          CH {ch.num}
                        </span>
                        <span className={`text-[10px] font-mono uppercase font-bold ${
                          ch.dangerLevel === 'LETHAL' 
                            ? isSelected ? 'text-red-300' : 'text-red-600'
                            : isSelected ? 'text-purple-200' : 'text-muted'
                        }`}>
                          {ch.dangerLevel}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-1">{ch.title}</h3>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-purple-100' : 'text-muted'}`}>
                        {ch.summary}
                      </p>
                    </div>

                    {/* Bookmark icon toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(ch.id);
                      }}
                      className="absolute top-4 right-4 p-1 text-slate-400 hover:text-purple-primary transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this module'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-current' : isSelected ? 'text-white/60' : 'text-slate-300'}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected Chapter Detailed Dossier (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                {/* Dossier Header */}
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-soft text-purple-primary">
                        CHAPTER {currentChapter.num} • {currentChapter.badge}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        currentChapter.dangerLevel === 'LETHAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {currentChapter.dangerLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted">{currentChapter.readingTime}</span>
                      <button
                        onClick={() => toggleBookmark(currentChapter.id)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentChapter.id) ? 'text-amber-500 fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl font-extrabold text-ink mt-3 leading-tight">
                    {currentChapter.title}
                  </h2>
                  <p className="text-xs text-muted mt-1 leading-snug">
                    {currentChapter.summary}
                  </p>
                </div>

                {/* Key Takeaway Box */}
                {currentChapter.keyTakeaway && (
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-950 mb-6 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-purple-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-purple-primary block">
                        Core Life-Safety Takeaway
                      </span>
                      <p className="text-xs font-bold mt-0.5">{currentChapter.keyTakeaway}</p>
                    </div>
                  </div>
                )}

                {/* Mathematical Equation / Formula if available */}
                {currentChapter.formula && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs mb-6 border border-slate-800">
                    <span className="text-[10px] text-purple-300 font-bold uppercase block mb-1">
                      Hydraulic / Physical Governing Equation
                    </span>
                    <code className="text-purple-200 text-xs sm:text-sm font-bold block overflow-x-auto py-1">
                      {currentChapter.formula}
                    </code>
                  </div>
                )}

                {/* Physics Mechanism & Explanation */}
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-sans">
                  <p>{currentChapter.content?.overview}</p>
                  
                  {currentChapter.content?.physicsMechanism && (
                    <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80 text-xs sm:text-sm leading-relaxed space-y-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                        Technical Physics Breakdown
                      </span>
                      <p className="whitespace-pre-line text-slate-800">
                        {currentChapter.content.physicsMechanism}
                      </p>
                    </div>
                  )}

                  {/* Empirical Thresholds Matrix */}
                  {currentChapter.content?.empiricalThresholds && (
                    <div className="mt-6">
                      <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block mb-2">
                        Empirical Danger Thresholds
                      </span>
                      <div className="space-y-2">
                        {currentChapter.content.empiricalThresholds.map((t, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <strong className="font-mono text-purple-primary shrink-0 sm:w-1/3">{t.depth}</strong>
                            <span className="text-slate-600 sm:w-2/3">{t.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Safety Directives */}
                  {currentChapter.content?.safetyDirectives && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                        Tactical Safety Directives (NDRF / BMC Standard)
                      </span>
                      <div className="space-y-2">
                        {currentChapter.content.safetyDirectives.map((dir, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{dir}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dossier Bottom Strip */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-muted font-mono">
                  Verified with Municipal Hydrologists & NDRF Search Teams
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button 
                    onClick={() => navigateTo('safe-places')}
                    className="px-4 py-2 rounded-xl bg-purple-50 text-purple-primary text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-1.5"
                  >
                    Locate Vetted Shelters <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HYDRODYNAMIC DRAG CALCULATOR */}
      {activeTab === 'drag-calc' && <HydrodynamicDragCalculator />}

      {/* TAB 3: VEHICLE SINKING WINDOW ESCAPE DRILL */}
      {activeTab === 'vehicle-escape' && <VehicleEscapeSimulator />}

      {/* TAB 4: EMERGENCY WATER PURIFICATION CALCULATOR */}
      {activeTab === 'water-purification' && <WaterPurificationCalculator />}

      {/* TAB 5: STEP POTENTIAL FIELD VISUALIZER */}
      {activeTab === 'step-potential' && <StepPotentialVisualizer />}

      {/* TAB 6: 72H GO-BAG READINESS AUDITOR */}
      {activeTab === 'gobag' && <GoBagAuditor />}

      {/* TAB 7: ACOUSTIC DISTRESS SIREN SYNTHESIZER */}
      {activeTab === 'acoustic-siren' && <DistressAcousticSynthesizer />}

      {/* TAB 8: HYPOTHERMIA SURVIVAL MATRIX */}
      {activeTab === 'hypothermia' && <HypothermiaSurvivalMatrix />}

      {/* TAB 9: SURVIVAL QUIZ & CITIZEN CERTIFICATION */}
      {activeTab === 'quiz' && <FloodReadinessQuiz />}

      {/* PRINTABLE FIELD GUIDE MODAL */}
      <PrintableFieldGuideModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
      />
    </div>
  );
}
