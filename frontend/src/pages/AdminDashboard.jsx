import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  Package,
  Map,
  Truck,
  Clock,
  IndianRupee,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { complaints, pickupRequests, zones, kpiStats, updateComplaintStatus } = useApp();

  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'pickups' | 'zones' | 'tracking'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Section 10: Pagination state
  const [complaintsPage, setComplaintsPage] = useState(1);
  const [pickupsPage, setPickupsPage] = useState(1);
  const PAGE_SIZE = 5;

  // Section 11: Button loading state for actions
  const [loadingAction, setLoadingAction] = useState(null); // { id, action }

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Filter pickups
  const filteredPickups = pickupRequests.filter((p) => {
    return (
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pickupType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.citizenName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Paginated slices
  const totalComplaintPages = Math.ceil(filteredComplaints.length / PAGE_SIZE) || 1;
  const paginatedComplaints = filteredComplaints.slice((complaintsPage - 1) * PAGE_SIZE, complaintsPage * PAGE_SIZE);

  const totalPickupPages = Math.ceil(filteredPickups.length / PAGE_SIZE) || 1;
  const paginatedPickups = filteredPickups.slice((pickupsPage - 1) * PAGE_SIZE, pickupsPage * PAGE_SIZE);

  const handleActionClick = (complaintId, newStatus, actionName) => {
    setLoadingAction({ id: complaintId, action: actionName });
    setTimeout(() => {
      updateComplaintStatus(complaintId, newStatus);
      setLoadingAction(null);
    }, 500);
  };

  return (
    <div>
      {/* Page Title & Context */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', color: 'var(--color-dark-brown)', marginBottom: '4px' }}>
          Municipal Sanitation Administration & Command Center
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-dark-brown-muted)' }}>
          Directorate of Municipal Solid Waste Management — Real-Time Fleet & Dispatch Monitoring
        </p>
      </div>

      {/* Top Row KPI Stat Cards per Section 5.7 of design.md */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* KPI 1: Total Complaints */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-dark-brown-muted)' }}>
              Total Complaints
            </span>
            <FileText size={18} color="var(--color-blue)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-dark-brown)' }}>
            {kpiStats.totalComplaints}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginTop: '4px' }}>
            Across 5 operational sectors
          </div>
        </div>

        {/* KPI 2: Pending vs Resolved */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-coral)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-dark-brown-muted)' }}>
              Pending vs Resolved
            </span>
            <Clock size={18} color="var(--color-coral)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-coral)' }}>
            {kpiStats.pendingComplaints}{' '}
            <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--color-blue)' }}>
              / {kpiStats.resolvedComplaints} resolved
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-blue)', marginTop: '4px' }}>
            70.8% resolution rate
          </div>
        </div>

        {/* KPI 3: Special Pickup Revenue */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-dark-brown-muted)' }}>
              Special Pickup Revenue
            </span>
            <IndianRupee size={18} color="var(--color-blue)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-dark-brown)' }}>
            ₹{kpiStats.specialPickupRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginTop: '4px' }}>
            Processed via Razorpay gateway
          </div>
        </div>

        {/* KPI 4: Daily Stops Completed */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-dark-brown)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-dark-brown-muted)' }}>
              Daily Route Completion
            </span>
            <Truck size={18} color="var(--color-dark-brown)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-dark-brown)' }}>
            {kpiStats.dailyRouteCompletionRate}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginTop: '4px' }}>
            {kpiStats.dailyRouteStopsCompleted} of {kpiStats.dailyRouteStopsTotal} route stops checked in
          </div>
        </div>
      </div>

      {/* Management Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '20px',
        }}
      >
        {[
          { key: 'complaints', label: `Citizen Complaints (${complaints.length})`, icon: FileText },
          { key: 'pickups', label: `Special Pickups (${pickupRequests.length})`, icon: Package },
          { key: 'zones', label: `Ward & Route Templates (${zones.length})`, icon: Map },
          { key: 'tracking', label: `Daily Fleet Tracking`, icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setSearchQuery('');
                setComplaintsPage(1);
                setPickupsPage(1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--color-coral)' : '3px solid transparent',
                backgroundColor: isActive ? 'var(--color-cream-card)' : 'transparent',
                color: isActive ? 'var(--color-coral)' : 'var(--color-dark-brown)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '-2px',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              color="var(--color-dark-brown-muted)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px' }}
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setComplaintsPage(1);
                setPickupsPage(1);
              }}
            />
          </div>
        </div>

        {activeTab === 'complaints' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)' }}>Status Filter:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setComplaintsPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in-progress">In-Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: COMPLAINTS TABLE WITH PAGINATION */}
      {activeTab === 'complaints' && (
        <div>
          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Citizen</th>
                  <th>Category</th>
                  <th>Location / Ward</th>
                  <th>Logged At</th>
                  <th>Assigned Staff</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-dark-brown-muted)' }}>
                      No complaints matching current filter.
                    </td>
                  </tr>
                ) : (
                  paginatedComplaints.map((cmp) => (
                    <tr key={cmp.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-blue)', whiteSpace: 'nowrap' }}>
                        {cmp.id}
                      </td>
                      <td>{cmp.citizenName}</td>
                      <td style={{ fontWeight: 500 }}>{cmp.category}</td>
                      <td style={{ maxWidth: '240px' }}>
                        <div>{cmp.location}</div>
                        <span style={{ fontSize: '11px', color: 'var(--color-dark-brown-muted)' }}>{cmp.zone}</span>
                      </td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{cmp.createdAt}</td>
                      <td>
                        <select
                          value={cmp.assignedStaff}
                          onChange={(e) => updateComplaintStatus(cmp.id, cmp.status, e.target.value)}
                          style={{
                            fontSize: '12px',
                            padding: '4px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-cream-light)',
                          }}
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="Ramesh Kumar (Vehicle #DL-04-E-1029)">Ramesh Kumar (DL-04)</option>
                          <option value="Sunil Verma">Sunil Verma (DL-01)</option>
                          <option value="Mohd. Aslam">Mohd. Aslam (DL-07)</option>
                        </select>
                      </td>
                      <td>
                        <StatusBadge status={cmp.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {cmp.status !== 'resolved' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                              disabled={loadingAction?.id === cmp.id && loadingAction?.action === 'resolve'}
                              onClick={() => handleActionClick(cmp.id, 'resolved', 'resolve')}
                            >
                              {loadingAction?.id === cmp.id && loadingAction?.action === 'resolve' ? (
                                <Loader2 size={12} className="spin-icon" />
                              ) : (
                                'Resolve'
                              )}
                            </button>
                          )}
                          {cmp.status === 'submitted' && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                              disabled={loadingAction?.id === cmp.id && loadingAction?.action === 'dispatch'}
                              onClick={() => handleActionClick(cmp.id, 'in-progress', 'dispatch')}
                            >
                              {loadingAction?.id === cmp.id && loadingAction?.action === 'dispatch' ? (
                                <Loader2 size={12} className="spin-icon" />
                              ) : (
                                'Dispatch'
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Section 10: Pagination Footer */}
          {filteredComplaints.length > 0 && (
            <div className="table-pagination">
              <span className="pagination-info">
                Showing {Math.min((complaintsPage - 1) * PAGE_SIZE + 1, filteredComplaints.length)}–
                {Math.min(complaintsPage * PAGE_SIZE, filteredComplaints.length)} of {filteredComplaints.length} entries
              </span>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={complaintsPage === 1}
                  onClick={() => setComplaintsPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <span className="pagination-current">
                  Page {complaintsPage} of {totalComplaintPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={complaintsPage === totalComplaintPages}
                  onClick={() => setComplaintsPage((p) => Math.min(p + 1, totalComplaintPages))}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPECIAL PICKUPS TABLE WITH PAGINATION */}
      {activeTab === 'pickups' && (
        <div>
          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Citizen</th>
                  <th>Waste Type</th>
                  <th>Scheduled Date & Slot</th>
                  <th>Pickup Location</th>
                  <th>Fee</th>
                  <th>Payment Status</th>
                  <th>Assigned Crew</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPickups.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-dark-brown-muted)' }}>
                      No special pickups matching current query.
                    </td>
                  </tr>
                ) : (
                  paginatedPickups.map((pck) => (
                    <tr key={pck.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-blue)', whiteSpace: 'nowrap' }}>
                        {pck.id}
                      </td>
                      <td>{pck.citizenName}</td>
                      <td style={{ fontWeight: 500 }}>{pck.pickupType}</td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        <div>{pck.scheduledDate}</div>
                        <span style={{ color: 'var(--color-dark-brown-muted)', fontSize: '11px' }}>{pck.timeSlot}</span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>{pck.address}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-blue)' }}>₹{pck.fee}</td>
                      <td>
                        <StatusBadge status={pck.paymentStatus} />
                      </td>
                      <td style={{ fontSize: '12px' }}>{pck.assignedStaff || 'Unassigned'}</td>
                      <td>
                        <StatusBadge status={pck.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Section 10: Pagination Footer */}
          {filteredPickups.length > 0 && (
            <div className="table-pagination">
              <span className="pagination-info">
                Showing {Math.min((pickupsPage - 1) * PAGE_SIZE + 1, filteredPickups.length)}–
                {Math.min(pickupsPage * PAGE_SIZE, filteredPickups.length)} of {filteredPickups.length} entries
              </span>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={pickupsPage === 1}
                  onClick={() => setPickupsPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <span className="pagination-current">
                  Page {pickupsPage} of {totalPickupPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={pickupsPage === totalPickupPages}
                  onClick={() => setPickupsPage((p) => Math.min(p + 1, totalPickupPages))}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ZONES & ROUTES */}
      {activeTab === 'zones' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {zones.map((zone) => (
            <div key={zone.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-blue)' }}>
                  {zone.id.toUpperCase()}
                </span>
                <span style={{ fontSize: '12px', backgroundColor: 'var(--color-blue-soft)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-blue)' }}>
                  {zone.totalStops} Stops
                </span>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{zone.name}</h3>
              <div style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Schedule: <strong>{zone.collectionDays}</strong></div>
                <div>Time Window: <strong>{zone.timeWindow}</strong></div>
                <div>Assigned Driver: <strong>{zone.assignedDriver}</strong> ({zone.truckNumber})</div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-blue)' }}>Static Template Active</span>
                <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
                  Edit Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DAILY FLEET TRACKING */}
      {activeTab === 'tracking' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Daily Driver Check-in Log (DailyRoute Model)</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '16px' }}>
            Daily operational log preserving static templates while tracking actual driver visits and skip reasons.
          </p>
          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Driver Name</th>
                  <th>Zone / Ward</th>
                  <th>Shift Status</th>
                  <th>Completed Stops</th>
                  <th>Skipped Stops</th>
                  <th>Last Check-In</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>DL-04-E-1029</td>
                  <td>Ramesh Kumar</td>
                  <td>Sector 12 (Indira Nagar)</td>
                  <td><StatusBadge status="in-progress" /></td>
                  <td>4 of 7 (57%)</td>
                  <td>1 (Access blocked)</td>
                  <td>09:00 AM</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>DL-01-A-4491</td>
                  <td>Sunil Verma</td>
                  <td>Sector 08 (Civil Lines)</td>
                  <td><StatusBadge status="completed" /></td>
                  <td>10 of 10 (100%)</td>
                  <td>0</td>
                  <td>10:45 AM</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>DL-07-K-8820</td>
                  <td>Mohd. Aslam</td>
                  <td>Sector 15 (Green Park)</td>
                  <td><StatusBadge status="in-progress" /></td>
                  <td>8 of 12 (66%)</td>
                  <td>0</td>
                  <td>09:40 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
