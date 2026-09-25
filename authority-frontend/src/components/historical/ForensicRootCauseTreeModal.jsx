import React, { useState } from 'react';
import { X, GitFork, CheckCircle2 } from 'lucide-react';

export default function ForensicRootCauseTreeModal({ isOpen, onClose }) {
  const [selectedEvent, setSelectedEvent] = useState('29-aug-2025');

  if (!isOpen) return null;

  const ROOT_CAUSE_TREES = {
    '29-aug-2025': {
      title: '29 Aug 2025 Sion-Kurla Inundation Forensic Tree',
      topEvent: 'Severe 68cm Inundation in Milan & Andheri Subways, LBS Marg Corridor',
      branches: [
        {
          id: 'b1',
          name: '1. Hydrometeorological Forcing Exceedance',
          contribution: '42%',
          subCauses: [
            { text: 'Convective cloudburst peaked at 126 mm/h (Design limit: 50 mm/h)', severity: 'CRITICAL' },
            { text: 'Rapid impervious surface saturation within 18 minutes of onset', severity: 'HIGH' },
            { text: 'Localized stationary meso-cyclone trapped against Ghatkopar hill range', severity: 'MODERATE' },
          ]
        },
        {
          id: 'b2',
          name: '2. Tidal Flap Gate Backwater Lockout',
          contribution: '36%',
          subCauses: [
            { text: 'Coinciding 4.42m astronomical spring high tide at 15:20 IST', severity: 'CRITICAL' },
            { text: 'Mahim Bay flap gates forced shut by seaward hydraulic pressure head', severity: 'CRITICAL' },
            { text: 'Mithi River water surface elevation crested at 4.15m MSL', severity: 'HIGH' },
          ]
        },
        {
          id: 'b3',
          name: '3. Physical Trash Rack & Silt Accumulation',
          contribution: '14%',
          subCauses: [
            { text: 'Plastic packaging debris trapped against drop junction D-204 trash screen', severity: 'HIGH' },
            { text: 'Siltation layer in Kurla trunk conduit reduced effective cross-section by 32%', severity: 'MODERATE' },
          ]
        },
        {
          id: 'b4',
          name: '4. Civic Emergency Dispatch Latency',
          contribution: '8%',
          subCauses: [
            { text: '18-minute transit delay for mobile dewatering pumps due to traffic gridlock', severity: 'LOW' },
            { text: 'Traffic diversion barriers at Milan Subway deployed after 15cm water buildup', severity: 'MODERATE' },
          ]
        }
      ],
      correctiveActions: [
        { rec: 'Install automated hydraulic trash-screen rakes at junction D-204', timeline: 'Q1 2026', owner: 'Stormwater Drainage Dept' },
        { rec: 'Deploy preemptive flood boom barriers triggered directly by Radar QPE >80 mm/h', timeline: 'Completed', owner: 'Traffic Police & MCGM' },
        { rec: 'Upgrade Mahim creek tidal outfall pump capacity by +40 m³/s', timeline: 'Q3 2026', owner: 'BRIMSTOWAD Project Team' },
      ]
    },
    '26-jul-2005': {
      title: '26 Jul 2005 Historic Megastorm Root Cause Tree',
      topEvent: 'Widespread 142cm Inundation Across Suburban Mumbai Basin',
      branches: [
        {
          id: 'b1',
          name: '1. Unprecedented Precipitation Volume',
          contribution: '60%',
          subCauses: [
            { text: '944 mm in 24 hours (148 mm/h peak intensity)', severity: 'CRITICAL' },
            { text: 'Offshore synoptic trough line stagnation', severity: 'CRITICAL' },
          ]
        },
        {
          id: 'b2',
          name: '2. Encroached Mithi River Natural Course',
          contribution: '25%',
          subCauses: [
            { text: 'River channel width constricted near airport runway expansion', severity: 'CRITICAL' },
            { text: 'Bandra-Kurla Complex reclamations eliminated natural holding mangroves', severity: 'HIGH' },
          ]
        },
        {
          id: 'b3',
          name: '3. Zero Stormwater Pumping Infrastructure',
          contribution: '15%',
          subCauses: [
            { text: 'Pre-BRIMSTOWAD era had zero major seaward pumping stations', severity: 'CRITICAL' },
            { text: 'Total dependence on gravity outfalls during 4.48m spring high tide', severity: 'CRITICAL' },
          ]
        }
      ],
      correctiveActions: [
        { rec: 'Establishment of 7 modern stormwater pumping stations with 250+ m³/s total capacity', timeline: 'Executed 2011-2023', owner: 'MCGM' },
        { rec: 'Widening, deepening, and retaining-wall training along 17.8 km Mithi River channel', timeline: 'Continuous', owner: 'MMRDA & Mithi Authority' },
      ]
    }
  };

  const currentTree = ROOT_CAUSE_TREES[selectedEvent] || ROOT_CAUSE_TREES['29-aug-2025'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-soft rounded-lg text-purple">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Post-Event Forensic Incident Investigation &amp; Fault-Tree Analysis (FTA)
              </h2>
              <p className="text-xs text-ink-secondary">
                Root-Cause Deconstruction, Causal Factor Weighting &amp; Municipal Corrective Actions Ledger
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-lg text-ink-secondary hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Select */}
        <div className="p-3 bg-surface border-b border-border flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink-secondary">Select Event Dossier:</span>
          {Object.keys(ROOT_CAUSE_TREES).map(key => (
            <button
              key={key}
              onClick={() => setSelectedEvent(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
                selectedEvent === key
                  ? 'bg-purple-soft text-purple border-purple font-bold'
                  : 'bg-surface-secondary text-ink border-border hover:border-purple/30'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top Event Node */}
          <div className="p-4 bg-status-alert-soft border-2 border-status-alert/40 rounded-xl text-center shadow-subtle">
            <span className="text-[10px] font-mono font-bold uppercase text-status-alert tracking-wider block">
              Top Incident Hazard (Root Consequence)
            </span>
            <h3 className="text-sm font-extrabold text-ink mt-1">{currentTree.topEvent}</h3>
          </div>

          {/* Fault Tree Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTree.branches.map(branch => (
              <div key={branch.id} className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <h4 className="text-xs font-bold text-ink">{branch.name}</h4>
                  <span className="text-xs font-mono font-bold text-purple bg-purple-soft px-2 py-0.5 rounded">
                    Contrib: {branch.contribution}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {branch.subCauses.map((sub, i) => (
                    <div key={i} className="p-2 bg-surface rounded-lg border border-border text-xs flex items-start gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                        sub.severity === 'CRITICAL' ? 'bg-status-alert-soft text-status-alert' :
                        sub.severity === 'HIGH' ? 'bg-status-warning-soft text-status-warning' :
                        'bg-purple-soft text-purple'
                      }`}>
                        {sub.severity}
                      </span>
                      <span className="text-ink leading-relaxed">{sub.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Corrective Action Ledger */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-status-safe" />
              Municipal Corrective Action Remediation Ledger
            </h4>
            <div className="space-y-2">
              {currentTree.correctiveActions.map((action, i) => (
                <div key={i} className="p-2.5 bg-surface-secondary border border-border rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple" />
                    <span className="font-semibold text-ink">{action.rec}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-ink-secondary">Target: <strong className="text-ink">{action.timeline}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-purple-soft text-purple">{action.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-subtle flex justify-between items-center text-xs">
          <span className="text-ink-secondary font-mono">Forensic Standard: ISO 31010 Failure Mode &amp; Effects Analysis (FMEA)</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-ink text-white rounded-lg hover:bg-ink-secondary transition-colors font-semibold">
            Close Tree
          </button>
        </div>
      </div>
    </div>
  );
}
