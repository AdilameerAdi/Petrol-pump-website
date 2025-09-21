import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./frontend/login";
import HomeLayout from "./frontend/components/HomeLayout";
import HomeContent from "./frontend/components/HomeContent"; // import it
import ManageAdmin from "./frontend/ManageAdmin";
import AddAdmin from "./frontend/AddAdmin";
import ProfileManagement from "./frontend/ProfileManagement";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* HomeLayout wraps all pages that need sidebar */}
        <Route path="/home" element={<HomeLayout />}>
          <Route index element={<HomeContent />} /> {/* <-- set HomeContent here */}
          <Route path="manage-admin" element={<ManageAdmin />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="profile-management" element={<ProfileManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
