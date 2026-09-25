import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SYSTEM_DATA_FEEDS,
  SYSTEM_LOGS
} from '../data/floodData';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  RefreshCw,
  Download,
  Radio,
  Zap,
  ShieldCheck,
  Network,
  AlertCircle,
  BellRing,
  Radar,
  Lock,
  Sliders,
  Archive,
  HardDrive,
  FileText,
  SunMedium,
  ShieldAlert,
  FileCode,
  Search,
  Pause,
  Play,
  Trash2,
  Plus,
  ChevronRight,
  Filter
} from 'lucide-react';

import {
  TWENTY_HEALTH_FEATURES,
  INITIAL_QUEUES_DATA,
  SUBSYSTEM_DIAGNOSTICS_DATA
} from '../components/system-health/systemHealthConstants';

import {
  ClusterTopologyModal,
  KafkaPipelineModal,
  PostgisProfilerModal,
  IoTSensorFleetModal,
  VectorTileCacheModal,
  SweCudaProfilerModal,
  FailoverDrillModal
} from '../components/system-health/SystemHealthModalsGroup1';

import {
  NetworkLatencyModal,
  SensorDriftModal,
  CapBroadcastGatewayModal,
  RadarQcInspectorModal,
  SslPkiTrackerModal,
  ApiRateGovernorModal,
  BackupPitrModal
} from '../components/system-health/SystemHealthModalsGroup2';

import {
  StorageNvmeArrayModal,
  SyntheticHealthProberModal,
  IncidentPostmortemModal,
  SensorSolarTelemetryModal,
  WafFirewallTelemetryModal,
  Sha256AuditChainModal,
  SubsystemDeepDiveModal,
  FeedStreamInspectorModal,
  QueueManagerModal,
  FlushCacheModal
} from '../components/system-health/SystemHealthModalsGroup3';

