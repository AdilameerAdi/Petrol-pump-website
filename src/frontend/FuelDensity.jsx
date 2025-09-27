import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGasPump, FaSave, FaThermometerHalf, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fuelService } from "../services/fuelService";

export default function FuelDensity() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [densityData, setDensityData] = useState({
    MS: { hydrometer_reading: 0, temperature: 0 },
    MSP: { hydrometer_reading: 0, temperature: 0 },
    HSD: { hydrometer_reading: 0, temperature: 0 }
  });
  
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDensityData();
  }, []);

  const fetchDensityData = async () => {
    try {
      const density = await fuelService.getFuelDensity();
      setDensityData(density);
    } catch (error) {
      console.error('Error fetching density data:', error);
      setMessage('Error loading density data');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (fuelType, field, value) => {
    setDensityData(prev => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fuelService.updateFuelDensity(densityData, user.id);
      setMessage("Fuel density readings updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating density readings: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const fuelTypes = [
    { 
      code: "MS", 
      name: "Motor Spirit (Petrol)", 
      color: "bg-blue-100 border-blue-500 text-blue-800"
    },
    { 
      code: "MSP", 
      name: "Motor Spirit Premium", 
      color: "bg-green-100 border-green-500 text-green-800"
    },
    { 
      code: "HSD", 
      name: "High Speed Diesel", 
      color: "bg-orange-100 border-orange-500 text-orange-800"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <span className="ml-3 text-gray-600">Loading density data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/home/fuel-dips")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Fuel Dips</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGasPump className="text-4xl text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">Fuel Density Management</h1>
          </div>
          <p className="text-lg text-gray-600">Manage hydrometer readings and temperature for different fuels</p>
          
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

        {/* Density Management Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Density Readings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {fuelTypes.map((fuel) => (
              <div key={fuel.code} className={`rounded-xl p-6 border-2 ${fuel.color}`}>
                <div className="text-center mb-6">
                  <FaGasPump className={`text-4xl mx-auto mb-3 ${fuel.color.split(' ')[2]}`} />
                  <h3 className="text-xl font-bold">{fuel.code}</h3>
                  <p className="text-sm text-gray-600">{fuel.name}</p>
                </div>
                
                <div className="space-y-4">
                  {/* Hydrometer Reading */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FaTachometerAlt />
                      Hydrometer Reading
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={densityData[fuel.code]?.hydrometer_reading || ''}
                      onChange={(e) => handleDataChange(fuel.code, 'hydrometer_reading', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-center text-lg font-semibold"
                      placeholder="0.0000"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Specific gravity reading</p>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FaThermometerHalf />
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={densityData[fuel.code]?.temperature || ''}
                      onChange={(e) => handleDataChange(fuel.code, 'temperature', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-center text-lg font-semibold"
                      placeholder="0.0"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Temperature in Celsius</p>
                  </div>

                  {/* Current Values Display */}
                  <div className="bg-gray-50 rounded-lg p-3 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Values:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Hydrometer: {densityData[fuel.code]?.hydrometer_reading?.toFixed(4) || '0.0000'}</div>
                      <div>Temperature: {densityData[fuel.code]?.temperature?.toFixed(1) || '0.0'}°C</div>
                    </div>
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
                : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaSave />
              {saving ? "Saving..." : "Save Density Readings"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}