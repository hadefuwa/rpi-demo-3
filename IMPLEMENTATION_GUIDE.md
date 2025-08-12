# Implementation Guide: Converting to Embedded Architecture

## Overview
This guide provides step-by-step instructions for converting your existing mini apps to the embedded architecture where each app contains all its CSS and JavaScript inline.

## Current State Analysis

Looking at your current project, you have:
- Mini apps in `src/screens/` directory
- Some apps reference external CSS files
- JavaScript functionality may be scattered across files
- Need to consolidate everything into self-contained HTML files

## Step-by-Step Conversion Process

### Step 1: Audit Current Dependencies

First, identify what each mini app currently depends on:

```bash
# Check what CSS files each app might be using
grep -r "link.*css" src/screens/
grep -r "script.*js" src/screens/
```

### Step 2: Convert a Mini App (Example: Snake Game)

Let's convert your `snake.html` to be fully self-contained:

#### Before (Current Structure):
```html
<!-- src/screens/snake.html -->
<section id="screen-snake" class="screen">
  <div class="panel">
    <h2>Snake Game</h2>
    <!-- ... content ... -->
  </div>
</section>
```

#### After (Self-Contained):
```html
<!-- src/screens/snake.html -->
<section id="screen-snake" class="screen">
  <div class="panel">
    <h2>Snake Game</h2>
    <div class="game-controls">
      <button id="btnSnakeEasy" class="chip">Easy</button>
      <button id="btnSnakeHard" class="chip">Hard</button>
      <button id="btnSnakeStart" class="chip primary">Start Game</button>
    </div>
    <canvas id="snakeCanvas"></canvas>
    <div class="game-info">
      <span>Score: <span id="snakeScore">0</span></span>
      <span>High Score: <span id="snakeHighScore">0</span></span>
    </div>
  </div>
</section>

<style>
  /* Snake Game Specific Styles */
  #screen-snake {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    font-family: 'Courier New', monospace;
  }
  
  #screen-snake .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }
  
  #screen-snake h2 {
    font-size: 2.5em;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  
  #screen-snake .game-controls {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  #screen-snake .chip {
    padding: 12px 24px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 25px;
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  #screen-snake .chip:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
  }
  
  #screen-snake .chip.primary {
    background: #4CAF50;
    border-color: #4CAF50;
  }
  
  #screen-snake .chip.primary:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
  
  #screen-snake #snakeCanvas {
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 10px;
    background: #000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  
  #screen-snake .game-info {
    display: flex;
    gap: 30px;
    font-size: 18px;
    font-weight: bold;
  }
  
  #screen-snake .game-info span {
    background: rgba(255,255,255,0.1);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.2);
  }
</style>

<script>
  (function() {
    'use strict';
    
    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let gameLoop = null;
    let score = 0;
    let highScore = 0;
    let gameSpeed = 150; // Easy mode
    let isGameRunning = false;
    
    // Canvas setup
    let canvas, ctx;
    const gridSize = 20;
    const canvasSize = 400;
    
    function initApp() {
      setupCanvas();
      setupEventListeners();
      loadHighScore();
      drawGame();
    }
    
    function setupCanvas() {
      canvas = document.querySelector('#snakeCanvas');
      ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      
      // Initialize snake
      snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
      ];
      
      // Initialize food
      generateFood();
    }
    
    function setupEventListeners() {
      const container = document.querySelector('#screen-snake');
      
      // Game control buttons
      container.addEventListener('click', function(e) {
        if (e.target.id === 'btnSnakeEasy') {
          setDifficulty('easy');
        } else if (e.target.id === 'btnSnakeHard') {
          setDifficulty('hard');
        } else if (e.target.id === 'btnSnakeStart') {
          if (isGameRunning) {
            stopGame();
          } else {
            startGame();
          }
        }
      });
      
      // Keyboard controls
      document.addEventListener('keydown', handleKeyPress);
      
      // Touch controls for mobile
      let touchStartX = 0;
      let touchStartY = 0;
      
      canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      });
      
      canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0 && direction !== 'left') direction = 'right';
          else if (deltaX < 0 && direction !== 'right') direction = 'left';
        } else {
          if (deltaY > 0 && direction !== 'up') direction = 'down';
          else if (deltaY < 0 && direction !== 'down') direction = 'up';
        }
      });
    }
    
    function handleKeyPress(e) {
      switch(e.key) {
        case 'ArrowUp':
          if (direction !== 'down') direction = 'up';
          break;
        case 'ArrowDown':
          if (direction !== 'up') direction = 'down';
          break;
        case 'ArrowLeft':
          if (direction !== 'right') direction = 'left';
          break;
        case 'ArrowRight':
          if (direction !== 'left') direction = 'right';
          break;
        case ' ':
          if (isGameRunning) stopGame();
          else startGame();
          break;
      }
    }
    
    function setDifficulty(level) {
      if (level === 'easy') {
        gameSpeed = 150;
        document.querySelector('#btnSnakeEasy').classList.add('primary');
        document.querySelector('#btnSnakeHard').classList.remove('primary');
      } else {
        gameSpeed = 80;
        document.querySelector('#btnSnakeHard').classList.add('primary');
        document.querySelector('#btnSnakeEasy').classList.remove('primary');
      }
      
      if (isGameRunning) {
        stopGame();
        startGame();
      }
    }
    
    function startGame() {
      if (isGameRunning) return;
      
      isGameRunning = true;
      document.querySelector('#btnSnakeStart').textContent = 'Stop Game';
      document.querySelector('#btnSnakeStart').classList.add('primary');
      
      gameLoop = setInterval(updateGame, gameSpeed);
    }
    
    function stopGame() {
      if (!isGameRunning) return;
      
      isGameRunning = false;
      document.querySelector('#btnSnakeStart').textContent = 'Start Game';
      document.querySelector('#btnSnakeStart').classList.remove('primary');
      
      if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
      }
    }
    
    function updateGame() {
      // Move snake
      const head = {x: snake[0].x, y: snake[0].y};
      
      switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }
      
      // Check collision with walls
      if (head.x < 0 || head.x >= canvasSize/gridSize || 
          head.y < 0 || head.y >= canvasSize/gridSize) {
        gameOver();
        return;
      }
      
      // Check collision with self
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          gameOver();
          return;
        }
      }
      
      // Check collision with food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
      } else {
        snake.pop(); // Remove tail if no food eaten
      }
      
      snake.unshift(head); // Add new head
      drawGame();
    }
    
    function generateFood() {
      do {
        food = {
          x: Math.floor(Math.random() * (canvasSize/gridSize)),
          y: Math.floor(Math.random() * (canvasSize/gridSize))
        };
      } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }
    
    function drawGame() {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Draw snake
      ctx.fillStyle = '#4CAF50';
      snake.forEach((segment, index) => {
        if (index === 0) {
          // Head
          ctx.fillStyle = '#8BC34A';
        } else {
          // Body
          ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      });
      
      // Draw food
      ctx.fillStyle = '#FF5722';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
      
      // Draw grid (optional, for debugging)
      if (false) { // Set to true to show grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= canvasSize; i += gridSize) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvasSize);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvasSize, i);
          ctx.stroke();
        }
      }
    }
    
    function gameOver() {
      stopGame();
      
      if (score > highScore) {
        highScore = score;
        saveHighScore();
        updateScore();
      }
      
      // Reset game
      snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
      ];
      direction = 'right';
      score = 0;
      updateScore();
      generateFood();
      drawGame();
      
      // Show game over message
      alert(`Game Over! Score: ${score}`);
    }
    
    function updateScore() {
      document.querySelector('#snakeScore').textContent = score;
      document.querySelector('#snakeHighScore').textContent = highScore;
    }
    
    function loadHighScore() {
      try {
        const saved = localStorage.getItem('snake-high-score');
        if (saved) {
          highScore = parseInt(saved) || 0;
          updateScore();
        }
      } catch (e) {
        console.warn('Failed to load high score:', e);
      }
    }
    
    function saveHighScore() {
      try {
        localStorage.setItem('snake-high-score', highScore.toString());
      } catch (e) {
        console.warn('Failed to save high score:', e);
      }
    }
    
    // Lifecycle management
    window.appLifecycle = {
      activate: function() {
        console.log('Snake game activated');
        if (isGameRunning) {
          // Resume game if it was running
          startGame();
        }
      },
      
      deactivate: function() {
        console.log('Snake game deactivated');
        if (isGameRunning) {
          // Pause game when switching away
          stopGame();
        }
      },
      
      cleanup: function() {
        console.log('Snake game cleanup');
        stopGame();
        // Remove event listeners
        document.removeEventListener('keydown', handleKeyPress);
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

### Step 3: Convert Other Mini Apps

Follow the same pattern for each mini app:

1. **Copy all CSS** from external files into `<style>` tags
2. **Copy all JavaScript** from external files into `<script>` tags
3. **Scope all selectors** to the app's screen ID
4. **Add lifecycle management** functions
5. **Test independently** before integrating

### Step 4: Update Main Showcase Container

Modify your `public/index.html` to load mini apps dynamically:

```html
<!-- In your main index.html -->
<script>
  // Showcase Framework
  window.showcaseFramework = {
    currentApp: null,
    apps: {},
    
    // Load a mini app
    loadApp: function(appId) {
      // Hide current app
      if (this.currentApp) {
        this.hideApp(this.currentApp);
      }
      
      // Load new app
      fetch(`./screens/${appId}.html`)
        .then(response => response.text())
        .then(html => {
          // Insert app HTML
          document.getElementById('screen-container').innerHTML = html;
          
          // Activate app
          this.currentApp = appId;
          this.activateApp(appId);
        })
        .catch(error => {
          console.error('Failed to load app:', error);
          this.goHome();
        });
    },
    
    // Hide an app
    hideApp: function(appId) {
      if (window.appLifecycle && window.appLifecycle.deactivate) {
        window.appLifecycle.deactivate();
      }
    },
    
    // Activate an app
    activateApp: function(appId) {
      if (window.appLifecycle && window.appLifecycle.activate) {
        window.appLifecycle.activate();
      }
    },
    
    // Go home
    goHome: function() {
      this.loadApp('home');
    },
    
    // Navigate to specific app
    navigateTo: function(appId) {
      this.loadApp(appId);
    }
  };
  
  // Setup navigation
  document.addEventListener('DOMContentLoaded', function() {
    // Handle card clicks
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('card')) {
        const target = e.target.dataset.target;
        if (target) {
          showcaseFramework.loadApp(target.replace('screen-', ''));
        }
      }
    });
    
    // Handle home button
    document.getElementById('btnHome').addEventListener('click', function() {
      showcaseFramework.goHome();
    });
  });
