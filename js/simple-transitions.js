// Simple and Stable Page Transition System
class SimpleTransitions {
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
    if (!document.getElementById('simple-transition-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'simple-transition-overlay';
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
        transition: opacity 0.3s ease;
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
          this.transitionToPage(href);
        }
      });
    });
  }

  transitionToPage(href) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const overlay = document.getElementById('simple-transition-overlay');
    
    // Show overlay
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    
    // Navigate after short delay
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  // Method to trigger transition manually
  triggerTransition() {
    const overlay = document.getElementById('simple-transition-overlay');
    if (overlay) {
      overlay.style.display = 'block';
      overlay.style.opacity = '1';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    new SimpleTransitions();
  } catch (error) {
    console.error('Transition system error:', error);
    // Fallback: just let normal navigation work
  }
});

// Export for debugging
window.SimpleTransitions = SimpleTransitions;
