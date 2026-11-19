import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench, ChevronUp, ChevronDown, User, Truck, Shield } from 'lucide-react';

export const DemoToolbar = () => {
  const { currentRole, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectRole = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <aside
      className="demo-toolbar"
      aria-label="Evaluator Demo Toolbar"
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="demo-toolbar-trigger"
          title="Open Evaluator Demo Toolbar to switch roles"
        >
          <span className="demo-tag">DEMO</span>
          <Wrench size={13} />
          <span>Role Switcher</span>
          <ChevronUp size={13} />
        </button>
      ) : (
        <div className="demo-toolbar-panel">
          <div className="demo-toolbar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="demo-tag">DEMO</span>
              <strong style={{ fontSize: '12px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                Evaluator Toolbar
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="demo-toolbar-close"
              aria-label="Collapse demo toolbar"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--color-dark-brown-muted)', margin: '4px 0 10px', lineHeight: 1.3 }}>
            For jury testing only: Instant role switching without logging in separately.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              className={`demo-role-btn ${currentRole === 'citizen' ? 'active' : ''}`}
              onClick={() => handleSelectRole('citizen', '/dashboard')}
            >
              <User size={14} color="var(--color-coral)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '12px' }}>Citizen View</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Ayush Yadav (Sector 12)</div>
              </div>
              {currentRole === 'citizen' && <span className="demo-active-dot" />}
            </button>

            <button
              type="button"
              className={`demo-role-btn ${currentRole === 'staff' ? 'active' : ''}`}
              onClick={() => handleSelectRole('staff', '/staff-route')}
            >
              <Truck size={14} color="var(--color-blue)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '12px' }}>Sanitation Staff / Driver</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Ramesh Kumar (DL-04 Truck)</div>
              </div>
              {currentRole === 'staff' && <span className="demo-active-dot" />}
            </button>

            <button
              type="button"
              className={`demo-role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleSelectRole('admin', '/admin')}
            >
              <Shield size={14} color="var(--color-dark-brown)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '12px' }}>Municipal Admin Center</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Dr. Sunita Sharma (Sanitation Dir.)</div>
              </div>
              {currentRole === 'admin' && <span className="demo-active-dot" />}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

