import React, { useState } from 'react';
import {
  X,
  Server,
  Cpu,
  Database,
  Radio,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCw
} from 'lucide-react';
import {
  CLUSTER_NODES_DATA,
  KAFKA_TOPICS_DATA,
  SPATIAL_SLOW_QUERIES,
  SENSOR_FLEET_SAMPLE
} from './systemHealthConstants';

// 1. Cluster Node Topology & Hardware Telemetry Modal
export function ClusterTopologyModal({ isOpen, onClose, onNotify }) {
  const [nodes, setNodes] = useState(CLUSTER_NODES_DATA);
  const [selectedNode, setSelectedNode] = useState(nodes[0]);
  const [isDraining, setIsDraining] = useState(false);

  if (!isOpen) return null;

  const handleDrainNode = (nodeName) => {
    setIsDraining(true);
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.name === nodeName ? { ...n, status: n.status === 'DRAINED' ? 'READY' : 'DRAINED' } : n));
      setIsDraining(false);
      onNotify(`Node ${nodeName} status updated.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Cluster Node Topology &amp; Hardware Telemetry (K8s &amp; GPU Rigs)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  5/5 ONLINE
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Bare-metal Kubernetes cluster + dual NVIDIA H100 80GB SXM5 compute units</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nodes.map((node) => (
              <div
                key={node.name}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedNode.name === node.name
                    ? 'border-purple bg-purple/5 shadow-subtle'
                    : 'border-border bg-surface hover:border-purple/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink truncate">{node.name.split(' ')[0]}</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    node.status === 'READY' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-alert-soft text-status-alert'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="text-[10px] text-ink-secondary mt-0.5">{node.role}</div>
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-ink-secondary">CPU:</span>
                    <span className="font-mono font-bold text-ink">{node.cpu}%</span>
                  </div>
                  <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple h-full rounded-full" style={{ width: `${node.cpu}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-ink-secondary">RAM:</span>
                    <span className="font-mono font-bold text-ink">{node.mem}%</span>
                  </div>
                  <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple h-full rounded-full" style={{ width: `${node.mem}%` }}></div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-border flex justify-between text-[10px] font-mono">
                  <span className="text-ink-secondary">Temp: {node.temp}</span>
                  <span className="text-purple font-semibold">{node.pods} Pods</span>
                </div>
              </div>
            ))}
          </div>

          {selectedNode && (
            <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-ink text-sm">Detailed Inspector: {selectedNode.name}</h4>
                  <p className="text-[11px] font-mono text-ink-secondary">Internal IP: {selectedNode.ip} | Role: {selectedNode.role}</p>
                </div>
                <button
                  disabled={isDraining}
                  onClick={() => handleDrainNode(selectedNode.name)}
                  className="px-3 py-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-purple ${isDraining ? 'animate-spin' : ''}`} />
                  <span>{selectedNode.status === 'DRAINED' ? 'Uncordon Node' : 'Cordon & Drain Node'}</span>
                </button>
              </div>

              {selectedNode.gpuVram && (
                <div className="p-3 bg-purple/10 rounded-lg border border-purple/20 flex flex-col gap-1.5">
                  <span className="font-bold text-purple text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> High-Performance GPU Subsystem (SXM5 H100)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>Allocated VRAM: <span className="font-bold text-ink">{selectedNode.gpuVram}</span></div>
                    <div>NVLink 4.0 Interconnect: <span className="font-bold text-status-safe">{selectedNode.nvlinkSpeed}</span></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[9px]">OS Kernel</span>
                  <div className="font-bold text-ink">Linux 6.8.0-mcgm</div>
                </div>
                <div className="p-2 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[9px]">Kubelet Version</span>
                  <div className="font-bold text-ink">v1.29.3-k8s</div>
                </div>
                <div className="p-2 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[9px]">Disk IOPS</span>
                  <div className="font-bold text-status-safe">142,000 IOPS</div>
                </div>
                <div className="p-2 bg-surface rounded-lg border border-border">
                  <span className="text-ink-secondary text-[9px]">Network Fabric</span>
                  <div className="font-bold text-purple">100GbE RoCEv2</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Kafka & MQTT Streaming Pipeline Inspector
export function KafkaPipelineModal({ isOpen, onClose, onNotify }) {
  const topics = KAFKA_TOPICS_DATA;
  const [isFlushingDLQ, setIsFlushingDLQ] = useState(false);

  if (!isOpen) return null;

  const handleResubmitDLQ = () => {
    setIsFlushingDLQ(true);
    setTimeout(() => {
      setIsFlushingDLQ(false);
      onNotify('Dead Letter Queue: 1 failed message reprocessed successfully.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Kafka &amp; MQTT Telemetry Streaming Ingestion Pipeline
              </h3>
              <p className="text-xs text-ink-secondary">Partition offsets, consumer lag, and IoT gateway MQTT ingestion broker</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[10px] text-ink-secondary">Total Ingestion Rate</div>
              <div className="text-xl font-bold text-ink mt-0.5">1,745 msg/s</div>
              <div className="text-[10px] text-status-safe">Bandwidth: 14.8 MB/s</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[10px] text-ink-secondary">Active Partitions</div>
              <div className="text-xl font-bold text-purple mt-0.5">34 Partitions</div>
              <div className="text-[10px] text-ink-secondary">Replication Factor: 3</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[10px] text-ink-secondary">DLQ Messages</div>
              <div className="text-xl font-bold text-status-warning mt-0.5">1 Queued</div>
              <div className="text-[10px] text-ink-secondary">Schema Mismatch (1)</div>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="p-2.5">Topic Name</th>
                  <th className="p-2.5">Partitions</th>
                  <th className="p-2.5">Throughput</th>
                  <th className="p-2.5">Consumer Lag</th>
                  <th className="p-2.5">Retention</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {topics.map((t) => (
                  <tr key={t.topic} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5 font-bold text-ink font-sans">{t.topic}</td>
                    <td className="p-2.5 text-ink-secondary">{t.partitions}</td>
                    <td className="p-2.5 text-purple font-semibold">{t.throughputMsgSec} msg/s</td>
                    <td className="p-2.5 text-status-safe">{t.consumerLag} msgs</td>
                    <td className="p-2.5 text-ink-secondary">{t.retentionHours}h</td>
                    <td className="p-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-status-safe-soft text-status-safe">
                        {t.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-surface-secondary/50 rounded-xl border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Dead-Letter Queue (DLQ) Remediation</span>
              <span className="text-[11px] text-ink-secondary">Topic: `hydrology.gauges.dlq` has 1 unparsed sensor payload from Kurla sensor.</span>
            </div>
            <button
              disabled={isFlushingDLQ}
              onClick={handleResubmitDLQ}
              className="px-3 py-1.5 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isFlushingDLQ ? 'animate-spin' : ''}`} />
              <span>Retry &amp; Drain DLQ</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. PostGIS & TimescaleDB Spatial Query Profiler
export function PostgisProfilerModal({ isOpen, onClose, onNotify }) {
  const queries = SPATIAL_SLOW_QUERIES;
  const [isVacuuming, setIsVacuuming] = useState(false);

  if (!isOpen) return null;

  const handleVacuum = () => {
    setIsVacuuming(true);
    setTimeout(() => {
      setIsVacuuming(false);
      onNotify('VACUUM ANALYZE completed on 14 PostGIS spatial tables. 4.2 MB reclaimed.');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                PostGIS &amp; TimescaleDB Spatial Query Profiler
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  PgBouncer 42/100
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Analyze spatial GiST index efficiency, connection pool, and heavy polygon operations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[9px] text-ink-secondary uppercase">Cache Hit Ratio</div>
              <div className="text-lg font-bold text-status-safe mt-0.5">99.82%</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[9px] text-ink-secondary uppercase">Active Transactions</div>
              <div className="text-lg font-bold text-ink mt-0.5">8 Running</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[9px] text-ink-secondary uppercase">GiST Spatial Indices</div>
              <div className="text-lg font-bold text-purple mt-0.5">38 Healthy</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[9px] text-ink-secondary uppercase">Timescale Chunks</div>
              <div className="text-lg font-bold text-ink mt-0.5">184 Compressed</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink">Active Spatial Queries Monitored</h4>
            {queries.map((q) => (
              <div key={q.id} className="p-3 bg-surface border border-border rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{q.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-secondary">{q.durationMs}ms</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      q.status === 'OPTIMAL' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-[#1B1924] rounded-lg font-mono text-[10px] text-[#A5B4FC] overflow-x-auto">
                  {q.sql}
                </div>
                <div className="flex justify-between text-[10px] text-ink-secondary font-mono">
                  <span>Index Scan: {q.indexUsed}</span>
                  <span className="text-status-safe">Estimated Cost: 48.20..112.50</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-surface-secondary/40 rounded-xl border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">Database Maintenance Routine</span>
              <span className="text-[11px] text-ink-secondary">Run VACUUM ANALYZE to refresh spatial statistics for the query planner.</span>
            </div>
            <button
              disabled={isVacuuming}
              onClick={handleVacuum}
              className="px-3 py-1.5 bg-surface hover:bg-surface-secondary text-ink border border-border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 text-purple ${isVacuuming ? 'animate-spin' : ''}`} />
              <span>{isVacuuming ? 'Vacuuming...' : 'Trigger VACUUM ANALYZE'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. IoT Hydro-Sensor Fleet Diagnostics
export function IoTSensorFleetModal({ isOpen, onClose, onNotify }) {
  const [sensors, setSensors] = useState(SENSOR_FLEET_SAMPLE);
  const [rebootingId, setRebootingId] = useState(null);

  if (!isOpen) return null;

  const handleReboot = (sensorId) => {
    setRebootingId(sensorId);
    setTimeout(() => {
      setSensors(prev => prev.map(s => s.id === sensorId ? { ...s, status: 'ONLINE', battery: Math.min(100, s.battery + 5) } : s));
      setRebootingId(null);
      onNotify(`Remote telemetry handshake successful for sensor ${sensorId}.`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                IoT Hydro-Sensor Fleet Diagnostics (48 Gauges &amp; 62 AWS)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  108/110 ONLINE
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">LoRaWAN &amp; 4G telemetry link budget, solar irradiance, and over-the-air firmware</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="p-2.5">Sensor ID / Site</th>
                  <th className="p-2.5">Modality</th>
                  <th className="p-2.5">Battery</th>
                  <th className="p-2.5">Solar (W)</th>
                  <th className="p-2.5">Signal (RSSI)</th>
                  <th className="p-2.5">Current Depth</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {sensors.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-secondary/40">
                    <td className="p-2.5">
                      <div className="font-bold text-ink">{s.id}</div>
                      <div className="text-[10px] font-sans text-ink-secondary">{s.name}</div>
                    </td>
                    <td className="p-2.5 text-ink-secondary font-sans">{s.type}</td>
                    <td className="p-2.5">
                      <span className={`font-bold ${s.battery < 25 ? 'text-status-alert' : 'text-status-safe'}`}>
                        {s.battery}%
                      </span>
                    </td>
                    <td className="p-2.5 text-ink">{s.solarW}W</td>
                    <td className="p-2.5 text-ink-secondary">{s.rssi} dBm</td>
                    <td className="p-2.5 font-bold text-purple">{s.depthM > 0 ? `${s.depthM} m` : 'N/A'}</td>
                    <td className="p-2.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        s.status === 'ONLINE' ? 'bg-status-safe-soft text-status-safe' : 'bg-status-warning-soft text-status-warning'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-sans">
                      <button
                        disabled={rebootingId === s.id}
                        onClick={() => handleReboot(s.id)}
                        className="px-2.5 py-1 bg-surface hover:bg-surface-secondary text-ink border border-border rounded text-[10px] font-semibold transition-colors disabled:opacity-50"
                      >
                        {rebootingId === s.id ? 'Rebooting...' : 'Ping / Reset'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Vector Tile Server & Map Cache Invalidation
export function VectorTileCacheModal({ isOpen, onClose, onNotify }) {
  const [selectedWard, setSelectedWard] = useState('Ward F/North (Sion / Matunga)');
  const [isFlushing, setIsFlushing] = useState(false);

  if (!isOpen) return null;

  const handleFlushTile = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
      onNotify(`Vector tiles invalidated for ${selectedWard}. 1,480 tiles evicted.`);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Vector Tile Server &amp; Map Cache Invalidation (Tegola / Martin)
              </h3>
              <p className="text-xs text-ink-secondary">Manage MapLibre vector tile generation, cache hit rates, and bounding-box flushes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Tile Cache Hit Ratio</span>
              <div className="text-xl font-bold text-status-safe mt-0.5">94.2%</div>
              <span className="text-[10px] text-ink-secondary">Redis L1 + Fastly CDN</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Memory Footprint</span>
              <div className="text-xl font-bold text-ink mt-0.5">4.82 GB</div>
              <span className="text-[10px] text-purple">148,920 Tiles Cached</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-ink-secondary">Mean Render Latency</span>
              <div className="text-xl font-bold text-purple mt-0.5">18.4 ms</div>
              <span className="text-[10px] text-status-safe">Target &lt; 30 ms</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Selective Bounding-Box Cache Eviction</h4>
            <p className="text-ink-secondary text-[11px]">
              When hydrological surface flow simulations update, invalidate cached vector tiles for the affected municipal zone to force fresh client rendering.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full sm:flex-1 p-2 rounded-lg bg-surface border border-border text-ink text-xs font-semibold focus:outline-none focus:border-purple"
              >
                <option value="Ward F/North (Sion / Matunga)">Ward F/North (Sion / Matunga)</option>
                <option value="Ward G/South (Worli / Lower Parel)">Ward G/South (Worli / Lower Parel)</option>
                <option value="Ward H/East (Bandra / Santacruz)">Ward H/East (Bandra / Santacruz)</option>
                <option value="Ward L (Kurla / Chunabhatti)">Ward L (Kurla / Chunabhatti)</option>
                <option value="All 24 Municipal Wards (Full Invalidation)">All 24 Municipal Wards (Full Invalidation)</option>
              </select>

              <button
                disabled={isFlushing}
                onClick={handleFlushTile}
                className="w-full sm:w-auto px-4 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
                <span>{isFlushing ? 'Evicting Tiles...' : 'Evict Tiles from Cache'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. 2D SWE GPU Simulation Engine Profiler
export function SweCudaProfilerModal({ isOpen, onClose, onNotify }) {
  const [gridResolution, setGridResolution] = useState('5m');
  const [isTuning, setIsTuning] = useState(false);

  if (!isOpen) return null;

  const handleApplyResolution = () => {
    setIsTuning(true);
    setTimeout(() => {
      setIsTuning(false);
      onNotify(`SWE mesh resolution updated to ${gridResolution}. Hydrodynamic solver re-initialized.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple/10 text-purple">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                2D Shallow Water Equations (SWE) CUDA Engine Profiler
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-safe-soft text-status-safe font-semibold">
                  CFL: 0.68
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">Riemann finite-volume hydrodynamic kernel telemetry on NVIDIA H100 GPUs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Kernel Step Time</span>
              <div className="text-lg font-bold text-ink mt-0.5">18.4 ms</div>
              <span className="text-[9px] text-status-safe">512 CUDA Blocks</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">CFL Number</span>
              <div className="text-lg font-bold text-status-safe mt-0.5">0.68</div>
              <span className="text-[9px] text-ink-secondary">Stable (Limit &lt; 0.9)</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Memory Bandwidth</span>
              <div className="text-lg font-bold text-purple mt-0.5">2.4 TB/s</div>
              <span className="text-[9px] text-ink-secondary">HBM3 80GB</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-[9px] text-ink-secondary uppercase">Wet/Dry Threshold</span>
              <div className="text-lg font-bold text-ink mt-0.5">0.005 m</div>
              <span className="text-[9px] text-ink-secondary">5 mm Water Depth</span>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3 font-sans">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Simulation Mesh Grid Spacing</h4>
            <p className="text-ink-secondary text-[11px]">
              Trade off computational throughput against spatial fidelity for urban surface water pooling.
            </p>

            <div className="flex gap-2">
              {['2m (High-Res)', '5m (Standard)', '10m (Rapid Fast-Forward)'].map((res) => (
                <button
                  key={res}
                  onClick={() => setGridResolution(res.split(' ')[0])}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    gridResolution === res.split(' ')[0]
                      ? 'border-purple bg-purple/10 text-purple font-bold'
                      : 'border-border bg-surface text-ink hover:border-purple/30'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>

            <button
              disabled={isTuning}
              onClick={handleApplyResolution}
              className="mt-2 px-4 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isTuning ? 'animate-spin' : ''}`} />
              <span>{isTuning ? 'Configuring CUDA Mesh...' : 'Apply Grid Resolution'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. Automated Failover & Disaster Recovery Drill Runner
export function FailoverDrillModal({ isOpen, onClose, onNotify }) {
  const [drillStep, setDrillStep] = useState(0); // 0: Idle, 1: DNS reroute, 2: DB promotion, 3: Completed
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleStartDrill = () => {
    setIsRunning(true);
    setDrillStep(1);
    setTimeout(() => {
      setDrillStep(2);
      setTimeout(() => {
        setDrillStep(3);
        setIsRunning(false);
        onNotify('Disaster recovery failover simulation completed. Standby site active.');
      }, 1500);
    }, 1500);
  };

  const handleReset = () => {
    setDrillStep(0);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Automated Disaster Recovery (DR) &amp; Failover Console
              </h3>
              <p className="text-xs text-ink-secondary">Primary Datacenter (BMC Worli) ⟷ Hot-Standby Disaster Site (Navi Mumbai SDC)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[10px] text-ink-secondary">RTO (Recovery Time Objective)</div>
              <div className="text-xl font-bold text-status-safe mt-0.5">14.0 Seconds</div>
              <div className="text-[10px] text-ink-secondary">Target: &lt; 60 seconds</div>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <div className="text-[10px] text-ink-secondary">RPO (Recovery Point Objective)</div>
              <div className="text-xl font-bold text-status-safe mt-0.5">1.2 Seconds</div>
              <div className="text-[10px] text-ink-secondary">Sync Replication Lag</div>
            </div>
          </div>

          <div className="p-4 bg-surface-secondary/40 rounded-xl border border-border space-y-3 font-sans">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">Multi-Step Disaster Failover Sequence</h4>

            <div className="space-y-2">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                drillStep >= 1 ? 'border-status-safe bg-status-safe-soft text-status-safe font-semibold' : 'border-border bg-surface text-ink-secondary'
              }`}>
                <span>Step 1: Anycast Geo-DNS Reroute to Secondary DC (Navi Mumbai)</span>
                {drillStep >= 1 && <CheckCircle2 className="w-4 h-4 text-status-safe" />}
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                drillStep >= 2 ? 'border-status-safe bg-status-safe-soft text-status-safe font-semibold' : 'border-border bg-surface text-ink-secondary'
              }`}>
                <span>Step 2: Promote Standby PostGIS DB to Read-Write Leader</span>
                {drillStep >= 2 && <CheckCircle2 className="w-4 h-4 text-status-safe" />}
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                drillStep >= 3 ? 'border-status-safe bg-status-safe-soft text-status-safe font-semibold' : 'border-border bg-surface text-ink-secondary'
              }`}>
                <span>Step 3: Resume Ingestion Pipelines &amp; Hydrodynamic CUDA Kernels</span>
                {drillStep >= 3 && <CheckCircle2 className="w-4 h-4 text-status-safe" />}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              {drillStep === 0 ? (
                <button
                  disabled={isRunning}
                  onClick={handleStartDrill}
                  className="px-4 py-2 bg-purple text-white hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Automated Failover Drill</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-lg text-xs font-semibold text-ink flex items-center gap-2 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reset Drill State</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-surface-secondary/20">
          <button onClick={onClose} className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-xl text-xs font-semibold text-ink">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

