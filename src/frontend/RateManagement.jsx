import React, { useState, useEffect } from "react";
import { FaGasPump, FaSave } from "react-icons/fa";
import { rateService } from "../services/rateService";

export default function RateManagement() {
  const [rates, setRates] = useState({
    MS: 95.50,
    MSP: 98.20,
    HSD: 87.30,
    CNG: 65.40
  });
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const currentRates = await rateService.getRates();
      setRates(currentRates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (fuelType, value) => {
    setRates(prev => ({
      ...prev,
      [fuelType]: parseFloat(value) || 0
    }));
  };

  const handleSaveRates = async () => {
    try {
      await rateService.saveRates(rates);
      setMessage("Rates updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving rates: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const fuelTypes = [
    { key: "MS", name: "Motor Spirit (MS)", color: "bg-blue-500", icon: "⛽" },
    { key: "MSP", name: "Motor Spirit Premium (MSP)", color: "bg-green-500", icon: "🚗" },
    { key: "HSD", name: "High Speed Diesel (HSD)", color: "bg-orange-500", icon: "🚛" },
    { key: "CNG", name: "Compressed Natural Gas (CNG)", color: "bg-purple-500", icon: "🚌" }
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaGasPump className="text-4xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Rate Management</h1>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading rates...</span>
          </div>
        ) : (
          <>
        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {fuelTypes.map((fuel) => (
            <div key={fuel.key} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{fuel.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{fuel.name}</h3>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Rate per Liter (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rates[fuel.key]}
                  onChange={(e) => handleRateChange(fuel.key, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold text-center"
                />
                <div className={`w-full h-2 rounded-full ${fuel.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveRates}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto"
          >
            <FaSave />
            Save All Rates
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}