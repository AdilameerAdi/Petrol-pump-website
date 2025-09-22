import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

export default function Permissions() {
  const navigate = useNavigate();

  const permissionTypes = [
    {
      title: "Add Expense",
      description: "Request expense approval",
      icon: FaMoneyBillWave,
      color: "bg-red-100",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      route: "/home/expense-request"
    },
    {
      title: "Holiday",
      description: "Request holiday approval", 
      icon: FaCalendarAlt,
      color: "bg-blue-100",
      borderColor: "border-blue-500", 
      textColor: "text-blue-700",
      route: "/home/holiday-request"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Permissions</h1>
          <p className="text-lg text-gray-600">Select permission type to continue</p>
        </div>

        {/* Permission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {permissionTypes.map((permission, index) => {
            const Icon = permission.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(permission.route)}
                className={`${permission.color} rounded-2xl p-8 border-2 ${permission.borderColor} cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="text-center">
                  <Icon className={`text-6xl mb-6 mx-auto ${permission.textColor}`} />
                  <h2 className={`text-2xl font-bold mb-3 ${permission.textColor}`}>
                    {permission.title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {permission.description}
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