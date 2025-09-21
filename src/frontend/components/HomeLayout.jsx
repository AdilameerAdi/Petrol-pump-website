import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Main content: 3/4 */}
      <div className="flex-[3] bg-gray-50 ">
        <Outlet />
      </div>

      {/* Sidebar: 1/4 */}
      <div className="flex-[1] bg-gray-100 ">
        <Sidebar />
      </div>
    </div>
  );
}
