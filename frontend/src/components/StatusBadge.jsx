import React from 'react';
import { Check, Clock, Loader2, AlertCircle, RotateCcw, Truck } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/\s+/g, '-');

  const getLabel = (st) => {
    switch (st) {
      case 'in-progress':
        return 'In Progress';
      case 'pending_payment':
      case 'pending-payment':
        return 'Payment Pending';
      case 'refunded':
        return 'Refunded (100%)';
      case 'confirmed':
        return 'Confirmed';
      case 'submitted':
        return 'Submitted';
      case 'assigned':
        return 'Assigned';
      case 'completed':
        return 'Completed';
      case 'skipped':
        return 'Skipped';
      case 'cancelled':
        return 'Cancelled';
      case 'resolved':
        return 'Resolved';
      default:
        return st.charAt(0).toUpperCase() + st.slice(1);
    }
  };

  const getIcon = (st) => {
    switch (st) {
      case 'resolved':
      case 'completed':
      case 'paid':
      case 'confirmed':
        return <Check size={12} strokeWidth={2.5} aria-hidden="true" />;
      case 'in-progress':
        return <Loader2 size={12} strokeWidth={2.5} className="spin-icon" aria-hidden="true" />;
      case 'submitted':
      case 'pending':
      case 'pending-payment':
      case 'pending_payment':
        return <Clock size={12} strokeWidth={2.5} aria-hidden="true" />;
      case 'assigned':
        return <Truck size={12} strokeWidth={2.5} aria-hidden="true" />;
      case 'refunded':
        return <RotateCcw size={12} strokeWidth={2.5} aria-hidden="true" />;
      case 'error':
      case 'failed':
      case 'skipped':
      case 'cancelled':
      default:
        return <AlertCircle size={12} strokeWidth={2.5} aria-hidden="true" />;
    }
  };

  return (
    <span className={`status-badge ${normalized}`} title={`Status: ${getLabel(normalized)}`}>
      {getIcon(normalized)}
      <span>{getLabel(normalized)}</span>
    </span>
  );
};
