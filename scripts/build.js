#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building RPI 5Inch Showcase for deployment...');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy function
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(`📁 Copied: ${src} → ${dest}`);
  }
}

// Copy public files
const publicDir = path.join(__dirname, '..', 'public');
const publicFiles = fs.readdirSync(publicDir);
publicFiles.forEach(file => {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);
  copyRecursive(src, dest);
});

// Note: No longer copying src/ directory since all files are now in public/
// The public/ directory copy above includes everything we need

// Create .nojekyll file to prevent GitHub Pages Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('📄 Created .nojekyll file');

console.log('✅ Build complete! Files are ready in the dist/ directory.');
console.log('🚀 Ready for GitHub Pages deployment!');
