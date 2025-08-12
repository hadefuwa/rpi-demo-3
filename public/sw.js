const CACHE_NAME = 'rpi-5inch-showcase-v2';
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

// Cache CSS files
const cssFiles = [
  '/styles/base.css',
  '/styles/home.css',
  '/styles/about.css',
  '/styles/games.css',
  '/styles/game.css',
  '/styles/memory.css',
  '/styles/pingpong.css',
  '/styles/snake.css',
  '/styles/stl.css',
  '/styles/touch.css',
  '/styles/visuals.css',
  '/styles/scroll.css',
  '/styles/settings.css',
  '/styles/info.css'
];

// Cache HTML screen files
const htmlFiles = [
  '/screens/',
  '/screens/home.html',
  '/screens/about.html',
  '/screens/games.html',
  '/screens/game.html',
  '/screens/memory.html',
  '/screens/pingpong.html',
  '/screens/snake.html',
  '/screens/stl.html',
  '/screens/touch.html',
  '/screens/visuals.html',
  '/screens/scroll.html',
  '/screens/settings.html',
  '/screens/info.html'
];

// Combine all files to cache
const allFilesToCache = [...urlsToCache, ...cssFiles, ...htmlFiles];

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
