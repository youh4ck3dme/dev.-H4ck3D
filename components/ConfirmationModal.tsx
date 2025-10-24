import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-md p-6 m-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-scaleIn"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside it
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end mt-6 space-x-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-semibold text-gray-800 dark:text-white transition-colors bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 font-semibold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-red-500"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;