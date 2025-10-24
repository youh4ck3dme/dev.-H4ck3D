import React, { useState } from 'react';
import { Project } from '../types';
import ConfirmationModal from './ConfirmationModal';
import EditProjectModal from './EditProjectModal';
import TagsInput from './TagsInput';
import { GoogleGenAI } from '@google/genai';

interface DashboardProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onEditProject: (id: string, updatedData: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  onPinProject: (id: string) => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  allTags: string[];
}

const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

const CATEGORIES = ['Web App', 'API', 'Mobile', 'Desktop', 'PWA'];

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onEditProject, onDeleteProject, onPinProject, onLogout, showToast, allTags }) => {
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', projectUrl: '', tags: '', category: CATEGORIES[0] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; projectToDelete: Project | null }>({ isOpen: false, projectToDelete: null });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (newValue: string) => {
    setNewProject(prev => ({ ...prev, tags: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newProject.title || !newProject.description || !newProject.imageUrl || !newProject.projectUrl) {
      showToast("Please fill in all fields.", 'error');
      return;
    }
    if (!isValidUrl(newProject.imageUrl)) {
      showToast("Please enter a valid Image URL.", 'error');
      return;
    }
    if (!isValidUrl(newProject.projectUrl)) {
      showToast("Please enter a valid Project URL.", 'error');
      return;
    }
    setIsSubmitting(true);
    const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onAddProject({ ...newProject, tags: tagsArray });
    setNewProject({ title: '', description: '', imageUrl: '', projectUrl: '', tags: '', category: CATEGORIES[0] }); // Reset form
    setTimeout(() => setIsSubmitting(false), 500);
  };
  
  const handleGenerateDescription = async () => {
    if (!newProject.title) {
      showToast('Please enter a project title first.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const prompt = `Generate a concise and professional project description for a web project titled "${newProject.title}"${tagsArray.length > 0 ? ` that uses the following technologies: ${tagsArray.join(', ')}` : ''}. The description should be suitable for a portfolio, be around 150 characters, and have a slightly technical/cyberpunk flair.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const text = response.text;
      setNewProject(prev => ({ ...prev, description: text.trim() }));
    } catch (err) {
      console.error(err);
      showToast('Failed to generate description.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteModalState({ isOpen: true, projectToDelete: project });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.projectToDelete) {
      onDeleteProject(deleteModalState.projectToDelete.id);
      setDeleteModalState({ isOpen: false, projectToDelete: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalState({ isOpen: false, projectToDelete: null });
  };
  
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
  };
  
  const handleUpdateProject = (updatedData: Omit<Project, 'id'>) => {
    if (editingProject) {
        onEditProject(editingProject.id, updatedData);
        setEditingProject(null); // Close modal on successful update
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your portfolio projects here.</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-5 py-2 font-semibold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
          >
            Logout
          </button>
        </header>

        <section className="p-6 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="sr-only">Project Title</label>
              <input id="title" name="title" type="text" value={newProject.title} onChange={handleChange} placeholder="Project Title" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
             <div>
                <label htmlFor="category" className="sr-only">Category</label>
                <select 
                    id="category" 
                    name="category" 
                    value={newProject.category} 
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="projectUrl" className="sr-only">Project URL</label>
              <input id="projectUrl" name="projectUrl" type="url" value={newProject.projectUrl} onChange={handleChange} placeholder="Project URL" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
               <label htmlFor="imageUrl" className="sr-only">Image URL</label>
              <input id="imageUrl" name="imageUrl" type="url" value={newProject.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
             <div className="md:col-span-2">
               <TagsInput
                 id="tags"
                 name="tags"
                 value={newProject.tags}
                 onChange={handleTagsChange}
                 allTags={allTags}
               />
            </div>
            <div className="md:col-span-2 relative">
              <label htmlFor="description" className="sr-only">Description</label>
              <textarea id="description" name="description" value={newProject.description} onChange={handleChange} placeholder="Description" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} required ></textarea>
              <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 px-2 py-1 text-xs font-semibold text-black bg-gray-200 dark:bg-white rounded hover:bg-gray-300 dark:hover:bg-gray-200 disabled:bg-gray-400 transition-colors">
                {isGenerating ? '...' : 'Generate'}
              </button>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full p-2 font-semibold text-black bg-cyan-500 rounded md:col-span-2 hover:bg-cyan-400 disabled:bg-gray-400 transition-colors">
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Existing Projects ({projects.length})</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div key={project.id} className="relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group">
                  <img src={project.imageUrl} alt={`Screenshot of ${project.title}`} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">{project.description}</p>
                     <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">View Project</a>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button onClick={() => onPinProject(project.id)} className="p-1.5 bg-blue-600/80 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label={`Pin ${project.title} to top`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 9.586V4a1 1 0 011-1zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                      )}
                       <button onClick={() => handleEditClick(project)} className="p-1.5 bg-yellow-500/80 text-white rounded-full hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300" aria-label={`Edit ${project.title}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                       </button>
                      <button onClick={() => handleDeleteClick(project)} className="p-1.5 bg-red-600/80 text-white rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400" aria-label={`Delete ${project.title}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                </div>
              ))}
            </div>
            ) : (
            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg md:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the form above to add your first project to the portfolio.</p>
            </div>
          )}
        </section>
      </div>
      <ConfirmationModal 
        isOpen={deleteModalState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the project "${deleteModalState.projectToDelete?.title}"? This action cannot be undone.`}
      />
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onUpdate={handleUpdateProject}
          onClose={() => setEditingProject(null)}
          showToast={showToast}
          allTags={allTags}
        />
      )}
    </div>
  );
};

export default Dashboard;