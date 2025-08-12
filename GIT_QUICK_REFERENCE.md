# Git Quick Reference

## Push
```bash
cd ~/rpi-5inch-2
git add .
git commit -m "Update message here"
git push origin main
```

## Pull 
```bash
cd ~/rpi-5inch-2
git fetch origin
git reset --hard origin/main
git clean -fd
npm install
chmod +x scripts/*.sh
npm run kiosk
```