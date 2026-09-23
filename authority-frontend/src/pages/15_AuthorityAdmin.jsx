import React, { useState, useMemo } from 'react';
import {
  Settings,
  Users,
  Shield,
  Lock,
  CheckCircle2,
  Sliders,
  UserPlus,
  Search,
  Download,
  RefreshCw,
  Radio,
  BellRing,
  Cpu,
  Database,
  KeyRound,
  X,
} from 'lucide-react';

import { useFloodCommand } from '../context/FloodCommandContext';
import {
  MCGM_WARDS_DIRECTORY,
  RIVER_BASINS_DATA,
  INITIAL_PERSONNEL,
  INITIAL_ROLES_MATRIX,
  INITIAL_AUDIT_LEDGER,
  SIREN_NETWORK_DATA,
} from '../components/admin/adminConstants';

import UserManagementModal from '../components/admin/UserManagementModal';
import CustomRoleModal from '../components/admin/CustomRoleModal';
import GeoSyncModal from '../components/admin/GeoSyncModal';
import AuditIntegrityModal from '../components/admin/AuditIntegrityModal';
import CellBroadcastModal from '../components/admin/CellBroadcastModal';
import RuleBuilderModal from '../components/admin/RuleBuilderModal';
import SirenTestModal from '../components/admin/SirenTestModal';

import {
  ThreatEscalationPanel,
  MultiAgencyPanel,
  SecurityPosturePanel,
  MunicipalCompliancePanel,
  ApiKeysPanel,
  ScadaTelemetryPanel,
  PhysicsEnginePanel,
  ScadaRulesPanel,
  PowerTelecomPanel,
  ContractorDesiltingPanel,
  GisVectorPublisherPanel,
  DigitalTwinLidarPanel,
  CitizenModerationPanel,
  SmsWhatsappGatewayPanel,
  DisasterRecoveryPanel,
  MobilePumpsFleetPanel,
  BufferStockDepotPanel,
  EvacuationSheltersPanel,
  SwmmSubCatchmentsPanel,
  CriticalGeoFencePanel,
} from '../components/admin/AdminFeaturePanels';

