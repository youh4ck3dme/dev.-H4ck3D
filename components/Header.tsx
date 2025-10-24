import React, { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface Section {
  id: string;
  title: string;
}

interface HeaderProps {
  sections: Section[];
  activeSection: string;
  onNavigate: (path: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ sections, activeSection, onNavigate, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }} className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white transition-opacity hover:opacity-80">
                  H4CK3D
              </a>

              <nav className="hidden items-center space-x-2 md:flex">
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
                                  ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                          {section.title}
                      </a>
                  ))}
                  <a
                    href="/xcloud"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick('/xcloud');
                    }}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-150 ease-in-out hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  >
                    xCloud
                  </a>
                  <div className="ml-4 flex items-center gap-2">
                    <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
                    <button
                        onClick={() => handleLinkClick('/admin')}
                        className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:bg-cyan-400 active:scale-95"
                    >
                        Admin Login
                    </button>
                  </div>
              </nav>

              <div className="md:hidden">
                  <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="z-50 p-2 text-gray-800 dark:text-white transition-transform duration-300"
                      aria-label="Toggle menu"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                      </svg>
                  </button>
              </div>
          </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg transition-transform duration-500 ease-in-out md:hidden ${
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
              className={`text-2xl font-semibold text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{ transitionDelay: `${150 + index * 50}ms` }}
            >
              {section.title}
            </a>
          ))}
          <a
              href="/xcloud"
              onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/xcloud');
              }}
              className={`text-2xl font-semibold text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{ transitionDelay: `${150 + sections.length * 50}ms` }}
            >
              xCloud
            </a>
           <div 
             className={`pt-6 transition-all duration-300 flex items-center gap-6 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
             style={{ transitionDelay: `${150 + (sections.length + 1) * 50}ms` }}
            >
             <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
             <button
                onClick={() => handleLinkClick('/admin')}
                className="rounded-full bg-cyan-500 px-8 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:bg-cyan-400 active:scale-95"
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