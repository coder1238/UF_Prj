import React, { useState } from 'react';
import { X, ShieldPlus, Check, Sliders, Info } from 'lucide-react';

export default function CustomRoleModal({ onClose, onSave }) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState({
    map: true,
    sim: false,
    dispatch: false,
    alerts: false,
    models: false,
    sirens: false,
    ddl: false,
    audit: true,
  });

  const PERMISSION_DEFINITIONS = [
    { key: 'map', title: 'GIS Map Twin & Hydro Viewer', desc: 'Inspect real-time inundation depths, drainage layers, and weather radar' },
    { key: 'sim', title: 'Hydrodynamic Simulation Runner', desc: 'Execute SWMM-1D and 2D surface flow predictive simulations' },
    { key: 'dispatch', title: 'Fleet & Emergency Pump Dispatch', desc: 'Deploy mobile dewatering pumps, rescue zodiacs, and roadside barricades' },
    { key: 'alerts', title: 'Public CAP / Cell Broadcast Alerts', desc: 'Compose, authorize, and broadcast multi-lingual warnings to citizens' },
    { key: 'models', title: 'AI Radar Nowcast & PINN Weights', desc: 'Fine-tune machine learning hyperparameters and hydro model thresholds' },
    { key: 'sirens', title: 'Acoustic Outdoor Siren Network', desc: 'Trigger high-decibel audible disaster sirens in coastal/subway zones' },
    { key: 'ddl', title: 'Geodatabase & Schema DDL Alter', desc: 'Import/export GeoPackages, modify catchment boundaries and SWMM nodes' },
    { key: 'audit', title: 'Cryptographic Audit Trail Export', desc: 'Access and export SHA-256 signed operational activity ledgers' },
  ];

  const handleToggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = (select) => {
    setPermissions({
      map: select,
      sim: select,
      dispatch: select,
      alerts: select,
      models: select,
      sirens: select,
      ddl: select,
      audit: select,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    const newRole = {
      id: `role_${roleName.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}`,
      role: roleName,
      desc: description || 'Custom Municipal Duty Role',
      userCount: 0,
      ...permissions,
    };
    onSave(newRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple text-white">
              <ShieldPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Create Custom Least-Privilege Role
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Enforce granular zero-trust security across municipal operations
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
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          <form id="custom-role-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Custom Role Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ward Evacuation Supervisor"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                Operational Description / Mandate
              </label>
              <input
                type="text"
                placeholder="Specific mandate or operational boundary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink focus:outline-none focus:border-purple"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-ink-secondary uppercase">
                  Privilege Assignment Matrix ({Object.values(permissions).filter(Boolean).length}/8 Selected)
                </label>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-purple hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-border">|</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-ink-secondary hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {PERMISSION_DEFINITIONS.map((perm) => (
                  <div
                    key={perm.key}
                    onClick={() => handleToggle(perm.key)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      permissions[perm.key]
                        ? 'bg-purple-soft/30 border-purple/40 text-ink'
                        : 'bg-surface-secondary/60 border-border text-ink-secondary hover:border-border-dark'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                      permissions[perm.key]
                        ? 'bg-purple border-purple text-white'
                        : 'border-border bg-surface'
                    }`}>
                      {permissions[perm.key] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-ink text-xs flex items-center gap-1.5">
                        {perm.title}
                      </div>
                      <div className="text-[10px] text-ink-secondary leading-normal mt-0.5">
                        {perm.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl text-[11px] text-ink-secondary flex items-center gap-2">
              <Info className="w-4 h-4 text-purple shrink-0" />
              <span>
                New roles will immediately be available in operator invitation dropdowns and subject to audit tracking.
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="custom-role-form"
            className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors shadow-subtle"
          >
            Create &amp; Enforce Role
          </button>
        </div>
      </div>
    </div>
  );
}

