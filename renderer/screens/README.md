# Screen Files Structure

This directory contains individual HTML files for each screen/section of the RPI 5" Showcase app.

## Structure

```
renderer/screens/
├── home.html          # Home screen with main navigation
├── touch.html         # Touch demo with drawing canvas
├── info.html          # System dashboard and monitoring
├── games.html         # Games hub selection screen
├── game.html          # Tic-tac-toe game
├── memory.html        # Memory match game
├── snake.html         # Snake game
├── pingpong.html      # Ping pong game
├── scroll.html        # Scroll test screen
├── visuals.html       # Visual effects and animations
├── stl.html           # 3D STL model viewer
├── settings.html      # App settings and configuration
└── about.html         # About information
```

## Benefits of Modular Structure

1. **Easier Maintenance**: Each screen is in its own file, making it easier to find and edit specific functionality
2. **Better Organization**: Clear separation of concerns and logical grouping
3. **Faster Development**: Developers can work on different screens simultaneously without conflicts
4. **Easier Testing**: Individual screens can be tested in isolation
5. **Code Reusability**: Common components can be shared between screens
6. **Smaller File Sizes**: Each file is focused and manageable

## How It Works

- **Screen Loader**: The `js/screen-loader.js` utility dynamically loads screen HTML files
- **Lazy Loading**: Screens are only loaded when needed, improving performance
- **Caching**: Once loaded, screens are cached for faster subsequent access
- **Event System**: Custom events are dispatched when screens change for proper initialization

## Adding New Screens

1. Create a new HTML file in this directory (e.g., `newfeature.html`)
2. Follow the naming convention: `screen-{name}.html`
3. Include the screen element with proper ID and classes
4. Add initialization logic in `screen-loader.js` if needed
5. Update navigation in `home.html` if it's a main screen

## Example Screen Structure

```html
<section id="screen-{name}" class="screen">
  <div class="panel">
    <h2>Screen Title</h2>
    <!-- Screen content here -->
  </div>
</section>
```

## Integration

The main `index.html` file now contains only:
- Header with navigation
- Screen container (`#screen-container`)
- Script references

All screen content is loaded dynamically by the ScreenLoader utility.
