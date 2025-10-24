import React, { useState } from 'react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onDeleteProject, onLogout, showToast }) => {
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', projectUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newProject.title || !newProject.description || !newProject.imageUrl || !newProject.projectUrl) {
      showToast("Please fill in all fields.", 'error');
      return;
    }
    setIsSubmitting(true);
    onAddProject(newProject);
    setNewProject({ title: '', description: '', imageUrl: '', projectUrl: '' }); // Reset form
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-gray-400">Manage your portfolio projects here.</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-5 py-2 font-semibold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
          >
            Logout
          </button>
        </header>

        <section className="p-6 mb-8 bg-gray-800 border border-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="sr-only">Project Title</label>
              <input id="title" name="title" value={newProject.title} onChange={handleChange} placeholder="Project Title" className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="projectUrl" className="sr-only">Project URL</label>
              <input id="projectUrl" name="projectUrl" value={newProject.projectUrl} onChange={handleChange} placeholder="Project URL" className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="sr-only">Description</label>
              <textarea id="description" name="description" value={newProject.description} onChange={handleChange} placeholder="Description" className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} required ></textarea>
            </div>
            <div className="md:col-span-2">
               <label htmlFor="imageUrl" className="sr-only">Image URL</label>
              <input id="imageUrl" name="imageUrl" value={newProject.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full p-2 font-semibold text-black bg-white rounded md:col-span-2 hover:bg-gray-200 disabled:bg-gray-400 transition-colors">
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Existing Projects ({projects.length})</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? projects.map(project => (
              <div key={project.id} className="relative flex flex-col bg-gray-800 border border-gray-700 rounded-lg overflow-hidden group">
                <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 flex-grow">{project.description}</p>
                   <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-indigo-400 hover:underline">View Project</a>
                </div>
                <button onClick={() => onDeleteProject(project.id)} className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )) : <p className="text-gray-500 md:col-span-3">No projects added yet. Use the form above to add your first project.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;