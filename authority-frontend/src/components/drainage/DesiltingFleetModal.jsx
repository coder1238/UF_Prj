import React, { useState } from 'react';
import { X, Truck, Navigation, Send } from 'lucide-react';
import { DESILTING_TRUCKS, EXTENDED_DRAINAGE_NODES } from './drainageConstants';

export default function DesiltingFleetModal({ isOpen, onClose, showToast }) {
  const [trucks, setTrucks] = useState(DESILTING_TRUCKS);
  const [selectedTruckId, setSelectedTruckId] = useState(DESILTING_TRUCKS[0].id);
  const [targetNodeId, setTargetNodeId] = useState('D-204');

  if (!isOpen) return null;

  const activeTruck = trucks.find((t) => t.id === selectedTruckId) || trucks[0];

  const handleDispatch = (truckId) => {
    const targetNode = EXTENDED_DRAINAGE_NODES.find((n) => n.id === targetNodeId) || EXTENDED_DRAINAGE_NODES[0];
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? {
              ...t,
              status: `EN ROUTE: ${targetNode.id}`,
              assignedNode: targetNode.id,
              location: `${targetNode.name.split(' (')[1]?.replace(')', '') || targetNode.ward}`,
            }
          : t
      )
    );
    showToast(`Dispatched ${activeTruck.id} (${activeTruck.regNo}) to ${targetNode.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Jetting &amp; Super-Sucker Fleet Deployment
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  BMC SOLID WASTE MANAGEMENT DRAIN WING
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                16 High-Capacity Recycler Vacuum Trucks with 200-Bar Hydro-Jetting Rigs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Fleet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                onClick={() => setSelectedTruckId(truck.id)}
                className={`p-3.5 rounded-xl border text-left font-mono cursor-pointer transition-all ${
                  selectedTruckId === truck.id
                    ? 'bg-purple-soft text-purple border-purple font-bold shadow-subtle'
                    : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">{truck.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    truck.status.includes('ACTIVE')
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : truck.status.includes('EN ROUTE')
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-canvas text-ink-secondary'
                  }`}>
                    {truck.status}
                  </span>
                </div>
                <div className="text-[11px] text-ink truncate">{truck.regNo}</div>
                <div className="text-[10px] text-ink-secondary truncate mt-0.5">{truck.location}</div>

                <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-border/50 text-[10px]">
                  <div>
                    <span className="text-ink-secondary block">Silt Extracted</span>
                    <span className="font-bold text-ink">{truck.siltTonsCollected} Tons</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Pressure</span>
                    <span className="font-bold text-purple">{truck.jettingPressureBar} Bar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Truck Details & Reassignment */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-3 font-mono">
            <h4 className="font-bold text-xs text-ink uppercase tracking-wide flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple" />
              Dynamic Task Reassignment for Unit {activeTruck.id} ({activeTruck.regNo})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-ink-secondary block mb-1">Target Conduit Node for Desilting:</span>
                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg text-xs font-mono p-2 text-ink focus:outline-none focus:border-purple"
                >
                  {EXTENDED_DRAINAGE_NODES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.id} - {n.name} (Silt: {n.siltPercentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleDispatch(activeTruck.id)}
                  className="w-full py-2 px-3 bg-purple text-white hover:bg-purple-deep rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Unit to Selected Node</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <span className="text-xs font-mono text-ink-secondary">
            Cumulative Debris Extracted Today:{' '}
            <strong className="text-purple">
              {trucks.reduce((acc, t) => acc + t.siltTonsCollected, 0).toFixed(1)} Metric Tons
            </strong>
          </span>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Fleet Dispatcher
          </button>
        </div>
      </div>
    </div>
  );
}

