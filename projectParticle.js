class ProjectParticle extends Particle {
    constructor(title, description, link, position) {
        super(position);
        this.isProject = true;
        this.title = title;
        this.description = description;
        this.link = link;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.baseRadius = 4; // Larger than regular particles
        this.radius = this.baseRadius;
        this.connections = new Set();
    }

    update(time) {
        super.update();
        // Pulsing effect
        this.pulsePhase += 0.05;
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.5;
    }

    draw(ctx, x2d, y2d, scale, alpha) {
        super.draw(ctx, x2d, y2d, scale, alpha);
        
        // Draw title when particle is close enough
        if (scale > 0.5) {
            ctx.font = '16px Arial';
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.textAlign = 'center';
            ctx.fillText(this.title, x2d, y2d - 20);
        }
    }
}
