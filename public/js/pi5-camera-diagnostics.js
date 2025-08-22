/**
 * Pi 5 Camera Diagnostics
 * Helps debug camera issues specific to Raspberry Pi 5
 */
(function() {
    'use strict';
    
    // Diagnostic information collector
    window.Pi5CameraDiagnostics = {
        
        // Check if we're on a Pi 5
        isPi5: function() {
            const userAgent = navigator.userAgent.toLowerCase();
            return userAgent.includes('aarch64') || userAgent.includes('armv8');
        },
        
        // Get detailed device info
        getDeviceInfo: function() {
            return {
                userAgent: navigator.userAgent,
                cores: navigator.hardwareConcurrency || 'unknown',
                memory: navigator.deviceMemory || 'unknown',
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    pixelRatio: window.devicePixelRatio
                },
                window: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                location: {
                    protocol: location.protocol,
                    hostname: location.hostname,
                    port: location.port
                }
            };
        },
        
        // Check camera availability
        checkCameraSupport: async function() {
            const support = {
                mediaDevices: !!navigator.mediaDevices,
                getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
                permissions: !!navigator.permissions,
                webrtc: !!window.RTCPeerConnection
            };
            
            if (support.permissions) {
                try {
                    const permission = await navigator.permissions.query({ name: 'camera' });
                    support.permissionState = permission.state;
                } catch (e) {
                    support.permissionState = 'query-failed';
                }
            }
            
            return support;
        },
        
        // Test basic camera access
        testBasicCamera: async function() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }
            
            console.log('🧪 Testing basic camera access...');
            
            // Try the most basic constraints first
            const constraints = { video: true };
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log('✅ Basic camera access successful');
                
                // Clean up
                stream.getTracks().forEach(track => track.stop());
                
                return {
                    success: true,
                    message: 'Basic camera access works'
                };
            } catch (error) {
                console.error('❌ Basic camera access failed:', error);
                return {
                    success: false,
                    error: error.name,
                    message: error.message
                };
            }
        },
        
        // Test Pi 5 specific constraints
        testPi5Constraints: async function() {
            if (!this.isPi5()) {
                return { skipped: true, message: 'Not a Pi 5' };
            }
            
            console.log('🔍 Testing Pi 5 specific constraints...');
            
            const constraintSets = [
                // Basic libcamera constraints
                {
                    name: 'libcamera-basic',
                    constraints: {
                        video: {
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 15 }
                        }
                    }
                },
                // Minimal constraints
                {
                    name: 'minimal',
                    constraints: {
                        video: {
                            width: 640,
                            height: 480
                        }
                    }
                },
                // Auto constraints
                {
                    name: 'auto',
                    constraints: {
                        video: true
                    }
                }
            ];
            
            const results = [];
            
            for (const set of constraintSets) {
                try {
                    console.log(`Testing ${set.name} constraints...`);
                    const stream = await navigator.mediaDevices.getUserMedia(set.constraints);
                    
                    // Get actual stream info
                    const videoTrack = stream.getVideoTracks()[0];
                    const settings = videoTrack.getSettings();
                    
                    results.push({
                        name: set.name,
                        success: true,
                        settings: settings
                    });
                    
                    // Clean up
                    stream.getTracks().forEach(track => track.stop());
                    
                    console.log(`✅ ${set.name} constraints work`);
                    
                } catch (error) {
                    results.push({
                        name: set.name,
                        success: false,
                        error: error.name,
                        message: error.message
                    });
                    
                    console.log(`❌ ${set.name} constraints failed:`, error.message);
                }
            }
            
            return results;
        },
        
        // Get available camera devices
        getCameraDevices: async function() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                return { error: 'enumerateDevices not supported' };
            }
            
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                
                return {
                    total: devices.length,
                    video: videoDevices.length,
                    devices: videoDevices.map(device => ({
                        deviceId: device.deviceId,
                        label: device.label || 'Camera (permission needed)',
                        groupId: device.groupId
                    }))
                };
            } catch (error) {
                return { error: error.message };
            }
        },
        
        // Run full diagnostic
        runFullDiagnostic: async function() {
            console.log('🔬 Running Pi 5 camera diagnostic...');
            
            const diagnostic = {
                timestamp: new Date().toISOString(),
                deviceInfo: this.getDeviceInfo(),
                isPi5: this.isPi5(),
                cameraSupport: await this.checkCameraSupport(),
                devices: await this.getCameraDevices()
            };
            
            // Test basic camera
            try {
                diagnostic.basicCameraTest = await this.testBasicCamera();
            } catch (error) {
                diagnostic.basicCameraTest = { error: error.message };
            }
            
            // Test Pi 5 specific constraints if applicable
            if (this.isPi5()) {
                try {
                    diagnostic.pi5ConstraintTests = await this.testPi5Constraints();
                } catch (error) {
                    diagnostic.pi5ConstraintTests = { error: error.message };
                }
            }
            
            console.log('📊 Diagnostic Results:', diagnostic);
            return diagnostic;
        },
        
        // Generate diagnostic report
        generateReport: async function() {
            const diagnostic = await this.runFullDiagnostic();
            
            let report = '=== Pi 5 Camera Diagnostic Report ===\n\n';
            
            report += `Timestamp: ${diagnostic.timestamp}\n`;
            report += `Device: ${diagnostic.isPi5 ? 'Raspberry Pi 5' : 'Other device'}\n`;
            report += `User Agent: ${diagnostic.deviceInfo.userAgent}\n`;
            report += `Cores: ${diagnostic.deviceInfo.cores}\n`;
            report += `Memory: ${diagnostic.deviceInfo.memory}GB\n`;
            report += `Protocol: ${diagnostic.deviceInfo.location.protocol}\n`;
            report += `Host: ${diagnostic.deviceInfo.location.hostname}\n\n`;
            
            report += '--- Camera Support ---\n';
            report += `MediaDevices: ${diagnostic.cameraSupport.mediaDevices}\n`;
            report += `getUserMedia: ${diagnostic.cameraSupport.getUserMedia}\n`;
            report += `Permissions API: ${diagnostic.cameraSupport.permissions}\n`;
            report += `Permission State: ${diagnostic.cameraSupport.permissionState || 'unknown'}\n\n`;
            
            report += '--- Camera Devices ---\n';
            if (diagnostic.devices.error) {
                report += `Error: ${diagnostic.devices.error}\n`;
            } else {
                report += `Total Devices: ${diagnostic.devices.total}\n`;
                report += `Video Devices: ${diagnostic.devices.video}\n`;
                diagnostic.devices.devices.forEach((device, i) => {
                    report += `  ${i + 1}. ${device.label} (${device.deviceId.substring(0, 10)}...)\n`;
                });
            }
            report += '\n';
            
            report += '--- Basic Camera Test ---\n';
            if (diagnostic.basicCameraTest.success) {
                report += `Result: ✅ SUCCESS\n`;
                report += `Message: ${diagnostic.basicCameraTest.message}\n`;
            } else {
                report += `Result: ❌ FAILED\n`;
                report += `Error: ${diagnostic.basicCameraTest.error}\n`;
                report += `Message: ${diagnostic.basicCameraTest.message}\n`;
            }
            report += '\n';
            
            if (diagnostic.pi5ConstraintTests) {
                report += '--- Pi 5 Constraint Tests ---\n';
                diagnostic.pi5ConstraintTests.forEach(test => {
                    if (test.success) {
                        report += `${test.name}: ✅ SUCCESS\n`;
                        if (test.settings) {
                            report += `  Resolution: ${test.settings.width}x${test.settings.height}\n`;
                            report += `  Frame Rate: ${test.settings.frameRate}fps\n`;
                        }
                    } else {
                        report += `${test.name}: ❌ FAILED - ${test.error}: ${test.message}\n`;
                    }
                });
                report += '\n';
            }
            
            // Recommendations
            report += '--- Recommendations ---\n';
            if (diagnostic.isPi5) {
                if (!diagnostic.basicCameraTest.success) {
                    report += '1. Check camera cable connection\n';
                    report += '2. Run: sudo apt update && sudo apt install libcamera-tools\n';
                    report += '3. Test camera: libcamera-still -o test.jpg\n';
                    report += '4. Enable camera: sudo raspi-config nonint do_camera 0\n';
                    report += '5. Reboot the Pi\n';
                } else {
                    report += '1. Basic camera works - issue may be with constraints\n';
                    report += '2. Try different browser if issues persist\n';
                    report += '3. Check for other apps using camera\n';
                }
            } else {
                report += '1. Device is not Pi 5 - standard troubleshooting applies\n';
            }
            
            return report;
        }
    };
    
    // Auto-run diagnostic if on Pi 5 and camera page
    if (window.location.pathname.includes('camera.html')) {
        console.log('📱 Pi 5 Camera Diagnostics loaded');
        console.log('🔧 Run Pi5CameraDiagnostics.runFullDiagnostic() to test camera');
        console.log('📄 Run Pi5CameraDiagnostics.generateReport() for full report');
        
        // Auto-run basic check on Pi 5
        if (window.Pi5CameraDiagnostics.isPi5()) {
            setTimeout(() => {
                console.log('🔍 Auto-running Pi 5 camera diagnostic...');
                window.Pi5CameraDiagnostics.runFullDiagnostic();
            }, 2000);
        }
    }
    
})();
