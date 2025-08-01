// Simple working globe - minimal version to ensure visibility
console.log('Loading simple globe...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#globe-canvas');
  
  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }
  
  console.log('Canvas found, initializing Three.js...');
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Position camera
  const globeRadius = 3.5; // Increased size for more visual impact
  
  // Position camera
  camera.position.z = 10;
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Create realistic Earth with textures
  const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
  
  // Load Earth textures
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-day.jpg');
  const bumpMap = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-topology.png');
  const specularMap = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-specular.jpg');
  
  const material = new THREE.MeshPhongMaterial({ 
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.05,
    specularMap: specularMap,
    shininess: 100
  });
  
  const globe = new THREE.Mesh(geometry, material);
  
  // Create a globe group to hold the Earth and all rotating elements
  const globeGroup = new THREE.Group();
  globeGroup.add(globe);
  scene.add(globeGroup);
  
  // Add clouds layer
  const cloudTexture = textureLoader.load('https://unpkg.com/three-globe@2.27.2/example/img/earth-clouds.png');
  const cloudGeometry = new THREE.SphereGeometry(globeRadius + 0.05, 64, 64);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.4
  });
  
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(clouds);
  
  console.log('Realistic Earth with textures created');
  
  // AI Data Points
  const aiSystems = [
    { name: 'Climate AI', emoji: '🌡️', lat: 71.7069, lon: -42.6043, color: '#00ffff' },
    { name: 'Wildlife AI', emoji: '🐅', lat: -14.2350, lon: -51.9253, color: '#ff6b35' },
    { name: 'Marine AI', emoji: '🐋', lat: -20.0, lon: 150.0, color: '#00bcd4' },
    { name: 'Forest AI', emoji: '🌳', lat: 0.5140, lon: 21.7587, color: '#4caf50' },
    { name: 'Satellite AI', emoji: '🛰️', lat: 37.4419, lon: -122.1430, color: '#ff9800' },
    { name: 'Air Quality AI', emoji: '💨', lat: 28.6139, lon: 77.2090, color: '#9c27b0' }
  ];
  
  const markers = [];
  const connections = [];
  
  // Convert lat/lon to 3D position
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
  }
  
  // Create glowing AI markers with enhanced effects - scaled for larger globe
  aiSystems.forEach((ai, index) => {
    const markerGeometry = new THREE.SphereGeometry(0.12, 16, 16); // Increased from 0.08
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(ai.color),
      transparent: true,
      opacity: 0.9
    });
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    const position = latLonToVector3(ai.lat, ai.lon, globeRadius + 0.05);
    marker.position.copy(position);
    marker.userData = ai;
    
    // Add glowing halo effect - scaled up
    const haloGeometry = new THREE.SphereGeometry(0.22, 16, 16); // Increased from 0.15
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(ai.color),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.copy(position);
    marker.glow = halo;
    
    globeGroup.add(marker);
    globeGroup.add(halo);
    markers.push(marker);
  });
  
  // Create detailed connection lines between markers - more dense network
  for (let i = 0; i < markers.length; i++) {
    for (let j = i + 1; j < markers.length; j++) {
      if (Math.random() > 0.3) { // Connect more markers for denser network
        const startPos = markers[i].position;
        const endPos = markers[j].position;
        
        // Create curved path with safe heights (ensure clearance above globe)
        const distance = startPos.distanceTo(endPos);
        const heightVariation = 1.0 + Math.random() * 1.5; // Minimum 1.0 clearance
        const midPoint = new THREE.Vector3()
          .addVectors(startPos, endPos)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(globeRadius + heightVariation); // Safe lift above surface
        
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        const points = curve.getPoints(60); // More points for smoother curves
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Vary line colors and opacity based on distance - enhanced for larger globe
        const colors = ['#00ffff', '#00ff88', '#ff6b2e', '#00e5ff', '#009f3f'];
        const lineColor = colors[Math.floor(Math.random() * colors.length)];
        const baseOpacity = distance > 8 ? 0.4 : 0.7; // Increased opacity for better visibility
        
        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(lineColor),
          transparent: true,
          opacity: baseOpacity,
          linewidth: 2 // Thicker lines for larger globe
        });
        
        const line = new THREE.Line(geometry, lineMaterial);
        globeGroup.add(line);
        connections.push({ line, material: lineMaterial, baseOpacity, distance });
      }
    }
  }
  
  // Add additional data stream lines (shorter, more frequent connections)
  for (let i = 0; i < markers.length; i++) {
    // Create 2-3 additional short-range data streams per marker
    for (let k = 0; k < 3; k++) {
      const randomMarkerIndex = Math.floor(Math.random() * markers.length);
      if (randomMarkerIndex !== i && Math.random() > 0.4) {
        const startPos = markers[i].position;
        const endPos = markers[randomMarkerIndex].position;
        
        // Create lower, faster data streams with safe clearance
        const midPoint = new THREE.Vector3()
          .addVectors(startPos, endPos)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(globeRadius + 0.8); // Safe altitude for data streams (minimum 0.8 clearance)
        
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        const points = curve.getPoints(30);
        const streamGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const streamMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color('#ffffff'),
          transparent: true,
          opacity: 0.25, // Increased opacity for better visibility
          linewidth: 1.5 // Slightly thicker data stream lines
        });
        
        const streamLine = new THREE.Line(streamGeometry, streamMaterial);
        globeGroup.add(streamLine);
        connections.push({ line: streamLine, material: streamMaterial, baseOpacity: 0.15, distance: 0, isDataStream: true });
      }
    }
  }
  
  // Create orbital particles for sci-fi effect - expanded to fill whole screen
  const particleCount = 500; // Increased particle count for fuller effect
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    // Expand particles to fill entire screen space
    const radius = 6 + Math.random() * 20; // Much larger radius for screen coverage
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    particleSizes[i] = Math.random() * 3 + 0.5; // Varied sizes for depth
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.02,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Initialize Futuristic Dashboard
  let futuristicDashboard;
  if (window.FuturisticDashboard) {
    futuristicDashboard = new window.FuturisticDashboard(scene, camera, renderer);
    console.log('Futuristic Dashboard initialized successfully!');
  }
  
  // Animation loop with enhanced effects
  function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate globe group (includes Earth, markers, and connection lines)
    globeGroup.rotation.y += 0.002;
    
    // Rotate clouds slightly faster
    clouds.rotation.y += 0.007;
    
    // Animate markers with pulsing effect
    markers.forEach((marker, index) => {
      const pulseSpeed = 1.5 + index * 0.3;
      const scale = 1 + Math.sin(time * pulseSpeed) * 0.3;
      marker.scale.setScalar(scale);
      
      // Animate glow
      if (marker.glow) {
        const glowScale = 1 + Math.sin(time * pulseSpeed + 0.5) * 0.4;
        marker.glow.scale.setScalar(glowScale);
        marker.glow.material.opacity = 0.2 + Math.sin(time * pulseSpeed) * 0.1;
      }
    });
    
    // Animate connection lines with enhanced effects
    connections.forEach((connection, index) => {
      if (connection.isDataStream) {
        // Faster pulsing for data streams
        const opacity = connection.baseOpacity + Math.sin(time * 4 + index * 0.3) * 0.1;
        connection.material.opacity = Math.max(0.05, opacity);
      } else {
        // Slower, more dramatic pulsing for main connections
        const pulseSpeed = connection.distance > 8 ? 1.5 : 2.5; // Slower for long connections
        const opacity = connection.baseOpacity + Math.sin(time * pulseSpeed + index * 0.5) * 0.3;
        connection.material.opacity = Math.max(0.1, opacity);
        
        // Color shifting for some connections
        if (index % 3 === 0) {
          const hue = (time * 0.5 + index * 0.2) % 1;
          connection.material.color.setHSL(hue, 0.8, 0.6);
        }
      }
    });
    
    // Animate orbital particles
    particles.rotation.y += 0.002;
    particles.rotation.x += 0.001;
    
    // Pulse particle opacity
    particleMaterial.opacity = 0.4 + Math.sin(time * 3) * 0.2;
    
    // Update custom mouse rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;
    
    // Apply rotation to globe group
    globe.rotation.x = currentRotationX;
    globe.rotation.y += 0.005 + currentRotationY * 0.01;
    
    // Render
    renderer.render(scene, camera);
  }
  
  // Custom mouse interaction variables
  let isMouseDown = false;
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  
  // Click interaction setup
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let activeMarker = null;
  let isInfoPanelOpen = false;
  
  // Click handler
  function onCanvasClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);
    
    if (intersects.length > 0) {
      const clickedMarker = intersects[0].object;
      showInfo(clickedMarker);
    }
  }
  
  // Show info panel
  function showInfo(marker) {
    activeMarker = marker;
    isInfoPanelOpen = true;
    
    // Create scanning ring effect
    createScanningRing(marker.position, marker.userData.color);
    
    // Use info panel controller
    if (window.infoPanelController) {
      window.infoPanelController.showPanel(marker.userData);
    }
    
    console.log('Showing info for:', marker.userData.name);
  }
  
  // Scanning ring effect
  function createScanningRing(position, color) {
    const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene.add(ring);
    
    // Simple ring animation
    let scale = 1;
    let opacity = 0.8;
    
    function animateRing() {
      scale += 0.1;
      opacity -= 0.02;
      
      ring.scale.setScalar(scale);
      ringMaterial.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animateRing);
      } else {
        scene.remove(ring);
      }
    }
    
    animateRing();
  }
  
  // Add mouse interaction event listeners
  renderer.domElement.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  });
  
  renderer.domElement.addEventListener('mouseup', () => {
    isMouseDown = false;
  });
  
  // Add click event listener
  renderer.domElement.addEventListener('click', onCanvasClick);
  
  // Start animation
  animate();
  
  console.log('Globe with interactions ready!');
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
});
