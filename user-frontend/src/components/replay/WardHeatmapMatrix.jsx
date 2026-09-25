import React, { useState } from 'react';
import { Layers, AlertTriangle, ShieldCheck, Activity, MapPin } from 'lucide-react';
import { WARDS_HEATMAP } from '../../data/replayData';

export default function WardHeatmapMatrix({ currentStep, whatIfModifiers }) {
  const [selectedWard, setSelectedWard] = useState(null);
  const depthFactor = whatIfModifiers?.depthFactor || 1;
  const currentDepth = currentStep.depth * depthFactor;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Basin Inundation Matrix
          </div>
          <h3 className="text-base font-bold text-ink mt-0.5">
            Ward-by-Ward Sump Inundation & Pumping Deployment
          </h3>
        </div>
        <span className="text-xs font-mono text-muted">Click ward for localized debrief</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {WARDS_HEATMAP.map(ward => {
          const wardDepth = Math.round(currentDepth * ward.sumpSensitivity);
          const isCritical = wardDepth > 45;
          const isElevated = wardDepth > 20;

          const isSelected = selectedWard?.code === ward.code;

          return (
            <div
              key={ward.code}
              onClick={() => setSelectedWard(isSelected ? null : ward)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-purple-50 border-purple-primary shadow-md' 
                  : isCritical 
                  ? 'bg-red-50/60 border-red-200 hover:border-red-300' 
                  : isElevated 
                  ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300' 
                  : 'bg-canvas border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-ink">{ward.code}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isCritical 
                    ? 'bg-red-600 text-white' 
                    : isElevated 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {isCritical ? 'CRITICAL' : isElevated ? 'ELEVATED' : 'STABLE'}
                </span>
              </div>

              <div className="text-[11px] text-muted truncate mt-1">{ward.name.split('(')[1]?.replace(')', '') || ward.name}</div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold font-mono text-ink">
                  {wardDepth} <span className="text-xs text-muted font-normal">cm</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                  <span>Pumps: {ward.pumpsCount} mobile</span>
                  <span>{ward.catchmentAreaSqKm} km²</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-mono text-slate-600 truncate">
                Choke: {ward.primaryBottleneck}
              </div>
            </div>
          );
        })}
      </div>

      {selectedWard && (
        <div className="mt-4 p-4 rounded-2xl bg-purple-50/70 border border-purple-primary/30 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-purple-900 font-mono">{selectedWard.name}</span>
            <p className="text-slate-600 mt-0.5">
              Hydraulic vulnerability index: {(selectedWard.sumpSensitivity * 100).toFixed(0)}% &bull; Critical bottleneck at {selectedWard.primaryBottleneck}.
            </p>
          </div>
          <button 
            onClick={() => setSelectedWard(null)}
            className="text-xs font-mono font-bold text-purple-700 hover:text-purple-900 px-3 py-1 bg-white rounded-xl border border-purple-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

