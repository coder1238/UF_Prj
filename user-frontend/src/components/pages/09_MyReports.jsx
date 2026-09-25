import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  getStoredReports, saveStoredReports, resetStoredReports, INITIAL_REPORTS
} from '../../data/reportsData';
import { 
  FileText, CheckCircle2, Clock, AlertTriangle, MapPin, 
  ThumbsUp, MessageSquare, ChevronRight, Truck, Droplets,
  Search, ShieldCheck, ArrowRight, Volume2, VolumeX, Printer,
  Download, RefreshCw, Sliders, Camera, Radio, Phone, PhoneCall,
  Award, QrCode, Share2, Send, Zap, ShieldAlert, Sparkles,
  Filter, Layers, ExternalLink, Check, X, Activity, Gauge, Compass,
  PlusCircle, UserCheck, AlertOctagon, RotateCcw
} from 'lucide-react';

// Modals & Sub-components
import SensorVerificationModal from '../reports/SensorVerificationModal';
import ClearanceCertificateModal from '../reports/ClearanceCertificateModal';
import BeforeAfterSliderModal from '../reports/BeforeAfterSliderModal';
import ReportActionsModal from '../reports/ReportActionsModal';
import PumpTelematicsModal from '../reports/PumpTelematicsModal';
import ReportMiniMapRadar from '../reports/ReportMiniMapRadar';
import OfflineQrPassModal from '../reports/OfflineQrPassModal';
import EscalationDeskModal from '../reports/EscalationDeskModal';
import WitnessCorroborationModal from '../reports/WitnessCorroborationModal';
import SimulateIncidentModal from '../reports/SimulateIncidentModal';

