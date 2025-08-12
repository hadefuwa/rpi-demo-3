#!/usr/bin/env node

/**
 * Embedded Architecture Compliance Testing Script
 * Tests all mini apps for proper functionality and compliance
 */

const fs = require('fs');
const path = require('path');

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: {}
};

// Apps to test
const apps = [
  'home',
  'snake', 
  'game',
  'pingpong',
  'memory',
  'touch',
  'info'
];

console.log('🧪 Starting Embedded Architecture Compliance Testing...\n');

// Test 1: File Structure Validation
console.log('📁 Testing File Structure...');
testFileStructure();

// Test 2: HTML Validation
console.log('\n🔍 Testing HTML Structure...');
testHTMLStructure();

// Test 3: CSS Validation
console.log('\n🎨 Testing CSS Compliance...');
testCSSCompliance();

// Test 4: JavaScript Validation
console.log('\n⚡ Testing JavaScript Compliance...');
testJavaScriptCompliance();

// Test 5: Lifecycle Management
console.log('\n🔄 Testing Lifecycle Management...');
testLifecycleManagement();

// Test 6: Style Scoping
console.log('\n🎯 Testing Style Scoping...');
testStyleScoping();

// Test 7: IIFE Pattern
console.log('\n🔒 Testing JavaScript Isolation...');
testJavaScriptIsolation();

// Test 8: Home Button Integration
console.log('\n🏠 Testing Home Button Integration...');
testHomeButtonIntegration();

// Print final results
printResults();

function testFileStructure() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  if (!fs.existsSync(screensDir)) {
    addResult('File Structure', false, 'Screens directory not found');
    return;
  }
  
  let allFilesExist = true;
  const missingFiles = [];
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(`${app}.html`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    addResult('File Structure', true, 'All app files exist');
  } else {
    addResult('File Structure', false, `Missing files: ${missingFiles.join(', ')}`);
  }
}

function testHTMLStructure() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for proper section structure
    const hasSection = content.includes(`<section id="screen-${app}"`);
    const hasStyle = content.includes('<style>');
    const hasScript = content.includes('<script>');
    const hasProperClosing = content.includes('</section>') && content.includes('</style>') && content.includes('</script>');
    
    if (hasSection && hasStyle && hasScript && hasProperClosing) {
      addResult(`HTML Structure - ${app}`, true, 'Proper HTML structure');
    } else {
      addResult(`HTML Structure - ${app}`, false, 'Missing required HTML elements');
    }
  });
}

function testCSSCompliance() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract CSS content
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
      addResult(`CSS Compliance - ${app}`, false, 'No style tag found');
      return;
    }
    
    const css = styleMatch[1];
    
    // Check for proper scoping
    const hasScopedSelectors = css.includes(`#screen-${app}`);
    const hasResponsiveDesign = css.includes('@media');
    const hasProperFormatting = css.trim().length > 0;
    
    if (hasScopedSelectors && hasProperFormatting) {
      addResult(`CSS Compliance - ${app}`, true, 'Properly scoped CSS');
    } else {
      addResult(`CSS Compliance - ${app}`, false, 'CSS not properly scoped or formatted');
    }
  });
}

function testJavaScriptCompliance() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract JavaScript content
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch) {
      addResult(`JavaScript Compliance - ${app}`, false, 'No script tag found');
      return;
    }
    
    const js = scriptMatch[1];
    
    // Check for IIFE pattern
    const hasIIFE = js.includes('(function() {') && js.includes('})();');
    const hasStrictMode = js.includes("'use strict';");
    const hasLifecycle = js.includes('window.appLifecycle');
    const hasInitFunction = js.includes('initApp') || js.includes('init') || js.includes('function init');
    
    if (hasIIFE && hasStrictMode && hasLifecycle && hasInitFunction) {
      addResult(`JavaScript Compliance - ${app}`, true, 'Proper JavaScript structure');
    } else {
      addResult(`JavaScript Compliance - ${app}`, false, 'JavaScript not properly structured');
    }
  });
}

function testLifecycleManagement() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for lifecycle methods
    const hasActivate = content.includes('activate: function');
    const hasDeactivate = content.includes('deactivate: function');
    const hasCleanup = content.includes('cleanup: function');
    const hasProperExport = content.includes('window.appLifecycle = {');
    
    if (hasActivate && hasDeactivate && hasCleanup && hasProperExport) {
      addResult(`Lifecycle Management - ${app}`, true, 'All lifecycle methods present');
    } else {
      addResult(`Lifecycle Management - ${app}`, false, 'Missing lifecycle methods');
    }
  });
}

function testStyleScoping() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract CSS content
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
      addResult(`Style Scoping - ${app}`, false, 'No style tag found');
      return;
    }
    
    const css = styleMatch[1];
    
    // Check that all selectors are properly scoped
    const cssLines = css.split('\n');
    let allScoped = true;
    let unscopedSelectors = [];
    
    cssLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('@') && trimmed.includes('{')) {
        // This looks like a CSS rule
        const selectorMatch = trimmed.match(/^([^{]+){/);
        if (selectorMatch) {
          const selector = selectorMatch[1].trim();
          if (selector && !selector.includes(`#screen-${app}`) && !selector.startsWith('@')) {
            allScoped = false;
            unscopedSelectors.push(selector);
          }
        }
      }
    });
    
    if (allScoped) {
      addResult(`Style Scoping - ${app}`, true, 'All styles properly scoped');
    } else {
      addResult(`Style Scoping - ${app}`, false, `Unscoped selectors: ${unscopedSelectors.slice(0, 3).join(', ')}`);
    }
  });
}

function testJavaScriptIsolation() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract JavaScript content
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch) {
      addResult(`JavaScript Isolation - ${app}`, false, 'No script tag found');
      return;
    }
    
    const js = scriptMatch[1];
    
    // Check for proper isolation patterns
    const hasIIFE = js.includes('(function() {') && js.includes('})();');
    const hasStrictMode = js.includes("'use strict';");
    const noGlobalVars = !js.includes('var ') || js.includes('var ') && js.includes('(function() {');
    const hasLocalScope = js.includes('let ') || js.includes('const ') || js.includes('var ');
    
    if (hasIIFE && hasStrictMode && hasLocalScope) {
      addResult(`JavaScript Isolation - ${app}`, true, 'Proper JavaScript isolation');
    } else {
      addResult(`JavaScript Isolation - ${app}`, false, 'JavaScript not properly isolated');
    }
  });
}

function testHomeButtonIntegration() {
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  
  apps.forEach(app => {
    if (app === 'home') return; // Skip home app
    
    const filePath = path.join(screensDir, `${app}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for home button and navigation
    const hasHomeButton = content.includes('btnHome') || content.includes('Home');
    const hasGoHomeFunction = content.includes('goHome') || content.includes('showcaseFramework.goHome');
    const hasNavigation = content.includes('showcaseFramework');
    
    if (hasHomeButton && hasGoHomeFunction && hasNavigation) {
      addResult(`Home Button Integration - ${app}`, true, 'Proper home navigation');
    } else {
      addResult(`Home Button Integration - ${app}`, false, 'Missing home navigation');
    }
  });
}

function addResult(testName, passed, message) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`  ✅ ${testName}: ${message}`);
  } else {
    testResults.failed++;
    console.log(`  ❌ ${testName}: ${message}`);
  }
  
  if (!testResults.details[testName]) {
    testResults.details[testName] = [];
  }
  testResults.details[testName].push({ passed, message });
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your app is 100% compliant!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
  
  console.log('\n' + '='.repeat(60));
}
