'use client';
import { useState, ChangeEvent } from 'react';
import Layout from "@/components/Layout";

interface UserInfo {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
}

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
}

const UserProfile = () => {
  // State to hold user information
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "john_doe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    phoneNumber: "123-456-7890",
  });

  // State for managing password changes
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for managing notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    inAppNotifications: true,
  });

  // Handle changes in user information
  const handleUserInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes in password
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes in notification settings
  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Save changes to user information
  const saveUserInfo = () => {
    // Here, you would typically send userInfo to your API to save changes
    alert("User information updated!");
  };

  // Save changes to password
  const savePassword = () => {
    // Here, you would typically send passwordInfo to your API to change password
    alert("Password updated!");
  };

  // Save changes to notification settings
  const saveNotificationSettings = () => {
    // Here, you would typically send notificationSettings to your API to save changes
    alert("Notification settings updated!");
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">User Profile</h2>

        {/* User Information Section */}
        <section className="bg-white p-6 shadow rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">User Information</h3>
          <div className="mb-4">
            <label className="block mb-2">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={userInfo.fullName}
              onChange={handleUserInfoChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={userInfo.phoneNumber}
              onChange={handleUserInfoChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <button onClick={saveUserInfo} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </section>

        {/* Password Management Section */}
        <section className="bg-white p-6 shadow rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Change Password</h3>
          <div className="mb-4">
            <label className="block mb-2">Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordInfo.currentPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordInfo.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordInfo.confirmPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <button onClick={savePassword} className="bg-blue-600 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </section>

        {/* Notification Settings Section */}
        <section className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Notification Settings</h3>
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
          <button onClick={saveNotificationSettings} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default UserProfile;
