import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ComplaintForm } from './pages/ComplaintForm';
import { PickupRequest } from './pages/PickupRequest';
import { StaffRouteView } from './pages/StaffRouteView';
import { AdminDashboard } from './pages/AdminDashboard';

// Shell layout that wraps pages with Navbar and civic footer
const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="portal-footer">
        <div className="footer-inner">
          <div>
            <strong>Smart Garbage Management System</strong> — Civic Solid Waste Portal
            <div style={{ fontSize: '11px', marginTop: '2px' }}>
              Municipal Corporation • Swachh Bharat Urban Mission Phase II
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span>Privacy Policy</span>
            <span>Citizen Charter</span>
            <span>Terms of Service</span>
            <span>Grievance Redressal: 1800-11-2290</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login / Registration */}
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          {/* Citizen Screens */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <CitizenDashboard />
              </Layout>
            }
          />
          <Route
            path="/report"
            element={
              <Layout>
                <ComplaintForm />
              </Layout>
            }
          />
          <Route
            path="/pickup-request"
            element={
              <Layout>
                <PickupRequest />
              </Layout>
            }
          />

          {/* Staff Route Screen */}
          <Route
            path="/staff-route"
            element={
              <Layout>
                <StaffRouteView />
              </Layout>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
