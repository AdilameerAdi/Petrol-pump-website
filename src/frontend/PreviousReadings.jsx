import React, { useState } from "react";
import { FaGasPump, FaSave, FaEdit } from "react-icons/fa";
import { readingService } from "../services/readingService";

export default function PreviousReadings() {
  const [readings, setReadings] = useState({
    // Front
    HSD1: 12345,
    HSD2: 23456,
    // Central
    MS: 34567,
    HSD: 45678,
    // Auto Point
    "MS-Auto": 56789,
    "MSP-Auto": 67890,
    // CNG
    "Nozzle 1": 78901,
    "Nozzle 2": 89012,
    "Nozzle 3": 90123,
    "Nozzle 4": 12340
  });

  const [editMode, setEditMode] = useState({});
  const [message, setMessage] = useState("");

  const checkpoints = [
    {
      name: "Front",
      nozzles: ["HSD1", "HSD2"],
      color: "bg-blue-100",
      borderColor: "border-blue-500"
    },
    {
      name: "Central", 
      nozzles: ["MS", "HSD"],
      color: "bg-green-100",
      borderColor: "border-green-500"
    },
    {
      name: "Auto Point",
      nozzles: ["MS-Auto", "MSP-Auto"],
      color: "bg-purple-100", 
      borderColor: "border-purple-500"
    },
    {
      name: "CNG",
      nozzles: ["Nozzle 1", "Nozzle 2", "Nozzle 3", "Nozzle 4"],
      color: "bg-orange-100",
      borderColor: "border-orange-500"
    }
  ];

  const handleReadingChange = (nozzle, value) => {
    setReadings(prev => ({
      ...prev,
      [nozzle]: parseInt(value) || 0
    }));
  };

  const toggleEditMode = (nozzle) => {
    setEditMode(prev => ({
      ...prev,
      [nozzle]: !prev[nozzle]
    }));
  };

  const handleSaveReadings = async () => {
    try {
      await readingService.savePreviousReadings(readings);
      setMessage("Previous readings updated successfully!");
      setEditMode({});
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving readings: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaGasPump className="text-4xl text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Previous Readings Management</h1>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {/* Checkpoint Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {checkpoints.map((checkpoint) => (
            <div key={checkpoint.name} className={`${checkpoint.color} rounded-xl p-6 border-2 ${checkpoint.borderColor}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {checkpoint.name}
              </h2>
              
              <div className="space-y-4">
                {checkpoint.nozzles.map((nozzle) => (
                  <div key={nozzle} className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{nozzle}</h3>
                      <button
                        onClick={() => toggleEditMode(nozzle)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaEdit />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 min-w-fit">
                        Previous Reading:
                      </label>
                      {editMode[nozzle] ? (
                        <input
                          type="number"
                          value={readings[nozzle]}
                          onChange={(e) => handleReadingChange(nozzle, e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg font-semibold text-gray-800">
                          {readings[nozzle].toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveReadings}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto"
          >
            <FaSave />
            Save All Previous Readings
          </button>
        </div>
      </div>
    </div>
  );
}