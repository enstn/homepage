export default class Particle {
    constructor(initialPosition = null) {
        this.reset(initialPosition);
        this.transitioning = !!initialPosition;
        this.isProject = false;
        this.size = 1;

        // Add properties for better position tracking
        this.initialPosition = initialPosition;
        this.screenPosition = null;
        this.worldPosition = null;
    }
    resett(initialPosition = null) {
        if (initialPosition) {
            // Start from brain node position
            this.x = initialPosition.x * window.innerWidth / 2;
            this.y = initialPosition.y * window.innerHeight / 2;
            this.z = 1000; // Start closer to viewer
        } else {
            // Regular particle initialization
            this.x = (Math.random() - 0.5) * window.innerWidth * 3;
            this.y = (Math.random() - 0.5) * window.innerHeight * 3;
            this.z = Math.random() * 2000;
        }
        this.targetX = (Math.random() - 0.5) * window.innerWidth * 3;
        this.targetY = (Math.random() - 0.5) * window.innerHeight * 3;
        this.targetZ = Math.random() * 2000;
        
        this.radius = Math.random() * 2 + 1;
        this.brightness = 1;
        this.color 
        = `rgba(255, 255, 255, ${this.brightness})`;
    }
    // new
    reset(initialPosition = null) {
        if (initialPosition) {
            // Use direct screen coordinates for brain mesh particles
            this.x = initialPosition.x;
            this.y = initialPosition.y;
            this.z = initialPosition.z || 1000;
            
            // Store original position for reference
            this.worldPosition = {
                x: initialPosition.worldX || this.x,
                y: initialPosition.worldY || this.y,
                z: initialPosition.worldZ || this.z
            };
            
            // Calculate target position with less spread for brain particles
            const spread = 1.5; // Reduced spread factor
            this.targetX = (Math.random() - 0.5) * window.innerWidth * spread;
            this.targetY = (Math.random() - 0.5) * window.innerHeight * spread;
            this.targetZ = Math.random() * 1000 + 500; // Keep closer to camera
        } else {
            // Background particle initialization with wider spread
            const spread = 3;
            this.x = (Math.random() - 0.5) * window.innerWidth * spread;
            this.y = (Math.random() - 0.5) * window.innerHeight * spread;
            this.z = Math.random() * 2000;
            
            // Set targets for background particles
            this.targetX = (Math.random() - 0.5) * window.innerWidth * spread;
            this.targetY = (Math.random() - 0.5) * window.innerHeight * spread;
            this.targetZ = Math.random() * 2000;
        }
        
        // Enhanced particle appearance
        this.radius = initialPosition ? 
            (Math.random() * 1.5 + 2) : // Larger radius for brain particles
            (Math.random() * 1 + 1);    // Smaller for background
        
        this.brightness = initialPosition ? 1 : 0.8;
        this.color = `rgba(255, 255, 255, ${this.brightness})`;
        
        // Add velocity for more organic movement
        this.velocity = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        };
    }
    updatee() {
        if (this.transitioning) {
            // Smooth transition to target position
            this.x += (this.targetX - this.x) * 0.02;
            this.y += (this.targetY - this.y) * 0.02;
            this.z += (this.targetZ - this.z) * 0.02;
    
            // Check if transition is complete
            const dx = Math.abs(this.x - this.targetX);
            const dy = Math.abs(this.y - this.targetY);
            const dz = Math.abs(this.z - this.targetZ);
            if (dx < 1 && dy < 1 && dz < 1) {
                this.transitioning = false;
                // Set final position exactly to avoid floating point errors
                this.x = this.targetX;
                this.y = this.targetY;
                this.z = this.targetZ;
            }
        }
    }
    // new
    update() {
        if (this.transitioning) {
            // Enhanced smooth transition with acceleration
            const transitionSpeed = 0.03;
            const distanceWeight = 0.1;
            
            // Calculate distance-based transition speed
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dz = this.targetZ - this.z;
            
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const speedFactor = 1 + (distance * distanceWeight);
            
            // Apply movement with variable speed
            this.x += dx * transitionSpeed * speedFactor;
            this.y += dy * transitionSpeed * speedFactor;
            this.z += dz * transitionSpeed * speedFactor;
            
            // Check if transition is complete
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(dz) < 0.5) {
                this.transitioning = false;
                // Snap to exact position
                this.x = this.targetX;
                this.y = this.targetY;
                this.z = this.targetZ;
            }
        } else {
            // Add subtle movement for non-transitioning particles
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.z += this.velocity.z;
            
            // Boundary check and velocity adjustment
            const bounds = window.innerWidth * 1.5;
            if (Math.abs(this.x) > bounds) this.velocity.x *= -1;
            if (Math.abs(this.y) > bounds) this.velocity.y *= -1;
            if (this.z < 0 || this.z > 2000) this.velocity.z *= -1;
        }
    }
    // better brain mesh performance
    draw(ctx, x2d, y2d, scale, alpha) {
        const r = this.radius * scale;
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, r * 2);
        
        if (this.isProject) {
            gradient.addColorStop(0, `rgba(100, 200, 255, ${alpha})`);
            gradient.addColorStop(0.4, `rgba(100, 200, 255, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
        } else {
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillStyle = this.isProject ? `rgba(100, 200, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(x2d, y2d, r, 0, Math.PI * 2);
        ctx.fill();
    }
    // new
    draww(ctx, x2d, y2d, scale, alpha) {
        // Skip drawing if outside visible area with margin
        const margin = 100;
        if (x2d < -margin || x2d > window.innerWidth + margin ||
            y2d < -margin || y2d > window.innerHeight + margin) {
            return;
        }

        const r = this.radius * scale;
        
        // Enhanced gradient for better visibility
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, r * 2);
        const baseColor = this.isProject ? '100, 200, 255' : '255, 255, 255';
        const adjustedAlpha = alpha * this.brightness;
        
        gradient.addColorStop(0, `rgba(${baseColor}, ${adjustedAlpha})`);
        gradient.addColorStop(0.4, `rgba(${baseColor}, ${adjustedAlpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);
        
        // Draw particle core
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x2d, y2d, r * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner glow
        ctx.beginPath();
        ctx.fillStyle = `rgba(${baseColor}, ${adjustedAlpha * 1.2})`;
        ctx.arc(x2d, y2d, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}



