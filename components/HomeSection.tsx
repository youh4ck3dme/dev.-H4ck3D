import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SectionProps {
  id: string;
  title: string;
  info: string;
  gradient: string;
}

const HomeSection = forwardRef<HTMLElement, SectionProps>(({ id, title, info, gradient }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const [typedTitle, setTypedTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, []);
  
  // Type out title when the section becomes visible
  useEffect(() => {
    if (isVisible) {
      setTypedTitle('');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < title.length) {
          setTypedTitle(prev => prev + title.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);
      return () => clearInterval(typingInterval);
    }
  }, [isVisible, title]);


  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setAiResponse('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = `You are a helpful AI assistant in a simulated 'hacker' terminal. Respond concisely and with a slightly technical/cyberpunk flair. The user's prompt is: "${prompt}"`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      
      const text = response.text;
      
      let i = 0;
      const responseTypingInterval = setInterval(() => {
        if (i < text.length) {
          setAiResponse(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(responseTypingInterval);
          setIsLoading(false);
        }
      }, 20);
      
      return () => clearInterval(responseTypingInterval);

    } catch (err) {
      console.error(err);
      setError('// Error: Connection to AI mainframe failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section
      id={id}
      ref={(el) => {
        targetRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={`relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-out overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="scanline-overlay"></div>
      <div className="relative z-10 text-center w-full max-w-4xl font-mono">
        {/* Main Content */}
        <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="relative text-4xl font-black text-white uppercase opacity-90 sm:text-5xl md:text-7xl tracking-tighter glitch" data-text={title}>
                {typedTitle}
                <span className="text-cyan-400 caret">_</span>
            </h1>
            <p className="max-w-xl mx-auto mt-4 text-base italic text-gray-300 md:text-lg">{info}</p>
            
            <form onSubmit={handleGenerate} className="mt-12 w-full max-w-2xl mx-auto">
              <div className="relative">
                 <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="> Execute prompt..."
                  className="w-full pl-4 pr-28 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'EXECUTE'}
                </button>
              </div>
            </form>

            {(aiResponse || error) && (
              <div className="mt-8 text-left p-4 bg-black/30 backdrop-blur-sm border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                {error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  <p className="text-green-300 whitespace-pre-wrap">{aiResponse}<span className="caret">_</span></p>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
});

HomeSection.displayName = 'HomeSection';

export default HomeSection;