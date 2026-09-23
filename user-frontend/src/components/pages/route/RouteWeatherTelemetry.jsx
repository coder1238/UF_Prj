import React from 'react';
import { CloudRain, Wind, Eye, Radio, Activity } from 'lucide-react';
import { ROUTE_SENSOR_TELEMETRY } from '../../../data/routePresetsData';

export default function RouteWeatherTelemetry({
  selectedRouteId = 'safer'
}) {
  const sensor = ROUTE_SENSOR_TELEMETRY.find(s => s.corridor === selectedRouteId) || ROUTE_SENSOR_TELEMETRY[0];

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">CORRIDOR HYDROMETEOROLOGY</span>
          <h4 className="text-xs font-bold text-ink">Doppler Radar & Ultrasonic Telemetry</h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
          <Activity className="w-3 h-3 text-emerald-600 animate-pulse" /> Live Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        <div className="bg-canvas p-2.5 rounded-xl border border-border">
          <div className="flex items-center gap-1 text-[10px] text-ink-muted mb-0.5">
            <CloudRain className="w-3 h-3 text-primary" />
            <span>RAIN INTENSITY</span>
          </div>
          <span className="font-extrabold text-sm text-ink">22.4 mm/h</span>
          <span className="text-[9px] text-ink-muted block mt-0.5">Moderate Monsoonal</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border">
          <div className="flex items-center gap-1 text-[10px] text-ink-muted mb-0.5">
            <Wind className="w-3 h-3 text-teal-600" />
            <span>WIND GUSTS</span>
          </div>
          <span className="font-extrabold text-sm text-ink">38 km/h</span>
          <span className="text-[9px] text-teal-700 block mt-0.5">WSW Arabian Sea</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border">
          <div className="flex items-center gap-1 text-[10px] text-ink-muted mb-0.5">
            <Eye className="w-3 h-3 text-amber-600" />
            <span>VISIBILITY</span>
          </div>
          <span className="font-extrabold text-sm text-ink">1.8 km</span>
          <span className="text-[9px] text-amber-700 block mt-0.5">Spray on Highway</span>
        </div>

        <div className="bg-canvas p-2.5 rounded-xl border border-border">
          <div className="flex items-center gap-1 text-[10px] text-ink-muted mb-0.5">
            <Radio className="w-3 h-3 text-purple-600" />
            <span>BMC DRAIN GAUGE</span>
          </div>
          <span className="font-extrabold text-sm text-purple-primary">{sensor.waterDepthCm} cm</span>
          <span className="text-[9px] text-purple-700 block mt-0.5">{sensor.drainCapacity}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-ink-secondary bg-surface-secondary p-2 rounded-xl border border-border flex items-center justify-between">
        <span>Active Station: <strong>{sensor.name}</strong></span>
        <span>Surface Velocity: <strong>{sensor.surfaceVelocity}</strong></span>
      </div>
    </div>
  );
}
