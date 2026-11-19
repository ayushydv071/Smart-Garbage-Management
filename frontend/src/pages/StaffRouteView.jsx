import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Truck,
  MapPin,
  Calendar,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';

export const StaffRouteView = () => {
  const { currentUser, routeStops, updateStopStatus, pickupRequests } = useApp();

  // Modal state for skipping a stop with required reason
  const [activeSkipStop, setActiveSkipStop] = useState(null);
  const [skipReason, setSkipReason] = useState('Narrow lane blocked by construction/vehicle');

  const completedCount = routeStops.filter((s) => s.status === 'completed').length;
  const skippedCount = routeStops.filter((s) => s.status === 'skipped').length;
  const totalCount = routeStops.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Special pickups assigned to this driver
  const assignedPickups = pickupRequests.filter((p) => p.assignedStaff && p.assignedStaff.includes('Ramesh'));

  const [loadingStopId, setLoadingStopId] = useState(null);

  const handleMarkComplete = (stopId) => {
    setLoadingStopId(stopId);
    setTimeout(() => {
      updateStopStatus(stopId, 'completed');
      setLoadingStopId(null);
    }, 450);
  };

  const handleConfirmSkip = () => {
    if (activeSkipStop) {
      updateStopStatus(activeSkipStop.id, 'skipped', skipReason);
      setActiveSkipStop(null);
      setSkipReason('Narrow lane blocked by construction/vehicle');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Shift Header & Driver Context (Mobile First) */}
      <div
        className="card"
        style={{
          borderLeft: '5px solid var(--color-coral)',
          marginBottom: '16px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-dark-brown-muted)', fontWeight: 600 }}>
              Staff Duty Roster & Check-In
            </div>
            <h1 style={{ fontSize: '20px', margin: '2px 0', color: 'var(--color-dark-brown)' }}>
              Zone 12 Morning Collection Run
            </h1>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-cream-light)',
              border: '1px solid var(--color-border)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Truck #DL-04-E-1029
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '12px' }}>
          Driver: <strong>Ramesh Kumar</strong> | Shift: <strong>07:30 AM - 11:30 AM</strong>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Shift Completion</span>
            <strong>
              {completedCount} of {totalCount} stops cleared ({progressPercent}%)
            </strong>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--color-border-subtle)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--color-blue)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Route Checklist per Section 5.6 of design.md */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '17px', color: 'var(--color-dark-brown)' }}>
            Daily Route Stop Checklist
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)' }}>
            Tap action button to log check-in
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {routeStops.map((stop) => {
            const isCompleted = stop.status === 'completed';
            const isSkipped = stop.status === 'skipped';

            return (
              <div
                key={stop.id}
                style={{
                  padding: '14px',
                  borderRadius: '6px',
                  border: isCompleted
                    ? '1px solid rgba(49, 91, 140, 0.3)'
                    : isSkipped
                    ? '1px solid rgba(160, 67, 50, 0.3)'
                    : '1px solid var(--color-border)',
                  backgroundColor: isCompleted
                    ? 'rgba(49, 91, 140, 0.05)'
                    : isSkipped
                    ? '#FDF4F2'
                    : 'var(--color-cream-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Top Row: Stop number, address, status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted
                          ? 'var(--color-blue)'
                          : isSkipped
                          ? 'var(--status-error-bg)'
                          : 'var(--color-dark-brown)',
                        color: isSkipped ? 'var(--status-error-text)' : 'var(--color-cream)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? '✓' : stop.order}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-dark-brown)' }}>
                        {stop.address}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginTop: '2px' }}>
                        {isCompleted && `Completed at ${stop.completedAt}`}
                        {isSkipped && `Skipped: "${stop.skipReason}"`}
                        {!isCompleted && !isSkipped && `Scheduled Window: ${stop.expectedTime || '09:00 AM'}`}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={stop.status} />
                </div>

                {/* Bottom Row: Checklist action buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '8px',
                    marginTop: '2px',
                  }}
                >
                  {!isCompleted && !isSkipped ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={loadingStopId === stop.id}
                        onClick={() => handleMarkComplete(stop.id)}
                      >
                        {loadingStopId === stop.id ? (
                          <Loader2 size={14} className="spin-icon" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span>{loadingStopId === stop.id ? 'Clearing...' : 'Mark Complete'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveSkipStop(stop)}
                        style={{ color: '#A04332', borderColor: '#A04332' }}
                      >
                        <XCircle size={14} />
                        <span>Skip...</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => updateStopStatus(stop.id, 'pending')}
                      style={{ fontSize: '11px' }}
                    >
                      <RotateCcw size={12} />
                      <span>Reset Status</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Special Pickups Section (PRD Section 4.6) */}
      <div className="card" style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '17px', marginBottom: '8px', color: 'var(--color-dark-brown)' }}>
          Assigned Special Pickups for Today
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginBottom: '12px' }}>
          Bulk or non-routine pickups scheduled along your route.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assignedPickups.map((pck) => (
            <div
              key={pck.id}
              style={{
                padding: '12px',
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-blue)' }}>
                  {pck.id} — {pck.pickupType}
                </span>
                <StatusBadge status={pck.status} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-dark-brown)', marginBottom: '4px' }}>
                📍 {pck.address}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)' }}>
                Citizen: {pck.citizenName} | Slot: {pck.timeSlot}
              </div>
              {pck.notes && (
                <div style={{ fontSize: '12px', color: 'var(--color-dark-brown)', fontStyle: 'italic', marginTop: '4px' }}>
                  "{pck.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skip Reason Modal Dialog */}
      {activeSkipStop && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--color-cream)',
              border: '2px solid var(--color-dark-brown)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
              Skip Stop #{activeSkipStop.order}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '16px' }}>
              {activeSkipStop.address}
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="skip-reason-select">
                Required Skip Reason *
              </label>
              <select
                id="skip-reason-select"
                className="form-select"
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
              >
                <option>Narrow lane blocked by construction/vehicle</option>
                <option>Bin missing or completely inaccessible</option>
                <option>Gate locked / security barred entrance</option>
                <option>Severe waterlogging / road impassable</option>
                <option>Other operational obstruction</option>
              </select>
              <span className="form-helper">
                This reason will be recorded on the municipal audit log and displayed to affected residents.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveSkipStop(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleConfirmSkip}
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
