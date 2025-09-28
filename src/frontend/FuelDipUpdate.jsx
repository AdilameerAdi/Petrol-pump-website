import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTint, FaSave } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fuelService } from "../services/fuelService";

export default function FuelDipUpdate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [fuelQuantities, setFuelQuantities] = useState({
    MS: 0,
    MSP: 0,
    HSD: 0
  });
  
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFuelQuantities();
  }, []);

  const fetchFuelQuantities = async () => {
    try {
      const quantities = await fuelService.getFuelQuantities();
      setFuelQuantities(quantities);
    } catch (error) {
      console.error('Error fetching fuel quantities:', error);
      setMessage('Error loading fuel quantities');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (fuelType, value) => {
    setFuelQuantities(prev => ({
      ...prev,
      [fuelType]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fuelService.updateFuelQuantities(fuelQuantities, user.id);
      setMessage("Fuel quantities updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating fuel quantities: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const fuelTypes = [
    { 
      code: "MS", 
      name: "Motor Spirit (Petrol)", 
      color: "bg-blue-100 border-blue-500 text-blue-800",
      unit: "kl"
    },
    { 
      code: "MSP", 
      name: "Motor Spirit Premium", 
      color: "bg-green-100 border-green-500 text-green-800",
      unit: "kl"
    },
    { 
      code: "HSD", 
      name: "High Speed Diesel", 
      color: "bg-orange-100 border-orange-500 text-orange-800",
      unit: "kl"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <span className="ml-3 text-gray-600">Loading fuel quantities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
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

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaTint className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Update Fuel Dip</h1>
          </div>
          <p className="text-lg text-gray-600">Update current fuel quantities in tanks</p>
          
          {/* Success Message */}
          {message && (
            <div className={`mt-4 px-4 py-3 rounded ${
              message.includes('Error') 
                ? 'bg-red-100 border border-red-400 text-red-700'
                : 'bg-green-100 border border-green-400 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Current Status Display */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Current Fuel Status</h2>
          <div className="flex justify-center items-center gap-6 text-lg">
            <span className="text-blue-600 font-semibold">MS: {fuelQuantities.MS}kl</span>
            <span className="text-gray-400">|</span>
            <span className="text-green-600 font-semibold">MSP: {fuelQuantities.MSP}kl</span>
            <span className="text-gray-400">|</span>
            <span className="text-orange-600 font-semibold">HSD: {fuelQuantities.HSD}kl</span>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Quantities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fuelTypes.map((fuel) => (
              <div key={fuel.code} className={`rounded-xl p-6 border-2 ${fuel.color}`}>
                <div className="text-center mb-4">
                  <FaTint className={`text-3xl mx-auto mb-2 ${fuel.color.split(' ')[2]}`} />
                  <h3 className="text-lg font-bold">{fuel.code}</h3>
                  <p className="text-sm text-gray-600">{fuel.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Quantity ({fuel.unit})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fuelQuantities[fuel.code]}
                      onChange={(e) => handleQuantityChange(fuel.code, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    <span className="font-medium">Unit:</span> Kiloliters (kl)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaSave />
              {saving ? "Saving..." : "Save Fuel Quantities"}
            </div>
          </button>
        </div>


      </div>
    </div>
  );
}