'use client';
import React, { useState, ChangeEvent } from 'react';
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { springSnappy, staggerContainer, staggerItem } from "@/lib/motion";

type GeneralSettings = { appName: string; environment: string; baseURL: string; loggingLevel: string; };
type UserPreferences = { language: string; theme: string; defaultLandingPage: string; };
type Integration = { id: number; name: string; type: string; status: string; };
type NewIntegration = { name: string; type: string; apiKey: string; webhookURL: string; };
type AuditLogs = { logLevel: string; retentionPeriod: string; };
type NotificationSettings = { emailNotifications: boolean; inAppNotifications: boolean; scanResults: boolean; apiChanges: boolean; };
type Role = { id: number; name: string; permissions: string[]; };
type NewRole = { name: string; permissions: string[]; };

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };
const inputStyle: React.CSSProperties = {
  background: '#0a0d0d', border: '1px solid #1f2e2d',
  color: '#f0fdfa', borderRadius: '8px', padding: '10px 12px',
  fontSize: '13px', outline: 'none', width: '100%', transition: 'border-color 0.15s',
};

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

const SaveBtn = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mt-5"
    style={{ background: '#0d9488' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
  >
    Save Changes
  </motion.button>
);

const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#14b8a6'; };
const fieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#1f2e2d'; };

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: "API Security Shield", environment: "Development",
    baseURL: "https://api.example.com", loggingLevel: "Info",
  });
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    language: "English", theme: "Dark", defaultLandingPage: "Dashboard",
  });
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 1, name: "Jenkins", type: "CI/CD", status: "Active" },
    { id: 2, name: "Slack Notifications", type: "Monitoring", status: "Active" },
    { id: 3, name: "Sentry", type: "Monitoring", status: "Inactive" },
  ]);
  const [newIntegration, setNewIntegration] = useState<NewIntegration>({ name: "", type: "", apiKey: "", webhookURL: "" });
  const [auditLogs, setAuditLogs] = useState<AuditLogs>({ logLevel: "Info", retentionPeriod: "30 days" });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true, inAppNotifications: true, scanResults: true, apiChanges: true,
  });
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Admin", permissions: ["All Permissions"] },
    { id: 2, name: "Security Analyst", permissions: ["View Scans", "Manage APIs"] },
    { id: 3, name: "Developer", permissions: ["Add APIs", "View Reports"] },
  ]);
  const [newRole, setNewRole] = useState<NewRole>({ name: "", permissions: [] });

  const togglePermission = (value: string) => setNewRole(prev => ({
    ...prev,
    permissions: prev.permissions.includes(value) ? prev.permissions.filter(p => p !== value) : [...prev.permissions, value],
  }));

  const allPermissions = ['View Scans', 'Manage APIs', 'Add APIs', 'View Reports'];

  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  const intStatusStyle = (status: string): React.CSSProperties =>
    status === 'Active'
      ? { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
      : { background: 'rgba(13,148,136,0.08)', color: '#5a7d78', border: '1px solid rgba(13,148,136,0.15)' };

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
          <p className="text-sm mt-0.5" style={{ color: '#0d9488' }}>Manage application configuration and preferences</p>
        </motion.div>

        {/* General */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="General Settings"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Application Name</label>
              <input type="text" name="appName" value={generalSettings.appName} onChange={e => setGeneralSettings(p => ({ ...p, appName: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Environment</label>
              <select name="environment" value={generalSettings.environment} onChange={e => setGeneralSettings(p => ({ ...p, environment: e.target.value }))} style={selectStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                {['Development', 'Staging', 'Production'].map(o => <option key={o} value={o} style={{ background: '#0a0d0d' }}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Base URL</label>
              <input type="text" name="baseURL" value={generalSettings.baseURL} onChange={e => setGeneralSettings(p => ({ ...p, baseURL: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Logging Level</label>
              <select name="loggingLevel" value={generalSettings.loggingLevel} onChange={e => setGeneralSettings(p => ({ ...p, loggingLevel: e.target.value }))} style={selectStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                {['Debug', 'Info', 'Warning', 'Error'].map(o => <option key={o} value={o} style={{ background: '#0a0d0d' }}>{o}</option>)}
              </select>
            </div>
          </div>
          <SaveBtn onClick={() => {}} />
        </motion.div>

        {/* User Preferences */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="User Preferences"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Language', name: 'language', opts: ['English', 'Spanish', 'French'], val: userPreferences.language, set: (v: string) => setUserPreferences(p => ({ ...p, language: v })) },
              { label: 'Theme', name: 'theme', opts: ['Light', 'Dark'], val: userPreferences.theme, set: (v: string) => setUserPreferences(p => ({ ...p, theme: v })) },
              { label: 'Default Landing Page', name: 'defaultLandingPage', opts: ['Dashboard', 'API Inventory', 'Reports'], val: userPreferences.defaultLandingPage, set: (v: string) => setUserPreferences(p => ({ ...p, defaultLandingPage: v })) },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>{f.label}</label>
                <select value={f.val} onChange={e => f.set(e.target.value)} style={selectStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                  {f.opts.map(o => <option key={o} value={o} style={{ background: '#0a0d0d' }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <SaveBtn onClick={() => {}} />
        </motion.div>

        {/* Integrations */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="API Integrations"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
          />
          <table className="w-full mb-5">
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                {['Integration', 'Type', 'Status', ''].map(h => (
                  <th key={h} className={`${h === '' ? 'text-right' : 'text-left'} pb-3 text-xs font-semibold uppercase tracking-wider`} style={{ color: '#0d9488' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {integrations.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid rgba(31,46,46,0.5)' }}>
                  <td className="py-3 text-sm font-medium text-white">{i.name}</td>
                  <td className="py-3 text-sm" style={{ color: '#5a7d78' }}>{i.type}</td>
                  <td className="py-3"><span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={intStatusStyle(i.status)}>{i.status}</span></td>
                  <td className="py-3 text-right">
                    <button onClick={() => setIntegrations(prev => prev.filter(x => x.id !== i.id))}
                      className="text-xs px-2.5 py-1 rounded transition-colors"
                      style={{ color: '#f87171' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-4" style={{ borderTop: '1px solid #1f2e2d' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: '#2dd4bf' }}>Add New Integration</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Integration Name" value={newIntegration.name} onChange={e => setNewIntegration(p => ({ ...p, name: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              <select value={newIntegration.type} onChange={e => setNewIntegration(p => ({ ...p, type: e.target.value }))} style={selectStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                <option value="" style={{ background: '#0a0d0d' }}>Select Type</option>
                <option value="CI/CD" style={{ background: '#0a0d0d' }}>CI/CD</option>
                <option value="Monitoring" style={{ background: '#0a0d0d' }}>Monitoring</option>
              </select>
              <input type="text" placeholder="API Key / Secret" value={newIntegration.apiKey} onChange={e => setNewIntegration(p => ({ ...p, apiKey: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              <input type="text" placeholder="Webhook URL" value={newIntegration.webhookURL} onChange={e => setNewIntegration(p => ({ ...p, webhookURL: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <button onClick={() => { if (newIntegration.name && newIntegration.type) { setIntegrations(prev => [...prev, { id: prev.length + 1, ...newIntegration, status: 'Active' }]); setNewIntegration({ name: '', type: '', apiKey: '', webhookURL: '' }); } }}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: '#0a0d0d', border: '1px solid #1f2e2d', color: '#99f6e4' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0d0d'; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Integration
            </button>
          </div>
        </motion.div>

        {/* Audit Logs */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="Audit Log Settings"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Log Level</label>
              <select name="logLevel" value={auditLogs.logLevel} onChange={e => setAuditLogs(p => ({ ...p, logLevel: e.target.value }))} style={selectStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                {['Info', 'Warning', 'Error'].map(o => <option key={o} value={o} style={{ background: '#0a0d0d' }}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Retention Period</label>
              <input type="text" name="retentionPeriod" value={auditLogs.retentionPeriod} onChange={e => setAuditLogs(p => ({ ...p, retentionPeriod: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
          <SaveBtn onClick={() => {}} />
        </motion.div>

        {/* Notifications */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="Notification Settings"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {(['emailNotifications', 'inAppNotifications', 'scanResults', 'apiChanges'] as const).map(k => {
              const labels: Record<string, string> = { emailNotifications: 'Email Notifications', inAppNotifications: 'In-App Notifications', scanResults: 'Scan Results', apiChanges: 'API Changes' };
              return (
                <label key={k} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <div className="w-9 h-5 rounded-full relative shrink-0 transition-colors"
                    style={{ background: notificationSettings[k] ? '#0d9488' : '#0a0d0d', border: '1px solid #1f2e2d' }}>
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                      style={{ transform: notificationSettings[k] ? 'translateX(16px)' : 'translateX(0)' }} />
                    <input type="checkbox" name={k} checked={notificationSettings[k]} onChange={(e: ChangeEvent<HTMLInputElement>) => setNotificationSettings(p => ({ ...p, [k]: e.target.checked }))} className="sr-only" />
                  </div>
                  <span className="text-sm" style={{ color: '#99f6e4' }}>{labels[k]}</span>
                </label>
              );
            })}
          </div>
          <SaveBtn onClick={() => {}} />
        </motion.div>

        {/* Roles */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.28)' }}>
          <SectionHeader title="Role & Permission Management"
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          <table className="w-full mb-5">
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                {['Role', 'Permissions', ''].map(h => (
                  <th key={h} className={`${h === '' ? 'text-right' : 'text-left'} pb-3 text-xs font-semibold uppercase tracking-wider`} style={{ color: '#0d9488' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(31,46,46,0.5)' }}>
                  <td className="py-3 text-sm font-medium text-white">{r.name}</td>
                  <td className="py-3"><div className="flex flex-wrap gap-1">{r.permissions.map(p => <span key={p} className="inline-flex px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' }}>{p}</span>)}</div></td>
                  <td className="py-3 text-right">
                    <button onClick={() => setRoles(prev => prev.filter(x => x.id !== r.id))}
                      className="text-xs px-2.5 py-1 rounded transition-colors" style={{ color: '#f87171' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-4" style={{ borderTop: '1px solid #1f2e2d' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: '#2dd4bf' }}>Add New Role</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Role Name</label>
                <input type="text" placeholder="e.g. Security Lead" value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#2dd4bf' }}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.map(perm => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => togglePermission(perm)} className="w-4 h-4 rounded flex items-center justify-center cursor-pointer shrink-0 transition-all"
                        style={newRole.permissions.includes(perm) ? { background: '#0d9488', border: '1px solid #14b8a6' } : { background: '#0a0d0d', border: '1px solid #1f2e2d' }}>
                        {newRole.permissions.includes(perm) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-xs" style={{ color: '#99f6e4' }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => { if (newRole.name) { setRoles(prev => [...prev, { id: prev.length + 1, ...newRole }]); setNewRole({ name: '', permissions: [] }); } }}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: '#0a0d0d', border: '1px solid #1f2e2d', color: '#99f6e4' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0d0d'; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Role
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Settings;
