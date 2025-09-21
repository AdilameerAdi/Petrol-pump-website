import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export default function AddAdmin() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    position: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await userService.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.position || 'user',
        name: formData.name,
        mobile: formData.mobile
      });

      setSuccess("User created successfully!");
      setFormData({
        name: "",
        mobile: "",
        position: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      setError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Admin</h2>

      {user?.role !== 'admin' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Only admins can add new users.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter mobile number"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
            >
              <option value="">Select position</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || user?.role !== 'admin'}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Save User"
            )}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 shadow-md transition duration-200"
            onClick={() => navigate("/manage-admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
