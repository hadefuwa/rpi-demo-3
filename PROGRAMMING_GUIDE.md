# Programming Guide: Showcase App with Embedded Mini Apps

## Overview
This guide outlines the architecture and development approach for creating a showcase application that hosts multiple independent mini apps. Each mini app is completely self-contained with embedded JavaScript and CSS, ensuring no shared code dependencies between apps.

## Architecture Principles

### 1. Complete Isolation
- **No shared JavaScript files** - Each mini app contains all its JavaScript code inline
- **No shared CSS files** - Each mini app contains all its styles inline
- **No shared dependencies** - Each app is completely independent
- **Self-contained functionality** - Apps cannot interfere with each other

### 2. Showcase Framework
- **Main container** - Handles navigation and app switching
- **Screen management** - Loads/unloads mini apps dynamically
- **Common UI elements** - Only shared visual framework (header, navigation)

## File Structure

```
RPI-5Inch/
├── public/
│   ├── index.html          # Main showcase container
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── assets/            # Shared assets (images, fonts)
├── src/
│   ├── screens/           # Individual mini app HTML files
│   │   ├── home.html      # Home screen with app grid
│   │   ├── game.html      # Mini app 1
│   │   ├── snake.html     # Mini app 2
│   │   └── ...            # Additional mini apps
│   └── styles/
│       └── base.css       # Only shared base styles
└── scripts/               # Build and deployment scripts
```

## Mini App Development Standards

### 1. HTML Structure
Each mini app must follow this structure:

```html
<section id="screen-[appname]" class="screen">
  <!-- App-specific content -->
  <div class="app-container">
    <h2>App Title</h2>
    <!-- App content goes here -->
  </div>
  
  <!-- App-specific controls -->
  <div class="app-controls">
    <button id="btnAction" class="chip">Action</button>
  </div>
</section>

<!-- EMBEDDED CSS - No external CSS files -->
<style>
  /* All app-specific styles go here */
  #screen-[appname] {
    /* App-specific styling */
  }
  
  /* Use scoped selectors to avoid conflicts */
  #screen-[appname] .app-container {
    /* Container styles */
  }
</style>

<!-- EMBEDDED JAVASCRIPT - No external JS files -->
<script>
  // All app-specific JavaScript goes here
  (function() {
    'use strict';
    
    // App initialization
    function initApp() {
      // Setup event listeners
      // Initialize game state
      // Setup timers/animations
    }
    
    // App cleanup
    function cleanupApp() {
      // Clear timers
      // Remove event listeners
      // Reset state
    }
    
    // Export cleanup function for showcase framework
    window.appCleanup = cleanupApp;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  })();
</script>
```

### 2. CSS Guidelines

#### Scoping
- **Always scope styles** to your app's screen ID
- **Use specific selectors** to avoid conflicts
- **Avoid global styles** that could affect other apps

```css
/* GOOD - Scoped to specific app */
#screen-snake .game-container {
  background: #000;
  color: #fff;
}

#screen-snake .snake-cell {
  background: #0f0;
}

/* AVOID - Global styles that could conflict */
.game-container {
  background: #000; /* Could affect other apps */
}
```

#### CSS Reset
- **Don't rely on external CSS resets**
- **Define your own base styles** within your app
- **Use CSS custom properties** for consistent theming

```css
#screen-[appname] {
  /* App-specific CSS reset */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  /* App-specific variables */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
}
```

### 3. JavaScript Guidelines

#### Isolation
- **Use IIFE (Immediately Invoked Function Expression)** to avoid global scope pollution
- **Export only necessary functions** to global scope
- **Clean up resources** when app is unloaded

```javascript
(function() {
  'use strict';
  
  // Private variables and functions
  let gameState = {};
  let gameTimer = null;
  
  function startGame() {
    // Game logic
  }
  
  function stopGame() {
    // Stop game and cleanup
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }
  }
  
  // Export cleanup function for showcase framework
  window.appCleanup = function() {
    stopGame();
    // Additional cleanup
  };
  
  // Initialize app
  initApp();
})();
```

