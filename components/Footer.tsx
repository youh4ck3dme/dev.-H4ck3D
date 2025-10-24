import React, { useEffect } from 'react';

// Extracted global styles from the original file to preserve animations and theme.
const globalStyles = `
html {
    scroll-behavior: smooth;
}
*:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
  border-radius: 2px;
}
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
.animate-slideIn {
    animation: slideIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
.animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
}
.animate-scaleIn {
    animation: scaleIn 0.2s ease-out forwards;
}

/* Terminal animations */
@keyframes blink {
    50% { opacity: 0; }
}
.caret {
    animation: blink 1s step-end infinite;
}

@keyframes glitch{
  2%,64%{
    transform: translate(2px,0) skew(0deg);
  }
  4%,60%{
    transform: translate(-2px,0) skew(0deg);
  }
  62%{
    transform: translate(0,0) skew(5deg); 
  }
}

.glitch:before,
.glitch:after{
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch:before{
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch 5s infinite linear alternate-reverse;
}

.glitch:after{
  left: -2px;
  text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
  clip: rect(85px, 450px, 90px, 0);
  animation: glitch 3s infinite linear alternate-reverse;
}

.scanline-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    animation: scanline 20s linear infinite;
    z-index: 1;
}
@keyframes scanline {
    from { background-position: 0 0; }
    to { background-position: 0 100vh; }
}
@keyframes text-flicker {
    0% { opacity: 0.1; text-shadow: 0 0 2px #0f0; }
    2% { opacity: 1; text-shadow: 0 0 5px #0f0; }
    8% { opacity: 0.1; text-shadow: 0 0 2px #0f0; }
    9% { opacity: 1; text-shadow: 0 0 5px #0f0; }
    12% { opacity: 0.2; }
    20% { opacity: 1; text-shadow: 0 0 5px #0f0; }
    25% { opacity: 0.3; }
    30% { opacity: 1; text-shadow: 0 0 5px #0f0; }
    70% { opacity: 0.7; }
    72% { opacity: 0.4; }
    77% { opacity: 0.9; text-shadow: 0 0 5px #0f0; }
    100% { opacity: 0.9; }
}
.animate-flicker {
    animation: text-flicker 4s linear infinite;
}

@keyframes progress-fill {
    from { width: 0%; }
    to { width: 100%; }
}
.animate-progress-fill {
    animation: progress-fill 2s ease-out forwards;
}

@keyframes log-scroll {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
}
`;

/**
 * A helper component that injects the global CSS styles into the document head.
 * This is a workaround to preserve styles from the original malformed file.
 */
const StyleInjector: React.FC = () => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.id = 'global-app-styles';
        styleElement.innerHTML = globalStyles;
        
        // Avoid appending duplicate style tags on re-renders
        if (!document.getElementById(styleElement.id)) {
            document.head.appendChild(styleElement);
        }

        return () => {
            const existingStyleElement = document.getElementById(styleElement.id);
            if (existingStyleElement) {
                document.head.removeChild(existingStyleElement);
            }
        };
    }, []);
    return null;
};


const Footer: React.FC = () => {
  return (
    <>
      <StyleInjector />
      <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} H4CK3D. All rights reserved.</p>
          <p className="mt-2">
            A portfolio showcasing web development projects with a modern, interactive, hacker-themed UI.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
