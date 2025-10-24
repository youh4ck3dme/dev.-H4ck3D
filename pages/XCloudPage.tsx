import React from 'react';
import ParticleBackground from '../components/ParticleBackground';

interface XCloudPageProps {
  navigate: (path: string) => void;
}

const XCloudPage: React.FC<XCloudPageProps> = ({ navigate }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="dark:hidden">
         <ParticleBackground />
      </div>
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase opacity-90 sm:text-5xl md:text-7xl tracking-tighter glitch" data-text="xCloud">
          xCloud
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-base italic text-gray-600 dark:text-gray-300 md:text-lg">
          You are about to be redirected to the secure xCloud portal.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://x-c-loud-mmhh0gq0n-h4ck3d.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
          >
            Proceed to Secure Login
          </a>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default XCloudPage;