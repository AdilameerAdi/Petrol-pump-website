import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaFileInvoiceDollar,
  FaCashRegister,
  FaGasPump,
  FaChevronDown,
  FaUserCog,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaHome
} from "react-icons/fa";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Check if user is admin or manager
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className=" bg-gradient-to-b from-[#4f46e5] via-[#6366f1] to-[#818cf8] text-white p-6 flex flex-col shadow-xl min-h-screen rounded-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Menu</h2>
        {user && (
          <p className="text-sm text-white/80 mt-1">Welcome, {user.name || user.username}</p>
        )}
      </div>
      <ul className="space-y-2">
        {/* Home - Always visible */}
        <li
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
          onClick={() => navigate("/home")}
        >
          <FaHome className="text-white group-hover:text-[#4f46e5] text-3xl" />
          Home
        </li>

        {/* Admin only sections */}
        {user?.role === 'admin' && (
          <>
            <li
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
              onClick={() => navigate("/home")}
            >
              <FaFileInvoiceDollar className="text-white group-hover:text-[#4f46e5] text-3xl" />
              Ledger Khata
            </li>

            <li
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
              onClick={() => navigate("/home")}
            >
              <FaCashRegister className="text-white group-hover:text-[#4f46e5] text-lg" />
              Cashier Management
            </li>
          </>
        )}

        {/* Rate Management - Admin only */}
        {user?.role === 'admin' && (
          <li className="cursor-pointer">
            <div
              className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
              onClick={() => toggleDropdown("rate")}
            >
              <div className="flex items-center gap-3">
                <FaGasPump className="text-white group-hover:text-[#4f46e5] text-lg" />
                Rate Management
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 text-white ${
                  openDropdown === "rate" ? "rotate-180 group-hover:text-[#4f46e5]" : ""
                }`}
              />
            </div>
            {openDropdown === "rate" && (
              <ul className="ml-6 mt-2 space-y-1 text-white animate-slide-down">
                <li
                  className="p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                  onClick={() => navigate("/home/rate-management")}
                >
                  Set Fuel Rates
                </li>
                <li
                  className="p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                  onClick={() => navigate("/home/previous-readings")}
                >
                  Previous Readings
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Profile & Admin Section */}
        <li className="cursor-pointer">
          <div
            className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
            onClick={() => toggleDropdown("profile")}
          >
            <div className="flex items-center gap-3">
              <FaCogs className="text-white group-hover:text-[#4f46e5] text-lg" />
              {user?.role === 'cashier' ? 'Profile' : user?.role === 'manager' ? 'MyProfile' : 'Admin'}
            </div>
            <FaChevronDown
              className={`transition-transform duration-300 text-white ${
                openDropdown === "profile" ? "rotate-180 group-hover:text-[#4f46e5]" : ""
              }`}
            />
          </div>
          {openDropdown === "profile" && (
            <ul className="ml-6 mt-2 space-y-1 text-white animate-slide-down">
              {/* Admin/Manager - Request Management */}
              {isAdminOrManager && (
                <li
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                  onClick={() => navigate("/home/request-management")}
                >
                  <FaUserCog className="text-white group-hover:text-[#4f46e5]" /> Request Management
                </li>
              )}
              
              {/* Admin only - Add Admins */}
              {user?.role === 'admin' && (
                <li
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                  onClick={() => navigate("/home/manage-admin")}
                >
                  <FaUserCog className="text-white group-hover:text-[#4f46e5]" /> Add Admins
                </li>
              )}
              
              {/* Profile Management - All users */}
              <li
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home/profile-management")}
              >
                <FaUser className="text-white group-hover:text-[#4f46e5]" /> Profile Management
              </li>
              
              {/* Logout - All users */}
              <li
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="text-white" /> Logout
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Tailwind animation */}
      <style jsx>{`
        .animate-slide-down {
          animation: slideDown 0.25s ease forwards;
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
