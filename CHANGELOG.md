Changelog
=========

All notable changes to this project will be documented here.

Unreleased
----------
- Planned: Add logo to Home, Save drawing to PNG, Real System Info (memory/temperature/CPU).

2025-01-27 – Comprehensive responsive design system implementation
----------------------------------------------------------------
- **Viewport & Meta Tags**: Fixed restrictive viewport meta tag from fixed 1024x600 to responsive width=device-width
- **CSS Consolidation**: Removed conflicting CSS files (styles-old.css, styles-new.css, styles.css.backup) to prevent conflicts
- **Responsive Design System**: Added comprehensive CSS custom properties for spacing, fonts, and border radius using clamp() functions
- **Canvas Responsiveness**: All game and visual canvases now scale properly with responsive dimensions and high-DPI support
- **Grid Layouts**: Adaptive grid columns that change from 1 column (mobile) to 2 columns (tablet+) based on screen size
- **Component Scaling**: Cards, buttons, and panels now use responsive spacing and sizing
- **Media Queries**: Implemented mobile-first responsive breakpoints (480px, 768px, 1024px, 1200px+)
- **Touch Optimization**: Minimum 44px touch targets for mobile devices
- **Orientation Support**: Landscape and portrait optimizations for different device orientations
- **High DPI Support**: Automatic scaling for retina displays with devicePixelRatio handling
- **Accessibility**: Added skip links, improved focus indicators, and better contrast ratios
- **JavaScript Integration**: Added responsive canvas sizing with automatic resize handling
- **Cross-Device Compatibility**: App now works seamlessly from mobile phones to large desktop screens

2025-01-27 – Modular screen architecture implementation
------------------------------------------------------
- **Screen Separation**: Broke down monolithic index.html into individual screen HTML files for better maintainability
- **Dynamic Loading**: Implemented ScreenLoader utility for lazy loading and caching of screen content
- **File Organization**: Created organized directory structure with screens/, js/, and assets/ folders
- **Modular Structure**: Each screen (home, touch, info, games, etc.) is now in its own focused HTML file
- **Performance Improvement**: Screens are only loaded when needed, reducing initial page load time
- **Developer Experience**: Much easier to work on individual screens without conflicts
- **Code Maintainability**: Clear separation of concerns makes debugging and feature development simpler
- **Scalability**: New screens can be added easily without touching the main index.html file

2025-01-27 – 3D Model page debugging and button visibility fixes
---------------------------------------------------------------
- Added comprehensive debugging to 3D Model page to identify button visibility issues
- Added console logging for STL canvas, control buttons, and containers
- Added visual debugging with bright colors and borders to make buttons more visible
- Enhanced showScreen function with debugging for 3D model screen activation
- Fixed potential z-index and layout issues that could hide STL control buttons
- Added debugging for model selection buttons (CAD 1, CAD 2, CAD 3)
- Enhanced STL controls container with position and z-index debugging

2025-01-27 – Enhanced 3D model background stars
-----------------------------------------------
- Increased star sizes in 3D model background from 0.5-2.0 to 1.5-5.0 radius
- Added bright cores for larger stars to improve visibility
- Enhanced glow effects with primary (4x radius) and secondary (6x radius) glows
- Improved overall star prominence and visibility in STL viewer background

2025-01-27 – Memory Match game enhancements
------------------------------------------
- Added "flips and glows" effects to Memory Match game
- Enhanced tile animations with scale effects on click
- Added celebration effects for successful matches
- Improved status message colors and text shadows
- Added subtle particle burst effects for matched tiles

2025-01-27 – System Info dashboard with real-time graphs
-------------------------------------------------------
- Completely revamped System Info screen with modern dashboard layout
- Added Chart.js integration for performance and memory visualization
- Real-time CPU, memory, temperature, and uptime monitoring
- Network status and storage information display
- Auto-refresh functionality with manual refresh controls
- System action buttons for restart, shutdown, and updates

2025-01-27 – Ping Pong game implementation
-----------------------------------------
- New Ping Pong game with player vs AI gameplay
- Full game logic including ball physics, collision detection, and scoring
- Keyboard controls (Arrow keys, W/S) and touch controls (swipe up/down)
- Visual effects with particles and glow effects
- First to 11 wins scoring system
- Pause, reset, and game state management

