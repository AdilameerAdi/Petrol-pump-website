import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGasPump, FaArrowLeft } from "react-icons/fa";

export default function RegularEntry() {
  const navigate = useNavigate();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const [selectedNozzles, setSelectedNozzles] = useState([]);

  const checkpoints = [
    { 
      id: "front", 
      name: "Front", 
      color: "bg-blue-100", 
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      icon: "🏪",
      nozzles: ["HSD1", "HSD2"]
    },
    { 
      id: "central", 
      name: "Central", 
      color: "bg-green-100", 
      borderColor: "border-green-500",
      textColor: "text-green-700",
      icon: "🏢",
      nozzles: ["MS", "HSD"]
    },
    { 
      id: "auto-point", 
      name: "Auto Point", 
      color: "bg-purple-100", 
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      icon: "🚗",
      nozzles: ["MS-Auto", "MSP-Auto"]
    },
    { 
      id: "cng", 
      name: "CNG", 
      color: "bg-orange-100", 
      borderColor: "border-orange-500",
      textColor: "text-orange-700",
      icon: "⛽",
      nozzles: ["Nozzle 1", "Nozzle 2", "Nozzle 3", "Nozzle 4"]
    }
  ];

  const handleCheckpointSelect = (checkpointId) => {
    if (selectedCheckpoint !== checkpointId) {
      setSelectedCheckpoint(checkpointId);
      setSelectedNozzles([]); // Only reset when actually changing checkpoint
    }
  };

  const handleNozzleToggle = (nozzle) => {
    setSelectedNozzles(prev => {
      const newState = prev.includes(nozzle) 
        ? prev.filter(n => n !== nozzle)
        : [...prev, nozzle];
      return newState;
    });
  };

  const handleContinue = () => {
    if (selectedCheckpoint && selectedNozzles.length > 0) {
      const selectedCheckpointData = checkpoints.find(c => c.id === selectedCheckpoint);
      navigate('/home/reading-entry', {
        state: {
          checkpoint: selectedCheckpointData.name,
          nozzles: selectedNozzles
        }
      });
    }
  };

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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGasPump className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Regular Entry</h1>
          </div>
          <p className="text-lg text-gray-600">Select a checkpoint to continue</p>
        </div>

        {/* Checkpoint Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Choose Checkpoint
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedCheckpoint === checkpoint.id
                    ? "ring-4 ring-blue-400 shadow-2xl"
                    : "hover:shadow-lg"
                }`}
                onClick={() => handleCheckpointSelect(checkpoint.id)}
              >
                <div className={`rounded-xl border-2 p-6 text-center transition-all duration-300 ${
                  selectedCheckpoint === checkpoint.id 
                    ? `${checkpoint.color} ${checkpoint.borderColor} border-4` 
                    : 'bg-white border-gray-200'
                }`}>
                  {/* Radio Button */}
                  <div className="flex justify-center mb-4">
                    <input
                      type="radio"
                      id={checkpoint.id}
                      name="checkpoint"
                      value={checkpoint.id}
                      checked={selectedCheckpoint === checkpoint.id}
                      onChange={() => handleCheckpointSelect(checkpoint.id)}
                      className="w-6 h-6 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4">{checkpoint.icon}</div>

                  {/* Checkpoint Name */}
                  <h3 className={`text-xl font-semibold mb-2 ${
                    selectedCheckpoint === checkpoint.id 
                      ? checkpoint.textColor 
                      : 'text-gray-800'
                  }`}>
                    {checkpoint.name}
                  </h3>

                  {/* Nozzle Selection */}
                  {selectedCheckpoint === checkpoint.id && (
                    <div className="mt-6 space-y-3">
                      <h4 className={`text-sm font-medium ${checkpoint.textColor}`}>
                        Select Nozzles:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {checkpoint.nozzles.map((nozzle) => (
                          <label
                            key={nozzle}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white bg-opacity-70 hover:bg-opacity-90 cursor-pointer transition-all"
                          >
                            <input
                              type="checkbox"
                              id={`${checkpoint.id}-${nozzle}`}
                              checked={selectedNozzles.includes(nozzle)}
                              onChange={() => handleNozzleToggle(nozzle)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {nozzle}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleContinue}
              disabled={!selectedCheckpoint || selectedNozzles.length === 0}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                selectedCheckpoint && selectedNozzles.length > 0
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue with {selectedNozzles.length} Nozzle{selectedNozzles.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}