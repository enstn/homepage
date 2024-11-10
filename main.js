// Particle class definition
class Particle {
    constructor(initialPosition = null) {
        this.reset(initialPosition);
        this.transitioning = !!initialPosition;

        // stuff for project nodes
        this.isGithub = false;
        this.fixed = false;
        this.pulsePhase = 0;
    }

    reset(initialPosition = null) {
        // return directly so project nodes stay fixed
        if (this.fixed) return;

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

        // coordinate init
        // this.targetX = (Math.random() - 0.5) * window.innerWidth * 3;
        // this.targetY = (Math.random() - 0.5) * window.innerHeight * 3;
        // this.targetZ = Math.random() * 2000;

        // some kind of more sophisticated coord init with angles(??)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * window.innerWidth / 4;
        this.targetX = Math.cos(angle) * radius;
        this.targetY = Math.sin(angle) * radius;
        this.targetZ = 1000 + Math.random() * 500;
        
        this.radius = Math.random() * 2 + 1;
        this.brightness = Math.random() * 0.5 + 0.8; // maybe even brighter? depends on max value
        this.color = `rgba(255, 255, 255, ${this.brightness})`;
    }

    update() {
        if (this.transitioning) {
            // pulse freq for fixed particles : does this not just depend on screen refresh rate?
            if (this.fixed) {
                this.pulsePhase += 0.5;
            }

            // Smooth transition to target position
            const ease = 0.03;
            this.x += (this.targetX - this.x) * ease;
            this.y += (this.targetY - this.y) * ease;
            this.z += (this.targetZ - this.z) * ease;

            
            // Check if transition is complete
            const threshold = 0.1;
            const dx = Math.abs(this.x - this.targetX);
            const dy = Math.abs(this.y - this.targetY);
            const dz = Math.abs(this.z - this.targetZ);
            if (dx < threshold && dy < threshold && dz < threshold) {
                this.transitioning = false;
            }
        }
    }

    draw(ctx, x2d, y2d, scale, alpha) {
        const r = this.radius * scale;
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, r * 2);
        
        if (this.isGithub) {
            const pulseIntensity = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            gradient.addColorStop(0, `rgba(100, 200, 255, ${alpha})`);
            gradient.addColorStop(0.4, `rgba(100, 200, 255, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
        } else {
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.9})`); // brighter nodes
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        }

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x2d, y2d, r * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = this.isGithub ? `rgba(255, 50, 50, ${alpha})` : `rgba(255, 255, 255, ${alpha})`; // core
        ctx.arc(x2d, y2d, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Brain Visualization Class
class BrainVisualization {
    constructor() {
        console.log('Initializing BrainVisualization...');
        if (!window.THREE || !window.GLTFLoader) {
            console.error('Required dependencies not loaded');
            return;
        }
        
        this.container = document.getElementById('brain-container');
        this.isExploding = false;
        this.isRestoring = false;

        this.nodes = []; // Array to store brain surface nodes
        this.particles = []; // array to store particle nodes
        this.setupScene();
        this.loadBrainModel();
        this.setupEventListeners();
        
        this.animate = this.animate.bind(this);
        this.animate();
    }

    createBrainMesh() {
        // Create minimalistic brain mesh using wireframe geometry
        const geometry = new THREE.IcosahedronGeometry(2, 3);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: true,
            uniforms: {
                uTime: { value: 0 },
                uPointer: { value: new THREE.Vector3() }
            }
        });

        this.brainMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.brainMesh);

