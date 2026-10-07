import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/LeafletMap';
import { StatusBadge } from '../components/StatusBadge';
import {
  AlertTriangle,
  Package,
  Calendar,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { currentUser, complaints, pickupRequests, routeStops } = useApp();

  // Citizen's specific reports
  const citizenComplaints = complaints.slice(0, 3);
  const citizenPickups = pickupRequests.slice(0, 2);

  // Completed stops count
  const completedStops = routeStops.filter((s) => s.status === 'completed').length;
  const totalStops = routeStops.length;

  return (
    <div>
      {/* Civic Advisory Notice */}
      <div className="civic-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={18} color="var(--color-blue)" />
          <span>
            <strong>Official Notice:</strong> Segregate dry recyclables and organic kitchen waste into distinct green/blue bins prior to collection.
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-blue)' }}>
          Municipal Bye-Law Section 14B
        </span>
      </div>

      {/* Main Top Overview Card */}
      <div
        className="card"
        style={{
          marginBottom: '24px',
          borderLeft: '5px solid var(--color-blue)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          {/* Zone & Collection Details */}
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-dark-brown-muted)', fontWeight: 600 }}>
              Registered Ward Information
            </div>
            <h1 style={{ fontSize: '24px', margin: '4px 0 8px', color: 'var(--color-dark-brown)' }}>
              Zone: Sector 12 (Indira Nagar)
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-dark-brown-muted)', marginBottom: '12px' }}>
              📍 {currentUser.address || 'Flat 402, Block B, Silver Oak Apartments, Sector 12'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-blue)', fontWeight: 600 }}>
                <Calendar size={16} />
                <span>Next Collection: Tomorrow (Wednesday)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-dark-brown)' }}>
                <Clock size={16} />
                <span>Timing: 08:00 AM - 10:00 AM</span>
              </div>
            </div>
          </div>

          {/* Two Primary Front-and-Center Actions (Coral buttons per Design Spec) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: 'var(--color-cream-light)',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-dark-brown)' }}>
              Citizen Actions
            </div>
            <Link
              to="/report"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} />
                <span>Report an Issue (Overflow / Missed)</span>
              </div>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/pickup-request"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} />
                <span>Request Special / Bulk Pickup</span>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Map View (Section 5.5) + Route Status Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Map Section */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', color: 'var(--color-dark-brown)', marginBottom: '2px' }}>
                  Live Daily Route & Waste Stops Map
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', margin: 0 }}>
                  Assigned Driver: Ramesh Kumar (Truck #DL-04-E-1029) — Progress tracked via driver check-ins
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Truck size={15} />
                <span>Stop {completedStops} of {totalStops} completed</span>
              </div>
            </div>

            {/* Leaflet map with 400px explicit CSS height per TRD */}
            <div style={{ padding: '16px' }}>
              <LeafletMap stops={routeStops} citizenCoordinates={currentUser.coordinates} zoneName={currentUser.zoneName} />
            </div>
          </div>
        </div>

        {/* Route Stops Sequence Sidebar */}
        <div>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Sector 12 Route Sequence</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginBottom: '14px' }}>
              Sequential collection stops for today's run.
            </p>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {routeStops.map((stop) => (
                <div
                  key={stop.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: stop.isCitizenStop ? 'rgba(242, 118, 94, 0.08)' : 'var(--color-cream-light)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: stop.status === 'completed' ? 'var(--color-blue)' : stop.status === 'skipped' ? 'var(--status-error-bg)' : 'var(--color-dark-brown)',
                      color: stop.status === 'skipped' ? 'var(--status-error-text)' : 'var(--color-cream)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {stop.status === 'completed' ? '✓' : stop.order}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-dark-brown)' }}>
                      {stop.address}
                    </div>
                    {stop.isCitizenStop && (
                      <span style={{ fontSize: '11px', color: 'var(--color-coral)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                        ★ Your Registered Stop
                      </span>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--color-dark-brown-muted)', marginTop: '4px' }}>
                      {stop.status === 'completed' && `Cleared at ${stop.completedAt}`}
                      {stop.status === 'pending' && `Estimated: ${stop.expectedTime}`}
                      {stop.status === 'skipped' && `Skipped: ${stop.skipReason}`}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={stop.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Reports & Special Pickup Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Reports per Section 5.2 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', color: 'var(--color-dark-brown)' }}>Your Recent Reports</h2>
            <Link to="/report" style={{ fontSize: '13px', fontWeight: 500 }}>
              + New Report
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {citizenComplaints.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-dark-brown-muted)' }}>
                      {item.id}
                    </span>
                    <h3 style={{ fontSize: '15px', color: 'var(--color-dark-brown)', margin: '2px 0' }}>
                      {item.category}
                    </h3>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '8px' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-dark-brown-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '6px' }}>
                  <span>Logged: {item.createdAt}</span>
                  <span>Driver: {item.assignedStaff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Pickup Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', color: 'var(--color-dark-brown)' }}>Special Pickup Requests</h2>
            <Link to="/pickup-request" style={{ fontSize: '13px', fontWeight: 500 }}>
              + Book Pickup
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {citizenPickups.map((pck) => (
              <div
                key={pck.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-dark-brown-muted)' }}>
                      {pck.id}
                    </span>
                    <h3 style={{ fontSize: '15px', color: 'var(--color-dark-brown)', margin: '2px 0' }}>
                      {pck.pickupType}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <StatusBadge status={pck.paymentStatus === 'paid' ? 'paid' : pck.paymentStatus} />
                    <StatusBadge status={pck.status} />
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '6px' }}>
                  Slot: <strong>{pck.scheduledDate}</strong> ({pck.timeSlot})
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-blue)' }}>Fee: ₹{pck.fee}</span>
                  {pck.canCancel && (
                    <span style={{ fontSize: '11px', color: 'var(--color-dark-brown-muted)' }}>
                      Eligible for 100% refund (&gt;24h)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
