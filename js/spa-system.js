// Single Page Application System - No Page Reload
class SPASystem {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.pages = {
      home: 'index.html',
      blog: 'blog.html', 
      cv: 'cv.html',
      contact: 'contact.html'
    };
    this.contentCache = new Map();
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.setupPageStructure();
    this.bindNavigation();
    this.loadInitialContent();
    this.setupHistoryAPI();
  }

  setupPageStructure() {
    // Create main content container
    const mainContent = document.createElement('div');
    mainContent.id = 'spa-content';
    mainContent.className = 'spa-content';
    
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'spa-transition-overlay';
    overlay.className = 'spa-transition-overlay';
    
    // Insert into body
    document.body.appendChild(mainContent);
    document.body.appendChild(overlay);
  }

  bindNavigation() {
    const navLinks = document.querySelectorAll('nav a[href$=".html"], a[href$=".html"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const targetPage = this.getPageFromHref(href);
        
        if (targetPage !== this.currentPage && !this.isTransitioning) {
          this.navigateToPage(targetPage, href);
        }
      });
    });
  }

  setupHistoryAPI() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.currentPage = e.state.page;
        this.loadPageContent(e.state.page, false);
      }
    });
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('blog.html')) return 'blog';
    if (path.includes('cv.html')) return 'cv';
    if (path.includes('contact.html')) return 'contact';
    return 'home';
  }

  getPageFromHref(href) {
    if (href.includes('blog.html')) return 'blog';
    if (href.includes('cv.html')) return 'cv';
    if (href.includes('contact.html')) return 'contact';
    return 'home';
  }

  async navigateToPage(targetPage, href) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const direction = this.getTransitionDirection(targetPage);
    
    // Start transition
    await this.startTransition(direction);
    
    // Load new content
    await this.loadPageContent(targetPage, true);
    
    // Update current page
    this.currentPage = targetPage;
    
    // Update URL and history
    this.updateURL(href, targetPage);
    
    // End transition
    await this.endTransition();
    
    this.isTransitioning = false;
  }

  getTransitionDirection(targetPage) {
    const pageOrder = ['home', 'blog', 'cv', 'contact'];
    const currentIndex = pageOrder.indexOf(this.currentPage);
    const targetIndex = pageOrder.indexOf(targetPage);
    
    return targetIndex > currentIndex ? 'slide-left' : 'slide-right';
  }

  async startTransition(direction) {
    const overlay = document.getElementById('spa-transition-overlay');
    const content = document.getElementById('spa-content');
    
    // Add transitioning class to content
    content.classList.add('transitioning');
    
    // Show overlay with direction
    overlay.className = `spa-transition-overlay ${direction}`;
    overlay.style.display = 'block';
    
    // Wait for transition to complete
    return new Promise(resolve => {
      setTimeout(resolve, 600);
    });
  }

  async endTransition() {
    const overlay = document.getElementById('spa-transition-overlay');
    const content = document.getElementById('spa-content');
    
    // Hide overlay
    overlay.style.display = 'none';
    overlay.className = 'spa-transition-overlay';
    
    // Remove transitioning class
    content.classList.remove('transitioning');
    
    // Wait for cleanup
    return new Promise(resolve => {
      setTimeout(resolve, 200);
    });
  }

  async loadPageContent(pageName, animate = true) {
    const content = document.getElementById('spa-content');
    
    // Check cache first
    if (this.contentCache.has(pageName)) {
      this.updateContent(content, this.contentCache.get(pageName), animate);
      return;
    }
    
    // Load from server
    try {
      const response = await fetch(this.pages[pageName]);
      const html = await response.text();
      
      // Parse HTML and extract main content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mainContent = doc.querySelector('main');
      
      if (mainContent) {
        // Cache the content
        this.contentCache.set(pageName, mainContent.innerHTML);
        
        // Update content
        this.updateContent(content, mainContent.innerHTML, animate);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      // Fallback to normal navigation
      window.location.href = this.pages[pageName];
    }
  }

  updateContent(container, html, animate) {
    if (animate) {
      // Fade out current content
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        // Update content
        container.innerHTML = html;
        
        // Fade in new content
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 300);
    } else {
      // Direct update without animation
      container.innerHTML = html;
    }
  }

  updateURL(href, pageName) {
    // Update browser URL without reload
    history.pushState({ page: pageName }, '', href);
    
    // Update page title
    const titles = {
      home: 'Blog Lập Trình Mạng — Trang Chủ',
      blog: 'Blog Lập Trình Mạng — Bài viết',
      cv: 'CV — Huỳnh Tấn Đạt',
      contact: 'Liên hệ — Huỳnh Tấn Đạt'
    };
    
    document.title = titles[pageName] || document.title;
  }

  async loadInitialContent() {
    // Load current page content
    await this.loadPageContent(this.currentPage, false);
  }

  // Method to preload pages
  preloadPage(pageName) {
    if (!this.contentCache.has(pageName)) {
      fetch(this.pages[pageName])
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const mainContent = doc.querySelector('main');
          if (mainContent) {
            this.contentCache.set(pageName, mainContent.innerHTML);
          }
        })
        .catch(error => console.error('Preload error:', error));
    }
  }
}

// Initialize SPA system
document.addEventListener('DOMContentLoaded', () => {
  const spa = new SPASystem();
  
  // Preload pages on hover
  const navLinks = document.querySelectorAll('nav a[href$=".html"]');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      const pageName = spa.getPageFromHref(href);
      spa.preloadPage(pageName);
    });
  });
  
  // Export for debugging
  window.spa = spa;
});
