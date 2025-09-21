import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManageAdmin() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  


  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {user?.role !== 'admin' ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Only admins can manage users.
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/home/add-admin")}
            >
              Add User
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Username</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Mobile</th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-4 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="border border-gray-300 px-4 py-2">{userItem.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{userItem.username}</td>
                          <td className="border border-gray-300 px-4 py-2">{userItem.email}</td>
                          <td className="border border-gray-300 px-4 py-2">{userItem.mobile || 'N/A'}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              userItem.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              userItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {userItem.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );


}