export default function MyReports() {
  const { currentWard, speakAlert, voiceLanguage, isOfflineMode } = useFlood();
  const { navigateTo } = useNavigation();

  // Persistent reports state
  const [reports, setReports] = useState(() => getStoredReports());
  const [selectedReportId, setSelectedReportId] = useState(() => {
    const list = getStoredReports();
    return list[0]?.id || 'FLD-2048';
  });

  // Filters & Sorting state
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'in_progress' | 'submitted' | 'assigned' | 'resolved'
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'moderate'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'depth' | 'upvotes' | 'diverted'

  // Active Workspace Tab in Right Column
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'evidence' | 'timeline' | 'impact'

  // Modals state
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isTelematicsModalOpen, setIsTelematicsModalOpen] = useState(false);
  const [isQrPassModalOpen, setIsQrPassModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [isWitnessModalOpen, setIsWitnessModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New Comment Input state
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Audio / Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cross-tab and cross-page synchronization
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setReports(e.detail);
        if (!e.detail.some(r => r.id === selectedReportId)) {
          setSelectedReportId(e.detail[0].id);
        }
      }
    };
    window.addEventListener('urbanflood_reports_updated', handleUpdate);
    return () => window.removeEventListener('urbanflood_reports_updated', handleUpdate);
  }, [selectedReportId]);

  // Selected report object
  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || reports[0] || INITIAL_REPORTS[0];
  }, [reports, selectedReportId]);

  // Filtered & Sorted reports
  const filteredReports = useMemo(() => {
    return reports
      .filter(item => {
        // Text search across ID, title, location, ward, category
        if (ticketSearch.trim()) {
          const q = ticketSearch.toLowerCase();
          const matchId = item.id.toLowerCase().includes(q);
          const matchTitle = (item.title || '').toLowerCase().includes(q);
          const matchLoc = (item.location || '').toLowerCase().includes(q);
          const matchWard = (item.ward || '').toLowerCase().includes(q);
          const matchCat = (item.category || '').toLowerCase().includes(q);
          if (!matchId && !matchTitle && !matchLoc && !matchWard && !matchCat) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'in_progress' && item.status !== 'in_progress' && item.status !== 'assigned') return false;
          if (statusFilter !== 'in_progress' && item.status !== statusFilter) return false;
        }

        // Severity filter
        if (severityFilter !== 'all' && item.severity !== severityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'depth') {
          return (b.depth || 0) - (a.depth || 0);
        }
        if (sortBy === 'upvotes') {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        if (sortBy === 'diverted') {
          return (b.affectedCommutersDiverted || 0) - (a.affectedCommutersDiverted || 0);
        }
        // default newest: use isoTimestamp or ticket numeric ID
        const timeA = a.isoTimestamp ? new Date(a.isoTimestamp).getTime() : 0;
        const timeB = b.isoTimestamp ? new Date(b.isoTimestamp).getTime() : 0;
        return timeB - timeA;
      });
  }, [reports, ticketSearch, statusFilter, severityFilter, sortBy]);

  // Lifecycle stages definition
  const lifecycleStages = [
    { key: 'submitted', label: 'Submitted', desc: 'GPS & Time Logged' },
    { key: 'verified', label: 'Model Verified', desc: 'GNN & Sensor Matched' },
    { key: 'assigned', label: 'Unit Dispatched', desc: 'Pump Crew Mobilized' },
    { key: 'in_progress', label: 'De-Watering Active', desc: '2400 LPM Extraction' },
    { key: 'resolved', label: 'Resolved / Safe', desc: 'Road Reopened' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'submitted': return 0;
      case 'verified': return 1;
      case 'assigned': return 2;
      case 'in_progress': return 3;
      case 'resolved': return 4;
      default: return 2;
    }
  };

  const activeStageIdx = getStageIndex(selectedReport.status);

  // Upvote / Corroborate Handler (Persistent)
  const handleUpvote = (id) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        const isUpvoted = r.userUpvoted;
        return {
          ...r,
          upvotes: isUpvoted ? Math.max(0, (r.upvotes || 1) - 1) : (r.upvotes || 0) + 1,
          userUpvoted: !isUpvoted
        };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast(selectedReport.userUpvoted ? 'Corroboration withdrawn' : 'Corroboration (+1) recorded in municipal ledger!');
  };

  // Simulate advancing the stage of the current report
  const handleAdvanceStage = () => {
    const stageOrder = ['submitted', 'verified', 'assigned', 'in_progress', 'resolved'];
    const currentIdx = stageOrder.indexOf(selectedReport.status);
    const nextIdx = (currentIdx + 1) % stageOrder.length;
    const nextStatus = stageOrder[nextIdx];

    const updated = reports.map(r => {
      if (r.id === selectedReport.id) {
        const isResolvedNow = nextStatus === 'resolved';
        return {
          ...r,
          status: nextStatus,
          statusColor: isResolvedNow ? 'green' : nextStatus === 'submitted' ? 'purple' : 'amber',
          depth: isResolvedNow ? 0 : r.depth,
          steps: r.steps ? r.steps.map((st, i) => {
            if (i < nextIdx) return { ...st, status: 'COMPLETED' };
            if (i === nextIdx) return { ...st, status: 'ACTIVE', time: 'Just now' };
            return { ...st, status: 'PENDING' };
          }) : r.steps
        };
      }
      return r;
    });

    setReports(updated);
    saveStoredReports(updated);
    showToast(`Stage advanced to "${lifecycleStages[nextIdx].label}" for ticket ${selectedReport.id}`);
  };

  // Update report handler from ReportActionsModal
  const handleUpdateReport = (id, updates) => {
    const updated = reports.map(r => r.id === id ? { ...r, ...updates } : r);
    setReports(updated);
    saveStoredReports(updated);
    showToast(`Ticket #${id} successfully updated`);
  };

  // Withdraw report handler
  const handleWithdrawReport = (id, reason) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'resolved',
          statusColor: 'slate',
          title: `[WITHDRAWN] ${r.title}`,
          depth: 0,
          comments: [
            ...(r.comments || []),
            {
              id: Date.now(),
              author: 'Citizen Reporter (You)',
              role: 'Reporter',
              time: 'Just now',
              text: `Withdrew report: ${reason || 'Observation no longer active or mistaken entry.'}`
            }
          ]
        };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast(`Ticket #${id} marked as withdrawn`);
  };

  // Post comment to discussion thread
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsPostingComment(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      const newComment = {
        id: Date.now(),
        author: 'Citizen Reporter (You)',
        role: 'Reporter',
        time: nowStr,
        text: newCommentText.trim()
      };

      const updated = reports.map(r => {
        if (r.id === selectedReport.id) {
          return {
            ...r,
            comments: [...(r.comments || []), newComment]
          };
        }
        return r;
      });

      setReports(updated);
      saveStoredReports(updated);
      setNewCommentText('');
      setIsPostingComment(false);
      showToast('Citizen field note published to incident timeline');
    }, 400);
  };

  // Toggle SMS subscription
  const handleToggleSms = () => {
    const updated = reports.map(r => {
      if (r.id === selectedReport.id) {
        const nextState = !r.smsSubscribed;
        return { ...r, smsSubscribed: nextState };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast(selectedReport.smsSubscribed ? 'SMS updates paused' : 'Subscribed to live SMS telemetry updates');
  };

  // Add Follow-up Photo from BeforeAfterSliderModal
  const handleAddFollowUpPhoto = (id, photoUrl, note) => {
    const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const updated = reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          afterPhotoUrl: photoUrl,
          comments: [
            ...(r.comments || []),
            {
              id: Date.now(),
              author: 'Citizen Reporter (You)',
              role: 'Reporter',
              time: nowStr,
              text: `Uploaded post-intervention verification photo. ${note}`
            }
          ]
        };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast('Follow-up clearance photo verified & logged');
  };

  // Add Witness Corroboration from WitnessCorroborationModal
  const handleAddWitness = (id, witness, adjustedDepth) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          depth: adjustedDepth || r.depth,
          upvotes: (r.upvotes || 0) + 1,
          witnesses: [...(r.witnesses || []), witness],
          comments: [
            ...(r.comments || []),
            {
              id: Date.now(),
              author: `${witness.name} (${witness.tier})`,
              role: 'Citizen Scout',
              time: witness.time,
              text: `Independent Ground Corroboration: ${witness.note}`
            }
          ]
        };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast(`Ground witness testimony logged for ticket #${id}`);
  };

  // Escalate ticket from EscalationDeskModal
  const handleEscalateTicket = (id, escalationData) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...escalationData,
          comments: [
            ...(r.comments || []),
            {
              id: Date.now(),
              author: 'Emergency Operations Gateway',
              role: 'System',
              time: escalationData.escalationTimestamp,
              text: `LEVEL 2 DISASTER ESCALATION: Elevated to Priority 1 (Disaster Control Room 1916). Trigger: ${escalationData.escalationReason}.`
            }
          ]
        };
      }
      return r;
    });
    setReports(updated);
    saveStoredReports(updated);
    showToast(`Ticket #${id} escalated to Disaster Control Desk`);
  };

  // Add Simulated Report from SimulateIncidentModal
  const handleAddSimulatedReport = (newReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    saveStoredReports(updated);
    setSelectedReportId(newReport.id);
    showToast(`Simulated incident #${newReport.id} created`);
  };

  // Reset to Factory Default Reports
  const handleResetData = () => {
    if (window.confirm('Reset all citizen reports to factory demo state? This will clear custom submissions.')) {
      const reset = resetStoredReports();
      setReports(reset);
      setSelectedReportId(reset[0]?.id || 'FLD-2048');
      showToast('Incident reports reset to initial state');
    }
  };

  // Voice Readout Briefing (Text-To-Speech)
  const handleSpeakBriefing = () => {
    if (!selectedReport) return;
    if (isSpeaking) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `Incident Report ${selectedReport.id}. Location: ${selectedReport.location}. Observed water depth: ${selectedReport.depth} centimeters. Status: ${selectedReport.status.replace('_', ' ')}. Assigned unit: ${selectedReport.unitAssigned?.name || 'Municipal Dewatering Pump'}. Model and sensor agreement is ${selectedReport.sensorMatchScore || 96} percent.`;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      speakAlert(text);
    }
  };

  // Export Single Report as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `incident-${selectedReport.id}-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Incident #${selectedReport.id} JSON dossier downloaded`);
  };

  // Export All Reports as CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Location', 'Ward', 'Water Depth (cm)', 'Status', 'Upvotes', 'Commuters Diverted', 'Assigned Unit'];
    const rows = reports.map(r => [
      `"${r.id}"`,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.category || ''}"`,
      `"${r.severity || ''}"`,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${r.ward || ''}"`,
      r.depth || 0,
      `"${r.status || ''}"`,
      r.upvotes || 0,
      r.affectedCommutersDiverted || 0,
      `"${r.unitAssigned?.name || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mumbai-flood-reports-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('All citizen reports exported as CSV');
  };

  // Copy Ticket Shareable Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/my-reports?ticket=${selectedReport.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Incident link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-mono animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Civic Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-primary font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Incident Audit Trail & Civic De-Watering
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight flex items-center gap-3">
            My Reports & Verification Tracker
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
              {reports.length} Active Records
            </span>
          </h1>
          <p className="text-sm text-muted mt-1 max-w-3xl">
            Audit real-time municipal resolution, acoustic sensor agreement, pump crew telematics, and community validations for all your flood observations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsSimulateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Create a test report from Mumbai hotspots"
          >
            <Zap className="w-3.5 h-3.5" /> Simulate Test Incident
          </button>

          <button 
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Export all reports to CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button 
            onClick={handleResetData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset to factory demo reports"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button 
            onClick={() => navigateTo('report')}
            className="px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Submit New Report
          </button>
        </div>
      </div>

      {/* Feature 1 & 2: Search, Filter & Sort Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              placeholder="Search by ticket # (e.g. FLD-2048), road name, ward, or hazard..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
            />
            {ticketSearch && (
              <button 
                onClick={() => setTicketSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-canvas border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-primary"
            >
              <option value="newest">Newest Intake First</option>
              <option value="depth">Highest Water Depth</option>
              <option value="upvotes">Most Corroborations</option>
              <option value="diverted">Commuter Impact Saved</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-slate-400 font-bold uppercase text-[10px] mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Tickets' },
              { id: 'in_progress', label: 'In-Progress / Dispatched' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'resolved', label: 'Resolved' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
                  statusFilter === pill.id
                    ? 'bg-purple-primary text-white shadow-xs'
                    : 'bg-canvas hover:bg-slate-200 text-slate-600'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-slate-400 font-bold uppercase text-[10px] mr-1">Severity:</span>
            {['all', 'critical', 'high', 'moderate'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono capitalize transition-all ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Filtered Reports List (col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono text-muted uppercase tracking-wider flex justify-between items-center px-1">
            <span>Ticket Queue ({filteredReports.length} of {reports.length})</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Synced
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-ink text-sm">No Matching Tickets Found</h3>
              <p className="text-xs text-muted">Try adjusting your search query or reset filter pills to view tickets.</p>
              <button
                onClick={() => { setTicketSearch(''); setStatusFilter('all'); setSeverityFilter('all'); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredReports.map(rep => {
              const isSelected = rep.id === selectedReport.id;
              const isResolved = rep.status === 'resolved';

              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-purple-50/70 border-purple-primary shadow-md ring-2 ring-purple-primary/30' 
                      : 'bg-white border-slate-200/80 hover:border-purple-primary/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-purple-primary">{rep.id}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          rep.severity === 'critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                          rep.severity === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {rep.severity || 'high'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-ink leading-snug line-clamp-1">{rep.title}</h3>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-0.8 rounded-full font-bold uppercase shrink-0 ${
                      isResolved 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-muted flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{rep.location}</span>
                  </p>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-mono">
                    <span className="text-slate-400 text-[11px]">{rep.submittedAt || rep.timestamp}</span>
                    <span className="text-ink font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                      {rep.depth} cm
                    </span>
                    <span className="text-purple-primary flex items-center gap-1 font-semibold text-[11px]">
                      <ThumbsUp className="w-3 h-3" /> {rep.upvotes || 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Incident Resolution Hub (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* Header of Active Ticket with Quick Controls */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
                  Ticket #{selectedReport.id}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {selectedReport.ward || 'Ward K-West'}
                </span>
                {selectedReport.escalated && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-red-600" /> ESCALATED TO WAR ROOM
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-ink tracking-tight">{selectedReport.title}</h2>
              <p className="text-xs text-muted font-mono mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-primary" /> {selectedReport.location}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-muted block">Current Water Depth</span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-3xl font-mono font-black text-purple-primary">
                  {selectedReport.depth}
                </span>
                <span className="text-xs text-muted font-mono">cm</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                Peak: {selectedReport.initialDepth || selectedReport.depth} cm
              </span>
            </div>
          </div>

          {/* Feature 19: Audio Briefing, Share, and Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-canvas border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakBriefing}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                  isSpeaking ? 'bg-purple-primary text-white animate-pulse' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title="Listen to audio briefing for this ticket"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-primary" />}
                {isSpeaking ? 'Stop Audio' : 'Audio Briefing'}
              </button>

              <button
                onClick={() => setIsQrPassModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center gap-1.5 transition-colors"
                title="Offline pass for police barricade verification"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-primary" /> Barricade Pass
              </button>

              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center gap-1.5 transition-colors"
                title="View official resolution certificate"
              >
                <Award className="w-3.5 h-3.5 text-purple-primary" /> Clearance Cert
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsActionsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-primary" /> Update / Resolve
              </button>

              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 3: Interactive 5-Stage Stepper with Stage Advance Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-600">
                  Incident Resolution Lifecycle
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">
                  Step {activeStageIdx + 1} of 5
                </span>
              </div>

              {/* Advance Stage Simulator Button */}
              <button
                onClick={handleAdvanceStage}
                className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary font-mono text-[11px] font-bold border border-purple-200 flex items-center gap-1 transition-colors"
                title="Simulate progression to next resolution milestone"
              >
                <Zap className="w-3 h-3" /> Advance Next Stage
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative pt-2 pb-1">
              <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-5 left-0 h-1 bg-purple-primary -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(activeStageIdx / (lifecycleStages.length - 1)) * 100}%` }}
              />

              <div className="relative z-10 flex justify-between">
                {lifecycleStages.map((stage, idx) => {
                  const isCompleted = idx <= activeStageIdx;
                  const isCurrent = idx === activeStageIdx;
                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isCompleted 
                          ? 'bg-purple-primary text-white ring-4 ring-purple-soft' 
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-purple-primary' : isCompleted ? 'text-ink' : 'text-muted'}`}>
                        {stage.label}
                      </span>
                      <span className="text-[9px] font-mono text-muted hidden sm:block max-w-[85px] leading-tight mt-0.5">
                        {stage.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Right Column */}
          <div className="border-b border-slate-200 flex gap-2 text-xs font-bold">
            {[
              { id: 'telemetry', label: 'Live Telemetry & Dewatering', icon: Truck },
              { id: 'evidence', label: 'Ground Proof & AI Vision', icon: Layers },
              { id: 'timeline', label: 'Discussion & Log', icon: MessageSquare },
              { id: 'impact', label: 'Civic Impact & Witnesses', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-2 border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-primary text-purple-primary font-bold'
                      : 'border-transparent text-slate-500 hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Live Telemetry & Dewatering */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Feature 4 & 5: Municipal Pump Telematics Card */}
              <div className="bg-canvas rounded-3xl p-5 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-primary text-white shadow-sm">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">
                        {selectedReport.unitAssigned?.name || 'High-Capacity Dewatering Pump Unit #7'}
                      </h4>
                      <span className="text-xs font-mono text-muted">
                        Asset ID: {selectedReport.unitAssigned?.id || 'DMU-04F'} • Reg: {selectedReport.unitAssigned?.vehicleReg || 'MH-02-EE-4102'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTelematicsModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Activity className="w-3.5 h-3.5" /> Telematics Console
                    </button>

                    <button
                      onClick={() => setIsEscalationModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-purple-primary" /> Call Officer
                    </button>
                  </div>
                </div>

                {/* Telematics Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-muted block text-[10px] font-mono">PUMP ROTATION</span>
                    <span className="text-lg font-black font-mono text-ink">
                      {selectedReport.unitAssigned?.pumpRpm || 1850} <span className="text-[10px] font-normal text-purple-primary">RPM</span>
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-muted block text-[10px] font-mono">DISCHARGE RATE</span>
                    <span className="text-lg font-black font-mono text-purple-primary">
                      {selectedReport.unitAssigned?.dischargeRateLpm || 2400} <span className="text-[10px] font-normal text-muted">LPM</span>
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-muted block text-[10px] font-mono">DIESEL LEVEL</span>
                    <span className="text-lg font-black font-mono text-emerald-600">
                      {selectedReport.unitAssigned?.fuelPct || 84}%
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-muted block text-[10px] font-mono">DRAIN OUTFALL</span>
                    <span className="text-xs font-bold text-ink truncate block mt-1" title={selectedReport.unitAssigned?.drainOutfall}>
                      {(selectedReport.unitAssigned?.drainOutfall || 'Hindmata Culvert').split(' ')[0]} Sluice
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 20: Municipal 60-Minute SLA Meter */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-primary" /> MCGM Stormwater Emergency SLA
                  </span>
                  <span className="text-purple-primary font-bold">Target &lt; 60 Mins</span>
                </div>
                
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-primary to-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedReport.status === 'resolved' ? 100 : 64}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Intake: {selectedReport.submittedAt || 'Today, 20:15 IST'}</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedReport.status === 'resolved' ? '100% Volume Drained' : '64% Flood Volume Evacuated'}
                  </span>
                </div>
              </div>

              {/* Feature 7 & 11: Embedded Mini-Radar & GPS Coordinate Utility */}
              <ReportMiniMapRadar report={selectedReport} />

              {/* Feature 16: Live Rainfall Intensity & Tidal Outfall Telemetry Bar */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-bold uppercase flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-purple-400" /> Catchment Hydro-Meteorology
                  </span>
                  <span className="text-slate-400">Weather Radar Node #MR-09</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">PRECIPITATION</span>
                    <span className="font-bold text-purple-300 text-sm">{selectedReport.rainfallRate || '46 mm/hr'}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">ARABIAN SEA TIDE</span>
                    <span className="font-bold text-emerald-400 text-sm">+4.32m High Tide (22:15)</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">SLUICE FLAP GATES</span>
                    <span className="font-bold text-amber-400 text-sm">Active Dewatering Bypass</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Ground Proof & AI Vision */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Feature 6: Before / After Evidence Preview */}
              <div className="bg-canvas rounded-3xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-primary" />
                    <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                      Optical Ground Proof & Waterline Evidence
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsSliderModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Interactive Split Slider
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-red-600 font-bold uppercase block">
                      Incident Inception Photo ({selectedReport.depth} cm)
                    </span>
                    <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-300 shadow-sm group">
                      <img 
                        src={selectedReport.beforePhotoUrl || selectedReport.photoUrl} 
                        alt="Flood peak"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-mono">
                        GPS Timestamp Tagged
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                      Post-Intervention Verification
                    </span>
                    <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-300 shadow-sm group">
                      <img 
                        src={selectedReport.afterPhotoUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60'} 
                        alt="Cleared roadway"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 bg-emerald-950/80 backdrop-blur-md text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        Drainage Active / Receding
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 7 & 10: AI Multi-Spectral & Acoustic Verification */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-primary" />
                    <h4 className="font-bold text-ink uppercase tracking-wider text-xs">
                      Ultrasonic Gauge & GNN Model Triangulation
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsSensorModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-primary font-bold border border-purple-200 transition-colors"
                  >
                    View Hydro-Model Audit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">OBSERVED</span>
                    <div className="text-xl font-black text-purple-primary">{selectedReport.depth} cm</div>
                    <span className="text-[10px] text-slate-500">Citizen cam</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">ULTRASONIC SENSOR</span>
                    <div className="text-xl font-black text-blue-600">
                      {selectedReport.sensorDepth || (selectedReport.depth - 0.5).toFixed(1)} cm
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {selectedReport.sensorId || 'Sensor Station'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">GNN MODEL MATCH</span>
                    <div className="text-xl font-black text-emerald-600">
                      {selectedReport.sensorMatchScore || 96}%
                    </div>
                    <span className="text-[10px] text-slate-500">High agreement</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-200 text-purple-950 font-sans text-xs">
                  <strong>EXIF Verification:</strong> {selectedReport.exifMetadata?.device || 'Citizen Smartphone Cam'} • Geolocation precision: {selectedReport.exifMetadata?.gpsPrecision || '±2.1m accuracy'} • {selectedReport.exifMetadata?.opticalDepthTag || 'Curb waterline corroborated'}.
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Discussion & Official Incident Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Feature 14: Multi-Party Live Discussion Thread */}
              <div className="bg-canvas rounded-3xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-primary" />
                    <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                      Incident Dispatch Communications ({selectedReport.comments?.length || 0})
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Authenticated Audit Log</span>
                </div>

                {/* Comment Entries */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedReport.comments?.map(comm => (
                    <div 
                      key={comm.id} 
                      className={`p-3.5 rounded-2xl border text-xs ${
                        comm.role === 'Reporter' 
                          ? 'bg-purple-50/70 border-purple-primary/30 ml-4' 
                          : comm.role === 'Ward Officer'
                          ? 'bg-amber-50/70 border-amber-200 mr-4'
                          : 'bg-white border-slate-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-ink">{comm.author}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            comm.role === 'Reporter' ? 'bg-purple-200 text-purple-800' :
                            comm.role === 'Ward Officer' ? 'bg-amber-200 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {comm.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{comm.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans">{comm.text}</p>
                    </div>
                  ))}
                </div>

                {/* Post New Comment Form */}
                <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Provide a ground update or query the ward engineer..."
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isPostingComment || !newCommentText.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              {/* Feature 12: SMS & WhatsApp Emergency Telemetry Switch */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                    Emergency SMS / Broadcast Alerts
                  </h4>
                  <p className="text-xs text-muted mt-0.5">
                    Receive instant push SMS alerts when the dewatering pump arrives or when road is reopened.
                  </p>
                  <span className="text-[11px] font-mono text-purple-primary font-semibold block mt-1">
                    Subscriber Phone: {selectedReport.notificationPhone || '+91 98765 43210'}
                  </span>
                </div>

                <button
                  onClick={handleToggleSms}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs transition-colors shrink-0 ${
                    selectedReport.smsSubscribed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {selectedReport.smsSubscribed ? '✓ SMS Alerts Active' : 'Enable SMS Alerts'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: Civic Impact & Community Witnesses */}
          {activeTab === 'impact' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Feature 11: Civic Impact Metrics Card */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                      Community Safeguard & Traffic Impact
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                    Live Civic Calculation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black font-mono text-emerald-300">
                      {selectedReport.affectedCommutersDiverted || 1420}
                    </div>
                    <span className="text-[10px] font-mono text-purple-200">Commuters Diverted</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black font-mono text-amber-300">
                      {selectedReport.busesRerouted || 6}
                    </div>
                    <span className="text-[10px] font-mono text-purple-200">BEST Buses Rerouted</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black font-mono text-purple-300">
                      {selectedReport.trafficDelaySavedMin || 35}m
                    </div>
                    <span className="text-[10px] font-mono text-purple-200">Delay Saved / Commuter</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      48k
                    </div>
                    <span className="text-[10px] font-mono text-purple-200">Litres Discharged</span>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-purple-200 leading-snug">
                  By logging this observation early, you enabled the BMC control room to activate traffic police barricades and prevent vehicle stalls inside the underpass.
                </p>
              </div>

              {/* Feature 14 & 8: Community Witnesses & Corroboration Feed */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-primary" />
                    <h4 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                      Ground Witnesses & Citizen Scouts ({selectedReport.witnesses?.length || 0})
                    </h4>
                  </div>

                  <button
                    onClick={() => setIsWitnessModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> I Am Also Here
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedReport.witnesses?.map((wit, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-canvas border border-slate-200 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{wit.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                            {wit.tier}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 font-sans">{wit.note}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{wit.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Action Footer & Corroboration Button */}
          <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Feature 8: Persistent Corroboration Engine */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => handleUpvote(selectedReport.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-xs ${
                  selectedReport.userUpvoted 
                    ? 'bg-purple-primary text-white hover:bg-purple-deep' 
                    : 'bg-canvas hover:bg-purple-50 text-purple-primary border border-purple-primary/30'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{selectedReport.userUpvoted ? 'Corroborated ✓' : 'Corroborate Observation (+1)'}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                  {selectedReport.upvotes || 0}
                </span>
              </button>

              <button
                onClick={handleExportJson}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
                title="Download structured JSON incident record"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
            </div>

            <button 
              onClick={() => navigateTo('live-map')}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
            >
              <span>Locate on Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ALL MODALS INTEGRATED */}
      <SensorVerificationModal 
        report={selectedReport}
        isOpen={isSensorModalOpen}
        onClose={() => setIsSensorModalOpen(false)}
      />

      <ClearanceCertificateModal
        report={selectedReport}
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
      />

      <BeforeAfterSliderModal
        report={selectedReport}
        isOpen={isSliderModalOpen}
        onClose={() => setIsSliderModalOpen(false)}
        onAddFollowUpPhoto={handleAddFollowUpPhoto}
      />

      <ReportActionsModal
        report={selectedReport}
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        onUpdateReport={handleUpdateReport}
        onWithdrawReport={handleWithdrawReport}
      />

      <PumpTelematicsModal
        report={selectedReport}
        isOpen={isTelematicsModalOpen}
        onClose={() => setIsTelematicsModalOpen(false)}
      />

      <OfflineQrPassModal
        report={selectedReport}
        isOpen={isQrPassModalOpen}
        onClose={() => setIsQrPassModalOpen(false)}
      />

      <EscalationDeskModal
        report={selectedReport}
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        onEscalateTicket={handleEscalateTicket}
      />

      <WitnessCorroborationModal
        report={selectedReport}
        isOpen={isWitnessModalOpen}
        onClose={() => setIsWitnessModalOpen(false)}
        onAddWitness={handleAddWitness}
      />

      <SimulateIncidentModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onAddSimulatedReport={handleAddSimulatedReport}
      />

    </div>
  );
}