export default function AuthorityAdmin() {
  const {
    threatLevel,
    setThreatLevel,
    mobilePumpsList,
    dispatchMobilePump,
    depotInventory,
    requestSupplyTransfer,
    evacuationShelters,
    updateShelterOccupancy,
    addCommandLog,
    publishAlert,
  } = useFloodCommand();

  // Active Category / Subsystem
  // 'users' | 'geodatabase' | 'hydrology' | 'logistics' | 'safety' | 'audit'
  const [activeCategory, setActiveCategory] = useState('users');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------
  // STATE: Personnel Directory & Roles
  // -------------------------------------------------------------
  const [personnel, setPersonnel] = useState(INITIAL_PERSONNEL);
  const [rolesMatrix, setRolesMatrix] = useState(INITIAL_ROLES_MATRIX);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userModalState, setUserModalState] = useState({ open: false, mode: 'invite', user: null });
  const [customRoleModalOpen, setCustomRoleModalOpen] = useState(false);

  // -------------------------------------------------------------
  // STATE: City Geodatabase & Wards
  // -------------------------------------------------------------
  const [wardSearch, setWardSearch] = useState('');
  const [selectedWardDetail, setSelectedWardDetail] = useState(MCGM_WARDS_DIRECTORY[0]);
  const [geoSyncModalOpen, setGeoSyncModalOpen] = useState(false);

  // -------------------------------------------------------------
  // STATE: Hydrologic Model Thresholds
  // -------------------------------------------------------------
  const [thresholds, setThresholds] = useState({
    rainfallAdvisory: 50, // mm/hr
    flashFloodCutoff: 25, // cm
    severeBroadcast: 40, // cm
    springTideCutoff: 4.25, // m MSL
    drainSurchargeIndex: 85, // %
    spillwayAlertPct: 80, // %
  });

  // -------------------------------------------------------------
  // STATE: Cryptographic Audit Ledger
  // -------------------------------------------------------------
  const [auditLedger, setAuditLedger] = useState(INITIAL_AUDIT_LEDGER);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('ALL');
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // -------------------------------------------------------------
  // STATE: Dedicated Feature Modals
  // -------------------------------------------------------------
  const [cellBroadcastModalOpen, setCellBroadcastModalOpen] = useState(false);
  const [ruleBuilderModalOpen, setRuleBuilderModalOpen] = useState(false);
  const [sirenTestModalOpen, setSirenTestModalOpen] = useState(false);

  // -------------------------------------------------------------
  // Helper: Append Cryptographically Signed Action to Audit Ledger
  // -------------------------------------------------------------
  const recordAuditAction = (actor, action, type, ward = 'Citywide HQ') => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry = {
      id: `AUD-${Math.floor(9015 + Math.random() * 900)}`,
      time: timeStr,
      actor,
      action,
      ward,
      type,
      hash: fakeHash,
      status: 'VERIFIED',
    };
    setAuditLedger((prev) => [newEntry, ...prev]);

    // Also notify central command logs
    if (addCommandLog) {
      addCommandLog({
        officer: actor.split(' ')[0] + ' ' + (actor.split(' ')[1] || 'Admin'),
        type,
        details: action,
        status: 'EXECUTED',
      });
    }
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleSaveUser = (userData) => {
    if (userModalState.mode === 'invite') {
      setPersonnel([userData, ...personnel]);
      showToast(`Provisioning invitation issued to ${userData.name}`);
      recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Operator Invited: ${userData.name} (${userData.role})`, 'USER_PROVISION');
    } else if (userModalState.mode === 'edit') {
      setPersonnel(personnel.map((u) => (u.id === userData.id ? userData : u)));
      showToast(`Updated operator profile for ${userData.name}`);
      recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Operator Profile Edited: ${userData.name}`, 'USER_MODIFY');
    }
    setUserModalState({ open: false, mode: 'invite', user: null });
  };

  const handleToggleSuspend = (userId) => {
    setPersonnel(
      personnel.map((u) => {
        if (u.id === userId) {
          const next = u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
          showToast(`Operator ${u.name} is now ${next}`);
          recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Operator Access State Changed: ${u.name} -> ${next}`, 'SECURITY_OVERRIDE');
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId, userName) => {
    setPersonnel(personnel.filter((u) => u.id !== userId));
    showToast(`Operator ${userName} removed from directory.`);
    recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Operator Deleted: ${userName}`, 'USER_REVOKE');
  };

  const handleToggleRolePermission = (roleId, permKey) => {
    setRolesMatrix((prev) =>
      prev.map((r) => {
        if (r.id === roleId) {
          const updated = { ...r, [permKey]: !r[permKey] };
          showToast(`Permission '${permKey}' updated for ${r.role}`);
          recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `RBAC Permission Toggled: ${r.role} -> ${permKey}=${updated[permKey]}`, 'RBAC_ALTER');
          return updated;
        }
        return r;
      })
    );
  };

  const handleSaveCustomRole = (newRole) => {
    setRolesMatrix([...rolesMatrix, newRole]);
    setCustomRoleModalOpen(false);
    showToast(`Custom Least-Privilege Role created: ${newRole.role}`);
    recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Custom RBAC Role Created: ${newRole.role}`, 'RBAC_CREATE');
  };

  const handleExportRBAC = () => {
    const data = {
      organization: 'MCGM Greater Mumbai Disaster Management',
      exportedAt: new Date().toISOString(),
      roles: rolesMatrix,
      personnelCount: personnel.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcgm-rbac-matrix-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('RBAC Matrix exported to JSON.');
  };

  // -------------------------------------------------------------
  // THRESHOLD HANDLERS
  // -------------------------------------------------------------
  const handleCommitThresholds = () => {
    showToast('Model operational thresholds committed successfully across all 24 wards.');
    recordAuditAction(
      'Dr. M. Iyer (10.14.1.20)',
      `Thresholds Committed: Rain=${thresholds.rainfallAdvisory}mm/hr, Flood=${thresholds.flashFloodCutoff}cm, Tide=${thresholds.springTideCutoff}m`,
      'THRESHOLD_UPDATE'
    );
  };

  const handleApplyThresholdPreset = (presetName) => {
    if (presetName === 'monsoon_red') {
      setThresholds({
        rainfallAdvisory: 45,
        flashFloodCutoff: 20,
        severeBroadcast: 35,
        springTideCutoff: 4.00,
        drainSurchargeIndex: 75,
        spillwayAlertPct: 75,
      });
      showToast('Preset Applied: Extreme Monsoon Red Alert.');
    } else if (presetName === 'cloudburst_2005') {
      setThresholds({
        rainfallAdvisory: 75,
        flashFloodCutoff: 30,
        severeBroadcast: 50,
        springTideCutoff: 4.45,
        drainSurchargeIndex: 90,
        spillwayAlertPct: 85,
      });
      showToast('Preset Applied: 2005 Calibrated Cloudburst Stress-Test.');
    } else if (presetName === 'moderate_dry') {
      setThresholds({
        rainfallAdvisory: 60,
        flashFloodCutoff: 30,
        severeBroadcast: 45,
        springTideCutoff: 4.50,
        drainSurchargeIndex: 85,
        spillwayAlertPct: 90,
      });
      showToast('Preset Applied: Moderate Pre-Monsoon Dry Run.');
    }
  };

  // -------------------------------------------------------------
  // AUDIT LEDGER HANDLERS
  // -------------------------------------------------------------
  const filteredAudit = useMemo(() => {
    return auditLedger.filter((entry) => {
      const matchSearch =
        entry.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        entry.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
        entry.ward.toLowerCase().includes(auditSearch.toLowerCase());
      const matchType = auditTypeFilter === 'ALL' || entry.type === auditTypeFilter;
      return matchSearch && matchType;
    });
  }, [auditLedger, auditSearch, auditTypeFilter]);

  const handleExportAuditCSV = () => {
    const headers = ['ID', 'Time', 'Actor', 'Action', 'Ward', 'Type', 'SHA-256 Hash', 'Status'];
    const rows = filteredAudit.map((e) => [
      e.id,
      e.time,
      `"${e.actor}"`,
      `"${e.action}"`,
      `"${e.ward}"`,
      e.type,
      e.hash,
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mcgm-audit-trail-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Cryptographic Audit Ledger exported to CSV.');
  };

  // Filtered users
  const filteredPersonnel = useMemo(() => {
    return personnel.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.dept.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.ward.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [personnel, userSearch, userRoleFilter]);

  // Filtered wards
  const filteredWards = useMemo(() => {
    return MCGM_WARDS_DIRECTORY.filter((w) =>
      w.name.toLowerCase().includes(wardSearch.toLowerCase()) ||
      w.zone.toLowerCase().includes(wardSearch.toLowerCase()) ||
      w.officer.toLowerCase().includes(wardSearch.toLowerCase())
    );
  }, [wardSearch]);

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-elevated border border-border flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Operational Security Posture Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-4 shadow-subtle">
        <div>
          <h2 className="text-base font-bold text-ink uppercase tracking-wide flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple" />
            Authority Platform Governance, Enterprise RBAC &amp; Operational Controls
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Municipal Corporation of Greater Mumbai (MCGM) Central Command &bull; Disaster Management Directorate
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-status-safe-soft text-status-safe font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            SECURITY POSTURE: HARDENED
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-soft text-purple-deep font-bold">
            THREAT: {threatLevel}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-ink-secondary">
            ISO/IEC 27001
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-ink-secondary">
            NDMA SEC. 34
          </span>
        </div>
      </div>

      {/* Quick Launchpad Action Bar (High-Frequency Emergency Tools) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setCellBroadcastModalOpen(true)}
          className="p-2.5 bg-surface border border-border hover:border-status-alert rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-status-alert-soft text-status-alert shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ink text-[11px]">Cell Broadcast</div>
            <div className="text-[9px] text-ink-secondary">CAP v1.2 Gateway</div>
          </div>
        </button>

        <button
          onClick={() => setSirenTestModalOpen(true)}
          className="p-2.5 bg-surface border border-border hover:border-status-warning rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-status-warning-soft text-status-warning shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ink text-[11px]">Acoustic Sirens</div>
            <div className="text-[9px] text-ink-secondary">42 Towers Test</div>
          </div>
        </button>

        <button
          onClick={() => setGeoSyncModalOpen(true)}
          className="p-2.5 bg-surface border border-border hover:border-purple rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-purple-soft text-purple shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ink text-[11px]">Sync GeoPackage</div>
            <div className="text-[9px] text-ink-secondary">LiDAR DEM 2026</div>
          </div>
        </button>

        <button
          onClick={() => setRuleBuilderModalOpen(true)}
          className="p-2.5 bg-surface border border-border hover:border-purple rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-purple-soft text-purple shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ink text-[11px]">Policy Engine</div>
            <div className="text-[9px] text-ink-secondary">SCADA Rules</div>
          </div>
        </button>

        <button
          onClick={() => setAuditModalOpen(true)}
          className="p-2.5 bg-surface border border-border hover:border-status-safe rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-status-safe-soft text-status-safe shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ink text-[11px]">Audit Integrity</div>
            <div className="text-[9px] text-ink-secondary">SHA-256 Merkle</div>
          </div>
        </button>

        <button
          onClick={() => setUserModalState({ open: true, mode: 'invite', user: null })}
          className="p-2.5 bg-purple text-white hover:bg-purple-deep rounded-xl text-left shadow-subtle transition-all flex items-center gap-2 text-xs"
        >
          <div className="p-1.5 rounded-lg bg-white/20 text-white shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[11px]">+ Invite Operator</div>
            <div className="text-[9px] text-white/80">Provision User</div>
          </div>
        </button>
      </div>

      {/* Main Operational Categories Navigation */}
      <div className="flex items-center gap-1 border-b border-border text-xs font-semibold overflow-x-auto pb-0.5">
        {[
          { id: 'users', label: '1. Identity, Personnel & RBAC Matrix', count: personnel.length },
          { id: 'geodatabase', label: '2. City Geodatabase & Wards (24)', count: '24 Wards' },
          { id: 'hydrology', label: '3. Hydro Models, Physics & Telemetry', count: 'SWE-2D' },
          { id: 'logistics', label: '4. Fleet, Depots & Logistics Roster', count: '8 Squads' },
          { id: 'safety', label: '5. Public Safety, Alerts & Citizen Desk', count: 'CAP-v1.2' },
          { id: 'audit', label: '6. Cryptographic Audit Ledger', count: auditLedger.length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 -mb-[1px] ${
              activeCategory === cat.id
                ? 'border-purple text-purple font-bold bg-surface rounded-t-lg'
                : 'border-transparent text-ink-secondary hover:text-ink'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-ink-secondary">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* ======================================================= */}
      {/* CATEGORY 1: IDENTITY, PERSONNEL & RBAC MATRIX           */}
      {/* ======================================================= */}
      {activeCategory === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Personnel Directory (6 cols) */}
            <div className="xl:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple" />
                    Authority Personnel Directory ({filteredPersonnel.length}/{personnel.length})
                  </h3>
                  <p className="text-[10px] text-ink-secondary">
                    Active Command Staff &amp; Operational Field Dispatchers
                  </p>
                </div>
                <button
                  onClick={() => setUserModalState({ open: true, mode: 'invite', user: null })}
                  className="px-3 py-1 bg-purple text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-purple-deep transition-colors shadow-subtle"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Invite Operator</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, department, or ward..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-1.5 bg-surface-secondary border border-border rounded-lg text-xs font-semibold text-ink focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Disaster Officer">Disaster Officer</option>
                  <option value="Drainage Engineer">Drainage Engineer</option>
                  <option value="Traffic Control">Traffic Control</option>
                  <option value="GIS Analyst">GIS Analyst</option>
                  <option value="Field Commander">Field Commander</option>
                </select>
              </div>

              {/* Personnel List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredPersonnel.map((u) => (
                  <div
                    key={u.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${
                      u.status === 'SUSPENDED'
                        ? 'bg-status-alert-soft/40 border-status-alert/30 opacity-75'
                        : 'bg-surface-secondary/70 border-border hover:bg-surface'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">{u.name}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-soft text-purple-deep font-bold">
                          {u.role}
                        </span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-status-safe-soft text-status-safe'
                            : u.status === 'ON-DUTY'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-status-alert-soft text-status-alert'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-secondary mt-0.5 font-mono">
                        {u.email} &bull; <span className="text-ink">{u.dept}</span> ({u.ward})
                      </div>
                      <div className="text-[10px] text-ink-secondary mt-0.5 font-mono flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-purple" />
                        <span>Auth: {u.auth}</span>
                        <span>&bull; Clearance: {u.clearance}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setUserModalState({ open: true, mode: 'edit', user: u })}
                        className="px-2 py-1 bg-surface border border-border hover:bg-surface-secondary rounded text-[11px] font-semibold text-ink"
                        title="Edit profile"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setUserModalState({ open: true, mode: 'reset-2fa', user: u })}
                        className="px-2 py-1 bg-surface border border-border hover:bg-surface-secondary rounded text-[11px] font-semibold text-purple"
                        title="Reset 2FA Token"
                      >
                        <KeyRound className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setUserModalState({ open: true, mode: 'suspend', user: u })}
                        className={`px-2 py-1 rounded text-[11px] font-semibold ${
                          u.status === 'SUSPENDED'
                            ? 'bg-status-safe-soft text-status-safe hover:bg-status-safe hover:text-white'
                            : 'bg-status-alert-soft text-status-alert hover:bg-status-alert hover:text-white'
                        }`}
                        title={u.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                      >
                        {u.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1 text-ink-secondary hover:text-status-alert transition-colors"
                        title="Remove Operator"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Least-Privilege Role Permissions Matrix (6 cols) */}
            <div className="xl:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple" />
                    Least-Privilege Role Permissions Matrix
                  </h3>
                  <p className="text-[10px] text-ink-secondary">
                    Fine-Grained Granular Access Vectors (Zero-Trust Model)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportRBAC}
                    className="px-2.5 py-1 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3 text-purple" />
                    <span>Export RBAC</span>
                  </button>
                  <button
                    onClick={() => setCustomRoleModalOpen(true)}
                    className="px-2.5 py-1 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-deep transition-colors"
                  >
                    + Custom Role
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border text-[10px] text-ink-secondary uppercase">
                      <th className="pb-2">Role</th>
                      <th className="pb-2 text-center" title="Interactive GIS Map">Map</th>
                      <th className="pb-2 text-center" title="Hydraulic Simulation">Sim</th>
                      <th className="pb-2 text-center" title="Fleet & Pump Dispatch">Dispatch</th>
                      <th className="pb-2 text-center" title="Public Alerts">Alerts</th>
                      <th className="pb-2 text-center" title="AI Model Tuning">Models</th>
                      <th className="pb-2 text-center" title="Acoustic Sirens">Sirens</th>
                      <th className="pb-2 text-center" title="Database DDL">DDL</th>
                      <th className="pb-2 text-center" title="Audit Ledger">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rolesMatrix.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-secondary/70">
                        <td className="py-2.5 font-bold font-sans text-ink">
                          <div>{r.role}</div>
                          <div className="text-[9px] text-ink-secondary font-mono">{r.desc}</div>
                        </td>
                        {['map', 'sim', 'dispatch', 'alerts', 'models', 'sirens', 'ddl', 'audit'].map((k) => (
                          <td key={k} className="py-2.5 text-center">
                            <button
                              onClick={() => handleToggleRolePermission(r.id, k)}
                              className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors ${
                                r[k]
                                  ? 'bg-purple-soft text-purple font-bold hover:bg-purple hover:text-white'
                                  : 'text-border hover:bg-surface-secondary'
                              }`}
                            >
                              {r[k] ? '✓' : '—'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Integrated Panels: Security Posture & API Keys */}
          <SecurityPosturePanel showToast={showToast} />
          <ApiKeysPanel showToast={showToast} />
        </div>
      )}

      {/* ======================================================= */}
      {/* CATEGORY 2: CITY GEODATABASE & WARDS                    */}
      {/* ======================================================= */}
      {activeCategory === 'geodatabase' && (
        <div className="space-y-4">
          {/* Header Row with GeoPackage Verify Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-4 shadow-subtle">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                <Database className="w-4 h-4 text-purple" />
                City Geodatabase Configuration &amp; 24 MCGM Administrative Wards
              </h3>
              <p className="text-[11px] text-ink-secondary mt-0.5">
                Spatial reference: <strong>EPSG:4326 (WGS84)</strong> &bull; LiDAR 2026 Elevation Mesh &bull; 1,428 SWMM Nodes
              </p>
            </div>
            <button
              onClick={() => setGeoSyncModalOpen(true)}
              className="py-2 px-4 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors shadow-subtle flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify &amp; Synchronize GeoPackage</span>
            </button>
          </div>

          {/* River Basins High-Level Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {RIVER_BASINS_DATA.map((basin) => (
              <div key={basin.id} className="p-3 bg-surface border border-border rounded-xl shadow-subtle flex flex-col justify-between gap-1 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink text-xs line-clamp-1">{basin.name}</span>
                    <span className="font-mono text-[9px] px-1 rounded bg-purple-soft text-purple font-bold">
                      {basin.catchmentSqKm} km²
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-secondary mt-1">Outfall: {basin.outfall}</div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[10px]">
                  <div>
                    <span className="text-ink-secondary">Level: </span>
                    <strong className="text-ink">{basin.currentLevelM}m</strong> / {basin.dangerLevelM}m
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    basin.status.includes('ELEVATED')
                      ? 'bg-status-alert-soft text-status-alert'
                      : 'bg-status-safe-soft text-status-safe'
                  }`}>
                    {basin.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 24 MCGM Wards Interactive Directory */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-ink">
                  MCGM Wards Directory &amp; Drainage Density (All 24 Wards)
                </h4>
                <p className="text-[10px] text-ink-secondary">
                  Click any ward to inspect hydrologic catchment details
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter ward by name, zone, or officer..."
                  value={wardSearch}
                  onChange={(e) => setWardSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[320px]">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-[10px] text-ink-secondary uppercase">
                    <th className="pb-2">Ward ID / Name</th>
                    <th className="pb-2">Zone</th>
                    <th className="pb-2 text-right">Population</th>
                    <th className="pb-2 text-right">Area (km²)</th>
                    <th className="pb-2 text-right">Drainage Density</th>
                    <th className="pb-2 text-right">Mean Elev</th>
                    <th className="pb-2 text-center">Hotspots</th>
                    <th className="pb-2">Ward Officer</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWards.map((w) => (
                    <tr
                      key={w.id}
                      onClick={() => setSelectedWardDetail(w)}
                      className={`cursor-pointer transition-colors ${
                        selectedWardDetail?.id === w.id
                          ? 'bg-purple-soft/40 font-semibold'
                          : 'hover:bg-surface-secondary/70'
                      }`}
                    >
                      <td className="py-2 font-bold font-sans text-ink">
                        <span className="text-purple font-mono mr-1.5">[{w.id}]</span>
                        {w.name}
                      </td>
                      <td className="py-2 text-ink-secondary">{w.zone}</td>
                      <td className="py-2 text-right text-ink font-bold">{w.population}</td>
                      <td className="py-2 text-right text-ink">{w.areaSqKm}</td>
                      <td className="py-2 text-right text-purple font-bold">{w.drainageDensityKmPerSqKm} km/km²</td>
                      <td className="py-2 text-right text-ink">{w.avgElevationM}m MSL</td>
                      <td className="py-2 text-center font-bold text-status-alert">{w.hotspotCount}</td>
                      <td className="py-2 text-ink font-sans">{w.officer}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          w.status === 'CRITICAL'
                            ? 'bg-status-alert-soft text-status-alert'
                            : w.status === 'VULNERABLE'
                            ? 'bg-status-warning-soft text-status-warning'
                            : 'bg-status-safe-soft text-status-safe'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrated Panels: GIS Vector Publisher, Digital Twin LiDAR, SubCatchments, GeoFence */}
          <GisVectorPublisherPanel showToast={showToast} />
          <DigitalTwinLidarPanel showToast={showToast} />
          <SwmmSubCatchmentsPanel showToast={showToast} />
          <CriticalGeoFencePanel showToast={showToast} />
        </div>
      )}

      {/* ======================================================= */}
      {/* CATEGORY 3: HYDROLOGIC MODELS, PHYSICS & TELEMETRY      */}
      {/* ======================================================= */}
      {activeCategory === 'hydrology' && (
        <div className="space-y-4">
          {/* Operational Model Thresholds Form */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple" />
                  Hydrologic Model Operational Alert Thresholds
                </h3>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Dynamic Decision Boundaries for Automated Citywide Flash Flood Warnings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyThresholdPreset('monsoon_red')}
                  className="px-2.5 py-1 bg-surface-secondary hover:bg-border rounded-lg text-xs font-semibold text-ink"
                >
                  Preset: Red Alert
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyThresholdPreset('cloudburst_2005')}
                  className="px-2.5 py-1 bg-surface-secondary hover:bg-border rounded-lg text-xs font-semibold text-ink"
                >
                  Preset: 2005 Cloudburst
                </button>
                <button
                  type="button"
                  onClick={handleCommitThresholds}
                  className="px-3.5 py-1.5 bg-purple text-white rounded-lg text-xs font-bold hover:bg-purple-deep transition-colors shadow-subtle"
                >
                  Commit Threshold Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Rainfall Advisory Trigger:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.rainfallAdvisory} mm/hr</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={thresholds.rainfallAdvisory}
                  onChange={(e) => setThresholds({ ...thresholds, rainfallAdvisory: parseInt(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">Automated citizen caution broadcast on JalDrishti app</p>
              </div>

              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Flash Flood Inundation Cutoff:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.flashFloodCutoff} cm</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={thresholds.flashFloodCutoff}
                  onChange={(e) => setThresholds({ ...thresholds, flashFloodCutoff: parseInt(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">Subway closure &amp; LMV traffic rerouting triggered</p>
              </div>

              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Severe Life-Safety Broadcast Trigger:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.severeBroadcast} cm</span>
                </label>
                <input
                  type="range"
                  min="25"
                  max="70"
                  step="5"
                  value={thresholds.severeBroadcast}
                  onChange={(e) => setThresholds({ ...thresholds, severeBroadcast: parseInt(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">High-clearance emergency vehicles only; CAP tower alert</p>
              </div>

              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Critical High-Tide Spring Surge Level:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.springTideCutoff} m MSL</span>
                </label>
                <input
                  type="range"
                  min="3.5"
                  max="5.0"
                  step="0.05"
                  value={thresholds.springTideCutoff}
                  onChange={(e) => setThresholds({ ...thresholds, springTideCutoff: parseFloat(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">Marine backflow prevention flaps closed automatically</p>
              </div>

              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Storm Drain Surcharge Warning Index:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.drainSurchargeIndex} %</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={thresholds.drainSurchargeIndex}
                  onChange={(e) => setThresholds({ ...thresholds, drainSurchargeIndex: parseInt(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">Pipe capacity threshold before manhole cover blowout warning</p>
              </div>

              <div className="p-3 bg-surface-secondary/70 border border-border rounded-xl space-y-2">
                <label className="flex justify-between font-bold text-ink-secondary uppercase text-[11px]">
                  <span>Retention Basin Spillway Trigger:</span>
                  <span className="text-purple font-mono font-bold">{thresholds.spillwayAlertPct} %</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={thresholds.spillwayAlertPct}
                  onChange={(e) => setThresholds({ ...thresholds, spillwayAlertPct: parseInt(e.target.value) })}
                  className="w-full accent-purple"
                />
                <p className="text-[10px] text-ink-secondary">Holding pond overflow warning to downstream wards</p>
              </div>
            </div>
          </div>

          {/* Integrated Panels: SCADA Pipelines, Physics Engine, Policy Engine, Power Grid, Desilting */}
          <ScadaTelemetryPanel showToast={showToast} />
          <PhysicsEnginePanel showToast={showToast} />
          <ScadaRulesPanel onOpenRuleBuilder={() => setRuleBuilderModalOpen(true)} showToast={showToast} />
          <PowerTelecomPanel showToast={showToast} />
          <ContractorDesiltingPanel showToast={showToast} />
        </div>
      )}

      {/* ======================================================= */}
      {/* CATEGORY 4: FLEET, DEPOTS & EMERGENCY LOGISTICS         */}
      {/* ======================================================= */}
      {activeCategory === 'logistics' && (
        <div className="space-y-4">
          <ThreatEscalationPanel
            currentThreat={threatLevel}
            onThreatChange={(lvl) => {
              setThreatLevel(lvl);
              recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Threat Level Changed to: ${lvl}`, 'THREAT_ESCALATION');
            }}
            showToast={showToast}
          />
          <MobilePumpsFleetPanel
            pumps={mobilePumpsList}
            onDispatchPump={dispatchMobilePump}
            showToast={showToast}
          />
          <BufferStockDepotPanel
            depots={depotInventory}
            onRequestTransfer={requestSupplyTransfer}
            showToast={showToast}
          />
          <EvacuationSheltersPanel
            shelters={evacuationShelters}
            onUpdateShelter={updateShelterOccupancy}
            showToast={showToast}
          />
          <MunicipalCompliancePanel showToast={showToast} />
        </div>
      )}

      {/* ======================================================= */}
      {/* CATEGORY 5: PUBLIC SAFETY, ALERTS & CITIZEN DESK       */}
      {/* ======================================================= */}
      {activeCategory === 'safety' && (
        <div className="space-y-4">
          {/* Quick Trigger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface border border-border rounded-xl shadow-subtle flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                    <Radio className="w-4 h-4 text-status-alert" />
                    CAP-v1.2 XML Cell Broadcast Dispatch Gateway
                  </h3>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-status-alert-soft text-status-alert font-bold">
                    DO-NOT-DISTURB BYPASS
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                  Sends geo-targeted emergency warnings directly to all citizen mobile devices within low-lying ward tower polygons via telecom operators (Jio, Airtel, Vi, BSNL).
                </p>
              </div>
              <button
                onClick={() => setCellBroadcastModalOpen(true)}
                className="py-2 px-4 bg-status-alert text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Launch Cell Broadcast Console &amp; Simulator</span>
              </button>
            </div>

            <div className="p-4 bg-surface border border-border rounded-xl shadow-subtle flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-status-warning" />
                    Municipal High-Output Acoustic Siren Network
                  </h3>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-status-warning-soft text-status-warning font-bold">
                    42 ARMED TOWERS
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                  Audible 135 dB electro-mechanical and electronic siren arrays positioned along coastal seawalls, Mithi riverbanks, and prone railway subways.
                </p>
              </div>
              <button
                onClick={() => setSirenTestModalOpen(true)}
                className="py-2 px-4 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Open Siren Controller &amp; Audio Synthesizer</span>
              </button>
            </div>
          </div>

          <MultiAgencyPanel showToast={showToast} />
          <CitizenModerationPanel showToast={showToast} />
          <SmsWhatsappGatewayPanel showToast={showToast} />
          <DisasterRecoveryPanel showToast={showToast} />
        </div>
      )}

      {/* ======================================================= */}
      {/* CATEGORY 6: CRYPTOGRAPHIC AUDIT TRAIL LEDGER            */}
      {/* ======================================================= */}
      {activeCategory === 'audit' && (
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
                <Shield className="w-4 h-4 text-status-safe" />
                Cryptographically Signed System Command Audit Ledger
              </h3>
              <p className="text-[11px] text-ink-secondary mt-0.5">
                Immutable SHA-256 Merkle Chain &bull; ISO/IEC 27001 Regulatory Non-Repudiation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuditModalOpen(true)}
                className="px-3 py-1.5 bg-status-safe text-white hover:bg-green-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify SHA-256 Merkle Hash</span>
              </button>
              <button
                onClick={handleExportAuditCSV}
                className="px-3 py-1.5 bg-surface border border-border hover:bg-surface-secondary rounded-lg text-xs font-semibold text-ink flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by actor, IP, command, or ward..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-purple font-mono"
              />
            </div>
            <select
              value={auditTypeFilter}
              onChange={(e) => setAuditTypeFilter(e.target.value)}
              className="p-1.5 bg-surface-secondary border border-border rounded-lg text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="ALERT_BROADCAST">ALERT_BROADCAST</option>
              <option value="PUMP_OVERDRIVE">PUMP_OVERDRIVE</option>
              <option value="ROAD_CLOSURE">ROAD_CLOSURE</option>
              <option value="THREAT_ESCALATION">THREAT_ESCALATION</option>
              <option value="GEO_PACKAGE_SYNC">GEO_PACKAGE_SYNC</option>
              <option value="THRESHOLD_UPDATE">THRESHOLD_UPDATE</option>
              <option value="USER_PROVISION">USER_PROVISION</option>
              <option value="SECURITY_OVERRIDE">SECURITY_OVERRIDE</option>
            </select>
          </div>

          {/* Ledger Records */}
          <div className="space-y-2 font-mono text-xs max-h-[460px] overflow-y-auto pr-1">
            {filteredAudit.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-surface-secondary/70 border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-ink-secondary">{entry.time}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border font-bold text-purple">
                      {entry.id}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-soft text-purple-deep font-bold">
                      {entry.type}
                    </span>
                    <span className="text-[10px] text-ink-secondary">({entry.ward})</span>
                  </div>
                  <div>
                    <strong className="text-ink font-sans">{entry.actor}</strong> &rarr;{' '}
                    <span className="text-purple font-semibold">{entry.action}</span>
                  </div>
                  <div className="text-[9px] text-ink-secondary truncate max-w-lg">
                    Hash: <span className="text-ink">{entry.hash}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-status-safe bg-status-safe-soft px-2 py-0.5 rounded shrink-0">
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL DIALOGS                                           */}
      {/* ======================================================= */}

      {/* User Management Modal */}
      {userModalState.open && (
        <UserManagementModal
          mode={userModalState.mode}
          user={userModalState.user}
          onClose={() => setUserModalState({ open: false, mode: 'invite', user: null })}
          onSave={handleSaveUser}
          onSuspendToggle={handleToggleSuspend}
        />
      )}

      {/* Custom Role Modal */}
      {customRoleModalOpen && (
        <CustomRoleModal
          onClose={() => setCustomRoleModalOpen(false)}
          onSave={handleSaveCustomRole}
        />
      )}

      {/* GeoPackage Sync Modal */}
      {geoSyncModalOpen && (
        <GeoSyncModal
          onClose={() => setGeoSyncModalOpen(false)}
          onComplete={() => {
            showToast('GeoPackage layers & LiDAR DEM synchronized.');
            recordAuditAction('Cmdr. R. Verma (10.14.2.1)', 'Manual GeoPackage & DEM Topology Synchronization', 'GEO_PACKAGE_SYNC');
          }}
        />
      )}

      {/* Cryptographic Audit Verification Modal */}
      {auditModalOpen && (
        <AuditIntegrityModal
          auditLedger={auditLedger}
          onClose={() => setAuditModalOpen(false)}
        />
      )}

      {/* CAP Cell Broadcast Modal */}
      {cellBroadcastModalOpen && (
        <CellBroadcastModal
          onClose={() => setCellBroadcastModalOpen(false)}
          onBroadcastSuccess={(payload) => {
            showToast(`Cell Broadcast emitted to ${payload.ward}.`);
            recordAuditAction(
              'Cmdr. R. Verma (10.14.2.1)',
              `CAP Cell Broadcast Emitted: ${payload.severity} to ${payload.ward}`,
              'ALERT_BROADCAST',
              payload.ward
            );
            if (publishAlert) {
              publishAlert({
                id: `AL-${Math.floor(1000 + Math.random() * 9000)}`,
                title: payload.severity,
                wards: [payload.ward],
                status: 'PUBLISHED - ACTIVE',
                timestamp: payload.timestamp,
                audienceReach: '480,000 citizens',
                depthRange: '>35 cm',
                channels: ['Cell Broadcast', 'Citizen App', 'Traffic VMS'],
              });
            }
          }}
        />
      )}

      {/* SCADA Rule Builder Modal */}
      {ruleBuilderModalOpen && (
        <RuleBuilderModal
          onClose={() => setRuleBuilderModalOpen(false)}
          onSave={(newRule) => {
            setRuleBuilderModalOpen(false);
            showToast(`Automation Rule Activated: ${newRule.name}`);
            recordAuditAction('Er. S. Deshmukh (10.14.5.88)', `SCADA Policy Created: ${newRule.name}`, 'SCADA_POLICY_CREATE');
          }}
        />
      )}

      {/* Siren Test Modal */}
      {sirenTestModalOpen && (
        <SirenTestModal
          sirens={SIREN_NETWORK_DATA}
          onClose={() => setSirenTestModalOpen(false)}
          onSirenTriggered={(payload) => {
            showToast(`Acoustic Siren Signal Dispatched (${payload.mode.toUpperCase()})`);
            recordAuditAction('Cmdr. R. Verma (10.14.2.1)', `Acoustic Siren Activated: ${payload.mode} Mode`, 'SIREN_TRIGGER');
          }}
        />
      )}
    </div>
  );
}
