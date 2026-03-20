'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { springSnappy, staggerContainer, staggerItem } from "@/lib/motion";

const API_BASE = "https://management-backend-api.vercel.app/api";

interface UserInfo { username: string; email: string; fullName: string; phoneNumber: string; }
interface PasswordInfo { currentPassword: string; newPassword: string; confirmPassword: string; }
interface NotificationSettings { emailNotifications: boolean; inAppNotifications: boolean; }

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };
const inputStyle: React.CSSProperties = {
  background: '#0a0d0d', border: '1px solid #1f2e2d',
  color: '#f0fdfa', borderRadius: '8px', padding: '10px 12px',
  fontSize: '13px', outline: 'none', width: '100%', transition: 'border-color 0.15s',
};

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "", email: "", fullName: "", phoneNumber: "",
  });
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true, inAppNotifications: true,
  });
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [errorSection, setErrorSection] = useState<{ section: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/Login"; return; }

    fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUserInfo({
          username: data.username || "",
          email: data.email || "",
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
        });
      })
      .catch(err => console.error("Failed to load profile:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const showSaved = (section: string) => {
    setSavedSection(section);
    setErrorSection(null);
    setTimeout(() => setSavedSection(null), 2500);
  };

  const showError = (section: string, message: string) => {
    setErrorSection({ section, message });
    setTimeout(() => setErrorSection(null), 4000);
  };

  const handleUserInfoChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPasswordInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNotificationSettings(prev => ({ ...prev, [e.target.name]: e.target.checked }));

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#14b8a6'; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#1f2e2d'; };

  const handleSaveInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(userInfo),
      });
      if (res.ok) {
        showSaved("info");
      } else {
        const data = await res.json();
        showError("info", data.message || "Failed to save changes.");
      }
    } catch {
      showError("info", "Network error. Please try again.");
    }
  };

  const handleSavePassword = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      showError("password", "New passwords do not match.");
      return;
    }
    if (passwordInfo.newPassword.length < 6) {
      showError("password", "Password must be at least 6 characters.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/users/me/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
        }),
      });
      if (res.ok) {
        showSaved("password");
        setPasswordInfo({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        showError("password", data.message || "Failed to change password.");
      }
    } catch {
      showError("password", "Network error. Please try again.");
    }
  };

  const initials = userInfo.fullName
    ? userInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userInfo.username.slice(0, 2).toUpperCase();

  const SaveBtn = ({ section, onClick }: { section: string; onClick: () => void }) => (
    <div className="flex items-center gap-3 flex-wrap">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        layout
        className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        style={{ background: savedSection === section ? '#15803d' : '#0d9488' }}
        onMouseEnter={e => { if (savedSection !== section) (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
        onMouseLeave={e => { if (savedSection !== section) (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
      >
        {savedSection === section ? (
          <>
            <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnappy}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
            Saved!
          </>
        ) : 'Save Changes'}
      </motion.button>
      {errorSection?.section === section && (
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {errorSection.message}
        </motion.span>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <motion.div
            className="w-8 h-8 rounded-full border-2"
            style={{ borderColor: '#1f2e2d', borderTopColor: '#0d9488' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="max-w-3xl mx-auto space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Avatar header */}
        <motion.div style={card} className="p-6 flex items-center gap-5" variants={staggerItem} whileHover={{ y: -2 }}>
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            whileHover={{ scale: 1.06, rotate: 4 }}
            transition={springSnappy}
          >
            {initials}
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-white">{userInfo.fullName || userInfo.username}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#2dd4bf' }}>{userInfo.email}</p>
            <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: 'rgba(13,148,136,0.12)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.25)' }}>
              @{userInfo.username}
            </span>
          </div>
        </motion.div>

        {/* User info */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center gap-2 mb-5 pb-4" style={cardHeader}>
            <svg className="w-4 h-4" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-sm font-semibold text-white">User Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Full Name', name: 'fullName', type: 'text', value: userInfo.fullName },
              { label: 'Username', name: 'username', type: 'text', value: userInfo.username },
              { label: 'Email Address', name: 'email', type: 'email', value: userInfo.email },
              { label: 'Phone Number', name: 'phoneNumber', type: 'tel', value: userInfo.phoneNumber },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>{f.label}</label>
                <input type={f.type} name={f.name} value={f.value} onChange={handleUserInfoChange}
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            ))}
          </div>
          <SaveBtn section="info" onClick={handleSaveInfo} />
        </motion.div>

        {/* Password */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center gap-2 mb-5 pb-4" style={cardHeader}>
            <svg className="w-4 h-4" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="text-sm font-semibold text-white">Change Password</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Current Password</label>
              <input type="password" name="currentPassword" value={passwordInfo.currentPassword}
                onChange={handlePasswordChange} placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>New Password</label>
              <input type="password" name="newPassword" value={passwordInfo.newPassword}
                onChange={handlePasswordChange} placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordInfo.confirmPassword}
                onChange={handlePasswordChange} placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <SaveBtn section="password" onClick={handleSavePassword} />
        </motion.div>

        {/* Notifications */}
        <motion.div style={card} className="p-5" variants={staggerItem} whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center gap-2 mb-5 pb-4" style={cardHeader}>
            <svg className="w-4 h-4" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-sm font-semibold text-white">Notification Settings</h3>
          </div>
          <div className="space-y-2 mb-5">
            {[
              { name: 'emailNotifications', label: 'Email Notifications', desc: 'Receive alerts and updates via email' },
              { name: 'inAppNotifications', label: 'In-App Notifications', desc: 'Show notifications inside the platform' },
            ].map(item => (
              <label key={item.name} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <div className="mt-0.5 w-9 h-5 rounded-full relative shrink-0 transition-colors"
                  style={{ background: notificationSettings[item.name as keyof NotificationSettings] ? '#0d9488' : '#0a0d0d', border: '1px solid #1f2e2d' }}>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    style={{ transform: notificationSettings[item.name as keyof NotificationSettings] ? 'translateX(16px)' : 'translateX(0)' }} />
                  <input type="checkbox" name={item.name}
                    checked={notificationSettings[item.name as keyof NotificationSettings]}
                    onChange={handleNotificationChange} className="sr-only" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#0d9488' }}>{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <motion.button
            onClick={() => showSaved("notifications")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ background: savedSection === "notifications" ? '#15803d' : '#0d9488' }}
            onMouseEnter={e => { if (savedSection !== "notifications") (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
            onMouseLeave={e => { if (savedSection !== "notifications") (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
          >
            {savedSection === "notifications" ? (
              <>
                <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnappy}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
                Saved!
              </>
            ) : 'Save Changes'}
          </motion.button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default UserProfile;
