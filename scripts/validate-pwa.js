#!/usr/bin/env node

/**
 * PWA Validation Script
 * Validates that all PWA components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating PWA Configuration...\n');

// Check required files
const requiredFiles = [
  'public/index.html',
  'public/manifest.json',
  'public/sw.js',
  'public/assets/Matrix.png',
  'pwa.config.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check manifest.json
console.log('\n📋 Validating Manifest...');
try {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
  
  const requiredManifestFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
  requiredManifestFields.forEach(field => {
    if (manifest[field]) {
      console.log(`✅ ${field}: ${manifest[field]}`);
    } else {
      console.log(`❌ ${field} - MISSING`);
      allFilesExist = false;
    }
  });
  
  // Check icons
  if (manifest.icons && manifest.icons.length > 0) {
    console.log(`✅ Icons: ${manifest.icons.length} icon(s) configured`);
  } else {
    console.log(`❌ Icons - NO ICONS CONFIGURED`);
    allFilesExist = false;
  }
  
} catch (error) {
  console.log(`❌ Manifest validation failed: ${error.message}`);
  allFilesExist = false;
}

// Check service worker
console.log('\n🔧 Validating Service Worker...');
try {
  const swContent = fs.readFileSync('public/sw.js', 'utf8');
  
  if (swContent.includes('CACHE_NAME')) {
    console.log('✅ Cache name defined');
  } else {
    console.log('❌ Cache name not found');
    allFilesExist = false;
  }
  
  if (swContent.includes('install')) {
    console.log('✅ Install event handler');
  } else {
    console.log('❌ Install event handler missing');
    allFilesExist = false;
  }
  
  if (swContent.includes('fetch')) {
    console.log('✅ Fetch event handler');
  } else {
    console.log('❌ Fetch event handler missing');
    allFilesExist = false;
  }
  
} catch (error) {
  console.log(`❌ Service Worker validation failed: ${error.message}`);
  allFilesExist = false;
}

// Check HTML file
console.log('\n🌐 Validating HTML...');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  if (htmlContent.includes('manifest.json')) {
    console.log('✅ Manifest link');
  } else {
    console.log('❌ Manifest link missing');
    allFilesExist = false;
  }
  
  if (htmlContent.includes('sw.js')) {
    console.log('✅ Service Worker registration');
  } else {
    console.log('❌ Service Worker registration missing');
    allFilesExist = false;
  }
  
  if (htmlContent.includes('viewport')) {
    console.log('✅ Viewport meta tag');
  } else {
    console.log('❌ Viewport meta tag missing');
    allFilesExist = false;
  }
  
} catch (error) {
  console.log(`❌ HTML validation failed: ${error.message}`);
  allFilesExist = false;
}

// Check directory structure
console.log('\n📁 Validating Directory Structure...');
const requiredDirs = [
  'public',
  'public/assets',
  'public/icons',
  'public/fonts',
  'src',
  'src/styles',
  'src/screens',
  'src/js'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    allFilesExist = false;
  }
});

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 PWA Validation PASSED!');
  console.log('Your PWA is properly configured and ready to use.');
} else {
  console.log('⚠️  PWA Validation FAILED!');
  console.log('Please fix the issues above before deploying.');
}
console.log('='.repeat(50));

// Exit with appropriate code
process.exit(allFilesExist ? 0 : 1);
