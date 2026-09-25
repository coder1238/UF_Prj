import React, { useState } from 'react';
import { X, CheckCircle2, AlertOctagon, RotateCcw, Droplets, Check, ShieldAlert } from 'lucide-react';

export default function ReportActionsModal({ report, isOpen, onClose, onUpdateReport, onWithdrawReport }) {
  const [actionType, setActionType] = useState('update_depth'); // 'update_depth' | 'mark_resolved' | 'withdraw'
  const [newDepth, setNewDepth] = useState(report?.depth || 25);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (actionType === 'update_depth') {
        onUpdateReport(report.id, {
          depth: Number(newDepth),
          comments: [
            ...(report.comments || []),
            {
              id: Date.now(),
              author: 'Citizen Reporter (You)',
              role: 'Reporter',
              time: 'Just now',
              text: `Updated observed water depth to ${newDepth} cm. ${reason ? `Note: ${reason}` : ''}`
            }
          ]
        });
      } else if (actionType === 'mark_resolved') {
        onUpdateReport(report.id, {
          status: 'resolved',
          statusColor: 'green',
          depth: 0,
          steps: report.steps?.map(s => s.name === 'Resolved' || s.name.includes('Resolved') ? { ...s, status: 'COMPLETED', time: 'Just now', desc: `Citizen verified road clear. ${reason || 'Water receded naturally.'}` } : s) || [],
          comments: [
            ...(report.comments || []),
            {
              id: Date.now(),
              author: 'Citizen Reporter (You)',
              role: 'Reporter',
              time: 'Just now',
              text: `Citizen verified road clear and water receded. ${reason || ''}`
            }
          ]
        });
      } else if (actionType === 'withdraw') {
        onWithdrawReport(report.id, reason || 'Withdrawn by citizen.');
      }

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-primary" />
            <h3 className="font-bold text-ink text-base">Manage Report #{report.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActionType('update_depth')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                actionType === 'update_depth'
                  ? 'border-purple-primary bg-purple-50 text-purple-primary font-bold shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Droplets className="w-4 h-4 mx-auto mb-1 text-purple-primary" />
              <span className="text-[11px] block">Update Depth</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('mark_resolved')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                actionType === 'mark_resolved'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <span className="text-[11px] block">Self-Resolved</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('withdraw')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                actionType === 'withdraw'
                  ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <AlertOctagon className="w-4 h-4 mx-auto mb-1 text-red-600" />
              <span className="text-[11px] block">Withdraw</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {actionType === 'update_depth' && (
              <div className="space-y-3">
                <label className="font-bold text-slate-700 block">
                  Revised Water Level: <span className="font-mono text-purple-primary text-sm font-black">{newDepth} cm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={newDepth}
                  onChange={(e) => setNewDepth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0 cm (Dry)</span>
                  <span>30 cm (Axle)</span>
                  <span>60 cm (Waist)</span>
                  <span>120 cm (Deep)</span>
                </div>
              </div>
            )}

            {actionType === 'mark_resolved' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 space-y-1">
                <span className="font-bold block text-sm">Confirm Road Clearance</span>
                <p className="text-[11px]">
                  Marking this ticket as resolved verifies to the municipal war room that water has receded beneath passable levels.
                </p>
              </div>
            )}

            {actionType === 'withdraw' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 space-y-1">
                <span className="font-bold block text-sm">Cancel / Withdraw Incident</span>
                <p className="text-[11px]">
                  Withdraw this observation if logged mistakenly or duplicate. This frees up assigned dewatering units for other sectors.
                </p>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason / Citizen Remarks (Optional):</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add contextual details for the ward engineer..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm ${
                  actionType === 'withdraw'
                    ? 'bg-red-600 hover:bg-red-700'
                    : actionType === 'mark_resolved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-purple-primary hover:bg-purple-deep'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Save & Confirm'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
