import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, ArrowRight, Clock, Edit3 } from 'lucide-react';

export default function MilestoneBookmarks({ 
  currentStep, 
  currentStepIndex, 
  onSelectIndex, 
  selectedEvent 
}) {
  const storageKey = `replay_notes_${selectedEvent.id}`;

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      // ignore
    }
  }, [notes, storageKey]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const item = {
      id: `note-${Date.now()}`,
      stepIndex: currentStepIndex,
      time: currentStep.time,
      phaseTitle: currentStep.title,
      text: newNoteText.trim(),
      created: new Date().toLocaleTimeString()
    };
    setNotes(prev => [item, ...prev]);
    setNewNoteText('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-primary uppercase tracking-wider">
            <Bookmark className="w-4 h-4" /> Inflection Markers & Notes
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-mono font-bold text-purple-primary hover:text-purple-deep px-2.5 py-1 rounded-lg bg-purple-soft transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin Current ({currentStep.time})</span>
          </button>
        </div>

        <h3 className="text-base font-bold text-ink">
          Engineering Annotations & Critical Inflection Jumps
        </h3>
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="my-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-primary/30 space-y-2">
          <div className="text-[11px] font-mono text-purple-900 font-bold">
            Add observation for {currentStep.time} IST ({currentStep.title}):
          </div>
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="e.g., Note rapid surge in water depth from 22cm to 54cm in 45 mins..."
            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-ink focus:outline-none focus:border-purple-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-ink font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-3 py-1 bg-purple-primary text-white text-xs font-bold rounded-lg font-mono"
            >
              Save Pin
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="my-3 space-y-2 max-h-48 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted font-mono">
            No pinned annotations yet. Click "Pin Current" to save engineer observations at key moments.
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id}
              className="p-3 rounded-2xl bg-canvas border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
            >
              <div 
                onClick={() => onSelectIndex(note.stepIndex)}
                className="flex-1 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-purple-primary font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{note.time} IST &bull; {note.phaseTitle}</span>
                  <span className="text-muted group-hover:text-purple-primary font-normal">&rarr; Jump</span>
                </div>
                <p className="text-slate-800 font-sans mt-1">{note.text}</p>
              </div>

              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="text-[10px] font-mono text-muted text-center pt-2 border-t border-slate-100">
        Persisted locally in browser storage for this event.
      </div>
    </div>
  );
}

