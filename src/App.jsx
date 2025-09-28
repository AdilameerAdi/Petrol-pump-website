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
import RegularEntry from "./frontend/RegularEntry";
import ReadingEntry from "./frontend/ReadingEntry";
import RateManagement from "./frontend/RateManagement";
import PreviousReadings from "./frontend/PreviousReadings";
import SalesSummary from "./frontend/SalesSummary";
import Permissions from "./frontend/Permissions";
import ExpenseRequest from "./frontend/ExpenseRequest";
import HolidayRequest from "./frontend/HolidayRequest";
import RequestManagement from "./frontend/RequestManagement";
import Calculation from "./frontend/Calculation";
import ExpensePermissions from "./frontend/ExpensePermissions";
import HolidayPermissions from "./frontend/HolidayPermissions";
import FuelDipUpdate from "./frontend/FuelDipUpdate";
import FuelDensity from "./frontend/FuelDensity";
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
            <Route path="regular-entry" element={
              <ProtectedRoute>
                <RegularEntry />
              </ProtectedRoute>
            } />
            <Route path="reading-entry" element={
              <ProtectedRoute>
                <ReadingEntry />
              </ProtectedRoute>
            } />
            <Route path="rate-management" element={
              <ProtectedRoute>
                <RateManagement />
              </ProtectedRoute>
            } />
            <Route path="previous-readings" element={
              <ProtectedRoute>
                <PreviousReadings />
              </ProtectedRoute>
            } />
            <Route path="sales-summary" element={
              <ProtectedRoute>
                <SalesSummary />
              </ProtectedRoute>
            } />
            <Route path="permissions" element={
              <ProtectedRoute>
                <Permissions />
              </ProtectedRoute>
            } />
            <Route path="expense-request" element={
              <ProtectedRoute>
                <ExpenseRequest />
              </ProtectedRoute>
            } />
            <Route path="holiday-request" element={
              <ProtectedRoute>
                <HolidayRequest />
              </ProtectedRoute>
            } />
            <Route path="request-management" element={
              <ProtectedRoute>
                <RequestManagement />
              </ProtectedRoute>
            } />
            <Route path="calculation" element={
              <ProtectedRoute>
                <Calculation />
              </ProtectedRoute>
            } />
            <Route path="expense-permissions" element={
              <ProtectedRoute>
                <ExpensePermissions />
              </ProtectedRoute>
            } />
            <Route path="holiday-permissions" element={
              <ProtectedRoute>
                <HolidayPermissions />
              </ProtectedRoute>
            } />
            <Route path="fuel-dip-update" element={
              <ProtectedRoute>
                <FuelDipUpdate />
              </ProtectedRoute>
            } />
            <Route path="fuel-density" element={
              <ProtectedRoute>
                <FuelDensity />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
