import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} H4CK3D. All rights reserved.</p>
        <p className="mt-2">
          A portfolio showcasing web development projects with a modern, interactive, hacker-themed UI.
        </p>
      </div>
    </footer>
  );
};

export default Footer;