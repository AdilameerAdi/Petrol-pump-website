import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./frontend/login";
import HomeLayout from "./frontend/components/HomeLayout";
import HomeContent from "./frontend/components/HomeContent";
import ManageAdmin from "./frontend/ManageAdmin";
import AddAdmin from "./frontend/AddAdmin";
import ProfileManagement from "./frontend/ProfileManagement";
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <ProtectedRoute>
                <HomeContent />
              </ProtectedRoute>
            } />
            <Route path="manage-admin" element={
              <ProtectedRoute>
                <ManageAdmin />
              </ProtectedRoute>
            } />
            <Route path="add-admin" element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            } />
            <Route path="profile-management" element={
              <ProtectedRoute>
                <ProfileManagement />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
