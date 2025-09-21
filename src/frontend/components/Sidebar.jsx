import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to login
  };

  return (
    <div className=" bg-gradient-to-b from-[#4f46e5] via-[#6366f1] to-[#818cf8] text-white p-6 flex flex-col shadow-xl min-h-screen rounded-sm">
      <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
      <ul className="space-y-2">
        <li
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
          onClick={() => navigate("/home")} // go to home content
        >
          <FaHome className="text-white group-hover:text-[#4f46e5] text-3xl" />
          Home
        </li>

        <li
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
          onClick={() => navigate("/home")} // go to home content
        >
          <FaFileInvoiceDollar className="text-white group-hover:text-[#4f46e5] text-3xl" />
          Ledger Khata
        </li>

        <li
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
          onClick={() => navigate("/home")} // replace with cashier route if needed
        >
          <FaCashRegister className="text-white group-hover:text-[#4f46e5] text-lg" />
          Cashier Management
        </li>

        {/* Rate Management */}
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
                onClick={() => navigate("/home")}
              >
                MS
              </li>
              <li
                className="p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home")}
              >
                MSP
              </li>
              <li
                className="p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home")}
              >
                HSD
              </li>
              <li
                className="p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home")}
              >
                CNG
              </li>
            </ul>
          )}
        </li>

        {/* Admin */}
        <li className="cursor-pointer">
          <div
            className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 font-medium hover:bg-white hover:text-[#4f46e5] hover:shadow-md transform hover:scale-105 group"
            onClick={() => toggleDropdown("admin")}
          >
            <div className="flex items-center gap-3">
              <FaCogs className="text-white group-hover:text-[#4f46e5] text-lg" />
              Admin
            </div>
            <FaChevronDown
              className={`transition-transform duration-300 text-white ${
                openDropdown === "admin" ? "rotate-180 group-hover:text-[#4f46e5]" : ""
              }`}
            />
          </div>
          {openDropdown === "admin" && (
            <ul className="ml-6 mt-2 space-y-1 text-white animate-slide-down">
              <li
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home/manage-admin")} // navigate to manage admin page
              >
                <FaUserCog className="text-white group-hover:text-[#4f46e5]" /> Add Admins
              </li>
              <li
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-[#4f46e5]"
                onClick={() => navigate("/home/profile-management")} // navigate to profile page if created
              >
                <FaUser className="text-white group-hover:text-[#4f46e5]" /> Profile Management
              </li>
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
