import React, { useState } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';

export default function ReplayLogModal({ 
  isOpen, 
  onClose, 
  currentEvent, 
  onImportCustomEvent 
}) {
  const [jsonInput, setJsonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Handle Export
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentEvent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentEvent.id}-simulation-audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentEvent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Import
  const handleImportSubmit = () => {
    try {
      setErrorMsg(null);
      if (!jsonInput.trim()) {
        setErrorMsg('Please paste valid scenario JSON.');
        return;
      }
      const parsed = JSON.parse(jsonInput);
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.timelineSteps) || parsed.timelineSteps.length === 0) {
        throw new Error('Invalid schema: Missing required "id", "name", or "timelineSteps" array.');
      }
      onImportCustomEvent(parsed);
      onClose();
    } catch (e) {
      setErrorMsg(`Import Error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-primary text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">Disaster Scenario JSON Portability</h3>
              <p className="text-xs text-muted font-mono">Export current telemetry or import custom hydraulic logs</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-500 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Export Box */}
          <div className="p-4 rounded-2xl bg-canvas border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-ink">Export Active Scenario Dataset</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-primary text-white text-xs font-mono font-bold hover:bg-purple-deep transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .json
                </button>
              </div>
            </div>
            <p className="text-xs text-muted">
              Includes all {currentEvent.timelineSteps.length} hydrodynamics timesteps, tide models, pump states, and CCTV configurations.
            </p>
          </div>

          {/* Import Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-ink flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-primary" />
                Import Custom Scenario JSON
              </label>
              <span className="text-[11px] font-mono text-muted">Schema: id, name, timelineSteps[]</span>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste valid JSON scenario payload here..."
              className="w-full h-36 p-3 bg-slate-900 text-cyan-300 font-mono text-xs rounded-2xl border border-slate-700 focus:outline-none focus:border-purple-primary resize-none"
            />

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleImportSubmit}
              className="w-full py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold font-mono transition-colors shadow-sm"
            >
              Parse & Load Custom Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

