import React from 'react';

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
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="text-xl font-bold tracking-tighter text-white">
          PORTFOLIO
        </a>
        <nav className="hidden items-center space-x-1 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ease-in-out
                ${
                  activeSection === section.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              {section.title}
            </a>
          ))}
          <button
            onClick={() => onNavigate('/admin')}
            className="ml-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:bg-gray-200 active:scale-95"
          >
            Admin Panel
          </button>
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => onNavigate('/admin')}
            className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black"
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
