const CACHE_NAME = 'rpi-5inch-showcase-v3';
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
  '/src/screens/game.html',
  '/src/screens/memory.html',
  '/src/screens/pingpong.html',
  '/src/screens/snake.html'
];

// Combine all files to cache
const allFilesToCache = [...urlsToCache, ...htmlFiles];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(allFilesToCache);
      })
      .catch((error) => {
        console.log('Cache addAll failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for development - always fetch fresh content
  if (event.request.url.includes('localhost') || event.request.url.includes('127.0.0.1')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Fallback to cache only if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Return offline page or fallback content
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
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
