import React, { useRef, useEffect } from 'react';

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        const particleCount = 100;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            char: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.4 - 0.2; // slow horizontal drift
                this.speedY = Math.random() * 0.5 + 0.1; // slow downward movement
                this.char = Math.random() > 0.5 ? '0' : '1';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // reset particle when it goes off screen
                if (this.y > canvas.height) {
                    this.y = 0 - this.size;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x > canvas.width) {
                    this.x = 0 - this.size;
                    this.y = Math.random() * canvas.height;
                }
                 if (this.x < 0) {
                    this.x = canvas.width + this.size;
                    this.y = Math.random() * canvas.height;
                }
            }

            draw() {
                if(ctx) {
                    ctx.fillStyle = 'rgba(0, 255, 150, 0.4)'; // Hacker green with transparency
                    ctx.font = `${this.size * 10}px monospace`;
                    ctx.fillText(this.char, this.x, this.y);
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        init();

        let animationFrameId: number;
        
        const animate = () => {
            if(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            resizeCanvas();
            init(); // re-initialize particles for new screen size
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.5,
            }}
        />
    );
};

export default ParticleBackground;