        // Create nodes at vertices
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                transparent: true,
                opacity: 0.8
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            this.nodes.push(node);
            this.scene.add(node);
        }
    }

    setupScene() {
        console.log('Setting up scene...');
        try {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000); // Black background
            
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            this.camera.position.z = 5; // Moved camera closer

            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 1);
            this.container.innerHTML = '';
            this.container.appendChild(this.renderer.domElement);

            // Softer lighting for better aesthetics
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(1, 1, 1);
            this.scene.add(directionalLight);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            this.scene.add(ambientLight);

        } catch (error) {
            console.error('Error setting up scene:', error);
        }
    }

    // old create nodes from mesh

    //createNodesFromMesh(mesh) {
    //    console.log('Creating nodes from brain mesh...');
    //    const geometry = mesh.geometry;
    //    const positions = geometry.attributes.position.array;
    //    const nodeCount = 100; // Number of nodes to create
    //    const nodesGroup = new THREE.Group();
    //    
    //    // Sample vertices from the brain mesh
    //    for (let i = 0; i < nodeCount; i++) {
    //        // Randomly sample a vertex from the brain mesh
    //        const vertexIndex = Math.floor(Math.random() * (positions.length / 3)) * 3;
    //        const x = positions[vertexIndex];
    //        const y = positions[vertexIndex + 1];
    //        const z = positions[vertexIndex + 2];
//
    //        // Create a small sphere for each node
    //        const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    //        const nodeMaterial = new THREE.MeshPhongMaterial({
    //            color: 0x00ff88,
    //            emissive: 0x00ff88,
    //            emissiveIntensity: 0.3
    //        });
    //        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    //        
    //        // Position the node
    //        node.position.set(x, y, z);
    //        nodesGroup.add(node);
    //        this.nodes.push(node);
    //    }
//
    //    // Add connections between nearby nodes
    //    this.nodes.forEach((node, i) => {
    //        this.nodes.slice(i + 1).forEach(otherNode => {
    //            const distance = node.position.distanceTo(otherNode.position);
    //            if (distance < 0.5) { // Adjust this threshold as needed
    //                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    //                    node.position,
    //                    otherNode.position
    //                ]);
    //                const lineMaterial = new THREE.LineBasicMaterial({
    //                    color: 0x00ff88,
    //                    transparent: true,
    //                    opacity: 0.2
    //                });
    //                const line = new THREE.Line(lineGeometry, lineMaterial);
    //                nodesGroup.add(line);
    //            }
    //        });
    //    });
