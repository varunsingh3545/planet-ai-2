import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Initialize globe scene
console.log('Initializing globe...');

const canvas = document.querySelector('#globe-canvas');
if (!canvas) {
  console.error('Globe canvas not found!');
} else {
  console.log('Canvas found, creating scene...');
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 15;
  
  console.log('Renderer created successfully');

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  // Globe with Earth texture
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-day.jpg');
  const specularMap = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-specular.jpg');
  const bumpMap = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-topology.png');
  
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.MeshStandardMaterial({ 
      map: earthTexture,
      specularMap: specularMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 0.7,
      metalness: 0.1
    })
  );
  globe.rotation.z = 0.41;
  scene.add(globe);
  
  // Make globe globally accessible for animations
  window.globe = globe;
  window.camera = camera;
  window.initialCameraZ = 15;
  
  // Add clouds layer
  const cloudTexture = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-clouds.png');
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(5.05, 64, 64),
    new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    })
  );
  clouds.rotation.z = 0.41;
  scene.add(clouds);

  // --- AI Data Points ---
  const pointsOfInterest = [
    {
      id: 'climate-ai',
      name: 'Climate AI',
      emoji: '🌡️',
      lat: 71.7069,
      lon: -42.6043,
      color: '#00ffff',
      description: 'Models climate change & predicts weather.',
      extendedInfo: 'Climate AI collects global data to forecast temperature spikes, droughts, and disasters. Our advanced neural networks process atmospheric data from thousands of weather stations, satellites, and IoT sensors worldwide. We provide 98% accurate weather predictions and early warning systems for extreme weather events.',
      image: 'climate-ai.jpg'
    },
    {
      id: 'wildlife-ai',
      name: 'Wildlife AI',
      emoji: '🐅',
      lat: -14.2350,
      lon: -51.9253,
      color: '#ff6b35',
      description: 'Tracks migration patterns and protects endangered species.',
      extendedInfo: 'Wildlife AI uses advanced computer vision and satellite imagery to monitor animal migration patterns across continents. Our AI processes thousands of camera trap images daily, identifying species, tracking population changes, and detecting poaching activities in real-time.',
      image: 'wildlife-ai.jpg'
    },
    {
      id: 'marine-ai',
      name: 'Marine AI',
      emoji: '🐋',
      lat: -20.0,
      lon: 150.0,
      color: '#00bcd4',
      description: 'Monitors ocean health and marine ecosystems.',
      extendedInfo: 'Marine AI combines underwater sensors, satellite data, and autonomous vehicles to monitor ocean health. Our system tracks coral bleaching events, measures water quality parameters, and monitors marine life populations.',
      image: 'marine-ai.jpg'
    },
    {
      id: 'forest-ai',
      name: 'Forest AI',
      emoji: '🌳',
      lat: 0.5140,
      lon: 21.7587,
      color: '#4caf50',
      description: 'Detects deforestation and monitors forest health.',
      extendedInfo: 'Forest AI uses satellite imagery and drone surveillance to detect illegal deforestation, monitor forest health, and predict wildfire risks. Our system analyzes changes in forest cover with 95% accuracy.',
      image: 'forest-ai.jpg'
    },
    {
      id: 'satellite-ai',
      name: 'Satellite AI',
      emoji: '🛰️',
      lat: 37.4419,
      lon: -122.1430,
      color: '#ff9800',
      description: 'Analyzes satellite imagery for planetary changes.',
      extendedInfo: 'Satellite AI processes petabytes of satellite imagery to detect and analyze planetary changes. Our system monitors urban expansion, agricultural patterns, natural disasters, and environmental changes with unprecedented accuracy.',
      image: 'satellite-ai.jpg'
    },
    {
      id: 'air-quality-ai',
      name: 'Air Quality AI',
      emoji: '💨',
      lat: 28.6139,
      lon: 77.2090,
      color: '#9c27b0',
      description: 'Monitors air pollution and atmospheric conditions.',
      extendedInfo: 'Air Quality AI uses a network of ground sensors, satellite data, and atmospheric models to monitor air pollution levels in real-time. Our system tracks PM2.5, ozone, nitrogen dioxide, and other pollutants, providing early warnings for health hazards and environmental risks.',
      image: 'air-quality-ai.jpg'
    }
  ];

  // --- Hotspot Markers ---
  const globeRadius = 5;
  const vizGroup = new THREE.Group();
  const clickableMarkers = [];

  // Helper to convert Lat/Lon to 3D vector on globe
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  // Create hotspot markers
  function createHotspot(pointData) {
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const markerColor = new THREE.Color(pointData.color);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: markerColor, 
      toneMapped: false, 
      transparent: true, 
      opacity: 0.9 
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    const position = latLonToVector3(pointData.lat, pointData.lon, globeRadius);
    marker.position.copy(position);
    marker.userData = pointData;

    // Add pulsating animation
    if (window.gsap) {
      gsap.to(marker.scale, {
        x: 1.5, y: 1.5, z: 1.5,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
      
      gsap.to(marker.material, {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
    
    vizGroup.add(marker);
    clickableMarkers.push(marker);
  }

  // Create markers for each AI point
  pointsOfInterest.forEach(createHotspot);
  
  // --- Connection Lines ---
  const connections = [
    { start: 0, end: 1 }, // Climate AI -> Wildlife AI
    { start: 1, end: 2 }, // Wildlife AI -> Marine AI
    { start: 2, end: 3 }, // Marine AI -> Forest AI
    { start: 3, end: 4 }, // Forest AI -> Satellite AI
    { start: 4, end: 0 }, // Satellite AI -> Climate AI
    { start: 0, end: 2 }, // Climate AI -> Marine AI (cross connection)
    { start: 1, end: 3 }  // Wildlife AI -> Forest AI (cross connection)
  ];

  // Create flowing connection lines
  function createConnectionLine(startPoint, endPoint) {
    const startPos = latLonToVector3(startPoint.lat, startPoint.lon, globeRadius);
    const endPos = latLonToVector3(endPoint.lat, endPoint.lon, globeRadius);
    
    // Create curved path using quadratic bezier curve
    const midPoint = new THREE.Vector3()
      .addVectors(startPos, endPos)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(globeRadius + 1); // Lift the curve above the surface
    
    const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create glowing line material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00ffff'),
      transparent: true,
      opacity: 0.6,
      linewidth: 2
    });
    
    const line = new THREE.Line(geometry, lineMaterial);
    
    // Add flowing animation effect
    if (window.gsap) {
      // Animate opacity for pulsing effect
      gsap.to(lineMaterial, {
        opacity: 0.2,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
      
      // Animate color shift
      gsap.to(lineMaterial.color, {
        r: 0.2,
        g: 0.8,
        b: 1,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
    
    return line;
  }
  
  // Create all connection lines
  connections.forEach(connection => {
    const startPoint = pointsOfInterest[connection.start];
    const endPoint = pointsOfInterest[connection.end];
    const line = createConnectionLine(startPoint, endPoint);
    vizGroup.add(line);
  });
  
  // Add particle flow effect along lines
  function createFlowingParticles() {
    connections.forEach((connection, index) => {
      const startPoint = pointsOfInterest[connection.start];
      const endPoint = pointsOfInterest[connection.end];
      
      const startPos = latLonToVector3(startPoint.lat, startPoint.lon, globeRadius);
      const endPos = latLonToVector3(endPoint.lat, endPoint.lon, globeRadius);
      
      const midPoint = new THREE.Vector3()
        .addVectors(startPos, endPos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(globeRadius + 1);
      
      const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
      
      // Create small particle
      const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      vizGroup.add(particle);
      
      // Animate particle along the curve
      if (window.gsap) {
        const tl = gsap.timeline({ repeat: -1, delay: index * 0.5 });
        
        tl.to({}, {
          duration: 3 + Math.random() * 2,
          ease: 'none',
          onUpdate: function() {
            const t = this.progress();
            const point = curve.getPoint(t);
            particle.position.copy(point);
          }
        })
        .to(particleMaterial, {
          opacity: 0,
          duration: 0.5
        }, 0)
        .to(particleMaterial, {
          opacity: 0.8,
          duration: 0.5
        }, 0.5);
      }
    });
  }
  
  // Initialize flowing particles
  createFlowingParticles();
  
  globe.add(vizGroup);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false; // Disable right-click panning
  controls.enableZoom = false; // Disable scroll wheel zoom
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // --- Interactive Functionality ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let activeMarker = null;

  // Show info panel function
  function showInfo(marker) {
    if (activeMarker === marker) return;
    
    activeMarker = marker;
    isInfoPanelOpen = true;
    
    // Create scanning ring effect at marker position
    createScanningRing(marker.position, marker.userData.color);
    
    // Add subtle camera shake for impact
    gsap.to(camera.position, {
      x: camera.position.x + (Math.random() - 0.5) * 0.1,
      y: camera.position.y + (Math.random() - 0.5) * 0.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
    
    // Disable auto-rotation when info panel is open
    controls.enableRotate = false;
    
    // Use the info panel controller
    if (window.infoPanelController) {
      window.infoPanelController.showPanel(marker.userData);
    }
    
    // Animate Earth (shrink and shift right)
    if (window.gsap) {
      gsap.to(globe.scale, {
        duration: 0.6,
        x: 0.8,
        y: 0.8,
        z: 0.8,
        ease: "power2.out"
      });
      
      gsap.to(globe.position, {
        duration: 0.6,
        x: 2,
        ease: "power2.out"
      });
      
      gsap.to(camera.position, {
        duration: 0.6,
        z: 17,
        ease: "power2.out"
      });
    }
  }

  // Hide info panel function
  function hideInfo() {
    if (window.infoPanelController) {
      window.infoPanelController.hidePanel();
    }
    
    activeMarker = null;
    controls.autoRotate = true;
    
    // Animate Earth back to original state
    if (window.gsap) {
      gsap.to(globe.scale, {
        duration: 0.6,
        x: 1,
        y: 1,
        z: 1,
        ease: "power2.out"
      });
      
      gsap.to(globe.position, {
        duration: 0.6,
        x: 0,
        ease: "power2.out"
      });
      
      gsap.to(camera.position, {
        duration: 0.6,
        z: 15,
        ease: "power2.out"
      });
    }
  }

  // Mouse move handler for hover effects
  function onPointerMove(event) {
    if (activeMarker) return;
    
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(clickableMarkers);
    document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'auto';
  }

  // Click handler for markers
  function onCanvasClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(clickableMarkers);
    
    if (intersects.length > 0) {
      const clickedMarker = intersects[0].object;
      if (activeMarker === clickedMarker) return;
      
      document.body.style.cursor = 'auto';
      showInfo(clickedMarker);
    } else {
      if (activeMarker) hideInfo();
    }
  }

  // Add event listeners
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('click', onCanvasClick);
  
  // Dismiss panel on globe interaction
  controls.addEventListener('start', () => {
    if (window.infoPanelController && window.infoPanelController.isOpen) {
      hideInfo();
    }
  });
  // Make functions globally accessible
  window.globeShowInfo = showInfo;
  window.globeHideInfo = hideInfo;

  // --- Scanning Ring Effect ---
  let scanningRings = [];
  
  function createScanningRing(position, color = '#00ffff') {
    const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.lookAt(new THREE.Vector3(0, 0, 0)); // Face the center
    
    scene.add(ring);
    scanningRings.push(ring);
    
    // Animate ring expansion and fade
    gsap.timeline({
      onComplete: () => {
        scene.remove(ring);
        const index = scanningRings.indexOf(ring);
        if (index > -1) scanningRings.splice(index, 1);
        ringGeometry.dispose();
        ringMaterial.dispose();
      }
    })
    .to(ring.scale, {
      x: 8,
      y: 8,
      z: 8,
      duration: 2,
      ease: 'power2.out'
    })
    .to(ringMaterial, {
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
    }, 0);
  }
  
  // --- Orbital Particles ---
  let orbitalParticles;
  
  function createOrbitalParticles() {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere around Earth
      const radius = globeRadius + 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Particle colors (cyan and white)
      if (Math.random() < 0.7) {
        colors[i3] = 0.8;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
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
          
          // Add subtle floating animation
          float pulse = sin(time * 2.0 + position.x * 0.01) * 0.3 + 0.7;
          
          gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          alpha *= alpha; // Sharper falloff
          
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    orbitalParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(orbitalParticles);
  }
  
  // --- Enhanced Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Auto-rotate globe
    if (!isInfoPanelOpen) {
      globe.rotation.y += 0.005;
    }
    
    // Rotate clouds slightly faster
    clouds.rotation.y += 0.007;
    
    // Rotate orbital particles slowly
    if (orbitalParticles) {
      orbitalParticles.rotation.y += 0.002;
      orbitalParticles.rotation.x += 0.001;
      
      // Update particle animation time
      orbitalParticles.material.uniforms.time.value = time;
    }
    
    // Update flowing particles
    updateFlowingParticles();
    
    controls.update();
    renderer.render(scene, camera);
  }

  // Initialize orbital particles
  createOrbitalParticles();
  
  console.log('Starting animation loop...');
  
  // Start animation
  animate();
  
  console.log('Globe initialization complete!');

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
} else {
  console.error('Canvas element not found - globe cannot initialize');
}
