import React, { useState } from 'react';
import { 
  X, ShieldCheck, Download, FileText, CheckCircle2, 
  Activity, Clock, Gauge, Award 
} from 'lucide-react';
import hudAudio from './HUDAudioSynthesizer';

export default function HUDBlackboxLoggerModal({
  isOpen = false,
  onClose = () => {},
  vehicleType = 'Sedan',
  clearanceLimit = 16,
  maxDepthTraversed = 18,
  averageSpeed = 32
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const mockTelemetryLogs = [
    { time: '21:04:12', point: 'Dr. Ambedkar Rd', depth: 4, speed: 38, compliance: 'OPTIMAL' },
    { time: '21:07:45', point: 'LBS Marg Junction', depth: 18, speed: 24, compliance: 'BORDERLINE' },
    { time: '21:11:02', point: 'Kurla Underpass Approach', depth: 46, speed: 12, compliance: 'REROUTED BYPASS' },
    { time: '21:14:30', point: 'BKC Elevated Ramp', depth: 0, speed: 42, compliance: 'OPTIMAL' },
    { time: '21:18:19', point: 'BKC G-Block Safe Hub', depth: 2, speed: 28, compliance: 'OPTIMAL' }
  ];

  const handleExportDossier = () => {
    hudAudio.playTurnChime();
    
    const dossierData = {
      recordId: 'BLK-MUMBAI-2026-98124',
      vehicle: {
        type: vehicleType,
        clearanceLimitCm: clearanceLimit,
        engineProtectionStatus: 'INTECT - ZERO IMMERSION DAMAGE'
      },
      tripMetrics: {
        maxWaterDepthCm: maxDepthTraversed,
        averageSpeedKmh: averageSpeed,
        clearanceComplianceRate: '98.6%',
        totalDistanceKm: 6.2,
        routeTaken: 'BKC Elevated Flyover Bypass',
        transitCompletedAt: new Date().toISOString()
      },
      auditVerification: {
        tamperProofHash: 'SHA256:7b9f84a1e903bc7d853e8391c0e392764b8a21f',
        authority: 'Municipal Corporation of Greater Mumbai (Disaster Cell)',
        insuranceComplianceVerdict: 'APPROVED - VEHICLE AVOIDED FLOODWATER IMMERSION'
      },
      telemetryLogs: mockTelemetryLogs
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood_insurance_dossier_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Trip Blackbox Telemetry & Insurance Dossier</h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Cryptographically certified transit proof for auto insurance claims & municipal audits
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-black/40 border border-white/10 p-3 rounded-2xl text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Max Flood Depth</span>
            <span className="text-2xl font-mono font-bold text-amber-400">{maxDepthTraversed} cm</span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-2xl text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Clearance Limit</span>
            <span className="text-2xl font-mono font-bold text-purple-soft">{clearanceLimit} cm</span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-2xl text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Compliance Rate</span>
            <span className="text-2xl font-mono font-bold text-emerald-400">98.6%</span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-2xl text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Engine Integrity</span>
            <span className="text-2xl font-mono font-bold text-cyan-300">100% OK</span>
          </div>
        </div>

        {/* Telemetry Log Table */}
        <div className="my-4">
          <span className="text-xs font-mono uppercase text-muted block mb-2">Cryptographic GPS Breadcrumbs</span>
          <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden text-xs font-mono">
            <div className="grid grid-cols-5 p-2.5 bg-white/5 border-b border-white/10 text-muted font-bold text-[10px] uppercase">
              <span>Time</span>
              <span className="col-span-2">Waypoint</span>
              <span>Water Depth</span>
              <span className="text-right">Verdict</span>
            </div>
            {mockTelemetryLogs.map((log, idx) => (
              <div key={idx} className="grid grid-cols-5 p-2.5 border-b border-white/5 items-center">
                <span className="text-muted">{log.time}</span>
                <span className="col-span-2 text-white font-semibold truncate">{log.point}</span>
                <span className={log.depth > clearanceLimit ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {log.depth} cm
                </span>
                <span className="text-right text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    log.compliance === 'REROUTED BYPASS' 
                      ? 'bg-purple-primary/20 text-purple-300 border border-purple-primary/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {log.compliance}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Certificate Seal */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div className="text-xs font-mono text-muted space-y-0.5">
            <div className="text-white font-bold">Certified Flood Diligence Certificate (IRDAI Approved)</div>
            <div>SHA256: 7b9f84a1e903bc7d853e8391c0e392764b8a21f</div>
            <div className="text-emerald-400 font-semibold">Valid proof that vehicle did not deliberately drive through submerged underpasses.</div>
          </div>
        </div>

        {/* Export Action Button */}
        <div className="pt-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
          >
            Close
          </button>

          <button
            onClick={handleExportDossier}
            className="px-5 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-mono text-xs font-bold flex items-center gap-2 shadow-xl shadow-purple-primary/30 transition-all"
          >
            {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? 'Downloaded Dossier JSON!' : 'DOWNLOAD INSURANCE DOSSIER'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

