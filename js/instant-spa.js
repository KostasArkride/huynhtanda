// Instant SPA System - No Loading, Smooth Transitions
class InstantSPA {
  constructor() {
    this.pages = {
      home: 'index.html',
      blog: 'blog.html',
      cv: 'cv.html',
      contact: 'contact.html'
    };
    this.currentPage = this.getCurrentPage();
    this.contentCache = new Map();
    this.isTransitioning = false;
    this.init();
  }

  async init() {
    this.setupPageStructure();
    this.bindNavigation();
    await this.preloadAllPages();
    this.loadInitialContent();
    this.setupHistoryAPI();
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

  setupPageStructure() {
    // Create main content container
    const mainContent = document.createElement('div');
    mainContent.id = 'instant-spa-content';
    mainContent.className = 'instant-spa-content';
    
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'instant-spa-overlay';
    overlay.className = 'instant-spa-overlay';
    
    // Insert into body
    document.body.appendChild(mainContent);
    document.body.appendChild(overlay);
  }

  async preloadAllPages() {
    const promises = Object.entries(this.pages).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('main');
        if (mainContent) {
          this.contentCache.set(name, mainContent.innerHTML);
        }
      } catch (error) {
        console.error(`Error preloading ${name}:`, error);
      }
    });
    
    await Promise.all(promises);
    console.log('All pages preloaded successfully');
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

  navigateToPage(targetPage, href) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const direction = this.getTransitionDirection(targetPage);
    
    // Start transition
    this.startTransition(direction);
    
    // Load content (should be instant from cache)
    this.loadPageContent(targetPage, true);
    
    // Update current page
    this.currentPage = targetPage;
    
    // Update URL
    this.updateURL(href, targetPage);
    
    // End transition
    setTimeout(() => {
      this.endTransition();
      this.isTransitioning = false;
    }, 600);
  }

  getTransitionDirection(targetPage) {
    const pageOrder = ['home', 'blog', 'cv', 'contact'];
    const currentIndex = pageOrder.indexOf(this.currentPage);
    const targetIndex = pageOrder.indexOf(targetPage);
    
    return targetIndex > currentIndex ? 'slide-left' : 'slide-right';
  }

  startTransition(direction) {
    const overlay = document.getElementById('instant-spa-overlay');
    const content = document.getElementById('instant-spa-content');
    
    // Add transitioning class
    content.classList.add('transitioning');
    
    // Show overlay with direction
    overlay.className = `instant-spa-overlay ${direction}`;
    overlay.style.display = 'block';
  }

  endTransition() {
    const overlay = document.getElementById('instant-spa-overlay');
    const content = document.getElementById('instant-spa-content');
    
    // Hide overlay
    overlay.style.display = 'none';
    overlay.className = 'instant-spa-overlay';
    
    // Remove transitioning class
    content.classList.remove('transitioning');
  }

  loadPageContent(pageName, animate = true) {
    const content = document.getElementById('instant-spa-content');
    const cachedContent = this.contentCache.get(pageName);
    
    if (cachedContent) {
      this.updateContent(content, cachedContent, animate);
    } else {
      console.error(`Content not found for page: ${pageName}`);
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
      }, 200);
    } else {
      // Direct update
      container.innerHTML = html;
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
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

  loadInitialContent() {
    // Load current page content
    this.loadPageContent(this.currentPage, false);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const spa = new InstantSPA();
    window.instantSPA = spa; // For debugging
  } catch (error) {
    console.error('SPA initialization error:', error);
    // Fallback to normal navigation
  }
});
