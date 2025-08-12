/**
 * PWA Configuration for RPI 5Inch Showcase
 * This file centralizes PWA settings and can be used for build processes
 */

module.exports = {
  // App metadata
  app: {
    name: 'RPI 5Inch Showcase',
    shortName: 'RPI Showcase',
    description: 'Beautiful 5-inch Raspberry Pi showcase application',
    version: '0.2.0',
    author: 'hadefuwa',
    license: 'MIT'
  },

  // PWA settings
  pwa: {
    display: 'standalone',
    orientation: 'landscape',
    themeColor: '#000000',
    backgroundColor: '#000000',
    scope: '/',
    startUrl: '/',
    lang: 'en',
    categories: ['productivity', 'utilities']
  },

  // Icons configuration
  icons: {
    source: './public/assets/Matrix.png',
    sizes: [72, 96, 128, 144, 152, 192, 384, 512],
    purpose: ['any', 'maskable'],
    outputDir: './public/icons'
  },

  // Service Worker configuration
  sw: {
    cacheName: 'rpi-5inch-showcase-v2',
    strategies: {
      cacheFirst: [
        '/',
        '/index.html',
        '/manifest.json',
        '/sw.js',
        '/assets/Matrix.png',
        '/styles/base.css',
        '/styles/home.css'
      ],
      networkFirst: [
        '/api/',
        '/data/'
      ],
      staleWhileRevalidate: [
        '/styles/',
        '/screens/',
        '/assets/'
      ]
    }
  },

  // Build configuration
  build: {
    outputDir: './dist',
    publicDir: './public',
    srcDir: './src',
    clean: true,
    minify: true,
    sourceMap: false
  },

  // Development server
  dev: {
    port: 3000,
    host: 'localhost',
    open: true,
    cors: true,
    https: false
  },

  // Kiosk mode settings
  kiosk: {
    browser: 'chromium-browser',
    flags: [
      '--kiosk',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-translate',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-ipc-flooding-protection',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer'
    ]
  }
};
