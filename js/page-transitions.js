// Page Transition System with Motion Blur
class PageTransition {
  constructor() {
    this.isTransitioning = false;
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  init() {
    // Prevent white flash
    this.preventWhiteFlash();
    
    // Add page content wrapper
    this.wrapPageContent();
    
    // Add transition overlay
    this.addTransitionOverlay();
    
    // Bind navigation links
    this.bindNavigationLinks();
    
    // Handle browser back/forward
    this.bindBrowserNavigation();
  }

  preventWhiteFlash() {
    // Set background color immediately
    document.documentElement.style.backgroundColor = '#0e1116';
    document.body.style.backgroundColor = '#0e1116';
    
    // Preload critical styles
    const style = document.createElement('style');
    style.textContent = `
      html, body { 
        background: #0e1116 !important; 
        color: #e6edf3 !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('blog.html')) return 'blog';
    if (path.includes('cv.html')) return 'cv';
    if (path.includes('contact.html')) return 'contact';
    return 'home';
  }

  wrapPageContent() {
    const body = document.body;
    const content = Array.from(body.children);
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'page-content';
    
    // Move all content to wrapper
    content.forEach(child => {
      if (!child.classList.contains('page-transition')) {
        wrapper.appendChild(child);
      }
    });
    
    body.appendChild(wrapper);
  }

  addTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.id = 'page-transition-overlay';
    
    // Set initial styles to prevent flash
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
      background: #0e1116;
      opacity: 0;
      display: none;
      will-change: transform, opacity;
    `;
    
    document.body.appendChild(overlay);
  }

  bindNavigationLinks() {
    const navLinks = document.querySelectorAll('nav a[href$=".html"], a[href$=".html"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const targetPage = this.getPageFromHref(href);
        
        if (targetPage !== this.currentPage && !this.isTransitioning) {
          this.transitionToPage(href, targetPage);
        }
      });
    });
  }

  bindBrowserNavigation() {
    window.addEventListener('popstate', (e) => {
      if (!this.isTransitioning) {
        this.currentPage = this.getCurrentPage();
        this.playTransition('slide-right');
      }
    });
  }

  getPageFromHref(href) {
    if (href.includes('blog.html')) return 'blog';
    if (href.includes('cv.html')) return 'cv';
    if (href.includes('contact.html')) return 'contact';
    return 'home';
  }

  getTransitionDirection(targetPage) {
    const pageOrder = ['home', 'blog', 'cv', 'contact'];
    const currentIndex = pageOrder.indexOf(this.currentPage);
    const targetIndex = pageOrder.indexOf(targetPage);
    
    return targetIndex > currentIndex ? 'slide-left' : 'slide-right';
  }

  transitionToPage(href, targetPage) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const direction = this.getTransitionDirection(targetPage);
    
    // Add transitioning class to content
    const content = document.querySelector('.page-content');
    if (content) {
      content.classList.add('transitioning');
    }
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      // Play transition animation
      this.playTransition(direction, () => {
        // Navigate to new page
        window.location.href = href;
      });
    }, 50);
  }

  playTransition(direction, callback) {
    const overlay = document.getElementById('page-transition-overlay');
    
    // Reset overlay
    overlay.className = 'page-transition';
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    
    // Add direction class with smooth transition
    requestAnimationFrame(() => {
      overlay.classList.add(direction);
      overlay.style.opacity = '1';
    });
    
    // Clean up after animation
    setTimeout(() => {
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.className = 'page-transition';
        
        if (callback) {
          callback();
        } else {
          this.isTransitioning = false;
          const content = document.querySelector('.page-content');
          if (content) {
            content.classList.remove('transitioning');
          }
        }
      }, 200);
    }, 1000);
  }

  // Method to trigger transition programmatically
  triggerTransition(direction) {
    if (!this.isTransitioning) {
      this.playTransition(direction);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Use requestIdleCallback for better performance
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      new PageTransition();
    });
  } else {
    setTimeout(() => {
      new PageTransition();
    }, 0);
  }
});

// Preload next page on hover for smoother transitions
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a[href$=".html"]');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      // Preload the page
      const linkElement = document.createElement('link');
      linkElement.rel = 'prefetch';
      linkElement.href = link.href;
      document.head.appendChild(linkElement);
    });
  });
});

// Export for potential external use
window.PageTransition = PageTransition;
