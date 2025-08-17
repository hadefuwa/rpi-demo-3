// Version-based cache naming for better invalidation
const CACHE_VERSION = 'v4';
const CACHE_NAME = `rpi-5inch-showcase-${CACHE_VERSION}`;

// Add timestamp to force cache invalidation
const CACHE_TIMESTAMP = Date.now();

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/assets/Matrix.png',
  '/assets/fonts/',
  '/assets/cad1.stl',
  '/assets/cad2.stl',
  '/assets/cad3.stl'
];

// Cache HTML screen files (new architecture)
const htmlFiles = [
  '/src/screens/touch.html',
  '/src/screens/info.html',
  '/src/screens/games.html',
  '/src/screens/scroll.html',
  '/src/screens/visuals.html',
  '/src/screens/stl.html',
  '/src/screens/settings.html',
  '/src/screens/about.html',
  '/src/screens/tictac.html',
  '/src/screens/memory.html',
  '/src/screens/pingpong.html',
  '/src/screens/snake.html'
];

// Combine all files to cache
const allFilesToCache = [...urlsToCache, ...htmlFiles];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...', CACHE_NAME);
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        // Add timestamp to force fresh content
        const timestampedFiles = allFilesToCache.map(url => 
          url.includes('?') ? `${url}&t=${CACHE_TIMESTAMP}` : `${url}?t=${CACHE_TIMESTAMP}`
        );
        return cache.addAll(timestampedFiles);
      })
      .catch((error) => {
        console.log('Cache addAll failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first strategy for the main document to prevent CSS loading delays
  if (event.request.destination === 'document' || 
      url.pathname === '/' || 
      url.pathname === '/index.html') {
    
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version immediately for faster loading
            return cachedResponse;
          }
          
          // If not in cache, fetch from network
          return fetch(event.request)
            .then((response) => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              }
              return response;
            })
            .catch(() => {
              // Network failed and no cache - return a basic offline page
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Offline</title>
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
                  <p>Please check your internet connection and try again.</p>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            });
        })
    );
    return;
  }
  
  // Service worker updates should always fetch fresh
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
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
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