</script>
```

### Step 5: Create a Template Generator

Create a script to generate new mini app templates:

```bash
#!/bin/bash
# scripts/create-app.sh

APP_NAME=$1
if [ -z "$APP_NAME" ]; then
    echo "Usage: ./create-app.sh <app-name>"
    exit 1
fi

# Create the app file
cat > "src/screens/${APP_NAME}.html" << EOF
<section id="screen-${APP_NAME}" class="screen">
  <div class="app-container">
    <h2>${APP_NAME^} App</h2>
    <p>This is the ${APP_NAME} mini app</p>
  </div>
  
  <div class="app-controls">
    <button id="btnAction" class="chip">Action</button>
    <button id="btnHome" class="chip">Home</button>
  </div>
</section>

<style>
  #screen-${APP_NAME} {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: Arial, sans-serif;
  }
  
  #screen-${APP_NAME} .app-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
  }
  
  #screen-${APP_NAME} h2 {
    font-size: 2.5em;
    margin: 0;
  }
  
  #screen-${APP_NAME} .app-controls {
    padding: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  #screen-${APP_NAME} .chip {
    padding: 12px 24px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 25px;
    background: rgba(255,255,255,0.1);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  #screen-${APP_NAME} .chip:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
</style>

<script>
  (function() {
    'use strict';
    
    function initApp() {
      setupEventListeners();
    }
    
    function setupEventListeners() {
      const container = document.querySelector('#screen-${APP_NAME}');
      
      container.addEventListener('click', function(e) {
        if (e.target.id === 'btnAction') {
          handleAction();
        } else if (e.target.id === 'btnHome') {
          goHome();
        }
      });
    }
    
    function handleAction() {
      console.log('Action button clicked in ${APP_NAME} app');
      // Add your app logic here
    }
    
    function goHome() {
      if (window.showcaseFramework && window.showcaseFramework.goHome) {
        window.showcaseFramework.goHome();
      }
    }
    
    // Lifecycle management
    window.appLifecycle = {
      activate: function() {
        console.log('${APP_NAME} app activated');
      },
      
      deactivate: function() {
        console.log('${APP_NAME} app deactivated');
      },
      
      cleanup: function() {
        console.log('${APP_NAME} app cleanup');
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
EOF

echo "Created ${APP_NAME}.html in src/screens/"
echo "Don't forget to add it to the home screen grid!"
```

## Testing Your Converted Apps

### 1. Test Individual Apps
```bash
# Open each HTML file directly in browser
# Test all functionality works independently
# Check console for errors
```

### 2. Test Integration
```bash
# Start your showcase app
npm run dev

# Navigate between apps
# Test app switching
# Verify cleanup works
```

### 3. Test Edge Cases
- Rapid app switching
- Browser refresh during app execution
- Memory usage monitoring
- Touch vs mouse interactions

## Common Issues and Solutions

### Issue: Styles Not Scoped Properly
**Solution**: Ensure all CSS selectors start with `#screen-[appname]`

### Issue: JavaScript Variables Polluting Global Scope
**Solution**: Use IIFE pattern and export only necessary functions

### Issue: Event Listeners Not Cleaned Up
**Solution**: Store references and remove in cleanup function

### Issue: Apps Interfering with Each Other
**Solution**: Check for global variable names and function names

## Performance Monitoring

Add performance monitoring to your showcase framework:

```javascript
// In your showcase framework
performance: {
  measureAppLoad: function(appId) {
    const start = performance.now();
    return {
      end: function() {
        const duration = performance.now() - start;
        console.log(`${appId} loaded in ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  },
  
  monitorMemory: function() {
    if (performance.memory) {
      console.log('Memory usage:', {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB'
      });
    }
  }
}
```

## Next Steps

1. **Convert your first mini app** using the snake example above
2. **Test thoroughly** before converting others
3. **Create a template** for future apps
4. **Update your showcase framework** to handle dynamic loading
5. **Convert remaining apps** one by one
6. **Add performance monitoring** and optimization

This approach will give you a robust, maintainable showcase app where each mini app is completely independent and can be developed, tested, and deployed separately.
