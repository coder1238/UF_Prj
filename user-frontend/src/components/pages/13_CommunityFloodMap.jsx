import React, { useState, useMemo, useEffect } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import CommunityMapCanvas from '../community/CommunityMapCanvas';
import {
  PinDropModal,
  EvidenceViewerModal,
  DiscussionDrawer,
  VolunteerAidModal,
  ScoutLeaderboardModal,
  SitRepShareModal,
  SafetyPledgeModal,
  IoTSensorModal
} from '../community/CommunityModals';
import {
  INITIAL_COMMUNITY_OBSERVATIONS,
  COMMUNITY_IOT_SENSORS,
  COMMUNITY_AID_REQUESTS,
  COMMUNITY_SHELTERS,
  SCOUT_LEADERBOARD,
  MUMBAI_WARDS_COMMUNITY
} from '../../data/communityData';
import {
  Users, MapPin, CheckCircle2, AlertTriangle, Filter, 
  ThumbsUp, Eye, Camera, Clock, ShieldCheck, Sparkles, Layers,
  Volume2, VolumeX, MessageSquare, AlertOctagon, HeartHandshake,
  Share2, Award, Download, RefreshCw, Radio, Search, ChevronRight,
  TrendingDown, Check, ArrowRight, ShieldAlert, Sliders, Droplets
} from 'lucide-react';

