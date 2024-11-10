export default class Particle {
    constructor(initialPosition = null) {
        this.reset(initialPosition);
        this.transitioning = !!initialPosition;
        this.isProject = false;

        // wireframe from old old version for cool explosion & structure
        this.wireframe = false;
        this.rotation = {
          x: 0,
          y: 0,
          z: 0
        };
        this.rotationSpeed = {
          x: 0,
          y: 0,
          z: 0
        };
        this.size = 1;
    }
    reset(initialPosition = null) {
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
    update() {
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
            }

            // Update rotation if particle is in wireframe mode
            if (this.wireframe) {
              this.rotation.x += this.rotationSpeed.x;
              this.rotation.y += this.rotationSpeed.y;
              this.rotation.z += this.rotationSpeed.z;
            }
        }
    }
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

        // Draw wireframe cube if particle is in wireframe mode
        if (this.wireframe) {
          this.drawWireframeCube(ctx, x2d, y2d, this.size * scale, this.rotation, alpha);
        } else {
          // Draw regular particle
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.fillStyle = this.isProject ? `rgba(100, 200, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          ctx.arc(x2d, y2d, 3 * scale, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        ctx.beginPath();
        ctx.fillStyle = this.isProject ? `rgba(100, 200, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(x2d, y2d, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawWireframeCube (ctx, x, y, size, rotation, alpha) {
        // Cube vertices (centered at origin)
        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ].map(v => [v[0] * size/2, v[1] * size/2, v[2] * size/2]);

        // Rotation matrices
        const rotateX = (point) => {
            const [x, y, z] = point;
            const cos = Math.cos(rotation.x), sin = Math.sin(rotation.x);
            return [x, y * cos - z * sin, y * sin + z * cos];
        };
        
        const rotateY = (point) => {
            const [x, y, z] = point;
            const cos = Math.cos(rotation.y), sin = Math.sin(rotation.y);
            return [x * cos + z * sin, y, -x * sin + z * cos];
        };
        
        const rotateZ = (point) => {
            const [x, y, z] = point;
            const cos = Math.cos(rotation.z), sin = Math.sin(rotation.z);
            return [x * cos - y * sin, x * sin + y * cos, z];
        };

        // Apply rotations and project to 2D
        const projected = vertices.map(v => {
            let p = rotateX(v);
            p = rotateY(p);
            p = rotateZ(p);
            return [x + p[0], y + p[1]];
        });

        // Draw edges
        const edges = [
            [0,1], [1,2], [2,3], [3,0],
            [4,5], [5,6], [6,7], [7,4],
            [0,4], [1,5], [2,6], [3,7]
        ];

        ctx.strokeStyle = `${this.color}${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        edges.forEach(([a, b]) => {
            ctx.moveTo(projected[a][0], projected[a][1]);
            ctx.lineTo(projected[b][0], projected[b][1]);
        });
        ctx.stroke();
    }
}



