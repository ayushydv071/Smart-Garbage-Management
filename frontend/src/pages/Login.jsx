import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, Lock, Mail, MapPin, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { switchRole } = useApp();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    zone: 'Sector 12 (Indira Nagar)',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default public signup creates citizen account per PRD / TRD
    switchRole('citizen');
    navigate('/dashboard');
  };

  const handleQuickLogin = (role) => {
    switchRole(role);
    if (role === 'citizen') navigate('/dashboard');
    if (role === 'staff') navigate('/staff-route');
    if (role === 'admin') navigate('/admin');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '30px 20px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          border: '1px solid var(--color-border)',
          padding: '32px 28px',
        }}
      >
        {/* Civic Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-blue)',
              color: 'var(--color-cream)',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Trash2 size={26} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-dark-brown)', marginBottom: '4px' }}>
            Smart Garbage Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', margin: '0 auto' }}>
            Municipal Corporation Solid Waste & Cleanliness Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                className="form-input"
                placeholder="e.g. Ayush Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Official or Resident Email Address</label>
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="e.g. citizen@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {isSignup && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="zone-input">Residential Ward / Zone</label>
                <select
                  id="zone-input"
                  className="form-select"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                >
                  <option>Sector 12 (Indira Nagar)</option>
                  <option>Sector 08 (Civil Lines)</option>
                  <option>Sector 15 (Green Park)</option>
                  <option>Sector 04 (Vasant Vihar)</option>
                  <option>Sector 21 (Dwarka)</option>
                </select>
                <span className="form-helper">Used to synchronize your daily collection schedule and route map.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address-input">Street Address / House No.</label>
                <input
                  id="address-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flat 402, Block B, Silver Oak Apartments"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {isSignup ? 'Register Citizen Account' : 'Log In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          {isSignup ? (
            <span>
              Already registered?{' '}
              <a role="button" onClick={() => setIsSignup(false)}>
                Log In
              </a>
            </span>
          ) : (
            <span>
              New resident?{' '}
              <a role="button" onClick={() => setIsSignup(true)}>
                Create an account
              </a>
            </span>
          )}
        </div>

        {/* Quick Demo Persona Switcher (Week 1 UI helper) */}
        <div
          style={{
            marginTop: '24px',
            backgroundColor: 'rgba(49, 91, 140, 0.08)',
            border: '1px dashed var(--color-blue)',
            borderRadius: '4px',
            padding: '12px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Quick Demo Login (Week 1 UI Testing)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('citizen')}
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              Citizen
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('staff')}
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              Staff Driver
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('admin')}
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
