// Simple Smooth Transitions - No SPA, No Freeze
class SmoothTransitions {
  constructor() {
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.setupTransitionOverlay();
    this.bindNavigation();
    this.preventWhiteFlash();
  }

  preventWhiteFlash() {
    // Set background immediately
    document.documentElement.style.backgroundColor = '#0e1116';
    document.body.style.backgroundColor = '#0e1116';
  }

  setupTransitionOverlay() {
    // Create overlay if not exists
    if (!document.getElementById('smooth-transition-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'smooth-transition-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0e1116;
        z-index: 9999;
        opacity: 0;
        display: none;
        pointer-events: none;
        transition: opacity 0.4s ease;
      `;
      document.body.appendChild(overlay);
    }
  }

  bindNavigation() {
    const navLinks = document.querySelectorAll('nav a[href$=".html"], a[href$=".html"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        if (!this.isTransitioning) {
          this.smoothNavigate(href);
        }
      });
    });
  }

  smoothNavigate(href) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const overlay = document.getElementById('smooth-transition-overlay');
    
    // Show overlay with smooth fade
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    
    // Navigate after smooth transition
    setTimeout(() => {
      window.location.href = href;
    }, 250);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    new SmoothTransitions();
  } catch (error) {
    console.error('Smooth transitions error:', error);
    // Fallback: just let normal navigation work
  }
});

// Export for debugging
window.SmoothTransitions = SmoothTransitions;
