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
        // this.scrollAccumulator = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        // Constants
        this.PARTICLE_COUNT = 800;
        this.CONNECTION_DISTANCE = 120;
        this.DEPTH_RANGE = 800;
        this.SPEED_DAMPING = 0.98;
        this.SPEED_ACCELERATION = 0.15;

        // Add depth acceleration for galaxy feel
        this.depthAcceleration = 0;
        this.maxDepthSpeed = 15;
        
        this.animationFrameId = null;

        // Performance optimization
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60; // Cap at 60fps
        this.particleTree = null; // For spatial partitioning

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
                this.targetSpeed = 0;
                this.speed = 0;
            }, 150);
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.render();
        });
    }

    startTransition() {
        this.isTransitioning = true;
        this.isActive = true;
        
        // Start with a fade out effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
        
        // Start the animation loop
        this.animate();
    }

    updateParticles() {
        if (!this.isScrolling && !this.isTransitioning) return;

        this.particles.forEach(particle => {
            if (this.isTransitioning) {
                particle.update();
            }
            
            if (this.isScrolling) {
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
            }
        });
    }


    drawConnectionss() {
        const viewportWidth = this.canvas.width;
        const viewportHeight = this.canvas.height;
        const visibleMargin = 100; // pixels beyond viewport to consider
    
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            const scale1 = 400 / p1.z;
            const x1 = p1.x * scale1 + viewportWidth / 2;
            const y1 = p1.y * scale1 + viewportHeight / 2;
    
            // Skip if particle is far outside viewport
            if (x1 < -visibleMargin || x1 > viewportWidth + visibleMargin ||
                y1 < -visibleMargin || y1 > viewportHeight + visibleMargin) {
                continue;
            }
    
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const scale2 = 400 / p2.z;
                const x2 = p2.x * scale2 + viewportWidth / 2;
                const y2 = p2.y * scale2 + viewportHeight / 2;
    
                // Skip if second particle is far outside viewport
                if (x2 < -visibleMargin || x2 > viewportWidth + visibleMargin ||
                    y2 < -visibleMargin || y2 > viewportHeight + visibleMargin) {
                    continue;
                }
    
                const dx = x1 - x2;
                const dy = y1 - y2;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < this.CONNECTION_DISTANCE * 0.7 && 
                    Math.abs(p1.z - p2.z) < 200) {
                    
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

    drawConnections() {
        // Implement spatial partitioning for connection checks
        const sectors = this.createSpatialGrid();
        const drawn = new Set(); // Track already drawn connections
        
        this.particles.forEach((p1, i) => {
            const scale1 = 400 / p1.z;
            const x1 = p1.x * scale1 + this.canvas.width / 2;
            const y1 = p1.y * scale1 + this.canvas.height / 2;
            
            // Get nearby sectors only
            const nearbyParticles = this.getNearbyParticles(p1, sectors);
            
            nearbyParticles.forEach(p2 => {
                const connectionId = `${Math.min(i, p2.index)}-${Math.max(i, p2.index)}`;
                if (drawn.has(connectionId)) return;
                
                const scale2 = 400 / p2.z;
                const x2 = p2.x * scale2 + this.canvas.width / 2;
                const y2 = p2.y * scale2 + this.canvas.height / 2;
                
                const dx = x1 - x2;
                const dy = y1 - y2;
                const distance = dx * dx + dy * dy; // Skip sqrt for performance
                
                if (distance < this.CONNECTION_DISTANCE * this.CONNECTION_DISTANCE &&
                    Math.abs(p1.z - p2.z) < 200) {
                    const alpha = (1 - Math.sqrt(distance) / this.CONNECTION_DISTANCE) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                    
                    drawn.add(connectionId);
                }
            });
        });
    }

    createSpatialGrid() {
        const sectors = new Map();
        const sectorSize = this.CONNECTION_DISTANCE;
        
        this.particles.forEach((particle, index) => {
            const sectorX = Math.floor(particle.x / sectorSize);
            const sectorY = Math.floor(particle.y / sectorSize);
            const sectorZ = Math.floor(particle.z / sectorSize);
            const key = `${sectorX},${sectorY},${sectorZ}`;
            
            if (!sectors.has(key)) {
                sectors.set(key, []);
            }
            particle.index = index; // Store index for connection tracking
            sectors.get(key).push(particle);
        });
        
        return sectors;
    }

    getNearbyParticles(particle, sectors) {
        const sectorSize = this.CONNECTION_DISTANCE;
        const sectorX = Math.floor(particle.x / sectorSize);
        const sectorY = Math.floor(particle.y / sectorSize);
        const sectorZ = Math.floor(particle.z / sectorSize);
        
        const nearby = [];
        
        // Check adjacent sectors
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const key = `${sectorX + x},${sectorY + y},${sectorZ + z}`;
                    if (sectors.has(key)) {
                        nearby.push(...sectors.get(key));
                    }
                }
            }
        }
        
        return nearby;
    }

    updateParticles() {
        if (!this.isScrolling && !this.isTransitioning) return;

        // Update depth acceleration for galaxy feel
        if (this.isScrolling) {
            this.depthAcceleration += this.speed * 0.01;
            this.depthAcceleration = Math.min(this.depthAcceleration, this.maxDepthSpeed);
        } else {
            this.depthAcceleration *= 0.95;
        }

        this.particles.forEach(particle => {
            if (this.isTransitioning) {
                particle.update();
            }
            
            if (this.isScrolling) {
                // Apply depth acceleration for smoother movement
                particle.z -= this.speed + this.depthAcceleration;

                // Add slight sideways motion based on depth
                particle.x += Math.sin(particle.z * 0.01) * 0.1;
                particle.y += Math.cos(particle.z * 0.02) * 0.1;

                // Wrap particles with varied reentry
                if (particle.z <= 1) {
                    particle.reset();
                    particle.z = this.DEPTH_RANGE;
                    // Spread particles more when they reenter
                    particle.x = (Math.random() - 0.5) * window.innerWidth * 4;
                    particle.y = (Math.random() - 0.5) * window.innerHeight * 4;
                } else if (particle.z > this.DEPTH_RANGE) {
                    particle.reset();
                    particle.z = 1;
                }
            }
        });
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

    animatee = () => {
        if (!this.isActive) return;

        // Only update if scrolling or transitioning
        if (this.isScrolling || this.isTransitioning) {
            // Update speed with smooth acceleration
            this.speed += (this.targetSpeed - this.speed) * this.SPEED_ACCELERATION;
            this.targetSpeed *= this.SPEED_DAMPING;

            this.updateParticles();
            this.render();
        }

        this.animationFrameId = requestAnimationFrame(this.animate);
    }
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    animate = (currentTime) => {
        if (!this.isActive) return;

        // Implement frame timing control
        const elapsed = currentTime - this.lastFrameTime;
        
        if (elapsed > this.frameInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
            
            // Only update if scrolling or transitioning
            if (this.isScrolling || this.isTransitioning) {
                // Smooth acceleration
                this.speed += (this.targetSpeed - this.speed) * this.SPEED_ACCELERATION;
                this.targetSpeed *= this.SPEED_DAMPING;

                this.updateParticles();
                this.render();
            }
        }

        this.animationFrameId = requestAnimationFrame(this.animate);
    }
}