#### Event Handling
- **Use event delegation** when possible
- **Remove event listeners** in cleanup function
- **Handle touch and mouse events** for mobile compatibility

```javascript
function setupEventListeners() {
  const container = document.querySelector('#screen-[appname]');
  
  // Use event delegation
  container.addEventListener('click', handleClick);
  container.addEventListener('touchstart', handleTouch);
  
  // Store reference for cleanup
  window.appEventListeners = [
    { element: container, event: 'click', handler: handleClick },
    { element: container, event: 'touchstart', handler: handleTouch }
  ];
}

function cleanupEventListeners() {
  if (window.appEventListeners) {
    window.appEventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    window.appEventListeners = [];
  }
}
```

#### State Management
- **Keep state local** to your app
- **Use localStorage** for persistence if needed
- **Reset state** when app is reloaded

```javascript
class AppState {
  constructor() {
    this.loadState();
  }
  
  loadState() {
    try {
      const saved = localStorage.getItem('appname-state');
      if (saved) {
        Object.assign(this, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }
  
  saveState() {
    try {
      localStorage.setItem('appname-state', JSON.stringify(this));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }
  
  reset() {
    // Reset to default state
    Object.keys(this).forEach(key => {
      if (key !== 'loadState' && key !== 'saveState' && key !== 'reset') {
        delete this[key];
      }
    });
    this.saveState();
  }
}
```

## Showcase Framework Integration

### 1. App Registration
Each mini app must register itself with the showcase framework:

```javascript
// In your mini app's script section
(function() {
  'use strict';
  
  // Register app with showcase framework
  if (window.registerApp) {
    window.registerApp({
      id: 'appname',
      name: 'App Display Name',
      description: 'Brief description of the app',
      icon: 'path/to/icon.png',
      category: 'games' // or 'tools', 'demos', etc.
    });
  }
  
  // App implementation...
})();
```

### 2. Lifecycle Management
Apps must implement these lifecycle methods:

```javascript
// Required lifecycle methods
window.appLifecycle = {
  // Called when app becomes active
  activate: function() {
    // Resume app, start animations, etc.
  },
  
  // Called when app becomes inactive
  deactivate: function() {
    // Pause app, stop animations, etc.
  },
  
  // Called when app is about to be unloaded
  cleanup: function() {
    // Clean up resources, remove listeners, etc.
  }
};
```

### 3. Navigation Integration
Apps can navigate to other screens using the showcase framework:

```javascript
// Navigate to another app
function goToApp(appId) {
  if (window.showcaseFramework && window.showcaseFramework.navigateTo) {
    window.showcaseFramework.navigateTo(appId);
  }
}

// Go back to home
function goHome() {
  if (window.showcaseFramework && window.showcaseFramework.goHome) {
    window.showcaseFramework.goHome();
  }
}
```

## Development Workflow

### 1. Creating a New Mini App

1. **Create HTML file** in `src/screens/` directory
2. **Follow naming convention**: `[appname].html`
3. **Implement complete functionality** with embedded CSS/JS
4. **Test in isolation** before integrating
5. **Add to showcase grid** in home screen

### 2. Testing

1. **Test app independently** by opening HTML file directly
2. **Test integration** within showcase framework
3. **Test cleanup** when switching between apps
4. **Test mobile/touch** interactions
5. **Test performance** with multiple apps loaded

### 3. Debugging

1. **Use console logging** for debugging
2. **Check for global scope pollution**
3. **Verify event listener cleanup**
4. **Monitor memory usage** during app switching
5. **Test edge cases** (rapid switching, errors, etc.)

## Performance Considerations

### 1. Memory Management
- **Clean up timers and intervals**
- **Remove event listeners**
- **Clear large data structures**
- **Use weak references** when possible

### 2. Loading Optimization
- **Lazy load** app content when needed
- **Preload** critical resources
- **Use efficient DOM manipulation**
- **Minimize reflows and repaints**

### 3. Touch Optimization
- **Handle touch events efficiently**
- **Use passive event listeners** when possible
- **Optimize for 60fps** animations
- **Test on actual Raspberry Pi hardware**

