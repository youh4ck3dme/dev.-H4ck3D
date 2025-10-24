import React from 'react';

const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="flex justify-center px-4 py-16 bg-transparent sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 bg-[#1a1a1a] border border-gray-700 rounded-2xl">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:text-left">
          <div className="footer-section">
            <h3 className="text-lg font-bold text-white">Navigation</h3>
            <div className="mt-4 space-y-2">
              <a href="#home" onClick={(e) => handleScrollTo(e, '#home')} className="block text-sm text-gray-300 transition hover:text-white">Home</a>
              <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="block text-sm text-gray-300 transition hover:text-white">About</a>
              <a href="#services" onClick={(e) => handleScrollTo(e, '#services')} className="block text-sm text-gray-300 transition hover:text-white">Services</a>
              <a href="#portfolio" onClick={(e) => handleScrollTo(e, '#portfolio')} className="block text-sm text-gray-300 transition hover:text-white">Portfolio</a>
              <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="block text-sm text-gray-300 transition hover:text-white">Contact</a>
            </div>
          </div>
          <div className="footer-section">
            <h3 className="text-lg font-bold text-white">Connect</h3>
            <div className="mt-4 space-y-2">
              <a href="mailto:you@h4ck3d.me" className="block text-sm text-gray-300 transition hover:text-white">you@h4ck3d.me</a>
              <a href="tel:+421000000000" className="block text-sm text-gray-300 transition hover:text-white">+421 xxx xxx xxx</a>
              <div className="flex items-center justify-center mt-4 space-x-4 md:justify-start">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 transition hover:text-white" aria-label="GitHub">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                  </a>
                  <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 transition hover:text-white" aria-label="Fiverr">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.57 2H5.43A3.43 3.43 0 0 0 2 5.43v13.14A3.43 3.43 0 0 0 5.43 22h13.14A3.43 3.43 0 0 0 22 18.57V5.43A3.43 3.43 0 0 0 18.57 2zM9.42 17.52H6.57v-7h2.85zm.25-8.31a1.67 1.67 0 1 1 1.67-1.67 1.67 1.67 0 0 1-1.67 1.67zm8.28 8.31h-2.85v-4.8c0-1.2-.42-2-1.5-2s-1.72.8-1.72 2v4.8h-2.85v-7h2.85v1.2s.85-1.5 2.75-1.5a3.22 3.22 0 0 1 3.22 3.5z" />
                      </svg>
                  </a>
              </div>
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