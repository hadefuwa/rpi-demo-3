Git Quick Reference for RPI-5Inch
=================================

Use these copy‑paste snippets to push from your PC and pull on the Raspberry Pi.

Repo URL: https://github.com/hadefuwa/RPI-5Inch.git

One‑time setup on your PC (if not already done)
-----------------------------------------------
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git clone https://github.com/hadefuwa/RPI-5Inch.git
cd RPI-5Inch
```

Push changes from your PC
-------------------------
```bash
cd RPI-5Inch
git status
git add -A
git commit -m "Describe your change"
git pull --rebase origin main
git push origin main
```

Pull latest on the Raspberry Pi
-------------------------------
```bash
cd ~/RPI-5Inch
git fetch origin
git pull --rebase origin main
npm install
npm start
```

Discard local changes on the Pi (clean reset)
---------------------------------------------
```bash
cd ~/RPI-5Inch
git fetch origin
git reset --hard origin/main
git clean -fd
```

Optional: work on a feature branch
----------------------------------
```bash
cd RPI-5Inch
git checkout -b feature/your-topic
git add -A
git commit -m "Work in progress"
git push -u origin feature/your-topic
```

Helpful checks
--------------
```bash
git log --oneline -n 10
git diff
git remote -v
```


