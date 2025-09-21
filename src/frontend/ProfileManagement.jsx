import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

export default function ProfileManagement() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.username || "John Doe",
    email: user?.email || "john@example.com",
    username: user?.username || "john123",
  });

  const [usernameData, setUsernameData] = useState({
    currentPassword: "",
    newUsername: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    reEnterPassword: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleUsernameChange = (e) => {
    setUsernameData({ ...usernameData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setError("");
    setMessage("");

    try {
      await userService.updateProfile(user.id, {
        name: profile.name,
        email: profile.email
      });
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!usernameData.currentPassword || !usernameData.newUsername) {
      setError('Please fill all fields');
      return;
    }

    setUsernameLoading(true);
    setError("");
    setMessage("");

    try {
      await userService.updateUsername(user.id, usernameData.newUsername);
      
      setMessage('Username updated successfully!');
      setUsernameData({ currentPassword: "", newUsername: "" });
      setProfile({ ...profile, username: usernameData.newUsername });
    } catch (error) {
      setError(error.message || 'Failed to update username');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.reEnterPassword) {
      setError('Please fill all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.reEnterPassword) {
      setError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    setError("");
    setMessage("");

    try {
      await userService.updatePassword(user.id, passwordData.newPassword);
      
      setMessage('Password updated successfully!');
      setPasswordData({ currentPassword: "", newPassword: "", reEnterPassword: "" });
    } catch (error) {
      setError(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center bg-white shadow-lg rounded-xl p-4">
        <h1 className="text-2xl font-bold text-gray-800">Profile Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Profile Info Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              readOnly={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition duration-200 ${
                isEditing
                  ? "border-gray-300 focus:ring-blue-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              readOnly={!isEditing}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition duration-200 ${
                isEditing
                  ? "border-gray-300 focus:ring-blue-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4 disabled:opacity-50 flex items-center"
          >
            {profileLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Username & Password Sections in a row */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Change Username Card */}
        <div className="flex-1 bg-white shadow-lg rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Change Username</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={usernameData.currentPassword}
                onChange={handleUsernameChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">New Username</label>
              <input
                type="text"
                name="newUsername"
                value={usernameData.newUsername}
                onChange={handleUsernameChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>
          <button 
            onClick={handleUsernameUpdate}
            disabled={usernameLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4 disabled:opacity-50 flex items-center"
          >
            {usernameLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Username'
            )}
          </button>
        </div>

        {/* Change Password Card */}
        <div className="flex-1 bg-white shadow-lg rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Re-enter Password</label>
              <input
                type="password"
                name="reEnterPassword"
                value={passwordData.reEnterPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>
          <button 
            onClick={handlePasswordUpdate}
            disabled={passwordLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4 disabled:opacity-50 flex items-center"
          >
            {passwordLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
