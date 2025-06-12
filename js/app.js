/**
 * ShoreSquad Web Application
 * Modern JavaScript features for enhanced interactivity and performance
 * Follows UX principles: Progressive Enhancement, Accessibility, Performance
 */

// ==========================================================================
// Application State Management
// ==========================================================================
class ShoreSquadApp {
  constructor() {
    this.state = {
      isLoading: false,
      currentUser: null,
      events: [],
      filters: {
        active: 'all',
        location: null,
        date: null
      },
      ui: {
        mobileMenuOpen: false,
        currentTestimonial: 0,
        animationQueue: []
      }
    };
    
    this.init();
  }

  // Initialize application
  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupPerformanceOptimizations();
    this.loadInitialData();
    this.setupAccessibilityFeatures();
    this.announceToScreenReader('ShoreSquad application loaded');
  }

  // ==========================================================================
  // Event Listeners & DOM Interactions
  // ==========================================================================
  setupEventListeners() {
    // Navigation
    this.setupNavigation();
    
    // Hero interactions
    this.setupHeroAnimations();
    
    // Form handling
    this.setupContactForm();
    
    // Event filters
    this.setupEventFilters();
    
    // Scroll interactions
    this.setupScrollEffects();
    
    // Button interactions
    this.setupButtonEffects();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Next cleanup actions
    this.setupCleanupActions();
  }

  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.state.ui.mobileMenuOpen) {
          this.toggleMobileMenu();
        }
      });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.smoothScrollTo(link.getAttribute('href'));
        });
      }
    });

    // Update navbar on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', 
      this.throttle(() => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        navbar.classList.toggle('scrolled', currentScrollY > 50);
        
        // Hide/show navbar based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
      }, 16)
    );
  }

  toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    this.state.ui.mobileMenuOpen = !this.state.ui.mobileMenuOpen;
    
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', this.state.ui.mobileMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.state.ui.mobileMenuOpen ? 'hidden' : '';
  }

  // ==========================================================================
  // Hero Section Animations
  // ==========================================================================
  setupHeroAnimations() {
    // Animated counter for statistics
    this.setupCounterAnimations();
    
    // Hero action buttons
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    heroButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.getAttribute('data-action');
        this.handleHeroAction(action, e);
      });
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(counter, 0, target, duration);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }

  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOutCubic);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  handleHeroAction(action, event) {
    event.preventDefault();
    
    switch (action) {
      case 'join-squad':
        this.showJoinModal();
        break;
      case 'find-events':
        this.smoothScrollTo('#events');
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  }

  // ==========================================================================
  // Contact Form Handling
  // ==========================================================================
  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmit(form);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  async handleContactFormSubmit(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate all fields
    const isValid = this.validateForm(form);
    if (!isValid) {
      this.announceToScreenReader('Please correct the errors in the form');
      return;
    }

    // Show loading state
    this.setFormLoading(submitButton, true);
    
    try {
      // Simulate API call
      await this.submitContactForm(formData);
      
      // Success feedback
      this.showSuccessMessage('Message sent successfully! We\'ll get back to you soon.');
      form.reset();
      
    } catch (error) {
      // Error handling
      this.showErrorMessage('Sorry, there was an error sending your message. Please try again.');
      console.error('Form submission error:', error);
      
    } finally {
      this.setFormLoading(submitButton, false);
    }
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Name validation (basic)
    else if (input.name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters long';
    }

    this.setFieldError(input, isValid ? '' : errorMessage);
    return isValid;
  }

  setFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (message) {
      formGroup.classList.add('error');
      errorElement.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorElement.id);
    } else {
      formGroup.classList.remove('error');
      errorElement.textContent = '';
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup.classList.contains('error') && input.value.trim()) {
      this.setFieldError(input, '');
    }
  }

  setFormLoading(button, isLoading) {
    button.classList.toggle('loading', isLoading);
    button.disabled = isLoading;
    
    if (isLoading) {
      this.announceToScreenReader('Sending message...');
    }
  }

  // ==========================================================================
  // Event Management System
  // ==========================================================================
  setupEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.setActiveFilter(filter);
        this.filterEvents(filter);
      });
    });
  }

  setActiveFilter(filter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    const activeButton = document.querySelector(`[data-filter="${filter}"]`);
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-pressed', 'true');
    
    this.state.filters.active = filter;
  }

  async loadInitialData() {
    this.showLoading(true);
    
    try {
      // Simulate loading events
      await this.delay(1000);
      const events = await this.fetchEvents();
      this.state.events = events;
      this.renderEvents(events);
      
    } catch (error) {
      console.error('Error loading events:', error);
      this.showErrorMessage('Failed to load events. Please refresh the page.');
      
    } finally {
      this.showLoading(false);
    }
  }

  async fetchEvents() {
    // Simulated event data
    return [
      {
        id: 1,
        title: 'Santa Monica Beach Cleanup',
        date: '2025-06-20',
        time: '09:00',
        location: 'Santa Monica, CA',
        participants: 45,
        weather: 'sunny',
        category: 'nearby'
      },
      {
        id: 2,
        title: 'Venice Beach Squad Meetup',
        date: '2025-06-21',
        time: '10:30',
        location: 'Venice, CA',
        participants: 32,
        weather: 'partly-cloudy',
        category: 'weekend'
      },
      {
        id: 3,
        title: 'Malibu Coast Conservation',
        date: '2025-06-22',
        time: '08:00',
        location: 'Malibu, CA',
        participants: 67,
        weather: 'sunny',
        category: 'weekend'
      }
    ];
  }

  filterEvents(filter) {
    let filteredEvents = this.state.events;
    
    if (filter !== 'all') {
      filteredEvents = this.state.events.filter(event => 
        event.category === filter
      );
    }
    
    this.renderEvents(filteredEvents);
    this.announceToScreenReader(`Showing ${filteredEvents.length} events for ${filter === 'all' ? 'all categories' : filter}`);
  }

  renderEvents(events) {
    const container = document.getElementById('events-grid');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = '<div class="loading">No events found for this filter.</div>';
      return;
    }

    const eventsHTML = events.map(event => `
      <article class="event-card" data-event-id="${event.id}">
        <div class="event-header">
          <div class="event-date">
            <span class="month">${this.formatDate(event.date, 'MMM')}</span>
            <span class="day">${this.formatDate(event.date, 'DD')}</span>
          </div>
          <div class="event-weather">
            <i class="fas fa-${this.getWeatherIcon(event.weather)}" title="${event.weather}"></i>
          </div>
        </div>
        <div class="event-content">
          <h3>${event.title}</h3>
          <div class="event-details">
            <div class="event-detail">
              <i class="fas fa-clock" aria-hidden="true"></i>
              <span>${event.time}</span>
            </div>
            <div class="event-detail">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>${event.location}</span>
            </div>
            <div class="event-detail">
              <i class="fas fa-users" aria-hidden="true"></i>
              <span>${event.participants} attending</span>
            </div>
          </div>
          <button class="btn btn-primary btn-small" data-action="join-event" data-event-id="${event.id}">
            Join Cleanup
          </button>
        </div>
      </article>
    `).join('');

    container.innerHTML = eventsHTML;

    // Add event listeners to new buttons
    container.querySelectorAll('[data-action="join-event"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const eventId = e.target.getAttribute('data-event-id');
        this.handleJoinEvent(eventId);
      });
    });
  }

  // ==========================================================================
  // Scroll Effects & Animations
  // ==========================================================================
  setupScrollEffects() {
    // Back to top button
    this.setupBackToTop();
    
    // Parallax and reveal animations
    this.setupScrollAnimations();
  }

  setupBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', 
      this.throttle(() => {
        const shouldShow = window.scrollY > 500;
        backToTopButton.classList.toggle('visible', shouldShow);
      }, 100)
    );

    backToTopButton.addEventListener('click', () => {
      this.smoothScrollTo('#home');
    });
  }

  setupIntersectionObserver() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Stagger animations for cards
          if (entry.target.classList.contains('feature-card')) {
            const cards = Array.from(entry.target.parentElement.children);
            const index = cards.indexOf(entry.target);
            
            setTimeout(() => {
              entry.target.style.animationDelay = `${index * 100}ms`;
            }, 0);
          }
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.feature-card, .event-card, .community-content, .section-title'
    );
    
    animatedElements.forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // Performance Optimizations
  // ==========================================================================
  setupPerformanceOptimizations() {
    // Image lazy loading (if images are added later)
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadResources();
    
    // Service worker for caching (if needed)
    this.registerServiceWorker();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  preloadResources() {
    // Preload important fonts
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600'
    ];
    
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // ==========================================================================
  // Accessibility Features
  // ==========================================================================
  setupAccessibilityFeatures() {
    // Focus management
    this.setupFocusManagement();
    
    // Screen reader announcements
    this.setupScreenReaderSupport();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Reduced motion support
    this.respectReducedMotion();
  }

  setupFocusManagement() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#main-content');
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }

    // Focus trap for modal (when implemented)
    this.setupFocusTrap();
  }

  setupKeyboardNavigation() {
    // Escape key to close modals/menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.state.ui.mobileMenuOpen) {
          this.toggleMobileMenu();
        }
        // Close any open modals
        this.closeModals();
      }
    });

    // Arrow key navigation for filter buttons
    const filterContainer = document.querySelector('.event-filters');
    if (filterContainer) {
      filterContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateFilters(e.key === 'ArrowRight' ? 1 : -1);
        }
      });
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-medium', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }

  // ==========================================================================
  // Utility Functions
  // ==========================================================================
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  smoothScrollTo(target) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
      
    if (element) {
      const offsetTop = element.offsetTop - 70; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  formatDate(dateString, format) {
    const date = new Date(dateString);
    const options = {
      'MMM': { month: 'short' },
      'DD': { day: '2-digit' }
    };
    
    return new Intl.DateTimeFormat('en-US', options[format]).format(date);
  }

  getWeatherIcon(weather) {
    const icons = {
      'sunny': 'sun',
      'partly-cloudy': 'cloud-sun',
      'cloudy': 'cloud',
      'rainy': 'cloud-rain',
      'stormy': 'bolt'
    };
    return icons[weather] || 'sun';
  }

  // ==========================================================================
  // UI State Management
  // ==========================================================================
  showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('visible', show);
      overlay.setAttribute('aria-hidden', !show);
      
      if (show) {
        this.announceToScreenReader('Loading content...');
      }
    }
  }

  showSuccessMessage(message) {
    this.showNotification(message, 'success');
  }

  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
    
    // Announce to screen readers
    this.announceToScreenReader(message);
  }

  // ==========================================================================
  // Mock API Functions
  // ==========================================================================
  async submitContactForm(formData) {
    // Simulate API call
    await this.delay(1500);
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
    
    return { success: true, message: 'Message sent successfully' };
  }

  handleJoinEvent(eventId) {
    this.showSuccessMessage(`Awesome! You've joined the cleanup event. Check your email for details.`);
    
    // Update UI to show joined state
    const button = document.querySelector(`[data-event-id="${eventId}"]`);
    if (button) {
      button.textContent = 'Joined!';
      button.classList.add('btn-success');
      button.disabled = true;
    }
  }

  showJoinModal() {
    // This would open a modal for joining the squad
    this.showSuccessMessage('Join squad feature coming soon! Follow us on social media for updates.');
  }

  // ==========================================================================
  // Next Cleanup Actions
  // ==========================================================================
  setupCleanupActions() {
    // Next cleanup buttons
    const joinCleanupButton = document.querySelector('[data-action="join-next-cleanup"]');
    const shareCleanupButton = document.querySelector('[data-action="share-cleanup"]');
    
    if (joinCleanupButton) {
      joinCleanupButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleJoinNextCleanup();
      });
    }
    
    if (shareCleanupButton) {
      shareCleanupButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleShareCleanup();
      });
    }
  }

  handleJoinNextCleanup() {
    const button = document.querySelector('[data-action="join-next-cleanup"]');
    
    // Show success feedback
    this.showSuccessMessage('Amazing! You\'re joining the Pasir Ris cleanup! Check your email for details.');
    
    // Update button state
    if (button) {
      button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> You\'re In!';
      button.classList.remove('btn-primary');
      button.classList.add('btn-success');
      button.disabled = true;
      
      // Update participant count
      const participantCount = document.querySelector('.meta-item:nth-child(3) span');
      if (participantCount) {
        const currentCount = parseInt(participantCount.textContent.match(/\d+/)[0]);
        participantCount.textContent = `${currentCount + 1} Squad Members Joining`;
      }
    }
    
    // Announce to screen readers
    this.announceToScreenReader('Successfully joined the Pasir Ris beach cleanup!');
  }

  handleShareCleanup() {
    const cleanupData = {
      title: 'Pasir Ris Beach Cleanup',
      date: 'June 15, 2025',
      time: '9:00 AM - 12:00 PM',
      location: 'Pasir Ris Beach, Singapore',
      coordinates: '1.381497, 103.955574'
    };
    
    // Try native Web Share API first
    if (navigator.share) {
      navigator.share({
        title: `Join me at ${cleanupData.title}!`,
        text: `Let's clean up ${cleanupData.location} together on ${cleanupData.date} at ${cleanupData.time}. Join the ShoreSquad!`,
        url: window.location.href
      }).then(() => {
        this.showSuccessMessage('Cleanup shared successfully!');
      }).catch(() => {
        this.fallbackShare(cleanupData);
      });
    } else {
      this.fallbackShare(cleanupData);
    }
  }

  fallbackShare(cleanupData) {
    // Fallback sharing options
    const shareText = `Join me at ${cleanupData.title} on ${cleanupData.date}! Let's clean up ${cleanupData.location} together. 🌊♻️ #ShoreSquad ${window.location.href}`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showSuccessMessage('Cleanup details copied to clipboard! Share with your squad!');
      }).catch(() => {
        this.showTextShareModal(shareText);
      });
    } else {
      this.showTextShareModal(shareText);
    }
  }

  showTextShareModal(text) {
    // Create a simple modal for sharing text
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-modal-content">
        <h3>Share Cleanup Details</h3>
        <textarea readonly>${text}</textarea>
        <div class="share-modal-actions">
          <button class="btn btn-primary" onclick="this.closest('.share-modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
      }
      .share-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
      }
      .share-modal textarea {
        width: 100%;
        height: 100px;
        margin: 1rem 0;
        padding: 0.5rem;
        border: 2px solid var(--border-light);
        border-radius: 8px;
        resize: none;
      }
      .share-modal-actions {
        text-align: center;
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Select text for easy copying
    const textarea = modal.querySelector('textarea');
    textarea.select();
    
    this.announceToScreenReader('Share modal opened. Cleanup details are selected for copying.');
  }
}

// ==========================================================================
// Initialize Application
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the ShoreSquad application
  window.shoreSquadApp = new ShoreSquadApp();
  
  // Analytics and error tracking (placeholder)
  console.log('🌊 ShoreSquad Web App Loaded Successfully!');
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    });
  }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoreSquadApp;
}
