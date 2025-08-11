Raspberry Pi 5 Setup Guide (Auto-Start Electron App)
====================================================

This guide shows you, step by step, how to put the app on a Raspberry Pi 5 and make it start automatically on boot.

Tested with Raspberry Pi OS (Bookworm). The repo you cloned is `RPI-5Inch` (GitHub: https://github.com/hadefuwa/RPI-5Inch).

1) Prepare your Raspberry Pi
----------------------------

- Make sure the Pi boots to the Desktop automatically:
  - Open: `sudo raspi-config`
  - Go to: System Options → Boot / Auto Login → `Desktop Autologin`
- (Optional) Set your display to the correct resolution for your 5" screen (often 800×480), if needed.
- Disable screen blanking so the screen doesn’t turn off:
  - In `raspi-config`: Display Options → Screen Blanking → `No`

2) Install required packages
----------------------------

Open Terminal on the Pi and run:

```
sudo apt update
sudo apt install -y git curl
```

3) Install Node.js LTS (simple method)
--------------------------------------

Install Node.js 20 LTS using NodeSource:

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Check it works:

```
node -v
npm -v
```

4) Get the app and install dependencies
---------------------------------------

```
cd ~
git clone https://github.com/hadefuwa/RPI-5Inch.git
cd RPI-5Inch
npm install
```

Test it manually:

```
npm start
```

You should see the app window on the Pi’s desktop.

5) Install auto-start (runs at desktop login)
---------------------------------------------

From inside the repo folder:

```
chmod +x scripts/*.sh
./scripts/install-autostart.sh
```

What this does:
- Creates the folder `~/.config/autostart` if it doesn’t exist.
- Installs a desktop entry that runs a small start script which launches the app.
- On next boot, the app will start automatically when the desktop session starts.

To remove auto-start later:

```
./scripts/uninstall-autostart.sh
```

6) Reboot to test
-----------------

```
sudo reboot
```

When the Pi boots to the desktop, the app should start automatically.

7) Troubleshooting
------------------

- If you don’t see the app after reboot:
  - Check that you enabled “Desktop Autologin” in `raspi-config`.
  - Check that `~/.config/autostart/rpi-showcase.desktop` exists.
  - Try running the app manually: `cd ~/RPI-5Inch && npm start`
- If the screen still blanks:
  - Re-check `raspi-config` Screen Blanking is set to `No`.
- If `npm install` fails:
  - Make sure date/time are correct (TLS can fail if clock is wrong).
  - Run `sudo apt update` and try again.

That’s it. Your Electron app is now set to auto-run on the Raspberry Pi 5 desktop.

