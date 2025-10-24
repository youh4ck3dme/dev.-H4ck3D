import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import HomeSection from './components/HomeSection';
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

const COMMON_TAGS = [
  'React', 'Angular', 'Vue', 'Svelte', 'JavaScript', 'TypeScript', 
  'Node.js', 'Python', 'Go', 'Java', 'Firebase', 'Supabase', 'MongoDB', 
  'PostgreSQL', 'GraphQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 
  'Google Cloud', 'Azure', 'Tailwind CSS', 'Next.js', 'Vite', 'Gemini API'
];

const staticSections = [
  { id: 'home', title: 'yu.h4ck3d.me', info: 'Execute a prompt. Query the AI mainframe.', gradient: 'from-gray-900 to-gray-800' },
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

  const allTags = useMemo(() => {
    const projectTags = projects.flatMap(p => p.tags);
    const combinedTags = [...COMMON_TAGS, ...projectTags];
    // Return unique tags, case-insensitively, but keep original casing of the first occurrence
    const uniqueTags = Array.from(new Map(combinedTags.map(tag => [tag.toLowerCase(), tag])).values());
    return uniqueTags.sort();
  }, [projects]);

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
      console.error("Failed to read or parse projects from localStorage", error);
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
    const newProject = { ...project, id: Date.now().toString() };
    const updatedProjects = [...projects, newProject];
    try {
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      showToast('Project added successfully!', 'success');
    } catch (error)
 {
      console.error("Failed to save projects to localStorage", error);
      showToast('Failed to save project. Your browser storage might be full or disabled.', 'error');
    }
  };
  
  const handleEditProject = (id: string, updatedData: Omit<Project, 'id'>) => {
    const updatedProjects = projects.map(p => (p.id === id ? { ...p, ...updatedData } : p));
    try {
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      showToast('Project updated successfully!', 'success');
    } catch (error) {
      console.error("Failed to update project in localStorage", error);
      showToast('Failed to update project.', 'error');
    }
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    try {
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      showToast('Project deleted successfully!', 'success');
    } catch (error) {
      console.error("Failed to update projects in localStorage", error);
      showToast('Failed to delete project. Your browser storage might be full or disabled.', 'error');
    }
  };
  
  const handlePinProject = (id: string) => {
    const projectToPin = projects.find(p => p.id === id);
    if (!projectToPin) return;

    const remainingProjects = projects.filter(p => p.id !== id);
    const updatedProjects = [projectToPin, ...remainingProjects];
    
    try {
        localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        showToast('Project pinned to top!', 'success');
    } catch (error) {
        console.error("Failed to update projects in localStorage", error);
        showToast('Failed to pin project.', 'error');
    }
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
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onPinProject={handlePinProject}
              showToast={showToast}
              navigate={navigate}
              allTags={allTags}
            />;
  }
  
  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header sections={staticSections} activeSection={activeSection} onNavigate={navigate} />
      <main>
        {staticSections.map((section) => {
          if (section.id === 'home') {
            return (
               <HomeSection
                key={section.id}
                id={section.id}
                title={section.title}
                info={section.info}
                gradient={section.gradient}
                ref={(el: HTMLElement | null) => {
                  if (el) sectionRefs.current[section.id] = el;
                }}
              />
            )
          }
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