import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  Layers,
  ArrowDown,
  CheckCircle2,
  HardHat,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useFloodCommand } from '../../context/FloodCommandContext';

export default function BarrierDeploymentModal({ asset, onClose, onDeployed }) {
  const { addBarrier, addCommandLog } = useFloodCommand();
  const [selectedGateId, setSelectedGateId] = useState(asset.ingressGates?.[0]?.id || 'gate-1');
  const [barrierType, setBarrierType] = useState('Hydraulic Rising Flood Wall');
  const [barrierHeightCm, setBarrierHeightCm] = useState(80);
  const [crewAssigned, setCrewAssigned] = useState('MCGM Ward Quick Reaction Force');
  const [sealGaskets, setSealGaskets] = useState(true);

  const selectedGate = asset.ingressGates?.find((g) => g.id === selectedGateId) || {
    name: 'Main Ingress Gate',
    depthCm: asset.predictedDepth,
  };

  const BARRIER_SPECS = [
    {
      name: 'Hydraulic Rising Flood Wall',
      setupTime: '2.5 minutes (Automated SCADA Ram)',
      maxHeadCm: 150,
      mitigationEfficiency: 95,
      description: 'Underground flush-mounted steel dam raised by electro-hydraulic actuators with pressurized silicone gaskets.',
    },
    {
      name: 'Quick-Deploy Aluminum Slat Barrier',
      setupTime: '15 minutes (2 Personnel)',
      maxHeadCm: 100,
      mitigationEfficiency: 90,
      description: 'Demountable high-strength extruded aluminum flood stop logs slotted into pre-installed compression stanchions.',
    },
    {
      name: 'Rapid Sandbag Dike (Double Stacked)',
      setupTime: '30 minutes (8 Personnel)',
      maxHeadCm: 60,
      mitigationEfficiency: 70,
      description: 'Woven polypropylene sandbags laid in interlocking pyramid formation with 500-micron polyethylene geomembrane liner.',
    },
    {
      name: 'Self-Inflating Aqua-Barrier Water Tube',
      setupTime: '10 minutes (Self-Filling)',
      maxHeadCm: 80,
      mitigationEfficiency: 82,
      description: 'Industrial vinyl water-inflated bladder that uses encroaching stormwater mass to create impervious gravity ballast.',
    },
  ];

  const currentSpec = BARRIER_SPECS.find((b) => b.name === barrierType) || BARRIER_SPECS[0];
  const calculatedDeflection = Math.min(selectedGate.depthCm, Math.round(barrierHeightCm * (currentSpec.mitigationEfficiency / 100)));
  const residualDepth = Math.max(0, selectedGate.depthCm - calculatedDeflection);

  const handleDeploy = (e) => {
    e.preventDefault();

    // Add to GIS Map placedBarriers in FloodCommandContext
    const newBarrierId = `bar-${Date.now().toString().slice(-4)}`;
    addBarrier({
      id: newBarrierId,
      name: `${asset.name} - ${selectedGate.name} (${barrierType})`,
      coordinates: [asset.coordinates[1] + (Math.random() - 0.5) * 0.002, asset.coordinates[0] + (Math.random() - 0.5) * 0.002],
      heightCm: barrierHeightCm,
      mitigationDeltaCm: -calculatedDeflection,
      deployedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      type: `${barrierType} (${barrierHeightCm}cm)`,
    });

    addCommandLog({
      officer: 'Ingress Defense Coordinator',
      type: 'BARRIER_DEFENSE_DEPLOYED',
      details: `Installed ${barrierHeightCm}cm ${barrierType} at ${asset.name} [${selectedGate.name}]. Predicted flood depth mitigated by -${calculatedDeflection}cm (Residual: ${residualDepth}cm).`,
      status: 'VERIFIED_ACTIVE',
    });

    onDeployed({
      gateId: selectedGateId,
      barrierType,
      barrierHeightCm,
      residualDepth,
      calculatedDeflection,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-secondary border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/30">
              <Shield className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Ingress Gate Barrier Actuator &amp; Rapid Dike Deployment
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold uppercase">
                  Physical Defense
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Protecting Ingress Corridors for {asset.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-border/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDeploy} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Target Gate Selector */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Select Facility Ingress Gate
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(asset.ingressGates || [
                { id: 'gate-1', name: 'Gate 1 (Main Ingress)', depthCm: asset.predictedDepth },
                { id: 'gate-2', name: 'Gate 2 (Ambulance Bay)', depthCm: Math.round(asset.predictedDepth * 0.7) },
              ]).map((gate) => (
                <button
                  key={gate.id}
                  type="button"
                  onClick={() => setSelectedGateId(gate.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedGateId === gate.id
                      ? 'bg-purple-soft/60 border-purple text-ink shadow-sm'
                      : 'bg-surface border-border text-ink-secondary hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink">{gate.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                      {gate.depthCm} cm
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-secondary mt-1 flex items-center justify-between">
                    <span>Status: {gate.status || 'Active'}</span>
                    <span>{gate.barrierActive ? 'Existing Barrier' : 'Unprotected'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Barrier Technology Selector */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
              Engineered Barrier System
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BARRIER_SPECS.map((spec) => (
                <button
                  key={spec.name}
                  type="button"
                  onClick={() => setBarrierType(spec.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    barrierType === spec.name
                      ? 'bg-purple-soft border-purple text-ink ring-1 ring-purple'
                      : 'bg-surface border-border text-ink-secondary hover:border-purple/40'
                  }`}
                >
                  <div className="font-bold text-xs text-ink">{spec.name}</div>
                  <div className="text-[10px] text-ink-secondary mt-1">{spec.description}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple font-bold">Deploy: {spec.setupTime}</span>
                    <span className="text-status-safe font-bold">Eff: {spec.mitigationEfficiency}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Barrier Height Slider & Mitigation Calculation */}
          <div className="bg-surface-secondary/70 p-3.5 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-ink-secondary">
                Defense Barrier Elevation Height: <span className="text-purple font-mono text-sm">{barrierHeightCm} cm</span>
              </span>
              <span className="text-[10px] font-mono text-ink-secondary">
                Max Rating: {currentSpec.maxHeadCm} cm Head
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={currentSpec.maxHeadCm}
              step={5}
              value={barrierHeightCm}
              onChange={(e) => setBarrierHeightCm(Number(e.target.value))}
              className="w-full accent-purple cursor-pointer"
            />

            {/* Live Hydraulic Deflection Matrix */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="bg-surface p-2 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Encroaching Depth</span>
                <span className="text-sm font-bold text-status-alert">{selectedGate.depthCm} cm</span>
              </div>
              <div className="bg-surface p-2 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Deflection Delta</span>
                <span className="text-sm font-bold text-status-safe">-{calculatedDeflection} cm</span>
              </div>
              <div className="bg-surface p-2 rounded-lg border border-border">
                <span className="text-[10px] text-ink-secondary uppercase block">Residual At Gate</span>
                <span className={`text-sm font-bold ${residualDepth > 0 ? 'text-status-warning' : 'text-status-safe'}`}>
                  {residualDepth} cm ({residualDepth === 0 ? 'DRY & SECURE' : 'SEEPAGE'})
                </span>
              </div>
            </div>
          </div>

          {/* Deployment Crew & Gaskets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-ink-secondary mb-1">
                Deployment Task Force
              </label>
              <select
                value={crewAssigned}
                onChange={(e) => setCrewAssigned(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-2.5 py-2 text-xs font-mono font-semibold text-ink focus:outline-none focus:border-purple"
              >
                <option value="MCGM Ward Quick Reaction Force">MCGM Ward Disaster Quick Reaction Force (12 Men)</option>
                <option value="NDRF 5th Battalion Sapper Unit">NDRF 5th Battalion Sapper Unit (8 Men)</option>
                <option value="On-Site Facility Maintenance Team">On-Site Facility Maintenance &amp; Security Team</option>
                <option value="Automated SCADA Tele-Actuation">Automated SCADA Tele-Actuation (No Crew Needed)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={sealGaskets}
                  onChange={(e) => setSealGaskets(e.target.checked)}
                  className="rounded text-purple focus:ring-purple"
                />
                <span>Pressurize Pneumatic Silicone Gasket Seals</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple text-white hover:bg-purple-deep shadow-subtle flex items-center gap-2 transition-all transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Deploy Physical Barrier &amp; Log Defense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

