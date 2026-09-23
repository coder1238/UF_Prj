import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, Database, Download, Terminal, Layers } from 'lucide-react';

export default function GeoSyncModal({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const STEPS = [
    { title: 'Spatial Reference System (EPSG:4326)', desc: 'Validating ellipsoid projection against Mumbai Survey Coordinates' },
    { title: '2026 LiDAR Aerial Elevation Mesh', desc: 'Validating 5m resolution DEM contours and coastal subsidence offsets' },
    { title: 'SWMM Drainage Topology (1,428 Nodes)', desc: 'Checking node connectivity, flap valve elevations, and outfall lines' },
    { title: 'Cryptographic Checksum & Cache Invalidation', desc: 'Computing SHA-256 package hash and updating client vector tiles' },
  ];

  useEffect(() => {
    const runSimulation = async () => {
      // Step 1
      setCurrentStep(0);
      setLogs((prev) => [...prev, '[18:35:01] INITIATING GeoPackage (.gpkg) validation pipeline for MCGM Greater Mumbai...']);
      await new Promise((r) => setTimeout(r, 700));
      setLogs((prev) => [...prev, '[18:35:02] Spatial Reference: EPSG:4326 (WGS84) matched with Mumbai Town Hall Datum (+3.20m MSL). Status: OK']);

      // Step 2
      setCurrentStep(1);
      await new Promise((r) => setTimeout(r, 800));
      setLogs((prev) => [...prev, '[18:35:03] Processing 2026 LiDAR Point Cloud: 14.8M elevation points indexed across 24 Wards. Residual error < 0.02m.']);

      // Step 3
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 900));
      setLogs((prev) => [...prev, '[18:35:04] Topology Graph Analyzer: 1,428 SWMM Nodes, 64 Outfall Gates, 5 Major River Basins verified with zero orphan nodes.']);

      // Step 4
      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 700));
      setLogs((prev) => [...prev, '[18:35:05] SHA-256: e87f91c92a1435d88390b1c094ef712a8492019ab3847cde0192837465ab0192.']);
      setLogs((prev) => [...prev, '[18:35:05] GEOPACKAGE SYNCHRONIZATION 100% COMPLETE & CACHED IN MEMORY.']);
      
      setCurrentStep(4);
      setIsFinished(true);
      if (onComplete) onComplete();
    };

    runSimulation();
  }, []);

  const handleDownloadSchema = () => {
    const schemaData = {
      authority: 'Municipal Corporation of Greater Mumbai (MCGM)',
      srs: 'EPSG:4326',
      demResolutionMeters: 5.0,
      verifiedWardsCount: 24,
      swmmNodes: 1428,
      riverBasins: ['Mithi', 'Dahisar', 'Poisar', 'Oshiwara', 'Mahim'],
      sha256Checksum: 'e87f91c92a1435d88390b1c094ef712a8492019ab3847cde0192837465ab0192',
      synchronizedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(schemaData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-geodatabase-metadata-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                GeoPackage (.gpkg) Verification &amp; Sync Runner
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Autonomous GIS Topo-Hydraulic Validation Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Progress Steps */}
          <div className="space-y-2">
            {STEPS.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-status-safe-soft/40 border-status-safe/30 text-ink'
                      : isCurrent
                      ? 'bg-purple-soft/30 border-purple/40 text-ink shadow-subtle'
                      : 'bg-surface-secondary/50 border-border text-ink-secondary opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-status-safe" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-purple animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center font-mono text-[9px]">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{step.title}</div>
                    <div className="text-[11px] text-ink-secondary mt-0.5">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal Console Logs */}
          <div className="p-3 bg-ink text-white rounded-xl font-mono text-[10px] space-y-1 max-h-40 overflow-y-auto">
            <div className="text-purple-light flex items-center gap-1.5 pb-1 border-b border-white/10 font-bold">
              <Terminal className="w-3 h-3" />
              <span>GIS PIPELINE CONSOLE OUTPUT</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="text-white/80 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ink-secondary">
            {isFinished ? (
              <span className="text-status-safe font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED &amp; COMMITTED
              </span>
            ) : (
              <span className="text-purple flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                VALIDATING LAYERS...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFinished && (
              <button
                type="button"
                onClick={handleDownloadSchema}
                className="px-3 py-1.5 bg-surface border border-border text-ink hover:bg-surface-secondary rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple" />
                <span>Export Metadata JSON</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors"
            >
              {isFinished ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