## Best Practices

### 1. Code Organization
- **Keep HTML, CSS, and JS together** in each file
- **Use consistent naming conventions**
- **Comment complex logic**
- **Follow DRY principles** within each app

### 2. Error Handling
- **Wrap critical code** in try-catch blocks
- **Provide fallbacks** for failed operations
- **Log errors** for debugging
- **Gracefully degrade** functionality

### 3. Accessibility
- **Use semantic HTML** elements
- **Provide keyboard navigation**
- **Include ARIA labels** where appropriate
- **Test with screen readers**

### 4. Mobile Optimization
- **Optimize for touch** interactions
- **Use appropriate viewport** settings
- **Test on various screen sizes**
- **Consider battery life** implications

## Example Mini App Template

```html
<section id="screen-example" class="screen">
  <div class="app-header">
    <h2>Example App</h2>
    <p>This is an example mini app</p>
  </div>
  
  <div class="app-content">
    <div id="app-output">Hello World!</div>
    <button id="btnAction" class="action-button">Click Me</button>
  </div>
  
  <div class="app-footer">
    <button id="btnHome" class="nav-button">Home</button>
  </div>
</section>

<style>
  #screen-example {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: Arial, sans-serif;
  }
  
  #screen-example .app-header {
    text-align: center;
    padding: 20px;
  }
  
  #screen-example .app-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  
  #screen-example .action-button {
    padding: 15px 30px;
    font-size: 18px;
    border: none;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  #screen-example .action-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  #screen-example .app-footer {
    padding: 20px;
    text-align: center;
  }
  
  #screen-example .nav-button {
    padding: 10px 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: transparent;
    color: white;
    cursor: pointer;
  }
</style>

<script>
  (function() {
    'use strict';
    
    let clickCount = 0;
    let clickTimer = null;
    
    function initApp() {
      setupEventListeners();
      loadState();
    }
    
    function setupEventListeners() {
      const container = document.querySelector('#screen-example');
      
      container.addEventListener('click', function(e) {
        if (e.target.id === 'btnAction') {
          handleActionClick();
        } else if (e.target.id === 'btnHome') {
          goHome();
        }
      });
    }
    
    function handleActionClick() {
      clickCount++;
      updateDisplay();
      saveState();
      
      // Add visual feedback
      const button = document.querySelector('#btnAction');
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    }
    
    function updateDisplay() {
      const output = document.querySelector('#app-output');
      output.textContent = `Clicked ${clickCount} times!`;
    }
    
    function loadState() {
      try {
        const saved = localStorage.getItem('example-app-clicks');
        if (saved) {
          clickCount = parseInt(saved) || 0;
          updateDisplay();
        }
      } catch (e) {
        console.warn('Failed to load state:', e);
      }
    }
    
    function saveState() {
      try {
        localStorage.setItem('example-app-clicks', clickCount.toString());
      } catch (e) {
        console.warn('Failed to save state:', e);
      }
    }
    
    function goHome() {
      if (window.showcaseFramework && window.showcaseFramework.goHome) {
        window.showcaseFramework.goHome();
      }
    }
    
    // Lifecycle management
    window.appLifecycle = {
      activate: function() {
        console.log('Example app activated');
      },
      
      deactivate: function() {
        console.log('Example app deactivated');
      },
      
      cleanup: function() {
        console.log('Example app cleanup');
        // No timers or listeners to clean up in this simple example
      }
    };
    
    // Initialize app
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  })();
</script>
```

## Conclusion

This architecture ensures that each mini app is completely independent and can be developed, tested, and maintained separately. The showcase framework provides a consistent user experience while maintaining strict isolation between apps.

Key benefits:
- **Easy development** - Each app can be built independently
- **No conflicts** - Apps cannot interfere with each other
- **Simple deployment** - Just add HTML files to the screens directory
- **Maintainable** - Changes to one app don't affect others
- **Scalable** - Easy to add new apps without modifying existing code

Follow these guidelines to create robust, maintainable mini apps that work seamlessly within your showcase framework.
