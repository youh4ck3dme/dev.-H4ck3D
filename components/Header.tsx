
import React, { useState, memo } from 'react';

interface SectionInfo {
  id: string;
  title: string;
}

interface HeaderProps {
  sections: SectionInfo[];
  activeSection: string;
  onNavigate: (path: string) => void;
}

// Extracted and memoized for performance. Prevents re-rendering on every scroll.
const NavLinks: React.FC<{
  sections: SectionInfo[];
  activeSection: string;
  isMobile?: boolean;
  onLinkClick: () => void;
  onNavigate: (path: string) => void;
}> = memo(({ sections, activeSection, isMobile = false, onLinkClick, onNavigate }) => (
    <>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={onLinkClick}
            className={`relative text-sm font-medium transition-colors duration-300 ${activeSection === section.id ? 'text-white' : 'text-gray-200 hover:text-white'
              }`}
          >
            {section.title}
            {activeSection === section.id && (
              <span className="absolute bottom-[-5px] left-1/2 h-[2px] w-full -translate-x-1/2 bg-white rounded-full"></span>
            )}
          </a>
        </li>
      ))}
      {isMobile && (
        <li className="flex flex-col w-full gap-3 pt-4 mt-4 border-t border-gray-700">
          <button onClick={() => { onNavigate('/admin'); onLinkClick(); }} className="w-full px-5 py-2 text-sm font-medium text-center text-gray-200 transition-colors border border-gray-600 rounded-full hover:bg-gray-700">Admin Login</button>
        </li>
      )}
    </>
));

NavLinks.displayName = 'NavLinks';

const Header: React.FC<HeaderProps> = ({ sections, activeSection, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed z-50 transform -translate-x-1/2 top-5 left-1/2 w-[calc(100%-2rem)] max-w-4xl">
      <nav className="w-full px-6 py-3 mx-auto bg-black/50 backdrop-blur-lg border border-gray-700 rounded-full shadow-lg">
        <div className="flex items-center justify-between">
          <a href="#home" className="text-xl font-extrabold text-white">H4CK3D</a>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8 list-none">
              <NavLinks sections={sections} activeSection={activeSection} onLinkClick={closeMenu} onNavigate={onNavigate} />
            </ul>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
              <button onClick={() => onNavigate('/admin')} className="px-5 py-2 text-sm font-medium text-gray-200 transition-colors border border-gray-600 rounded-full whitespace-nowrap hover:bg-gray-800">Admin Login</button>
          </div>

          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-white focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with transition */}
        <div 
          id="mobile-menu"
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
          <ul className="flex flex-col items-center gap-6 py-4 list-none">
            <NavLinks sections={sections} activeSection={activeSection} onLinkClick={closeMenu} isMobile={true} onNavigate={onNavigate} />
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;