# Augmented Reality Demo

This AR demo uses **AR.js** and **A-Frame** to provide marker-based augmented reality capabilities using your Raspberry Pi camera.

## Features

### 🎯 **Marker-Based AR Tracking**
- Uses the standard **Hiro marker** for reliable tracking
- Supports custom pattern markers
- Real-time marker detection and tracking
- Smooth object positioning and movement

### 🎮 **Interactive 3D Objects**
- **Rotating Cube**: Animated blue cube with smooth rotation
- **Bouncing Sphere**: Red sphere with bounce animation
- **AR Text**: "Hello AR!" text that rotates continuously
- **Dynamic Lighting**: Realistic lighting and shadows

### 📱 **User Interface**
- **Status Indicator**: Shows camera and AR tracking status
- **Object Controls**: Toggle individual AR objects on/off
- **Marker Selection**: Switch between Hiro and custom markers
- **Screenshot Capture**: Save AR experiences as images
- **Fullscreen Mode**: Immersive AR experience

### 🔧 **Raspberry Pi Optimizations**
- **Automatic Quality Detection**:
  - Pi 3B+: Low quality mode (basic rendering)
  - Pi 4: Medium quality mode (balanced performance)
  - Pi 5: High quality mode (full effects)
- **Adaptive Performance**: Adjusts based on hardware capabilities
- **Touch-Friendly**: Optimized for touchscreen displays

## How It Works

### Camera Integration
```javascript
// WebRTC camera access
navigator.mediaDevices.getUserMedia({ 
  video: { facingMode: 'environment' } 
})
```

### AR Tracking
```html
<!-- AR.js marker detection -->
<a-marker preset="hiro" smooth="true">
  <a-box position="0 0.5 0" rotation="0 45 0"></a-box>
</a-marker>
```

### 3D Rendering
```html
<!-- A-Frame 3D objects -->
<a-scene embedded arjs>
  <a-box material="color: #4CC3D9" 
         animation="property: rotation; to: 0 405 0; loop: true">
  </a-box>
</a-scene>
```

## Usage Instructions

### 1. **Setup**
- Ensure camera module is enabled on Pi
- Print the Hiro marker (5cm x 5cm minimum)
- Launch from main menu → "AR Demo"

### 2. **Camera Permission**
- Allow camera access when prompted
- Position camera toward marker
- Ensure good lighting conditions

### 3. **AR Interaction**
- Point camera at printed marker
- 3D objects appear on marker
- Use side panel to control objects
- Capture screenshots of AR scenes

### 4. **Controls**
- **Object Toggle**: Show/hide individual 3D objects
- **Marker Switch**: Change between Hiro and custom markers
- **Reset Scene**: Restore all objects to default state
- **Screenshot**: Capture current AR view

## Technical Implementation

### Libraries Used
- **AR.js 3.4.5**: Marker-based AR tracking
- **A-Frame 1.4.0**: WebXR and 3D rendering framework
- **WebRTC**: Camera stream access
- **WebGL**: Hardware-accelerated 3D graphics

### Browser Compatibility
- ✅ **Chromium** (recommended for Raspberry Pi)
- ✅ **Firefox**
- ✅ **Chrome**
- ⚠️ **Safari** (limited WebXR support)

### Performance Features
- Automatic quality scaling based on Pi model
- GPU memory optimization for smooth rendering
- Efficient marker tracking algorithms
- Adaptive frame rate management

## AR Object Descriptions

### Rotating Cube
- **Color**: Cyan blue (#4CC3D9)
- **Animation**: 360° rotation every 10 seconds
- **Size**: 1x1x1 units
- **Shadow**: Realistic shadow casting

### Bouncing Sphere
- **Color**: Pink/Red (#EF2D5E)
- **Animation**: Vertical bounce motion
- **Radius**: 0.5 units
- **Physics**: Smooth easing animation

### AR Text
- **Content**: "Hello AR!"
- **Color**: Gold (#FFC65D)
- **Animation**: Continuous 360° rotation
- **Scale**: 2x normal size for visibility

## Troubleshooting

### Camera Issues
- Check browser permissions
- Verify camera module is enabled
- Ensure adequate lighting
- Try refreshing the page

### Marker Detection
- Print marker on white paper
- Keep marker flat and unobstructed
- Maintain 20-50cm distance from camera
- Avoid shadows on marker surface

### Performance Issues
- Close other browser tabs
- Increase GPU memory split (raspi-config)
- Use recommended browsers
- Ensure good lighting for tracking

## Development Notes

### Debug Commands
```javascript
// Browser console commands
arDebug.getMarkerState()      // Check marker visibility
arDebug.getObjectStates()     // Get object visibility
arDebug.getCurrentMarker()    // Get active marker type
arDebug.forceMarkerFound()    // Trigger animations
arDebug.resetAll()           // Reset entire scene
```

### Quality Modes
```javascript
// Automatic detection
const quality = getQualityMode(); // 'low', 'medium', 'high'

// Manual override (for testing)
applyQualityOptimizations('high');
```

## Future Enhancements

- 🎯 **Markerless AR**: SLAM-based tracking
- 🎮 **Interactive Games**: AR-based mini-games
- 🔧 **3D Model Loading**: Import custom 3D models
- 📱 **Multi-Marker Support**: Multiple simultaneous markers
- 🌐 **Network AR**: Shared AR experiences
- 🎨 **AR Drawing**: 3D drawing in space

Experience the future of interactive computing with AR on your Raspberry Pi!
