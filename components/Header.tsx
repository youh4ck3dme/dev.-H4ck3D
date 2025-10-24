import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
}

interface HeaderProps {
  sections: Section[];
  activeSection: string;
  onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ sections, activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when the mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
    // If it's a section link, let the browser handle smooth scrolling
    if (path.startsWith('#')) {
        const targetElement = document.querySelector(path);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        onNavigate(path);
    }
  };


  return (
    <>
      {/* Main Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-xl font-bold tracking-tighter text-white transition-opacity hover:opacity-80">
                  H4CK3D
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden items-center space-x-1 md:flex">
                  {sections.map((section) => (
                      <a
                          key={section.id}
                          href={`#${section.id}`}
                          onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(`#${section.id}`);
                          }}
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ease-in-out ${
                              activeSection === section.id
                                  ? 'bg-white/10 text-white'
                                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                          {section.title}
                      </a>
                  ))}
                  <button
                      onClick={() => handleLinkClick('/admin')}
                      className="ml-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:bg-gray-200 active:scale-95"
                  >
                      Admin Login
                  </button>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                  <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="z-50 p-2 text-white transition-transform duration-300"
                      aria-label="Toggle menu"
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                          />
                      </svg>
                  </button>
              </div>
          </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center space-y-6 text-center">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(`#${section.id}`);
              }}
              className={`text-2xl font-semibold text-gray-300 transition-all duration-300 hover:text-white ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{ transitionDelay: `${150 + index * 50}ms` }}
            >
              {section.title}
            </a>
          ))}
           <div 
             className={`pt-6 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
             style={{ transitionDelay: `${150 + sections.length * 50}ms` }}
            >
             <button
                onClick={() => handleLinkClick('/admin')}
                className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:bg-gray-200 active:scale-95"
            >
                Admin Login
            </button>
           </div>
        </nav>
      </div>
    </>
  );
};

export default Header;