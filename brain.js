import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const vertexShader = `
    uniform vec3 uPointer;
    uniform float uRotation;
    uniform float uSize;
    uniform float uHover;
    uniform float uTime;
    
    varying float vDistance;
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
        vDistance = c; // Pass the distance to fragment shader
        
        float scale = uSize + c * 8.0 * uHover;
        vec3 pos = position;
        pos *= scale;
        
        pos.xz *= rotate(PI * c * uRotation + PI * uRotation * 0.43);
        pos.xy *= rotate(PI * c * uRotation + PI * uRotation * 0.71);
        
        mvPosition = instanceMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
        
        vPosition = mvPosition.xyz;
    }
`;

const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uHoverColor1;
    uniform vec3 uHoverColor2;
    uniform vec3 uHoverColor3;
    uniform float uTime;
    
    varying float vDistance;
    varying vec3 vPosition;
    
    void main() {
        // Create dynamic color based on distance and position
        vec3 finalColor;
        
        if (vDistance > 0.0) {
            // Create a random-looking pattern for color selection
            float random = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
            
            if (random < 0.33) {
                finalColor = mix(uBaseColor, uHoverColor1, vDistance);
            } else if (random < 0.66) {
                finalColor = mix(uBaseColor, uHoverColor2, vDistance);
            } else {
                finalColor = mix(uBaseColor, uHoverColor3, vDistance);
            }
        } else {
            finalColor = uBaseColor;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

class BrainVisualization {
    constructor() {
        this.container = document.getElementById('brain-container');
        this.hover = false;
        this.colors = {
            base: new THREE.Color(0xFFFFFF),    // White
            hover1: new THREE.Color(0xFFD700),   // Gold
            hover2: new THREE.Color(0xFF4500),   // Red Orange
            hover3: new THREE.Color(0xFF8C00)    // Dark Orange
        };

        this.uniforms = {
            uHover: { value: 0 },
            uPointer: { value: new THREE.Vector3() },
            uRotation: { value: 0 },
            uSize: { value: 1.0 },
            uTime: { value: 0 },
            uBaseColor: { value: this.colors.base },
            uHoverColor1: { value: this.colors.hover1 },
            uHoverColor2: { value: this.colors.hover2 },
            uHoverColor3: { value: this.colors.hover3 }
        };

        this.point = new THREE.Vector3();
        this.animate = this.animate.bind(this)
        this.init();
    }

    init() {
        this._createScene();
        this._createCamera();
        this._createRenderer();
        this._createRaycaster();
        this._createLoader();
        this._checkMobile();

        this._loadModel().then(() => {
            this._addListeners();
            this.animate();
        });
    }

    _checkMobile() {
        this.isMobile = window.innerWidth < 767;
    }

    _createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    _createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 1.2);
    }

    _createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio === 1
        });

        this.container.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    }

    _createLoader() {
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onLoad = () => {
            document.documentElement.classList.add('model-loaded');
        };
        this.gltfLoader = new GLTFLoader(this.loadingManager);
    }

    _createRaycaster() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
    }

    _loadModel() {
        return new Promise(resolve => {
            this.gltfLoader.load('./models/brain.glb', 
                // onLoad callback
                (gltf) => {
                    console.log('Brain model loaded successfully');
                    this.brain = gltf.scene.children[0];
                    this._createInstancedMesh();
                    
                    // Hide loading indicator
                    const loadingIndicator = document.getElementById('loading-indicator');
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                    
                    resolve();
                },
                // onProgress callback
                (xhr) => {
                    const loadingIndicator = document.getElementById('loading-indicator');
                    if (loadingIndicator && xhr.total) {
                        const percent = (xhr.loaded / xhr.total * 100);
                        loadingIndicator.textContent = `Loading... ${Math.round(percent)}%`;
                    }
                },
                // onError callback
                (error) => {
                    console.error('Error loading brain model:', error);
                    const loadingIndicator = document.getElementById('loading-indicator');
                    if (loadingIndicator) {
                        loadingIndicator.textContent = 'Error loading model';
                    }
                }
            );
        });
    }

    _createInstancedMesh() {
        const geometry = new THREE.BoxGeometry(0.004, 0.004, 0.004);
        
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            wireframe: true,
            uniforms: this.uniforms
        });

        const positions = this.brain.geometry.attributes.position.array;
        const instanceCount = positions.length / 3;
        
        this.instancedMesh = new THREE.InstancedMesh(
            geometry,
            material,
            instanceCount
        );

        const dummy = new THREE.Object3D();

        for (let i = 0; i < positions.length; i += 3) {
            dummy.position.set(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );

            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.instancedMesh);
    }

    _onMousemove(e) {
        const x = e.clientX / window.innerWidth * 2 - 1;
        const y = -(e.clientY / window.innerHeight * 2 - 1);

        this.mouse.set(x, y);

        gsap.to(this.camera.position, {
            x: x * 0.15,
            y: y * 0.1,
            duration: 0.5
        });

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObject(this.brain);

        if (this.intersects.length === 0) {
            if (this.hover) {
                this.hover = false;
                this._animateHoverUniform(0);
            }
        } else {
            if (!this.hover) {
                this.hover = true;
                this._animateHoverUniform(1);
            }

            gsap.to(this.point, {
                x: this.intersects[0]?.point.x || 0,
                y: this.intersects[0]?.point.y || 0,
                z: this.intersects[0]?.point.z || 0,
                overwrite: true,
                duration: 0.3,
                onUpdate: () => {
                    this.uniforms.uPointer.value.copy(this.point);
                }
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update time uniform for dynamic color patterns
        if (this.uniforms.uTime) {
            this.uniforms.uTime.value = performance.now() * 0.001;
        }
        
        this.camera.lookAt(0, 0, 0);
        this.camera.position.z = this.isMobile ? 2.3 : 1.2;
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrainVisualization();
});