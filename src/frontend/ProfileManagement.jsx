import React, { useState } from "react";

export default function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    username: "john123",
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

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUsernameChange = (e) => {
    setUsernameData({ ...usernameData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
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
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4"
          >
            Save Changes
          </button>
        )}
      </div>

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
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4">
            Update Username
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
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow-md transition duration-200 mt-4">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