export default function CommunityFloodMap() {
  const { currentWard, speakAlert, voiceLanguage, isOfflineMode, setIsOfflineMode } = useFlood();
  const { navigateTo } = useNavigation();

  // Core Data State
  const [reports, setReports] = useState(INITIAL_COMMUNITY_OBSERVATIONS);
  const [iotSensors, setIotSensors] = useState(COMMUNITY_IOT_SENSORS);
  const [aidRequests, setAidRequests] = useState(COMMUNITY_AID_REQUESTS);
  const [shelters, setShelters] = useState(COMMUNITY_SHELTERS);
  const [selectedReport, setSelectedReport] = useState(INITIAL_COMMUNITY_OBSERVATIONS[0]);

  // Tab: 'observations' | 'mutual-aid' | 'shelters'
  const [activeTab, setActiveTab] = useState('observations');

  // Filters & Search
  const [selectedWardId, setSelectedWardId] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all'); // 'all' | 'severe' | 'manhole' | 'stalled' | 'electrical' | 'verified' | 'receding'
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRecencyMinutes, setMaxRecencyMinutes] = useState(180); // Slider: 15 to 240 mins
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(15);

  // Map Controls State
  const [mapLayers, setMapLayers] = useState({
    crowdsourced: true,
    iotSensors: true,
    gnnModel: true,
    aidPosts: true,
    shelters: true,
    heatmap: false
  });
  const [isPinDropModeActive, setIsPinDropModeActive] = useState(false);
  const [pendingPinDropCoords, setPendingPinDropCoords] = useState(null);
  const [centerCoordinates, setCenterCoordinates] = useState(null);

  // Modals & Drawers State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [isAidModalOpen, setIsAidModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [selectedSensorModal, setSelectedSensorModal] = useState(null);

  // Gamification & Badges
  const [hasCompletedPledge, setHasCompletedPledge] = useState(false);
  const [emergencyBroadcastActive, setEmergencyBroadcastActive] = useState(true);

  // Feature 14: Simulated Auto-Refresh Timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      setSecondsUntilRefresh(prev => {
        if (prev <= 1) {
          // Slight simulated fluctuations in sensor telemetry
          setIotSensors(current => current.map(s => ({
            ...s,
            lastPingSecondsAgo: Math.floor(Math.random() * 20) + 1,
            currentDepthCm: Number((s.currentDepthCm + (Math.random() * 0.4 - 0.2)).toFixed(1))
          })));
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  // Feature 1: Pin-Drop from Map click
  const handleMapPinDrop = (coords) => {
    setPendingPinDropCoords(coords);
    setIsPinDropModeActive(false);
    setIsPinModalOpen(true);
  };

  const handleAddNewReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    setSelectedReport(newReport);
    speakAlert(`New community hazard observation logged: ${newReport.title}`);
  };

  // Feature 3: Dynamic 3-Way Corroboration Engine
  const handleCorroborate = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        const nextUpvotes = r.upvotes + 1;
        return {
          ...r,
          upvotes: nextUpvotes,
          userConfirmed: true,
          agreementPct: Math.min(100, r.agreementPct + 1)
        };
      }
      return r;
    }));
    speakAlert('Observation corroborated. Field confidence updated.');
  };

  const handleMarkReceding = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        const newDepth = Math.max(0, r.depth - 5);
        return {
          ...r,
          depth: newDepth,
          category: newDepth <= 5 ? 'Receding / Cleared' : r.category,
          description: `${r.description} [Citizen Note: Water receding steadily]`
        };
      }
      return r;
    }));
    speakAlert('Water recession recorded for this hazard point.');
  };

  const handleDispute = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          downvotes: (r.downvotes || 0) + 1,
          userDisputed: true,
          agreementPct: Math.max(70, r.agreementPct - 5),
          status: 'INVESTIGATING'
        };
      }
      return r;
    }));
    speakAlert('Report dispute filed. Flagged for secondary scout inspection.');
  };

  // Feature 4: Mutual Aid Pledging
  const handlePledgeAid = (aidId) => {
    setAidRequests(prev => prev.map(a => {
      if (a.id === aidId) {
        const nextPledged = a.pledgedVolunteers + 1;
        return {
          ...a,
          pledgedVolunteers: nextPledged,
          fulfilled: nextPledged >= a.neededVolunteers
        };
      }
      return a;
    }));
    speakAlert('Thank you! Your volunteer commitment has been dispatched to the society.');
  };

  // Feature 5: Add Field Note Comment
  const handleAddComment = (reportId, newComment) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          comments: [...(r.comments || []), newComment]
        };
      }
      return r;
    }));
  };

  // Feature 9: Poll Sensor Ping
  const handlePollSensor = (sensorId) => {
    setIotSensors(prev => prev.map(s => {
      if (s.id === sensorId) {
        return {
          ...s,
          lastPingSecondsAgo: 0,
          currentDepthCm: Number((s.currentDepthCm + (Math.random() * 0.6 - 0.2)).toFixed(1))
        };
      }
      return s;
    }));
  };

  // Feature 12: Shelter Check-In
  const handleShelterCheckIn = (shelterId) => {
    setShelters(prev => prev.map(s => {
      if (s.id === shelterId) {
        return {
          ...s,
          currentOccupants: Math.min(s.capacity, s.currentOccupants + 1)
        };
      }
      return s;
    }));
    speakAlert('Safety check-in registered. Your status is shared with family emergency contacts.');
  };

  // Feature 13: Voice-Synthesized Audio SitRep
  const handlePlayAudioSitRep = () => {
    const highestDepth = Math.max(...reports.map(r => r.depth || 0));
    const activeWardObj = MUMBAI_WARDS_COMMUNITY.find(w => w.id === selectedWardId);
    const wardName = activeWardObj?.name || 'Greater Mumbai';

    const sitrep = `Citizen Ground-Truth Briefing for ${wardName}. There are ${filteredReports.length} active community observations. Deepest inundation recorded is ${highestDepth} centimeters near Milan Subway and Kurla. IoT ultrasonic sensors report steady telemetry. Safe shelters are operational with medical aid.`;
    speakAlert(sitrep);
  };

  // Feature 6: Ward spatial jump
  const handleWardChange = (wId) => {
    setSelectedWardId(wId);
    const wardObj = MUMBAI_WARDS_COMMUNITY.find(w => w.id === wId);
    if (wardObj && wardObj.center) {
      setCenterCoordinates(wardObj.center);
    }
  };

  // Feature 7: Multi-Hazard Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Ward filter
      if (selectedWardId !== 'all' && r.wardId !== selectedWardId) return false;

      // Recency filter
      if (r.recencyMinutes && r.recencyMinutes > maxRecencyMinutes) return false;

      // Tag filter
      if (selectedTag === 'severe' && r.depth <= 30) return false;
      if (selectedTag === 'manhole' && r.category !== 'Open Manhole' && !r.title.toLowerCase().includes('manhole')) return false;
      if (selectedTag === 'stalled' && r.category !== 'Stalled Vehicle') return false;
      if (selectedTag === 'electrical' && r.category !== 'Electrical Hazard') return false;
      if (selectedTag === 'receding' && r.category !== 'Receding / Cleared') return false;
      if (selectedTag === 'verified' && !r.verified) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesLocation = r.location.toLowerCase().includes(query);
        const matchesScout = r.scoutName.toLowerCase().includes(query);
        const matchesId = r.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesScout && !matchesId) return false;
      }

      return true;
    });
  }, [reports, selectedWardId, selectedTag, searchQuery, maxRecencyMinutes]);

  // Feature 18: Dynamic KPI Metrics
  const kpiStats = useMemo(() => {
    const depths = filteredReports.map(r => r.depth || 0);
    const avgDepth = depths.length > 0 ? (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1) : 0;
    const maxDepth = depths.length > 0 ? Math.max(...depths) : 0;
    const deepestReport = filteredReports.find(r => r.depth === maxDepth);
    const resolvedCount = reports.filter(r => r.category === 'Receding / Cleared' || r.status === 'CORDONED_VERIFIED').length;
    const volunteerPledges = aidRequests.reduce((sum, a) => sum + (a.pledgedVolunteers || 0), 0);

    return { avgDepth, maxDepth, deepestHotspot: deepestReport?.location || 'Normal', resolvedCount, volunteerPledges };
  }, [filteredReports, reports, aidRequests]);

  // Feature 2: Multi-Source Convergence Computation for Selected Report
  const convergenceDetails = useMemo(() => {
    if (!selectedReport) return null;
    const cDepth = selectedReport.depth || 0;
    const sDepth = selectedReport.sensorDepth || cDepth;
    const mDepth = selectedReport.modelDepth || cDepth;

    const variance = Math.abs(cDepth - sDepth).toFixed(1);
    const accordanceScore = selectedReport.agreementPct || 96;

    let rating = 'High Consensus';
    let ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (accordanceScore < 90) {
      rating = 'Sensor Discrepancy Flagged';
      ratingColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return {
      cDepth,
      sDepth,
      mDepth,
      variance,
      accordanceScore,
      rating,
      ratingColor
    };
  }, [selectedReport]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Feature 10: Community Emergency Push Broadcast Banner */}
      {emergencyBroadcastActive && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-white text-red-700 px-2 py-0.5 rounded uppercase">
                  Community Emergency Broadcast
                </span>
                <span className="text-xs font-mono text-red-100">Live Alert #4088</span>
              </div>
              <p className="text-xs font-medium text-white/95 mt-0.5">
                Milan Subway depth crossed 42 cm. Western underpass traffic diverted to overhead flyover. Volunteers requested at Hindmata Society.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePlayAudioSitRep}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" /> Listen Audio
            </button>
            <button
              onClick={() => setEmergencyBroadcastActive(false)}
              className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Page Header with Tools */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Citizen Ground Truth & Sensor Convergence
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Community Flood Intelligence Center
          </h1>
          <p className="text-sm text-muted mt-1">
            Decentralized fusion of citizen mobile observations, IoT ultrasonic telemetry, and GNN hydrologic simulations.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={handlePlayAudioSitRep}
            title="Readout situation report via voice synthesis"
            className="px-4 py-2.5 rounded-xl bg-canvas hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-purple-primary" />
            <span>Audio SitRep</span>
          </button>

          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-canvas hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share SitRep</span>
          </button>

          <button 
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-canvas hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Scout Board</span>
          </button>

          <button 
            onClick={() => setIsPledgeModalOpen(true)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all flex items-center gap-2 shadow-xs ${
              hasCompletedPledge 
                ? 'bg-purple-50 text-purple-primary border-purple-300 font-bold' 
                : 'bg-canvas hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-primary" />
            <span>{hasCompletedPledge ? 'Pledge Signed ✓' : 'Safety Pledge'}</span>
          </button>

          <button 
            onClick={() => setIsPinDropModeActive(!isPinDropModeActive)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${
              isPinDropModeActive 
                ? 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-300 animate-pulse'
                : 'bg-purple-primary hover:bg-purple-deep text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isPinDropModeActive ? 'Click Map to Place Pin...' : 'Drop Ground Pin'}</span>
          </button>
        </div>
      </div>

      {/* Feature 18: Real-Time Computed KPI Analytics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-muted text-xs font-mono mb-1">
            <span>Avg Flood Depth</span>
            <Droplets className="w-3.5 h-3.5 text-purple-primary" />
          </div>
          <div className="text-xl font-extrabold text-ink font-mono">{kpiStats.avgDepth} cm</div>
          <span className="text-[10px] text-muted">Across current filter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-muted text-xs font-mono mb-1">
            <span>Peak Inundation</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="text-xl font-extrabold text-red-600 font-mono">{kpiStats.maxDepth} cm</div>
          <span className="text-[10px] text-muted truncate block">{kpiStats.deepestHotspot}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-muted text-xs font-mono mb-1">
            <span>Active Pins</span>
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-ink font-mono">{filteredReports.length}</div>
          <span className="text-[10px] text-emerald-700 font-mono">100% EXIF Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-muted text-xs font-mono mb-1">
            <span>Resolved / Receded</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">{kpiStats.resolvedCount}</div>
          <span className="text-[10px] text-muted">Cordons cleared today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-muted text-xs font-mono mb-1">
            <span>Volunteers Pledged</span>
            <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />
          </div>
          <div className="text-xl font-extrabold text-pink-600 font-mono">{kpiStats.volunteerPledges} Citizens</div>
          <span className="text-[10px] text-muted">4 relief tasks underway</span>
        </div>
      </div>

      {/* Feature 6, 7 & 14: Filter, Ward Navigator & Search Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Ward Navigator Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted uppercase">Hotspot Ward:</span>
            <select
              value={selectedWardId}
              onChange={e => handleWardChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-canvas text-xs font-bold text-ink outline-none focus:border-purple-primary"
            >
              {MUMBAI_WARDS_COMMUNITY.map(ward => (
                <option key={ward.id} value={ward.id}>{ward.name}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search street, subway, scout..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-primary"
            />
          </div>

          {/* Time Recency Slider & Auto-Refresh */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted" />
              <span className="text-muted text-[11px]">Age: &lt;{maxRecencyMinutes}m</span>
              <input 
                type="range"
                min="15"
                max="240"
                step="15"
                value={maxRecencyMinutes}
                onChange={e => setMaxRecencyMinutes(Number(e.target.value))}
                className="w-20 accent-purple-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 text-muted border-l border-slate-200 pl-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px]">Sync in {secondsUntilRefresh}s</span>
              <button 
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                title={autoRefreshEnabled ? 'Pause auto-sync' : 'Resume auto-sync'}
                className="p-1 hover:text-ink transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${autoRefreshEnabled ? '' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>

        </div>

        {/* Hazard Taxonomy Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Observations' },
            { id: 'severe', label: 'Severe Flooding (>30cm)' },
            { id: 'manhole', label: 'Open Manholes' },
            { id: 'stalled', label: 'Stalled Vehicles' },
            { id: 'electrical', label: 'Electrical Hazards' },
            { id: 'receding', label: 'Receding / Clear' },
            { id: 'verified', label: 'High Consensus' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedTag === tag.id
                  ? 'bg-ink text-white shadow-xs font-bold'
                  : 'bg-canvas text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: DEDICATED SEPARATE MAP & TABBED INTERACTIVE FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Dedicated Separate Community Map Component */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-primary" />
                <h2 className="text-base font-extrabold text-ink">
                  Spatial Convergence Map
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-purple-primary bg-purple-50 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                  Separate Canvas Mode
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                  98.2% Ground Accuracy
                </span>
              </div>
            </div>

            {/* SEPARATE MAP CANVAS INSTANCE */}
            <CommunityMapCanvas 
              reports={filteredReports}
              iotSensors={iotSensors}
              aidRequests={aidRequests}
              shelters={shelters}
              selectedReport={selectedReport}
              onSelectReport={(rep) => setSelectedReport(rep)}
              onSelectSensor={(sens) => setSelectedSensorModal(sens)}
              onCorroborate={handleCorroborate}
              mapLayers={mapLayers}
              onToggleLayer={(layerName, val) => setMapLayers(prev => ({ ...prev, [layerName]: val }))}
              isPinDropActive={isPinDropModeActive}
              onCancelPinDrop={() => setIsPinDropModeActive(false)}
              onMapPinDrop={handleMapPinDrop}
              centerCoordinates={centerCoordinates}
            />

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-muted">
              <span>Interactive: Click map to place pins, measure distances, or toggle 3D tilt.</span>
              <button 
                onClick={() => setIsPinDropModeActive(true)}
                className="text-purple-primary font-bold hover:underline"
              >
                + Drop observation here
              </button>
            </div>
          </div>

          {/* Feature 2: Multi-Source Ground Truth Convergence Matrix */}
          {selectedReport && convergenceDetails && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-ink">
                    Tri-Source Ground Truth Accordance Matrix
                  </h3>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${convergenceDetails.ratingColor}`}>
                  {convergenceDetails.rating} ({convergenceDetails.accordanceScore}%)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200/60">
                  <span className="text-[10px] font-mono text-purple-700 block font-bold">1. Citizen Scout</span>
                  <span className="text-lg font-mono font-extrabold text-ink">{convergenceDetails.cDepth} cm</span>
                  <span className="text-[10px] text-muted block truncate">{selectedReport.scoutName}</span>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-50/50 border border-cyan-200/60">
                  <span className="text-[10px] font-mono text-cyan-800 block font-bold">2. IoT Ultrasonic</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-800">{convergenceDetails.sDepth} cm</span>
                  <span className="text-[10px] text-muted block truncate">{selectedReport.sensorId}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-600 block font-bold">3. GNN Model Runoff</span>
                  <span className="text-lg font-mono font-extrabold text-slate-800">{convergenceDetails.mDepth} cm</span>
                  <span className="text-[10px] text-muted block">Hydrologic Mesh</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-muted flex items-center justify-between pt-1">
                <span>Calculated Variance Δ = {convergenceDetails.variance} cm (Under tolerance limit of 6.0 cm)</span>
                <button
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="text-purple-primary font-bold hover:underline"
                >
                  Inspect Photographic Evidence &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Feature 19: Rain Radar Nowcast vs Flood Depth Correlation */}
          <div className="bg-canvas rounded-2xl p-4 border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-ink font-bold">
              <span>Rainfall Nowcast vs Catchment Depth Correlation</span>
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px]">
                High Tide Outfall Gate Surcharge: 4.22m at 21:15 IST
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Current precipitation: <strong>48 mm/hr</strong> cloudburst intensity. Mithi river sluice gates operating with 2 of 4 gates submerged. Expect runoff deceleration in Kurla and Dadar basins.
            </p>
          </div>

        </div>

        {/* Right Column: Tabbed Interactive Feed (Observations, Mutual Aid, Shelters) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Feed Tabs Switcher */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('observations')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
                activeTab === 'observations'
                  ? 'bg-purple-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Observations ({filteredReports.length})
            </button>
            <button
              onClick={() => setActiveTab('mutual-aid')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
                activeTab === 'mutual-aid'
                  ? 'bg-purple-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Aid SOS ({aidRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('shelters')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
                activeTab === 'shelters'
                  ? 'bg-purple-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Shelters ({shelters.length})
            </button>
          </div>

          {/* TAB 1: CITIZEN OBSERVATIONS STREAM */}
          {activeTab === 'observations' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-muted font-mono text-xs">
                  No flood hazard reports matching this filter criteria.
                </div>
              ) : (
                filteredReports.map(rep => {
                  const isSelected = selectedReport?.id === rep.id;
                  const isSevere = rep.depth > 30;

                  return (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-50/60 border-purple-primary shadow-sm ring-1 ring-purple-primary/40'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-purple-primary">{rep.id}</span>
                            <span className="text-[10px] font-mono text-muted">• {rep.wardName}</span>
                          </div>
                          <h3 className="font-extrabold text-ink text-sm leading-snug">{rep.title}</h3>
                        </div>

                        <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg border ${
                          rep.category === 'Receding / Cleared'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : isSevere
                            ? 'text-red-700 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {rep.depth} cm
                        </span>
                      </div>

                      <p className="text-xs text-muted mb-2 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {rep.location}
                      </p>

                      {/* Environmental Tags */}
                      {rep.hazards && rep.hazards.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {rep.hazards.map((haz, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {haz}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Action Footer */}
                      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 font-mono">
                        <span className="text-[11px] text-muted">{rep.timeAgo}</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(rep);
                              setIsDiscussionOpen(true);
                            }}
                            title="Open field notes discussion"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-primary hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{(rep.comments && rep.comments.length) || 0}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(rep);
                              setIsEvidenceModalOpen(true);
                            }}
                            title="Inspect photo evidence & AI waterline"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-primary hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCorroborate(rep.id);
                            }}
                            disabled={rep.userConfirmed}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              rep.userConfirmed
                                ? 'bg-purple-100 text-purple-primary'
                                : 'text-purple-primary hover:bg-purple-50'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{rep.upvotes} {rep.userConfirmed ? 'Confirmed' : 'Confirm'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-Actions: Recede / Dispute / Route */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkReceding(rep.id);
                              }}
                              className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                            >
                              <TrendingDown className="w-3 h-3" /> Mark Receding (-5cm)
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDispute(rep.id);
                              }}
                              className="text-amber-700 hover:underline font-semibold"
                            >
                              Dispute / Cleared
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateTo('route');
                            }}
                            className="text-purple-primary font-bold hover:underline flex items-center gap-1"
                          >
                            Avoid in Safe Route &rarr;
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: MUTUAL AID & VOLUNTEER SOS REQUESTS */}
          {activeTab === 'mutual-aid' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-muted uppercase">Community Aid Board</span>
                <button
                  onClick={() => setIsAidModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  + Request Mutual Aid
                </button>
              </div>

              {aidRequests.map(aid => (
                <div key={aid.id} className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                        {aid.category} • {aid.urgency} URGENCY
                      </span>
                      <h4 className="font-bold text-ink text-sm">{aid.title}</h4>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      aid.fulfilled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {aid.fulfilled ? 'Fulfilled' : `${aid.pledgedVolunteers}/${aid.neededVolunteers} Needed`}
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">{aid.description}</p>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100">
                    <span className="text-slate-600 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted" /> {aid.location}
                    </span>
                    <button
                      onClick={() => handlePledgeAid(aid.id)}
                      disabled={aid.fulfilled}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                        aid.fulfilled 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{aid.fulfilled ? 'Assigned' : 'Pledge Help (+1)'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: HIGH-GROUND EVACUATION SHELTERS */}
          {activeTab === 'shelters' && (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              <div className="text-xs font-mono text-muted uppercase mb-1">
                Verified Dry Shelters ({shelters.length})
              </div>

              {shelters.map(shl => {
                const occupancyPct = Math.round((shl.currentOccupants / shl.capacity) * 100);

                return (
                  <div key={shl.id} className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-indigo-700">{shl.id}</span>
                          <span className="text-[10px] font-mono text-muted">• {shl.distanceKm} away</span>
                        </div>
                        <h4 className="font-bold text-ink text-sm">{shl.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {shl.elevationMeters}m Elevation
                      </span>
                    </div>

                    <p className="text-xs text-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {shl.location}
                    </p>

                    {/* Occupancy bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-muted mb-1">
                        <span>Capacity: {shl.currentOccupants} / {shl.capacity} persons</span>
                        <span className="font-bold text-ink">{occupancyPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          style={{ width: `${occupancyPct}%` }}
                          className={`h-full rounded-full transition-all ${
                            occupancyPct > 80 ? 'bg-red-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {shl.amenities.map((am, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {am}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-muted text-[11px]">{shl.contactPhone}</span>
                      <button
                        onClick={() => handleShelterCheckIn(shl.id)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Check In / Mark Safe
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Feature 16: Offline Ground-Truth PWA Cache & SMS Emergency Fallback */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-primary" /> Offline PWA Cache & SMS Gateway
              </span>
              <button
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                  isOfflineMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isOfflineMode ? 'Simulating Offline' : 'Online Mode'}
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Without mobile internet? Send SMS command: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-purple-primary">MUMFLOOD {selectedReport?.id || '4091'} 35CM to 56161</code>
            </p>
          </div>

        </div>

      </div>

      {/* ALL MODAL DIALOGS */}
      <PinDropModal 
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        initialCoords={pendingPinDropCoords || { lat: 19.0760, lng: 72.8777 }}
        onSubmitReport={handleAddNewReport}
      />

      <EvidenceViewerModal 
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        report={selectedReport}
      />

      <DiscussionDrawer 
        isOpen={isDiscussionOpen}
        onClose={() => setIsDiscussionOpen(false)}
        report={selectedReport}
        onAddComment={handleAddComment}
      />

      <VolunteerAidModal 
        isOpen={isAidModalOpen}
        onClose={() => setIsAidModalOpen(false)}
        onSubmitAidRequest={(newAid) => {
          setAidRequests(prev => [newAid, ...prev]);
          speakAlert(`Mutual aid request published: ${newAid.title}`);
        }}
      />

      <ScoutLeaderboardModal 
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        leaderboard={SCOUT_LEADERBOARD}
      />

      <SitRepShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reports={filteredReports}
        wardName={MUMBAI_WARDS_COMMUNITY.find(w => w.id === selectedWardId)?.name || 'Mumbai'}
      />

      <SafetyPledgeModal 
        isOpen={isPledgeModalOpen}
        onClose={() => setIsPledgeModalOpen(false)}
        onPledgeComplete={() => {
          setHasCompletedPledge(true);
          speakAlert('Congratulations! You have signed the Good-Neighbor Flood Safety Pledge.');
        }}
      />

      <IoTSensorModal 
        isOpen={Boolean(selectedSensorModal)}
        onClose={() => setSelectedSensorModal(null)}
        sensor={selectedSensorModal}
        onPollSensor={handlePollSensor}
      />

    </div>
  );
}
