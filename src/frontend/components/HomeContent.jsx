import React from "react";
import { FaFileAlt, FaClipboardList, FaTint, FaCalculator } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function HomeContent() {
  const { user } = useAuth();
  const isCashier = user?.role === 'cashier';

  // Cards for cashier users
  const cashierCards = [
    { icon: FaFileAlt, title: "Regular Entry", color: "text-blue-500", border: "border-blue-500", onClick: () => window.location.href = '/home/regular-entry' },
    { 
      icon: FaClipboardList, 
      title: "Permission", 
      color: "text-green-500", 
      border: "border-green-500",
      onClick: () => window.location.href = '/home/permissions'
    }
  ];

  // Cards for admin/manager users
  const adminCards = [
    { icon: FaFileAlt, title: "DSR Daily Sale Record", color: "text-blue-500", border: "border-blue-500" },
    { 
      icon: FaClipboardList, 
      title: "Permissions", 
      color: "text-green-500", 
      border: "border-green-500",
      buttons: ["Expense Permission", "Holiday Permission"] 
    },
    { icon: FaTint, title: "Fuel Dips", color: "text-red-500", border: "border-red-500" }
  ];

  const cards = isCashier ? cashierCards : adminCards;

  return (
    <div className=" mx-auto min-h-screen flex flex-col items-center bg-gray-50 p-10">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">
        Welcome to Mantri Petrol Pump
      </h1>

      {/* Main Cards */}
      <div className={`grid ${isCashier ? 'grid-cols-2' : 'grid-cols-3'} gap-8 w-full max-w-6xl`}>
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center transform transition hover:scale-105 hover:shadow-2xl border-t-4 ${card.border} ${card.onClick ? 'cursor-pointer' : ''}`}
              onClick={card.onClick}
            >
              <Icon className={`text-5xl mb-4 ${card.color}`} />
              <h2 className={`text-2xl font-semibold text-center ${card.color} mb-4`}>
                {card.title}
              </h2>

              {/* Render buttons if they exist */}
              {card.buttons && (
                <div className="flex flex-col space-y-3 w-full">
                  {card.buttons.map((btn, i) => (
                    <button
                      key={i}
                      className="w-full py-2 px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
