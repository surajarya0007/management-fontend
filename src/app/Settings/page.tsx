'use client';
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { springSnappy, staggerContainer, staggerItem, scaleIn } from "@/lib/motion";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "@/lib/api";

interface RoleConfigRow {
  _id: string;
  roleName: string;
  permissions: string[];
  isSystem: boolean;
}

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };
const inputStyle: React.CSSProperties = {
  background: '#0a0d0d', border: '1px solid #1f2e2d',
  color: '#f0fdfa', borderRadius: '8px', padding: '10px 12px',
  fontSize: '13px', outline: 'none', width: '100%', transition: 'border-color 0.15s',
};

const ALL_PERMISSIONS = [
  'All Permissions',
  'View Scans',
  'Manage APIs',
  'Add APIs',
  'View Reports',
  'User Management',
  'Settings',
];

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-5 pb-4" style={cardHeader}>
    <motion.div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{ background: 'rgba(13,148,136,0.1)', color: '#0d9488' }}
      whileHover={{ scale: 1.08, rotate: -4 }}
      transition={springSnappy}
    >
      {icon}
    </motion.div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
  </div>
);

const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#14b8a6'; };
const fieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#1f2e2d'; };

const PermissionCheckboxes = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (p: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {ALL_PERMISSIONS.map((perm) => (
      <label key={perm} className="flex items-center gap-2 cursor-pointer">
        <button
          type="button"
          onClick={() => onToggle(perm)}
          className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
          style={selected.includes(perm)
            ? { background: '#0d9488', border: '1px solid #14b8a6' }
            : { background: '#0a0d0d', border: '1px solid #1f2e2d' }}
        >
          {selected.includes(perm) && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span className="text-xs" style={{ color: '#99f6e4' }}>{perm}</span>
      </label>
    ))}
  </div>
);

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleConfigs, setRoleConfigs] = useState<RoleConfigRow[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);
  const [editRole, setEditRole] = useState<RoleConfigRow | null>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const d = jwtDecode<{ role: string }>(token);
      setIsAdmin(d.role === 'Admin');
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const fetchRoleConfigs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setRolesLoading(true);
    setRolesError(null);
    try {
      const res = await fetch(`${API_BASE}/role-configs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to load roles');
      }
      setRoleConfigs(await res.json());
    } catch (e: unknown) {
      setRolesError(e instanceof Error ? e.message : 'Failed to load roles');
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchRoleConfigs();
  }, [isAdmin]);

  const toggleNewPerm = (p: string) => {
    setNewRolePerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const toggleEditPerm = (p: string) => {
    setEditPerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const handleAddRole = async () => {
    const name = newRoleName.trim();
    if (!name) return;
    const token = localStorage.getItem('token');
    setSavingRole(true);
    setRolesError(null);
    try {
      const res = await fetch(`${API_BASE}/role-configs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleName: name, permissions: newRolePerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to create role');
      setRoleConfigs((prev) => [...prev, data].sort((a, b) => a.roleName.localeCompare(b.roleName)));
      setNewRoleName('');
      setNewRolePerms([]);
    } catch (e: unknown) {
      setRolesError(e instanceof Error ? e.message : 'Failed to create role');
    } finally {
      setSavingRole(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editRole) return;
    const token = localStorage.getItem('token');
    setSavingRole(true);
    setRolesError(null);
    try {
      const res = await fetch(`${API_BASE}/role-configs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleName: editRole.roleName, permissions: editPerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update role');
      setRoleConfigs((prev) =>
        prev.map((r) => (r._id === editRole._id ? data : r)),
      );
      setEditRole(null);
    } catch (e: unknown) {
      setRolesError(e instanceof Error ? e.message : 'Failed to update role');
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteRole = async (row: RoleConfigRow) => {
    if (row.isSystem) return;
    if (!confirm(`Delete role "${row.roleName}"? Users must be reassigned first.`)) return;
    const token = localStorage.getItem('token');
    setRolesError(null);
    try {
      const res = await fetch(`${API_BASE}/role-configs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleName: row.roleName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete role');
      setRoleConfigs((prev) => prev.filter((r) => r._id !== row._id));
    } catch (e: unknown) {
      setRolesError(e instanceof Error ? e.message : 'Failed to delete role');
    }
  };

  const openEdit = (row: RoleConfigRow) => {
    setEditRole(row);
    setEditPerms([...row.permissions]);
  };

  return (
    <Layout>
      <motion.div
        className="max-w-4xl mx-auto space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <p className="text-sm mt-0.5" style={{ color: '#0d9488' }}>Role and permission management</p>
        </motion.div>

        {/* Role & Permission Management */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="Role & Permission Management"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          {!isAdmin ? (
            <p className="text-sm" style={{ color: '#5a7d78' }}>
              Only administrators can view and edit role permissions. New roles created here are available for signup and user management.
            </p>
          ) : rolesLoading ? (
            <div className="flex justify-center py-8">
              <motion.div
                className="w-8 h-8 rounded-full border-2"
                style={{ borderColor: '#1f2e2d', borderTopColor: '#0d9488' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <>
              {rolesError && (
                <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {rolesError}
                </div>
              )}
              <table className="w-full mb-5">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                    {['Role', 'Permissions', ''].map((h) => (
                      <th key={h} className={`${h === '' ? 'text-right' : 'text-left'} pb-3 text-xs font-semibold uppercase tracking-wider`} style={{ color: '#0d9488' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roleConfigs.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(31,46,46,0.5)' }}>
                      <td className="py-3 text-sm font-medium text-white">
                        {r.roleName}
                        {r.isSystem && (
                          <span className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded" style={{ background: 'rgba(13,148,136,0.12)', color: '#5eead4' }}>system</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {(r.permissions || []).map((p) => (
                            <span key={p} className="inline-flex px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' }}>{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="text-xs px-2.5 py-1 rounded transition-colors"
                          style={{ color: '#fbbf24' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          Edit
                        </button>
                        {!r.isSystem && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRole(r)}
                            className="text-xs px-2.5 py-1 rounded transition-colors"
                            style={{ color: '#f87171' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-4" style={{ borderTop: '1px solid #1f2e2d' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#2dd4bf' }}>Add custom role</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Role name</label>
                    <input
                      type="text"
                      placeholder="e.g. Security Lead"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      style={inputStyle}
                      onFocus={fieldFocus}
                      onBlur={fieldBlur}
                    />
                  </div>
                  <PermissionCheckboxes selected={newRolePerms} onToggle={toggleNewPerm} />
                  <motion.button
                    type="button"
                    disabled={savingRole || !newRoleName.trim()}
                    onClick={handleAddRole}
                    whileHover={savingRole ? {} : { scale: 1.02 }}
                    whileTap={savingRole ? {} : { scale: 0.97 }}
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    style={{
                      background: savingRole || !newRoleName.trim() ? '#115e59' : '#0d9488',
                      color: '#fff',
                      cursor: savingRole || !newRoleName.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {savingRole ? 'Saving…' : 'Add role'}
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Edit role modal */}
      <AnimatePresence>
        {editRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(5,7,8,0.82)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !savingRole && setEditRole(null)}
            />
            <motion.div
              className="relative w-full max-w-lg mx-4 z-10 rounded-xl overflow-hidden p-5"
              style={{ background: '#0f1314', border: '1px solid #1f2e2d', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="flex items-center justify-between mb-4" style={cardHeader}>
                <h3 className="text-sm font-semibold text-white">Edit permissions — {editRole.roleName}</h3>
                <button
                  type="button"
                  onClick={() => !savingRole && setEditRole(null)}
                  className="p-1 rounded" style={{ color: '#0d9488' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <PermissionCheckboxes selected={editPerms} onToggle={toggleEditPerm} />
              <div className="flex gap-3 mt-6">
                <motion.button
                  type="button"
                  disabled={savingRole}
                  onClick={handleSaveEdit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg"
                  style={{ background: savingRole ? '#115e59' : '#0d9488' }}
                >
                  {savingRole ? 'Saving…' : 'Save'}
                </motion.button>
                <button
                  type="button"
                  disabled={savingRole}
                  onClick={() => setEditRole(null)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg"
                  style={{ background: '#0a0d0d', border: '1px solid #1f2e2d', color: '#99f6e4' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Settings;
