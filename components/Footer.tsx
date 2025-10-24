
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="flex justify-center px-4 py-16 bg-transparent sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 bg-[#1a1a1a] border border-gray-700 rounded-2xl">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-3 md:text-left">
          <div className="footer-section">
            <h3 className="text-lg font-bold text-white">Company</h3>
            <div className="mt-4 space-y-2">
              <a href="#about" className="block text-sm text-gray-300 transition hover:text-white">About Us</a>
              <a href="#services" className="block text-sm text-gray-300 transition hover:text-white">Services</a>
              <a href="#contact" className="block text-sm text-gray-300 transition hover:text-white">Contact</a>
            </div>
          </div>
          <div className="footer-section">
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <div className="mt-4 space-y-2">
              <a href="#portfolio" className="block text-sm text-gray-300 transition hover:text-white">Portfolio</a>
              <a href="#" className="block text-sm text-gray-300 transition hover:text-white">Privacy Policy</a>
              <a href="#" className="block text-sm text-gray-300 transition hover:text-white">Terms of Service</a>
            </div>
          </div>
          <div className="footer-section">
            <h3 className="text-lg font-bold text-white">Connect</h3>
            <div className="mt-4 space-y-2">
              <a href="#" className="block text-sm text-gray-300 transition hover:text-white">hello@company.com</a>
              <a href="#" className="block text-sm text-gray-300 transition hover:text-white">+1 (555) 123-4567</a>
              <a href="#" className="block text-sm text-gray-300 transition hover:text-white">Follow Us</a>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 text-sm text-center text-gray-400 border-t border-gray-700">
          <p>&copy; 2025 dev. H4CK3D. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;