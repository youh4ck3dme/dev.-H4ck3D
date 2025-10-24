import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { Project } from '../types';

interface AdminProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  navigate: (path: string) => void;
}

const ADMIN_PASSWORD = "23513900";

const Admin: React.FC<AdminProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check session storage to see if user is already authenticated
    try {
      const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (sessionAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Could not access session storage. Admin features may be limited.", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
        setError('');
      } catch (e) {
        console.error("Could not write to session storage.", e);
        setError("Could not save session. Please check your browser settings.");
      }
    } else {
      setError('Incorrect password. Please try again.');
    }
    setPassword('');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated');
    } catch (e) {
      console.error("Could not remove item from session storage.", e);
    }
    setIsAuthenticated(false);
    // Redirect to home page using client-side navigation
    props.navigate('/');
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-center text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-black transition-transform duration-200 bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white active:scale-95"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard {...props} onLogout={handleLogout} />;
};

export default Admin;