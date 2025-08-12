# RPI 5Inch Showcase - Progressive Web App

A beautiful, touch-optimized Progressive Web App (PWA) designed specifically for 5-inch Raspberry Pi displays. This showcase application demonstrates various capabilities including touch interactions, games, 3D models, and system information.

## 🚀 Features

- **Progressive Web App (PWA)** - Installable, offline-capable web application
- **Touch Optimized** - Designed for touchscreen displays with gesture support
- **Responsive Design** - Adapts to different screen sizes and orientations
- **Offline Support** - Service worker caching for offline functionality
- **Kiosk Mode** - Full-screen kiosk mode for Raspberry Pi displays
- **Multiple Screens** - Touch demo, games hub, system info, and more
- **3D Model Viewer** - STL file viewing capabilities
- **Game Collection** - Memory, Snake, Ping Pong, and other games

## 📁 Project Structure

```
RPI-5Inch/
├── public/                 # Public assets (served directly)
│   ├── index.html         # Main application entry point
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   ├── assets/           # Images, 3D models, fonts
│   ├── icons/            # PWA icons (generated)
│   └── fonts/            # Custom fonts
├── src/                   # Source code
│   ├── styles/           # CSS stylesheets
│   ├── screens/          # HTML screen templates
│   └── js/               # JavaScript modules
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
- Raspberry Pi with 5-inch display (optional, for full experience)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hadefuwa/rpi-5inch-showcase.git
   cd rpi-5inch-showcase
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

- **Primary**: Raspberry Pi with 5-inch touchscreen
- **Secondary**: Desktop browsers
- **Mobile**: Touch-enabled mobile devices
- **Kiosk**: Public display systems

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
1. Transfer files to Pi
2. Install dependencies: `npm install --production`
3. Start service: `npm run install-service`
4. Enable kiosk mode: `npm run kiosk`

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

