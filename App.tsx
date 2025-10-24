import React, { useState, useEffect, useRef } from 'react';
import { Project } from './types';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import PortfolioSection from './components/PortfolioSection';
import PromptsSection from './components/PromptsSection';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import XCloudPage from './pages/XCloudPage';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import ParticleBackground from './components/ParticleBackground';
import InstallPwaBanner from './components/InstallPwaBanner';

const App: React.FC = () => {
    // State Management
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [activeSection, setActiveSection] = useState('home');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Load projects from localStorage on initial render
    useEffect(() => {
        try {
            const storedProjects = localStorage.getItem('portfolio-projects');
            if (storedProjects) {
                setProjects(JSON.parse(storedProjects));
            } else {
                // Initialize with empty array if nothing is stored
                setProjects([]);
            }
        } catch (error) {
            console.error("Failed to load projects from localStorage", error);
            setProjects([]); // Fallback to empty array on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Persist projects to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('portfolio-projects', JSON.stringify(projects));
        } catch (error) {
            console.error("Failed to save projects to localStorage", error);
        }
    }, [projects]);
    
    // Simple client-side routing
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
    };

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    // Project CRUD operations
    const addProject = (projectData: Omit<Project, 'id'>) => {
        const newProject: Project = { ...projectData, id: new Date().toISOString() };
        setProjects(prev => [newProject, ...prev]);
        showToast('Project added successfully!', 'success');
    };

    const editProject = (id: string, updatedData: Omit<Project, 'id'>) => {
        setProjects(prev => prev.map(p => (p.id === id ? { ...updatedData, id } : p)));
        showToast('Project updated successfully!', 'success');
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        showToast('Project deleted successfully!', 'success');
    };

    const pinProject = (id: string) => {
        const projectToPin = projects.find(p => p.id === id);
        if (projectToPin) {
            const otherProjects = projects.filter(p => p.id !== id);
            setProjects([projectToPin, ...otherProjects]);
            showToast('Project pinned to top!', 'success');
        }
    };
    
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

    // Section definitions for header and observer
    const sections = [
        { id: 'home', title: 'Home' },
        { id: 'portfolio', title: 'Portfolio' },
        { id: 'prompts', title: 'AI Prompts' },
    ];

    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px' } // Trigger when section is in the middle of the viewport
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [isLoading]); // Rerun when content is loaded

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (currentPath === '/admin') {
        return <Admin 
                    projects={projects}
                    onAddProject={addProject}
                    onEditProject={editProject}
                    onDeleteProject={deleteProject}
                    onPinProject={pinProject}
                    showToast={showToast}
                    navigate={navigate}
                    allTags={allTags}
                />;
    }

    if (currentPath === '/xcloud') {
        return <XCloudPage navigate={navigate} />;
    }

    return (
        <div className="bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Header sections={sections} activeSection={activeSection} onNavigate={navigate} />
            <main className="relative z-10">
                <HomeSection
                    ref={(el) => (sectionRefs.current[0] = el)}
                    id="home"
                    title="H4CK3D"
                    info="A portfolio showcasing web development projects with a modern, interactive, hacker-themed UI."
                    gradient="from-gray-900 to-black"
                />
                <PortfolioSection
                    ref={(el) => (sectionRefs.current[1] = el)}
                    id="portfolio"
                    title="Portfolio"
                    info="My latest work."
                    gradient="from-black to-gray-900"
                    projects={projects}
                />
                <PromptsSection
                    ref={(el) => (sectionRefs.current[2] = el)}
                    id="prompts"
                    title="AI Prompts"
                    gradient="from-gray-900 to-black"
                    showToast={showToast}
                />
            </main>
            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <InstallPwaBanner />
        </div>
    );
};

export default App;