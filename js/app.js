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

  // Placeholder functions for future features
  closeModals() {
    // Close any open modals
    console.log('Closing modals...');
  }

  setupFocusTrap() {
    // Implement focus trap for modals
    console.log('Focus trap setup...');
  }

  navigateFilters(direction) {
    const buttons = document.querySelectorAll('.filter-btn');
    const activeIndex = Array.from(buttons).findIndex(btn => btn.classList.contains('active'));
    const newIndex = Math.max(0, Math.min(buttons.length - 1, activeIndex + direction));
    
    buttons[newIndex].focus();
    buttons[newIndex].click();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Register service worker for caching
      // navigator.serviceWorker.register('/sw.js');
      console.log('Service worker support detected');
    }
  }

  setupScrollAnimations() {
    // Add CSS classes for scroll-triggered animations
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
      }
      
      .notification-success {
        border-left: 4px solid var(--eco-bright);
      }
      
      .notification-error {
        border-left: 4px solid #ef4444;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        margin-left: auto;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .event-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      }
      
      .event-card:hover {
        transform: translateY(-2px);
      }
      
      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .event-date {
        text-align: center;
        background: var(--ocean-light);
        padding: 10px;
        border-radius: 8px;
        min-width: 60px;
      }
      
      .event-date .month {
        display: block;
        font-size: 0.8rem;
        color: var(--ocean-deep);
        text-transform: uppercase;
      }
      
      .event-date .day {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--ocean-bright);
      }
      
      .event-weather i {
        font-size: 1.5rem;
        color: var(--sand-warm);
      }
      
      .event-content h3 {
        margin-bottom: 10px;
        color: var(--ocean-deep);
      }
      
      .event-details {
        margin-bottom: 15px;
      }
      
      .event-detail {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
      
      .event-detail i {
        width: 16px;
        color: var(--ocean-bright);
      }
      
      .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
      
      .btn-success {
        background: var(--eco-bright) !important;
      }
    `;
    document.head.appendChild(style);
  }

  setupButtonEffects() {
    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn')) {
        this.createRippleEffect(e);
      }
    });
  }

  createRippleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .btn {
          position: relative;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
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
