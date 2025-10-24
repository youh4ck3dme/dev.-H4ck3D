import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = 'fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white animate-slideIn';
  const typeClasses = {
    success: 'bg-green-600/90 backdrop-blur-sm',
    error: 'bg-red-600/90 backdrop-blur-sm',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
};

export default Toast;
