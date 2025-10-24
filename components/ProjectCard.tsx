import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col text-left bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/10">
      <img 
        src={project.imageUrl} 
        alt={`Screenshot of ${project.title}`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-2 text-gray-300 text-sm flex-grow">{project.description}</p>
        <a 
          href={project.projectUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-4 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          View Project &rarr;
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