//
    //    this.nodesGroup = nodesGroup;
    //    this.scene.add(nodesGroup);
    //}

    loadBrainModel() {
        const loader = new window.GLTFLoader();
        const loadingIndicator = document.getElementById('loading-indicator');
        
        if (loadingIndicator) {
            loadingIndicator.textContent = 'Loading brain model...';
        }

        loader.load(
            'models/brain.glb',
            (gltf) => {
                console.log('Brain model loaded:', gltf);
                this.brainModel = gltf.scene;
                
                // Center and scale the brain
                this.brainModel.position.set(0, 0, 0);
                this.brainModel.scale.set(1.5, 1.5, 1.5);

                // Process all meshes in the model
                this.brainModel.traverse((child) => {
                    if (child.isMesh) {
                        console.log('Processing mesh:', child);
                        
                        const brainMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffffff,
                            metalness: 0.1,
                            roughness: 0.5,
                            transparent: true,
                            opacity: 0.8 // Made slightly transparent
                        });
                        
                        child.material = brainMaterial;
                        
                        if (child.geometry) {
                            child.geometry.computeVertexNormals();
                            if (child.geometry.attributes.position) {
                                child.geometry.computeBoundingSphere();
                                this.createNodesFromMesh(child); // Create nodes after processing mesh
                            }
                        }
                    }
                });

                this.scene.add(this.brainModel);
                
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100);
                if (loadingIndicator) {
                    loadingIndicator.textContent = `Loading brain model... ${Math.round(percent)}%`;
                }
            },
            (error) => {
                console.error('Error loading brain model:', error);
                if (loadingIndicator) {
                    loadingIndicator.textContent = 'Error loading brain model';
                }
            }
        );
    }

    explodeBrain() {
        if (!this.brainModel || this.isExploding) return;
        
        console.log('Starting brain explosion effect');
        this.isExploding = true;

        // Initialize particle system before explosion
        const canvas = document.getElementById('networkCanvas');
        const ctx = canvas.getContext('2d');
        
        // Create particles from brain nodes
        const particles = [];
        this.nodes.forEach((node) => {
            // Convert node position to screen space
            const vector = node.position.clone();
            vector.project(this.camera);
            
            // Create particle at node position
            const particle = new Particle({
                x: vector.x,
                y: vector.y,
                z: vector.z
            });
            particles.push(particle);
        });

        // Fill remaining particles
        while (particles.length < 200) {
            particles.push(new Particle());
        }

        // Add Github particle
        const githubNode = particles[0];
        githubNode.isGithub = true;
        githubNode.radius = 3;
        githubNode.z = 500;

        // Fade out brain and nodes
        this.brainModel.traverse((child) => {
            if (child.isMesh) {
                gsap.to(child.material, {
                    opacity: 0,
                    duration: 2
                });
            }
        });

        this.nodes.forEach((node) => {
            gsap.to(node.material, {
                opacity: 0,
                duration: 2
            });
        });

        // Start particle animation
        let speed = 0;
        let targetSpeed = 0;
        const maxSpeed = 20;
        let lastScrollTop = window.pageYOffset;
        let isScrolling = false;
        let scrollTimeout;

        // Scroll event listener
        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            
            const scrollTop = window.pageYOffset;
            const scrollDelta = scrollTop - lastScrollTop;
            targetSpeed = Math.max(-maxSpeed, Math.min(maxSpeed, scrollDelta));
            lastScrollTop = scrollTop;

            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        });

        const animate = () => {
            ctx.fillStyle = isScrolling ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            speed += (targetSpeed - speed) * 0.1;
            targetSpeed *= 0.95;

            particles.forEach(particle => {
                particle.update();
                particle.z -= speed;

                if (particle.z <= 1) {
                    particle.reset();
                    particle.z = 2000;
                } else if (particle.z > 2000) {
                    particle.reset();
                    particle.z = 1;
                }
                
                const scale = 400 / particle.z;
                const x2d = particle.x * scale + canvas.width / 2;
                const y2d = particle.y * scale + canvas.height / 2;
                const alpha = Math.min(1, (2000 - particle.z) / 1000);
                
                particle.draw(ctx, x2d, y2d, scale, alpha);

                // Draw connections
                particles.forEach(other => {
                    const dx = x2d - (other.x * 400 / other.z + canvas.width / 2);
                    const dy = y2d - (other.y * 400 / other.z + canvas.height / 2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100 && Math.abs(particle.z - other.z) < 200) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
                        ctx.lineWidth = Math.min(2, particle.radius * scale / 2);
                        ctx.moveTo(x2d, y2d);
                        ctx.lineTo(
                            other.x * 400 / other.z + canvas.width / 2,
                            other.y * 400 / other.z + canvas.height / 2
                        );
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        // Show canvas and start animation
        setTimeout(() => {
            this.container.classList.add('hidden');
            canvas.classList.add('visible');
            animate();
        }, 1000);

        // Add GitHub click handler
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            particles.forEach(particle => {
                if (!particle.isGithub) return;

                const scale = 400 / particle.z;
                const x2d = particle.x * scale + canvas.width / 2;
                const y2d = particle.y * scale + canvas.height / 2;
                const r = particle.radius * scale * 2;

                const dx = mouseX - x2d;
                const dy = mouseY - y2d;
                if (dx * dx + dy * dy < r * r) {
                    window.open('https://github.com/enstn', '_blank');
                }
            });
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            // Resize canvas if it exists
            const canvas = document.getElementById('networkCanvas');
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });

        this.renderer.domElement.addEventListener('click', () => {
            if (!this.isExploding && this.brainModel) {
                console.log('Triggering explosion');
                this.explodeBrain();
            }
        });

        // Smooth rotation on mouse move
        window.addEventListener('mousemove', (event) => {
            if (this.brainModel && this.nodesGroup) {
                const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

                gsap.to(this.brainModel.rotation, {
                    x: mouseY * 0.5,
                    y: mouseX * 0.5,
                    duration: 1
                });

                gsap.to(this.nodesGroup.rotation, {
                    x: mouseY * 0.5,
                    y: mouseX * 0.5,
                    duration: 1
                });
            }
        });
    }

    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(this.animate);
        
        // Animate nodes with subtle pulsing
        if (this.nodes) {
            this.nodes.forEach((node) => {
                node.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.2;
                node.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.2;
                node.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.2;
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize canvas
const canvas = document.getElementById('networkCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle canvas resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}