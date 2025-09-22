import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaGasPump } from "react-icons/fa";
import { readingService } from "../services/readingService";

export default function ReadingEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkpoint, nozzles } = location.state || {};
  
  const [readings, setReadings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousReadings = async () => {
      if (nozzles && nozzles.length > 0) {
        try {
          const previousReadings = await readingService.getPreviousReadings(nozzles);
          
          const initialReadings = nozzles.reduce((acc, nozzle) => ({
            ...acc,
            [nozzle]: { 
              previous: previousReadings[nozzle] || 0, 
              current: "" 
            }
          }), {});
          
          setReadings(initialReadings);
        } catch (error) {
          console.error('Error fetching previous readings:', error);
          // Fallback to default values
          const fallbackReadings = nozzles.reduce((acc, nozzle) => ({
            ...acc,
            [nozzle]: { previous: 0, current: "" }
          }), {});
          setReadings(fallbackReadings);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPreviousReadings();
  }, [nozzles]);

  const handleCurrentReadingChange = (nozzle, value) => {
    setReadings(prev => ({
      ...prev,
      [nozzle]: {
        ...prev[nozzle],
        current: value
      }
    }));
  };

  const handleSubmit = () => {
    const allFilled = nozzles.every(nozzle => readings[nozzle]?.current);
    if (allFilled) {
      navigate('/home/sales-summary', {
        state: {
          checkpoint,
          readings
        }
      });
    }
  };

  const allReadingsComplete = nozzles?.every(nozzle => readings[nozzle]?.current) || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/home/regular-entry")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Checkpoint Selection</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGasPump className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Reading Entry</h1>
          </div>
          <p className="text-lg text-gray-600">
            {checkpoint} - Enter current readings for selected nozzles
          </p>
        </div>

        {/* Reading Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading previous readings...</span>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Nozzle Readings
              </h2>

              <div className="space-y-6">
            {nozzles?.map((nozzle) => (
              <div key={nozzle} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {nozzle}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Previous Reading (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Reading
                    </label>
                    <input
                      type="number"
                      value={readings[nozzle]?.previous || 0}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-lg font-semibold"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set by admin</p>
                  </div>

                  {/* Current Reading (Editable) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Reading *
                    </label>
                    <input
                      type="number"
                      value={readings[nozzle]?.current || ""}
                      onChange={(e) => handleCurrentReadingChange(nozzle, e.target.value)}
                      placeholder="Enter current reading"
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg font-semibold"
                      min={readings[nozzle]?.previous || 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be greater than previous reading</p>
                  </div>
                </div>

                {/* Difference Display */}
                {readings[nozzle]?.current && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-center text-green-800 font-semibold">
                      Difference: {readings[nozzle].current - readings[nozzle].previous} liters
                    </p>
                  </div>
                )}
              </div>
            ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!allReadingsComplete}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                    allReadingsComplete
                      ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Readings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}