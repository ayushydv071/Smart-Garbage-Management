import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, User, Shield, Truck, LogOut, CheckCircle } from 'lucide-react';

export const Navbar = () => {
  const { currentRole, currentUser, switchRole } = useApp();
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    switchRole(newRole);
    if (newRole === 'citizen') navigate('/dashboard');
    if (newRole === 'staff') navigate('/staff-route');
    if (newRole === 'admin') navigate('/admin');
  };

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

          {/* Persona / Role Quick Switcher & Active User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="persona-switcher" title="Switch role for Week 1 UI testing">
              <label htmlFor="role-select" style={{ color: 'var(--color-cream)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Role:
              </label>
              <select
                id="role-select"
                value={currentRole}
                onChange={handleRoleChange}
                style={{
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-dark-brown)',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '3px 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="citizen">Citizen (Ayush)</option>
                <option value="staff">Staff/Driver (Ramesh)</option>
                <option value="admin">Admin (Dr. Sunita)</option>
              </select>
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
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(245, 235, 221, 0.3)',
              }}
              title="Go to Login / Signup"
            >
              <LogOut size={14} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
