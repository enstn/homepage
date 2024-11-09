const vertexShader = `
    uniform vec3 uPointer;
    uniform float uTime;
    varying vec3 vColor;

    #define PI 3.14159265359

    mat2 rotate2d(float angle) {
        return mat2(
            cos(angle), -sin(angle),
            sin(angle), cos(angle)
        );
    }

    void main() {
        vec4 mvPosition = vec4(position, 1.0);
        vec3 transformed = position;
        
        // Calculate distance from pointer
        float d = distance(uPointer, transformed);
        float c = smoothstep(0.45, 0.1, d);
        
        // Add wave effect
        float wave = sin(transformed.x * 5.0 + uTime) * 0.1;
        transformed.y += wave;
        
        // Add rotation based on time
        float angle = PI * sin(uTime * 0.5);
        transformed.xz = rotate2d(angle) * transformed.xz;
        
        // Apply position
        vec4 finalPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * finalPosition;
        
        // Pass color to fragment shader
        vColor = vec3(0.5 + sin(uTime) * 0.5, 0.5, 1.0);
    }
`;