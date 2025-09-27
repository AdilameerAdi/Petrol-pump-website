import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTint, FaGasPump } from "react-icons/fa";

export default function FuelDips() {
  const navigate = useNavigate();

  const fuelDipOptions = [
    {
      title: "Dip",
      description: "Update fuel quantities in tanks",
      subtitle: "Manage current fuel levels",
      icon: FaTint,
      color: "bg-blue-100",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      route: "/home/fuel-dip-update"
    },
    {
      title: "Density",
      description: "Manage fuel density readings",
      subtitle: "Hydrometer Reading, Temperature",
      icon: FaGasPump,
      color: "bg-green-100",
      borderColor: "border-green-500",
      textColor: "text-green-700",
      route: "/home/fuel-density"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
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
            <FaTint className="text-4xl text-red-600" />
            <h1 className="text-4xl font-bold text-gray-800">Fuel Dips</h1>
          </div>
          <p className="text-lg text-gray-600">Manage fuel tank quantities and operations</p>
        </div>

        {/* Fuel Dip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fuelDipOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                onClick={() => option.route !== "#" && navigate(option.route)}
                className={`${option.color} rounded-2xl p-8 border-2 ${option.borderColor} ${
                  option.route !== "#" ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                } transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="text-center">
                  <Icon className={`text-6xl mb-6 mx-auto ${option.textColor}`} />
                  <h2 className={`text-2xl font-bold mb-3 ${option.textColor}`}>
                    {option.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    {option.description}
                  </p>
                  <p className={`text-sm font-medium ${option.textColor}`}>
                    {option.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}