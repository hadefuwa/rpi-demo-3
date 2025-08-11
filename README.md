# RPI-5Inch Showcase App

A beautiful 5-inch Raspberry Pi Electron showcase application with multiple interactive screens, games, and visual effects.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Electron 30+
- Raspberry Pi (recommended) or Windows/macOS

### Installation
```bash
git clone <repository-url>
cd RPI-5Inch
npm install
```

### Running the App

#### Windows
```cmd
npm run start:windows
# Or use the batch file
scripts\start-windows.bat
```

#### Raspberry Pi
```bash
npm run start:raspberry-pi
# Or with display specification
DISPLAY=:0 npm start
```

#### macOS/Linux
```bash
npm start
```

#### Debug Mode
```bash
npm run start:debug
```

## 🔧 Fixing Common Errors

### GBM Wrapper Errors (Raspberry Pi)

If you see these errors:
```
[ERROR:gbm_wrapper.cc(72)] Failed to get fd for plane.: No such file or directory (2)
[ERROR:gbm_wrapper.cc(255)] Failed to export buffer to dma_buf: No such file or directory (2)
```

**Quick Fix:**
```bash
# Run the optimization script
chmod +x scripts/raspberry-pi-optimization.sh
./scripts/raspberry-pi-optimization.sh
sudo reboot
```

**Manual Fix:**
1. Edit `/boot/config.txt`:
   ```bash
   sudo nano /boot/config.txt
   ```
2. Add these lines:
   ```
   gpu_mem=256
   dtoverlay=vc4-fkms-v3d
   gpu_mem_256=1
   ```
3. Reboot: `sudo reboot`

### App Crashes on Startup

- **Windows**: Use `npm run start:windows`
- **Raspberry Pi**: Use `npm run start:raspberry-pi`
- **Debug**: Use `npm run start:debug`

## 📱 Features

- **Home Screen**: Main navigation hub
- **Games**: Snake, Ping Pong, Memory, Tic-Tac-Toe
- **Visuals**: Particle effects, animations, and graphics
- **STL Viewer**: 3D model visualization
- **Touch Demo**: Interactive touchscreen testing
- **System Info**: Real-time performance monitoring
- **Settings**: Theme and sound preferences

## 🎮 Games

- **Snake**: Classic snake game with touch controls
- **Ping Pong**: AI-powered ping pong game
- **Memory**: Card matching game
- **Tic-Tac-Toe**: Strategic board game

## 🎨 Visual Effects

- Particle systems
- Animated backgrounds
- Ripple effects
- Starfield animations
- Fireworks
- Clock visualization
- Audio equalizer

## 🖥️ Platform Support

- **Raspberry Pi**: Optimized for 5-inch displays
- **Windows**: Full compatibility with optimizations
- **macOS**: Native support
- **Linux**: Cross-platform compatibility

## 🚀 Performance Optimization

### Raspberry Pi
- GPU memory optimization
- Software rendering fallback
- CPU governor optimization
- Memory management tuning

### Windows
- Hardware acceleration control
- GPU process management
- Memory optimization
- Error suppression

## 📁 Project Structure

```
RPI-5Inch/
├── main.js                 # Main Electron process
├── preload.js             # Preload script for security
├── renderer/              # Frontend application
│   ├── index.html        # Main HTML file
│   ├── app.js            # Main application logic
│   ├── js/               # JavaScript utilities
│   ├── screens/          # Individual screen HTML files
│   └── styles/           # CSS stylesheets
├── assets/                # Images, fonts, and 3D models
├── scripts/               # Utility and optimization scripts
└── docs/                  # Documentation
```

## 🔧 Development

### Adding New Screens
1. Create HTML file in `renderer/screens/`
2. Add CSS in `renderer/styles/`
3. Initialize in `renderer/app.js`
4. Add navigation in screen loader

### Adding New Games
1. Create game logic in `renderer/app.js`
2. Add canvas element to screen HTML
3. Implement game loop and controls
4. Add to games screen

## 📊 System Requirements

### Minimum
- **CPU**: 1GHz ARM or x86
- **RAM**: 512MB
- **Storage**: 100MB
- **Display**: 800x600 resolution

### Recommended
- **CPU**: 1.4GHz quad-core ARM or x86
- **RAM**: 2GB+
- **Storage**: 1GB+
- **Display**: 1024x768+ resolution

## 🐛 Troubleshooting

For detailed troubleshooting information, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

### Common Issues
1. **Graphics errors**: Run optimization script
2. **App crashes**: Use platform-specific start commands
3. **Touch issues**: Check device permissions
4. **Performance**: Monitor system resources

## 📝 Scripts

- `scripts/raspberry-pi-optimization.sh`: Pi optimization
- `scripts/start-windows.bat`: Windows startup
- `scripts/monitor-performance.sh`: Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on target platform
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Electron team for the framework
- Raspberry Pi Foundation for the hardware
- Open source community for inspiration

---

**Note**: This app is optimized for Raspberry Pi but works on all platforms. For best performance on Pi, run the optimization script after installation.

