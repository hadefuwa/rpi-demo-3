Push 
-------------------------
```bash
cd RPI-5Inch
git status
git add -A
git commit -m "Describe your change"
git pull --rebase origin main
git push origin main
```

Pull 
-------------------------------
```bash
cd ~/RPI-5Inch
git fetch origin
git reset --hard origin/main
git clean -fd
npm install
DISPLAY=:0 npm start

