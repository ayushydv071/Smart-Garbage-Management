import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Loader2
} from 'lucide-react';

const PICKUP_TYPES = [
  {
    id: 'bulk',
    name: 'Bulk Household Waste (Old Furniture, Mattresses)',
    fee: 350,
    description: 'Up to 3 large pieces (sofas, mattresses, wooden cupboards) or 5 mixed medium items.',
  },
  {
    id: 'construction',
    name: 'Construction & Demolition Debris',
    fee: 750,
    description: 'Up to 10 bagged gunny sacks of plaster, tiles, masonry rubble from home renovation.',
  },
  {
    id: 'ewaste',
    name: 'Electronic Waste (E-Waste)',
    fee: 250,
    description: 'TVs, computers, microwave ovens, wiring, battery components for certified safe e-recycling.',
  },
  {
    id: 'garden',
    name: 'Pruning & Green Garden Waste',
    fee: 200,
    description: 'Tree branches, hedge cuttings, and large horticultural garden trimmings.',
  },
];

export const PickupRequest = () => {
  const { currentUser, pickupRequests, addPickupRequest, cancelPickupRequest } = useApp();
  const navigate = useNavigate();

  // Wizard Steps: 1 (Type & Date) -> 2 (Review Fee & Policy) -> 3 (Payment Checkout Preview) -> 4 (Confirmed)
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'history'

  const [selectedType, setSelectedType] = useState(PICKUP_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [customAddress, setCustomAddress] = useState(currentUser.address || '');
  const [itemNotes, setItemNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleProceedToReview = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const created = addPickupRequest({
        citizenName: currentUser.name,
        pickupType: selectedType.name,
        fee: selectedType.fee,
        scheduledDate: selectedDate,
        timeSlot: timeSlot,
        address: customAddress,
        notes: itemNotes,
      });
      setIsProcessingPayment(false);
      setConfirmedBooking(created);
      setCurrentStep(4);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Tab Switcher: Book New vs My Bookings */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'book' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('book')}
        >
          Book New Special Pickup
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          My Pickup Bookings ({pickupRequests.length})
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Your Scheduled Special Pickups</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pickupRequests.map((pck) => (
              <div
                key={pck.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-dark-brown-muted)' }}>
                      Booking ID: {pck.id}
                    </span>
                    <h3 style={{ fontSize: '16px', margin: '2px 0 6px' }}>{pck.pickupType}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', margin: '0 0 6px' }}>
                      📍 {pck.address}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                      <span>Date: <strong>{pck.scheduledDate}</strong></span>
                      <span>Slot: <strong>{pck.timeSlot}</strong></span>
                      <span>Fee Paid: <strong>₹{pck.fee}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <StatusBadge status={pck.paymentStatus} />
                      <StatusBadge status={pck.status} />
                    </div>
                    {pck.canCancel && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel? Full refund will be credited per policy.')) {
                            cancelPickupRequest(pck.id);
                          }
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                {pck.refundNote && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-blue-soft)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'var(--color-blue)',
                    }}
                  >
                    ✓ {pck.refundNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Step Progress Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              backgroundColor: 'var(--color-cream-light)',
              padding: '12px 18px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
            }}
          >
            {[
              { num: 1, label: '1. Select Type & Date' },
              { num: 2, label: '2. Review Fee' },
              { num: 3, label: '3. Payment Gateway' },
              { num: 4, label: '4. Confirmation' },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: currentStep >= step.num ? 600 : 400,
                  color: currentStep === step.num ? 'var(--color-coral)' : currentStep > step.num ? 'var(--color-blue)' : 'var(--color-dark-brown-subtle)',
                }}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: currentStep === step.num ? 'var(--color-coral)' : currentStep > step.num ? 'var(--color-blue)' : 'var(--color-border)',
                    color: 'var(--color-cream)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span style={{ display: 'none', md: 'inline' }}>{step.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: Select Type & Date */}
          {currentStep === 1 && (
            <div className="card">
              <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>Step 1: Select Waste Type and Schedule Date</h1>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '20px' }}>
                Municipal on-demand bulk pickup services operate in designated morning and afternoon windows.
              </p>

              <form onSubmit={handleProceedToReview}>
                {/* Waste Category Selection Cards */}
                <div className="form-group">
                  <label className="form-label">Pickup Category *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {PICKUP_TYPES.map((type) => (
                      <div
                        key={type.id}
                        role="button"
                        onClick={() => setSelectedType(type)}
                        style={{
                          padding: '14px',
                          border: selectedType.id === type.id ? '2px solid var(--color-blue)' : '1px solid var(--color-border)',
                          backgroundColor: selectedType.id === type.id ? 'var(--color-blue-soft)' : 'var(--color-cream-light)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-dark-brown)' }}>
                            {type.name}
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--color-coral)', fontSize: '15px' }}>
                            ₹{type.fee}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', margin: 0 }}>
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pickup-date">
                      Scheduled Date *
                    </label>
                    <input
                      id="pickup-date"
                      type="date"
                      className="form-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                    <span className="form-helper">Book at least 24 hours in advance.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="time-slot">
                      Collection Time Window *
                    </label>
                    <select
                      id="time-slot"
                      className="form-select"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option>Morning (09:00 AM - 12:00 PM)</option>
                      <option>Afternoon (02:00 PM - 05:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Address Override */}
                <div className="form-group">
                  <label className="form-label" htmlFor="pickup-address">
                    Pickup Location Address *
                  </label>
                  <input
                    id="pickup-address"
                    type="text"
                    className="form-input"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    required
                  />
                  <span className="form-helper">Defaults to your registered address; edit if items are at a different gate.</span>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label" htmlFor="pickup-notes">
                    Item Description / Placement Notes
                  </label>
                  <textarea
                    id="pickup-notes"
                    className="form-textarea"
                    rows={2}
                    placeholder="e.g. 1 queen mattress and 1 wooden study table placed next to the ground floor staircase..."
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">
                    <span>Continue to Review Fee</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Review Fee & Cancellation Policy (Section 5.4 of design.md) */}
          {currentStep === 2 && (
            <div className="card">
              <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>Step 2: Review Fee and Cancellation Terms</h1>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '20px' }}>
                Please review your pickup summary and the municipal refund terms before proceeding to payment.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ color: 'var(--color-dark-brown-muted)' }}>Selected Service:</span>
                  <strong>{selectedType.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ color: 'var(--color-dark-brown-muted)' }}>Date & Slot:</span>
                  <strong>{selectedDate} ({timeSlot})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ color: 'var(--color-dark-brown-muted)' }}>Pickup Location:</span>
                  <strong style={{ maxWidth: '60%', textAlign: 'right' }}>{customAddress}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontSize: '18px' }}>
                  <span style={{ fontWeight: 600 }}>Total Service Fee:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-blue)' }}>₹{selectedType.fee}.00</span>
                </div>
              </div>

              {/* Cancellation Policy Plain Statement per Design Doc Section 5.4 */}
              <div
                style={{
                  backgroundColor: 'rgba(49, 91, 140, 0.08)',
                  borderLeft: '4px solid var(--color-blue)',
                  padding: '14px 16px',
                  borderRadius: '4px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-blue)', marginBottom: '4px' }}>
                  Plain Cancellation & Refund Policy
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-dark-brown)', margin: 0 }}>
                  <strong>Cancel more than 24 hours before your slot for a full 100% refund.</strong> Cancellations within 24 hours of the assigned dispatch window cannot be refunded as truck capacity is pre-allocated.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} />
                  <span>Modify Selection</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={handleProceedToPayment}>
                  <span>Proceed to Payment (₹{selectedType.fee})</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Razorpay Checkout Preview Embed */}
          {currentStep === 3 && (
            <div className="card">
              <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>Step 3: Secure Payment Checkout</h1>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', marginBottom: '20px' }}>
                Simulating Razorpay Test Sandbox checkout (Orders API + HMAC webhook verified in Week 3).
              </p>

              <div
                style={{
                  maxWidth: '420px',
                  margin: '0 auto 24px',
                  border: '1px solid var(--color-blue)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Razorpay Sandbox Header Mock */}
                <div style={{ backgroundColor: '#2B4162', color: '#FFFFFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>
                      Payment Gateway (Test Mode)
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>Municipal Corporation Delhi</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>₹{selectedType.fee}</div>
                </div>

                <div style={{ padding: '20px', color: 'var(--color-dark-brown)' }}>
                  <div style={{ fontSize: '13px', marginBottom: '12px', padding: '8px', backgroundColor: 'var(--color-cream-light)', borderRadius: '4px' }}>
                    Order ID: <strong>order_mcd_{Math.floor(100000 + Math.random() * 900000)}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
                    <ShieldCheck size={18} color="#315B8C" />
                    <span>256-Bit SSL Encrypted Test Sandbox</span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginBottom: '16px' }}>
                    During Week 1 UI preview, clicking below simulates instant Razorpay order authorization and webhook capture.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                    onClick={handleSimulatePaymentSuccess}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 size={16} className="spin-icon" />
                        <span>Capturing Razorpay Payment...</span>
                      </>
                    ) : (
                      <span>Simulate Pay ₹{selectedType.fee}</span>
                    )}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} />
                  <span>Back to Fee Review</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Screen with Clear Policy Statement */}
          {currentStep === 4 && confirmedBooking && (
            <div
              className="card"
              style={{
                borderLeft: '5px solid var(--color-blue)',
                padding: '32px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-resolved-bg)',
                  color: 'var(--status-resolved-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <CheckCircle size={36} />
              </div>

              <h1 style={{ fontSize: '24px', marginBottom: '6px' }}>You're Booked!</h1>
              <p style={{ fontSize: '15px', color: 'var(--color-dark-brown-muted)', margin: '0 auto 18px' }}>
                Your special waste collection slot has been confirmed and scheduled in the municipal route dispatch.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)' }}>Booking Reference</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-blue)' }}>
                  {confirmedBooking.id}
                </div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>
                  Date: <strong>{confirmedBooking.scheduledDate}</strong> ({confirmedBooking.timeSlot})
                </div>
                <div style={{ fontSize: '13px' }}>
                  Location: <strong>{confirmedBooking.address}</strong>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-blue)' }}>
                  Payment ID: <strong>{confirmedBooking.razorpayPaymentId}</strong> (Amount: ₹{confirmedBooking.fee})
                </div>
              </div>

              {/* Policy Stated Plainly per Section 5.4 */}
              <div
                style={{
                  maxWidth: '520px',
                  margin: '0 auto 24px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(49, 91, 140, 0.08)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: 'var(--color-dark-brown)',
                }}
              >
                <strong>Cancellation Reminder:</strong> You may cancel this booking more than 24 hours before your slot for a 100% full refund directly via your portal dashboard.
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Citizen Dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentStep(1);
                    setActiveTab('history');
                  }}
                >
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
