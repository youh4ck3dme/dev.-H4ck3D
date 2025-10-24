
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';

// A simple throttle function to limit how often the scroll handler runs for performance.
const throttle = (func: (...args: any[]) => void, delay: number) => {
  let inProgress = false;
  return (...args: any[]) => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    setTimeout(() => {
      func(...args);
      inProgress = false;
    }, delay);
  };
};

const sections = [
  { id: 'home', title: 'HOME', info: 'Welcome section with hero content, main headline, and call-to-action buttons', gradient: 'from-gray-900 to-gray-800' },
  { id: 'about', title: 'ABOUT', info: 'Company story, mission, vision, team information, and core values', gradient: 'from-gray-800 to-gray-900' },
  { id: 'services', title: 'SERVICES', info: 'Service offerings, features, pricing plans, and detailed descriptions', gradient: 'from-gray-900 to-[#1f1f22]' },
  { id: 'portfolio', title: 'PORTFOLIO', info: 'Project showcase, case studies, client work, and achievements gallery', gradient: 'from-[#1f1f22] to-gray-800' },
  { id: 'contact', title: 'CONTACT', info: 'Contact form, office locations, phone numbers, and social media links', gradient: 'from-gray-800 to-gray-900' }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    let currentSection = '';

    sections.forEach(section => {
      const el = sectionRefs.current[section.id];
      if (el) {
        // Offset of 200px to trigger highlight before the section top hits the viewport top
        const sectionTop = el.offsetTop - 200;
        if (scrollPosition >= sectionTop) {
          currentSection = section.id;
        }
      }
    });
    
    // Only update state if the active section has changed to prevent unnecessary re-renders
    const newActiveSection = currentSection || 'home';
    setActiveSection(prev => prev !== newActiveSection ? newActiveSection : prev);
  }, []);

  useEffect(() => {
    const throttledScrollHandler = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledScrollHandler);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      <Header sections={sections} activeSection={activeSection} />
      <main>
        {sections.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            info={section.info}
            gradient={section.gradient}
            ref={(el: HTMLElement | null) => {
              if (el) {
                sectionRefs.current[section.id] = el;
              }
            }}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default App;
