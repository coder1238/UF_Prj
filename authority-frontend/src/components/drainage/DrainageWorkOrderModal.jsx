import React, { useState } from 'react';
import { X, FileText, Send } from 'lucide-react';

export default function DrainageWorkOrderModal({ isOpen, onClose, selectedNode, showToast }) {
  const [taskType, setTaskType] = useState('Desilting & Vacuum Extraction');
  const [priorityTier, setPriorityTier] = useState('P1 - Critical Emergency');
  const [engineerAssigned, setEngineerAssigned] = useState('Er. R. K. Patil (Executive Engineer)');
  const [crewSize, setCrewSize] = useState(8);
  const [equipmentList, setEquipmentList] = useState('Super-Sucker 12T + High Pressure Jetting Unit');

  const [dispatchedOrders, setDispatchedOrders] = useState([
    {
      id: 'WO-DR-2026-8841',
      node: selectedNode?.id || 'D-204',
      task: 'High-Pressure Nullah Desilting',
      priority: 'P1',
      engineer: 'Er. R. K. Patil',
      time: '18:10 IST',
      status: 'CREW ON-SITE',
    },
  ]);

  if (!isOpen || !selectedNode) return null;

  const handleIssueWorkOrder = () => {
    const newOrderId = `WO-DR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      node: selectedNode.id,
      task: taskType,
      priority: priorityTier.split(' - ')[0],
      engineer: engineerAssigned.split(' (')[0],
      time: 'Just now',
      status: 'DISPATCHED',
    };
    setDispatchedOrders([newOrder, ...dispatchedOrders]);
    showToast(`BMC WORK ORDER ${newOrderId} ISSUED to ${selectedNode.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-soft text-purple">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                Municipal Drainage Operations Work Order Dispatcher
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-soft text-purple font-bold">
                  OFFICIAL BMC E-DISPATCH
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                {selectedNode.name} • Formal Work-Order Directive for Ward Maintenance Engineers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Work Order Form */}
          <div className="bg-canvas border border-border rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-ink-secondary block mb-1">Intervention Task Directive:</span>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-ink focus:outline-none focus:border-purple font-mono"
                >
                  <option value="Desilting & Vacuum Extraction">Emergency Silt & Sludge Jetting</option>
                  <option value="Mechanical Trash Rack Clearing">Mechanical Screen Trash Rake Clearing</option>
                  <option value="Tidal Flap Sluice Inspection">Tidal Flap Sluice Seal & Hinge Overhaul</option>
                  <option value="Auxiliary Dewatering Pump Staging">Auxiliary 500HP Dewatering Pump Staging</option>
                  <option value="Curb Grate Debris Clearance">Surface Grate Waste Removal</option>
                </select>
              </div>

              <div>
                <span className="text-ink-secondary block mb-1">Priority Classification:</span>
                <select
                  value={priorityTier}
                  onChange={(e) => setPriorityTier(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-ink focus:outline-none focus:border-purple font-mono"
                >
                  <option value="P1 - Critical Emergency">P1 - Critical Emergency (Deploy in &lt;15 mins)</option>
                  <option value="P2 - Urgent High">P2 - Urgent High (&lt;45 mins)</option>
                  <option value="P3 - Routine Preventive">P3 - Routine Preventive Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-ink-secondary block mb-1">Assigned Executive Engineer:</span>
                <select
                  value={engineerAssigned}
                  onChange={(e) => setEngineerAssigned(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-ink focus:outline-none focus:border-purple font-mono"
                >
                  <option value="Er. R. K. Patil (Executive Engineer)">Er. R. K. Patil (Ward L Exec Engineer)</option>
                  <option value="Er. S. M. Gaikwad (Deputy Chief Engineer)">Er. S. M. Gaikwad (Stormwater Central)</option>
                  <option value="Er. P. B. More (Assistant Engineer)">Er. P. B. More (Ward F/N Drainage)</option>
                </select>
              </div>

              <div>
                <span className="text-ink-secondary block mb-1">Field Crew Size &amp; Labor Allocation:</span>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={crewSize}
                  onChange={(e) => setCrewSize(parseInt(e.target.value))}
                  className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-ink focus:outline-none focus:border-purple font-mono"
                />
              </div>
            </div>

            <div>
              <span className="text-ink-secondary block mb-1">Equipment &amp; Machinery Allocated:</span>
              <input
                type="text"
                value={equipmentList}
                onChange={(e) => setEquipmentList(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg p-2 text-ink focus:outline-none focus:border-purple font-mono"
              />
            </div>

            <button
              onClick={handleIssueWorkOrder}
              className="w-full py-2.5 bg-purple text-white hover:bg-purple-deep rounded-xl font-bold flex items-center justify-center gap-2 shadow-subtle transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Issue Official Electronic Work Directive</span>
            </button>
          </div>

          {/* Recent Dispatched Work Orders */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-ink uppercase tracking-wide">
              Recent Work Orders for this Sector:
            </span>
            <div className="space-y-1.5">
              {dispatchedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-secondary border border-border rounded-lg p-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple">{order.id}</span>
                    <span className="text-ink font-sans font-medium">{order.task}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-secondary">{order.engineer}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold text-[10px]">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink border border-border text-xs font-semibold hover:bg-surface-secondary">
            Close Work Orders
          </button>
        </div>
      </div>
    </div>
  );
}

