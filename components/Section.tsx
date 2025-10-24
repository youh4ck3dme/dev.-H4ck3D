import React, { forwardRef, useState, useEffect, useRef } from 'react';

interface SectionProps {
  id: string;
  title: string;
  info: string;
  gradient: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(({ id, title, info, gradient }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the component is in view, update the state to trigger the animation
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing after the animation triggers once
        }
      },
      {
        threshold: 0.1, // Trigger the animation when 10% of the section is visible
      }
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
        // This callback ref ensures that we can use a local ref for the observer
        // without breaking the forwarded ref used by the parent component.
        targetRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <h1 className="text-4xl font-black text-white uppercase opacity-90 sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter">{title}</h1>
        <p className="max-w-xl mx-auto mt-4 text-base italic text-gray-300 md:text-lg">{info}</p>
      </div>
    </section>
  );
});

Section.displayName = 'Section';

export default Section;