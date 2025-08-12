# Git Quick Reference

## Push
```bash
cd ~/rpi-demo-3
git add .
git commit -m "Update message here"
git push origin main
```

## Pull 
```bash
cd ~/rpi-demo-3
git fetch origin
git reset --hard origin/main
git clean -fd
npm install
chmod +x scripts/*.sh
npm run kiosk
```

## Troubleshooting Kiosk Mode
If you get "localhost:3000 can't be found" error:

```bash
# Method 1: Start server manually first
cd ~/rpi-demo-3
npm run serve &
sleep 5
npm run kiosk

# Method 2: Use development server
npm run dev

# Method 3: Check if http-server is installed
npm install http-server

# Method 4: Kill existing processes and restart
pkill -f http-server
pkill -f chromium
npm run kiosk
```


#Create and push your first revision tag
git tag -a rev1 -m "Rev 1 released"
git push origin main --tags

#When ready for the next release
git add -A
git commit -m "Prepare for Rev 2 release"
git tag -a rev2.1 -m "Rev 2 released"
git push origin main --tags