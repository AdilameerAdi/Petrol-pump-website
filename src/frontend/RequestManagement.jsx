import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaMoneyBillWave, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { requestService } from "../services/requestService";

export default function RequestManagement() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestService.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await requestService.updateRequestStatus(requestId, status, user.id);
      setMessage(`Request ${status} successfully!`);
      fetchRequests(); // Refresh list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating request: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'pending') return request.status === 'pending';
    if (filter === 'expense') return request.type === 'expense';
    if (filter === 'holiday') return request.type === 'holiday';
    return true;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'expense' ? FaMoneyBillWave : FaCalendarAlt;
  };

  const getTypeColor = (type) => {
    return type === 'expense' ? 'text-red-600' : 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaUser className="text-4xl text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Request Management</h1>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Expense ({requests.filter(r => r.type === 'expense').length})
            </button>
            <button
              onClick={() => setFilter('holiday')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'holiday' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Holiday ({requests.filter(r => r.type === 'holiday').length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requests found for the selected filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const TypeIcon = getTypeIcon(request.type);
                return (
                  <div key={request.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-1">
                        <TypeIcon className={`text-2xl mt-1 ${getTypeColor(request.type)}`} />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{request.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Requested by:</span> {request.user?.name} ({request.user?.username})
                            </div>
                            {request.type === 'expense' && (
                              <div>
                                <span className="font-medium">Amount:</span> ₹{request.amount?.toLocaleString()}
                              </div>
                            )}
                            {request.type === 'holiday' && (
                              <div>
                                <span className="font-medium">Date:</span> {request.date}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Request Date:</span> {new Date(request.created_at).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Approved by:</span> {request.approved_by_user?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {request.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                          >
                            <FaCheck />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                          >
                            <FaTimes />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}