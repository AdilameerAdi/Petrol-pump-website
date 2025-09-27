import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export default function ManageAdmin() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  


  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      username: user.username,
      email: user.email,
      mobile: user.mobile || '',
      role: user.role
    });
  };

  const handleUpdate = async (userId) => {
    try {
      await userService.updateUser(userId, editForm);
      setMessage('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to update user: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await userService.deleteUser(userId);
        setMessage('User deleted successfully!');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete user: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Dashboard</span>
          </button>
        </div>
      {user?.role !== 'admin' ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Only admins can manage users.
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Manage All Users</h1>
            <p className="text-lg text-gray-600">Edit, delete, and manage all system users</p>
          </div>

          {/* Add User Button */}
          <div className="mb-6 flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-300"
              onClick={() => navigate("/home/add-admin")}
            >
              Add New User
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All System Users</h2>
            
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
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              userItem.name
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <input
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              userItem.username
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              userItem.email
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <input
                                type="text"
                                value={editForm.mobile}
                                onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              userItem.mobile || 'N/A'
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="cashier">Cashier</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-1 rounded text-xs ${
                                userItem.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                userItem.role === 'manager' ? 'bg-purple-100 text-purple-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {userItem.role}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              userItem.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {userItem.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(userItem.created_at).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editingUser === userItem.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdate(userItem.id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(userItem)}
                                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                  title="Edit User"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                <button
                                  onClick={() => handleDelete(userItem.id, userItem.name)}
                                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                  title="Delete User"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              </div>
                            )}
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
    </div>
  );


}
