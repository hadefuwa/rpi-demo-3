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
git pull --rebase origin main
npm install
npm start
DISPLAY=:0 npm start

