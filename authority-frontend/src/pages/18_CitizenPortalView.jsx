import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFloodCommand } from '../context/FloodCommandContext';
import { ROAD_CORRIDORS, CITIZEN_REPORTS } from '../data/floodData';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Send,
  PhoneCall,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  Camera,
  Navigation,
  Info,
  ArrowLeft,
} from 'lucide-react';

export default function CitizenPortalView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState(CITIZEN_REPORTS);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newDepth, setNewDepth] = useState('Knee-deep (approx 30 cm)');
  const [newComment, setNewComment] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleUpvote = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r))
    );
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!newLocation) return;
    const newEntry = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      user: 'You (Citizen Report)',
      location: newLocation,
      reportedDepth: newDepth,
      verifiedDepth: 25,
      timestamp: 'Just now',
      status: 'UNDER VERIFICATION BY HYDRO-PINN',
      votes: 1,
      comment: newComment || 'Water logging reported via mobile portal.',
    };
    setReports([newEntry, ...reports]);
    setShowReportModal(false);
    setNewLocation('');
    setNewComment('');
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFC] overflow-y-auto">
      {/* Authority Control Bar to return */}
      <div className="bg-purple text-white px-6 py-2.5 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-semibold text-[10px]">
            PUBLIC PREVIEW
          </span>
          <span>
            Viewing <strong>JalDrishti Mumbai Citizen Flood Companion</strong> (Public Facing UI)
          </span>
        </div>
        <Link
          to="/command"
          className="px-3 py-1 bg-white text-purple rounded-md font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Command Center
        </Link>
      </div>

      {/* Hero Branding & Safe Travel Checker */}
      <div className="bg-white border-b border-border px-6 py-8 shadow-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-purple font-bold text-xs uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 text-purple" />
            JalDrishti • MCGM Disaster Cell Public Service
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            Mumbai Live Flood Passability & Road Safety
          </h1>
          <p className="text-xs md:text-sm text-ink-secondary mt-1">
            Real-time verified street water levels, safe driving corridors, and citizen incident reporting.
          </p>

          {/* Quick Route Status Check Input */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="w-4 h-4 text-ink-secondary absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Check your route: e.g. Dadar, Andheri Subway, Sion, LBS Marg..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-secondary text-xs text-ink focus:outline-none focus:border-purple focus:bg-white transition-all shadow-subtle"
              />
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-2.5 bg-purple text-white text-xs font-semibold rounded-xl hover:bg-purple-deep transition-all shadow-subtle flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Report Water Logging
            </button>
          </div>

          {/* Emergency Helpline Numbers */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-ink-secondary">
            <span className="font-semibold text-ink flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-status-alert" />
              Emergency Helplines:
            </span>
            <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
              MCGM Disaster: 1916
            </span>
            <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
              Ambulance: 108
            </span>
            <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
              Fire Service: 101
            </span>
            <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
              Traffic Helpline: 8454999999
            </span>
          </div>
        </div>
      </div>

      {submissionSuccess && (
        <div className="max-w-4xl mx-auto w-full px-6 pt-4">
          <div className="p-3 bg-status-safe-soft text-status-safe border border-status-safe/30 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Your water logging report was received and queued for hydrodynamic model verification!
          </div>
        </div>
      )}

      {/* Main Content: Road Status & Crowdsourced Feeds */}
      <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Passability Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple" />
              Major Corridors & Underpass Status
            </h2>
            <span className="text-[11px] font-mono text-ink-secondary">
              Updated every 60s from Municipal Sensors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROAD_CORRIDORS.filter(
              (r) =>
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.ward.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((road) => (
              <div
                key={road.id}
                className="p-4 bg-white rounded-xl border border-border shadow-subtle hover:border-purple/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-ink">{road.name}</h3>
                      <p className="text-[11px] text-ink-secondary mt-0.5 font-medium">
                        {road.ward}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        road.status === 'CRITICAL'
                          ? 'bg-status-alert text-white'
                          : road.status === 'HIGH RISK'
                          ? 'bg-status-amber text-white'
                          : 'bg-status-safe text-white'
                      }`}
                    >
                      {road.status === 'CRITICAL'
                        ? 'CLOSED'
                        : road.status === 'HIGH RISK'
                        ? 'CAUTION'
                        : 'CLEAR'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-ink-secondary">Current Depth:</span>
                    <span className="font-mono font-bold text-ink">
                      {road.currentDepth} cm
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-ink-secondary">Traffic Flow:</span>
                    <span className="font-medium text-ink truncate max-w-[200px]">
                      {road.trafficStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-border text-[11px] text-ink-secondary flex items-center justify-between">
                  <span>Advise: {road.cause}</span>
                  <span className="font-mono text-purple font-semibold">
                    Peak {road.peakTime.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crowdsourced Incident Feed */}
        <div className="bg-white rounded-xl border border-border shadow-subtle p-5">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Navigation className="w-4 h-4 text-purple" />
                Community Water Logging Reports
              </h2>
              <p className="text-xs text-ink-secondary">
                Citizen-reported incidents cross-checked against municipal acoustic sensors.
              </p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="text-xs font-semibold text-purple hover:underline"
            >
              + Submit New Report
            </button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 bg-surface-secondary/50 rounded-xl border border-border flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-ink">
                      {report.location}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-safe-soft text-status-safe font-semibold">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary mt-1">{report.comment}</p>
                  <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-2">
                    <span>Reported depth: <strong>{report.reportedDepth}</strong></span>
                    <span>•</span>
                    <span>{report.timestamp} by {report.user}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border text-xs text-ink font-semibold hover:border-purple hover:text-purple transition-all shadow-xs flex-shrink-0"
                  title="Upvote / Confirm this report"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-purple" />
                  <span>{report.votes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Guidelines Card */}
        <div className="p-4 bg-purple-soft/30 rounded-xl border border-purple/20 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-ink">Public Monsoon Safety Advisory:</span>
            <p className="text-ink-secondary mt-0.5 leading-relaxed">
              Do not walk or drive through flowing water above 15 cm. Avoid submerged electric substations and stay clear of open storm drains. In case of water logging in basement parking, do not operate elevators.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-h-[90vh] max-w-md w-full p-4 sm:p-6 overflow-y-auto lg:max-h-none lg:overflow-visible">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Send className="w-4 h-4 text-purple" />
                Report Street Flooding
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-ink-secondary hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">
                  Street / Landmark Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Sion Hospital Gate 2 or Kurla Depot"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-ink focus:outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">
                  Observed Water Level
                </label>
                <select
                  value={newDepth}
                  onChange={(e) => setNewDepth(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-ink focus:outline-none focus:border-purple"
                >
                  <option>Ankle-deep (approx 10–15 cm)</option>
                  <option>Knee-deep (approx 30 cm)</option>
                  <option>Waist-deep (approx 50+ cm)</option>
                  <option>Vehicle Submerged / Stalled</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">
                  Details / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Traffic stuck, drain overflowing, barricade needed..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-ink focus:outline-none focus:border-purple"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg text-ink-secondary hover:bg-surface-secondary font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple text-white rounded-lg font-semibold hover:bg-purple-deep transition-all shadow-subtle"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
