# RPI 5Inch Showcase - Progressive Web App

A beautiful 5-inch Raspberry Pi showcase application built as a Progressive Web App (PWA).

## Features

- **Touch Demo** - Interactive touch interface demonstration
- **System Info** - Raspberry Pi system information display
- **Games Hub** - Collection of mini-games and entertainment
- **Scroll Test** - Touch scrolling functionality test
- **Visuals** - Visual effects and animations
- **3D Model** - STL file viewer and 3D model showcase
- **Settings** - Application configuration options
- **About** - Project information and credits

## PWA Features

- ✅ **Installable** - Can be installed on desktop and mobile devices
- ✅ **Offline Support** - Works without internet connection
- ✅ **Responsive Design** - Optimized for 5-inch touch displays
- ✅ **Fast Loading** - Service worker caching for improved performance

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at: http://127.0.0.1:3000

### Production
```bash
# Build for production
npm run build

# Serve production build
npm run serve
```

## Installation

1. Open the app in Chrome/Edge
2. Click the install button in the address bar
3. Or use the browser menu: More Tools > Create Shortcut

## File Structure

```
RPI-5Inch/
├── renderer/           # Main application files
│   ├── index.html     # Main HTML file
│   ├── manifest.json  # PWA manifest
│   ├── sw.js         # Service worker
│   ├── styles/       # CSS stylesheets
│   └── screens/      # Screen components
├── assets/            # Images, fonts, 3D models
└── package.json       # Project configuration
```

## Browser Support

- Chrome 67+
- Edge 79+
- Firefox 67+
- Safari 11.1+

## License

MIT License - see LICENSE file for details

