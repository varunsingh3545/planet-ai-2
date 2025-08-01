// Futuristic 3D Dashboard Enhancement
// Adds glassmorphic data cards, neon orbits, AI icons, and cosmic effects
console.log('Loading 3D Dashboard enhancements...');

class FuturisticDashboard {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.dashboardElements = new THREE.Group();
    this.dataCards = [];
    this.neonOrbits = [];
    this.aiIcons = [];
    this.flowingLines = [];
    this.time = 0;
    
    this.init();
  }

  init() {
    this.createGlassmorphicCards();
    this.createNeonOrbits();
    this.createInteractiveAIIcons();
    this.createFlowingDataLines();
    this.createCosmicParticles();
    
    this.scene.add(this.dashboardElements);
    this.animate();
  }

  createGlassmorphicCards() {
    const cardData = [
      { title: 'AI Systems', value: '47', unit: 'Active', color: 0x00ffff, position: [-8, 4, 2] },
      { title: 'Data Flow', value: '2.4TB', unit: '/sec', color: 0x8a2be2, position: [8, 3, 1] },
      { title: 'Conservation', value: '89%', unit: 'Efficiency', color: 0x00ff7f, position: [-7, -3, 3] },
      { title: 'Global Reach', value: '156', unit: 'Countries', color: 0xff6b6b, position: [7, -2, 2] },
      { title: 'Processing', value: '12.8M', unit: 'Operations', color: 0xffd700, position: [0, 6, 4] }
    ];

    cardData.forEach((data, index) => {
      const cardGroup = new THREE.Group();
      
      // Glassmorphic card background
      const cardGeometry = new THREE.PlaneGeometry(3, 2, 1, 1);
      const cardMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        side: THREE.DoubleSide
      });
      
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      cardGroup.add(card);
      
      // Glowing border
      const borderGeometry = new THREE.EdgesGeometry(cardGeometry);
      const borderMaterial = new THREE.LineBasicMaterial({ 
        color: data.color,
        transparent: true,
        opacity: 0.6
      });
      const border = new THREE.LineSegments(borderGeometry, borderMaterial);
      cardGroup.add(border);
      
      // Glow effect
      const glowGeometry = new THREE.PlaneGeometry(3.2, 2.2);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.z = -0.01;
      cardGroup.add(glow);
      
      // Position and rotation
      cardGroup.position.set(...data.position);
      cardGroup.rotation.x = Math.random() * 0.3 - 0.15;
      cardGroup.rotation.y = Math.random() * 0.3 - 0.15;
      
      // Store for animation
      cardGroup.userData = { 
        originalPosition: [...data.position],
        floatOffset: Math.random() * Math.PI * 2,
        glowMaterial: glowMaterial,
        borderMaterial: borderMaterial,
        baseColor: data.color
      };
      
      this.dataCards.push(cardGroup);
      this.dashboardElements.add(cardGroup);
    });
  }

  createNeonOrbits() {
    const orbitConfigs = [
      { radius: 6, color: 0x00ffff, speed: 0.01, tilt: 0.2 },
      { radius: 8, color: 0x8a2be2, speed: -0.008, tilt: -0.3 },
      { radius: 10, color: 0x00ff7f, speed: 0.006, tilt: 0.1 },
      { radius: 12, color: 0xff6b6b, speed: -0.004, tilt: -0.15 }
    ];

    orbitConfigs.forEach((config, index) => {
      const orbitGroup = new THREE.Group();
      
      // Create orbit ring
      const orbitGeometry = new THREE.RingGeometry(config.radius - 0.02, config.radius + 0.02, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2 + config.tilt;
      orbitGroup.add(orbit);
      
      // Create moving particles on orbit
      for (let i = 0; i < 8; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        particle.position.x = Math.cos(angle) * config.radius;
        particle.position.z = Math.sin(angle) * config.radius;
        particle.userData = { angle: angle, radius: config.radius };
        
        orbitGroup.add(particle);
      }
      
      orbitGroup.userData = { 
        speed: config.speed,
        tilt: config.tilt,
        particles: orbitGroup.children.slice(1)
      };
      
      this.neonOrbits.push(orbitGroup);
      this.dashboardElements.add(orbitGroup);
    });
  }

  createInteractiveAIIcons() {
    const iconPositions = [
      [-6, 2, 5], [6, 1, 4], [-4, -4, 6], [5, -3, 3], [0, 5, 7]
    ];
    
    const iconColors = [0x00ffff, 0x8a2be2, 0x00ff7f, 0xff6b6b, 0xffd700];

    iconPositions.forEach((position, index) => {
      const iconGroup = new THREE.Group();
      
      // Core icon geometry
      const coreGeometry = new THREE.OctahedronGeometry(0.3);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: iconColors[index],
        transparent: true,
        opacity: 0.8
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      iconGroup.add(core);
      
      iconGroup.position.set(...position);
      iconGroup.userData = {
        originalPosition: [...position]
      };
      
      this.aiIcons.push(iconGroup);
      this.dashboardElements.add(iconGroup);
    });
  }

  createFlowingDataLines() {
    // Create flowing data connections
    for (let i = 0; i < 8; i++) {
      const points = [];
      const startRadius = 4 + Math.random() * 6;
      const endRadius = 4 + Math.random() * 6;
      
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = Math.random() * Math.PI * 2;
      
      const startX = Math.cos(startAngle) * startRadius;
      const startZ = Math.sin(startAngle) * startRadius;
      const endX = Math.cos(endAngle) * endRadius;
      const endZ = Math.sin(endAngle) * endRadius;
      
      for (let j = 0; j <= 10; j++) {
        const t = j / 10;
        const x = startX + (endX - startX) * t;
        const y = Math.sin(t * Math.PI) * 2;
        const z = startZ + (endZ - startZ) * t;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: [0x00ffff, 0x8a2be2, 0x00ff7f][i % 3],
        transparent: true,
        opacity: 0.4
      });
      
      const line = new THREE.Line(geometry, material);
      this.flowingLines.push(line);
      this.dashboardElements.add(line);
    }
  }

  createCosmicParticles() {
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(geometry, material);
    this.dashboardElements.add(particles);
  }

  animate() {
    this.time += 0.01;
    
    // Animate floating cards
    this.dataCards.forEach((card, index) => {
      const userData = card.userData;
      card.position.y = userData.originalPosition[1] + Math.sin(this.time + userData.floatOffset) * 0.3;
      
      const pulseIntensity = 0.1 + Math.sin(this.time * 2 + index) * 0.05;
      userData.glowMaterial.opacity = pulseIntensity;
    });
    
    // Animate neon orbits
    this.neonOrbits.forEach(orbit => {
      orbit.rotation.y += orbit.userData.speed;
      
      orbit.userData.particles.forEach(particle => {
        particle.userData.angle += orbit.userData.speed * 2;
        particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
        particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;
      });
    });
    
    // Animate AI icons
    this.aiIcons.forEach((icon, index) => {
      icon.position.y = icon.userData.originalPosition[1] + Math.sin(this.time * 1.5 + index) * 0.2;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Export for use in other files
window.FuturisticDashboard = FuturisticDashboard;
