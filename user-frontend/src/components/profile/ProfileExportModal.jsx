import React, { useState } from 'react';
import { 
  Download, Upload, Printer, FileText, CheckCircle2, 
  X, AlertTriangle, ShieldCheck, Copy, HardDrive
} from 'lucide-react';

export default function ProfileExportModal({ isOpen, onClose, fullProfileData, onImportData, speakAlert }) {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importedSuccess, setImportedSuccess] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(fullProfileData, null, 2);

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mumbai_Disaster_Profile_${(fullProfileData.identity?.name || 'Citizen').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    speakAlert("Disaster preparedness profile exported as JSON file.");
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importText);
      onImportData(parsed);
      setImportedSuccess(true);
      speakAlert("Profile imported successfully.");
      setTimeout(() => {
        setImportedSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert("Invalid JSON format. Please verify the imported file structure.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-ink rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-purple-soft text-purple-primary rounded-2xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink">Disaster Plan Vault & Cloud Export</h3>
            <p className="text-xs text-muted">
              Backup your calibrated vehicles, go-bag checklists, and medical triage passes for offline storage.
            </p>
          </div>
        </div>

        {importedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile settings imported and synchronized!
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={handleDownloadJson}
            className="p-4 rounded-2xl border border-slate-200 hover:border-purple-primary bg-slate-50 hover:bg-purple-soft/30 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:border-purple-200 shadow-2xs">
              <Download className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <span className="text-xs font-bold text-ink block">Download JSON Backup</span>
              <span className="text-[11px] text-muted">Offline encrypted file for pen-drives</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-4 rounded-2xl border border-slate-200 hover:border-purple-primary bg-slate-50 hover:bg-purple-soft/30 transition text-left flex items-start gap-3 group"
          >
            <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:border-purple-200 shadow-2xs">
              <Printer className="w-5 h-5 text-purple-primary" />
            </div>
            <div>
              <span className="text-xs font-bold text-ink block">Print A4 Survival Card</span>
              <span className="text-[11px] text-muted">Physical paper wallet emergency copy</span>
            </div>
          </button>
        </div>

        {/* Import JSON Form */}
        <form onSubmit={handleImportSubmit} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono uppercase text-muted font-bold block">
              Restore Profile from JSON Backup
            </label>
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="text-[11px] text-purple-primary hover:underline font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy Current JSON'}
            </button>
          </div>

          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported JSON profile backup here to restore..."
            className="w-full p-3 text-xs font-mono bg-canvas border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-primary/30"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={!importText.trim()}
              className="px-5 py-2 bg-purple-primary hover:bg-purple-deep disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Restore Backup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

