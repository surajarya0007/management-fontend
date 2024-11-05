'use client';
import React, { useState, ChangeEvent } from 'react';
import Layout from "@/components/Layout";

// Define types for the state objects
type GeneralSettings = {
  appName: string;
  environment: string;
  baseURL: string;
  loggingLevel: string;
};

type UserPreferences = {
  language: string;
  theme: string;
  defaultLandingPage: string;
};

type Integration = {
  id: number;
  name: string;
  type: string;
  status: string;
};

type NewIntegration = {
  name: string;
  type: string;
  apiKey: string;
  webhookURL: string;
};

type AuditLogs = {
  logLevel: string;
  retentionPeriod: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  scanResults: boolean;
  apiChanges: boolean;
};

type Role = {
  id: number;
  name: string;
  permissions: string[];
};

type NewRole = {
  name: string;
  permissions: string[];
};

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: "API Security Shield",
    environment: "Development",
    baseURL: "https://api.example.com",
    loggingLevel: "Info",
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    language: "English",
    theme: "Light",
    defaultLandingPage: "Dashboard",
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 1, name: "Jenkins", type: "CI/CD", status: "Active" },
    { id: 2, name: "Slack Notifications", type: "Monitoring", status: "Active" },
    { id: 3, name: "Sentry", type: "Monitoring", status: "Inactive" },
  ]);

  const [newIntegration, setNewIntegration] = useState<NewIntegration>({
    name: "",
    type: "",
    apiKey: "",
    webhookURL: "",
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogs>({
    logLevel: "Info",
    retentionPeriod: "30 days",
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    inAppNotifications: true,
    scanResults: true,
    apiChanges: true,
  });

  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Admin", permissions: ["All Permissions"] },
    { id: 2, name: "Security Analyst", permissions: ["View Scans", "Manage APIs"] },
    { id: 3, name: "Developer", permissions: ["Add APIs", "View Reports"] },
  ]);

  const [newRole, setNewRole] = useState<NewRole>({
    name: "",
    permissions: [],
  });

  // Handlers for general settings
  const handleGeneralSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveGeneralSettings = () => {
    alert("General settings saved!");
  };

  // Handlers for user preferences
  const handleUserPreferencesChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const saveUserPreferences = () => {
    alert("User preferences saved!");
  };

  // Handlers for integrations
  const handleIntegrationChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIntegration((prev) => ({ ...prev, [name]: value }));
  };

  const addIntegration = () => {
    if (newIntegration.name && newIntegration.type) {
      setIntegrations((prev) => [
        ...prev,
        { id: integrations.length + 1, ...newIntegration, status: "Active" },
      ]);
      setNewIntegration({ name: "", type: "", apiKey: "", webhookURL: "" });
      alert("Integration added!");
    } else {
      alert("Please fill in all fields!");
    }
  };

  const deleteIntegration = (id: number) => {
    setIntegrations((prev) => prev.filter((integration) => integration.id !== id));
    alert("Integration deleted!");
  };

  // Handlers for audit logs settings
  const handleAuditLogsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAuditLogs((prev) => ({ ...prev, [name]: value }));
  };

  const saveAuditLogsSettings = () => {
    alert("Audit logs settings saved!");
  };

  // Handlers for notification settings
  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const saveNotificationSettings = () => {
    alert("Notification settings saved!");
  };

  // Handlers for role management
  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const addRole = () => {
    if (newRole.name) {
      setRoles((prev) => [...prev, { id: roles.length + 1, ...newRole }]);
      setNewRole({ name: "", permissions: [] });
      alert("Role added!");
    } else {
      alert("Please enter a role name!");
    }
  };

  const deleteRole = (id: number) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
    alert("Role deleted!");
  };
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Settings</h2>

        {/* General Settings */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">General Settings</h3>
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="mb-4">
              <label className="block mb-2">Application Name:</label>
              <input
                type="text"
                name="appName"
                value={generalSettings.appName}
                onChange={handleGeneralSettingsChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Environment:</label>
              <select
                name="environment"
                value={generalSettings.environment}
                onChange={handleGeneralSettingsChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Base URL:</label>
              <input
                type="text"
                name="baseURL"
                value={generalSettings.baseURL}
                onChange={handleGeneralSettingsChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Logging Level:</label>
              <select
                name="loggingLevel"
                value={generalSettings.loggingLevel}
                onChange={handleGeneralSettingsChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="Debug">Debug</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
              </select>
            </div>
            <button onClick={saveGeneralSettings} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </section>

        {/* User Preferences */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">User Preferences</h3>
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="mb-4">
              <label className="block mb-2">Language:</label>
              <select
                name="language"
                value={userPreferences.language}
                onChange={handleUserPreferencesChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Theme:</label>
              <select
                name="theme"
                value={userPreferences.theme}
                onChange={handleUserPreferencesChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Default Landing Page:</label>
              <select
                name="defaultLandingPage"
                value={userPreferences.defaultLandingPage}
                onChange={handleUserPreferencesChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="Dashboard">Dashboard</option>
                <option value="API Inventory">API Inventory</option>
                <option value="Reports">Reports</option>
              </select>
            </div>
            <button onClick={saveUserPreferences} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </section>

        {/* API Integration Settings */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">API Integration Settings</h3>
          <div className="bg-white p-6 shadow rounded-lg mb-4">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-3 border-b border-gray-300">Integration Name</th>
                  <th className="p-3 border-b border-gray-300">Integration Type</th>
                  <th className="p-3 border-b border-gray-300">Status</th>
                  <th className="p-3 border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.id} className={integration.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3 border-b border-gray-300">{integration.name}</td>
                    <td className="p-3 border-b border-gray-300">{integration.type}</td>
                    <td className="p-3 border-b border-gray-300">{integration.status}</td>
                    <td className="p-3 border-b border-gray-300">
                      <button onClick={() => deleteIntegration(integration.id)} className="text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Add New Integration</h4>
            <div className="mb-4">
              <label className="block mb-2">Integration Name:</label>
              <input
                type="text"
                name="name"
                value={newIntegration.name}
                onChange={handleIntegrationChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Integration Type:</label>
              <select
                name="type"
                value={newIntegration.type}
                onChange={handleIntegrationChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="">Select Type</option>
                <option value="CI/CD">CI/CD</option>
                <option value="Monitoring">Monitoring</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">API Key/Secret:</label>
              <input
                type="text"
                name="apiKey"
                value={newIntegration.apiKey}
                onChange={handleIntegrationChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Webhook URL:</label>
              <input
                type="text"
                name="webhookURL"
                value={newIntegration.webhookURL}
                onChange={handleIntegrationChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <button onClick={addIntegration} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Integration
            </button>
          </div>
        </section>

        {/* Audit Logs Settings */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Audit Logs Settings</h3>
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="mb-4">
              <label className="block mb-2">Log Level:</label>
              <select
                name="logLevel"
                value={auditLogs.logLevel}
                onChange={handleAuditLogsChange}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Log Retention Period:</label>
              <input
                type="text"
                name="retentionPeriod"
                value={auditLogs.retentionPeriod}
                onChange={handleAuditLogsChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <button onClick={saveAuditLogsSettings} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Notification Settings</h3>
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Email Notifications</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="inAppNotifications"
                  checked={notificationSettings.inAppNotifications}
                  onChange={handleNotificationChange}
                  className="form-checkbox"
                />
                <span className="ml-2">In-App Notifications</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="scanResults"
                  checked={notificationSettings.scanResults}
                  onChange={handleNotificationChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Scan Results Notifications</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="apiChanges"
                  checked={notificationSettings.apiChanges}
                  onChange={handleNotificationChange}
                  className="form-checkbox"
                />
                <span className="ml-2">API Changes Notifications</span>
              </label>
            </div>
            <button onClick={saveNotificationSettings} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </section>

        {/* Role Management */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Role and Permission Management</h3>
          <div className="bg-white p-6 shadow rounded-lg mb-4">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-3 border-b border-gray-300">Role Name</th>
                  <th className="p-3 border-b border-gray-300">Permissions</th>
                  <th className="p-3 border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className={role.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3 border-b border-gray-300">{role.name}</td>
                    <td className="p-3 border-b border-gray-300">{role.permissions}</td>
                    <td className="p-3 border-b border-gray-300">
                      <button onClick={() => deleteRole(role.id)} className="text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Add New Role</h4>
            <div className="mb-4">
              <label className="block mb-2">Role Name:</label>
              <input
                type="text"
                name="name"
                value={newRole.name}
                onChange={handleRoleChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Permissions:</label>
              <div className="flex flex-col">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value="View Scans"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setNewRole((prev) => {
                        const permissions = checked
                          ? [...prev.permissions, value]
                          : prev.permissions.filter((p) => p !== value);
                        return { ...prev, permissions };
                      });
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2">View Scans</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value="Manage APIs"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setNewRole((prev) => {
                        const permissions = checked
                          ? [...prev.permissions, value]
                          : prev.permissions.filter((p) => p !== value);
                        return { ...prev, permissions };
                      });
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Manage APIs</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value="Add APIs"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setNewRole((prev) => {
                        const permissions = checked
                          ? [...prev.permissions, value]
                          : prev.permissions.filter((p) => p !== value);
                        return { ...prev, permissions };
                      });
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Add APIs</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value="View Reports"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setNewRole((prev) => {
                        const permissions = checked
                          ? [...prev.permissions, value]
                          : prev.permissions.filter((p) => p !== value);
                        return { ...prev, permissions };
                      });
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2">View Reports</span>
                </label>
              </div>
            </div>
            <button onClick={addRole} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Role
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Settings;
