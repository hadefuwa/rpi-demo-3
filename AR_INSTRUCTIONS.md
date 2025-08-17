# AR Demo Instructions

## How to Use the Augmented Reality Demo

The AR Demo uses WebXR and AR.js to provide marker-based augmented reality using your Raspberry Pi camera.

### Requirements
- Raspberry Pi with camera module enabled
- Modern web browser (Chromium recommended)
- Printed AR marker (see below)
- Good lighting conditions

### AR Markers

The demo supports two types of markers:

#### 1. Hiro Marker (Default)
The Hiro marker is a built-in AR.js marker. You can download and print it from:
- https://github.com/AR-js-org/AR.js/blob/master/data/images/hiro.png

#### 2. Custom Pattern Marker
A simple custom marker is also available in the demo.

### Setup Instructions

1. **Enable Camera**: Make sure camera access is allowed in your browser
2. **Print Marker**: Print the Hiro marker on white paper (minimum 5cm x 5cm)
3. **Lighting**: Ensure good lighting - avoid shadows on the marker
4. **Distance**: Hold marker 20-50cm from camera for best tracking

### Camera Setup for Raspberry Pi

If you haven't enabled the camera module:

```bash
# Enable camera module
sudo raspi-config
# Navigate to Interfacing Options > Camera > Enable

# Reboot
sudo reboot

# Test camera
raspistill -v -o test.jpg
```

### Using the AR Demo

1. **Launch Demo**: Click "AR Demo" from the main menu
2. **Allow Camera**: Grant camera permission when prompted
3. **Show Marker**: Point camera at printed marker
4. **Interact**: Use the side panel to toggle AR objects
5. **Capture**: Take screenshots of your AR experience

### AR Objects Available

- **Rotating Cube**: Blue animated cube
- **Bouncing Sphere**: Red sphere that bounces up and down
- **AR Text**: "Hello AR!" text that rotates
- **Custom Objects**: Switch between different markers

### Controls

- **🏠 Home**: Return to main menu
- **🔄 Reset**: Reset all AR objects and settings
- **📹 Camera**: Toggle camera (limited functionality)
- **⛶ Fullscreen**: Enter/exit fullscreen mode
- **📸 Screenshot**: Capture and download AR screenshot

### Troubleshooting

#### Camera Not Working
- Check camera permissions in browser
- Ensure camera module is enabled on Pi
- Try refreshing the page
- Check browser console for errors

#### Marker Not Detected
- Ensure good lighting
- Keep marker flat and visible
- Adjust distance (20-50cm works best)
- Try different angles
- Print marker larger if needed

#### Performance Issues
- The demo automatically adjusts quality based on Pi model
- Pi 3B+: Low quality mode
- Pi 4: Medium quality mode
- Pi 5: High quality mode

#### Browser Compatibility
- Chromium (recommended for Pi)
- Firefox
- Chrome
- Safari (limited AR.js support)

### Technical Details

The AR demo uses:
- **AR.js**: Open source AR library
- **A-Frame**: WebVR/WebXR framework
- **WebRTC**: For camera access
- **WebGL**: For 3D rendering

### Performance Optimization

The demo includes automatic quality detection:

```javascript
// Manual quality override (console commands)
arDebug.getMarkerState()      // Check marker visibility
arDebug.getObjectStates()     // Get object states
arDebug.getCurrentMarker()    // Get current marker type
arDebug.forceMarkerFound()    // Test animations
arDebug.resetAll()           // Reset everything
```

### Creating Custom Markers

You can create custom markers using:
1. AR.js marker generator: https://ar-js-org.github.io/AR.js-Docs/marker-based/
2. Upload your image and generate marker files
3. Replace the marker URL in the HTML code

### Browser Console Commands

Open browser console (F12) and try:
- `arDebug.getMarkerState()` - Check if marker is visible
- `arDebug.resetAll()` - Reset entire scene

Enjoy experimenting with Augmented Reality on your Raspberry Pi!
