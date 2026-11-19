import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, User, Shield, Truck, LogOut, CheckCircle } from 'lucide-react';

export const Navbar = () => {
  const { currentRole, currentUser } = useApp();
  const navigate = useNavigate();

  return (
    <header>
      {/* Official Government Top Ribbon */}
      <div className="top-civic-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏛️ Government of NCT Delhi | Municipal Solid Waste Department</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>Helpline: 1800-11-2290 (Toll Free)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', opacity: 0.85 }}>ISO 14001:2015 Certified Portal</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <div
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-blue)',
                padding: '6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trash2 size={20} color="var(--color-blue)" />
            </div>
            <div>
              <span>Smart Garbage Management</span>
              <span className="navbar-brand-sub">Swachh Civic Waste Monitoring System</span>
            </div>
          </Link>

          {/* Navigation Links based on Current Role */}
          <ul className="nav-links">
            {currentRole === 'citizen' && (
              <>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Citizen Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Report an Issue
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pickup-request" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Request Pickup
                  </NavLink>
                </li>
              </>
            )}

            {currentRole === 'staff' && (
              <>
                <li>
                  <NavLink to="/staff-route" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Daily Route Checklist
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Public Map View
                  </NavLink>
                </li>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <li>
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Admin Control Center
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Citizen View
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/staff-route" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Driver View
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Production User Profile & Logout per Section 9 of design.md */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="user-profile-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0, 0, 0, 0.18)',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-blue)',
                  fontWeight: 700,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ color: 'var(--color-cream)', fontSize: '13px', fontWeight: 600 }}>
                  {currentUser?.name || 'User'}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'rgba(245, 235, 221, 0.85)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  {currentRole === 'citizen' ? 'Citizen' : currentRole === 'staff' ? 'Staff / Driver' : 'Administrator'}
                </div>
              </div>
            </div>

            <Link
              to="/login"
              style={{
                color: 'var(--color-cream)',
                textDecoration: 'none',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(245, 235, 221, 0.3)',
              }}
              title="Sign Out / Change Account"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
