import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/\s+/g, '-');

  const getLabel = (st) => {
    switch (st) {
      case 'in-progress':
        return 'In Progress';
      case 'pending_payment':
        return 'Payment Pending';
      case 'refunded':
        return 'Refunded (100%)';
      default:
        return st.charAt(0).toUpperCase() + st.slice(1);
    }
  };

  return (
    <span className={`status-badge ${normalized}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      {getLabel(normalized)}
    </span>
  );
};
