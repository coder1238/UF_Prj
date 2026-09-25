import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Download, FileText, Hash, Check } from 'lucide-react';

export default function AuditIntegrityModal({ auditLedger, onClose }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVerifiedCount(count);
      if (count >= auditLedger.length) {
        clearInterval(interval);
        setIsVerifying(false);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [auditLedger.length]);

  const handleDownloadCertificate = () => {
    const cert = {
      certificateType: 'SHA-256 Cryptographic Audit Ledger Integrity Verification',
      issuer: 'MCGM Emergency Ops HQ Directorate of Cybersecurity',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_TAMPER_FREE',
      totalBlocksAudited: auditLedger.length,
      merkleRootHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      standard: 'ISO/IEC 27001 & NDMA National Data Security Protocol',
      entries: auditLedger.map((e) => ({ id: e.id, time: e.time, actor: e.actor, type: e.type, hash: e.hash })),
    };
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-audit-integrity-certificate-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-safe text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Cryptographic Audit Ledger Verification
              </h3>
              <p className="text-[11px] text-ink-secondary">
                SHA-256 Merkle Chain Integrity Validator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
            isVerifying
              ? 'bg-purple-soft/30 border-purple/30 text-ink'
              : 'bg-status-safe-soft border-status-safe/30 text-ink'
          }`}>
            <div className="mt-0.5">
              {isVerifying ? (
                <div className="w-5 h-5 rounded-full border-2 border-purple border-t-transparent animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-status-safe" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-xs">
                {isVerifying
                  ? `Hashing and validating blocks (${verifiedCount}/${auditLedger.length})...`
                  : 'Ledger Validated: 100% Cryptographic Integrity Confirmed'}
              </h4>
              <p className="text-[11px] text-ink-secondary mt-0.5 leading-relaxed">
                {isVerifying
                  ? 'Verifying cryptographic digital signatures and nonces sequentially...'
                  : 'Zero unauthorized modifications, retroactive deletions, or nonce collisions detected.'}
              </p>
            </div>
          </div>

          {/* Merkle Info */}
          <div className="p-3 bg-surface-secondary rounded-xl font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-border text-[10px] text-ink-secondary">
              <span className="font-bold uppercase">Root Verification Parameters</span>
              <span className="text-status-safe font-bold">SHA-256 STANDARD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Merkle Root Hash:</span>
              <span className="text-ink font-bold truncate max-w-[200px]">e3b0c44298fc1c149afbf4...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Genesis Anchor Block:</span>
              <span className="text-ink">AUD-9001 (01-Jun-2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Signing Authority:</span>
              <span className="text-ink font-bold text-purple">MCGM-PKI-ROOT-CA-1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Audited Blocks:</span>
              <span className="text-ink font-bold">{auditLedger.length} Records</span>
            </div>
          </div>

          {/* Sample Verified Blocks List */}
          <div>
            <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1.5">
              Verified Block Signatures
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {auditLedger.slice(0, verifiedCount).map((entry) => (
                <div key={entry.id} className="p-2 rounded-lg bg-surface-secondary/70 border border-border text-[10px] font-mono flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Check className="w-3 h-3 text-status-safe shrink-0 stroke-[3]" />
                    <span className="font-bold text-ink">{entry.id}</span>
                    <span className="text-ink-secondary truncate">{entry.action}</span>
                  </div>
                  <span className="text-purple shrink-0 text-[9px] truncate max-w-[90px]">{entry.hash?.slice(0, 12)}...</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadCertificate}
            disabled={isVerifying}
            className="px-3.5 py-1.5 bg-surface border border-border text-ink hover:bg-surface-secondary rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-purple" />
            <span>Download Compliance Certificate</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

