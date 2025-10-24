import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const TechIcon: React.FC<{ tag: string }> = ({ tag }) => {
  const normalizedTag = tag.toLowerCase().trim();

  // Fix: Use React.ReactElement instead of JSX.Element to resolve "Cannot find namespace 'JSX'" error.
  const iconMap: { [key: string]: React.ReactElement } = {
    react: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
      </svg>
    ),
    angular: (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 12 10-12-10-5z"></path><path d="M2 7l10 5 10-5"></path><path d="M12 22V12"></path>
      </svg>
    ),
    google: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.58L19.05,4.58C17.22,2.91 14.91,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.05 21.54,12.29C21.54,11.77 21.48,11.44 21.35,11.1Z"></path>
      </svg>
    ),
    firebase: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.33 20.31l6.53-16.14a.79.79 0 0 1 1.49 0l6.53 16.14a.8.8 0 0 1-1 1.05l-6.27-2.3-6.27 2.3a.8.8 0 0 1-1-1.05zM12 16.42l4.93 1.8-4.93-12.18-4.93 12.18 4.93-1.8z"></path>
      </svg>
    ),
    // Add more icons here
  };
  
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );

  const icon = iconMap[normalizedTag] || defaultIcon;

  return <span className="w-4 h-4 mr-1.5 inline-block align-middle">{icon}</span>;
};


const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col text-left bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/10">
      <img 
        src={project.imageUrl} 
        alt={`Screenshot of ${project.title}`} 
        className="w-full h-48 object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-2 text-gray-300 text-sm flex-grow">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.tags || []).map(tag => (
            <div key={tag} className="flex items-center text-xs text-cyan-200 bg-cyan-900/60 px-2.5 py-1 rounded-full">
              <TechIcon tag={tag} />
              <span>{tag}</span>
            </div>
          ))}
        </div>
        <a 
          href={project.projectUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-4 pt-2 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300 self-start"
        >
          View Project &rarr;
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;