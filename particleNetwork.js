import Particle from './particle.js';

export class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isTransitioning = false;
        this.isActive = false;
        
        // Scroll and speed related properties
        this.speed = 0;
        this.targetSpeed = 0;
        this.scrollAccumulator = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        // Constants
        this.PARTICLE_COUNT = 999;
        this.CONNECTION_DISTANCE = 150;
        this.DEPTH_RANGE = 500;
        this.SPEED_DAMPING = 0.95;
        this.SPEED_ACCELERATION = 0.1;
        
        this.setupEventListeners();
        this.initialize();
    }

    initialize() {
        // Initialize regular particles
        for (let i = 0; i < this.PARTICLE_COUNT; i++) {
            this.particles.push(new Particle());
        }
    }

    setupEventListeners() {
        // Detect scroll events and update speed
        window.addEventListener('wheel', (e) => {
            if (!this.isActive) return;
            
            this.isScrolling = true;
            this.targetSpeed += e.deltaY * 0.01;
            
            // Reset scroll timeout
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    startTransition() {
        this.isTransitioning = true;
        this.isActive = true;
        
        // Start with a fade out effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Start the animation loop
        this.animate();
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.update();
            
            // Update z-position based on speed
            particle.z -= this.speed;

            // Wrap around when particles go too far or too close
            if (particle.z <= 1) {
                particle.reset();
                particle.z = this.DEPTH_RANGE;
            } else if (particle.z > this.DEPTH_RANGE) {
                particle.reset();
                particle.z = 1;
            }
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            const scale1 = 400 / p1.z;
            const x1 = p1.x * scale1 + this.canvas.width / 2;
            const y1 = p1.y * scale1 + this.canvas.height / 2;
    
            // Only connect nearby particles with a probability
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const scale2 = 400 / p2.z;
                const x2 = p2.x * scale2 + this.canvas.width / 2;
                const y2 = p2.y * scale2 + this.canvas.height / 2;
    
                const dx = x1 - x2;
                const dy = y1 - y2;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                // Reduced connection distance and added random connection probability
                if (distance < this.CONNECTION_DISTANCE * 0.7 && 
                    Math.abs(p1.z - p2.z) < 200 && 
                    Math.random() < 0.1) {  // Only 10% chance to draw connection
                    
                    const alpha = (1 - distance / (this.CONNECTION_DISTANCE * 0.7)) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
        }
    }

    render() {
        // Clear canvas with fade effect based on scrolling
        this.ctx.fillStyle = this.isScrolling ? 
            'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Sort particles by Z for proper depth rendering
        this.particles.sort((a, b) => b.z - a.z);

        // Draw connections
        this.drawConnections();

        // Draw particles
        this.particles.forEach(particle => {
            const scale = 400 / particle.z;
            const x2d = particle.x * scale + this.canvas.width / 2;
            const y2d = particle.y * scale + this.canvas.height / 2;
            const alpha = Math.min(1, (this.DEPTH_RANGE - particle.z) / 800);
            
            particle.draw(this.ctx, x2d, y2d, scale, alpha, 'white');
        });
    }

    animate = () => {
        if (!this.isActive) return;

        // Update speed with smooth acceleration
        this.speed += (this.targetSpeed - this.speed) * this.SPEED_ACCELERATION;
        this.targetSpeed *= this.SPEED_DAMPING;

        this.updateParticles();
        this.render();

        requestAnimationFrame(this.animate);
    }
}