import * as THREE from 'three';
import { ParticleNetwork } from './particleNetwork.js';
import Particle from './particle.js';

export class TransitionManager {
    constructor(brainVisualization) {
        this.brain = brainVisualization;
        this.particleCanvas = document.getElementById('particleCanvas');
        this.particleNetwork = new ParticleNetwork(this.particleCanvas);
        this.isExploding = false;
        
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
                vColor = mix(uColor, uHoverColor, c * uHover) * (1.0 - uExplosionProgress * 0.3);
            }
        `;

        this.brain.instancedMesh.material.vertexShader = modifiedVertexShader;
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
    
    startTransition() {
        if (this.isExploding) return;
        this.isExploding = true;
        
        // Create particles using brain nodes
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

    createParticles() {
        // Clear existing particles
        this.particleNetwork.particles = [];

        // Use brain's instanced mesh positions to create particles
        const positions = this.brain.instancedMesh.geometry.attributes.position.array;
        const instanceCount = positions.length / 3;
        
        for (let i = 0; i < instanceCount; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            const vector = new THREE.Vector3(x, y, z);
            vector.project(this.brain.camera);
        
            // Create particle with wireframe properties
            const particle = new Particle({
                x: vector.x,
                y: vector.y,
                z: 1000
            });
        
            // Set wireframe properties
            particle.wireframe = true;
            particle.rotation = {
                x: Math.random() * Math.PI * 2,
                y: Math.random() * Math.PI * 2,
                z: Math.random() * Math.PI * 2
            };
            particle.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            };
            particle.size = Math.random() * 10 + 5;
        
            // Random warm colors similar to reference
            const colors = [
                'rgba(255, 107, 107, ',
                'rgba(255, 133, 230, ',
                'rgba(255, 160, 122, ',
                'rgba(221, 160, 221, '
            ];
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        
            this.particleNetwork.particles.push(particle);
        }

        // Fill remaining particles for background
        while (this.particleNetwork.particles.length < 1000) {
            const particle = new Particle();
            particle.wireframe = false; // Regular particles for background
            this.particleNetwork.particles.push(particle);
        }
    }
}