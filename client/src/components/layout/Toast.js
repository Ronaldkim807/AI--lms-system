import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast.show) return null;

  const getToastClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-info text-white';
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div 
      className={`toast show position-fixed ${getToastClass()}`}
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px'
      }}
      role="alert"
    >
      <div className="toast-header">
        <strong className="me-auto">{getToastIcon()} Notification</strong>
        <button 
          type="button" 
          className="btn-close" 
          data-bs-dismiss="toast"
        ></button>
      </div>
      <div className="toast-body">
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;