2025-01-27 – Enhanced homepage buttons with professional effects
---------------------------------------------------------------
- Completely redesigned homepage buttons with big, bright, popping effects
- Each button has unique theme colors and animations
- Added glass-morphism effects with backdrop-filter and complex shadows
- 3D transform effects on hover with lift, scale, and rotation
- Enhanced text with gradient backgrounds and text shadows
- Added unique animations for each theme (electric-pulse, cosmic-wave, etc.)
- Improved responsive design and accessibility features

2025-01-27 – Visuals starfield 3D flying effect
-----------------------------------------------
- Enhanced starfield animation to make stars fly towards the viewer
- Implemented 3D perspective projection with Z-depth sorting
- Added motion trails for fast-moving stars
- Enhanced star twinkling and color variation
- Added subtle mouse influence for interactive immersion
- Increased star count to 300 for more dynamic effect

2025-01-27 – Snake game difficulty settings
------------------------------------------
- Added Easy and Hard difficulty modes to Snake game
- Easy mode: 180ms step delay, Hard mode: 90ms step delay
- Dynamic speed changes without restarting the game
- Improved game loop management for better performance

2025-01-27 – Touch Demo improvements and fixes
---------------------------------------------
- Fixed touch demo drawing issues with improved event handling
- Added separate Mouse and Touch event handling
- Enhanced canvas pointer capture for reliable drag drawing
- Added visual debugging and test patterns
- Improved touch responsiveness and drawing accuracy

2025-01-27 – Scroll Test enhancements
------------------------------------
- Replaced simple item generation with interactive scroll-disc elements
- Added 3D transform effects based on scroll position and velocity
- Implemented smooth spinning animations using requestAnimationFrame
- Enhanced visual appeal with modern design elements

2025-01-27 – App version display and system integration
-----------------------------------------------------
- Added app version number display in System Info and About screens
- Enhanced system information retrieval with CPU usage, uptime, network, and storage
- Improved IPC communication between main and renderer processes
- Added comprehensive system monitoring capabilities

2025-01-27 – Raspberry Pi compatibility improvements
--------------------------------------------------
- Added Electron command line switches for Raspberry Pi compatibility
- Disabled GPU acceleration and enabled software rendering
- Added X11 platform hints to bypass problematic GPU/DRM paths
- Improved error handling and system compatibility

2025-01-27 – Code structure and bug fixes
----------------------------------------
- Fixed major structural bug in app.js where application logic was incorrectly nested
- Removed sound-related code due to file not found errors
- Enhanced error handling and debugging throughout the application
- Improved code organization and maintainability

2025-08-11 – Touch Demo layout + resizing
----------------------------------------
- Touch Demo canvas now fills remaining height and resizes with the window.
- Canvas uses devicePixelRatio for crisp strokes.

2025-08-11 – Back button and navigation
--------------------------------------
- Added simple in‑app history stack.
- Back button disabled when no history.

2025-08-11 – Kiosk / fullscreen and touch UX
-------------------------------------------
- Enabled fullscreen, frameless, kiosk mode for native feel.
- Hid mouse cursor on UI to avoid pointer jumps during touch.

2025-08-11 – 7" screen and scrolling improvements
-----------------------------------------------
- Set window and viewport to 1024×600.
- Enabled Chromium touch events.
- Scroll Test screen added with touch panning and drag‑to‑scroll fallback.
- Drawing canvas switched to smooth line strokes.

2025-08-11 – Logo, Save PNG, System Info, Settings
--------------------------------------------------
- Added Matrix logo on Home.
- Touch Demo can save PNGs to `~/Pictures/Showcase`.
- System Info shows memory percent and temperature via IPC.
- Added Settings screen with theme (dark/light) and sound toggle, saved to app data.

2025-08-11 – Visuals screen
---------------------------
- New Visuals screen with three demos: Particles, Ripples, and Analog Clock.
- Interactive: touch/mouse influences particles and spawns ripples.

2025-08-11 – Raspberry Pi setup & autostart
-------------------------------------------
- Added `RPI_SETUP.md` with step‑by‑step Pi instructions.
- Added scripts: `scripts/install-autostart.sh`, `scripts/start-showcase.sh`, `scripts/uninstall-autostart.sh`.

2025-08-11 – Git quick reference
-------------------------------
- Added `GIT_QUICK_REFERENCE.md` with push/pull commands for PC and Pi.

2025-08-11 – Initial scaffold
-----------------------------
- Electron app scaffold with `main.js`, `preload.js`, `renderer/` UI, local assets folders, and basic styles.
- README and `.gitignore` added.

