// 3D Starfield Background using Three.js
class StarfieldBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = null;
    this.starGeometry = null;
    this.starMaterial = null;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 1;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to cover both hero and globe sections
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex = '1'; // Behind globe but above background
    this.renderer.domElement.style.pointerEvents = 'none';
    this.renderer.domElement.id = 'starfield-canvas';
    
    // Insert as the first child of body to cover entire page
    document.body.insertBefore(this.renderer.domElement, document.body.firstChild);
    
    console.log('Starfield canvas created and added to page');
    
    this.createStars();
    this.animate();
    this.setupEventListeners();
  }
  
  createStars() {
    // Create star geometry
    this.starGeometry = new THREE.BufferGeometry();
    const starCount = 5000; // Increased star count for better visibility
    
    // Create arrays for star positions and colors
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    // Generate random star positions and properties
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Star colors - mix of white and cyan
      const starType = Math.random();
      if (starType < 0.8) {
        // White stars (80%)
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        // Cyan accent stars (20%)
        colors[i3] = 0;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
      
      // Random star sizes
      sizes[i] = Math.random() * 3 + 1;
    }
    
    // Set geometry attributes
    this.starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create star material
    this.starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add subtle twinkling by varying size
          float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.3 + 0.7;
          
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular star shape
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          
          // Add glow effect
          alpha *= alpha;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    // Create star system
    this.stars = new THREE.Points(this.starGeometry, this.starMaterial);
    this.scene.add(this.stars);
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    
    // Update shader time uniform for twinkling
    this.starMaterial.uniforms.time.value = time;
    
    // Slow rotation of the entire starfield
    this.stars.rotation.x += 0.0002;
    this.stars.rotation.y += 0.0003;
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  // Method to adjust starfield intensity
  setIntensity(intensity) {
    this.starMaterial.opacity = intensity;
  }
  
  // Method to pause/resume animation
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }
  
  // Cleanup method
  destroy() {
    this.pause();
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    if (this.starGeometry) {
      this.starGeometry.dispose();
    }
    if (this.starMaterial) {
      this.starMaterial.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Initialize starfield when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for the globe to initialize first
  setTimeout(() => {
    window.starfieldBackground = new StarfieldBackground();
  }, 500);
});

// Export for potential external use
window.StarfieldBackground = StarfieldBackground;
