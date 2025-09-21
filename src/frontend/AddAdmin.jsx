import React from "react";
import { useNavigate } from "react-router-dom";

export default function AddAdmin() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Admin</h2>

      <form className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter name"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter mobile number"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Position</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
            >
              <option value="">Select position</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              placeholder="Confirm password"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition duration-200"
          >
            Save Admin
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
