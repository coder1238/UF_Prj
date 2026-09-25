import React, { useState } from 'react';
import { X, UserPlus, Shield, KeyRound, AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react';

export default function UserManagementModal({ mode, user, onClose, onSave, onSuspendToggle }) {
  // mode: 'invite' | 'edit' | 'suspend' | 'reset-2fa'
  const isInvite = mode === 'invite';
  const isEdit = mode === 'edit';
  const isSuspend = mode === 'suspend';
  const isReset2FA = mode === 'reset-2fa';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'Disaster Officer',
    auth: user?.auth || 'Hardware YubiKey 2FA',
    email: user?.email || '',
    clearance: user?.clearance || 'LEVEL 3 (FIELD)',
    dept: user?.dept || 'MCGM Emergency Ops HQ',
    ward: user?.ward || 'Citywide HQ',
    phone: user?.phone || '+91 ',
  });

  const [resetTokenGenerated, setResetTokenGenerated] = useState(false);
  const [newToken, setNewToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvite) {
      if (!formData.name || !formData.email) return;
      onSave({
        id: `usr-${Date.now().toString().slice(-4)}`,
        ...formData,
        status: 'ACTIVE',
        lastLogin: 'Never (Invited)',
      });
    } else if (isEdit) {
      onSave({
        ...user,
        ...formData,
      });
    }
  };

  const handleGenerateEmergencyToken = () => {
    const token = 'MCGM-SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setNewToken(token);
    setResetTokenGenerated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${
              isSuspend ? 'bg-status-alert' : isReset2FA ? 'bg-purple-deep' : 'bg-purple'
            }`}>
              {isInvite && <UserPlus className="w-4 h-4" />}
              {isEdit && <UserCheck className="w-4 h-4" />}
              {isSuspend && <AlertTriangle className="w-4 h-4" />}
              {isReset2FA && <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {isInvite && 'Provision New Authority Operator'}
                {isEdit && `Edit Operator: ${user.name}`}
                {isSuspend && (user.status === 'SUSPENDED' ? `Reactivate Operator: ${user.name}` : `Suspend Operator Credentials: ${user.name}`)}
                {isReset2FA && `Reset 2FA & Issue Emergency Hardware Token`}
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Municipal Corporation of Greater Mumbai (MCGM) Security Directorate
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {/* Form for Invite / Edit */}
          {(isInvite || isEdit) && (
            <form id="user-form" onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                  Full Name &amp; Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cmdr. Rajesh Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Official Govt Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@mcgm.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-mono focus:outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-mono focus:outline-none focus:border-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Designated Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                  >
                    <option value="Super Admin">Super Admin (Gov-HQ)</option>
                    <option value="Disaster Officer">Disaster Officer</option>
                    <option value="Drainage Engineer">Drainage Engineer</option>
                    <option value="Traffic Control">Traffic Control</option>
                    <option value="GIS Analyst">GIS Analyst</option>
                    <option value="Field Commander">Field Commander</option>
                    <option value="SCADA Specialist">SCADA Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Security Clearance
                  </label>
                  <select
                    value={formData.clearance}
                    onChange={(e) => setFormData({ ...formData, clearance: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                  >
                    <option value="LEVEL 5 (FULL)">LEVEL 5 (FULL ROOT)</option>
                    <option value="LEVEL 4 (BROADCAST)">LEVEL 4 (BROADCAST/SCADA)</option>
                    <option value="LEVEL 3 (FIELD)">LEVEL 3 (FIELD/DISPATCH)</option>
                    <option value="LEVEL 2 (CITIZEN)">LEVEL 2 (CITIZEN READ-ONLY)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Primary Department
                  </label>
                  <input
                    type="text"
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                    Assigned Ward / Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-semibold focus:outline-none focus:border-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-secondary uppercase mb-1">
                  Authentication &amp; MFA Token Standard
                </label>
                <select
                  value={formData.auth}
                  onChange={(e) => setFormData({ ...formData, auth: e.target.value })}
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-ink font-mono focus:outline-none focus:border-purple"
                >
                  <option value="Hardware YubiKey 2FA">Hardware FIDO2 YubiKey (Strict Zero-Trust)</option>
                  <option value="TOTP Authenticator">TOTP Software Authenticator (RFC 6238)</option>
                  <option value="Gov-SSO / Mobile Push">Gov-SSO / Mobile Push Authentication</option>
                  <option value="PKI Certificate">X.509 PKI Smart Card Certificate</option>
                </select>
              </div>

              <div className="p-3 bg-purple-soft/40 border border-purple/20 rounded-xl text-[11px] text-purple-deep flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 shrink-0 text-purple" />
                <span>
                  All invitations and permission assignments generate cryptographically signed audit blocks under ISO/IEC 27001 guidelines.
                </span>
              </div>
            </form>
          )}

          {/* Suspend Confirmation */}
          {isSuspend && (
            <div className="space-y-4">
              <div className="p-4 bg-status-alert-soft border border-status-alert/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-status-alert shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink text-xs mb-1">
                    {user.status === 'SUSPENDED' ? 'Reactivate Operator Credentials' : 'Confirm Suspension of Command Privileges'}
                  </h4>
                  <p className="text-ink-secondary text-[11px] leading-relaxed">
                    {user.status === 'SUSPENDED'
                      ? `Re-enabling access will restore active session rights and dispatch authority for ${user.name} (${user.email}).`
                      : `Suspending will instantly revoke API sessions, invalidate YubiKey tokens, and lock emergency broadcast capabilities for ${user.name} (${user.email}).`}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl font-mono text-[11px] space-y-1">
                <div><span className="text-ink-secondary">Operator ID:</span> {user.id}</div>
                <div><span className="text-ink-secondary">Current Role:</span> {user.role}</div>
                <div><span className="text-ink-secondary">Department:</span> {user.dept}</div>
                <div><span className="text-ink-secondary">Assigned Ward:</span> {user.ward}</div>
              </div>
            </div>
          )}

          {/* 2FA Reset */}
          {isReset2FA && (
            <div className="space-y-4">
              <div className="p-3 bg-surface-secondary border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-ink">Operator: {user.name}</span>
                  <span className="font-mono text-[10px] text-purple font-semibold">{user.role}</span>
                </div>
                <div className="text-[11px] text-ink-secondary">
                  Registered MFA Method: <strong>{user.auth}</strong>
                </div>
              </div>

              {!resetTokenGenerated ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    Initiating a 2FA reset will invalidate the operator's current hardware security key or TOTP secret. An emergency temporary provisioning token will be issued.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateEmergencyToken}
                    className="w-full py-2.5 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Generate Emergency One-Time Hardware Token
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-status-safe-soft border border-status-safe/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-status-safe font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Emergency Hardware Token Issued (Valid 60 min)</span>
                  </div>
                  <div className="p-2.5 bg-surface rounded-lg border border-border font-mono font-bold text-sm text-center tracking-wider text-ink select-all">
                    {newToken}
                  </div>
                  <p className="text-[10px] text-ink-secondary text-center">
                    Transmit securely via MCGM Encrypted Gov-Radio or in-person verification.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>

          {(isInvite || isEdit) && (
            <button
              type="submit"
              form="user-form"
              className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              {isInvite ? 'Confirm & Issue Provisioning Invite' : 'Save Operator Profile'}
            </button>
          )}

          {isSuspend && (
            <button
              type="button"
              onClick={() => {
                onSuspendToggle(user.id);
                onClose();
              }}
              className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-colors ${
                user.status === 'SUSPENDED'
                  ? 'bg-status-safe hover:bg-green-700'
                  : 'bg-status-alert hover:bg-red-700'
              }`}
            >
              {user.status === 'SUSPENDED' ? 'Reactivate Operator' : 'Suspend Command Privileges'}
            </button>
          )}

          {isReset2FA && resetTokenGenerated && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple-deep transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
