import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface SectionProps {
  id: string;
  title: string;
  info: string;
  gradient: string;
  projects: Project[];
}

const PortfolioSection = forwardRef<HTMLElement, SectionProps>(({ id, title, info, gradient, projects }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={(el) => {
        targetRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-black text-white uppercase opacity-90 sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter">{title}</h1>
        <div className="mt-12">
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <p className="max-w-xl mx-auto mt-4 text-base italic text-gray-300 md:text-lg">My work will be displayed here. Go to the admin panel to add your first project!</p>
            )}
        </div>
      </div>
    </section>
  );
});

PortfolioSection.displayName = 'PortfolioSection';

export default PortfolioSection;