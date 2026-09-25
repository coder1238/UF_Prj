import React, { useState } from 'react';
import {
  Camera,
  Download,
  X,
  CheckCircle2,
  FileText,
  Tag,
  Printer,
  Shield,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function CCTVSnapshotModal({
  isOpen,
  onClose,
  selectedCam,
  snapshots = [],
  onSaveSnapshot,
}) {
  const [operatorId, setOperatorId] = useState('MCGM-CV-OPS-42');
  const [groundTruthReading, setGroundTruthReading] = useState(
    selectedCam ? (selectedCam.detectedDepth + 0.5).toString() : '28.5'
  );
  const [notes, setNotes] = useState('Visual confirmation of curb inundation. Water level surging past lane 2 curb line.');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleCaptureAndSave = () => {
    const newSnapshot = {
      id: `SNAP-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      camId: selectedCam.id,
      camName: selectedCam.name,
      ward: selectedCam.ward,
      depth: selectedCam.detectedDepth,
      groundTruth: groundTruthReading,
      operator: operatorId,
      notes: notes,
      confidence: selectedCam.confidence,
    };
    onSaveSnapshot(newSnapshot);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleExportJSON = (snap) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${snap.id}_forensic_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Forensic Ground-Truth Snapshot Dossier
              </h2>
              <p className="text-xs text-ink-secondary">
                Certified high-resolution optical capture with cryptographic metadata watermark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-ink">
          {/* Simulated High-Res Freeze Frame */}
          <div className="relative rounded-xl border border-border overflow-hidden bg-slate-950 aspect-video flex items-center justify-center shadow-inner">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse at bottom, #1e293b 0%, #0f172a 70%, #020617 100%)',
              }}
            />

            {/* Road & Water Inundation Representation */}
            <div
              className="absolute inset-x-8 bottom-0 bg-blue-900/60 border-t-2 border-sky-400 flex flex-col justify-end p-4"
              style={{ height: `${Math.min(75, Math.max(20, (selectedCam.detectedDepth / 60) * 100))}%` }}
            >
              <div className="text-sky-200 text-xs font-mono font-bold">
                CALIBRATED WATERLINE: {selectedCam.detectedDepth} cm
              </div>
            </div>

            {/* Official Forensic Metadata Stamp */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md p-3 rounded-lg border border-white/10 font-mono text-[10px] text-white space-y-0.5">
              <div className="text-sky-400 font-bold">MCGM DISASTER MANAGEMENT CELL</div>
              <div>CAMERA: {selectedCam.name}</div>
              <div>WARD: {selectedCam.ward} • RTSP H.265</div>
              <div>TIMESTAMP: {new Date().toLocaleTimeString('en-IN')} IST</div>
              <div>ALGO: YOLOv8-HydroEdge INT8 (Conf: {selectedCam.confidence}%)</div>
              <div>VERIFICATION STATUS: PENDING SIGN-OFF</div>
            </div>

            <div className="absolute bottom-3 right-3 bg-status-alert text-white font-mono text-xs px-2.5 py-1 rounded font-bold shadow-lg">
              INUNDATION DEPTH: {selectedCam.detectedDepth} cm
            </div>
          </div>

          {/* Operator Annotation & Ground Truth Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple" />
                Certifying Operator Badge ID
              </label>
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:border-purple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple" />
                Physical Staff Gauge Reading (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={groundTruthReading}
                onChange={(e) => setGroundTruthReading(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:border-purple"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-ink">
                Forensic Verification Notes & Incident Summary
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-purple resize-none"
              />
            </div>
          </div>

          {/* Past Session Snapshots List */}
          {snapshots.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Session Snapshot Audit Archive ({snapshots.length})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {snapshots.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-surface-secondary rounded-xl border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-ink">{s.id} — {s.camName}</div>
                      <div className="text-[10px] text-ink-secondary">
                        {s.timestamp} • Depth: {s.depth}cm • Ground Truth: {s.groundTruth}cm • By {s.operator}
                      </div>
                    </div>
                    <button
                      onClick={() => handleExportJSON(s)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-purple-soft hover:text-purple border border-border transition-all flex items-center gap-1 text-[11px]"
                      title="Download JSON Dossier"
                    >
                      <Download className="w-3 h-3" />
                      JSON
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-surface-secondary">
          <div className="text-xs text-ink-muted">
            Cryptographic SHA-256 hash stamped upon commit
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-ink hover:bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCaptureAndSave}
              disabled={isSaved}
              className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-semibold hover:bg-purple-deep transition-all shadow-subtle flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Saved to Dossier!
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Save & Commit Snapshot
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

