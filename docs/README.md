# RPI Demo 3 - Progressive Web App Showcase

A beautiful, touch-optimized Progressive Web App (PWA) designed specifically for Raspberry Pi displays. This showcase application demonstrates various capabilities including touch interactions, games, 3D STL model viewing, and system information displays.

## 🚀 Features

- **Progressive Web App (PWA)** - Installable, offline-capable web application
- **Touch Optimized** - Designed for touchscreen displays with gesture support
- **3D STL Viewer** - Interactive 3D model viewer with starlit galaxy background
- **Responsive Design** - Adapts to different screen sizes and orientations
- **Offline Support** - Service worker caching for offline functionality
- **Kiosk Mode** - Full-screen kiosk mode for Raspberry Pi displays
- **Multiple Screens** - Touch demo, games hub, system info, STL viewer, and more
- **Game Collection** - Memory, Snake, Ping Pong, and other interactive games
- **Visual Effects** - Animated backgrounds and smooth transitions

## 📁 Project Structure

```
rpi-demo-3/
├── public/                 # Public assets (served directly)
│   ├── index.html         # Main application entry point
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   ├── assets/           # Images, 3D models (STL files), fonts
│   │   ├── cad1.stl      # 3D model files
│   │   ├── cad2.stl
│   │   └── cad3.stl
│   ├── screens/          # Individual screen HTML files
│   │   ├── stl.html      # 3D STL viewer
│   │   ├── games.html    # Games hub
│   │   └── ...
│   └── styles/           # CSS stylesheets
│       ├── base.css      # Core styling system
│       ├── stl.css       # STL viewer styles
│       └── ...
├── src/                   # Source development files
├── scripts/               # Utility scripts
│   ├── start-kiosk.sh    # Kiosk mode launcher
│   ├── install-autostart.sh
│   └── uninstall-autostart.sh
├── pwa.config.js         # PWA configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Raspberry Pi with display (optional, for full experience)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hadefuwa/rpi-demo-3.git
   cd rpi-demo-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm run serve
```

## 🎮 Usage

### Development Mode
- `npm run dev` - Start development server with CORS enabled
- `npm run serve` - Start production server
- `npm start` - Start server and open browser automatically

### Kiosk Mode (Raspberry Pi)
```bash
npm run kiosk
```

### Service Management
```bash
npm run install-service    # Install autostart service
npm run uninstall-service  # Remove autostart service
```

## ✨ Featured Components

### 3D STL Viewer
- **Interactive 3D Models**: Load and view CAD files (cad1.stl, cad2.stl, cad3.stl)
- **Starlit Galaxy Background**: Beautiful animated star field backdrop
- **Touch Controls**: Drag to rotate, scroll to zoom, button controls
- **Multiple Models**: Switch between different 3D models seamlessly
- **Auto-rotation**: Optional automatic model rotation
- **Responsive Layout**: Optimized for all screen sizes

### Games Hub
- Memory matching game with customizable difficulty
- Classic Snake game with touch controls
- Ping Pong game with AI opponent
- Touch-optimized interfaces

### System Information
- Real-time system monitoring
- Touch-friendly information display
- Performance metrics

## 🔧 Configuration

### PWA Settings
Edit `pwa.config.js` to customize:
- App metadata
- Icon sizes and purposes
- Service worker strategies
- Build options
- Development server settings

### Service Worker
The service worker (`public/sw.js`) provides:
- Offline caching
- Background sync
- Update notifications
- Resource optimization

### Manifest
The PWA manifest (`public/manifest.json`) includes:
- App icons for various sizes
- Display preferences
- Theme colors
- App shortcuts

## 📱 PWA Features

### Installable
- Add to home screen
- App-like experience
- Offline functionality

### Offline Support
- Service worker caching
- Fallback content
- Background sync capability

### Touch Optimized
- Gesture support
- Touch-friendly UI
- Responsive design

## 🎯 Target Platforms

- **Primary**: Raspberry Pi with touchscreen displays
- **Secondary**: Desktop browsers (Chrome, Firefox, Safari)
- **Mobile**: Touch-enabled mobile devices and tablets
- **Kiosk**: Public display systems and embedded applications

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Server
```bash
npm run build
npm run serve
```

### Raspberry Pi Deployment
1. Clone repository to Pi: `git clone https://github.com/hadefuwa/rpi-demo-3.git`
2. Navigate to directory: `cd rpi-demo-3`
3. Install dependencies: `npm install --production`
4. Set permissions: `chmod +x scripts/*.sh`
5. Start kiosk mode: `npm run kiosk`

### Git Workflow
```bash
# Push changes
git add .
git commit -m "Update message here"
git push origin main

# Pull latest changes
git fetch origin
git reset --hard origin/main
git clean -fd
npm install
chmod +x scripts/*.sh
npm run kiosk
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Check browser console for errors
   - Ensure HTTPS or localhost
   - Clear browser cache

2. **Assets Not Loading**
   - Verify file paths in new structure
   - Check service worker cache
   - Clear browser cache

3. **Touch Not Working**
   - Ensure touch events are enabled
   - Check browser touch support
   - Verify CSS touch-action properties

### Debug Mode
Enable debug logging in service worker and check browser console for detailed information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Raspberry Pi Foundation for the amazing platform
- PWA community for best practices
- Contributors and testers

## 📞 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for the Raspberry Pi community**

