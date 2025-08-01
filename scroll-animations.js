// Scroll-triggered animations for globe section
document.addEventListener('DOMContentLoaded', function() {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Add staggered animation for globe elements
        if (entry.target.classList.contains('globe-section')) {
          animateGlobeElements();
        }
      }
    });
  }, observerOptions);

  // Observe globe section elements
  const globeSection = document.querySelector('.globe-section');
  const globeHeader = document.querySelector('.globe-header');
  const globeContainer = document.querySelector('.globe-container');

  if (globeSection) observer.observe(globeSection);
  if (globeHeader) observer.observe(globeHeader);
  if (globeContainer) observer.observe(globeContainer);

  // Animate globe elements with staggered timing
  function animateGlobeElements() {
    // Animate globe canvas with scale and fade
    const globeCanvas = document.getElementById('globe-canvas');
    if (globeCanvas) {
      setTimeout(() => {
        globeCanvas.style.transform = 'scale(1)';
        globeCanvas.style.opacity = '1';
      }, 300);
    }

    // Animate dashboard card
    const dashboardCard = document.querySelector('.dashboard-card');
    if (dashboardCard) {
      setTimeout(() => {
        dashboardCard.classList.add('animate-in');
      }, 600);
    }
  }

  // Add smooth scroll behavior for better UX
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
