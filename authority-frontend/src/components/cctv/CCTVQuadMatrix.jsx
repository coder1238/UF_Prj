import React from 'react';
import { Camera, Maximize2, AlertTriangle, ShieldCheck, Video, Activity } from 'lucide-react';

export default function CCTVQuadMatrix({
  cameras = [],
  selectedCamId,
  onSelectCamera,
  layoutMode = 'quad', // 'single' | 'quad' | 'matrix'
  onChangeLayout,
}) {
  const displayedCams = layoutMode === 'quad' ? cameras.slice(0, 4) : cameras;

  return (
    <div className="flex-1 flex flex-col bg-surface rounded-xl border border-border p-4 shadow-subtle">
      {/* Matrix Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-purple" />
          <h3 className="text-sm font-bold text-ink">
            {layoutMode === 'quad' ? 'Quad-View Synchronization (4 Feeds)' : 'Full Metropolitan Matrix (8 Feeds)'}
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-semibold">
            {cameras.length} CHANNELS LIVE
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-secondary p-1 rounded-lg border border-border">
          <button
            onClick={() => onChangeLayout('single')}
            className="px-2.5 py-1 text-xs rounded font-medium text-ink-secondary hover:text-ink hover:bg-white transition-all"
          >
            Single
          </button>
          <button
            onClick={() => onChangeLayout('quad')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              layoutMode === 'quad'
                ? 'bg-purple text-white shadow-xs font-semibold'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Quad (2x2)
          </button>
          <button
            onClick={() => onChangeLayout('matrix')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              layoutMode === 'matrix'
                ? 'bg-purple text-white shadow-xs font-semibold'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Matrix (All 8)
          </button>
        </div>
      </div>

      {/* Grid of Feeds */}
      <div
        className={`grid gap-3 flex-1 ${
          layoutMode === 'quad' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
        }`}
      >
        {displayedCams.map((cam) => {
          const isSelected = cam.id === selectedCamId;
          const isCritical = cam.detectedDepth >= 25;
          const isWarning = cam.detectedDepth >= 15 && cam.detectedDepth < 25;

          return (
            <div
              key={cam.id}
              onClick={() => onSelectCamera(cam.id)}
              className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col bg-slate-950 ${
                isSelected
                  ? 'ring-2 ring-purple border-transparent shadow-md'
                  : 'border-border hover:border-purple/50'
              }`}
            >
              {/* Synthetic Visual Video Canvas in thumbnail */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      'radial-gradient(ellipse at bottom, #1e293b 0%, #0f172a 70%, #020617 100%)',
                  }}
                />

                {/* Simulated Waterline */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-blue-600/30 border-t border-sky-400"
                  style={{ height: `${Math.min(80, Math.max(15, (cam.detectedDepth / 60) * 100))}%` }}
                />

                {/* Center Camera Icon or Water Depth indicator */}
                <div className="z-10 text-center">
                  <div className="font-mono text-lg font-black text-white drop-shadow">
                    {cam.detectedDepth} <span className="text-xs font-normal text-slate-300">cm</span>
                  </div>
                  <div className="text-[10px] font-mono text-sky-300">
                    Conf {cam.confidence}%
                  </div>
                </div>

                {/* Stream Status Overlay Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-alert animate-ping" />
                  <span>{cam.id.toUpperCase()}</span>
                </div>

                <div className="absolute top-2 right-2">
                  {isCritical ? (
                    <span className="bg-status-alert text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold animate-pulse flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      CRITICAL
                    </span>
                  ) : isWarning ? (
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                      WARN
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                      SAFE
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-purple text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Open Focused View
                  </span>
                </div>
              </div>

              {/* Feed Card Footer */}
              <div className="p-2.5 bg-surface text-ink flex items-center justify-between border-t border-border">
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{cam.name}</div>
                  <div className="text-[10px] text-ink-secondary">{cam.ward}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono font-semibold text-purple">
                    {cam.flowStatus.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-ink-muted">{cam.lastSync}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

