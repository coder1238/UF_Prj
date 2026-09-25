import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Square, Plus, RotateCcw, ShieldCheck, Briefcase } from 'lucide-react';
import { DEFAULT_GOBAG_ITEMS } from '../../data/alertsData';

export default function AlertGoBagModal({ onClose, onToast }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mumbai_citizen_gobag');
      return saved ? JSON.parse(saved) : DEFAULT_GOBAG_ITEMS;
    } catch (e) {
      return DEFAULT_GOBAG_ITEMS;
    }
  });

  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState('Safety');

  useEffect(() => {
    try {
      localStorage.setItem('mumbai_citizen_gobag', JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const toggleCheck = (id) => {
    setItems(items.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const checkedCount = items.filter(it => it.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: `gb-custom-${Date.now()}`,
      label: newItemText.trim(),
      category: newCategory,
      checked: false
    };
    setItems([...items, newItem]);
    setNewItemText('');
    if (onToast) onToast('Custom item added to Go-Bag checklist!');
  };

  const handleReset = () => {
    setItems(DEFAULT_GOBAG_ITEMS);
    if (onToast) onToast('Checklist reset to official disaster standard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold">Flood Evacuation Go-Bag Checklist</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Progress Header */}
          <div className="bg-canvas border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                Emergency Readiness Score
              </span>
              <span className="text-xs font-mono font-extrabold text-purple-primary">
                {checkedCount} / {items.length} Ready ({progressPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 80 ? 'bg-emerald-500' : progressPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-muted mt-2">
              Pack these items in a sealed waterproof backpack placed near your main doorway during high-water alerts.
            </p>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  item.checked 
                    ? 'bg-purple-50/50 border-purple-200 text-purple-950' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-purple-primary shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div>
                    <span className={`text-xs font-medium block ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted uppercase">
                      Category: {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Item */}
          <form onSubmit={handleAddItem} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="+ Add personalized kit item (e.g. Pet food, Baby formula)"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              className="flex-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-mono text-muted hover:text-red-600 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to BMC Standard
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

