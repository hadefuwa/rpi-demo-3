/**
 * Screen Loader Utility
 * Dynamically loads screen HTML files and manages screen transitions
 */
class ScreenLoader {
  constructor() {
    this.screens = new Map();
    this.currentScreen = null;
    this.screenContainer = null;
    this.loadedStyles = new Set();
    this.init();
  }

  init() {
    this.screenContainer = document.getElementById('screen-container');
    if (!this.screenContainer) {
      console.error('Screen container not found!');
      return;
    }
    
    // Load the home screen by default without adding to history
    this.loadScreen('home', false);
  }

  /**
   * Load a screen by name
   * @param {string} screenName - The name of the screen to load
   * @param {boolean} addToHistory - Whether to add to navigation history
   */
  async loadScreen(screenName, addToHistory = true) {
    try {
      // Check if screen is already loaded
      if (this.screens.has(screenName)) {
        this.showScreen(screenName);
        return;
      }

      // Load the screen HTML file
      const response = await fetch(`./screens/${screenName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load screen: ${screenName}`);
      }

      const html = await response.text();
      
      // Create a temporary container to parse the HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Get the screen element
      const screenElement = temp.querySelector('.screen');
      if (!screenElement) {
        throw new Error(`Invalid screen HTML for: ${screenName}`);
      }

      // Store the screen
      this.screens.set(screenName, screenElement);
      
      // Load screen-specific stylesheet (if present)
      this.loadScreenStyles(screenName);

      // Add to DOM
      this.screenContainer.appendChild(screenElement);
      
      // Show the screen
      this.showScreen(screenName);
      
      // Add to history if requested (legacy app.js manages history now)
      if (addToHistory && window.addToNavigationHistory) {
        // Small delay to ensure the screen is fully loaded before adding to history
        setTimeout(() => {
          window.addToNavigationHistory(`screen-${screenName}`);
        }, 50);
      }

      // Initialize screen-specific functionality
      this.initializeScreen(screenName);
      
    } catch (error) {
      console.error('Error loading screen:', error);
      // Fallback to home screen
      if (screenName !== 'home') {
        this.loadScreen('home', false);
      }
    }
  }

  /**
   * Load per-screen CSS once
   * @param {string} screenName
   */
  loadScreenStyles(screenName) {
    const cssId = `style-${screenName}`;
    if (this.loadedStyles.has(cssId)) return;

    const href = `./styles/${screenName}.css`;
    // Optimistically attach. If 404, browser will ignore without breaking app.
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    this.loadedStyles.add(cssId);
  }

  /**
   * Show a specific screen
   * @param {string} screenName - The name of the screen to show
   */
  showScreen(screenName) {
    // Hide all screens
    this.screens.forEach((screen, name) => {
      screen.classList.remove('active');
    });

    // Show the requested screen
    const targetScreen = this.screens.get(screenName);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenName;
      
      // Update page title
      document.title = `RPI 5" Showcase - ${screenName.charAt(0).toUpperCase() + screenName.slice(1)}`;
      
      // Parse emojis for dynamically loaded content (Twemoji fallback)
      try {
        if (window.twemoji && typeof window.twemoji.parse === 'function') {
          window.twemoji.parse(targetScreen);
        }
      } catch {}

      // Dispatch custom event for screen change
      window.dispatchEvent(new CustomEvent('screenChanged', { 
        detail: { screenName, screenElement: targetScreen } 
      }));

      // Integrate with legacy nav stack used in app.js
      if (window.addToNavigationHistory) {
        // Small delay to ensure the screen is fully loaded before adding to history
        setTimeout(() => {
          window.addToNavigationHistory(`screen-${screenName}`);
        }, 50);
      }
    }
  }

  /**
   * Initialize screen-specific functionality
   * @param {string} screenName - The name of the screen to initialize
   */
  initializeScreen(screenName) {
    switch (screenName) {
      case 'touch':
        // Initialize touch demo
        if (window.initTouchDemo) {
          window.initTouchDemo();
        }
        break;
      case 'info':
        // Initialize dashboard
        if (window.initDashboard) {
          window.initDashboard();
        }
        break;
      case 'games':
        // Initialize games hub
        if (window.initGamesHub) {
          window.initGamesHub();
        }
        break;
      case 'game':
        // Initialize tic tac toe
        if (window.initTicTacToe) {
          window.initTicTacToe();
        }
        break;
      case 'snake':
        // Initialize snake game
        if (window.initSnake) {
          window.initSnake();
        }
        break;
      case 'pingpong':
        // Initialize ping pong game
        if (window.initPingPong) {
          window.initPingPong();
        }
        break;
      case 'stl':
        // Initialize STL viewer
        if (window.initSTLViewer) {
          window.initSTLViewer();
        }
        break;
      case 'visuals':
        // Initialize visuals
        if (window.initVisuals) {
          window.initVisuals();
        }
        break;
      case 'scroll':
        // Initialize scroll test
        if (window.initScrollTest) {
          window.initScrollTest();
        }
        break;
      case 'settings':
        // Initialize settings
        if (window.initSettings) {
          window.initSettings();
        }
        break;
      case 'about':
        // Initialize about screen
        if (window.initAbout) {
          window.initAbout();
        }
        break;
    }
  }

  /**
   * Add screen to navigation history
   * @param {string} screenName - The name of the screen to add
   */
  addToHistory(screenName) {
    // This will be integrated with the existing navigation system
    if (window.addToNavigationHistory) {
      window.addToNavigationHistory(screenName);
    }
  }

  /**
   * Get current screen name
   * @returns {string} Current screen name
   */
  getCurrentScreen() {
    return this.currentScreen;
  }

  /**
   * Check if a screen is loaded
   * @param {string} screenName - The name of the screen to check
   * @returns {boolean} Whether the screen is loaded
   */
  isScreenLoaded(screenName) {
    return this.screens.has(screenName);
  }

  /**
   * Preload a screen (load without showing)
   * @param {string} screenName - The name of the screen to preload
   */
  preloadScreen(screenName) {
    if (!this.screens.has(screenName)) {
      this.loadScreen(screenName, false);
    }
  }

  /**
   * Unload a screen to free memory
   * @param {string} screenName - The name of the screen to unload
   */
  unloadScreen(screenName) {
    const screen = this.screens.get(screenName);
    if (screen && screenName !== 'home') {
      screen.remove();
      this.screens.delete(screenName);
    }
  }

  /**
   * Get all loaded screen names
   * @returns {Array} Array of loaded screen names
   */
  getLoadedScreens() {
    return Array.from(this.screens.keys());
  }
}

// Export for use in other modules
window.ScreenLoader = ScreenLoader;

// Auto-instantiate a global loader instance so pages are loaded dynamically
document.addEventListener('DOMContentLoaded', () => {
  if (!window.screenLoader) {
    try { window.screenLoader = new ScreenLoader(); } catch (e) { console.error('Failed to init ScreenLoader', e); }
  }
});
