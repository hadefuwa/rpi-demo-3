/**
 * Navigation Optimizer - Prevents CSS loading delays when returning to homepage
 */
(function() {
  'use strict';
  
  // Track navigation state
  const NAVIGATION_KEY = 'showcase-navigation-state';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  
  /**
   * Mark that user is navigating away from homepage
   */
  function markNavigationStart() {
    const navigationState = {
      timestamp: Date.now(),
      fromHomepage: window.location.pathname === '/' || window.location.pathname.endsWith('index.html'),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    sessionStorage.setItem(NAVIGATION_KEY, JSON.stringify(navigationState));
    console.log('📍 Navigation state marked');
  }
  
  /**
   * Check if user is returning to homepage
   */
  function isReturningToHomepage() {
    try {
      const stored = sessionStorage.getItem(NAVIGATION_KEY);
      if (!stored) return false;
      
      const state = JSON.parse(stored);
      const now = Date.now();
      
      // Check if navigation state is recent (within cache duration)
      const isRecent = (now - state.timestamp) < CACHE_DURATION;
      
      // Check if returning to homepage
      const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
      
      return isRecent && isHomepage && state.fromHomepage;
    } catch (error) {
      console.warn('Navigation state check failed:', error);
      return false;
    }
  }
  
  /**
   * Optimize loading for returning users
   */
  function optimizeForReturningUser() {
    // Add a class to body to indicate returning user
    document.body.classList.add('returning-user');
    
    // Reduce loading overlay duration for returning users
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.2s ease-out';
      
      // Hide overlay faster for returning users
      setTimeout(() => {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 200);
      }, 100);
    }
    
    console.log('⚡ Optimized loading for returning user');
  }
  
  /**
   * Add navigation tracking to all links
   */
  function addNavigationTracking() {
    // Track clicks on navigation links
    document.addEventListener('click', function(event) {
      const link = event.target.closest('a[href]');
      if (link && link.href) {
        const url = new URL(link.href, window.location.origin);
        
        // Only track internal navigation
        if (url.origin === window.location.origin) {
          markNavigationStart();
        }
      }
    });
    
    // Track programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      markNavigationStart();
      return originalPushState.apply(history, arguments);
    };
    
    history.replaceState = function() {
      markNavigationStart();
      return originalReplaceState.apply(history, arguments);
    };
    
    // Track back/forward navigation
    window.addEventListener('popstate', function() {
      markNavigationStart();
    });
  }
  
  /**
   * Initialize navigation optimizer
   */
  function init() {
    // Check if user is returning
    if (isReturningToHomepage()) {
      optimizeForReturningUser();
    }
    
    // Set up navigation tracking for future visits
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addNavigationTracking);
    } else {
      addNavigationTracking();
    }
    
    // Clean up old navigation states
    try {
      const stored = sessionStorage.getItem(NAVIGATION_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        const now = Date.now();
        
        if ((now - state.timestamp) > CACHE_DURATION) {
          sessionStorage.removeItem(NAVIGATION_KEY);
          console.log('🧹 Cleaned up old navigation state');
        }
      }
    } catch (error) {
      sessionStorage.removeItem(NAVIGATION_KEY);
    }
  }
  
  // Initialize immediately
  init();
  
  // Expose utilities for debugging
  window.NavigationOptimizer = {
    markNavigationStart,
    isReturningToHomepage,
    clearState: () => sessionStorage.removeItem(NAVIGATION_KEY)
  };
  
})();
