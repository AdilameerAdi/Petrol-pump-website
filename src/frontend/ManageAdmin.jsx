import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageAdmin() {
  const navigate = useNavigate();

  // Dummy data for table
  const [admins, setAdmins] = useState([
    { name: "John Doe", mobile: "1234567890", position: "Manager", username: "john123" },
    { name: "Jane Smith", mobile: "0987654321", position: "Supervisor", username: "jane456" },
  ]);

  return (
    <div className="p-6">
      {/* Add Admin Button aligned to right */}
      <div className="mb-6 flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/home/add-admin")}
        >
          Add Admin
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Admin List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Mobile Number</th>
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Password</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{admin.name}</td>
                <td className="border border-gray-300 px-4 py-2">{admin.mobile}</td>
                <td className="border border-gray-300 px-4 py-2">{admin.position}</td>
                <td className="border border-gray-300 px-4 py-2">{admin.username}</td>
                <td className="border border-gray-300 px-4 py-2">{admin.password || "******"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
