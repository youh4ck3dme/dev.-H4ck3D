import React, { forwardRef, useEffect, useRef, useState } from 'react';

interface XCloudSectionProps {
  id: string;
  title: string;
  gradient: string;
}

const XCloudSection = forwardRef<HTMLElement, XCloudSectionProps>(({ id, title, gradient }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  // Intersection Observer for fade-in animation and redirect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Redirect when the section becomes visible
          window.location.href = 'https://x-c-loud-mmhh0gq0n-h4ck3d.vercel.app/';
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
      className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-4 rounded-full border-t-white/80 border-white/20 animate-spin mx-auto"></div>
        <h1 className="text-2xl font-bold text-white uppercase mt-4 tracking-wider">{title}</h1>
        <p className="mt-2 text-gray-400">Redirecting you to the secure login page...</p>
      </div>
    </section>
  );
});

XCloudSection.displayName = 'XCloudSection';

export default XCloudSection;