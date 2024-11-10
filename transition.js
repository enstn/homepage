import * as THREE from 'three';
import { ParticleNetwork } from './particleNetwork.js';
import Particle from './particle.js';

export class TransitionManager {
    constructor(brainVisualization) {
        this.brain = brainVisualization;
        this.particleCanvas = document.getElementById('particleCanvas');
        this.particleNetwork = new ParticleNetwork(this.particleCanvas);
        this.isExploding = false;

        // Initialize matrices for coordinate transformation
        this.projectionMatrix = new THREE.Matrix4();
        this.viewMatrix = new THREE.Matrix4();
        this.modelViewMatrix = new THREE.Matrix4();

        this.visibleBounds = {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
            near: 0.1,
            far: 1000
        };
        
        if (this.brain.instancedMesh) {
            this.initialize();
        } else {
            this.waitForBrain();
        }
    }
    
    async waitForBrain() {
        let attempts = 0;
        while (!this.brain.instancedMesh && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (this.brain.instancedMesh) {
            this.initialize();
        }
    }
    
    initialize() {
        // Add explosion uniforms while preserving existing ones
        const currentUniforms = this.brain.instancedMesh.material.uniforms;
        this.brain.instancedMesh.material.uniforms = {
            ...currentUniforms,
            uExplosionProgress: { value: 0 },
            uTime: { value: 0 }
        };

        // Keep original brain.js vertex shader and add explosion
        const modifiedVertexShader = `
            uniform vec3 uPointer;
            uniform vec3 uColor;
            uniform float uRotation;
            uniform float uSize;
            uniform float uHover;
            uniform vec3 uHoverColor;
            uniform float uExplosionProgress;
            uniform float uTime;
            
            varying vec3 vColor;
            varying vec3 vPosition;
            
            #define PI 3.14159265359
            
            mat2 rotate(float angle) {
                float s = sin(angle);
                float c = cos(angle);
                return mat2(c, -s, s, c);
            }
            
            void main() {
                vec4 mvPosition = vec4(position, 1.0);
                mvPosition = instanceMatrix * mvPosition;
                
                float d = distance(uPointer, mvPosition.xyz);
                float c = smoothstep(0.45, 0.1, d);
                
                float scale = uSize + c * 12.0 * uHover;
                vec3 pos = position;
                pos *= scale;
                
                pos.xz *= rotate(PI * c * uRotation + PI * uRotation * 0.43);
                pos.xy *= rotate(PI * c * uRotation + PI * uRotation * 0.71);
                
                // Add explosion transformation
                if (uExplosionProgress > 0.0) {
                    vec3 explosionDir = normalize(mvPosition.xyz);
                    float explosionOffset = uExplosionProgress * 8.0; // Increased explosion scale
                    pos += explosionDir * explosionOffset;
                    
                    // Add rotation during explosion
                    float explosionRotation = uExplosionProgress * PI * 0.1;
                    pos.xz *= rotate(explosionRotation);
                    pos.xy *= rotate(explosionRotation * 0.7);
                    
                }
                
                mvPosition = instanceMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
                
                // Color handling - preserve original hover color and add subtle fade during explosion
                vPosition = (modelViewMatrix * mvPosition).xyz;
                vColor = mix(uColor, uHoverColor, c * uHover) * (1.0 - uExplosionProgress * 0.3);
            }
        `;

        const modifiedFragmentShader = `
            varying vec3 vColor;
            varying vec3 vPosition;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;

        this.brain.instancedMesh.material.vertexShader = modifiedVertexShader;
        this.brain.instancedMesh.material.fragmentShader = modifiedFragmentShader;
        this.brain.instancedMesh.material.needsUpdate = true;
        
        // Setup click handler
        this.brain.container.addEventListener('click', () => this.startTransition());
        
        // Start animation loop
        this.animate();
    }
    
    animate = () => {
        if (!this.brain.instancedMesh) return;
        this.brain.instancedMesh.material.uniforms.uTime.value += 0.016;

        this.particleNetwork.updateParticles();
        this.particleNetwork.render();

        requestAnimationFrame(this.animate);
    }

    getFinalExplosionPositions() {
        const positions = [];
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        const instanceCount = this.brain.instancedMesh.count;
        
        for (let i = 0; i < instanceCount; i++) {
            this.brain.instancedMesh.getMatrixAt(i, matrix);
            matrix.decompose(position, quaternion, scale);
            
            // Apply explosion transformation
            const explosionDir = position.normalize();
            const explosionOffset = 8.0; // Same as shader
            position.add(explosionDir.multiplyScalar(explosionOffset));
            
            // Project to screen space
            position.project(this.brain.camera);
            
            positions.push({
                x: position.x,
                y: position.y,
                z: position.z
            });
        }
        
        return positions;
    }
    
    startTransition() {
        if (this.isExploding) return;
        this.isExploding = true;
        
        // Create particles using brain nodes and its final positions
        this.finalPositions = this.getFinalExplosionPositions();
        this.createParticles();
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.particleNetwork.isActive = true;
                this.particleNetwork.animate();
            }
        });
        
        tl.to(this.particleNetwork.canvas, {
            opacity: 1,
            duration: 0.0
        })
        .to(this.brain.instancedMesh.material.uniforms.uExplosionProgress, {
            value: 1,
            duration: 3,
            ease: "power1.inOut",
            onUpdate: () => {
                this.brain.instancedMesh.material.needsUpdate = true;
            }
        }, "-=0.4") // for overlap
        .to(this.brain.container, {
            opacity: 0,
            duration: 0.0,
            delay: 0.0
        })
        .set(this.particleNetwork.canvas, {
            display: 'block'
        })
        .set(this.brain.instancedMesh, {
            visible: false
        });
    }

    calculateVisibleBounds() {
        // Get camera frustum in view space
        const fov = this.brain.camera.fov * Math.PI / 180;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const nearPlaneHeight = 2 * Math.tan(fov / 2) * this.brain.camera.near;
        const nearPlaneWidth = nearPlaneHeight * aspectRatio;

        // Calculate visible area at z = 1 (normalized device coordinates)
        this.visibleBounds = {
            left: -nearPlaneWidth / 2,
            right: nearPlaneWidth / 2,
            top: nearPlaneHeight / 2,
            bottom: -nearPlaneHeight / 2,
            near: this.brain.camera.near,
            far: this.brain.camera.far
        };
    }

    isPointVisible(point) {
        // Check if point is within visible bounds
        return (point.x >= this.visibleBounds.left && 
                point.x <= this.visibleBounds.right &&
                point.y >= this.visibleBounds.bottom && 
                point.y <= this.visibleBounds.top);
    }

    worldToScreen(position) {
        const vec = new THREE.Vector3(position.x, position.y, position.z);
        vec.project(this.brain.camera);
        
        return {
            x: (vec.x * 0.5 + 0.5) * window.innerWidth,
            y: (-vec.y * 0.5 + 0.5) * window.innerHeight,
            z: vec.z
        };
    }

    createParticles() {
        this.particleNetwork.particles = [];
        this.calculateVisibleBounds();

        const positions = this.brain.instancedMesh.geometry.attributes.position.array;
        const instanceCount = positions.length / 3;
        let visibleParticles = 0;
        const maxVisibleParticles = 2000; // Adjust this number based on performance

        // First pass: Create particles from visible brain nodes
        for (let i = 0; i < instanceCount && visibleParticles < maxVisibleParticles; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            const vector = new THREE.Vector3(x, y, z);
            vector.project(this.brain.camera);

            // Only create particles for visible points
            if (this.isPointVisible(vector)) {
                const particle = new Particle({
                    x: vector.x,
                    y: vector.y,
                    z: 1000 // Initial z position
                });

                // Set target position for transition
                particle.targetX = (Math.random() - 0.5) * window.innerWidth * 0.5;
                particle.targetY = (Math.random() - 0.5) * window.innerHeight * 0.5;
                particle.targetZ = Math.random() * 500 + 500; // Keep initial particles in middle range

                this.particleNetwork.particles.push(particle);
                visibleParticles++;
            }
        }

        // Second pass: Fill remaining particles with random positions in depth
        const remainingParticles = this.particleNetwork.PARTICLE_COUNT - visibleParticles;
        for (let i = 0; i < remainingParticles; i++) {
            const particle = new Particle();
            
            // Distribute remaining particles throughout the scrollable space
            particle.z = Math.random() * this.particleNetwork.DEPTH_RANGE;
            
            // Keep x and y within visible bounds but with some spread
            const spread = 2.5; // Adjust this for wider/narrower distribution
            particle.x = (Math.random() - 0.5) * window.innerWidth * spread;
            particle.y = (Math.random() - 0.5) * window.innerHeight * spread;
            
            // Set same position as target to avoid transition
            particle.targetX = particle.x;
            particle.targetY = particle.y;
            particle.targetZ = particle.z;
            particle.transitioning = false;

            this.particleNetwork.particles.push(particle);
        }

        console.log(`Created ${visibleParticles} visible particles and ${remainingParticles} background particles`);
    }

}


