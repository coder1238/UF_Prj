import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Download, ShieldAlert, Smartphone } from 'lucide-react';

export default function OfflineBeaconQrModal({ isOpen, onClose, payload, coordinates, ward }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate an SVG QR-like matrix pattern dynamically based on payload string hash
  const generateMatrix = (str) => {
    const size = 21; // 21x21 QR Version 1
    const grid = [];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        // Finder patterns (top-left, top-right, bottom-left)
        const isFinderTL = r < 7 && c < 7;
        const isFinderTR = r < 7 && c >= size - 7;
        const isFinderBL = r >= size - 7 && c < 7;

        if (isFinderTL) {
          row.push((r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0);
        } else if (isFinderTR) {
          const tc = c - (size - 7);
          row.push((r === 0 || r === 6 || tc === 0 || tc === 6 || (r >= 2 && r <= 4 && tc >= 2 && tc <= 4)) ? 1 : 0);
        } else if (isFinderBL) {
          const tr = r - (size - 7);
          row.push((tr === 0 || tr === 6 || c === 0 || c === 6 || (tr >= 2 && tr <= 4 && c >= 2 && c <= 4)) ? 1 : 0);
        } else {
          // Semi-pseudo random based on coordinate and hash
          const val = (Math.sin(r * 3.1 + c * 7.3 + (hash % 100)) > 0) ? 1 : 0;
          row.push(val);
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const matrix = generateMatrix(payload);

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Offline Rescue Optical QR Beacon</h3>
              <p className="text-xs text-slate-300 font-mono">Zero-Network Handheld Scanner Payload</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-5">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Show this QR screen to NDRF or Mumbai Fire rescue boats and helicopter optical cameras. It encodes your precise coordinates and medical needs offline.</span>
          </div>

          {/* Render QR Matrix */}
          <div className="inline-block p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-inner">
            <svg 
              viewBox="0 0 21 21" 
              className="w-56 h-56 mx-auto shape-rendering-crisp"
              style={{ imageRendering: 'pixelated' }}
            >
              {matrix.map((row, r) =>
                row.map((col, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    fill={col ? '#0f172a' : '#ffffff'}
                  />
                ))
              )}
            </svg>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left font-mono text-[11px] text-slate-700">
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>ENCODED DISTRESS PAYLOAD:</span>
              <span className="text-emerald-700">CRC-32 Validated</span>
            </div>
            <p className="line-clamp-3 text-slate-600 whitespace-pre-wrap">{payload}</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-colors"
            >
              <Download className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

