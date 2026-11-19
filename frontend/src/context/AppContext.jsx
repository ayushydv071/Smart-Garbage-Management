import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_CITIZEN_USER,
  MOCK_STAFF_USER,
  MOCK_ADMIN_USER,
  MOCK_ROUTE_STOPS,
  MOCK_COMPLAINTS,
  MOCK_PICKUP_REQUESTS,
  MOCK_KPI_STATS,
  MOCK_ZONES
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current active role: 'citizen' | 'staff' | 'admin'
  const [currentRole, setCurrentRole] = useState('citizen');
  const [currentUser, setCurrentUser] = useState(MOCK_CITIZEN_USER);

  // App data state (allows in-memory interactions during Week 1 UI testing)
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [pickupRequests, setPickupRequests] = useState(MOCK_PICKUP_REQUESTS);
  const [routeStops, setRouteStops] = useState(MOCK_ROUTE_STOPS);
  const [zones] = useState(MOCK_ZONES);
  const [kpiStats, setKpiStats] = useState(MOCK_KPI_STATS);

  // Micro-Interactions Toast System per Section 11 of design.md
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  // Role Switcher helper (Used by Demo Toolbar per Section 9)
  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'citizen') {
      setCurrentUser(MOCK_CITIZEN_USER);
      showToast('Switched to Citizen persona (Ayush Yadav)', 'info');
    }
    if (role === 'staff') {
      setCurrentUser(MOCK_STAFF_USER);
      showToast('Switched to Sanitation Staff persona (Ramesh Kumar)', 'info');
    }
    if (role === 'admin') {
      setCurrentUser(MOCK_ADMIN_USER);
      showToast('Switched to Municipal Administrator persona (Dr. Sunita Sharma)', 'info');
    }
  };

  // Add new complaint
  const addComplaint = (newComplaint) => {
    const created = {
      ...newComplaint,
      id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'submitted',
      assignedStaff: 'Unassigned',
      updates: [
        { timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), note: 'Complaint lodged through Citizen Web Portal.' }
      ]
    };
    setComplaints((prev) => [created, ...prev]);
    setKpiStats((prev) => ({
      ...prev,
      totalComplaints: prev.totalComplaints + 1,
      pendingComplaints: prev.pendingComplaints + 1
    }));
    showToast(`Complaint ${created.id} submitted successfully.`, 'success');
    return created;
  };

  // Add new pickup request
  const addPickupRequest = (newRequest) => {
    const created = {
      ...newRequest,
      id: `PCK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: 'paid',
      razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 14)}`,
      status: 'confirmed',
      assignedStaff: 'Ramesh Kumar (DL-04-E-1029)',
      canCancel: true,
    };
    setPickupRequests((prev) => [created, ...prev]);
    setKpiStats((prev) => ({
      ...prev,
      specialPickupRevenue: prev.specialPickupRevenue + created.fee
    }));
    showToast(`Pickup request ${created.id} confirmed and scheduled.`, 'success');
    return created;
  };

  // Cancel pickup request (with refund simulation)
  const cancelPickupRequest = (id) => {
    setPickupRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'cancelled',
            paymentStatus: 'refunded',
            canCancel: false,
            refundNote: 'Full refund initiated to original payment source (Razorpay test account). Expected within 3-5 banking days.'
          };
        }
        return req;
      })
    );
    showToast(`Pickup request ${id} cancelled. 100% refund initiated.`, 'info');
  };

  // Update staff stop status
  const updateStopStatus = (stopId, status, skipReason = null) => {
    setRouteStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            status,
            skipReason: skipReason || null,
            completedAt: status === 'completed' ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
          };
        }
        return stop;
      })
    );
    if (status === 'completed') {
      showToast(`Stop #${stopId} marked complete and cleared.`, 'success');
    } else if (status === 'skipped') {
      showToast(`Stop #${stopId} marked skipped (${skipReason || 'Blocked'}).`, 'error');
    }
  };

  // Admin: Update complaint status & assigned staff
  const updateComplaintStatus = (complaintId, newStatus, assignedStaff = null) => {
    setComplaints((prev) =>
      prev.map((cmp) => {
        if (cmp.id === complaintId) {
          return {
            ...cmp,
            status: newStatus,
            assignedStaff: assignedStaff || cmp.assignedStaff,
            updates: [
              ...cmp.updates,
              {
                timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                note: `Status updated to ${newStatus}${assignedStaff ? ` and assigned to ${assignedStaff}` : ''}.`
              }
            ]
          };
        }
        return cmp;
      })
    );
    showToast(`Complaint ${complaintId} updated to "${newStatus}".`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        complaints,
        pickupRequests,
        routeStops,
        zones,
        kpiStats,
        addComplaint,
        addPickupRequest,
        cancelPickupRequest,
        updateStopStatus,
        updateComplaintStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
