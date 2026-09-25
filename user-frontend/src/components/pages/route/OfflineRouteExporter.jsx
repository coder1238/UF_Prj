import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export default function OfflineRouteExporter({
  activeCorridor,
  originLoc,
  destLoc
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadGPX = () => {
    if (!activeCorridor) return;

    // Build standard GPX XML format
    const gpxPoints = activeCorridor.coordinates.map((coord, idx) => {
      const elev = activeCorridor.elevationProfile[idx]?.roadElevation || 20;
      return `    <trkpt lat="${coord[1]}" lon="${coord[0]}">\n      <ele>${elev}</ele>\n      <name>Step ${idx + 1}</name>\n    </trkpt>`;
    }).join('\n');

    const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="UrbanFloodCitizenIntelligence" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Safe Flood Route - ${activeCorridor.name}</name>
    <desc>Flood-aware evacuation and transit route corridor calibrated for Mumbai Monsoons</desc>
    <author><name>BMC Urban Flood Mobility Engine</name></author>
  </metadata>
  <trk>
    <name>${activeCorridor.name}</name>
    <trkseg>
${gpxPoints}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mumbai-safe-route-${activeCorridor.id}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-ink-muted">OFFLINE EMERGENCY NAVIGATION</span>
          <h4 className="text-xs font-bold text-ink">Download GPX & Offline Route Card</h4>
        </div>
        <FileText className="w-4 h-4 text-ink-muted" />
      </div>

      <p className="text-xs text-ink-secondary">
        Cellular towers and GPS can degrade during cloudbursts. Download the offline GPX track or print the water-safe cue card.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleDownloadGPX}
          className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition flex items-center justify-center gap-2 shadow-xs"
        >
          {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
          <span>{downloadSuccess ? 'GPX Downloaded!' : 'Download Offline GPX Track'}</span>
        </button>

        <button
          onClick={handlePrintCard}
          className="px-3.5 py-2.5 bg-canvas hover:bg-surface-secondary text-ink border border-border rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
          title="Print Emergency Route Sheet"
        >
          <Printer className="w-4 h-4" />
          <span>Print Card</span>
        </button>
      </div>
    </div>
  );
}
