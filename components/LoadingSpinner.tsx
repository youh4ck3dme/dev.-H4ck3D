import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 rounded-full border-t-white/80 border-white/20 animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
