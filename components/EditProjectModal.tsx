import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import TagsInput from './TagsInput';
import { GoogleGenAI } from '@google/genai';

interface EditProjectModalProps {
  project: Project;
  onUpdate: (updatedData: Omit<Project, 'id'>) => void;
  onClose: () => void;
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

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onUpdate, onClose, showToast, allTags }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    tags: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // When the project prop changes, update the form data
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        projectUrl: project.projectUrl,
        tags: (project.tags || []).join(', '),
        category: project.category || CATEGORIES[0],
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (newValue: string) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.title || !formData.description || !formData.imageUrl || !formData.projectUrl) {
      showToast("Please fill in all fields.", 'error');
      return;
    }
    if (!isValidUrl(formData.imageUrl)) {
      showToast("Please enter a valid Image URL.", 'error');
      return;
    }
    if (!isValidUrl(formData.projectUrl)) {
      showToast("Please enter a valid Project URL.", 'error');
      return;
    }
    setIsSubmitting(true);
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onUpdate({
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        projectUrl: formData.projectUrl,
        category: formData.category,
        tags: tagsArray
    });
    // The parent component will close the modal by setting editingProject to null
    setTimeout(() => setIsSubmitting(false), 500);
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.title) {
      showToast('Please enter a project title first.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const prompt = `Generate a concise and professional project description for a web project titled "${formData.title}"${tagsArray.length > 0 ? ` that uses the following technologies: ${tagsArray.join(', ')}` : ''}. The description should be suitable for a portfolio, be around 150 characters, and have a slightly technical/cyberpunk flair.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const text = response.text;
      setFormData(prev => ({ ...prev, description: text.trim() }));
    } catch (err) {
      console.error(err);
      showToast('Failed to generate description.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-2xl p-6 m-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-title" className="sr-only">Project Title</label>
              <input id="edit-title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="edit-category" className="sr-only">Category</label>
              <select 
                  id="edit-category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="edit-projectUrl" className="sr-only">Project URL</label>
            <input id="edit-projectUrl" name="projectUrl" type="url" value={formData.projectUrl} onChange={handleChange} placeholder="Project URL" className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <TagsInput
              id="edit-tags"
              name="tags"
              value={formData.tags}
              onChange={handleTagsChange}
              allTags={allTags}
              placeholder="Tags (e.g., React, Firebase, AI)"
            />
          </div>
          <div className="relative">
            <label htmlFor="edit-description" className="sr-only">Description</label>
            <textarea id="edit-description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4} required></textarea>
            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 px-2 py-1 text-xs font-semibold text-black bg-gray-200 dark:bg-white rounded hover:bg-gray-300 dark:hover:bg-gray-200 disabled:bg-gray-400 transition-colors">
              {isGenerating ? '...' : 'Generate'}
            </button>
          </div>
          <div>
            <label htmlFor="edit-imageUrl" className="sr-only">Image URL</label>
            <input id="edit-imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-semibold text-black bg-cyan-500 rounded-md hover:bg-cyan-400 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;