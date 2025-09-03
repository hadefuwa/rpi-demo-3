# Quick Reference: Embedded Mini App Architecture

## 🏗️ Architecture Rules

### ✅ DO
- **Embed ALL CSS** in `<style>` tags within each HTML file
- **Embed ALL JavaScript** in `<script>` tags within each HTML file
- **Scope ALL selectors** to `#screen-[appname]`
- **Use IIFE pattern** for JavaScript isolation
- **Implement lifecycle methods** (`activate`, `deactivate`, `cleanup`)
- **Clean up resources** when apps are unloaded

### ❌ DON'T
- **Reference external CSS files** with `<link>` tags
- **Reference external JS files** with `<script src="">` tags
- **Use global CSS selectors** without scoping
- **Pollute global scope** with variables/functions
- **Forget to clean up** event listeners and timers

## 📁 File Structure

```
src/screens/
├── home.html          # Home screen with app grid
├── snake.html         # Snake game (fully embedded)
├── game.html          # Another mini app
└── [appname].html     # Your new mini app
```

## 🎯 Mini App Template

```html
<section id="screen-[appname]" class="screen">
  <!-- Your app content here -->
</section>

<style>
  /* ALL styles scoped to #screen-[appname] */
  #screen-[appname] {
    /* App-specific styles */
  }
</style>

<script>
  (function() {
    'use strict';
    
    // Your app code here
    
    // Required lifecycle methods
    window.appLifecycle = {
      activate: function() { /* Resume app */ },
      deactivate: function() { /* Pause app */ },
      cleanup: function() { /* Clean up resources */ }
    };
    
    // Initialize app
    initApp();
  })();
</script>
```

## 🔧 Showcase Framework Integration

```javascript
// Navigate to another app
if (window.showcaseFramework) {
  window.showcaseFramework.navigateTo('appname');
}

// Go home
if (window.showcaseFramework) {
  window.showcaseFramework.goHome();
}
```

## 🧪 Testing Checklist

- [ ] App works independently (open HTML file directly)
- [ ] App integrates with showcase framework
- [ ] App pauses when switching away
- [ ] App resumes when returning
- [ ] App cleans up resources properly
- [ ] No console errors
- [ ] Touch and mouse interactions work
- [ ] Performance is acceptable

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Styles affecting other apps | Scope all CSS to `#screen-[appname]` |
| JavaScript conflicts | Use IIFE pattern and avoid global scope |
| Memory leaks | Clean up timers, listeners, and data structures |
| App not pausing | Implement `deactivate()` method |
| App not resuming | Implement `activate()` method |

## 📱 Mobile Considerations

- **Touch events**: Handle both `touchstart` and `click`
- **Viewport**: Use appropriate meta tags
- **Performance**: Optimize for 60fps animations
- **Battery**: Pause heavy operations when app is inactive

## 🎨 CSS Best Practices

```css
/* GOOD - Scoped and specific */
#screen-snake .game-container {
  background: #000;
}

/* BAD - Global scope */
.game-container {
  background: #000; /* Could affect other apps */
}
```

## ⚡ JavaScript Best Practices

```javascript
// GOOD - Isolated with IIFE
(function() {
  'use strict';
  let privateVar = 'private';
  
  // Export only what's needed
  window.appLifecycle = { /* ... */ };
})();

// BAD - Global scope pollution
let globalVar = 'global'; // Could conflict with other apps
```

## 🔄 Lifecycle Methods

```javascript
window.appLifecycle = {
  // Called when app becomes active
  activate: function() {
    // Resume animations, timers, etc.
  },
  
  // Called when app becomes inactive
  deactivate: function() {
    // Pause animations, timers, etc.
  },
  
  // Called when app is unloaded
  cleanup: function() {
    // Remove event listeners, clear timers, etc.
  }
};
```

## 📊 Performance Tips

- **Lazy load** heavy resources
- **Use `requestAnimationFrame`** for animations
- **Debounce** frequent events
- **Monitor memory usage** during development
- **Test on actual Raspberry Pi hardware**

## 🚀 Quick Start

1. **Create new app**: Copy template structure
2. **Add content**: HTML, CSS, and JavaScript
3. **Test independently**: Open HTML file directly
4. **Test integration**: Add to showcase framework
5. **Deploy**: Copy HTML file to `src/screens/`

## 📚 Full Documentation

- **Programming Guide**: `PROGRAMMING_GUIDE.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Examples**: See `src/screens/` for working examples

---

**Remember**: Each mini app or html page should be completely self-contained and not interfere with any other app in the showcase!
