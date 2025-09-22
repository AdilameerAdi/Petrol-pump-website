import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { requestService } from "../services/requestService";

export default function HolidayRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    date: ""
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (user?.id) {
      try {
        const data = await requestService.getUserRequests(user.id);
        const holidayRequests = data.filter(req => req.type === 'holiday');
        setRequests(holidayRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.date) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const requestData = {
        user_id: user.id,
        type: 'holiday',
        description: formData.description,
        date: formData.date
      };

      await requestService.submitRequest(requestData);
      setFormData({ description: "", date: "" });
      setShowForm(false);
      setMessage("Holiday request submitted successfully!");
      fetchRequests(); // Refresh list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error submitting request: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/home/permissions")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Permissions</span>
          </button>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-300"
          >
            <FaPlus />
            New Holiday Request
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCalendarAlt className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Holiday Requests</h1>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {/* New Request Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Holiday Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason/Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter reason for holiday..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-300"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Holiday Requests</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No holiday requests found
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {request.description}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Holiday Date:</span> {request.date}
                        </div>
                        <div>
                          <span className="font-medium">Request Date:</span> {new Date(request.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Approved By:</span> {request.approved_by_user?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}