import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';
        const isSuccess = toast.type === 'success' || (!isError && !isInfo);

        return (
          <div
            key={toast.id}
            className={`toast-item ${isError ? 'toast-error' : isInfo ? 'toast-info' : 'toast-success'}`}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
              {isSuccess && <CheckCircle2 size={16} color="var(--color-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />}
              {isError && <AlertCircle size={16} color="var(--color-dark-brown)" style={{ flexShrink: 0, marginTop: '2px' }} />}
              {isInfo && <Info size={16} color="var(--color-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />}
              <span style={{ fontSize: '13px', lineHeight: 1.4, fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="toast-close-btn"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

