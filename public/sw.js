// Version-based cache naming for better invalidation
const CACHE_VERSION = 'v5';
const CACHE_NAME = `rpi-5inch-showcase-${CACHE_VERSION}`;

// Core files that must be cached for offline support
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/assets/Matrix.png',
  '/assets/cad1.stl',
  '/assets/cad2.stl',
  '/assets/cad3.stl'
];

// Cache HTML screen files (corrected paths - they're in /public/screens/, not /src/screens/)
const htmlFiles = [
  '/screens/touch.html',
  '/screens/info.html',
  '/screens/games.html',
  '/screens/scroll.html',
  '/screens/visuals.html',
  '/screens/stl.html',
  '/screens/glb.html',
  '/screens/glb-simple.html',
  '/screens/settings.html',
  '/screens/about.html',
  '/screens/tictac.html',
  '/screens/memory.html',
  '/screens/pingpong.html',
  '/screens/snake.html'
];

// CSS and JS files that need to be cached
const assetFiles = [
  '/styles/base.css',
  '/styles/stl.css',
  '/js/three/three.standalone.js',
  '/js/three/GLTFLoader.js',
  '/js/three/STLLoader.js',
  '/js/three/OrbitControls.js'
];

// Combine all files to cache
const allFilesToCache = [...urlsToCache, ...htmlFiles, ...assetFiles];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...', CACHE_NAME);
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        // Try to cache files, but don't fail if offline
        // Cache files one by one to handle failures gracefully
        return Promise.allSettled(
          allFilesToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(error => {
                console.log(`Failed to cache ${url}, will try later:`, error);
                // Don't throw - allow other files to cache
                return Promise.resolve();
              });
          })
        );
      })
      .then(() => {
        console.log('Service Worker installed successfully');
      })
      .catch((error) => {
        console.log('Cache setup failed (may be offline):', error);
        // Still activate the service worker even if caching fails
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (external APIs, CDNs, etc.)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Service worker file - try network first, then cache
  if (url.pathname === '/sw.js') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // CACHE-FIRST strategy for all local resources (critical for offline support)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached version, use it immediately (works offline!)
        if (cachedResponse) {
          console.log('✅ Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // If not in cache, try to fetch from network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses for local resources
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('💾 Cached:', event.request.url);
              });
            }
            return response;
          })
          .catch((error) => {
            console.log('❌ Network failed for:', event.request.url);
            // Network failed - if it's a document request, try to return index.html
            if (event.request.destination === 'document' || 
                event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html').then((indexResponse) => {
                if (indexResponse) {
                  console.log('📄 Serving index.html as fallback');
                  return indexResponse;
                }
                // Last resort: return a basic offline page
                return new Response(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Offline - RPI Showcase</title>
                    <style>
                      body { 
                        font-family: Arial, sans-serif; 
                        background: #000; 
                        color: #fff; 
                        text-align: center; 
                        padding: 50px; 
                      }
                    </style>
                  </head>
                  <body>
                    <h1>You're offline</h1>
                    <p>The app is loading from cache. Some features may be limited.</p>
                    <p>Please visit the app once while online to cache all resources.</p>
                  </body>
                  </html>
                `, {
                  headers: { 'Content-Type': 'text/html' }
                });
              });
            }
            // For non-document requests (CSS, JS, images), return null/error
            // The browser will handle the error gracefully
            console.log('⚠️ Resource not available offline:', event.request.url);
            return new Response('Resource not available offline', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...', CACHE_NAME);
  // Claim all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Clear all existing caches if this is a major version update
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('rpi-5inch-showcase') && !cacheName.includes(CACHE_VERSION)) {
              console.log('Deleting outdated cache version:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Performing background sync...');
  return Promise.resolve();
}
