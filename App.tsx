import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Admin from './pages/Admin';
import PortfolioSection from './components/PortfolioSection';
import { Project } from './types';
import Toast from './components/Toast';

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

const staticSections = [
  { id: 'home', title: 'HOME', info: 'Welcome section with hero content, main headline, and call-to-action buttons', gradient: 'from-gray-900 to-gray-800' },
  { id: 'about', title: 'ABOUT', info: 'Company story, mission, vision, team information, and core values', gradient: 'from-gray-800 to-gray-900' },
  { id: 'services', title: 'SERVICES', info: 'Service offerings, features, pricing plans, and detailed descriptions', gradient: 'from-gray-900 to-[#1f1f22]' },
  { id: 'portfolio', title: 'PORTFOLIO', info: 'Project showcase, case studies, client work, and achievements gallery', gradient: 'from-[#1f1f22] to-gray-800' },
  { id: 'contact', title: 'CONTACT', info: 'Contact form, office locations, phone numbers, and social media links', gradient: 'from-gray-800 to-gray-900' }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    // Load projects from localStorage on initial render
    try {
      const storedProjects = localStorage.getItem('portfolioProjects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error("Failed to parse projects from localStorage", error);
    }

    // Simulate initial loading to show the spinner and prevent content flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    setProjects(prevProjects => {
      const newProject = { ...project, id: Date.now().toString() };
      const updatedProjects = [...prevProjects, newProject];
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      return updatedProjects;
    });
    showToast('Project added successfully!', 'success');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.filter(p => p.id !== id);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      return updatedProjects;
    });
    showToast('Project deleted successfully!', 'success');
  };

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    let currentSection = '';

    staticSections.forEach(section => {
      const el = sectionRefs.current[section.id];
      if (el) {
        const sectionTop = el.offsetTop - 200;
        if (scrollPosition >= sectionTop) {
          currentSection = section.id;
        }
      }
    });
    
    const newActiveSection = currentSection || 'home';
    setActiveSection(prev => prev !== newActiveSection ? newActiveSection : prev);
  }, []);

  useEffect(() => {
    if (isLoading || currentPath === '/admin') return;

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScrollHandler);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [isLoading, handleScroll, currentPath]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (currentPath === '/admin') {
    return <Admin 
              projects={projects} 
              onAddProject={handleAddProject} 
              onDeleteProject={handleDeleteProject}
              showToast={showToast}
              navigate={navigate}
            />;
  }
  
  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header sections={staticSections} activeSection={activeSection} onNavigate={navigate} />
      <main>
        {staticSections.map((section) => {
          if (section.id === 'portfolio') {
            return (
              <PortfolioSection
                key={section.id}
                id={section.id}
                title={section.title}
                info={section.info}
                gradient={section.gradient}
                projects={projects}
                ref={(el: HTMLElement | null) => {
                  if (el) sectionRefs.current[section.id] = el;
                }}
              />
            );
          }
          return (
            <Section
              key={section.id}
              id={section.id}
              title={section.title}
              info={section.info}
              gradient={section.gradient}
              ref={(el: HTMLElement | null) => {
                if (el) sectionRefs.current[section.id] = el;
              }}
            />
          );
        })}
      </main>
      <Footer />
    </div>
  );
};

export default App;