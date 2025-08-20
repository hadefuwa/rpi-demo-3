Force camera permissions via policy
Create a policy file to auto-grant camera access:
bashsudo mkdir -p /etc/chromium-browser/policies/managed
sudo nano /etc/chromium-browser/policies/managed/camera.json
Add this content:
json{
  "DefaultMediaStreamSetting": 1,
  "MediaStreamMicrophoneSettingsPerSite": {
    "http://localhost:3000,*": 1
  },
  "MediaStreamCameraSettingsPerSite": {
    "http://localhost:3000,*": 1
  }
}