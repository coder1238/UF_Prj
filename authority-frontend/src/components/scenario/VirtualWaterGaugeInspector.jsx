import React, { useState } from 'react';
import {
  Waves,
  MapPin,
} from 'lucide-react';
import { LANDMARK_GAUGES } from './scenarioConstants';

export default function VirtualWaterGaugeInspector({
  scenarioParams,
  mitigationDepthCm = 0,
  onFocusMapLocation,
}) {
  const [selectedGaugeId, setSelectedGaugeId] = useState(LANDMARK_GAUGES[0].id);

  const selectedGauge = LANDMARK_GAUGES.find((g) => g.id === selectedGaugeId) || LANDMARK_GAUGES[0];

  // Dynamic depth calculation for selected gauge
  const surgeMultiplier = 1 + (scenarioParams.rainfallIntensity - 50) * 0.015 + (scenarioParams.drainBlockage / 100) * 0.45;
  const calculatedDepthCm = Math.max(
    0,
    +(selectedGauge.baselineDepth * surgeMultiplier - mitigationDepthCm * 0.6).toFixed(1)
  );

  const isAlert = calculatedDepthCm >= selectedGauge.alertDepthCm;
  const isSevere = calculatedDepthCm >= selectedGauge.alertDepthCm * 1.4;

  const flowVelocity = calculatedDepthCm > 25 ? '0.68 m/s' : calculatedDepthCm > 10 ? '0.34 m/s' : '0.08 m/s';
  const soilSaturation = Math.min(99.4, +(82 + calculatedDepthCm * 0.35).toFixed(1));
  const clearanceTimeHrs = (calculatedDepthCm / 14 + (scenarioParams.drainBlockage / 100) * 2.5).toFixed(1);

  // Water level fill percentage in 80cm gauge tube
  const fillPct = Math.min(100, Math.round((calculatedDepthCm / 70) * 100));

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              Virtual Water Gauge &amp; Spot Telemetry
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                POINT HYDRAULICS
              </span>
            </h4>
            <p className="text-[11px] text-ink-secondary">
              Virtual ultrasonic staff gauge at municipal flood dips &amp; low-lying chokepoints
            </p>
          </div>
        </div>

        {onFocusMapLocation && (
          <button
            onClick={() => onFocusMapLocation(selectedGauge.coords, selectedGauge.name)}
            className="px-2.5 py-1 rounded-lg border border-border hover:bg-surface-secondary text-xs font-mono text-purple flex items-center gap-1 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Center on Map</span>
          </button>
        )}
      </div>

      {/* Landmark Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {LANDMARK_GAUGES.map((gauge) => {
          const isSelected = gauge.id === selectedGaugeId;
          return (
            <button
              key={gauge.id}
              onClick={() => setSelectedGaugeId(gauge.id)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] shrink-0 transition-colors ${
                isSelected
                  ? 'bg-purple text-white font-bold shadow-sm'
                  : 'bg-surface-secondary/70 hover:bg-surface-secondary text-ink-secondary border border-border/70'
              }`}
            >
              {gauge.name.split(' ')[0]} ({gauge.ward})
            </button>
          );
        })}
      </div>

      {/* Gauge Visualization & Metrics Grid */}
      <div className="flex items-center gap-4 p-3 bg-canvas rounded-xl border border-border">
        {/* Animated Vertical Water Gauge Tube */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="text-[9px] font-mono text-ink-secondary">MAX 70cm</div>
          <div className="relative w-8 h-32 bg-surface rounded-full border-2 border-border overflow-hidden flex flex-col justify-end p-0.5">
            {/* Warning threshold tick line */}
            <div
              className="absolute left-0 right-0 border-t border-status-alert border-dashed z-20"
              style={{ bottom: `${(selectedGauge.alertDepthCm / 70) * 100}%` }}
              title={`Alert threshold: ${selectedGauge.alertDepthCm}cm`}
            />

            {/* Water Column */}
            <div
              className={`w-full rounded-b-full transition-all duration-500 ease-out relative ${
                isSevere ? 'bg-status-alert' : isAlert ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ height: `${fillPct}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 animate-pulse" />
            </div>
          </div>
          <div className="text-[9px] font-mono text-ink-secondary">0cm BED</div>
        </div>

        {/* Gauge Information & Readouts */}
        <div className="flex-1 space-y-2.5 text-xs font-mono">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-sm text-ink">{selectedGauge.name}</h5>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isSevere
                  ? 'bg-status-alert text-white'
                  : isAlert
                  ? 'bg-status-warning-soft text-status-warning'
                  : 'bg-status-safe-soft text-status-safe'
              }`}>
                {isSevere ? 'SEVERE INGRESS' : isAlert ? 'SURCHARGE ALERT' : 'SAFE FREEBOARD'}
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary mt-0.5">
              {selectedGauge.ward} • Ground Level: +{selectedGauge.groundMsl}m MSL • Alert Threshold: {selectedGauge.alertDepthCm}cm
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-ink-secondary block">Computed Depth</span>
              <strong className={`text-base font-bold ${isAlert ? 'text-status-alert' : 'text-blue-400'}`}>
                {calculatedDepthCm} cm
              </strong>
            </div>

            <div className="p-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-ink-secondary block">Flow Velocity</span>
              <strong className="text-ink font-bold">{flowVelocity}</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-ink-secondary block">Soil Saturation</span>
              <strong className="text-purple font-bold">{soilSaturation}%</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-ink-secondary block">Time to Clear</span>
              <strong className="text-status-alert font-bold">{clearanceTimeHrs} hrs</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
