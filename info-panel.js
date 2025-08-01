// Futuristic Info Panel Controller with glassmorphic design
class InfoPanelController {
  constructor() {
    this.isOpen = false;
    this.currentAI = null;
    this.panel = null;
    this.globe = null;
    this.init();
  }

  init() {
    this.createPanel();
    this.bindEvents();
    this.globe = document.querySelector('#globe-canvas');
  }

  createPanel() {
    this.panel = document.getElementById('ai-info-panel');
    this.closeBtn = document.getElementById('closeAiInfoPanelBtn');
    this.isVisible = false;
    this.isAnimating = false;
  }

  bindEvents() {
    // Bind event listeners
    this.closeBtn.addEventListener('click', () => this.hidePanel());
    
    // Theme mapping for different AI types
    this.themeMap = {
      'wildlife': 'theme-wildlife',
      'marine': 'theme-marine', 
      'climate': 'theme-climate',
      'forest': 'theme-forest',
      'satellite': 'theme-satellite',
      'air-quality': 'theme-air-quality'
    };
    
    // Domain-specific AI data with custom visuals and real-world content
    this.aiSystemData = {
      'wildlife-ai': {
        title: 'Wildlife AI',
        subtitle: 'Protecting Earth\'s Wildlife',
        description: 'Advanced AI system monitoring real-time wildlife data from drones and cameras, using computer vision to detect species and threats across global ecosystems.',
        headerImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=400&fit=crop',
        icon: '🐾',
        accentColor: '#00ff88',
        theme: 'wildlife',
        features: [
          'Species detection from camera traps',
          'Real-time threat prediction',
          'Poaching alert systems',
          'Migration pattern analysis'
        ],
        stats: [
          { value: '95%', label: 'Detection Rate' },
          { value: '24/7', label: 'Monitoring' },
          { value: '150+', label: 'Species Tracked' }
        ]
      },
      'climate-ai': {
        title: 'Climate AI',
        subtitle: 'Monitoring Global Climate Patterns',
        description: 'Satellite-powered AI analyzing temperature anomalies, weather patterns, and climate change indicators to provide early warning systems for environmental threats.',
        headerImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        icon: '🌡️',
        accentColor: '#ff6b2e',
        theme: 'climate',
        features: [
          'Climate pattern prediction',
          'CO₂ & methane trend modeling',
          'Deforestation impact forecasts',
          'Temperature anomaly detection'
        ],
        stats: [
          { value: '99.2%', label: 'Accuracy' },
          { value: '2.1°C', label: 'Temp Change' },
          { value: '415ppm', label: 'CO₂ Level' }
        ]
      },
      'marine-ai': {
        title: 'Marine AI',
        subtitle: 'Ocean Ecosystem Protection',
        description: 'Underwater sensor networks and satellite monitoring systems tracking marine life, pollution levels, and coral reef health across global ocean systems.',
        headerImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        icon: '🐬',
        accentColor: '#00e5ff',
        theme: 'marine',
        features: [
          'Ocean pollution detection',
          'Marine migration tracking',
          'Coral bleaching alerts',
          'Plastic waste monitoring'
        ],
        stats: [
          { value: '97%', label: 'Ocean Coverage' },
          { value: '24/7', label: 'Monitoring' },
          { value: '500+', label: 'Marine Species' }
        ]
      },
      'forest-ai': {
        title: 'Forest AI',
        subtitle: 'Global Forest Conservation',
        description: 'Satellite and drone-based monitoring of forest canopy health, deforestation activities, and biodiversity tracking across critical forest ecosystems worldwide.',
        headerImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        icon: '🌲',
        accentColor: '#009f3f',
        theme: 'forest',
        features: [
          'Canopy health via satellite',
          'Logging activity alerts',
          'Biodiversity index per zone',
          'Carbon sequestration tracking'
        ],
        stats: [
          { value: '92%', label: 'Forest Coverage' },
          { value: '15min', label: 'Update Frequency' },
          { value: '1M+', label: 'Trees Monitored' }
        ]
      },
      'satellite-ai': {
        title: 'Satellite AI',
        subtitle: 'Space-Based Earth Monitoring',
        description: 'Advanced satellite constellation providing real-time Earth observation, environmental monitoring, and predictive analytics for global sustainability initiatives.',
        headerImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop',
        icon: '🛰️',
        accentColor: '#ff6600',
        theme: 'satellite',
        features: [
          'Global Earth observation',
          'Environmental change detection',
          'Disaster prediction systems',
          'Agricultural monitoring'
        ],
        stats: [
          { value: '50+', label: 'Satellites' },
          { value: '1m', label: 'Resolution' },
          { value: '100%', label: 'Earth Coverage' }
        ]
      },
      'air-quality-ai': {
        title: 'Air Quality AI',
        subtitle: 'Atmospheric Health Monitoring',
        description: 'Real-time air quality monitoring network analyzing pollution levels, particulate matter, and atmospheric conditions to protect public health and environment.',
        headerImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        icon: '💨',
        accentColor: '#ff0088',
        theme: 'air-quality',
        features: [
          'PM2.5 & PM10 monitoring',
          'Pollution source tracking',
          'Health impact predictions',
          'Air quality forecasting'
        ],
        stats: [
          { value: '1000+', label: 'Sensors' },
          { value: '5min', label: 'Updates' },
          { value: '99%', label: 'Accuracy' }
        ]
      }
    };
        ]
      },
      'satellite-ai': {
        features: ['Global Coverage', 'Multi-spectral Analysis', 'Change Detection', 'Real-time Processing'],
        impact: [
          { value: '100%', label: 'Global Coverage' },
          { value: '<1min', label: 'Processing Time' }
        ]
      },
      'air-quality-ai': {
        features: ['Real-time Monitoring', 'Pollution Tracking', 'Health Alerts', 'Atmospheric Modeling'],
        impact: [
          { value: '99.5%', label: 'Sensor Accuracy' },
          { value: '24/7', label: 'Air Monitoring' }
        ]
      }
    };
  }
  
  showPanel(aiData) {
    if (this.isAnimating) return;
    
    // If panel is already visible, swap content dynamically
    if (this.isVisible && this.currentAI && this.currentAI.id !== aiData.id) {
      this.swapContent(aiData);
      return;
    }
    
    // If panel is not visible, show it for the first time
    if (!this.isVisible) {
      this.currentAI = aiData;
      this.isAnimating = true;
      
      // Apply dynamic theme based on AI type
      this.applyTheme(aiData);
      
      // Populate panel content
      this.populatePanel(aiData);
      
      // Animate Earth (shrink and shift right)
      this.animateEarth(true);
      
      // Show panel with cinematic slide-in animation
      this.panel.classList.add('visible');
      this.isVisible = true;
      
      // Cinematic entrance animation with layered depth
      gsap.timeline({
        onComplete: () => { this.isAnimating = false; }
      })
      .fromTo(this.panel, 
        { x: -100, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.ai-info-panel-header', 
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4'
      )
      .fromTo('.ai-info-panel-content > *', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3'
  
  // Get domain-specific data for this AI system
  const systemData = this.aiSystemData[aiData.id] || this.aiSystemData['wildlife-ai'];
    })
    .to('.ai-info-panel-header', 
      { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }
    )
    .to('.ai-info-panel-content > *', 
      { y: -15, opacity: 0, duration: 0.25, stagger: 0.05, ease: 'power2.in' }, '-=0.2'
    );
  }
  
  hidePanel() {
    if (!this.isVisible || this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Animate Earth back to original position (centered)
    this.animateEarth(false);
    
    // Cinematic hide animation with layered depth
    gsap.timeline({
      onComplete: () => {
        this.panel.classList.remove('visible');
        this.clearTheme();
        this.isVisible = false;
        this.currentAI = null;
        this.isAnimating = false;
      }
    })
    .to('.ai-info-panel-content > *', 
      { y: -20, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }
    )
    .to('.ai-info-panel-header', 
      { y: -30, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2'
    )
    .to(this.panel, {
      x: -100,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'power3.in'
    }, '-=0.3');
  }
  
  applyTheme(aiData) {
    // Clear existing themes
    this.clearTheme();
    
    // Determine theme based on AI name/type
    let themeClass = 'theme-climate'; // default
    
    if (aiData.name.toLowerCase().includes('wildlife') || aiData.emoji === '🐅') {
      themeClass = 'theme-wildlife';
    } else if (aiData.name.toLowerCase().includes('marine') || aiData.emoji === '🐋') {
      themeClass = 'theme-marine';
    } else if (aiData.name.toLowerCase().includes('forest') || aiData.emoji === '🌳') {
      themeClass = 'theme-forest';
    } else if (aiData.name.toLowerCase().includes('satellite') || aiData.emoji === '🛰️') {
      themeClass = 'theme-satellite';
    }
    
    // Apply theme class
    this.panel.classList.add(themeClass);
  }
  
  clearTheme() {
    // Remove all theme classes
    Object.values(this.themeMap).forEach(theme => {
      this.panel.classList.remove(theme);
    });
  }
  
  populatePanel(aiData) {
    // Basic info
    document.getElementById('aiPanelEmoji').textContent = aiData.emoji;
    document.getElementById('aiPanelTitle').textContent = aiData.name;
    document.getElementById('aiPanelDescription').textContent = aiData.description;
    document.getElementById('aiPanelExtended').textContent = aiData.extendedInfo;
    
    // Get enhanced data for this AI
    const enhanced = this.enhancedData[aiData.id] || this.enhancedData['climate-ai'];
    
    // Populate features
    const featuresContainer = document.getElementById('aiPanelFeatures');
    if (featuresContainer) {
      featuresContainer.innerHTML = enhanced.features
        .map(feature => `<span class="feature-tag">${feature}</span>`)
        .join('');
    }
    
    // Populate impact metrics
    const metricsContainer = document.getElementById('aiPanelMetrics');
    if (metricsContainer) {
      metricsContainer.innerHTML = enhanced.impact
        .map(metric => `
          <div class="impact-item">
            <div class="impact-value">${metric.value}</div>
            <div class="impact-label">${metric.label}</div>
          </div>
        `).join('');
    }
  }
  
  animateEarth(shrink) {
    const globeContainer = document.getElementById('globe-container');
    
    if (shrink) {
      // Shrink and shift right
      gsap.to(globeContainer, {
        scale: 0.7,
        x: 200,
        duration: 0.8,
        ease: 'power2.out'
      });
    } else {
      // Return to original size and position
      gsap.to(globeContainer, {
        scale: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }
}

// Initialize the info panel controller
const infoPanelController = new InfoPanelController();

// Export for use in globe.js
window.infoPanelController = infoPanelController;
