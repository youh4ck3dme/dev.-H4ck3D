import React from 'react';

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col text-left bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
        <div className="space-y-2 flex-grow">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
        <div className="mt-4 pt-2">
          <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;