export default function DataSystemHealth() {
  // Feed Streams State
  const [feeds, setFeeds] = useState(SYSTEM_DATA_FEEDS);
  const [feedSearch, setFeedSearch] = useState('');
  const [feedStatusFilter, setFeedStatusFilter] = useState('ALL');
  const [selectedFeedForInspect, setSelectedFeedForInspect] = useState(null);

  // Subsystem Diagnostics Modal State
  const [activeSubsystemId, setActiveSubsystemId] = useState(null);

  // Queues State
  const [queues, setQueues] = useState(INITIAL_QUEUES_DATA);
  const [activeQueueId, setActiveQueueId] = useState(null);

  // Terminal & Logs State
  const [logs, setLogs] = useState(SYSTEM_LOGS);
  const [logSearch, setLogSearch] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState('ALL');
  const [isStreamingLogs, setIsStreamingLogs] = useState(true);
  const terminalEndRef = useRef(null);

  // Quick Action Modals
  const [isFlushModalOpen, setIsFlushModalOpen] = useState(false);

  // 20 New Features Active Modal State
  const [activeFeatureModal, setActiveFeatureModal] = useState(null);
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState('ALL');
  const [featureSearch, setFeatureSearch] = useState('');

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Simulated live log streaming engine
  useEffect(() => {
    if (!isStreamingLogs) return;

    const sampleStreamMessages = [
      { level: 'INFO', message: 'Doppler beam sweep +0.5° ingested: 1,440 azimuth rays verified.' },
      { level: 'INFO', message: 'PostGIS spatial query executor: index scan completed in 3.4ms.' },
      { level: 'INFO', message: 'Tegola vector tile 14/11739/7488 served from L1 Redis cache.' },
      { level: 'WARN', message: 'Minor LoRaWAN packet jitter on Mithi sensor node WL_09 (-88 dBm).' },
      { level: 'INFO', message: 'Automated Weather Station Santacruz_AWS_04 transmitted rain rate 68.5 mm/h.' },
      { level: 'INFO', message: 'Emergency dispatch routing engine generated alternate route #R-4892.' },
      { level: 'INFO', message: '2D SWE GPU CUDA kernel step converged in 28 iterations (CFL: 0.68).' }
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
      const pick = sampleStreamMessages[Math.floor(Math.random() * sampleStreamMessages.length)];
      setLogs((prev) => [...prev.slice(-30), { time: timeStr, level: pick.level, message: pick.message }]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isStreamingLogs]);

  // Handle Ingest Status Toggle
  const handleToggleFeedStatus = (feedSource) => {
    setFeeds((prev) =>
      prev.map((f) =>
        f.source === feedSource
          ? { ...f, status: f.status === 'ONLINE' ? 'DEGRADED' : 'ONLINE' }
          : f
      )
    );
  };

  // Filter Feeds
  const filteredFeeds = useMemo(() => {
    return feeds.filter((f) => {
      const matchSearch =
        f.source.toLowerCase().includes(feedSearch.toLowerCase()) ||
        f.protocol.toLowerCase().includes(feedSearch.toLowerCase()) ||
        f.coverage.toLowerCase().includes(feedSearch.toLowerCase());
      const matchStatus = feedStatusFilter === 'ALL' || f.status === feedStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [feeds, feedSearch, feedStatusFilter]);

  // Filter Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch = l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.time.includes(logSearch);
      const matchLevel = logLevelFilter === 'ALL' || l.level === logLevelFilter;
      return matchSearch && matchLevel;
    });
  }, [logs, logSearch, logLevelFilter]);

  // Filter 20 New Features
  const filteredFeatures = useMemo(() => {
    return TWENTY_HEALTH_FEATURES.filter((item) => {
      const matchCategory = featureCategoryFilter === 'ALL' || item.category === featureCategoryFilter;
      const matchSearch =
        item.title.toLowerCase().includes(featureSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(featureSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(featureSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [featureCategoryFilter, featureSearch]);

  // Categories list for 20 features
  const featureCategories = useMemo(() => {
    const cats = new Set(TWENTY_HEALTH_FEATURES.map((f) => f.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  // Export Real System Health JSON dump
  const handleExportSystemHealth = () => {
    const dump = {
      generatedAt: new Date().toISOString(),
      platform: 'MCGM Municipal Disaster Management Telemetry Platform',
      overallStatus: 'NOMINAL (98.7%)',
      subsystems: SUBSYSTEM_DIAGNOSTICS_DATA,
      ingestionFeeds: feeds,
      queues: queues,
      twentyFeaturesState: TWENTY_HEALTH_FEATURES.map((f) => ({
        id: f.id,
        title: f.title,
        category: f.category,
        badge: f.badge
      })),
      recentLogs: logs
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-system-health-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Real-time system health telemetry snapshot exported (.json).');
  };

  // Inject Diagnostic Log
  const handleInjectLog = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    setLogs((prev) => [
      ...prev,
      {
        time: timeStr,
        level: 'INFO',
        message: `Diagnostic operator probe injected manually by Authority Admin at ${timeStr}. All node circuits nominal.`
      }
    ]);
    showToast('Diagnostic log appended to live stream.');
  };

  // Download Raw Terminal Logs (.log)
  const handleDownloadLogs = () => {
    const logContent = logs.map((l) => `${l.time} [${l.level}] ${l.message}`).join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsystem-telemetry-stream-${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Subsystem raw logs downloaded (.log).');
  };

  return (
    <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
        <div>
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple" />
            Infrastructure Telemetry, Ingest Pipelines &amp; Health Operations
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Real-time sensor freshness monitoring, queue telemetry, and 20 mission-critical operational tools
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => showToast('Cluster health check re-evaluated: All 5 primary nodes nominal.')}
            className="px-2.5 py-1 rounded-md bg-status-safe-soft text-status-safe font-bold hover:bg-status-safe/20 transition-colors flex items-center gap-1.5"
            title="Click to re-verify cluster health"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SYSTEM STATUS: NOMINAL (98.7%)</span>
          </button>
          <span className="px-2.5 py-1 rounded-md bg-purple/10 text-purple font-semibold border border-purple/20">
            20 OPERATIONAL MODULES ACTIVE
          </span>
        </div>
      </div>

      {/* Top 5 Subsystem Availability Strip - Fully Interactive Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple" />
            Core Municipal Subsystem Availability (Click card for Deep-Dive Diagnostics)
          </span>
          <span className="text-[10px] font-mono text-purple">5 Subsystems Clustered</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Card 1: API Gateway */}
          <div
            onClick={() => setActiveSubsystemId('api-gateway')}
            className="bg-surface border border-border hover:border-purple rounded-xl p-3 shadow-subtle transition-all cursor-pointer group hover:bg-purple/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary group-hover:text-purple font-semibold">
                API Gateway
              </span>
              <ChevronRight className="w-3 h-3 text-ink-secondary group-hover:text-purple transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-xl font-bold font-mono text-ink mt-1">99.89%</div>
            <div className="text-[10px] font-mono text-status-safe">p99 Latency: 42ms</div>
            <div className="text-[9px] font-mono text-ink-secondary mt-1">3 Clustered Nodes (Worli)</div>
          </div>

          {/* Card 2: PostGIS DB */}
          <div
            onClick={() => setActiveSubsystemId('spatial-db')}
            className="bg-surface border border-border hover:border-purple rounded-xl p-3 shadow-subtle transition-all cursor-pointer group hover:bg-purple/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary group-hover:text-purple font-semibold">
                Spatial PostGIS DB
              </span>
              <ChevronRight className="w-3 h-3 text-ink-secondary group-hover:text-purple transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-xl font-bold font-mono text-ink mt-1">99.97%</div>
            <div className="text-[10px] font-mono text-ink-secondary">42/100 Active Conns</div>
            <div className="text-[9px] font-mono text-status-safe mt-1">Hot Standby Ready</div>
          </div>

          {/* Card 3: Geospatial GIS Engine */}
          <div
            onClick={() => setActiveSubsystemId('gis-engine')}
            className="bg-surface border border-border hover:border-purple rounded-xl p-3 shadow-subtle transition-all cursor-pointer group hover:bg-purple/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary group-hover:text-purple font-semibold">
                Geospatial GIS Engine
              </span>
              <ChevronRight className="w-3 h-3 text-ink-secondary group-hover:text-purple transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-xl font-bold font-mono text-ink mt-1">99.93%</div>
            <div className="text-[10px] font-mono text-status-safe">Render: 18ms</div>
            <div className="text-[9px] font-mono text-purple mt-1">3,840 tiles/s</div>
          </div>

          {/* Card 4: GPU SWE Simulation */}
          <div
            onClick={() => setActiveSubsystemId('gpu-swe')}
            className="bg-surface border border-border hover:border-purple rounded-xl p-3 shadow-subtle transition-all cursor-pointer group hover:bg-purple/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary group-hover:text-purple font-semibold">
                GPU SWE Simulation
              </span>
              <ChevronRight className="w-3 h-3 text-ink-secondary group-hover:text-purple transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-xl font-bold font-mono text-ink mt-1">97.80%</div>
            <div className="text-[10px] font-mono text-purple font-semibold">4x H100 (68% Load)</div>
            <div className="text-[9px] font-mono text-status-warning mt-1">High VRAM Load</div>
          </div>

          {/* Card 5: Routing & CAD API */}
          <div
            onClick={() => setActiveSubsystemId('routing-api')}
            className="bg-surface border border-border hover:border-purple rounded-xl p-3 shadow-subtle transition-all cursor-pointer group hover:bg-purple/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary group-hover:text-purple font-semibold">
                Routing &amp; CAD API
              </span>
              <ChevronRight className="w-3 h-3 text-ink-secondary group-hover:text-purple transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-xl font-bold font-mono text-ink mt-1">99.91%</div>
            <div className="text-[10px] font-mono text-status-safe">Error Rate: 0.002%</div>
            <div className="text-[9px] font-mono text-ink-secondary mt-1">540 dispatches/s</div>
          </div>
        </div>
      </div>

      {/* Main Workspace (Feeds + Queues + Live Terminal) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: 8 Core Ingest Data Feeds Table (Interactive) (7 cols) */}
        <div className="xl:col-span-7 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple" />
                Geospatial &amp; Telemetry Ingestion Streams ({filteredFeeds.length} of {feeds.length})
              </h3>
              <p className="text-[11px] text-ink-secondary">Click any stream row to inspect payload and force synchronization</p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              {['ALL', 'ONLINE', 'DEGRADED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFeedStatusFilter(st)}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    feedStatusFilter === st
                      ? 'bg-purple text-white border-purple font-bold'
                      : 'bg-surface border-border text-ink-secondary hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar for feeds */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search feed streams by name, sensor protocol, or ward coverage..."
              value={feedSearch}
              onChange={(e) => setFeedSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-secondary/40 border border-border text-ink text-xs focus:outline-none focus:border-purple"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                  <th className="pb-2">Feed Source</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Last Update</th>
                  <th className="pb-2">Latency</th>
                  <th className="pb-2">Quality</th>
                  <th className="pb-2 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFeeds.map((feed) => (
                  <tr
                    key={feed.source}
                    onClick={() => setSelectedFeedForInspect(feed)}
                    className="hover:bg-purple/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 font-semibold text-ink">
                      <div className="group-hover:text-purple transition-colors">{feed.source}</div>
                      <div className="text-[10px] font-normal text-ink-secondary truncate max-w-[220px]">
                        {feed.protocol}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          feed.status === 'ONLINE'
                            ? 'bg-status-safe-soft text-status-safe'
                            : feed.status === 'DEGRADED'
                            ? 'bg-status-warning-soft text-status-warning'
                            : 'bg-status-alert-soft text-status-alert'
                        }`}
                      >
                        {feed.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-ink-secondary">{feed.lastUpdate}</td>
                    <td className="py-2.5 font-mono text-[11px] text-ink">{feed.latency}</td>
                    <td className="py-2.5 font-mono text-[11px] font-bold text-purple">{feed.quality}</td>
                    <td className="py-2.5 text-right font-mono text-[10px] text-ink-secondary group-hover:text-purple">
                      View &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Queues & Monospace Terminal Console (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          {/* Execution Queues - Interactive */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple" />
                Real-Time Execution Queues (Click to Manage)
              </span>
              <span className="text-[10px] font-mono text-status-safe font-semibold">CELERY CLUSTER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
              {/* Queue 1: Radar Ingest */}
              <div
                onClick={() => setActiveQueueId('radar-ingest')}
                className="p-2 bg-surface-secondary hover:bg-purple/10 rounded-lg border border-border hover:border-purple transition-all cursor-pointer text-left"
              >
                <div className="text-[9px] text-ink-secondary truncate">Radar Ingest</div>
                <div className="font-bold text-ink mt-0.5 text-xs">{queues['radar-ingest'].throughput}</div>
                <div className="text-[9px] text-status-safe">Queue: {queues['radar-ingest'].queueDepth}</div>
              </div>

              {/* Queue 2: 2D SWE */}
              <div
                onClick={() => setActiveQueueId('swe-queue')}
                className="p-2 bg-surface-secondary hover:bg-purple/10 rounded-lg border border-border hover:border-purple transition-all cursor-pointer text-left"
              >
                <div className="text-[9px] text-ink-secondary truncate">2D SWE Queue</div>
                <div className="font-bold text-status-alert mt-0.5 text-xs">{queues['swe-queue'].queueDepth} queued</div>
                <div className="text-[9px] text-ink-secondary">Wait: 28s</div>
              </div>

              {/* Queue 3: CAP Broadcast */}
              <div
                onClick={() => setActiveQueueId('cap-broadcast')}
                className="p-2 bg-surface-secondary hover:bg-purple/10 rounded-lg border border-border hover:border-purple transition-all cursor-pointer text-left"
              >
                <div className="text-[9px] text-ink-secondary truncate">CAP Broadcast</div>
                <div className="font-bold text-status-safe mt-0.5 text-xs">Instant</div>
                <div className="text-[9px] text-status-safe">Queue: {queues['cap-broadcast'].queueDepth}</div>
              </div>
            </div>
          </div>

          {/* Live Monospace Terminal Log - Fully Interactive */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-mono font-bold text-ink flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple" />
                Live Subsystem Ingestion Log (Stream)
              </span>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <button
                  onClick={() => setIsStreamingLogs(!isStreamingLogs)}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                    isStreamingLogs ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'
                  }`}
                >
                  {isStreamingLogs ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isStreamingLogs ? 'STREAMING' : 'PAUSED'}</span>
                </button>

                <div className="flex rounded border border-border overflow-hidden">
                  {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogLevelFilter(lvl)}
                      className={`px-1.5 py-0.5 text-[9px] ${
                        logLevelFilter === lvl
                          ? 'bg-purple text-white font-bold'
                          : 'bg-surface text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Log Search input */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search live terminal stream logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1 rounded bg-[#1B1924] border border-border text-[#D8D4E5] font-mono text-[10px] focus:outline-none focus:border-purple"
              />
            </div>

            <div className="bg-[#1B1924] rounded-lg p-3 border border-border font-mono text-[11px] text-[#D8D4E5] space-y-1.5 max-h-48 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-[#88819C] text-[10px] italic py-2">No logs matching filter criteria.</div>
              ) : (
                filteredLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#88819C] shrink-0">{log.time}</span>
                    <span
                      className={`font-bold shrink-0 ${
                        log.level === 'WARN'
                          ? 'text-status-warning'
                          : log.level === 'ERROR'
                          ? 'text-status-alert'
                          : 'text-purple-300'
                      }`}
                    >
                      [{log.level}]
                    </span>
                    <span className="text-white break-all">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1 font-mono text-[10px]">
              <button
                onClick={handleInjectLog}
                className="py-1.5 px-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Append diagnostic log to stream"
              >
                <Plus className="w-3 h-3 text-purple" />
                <span>Inject</span>
              </button>

              <button
                onClick={() => {
                  setLogs([]);
                  showToast('Terminal logs cleared.');
                }}
                className="py-1.5 px-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Clear current stream buffer"
              >
                <Trash2 className="w-3 h-3 text-ink-secondary" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleDownloadLogs}
                className="py-1.5 px-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Download raw stream logs file"
              >
                <Download className="w-3 h-3 text-purple" />
                <span>.Log File</span>
              </button>

              <button
                onClick={() => setIsFlushModalOpen(true)}
                className="py-1.5 px-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-purple" />
                <span>Flush Cache</span>
              </button>

              <button
                onClick={handleExportSystemHealth}
                className="py-1.5 px-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3 text-purple" />
                <span>JSON Dump</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 20 DETAILED NEW FEATURES OPERATIONAL COCKPIT HUB */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple" />
              Infrastructure &amp; Mission-Critical Telemetry Operations Hub (20 Dedicated Tools)
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5">
              High-availability cluster telemetry, hydrodynamic GPU profiling, edge sensor diagnostics, and compliance audit
            </p>
          </div>

          {/* Search inside 20 tools */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search 20 operational tools..."
              value={featureSearch}
              onChange={(e) => setFeatureSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-secondary/40 border border-border text-ink text-xs focus:outline-none focus:border-purple"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-ink-secondary shrink-0" />
          {featureCategories.slice(0, 8).map((cat) => (
            <button
              key={cat}
              onClick={() => setFeatureCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
                featureCategoryFilter === cat
                  ? 'border-purple bg-purple/10 text-purple font-bold'
                  : 'border-border bg-surface text-ink-secondary hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 20 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
          {filteredFeatures.map((feat) => {
            const IconComponent =
              feat.id === 'cluster-topology' ? Server :
              feat.id === 'kafka-pipeline' ? Cpu :
              feat.id === 'postgis-profiler' ? Database :
              feat.id === 'iot-sensor-fleet' ? Radio :
              feat.id === 'vector-tile-cache' ? Layers :
              feat.id === 'swe-cuda-profiler' ? Zap :
              feat.id === 'failover-dr-console' ? ShieldCheck :
              feat.id === 'network-latency-matrix' ? Network :
              feat.id === 'sensor-drift-detector' ? AlertCircle :
              feat.id === 'cap-broadcast-gateway' ? BellRing :
              feat.id === 'radar-qc-inspector' ? Radar :
              feat.id === 'ssl-pki-tracker' ? Lock :
              feat.id === 'api-rate-governor' ? Sliders :
              feat.id === 'backup-pitr-console' ? Archive :
              feat.id === 'storage-nvme-array' ? HardDrive :
              feat.id === 'synthetic-health-prober' ? Activity :
              feat.id === 'incident-postmortem-gen' ? FileText :
              feat.id === 'sensor-solar-telemetry' ? SunMedium :
              feat.id === 'waf-firewall-telemetry' ? ShieldAlert :
              FileCode;

            return (
              <div
                key={feat.id}
                onClick={() => setActiveFeatureModal(feat.id)}
                className="p-3.5 bg-surface-secondary/40 hover:bg-purple/5 border border-border hover:border-purple rounded-xl shadow-subtle transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-surface border border-border group-hover:border-purple/40 text-purple transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe">
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-ink text-xs group-hover:text-purple transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-ink-secondary">
                  <span className="text-purple font-medium">{feat.category}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-ink font-semibold">
                    Launch &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL WORKFLOW INTEGRATIONS */}

      {/* Subsystem Deep Dive Diagnostics Modal */}
      <SubsystemDeepDiveModal
        subsystemId={activeSubsystemId}
        isOpen={Boolean(activeSubsystemId)}
        onClose={() => setActiveSubsystemId(null)}
        onNotify={showToast}
      />

      {/* Feed Stream Packet Inspector Modal */}
      <FeedStreamInspectorModal
        feed={selectedFeedForInspect}
        isOpen={Boolean(selectedFeedForInspect)}
        onClose={() => setSelectedFeedForInspect(null)}
        onNotify={showToast}
        onToggleStatus={handleToggleFeedStatus}
      />

      {/* Queue Manager Console Modal */}
      <QueueManagerModal
        queueData={activeQueueId ? queues[activeQueueId] : null}
        isOpen={Boolean(activeQueueId)}
        onClose={() => setActiveQueueId(null)}
        onNotify={showToast}
        onUpdateQueue={(updated) => setQueues((prev) => ({ ...prev, [updated.id]: updated }))}
      />

      {/* Flush Ingest Cache Modal */}
      <FlushCacheModal
        isOpen={isFlushModalOpen}
        onClose={() => setIsFlushModalOpen(false)}
        onNotify={showToast}
      />

      {/* 20 NEW DETAILED FEATURE MODALS */}
      {/* 1. Cluster Node Topology */}
      <ClusterTopologyModal
        isOpen={activeFeatureModal === 'cluster-topology'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 2. Kafka Pipeline */}
      <KafkaPipelineModal
        isOpen={activeFeatureModal === 'kafka-pipeline'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 3. PostGIS Spatial Profiler */}
      <PostgisProfilerModal
        isOpen={activeFeatureModal === 'postgis-profiler'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 4. IoT Hydro-Sensor Fleet */}
      <IoTSensorFleetModal
        isOpen={activeFeatureModal === 'iot-sensor-fleet'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 5. Vector Tile Cache */}
      <VectorTileCacheModal
        isOpen={activeFeatureModal === 'vector-tile-cache'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 6. 2D SWE GPU CUDA Profiler */}
      <SweCudaProfilerModal
        isOpen={activeFeatureModal === 'swe-cuda-profiler'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 7. Automated Failover DR Console */}
      <FailoverDrillModal
        isOpen={activeFeatureModal === 'failover-dr-console'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 8. Inter-Agency WAN Latency Matrix */}
      <NetworkLatencyModal
        isOpen={activeFeatureModal === 'network-latency-matrix'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 9. Sensor Data Drift & ML Anomaly */}
      <SensorDriftModal
        isOpen={activeFeatureModal === 'sensor-drift-detector'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 10. CAP Broadcast Gateway & Sirens */}
      <CapBroadcastGatewayModal
        isOpen={activeFeatureModal === 'cap-broadcast-gateway'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 11. Doppler Radar S-Band Beam QC */}
      <RadarQcInspectorModal
        isOpen={activeFeatureModal === 'radar-qc-inspector'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 12. SSL/TLS Certificates & PKI */}
      <SslPkiTrackerModal
        isOpen={activeFeatureModal === 'ssl-pki-tracker'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 13. API Rate Limiter Governor */}
      <ApiRateGovernorModal
        isOpen={activeFeatureModal === 'api-rate-governor'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 14. Database Backup & PITR Console */}
      <BackupPitrModal
        isOpen={activeFeatureModal === 'backup-pitr-console'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 15. Storage Volumes & Ceph NVMe */}
      <StorageNvmeArrayModal
        isOpen={activeFeatureModal === 'storage-nvme-array'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 16. Synthetic Health Prober Suite */}
      <SyntheticHealthProberModal
        isOpen={activeFeatureModal === 'synthetic-health-prober'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 17. Incident Post-Mortem Generator */}
      <IncidentPostmortemModal
        isOpen={activeFeatureModal === 'incident-postmortem-gen'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 18. Sensor Power Grid & Solar Microgrid */}
      <SensorSolarTelemetryModal
        isOpen={activeFeatureModal === 'sensor-solar-telemetry'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 19. Security Firewall & WAF Telemetry */}
      <WafFirewallTelemetryModal
        isOpen={activeFeatureModal === 'waf-firewall-telemetry'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />

      {/* 20. Audit Log & SHA-256 Event Chain */}
      <Sha256AuditChainModal
        isOpen={activeFeatureModal === 'sha256-audit-chain'}
        onClose={() => setActiveFeatureModal(null)}
        onNotify={showToast}
      />
    </div>
  );
}
