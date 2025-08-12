# GitHub Pages Deployment Guide

## Overview
This project is configured to automatically deploy to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

## How It Works

### 1. Automatic Deployment
- **Trigger**: Push to `main` branch
- **Action**: GitHub Actions builds and deploys to GitHub Pages
- **Result**: Your PWA is available at `https://hadefuwa.github.io/rpi-5inch-2/`

### 2. Build Process
The build process:
1. Installs Node.js dependencies
2. Runs the build script (`scripts/build.js`)
3. Copies all necessary files to `dist/` directory
4. Deploys `dist/` contents to GitHub Pages

### 3. File Structure
After build, the `dist/` directory contains:
```
dist/
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
├── sw.js             # Service worker
├── assets/           # Images, fonts, 3D models
└── src/              # Source files (styles, screens, js)
```

## Manual Deployment

### Local Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test locally
npx http-server dist -p 3000
```

### Manual GitHub Pages Setup
If automatic deployment isn't working:

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created by GitHub Actions)
   - Folder: `/ (root)`

2. **Check Actions**:
   - Go to Actions tab
   - Verify deployment workflow is running
   - Check for any errors

## Troubleshooting

### Common Issues

#### 1. Build Fails
**Error**: Build step fails in GitHub Actions
**Solution**: 
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for syntax errors in source files

#### 2. Pages Not Updating
**Error**: GitHub Pages shows old content
**Solution**:
- Wait 5-10 minutes for deployment
- Check Actions tab for deployment status
- Clear browser cache
- Verify `gh-pages` branch has latest files

#### 3. Assets Not Loading
**Error**: Images, CSS, or JS files not found
**Solution**:
- Check file paths in HTML files
- Verify assets are copied to `dist/` during build
- Check browser console for 404 errors

#### 4. Service Worker Issues
**Error**: PWA not working offline
**Solution**:
- Verify `sw.js` is in root of `dist/`
- Check service worker registration in `index.html`
- Clear browser service worker cache

### Debug Steps

1. **Check GitHub Actions**:
   ```bash
   # View workflow runs
   # Go to Actions tab in repository
   ```

2. **Verify Build Output**:
   ```bash
   # Check dist directory locally
   npm run build
   ls -la dist/
   ```

3. **Test Locally**:
   ```bash
   # Serve built files
   npx http-server dist -p 3000
   # Open http://localhost:3000
   ```

4. **Check Browser Console**:
   - Open deployed site
   - Press F12 → Console
   - Look for errors

## Configuration Files

### GitHub Actions (`.github/workflows/deploy.yml`)
- Automates build and deployment
- Runs on push to main branch
- Uses Node.js 18
- Deploys to `gh-pages` branch

### Build Script (`scripts/build.js`)
- Cross-platform file copying
- Creates `dist/` directory
- Copies all necessary files
- Maintains directory structure

### Package.json Scripts
- `npm run build`: Builds for production
- `npm run deploy`: Builds and prepares for deployment

## Best Practices

1. **Always test locally** before pushing
2. **Check Actions tab** after each push
3. **Wait for deployment** before testing live site
4. **Use semantic commit messages** for better tracking
5. **Keep dependencies updated** to avoid build issues

## Support

If you're still having issues:
1. Check the Actions tab for error details
2. Review this deployment guide
3. Check browser console for client-side errors
4. Create an issue with detailed error information
